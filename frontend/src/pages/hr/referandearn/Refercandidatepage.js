import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, TableBody, TableRow, TextareaAutosize, IconButton, Popover, Checkbox, TableCell, TextField, List, ListItemText, ListItem, Select, Paper, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import { MultiSelect } from "react-multi-select-component";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import StyledDataGrid from "../../../components/TableStyle";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { ThreeDots } from 'react-loader-spinner';
import Selects from "react-select";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import CancelIcon from "@mui/icons-material/Cancel";
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import Headtitle from "../../../components/Headtitle";
import { saveAs } from "file-saver";
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';
import PageHeading from "../../../components/PageHeading";

function Refercandidate() {
    const [refferal, setRefferal] = useState({
        referingjob: "Please Select Referjob", prefix: 'Mr', firstname: "",
        lastname: "", emailid: "", mobile: "", relation: "",
        known: "", notes: "",
        addedby: "",
        updatedby: "",
    });

    const [refferalEdit, setRefferaledit] = useState({
        referingjob: "Please Select Referjob", prefix: 'Mr', firstname: "",
        lastname: "", emailid: "", mobile: "", relationship: "",
        knownperiod: "", notes: "", files: ""
    });
    const [jobId, setJobId] = useState([]);
    const [isBtn, setIsBtn] = useState(false);
    const [file, setFile] = useState("");
    const [refList, setReflist] = useState([]);
    const [allrefListEdit, setAllReflistEdit] = useState([]);
    const { isUserRoleCompare, isAssignBranch, isUserRoleAccess, pageName, setPageName,
    } = useContext(UserRoleAccessContext);
    const { auth, setAuth } = useContext(AuthContext);
    const [relationship, setRelationship] = useState("Please Select Relationship")
    const [relationshipEdit, setRelationshipEdit] = useState("Please Select Relationship")
    const [knownperiod, setKnownperiod] = useState("Please Select Knownperiod")
    const [knownperiodEdit, setKnownperiodEdit] = useState("Please Select Knownperiod")

    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState('');

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();

    const [openview, setOpenview] = useState(false);
    const [openInfo, setOpeninfo] = useState(false);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteproject, setDeleteproject] = useState({});
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [referCheck, setRefercheck] = useState(false);
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const [files, setFiles] = useState([]);
    const [fileEdit, setFilesEdit] = useState([]);


    // Filtered option fields 
    const [filterjobs, setFilterjob] = useState({ company: "", branch: "", designation: "" })
    const [companys, setCompanys] = useState([]);
    const [branchs, setBranchs] = useState([]);
    const [designations, setDesignations] = useState([]);

    // This is create multi select
    // company
    const [selectedOptionsCom, setSelectedOptionsCom] = useState([]);
    let [valueComp, setValueComp] = useState("");

    const handleCompanyChange = (options) => {
        setValueComp(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCom(options);
        setRefferal({
            ...refferal,
            referingjob: "Please Select Referjob",

        });
        setJobId([]);
    };

    const customValueRendererCom = (valueComp, _companys) => {
        return valueComp.length ? valueComp.map(({ label }) => label).join(", ") : "Please Select Company";
    };

    // branch
    const [selectedOptionsBran, setSelectedOptionsBran] = useState([]);
    let [valueBran, setValueBran] = useState("");

    const handleBranchChange = (options) => {
        setValueBran(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsBran(options);
        setRefferal({
            ...refferal,
            referingjob: "Please Select Referjob",

        });
        setJobId([]);
    };

    const customValueRendererBran = (valueBran, _branchs) => {
        return valueBran.length ? valueBran.map(({ label }) => label).join(", ") : "Please Select Branch";
    };

    // Designation
    // company
    const [selectedOptionsDesig, setSelectedOptionsDesig] = useState([]);
    let [valueDesig, setValueDesig] = useState("");

    const handleDesignationChange = (options) => {
        setValueDesig(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsDesig(options);
        setRefferal({
            ...refferal,
            referingjob: "Please Select Referjob",

        });
        setJobId([]);
    };

    const customValueRendererDesig = (valueDesig, _designations) => {
        return valueDesig.length ? valueDesig.map(({ label }) => label).join(", ") : "Please Select Designation";
    };


    const fetchDesignationDropdowns = async () => {
        try {
            let res = await axios.get(SERVICE.DESIGNATION, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDesignations(res?.data?.designation?.map((t) => ({
                ...t,
                label: t.name,
                value: t.name
            })).filter((value, index, self) =>
                index ===
                self.findIndex(
                    (t) => t.value === value.value
                )
            ))
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };


    const fetchCompanyDropdowns = async () => {
        try {
            const companyall = isAssignBranch?.map(data => ({
                label: data.company,
                value: data.company,
            })).filter((item, index, self) => {
                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
            });

            setCompanys(companyall);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const fetchBranchDropdowns = async (e) => {
        let ans = e ? e.map((data) => data.value) : []
        try {
            const branchall = isAssignBranch?.filter(
                (comp) =>
                    ans.includes(comp.company)
            )?.map(data => ({
                label: data.branch,
                value: data.branch,
            })).filter((item, index, self) => {
                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
            })

            setBranchs(branchall);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };


    useEffect(() => {
        fetchCompanyDropdowns();
        fetchDesignationDropdowns();
    }, []);


    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, 'Refer a candidate.png');
                });
            });
        }
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    // Error Popup model

    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    // view model
    const handleClickOpenview = () => {
        setOpenview(true);
    };

    const handleCloseview = () => {
        setOpenview(false);
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


    // Error Popup model
    const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
    const [showAlertpop, setShowAlertpop] = useState();
    const handleClickOpenerrpop = () => {
        setIsErrorOpenpop(true);
    };
    const handleCloseerrpop = () => {
        setIsErrorOpenpop(false);
    };

    //Delete model
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

    //Delete model
    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

    const handleClickOpencheckbox = () => {

        setIsDeleteOpencheckbox(true);
    };
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
    };

    // Manage Columns
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null)

    const handleOpenManageColumns = (event) => {
        setAnchorEl(event.currentTarget);
        setManageColumnsOpen(true);
    };
    const handleCloseManageColumns = () => {
        setManageColumnsOpen(false);
        setSearchQueryManage("")
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const getRowClassName = (params) => {
        if ((selectedRows).includes(params.row.id)) {
            return 'custom-id-row'; // This is the custom class for rows with item.tat === 'ago'
        }
        return ''; // Return an empty string for other rows
    };

    // Show All Columns & Manage Columns 
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        referingjob: true,
        emailid: true,
        mobile: true,
        relation: true,
        known: true,
        resume: true,
        // files: true,
        status: true,
        companyname: true,
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);


    const handleMobileChange = (e) => {
        // Get the input value and remove any non-digit characters
        let inputValue = e.target.value.replace(/\D/g, '');

        // Limit the input value to 10 digits
        inputValue = inputValue.slice(0, 10);

        // Update the state with the cleaned and limited value
        setRefferal({
            ...refferal,
            mobile: inputValue,
        });
    };

    const handleMobileChangeEdit = (e) => {
        // Get the input value and remove any non-digit characters
        let inputValue = e.target.value.replace(/\D/g, '');

        // Limit the input value to 10 digits
        inputValue = inputValue.slice(0, 10);

        // Update the state with the cleaned and limited value
        setRefferaledit({
            ...refferalEdit,
            mobile: inputValue,
        });
    };




    const handleFileUpload = (event, index) => {
        const filesname = event.target.files;
        let newSelectedFiles = [...files];

        for (let i = 0; i < filesname.length; i++) {
            const file = filesname[i];
            // Check if the file is a PDF
            const fileExtension = file.name.split('.').pop().toLowerCase();

            if (fileExtension === 'pdf') {
                const reader = new FileReader();
                reader.onload = () => {
                    newSelectedFiles.push({
                        name: file.name,
                        preview: reader.result,
                        base64: reader.result.split(',')[1]
                        // index: indexData
                    });
                    setFiles(newSelectedFiles);
                };
                reader.readAsDataURL(file);

                // Break out of the loop after processing the first PDF file
                break;
            } else {
                // Display an alert for unsupported file types
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"Please Upload PDF File Only"}
                        </p>
                    </>
                );
                handleClickOpenerr();
                break;
            }
        }
    };




    const handleFileDelete = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const renderFilePreview = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };



    const handleFileUploadEdit = (event, index) => {
        const filesname = event.target.files;
        let newSelectedFiles = [...fileEdit];

        for (let i = 0; i < filesname.length; i++) {
            const file = filesname[i];
            // Check if the file is a PDF
            const fileExtension = file.name.split('.').pop().toLowerCase();

            if (fileExtension === 'pdf') {
                const reader = new FileReader();
                reader.onload = () => {
                    newSelectedFiles.push({
                        name: file.name,
                        preview: reader.result,
                        base64: reader.result.split(',')[1]
                        // index: indexData
                    });
                    setFilesEdit(newSelectedFiles);
                };
                reader.readAsDataURL(file);

                // Break out of the loop after processing the first PDF file
                break;
            } else {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"Please Upload PDF File Only"}
                        </p>
                    </>
                );
                handleClickOpenerr();
                break;
            }
        }
    };



    const handleFileDeleteEdit = (index) => {
        setFilesEdit((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const renderFilePreviewEdit = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };

    //get single row to edit....    
    const fileData = async (id) => {
        try {

            let res = await axios.get(`${SERVICE.REFERCANDIDATE_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            renderFilePreview(res?.data?.srefercandidate.files[0]);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };


    //get single row to edit....    
    const fileDataDownload = async (id) => {
        try {

            let res = await axios.get(`${SERVICE.REFERCANDIDATE_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setFile(res?.data?.srefercandidate.files);
            res?.data?.srefercandidate.files.forEach((file) => {
                const link = document.createElement('a');
                link.href = `data:application/octet-stream;base64,${file.base64}`;
                link.download = file.name;
                link.click();
            });

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };


    //set function to get particular row
    const rowData = async (id) => {
        try {
            let res = await axios.get(`${SERVICE.REFERCANDIDATE_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setDeleteproject(res?.data?.srefercandidate);
            handleClickOpen();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    // Alert delete popup
    let projectid = deleteproject._id;
    const delRefer = async () => {
        try {
            await axios.delete(`${SERVICE.REFERCANDIDATE_SINGLE}/${projectid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            await fetchRefercandidate();
            handleCloseMod();
            setSelectedRows([]);
            setPage(1);
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
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const delRefercheckbox = async () => {
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.REFERCANDIDATE_SINGLE}/${item}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                });
            });

            // Wait for all delete requests to complete
            await Promise.all(deletePromises);

            handleCloseModcheckbox();
            setSelectedRows([]);
            setSelectAllChecked(false);
            setPage(1);

            await fetchRefercandidate();

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };




    //add function
    const sendRequest = async () => {
        setPageName(!pageName)
        setIsBtn(true)
        try {
            let refercreate = await axios.post(SERVICE.REFERCANDIDATE_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                referingjob: String(refferal.referingjob) === "Please Select Referjob" ? "" : String(refferal.referingjob),
                status: String("Refered"),
                companyname: String(isUserRoleAccess.companyname),
                prefix: String(refferal.prefix),
                firstname: String(refferal.firstname),
                lastname: String(refferal.lastname),
                emailid: String(refferal.emailid),
                mobile: String(refferal.mobile),
                relation: String(relationship) === "Please Select Relationship" ? "" : String(relationship),
                known: String(knownperiod) === "Please Select Knownperiod" ? "" : String(knownperiod),
                notes: String(refferal.notes),
                files: [...files],
                addedby: [

                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            setRefferal(refercreate.data);
            await fetchRefercandidate();
            setFiles([]);
            setRefferal({
                referingjob: "", prefix: 'Mr', firstname: "",
                lastname: "", emailid: "", mobile: "", relationship: "", knownperiod: "", files: "", notes: ""
            });
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
            setIsBtn(false)
        } catch (err) { setIsBtn(false); handleApiError(err, setShowAlert, handleClickOpenerr); }

    };

    function isValidEmail(email) {
        // Regular expression for a simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    //submit option for saving
    const handleSubmit = (e) => {
        setPageName(!pageName)
        const isNameMatch = refList.some((item) =>
            // item.firstname === refferal.firstname
            item.firstname.toLowerCase() === (refferal.firstname).toLowerCase()
            && item.lastname.toLowerCase() === (refferal.lastname).toLowerCase()
            // && item.lastname === refferal.lastname
            && item.emailid === refferal.emailid
            && item.mobile === refferal.mobile

        );
        e.preventDefault();
        if (files.length < 1) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Upload Files "}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (selectedOptionsCom.length == 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Company"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (selectedOptionsBran.length == 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Branch"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (refferal.firstname === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Firstname"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (refferal.lastname === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Lastname"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (refferal.emailid === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Email"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }

        else if (refferal.emailid && !isValidEmail(refferal.emailid)) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Valid Email"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (refferal.mobile === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Mobile"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } else if (refferal.mobile.length !== 10) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter a valid 10 digit Mobile Number"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }

        else if (files.length < 1) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Upload Files "}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (isNameMatch) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Data already exits!"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            sendRequest();
        }
    };

    const handleClear = (e) => {
        e.preventDefault();
        setFiles([]);
        setRelationship('Please Select Relationship');
        setKnownperiod('Please Select Knownperiod');
        setRefferal({
            ...refferal,
            referingjob: "Please Select Referjob", prefix: 'Mr', firstname: "",
            lastname: "", emailid: "", mobile: "", relationship: "", knownperiod: "", files: "", notes: ""
        })
        setJobId([])
        // Filter clears
        setFilterjob({
            company: "", branch: "", designation: ""
        });
        setValueBran([]);
        setBranchs([]);
        setSelectedOptionsCom([]);
        setSelectedOptionsBran([]);
        setSelectedOptionsDesig([]);
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

    //Edit model...
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
    };

    //get single row to edit....
    const getCode = async (e, name) => {
        try {

            let res = await axios.get(`${SERVICE.REFERCANDIDATE_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setRefferaledit(res?.data?.srefercandidate);
            setRelationshipEdit(res?.data?.srefercandidate?.relation === "" ? "Please Select Relationship" : res?.data?.srefercandidate?.relation);
            setKnownperiodEdit(res?.data?.srefercandidate.known === "" ? "Please Select Knownperiod" : res?.data?.srefercandidate.known);
            setFilesEdit(res?.data?.srefercandidate.files);
            handleClickOpenEdit();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };


    // get single row to view....
    const getviewCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.REFERCANDIDATE_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setRefferaledit(res?.data?.srefercandidate);
            handleClickOpenview();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    // get single row to view....
    const getinfoCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.REFERCANDIDATE_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setRefferaledit(res?.data?.srefercandidate);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };


    //Project updateby edit page...
    let updateby = refferalEdit.updatedby;
    let addedby = refferalEdit.addedby;

    let refsid = refferalEdit._id;

    //editing the single data...
    const sendEditRequest = async () => {
        try {
            let res = await axios.put(`${SERVICE.REFERCANDIDATE_SINGLE}/${refsid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                name: String(refferalEdit.name),
                referingjob: String(refferalEdit.referingjob),
                prefix: String(refferalEdit.prefix) === undefined ? "" : String(refferalEdit.prefix),
                firstname: String(refferalEdit.firstname),
                lastname: String(refferalEdit.lastname),
                emailid: String(refferalEdit.emailid),
                mobile: String(refferalEdit.mobile),
                relation: String(relationshipEdit) === "Please Select Relationship" ? "" : String(relationshipEdit),
                known: String(knownperiodEdit) === "Please Select Knownperiod" ? "" : String(knownperiodEdit),
                notes: String(refferalEdit.notes) === undefined ? "" : String(refferalEdit.notes),
                files: [...fileEdit],
                updatedby: [
                    ...updateby,
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            setRefferaledit(res.data);
            await fetchRefercandidate(); fetchRefercandidateAll();
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
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const editSubmit = (e) => {
        e.preventDefault();
        fetchRefercandidateAll();
        const isNameMatch = allrefListEdit.some((item) =>
            item.firstname.toLowerCase() === refferalEdit.firstname.toLowerCase() &&
            item.lastname.toLowerCase() === refferalEdit.lastname.toLowerCase() &&
            item.emailid === refferalEdit.emailid &&
            item.mobile === refferalEdit.mobile
        );

        if (fileEdit.length < 1) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Upload Files "}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (refferalEdit.firstname === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Firstname"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (refferalEdit.lastname === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Lastname"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }

        else if (refferalEdit.emailid === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Email"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }

        else if (refferalEdit.emailid && !isValidEmail(refferalEdit.emailid)) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Valid Email"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (refferalEdit.mobile === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Mobile"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } else if (refferalEdit.mobile.length !== 10) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter a valid 10 digit Mobile Number"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }

        else if (isNameMatch) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Data already exits!"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            sendEditRequest();
        }
    };


    const fetchFilteredDatas = async (e) => {
        let valueDesignation = e.map(data => data.value)

        try {
            let res = await axios.get(SERVICE.ALLJOBOPENINGS, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            // setJobId(res.data.jobopenings);
            let ans = res.data.jobopenings.filter((data) => valueComp.includes(data.company) && valueBran.includes(data.branch) &&
                valueDesignation.includes(data.designation) && data.status === 'OnProgress');


            setJobId(ans.map((d) => ({
                ...d,
                label: d.recruitmentname,
                value: d.recruitmentname
            })))
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const fetchFilteredDatasBranch = async (e) => {
        let valueBranch = e.map(data => data.value)
        try {
            let res = await axios.get(SERVICE.ALLJOBOPENINGS, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            // setJobId(res.data.jobopenings);
            let ans = res.data.jobopenings.filter((data) => valueComp.includes(data.company) && valueBranch.includes(data.branch) && data.status === 'OnProgress');

            setJobId(ans.map((d) => ({
                ...d,
                label: d.recruitmentname,
                value: d.recruitmentname
            })))

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };


    //get all refercandidate details.
    const fetchRefercandidate = async () => {
        setPageName(!pageName)
        try {
            let res_project = await axios.get(SERVICE.REFERCANDIDATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });

            setReflist(res_project?.data?.refercandidates);
            setRefercheck(true);
        } catch (err) { setRefercheck(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    //get all refercandidate details.
    const fetchRefercandidateAll = async () => {
        setPageName(!pageName)
        try {
            let res_project = await axios.get(SERVICE.REFERCANDIDATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setAllReflistEdit(res_project?.data?.refercandidates.filter((item) => item._id !== refferalEdit._id));
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };


    // pdf.....
    const columns = [
        { title: "Sno", field: "serialNumber" },
        { title: "Refering for Job", field: "referingjob" },
        { title: "Email Id", field: "emailid" },
        { title: "Mobile", field: "mobile" },
        { title: "Relationship", field: "relation" },
        { title: "Knownperiod", field: "known" },
        // { title: "Resume", field: "resume" },
        { title: "Status", field: "status" },
        { title: "Refered By", field: "companyname" },
    ];

    const downloadPdf = () => {
        const doc = new jsPDF();
        const columnsWithSerial = [
            ...columns.map((col) => ({ ...col, dataKey: col.field })),
        ];
        // Add a serial number to each row
        const itemsWithSerial = rowDataTable.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
        }));
        doc.autoTable({
            theme: "grid",
            styles: {
                fontSize: 4,
            },
            // columns: columns?.map((col) => ({ ...col, dataKey: col.field })),
            // body: items,
            columns: columnsWithSerial,
            body: itemsWithSerial,
        });
        doc.save("Refercandidate.pdf");
    };

    // Excel
    const fileName = "Refercandidate";

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Refercandidate",
        pageStyle: "print",
    });


    //serial no for listing items 
    const addSerialNumber = () => {
        const itemsWithSerialNumber = refList?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    }

    useEffect(() => {
        addSerialNumber();
    }, [refList])


    useEffect(() => {
        fetchRefercandidate();
        fetchRefercandidateAll();
    }, [])
    useEffect(() => {
        fetchRefercandidateAll();
    }, [isEditOpen, refferalEdit])

    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSelectedRows([]);
        setSelectAllChecked(false)
    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setSelectedRows([]);
        setSelectAllChecked(false)
        setPage(1);
    };

    //datatable....
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };
    // Split the search query into individual terms
    const searchTerms = searchQuery.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });





    const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);

    const totalPages = Math.ceil(filteredDatas?.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

    const pageNumbers = [];

    const indexOfLastItem = page * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

    const [selectAllChecked, setSelectAllChecked] = useState(false);

    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox
                checked={selectAllChecked}
                onChange={onSelectAll}
            />
        </div>
    );


    const columnDataTable = [

        {
            field: "checkbox",
            headerName: "Checkbox", // Default header name
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
            width: 90,

            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header"
        },
        {
            field: "serialNumber", headerName: "SNo",
            flex: 0, width: 100, hide: !columnVisibility.serialNumber, headerClassName: "bold-header"
        },
        { field: "referingjob", headerName: "Refering for Job", flex: 0, width: 200, hide: !columnVisibility.referingjob, headerClassName: "bold-header" },
        { field: "emailid", headerName: "Emailid", flex: 0, width: 200, hide: !columnVisibility.emailid, headerClassName: "bold-header" },
        { field: "mobile", headerName: "Mobile", flex: 0, width: 200, hide: !columnVisibility.mobile, headerClassName: "bold-header" },
        { field: "relation", headerName: "Relationship", flex: 0, width: 200, hide: !columnVisibility.relation, headerClassName: "bold-header" },
        { field: "known", headerName: "Knownperiod", flex: 0, width: 200, hide: !columnVisibility.known, headerClassName: "bold-header" },
        {
            field: "resume",
            headerName: "Resume",
            flex: 0,
            width: 200,
            sortable: false,
            hide: !columnVisibility.files,
            renderCell: (params) => (
                <Grid sx={{ display: "flex" }}>

                    <a
                        onClick={() => { fileData(params.row.id); }}
                        style={{ minWidth: "0px", color: "#357AE8", cursor: "pointer" }}>
                        View
                    </a>

                    <a
                        style={{ minWidth: "0px", textDecoration: 'none', color: "#357AE8", cursor: "pointer" }}
                        onClick={() => { fileDataDownload(params.row.id); }}
                    >
                        Download
                    </a>
                </Grid>
            ),
        },
        { field: "status", headerName: "Status", flex: 0, width: 200, hide: !columnVisibility.status },
        { field: "companyname", headerName: "Refered By", flex: 0, width: 200, hide: !columnVisibility.companyname },


        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 250,
            minHeight: '40px !important',
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            renderCell: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("ereferacandidate") && (
                        <Button sx={userStyle.buttonedit} onClick={() => { getCode(params.row.id, params.row.name); }} style={{ minWidth: "0px" }}>
                            <EditOutlinedIcon style={{ fontSize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("dreferacandidate") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.row.id);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vreferacandidate") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.row.id);
                                handleClickOpenview();
                            }}
                        >
                            <VisibilityOutlinedIcon
                                style={{ fontsize: "large" }}
                            />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("ireferacandidate") && (
                        <Button sx={userStyle.buttonview}
                            onClick={() => {
                                handleClickOpeninfo();
                                getinfoCode(params.row.id);
                            }}
                        >
                            <InfoOutlinedIcon style={{ fontSize: "large" }} />
                        </Button>
                    )}
                </Grid>
            ),
        },
    ]

    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            referingjob: item.referingjob === "Please Select Referjob" ? "" : item.referingjob,
            emailid: item.emailid,
            mobile: item.mobile,
            relation: item.relation === "Please Select Relationship" ? "" : item.relation,
            known: item.known === "Please Select Knownperiod" ? "" : item.known,
            // files: item.file,
            resume: item.files,
            status: item.status,
            companyname: item.companyname
        }
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

    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibility");
        if (savedVisibility) {
            setColumnVisibility(JSON.parse(savedVisibility));
        }
    }, []);

    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
    }, [columnVisibility]);


    // // Function to filter columns based on search query
    const filteredColumns = columnDataTable.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
    );


    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {

        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));

    };

    // JSX for the "Manage Columns" popover content
    const manageColumnsContent = (
        <Box style={{ padding: "10px", minWidth: "325px", '& .MuiDialogContent-root': { padding: '10px 0' } }} >
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton
                aria-label="close"
                onClick={handleCloseManageColumns}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <Box sx={{ position: 'relative', margin: '10px' }}>
                <TextField
                    label="Find column"
                    variant="standard"
                    fullWidth
                    value={searchQueryManage}
                    onChange={(e) => setSearchQueryManage(e.target.value)}
                    sx={{ marginBottom: 5, position: 'absolute', }}
                />
            </Box><br /><br />
            <DialogContent sx={{ minWidth: 'auto', height: '200px', position: 'relative' }}>
                <List sx={{ overflow: 'auto', height: '100%', }}>
                    {filteredColumns.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText sx={{ display: 'flex' }}
                                primary={
                                    <Switch sx={{ marginTop: "-5px" }} size="small"
                                        checked={columnVisibility[column.field]}
                                        onChange={() => toggleColumnVisibility(column.field)}
                                    />
                                }
                                secondary={(column.field === "checkbox") ? "Checkbox" : column.headerName}
                            // secondary={column.headerName }
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item md={4}>
                        <Button
                            variant="text"
                            sx={{ textTransform: 'none', }}
                            onClick={() => setColumnVisibility(initialColumnVisibility)}
                        >
                            Show All
                        </Button>
                    </Grid>
                    <Grid item md={4}></Grid>
                    <Grid item md={4}>
                        <Button
                            variant="text"
                            sx={{ textTransform: 'none' }}
                            onClick={() => {
                                const newColumnVisibility = {};
                                columnDataTable.forEach((column) => {
                                    newColumnVisibility[column.field] = false; // Set hide property to true
                                });
                                setColumnVisibility(newColumnVisibility);
                            }}

                        >
                            Hide All
                        </Button>

                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );


    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };

    useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, []);



    return (
        <Box>
            <Headtitle title={'REFER CANDIDATE'} />
            {/* ****** Header Content ****** */}
            {/* <Typography sx={userStyle.HeaderText}>Refer a Candidate</Typography> */}
            <PageHeading
                title="Refer a Candidate1"
                modulename="Refer & Earn"
                submodulename="Refer a candidate"
                mainpagename=""
                subpagename=""
                subsubpagename=""
            />
            <>
                <Box sx={userStyle.selectcontainer}>
                    {isUserRoleCompare?.includes("areferacandidate")
                        && (
                            <>
                                <Grid container spacing={2}>
                                    <Grid item xs={8}>

                                    </Grid>
                                </Grid>
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={12} sm={12} xs={12}>
                                        <> <Button variant="outlined" component="label" style={{ justifyContent: "center !important" }}>
                                            <div> Upload Resume <CloudUploadIcon sx={{ paddingTop: '5px' }} />
                                            </div>
                                            <input hidden type="file" multiple onChange={handleFileUpload} accept=" application/pdf, image/*" /><b style={{ color: "red" }}>*</b>
                                        </Button>
                                        </>
                                    </Grid>
                                    <>
                                        <br /><br />
                                        <Grid item lg={6} md={6} sm={12} xs={12} sx={{ padding: '10px', }}>
                                            <br />
                                            {files?.length > 0 &&
                                                (files.map((file, index) => (
                                                    <>
                                                        <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
                                                            <Grid item lg={6} md={6} sm={6} xs={6}>
                                                                <Typography>{file.name}</Typography>
                                                            </Grid>
                                                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                                                <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", marginLeft: "60px", marginTop: "-20px", cursor: "pointer" }} onClick={() => renderFilePreview(file)} />
                                                            </Grid>

                                                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                                                <Button style={{ fontsize: "large", color: "#FF0000", marginLeft: "60px", marginTop: "-20px", cursor: "pointer" }} onClick={() => handleFileDelete(index)} size="small"  ><CancelIcon /></Button>

                                                            </Grid>
                                                        </Grid>
                                                    </>
                                                )))}
                                        </Grid>
                                    </>
                                    <br />
                                </Grid>
                                <br />

                                <Grid container spacing={2}>
                                    <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Company <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                options={companys}
                                                value={selectedOptionsCom}
                                                onChange={(e) => {
                                                    handleCompanyChange(e);
                                                    fetchBranchDropdowns(e);
                                                    setSelectedOptionsBran([]);

                                                }}
                                                valueRenderer={customValueRendererCom}
                                                labelledBy="Please Select Company"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Branch <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                options={branchs}
                                                value={selectedOptionsBran}
                                                onChange={(e) => {
                                                    handleBranchChange(e);
                                                    fetchFilteredDatasBranch(e);
                                                }}
                                                valueRenderer={customValueRendererBran}
                                                labelledBy="Please Select Branch"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Designation
                                            </Typography>
                                            <MultiSelect
                                                options={designations}
                                                value={selectedOptionsDesig}
                                                onChange={(e) => {
                                                    handleDesignationChange(e);
                                                    fetchFilteredDatas(e)
                                                }}
                                                valueRenderer={customValueRendererDesig}
                                                labelledBy="Please Select Designation"
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid><br /> <br />

                                <Grid item xs={12}>
                                    <Typography sx={userStyle.SubHeaderText}><b> Job Recommendation </b></Typography>
                                </Grid><br />
                                <Grid container spacing={2}>
                                    <Grid item md={3} xs={12} sm={12} >
                                        <FormControl fullWidth size="small" >
                                            <Typography>Refering for Job</Typography>
                                            <Selects
                                                options={jobId}
                                                value={{ label: refferal.referingjob ? refferal.referingjob : "Please Select ReferJob", value: refferal.referingjob }}
                                                placeholder="Please Select Referjob"
                                                onChange={(e) => { setRefferal({ ...refferal, referingjob: e.value }) }}
                                            />

                                        </FormControl>
                                    </Grid>
                                </Grid><br /> <br />

                                <Grid item xs={12}>
                                    <Typography sx={userStyle.SubHeaderText}><b> Candidate Information</b></Typography>
                                </Grid><br /> <br />

                                <Grid container spacing={2}>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <Grid container >

                                            <Grid item md={3} xs={12} sm={12}>
                                                <Typography>Mr</Typography>
                                                <FormControl size="small" fullWidth>
                                                    <Select
                                                        labelId="demo-select-small"
                                                        id="demo-select-small"
                                                        placeholder="Mr."
                                                        value={refferal.prefix}
                                                        onChange={(e) => {
                                                            setRefferal({ ...refferal, prefix: e.target.value });
                                                        }}
                                                    >
                                                        <MenuItem value="Mr">Mr</MenuItem>
                                                        <MenuItem value="Ms">Ms</MenuItem>
                                                        <MenuItem value="Mrs">Mrs</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={9} xs={12} sm={12}>
                                                <Typography>Firstname<b style={{ color: "red" }}>*</b></Typography>
                                                <FormControl size="small" fullWidth>
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="text"
                                                        value={refferal.firstname}
                                                        onChange={(e) => {
                                                            setRefferal({
                                                                ...refferal,
                                                                firstname: e.target.value,
                                                            });
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl size="small" fullWidth>
                                            <Typography>LastName<b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                value={refferal.lastname}
                                                onChange={(e) => {
                                                    setRefferal({
                                                        ...refferal,
                                                        lastname: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>

                                </Grid><br />
                                <Grid container spacing={2}>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl size="small" fullWidth>
                                            <Typography>Email Id<b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="email"
                                                value={refferal.emailid}
                                                onChange={(e) => {
                                                    setRefferal({
                                                        ...refferal,
                                                        emailid: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl size="small" fullWidth>
                                            <Typography>Mobile<b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                sx={userStyle.input}
                                                id="component-outlined"
                                                type="number"
                                                value={refferal.mobile}
                                                onChange={handleMobileChange}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <br /> <br />
                                <Grid item xs={12}>
                                    <Typography sx={userStyle.SubHeaderText}><b> Additional Information</b></Typography>
                                </Grid><br />
                                <Grid container spacing={2}>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Relationship</Typography>
                                            <Select
                                                fullWidth
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                placeholder="Please Select Relationship"
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 200,
                                                            width: 80,
                                                        },
                                                    },
                                                }}
                                                value={relationship}
                                                onChange={(e) => {
                                                    setRelationship(e.target.value);
                                                }}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                            >
                                                <MenuItem value="Please Select Relationship" disabled> {"Please Select Relationship"} </MenuItem>
                                                <MenuItem value="Personally known"> {"Personally known"} </MenuItem>
                                                <MenuItem value="Former Colleague"> {"Former Colleague"} </MenuItem>
                                                <MenuItem value="Socially Connected"> {"Socially Connected"} </MenuItem>
                                                <MenuItem value="Got the resume through a common friend"> {"Got the resume through a common friend"} </MenuItem>
                                                <MenuItem value="Others"> {"Others"} </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Known Period</Typography>
                                            <Select
                                                fullWidth
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                placeholder="Please Select Knownperiod"
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 200,
                                                            width: 80,
                                                        },
                                                    },
                                                }}
                                                value={knownperiod}
                                                onChange={(e) => {
                                                    setKnownperiod(e.target.value);
                                                }}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                            >
                                                <MenuItem value="Please Select Knownperiod" disabled> {"Please Select Knownperiod"} </MenuItem>
                                                <MenuItem value="Less than a year"> {"Less than a year"} </MenuItem>
                                                <MenuItem value="1-2 years"> {"1-2 years"} </MenuItem>
                                                <MenuItem value="3-5 years"> {"3-5 years"} </MenuItem>
                                                <MenuItem value="5 years"> {"5 years"} </MenuItem>

                                            </Select>
                                        </FormControl>
                                    </Grid>


                                </Grid><br />
                                <Grid container spacing={2}>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl size="small" fullWidth>
                                            <Typography>Notes</Typography>
                                            <TextareaAutosize
                                                aria-label="minimum height"
                                                minRows={5}
                                                value={refferal.notes}
                                                onChange={(e) => { setRefferal({ ...refferal, notes: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid><br /><br />

                                <Grid container>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleSubmit}
                                            disabled={isBtn}
                                        >
                                            Submit Refferal
                                        </Button>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>

                                        <Button sx={userStyle.btncancel} onClick={handleClear} >
                                            Clear
                                        </Button>

                                    </Grid>
                                </Grid>
                            </>
                        )}
                </Box>
            </>
            {/* } */}
            <Box>
                {/* Edit DIALOG */}
                <Dialog
                    open={isEditOpen}
                    onClose={handleCloseModEdit}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="lg"
                    fullWidth={true}
                >
                    <Box sx={{ padding: '20px 50px' }}>
                        <>
                            <Grid container spacing={2}>

                                <Typography sx={userStyle.HeaderText}>
                                    Edit Refer a Candidate
                                </Typography>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={12} sm={12} xs={12}>
                                    <> <Button variant="outlined" component="label" style={{ justifyContent: "center !important" }}>
                                        <div> Upload Resume <CloudUploadIcon sx={{ paddingTop: '5px' }} />
                                        </div>
                                        <input hidden type="file" multiple onChange={handleFileUploadEdit} accept=" application/pdf, image/*" /><b style={{ color: "red" }}>*</b>
                                    </Button>
                                    </>
                                </Grid>
                                <>
                                    <br /><br />
                                    <Grid item lg={6} md={6} sm={12} xs={12} sx={{ padding: '10px', }}>
                                        <br />
                                        {fileEdit?.length > 0 &&
                                            (fileEdit.map((file, index) => (
                                                <>
                                                    <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
                                                        <Grid item lg={6} md={6} sm={6} xs={6}>
                                                            <Typography>{file.name}</Typography>
                                                        </Grid>
                                                        <Grid item lg={2} md={2} sm={2} xs={2}>
                                                            {/* <Button><VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", marginLeft: "60px", marginTop: "-20px",  }} onClick={() => renderFilePreviewEdit(file)} /></Button> */}
                                                            <Button style={{ fontsize: "large", color: "#357AE8", marginLeft: "60px", marginTop: "-20px", cursor: "pointer" }} onClick={() => renderFilePreviewEdit(file)} size="small"  ><VisibilityOutlinedIcon /></Button>
                                                        </Grid>
                                                        <Grid item lg={2} md={2} sm={2} xs={2}>
                                                            <Button style={{ fontsize: "large", color: "#FF0000", marginLeft: "60px", marginTop: "-20px", cursor: "pointer" }} onClick={() => handleFileDeleteEdit(index)} size="small"  ><CancelIcon /></Button>

                                                        </Grid>
                                                    </Grid>
                                                </>
                                            )))}
                                    </Grid>
                                </>
                                <br />
                            </Grid>
                            <br />

                            <Grid item xs={12}>
                                <Typography sx={userStyle.SubHeaderText}><b> Job Recommendation </b></Typography>
                            </Grid><br />
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12} sm={12} >
                                    <FormControl fullWidth size="small" >
                                        <Typography>Refering for Job</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={refferalEdit.referingjob}

                                        />
                                    </FormControl>
                                </Grid>
                            </Grid><br /> <br />
                            <Grid item xs={12}>
                                <Typography sx={userStyle.SubHeaderText}><b> Candidate Information</b></Typography>
                            </Grid><br /> <br />
                            <Grid container spacing={2} >
                                <Grid item md={4} xs={12} sm={12} sx={{ display: "flex" }}>
                                    <Grid >
                                        <Typography>Mr</Typography>
                                        <FormControl size="small" fullWidth>
                                            <Select
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                placeholder="Mr."
                                                value={refferalEdit.prefix}
                                                onChange={(e) => {
                                                    setRefferaledit({ ...refferalEdit, prefix: e.target.value });
                                                }}
                                            >
                                                <MenuItem value="Mr">Mr</MenuItem>
                                                <MenuItem value="Ms">Ms</MenuItem>
                                                <MenuItem value="Mrs">Mrs</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid >
                                        <Typography>Firstname<b style={{ color: "red" }}>*</b></Typography>
                                        <FormControl size="small" fullWidth>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                value={refferalEdit.firstname}
                                                onChange={(e) => {
                                                    setRefferaledit({
                                                        ...refferalEdit,
                                                        firstname: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl size="small" fullWidth>
                                        <Typography>LastName<b style={{ color: "red" }}>*</b></Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={refferalEdit.lastname}
                                            onChange={(e) => {
                                                setRefferaledit({
                                                    ...refferalEdit,
                                                    lastname: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} sm={{ display: 'none' }} xs={{ display: 'none' }}></Grid>
                                <br />
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl size="small" fullWidth>
                                        <Typography>Email Id<b style={{ color: "red" }}>*</b></Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={refferalEdit.emailid}
                                            onChange={(e) => {
                                                setRefferaledit({
                                                    ...refferalEdit,
                                                    emailid: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl size="small" fullWidth>
                                        <Typography>Mobile<b style={{ color: "red" }}>*</b></Typography>
                                        <OutlinedInput
                                            sx={userStyle.input}
                                            id="component-outlined"
                                            type="number"
                                            value={refferalEdit.mobile}
                                            onChange={handleMobileChangeEdit}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid><br /> <br />
                            <Grid item xs={12}>
                                <Typography sx={userStyle.SubHeaderText}><b> Additional Information</b></Typography>
                            </Grid><br />
                            <Grid container spacing={2}>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Relationship</Typography>
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
                                            value={relationshipEdit}
                                            onChange={(e) => {
                                                setRelationshipEdit(e.target.value);
                                            }}
                                            displayEmpty
                                            inputProps={{ 'aria-label': 'Without label' }}
                                        >
                                            <MenuItem value="Please Select Relationship" disabled> {"Please Select Relationship"} </MenuItem>
                                            <MenuItem value="Personally known"> {"Personally known"} </MenuItem>
                                            <MenuItem value="Former Colleague"> {"Former Colleague"} </MenuItem>
                                            <MenuItem value="Socially Connected"> {"Socially Connected"} </MenuItem>
                                            <MenuItem value="Got the resume through a common friend"> {"Got the resume through a common friend"} </MenuItem>
                                            <MenuItem value="Others"> {"Others"} </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Known Period</Typography>
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
                                            value={knownperiodEdit}
                                            onChange={(e) => {
                                                setKnownperiodEdit(e.target.value);
                                            }}
                                            displayEmpty
                                            inputProps={{ 'aria-label': 'Without label' }}
                                        >
                                            <MenuItem value="Please Select Knownperiod" disabled> {"Please Select Knownperiod"} </MenuItem>
                                            <MenuItem value="Less than a year"> {"Less than a year"} </MenuItem>
                                            <MenuItem value="1-2 years"> {"1-2 years"} </MenuItem>
                                            <MenuItem value="3-5 years"> {"3-5 years"} </MenuItem>
                                            <MenuItem value="5 years"> {"5 years"} </MenuItem>

                                        </Select>
                                    </FormControl>
                                </Grid>


                            </Grid><br />
                            <Grid container spacing={2}>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl size="small" fullWidth>
                                        <Typography>Notes</Typography>
                                        <TextareaAutosize
                                            aria-label="minimum height"
                                            minRows={5}
                                            value={refferalEdit.notes}
                                            onChange={(e) => { setRefferaledit({ ...refferalEdit, notes: e.target.value }) }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid><br /><br />
                            <br /> <br />
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button variant="contained" onClick={editSubmit}>  Update</Button>
                                </Grid><br />
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}> Cancel </Button>
                                </Grid>
                            </Grid>

                        </>
                    </Box>

                </Dialog>
            </Box>
            <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lreferacandidate") && (
                <>
                    <Box sx={userStyle.container}>
                        { /* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Refer Candidate List</Typography>
                        </Grid>

                        <br />

                        <Grid container spacing={2} style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label >Show entries:</label>
                                    <Select id="pageSizeSelect" value={pageSize}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 180,
                                                    width: 80,
                                                },
                                            },
                                        }}
                                        onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        <MenuItem value={(refList?.length)}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Box >
                                    {isUserRoleCompare?.includes("excelreferacandidate") && (
                                        <>
                                            <ExportXL csvData={rowDataTable.map((t, index) => ({
                                                "Sno": index + 1,
                                                "Refering for Job": t.referingjob,
                                                "Emailid": t.emailid,
                                                "Mobile": t.mobile,
                                                "Relationship": t.relation,
                                                "Knownperiod": t.known,
                                                // "Resume": t.resume,
                                                "Status": t.status,
                                                "Refered By": t.companyname,
                                            }))} fileName={fileName} />
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvreferacandidate") && (
                                        <>
                                            <ExportCSV csvData={rowDataTable.map((t, index) => ({
                                                "Sno": index + 1,
                                                "Refering for Job": t.referingjob,
                                                "Emailid": t.emailid,
                                                "Mobile": t.mobile,
                                                "Relationship": t.relation,
                                                "Knownperiod": t.known,
                                                // "Resume": t.resume,
                                                "Status": t.status,
                                                "Refered By": t.companyname,
                                            }))} fileName={fileName} />

                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printreferacandidate") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfreferacandidate") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()} ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagereferacandidate") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>
                                    )}
                                </Box >
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
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
                        </Grid>
                        <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button>&ensp;

                        <br /><br />
                        {!referCheck ?
                            <>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>

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
                            </>
                            :
                            <>
                                <Box
                                    style={{
                                        width: '100%',
                                        overflowY: 'hidden', // Hide the y-axis scrollbar
                                    }}
                                >
                                    <StyledDataGrid
                                        onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                                        rows={rowsWithCheckboxes}
                                        columns={columnDataTable.filter((column) => columnVisibility[column.field])}
                                        onSelectionModelChange={handleSelectionChange}
                                        selectionModel={selectedRows}
                                        autoHeight={true}
                                        ref={gridRef}
                                        density="compact"
                                        hideFooter
                                        getRowClassName={getRowClassName}
                                        disableRowSelectionOnClick
                                    />


                                </Box>
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
                            </>}
                    </Box>
                </>
            )}
            {/* Manage Column */}
            <Popover
                id={id}
                open={isManageColumnsOpen}
                anchorEl={anchorEl}
                onClose={handleCloseManageColumns}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                {manageColumnsContent}
            </Popover>


            {/* Delete Modal */}
            <Box>
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
                        <Button onClick={handleCloseMod} style={{
                            backgroundColor: '#f4f4f4',
                            color: '#444',
                            boxShadow: 'none',
                            borderRadius: '3px',
                            border: '1px solid #0000006b',
                            '&:hover': {
                                '& .css-bluauu-MuiButtonBase-root-MuiButton-root': {
                                    backgroundColor: '#f4f4f4',
                                },
                            },
                        }}>
                            Cancel
                        </Button>
                        <Button
                            autoFocus
                            variant="contained"
                            color="error"
                            onClick={(e) => delRefer(projectid)}
                        >
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>




                {/* this is info view details */}
                <Dialog
                    open={openInfo}
                    onClose={handleCloseinfo}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <Box sx={{ width: '550px', padding: '20px 50px' }}>
                        <>
                            <Typography sx={userStyle.HeaderText}>Refercandidate Info</Typography>
                            <br /><br />
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
                            <br /> <br /><br />
                            <Grid container spacing={2}>
                                <Button variant="contained" onClick={handleCloseinfo}> Back </Button>
                            </Grid>
                        </>
                    </Box>
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
                                <TableCell> SI.No</TableCell>
                                <TableCell>Refering for Job</TableCell>
                                <TableCell>Emailid</TableCell>
                                <TableCell>Mobile</TableCell>
                                <TableCell>Relationship</TableCell>
                                <TableCell>Knownperiod</TableCell>
                                {/* <TableCell>Resume</TableCell> */}
                                <TableCell>Status</TableCell>
                                <TableCell>Refered By</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody align="left">
                            {rowDataTable &&
                                rowDataTable.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{row.referingjob}</TableCell>
                                        <TableCell>{row.emailid}</TableCell>
                                        <TableCell>{row.mobile}</TableCell>
                                        <TableCell>{row.relation}</TableCell>
                                        <TableCell>{row.known}</TableCell>
                                        {/* <TableCell>{row.resume}</TableCell> */}
                                        <TableCell>{row.status}</TableCell>
                                        <TableCell>{row.companyname}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* view model */}
            <Dialog
                open={openview}
                onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="md"
            >
                <Box sx={{ width: "auto", padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Refer a Candidate</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"><b> Job Recommendation </b></Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Refering for job</Typography>
                                    <Typography>{refferalEdit.referingjob}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"><b> Candidate Information</b></Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={12} xs={12} sm={12}>
                                <Grid container spacing={2}>
                                    <Grid item md={1} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6"> Mr</Typography>
                                            <Typography>{refferalEdit.prefix}</Typography>
                                            {/* <Typography>{refferalEdit.prefix ? undefined : ""}</Typography> */}
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6"> Firstname</Typography>
                                            <Typography>{refferalEdit.firstname}</Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6"> LastName</Typography>
                                            <Typography>{refferalEdit.lastname}</Typography>
                                        </FormControl>
                                    </Grid>
                                    <br />
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6"> Email Id</Typography>
                                            <Typography>{refferalEdit.emailid}</Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">Mobile</Typography>
                                            <Typography>{refferalEdit.mobile}</Typography>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"><b> Additional Information</b></Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Relationship</Typography>
                                    <Typography>{refferalEdit.relation}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Known Period</Typography>
                                    <Typography>{refferalEdit.known}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Notes</Typography>
                                    <Typography>{refferalEdit.notes}</Typography>
                                </FormControl>
                            </Grid>

                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleCloseview}
                            >
                                {" "}
                                Back{" "}
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>

            {/* ALERT DIALOG */}
            <Box>
                <Dialog
                    open={isErrorOpenpop}
                    onClose={handleCloseerrpop}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent
                        sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                    >
                        <Typography variant="h6">{showAlertpop}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" style={{ padding: '7px 13px', color: 'white', background: 'rgb(25, 118, 210)' }}
                            onClick={() => {
                                sendEditRequest();
                                handleCloseerrpop();
                            }}>
                            ok
                        </Button>
                        <Button
                            style={{
                                backgroundColor: '#f4f4f4',
                                color: '#444',
                                boxShadow: 'none',
                                borderRadius: '3px',
                                padding: '7px 13px',
                                border: '1px solid #0000006b',
                                '&:hover': {
                                    '& .css-bluauu-MuiButtonBase-root-MuiButton-root': {
                                        backgroundColor: '#f4f4f4',
                                    },
                                },
                            }}
                            onClick={handleCloseerrpop}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            <Box>
                <Dialog
                    open={isDeleteOpencheckbox}
                    onClose={handleCloseModcheckbox}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                        <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>Are you sure?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>Cancel</Button>
                        <Button autoFocus variant="contained" color='error'
                            onClick={(e) => delRefercheckbox(e)}
                        > OK </Button>
                    </DialogActions>
                </Dialog>

            </Box>
            <Box>
                {/* ALERT DIALOG */}
                <Dialog
                    open={isDeleteOpenalert}
                    onClose={handleCloseModalert}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: 'orange' }} />
                        <Typography variant="h6" sx={{ color: 'black', textAlign: 'center' }}>Please Select any Row</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus variant="contained" color='error'
                            onClick={handleCloseModalert}
                        > OK </Button>
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
                    <DialogContent
                        sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                    >
                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" style={{
                            padding: '7px 13px',
                            color: 'white',
                            background: 'rgb(25, 118, 210)'
                        }} onClick={handleCloseerr}>
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>


        </Box>
    );
}

export default Refercandidate;