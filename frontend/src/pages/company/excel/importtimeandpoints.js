import React, { useState, useEffect, useRef, useContext } from "react";
import { userStyle } from "../../../pageStyle";
import { FaDownload, FaTrash } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { CsvBuilder } from 'filefy';
import Alert from '@mui/material/Alert';
import SendToServer from '../../sendtoserver';
import { handleApiError } from "../../../components/Errorhandling";
import { toast } from 'react-toastify';
import { Box, Typography, Dialog, TableBody, DialogContent, DialogActions, Grid, Paper, Table, TableHead, TableContainer, Button } from "@mui/material";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import { SERVICE } from '../../../services/Baseservice';
import 'jspdf-autotable';
import { UserRoleAccessContext, AuthContext } from '../../../context/Appcontext';
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Headtitle from "../../../components/Headtitle";
import axios from "axios";


function ImportTimeandpoints() {

    const [items, setItems] = useState([]);
    const [itemsprojects, setItemsprojects] = useState([]);
    const [itemscategories, setItemscategories] = useState([]);
    const [itemssubcategories, setItemssubcategories] = useState([]);
    const [timeandpoints, setTimeandpoints] = useState([]);
    const [show, setShow] = useState(true);
    const [fileupload, setFileupload] = useState([])
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [fileName, setFileName] = useState("");
    const [projects, setProjects] = useState([]);
    const { auth, setngs } = useContext(AuthContext);
    const [dataupdated, setDataupdated] = useState("")
    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    // Access
    const { isUserRoleCompare } = useContext(UserRoleAccessContext);
    

    const readExcel = (file) => {
        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);

            fileReader.onload = (e) => {
                const bufferArray = e.target.result;
                const wb = XLSX.read(bufferArray, { type: "buffer" });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];

                // Convert the sheet to JSON
                const data = XLSX.utils.sheet_to_json(ws);

                resolve(data);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
        promise.then((d) => {
            const dataArray = d.map((item) => ({
                project: item.Project,
                category: item.Category,
                subcategory: item["Sub Category"],
                time: String(item.Time),
                rate: Number(item.Rate).toFixed(5),
                ratetopoints: Number(item.Conversion).toFixed(5),
                points: Number(item.Points).toFixed(5),
                flagcount: Number(item.Flagcount).toFixed(3),
            }));


            const uniqueCombinationstime = new Set();

            // Filter and deduplicate CATEGORIES
            const filteredArray1time = timeandpoints.filter(item => {
                const combination = `${item.category}-${item.project}-${item.subcategory}`;
                if (!uniqueCombinationstime.has(combination)) {
                    uniqueCombinationstime.add(combination);
                    return true;
                }
                return false;
            });

            // Filter and deduplicate EXCEL DATA
            const filteredArray2time = dataArray.filter(item => {
                const combination = `${item.category}-${item.project}-${item.subcategory}`;
                if (item.category && item.project && item.subcategory && !uniqueCombinationstime.has(combination)) {
                    uniqueCombinationstime.add(combination);
                    return true;
                }
                return false;
            });



            //subcategories
            const uniqueCombinations = new Set();

            // Filter and deduplicate CATEGORIES
            const filteredArray1 = subcategories.filter(item => {
                const combination = `${item.name}-${item.project}-${item.categoryname}`;
                if (!uniqueCombinations.has(combination)) {
                    uniqueCombinations.add(combination);
                    return true;
                }
                return false;
            });

            // Filter and deduplicate EXCEL DATA
            const filteredArray2 = dataArray.filter(item => {
                const combination = `${item.subcategory}-${item.project}-${item.category}`;
                if (item.subcategory && item.project && item.category && !uniqueCombinations.has(combination)) {
                    uniqueCombinations.add(combination);
                    return true;
                }
                return false;
            });



            //CATEGORIES
            const uniqueCombinationscate = new Set();

            // Filter and deduplicate CATEGORIES
            const filteredArray1cate = categories.filter(item => {
                const combination = `${item.name}-${item.project}`;
                if (item.name && item.project && !uniqueCombinationscate.has(combination)) {
                    uniqueCombinationscate.add(combination);
                    return true;
                }
                return false;
            });

            // Filter and deduplicate EXCEL DATA
            const filteredArray2cate = dataArray.filter(item => {
                const combination = `${item.category}-${item.project}`;
                if (item.category && item.project && !uniqueCombinationscate.has(combination)) {
                    uniqueCombinationscate.add(combination);
                    return true;
                }
                return false;
            });



            //PROJECTS DUPLICATE REMOVED
            const namesSetproj = new Set(projects.map(item => item.name.toLowerCase()));
            // Filter array2 to get unique elements not present in array1
            const namesSet2 = new Set(
                dataArray
                    .filter(item => !namesSetproj.has(item.project.toLowerCase()))
                    .map(item => item.project)
            );

            const dataArraycate = filteredArray2cate.map((item) => ({
                name: item.category,
                project: item.project,
            }));

            const dataArraysubcate = filteredArray2.map((item) => ({
                name: item.subcategory,
                project: item.project,
                categoryname: item.category,

            }));

            setItemsprojects(Array.from(namesSet2).map(name => ({ name })))
            setItemscategories(dataArraycate)
            setItemssubcategories(dataArraysubcate)
            setItems(filteredArray2time);
        });
    };


    //get all Time Loints List.
    const fetchAllTimePoints = async () => {
        try {
            let res_queue = await axios.get(SERVICE.TIMEPOINTS, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setTimeandpoints(res_queue?.data?.timepoints)
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    //get all category.
    const fetchAllSubCategory = async () => {
        try {
            let res_module = await axios.get(SERVICE.SUBCATEGORYEXCEL, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });

            setSubcategories(res_module?.data?.subcategoryexcel);

        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    const fetchAllCategory = async () => {
        try {
            let res_module = await axios.get(SERVICE.CATEGORYEXCEL, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });

            setCategories(res_module?.data?.categoryexcel);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //fetching Project for Dropdowns
    const fetchProjectDropdowns = async () => {
        try {
            let res_project = await axios.get(SERVICE.PROJECTMASTER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });

            setProjects(res_project?.data?.projmaster);


        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    useEffect(() => {
        fetchAllCategory();
        fetchProjectDropdowns();
        fetchAllSubCategory();
        fetchAllTimePoints();
    }, [items])

    const clearFileSelection = () => {
        setFileupload([]);
        setFileName("");
        setItems("")
        readExcel(null)
        setItemsprojects("")
        setDataupdated("")
    };


    const ExportsHead = () => {
        new CsvBuilder("Time and Points")
            .setColumns(["Project", "Category", "Sub Category", "Time", "Rate", "Conversion", "Points", "Flagcount"])
            .exportFile();
    }



    async function sendJSON() {
        var xmlhttp = new XMLHttpRequest();
        
        // Ensure that items is an array of objects before sending
        if (!Array.isArray(items) || items.length === 0) {
            setShowAlert(
                <>
                    <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: 'green' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select File"}</p>
                </>
            );
            return;
        }
    
        const sendRequest = (url, data) => {
            return new Promise((resolve, reject) => {
                xmlhttp.onreadystatechange = function () {
                    if (this.readyState === 4) {
                        if (this.status === 200) {
                            resolve(this.responseText);
                        } else {
                            reject(this.statusText);
                        }
                    }
                };
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xmlhttp.send(JSON.stringify(data));
            });
        };
    
        try {
            await sendRequest(SERVICE.TIMEPOINTS_CREATE, items);
            await sendRequest(SERVICE.PROJECTMASTER_CREATE, itemsprojects);
            await sendRequest(SERVICE.CATEGORYEXCEL_CREATE, itemscategories);
            await sendRequest(SERVICE.SUBCATEGORYEXCEL_CREATE, itemssubcategories);
    
            setShowAlert(
                <>
                    <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: 'green' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Uploaded Successfully"}</p>
                </>
            );
            handleClickOpenerr();
            setItems("");
            setItemsprojects("");
            setDataupdated("");
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    }
    const handleCheck = () => {
        toast.warning("Upload files!");
    }

    return (
        <Box>
            <Headtitle title={'Time and Point'} />
            <Typography sx={userStyle.HeaderText}>Import Time and Points</Typography>
            {isUserRoleCompare?.includes("limporttime&points") && (
            <Box sx={userStyle.container}>
                <Typography variant='h6' >File to import</Typography><br />
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    {items.length > 0 ?
                        <Alert severity="success">File Accepted!</Alert> : null
                    }
                    {items.length == 0 && dataupdated == "uploaded" ?
                        <Alert severity="error">No data to upload!</Alert> : null
                    }
                </Box>
                <Grid container spacing={2}>
                    <Grid item md={2}>
                        <Button variant="contained" component="label" sx={userStyle.uploadBtn}>
                            Upload
                            <input
                                hidden
                                type="file"
                                accept=".xlsx, .xls , .csv"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    setFileupload(file);
                                    setDataupdated("uploaded");
                                    readExcel(file);
                                    setFileName(file.name);
                                    e.target.value = null;

                                }}
                            />
                        </Button>
                    </Grid>
                    <Grid item md={7}>
                        {fileName && items.length > 0 ?
                            <Box sx={{ display: 'flex', justifyContent: 'left' }}>
                                <p>{fileName}</p>
                                <Button onClick={() => clearFileSelection()}><FaTrash style={{ color: 'red' }} /></Button>
                            </Box>
                            : null}
                    </Grid>
                    <Grid item md={2}>
                        {show && items?.length > 0 && <><div><div readExcel={readExcel} /><SendToServer sendJSON={sendJSON} /></div></>}
                    </Grid>
                </Grid>
                <br /><br />
                <Button variant="contained" color="success" sx={{ textTransform: 'Capitalize' }} onClick={(e) => ExportsHead()} ><FaDownload />&ensp;Download template file</Button>
            </Box>
            )}
            <br />
            {/* ALERT DIALOG */}
            <Box>
                <Dialog
                    open={isErrorOpen}
                    onClose={handleCloseerr}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
                        <Typography variant="h6" >{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleCloseerr}>ok</Button>
                    </DialogActions>
                </Dialog>
            </Box>
            {/* ****** Instructions Box ****** */}
            <Box sx={userStyle.container}>
                <Typography sx={userStyle.importheadtext}>Instructions</Typography>
                <br />
                <Typography sx={userStyle.importsubheadtex}>Follow the instructions carefully before importing the file. The columns of the file should be in the following order.</Typography>
                {/* <Typography sx={userStyle.importsubheadtext}>The columns of the file should be in the following order.</Typography> */}
                <br /><br />
                <TableContainer component={Paper} sx={{
                    padding: 1, width: '100%', margin: 'auto', overflow: 'auto',
                    "&::-webkit-scrollbar": { width: 20 },
                    "&::-webkit-scrollbar-track": { backgroundColor: 'pink' },
                    "&::-webkit-scrollbar-thumb": { backgroundColor: 'blue' }
                }} >
                    {/* ****** Table ****** */}
                    <Table md={{ minWidth: 200, maxHeight: '5px', overflow: 'auto' }} aria-label="customized table">
                        <TableHead >
                            <StyledTableRow>
                                <StyledTableCell >Column#</StyledTableCell>
                                <StyledTableCell align="left">Column Name</StyledTableCell>
                                <StyledTableCell align="left">Type</StyledTableCell>
                                <StyledTableCell align="left">Instruction</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">1</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Project</Typography></Box>    </StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography style={{ color: "red" }}>*</Typography><Typography>Required</Typography></Box>    </StyledTableCell>
                                <StyledTableCell align="left"> <Typography sx={userStyle.importTabledata}>Project Name Should be must.</Typography></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">3</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Category</Typography></Box> </StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography style={{ color: "red" }}>*</Typography><Typography>Required</Typography></Box>    </StyledTableCell>
                                <StyledTableCell align="left"> <Typography sx={userStyle.importTabledata}>Category Should be must.</Typography></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">4</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>SubCategory</Typography></Box> </StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography style={{ color: "red" }}>*</Typography><Typography>Required</Typography></Box>    </StyledTableCell>
                                <StyledTableCell align="left"> <Typography sx={userStyle.importTabledata}>Sub Category Should be must.</Typography></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">5</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Time</Typography></Box> </StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography style={{ color: "red" }}>*</Typography><Typography>Required</Typography></Box>    </StyledTableCell>
                                <StyledTableCell align="left"> <Typography sx={userStyle.importTabledata}>Time Should be must.</Typography></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">6</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Rate</Typography></Box> </StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography style={{ color: "red" }}>*</Typography><Typography>Required</Typography></Box>    </StyledTableCell>
                                <StyledTableCell align="left"> <Typography sx={userStyle.importTabledata}>Rate Should be must.</Typography></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">7</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Conversion</Typography></Box> </StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography style={{ color: "red" }}>*</Typography><Typography>Required</Typography></Box>    </StyledTableCell>
                                <StyledTableCell align="left"> <Typography sx={userStyle.importTabledata}>Conversion Should be must.</Typography></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">8</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Points</Typography></Box> </StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography style={{ color: "red" }}>*</Typography><Typography>Required</Typography></Box>    </StyledTableCell>
                                <StyledTableCell align="left"> <Typography sx={userStyle.importTabledata}>Points Should be must.</Typography></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">9</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Flag Count</Typography></Box> </StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography style={{ color: "red" }}>*</Typography><Typography>Required</Typography></Box>    </StyledTableCell>
                                <StyledTableCell align="left"> <Typography sx={userStyle.importTabledata}>Flag Count Should be must.</Typography></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                            </StyledTableRow>
                        </TableBody>
                    </Table>
                    {/* ****** Table Ends ****** */}
                </TableContainer>
                <br />
            </Box>
            {/* ****** Instructions Box Ends ****** */}
        </Box >
    );
}

export default ImportTimeandpoints;