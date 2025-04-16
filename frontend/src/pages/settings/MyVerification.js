import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import { Backdrop, Box, Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton, InputLabel, List, ListItem, ListItemText, MenuItem, Modal, OutlinedInput, Paper, Popover, Select, Table, TableBody, TableContainer, TableHead, TextareaAutosize, TextField, Typography } from "@mui/material";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { City, Country, State } from "country-state-city";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import Cropper from "react-cropper";
import { AiOutlineClose } from "react-icons/ai";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPlus, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { useParams } from "react-router-dom";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import ExportData from "../../components/ExportData";
import Headtitle from "../../components/Headtitle";
import { StyledTableCell, StyledTableRow } from "../../components/Table";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import PageHeading from "../../components/PageHeading";

const Loader = ({ loading, message }) => {
    return (
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 999 }} open={loading}>
            <div style={{ textAlign: 'center' }}>
                <CircularProgress sx={{ color: '#edf1f7' }} />
                <Typography variant="h6" sx={{ mt: 2, color: '#edf1f7' }}>
                    {message}
                </Typography>
            </div>
        </Backdrop>
    );
};
function MyVerification() {
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Please Wait...!');
    const [employees, setEmployees] = useState([]);
    const { isUserRoleAccess, isUserRoleCompare, isAssignBranch, pageName, setPageName } = useContext(UserRoleAccessContext);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    setTimeout(() => {
        setIsUpdateOpen(false)
        setCorrect(false)
    }, 2500)
    const [isCorrect, setCorrect] = useState(false)
    const [allInformation, setAllInformation] = useState({})
    const [allInformationEdit, setAllInformationEdit] = useState({})
    const [selectedCompany, setSelectedCompany] = useState("");
    const [selectedBranch, setSelectedBranch] = useState("");
    const [selectedUnit, setSelectedUnit] = useState("");
    const [selectedTeam, setSelectedTeam] = useState("");
    const [selectedDesignation, setSelectedDesignation] = useState("");
    const [todo, setTodo] = useState([]);
    const [employeecodenew, setEmployeecodenew] = useState("");
    const [selectedCountryp, setSelectedCountryp] = useState(null);
    const [selectedStatep, setSelectedStatep] = useState(null);
    const [selectedCityp, setSelectedCityp] = useState(null);
    const [selectedCountryc, setSelectedCountryc] = useState(null);
    const [selectedStatec, setSelectedStatec] = useState(null);
    const [selectedCityc, setSelectedCityc] = useState(null);
    const [targetpts, setTargetpts] = useState("");
    const [errorsLog, setErrorsLog] = useState({});
    const [loginNotAllot, setLoginNotAllot] = useState({
        process: "Please Select Process",
        processtype: "Primary",
        processduration: "Full",
        time: "Hrs",
        timemins: "Mins",
    });
    const [profileImg, setProfileImg] = useState('');
    const [overallgrosstotal, setoverallgrosstotal] = useState("");
    const [modeexperience, setModeexperience] = useState("");
    const [targetexperience, setTargetexperience] = useState("");
    const [primaryWorkStationInput, setPrimaryWorkStationInput] = useState("");
    const [croppedImage, setCroppedImage] = useState("");
    const [enableLoginName, setEnableLoginName] = useState(true);
    const [third, setThird] = useState("");
    const [primaryWorkStation, setPrimaryWorkStation] = useState("Please Select Primary Work Station");
    const [selectedOptionsWorkStation, setSelectedOptionsWorkStation] = useState([]);
    const [first, setFirst] = useState("");
    const [second, setSecond] = useState("");
    const [name, setUserNameEmail] = useState("");
    const [errmsg, setErrmsg] = useState("");
    const [files, setFiles] = useState([]);
    const [filesEdit, setFilesEdit] = useState([]);
    const renderFilePreview = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };
    let allInfo = ["Personal Information", "Reference Details", "Permanent Address", "Current Address", "Work History", "Bank Details", "Educational qualification", "Additional qualification", "Document List"]
    const handleFileUpload = (event) => {
        const files = event.target.files;
        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();
            const file = files[i];
            reader.readAsDataURL(file);
            reader.onload = () => {
                setFilesEdit((prevFiles) => {
                    // Ensure prevFiles is an array
                    if (!Array.isArray(prevFiles)) {
                        prevFiles = [];
                    }
                    return [
                        ...prevFiles,
                        {
                            name: file.name,
                            preview: reader.result,
                            type: file.type, // Include the file type
                            data: reader.result.split(",")[1],
                            remark: fileNames === "Please Select File Name" ? "" : fileNames,
                        },
                    ];
                });
            };
        }
        setfileNames("Please Select File Name");
    };
    const handleFileDelete = (index) => {
        setFilesEdit((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };
    const handleRemarkChange = (index, remark) => {
        setFilesEdit((prevFiles) =>
            prevFiles.map((file, i) => (i === index ? { ...file, remark } : file))
        );
    };
    let sno = 1;
    let snowv = 1;
    let snowe = 1;
    let snoe = 1;
    const [eduTodo, setEduTodo] = useState([]);
    const [eduTodoEdit, setEduTodoEdit] = useState([]);
    let eduno = 1;
    let edunoe = 1;
    const [addAddQuaTodo, setAddQuaTodo] = useState("");
    const [addAddQuaTodoEdit, setAddQuaTodoEdit] = useState("");
    let skno = 1;
    let sknoe = 1;
    const [workhistTodo, setWorkhistTodo] = useState("");
    const [workhistTodoEdit, setWorkhistTodoEdit] = useState("");
    useEffect(() => {
        ShowErrMess();
        setThird(first + second.slice(0, 1));
        setUserNameEmail(first + second.slice(0, 1));
    }, [first, second, name]);
    //ERROR MESSAGESE
    const ShowErrMess = () => {
        if (first.length == "" || second.length == 0) {
            setErrmsg("Unavailable");
        } else if (third.length >= 1) {
            setErrmsg("Available");
        }
    };
    //Edit Popups
    const currentYear = new Date().getFullYear();
    const cropperRef = useRef(null);
    const maxDate = `${currentYear - 16}-12-31`;
    const [errors, setErrors] = useState({});
    const [step, setStep] = useState(1);
    const [isValidEmail, setIsValidEmail] = useState(false);
    let final = croppedImage ? croppedImage : profileImg;
    const [file, setFile] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    let [valueCate, setValueCate] = useState("");
    const [roles, setRoles] = useState([]);
    const [referenceTodo, setReferenceTodo] = useState([]);
    const [referenceTodoEdit, setReferenceTodoEdit] = useState([]);
    const [referenceTodoError, setReferenceTodoError] = useState({});
    const [documentID, setDocumentID] = useState("");
    const [categorys, setCategorys] = useState([]);
    const [educationsOpt, setEducationsOpt] = useState([]);
    const [subcategorys, setSubcategorys] = useState([]);
    const [errorstodo, setErrorstodo] = useState({});
    const [addQual, setAddQual] = useState("");
    const [addInst, setAddInst] = useState("");
    const [duration, setDuration] = useState("");
    const [remarks, setRemarks] = useState("");
    const [skillSet, setSkillSet] = useState([]);
    const [empNameTodo, setEmpNameTodo] = useState("");
    const [desigTodo, setDesigTodo] = useState("");
    const [joindateTodo, setJoindateTodo] = useState("");
    const [leavedateTodo, setLeavedateTodo] = useState("");
    const [dutiesTodo, setDutiesTodo] = useState("");
    const [reasonTodo, setReasonTodo] = useState("");
    const id = useParams().id;
    // const { id: newId } = useParams();
    //SkillSet DropDowns
    const fetchSkillSet = async () => {
        setPageName(!pageName)
        try {
            let req = await axios.get(SERVICE.SKILLSET, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setSkillSet(
                req.data.skillsets.length > 0 &&
                req.data.skillsets.map((d) => ({
                    ...d,
                    label: d.name,
                    value: d.name,
                }))
            );
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerr();
            } else {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"something went wrong!"}
                        </p>
                    </>
                );
                handleClickOpenerr();
            }
        }
    };
    //Submit function for Work History
    const handleSubmitWorkSubmit = (e) => {
        e.preventDefault();
        const errorstodo = {};
        // Check if empNameTodo already exists in Edit
        const isDuplicate = workhistTodo?.some(
            (entry) =>
                entry.empNameTodo?.toLowerCase() === empNameTodo?.toLowerCase() &&
                entry.desigTodo?.toLowerCase() === desigTodo?.toLowerCase() &&
                entry.joindateTodo === joindateTodo &&
                entry.leavedateTodo === leavedateTodo &&
                entry.reasonTodo?.toLowerCase() === reasonTodo?.toLowerCase()
        );
        // Check if all fields are filled
        if (
            empNameTodo === "" ||
            desigTodo === "" ||
            joindateTodo === "" ||
            leavedateTodo === "" ||
            dutiesTodo === "" ||
            reasonTodo === ""
        ) {
            errorstodo.empNameTodo = (
                <Typography style={{ color: "red" }}>Please Fill All Fields</Typography>
            );
        } else if (isDuplicate) {
            errorstodo.empNameTodo = (
                <Typography style={{ color: "red" }}>Already Added!</Typography>
            );
        }
        setErrorstodo(errorstodo);
        if (Object.keys(errorstodo)?.length === 0) {
            setWorkhistTodoEdit([
                ...workhistTodoEdit,
                {
                    empNameTodo,
                    desigTodo,
                    joindateTodo,
                    leavedateTodo,
                    dutiesTodo,
                    reasonTodo,
                },
            ]);
            setErrorstodo("");
            setEmpNameTodo("");
            setDesigTodo("");
            setJoindateTodo("");
            setLeavedateTodo("");
            setDutiesTodo("");
            setReasonTodo("");
        }
    };
    //Delete for Work History
    const handleWorkHisDelete = (index) => {
        const newWorkHisTodo = [...workhistTodoEdit];
        newWorkHisTodo.splice(index, 1);
        setWorkhistTodoEdit(newWorkHisTodo);
    };
    //ADDICTIONAL QUALIFICATION SECTION FUNCTIONALITY
    const [institution, setInstitution] = useState("");
    const [passedyear, setPassedyear] = useState("");
    const [cgpa, setCgpa] = useState("");
    const handlechangepassedyear = (e) => {
        const regex = /^[0-9]+$/; // Only allows positive integers
        const inputValue = e.target.value?.slice(0, 4);
        if (regex.test(inputValue) || inputValue === "") {
            setPassedyear(inputValue);
        }
    };
    //change form
    const handlechangecontactpersonal = (e) => {
        const regex = /^[0-9]+$/; // Only allows positive integers
        const inputValue = e.target.value?.slice(0, 10);
        if (regex.test(inputValue) || inputValue === "") {
            setAllInformationEdit({ ...allInformationEdit, contactpersonal: inputValue });
        }
    };
    const handlechangecontactfamily = (e) => {
        const regex = /^[0-9]+$/; // Only allows positive integers
        const inputValue = e.target.value?.slice(0, 10);
        if (regex.test(inputValue) || inputValue === "") {
            setAllInformationEdit({ ...allInformationEdit, contactfamily: inputValue });
        }
    };
    const handlechangeemergencyno = (e) => {
        const regex = /^[0-9]+$/; // Only allows positive integers
        const inputValue = e.target.value?.slice(0, 10);
        if (regex.test(inputValue) || inputValue === "") {
            setAllInformationEdit({ ...allInformationEdit, emergencyno: inputValue });
        }
    };
    const handlechangeaadhar = (e) => {
        const regex = /^[0-9]+$/; // Only allows positive integers
        const inputValue = e.target.value?.slice(0, 12);
        if (regex.test(inputValue) || inputValue === "") {
            setAllInformationEdit({ ...allInformationEdit, aadhar: inputValue });
        }
    };
    //Submit function for TODO Education
    const handleSubmittodo = (e) => {
        const errorstodo = {};
        const Nameismatch = eduTodoEdit?.some(
            (data, index) =>
                data.categoryedu == allInformationEdit.categoryedu &&
                data.subcategoryedu == allInformationEdit.subcategoryedu &&
                data.specialization == allInformationEdit.specialization &&
                data.institution == institution &&
                data.passedyear == passedyear &&
                data.cgpa == cgpa
        );
        e.preventDefault();
        if (
            allInformationEdit.categoryedu == "Please Select Category" ||
            allInformationEdit.subcategoryedu == "Please Select Sub Category" ||
            allInformationEdit.specialization == "Please Select Specialization" ||
            institution == "" ||
            passedyear == "" ||
            cgpa == ""
        ) {
            errorstodo.qualification = (
                <Typography style={{ color: "red" }}>Please Fill All Fields</Typography>
            );
            setErrorstodo(errorstodo);
        } else if (
            allInformationEdit.categoryedu !== "Please Select Category" &&
            allInformationEdit.subcategoryedu !== "Please Select Sub Category" &&
            allInformationEdit.specialization !== "Please Select Specialization" &&
            institution !== "" &&
            passedyear !== "" &&
            passedyear?.length !== 4 &&
            cgpa !== ""
        ) {
            errorstodo.qualification = (
                <Typography style={{ color: "red" }}>
                    Please Enter Valid Passed Year
                </Typography>
            );
            setErrorstodo(errorstodo);
        } else if (Nameismatch) {
            errorstodo.qualification = (
                <Typography style={{ color: "red" }}>Already Added!</Typography>
            );
            setErrorstodo(errorstodo);
        } else {
            setEduTodoEdit([
                ...eduTodoEdit,
                {
                    categoryedu: allInformationEdit.categoryedu,
                    subcategoryedu: allInformationEdit.subcategoryedu,
                    specialization: allInformationEdit.specialization,
                    institution,
                    passedyear,
                    cgpa,
                },
            ]);
            setErrorstodo("");
            setAllInformationEdit((prev) => ({
                ...prev,
                categoryedu: "Please Select Category",
                subcategoryedu: "Please Select Sub Category",
                specialization: "Please Select Specialization",
            }));
            setInstitution("");
            setPassedyear("");
            setCgpa("");
            setSubcategorys([]);
            setEducationsOpt([]);
        }
    };
    //Delete for Education
    const handleDelete = (index) => {
        const newTodos = [...eduTodoEdit];
        newTodos.splice(index, 1);
        setEduTodoEdit(newTodos);
    };
    const handlechangecgpa = (e) => {
        const regex = /^\d*\.?\d*$/;
        const inputValue = e.target.value?.slice(0, 4);
        if (regex.test(inputValue) || inputValue === "") {
            setCgpa(inputValue);
        }
    };
    //Submit function for Additional Qualification
    const handleSubmitAddtodo = (e) => {
        const errorstodo = {};
        const Namematch = addAddQuaTodo?.some(
            (data, index) =>
                data.addQual == addQual &&
                data.addInst == addInst &&
                data.duration == duration &&
                data.remarks == remarks
        );
        e.preventDefault();
        if (addQual == "" || addInst == "" || duration == "") {
            errorstodo.addQual = (
                <Typography style={{ color: "red" }}>Please Fill All Fields</Typography>
            );
            setErrorstodo(errorstodo);
        } else if (Namematch) {
            errorstodo.addQual = (
                <Typography style={{ color: "red" }}>Already Added!</Typography>
            );
            setErrorstodo(errorstodo);
        } else {
            setAddQuaTodoEdit([
                ...addAddQuaTodoEdit,
                { addQual, addInst, duration, remarks },
            ]);
            setErrorstodo("");
            setAddQual("");
            setAddInst("");
            setDuration("");
            setRemarks("");
        }
    };
    //Delete for Additional Qualification
    const handleAddDelete = (index) => {
        const newTodosed = [...addAddQuaTodoEdit];
        newTodosed.splice(index, 1);
        setAddQuaTodoEdit(newTodosed);
    };
    const fetchCategoryBased = async (e) => {
        setPageName(!pageName)
        try {
            let res_category = await axios.get(SERVICE.CATEGORYEDUCATION, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let data_set = res_category.data.educationcategory.filter((data) => {
                return data.categoryname === e.value;
            });
            let get =
                data_set?.length > 0
                    ? data_set[0].subcategoryname.map((data) => ({
                        label: data,
                        value: data,
                    }))
                    : [];
            setSubcategorys(get);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            style={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerr();
            } else {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            style={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"something3  went wrong!"}
                        </p>
                    </>
                );
                handleClickOpenerr();
            }
        }
    };
    const fetchCategoryEducation = async () => {
        setPageName(!pageName)
        try {
            let res_category = await axios.get(SERVICE.CATEGORYEDUCATION, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let data_set = res_category.data.educationcategory.map(
                (d) => d.categoryname
            );
            let filter_opt = [...new Set(data_set)];
            setCategorys(
                filter_opt.map((data) => ({
                    ...data,
                    label: data,
                    value: data,
                }))
            );
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            style={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerr();
            } else {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            style={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"something2 went wrong!"}
                        </p>
                    </>
                );
                handleClickOpenerr();
            }
        }
    };
    const fetchEducation = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(SERVICE.EDUCATIONSPECILIZATION, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let data_set = res.data.educationspecilizations.filter((data) => {
                return (
                    data.category.includes(allInformationEdit.categoryedu) &&
                    data.subcategory.includes(e.value)
                );
            });
            let result =
                data_set?.length > 0
                    ? data_set[0].specilizationgrp.map((data) => ({
                        label: data.label,
                        value: data.label,
                    }))
                    : [];
            setEducationsOpt(result);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerr();
            } else {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"something went wrong!"}
                        </p>
                    </>
                );
                handleClickOpenerr();
            }
        }
    };
    const [getbranchname, setgetbranchname] = useState("");
    let branchname = getbranchname ? setgetbranchname : allInformation.company;
    let loginid = localStorage.LoginUserId;
    const handlechangecpincode = (e) => {
        const regex = /^[0-9]+$/; // Only allows positive integers
        const inputValue = e?.target?.value?.slice(0, 6);
        if (regex.test(inputValue) || inputValue === "") {
            setAllInformationEdit({ ...allInformationEdit, cpincode: inputValue });
        }
    };
    const handlechangeppincode = (e) => {
        const regex = /^[0-9]+$/; // Only allows positive integers
        const inputValue = e?.target?.value?.slice(0, 6);
        if (regex.test(inputValue) || inputValue === "") {
            setAllInformationEdit({ ...allInformationEdit, ppincode: inputValue });
        }
    };
    const [singleReferenceTodoEdit, setSingleReferenceTodoEdit] = useState({
        name: "",
        relationship: "",
        occupation: "",
        contact: "",
        details: "",
    });
    const [designationsFileNames, setDesignationsFileNames] = useState([]);
    const [fileNames, setfileNames] = useState("Please Select File Name");
    //get all Areas.
    const fetchCandidatedocumentdropdowns = async (name) => {
        setPageName(!pageName)
        try {
            let res_candidate = await axios.get(SERVICE.CANDIDATEDOCUMENT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let data_set = res_candidate.data.candidatedocuments.filter(
                (data) => data.designation === name
            );
            const desigall = [
                ...data_set.map((d) => ({
                    ...d,
                    label: d.candidatefilename,
                    value: d.candidatefilename,
                })),
            ];
            setDesignationsFileNames(desigall);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerr();
            } else {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"something went wrong!"}
                        </p>
                    </>
                );
                handleClickOpenerr();
            }
        }
    };
    // SELECT DROPDOWN STYLES
    const colourStyles = {
        menuList: (styles) => ({
            ...styles,
            background: "white",
        }),
        option: (styles, { isFocused, isSelected }) => ({
            ...styles,
            color: isFocused
                ? "rgb(255 255 255, 0.5)"
                : isSelected
                    ? "white"
                    : "black",
            background: isFocused
                ? "rgb(25 118 210, 0.7)"
                : isSelected
                    ? "rgb(25 118 210, 0.5)"
                    : null,
            zIndex: 1,
        }),
        menu: (base) => ({
            ...base,
            zIndex: 100,
        }),
    };
    useEffect(() => {
        fetchSkillSet();
        fetchCategoryEducation();
    }, []);
    const addReferenceTodoFunction = () => {
        const isNameMatch = referenceTodo?.some(
            (item) => item.name === singleReferenceTodoEdit.name
        );
        const newErrorsLog = {};
        if (singleReferenceTodoEdit.name === "") {
            newErrorsLog.name = (
                <Typography style={{ color: "red" }}>Name must be required</Typography>
            );
        } else if (isNameMatch) {
            newErrorsLog.duplicate = (
                <Typography style={{ color: "red" }}>
                    Reference Already Exist!
                </Typography>
            );
        }
        if (
            singleReferenceTodoEdit.contact !== "" &&
            singleReferenceTodoEdit.contact?.length !== 10
        ) {
            newErrorsLog.contactno = (
                <Typography style={{ color: "red" }}>
                    Contact No must be 10 digits required
                </Typography>
            );
        }
        if (singleReferenceTodoEdit !== "" && Object.keys(newErrorsLog).length === 0) {
            setReferenceTodoEdit([...referenceTodoEdit, singleReferenceTodoEdit]);
            setSingleReferenceTodoEdit({
                name: "",
                relationship: "",
                occupation: "",
                contact: "",
                details: "",
            });
        }
        setReferenceTodoError(newErrorsLog);
    };
    const deleteReferenceTodo = (index) => {
        const newTasks = [...referenceTodoEdit];
        newTasks.splice(index, 1);
        setReferenceTodoEdit(newTasks);
    };
    const handlechangereferencecontactno = (e) => {
        const regex = /^[0-9]+$/; // Only allows positive integers
        const inputValue = e.target.value?.slice(0, 10);
        if (regex.test(inputValue) || inputValue === "") {
            setSingleReferenceTodoEdit({ ...singleReferenceTodoEdit, contact: inputValue });
        }
    };
    function toDataURL(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.send();
    }
    // Image Upload
    function handleChangeImage(e) {
        let profileimage = document.getElementById("profileimage");
        var path = (window.URL || window.webkitURL).createObjectURL(
            profileimage.files[0]
        );
        toDataURL(path, function (dataUrl) {
            profileimage.setAttribute("value", String(dataUrl));
            setProfileImg(String(dataUrl));
            return dataUrl;
        });
        setFile(URL.createObjectURL(e.target.files[0]));
    }
    const validateEmail = (email) => {
        const regex = /\S+@\S+\.\S+/;
        let emailvalue = email ? email : allInformation.email;
        return regex.test(emailvalue);
    };
    //image cropping
    const handleCrop = () => {
        if (typeof cropperRef.current.cropper.getCroppedCanvas() === "undefined") {
            return;
        }
        setCroppedImage(cropperRef.current.cropper.getCroppedCanvas().toDataURL());
        setSelectedFile(null);
    };
    const handleClearImage = () => {
        setFile(null);
        setSelectedFile(null);
        setCroppedImage(null);
        setProfileImg("");
    };
    const [verifyAll, setVerifyAll] = useState({});

    const handleClickEdited = async () => {
        setLoading(true)
        setLoadingMessage("Updating...")
        setPageName(!pageName)
        try {
            let updateObj = allInfo?.map(item => ({
                name: item,
                edited: false,
                corrected: false
            }))

            let editedVerify = verifyAll.verified?.map(item =>
                item.name === verifyAll.information ? { ...item, edited: true } : item
            )
            var editedVerifyMyVerify = verifyAll.verified?.map(item =>
                item.name === verifyAll.information ? { ...item, edited: true } : item
            )?.filter((item) => item.name === verifyAll.information);

            await axios.put(`${SERVICE.MYVERIFICATION_SINGLE}/${verifyAll?.templateId}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                verifiedInfo: editedVerify
            })
            let datas = await axios.get(SERVICE.MYFIELDVERIFICATION);
            let isAvailed = datas?.data?.myverification?.find((item) => item?.employeeid == isUserRoleAccess?._id);

            if (isAvailed) {
                await axios.put(`${SERVICE.MYFIELDVERIFICATION_SINGLE}/${isAvailed?._id}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    // updatestatus: isAvailedStatus?.length > 0 ? isAvailedStatus : updateObj,
                    ...(isPersonalInfoOpenEdit && {
                        firstname: String(allInformationEdit?.firstname),
                        prefix: String(allInformationEdit?.prefix),
                        lastname: String(allInformationEdit?.lastname),
                        legalname: String(allInformationEdit?.legalname),
                        callingname: String(allInformationEdit?.callingname),
                        fathername: String(allInformationEdit?.fathername),
                        mothername: String(allInformationEdit?.mothername),
                        gender: String(allInformationEdit?.gender),
                        maritalstatus: String(allInformationEdit?.maritalstatus),
                        dom: String(allInformationEdit?.dom),
                        dob: String(allInformationEdit?.dob),
                        location: String(allInformationEdit?.location),
                        bloodgroup: String(allInformationEdit?.bloodgroup),
                        email: String(allInformationEdit?.email),
                        contactpersonal: String(allInformationEdit?.contactpersonal),
                        contactfamily: String(allInformationEdit?.contactfamily),
                        emergencyno: String(allInformationEdit?.emergencyno),
                        panno: String(allInformationEdit?.panstatus === "Have PAN" ? allInformationEdit?.panno : ""),
                        aadhar: String(allInformationEdit?.aadhar),
                        panstatus: String(allInformationEdit?.panstatus),
                        panrefno: String(allInformationEdit?.panstatus === "Applied" ? allInformationEdit?.panrefno : ""),
                        userprofile: String(final),
                        personalinfoproof: String(infoProof.personalinfoproof),
                    }),

                    //////reff
                    ...(isReferenceOpenEdit && {
                        referencetodo: referenceTodoEdit.length === 0 ? [] : [...referenceTodoEdit],
                        referenceproof: String(infoProof.referenceproof),
                    }),

                    ///permanentadd
                    ...(isPermanantAddressOpenEdit && {

                        pdoorno: String(allInformationEdit?.pdoorno),
                        pstreet: String(allInformationEdit?.pstreet),
                        parea: String(allInformationEdit?.parea),
                        plandmark: String(allInformationEdit?.plandmark),
                        ptaluk: String(allInformationEdit?.ptaluk),
                        ppost: String(allInformationEdit?.ppost),
                        ppincode: String(allInformationEdit?.ppincode),
                        pcountry: String(allInformationEdit?.pcountry),
                        pstate: String(allInformationEdit?.pstate),
                        pcity: String(allInformationEdit?.pcity),
                        paddressproof: String(infoProof.paddressproof),
                    }),
                    ///currentadd
                    ...(isCurrentAddressOpenEdit && {

                        cdoorno: String(
                            allInformationEdit?.cdoorno
                        ),
                        cstreet: String(
                            allInformationEdit?.cstreet
                        ),
                        carea: String(allInformationEdit?.carea),
                        clandmark: String(
                            allInformationEdit?.clandmark
                        ),
                        ctaluk: String(
                            allInformationEdit?.ctaluk
                        ),
                        cpost: String(allInformationEdit?.cpost),
                        cpincode: String(
                            allInformationEdit?.cpincode
                        ),
                        ccountry: String(
                            allInformationEdit?.ccountry
                        ),
                        cstate: String(
                            allInformationEdit?.cstate
                        ),
                        ccity: String(
                            allInformationEdit?.ccity
                        ),
                        caddressproof: String(infoProof.caddressproof),
                    }),

                    ///document
                    ...(isDocumentListOpenEdit && {
                        files: filesEdit ?? [],
                        documentproof: String(infoProof.documentproof),
                    }),

                    //educationqu
                    ...(isEducationalQualifyOpenEdit && {
                        eduTodo: [...eduTodoEdit],
                        eduqualiproof: String(infoProof.eduqualiproof),
                    }),

                    //addictonqua
                    ...(isAdditionalQualifyOpenEdit && {

                        addAddQuaTodo: [...addAddQuaTodoEdit],
                        addqualiproof: String(infoProof.addqualiproof),
                    }),
                    //workhist
                    ...(isWorkHistoryOpenEdit && {

                        workhistTodo: [...workhistTodoEdit],
                        workhistproof: String(infoProof.workhistproof),
                    }),

                    //banckdet
                    ...(isBankDetailsOpenEdit && {

                        bankdetails: [...bankTodoEdit],
                        bankdetailsproof: String(infoProof.bankdetailsproof),
                    }),





                    employeename: String(isUserRoleAccess?.companyname),
                    employeeid: String(isUserRoleAccess?._id),
                    empcode: String(
                        allInformationEdit?.wordcheck === true ? employeecodenew : allInformationEdit?.empcode
                    ),
                    verifiedInfo: [...isAvailed?.verifiedInfo, ...editedVerifyMyVerify],
                    // verifiedInfo: isAvailed?.verifiedInfo?.length > 0 ? secontfilt : editedVerify,
                    verificationstatus: String("Edited"),
                    username: enableLoginName ? String(third) : allInformationEdit?.username,
                    usernameautogenerate: Boolean(enableLoginName),



                    updatestatus: [...isAvailed?.updatestatus, ...editedVerifyMyVerify],
                    wordcheck: Boolean(allInformationEdit?.wordcheck),
                    contactno: String(allInformationEdit?.contactno),
                    details: String(allInformationEdit?.details),
                    password: String(allInformationEdit?.password),

                    explogproof: String(infoProof.explogproof),
                    updatedby: [
                        ...isUserRoleAccess.updatedby,
                        {
                            name: String(isUserRoleAccess?.username),
                            date: String(new Date()),
                        },
                    ],

                });
            } else {
                // ?.filter((item)=> item.name ===  verifyAll.information );
                var editedVerifyMyVerify = verifyAll.verified?.map(item =>
                    item.name === verifyAll.information ? { ...item, edited: true } : item
                )?.filter((item) => item.name === verifyAll.information);


                await axios.post(`${SERVICE.MYFIELDVERIFICATION_CREATE}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    updatestatus: [...editedVerifyMyVerify],
                    verifiedInfo: [...editedVerifyMyVerify],
                    verificationstatus: String("Edited"),
                    userprofile: String(final),
                    username: enableLoginName ? String(third) : allInformationEdit?.username,
                    employeename: String(isUserRoleAccess?.companyname),
                    usernameautogenerate: Boolean(enableLoginName),
                    employeeid: String(isUserRoleAccess?._id),
                    firstname: String(allInformationEdit?.firstname),
                    lastname: String(allInformationEdit?.lastname),
                    legalname: String(allInformationEdit?.legalname),
                    callingname: String(allInformationEdit?.callingname),
                    prefix: String(allInformationEdit?.prefix),
                    fathername: String(allInformationEdit?.fathername),
                    mothername: String(allInformationEdit?.mothername),
                    gender: String(allInformationEdit?.gender),
                    maritalstatus: String(allInformationEdit?.maritalstatus),
                    dom: String(allInformationEdit?.dom),
                    dob: String(allInformationEdit?.dob),
                    // dot: String(allInformationEdit?.dot),
                    // doj: String(allInformationEdit?.doj),
                    bloodgroup: String(allInformationEdit?.bloodgroup),
                    location: String(allInformationEdit?.location),
                    email: String(allInformationEdit?.email),
                    contactpersonal: String(allInformationEdit?.contactpersonal),
                    contactfamily: String(allInformationEdit?.contactfamily),
                    emergencyno: String(allInformationEdit?.emergencyno),
                    wordcheck: Boolean(allInformationEdit?.wordcheck),
                    aadhar: String(allInformationEdit?.aadhar),
                    panno: String(allInformationEdit?.panstatus === "Have PAN" ? allInformationEdit?.panno : ""),
                    referencetodo: referenceTodoEdit.length === 0 ? [] : [...referenceTodoEdit],
                    contactno: String(allInformationEdit?.contactno),
                    details: String(allInformationEdit?.details),
                    password: String(allInformationEdit?.password),
                    pdoorno: String(allInformationEdit?.pdoorno),
                    pstreet: String(allInformationEdit?.pstreet),
                    parea: String(allInformationEdit?.parea),
                    plandmark: String(allInformationEdit?.plandmark),
                    ptaluk: String(allInformationEdit?.ptaluk),
                    ppost: String(allInformationEdit?.ppost),
                    ppincode: String(allInformationEdit?.ppincode),
                    pcountry: String(allInformationEdit?.pcountry),
                    pstate: String(allInformationEdit?.pstate),
                    pcity: String(allInformationEdit?.pcity),
                    date: String(new Date()),
                    cdoorno: String(allInformationEdit?.cdoorno),
                    cstreet: String(allInformationEdit?.cstreet),
                    carea: String(allInformationEdit?.carea),
                    clandmark: String(allInformationEdit?.clandmark),
                    ctaluk: String(allInformationEdit?.ctaluk),
                    cpost: String(allInformationEdit?.cpost),
                    cpincode: String(allInformationEdit?.cpincode),
                    ccountry: String(allInformationEdit?.ccountry),
                    cstate: String(allInformationEdit?.cstate),
                    ccity: String(allInformationEdit?.ccity),
                    files: filesEdit ?? [],
                    eduTodo: [...eduTodoEdit],
                    addAddQuaTodo: [...addAddQuaTodoEdit],
                    workhistTodo: [...workhistTodoEdit],
                    bankdetails: [...bankTodoEdit],
                    explogproof: String(infoProof.explogproof),
                    bankdetailsproof: String(infoProof.bankdetailsproof),
                    eduqualiproof: String(infoProof.eduqualiproof),
                    addqualiproof: String(infoProof.addqualiproof),
                    workhistproof: String(infoProof.workhistproof),
                    documentproof: String(infoProof.documentproof),
                    caddressproof: String(infoProof.caddressproof),
                    paddressproof: String(infoProof.paddressproof),
                    referenceproof: String(infoProof.referenceproof),
                    personalinfoproof: String(infoProof.personalinfoproof),
                    updatedby: [
                        ...isUserRoleAccess.updatedby,
                        {
                            name: String(isUserRoleAccess?.username),
                            date: String(new Date()),
                        },
                    ],
                });
            }
            await getCode();
            setLoading(false)
            setIsUpdateOpen(true);
            setIsPersonalInfoOpenEdit(false);
            setIsPersonalInfoOpen(false);
            setAddOpenalertPersonal(false);
            setIsReferenceOpenEdit(false);
            setIsReferenceOpen(false);
            setAddOpenalertReference(false);
            setIsPermanantAddressOpenEdit(false);
            setIsPermanantAddressOpen(false);
            setAddOpenalertPermanant(false);
            setIsCurrentAddressOpenEdit(false);
            setIsCurrentAddressOpen(false);
            setAddOpenalertCurrent(false);
            setIsDocumentListOpenEdit(false);
            setIsDocumentListOpen(false);
            setAddOpenalertDocument(false);
            setIsEducationalQualifyOpenEdit(false);
            setIsEducationalQualifyOpen(false);
            setAddOpenalertEducational(false);
            setIsAdditionalQualifyOpenEdit(false);
            setIsAdditionalQualifyOpen(false);
            setAddOpenalertAdditional(false);
            setIsWorkHistoryOpenEdit(false);
            setIsWorkHistoryOpen(false);
            setAddOpenalertWork(false);
            setIsBankDetailsOpenEdit(false);
            setIsBankDetailsOpen(false);
            setAddOpenalertBank(false);
        }
        catch (err) {
            setLoading(false)
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerr();
            } else {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"something went wrong!"}
                        </p>
                    </>
                );
                handleClickOpenerr();
            }
        }
    }
    const requiredFieldCheckPersonal = async () => {
        setPageName(!pageName)
        try {
            const newErrors = {};
            if (!allInformationEdit.callingname) {
                newErrors.callingname = (
                    <Typography style={{ color: "red" }}>
                        Calling Name must be required
                    </Typography>
                );
            }
            if (!allInformationEdit.email) {
                newErrors.email = (
                    <Typography style={{ color: "red" }}>
                        Email must be required
                    </Typography>
                );
            }
            else if (!isValidEmail) {
                newErrors.email = (
                    <Typography style={{ color: "red" }}>
                        Please enter valid email
                    </Typography>
                );
            }
            if (!allInformationEdit.emergencyno) {
                newErrors.emergencyno = (
                    <Typography style={{ color: "red" }}>
                        Emergency no must be required
                    </Typography>
                );
            } else if (allInformationEdit.emergencyno.length !== 10) {
                newErrors.emergencyno = (
                    <Typography style={{ color: "red" }}>
                        Emergency no must be 10 digits required
                    </Typography>
                );
            }
            if (allInformationEdit.maritalstatus === "Married" && !allInformationEdit.dom) {
                newErrors.dom = (
                    <Typography style={{ color: "red" }}>DOM must be required</Typography>
                );
            }
            if (
                allInformationEdit.contactfamily !== "" &&
                allInformationEdit.contactfamily.length !== 10
            ) {
                newErrors.contactfamily = (
                    <Typography style={{ color: "red" }}>
                        Contact(Family) no must be 10 digits required
                    </Typography>
                );
            }
            if (
                allInformationEdit.contactpersonal !== "" &&
                allInformationEdit.contactpersonal.length !== 10
            ) {
                newErrors.contactpersonal = (
                    <Typography style={{ color: "red" }}>
                        Contact(personal) no must be 10 digits required
                    </Typography>
                );
            }
            if (allInformationEdit?.panno !== "" && allInformationEdit?.panno?.length !== 10) {
                newErrors.panno = (
                    <Typography style={{ color: "red" }}>
                        Pan No must be 10 digits required
                    </Typography>
                );
            }
            if (allInformationEdit?.panno === "" && allInformationEdit?.panstatus === "Have PAN") {
                newErrors.panno = (
                    <Typography style={{ color: "red" }}>
                        Pan No must be required
                    </Typography>
                );
            }
            if (allInformationEdit?.panrefno === "" && allInformationEdit?.panstatus === "Applied") {
                newErrors.panrefno = (
                    <Typography style={{ color: "red" }}>
                        Application Reference No must be required
                    </Typography>
                );
            }
            if (!allInformationEdit.dob) {
                newErrors.dob = (
                    <Typography style={{ color: "red" }}>DOB must be required</Typography>
                );
            }
            if (!allInformationEdit.aadhar) {
                newErrors.aadhar = (
                    <Typography style={{ color: "red" }}>
                        {" "}
                        Aadhar must be required{" "}
                    </Typography>
                );
            } else if (allInformationEdit.aadhar.length < 12) {
                newErrors.aadhar = (
                    <Typography style={{ color: "red" }}>
                        {" "}
                        Please Enter valid Aadhar Number{" "}
                    </Typography>
                );
            }
            if (!infoProof.personalinfoproof) {
                newErrors.personalinfoproof = (
                    <Typography style={{ color: "red" }}>
                        {" "}
                        Proof must be required{" "}
                    </Typography>
                );
            }
            setErrors(newErrors);
            if (Object.keys(newErrors).length === 0) {
                handleClickEdited();
            }
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerr();
            } else {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"something went wrong1!"}
                        </p>
                    </>
                );
                handleClickOpenerr();
            }
        }
    };
    const requiredFieldCheckReference = async () => {
        setPageName(!pageName)
        try {
            const newErrors = {};
            if (referenceTodoEdit.length === 0) {
                newErrors.referencetable = (
                    <Typography style={{ color: "red" }}>
                        {" "}
                        Name must be required{" "}
                    </Typography>
                );
            }
            if (!infoProof.referenceproof) {
                newErrors.referenceproof = (
                    <Typography style={{ color: "red" }}>
                        {" "}
                        Proof must be required{" "}
                    </Typography>
                );
            }
            setErrors(newErrors);
            if (Object.keys(newErrors).length === 0) {
                handleClickEdited();
            }
        }
        catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerr();
            } else {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"something went wrong1!"}
                        </p>
                    </>
                );
                handleClickOpenerr();
            }
        }
    }
    const requiredFieldCheckPermanent = async () => {
        setPageName(!pageName)
        try {
            const newErrors = {};
            if (allInformationEdit.pdoorno === "" || allInformationEdit.pstreet === "" || allInformationEdit.parea === "" || allInformationEdit.plandmark === "" || allInformationEdit.ptaluk === "" || allInformationEdit.ppost === "" || allInformationEdit.ppincode === "") {
                newErrors.paddressall = (
                    <Typography style={{ color: "red", marginTop: "20px", marginLeft: "20px" }}>
                        {" "}
                        Please Fill All Field{" "}
                    </Typography>
                );
            }
            if (!infoProof.paddressproof) {
                newErrors.paddressproof = (
                    <Typography style={{ color: "red" }}>
                        {" "}
                        Proof must be required{" "}
                    </Typography>
                );
            }
            setErrors(newErrors);
            if (Object.keys(newErrors).length === 0) {
                handleClickEdited();
            }
        }
        catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerr();
            } else {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"something went wrong1!"}
                        </p>
                    </>
                );
                handleClickOpenerr();
            }
        }
    }
    const requiredFieldCheckCurrent = async () => {
        setPageName(!pageName)
        try {
            const newErrors = {};
            if (allInformationEdit.cdoorno === "" || allInformationEdit.cstreet === "" || allInformationEdit.carea === "" || allInformationEdit.clandmark === "" || allInformationEdit.ctaluk === "" || allInformationEdit.cpost === "" || allInformationEdit.cpincode === "") {
                newErrors.caddressall = (
                    <Typography style={{ color: "red", marginTop: "50px", marginLeft: "50px" }}>
                        {" "}
                        Please Fill All Field{" "}
                    </Typography>
                );
            }
            if (!infoProof.caddressproof) {
                newErrors.caddressproof = (
                    <Typography style={{ color: "red" }}>
                        {" "}
                        Proof must be required{" "}
                    </Typography>
                );
            }
            setErrors(newErrors);
            if (Object.keys(newErrors).length === 0) {
                handleClickEdited();
            }
        }
        catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerr();
            } else {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"something went wrong1!"}
                        </p>
                    </>
                );
                handleClickOpenerr();
            }
        }
    }
    const requiredFieldCheckDocument = async () => {
        setPageName(!pageName)
        try {
            const newErrors = {};
            if (filesEdit?.length === 0) {
                newErrors.filesedit = (
                    <Typography style={{ color: "red" }}>
                        {" "}
                        Fill All The Fields{" "}
                    </Typography>
                );
            }
            if (!infoProof.documentproof) {
                newErrors.documentproof = (
                    <Typography style={{ color: "red" }}>
                        {" "}
                        Proof must be required{" "}
                    </Typography>
                );
            }
            setErrors(newErrors);
            if (Object.keys(newErrors).length === 0) {
                handleClickEdited();
            }
        }
        catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerr();
            } else {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"something went wrong1!"}
                        </p>
                    </>
                );
                handleClickOpenerr();
            }
        }
    }
    const requiredFieldCheckEducation = async () => {
        setPageName(!pageName)
        try {
            const newErrors = {};
            if (eduTodoEdit?.length === 0) {
                newErrors.edutodoedit = (
                    <Typography style={{ color: "red" }}>
                        {" "}
                        Fill All The Fields{" "}
                    </Typography>
                );
            }
            if (!infoProof.eduqualiproof) {
                newErrors.eduqualiproof = (
                    <Typography style={{ color: "red" }}>
                        {" "}
                        Proof must be required{" "}
                    </Typography>
                );
            }
            setErrors(newErrors);
            if (Object.keys(newErrors).length === 0) {
                handleClickEdited();
            }
        }
        catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerr();
            } else {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"something went wrong1!"}
                        </p>
                    </>
                );
                handleClickOpenerr();
            }
        }
    }
    const requiredFieldCheckAdditioanl = async () => {
        setPageName(!pageName)
        try {
            const newErrors = {};
            if (addAddQuaTodoEdit?.length === 0) {
                newErrors.addtodoedit = (
                    <Typography style={{ color: "red" }}>
                        {" "}
                        Fill All The Fields{" "}
                    </Typography>
                );
            }
            if (!infoProof.addqualiproof) {
                newErrors.addqualiproof = (
                    <Typography style={{ color: "red" }}>
                        {" "}
                        Proof must be required{" "}
                    </Typography>
                );
            }
            setErrors(newErrors);
            if (Object.keys(newErrors).length === 0) {
                handleClickEdited();
            }
        }
        catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerr();
            } else {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"something went wrong1!"}
                        </p>
                    </>
                );
                handleClickOpenerr();
            }
        }
    }
    const requiredFieldCheckWork = async () => {
        setPageName(!pageName)
        try {
            const newErrors = {};
            if (workhistTodoEdit?.length === 0) {
                newErrors.workhistedit = (
                    <Typography style={{ color: "red" }}>
                        {" "}
                        Fill All The Fields{" "}
                    </Typography>
                );
            }
            if (!infoProof.workhistproof) {
                newErrors.workhistproof = (
                    <Typography style={{ color: "red" }}>
                        {" "}
                        Proof must be required{" "}
                    </Typography>
                );
            }
            setErrors(newErrors);
            if (Object.keys(newErrors).length === 0) {
                handleClickEdited();
            }
        }
        catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerr();
            } else {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"something went wrong1!"}
                        </p>
                    </>
                );
                handleClickOpenerr();
            }
        }
    }
    const requiredFieldCheckBank = async () => {
        setPageName(!pageName)
        try {
            const newErrors = {};
            if (bankTodoEdit?.length === 0) {
                newErrors.bankedit = (
                    <Typography style={{ color: "red" }}>
                        {" "}
                        Fill All The Fields{" "}
                    </Typography>
                );
            }
            if (!infoProof.bankdetailsproof) {
                newErrors.bankdetailsproof = (
                    <Typography style={{ color: "red" }}>
                        {" "}
                        Proof must be required{" "}
                    </Typography>
                );
            }
            setErrors(newErrors);
            if (Object.keys(newErrors).length === 0) {
                handleClickEdited();
            }
        }
        catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerr();
            } else {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"something went wrong1!"}
                        </p>
                    </>
                );
                handleClickOpenerr();
            }
        }
    }
    function calculateAge(dob) {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }
        return age;
    }
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    //Datatable Info
    const { auth } = useContext(AuthContext);
    const [isAddOpenalertPersonal, setAddOpenalertPersonal] = useState(false);
    const [isAddOpenalertReference, setAddOpenalertReference] = useState(false);
    const [isAddOpenalertPermanant, setAddOpenalertPermanant] = useState(false);
    const [isAddOpenalertCurrent, setAddOpenalertCurrent] = useState(false);
    const [isAddOpenalertDocument, setAddOpenalertDocument] = useState(false);
    const [isAddOpenalertEducational, setAddOpenalertEducational] = useState(false);
    const [isAddOpenalertAdditional, setAddOpenalertAdditional] = useState(false);
    const [isAddOpenalertWork, setAddOpenalertWork] = useState(false);
    const [isAddOpenalertBank, setAddOpenalertBank] = useState(false);
    const [isemployeedetail, setemployeedetail] = useState(false);
    let username = isUserRoleAccess.username;
    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };
    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "MyVerification.png");
                });
            });
        }
    };
    const [fileFormat, setFormat] = useState("");

    let exportColumnNames = ["Company", "Branch", "Unit", "Team", "EmployeeName", "Information"];
    let exportRowValues = ["company", "branch", "unit", "team", "employeename", "information"];

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };
    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
    const handleCloseModalert = () => {
        setIsDeleteOpenalert(false);
    };
    // Manage Columns
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const handleOpenManageColumns = (event) => {
        setAnchorEl(event.currentTarget);
        setManageColumnsOpen(true);
    };
    const handleCloseManageColumns = () => {
        setManageColumnsOpen(false);
        setSearchQueryManage("");
    };
    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };
    const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
        "& .MuiDataGrid-virtualScroller": {
            overflowY: "hidden",
        },
        "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: " bold !important ",
        },
        "& .custom-id-row": {
            backgroundColor: "#1976d22b !important",
        },
        "& .MuiDataGrid-row.Mui-selected": {
            "& .custom-ago-row, & .custom-in-row, & .custom-others-row": {
                backgroundColor: "unset !important", // Clear the background color for selected rows
            },
        },
        "&:hover": {
            "& .custom-ago-row:hover": {
                backgroundColor: "#ff00004a !important",
            },
            "& .custom-in-row:hover": {
                backgroundColor: "#ffff0061 !important",
            },
            "& .custom-others-row:hover": {
                backgroundColor: "#0080005e !important",
            },
        },
    }));
    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        employeename: true,
        filename: true,
        information: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
    const { v4: uuidv4 } = require('uuid');


    const getCode = async (e) => {
        const accessbranch = isAssignBranch
            ? isAssignBranch.map((data) => ({
                branch: data.branch,
                company: data.company,
                unit: data.unit,
            }))
            : [];
        setPageName(!pageName)
        try {
            let res_TemplateList = await axios.post(`${SERVICE.MYVERIFICATIONASSIGNEDBRANCH}`, {
                assignbranch: accessbranch
            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            })
            let res_Users = await axios.post(`${SERVICE.USERASSIGNBRANCH}`, {
                assignbranch: accessbranch
            }, {
                headers: {
                    Authorization: `Bearer ${auth.APITolen}`,
                }
            })
            let users = res_Users?.data?.users;
            let templateList = res_TemplateList?.data?.templateList;
            let filterArray = [];
            templateList?.forEach(templateUser => {
                templateUser?.employeename?.forEach(empName => {
                    users?.forEach(user => {
                        if (user.companyname === empName) {
                            let extendedUser = {
                                id: user?._id,
                                templateId: templateUser?._id,
                                verified: templateUser?.verifiedInfo,
                                corrected: templateUser?.correctedInfo,
                                company: user?.company,
                                branch: user?.branch,
                                unit: user?.unit,
                                team: user?.team,
                                employeename: user?.companyname,
                                filename: templateUser?.filename,
                                information: templateUser?.informationstring,
                                verifyInfo: templateUser?.verifiedInfo
                            };
                            filterArray.push(extendedUser);
                        }
                    });
                });
            });
            const generateNewIds = async (array) => {
                return array.map(item => {
                    return {
                        ...item,
                        commonid: uuidv4() // Generate a new UUID for each object
                    };
                });
            };
            let needToVerify = filterArray.filter(data =>
                isUserRoleAccess.companyname === data.employeename
            )
            const transformArray = (array) => {
                let result = [];
                array?.forEach((obj) => {
                    obj.verifyInfo?.forEach((info) => {
                        if (!info.edited && !info.corrected) {
                            // Create a new object for each information value
                            const newObject = {
                                ...obj,
                                information: info.name // Assign a single value from the information array
                            };
                            result.push(newObject);
                        }
                    })
                });
                return result;
            };
            // Transform the array
            const transformedArray = transformArray(needToVerify);
            const arrayWithNewIds = await generateNewIds(transformedArray);
            setemployeedetail(true);
            let valid = arrayWithNewIds.filter(item => {
                return (item.information !== "Boarding Information" && item.information !== "Process Allot" && item.information !== "Login Details");
            })
            const removeDuplicateNames = (array) => {
                const names = array.map(item => item.information); // Extract names
                const uniqueNames = [...new Set(names)]; // Filter unique names

                return array.filter((item, index) => {
                    return uniqueNames.includes(item.information) && uniqueNames.splice(uniqueNames.indexOf(item.information), 1);
                });
            };

            // Use the function
            const uniqueData = removeDuplicateNames(valid);
            setEmployees(uniqueData);
        } catch (err) {
            setemployeedetail(true);
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerr();
            } else {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!14"}</p>
                    </>
                );
                handleClickOpenerr();
            }
        }
    };
    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => { setIsErrorOpen(true); };
    const handleCloseerr = () => { setIsErrorOpen(false); };
    // Verify Popup model For View
    const [isPersonalInfoOpen, setIsPersonalInfoOpen] = useState("");
    const [isReferenceOpen, setIsReferenceOpen] = useState("");
    const [isPermanantAddressOpen, setIsPermanantAddressOpen] = useState("");
    const [isCurrentAddressOpen, setIsCurrentAddressOpen] = useState("");
    const [isDocumentListOpen, setIsDocumentListOpen] = useState("");
    const [isEducationalQualifyOpen, setIsEducationalQualifyOpen] = useState("");
    const [isAdditionalQualifyOpen, setIsAdditionalQualifyOpen] = useState("");
    const [isWorkHistoryOpen, setIsWorkHistoryOpen] = useState("");
    const [isBankDetailsOpen, setIsBankDetailsOpen] = useState("");

    const handleClickOpenVerify = async (params, ver) => {
        setVerifyAll(ver)
        setLoading(true)
        setLoadingMessage("Please wait...")
        setPageName(!pageName)
        try {
            let response = await axios.get(`${SERVICE.USER_SINGLE}/${isUserRoleAccess?._id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let responsenew = await axios.post(`${SERVICE.EMPLOYEEDOCUMENT_SINGLEWITHALLBYCOMMONIDONE}`, {
                commonid: isUserRoleAccess?._id,
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            await fetchCandidatedocumentdropdowns(response?.data?.suser?.designation)
            setDocumentID(responsenew.data.semployeedocument?.length === 0 ? response?.data?.suser?._id : responsenew?.data?.semployeedocument?._id);
            let profileImg = responsenew.data.semployeedocument?.length === 0 ? response?.data?.suser?.profileimage : responsenew?.data?.semployeedocument?.profileimage;
            setProfileImg(profileImg)
            // const savedEmployee = {
            //     ...response?.data?.suser,
            //     responsenew.data.semployeedocument?.length > 0 && ...responsenew?.data?.semployeedocument,
            // };
            const savedEmployee = {
                ...response?.data?.suser,
                ...(responsenew?.data?.semployeedocument?.length > 0 && { ...responsenew?.data?.semployeedocument[0] })
            };

            // Find the corresponding Country, State, and City objects
            const country = Country.getAllCountries().find((country) => country.name === savedEmployee.ccountry);
            const state = State.getStatesOfCountry(country?.isoCode).find((state) => state.name === savedEmployee.cstate);
            const city = City.getCitiesOfState(
                state?.countryCode,
                state?.isoCode
            ).find((city) => city.name === savedEmployee.ccity);
            // Find the corresponding Country, State, and City objects
            const countryp = Country.getAllCountries().find((country) => country.name === savedEmployee.pcountry);
            const statep = State.getStatesOfCountry(country?.isoCode).find((state) => state.name === savedEmployee.pstate);
            const cityp = City.getCitiesOfState(
                state?.countryCode,
                state?.isoCode
            ).find((city) => city.name === savedEmployee.pcity);
            setIsValidEmail(validateEmail(response?.data?.suser?.email));
            setAllInformation({
                ...response?.data?.suser,
                panstatus: savedEmployee?.panno
                    ? "Have PAN"
                    : savedEmployee?.panrefno
                        ? "Applied"
                        : "Yet to Apply",
                age: calculateAge(savedEmployee?.dob),
            })
            setAllInformationEdit({
                ...response?.data?.suser,
                panstatus: savedEmployee?.panno
                    ? "Have PAN"
                    : savedEmployee?.panrefno
                        ? "Applied"
                        : "Yet to Apply",
                age: calculateAge(savedEmployee?.dob),
            })
            // setAge(response?.data?.suser?.age)
            if (params === "Personal Information") {
                setIsPersonalInfoOpen(true)
            }
            else if (params === "Reference Details") {
                setIsReferenceOpen(true)
            }
            else if (params === "Permanent Address") {
                setIsPermanantAddressOpen(true)
            }
            else if (params === "Current Address") {
                setIsCurrentAddressOpen(true)
            }
            else if (params === "Document List") {
                setIsDocumentListOpen(true)
            }
            else if (params === "Educational qualification") {
                setIsEducationalQualifyOpen(true)
            }
            else if (params === "Additional qualification") {
                setIsAdditionalQualifyOpen(true)
            }
            else if (params === "Work History") {
                setIsWorkHistoryOpen(true)
            }
            else if (params === "Bank Details") {
                setIsBankDetailsOpen(true)
            }
            setBankTodo(response?.data?.suser?.bankdetails);
            setBankTodoEdit(response?.data?.suser?.bankdetails);
            setoverallgrosstotal(response?.data?.suser.grosssalary);
            setModeexperience(response?.data?.suser.modeexperience);
            setTargetexperience(response?.data?.suser.targetexperience);
            setPrimaryWorkStationInput(response?.data?.suser?.workstationinput);
            setLoginNotAllot(response?.data?.suser);
            setSelectedCityc(city);
            setSelectedCountryc(country);
            setSelectedStatec(state);
            setSelectedCityp(cityp);
            setSelectedCompany(response?.data?.suser?.company);
            setSelectedBranch(response?.data?.suser?.branch);
            setSelectedUnit(response?.data?.suser?.unit);
            setTodo(response?.data?.suser?.boardingLog[0]?.todo);
            setEmployeecodenew(savedEmployee.wordcheck === true ? savedEmployee.empcode : "");
            setBankTodo(
                response?.data?.suser?.bankdetails?.length > 0
                    ? response?.data?.suser?.bankdetails?.map((data) => ({
                        ...data,
                        accountstatus: data?.accountstatus ?? "In-Active",
                    }))
                    : []
            );
            setBankTodoEdit(
                response?.data?.suser?.bankdetails?.length > 0
                    ? response?.data?.suser?.bankdetails?.map((data) => ({
                        ...data,
                        accountstatus: data?.accountstatus ?? "In-Active",
                    }))
                    : []
            );
            setRoles(response?.data?.suser?.role);
            setFiles(responsenew?.data?.semployeedocument?.files);
            setFilesEdit(responsenew?.data?.semployeedocument?.files);
            setSelectedCountryp(countryp);
            setSelectedStatep(statep);
            setTargetpts(response?.data?.suser.targetpts);
            setSelectedDesignation(response?.data?.suser?.designation);
            setSelectedTeam(response?.data?.suser?.team);
            setEduTodo(response?.data?.suser?.eduTodo);
            setEduTodoEdit(response?.data?.suser?.eduTodo);
            setEnableLoginName(response?.data?.suser?.usernameautogenerate);
            setPrimaryWorkStation(response?.data?.suser?.workstation[0]);
            setAddQuaTodo(response?.data?.suser?.addAddQuaTodo);
            setAddQuaTodoEdit(response?.data?.suser?.addAddQuaTodo);
            setReferenceTodo(response?.data?.suser?.referencetodo)
            setReferenceTodoEdit(response?.data?.suser?.referencetodo)
            setWorkhistTodo(response?.data?.suser?.workhistTodo);
            setWorkhistTodoEdit(response?.data?.suser?.workhistTodo);
            setValueCate(response?.data?.suser?.weekoff);
            setFirst(
                response?.data?.suser?.firstname?.toLowerCase().split(" ").join("")
            );
            setSecond(
                response?.data?.suser?.lastname?.toLowerCase().split(" ").join("")
            );
            setSelectedOptionsWorkStation(
                Array.isArray(response?.data?.suser?.workstation)
                    ? response?.data?.suser?.workstation.slice(1).map((x) => ({
                        ...x,
                        label: x,
                        value: x,
                    }))
                    : []
            );
            setSelectedOptionsWorkStation(
                Array.isArray(response?.data?.suser?.workstation)
                    ? response?.data?.suser?.workstation
                        .slice(1, response?.data?.suser?.workstation?.length)
                        ?.map((x) => ({
                            ...x,
                            label: x,
                            value: x,
                        }))
                    : []
            );
            setLoading(false)
        }
        catch (err) {
            setLoading(false)
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerr();
            } else {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"something went wrong!"}
                        </p>
                    </>
                );
                handleClickOpenerr();
            }
        }
    };
    const handleCloseVerify = () => {
        setIsPersonalInfoOpen(false)
        setIsReferenceOpen(false)
        setIsPermanantAddressOpen(false)
        setIsCurrentAddressOpen(false)
        setIsDocumentListOpen(false)
        setIsEducationalQualifyOpen(false)
        setIsAdditionalQualifyOpen(false)
        setIsWorkHistoryOpen(false)
        setIsBankDetailsOpen(false)
    };
    // Verify Popup model For Edit
    const [isPersonalInfoOpenEdit, setIsPersonalInfoOpenEdit] = useState("");
    const [isReferenceOpenEdit, setIsReferenceOpenEdit] = useState("");
    const [isPermanantAddressOpenEdit, setIsPermanantAddressOpenEdit] = useState("");
    const [isCurrentAddressOpenEdit, setIsCurrentAddressOpenEdit] = useState("");
    const [isDocumentListOpenEdit, setIsDocumentListOpenEdit] = useState("");
    const [isEducationalQualifyOpenEdit, setIsEducationalQualifyOpenEdit] = useState("");
    const [isAdditionalQualifyOpenEdit, setIsAdditionalQualifyOpenEdit] = useState("");
    const [isWorkHistoryOpenEdit, setIsWorkHistoryOpenEdit] = useState("");
    const [isBankDetailsOpenEdit, setIsBankDetailsOpenEdit] = useState("");
    const [infoProof, setInfoProof] = useState({
        personalinfoproof: "",
        processallotproof: "",
        explogproof: "",
        bankdetailsproof: "",
        eduqualiproof: "",
        addqualiproof: "",
        workhistproof: "",
        documentproof: "",
        caddressproof: "",
        paddressproof: "",
        boardingproof: "",
        referenceproof: "",
        loginproof: "",
    })
    const handleClickCorrected = async (e) => {
        setLoading(true)
        setLoadingMessage("Updating...")
        e.preventDefault();
        setPageName(!pageName)
        try {
            let updateObj = allInfo?.map(item => ({
                name: item,
                edited: false,
                corrected: false
            }))

            let editedVerify = verifyAll.verified?.map(item =>
                item.name === verifyAll.information ? { ...item, corrected: true } : item
            )
            var editedVerifyMyVerify = verifyAll.verified?.map(item =>
                item.name === verifyAll.information ? { ...item, corrected: true } : item
            )?.filter((item) => item.name === verifyAll.information);

            await axios.put(`${SERVICE.MYVERIFICATION_SINGLE}/${verifyAll?.templateId}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                verifiedInfo: editedVerify,
            })
            let datas = await axios.get(SERVICE.MYFIELDVERIFICATION);
            let isAvailed = datas?.data?.myverification?.find((item) => item?.employeeid == isUserRoleAccess?._id);

            if (isAvailed) {
                await axios.put(`${SERVICE.MYFIELDVERIFICATION_SINGLE}/${isAvailed?._id}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    // updatestatus: isAvailedStatus?.length > 0 ? isAvailedStatus : updateObj,
                    ...(isPersonalInfoOpen && {
                        firstname: String(allInformation?.firstname),
                        prefix: String(allInformation?.prefix),
                        lastname: String(allInformation?.lastname),
                        legalname: String(allInformation?.legalname),
                        callingname: String(allInformation?.callingname),
                        fathername: String(allInformation?.fathername),
                        mothername: String(allInformation?.mothername),
                        gender: String(allInformation?.gender),
                        maritalstatus: String(allInformation?.maritalstatus),
                        dom: String(allInformation?.dom),
                        dob: String(allInformation?.dob),
                        location: String(allInformation?.location),
                        bloodgroup: String(allInformation?.bloodgroup),
                        email: String(allInformation?.email),
                        contactpersonal: String(allInformation?.contactpersonal),
                        contactfamily: String(allInformation?.contactfamily),
                        emergencyno: String(allInformation?.emergencyno),
                        panno: String(allInformation?.panstatus === "Have PAN" ? allInformation?.panno : ""),
                        aadhar: String(allInformation?.aadhar),
                        panstatus: String(allInformation?.panstatus),
                        panrefno: String(allInformation?.panstatus === "Applied" ? allInformation?.panrefno : ""),
                        userprofile: String(final),
                        // personalinfoproof: String(infoProof.personalinfoproof),
                    }),

                    //////reff
                    ...(isReferenceOpen && {
                        referencetodo: referenceTodo.length === 0 ? [] : [...referenceTodo],
                        // referenceproof: String(infoProof.referenceproof),
                    }),

                    ///permanentadd
                    ...(isPermanantAddressOpen && {

                        pdoorno: String(allInformation?.pdoorno),
                        pstreet: String(allInformation?.pstreet),
                        parea: String(allInformation?.parea),
                        plandmark: String(allInformation?.plandmark),
                        ptaluk: String(allInformation?.ptaluk),
                        ppost: String(allInformation?.ppost),
                        ppincode: String(allInformation?.ppincode),
                        pcountry: String(allInformation?.pcountry),
                        pstate: String(allInformation?.pstate),
                        pcity: String(allInformation?.pcity),
                        // paddressproof: String(infoProof.paddressproof),
                    }),

                    ///currentadd
                    ...(isCurrentAddressOpen && {

                        cdoorno: String(
                            allInformation?.cdoorno
                        ),
                        cstreet: String(
                            allInformation?.cstreet
                        ),
                        carea: String(allInformation?.carea),
                        clandmark: String(
                            allInformation?.clandmark
                        ),
                        ctaluk: String(
                            allInformation?.ctaluk
                        ),
                        cpost: String(allInformation?.cpost),
                        cpincode: String(
                            allInformation?.cpincode
                        ),
                        ccountry: String(
                            allInformation?.ccountry
                        ),
                        cstate: String(
                            allInformation?.cstate
                        ),
                        ccity: String(
                            allInformation?.ccity
                        ),
                        // caddressproof: String(infoProof.caddressproof),
                    }),

                    ///document
                    ...(isDocumentListOpen && {
                        files: files ?? [],
                        // documentproof: String(infoProof.documentproof),
                    }),

                    //educationqu
                    ...(isEducationalQualifyOpen && {
                        eduTodo: [...eduTodo],
                        // eduqualiproof: String(infoProof.eduqualiproof),
                    }),

                    //addictonqua
                    ...(isAdditionalQualifyOpen && {

                        addAddQuaTodo: [...addAddQuaTodo],
                        // addqualiproof: String(infoProof.addqualiproof),
                    }),

                    //workhist
                    ...(isWorkHistoryOpen && {

                        workhistTodo: [...workhistTodo],
                        // workhistproof: String(infoProof.workhistproof),
                    }),


                    //banckdet
                    ...(isBankDetailsOpen && {

                        bankdetails: [...bankTodo],
                        // bankdetailsproof: String(infoProof.bankdetailsproof),
                    }),






                    employeename: String(isUserRoleAccess?.companyname),
                    employeeid: String(isUserRoleAccess?._id),
                    empcode: String(allInformation.wordcheck === true ? employeecodenew : allInformation.empcode),
                    verifiedInfo: [...isAvailed?.verifiedInfo, ...editedVerifyMyVerify],
                    verificationstatus: String("Corrected"),
                    username: enableLoginName ? String(third) : allInformation.username,
                    usernameautogenerate: Boolean(enableLoginName),
                    wordcheck: Boolean(allInformation.wordcheck),
                    contactno: String(allInformation.contactno),
                    details: String(allInformation.details),
                    password: String(allInformation.password),
                    date: String(new Date()),
                    updatedby: [
                        ...isUserRoleAccess.updatedby,
                        {
                            name: String(isUserRoleAccess?.username),
                            date: String(new Date()),
                        },
                    ],
                });
            } else {

                var editedVerifyMyVerify = verifyAll.verified?.map(item =>
                    item.name === verifyAll.information ? { ...item, corrected: true } : item
                )?.filter((item) => item.name === verifyAll.information);

                await axios.post(`${SERVICE.MYFIELDVERIFICATION_CREATE}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    ...(isPersonalInfoOpen && {
                        firstname: String(allInformation?.firstname),
                        prefix: String(allInformation?.prefix),
                        lastname: String(allInformation?.lastname),
                        legalname: String(allInformation?.legalname),
                        callingname: String(allInformation?.callingname),
                        fathername: String(allInformation?.fathername),
                        mothername: String(allInformation?.mothername),
                        gender: String(allInformation?.gender),
                        maritalstatus: String(allInformation?.maritalstatus),
                        dom: String(allInformation?.dom),
                        dob: String(allInformation?.dob),
                        location: String(allInformation?.location),
                        bloodgroup: String(allInformation?.bloodgroup),
                        email: String(allInformation?.email),
                        contactpersonal: String(allInformation?.contactpersonal),
                        contactfamily: String(allInformation?.contactfamily),
                        emergencyno: String(allInformation?.emergencyno),
                        panno: String(allInformation?.panstatus === "Have PAN" ? allInformation?.panno : ""),
                        aadhar: String(allInformation?.aadhar),
                        panstatus: String(allInformation?.panstatus),
                        panrefno: String(allInformation?.panstatus === "Applied" ? allInformation?.panrefno : ""),
                        userprofile: String(final),
                        // personalinfoproof: String(infoProof.personalinfoproof),
                    }),

                    //////reff
                    ...(isReferenceOpen && {
                        referencetodo: referenceTodo.length === 0 ? [] : [...referenceTodo],
                        // referenceproof: String(infoProof.referenceproof),
                    }),

                    ///permanentadd
                    ...(isPermanantAddressOpen && {

                        pdoorno: String(allInformation?.pdoorno),
                        pstreet: String(allInformation?.pstreet),
                        parea: String(allInformation?.parea),
                        plandmark: String(allInformation?.plandmark),
                        ptaluk: String(allInformation?.ptaluk),
                        ppost: String(allInformation?.ppost),
                        ppincode: String(allInformation?.ppincode),
                        pcountry: String(allInformation?.pcountry),
                        pstate: String(allInformation?.pstate),
                        pcity: String(allInformation?.pcity),
                        // paddressproof: String(infoProof.paddressproof),
                    }),

                    ///currentadd
                    ...(isCurrentAddressOpen && {

                        cdoorno: String(
                            allInformation?.cdoorno
                        ),
                        cstreet: String(
                            allInformation?.cstreet
                        ),
                        carea: String(allInformation?.carea),
                        clandmark: String(
                            allInformation?.clandmark
                        ),
                        ctaluk: String(
                            allInformation?.ctaluk
                        ),
                        cpost: String(allInformation?.cpost),
                        cpincode: String(
                            allInformation?.cpincode
                        ),
                        ccountry: String(
                            allInformation?.ccountry
                        ),
                        cstate: String(
                            allInformation?.cstate
                        ),
                        ccity: String(
                            allInformation?.ccity
                        ),
                        // caddressproof: String(infoProof.caddressproof),
                    }),

                    ///document
                    ...(isDocumentListOpen && {
                        files: files ?? [],
                        // documentproof: String(infoProof.documentproof),
                    }),

                    //educationqu
                    ...(isEducationalQualifyOpen && {
                        eduTodo: [...eduTodo],
                        // eduqualiproof: String(infoProof.eduqualiproof),
                    }),

                    //addictonqua
                    ...(isAdditionalQualifyOpen && {

                        addAddQuaTodo: [...addAddQuaTodo],
                        // addqualiproof: String(infoProof.addqualiproof),
                    }),

                    //workhist
                    ...(isWorkHistoryOpen && {

                        workhistTodo: [...workhistTodo],
                        // workhistproof: String(infoProof.workhistproof),
                    }),


                    //banckdet
                    ...(isBankDetailsOpen && {

                        bankdetails: [...bankTodo],
                        // bankdetailsproof: String(infoProof.bankdetailsproof),
                    }),






                    employeename: String(isUserRoleAccess?.companyname),
                    employeeid: String(isUserRoleAccess?._id),
                    empcode: String(allInformation.wordcheck === true ? employeecodenew : allInformation.empcode),
                    verifiedInfo: [...editedVerifyMyVerify],
                    updatestatus: [...editedVerifyMyVerify],

                    verificationstatus: String("Corrected"),
                    username: enableLoginName ? String(third) : allInformation.username,
                    usernameautogenerate: Boolean(enableLoginName),
                    // dot: String(allInformation.dot),
                    // doj: String(allInformation.doj),
                    wordcheck: Boolean(allInformation.wordcheck),
                    contactno: String(allInformation.contactno),
                    details: String(allInformation.details),
                    password: String(allInformation.password),
                    date: String(new Date()),

                    updatedby: [
                        ...isUserRoleAccess.updatedby,
                        {
                            name: String(isUserRoleAccess?.username),
                            date: String(new Date()),
                        },
                    ],
                });
            }
            await getCode();
            setCorrect(true)
            setIsPersonalInfoOpen(false)
            setIsReferenceOpen(false)
            setIsPermanantAddressOpen(false)
            setIsCurrentAddressOpen(false)
            setIsDocumentListOpen(false)
            setIsWorkHistoryOpen(false)
            setIsEducationalQualifyOpen(false)
            setIsAdditionalQualifyOpen(false)
            setIsBankDetailsOpen(false)
            setLoading(false)
        }
        catch (err) {
            setLoading(false)
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerr();
            } else {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"something went wrong!"}
                        </p>
                    </>
                );
                handleClickOpenerr();
            }
        }
    }
    //Boardingupadate updateby edit page...
    let updateby = username.updatedby;
    let addedby = username.addedby;
    // Excel
    const fileName = "MyVerification";
    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "MyVerification",
        pageStyle: "print",
    });
    //table entries ..,.
    const [items, setItems] = useState([]);
    const addSerialNumber = () => {
        const itemsWithSerialNumber = employees?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    };
    useEffect(() => {
        addSerialNumber();
    }, [employees]);
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
    };
    // Split the search query into individual terms
    const searchTerms = searchQuery.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });
    const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);
    const totalPages = Math.ceil(employees?.length / pageSize);
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
            headerName: "Checkbox", // Default header name
            headerStyle: {
                fontWeight: "bold", // Apply the font-weight style to make the header text bold
            },
            renderHeader: (params) => (
                <CheckboxHeader
                    selectAllChecked={selectAllChecked}
                    onSelectAll={() => {
                        if (rowDataTable?.length === 0) {
                            // Do not allow checking when there are no rows
                            return;
                        }
                        if (selectAllChecked) {
                            setSelectedRows([]);
                        } else {
                            const allRowIds = rowDataTable?.map((row) => row.id);
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
                        setSelectAllChecked(updatedSelectedRows?.length === filteredData?.length);
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
        { field: "company", headerName: "Company", flex: 0, width: 140, hide: !columnVisibility.company, headerClassName: "bold-header" },
        { field: "branch", headerName: "Branch", flex: 0, width: 160, hide: !columnVisibility.branch, headerClassName: "bold-header" },
        { field: "unit", headerName: "Unit", flex: 0, width: 120, hide: !columnVisibility.unit, headerClassName: "bold-header" },
        { field: "team", headerName: "Team", flex: 0, width: 120, hide: !columnVisibility.team, headerClassName: "bold-header" },
        { field: "employeename", headerName: "Employee Name", flex: 0, width: 180, hide: !columnVisibility.employeename, headerClassName: "bold-header" },
        { field: "information", headerName: "Information", flex: 0, width: 180, hide: !columnVisibility.information, headerClassName: "bold-header" },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 180,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            renderCell: (params) => (
                <Grid sx={{ display: "flex", gap: "10px" }}>
                    {isUserRoleCompare?.includes("emyverification") && (
                        <Button
                            variant="contained"
                            onClick={() => { handleClickOpenVerify(params.row.information, params.row) }}>
                            Please Verify
                        </Button>
                    )}
                </Grid>
            ),
        },
    ];
    const rowDataTable = filteredData?.map((item, index) => {
        return {
            id: index,
            templateId: item?.templateId,
            verified: item?.verified,
            corrected: item?.corrected,
            serialNumber: item?.serialNumber,
            company: item?.company,
            branch: item?.branch,
            unit: item?.unit,
            team: item?.team,
            employeename: item?.employeename,
            filename: item?.filename,
            information: item?.information,
        };
    });
    const rowsWithCheckboxes = rowDataTable?.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRows.includes(row?.id),
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
        <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
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
                    {filteredColumns?.map((column) => (
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
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );
    useEffect(() => {
        getCode();
    }, []);
    const accounttypes = [
        { value: "ALLAHABAD BANK", label: "ALLAHABAD BANK" },
        { value: "AB", label: "AB" },
        { value: "ANDHRA BANK", label: "ANDHRA BANK" },
        { value: "ADB", label: "ADB" },
        { value: "AXIS BANK", label: "AXIS BANK" },
        { value: "AXIS", label: "AXIS" },
        { value: "STATE BANK OF INDIA", label: "STATE BANK OF INDIA" },
        { value: "SBI", label: "SBI" },
        { value: "BANK OF BARODA", label: "BANK OF BARODA" },
        { value: "BOB", label: "BOB" },
        { value: "CITY UNION BANK", label: "CITY UNION BANK" },
        { value: "CUB", label: "CUB" },
        { value: "UCO BANK", label: "UCO BANK" },
        { value: "UCO", label: "UCO" },
        { value: "UNION BANK OF INDIA", label: "UNION BANK OF INDIA" },
        { value: "UBI", label: "UBI" },
        { value: "BANK OF INDIA", label: "BANK OF INDIA" },
        { value: "BOI", label: "BOI" },
        { value: "BANDHAN BANK LIMITED", label: "BANDHAN BANK LIMITED" },
        { value: "BBL", label: "BBL" },
        { value: "CANARA BANK", label: "CANARA BANK" },
        { value: "CB", label: "CB" },
        { value: "GRAMIN VIKASH BANK", label: "GRAMIN VIKASH BANK" },
        { value: "GVB", label: "GVB" },
        { value: "CORPORATION BANK", label: "CORPORATION BANK" },
        { value: "CORP", label: "CORP" },
        { value: "INDIAN BANK", label: "INDIAN BANK" },
        { value: "IB", label: "IB" },
        { value: "INDIAN OVERSEAS BANK", label: "INDIAN OVERSEAS BANK" },
        { value: "IOB", label: "IOB" },
        { value: "ORIENTAL BANK OF COMMERCE", label: "ORIENTAL BANK OF COMMERCE" },
        { value: "OBC", label: "OBC" },
        { value: "PUNJAB AND SIND BANK", label: "PUNJAB AND SIND BANK" },
        { value: "PSB", label: "PSB" },
        { value: "PUNJAB NATIONAL BANK", label: "PUNJAB NATIONAL BANK" },
        { value: "PNB", label: "PNB" },
        { value: "RESERVE BANK OF INDIA", label: "RESERVE BANK OF INDIA" },
        { value: "RBI", label: "RBI" },
        { value: "SOUTH INDIAN BANK", label: "SOUTH INDIAN BANK" },
        { value: "SIB", label: "SIB" },
        { value: "UNITED BANK OF INDIA", label: "UNITED BANK OF INDIA" },
        { value: "UBI", label: "UBI" },
        { value: "CENTRAL BANK OF INDIA", label: "CENTRAL BANK OF INDIA" },
        { value: "CBI", label: "CBI" },
        { value: "VIJAYA BANK", label: "VIJAYA BANK" },
        { value: "VB", label: "VB" },
        { value: "DENA BANK", label: "DENA BANK" },
        { value: "DEN", label: "DEN" },
        {
            value: "BHARATIYA MAHILA BANK LIMITED",
            label: "BHARATIYA MAHILA BANK LIMITED",
        },
        { value: "BMB", label: "BMB" },
        { value: "FEDERAL BANK LTD", label: "FEDERAL BANK LTD" },
        { value: "FB", label: "FB" },
        { value: "HDFC BANK LTD", label: "HDFC BANK LTD" },
        { value: "HDFC", label: "HDFC" },
        { value: "ICICI BANK LTD", label: "ICICI BANK LTD" },
        { value: "ICICI", label: "ICICI" },
        { value: "IDBI BANK LTD", label: "IDBI BANK LTD" },
        { value: "IDBI", label: "IDBI" },
        { value: "PAYTM BANK", label: "PAYTM BANK" },
        { value: "PAYTM", label: "PAYTM" },
        { value: "FINO PAYMENT BANK", label: "FINO PAYMENT BANK" },
        { value: "FINO", label: "FINO" },
        { value: "INDUSIND BANK LTD", label: "INDUSIND BANK LTD" },
        { value: "IIB", label: "IIB" },
        { value: "KARNATAKA BANK LTD", label: "KARNATAKA BANK LTD" },
        { value: "KBL", label: "KBL" },
        { value: "KOTAK MAHINDRA BANK", label: "KOTAK MAHINDRA BANK" },
        { value: "KOTAK", label: "KOTAK" },
        { value: "YES BANK LTD", label: "YES BANK LTD" },
        { value: "YES", label: "YES" },
        { value: "SYNDICATE BANK", label: "SYNDICATE BANK" },
        { value: "SYN", label: "SYN" },
        { value: "BANK OF MAHARASHTRA", label: "BANK OF MAHARASHTRA" },
        { value: "BOM", label: "BOM" },
        { value: "DCB BANK", label: "DCB BANK" },
        { value: "DCB", label: "DCB" },
        { value: "IDFC BANK", label: "IDFC BANK" },
        { value: "IDFC", label: "IDFC" },
        { value: "JAMMU AND KASHMIR BANK", label: "JAMMU AND KASHMIR BANK" },
        { value: "J&K", label: "J&K" },
        { value: "KARUR VYSYA BANK", label: "KARUR VYSYA BANK" },
        { value: "KVB", label: "KVB" },
        { value: "RBL BANK", label: "RBL BANK" },
        { value: "RBL", label: "RBL" },
        { value: "DHANLAXMI BANK", label: "DHANLAXMI BANK" },
        { value: "DLB", label: "DLB" },
        { value: "CSB BANK", label: "CSB BANK" },
        { value: "CSB", label: "CSB" },
        {
            value: "TAMILNAD MERCANTILE BANK (TMB)",
            label: "TAMILNAD MERCANTILE BANK (TMB)",
        },
        { value: "TMB", label: "TMB" },
    ];
    // Image Upload
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            // The base64 string representation of the image
            const base64String = reader.result;
            setInfoProof({ ...infoProof, personalinfoproof: base64String });
        };
        if (file) {
            reader.readAsDataURL(file);
        };
    }
    const handleImageUploadref = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            // The base64 string representation of the image
            const base64String = reader.result;
            setInfoProof({ ...infoProof, referenceproof: base64String });
        };
        if (file) {
            reader.readAsDataURL(file);
        };
    }
    const handleImageUploadpadd = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            // The base64 string representation of the image
            const base64String = reader.result;
            setInfoProof({ ...infoProof, paddressproof: base64String });
        };
        if (file) {
            reader.readAsDataURL(file);
        };
    }
    const handleImageUploadcadd = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            // The base64 string representation of the image
            const base64String = reader.result;
            setInfoProof({ ...infoProof, caddressproof: base64String });
        };
        if (file) {
            reader.readAsDataURL(file);
        };
    }
    const handleImageUploaddoc = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            // The base64 string representation of the image
            const base64String = reader.result;
            setInfoProof({ ...infoProof, documentproof: base64String });
        };
        if (file) {
            reader.readAsDataURL(file);
        };
    }
    const handleImageUploadedu = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            // The base64 string representation of the image
            const base64String = reader.result;
            setInfoProof({ ...infoProof, eduqualiproof: base64String });
        };
        if (file) {
            reader.readAsDataURL(file);
        };
    }
    const handleImageUploadadd = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            // The base64 string representation of the image
            const base64String = reader.result;
            setInfoProof({ ...infoProof, addqualiproof: base64String });
        };
        if (file) {
            reader.readAsDataURL(file);
        };
    }
    const handleImageUploadwork = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            // The base64 string representation of the image
            const base64String = reader.result;
            setInfoProof({ ...infoProof, workhistproof: base64String });
        };
        if (file) {
            reader.readAsDataURL(file);
        };
    }
    const handleImageUploadbank = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            // The base64 string representation of the image
            const base64String = reader.result;
            setInfoProof({ ...infoProof, bankdetailsproof: base64String });
        };
        if (file) {
            reader.readAsDataURL(file);
        };
    }
    const [bankDetails, setBankDetails] = useState(null);
    const [ifscModalOpen, setIfscModalOpen] = useState(false);
    const handleModalClose = () => {
        setIfscModalOpen(false);
        setBankDetails(null); // Reset bank details
    };
    const handleModalOpen = () => {
        setIfscModalOpen(true);
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const capitalizedValue = value.toUpperCase();
        const regex = /^[A-Z0-9]*$/;
        if (!regex.test(capitalizedValue)) {
            return;
        }
        if (name === "ifscCode" && capitalizedValue.length > 11) {
            setAllInformationEdit({
                ...allInformationEdit,
                [name]: capitalizedValue.slice(0, 11),
            });
        } else {
            setAllInformationEdit({
                ...allInformationEdit,
                [name]: capitalizedValue,
            });
        }
    };
    const fetchBankDetails = async () => {
        setPageName(!pageName)
        try {
            const response = await axios.get(
                `https://ifsc.razorpay.com/${allInformationEdit.ifscCode}`
            );
            if (response.status === 200) {
                setBankDetails(response.data);
            } else {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            Bank Details Not Found!
                        </p>
                    </>
                );
                handleClickOpenerr();
            }
        } catch (error) {
            const messages = error?.response?.data?.message;
            if (messages) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerr();
            } else {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"Please Enter Valid IFSC Code!"}
                        </p>
                    </>
                );
                handleClickOpenerr();
            }
        }
    };
    const typeofaccount = [
        { label: "Savings", value: "Savings" },
        { label: "Salary", value: "Salary" },
    ];
    const [bankTodo, setBankTodo] = useState([]);
    const [bankTodoEdit, setBankTodoEdit] = useState([]);
    const handleBankTodoChange = (index, field, value) => {
        const updatedBankTodo = [...bankTodoEdit];
        updatedBankTodo[index] = { ...updatedBankTodo[index], [field]: value };
        setBankTodoEdit(updatedBankTodo);
    };
    const deleteTodoEdit = (index) => {
        setBankTodoEdit(bankTodoEdit.filter((_, i) => i !== index));
    };
    const [bankUpload, setBankUpload] = useState([]);
    const handleBankDetailsUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = reader.result.split(",")[1];
                setBankUpload([
                    {
                        name: file.name,
                        preview: reader.result,
                        data: base64String,
                    },
                ]);
            };
            reader.onerror = (error) => {
                console.error("Error reading file:", error);
            };
        } else {
            console.error("No file selected");
        }
    };
    const handleBankTodoChangeProof = (e, index) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const updatedBankTodo = [...bankTodoEdit];
                const base64String = reader.result.split(",")[1];
                updatedBankTodo[index] = {
                    ...updatedBankTodo[index],
                    proof: [
                        {
                            name: file.name,
                            preview: reader.result,
                            data: base64String,
                        },
                    ],
                };
                setBankTodoEdit(updatedBankTodo);
            };
            reader.onerror = (error) => {
                console.error("Error reading file:", error);
            };
        } else {
            console.error("No file selected");
        }
    };
    const handleDeleteProof = (index) => {
        setBankTodoEdit((prevArray) => {
            const newArray = [...prevArray];
            newArray[index].proof = [];
            return newArray;
        });
    };
    const accountstatus = [
        { label: "Active", value: "Active" },
        { label: "In-Active", value: "In-Active" },
    ];
    const handleBankTodo = () => {
        let newObject = {
            bankname: allInformationEdit.bankname,
            bankbranchname: allInformationEdit.bankbranchname,
            accountholdername: allInformationEdit.accountholdername,
            accountnumber: allInformationEdit.accountnumber,
            ifsccode: allInformationEdit.ifsccode,
            accounttype: allInformationEdit.accounttype,
            accountstatus: allInformationEdit.accountstatus,
            proof: bankUpload,
        };
        const isValidObject = (obj) => {
            for (let key in obj) {
                if (
                    obj[key] === "" ||
                    obj[key] === undefined ||
                    obj[key] === null ||
                    obj[key] === "Please Select Account Type"
                ) {
                    return false;
                }
            }
            return true;
        };
        const exists = bankTodoEdit.some(
            (obj) => obj.accountnumber === newObject.accountnumber
        );
        const activeexists = bankTodoEdit.some((obj) => obj.accountstatus === "Active");
        if (!isValidObject(newObject)) {
            setShowAlert(
                <>
                    {" "}
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />{" "}
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        Please fill all the Fields!
                    </p>{" "}
                </>
            );
            handleClickOpenerr();
        } else if (exists) {
            setShowAlert(
                <>
                    {" "}
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />{" "}
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        Account Number Already Exist!
                    </p>{" "}
                </>
            );
            handleClickOpenerr();
        } else if (allInformationEdit.accountstatus === "Active" && activeexists) {
            setShowAlert(
                <>
                    {" "}
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />{" "}
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        Only one active account is allowed at a time.
                    </p>{" "}
                </>
            );
            handleClickOpenerr();
        } else {
            setBankTodoEdit((prevState) => [...prevState, newObject]);
            setAllInformationEdit((prev) => ({
                ...prev,
                bankname: "ICICI BANK - ICICI",
                bankbranchname: "",
                accountholdername: "",
                accountnumber: "",
                ifsccode: "",
                accounttype: "Please Select Account Type",
                accountstatus: "In-Active",
            }));
            setBankUpload([]);
        }
    };
    return (
        <Box>
            <Headtitle title={"My Verification"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="My Verification"
                modulename="Settings"
                submodulename="My Verification"
                mainpagename=""
                subpagename=""
                subsubpagename=""
            />
            <br />
            {isUserRoleCompare?.includes("lmyverification") && (
                <>
                    <Box sx={userStyle.container}>
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>MY Verification List</Typography>
                        </Grid>
                        <br />
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
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelmyverification") && (
                                        <>
                                            <Button
                                                onClick={(e) => {
                                                    setIsFilterOpen(true);
                                                    setFormat("xl");
                                                }}
                                                sx={userStyle.buttongrp}
                                            >
                                                <FaFileExcel />
                                                &ensp;Export to Excel&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvmyverification") && (
                                        <>
                                            <Button
                                                onClick={(e) => {
                                                    setIsFilterOpen(true);
                                                    setFormat("csv");
                                                }}
                                                sx={userStyle.buttongrp}
                                            >
                                                <FaFileCsv />
                                                &ensp;Export to CSV&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printmyverification") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfmyverification") && (
                                        <>
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true);
                                                }}
                                            >
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagemyverification") && (
                                        <Button
                                            sx={userStyle.buttongrp}
                                            onClick={handleCaptureImage}
                                        >
                                            {" "}
                                            <ImageIcon
                                                sx={{ fontSize: "15px" }}
                                            /> &ensp;Image&ensp;{" "}
                                        </Button>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
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
                        <br />
                        <br />
                        {!isemployeedetail ? (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                </Box>
                            </>
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
                                        Showing {filteredData?.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filteredDatas?.length)} of {filteredDatas?.length} entries
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
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                {manageColumnsContent}
            </Popover>
            {/* Submit DIALOG */}
            <Dialog open={isUpdateOpen} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ padding: "37px 23px", width: "350px", textAlign: "center", alignItems: "center" }}>
                    <>
                        <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7ac767" }} />
                        <Typography variant="h6">
                            <b>Updated Successfully👍</b>
                        </Typography>
                    </>
                </DialogContent>
            </Dialog>
            <Box>
                {/* ALERT DIALOG */}
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
            </Box>
            <Box>
                <Dialog
                    onClose={handleCloseerr}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <Typography variant="h6"></Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error">
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            <Box>
                <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleCloseerr}>
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            {/* Personal Information Popup For View*/}
            <Dialog
                open={isPersonalInfoOpen}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth={true}
                maxWidth="lg"
            >
                <Box sx={userStyle.selectcontainer}>
                    <Typography sx={userStyle.SubHeaderText}>
                        Personal Information{" "}
                    </Typography>
                    <br />
                    <br />
                    <>
                        <Grid container spacing={2}>
                            <Grid item md={6} sm={12} xs={12}>
                                <Typography>First Name</Typography>
                                <Grid container sx={{ display: "flex" }}>
                                    <Grid item md={3} sm={3} xs={3}>
                                        <FormControl size="small" fullWidth>
                                            <OutlinedInput value={allInformation.prefix} readOnly={true} />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={9} sm={9} xs={9}>
                                        <FormControl size="small" fullWidth>
                                            <OutlinedInput
                                                readOnly={true}
                                                value={allInformation.firstname}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item md={6} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Last Name</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        value={allInformation.lastname}
                                        readOnly
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Legal Name</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        readOnly
                                        value={allInformation.legalname}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Calling Name</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        readOnly
                                        value={allInformation.callingname}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Father Name</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        readOnly
                                        value={allInformation.fathername}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Mother Name</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        value={allInformation.mothername}
                                        readOnly
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={9} sm={12} xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item md={4} sm={12} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Gender</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={allInformation.gender}
                                                readOnly
                                                type="text"
                                                size="small"
                                                name="dom"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} sm={12} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Marital Status</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={allInformation.maritalstatus}
                                                readOnly
                                                type="text"
                                                size="small"
                                                name="dom"
                                            />
                                        </FormControl>
                                    </Grid>
                                    {allInformation.maritalstatus === "Married" && (
                                        <Grid item md={4} sm={6} xs={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Date Of Marriage</Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    value={
                                                        allInformation.dom
                                                            ? moment(allInformation.dom)?.format("DD-MM-YYYY")
                                                            : ""
                                                    }
                                                    readOnly
                                                    type="text"
                                                    size="small"
                                                    name="dom"
                                                />
                                            </FormControl>
                                        </Grid>
                                    )}
                                    <Grid item md={4} sm={6} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Date Of Birth</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={
                                                    allInformation.dob
                                                        ? moment(allInformation.dob)?.format("DD-MM-YYYY")
                                                        : ""
                                                }
                                                readOnly
                                                type="text"
                                                size="small"
                                                name="dob"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={1.5} sm={6} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Age</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="number"
                                                value={allInformation.dob === "" ? "" : allInformation?.age}
                                                // value={age}
                                                readOnly
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} sm={6} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Blood Group</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="bloodgroup"
                                                value={allInformation.bloodgroup}
                                                readOnly
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} sm={12} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Email</Typography>
                                            <TextField
                                                id="email"
                                                type="email"
                                                placeholder="Email"
                                                value={allInformation.email}
                                                readOnly
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} sm={6} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Location</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Location"
                                                value={allInformation.location}
                                                readOnly
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} sm={6} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Contact No (personal)</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="number"
                                                sx={userStyle.input}
                                                placeholder="Contact No (personal)"
                                                value={allInformation.contactpersonal}
                                                readOnly
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} sm={6} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Contact No (Family)</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="number"
                                                sx={userStyle.input}
                                                placeholder="Contact No (Family)"
                                                value={allInformation.contactfamily}
                                                readOnly
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} sm={6} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Emergency No</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="number"
                                                sx={userStyle.input}
                                                placeholder="Emergency No (Emergency)"
                                                value={allInformation.emergencyno}
                                                readOnly
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} sm={6} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Aadhar No</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="Number"
                                                sx={userStyle.input}
                                                placeholder="Aadhar No"
                                                value={allInformation.aadhar}
                                                readOnly
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} sm={6} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>PAN Card Status</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                // type="Number"
                                                sx={userStyle.input}
                                                placeholder="PAN Status"
                                                value={allInformation.panstatus}
                                                readOnly
                                            />
                                        </FormControl>
                                    </Grid>
                                    {allInformation?.panno?.length > 0 && (
                                        <Grid item md={4} sm={6} xs={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Pan No</Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    placeholder="Pan No"
                                                    value={allInformation.panno}
                                                    readOnly
                                                />
                                            </FormControl>
                                        </Grid>
                                    )}
                                    {allInformation?.panrefno?.length > 0 && (
                                        <Grid item md={4} sm={6} xs={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Application Ref No</Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    placeholder="Pan No"
                                                    value={allInformation.panrefno}
                                                    readOnly
                                                />
                                            </FormControl>
                                        </Grid>
                                    )}
                                </Grid>
                            </Grid>
                            <Grid item lg={3} md={3} sm={12} xs={12}>
                                <InputLabel sx={{ m: 1 }}>Profile Image</InputLabel>
                                <>
                                    <img style={{ height: 120 }} src={profileImg} alt="" />
                                </>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex" }}>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleCloseVerify}
                                        type="button"
                                        sx={{
                                            height: "30px",
                                            minWidth: "30px",
                                            marginTop: "28px",
                                            padding: "6px 10px",
                                        }}
                                    >
                                        Back
                                    </Button>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} sx={{ display: "flex" }}>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", gap: '50px' }}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        type="button"
                                        sx={{
                                            height: "30px",
                                            minWidth: "30px",
                                            marginTop: "28px",
                                            padding: "6px 10px",
                                        }}
                                        onClick={(e) => {
                                            handleClickCorrected(e)
                                        }}
                                    >
                                        Correct
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => setAddOpenalertPersonal(true)}
                                        type="button"
                                        sx={{
                                            height: "30px",
                                            minWidth: "30px",
                                            marginTop: "28px",
                                            padding: "6px 10px",
                                        }}
                                    >
                                        InCorrect
                                    </Button>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </>
                    <br />
                </Box>
            </Dialog>
            {/* Reference Detail Popup For View*/}
            <Dialog
                open={isReferenceOpen}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="lg"
            >
                <Box
                    sx={userStyle.selectcontainer}
                >
                    <Grid item xs={8}>
                        <Typography sx={userStyle.SubHeaderText}>
                            Reference Details{" "}
                        </Typography>
                        <br />
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item md={12} sm={12} xs={12}>
                            {" "}
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <TableContainer component={Paper}>
                                <Table
                                    sx={{ minWidth: 700 }}
                                    aria-label="customized table"
                                    id="usertable"
                                >
                                    <TableHead sx={{ fontWeight: "600" }}>
                                        <StyledTableRow>
                                            <StyledTableCell>SNo</StyledTableCell>
                                            <StyledTableCell>Name</StyledTableCell>
                                            <StyledTableCell>Relationship</StyledTableCell>
                                            <StyledTableCell>Occupation</StyledTableCell>
                                            <StyledTableCell>Contact</StyledTableCell>
                                            <StyledTableCell>Details</StyledTableCell>
                                        </StyledTableRow>
                                    </TableHead>
                                    <TableBody align="left">
                                        {referenceTodo?.length > 0 ? (
                                            referenceTodo?.map((row, index) => (
                                                <StyledTableRow>
                                                    <StyledTableCell>{index + 1}</StyledTableCell>
                                                    <StyledTableCell>{row?.name}</StyledTableCell>
                                                    <StyledTableCell>{row.relationship}</StyledTableCell>
                                                    <StyledTableCell>{row.occupation}</StyledTableCell>
                                                    <StyledTableCell>{row.contact}</StyledTableCell>
                                                    <StyledTableCell>{row.details}</StyledTableCell>
                                                </StyledTableRow>
                                            ))
                                        ) : (
                                            <StyledTableRow>
                                                {" "}
                                                <StyledTableCell colSpan={8} align="center">
                                                    No Data Available
                                                </StyledTableCell>{" "}
                                            </StyledTableRow>
                                        )}
                                        <StyledTableRow></StyledTableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid item md={8} xs={12} sm={12} sx={{ display: "flex" }}>
                            <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleCloseVerify}
                                    type="button"
                                    sx={{
                                        height: "30px",
                                        minWidth: "30px",
                                        marginTop: "28px",
                                        padding: "6px 10px",
                                    }}
                                >
                                    Back
                                </Button>
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={12} sx={{ display: "flex" }}>
                            <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", gap: '50px' }}>
                                <Button
                                    variant="contained"
                                    color="success"
                                    type="button"
                                    sx={{
                                        height: "30px",
                                        minWidth: "30px",
                                        marginTop: "28px",
                                        padding: "6px 10px",
                                    }}
                                    onClick={(e) => {
                                        handleClickCorrected(e)
                                    }}
                                >
                                    Correct
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => setAddOpenalertReference(true)}
                                    type="button"
                                    sx={{
                                        height: "30px",
                                        minWidth: "30px",
                                        marginTop: "28px",
                                        padding: "6px 10px",
                                    }}
                                >
                                    InCorrect
                                </Button>
                            </FormControl>
                        </Grid>
                    </Grid>{" "}
                    <br />
                </Box>
            </Dialog>
            {/* Permanent Address Popup For View*/}
            <Dialog
                open={isPermanantAddressOpen}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="lg"
            >
                <Box sx={userStyle.selectcontainer}>
                    <Typography sx={userStyle.SubHeaderText}>
                        {" "}
                        Permanent Address
                    </Typography>
                    <br />
                    <br />
                    <>
                        <Grid container spacing={2}>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Door/Flat No</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        value={allInformation.pdoorno}
                                        readOnly
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Street/Block</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        readOnly
                                        value={allInformation.pstreet}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Area/village</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        readOnly
                                        value={allInformation.parea}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Landmark</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        readOnly
                                        value={allInformation.plandmark}
                                    />
                                </FormControl>
                            </Grid>
                            <br />
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Taluk</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        readOnly
                                        value={allInformation.ptaluk}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl size="small" fullWidth>
                                    <Typography>Post</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        value={allInformation?.ppost}
                                        readOnly
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl size="small" fullWidth>
                                    <Typography>Pincode</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="number"
                                        sx={userStyle.input}
                                        readOnly
                                        value={allInformation?.ppincode}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl size="small" fullWidth>
                                    <Typography>Country</Typography>
                                    <OutlinedInput
                                        value={allInformation?.pcountry}
                                        readOnly={true}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>State</Typography>
                                    <OutlinedInput value={allInformation?.pstate} readOnly={true} />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>City</Typography>
                                    <OutlinedInput value={allInformation?.pcity} readOnly={true} />
                                </FormControl>
                            </Grid>
                            <br />
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex" }}>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleCloseVerify}
                                        type="button"
                                        sx={{
                                            height: "30px",
                                            minWidth: "30px",
                                            marginTop: "28px",
                                            padding: "6px 10px",
                                        }}
                                    >
                                        Back
                                    </Button>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} sx={{ display: "flex" }}>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", gap: '50px' }}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        // onClick={handleBankTodo}
                                        type="button"
                                        sx={{
                                            height: "30px",
                                            minWidth: "30px",
                                            marginTop: "28px",
                                            padding: "6px 10px",
                                        }}
                                        onClick={(e) => {
                                            handleClickCorrected(e)
                                        }}
                                    >
                                        Correct
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => setAddOpenalertPermanant(true)}
                                        type="button"
                                        sx={{
                                            height: "30px",
                                            minWidth: "30px",
                                            marginTop: "28px",
                                            padding: "6px 10px",
                                        }}
                                    >
                                        InCorrect
                                    </Button>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </>
                    <br />
                </Box>
            </Dialog>
            {/* Current Address Popup For View*/}
            <Dialog
                open={isCurrentAddressOpen}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="lg"
            >
                <Box sx={userStyle.dialogbox}>
                    <Typography sx={userStyle.SubHeaderText}>Current Address</Typography>
                    <br />
                    <>
                        <Grid container spacing={2}>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Door/Flat No</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        readOnly
                                        value={allInformation.cdoorno}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Street/Block</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        readOnly
                                        value={allInformation.cstreet}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Area/village</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        readOnly
                                        value={allInformation.carea}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Landmark</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        readOnly
                                        value={allInformation.clandmark}
                                    />
                                </FormControl>
                            </Grid>
                            <br />
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Taluk</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        readOnly
                                        value={allInformation.ctaluk}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl size="small" fullWidth>
                                    <Typography>Post</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        readOnly
                                        value={allInformation.cpost}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl size="small" fullWidth>
                                    <Typography>Pincode</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="number"
                                        readOnly
                                        value={allInformation.cpincode}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Country</Typography>
                                    <OutlinedInput value={allInformation?.ccountry} readOnly={true} />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>State</Typography>
                                    <OutlinedInput value={allInformation?.cstate} readOnly={true} />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>City</Typography>
                                    <OutlinedInput value={allInformation?.ccity} readOnly={true} />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container sx={{ display: "flex", justifiContent: "space-between" }}>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex" }}>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row" }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleCloseVerify}
                                        type="button"
                                        sx={{
                                            height: "30px",
                                            minWidth: "30px",
                                            marginTop: "28px",
                                            padding: "6px 10px",
                                        }}
                                    >
                                        Back
                                    </Button>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} sx={{ display: "flex" }}>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", gap: '50px' }}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        type="button"
                                        sx={{
                                            height: "30px",
                                            minWidth: "30px",
                                            marginTop: "28px",
                                            padding: "6px 10px",
                                        }}
                                        onClick={(e) => {
                                            handleClickCorrected(e)
                                        }}
                                    >
                                        Correct
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => setAddOpenalertCurrent(true)}
                                        type="button"
                                        sx={{
                                            height: "30px",
                                            minWidth: "30px",
                                            marginTop: "28px",
                                            padding: "6px 10px",
                                        }}
                                    >
                                        InCorrect
                                    </Button>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </>
                </Box>
            </Dialog>
            {/* Document List Popup For View*/}
            <Dialog
                open={isDocumentListOpen}
                // onClose={handleCloseVerify}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="lg"
            >
                <Box sx={userStyle.selectcontainer}>
                    <Typography sx={userStyle.SubHeaderText}> Document List </Typography>
                    <br />
                    <br />
                    <br />
                    {files?.length === 0 ?
                        (<Typography sx={{ fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: 'center' }}>There is no  Documents</Typography>)
                        : <TableContainer component={Paper}>
                            <Table aria-label="simple table" id="branch">
                                <TableHead sx={{ fontWeight: "600" }}>
                                    <StyledTableRow>
                                        <StyledTableCell align="center">SI.NO</StyledTableCell>
                                        <StyledTableCell align="center">Document</StyledTableCell>
                                        <StyledTableCell align="center">Remarks</StyledTableCell>
                                        <StyledTableCell align="center">View</StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                    {files &&
                                        files.map((file, index) => (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell align="center">{sno++}</StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {file.name}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <FormControl>
                                                        <OutlinedInput
                                                            sx={{
                                                                height: "30px !important",
                                                                background: "white",
                                                                border: "1px solid rgb(0 0 0 / 48%)",
                                                            }}
                                                            size="small"
                                                            type="text"
                                                            readOnly
                                                            value={file.remark}
                                                        />
                                                    </FormControl>
                                                </StyledTableCell>
                                                <StyledTableCell
                                                    component="th"
                                                    scope="row"
                                                    align="center"
                                                >
                                                    <a
                                                        style={{ color: "#357ae8" }}
                                                        href={`data:application/octet-stream;base64,${file.data}`}
                                                        download={file.name}
                                                    >
                                                        Download
                                                    </a>
                                                    <a
                                                        style={{ color: "#357ae8" }}
                                                        //   href={`data:application/octet-stream;base64,${file}`}
                                                        onClick={() => renderFilePreview(file)}
                                                    >
                                                        {/* <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", marginLeft: "105px", marginTop: "-20px", cursor: "pointer" }} onClick={() => renderFilePreview(file)} /> */}
                                                        View
                                                    </a>
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    }
                    <br /> <br />
                    {/* // <button onClick={handleDownloadAll}>download All</button> */}
                    <Grid container>
                        <Grid item md={8} xs={12} sm={12} sx={{ display: "flex" }}>
                            <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleCloseVerify}
                                    type="button"
                                    sx={{
                                        height: "30px",
                                        minWidth: "30px",
                                        marginTop: "28px",
                                        padding: "6px 10px",
                                    }}
                                >
                                    Back
                                </Button>
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={12} sx={{ display: "flex" }}>
                            <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", gap: '50px' }}>
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={(e) => {
                                        handleClickCorrected(e)
                                    }} type="button"
                                    sx={{
                                        height: "30px",
                                        minWidth: "30px",
                                        marginTop: "28px",
                                        padding: "6px 10px",
                                    }}
                                >
                                    Correct
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => setAddOpenalertDocument(true)}
                                    type="button"
                                    sx={{
                                        height: "30px",
                                        minWidth: "30px",
                                        marginTop: "28px",
                                        padding: "6px 10px",
                                    }}
                                >
                                    InCorrect
                                </Button>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>
            </Dialog>
            {/* Educational Qualification Popup For View*/}
            <Dialog
                open={isEducationalQualifyOpen}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="lg"
            >
                <Box sx={userStyle.selectcontainer}>
                    <br /> <br />
                    <Typography sx={userStyle.SubHeaderText}>
                        {" "}
                        Educational Details{" "}
                    </Typography>
                    <br />
                    <br />
                    <br />
                    {/* ****** Table start ****** */}
                    {eduTodo?.length === 0 ?
                        (
                            <Typography sx={{ fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: 'center' }}>There is no Educational Details</Typography>) :
                        <TableContainer component={Paper}>
                            <Table aria-label="simple table" id="branch">
                                <TableHead sx={{ fontWeight: "600" }}>
                                    <StyledTableRow>
                                        <StyledTableCell align="center">SI.NO</StyledTableCell>
                                        <StyledTableCell align="center">Category</StyledTableCell>
                                        <StyledTableCell align="center">Sub Category</StyledTableCell>
                                        <StyledTableCell align="center">
                                            Specialization
                                        </StyledTableCell>
                                        <StyledTableCell align="center">Institution</StyledTableCell>
                                        <StyledTableCell align="center">Passed Year</StyledTableCell>
                                        <StyledTableCell align="center">% or cgpa</StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                    {eduTodo &&
                                        eduTodo.map((todo, index) => (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell align="center">
                                                    {eduno++}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {todo.categoryedu}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {todo.subcategoryedu}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {todo.specialization}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {todo.institution}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {todo.passedyear}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {todo.cgpa}
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                    {/* } */}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    }
                    <Grid container>
                        <Grid item md={8} xs={12} sm={12} sx={{ display: "flex" }}>
                            <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleCloseVerify}
                                    type="button"
                                    sx={{
                                        height: "30px",
                                        minWidth: "30px",
                                        marginTop: "28px",
                                        padding: "6px 10px",
                                    }}
                                >
                                    Back
                                </Button>
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={12} sx={{ display: "flex" }}>
                            <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", gap: '50px' }}>
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={(e) => {
                                        handleClickCorrected(e)
                                    }} type="button"
                                    sx={{
                                        height: "30px",
                                        minWidth: "30px",
                                        marginTop: "28px",
                                        padding: "6px 10px",
                                    }}
                                >
                                    Correct
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => setAddOpenalertEducational(true)}
                                    type="button"
                                    sx={{
                                        height: "30px",
                                        minWidth: "30px",
                                        marginTop: "28px",
                                        padding: "6px 10px",
                                    }}
                                >
                                    InCorrect
                                </Button>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>
            </Dialog>
            {/* Additional Qualification Popup For View*/}
            <Dialog
                open={isAdditionalQualifyOpen}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="lg"
            >
                <Box sx={userStyle.selectcontainer}>
                    <Typography sx={userStyle.SubHeaderText}>
                        Additional Qualification{" "}
                    </Typography>
                    <br />
                    <br />
                    {/* ****** Table start ****** */}
                    {addAddQuaTodo?.length === 0 ?
                        (
                            <Typography sx={{ fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: 'center' }}>There is no Additional Qualification Details</Typography>) :
                        <TableContainer component={Paper}>
                            <Table
                                aria-label="simple table"
                                id="branch"
                            // ref={tableRef}
                            >
                                <TableHead sx={{ fontWeight: "600" }}>
                                    <StyledTableRow>
                                        <StyledTableCell align="center">SI.NO</StyledTableCell>
                                        <StyledTableCell align="center">
                                            Addl. Qualification
                                        </StyledTableCell>
                                        <StyledTableCell align="center">Institution</StyledTableCell>
                                        <StyledTableCell align="center">Duration</StyledTableCell>
                                        <StyledTableCell align="center">Remarks</StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                    {addAddQuaTodo &&
                                        addAddQuaTodo.map((addtodo, index) => (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell align="center">{skno++}</StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {addtodo.addQual}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {addtodo.addInst}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {addtodo.duration}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {addtodo.remarks}
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    }
                    <Grid container>
                        <Grid item md={8} xs={12} sm={12} sx={{ display: "flex" }}>
                            <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleCloseVerify}
                                    type="button"
                                    sx={{
                                        height: "30px",
                                        minWidth: "30px",
                                        marginTop: "28px",
                                        padding: "6px 10px",
                                    }}
                                >
                                    Back
                                </Button>
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={12} sx={{ display: "flex" }}>
                            <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", gap: '50px' }}>
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={(e) => {
                                        handleClickCorrected(e)
                                    }} type="button"
                                    sx={{
                                        height: "30px",
                                        minWidth: "30px",
                                        marginTop: "28px",
                                        padding: "6px 10px",
                                    }}
                                >
                                    Correct
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => setAddOpenalertAdditional(true)}
                                    type="button"
                                    sx={{
                                        height: "30px",
                                        minWidth: "30px",
                                        marginTop: "28px",
                                        padding: "6px 10px",
                                    }}
                                >
                                    InCorrect
                                </Button>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>
            </Dialog>
            {/* Work History Popup For View*/}
            <Dialog
                open={isWorkHistoryOpen}
                // onClose={handleCloseVerify}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="lg"
            >
                <Box sx={userStyle.selectcontainer}>
                    <Typography sx={userStyle.SubHeaderText}>
                        {" "}
                        Work History Details{" "}
                    </Typography>
                    <br />
                    <br />
                    <br />
                    {/* ****** Table start ****** */}
                    {workhistTodo?.length === 0 ?
                        (
                            <Typography sx={{ fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: 'center' }}>There is no Work History Details</Typography>) :
                        <TableContainer component={Paper}>
                            <Table
                                aria-label="simple table"
                                id="branch"
                            // ref={tableRef}
                            >
                                <TableHead sx={{ fontWeight: "600" }}>
                                    <StyledTableRow>
                                        <StyledTableCell align="center">SI.NO</StyledTableCell>
                                        <StyledTableCell align="center">
                                            Employee Name
                                        </StyledTableCell>
                                        <StyledTableCell align="center">Designation</StyledTableCell>
                                        <StyledTableCell align="center">Joined On</StyledTableCell>
                                        <StyledTableCell align="center">Leave On</StyledTableCell>
                                        <StyledTableCell align="center">Duties</StyledTableCell>
                                        <StyledTableCell align="center">
                                            Reason for Leaving
                                        </StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                    {workhistTodo &&
                                        workhistTodo.map((todo, index) => (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell align="center">{snowv++}</StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {todo.empNameTodo}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {todo.desigTodo}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {todo.joindateTodo
                                                        ? moment(todo.joindateTodo)?.format("DD-MM-YYYY")
                                                        : ""}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {todo.leavedateTodo
                                                        ? moment(todo.leavedateTodo)?.format("DD-MM-YYYY")
                                                        : ""}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {todo.dutiesTodo}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {todo.reasonTodo}
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    }
                    <Grid conatiner sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Grid item md={8} xs={12} sm={12} sx={{ display: "flex" }}>
                            <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleCloseVerify}
                                    type="button"
                                    sx={{
                                        height: "30px",
                                        minWidth: "30px",
                                        marginTop: "28px",
                                        padding: "6px 10px",
                                    }}
                                >
                                    Back
                                </Button>
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={12} sx={{ display: "flex" }}>
                            <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", gap: '50px' }}>
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={(e) => {
                                        handleClickCorrected(e)
                                    }} type="button"
                                    sx={{
                                        height: "30px",
                                        minWidth: "30px",
                                        marginTop: "28px",
                                        padding: "6px 10px",
                                    }}
                                >
                                    Correct
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => setAddOpenalertWork(true)}
                                    type="button"
                                    sx={{
                                        height: "30px",
                                        minWidth: "30px",
                                        marginTop: "28px",
                                        padding: "6px 10px",
                                    }}
                                >
                                    InCorrect
                                </Button>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>
            </Dialog>
            {/* Bank Details Popup For View*/}
            <Dialog
                open={isBankDetailsOpen}
                // onClose={handleCloseVerify}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="lg"
            >
                {/* {bankTodo?.length > 0 && ( */}
                <Box sx={userStyle.selectcontainer}>
                    <Typography sx={userStyle.SubHeaderText}>Bank Details </Typography>
                    <br />
                    <br />
                    {bankTodo?.length > 0 && (
                        bankTodo?.map((data, index) => (
                            <div key={index}>
                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        <Typography sx={{ fontWeight: "bold" }}>{`Row No : ${index + 1
                                            }`}</Typography>
                                    </Grid>
                                </Grid>
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Bank Name</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                value={data.bankname}
                                                readOnly
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Bank Branch Name</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                value={data.bankbranchname}
                                                placeholder="Please Enter Bank Branch Name"
                                                readOnly
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Account Holder Name</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                value={data.accountholdername}
                                                placeholder="Please Enter Account Holder Name"
                                                readOnly
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Account Number</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                value={data.accountnumber}
                                                placeholder="Please Enter Account Number"
                                                readOnly
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12} sx={{ display: "flex" }}>
                                        <FormControl fullWidth size="small">
                                            <Typography>IFSC Code</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                value={data.ifsccode}
                                                placeholder="Please Enter IFSC Code"
                                                readOnly
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12} sx={{ display: "flex" }}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Type of Account</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                value={data.accounttype}
                                                placeholder="Please Enter IFSC Code"
                                                readOnly
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12} sx={{ display: "flex" }}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Status</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                value={data.accountstatus}
                                                // placeholder="Please Enter IFSC Code"
                                                readOnly
                                            />
                                        </FormControl>
                                    </Grid>
                                    {data?.proof?.length > 0 && (
                                        <Grid
                                            item
                                            md={5}
                                            sm={8}
                                            xs={8}
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                // marginTop: "10%",
                                            }}
                                        >
                                            {data?.proof?.length > 0 &&
                                                data?.proof.map((file) => (
                                                    <>
                                                        <Grid container spacing={2}>
                                                            <Grid item md={8} sm={8} xs={8}>
                                                                <Typography
                                                                    style={{
                                                                        overflow: "hidden",
                                                                        textOverflow: "ellipsis",
                                                                        whiteSpace: "nowrap",
                                                                        maxWidth: "100%",
                                                                    }}
                                                                    title={file.name}
                                                                >
                                                                    {file.name}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item md={1} sm={1} xs={1}>
                                                                <VisibilityOutlinedIcon
                                                                    style={{
                                                                        fontsize: "large",
                                                                        color: "#357AE8",
                                                                        cursor: "pointer",
                                                                        marginLeft: "-7px",
                                                                    }}
                                                                    onClick={() => renderFilePreview(file)}
                                                                />
                                                            </Grid>
                                                            <br />
                                                            <br />

                                                        </Grid>
                                                    </>
                                                ))}
                                        </Grid>
                                    )}
                                </Grid>
                                <br />
                            </div>
                        )))}
                    {bankTodo?.length === 0 && (
                        <Typography sx={{ fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: 'center' }}>There is no Bank Details</Typography>)}
                    <Grid container sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Grid item md={8} xs={12} sm={12} sx={{ display: "flex" }}>
                            <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleCloseVerify}
                                    type="button"
                                    sx={{
                                        height: "30px",
                                        minWidth: "30px",
                                        marginTop: "28px",
                                        padding: "6px 10px",
                                    }}
                                >
                                    Back
                                </Button>
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={12} sx={{ display: "flex" }}>
                            <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", gap: '50px' }}>
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={(e) => {
                                        handleClickCorrected(e)
                                    }} type="button"
                                    sx={{
                                        height: "30px",
                                        minWidth: "30px",
                                        marginTop: "28px",
                                        padding: "6px 10px",
                                    }}
                                >
                                    Correct
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => setAddOpenalertBank(true)}
                                    type="button"
                                    sx={{
                                        height: "30px",
                                        minWidth: "30px",
                                        marginTop: "28px",
                                        padding: "6px 10px",
                                    }}
                                >
                                    InCorrect
                                </Button>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>
                {/* )} */}
            </Dialog>
            {/******************************************************************************************************* */}
            {/* Popups For Edit */}
            {/* Personal Information Popup For Edit*/}
            <Dialog
                open={isPersonalInfoOpenEdit}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth={true}
                maxWidth="lg"
            >
                <Box sx={userStyle.selectcontainer}>
                    <>
                        <Grid container spacing={2}>
                            <Grid item md={6} sm={12} xs={12}>
                                <Typography>
                                    First Name<b style={{ color: "red" }}>*</b>
                                </Typography>
                                <Grid container sx={{ display: "flex" }}>
                                    <Grid item md={3} sm={3} xs={3}>
                                        <FormControl size="small" fullWidth>
                                            <Select
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                placeholder="Mr."
                                                value={allInformationEdit.prefix}
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 200,
                                                            width: 80,
                                                        },
                                                    },
                                                }}
                                            // onChange={(e) => {
                                            //     setAllInformation({ ...allInformationEdit, prefix: e.target.value });
                                            // }}
                                            >
                                                <MenuItem value="Mr">Mr</MenuItem>
                                                <MenuItem value="Ms">Ms</MenuItem>
                                                <MenuItem value="Mrs">Mrs</MenuItem>
                                            </Select>
                                        </FormControl>
                                        {errors.prefix && <div>{errors.prefix}</div>}
                                    </Grid>
                                    <Grid item md={9} sm={9} xs={9}>
                                        <FormControl size="small" fullWidth>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="First Name"
                                                value={allInformationEdit.firstname}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item md={6} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Last Name<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Last Name"
                                        value={allInformationEdit.lastname}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Legal Name<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Legal Name"
                                        value={allInformationEdit.legalname}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Calling Name<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Calling Name"
                                        value={allInformationEdit.callingname}
                                        onChange={(e) => {
                                            setAllInformationEdit({
                                                ...allInformationEdit,
                                                callingname: e.target.value,
                                            });
                                        }}
                                    />
                                </FormControl>
                                {errors.callingname && <div>{errors.callingname}</div>}
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Father Name</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Father Name"
                                        value={allInformationEdit.fathername}
                                        onChange={(e) => {
                                            setAllInformationEdit({ ...allInformationEdit, fathername: e.target.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Mother Name</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Mother Name"
                                        value={allInformationEdit.mothername}
                                        onChange={(e) => {
                                            setAllInformationEdit({ ...allInformationEdit, mothername: e.target.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            {/* <Grid container spacing={2}> */}
                            <Grid item md={9} sm={12} xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item md={4} sm={12} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Gender</Typography>
                                            <Selects
                                                maxMenuHeight={300}
                                                options={[
                                                    { label: "Others", value: "Others" },
                                                    { label: "Female", value: "Female" },
                                                    { label: "Male", value: "Male" },
                                                ]}
                                                value={{
                                                    label:
                                                        allInformationEdit.gender === "" ||
                                                            allInformationEdit.gender == undefined
                                                            ? "Select Gender"
                                                            : allInformationEdit.gender,
                                                    value:
                                                        allInformationEdit.gender === "" ||
                                                            allInformationEdit.gender == undefined
                                                            ? "Select Gender"
                                                            : allInformationEdit.gender,
                                                }}
                                                onChange={(e) => {
                                                    setAllInformationEdit({ ...allInformationEdit, gender: e.value });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} sm={12} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Marital Status</Typography>
                                            <Selects
                                                maxMenuHeight={300}
                                                options={[
                                                    { label: "Single", value: "Single" },
                                                    { label: "Married", value: "Married" },
                                                    { label: "Divorced", value: "Divorced" },
                                                ]}
                                                value={{
                                                    label:
                                                        allInformationEdit.maritalstatus === "" ||
                                                            allInformationEdit.maritalstatus == undefined
                                                            ? "Select Marital Status"
                                                            : allInformationEdit.maritalstatus,
                                                    value:
                                                        allInformationEdit.maritalstatus === "" ||
                                                            allInformationEdit.maritalstatus == undefined
                                                            ? "Select Marital Status"
                                                            : allInformationEdit.maritalstatus,
                                                }}
                                                onChange={(e) => {
                                                    setAllInformationEdit({
                                                        ...allInformationEdit,
                                                        maritalstatus: e.value,
                                                        dom: "",
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    {allInformationEdit.maritalstatus === "Married" && (
                                        <Grid item md={4} sm={6} xs={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Date Of Marriage<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    value={allInformationEdit.dom}
                                                    onChange={(e) => {
                                                        setAllInformationEdit({ ...allInformationEdit, dom: e.target.value });
                                                    }}
                                                    type="date"
                                                    size="small"
                                                    name="dom"
                                                />
                                            </FormControl>
                                            {errors.dom && <div>{errors.dom}</div>}
                                        </Grid>
                                    )}
                                    <Grid item md={2.5} sm={6} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Date Of Birth<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={allInformationEdit.dob}
                                                onChange={(e) => {
                                                    let age = calculateAge(e.target.value);
                                                    setAllInformationEdit({
                                                        ...allInformationEdit,
                                                        dob: e.target.value,
                                                        age,
                                                    });
                                                }}
                                                type="date"
                                                size="small"
                                                name="dob"
                                                inputProps={{ max: maxDate }}
                                                onKeyDown={(e) => e.preventDefault()}
                                            />
                                        </FormControl>
                                        {errors.dob && <div>{errors.dob}</div>}
                                    </Grid>
                                    <Grid item md={1.5} sm={6} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Age</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="number"
                                                value={allInformationEdit.dob === "" ? "" : allInformationEdit?.age}
                                                // value={age}
                                                readOnly
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} sm={6} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Blood Group</Typography>
                                            <Selects
                                                maxMenuHeight={300}
                                                options={[
                                                    { label: "A-ve-", value: "A-ve-" },
                                                    { label: "A+ve-", value: "A+ve-" },
                                                    { label: "B+ve", value: "B+ve" },
                                                    { label: "B-ve", value: "B-ve" },
                                                    { label: "O+ve", value: "O+ve" },
                                                    { label: "O-ve", value: "O-ve" },
                                                    { label: "AB+ve", value: "AB+ve" },
                                                    { label: "AB-ve", value: "AB-ve" },
                                                    { label: "A1+ve", value: "A1+ve" },
                                                    { label: "A1-ve", value: "A1-ve" },
                                                    { label: "A2+ve", value: "A2+ve" },
                                                    { label: "A2-ve", value: "A2-ve" },
                                                    { label: "A1B+ve", value: "A1B+ve" },
                                                    { label: "A1B-ve", value: "A1B-ve" },
                                                    { label: "A2B+ve", value: "A2B+ve" },
                                                    { label: "A2B-ve", value: "A2B-ve" },
                                                ]}
                                                value={{
                                                    label:
                                                        allInformationEdit.bloodgroup === "" ||
                                                            allInformationEdit.bloodgroup == undefined
                                                            ? "Select Blood Group"
                                                            : allInformationEdit.bloodgroup,
                                                    value:
                                                        allInformationEdit.bloodgroup === "" ||
                                                            allInformationEdit.bloodgroup == undefined
                                                            ? "Select Blood Group"
                                                            : allInformationEdit.bloodgroup,
                                                }}
                                                onChange={(e) => {
                                                    setAllInformationEdit({ ...allInformationEdit, bloodgroup: e.value });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} sm={12} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Email<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <TextField
                                                id="email"
                                                type="email"
                                                placeholder="Email"
                                                value={allInformationEdit.email}
                                                onChange={(e) => {
                                                    setAllInformationEdit({ ...allInformationEdit, email: e.target.value });
                                                    setIsValidEmail(validateEmail(e.target.value));
                                                }}
                                                InputProps={{
                                                    inputProps: {
                                                        pattern: /^\S+@\S+\.\S+$/,
                                                    },
                                                }}
                                            />
                                        </FormControl>
                                        {errors.email && <div>{errors.email}</div>}
                                    </Grid>
                                    <Grid item md={4} sm={6} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Location</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Location"
                                                value={allInformationEdit.location}
                                                onChange={(e) => {
                                                    setAllInformationEdit({
                                                        ...allInformationEdit,
                                                        location: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} sm={6} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Contact No (personal)</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="number"
                                                sx={userStyle.input}
                                                placeholder="Contact No (personal)"
                                                value={allInformationEdit.contactpersonal}
                                                onChange={(e) => {
                                                    handlechangecontactpersonal(e);
                                                }}
                                            />
                                        </FormControl>
                                        {errors.contactpersonal && (
                                            <div>{errors.contactpersonal}</div>
                                        )}
                                    </Grid>
                                    <Grid item md={4} sm={6} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Contact No (Family)</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="number"
                                                sx={userStyle.input}
                                                placeholder="Contact No (Family)"
                                                value={allInformationEdit.contactfamily}
                                                onChange={(e) => {
                                                    handlechangecontactfamily(e);
                                                }}
                                            />
                                        </FormControl>
                                        {errors.contactfamily && <div>{errors.contactfamily}</div>}
                                    </Grid>
                                    <Grid item md={4} sm={6} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Emergency No<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="number"
                                                sx={userStyle.input}
                                                placeholder="Emergency No (Emergency)"
                                                value={allInformationEdit.emergencyno}
                                                onChange={(e) => {
                                                    handlechangeemergencyno(e);
                                                }}
                                            />
                                        </FormControl>
                                        {errors.emergencyno && <div>{errors.emergencyno}</div>}
                                    </Grid>
                                    <Grid item md={4} sm={6} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Aadhar No<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="Number"
                                                sx={userStyle.input}
                                                placeholder="Aadhar No"
                                                value={allInformationEdit.aadhar}
                                                onChange={(e) => {
                                                    handlechangeaadhar(e);
                                                }}
                                            />
                                        </FormControl>
                                        {errors.aadhar && <div>{errors.aadhar}</div>}
                                    </Grid>
                                    <Grid item md={4} sm={12} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                PAN Card Status<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                maxMenuHeight={300}
                                                options={[
                                                    { label: "Have PAN", value: "Have PAN" },
                                                    { label: "Applied", value: "Applied" },
                                                    { label: "Yet to Apply", value: "Yet to Apply" },
                                                ]}
                                                value={{
                                                    label:
                                                        allInformationEdit.panstatus === "" ||
                                                            allInformationEdit.panstatus == undefined
                                                            ? "Select PAN Status"
                                                            : allInformationEdit.panstatus,
                                                    value:
                                                        allInformationEdit.panstatus === "" ||
                                                            allInformationEdit.panstatus == undefined
                                                            ? "Select PAN Status"
                                                            : allInformationEdit.panstatus,
                                                }}
                                                onChange={(e) => {
                                                    setAllInformationEdit({
                                                        ...allInformationEdit,
                                                        panstatus: e.value,
                                                        panno: "",
                                                        panrefno: "",
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    {allInformationEdit?.panstatus === "Have PAN" && (
                                        <Grid item md={4} sm={6} xs={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Pan No<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    placeholder="Pan No"
                                                    value={allInformationEdit.panno}
                                                    onChange={(e) => {
                                                        if (e.target.value.length < 11) {
                                                            setAllInformationEdit({
                                                                ...allInformationEdit,
                                                                panno: e.target.value,
                                                            });
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                            {errors.panno && <div>{errors.panno}</div>}
                                        </Grid>
                                    )}
                                    {allInformationEdit?.panstatus === "Applied" && (
                                        <Grid item md={4} sm={6} xs={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Application Ref No<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    placeholder="Application Ref No"
                                                    value={allInformationEdit.panrefno}
                                                    onChange={(e) => {
                                                        if (e.target.value.length < 16) {
                                                            setAllInformationEdit({
                                                                ...allInformationEdit,
                                                                panrefno: e.target.value,
                                                            });
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                            {errors.panrefno && <div>{errors.panrefno}</div>}
                                        </Grid>
                                    )}
                                </Grid>
                            </Grid>
                            <Grid item lg={3} md={3} sm={12} xs={12}>
                                <InputLabel sx={{ m: 1 }}>Profile Image</InputLabel>
                                {croppedImage && (
                                    <>
                                        <img style={{ height: 120 }} src={croppedImage} alt="" />
                                    </>
                                )}
                                <div>
                                    {profileImg && !croppedImage ? (
                                        <>
                                            <Cropper
                                                style={{ height: 120, width: "100%" }}
                                                aspectRatio={1 / 1}
                                                src={profileImg}
                                                ref={cropperRef}
                                            />
                                            <Box
                                                sx={{ display: "flex", marginTop: "10px", gap: "10px" }}
                                            >
                                                <Box>
                                                    <Typography
                                                        sx={userStyle.uploadbtn}
                                                        onClick={handleCrop}
                                                    >
                                                        Crop Image
                                                    </Typography>
                                                </Box>
                                                <Box>
                                                    <Button
                                                        variant="outlined"
                                                        sx={userStyle.btncancel}
                                                        onClick={handleClearImage}
                                                    >
                                                        Clear
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </>
                                    ) : (
                                        <>
                                            {profileImg === "" && (
                                                <Grid container sx={{ display: "flex" }}>
                                                    <Grid item md={4} sm={4}>
                                                        <section>
                                                            {/* Input element for selecting files */}
                                                            <input
                                                                type="file"
                                                                accept="image/*" // Limit to image files if needed
                                                                id="profileimage"
                                                                onChange={handleChangeImage}
                                                                // onChange={handleImageUpload}
                                                                style={{ display: "none" }} // Hide the input element
                                                            />
                                                            <label htmlFor="profileimage">
                                                                <Typography sx={userStyle.uploadbtn}
                                                                >
                                                                    Upload
                                                                </Typography>
                                                            </label>
                                                            <br />
                                                        </section>
                                                    </Grid>
                                                </Grid>
                                            )}
                                            {profileImg && (
                                                <>
                                                    <Grid item md={4} sm={4}>
                                                        <Button
                                                            variant="outlined"
                                                            sx={userStyle.btncancel}
                                                            onClick={handleClearImage}
                                                        >
                                                            Clear
                                                        </Button>
                                                    </Grid>
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
                            </Grid>
                            <Grid item md={12} sm={12} xs={12}>
                                <Typography
                                >
                                    Proof&nbsp;<b style={{ color: "red" }}>*</b>
                                </Typography>
                                {infoProof.personalinfoproof && (
                                    <>
                                        <Grid sx={{ display: "flex", justifyContent: "flex-start" }}>
                                            <img
                                                src={infoProof.personalinfoproof}
                                                style={{ height: 120, width: 170 }}
                                                alt="PersonalInfoProof"
                                            />
                                        </Grid>
                                    </>
                                )
                                }
                                <br />
                                <Grid sx={{ display: "flex" }}>
                                    <FormControl size="small" fullWidth>
                                        <Grid sx={{ display: "flex" }}>
                                            <Button
                                                component="label"
                                                variant="contained"
                                                color="primary"
                                            >
                                                Upload
                                                <input
                                                    type="file"
                                                    id="personalproof"
                                                    accept="image/*"
                                                    name="file"
                                                    hidden
                                                    onChange={handleImageUpload}
                                                />
                                            </Button>
                                            <Button
                                                onClick={(e) => {
                                                    setFile("");
                                                    setInfoProof({ ...infoProof, personalinfoproof: "" });
                                                }}
                                                sx={userStyle.btncancel}
                                            >
                                                Clear
                                            </Button>
                                        </Grid>
                                    </FormControl>
                                </Grid>
                                {errors.personalinfoproof && <div>{errors.personalinfoproof}</div>}
                            </Grid>
                            <Grid item md={12} sm={12} xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Button
                                    variant="outlined"
                                    sx={userStyle.btncancel}
                                    onClick={() => {
                                        setIsPersonalInfoOpenEdit(false)
                                        setAddOpenalertPersonal(false)
                                    }}
                                    type="button"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={(e) => {
                                        // checkAllField();
                                        requiredFieldCheckPersonal();
                                    }}
                                    type="button"
                                    sx={{ height: "38px" }}
                                >
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </>
                </Box>
            </Dialog>
            {/* Reference Detail Popup For Edit*/}
            <Dialog
                open={isReferenceOpenEdit}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="lg"
            >
                <Box sx={userStyle.selectcontainer}>
                    <Typography sx={userStyle.SubHeaderText}>Reference Details</Typography>
                    <br />
                    <br />
                    <Grid container spacing={2}>
                        <Grid item md={2.3} sm={6} xs={12}>
                            <FormControl size="small" fullWidth>
                                <Typography>
                                    Name<b style={{ color: "red" }}>*</b>
                                </Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    placeholder="Reference Name"
                                    value={singleReferenceTodoEdit.name}
                                    onChange={(e) => {
                                        setSingleReferenceTodoEdit({
                                            ...singleReferenceTodoEdit,
                                            name: e.target.value,
                                        });
                                    }}
                                />
                            </FormControl>
                            {referenceTodoError.name && <div>{referenceTodoError.name}</div>}
                            {/* {errors.referencetable && <div>{errors.referencetable}</div>} */}
                            {referenceTodoError.duplicate && (
                                <div>{referenceTodoError.duplicate}</div>
                            )}
                        </Grid>
                        <Grid item md={2.3} sm={6} xs={12}>
                            <FormControl size="small" fullWidth>
                                <Typography>Relationship</Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    placeholder="Relationship"
                                    value={singleReferenceTodoEdit.relationship}
                                    onChange={(e) => {
                                        setSingleReferenceTodoEdit({
                                            ...singleReferenceTodoEdit,
                                            relationship: e.target.value,
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2.3} sm={6} xs={12}>
                            <FormControl size="small" fullWidth>
                                <Typography>Occupation</Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    placeholder="Occupation"
                                    value={singleReferenceTodoEdit.occupation}
                                    onChange={(e) => {
                                        setSingleReferenceTodoEdit({
                                            ...singleReferenceTodoEdit,
                                            occupation: e.target.value,
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2.3} sm={6} xs={12}>
                            <FormControl size="small" fullWidth>
                                <Typography>Contact No</Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="number"
                                    sx={userStyle.input}
                                    placeholder="Contact No"
                                    value={singleReferenceTodoEdit.contact}
                                    onChange={(e) => {
                                        handlechangereferencecontactno(e);
                                    }}
                                />
                            </FormControl>
                            {referenceTodoError.contactno && (
                                <div>{referenceTodoError.contactno}</div>
                            )}
                        </Grid>
                        <Grid item md={2.3} sm={12} xs={12}>
                            <FormControl fullWidth>
                                <Typography>Details</Typography>
                                <TextareaAutosize
                                    aria-label="minimum height"
                                    minRows={5}
                                    value={singleReferenceTodoEdit.details}
                                    onChange={(e) => {
                                        setSingleReferenceTodoEdit({
                                            ...singleReferenceTodoEdit,
                                            details: e.target.value,
                                        });
                                    }}
                                    placeholder="Reference Details"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={0.5} sm={6} xs={12}>
                            <Button
                                variant="contained"
                                color="primary"
                                style={{
                                    height: "30px",
                                    minWidth: "20px",
                                    padding: "19px 13px",
                                    marginTop: "25px",
                                }}
                                onClick={addReferenceTodoFunction}
                            >
                                <FaPlus />
                            </Button>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            {" "}
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <TableContainer component={Paper}>
                                <Table
                                    sx={{ minWidth: 700 }}
                                    aria-label="customized table"
                                    id="usertable"
                                >
                                    <TableHead sx={{ fontWeight: "600" }}>
                                        <StyledTableRow>
                                            <StyledTableCell>SNo</StyledTableCell>
                                            <StyledTableCell>Name</StyledTableCell>
                                            <StyledTableCell>Relationship</StyledTableCell>
                                            <StyledTableCell>Occupation</StyledTableCell>
                                            <StyledTableCell>Contact</StyledTableCell>
                                            <StyledTableCell>Details</StyledTableCell>
                                            <StyledTableCell></StyledTableCell>
                                        </StyledTableRow>
                                    </TableHead>
                                    <TableBody align="left">
                                        {referenceTodoEdit?.length > 0 ? (
                                            referenceTodoEdit?.map((row, index) => (
                                                <StyledTableRow>
                                                    <StyledTableCell>{index + 1}</StyledTableCell>
                                                    <StyledTableCell>{row.name}</StyledTableCell>
                                                    <StyledTableCell>{row.relationship}</StyledTableCell>
                                                    <StyledTableCell>{row.occupation}</StyledTableCell>
                                                    <StyledTableCell>{row.contact}</StyledTableCell>
                                                    <StyledTableCell>{row.details}</StyledTableCell>
                                                    <StyledTableCell>
                                                        <CloseIcon
                                                            sx={{ color: "red", cursor: "pointer" }}
                                                            onClick={() => {
                                                                deleteReferenceTodo(index);
                                                            }}
                                                        />
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            ))
                                        ) : (
                                            <StyledTableRow>
                                                {" "}
                                                <StyledTableCell colSpan={8} align="center">
                                                    No Data Available
                                                </StyledTableCell>{" "}
                                            </StyledTableRow>
                                        )}
                                        <StyledTableRow></StyledTableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            {errors.referencetable && <div>{errors.referencetable}</div>}
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <Typography
                            >
                                Proof&nbsp;<b style={{ color: "red" }}>*</b>
                            </Typography>
                            {infoProof.referenceproof && (
                                <>
                                    <Grid sx={{ display: "flex", justifyContent: "flex-start" }}>
                                        <img
                                            src={infoProof.referenceproof}
                                            style={{ height: 120, width: 170 }}
                                            alt="PersonalInfoProof"
                                        />
                                    </Grid>
                                </>
                            )
                            }
                            <br />
                            <Grid sx={{ display: "flex" }}>
                                <FormControl size="small" fullWidth>
                                    <Grid sx={{ display: "flex" }}>
                                        <Button
                                            component="label"
                                            variant="contained"
                                            color="primary"
                                        >
                                            Upload
                                            <input
                                                type="file"
                                                id="referenceproof"
                                                accept="image/*"
                                                name="file"
                                                hidden
                                                onChange={handleImageUploadref}
                                            />
                                        </Button>
                                        <Button
                                            onClick={(e) => {
                                                setFile("");
                                                setInfoProof({ ...infoProof, referenceproof: "" });
                                            }}
                                            sx={userStyle.btncancel}
                                        >
                                            Clear
                                        </Button>
                                    </Grid>
                                </FormControl>
                            </Grid>
                            {errors.referenceproof && <div>{errors.referenceproof}</div>}
                        </Grid>
                        <Grid item md={12} sm={12} xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Button
                                variant="outlined"
                                sx={userStyle.btncancel}
                                onClick={() => {
                                    setIsReferenceOpenEdit(false)
                                    setAddOpenalertReference(false)
                                }}
                                type="button"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={(e) => {
                                    requiredFieldCheckReference();
                                }}
                                type="button"
                                sx={{ height: "38px" }}
                            >
                                Submit
                            </Button>
                        </Grid>
                    </Grid>{" "}
                </Box>
            </Dialog>
            {/* Permanent Address Popup For Edit*/}
            <Dialog
                open={isPermanantAddressOpenEdit}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="lg"
            >
                <Box sx={userStyle.selectcontainer}>
                    <Typography sx={userStyle.SubHeaderText}>
                        Permanent Address{" "}
                    </Typography>
                    <br /><br />
                    <>
                        <Grid container spacing={2}>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Door/Flat No</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Door/Flat No"
                                        value={allInformationEdit.pdoorno}
                                        onChange={(e) => {
                                            setAllInformationEdit({ ...allInformationEdit, pdoorno: e.target.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Street/Block</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Street/Block"
                                        value={allInformationEdit.pstreet}
                                        onChange={(e) => {
                                            setAllInformationEdit({ ...allInformationEdit, pstreet: e.target.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Area/village</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Area/Village"
                                        value={allInformationEdit.parea}
                                        onChange={(e) => {
                                            setAllInformationEdit({ ...allInformationEdit, parea: e.target.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Landmark</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Landmark"
                                        value={allInformationEdit.plandmark}
                                        onChange={(e) => {
                                            setAllInformationEdit({ ...allInformationEdit, plandmark: e.target.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <br />
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Taluk</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Taluk"
                                        value={allInformationEdit.ptaluk}
                                        onChange={(e) => {
                                            setAllInformationEdit({ ...allInformationEdit, ptaluk: e.target.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl size="small" fullWidth>
                                    <Typography>Post</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Post"
                                        value={allInformationEdit.ppost}
                                        onChange={(e) => {
                                            setAllInformationEdit({ ...allInformationEdit, ppost: e.target.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl size="small" fullWidth>
                                    <Typography>Pincode</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="number"
                                        sx={userStyle.input}
                                        placeholder="Pincode"
                                        value={allInformationEdit.ppincode}
                                        onChange={(e) => {
                                            handlechangeppincode(e);
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl size="small" fullWidth>
                                    <Typography>Country</Typography>
                                    <Selects
                                        options={Country.getAllCountries()}
                                        getOptionLabel={(options) => {
                                            return options["name"];
                                        }}
                                        getOptionValue={(options) => {
                                            return options["name"];
                                        }}
                                        value={selectedCountryp}
                                        styles={colourStyles}
                                        onChange={(item) => {
                                            setSelectedCountryp(item);
                                            setSelectedStatep("");
                                            setSelectedCityp("");
                                            setAllInformationEdit((prevSupplier) => ({
                                                ...prevSupplier,
                                                pcountry: item?.name || "",
                                            }));
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>State</Typography>
                                    <Selects
                                        options={State?.getStatesOfCountry(
                                            selectedCountryp?.isoCode
                                        )}
                                        getOptionLabel={(options) => {
                                            return options["name"];
                                        }}
                                        getOptionValue={(options) => {
                                            return options["name"];
                                        }}
                                        value={selectedStatep}
                                        styles={colourStyles}
                                        onChange={(item) => {
                                            setSelectedStatep(item);
                                            setSelectedCityp("");
                                            setAllInformationEdit((prevSupplier) => ({
                                                ...prevSupplier,
                                                pstate: item?.name || "",
                                            }));
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>City</Typography>
                                    <Selects
                                        options={City.getCitiesOfState(
                                            selectedStatep?.countryCode,
                                            selectedStatep?.isoCode
                                        )}
                                        getOptionLabel={(options) => {
                                            return options["name"];
                                        }}
                                        getOptionValue={(options) => {
                                            return options["name"];
                                        }}
                                        value={selectedCityp}
                                        styles={colourStyles}
                                        onChange={(item) => {
                                            setSelectedCityp(item);
                                            setAllInformationEdit((prevSupplier) => ({
                                                ...prevSupplier,
                                                pcity: item?.name || "",
                                            }));
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            {errors.paddressall && <div>{errors.paddressall}</div>}
                            <Grid item md={12} sm={12} xs={12}>
                                <Typography
                                >
                                    Proof&nbsp;<b style={{ color: "red" }}>*</b>
                                </Typography>
                                {infoProof.paddressproof && (
                                    <>
                                        <Grid sx={{ display: "flex", justifyContent: "flex-start" }}>
                                            <img
                                                src={infoProof.paddressproof}
                                                style={{ height: 120, width: 170 }}
                                                alt="paddressproof"
                                            />
                                        </Grid>
                                    </>
                                )
                                }
                                <br />
                                <Grid sx={{ display: "flex" }}>
                                    <FormControl size="small" fullWidth>
                                        <Grid sx={{ display: "flex" }}>
                                            <Button
                                                component="label"
                                                variant="contained"
                                                color="primary"
                                            >
                                                Upload
                                                <input
                                                    type="file"
                                                    id="paddressproof"
                                                    accept="image/*"
                                                    name="file"
                                                    hidden
                                                    onChange={handleImageUploadpadd}
                                                />
                                            </Button>
                                            <Button
                                                onClick={(e) => {
                                                    setFile("");
                                                    setInfoProof({ ...infoProof, paddressproof: "" });
                                                }}
                                                sx={userStyle.btncancel}
                                            >
                                                Clear
                                            </Button>
                                        </Grid>
                                    </FormControl>
                                </Grid>
                                {errors.paddressproof && <div>{errors.paddressproof}</div>}
                            </Grid>
                            <Grid item md={12} sm={12} xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Button
                                    variant="outlined"
                                    sx={userStyle.btncancel}
                                    onClick={() => {
                                        setIsPermanantAddressOpenEdit(false)
                                        setAddOpenalertPermanant(false)
                                    }}
                                    type="button"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={(e) => {
                                        requiredFieldCheckPermanent();
                                    }}
                                    type="button"
                                    sx={{ height: "38px" }}
                                >
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </>
                </Box>
            </Dialog>
            {/* Current Address Popup For Edit*/}
            <Dialog
                open={isCurrentAddressOpenEdit}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="lg"
            >
                <Box sx={userStyle.selectcontainer}>
                    <Typography sx={userStyle.SubHeaderText}>
                        Current Address{" "}
                    </Typography> <br /><br />
                    <>
                        <Grid container spacing={2}>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography >Door/Flat No</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Door/Flat No"
                                        value={allInformationEdit.cdoorno}
                                        onChange={(e) => {
                                            setAllInformationEdit({ ...allInformationEdit, cdoorno: e.target.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Street/Block</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Street/Block"
                                        value={allInformationEdit.cstreet}
                                        onChange={(e) => {
                                            setAllInformationEdit({ ...allInformationEdit, cstreet: e.target.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Area/village</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Area/Village"
                                        value={allInformationEdit.carea}
                                        onChange={(e) => {
                                            setAllInformationEdit({ ...allInformationEdit, carea: e.target.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Landmark</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Landmark"
                                        value={allInformationEdit.clandmark}
                                        onChange={(e) => {
                                            setAllInformationEdit({ ...allInformationEdit, clandmark: e.target.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <br />
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Taluk</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Taluk"
                                        value={allInformationEdit.ctaluk}
                                        onChange={(e) => {
                                            setAllInformationEdit({ ...allInformationEdit, ctaluk: e.target.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl size="small" fullWidth>
                                    <Typography>Post</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Post"
                                        value={allInformationEdit.cpost}
                                        onChange={(e) => {
                                            setAllInformationEdit({ ...allInformationEdit, cpost: e.target.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl size="small" fullWidth>
                                    <Typography>Pincode</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="number"
                                        placeholder="Pincode"
                                        value={allInformationEdit.cpincode}
                                        onChange={(e) => {
                                            handlechangecpincode(e);
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Country</Typography>
                                    <Selects
                                        options={Country.getAllCountries()}
                                        getOptionLabel={(options) => {
                                            return options["name"];
                                        }}
                                        getOptionValue={(options) => {
                                            return options["name"];
                                        }}
                                        value={selectedCountryc}
                                        styles={colourStyles}
                                        onChange={(item) => {
                                            setSelectedCountryc(item);
                                            setSelectedStatec("");
                                            setSelectedCityc("");
                                            setAllInformationEdit((prevSupplier) => ({
                                                ...prevSupplier,
                                                ccountry: item?.name || "",
                                            }));
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>State</Typography>
                                    <Selects
                                        options={State?.getStatesOfCountry(
                                            selectedCountryc?.isoCode
                                        )}
                                        getOptionLabel={(options) => {
                                            return options["name"];
                                        }}
                                        getOptionValue={(options) => {
                                            return options["name"];
                                        }}
                                        value={selectedStatec}
                                        styles={colourStyles}
                                        onChange={(item) => {
                                            setSelectedStatec(item);
                                            setSelectedCityc("");
                                            setAllInformationEdit((prevSupplier) => ({
                                                ...prevSupplier,
                                                cstate: item?.name || "",
                                            }));
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>City</Typography>
                                    <Selects
                                        options={City.getCitiesOfState(
                                            selectedStatec?.countryCode,
                                            selectedStatec?.isoCode
                                        )}
                                        getOptionLabel={(options) => {
                                            return options["name"];
                                        }}
                                        getOptionValue={(options) => {
                                            return options["name"];
                                        }}
                                        value={selectedCityc}
                                        styles={colourStyles}
                                        onChange={(item) => {
                                            setSelectedCityc(item);
                                            setAllInformationEdit((prevSupplier) => ({
                                                ...prevSupplier,
                                                ccity: item?.name || "",
                                            }));
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            {errors.caddressall && <div>{errors.caddressall}</div>}
                            <Grid item md={12} sm={12} xs={12}>
                                <Typography
                                >
                                    Proof&nbsp;<b style={{ color: "red" }}>*</b>
                                </Typography>
                                {infoProof.caddressproof && (
                                    <>
                                        <Grid sx={{ display: "flex", justifyContent: "flex-start" }}>
                                            <img
                                                src={infoProof.caddressproof}
                                                style={{ height: 120, width: 170 }}
                                                alt="caddressproof"
                                            />
                                        </Grid>
                                    </>
                                )
                                }
                                <br />
                                <Grid sx={{ display: "flex" }}>
                                    <FormControl size="small" fullWidth>
                                        <Grid sx={{ display: "flex" }}>
                                            <Button
                                                component="label"
                                                variant="contained"
                                                color="primary"
                                            >
                                                Upload
                                                <input
                                                    type="file"
                                                    id="caddressproof"
                                                    accept="image/*"
                                                    name="file"
                                                    hidden
                                                    onChange={handleImageUploadcadd}
                                                />
                                            </Button>
                                            <Button
                                                onClick={(e) => {
                                                    setFile("");
                                                    setInfoProof({ ...infoProof, caddressproof: "" });
                                                }}
                                                sx={userStyle.btncancel}
                                            >
                                                Clear
                                            </Button>
                                        </Grid>
                                    </FormControl>
                                </Grid>
                                {errors.caddressproof && <div>{errors.caddressproof}</div>}
                            </Grid>
                            <Grid item md={12} sm={12} xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Button
                                    variant="outlined"
                                    sx={userStyle.btncancel}
                                    onClick={() => {
                                        setIsCurrentAddressOpenEdit(false)
                                        setAddOpenalertCurrent(false)
                                    }}
                                    type="button"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={(e) => {
                                        requiredFieldCheckCurrent()
                                    }}
                                    type="button"
                                    sx={{ height: "38px" }}
                                >
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </>
                </Box>
            </Dialog>
            {/* Document List Popup For Edit*/}
            <Dialog
                open={isDocumentListOpenEdit}
                // onClose={handleCloseVerify}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="lg"
            >
                <Box sx={userStyle.selectcontainer}>
                    <Grid item xs={8}>
                        <Typography sx={userStyle.SubHeaderText}>Document</Typography>
                    </Grid>
                    <>
                        <Grid container sx={{ justifyContent: "center" }} spacing={1}>
                            <Selects
                                options={designationsFileNames}
                                styles={colourStyles}
                                value={{
                                    label: fileNames,
                                    value: fileNames,
                                }}
                                onChange={(e) => {
                                    setfileNames(e.value);
                                }}
                            />
                            &nbsp;
                            <Button variant="outlined" component="label">
                                <CloudUploadIcon sx={{ fontSize: "21px" }} /> &ensp;Upload
                                Documents
                                <input
                                    hidden
                                    type="file"
                                    multiple
                                    onChange={handleFileUpload}
                                />
                            </Button>
                        </Grid>
                        <br /><br />
                    </>
                    <Typography sx={userStyle.SubHeaderText}> Document List </Typography>
                    <br />
                    <br />
                    <br />
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table" id="branch">
                            <TableHead sx={{ fontWeight: "600" }}>
                                <StyledTableRow>
                                    <StyledTableCell align="center">SI.NO</StyledTableCell>
                                    <StyledTableCell align="center">Document</StyledTableCell>
                                    <StyledTableCell align="center">Remarks</StyledTableCell>
                                    <StyledTableCell align="center">View</StyledTableCell>
                                    <StyledTableCell align="center">Action</StyledTableCell>
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                {filesEdit &&
                                    filesEdit.map((file, index) => (
                                        <StyledTableRow key={index}>
                                            <StyledTableCell align="center">{snoe++}</StyledTableCell>
                                            <StyledTableCell align="left">
                                                {file.name}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <FormControl>
                                                    <OutlinedInput
                                                        sx={{
                                                            height: "30px !important",
                                                            background: "white",
                                                            border: "1px solid rgb(0 0 0 / 48%)",
                                                        }}
                                                        size="small"
                                                        type="text"
                                                        value={file.remark}
                                                        onChange={(event) =>
                                                            handleRemarkChange(index, event.target.value)
                                                        }
                                                    />
                                                </FormControl>
                                            </StyledTableCell>
                                            <StyledTableCell
                                                component="th"
                                                scope="row"
                                                align="center"
                                            >
                                                <a
                                                    style={{ color: "#357ae8" }}
                                                    href={`data:application/octet-stream;base64,${file.data}`}
                                                    download={file.name}
                                                >
                                                    Download
                                                </a>
                                                <a
                                                    style={{
                                                        color: "#357ae8",
                                                        cursor: "pointer",
                                                        textDecoration: "underline",
                                                    }}
                                                    onClick={() => renderFilePreview(file)}
                                                >
                                                    View
                                                </a>
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <Button
                                                    onClick={() => handleFileDelete(index)}
                                                    variant="contained"
                                                    size="small"
                                                    sx={{ textTransform: "capitalize", minWidth: "0px" }}
                                                >
                                                    <DeleteIcon style={{ fontSize: "20px" }} />
                                                </Button>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {errors.filesedit && <div>{errors.filesedit}</div>}
                    <br />
                    <Grid item md={12} sm={12} xs={12}>
                        <Typography
                        >
                            Proof&nbsp;<b style={{ color: "red" }}>*</b>
                        </Typography>
                        {infoProof.documentproof && (
                            <>
                                <Grid sx={{ display: "flex", justifyContent: "flex-start" }}>
                                    <img
                                        src={infoProof.documentproof}
                                        style={{ height: 120, width: 170 }}
                                        alt="DocumentProof"
                                    />
                                </Grid>
                            </>
                        )
                        }
                        <br />
                        <Grid sx={{ display: "flex" }}>
                            <FormControl size="small" fullWidth>
                                <Grid sx={{ display: "flex" }}>
                                    <Button
                                        component="label"
                                        variant="contained"
                                        color="primary"
                                    >
                                        Upload
                                        <input
                                            type="file"
                                            id="documentproof"
                                            accept="image/*"
                                            name="file"
                                            hidden
                                            onChange={handleImageUploaddoc}
                                        />
                                    </Button>
                                    <Button
                                        onClick={(e) => {
                                            setFile("");
                                            setInfoProof({ ...infoProof, documentproof: "" });
                                        }}
                                        sx={userStyle.btncancel}
                                    >
                                        Clear
                                    </Button>
                                </Grid>
                            </FormControl>
                        </Grid>
                        {errors.documentproof && <div>{errors.documentproof}</div>}
                    </Grid>
                    <br /><br />
                    <Grid item md={12} sm={12} xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Button
                            variant="outlined"
                            sx={userStyle.btncancel}
                            onClick={() => {
                                setIsDocumentListOpenEdit(false)
                                setAddOpenalertDocument(false)
                            }}
                            type="button"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={(e) => {
                                requiredFieldCheckDocument();
                            }}
                            type="button"
                            sx={{ height: "38px" }}
                        >
                            Submit
                        </Button>
                    </Grid>
                </Box>
            </Dialog>
            {/* Educational Qualification Popup For Edit*/}
            <Dialog
                open={isEducationalQualifyOpenEdit}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="lg"
                sx={{
                    overflow: 'auto',
                    '& .MuiPaper-root': {
                        overflow: 'auto',
                    },
                }}
            >
                <Box sx={userStyle.selectcontainer}>
                    <Typography sx={userStyle.SubHeaderText}>
                        Educational qualification
                    </Typography>
                    <br />
                    <br />
                    <Grid container spacing={1}>
                        <Grid item md={3} sm={12} xs={12}>
                            <FormControl fullWidth size="small">
                                <Typography>Category</Typography>
                                <Selects
                                    options={categorys}
                                    value={{
                                        label:
                                            allInformationEdit.categoryedu === "" ||
                                                allInformationEdit.categoryedu == undefined
                                                ? "Please Select Category"
                                                : allInformationEdit.categoryedu,
                                        value:
                                            allInformationEdit.categoryedu === "" ||
                                                allInformationEdit.categoryedu == undefined
                                                ? "Please Select Category"
                                                : allInformationEdit.categoryedu,
                                    }}
                                    onChange={(e) => {
                                        setAllInformationEdit((prev) => ({
                                            ...prev,
                                            categoryedu: e.value,
                                            subcategoryedu: "Please Select Sub Category",
                                            specialization: "Please Select Specialization",
                                        }));
                                        fetchCategoryBased(e);
                                        setSubcategorys([]);
                                        setEducationsOpt([]);
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                            <FormControl fullWidth size="small">
                                <Typography>Sub Category</Typography>
                                <Selects
                                    options={subcategorys}
                                    value={{
                                        label:
                                            allInformationEdit.subcategoryedu === "" ||
                                                allInformationEdit.subcategoryedu == undefined
                                                ? "Please Select Sub Category"
                                                : allInformationEdit.subcategoryedu,
                                        value:
                                            allInformationEdit.subcategoryedu === "" ||
                                                allInformationEdit.subcategoryedu == undefined
                                                ? "Please Select Sub Category"
                                                : allInformationEdit.subcategoryedu,
                                    }}
                                    onChange={(e) => {
                                        setAllInformationEdit((prev) => ({
                                            ...prev,
                                            subcategoryedu: e.value,
                                            specialization: "Please Select Specialization",
                                        }));
                                        fetchEducation(e);
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <Typography> Specialization</Typography>
                            <FormControl fullWidth size="small">
                                <Selects
                                    options={educationsOpt}
                                    value={{
                                        label:
                                            allInformationEdit.specialization === "" ||
                                                allInformationEdit.specialization == undefined
                                                ? "Please Select Specialization"
                                                : allInformationEdit.specialization,
                                        value:
                                            allInformationEdit.specialization === "" ||
                                                allInformationEdit.specialization == undefined
                                                ? "Please Select Specialization"
                                                : allInformationEdit.specialization,
                                    }}
                                    onChange={(e) => {
                                        setAllInformationEdit((prev) => ({
                                            ...prev,
                                            specialization: e.value,
                                        }));
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} sm={6} xs={12}>
                            <FormControl fullWidth size="small">
                                <Typography> Institution </Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    value={institution}
                                    placeholder="Institution"
                                    onChange={(e) => setInstitution(e.target.value)}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} sm={6} xs={12}>
                            <FormControl fullWidth size="small">
                                <Typography> Passed Year </Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="number"
                                    placeholder="Passed Year"
                                    sx={userStyle.input}
                                    value={passedyear}
                                    onChange={(e) => handlechangepassedyear(e)}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <FormControl fullWidth size="small">
                                <Typography> CGPA</Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="number"
                                    placeholder="CGPA"
                                    sx={userStyle.input}
                                    value={cgpa}
                                    onChange={(e) => handlechangecgpa(e)}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={1} sm={12} xs={12}>
                            <FormControl size="small">
                                <Button
                                    variant="contained"
                                    color="success"
                                    type="button"
                                    onClick={handleSubmittodo}
                                    sx={userStyle.Todoadd}
                                >
                                    <FaPlus />
                                </Button>
                                &nbsp;
                            </FormControl>
                        </Grid>
                        <Grid item md={6} sm={12} xs={12}>
                            <br />
                            <br />
                            {errorstodo.qualification && (
                                <div>{errorstodo.qualification}</div>
                            )}
                        </Grid>
                    </Grid>
                    <br /> <br />
                    <Typography sx={userStyle.SubHeaderText}>
                        {" "}
                        Educational Details{" "}
                    </Typography>
                    <br />
                    <br />
                    <br />
                    {/* ****** Table start ****** */}
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table" id="branch">
                            <TableHead sx={{ fontWeight: "600" }}>
                                <StyledTableRow>
                                    <StyledTableCell align="center">SI.NO</StyledTableCell>
                                    <StyledTableCell align="center">Category</StyledTableCell>
                                    <StyledTableCell align="center">Sub Category</StyledTableCell>
                                    <StyledTableCell align="center">
                                        Specialization
                                    </StyledTableCell>
                                    <StyledTableCell align="center">Institution</StyledTableCell>
                                    <StyledTableCell align="center">Passed Year</StyledTableCell>
                                    <StyledTableCell align="center">% or cgpa</StyledTableCell>
                                    <StyledTableCell align="center">Action</StyledTableCell>
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                {eduTodoEdit &&
                                    eduTodoEdit?.map((todo, index) => (
                                        <StyledTableRow key={index}>
                                            <StyledTableCell align="center">
                                                {edunoe++}
                                            </StyledTableCell>
                                            <StyledTableCell align="left">
                                                {todo.categoryedu}
                                            </StyledTableCell>
                                            <StyledTableCell align="left">
                                                {todo.subcategoryedu}
                                            </StyledTableCell>
                                            <StyledTableCell align="left">
                                                {todo.specialization}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {todo.institution}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {todo.passedyear}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {todo.cgpa}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        type="button"
                                                        onClick={() => handleDelete(index)}
                                                        sx={userStyle.Todoadd}
                                                    >
                                                        <AiOutlineClose />
                                                    </Button>
                                                }
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {errors.edutodoedit && <div>{errors.edutodoedit}</div>}
                    <br />
                    <Grid item md={12} sm={12} xs={12}>
                        <Typography
                        >
                            Proof&nbsp;<b style={{ color: "red" }}>*</b>
                        </Typography>
                        {infoProof.eduqualiproof && (
                            <>
                                <Grid sx={{ display: "flex", justifyContent: "flex-start" }}>
                                    <img
                                        src={infoProof.eduqualiproof}
                                        style={{ height: 120, width: 170 }}
                                        alt="EduqualiProof"
                                    />
                                </Grid>
                            </>
                        )
                        }
                        <br />
                        <Grid sx={{ display: "flex" }}>
                            <FormControl size="small" fullWidth>
                                <Grid sx={{ display: "flex" }}>
                                    <Button
                                        component="label"
                                        variant="contained"
                                        color="primary"
                                    >
                                        Upload
                                        <input
                                            type="file"
                                            id="eduqualiproof"
                                            accept="image/*"
                                            name="file"
                                            hidden
                                            onChange={handleImageUploadedu}
                                        />
                                    </Button>
                                    <Button
                                        onClick={(e) => {
                                            setFile("");
                                            setInfoProof({ ...infoProof, eduqualiproof: "" });
                                        }}
                                        sx={userStyle.btncancel}
                                    >
                                        Clear
                                    </Button>
                                </Grid>
                            </FormControl>
                        </Grid>
                        {errors.eduqualiproof && <div>{errors.eduqualiproof}</div>}
                    </Grid>
                    <br /><br />
                    <Grid item md={12} sm={12} xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Button
                            variant="outlined"
                            sx={userStyle.btncancel}
                            onClick={() => {
                                setIsEducationalQualifyOpenEdit(false)
                                setAddOpenalertEducational(false)
                            }}
                            type="button"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={(e) => {
                                requiredFieldCheckEducation();
                            }}
                            type="button"
                            sx={{ height: "38px" }}
                        >
                            Submit
                        </Button>
                    </Grid>
                </Box>
                <br />
            </Dialog>
            {/* Additional Qualification Popup For Edit*/}
            <Dialog
                open={isAdditionalQualifyOpenEdit}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="lg"
            >
                <Box sx={userStyle.selectcontainer}>
                    <Typography sx={userStyle.SubHeaderText}>
                        Additional qualification{" "}
                    </Typography>
                    <br />
                    <br />
                    <Grid container spacing={2}>
                        <Grid item md={3} sm={12} xs={12}>
                            <FormControl fullWidth size="small">
                                <Typography> Addtl. Qualification </Typography>
                                <Selects
                                    options={skillSet}
                                    styles={colourStyles}
                                    value={{
                                        label:
                                            addQual === "" || addQual == undefined
                                                ? "Please Select Additional Qualification"
                                                : addQual,
                                        value:
                                            addQual === "" || addQual == undefined
                                                ? "Please Select Additional Qualification"
                                                : addQual,
                                    }}
                                    onChange={(e) => {
                                        setAddQual(e.value);
                                    }}
                                />
                            </FormControl>
                            {errorstodo.addQual && <div>{errorstodo.addQual}</div>}
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                            <FormControl fullWidth size="small">
                                <Typography> Institution </Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    placeholder="Institution"
                                    value={addInst}
                                    onChange={(e) => setAddInst(e.target.value)}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                            <FormControl fullWidth size="small">
                                <Typography>Durartion</Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    placeholder="Durartion"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={12} xs={12}>
                            <FormControl fullWidth size="small">
                                <Typography> Remarks</Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    placeholder="Remarks"
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={1} sm={12} xs={12}>
                            <FormControl size="small">
                                <Button
                                    variant="contained"
                                    color="success"
                                    type="button"
                                    onClick={handleSubmitAddtodo}
                                    sx={userStyle.Todoadd}
                                >
                                    <FaPlus />
                                </Button>
                                &nbsp;
                            </FormControl>
                        </Grid>
                        <br />
                    </Grid>
                    <br />
                    <br />
                    <Typography sx={userStyle.SubHeaderText}>
                        {" "}
                        Additional Qualification Details{" "}
                    </Typography>
                    {/* ****** Table start ****** */}
                    <TableContainer component={Paper}>
                        <Table
                            aria-label="simple table"
                            id="branch"
                        // ref={tableRef}
                        >
                            <TableHead sx={{ fontWeight: "600" }}>
                                <StyledTableRow>
                                    <StyledTableCell align="center">SI.NO</StyledTableCell>
                                    <StyledTableCell align="center">
                                        Addl. Qualification
                                    </StyledTableCell>
                                    <StyledTableCell align="center">Institution</StyledTableCell>
                                    <StyledTableCell align="center">Duration</StyledTableCell>
                                    <StyledTableCell align="center">Remarks</StyledTableCell>
                                    <StyledTableCell align="center">Action</StyledTableCell>
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                {addAddQuaTodoEdit &&
                                    addAddQuaTodoEdit.map((addtodo, index) => (
                                        <StyledTableRow key={index}>
                                            <StyledTableCell align="center">{sknoe++}</StyledTableCell>
                                            <StyledTableCell align="center">
                                                {addtodo.addQual}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {addtodo.addInst}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {addtodo.duration}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {addtodo.remarks}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        type="button"
                                                        onClick={() => handleAddDelete(index)}
                                                        sx={userStyle.Todoadd}
                                                    >
                                                        <AiOutlineClose />
                                                    </Button>
                                                }
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {errors.addtodoedit && <div>{errors.addtodoedit}</div>}
                    <br />
                    <Grid item md={12} sm={12} xs={12}>
                        <Typography
                        >
                            Proof&nbsp;<b style={{ color: "red" }}>*</b>
                        </Typography>
                        {infoProof.addqualiproof && (
                            <>
                                <Grid sx={{ display: "flex", justifyContent: "flex-start" }}>
                                    <img
                                        src={infoProof.addqualiproof}
                                        style={{ height: 120, width: 170 }}
                                        alt="AddqualiProof"
                                    />
                                </Grid>
                            </>
                        )
                        }
                        <br />
                        <Grid sx={{ display: "flex" }}>
                            <FormControl size="small" fullWidth>
                                <Grid sx={{ display: "flex" }}>
                                    <Button
                                        component="label"
                                        variant="contained"
                                        color="primary"
                                    >
                                        Upload
                                        <input
                                            type="file"
                                            id="addqualiproof"
                                            accept="image/*"
                                            name="file"
                                            hidden
                                            onChange={handleImageUploadadd}
                                        />
                                    </Button>
                                    <Button
                                        onClick={(e) => {
                                            setFile("");
                                            setInfoProof({ ...infoProof, addqualiproof: "" });
                                        }}
                                        sx={userStyle.btncancel}
                                    >
                                        Clear
                                    </Button>
                                </Grid>
                            </FormControl>
                        </Grid>
                        {errors.addqualiproof && <div>{errors.addqualiproof}</div>}
                    </Grid>
                    <br /><br />
                    <Grid item md={12} sm={12} xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Button
                            variant="outlined"
                            sx={userStyle.btncancel}
                            onClick={() => {
                                setIsAdditionalQualifyOpenEdit(false)
                                setAddOpenalertAdditional(false)
                            }}
                            type="button"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={(e) => {
                                requiredFieldCheckAdditioanl();
                            }}
                            type="button"
                            sx={{ height: "38px" }}
                        >
                            Submit
                        </Button>
                    </Grid>
                </Box>
            </Dialog>
            {/* Work History Popup For Edit*/}
            <Dialog
                open={isWorkHistoryOpenEdit}
                // onClose={handleCloseVerify}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="lg"
            >
                <Box sx={userStyle.selectcontainer}>
                    <Typography sx={userStyle.SubHeaderText}>Work History</Typography>
                    <br />
                    <br />
                    <Grid container spacing={2}>
                        <Grid item md={4} sm={12} xs={12}>
                            <FormControl fullWidth size="small">
                                <Typography> Employee Name</Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    placeholder="Employee Name"
                                    value={empNameTodo}
                                    onChange={(e) => setEmpNameTodo(e.target.value)}
                                />
                            </FormControl>
                            {errorstodo.empNameTodo && <div>{errorstodo.empNameTodo}</div>}
                        </Grid>
                        <Grid item md={4} sm={12} xs={12}>
                            <FormControl fullWidth size="small">
                                <Typography> Designation </Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    placeholder="Designation"
                                    value={desigTodo}
                                    onChange={(e) => {
                                        setDesigTodo(e.target.value);
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={12} xs={12}>
                            <FormControl fullWidth size="small">
                                <Typography> Joined On </Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="date"
                                    value={joindateTodo}
                                    onChange={(e) => {
                                        setJoindateTodo(e.target.value);
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={12} xs={12}>
                            <FormControl fullWidth size="small">
                                <Typography> Leave On</Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="date"
                                    value={leavedateTodo}
                                    onChange={(e) => setLeavedateTodo(e.target.value)}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} sm={12} xs={12}>
                            <FormControl fullWidth size="small">
                                <Typography> Duties</Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    placeholder="Duties"
                                    value={dutiesTodo}
                                    onChange={(e) => setDutiesTodo(e.target.value)}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} sm={12} xs={12}>
                            <FormControl fullWidth size="small">
                                <Typography> Reason for Leaving</Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    placeholder="Reason for Leaving"
                                    value={reasonTodo}
                                    onChange={(e) => setReasonTodo(e.target.value)}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={1} sm={12} xs={12}>
                            <FormControl size="small">
                                <Button
                                    variant="contained"
                                    color="success"
                                    type="button"
                                    onClick={handleSubmitWorkSubmit}
                                    sx={userStyle.Todoadd}
                                >
                                    <FaPlus />
                                </Button>
                                &nbsp;
                            </FormControl>
                        </Grid>
                        <br />
                    </Grid>
                    <Typography sx={userStyle.SubHeaderText}>
                        {" "}
                        Work History Details{" "}
                    </Typography>
                    <br />
                    <br />
                    <br />
                    {/* ****** Table start ****** */}
                    <TableContainer component={Paper}>
                        <Table
                            aria-label="simple table"
                            id="branch"
                        // ref={tableRef}
                        >
                            <TableHead sx={{ fontWeight: "600" }}>
                                <StyledTableRow>
                                    <StyledTableCell align="center">SI.NO</StyledTableCell>
                                    <StyledTableCell align="center">
                                        Employee Name
                                    </StyledTableCell>
                                    <StyledTableCell align="center">Designation</StyledTableCell>
                                    <StyledTableCell align="center">Joined On</StyledTableCell>
                                    <StyledTableCell align="center">Leave On</StyledTableCell>
                                    <StyledTableCell align="center">Duties</StyledTableCell>
                                    <StyledTableCell align="center">
                                        Reason for Leaving
                                    </StyledTableCell>
                                    <StyledTableCell align="center">Action</StyledTableCell>
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                {workhistTodoEdit &&
                                    workhistTodoEdit.map((todo, index) => (
                                        <StyledTableRow key={index}>
                                            <StyledTableCell align="center">{snowe++}</StyledTableCell>
                                            <StyledTableCell align="left">
                                                {todo.empNameTodo}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {todo.desigTodo}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {todo.joindateTodo
                                                    ? moment(todo.joindateTodo)?.format("DD-MM-YYYY")
                                                    : ""}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {todo.leavedateTodo
                                                    ? moment(todo.leavedateTodo)?.format("DD-MM-YYYY")
                                                    : ""}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {todo.dutiesTodo}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {todo.reasonTodo}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        type="button"
                                                        onClick={() => handleWorkHisDelete(index)}
                                                        sx={userStyle.Todoadd}
                                                    >
                                                        <AiOutlineClose />
                                                    </Button>
                                                }
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {errors.workhistedit && <div>{errors.workhistedit}</div>}
                    <Grid item md={12} sm={12} xs={12}>
                        <Typography
                        >
                            Proof&nbsp;<b style={{ color: "red" }}>*</b>
                        </Typography>
                        {infoProof.workhistproof && (
                            <>
                                <Grid sx={{ display: "flex", justifyContent: "flex-start" }}>
                                    <img
                                        src={infoProof.workhistproof}
                                        style={{ height: 120, width: 170 }}
                                        alt="WorkhistProof"
                                    />
                                </Grid>
                            </>
                        )
                        }
                        <br />
                        <Grid sx={{ display: "flex" }}>
                            <FormControl size="small" fullWidth>
                                <Grid sx={{ display: "flex" }}>
                                    <Button
                                        component="label"
                                        variant="contained"
                                        color="primary"
                                    >
                                        Upload
                                        <input
                                            type="file"
                                            id="workhistproof"
                                            accept="image/*"
                                            name="file"
                                            hidden
                                            onChange={handleImageUploadwork}
                                        />
                                    </Button>
                                    <Button
                                        onClick={(e) => {
                                            setFile("");
                                            setInfoProof({ ...infoProof, workhistproof: "" });
                                        }}
                                        sx={userStyle.btncancel}
                                    >
                                        Clear
                                    </Button>
                                </Grid>
                            </FormControl>
                        </Grid>
                        {errors.workhistproof && <div>{errors.workhistproof}</div>}
                    </Grid>
                    <br /><br />
                    <Grid item md={12} sm={12} xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Button
                            variant="outlined"
                            sx={userStyle.btncancel}
                            onClick={() => {
                                setIsWorkHistoryOpenEdit(false)
                                setAddOpenalertWork(false)
                            }}
                            type="button"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={(e) => {
                                requiredFieldCheckWork();
                            }}
                            type="button"
                            sx={{ height: "38px" }}
                        >
                            Submit
                        </Button>
                    </Grid>
                </Box><br />
            </Dialog>
            {/* Bank Details Popup For Edit*/}
            <Dialog
                open={isBankDetailsOpenEdit}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="lg"
            >
                <Box sx={userStyle.selectcontainer}>
                    <Typography sx={userStyle.SubHeaderText}>Bank Details </Typography>
                    <br />
                    <br />
                    <Grid container spacing={2}>
                        <Grid item md={4} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>Bank Name</Typography>
                                <Selects
                                    maxMenuHeight={250}
                                    options={accounttypes}
                                    placeholder="Please Choose Bank Name"
                                    value={{
                                        label:
                                            allInformationEdit.bankname === "" || allInformationEdit.bankname == undefined
                                                ? "ICICI BANK - ICICI"
                                                : allInformationEdit.bankname,
                                        value:
                                            allInformationEdit.bankname === "" || allInformationEdit.bankname == undefined
                                                ? "ICICI BANK - ICICI"
                                                : allInformationEdit.bankname,
                                    }}
                                    onChange={(e) => {
                                        setAllInformationEdit({
                                            ...allInformationEdit,
                                            bankname: e.value,
                                            bankbranchname: "",
                                            accountholdername: "",
                                            accountnumber: "",
                                            ifsccode: "",
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    Bank Branch Name
                                    <span
                                        style={{
                                            display: "inline",
                                            fontSize: "0.8rem",
                                            color: "blue",
                                            textDecoration: "underline",
                                            cursor: "pointer",
                                            marginLeft: "5px",
                                        }}
                                        onClick={handleModalOpen}
                                    >
                                        {"(Get By IFSC Code)"}
                                    </span>
                                </Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    placeholder="Please Enter Bank Branch Name"
                                    name="bankbranchname"
                                    value={allInformationEdit.bankbranchname}
                                    onChange={(e) => {
                                        setAllInformationEdit({
                                            ...allInformationEdit,
                                            bankbranchname: e.target.value,
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>Account Holder Name</Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    placeholder="Please Enter Account Name"
                                    value={allInformationEdit.accountholdername}
                                    onChange={(e) => {
                                        setAllInformationEdit({
                                            ...allInformationEdit,
                                            accountholdername: e.target.value,
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>Account Number</Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="number"
                                    sx={userStyle.input}
                                    placeholder="Please Enter Account Number"
                                    value={allInformationEdit.accountnumber}
                                    onChange={(e) => {
                                        setAllInformationEdit({ ...allInformationEdit, accountnumber: e.target.value });
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>IFSC Code</Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    placeholder="Please Enter IFSC Code"
                                    value={allInformationEdit.ifsccode}
                                    onChange={(e) => {
                                        setAllInformationEdit({ ...allInformationEdit, ifsccode: e.target.value });
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={12} sx={{ display: "flex" }}>
                            <FormControl fullWidth size="small">
                                <Typography>Type of Account</Typography>
                                <Selects
                                    maxMenuHeight={250}
                                    options={typeofaccount}
                                    placeholder="Please Choose Account Type"
                                    value={{
                                        label:
                                            allInformationEdit.accounttype === "" ||
                                                allInformationEdit.accounttype == undefined
                                                ? "Please Select Account Type"
                                                : allInformationEdit.accounttype,
                                        value:
                                            allInformationEdit.accounttype === "" ||
                                                allInformationEdit.accounttype == undefined
                                                ? "Please Select Account Type"
                                                : allInformationEdit.accounttype,
                                    }}
                                    onChange={(e) => {
                                        setAllInformationEdit({ ...allInformationEdit, accounttype: e.value });
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} sm={8} xs={8}>
                            <FormControl fullWidth size="small">
                                <Typography>Status</Typography>
                                <Selects
                                    maxMenuHeight={250}
                                    options={accountstatus}
                                    placeholder="Please Select Status"
                                    value={{
                                        label: allInformationEdit.accountstatus,
                                        value: allInformationEdit.accountstatus,
                                    }}
                                    onChange={(e) => {
                                        setAllInformationEdit({ ...allInformationEdit, accountstatus: e.value });
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid
                            item
                            md={2}
                            sm={8}
                            xs={8}
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                // marginTop: "10%",
                            }}
                        >
                            <Button
                                variant="contained"
                                component="label"
                                size="small"
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginTop: "10%",
                                    height: "25px",
                                }}
                            >
                                Upload
                                <input
                                    accept="image/*,application/pdf"
                                    type="file"
                                    style={{ display: "none" }}
                                    onChange={(e) => {
                                        handleBankDetailsUpload(e);
                                    }}
                                />
                            </Button>
                        </Grid>
                        {bankUpload?.length > 0 && (
                            <Grid
                                item
                                md={5}
                                sm={8}
                                xs={8}
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    // marginTop: "10%",
                                }}
                            >
                                {bankUpload?.length > 0 &&
                                    bankUpload.map((file) => (
                                        <>
                                            <Grid container spacing={2}>
                                                <Grid item md={8} sm={8} xs={8}>
                                                    <Typography
                                                        style={{
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            whiteSpace: "nowrap",
                                                            maxWidth: "100%",
                                                        }}
                                                        title={file.name}
                                                    >
                                                        {file.name}
                                                    </Typography>
                                                </Grid>
                                                <Grid item md={2} sm={1} xs={1}>
                                                    <VisibilityOutlinedIcon
                                                        style={{
                                                            fontsize: "large",
                                                            color: "#357AE8",
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={() => renderFilePreview(file)}
                                                    />
                                                </Grid>
                                                <br />
                                                <br />
                                                <Grid item md={2} sm={1} xs={1}>
                                                    <Button
                                                        style={{
                                                            fontsize: "large",
                                                            color: "#357AE8",
                                                            cursor: "pointer",
                                                            marginTop: "-5px",
                                                            marginRight: "10px",
                                                        }}
                                                        onClick={() => setBankUpload([])}
                                                    >
                                                        <DeleteIcon />
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </>
                                    ))}
                            </Grid>
                        )}
                        &emsp;
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleBankTodo}
                            type="button"
                            sx={{
                                height: "30px",
                                minWidth: "30px",
                                marginTop: "38px",
                                padding: "6px 10px",
                            }}
                        >
                            <FaPlus />
                        </Button>
                        &nbsp;
                    </Grid>
                    {errors.bankedit && <div>{errors.bankedit}</div>}
                    <br />
                    {bankTodoEdit.map((data, index) => (
                        <div key={index}>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={{ fontWeight: "bold" }}>{`Row No : ${index + 1
                                        }`}</Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Bank Name<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={250}
                                            options={accounttypes}
                                            placeholder="Please Select Bank Name"
                                            value={{ label: data.bankname, value: data.bankname }}
                                            onChange={(e) => {
                                                handleBankTodoChange(index, "bankname", e.value);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Bank Branch Name<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={data.bankbranchname}
                                            placeholder="Please Enter Bank Branch Name"
                                            onChange={(e) => {
                                                handleBankTodoChange(
                                                    index,
                                                    "bankbranchname",
                                                    e.target.value
                                                );
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Account Holder Name<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={data.accountholdername}
                                            placeholder="Please Enter Account Holder Name"
                                            onChange={(e) => {
                                                handleBankTodoChange(
                                                    index,
                                                    "accountholdername",
                                                    e.target.value
                                                );
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Account Number<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={data.accountnumber}
                                            placeholder="Please Enter Account Number"
                                            onChange={(e) => {
                                                handleBankTodoChange(
                                                    index,
                                                    "accountnumber",
                                                    e.target.value
                                                );
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12} sx={{ display: "flex" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            IFSC Code<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={data.ifsccode}
                                            placeholder="Please Enter IFSC Code"
                                            onChange={(e) => {
                                                handleBankTodoChange(index, "ifsccode", e.target.value);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12} sx={{ display: "flex" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Type of Account</Typography>
                                        <Selects
                                            maxMenuHeight={250}
                                            options={typeofaccount}
                                            placeholder="Please Choose Account Type"
                                            value={{
                                                label: data.accounttype,
                                                value: data.accounttype,
                                            }}
                                            onChange={(e) => {
                                                handleBankTodoChange(index, "accounttype", e.value);
                                            }}
                                        />
                                    </FormControl>
                                    &nbsp; &emsp;
                                </Grid>
                                <Grid item md={4} xs={12} sm={12} sx={{ display: "flex" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Status</Typography>
                                        <Selects
                                            maxMenuHeight={250}
                                            options={accountstatus}
                                            placeholder="Please Choose Status"
                                            value={{
                                                label: data.accountstatus,
                                                value: data.accountstatus,
                                            }}
                                            onChange={(e) => {
                                                handleBankTodoChange(index, "accountstatus", e.value);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={6} xs={12} sm={12} sx={{ display: "flex" }}>
                                    <Grid container spacing={2}>
                                        <Grid
                                            item
                                            md={2}
                                            sm={8}
                                            xs={8}
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                // marginTop: "10%",
                                            }}
                                        >
                                            <Button
                                                variant="contained"
                                                component="label"
                                                size="small"
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    marginTop: "10%",
                                                    height: "25px",
                                                }}
                                            >
                                                Upload
                                                <input
                                                    accept="image/*,application/pdf"
                                                    type="file"
                                                    style={{ display: "none" }}
                                                    onChange={(e) => {
                                                        handleBankTodoChangeProof(e, index);
                                                    }}
                                                />
                                            </Button>
                                        </Grid>
                                        {data?.proof?.length > 0 && (
                                            <Grid
                                                item
                                                md={5}
                                                sm={8}
                                                xs={8}
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    // marginTop: "10%",
                                                }}
                                            >
                                                {data?.proof?.length > 0 &&
                                                    data?.proof.map((file) => (
                                                        <>
                                                            <Grid container spacing={2}>
                                                                <Grid item md={8} sm={8} xs={8}>
                                                                    <Typography
                                                                        style={{
                                                                            overflow: "hidden",
                                                                            textOverflow: "ellipsis",
                                                                            whiteSpace: "nowrap",
                                                                            maxWidth: "100%",
                                                                        }}
                                                                        title={file.name}
                                                                    >
                                                                        {file.name}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item md={1} sm={1} xs={1}>
                                                                    <VisibilityOutlinedIcon
                                                                        style={{
                                                                            fontsize: "large",
                                                                            color: "#357AE8",
                                                                            cursor: "pointer",
                                                                            marginLeft: "-7px",
                                                                        }}
                                                                        onClick={() => renderFilePreview(file)}
                                                                    />
                                                                </Grid>
                                                                <br />
                                                                <br />
                                                                <Grid item md={3} sm={1} xs={1}>
                                                                    <Button
                                                                        style={{
                                                                            fontsize: "large",
                                                                            color: "#357AE8",
                                                                            cursor: "pointer",
                                                                            marginTop: "-5px",
                                                                        }}
                                                                        onClick={() => handleDeleteProof(index)}
                                                                    >
                                                                        <DeleteIcon />
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                        </>
                                                    ))}
                                            </Grid>
                                        )}
                                        <Grid item md={1} sm={8} xs={8}>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                type="button"
                                                onClick={() => deleteTodoEdit(index)}
                                                sx={{
                                                    height: "30px",
                                                    minWidth: "30px",
                                                    marginTop: "28px",
                                                    padding: "6px 10px",
                                                }}
                                            >
                                                <AiOutlineClose />
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <br />
                        </div>
                    ))} <br />
                    <Grid item md={12} sm={12} xs={12}>
                        <Typography
                        >
                            Proof&nbsp;<b style={{ color: "red" }}>*</b>
                        </Typography>
                        {infoProof.bankdetailsproof && (
                            <>
                                <Grid sx={{ display: "flex", justifyContent: "flex-start" }}>
                                    <img
                                        src={infoProof.bankdetailsproof}
                                        style={{ height: 120, width: 170 }}
                                        alt="BankdetailsProof"
                                    />
                                </Grid>
                            </>
                        )
                        }
                        <br />
                        <Grid sx={{ display: "flex" }}>
                            <FormControl size="small" fullWidth>
                                <Grid sx={{ display: "flex" }}>
                                    <Button
                                        component="label"
                                        variant="contained"
                                        color="primary"
                                    >
                                        Upload
                                        <input
                                            type="file"
                                            id="bankdetailsproof"
                                            accept="image/*"
                                            name="file"
                                            hidden
                                            onChange={handleImageUploadbank}
                                        />
                                    </Button>
                                    <Button
                                        onClick={(e) => {
                                            setFile("");
                                            setInfoProof({ ...infoProof, bankdetailsproof: "" });
                                        }}
                                        sx={userStyle.btncancel}
                                    >
                                        Clear
                                    </Button>
                                </Grid>
                            </FormControl>
                        </Grid>
                        {errors.bankdetailsproof && <div>{errors.bankdetailsproof}</div>}
                    </Grid>
                    <br /><br />
                    <Grid item md={12} sm={12} xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Button
                            variant="outlined"
                            sx={userStyle.btncancel}
                            onClick={() => {
                                setIsBankDetailsOpenEdit(false)
                                setAddOpenalertBank(false)
                            }}
                            type="button"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={(e) => {
                                requiredFieldCheckBank();
                            }}
                            type="button"
                            sx={{ height: "38px" }}
                        >
                            Submit
                        </Button>
                    </Grid>
                </Box>
            </Dialog>
            {/* **************************************************************************************************************** */}
            {/* You can edit now */}
            {/* Are You Sure For Personal Information */}
            <Dialog
                open={isAddOpenalertPersonal}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent
                    sx={{
                        padding: "37px 23px",
                        width: "350px",
                        textAlign: "center",
                        alignItems: "center",
                    }}
                >
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <Typography variant="h6">
                            <b>Are you sure? Do you want to edit the details?</b>
                        </Typography>
                    </>
                    <br /><br />
                    <Grid sx={{ display: "flex", justifyContent: "center", gap: "150px" }}>
                        <Grid>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    setAddOpenalertPersonal(false)
                                }
                                }
                                type="button"
                                sx={userStyle.btncancel}
                            >
                                Cancel
                            </Button>
                        </Grid> <Grid>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={(params) => {
                                    setIsPersonalInfoOpenEdit(true)
                                }
                                }
                                type="button"
                                sx={{
                                    height: "40px",
                                    width: "60px",
                                    padding: "6px 10px",
                                }}
                            >
                                Edit
                            </Button>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
            {/* Are you sure? Do you want to edit the details? For Reference Details */}
            <Dialog
                open={isAddOpenalertReference}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent
                    sx={{
                        padding: "37px 23px",
                        width: "350px",
                        textAlign: "center",
                        alignItems: "center",
                    }}
                >
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <Typography variant="h6">
                            <b>Are you sure? Do you want to edit the details?</b>
                        </Typography>
                    </> <br /><br />
                    <Grid sx={{ display: "flex", justifyContent: "center", gap: "150px" }}>
                        <Grid>
                            <Button
                                variant="contained"
                                // color="primary"
                                onClick={() => {
                                    setAddOpenalertReference(false)
                                }
                                }
                                type="button"
                                sx={userStyle.btncancel}
                            >
                                Cancel
                            </Button>
                        </Grid> <Grid>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setIsReferenceOpenEdit(true)
                                }
                                type="button"
                                sx={{
                                    height: "40px",
                                    width: "60px",
                                    padding: "6px 10px",
                                }}
                            >
                                Edit
                            </Button>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
            {/* Are you sure For Permanent Address */}
            <Dialog
                open={isAddOpenalertPermanant}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent
                    sx={{
                        padding: "37px 23px",
                        width: "350px",
                        textAlign: "center",
                        alignItems: "center",
                    }}
                >
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <Typography variant="h6">
                            <b>Are you sure? Do you want to edit the details?</b>
                        </Typography>
                    </>
                    <br /><br />
                    <Grid sx={{ display: "flex", justifyContent: "center", gap: "150px" }}>
                        <Grid>
                            <Button
                                variant="contained"
                                // color="primary"
                                onClick={() => {
                                    setAddOpenalertPermanant(false)
                                }
                                }
                                type="button"
                                sx={userStyle.btncancel}
                            >
                                Cancel
                            </Button>
                        </Grid>
                        <Grid>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setIsPermanantAddressOpenEdit(true)
                                }
                                type="button"
                                sx={{
                                    height: "40px",
                                    width: "60px",
                                    padding: "6px 10px",
                                }}
                            >
                                Edit
                            </Button>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
            {/* Are You Sure For Current Address */}
            <Dialog
                open={isAddOpenalertCurrent}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent
                    sx={{
                        padding: "37px 23px",
                        width: "350px",
                        textAlign: "center",
                        alignItems: "center",
                    }}
                >
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <Typography variant="h6">
                            <b>Are you sure? Do you want to edit the details?</b>
                        </Typography>
                    </>
                    <br /><br />
                    <Grid sx={{ display: "flex", justifyContent: "center", gap: "150px" }}>
                        <Grid>
                            <Button
                                variant="contained"
                                // color="primary"
                                onClick={() => {
                                    setAddOpenalertCurrent(false)
                                }
                                }
                                type="button"
                                sx={userStyle.btncancel}
                            >
                                Cancel
                            </Button>
                        </Grid>
                        <Grid>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setIsCurrentAddressOpenEdit(true)
                                }
                                type="button"
                                sx={{
                                    height: "40px",
                                    width: "60px",
                                    padding: "6px 10px",
                                }}
                            >
                                Edit
                            </Button>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
            {/* Are you sure? Do you want to edit the details? For Document List*/}
            <Dialog
                open={isAddOpenalertDocument}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent
                    sx={{
                        padding: "37px 23px",
                        width: "350px",
                        textAlign: "center",
                        alignItems: "center",
                    }}
                >
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <Typography variant="h6">
                            <b>Are you sure? Do you want to edit the details?</b>
                        </Typography>
                    </>
                    <br /><br />
                    <Grid sx={{ display: "flex", justifyContent: "center", gap: "150px" }}>
                        <Grid>
                            <Button
                                variant="contained"
                                // color="primary"
                                onClick={() => {
                                    setAddOpenalertDocument(false)
                                }
                                }
                                type="button"
                                sx={userStyle.btncancel}
                            >
                                Cancel
                            </Button>
                        </Grid>
                        <Grid>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setIsDocumentListOpenEdit(true)
                                }
                                type="button"
                                sx={{
                                    height: "40px",
                                    width: "60px",
                                    padding: "6px 10px",
                                }}
                            >
                                Edit
                            </Button>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
            {/* Are you sure? Do you want to edit the details? For Educational Qualification */}
            <Dialog
                open={isAddOpenalertEducational}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent
                    sx={{
                        padding: "37px 23px",
                        width: "350px",
                        textAlign: "center",
                        alignItems: "center",
                    }}
                >
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <Typography variant="h6">
                            <b>Are you sure? Do you want to edit the details?</b>
                        </Typography>
                    </>
                    <br /><br />
                    <Grid sx={{ display: "flex", justifyContent: "center", gap: "150px" }}>
                        <Grid>
                            <Button
                                variant="contained"
                                // color="primary"
                                onClick={() => {
                                    setAddOpenalertEducational(false)
                                }
                                }
                                type="button"
                                sx={userStyle.btncancel}
                            >
                                Cancel
                            </Button>
                        </Grid>
                        <Grid>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setIsEducationalQualifyOpenEdit(true)
                                }
                                type="button"
                                sx={{
                                    height: "40px",
                                    width: "60px",
                                    padding: "6px 10px",
                                }}
                            >
                                Edit
                            </Button>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
            {/* Are you sure? Do you want to edit the details? For Additional Qualification */}
            <Dialog
                open={isAddOpenalertAdditional}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent
                    sx={{
                        padding: "37px 23px",
                        width: "350px",
                        textAlign: "center",
                        alignItems: "center",
                    }}
                >
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <Typography variant="h6">
                            <b>Are you sure? Do you want to edit the details?</b>
                        </Typography>
                    </>
                    <br /><br />
                    <Grid sx={{ display: "flex", justifyContent: "center", gap: "150px" }}>
                        <Grid>
                            <Button
                                variant="contained"
                                // color="primary"
                                onClick={() => {
                                    setAddOpenalertAdditional(false)
                                }
                                }
                                type="button"
                                sx={userStyle.btncancel}
                            >
                                Cancel
                            </Button>
                        </Grid>
                        <Grid>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setIsAdditionalQualifyOpenEdit(true)
                                }
                                type="button"
                                sx={{
                                    height: "40px",
                                    width: "60px",
                                    padding: "6px 10px",
                                }}
                            >
                                Edit
                            </Button>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
            {/* Are You Sure For Work History */}
            <Dialog
                open={isAddOpenalertWork}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent
                    sx={{
                        padding: "37px 23px",
                        width: "350px",
                        textAlign: "center",
                        alignItems: "center",
                    }}
                >
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <Typography variant="h6">
                            <b>Are you sure? Do you want to edit the details?</b>
                        </Typography>
                    </>
                    <br /><br />
                    <Grid sx={{ display: "flex", justifyContent: "center", gap: "150px" }}>
                        <Grid>
                            <Button
                                variant="contained"
                                // color="primary"
                                onClick={() => {
                                    setAddOpenalertWork(false)
                                }
                                }
                                type="button"
                                sx={userStyle.btncancel}
                            >
                                Cancel
                            </Button>
                        </Grid>
                        <Grid>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setIsWorkHistoryOpenEdit(true)
                                }
                                type="button"
                                sx={{
                                    height: "40px",
                                    width: "60px",
                                    padding: "6px 10px",
                                }}
                            >
                                Edit
                            </Button>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
            {/* Are You Sure For Bank Details*/}
            <Dialog
                open={isAddOpenalertBank}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent
                    sx={{
                        padding: "37px 23px",
                        width: "350px",
                        textAlign: "center",
                        alignItems: "center",
                    }}
                >
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <Typography variant="h6">
                            <b>Are you sure? Do you want to edit the details?</b>
                        </Typography>
                    </><br /><br />
                    <Grid sx={{ display: "flex", justifyContent: "center", gap: "150px" }}>
                        <Grid>
                            <Button
                                variant="contained"
                                // color="primary"
                                onClick={() => {
                                    setAddOpenalertBank(false)
                                }
                                }
                                type="button"
                                sx={userStyle.btncancel}
                            >
                                Cancel
                            </Button>
                        </Grid>
                        <Grid>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setIsBankDetailsOpenEdit(true)
                                }
                                type="button"
                                sx={{
                                    height: "40px",
                                    width: "60px",
                                    padding: "6px 10px",
                                }}
                            >
                                Edit
                            </Button>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
            {/* Correct Popup */}
            <Dialog
                open={isCorrect}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogContent
                    sx={{
                        padding: "37px 23px",
                        width: "350px",
                        textAlign: "center",
                        alignItems: "center",
                    }}               >
                    <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <Typography variant="h6">
                        <b>Thanks For Your Verification!</b>
                    </Typography>
                    <br /><br />
                </DialogContent>
            </Dialog>
            <>
                <div >
                    <Modal
                        open={ifscModalOpen}
                        onClose={handleModalClose}
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                    >
                        <div
                            style={{
                                margin: "auto",
                                backgroundColor: "white",
                                padding: "20px",
                                maxWidth: "500px",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Typography variant="h6">Enter IFSC Code</Typography>
                                <IconButton onClick={handleModalClose}>
                                    <CloseIcon />
                                </IconButton>
                            </div>
                            <OutlinedInput
                                type="text"
                                placeholder="Enter IFSC Code"
                                name="ifscCode"
                                style={{ height: "30px", margin: "10px" }}
                                value={allInformationEdit.ifscCode}
                                onChange={handleInputChange}
                            />
                            <LoadingButton
                                variant="contained"
                                // loading={loading}
                                color="primary"
                                sx={{ borderRadius: "20px", marginLeft: "5px" }}
                                onClick={fetchBankDetails}
                            >
                                Get Branch
                            </LoadingButton>
                            <br />
                            {bankDetails && (
                                <div>
                                    <Typography variant="subtitle1">
                                        Bank Name: {bankDetails.BANK}
                                    </Typography>
                                    <Typography variant="subtitle1">
                                        Branch Name: {bankDetails.BRANCH}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        sx={{ borderRadius: "20px", padding: "0 10px" }}
                                        onClick={(e) => {
                                            const matchedBank = accounttypes.find((bank) => {
                                                const labelBeforeHyphen = bank.label.split(" - ")[0];
                                                return (
                                                    labelBeforeHyphen.toLowerCase()?.trim() ===
                                                    bankDetails.BANK.toLowerCase()?.trim()
                                                );
                                            });
                                            setAllInformationEdit({
                                                ...allInformationEdit,
                                                bankbranchname: String(bankDetails.BRANCH),
                                                ifsccode: allInformationEdit.ifscCode,
                                                bankname: matchedBank?.value,
                                            });
                                            handleModalClose();
                                        }}
                                    >
                                        Submit
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Modal>
                </div>
            </>
            <ExportData
                isFilterOpen={isFilterOpen}
                handleCloseFilterMod={handleCloseFilterMod}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen}
                isPdfFilterOpen={isPdfFilterOpen}
                setIsPdfFilterOpen={setIsPdfFilterOpen}
                handleClosePdfFilterMod={handleClosePdfFilterMod}
                filteredDataTwo={rowDataTable ?? []}
                itemsTwo={employees ?? []}
                filename={"My Verification List "}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            <Loader loading={loading} message={loadingMessage} />
        </Box >
    );
}
export default MyVerification;