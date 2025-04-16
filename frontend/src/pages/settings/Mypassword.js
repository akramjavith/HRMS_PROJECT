import React, { useState, useEffect, useRef, useContext } from "react";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import {
  Box,
  Typography,
  TableBody,
  InputLabel,
  Paper,
  Table,
  TableHead,
  TableContainer,
  Container,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  Grid,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Selects from "react-select";
import { userStyle } from "../../pageStyle";
import { handleApiError } from "../../components/Errorhandling";
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
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import MessageAlert from "../../components/MessageAlert";
import AlertDialog from "../../components/Alert";
import {
  DeleteConfirmation,

} from "../../components/DeleteConfirmation.js";
import PageHeading from "../../components/PageHeading";

const MyPassword = () => {
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
  }
  const handleCopy = () => {
    NotificationManager.success("Copied! 👍", "", 2000);
  };
  const { isUserRoleCompare, isUserRoleAccess, allUsersData, isAssignBranch, pageName, setPageName, } = useContext(
    UserRoleAccessContext
  );
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
  //password visibility
  const [showLivePassword, setShowLivePassword] = useState(false);
  const handleClickShowLivePassword = () =>
    setShowLivePassword((show) => !show);
  const handleMouseDownLivePassword = (event) => {
    event.preventDefault();
  };
  useEffect(() => {
    fetchAllCredientials();
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
    setUpload([]);
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
    setPageName(!pageName)
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
    } catch (err) { setLoading(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const [allCredentials, setAllCredentials] = useState([]);
  //get all password details.
  const fetchAllCredientials = async () => {
    setPageName(!pageName)
    try {
      let res_queue = await axios.get(SERVICE.ALL_PASSWORD, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAllCredentials(
        res_queue?.data.pass.filter(
          (item) =>
            item.employeedbid === isUserRoleAccess?._id &&
            item.firewallstatus === "Verified"
        )
      );
      setLoading(true);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const [viewInfo, setViewInfo] = useState([]);
  const [error, setError] = useState("");
  const getviewCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.SINGLE_PASSWORD}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setViewInfo(res.data.spass);
      await checkOtp("allcredentialview");
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const [openPopup, setOpenPopup] = useState("");
  const checkOtp = async (from) => {
    setPageName(!pageName)
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
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const verifyOtp = async () => {
    setPageName(!pageName)
    try {
      if (otp != "") {
        let response = await axios.post(`${AUTH.VERIFYVIEWPASSWORD}`, {
          otp: String(otp),
          id: String(isUserRoleAccess?._id),
        });
        console.log(response?.data);
        if (response?.data?.success == true) {
          handlViewCloseOTP();
          if (openPopup === "allcredentialview") {
            handleViewOpen();
          } else if (openPopup === "mycreationview") {
            handleClickOpenMyCreationView();
          } else if (openPopup === "mycreationedit") {
            console.log("chjdkks")
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
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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
    setPageName(!pageName)
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
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  //function to fetch sub category  based on category
  const fetchSubCategory = async (e, type) => {
    setPageName(!pageName)
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
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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
    setPageName(!pageName)
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
        addedby: [
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
      // setPopupContent("Added Successfully");
      // setPopupSeverity("success");
      // handleClickOpenPopup();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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
    setPageName(!pageName)
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
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const fetchAllMyCreation = async () => {
    setPageName(!pageName)
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
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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
    setPageName(!pageName)
    try {
      await axios.delete(`${SERVICE.SINGLE_MYCREATION}/${deleteMycreationID}`, {
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
      console.log(err);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //get single row to edit....
  const getCode = async (e) => {
    setPageName(!pageName)
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
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const [myCreationView, setMyCreationView] = useState({});
  //get single row to view....
  const getMyCreationViewCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.SINGLE_MYCREATION}/${e}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setMyCreationView(res?.data?.smycreation);
      await checkOtp("mycreationview");
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  return (
    <Box>
      <Headtitle title={"MY CREDENTIALS"} />
      <PageHeading
        title="My Credentials"
        modulename="Settings"
        submodulename="My Credentials"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />
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
          {isUserRoleCompare?.includes("lmycredentials") && (
            <Box sx={userStyle.container}>
              {/* <Typography sx={userStyle.HeaderText}>My Credentials</Typography> */}
              <NotificationContainer />
              {/* Table 1 */}
              <Container maxWidth="md" style={{ marginTop: "50px" }}>
                <Typography>Name: HRMS</Typography>
                <br />
                <TableContainer component={Paper}>
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
                      <StyledTableRow>
                        <StyledTableCell>1</StyledTableCell>
                        <StyledTableCell>
                          {isUserRoleAccess?.username}
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
                              {showLivePassword ? (
                                <>{isUserRoleAccess?.originalpassword}</>
                              ) : (
                                <>
                                  {isUserRoleAccess?.originalpassword
                                    ?.split("")
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
                                  text={isUserRoleAccess?.originalpassword}
                                >
                                  <ContentCopyIcon
                                    primary={isUserRoleAccess?.originalpassword}
                                  />
                                </CopyToClipboard>
                              </Typography>
                              &nbsp;
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowLivePassword}
                                onMouseDown={handleMouseDownLivePassword}
                                edge="end"
                              >
                                {!showLivePassword ? (
                                  <VisibilityOff sx={{ fontSize: "25px" }} />
                                ) : (
                                  <Visibility sx={{ fontSize: "25px" }} />
                                )}
                              </IconButton>
                            </div>
                          </Typography>
                        </StyledTableCell>
                      </StyledTableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Container>
              {/* Table 2 */}
              <Container maxWidth="md" style={{ marginTop: "50px" }}>
                <Typography>Name: ALL CREDENTIAL</Typography>
                <br />
                <TableContainer component={Paper}>
                  <Table
                    aria-label="customized table"
                    id="raisetickets"
                    ref={componentRef}
                  >
                    <TableHead sx={{ fontWeight: "600", textAlign: "center" }}>
                      <StyledTableRow>
                        {/* Table headers */}
                        {[
                          "S.No",
                          "Type",
                          "Category",
                          "Sub Category",
                          "User Name",
                          // "Password",
                          "View",
                        ].map((header, index) => (
                          <StyledTableCell
                            key={index}
                            sx={{
                              textAlign: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Box sx={userStyle.tableheadstyle}>
                              <Box
                                sx={{
                                  textAlign: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {header}
                              </Box>
                            </Box>
                          </StyledTableCell>
                        ))}
                      </StyledTableRow>
                    </TableHead>
                    <TableBody align="left">
                      {/* Table rows */}
                      {allCredentials.length > 0 ? (
                        allCredentials.map((credential, index) => (
                          <StyledTableRow key={index}>
                            {/* S.No */}
                            <StyledTableCell>{index + 1}</StyledTableCell>
                            {/* Type */}
                            <StyledTableCell>{credential.type}</StyledTableCell>
                            {/* Category */}
                            <StyledTableCell>
                              {credential.category}
                            </StyledTableCell>
                            {/* Sub Category */}
                            <StyledTableCell>
                              {credential.subcategory}
                            </StyledTableCell>
                            {/* User Name */}
                            <StyledTableCell>
                              {credential.username}
                            </StyledTableCell>
                            {/* Password */}
                            {/* <StyledTableCell>
                              {credential.livepassword}
                            </StyledTableCell> */}
                            {/* View */}
                            <StyledTableCell>
                              <Button
                                variant="text"
                                onClick={() => {
                                  getviewCode(credential._id);
                                }}
                                sx={userStyle.buttonview}
                              >
                                View
                              </Button>
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
                </TableContainer>
              </Container>
              {/* Table 3 */}
              <Container maxWidth="md" style={{ marginTop: "50px" }}>
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography>Name: MY CREATION</Typography>
                  <Button
                    variant="contained"
                    style={{
                      float: "right",
                    }}
                    onClick={handleClickOpenMyCreation}
                  >
                    ADD
                  </Button>
                </Box>
                <br />
                <TableContainer component={Paper}>
                  <Table
                    aria-label="customized table"
                    id="raisetickets"
                    ref={componentRef}
                  >
                    <TableHead sx={{ fontWeight: "600", textAlign: "center" }}>
                      <StyledTableRow>
                        {/* Table headers */}
                        {[
                          "S.No",
                          "Type",
                          "Category",
                          "Sub Category",
                          "User Name",
                          // "Password",
                          "Action",
                        ].map((header, index) => (
                          <StyledTableCell
                            key={index}
                            sx={{
                              textAlign: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Box sx={userStyle.tableheadstyle}>
                              <Box
                                sx={{
                                  textAlign: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {header}
                              </Box>
                            </Box>
                          </StyledTableCell>
                        ))}
                      </StyledTableRow>
                    </TableHead>
                    <TableBody align="left">
                      {/* Table rows */}
                      {allMyCreation?.length > 0 ? (
                        allMyCreation?.map((credential, index) => (
                          <StyledTableRow key={index}>
                            {/* S.No */}
                            <StyledTableCell>{index + 1}</StyledTableCell>
                            {/* Type */}
                            <StyledTableCell>{credential.type}</StyledTableCell>
                            {/* Category */}
                            <StyledTableCell>
                              {credential.category}
                            </StyledTableCell>
                            {/* Sub Category */}
                            <StyledTableCell>
                              {credential.subcategory}
                            </StyledTableCell>
                            {/* User Name */}
                            <StyledTableCell>
                              {credential.username}
                            </StyledTableCell>
                            {/* Password */}
                            {/* View */}
                            <StyledTableCell>
                              <Button
                                sx={userStyle.buttonedit}
                                onClick={() => {
                                  getCode(credential._id);
                                }}
                              >
                                <EditOutlinedIcon
                                  style={{ fontsize: "small" }}
                                />{" "}
                              </Button>
                              <Button
                                sx={userStyle.buttondelete}
                                onClick={() => {
                                  setDeleteMyCreationID(credential._id);
                                  handleClickOpen();
                                }}
                              >
                                <DeleteOutlineOutlinedIcon
                                  style={{ fontsize: "small" }}
                                />
                              </Button>
                              <Button
                                sx={userStyle.buttonedit}
                                onClick={() => {
                                  getMyCreationViewCode(credential._id);
                                }}
                              >
                                <VisibilityOutlinedIcon
                                  style={{ fontsize: "small" }}
                                />
                              </Button>
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
                </TableContainer>
              </Container>
              {/* Table 4 */}
              <Container maxWidth="md" style={{ marginTop: "50px" }}>
                <Typography>Name: Data From Check List</Typography>
                <br />
                <TableContainer component={Paper}>
                  <Table
                    aria-label="customized table"
                    id="raisetickets"
                    ref={componentRef}
                  >
                    <TableHead sx={{ fontWeight: "600", textAlign: "center" }}>
                      <StyledTableRow>
                        {/* Table headers */}
                        {[
                          "S.No",
                          "Employee Name",
                          "Details",
                          "Field",
                          "Category",
                          "Sub Category",
                        ].map((header, index) => (
                          <StyledTableCell
                            key={index}
                            sx={{
                              textAlign: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Box sx={userStyle.tableheadstyle}>
                              <Box
                                sx={{
                                  textAlign: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {header}
                              </Box>
                            </Box>
                          </StyledTableCell>
                        ))}
                      </StyledTableRow>
                    </TableHead>
                    <TableBody align="left">
                      {/* Table rows */}
                      {groups.length > 0 ? (
                        groups.map((row, index) => (
                          <StyledTableRow key={index}>
                            {/* S.No */}
                            <StyledTableCell>{index + 1}</StyledTableCell>
                            {/* Type */}
                            <StyledTableCell>
                              {row.candidatename}
                            </StyledTableCell>
                            <StyledTableCell>{row.details}</StyledTableCell>
                            {(() => {
                              switch (row.checklist) {
                                case "Text Box":
                                  return (
                                    <StyledTableCell>
                                      <OutlinedInput
                                        style={{ height: "32px" }}
                                        value={row.data}
                                      />
                                    </StyledTableCell>
                                  );
                                case "Text Box-number":
                                  return (
                                    <StyledTableCell>
                                      <OutlinedInput
                                        value={row.data}
                                        style={{ height: "32px" }}
                                        type="text"
                                      />
                                    </StyledTableCell>
                                  );
                                case "Text Box-alpha":
                                  return (
                                    <StyledTableCell>
                                      <OutlinedInput
                                        style={{ height: "32px" }}
                                        value={row.data}
                                      />
                                    </StyledTableCell>
                                  );
                                case "Text Box-alphanumeric":
                                  return (
                                    <StyledTableCell>
                                      <OutlinedInput
                                        style={{ height: "32px" }}
                                        value={row.data}
                                      />
                                    </StyledTableCell>
                                  );
                                case "Attachments":
                                  return (
                                    <StyledTableCell>
                                      <div>
                                        <InputLabel sx={{ m: 1 }}>
                                          File
                                        </InputLabel>
                                        <div>
                                          <Box
                                            sx={{
                                              display: "flex",
                                              marginTop: "10px",
                                              gap: "10px",
                                            }}
                                          >
                                            {row.files && (
                                              <Grid container spacing={2}>
                                                <Grid
                                                  item
                                                  lg={8}
                                                  md={8}
                                                  sm={8}
                                                  xs={8}
                                                >
                                                  <Typography>
                                                    {row.files.name}
                                                  </Typography>
                                                </Grid>
                                                <Grid
                                                  item
                                                  lg={1}
                                                  md={1}
                                                  sm={1}
                                                  xs={1}
                                                >
                                                  <VisibilityOutlinedIcon
                                                    style={{
                                                      fontsize: "large",
                                                      color: "#357AE8",
                                                      cursor: "pointer",
                                                    }}
                                                    onClick={() =>
                                                      renderFilePreviewEdit(
                                                        row.files
                                                      )
                                                    }
                                                  />
                                                </Grid>
                                              </Grid>
                                            )}
                                          </Box>
                                        </div>
                                      </div>
                                    </StyledTableCell>
                                  );
                                case "Pre-Value":
                                  return (
                                    <StyledTableCell>
                                      <Typography>{row?.data}</Typography>
                                    </StyledTableCell>
                                  );
                                case "Date":
                                  return (
                                    <StyledTableCell>
                                      <OutlinedInput
                                        style={{ height: "32px" }}
                                        type="date"
                                        value={row.data}
                                      />
                                    </StyledTableCell>
                                  );
                                case "Time":
                                  return (
                                    <StyledTableCell>
                                      <OutlinedInput
                                        style={{ height: "32px" }}
                                        type="time"
                                        value={row.data}
                                      />
                                    </StyledTableCell>
                                  );
                                case "DateTime":
                                  return (
                                    <StyledTableCell>
                                      <Stack direction="row" spacing={2}>
                                        <OutlinedInput
                                          style={{ height: "32px" }}
                                          type="date"
                                          value={dateValue[index]}
                                        />
                                        <OutlinedInput
                                          type="time"
                                          style={{ height: "32px" }}
                                          value={timeValue[index]}
                                        />
                                      </Stack>
                                    </StyledTableCell>
                                  );
                                case "Date Multi Span":
                                  return (
                                    <StyledTableCell>
                                      <Stack direction="row" spacing={2}>
                                        <OutlinedInput
                                          style={{ height: "32px" }}
                                          type="date"
                                          value={dateValueMultiFrom[index]}
                                        />
                                        <OutlinedInput
                                          type="date"
                                          style={{ height: "32px" }}
                                          value={dateValueMultiTo[index]}
                                        />
                                      </Stack>
                                    </StyledTableCell>
                                  );
                                case "Date Multi Span Time":
                                  return (
                                    <StyledTableCell>
                                      <div
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          gap: "10px",
                                        }}
                                      >
                                        <Stack direction="row" spacing={2}>
                                          <OutlinedInput
                                            style={{ height: "32px" }}
                                            type="date"
                                            value={firstDateValue[index]}
                                          />
                                          <OutlinedInput
                                            type="time"
                                            style={{ height: "32px" }}
                                            value={firstTimeValue[index]}
                                          />
                                        </Stack>
                                        <Stack direction="row" spacing={2}>
                                          <OutlinedInput
                                            type="date"
                                            style={{ height: "32px" }}
                                            value={secondDateValue[index]}
                                          />
                                          <OutlinedInput
                                            style={{ height: "32px" }}
                                            type="time"
                                            value={secondTimeValue[index]}
                                          />
                                        </Stack>
                                      </div>
                                    </StyledTableCell>
                                  );
                                case "Date Multi Random":
                                  return (
                                    <StyledTableCell>
                                      <OutlinedInput
                                        style={{ height: "32px" }}
                                        type="date"
                                        value={row.data}
                                      />
                                    </StyledTableCell>
                                  );
                                case "Date Multi Random Time":
                                  return (
                                    <StyledTableCell>
                                      <Stack direction="row" spacing={2}>
                                        <OutlinedInput
                                          style={{ height: "32px" }}
                                          type="date"
                                          value={dateValueRandom[index]}
                                        />
                                        <OutlinedInput
                                          type="time"
                                          style={{ height: "32px" }}
                                          value={timeValueRandom[index]}
                                        />
                                      </Stack>
                                    </StyledTableCell>
                                  );
                                case "Radio":
                                  return (
                                    <StyledTableCell>
                                      <FormControl component="fieldset">
                                        <RadioGroup
                                          value={row.data}
                                          sx={{
                                            display: "flex",
                                            flexDirection: "row !important",
                                          }}
                                        >
                                          <FormControlLabel
                                            value="No"
                                            control={<Radio />}
                                            label="No"
                                          />
                                          <FormControlLabel
                                            value="Yes"
                                            control={<Radio />}
                                            label="Yes"
                                          />
                                        </RadioGroup>
                                      </FormControl>
                                    </StyledTableCell>
                                  );
                                default:
                                  return <StyledTableCell></StyledTableCell>; // Default case
                              }
                            })()}
                            <StyledTableCell>{row.category}</StyledTableCell>
                            <StyledTableCell>{row.subcategory}</StyledTableCell>
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
                </TableContainer>
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
      {/* my creation create DIALOG */}
      <Box>
        <Dialog
          open={isMyCreationOpen}
          onClose={handleClickCloseMyCreation}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
          fullWidth={true}
          sx={{
            overflow: "visible",
            "& .MuiPaper-root": {
              overflow: "visible",
            },
          }}
        >
          <Box sx={{ padding: "20px 50px" }}>
            <>
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}>My Creation</Typography>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Type<b style={{ color: "red" }}>*</b>
                    </Typography>
                    {/* <Selects
                      maxMenuHeight={300}
                      options={typeOption}
                      placeholder="Please Select Type"
                      value={{
                        label: myCreation.type,
                        value: myCreation.type,
                      }}
                      onChange={(e) => {
                        setPasswordState({
                          ...myCreation,
                          type: e.value,
                          category: "Please Select Category",
                          subcategory: "Please Select Sub Category",
                        });
                      }}
                    /> */}
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Type"
                      value={myCreation.type}
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Category<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={categoryOption}
                      placeholder="Please Select Category"
                      value={{
                        label: myCreation.category,
                        value: myCreation.category,
                      }}
                      onChange={(e) => {
                        setMyCreation({
                          ...myCreation,
                          category: e.value,
                          subcategory: "Please Select Sub Category",
                        });
                        fetchSubCategory(e.value, "Password");
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Sub Category<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={subCategoryOption}
                      placeholder="Please Select Sub Category"
                      value={{
                        label: myCreation.subcategory,
                        value: myCreation.subcategory,
                      }}
                      onChange={(e) => {
                        setMyCreation({
                          ...myCreation,
                          subcategory: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Username<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Username"
                      value={myCreation.username}
                      onChange={(e) => {
                        setMyCreation({
                          ...myCreation,
                          username: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Password<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      placeholder="Please Enter Password"
                      id="outlined-adornment-password"
                      type={showPassword ? "text" : "password"}
                      value={myCreation.password}
                      onChange={(e) => {
                        setMyCreation({
                          ...myCreation,
                          password: e.target.value,
                        });
                      }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {!showPassword ? (
                              <VisibilityOff sx={{ fontSize: "25px" }} />
                            ) : (
                              <Visibility sx={{ fontSize: "25px" }} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}></Grid>
                <Grid item md={2} xs={12} sm={12} sx={{ marginTop: "20px" }}>
                  <Button variant="contained" size="small" component="label">
                    Upload
                    <input
                      type="file"
                      id="resume"
                      multiple
                      // accept=".xlsx, .xls, .csv, .pdf, .doc, .txt,"
                      name="file"
                      hidden
                      onChange={handleResumeUpload}
                    />
                  </Button>
                </Grid>
                <Grid item md={6} xs={12} sm={12} sx={{ marginTop: "20px" }}>
                  {upload?.length > 0 &&
                    upload.map((file, index) => (
                      <>
                        <Grid container spacing={2}>
                          <Grid item lg={8} md={8} sm={8} xs={8}>
                            <Typography>{file.name}</Typography>
                          </Grid>
                          <Grid item lg={1} md={1} sm={1} xs={1}>
                            <VisibilityOutlinedIcon
                              style={{
                                fontsize: "large",
                                color: "#357AE8",
                                cursor: "pointer",
                              }}
                              onClick={() => renderFilePreview(file)}
                            />
                          </Grid>
                          <Grid item lg={1} md={1} sm={1} xs={1}>
                            <Button
                              style={{
                                fontsize: "large",
                                color: "#357AE8",
                                cursor: "pointer",
                                marginTop: "-5px",
                              }}
                              onClick={() => handleFileDelete(index)}
                            >
                              <DeleteIcon />
                            </Button>
                          </Grid>
                        </Grid>
                      </>
                    ))}
                </Grid>
              </Grid>
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <Button variant="contained" onClick={handleSubmit}>
                    {" "}
                    Add
                  </Button>
                </Grid>
                <br />
                <Grid item md={6} xs={12} sm={12}>
                  <Button
                    sx={userStyle.btncancel}
                    onClick={handleClickCloseMyCreation}
                  >
                    {" "}
                    Cancel{" "}
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </Dialog>
      </Box>
      {/* my creation edit DIALOG */}
      <Box>
        <Dialog
          open={isMyCreationOpenEdit}
          onClose={handleClickCloseMyCreationEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
          fullWidth={true}
          sx={{
            overflow: "visible",
            "& .MuiPaper-root": {
              overflow: "visible",
            },
          }}
        >
          <Box sx={{ padding: "20px 50px" }}>
            <>
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}>
                  My Creation Edit
                </Typography>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Type<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Type"
                      value={myCreationEdit.type}
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Category<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={categoryOption}
                      placeholder="Please Select Category"
                      value={{
                        label: myCreationEdit.category,
                        value: myCreationEdit.category,
                      }}
                      onChange={(e) => {
                        setMyCreationEdit({
                          ...myCreationEdit,
                          category: e.value,
                          subcategory: "Please Select Sub Category",
                        });
                        fetchSubCategory(e.value, "Password");
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Sub Category <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={subCategoryOption}
                      placeholder="Please Select Sub Category"
                      value={{
                        label: myCreationEdit.subcategory,
                        value: myCreationEdit.subcategory,
                      }}
                      onChange={(e) => {
                        setMyCreationEdit({
                          ...myCreationEdit,
                          subcategory: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Username<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Username"
                      value={myCreationEdit.username}
                      onChange={(e) => {
                        setMyCreationEdit({
                          ...myCreationEdit,
                          username: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Password<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      placeholder="Please Enter Password"
                      id="outlined-adornment-password"
                      type={showPasswordEdit ? "text" : "password"}
                      value={myCreationEdit.password}
                      onChange={(e) => {
                        setMyCreationEdit({
                          ...myCreationEdit,
                          password: e.target.value,
                        });
                      }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPasswordEdit}
                            onMouseDown={handleMouseDownPasswordEdit}
                            edge="end"
                          >
                            {!showPasswordEdit ? (
                              <VisibilityOff sx={{ fontSize: "25px" }} />
                            ) : (
                              <Visibility sx={{ fontSize: "25px" }} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}></Grid>
                <Grid item md={2} xs={12} sm={12} sx={{ marginTop: "20px" }}>
                  <Button variant="contained" size="small" component="label">
                    Upload
                    <input
                      type="file"
                      id="resume"
                      multiple
                      // accept=".pdf, .doc, .txt,"
                      name="file"
                      hidden
                      onChange={handleResumeUploadEdit}
                    />
                  </Button>
                </Grid>
                <Grid item md={6} xs={12} sm={12} sx={{ marginTop: "20px" }}>
                  {uploadEdit?.length > 0 &&
                    uploadEdit.map((file, index) => (
                      <>
                        <Grid container spacing={2}>
                          <Grid item lg={8} md={8} sm={8} xs={8}>
                            <Typography>{file.name}</Typography>
                          </Grid>
                          <Grid item lg={1} md={1} sm={1} xs={1}>
                            <VisibilityOutlinedIcon
                              style={{
                                fontsize: "large",
                                color: "#357AE8",
                                cursor: "pointer",
                              }}
                              onClick={() => renderFilePreview(file)}
                            />
                          </Grid>
                          <Grid item lg={1} md={1} sm={1} xs={1}>
                            <Button
                              style={{
                                fontsize: "large",
                                color: "#357AE8",
                                cursor: "pointer",
                                marginTop: "-5px",
                              }}
                              onClick={() => handleFileDeleteEdit(index)}
                            >
                              <DeleteIcon />
                            </Button>
                          </Grid>
                        </Grid>
                      </>
                    ))}
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
                  <Button
                    sx={userStyle.btncancel}
                    onClick={handleClickCloseMyCreationEdit}
                  >
                    {" "}
                    Cancel{" "}
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </Dialog>
      </Box>
      {/* my creation view DIALOG */}
      <Box>
        <Dialog
          open={isMyCreationOpenView}
          onClose={handleClickCloseMyCreationView}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
          fullWidth={true}
          sx={{
            overflow: "visible",
            "& .MuiPaper-root": {
              overflow: "visible",
            },
          }}
        >
          <Box sx={{ padding: "20px 50px" }}>
            <>
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}>
                  My Creation View
                </Typography>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6"> Type</Typography>
                    <Typography>{myCreationView.type}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6"> Category</Typography>
                    <Typography>{myCreationView.category}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6"> Sub Category</Typography>
                    <Typography>{myCreationView.subcategory}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6"> UserName</Typography>
                    <Typography>{myCreationView.username}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6"> Password</Typography>
                    <Grid container spacing={2}>
                      <Grid item md={4} xs={12} sm={12}>
                        <Typography> {myCreationView.password}</Typography>
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
                            text={myCreationView.password}
                          >
                            <ContentCopyIcon
                              primary={myCreationView.password}
                            />
                          </CopyToClipboard>
                        </Typography>
                      </Grid>
                    </Grid>
                  </FormControl>
                </Grid>
                {myCreationView?.files?.length > 0 && (
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Upload</Typography>
                      {myCreationView?.files?.length > 0 &&
                        myCreationView?.files.map((file, index) => (
                          <>
                            <Grid container spacing={2}>
                              <Grid item lg={8} md={8} sm={8} xs={8}>
                                <Typography>{file.name}</Typography>
                              </Grid>
                              <Grid item lg={1} md={1} sm={1} xs={1}>
                                <VisibilityOutlinedIcon
                                  style={{
                                    fontsize: "large",
                                    color: "#357AE8",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => renderFilePreview(file)}
                                />
                              </Grid>
                            </Grid>
                          </>
                        ))}
                    </FormControl>
                  </Grid>
                )}
              </Grid>
              <br /> <br />
              <Grid container spacing={2}>
                <br />
                <Grid item md={12} xs={12} sm={12}>
                  <Button
                    variant="contained"
                    onClick={handleClickCloseMyCreationView}
                  >
                    {" "}
                    Back{" "}
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
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
        openPopup={openPopupNew}
        handleClosePopup={handleClosePopup}
        popupContent={popupContent}
        popupSeverity={popupSeverity}
      />
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={deleteMyCreation}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
    </Box>
  );
};
export default MyPassword;