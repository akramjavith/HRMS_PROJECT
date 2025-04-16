import React, { useState, useEffect, useRef, useContext } from "react";
import { colourStyles } from "../../pageStyle";
import { Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, Paper, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle } from "../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import StyledDataGrid from "../../components/TableStyle";
import { handleApiError } from "../../components/Errorhandling";
import jsPDF from "jspdf"; 
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import Selects from "react-select";

function AcheivedAccurayInternalStatus() {
    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [loader, setLoader] = useState(false);
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const [openview, setOpenview] = useState(false);
    const [openInfo, setOpeninfo] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isSubmit, setIsSubmit] = useState(false);
    const [isSubmitEdit, setIsSubmitEdit] = useState(false);
    const [submitMessage, setSubmitMessage] = useState("");



    const [isEditOpen, setIsEditOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [copiedData, setCopiedData] = useState("");
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        date: true,
        project: true,
        vendor: true,
        queue: true,
        acheivedaccuracy: true,
        clientstatus: true,
        internalstatus: true,
        // statusmode: true,
        // percentage: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);



    const [accuracyMasterArray, setAccuracyMasterArray] = useState([]);

    //useEffect
    useEffect(() => {
        addSerialNumber();
    }, [accuracyMasterArray]);

    useEffect(() => {
        fetchAccuracyMaster();
    }, []);
    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };
    // Error Popup model
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    // view model
    const handleClickOpenview = () => {
        setOpenview(true);
    };
    const handleCloseview = () => {
        setOpenview(false);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    // info model
    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };
    const handleCloseinfo = () => {
        setOpeninfo(false);
    };
    //Delete model
    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = () => {
        setIsDeleteOpen(false);
    };
    const handleCloseModSubmit = () => {
        setIsSubmit(false);
    };
    const handleCloseModSubmitEdit = () => {
        setIsSubmitEdit(false);
    };
    // page refersh reload
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };
    const username = isUserRoleAccess.username;
    // Manage Columns
    const handleOpenManageColumns = (event) => {
        setAnchorEl(event.currentTarget);
        setManageColumnsOpen(true);
    };
    const handleCloseManageColumns = () => {
        setManageColumnsOpen(false);
        setSearchQueryManage("");
    };
    //Delete model
    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

    const handleClickOpencheckbox = () => {
        setIsDeleteOpencheckbox(true);
    };
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
    };
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
    const handleClickOpenalert = () => {
        if (selectedRows.length === 0) {
            setIsDeleteOpenalert(true);
        } else {
            setIsDeleteOpencheckbox(true);
        }
    };
    const handleCloseModalert = () => {
        setIsDeleteOpenalert(false);
    };
    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;
    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };
  
    const gettingValues = async (newValue) => {
        if (newValue.length < 2) {
            setAcheivedAccuracyDetails((prev) => ({
                ...prev, internalstatus: ""
            }))
        }
        try {
            let res_data = await axios.post(SERVICE.EXPECTEDACCURACY_SINGLEBYDETAILS, {
                project: acheivedAccuracyDetails.project,
                // vendor: acheivedAccuracyDetails.vendor,
                queue: acheivedAccuracyDetails.queue,
                acheivedaccuracy: Number(newValue)
            })
            res_data.data.existinglist.map((data) => {
                // if (data.mode === "Client") {
                //     setAcheivedAccuracyDetails((prev) => ({
                //         ...prev, clientstatus: `${data.statusmode} ${data.percentage} %`,
                //     }))
                // }
                if (data.mode === "Internal") {
                    setAcheivedAccuracyDetails((prev) => ({
                        ...prev, internalstatus: `${data.statusmode} ${data.percentage} %`,
                    }))
                }
            })


        } catch (err) {
            setAcheivedAccuracyDetails((prev)=>({...prev, internalstatus: ""}))
        
        }
    }

    const gettingValuesEdit = async (newValue) => {
        
        if (newValue.length < 2) {
            setAcheivedAccuracyDetailsEdit((prev) => ({
                ...prev, internalstatus: ""
            }))
        }
        try {
            let res_data = await axios.post(SERVICE.EXPECTEDACCURACY_SINGLEBYDETAILS, {
                project: acheivedAccuracyDetailsEdit.project,
                // vendor: acheivedAccuracyDetailsEdit.vendor,
                queue: acheivedAccuracyDetailsEdit.queue,
                acheivedaccuracy: Number(newValue)
            })
            res_data?.data?.existinglist.map((data) => {
                if (data.mode === "Internal") {
                    setAcheivedAccuracyDetailsEdit((prev) => ({
                        ...prev, internalstatus: `${data.statusmode} ${data.percentage} %`,
                    }))
                }
            })


        } catch (err) {
          
            setAcheivedAccuracyDetailsEdit((prev) => ({
                ...prev, internalstatus: ""
            }))
            
        }
    }

    const [selectedMode, setSelectedMode] = useState("Please Select Mode");
    const [selectedStatusMode, setSelectedStatusMode] = useState("Please Select Status Mode");
    const [acheivedAccuracyDetails, setAcheivedAccuracyDetails] = useState({
        project: "Please Select Project",
        vendor: "Please Select Vendor",
        queue: "Please Select Queue",
        date: "", acheivedaccuracy: "",  internalstatus: ""
    });

    const [selectedModeEdit, setSelectedModeEdit] = useState("Please Select Mode");
    const [selectedStatusModeEdit, setSelectedStatusModeEdit] = useState("Please Select Status Mode");

    const [acheivedAccuracyDetailsEdit, setAcheivedAccuracyDetailsEdit] = useState({
        project: "Please Select Project",
        vendor : "Please Select Vendor",
        queue: "Please Select Queue",
        date: "", acheivedaccuracy: "", internalstatus: ""
    });

    const [queueOption, setQueueOption] = useState([]);
    const [projectOpt, setProjectopt] = useState([]);
    const [vendorOpt, setVendoropt] = useState([]);

    const [queueOptionEdit, setQueueOptionEdit] = useState([]);
    const [projectOptEdit, setProjectoptEdit] = useState([]);
    const [vendorOptEdit, setVendoroptEdit] = useState([]);

    const [accuracyMasterEdit, setAccuracyMasterEdit] = useState({ project: "Please Select Project", });
   
    const fetchProjectDropdowns = async () => {
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
            setProjectoptEdit(companyall);
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    const fetchVendorDropdowns = async (e) => {
        try {
            let res_project = await axios.get(SERVICE.VENDORMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let result = res_project.data.vendormaster.filter((d) => d.projectname === e.value);

            const catall = result.map((d) => ({
                ...d,
                label: d.projectname + '_'+ d.name,
                value: d.projectname + '_'+ d.name,
            }));

            setVendoropt(catall);
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const fetchVendorDropdownsEdit = async (e) => {
        try {
            let res_project = await axios.get(SERVICE.VENDORMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let result = res_project.data.vendormaster.filter((d) => d.projectname === e);

            const catall = result.map((d) => ({
                ...d,
                label: d.projectname + '_'+ d.name,
                value: d.projectname + '_'+ d.name,
            }));

            setVendoroptEdit(catall);
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    const fetchQueueDropdowns = async (e) => {
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
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const fetchQueueDropdownsEdit = async (e) => {
        try {
            let res_project = await axios.get(SERVICE.ACCURACYMASTERGETALL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let result = res_project.data.accuracymaster.filter((d) => d.projectvendor === e);

            const catall = result.map((d) => ({
                ...d,
                label: d.queue,
                value: d.queue,
            }));

            setQueueOptionEdit(catall);
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    useEffect(() => {
        fetchProjectDropdowns();
    }, []);



    const fetchAccuracyMaster = async () => {
        try {
            let res_freq = await axios.get(SERVICE.ACHEIVEDACCURACYINTERNALGETALL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setLoader(true);
            setAccuracyMasterArray(res_freq?.data?.acheivedaccuracy);
        } catch (err) {setLoader(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //set function to get particular row
    const rowData = async (id) => {
        try {
            let res = await axios.get(`${SERVICE.ACHEIVEDACCURACYINTERNAL_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setAcheivedAccuracyDetailsEdit(res?.data?.sacheivedaccuracy);
            handleClickOpen();
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };
    // Alert delete popup
    let brandid = acheivedAccuracyDetailsEdit._id;
    const delBrand = async () => {
        try {
            await axios.delete(`${SERVICE.ACHEIVEDACCURACYINTERNAL_SINGLE}/${brandid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            await fetchAccuracyMaster();
            handleCloseMod();
            setSelectedRows([]);
            setPage(1);
            setShowAlert(
                <>
                    <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7ac767" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Deleted Successfully 👍"}</p>
                </>
            );
            handleClickOpenerr();
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //add function
    const sendRequest = async () => {
       
        handleCloseModSubmit()
        try {
            await axios.post(SERVICE.ACHEIVEDACCURACYINTERNAL_CREATE, {
                date: String(acheivedAccuracyDetails.date),
                project: String(acheivedAccuracyDetails.project),
                vendor: String(acheivedAccuracyDetails.vendor),
                queue: String(acheivedAccuracyDetails.queue),
                acheivedaccuracy: acheivedAccuracyDetails.acheivedaccuracy,
                // clientstatus: acheivedAccuracyDetails.clientstatus,
                internalstatus: acheivedAccuracyDetails.internalstatus,
                // expectedaccuracyfrom: expectedAccuracyDetails.from,
                // expectedaccuracyto: expectedAccuracyDetails.to,
                // statusmode: selectedStatusMode,
                // percentage: expectedAccuracyDetails.percentage,
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchAccuracyMaster();
  
            setSelectedMode("Please Select Mode")
            setSelectedStatusMode("Please Select Status Mode")
            setAcheivedAccuracyDetails({ ...acheivedAccuracyDetails,date: "", acheivedaccuracy: "", clientstatus: "", internalstatus: "" })
            // setExpectedAccuracyDetails({
            //     from: "", to: "", percentage: ""
            // })
            setShowAlert(
                <>
                    <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7ac767" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Added Successfully 👍"}</p>
                </>
            );
            handleClickOpenerr();
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        if (acheivedAccuracyDetails.date === "" || acheivedAccuracyDetails.date === undefined) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Fill the Date"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (acheivedAccuracyDetails.project === 'Please Select Project') {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Project"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (acheivedAccuracyDetails.vendor === 'Please Select Vendor') {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Project"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (acheivedAccuracyDetails.queue === "Please Select Queue") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Queue"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (acheivedAccuracyDetails.acheivedaccuracy === "" || acheivedAccuracyDetails.acheivedaccuracy === undefined) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Achieved Accuracy Value"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if ((acheivedAccuracyDetails.internalstatus === "" || acheivedAccuracyDetails.internalstatus === undefined)) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Internal Status is Must ! "}</p>
                </>
            );
            handleClickOpenerr();
        }
        // else if (acheivedAccuracyDetails.clientstatus === "" || acheivedAccuracyDetails.clientstatus === undefined) {
        //     setSubmitMessage(`Client Status Field is Empty!\nAre you sure to continue ?`);
        //     setIsSubmit(true);
        // }
        // else if (acheivedAccuracyDetails.internalstatus === "" || acheivedAccuracyDetails.internalstatus === undefined) {
        //     setSubmitMessage(`Internal Status Field is Empty!\nAre you sure to continue ?`);
        //     setIsSubmit(true);
        // }

        else {
            sendRequest();
        }
    };

    const handleclear = (e) => {
        e.preventDefault();
        setSelectedMode("Please Select Mode")
        setSelectedStatusMode("Please Select Status Mode")
        setAcheivedAccuracyDetails({ date: "", acheivedaccuracy: "", clientstatus: "", internalstatus: "" ,project: "Please Select Project",
    vendor:"Please Select Vendor", queue: "Please Select Queue"
})
        // setExpectedAccuracyDetails({
        //     from: "", to: "", percentage: ""
        // })
        setShowAlert(
            <>
                <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7AC767" }} />
                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Cleared Successfully"}</p>
            </>
        );
        handleClickOpenerr();
    };
    //Edit model...
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
    };
    //get single row to edit....
    const getCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.ACHEIVEDACCURACYINTERNAL_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAcheivedAccuracyDetailsEdit(res?.data?.sacheivedaccuracy);
            fetchQueueDropdownsEdit(res?.data?.sacheivedaccuracy.project);
            fetchVendorDropdownsEdit(res?.data?.sacheivedaccuracy.project);
            
            setSelectedModeEdit(res?.data?.sacheivedaccuracy.mode)
            setSelectedStatusModeEdit(res?.data?.sacheivedaccuracy.statusmode)
            
            setAcheivedAccuracyDetailsEdit((prev) => ({
                ...prev, date: moment(res?.data?.sacheivedaccuracy.date).format('YYYY-MM-DD'),
                project: res?.data?.sacheivedaccuracy.project, vendor: res?.data?.sacheivedaccuracy.vendor,
                queue: res?.data?.sacheivedaccuracy.queue,clientstatus: res?.data?.sacheivedaccuracy.clientstatus, internalstatus: res?.data?.sacheivedaccuracy.internalstatus, acheivedaccuracy: res.data.sacheivedaccuracy.acheivedaccuracy
            }))

            handleClickOpenEdit();
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    // get single row to view....
    const getviewCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.ACHEIVEDACCURACYINTERNAL_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAcheivedAccuracyDetailsEdit(res?.data?.sacheivedaccuracy);
            handleClickOpenview();
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };
    // get single row to view....
    const getinfoCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.ACHEIVEDACCURACYINTERNAL_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAcheivedAccuracyDetailsEdit(res?.data?.sacheivedaccuracy);
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };
    //frequency master name updateby edit page...
    let updateby = acheivedAccuracyDetailsEdit.updatedby;
    let addedby = acheivedAccuracyDetailsEdit.addedby;
    let frequencyId = acheivedAccuracyDetailsEdit._id;

    //editing the single data...
    const sendEditRequest = async () => {
        // handleCloseModSubmit()       
        try {
            let res = await axios.put(`${SERVICE.ACHEIVEDACCURACYINTERNAL_SINGLE}/${frequencyId}`, {
                
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                date: String(acheivedAccuracyDetailsEdit.date),
                project: String(acheivedAccuracyDetailsEdit.project),
                vendor: String(acheivedAccuracyDetailsEdit.vendor),
                queue: String(acheivedAccuracyDetailsEdit.queue),
                acheivedaccuracy: acheivedAccuracyDetailsEdit.acheivedaccuracy,
                // clientstatus: acheivedAccuracyDetailsEdit.clientstatus,
                internalstatus: acheivedAccuracyDetailsEdit.internalstatus,
                // statusmode: selectedStatusModeEdit,
                updatedby: [
                    ...updateby,
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            handleCloseModEdit();
            await fetchAccuracyMaster();
            handleCloseModSubmitEdit();
            setShowAlert(
                <>
                    <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7ac767" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Updated Successfully👍"}</p>
                </>
            );
            handleClickOpenerr();
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const editSubmit = (e) => {
        e.preventDefault();
        if (acheivedAccuracyDetailsEdit.date === "" || acheivedAccuracyDetailsEdit.date === undefined) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Fill the Date"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (acheivedAccuracyDetailsEdit.project === 'Please Select Project') {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Project"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (acheivedAccuracyDetailsEdit.vendor === 'Please Select Vendor') {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Vendor"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (acheivedAccuracyDetailsEdit.queue === "Please Select Queue") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Queue"}</p>
                </>
            );
            handleClickOpenerr();
        }
    
        else if (acheivedAccuracyDetailsEdit.acheivedaccuracy === "" || acheivedAccuracyDetailsEdit.acheivedaccuracy === undefined) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Achieved Accuracy Value"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if ((acheivedAccuracyDetailsEdit.internalstatus === "" || acheivedAccuracyDetailsEdit.internalstatus === undefined)) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Internal Status is Must ! "}</p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            sendEditRequest();
        }
    };
    const delAreagrpcheckbox = async () => {
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.ACHEIVEDACCURACYINTERNAL_SINGLE}/${item}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
            });
            // Wait for all delete requests to complete
            await Promise.all(deletePromises);
            handleCloseModcheckbox();
            setSelectedRows([]);
            setSelectAllChecked(false);
            setPage(1);

            await fetchAccuracyMaster();
            setShowAlert(
                <>
                    <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7ac767" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Deleted Successfully 👍"}</p>
                </>
            );
            handleClickOpenerr();
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Achieved Accuracy Internal Status.png");
                });
            });
        }
    };
    // pdf.....
    const columns = [
        { title: "Sno", field: "serialNumber" },
        { title: "Date", field: "date" },
        { title: "Project", field: "project" },
        { title: "Vendor", field: "vendor" },
        { title: "Queue", field: "queue" },
        { title: "Achieved Accuracy", field: "acheivedaccuracy" },
        // { title: "Client Status", field: "clientstatus" },
        { title: "Internal Status", field: "internalstatus" },

        // { title: "Code", field: "code" },
    ];
    //  pdf download functionality
    const downloadPdf = () => {
        const doc = new jsPDF();
        doc.autoTable({
            theme: "grid",
            columns: columns.map((col) => ({ ...col, dataKey: col.field })),
            body: rowDataTable,
            styles:{fontSize:5}
        });
        doc.save("Achieved Accuracy Internal Status.pdf");
    };
    // Excel
    const fileName = "Achieved Accuracy Internal Status";
    // get particular columns for export excel

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Achieved Accuracy Internal Status",
        pageStyle: "print",
    });

    //serial no for listing items
    const addSerialNumber = () => {
        const itemsWithSerialNumber = accuracyMasterArray?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
        }));
        setItems(itemsWithSerialNumber);
    };
    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSelectedRows([]);
        setSelectAllChecked(false);
    };
    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setSelectedRows([]);
        setSelectAllChecked(false);
        setPage(1);
    };
    //datatable....
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(1);
    };

    // Split the search query into individual terms
    const searchTerms = searchQuery.toLowerCase().split(" ");

    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });

    const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);
    const totalPages = Math.ceil(filteredDatas?.length / pageSize);
    const visiblePages = Math.min(totalPages, 3);
    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);
    const pageNumbers = [];
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
        </div>
    );
    const columnDataTable = [
        {
            field: "checkbox",
            headerName: "Checkbox",
            headerStyle: {
                fontWeight: "bold", // Apply the font-weight style to make the header text bold
                // Add any other CSS styles as needed
            },
            renderHeader: (params) => (
                <CheckboxHeader
                    selectAllChecked={selectAllChecked}
                    onSelectAll={() => {
                        if (rowDataTable.length === 0) {
                            // Do not allow checking when there are no rows
                            return;
                        }
                        if (selectAllChecked) {
                            setSelectedRows([]);
                        } else {
                            const allRowIds = rowDataTable.map((row) => row.id);
                            setSelectedRows(allRowIds);
                        }
                        setSelectAllChecked(!selectAllChecked);
                    }}
                />
            ),

            renderCell: (params) => (
                <Checkbox
                    checked={selectedRows.includes(params.row.id)}
                    onChange={() => {
                        let updatedSelectedRows;
                        if (selectedRows.includes(params.row.id)) {
                            updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.row.id);
                        } else {
                            updatedSelectedRows = [...selectedRows, params.row.id];
                        }
                        setSelectedRows(updatedSelectedRows);
                        // Update the "Select All" checkbox based on whether all rows are selected
                        setSelectAllChecked(updatedSelectedRows.length === filteredData.length);
                    }}
                />
            ),
            sortable: false, // Optionally, you can make this column not sortable
            width: 75,
            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 75,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },
        {
            field: "date",
            headerName: "Date",
            flex: 0,
            width: 100,
            hide: !columnVisibility.date,
            headerClassName: "bold-header",
        },
        {
            field: "project",
            headerName: "Project",
            flex: 0,
            width: 200,
            hide: !columnVisibility.project,
            headerClassName: "bold-header",
        },
        {
            field: "vendor",
            headerName: "Vendor",
            flex: 0,
            width: 200,
            hide: !columnVisibility.vendor,
            headerClassName: "bold-header",
        },
        {
            field: "queue",
            headerName: "Queue",
            flex: 0,
            width: 200,
            hide: !columnVisibility.queue,
            headerClassName: "bold-header",
        },
        {
            field: "acheivedaccuracy",
            headerName: "Achieved Accuracy",
            flex: 0,
            width: 150,
            hide: !columnVisibility.acheivedaccuracy,
            headerClassName: "bold-header",
        },
        // {
        //     field: "clientstatus",
        //     headerName: "Client Status",
        //     flex: 0,
        //     width: 150,
        //     hide: !columnVisibility.clientstatus,
        //     headerClassName: "bold-header",
        // },
        // {
        //     field: "expectedaccuracyto",
        //     headerName: "Expected Accuracy To",
        //     flex: 0,
        //     width: 200,
        //     hide: !columnVisibility.expectedaccuracyto,
        //     headerClassName: "bold-header",
        // },
        {
            field: "internalstatus",
            headerName: "Internal Status",
            flex: 0,
            width: 150,
            hide: !columnVisibility.internalstatus,
            headerClassName: "bold-header",
        },
        // {
        //     field: "percentage",
        //     headerName: "Percentage",
        //     flex: 0,
        //     width: 200,
        //     hide: !columnVisibility.percentage,
        //     headerClassName: "bold-header",
        // },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 250,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            renderCell: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("eacheivedaccuracyinternalstatus") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getCode(params.row.id);
                            }}
                        >
                            <EditOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("dacheivedaccuracyinternalstatus") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.row.id);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vacheivedaccuracyinternalstatus") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.row.id);
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("iacheivedaccuracyinternalstatus") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                handleClickOpeninfo();
                                getinfoCode(params.row.id);
                            }}
                        >
                            <InfoOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                </Grid>
            ),
        },
    ];

    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            date: moment(item.date).format('DD-MM-YYYY'),
            project: item.project,
            vendor: item.vendor,
            queue: item.queue,
            acheivedaccuracy: item.acheivedaccuracy + "%",
            clientstatus: item.clientstatus,
            internalstatus: item.internalstatus,
            // expectedaccuracyto: item.expectedaccuracyto,
            // statusmode: item.statusmode,
            // percentage: `${item.percentage} %`

            // code: item.code,
        };
    });
    const rowsWithCheckboxes = rowDataTable.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRows.includes(row.id),
    }));
    // Show All Columns functionality
    const handleShowAllColumns = () => {
        const updatedVisibility = { ...columnVisibility };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibility(updatedVisibility);
    };
    // Function to filter columns based on search query
    const filteredColumns = columnDataTable.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));
    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };
    // JSX for the "Manage Columns" popover content
    const manageColumnsContent = (
        <Box
            style={{
                padding: "10px",
                minWidth: "325px",
                "& .MuiDialogContent-root": { padding: "10px 0" },
            }}
        >
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton
                aria-label="close"
                onClick={handleCloseManageColumns}
                sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <Box sx={{ position: "relative", margin: "10px" }}>
                <TextField label="Find column" variant="standard" fullWidth value={searchQueryManage} onChange={(e) => setSearchQueryManage(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
            </Box>
            <br />
            <br />
            <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumns.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText sx={{ display: "flex" }} primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />} secondary={column.field === "checkbox" ? "Checkbox" : column.headerName} />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item md={4}>
                        <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibility(initialColumnVisibility)}>
                            {" "}
                            Show All
                        </Button>
                    </Grid>
                    <Grid item md={4}></Grid>
                    <Grid item md={4}>
                        <Button
                            variant="text"
                            sx={{ textTransform: "none" }}
                            onClick={() => {
                                const newColumnVisibility = {};
                                columnDataTable.forEach((column) => {
                                    newColumnVisibility[column.field] = false; // Set hide property to true
                                });
                                setColumnVisibility(newColumnVisibility);
                            }}
                        >
                            {" "}
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );
    return (
        <Box>
            <Headtitle title={"ACHIEVED ACCURACY INTERNAL STATUS"} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Achieved Accuracy Internal Status</Typography>
            <>
                {isUserRoleCompare?.includes("aacheivedaccuracyinternalstatus") && (
                    <Box sx={userStyle.selectcontainer}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>Add Achieved Accuracy Internal Status</Typography>
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
                                                        vendor: "Please Select Vendor",

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
                                                    setAcheivedAccuracyDetails((prev)=>({...prev,acheivedaccuracy: "", clientstatus: "", internalstatus: ""}))
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>   

                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Achieved Accuracy %<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            sx={userStyle.input}
                                            inputProps={{
                                                min: 0,
                                                max: 100,
                                                step: 0.01,
                                                pattern: "\\d*\\.?\\d{0,2}"
                                            }}
                                            placeholder="Please Enter Percentage"
                                            value={acheivedAccuracyDetails.acheivedaccuracy}
                                            onChange={(e) => {
                                                const newValue = e.target.value;
                                                // Check if the new value matches the allowed pattern
                                                const isValid = /^(\d{0,2}(\.\d{0,2})?|100(\.00?)?)$/.test(newValue); // Update the regex
                                                if (isValid) {
                                                    setAcheivedAccuracyDetails(prev => ({
                                                        ...prev,
                                                        acheivedaccuracy: newValue
                                                    }));
                                                    gettingValues(newValue);
                                                }
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                {/* <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Client Status
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            sx={userStyle.input}
                                            // disabled={true}
                                            placeholder=""
                                            value={acheivedAccuracyDetails.clientstatus}
                                            onChange={(e) => {

                                            }}
                                        />
                                    </FormControl>
                                        </Grid>*/}
                               
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Internal Status
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            sx={userStyle.input}
                                            // disabled={true}
                                            placeholder=""
                                            value={acheivedAccuracyDetails.internalstatus}
                                            onChange={(e) => {

                                            }}
                                        />
                                    </FormControl>
                                </Grid> 
                            </Grid>
                            <br />
                            <br />
                            <Grid container>
                                <Grid item md={3} xs={12} sm={6}>
                                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                                        Submit
                                    </Button>
                                </Grid>
                                <Grid item md={3} xs={12} sm={6}>
                                    <Button sx={userStyle.btncancel} onClick={handleclear}>
                                        Clear
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                )}
            </>
            <br /> <br />
            {/* ****** Table Start ****** */}
            {
                isUserRoleCompare?.includes("lacheivedaccuracyinternalstatus") && (
                    <>
                        <Box sx={userStyle.container}>
                            {/* ******************************************************EXPORT Buttons****************************************************** */}
                            <Grid item xs={8}>
                                <Typography sx={userStyle.importheadtext}>List Achieved Accuracy Internal Status</Typography>
                            </Grid>
                            <Grid container spacing={2} style={userStyle.dataTablestyle}>
                                <Grid item md={2} xs={12} sm={12}>
                                    <Box>
                                        <label>Show entries:</label>
                                        <Select
                                            id="pageSizeSelect"
                                            value={pageSize}
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 180,
                                                        width: 80,
                                                    },
                                                },
                                            }}
                                            onChange={handlePageSizeChange}
                                            sx={{ width: "77px" }}
                                        >
                                            <MenuItem value={1}>1</MenuItem>
                                            <MenuItem value={5}>5</MenuItem>
                                            <MenuItem value={10}>10</MenuItem>
                                            <MenuItem value={25}>25</MenuItem>
                                            <MenuItem value={50}>50</MenuItem>
                                            <MenuItem value={100}>100</MenuItem>
                                            <MenuItem value={accuracyMasterArray?.length}>All</MenuItem>
                                        </Select>
                                    </Box>
                                </Grid>
                                <Grid
                                    item
                                    md={8}
                                    xs={12}
                                    sm={12}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Box>
                                        {isUserRoleCompare?.includes("excelacheivedaccuracyinternalstatus") && (
                                            <>
                                                <ExportXL csvData={rowDataTable.map((t, index) => ({
                                                    SNo: index + 1,
                                                    Date: t.date,
                                                    "Project": t.project,
                                                    "Vendor": t.vendor,
                                                    "Queue": t.queue,
                                                    "Achieved Accuracy": t.acheivedaccuracy,
                                                    // "Client Status": t.clientstatus,
                                                    "Internal Status": t.internalstatus,

                                                }))} fileName={fileName} />
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("csvacheivedaccuracyinternalstatus") && (
                                            <>
                                                <ExportCSV csvData={rowDataTable.map((t, index) => ({
                                                    SNo: index + 1,
                                                    Date: t.date,
                                                    "Project": t.project,
                                                    "Vendor": t.vendor,
                                                    "Queue": t.queue,
                                                    "Achieved Accuracy": t.acheivedaccuracy,
                                                    // "Client Status": t.clientstatus,
                                                    "Internal Status": t.internalstatus,
                                                }))} fileName={fileName} />
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("printacheivedaccuracyinternalstatus") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdfacheivedaccuracyinternalstatus") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}>
                                                    <FaFilePdf />
                                                    &ensp;Export to PDF&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("imageacheivedaccuracyinternalstatus") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                                    {" "}
                                                    <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                                </Button>
                                            </>
                                        )}
                                    </Box>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <Box>
                                        <FormControl fullWidth size="small">
                                            <Typography>Search</Typography>
                                            <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
                                        </FormControl>
                                    </Box>
                                </Grid>
                            </Grid>
                            <br />
                            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                                Show All Columns
                            </Button>
                            &ensp;
                            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
                                Manage Columns
                            </Button>
                            &ensp;
                            {isUserRoleCompare?.includes("bdacheivedaccuracyinternalstatus") && (
                                <>
                                    <Button variant="contained" color="error" onClick={handleClickOpenalert}>
                                        Bulk Delete
                                    </Button>
                                </>
                            )}
                            <br />
                            <br />
                            {!loader ? (
                                <Box sx={userStyle.container}>
                                    <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
                                        <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                    </Box>
                                </Box>
                            ) : (
                                <>
                                    <Box
                                        style={{
                                            width: "100%",
                                            overflowY: "hidden", // Hide the y-axis scrollbar
                                        }}
                                    >
                                        <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowsWithCheckboxes} columns={columnDataTable.filter((column) => columnVisibility[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true} ref={gridRef} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
                                    </Box>
                                    <Box style={userStyle.dataTablestyle}>
                                        <Box>
                                            Showing {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filteredDatas?.length)} of {filteredDatas?.length} entries
                                        </Box>
                                        <Box>
                                            <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                                <FirstPageIcon />
                                            </Button>
                                            <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                                <NavigateBeforeIcon />
                                            </Button>
                                            {pageNumbers?.map((pageNumber) => (
                                                <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={page === pageNumber ? "active" : ""} disabled={page === pageNumber}>
                                                    {pageNumber}
                                                </Button>
                                            ))}
                                            {lastVisiblePage < totalPages && <span>...</span>}
                                            <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                                <NavigateNextIcon />
                                            </Button>
                                            <Button onClick={() => setPage(totalPages)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                                <LastPageIcon />
                                            </Button>
                                        </Box>
                                    </Box>
                                </>
                            )}
                            {/* ****** Table End ****** */}
                        </Box>
                    </>
                )
            }
            {/* ****** Table End ****** */}
            {/* Manage Column */}
            <Popover
                id={id}
                open={isManageColumnsOpen}
                anchorEl={anchorEl}
                onClose={handleCloseManageColumns}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                {manageColumnsContent}
            </Popover>
            {/* print layout */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
                    <TableHead>
                        <TableRow>
                            <TableCell> SI.No</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Project</TableCell>
                            <TableCell>Vendor</TableCell>
                            <TableCell>Queue</TableCell>
                            <TableCell>Achieved Accuracy</TableCell>
                            {/* <TableCell>Client Status</TableCell> */}
                            <TableCell>Internal Status</TableCell>

                            {/* <TableCell>Code</TableCell> */}
                        </TableRow>
                    </TableHead>
                    <TableBody align="left">
                        {rowDataTable &&
                            rowDataTable.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.date}</TableCell>
                                    <TableCell>{row.project}</TableCell>
                                    <TableCell>{row.vendor}</TableCell>
                                    <TableCell>{row.queue}</TableCell>
                                    <TableCell>{row.acheivedaccuracy}</TableCell>
                                    {/* <TableCell>{row.clientstatus}</TableCell> */}
                                    <TableCell>{row.internalstatus}</TableCell>

                                    {/* <TableCell>{row.code}</TableCell> */}
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* this is info view details */}
            <Dialog open={openInfo} onClose={handleCloseinfo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <Box sx={{ width: "550px", padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>Achieved Accuracy Internal Status Info</Typography>
                        <br />
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">addedby</Typography>
                                    <br />
                                    <Table>
                                        <TableHead>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"UserName"}</StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                                        </TableHead>
                                        <TableBody>
                                            {addedby?.map((item, i) => (
                                                <StyledTableRow>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
                                                </StyledTableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </FormControl>
                            </Grid>
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Updated by</Typography>
                                    <br />
                                    <Table>
                                        <TableHead>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"UserName"}</StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                                        </TableHead>
                                        <TableBody>
                                            {updateby?.map((item, i) => (
                                                <StyledTableRow>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
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
            {/*Submit ALERT DIALOG */}
            <Dialog open={isSubmit} onClose={handleCloseModSubmit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ width: "400px", textAlign: "center", alignItems: "center" }}>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                    <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                        {submitMessage}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseModSubmit}
                        style={{
                            backgroundColor: "#f4f4f4",
                            color: "#444",
                            boxShadow: "none",
                            borderRadius: "3px",
                            border: "1px solid #0000006b",
                            "&:hover": {
                                "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                                    backgroundColor: "#f4f4f4",
                                },
                            },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button autoFocus variant="contained" color="error" onClick={sendRequest}>
                        {" "}
                        OK{" "}
                    </Button>
                </DialogActions>
            </Dialog>
            {/*Submit Edit ALERT DIALOG */}
            <Dialog open={isSubmitEdit} onClose={handleCloseModSubmitEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ width: "400px", textAlign: "center", alignItems: "center" }}>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                    <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                        {submitMessage}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseModSubmitEdit}
                        style={{
                            backgroundColor: "#f4f4f4",
                            color: "#444",
                            boxShadow: "none",
                            borderRadius: "3px",
                            border: "1px solid #0000006b",
                            "&:hover": {
                                "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                                    backgroundColor: "#f4f4f4",
                                },
                            },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button autoFocus variant="contained" color="error" onClick={sendEditRequest}>
                        {" "}
                        OK{" "}
                    </Button>
                </DialogActions>
            </Dialog>
            {/*DELETE ALERT DIALOG */}
            <Dialog open={isDeleteOpen} onClose={handleCloseMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                    <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                        Are you sure?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseMod}
                        style={{
                            backgroundColor: "#f4f4f4",
                            color: "#444",
                            boxShadow: "none",
                            borderRadius: "3px",
                            border: "1px solid #0000006b",
                            "&:hover": {
                                "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                                    backgroundColor: "#f4f4f4",
                                },
                            },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button autoFocus variant="contained" color="error" onClick={(e) => delBrand(brandid)}>
                        {" "}
                        OK{" "}
                    </Button>
                </DialogActions>
            </Dialog>
            {/* view model */}
            <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <Box sx={{ width: "550px", padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Achieved Accuracy Internal Status</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Date</Typography>
                                    <Typography>{moment(acheivedAccuracyDetailsEdit.date).format('DD-MM-YYYY')}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Project</Typography>
                                    <Typography>{acheivedAccuracyDetailsEdit.project}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Vendor</Typography>
                                    <Typography>{acheivedAccuracyDetailsEdit.vendor}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Queue</Typography>
                                    <Typography>{acheivedAccuracyDetailsEdit.queue}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Achieved Accuracy</Typography>
                                    <Typography>{`${acheivedAccuracyDetailsEdit.acheivedaccuracy} %`}</Typography>
                                </FormControl>
                            </Grid>
                            {/* <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Client Status</Typography>
                                    <Typography>{acheivedAccuracyDetailsEdit.clientstatus}</Typography>
                                </FormControl>
                            </Grid> */}
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Internal Status</Typography>
                                    <Typography>{`${acheivedAccuracyDetailsEdit.internalstatus}`}</Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button variant="contained" color="primary" onClick={handleCloseview}>
                                Back
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>
            {/* ALERT DIALOG */}
            <Box>
                <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            style={{
                                padding: "7px 13px",
                                color: "white",
                                background: "rgb(25, 118, 210)",
                            }}
                            onClick={handleCloseerr}
                        >
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            {/* Bulk delete ALERT DIALOG */}
            <Dialog open={isDeleteOpenalert} onClose={handleCloseModalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: "orange" }} />
                    <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                        Please Select any Row
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus variant="contained" color="error" onClick={handleCloseModalert}>
                        {" "}
                        OK{" "}
                    </Button>
                </DialogActions>
            </Dialog>
            <Box>
                <Dialog open={isDeleteOpencheckbox} onClose={handleCloseModcheckbox} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                        <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                            Are you sure?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
                            Cancel
                        </Button>
                        <Button autoFocus variant="contained" color="error" onClick={(e) => delAreagrpcheckbox(e)}>
                            {" "}
                            OK{" "}
                        </Button> 
                    </DialogActions>
                </Dialog>
            </Box>
            {/* Edit DIALOG */}
            <Box>
                <Dialog open={isEditOpen} onClose={handleCloseModEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" fullWidth={true} sx={{
                    overflow: 'visible',
                    '& .MuiPaper-root': {
                        overflow: 'auto',
                    },
                }}>
                    <Box sx={{ padding: "20px 50px" }}>
                        <>
                            <Grid container spacing={2}>
                                <Typography sx={userStyle.HeaderText}>Edit Achieved Accuracy Internal Status</Typography>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Date<b style={{ color: "red" }}>*</b>  </Typography>
                                        <OutlinedInput id="myDateInput" type="date" value={acheivedAccuracyDetailsEdit.date} onChange={(e) => {
                                            setAcheivedAccuracyDetailsEdit((prev) => ({
                                                ...prev, date: e.target.value
                                            })
                                            )
                                        }} />
                                    </FormControl>
                                </Grid>
                                  <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Project<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={projectOptEdit}
                                            styles={colourStyles}
                                            value={{
                                                label: acheivedAccuracyDetailsEdit.project,
                                                value: acheivedAccuracyDetailsEdit.project,
                                            }}
                                            onChange={(e) => {

                                                setAcheivedAccuracyDetailsEdit({
                                                    ...acheivedAccuracyDetailsEdit,
                                                    project: e.value,
                                                    queue: "Please Select Queue",
                                                    vendor: "Please Select Vendor",
                                                });
                                                fetchQueueDropdownsEdit(e.value);
                                                fetchVendorDropdownsEdit(e.value);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Vendor<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={vendorOptEdit}
                                            styles={colourStyles}
                                            value={{
                                                label: acheivedAccuracyDetailsEdit.vendor,
                                                value: acheivedAccuracyDetailsEdit.vendor,
                                            }}
                                            onChange={(e) => {

                                                setAcheivedAccuracyDetailsEdit({
                                                    ...acheivedAccuracyDetailsEdit,
                                                    vendor: e.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Queue<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={queueOptionEdit}
                                            styles={colourStyles}
                                            value={{
                                                label: acheivedAccuracyDetailsEdit.queue,
                                                value: acheivedAccuracyDetailsEdit.queue,
                                            }}
                                            onChange={(e) => {

                                                setAcheivedAccuracyDetailsEdit({
                                                    ...acheivedAccuracyDetailsEdit,
                                                    queue: e.value,
                                                });
                                                setAcheivedAccuracyDetailsEdit((prev)=>({
                                                    ...prev,acheivedaccuracy: "", clientstatus: "", internalstatus: ""
                                                 }));
                                               
                                            }}
                                        />
                                    </FormControl>
                                </Grid> 
                       
                                <Grid item md={4} xs={12} sm={12}>
                                    <Typography>
                                        Achieved Accuracy %<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Grid className="expected-accuracy">
                                        <FormControl fullWidth size="small" >
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="number"
                                                inputProps={{
                                                    min: 0,
                                                    max: 100,
                                                    step: 0.01,
                                                    pattern: "\\d*\\.?\\d{0,2}"
                                                }}
                                                placeholder="Please enter the number 0-100"
                                                value={acheivedAccuracyDetailsEdit.acheivedaccuracy}
                                                sx={userStyle.input}
                                                onChange={(e) => {
                                                    const newValue = e.target.value;
                                                    // Check if the new value matches the allowed pattern
                                                    const isValid = /^(\d{0,2}(\.\d{0,2})?|100(\.00?)?)$/.test(newValue);
                                                    if (isValid) {
                                                        setAcheivedAccuracyDetailsEdit(prev => ({
                                                            ...prev,
                                                            acheivedaccuracy: newValue
                                                        }));
                                                        gettingValuesEdit(newValue)
                                                    }
                                                }}
                                            />
                                        </FormControl>

                                    </Grid>
                                </Grid>
                                {/* <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Client Status
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            sx={userStyle.input}
                                            // disabled={true}
                                            placeholder=""
                                            value={acheivedAccuracyDetailsEdit.clientstatus}
                                            onChange={(e) => {

                                            }}
                                        />
                                    </FormControl>
                                        </Grid>*/}

                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Internal Status
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            sx={userStyle.input}
                                            // disabled={true}
                                            placeholder=""
                                            value={acheivedAccuracyDetailsEdit.internalstatus}
                                            onChange={(e) => {

                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                               
                            </Grid>
                            <br /> <br />
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button variant="contained" onClick={editSubmit}>
                                        {" "}
                                        Update
                                    </Button>
                                </Grid>
                                <br />
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
                                        {" "}
                                        Cancel{" "}
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </Dialog>
            </Box>
            <br />
        </Box >
    );
}

export default AcheivedAccurayInternalStatus;
