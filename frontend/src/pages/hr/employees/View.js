import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  InputLabel,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Paper,
  Table,
  TableHead,
  TableContainer,
  Button,
  TableBody,
  TextField,
  FormGroup,
} from "@mui/material";
import moment from "moment-timezone";
import FormControlLabel from "@mui/material/FormControlLabel";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Checkbox from "@mui/material/Checkbox";
import { userStyle } from "../../../pageStyle";
import { handleApiError } from "../../../components/Errorhandling";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import { SERVICE } from "../../../services/Baseservice";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { Country, State, City } from "country-state-city";
import "cropperjs/dist/cropper.css";
import "react-image-crop/dist/ReactCrop.css";
import "./MultistepForm.css";
import { FaArrowAltCircleRight } from "react-icons/fa";
import {
  UserRoleAccessContext,
  AuthContext,
} from "../../../context/Appcontext";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import Headtitle from "../../../components/Headtitle";
import { green } from "@mui/material/colors";
import { MultiSelect } from "react-multi-select-component";

function MultistepForm() {
  const [step, setStep] = useState(1);

  const timer = useRef();

  const [todo, setTodo] = useState([]);

  const [employee, setEmployee] = useState({
    wordcheck: false,
    shiftgrouping: "",
    prefix: "Mr",
    firstname: "",
    lastname: "",
    legalname: "",
    fathername: "",
    mothername: "",
    gender: "",
    maritalstatus: "",
    dom: "",
    dob: "",
    bloodgroup: "",
    profileimage: "",
    location: "",
    email: "",
    contactpersonal: "",
    contactfamily: "",
    emergencyno: "",
    doj: "",
    dot: "",
    name: "",
    contactno: "",
    details: "",
    username: "",
    password: "",
    companyname: "",
    pdoorno: "",
    pstreet: "",
    parea: "",
    plandmark: "",
    ptaluk: "",
    ppost: "",
    ppincode: "",
    pcountry: "",
    pstate: "",
    pcity: "",
    cdoorno: "",
    cstreet: "",
    carea: "",
    clandmark: "",
    ctaluk: "",
    cpost: "",
    cpincode: "",
    ccountry: "",
    cstate: "",
    ccity: "",
    branch: "",
    workstation: "",
    weekoff: "",
    unit: "",
    floor: "",
    department: "",
    team: "",
    designation: "",
    shifttiming: "",
    reportingto: "",
    empcode: "",
    remark: "",
    aadhar: "",
    panno: "",
    draft: "",
    intStartDate: "",
    intEndDate: "",
    intCourse: "",
    bankname: "ICICI BANK LTD",
    workmode: "Please Select Work Mode",
    bankbranchname: "",
    accountholdername: "",
    accountnumber: "",
    ifsccode: "",

    categoryedu: "Please Select Category",
    subcategoryedu: "Please Select Sub Category",
    specialization: "Please Select Specialization",
  });

  const [assignExperience, setAssignExperience] = useState({
    expval: "",
    expmode: "",
    endexp: "",
    endexpdate: "",
    endtar: "",
    endtardate: "",
    updatedate: "",
  });

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

  const [allUsersLoginName, setAllUsersLoginName] = useState([]);

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [primaryWorkStation, setPrimaryWorkStation] = useState(
    "Please Select Primary Work Station"
  );

  const [primaryWorkStationInput, setPrimaryWorkStationInput] = useState("");

  const [selectedWorkStation, setSelectedWorkStation] = useState("");
  const [selectedOptionsWorkStation, setSelectedOptionsWorkStation] = useState(
    []
  );

  const [enableWorkstation, setEnableWorkstation] = useState(false);
  const [enableLoginName, setEnableLoginName] = useState(true);
  const [valueWorkStation, setValueWorkStation] = useState([]);
  const [employeecodenew, setEmployeecodenew] = useState("");
  const [checkcode, setCheckcode] = useState(false);

  // week off details
  const [selectedOptionsCate, setSelectedOptionsCate] = useState([]);
  let [valueCate, setValueCate] = useState("");

  let skno = 1;
  let eduno = 1;

  const id = useParams().id;
  const from = useParams().from;
  const [backPath, setBackPath] = useState("");
  const [headTitle, setHeadTitle] = useState("");

  useEffect(() => {
    switch (from) {
      case "employee":
        setBackPath("/list");
        setHeadTitle("EMPLOYEE VIEW");
        break;
      case "intern":
        setBackPath("/internlist");
        setHeadTitle("INTERN VIEW");
        break;
      case "deactivateemployeelist":
        setBackPath("/updatepages/deactivateemployeeslistview");
        setHeadTitle("DEACTIVATE EMPLOYEE VIEW");
        break;
      case "deactivateinternlist":
        setBackPath("/deactivateinternlistview");
        setHeadTitle("DEACTIVATE INTERN VIEW");
        break;
    }
  }, []);

  const [files, setFiles] = useState([]);

  const handleRemarkChange = (index, remark) => {
    setFiles((prevFiles) =>
      prevFiles.map((file, i) => (i === index ? { ...file, remark } : file))
    );
  };

  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };
  const [errmsg, setErrmsg] = useState("");

  const [errors, setErrors] = useState({});
  const [errorsLog, setErrorsLog] = useState({});
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isPasswordChange, setIsPasswordChange] = useState(false);

  const validateEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    let emailvalue = email ? email : employee.email;
    return regex.test(emailvalue);
  };

  const { auth } = useContext(AuthContext);
  const { isUserRoleCompare, isUserRoleAccess } = useContext(
    UserRoleAccessContext
  );

  const [selectedCountryp, setSelectedCountryp] = useState(null);
  const [selectedStatep, setSelectedStatep] = useState(null);
  const [selectedCityp, setSelectedCityp] = useState(null);

  const [selectedCountryc, setSelectedCountryc] = useState(null);
  const [selectedStatec, setSelectedStatec] = useState(null);
  const [selectedCityc, setSelectedCityc] = useState(null);

  const [message, setErrorMessage] = useState("");
  const [usernameaddedby, setUsernameaddedby] = useState("");

  let sno = 1;

  const [eduTodo, setEduTodo] = useState([]);

  const [addAddQuaTodo, setAddQuaTodo] = useState("");

  const [workhistTodo, setWorkhistTodo] = useState("");

  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [third, setThird] = useState("");

  const [bankTodo, setBankTodo] = useState([]);

  const [croppedImage, setCroppedImage] = useState("");

  const [oldData, setOldData] = useState({
    company: "",
    branch: "",
    unit: "",
    team: "",
  });

  const [loginNotAllot, setLoginNotAllot] = useState({
    process: "Please Select Process",
    processtype: "Primary",
    processduration: "Full",

    time: "Hrs",
    timemins: "Mins",
  });

  const [overallgrosstotal, setoverallgrosstotal] = useState("");
  const [modeexperience, setModeexperience] = useState("");
  const [targetexperience, setTargetexperience] = useState("");
  const [targetpts, setTargetpts] = useState("");
  const [accessibleTodo, setAccessibleTodo] = useState([]);

  const fetchHandlerEdit = async () => {
    try {
      let response = await axios.get(`${SERVICE.USER_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let responsenew = await axios.post(
        SERVICE.EMPLOYEEDOCUMENT_SINGLEWITHALLBYCOMMONID,
        {
          commonid: id,
        }
      );
      const savedEmployee = {
        ...response?.data?.suser,
        ...responsenew?.data?.semployeedocument,
      };
      setAssignExperience((prev) => ({
        ...prev,
        ...savedEmployee.assignExpLog[0],
      }));

      setBankTodo(response?.data?.suser?.bankdetails);

      setReferenceTodo(response?.data?.suser?.referencetodo);

      setFirst(
        response?.data?.suser?.firstname?.toLowerCase().split(" ").join("")
      );
      setSecond(
        response?.data?.suser?.lastname?.toLowerCase().split(" ").join("")
      );

      setoverallgrosstotal(response?.data?.suser.grosssalary);
      setTodo(response?.data?.suser?.boardingLog[0]?.todo);
      setModeexperience(response?.data?.suser.modeexperience);
      setTargetexperience(response?.data?.suser.targetexperience);
      setTargetpts(response?.data?.suser.targetpts);
      setLoginNotAllot(response?.data?.suser);

      // Find the corresponding Country, State, and City objects
      const country = Country.getAllCountries().find(
        (country) => country.name === savedEmployee.ccountry
      );
      const state = State.getStatesOfCountry(country?.isoCode).find(
        (state) => state.name === savedEmployee.cstate
      );
      const city = City.getCitiesOfState(
        state?.countryCode,
        state?.isoCode
      ).find((city) => city.name === savedEmployee.ccity);

      // Find the corresponding Country, State, and City objects
      const countryp = Country.getAllCountries().find(
        (country) => country.name === savedEmployee.pcountry
      );
      const statep = State.getStatesOfCountry(country?.isoCode).find(
        (state) => state.name === savedEmployee.pstate
      );
      const cityp = City.getCitiesOfState(
        state?.countryCode,
        state?.isoCode
      ).find((city) => city.name === savedEmployee.pcity);

      setSelectedCityc(city);
      setSelectedCountryc(country);
      setSelectedStatec(state);
      setSelectedCountryp(countryp);
      setSelectedStatep(statep);
      setSelectedCityp(cityp);
      setEmployee(savedEmployee);
      setEnableLoginName(response?.data?.suser?.usernameautogenerate);

      fetchAccessibleDetails(
        response?.data?.suser.companyname,
        response?.data?.suser.empcode
      );

      setFiles(responsenew?.data?.semployeedocument?.files);
      setEduTodo(response?.data?.suser?.eduTodo);
      setAddQuaTodo(response?.data?.suser?.addAddQuaTodo);
      setWorkhistTodo(response?.data?.suser?.workhistTodo);
      setIsValidEmail(validateEmail(response?.data?.suser?.email));
      setSelectedCompany(response?.data?.suser?.company);
      setSelectedBranch(response?.data?.suser?.branch);
      setSelectedUnit(response?.data?.suser?.unit);

      setSelectedDesignation(response?.data?.suser?.designation);
      setSelectedTeam(response?.data?.suser?.team);
      setEnableWorkstation(response?.data?.suser?.enableworkstation);
      setPrimaryWorkStation(
        response?.data?.suser?.workstation[0] ===
          "Please Select Primary Work Station"
          ? ""
          : response?.data?.suser?.workstation[0]
      );
      setPrimaryWorkStationInput(response?.data?.suser?.workstationinput);
      setSelectedWorkStation(response?.data?.suser?.workstation.slice(1));
      setSelectedOptionsWorkStation(
        Array.isArray(response?.data?.suser?.workstation)
          ? response?.data?.suser?.workstation.slice(1).map((x) => ({
            ...x,
            label: x,
            value: x,
          }))
          : []
      );
      setSelectedWorkStation(
        response?.data?.suser?.workstation.slice(
          1,
          response?.data?.suser?.workstation?.length
        )
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
      setSelectedOptionsCate(
        Array.isArray(response?.data?.suser?.boardingLog[0]?.weekoff)
          ? response?.data?.suser?.boardingLog[0]?.weekoff?.map((x) => ({
            ...x,
            label: x,
            value: x,
          }))
          : []
      );
      setEmployee({
        ...savedEmployee,
        empcode: savedEmployee.wordcheck === true ? "" : savedEmployee.empcode,
        panstatus: savedEmployee?.panno
          ? "Have PAN"
          : savedEmployee?.panrefno
            ? "Applied"
            : "Yet to Apply",
        age: calculateAge(savedEmployee?.dob),
        callingname:
          savedEmployee?.callingname === "" ||
            savedEmployee?.callingname == undefined
            ? savedEmployee?.legalname
            : savedEmployee?.callingname,
      });
      setEmployeecodenew(
        savedEmployee.wordcheck === true ? savedEmployee.empcode : ""
      );
      setCheckcode(savedEmployee.wordcheck);

      setValueWorkStation(
        response?.data?.suser?.workstation.slice(
          1,
          response?.data?.suser?.workstation.length
        )
      );

      setValueCate(response?.data?.suser?.boardingLog[0]?.weekoff);
      setOldData({
        ...oldData,
        empcode: response?.data?.suser?.empcode,
        company: response?.data?.suser?.company,
        unit: response?.data?.suser?.unit,
        branch: response?.data?.suser?.branch,
        team: response?.data?.suser?.team,
      });
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [getunitname, setgetunitname] = useState("");
  let branch = getunitname ? getunitname : employee.branch;

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };
  const [getbranchname, setgetbranchname] = useState("");
  let branchname = getbranchname ? setgetbranchname : employee.company;

  const [name, setUserNameEmail] = useState("");
  const [reportingtonames, setreportingtonames] = useState([]);

  const backPage = useNavigate();

  //webcam

  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [getImg, setGetImg] = useState(null);
  const [isWebcamCapture, setIsWebcamCapture] = useState(false);

  //id for login

  let loginid = localStorage.LoginUserId;
  //get user row  edit  function
  const getusername = async () => {
    try {
      let res = await axios.get(`${SERVICE.USER}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let user =
        res.data.users.length > 0 &&
        res.data.users.filter((data) => {
          if (loginid === data?._id) {
            setUsernameaddedby(data?.username);
            return data;
          }
        });
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [referenceTodo, setReferenceTodo] = useState([]);
  const [referenceTodoError, setReferenceTodoError] = useState({});
  const [singleReferenceTodo, setSingleReferenceTodo] = useState({
    name: "",
    relationship: "",
    occupation: "",
    contact: "",
    details: "",
  });

  // let capture = isWebcamCapture == true ? getImg : croppedImage;

  let final = croppedImage ? croppedImage : employee.profileimage;

  useEffect(() => {
    // fetchCompanies();
    // fetchfloorNames();
    // fetchDepartments();
    // fetchteamdropdowns();
    // fetchShiftDropdowns();
    // fetchWorkStation();
    // fetchDesignation();
    // fetchSkillSet();
    fetchHandlerEdit();
    // fetchInternCourses();
    // fetchUsernames();
  }, []);

  useEffect(() => {
    getusername();
  }, []);

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

  const isImages = (fileName) => {
    return /\.png$/i.test(fileName);
  };

  const isImage = (fileName) => {
    return /\.jpeg$|\.jpg$/i.test(fileName);
  };

  const isPdf = (fileName) => {
    return /\.pdf$/i.test(fileName);
  };

  const isExcel = (fileName) => {
    return /\.xlsx?$/i.test(fileName);
  };

  function isTxt(fileName) {
    return /\.txt$/.test(fileName);
  }

  let conditions = [
    employee.prefix !== "",
    employee.firstname !== "",
    employee.lastname !== "",
    employee.legalname !== "",
    employee.fathername !== "",
    employee.mothername !== "",
    employee.gender !== "",
    employee.maritalstatus !== "",
    employee.maritalstatus === "Married" &&
    employee.dom !== "" &&
    employee.dob !== "",
    employee.bloodgroup !== "",
    employee.profileimage !== "",
    employee.location !== "",
    employee.email !== "",
    employee.contactpersonal !== "",
    employee.contactfamily !== "",
    employee.emergencyno !== "",
    employee.doj !== "",
    employee.dot !== "",
    employee.aadhar !== "",
    employee.panno !== "",

    employee.contactno !== "",
    employee.details !== "",

    employee.username !== "",
    employee.password !== "",
    employee.companyname !== "",

    employee.company !== "",
    employee.branch !== "",
    employee.unit !== "",
    employee.floor !== "",
    employee.department !== "",
    employee.team !== "",
    employee.designation !== "",
    employee.shifttiming !== "",
    employee.reportingto !== "",
    employee.empcode !== "",

    employee.pdoorno !== "",
    employee.pstreet !== "",
    employee.parea !== "",
    employee.plandmark !== "",
    employee.ptaluk !== "",
    employee.ppincode !== "",
    employee.ppost !== "",
    selectedCountryp !== "",
    selectedStatep !== "",
    selectedCityp !== "",
    !employee.samesprmnt ? employee.cdoorno : employee.pdoorno !== "",
    !employee.samesprmnt ? employee.cstreet : employee.pstreet !== "",
    !employee.samesprmnt ? employee.carea : employee.parea !== "",
    !employee.samesprmnt ? employee.clandmark : employee.plandmark !== "",
    !employee.samesprmnt ? employee.ctaluk : employee.ptaluk !== "",
    !employee.samesprmnt ? employee.cpost : employee.ppost !== "",
    !employee.samesprmnt ? employee.cpincode : employee.ppincode !== "",
    // !employee.samesprmnt ? selectedCountryc.name : selectedCountryp.name !== "",
    // !employee.samesprmnt ? selectedStatec.name : selectedStatep.name !== "",
    // !employee.samesprmnt ? selectedCityc.name : selectedCityp.name !== "",

    files.length > 0,
    addAddQuaTodo.length > 0,
    eduTodo.length > 0,
    workhistTodo.length > 0,
  ];

  const result = conditions.reduce(
    (acc, val) => {
      acc[val]++;
      return acc;
    },
    { true: 0, false: 0 }
  );

  const totalFields = 61;
  const filledFields = Object.values(employee).filter(
    (value) => value !== ""
  ).length;

  const completionPercentage = (result.true / totalFields) * 100;

  //branch updatedby edit page....
  let updateby = employee.updatedby;

  const nextStep = () => {
    setStep(step + 1);
  };

  //login detail validation
  const nextStepLog = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const renderStepOne = () => {
    return (
      <>
        <Headtitle title={headTitle} />
        <Grid container spacing={2}>
          <Grid item md={1} xs={12} sm={12} container alignItems="center">

          </Grid>
          <Grid item md={10} xs={12} sm={12}>
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
                          <OutlinedInput value={employee.prefix} readOnly={true} />
                        </FormControl>
                      </Grid>
                      <Grid item md={9} sm={9} xs={9}>
                        <FormControl size="small" fullWidth>
                          <OutlinedInput
                            readOnly={true}
                            value={employee.firstname}
                          />
                        </FormControl>
                        {errors.firstname && <div>{errors.firstname}</div>}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Last Name</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        value={employee.lastname}
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
                        value={employee.legalname}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Calling Name</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        readOnly
                        value={employee.callingname}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Father Name</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        readOnly
                        value={employee.fathername}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Mother Name</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        value={employee.mothername}
                        readOnly
                      />
                    </FormControl>
                  </Grid>

                  {/* <Grid container spacing={2}> */}
                  <Grid item md={9} sm={12} xs={12}>
                    <Grid container spacing={2}>
                      <Grid item md={4} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Gender</Typography>

                          <OutlinedInput
                            id="component-outlined"
                            value={employee.gender}
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
                            value={employee.maritalstatus}
                            readOnly
                            type="text"
                            size="small"
                            name="dom"
                          />
                        </FormControl>
                      </Grid>
                      {employee.maritalstatus === "Married" && (
                        <Grid item md={4} sm={6} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Date Of Marriage</Typography>
                            <OutlinedInput
                              id="component-outlined"
                              value={
                                employee.dom
                                  ? moment(employee.dom)?.format("DD-MM-YYYY")
                                  : ""
                              }
                              readOnly
                              type="text"
                              size="small"
                              name="dom"
                            />
                          </FormControl>
                          {errors.dom && <div>{errors.dom}</div>}
                        </Grid>
                      )}
                      <Grid item md={2.5} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Date Of Birth</Typography>
                          <OutlinedInput
                            id="component-outlined"
                            value={
                              employee.dob
                                ? moment(employee.dob)?.format("DD-MM-YYYY")
                                : ""
                            }
                            readOnly
                            type="text"
                            size="small"
                            name="dob"
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
                            value={employee.dob === "" ? "" : employee?.age}
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
                            value={employee.bloodgroup}
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
                            value={employee.email}
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
                            value={employee.location}
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
                            value={employee.contactpersonal}
                            readOnly
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
                            value={employee.contactfamily}
                            readOnly
                          />
                        </FormControl>
                        {errors.contactfamily && <div>{errors.contactfamily}</div>}
                      </Grid>
                      <Grid item md={4} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Emergency No</Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="number"
                            sx={userStyle.input}
                            placeholder="Emergency No (Emergency)"
                            value={employee.emergencyno}
                            readOnly
                          />
                        </FormControl>
                        {errors.emergencyno && <div>{errors.emergencyno}</div>}
                      </Grid>
                      <Grid item md={4} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Aadhar No</Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="Number"
                            sx={userStyle.input}
                            placeholder="Aadhar No"
                            value={employee.aadhar}
                            readOnly
                          />
                        </FormControl>
                        {errors.aadhar && <div>{errors.aadhar}</div>}
                      </Grid>
                      <Grid item md={4} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>PAN Card Status</Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            placeholder="Pan No"
                            value={employee.panstatus}
                            readOnly
                          />
                        </FormControl>
                      </Grid>
                      {employee?.panstatus === "Have PAN" && (
                        <Grid item md={4} sm={6} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Pan No</Typography>

                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Pan No"
                              value={employee.panno}
                              readOnly
                            />
                          </FormControl>
                          {errors.panno && <div>{errors.panno}</div>}
                        </Grid>
                      )}
                      {employee?.panstatus === "Applied" && (
                        <Grid item md={4} sm={6} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Application Ref No</Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Pan No"
                              value={employee.panrefno}
                              readOnly
                            />
                          </FormControl>
                          {errors.panrefno && <div>{errors.panrefno}</div>}
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                  <Grid item lg={3} md={3} sm={12} xs={12}>
                    <InputLabel sx={{ m: 1 }}>Profile Image</InputLabel>
                    <img
                      style={{ height: 120 }}
                      src={
                        croppedImage === "" ? employee.profileimage : croppedImage
                      }
                      alt=""
                    />
                  </Grid>
                </Grid>
              </>
              <br />
            </Box>
            <br />
          </Grid>
          <Grid item md={1} xs={12} sm={12} container alignItems="center">
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
                flexWrap: 'wrap',
              }}
            >

              <Link
                to={backPath}
                style={{
                  textDecoration: "none",
                  color: "white",
                  // float: "right",
                  marginRight: "0px"
                }}
              >
                <Button
                  sx={{
                    ...userStyle.btncancel,
                    textTransform: "capitalize",
                    width: "73px",

                  }}
                >Cancel</Button>
              </Link>
              <Button className="next"
                variant="contained"
                size="small"
                sx={{
                  textTransform: "capitalize",
                  width: "73px",
                }}
                onClick={nextStep}
              >
                Next
              </Button>
            </Box>
          </Grid>
        </Grid>
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
              <Typography variant="h6">{message}</Typography>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                color="error"
                onClick={handleCloseerr}
              >
                ok
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </>
    );
  };

  const renderStepTwo = () => {
    return (
      <>
        <Headtitle title={headTitle} />
        <Grid container spacing={2}>
          <Grid item md={1} xs={12} sm={12} container alignItems="center">
            <Button className="prev" variant="contained"
              size="small"
              sx={{
                textTransform: "capitalize",
                width: "73px",
              }}
              onClick={prevStep}>
              Previous
            </Button>
          </Grid>
          <Grid item md={10} xs={12} sm={12}>
            <Box sx={userStyle.selectcontainer}>
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>
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
                              <StyledTableCell>{row.name}</StyledTableCell>
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
              </Grid>{" "}
              <br />
            </Box>
            <br />
            <Box sx={userStyle.selectcontainer}>
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  Login Details{" "}
                </Typography>
                <br />
              </Grid>
              <Grid container spacing={2}>
                <Grid item md={4} sm={6} xs={12}>
                  {enableLoginName ? (
                    <FormControl size="small" fullWidth>
                      <Typography>Login Name</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="login Name"
                        value={third}
                        readOnly
                      />
                    </FormControl>
                  ) : (
                    <FormControl size="small" fullWidth>
                      <Typography>Login Name</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        readOnly
                        value={employee.username}
                      />
                    </FormControl>
                  )}
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl size="small" fullWidth>
                    <Typography>Password</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="password"
                      // value={employee.password}
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl size="small" fullWidth>
                    <Typography>company Name</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      readOnly
                      value={employee.companyname}
                    />
                  </FormControl>
                </Grid>
              </Grid>{" "}
              <br />
            </Box>
            <br />
            <Box sx={userStyle.dialogbox}>
              <Typography sx={userStyle.importheadtext}>
                Boarding Information
              </Typography>

              <Grid container spacing={2}>
                {isUserRoleAccess.role.includes("Manager") ? (
                  <Grid item md={4} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Status</Typography>
                      <OutlinedInput
                        value={employee.enquirystatus}
                        readOnly={true}
                      />
                    </FormControl>
                  </Grid>
                ) : isUserRoleCompare.includes("lassignenquierypurpose") ? (
                  <Grid item md={4} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Status</Typography>
                      <OutlinedInput
                        value={employee.enquirystatus}
                        readOnly={true}
                      />
                    </FormControl>
                  </Grid>
                ) : (
                  ""
                )}
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Work Mode</Typography>
                    <OutlinedInput value={employee.workmode} readOnly={true} />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>DOJ</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={
                        employee.doj
                          ? moment(employee.doj)?.format("DD-MM-YYYY")
                          : ""
                      }
                      readOnly
                    />
                    {errors.doj && <div>{errors.doj}</div>}
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>DOT</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={
                        employee.dot
                          ? moment(employee.dot)?.format("DD-MM-YYYY")
                          : ""
                      }
                      readOnly
                    />
                  </FormControl>
                </Grid>

                <Grid item md={4} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Company Email</Typography>
                    <TextField
                      id="email"
                      type="email"
                      placeholder="Company Email"
                      value={employee.companyemail}
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Company</Typography>
                    <OutlinedInput value={selectedCompany} readOnly={true} />

                    {/* <OutlinedInput id="component-outlined" type="text" placeholder="Company" readOnly value={selectedCompany} /> */}
                  </FormControl>
                </Grid>

                <Grid item md={4} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Branch</Typography>
                    <OutlinedInput value={selectedBranch} readOnly={true} />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Unit</Typography>
                    <OutlinedInput value={selectedUnit} readOnly={true} />
                  </FormControl>
                </Grid>
            
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Department</Typography>
                    <OutlinedInput value={employee.department} readOnly={true} />
                  </FormControl>
                </Grid>

                <Grid item md={4} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Team</Typography>
                    <OutlinedInput value={selectedTeam} readOnly={true} />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Floor</Typography>
                    <OutlinedInput value={employee.floor} readOnly={true} />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Area</Typography>
                    <OutlinedInput value={employee.area} readOnly={true} />
                  </FormControl>
                </Grid>

                <Grid item md={4} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Designation</Typography>
                    <OutlinedInput value={selectedDesignation} readOnly={true} />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>System Count</Typography>
                    <OutlinedInput value={employee.employeecount} readOnly={true} />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Shift Type</Typography>
                    <OutlinedInput value={employee.shifttype} readOnly={true} />
                  </FormControl>
                </Grid>
                {employee.shifttype === "Standard" ? (
                  <>
                    <Grid item md={4} sm={6} xs={12}>
                      <Typography>Shift Grouping</Typography>
                      <FormControl fullWidth size="small">
                        <OutlinedInput
                          value={employee.shiftgrouping}
                          readOnly={true}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} sm={6} xs={12}>
                      <Typography>Shift</Typography>
                      <FormControl fullWidth size="small">
                        <OutlinedInput
                          value={employee.shifttiming}
                          readOnly={true}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} sm={6} xs={12} sx={{ display: "flex" }}>
                      <FormControl fullWidth size="small">
                        <Typography>Week Off</Typography>
                        {employee?.boardingLog[0]?.weekoff?.length !== 0
                          ? employee?.boardingLog[0]?.weekoff?.map((data, index) => (
                            <Typography>
                              {index + 1}.{data}
                            </Typography>
                          ))
                          : ""}
                      </FormControl>
                    </Grid>
                  </>
                ) : null}

                <Grid item md={12} sm={12} xs={12}>
                  {employee.shifttype === "1 Week Rotation" ? (
                    <>
                      {todo.length > 0 ? (
                        <Grid container spacing={2}>
                          <Grid item md={1.5} sm={12} xs={12}>
                            <Typography>Day</Typography>
                          </Grid>
                          <Grid item md={1.5} sm={12} xs={12}>
                            <Typography>Week</Typography>
                          </Grid>
                          <Grid item md={3} sm={12} xs={12}>
                            <Typography>Shift Mode</Typography>
                          </Grid>
                          <Grid item md={3} sm={12} xs={12}>
                            <Typography>Shift Grouping</Typography>
                          </Grid>
                          <Grid item md={3} sm={12} xs={12}>
                            <Typography>Shift </Typography>
                          </Grid>
                        </Grid>
                      ) : null}
                      {todo &&
                        todo?.map((todo, index) => (
                          <Grid
                            container
                            spacing={2}
                            key={index}
                            sx={{ paddingTop: "5px" }}
                          >
                            <Grid item md={1.5} sm={6} xs={12}>
                              <Typography>{todo.day}</Typography>
                            </Grid>
                            <Grid item md={1.5} sm={6} xs={12}>
                              <Typography>{todo.week}</Typography>
                            </Grid>
                            <Grid item md={3} sm={6} xs={12}>
                              <FormControl fullWidth size="small">
                                <OutlinedInput
                                  value={todo.shiftmode}
                                  readOnly={true}
                                />
                              </FormControl>
                            </Grid>
                            {todo.shiftmode === "Week Off" ? (
                              <Grid item md={6} sm={6} xs={12}></Grid>
                            ) : (
                              <>
                                <Grid item md={3} sm={6} xs={12}>
                                  <FormControl fullWidth size="small">
                                    <OutlinedInput
                                      value={todo.shiftgrouping}
                                      readOnly={true}
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item md={3} xs={6} sm={6}>
                                  <FormControl fullWidth size="small">
                                    {/* Fetching options */}
                                    <OutlinedInput
                                      value={todo.shifttiming}
                                      type="text"
                                      readOnly
                                    />
                                  </FormControl>
                                </Grid>
                              </>
                            )}
                          </Grid>
                        ))}
                    </>
                  ) : null}

                  {employee.shifttype === "2 Week Rotation" ? (
                    <>
                      {todo.length > 0 ? (
                        <Grid container spacing={2}>
                          <Grid item md={1.5} sm={12} xs={12}>
                            <Typography>Day</Typography>
                          </Grid>
                          <Grid item md={1.5} sm={12} xs={12}>
                            <Typography>Week</Typography>
                          </Grid>
                          <Grid item md={3} sm={12} xs={12}>
                            <Typography>Shift Mode</Typography>
                          </Grid>
                          <Grid item md={3} sm={12} xs={12}>
                            <Typography>Shift Grouping</Typography>
                          </Grid>
                          <Grid item md={3} sm={12} xs={12}>
                            <Typography>Shift </Typography>
                          </Grid>
                        </Grid>
                      ) : null}
                      {todo &&
                        todo?.map((todo, index) => (
                          <Grid container spacing={2} key={index}>
                            <Grid item md={1.5} sm={6} xs={12}>
                              <Typography>{todo.day}</Typography>
                            </Grid>
                            <Grid item md={1.5} sm={6} xs={12}>
                              <Typography>{todo.week}</Typography>
                            </Grid>
                            <Grid item md={3} sm={6} xs={12}>
                              <FormControl fullWidth size="small">
                                <OutlinedInput
                                  value={todo.shiftmode}
                                  readOnly={true}
                                />
                              </FormControl>
                            </Grid>
                            {todo.shiftmode === "Week Off" ? (
                              <Grid item md={6} sm={6} xs={12}></Grid>
                            ) : (
                              <>
                                <Grid item md={3} sm={6} xs={12}>
                                  <FormControl fullWidth size="small">
                                    {" "}
                                    <OutlinedInput
                                      value={todo.shiftgrouping}
                                      readOnly={true}
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item md={3} xs={6} sm={6}>
                                  <FormControl fullWidth size="small">
                                    {/* Fetching options */}
                                    <OutlinedInput
                                      value={todo.shifttiming}
                                      type="text"
                                      readOnly
                                    />
                                  </FormControl>
                                </Grid>
                              </>
                            )}
                          </Grid>
                        ))}
                    </>
                  ) : null}

                  {employee.shifttype === "1 Month Rotation" ? (
                    <>
                      {todo.length > 0 ? (
                        <Grid container spacing={2}>
                          <Grid item md={1.5} sm={12} xs={12}>
                            <Typography>Day</Typography>
                          </Grid>
                          <Grid item md={1.5} sm={12} xs={12}>
                            <Typography>Week</Typography>
                          </Grid>
                          <Grid item md={3} sm={12} xs={12}>
                            <Typography>Shift Mode</Typography>
                          </Grid>
                          <Grid item md={3} sm={12} xs={12}>
                            <Typography>Shift Grouping</Typography>
                          </Grid>
                          <Grid item md={3} sm={12} xs={12}>
                            <Typography>Shift </Typography>
                          </Grid>
                        </Grid>
                      ) : null}
                      {todo &&
                        todo?.map((todo, index) => (
                          <Grid container spacing={2} key={index}>
                            <Grid item md={1.5} sm={6} xs={12}>
                              <Typography>{todo.day}</Typography>
                            </Grid>
                            <Grid item md={1.5} sm={6} xs={12}>
                              <Typography>{todo.week}</Typography>
                            </Grid>
                            <Grid item md={3} sm={6} xs={12}>
                              <FormControl fullWidth size="small">
                                <OutlinedInput
                                  value={todo.shiftmode}
                                  readOnly={true}
                                />
                              </FormControl>
                            </Grid>
                            {todo.shiftmode === "Week Off" ? (
                              <Grid item md={6} sm={6} xs={12}></Grid>
                            ) : (
                              <>
                                <Grid item md={3} sm={6} xs={12}>
                                  <FormControl fullWidth size="small">
                                    <OutlinedInput
                                      value={todo.shiftgrouping}
                                      readOnly={true}
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item md={3} xs={6} sm={6}>
                                  <FormControl fullWidth size="small">
                                    {/* Fetching options */}
                                    <OutlinedInput
                                      value={todo.shifttiming}
                                      type="text"
                                      readOnly
                                    />
                                  </FormControl>
                                </Grid>
                              </>
                            )}
                          </Grid>
                        ))}
                    </>
                  ) : null}

                  {employee.shifttype === "2 Month Rotation" ? (
                    <>
                      {todo.length > 0 ? (
                        <Grid container spacing={2}>
                          <Grid item md={1.5} sm={12} xs={12}>
                            <Typography>Day</Typography>
                          </Grid>
                          <Grid item md={1.5} sm={12} xs={12}>
                            <Typography>Week</Typography>
                          </Grid>
                          <Grid item md={3} sm={12} xs={12}>
                            <Typography>Shift Mode</Typography>
                          </Grid>
                          <Grid item md={3} sm={12} xs={12}>
                            <Typography>Shift Grouping</Typography>
                          </Grid>
                          <Grid item md={3} sm={12} xs={12}>
                            <Typography>Shift </Typography>
                          </Grid>
                        </Grid>
                      ) : null}
                      {todo &&
                        todo?.map((todo, index) => (
                          <Grid container spacing={2} key={index}>
                            <Grid item md={1.5} sm={6} xs={12}>
                              <Typography>{todo.day}</Typography>
                            </Grid>
                            <Grid item md={1.5} sm={6} xs={12}>
                              <Typography>{todo.week}</Typography>
                            </Grid>
                            <Grid item md={3} sm={6} xs={12}>
                              <FormControl fullWidth size="small">
                                <OutlinedInput
                                  value={todo.shiftmode}
                                  readOnly={true}
                                />
                              </FormControl>
                            </Grid>
                            {todo.shiftmode === "Week Off" ? (
                              <Grid item md={6} sm={6} xs={12}></Grid>
                            ) : (
                              <>
                                <Grid item md={3} sm={6} xs={12}>
                                  <FormControl fullWidth size="small">
                                    <OutlinedInput
                                      value={todo.shiftgrouping}
                                      readOnly={true}
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item md={3} xs={6} sm={6}>
                                  <FormControl fullWidth size="small">
                                    {/* Fetching options */}
                                    <OutlinedInput
                                      value={todo.shifttiming}
                                      type="text"
                                      readOnly
                                    />
                                  </FormControl>
                                </Grid>
                              </>
                            )}
                          </Grid>
                        ))}
                    </>
                  ) : null}
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Reporting To</Typography>
                    <OutlinedInput value={employee.reportingto} readOnly={true} />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                  {employee.wordcheck === true ? (
                    <FormControl size="small" fullWidth>
                      <Typography>EmpCode(Manual)</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        // disabled

                        // value={employee.empcode}
                        value={employeecodenew}
                        readOnly
                      />
                    </FormControl>
                  ) : (
                    <FormControl size="small" fullWidth>
                      <Typography>EmpCode(Auto)</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        // disabled
                        readOnly
                        // value={employee.empcode}
                        value={employee.empcode}
                      />
                    </FormControl>
                  )}
                </Grid>

                {employee.workmode !== "Remote" ? (
                  <>
                    {" "}
                    <Grid item md={4} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Work Station (Primary)</Typography>
                        <OutlinedInput value={primaryWorkStation} readOnly={true} />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Work Station (Secondary)</Typography>
                        {selectedOptionsWorkStation.length !== 0
                          ? selectedOptionsWorkStation.map((data, index) => (
                            <Typography>
                              {index + 1}.{data.value}
                            </Typography>
                          ))
                          : ""}
                      </FormControl>
                    </Grid>
                    <Grid item md={4} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>If Office</Typography>
                      </FormControl>
                      <Grid>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={employee.workstationofficestatus === true}
                              />
                            }
                            readObnly
                            label="Work Station Other"
                          />
                        </FormGroup>
                      </Grid>
                    </Grid>
                    <Grid item md={4} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Work Station (WFH)</Typography>
                        <OutlinedInput
                          value={primaryWorkStationInput}
                          readOnly={true}
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : null}

                {employee.workmode === "Remote" ? (
                  <>
                    <Grid item md={4} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Work Station (Primary)</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={employee.workstation[0]}
                          readOnly
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Work Station (Secondary)</Typography>
                        {selectedOptionsWorkStation.length !== 0
                          ? selectedOptionsWorkStation.map((data, index) => (
                            <Typography>
                              {index + 1}.{data.value}
                            </Typography>
                          ))
                          : ""}
                      </FormControl>
                    </Grid>
                    <Grid item md={4} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Work Station (WFH)</Typography>
                        <OutlinedInput
                          value={primaryWorkStationInput}
                          readOnly={true}
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : null}
              </Grid>
            </Box>
            <br />
          </Grid>

          <Grid item md={1} xs={12} sm={12} container alignItems="center">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              flexWrap: 'wrap',
            }}
          >
            <Button className="next"
              variant="contained"
              size="small"
              sx={{
                textTransform: "capitalize !important",
                width: "73px",
              }}
              onClick={nextStepLog}>

              Next
            </Button>

            <Link
              to={backPath}
              style={{
                textDecoration: "none",
                color: "white",
                marginRight: "0px"
              }}
            >
              <Button
                size="small"
                sx={{
                  ...userStyle.btncancel,
                  textTransform: "capitalize",
                  width: "73px",

                }}
              >Cancel</Button>
            </Link>

          </Box>
          </Grid>

        </Grid>
      </>
    );
  };

  const renderStepThree = () => {
    return (
      <>
        <Headtitle title={headTitle} />
        <Grid container spacing={2}>
          <Grid item md={1} xs={12} sm={12} container alignItems="center">
            <Button
              className="prev"
              variant="contained"
              size="small"
              onClick={prevStep}
              sx={{
                textTransform: "capitalize",
                width: "73px",
              }}
            >
              Previous
            </Button>
          </Grid>
          <Grid item md={10} xs={12} sm={12}>
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
                        value={employee.pdoorno}
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
                        value={employee.pstreet}
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
                        value={employee.parea}
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
                        value={employee.plandmark}
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
                        value={employee.ptaluk}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl size="small" fullWidth>
                      <Typography>Post</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={employee.ppost}
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
                        value={employee.ppincode}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl size="small" fullWidth>
                      <Typography>Country</Typography>
                      <OutlinedInput
                        value={selectedCountryp?.name}
                        readOnly={true}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>State</Typography>
                      <OutlinedInput value={selectedStatep?.name} readOnly={true} />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>City</Typography>
                      <OutlinedInput value={selectedCityp?.name} readOnly={true} />
                    </FormControl>
                  </Grid>
                </Grid>
              </>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography sx={userStyle.SubHeaderText}>
                    {" "}
                    Current Address
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <br />
              {!employee.samesprmnt ? (
                <>
                  <Grid container spacing={2}>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Door/Flat No</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          readOnly
                          value={employee.cdoorno}
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
                          value={employee.cstreet}
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
                          value={employee.carea}
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
                          value={employee.clandmark}
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
                          value={employee.ctaluk}
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
                          value={employee.cpost}
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
                          value={employee.cpincode}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Country</Typography>
                        <OutlinedInput
                          value={selectedCountryc?.name}
                          readOnly={true}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <br />
                  <Grid container spacing={2}>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>State</Typography>
                        <OutlinedInput
                          value={selectedStatec?.name}
                          readOnly={true}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>City</Typography>
                        <OutlinedInput value={selectedCityc?.name} readOnly={true} />
                      </FormControl>
                    </Grid>
                  </Grid>
                </>
              ) : (
                // else condition starts here
                <>
                  <Grid container spacing={2}>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Door/Flat No</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          readOnly
                          value={employee.pdoorno}
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
                          value={employee.pstreet}
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
                          value={employee.parea}
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
                          value={employee.plandmark}
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
                          value={employee.ptaluk}
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
                          value={employee.ppost}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Pincode</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          readOnly
                          value={employee.ppincode}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Country</Typography>
                        <OutlinedInput
                          value={selectedCountryp?.name}
                          readOnly={true}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>State</Typography>
                        <OutlinedInput
                          value={selectedStatep?.name}
                          readOnly={true}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>City</Typography>
                        <OutlinedInput value={selectedCityp?.name} readOnly={true} />
                      </FormControl>
                    </Grid>
                  </Grid>
                </>
              )}
            </Box>
            <br />
          </Grid>

          <Grid item md={1} xs={12} sm={12} container alignItems="center">

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
                flexWrap: 'wrap',
              }}
            >
              <Button className="next" variant="contained" onClick={nextStep}
                size="small"
                sx={{
                  textTransform: "capitalize",
                  width: "73px",
                }}
              >
                Next
              </Button>

              <Link
                to={backPath}
                style={{
                  textDecoration: "none",
                  color: "white",
                  marginRight: "0px"
                }}
              >
                <Button
                  size="small"
                  sx={{
                    ...userStyle.btncancel,
                    textTransform: "capitalize",
                    width: "73px",

                  }}
                >Cancel</Button>
              </Link>

            </Box>
          </Grid>
        </Grid>
      </>
    );
  };

  const renderStepFour = () => {
    return (
      <>
        <Headtitle title={headTitle} />
        <Grid container spacing={2}>
          <Grid item md={1} xs={12} sm={12} container alignItems="center">
            <Button className="prev" variant="contained"
              size="small"
              onClick={prevStep}
              sx={{
                textTransform: "capitalize",
                width: "73px",
              }}
            >
              Previous
            </Button>
          </Grid>

          <Grid item md={10} xs={12} sm={12}>
            <Box sx={userStyle.container}>
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
              <br /> <br />
              {/* // <button onClick={handleDownloadAll}>download All</button> */}
            </Box>
            <br />
            <Box sx={userStyle.container}>
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
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            <br />
            <br />
          </Grid>

          <Grid item md={1} xs={12} sm={12} container alignItems="center">

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
                flexWrap: 'wrap',
              }}
            >
              <Button className="next"
                variant="contained"
                size="small"
                sx={{
                  textTransform: "capitalize !important",
                  width: "73px",
                }}
                onClick={nextStep}
              >
                Next
              </Button>
              <Link
                to={backPath}
                style={{
                  textDecoration: "none",
                  color: "white",
                  marginRight: "0px"
                }}
              >
                <Button
                  size="small"
                  sx={{
                    ...userStyle.btncancel,
                    textTransform: "capitalize",
                    width: "73px",

                  }}

                >Cancel</Button>
              </Link>


            </Box>

          </Grid>
        </Grid>
      </>
    );
  };

  const renderStepFive = () => {
    return (
      <>
        <Headtitle title={headTitle} />
        <Grid container spacing={2}>
          <Grid item md={1} xs={12} sm={12} container alignItems="center">
            <Button className="prev"
              variant="contained"
              size="small"
              sx={{
                textTransform: "capitalize",
                width: "73px",
              }}
              onClick={prevStep}
            >
              Previous
            </Button>
          </Grid>
          <Grid item md={10} xs={12} sm={12}>
            <Box sx={userStyle.container}>
              <Typography sx={userStyle.SubHeaderText}>
                Additional Qualification{" "}
              </Typography>

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
            </Box>
            <br />
            <Box sx={userStyle.container}>
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
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {workhistTodo &&
                      workhistTodo.map((todo, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell align="center">{sno++}</StyledTableCell>
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
            </Box>
            <br />
          </Grid>

          <Grid item md={1} xs={12} sm={12} container alignItems="center">
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
                flexWrap: 'wrap',
              }}
            >
              <Button className="next" variant="contained"
                size="small"
                sx={{
                  textTransform: "capitalize",
                  width: "73px",
                }}
                onClick={nextStep}>
                Next
              </Button>
              <Link
                to={backPath}
                style={{
                  textDecoration: "none",
                  color: "white",
                  marginRight: "0px"
                }}
              >
                <Button
                  size="small"
                  sx={{
                    ...userStyle.btncancel,
                    textTransform: "capitalize",
                    width: "73px",

                  }}
                >Cancel</Button>
              </Link>

            </Box>

          </Grid>
        </Grid>
      </>
    );
  };

  const [accessible, setAccessible] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    responsibleperson:
      String(employee.firstname).toUpperCase() +
      "." +
      String(employee.lastname).toUpperCase(),
  });

  const fetchAccessibleDetails = async (eployeename, employeecode) => {
    try {
      let req = await axios.post(SERVICE.GETUSERASSIGNBRANCH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        empname: eployeename,
        empcode: employeecode,
      });
      let allData = req?.data?.assignbranch;

      if (allData?.length > 0) {
        let todos = allData?.map((data) => ({
          fromcompany: data.fromcompany,
          frombranch: data.frombranch,
          fromunit: data.fromunit,
          companycode: data.companycode,
          branchcode: data.branchcode,
          unitcode: data.unitcode,
          branchemail: data.branchemail,
          branchaddress: data.branchaddress,
          branchstate: data.branchstate,
          branchcity: data.branchcity,
          branchcountry: data.branchcountry,
          branchpincode: data.branchpincode,

          company: data?.company,
          branch: data?.branch,
          unit: data?.unit,
          employee: employee.companyname,
          employeecode: String(
            employee.wordcheck === true ? employeecodenew : employee.empcode
          ),
          id: data?._id,
          updatedby: data?.updatedby,
        }));
        setAccessibleTodo(todos);
        setAccessible({
          company: "Please Select Company",
          branch: "Please Select Branch",
          unit: "Please Select Unit",
          responsibleperson: employee.companyname,
          companycode: "",
          branchcode: "",
          unitcode: "",
          branchemail: "",
          branchaddress: "",
          branchstate: "",
          branchcity: "",
          branchcountry: "",
          branchpincode: "",
        });
      } else {
        setAccessible({
          company: "Please Select Company",
          branch: "Please Select Branch",
          unit: "Please Select Unit",
          responsibleperson: employee.companyname,
          companycode: "",
          branchcode: "",
          unitcode: "",
          branchemail: "",
          branchaddress: "",
          branchstate: "",
          branchcity: "",
          branchcountry: "",
          branchpincode: "",
        });
        setAccessibleTodo([]);
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const renderStepSix = () => {
    return (
      <>
        <Headtitle title={headTitle} />
        <Grid container spacing={2}>
          <Grid item md={1} xs={12} sm={12} container alignItems="center">
            <Button className="prev" variant="contained"
              size="small"
              sx={{
                textTransform: "capitalize",
                width: "73px",
              }}
              onClick={prevStep}>
              Previous
            </Button>
          </Grid>
          <Grid item md={10} xs={12} sm={12}>
            {bankTodo?.length > 0 && (
              <Box sx={userStyle.dialogbox}>
                <Typography sx={userStyle.SubHeaderText}>Bank Details </Typography>
                <br />
                <br />
                {bankTodo?.map((data, index) => (
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
                      <Grid item md={4} xs={12} sm={12}>
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
                      <Grid item md={4} sm={12} xs={12}>
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
                            value={data.accountstatus ?? "In-Active"}
                            placeholder="Please Enter IFSC Code"
                            readOnly
                          />
                        </FormControl>
                      </Grid>

                      <Grid item md={6} xs={12} sm={12} sx={{ display: "flex" }}>
                        <Grid container spacing={2}>
                          {data?.proof?.length > 0 && (
                            <Grid
                              item
                              md={6}
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
                                      <Grid item lg={8} md={10} sm={8} xs={8}>
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
                                      <Grid item lg={1} md={2} sm={1} xs={1}>
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
                                    </Grid>
                                  </>
                                ))}
                            </Grid>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                    <br />
                  </div>
                ))}
              </Box>
            )}

            <br />
            <Box sx={userStyle.dialogbox}>
              <Grid container spacing={1}>
                <Grid item md={8} xs={0} sm={4}>
                  <Typography sx={userStyle.SubHeaderText}>
                    Exp Log Details{" "}
                  </Typography>
                </Grid>
                <Grid item md={1} xs={12} sm={4} marginTop={1}>
                  <Typography>Date</Typography>
                </Grid>
                <Grid item md={3} xs={12} sm={4}>
                  <FormControl fullWidth>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      readOnly
                      value={
                        assignExperience.updatedate
                          ? moment(assignExperience.updatedate)?.format(
                            "DD-MM-YYYY"
                          )
                          : ""
                      }
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={1}>
                <Grid item md={4} xs={12} sm={4}>
                  <FormControl fullWidth>
                    <Typography>Mode Val</Typography>
                    <OutlinedInput
                      value={assignExperience.expmode}
                      readOnly={true}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={4}>
                  <FormControl fullWidth size="small">
                    <Typography>Value (In Months)</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      readOnly
                      value={assignExperience.expval}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={1}>
                <Grid item md={3} xs={12} sm={4}>
                  <FormControl fullWidth>
                    <Typography>Mode Exp</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      readOnly
                      value="Exp Stop"
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={4}>
                  <FormControl fullWidth>
                    <Typography>End Exp</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      readOnly
                      value={assignExperience.endexp}
                    />
                  </FormControl>
                </Grid>

                {assignExperience.endexp === "Yes" ? (
                  <>
                    <Grid item md={3} xs={12} sm={4}>
                      <Typography>End Exp Date</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        readOnly
                        value={
                          assignExperience.endexpdate
                            ? moment(assignExperience.endexpdate)?.format(
                              "DD-MM-YYYY"
                            )
                            : ""
                        }
                      />
                    </Grid>
                  </>
                ) : null}
              </Grid>
              <br />
              <Grid container spacing={1}>
                <Grid item md={3} xs={12} sm={4}>
                  <FormControl fullWidth>
                    <Typography>Mode Target</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      readOnly
                      value="Target Stop"
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={4}>
                  <FormControl fullWidth>
                    <Typography>End Tar</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      readOnly
                      value={assignExperience.endtar}
                    />
                  </FormControl>
                </Grid>

                {assignExperience.endtar === "Yes" ? (
                  <>
                    <Grid item md={3} xs={12} sm={4}>
                      <Typography>End Tar Date</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        readOnly
                        value={
                          assignExperience.endtardate
                            ? moment(assignExperience.endtardate)?.format(
                              "DD-MM-YYYY"
                            )
                            : ""
                        }
                      />
                    </Grid>
                  </>
                ) : null}
              </Grid>
              <br />
            </Box>
            <br />
            {/* process details add */}
            <Box sx={userStyle.dialogbox}>
              <Grid container spacing={1}>
                <Grid item md={8} xs={0} sm={4}>
                  <Typography sx={userStyle.SubHeaderText}>
                    Process Allot{" "}
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>Process </Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={loginNotAllot?.process}
                      readOnly
                    />
                  </FormControl>
                  {errorsLog.process && <div>{errorsLog.process}</div>}
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>Process Type</Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={loginNotAllot?.processtype}
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>Process Duration</Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={loginNotAllot?.processduration}
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <Typography>Duration</Typography>
                  <Grid container spacing={1}>
                    <Grid item md={6} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={loginNotAllot?.time}
                          readOnly
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={loginNotAllot?.timemins}
                          readOnly
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  {errorsLog.duration && <div>{errorsLog.duration}</div>}
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Gross Salary</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={overallgrosstotal}
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Mode Experience</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={modeexperience}
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Target Experience</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={targetexperience}
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Target Points</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={targetpts}
                      readOnly
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br />
            </Box>
            <br />
            {/* Accessible Company/Branch/Unit add details */}
            <Box sx={userStyle.dialogbox}>
              <Grid container spacing={1}>
                <Grid item md={8} xs={0} sm={4}>
                  <Typography sx={userStyle.SubHeaderText}>
                    Accessible Company/Branch/Unit
                  </Typography>
                </Grid>
              </Grid>
              <br />
              {accessibleTodo?.map((datas, index) => (
                <div key={index}>
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      <Typography sx={{ fontWeight: "bold" }}>{`Row No : ${index + 1
                        }`}</Typography>
                    </Grid>
                  </Grid>
                  <br />
                  <Grid container spacing={2}>
                    <Grid item md={4} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>Company</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={datas.fromcompany ?? ""}
                          readOnly
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>Branch</Typography>

                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={datas.frombranch ?? ""}
                          readOnly
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>Unit</Typography>

                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={datas.fromunit ?? ""}
                          readOnly
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <br />
                </div>
              ))}
              <br />
            </Box>
            <br />
          </Grid>
          <Grid item md={1} xs={12} sm={12} container alignItems="center">

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
                flexWrap: 'wrap',
              }}
            >
              <Link to={backPath}>
                <Button
                  size="small"
                  sx={{
                    ...userStyle.btncancel,
                    textTransform: "capitalize",
                    width: "73px",

                  }}
                > Cancel </Button>
              </Link>

            </Box>
          </Grid>
        </Grid>

      </>
    );
  };

  const renderIndicator = () => {
    return (
      <ul className="indicatoremployee">
        <li className={step === 1 ? "active" : null}>
          <FaArrowAltCircleRight />
          &ensp;Personal Info
        </li>
        <li className={step === 2 ? "active" : null}>
          <FaArrowAltCircleRight />
          &ensp;Login & Boarding Details
        </li>
        <li className={step === 3 ? "active" : null}>
          <FaArrowAltCircleRight />
          &ensp;Address
        </li>
        <li className={step === 4 ? "active" : null}>
          <FaArrowAltCircleRight />
          &ensp;Document
        </li>
        <li className={step === 5 ? "active" : null}>
          <FaArrowAltCircleRight />
          &ensp;Work History
        </li>
        <li className={step === 6 ? "active" : null}>
          <FaArrowAltCircleRight />
          &ensp;Bank Details
        </li>
      </ul>
    );
  };

  return (
    <div className="multistep-form">
      {renderIndicator()}
      {step === 1 ? renderStepOne() : null}
      {step === 2 ? renderStepTwo() : null}
      {step === 3 ? renderStepThree() : null}
      {step === 4 ? renderStepFour() : null}
      {step === 5 ? renderStepFive() : null}
      {step === 6 ? renderStepSix() : null}
    </div>
  );
}

export default MultistepForm;