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
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  FormGroup,
} from "@mui/material";
import { userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import { handleApiError } from "../../components/Errorhandling";
import axios from "axios";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { UserRoleAccessContext, AuthContext } from "../../context/Appcontext";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import "jspdf-autotable";
import { useNavigate, useParams } from "react-router-dom";
import Headtitle from "../../components/Headtitle";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import { MultiSelect } from "react-multi-select-component";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import MessageAlert from "../../components/MessageAlert";
import AlertDialog from "../../components/Alert";


function EditPassword() {

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
  };



  const backPage = useNavigate();
  const { auth } = useContext(AuthContext);
  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, allTeam, allUsersData, pageName, setPageName, buttonStyles } = useContext(
    UserRoleAccessContext
  );
  const [showAlert, setShowAlert] = useState();
  const [unassignedIpId, setUnassignedIpId] = useState();
  const [oldIpId, setOldIpId] = useState();
  const [checkedAssignedIP, setCheckedAssignedIP] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [singleDocument, setSingleDocument] = useState({});
  const [loading, setLoading] = useState(false);
  const [findMatch, setFindMatch] = useState([])
  const [categoryOption, setCategoryOption] = useState([]);
  const [subCategoryOption, setSubCategoryOption] = useState([]);
  const [categoryOptionIP, setCategoryOptionIP] = useState([]);
  const [assignedIPOption, setAssignedIPOption] = useState([]);
  const [iPDetails, setIPDetails] = useState([]);
  const [onChangeIpCheck, setOnChangeIpCheck] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showLivePassword, setShowLivePassword] = useState(false);
  const [tempAuto, setTempAuto] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [branchOption, setBranchOption] = useState([]);
  let ids = useParams().id;
  //useEffect
  useEffect(() => {
    getinfoCode();
  }, [ids]);
  useEffect(() => {
    fetchUnAssignedIP();
    fetchCategoryAll();
    fetchIPCategoryAll();
    fetchAllApproveds();
  }, []);
  //company multiselect
  const [selectedCompanyOptionsCateEdit, setSelectedCompanyOptionsCateEdit] =
    useState([]);
  const [companyValueCateEdit, setCompanyValueCateEdit] = useState("");

  const handleCompanyChangeEdit = (options) => {
    setCompanyValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedCompanyOptionsCateEdit(options);
    setBranchValueCateEdit([]);
    setSelectedBranchOptionsCateEdit([]);
    setUnitValueCateEdit([]);
    setSelectedUnitOptionsCateEdit([]);
    setTeamValueCateEdit([]);
    setSelectedTeamOptionsCateEdit([]);

    setSingleDocument({
      ...singleDocument,
      employeename: "Please Select Employee Name",
      temppassword: "",
      livepassword: "",
      username: "",
    });
    setTempAuto("");
  };
  const customValueRendererCompanyEdit = (
    companyValueCateEdit,
    _employeename
  ) => {
    return companyValueCateEdit?.length
      ? companyValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
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
          data.categoryname === singleDocument.category &&
          data.subcategoryname === singleDocument.subcategory &&
          data.ipaddress === e.value
        );
      });

      setSingleDocument((prev) => ({
        ...prev,
        ipsecsecretpassword: filtered[0].ipsecsecretpassword,
      }));
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //branch multiselect
  const [selectedBranchOptionsCateEdit, setSelectedBranchOptionsCateEdit] =
    useState([]);
  const [branchValueCateEdit, setBranchValueCateEdit] = useState("");

  const handleBranchChangeEdit = (options) => {
    setBranchValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedBranchOptionsCateEdit(options);
    setUnitValueCateEdit([]);
    setSelectedUnitOptionsCateEdit([]);
    setTeamValueCateEdit([]);
    setSelectedTeamOptionsCateEdit([]);

    setSingleDocument({
      ...singleDocument,
      employeename: "Please Select Employee Name",
      temppassword: "",
      livepassword: "",
      username: "",
    });
    setTempAuto("");
  };
  const customValueRendererBranchEdit = (
    branchValueCateEdit,
    _employeename
  ) => {
    return branchValueCateEdit?.length
      ? branchValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Branch";
  };

  //unit multiselect
  const [selectedUnitOptionsCateEdit, setSelectedUnitOptionsCateEdit] =
    useState([]);
  const [unitValueCateEdit, setUnitValueCateEdit] = useState("");

  const handleUnitChangeEdit = (options) => {
    setUnitValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedUnitOptionsCateEdit(options);
    setTeamValueCateEdit([]);
    setSelectedTeamOptionsCateEdit([]);

    setSingleDocument({
      ...singleDocument,
      employeename: "Please Select Employee Name",
      temppassword: "",
      livepassword: "",
      username: "",
    });
    setTempAuto("");
  };
  const customValueRendererUnitEdit = (unitValueCateEdit, _employeename) => {
    return unitValueCateEdit?.length
      ? unitValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Unit";
  };

  //team multiselect
  const [selectedTeamOptionsCateEdit, setSelectedTeamOptionsCateEdit] =
    useState([]);
  const [teamValueCateEdit, setTeamValueCateEdit] = useState("");

  const handleTeamChangeEdit = (options) => {
    setTeamValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedTeamOptionsCateEdit(options);

    setSingleDocument({
      ...singleDocument,
      employeename: "Please Select Employee Name",
      temppassword: "",
      livepassword: "",
      username: "",
    });
    setTempAuto("");
  };
  const customValueRendererTeamEdit = (teamValueCateEdit, _employeename) => {
    return teamValueCateEdit?.length
      ? teamValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };

  let updateby = singleDocument.updatedby;

  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
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
  const getinfoCode = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.SINGLE_PASSWORD}/${ids}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setOldIpId(res?.data.spass?.assignedipid);
      setUnassignedIpId(res?.data.spass?.assignedipid);
      setSingleDocument(res?.data.spass);
      setCompanyValueCateEdit(res?.data?.spass?.company);
      setSelectedCompanyOptionsCateEdit([
        ...res?.data?.spass?.company.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setBranchValueCateEdit(res?.data?.spass?.branch);
      setSelectedBranchOptionsCateEdit([
        ...res?.data?.spass?.branch.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setUnitValueCateEdit(res?.data?.spass?.unit);
      setSelectedUnitOptionsCateEdit([
        ...res?.data?.spass?.unit.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setTeamValueCateEdit(res?.data?.spass?.team);
      setSelectedTeamOptionsCateEdit([
        ...res?.data?.spass?.team.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      await fetchSubCategory(res?.data.spass.category, res?.data.spass.type);
      await fetchEmployeeDetails(
        res?.data.spass.company,
        res?.data.spass.branch,
        res?.data.spass.unit,
        res?.data.spass.team,
        res?.data.spass.employeename
      );
      if (res?.data.spass.autogenerate) {
        setTempAuto(res?.data.spass.temppassword);
      } else {
        setTempPassword(res?.data.spass.temppassword);
      }
      setLoading(true);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const checkAssignedIP = async (id) => {
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
            (ipitem) => ipitem.status === "assigned"
          ),
        }))
        .map((item) => item.ipconfig);

      const mergedArray = [].concat(...arrval);
      setCheckedAssignedIP(mergedArray.some((item) => item._id === id));
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const sendRequest = async () => {
    setPageName(!pageName)
    try {
      let response = await axios.put(`${SERVICE.SINGLE_PASSWORD}/${ids}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: [...companyValueCateEdit],
        branch: [...branchValueCateEdit],
        unit: [...unitValueCateEdit],
        team: [...teamValueCateEdit],
        employeename: String(singleDocument.employeename),
        employeedbid: String(singleDocument.employeedbid),
        type: String(singleDocument.type),
        category: String(singleDocument.category),
        ipsecsecretpassword: String(singleDocument.ipsecsecretpassword),
        subcategory: String(
          singleDocument.subcategory === "Please Select Sub Category"
            ? "ALL"
            : singleDocument.subcategory
        ),
        publicip: String(
          singleDocument.type === "IP" ? singleDocument.publicip : ""
        ),
        vpnname: String(
          singleDocument.type === "IP" ? singleDocument.vpnname : ""
        ),
        vpntype: String(
          singleDocument.type === "IP" ? singleDocument.vpntype : ""
        ),
        assignedip: String(
          singleDocument.type === "IP" ? singleDocument.assignedip : ""
        ),
        assignedipid: String(
          singleDocument.type === "IP" ? unassignedIpId : ""
        ),
        username: String(singleDocument.username),
        temppassword: String(
          singleDocument.autogenerate ? tempAuto : tempPassword
        ),
        autogenerate: Boolean(singleDocument.autogenerate),
        livepassword: String(singleDocument.livepassword),
        updatedby: [
          ...updateby,
          { name: String(isUserRoleAccess.companyname), date: String(new Date()) },
        ],
      });
      if (
        singleDocument.type === "IP" &&
        !checkedAssignedIP &&
        oldIpId !== unassignedIpId
      ) {
        await updateIP();
        setPopupContent("Updated Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
        backPage("/addpassword");
      } else if (singleDocument.type === "Password" && oldIpId != "") {
        await unAssignOldIp();
        setPopupContent("Updated Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
        backPage("/addpassword");
      }

      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      backPage("/addpassword");
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const updateIP = async () => {
    setPageName(!pageName)
    try {
      let subprojectscreate = await axios.post(SERVICE.IPMASTER_UPDATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

        updatevalue: unassignedIpId,
        company: [...companyValueCateEdit],
        branch: [...branchValueCateEdit],
        unit: [...unitValueCateEdit],
        team: [...teamValueCateEdit],
        employeename: String(singleDocument.employeename),
        status: "assigned",
        assignedthrough: "Password",
        addedby: {
          name: String(isUserRoleAccess.companyname),
          date: String(new Date()),
        },
      });
      if (oldIpId != "") {
        await unAssignOldIp();
      }
      await fetchUnAssignedIP();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const unAssignOldIp = async () => {

    setPageName(!pageName)
    try {
      let subprojectscreate = await axios.post(SERVICE.IPMASTER_UPDATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

        updatevalue: oldIpId,
        company: [...companyValueCateEdit],
        branch: [...branchValueCateEdit],
        unit: [...unitValueCateEdit],
        team: [...teamValueCateEdit],
        employeename: String(singleDocument.employeename),
        status: "unassigned",
        addedby: {
          name: String(isUserRoleAccess.companyname),
          date: String(new Date()),
        },
      });
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const handleSubmit = () => {
    let compopt = selectedCompanyOptionsCateEdit.map((item) => item.value);
    let branchopt = selectedBranchOptionsCateEdit.map((item) => item.value);
    let unitopt = selectedUnitOptionsCateEdit.map((item) => item.value);
    let teamopt = selectedTeamOptionsCateEdit.map((item) => item.value);

    const isNameMatch = findMatch.some(
      (item) =>
        item.company.some((data) => compopt.includes(data)) &&
        item.branch.some((data) => branchopt.includes(data)) &&
        item.unit.some((data) => unitopt.includes(data)) &&
        item.team.some((data) => teamopt.includes(data)) &&
        item.type === singleDocument.type &&
        item.employeename === singleDocument.employeename &&
        item.category === singleDocument.category
    );
    if (companyValueCateEdit?.length == 0) {
      setPopupContent("Please Select Company");
      setPopupSeverity("warning");
      handleClickOpenPopup();
    } else if (branchValueCateEdit?.length == 0) {
      setPopupContent("Please Select Branch");
      setPopupSeverity("warning");
      handleClickOpenPopup();
    } else if (unitValueCateEdit?.length == 0) {
      setPopupContent("Please Select Unit");
      setPopupSeverity("warning");
      handleClickOpenPopup();
    } else if (teamValueCateEdit?.length == 0) {
      setPopupContent("Please Select Team");
      setPopupSeverity("warning");
      handleClickOpenPopup()
    } else if (singleDocument.employeename === "Please Select Employee Name") {
      setPopupContent("Please Select Employee Name");
      setPopupSeverity("warning");
      handleClickOpenPopup();
    } else if (singleDocument.category === "Please Select Category") {

      setPopupContent("Please Select Category");
      setPopupSeverity("warning");
      handleClickOpenPopup();
    } else if (
      singleDocument.type === "IP" &&
      singleDocument.publicip === "Please Select Public IP Details"
    ) {

      setPopupContent("Please Select Public IP Details");
      setPopupSeverity("warning");
      handleClickOpenPopup();
    } else if (singleDocument.type === "IP" && singleDocument.vpnname === "") {

      setPopupContent("Please Enter VPN Name");
      setPopupSeverity("warning");
      handleClickOpenPopup();
    } else if (
      singleDocument.type === "IP" &&
      singleDocument.vpntype === "Please Select VPN Type"
    ) {

      setPopupContent("Please Select VPN Type");
      setPopupSeverity("warning");
      handleClickOpenPopup();
    } else if (
      singleDocument.type === "IP" &&
      singleDocument.assignedip === "Please Select Assigned IP"
    ) {

      setPopupContent("Please Select Assigned IP");
      setPopupSeverity("warning");
      handleClickOpenPopup();
    } else if (singleDocument.username === "") {

      setPopupContent("Please Enter Username");
      setPopupSeverity("warning");
      handleClickOpenPopup();
    } else if (singleDocument.autogenerate && tempAuto === "") {

      setPopupContent("Please Enter Temp Password");
      setPopupSeverity("warning");
      handleClickOpenPopup();
    } else if (!singleDocument.autogenerate && tempPassword === "") {

      setPopupContent("Please Enter Temp Password");
      setPopupSeverity("warning");
      handleClickOpenPopup();
    } else if (singleDocument.livepassword === "") {

      setPopupContent("Please Enter Live Password");
      setPopupSeverity("warning");
      handleClickOpenPopup();
    } else if (
      singleDocument.type === "IP" &&
      checkedAssignedIP === true &&
      oldIpId !== unassignedIpId
    ) {

      setPopupContent("IP Already Assigned");
      setPopupSeverity("warning");
      handleClickOpenPopup();
    }
    else if (isNameMatch) {

      setPopupContent("Data Already Exist!");
      setPopupSeverity("warning");
      handleClickOpenPopup();
    }
    else {
      sendRequest();
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
    try {
      setPageName(!pageName)
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
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  //get all project.
  const fetchAllApproveds = async () => {
    setPageName(!pageName)
    try {
      let res_queue = await axios.get(SERVICE.ALL_PASSWORD, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setFindMatch(res_queue?.data.pass.filter((item) => item._id !== ids));
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const fetchUnAssignedIP = async () => {
    setPageName(!pageName)
    try {
      let res_vendor = await axios.get(SERVICE.IPMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let assignedval = (res_vendor?.data?.ipmaster || [])
        .map((item) => ({
          ...item,
          ipconfig: item.ipconfig.filter(
            (ipItem) =>
              ipItem.status === "assigned" &&
              ipItem.assignedthrough === "Password"
          ),
        }))
        .map((item) => item.ipconfig);
      const mergedassignedArray = [].concat(...assignedval);

      let arrval = (res_vendor?.data?.ipmaster || [])
        .map((item) => ({
          ...item,
          ipconfig: item.ipconfig.filter(
            (ipitem) => ipitem.status != "assigned"
          ),
        }))
        .map((item) => item.ipconfig);

      setOnChangeIpCheck(arrval);

      const mergedArray = [].concat(...arrval, ...mergedassignedArray);
      setAssignedIPOption(mergedArray);
      setIPDetails(res_vendor?.data?.ipmaster);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
      setCategoryOption(catOpt);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };


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
    <>
      <Headtitle title={"EDIT PASSWORD"} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>Edit Password</Typography>
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
        <Box>
          {isUserRoleCompare?.includes("epassword") && (
            <Box sx={userStyle.selectcontainer}>
              <>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    {" "}
                    <Typography sx={userStyle.importheadtext}>
                      Edit Password
                    </Typography>{" "}
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Company<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={accessbranch?.map(data => ({
                          label: data.company,
                          value: data.company,
                        })).filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                        value={selectedCompanyOptionsCateEdit}
                        onChange={handleCompanyChangeEdit}
                        valueRenderer={customValueRendererCompanyEdit}
                        labelledBy="Please Select Company"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Branch<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={accessbranch?.filter(
                          (comp) =>
                            companyValueCateEdit?.includes(comp.company)
                        )?.map(data => ({
                          label: data.branch,
                          value: data.branch,
                        })).filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                        value={selectedBranchOptionsCateEdit}
                        onChange={handleBranchChangeEdit}
                        valueRenderer={customValueRendererBranchEdit}
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
                            companyValueCateEdit?.includes(comp.company) && branchValueCateEdit?.includes(comp.branch)
                        )?.map(data => ({
                          label: data.unit,
                          value: data.unit,
                        })).filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                        value={selectedUnitOptionsCateEdit}
                        onChange={handleUnitChangeEdit}
                        valueRenderer={customValueRendererUnitEdit}
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
                            companyValueCateEdit?.includes(comp.company) && branchValueCateEdit?.includes(comp.branch) && unitValueCateEdit?.includes(comp.unit)
                        )?.map(data => ({
                          label: data.teamname,
                          value: data.teamname,
                        })).filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                        value={selectedTeamOptionsCateEdit}
                        onChange={handleTeamChangeEdit}
                        valueRenderer={customValueRendererTeamEdit}
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
                              companyValueCateEdit?.includes(u.company) &&
                              branchValueCateEdit?.includes(u.branch) &&
                              unitValueCateEdit?.includes(u.unit) &&
                              teamValueCateEdit?.includes(u.team)
                          )
                          .map((u) => ({
                            ...u,
                            label: u.companyname,
                            value: u.companyname,
                          }))}
                        placeholder="Please Select Employee Name"
                        value={{
                          label: singleDocument.employeename,
                          value: singleDocument.employeename,
                        }}
                        onChange={(e) => {
                          fetchEmployeeDetails(
                            companyValueCateEdit,
                            branchValueCateEdit,
                            unitValueCateEdit,
                            teamValueCateEdit,
                            e.value
                          );
                          setSingleDocument({
                            ...singleDocument,
                            employeename: e.value,
                            employeedbid: e._id,
                            temppassword: "",
                            livepassword: "",
                            username: e.username,
                          });
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
                          label: singleDocument.type,
                          value: singleDocument.type,
                        }}
                        onChange={(e) => {
                          setSingleDocument({
                            ...singleDocument,
                            type: e.value,
                            category: "Please Select Category",
                            subcategory: "Please Select Sub Category",
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  {singleDocument.type === "Password" && (
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
                              label: singleDocument.category,
                              value: singleDocument.category,
                            }}
                            onChange={(e) => {
                              setSingleDocument({
                                ...singleDocument,
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
                              label: singleDocument.subcategory
                                ? singleDocument.subcategory
                                : "Please Select Sub Category",
                              value: singleDocument.subcategory
                                ? singleDocument.subcategory
                                : "Please Select Sub Category",
                            }}
                            onChange={(e) => {
                              setSingleDocument({
                                ...singleDocument,
                                subcategory: e.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                    </>
                  )}
                  {singleDocument.type === "IP" && (
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
                              label: singleDocument.category,
                              value: singleDocument.category,
                            }}
                            onChange={(e) => {
                              setSingleDocument({
                                ...singleDocument,
                                category: e.value,
                                subcategory: "Please Select Sub Category",
                                publicip: "Please Select Public IP Details",
                                assignedip: "Please Select Assigned IP",
                                vpnname: "",
                                ipsecsecretpassword: "",
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
                              label: singleDocument.subcategory,
                              value: singleDocument.subcategory,
                            }}
                            onChange={(e) => {
                              setSingleDocument({
                                ...singleDocument,
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
                  {singleDocument.type === "IP" && (
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
                                  u.categoryname === singleDocument.category &&
                                  u.subcategoryname ===
                                  singleDocument.subcategory
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
                              label: singleDocument.publicip
                                ? singleDocument.publicip
                                : "Please Select Public IP Details",
                              value: singleDocument.publicip
                                ? singleDocument.publicip
                                : "Please Select Public IP Details",
                            }}
                            onChange={(e) => {
                              setSingleDocument({
                                ...singleDocument,
                                publicip: e.value,
                              });
                              fetchIPSecPassword(e);
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>IP Sec Secret Password</Typography>
                          <OutlinedInput
                            readOnly={true}
                            id="component-outlined"
                            type="text"
                            value={singleDocument.ipsecsecretpassword}
                            onChange={(e) => {
                              setSingleDocument({
                                ...singleDocument,
                                ipsecsecretpassword: e.target.value,
                              });
                            }}
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
                            value={singleDocument.vpnname}
                            onChange={(e) => {
                              setSingleDocument({
                                ...singleDocument,
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
                              label: singleDocument.vpntype
                                ? singleDocument.vpntype
                                : "Please Select VPN Type",
                              value: singleDocument.vpntype
                                ? singleDocument.vpntype
                                : "Please Select VPN Type",
                            }}
                            onChange={(e) => {
                              setSingleDocument({
                                ...singleDocument,
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
                                  u.categoryname === singleDocument.category &&
                                  u.subcategoryname ===
                                  singleDocument.subcategory
                              )
                              .map((u) => ({
                                ...u,
                                label: u.ipaddress,
                                value: u.ipaddress,
                              }))}
                            placeholder="Please Select Assigned IP"
                            value={{
                              label: singleDocument.assignedip
                                ? singleDocument.assignedip
                                : "Please Select Assigned IP",
                              value: singleDocument.assignedip
                                ? singleDocument.assignedip
                                : "Please Select Assigned IP",
                            }}
                            onChange={(e) => {
                              setSingleDocument({
                                ...singleDocument,
                                assignedip: e.value,
                              });
                              setUnassignedIpId(e._id);
                              checkAssignedIP(e._id);
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
                        value={singleDocument.username}
                        onChange={(e) => {
                          setSingleDocument({
                            ...singleDocument,
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
                          singleDocument.autogenerate ? tempAuto : tempPassword
                        }
                        onChange={(e) => {
                          if (!singleDocument.autogenerate) {
                            setTempPassword(e.target.value);
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
                            <Checkbox checked={singleDocument.autogenerate} />
                          }
                          onChange={(e) => {
                            setSingleDocument({
                              ...singleDocument,
                              autogenerate: !singleDocument.autogenerate,
                            });
                          }}
                          label="Auto Generate"
                        />
                      </FormGroup>
                    </Grid>
                  </Grid>
                  <Grid item md={3} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Live Password<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        placeholder="Live Password"
                        id="outlined-adornment-password"
                        type={showLivePassword ? "text" : "password"}
                        value={singleDocument.livepassword}
                        onChange={(e) => {
                          setSingleDocument({
                            ...singleDocument,
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
                      <Button variant="contained" onClick={handleSubmit} sx={buttonStyles.buttonsubmit} >
                        {" "}
                        Update
                      </Button>
                      <Button
                        sx={buttonStyles.btncancel}
                        onClick={() => {
                          backPage("/addpassword");
                        }}
                      >
                        Cancel
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            </Box>
          )}
          {/* ALERT DIALOG */}
          <Box>
            <Dialog
              open={isErrorOpen}
              onClose={handleClickOpenerr}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogContent
                sx={{
                  width: "350px",
                  textAlign: "center",
                  alignItems: "center",
                }}
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
      )}
    </>
  );
}
export default EditPassword;