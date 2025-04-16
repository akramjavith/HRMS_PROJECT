import { Visibility, VisibilityOff } from "@mui/icons-material";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PropTypes from "prop-types";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ReplayIcon from "@mui/icons-material/Replay";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Radio,
  RadioGroup,
  TextareaAutosize,
  Typography,
  Stack,
  List,
  ListItem,
  ListItemText,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Switch from "@mui/material/Switch";
import axios from "axios";
import "cropperjs/dist/cropper.css";
import React, { useContext, useEffect, useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import "react-image-crop/dist/ReactCrop.css";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Link } from "react-router-dom";
import Selects from "react-select";
import AlertDialog from "../../components/Alert";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import MessageAlert from "../../components/MessageAlert";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import PageHeading from "../../components/PageHeading";
import LockClockIcon from "@mui/icons-material/LockClock";
import WorkIcon from "@mui/icons-material/Work";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PaletteIcon from "@mui/icons-material/Palette";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

function ControlPanel() {
  const [colourAndFont, setColourAndFont] = useState({
    navbgcolour: "#1976d2",
    navfontcolour: "#ffffff",
    companylogobfcolour: "#1976d2",
    submitbgcolour: "#1976d2",
    submitfontcolour: "#ffffff",
    clearcancelbgcolour: "#f4f4f4",
    clearcancelfontcolour: "#444",
    bulkdeletebgcolour: "#d32f2f",
    bulkdeletefontcolour: "#ffffff",
    editiconcolour: "#1976d2",
    deleteiconcolour: "#1976d2",
    viewiconcolour: "#1976d2",
    infoiconcolour: "#1976d2",
    pageheadingfontsize: "medium",
  });
  const [opacitywatermark, setOpacitywatermark] = useState(0.05);
  const [opacitytextwatermark, setOpacitytextwatermark] = useState("Semi-transparent (20% visible)");
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const [bdayCompanyLogo, setBdayCompanyLogo] = useState("");
  const [bdaywishes, setBdaywishes] = useState("");
  const [bdayfootertext, setBdayfootertext] = useState("");
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
  };

  const {
    isUserRoleCompare,
    isAssignBranch,
    pageName,
    setPageName,
    isUserRoleAccess,
    buttonStyles,
  } = useContext(UserRoleAccessContext);
  const [twofaSwitch, setTwofaSwitch] = useState();
  const [IPSwitch, setIPSwitch] = useState();
  const [MobileSwitch, setMobileSwitch] = useState();
  const [loginIpSwitch, setLoginIpSwitch] = useState();

  const [empdigits, setempdigits] = useState("");
  const [overAllsettingsCount, setOverAllsettingsCount] = useState();
  const [overAllsettingsID, setOverAllsettingsID] = useState();
  const [chatBoxLink, setChatBoxLink] = useState("");
  const [shiftTiming, setShiftTiming] = useState({ start: "", end: "" });
  const [empdigitsvalue, setEmpdigitsvalue] = useState("");
  const [repeatInterval, setRepeatInterval] = useState("");
  const [companyKeyProducts, setCompanyKeyProducts] = useState("");
  const [companyAwards, setCompanyAwards] = useState("");
  const [jobRequirements, setJobRequirements] = useState("");
  const [JobRolesResponsibility, setJobRolesResponsibility] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyDescription, setcompanyDescription] = useState("");
  const [jobPerks, setJobPerks] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState("");
  const [waterMarkFile, setWaterMarkFile] = useState("");
  const [allKeyProducts, setAllKeyProducts] = useState([]);
  const [allAwardsRecogs, setAllAwardsRecog] = useState([]);
  const [subjectName, setSubjectName] = useState("");
  const [emailName, setemailName] = useState("");
  const [businesslogo, setBusinesslogo] = useState("");
  const [waterMark, setWaterMark] = useState("");
  const [joinUsImg, setJoinUsImg] = useState("");
  const [jobApplyDays, setJobApplyDays] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [advanceApprovalMonth, setAdvanceApprovalMonth] = useState("");
  const [loanApprovalMonth, setLoanApprovalMonth] = useState("");

  const [hiConnect, setHiConnect] = useState({
    url: "",
    apikey: "",
    emaildomain: "",
  });

  const [internalUrlTodo, setInternalUrlTodo] = useState([]);
  const [externalUrlTodo, setExternalUrlTodo] = useState([]);
  const [internalUrl, setInternalUrl] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [loginMode, setLoginMode] = useState("Internal Login");
  const addInternalUrlTodo = () => {
    const isDuplicate = internalUrlTodo?.includes(internalUrl);

    if (internalUrl === "") {
      setPopupContentMalert("Please Enter Internal URL");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (internalUrl && !isValidURL(internalUrl)) {
      setPopupContentMalert("Please Enter Valid Internal URL");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isDuplicate) {
      setPopupContentMalert("Internal URL already Exist");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      setInternalUrlTodo((prevState) => [...prevState, internalUrl]);
      setInternalUrl("");
    }
  };
  const deleteInternalUrlTodo = (index) => {
    setInternalUrlTodo(internalUrlTodo.filter((_, i) => i !== index));
  };

  const addExternalUrlTodo = () => {
    const isDuplicate = externalUrlTodo?.includes(externalUrl);

    if (externalUrl === "") {
      setPopupContentMalert("Please Enter External Url");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (externalUrl && !isValidURL(externalUrl)) {
      setPopupContentMalert("Please Enter Valid External URL");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isDuplicate) {
      setPopupContentMalert("External URL already Exist");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      setExternalUrlTodo((prevState) => [...prevState, externalUrl]);
      setExternalUrl("");
    }
  };
  const deleteExternalUrlTodo = (index) => {
    setExternalUrlTodo(externalUrlTodo.filter((_, i) => i !== index));
  };

  const [showApiKey, setShowApiKey] = useState(false);

  const handleToggleVisibility = () => {
    setShowApiKey(!showApiKey);
  };

  const [loginapprestriction, setLoginapprestriction] =
    useState("desktopapponly");
  const [externalloginapprestriction, setExternalLoginapprestriction] =
    useState("desktopapponly");
  const [bothloginapprestriction, setBothLoginapprestriction] =
    useState("desktopapponly");
  const { auth } = useContext(AuthContext);

  function isValidEmail(email) {
    // Regular expression for a simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const [codedigit, setCodedigit] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(
    "Please Select Company"
  );

  //to add state for validator

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  const handleRoleAndResponse = (value) => {
    setemailName(value);
  };

  const [jobrequire, setJobRequire] = useState("<ul><li></li></ul>");
  const handleChangeJobRequire = (value) => {
    setJobRequire(value);
  };

  const [jobBenefits, setJobBenefits] = useState("<ul><li></li></ul>");
  const handleChangeJobBenefits = (value) => {
    setJobBenefits(value);
  };

  const [roleAndResTextArea, setRoleAndResTextArea] =
    useState("<ul><li></li></ul>");
  const handleRoleAndResponseText = (value) => {
    setRoleAndResTextArea(value);
  };

  const [selectedOptionsCate, setSelectedOptionsCate] = useState([]);
  let [valueCate, setValueCate] = useState([]);

  const handleCategoryChange = (options) => {
    setValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCate(options);
  };

  const handleCategoryChangeEdit = (options) => {
    setvaluecateedit(
      options.map((a, index) => {
        return a.value;
      })
    );
    getHighestEmpcodeForBranchhigh(options.map((item) => item.value));
    setSelectedOptionsCateedit(options);
  };

  const customValueRendererCate = (valueCate, _documents) => {
    return valueCate?.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Branch";
  };

  const customValueRendererCateEdit = (valueCateedit, _documents) => {
    return valueCateedit?.length
      ? valueCateedit.map(({ label }) => label).join(", ")
      : "Please Select Branch";
  };

  const [todoscheck, setTodoscheck] = useState([]);
  const [editingIndexcheck, setEditingIndexcheck] = useState(-1);
  const [editedDeveloper, setEditedDeveloper] = useState("");
  const [editedReturnName, seteditedReturnName] = useState("");
  const [selectedCompanyedit, setSelectedCompanyedit] = useState("");

  const [valuecateedit, setvaluecateedit] = useState([]);
  const [empcodeedit, setempcodeedit] = useState("");
  const [highestemp, sethighestemp] = useState("");
  const [selectedoptionscateedit, setSelectedOptionsCateedit] = useState([]);

  const getHighestEmpcodeForBranch = (branch) => {
    const branchUsers = branchempcheck.filter((user) =>
      branch.includes(user.branch)
    );
    const numericEmpCode = branchUsers.filter(
      (employee) => !isNaN(parseInt(employee.empcode.slice(-3)))
    );
    const highestEmpcode = Math.max(
      ...numericEmpCode.map((user) => parseInt(user.empcode.slice(-3), 10)),
      0
    );
    return highestEmpcode;
  };

  const getHighestEmpcodeForBranchhigh = (branch) => {
    const branchUsers = branchempcheck.filter((user) =>
      branch.includes(user.branch)
    );
    const numericEmpCode = branchUsers.filter(
      (employee) => !isNaN(parseInt(employee.empcode.slice(-3)))
    );
    const highestEmpcode = Math.max(
      ...numericEmpCode.map((user) => parseInt(user.empcode.slice(-3), 10)),
      0
    );
    // return highestEmpcode;
    sethighestemp(highestEmpcode);
  };

  const handleClear = (e) => {
    e.preventDefault();
    setSelectedCompany("Please Select Company");
    setSelectedOptionsCate([]);
    setValueCate([]);
    setEmpdigitsvalue("");
    // setLoginapprestriction("desktopapponly");
    // setExternalLoginapprestriction("desktopapponly");
    // setBothLoginapprestriction("desktopapponly");
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  const handleRadioChange = (mode, value) => {
    if (mode === "internal") {
      setLoginapprestriction(value);
      setExternalLoginapprestriction("");
      setBothLoginapprestriction("");
    } else if (mode === "external") {
      setExternalLoginapprestriction(value);
      // setLoginapprestriction("");
      setBothLoginapprestriction("");
    } else if (mode === "both") {
      setBothLoginapprestriction(value);
      setExternalLoginapprestriction("");
      // setLoginapprestriction("");
    }
  };
  const handleCreateTodocheck = () => {
    const isDuplicate = todoscheck.some(
      (todo) =>
        todo.company.trim() === selectedCompany.trim() &&
        todo.branch.some((branch) => valueCate.includes(branch))
    );
    if (selectedCompany && selectedCompany.trim()?.length > 0) {
      if (selectedCompany === "Please Select Company") {
        setPopupContentMalert("Please Select Company");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (valueCate?.length === 0) {
        setPopupContentMalert("Please Select Branch");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (
        (empdigits == true && empdigitsvalue === "") ||
        empdigitsvalue == undefined
      ) {
        setPopupContentMalert("Please Enter EmpCode Digits");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (empdigitsvalue.trim()?.length !== 3) {
        setPopupContentMalert("Please Enter 3 Digits EmpCode");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (
        Number(empdigitsvalue) <= Number(getHighestEmpcodeForBranch(valueCate))
      ) {
        setPopupContentMalert(
          <>
            <p
              style={{ fontSize: "20px", fontWeight: 900 }}
            >{`You Can Add After ${getHighestEmpcodeForBranch(
              valueCate
            )} for this ${valueCate.map((item) => item)}!`}</p>
          </>
        );
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (isDuplicate) {
        setPopupContentMalert("Company and Branch Already Exists!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else {
        const newTodocheck = {
          company: selectedCompany,
          branch: valueCate,
          empcodedigits: empdigitsvalue,
        };
        setTodoscheck([...todoscheck, newTodocheck]);
      }
    } else {
      // Handle the case when selectedCompany is not valid
    }
    setEmpdigitsvalue("");
  };

  const handleDeleteTodocheck = (index) => {
    const newTodoscheck = [...todoscheck];
    newTodoscheck.splice(index, 1);
    setTodoscheck(newTodoscheck);
  };
  const handleEditTodocheck = (index) => {
    setEditingIndexcheck(index);
    setSelectedCompanyedit(todoscheck[index].company);
    // setvaluecateedit(todoscheck[index].branch);
    getHighestEmpcodeForBranchhigh(todoscheck[index].branch);
    setvaluecateedit(
      todoscheck[index]?.branch?.map((a, index) => {
        return a?.value;
      })
    );
    setSelectedOptionsCateedit(
      todoscheck[index].branch.map((item) => ({
        ...item,
        label: item,
        value: item,
      }))
    );
    setempcodeedit(todoscheck[index].empcodedigits);
  };
  const handleUpdateTodocheck = () => {
    const isDuplicate = todoscheck.some(
      (todo, index) =>
        index !== editingIndexcheck &&
        ((todo.branch.some((branch) =>
          selectedoptionscateedit.map((item) => item.value).includes(branch)
        ) &&
          todo.empcodedigits.trim() === empcodeedit.trim()) ||
          todo.branch.some((branch) =>
            selectedoptionscateedit.map((item) => item.value).includes(branch)
          ) ||
          (todo.branch.some((branch) =>
            selectedoptionscateedit.map((item) => item.value).includes(branch)
          ) &&
            empcodeedit.trim() === "") ||
          (todo.empcodedigits.trim() === empcodeedit.trim() &&
            selectedoptionscateedit?.length === 0))
    );

    if (selectedCompanyedit === "Please Select Company") {
      setPopupContentMalert("Please Select Company");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedoptionscateedit?.length === 0) {
      setPopupContentMalert("Please Select Branch");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      (empdigits == true && empcodeedit === "") ||
      empcodeedit == undefined
    ) {
      setPopupContentMalert("Please Enter EmpCode Digits");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (Number(empcodeedit) <= Number(highestemp)) {
      setPopupContentMalert(
        <>
          <p
            style={{ fontSize: "20px", fontWeight: 900 }}
          >{`You Can Add After ${highestemp} for this ${valuecateedit}!`}</p>
        </>
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isDuplicate) {
      setPopupContentMalert(
        <>
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {todoscheck.some(
              (todo, index) =>
                index != editingIndexcheck &&
                todo.branch.some((branch) =>
                  selectedoptionscateedit
                    .map((item) => item.value)
                    .includes(branch)
                )
            ) &&
            todoscheck.some(
              (todo, index) =>
                index != editingIndexcheck &&
                todo.empcodedigits.trim() === empcodeedit.trim()
            )
              ? "Branch & EmpCode Already Exits!"
              : todoscheck.some(
                  (todo, index) =>
                    index != editingIndexcheck &&
                    todo.branch.some((branch) =>
                      selectedoptionscateedit
                        .map((item) => item.value)
                        .includes(branch)
                    )
                )
              ? todoscheck.find(
                  (todo, index) =>
                    index != editingIndexcheck &&
                    todo.branch.some((branch) =>
                      selectedoptionscateedit
                        .map((item) => item.value)
                        .includes(branch)
                    )
                ).branch +
                " " +
                "Branch Already Exists"
              : "EmpCode Already Exits"}
          </p>
        </>
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      const company = selectedCompanyedit ? selectedCompanyedit : "";
      const branch = selectedoptionscateedit
        ? selectedoptionscateedit.map((item) => item.value)
        : "";
      const empcodedigits = empcodeedit ? empcodeedit : "";

      const newTodoscheck = [...todoscheck];
      newTodoscheck[editingIndexcheck].company = company;
      newTodoscheck[editingIndexcheck].branch = branch;
      newTodoscheck[editingIndexcheck].empcodedigits = empcodedigits;

      setTodoscheck(newTodoscheck);
      setEditingIndexcheck(-1);
      setEditedDeveloper("");
      seteditedReturnName("");
      setSelectedCompanyedit("");
      setvaluecateedit("");
      setempcodeedit("");
      // }
    }
  };

  const fetchOverAllSettings = async () => {
    const accessbranch = isAssignBranch
      ? isAssignBranch.map((data) => ({
          branch: data.branch,
          company: data.company,
        }))
      : [];
    setPageName(!pageName);
    try {
      let res = await axios.post(
        `${SERVICE.GET_OVERALL_SETTINGSASSIGNBRANCH}`,
        {
          assignbranch: accessbranch,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      setLoading(true);

      if (res?.data?.count === 0) {
        setOverAllsettingsCount(res?.data?.count);
      } else {
        const lastObject =
          res?.data?.overallsettings[res?.data?.overallsettings.length - 1];
        const lastObjectId = lastObject._id;
        setOverAllsettingsID(lastObjectId);

        setTwofaSwitch(
          res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
            ?.overalltwofaswitch
        );
        setIPSwitch(
          res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
            ?.iprestrictionswitch
        );
        setInternalUrlTodo(
          lastObject?.internalurl?.length > 0 ? lastObject?.internalurl : []
        );
        setLoginMode(lastObject?.loginmode || "Internal Login");
        setExternalUrlTodo(
          lastObject?.externalurl?.length > 0 ? lastObject?.externalurl : []
        );
        setShiftTiming({
          start:
            res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
              ?.shiftstart,
          end: res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
            ?.shiftend,
        });
        setMobileSwitch(
          res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
            ?.mobilerestrictionswitch
        );
        setLoginapprestriction(
          res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
            ?.loginapprestriction
        );
        setExternalLoginapprestriction(
          res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
            ?.externalloginapprestriction
        );
        setBothLoginapprestriction(
          res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
            ?.bothloginapprestriction
        );
        setLoginIpSwitch(
          res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
            ?.loginrestrictionswitch
        );

        setChatBoxLink(
          res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
            ?.chatboxlink
        );
        setRepeatInterval(
          res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
            ?.repeatinterval
        );

        setEmpdigitsvalue(
          res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
            ?.empcodedigits
        );
        setempdigits(
          res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
            ?.empdigits
        );
        setCompanyKeyProducts(
          res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
            ?.companykeyproducts
        );
        setCompanyAwards(
          res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
            ?.companyawards
        );
        setJobRequirements(
          res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
            ?.jobrequirements
        );
        setJobRolesResponsibility(
          res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
            ?.jorolesresponsibility
        );
        setJobPerks(
          res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
            ?.jobperks
        );
        setCompanyName(
          res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
            ?.companyname
        );
        setcompanyDescription(
          res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
            ?.companydescription
        );
        setAdvanceApprovalMonth(
          res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
            ?.advanceapprovalmonth
        );
        setLoanApprovalMonth(
          res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
            ?.loanapprovalmonth
        );
        setHiConnect({
          url:
            res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
              ?.hiconnecturl ?? "",
          apikey:
            res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
              ?.hiconnectapikey ?? "",
          emaildomain:
            res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
              ?.emaildomain ?? "",
        });
        setAllKeyProducts(
          res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
            ?.allkeyproducts
        );
        setAllAwardsRecog(
          res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
            ?.allawardsrecognitions
        );
        setFile(
          res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
            ?.companylogo
        );
        setBusinesslogo(
          res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
            ?.companylogo
        );
        setWaterMarkFile(
          res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
            ?.watermark
        );
        setWaterMark(
          res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
            ?.watermark
        );
        setJoinUsImg(
          res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
            ?.careerimg
        );
        setSubjectName(
          res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
            ?.subjectname
        );
        setemailName(
          res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
            ?.emaildescription
        );
        setJobRequire(
          res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
            ?.jobrequirementsAdd
        );
        setJobBenefits(
          res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
            ?.jobbenefits
        );
        setRoleAndResTextArea(
          res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
            ?.rolesandres
        );
        setTodoscheck(
          res?.data?.overallsettings[res?.data?.overallsettings?.length - 1]
            ?.todos
        );

        setJobApplyDays(
          res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
            ?.jobapplydays
        );
        setContactEmail(
          res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
            ?.contactemail
        );
        setBdayCompanyLogo(
          res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
            ?.bdaycompanylogo
        );
        setBdaywishes(
          res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
            ?.bdaywishes
        );
        setBdayfootertext(
          res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
            ?.bdayfootertext
        );
        setColourAndFont(
          res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
            ?.colorsandfonts
        );
        setOpacitywatermark(
          res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
            ?.opacitywatermark
        );
        setOpacitytextwatermark(
          res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
            ?.opacitytextwatermark
        );
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    fetchOverAllSettings();
  }, []);

  const handleChangeRepeatInterval = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setRepeatInterval(inputValue.slice(0, 2));
    }
  };

  const [branchempcheck, setBranchempcheck] = useState([]);

  const fetchEmployee = async () => {
    setPageName(!pageName);
    try {
      let res_employee = await axios.get(
        SERVICE.USERS_LIMITED_EMPCODE_NONMANUAL,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      const numericEmpCode = res_employee?.data?.users?.filter(
        (employee) => !isNaN(parseInt(employee.empcode.slice(-3)))
      );
      const result = numericEmpCode?.reduce((maxEmployee, currentEmployee) => {
        const lastThreeDigitsMax = parseInt(maxEmployee?.empcode.slice(-3));
        const lastThreeDigitsCurrent = parseInt(
          currentEmployee?.empcode.slice(-3)
        );

        return lastThreeDigitsMax > lastThreeDigitsCurrent
          ? maxEmployee
          : currentEmployee;
      }, res_employee?.data?.users[0]);
      setCodedigit(result.empcode.slice(-3));
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  const sendRequest = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.post(`${SERVICE.CREATE_OVERALL_SETTINGS}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        overalltwofaswitch: Boolean(twofaSwitch),
        iprestrictionswitch: Boolean(IPSwitch),
        mobilerestrictionswitch: Boolean(MobileSwitch),
        loginrestrictionswitch: Boolean(loginIpSwitch),

        companykeyproducts: Boolean(companyKeyProducts),
        colorsandfonts: colourAndFont,
        opacitywatermark:Number(opacitywatermark),
        opacitytextwatermark:String(opacitytextwatermark),
        companyawards: Boolean(companyAwards),
        jobrequirements: Boolean(jobRequirements),
        jorolesresponsibility: Boolean(JobRolesResponsibility),
        jobperks: Boolean(jobPerks),
        empdigits: Boolean(empdigits),
        companyname: String(companyName),
        companydescription: String(companyDescription),
        advanceapprovalmonth: String(advanceApprovalMonth),
        loanapprovalmonth: String(loanApprovalMonth),

        hiconnecturl: String(hiConnect?.url?.trim()),
        hiconnectapikey: String(hiConnect?.apikey?.trim()),
        emaildomain: String(hiConnect?.emaildomain?.trim()),

        companylogo: String(businesslogo),
        careerimg: String(joinUsImg),

        allkeyproducts: [...allKeyProducts],
        allawardsrecognitions: [...allAwardsRecogs],
        businesslogo: String(file),
        watermark: String(waterMark),
        chatboxlink: String(chatBoxLink),
        empcodedigits: String(empdigitsvalue),
        loginapprestriction: String(loginapprestriction),
        externalloginapprestriction: String(externalloginapprestriction),
        bothloginapprestriction: String(bothloginapprestriction),
        loginmode: String(loginMode),
        internalurl: internalUrlTodo,
        externalurl: externalUrlTodo,
        jobapplydays: Number(jobApplyDays),
        contactemail: String(contactEmail),

        repeatinterval: Number(repeatInterval),
        subjectname: String(subjectName),
        emaildescription: String(emailName),
        rolesandres: String(roleAndResTextArea),
        jobrequirementsAdd: String(jobrequire),
        jobbenefits: String(jobBenefits),
        shiftstart: String(shiftTiming.start),
        shiftend: String(shiftTiming.end),
        todos: todoscheck,
        bdaycompanylogo: String(bdayCompanyLogo),
        bdayfootertext: String(bdayfootertext),
        bdaywishes: String(bdaywishes),
      });

      await fetchOverAllSettings();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const sendEditRequest = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.put(
        `${SERVICE.SINGLE_OVERALL_SETTINGS}/${overAllsettingsID}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          overalltwofaswitch: Boolean(twofaSwitch),
          iprestrictionswitch: Boolean(IPSwitch),
          mobilerestrictionswitch: Boolean(MobileSwitch),
          loginrestrictionswitch: Boolean(loginIpSwitch),
          companykeyproducts: Boolean(companyKeyProducts),
          companyawards: Boolean(companyAwards),
          jobrequirements: Boolean(jobRequirements),
          jorolesresponsibility: Boolean(JobRolesResponsibility),
          jobperks: Boolean(jobPerks),
          empdigits: Boolean(empdigits),
          companyname: String(companyName),
          companydescription: String(companyDescription),
          colorsandfonts: colourAndFont,
          opacitywatermark:Number(opacitywatermark),
        opacitytextwatermark:String(opacitytextwatermark),
          advanceapprovalmonth: String(advanceApprovalMonth),
          loanapprovalmonth: String(loanApprovalMonth),

          hiconnecturl: String(hiConnect?.url?.trim()),
          hiconnectapikey: String(hiConnect?.apikey?.trim()),
          emaildomain: String(hiConnect?.emaildomain?.trim()),

          loginapprestriction: String(loginapprestriction),
          externalloginapprestriction: String(externalloginapprestriction),
          bothloginapprestriction: String(bothloginapprestriction),
          loginmode: String(loginMode),
          internalurl: internalUrlTodo,
          externalurl: externalUrlTodo,
          companylogo: String(businesslogo),
          watermark: String(waterMark),
          careerimg: String(joinUsImg),

          allkeyproducts: [...allKeyProducts],
          allawardsrecognitions: [...allAwardsRecogs],
          chatboxlink: String(chatBoxLink),
          empcodedigits: String(empdigitsvalue),

          jobapplydays: Number(jobApplyDays),
          contactemail: String(contactEmail),

          repeatinterval: Number(repeatInterval),
          subjectname: String(subjectName),
          emaildescription: String(emailName),
          rolesandres: String(roleAndResTextArea),
          jobrequirementsAdd: String(jobrequire),
          jobbenefits: String(jobBenefits),
          shiftstart: String(shiftTiming.start),
          shiftend: String(shiftTiming.end),
          todos: todoscheck,
          bdaycompanylogo: String(bdayCompanyLogo),
          bdayfootertext: String(bdayfootertext),
          bdaywishes: String(bdaywishes),
        }
      );

      await fetchOverAllSettings();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  function handleUploadLogoChange(e) {
    const businesslogo = document.getElementById("businesslogo");
    const file = businesslogo.files[0];
    const maxSizeInMB = 3;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    const allowedFileTypes = ["image/jpeg", "image/png", "image/gif"];

    if (file) {
      // Check file size
      if (file.size > maxSizeInBytes) {
        setPopupContentMalert("File size exceeds 3MB");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
        businesslogo.value = null; // Clear the file input
        return;
      }

      // Check file type
      if (!allowedFileTypes.includes(file.type)) {
        setPopupContentMalert("Only image files are allowed");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
        businesslogo.value = null; // Clear the file input
        return;
      }

      const path = (window.URL || window.webkitURL).createObjectURL(file);

      toDataURL(path, function (dataUrl) {
        businesslogo.setAttribute("value", String(dataUrl));
        setBusinesslogo(String(dataUrl));
        return dataUrl;
      });

      setFile(URL.createObjectURL(file));
    }
  }
  function handleUploadWaterMarkChange(e) {
    const watermark = document.getElementById("watermark");
    const file = watermark.files[0];
    const maxSizeInMB = 3;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    const allowedFileTypes = ["image/jpeg", "image/png", "image/gif"];

    if (file) {
      // Check file size
      if (file.size > maxSizeInBytes) {
        setPopupContentMalert("File size exceeds 3MB");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
        watermark.value = null; // Clear the file input
        return;
      }

      // Check file type
      if (!allowedFileTypes.includes(file.type)) {
        setPopupContentMalert("Only image files are allowed");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
        watermark.value = null; // Clear the file input
        return;
      }

      const path = (window.URL || window.webkitURL).createObjectURL(file);

      toDataURL(path, function (dataUrl) {
        watermark.setAttribute("value", String(dataUrl));
        setWaterMark(String(dataUrl));
        return dataUrl;
      });

      setWaterMarkFile(URL.createObjectURL(file));
    }
  }

  function handleUploadJoinUsChange(e) {
    const joinusimg = document.getElementById("joinusimg");
    const file = joinusimg.files[0];
    const maxSizeInMB = 3;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    const allowedFileTypes = ["image/jpeg", "image/png", "image/gif"];

    if (file) {
      // Check file size
      if (file.size > maxSizeInBytes) {
        setPopupContentMalert("File size exceeds 3MB");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
        joinusimg.value = null; // Clear the file input
        return;
      }

      // Check file type
      if (!allowedFileTypes.includes(file.type)) {
        setPopupContentMalert("Only image files are allowed");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
        joinusimg.value = null; // Clear the file input
        return;
      }

      const path = (window.URL || window.webkitURL).createObjectURL(file);

      toDataURL(path, function (dataUrl) {
        joinusimg.setAttribute("value", String(dataUrl));
        setJoinUsImg(String(dataUrl));
        return dataUrl;
      });
    }
  }

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

  const handleTwoFaSwitchChange = (e) => {
    setTwofaSwitch(e.target.checked);
  };
  const handleIPSwitchChange = (e) => {
    setIPSwitch(e.target.checked);
  };
  const handleMobileSwitchChange = (e) => {
    setMobileSwitch(e.target.checked);
  };
  const handleLoginSwitchChange = (e) => {
    setLoginIpSwitch(e.target.checked);
  };

  //
  const handleDigitsChange = (e) => {
    setempdigits(e.target.checked);
  };
  const handleKeyProductsChange = (e) => {
    setCompanyKeyProducts(e.target.checked);
  };
  const handleAwardsChange = (e) => {
    setCompanyAwards(e.target.checked);
  };
  const handleRequirementsChange = (e) => {
    setJobRequirements(e.target.checked);
  };
  const handleRolesResponsibilityChange = (e) => {
    setJobRolesResponsibility(e.target.checked);
  };
  const handlePerksChange = (e) => {
    setJobPerks(e.target.checked);
  };
  function isValidURL(clientURL) {
    setPageName(!pageName);
    try {
      new URL(clientURL);
      return true;
    } catch (error) {
      return false;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // await fetchOverAllSettings();

    if (internalUrlTodo?.length === 0) {
      setPopupContentMalert("Please Add Internal URL");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (externalUrlTodo?.length === 0) {
      setPopupContentMalert("Please Add External URL");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (contactEmail && !isValidEmail(contactEmail)) {
      setPopupContentMalert("Please Enter Valid Email");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (hiConnect.url && !isValidURL(hiConnect.url)) {
      setPopupContentMalert("Please Enter Valid HICONNECT URL");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      selectedCompany !== "Please Select Company" ||
      selectedOptionsCate?.length > 0 ||
      empdigitsvalue !== ""
    ) {
      setPopupContentMalert("Please Add Todo!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      if (overAllsettingsCount === 0) {
        sendRequest();
      } else {
        sendEditRequest();
      }
    }
  };

  //change form
  const handleChangephonenumber = (e) => {
    // Regular expression to match only positive numeric values
    const regex = /^[0-9]+$/; // Only allows positive integers
    // const regex = /^\d*\.?\d*$/;

    const inputValue = e.target.value;

    // Check if the input value matches the regex or if it's empty (allowing backspace)
    if (regex.test(inputValue) || inputValue === "") {
      // Update the state with the valid numeric value
      setEmpdigitsvalue(inputValue.slice(0, 3));
    }
  };

  const handleChangephonenumberEdit = (e) => {
    // Regular expression to match only positive numeric values
    const regex = /^[0-9]+$/; // Only allows positive integers
    // const regex = /^\d*\.?\d*$/;

    const inputValue = e.target.value;

    // Check if the input value matches the regex or if it's empty (allowing backspace)
    if (regex.test(inputValue) || inputValue === "") {
      // Update the state with the valid numeric value
      setempcodeedit(inputValue.slice(0, 3));
    }
  };
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Box>
      <Headtitle title={"CONTROL PANEL"} />

      <PageHeading
        title="Control Panel"
        modulename="Settings"
        submodulename="Control Panel"
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
          {isUserRoleCompare?.includes("acontrolpanel") && (
            <Box
              sx={{
                ...userStyle.container,
              }}
            >
              <form onSubmit={handleSubmit}>
                <Box
                  sx={{
                    flexGrow: 1,
                    // bgcolor: "background.paper",
                    display: "flex",
                    // boxShadow: 3,
                    borderRadius: 2,
                    overflow: "hidden",
                    // maxHeight: "100vh",
                    flexDirection: isMobile ? "column" : "row",
                  }}
                >
                  <Tabs
                    orientation={isMobile ? "horizontal" : "vertical"} // Horizontal for mobile, vertical for desktop
                    variant={isMobile ? "scrollable" : "standard"} // Enable scrolling for horizontal tabs on mobile
                    value={value}
                    onChange={handleChange}
                    aria-label="Responsive Tabs"
                    sx={{
                      borderRight: isMobile ? "none" : 1,
                      borderBottom: isMobile ? 1 : "none",
                      borderColor: "divider",
                      minWidth: isMobile ? "100%" : "20%",
                      maxWidth: isMobile ? "100%" : "20%",
                      bgcolor: "#f5f5f5",
                      "& .MuiTab-root": {
                        transition: "all 0.3s ease",
                        "&:hover": {
                          bgcolor: "#e0e0e0",
                          color: "#1976d2",
                        },
                        "&.Mui-selected": {
                          color: "#1976d2",
                          fontWeight: "bold",
                        },
                      },
                    }}
                  >
                    <Tab
                      icon={<LockClockIcon />} // Clock or restriction icon
                      label="Login/Clockin Restrictions"
                      {...a11yProps(0)}
                    />
                    <Tab
                      icon={<WorkIcon />} // Job-related icon
                      label="Job Apply Control Criteria"
                      {...a11yProps(1)}
                    />

                    <Tab
                      icon={<AccountBalanceIcon />} // Loan/finance-related icon
                      label="Loan and Advance Approval"
                      {...a11yProps(2)}
                    />

                    <Tab
                      icon={<ListAltIcon />} // Job requirements or list icon
                      label="Job Requirements"
                      {...a11yProps(3)}
                    />
                    <Tab
                      icon={<PaletteIcon />} // Design or color-related icon
                      label="Colours & Fonts"
                      {...a11yProps(4)}
                    />
                    {isUserRoleAccess?.role?.includes("Manager") && (
                      <Tab
                        icon={<ConnectWithoutContactIcon />} // Connect/communication icon
                        label="CONNECT"
                        {...a11yProps(5)}
                      />
                    )}
                  </Tabs>

                  <Box sx={{ flexGrow: 1, p: 0, overflowY: "auto" }}>
                    <TabPanel value={value} index={0}>
                      <Grid container spacing={2}>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                          {" "}
                          <Typography variant="h6">
                            Login/Clockin Restrictions
                          </Typography>
                        </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                          <Grid item md={10} sm={12}>
                            <FormControl size="small" fullWidth>
                              <FormGroup>
                                <FormControlLabel
                                  label="Enable Two Factor Authentication"
                                  control={
                                    <Switch
                                      checked={twofaSwitch}
                                      onChange={handleTwoFaSwitchChange}
                                    />
                                  }
                                />
                              </FormGroup>
                            </FormControl>
                          </Grid>
                        </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                          <Grid item md={10} sm={12}>
                            <FormControl size="small" fullWidth>
                              <FormGroup>
                                <FormControlLabel
                                  label="Enable IP Restriction Clockin"
                                  control={
                                    <Switch
                                      checked={IPSwitch}
                                      onChange={handleIPSwitchChange}
                                    />
                                  }
                                />
                              </FormGroup>
                            </FormControl>
                          </Grid>
                        </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                          <Grid item md={10} sm={12}>
                            <FormControl size="small" fullWidth>
                              <FormGroup>
                                <FormControlLabel
                                  label="Enable Mobile Restriction Clockin"
                                  control={
                                    <Switch
                                      checked={MobileSwitch}
                                      onChange={handleMobileSwitchChange}
                                    />
                                  }
                                />
                              </FormGroup>
                            </FormControl>
                          </Grid>
                        </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                          <Grid item md={10} sm={12}>
                            <FormControl size="small" fullWidth>
                              <FormGroup>
                                <FormControlLabel
                                  label="Enable IP Restriction Login"
                                  control={
                                    <Switch
                                      checked={loginIpSwitch}
                                      onChange={handleLoginSwitchChange}
                                    />
                                  }
                                />
                              </FormGroup>
                            </FormControl>
                          </Grid>
                        </Grid>

                        <Grid item lg={4} md={4} sm={6} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Login Mode</Typography>
                            <Selects
                              options={[
                                {
                                  label: "Internal Login",
                                  value: "Internal Login",
                                },
                                {
                                  label: "External Login",
                                  value: "External Login",
                                },
                                { label: "Both Login", value: "Both Login" },
                              ]}
                              styles={colourStyles}
                              value={{
                                label: loginMode,
                                value: loginMode,
                              }}
                              onChange={(e) => {
                                setLoginMode(e.value);
                              }}
                            />
                          </FormControl>
                        </Grid>
                        {(loginMode === "Internal Login" ||
                          loginMode === "Both Login") && (
                          <Grid item lg={4} md={4} sm={6} xs={12}>
                            <Grid item md={10} sm={12}>
                              <FormControl size="small" fullWidth>
                                <FormLabel>Internal Login Mode</FormLabel>
                                <RadioGroup
                                  aria-labelledby="internal-login-mode-group"
                                  value={loginapprestriction}
                                  name="internal-login-mode-group"
                                  onChange={(e) =>
                                    handleRadioChange(
                                      "internal",
                                      e.target.value
                                    )
                                  }
                                >
                                  <FormControlLabel
                                    value="desktopapponly"
                                    control={<Radio />}
                                    label="DeskTop App Only"
                                  />
                                  <FormControlLabel
                                    value="urlonly"
                                    control={<Radio />}
                                    label="Browser Url Only With Authentication"
                                  />
                                  <FormControlLabel
                                    value="urlonlywithoutauthentication"
                                    control={<Radio />}
                                    label={`Browser Url Only Without Authentication${
                                      loginMode === "Both Login"
                                        ? " (Both Login)"
                                        : ""
                                    }`}
                                  />
                                  <FormControlLabel
                                    value="desktopurl"
                                    control={<Radio />}
                                    label="Desktop & Browser Url"
                                  />
                                  <FormControlLabel
                                    value="loginrestirct"
                                    control={<Radio />}
                                    label={`User Login Restriction${
                                      loginMode === "Both Login"
                                        ? " (Both Login)"
                                        : ""
                                    }`}
                                  />
                                </RadioGroup>
                              </FormControl>
                            </Grid>
                          </Grid>
                        )}

                        {/* External login mode grid */}
                        {loginMode === "External Login" && (
                          <Grid item lg={4} md={4} sm={6} xs={12}>
                            <Grid item md={10} sm={12}>
                              <FormControl size="small" fullWidth>
                                <FormLabel>External Login Mode</FormLabel>
                                <RadioGroup
                                  aria-labelledby="external-login-mode-group"
                                  value={externalloginapprestriction}
                                  name="external-login-mode-group"
                                  onChange={(e) =>
                                    handleRadioChange(
                                      "external",
                                      e.target.value
                                    )
                                  }
                                >
                                  <FormControlLabel
                                    value="urlonlywithoutauthentication"
                                    control={<Radio />}
                                    label="Browser Url Only Without Authentication"
                                  />
                                  {/* <FormControlLabel
                          value="desktopapponly"
                          control={<Radio />}
                          label="DeskTop App Only"
                        />
                        <FormControlLabel
                          value="urlonly"
                          control={<Radio />}
                          label="Browser Url Only With Authentication"
                        />
                       
                        <FormControlLabel
                          value="desktopurl"
                          control={<Radio />}
                          label="Desktop & Browser Url"
                        /> */}
                                  <FormControlLabel
                                    value="loginrestirct"
                                    control={<Radio />}
                                    label="User Login Restriction"
                                  />
                                </RadioGroup>
                              </FormControl>
                            </Grid>
                          </Grid>
                        )}

                        {/* Both login mode grid */}
                        {/* <Grid item lg={4} md={4} sm={6} xs={12}>
                  <Grid item md={10} sm={12}>
                    <FormControl size="small" fullWidth>
                      <FormLabel>Both Login Mode</FormLabel>
                      <RadioGroup
                        aria-labelledby="both-login-mode-group"
                        value={bothloginapprestriction}
                        name="both-login-mode-group"
                        onChange={(e) =>
                          handleRadioChange("both", e.target.value)
                        }
                      >
                        <FormControlLabel
                          value="desktopapponly"
                          control={<Radio />}
                          label="DeskTop App Only"
                        />
                        <FormControlLabel
                          value="urlonly"
                          control={<Radio />}
                          label="Browser Url Only With Authentication"
                        />
                        <FormControlLabel
                          value="urlonlywithoutauthentication"
                          control={<Radio />}
                          label="Browser Url Only Without Authentication"
                        />
                        <FormControlLabel
                          value="desktopurl"
                          control={<Radio />}
                          label="Desktop & Browser Url"
                        />
                        <FormControlLabel
                          value="loginrestirct"
                          control={<Radio />}
                          label="User Login Restriction"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </Grid> */}
                        {/* Internal URL Section */}
                        <Grid item md={6} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <Typography>
                                Internal URL<b style={{ color: "red" }}>*</b>
                              </Typography>
                              <OutlinedInput
                                id="internal-url-input"
                                type="text"
                                placeholder="Please Enter Internal URL"
                                value={internalUrl}
                                onChange={(e) => setInternalUrl(e.target.value)}
                                sx={{ width: "300px" }}
                              />
                              <Button
                                variant="contained"
                                color="success"
                                onClick={addInternalUrlTodo}
                                type="button"
                                sx={{ height: "40px", minWidth: "40px" }}
                              >
                                <FaPlus />
                              </Button>
                            </Stack>
                          </FormControl>

                          <List dense>
                            {internalUrlTodo.map((data, index) => (
                              <ListItem
                                key={index}
                                secondaryAction={
                                  <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    color="error"
                                    onClick={() => deleteInternalUrlTodo(index)}
                                  >
                                    <AiOutlineClose />
                                  </IconButton>
                                }
                              >
                                <ListItemText primary={data} />
                              </ListItem>
                            ))}
                          </List>
                        </Grid>

                        {/* External URL Section */}
                        <Grid item md={6} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <Typography>
                                External URL<b style={{ color: "red" }}>*</b>
                              </Typography>
                              <OutlinedInput
                                id="external-url-input"
                                type="text"
                                placeholder="Please Enter External URL"
                                value={externalUrl}
                                onChange={(e) => setExternalUrl(e.target.value)}
                                sx={{ width: "300px" }}
                              />
                              <Button
                                variant="contained"
                                color="success"
                                onClick={addExternalUrlTodo}
                                type="button"
                                sx={{ height: "40px", minWidth: "40px" }}
                              >
                                <FaPlus />
                              </Button>
                            </Stack>
                          </FormControl>

                          <List dense>
                            {externalUrlTodo.map((data, index) => (
                              <ListItem
                                key={index}
                                secondaryAction={
                                  <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    color="error"
                                    onClick={() => deleteExternalUrlTodo(index)}
                                  >
                                    <AiOutlineClose />
                                  </IconButton>
                                }
                              >
                                <ListItemText primary={data} />
                              </ListItem>
                            ))}
                          </List>
                        </Grid>
                      </Grid>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                      <>
                        <Grid container spacing={2}>
                          <Grid
                            container
                            spacing={2}
                            item
                            md={12}
                            xs={12}
                            sm={12}
                          >
                            <Grid item md={12} xs={12} sm={12}>
                              <Typography variant="h6">
                                Job Apply Control Criteria
                              </Typography>
                            </Grid>
                            <Grid
                              container
                              item
                              md={12}
                              xs={12}
                              sm={12}
                              alignItems="center"
                              gap={2}
                            >
                              <Grid item md={2} xs={12} sm={12}>
                                <Typography>Job Apply</Typography>
                              </Grid>
                              <Grid item md={0.5} xs={12} sm={12}>
                                <FormControl size="small" fullWidth>
                                  <OutlinedInput
                                    type="text"
                                    value={jobApplyDays}
                                    onChange={(e) => {
                                      const regex = /^[0-9]+$/;
                                      const inputValue = e.target.value;
                                      if (
                                        regex.test(inputValue) ||
                                        inputValue === ""
                                      ) {
                                        setJobApplyDays(inputValue);
                                      }
                                    }}
                                  />
                                </FormControl>
                              </Grid>
                              <Grid item md={1} xs={12} sm={12}>
                                <Typography>Days</Typography>
                              </Grid>
                              <Grid item lg={4} md={4} sm={6} xs={12}>
                                <Grid item md={10} sm={12}>
                                  <FormControl size="small" fullWidth>
                                    <FormGroup>
                                      <FormControlLabel
                                        label="Enable Emp Code Start From"
                                        control={
                                          <Switch
                                            checked={empdigits}
                                            onChange={handleDigitsChange}
                                          />
                                        }
                                      />
                                    </FormGroup>
                                  </FormControl>
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                              <FormControl size="small" fullWidth>
                                <Typography>Contact Email</Typography>
                                <OutlinedInput
                                  type="text"
                                  value={contactEmail}
                                  placeholder="Please Enter Email"
                                  onChange={(e) => {
                                    const inputValue = e.target.value;
                                    setContactEmail(inputValue);
                                  }}
                                />
                              </FormControl>
                            </Grid>
                          </Grid>

                          <Grid item md={3.5} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography>
                                Company Name<b style={{ color: "red" }}>*</b>
                              </Typography>
                              <Selects
                                options={isAssignBranch
                                  ?.map((data) => ({
                                    label: data.company,
                                    value: data.company,
                                  }))
                                  .filter((item, index, self) => {
                                    return (
                                      self.findIndex(
                                        (i) =>
                                          i.label === item.label &&
                                          i.value === item.value
                                      ) === index
                                    );
                                  })}
                                styles={colourStyles}
                                value={{
                                  label: selectedCompany,
                                  value: selectedCompany,
                                }}
                                isDisabled={empdigits == false}
                                onChange={(e) => {
                                  setSelectedCompany(e.value);
                                  setSelectedOptionsCate([]);
                                }}
                              />
                            </FormControl>
                          </Grid>

                          <Grid item md={3.5} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography>
                                Branch <b style={{ color: "red" }}>*</b>
                              </Typography>
                              <MultiSelect
                                options={isAssignBranch
                                  ?.filter(
                                    (comp) => selectedCompany === comp.company
                                  )
                                  ?.map((data) => ({
                                    label: data.branch,
                                    value: data.branch,
                                  }))
                                  .filter((item, index, self) => {
                                    return (
                                      self.findIndex(
                                        (i) =>
                                          i.label === item.label &&
                                          i.value === item.value
                                      ) === index
                                    );
                                  })}
                                value={selectedOptionsCate}
                                disabled={!empdigits}
                                onChange={handleCategoryChange}
                                valueRenderer={customValueRendererCate}
                                labelledBy="Please Select Branch"
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={2.5} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography>
                                EmpCode Start From{" "}
                                <b style={{ color: "red" }}>*</b>
                              </Typography>
                              <OutlinedInput
                                id="component-outlined"
                                type="number"
                                sx={userStyle.input}
                                placeholder="Please Enter Digits"
                                value={empdigitsvalue}
                                onChange={(e) => handleChangephonenumber(e)}
                                disabled={empdigits == false}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={1} sm={2} xs={12} marginTop={3.5}>
                            <Button
                              variant="contained"
                              sx={{ minWidth: "35px" }}
                              onClick={handleCreateTodocheck}
                              disabled={empdigits == false}
                            >
                              <FaPlus />
                            </Button>
                          </Grid>
                          <Grid item md={1.5} xs={12} sm={6} marginTop={3}>
                            <Button
                              sx={buttonStyles.btncancel}
                              onClick={handleClear}
                              disabled={empdigits == false}
                            >
                              Clear
                            </Button>
                          </Grid>
                        </Grid>
                        <br />
                        {todoscheck?.length > 0 &&
                          todoscheck.map((todo, index) => (
                            <div key={index}>
                              {editingIndexcheck === index ? (
                                <Grid container spacing={1}>
                                  <Grid item md={4} sm={4} xs={4}>
                                    <FormControl fullWidth size="small">
                                      <Typography>
                                        Company Name
                                        <b style={{ color: "red" }}>*</b>
                                      </Typography>
                                      <Selects
                                        options={isAssignBranch
                                          ?.map((data) => ({
                                            label: data.company,
                                            value: data.company,
                                          }))
                                          .filter((item, index, self) => {
                                            return (
                                              self.findIndex(
                                                (i) =>
                                                  i.label === item.label &&
                                                  i.value === item.value
                                              ) === index
                                            );
                                          })}
                                        styles={colourStyles}
                                        value={{
                                          label: selectedCompanyedit,
                                          value: selectedCompanyedit,
                                        }}
                                        onChange={(e) => {
                                          setSelectedCompanyedit(e.value);
                                          setSelectedOptionsCateedit([]);
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>
                                  <Grid item md={4} sm={6} xs={6}>
                                    <FormControl fullWidth size="small">
                                      <Typography>
                                        Branch <b style={{ color: "red" }}>*</b>
                                      </Typography>
                                      <MultiSelect
                                        options={isAssignBranch
                                          ?.filter(
                                            (comp) =>
                                              selectedCompanyedit ===
                                              comp.company
                                          )
                                          ?.map((data) => ({
                                            label: data.branch,
                                            value: data.branch,
                                          }))
                                          .filter((item, index, self) => {
                                            return (
                                              self.findIndex(
                                                (i) =>
                                                  i.label === item.label &&
                                                  i.value === item.value
                                              ) === index
                                            );
                                          })}
                                        value={selectedoptionscateedit}
                                        onChange={handleCategoryChangeEdit}
                                        disabled={!empdigits}
                                        valueRenderer={
                                          customValueRendererCateEdit
                                        }
                                        labelledBy="Please Select Branch"
                                      />
                                    </FormControl>
                                  </Grid>
                                  <Grid item md={2} sm={6} xs={6}>
                                    <FormControl fullWidth size="small">
                                      <Typography>
                                        Emp Code Start From
                                      </Typography>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="number"
                                        sx={userStyle.input}
                                        placeholder="Please Enter Digits"
                                        value={empcodeedit}
                                        onChange={(e) => {
                                          handleChangephonenumberEdit(e);
                                          // getHighestEmpcodeForBranchhigh(valuecateedit)
                                        }}
                                        disabled={empdigits == false}
                                      />
                                    </FormControl>
                                  </Grid>
                                  <Grid item md={1} sm={1} xs={1}>
                                    <Button
                                      variant="contained"
                                      style={{
                                        minWidth: "20px",
                                        minHeight: "41px",
                                        background: "transparent",
                                        boxShadow: "none",
                                        marginTop: "-3px !important",
                                        "&:hover": {
                                          background: "#f4f4f4",
                                          borderRadius: "50%",
                                          minHeight: "41px",
                                          minWidth: "20px",
                                          boxShadow: "none",
                                        },
                                      }}
                                      disabled={
                                        selectedCompanyedit == "" ||
                                        selectedoptionscateedit?.length == 0 ||
                                        !empdigits
                                      }
                                      onClick={handleUpdateTodocheck}
                                    >
                                      <CheckCircleIcon
                                        style={{
                                          color:
                                            selectedCompanyedit == "" ||
                                            selectedoptionscateedit?.length == 0
                                              ? "grey"
                                              : "#216d21",
                                          fontSize: "1.5rem",
                                        }}
                                      />
                                    </Button>
                                  </Grid>
                                  <Grid item md={1} sm={1} xs={1}>
                                    <Button
                                      variant="contained"
                                      style={{
                                        minWidth: "20px",
                                        minHeight: "41px",
                                        background: "transparent",
                                        boxShadow: "none",
                                        marginTop: "-3px !important",
                                        "&:hover": {
                                          background: "#f4f4f4",
                                          borderRadius: "50%",
                                          minHeight: "41px",
                                          minWidth: "20px",
                                          boxShadow: "none",
                                        },
                                      }}
                                      onClick={() => setEditingIndexcheck(-1)}
                                      disabled={!empdigits}
                                    >
                                      <CancelIcon
                                        style={{
                                          color: "#b92525",
                                          fontSize: "1.5rem",
                                        }}
                                      />
                                    </Button>
                                  </Grid>
                                </Grid>
                              ) : (
                                <Grid container spacing={1}>
                                  <Grid item md={4} sm={6} xs={12}>
                                    <Typography
                                      variant="subtitle2"
                                      color="textSecondary"
                                      sx={{
                                        whiteSpace: "pre-line",
                                        wordBreak: "break-all",
                                      }}
                                    >
                                      {todo.company}
                                    </Typography>
                                  </Grid>
                                  <Grid item md={4} sm={6} xs={12}>
                                    <Typography
                                      variant="subtitle2"
                                      color="textSecondary"
                                      sx={{
                                        whiteSpace: "pre-line",
                                        wordBreak: "break-all",
                                      }}
                                    >
                                      {todo.branch.join(" ,")}
                                    </Typography>
                                  </Grid>
                                  <Grid item md={2} sm={6} xs={12}>
                                    <Typography
                                      variant="subtitle2"
                                      color="textSecondary"
                                      sx={{
                                        whiteSpace: "pre-line",
                                        wordBreak: "break-all",
                                      }}
                                    >
                                      {todo.empcodedigits}
                                    </Typography>
                                  </Grid>
                                  <Grid item md={1} sm={6} xs={6}>
                                    <Button
                                      variant="contained"
                                      style={{
                                        minWidth: "20px",
                                        minHeight: "41px",
                                        background: "transparent",
                                        boxShadow: "none",
                                        marginTop: "-13px !important",
                                        "&:hover": {
                                          background: "#f4f4f4",
                                          borderRadius: "50%",
                                          minHeight: "41px",
                                          minWidth: "20px",
                                          boxShadow: "none",
                                        },
                                      }}
                                      onClick={() => handleEditTodocheck(index)}
                                      disabled={!empdigits}
                                    >
                                      <FaEdit
                                        style={{
                                          color: "#1976d2",
                                          fontSize: "1rem",
                                        }}
                                      />
                                    </Button>
                                  </Grid>
                                  <Grid item md={1} sm={6} xs={6}>
                                    <Button
                                      variant="contained"
                                      style={{
                                        minWidth: "20px",
                                        minHeight: "41px",
                                        background: "transparent",
                                        boxShadow: "none",
                                        marginTop: "-13px !important",
                                        "&:hover": {
                                          background: "#f4f4f4",
                                          borderRadius: "50%",
                                          minHeight: "41px",
                                          minWidth: "20px",
                                          boxShadow: "none",
                                        },
                                      }}
                                      onClick={() =>
                                        handleDeleteTodocheck(index)
                                      }
                                      disabled={!empdigits}
                                    >
                                      <FaTrash
                                        style={{
                                          color: "#b92525",
                                          fontSize: "1rem",
                                        }}
                                      />
                                    </Button>
                                  </Grid>
                                </Grid>
                              )}
                              <br />
                            </div>
                          ))}
                        <Grid container spacing={2}>
                          <Grid item md={4} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography>ChatBox Link</Typography>
                              <OutlinedInput
                                id="component-outlined"
                                type="text"
                                placeholder="Please Enter ChatBox Link"
                                value={chatBoxLink}
                                onChange={(e) => setChatBoxLink(e.target.value)}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={4} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography>Repeat Interval</Typography>
                              <OutlinedInput
                                id="component-outlined"
                                type="number"
                                sx={userStyle.input}
                                placeholder="Please Enter Digits"
                                value={repeatInterval}
                                onChange={(e) => handleChangeRepeatInterval(e)}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={4} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography>Company Name</Typography>
                              <OutlinedInput
                                id="component-outlined"
                                type="text"
                                placeholder="Please Enter Company Name"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                              />
                            </FormControl>
                          </Grid>
                          {/* Logo Upload */}
                          <Grid item md={4} sm={6} xs={12}>
                            <Typography>Company Logo</Typography>
                            {file || businesslogo ? (
                              <>
                                <Grid
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                  }}
                                >
                                  <img
                                    src={file ? file : businesslogo}
                                    style={{ width: "50%" }}
                                    height="80px"
                                  />
                                </Grid>
                              </>
                            ) : (
                              <></>
                            )}
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
                                      id="businesslogo"
                                      accept=".png, .jpg, .icon, .jpeg"
                                      name="file"
                                      hidden
                                      onChange={handleUploadLogoChange}
                                    />
                                  </Button>
                                  <Button
                                    onClick={(e) => {
                                      setFile("");
                                      setBusinesslogo("");
                                    }}
                                    sx={buttonStyles.btncancel}
                                  >
                                    Reset
                                  </Button>
                                </Grid>
                                <Typography
                                  variant="body2"
                                  style={{ marginTop: "5px", fontSize: "12px" }}
                                >
                                  Allowed Type: .jpg,.png,.icon,.jpeg,Max File
                                  size: 3MB
                                </Typography>
                              </FormControl>
                            </Grid>
                          </Grid>
                          {/* Join Us Upload */}
                          <Grid item md={4} sm={6} xs={12}>
                            <Typography>Career Image</Typography>
                            {joinUsImg ? (
                              <>
                                <Grid
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                  }}
                                >
                                  <img
                                    src={joinUsImg ? joinUsImg : ""}
                                    style={{ width: "50%" }}
                                    height="80px"
                                    alt="Join Us"
                                  />
                                </Grid>
                              </>
                            ) : (
                              <></>
                            )}
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
                                      id="joinusimg"
                                      accept=".png, .jpg, .icon, .jpeg"
                                      name="file"
                                      hidden
                                      onChange={handleUploadJoinUsChange}
                                    />
                                  </Button>
                                  <Button
                                    onClick={(e) => {
                                      setJoinUsImg("");
                                    }}
                                    sx={buttonStyles.btncancel}
                                  >
                                    Reset
                                  </Button>
                                </Grid>
                                <Typography
                                  variant="body2"
                                  style={{ marginTop: "5px", fontSize: "12px" }}
                                >
                                  Allowed Type: .jpg,.png,.icon,.jpeg,Max File
                                  size: 3MB
                                </Typography>
                              </FormControl>
                            </Grid>
                          </Grid>
                          <Grid item lg={12} md={12} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography>Company Description</Typography>
                              <TextareaAutosize
                                aria-label="minimum height"
                                minRows={5}
                                value={companyDescription}
                                onChange={(e) => {
                                  setcompanyDescription(e.target.value);
                                }}
                              />
                            </FormControl>
                          </Grid>
                        </Grid>
                      </>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                      <Grid container spacing={2} item md={12} xs={12} sm={12}>
                        <Grid item md={12} xs={12} sm={12}>
                          <Typography variant="h6">
                            Loan & Advance Approval
                          </Typography>
                        </Grid>
                        <Grid item md={4} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Advance Approval Month</Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Please Enter Advance Approval Month"
                              value={advanceApprovalMonth}
                              onChange={(e) => {
                                const enteredValue = e.target.value
                                  .replace(/\D/g, "")
                                  .slice(0, 3);
                                if (
                                  enteredValue === "" ||
                                  enteredValue !== "0" ||
                                  /^\d+$/.test(enteredValue)
                                ) {
                                  setAdvanceApprovalMonth(enteredValue);
                                }
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Loan Approval Month</Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Please Enter Loan Approval Month"
                              value={loanApprovalMonth}
                              onChange={(e) => {
                                const enteredValue = e.target.value
                                  .replace(/\D/g, "")
                                  .slice(0, 3);
                                if (
                                  enteredValue === "" ||
                                  enteredValue !== "0" ||
                                  /^\d+$/.test(enteredValue)
                                ) {
                                  setLoanApprovalMonth(enteredValue);
                                }
                              }}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </TabPanel>

                    <TabPanel value={value} index={3}>
                      <>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                          {" "}
                          <Typography variant="h6">Job Requirements</Typography>
                        </Grid>
                        <Grid item md={4} xs={12} sm={12}>
                          <Grid item md={10} sm={12}>
                            <FormControl size="small" fullWidth>
                              <FormGroup>
                                <FormControlLabel
                                  label="Enable Our Job Requirements"
                                  control={
                                    <Switch
                                      checked={jobRequirements}
                                      onChange={handleRequirementsChange}
                                    />
                                  }
                                />
                              </FormGroup>
                            </FormControl>
                          </Grid>
                        </Grid>
                        <Grid item md={4} xs={12} sm={12}>
                          <Grid item md={10} sm={12}>
                            <FormControl size="small" fullWidth>
                              <FormGroup>
                                <FormControlLabel
                                  label="Enable Role & Responsibilities"
                                  control={
                                    <Switch
                                      checked={JobRolesResponsibility}
                                      onChange={handleRolesResponsibilityChange}
                                    />
                                  }
                                />
                              </FormGroup>
                            </FormControl>
                          </Grid>
                        </Grid>
                        <Grid item md={4} xs={12} sm={12}>
                          <Grid item md={10} sm={12}>
                            <FormControl size="small" fullWidth>
                              <FormGroup>
                                <FormControlLabel
                                  label="Enable Job Perks"
                                  control={
                                    <Switch
                                      checked={jobPerks}
                                      onChange={handlePerksChange}
                                    />
                                  }
                                />
                              </FormGroup>
                            </FormControl>
                          </Grid>
                        </Grid>
                        <br />
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                          <Typography>
                            <b>Requirements</b>
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          lg={12}
                          md={12}
                          sm={12}
                          xs={12}
                          marginTop={1}
                        >
                          <FormControl fullWidth size="small">
                            <Typography> Job Requirements</Typography>

                            <ReactQuill
                              style={{ height: "180px" }}
                              value={jobrequire}
                              onChange={handleChangeJobRequire}
                              modules={{
                                toolbar: [
                                  [
                                    { header: "1" },
                                    { header: "2" },
                                    { font: [] },
                                  ],
                                  [{ size: [] }],
                                  [
                                    "bold",
                                    "italic",
                                    "underline",
                                    "strike",
                                    "blockquote",
                                  ],
                                  [
                                    { list: "ordered" },
                                    { list: "bullet" },
                                    { indent: "-1" },
                                    { indent: "+1" },
                                  ],
                                  ["link", "image", "video"],
                                  ["clean"],
                                ],
                              }}
                              formats={[
                                "header",
                                "font",
                                "size",
                                "bold",
                                "italic",
                                "underline",
                                "strike",
                                "blockquote",
                                "list",
                                "bullet",
                                "indent",
                                "link",
                                "image",
                                "video",
                              ]}
                              readOnly={!jobRequirements}
                            />
                          </FormControl>
                        </Grid>
                        <br />
                        <Grid
                          item
                          lg={12}
                          md={12}
                          sm={12}
                          xs={12}
                          marginTop={1}
                        >
                          <br /> <br />
                          <FormControl fullWidth size="small">
                            <Typography>Job Benefits </Typography>

                            <ReactQuill
                              style={{ height: "180px" }}
                              value={jobBenefits}
                              onChange={handleChangeJobBenefits}
                              modules={{
                                toolbar: [
                                  [
                                    { header: "1" },
                                    { header: "2" },
                                    { font: [] },
                                  ],
                                  [{ size: [] }],
                                  [
                                    "bold",
                                    "italic",
                                    "underline",
                                    "strike",
                                    "blockquote",
                                  ],
                                  [
                                    { list: "ordered" },
                                    { list: "bullet" },
                                    { indent: "-1" },
                                    { indent: "+1" },
                                  ],
                                  ["link", "image", "video"],
                                  ["clean"],
                                ],
                              }}
                              formats={[
                                "header",
                                "font",
                                "size",
                                "bold",
                                "italic",
                                "underline",
                                "strike",
                                "blockquote",
                                "list",
                                "bullet",
                                "indent",
                                "link",
                                "image",
                                "video",
                              ]}
                              // disabled={jobRequirements == false}
                              readOnly={!jobRequirements}
                            />
                          </FormControl>
                        </Grid>
                        <br /> <br /> <br />
                        <Grid
                          item
                          lg={12}
                          md={12}
                          sm={12}
                          xs={12}
                          marginTop={1}
                        >
                          <InputLabel> Role And Responsibilities </InputLabel>
                          <FormControl fullWidth size="small">
                            <ReactQuill
                              style={{ height: "180px" }}
                              value={roleAndResTextArea}
                              onChange={handleRoleAndResponseText}
                              modules={{
                                toolbar: [
                                  [
                                    { header: "1" },
                                    { header: "2" },
                                    { font: [] },
                                  ],
                                  [{ size: [] }],
                                  [
                                    "bold",
                                    "italic",
                                    "underline",
                                    "strike",
                                    "blockquote",
                                  ],
                                  [
                                    { list: "ordered" },
                                    { list: "bullet" },
                                    { indent: "-1" },
                                    { indent: "+1" },
                                  ],
                                  ["link", "image", "video"],
                                  ["clean"],
                                ],
                              }}
                              formats={[
                                "header",
                                "font",
                                "size",
                                "bold",
                                "italic",
                                "underline",
                                "strike",
                                "blockquote",
                                "list",
                                "bullet",
                                "indent",
                                "link",
                                "image",
                                "video",
                              ]}
                              readOnly={!jobRequirements}
                            />
                          </FormControl>
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                          <Grid item md={8} xs={12} sm={6}>
                            <Typography>
                              <b>Requirement Email Template</b>
                            </Typography>
                          </Grid>
                          <Grid item md={4} xs={12} sm={6}>
                            <Link
                              to="/settings/settingkeywordinstructions"
                              target="_blank"
                              style={{
                                marginright: "10px",
                                justifyContent: "right",
                                textDecoration: "none",
                                color: "blue",
                              }}
                            >
                              <Button variant="contained" size="small">
                                Refer a Keyword
                              </Button>
                            </Link>
                          </Grid>
                          <br /> <br />
                          <Grid item lg={12} md={12} sm={12} xs={12}>
                            <Typography>Email Template Description </Typography>
                            <FormControl fullWidth size="small">
                              <ReactQuill
                                style={{ height: "180px" }}
                                value={emailName}
                                onChange={handleRoleAndResponse}
                                modules={{
                                  toolbar: [
                                    [
                                      { header: "1" },
                                      { header: "2" },
                                      { font: [] },
                                    ],
                                    [{ size: [] }],
                                    [
                                      "bold",
                                      "italic",
                                      "underline",
                                      "strike",
                                      "blockquote",
                                    ],
                                    [
                                      { list: "ordered" },
                                      { list: "bullet" },
                                      { indent: "-1" },
                                      { indent: "+1" },
                                    ],
                                    ["link", "image", "video"],
                                    ["clean"],
                                  ],
                                }}
                                formats={[
                                  "header",
                                  "font",
                                  "size",
                                  "bold",
                                  "italic",
                                  "underline",
                                  "strike",
                                  "blockquote",
                                  "list",
                                  "bullet",
                                  "indent",
                                  "link",
                                  "image",
                                  "video",
                                ]}
                              />
                            </FormControl>
                          </Grid>
                        </Grid>
                      </>
                    </TabPanel>
                    <TabPanel value={value} index={4}>
                      <Grid container spacing={2}>
                        {/* Submit/Update Button Background Colour */}

                        <Grid
                          item
                          lg={12}
                          md={12}
                          sm={12}
                          xs={12}
                          display="flex"
                          flexDirection="row"
                        >
                          <Typography variant="h6">
                            Colours & Fonts &nbsp;
                          </Typography>
                          <Button
                            variant="outlined"
                            startIcon={<ReplayIcon />}
                            onClick={() => {
                              // Add your reset logic here if different
                              setColourAndFont({
                                navbgcolour: "#1976d2",
                                navfontcolour: "#ffffff",
                                companylogobfcolour: "#1976d2",
                                submitbgcolour: "#1976d2",
                                submitfontcolour: "#ffffff",
                                clearcancelbgcolour: "#f4f4f4",
                                clearcancelfontcolour: "#444",
                                bulkdeletebgcolour: "#d32f2f",
                                bulkdeletefontcolour: "#ffffff",
                                editiconcolour: "#1976d2",
                                deleteiconcolour: "#1976d2",
                                viewiconcolour: "#1976d2",
                                infoiconcolour: "#1976d2",
                                pageheadingfontsize: "medium",
                              });
                            }}
                            sx={{ cursor: "pointer", marginLeft: 1 }}
                          >
                            Reset
                          </Button>
                        </Grid>
                        <Grid item xs={12} sm={5} md={5}>
                          <TextField
                            label="Submit/Update Button Background Colour"
                            type="color"
                            variant="outlined"
                            fullWidth
                            value={colourAndFont.submitbgcolour}
                            onChange={(e) => {
                              setColourAndFont((prev) => ({
                                ...prev,
                                submitbgcolour: e.target.value,
                              }));
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() =>
                                      setColourAndFont((prev) => ({
                                        ...prev,
                                        submitbgcolour: "#1976d2", // Reset to default color
                                      }))
                                    }
                                    aria-label="reset"
                                  >
                                    <RefreshIcon />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                            InputLabelProps={{
                              shrink: true,
                              style: {
                                fontSize: "1rem", // Increase font size
                                fontWeight: "bold", // Set font weight to bold
                              },
                            }}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={2}
                          md={2}
                          display="flex"
                          justifyContent="center"
                        >
                          <Button
                            variant="contained"
                            style={{
                              backgroundColor: colourAndFont.submitbgcolour,
                              color: colourAndFont.submitfontcolour,
                              padding: "5px 10px",
                              fontSize: "14px",
                              fontWeight: "bold",
                            }}
                          >
                            Submit
                          </Button>
                        </Grid>
                        {/* Submit/Update Button Font Colour */}
                        <Grid item xs={12} sm={5} md={5}>
                          <TextField
                            label="Submit/Update Button Font Colour"
                            type="color"
                            variant="outlined"
                            fullWidth
                            value={colourAndFont.submitfontcolour}
                            onChange={(e) => {
                              setColourAndFont((prev) => ({
                                ...prev,
                                submitfontcolour: e.target.value,
                              }));
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() =>
                                      setColourAndFont((prev) => ({
                                        ...prev,
                                        submitfontcolour: "#ffffff", // Reset to default color
                                      }))
                                    }
                                    aria-label="reset"
                                  >
                                    <RefreshIcon />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                            InputLabelProps={{
                              shrink: true,
                              style: {
                                fontSize: "1rem", // Increase font size
                                fontWeight: "bold", // Set font weight to bold
                              },
                            }}
                          />
                        </Grid>

                        {/* Clear/Cancel Button Background Colour */}
                        <Grid item xs={12} sm={5} md={5}>
                          <TextField
                            label="Clear/Cancel Button Background Colour"
                            type="color"
                            variant="outlined"
                            fullWidth
                            value={colourAndFont.clearcancelbgcolour}
                            onChange={(e) => {
                              setColourAndFont((prev) => ({
                                ...prev,
                                clearcancelbgcolour: e.target.value,
                              }));
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() =>
                                      setColourAndFont((prev) => ({
                                        ...prev,
                                        clearcancelbgcolour: "#f4f4f4", // Reset to default color
                                      }))
                                    }
                                    aria-label="reset"
                                  >
                                    <RefreshIcon />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                            InputLabelProps={{
                              shrink: true,
                              style: {
                                fontSize: "1rem", // Increase font size
                                fontWeight: "bold", // Set font weight to bold
                              },
                            }}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={2}
                          md={2}
                          display="flex"
                          justifyContent="center"
                        >
                          <Button
                            variant="contained"
                            style={{
                              backgroundColor:
                                colourAndFont.clearcancelbgcolour,
                              color: colourAndFont.clearcancelfontcolour,
                              // padding: "5px 10px",
                              // fontSize: "14px",
                              // fontWeight: "bold",

                              boxShadow: "none",
                              borderRadius: "3px",
                              border: "1px solid #0000006b",
                            }}
                          >
                            Clear
                          </Button>
                        </Grid>
                        {/* Clear/Cancel Button Font Colour */}
                        <Grid item xs={12} sm={5} md={5}>
                          <TextField
                            label="Clear/Cancel Button Font Colour"
                            type="color"
                            variant="outlined"
                            fullWidth
                            value={colourAndFont.clearcancelfontcolour}
                            onChange={(e) => {
                              setColourAndFont((prev) => ({
                                ...prev,
                                clearcancelfontcolour: e.target.value,
                              }));
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() =>
                                      setColourAndFont((prev) => ({
                                        ...prev,
                                        clearcancelfontcolour: "#444", // Reset to default color
                                      }))
                                    }
                                    aria-label="reset"
                                  >
                                    <RefreshIcon />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                            InputLabelProps={{
                              shrink: true,
                              style: {
                                fontSize: "1rem", // Increase font size
                                fontWeight: "bold", // Set font weight to bold
                              },
                            }}
                          />
                        </Grid>

                        {/* Bulk Delete Button Background Colour */}
                        <Grid item xs={12} sm={5} md={5}>
                          <TextField
                            label="Bulk Delete Button Background Colour"
                            type="color"
                            variant="outlined"
                            fullWidth
                            value={colourAndFont.bulkdeletebgcolour}
                            onChange={(e) => {
                              setColourAndFont((prev) => ({
                                ...prev,
                                bulkdeletebgcolour: e.target.value,
                              }));
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() =>
                                      setColourAndFont((prev) => ({
                                        ...prev,
                                        bulkdeletebgcolour: "#d32f2f", // Reset to default color
                                      }))
                                    }
                                    aria-label="reset"
                                  >
                                    <RefreshIcon />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                            InputLabelProps={{
                              shrink: true,
                              style: {
                                fontSize: "1rem", // Increase font size
                                fontWeight: "bold", // Set font weight to bold
                              },
                            }}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={2}
                          md={2}
                          display="flex"
                          justifyContent="center"
                        >
                          <Button
                            variant="contained"
                            style={{
                              backgroundColor: colourAndFont.bulkdeletebgcolour,
                              color: colourAndFont.bulkdeletefontcolour,
                              padding: "7px 12px",
                              fontSize: "14px",
                              fontWeight: "bold",
                            }}
                          >
                            Bulk Delete
                          </Button>
                        </Grid>
                        {/* Bulk Delete Button Font Colour */}
                        <Grid item xs={12} sm={5} md={5}>
                          <TextField
                            label="Bulk Delete Button Font Colour"
                            type="color"
                            variant="outlined"
                            fullWidth
                            value={colourAndFont.bulkdeletefontcolour}
                            onChange={(e) => {
                              setColourAndFont((prev) => ({
                                ...prev,
                                bulkdeletefontcolour: e.target.value,
                              }));
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() =>
                                      setColourAndFont((prev) => ({
                                        ...prev,
                                        bulkdeletefontcolour: "#ffffff", // Reset to default color
                                      }))
                                    }
                                    aria-label="reset"
                                  >
                                    <RefreshIcon />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                            InputLabelProps={{
                              shrink: true,
                              style: {
                                fontSize: "1rem", // Increase font size
                                fontWeight: "bold", // Set font weight to bold
                              },
                            }}
                          />
                        </Grid>

                        {/* Navbar Background Colour */}
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Navbar Background Colour"
                            type="color"
                            variant="outlined"
                            fullWidth
                            value={colourAndFont.navbgcolour}
                            onChange={(e) => {
                              setColourAndFont((prev) => ({
                                ...prev,
                                navbgcolour: e.target.value,
                              }));
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() =>
                                      setColourAndFont((prev) => ({
                                        ...prev,
                                        navbgcolour: "#1976d2", // Reset to default color
                                      }))
                                    }
                                    aria-label="reset"
                                  >
                                    <RefreshIcon />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                            InputLabelProps={{
                              shrink: true,
                              style: {
                                fontSize: "1rem", // Increase font size
                                fontWeight: "bold", // Set font weight to bold
                              },
                            }}
                          />
                        </Grid>
                        {/* Navbar Font Colour */}
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Navbar Font Colour"
                            type="color"
                            variant="outlined"
                            fullWidth
                            value={colourAndFont.navfontcolour}
                            onChange={(e) => {
                              setColourAndFont((prev) => ({
                                ...prev,
                                navfontcolour: e.target.value,
                              }));
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() =>
                                      setColourAndFont((prev) => ({
                                        ...prev,
                                        navfontcolour: "#ffffff", // Reset to default color
                                      }))
                                    }
                                    aria-label="reset"
                                  >
                                    <RefreshIcon />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                            InputLabelProps={{
                              shrink: true,
                              style: {
                                fontSize: "1rem", // Increase font size
                                fontWeight: "bold", // Set font weight to bold
                              },
                            }}
                          />
                        </Grid>

                        {/* Company Logo Background Colour */}
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Company Logo Background Colour"
                            type="color"
                            variant="outlined"
                            fullWidth
                            value={colourAndFont.companylogobfcolour}
                            onChange={(e) => {
                              setColourAndFont((prev) => ({
                                ...prev,
                                companylogobfcolour: e.target.value,
                              }));
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() =>
                                      setColourAndFont((prev) => ({
                                        ...prev,
                                        companylogobfcolour: "#1976d2", // Reset to default color
                                      }))
                                    }
                                    aria-label="reset"
                                  >
                                    <RefreshIcon />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                            InputLabelProps={{
                              shrink: true,
                              style: {
                                fontSize: "1rem", // Increase font size
                                fontWeight: "bold", // Set font weight to bold
                              },
                            }}
                          />
                        </Grid>

                        {/* Edit Icon Colour */}
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Edit Icon Colour"
                            type="color"
                            variant="outlined"
                            fullWidth
                            value={colourAndFont.editiconcolour}
                            onChange={(e) => {
                              setColourAndFont((prev) => ({
                                ...prev,
                                editiconcolour: e.target.value,
                              }));
                            }}
                            InputLabelProps={{
                              shrink: true,
                              style: {
                                fontSize: "1rem", // Increase font size
                                fontWeight: "bold", // Set font weight to bold
                              },
                            }}
                            InputProps={{
                              startAdornment: (
                                <EditOutlinedIcon
                                  style={{
                                    color: colourAndFont.editiconcolour,
                                    fontSize: "large",
                                  }}
                                />
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() =>
                                      setColourAndFont((prev) => ({
                                        ...prev,
                                        editiconcolour: "#1976d2", // Reset to default color
                                      }))
                                    }
                                    aria-label="reset"
                                  >
                                    <RefreshIcon />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>

                        {/* Delete Icon Colour */}
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Delete Icon Colour"
                            type="color"
                            variant="outlined"
                            fullWidth
                            value={colourAndFont.deleteiconcolour}
                            onChange={(e) => {
                              setColourAndFont((prev) => ({
                                ...prev,
                                deleteiconcolour: e.target.value,
                              }));
                            }}
                            InputLabelProps={{
                              shrink: true,
                              style: {
                                fontSize: "1rem", // Increase font size
                                fontWeight: "bold", // Set font weight to bold
                              },
                            }}
                            InputProps={{
                              startAdornment: (
                                <DeleteOutlineOutlinedIcon
                                  style={{
                                    color: colourAndFont.deleteiconcolour,
                                    fontSize: "large",
                                  }}
                                />
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() =>
                                      setColourAndFont((prev) => ({
                                        ...prev,
                                        deleteiconcolour: "#1976d2", // Reset to default color
                                      }))
                                    }
                                    aria-label="reset"
                                  >
                                    <RefreshIcon />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>

                        {/* View Icon Colour */}
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="View Icon Colour"
                            type="color"
                            variant="outlined"
                            fullWidth
                            value={colourAndFont.viewiconcolour}
                            onChange={(e) => {
                              setColourAndFont((prev) => ({
                                ...prev,
                                viewiconcolour: e.target.value,
                              }));
                            }}
                            InputLabelProps={{
                              shrink: true,
                              style: {
                                fontSize: "1rem", // Increase font size
                                fontWeight: "bold", // Set font weight to bold
                              },
                            }}
                            InputProps={{
                              startAdornment: (
                                <VisibilityOutlinedIcon
                                  style={{
                                    color: colourAndFont.viewiconcolour,
                                    fontSize: "large",
                                  }}
                                />
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() =>
                                      setColourAndFont((prev) => ({
                                        ...prev,
                                        viewiconcolour: "#1976d2", // Reset to default color
                                      }))
                                    }
                                    aria-label="reset"
                                  >
                                    <RefreshIcon />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>

                        {/* Info Icon Colour */}
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Info Icon Colour"
                            type="color"
                            variant="outlined"
                            fullWidth
                            value={colourAndFont.infoiconcolour}
                            onChange={(e) => {
                              setColourAndFont((prev) => ({
                                ...prev,
                                infoiconcolour: e.target.value,
                              }));
                            }}
                            InputLabelProps={{
                              shrink: true,
                              style: {
                                fontSize: "1rem", // Increase font size
                                fontWeight: "bold", // Set font weight to bold
                              },
                            }}
                            InputProps={{
                              startAdornment: (
                                <InfoOutlinedIcon
                                  style={{
                                    color: colourAndFont.infoiconcolour,
                                    fontSize: "large",
                                  }}
                                />
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() =>
                                      setColourAndFont((prev) => ({
                                        ...prev,
                                        infoiconcolour: "#1976d2", // Reset to default color
                                      }))
                                    }
                                    aria-label="reset"
                                  >
                                    <RefreshIcon />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>

                        {/* Page Heading Font Size */}
                        <Grid item xs={12} sm={6}>
                          <FormControl
                            fullWidth
                            variant="standard"
                            size="small"
                          >
                            <InputLabel id="font-size-select-label">
                              Page Heading Font Size
                            </InputLabel>
                            <Select
                              labelId="font-size-select-label"
                              id="font-size-select"
                              value={colourAndFont.pageheadingfontsize} // your state value here
                              label="Page Heading Font Size"
                              onChange={(e) => {
                                setColourAndFont((prev) => ({
                                  ...prev,
                                  pageheadingfontsize: e.target.value,
                                }));
                              }}
                            >
                              <MenuItem value="small">Small</MenuItem>
                              <MenuItem value="medium">Medium</MenuItem>
                              <MenuItem value="large">Large</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                          <Typography>Watermark</Typography>
                          {waterMarkFile || waterMark ? (
                            <>
                              <Grid
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <img
                                  src={
                                    waterMarkFile ? waterMarkFile : waterMark
                                  }
                                  style={{ width: "50%" }}
                                  // height="100px"
                                />
                              </Grid>
                            </>
                          ) : (
                            <></>
                          )}
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
                                    id="watermark"
                                    accept=".png, .jpg, .icon, .jpeg"
                                    name="file"
                                    hidden
                                    onChange={handleUploadWaterMarkChange}
                                  />
                                </Button>
                                <Button
                                  onClick={(e) => {
                                    setWaterMarkFile("");
                                    setWaterMark("");
                                  }}
                                  sx={buttonStyles.btncancel}
                                >
                                  Reset
                                </Button>
                              </Grid>
                              <Typography
                                variant="body2"
                                style={{ marginTop: "5px", fontSize: "12px" }}
                              >
                                Allowed Type: .jpg,.png,.icon,.jpeg,Max File
                                size: 3MB
                              </Typography>
                            </FormControl>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                      <Typography>
                      Contrast
                      </Typography>
                      <Selects
                        options={[{value:0, label:"Fully transparent (invisible)"},
                          {value:0.05, label:"Semi-transparent (20% visible)"},
                          {value:0.1, label:"Very faint (10% visible)"},
                          {value:0.25, label:"Lightly visible (25% visible)"},
                          {value:0.5, label:"Semi-transparent (50% visible)"},
                          {value:0.75, label:"Mostly opaque (75% visible)"},
                          {value:1, label:"Fully opaque (completely visible)"},]}
                        styles={colourStyles}
                        value={{label:opacitytextwatermark, value:opacitytextwatermark}}
                        onChange={(e) => {
                          setOpacitywatermark(e.value);
                          setOpacitytextwatermark(e.label);
                        }}
                      />
                    </FormControl>
                        </Grid>
                      </Grid>
                    </TabPanel>

                    {isUserRoleAccess?.role?.includes("Manager") && (
                      <TabPanel value={value} index={5}>
                        <Grid container spacing={2}>
                          <Grid item md={12} xs={12} sm={12}>
                            <Typography variant="h6">CONNECT</Typography>
                          </Grid>
                          <Grid item md={4} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography>URL</Typography>
                              <OutlinedInput
                                id="component-outlined"
                                type="text"
                                placeholder="Please Enter URL"
                                value={hiConnect.url}
                                onChange={(e) => {
                                  setHiConnect({
                                    ...hiConnect,
                                    url: e.target.value,
                                  });
                                }}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={4} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography>API KEY</Typography>
                              <OutlinedInput
                                id="component-outlined"
                                type={showApiKey ? "text" : "password"}
                                placeholder="Please Enter API KEY"
                                value={hiConnect.apikey}
                                onChange={(e) => {
                                  setHiConnect({
                                    ...hiConnect,
                                    apikey: e.target.value,
                                  });
                                }}
                                endAdornment={
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle API key visibility"
                                      onClick={handleToggleVisibility}
                                      onMouseDown={(e) => e.preventDefault()}
                                      edge="end"
                                    >
                                      {showApiKey ? (
                                        <Visibility />
                                      ) : (
                                        <VisibilityOff />
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                }
                                inputProps={{
                                  "aria-label": "API key",
                                  onCopy: (e) => e.preventDefault(), // Restrict copying
                                }}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={4} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography>Email Domain</Typography>
                              <OutlinedInput
                                id="component-outlined"
                                type="text"
                                placeholder="Please Enter Email Domain"
                                value={hiConnect.emaildomain}
                                onChange={(e) => {
                                  setHiConnect({
                                    ...hiConnect,
                                    emaildomain: e.target.value?.toLowerCase(),
                                  });
                                }}
                              />
                            </FormControl>
                          </Grid>
                        </Grid>
                      </TabPanel>
                    )}
                  </Box>
                </Box>
                <br />
                <br />
                <Grid
                  container
                  sx={{ justifyContent: "center", display: "flex" }}
                  spacing={2}
                >
                  <Grid item>
                    <Button variant="contained" color="primary" type="submit">
                      Update
                    </Button>
                  </Grid>
                  <Grid item>
                    <Link
                      to="/dashboard"
                      style={{ textDecoration: "none", color: "white" }}
                    >
                      {" "}
                      <Button sx={buttonStyles.btncancel}> Cancel </Button>{" "}
                    </Link>
                  </Grid>
                </Grid>
              </form>
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
export default ControlPanel;
