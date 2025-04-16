import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Table, TableBody, TableContainer, MenuItem, TableRow, TableHead, TableCell, Select, DialogActions, Dialog, DialogContent, TextareaAutosize, OutlinedInput, Paper, Button, Grid, Typography, FormControl, } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { ExportXL, ExportCSV } from "../../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";
import 'jspdf-autotable'
import axios from "axios";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import { SERVICE } from '../../../services/Baseservice';
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import moment from 'moment-timezone';
import { AuthContext } from '../../../context/Appcontext';
import { UserRoleAccessContext } from '../../../context/Appcontext';
import { handleApiError } from "../../../components/Errorhandling";
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from 'react-loader-spinner';


function Taskcheckpointdefault() {
    const [taskcheckdefault, setTaskcheckdefault] = useState({
        description: "",
    });

    const [taskcheckdefaults, settaskcheckdefaults] = useState([]);
    const [taskcheckdefaultid, setTaskcheckdefaultid] = useState({ description: "" });
    const { auth } = useContext(AuthContext);
    const { isUserRoleCompare } = useContext(UserRoleAccessContext);
    const [ischeckpoint, setIsCheckpoint] = useState(false);
    const [ovProj, setOvProj] = useState("")
    const [ovProjCount, setOvProjCount] = useState("")
    const [getOverAllCount, setGetOverallCount] = useState("");
    const [allCheckdefaultedit, setAllCheckdefaultedit] = useState([]);

    const { isUserRoleAccess } = useContext(UserRoleAccessContext);

    const username = isUserRoleAccess.username;



    //datatable....
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(1);

    //error popup...
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();

    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleClose = () => {
        setIsErrorOpen(false);
    };

    // Error Popup model
    const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
    const [showAlertpop, setShowAlertpop] = useState();
    const handleClickOpenerrpop = () => {
        setIsErrorOpenpop(true);
    };
    const handleCloseerrpop = () => {
        setIsErrorOpenpop(false);
    };

    let printsno = 1;

    // view model
    const [openview, setOpenview] = useState(false);

    const handleClickOpenview = () => {
        setOpenview(true);
    };

    const handleCloseview = () => {
        setOpenview(false);
    };


    //Delete model
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };

    const handleCloseMod = () => {
        setIsDeleteOpen(false);
    };


    // info model
    const [openInfo, setOpeninfo] = useState(false);

    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };

    const handleCloseinfo = () => {
        setOpeninfo(false);
    };

    // get all taskcheckdefaultRoute
    const fetchTaskcheckdefault = async () => {
        try {
            let res_taskcheckdefault = await axios.get(
                SERVICE.TASKCHECKDEFAULT,
                {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                }
            );
            setIsCheckpoint(true);
            settaskcheckdefaults(res_taskcheckdefault?.data?.taskcheckdefault);
        } catch (err) {setIsCheckpoint(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    // get all taskcheckdefaultRoute
    const fetchTaskcheckdefaultAll = async () => {
        try {
            let res_taskcheckdefault = await axios.get(
                SERVICE.TASKCHECKDEFAULT,
                {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                }
            );
            setAllCheckdefaultedit(res_taskcheckdefault?.data?.taskcheckdefault.filter(item => item._id !== taskcheckdefaultid._id));
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    const [deletetaskcheckdefault, setDeletetaskcheckdefault] = useState({});
    const rowData = async (id) => {
        try {
            let res = await axios.get(
                `${SERVICE.TASKCHECKDEFAULT_SINGLE}/${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                }
            );
            setDeletetaskcheckdefault(res?.data?.staskcheckdefault);
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    // Alert delete popup
    let taskcheckid = deletetaskcheckdefault._id;
    const delTaskcheckdefault = async () => {
        try {
            await axios.delete(
                `${SERVICE.TASKCHECKDEFAULT_SINGLE}/${taskcheckid}`,
                {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                }
            );
            await fetchTaskcheckdefault();
            handleCloseMod();
            setShowAlert(
                <>
                  <ErrorOutlineOutlinedIcon
                    sx={{ fontSize: "100px", color: "orange" }}
                  />
                  <p style={{ fontSize: "20px", fontWeight: 900 }}>
                    {"Deleted Successfully"}
                  </p>
                </>
              );
              handleClickOpenerr();
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}

    };


    //  PDF
    const columns = [
        { title: "Description", field: "description" },
    ];

    const downloadPdf = () => {
        const doc = new jsPDF();
        doc.autoTable({
            theme: "grid",
            columns: columns.map((col) => ({ ...col, dataKey: col.field })),
            body: taskcheckdefaults,
        });
        doc.save("Taskcheckdefault.pdf");
    };

    // Excel
    const fileName = "TaskCheckDefault";

    // const [designationData, setDesignationData] = useState([]);
    const [exceldata, setExceldata] = useState([]);

    // get particular columns for export excel
    const getexcelDatas = async () => {
        try {
            let response = await axios.get(SERVICE.TASKCHECKDEFAULT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            var data = response.data.taskcheckdefault.length > 0 && response.data.taskcheckdefault.map((t, index) => ({
                Sno: index + 1,
                description: t.description,
            }));
            setExceldata(data);
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    // Print
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Taskcheckdefault",
        pageStyle: "print",
    });

    //this is add database
    const sendRequest = async () => {
        try {
            let taskcheckdefaults = await axios.post(
                SERVICE.TASKCHECKDEFAULT_CREATE,
                {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    description: String(taskcheckdefault.description),
                    addedby: [
                        {
                            name: String(username),
                            date: String(new Date()),

                        },
                    ],

                }
            );
            await fetchTaskcheckdefault();
            setTaskcheckdefault(taskcheckdefaults);
            setTaskcheckdefault({ description: "" });
            setShowAlert(
                <>
                  <ErrorOutlineOutlinedIcon
                    sx={{ fontSize: "100px", color: "orange" }}
                  />
                  <p style={{ fontSize: "20px", fontWeight: 900 }}>
                    {"Added Successfully"}
                  </p>
                </>
              );
              handleClickOpenerr();
            } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = taskcheckdefaults.some(item => item.description.toLowerCase() === (taskcheckdefault.description).toLowerCase());
        if (taskcheckdefault.description === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Description"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (isNameMatch) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Name already exits!"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            sendRequest();
        }
    };

    // Edit model
    const [isEditOpen, setIsEditOpen] = useState(false);
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setIsEditOpen(false);
    };

    //get single row to edit
    const getCode = async (e) => {
        try {
            let res = await axios.get(
                `${SERVICE.TASKCHECKDEFAULT_SINGLE}/${e}`,
                {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                }
            );
            setTaskcheckdefaultid(res?.data?.staskcheckdefault);
            setOvProj(res?.data?.staskcheckdefault?.description);
            getOverallEditSection(res?.data?.staskcheckdefault?.description);
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    // get single row to view....
    const getviewCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.TASKCHECKDEFAULT_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setTaskcheckdefaultid(res?.data?.staskcheckdefault);
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    // get single row to view....
    const getinfoCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.TASKCHECKDEFAULT_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setTaskcheckdefaultid(res?.data?.staskcheckdefault);
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };




    //Desigantion updateby edit page...
    let updateby = taskcheckdefaultid?.updatedby;
    let addedby = taskcheckdefaultid?.addedby;


    let taskchecksid = taskcheckdefaultid._id;
    //editing the single data
    const sendEditRequest = async () => {
        try {
            let res = await axios.put(
                `${SERVICE.TASKCHECKDEFAULT_SINGLE}/${taskchecksid}`,
                {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    description: String(taskcheckdefaultid.description),
                    updatedby: [
                        ...updateby, {
                            name: String(username),
                            date: String(new Date()),
                        },
                    ],

                }
            );
            await fetchTaskcheckdefault();getOverallEditSectionUpdate();
            setTaskcheckdefaultid(res.data);
            handleCloseModEdit();
            setShowAlert(
                <>
                  <ErrorOutlineOutlinedIcon
                    sx={{ fontSize: "100px", color: "orange" }}
                  />
                  <p style={{ fontSize: "20px", fontWeight: 900 }}>
                    {"Updated Successfully"}
                  </p>
                </>
              );
              handleClickOpenerr();
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const editSubmit = (e) => {
        e.preventDefault();
        fetchTaskcheckdefaultAll();
        const isNameMatch = allCheckdefaultedit.some(item => item.description.toLowerCase() === (taskcheckdefaultid.description).toLowerCase());
        if (taskcheckdefaultid.description === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Description"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (isNameMatch) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Name already exits!"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (taskcheckdefaultid.description != ovProj && ovProjCount > 0) {
            setShowAlertpop(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {getOverAllCount}
                    </p>
                </>
            );
            handleClickOpenerrpop()
        }
        else {
            sendEditRequest(e);
        }

    };


    //overall edit section for all pages 
    const getOverallEditSection = async (e) => {
        try {
            let res = await axios.post(SERVICE.OVERALL_DESCRIPTION, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                oldname: e,
            });

            setGetOverallCount(`The ${e} is linked in ${res.data.task.length > 0 ? "Task Page ," : ""}
          whether you want to do changes ..??`)
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //overall edit section for all pages 
    const getOverallEditSectionUpdate = async () => {
        try {
            let res = await axios.post(SERVICE.OVERALL_DESCRIPTION, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                oldname: ovProj,
            });
            sendEditRequestOverall(res.data.task)
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const sendEditRequestOverall = async (user) => {

        try {
            if (user.length > 0) {
                let answ = user.map((d, i) => {
                    const updatedTodos = d.checkpointsdev.map(todo => {
                        if (todo.label === ovProj
                        ) {
                            return { ...todo, label: taskcheckdefaultid.description };
                        }
                    });
                    let res = axios.put(`${SERVICE.TASK_SINGLE}/${d._id}`, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        checkpointsdev: updatedTodos

                    });

                })

            }
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    useEffect(() => {
        getexcelDatas();
    }, [taskcheckdefaults]);

    useEffect(() => {
        fetchTaskcheckdefault();
        fetchTaskcheckdefaultAll();
    }, []);

    useEffect(() => {
        fetchTaskcheckdefaultAll();
    }, [isEditOpen, taskcheckdefaultid]);

    const [items, setItems] = useState([]);

    const addSerialNumber = () => {
        const itemsWithSerialNumber = taskcheckdefaults?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    }

    useEffect(() => {
        addSerialNumber();
    }, [taskcheckdefaults])


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
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(1);
    };
    const filteredDatas = items.filter((item) =>
        Object.values(item).some((value) =>
            value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

    const totalPages = Math.ceil(filteredDatas.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

    const pageNumbers = [];

    const indexOfLastItem = page * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }




    return (
        <Box>
            <Headtitle title={'TASK DEFAULT CHECKPOINTS'} />
            <Typography sx={userStyle.HeaderText}>  Task Default Checkpoints </Typography>

            <Box sx={userStyle.selectcontainer}>
                <Typography sx={userStyle.SubHeaderText}>Create Task Default Checkpoints</Typography><br /><br />
                <Grid container spacing={4}>
                    <Grid item md={6} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                            <Typography>Description</Typography>
                            <TextareaAutosize
                                aria-label="maximum height"
                                minRows={5}
                                style={{ width: "100%" }}
                                value={taskcheckdefault.description}
                                onChange={(e) => {
                                    setTaskcheckdefault({
                                        ...taskcheckdefault,
                                        description: e.target.value,
                                    });
                                }}
                            />
                        </FormControl>
                    </Grid>
                    <br />
                </Grid>
                <br /> <br />

                <Grid container>
                    {isUserRoleCompare[0]?.ctaskdefault && (
                        <>
                            <Button variant="contained" color="primary" onClick={handleSubmit}>
                                Create New
                            </Button>
                        </>
                    )}

                </Grid>
            </Box>
            <br />

            <Box>
                {/* ALERT DIALOG */}
                <Dialog
                    open={isEditOpen}
                    onClose={handleCloseModEdit}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="md"
                >
                    <DialogContent sx={{ width: "550px", padding: '20px' }}>
                        <Box >
                            <>
                                <Typography sx={userStyle.HeaderText}>
                                    Edit Task Default Checkpoints
                                </Typography>
                                <br /> <br />
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Description</Typography>
                                            <TextareaAutosize
                                                aria-label="maximum height"
                                                minRows={5}
                                                style={{ width: "100%" }}
                                                value={taskcheckdefaultid.description}
                                                onChange={(e) => {
                                                    setTaskcheckdefaultid({
                                                        ...taskcheckdefaultid,
                                                        description: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item lg={4} md={4} xs={12} sm={12}>
                                        <Button variant="contained" onClick={editSubmit}>
                                            Update
                                        </Button>
                                    </Grid>
                                    <Grid item lg={4} md={4} xs={12} sm={12}>
                                        <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
                                            Cancel
                                        </Button>
                                    </Grid>
                                </Grid>
                            </>
                        </Box>
                    </DialogContent>
                </Dialog>
            </Box>
            <br />
            {/* header text */}
            {/* content start */}
            {isUserRoleCompare[0]?.ltaskdefault && (
                <>
                    <Box sx={userStyle.container}>
                        <Typography sx={userStyle.HeaderText}>Task Default List</Typography>
                        <br></br>
                        {/* ****** Header Buttons ****** */}
                        {ischeckpoint ? <>
                            <Grid container sx={{ justifyContent: "center" }}>
                                <Grid>
                                    {isUserRoleCompare[0]?.exceltaskdefault && (
                                        <>
                                            <ExportXL csvData={exceldata} fileName={fileName} />
                                        </>
                                    )}
                                    {isUserRoleCompare[0]?.csvtaskdefault && (
                                        <>
                                            <ExportCSV csvData={exceldata} fileName={fileName} />
                                        </>
                                    )}
                                    {isUserRoleCompare[0]?.printtaskdefault && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare[0]?.pdftaskdefault && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}>
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}
                                </Grid>
                            </Grid>
                            <br /><br />
                            {/* ****** Table Grid Container ****** */}

                            <Grid style={userStyle.dataTablestyle}>
                                <Box>
                                    <label >Show entries:</label>
                                    <Select id="pageSizeSelect" value={pageSize} onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        <MenuItem value={(taskcheckdefaults.length)}>All</MenuItem>
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
                            <br /><br />


                            <Box>
                                <TableContainer component={Paper}>
                                    <Table
                                        sx={{ minWidth: 700 }}
                                        aria-label="customized table"
                                        id="usertable"

                                    >
                                        <TableHead sx={{ fontWeight: "600" }}>
                                            <StyledTableRow>
                                                <StyledTableCell onClick={() => handleSorting('serialNumber')}><Box sx={userStyle.tableheadstyle}><Box>SNo</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('serialNumber')}</Box></Box></StyledTableCell>
                                                <StyledTableCell onClick={() => handleSorting('description')}><Box sx={userStyle.tableheadstyle}><Box>Description</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('description')}</Box></Box></StyledTableCell>
                                                <StyledTableCell>Action</StyledTableCell>
                                            </StyledTableRow>
                                        </TableHead>
                                        <TableBody align="left">
                                            {filteredData.length > 0 ? (
                                                filteredData?.map((row, index) => (
                                                    <StyledTableRow key={index}>
                                                        <StyledTableCell>{row.serialNumber}</StyledTableCell>
                                                        <StyledTableCell>{row.description}</StyledTableCell>
                                                        <StyledTableCell component="th" scope="row" colSpan={1}>
                                                            <Grid sx={{ display: "flex" }}>
                                                                {isUserRoleCompare[0]?.etaskdefault && (
                                                                    <>
                                                                        <Button
                                                                            sx={userStyle.buttonedit}
                                                                            onClick={() => {
                                                                                handleClickOpenEdit();
                                                                                getCode(row._id);
                                                                            }}
                                                                        >
                                                                            <EditOutlinedIcon style={{ fontsize: "large" }} />
                                                                        </Button>
                                                                    </>
                                                                )}
                                                                {isUserRoleCompare[0]?.dtaskdefault && (
                                                                    <>
                                                                        <Button
                                                                            sx={userStyle.buttondelete}
                                                                            onClick={(e) => {
                                                                                handleClickOpen();
                                                                                rowData(row._id);
                                                                            }}
                                                                        >
                                                                            <DeleteOutlineOutlinedIcon
                                                                                style={{ fontSize: "large" }}
                                                                            />
                                                                        </Button>
                                                                    </>
                                                                )}
                                                                {isUserRoleCompare[0]?.vtaskdefault && (
                                                                    <>
                                                                        <Button
                                                                            sx={userStyle.buttonedit}
                                                                            onClick={() => {
                                                                                handleClickOpenview();
                                                                                getviewCode(row._id);
                                                                            }}
                                                                        >
                                                                            <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
                                                                        </Button>
                                                                    </>
                                                                )}
                                                                {isUserRoleCompare[0]?.itaskdefault && (
                                                                    <>
                                                                        <Button
                                                                            sx={userStyle.buttonedit}
                                                                            onClick={() => {
                                                                                handleClickOpeninfo();
                                                                                getinfoCode(row._id);
                                                                            }}
                                                                        >
                                                                            <InfoOutlinedIcon style={{ fontsize: "large" }} />
                                                                        </Button>
                                                                    </>
                                                                )}

                                                            </Grid>
                                                        </StyledTableCell>
                                                    </StyledTableRow>
                                                ))) : <StyledTableRow> <StyledTableCell colSpan={5} align="center">No Data Available</StyledTableCell> </StyledTableRow>}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <Box style={userStyle.dataTablestyle}>
                                    <Box>
                                        Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, taskcheckdefaults?.length)} of {taskcheckdefaults?.length} entries
                                    </Box>
                                    <Box>
                                        <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={{ textTransform: 'capitalize', color: 'black' }}>
                                            Prev
                                        </Button>
                                        {pageNumbers?.map((pageNumber) => (
                                            <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={((page)) === pageNumber ? 'active' : ''} disabled={page === pageNumber}>
                                                {pageNumber}
                                            </Button>
                                        ))}
                                        {lastVisiblePage < totalPages && <span>...</span>}
                                        <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={{ textTransform: 'capitalize', color: 'black' }}>
                                            Next
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        </> : <>
                            <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '350px' }}>
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
                        </>}

                    </Box>
                </>
            )}

            {/* content end */}
            {/* ALERT DIALOG */}
            <Dialog
                open={isDeleteOpen}
                onClose={handleCloseMod}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent
                    sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                >
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "80px", color: "orange" }}
                    />
                    <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                        Are you sure?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseMod} variant="outlined">
                        Cancel
                    </Button>
                    <Button
                        autoFocus
                        variant="contained"
                        color="error"
                        onClick={(e) => delTaskcheckdefault(taskcheckdefaultid)}
                    >
                        {" "}
                        OK{" "}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* view model */}
            <Dialog
                open={openview}
                onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <Box sx={{ width: "450px", padding: '20px 50px' }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Task Default Checkpoints</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={12} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Description</Typography>
                                    <Typography>{taskcheckdefaultid.description}</Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br />  <br />
                        <Grid container spacing={2}>
                            <Button variant="contained" color="primary" onClick={handleCloseview}> Back </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>


            {/* this is info view details */}

            <Dialog
                open={openInfo}
                onClose={handleCloseinfo}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
            >
                <Box sx={{ width: "550px", padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>
                            {" "}
                            Task Default Checkpoints Info
                        </Typography>
                        <br />
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">addedby</Typography>
                                    <br />
                                    <Table>
                                        <TableHead>
                                            <StyledTableCell sx={{ padding: '5px 10px !important' }}>{"SNO"}.</StyledTableCell>
                                            <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"UserName"}</StyledTableCell>
                                            <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"Date"}</StyledTableCell>
                                        </TableHead>
                                        <TableBody>
                                            {addedby?.map((item, i) => (
                                                <StyledTableRow>
                                                    <StyledTableCell sx={{ padding: '5px 10px !important' }}>{i + 1}.</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: '5px 10px !important' }}> {item.name}</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: '5px 10px !important' }}> {moment(item.date).format('DD-MM-YYYY hh:mm:ss a')}</StyledTableCell>
                                                </StyledTableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </FormControl>
                            </Grid>
                            <br />
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Updated by</Typography>
                                    <br />
                                    <Table>
                                        <TableHead>
                                            <StyledTableCell sx={{ padding: '5px 10px !important' }}>{"SNO"}.</StyledTableCell>
                                            <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"UserName"}</StyledTableCell>
                                            <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"Date"}</StyledTableCell>
                                        </TableHead>
                                        <TableBody>
                                            {updateby?.map((item, i) => (
                                                <StyledTableRow>
                                                    <StyledTableCell sx={{ padding: '5px 10px !important' }}>{i + 1}.</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: '5px 10px !important' }}> {item.name}</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: '5px 10px !important' }}> {moment(item.date).format('DD-MM-YYYY hh:mm:ss a')}</StyledTableCell>
                                                </StyledTableRow>
                                            ))}
                                        </TableBody>
                                    </Table>

                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br />
                        <br />
                        <Grid container spacing={2}>
                            <Button variant="contained" onClick={handleCloseinfo}>
                                {" "}
                                Back{" "}
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>

            {/* ALERT DIALOG */}
            <Dialog
                open={isErrorOpen}
                onClose={handleClose}
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
                    <Button variant="contained" color="error" onClick={handleClose}>
                        ok
                    </Button>
                </DialogActions>
            </Dialog>

            {/* print layout */}

            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table
                    sx={{ minWidth: 700 }}
                    aria-label="customized table"
                    id="usertable"
                    ref={componentRef}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>S.No</TableCell>
                            <TableCell>Description</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody align="left">
                        {taskcheckdefaults &&
                            taskcheckdefaults.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{printsno++}</TableCell>
                                    <TableCell>{row.description}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
export default Taskcheckpointdefault;