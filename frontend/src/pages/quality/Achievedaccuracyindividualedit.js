import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    Grid,
    OutlinedInput,
    Typography,
} from "@mui/material";
import axios from "axios";
import "jspdf-autotable";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Selects from "react-select";
import AlertDialog from "../../components/Alert";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import MessageAlert from "../../components/MessageAlert";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";

function AchievedAccuracyIndividualEdit() {
    
    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        setOpenPopupMalert(true);
    };
    const handleClosePopupMalert = () => {
        setOpenPopupMalert(false);
    };
    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupSeverity, setPopupSeverity] = useState("");
    const handleClickOpenPopup = () => {
        setOpenPopup(true);
    };
    const handleClosePopup = () => {
        setOpenPopup(false);
    }

    const backPage = useNavigate();

    const [vendor, setVendor] = useState([]);
    const [vendorUpdatedBy, setVendorUpdatedBy] = useState();
    const { isUserRoleAccess, setPageName, pageName, isUserRoleCompare, buttonStyles } = useContext(
        UserRoleAccessContext
    );
    const { auth } = useContext(AuthContext);
    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Edit Achieved Accuracy Individual"),
            commonid: String(isUserRoleAccess?._id),
            date: String(new Date()),

            addedby: [
                {
                    name: String(isUserRoleAccess?.username),
                    date: String(new Date()),
                },
            ],
        });

    }

    useEffect(() => {
        getapi();
    }, []);

    const[NA,setNA]=useState("");

    useEffect(() => {
        fetchProjectDropdowns();
    }, []);
    let subid = useParams().subid;
    let mainid = useParams().mainid;
    useEffect(() => {
        getinfoCode();
    }, [subid, mainid]);
    const [vendorArray, setVendorArray] = useState([]);
    const [fileName, setFileName] = useState("");


    // get single row to view....
    const getinfoCode = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.SINGLEACHEIVEDACCURACYINDIVIDUAL}/${mainid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const result = res?.data?.sachievedaccuracyindividual?.uploaddata.filter(
                (item) => item._id === subid
            );
            setVendor(result[0]);
            setNA(result[0].accuracy.trim().toLowerCase());
            
            setAcheivedAccuracyDetails(result[0])
            setFileName(res?.data?.sachievedaccuracyindividual?.filename);
            setVendorUpdatedBy(res?.data?.sachievedaccuracyindividual?.updatedby);
            await fetchQueueDropdowns({value:res?.data?.sachievedaccuracyindividual?.project}); fetchVendorDropdowns({value:res?.data?.sachievedaccuracyindividual?.project});
            setVendorArray(
                res?.data?.sachievedaccuracyindividual?.uploaddata.filter(
                    (item) => item._id !== subid
                )
            );
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);}
    };

    // Error Popup model
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    const [acheivedAccuracyDetails, setAcheivedAccuracyDetails] = useState({
        project: "Please Select Project",
        vendor: "Please Select Vendor",
        queue: "Please Select Queue",
        date: "", accuracy: "", loginid: "", totalfield: "", 
    });

    const [queueOption, setQueueOption] = useState([]);
    const [projectOpt, setProjectopt] = useState([]);
    const [vendorOpt, setVendoropt] = useState([]);


    
    const fetchProjectDropdowns = async () => {
        setPageName(!pageName)
        try {
            let res_category = await axios.get(SERVICE.PROJECTMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const companyall = [
                ...res_category?.data?.projmaster.map((d) => ({
                    ...d,
                    label: d.name,
                    value: d.name,
                })),
            ];

            setProjectopt(companyall);
            
       } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);}
    };


    const fetchQueueDropdowns = async (e) => {
        setPageName(!pageName)
        try {
            let res_project = await axios.get(SERVICE.ACCURACYMASTERGETALL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let result = res_project.data.accuracymaster.filter((d) => d.projectvendor === e.value);

            const catall = result.map((d) => ({
                ...d,
                label: d.queue,
                value: d.queue,
            }));

            setQueueOption(catall);
       } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);}
    };

    
    const fetchVendorDropdowns = async (e) => {
        setPageName(!pageName)
        try {
            let res_project = await axios.get(SERVICE.VENDORMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let result = res_project.data.vendormaster.filter((d) => d.projectname === e.value);

            const catall = result.map((d) => ({
                ...d,
                label: d.projectname + '_' + d.name,
                value: d.projectname + '_' + d.name,
            }));

            setVendoropt(catall);
       } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);}
    };

    //add function
    const sendRequest = async () => {
        setPageName(!pageName)
        try {
            let updatesingledata = await axios.put(
                `${SERVICE.SINGLEACHEIVEDACCURACYINDIVIDUALUPLOAD}/${subid}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    date: String(acheivedAccuracyDetails.date),
                    project: String(acheivedAccuracyDetails.project),
                    vendor: String(acheivedAccuracyDetails.vendor),
                    queue: String(acheivedAccuracyDetails.queue),
                    loginid: String(acheivedAccuracyDetails.loginid),
                    accuracy: String(acheivedAccuracyDetails.accuracy),
                    totalfield: String(acheivedAccuracyDetails.totalfield),

                    
                }
            );
            let updatedata = await axios.put(
                `${SERVICE.SINGLEACHEIVEDACCURACYINDIVIDUAL}/${mainid}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    updatedby: [
                        ...vendorUpdatedBy,
                        { name: String(isUserRoleAccess.companyname), date: String(new Date()) },
                    ],
                }
            );
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setTimeout(()=>{
                backPage("/quality/accuracy/acheivedaccuracyindividual");
            },1000)
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);}
    };

    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
       

        const isNameMatch = vendorArray.some(
            (item) =>
                item.project === acheivedAccuracyDetails.project &&
                item.vendor === acheivedAccuracyDetails.vendor &&
                item.queue === acheivedAccuracyDetails.queue &&
                item.team === acheivedAccuracyDetails.team &&
                item.date === acheivedAccuracyDetails.date &&
                item.loginid?.toLowerCase().trim() == acheivedAccuracyDetails.loginid?.toLowerCase().trim() &&
                item.totalfield?.toLowerCase() == acheivedAccuracyDetails.totalfield?.toLowerCase() &&
                item.accuracy == acheivedAccuracyDetails.accuracy
        );

        if (acheivedAccuracyDetails.date === "" || acheivedAccuracyDetails.date === undefined) {

            setPopupContentMalert("Please Select Date!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else if (
            acheivedAccuracyDetails.project === "Please Select Project" ||
            acheivedAccuracyDetails.project === "" ||
            acheivedAccuracyDetails.project == undefined
        ) {

            setPopupContentMalert("Please Select Project!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            acheivedAccuracyDetails.vendor === "Please Select Vendor" ||
            acheivedAccuracyDetails.vendor === "" ||
            acheivedAccuracyDetails.vendor == undefined
        ) {

            
            setPopupContentMalert("Please Select Vendor!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            acheivedAccuracyDetails.queue === "Please Select Queue" ||
            acheivedAccuracyDetails.queue === "" ||
            acheivedAccuracyDetails.queue == undefined
        ) {

            setPopupContentMalert("Please Select Queue!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }  else if (acheivedAccuracyDetails.loginid === "" || acheivedAccuracyDetails.loginid === undefined) {

            
            setPopupContentMalert("Please Enter Login ID!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (acheivedAccuracyDetails.accuracy === "" || acheivedAccuracyDetails.accuracy === undefined) {

            
            setPopupContentMalert("Please Enter Accuracy!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (acheivedAccuracyDetails.totalfield === "" || acheivedAccuracyDetails.totalfield === undefined) {

            
            setPopupContentMalert("Please Enter Total Field!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        
        
         else if (isNameMatch) {

            
            setPopupContentMalert("Data Already Exist!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            sendRequest();
        }
    };

    return (
        <Box>
            <Headtitle title={"EDIT ACHIEVED ACCURACY INDIVIDUAL"} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Edit Achieved Accuracy Individual</Typography>
            <>
                {isUserRoleCompare?.includes("eacheivedaccuracyindividual") && (
                    <Box sx={userStyle.dialogbox}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    {" "}
                                    <Typography sx={{ fontWeight: "bold" }}>
                                        Edit {fileName}
                                    </Typography>{" "}
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Date<b style={{ color: "red" }}>*</b>  </Typography>
                                        <OutlinedInput id="myDateInput" type="date" value={acheivedAccuracyDetails.date} onChange={(e) => {
                                            setAcheivedAccuracyDetails((prev) => ({
                                                ...prev, date: e.target.value
                                            })
                                            )
                                        }} />
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Project <b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={projectOpt}
                                            styles={colourStyles}
                                            value={{
                                                label: acheivedAccuracyDetails.project,
                                                value: acheivedAccuracyDetails.project,
                                            }}
                                            onChange={(e) => {

                                                setAcheivedAccuracyDetails({
                                                    ...acheivedAccuracyDetails,
                                                    project: e.value,
                                                    queue: "Please Select Queue",
                                                    vendor: "Please Select Vendor", minimumaccuracy: ""

                                                });
                                                fetchQueueDropdowns(e);
                                                fetchVendorDropdowns(e);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Vendor <b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={vendorOpt}
                                            styles={colourStyles}
                                            value={{
                                                label: acheivedAccuracyDetails.vendor,
                                                value: acheivedAccuracyDetails.vendor,
                                            }}
                                            onChange={(e) => {

                                                setAcheivedAccuracyDetails({
                                                    ...acheivedAccuracyDetails,
                                                    vendor: e.value,

                                                });

                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Queue<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={queueOption}
                                            styles={colourStyles}
                                            value={{
                                                label: acheivedAccuracyDetails.queue,
                                                value: acheivedAccuracyDetails.queue,
                                            }}
                                            onChange={(e) => {

                                                
                                                setAcheivedAccuracyDetails({
                                                    ...acheivedAccuracyDetails,
                                                    queue: e.value,
                                                });
                                                setAcheivedAccuracyDetails((prev) => ({ ...prev, acheivedaccuracy: "", clientstatus: "", internalstatus: "" }))
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                
                                
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Login ID<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={acheivedAccuracyDetails.loginid}
                                            onChange={(e) => {
                                                setAcheivedAccuracyDetails((prev)=>({
                                                    ...prev,loginid:e.target.value
                                                }))
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Accuracy<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type={NA==="na"?"text":"number"}
                                            sx={userStyle.input}
                                            inputProps={{
                                                min: -100000,
                                                max: 100000,
                                                step: 0.01,
                                                pattern: "\\d*\\.?\\d{0,10}"
                                            }}
                                            value={acheivedAccuracyDetails.accuracy}
                                            onChange={(e) => {
                                                const newValue = e.target.value;
                                                // Check if the new value matches the allowed pattern
                                                const isValid = /^(-?\d{0,6}(\.\d{0,10})?|1000000(\.00?)?)$/.test(newValue);

                                                if (isValid || newValue === '') {
                                                    setAcheivedAccuracyDetails(prev => ({
                                                        ...prev,accuracy:newValue
                                                        
                                                    }));
                                                }
                                                setNA(newValue)
                                                
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Total Field<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={acheivedAccuracyDetails.totalfield}
                                            onChange={(e) => {
                                                setAcheivedAccuracyDetails((prev)=>({
                                                    ...prev,totalfield:e.target.value
                                                }))
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                
                                
                            </Grid>
                            <br /> <br />
                            <br /> <br />
                            <Grid
                                container
                                spacing={2}
                                sx={{ display: "flex", justifyContent: "center" }}
                            >
                                <Grid item lg={1} md={2} sm={2} xs={12}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={buttonStyles.buttonsubmit}
                                        onClick={(e) => handleSubmit(e)}
                                    >
                                        Update
                                    </Button>
                                </Grid>
                                <Grid item lg={1} md={2} sm={2} xs={12}>
                                    <Link
                                        to="/quality/accuracy/acheivedaccuracyindividual"
                                        style={{
                                            textDecoration: "none",
                                            color: "white",
                                            float: "right",
                                        }}
                                    >
                                        <Button sx={buttonStyles.btncancel}>Cancel</Button>
                                    </Link>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                )}
            </>
            <br />

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
                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleCloseerr}>
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            <MessageAlert
                openPopup={openPopupMalert}
                handleClosePopup={handleClosePopupMalert}
                popupContent={popupContentMalert}
                popupSeverity={popupSeverityMalert}
            />
            {/* SUCCESS */}
            <AlertDialog
                openPopup={openPopup}
                handleClosePopup={handleClosePopup}
                popupContent={popupContent}
                popupSeverity={popupSeverity}
            />

        </Box>
    );
}
export default AchievedAccuracyIndividualEdit;
