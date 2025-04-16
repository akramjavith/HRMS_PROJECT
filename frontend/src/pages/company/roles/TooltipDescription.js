import { EditOutlined } from "@material-ui/icons";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Dialog, DialogActions, DialogContent, FormControl, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import "jspdf-autotable";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Selects from "react-select";
import { handleApiError } from "../../../components/Errorhandling";
import Headtitle from "../../../components/Headtitle";
import { menuItems } from "../../../components/menuItemsList";
import { AuthContext, UserRoleAccessContext } from "../../../context/Appcontext";
import { colourStyles, userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";

function TooltipDescription() {

    const [datas, setDatas] = useState({
        module: "Please Select Module",
        submodule: "Please Select Sub Module",
        mainpage: "Please Select Mainpage",
        subpage: "Please Select Subpage",
        subsubpage: "Please Select Subsubpage",
        description: ""
    });
    const [submoduleOptions, setSubModuleOptions] = useState([]);
    const [mainpageOptions, setMainPageOptions] = useState([]);
    const [subpageOptions, setSubpageOptions] = useState([]);
    const [subsubpageOptions, setSubSubpageOptions] = useState([]);
    const [changeControl, setChangeControl] = useState(false);
    const [getIndex, setGetIndex] = useState("");

    //Delete model
    const [isDeleteOpen, setisDeleteOpen] = useState(false);
    const handleClickOpendel = () => {
        setisDeleteOpen(true);
    };
    const handleCloseDel = () => {
        setisDeleteOpen(false);
    };
    const backPage = useNavigate();
    const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);

    const [roleEditOptions, setRoleEditOptions] = useState([]);
    const { auth } = useContext(AuthContext);

  


    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);

    const [showAlert, setShowAlert] = useState();

    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };


    //get single row to edit....
    const getCode = async () => {
        try {
            let res = await axios.get(`${SERVICE.TOOLTIPDESCRIPTIONSAGGREGATION}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let sorted = res?.data?.tooldescription?.sort((a, b) => a.modulename.localeCompare(b.modulename));
            setRoleEditOptions(sorted);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    

    const EditControls = async (index) => {
        setChangeControl(true);
        setGetIndex(index);
        const ans = roleEditOptions[index].control;
    };

    const UpdateControls = async (id, index) => {
        setChangeControl(false);
        try {
            let res = await axios.put(`${SERVICE.TOOLTIPDESCRIPTION_SINGLE}/${id}`, {
                description: descriptions[index]
            }, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setShowAlert(
                <>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CheckCircleOutlineIcon style={{ fontSize: "80px", color: 'green' }} />
                    </div>
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Added Successfully"}</p>
                </>
            );
            handleClickOpenerr();
            await getCode();

        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    //module dropdowns
    const module = menuItems.map((d) => ({
        ...d,
        label: d.title,
        value: d.title,
    }));

    //Submodule dropdowns
    const fetchSubModuleDropDowns = (e) => {
        let subModule = menuItems.filter((data) => data.title === e);
        let dropdown = subModule.map((data) => data.submenu);
        let ans = [].concat(...dropdown).map((d) => ({
            ...d,
            label: d.title,
            value: d.title,
        }));
        setSubModuleOptions(ans);
    };
    //MainPage dropdowns
    const fetchMainDropDowns = (e) => {
        let ans = e;

        let subModule = ans?.submenu ? ans?.submenu : [];
        let answer = [].concat(...subModule).map((d) => ({
            ...d,
            label: d.title,
            value: d.title,
        }));
        setMainPageOptions(answer);
    };
    //subPage dropdowns
    const fetchSubPageDropDowns = (e) => {
        let ans = e;

        let subModule = ans?.submenu ? ans?.submenu : [];
        let answer = [].concat(...subModule).map((d) => ({
            ...d,
            label: d.title,
            value: d.title,
        }));
        setSubpageOptions(answer);
    };
    //subPage dropdowns
    const fetchSubSubPageDropDowns = (e) => {
        let ans = e;
        let subModule = ans?.submenu ? ans?.submenu : [];
        let answer = [].concat(...subModule).map((d) => ({
            ...d,
            label: d.title,
            value: d.title,
        }));
        setSubSubpageOptions(answer);
    };

    const handleclear = () => {
        setDatas({
            module: "Please Select Module",
            submodule: "Please Select Sub Module",
            mainpage: "Please Select Mainpage",
            subpage: "Please Select Subpage",
            subsubpage: "Please Select Subsubpage",
            description: ""
        })
        setSubModuleOptions([]);
        setMainPageOptions([]);
        setSubpageOptions([]);
        setSubSubpageOptions([]);
        setShowAlert(
            <>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CheckCircleOutlineIcon style={{ fontSize: "80px", color: 'green' }} />
                </div>
                <p style={{ fontSize: '20px', fontWeight: 900, textAlign: 'center' }}>{"Cleared Successfully"}</p>
            </>
        );
        handleClickOpenerr();
    }

    //ubmiit Request
    const fetchSubmit = async () => {
        try {
            if (datas?.module === "Please Select Module") {
                setShowAlert(
                    <>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <ErrorOutlineOutlinedIcon style={{ fontSize: "80px", color: 'green' }} />
                        </div>
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Module"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (datas?.submodule === "Please Select Sub Module") {
                setShowAlert(
                    <>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <ErrorOutlineOutlinedIcon style={{ fontSize: "80px", color: 'green' }} />
                        </div>
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Sub Module"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (datas?.mainpage === "Please Select Mainpage" && mainpageOptions?.length > 0) {
                setShowAlert(
                    <>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <ErrorOutlineOutlinedIcon style={{ fontSize: "80px", color: 'green' }} />
                        </div>
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Main Page"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (datas?.subpage === "Please Select Subpage" && subpageOptions?.length > 0) {
                setShowAlert(
                    <>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <ErrorOutlineOutlinedIcon style={{ fontSize: "80px", color: 'green' }} />
                        </div>
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Sub Page"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (datas?.subsubpage === "Please Select Subsubpage" && subsubpageOptions?.length > 0) {
                setShowAlert(
                    <>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <ErrorOutlineOutlinedIcon style={{ fontSize: "80px", color: 'green' }} />
                        </div>
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Subsubpage"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (datas?.description === "") {
                setShowAlert(
                    <>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <ErrorOutlineOutlinedIcon style={{ fontSize: "80px", color: 'green' }} />
                        </div>
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Tool Tip Description"}</p>
                    </>
                );
                handleClickOpenerr();
            } else {
                sendRequest();
            }

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }

    };

    const sendRequest = async () => {
        try {
            let res = await axios.post(`${SERVICE.TOOLTIPDESCRIPTION_CREATE}`, {
                modulename: datas?.module,
                submodulename: datas?.submodule,
                mainpagename: datas?.mainpage === "Please Select Mainpage" ? "" : datas?.mainpage,
                subpagename: datas?.subpage === "Please Select Subpage" ? "" : datas?.subpage,
                subsubpagename: datas?.subsubpage === "Please Select Subsubpage" ? "" : datas?.subsubpage,
                description: datas?.description,

            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                }
            },);
            setShowAlert(
                <>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CheckCircleOutlineIcon style={{ fontSize: "80px", color: 'green' }} />
                    </div>
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Added Successfully"}</p>
                </>
            );
            handleClickOpenerr();
            setDatas((prev) => ({
                ...prev,
                description: ""
            }))
            await getCode()
        }
        catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    }

    useEffect(() => {
        getCode();
    }, []);

    const [descriptions, setDescriptions] = useState({});

    const handleDescriptionChange = (index, value) => {
        setDescriptions(prev => ({
            ...prev,
            [index]: value,
        }));
    };


    return (
        <Box>
            <Headtitle title={"Tool Tip Description"} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Tool Tip Description</Typography>
            {isUserRoleCompare?.includes("erole") && (
                <>
                    <Box sx={userStyle.dialogbox}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item md={10} xs={12} sm={12}>
                                    <Typography sx={userStyle.importheadtext}>
                                        Tool Tip Description
                                    </Typography>
                                </Grid>

                            </Grid>
                            <br />

                            <Grid container sx={{ justifyContent: "left" }} spacing={2}>
                                <Grid item md={4} xs={12} sm={12}>
                                    <Typography>
                                        Module<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <FormControl size="small" fullWidth>
                                        <Selects
                                            styles={colourStyles}
                                            options={module}
                                            value={{ value: datas.module, label: datas.module }}
                                            onChange={(e) => {

                                                setDatas((prev) => ({
                                                    ...prev, module: e.value,
                                                    submodule: "Please Select Sub Module",
                                                    mainpage: "Please Select Mainpage",
                                                    subpage: "Please Select Subpage",
                                                    subsubpage: "Please Select Subsubpage",
                                                }))
                                                fetchSubModuleDropDowns(e.value)

                                                setMainPageOptions([]);
                                                setSubpageOptions([]);
                                                setSubSubpageOptions([]);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <Typography>Sub-Module<b style={{ color: "red" }}>*</b></Typography>
                                    <FormControl size="small" fullWidth>

                                        <Selects size="small"
                                            options={submoduleOptions}
                                            value={{ value: datas.submodule, label: datas.submodule }}
                                            onChange={(e) => {

                                                setDatas((prev) => ({
                                                    ...prev, submodule: e.value,

                                                    mainpage: "Please Select Mainpage",
                                                    subpage: "Please Select Subpage",
                                                    subsubpage: "Please Select Subsubpage",
                                                }))
                                                fetchMainDropDowns(e);
                                                setSubpageOptions([]);
                                                setSubSubpageOptions([]);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <Typography>Main-Page</Typography>
                                    <FormControl size="small" fullWidth>

                                        <Selects size="small"
                                            options={mainpageOptions}
                                            value={{ value: datas.mainpage, label: datas.mainpage }}
                                            onChange={(e) => {

                                                setDatas((prev) => ({
                                                    ...prev, mainpage: e.value,


                                                    subpage: "Please Select Subpage",
                                                    subsubpage: "Please Select Subsubpage",
                                                }))
                                                fetchSubPageDropDowns(e);
                                                setSubSubpageOptions([]);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <Typography>Sub-Page</Typography>
                                    <FormControl size="small" fullWidth>

                                        <Selects size="small"
                                            options={subpageOptions}
                                            value={{ value: datas.subpage, label: datas.subpage }}
                                            onChange={(e) => {

                                                setDatas((prev) => ({
                                                    ...prev, subpage: e.value,
                                                    subsubpage: "Please Select Subsubpage",
                                                }))
                                                fetchSubSubPageDropDowns(e);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <Typography>Sub Sub-Page</Typography>
                                    <FormControl size="small" fullWidth>

                                        <Selects size="small"

                                            options={subsubpageOptions}
                                            value={{ value: datas.subsubpage, label: datas.subsubpage }}
                                            onChange={(e) => {

                                                setDatas((prev) => ({
                                                    ...prev, subsubpage: e.value,
                                                }))
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <Typography>Tool Tip Description<b style={{ color: "red" }}>*</b></Typography>
                                    <FormControl size="small" fullWidth>
                                        <TextArea
                                            value={datas?.description}
                                            onChange={(e) => {
                                                setDatas((prev) => ({ ...prev, description: e.target.value }))
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                            </Grid>
                            <br></br>
                            <br></br>
                            <br></br>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={2.5} lg={2.5}>
                                    <Button variant="contained" color="primary" onClick={fetchSubmit}>
                                        Add
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={6} md={2.5} lg={2.5}>
                                    <Button sx={userStyle.btncancel} onClick={handleclear}>
                                        Clear
                                    </Button>
                                </Grid>

                            </Grid>
                            <br />
                            <br />

                            <Typography>
                                <b>Tool Tip Description List </b>
                            </Typography>
                            <br></br>

                            {roleEditOptions.length > 0 &&
                                roleEditOptions.map((data, index) => {
                                    return (
                                        <Accordion key={data?.modulename}>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography><b>{data?.modulename}</b></Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <TableContainer component={Paper}>
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell><b>Module Name</b></TableCell>
                                                                <TableCell><b>Sub-Module Name</b></TableCell>
                                                                <TableCell><b>Main Page Name</b></TableCell>
                                                                <TableCell><b>Sub-Page Name</b></TableCell>
                                                                <TableCell><b>Sub-Sub-Page Name</b></TableCell>
                                                                <TableCell><b>Description</b></TableCell>
                                                                <TableCell><b>Actions</b></TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {data?.submodules?.map((data, index) => (
                                                                <TableRow key={index}>
                                                                    <TableCell sx={{ fontSize: '1rem !important' }}>{data.modulename}</TableCell>
                                                                    <TableCell sx={{ fontSize: '1rem !important' }}>{data.submodulename}</TableCell>
                                                                    <TableCell sx={{ fontSize: '1rem !important' }}>{data.mainpagename}</TableCell>
                                                                    <TableCell sx={{ fontSize: '1rem !important' }}>{data.subpagename}</TableCell>
                                                                    <TableCell sx={{ fontSize: '1rem !important' }}>{data.subsubpagename}</TableCell>
                                                                    <TableCell sx={{ fontSize: '1rem !important', wordBreak: 'break-word', width: '13rem' }}>{data.description}</TableCell>
                                                                    {changeControl && getIndex === index ? (
                                                                        <>
                                                                            <TableCell>
                                                                                <TextArea
                                                                                    minRows={3}
                                                                                    style={{ width: '13rem' }}
                                                                                    placeholder="Please Enter the Description"
                                                                                    value={descriptions[index]}
                                                                                    onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                                                                />
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Button onClick={() => UpdateControls(data?._id, index)}>
                                                                                    <CheckCircleIcon />
                                                                                </Button>
                                                                            </TableCell>
                                                                        </>
                                                                    ) : (
                                                                        <>

                                                                            <TableCell>
                                                                                <Button onClick={() => EditControls(index)}>
                                                                                    <EditOutlined />
                                                                                </Button>
                                                                            </TableCell>
                                                                        </>
                                                                    )}

                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </AccordionDetails>
                                        </Accordion>
                                    );
                                })}
                            { }
                            <br />
                            <br />
                            <br />


                        </>
                    </Box>
                </>
            )}
            {/* ALERT DIALOG */}
            <Box>
                <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleCloseerr}>
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            {/* Delete Modal */}
            <Box>
                {/* ALERT DIALOG */}
                <Dialog open={isDeleteOpen} onClose={handleCloseDel} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                        <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                            Are you sure?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDel} sx={userStyle.btncancel}>
                            Cancel
                        </Button>
                        <Button autoFocus variant="contained" color="error">
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>


        </Box>
    );
}

export default TooltipDescription;