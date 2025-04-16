import React, { useState, useEffect, useRef, useContext } from "react";

import { BASE_URL } from "../../services/Authservice";
import StyledDataGrid from "../../components/TableStyle";
import { handleApiError } from "../../components/Errorhandling";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Container,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Popover,
  TextField,
  Checkbox,
  FormControl,
  Grid,
  OutlinedInput,
  IconButton,
  Divider,
} from "@mui/material";
import "react-notifications/lib/notifications.css";
import Selects from "react-select";
import { userStyle } from "../../pageStyle";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import { SERVICE } from "../../services/Baseservice";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { CopyToClipboard } from "react-copy-to-clipboard";
import axios from "axios";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { AuthContext } from "../../context/Appcontext";
import { AUTH } from "../../services/Authservice";
import PinIcon from "@mui/icons-material/Pin";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { styled } from "@mui/system";
import Resizable from "react-resizable";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import MessageAlert from "../../components/MessageAlert";
import AlertDialog from "../../components/Alert";
import { DeleteConfirmation } from "../../components/DeleteConfirmation.js";
import PageHeading from "../../components/PageHeading";

const Myteampassword = () => {
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
  };
  const handleClosePopupMalert = () => {
    setOpenPopupMalert(false);
  };
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const [openPopupNew, setPopupNew] = useState(false);
  const handleClickOpenPopup = () => {
    setPopupNew(true);
  };
  const handleClosePopup = () => {
    setPopupNew(false);
  };
  const [emphierarchy, setEmphierarchy] = useState([]);
  const modeDropDowns = [
    { label: "My Hierarchy List", value: "myhierarchy" },
    { label: "All Hierarchy List", value: "allhierarchy" },
    { label: "My + All Hierarchy List", value: "myallhierarchy" },
  ];
  const sectorDropDowns = [
    { label: "Primary", value: "Primary" },
    { label: "Secondary", value: "Secondary" },
    { label: "Tertiary", value: "Tertiary" },
    { label: "All", value: "all" },
  ];
  const [modeselection, setModeSelection] = useState({
    label: "My Hierarchy List",
    value: "myhierarchy",
  });
  const [sectorSelection, setSectorSelection] = useState({
    label: "Primary",
    value: "Primary",
  });
  const handleCopy = () => {
    NotificationManager.success("Copied! 👍", "", 2000);
  };
  const {
    isUserRoleCompare,
    isUserRoleAccess,
    allUsersData,
    isAssignBranch,
    pageName,
    setPageName,
    listPageAccessMode,
  } = useContext(UserRoleAccessContext);

  let listpageaccessby =
    listPageAccessMode?.find(
      (data) =>
        data.modulename === "Settings" &&
        data.submodulename === "Team Credentials" &&
        data.mainpagename === "" &&
        data.subpagename === "" &&
        data.subsubpagename === ""
    )?.listpageaccessmode || "Overall";
  const { auth } = useContext(AuthContext);
  const componentRef = useRef();
  const [loading, setLoading] = useState(true);
  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };
  //view popup
  const [openView, setOpenView] = useState(false);
  const handleViewOpen = () => {
    setOpenView(true);
    setOtp("");
  };
  const handlViewClose = () => {
    setOpenView(false);
    setOtp("");
  };
  //otp popup
  const [openOTPView, setOpenOTPView] = useState(false);
  const [otp, setOtp] = useState("");
  const handleViewOpenOTP = () => {
    setOpenOTPView(true);
  };
  const handlViewCloseOTP = () => {
    setOpenOTPView(false);
    setOtp("");
  };
  const [dateValue, setDateValue] = useState([]);
  const [timeValue, setTimeValue] = useState([]);
  const [dateValueRandom, setDateValueRandom] = useState([]);
  const [timeValueRandom, setTimeValueRandom] = useState([]);
  const [dateValueMultiFrom, setDateValueMultiFrom] = useState([]);
  const [dateValueMultiTo, setDateValueMultiTo] = useState([]);
  const [firstDateValue, setFirstDateValue] = useState([]);
  const [firstTimeValue, setFirstTimeValue] = useState([]);
  const [secondDateValue, setSecondDateValue] = useState([]);
  const [secondTimeValue, setSecondTimeValue] = useState([]);
  const [upload, setUpload] = useState([]);
  const [uploadEdit, setUploadEdit] = useState([]);
  const [isBankdetail, setBankdetail] = useState(false);
  const renderFilePreviewEdit = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };
  const handleResumeUpload = (event) => {
    const resume = event.target.files;
    for (let i = 0; i < resume.length; i++) {
      const reader = new FileReader();
      const file = resume[i];
      reader.readAsDataURL(file);
      reader.onload = () => {
        setUpload((prevFiles) => [
          ...prevFiles,
          {
            name: file.name,
            preview: reader.result,
            data: reader.result.split(",")[1],
            remark: "resume file",
          },
        ]);
      };
    }
  };
  const handleResumeUploadEdit = (event) => {
    const resume = event.target.files;
    for (let i = 0; i < resume.length; i++) {
      const reader = new FileReader();
      const file = resume[i];
      reader.readAsDataURL(file);
      reader.onload = () => {
        setUploadEdit((prevFiles) => [
          ...prevFiles,
          {
            name: file.name,
            preview: reader.result,
            data: reader.result.split(",")[1],
            remark: "resume file",
          },
        ]);
      };
    }
  };
  const handleFileDelete = (index) => {
    setUpload((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };
  const handleFileDeleteEdit = (index) => {
    setUploadEdit((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };
  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };
  const [passwordVisibility, setPasswordVisibility] = useState({});
  const handleClickShowLivePassword = (rowIndex) => {
    setPasswordVisibility((prevVisibility) => ({
      ...prevVisibility,
      [rowIndex]: !prevVisibility[rowIndex],
    }));
  };
  const handleMouseDownLivePassword = (event) => {
    event.preventDefault();
  };
  useEffect(() => {
    // fetchAllCredientials();
    fetchAllMyCheckListDetails();
  }, []);
  const [isMyCreationOpen, setIsMyCreationOpen] = useState(false);
  //add model...
  const handleClickOpenMyCreation = () => {
    setIsMyCreationOpen(true);
  };
  const handleClickCloseMyCreation = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsMyCreationOpen(false);
    setShowPassword(false);
    setSubCategoryOption([]);
    setMyCreation({
      type: "Password",
      category: "Please Select Category",
      subcategory: "Please Select Sub Category",
      username: "",
      password: "",
    });
  };
  const [isMyCreationOpenEdit, setIsMyCreationOpenEdit] = useState(false);
  //Edit model...
  const handleClickOpenMyCreationEdit = () => {
    setIsMyCreationOpenEdit(true);
  };
  const handleClickCloseMyCreationEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsMyCreationOpenEdit(false);
    setShowPasswordEdit(false);
    setSubCategoryOption([]);
  };
  const [isMyCreationOpenView, setIsMyCreationOpenView] = useState(false);
  //Edit model...
  const handleClickOpenMyCreationView = () => {
    setIsMyCreationOpenView(true);
  };
  const handleClickCloseMyCreationView = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsMyCreationOpenView(false);
  };
  const [groups, setGroups] = useState([]);
  const fetchAllMyCheckListDetails = async () => {
    setPageName(!pageName);
    try {
      const [resFromCheckList, resFromCandidates] = await Promise.all([
        axios.get(SERVICE.MYCHECKLIST, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.get(SERVICE.CANDIDATESALLBYRESTRICTION, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
      ]);
      let users = allUsersData;
      let isHiringManager = isUserRoleAccess?.role?.some(
        (role) => role.replace(" ", "").toLowerCase() === "hiringmanager"
      );
      if (isHiringManager) {
        let filteredDatas = resFromCheckList?.data?.mychecklist?.filter(
          (item) => {
            return users?.some((data) => item?.commonid == data?.candidateid);
          }
        );
        let hrDatas = filteredDatas?.flatMap((data) => {
          return data?.groups
            .filter(
              (group) =>
                group.information === "HR" || group.information === "Both"
            )
            .map((group) => ({
              ...group,
              candidatename: data?.candidatename,
            }));
        });
        setGroups(hrDatas);
        let forFillDetails = hrDatas?.map((data) => {
          if (data.checklist === "Date Multi Random Time") {
            if (data?.data && data?.data !== "") {
              const [date, time] = data?.data?.split(" ");
              return { date, time };
            }
          } else {
            return { date: "0", time: "0" };
          }
        });
        let forDateSpan = hrDatas?.map((data) => {
          if (data.checklist === "Date Multi Span") {
            if (data?.data && data?.data !== "") {
              const [fromdate, todate] = data?.data?.split(" ");
              return { fromdate, todate };
            }
          } else {
            return { fromdate: "0", todate: "0" };
          }
        });
        let forDateTime = hrDatas?.map((data) => {
          if (data.checklist === "DateTime") {
            if (data?.data && data?.data !== "") {
              const [date, time] = data?.data?.split(" ");
              return { date, time };
            }
          } else {
            return { date: "0", time: "0" };
          }
        });
        let forDateMultiSpanTime = hrDatas?.map((data) => {
          if (data.checklist === "Date Multi Span Time") {
            if (data?.data && data?.data !== "") {
              const [from, to] = data?.data?.split("/");
              const [fromdate, fromtime] = from?.split(" ");
              const [todate, totime] = to?.split(" ");
              return { fromdate, fromtime, todate, totime };
            }
          } else {
            return { fromdate: "0", fromtime: "0", todate: "0", totime: "0" };
          }
        });
        setDateValueMultiFrom(forDateSpan.map((item) => item?.fromdate));
        setDateValueMultiTo(forDateSpan.map((item) => item?.todate));
        setDateValueRandom(forFillDetails.map((item) => item?.date));
        setTimeValueRandom(forFillDetails.map((item) => item?.time));
        setDateValue(forDateTime.map((item) => item?.date));
        setTimeValue(forDateTime.map((item) => item?.time));
        setFirstDateValue(forDateMultiSpanTime.map((item) => item?.fromdate));
        setFirstTimeValue(forDateMultiSpanTime.map((item) => item?.fromtime));
        setSecondDateValue(forDateMultiSpanTime.map((item) => item?.todate));
        setSecondTimeValue(forDateMultiSpanTime.map((item) => item?.totime));
      } else {
        let foundData = resFromCheckList?.data?.mychecklist?.find(
          (data) => data?.commonid == isUserRoleAccess?.candidateid
        );
        if (foundData) {
          let showData = foundData.groups
            .filter((item) => {
              return (
                item.information == "Candidates" || item.information == "Both"
              );
            })
            .map((newItem) => {
              return {
                ...newItem,
                candidatename: foundData?.candidatename,
              };
            });
          setGroups(showData);
          let forFillDetails = showData?.map((data) => {
            if (data.checklist === "Date Multi Random Time") {
              if (data?.data && data?.data !== "") {
                const [date, time] = data?.data?.split(" ");
                return { date, time };
              }
            } else {
              return { date: "0", time: "0" };
            }
          });
          let forDateSpan = showData?.map((data) => {
            if (data.checklist === "Date Multi Span") {
              if (data?.data && data?.data !== "") {
                const [fromdate, todate] = data?.data?.split(" ");
                return { fromdate, todate };
              }
            } else {
              return { fromdate: "0", todate: "0" };
            }
          });
          let forDateTime = showData?.map((data) => {
            if (data.checklist === "DateTime") {
              if (data?.data && data?.data !== "") {
                const [date, time] = data?.data?.split(" ");
                return { date, time };
              }
            } else {
              return { date: "0", time: "0" };
            }
          });
          let forDateMultiSpanTime = showData?.map((data) => {
            if (data.checklist === "Date Multi Span Time") {
              if (data?.data && data?.data !== "") {
                const [from, to] = data?.data?.split("/");
                const [fromdate, fromtime] = from?.split(" ");
                const [todate, totime] = to?.split(" ");
                return { fromdate, fromtime, todate, totime };
              }
            } else {
              return { fromdate: "0", fromtime: "0", todate: "0", totime: "0" };
            }
          });
          setDateValueMultiFrom(forDateSpan.map((item) => item?.fromdate));
          setDateValueMultiTo(forDateSpan.map((item) => item?.todate));
          setDateValueRandom(forFillDetails.map((item) => item?.date));
          setTimeValueRandom(forFillDetails.map((item) => item?.time));
          setDateValue(forDateTime.map((item) => item?.date));
          setTimeValue(forDateTime.map((item) => item?.time));
          setFirstDateValue(forDateMultiSpanTime.map((item) => item?.fromdate));
          setFirstTimeValue(forDateMultiSpanTime.map((item) => item?.fromtime));
          setSecondDateValue(forDateMultiSpanTime.map((item) => item?.todate));
          setSecondTimeValue(forDateMultiSpanTime.map((item) => item?.totime));
        } else {
          setGroups([]);
        }
      }
      setLoading(true);
    } catch (err) {
      setLoading(true);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const [allCredentials, setAllCredentials] = useState([]);
  const [viewInfo, setViewInfo] = useState([]);
  const [error, setError] = useState("");
  const getviewCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_PASSWORD}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setViewInfo(res.data.spass);
      await checkOtp("allcredentialview");
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const [openPopup, setOpenPopup] = useState("");
  const checkOtp = async (from) => {
    setPageName(!pageName);
    try {
      let response = await axios.post(`${AUTH.VERIFYVIEWPASSWORD}`, {
        otp: String(otp),
        id: String(isUserRoleAccess?._id),
      });
      if (response.data.otpneeded == true) {
        setOpenPopup(from);
        handleViewOpenOTP();
      } else {
        if (from === "allcredentialview") {
          handleViewOpen();
        } else if (from === "mycreationview") {
          handleClickOpenMyCreationView();
        } else if (from === "mycreationedit") {
          handleClickOpenMyCreationEdit();
        } else if (from === "mycreationdelete") {
          setIsDeleteOpen(true);
        }
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const verifyOtp = async () => {
    setPageName(!pageName);
    try {
      if (otp != "") {
        let response = await axios.post(`${AUTH.VERIFYVIEWPASSWORD}`, {
          otp: String(otp),
          id: String(isUserRoleAccess?._id),
        });
        if (response?.data?.success == true) {
          handlViewCloseOTP();
          if (openPopup === "allcredentialview") {
            handleViewOpen();
          } else if (openPopup === "mycreationview") {
            handleClickOpenMyCreationView();
          } else if (openPopup === "mycreationedit") {
            handleClickOpenMyCreationEdit();
          } else if (openPopup === "mycreationdelete") {
            setIsDeleteOpen(true);
          }
        } else {
          handlViewClose();
        }
        setError("");
      } else {
        setError("Please Enter OTP");
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const [categoryOption, setCategoryOption] = useState([]);
  const [subCategoryOption, setSubCategoryOption] = useState([]);
  const [allMyCreation, setAllMyCreation] = useState([]);
  const [allMyCreationEdit, setAllMyCreationEdit] = useState([]);
  //my creation add pasword visibility
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  //my creation edit pasword visibility
  const [showPasswordEdit, setShowPasswordEdit] = useState(false);
  const handleClickShowPasswordEdit = () =>
    setShowPasswordEdit((show) => !show);
  const handleMouseDownPasswordEdit = (event) => {
    event.preventDefault();
  };
  //my creation table password visibility
  const [myCreation, setMyCreation] = useState({
    type: "Password",
    category: "Please Select Category",
    subcategory: "Please Select Sub Category",
    username: "",
    password: "",
  });
  const [myCreationEdit, setMyCreationEdit] = useState({});
  useEffect(() => {
    fetchCategoryAll();
    fetchAllMyCreation();
  }, []);
  const fetchCategoryAll = async () => {
    setPageName(!pageName);
    try {
      let response = await axios.get(`${SERVICE.PASSCATEGORYDOCUMENT}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      let catOpt = [
        ...response?.data?.passcategory?.map((t) => ({
          ...t,
          label: t.categoryname,
          value: t.categoryname,
        })),
      ];
      setCategoryOption(catOpt);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //function to fetch sub category  based on category
  const fetchSubCategory = async (e, type) => {
    setPageName(!pageName);
    try {
      let res_unit = await axios.post(SERVICE.SUB_CAT, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
        category: String(e),
        type,
      });
      let subcatOpt = res_unit?.data?.subcat
        ?.map((item) => {
          return item.subcategoryname.map((subcategory) => {
            return {
              label: subcategory,
              value: subcategory,
            };
          });
        })
        .flat();
      setSubCategoryOption(subcatOpt);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const TableHierachylist = async (e) => {
    setBankdetail(true);
    setPageName(!pageName);
    try {
      let Res = await axios.post(SERVICE.HIERARCHI_SALARY_FILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        hierachy: modeselection.value,
        sector: sectorSelection.value,
        username: isUserRoleAccess.companyname,
        team: isUserRoleAccess.team,
        listpageaccessmode: listpageaccessby,
      });
      setEmphierarchy(Res?.data?.resultAccessFilter);
      let res_queue = await axios.get(SERVICE.ALL_PASSWORD, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const filteredCredentials = res_queue?.data?.pass?.filter((item) => {
        const filterCompanyNames = Res?.data?.resultAccessFilter?.map(
          (resItem) => resItem?.companyname?.toLowerCase()?.trim()
        );
        const isIncluded = filterCompanyNames?.includes(
          item?.employeename?.toLowerCase()?.trim()
        );
        return isIncluded;
      });
      setAllCredentials(filteredCredentials);
      setBankdetail(false);
    } catch (err) {
      setBankdetail(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const handleClear = async (e) => {
    e.preventDefault();
    setEmphierarchy([]);
    setAllCredentials([]);
    setModeSelection({ label: "My Hierarchy List", value: "myhierarchy" });
    setSectorSelection({ label: "Primary", value: "Primary" });
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };
  //submit option for saving
  const handleSubmit = (e) => {
    const isNameMatch = allMyCreation?.some(
      (item) =>
        item.type === myCreation?.type &&
        item.category === myCreation?.category &&
        item.subcategory === myCreation?.subcategory &&
        item.username.toLowerCase() === myCreation?.username.toLowerCase()
    );
    if (myCreation?.type === "") {
      setPopupContentMalert("Please Select Type");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (myCreation?.category === "Please Select Category") {
      setPopupContentMalert("Please Select Category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (myCreation?.subcategory === "Please Select Sub Category") {
      setPopupContentMalert("Please Select Sub Category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (myCreation?.username == "") {
      setPopupContentMalert("Please Enter Username");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (myCreation?.password == "") {
      setPopupContentMalert("Please Enter Password");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Data Already Exist");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };
  const sendRequest = async () => {
    setPageName(!pageName);
    try {
      let statusCreate = await axios.post(SERVICE.CREATE_MYCREATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        type: String(myCreation.type),
        category: String(myCreation.category),
        subcategory: String(myCreation.subcategory),
        username: String(myCreation.username),
        password: String(myCreation.password),
        employeedbid: String(isUserRoleAccess?._id),
        files: [...upload],
        by: [
          {
            name: String(isUserRoleAccess?.username),
            date: String(new Date()),
          },
        ],
      });
      setMyCreation({
        type: "Password",
        category: "Please Select Category",
        subcategory: "Please Select Sub Category",
        username: "",
        password: "",
      });
      setShowPassword(false);
      setSubCategoryOption([]);
      await fetchAllMyCreation();
      handleClickCloseMyCreation();
      setPopupContent(" Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //edit submit option for saving
  const editSubmit = (e) => {
    const isNameMatch = allMyCreationEdit?.some(
      (item) =>
        item.type === myCreationEdit?.type &&
        item.category === myCreationEdit?.category &&
        item.subcategory === myCreationEdit?.subcategory &&
        item.username.toLowerCase() === myCreationEdit?.username.toLowerCase()
    );
    if (myCreationEdit?.type === "") {
      setPopupContentMalert("Please Select Type");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (myCreationEdit?.category === "Please Select Category") {
      setPopupContentMalert("Please Select Category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (myCreationEdit?.subcategory === "Please Select Sub Category") {
      setPopupContentMalert("Please Select Sub Category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (myCreationEdit?.username == "") {
      setPopupContentMalert("Please Enter Username");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (myCreationEdit?.password == "") {
      setPopupContentMalert("Please Enter Password");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Data Already Exist");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendEditRequest();
    }
  };
  const sendEditRequest = async () => {
    setPageName(!pageName);
    try {
      let statusCreate = await axios.put(
        `${SERVICE.SINGLE_MYCREATION}/${myCreationEdit._id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          type: String(myCreationEdit.type),
          category: String(myCreationEdit.category),
          subcategory: String(myCreationEdit.subcategory),
          username: String(myCreationEdit.username),
          password: String(myCreationEdit.password),
          employeedbid: String(isUserRoleAccess?._id),
          files: [...uploadEdit],
          updatedby: [
            ...myCreationEdit?.updatedby,
            {
              name: String(isUserRoleAccess?.username),
              date: String(new Date()),
            },
          ],
        }
      );
      setMyCreationEdit({
        type: "Password",
        category: "Please Select Category",
        subcategory: "Please Select Sub Category",
        username: "",
        password: "",
      });
      setShowPasswordEdit(false);
      setSubCategoryOption([]);
      await fetchAllMyCreation();
      handleClickCloseMyCreationEdit();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const fetchAllMyCreation = async () => {
    setPageName(!pageName);
    try {
      let res_doc = await axios.get(SERVICE.GET_MYCREATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAllMyCreation(
        res_doc?.data.mycreation.filter(
          (item) => item.employeedbid === isUserRoleAccess?._id
        )
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const [deleteMycreationID, setDeleteMyCreationID] = useState("");
  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const handleClickOpen = async () => {
    await checkOtp("mycreationdelete");
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };
  const deleteMyCreation = async (e) => {
    setPageName(!pageName);
    try {
      await axios.delete(`${SERVICE.SINGLE_MYCREATION}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      handleCloseMod();
      await fetchAllMyCreation();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //get single row to edit....
  const getCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_MYCREATION}/${e}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setMyCreationEdit(res?.data?.smycreation);
      setUploadEdit(res?.data?.smycreation?.files);
      let removeCurrentdata = allMyCreation.filter((item) => item._id !== e);
      setAllMyCreationEdit(removeCurrentdata);
      fetchSubCategory(res?.data?.smycreation?.category, "Password");
      await checkOtp("mycreationedit");
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const [myCreationView, setMyCreationView] = useState({});
  //get single row to view....
  const getMyCreationViewCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_MYCREATION}/${e}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setMyCreationView(res?.data?.smycreation);
      await checkOtp("mycreationview");
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Area.png");
        });
      });
    }
  };
  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  const handleSelectionChangeNear = (newSelection) => {
    setSelectedRowsNear(newSelection.selectionModel);
  };
  const [isBtn, setIsBtn] = useState(false);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  // Styles for the resizable column

  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };
  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    username: true,
    originalpassword: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );
  //table entries ..,.
  const [items, setItems] = useState([]);
  const addSerialNumber = () => {
    const itemsWithSerialNumber = emphierarchy?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };
  useEffect(() => {
    addSerialNumber();
  }, [emphierarchy]);
  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSelectedRows([]);
    setSelectAllChecked(false);
  };
  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
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
  const filteredData = filteredDatas.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const totalPages = Math.ceil(filteredDatas.length / pageSize);
  const visiblePages = Math.min(totalPages, 3);
  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(
    firstVisiblePage + visiblePages - 1,
    totalPages
  );
  const pageNumbers = [];
  const indexOfLastItem = page * pageSize;
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
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 90,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "username",
      headerName: "User Name",
      flex: 0,
      width: 200,
      hide: !columnVisibility.username,
      headerClassName: "bold-header",
    },
    {
      field: "originalpassword",
      headerName: "Password",
      flex: 0,
      width: 200,
      hide: !columnVisibility.originalpassword,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Typography
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <div>
            {passwordVisibility[params.row.id] ? (
              <>{params?.row?.originalpassword}</>
            ) : (
              <>
                {params?.row?.originalpassword
                  ?.split("")
                  ?.map((char, index) => (
                    <span key={index}>●</span>
                  ))}
              </>
            )}
          </div>
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0,
      width: 200,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <>
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
              >
                <CopyToClipboard
                  onCopy={handleCopy}
                  options={{ message: "Copied!" }}
                  text={params.row.originalpassword}
                >
                  <ContentCopyIcon />
                </CopyToClipboard>
              </Typography>
              &nbsp;
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => handleClickShowLivePassword(params?.row?.id)}
                onMouseDown={handleMouseDownLivePassword}
                edge="end"
              >
                {!passwordVisibility[params.row.id] ? (
                  <Visibility sx={{ fontSize: "25px" }} />
                ) : (
                  <VisibilityOff sx={{ fontSize: "25px" }} />
                )}
              </IconButton>
            </div>
          </Typography>
          &ensp; &ensp;
          <Button
            variant="contained"
            onClick={() => handleClickEmailFunc(params.row)}
          >
            Reset
          </Button>
        </>
      ),
    },
  ];
  const handleClickEmailFunc = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.post(`${SERVICE.USER_CREDENTIALS}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
        username: e.username,
      });
      let answer = res?.data?.users[0];
      let { companyname, email, username, _id } = answer;
      let pagelink = `${BASE_URL}/usercredentials/reset/${_id}`;
      if (res?.data?.users?.length > 0) {
        const response = await fetch(SERVICE.USER_CREDENTIALS_MAIL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            companyname,
            email,
            pagelink,
          }),
        });
        if (response.ok) {
          NotificationManager.success("Email Sent Successfully 👍", "", 2000);
        } else {
        }
      }
      if (res?.data?.users?.length > 0) {
        let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${_id}`, {
          headers: { Authorization: `Bearer ${auth.APIToken}` },
          resetstatus: false,
        });
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const rowDataTable = filteredData?.map((item, index) => {
    return {
      id: index,
      serialNumber: item.serialNumber,
      username: item.username,
      originalpassword: item.originalpassword,
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
        <TextField
          label="Find column"
          variant="standard"
          fullWidth
          value={searchQueryManage}
          onChange={(e) => setSearchQueryManage(e.target.value)}
          sx={{ marginBottom: 5, position: "absolute" }}
        />
      </Box>
      <br />
      <br />
      <DialogContent
        sx={{ minWidth: "auto", height: "200px", position: "relative" }}
      >
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumns.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={
                  <Switch
                    sx={{ marginTop: "-5px" }}
                    size="small"
                    checked={columnVisibility[column.field]}
                    onChange={() => toggleColumnVisibility(column.field)}
                  />
                }
                secondary={
                  column.field === "checkbox" ? "Checkbox" : column.headerName
                }
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
              sx={{ textTransform: "none" }}
              onClick={() => setColumnVisibility(initialColumnVisibility)}
            >
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
  //near
  const gridRefNeartat = useRef(null);
  const [selectedRowsNear, setSelectedRowsNear] = useState([]);
  //Datatable neartat
  const [pageNearTatPrimary, setPageNearTatPrimary] = useState(1);
  const [pageSizeNearTatPrimary, setPageSizeNearTatPrimary] = useState(10);
  const [searchQueryManageNeartat, setSearchQueryManageNeartat] = useState("");
  // Manage Columns
  const [isManageColumnsOpenNeartat, setManageColumnsOpenNeartat] =
    useState(false);
  const [anchorElNeartat, setAnchorElNeartat] = useState(null);
  const handleOpenManageColumnsNeartat = (event) => {
    setAnchorElNeartat(event.currentTarget);
    setManageColumnsOpenNeartat(true);
  };
  const handleCloseManageColumnsNeartat = () => {
    setManageColumnsOpenNeartat(false);
    setSearchQueryManageNeartat("");
  };
  const openneartat = Boolean(anchorElNeartat);
  const idneartat = openneartat ? "simple-popover" : undefined;
  const getRowClassNameNearTat = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };
  const initialColumnVisibilityNeartat = {
    serialNumber: true,
    checkbox: true,
    type: true,
    category: true,
    subcategory: true,
    username: true,
    actions: true,
  };
  const [columnVisibilityNeartat, setColumnVisibilityNeartat] = useState(
    initialColumnVisibilityNeartat
  );
  const [itemsneartat, setItemsNearTat] = useState([]);
  //serial no for listing items
  const addSerialNumberNearTat = () => {
    const itemsWithSerialNumber = allCredentials?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItemsNearTat(itemsWithSerialNumber);
  };
  useEffect(() => {
    addSerialNumberNearTat();
  }, [allCredentials]);
  //Datatable
  const handlePageChangeNearTatPrimary = (newPage) => {
    setPageNearTatPrimary(newPage);
  };
  const handlePageSizeChangeNearTatPrimary = (event) => {
    setPageSizeNearTatPrimary(Number(event.target.value));
    setPageNearTatPrimary(1);
  };
  //datatable....
  const [searchQueryNearTatPrimary, setSearchQueryNearTatPrimary] =
    useState("");
  const handleSearchChangeNearTatPrimary = (event) => {
    setSearchQueryNearTatPrimary(event.target.value);
  };
  const searchOverNearTerms = searchQueryNearTatPrimary
    .toLowerCase()
    .split(" ");
  // Modify the filtering logic to check each term
  const filteredDatasNearTatPrimary = itemsneartat?.filter((item) => {
    return searchOverNearTerms.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
  });
  const filteredDataNearTatPrimary = filteredDatasNearTatPrimary?.slice(
    (pageNearTatPrimary - 1) * pageSizeNearTatPrimary,
    pageNearTatPrimary * pageSizeNearTatPrimary
  );
  const totalPagesNearTatPrimary = Math.ceil(
    filteredDatasNearTatPrimary?.length / pageSizeNearTatPrimary
  );
  const visiblePagesNearTatPrimary = Math.min(totalPagesNearTatPrimary, 3);
  const firstVisiblePageNearTatPrimary = Math.max(1, pageNearTatPrimary - 1);
  const lastVisiblePageNearTatPrimary = Math.min(
    Math.abs(firstVisiblePageNearTatPrimary + visiblePagesNearTatPrimary - 1),
    totalPagesNearTatPrimary
  );
  const pageNumbersNearTatPrimary = [];
  const indexOfLastItemNearTatPrimary =
    pageNearTatPrimary * pageSizeNearTatPrimary;
  const indexOfFirstItemNearTatPrimary =
    indexOfLastItemNearTatPrimary - pageSizeNearTatPrimary;
  for (
    let i = firstVisiblePageNearTatPrimary;
    i <= lastVisiblePageNearTatPrimary;
    i++
  ) {
    pageNumbersNearTatPrimary.push(i);
  }
  const columnDataTableNeartat = [
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 80,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "type",
      headerName: "Type",
      flex: 0,
      width: 150,
      hide: !columnVisibility.type,
      headerClassName: "bold-header",
    },
    {
      field: "category",
      headerName: "Category",
      flex: 0,
      width: 150,
      hide: !columnVisibility.category,
      headerClassName: "bold-header",
    },
    {
      field: "subcategory",
      headerName: "Sub Category",
      flex: 0,
      width: 150,
      hide: !columnVisibility.subcategory,
      headerClassName: "bold-header",
    },
    {
      field: "username",
      headerName: "User Name",
      flex: 0,
      width: 150,
      hide: !columnVisibility.username,
      headerClassName: "bold-header",
    },
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
          <Button
            sx={userStyle.buttonedit}
            onClick={() => {
              getviewCode(params.row.id);
            }}
          >
            VIEW
          </Button>
        </Grid>
      ),
    },
  ];
  const rowDataTableNearTat = filteredDataNearTatPrimary.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      type: item.type,
      category: item.category,
      subcategory: item.subcategory,
      username: item.username,
    };
  });
  const rowsWithCheckboxesNear = rowDataTableNearTat.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRowsNear.includes(row.id),
  }));
  // Show All Columns functionality
  const handleShowAllColumnsNeartat = () => {
    const updatedVisibilityNeartat = { ...columnVisibilityNeartat };
    for (const columnKey in updatedVisibilityNeartat) {
      updatedVisibilityNeartat[columnKey] = true;
    }
    setColumnVisibilityNeartat(updatedVisibilityNeartat);
  };
  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibilityNeartat = localStorage.getItem(
      "columnVisibilityNeartat"
    );
    if (savedVisibilityNeartat) {
      setColumnVisibilityNeartat(JSON.parse(savedVisibilityNeartat));
    }
  }, []);
  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem(
      "columnVisibilityNeartat",
      JSON.stringify(columnVisibilityNeartat)
    );
  }, [columnVisibilityNeartat]);
  // Manage Columns functionality
  const toggleColumnVisibilityNeartat = (field) => {
    setColumnVisibilityNeartat((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };
  // Function to filter columns based on search query
  const filteredColumnsNeartat = columnDataTableNeartat.filter((column) =>
    column.headerName
      .toLowerCase()
      .includes(searchQueryManageNeartat.toLowerCase())
  );
  const manageColumnsContentNeartat = (
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
        onClick={handleCloseManageColumnsNeartat}
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
        <TextField
          label="Find column"
          variant="standard"
          fullWidth
          value={searchQueryManageNeartat}
          onChange={(e) => setSearchQueryManageNeartat(e.target.value)}
          sx={{ marginBottom: 5, position: "absolute" }}
        />
      </Box>
      <br />
      <br />
      <DialogContent
        sx={{ minWidth: "auto", height: "200px", position: "relative" }}
      >
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumnsNeartat.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={
                  <Switch
                    sx={{ marginTop: "-5px" }}
                    size="small"
                    checked={columnVisibilityNeartat[column.field]}
                    onChange={() => toggleColumnVisibilityNeartat(column.field)}
                  />
                }
                secondary={
                  column.field === "checkbox" ? "Checkbox" : column.headerName
                }
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
              sx={{ textTransform: "none" }}
              onClick={() =>
                setColumnVisibilityNeartat(initialColumnVisibilityNeartat)
              }
            >
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
                columnDataTableNeartat.forEach((column) => {
                  newColumnVisibility[column.field] = false; // Set hide property to true
                });
                setColumnVisibilityNeartat(newColumnVisibility);
              }}
            >
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );
  return (
    <Box>
      <PageHeading
        title="Manage My Credentials"
        modulename="Settings"
        submodulename="My Credentials"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />
      <Box sx={userStyle.selectcontainer}>
        <Typography sx={userStyle.HeaderText}>My Credentials</Typography>
        <br />
        <Grid container spacing={2}>
          <>
            {listpageaccessby === "Reporting to Based" ? (
              <Grid item lg={2} md={2.5} xs={12} sm={6}>
                <Typography> Filter By </Typography>
                <TextField readOnly size="small" value={listpageaccessby} />
              </Grid>
            ) : (
              <>
                <Grid item lg={2} md={2.5} xs={12} sm={6}>
                  <Typography> Mode </Typography>
                  <Selects
                    options={modeDropDowns}
                    value={{
                      label: modeselection.label,
                      value: modeselection.value,
                    }}
                    onChange={(e) => {
                      setModeSelection(e);
                    }}
                  />
                </Grid>
                <Grid item lg={2} md={2.5} xs={12} sm={6}>
                  <Typography> Level </Typography>
                  <Selects
                    options={sectorDropDowns}
                    value={{
                      label: sectorSelection.label,
                      value: sectorSelection.value,
                    }}
                    onChange={(e) => {
                      setSectorSelection(e);
                    }}
                  />
                </Grid>
              </>
            )}
          </>
        </Grid>
        <br />
        <br />
        <br />
        <Grid
          container
          spacing={2}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Grid item lg={1} md={2} sm={2} xs={12}>
            <Button
              sx={userStyle.buttonadd}
              variant="contained"
              onClick={TableHierachylist}
            >
              {" "}
              Filter{" "}
            </Button>
          </Grid>
          <Grid item lg={1} md={2} sm={2} xs={12}>
            <Button sx={userStyle.btncancel} onClick={handleClear}>
              {" "}
              Clear{" "}
            </Button>
          </Grid>
        </Grid>
      </Box>
      <br />
      <Headtitle title={"MY CREDENTIALS"} />
      {!loading ? (
        <Box sx={userStyle.container}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              minHeight: "350px",
            }}
          >
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
        </Box>
      ) : (
        <>
          {isUserRoleCompare?.includes("lteamcredentials") && (
            <Box sx={userStyle.container}>
              <NotificationContainer />
              {/* Table 1 */}
              <Container maxWidth="md" style={{ marginTop: "50px" }}>
                <Typography>Name: HRMS</Typography>
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
                  ></Grid>
                  <Grid item md={2} xs={6} sm={6}>
                    <Box>
                      <FormControl fullWidth size="small">
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
                <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                  Show All Columns
                </Button>
                &ensp;
                <Button
                  sx={userStyle.buttongrp}
                  onClick={handleOpenManageColumns}
                >
                  Manage Columns
                </Button>
                &ensp;
                <br /> <br />
                {isBankdetail ? (
                  <>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
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
                ) : (
                  <>
                    <Box
                      style={{
                        width: "100%",
                        overflowY: "hidden", // Hide the y-axis scrollbar
                      }}
                    >
                      {/* <TableContainer component={Paper}>
                        <Table
                          aria-label="customized table"
                          id="raisetickets"
                          ref={componentRef}
                        >
                          <TableHead sx={{ fontWeight: "600", textAlign: "center" }}>
                            <StyledTableRow>
                              <StyledTableCell
                                sx={{ textAlign: "center", justifyContent: "center" }}
                              >
                                <Box sx={userStyle.tableheadstyle}>
                                  <Box
                                    sx={{
                                      textAlign: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    S.No
                                  </Box>
                                </Box>
                              </StyledTableCell>
                              <StyledTableCell>
                                <Box sx={userStyle.tableheadstyle}>
                                  <Box
                                    sx={{
                                      textAlign: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    User Name
                                  </Box>
                                </Box>
                              </StyledTableCell>
                              <StyledTableCell>
                                <Box sx={userStyle.tableheadstyle}>
                                  <Box
                                    sx={{
                                      textAlign: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    Password
                                  </Box>
                                </Box>
                              </StyledTableCell>
                            </StyledTableRow>
                          </TableHead>
                          <TableBody align="left">
                            {emphierarchy?.length > 0 ? (
                              emphierarchy?.map((row, index) => (
                                <StyledTableRow key={index}>
                                  <StyledTableCell>{index + 1}</StyledTableCell>
                                  <StyledTableCell>
                                    {row.username}
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    <Typography
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-around",
                                      }}
                                    >
                                      <div>
                                        {passwordVisibility[index] ? (
                                          <>{row?.originalpassword}</>
                                        ) : (
                                          <>
                                            {row?.originalpassword
                                              ?.split('')
                                              ?.map((char, index) => (
                                                <span key={index}>●</span>
                                              ))}
                                          </>
                                        )}
                                      </div>
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          alignItems: "center",
                                        }}
                                      >
                                        <Typography
                                          sx={{
                                            "&:hover": {
                                              cursor: "pointer",
                                            },
                                          }}
                                        >
                                          <CopyToClipboard
                                            onCopy={handleCopy}
                                            options={{ message: "Copied!" }}
                                            text={row?.originalpassword}
                                          >
                                            <ContentCopyIcon
                                              primary={row?.originalpassword}
                                            />
                                          </CopyToClipboard>
                                        </Typography>
                                        &nbsp;
                                        <IconButton
                                          aria-label="toggle password visibility"
                                          onClick={() => handleClickShowLivePassword(index)}
                                          onMouseDown={handleMouseDownLivePassword}
                                          edge="end"
                                        >
                                          {!passwordVisibility[index] ? (
                                            <Visibility sx={{ fontSize: '25px' }} />
                                          ) : (
                                            <VisibilityOff sx={{ fontSize: '25px' }} />
                                          )}
                                        </IconButton>
                                      </div>
                                    </Typography>
                                  </StyledTableCell>
                                </StyledTableRow>
                              ))
                            ) : (
                              <StyledTableRow>
                                <StyledTableCell
                                  colSpan={12}
                                  sx={{
                                    height: "50px",
                                  }}
                                  align="center"
                                >
                                  No Data Available
                                </StyledTableCell>
                              </StyledTableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer> */}
                      <StyledDataGrid
                        onClipboardCopy={(copiedString) =>
                          setCopiedData(copiedString)
                        }
                        rows={rowsWithCheckboxes}
                        columns={columnDataTable.filter(
                          (column) => columnVisibility[column.field]
                        )}
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
                        Showing{" "}
                        {filteredData.length > 0
                          ? (page - 1) * pageSize + 1
                          : 0}{" "}
                        to {Math.min(page * pageSize, filteredDatas.length)} of{" "}
                        {filteredDatas.length} entries
                      </Box>
                      <Box>
                        <Button
                          onClick={() => setPage(1)}
                          disabled={page === 1}
                          sx={userStyle.paginationbtn}
                        >
                          <FirstPageIcon />
                        </Button>
                        <Button
                          onClick={() => handlePageChange(page - 1)}
                          disabled={page === 1}
                          sx={userStyle.paginationbtn}
                        >
                          <NavigateBeforeIcon />
                        </Button>
                        {pageNumbers?.map((pageNumber) => (
                          <Button
                            key={pageNumber}
                            sx={userStyle.paginationbtn}
                            onClick={() => handlePageChange(pageNumber)}
                            className={page === pageNumber ? "active" : ""}
                            disabled={page === pageNumber}
                          >
                            {pageNumber}
                          </Button>
                        ))}
                        {lastVisiblePage < totalPages && <span>...</span>}
                        <Button
                          onClick={() => handlePageChange(page + 1)}
                          disabled={page === totalPages}
                          sx={userStyle.paginationbtn}
                        >
                          <NavigateNextIcon />
                        </Button>
                        <Button
                          onClick={() => setPage(totalPages)}
                          disabled={page === totalPages}
                          sx={userStyle.paginationbtn}
                        >
                          <LastPageIcon />
                        </Button>
                      </Box>
                    </Box>
                  </>
                )}
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
              </Container>
              <Divider />
              {/* Table 2 */}
              <Container maxWidth="md" style={{ marginTop: "50px" }}>
                <Typography>Name: ALL CREDENTIAL</Typography>
                <br />
                <Grid container spacing={2} style={userStyle.dataTablestyle}>
                  <Grid item md={2} xs={12} sm={12}>
                    <Box>
                      <label>Show entries:</label>
                      <Select
                        id="pageSizeSelect"
                        value={pageSizeNearTatPrimary}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 180,
                              width: 80,
                            },
                          },
                        }}
                        onChange={handlePageSizeChangeNearTatPrimary}
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
                  ></Grid>
                  <Grid item md={2} xs={6} sm={6}>
                    <Box>
                      <FormControl fullWidth size="small">
                        <Typography>Search</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={searchQueryNearTatPrimary}
                          onChange={handleSearchChangeNearTatPrimary}
                        />
                      </FormControl>
                    </Box>
                  </Grid>
                </Grid>
                <br />
                <Button
                  sx={userStyle.buttongrp}
                  onClick={handleShowAllColumnsNeartat}
                >
                  Show All Columns
                </Button>
                &ensp;
                <Button
                  sx={userStyle.buttongrp}
                  onClick={handleOpenManageColumnsNeartat}
                >
                  Manage Columns
                </Button>
                &ensp;
                <br /> <br />
                {isBankdetail ? (
                  <>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
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
                ) : (
                  <>
                    <Box
                      style={{
                        width: "100%",
                        overflowY: "hidden", // Hide the y-axis scrollbar
                      }}
                    >
                      <StyledDataGrid
                        ref={gridRefNeartat}
                        rows={rowsWithCheckboxesNear}
                        columns={columnDataTableNeartat.filter(
                          (column) => columnVisibilityNeartat[column.field]
                        )}
                        autoHeight={true}
                        onSelectionModelChange={handleSelectionChangeNear}
                        selectionModel={selectedRowsNear}
                        hideFooter
                        density="compact"
                        checkboxSelection={
                          columnVisibilityNeartat.checkboxSelection
                        }
                        getRowClassNameNear={getRowClassNameNearTat}
                        disableRowSelectionOnClick
                      />
                    </Box>
                    <Box style={userStyle.dataTablestyle}>
                      <Box>
                        Showing{" "}
                        {filteredDataNearTatPrimary.length > 0
                          ? (pageNearTatPrimary - 1) * pageSizeNearTatPrimary +
                            1
                          : 0}{" "}
                        to{" "}
                        {Math.min(
                          pageNearTatPrimary * pageSizeNearTatPrimary,
                          filteredDatasNearTatPrimary.length
                        )}{" "}
                        of {filteredDatasNearTatPrimary.length} entries
                      </Box>
                      <Box>
                        <Button
                          onClick={() => setPageNearTatPrimary(1)}
                          disabled={pageNearTatPrimary === 1}
                          sx={userStyle.paginationbtn}
                        >
                          <FirstPageIcon />
                        </Button>
                        <Button
                          onClick={() =>
                            handlePageChangeNearTatPrimary(
                              pageNearTatPrimary - 1
                            )
                          }
                          disabled={pageNearTatPrimary === 1}
                          sx={userStyle.paginationbtn}
                        >
                          <NavigateBeforeIcon />
                        </Button>
                        {pageNumbersNearTatPrimary?.map((pageNumber) => (
                          <Button
                            key={pageNumber}
                            sx={userStyle.paginationbtn}
                            onClick={() =>
                              handlePageChangeNearTatPrimary(pageNumber)
                            }
                            className={
                              pageNearTatPrimary === pageNumber ? "active" : ""
                            }
                            disabled={pageNearTatPrimary === pageNumber}
                          >
                            {pageNumber}
                          </Button>
                        ))}
                        {lastVisiblePageNearTatPrimary <
                          totalPagesNearTatPrimary && <span>...</span>}
                        <Button
                          onClick={() =>
                            handlePageChangeNearTatPrimary(
                              pageNearTatPrimary + 1
                            )
                          }
                          disabled={
                            pageNearTatPrimary === totalPagesNearTatPrimary
                          }
                          sx={userStyle.paginationbtn}
                        >
                          <NavigateNextIcon />
                        </Button>
                        <Button
                          onClick={() =>
                            setPageNearTatPrimary(totalPagesNearTatPrimary)
                          }
                          disabled={
                            pageNearTatPrimary === totalPagesNearTatPrimary
                          }
                          sx={userStyle.paginationbtn}
                        >
                          <LastPageIcon />
                        </Button>
                      </Box>
                    </Box>
                  </>
                )}
                <Popover
                  id={idneartat}
                  open={isManageColumnsOpenNeartat}
                  anchorEl={anchorElNeartat}
                  onClose={handleCloseManageColumnsNeartat}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  {manageColumnsContentNeartat}
                </Popover>
              </Container>
            </Box>
          )}
        </>
      )}
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
              {" "}
              ok{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      {/* OTP DIALOG */}
      <Box>
        <Dialog
          open={openOTPView}
          onClose={handlViewCloseOTP}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="sm"
        >
          <DialogContent sx={userStyle.container}>
            <Grid container spacing={2}>
              <Grid
                item
                lg={12}
                md={12}
                sm={12}
                xs={12}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PinIcon
                  sx={{
                    fontSize: "100px",
                    color: "orange",
                    alignItems: "center",
                  }}
                />
              </Grid>
              <Grid
                item
                lg={12}
                md={12}
                sm={12}
                xs={12}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FormControl>
                  <Typography>
                    Please Enter Two Factor OTP
                    <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Please Enter OTP"
                    value={otp}
                    onChange={(e) => {
                      const enteredValue = e.target.value.replace(/\D/, "");
                      if (/^\d{0,6}$/.test(enteredValue)) {
                        setOtp(enteredValue);
                      }
                    }}
                    inputProps={{
                      maxLength: 6,
                    }}
                  />
                  <Typography
                    sx={{
                      color: "red",
                      fontSize: "small",
                    }}
                  >
                    {error != "" && error}
                  </Typography>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ backgroundColor: "rgb(255, 255, 255)" }}>
            <Button
              variant="contained"
              style={{
                padding: "7px 13px",
                color: "white",
                background: "rgb(25, 118, 210)",
              }}
              onClick={verifyOtp}
            >
              Verify
            </Button>
            <Button
              sx={userStyle.btncancel}
              onClick={() => {
                handlViewCloseOTP();
                setOtp("");
                setError("");
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      {/* all credentials view model */}
      <Dialog
        open={openView}
        onClose={handlViewClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> View Password</Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Company</Typography>
                  <Typography>{isUserRoleAccess.company}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Branch</Typography>
                  <Typography>{isUserRoleAccess.branch}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Unit</Typography>
                  <Typography>{isUserRoleAccess.unit}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Team</Typography>
                  <Typography>{isUserRoleAccess.team}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Type</Typography>
                  <Typography>{viewInfo.type}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Employee Name</Typography>
                  <Typography>{viewInfo.employeename}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Category</Typography>
                  <Typography>{viewInfo.category}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> SubCategory</Typography>
                  <Typography>{viewInfo.subcategory}</Typography>
                </FormControl>
              </Grid>
              {viewInfo.type === "IP" && (
                <>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Public IP Details</Typography>
                      <Typography>{viewInfo.publicip}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> VPN Name</Typography>
                      <Typography>{viewInfo.vpnname}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> VPN Type</Typography>
                      <Typography>{viewInfo.vpntype}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Assigned IP</Typography>
                      <Typography>{viewInfo.assignedip}</Typography>
                    </FormControl>
                  </Grid>
                </>
              )}
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Username</Typography>
                  <Typography>{viewInfo.username}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Temp Password</Typography>
                  <Grid container spacing={2}>
                    <Grid item md={6} xs={12} sm={12}>
                      <Typography> {viewInfo.temppassword}</Typography>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <Typography
                        sx={{
                          "&:hover": {
                            cursor: "pointer",
                          },
                        }}
                      >
                        <CopyToClipboard
                          onCopy={handleCopy}
                          options={{ message: "Copied!" }}
                          text={viewInfo.temppassword}
                        >
                          <ContentCopyIcon primary={viewInfo.temppassword} />
                        </CopyToClipboard>
                      </Typography>
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Live Password</Typography>
                  <Grid container spacing={2}>
                    <Grid item md={4} xs={12} sm={12}>
                      <Typography> {viewInfo.livepassword}</Typography>
                    </Grid>
                    <Grid item md={2} xs={12} sm={12}>
                      <Typography
                        sx={{
                          "&:hover": {
                            cursor: "pointer",
                          },
                        }}
                      >
                        <CopyToClipboard
                          onCopy={handleCopy}
                          options={{ message: "Copied!" }}
                          text={viewInfo.livepassword}
                        >
                          <ContentCopyIcon primary={viewInfo.livepassword} />
                        </CopyToClipboard>
                      </Typography>
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handlViewClose}
              >
                Back
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={deleteMyCreation}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      <MessageAlert
        openPopup={openPopupMalert}
        handleClosePopup={handleClosePopupMalert}
        popupContent={popupContentMalert}
        popupSeverity={popupSeverityMalert}
      />
      {/* SUCCESS */}
      <AlertDialog
        openPopup={openPopupNew}
        handleClosePopup={handleClosePopup}
        popupContent={popupContent}
        popupSeverity={popupSeverity}
      />
    </Box>
  );
};
export default Myteampassword;
