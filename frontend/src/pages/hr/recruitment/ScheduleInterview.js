import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Button,
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import moment from "moment-timezone";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import Selects from "react-select";
import { MultiSelect } from "react-multi-select-component";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { BASE_URL } from "../../../services/Authservice";
import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

function ScheduleInterview({
  setVendorAuto,
  handleClickCloseMeetingPopup,
  meetingValues,
  getScreenedCandidate,
  roundname,
  tablesname,
  prevroundid,
  jobopeningsid,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const LoadingBackdrop = ({ open }) => {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <div className="pulsating-circle">
          <CircularProgress color="inherit" className="loading-spinner" />
        </div>
        <Typography
          variant="h6"
          sx={{ marginLeft: 2, color: "#fff", fontWeight: "bold" }}
        >
          Please Wait...
        </Typography>
      </Backdrop>
    );
  };

  //state to handle meeting values
  const [meetingState, setMeetingState] = useState({
    branch: "Please Select Branch",
    department: "Please Select Department",
    team: "Please Select Team",
    meetingcategory: "Please Select Interview Category",
    meetingtype: "Please Select Interview Type",
    meetingmode: "Please Select Interview Mode",
    venue: "Please Select Area",
    link: "",
    title: "",
    date: "",
    time: "",
    deadlinedate: "",
    deadlinetime: "",
    duration: "00:00",
    timezone: "(GMT +5:30) Bombay, Calcutta, Madras, New Delhi",
    reminder: "Please Select Reminder",
    recuringmeeting: false,
    repeattype: "Repeat Type",
    repeatevery: "00 days",
    immediateinterview: "No",
  });

  const [firstRound, setFirstRound] = useState("");
  const [particularRound, SetParticularRound] = useState([]);
  const [credentials, SetCredentials] = useState({
    username: "",
    password: "",
  });

  /* Function to generate combination of password */
  function generatePass() {
    let pass = "";
    let str =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 1; i <= 8; i++) {
      let char = Math.floor(Math.random() * str.length + 1);

      pass += str.charAt(char);
    }

    return pass;
  }

  const generateUniqueUsername = (candidateName) => {
    const cleanedName = candidateName.trim().toLowerCase();

    const randomString = Math.random().toString(36).substring(2, 4);

    const username = `${cleanedName}_${randomString}`;

    return username;
  };

  const [interviewgrouping, setInterviewgrouping] = useState({
    designation: "Please Select Designation",
    round: "Please Select Round",
    type: "Please Select Type",
    category: "Please Select Category",
    subcategory: "Please Select SubCategory",
    mode: "Please Select Mode",
    testname: "Please Select Test Name",
    question: "",
    totalmarks: "",
    eligiblemarks: "",
    markcomparison: "",
    retestcount: "",
    retestfor: "",
  });

  useEffect(() => {
    singleCandidateData(meetingValues[3]);
    fetchHost(meetingValues[0], meetingValues[1]);
  }, [meetingValues]);

  const fetchInterviewRoundOrders = async (role, rounditems) => {
    try {
      let res_vendor = await axios.get(SERVICE.INTERVIEWROUNDORDER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let roundOrders = res_vendor?.data?.interviewroundorders?.filter(
        (item) => item.designation === meetingValues[5]
      );

      let roundArray = [
        ...new Set(
          roundOrders
            ?.filter((data) => data.designation === meetingValues[5])
            ?.flatMap((item) => item.round.map((item) => item))
        ),
      ];

      let roundOrder =
        roundArray?.length > 0 && rounditems?.length === 0
          ? roundArray[0]
          : roundArray?.length > rounditems?.length && rounditems?.length > 0
          ? roundArray[rounditems?.length]
          : "";

      setFirstRound(roundOrder);
      await fetchInterviewgrouping(roundOrder);
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

  const [typingtestInterviewForm, setTypingtestInterviewForm] = useState([]);

  //get all Sub vendormasters.
  const fetchInterviewgrouping = async (roundname) => {
    try {
      let questionArray;
      let res_vendor = await axios.get(SERVICE.INTERVIEWQUESTIONGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let intQnGrping = res_vendor?.data?.interviewgroupingquestion;

      let singelData = intQnGrping?.find(
        (item) =>
          item?.designation === meetingValues[5] && item?.round === roundname
      );

      setInterviewgrouping({
        ...interviewgrouping,
        roundmode: singelData?.roundmode,
        mode: singelData?.mode,
        type: singelData?.type,
        testname: singelData?.testname,
        category: singelData?.category,
        subcategory: singelData?.subcategory,
        duration: singelData?.duration,
        totalmarks: singelData?.totalmarks,
        eligiblemarks: singelData?.eligiblemarks,
        markcomparison: singelData?.markcomparison,
        retestcount: singelData?.retestcount,
        retestfor: singelData?.retestfor,
        typetest: singelData?.typetest,
        questioncount: singelData?.questioncount,
        countfrom: singelData?.countfrom,
        countto: singelData?.countto,
      });

      setMeetingState({
        ...meetingState,
        meetingtype:
          singelData?.roundmode === "Either"
            ? "Offline"
            : singelData?.roundmode,
      });

      let fullnames = meetingValues[4]
        ?.trim()
        ?.toLowerCase()
        .replace(/\s+/g, "");

      let generateUserName =
        interviewroundsArray?.length === 0
          ? generateUniqueUsername(fullnames)
          : "";
      let generatePassword =
        interviewroundsArray?.length === 0 ? generatePass() : "";

      SetCredentials({
        username: generateUserName,
        password: generatePassword,
      });

      let interviewQuestonOrderData = await fetchInterviewQuestionOrders(
        roundname
      );

      singelData?.mode === "Online or Interview Test"
        ? (questionArray = [])
        : (questionArray = [
            ...new Set(
              interviewQuestonOrderData?.filter(
                (data) =>
                  (singelData?.mode === "Typing Test"
                    ? true
                    : data.type === singelData?.type) &&
                  data.category === singelData?.category &&
                  data.subcategory === singelData?.subcategory
              )
            ),
          ]);
      SetParticularRound(questionArray?.length > 0 ? questionArray[0] : []);
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
  const fetchInterviewQuestionOrders = async (roundname) => {
    try {
      let res_vendor = await axios.get(SERVICE.INTERVIEWQUESTIONSORDER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let intQnOrder = res_vendor?.data?.interviewquestionsorders?.filter(
        (item) =>
          item.designation === meetingValues[5] && item?.round === roundname
      );

      return intQnOrder;
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

  const [formerUsers, setFormerUsers] = useState([]);

  const [interviwerDatas, setInterviwerDatas] = useState([]);
  const fetchHost = async (company, branch) => {
    try {
      let res = await axios.post(
        SERVICE.ASSIGNINTERVIEWERS,
        {
          assignbranch: accessbranch,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      let response = await axios.get(SERVICE.FORMERUSERS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let formerUser = response?.data?.formerusers?.map(
        (data) => data?.companyname
      );
      setFormerUsers(formerUser);
      let ans = res.data.assigninterview
        .filter(
          (data) =>
            data?.fromcompany?.includes(company) &&
            data?.frombranch?.includes(branch) &&
            data?.type === "Interviewer" &&
            data?.designation === meetingValues[5]
        )
        .map((item) => ({
          ...item,
          employee: item?.employee?.filter(
            (name) => !formerUser.includes(name)
          ),
        }));
      setInterviwerDatas(ans);
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
  //state to handle edit meeting values
  const [agenda, setAgenda] = useState("");
  const [branchOption, setBranchOption] = useState([]);
  const [floorOption, setFloorOption] = useState([]);
  const { isUserRoleAccess, isAssignBranch } = useContext(
    UserRoleAccessContext
  );
  const { auth } = useContext(AuthContext);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const accessbranch = isAssignBranch?.map((data) => ({
    branch: data.branch,
    company: data.company,
    unit: data.unit,
  }));
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    company: true,
    branch: true,
    branchvenue: true,
    floorvenue: true,
    team: true,
    department: true,
    title: true,
    meetingtype: true,
    meetingcategory: true,
    date: true,
    time: true,
    duration: true,
    timezone: true,
    participants: true,
    interviewer: true,
    reminder: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );
  const [locationOption, setLocationOption] = useState([]);
  const [meetingHostID, setMeetingHostID] = useState([]);

  //useEffect
  useEffect(() => {
    fetchBranchAll();
    fetchFloorAll();
    fetchAllLocation();
  }, []);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const meetingModeOption = [
    { value: "Zoom", label: "Zoom" },
    { value: "Microsoft Teams", label: "Microsoft Teams" },
    { value: "Google Meet", label: "Google Meet" },
    { value: "Jio Meet", label: "Jio Meet" },
    { value: "Slack", label: "Slack" },
    { value: "Skype", label: "Skype" },
    { value: "In Person", label: "In Person" },
  ];
  //meeting type options
  const meetingTypeOption = [
    { value: "Online", label: "Online" },
    { value: "Offline", label: "Offline" },
  ];

  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };

  //branch venue multiselect
  const [selectedOptionsBranchVenue, setSelectedOptionsBranchVenue] = useState(
    []
  );
  let [valueBranchVenueCat, setValueBranchVenueCat] = useState([]);

  const handleBranchVenueChange = (options) => {
    setValueBranchVenueCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBranchVenue(options);
    setValueFloorVenueCat([]);
    setSelectedOptionsFloorVenue([]);
    setMeetingState({ ...meetingState, venue: "Please Select Area" });
  };

  const customValueRendererBranchVenue = (
    valueBranchVenueCat,
    _categoryname
  ) => {
    return valueBranchVenueCat?.length
      ? valueBranchVenueCat.map(({ label }) => label)?.join(", ")
      : "Please Select Branch";
  };

  //floor venue multiselect
  const [selectedOptionsFloorVenue, setSelectedOptionsFloorVenue] = useState(
    []
  );
  let [valueFloorVenueCat, setValueFloorVenueCat] = useState([]);

  const handleFloorVenueChange = (options) => {
    setValueFloorVenueCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsFloorVenue(options);
    setMeetingState({ ...meetingState, venue: "Please Select Area" });
  };

  const customValueRendererFloorVenue = (valueFloorVenueCat, _categoryname) => {
    return valueFloorVenueCat?.length
      ? valueFloorVenueCat.map(({ label }) => label)?.join(", ")
      : "Please Select Floor";
  };

  //host company multiselect
  const [selectedOptionsCompanyHost, setSelectedOptionsCompanyHost] = useState(
    []
  );
  let [valueCompanyHostCat, setValueCompanyHostCat] = useState([]);

  const handleCompanyHostChange = (options) => {
    setValueCompanyHostCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCompanyHost(options);
    setValueBranchHostCat([]);
    setSelectedOptionsBranchHost([]);
    setValueTeamHostCat([]);
    setSelectedOptionsTeamHost([]);
    setValueDepartmentHostCat([]);
    setSelectedOptionsDepartmentHost([]);
    setValueCateHost([]);
    setSelectedOptionsCateHost([]);
  };

  const customValueRendererCompanyHost = (
    valueCompanyHostCat,
    _categoryname
  ) => {
    return valueCompanyHostCat?.length
      ? valueCompanyHostCat.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
  };

  //branch host  multiselect
  const [selectedOptionsBranchHost, setSelectedOptionsBranchHost] = useState(
    []
  );
  let [valueBranchHostCat, setValueBranchHostCat] = useState([]);

  const handleBranchHostChange = (options) => {
    setValueBranchHostCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBranchHost(options);
    setValueTeamHostCat([]);
    setSelectedOptionsTeamHost([]);
    setValueDepartmentHostCat([]);
    setSelectedOptionsDepartmentHost([]);
    setValueCateHost([]);
    setSelectedOptionsCateHost([]);
  };

  const customValueRendererBranchHost = (valueBranchHostCat, _categoryname) => {
    return valueBranchHostCat?.length
      ? valueBranchHostCat.map(({ label }) => label)?.join(", ")
      : "Please Select Branch";
  };

  //team host multiselect
  const [selectedOptionsTeamHost, setSelectedOptionsTeamHost] = useState([]);
  let [valueTeamHostCat, setValueTeamHostCat] = useState([]);

  const handleTeamHostChange = (options) => {
    setValueTeamHostCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsTeamHost(options);
    setValueCateHost([]);
    setSelectedOptionsCateHost([]);
  };

  const customValueRendererTeamHost = (valueTeamHostCat, _categoryname) => {
    return valueTeamHostCat?.length
      ? valueTeamHostCat.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };

  //Department host multiselect
  const [selectedOptionsDepartmentHost, setSelectedOptionsDepartmentHost] =
    useState([]);
  let [valueDepartmentHostCat, setValueDepartmentHostCat] = useState([]);
  useState("");

  const handleDepartmentHostChange = (options) => {
    setValueDepartmentHostCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsDepartmentHost(options);
    setValueTeamHostCat([]);
    setSelectedOptionsTeamHost([]);
    setValueCateHost([]);
    setSelectedOptionsCateHost([]);
  };

  const customValueRendererDepartmentHost = (
    valueDepartmentHostCat,
    _categoryname
  ) => {
    return valueDepartmentHostCat?.length
      ? valueDepartmentHostCat.map(({ label }) => label)?.join(", ")
      : "Please Select Unit";
  };

  //meeting host multiselect
  const [selectedOptionsCateHost, setSelectedOptionsCateHost] = useState([]);
  const [valueCateHost, setValueCateHost] = useState("");
  const handleCategoryChangeHost = (options) => {
    setValueCateHost(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCateHost(options);
    setMeetingHostID(
      options.map((a, index) => {
        return a._id;
      })
    );
  };

  const customValueRendererCateHost = (valueCateHost, _employeename) => {
    return valueCateHost.length
      ? valueCateHost.map(({ label }) => label).join(", ")
      : "Please Select Interviewer";
  };

  //get all branches.
  const fetchBranchAll = async () => {
    try {
      let res_location = await axios.get(SERVICE.BRANCH, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setBranchOption([
        ...res_location?.data?.branch?.map((t) => ({
          ...t,
          label: t.name,
          value: t.name,
        })),
      ]);
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
            </p>{" "}
          </>
        );
        handleClickOpenerr();
      }
    }
  };

  //get all floor.
  const fetchFloorAll = async () => {
    try {
      let res_location = await axios.get(SERVICE.FLOOR, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setFloorOption([
        ...res_location?.data?.floors?.map((t) => ({
          ...t,
          label: t.name,
          value: t.name,
        })),
      ]);
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
            </p>{" "}
          </>
        );
        handleClickOpenerr();
      }
    }
  };
  //get locations
  const fetchAllLocation = async () => {
    try {
      let res_location = await axios.get(SERVICE.AREAGROUPING, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setLocationOption(
        res_location?.data?.areagroupings?.filter(
          (data) => data?.locationareastatus
        )
      );
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong!"}
            </p>{" "}
          </>
        );
        handleClickOpenerr();
      }
    }
  };

  // Error Popup model
  const handleClickOpenerr = () => {
    setIsLoading(false);
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  //submit option for saving
  const handleSubmit = (e) => {
    setIsLoading(true);
    e.preventDefault();
    if (meetingState.meetingtype === "Please Select Interview Type") {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Interview Type"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (
      meetingState.meetingtype === "Online" &&
      meetingState.meetingmode === "Please Select Interview Mode"
    ) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Interview Mode"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (
      meetingState.meetingtype === "Offline" &&
      valueBranchVenueCat?.length == 0
    ) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Location-Branch"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (
      meetingState.meetingtype === "Offline" &&
      valueFloorVenueCat?.length == 0
    ) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Location-Floor"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (
      meetingState.meetingtype === "Online" &&
      meetingState.link === ""
    ) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Enter Interview Link"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (
      meetingState.meetingtype === "Offline" &&
      meetingState.venue === "Please Select Area"
    ) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Location-Area"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (meetingState.date === "") {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Reporting Date"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (meetingState.time === "") {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Reporting Time"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (meetingState.deadlinedate === "") {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Deadline Date"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (meetingState.deadlinetime === "") {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Deadline Time"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (firstRound === "") {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Round Can't Be Empty"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (
      interviewgrouping?.mode === "Questions" &&
      interviewgrouping?.type === ""
    ) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Type Can't be Empty"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (
      interviewgrouping?.mode === "Online or Interview Test" &&
      interviewgrouping?.testname === ""
    ) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"TestName Can't be Empty"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (interviewgrouping?.category === "") {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Category Can't be Empty"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (interviewgrouping?.subcategory === "") {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Sub Category Can't be Empty"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (valueCompanyHostCat?.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Interviewer Company"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (valueBranchHostCat?.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Interviewer Branch"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (valueDepartmentHostCat?.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Interviewer Unit"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (valueTeamHostCat?.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Interviewer Team"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (valueCateHost.length === 0) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Interviewer"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequest();
    }
  };

  const [candidateSingle, setCandidateSingle] = useState({});
  let interviewroundsArray;
  const oldusername = candidateSingle?.username;
  const oldpassword = candidateSingle?.password;

  const singleCandidateData = async (id) => {
    try {
      let res = await axios.get(`${SERVICE.CANDIDATES_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setCandidateSingle(res?.data?.scandidates);
      interviewroundsArray = res?.data?.scandidates?.interviewrounds;
      await fetchInterviewRoundOrders(
        meetingValues[5],
        res?.data?.scandidates?.interviewrounds
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

  const prevRoundUpdate = async (id) => {
    try {
      await axios.put(`${SERVICE.UPDATE_INTERVIEWROUNDSTATUS}/${id}`, {
        nextround: Boolean(true),
      });
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

  //add function
  const sendRequest = async () => {
    try {
      let mode =
        interviewgrouping?.mode === "Typing Test" ? "typingtest" : "questions";

      let candidateusername =
        oldusername === "" || oldusername == undefined
          ? credentials?.username
          : oldusername;
      let candidatepassword =
        oldpassword === "" || oldpassword == undefined
          ? credentials?.password
          : oldpassword;

      let response = await axios.put(
        `${SERVICE.CANDIDATES_SINGLE}/${meetingValues[3]}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          username: candidateusername,
          password: candidatepassword,
          overallstatus: String(firstRound),
          screencandidate: "Screened",
          interviewrounds: [
            ...candidateSingle?.interviewrounds,
            {
              company: String(meetingValues[0]),
              branch: String(meetingValues[1]),
              meetingcategory: "Interview",
              meetingtype: String(meetingState.meetingtype),
              venue: String(
                meetingState.meetingtype === "Offline" ? meetingState.venue : ""
              ),
              meetingmode: String(
                meetingState.meetingtype === "Online"
                  ? meetingState.meetingmode
                  : ""
              ),
              branchvenue:
                meetingState.meetingtype === "Offline"
                  ? [...valueBranchVenueCat]
                  : [],
              floorvenue:
                meetingState.meetingtype === "Offline"
                  ? [...valueFloorVenueCat]
                  : [],
              link: String(
                meetingState.meetingtype === "Online" ? meetingState.link : ""
              ),
              // title: String(meetingState.title),
              date: String(meetingState.date),
              time: String(meetingState.time),
              deadlinedate: String(meetingState.deadlinedate),
              deadlinetime: String(meetingState.deadlinetime),
              duration: String(interviewgrouping?.duration),
              // timezone: String(meetingState.timezone),
              participants: String(meetingValues[4]),
              hostcompany: [meetingValues[0]],
              hostbranch: [meetingValues[1]],
              hostunit: [...valueDepartmentHostCat],
              hostteam: [...valueTeamHostCat],
              interviewer: [...valueCateHost],
              interviewscheduledby: String(isUserRoleAccess?._id),
              designation: String(meetingValues[2]),
              roundname: String(firstRound),
              roundtype: String(interviewgrouping?.type),
              retestcount: Number(
                mode === "typingtest" ? interviewgrouping?.retestcount : 0
              ),
              retestfor: String(
                mode === "typingtest" ? interviewgrouping?.retestfor : ""
              ),
              roundcategory: String(interviewgrouping?.category),
              roundsubcategory: String(interviewgrouping?.subcategory),

              mode: String(interviewgrouping?.mode),
              testname: String(interviewgrouping?.testname),
              totalmarks: String(interviewgrouping?.totalmarks),
              eligiblemarks: String(interviewgrouping?.eligiblemarks),
              markcomparison: String(interviewgrouping?.markcomparison),

              roundlink: String(
                `${BASE_URL}/interview/interviewformgenerate/${mode}/0/${particularRound?._id}`
              ),
              roundstatus: "Interview Scheduled",
              roundanswerstatus: "",

              interviewForm:
                interviewgrouping?.mode === "Typing Test"
                  ? typingtestInterviewForm
                  : particularRound?.interviewForm,
              interviewFormLog: [],
              nextround: Boolean(false),
            },
          ],
        }
      );

      let singleRound = response?.data?.interviewrounds?.find(
        (data) => data?.roundname === firstRound
      );

      const sendmail = await fetch(SERVICE.INTERVIEWMAIL_SENT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: candidateusername,
          password: candidatepassword,
          roundname: firstRound,
          applicantname: meetingValues[4],
          duration: interviewgrouping?.duration
            ?.split(":")
            .map((v, i) => (i === 0 ? `${v} hr` : `${v} mins`))
            .join(" : "),
          startdate: moment(meetingState.date).format("DD-MM-YYYY"),
          starttime: moment(meetingState.time, "HH:mm").format("hh:mm A"),
          deadlinedate: moment(meetingState.deadlinedate).format("DD-MM-YYYY"),
          deadlinetime: moment(meetingState.deadlinetime, "HH:mm").format(
            "hh:mm A"
          ),
          company: meetingValues[0],
          branch: meetingValues[1],
          roundlink: `${BASE_URL}/interview/interviewformgenerate/${mode}/0/${
            meetingValues[3]
          }/${singleRound?._id}/false/${
            mode === "typingtest" ? jobopeningsid : particularRound?._id
          }`,
          email: response?.data?.candidateemail,
          role: meetingValues[2],
        }),
      });

      if (sendmail.ok) {
        console.log("Email sent successfully");
      } else {
        console.log("Error sending email");
      }

      setVendorAuto("none");
      if (tablesname === "Resume Screen") {
        getScreenedCandidate("clicked");
      } else if (tablesname === "Overall Applicant") {
        getScreenedCandidate("overallappllicant");
      } else if (tablesname === "New Applicant") {
        getScreenedCandidate("newallappllicant");
      } else {
        await prevRoundUpdate(prevroundid);
        getScreenedCandidate(roundname);
      }
      // roundname === "NOTAROUND"
      //   ? getScreenedCandidate("clicked")
      //   : getScreenedCandidate(roundname);
      handleClickCloseMeetingPopup();
      setMeetingState({
        ...meetingState,
        title: "",
        date: "",
        link: "",
        time: "",
        deadlinedate: "",
        deadlinetime: "",
        immediateinterview: "No",
      });
      setAgenda("");
      setShowAlert(
        <>
          {" "}
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "green" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Added Successfully👍"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
      setIsLoading(false);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong!"}
            </p>{" "}
          </>
        );
        handleClickOpenerr();
      }
    }
  };

  const handleImmediateInterviewChange = () => {
    //company
    let comp = [
      ...new Set(
        interviwerDatas
          ?.filter((data) => data?.round?.includes(firstRound))
          ?.map((item) => item.tocompany)
      ),
    ].map((company) => ({ label: company, value: company }));
    let selectedComp = comp.map((a, index) => {
      return a.value;
    });

    setValueCompanyHostCat(selectedComp);
    setSelectedOptionsCompanyHost(comp);

    //branch

    let bran = [
      ...new Set(
        interviwerDatas
          ?.filter(
            (u) =>
              selectedComp?.includes(u.tocompany) &&
              u?.round?.includes(firstRound)
          )
          .map((item) => item.tobranch)
      ),
    ].map((branch) => ({ label: branch, value: branch }));

    let selectedBran = bran.map((a, index) => {
      return a.value;
    });

    setValueBranchHostCat(selectedBran);
    setSelectedOptionsBranchHost(bran);

    //unit

    let unit = [
      ...new Set(
        interviwerDatas
          ?.filter(
            (u) =>
              selectedComp?.includes(u.tocompany) &&
              selectedBran?.includes(u.tobranch) &&
              u?.round?.includes(firstRound)
          )
          .map((item) => item.tounit)
      ),
    ].map((unit) => ({ label: unit, value: unit }));

    let selectedUnit = unit.map((a, index) => {
      return a.value;
    });

    setValueDepartmentHostCat(selectedUnit);
    setSelectedOptionsDepartmentHost(unit);

    //team

    let team = [
      ...new Set(
        interviwerDatas
          ?.filter(
            (u) =>
              selectedComp?.includes(u.tocompany) &&
              selectedBran?.includes(u.tobranch) &&
              selectedUnit?.includes(u.tounit) &&
              u?.round?.includes(firstRound)
          )
          .map((item) => item.toteam)
      ),
    ].map((team) => ({ label: team, value: team }));
    let selectedTeam = team.map((a, index) => {
      return a.value;
    });
    setValueTeamHostCat(selectedTeam);
    setSelectedOptionsTeamHost(team);

    //Interviewer

    let interviewer = [
      ...new Set(
        interviwerDatas
          ?.filter(
            (u) =>
              selectedComp?.includes(u.tocompany) &&
              selectedBran?.includes(u.tobranch) &&
              selectedUnit?.includes(u.tounit) &&
              selectedTeam?.includes(u.toteam) &&
              u?.round?.includes(firstRound)
          )
          ?.flatMap((item) => item?.employee ?? [])
      ),
    ].map((employee) => ({ label: employee, value: employee }));

    let selectedInt = interviewer.map((a, index) => {
      return a.value;
    });

    setValueCateHost(selectedInt);
    setSelectedOptionsCateHost(interviewer);
  };

  return (
    <Box>
      <Headtitle title={"SCHEDULE INTERVIEW"} />
      <LoadingBackdrop open={isLoading} />

      {/* {isUserRoleCompare?.includes("aschedulemeeting") && ( */}
      <Box sx={userStyle.selectcontainer}>
        <>
          <Grid container spacing={2}>
            <Grid item md={3} xs={3}>
              {" "}
              <Typography sx={userStyle.importheadtext}>
                {" "}
                <Button
                  variant="contained"
                  style={{
                    padding: "5px",
                    // background: "blue",
                    color: "white",
                    fontSize: "12px",
                    // width: "0",
                    fontWeight: "bold",
                  }}
                >
                  {meetingValues[2]}
                </Button>
              </Typography>
            </Grid>
            <Grid item md={3} xs={3}>
              <Typography sx={userStyle.importheadtext}>
                {" "}
                <b>Company : {meetingValues[0]}</b>
              </Typography>
            </Grid>
            <Grid item md={3} xs={3}>
              <Typography sx={userStyle.importheadtext}>
                <b>Branch : {meetingValues[1]}</b>
              </Typography>{" "}
            </Grid>
            <Grid item md={3} xs={3}>
              <Typography sx={userStyle.importheadtext}>
                <b>CandidateName : {meetingValues[4]}</b>
              </Typography>{" "}
            </Grid>
          </Grid>
          <br />
          <Grid container spacing={2}>
            <Grid item md={4} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>
                  Immediate Interview<b style={{ color: "red" }}>*</b>
                </Typography>
                <Selects
                  maxMenuHeight={300}
                  options={[
                    { label: "Yes", value: "Yes" },
                    { label: "No", value: "No" },
                  ]}
                  value={{
                    label: meetingState.immediateinterview,
                    value: meetingState.immediateinterview,
                  }}
                  onChange={(e) => {
                    if (e.value === "Yes") {
                      setMeetingState({
                        ...meetingState,
                        immediateinterview: e.value,
                        meetingtype: "Offline",
                        date: moment().format("YYYY-MM-DD"),
                        time: moment().format("HH:mm"),
                        deadlinedate: moment().format("YYYY-MM-DD"),
                        deadlinetime: "23:59",
                        venue: "HR Room",
                      });
                      setValueBranchVenueCat(
                        branchOption.map((a, index) => {
                          return a.value;
                        })
                      );
                      setSelectedOptionsBranchVenue(branchOption);
                      // handleBranchVenueChange(branchOption);
                      // handleFloorVenueChange(floorOption);
                      setValueFloorVenueCat(
                        floorOption.map((a, index) => {
                          return a.value;
                        })
                      );
                      setSelectedOptionsFloorVenue(floorOption);
                      handleImmediateInterviewChange();
                    } else {
                      setMeetingState({
                        ...meetingState,
                        immediateinterview: e.value,
                        meetingtype:
                          interviewgrouping?.roundmode === "Online"
                            ? "Online"
                            : interviewgrouping?.roundmode === "Offline"
                            ? "Offline"
                            : "Offline",
                        date: "",
                        time: "",
                        deadlinedate: "",
                        deadlinetime: "",
                      });

                      setValueBranchVenueCat(
                        branchOption.map((a, index) => {
                          return a.value;
                        })
                      );
                      setSelectedOptionsBranchVenue(branchOption);
                      // handleBranchVenueChange(branchOption);
                      // handleFloorVenueChange(floorOption);
                      setValueFloorVenueCat(
                        floorOption.map((a, index) => {
                          return a.value;
                        })
                      );
                      setSelectedOptionsFloorVenue(floorOption);
                      handleImmediateInterviewChange();

                      // setValueBranchVenueCat([]);
                      // setSelectedOptionsBranchVenue([]);
                      // setValueFloorVenueCat([]);
                      // setSelectedOptionsFloorVenue([]);

                      // setValueCompanyHostCat([]);
                      // setSelectedOptionsCompanyHost([]);

                      // setValueBranchHostCat([]);
                      // setSelectedOptionsBranchHost([]);

                      // setValueDepartmentHostCat([]);
                      // setSelectedOptionsDepartmentHost([]);

                      // setValueTeamHostCat([]);
                      // setSelectedOptionsTeamHost([]);

                      // setValueCateHost([]);
                      // setSelectedOptionsCateHost([]);
                    }
                  }}
                />
              </FormControl>
            </Grid>
            {interviewgrouping?.roundmode === "Either" &&
            meetingState.immediateinterview === "No" ? (
              <Grid item md={4} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Interview Type<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    maxMenuHeight={300}
                    options={meetingTypeOption}
                    placeholder="Please Select Interview Type"
                    value={{
                      label: meetingState.meetingtype,
                      value: meetingState.meetingtype,
                    }}
                    onChange={(e) => {
                      setMeetingState({
                        ...meetingState,
                        meetingtype: e.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
            ) : (interviewgrouping?.roundmode === "Online" ||
                interviewgrouping?.roundmode === "Offline") &&
              meetingState.immediateinterview === "No" ? (
              <Grid item md={4} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Interview Type<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={meetingState.meetingtype}
                    readOnly
                  />
                </FormControl>
              </Grid>
            ) : (
              <Grid item md={4} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Interview Type<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={meetingState.meetingtype}
                    readOnly
                  />
                </FormControl>
              </Grid>
            )}

            {meetingState.meetingtype === "Offline" && (
              <>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Location-Branch<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={branchOption}
                      value={selectedOptionsBranchVenue}
                      onChange={(e) => {
                        handleBranchVenueChange(e);
                      }}
                      valueRenderer={customValueRendererBranchVenue}
                      labelledBy="Please Select Branch"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Location-Floor<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={floorOption
                        ?.filter((u) => valueBranchVenueCat?.includes(u.branch))
                        .map((u) => ({
                          ...u,
                          label: u.name,
                          value: u.name,
                        }))}
                      value={selectedOptionsFloorVenue}
                      onChange={(e) => {
                        handleFloorVenueChange(e);
                      }}
                      valueRenderer={customValueRendererFloorVenue}
                      labelledBy="Please Select Floor"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Location-Area<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={[
                        ...new Set(
                          locationOption
                            .filter(
                              (item) =>
                                valueFloorVenueCat?.includes(item.floor) &&
                                valueBranchVenueCat?.includes(item.branch)
                            )
                            .flatMap((item) => item.area)
                        ),
                      ].map((location) => ({
                        label: location,
                        value: location,
                      }))}
                      placeholder="Please Select Area"
                      value={{
                        label: meetingState.venue,
                        value: meetingState.venue,
                      }}
                      onChange={(e) => {
                        setMeetingState({ ...meetingState, venue: e.value });
                      }}
                    />
                  </FormControl>
                </Grid>
              </>
            )}
            {meetingState.meetingtype === "Online" && (
              <>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Interview Mode<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={meetingModeOption}
                      placeholder="Please Select Interview Mode"
                      value={{
                        label: meetingState.meetingmode,
                        value: meetingState.meetingmode,
                      }}
                      onChange={(e) => {
                        setMeetingState({
                          ...meetingState,
                          meetingmode: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Link<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Link"
                      value={meetingState.link}
                      onChange={(e) => {
                        setMeetingState({
                          ...meetingState,
                          link: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
              </>
            )}
            <Grid item md={4} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>
                  Reporting Date<b style={{ color: "red" }}>*</b>
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="date"
                  value={meetingState.date}
                  onChange={(e) => {
                    setMeetingState({
                      ...meetingState,
                      date: e.target.value,
                      deadlinedate: "",
                    });
                    document.getElementById("deadline-date").min =
                      e.target.value;
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>
                  Reporting Time<b style={{ color: "red" }}>*</b>
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="time"
                  placeholder="HH:MM:AM/PM"
                  value={meetingState.time}
                  onChange={(e) => {
                    setMeetingState({ ...meetingState, time: e.target.value });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>
                  Deadline Date<b style={{ color: "red" }}>*</b>
                </Typography>
                <OutlinedInput
                  id="deadline-date"
                  type="date"
                  value={meetingState.deadlinedate}
                  onChange={(e) => {
                    setMeetingState({
                      ...meetingState,
                      deadlinedate: e.target.value,
                    });
                  }}
                  min={meetingState.date}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>
                  Deadline Time<b style={{ color: "red" }}>*</b>
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="time"
                  placeholder="HH:MM:AM/PM"
                  value={meetingState.deadlinetime}
                  onChange={(e) => {
                    setMeetingState({
                      ...meetingState,
                      deadlinetime: e.target.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>
                  Round<b style={{ color: "red" }}>*</b>
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={firstRound}
                  readOnly
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>
                  Mode<b style={{ color: "red" }}>*</b>
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={interviewgrouping?.mode}
                  readOnly
                />
              </FormControl>
            </Grid>
            {interviewgrouping?.mode === "Online or Interview Test" && (
              <Grid item md={4} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    TestName<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={interviewgrouping?.testname}
                    readOnly
                  />
                </FormControl>
              </Grid>
            )}
            {interviewgrouping?.mode === "Questions" && (
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Type<b style={{ color: "red" }}>*</b>
                  </Typography>

                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={interviewgrouping.type}
                    readOnly
                  />
                </FormControl>
              </Grid>
            )}

            <Grid item md={4} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Category<b style={{ color: "red" }}>*</b>
                </Typography>

                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={interviewgrouping.category}
                  readOnly
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Sub Category<b style={{ color: "red" }}>*</b>
                </Typography>

                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={interviewgrouping?.subcategory}
                  readOnly
                />
              </FormControl>
            </Grid>

            <Grid item md={4} xs={12} sm={6}>
              <Typography>
                Duration<b style={{ color: "red" }}>*</b>
              </Typography>
              <OutlinedInput
                id="component-outlined"
                type="text"
                value={interviewgrouping?.duration}
                readOnly
              />
            </Grid>

            <Grid item md={12} xs={12} sm={12}></Grid>
            <Grid item md={12} xs={12} sm={12}>
              <Typography sx={{ fontWeight: "bold" }}>Interviewer</Typography>
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>
                  Company <b style={{ color: "red" }}>*</b>
                </Typography>
                <MultiSelect
                  options={[
                    ...new Set(
                      interviwerDatas
                        ?.filter((data) => data?.round?.includes(firstRound))
                        ?.map((item) => item.tocompany)
                    ),
                  ].map((company) => ({ label: company, value: company }))}
                  value={selectedOptionsCompanyHost}
                  onChange={(e) => {
                    handleCompanyHostChange(e);
                  }}
                  valueRenderer={customValueRendererCompanyHost}
                  labelledBy="Please Select Company"
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>
                  Branch<b style={{ color: "red" }}>*</b>
                </Typography>
                <MultiSelect
                  options={[
                    ...new Set(
                      interviwerDatas
                        ?.filter(
                          (u) =>
                            valueCompanyHostCat?.includes(u.tocompany) &&
                            u?.round?.includes(firstRound)
                        )
                        .map((item) => item.tobranch)
                    ),
                  ].map((branch) => ({ label: branch, value: branch }))}
                  value={selectedOptionsBranchHost}
                  onChange={(e) => {
                    handleBranchHostChange(e);
                  }}
                  valueRenderer={customValueRendererBranchHost}
                  labelledBy="Please Select Branch"
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>
                  Unit<b style={{ color: "red" }}>*</b>
                </Typography>
                <MultiSelect
                  options={[
                    ...new Set(
                      interviwerDatas
                        ?.filter(
                          (u) =>
                            valueCompanyHostCat?.includes(u.tocompany) &&
                            valueBranchHostCat?.includes(u.tobranch) &&
                            u?.round?.includes(firstRound)
                        )
                        .map((item) => item.tounit)
                    ),
                  ].map((unit) => ({ label: unit, value: unit }))}
                  value={selectedOptionsDepartmentHost}
                  onChange={(e) => {
                    handleDepartmentHostChange(e);
                  }}
                  valueRenderer={customValueRendererDepartmentHost}
                  labelledBy="Please Select Unit"
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>
                  Team<b style={{ color: "red" }}>*</b>
                </Typography>
                <MultiSelect
                  options={[
                    ...new Set(
                      interviwerDatas
                        ?.filter(
                          (u) =>
                            valueCompanyHostCat?.includes(u.tocompany) &&
                            valueBranchHostCat?.includes(u.tobranch) &&
                            valueDepartmentHostCat?.includes(u.tounit) &&
                            u?.round?.includes(firstRound)
                        )
                        .map((item) => item.toteam)
                    ),
                  ].map((team) => ({ label: team, value: team }))}
                  value={selectedOptionsTeamHost}
                  onChange={(e) => {
                    handleTeamHostChange(e);
                  }}
                  valueRenderer={customValueRendererTeamHost}
                  labelledBy="Please Select Team"
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>
                  Interviewer<b style={{ color: "red" }}>*</b>
                </Typography>
                <MultiSelect
                  options={[
                    ...new Set(
                      interviwerDatas
                        ?.filter(
                          (u) =>
                            valueCompanyHostCat?.includes(u.tocompany) &&
                            valueBranchHostCat?.includes(u.tobranch) &&
                            valueDepartmentHostCat?.includes(u.tounit) &&
                            valueTeamHostCat?.includes(u.toteam) &&
                            u?.round?.includes(firstRound)
                        )
                        ?.flatMap((item) => item?.employee ?? [])
                    ),
                  ].map((employee) => ({ label: employee, value: employee }))}
                  value={selectedOptionsCateHost}
                  onChange={handleCategoryChangeHost}
                  valueRenderer={customValueRendererCateHost}
                  labelledBy="Please Select Participants"
                />
              </FormControl>
            </Grid>
          </Grid>
          <br />
          <br />
          <br />
          <Grid container>
            <Grid item md={3} xs={12} sm={6}>
              {/* {isUserRoleCompare?.includes("sschedulemeeting") && ( */}
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                {" "}
                Submit{" "}
              </Button>
              {/* )} */}
            </Grid>
            {/* <Grid item md={3} xs={12} sm={6}>
              <Button sx={userStyle.btncancel} onClick={handleclear}>
                {" "}
                Clear{" "}
              </Button>
            </Grid> */}
            <Grid item md={3} xs={12} sm={6}>
              <Button
                sx={userStyle.btncancel}
                onClick={handleClickCloseMeetingPopup}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </>
      </Box>
      {/* )} */}

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
      <Dialog
        open={isDeleteOpenalert}
        onClose={handleCloseModalert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
        >
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "70px", color: "orange" }}
          />
          <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
            Please Select any Row
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            variant="contained"
            color="error"
            onClick={handleCloseModalert}
          >
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
export default ScheduleInterview;
