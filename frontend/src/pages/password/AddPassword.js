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
  Checkbox,
  IconButton,
  FormGroup,
  FormControlLabel,
  InputAdornment,
} from "@mui/material";
import { userStyle } from "../../pageStyle";
import { handleApiError } from "../../components/Errorhandling";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import Selects from "react-select";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import ListPassword from "./ListPassword";
import VerifiedListPassword from "./VerifiedListPassword";
import { MultiSelect } from "react-multi-select-component";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LoadingButton from "@mui/lab/LoadingButton";
import { FaPlus } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import PageHeading from "../../components/PageHeading";
import MessageAlert from "../../components/MessageAlert";
import AlertDialog from "../../components/Alert";


function AddPassword() {
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
    setloadingdeloverall(false);
  };
  const handleClosePopupMalert = () => {
    setOpenPopupMalert(false);
  };
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const handleClickOpenPopup = () => {
    setOpenPopup(true);
    setloadingdeloverall(false);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };



  //state to handle meeting values
  const [loadingdeloverall, setloadingdeloverall] = useState(false);
  const [passwordState, setPasswordState] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    team: "Please Select Team",
    employeename: "Please Select Employee Name",
    category: "Please Select Category",
    subcategory: "Please Select Sub Category",
    publicip: "Please Select Public IP Details",
    vpnname: "",
    vpntype: "Please Select VPN Type",
    assignedip: "Please Select Assigned IP",
    username: "",
    type: "Password",
    autogenerate: true,
    temppassword: "",
    livepassword: "",
    employeedbid: "",
    ipsecsecretpassword: "",
  });

  //todo start

  const [passwordTodo, setPasswordTodo] = useState([]);

  const addTodo = () => {
    let newObject = {
      category: passwordState?.category,
      subcategory: passwordState?.subcategory,
      publicip: passwordState?.publicip,
      vpnname: passwordState?.vpnname,
      vpntype: passwordState?.vpntype,
      assignedip: passwordState?.assignedip,
      unassignedIpId: unassignedIpId,
      username: passwordState?.username,
      ipsecsecretpassword: passwordState?.ipsecsecretpassword,
      type: passwordState?.type,
      autogenerate: passwordState?.autogenerate,
      temppassword: passwordState?.temppassword,
      showLivePassword: showLivePassword,
      showPassword: showPassword,
      subCategoryOptions: subCategoryOption,
      livepassword: passwordState?.livepassword,
    };

    const isDuplicate = passwordTodo.some(
      (todo) =>
        todo.category === newObject.category &&
        todo.subcategory === newObject.subcategory &&
        todo.publicip === newObject.publicip &&
        todo.vpnname === newObject.vpnname &&
        todo.vpntype === newObject.vpntype &&
        todo.assignedip === newObject.assignedip &&
        todo.username === newObject.username &&
        todo.ipsecsecretpassword === newObject.ipsecsecretpassword &&
        todo.type === newObject.type &&
        todo.temppassword === newObject.temppassword &&
        todo.livepassword === newObject.livepassword
    );

    if (passwordState.type === "Please Select Type") {
      setPopupContent("Please Select Type");
      setPopupSeverity("warning");
      handleClickOpenPopup();
    } else if (passwordState.category === "Please Select Category") {
      setPopupContent("Please Select Category");
      setPopupSeverity("warning");
      handleClickOpenPopup();
    } else if (
      passwordState.type === "IP" &&
      passwordState.publicip === "Please Select Public IP Details"
    ) {

      setPopupContent("Please Select Public IP Details");
      setPopupSeverity("warning");
      handleClickOpenPopup();
    } else if (passwordState.type === "IP" && passwordState.vpnname === "") {
      setPopupContent("Please Enter VPN Name");
      setPopupSeverity("warning");
      handleClickOpenPopup();
    } else if (
      passwordState.type === "IP" &&
      passwordState.vpntype === "Please Select VPN Type"
    ) {

      setPopupContent("Please Select VPN Type");
      setPopupSeverity("warning");
      handleClickOpenPopup();
    } else if (
      passwordState.type === "IP" &&
      passwordState.assignedip === "Please Select Assigned IP"
    ) {

      setPopupContent("Please Select Assigned IP");
      setPopupSeverity("warning");
      handleClickOpenPopup();
    } else if (passwordState.username === "") {

      setPopupContent("Please Enter Username");
      setPopupSeverity("warning");
      handleClickOpenPopup();
    } else if (passwordState.autogenerate && tempAuto === "") {

      setPopupContent("Please Enter Temp Password");
      setPopupSeverity("warning");
      handleClickOpenPopup();
    } else if (
      !passwordState.autogenerate &&
      passwordState.temppassword === ""
    ) {

      setPopupContent("Please Enter Temp Password");
      setPopupSeverity("warning");
      handleClickOpenPopup();
    } else if (passwordState.livepassword === "") {

      setPopupContent("Please Enter Live Password");
      setPopupSeverity("warning");
      handleClickOpenPopup();
    } else if (isDuplicate) {

      setPopupContent("Todo Already Exist");
      setPopupSeverity("warning");
      handleClickOpenPopup();
    } else {
      setPasswordTodo((prevState) => [...prevState, newObject]);
      setPasswordState((prev) => ({
        ...prev,
        // category: "Please Select Category",
        // subcategory: "Please Select Sub Category",
        // publicip: "Please Select Public IP Details",
        // vpnname: "",
        // vpntype: "Please Select VPN Type",
        assignedip: "Please Select Assigned IP",
        // username: "",
        // type: "Password",
        // autogenerate: true,
        // temppassword: "",
        // livepassword: "",
        // ipsecsecretpassword: "",
      }));
    }
  };

  const deleteTodo = (index) => {
    setPasswordTodo(passwordTodo.filter((_, i) => i !== index));
  };

  const handleTodoChange = (index, field, value) => {
    const updatedTodo = [...passwordTodo];
    updatedTodo[index] = { ...updatedTodo[index], [field]: value };
    setPasswordTodo(updatedTodo);
  };

  const handleMultipleTodoChanges = (index, changes) => {
    const updatedTodo = [...passwordTodo];
    updatedTodo[index] = { ...updatedTodo[index], ...changes };
    setPasswordTodo(updatedTodo);
  };

  // todo end

  const [unassignedIpId, setUnassignedIpId] = useState();
  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, allTeam, allUsersData, pageName, setPageName, buttonStyles } = useContext(
    UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [categoryOption, setCategoryOption] = useState([]);
  const [subCategoryOption, setSubCategoryOption] = useState([]);
  const [categoryOptionIP, setCategoryOptionIP] = useState([]);
  const [assignedIPOption, setAssignedIPOption] = useState([]);
  const [iPDetails, setIPDetails] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showLivePassword, setShowLivePassword] = useState(false);
  const [tempAuto, setTempAuto] = useState("");
  const [findMatch, setFindMatch] = useState([]);
  const [vendorAuto, setVendorAuto] = useState("");
  const [twoTable, setTwotable] = useState("");
  //useEffect
  useEffect(() => {
    fetchCategoryAll();
    fetchIPCategoryAll();
    fetchAllApproveds();
    fetchUnAssignedIP();
  }, []);

  //company multiselect
  const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
  let [valueCompanyCat, setValueCompanyCat] = useState([]);
  const [selectedCompanyOptionsCateEdit, setSelectedCompanyOptionsCateEdit] =
    useState([]);
  const [companyValueCateEdit, setCompanyValueCateEdit] = useState("");

  const handleCompanyChange = (options) => {
    setValueCompanyCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCompany(options);
    setValueBranchCat([]);
    setSelectedOptionsBranch([]);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);

    setPasswordState({
      ...passwordState,
      employeename: "Please Select Employee Name",
      temppassword: "",
      livepassword: "",
      username: "",
    });
    setTempAuto("");
  };

  const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
    return valueCompanyCat?.length
      ? valueCompanyCat.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
  };

  //branch multiselect
  const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
  let [valueBranchCat, setValueBranchCat] = useState([]);
  const handleBranchChange = (options) => {
    setValueBranchCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBranch(options);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);

    setPasswordState({
      ...passwordState,
      employeename: "Please Select Employee Name",
      temppassword: "",
      livepassword: "",
      username: "",
    });
    setTempAuto("");
  };

  const customValueRendererBranch = (valueBranchCat, _categoryname) => {
    return valueBranchCat?.length
      ? valueBranchCat.map(({ label }) => label)?.join(", ")
      : "Please Select Branch";
  };
  //unit multiselect
  const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
  let [valueUnitCat, setValueUnitCat] = useState([]);

  const handleUnitChange = (options) => {
    setValueUnitCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsUnit(options);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);

    setPasswordState({
      ...passwordState,
      employeename: "Please Select Employee Name",
      temppassword: "",
      livepassword: "",
      username: "",
    });
    setTempAuto("");
  };

  const customValueRendererUnit = (valueUnitCat, _categoryname) => {
    return valueUnitCat?.length
      ? valueUnitCat.map(({ label }) => label)?.join(", ")
      : "Please Select Unit";
  };

  //team multiselect
  const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
  let [valueTeamCat, setValueTeamCat] = useState([]);
  const handleTeamChange = (options) => {
    setValueTeamCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsTeam(options);

    setPasswordState({
      ...passwordState,
      employeename: "Please Select Employee Name",
      temppassword: "",
      livepassword: "",
      username: "",
    });
    setTempAuto("");
  };

  const customValueRendererTeam = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length
      ? valueTeamCat.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowLivePassword = () =>
    setShowLivePassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleMouseDownLivePassword = (event) => {
    event.preventDefault();
  };
  //get all project.
  const fetchAllApproveds = async () => {
    setPageName(!pageName)
    try {
      let res_doc = await axios.get(SERVICE.ALL_PASSWORD, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setFindMatch(res_doc?.data.pass);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };


  const fetchUnAssignedIP = async () => {
    setPageName(!pageName)
    try {
      let res_vendor = await axios.get(SERVICE.IPMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let arrval = (res_vendor?.data?.ipmaster || [])
        .map((item) => ({
          ...item,
          ipconfig: item.ipconfig.filter(
            (ipitem) => ipitem.status != "assigned"
          ),
        }))
        .map((item) => item.ipconfig);

      const mergedArray = [].concat(...arrval);
      const transformedArray = mergedArray.map((obj) => ({
        label: obj.ipaddress,
        value: obj.ipaddress,
        ...obj,
      }));
      setAssignedIPOption(transformedArray);
      setIPDetails(res_vendor?.data?.ipmaster);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchIPSecPassword = async (e) => {
    setPageName(!pageName)
    try {
      let res_vendor = await axios.get(SERVICE.IPMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let filtered = res_vendor?.data?.ipmaster.filter((data) => {
        return (
          data.categoryname === passwordState.category &&
          data.subcategoryname === passwordState.subcategory &&
          data.ipaddress === e.value
        );
      });

      setPasswordState((prev) => ({
        ...prev,
        ipsecsecretpassword: filtered[0].ipsecsecretpassword,
      }));
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const fetchIPSecPasswordTodo = async (category, subcategory, ip, index) => {
    setPageName(!pageName)
    try {
      let res_vendor = await axios.get(SERVICE.IPMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let filtered = res_vendor?.data?.ipmaster.filter((data) => {
        return (
          data.categoryname === category &&
          data.subcategoryname === subcategory &&
          data.ipaddress === ip
        );
      });

      handleMultipleTodoChanges(index, {
        category: category,
        publicip: ip,
        ipsecsecretpassword: filtered[0].ipsecsecretpassword,
      });
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const autoGenerateTempPassword = (data) => {
    const user = data[0];
    const nameAbbreviation = user.name.substring(0, 6);
    const originalDate = user.dob;
    const parts = originalDate.split("-");
    const rearrangedDate = `${parts[2]}${parts[1]}${parts[0]}`;
    const temppassword = nameAbbreviation + "@" + rearrangedDate;
    return temppassword;
  };
  const fetchEmployeeDetails = async (
    company,
    branch,
    unit,
    team,
    employeename
  ) => {
    setPageName(!pageName)
    try {
      let res_team = await axios.post(SERVICE.EMP_DETAILS, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
        company,
        branch,
        unit,
        team,
        employeename: String(employeename),
      });
      let empDet = [
        ...res_team?.data?.empDetails?.map((t) => ({
          name: t.companyname,
          dob: t.dob,
        })),
      ];
      const tempPass = await autoGenerateTempPassword(empDet);
      setTempAuto(tempPass);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

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
      let addedVpn = [{ label: "VPN", value: "VPN" }, ...catOpt];
      setCategoryOption(catOpt);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const fetchIPCategoryAll = async () => {
    setPageName(!pageName)
    try {
      let response = await axios.get(`${SERVICE.IPCATEGORY}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      let catOpt = [
        ...response?.data?.ipcategory?.map((t) => ({
          ...t,
          label: t.categoryname,
          value: t.categoryname,
        })),
      ];
      setCategoryOptionIP(catOpt);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
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
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchSubCategoryTodo = async (category, type, index) => {
    setPageName(!pageName)
    try {
      const res = await axios.post(SERVICE.SUB_CAT, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
        category: String(category),
        type,
      });
      const subcatOpt = res.data.subcat
        ?.map((item) =>
          item.subcategoryname.map((subcategory) => ({
            label: subcategory,
            value: subcategory,
          }))
        )
        .flat();
      handleMultipleTodoChanges(index, {
        category: category,
        subcategory: "Please Select Sub Category",
        publicip: "Please Select Public IP Details",
        assignedip: "Please Select Assigned IP",
        ipsecsecretpassword: "",
        vpnname: "",
        subCategoryOptions: subcatOpt,
      });
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const vpnTypeOption = [
    { value: "OpenVPN", label: "OpenVPN" },
    { value: "IKEv2/IPsec", label: "IKEv2/IPsec" },
    { value: "WireGuard", label: "WireGuard" },
    { value: "SSTP", label: "SSTP" },
    { value: "L2TP/IPsec", label: "L2TP/IPsec" },
    { value: "PPTP", label: "PPTP" },
  ];
  const typeOption = [
    { value: "Password", label: "Password" },
    { value: "IP", label: "IP" },
  ];
  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
    setloadingdeloverall(false);
  };

  //add function
  const sendRequest = async () => {
    setPageName(!pageName)
    setVendorAuto("ABCD");
    try {
      await Promise.all(
        passwordTodo?.map(async (data) => {
          await axios.post(SERVICE.CREATE_PASSWORD, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            company: [...valueCompanyCat],
            branch: [...valueBranchCat],
            unit: [...valueUnitCat],
            team: [...valueTeamCat],
            employeename: String(passwordState.employeename),
            employeedbid: String(passwordState.employeedbid),
            type: String(data.type),
            category: String(data.category),
            ipsecsecretpassword: String(data.ipsecsecretpassword),

            subcategory: String(
              data.subcategory === "Please Select Sub Category"
                ? "ALL"
                : data.subcategory
            ),
            publicip: String(data.type === "IP" ? data.publicip : ""),
            vpnname: String(data.type === "IP" ? data.vpnname : ""),
            vpntype: String(data.type === "IP" ? data.vpntype : ""),
            assignedip: String(data.type === "IP" ? data.assignedip : ""),
            assignedipid: String(
              data.type === "IP" ? data?.unassignedIpId : ""
            ),
            username: String(data.username),
            temppassword: String(
              data.autogenerate ? tempAuto : data.temppassword
            ),
            autogenerate: Boolean(data.autogenerate),
            livepassword: String(data.livepassword),
            firewallstatus: "Not Verified",
            addedby: [
              {
                name: String(isUserRoleAccess.companyname),
                date: String(new Date()),
              },
            ],
          });
        })
      );

      setPasswordState({
        ...passwordState,
        vpnname: "",
        username: "",
        autogenerate: true,
        temppassword: "",
        livepassword: "",
        assignedip: "Please Select Assigned IP",
        employeename: "Please Select Employee Name",
      });
      setTempAuto("");
      setVendorAuto("EFGH");
      await fetchAllApproveds();
      if (passwordTodo?.some((data) => data?.type === "IP")) {
        await updateIP();
      }
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const updateIP = async () => {
    setPageName(!pageName)
    try {
      let filteredIpTodo = passwordTodo?.filter((data) => data?.type === "IP");

      await Promise.all(
        filteredIpTodo?.map(async (data) => {
          await axios.post(SERVICE.IPMASTER_UPDATE, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            updatevalue: data?.unassignedIpId,
            company: [...valueCompanyCat],
            branch: [...valueBranchCat],
            unit: [...valueUnitCat],
            team: [...valueTeamCat],
            employeename: String(passwordState.employeename),
            status: "assigned",
            assignedthrough: "Password",
            addedby: {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          });
        })
      );

      await fetchUnAssignedIP();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  console.log(passwordTodo, "passwordTodo")


  //submit option for saving
  const handleSubmit = (e) => {
    setPageName(!pageName)
    setloadingdeloverall(true);
    e.preventDefault();
    let compopt = selectedOptionsCompany.map((item) => item.value);
    let branchopt = selectedOptionsBranch.map((item) => item.value);
    let unitopt = selectedOptionsUnit.map((item) => item.value);
    let teamopt = selectedOptionsTeam.map((item) => item.value);

    const isNameMatch = findMatch.some(
      (item) =>
        item.company.some((data) => compopt.includes(data)) &&
        item.branch.some((data) => branchopt.includes(data)) &&
        item.unit.some((data) => unitopt.includes(data)) &&
        item.team.some((data) => teamopt.includes(data)) &&
        item.type === passwordState.type &&
        item.employeename === passwordState.employeename &&
        item.category === passwordState.category
    );

    const validateTodo = (todo) => {
      if (todo.type === "Please Select Type") {
        return "Please Select Type";
      }
      if (todo.category === "Please Select Category") {
        return "Please Select Category";
      }
      if (
        todo.type === "IP" &&
        todo.publicip === "Please Select Public IP Details"
      ) {
        return "Please Select Public IP Details";
      }
      if (todo.type === "IP" && todo.vpnname === "") {
        return "Please Enter VPN Name";
      }
      if (todo.type === "IP" && todo.vpntype === "Please Select VPN Type") {
        return "Please Select VPN Type";
      }
      if (
        todo.type === "IP" &&
        todo.assignedip === "Please Select Assigned IP"
      ) {
        return "Please Select Assigned IP";
      }
      if (todo.username === "") {
        return "Please Enter Username";
      }
      if (!todo.autogenerate && todo.temppassword === "") {
        return "Please Enter Temp Password";
      }
      if (todo.livepassword === "") {
        return "Please Enter Live Password";
      }
      return null;
    };
    for (let i = 0; i < passwordTodo.length; i++) {
      const errorMessage = validateTodo(passwordTodo[i]);
      if (errorMessage) {
        setPopupContent(errorMessage);
        setPopupSeverity("warning");
        handleClickOpenPopup();
        return;
      }
    }


    let newObject = {
      category: passwordState?.category,
      subcategory: passwordState?.subcategory,
      publicip: passwordState?.publicip,
      vpnname: passwordState?.vpnname,
      vpntype: passwordState?.vpntype,
      assignedip: passwordState?.assignedip,
      unassignedIpId: unassignedIpId,
      username: passwordState?.username,
      ipsecsecretpassword: passwordState?.ipsecsecretpassword,
      type: passwordState?.type,
      autogenerate: passwordState?.autogenerate,
      temppassword: passwordState?.temppassword,
      showLivePassword: showLivePassword,
      showPassword: showPassword,
      subCategoryOptions: subCategoryOption,
      livepassword: passwordState?.livepassword,
    };

    const isDuplicate = passwordTodo.some(
      (todo) =>
        // todo.type === newObject.type &&
        // todo.category === newObject.category &&
        // todo.subcategory === newObject.subcategory &&
        // todo.username === newObject.username &&
        // todo.temppassword === newObject.temppassword &&
        // todo.livepassword === newObject.livepassword

        console.log(
          todo.type === newObject.type,
          todo.category === newObject.category,
          todo.subcategory === newObject.subcategory,
          todo.username === newObject.username,
          todo.temppassword === newObject.temppassword,
          todo.livepassword === newObject.livepassword

          , "conditon"
        )

    );

    let findeduplicate = passwordTodo.filter((item, index, self) => {
      return self.findIndex((i) => i.type === item.type &&
        i.category === item.category &&
        i.subcategory === item.subcategory &&
        i.username === item.username &&
        i.temppassword === item.temppassword &&
        i.livepassword === item.livepassword
      ) === index;
    })

    console.log(findeduplicate, "findeduplicate")


    if (valueCompanyCat?.length == 0) {
      setPopupContent("Please Select Company");
      setPopupSeverity("warning");
      handleClickOpenPopup();
    } else if (valueBranchCat?.length == 0) {
      setPopupContent("Please Select Branch");
      setPopupSeverity("warning");
      handleClickOpenPopup();
    } else if (valueUnitCat?.length == 0) {
      setPopupContent("Please Select Unit");
      setPopupSeverity("warning");
      handleClickOpenPopup();
    } else if (valueTeamCat?.length == 0) {
      setPopupContent("Please Select Team");
      setPopupSeverity("warning");
      handleClickOpenPopup();
    } else if (passwordState.employeename === "Please Select Employee Name") {
      setPopupContent("Please Select Employee Name");
      setPopupSeverity("warning");
      handleClickOpenPopup();
    } else if (passwordTodo?.length === 0) {
      setPopupContent("Please Add Data In the Todo");
      setPopupSeverity("warning");
      handleClickOpenPopup();
    }
    else if (isNameMatch) {
      setPopupContent("Data Already Exist!");
      setPopupSeverity("warning");
      handleClickOpenPopup();
    }
    else if (findeduplicate.length != passwordTodo?.length) {

      setPopupContent("Duplicate Data Exists In Todo");
      setPopupSeverity("warning");
      handleClickOpenPopup();
    }
    else {
      sendRequest();
    }
  };
  const handleclear = (e) => {
    e.preventDefault();
    setPasswordState({
      company: "Please Select Company",
      branch: "Please Select Branch",
      unit: "Please Select Unit",
      team: "Please Select Team",
      employeename: "Please Select Employee Name",
      category: "Please Select Category",
      subcategory: "Please Select Sub Category",
      publicip: "Please Select Public IP Details",
      vpnname: "",
      vpntype: "Please Select VPN Type",
      assignedip: "Please Select Assigned IP",
      username: "",
      autogenerate: true,
      temppassword: "",
      livepassword: "",
      type: "Password",
      employeedbid: "",
    });
    setTempAuto("");
    setSubCategoryOption([]);

    setValueCompanyCat([]);
    setSelectedOptionsCompany([]);
    setValueBranchCat([]);
    setSelectedOptionsBranch([]);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setPasswordTodo([]);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };



  const pathname = window.location.pathname;

  //Access Module

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Password"),
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


  const accessbranch = isAssignBranch
    ?.filter((data) => {
      let fetfinalurl = [];
      // Check if user is a Manager, in which case return all branches
      if (isUserRoleAccess?.role?.includes("Manager")) {
        return true; // Skip filtering, return all data for Manager
      }
      if (
        data?.modulenameurl?.length !== 0 &&
        data?.submodulenameurl?.length !== 0 &&
        data?.mainpagenameurl?.length !== 0 &&
        data?.subpagenameurl?.length !== 0 &&
        data?.subsubpagenameurl?.length !== 0
      ) {
        fetfinalurl = data.subsubpagenameurl;
      } else if (
        data?.modulenameurl?.length !== 0 &&
        data?.submodulenameurl?.length !== 0 &&
        data?.mainpagenameurl?.length !== 0 &&
        data?.subpagenameurl?.length !== 0
      ) {
        fetfinalurl = data.subpagenameurl;
      } else if (
        data?.modulenameurl?.length !== 0 &&
        data?.submodulenameurl?.length !== 0 &&
        data?.mainpagenameurl?.length !== 0
      ) {
        fetfinalurl = data.mainpagenameurl;
      } else if (
        data?.modulenameurl?.length !== 0 &&
        data?.submodulenameurl?.length !== 0
      ) {
        fetfinalurl = data.submodulenameurl;
      } else if (data?.modulenameurl?.length !== 0) {
        fetfinalurl = data.modulenameurl;
      } else {
        fetfinalurl = [];
      }

      // Check if the pathname exists in the URL
      return fetfinalurl?.includes(window.location.pathname);
    })
    ?.map((data) => ({
      branch: data.branch,
      company: data.company,
      unit: data.unit,
    }));



  return (
    <Box>
      <Headtitle title={"ADD PASSWORD"} />
      <PageHeading
        title="Add Password"
        modulename="Network Administration"
        submodulename="Passwords"
        mainpagename="Password"
        subpagename=""
        subsubpagename=""
      />
      <>
        {isUserRoleCompare?.includes("apassword") && (
          <Box sx={userStyle.selectcontainer}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  {" "}
                  <Typography sx={userStyle.importheadtext}>
                    Add Password
                  </Typography>{" "}
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={accessbranch?.map(data => ({
                        label: data.company,
                        value: data.company,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                      value={selectedOptionsCompany}
                      onChange={(e) => {
                        handleCompanyChange(e);
                      }}
                      valueRenderer={customValueRendererCompany}
                      labelledBy="Please Select Company"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={accessbranch?.filter(
                        (comp) =>
                          valueCompanyCat?.includes(comp.company)
                      )?.map(data => ({
                        label: data.branch,
                        value: data.branch,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                      value={selectedOptionsBranch}
                      onChange={(e) => {
                        handleBranchChange(e);
                      }}
                      valueRenderer={customValueRendererBranch}
                      labelledBy="Please Select Branch"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Unit<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={accessbranch?.filter(
                        (comp) =>
                          valueCompanyCat?.includes(comp.company) && valueBranchCat?.includes(comp.branch)
                      )?.map(data => ({
                        label: data.unit,
                        value: data.unit,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                      value={selectedOptionsUnit}
                      onChange={(e) => {
                        handleUnitChange(e);
                      }}
                      valueRenderer={customValueRendererUnit}
                      labelledBy="Please Select Unit"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Team<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={allTeam?.filter(
                        (comp) =>
                          valueCompanyCat?.includes(comp.company) && valueBranchCat?.includes(comp.branch) && valueUnitCat?.includes(comp.unit)
                      )?.map(data => ({
                        label: data.teamname,
                        value: data.teamname,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                      value={selectedOptionsTeam}
                      onChange={(e) => {
                        handleTeamChange(e);
                      }}
                      valueRenderer={customValueRendererTeam}
                      labelledBy="Please Select Team"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Employee Name<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={allUsersData
                        ?.filter(
                          (u) =>
                            valueCompanyCat?.includes(u.company) &&
                            valueBranchCat?.includes(u.branch) &&
                            valueUnitCat?.includes(u.unit) &&
                            valueTeamCat?.includes(u.team)
                        )
                        .map((u) => ({
                          ...u,
                          label: u.companyname,
                          value: u.companyname,
                        }))}
                      placeholder="Please Select Employee Name"
                      value={{
                        label: passwordState.employeename,
                        value: passwordState.employeename,
                      }}
                      onChange={(e) => {
                        fetchEmployeeDetails(
                          valueCompanyCat,
                          valueBranchCat,
                          valueUnitCat,
                          valueTeamCat,
                          e.value
                        );
                        setPasswordState({
                          ...passwordState,
                          employeename: e.value,
                          employeedbid: e._id,
                          username: e.username,
                          temppassword: "",
                          livepassword: "",
                        });
                        setPasswordTodo([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Type<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={typeOption}
                      placeholder="Please Select Type"
                      value={{
                        label: passwordState.type,
                        value: passwordState.type,
                      }}
                      onChange={(e) => {
                        setPasswordState({
                          ...passwordState,
                          type: e.value,
                          category: "Please Select Category",
                          subcategory: "Please Select Sub Category",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                {passwordState.type === "Password" && (
                  <>
                    <Grid item md={3} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Category<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          maxMenuHeight={300}
                          options={categoryOption}
                          placeholder="Please Select Category"
                          value={{
                            label: passwordState.category,
                            value: passwordState.category,
                          }}
                          onChange={(e) => {
                            setPasswordState({
                              ...passwordState,
                              category: e.value,
                              subcategory: "Please Select Sub Category",
                            });
                            fetchSubCategory(e.value, "Password");
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>Sub Category</Typography>
                        <Selects
                          maxMenuHeight={300}
                          options={subCategoryOption}
                          placeholder="Please Select Sub Category"
                          value={{
                            label: passwordState.subcategory,
                            value: passwordState.subcategory,
                          }}
                          onChange={(e) => {
                            setPasswordState({
                              ...passwordState,
                              subcategory: e.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}
                {passwordState.type === "IP" && (
                  <>
                    <Grid item md={3} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Category<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          maxMenuHeight={300}
                          options={categoryOptionIP}
                          placeholder="Please Select Category"
                          value={{
                            label: passwordState.category,
                            value: passwordState.category,
                          }}
                          onChange={(e) => {
                            setPasswordState({
                              ...passwordState,
                              category: e.value,
                              subcategory: "Please Select Sub Category",
                              publicip: "Please Select Public IP Details",
                              assignedip: "Please Select Assigned IP",
                              ipsecsecretpassword: "",
                              vpnname: "",
                            });
                            fetchSubCategory(e.value, "IP");
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>Sub Category</Typography>
                        <Selects
                          maxMenuHeight={300}
                          options={subCategoryOption}
                          placeholder="Please Select Sub Category"
                          value={{
                            label: passwordState.subcategory,
                            value: passwordState.subcategory,
                          }}
                          onChange={(e) => {
                            setPasswordState({
                              ...passwordState,
                              subcategory: e.value,
                              publicip: "Please Select Public IP Details",
                              assignedip: "Please Select Assigned IP",
                              ipsecsecretpassword: "",
                              vpnname: e.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}

                {passwordState.type === "IP" && (
                  <>
                    <Grid item md={3} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Public IP Details<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          maxMenuHeight={300}
                          options={iPDetails
                            ?.filter(
                              (u) =>
                                u.categoryname === passwordState.category &&
                                u.subcategoryname === passwordState.subcategory
                            )
                            .map((u) => ({
                              ...u,
                              label: u.ipaddress,
                              value: u.ipaddress,
                            }))
                            .filter(
                              (option, index, arr) =>
                                arr.findIndex(
                                  (t) => t.value === option.value
                                ) === index
                            )}
                          placeholder="Please Select Public IP Details"
                          value={{
                            label: passwordState.publicip,
                            value: passwordState.publicip,
                          }}
                          onChange={(e) => {
                            fetchIPSecPassword(e);
                            setPasswordState({
                              ...passwordState,
                              publicip: e.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>IP Sec Secret Password</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          readOnly={true}
                          type="text"
                          value={passwordState.ipsecsecretpassword}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          VPN Name<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Please Enter VPN Name"
                          value={passwordState.vpnname}
                          onChange={(e) => {
                            setPasswordState({
                              ...passwordState,
                              vpnname: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          VPN Type<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          maxMenuHeight={300}
                          options={vpnTypeOption}
                          placeholder="Please Select VPN Type"
                          value={{
                            label: passwordState.vpntype,
                            value: passwordState.vpntype,
                          }}
                          onChange={(e) => {
                            setPasswordState({
                              ...passwordState,
                              vpntype: e.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Assigned IP<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          maxMenuHeight={300}
                          options={assignedIPOption
                            ?.filter(
                              (u) =>
                                u.categoryname === passwordState.category &&
                                u.subcategoryname === passwordState.subcategory
                            )
                            .map((u) => ({
                              ...u,
                              label: u.ipaddress,
                              value: u.ipaddress,
                            }))}
                          placeholder="Please Select Assigned IP"
                          value={{
                            label: passwordState.assignedip,
                            value: passwordState.assignedip,
                          }}
                          onChange={(e) => {
                            setPasswordState({
                              ...passwordState,
                              assignedip: e.value,
                            });
                            setUnassignedIpId(e._id);
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Username<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Username"
                      value={passwordState.username}
                      onChange={(e) => {
                        setPasswordState({
                          ...passwordState,
                          username: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Temp Password<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      placeholder="Temp Password"
                      id="outlined-adornment-password"
                      type={showPassword ? "text" : "password"}
                      value={
                        passwordState.autogenerate
                          ? tempAuto
                          : passwordState.temppassword
                      }
                      onChange={(e) => {
                        if (!passwordState.autogenerate) {
                          setPasswordState({
                            ...passwordState,
                            temppassword: e.target.value,
                          });
                        }
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
                  <Grid>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={passwordState.autogenerate} />
                        }
                        onChange={(e) =>
                          setPasswordState({
                            ...passwordState,
                            autogenerate: !passwordState.autogenerate,
                          })
                        }
                        label="Auto Generate"
                      />
                    </FormGroup>
                  </Grid>
                </Grid>
                <Grid item md={2.5} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Live Password<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      placeholder="Live Password"
                      id="outlined-adornment-password"
                      type={showLivePassword ? "text" : "password"}
                      value={passwordState.livepassword}
                      onChange={(e) => {
                        setPasswordState({
                          ...passwordState,
                          livepassword: e.target.value,
                        });
                      }}
                      endAdornment={
                        <InputAdornment position="end">
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
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item md={0.5} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    {/* <Typography>&nbsp;</Typography> */}
                    <Button
                      variant="contained"
                      color="success"
                      onClick={addTodo}
                      type="button"
                      sx={{
                        height: "30px",
                        minWidth: "30px",
                        marginTop: "28px",
                        padding: "6px 10px",
                      }}
                    >
                      <FaPlus />
                    </Button>
                  </FormControl>
                </Grid>
                {passwordTodo?.map((data, index) => (
                  <div key={index}>
                    <Grid container spacing={2}>
                      <Grid item xs={8}>
                        <Typography sx={{ fontWeight: "bold" }}>{`Row No : ${index + 1
                          }`}</Typography>
                      </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={2}>
                      <Grid item md={3} xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Type<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <Selects
                            maxMenuHeight={300}
                            options={typeOption}
                            placeholder="Please Select Type"
                            value={{
                              label: data.type,
                              value: data.type,
                            }}
                            onChange={(e) => {
                              handleMultipleTodoChanges(index, {
                                type: e.value,
                                category: "Please Select Category",
                                subcategory: "Please Select Sub Category",
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      {data.type === "Password" && (
                        <>
                          <Grid item md={3} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                              <Typography>
                                Category<b style={{ color: "red" }}>*</b>
                              </Typography>
                              <Selects
                                maxMenuHeight={300}
                                options={categoryOption}
                                placeholder="Please Select Category"
                                value={{
                                  label: data.category,
                                  value: data.category,
                                }}
                                onChange={(e) => {
                                  // handleMultipleTodoChanges(index, {
                                  //   category: e.value,
                                  //   subcategory: "Please Select Sub Category",
                                  // });
                                  fetchSubCategoryTodo(
                                    e.value,
                                    "Password",
                                    index
                                  );
                                }}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                              <Typography>Sub Category</Typography>
                              <Selects
                                maxMenuHeight={300}
                                options={data?.subCategoryOptions}
                                placeholder="Please Select Sub Category"
                                value={{
                                  label: data.subcategory,
                                  value: data.subcategory,
                                }}
                                onChange={(e) => {
                                  handleTodoChange(
                                    index,
                                    "subcategory",
                                    e.value
                                  );
                                }}
                              />
                            </FormControl>
                          </Grid>
                        </>
                      )}
                      {data.type === "IP" && (
                        <>
                          <Grid item md={3} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                              <Typography>
                                Category<b style={{ color: "red" }}>*</b>
                              </Typography>
                              <Selects
                                maxMenuHeight={300}
                                options={categoryOptionIP}
                                placeholder="Please Select Category"
                                value={{
                                  label: data.category,
                                  value: data.category,
                                }}
                                onChange={(e) => {
                                  fetchSubCategoryTodo(e.value, "IP", index);
                                }}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                              <Typography>Sub Category</Typography>
                              <Selects
                                maxMenuHeight={300}
                                options={data?.subCategoryOptions}
                                placeholder="Please Select Sub Category"
                                value={{
                                  label: data.subcategory,
                                  value: data.subcategory,
                                }}
                                onChange={(e) => {
                                  handleMultipleTodoChanges(index, {
                                    subcategory: e.value,
                                    publicip: "Please Select Public IP Details",
                                    assignedip: "Please Select Assigned IP",
                                    ipsecsecretpassword: "",
                                    vpnname: e.value,
                                  });
                                }}
                              />
                            </FormControl>
                          </Grid>
                        </>
                      )}

                      {data.type === "IP" && (
                        <>
                          <Grid item md={3} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                              <Typography>
                                Public IP Details
                                <b style={{ color: "red" }}>*</b>
                              </Typography>
                              <Selects
                                maxMenuHeight={300}
                                options={iPDetails
                                  ?.filter(
                                    (u) =>
                                      u.categoryname === data.category &&
                                      u.subcategoryname === data.subcategory
                                  )
                                  .map((u) => ({
                                    ...u,
                                    label: u.ipaddress,
                                    value: u.ipaddress,
                                  }))
                                  .filter(
                                    (option, index, arr) =>
                                      arr.findIndex(
                                        (t) => t.value === option.value
                                      ) === index
                                  )}
                                placeholder="Please Select Public IP Details"
                                value={{
                                  label: data.publicip,
                                  value: data.publicip,
                                }}
                                onChange={(e) => {
                                  fetchIPSecPasswordTodo(
                                    data?.category,
                                    data?.subcategory,
                                    e.value,
                                    index
                                  );
                                }}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography>IP Sec Secret Password</Typography>
                              <OutlinedInput
                                id="component-outlined"
                                readOnly={true}
                                type="text"
                                value={data?.ipsecsecretpassword}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                              <Typography>
                                VPN Name<b style={{ color: "red" }}>*</b>
                              </Typography>
                              <OutlinedInput
                                id="component-outlined"
                                type="text"
                                placeholder="Please Enter VPN Name"
                                value={data.vpnname}
                                onChange={(e) => {
                                  handleTodoChange(
                                    index,
                                    "vpnname",
                                    e.target.value
                                  );
                                }}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                              <Typography>
                                VPN Type<b style={{ color: "red" }}>*</b>
                              </Typography>
                              <Selects
                                maxMenuHeight={300}
                                options={vpnTypeOption}
                                placeholder="Please Select VPN Type"
                                value={{
                                  label: data.vpntype,
                                  value: data.vpntype,
                                }}
                                onChange={(e) => {
                                  handleTodoChange(index, "vpntype", e.value);
                                }}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                              <Typography>
                                Assigned IP<b style={{ color: "red" }}>*</b>
                              </Typography>
                              <Selects
                                maxMenuHeight={300}
                                options={assignedIPOption
                                  ?.filter(
                                    (u) =>
                                      u.categoryname === data.category &&
                                      u.subcategoryname === data.subcategory
                                  )
                                  .map((u) => ({
                                    ...u,
                                    label: u.ipaddress,
                                    value: u.ipaddress,
                                  }))}
                                placeholder="Please Select Assigned IP"
                                value={{
                                  label: data.assignedip,
                                  value: data.assignedip,
                                }}
                                onChange={(e) => {
                                  handleMultipleTodoChanges(index, {
                                    assignedip: e.value,
                                    unassignedIpId: e._id,
                                  });
                                }}
                              />
                            </FormControl>
                          </Grid>
                        </>
                      )}
                      <Grid item md={3} xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Username<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            placeholder="Please Enter Username"
                            value={data.username}
                            onChange={(e) => {
                              handleTodoChange(
                                index,
                                "username",
                                e.target.value
                              );
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Temp Password<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            placeholder="Temp Password"
                            id="outlined-adornment-password"
                            type={data?.showPassword ? "text" : "password"}
                            value={
                              data.autogenerate ? tempAuto : data.temppassword
                            }
                            onChange={(e) => {
                              if (!data.autogenerate) {
                                handleTodoChange(
                                  index,
                                  "temppassword",
                                  e.target.value
                                );
                              }
                            }}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={() => {
                                    handleTodoChange(
                                      index,
                                      "showPassword",
                                      !data?.showPassword
                                    );
                                  }}
                                  onMouseDown={handleMouseDownPassword}
                                  edge="end"
                                >
                                  {!data.showPassword ? (
                                    <VisibilityOff sx={{ fontSize: "25px" }} />
                                  ) : (
                                    <Visibility sx={{ fontSize: "25px" }} />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            }
                          />
                        </FormControl>
                        <Grid>
                          <FormGroup>
                            <FormControlLabel
                              control={<Checkbox checked={data.autogenerate} />}
                              onChange={(e) => {
                                handleTodoChange(
                                  index,
                                  "autogenerate",
                                  !data.autogenerate
                                );
                              }}
                              label="Auto Generate"
                            />
                          </FormGroup>
                        </Grid>
                      </Grid>
                      <Grid item md={2.5} xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Live Password<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            placeholder="Live Password"
                            id="outlined-adornment-password"
                            type={data?.showLivePassword ? "text" : "password"}
                            value={data.livepassword}
                            onChange={(e) => {
                              handleTodoChange(
                                index,
                                "livepassword",
                                e.target.value
                              );
                            }}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onMouseDown={handleMouseDownLivePassword}
                                  onClick={() => {
                                    handleTodoChange(
                                      index,
                                      "showLivePassword",
                                      !data?.showLivePassword
                                    );
                                  }}
                                  edge="end"
                                >
                                  {!data.showLivePassword ? (
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
                      <Grid item md={0.5} xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          {/* <Typography>&nbsp;</Typography> */}
                          <Button
                            variant="contained"
                            color="error"
                            type="button"
                            onClick={() => deleteTodo(index)}
                            sx={{
                              height: "30px",
                              minWidth: "30px",
                              marginTop: "28px",
                              padding: "6px 10px",
                            }}
                          >
                            <AiOutlineClose />
                          </Button>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <br />
                  </div>
                ))}
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                <br />
                <br />
                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "15px",
                  }}
                >
                  {/* <Button variant="contained" onClick={handleSubmit}>
                    {" "}
                    Submit
                  </Button> */}
                  <LoadingButton
                    onClick={handleSubmit}
                    loading={loadingdeloverall}
                    sx={buttonStyles.buttonsubmit}
                    loadingPosition="end"
                    variant="contained"
                  >
                    Create
                  </LoadingButton>
                  <Button sx={buttonStyles.btncancel} onClick={handleclear}>
                    {" "}
                    CLEAR
                  </Button>
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
      <br />
      <br />
      <ListPassword
        vendorAuto={vendorAuto}
        fetchUnAssignedIP={fetchUnAssignedIP}
        setTwotable={setTwotable}
        twoTable={twoTable}
      />
      <VerifiedListPassword
        vendorAuto={vendorAuto}
        fetchUnAssignedIP={fetchUnAssignedIP}
        setTwotable={setTwotable}
        twoTable={twoTable}
      />
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
export default AddPassword;