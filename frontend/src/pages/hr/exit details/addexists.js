import React, { useState, useContext, useEffect, useRef } from "react";
import { Box, Typography, OutlinedInput, Dialog, TextField, TextareaAutosize, Select, MenuItem, FormControl, Grid, Button } from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import { SERVICE } from '../../../services/Baseservice';
import axios from "axios";
import Selects from "react-select";
import { FaPlus, FaTrash } from "react-icons/fa";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { UserRoleAccessContext, AuthContext } from '../../../context/Appcontext';
import Headtitle from "../../../components/Headtitle";
import { handleApiError } from "../../../components/Errorhandling";
import pdfIcon from "../../../components/Assets/pdf-icon.png";
import wordIcon from "../../../components/Assets/word-icon.png";
import excelIcon from "../../../components/Assets/excel-icon.png";
import csvIcon from "../../../components/Assets/CSV.png";
import { makeStyles } from "@material-ui/core";
import fileIcon from "../../../components/Assets/file-icons.png";

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



function Addexists() {


    const { auth, setAuth } = useContext(AuthContext);
    const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);
    const [showAlert, setShowAlert] = useState();
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [value, setValue] = useState(false);
    const [leaving, setLeaving] = useState({ name: "" });
    const [leavingfetch, setleavingfetch] = useState([]);
    const [working, setWorking] = useState({ workingname: "" });
    const [workingfetch, setWorkingfetch] = useState([]);
    const [empuser, setEmpuser] = useState([]);
    const [interviewer, setInterviewer] = useState({ username: "" });
    const [empid, setempid] = useState([]);
    const [getAllUsers, setgetAllUser] = useState([]);
    const [selectedempcode, setSelectedempcode] = useState('Please Select Empolyeecode');
    const [selectedempname, setSelectedempname] = useState('Please Select Empolyeename');
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [filteredSubCategories, setFilteredSubCategories] = useState([]);
    const [empName, setEmpName] = useState(false)
    const [empCode, setEmpCode] = useState(false)
    const [selectedFiles, setSelectedFiles] = useState([]);

    const [addExist, setAddExits] = useState({ name: "", interviewername: "", reasonleavingname: "", workingagainname: "", mostorganisation: "", think: "", anything: "", companyvechile: "", allequiment: "", exitinterview: "", resignation: "", security: "", noticeperiod: "", managesupervisor: "" });


    const username = isUserRoleAccess.username

    let today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    let formattedDate = yyyy + "-" + mm + "-" + dd;

 
    const handleUserNameChange = (e) => {

        const selectedempcode = e.value;
        setSelectedempname(selectedempcode);
        setSelectedempcode(e.empcode)
        setEmpCode(true)
    };
  

    // Error Popup model

    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    const [openview, setOpenview] = useState(false);
    const [openviewwork, setOpenviewwork] = useState(false);
    // view model
    const handleClickOpenview = () => {
        setOpenview(true);
    };

    const handleCloseview = () => {
        setOpenview(false);
    };

    // view model
    const handleClickOpenviewwork = () => {
        setOpenviewwork(true);
    };

    const handleCloseviewwork = () => {
        setOpenviewwork(false);
    };

    //cancel for create section
    const handleClear = () => {
        setLeaving({ name: "" });
        setWorking({ workingname: "" });
        setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>
                {"Cleared Successfully"}
              </p>
            </>
          );
          handleClickOpenerr();

    }


    const classes = useStyles();


    const handleInputChange = (event) => {
        const files = event.target.files;
        let newSelectedFiles = [...selectedFiles];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            reader.onload = () => {
                newSelectedFiles.push({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    preview: reader.result,
                    base64: reader.result.split(",")[1],
                });
                setSelectedFiles(newSelectedFiles);
            };
            reader.readAsDataURL(file);
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

    const renderFilePreview = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };




    // Array of reason datas 
    const reasonOption = [
        { label: "Better Employment Conditions", value: "Better Employment Conditions" },
        { label: "Death", value: "Death" },
        { label: "Dessertion", value: "Dessertion" },
        { label: "Dismissed", value: "Dismissed" },
        { label: "Dissatisfaction", value: "Dissatisfaction" },
        { label: "Dissatisfaction with Job", value: "Dissatisfaction with Job" },
        { label: "Emigrating", value: "Emigrating" },
        { label: "Health", value: "Health" },
        { label: "Higher Pay", value: "Higher Pay" },
        { label: "Personality Confilcts", value: "Personality Confilcts" },
        { label: "Retirements", value: "Retirements" },
        { label: "Retrenchment", value: "Retrenchment" },
        { label: "Carrer prospect", value: "Carrer prospect" },
        { label: "Higher Education", value: "Higher Education" },
    ]


    // dropdwon fetching status for the reason of leaving 
    const fetchreasonleaving = async () => {
        try {
            let res_project = await axios.get(SERVICE.REASON, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            const projall = [...reasonOption, ...res_project?.data?.addexists.map((d) => (
                {
                    ...d,
                    label: d.name,
                    value: d.name
                }
            ))];
            setleavingfetch(projall);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };




    const workingOption = [{ label: "Yes", value: "Yes" },
    { label: "No", value: "No" }]

    // dropdwon fetching status for the reason of leaving 
    const fetchWorkorganisation = async () => {
        try {
            let res_project = await axios.get(SERVICE.ORGANISATION, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            const projall = [...workingOption, ...res_project?.data?.addexistswork.map((d) => (
                {
                    ...d,
                    label: d.workingname,
                    value: d.workingname
                }
            ))];
            setWorkingfetch(projall);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    // dropdwon fetching status for the reason of leaving 
    const fecthemployeename = async (e) => {
        try {
            let res_project = await axios.get(SERVICE.ALLUSER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            const projall = [...res_project?.data?.allusers.map((d) => (
                {
                    ...d,
                    label: d.companyname,
                    value: d.companyname
                }
            ))];
            setEmpuser(projall);
            setFilteredSubCategories(projall);

        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    // dropdwon fetching status for the reason of leaving 
    const fecthemployid = async () => {
        try {
            //  if(e === "ALL"){
            let res_project = await axios.get(SERVICE.ALLUSER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            const projall = [...res_project?.data?.allusers.map((d) => (
                {
                    ...d,
                    label: d.empcode,
                    value: d.empcode
                }
            ))];
            setgetAllUser(res_project?.data?.allusers)
            setempid(projall);
            setFilteredCategories(projall);

        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    const fetchInterview = async () => {
        try {
            let res = await axios.get(SERVICE.ALLUSER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });

            // Filter the data to keep only users with designation "HRmanager" and a username
            const filteredData = res?.data?.allusers?.filter((user) => user.designation === "HRMANAGER" && user.username);

            // If you want to transform the filtered data into the desired format, you can do it here
            const projall = filteredData?.map((user) => ({
                ...user,
                label: user.username,
                value: user.username
            }));

            setInterviewer(projall);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    useEffect(() => {
        // Filter categories based on the selected project and vendors
        const filteredCategories = empid.filter(subpro =>
            subpro.username === selectedempname
        ).map(subpro => (
            {
                ...subpro,
                label: subpro.empcode,
                value: subpro.empcode
            }
        ))
        setFilteredCategories(filteredCategories);
    }, [selectedempcode]);


    //add function
    const sendRequestReason = async () => {
        try {
            let projectscreate = await axios.post(SERVICE.REASON_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                name: String(leaving.name),
                addedby: [

                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchreasonleaving();
            setLeaving(projectscreate.data)
            handleCloseview();

         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    //add function
    const sendRequestWork = async () => {
        try {
            let projectscreate = await axios.post(SERVICE.ORGANISATION_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                workingname: String(working.workingname),
                addedby: [

                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            setWorking(projectscreate.data)

         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //add function...
    const sendRequest = async () => {
        try {
            let addexi = await axios.post(SERVICE.ADDEXISTSALL_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                // empid: String(selectedempcode),
                empname: String(selectedempname),
                interviewername: String(addExist.interviewername),
                reasonleavingname: String(addExist.reasonleavingname),
                workingagainname: String(addExist.workingagainname),
                mostorganisation: String(addExist.mostorganisation),
                think: String(addExist.think),
                anything: String(addExist.anything),
                companyvechile: String(addExist.companyvechile),
                allequiment: String(addExist.allequiment),
                exitinterview: String(addExist.exitinterview),
                resignation: String(addExist.resignation),
                security: String(addExist.security),
                noticeperiod: String(addExist.noticeperiod),
                today: String(today),
                managesupervisor: String(addExist.managesupervisor),
                files: [...selectedFiles],

                // name: String(empName.name),
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),

                    },
                ],
            });
            //   await fetchAllPriority();
            setAddExits(addexi);
            //   setPriority({ name: "" });
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


    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        // const isNameMatch = priorities.some(item => item.name.toLowerCase() === (priority.name).toLowerCase());
        if (empName.name === "") {
            //   setShowAlert(
            //     <>
            //       <ErrorOutlineOutlinedIcon
            //         sx={{ fontSize: "100px", color: "orange" }}
            //       />
            //       <p style={{ fontSize: "20px", fontWeight: 900 }}>
            //         {"Please enter Priority Name"}
            //       </p>
            //     </>
            //   );
            handleClickOpenerr();
        }
        // else if (isNameMatch) {
        //   setShowAlert(
        //     <>
        //       <ErrorOutlineOutlinedIcon
        //         sx={{ fontSize: "100px", color: "orange" }}
        //       />
        //       <p style={{ fontSize: "20px", fontWeight: 900 }}>
        //         {"Name already exits!"}
        //       </p>
        //     </>
        //   );
        //   handleClickOpenerr();
        // }
        else {
            sendRequest();
        }
    };





    //submit option for saving
    const handleSubmitReason = (e) => {
        e.preventDefault();
        // const isNameMatch = projects.some(item => item.name.toLowerCase() === (project.name).toLowerCase());
        if (leaving.name === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Project Name"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }



        else {
            sendRequestReason();
        }
    };

    //submit option for saving
    const handleSubmitWork = (e) => {
        e.preventDefault();
        // const isNameMatch = projects.some(item => item.name.toLowerCase() === (project.name).toLowerCase());
        if (working.workingname === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Project Name"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }

        else {
            sendRequestWork();
        }
    };

    useEffect(() => {

        fetchreasonleaving();
        fetchWorkorganisation();
        fecthemployeename();
        fecthemployid();
        fetchInterview();

    }, [])

    return (

        <Box>
            <Headtitle title={'ADD EXITS DETAILS'} />
            {isUserRoleCompare?.includes("aexistsdetailslist")
                && (
                    <>
                        <Typography sx={userStyle.HeaderText}>Add Exists Details<Typography sx={userStyle.SubHeaderText}></Typography></Typography>
                        <Box sx={userStyle.container} >

                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.SubHeaderText}><b> Separation </b></Typography>
                                </Grid>
                            </Grid>
                            <br />

                            <Grid container spacing={2} >
                                <Grid item md={4} xs={12} sm={12}>
                                    <Typography>Employee Name <b style={{ color: "red" }}>*</b></Typography>
                                    <FormControl size="small" fullWidth>
                                        <Selects
                                            options={filteredSubCategories}
                                            styles={colourStyles}
                                            value={{ label: selectedempname, value: selectedempname }}
                                            onChange={handleUserNameChange}

                                        />
                                    </FormControl>
                                </Grid>
                                {/* )} */}


                                <Grid item md={3} xs={12} sm={12}>
                                    <Typography>Interviewer <b style={{ color: "red" }}>*</b></Typography>
                                    <FormControl size="small" fullWidth>
                                        <Selects
                                            options={interviewer}
                                            styles={colourStyles}
                                            // value={addExist.interviewername}
                                            //     onChange={(e) => {
                                            //         setAddExits({ ...addExist, interviewername: e.value });
                                            //     }}
                                            value={{ label: addExist.interviewername, value: addExist.interviewername }}
                                            onChange={(e) => setAddExits({ ...addExist, interviewername: e.value })}

                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Reason For Leaving </Typography>
                                        <Selects
                                            options={leavingfetch}
                                            styles={colourStyles}
                                            // value={addExist.reasonleavingname}
                                            // onChange={(e) => {
                                            //     setAddExits({ ...addExist, reasonleavingname: e.target.value });
                                            // }}
                                            value={{ label: addExist.reasonleavingname, value: addExist.reasonleavingname }}
                                            onChange={(e) => setAddExits({ ...addExist, reasonleavingname: e.value })}

                                        />
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
                                            marginTop: "20px",
                                            background: "rgb(25, 118, 210)",
                                        }}
                                        onClick={() => {

                                            // getviewCode(row._id);
                                            // getteamdataview(row);
                                            handleClickOpenview();
                                        }}
                                    >
                                        <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                </Grid>

                            </Grid> <br /> <br />

                            <Grid item xs={12}>
                                <Typography sx={userStyle.SubHeaderText}><b> Questionaries </b></Typography>
                            </Grid><br />
                            <Grid container spacing="2">
                                <Grid item md={6} xs={12} sm={12}>
                                    <Typography>Working for this organization again </Typography>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Selects
                                            options={workingfetch}
                                            styles={colourStyles}
                                            // value={addExist.workingagainname}
                                            // onChange={(e) => {
                                            //     setAddExits({ ...addExist, workingagainname: e.target.value });
                                            // }}
                                            value={{ label: addExist.workingagainname, value: addExist.workingagainname }}
                                            onChange={(e) => setAddExits({ ...addExist, workingagainname: e.value })}


                                        />
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
                                            // marginTop: "20px",
                                            background: "rgb(25, 118, 210)",
                                        }}
                                        onClick={() => {
                                            handleClickOpenviewwork();
                                        }}
                                    >
                                        <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                </Grid>


                            </Grid> <br />

                            <Grid container spacing="2">
                                <Grid item md={6} xs={12} sm={12}>
                                    <Typography>What did you like the most of the organization </Typography>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl size="small" fullWidth>
                                        <TextareaAutosize
                                            aria-label="minimum height"
                                            minRows={5}
                                            value={addExist.mostorganisation}
                                            onChange={(e) => { setAddExits({ ...addExist, mostorganisation: e.target.value }) }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} sm={1} xs={1}>
                                </Grid>


                            </Grid> <br />

                            <Grid container spacing="2">
                                <Grid item md={6} xs={12} sm={12}>
                                    <Typography>Think the organization do to improve staff welfare</Typography>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl size="small" fullWidth>
                                        <TextareaAutosize
                                            aria-label="minimum height"
                                            minRows={5}
                                            value={addExist.think}
                                            onChange={(e) => { setAddExits({ ...addExist, think: e.target.value }) }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} sm={1} xs={1}>
                                </Grid>
                            </Grid> <br />

                            <Grid container spacing="2">
                                <Grid item md={6} xs={12} sm={12}>
                                    <Typography>Anything you wish to share with us</Typography>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl size="small" fullWidth>
                                        <TextareaAutosize
                                            aria-label="minimum height"
                                            minRows={5}
                                            value={addExist.anything}
                                            onChange={(e) => { setAddExits({ ...addExist, anything: e.target.value }) }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} sm={1} xs={1}>
                                </Grid>
                            </Grid> <br />

                            <Grid item xs={12}>
                                <Typography sx={userStyle.SubHeaderText}><b> Checklist for Exit Interview </b></Typography>
                            </Grid><br />

                            <Grid container spacing="2">
                                <Grid item md={6} xs={12} sm={12}>
                                    <Typography>Company vechile handted in</Typography>
                                </Grid>
                                <Grid item md={4} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="date"
                                            value={addExist.companyvechile}
                                            onChange={(e) => { setAddExits({ ...addExist, companyvechile: e.target.value }) }}
                                        />

                                    </FormControl>
                                </Grid>
                                <Grid item md={2} sm={1} xs={1}>
                                </Grid>
                            </Grid> <br />

                            <Grid container spacing="2">
                                <Grid item md={6} xs={12} sm={12}>
                                    <Typography>All Equipment handed in</Typography>
                                </Grid>
                                <Grid item md={4} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="date"
                                            value={addExist.allequiment}
                                            onChange={(e) => { setAddExits({ ...addExist, allequiment: e.target.value }) }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} sm={1} xs={1}>
                                </Grid>
                            </Grid> <br />

                            <Grid container spacing="2">
                                <Grid item md={6} xs={12} sm={12}>
                                    <Typography>Exit interview conducated on</Typography>
                                </Grid>
                                <Grid item md={4} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="date"
                                            value={addExist.exitinterview}
                                            onChange={(e) => { setAddExits({ ...addExist, exitinterview: e.target.value }) }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} sm={1} xs={1}>
                                </Grid>
                            </Grid> <br />

                            <Grid container spacing="2">
                                <Grid item md={6} xs={12} sm={12}>
                                    <Typography>Resignation letter submitted</Typography>
                                </Grid>
                                <Grid item md={4} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <div>
                                            <input
                                                className={classes.inputs}
                                                type="file"
                                                id="uploadprojectcreatenew"
                                                multiple
                                                onChange={handleInputChange}
                                            />
                                            <label htmlFor="uploadprojectcreatenew" style={{ textAlign: "center" }}>
                                                <Button sx={userStyle.btncancel} component="span">
                                                    <AddCircleOutlineIcon /> &ensp; Add Files
                                                </Button>
                                            </label>

                                            <Grid container>
                                                {selectedFiles.map((file, index) => (
                                                    <>
                                                        <Grid item md={3} sm={11} xs={11}>
                                                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                                                                {file.type.includes("image/") ? (
                                                                    <img src={file.preview} alt={file.name} height="100" style={{ maxWidth: "-webkit-fill-available" }} />
                                                                ) : (
                                                                    <img className={classes.preview} src={getFileIcon(file.name)} height="100" alt="file icon" />
                                                                )}
                                                            </Box>
                                                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                                                                <Typography variant="subtitle2">{file.name} </Typography>
                                                                {/* <Typography variant="subtitle2">{file.type} - {file.size} bytes </Typography> */}
                                                            </Box>
                                                        </Grid>
                                                        <Grid item md={1} sm={1} xs={1}>
                                                            <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", marginLeft: "105px", marginTop: "-20px", cursor: "pointer" }} onClick={() => renderFilePreview(file)} />
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
                                                                <FaTrash style={{ fontSize: "large", color: "#777" }} />
                                                            </Button>
                                                        </Grid>
                                                    </>
                                                ))}
                                            </Grid>
                                        </div>


                                    </FormControl>
                                </Grid>
                                <Grid item md={2} sm={1} xs={1}>
                                </Grid>
                            </Grid> <br />

                            <Grid container spacing="2">
                                <Grid item md={6} xs={12} sm={12}>
                                    <Typography>Security</Typography>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
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
                                            displayEmpty
                                            inputProps={{ 'aria-label': 'Without label' }}
                                            value={addExist.security}
                                            onChange={(e) => { setAddExits({ ...addExist, security: e.target.value }) }}
                                        >
                                            <MenuItem value="" disabled>Please Select</MenuItem>
                                            <MenuItem value="yes"> {"Yes"} </MenuItem>
                                            <MenuItem value="no"> {"No"} </MenuItem>

                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} sm={1} xs={1}>
                                </Grid>
                            </Grid> <br />

                            <Grid container spacing="2">
                                <Grid item md={6} xs={12} sm={12}>
                                    <Typography>Notice period followed</Typography>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
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
                                            value={addExist.noticeperiod}
                                            onChange={(e) => { setAddExits({ ...addExist, noticeperiod: e.target.value }) }}
                                            displayEmpty
                                            inputProps={{ 'aria-label': 'Without label' }}
                                        >
                                            <MenuItem value="" disabled>Please Select</MenuItem>
                                            <MenuItem value="yes"> {"Yes"} </MenuItem>
                                            <MenuItem value="no"> {"No"} </MenuItem>

                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} sm={1} xs={1}>
                                </Grid>
                            </Grid> <br />

                            <Grid container spacing="2">
                                <Grid item md={6} xs={12} sm={12}>
                                    <Typography>Manage / Supevisor clearance</Typography>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
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
                                            value={addExist.managesupervisor}
                                            onChange={(e) => { setAddExits({ ...addExist, managesupervisor: e.target.value }) }}
                                            displayEmpty
                                            inputProps={{ 'aria-label': 'Without label' }}
                                        >
                                            <MenuItem value="" disabled>Please Select</MenuItem>
                                            <MenuItem value="yes"> {"Yes"} </MenuItem>
                                            <MenuItem value="no"> {"No"} </MenuItem>

                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} sm={1} xs={1}>
                                </Grid>
                            </Grid> <br /> <br />

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={2.5} lg={2.5}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleSubmit}
                                    >
                                        SUBMIT
                                    </Button>


                                </Grid>
                                <Grid item xs={12} sm={6} md={2.5} lg={2.5}>
                                    <Button
                                        sx={userStyle.btncancel}
                                    // onClick={handleclear}
                                    >
                                        Clear
                                    </Button>

                                </Grid>
                            </Grid>






                            {/* Reason of Leaving  */}
                            <Dialog
                                open={openview}
                                onClose={handleClickOpenview}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                            >
                                <Box sx={{ width: "550px", padding: "20px 50px" }}>
                                    <>
                                        <Typography sx={userStyle.HeaderText}> Reason For Leaving- Quick Add</Typography>
                                        <br /> <br />
                                        <Grid container spacing={2}>
                                            <Grid item md={6} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography variant="h6"> Name</Typography>

                                                </FormControl>
                                            </Grid>< br />
                                            <Grid container spacing={2}>
                                                <Grid item md={8} xs={12} sm={12}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography variant="h6"></Typography>

                                                        <FormControl size="small" fullWidth>
                                                            <TextField
                                                                value={leaving.name}
                                                                onChange={(e) => {
                                                                    setLeaving({ ...leaving, name: e.target.value });
                                                                }}
                                                            />
                                                        </FormControl>

                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <br /> <br /> <br />
                                        <Grid container spacing={2}>
                                            <Grid item md={2} xs={12} sm={12}>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={handleSubmitReason}

                                                >

                                                    Save
                                                </Button>
                                            </Grid>
                                            <Grid item md={2} xs={12} sm={12}>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={handleClear}
                                                > Clear
                                                </Button>
                                            </Grid>
                                            <Grid item md={0.1} xs={12} sm={12}></Grid>
                                            <Grid item md={2} xs={12} sm={12} >
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={handleCloseview}
                                                >   Close

                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </>
                                </Box>
                            </Dialog>

                            {/* Work Organisation  */}
                            <Dialog
                                open={openviewwork}
                                onClose={handleClickOpenviewwork}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                            >
                                <Box sx={{ width: "550px", padding: "20px 50px" }}>
                                    <>
                                        <Typography sx={userStyle.HeaderText}> Working for this organisation again</Typography>
                                        <br /> <br />
                                        <Grid container spacing={2}>
                                            <Grid item md={6} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography variant="h6"> Name</Typography>
                                                </FormControl>
                                            </Grid>< br />
                                            <Grid container spacing={2}>
                                                <Grid item md={8} xs={12} sm={12}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography variant="h6"></Typography>

                                                        <FormControl size="small" fullWidth>
                                                            <TextField
                                                                value={working.workingname}
                                                                onChange={(e) => {
                                                                    setWorking({ ...working, workingname: e.target.value });
                                                                }}
                                                            />
                                                        </FormControl>

                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <br /> <br /> <br />
                                        <Grid container spacing={2}>
                                            <Grid item md={2} xs={12} sm={12}>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={handleSubmitWork}
                                                >
                                                    Save
                                                </Button>
                                            </Grid>
                                            <Grid item md={2} xs={12} sm={12}>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={handleClear}
                                                > Clear
                                                </Button>
                                            </Grid>
                                            <Grid item md={0.1} xs={12} sm={12}></Grid>
                                            <Grid item md={2} xs={12} sm={12}>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={handleCloseviewwork}
                                                >   Close

                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </>
                                </Box>
                            </Dialog>
                        </Box>
                    </>
                )}
        </Box>
    );

}

export default Addexists;