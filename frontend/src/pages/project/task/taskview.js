import React, { useState, useContext, useEffect, useRef } from "react";
import { Box, Typography, OutlinedInput, Dialog, TextField, TableBody, Checkbox, TextareaAutosize, FormControlLabel, TableRow, TableCell, Select, MenuItem, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import { SERVICE } from '../../../services/Baseservice';
import { handleApiError } from "../../../components/Errorhandling";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import TabPanel from '@mui/lab/TabPanel';
import Tab from "@material-ui/core/Tab";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import Selects from "react-select";
import { FaPlus, FaTrash } from "react-icons/fa";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useReactToPrint } from "react-to-print";
import moment from 'moment-timezone';
import { UserRoleAccessContext, AuthContext } from '../../../context/Appcontext';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from 'react-loader-spinner';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import pdfIcon from "../../../components/Assets/pdf-icon.png";
import wordIcon from "../../../components/Assets/word-icon.png";
import excelIcon from "../../../components/Assets/excel-icon.png";
import csvIcon from "../../../components/Assets/CSV.png";
import { makeStyles } from "@material-ui/core";
import fileIcon from "../../../components/Assets/file-icons.png";
import { useParams } from "react-router-dom";


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

function Taskview() {

    const [taskassignBoard, setTaskAssignBoard] = useState([]);
    const [taskreferencepage, setTaskreferencepage] = useState([]);
    const [refCode, setRefCode] = useState("")
    const [refDocuments, setrefDocuments] = useState([])
    const [refImage, setRefImage] = useState([])
    const [value, setValue] = useState('1');
    const classes = useStyles();
    const [refDetails, setRefDetails] = useState("")
    const [refLinks, setRefLinks] = useState("")












    const id = useParams().id;
    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    //tab context create
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };





    //id for login...
    let loginid = localStorage.LoginUserId;
    let authToken = localStorage.APIToken;
    //get single row to edit Page
    const getCode = async () => {
        try {
            let res = await axios.get(`${SERVICE.TASKASSIGNBOARDLIST_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            setTaskAssignBoard(res?.data?.staskAssignBoardList);
            setTaskreferencepage(res?.data?.staskAssignBoardList?.subComReq[0]);
            setRefCode(res?.data?.staskAssignBoardList?.subComReq[0])
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };



    useEffect(() => {
        getCode();
        setRefImage(refCode?.subrefImage)
        setrefDocuments(refCode?.subrefDocuments)
    }, [getCode])





    //first allexcel....
    const getFileIcon = (fileName) => {
        const extension1 = fileName?.split(".").pop();
        switch (extension1) {
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
    //first deletefile
    const handleDeleteFileDocument = (index) => {
        const newSelectedFiles = [...refDocuments];
        newSelectedFiles.splice(index, 1);
        setrefDocuments(newSelectedFiles);
    };

    //first deletefile
    const handleDeleteFile = (index) => {
        const newSelectedFiles = [...refImage];
        newSelectedFiles.splice(index, 1);
        setRefImage(newSelectedFiles);
    };

    //reference Links
    const handleChangeSummary = (value) => {
        setRefLinks(value);
    };

    //reference documents
    const handleInputChangedocument = (event) => {
        const files = event.target.files;
        let newSelectedFiles = [...refDocuments];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            // Check if the file is an documents
            if (file.type.startsWith('image/')) {

                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                        <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Only Accept Documents!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else {
                const reader = new FileReader();
                reader.onload = () => {
                    newSelectedFiles.push({
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        preview: reader.result,
                        base64: reader.result.split(",")[1],
                    });
                    setrefDocuments(newSelectedFiles);
                };
                reader.readAsDataURL(file);


            }
        }
    };

    //first allexcel....
    const getFileIconDocument = (fileName) => {
        const extension1 = fileName?.split(".").pop();
        switch (extension1) {
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

    //reference images 
    const handleInputChange = (event) => {
        const files = event.target.files;
        let newSelectedFiles = [...refImage];
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
                        // index: indexData
                    });
                    setRefImage(newSelectedFiles);
                    //   setEditedTodoFiles(newSelectedFiles);
                };
                reader.readAsDataURL(file);
            }
            else {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                        <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Only Accept Images!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
        }

    };





    return (
        <Box sx={{ padding: "30px" }} >
            <Headtitle title={'TASK VIEW'} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText} >View Task Details</Typography>

            <Box sx={userStyle.container}>

                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        {/* <Typography sx={userStyle.SubHeaderText}><b>  </b></Typography> */}
                    </Grid>
                </Grid>
                <br />

                <Grid container spacing={2} >
                    <Grid item md={3} xs={12} sm={12}>
                        <Typography>Project <b style={{ color: "red" }}>*</b></Typography>
                        <FormControl size="small" fullWidth>
                            <TextField
                                // options={projectEdit}
                                value={taskassignBoard.project}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                        <Typography>Sub Project <b style={{ color: "red" }}>*</b></Typography>
                        <FormControl size="small" fullWidth>
                            <TextField
                                // options={projectEdit}
                                value={taskassignBoard.subproject}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                        <Typography>Module <b style={{ color: "red" }}>*</b></Typography>
                        <FormControl size="small" fullWidth>
                            <TextField
                                // options={projectEdit}
                                value={taskassignBoard.module}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                        <Typography>Sub Module <b style={{ color: "red" }}>*</b></Typography>
                        <FormControl size="small" fullWidth>
                            <TextField
                                // options={projectEdit}
                                value={taskassignBoard.submodule}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                        <Typography>Main Page <b style={{ color: "red" }}>*</b></Typography>
                        <FormControl size="small" fullWidth>
                            <TextField
                                // options={projectEdit}
                                value={taskassignBoard.mainpage}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                        <Typography>SubPage <b style={{ color: "red" }}>*</b></Typography>
                        <FormControl size="small" fullWidth>
                            <TextField
                                // options={projectEdit}
                                value={taskassignBoard.subpage}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                        <Typography>Task Name <b style={{ color: "red" }}>*</b></Typography>
                        <FormControl size="small" fullWidth>
                            <TextField
                                inputProps={{
                                    readOnly: true
                                }}
                            // options={projectEdit}
                            // value={selectedOptProjectEdit.value}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                        <Typography>Component Name <b style={{ color: "red" }}>*</b></Typography>
                        <FormControl size="small" fullWidth>
                            <TextField
                                // options={projectEdit}
                                value={taskassignBoard.component}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                        <Typography>Subcomponent Name <b style={{ color: "red" }}>*</b></Typography>
                        <FormControl size="small" fullWidth>
                            <TextField
                                // options={projectEdit}
                                value={taskassignBoard.subcomponent}
                            />
                        </FormControl>
                    </Grid>

                    <Grid container spacing={2} >

                        {/* <Grid item md={1} xs={12} sm={12}></Grid> */}
                        <Grid item md={10} xs={12} sm={12}>
                            <br /> <br />
                            <Typography> References </Typography>
                            <Box container spacing={2}>
                                <div style={{ overflow: "auto" }}>
                                    <TabContext value={value} >
                                        <Box style={{
                                            borderBottom: 1, borderColor: 'divider',
                                            borderRadius: '4px',
                                            boxShadow: '0px 0px 4px #b7b1b1',
                                            border: '1px solid #c3c3c3',
                                            overflow: 'hidden',
                                            marginBottom: '0px',
                                            boxSizing: 'border-box',

                                        }}
                                        // MenuProps={{
                                        //     PaperProps: {
                                        //       style: {
                                        //         maxHeight: 180,
                                        //         width: 80,
                                        //       },
                                        //     },
                                        //   }}
                                        >
                                            <TabList
                                                onChange={handleChange}
                                                aria-label="lab API tabs example" sx={{
                                                    backgroundColor: '#f5f5f5', borderRadius: '4px',
                                                    '.MuiTab-textColorPrimary.Mui-selected': {
                                                        color: 'white',
                                                        border: '1px solid #b5afaf',
                                                        borderBottom: 'none',
                                                        background: ' #3346569c'
                                                    },
                                                    '.css-1aquho2-MuiTabs-indicator': {
                                                        background: 'none',
                                                    },
                                                    // overflow: 'auto',

                                                }}>
                                                <Tab label="Code" value="1"
                                                    sx={userStyle.tablelistStyle}

                                                // }}  
                                                />


                                                <Tab label="Images" value="2" sx={userStyle.tablelistStyle} />

                                                <Tab label="Documents" value="3" sx={userStyle.tablelistStyle} />
                                                <Tab label="Links" value="4" sx={userStyle.tablelistStyle} />
                                                <Tab label="Details" value="5" sx={userStyle.tablelistStyle} />
                                            </TabList>
                                        </Box>
                                        <TabPanel value="1" index={0} style={{ overflow: 'auto' }} sx={userStyle.tabpanelstyle}>
                                            <FormControl fullWidth size="small">
                                                <TextareaAutosize
                                                    aria-label="minimum height"
                                                    minRows={5}
                                                    value={refCode.refcode}
                                                    onChange={(e) => {
                                                        setRefCode(e.target.value)
                                                    }}
                                                />
                                            </FormControl>
                                            {/* </Grid> */}

                                        </TabPanel>
                                        <TabPanel value="2" index={1} sx={userStyle.tabpanelstyle}>
                                            <input
                                                className={classes.inputs}
                                                type="file"
                                                id="file-inputuploadcreatefirst"
                                                multiple
                                                onChange={handleInputChange}
                                            />
                                            <label htmlFor="file-inputuploadcreatefirst">
                                                {/* <Button component="span" style={{
                                                    backgroundColor: '#f4f4f4',
                                                    color: '#444',
                                                    minWidth: '40px',
                                                    boxShadow: 'none',
                                                    borderRadius: '5px',
                                                    marginTop: '-5px',
                                                    textTransform: 'capitalize',
                                                    border: '1px solid #0000006b',
                                                    '&:hover': {
                                                        '& .css-bluauu-MuiButtonBase-root-MuiButton-root': {
                                                            backgroundColor: '#f4f4f4',
                                                        },
                                                    },
                                                }}>
                                                    Upload IMAGES &ensp; <CloudUploadIcon />

                                                </Button><br></br> */}
                                            </label>
                                            <Grid container>
                                                <Grid item md={12} sm={12} xs={12}>
                                                    {refImage?.map((file, index) => (
                                                        <>
                                                            <Grid container>
                                                                <Grid item md={2} sm={2} xs={2}>
                                                                    <Box
                                                                        style={{
                                                                            display: "flex",
                                                                            justifyContent: "center",
                                                                            alignItems: 'center'
                                                                        }}
                                                                    >
                                                                        {file.type.includes("image/") ? (
                                                                            <img
                                                                                src={file.preview}
                                                                                alt={file.name}
                                                                                height={50}
                                                                                style={{
                                                                                    maxWidth: "-webkit-fill-available",
                                                                                }}
                                                                            />
                                                                        ) : (
                                                                            <img
                                                                                className={classes.preview}
                                                                                src={getFileIcon(file.name)}
                                                                                height="10"
                                                                                alt="file icon"
                                                                            />
                                                                        )}
                                                                    </Box>
                                                                </Grid>
                                                                <Grid item md={8} sm={8} xs={8} style={{
                                                                    display: "flex",
                                                                    justifyContent: "center",
                                                                    alignItems: "center"
                                                                }}>

                                                                    <Typography variant="subtitle2">
                                                                        {file.name}{" "}
                                                                    </Typography>

                                                                </Grid>
                                                                <Grid item md={2} sm={2} xs={2}>

                                                                    {/* <Button
                                                                        sx={{
                                                                            padding: '14px 14px', minWidth: '40px !important', borderRadius: '50% !important', ':hover': {
                                                                                backgroundColor: '#80808036', // theme.palette.primary.main

                                                                            },
                                                                        }}
                                                                        onClick={() => handleDeleteFile(index)}
                                                                    >
                                                                        <FaTrash style={{ fontSize: "medium", color: "#a73131", fontSize: "14px" }} />
                                                                    </Button> */}
                                                                </Grid>
                                                            </Grid>
                                                        </>
                                                    ))}
                                                </Grid>
                                            </Grid>
                                        </TabPanel>
                                        <TabPanel value="3" index={2} sx={userStyle.tabpanelstyle}>
                                            <input
                                                className={classes.inputs}
                                                type="file"
                                                id="file-inputuploadcreatefirst"
                                                multiple
                                                onChange={handleInputChangedocument}
                                            />
                                            <label htmlFor="file-inputuploadcreatefirst">
                                                {/* <Button component="span" style={{
                                                    backgroundColor: '#f4f4f4',
                                                    color: '#444',
                                                    minWidth: '40px',
                                                    boxShadow: 'none',
                                                    borderRadius: '5px',
                                                    marginTop: '-5px',
                                                    textTransform: 'capitalize',
                                                    border: '1px solid #0000006b',
                                                    '&:hover': {
                                                        '& .css-bluauu-MuiButtonBase-root-MuiButton-root': {
                                                            backgroundColor: '#f4f4f4',
                                                        },
                                                    },
                                                }}>
                                                    Upload Document &ensp; <CloudUploadIcon />
                                                </Button> */}
                                            </label>
                                            <Grid container>
                                                <Grid item md={12} sm={12} xs={12}>
                                                    {refDocuments?.map((file, index) => (
                                                        <>
                                                            <Grid container>
                                                                <Grid item md={2} sm={2} xs={2}>
                                                                    <Box
                                                                        style={{
                                                                            display: "flex",
                                                                            justifyContent: "center",
                                                                            alignItems: 'center'
                                                                        }}
                                                                    >
                                                                        {file.type.includes("image/") ? (
                                                                            <img
                                                                                src={file.preview}
                                                                                alt={file.name}
                                                                                height={50}
                                                                                style={{
                                                                                    maxWidth: "-webkit-fill-available",
                                                                                }}
                                                                            />
                                                                        ) : (
                                                                            <img
                                                                                className={classes.preview}
                                                                                src={getFileIconDocument(file.name)}
                                                                                height="25"
                                                                                alt="file icon"
                                                                            />
                                                                        )}
                                                                    </Box>
                                                                </Grid>
                                                                <Grid item md={8} sm={8} xs={8} style={{
                                                                    display: "flex",
                                                                    justifyContent: "center",
                                                                    alignItems: "center"
                                                                }}>

                                                                    <Typography variant="subtitle2">
                                                                        {file.name}{" "}
                                                                    </Typography>

                                                                </Grid>
                                                                <Grid item md={2} sm={2} xs={2}>

                                                                    {/* <Button
                                                                        sx={{
                                                                            padding: '14px 14px', minWidth: '40px !important', borderRadius: '50% !important', ':hover': {
                                                                                backgroundColor: '#80808036', // theme.palette.primary.main

                                                                            },
                                                                        }}
                                                                        onClick={() => handleDeleteFileDocument(index)}
                                                                    >
                                                                        <FaTrash style={{ fontSize: "medium", color: "#a73131", fontSize: "14px" }} />
                                                                    </Button> */}
                                                                </Grid>
                                                            </Grid>
                                                        </>
                                                    ))}
                                                </Grid>
                                            </Grid>

                                        </TabPanel>
                                        <TabPanel value="4" index={3} sx={userStyle.tabpanelstyle}>
                                            <ReactQuill
                                                style={{ height: "100px" }}
                                                value={refCode.refLinks}
                                                onChange={handleChangeSummary}
                                                modules={{
                                                    toolbar: [
                                                        [{ header: "1" }, { header: "2" }, { font: [] }],
                                                        [{ size: [] }],
                                                        [
                                                            "bold",
                                                            "italic",
                                                            "underline",
                                                            "strike",
                                                            "blockquote",
                                                        ],
                                                        [
                                                            { list: "ordered" },
                                                            { list: "bullet" },
                                                            { indent: "-1" },
                                                            { indent: "+1" },
                                                        ],
                                                        ["link", "image", "video"],
                                                        ["clean"],
                                                    ],
                                                }}
                                                formats={[
                                                    "header",
                                                    "font",
                                                    "size",
                                                    "bold",
                                                    "italic",
                                                    "underline",
                                                    "strike",
                                                    "blockquote",
                                                    "list",
                                                    "bullet",
                                                    "indent",
                                                    "link",
                                                    "image",
                                                    "video",
                                                ]}
                                            />
                                        </TabPanel>
                                        <TabPanel value="5" index={4} sx={userStyle.tabpanelstyle}>
                                            <FormControl fullWidth size="small">
                                                <TextareaAutosize
                                                    aria-label="minimum height"
                                                    minRows={5}
                                                    value={refCode.refDetails}
                                                    onChange={(e) => {
                                                        setRefDetails(e.target.value)
                                                    }}
                                                />
                                            </FormControl>
                                        </TabPanel>
                                    </TabContext>
                                </div>
                            </Box>
                        </Grid>
                        <Grid item md={1} xs={12} sm={12}></Grid>
                    </Grid><br /> <br /> <br /> <br /> <br />

                    <Grid container spacing={2}>

                        <Grid item xs={12}>
                            <br /> <br />
                            <Typography >Detailed Requirement </Typography>
                        </Grid><br />
                        <Grid item md={3} xs={12} sm={12}>
                            <Typography>Name </Typography>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={taskreferencepage.name}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <Typography>Data Fetch</Typography>
                            <FormControl size="small" fullWidth>
                                <TextField
                                    inputProps={{
                                        readOnly: true
                                    }}
                                    value={taskreferencepage.datafetch}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <Typography>Size-Height </Typography>
                            <FormControl size="small" fullWidth>
                                <TextField
                                    inputProps={{
                                        readOnly: true
                                    }}

                                    value={taskreferencepage.sizeheight}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <Typography>Size-Width </Typography>
                            <FormControl size="small" fullWidth>
                                <TextField
                                    inputProps={{
                                        readOnly: true
                                    }}
                                    value={taskreferencepage.sizewidth}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <Typography>Input value </Typography>
                            <FormControl size="small" fullWidth>
                                <TextareaAutosize
                                    aria-label="minimum height"
                                    minRows={5}
                                    inputProps={{
                                        readOnly: true
                                    }}
                                    value={taskreferencepage.inputvalue}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <Typography>Position </Typography>
                            <FormControl size="small" fullWidth>
                                <TextField
                                    inputProps={{
                                        readOnly: true
                                    }}
                                    value={taskreferencepage.position}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <Typography>colour</Typography>
                            <FormControl size="small" fullWidth>
                                <TextField
                                    // options={projectEdit}
                                    value={taskreferencepage.colour}
                                />
                            </FormControl>
                        </Grid>

                    </Grid>
                </Grid>
            </Box>
        </Box>
    );



}

export default Taskview;