// import CloseIcon from "@mui/icons-material/Close";
// import FirstPageIcon from "@mui/icons-material/FirstPage";
// import ImageIcon from "@mui/icons-material/Image";
// import LastPageIcon from "@mui/icons-material/LastPage";
// import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
// import NavigateNextIcon from "@mui/icons-material/NavigateNext";
// import Visibility from "@mui/icons-material/Visibility";
// import VisibilityOff from "@mui/icons-material/VisibilityOff";
// import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
// import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
// import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
// import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
// import { MultiSelect } from "react-multi-select-component";
// import moment from "moment";
// import {
//     Box,
//     Button,
//     Checkbox,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     FormControl,
//     Grid,
//     IconButton,
//     InputAdornment,
//     List,
//     ListItem,
//     ListItemText,
//     MenuItem,
//     OutlinedInput,
//     Popover,
//     Select,
//     TextField,
//     Typography,
//     FormGroup,
//     FormControlLabel,
// } from "@mui/material";
// import Switch from "@mui/material/Switch";
// import axios from "axios";
// import { saveAs } from "file-saver";
// import html2canvas from "html2canvas";
// import "jspdf-autotable";
// import React, { useContext, useEffect, useRef, useState } from "react";
// import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
// import { ThreeDots } from "react-loader-spinner";
// import Selects from "react-select";
// import { useReactToPrint } from "react-to-print";
// import AlertDialog from "../../../components/Alert.js";
// import { DeleteConfirmation } from "../../../components/DeleteConfirmation.js";
// import { handleApiError } from "../../../components/Errorhandling.js";
// import ExportData from "../../../components/ExportData.js";
// import Headtitle from "../../../components/Headtitle.js";
// import InfoPopup from "../../../components/InfoPopup.js";
// import MessageAlert from "../../../components/MessageAlert.js";
// import PageHeading from "../../../components/PageHeading.js";
// import StyledDataGrid from "../../../components/TableStyle.js";
// import { UserRoleAccessContext } from "../../../context/Appcontext.js";
// import { AuthContext } from "../../../context/Appcontext.js";
// import { userStyle } from "../../../pageStyle.js";
// import { SERVICE } from "../../../services/Baseservice.js";
// import PppUnmatchedSecrets from "./PppUnmatchedSecrets.js"
// import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
// function PppSecrets() {
//     //FILTER START
//     const [interval, setInterval] = useState(1000);
//     const [filterApplied, setFilterApplied] = useState(false);
//     const [mikrotikMaster, setMikrotikMaster] = useState([])
//     const [selectedTeamOptions, setSelectedTeamOptions] = useState([]);
//     const [selectedTeamOptionsEdit, setSelectedTeamOptionsEdit] = useState([])
//     const [valueTeam, setValueTeam] = useState([])
//     const [valueTeamEdit, setValueTeamEdit] = useState([]);
//     const [employeeName, setEmployeeName] = useState("Please Select Employee Name");
//     const [empNameRestrict, setEmpNameRestrict] = useState([]);
//     const [employeeNameEdit, setEmployeeNameEdit] = useState("Please Select Employee Name");
//     const [autoGenPassword, setAutoGenPassword] = useState("");
//     const [autoGenPasswordEdit, setAutoGenPasswordEdit] = useState("");
//     const [changes, setChanges] = useState("");
//     const [teamsArray, setTeamsArray] = useState([]);
//     const [matchedSecrets, setMatchedSecrets] = useState([]);
//     const [ipPools, setIpPools] = useState([]);
//     const [localAddressBoolean, setLocalAddressBoolean] = useState(false);
//     const [localAddressBooleanEdit, setLocalAddressBooleanEdit] = useState(false);
//     const [remoteAddressString, setRemoteAddressString] = useState("");
//     const [mikrotikName, setMikrotikName] = useState("");
//     const [remoteAddress, setRemoteAddress] = useState([])
//     const [localAddresses, setLocalAddresses] = useState([])
//     const [localAddressesEdit, setLocalAddressesEdit] = useState([])
//     const [remoteAddressEdit, setRemoteAddressEdit] = useState([])

//     const autoGenerateTempPassword = (data, mikname, service, remote) => {
//         const user = data;
//         const nameAbbreviation = user;
//         const mikrotikName = mikname?.slice(-2);
//         const serviceName = service?.slice(0, 1);
//         const remoteName = remote?.slice(-1);
//         const temppassword = nameAbbreviation + "@" + mikrotikName + serviceName + remoteName;
//         setAutoGenPassword(temppassword);
//         return temppassword;
//     };

//     const handleLocalAddress = (e) => {
//         const localaddress = e;
//         const ipRegex = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;
//         if (typeof localaddress === "string" && ipRegex.test(localaddress)) {
//             return localaddress;
//         }
//         return null;
//     }


//     const handleRemoteAddress = (value) => {

//         const ipPoolsFilter = ipPools?.find(data => data?.name === value["remote-address"]);
//         const localaddress = (value?.localaddress === undefined || value?.localaddress === "") ? "" : value?.localaddress;
//         const answerLocal = handleLocalAddress(value.localaddress) ? true : false;
//         if (ipPoolsFilter) {
//             const secretPPPValues = matchedSecrets?.filter(data => data?.profile === value?.value)?.map(data => data["remote-address"]);
//             let [startIP, endIP] = ipPoolsFilter?.ranges?.split('-');
//             // Extract the common part and the last octets
//             let baseIP = startIP.substring(0, startIP.lastIndexOf('.') + 1);
//             let start = parseInt(startIP.split('.')[3], 10);
//             let end = parseInt(endIP.split('.')[3], 10);

//             // Generate the IP range
//             let answer = [];
//             let localAddresses = [];
//             for (let i = start; i <= end; i++) {
//                 localAddresses.push(`${baseIP}${i}`);

//                 let check = secretPPPValues?.includes(`${baseIP}${i}`)
//                 if (!check) {
//                     answer.push(`${baseIP}${i}`);
//                 }
//             }
//             setLocalAddresses([localaddress, ...localAddresses])
//             let Remote = answerLocal ? [...answer] : [localaddress, ...answer];
//             setRemoteAddress(Remote)
//         }
//         else {
//             setLocalAddresses([])
//             setRemoteAddress([])
//         }

//     }


//     // const getCode = (e) => {
//     //     const userData = allUsersData?.find(
//     //         (comp) =>
//     //             e.company === comp.company &&
//     //             e.branch === comp.branch &&
//     //             e.unit === comp.unit && e.team?.includes(comp.team) && e.employeename === comp.companyname
//     //     )
//     //     const profiles = profileOptions?.find(data => data?.name === e.profile)
//     //     const Teamuser = allUsersData?.find(data => data?.username === e?.name);
//     //     const team = (e?.team && e?.team?.length > 0) ? e?.team : (Teamuser ? [Teamuser?.team] : [])
//     //     const employeeName = allUsersData?.find(
//     //         (comp) =>
//     //             e.company === comp.company &&
//     //             e.branch === comp.branch &&
//     //             e.unit === comp.unit && team?.includes(comp.team) && e.employeename === comp.companyname);

//     //     setEmployeeNameEdit(Teamuser ? Teamuser?.companyname : "")
//     //     setSelectedTeamOptionsEdit(team?.map(data => ({
//     //         value: data,
//     //         label: data,
//     //     })));
//     //     setValueTeamEdit(team)
//     //     if (userData) {
//     //         autoGenerateTempPasswordEdit(userData)
//     //     }
//     //     if (profiles) {
//     //         handleRemoteAddressEdit(profiles, e?.remoteaddress)
//     //     }

//     // }

//     const getCode = (e) => {
//         const userData = allUsersData?.find(
//             (comp) => e?.name === comp.username
//         );
//         const profiles = profileOptions?.find(data => data?.name === e.profile)
//         const team = (e?.team && e?.team?.length > 0) ? e?.team : (userData ? [userData?.team] : []);
//         setEmployeeNameEdit(userData ? userData?.companyname : "")
//         setSelectedTeamOptionsEdit(team?.map(data => ({
//             value: data,
//             label: data,
//         })));
//         setValueTeamEdit(team)
//         if (profiles) {
//             handleRemoteAddressEdit(profiles, e?.remoteaddress)
//         }

//     }

//     const autoGenerateTempPasswordEdit = (data, mikname, service, remote) => {
//         const user = data;
//         const nameAbbreviation = user;
//         const mikrotikName = mikname?.slice(-2);
//         const serviceName = service?.slice(0, 1);
//         const remoteName = remote?.slice(-1);
//         const temppassword = nameAbbreviation + "@" + mikrotikName + serviceName + remoteName;
//         setAutoGenPasswordEdit(temppassword);
//         return temppassword;
//     };
//     const handleRemoteAddressEdit = (value, remote) => {
//         const ipPoolsFilter = ipPools?.find(data => data?.name === value["remote-address"]);
//         const localaddress = (value?.localaddress === undefined || value?.localaddress === "") ? "" : value?.localaddress
//         const answerLocal = handleLocalAddress(value.localaddress) ? true : false;

//         if (ipPoolsFilter) {
//             const secretPPPValues = matchedSecrets?.filter(data => data?.profile === value?.value)?.map(data => data["remote-address"]);

//             let [startIP, endIP] = ipPoolsFilter?.ranges?.split('-');
//             // Extract the common part and the last octets
//             let baseIP = startIP.substring(0, startIP.lastIndexOf('.') + 1);
//             let start = parseInt(startIP.split('.')[3], 10);
//             let end = parseInt(endIP.split('.')[3], 10);

//             // Generate the IP range
//             let answer = [];
//             let localAddresses = [];
//             for (let i = start; i <= end; i++) {
//                 localAddresses.push(`${baseIP}${i}`);
//                 let check = secretPPPValues?.filter(data => data !== remote)?.includes(`${baseIP}${i}`)
//                 if (!check) {
//                     answer.push(`${baseIP}${i}`);
//                 }
//             }
//             setLocalAddressesEdit([localaddress, ...localAddresses])
//             let Remote = answerLocal ? answer : [localaddress, ...answer];
//             setRemoteAddressEdit(Remote)
//         }
//         else {
//             setRemoteAddressEdit([])
//             setLocalAddressesEdit([])
//         }

//     }

//     const [filterDatas, setFilterDatas] = useState({
//         company: "Please Select Company",
//         branch: "Please Select Branch",
//         unit: "Please Select Unit",
//         name: "Please Select Name",
//         url: "",
//         username: "",
//         password: "",
//     })
//     const [filterFinal, setFilterFinal] = useState({
//         url: "",
//         username: "",
//         password: "",
//         company: "",
//         branch: "",
//         unit: "",
//         name: "",
//     })


//     const handleTeamChange = (options) => {
//         setValueTeam(
//             options.map((a, index) => {
//                 return a.value;
//             })
//         );
//         setSelectedTeamOptions(options);
//         setEmployeeName("Please Select Employee Name")
//         setAssetVariant({
//             ...assetVariant,
//             username: "",
//             password: "",
//             livepassword: "",
//             autogenerate: false
//         });
//         setAutoGenPassword("")
//     };

//     const customValueRendererTeam = (valueCate, _days) => {
//         return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Team";
//     };
//     const handleTeamChangeEdit = (options) => {
//         setValueTeamEdit(
//             options.map((a, index) => {
//                 return a.value;
//             })
//         );
//         setSelectedTeamOptionsEdit(options);
//         setEmployeeNameEdit("Please Select Employee Name")
//         setAssetVariantEdit({
//             ...assetVariantEdit,
//             username: "",
//             password: "",
//             autogenerate: false
//         });

//     };

//     const customValueRendererTeamEdit = (valueCate, _days) => {
//         return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Team";
//     };



//     //submit option for saving
//     const handleFilter = (e) => {
//         e.preventDefault();

//         if (filterDatas.company === "Please Select Company") {
//             setPopupContentMalert("Please Select Company!");
//             setPopupSeverityMalert("info");
//             handleClickOpenPopupMalert();
//         }
//         else if (filterDatas.branch === "Please Select Branch") {
//             setPopupContentMalert("Please Select Branch!");
//             setPopupSeverityMalert("info");
//             handleClickOpenPopupMalert();
//         }
//         else if (filterDatas.unit === "Please Select Unit") {
//             setPopupContentMalert("Please Select Unit!");
//             setPopupSeverityMalert("info");
//             handleClickOpenPopupMalert();
//         }
//         else if (filterDatas.name === "Please Select Name") {
//             setPopupContentMalert("Please Select Name!");
//             setPopupSeverityMalert("info");
//             handleClickOpenPopupMalert();
//         }

//         else {
//             setFilterApplied(true);
//             setFilterFinal({
//                 url: filterDatas?.url,
//                 username: filterDatas?.username,
//                 password: filterDatas?.password,
//                 company: filterDatas?.company,
//                 branch: filterDatas?.branch,
//                 unit: filterDatas?.unit,
//                 name: filterDatas?.name,
//             })
//             setAssetVariant({
//                 ...assetVariant,
//                 url: filterDatas?.url,
//                 company: filterDatas?.company,
//                 branch: filterDatas?.branch,
//                 unit: filterDatas?.unit,
//                 name: filterDatas?.name,
//                 adminusername: filterDatas?.username,
//                 adminpassword: filterDatas?.password,
//                 localaddress: "Please Select Local Address",
//             })
//             fetchMikroTikSecrets(filterDatas?.url,
//                 filterDatas?.username,
//                 filterDatas?.password, filterDatas)
//             fetchMikroTikProfiles(filterDatas?.url,
//                 filterDatas?.username,
//                 filterDatas?.password,)
//         }
//     };


//     const [profileOptions, setProfileOptions] = useState([]);
//     const fetchMikroTikProfiles = async (url,
//         username,
//         password) => {
//         setPageName(!pageName);
//         try {
//             let response = await axios.post(SERVICE.GET_MIKROTIK_PROFILES, {
//                 url, username, password
//             }, {
//                 headers: {
//                     Authorization: `Bearer ${auth.APIToken}`,
//                 },
//             });

//             let datas = response?.data?.profiles?.map(data => ({
//                 ...data,
//                 localaddress: data["local-address"],
//                 label: data?.name,
//                 value: data?.name,
//             }))

//             setProfileOptions(datas);
//         } catch (err) {

//             let error = err.response?.data?.message;
//             if (error) {
//                 setPopupContentMalert(error);
//                 setPopupSeverityMalert("error");
//                 handleClickOpenPopupMalert();
//             } else {
//                 handleApiError(
//                     err,
//                     setPopupContentMalert,
//                     setPopupSeverityMalert,
//                     handleClickOpenPopupMalert
//                 );
//             }
//         }
//     };



//     const handleClearFilter = (e) => {
//         e.preventDefault();
//         setFilterDatas({
//             company: "Please Select Company",
//             branch: "Please Select Branch",
//             unit: "Please Select Unit",
//             name: "Please Select Name",
//             url: "",
//             username: "",
//             password: "",
//         });
//         setFilterFinal({
//             url: "",
//             username: "",
//             password: "",
//             company: "",
//             branch: "",
//             unit: "",
//             name: "",
//         })
//         setChanges("cleared")
//         setFilterApplied(false);
//         setPopupContent("Cleared Successfully");
//         setPopupSeverity("success");
//         handleClickOpenPopup();
//         setTeamsArray([]);
//         setMatchedSecrets([])
//     };

//     //get all Asset Variant name.
//     const fetchMikroRikMaster = async () => {
//         setPageName(!pageName);
//         try {
//             let response = await axios.get(SERVICE.ALL_MIKROTIKMASTER, {
//                 headers: {
//                     Authorization: `Bearer ${auth.APIToken}`,
//                 },
//             });

//             let datas =
//                 response?.data?.mikrotikmaster?.filter((item) =>
//                     isAssignBranch.some(
//                         (branch) =>
//                             branch.company === item.company &&
//                             branch.branch === item.branch &&
//                             branch.unit === item.unit
//                     )
//                 );
//             setMikrotikMaster(datas);
//         } catch (err) {
//             console.log(err);
//             let error = err.response?.data?.message;
//             if (error) {
//                 setPopupContentMalert(error);
//                 setPopupSeverityMalert("error");
//                 handleClickOpenPopupMalert();
//             } else {
//                 handleApiError(
//                     err,
//                     setPopupContentMalert,
//                     setPopupSeverityMalert,
//                     handleClickOpenPopupMalert
//                 );
//             }
//         }
//     };
//     useEffect(() => {
//         fetchMikroRikMaster();
//     }, []);




//     //FILTER END





//     const [openPopupMalert, setOpenPopupMalert] = useState(false);
//     const [openRemoteAlert, setOpenRemoteAlert] = useState(false);
//     const [popupContentMalert, setPopupContentMalert] = useState("");
//     const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
//     const handleClickOpenPopupMalert = () => {
//         setOpenPopupMalert(true);
//     };
//     const handleClosePopupMalert = () => {
//         setOpenPopupMalert(false);
//     };

//     const handleClickOpenRemoteAlert = () => {
//         setOpenRemoteAlert(true);
//     };
//     const handleCloseRemoteAlert = () => {
//         setOpenRemoteAlert(false);
//     };
//     const [openPopup, setOpenPopup] = useState(false);
//     const [popupContent, setPopupContent] = useState("");
//     const [popupSeverity, setPopupSeverity] = useState("");
//     const handleClickOpenPopup = () => {
//         setOpenPopup(true);
//     };
//     const handleClosePopup = () => {
//         setOpenPopup(false);
//     };


//     let exportColumnNames = [
//         "Name",
//         // "password",
//         "Service",
//         "Profile",
//         "Local Address",
//         "Remote Address",
//         "Password",
//         "Last Logged Out",
//         "Last Caller Id",
//         "Last Disconnect Reason",

//     ];
//     let exportRowValues = [
//         "name",
//         // "password",
//         "service",
//         "profile",
//         "localaddress",
//         "remoteaddress",
//         "password",
//         "lastloggedout",
//         "lastcallerid",
//         "lastdisconnectreason",
//     ];



//     const gridRef = useRef(null);
//     const [selectedRows, setSelectedRows] = useState([]);
//     const [searchQueryManage, setSearchQueryManage] = useState("");
//     function isValidURL(url) {
//         setPageName(!pageName);
//         try {
//             new URL(url);
//             return true;
//         } catch (error) {
//             return false;
//         }
//     }
//     const ipRegex = /^$|^[0-9.]+$/;
//     const [assetVariant, setAssetVariant] = useState({
//         company: "Please Select Company",
//         branch: "Please Select Branch",
//         unit: "Please Select Unit",
//         name: "Please Select Name",
//         url: "",
//         username: "",
//         adminusername: "",
//         livepassword: "",
//         adminpassword: "",
//         service: "any",
//         profile: "",
//         localaddress: "Please Select Local Address",
//         remoteaddress: "",
//         empteam: "",
//         autogenerate: false,
//         showpassword: false,
//         showlivepassword: false,

//     });

//     const [assetVariantEdit, setAssetVariantEdit] = useState({
//         name: "",
//         password: "",
//         service: "any",
//         profile: "",
//         localaddress: "",
//         remoteaddress: "",
//         autogenerate: false,
//         showpassword: false,
//         showlivepassword: false,
//     });
//     let serviceOptions = [
//         { label: "any", value: "any" },
//         { label: "async", value: "async" },
//         { label: "l2tp", value: "l2tp" },
//         { label: "ovpn", value: "ovpn" },
//         { label: "pppoe", value: "pppoe" },
//         { label: "pptp", value: "pptp" },
//         { label: "sstp", value: "sstp" },
//     ]

//     const {
//         isUserRoleCompare,
//         isUserRoleAccess,
//         pageName,
//         setPageName,
//         buttonStyles,
//         isAssignBranch,
//         allTeam,
//         allUsersData
//     } = useContext(UserRoleAccessContext);




//     const accessbranch = isUserRoleAccess?.role?.includes("Manager")
//         ? isAssignBranch?.map((data) => ({
//             branch: data.branch,
//             company: data.company,
//             unit: data.unit,
//         }))
//         : isAssignBranch
//             ?.filter((data) => {
//                 let fetfinalurl = [];

//                 if (
//                     data?.modulenameurl?.length !== 0 &&
//                     data?.submodulenameurl?.length !== 0 &&
//                     data?.mainpagenameurl?.length !== 0 &&
//                     data?.subpagenameurl?.length !== 0 &&
//                     data?.subsubpagenameurl?.length !== 0
//                 ) {
//                     fetfinalurl = data.subsubpagenameurl;
//                 } else if (
//                     data?.modulenameurl?.length !== 0 &&
//                     data?.submodulenameurl?.length !== 0 &&
//                     data?.mainpagenameurl?.length !== 0 &&
//                     data?.subpagenameurl?.length !== 0
//                 ) {
//                     fetfinalurl = data.subpagenameurl;
//                 } else if (
//                     data?.modulenameurl?.length !== 0 &&
//                     data?.submodulenameurl?.length !== 0 &&
//                     data?.mainpagenameurl?.length !== 0
//                 ) {
//                     fetfinalurl = data.mainpagenameurl;
//                 } else if (
//                     data?.modulenameurl?.length !== 0 &&
//                     data?.submodulenameurl?.length !== 0
//                 ) {
//                     fetfinalurl = data.submodulenameurl;
//                 } else if (data?.modulenameurl?.length !== 0) {
//                     fetfinalurl = data.modulenameurl;
//                 } else {
//                     fetfinalurl = [];
//                 }

//                 const remove = [
//                     window.location.pathname?.substring(1),
//                     window.location.pathname,
//                 ];
//                 return fetfinalurl?.some((item) => remove?.includes(item));
//             })
//             ?.map((data) => ({
//                 branch: data.branch,
//                 company: data.company,
//                 unit: data.unit,
//             }));

//     useEffect(() => {
//         getapi();
//     }, []);

//     const getapi = async () => {
//         let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
//             headers: {
//                 Authorization: `Bearer ${auth.APIToken}`,
//             },
//             empcode: String(isUserRoleAccess?.empcode),
//             companyname: String(isUserRoleAccess?.companyname),
//             pagename: String("Mikrotik PPP Secrets"),
//             commonid: String(isUserRoleAccess?._id),
//             date: String(new Date()),

//             addedby: [
//                 {
//                     name: String(isUserRoleAccess?.username),
//                     date: String(new Date()),
//                 },
//             ],
//         });
//     };

//     const { auth } = useContext(AuthContext);
//     const [loader, setLoader] = useState(false);
//     //Datatable
//     const [page, setPage] = useState(1);
//     const [pageSize, setPageSize] = useState(10);
//     const [isErrorOpen, setIsErrorOpen] = useState(false);
//     const [isBtn, setIsBtn] = useState(false);
//     const [showAlert, setShowAlert] = useState();
//     const [openview, setOpenview] = useState(false);
//     const [openInfo, setOpeninfo] = useState(false);
//     const [isDeleteOpen, setIsDeleteOpen] = useState(false);
//     const [isDeleteOpenRestore, setIsDeleteOpenRestore] = useState(false);
//     const [deleteAssetVariant, setDeleteAssetVariant] = useState({});

//     const [items, setItems] = useState([]);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [allAssetVariantEdit, setAllAssetVariantEdit] = useState([]);
//     const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
//     const [anchorEl, setAnchorEl] = useState(null);
//     // Show All Columns & Manage Columns
//     const initialColumnVisibility = {
//         serialNumber: true,
//         company: true,
//         branch: true,
//         unit: true,
//         team: true,
//         employeename: true,
//         name: true,
//         password: true,
//         service: true,
//         profile: true,
//         localaddress: true,
//         remoteaddress: true,
//         lastloggedout: true,
//         // password: true,
//         lastdisconnectreason: true,
//         lastcallerid: true,
//         actions: true,
//     };
//     const [columnVisibility, setColumnVisibility] = useState(
//         initialColumnVisibility
//     );

//     //useEffect
//     useEffect(() => {
//         addSerialNumber(teamsArray);
//     }, [teamsArray]);


//     useEffect(() => {
//         const beforeUnloadHandler = (event) => handleBeforeUnload(event);
//         window.addEventListener("beforeunload", beforeUnloadHandler);
//         return () => {
//             window.removeEventListener("beforeunload", beforeUnloadHandler);
//         };
//     }, []);

//     const handleSelectionChange = (newSelection) => {
//         setSelectedRows(newSelection.selectionModel);
//     };
//     // Error Popup model
//     const handleClickOpenerr = () => {
//         setIsErrorOpen(true);
//     };

//     const [singleRow, setSingleRow] = useState({});
//     // view model
//     const handleClickOpenview = () => {
//         setOpenview(true);
//     };
//     const handleCloseview = () => {
//         setOpenview(false);
//     };
//     const handleCloseerr = () => {
//         setIsErrorOpen(false);
//     };
//     // info model
//     const handleClickOpeninfo = () => {
//         setOpeninfo(true);
//     };
//     const handleCloseinfo = () => {
//         setOpeninfo(false);
//     };
//     //Delete model
//     const handleClickOpen = () => {
//         setIsDeleteOpen(true);
//     };
//     const handleCloseMod = () => {
//         setIsDeleteOpen(false);
//     };
//     //Delete model
//     const handleClickOpenRestore = () => {
//         setIsDeleteOpenRestore(true);
//     };
//     const handleCloseModRestore = () => {
//         setIsDeleteOpenRestore(false);
//     };
//     // page refersh reload code
//     const handleBeforeUnload = (event) => {
//         event.preventDefault();
//         event.returnValue = ""; // This is required for Chrome support
//     };
//     // Manage Columns
//     const handleOpenManageColumns = (event) => {
//         setAnchorEl(event.currentTarget);
//         setManageColumnsOpen(true);
//     };
//     const handleCloseManageColumns = () => {
//         setManageColumnsOpen(false);
//         setSearchQueryManage("");
//     };
//     //Delete model
//     const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

//     const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
//     const handleCloseModcheckbox = () => {
//         setIsDeleteOpencheckbox(false);
//     };

//     const handleClickOpenalert = () => {
//         if (selectedRows.length === 0) {
//             setIsDeleteOpenalert(true);
//         } else {
//             setIsDeleteOpencheckbox(true);
//         }
//     };
//     const handleCloseModalert = () => {
//         setIsDeleteOpenalert(false);
//     };
//     const open = Boolean(anchorEl);
//     const id = open ? "simple-popover" : undefined;
//     const getRowClassName = (params) => {
//         if (selectedRows.includes(params.row.id)) {
//             return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
//         }
//         return ""; // Return an empty string for other rows
//     };

//     const [deleteTeamId, setDeleteTeamId] = useState("");

//     const deleteTeam = async () => {
//         setPageName(!pageName);
//         try {
//             await axios.post(
//                 `${SERVICE.DELETE_MIKROTIK_SECRET}`, {
//                 id: deleteTeamId,
//                 url: filterFinal?.url,
//                 username: filterFinal?.username,
//                 password: filterFinal?.password,
//             },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${auth.APIToken}`,
//                     },
//                 }
//             );
//             await fetchMikroTikSecrets(filterFinal?.url,
//                 filterFinal?.username,
//                 filterFinal?.password, filterDatas)
//             handleCloseMod();
//             setSelectedRows([]);
//             setPage(1);
//             setPopupContent("Deleted Successfully");
//             setPopupSeverity("success");
//             handleClickOpenPopup();
//         } catch (err) {
//             console.log(err);
//             let error = err.response?.data?.message;
//             if (error) {
//                 setPopupContentMalert(error);
//                 setPopupSeverityMalert("error");
//                 handleClickOpenPopupMalert();
//             } else {
//                 handleApiError(
//                     err,
//                     setPopupContentMalert,
//                     setPopupSeverityMalert,
//                     handleClickOpenPopupMalert
//                 );
//             }
//         }
//     };








//     //add model...
//     const [isAddOpen, setIsAddOpen] = useState(false);
//     const handleClickOpenAdd = () => {
//         setIsAddOpen(true);
//         setAssetVariant({
//             ...assetVariant,
//             url: filterDatas?.url,
//             company: filterDatas?.company,
//             branch: filterDatas?.branch,
//             unit: filterDatas?.unit,
//             name: filterDatas?.name,
//             adminusername: filterDatas?.username,
//             adminpassword: filterDatas?.password,
//             showpassword: false,
//             livepassword: "",
//             password: "",
//             username: "",
//             autogenerate: false
//             // localaddress: "Please Select Local Address",
//         });
//         setAutoGenPassword("")
//         fetchMikroTikSecrets(filterDatas?.url,
//             filterDatas?.username,
//             filterDatas?.password, filterDatas)
//         fetchMikroTikProfiles(filterDatas?.url,
//             filterDatas?.username,
//             filterDatas?.password,)
//         const team = allTeam?.filter(
//             (comp) =>
//                 filterDatas.company === comp.company &&
//                 filterDatas.branch === comp.branch &&
//                 filterDatas.unit === comp.unit)?.map(data => ({
//                     label: data.teamname,
//                     value: data.teamname,
//                 })).filter((item, index, self) => {
//                     return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
//                 })
//         setSelectedTeamOptions(team)
//         setValueTeam(
//             team.map((a, index) => {
//                 return a.value;
//             })
//         );
//     };
//     const handleCloseModAdd = (e, reason) => {
//         if (reason && reason === "backdropClick") return;
//         setIsAddOpen(false);
//         setAssetVariant({
//             ...assetVariant,
//             url: filterDatas?.url,
//             company: filterDatas?.company,
//             branch: filterDatas?.branch,
//             unit: filterDatas?.unit,
//             name: filterDatas?.name,
//             adminusername: filterDatas?.username,
//             adminpassword: filterDatas?.password,
//             showpassword: false,
//             profile: "",
//             remoteaddress: "",
//             localaddress: "Please Select Local Address",
//         });
//         fetchMikroTikProfiles(filterDatas?.url,
//             filterDatas?.username,
//             filterDatas?.password,)
//         fetchMikroTikSecrets(filterDatas?.url,
//             filterDatas?.username,
//             filterDatas?.password, filterDatas)
//         setEmployeeName("Please Select Employee Name");
//         setSelectedTeamOptions([])
//         setValueTeam([]);
//         setRemoteAddress([])

//     };
//     //Edit model...
//     const [isEditOpen, setIsEditOpen] = useState(false);
//     const handleClickOpenEdit = () => {
//         setIsEditOpen(true);
//     };
//     const handleCloseModEdit = (e, reason) => {
//         if (reason && reason === "backdropClick") return;
//         setIsEditOpen(false);
//         fetchMikroTikProfiles(filterDatas?.url,
//             filterDatas?.username,
//             filterDatas?.password,)
//     };
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         const isNameMatch = matchedSecrets?.some(
//             (item) =>
//                 item.name?.trim().toLowerCase() === assetVariant.name?.trim().toLowerCase() &&
//                 item.localaddress === assetVariant.localaddress &&
//                 item.remoteaddress === assetVariant.remoteaddress
//         );
//         if (isNameMatch) {
//             setPopupContentMalert("Data Already Exist!");
//             setPopupSeverityMalert("info");
//             handleClickOpenPopupMalert();

//         } else if (assetVariant.company === "Please Select Company" || assetVariant.company === "" || assetVariant.company === undefined) {
//             setPopupContentMalert("Please Select Company!");
//             setPopupSeverityMalert("info");
//             handleClickOpenPopupMalert();
//         }
//         else if (assetVariant.branch === "Please Select Branch" || assetVariant.branch === "" || assetVariant.branch === undefined) {
//             setPopupContentMalert("Please Select Branch!");
//             setPopupSeverityMalert("info");
//             handleClickOpenPopupMalert();
//         }
//         else if (assetVariant.unit === "Please Select Unit" || assetVariant.unit === "" || assetVariant.unit === undefined) {
//             setPopupContentMalert("Please Select Unit!");
//             setPopupSeverityMalert("info");
//             handleClickOpenPopupMalert();
//         }
//         else if (selectedTeamOptions?.length < 1) {
//             setPopupContentMalert("Please Select Team!");
//             setPopupSeverityMalert("info");
//             handleClickOpenPopupMalert();
//         }
//         else if (employeeName === "Please Select Employee Name") {
//             setPopupContentMalert("Please Select Employee Name!");
//             setPopupSeverityMalert("info");
//             handleClickOpenPopupMalert();
//         }
//         else if (!assetVariant?.autogenerate && assetVariant.password === "") {
//             setPopupContentMalert("Please Enter Temp Password!");
//             setPopupSeverityMalert("info");
//             handleClickOpenPopupMalert();
//         }
//         else if (assetVariant.livepassword === "") {
//             setPopupContentMalert("Please Enter Live Password!");
//             setPopupSeverityMalert("info");
//             handleClickOpenPopupMalert();
//         }
//         else if (assetVariant.profile === "") {
//             setPopupContentMalert("Please Select Profile!");
//             setPopupSeverityMalert("info");
//             handleClickOpenPopupMalert();
//         }
//         else if (assetVariant.localaddress === "Please Select Local Address") {
//             setPopupContentMalert(localAddressBoolean === false ? "Please Select Local Address!" : "Please Enter Local Address!");
//             setPopupSeverityMalert("info");
//             handleClickOpenPopupMalert();
//         }
//         else if (assetVariant.remoteaddress === "" || assetVariant.remoteaddress === "Please Select Remote Address" || assetVariant.remoteaddress === undefined) {
//             handleClickOpenRemoteAlert();
//         }
//         else {
//             sendRequest();
//         }
//     };

//     //add function
//     const sendRequest = async () => {
//         setPageName(!pageName);
//         setIsBtn(true);

//         try {
//             await axios.post(
//                 SERVICE.CREATE_MIKROTIK_SECRET,
//                 {
//                     name: String(assetVariant.username),
//                     company: String(assetVariant.company),
//                     branch: String(assetVariant.branch),
//                     unit: String(assetVariant.unit),
//                     mikrotikname: String(filterFinal?.name),
//                     // temppassword: assetVariant.password,
//                     temppassword: assetVariant?.autogenerate ? autoGenPassword : assetVariant.password,
//                     password: assetVariant.livepassword,
//                     service: String(assetVariant.service),
//                     profile: String(assetVariant.profile),
//                     localaddress: String(assetVariant.localaddress),
//                     remoteaddress: String(assetVariant.remoteaddress),
//                     adminusername: String(filterFinal.username),
//                     adminpassword: String(filterFinal.password),
//                     url: String(filterFinal.url),
//                     team: valueTeam,
//                     employeename: employeeName,
//                     autogenerate: assetVariant.autogenerate,
//                     addedby: [
//                         {
//                             name: String(isUserRoleAccess.companyname),
//                             date: String(new Date()),
//                         },
//                     ],
//                 },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${auth.APIToken}`,
//                     },
//                 }
//             );

//             setEmployeeName("Please Select Employee Name")
//             setAssetVariant({
//                 ...assetVariant,
//                 username: "",
//                 autogenerate: false,
//                 profile: "Please Select Profile",
//                 localaddress: "Please Select Local Address",
//                 remoteaddress: "",
//                 password: "",
//                 livepassword: "",
//             });
//             setLocalAddresses([])
//             setRemoteAddress([])
//             setAutoGenPassword("")
//             fetchMikroTikProfiles(filterFinal?.url,
//                 filterFinal?.username,
//                 filterFinal?.password,)
//             await fetchMikroTikSecrets(filterFinal?.url,
//                 filterFinal?.username,
//                 filterFinal?.password , filterDatas)
//             setPopupContent("Added Successfully");
//             setPopupSeverity("success");
//             handleClickOpenPopup();
//             setIsBtn(false);
//         } catch (err) {
//             setIsBtn(false);
//             let error = err.response?.data?.message;
//             if (error) {
//                 setPopupContentMalert(error);
//                 setPopupSeverityMalert("error");
//                 handleClickOpenPopupMalert();
//             } else {
//                 handleApiError(
//                     err,
//                     setPopupContentMalert,
//                     setPopupSeverityMalert,
//                     handleClickOpenPopupMalert
//                 );
//             }
//         }
//     };



//     //editing the single data...
//     const sendEditRequest = async () => {
//         setPageName(!pageName);

//         try {
//             let res = await axios.put(
//                 `${SERVICE.UPDATE_MIKROTIK_SECRET}`,
//                 {
//                     id: String(assetVariantEdit.id),
//                     company: String(assetVariantEdit.company),
//                     branch: String(assetVariantEdit.branch),
//                     unit: String(assetVariantEdit.unit),
//                     mikrotikid: String(assetVariantEdit.id),
//                     name: String(assetVariantEdit.username),
//                     mikrotikname: String(filterFinal?.name),
//                     temppassword: assetVariantEdit?.autogenerate ? autoGenPasswordEdit : assetVariantEdit.password,
//                     password: assetVariantEdit.livepassword,
//                     service: String(assetVariantEdit.service),
//                     profile: String(assetVariantEdit.profile),
//                     localaddress: String(assetVariantEdit.localaddress),
//                     remoteaddress: String(assetVariantEdit.remoteaddress),
//                     adminusername: String(filterFinal.username),
//                     adminpassword: String(filterFinal.password),
//                     url: String(filterFinal.url),
//                     team: valueTeamEdit,
//                     employeename: employeeNameEdit,
//                     autogenerate: assetVariantEdit.autogenerate,
//                     updatedby: [
//                         ...assetVariantEdit?.updatedby,
//                         {
//                             name: String(isUserRoleAccess.companyname),
//                             date: String(new Date()),
//                         },
//                     ],
//                 },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${auth.APIToken}`,
//                     },
//                 }
//             );

//             await fetchMikroTikSecrets(filterFinal?.url,
//                 filterFinal?.username,
//                 filterFinal?.password, filterDatas)
//             handleCloseModEdit();
//             setPopupContent("Updated Successfully");
//             setPopupSeverity("success");
//             handleClickOpenPopup();
//         } catch (err) {
//             console.log("Error Response:", err.response);
//             let error = err.response?.data?.message;
//             if (error) {
//                 setPopupContentMalert(error);
//                 setPopupSeverityMalert("error");
//                 handleClickOpenPopupMalert();
//             } else {
//                 handleApiError(
//                     err,
//                     setPopupContentMalert,
//                     setPopupSeverityMalert,
//                     handleClickOpenPopupMalert
//                 );
//             }
//         }
//     };

//     const editSubmit = (e) => {
//         e.preventDefault();
//         const isNameMatch = matchedSecrets?.filter((item) => item.id !== assetVariantEdit.id)?.some(
//             (item) =>
//                 item.name?.trim().toLowerCase() === assetVariantEdit.name?.trim().toLowerCase()
//         );
//         if (isNameMatch) {
//             setPopupContentMalert("Data Already Exist!");
//             setPopupSeverityMalert("info");
//             handleClickOpenPopupMalert();
//         }
//         else if (assetVariantEdit?.company === "Please Select Company" || assetVariantEdit.company === "" || assetVariantEdit.company === undefined) {
//             setPopupContentMalert("Please Select Company!");
//             setPopupSeverityMalert("info");
//             handleClickOpenPopupMalert();
//         }
//         else if (assetVariantEdit?.branch === "Please Select Branch" || assetVariantEdit.branch === "" || assetVariantEdit.branch === undefined) {
//             setPopupContentMalert("Please Select Branch!");
//             setPopupSeverityMalert("info");
//             handleClickOpenPopupMalert();
//         }
//         else if (assetVariantEdit?.unit === "Please Select Unit" || assetVariantEdit.unit === "" || assetVariantEdit.unit === undefined) {
//             setPopupContentMalert("Please Select Unit!");
//             setPopupSeverityMalert("info");
//             handleClickOpenPopupMalert();
//         }
//         else if (selectedTeamOptionsEdit?.length < 1) {
//             setPopupContentMalert("Please Select Team!");
//             setPopupSeverityMalert("info");
//             handleClickOpenPopupMalert();
//         }
//         else if (employeeNameEdit === "Please Select Employee Name" || employeeNameEdit === "" || employeeNameEdit === undefined) {
//             setPopupContentMalert("Please Select Employee Name!");
//             setPopupSeverityMalert("info");
//             handleClickOpenPopupMalert();
//         }
//         else if (!assetVariantEdit?.autogenerate && assetVariantEdit.password === "") {
//             setPopupContentMalert("Please Enter Temp Password!");
//             setPopupSeverityMalert("info");
//             handleClickOpenPopupMalert();
//         }
//         else if (assetVariantEdit.livepassword === "") {
//             setPopupContentMalert("Please Enter Live Password!");
//             setPopupSeverityMalert("info");
//             handleClickOpenPopupMalert();
//         }
//         else if (assetVariantEdit.profile === "Please Select Profile" || assetVariantEdit.profile === "" || assetVariantEdit.profile === undefined) {
//             setPopupContentMalert("Please Select Profile!");
//             setPopupSeverityMalert("info");
//             handleClickOpenPopupMalert();
//         }
//         else if (assetVariantEdit.localaddress === "Please Select Local Address") {
//             setPopupContentMalert(localAddressBooleanEdit === false ? "Please Select Local Address!" : "Please Enter Local Address!");
//             setPopupSeverityMalert("info");
//             handleClickOpenPopupMalert();
//         }
//         else if (assetVariantEdit.remoteaddress === "" || assetVariantEdit.remoteaddress === undefined) {
//             handleClickOpenRemoteAlert();
//         }
//         else {
//             sendEditRequest();
//         }
//     };
//     //get all Asset Variant name.
//     const fetchMikroTikSecrets = async (url,
//         username,
//         password , filterFinal) => {
//         setPageName(!pageName);
//         try {
//             setLoader(true);
//             let response = await axios.post(SERVICE.GET_MIKROTIK_SECRETS, {
//                 url, username, password , filterFinal
//             }, {
//                 headers: {
//                     Authorization: `Bearer ${auth.APIToken}`,
//                 },
//             });
//             let ipPools = await axios.post(SERVICE.GET_MIKROTIK_IPPOOL, {
//                 url, username, password
//             }, {
//                 headers: {
//                     Authorization: `Bearer ${auth.APIToken}`,
//                 },
//             });

//             let dataipPools =
//                 ipPools?.data?.ippool;

//             setIpPools(dataipPools)
//             let datas = response?.data?.matchedNames?.length > 0 ? response?.data?.matchedNames?.map(data => {
//                 let matchedItems = allUsersData?.find(item => data?.name === item?.username);
//                 if (matchedItems) {
//                     return {
//                         ...data,
//                         company: matchedItems?.company,
//                         branch: matchedItems?.branch,
//                         unit: matchedItems?.unit,
//                         team: [matchedItems?.team],
//                         employeename: matchedItems?.companyname,
//                     }
//                 }
//             }) : [];
//             let matchedDatas = response?.data?.secrets?.length > 0 ? response?.data?.secrets : [];
//             setTeamsArray(datas);

//             const items = matchedDatas?.map((item, index) => {
//                 return {
//                     ...item, // Original data
//                     serialNumber: index + 1, // Serial number
//                     id: item?.[".id"],
//                     name: item?.name,
//                     password: item?.password,
//                     temppassword: item?.temppassword,
//                     dummypassword: "********",
//                     service: item?.service,
//                     profile: item?.profile,
//                     team: item?.team,
//                     employeename: item?.employeename,
//                     autogenerate: item?.autogenerate,
//                     localaddress: item?.["local-address"],
//                     remoteaddress: item?.["remote-address"],
//                     lastloggedout: moment(item?.["last-logged-out"]).format("DD-MM-YYYY hh:mm:ss a"),
//                     lastdisconnectreason: item?.["last-disconnect-reason"],
//                     lastcallerid: item?.["last-caller-id"],
//                     addedby: item?.addedby,
//                     updatedby: item?.updatedby,
//                     createdAt: item?.createdAt,
//                 };
//             });
//             setMatchedSecrets(items);
//             setLoader(false);
//         } catch (err) {
//             setLoader(false);
//             console.log(err);
//             let error = err.response?.data?.message;
//             if (error) {
//                 setPopupContentMalert(error);
//                 setPopupSeverityMalert("error");
//                 handleClickOpenPopupMalert();
//             } else {
//                 handleApiError(
//                     err,
//                     setPopupContentMalert,
//                     setPopupSeverityMalert,
//                     handleClickOpenPopupMalert
//                 );
//             }
//         }
//     };


//     //image
//     const handleCaptureImage = () => {
//         if (gridRef.current) {
//             html2canvas(gridRef.current).then((canvas) => {
//                 canvas.toBlob((blob) => {
//                     saveAs(blob, "Mikrotik PPP Secrets.png");
//                 });
//             });
//         }
//     };

//     //print...
//     const componentRef = useRef();
//     const handleprint = useReactToPrint({
//         content: () => componentRef.current,
//         documentTitle: "Mikrotik PPP Secrets",
//         pageStyle: "print",
//     });

//     //serial no for listing items
//     const addSerialNumber = (profiledatas) => {
//         const itemsWithSerialNumber = profiledatas?.map((item, index) => {
//             return {
//                 ...item, // Original data
//                 serialNumber: index + 1, // Serial number
//                 id: item?.[".id"],
//                 name: item?.name,
//                 password: item?.password,
//                 temppassword: item?.temppassword,
//                 dummypassword: "********",
//                 service: item?.service,
//                 profile: item?.profile,
//                 team: item?.team,
//                 employeename: item?.employeename,
//                 autogenerate: item?.autogenerate,
//                 localaddress: item?.["local-address"],
//                 remoteaddress: item?.["remote-address"],
//                 lastloggedout: moment(item?.["last-logged-out"]).format("DD-MM-YYYY hh:mm:ss a"),
//                 lastdisconnectreason: item?.["last-disconnect-reason"],
//                 lastcallerid: item?.["last-caller-id"],
//                 addedby: item?.addedby,
//                 updatedby: item?.updatedby,
//                 createdAt: item?.createdAt,
//             };
//         });
//         // Update the state with the new items
//         setItems(itemsWithSerialNumber);
//     };
//     //Datatable
//     const handlePageChange = (newPage) => {
//         setPage(newPage);
//         setSelectedRows([]);
//         setSelectAllChecked(false);
//     };
//     const handlePageSizeChange = (event) => {
//         setPageSize(Number(event.target.value));
//         setSelectedRows([]);
//         setSelectAllChecked(false);
//         setPage(1);
//     };
//     //datatable....
//     const handleSearchChange = (event) => {
//         setSearchQuery(event.target.value);
//         setPage(1);
//     };

//     // Split the search query into individual terms
//     const searchTerms = searchQuery.toLowerCase().split(" ");

//     // Modify the filtering logic to check each term
//     const filteredDatas = items?.filter((item) => {
//         return searchTerms.every((term) =>
//             Object.values(item).join(" ").toLowerCase().includes(term)
//         );
//     });

//     const filteredData = filteredDatas?.slice(
//         (page - 1) * pageSize,
//         page * pageSize
//     );
//     const totalPages = Math.ceil(filteredDatas?.length / pageSize);
//     const visiblePages = Math.min(totalPages, 3);
//     const firstVisiblePage = Math.max(1, page - 1);
//     const lastVisiblePage = Math.min(
//         firstVisiblePage + visiblePages - 1,
//         totalPages
//     );
//     const pageNumbers = [];
//     for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
//         pageNumbers.push(i);
//     }

//     const [selectAllChecked, setSelectAllChecked] = useState(false);
//     const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
//         <div>
//             <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
//         </div>
//     );
//     const columnDataTable = [

//         {
//             field: "serialNumber",
//             headerName: "SNo",
//             flex: 0,
//             width: 100,
//             hide: !columnVisibility.serialNumber,
//             headerClassName: "bold-header",
//         },

//         {
//             field: "company",
//             headerName: "Company",
//             flex: 0,
//             width: 150,
//             hide: !columnVisibility.company,
//             headerClassName: "bold-header",
//         },
//         {
//             field: "branch",
//             headerName: "Branch",
//             flex: 0,
//             width: 150,
//             hide: !columnVisibility.branch,
//             headerClassName: "bold-header",
//         },
//         {
//             field: "unit",
//             headerName: "Unit",
//             flex: 0,
//             width: 150,
//             hide: !columnVisibility.unit,
//             headerClassName: "bold-header",
//         },
//         {
//             field: "team",
//             headerName: "Team",
//             flex: 0,
//             width: 150,
//             hide: !columnVisibility.team,
//             headerClassName: "bold-header",
//         },
//         {
//             field: "employeename",
//             headerName: "Employee Name",
//             flex: 0,
//             width: 150,
//             hide: !columnVisibility.employeename,
//             headerClassName: "bold-header",
//         },
//         {
//             field: "name",
//             headerName: "Name",
//             flex: 0,
//             width: 150,
//             hide: !columnVisibility.name,
//             headerClassName: "bold-header",
//         },
//         // {
//         //     field: "password",
//         //     headerName: "Password",
//         //     flex: 0,
//         //     width: 150,
//         //     hide: !columnVisibility.password,
//         //     headerClassName: "bold-header",
//         // },
//         {
//             field: "service",
//             headerName: "Service",
//             flex: 0,
//             width: 150,
//             hide: !columnVisibility.service,
//             headerClassName: "bold-header",
//         },
//         {
//             field: "profile",
//             headerName: "Profile",
//             flex: 0,
//             width: 150,
//             hide: !columnVisibility.profile,
//             headerClassName: "bold-header",
//         },

//         {
//             field: "localaddress",
//             headerName: "Local Address",
//             flex: 0,
//             width: 150,
//             hide: !columnVisibility.localaddress,
//             headerClassName: "bold-header",
//         },

//         {
//             field: "remoteaddress",
//             headerName: "Remote Address",
//             flex: 0,
//             width: 150,
//             hide: !columnVisibility.remoteaddress,
//             headerClassName: "bold-header",
//         },

//         {
//             field: "password",
//             headerName: "Password",
//             flex: 0,
//             width: 150,
//             hide: !columnVisibility.password,
//             headerClassName: "bold-header",
//         },

//         {
//             field: "lastloggedout",
//             headerName: "Last Logged Out",
//             flex: 0,
//             width: 150,
//             hide: !columnVisibility.lastloggedout,
//             headerClassName: "bold-header",
//         },
//         {
//             field: "lastcallerid",
//             headerName: "Last Caller ID",
//             flex: 0,
//             width: 150,
//             hide: !columnVisibility.lastcallerid,
//             headerClassName: "bold-header",
//         },
//         {
//             field: "lastdisconnectreason",
//             headerName: "Last Disconnect Reason",
//             flex: 0,
//             width: 150,
//             hide: !columnVisibility.lastdisconnectreason,
//             headerClassName: "bold-header",
//         },

//         {
//             field: "actions",
//             headerName: "Action",
//             flex: 0,
//             width: 250,
//             minHeight: "40px !important",
//             sortable: false,
//             hide: !columnVisibility.actions,
//             headerClassName: "bold-header",
//             renderCell: (params) => (
//                 <Grid sx={{ display: "flex" }}>
//                     {isUserRoleCompare?.includes("esecrets") && (
//                         <>
//                             <Button
//                                 sx={userStyle.buttonedit}
//                                 onClick={() => {
//                                     getCode(params.row)
//                                     const userData = allUsersData?.find(
//                                         (comp) => params?.row?.name === comp.username
//                                     );
//                                     const password = autoGenerateTempPasswordEdit(params?.row?.name, filterFinal.name, params?.row?.service, params?.row?.remoteaddress)
//                                     setAutoGenPasswordEdit(params.row?.autogenerate === true ? password : params.row?.temppassword);
//                                     const answer = handleLocalAddress(params?.row?.localaddress);
//                                     setLocalAddressBooleanEdit(answer ? true : false)
//                                     setRemoteAddressString(params?.row?.remoteaddress);
//                                     setAssetVariantEdit({
//                                         ...params.row,
//                                         name: filterDatas?.name,
//                                         company: params.row?.company ? params.row?.company : userData?.company,
//                                         branch: params.row?.branch ? params.row?.branch : userData?.branch,
//                                         unit: params.row?.unit ? params.row?.unit : userData?.unit,
//                                         password: params.row?.temppassword ? params.row?.temppassword : "",
//                                         autogenerate: params.row?.autogenerate === true ? true : false,
//                                         livepassword: params.row?.password ? params.row?.password : "",
//                                         username: params?.row?.name,
//                                         adminusername: filterDatas?.username,
//                                         adminpassword: filterDatas?.password,
//                                     });
//                                     handleClickOpenEdit();
//                                 }}
//                             >
//                                 <EditOutlinedIcon sx={buttonStyles.buttonedit} />
//                             </Button>
//                         </>
//                     )}

//                     {isUserRoleCompare?.includes("dsecrets") && (
//                         <>
//                             <Button
//                                 sx={userStyle.buttondelete}
//                                 onClick={(e) => {
//                                     setDeleteTeamId(params.row.id);
//                                     handleClickOpen();
//                                 }}
//                             >
//                                 <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
//                             </Button>
//                         </>
//                     )}
//                     {isUserRoleCompare?.includes("vsecrets") && (
//                         <Button
//                             sx={userStyle.buttonedit}
//                             onClick={() => {
//                                 // getviewCode(params.row.id);
//                                 setSingleRow(params?.row);
//                                 handleClickOpenview();
//                             }}
//                         >
//                             <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
//                         </Button>
//                     )}
//                     {isUserRoleCompare?.includes("isecrets") && (params?.row?.addedby?.length > 0 || params?.row?.updatedby?.length > 0) && (

//                         <Button
//                             size="small"
//                             sx={userStyle.actionbutton}
//                             onClick={() => {
//                                 setSingleRow(params?.row);
//                                 handleClickOpeninfo();
//                                 console.log(params?.row?.addedby , params?.row?.updatedby,'params?.row?.addedby')
//                             }}
//                         >
//                             <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />
//                         </Button>
//                     )}
//                 </Grid>
//             ),
//         },
//     ];


//     const rowDataTable = filteredData.map((item, index) => {
//         return {
//             id: item.id,
//             _id: item._id,
//             serialNumber: item.serialNumber,
//             name: item?.name,
//             team: item?.team,
//             employeename: item?.employeename,
//             company: item?.company,
//             branch: item?.branch,
//             unit: item?.unit,
//             autogenerate: item?.autogenerate,
//             password: item?.password,
//             temppassword: item?.temppassword,
//             dummypassword: item?.dummypassword,
//             service: item?.service,
//             profile: item?.profile,
//             localaddress: item?.localaddress,
//             remoteaddress: item?.remoteaddress,
//             lastloggedout: item?.lastloggedout,
//             lastdisconnectreason: item?.lastdisconnectreason,
//             lastcallerid: item?.lastcallerid,
//             addedby: item?.addedby,
//             updatedby: item?.updatedby,
//             createdAt: item?.createdAt,
//         };
//     });

//     const rowsWithCheckboxes = rowDataTable.map((row) => ({
//         ...row,
//         // Create a custom field for rendering the checkbox
//         checkbox: selectedRows.includes(row.id),
//     }));

//     // Show All Columns functionality
//     const handleShowAllColumns = () => {
//         setColumnVisibility(initialColumnVisibility);
//     };
//     // Function to filter columns based on search query
//     const filteredColumns = columnDataTable.filter((column) =>
//         column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
//     );
//     // Manage Columns functionality
//     const toggleColumnVisibility = (field) => {
//         setColumnVisibility((prevVisibility) => ({
//             ...prevVisibility,
//             [field]: !prevVisibility[field],
//         }));
//     };
//     // JSX for the "Manage Columns" popover content
//     const manageColumnsContent = (
//         <Box
//             style={{
//                 padding: "10px",
//                 minWidth: "325px",
//                 "& .MuiDialogContent-root": { padding: "10px 0" },
//             }}
//         >
//             <Typography variant="h6">Manage Columns</Typography>
//             <IconButton
//                 aria-label="close"
//                 onClick={handleCloseManageColumns}
//                 sx={{
//                     position: "absolute",
//                     right: 8,
//                     top: 8,
//                     color: (theme) => theme.palette.grey[500],
//                 }}
//             >
//                 <CloseIcon />
//             </IconButton>
//             <Box sx={{ position: "relative", margin: "10px" }}>
//                 <TextField
//                     label="Find column"
//                     variant="standard"
//                     fullWidth
//                     value={searchQueryManage}
//                     onChange={(e) => setSearchQueryManage(e.target.value)}
//                     sx={{ marginBottom: 5, position: "absolute" }}
//                 />
//             </Box>
//             <br />
//             <br />
//             <DialogContent
//                 sx={{ minWidth: "auto", height: "200px", position: "relative" }}
//             >
//                 <List sx={{ overflow: "auto", height: "100%" }}>
//                     {filteredColumns.map((column) => (
//                         <ListItem key={column.field}>
//                             <ListItemText
//                                 sx={{ display: "flex" }}
//                                 primary={
//                                     <Switch
//                                         sx={{ marginTop: "-5px" }}
//                                         size="small"
//                                         checked={columnVisibility[column.field]}
//                                         onChange={() => toggleColumnVisibility(column.field)}
//                                     />
//                                 }
//                                 secondary={
//                                     column.field === "checkbox" ? "Checkbox" : column.headerName
//                                 }
//                             />
//                         </ListItem>
//                     ))}
//                 </List>
//             </DialogContent>
//             <DialogActions>
//                 <Grid container>
//                     <Grid item md={4}>
//                         <Button
//                             variant="text"
//                             sx={{ textTransform: "none" }}
//                             onClick={() => setColumnVisibility(initialColumnVisibility)}
//                         >
//                             {" "}
//                             Show All
//                         </Button>
//                     </Grid>
//                     <Grid item md={4}></Grid>
//                     <Grid item md={4}>
//                         <Button
//                             variant="text"
//                             sx={{ textTransform: "none" }}
//                             onClick={() => {
//                                 const newColumnVisibility = {};
//                                 columnDataTable.forEach((column) => {
//                                     newColumnVisibility[column.field] = false; // Set hide property to true
//                                 });
//                                 setColumnVisibility(newColumnVisibility);
//                             }}
//                         >
//                             {" "}
//                             Hide All
//                         </Button>
//                     </Grid>
//                 </Grid>
//             </DialogActions>
//         </Box>
//     );

//     const [isFilterOpen, setIsFilterOpen] = useState(false);
//     const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

//     // page refersh reload
//     const handleCloseFilterMod = () => {
//         setIsFilterOpen(false);
//     };

//     const handleClosePdfFilterMod = () => {
//         setIsPdfFilterOpen(false);
//     };

//     const [fileFormat, setFormat] = useState("");


//     return (
//         <Box>
//             <Headtitle title={"MIKROTIK PPP SECRETS"} />
//             {/* ****** Header Content ****** */}
//             <PageHeading
//                 title="Mikrotik PPP Secrets"
//                 modulename="Mikrotik"
//                 submodulename="PPP"
//                 mainpagename="Secrets"
//                 subpagename=""
//                 subsubpagename=""
//             />
//             <>
//                 {isUserRoleCompare?.includes("lsecrets") && (
//                     <Box sx={userStyle.selectcontainer}>
//                         <>
//                             <Grid container spacing={2}>
//                                 <Grid item xs={8}>
//                                     <Typography sx={userStyle.importheadtext}>
//                                         Filter Mikrotik PPP Secrets
//                                     </Typography>
//                                 </Grid>
//                             </Grid>
//                             <br />
//                             <Grid container spacing={2}>
//                                 <Grid item md={4} xs={12} sm={12}>
//                                     <FormControl fullWidth size="small">
//                                         <Typography>
//                                             Company <b style={{ color: "red" }}>*</b>
//                                         </Typography>
//                                         <Selects
//                                             maxMenuHeight={300}
//                                             options={mikrotikMaster
//                                                 ?.map((data) => ({
//                                                     label: data.company,
//                                                     value: data.company,
//                                                 })).filter((item, index, self) => {
//                                                     return (
//                                                         self.findIndex(
//                                                             (i) =>
//                                                                 i.label === item.label && i.value === item.value
//                                                         ) === index
//                                                     );
//                                                 })}
//                                             value={{
//                                                 label: filterDatas.company,
//                                                 value: filterDatas.company,
//                                             }}
//                                             onChange={(e) => {
//                                                 setFilterDatas({
//                                                     ...filterDatas,
//                                                     company: e.value,
//                                                     branch: "Please Select Branch",
//                                                     unit: "Please Select Unit",
//                                                     name: "Please Select Name",
//                                                     url: "",
//                                                     username: "",
//                                                     password: "",
//                                                 });
//                                             }}
//                                         />
//                                     </FormControl>
//                                 </Grid>
//                                 <Grid item md={4} xs={12} sm={12}>
//                                     <FormControl fullWidth size="small">
//                                         <Typography>
//                                             Branch <b style={{ color: "red" }}>*</b>
//                                         </Typography>
//                                         <Selects
//                                             maxMenuHeight={300}
//                                             options={mikrotikMaster
//                                                 ?.filter((comp) =>
//                                                     filterDatas.company === comp.company
//                                                 )
//                                                 ?.map((data) => ({
//                                                     label: data.branch,
//                                                     value: data.branch,
//                                                 }))
//                                                 .filter((item, index, self) => {
//                                                     return (
//                                                         self.findIndex(
//                                                             (i) =>
//                                                                 i.label === item.label &&
//                                                                 i.value === item.value
//                                                         ) === index
//                                                     );
//                                                 })}
//                                             value={{
//                                                 label: filterDatas.branch,
//                                                 value: filterDatas.branch,
//                                             }}
//                                             onChange={(e) => {
//                                                 setFilterDatas({
//                                                     ...filterDatas,
//                                                     branch: e.value,
//                                                     unit: "Please Select Unit",
//                                                     name: "Please Select Name",
//                                                     url: "",
//                                                     username: "",
//                                                     password: "",
//                                                 });
//                                             }}
//                                         />
//                                     </FormControl>
//                                 </Grid>
//                                 <Grid item md={4} xs={12} sm={12}>
//                                     <FormControl fullWidth size="small">
//                                         <Typography>
//                                             Unit <b style={{ color: "red" }}>*</b>
//                                         </Typography>
//                                         <Selects
//                                             maxMenuHeight={300}
//                                             options={mikrotikMaster
//                                                 ?.filter(
//                                                     (comp) =>
//                                                         filterDatas.company === comp.company &&
//                                                         filterDatas.branch === comp.branch
//                                                 )
//                                                 ?.map((data) => ({
//                                                     label: data.unit,
//                                                     value: data.unit,
//                                                 }))
//                                                 .filter((item, index, self) => {
//                                                     return (
//                                                         self.findIndex(
//                                                             (i) =>
//                                                                 i.label === item.label &&
//                                                                 i.value === item.value
//                                                         ) === index
//                                                     );
//                                                 })}
//                                             value={{
//                                                 label: filterDatas.unit,
//                                                 value: filterDatas.unit,
//                                             }}
//                                             onChange={(e) => {
//                                                 setFilterDatas({
//                                                     ...filterDatas,
//                                                     unit: e.value,
//                                                     name: "Please Select Name",
//                                                     url: "",
//                                                     username: "",
//                                                     password: "",
//                                                 });
//                                             }}
//                                         />
//                                     </FormControl>
//                                 </Grid>
//                                 <Grid item md={4} xs={12} sm={12}>
//                                     <FormControl fullWidth size="small">
//                                         <Typography>
//                                             Name <b style={{ color: "red" }}>*</b>
//                                         </Typography>
//                                         <Selects
//                                             maxMenuHeight={300}
//                                             options={mikrotikMaster
//                                                 ?.filter(
//                                                     (comp) =>
//                                                         filterDatas.company === comp.company &&
//                                                         filterDatas.branch === comp.branch &&
//                                                         filterDatas.unit === comp.unit
//                                                 )
//                                                 ?.map((data) => ({
//                                                     label: data.name,
//                                                     value: data.name,
//                                                     url: data.url,
//                                                     username: data.username,
//                                                     password: data.password,
//                                                 }))
//                                                 .filter((item, index, self) => {
//                                                     return (
//                                                         self.findIndex(
//                                                             (i) =>
//                                                                 i.label === item.label &&
//                                                                 i.value === item.value
//                                                         ) === index
//                                                     );
//                                                 })}
//                                             value={{
//                                                 label: filterDatas.name,
//                                                 value: filterDatas.name,
//                                             }}
//                                             onChange={(e) => {
//                                                 setFilterDatas({
//                                                     ...filterDatas,
//                                                     name: e.value,
//                                                     url: e.url,
//                                                     username: e.username,
//                                                     password: e.password,
//                                                 });
//                                             }}
//                                         />
//                                     </FormControl>
//                                 </Grid>
//                                 <Grid item md={3} xs={12} sm={6} mt={3}>
//                                     <div style={{ display: "flex", gap: "20px" }}>
//                                         <Button
//                                             variant="contained"
//                                             color="primary"
//                                             onClick={handleFilter}
//                                             sx={buttonStyles.buttonsubmit}
//                                         >
//                                             Filter
//                                         </Button>

//                                         <Button
//                                             sx={buttonStyles.btncancel}
//                                             onClick={handleClearFilter}
//                                         >
//                                             Clear
//                                         </Button>
//                                     </div>
//                                 </Grid>
//                             </Grid>

//                         </>
//                     </Box>
//                 )}
//             </>
//             <br /> <br />
//             {/* ****** Table Start ****** */}
//             {isUserRoleCompare?.includes("lsecrets") && (
//                 <>
//                     {loader ? (
//                         <Box sx={userStyle.container}>
//                             <Box
//                                 sx={{
//                                     display: "flex",
//                                     justifyContent: "center",
//                                     minHeight: "350px",
//                                 }}
//                             >
//                                 <ThreeDots
//                                     height="80"
//                                     width="80"
//                                     radius="9"
//                                     color="#1976d2"
//                                     ariaLabel="three-dots-loading"
//                                     wrapperStyle={{}}
//                                     wrapperClassName=""
//                                     visible={true}
//                                 />
//                             </Box>
//                         </Box>
//                     ) : (
//                         <Box sx={userStyle.container}>
//                             {/* ******************************************************EXPORT Buttons****************************************************** */}

//                             <Grid container spacing={2}>
//                                 <Grid item xs={10}>
//                                     <Typography sx={userStyle.importheadtext}>
//                                         List Mikrotik PPP Secrets
//                                     </Typography>
//                                 </Grid>
//                                 <Grid item xs={2}>
//                                     {isUserRoleCompare?.includes("asecrets") && filterApplied && (
//                                         <>

//                                             <Button
//                                                 variant="contained"
//                                                 sx={buttonStyles.buttonsubmit}
//                                                 onClick={handleClickOpenAdd}
//                                             >
//                                                 Add New
//                                             </Button>
//                                         </>
//                                     )}
//                                 </Grid>
//                             </Grid>
//                             <br />
//                             <Grid container spacing={2} style={userStyle.dataTablestyle}>
//                                 <Grid item md={2} xs={12} sm={12}>
//                                     <Box>
//                                         <label>Show entries:</label>
//                                         <Select
//                                             id="pageSizeSelect"
//                                             value={pageSize}
//                                             MenuProps={{
//                                                 PaperProps: {
//                                                     style: {
//                                                         maxHeight: 180,
//                                                         width: 80,
//                                                     },
//                                                 },
//                                             }}
//                                             onChange={handlePageSizeChange}
//                                             sx={{ width: "77px" }}
//                                         >
//                                             <MenuItem value={1}>1</MenuItem>
//                                             <MenuItem value={5}>5</MenuItem>
//                                             <MenuItem value={10}>10</MenuItem>
//                                             <MenuItem value={25}>25</MenuItem>
//                                             <MenuItem value={50}>50</MenuItem>
//                                             <MenuItem value={100}>100</MenuItem>
//                                             <MenuItem value={teamsArray?.length}>
//                                                 All
//                                             </MenuItem>
//                                         </Select>
//                                     </Box>
//                                 </Grid>
//                                 <Grid
//                                     item
//                                     md={8}
//                                     xs={12}
//                                     sm={12}
//                                     sx={{
//                                         display: "flex",
//                                         justifyContent: "center",
//                                         alignItems: "center",
//                                     }}
//                                 >
//                                     <Box>
//                                         {isUserRoleCompare?.includes("excelsecrets") && (
//                                             <>
//                                                 <Button
//                                                     onClick={(e) => {
//                                                         setIsFilterOpen(true);
//                                                         setFormat("xl");
//                                                     }}
//                                                     sx={userStyle.buttongrp}
//                                                 >
//                                                     <FaFileExcel />
//                                                     &ensp;Export to Excel&ensp;
//                                                 </Button>
//                                             </>
//                                         )}
//                                         {isUserRoleCompare?.includes("csvsecrets") && (
//                                             <>
//                                                 <Button
//                                                     onClick={(e) => {
//                                                         setIsFilterOpen(true);
//                                                         setFormat("csv");
//                                                     }}
//                                                     sx={userStyle.buttongrp}
//                                                 >
//                                                     <FaFileCsv />
//                                                     &ensp;Export to CSV&ensp;
//                                                 </Button>
//                                             </>
//                                         )}
//                                         {isUserRoleCompare?.includes("printsecrets") && (
//                                             <>
//                                                 <Button sx={userStyle.buttongrp} onClick={handleprint}>
//                                                     &ensp;
//                                                     <FaPrint />
//                                                     &ensp;Print&ensp;
//                                                 </Button>
//                                             </>
//                                         )}
//                                         {isUserRoleCompare?.includes("pdfsecrets") && (
//                                             <>
//                                                 <Button
//                                                     sx={userStyle.buttongrp}
//                                                     onClick={() => {
//                                                         setIsPdfFilterOpen(true);
//                                                     }}
//                                                 >
//                                                     <FaFilePdf />
//                                                     &ensp;Export to PDF&ensp;
//                                                 </Button>
//                                             </>
//                                         )}
//                                         {isUserRoleCompare?.includes("imagesecrets") && (
//                                             <Button
//                                                 sx={userStyle.buttongrp}
//                                                 onClick={handleCaptureImage}
//                                             >
//                                                 {" "}
//                                                 <ImageIcon sx={{ fontSize: "15px" }} />{" "}
//                                                 &ensp;Image&ensp;{" "}
//                                             </Button>
//                                         )}
//                                     </Box>
//                                 </Grid>
//                                 <Grid item md={2} xs={12} sm={12}>
//                                     <Box>
//                                         <FormControl fullWidth size="small">
//                                             <Typography>Search</Typography>
//                                             <OutlinedInput
//                                                 id="component-outlined"
//                                                 type="text"
//                                                 value={searchQuery}
//                                                 onChange={handleSearchChange}
//                                             />
//                                         </FormControl>
//                                     </Box>
//                                 </Grid>
//                             </Grid>
//                             <br />
//                             <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
//                                 Show All Columns
//                             </Button>
//                             &ensp;
//                             <Button
//                                 sx={userStyle.buttongrp}
//                                 onClick={handleOpenManageColumns}
//                             >
//                                 Manage Columns
//                             </Button>

//                             <br />
//                             <br />
//                             <Box
//                                 style={{
//                                     width: "100%",
//                                     overflowY: "hidden", // Hide the y-axis scrollbar
//                                 }}
//                             >
//                                 <StyledDataGrid
//                                     // onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
//                                     rows={rowsWithCheckboxes}
//                                     columns={columnDataTable.filter(
//                                         (column) => columnVisibility[column.field]
//                                     )}
//                                     onSelectionModelChange={handleSelectionChange}
//                                     selectionModel={selectedRows}
//                                     autoHeight={true}
//                                     ref={gridRef}
//                                     density="compact"
//                                     hideFooter
//                                     getRowClassName={getRowClassName}
//                                     disableRowSelectionOnClick
//                                 />
//                             </Box>
//                             <Box style={userStyle.dataTablestyle}>
//                                 <Box>
//                                     Showing{" "}
//                                     {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
//                                     {Math.min(page * pageSize, filteredDatas?.length)} of{" "}
//                                     {filteredDatas?.length} entries
//                                 </Box>
//                                 <Box>
//                                     <Button
//                                         onClick={() => setPage(1)}
//                                         disabled={page === 1}
//                                         sx={userStyle.paginationbtn}
//                                     >
//                                         <FirstPageIcon />
//                                     </Button>
//                                     <Button
//                                         onClick={() => handlePageChange(page - 1)}
//                                         disabled={page === 1}
//                                         sx={userStyle.paginationbtn}
//                                     >
//                                         <NavigateBeforeIcon />
//                                     </Button>
//                                     {pageNumbers?.map((pageNumber) => (
//                                         <Button
//                                             key={pageNumber}
//                                             sx={userStyle.paginationbtn}
//                                             onClick={() => handlePageChange(pageNumber)}
//                                             className={page === pageNumber ? "active" : ""}
//                                             disabled={page === pageNumber}
//                                         >
//                                             {pageNumber}
//                                         </Button>
//                                     ))}
//                                     {lastVisiblePage < totalPages && <span>...</span>}
//                                     <Button
//                                         onClick={() => handlePageChange(page + 1)}
//                                         disabled={page === totalPages}
//                                         sx={userStyle.paginationbtn}
//                                     >
//                                         <NavigateNextIcon />
//                                     </Button>
//                                     <Button
//                                         onClick={() => setPage(totalPages)}
//                                         disabled={page === totalPages}
//                                         sx={userStyle.paginationbtn}
//                                     >
//                                         <LastPageIcon />
//                                     </Button>
//                                 </Box>
//                             </Box>
//                             {/* ****** Table End ****** */}
//                         </Box>
//                     )}
//                 </>
//             )}
//             {/* ****** Table End ****** */}
//             {/* Manage Column */}
//             <Popover
//                 id={id}
//                 open={isManageColumnsOpen}
//                 anchorEl={anchorEl}
//                 onClose={handleCloseManageColumns}
//                 anchorOrigin={{
//                     vertical: "bottom",
//                     horizontal: "left",
//                 }}
//             >
//                 {manageColumnsContent}
//             </Popover>

//             <PppUnmatchedSecrets filterFinal={filterFinal} setFilterFinal={setFilterFinal} filterDatas={filterDatas} setFilterDatas={setFilterDatas} />

//             {/* Delete Modal */}
//             <Box>
//                 {/* ALERT DIALOG */}
//                 <Dialog
//                     open={openRemoteAlert}
//                     onClose={handleCloseRemoteAlert}
//                     aria-labelledby="alert-dialog-title"
//                     aria-describedby="alert-dialog-description"
//                 >
//                     <DialogContent
//                         sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
//                     >
//                         <ErrorOutlineOutlinedIcon
//                             sx={{ fontSize: "80px", color: "orange" }}
//                         />
//                         <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
//                             Are you sure you want to save without Remote address
//                         </Typography>
//                     </DialogContent>
//                     <DialogActions>
//                         <Button onClick={handleCloseRemoteAlert} sx={buttonStyles.btncancel}>
//                             Cancel
//                         </Button>
//                         <Button
//                             autoFocus
//                             sx={buttonStyles.buttonsubmit}
//                             onClick={(e) => sendRequest(e)}
//                         >
//                             {" "}
//                             Submit{" "}
//                         </Button>
//                     </DialogActions>
//                 </Dialog>
//             </Box>
//             {/* view model */}
//             <Dialog
//                 open={openview}
//                 onClose={handleClickOpenview}
//                 aria-labelledby="alert-dialog-title"
//                 aria-describedby="alert-dialog-description"
//                 maxWidth="md"
//                 fullWidth={true}
//                 sx={{
//                     overflow: "visible",
//                     "& .MuiPaper-root": {
//                         overflow: "visible",
//                     },
//                     marginTop: "50px"
//                 }}
//             >
//                 <Box sx={{ padding: "20px 50px" }}>
//                     <>
//                         <Typography sx={userStyle.HeaderText}>
//                             {" "}
//                             View Mikrotik PPP Secret
//                         </Typography>
//                         <br /> <br />
//                         <Grid container spacing={2}>
//                             <Grid item md={6} xs={12} sm={12}>
//                                 <FormControl fullWidth size="small">
//                                     <Typography variant="h6">Name</Typography>
//                                     <Typography>{singleRow.name}</Typography>
//                                 </FormControl>
//                             </Grid>
//                             <Grid item md={6} xs={12} sm={12}>
//                                 <FormControl fullWidth size="small">
//                                     <Typography variant="h6">Password</Typography>
//                                     <Typography>{singleRow.password}</Typography>
//                                 </FormControl>
//                             </Grid>
//                             <Grid item md={6} xs={12} sm={12}>
//                                 <FormControl fullWidth size="small">
//                                     <Typography variant="h6">Service</Typography>
//                                     <Typography>{singleRow.service}</Typography>
//                                 </FormControl>
//                             </Grid>
//                             <Grid item md={6} xs={12} sm={12}>
//                                 <FormControl fullWidth size="small">
//                                     <Typography variant="h6">Profile</Typography>
//                                     <Typography>{singleRow.profile}</Typography>
//                                 </FormControl>
//                             </Grid>
//                             <Grid item md={6} xs={12} sm={12}>
//                                 <FormControl fullWidth size="small">
//                                     <Typography variant="h6">Local Address</Typography>
//                                     <Typography>{singleRow.localaddress}</Typography>
//                                 </FormControl>
//                             </Grid>
//                             <Grid item md={6} xs={12} sm={12}>
//                                 <FormControl fullWidth size="small">
//                                     <Typography variant="h6">Remote Address</Typography>
//                                     <Typography>{singleRow.remoteaddress}</Typography>
//                                 </FormControl>
//                             </Grid>
//                             <Grid item md={6} xs={12} sm={12}>
//                                 <FormControl fullWidth size="small">
//                                     <Typography variant="h6">Password</Typography>
//                                     <Typography>{singleRow.password}</Typography>
//                                 </FormControl>
//                             </Grid>

//                             <Grid item md={6} xs={12} sm={12}>
//                                 <FormControl fullWidth size="small">
//                                     <Typography variant="h6">Last Logged Out</Typography>
//                                     <Typography>{singleRow.lastloggedout}</Typography>
//                                 </FormControl>
//                             </Grid>
//                             <Grid item md={6} xs={12} sm={12}>
//                                 <FormControl fullWidth size="small">
//                                     <Typography variant="h6">Last Caller ID</Typography>
//                                     <Typography>{singleRow.lastcallerid}</Typography>
//                                 </FormControl>
//                             </Grid>
//                             <Grid item md={6} xs={12} sm={12}>
//                                 <FormControl fullWidth size="small">
//                                     <Typography variant="h6">Last Disconnect Reason</Typography>
//                                     <Typography>{singleRow.lastdisconnectreason}</Typography>
//                                 </FormControl>
//                             </Grid>

//                         </Grid>
//                         <br /> <br /> <br />
//                         <Grid container spacing={2} sx={{ marginLeft: "-2px" }}>
//                             <Button
//                                 variant="contained"
//                                 sx={buttonStyles.btncancel}
//                                 onClick={handleCloseview}
//                             >
//                                 Back
//                             </Button>
//                         </Grid>
//                     </>
//                 </Box>
//             </Dialog>
//             {/* Edit DIALOG */}
//             <Box>
//                 <Dialog
//                     open={isEditOpen}
//                     onClose={handleCloseModEdit}
//                     aria-labelledby="alert-dialog-title"
//                     aria-describedby="alert-dialog-description"
//                     maxWidth="md"
//                     // sx={{
//                     //     overflow: "visible",
//                     //     "& .MuiPaper-root": {
//                     //         overflow: "visible",
//                     //     },
//                     // }}
//                     fullWidth={true}
//                 >
//                     <Box sx={{ padding: "20px 50px" }}>
//                         <>
//                             <Grid container spacing={2}>
//                                 <Typography sx={userStyle.HeaderText}>
//                                     Edit Mikrotik Secret Master
//                                 </Typography>
//                             </Grid>
//                             <br />

//                             <Grid container spacing={2}>
//                                 <Grid item md={3} xs={12} sm={6}>
//                                     <FormControl fullWidth size="small">
//                                         <Typography sx={{ color: "red", fontWeight: "bold" }}>
//                                             From Company
//                                         </Typography>
//                                         <Typography>
//                                             {filterFinal.company}
//                                         </Typography>
//                                     </FormControl>
//                                 </Grid>
//                                 <Grid item md={3} xs={12} sm={6}>
//                                     <FormControl fullWidth size="small">
//                                         <Typography sx={{ color: "red", fontWeight: "bold" }}>
//                                             From Branch
//                                         </Typography>
//                                         <Typography>
//                                             {filterFinal.branch}
//                                         </Typography>
//                                     </FormControl>
//                                 </Grid>
//                                 <Grid item md={3} xs={12} sm={6}>
//                                     <FormControl fullWidth size="small">
//                                         <Typography sx={{ color: "red", fontWeight: "bold" }}>
//                                             From Unit
//                                         </Typography>
//                                         <Typography>
//                                             {filterFinal.unit}
//                                         </Typography>
//                                     </FormControl>
//                                 </Grid>
//                                 <Grid item md={3} xs={12} sm={6}>
//                                     <FormControl fullWidth size="small">
//                                         <Typography sx={{ color: "red", fontWeight: "bold" }}>
//                                             Mikrotik Name
//                                         </Typography>
//                                         <Typography>
//                                             {filterFinal.name}
//                                         </Typography>
//                                     </FormControl>
//                                 </Grid>
//                             </Grid>
//                             <Grid container spacing={2}>
//                                 <Grid item md={4} xs={12} sm={12}>
//                                     <FormControl fullWidth size="small">
//                                         <Typography>
//                                             Company<b style={{ color: "red" }}>*</b>
//                                         </Typography>
//                                         <Selects
//                                             maxMenuHeight={300}
//                                             options={mikrotikMaster
//                                                 ?.map((data) => ({
//                                                     label: data.company,
//                                                     value: data.company,
//                                                 })).filter((item, index, self) => {
//                                                     return (
//                                                         self.findIndex(
//                                                             (i) =>
//                                                                 i.label === item.label && i.value === item.value
//                                                         ) === index
//                                                     );
//                                                 })}
//                                             value={{
//                                                 label: assetVariantEdit.company,
//                                                 value: assetVariantEdit.company,
//                                             }}
//                                             onChange={(e) => {
//                                                 setAssetVariantEdit({
//                                                     ...assetVariantEdit,
//                                                     company: e.value,
//                                                     branch: "Please Select Branch",
//                                                     unit: "Please Select Unit",
//                                                     name: "Please Select Name",
//                                                     url: "",
//                                                     username: "",
//                                                     password: "",
//                                                 });
//                                                 setSelectedTeamOptionsEdit([])
//                                                 setValueTeamEdit([])
//                                                 setEmployeeNameEdit("Please Select Employee Name")
//                                             }}
//                                         />
//                                     </FormControl>
//                                 </Grid>
//                                 <Grid item md={4} xs={12} sm={12}>
//                                     <FormControl fullWidth size="small">
//                                         <Typography>
//                                             Branch<b style={{ color: "red" }}>*</b>
//                                         </Typography>

//                                         <Selects
//                                             maxMenuHeight={300}
//                                             options={mikrotikMaster
//                                                 ?.filter((comp) =>
//                                                     assetVariantEdit.company === comp.company
//                                                 )
//                                                 ?.map((data) => ({
//                                                     label: data.branch,
//                                                     value: data.branch,
//                                                 }))
//                                                 .filter((item, index, self) => {
//                                                     return (
//                                                         self.findIndex(
//                                                             (i) =>
//                                                                 i.label === item.label &&
//                                                                 i.value === item.value
//                                                         ) === index
//                                                     );
//                                                 })}
//                                             value={{
//                                                 label: assetVariantEdit.branch,
//                                                 value: assetVariantEdit.branch,
//                                             }}
//                                             onChange={(e) => {
//                                                 setAssetVariantEdit({
//                                                     ...assetVariantEdit,
//                                                     branch: e.value,
//                                                     unit: "Please Select Unit",
//                                                     name: "Please Select Name",
//                                                     url: "",
//                                                     username: "",
//                                                     password: "",
//                                                 });
//                                                 setSelectedTeamOptionsEdit([])
//                                                 setValueTeamEdit([])
//                                                 setEmployeeNameEdit("Please Select Employee Name")
//                                             }}
//                                         />
//                                         {/* <OutlinedInput
//                                             id="component-outlined"
//                                             type="text"
//                                             value={filterFinal.branch}
//                                             readOnly
//                                         /> */}
//                                     </FormControl>
//                                 </Grid>
//                                 <Grid item md={4} xs={12} sm={12}>
//                                     <FormControl fullWidth size="small">
//                                         <Typography>
//                                             Unit<b style={{ color: "red" }}>*</b>
//                                         </Typography>
//                                         <Selects
//                                             maxMenuHeight={300}
//                                             options={mikrotikMaster
//                                                 ?.filter(
//                                                     (comp) =>
//                                                         assetVariantEdit.company === comp.company &&
//                                                         assetVariantEdit.branch === comp.branch
//                                                 )
//                                                 ?.map((data) => ({
//                                                     label: data.unit,
//                                                     value: data.unit,
//                                                 }))
//                                                 .filter((item, index, self) => {
//                                                     return (
//                                                         self.findIndex(
//                                                             (i) =>
//                                                                 i.label === item.label &&
//                                                                 i.value === item.value
//                                                         ) === index
//                                                     );
//                                                 })}
//                                             value={{
//                                                 label: assetVariantEdit.unit,
//                                                 value: assetVariantEdit.unit,
//                                             }}
//                                             onChange={(e) => {
//                                                 setAssetVariantEdit({
//                                                     ...assetVariantEdit,
//                                                     unit: e.value,
//                                                     name: "Please Select Name",
//                                                     url: "",
//                                                     username: "",
//                                                     password: "",
//                                                 });
//                                                 setSelectedTeamOptionsEdit([])
//                                                 setValueTeamEdit([])
//                                                 setEmployeeNameEdit("Please Select Employee Name")
//                                             }}
//                                         />
//                                         {/* <OutlinedInput
//                                             id="component-outlined"
//                                             type="text"
//                                             value={filterFinal.unit}
//                                             readOnly
//                                         /> */}
//                                     </FormControl>
//                                 </Grid>
//                                 <Grid item md={4} xs={12} sm={12}>
//                                     <FormControl fullWidth size="small">
//                                         <Typography>
//                                             Team<b style={{ color: "red" }}>*</b>
//                                         </Typography>
//                                         <FormControl fullWidth size="small">
//                                             <MultiSelect size="small"
//                                                 options={allTeam?.filter(
//                                                     (comp) =>
//                                                         assetVariantEdit.company === comp.company &&
//                                                         assetVariantEdit.branch === comp.branch &&
//                                                         assetVariantEdit.unit === comp.unit
//                                                 )?.map(data => ({
//                                                     label: data.teamname,
//                                                     value: data.teamname,
//                                                 })).filter((item, index, self) => {
//                                                     return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
//                                                 })}
//                                                 value={selectedTeamOptionsEdit}
//                                                 onChange={handleTeamChangeEdit}
//                                                 valueRenderer={customValueRendererTeamEdit}
//                                                 labelledBy="Please Select Team"
//                                             />
//                                         </FormControl>
//                                     </FormControl>
//                                 </Grid>
//                                 <Grid item md={4} xs={12} sm={12}>
//                                     <FormControl fullWidth size="small">
//                                         <Typography>
//                                             Employee Name<b style={{ color: "red" }}>*</b>
//                                         </Typography>
//                                         <FormControl fullWidth size="small">
//                                             <Selects
//                                                 maxMenuHeight={300}

//                                                 options={allUsersData?.filter(
//                                                     (comp) =>
//                                                         assetVariantEdit.company === comp.company &&
//                                                         assetVariantEdit.branch === comp.branch &&
//                                                         assetVariantEdit.unit === comp.unit && selectedTeamOptionsEdit
//                                                             .map((item) => item.value)
//                                                             .includes(comp.team) && !teamsArray?.filter(data => data?.username !== assetVariantEdit?.username)
//                                                                 .map((item) => item.username)
//                                                                 .includes(comp.username)
//                                                 )?.map(data => ({
//                                                     ...data,
//                                                     username: data.username,

//                                                     label: data.companyname,
//                                                     value: data.companyname,
//                                                 })).filter((item, index, self) => {
//                                                     return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
//                                                 })}

//                                                 value={{ value: employeeNameEdit, label: employeeNameEdit }}
//                                                 onChange={(e) => {
//                                                     setEmployeeNameEdit(e.value);
//                                                     const password = autoGenerateTempPasswordEdit(e.username, filterFinal.name, assetVariantEdit.service, assetVariantEdit?.remoteaddress)
//                                                     setAssetVariantEdit({
//                                                         ...assetVariantEdit,
//                                                         username: e.username,
//                                                         password: password,
//                                                         autogenerate: true,
//                                                         livepassword: password
//                                                     });
//                                                 }}
//                                             />
//                                         </FormControl>
//                                     </FormControl>
//                                 </Grid>
//                                 <Grid item md={4} xs={12} sm={12}>
//                                     <FormControl fullWidth size="small">
//                                         <Typography>
//                                             Name<b style={{ color: "red" }}>*</b>
//                                         </Typography>
//                                         <OutlinedInput
//                                             id="component-outlined"
//                                             type="text"
//                                             placeholder="Please Enter Name"
//                                             value={assetVariantEdit.username}
//                                             readOnly
//                                         // onChange={(e) => {
//                                         //     setAssetVariantEdit({
//                                         //         ...assetVariantEdit,
//                                         //         username: e.target.value,
//                                         //     });
//                                         // }}
//                                         />
//                                     </FormControl>
//                                 </Grid>

//                                 <Grid item md={3} xs={12} sm={12}>
//                                     <FormControl fullWidth size="small">
//                                         <Typography>
//                                             Service<b style={{ color: "red" }}>*</b>
//                                         </Typography>
//                                         <Selects
//                                             maxMenuHeight={300}
//                                             options={serviceOptions}
//                                             value={{
//                                                 label: assetVariantEdit.service,
//                                                 value: assetVariantEdit.service,
//                                             }}
//                                             onChange={(e) => {
//                                                 const password = autoGenerateTempPasswordEdit(assetVariantEdit.username, filterFinal.name, e.value, assetVariantEdit?.remoteaddress)

//                                                 setAssetVariantEdit({
//                                                     ...assetVariantEdit,
//                                                     service: e.value,
//                                                     password: password,
//                                                     autogenerate: true,
//                                                     livepassword: password
//                                                 });
//                                             }}
//                                         />
//                                     </FormControl>
//                                 </Grid>
//                                 <Grid item md={3} xs={12} sm={12}>
//                                     <FormControl fullWidth size="small">
//                                         <Typography>
//                                             Profile<b style={{ color: "red" }}>*</b>
//                                         </Typography>
//                                         <Selects
//                                             maxMenuHeight={200}
//                                             options={profileOptions}
//                                             value={{
//                                                 label: assetVariantEdit.profile || "Please Select Profile",
//                                                 value: assetVariantEdit.profile || "Please Select Profile",
//                                             }}
//                                             onChange={(e) => {
//                                                 const answer = handleLocalAddress(e.localaddress);
//                                                 setLocalAddressBooleanEdit(answer ? true : false)
//                                                 handleRemoteAddressEdit(e, remoteAddressString)
//                                                 setAssetVariantEdit({
//                                                     ...assetVariantEdit,
//                                                     profile: e.value,
//                                                     localaddress: answer ? answer : e.localaddress,
//                                                     remoteaddress: ""
//                                                 });
//                                             }}
//                                         />
//                                     </FormControl>
//                                 </Grid>
//                                 <Grid item md={3} xs={12} sm={12}>
//                                     <FormControl fullWidth size="small">
//                                         <Typography>
//                                             Local Address<b style={{ color: "red" }}>*</b>
//                                         </Typography>
//                                         {localAddressBooleanEdit === false ? <Selects
//                                             maxMenuHeight={200}
//                                             options={localAddressesEdit?.map(data => ({
//                                                 label: data,
//                                                 value: data,

//                                             }))}
//                                             value={{ value: assetVariantEdit?.localaddress, label: assetVariantEdit?.localaddress }}
//                                             onChange={(e) => {
//                                                 setAssetVariantEdit({
//                                                     ...assetVariantEdit,
//                                                     localaddress: e.value,
//                                                 });
//                                             }}
//                                         /> : <OutlinedInput
//                                             id="component-outlined"
//                                             type="text"
//                                             placeholder="Please Enter Local Address"
//                                             value={assetVariantEdit.localaddress}
//                                             readOnly
//                                         />}
//                                     </FormControl>
//                                 </Grid>
//                                 <Grid item md={3} xs={12} sm={12}>
//                                     <FormControl fullWidth size="small">
//                                         <Typography>
//                                             Remote Address
//                                         </Typography>
//                                         {remoteAddressEdit?.length > 0 ? <Selects
//                                             maxMenuHeight={200}
//                                             options={remoteAddressEdit?.map(data => ({
//                                                 label: data,
//                                                 value: data,

//                                             }))}
//                                             value={{ value: assetVariantEdit?.remoteaddress, label: assetVariantEdit?.remoteaddress }}
//                                             onChange={(e) => {
//                                                 const password = autoGenerateTempPasswordEdit(assetVariantEdit.username, filterFinal.name, assetVariantEdit.service, e.value)

//                                                 setAssetVariantEdit({
//                                                     ...assetVariantEdit,
//                                                     remoteaddress: e.value,
//                                                     password: password,
//                                                     autogenerate: true,
//                                                     livepassword: password
//                                                 });
//                                             }}
//                                         /> :
//                                             <OutlinedInput
//                                                 id="component-outlined"
//                                                 type="text"
//                                                 placeholder="Please Enter Remote Address"
//                                                 value={assetVariantEdit.remoteaddress}
//                                                 onChange={(e) => {
//                                                     const inputValue = e.target.value;
//                                                     if (ipRegex.test(inputValue) && inputValue?.length <= 15) {
//                                                         const password = autoGenerateTempPasswordEdit(assetVariantEdit.username, filterFinal.name, assetVariantEdit.service, inputValue)
//                                                         setAssetVariantEdit({
//                                                             ...assetVariantEdit,
//                                                             remoteaddress: inputValue,
//                                                             password: password,
//                                                             autogenerate: true,
//                                                             livepassword: password
//                                                         });
//                                                     }
//                                                 }}
//                                             />
//                                         }
//                                     </FormControl>
//                                 </Grid>
//                                 <Grid item md={4} xs={12} sm={12}>
//                                     <FormControl fullWidth size="small">
//                                         <Typography>
//                                             Temp Password<b style={{ color: "red" }}>*</b>
//                                         </Typography>
//                                         <OutlinedInput
//                                             placeholder="Please Enter Password"
//                                             id="outlined-adornment-password"
//                                             type={assetVariantEdit?.showpassword ? "text" : "password"}
//                                             value={assetVariantEdit?.autogenerate ? autoGenPasswordEdit : assetVariantEdit.password}
//                                             onChange={(e) => {
//                                                 setAssetVariantEdit({
//                                                     ...assetVariantEdit,
//                                                     password: e.target.value,
//                                                 });
//                                             }}
//                                             endAdornment={
//                                                 <InputAdornment position="end">
//                                                     <IconButton
//                                                         aria-label="toggle password visibility"
//                                                         onMouseDown={(event) => {
//                                                             event.preventDefault();
//                                                         }}
//                                                         onClick={(e) => {

//                                                             setAssetVariantEdit({
//                                                                 ...assetVariantEdit,
//                                                                 showpassword: !assetVariantEdit?.showpassword,
//                                                             });
//                                                         }}
//                                                         edge="end"
//                                                     >
//                                                         {!assetVariantEdit.showpassword ? (
//                                                             <VisibilityOff sx={{ fontSize: "25px" }} />
//                                                         ) : (
//                                                             <Visibility sx={{ fontSize: "25px" }} />
//                                                         )}
//                                                     </IconButton>
//                                                 </InputAdornment>
//                                             }
//                                         />
//                                     </FormControl>
//                                     <Grid>
//                                         <FormGroup>
//                                             <FormControlLabel
//                                                 control={
//                                                     <Checkbox checked={assetVariantEdit.autogenerate} />
//                                                 }
//                                                 onChange={(e) => {
//                                                     console.log(!assetVariantEdit?.autogenerate, '!assetVariantEdit?.autogenerate')
//                                                     if (!assetVariantEdit?.autogenerate) {
//                                                         const password = autoGenerateTempPasswordEdit(assetVariantEdit.username, filterFinal.name, assetVariantEdit.service, assetVariantEdit?.remoteaddress);
//                                                         setAssetVariantEdit({
//                                                             ...assetVariantEdit,
//                                                             password: password,
//                                                             autogenerate: true,
//                                                             livepassword: password
//                                                         });
//                                                     }

//                                                     setAssetVariantEdit({
//                                                         ...assetVariantEdit,
//                                                         autogenerate: !assetVariantEdit.autogenerate,
//                                                     })
//                                                 }

//                                                 }
//                                                 label="Auto Generate"
//                                             />
//                                         </FormGroup>
//                                     </Grid>
//                                 </Grid>
//                                 <Grid item md={4} xs={12} sm={12}>
//                                     <FormControl fullWidth size="small">
//                                         <Typography>
//                                             Live Password<b style={{ color: "red" }}>*</b>
//                                         </Typography>
//                                         <OutlinedInput
//                                             placeholder="Please Enter Password"
//                                             id="outlined-adornment-password"
//                                             type={assetVariantEdit?.showlivepassword ? "text" : "password"}
//                                             value={assetVariantEdit.livepassword}
//                                             onChange={(e) => {
//                                                 setAssetVariantEdit({
//                                                     ...assetVariantEdit,
//                                                     livepassword: e.target.value,
//                                                 });
//                                             }}
//                                             endAdornment={
//                                                 <InputAdornment position="end">
//                                                     <IconButton
//                                                         aria-label="toggle password visibility"
//                                                         onMouseDown={(event) => {
//                                                             event.preventDefault();
//                                                         }}
//                                                         onClick={(e) => {
//                                                             setAssetVariantEdit({
//                                                                 ...assetVariantEdit,
//                                                                 showlivepassword: !assetVariantEdit?.showlivepassword,
//                                                             });
//                                                         }}
//                                                         edge="end"
//                                                     >
//                                                         {!assetVariantEdit.showlivepassword ? (
//                                                             <VisibilityOff sx={{ fontSize: "25px" }} />
//                                                         ) : (
//                                                             <Visibility sx={{ fontSize: "25px" }} />
//                                                         )}
//                                                     </IconButton>
//                                                 </InputAdornment>
//                                             }
//                                         />
//                                     </FormControl>
//                                 </Grid>
//                             </Grid>
//                             <br /> <br />
//                             <Grid
//                                 container
//                                 spacing={2}
//                                 sx={{
//                                     display: "flex",
//                                     justifyContent: "center",
//                                     alignItems: "center",
//                                 }}
//                             >
//                                 <Grid item md={3} xs={12} sm={12}>
//                                     <Button
//                                         variant="contained"
//                                         onClick={editSubmit}
//                                         sx={buttonStyles.buttonsubmit}
//                                     >
//                                         {" "}
//                                         Update
//                                     </Button>
//                                 </Grid>
//                                 <br />
//                                 <Grid item md={3} xs={12} sm={12}>
//                                     <Button
//                                         sx={buttonStyles.btncancel}
//                                         onClick={handleCloseModEdit}
//                                     >
//                                         {" "}
//                                         Cancel{" "}
//                                     </Button>
//                                 </Grid>
//                             </Grid>
//                         </>
//                     </Box>
//                 </Dialog>
//             </Box>
//             {/* ADD DIALOG */}
//             <Box>
//                 <Dialog
//                     open={isAddOpen}
//                     onClose={handleCloseModAdd}
//                     aria-labelledby="alert-dialog-title"
//                     aria-describedby="alert-dialog-description"
//                     maxWidth="md"
//                     sx={{
//                         overflow: "auto",
//                         "& .MuiPaper-root": {
//                             overflow: "auto",
//                         },
//                         marginTop: "80px"
//                     }}

//                     fullWidth={true}
//                 >
//                     <Box sx={{ padding: "20px 50px" }}>
//                         <>
//                             <Grid container spacing={2}>
//                                 <Typography sx={userStyle.HeaderText}>
//                                     Add Mikrotik PPP Secret
//                                 </Typography>
//                             </Grid>
//                             <br />
//                             <Grid container spacing={2}>
//                                 <Grid item md={3} xs={12} sm={6}>
//                                     <FormControl fullWidth size="small">
//                                         <Typography sx={{ color: "red", fontWeight: "bold" }}>
//                                             From Company
//                                         </Typography>
//                                         <Typography>
//                                             {filterFinal.company}
//                                         </Typography>
//                                     </FormControl>
//                                 </Grid>
//                                 <Grid item md={3} xs={12} sm={6}>
//                                     <FormControl fullWidth size="small">
//                                         <Typography sx={{ color: "red", fontWeight: "bold" }}>
//                                             From Branch
//                                         </Typography>
//                                         <Typography>
//                                             {filterFinal.branch}
//                                         </Typography>
//                                     </FormControl>
//                                 </Grid>
//                                 <Grid item md={3} xs={12} sm={6}>
//                                     <FormControl fullWidth size="small">
//                                         <Typography sx={{ color: "red", fontWeight: "bold" }}>
//                                             From Unit
//                                         </Typography>
//                                         <Typography>
//                                             {filterFinal.unit}
//                                         </Typography>
//                                     </FormControl>
//                                 </Grid>
//                                 <Grid item md={3} xs={12} sm={6}>
//                                     <FormControl fullWidth size="small">
//                                         <Typography sx={{ color: "red", fontWeight: "bold" }}>
//                                             Mikrotik Name
//                                         </Typography>
//                                         <Typography>
//                                             {filterFinal.name}
//                                         </Typography>
//                                     </FormControl>
//                                 </Grid>
//                             </Grid>
//                             <Grid container spacing={2}>
//                                 <Grid item md={4} xs={12} sm={12}>
//                                     <FormControl fullWidth size="small">
//                                         <Typography>
//                                             Company<b style={{ color: "red" }}>*</b>
//                                         </Typography>
//                                         <Selects
//                                             maxMenuHeight={300}
//                                             options={mikrotikMaster
//                                                 ?.map((data) => ({
//                                                     label: data.company,
//                                                     value: data.company,
//                                                 })).filter((item, index, self) => {
//                                                     return (
//                                                         self.findIndex(
//                                                             (i) =>
//                                                                 i.label === item.label && i.value === item.value
//                                                         ) === index
//                                                     );
//                                                 })}
//                                             value={{
//                                                 label: assetVariant.company,
//                                                 value: assetVariant.company,
//                                             }}
//                                             onChange={(e) => {
//                                                 setAssetVariant({
//                                                     ...assetVariant,
//                                                     company: e.value,
//                                                     branch: "Please Select Branch",
//                                                     unit: "Please Select Unit",
//                                                     name: "Please Select Name",
//                                                     url: "",
//                                                     username: "",
//                                                     password: "",
//                                                     livepassword: "",
//                                                     autogenerate: false
//                                                 });
//                                                 setAutoGenPassword("")
//                                                 setSelectedTeamOptions([])
//                                                 setValueTeam([])
//                                                 setEmployeeName("Please Select Employee Name")
//                                             }}
//                                         />
//                                     </FormControl>
//                                 </Grid>
//                                 <Grid item md={4} xs={12} sm={12}>
//                                     <FormControl fullWidth size="small">
//                                         <Typography>
//                                             Branch<b style={{ color: "red" }}>*</b>
//                                         </Typography>
//                                         <Selects
//                                             maxMenuHeight={300}
//                                             options={mikrotikMaster
//                                                 ?.filter((comp) =>
//                                                     assetVariant.company === comp.company
//                                                 )
//                                                 ?.map((data) => ({
//                                                     label: data.branch,
//                                                     value: data.branch,
//                                                 }))
//                                                 .filter((item, index, self) => {
//                                                     return (
//                                                         self.findIndex(
//                                                             (i) =>
//                                                                 i.label === item.label &&
//                                                                 i.value === item.value
//                                                         ) === index
//                                                     );
//                                                 })}
//                                             value={{
//                                                 label: assetVariant.branch,
//                                                 value: assetVariant.branch,
//                                             }}
//                                             onChange={(e) => {
//                                                 setAssetVariant({
//                                                     ...assetVariant,
//                                                     branch: e.value,
//                                                     unit: "Please Select Unit",
//                                                     name: "Please Select Name",
//                                                     url: "",
//                                                     username: "",
//                                                     password: "",
//                                                     livepassword: "",
//                                                     autogenerate: false
//                                                 });
//                                                 setAutoGenPassword("")
//                                                 setSelectedTeamOptions([])
//                                                 setValueTeam([])
//                                                 setEmployeeName("Please Select Employee Name")
//                                             }}
//                                         />
//                                         {/* <OutlinedInput
//                                             id="component-outlined"
//                                             type="text"
//                                             value={filterFinal.branch}
//                                             readOnly
//                                         /> */}
//                                     </FormControl>
//                                 </Grid>
//                                 <Grid item md={4} xs={12} sm={12}>
//                                     <FormControl fullWidth size="small">
//                                         <Typography>
//                                             Unit<b style={{ color: "red" }}>*</b>
//                                         </Typography>
//                                         <Selects
//                                             maxMenuHeight={300}
//                                             options={mikrotikMaster
//                                                 ?.filter(
//                                                     (comp) =>
//                                                         assetVariant.company === comp.company &&
//                                                         assetVariant.branch === comp.branch
//                                                 )
//                                                 ?.map((data) => ({
//                                                     label: data.unit,
//                                                     value: data.unit,
//                                                 }))
//                                                 .filter((item, index, self) => {
//                                                     return (
//                                                         self.findIndex(
//                                                             (i) =>
//                                                                 i.label === item.label &&
//                                                                 i.value === item.value
//                                                         ) === index
//                                                     );
//                                                 })}
//                                             value={{
//                                                 label: assetVariant.unit,
//                                                 value: assetVariant.unit,
//                                             }}
//                                             onChange={(e) => {
//                                                 setAssetVariant({
//                                                     ...assetVariant,
//                                                     unit: e.value,
//                                                     name: "Please Select Name",
//                                                     url: "",
//                                                     username: "",
//                                                     password: "",
//                                                     livepassword: "",
//                                                     autogenerate: false
//                                                 });
//                                                 setAutoGenPassword("")
//                                                 setSelectedTeamOptions([])
//                                                 setValueTeam([])
//                                                 setEmployeeName("Please Select Employee Name")
//                                             }}
//                                         />
//                                         {/* <OutlinedInput
//                                             id="component-outlined"
//                                             type="text"
//                                             value={filterFinal.unit}
//                                             readOnly
//                                         /> */}
//                                     </FormControl>
//                                 </Grid>
//                                 <Grid item md={4} xs={12} sm={12}>
//                                     <FormControl fullWidth size="small">
//                                         <Typography>
//                                             Team<b style={{ color: "red" }}>*</b>
//                                         </Typography>
//                                         <FormControl fullWidth size="small">
//                                             <MultiSelect size="small"
//                                                 options={allTeam?.filter(
//                                                     (comp) =>
//                                                         assetVariant.company === comp.company &&
//                                                         assetVariant.branch === comp.branch &&
//                                                         assetVariant.unit === comp.unit
//                                                 )?.map(data => ({
//                                                     label: data.teamname,
//                                                     value: data.teamname,
//                                                 })).filter((item, index, self) => {
//                                                     return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
//                                                 })}
//                                                 value={selectedTeamOptions}
//                                                 onChange={handleTeamChange}
//                                                 valueRenderer={customValueRendererTeam}
//                                                 labelledBy="Please Select Team"
//                                             />
//                                         </FormControl>
//                                     </FormControl>
//                                 </Grid>
//                                 <Grid item md={4} xs={12} sm={12}>
//                                     <FormControl fullWidth size="small">
//                                         <Typography>
//                                             Employee Name<b style={{ color: "red" }}>*</b>
//                                         </Typography>
//                                         <FormControl fullWidth size="small">

//                                             <Selects
//                                                 maxMenuHeight={300}
//                                                 options={allUsersData?.filter(
//                                                     (comp) =>
//                                                         assetVariant.company === comp.company &&
//                                                         assetVariant.branch === comp.branch &&
//                                                         assetVariant.unit === comp.unit && selectedTeamOptions
//                                                             .map((item) => item.value)
//                                                             .includes(comp.team)
//                                                         && !matchedSecrets?.map((item) => item.name)
//                                                             .includes(comp.username)
//                                                 )?.map(data => ({
//                                                     ...data,
//                                                     username: data.username,

//                                                     label: data.companyname,
//                                                     value: data.companyname,
//                                                 })).filter((item, index, self) => {
//                                                     return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
//                                                 })}
//                                                 value={{ value: employeeName, label: employeeName }}
//                                                 onChange={(e) => {
//                                                     setEmployeeName(e.value);
//                                                     const password = autoGenerateTempPassword(e.username, filterFinal.name, assetVariant.service, assetVariant?.remoteaddress)
//                                                     setAssetVariant({
//                                                         ...assetVariant,
//                                                         username: e.username,
//                                                         password: password,
//                                                         autogenerate: true,
//                                                         livepassword: password
//                                                     });
//                                                 }}
//                                             />
//                                         </FormControl>
//                                     </FormControl>
//                                 </Grid>
//                                 <Grid item md={4} xs={12} sm={12}>
//                                     <FormControl fullWidth size="small">
//                                         <Typography>
//                                             Name<b style={{ color: "red" }}>*</b>
//                                         </Typography>
//                                         <OutlinedInput
//                                             id="component-outlined"
//                                             type="text"
//                                             placeholder="Please Enter Name"
//                                             value={assetVariant.username}
//                                             readOnly
//                                         />
//                                     </FormControl>
//                                 </Grid>
//                                 <Grid item md={3} xs={12} sm={12}>
//                                     <FormControl fullWidth size="small">
//                                         <Typography>
//                                             Service<b style={{ color: "red" }}>*</b>
//                                         </Typography>
//                                         <Selects
//                                             maxMenuHeight={300}
//                                             options={serviceOptions}
//                                             value={{
//                                                 label: assetVariant.service,
//                                                 value: assetVariant.service,
//                                             }}
//                                             onChange={(e) => {
//                                                 const password = autoGenerateTempPassword(assetVariant?.username, filterFinal.name, e.value, assetVariant?.remoteaddress)

//                                                 setAssetVariant({
//                                                     ...assetVariant,
//                                                     service: e.value,
//                                                     password: password,
//                                                     autogenerate: true,
//                                                     livepassword: password
//                                                 });

//                                             }}
//                                         />
//                                     </FormControl>
//                                 </Grid>
//                                 <Grid item md={3} xs={12} sm={12}>
//                                     <FormControl fullWidth size="small">
//                                         <Typography>
//                                             Profile<b style={{ color: "red" }}>*</b>
//                                         </Typography>
//                                         <Selects
//                                             maxMenuHeight={300}
//                                             options={profileOptions}
//                                             value={{
//                                                 label: assetVariant.profile || "Please Select Profile",
//                                                 value: assetVariant.profile || "Please Select Profile",
//                                             }}
//                                             onChange={(e) => {

//                                                 const answer = handleLocalAddress(e.localaddress);
//                                                 setLocalAddressBoolean(answer ? true : false)

//                                                 handleRemoteAddress(e)
//                                                 setAssetVariant({
//                                                     ...assetVariant,
//                                                     profile: e.value,
//                                                     localaddress: answer ? answer : e.localaddress,
//                                                     remoteaddress: ""

//                                                 });
//                                             }}
//                                         />
//                                     </FormControl>
//                                 </Grid>
//                                 <Grid item md={3} xs={12} sm={12}>
//                                     <FormControl fullWidth size="small">
//                                         <Typography>
//                                             Local Address<b style={{ color: "red" }}>*</b>
//                                         </Typography>
//                                         {localAddressBoolean === false ? <Selects
//                                             maxMenuHeight={200}
//                                             options={localAddresses?.map(data => ({
//                                                 label: data,
//                                                 value: data,

//                                             }))}
//                                             value={{ value: assetVariant?.localaddress, label: assetVariant?.localaddress }}
//                                             onChange={(e) => {
//                                                 setAssetVariant({
//                                                     ...assetVariant,
//                                                     localaddress: e.value,
//                                                 });
//                                             }}
//                                         /> : <OutlinedInput
//                                             id="component-outlined"
//                                             type="text"
//                                             placeholder="Please Enter Local Address"
//                                             value={assetVariant.localaddress}
//                                             readOnly
//                                         />}
//                                     </FormControl>
//                                 </Grid>
//                                 <Grid item md={3} xs={12} sm={12}>
//                                     <FormControl fullWidth size="small">
//                                         <Typography>
//                                             Remote Address<b style={{ color: "red" }}>*</b>
//                                         </Typography>
//                                         {remoteAddress?.length > 0 ? <Selects
//                                             maxMenuHeight={200}
//                                             options={remoteAddress?.map(data => ({
//                                                 label: data,
//                                                 value: data,

//                                             }))}
//                                             value={{ value: assetVariant?.remoteaddress, label: assetVariant?.remoteaddress }}
//                                             onChange={(e) => {
//                                                 const password = autoGenerateTempPassword(assetVariant?.username, filterFinal.name, assetVariant.service, e.value)
//                                                 setAssetVariant({
//                                                     ...assetVariant,
//                                                     remoteaddress: e.value,
//                                                     password: password,
//                                                     autogenerate: true,
//                                                     livepassword: password
//                                                 });
//                                             }}
//                                         /> :
//                                             <OutlinedInput
//                                                 id="component-outlined"
//                                                 type="text"
//                                                 placeholder="Please Enter Remote Address"
//                                                 value={assetVariant.remoteaddress}
//                                                 onChange={(e) => {
//                                                     const inputValue = e.target.value;
//                                                     if (ipRegex.test(inputValue) && inputValue?.length <= 15) {
//                                                         const password = autoGenerateTempPassword(assetVariant?.username, filterFinal.name, assetVariant.service, inputValue)
//                                                         setAssetVariant({
//                                                             ...assetVariant,
//                                                             remoteaddress: inputValue,
//                                                             password: password,
//                                                             autogenerate: true,
//                                                             livepassword: password
//                                                         });
//                                                     }
//                                                 }}
//                                             />}
//                                     </FormControl>
//                                 </Grid>
//                                 <Grid item md={4} xs={12} sm={12}>
//                                     <FormControl fullWidth size="small">
//                                         <Typography>
//                                             Temp Password<b style={{ color: "red" }}>*</b>
//                                         </Typography>
//                                         <OutlinedInput
//                                             placeholder="Please Enter Password"
//                                             id="outlined-adornment-password"
//                                             type={assetVariant?.showpassword ? "text" : "password"}
//                                             value={assetVariant?.autogenerate ? autoGenPassword : assetVariant.password}
//                                             onChange={(e) => {
//                                                 setAssetVariant({
//                                                     ...assetVariant,
//                                                     password: e.target.value,

//                                                 });
//                                             }}
//                                             endAdornment={
//                                                 <InputAdornment position="end">
//                                                     <IconButton
//                                                         aria-label="toggle password visibility"
//                                                         onMouseDown={(event) => {
//                                                             event.preventDefault();
//                                                         }}
//                                                         onClick={(e) => {
//                                                             setAssetVariant({
//                                                                 ...assetVariant,
//                                                                 showpassword: !assetVariant?.showpassword,
//                                                             });
//                                                         }}
//                                                         edge="end"
//                                                     >
//                                                         {!assetVariant.showpassword ? (
//                                                             <VisibilityOff sx={{ fontSize: "25px" }} />
//                                                         ) : (
//                                                             <Visibility sx={{ fontSize: "25px" }} />
//                                                         )}
//                                                     </IconButton>
//                                                 </InputAdornment>
//                                             }
//                                         />
//                                     </FormControl>
//                                     <Grid>
//                                         <FormGroup>
//                                             <FormControlLabel
//                                                 control={
//                                                     <Checkbox checked={assetVariant.autogenerate} />
//                                                 }
//                                                 onChange={(e) =>
//                                                     setAssetVariant({
//                                                         ...assetVariant,
//                                                         autogenerate: !assetVariant.autogenerate,
//                                                     })
//                                                 }
//                                                 label="Auto Generate"
//                                             />
//                                         </FormGroup>
//                                     </Grid>
//                                 </Grid>
//                                 <Grid item md={4} xs={12} sm={12}>
//                                     <FormControl fullWidth size="small">
//                                         <Typography>
//                                             Live Password<b style={{ color: "red" }}>*</b>
//                                         </Typography>
//                                         <OutlinedInput
//                                             placeholder="Please Enter Password"
//                                             id="outlined-adornment-password"
//                                             type={assetVariant?.showlivepassword ? "text" : "password"}
//                                             value={assetVariant.livepassword}
//                                             onChange={(e) => {
//                                                 setAssetVariant({
//                                                     ...assetVariant,
//                                                     livepassword: e.target.value,
//                                                 });
//                                             }}
//                                             endAdornment={
//                                                 <InputAdornment position="end">
//                                                     <IconButton
//                                                         aria-label="toggle password visibility"
//                                                         onMouseDown={(event) => {
//                                                             event.preventDefault();
//                                                         }}
//                                                         onClick={(e) => {
//                                                             setAssetVariant({
//                                                                 ...assetVariant,
//                                                                 showlivepassword: !assetVariant?.showlivepassword,
//                                                             });
//                                                         }}
//                                                         edge="end"
//                                                     >
//                                                         {!assetVariant.showlivepassword ? (
//                                                             <VisibilityOff sx={{ fontSize: "25px" }} />
//                                                         ) : (
//                                                             <Visibility sx={{ fontSize: "25px" }} />
//                                                         )}
//                                                     </IconButton>
//                                                 </InputAdornment>
//                                             }
//                                         />
//                                     </FormControl>
//                                 </Grid>
//                             </Grid>

//                             <br /> <br />
//                             <Grid
//                                 container
//                                 spacing={2}
//                                 sx={{
//                                     display: "flex",
//                                     justifyContent: "center",
//                                     alignItems: "center",
//                                 }}
//                             >
//                                 <Grid item md={3} xs={12} sm={12}>
//                                     <Button
//                                         variant="contained"
//                                         onClick={handleSubmit}
//                                         sx={buttonStyles.buttonsubmit}
//                                     >
//                                         {" "}
//                                         Submit
//                                     </Button>
//                                 </Grid>
//                                 <br />
//                                 <Grid item md={3} xs={12} sm={12}>
//                                     <Button
//                                         sx={buttonStyles.btncancel}
//                                         onClick={handleCloseModAdd}
//                                     >
//                                         {" "}
//                                         Cancel{" "}
//                                     </Button>
//                                 </Grid>
//                             </Grid>
//                         </>
//                     </Box>
//                 </Dialog>
//             </Box>
//             <br />
//             {/* EXTERNAL COMPONENTS -------------- START */}
//             {/* VALIDATION */}
//             <MessageAlert
//                 openPopup={openPopupMalert}
//                 handleClosePopup={handleClosePopupMalert}
//                 popupContent={popupContentMalert}
//                 popupSeverity={popupSeverityMalert}
//             />
//             {/* SUCCESS */}
//             <AlertDialog
//                 openPopup={openPopup}
//                 handleClosePopup={handleClosePopup}
//                 popupContent={popupContent}
//                 popupSeverity={popupSeverity}
//             />
//             {/* PRINT PDF EXCEL CSV */}
//             <ExportData
//                 isFilterOpen={isFilterOpen}
//                 handleCloseFilterMod={handleCloseFilterMod}
//                 fileFormat={fileFormat}
//                 setIsFilterOpen={setIsFilterOpen}
//                 isPdfFilterOpen={isPdfFilterOpen}
//                 setIsPdfFilterOpen={setIsPdfFilterOpen}
//                 handleClosePdfFilterMod={handleClosePdfFilterMod}
//                 filteredDataTwo={filteredData ?? []}
//                 itemsTwo={items ?? []}
//                 filename={"Mikrotik PPP Secrets"}
//                 exportColumnNames={exportColumnNames}
//                 exportRowValues={exportRowValues}
//                 componentRef={componentRef}
//             />
//             {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
//             <DeleteConfirmation
//                 open={isDeleteOpen}
//                 onClose={handleCloseMod}
//                 onConfirm={deleteTeam}
//                 title="Are you sure?"
//                 confirmButtonText="Yes"
//                 cancelButtonText="Cancel"
//             />
//             <InfoPopup
//                 openInfo={openInfo}
//                 handleCloseinfo={handleCloseinfo}
//                 heading="Mikrotik PPP Secrets Info"
//                 addedby={singleRow?.addedby}
//                 updateby={singleRow?.updatedby}
//             />

//             {/* EXTERNAL COMPONENTS -------------- END */}
//         </Box>
//     );
// }

// export default PppSecrets;

import CloseIcon from "@mui/icons-material/Close";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { MultiSelect } from "react-multi-select-component";
import moment from "moment";
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Popover,
    Select,
    TextField,
    Typography,
    FormGroup,
    FormControlLabel,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import AlertDialog from "../../../components/Alert.js";
import { DeleteConfirmation } from "../../../components/DeleteConfirmation.js";
import { handleApiError } from "../../../components/Errorhandling.js";
import ExportData from "../../../components/ExportData.js";
import Headtitle from "../../../components/Headtitle.js";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert.js";
import PageHeading from "../../../components/PageHeading.js";
import StyledDataGrid from "../../../components/TableStyle.js";
import { UserRoleAccessContext } from "../../../context/Appcontext.js";
import { AuthContext } from "../../../context/Appcontext.js";
import { userStyle } from "../../../pageStyle.js";
import { SERVICE } from "../../../services/Baseservice.js";
import PppUnmatchedSecrets from "./PppUnmatchedSecrets.js"
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
function PppSecrets() {
    //FILTER START
    const [interval, setInterval] = useState(1000);
    const [filterApplied, setFilterApplied] = useState(false);
    const [mikrotikMaster, setMikrotikMaster] = useState([])
    const [selectedTeamOptions, setSelectedTeamOptions] = useState([]);
    const [selectedTeamOptionsEdit, setSelectedTeamOptionsEdit] = useState([])
    const [valueTeam, setValueTeam] = useState([])
    const [valueTeamEdit, setValueTeamEdit] = useState([]);
    const [employeeName, setEmployeeName] = useState("Please Select Employee Name");
    const [empNameRestrict, setEmpNameRestrict] = useState([]);
    const [employeeNameEdit, setEmployeeNameEdit] = useState("Please Select Employee Name");
    const [autoGenPassword, setAutoGenPassword] = useState("");
    const [autoGenPasswordEdit, setAutoGenPasswordEdit] = useState("");
    const [changes, setChanges] = useState("");
    const [teamsArray, setTeamsArray] = useState([]);
    const [matchedSecrets, setMatchedSecrets] = useState([]);
    const [ipPools, setIpPools] = useState([]);
    const [localAddressBoolean, setLocalAddressBoolean] = useState(false);
    const [localAddressBooleanEdit, setLocalAddressBooleanEdit] = useState(false);
    const [remoteAddressString, setRemoteAddressString] = useState("");
    const [mikrotikName, setMikrotikName] = useState("");
    const [remoteAddress, setRemoteAddress] = useState([])
    const [localAddresses, setLocalAddresses] = useState([])
    const [localAddressesEdit, setLocalAddressesEdit] = useState([])
    const [remoteAddressEdit, setRemoteAddressEdit] = useState([])

    function isIPAddress(str) {
        const ipRegex = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;
        return ipRegex.test(str);
    }

    function capitalizeFirstAndLast(str) {
        if (!str) return ""; // Handle empty or null strings
        if (str.length === 1) return str.toUpperCase(); // Single-character strings
        return str[0].toUpperCase() + str.slice(1, -1) + str[str.length - 1].toUpperCase();
    }

    const autoGenerateTempPassword = (data, mikname, service, remote) => {
        const remoteName = isIPAddress(remote) ? remote.split(".").at(-1) : "";
        const mikrotikName = mikname?.slice(-2) || "";
        const serviceName = service?.charAt(0) || "";
        const nameAbbreviation = data || "";

        // Exclude remoteName if isIPAddress(remote) is false
        let temppassword = `${nameAbbreviation}@${mikrotikName}${serviceName}`;
        if (isIPAddress(remote)) {
            temppassword += remoteName;
        }

        let finalTrimmedPassword = temppassword;

        if (temppassword?.length > 15) {
            const excessLength = temppassword.length - 15;
            const trimmedName = nameAbbreviation.slice(0, nameAbbreviation.length - excessLength);
            finalTrimmedPassword = capitalizeFirstAndLast(trimmedName) + `@${mikrotikName}${serviceName}`;
            if (isIPAddress(remote)) {
                finalTrimmedPassword += remoteName;
            }
        } else {
            finalTrimmedPassword = capitalizeFirstAndLast(nameAbbreviation) + `@${mikrotikName}${serviceName}`;
            if (isIPAddress(remote)) {
                finalTrimmedPassword += remoteName;
            }
        }
        setAutoGenPassword(finalTrimmedPassword);


        return finalTrimmedPassword;
    };



    const handleLocalAddress = (e) => {
        const localaddress = e;
        const ipRegex = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;
        if (typeof localaddress === "string" && ipRegex.test(localaddress)) {
            return localaddress;
        }
        return null;
    }


    const handleRemoteAddress = (value) => {

        const ipPoolsFilter = ipPools?.find(data => data?.name === value["remote-address"]);
        const localaddress = (value?.localaddress === undefined || value?.localaddress === "") ? "" : value?.localaddress;
        const answerLocal = handleLocalAddress(value.localaddress) ? true : false;
        if (ipPoolsFilter) {
            const secretPPPValues = matchedSecrets?.filter(data => data?.profile === value?.value)?.map(data => data["remote-address"]);
            let [startIP, endIP] = ipPoolsFilter?.ranges?.split('-');
            // Extract the common part and the last octets
            let baseIP = startIP.substring(0, startIP.lastIndexOf('.') + 1);
            let start = parseInt(startIP.split('.')[3], 10);
            let end = parseInt(endIP.split('.')[3], 10);

            // Generate the IP range
            let answer = [];
            let localAddresses = [];
            for (let i = start; i <= end; i++) {
                localAddresses.push(`${baseIP}${i}`);

                let check = secretPPPValues?.includes(`${baseIP}${i}`)
                if (!check) {
                    answer.push(`${baseIP}${i}`);
                }
            }
            setLocalAddresses([localaddress, ...localAddresses])
            let Remote = answerLocal ? [...answer] : [localaddress, ...answer];
            setRemoteAddress(Remote)
        }
        else {
            setLocalAddresses([])
            setRemoteAddress([])
        }

    }


    // const getCode = (e) => {
    //     const userData = allUsersData?.find(
    //         (comp) =>
    //             e.company === comp.company &&
    //             e.branch === comp.branch &&
    //             e.unit === comp.unit && e.team?.includes(comp.team) && e.employeename === comp.companyname
    //     )
    //     const profiles = profileOptions?.find(data => data?.name === e.profile)
    //     const Teamuser = allUsersData?.find(data => data?.username === e?.name);
    //     const team = (e?.team && e?.team?.length > 0) ? e?.team : (Teamuser ? [Teamuser?.team] : [])
    //     const employeeName = allUsersData?.find(
    //         (comp) =>
    //             e.company === comp.company &&
    //             e.branch === comp.branch &&
    //             e.unit === comp.unit && team?.includes(comp.team) && e.employeename === comp.companyname);

    //     setEmployeeNameEdit(Teamuser ? Teamuser?.companyname : "")
    //     setSelectedTeamOptionsEdit(team?.map(data => ({
    //         value: data,
    //         label: data,
    //     })));
    //     setValueTeamEdit(team)
    //     if (userData) {
    //         autoGenerateTempPasswordEdit(userData)
    //     }
    //     if (profiles) {
    //         handleRemoteAddressEdit(profiles, e?.remoteaddress)
    //     }

    // }

    const getCode = (e) => {
        const userData = allUsersData?.find(
            (comp) => e?.name === comp.username
        );
        const profiles = profileOptions?.find(data => data?.name === e.profile)
        const team = (e?.team && e?.team?.length > 0) ? e?.team : (userData ? [userData?.team] : []);
        setEmployeeNameEdit(userData ? userData?.companyname : "")
        setSelectedTeamOptionsEdit(team?.map(data => ({
            value: data,
            label: data,
        })));
        setValueTeamEdit(team)
        if (profiles) {
            handleRemoteAddressEdit(profiles, e?.remoteaddress)
        }

    }

    const autoGenerateTempPasswordEdit = (data, mikname, service, remote) => {
        const remoteName = isIPAddress(remote) ? remote.split(".").at(-1) : "";
        const mikrotikName = mikname?.slice(-2) || "";
        const serviceName = service?.charAt(0) || "";
        const nameAbbreviation = data || "";

        // Exclude remoteName if isIPAddress(remote) is false
        let temppassword = `${nameAbbreviation}@${mikrotikName}${serviceName}`;
        if (isIPAddress(remote)) {
            temppassword += remoteName;
        }

        let finalTrimmedPassword = temppassword;

        if (temppassword?.length > 15) {
            const excessLength = temppassword.length - 15;
            const trimmedName = nameAbbreviation.slice(0, nameAbbreviation.length - excessLength);
            finalTrimmedPassword = capitalizeFirstAndLast(trimmedName) + `@${mikrotikName}${serviceName}`;
            if (isIPAddress(remote)) {
                finalTrimmedPassword += remoteName;
            }
        } else {
            finalTrimmedPassword = capitalizeFirstAndLast(nameAbbreviation) + `@${mikrotikName}${serviceName}`;
            if (isIPAddress(remote)) {
                finalTrimmedPassword += remoteName;
            }
        }
        setAutoGenPasswordEdit(finalTrimmedPassword);
        return finalTrimmedPassword;
    };

    
    const handleRemoteAddressEdit = (value, remote) => {
        const ipPoolsFilter = ipPools?.find(data => data?.name === value["remote-address"]);
        const localaddress = (value?.localaddress === undefined || value?.localaddress === "") ? "" : value?.localaddress
        const answerLocal = handleLocalAddress(value.localaddress) ? true : false;

        if (ipPoolsFilter) {
            const secretPPPValues = matchedSecrets?.filter(data => data?.profile === value?.value)?.map(data => data["remote-address"]);

            let [startIP, endIP] = ipPoolsFilter?.ranges?.split('-');
            // Extract the common part and the last octets
            let baseIP = startIP.substring(0, startIP.lastIndexOf('.') + 1);
            let start = parseInt(startIP.split('.')[3], 10);
            let end = parseInt(endIP.split('.')[3], 10);

            // Generate the IP range
            let answer = [];
            let localAddresses = [];
            for (let i = start; i <= end; i++) {
                localAddresses.push(`${baseIP}${i}`);
                let check = secretPPPValues?.filter(data => data !== remote)?.includes(`${baseIP}${i}`)
                if (!check) {
                    answer.push(`${baseIP}${i}`);
                }
            }
            setLocalAddressesEdit([localaddress, ...localAddresses])
            let Remote = answerLocal ? answer : [localaddress, ...answer];
            setRemoteAddressEdit(Remote)
        }
        else {
            setRemoteAddressEdit([])
            setLocalAddressesEdit([])
        }

    }

    const [filterDatas, setFilterDatas] = useState({
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        name: "Please Select Name",
        url: "",
        username: "",
        password: "",
    })
    const [filterFinal, setFilterFinal] = useState({
        url: "",
        username: "",
        password: "",
        company: "",
        branch: "",
        unit: "",
        name: "",
    })


    const handleTeamChange = (options) => {
        setValueTeam(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedTeamOptions(options);
        setEmployeeName("Please Select Employee Name")
        setAssetVariant({
            ...assetVariant,
            username: "",
            password: "",
            livepassword: "",
            autogenerate: false
        });
        setAutoGenPassword("")
    };

    const customValueRendererTeam = (valueCate, _days) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Team";
    };
    const handleTeamChangeEdit = (options) => {
        setValueTeamEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedTeamOptionsEdit(options);
        setEmployeeNameEdit("Please Select Employee Name")
        setAssetVariantEdit({
            ...assetVariantEdit,
            username: "",
            password: "",
            autogenerate: false
        });

    };

    const customValueRendererTeamEdit = (valueCate, _days) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Team";
    };



    //submit option for saving
    const handleFilter = (e) => {
        e.preventDefault();

        if (filterDatas.company === "Please Select Company") {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (filterDatas.branch === "Please Select Branch") {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (filterDatas.unit === "Please Select Unit") {
            setPopupContentMalert("Please Select Unit!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (filterDatas.name === "Please Select Name") {
            setPopupContentMalert("Please Select Name!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else {
            setFilterApplied(true);
            setFilterFinal({
                url: filterDatas?.url,
                username: filterDatas?.username,
                password: filterDatas?.password,
                company: filterDatas?.company,
                branch: filterDatas?.branch,
                unit: filterDatas?.unit,
                name: filterDatas?.name,
            })
            setAssetVariant({
                ...assetVariant,
                url: filterDatas?.url,
                company: filterDatas?.company,
                branch: filterDatas?.branch,
                unit: filterDatas?.unit,
                name: filterDatas?.name,
                adminusername: filterDatas?.username,
                adminpassword: filterDatas?.password,
                localaddress: "Please Select Local Address",
            })
            fetchMikroTikSecrets(filterDatas?.url,
                filterDatas?.username,
                filterDatas?.password, filterDatas)
            fetchMikroTikProfiles(filterDatas?.url,
                filterDatas?.username,
                filterDatas?.password,)
        }
    };


    const [profileOptions, setProfileOptions] = useState([]);
    const fetchMikroTikProfiles = async (url,
        username,
        password) => {
        setPageName(!pageName);
        try {
            let response = await axios.post(SERVICE.GET_MIKROTIK_PROFILES, {
                url, username, password
            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let datas = response?.data?.profiles?.map(data => ({
                ...data,
                localaddress: data["local-address"],
                label: data?.name,
                value: data?.name,
            }))

            setProfileOptions(datas);
        } catch (err) {

            let error = err.response?.data?.message;
            if (error) {
                setPopupContentMalert(error);
                setPopupSeverityMalert("error");
                handleClickOpenPopupMalert();
            } else {
                handleApiError(
                    err,
                    setPopupContentMalert,
                    setPopupSeverityMalert,
                    handleClickOpenPopupMalert
                );
            }
        }
    };



    const handleClearFilter = (e) => {
        e.preventDefault();
        setFilterDatas({
            company: "Please Select Company",
            branch: "Please Select Branch",
            unit: "Please Select Unit",
            name: "Please Select Name",
            url: "",
            username: "",
            password: "",
        });
        setFilterFinal({
            url: "",
            username: "",
            password: "",
            company: "",
            branch: "",
            unit: "",
            name: "",
        })
        setChanges("cleared")
        setFilterApplied(false);
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
        setTeamsArray([]);
        setMatchedSecrets([])
    };

    //get all Asset Variant name.
    const fetchMikroRikMaster = async () => {
        setPageName(!pageName);
        try {
            let response = await axios.get(SERVICE.ALL_MIKROTIKMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let datas =
                response?.data?.mikrotikmaster?.filter((item) =>
                    isAssignBranch.some(
                        (branch) =>
                            branch.company === item.company &&
                            branch.branch === item.branch &&
                            branch.unit === item.unit
                    )
                );
            setMikrotikMaster(datas);
        } catch (err) {
            console.log(err);
            let error = err.response?.data?.message;
            if (error) {
                setPopupContentMalert(error);
                setPopupSeverityMalert("error");
                handleClickOpenPopupMalert();
            } else {
                handleApiError(
                    err,
                    setPopupContentMalert,
                    setPopupSeverityMalert,
                    handleClickOpenPopupMalert
                );
            }
        }
    };
    useEffect(() => {
        fetchMikroRikMaster();
    }, []);




    //FILTER END





    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [openRemoteAlert, setOpenRemoteAlert] = useState(false);
    const [openRemoteAlertEdit, setOpenRemoteAlertEdit] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        setOpenPopupMalert(true);
    };
    const handleClosePopupMalert = () => {
        setOpenPopupMalert(false);
    };

    const handleClickOpenRemoteAlert = () => {
        setOpenRemoteAlert(true);
    };
    const handleCloseRemoteAlert = () => {
        setOpenRemoteAlert(false);
    };
    const handleClickOpenRemoteAlertEdit = () => {
        setOpenRemoteAlertEdit(true);
    };
    const handleCloseRemoteAlertEdit = () => {
        setOpenRemoteAlertEdit(false);
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


    let exportColumnNames = [
        "Name",
        // "password",
        "Service",
        "Profile",
        "Local Address",
        "Remote Address",
        "Password",
        "Last Logged Out",
        "Last Caller Id",
        "Last Disconnect Reason",

    ];
    let exportRowValues = [
        "name",
        // "password",
        "service",
        "profile",
        "localaddress",
        "remoteaddress",
        "password",
        "lastloggedout",
        "lastcallerid",
        "lastdisconnectreason",
    ];



    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    function isValidURL(url) {
        setPageName(!pageName);
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    }
    const ipRegex = /^$|^[0-9.]+$/;
    const [assetVariant, setAssetVariant] = useState({
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        name: "Please Select Name",
        url: "",
        username: "",
        adminusername: "",
        livepassword: "",
        adminpassword: "",
        service: "any",
        profile: "",
        localaddress: "Please Select Local Address",
        remoteaddress: "",
        empteam: "",
        autogenerate: false,
        showpassword: false,
        showlivepassword: false,

    });

    const [assetVariantEdit, setAssetVariantEdit] = useState({
        name: "",
        password: "",
        service: "any",
        profile: "",
        localaddress: "",
        remoteaddress: "",
        autogenerate: false,
        showpassword: false,
        showlivepassword: false,
    });
    let serviceOptions = [
        { label: "any", value: "any" },
        { label: "async", value: "async" },
        { label: "l2tp", value: "l2tp" },
        { label: "ovpn", value: "ovpn" },
        { label: "pppoe", value: "pppoe" },
        { label: "pptp", value: "pptp" },
        { label: "sstp", value: "sstp" },
    ]

    const {
        isUserRoleCompare,
        isUserRoleAccess,
        pageName,
        setPageName,
        buttonStyles,
        isAssignBranch,
        allTeam,
        allUsersData
    } = useContext(UserRoleAccessContext);




    const accessbranch = isUserRoleAccess?.role?.includes("Manager")
        ? isAssignBranch?.map((data) => ({
            branch: data.branch,
            company: data.company,
            unit: data.unit,
        }))
        : isAssignBranch
            ?.filter((data) => {
                let fetfinalurl = [];

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

                const remove = [
                    window.location.pathname?.substring(1),
                    window.location.pathname,
                ];
                return fetfinalurl?.some((item) => remove?.includes(item));
            })
            ?.map((data) => ({
                branch: data.branch,
                company: data.company,
                unit: data.unit,
            }));

    useEffect(() => {
        getapi();
    }, []);

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Mikrotik PPP Secrets"),
            commonid: String(isUserRoleAccess?._id),
            date: String(new Date()),

            addedby: [
                {
                    name: String(isUserRoleAccess?.username),
                    date: String(new Date()),
                },
            ],
        });
    };

    const { auth } = useContext(AuthContext);
    const [loader, setLoader] = useState(false);
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [isBtn, setIsBtn] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const [openview, setOpenview] = useState(false);
    const [openInfo, setOpeninfo] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleteOpenRestore, setIsDeleteOpenRestore] = useState(false);
    const [deleteAssetVariant, setDeleteAssetVariant] = useState({});

    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [allAssetVariantEdit, setAllAssetVariantEdit] = useState([]);
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        employeename: true,
        name: true,
        password: true,
        service: true,
        profile: true,
        localaddress: true,
        remoteaddress: true,
        lastloggedout: true,
        // password: true,
        lastdisconnectreason: true,
        lastcallerid: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );

    //useEffect
    useEffect(() => {
        addSerialNumber(teamsArray);
    }, [teamsArray]);


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

    const [singleRow, setSingleRow] = useState({});
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
    //Delete model
    const handleClickOpenRestore = () => {
        setIsDeleteOpenRestore(true);
    };
    const handleCloseModRestore = () => {
        setIsDeleteOpenRestore(false);
    };
    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };
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

    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
    };

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

    const [deleteTeamId, setDeleteTeamId] = useState("");

    const deleteTeam = async () => {
        setPageName(!pageName);
        try {
            await axios.post(
                `${SERVICE.DELETE_MIKROTIK_SECRET}`, {
                id: deleteTeamId,
                url: filterFinal?.url,
                username: filterFinal?.username,
                password: filterFinal?.password,
            },
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            await fetchMikroTikSecrets(filterFinal?.url,
                filterFinal?.username,
                filterFinal?.password, filterDatas)
            handleCloseMod();
            setSelectedRows([]);
            setPage(1);
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            console.log(err);
            let error = err.response?.data?.message;
            if (error) {
                setPopupContentMalert(error);
                setPopupSeverityMalert("error");
                handleClickOpenPopupMalert();
            } else {
                handleApiError(
                    err,
                    setPopupContentMalert,
                    setPopupSeverityMalert,
                    handleClickOpenPopupMalert
                );
            }
        }
    };








    //add model...
    const [isAddOpen, setIsAddOpen] = useState(false);
    const handleClickOpenAdd = () => {
        setIsAddOpen(true);
        setAssetVariant({
            ...assetVariant,
            url: filterDatas?.url,
            company: filterDatas?.company,
            branch: filterDatas?.branch,
            unit: filterDatas?.unit,
            name: filterDatas?.name,
            adminusername: filterDatas?.username,
            adminpassword: filterDatas?.password,
            showpassword: false,
            livepassword: "",
            password: "",
            username: "",
            autogenerate: false
            // localaddress: "Please Select Local Address",
        });
        setAutoGenPassword("")
        fetchMikroTikSecrets(filterDatas?.url,
            filterDatas?.username,
            filterDatas?.password, filterDatas)
        fetchMikroTikProfiles(filterDatas?.url,
            filterDatas?.username,
            filterDatas?.password,)
        const team = allTeam?.filter(
            (comp) =>
                filterDatas.company === comp.company &&
                filterDatas.branch === comp.branch &&
                filterDatas.unit === comp.unit)?.map(data => ({
                    label: data.teamname,
                    value: data.teamname,
                })).filter((item, index, self) => {
                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                })
        setSelectedTeamOptions(team)
        setValueTeam(
            team.map((a, index) => {
                return a.value;
            })
        );
    };
    const handleCloseModAdd = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsAddOpen(false);
        setAssetVariant({
            ...assetVariant,
            url: filterDatas?.url,
            company: filterDatas?.company,
            branch: filterDatas?.branch,
            unit: filterDatas?.unit,
            name: filterDatas?.name,
            adminusername: filterDatas?.username,
            adminpassword: filterDatas?.password,
            showpassword: false,
            profile: "",
            remoteaddress: "",
            localaddress: "Please Select Local Address",
        });
        fetchMikroTikProfiles(filterDatas?.url,
            filterDatas?.username,
            filterDatas?.password,)
        fetchMikroTikSecrets(filterDatas?.url,
            filterDatas?.username,
            filterDatas?.password, filterDatas)
        setEmployeeName("Please Select Employee Name");
        setSelectedTeamOptions([])
        setValueTeam([]);
        setRemoteAddress([])

    };
    //Edit model...
    const [isEditOpen, setIsEditOpen] = useState(false);
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
        fetchMikroTikProfiles(filterDatas?.url,
            filterDatas?.username,
            filterDatas?.password,)
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = matchedSecrets?.some(
            (item) =>
                item.name?.trim().toLowerCase() === assetVariant.name?.trim().toLowerCase() &&
                item.localaddress === assetVariant.localaddress &&
                item.remoteaddress === assetVariant.remoteaddress
        );
        if (isNameMatch) {
            setPopupContentMalert("Data Already Exist!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();

        } else if (assetVariant.company === "Please Select Company" || assetVariant.company === "" || assetVariant.company === undefined) {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (assetVariant.branch === "Please Select Branch" || assetVariant.branch === "" || assetVariant.branch === undefined) {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (assetVariant.unit === "Please Select Unit" || assetVariant.unit === "" || assetVariant.unit === undefined) {
            setPopupContentMalert("Please Select Unit!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedTeamOptions?.length < 1) {
            setPopupContentMalert("Please Select Team!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (employeeName === "Please Select Employee Name") {
            setPopupContentMalert("Please Select Employee Name!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (!assetVariant?.autogenerate && assetVariant.password === "") {
            setPopupContentMalert("Please Enter Temp Password!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (assetVariant.livepassword === "") {
            setPopupContentMalert("Please Enter Live Password!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (assetVariant.profile === "") {
            setPopupContentMalert("Please Select Profile!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (assetVariant.localaddress === "Please Select Local Address") {
            setPopupContentMalert(localAddressBoolean === false ? "Please Select Local Address!" : "Please Enter Local Address!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (assetVariant.remoteaddress === "" || assetVariant.remoteaddress === "Please Select Remote Address" || assetVariant.remoteaddress === undefined) {
            handleClickOpenRemoteAlert();
        }
        else {
            sendRequest();
        }
    };

    //add function
    const sendRequest = async () => {
        setPageName(!pageName);
        setIsBtn(true);

        try {
            await axios.post(
                SERVICE.CREATE_MIKROTIK_SECRET,
                {
                    name: String(assetVariant.username),
                    company: String(assetVariant.company),
                    branch: String(assetVariant.branch),
                    unit: String(assetVariant.unit),
                    mikrotikname: String(filterFinal?.name),
                    // temppassword: assetVariant.password,
                    temppassword: assetVariant?.autogenerate ? autoGenPassword : assetVariant.password,
                    password: assetVariant.livepassword,
                    service: String(assetVariant.service),
                    profile: String(assetVariant.profile),
                    localaddress: String(assetVariant.localaddress),
                    remoteaddress: String(assetVariant.remoteaddress),
                    adminusername: String(filterFinal.username),
                    adminpassword: String(filterFinal.password),
                    url: String(filterFinal.url),
                    team: valueTeam,
                    employeename: employeeName,
                    autogenerate: assetVariant.autogenerate,
                    addedby: [
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );

            setEmployeeName("Please Select Employee Name")
            setAssetVariant({
                ...assetVariant,
                username: "",
                autogenerate: false,
                profile: "Please Select Profile",
                localaddress: "Please Select Local Address",
                remoteaddress: "",
                password: "",
                livepassword: "",
            });
            setLocalAddresses([])
            setRemoteAddress([])
            setAutoGenPassword("")
            fetchMikroTikProfiles(filterFinal?.url,
                filterFinal?.username,
                filterFinal?.password,)
            await fetchMikroTikSecrets(filterFinal?.url,
                filterFinal?.username,
                filterFinal?.password, filterDatas)
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setIsBtn(false);
        } catch (err) {
            setIsBtn(false);
            let error = err.response?.data?.message;
            if (error) {
                setPopupContentMalert(error);
                setPopupSeverityMalert("error");
                handleClickOpenPopupMalert();
            } else {
                handleApiError(
                    err,
                    setPopupContentMalert,
                    setPopupSeverityMalert,
                    handleClickOpenPopupMalert
                );
            }
        }
    };



    //editing the single data...
    const sendEditRequest = async () => {
        setPageName(!pageName);

        try {
            let res = await axios.put(
                `${SERVICE.UPDATE_MIKROTIK_SECRET}`,
                {
                    id: String(assetVariantEdit.id),
                    company: String(assetVariantEdit.company),
                    branch: String(assetVariantEdit.branch),
                    unit: String(assetVariantEdit.unit),
                    mikrotikid: String(assetVariantEdit.id),
                    name: String(assetVariantEdit.username),
                    mikrotikname: String(filterFinal?.name),
                    temppassword: assetVariantEdit?.autogenerate ? autoGenPasswordEdit : assetVariantEdit.password,
                    password: assetVariantEdit.livepassword,
                    service: String(assetVariantEdit.service),
                    profile: String(assetVariantEdit.profile),
                    localaddress: String(assetVariantEdit.localaddress),
                    remoteaddress: String(assetVariantEdit.remoteaddress),
                    adminusername: String(filterFinal.username),
                    adminpassword: String(filterFinal.password),
                    url: String(filterFinal.url),
                    team: valueTeamEdit,
                    employeename: employeeNameEdit,
                    autogenerate: assetVariantEdit.autogenerate,
                    updatedby: [
                        ...assetVariantEdit?.updatedby,
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );

            await fetchMikroTikSecrets(filterFinal?.url,
                filterFinal?.username,
                filterFinal?.password, filterDatas)
            handleCloseModEdit();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            console.log("Error Response:", err.response);
            let error = err.response?.data?.message;
            if (error) {
                setPopupContentMalert(error);
                setPopupSeverityMalert("error");
                handleClickOpenPopupMalert();
            } else {
                handleApiError(
                    err,
                    setPopupContentMalert,
                    setPopupSeverityMalert,
                    handleClickOpenPopupMalert
                );
            }
        }
    };

    const editSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = matchedSecrets?.filter((item) => item.id !== assetVariantEdit.id)?.some(
            (item) =>
                item.name?.trim().toLowerCase() === assetVariantEdit.name?.trim().toLowerCase()
        );
        if (isNameMatch) {
            setPopupContentMalert("Data Already Exist!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (assetVariantEdit?.company === "Please Select Company" || assetVariantEdit.company === "" || assetVariantEdit.company === undefined) {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (assetVariantEdit?.branch === "Please Select Branch" || assetVariantEdit.branch === "" || assetVariantEdit.branch === undefined) {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (assetVariantEdit?.unit === "Please Select Unit" || assetVariantEdit.unit === "" || assetVariantEdit.unit === undefined) {
            setPopupContentMalert("Please Select Unit!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedTeamOptionsEdit?.length < 1) {
            setPopupContentMalert("Please Select Team!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (employeeNameEdit === "Please Select Employee Name" || employeeNameEdit === "" || employeeNameEdit === undefined) {
            setPopupContentMalert("Please Select Employee Name!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (!assetVariantEdit?.autogenerate && assetVariantEdit.password === "") {
            setPopupContentMalert("Please Enter Temp Password!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (assetVariantEdit.livepassword === "") {
            setPopupContentMalert("Please Enter Live Password!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (assetVariantEdit.profile === "Please Select Profile" || assetVariantEdit.profile === "" || assetVariantEdit.profile === undefined) {
            setPopupContentMalert("Please Select Profile!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (assetVariantEdit.localaddress === "Please Select Local Address") {
            setPopupContentMalert(localAddressBooleanEdit === false ? "Please Select Local Address!" : "Please Enter Local Address!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (assetVariantEdit.remoteaddress === "" || assetVariantEdit.remoteaddress === undefined) {
            handleClickOpenRemoteAlertEdit();
        }
        else {
            sendEditRequest();
        }
    };
    //get all Asset Variant name.
    const fetchMikroTikSecrets = async (url,
        username,
        password, filterFinal) => {
        setPageName(!pageName);
        try {
            setLoader(true);
            let response = await axios.post(SERVICE.GET_MIKROTIK_SECRETS, {
                url, username, password, filterFinal
            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let ipPools = await axios.post(SERVICE.GET_MIKROTIK_IPPOOL, {
                url, username, password
            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let dataipPools =
                ipPools?.data?.ippool;

            setIpPools(dataipPools)
            let datas = response?.data?.matchedNames?.length > 0 ? response?.data?.matchedNames?.map(data => {
                let matchedItems = allUsersData?.find(item => data?.name === item?.username);
                if (matchedItems) {
                    return {
                        ...data,
                        company: matchedItems?.company,
                        branch: matchedItems?.branch,
                        unit: matchedItems?.unit,
                        team: [matchedItems?.team],
                        employeename: matchedItems?.companyname,
                    }
                }
            }) : [];
            let matchedDatas = response?.data?.secrets?.length > 0 ? response?.data?.secrets : [];
            setTeamsArray(datas);

            const items = matchedDatas?.map((item, index) => {
                return {
                    ...item, // Original data
                    serialNumber: index + 1, // Serial number
                    id: item?.[".id"],
                    name: item?.name,
                    password: item?.password,
                    temppassword: item?.temppassword,
                    dummypassword: "********",
                    service: item?.service,
                    profile: item?.profile,
                    team: item?.team,
                    employeename: item?.employeename,
                    autogenerate: item?.autogenerate,
                    localaddress: item?.["local-address"],
                    remoteaddress: item?.["remote-address"],
                    lastloggedout: moment(item?.["last-logged-out"]).format("DD-MM-YYYY hh:mm:ss a"),
                    lastdisconnectreason: item?.["last-disconnect-reason"],
                    lastcallerid: item?.["last-caller-id"],
                    addedby: item?.addedby,
                    updatedby: item?.updatedby,
                    createdAt: item?.createdAt,
                };
            });
            setMatchedSecrets(items);
            setLoader(false);
        } catch (err) {
            setLoader(false);
            console.log(err);
            let error = err.response?.data?.message;
            if (error) {
                setPopupContentMalert(error);
                setPopupSeverityMalert("error");
                handleClickOpenPopupMalert();
            } else {
                handleApiError(
                    err,
                    setPopupContentMalert,
                    setPopupSeverityMalert,
                    handleClickOpenPopupMalert
                );
            }
        }
    };


    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Mikrotik PPP Secrets.png");
                });
            });
        }
    };

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Mikrotik PPP Secrets",
        pageStyle: "print",
    });

    //serial no for listing items
    const addSerialNumber = (profiledatas) => {
        const itemsWithSerialNumber = profiledatas?.map((item, index) => {
            return {
                ...item, // Original data
                serialNumber: index + 1, // Serial number
                id: item?.[".id"],
                name: item?.name,
                password: item?.password,
                temppassword: item?.temppassword,
                dummypassword: "********",
                service: item?.service,
                profile: item?.profile,
                team: item?.team,
                employeename: item?.employeename,
                autogenerate: item?.autogenerate,
                localaddress: item?.["local-address"],
                remoteaddress: item?.["remote-address"],
                lastloggedout: moment(item?.["last-logged-out"]).format("DD-MM-YYYY hh:mm:ss a"),
                lastdisconnectreason: item?.["last-disconnect-reason"],
                lastcallerid: item?.["last-caller-id"],
                addedby: item?.addedby,
                updatedby: item?.updatedby,
                createdAt: item?.createdAt,
            };
        });
        // Update the state with the new items
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
        return searchTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });

    const filteredData = filteredDatas?.slice(
        (page - 1) * pageSize,
        page * pageSize
    );
    const totalPages = Math.ceil(filteredDatas?.length / pageSize);
    const visiblePages = Math.min(totalPages, 3);
    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(
        firstVisiblePage + visiblePages - 1,
        totalPages
    );
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
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 100,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },

        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 150,
            hide: !columnVisibility.company,
            headerClassName: "bold-header",
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 150,
            hide: !columnVisibility.branch,
            headerClassName: "bold-header",
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 150,
            hide: !columnVisibility.unit,
            headerClassName: "bold-header",
        },
        {
            field: "team",
            headerName: "Team",
            flex: 0,
            width: 150,
            hide: !columnVisibility.team,
            headerClassName: "bold-header",
        },
        {
            field: "employeename",
            headerName: "Employee Name",
            flex: 0,
            width: 150,
            hide: !columnVisibility.employeename,
            headerClassName: "bold-header",
        },
        {
            field: "name",
            headerName: "Name",
            flex: 0,
            width: 150,
            hide: !columnVisibility.name,
            headerClassName: "bold-header",
        },
        // {
        //     field: "password",
        //     headerName: "Password",
        //     flex: 0,
        //     width: 150,
        //     hide: !columnVisibility.password,
        //     headerClassName: "bold-header",
        // },
        {
            field: "service",
            headerName: "Service",
            flex: 0,
            width: 150,
            hide: !columnVisibility.service,
            headerClassName: "bold-header",
        },
        {
            field: "profile",
            headerName: "Profile",
            flex: 0,
            width: 150,
            hide: !columnVisibility.profile,
            headerClassName: "bold-header",
        },

        {
            field: "localaddress",
            headerName: "Local Address",
            flex: 0,
            width: 150,
            hide: !columnVisibility.localaddress,
            headerClassName: "bold-header",
        },

        {
            field: "remoteaddress",
            headerName: "Remote Address",
            flex: 0,
            width: 150,
            hide: !columnVisibility.remoteaddress,
            headerClassName: "bold-header",
        },

        {
            field: "password",
            headerName: "Password",
            flex: 0,
            width: 150,
            hide: !columnVisibility.password,
            headerClassName: "bold-header",
        },

        {
            field: "lastloggedout",
            headerName: "Last Logged Out",
            flex: 0,
            width: 150,
            hide: !columnVisibility.lastloggedout,
            headerClassName: "bold-header",
        },
        {
            field: "lastcallerid",
            headerName: "Last Caller ID",
            flex: 0,
            width: 150,
            hide: !columnVisibility.lastcallerid,
            headerClassName: "bold-header",
        },
        {
            field: "lastdisconnectreason",
            headerName: "Last Disconnect Reason",
            flex: 0,
            width: 150,
            hide: !columnVisibility.lastdisconnectreason,
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
                    {isUserRoleCompare?.includes("esecrets") && (
                        <>
                            <Button
                                sx={userStyle.buttonedit}
                                onClick={() => {
                                    getCode(params.row)
                                    const userData = allUsersData?.find(
                                        (comp) => params?.row?.name === comp.username
                                    );
                                    const password = autoGenerateTempPasswordEdit(params?.row?.name, filterFinal.name, params?.row?.service, params?.row?.remoteaddress)
                                    setAutoGenPasswordEdit(params.row?.autogenerate === true ? password : params.row?.temppassword);
                                    const answer = handleLocalAddress(params?.row?.localaddress);
                                    setLocalAddressBooleanEdit(answer ? true : false)
                                    setRemoteAddressString(params?.row?.remoteaddress);
                                    setAssetVariantEdit({
                                        ...params.row,
                                        name: filterDatas?.name,
                                        company: params.row?.company ? params.row?.company : userData?.company,
                                        branch: params.row?.branch ? params.row?.branch : userData?.branch,
                                        unit: params.row?.unit ? params.row?.unit : userData?.unit,
                                        password: params.row?.temppassword ? params.row?.temppassword : "",
                                        autogenerate: params.row?.autogenerate === true ? true : false,
                                        livepassword: params.row?.password ? params.row?.password : "",
                                        username: params?.row?.name,
                                        adminusername: filterDatas?.username,
                                        adminpassword: filterDatas?.password,
                                    });
                                    handleClickOpenEdit();
                                }}
                            >
                                <EditOutlinedIcon sx={buttonStyles.buttonedit} />
                            </Button>
                        </>
                    )}

                    {isUserRoleCompare?.includes("dsecrets") && (
                        <>
                            <Button
                                sx={userStyle.buttondelete}
                                onClick={(e) => {
                                    setDeleteTeamId(params.row.id);
                                    handleClickOpen();
                                }}
                            >
                                <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
                            </Button>
                        </>
                    )}
                    {isUserRoleCompare?.includes("vsecrets") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                // getviewCode(params.row.id);
                                setSingleRow(params?.row);
                                handleClickOpenview();
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("isecrets") && (params?.row?.addedby?.length > 0 || params?.row?.updatedby?.length > 0) && (

                        <Button
                            size="small"
                            sx={userStyle.actionbutton}
                            onClick={() => {
                                setSingleRow(params?.row);
                                handleClickOpeninfo();
                            }}
                        >
                            <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />
                        </Button>
                    )}
                </Grid>
            ),
        },
    ];


    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item.id,
            _id: item._id,
            serialNumber: item.serialNumber,
            name: item?.name,
            team: item?.team,
            employeename: item?.employeename,
            company: item?.company,
            branch: item?.branch,
            unit: item?.unit,
            autogenerate: item?.autogenerate,
            password: item?.password,
            temppassword: item?.temppassword,
            dummypassword: item?.dummypassword,
            service: item?.service,
            profile: item?.profile,
            localaddress: item?.localaddress,
            remoteaddress: item?.remoteaddress,
            lastloggedout: item?.lastloggedout,
            lastdisconnectreason: item?.lastdisconnectreason,
            lastcallerid: item?.lastcallerid,
            addedby: item?.addedby,
            updatedby: item?.updatedby,
            createdAt: item?.createdAt,
        };
    });

    const rowsWithCheckboxes = rowDataTable.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRows.includes(row.id),
    }));

    // Show All Columns functionality
    const handleShowAllColumns = () => {
        setColumnVisibility(initialColumnVisibility);
    };
    // Function to filter columns based on search query
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

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    const [fileFormat, setFormat] = useState("");


    return (
        <Box>
            <Headtitle title={"MIKROTIK PPP SECRETS"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Mikrotik PPP Secrets"
                modulename="Mikrotik"
                submodulename="PPP"
                mainpagename="Secrets"
                subpagename=""
                subsubpagename=""
            />
            <>
                {isUserRoleCompare?.includes("lsecrets") && (
                    <Box sx={userStyle.selectcontainer}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>
                                        Filter Mikrotik PPP Secrets
                                    </Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Company <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={300}
                                            options={mikrotikMaster
                                                ?.map((data) => ({
                                                    label: data.company,
                                                    value: data.company,
                                                })).filter((item, index, self) => {
                                                    return (
                                                        self.findIndex(
                                                            (i) =>
                                                                i.label === item.label && i.value === item.value
                                                        ) === index
                                                    );
                                                })}
                                            value={{
                                                label: filterDatas.company,
                                                value: filterDatas.company,
                                            }}
                                            onChange={(e) => {
                                                setFilterDatas({
                                                    ...filterDatas,
                                                    company: e.value,
                                                    branch: "Please Select Branch",
                                                    unit: "Please Select Unit",
                                                    name: "Please Select Name",
                                                    url: "",
                                                    username: "",
                                                    password: "",
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Branch <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={300}
                                            options={mikrotikMaster
                                                ?.filter((comp) =>
                                                    filterDatas.company === comp.company
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
                                            value={{
                                                label: filterDatas.branch,
                                                value: filterDatas.branch,
                                            }}
                                            onChange={(e) => {
                                                setFilterDatas({
                                                    ...filterDatas,
                                                    branch: e.value,
                                                    unit: "Please Select Unit",
                                                    name: "Please Select Name",
                                                    url: "",
                                                    username: "",
                                                    password: "",
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Unit <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={300}
                                            options={mikrotikMaster
                                                ?.filter(
                                                    (comp) =>
                                                        filterDatas.company === comp.company &&
                                                        filterDatas.branch === comp.branch
                                                )
                                                ?.map((data) => ({
                                                    label: data.unit,
                                                    value: data.unit,
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
                                            value={{
                                                label: filterDatas.unit,
                                                value: filterDatas.unit,
                                            }}
                                            onChange={(e) => {
                                                setFilterDatas({
                                                    ...filterDatas,
                                                    unit: e.value,
                                                    name: "Please Select Name",
                                                    url: "",
                                                    username: "",
                                                    password: "",
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Name <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={300}
                                            options={mikrotikMaster
                                                ?.filter(
                                                    (comp) =>
                                                        filterDatas.company === comp.company &&
                                                        filterDatas.branch === comp.branch &&
                                                        filterDatas.unit === comp.unit
                                                )
                                                ?.map((data) => ({
                                                    label: data.name,
                                                    value: data.name,
                                                    url: data.url,
                                                    username: data.username,
                                                    password: data.password,
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
                                            value={{
                                                label: filterDatas.name,
                                                value: filterDatas.name,
                                            }}
                                            onChange={(e) => {
                                                setFilterDatas({
                                                    ...filterDatas,
                                                    name: e.value,
                                                    url: e.url,
                                                    username: e.username,
                                                    password: e.password,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={6} mt={3}>
                                    <div style={{ display: "flex", gap: "20px" }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleFilter}
                                            sx={buttonStyles.buttonsubmit}
                                        >
                                            Filter
                                        </Button>

                                        <Button
                                            sx={buttonStyles.btncancel}
                                            onClick={handleClearFilter}
                                        >
                                            Clear
                                        </Button>
                                    </div>
                                </Grid>
                            </Grid>

                        </>
                    </Box>
                )}
            </>
            <br /> <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lsecrets") && (
                <>
                    {loader ? (
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
                        <Box sx={userStyle.container}>
                            {/* ******************************************************EXPORT Buttons****************************************************** */}

                            <Grid container spacing={2}>
                                <Grid item xs={10}>
                                    <Typography sx={userStyle.importheadtext}>
                                        List Mikrotik PPP Secrets
                                    </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    {isUserRoleCompare?.includes("asecrets") && filterApplied && (
                                        <>

                                            <Button
                                                variant="contained"
                                                sx={buttonStyles.buttonsubmit}
                                                onClick={handleClickOpenAdd}
                                            >
                                                Add New
                                            </Button>
                                        </>
                                    )}
                                </Grid>
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
                                            <MenuItem value={teamsArray?.length}>
                                                All
                                            </MenuItem>
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
                                        {isUserRoleCompare?.includes("excelsecrets") && (
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
                                        {isUserRoleCompare?.includes("csvsecrets") && (
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
                                        {isUserRoleCompare?.includes("printsecrets") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdfsecrets") && (
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
                                        {isUserRoleCompare?.includes("imagesecrets") && (
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={handleCaptureImage}
                                            >
                                                {" "}
                                                <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                                                &ensp;Image&ensp;{" "}
                                            </Button>
                                        )}
                                    </Box>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
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

                            <br />
                            <br />
                            <Box
                                style={{
                                    width: "100%",
                                    overflowY: "hidden", // Hide the y-axis scrollbar
                                }}
                            >
                                <StyledDataGrid
                                    // onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
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
                                    {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
                                    {Math.min(page * pageSize, filteredDatas?.length)} of{" "}
                                    {filteredDatas?.length} entries
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
                            {/* ****** Table End ****** */}
                        </Box>
                    )}
                </>
            )}
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

            <PppUnmatchedSecrets filterFinal={filterFinal} setFilterFinal={setFilterFinal} filterDatas={filterDatas} setFilterDatas={setFilterDatas} />

            {/* Delete Modal */}
            <Box>
                {/* ALERT DIALOG */}
                <Dialog
                    open={openRemoteAlert}
                    onClose={handleCloseRemoteAlert}
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
                            Are you sure you want to save without Remote address
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseRemoteAlert} sx={buttonStyles.btncancel}>
                            Cancel
                        </Button>
                        <Button
                            autoFocus
                            sx={buttonStyles.buttonsubmit}
                            onClick={(e) => sendRequest(e)}
                        >
                            {" "}
                            Submit{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            {/* Delete Modal */}
            <Box>
                {/* ALERT DIALOG */}
                <Dialog
                    open={openRemoteAlertEdit}
                    onClose={handleCloseRemoteAlert}
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
                            Are you sure you want to save without Remote address
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseRemoteAlertEdit} sx={buttonStyles.btncancel}>
                            Cancel
                        </Button>
                        <Button
                            autoFocus
                            sx={buttonStyles.buttonsubmit}
                            onClick={(e) => sendEditRequest(e)}
                        >
                            {" "}
                            Submit{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            {/* view model */}
            <Dialog
                open={openview}
                onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="md"
                fullWidth={true}
                sx={{
                    overflow: "visible",
                    "& .MuiPaper-root": {
                        overflow: "visible",
                    },
                    marginTop: "50px"
                }}
            >
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>
                            {" "}
                            View Mikrotik PPP Secret
                        </Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Name</Typography>
                                    <Typography>{singleRow.name}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Password</Typography>
                                    <Typography>{singleRow.password}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Service</Typography>
                                    <Typography>{singleRow.service}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Profile</Typography>
                                    <Typography>{singleRow.profile}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Local Address</Typography>
                                    <Typography>{singleRow.localaddress}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Remote Address</Typography>
                                    <Typography>{singleRow.remoteaddress}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Password</Typography>
                                    <Typography>{singleRow.password}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Last Logged Out</Typography>
                                    <Typography>{singleRow.lastloggedout}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Last Caller ID</Typography>
                                    <Typography>{singleRow.lastcallerid}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Last Disconnect Reason</Typography>
                                    <Typography>{singleRow.lastdisconnectreason}</Typography>
                                </FormControl>
                            </Grid>

                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2} sx={{ marginLeft: "-2px" }}>
                            <Button
                                variant="contained"
                                sx={buttonStyles.btncancel}
                                onClick={handleCloseview}
                            >
                                Back
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>
            {/* Edit DIALOG */}
            <Box>
                <Dialog
                    open={isEditOpen}
                    onClose={handleCloseModEdit}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="md"
                    // sx={{
                    //     overflow: "visible",
                    //     "& .MuiPaper-root": {
                    //         overflow: "visible",
                    //     },
                    // }}
                    fullWidth={true}
                >
                    <Box sx={{ padding: "20px 50px" }}>
                        <>
                            <Grid container spacing={2}>
                                <Typography sx={userStyle.HeaderText}>
                                    Edit Mikrotik Secret Master
                                </Typography>
                            </Grid>
                            <br />

                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ color: "red", fontWeight: "bold" }}>
                                            From Company
                                        </Typography>
                                        <Typography>
                                            {filterFinal.company}
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ color: "red", fontWeight: "bold" }}>
                                            From Branch
                                        </Typography>
                                        <Typography>
                                            {filterFinal.branch}
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ color: "red", fontWeight: "bold" }}>
                                            From Unit
                                        </Typography>
                                        <Typography>
                                            {filterFinal.unit}
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ color: "red", fontWeight: "bold" }}>
                                            Mikrotik Name
                                        </Typography>
                                        <Typography>
                                            {filterFinal.name}
                                        </Typography>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Company<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={300}
                                            options={mikrotikMaster
                                                ?.map((data) => ({
                                                    label: data.company,
                                                    value: data.company,
                                                })).filter((item, index, self) => {
                                                    return (
                                                        self.findIndex(
                                                            (i) =>
                                                                i.label === item.label && i.value === item.value
                                                        ) === index
                                                    );
                                                })}
                                            value={{
                                                label: assetVariantEdit.company,
                                                value: assetVariantEdit.company,
                                            }}
                                            onChange={(e) => {
                                                setAssetVariantEdit({
                                                    ...assetVariantEdit,
                                                    company: e.value,
                                                    branch: "Please Select Branch",
                                                    unit: "Please Select Unit",
                                                    name: "Please Select Name",
                                                    url: "",
                                                    username: "",
                                                    password: "",
                                                });
                                                setSelectedTeamOptionsEdit([])
                                                setValueTeamEdit([])
                                                setEmployeeNameEdit("Please Select Employee Name")
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Branch<b style={{ color: "red" }}>*</b>
                                        </Typography>

                                        <Selects
                                            maxMenuHeight={300}
                                            options={mikrotikMaster
                                                ?.filter((comp) =>
                                                    assetVariantEdit.company === comp.company
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
                                            value={{
                                                label: assetVariantEdit.branch,
                                                value: assetVariantEdit.branch,
                                            }}
                                            onChange={(e) => {
                                                setAssetVariantEdit({
                                                    ...assetVariantEdit,
                                                    branch: e.value,
                                                    unit: "Please Select Unit",
                                                    name: "Please Select Name",
                                                    url: "",
                                                    username: "",
                                                    password: "",
                                                });
                                                setSelectedTeamOptionsEdit([])
                                                setValueTeamEdit([])
                                                setEmployeeNameEdit("Please Select Employee Name")
                                            }}
                                        />
                                        {/* <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={filterFinal.branch}
                                            readOnly
                                        /> */}
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Unit<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={300}
                                            options={mikrotikMaster
                                                ?.filter(
                                                    (comp) =>
                                                        assetVariantEdit.company === comp.company &&
                                                        assetVariantEdit.branch === comp.branch
                                                )
                                                ?.map((data) => ({
                                                    label: data.unit,
                                                    value: data.unit,
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
                                            value={{
                                                label: assetVariantEdit.unit,
                                                value: assetVariantEdit.unit,
                                            }}
                                            onChange={(e) => {
                                                setAssetVariantEdit({
                                                    ...assetVariantEdit,
                                                    unit: e.value,
                                                    name: "Please Select Name",
                                                    url: "",
                                                    username: "",
                                                    password: "",
                                                });
                                                setSelectedTeamOptionsEdit([])
                                                setValueTeamEdit([])
                                                setEmployeeNameEdit("Please Select Employee Name")
                                            }}
                                        />
                                        {/* <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={filterFinal.unit}
                                            readOnly
                                        /> */}
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Team<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <FormControl fullWidth size="small">
                                            <MultiSelect size="small"
                                                options={allTeam?.filter(
                                                    (comp) =>
                                                        assetVariantEdit.company === comp.company &&
                                                        assetVariantEdit.branch === comp.branch &&
                                                        assetVariantEdit.unit === comp.unit
                                                )?.map(data => ({
                                                    label: data.teamname,
                                                    value: data.teamname,
                                                })).filter((item, index, self) => {
                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                })}
                                                value={selectedTeamOptionsEdit}
                                                onChange={handleTeamChangeEdit}
                                                valueRenderer={customValueRendererTeamEdit}
                                                labelledBy="Please Select Team"
                                            />
                                        </FormControl>
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Employee Name<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <FormControl fullWidth size="small">
                                            <Selects
                                                maxMenuHeight={300}

                                                options={allUsersData?.filter(
                                                    (comp) =>
                                                        assetVariantEdit.company === comp.company &&
                                                        assetVariantEdit.branch === comp.branch &&
                                                        assetVariantEdit.unit === comp.unit && selectedTeamOptionsEdit
                                                            .map((item) => item.value)
                                                            .includes(comp.team) && !teamsArray?.filter(data => data?.username !== assetVariantEdit?.username)
                                                                .map((item) => item.username)
                                                                .includes(comp.username)
                                                )?.map(data => ({
                                                    ...data,
                                                    username: data.username,

                                                    label: data.companyname,
                                                    value: data.companyname,
                                                })).filter((item, index, self) => {
                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                })}

                                                value={{ value: employeeNameEdit, label: employeeNameEdit }}
                                                onChange={(e) => {
                                                    setEmployeeNameEdit(e.value);
                                                    const password = autoGenerateTempPasswordEdit(e.username, filterFinal.name, assetVariantEdit.service, assetVariantEdit?.remoteaddress)
                                                    setAssetVariantEdit({
                                                        ...assetVariantEdit,
                                                        username: e.username,
                                                        password: password,
                                                        autogenerate: true,
                                                        livepassword: password
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Name<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Name"
                                            value={assetVariantEdit.username}
                                            readOnly
                                        // onChange={(e) => {
                                        //     setAssetVariantEdit({
                                        //         ...assetVariantEdit,
                                        //         username: e.target.value,
                                        //     });
                                        // }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Service<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={300}
                                            options={serviceOptions}
                                            value={{
                                                label: assetVariantEdit.service,
                                                value: assetVariantEdit.service,
                                            }}
                                            onChange={(e) => {
                                                const password = autoGenerateTempPasswordEdit(assetVariantEdit.username, filterFinal.name, e.value, assetVariantEdit?.remoteaddress)

                                                setAssetVariantEdit({
                                                    ...assetVariantEdit,
                                                    service: e.value,
                                                    password: password,
                                                    autogenerate: true,
                                                    livepassword: password
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Profile<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={200}
                                            options={profileOptions}
                                            value={{
                                                label: assetVariantEdit.profile || "Please Select Profile",
                                                value: assetVariantEdit.profile || "Please Select Profile",
                                            }}
                                            onChange={(e) => {
                                                const answer = handleLocalAddress(e.localaddress);
                                                setLocalAddressBooleanEdit(answer ? true : false)
                                                handleRemoteAddressEdit(e, remoteAddressString)
                                                setAssetVariantEdit({
                                                    ...assetVariantEdit,
                                                    profile: e.value,
                                                    localaddress: answer ? answer : e.localaddress,
                                                    remoteaddress: ""
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Local Address<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        {localAddressBooleanEdit === false ? <Selects
                                            maxMenuHeight={200}
                                            options={localAddressesEdit?.map(data => ({
                                                label: data,
                                                value: data,

                                            }))}
                                            value={{ value: assetVariantEdit?.localaddress, label: assetVariantEdit?.localaddress }}
                                            onChange={(e) => {
                                                setAssetVariantEdit({
                                                    ...assetVariantEdit,
                                                    localaddress: e.value,
                                                });
                                            }}
                                        /> : <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Local Address"
                                            value={assetVariantEdit.localaddress}
                                            readOnly
                                        />}
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Remote Address
                                        </Typography>
                                        {remoteAddressEdit?.length > 0 ? <Selects
                                            maxMenuHeight={200}
                                            options={remoteAddressEdit?.map(data => ({
                                                label: data,
                                                value: data,

                                            }))}
                                            value={{ value: assetVariantEdit?.remoteaddress, label: assetVariantEdit?.remoteaddress }}
                                            onChange={(e) => {
                                                const password = autoGenerateTempPasswordEdit(assetVariantEdit.username, filterFinal.name, assetVariantEdit.service, e.value)

                                                setAssetVariantEdit({
                                                    ...assetVariantEdit,
                                                    remoteaddress: e.value,
                                                    password: password,
                                                    autogenerate: true,
                                                    livepassword: password
                                                });
                                            }}
                                        /> :
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Remote Address"
                                                value={assetVariantEdit.remoteaddress}
                                                onChange={(e) => {
                                                    const inputValue = e.target.value;
                                                    if (ipRegex.test(inputValue) && inputValue?.length <= 15) {
                                                        const password = autoGenerateTempPasswordEdit(assetVariantEdit.username, filterFinal.name, assetVariantEdit.service, inputValue)
                                                        setAssetVariantEdit({
                                                            ...assetVariantEdit,
                                                            remoteaddress: inputValue,
                                                            password: password,
                                                            autogenerate: true,
                                                            livepassword: password
                                                        });
                                                    }
                                                }}
                                            />
                                        }
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Temp Password<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            placeholder="Please Enter Password"
                                            id="outlined-adornment-password"
                                            type={assetVariantEdit?.showpassword ? "text" : "password"}
                                            value={assetVariantEdit?.autogenerate ? autoGenPasswordEdit : assetVariantEdit.password}
                                            onChange={(e) => {
                                                setAssetVariantEdit({
                                                    ...assetVariantEdit,
                                                    password: e.target.value,
                                                });
                                            }}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onMouseDown={(event) => {
                                                            event.preventDefault();
                                                        }}
                                                        onClick={(e) => {

                                                            setAssetVariantEdit({
                                                                ...assetVariantEdit,
                                                                showpassword: !assetVariantEdit?.showpassword,
                                                            });
                                                        }}
                                                        edge="end"
                                                    >
                                                        {!assetVariantEdit.showpassword ? (
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
                                                    <Checkbox checked={assetVariantEdit.autogenerate} />
                                                }
                                                onChange={(e) => {
                                                    if (!assetVariantEdit?.autogenerate) {
                                                        const password = autoGenerateTempPasswordEdit(assetVariantEdit.username, filterFinal.name, assetVariantEdit.service, assetVariantEdit?.remoteaddress);
                                                        setAssetVariantEdit({
                                                            ...assetVariantEdit,
                                                            password: password,
                                                            autogenerate: true,
                                                            livepassword: password
                                                        });
                                                    }

                                                    setAssetVariantEdit({
                                                        ...assetVariantEdit,
                                                        autogenerate: !assetVariantEdit.autogenerate,
                                                    })
                                                }

                                                }
                                                label="Auto Generate"
                                            />
                                        </FormGroup>
                                    </Grid>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Live Password<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            placeholder="Please Enter Password"
                                            id="outlined-adornment-password"
                                            type={assetVariantEdit?.showlivepassword ? "text" : "password"}
                                            value={assetVariantEdit.livepassword}
                                            onChange={(e) => {
                                                setAssetVariantEdit({
                                                    ...assetVariantEdit,
                                                    livepassword: e.target.value,
                                                });
                                            }}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onMouseDown={(event) => {
                                                            event.preventDefault();
                                                        }}
                                                        onClick={(e) => {
                                                            setAssetVariantEdit({
                                                                ...assetVariantEdit,
                                                                showlivepassword: !assetVariantEdit?.showlivepassword,
                                                            });
                                                        }}
                                                        edge="end"
                                                    >
                                                        {!assetVariantEdit.showlivepassword ? (
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
                            </Grid>
                            <br /> <br />
                            <Grid
                                container
                                spacing={2}
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Grid item md={3} xs={12} sm={12}>
                                    <Button
                                        variant="contained"
                                        onClick={editSubmit}
                                        sx={buttonStyles.buttonsubmit}
                                    >
                                        {" "}
                                        Update
                                    </Button>
                                </Grid>
                                <br />
                                <Grid item md={3} xs={12} sm={12}>
                                    <Button
                                        sx={buttonStyles.btncancel}
                                        onClick={handleCloseModEdit}
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
            {/* ADD DIALOG */}
            <Box>
                <Dialog
                    open={isAddOpen}
                    onClose={handleCloseModAdd}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="md"
                    sx={{
                        overflow: "auto",
                        "& .MuiPaper-root": {
                            overflow: "auto",
                        },
                        marginTop: "80px"
                    }}

                    fullWidth={true}
                >
                    <Box sx={{ padding: "20px 50px" }}>
                        <>
                            <Grid container spacing={2}>
                                <Typography sx={userStyle.HeaderText}>
                                    Add Mikrotik PPP Secret
                                </Typography>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ color: "red", fontWeight: "bold" }}>
                                            From Company
                                        </Typography>
                                        <Typography>
                                            {filterFinal.company}
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ color: "red", fontWeight: "bold" }}>
                                            From Branch
                                        </Typography>
                                        <Typography>
                                            {filterFinal.branch}
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ color: "red", fontWeight: "bold" }}>
                                            From Unit
                                        </Typography>
                                        <Typography>
                                            {filterFinal.unit}
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ color: "red", fontWeight: "bold" }}>
                                            Mikrotik Name
                                        </Typography>
                                        <Typography>
                                            {filterFinal.name}
                                        </Typography>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Company<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={300}
                                            options={mikrotikMaster
                                                ?.map((data) => ({
                                                    label: data.company,
                                                    value: data.company,
                                                })).filter((item, index, self) => {
                                                    return (
                                                        self.findIndex(
                                                            (i) =>
                                                                i.label === item.label && i.value === item.value
                                                        ) === index
                                                    );
                                                })}
                                            value={{
                                                label: assetVariant.company,
                                                value: assetVariant.company,
                                            }}
                                            onChange={(e) => {
                                                setAssetVariant({
                                                    ...assetVariant,
                                                    company: e.value,
                                                    branch: "Please Select Branch",
                                                    unit: "Please Select Unit",
                                                    name: "Please Select Name",
                                                    url: "",
                                                    username: "",
                                                    password: "",
                                                    livepassword: "",
                                                    autogenerate: false
                                                });
                                                setAutoGenPassword("")
                                                setSelectedTeamOptions([])
                                                setValueTeam([])
                                                setEmployeeName("Please Select Employee Name")
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Branch<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={300}
                                            options={mikrotikMaster
                                                ?.filter((comp) =>
                                                    assetVariant.company === comp.company
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
                                            value={{
                                                label: assetVariant.branch,
                                                value: assetVariant.branch,
                                            }}
                                            onChange={(e) => {
                                                setAssetVariant({
                                                    ...assetVariant,
                                                    branch: e.value,
                                                    unit: "Please Select Unit",
                                                    name: "Please Select Name",
                                                    url: "",
                                                    username: "",
                                                    password: "",
                                                    livepassword: "",
                                                    autogenerate: false
                                                });
                                                setAutoGenPassword("")
                                                setSelectedTeamOptions([])
                                                setValueTeam([])
                                                setEmployeeName("Please Select Employee Name")
                                            }}
                                        />
                                        {/* <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={filterFinal.branch}
                                            readOnly
                                        /> */}
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Unit<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={300}
                                            options={mikrotikMaster
                                                ?.filter(
                                                    (comp) =>
                                                        assetVariant.company === comp.company &&
                                                        assetVariant.branch === comp.branch
                                                )
                                                ?.map((data) => ({
                                                    label: data.unit,
                                                    value: data.unit,
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
                                            value={{
                                                label: assetVariant.unit,
                                                value: assetVariant.unit,
                                            }}
                                            onChange={(e) => {
                                                setAssetVariant({
                                                    ...assetVariant,
                                                    unit: e.value,
                                                    name: "Please Select Name",
                                                    url: "",
                                                    username: "",
                                                    password: "",
                                                    livepassword: "",
                                                    autogenerate: false
                                                });
                                                setAutoGenPassword("")
                                                setSelectedTeamOptions([])
                                                setValueTeam([])
                                                setEmployeeName("Please Select Employee Name")
                                            }}
                                        />
                                        {/* <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={filterFinal.unit}
                                            readOnly
                                        /> */}
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Team<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <FormControl fullWidth size="small">
                                            <MultiSelect size="small"
                                                options={allTeam?.filter(
                                                    (comp) =>
                                                        assetVariant.company === comp.company &&
                                                        assetVariant.branch === comp.branch &&
                                                        assetVariant.unit === comp.unit
                                                )?.map(data => ({
                                                    label: data.teamname,
                                                    value: data.teamname,
                                                })).filter((item, index, self) => {
                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                })}
                                                value={selectedTeamOptions}
                                                onChange={handleTeamChange}
                                                valueRenderer={customValueRendererTeam}
                                                labelledBy="Please Select Team"
                                            />
                                        </FormControl>
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Employee Name<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <FormControl fullWidth size="small">

                                            <Selects
                                                maxMenuHeight={300}
                                                options={allUsersData?.filter(
                                                    (comp) =>
                                                        assetVariant.company === comp.company &&
                                                        assetVariant.branch === comp.branch &&
                                                        assetVariant.unit === comp.unit && selectedTeamOptions
                                                            .map((item) => item.value)
                                                            .includes(comp.team)
                                                        && !matchedSecrets?.map((item) => item.name)
                                                            .includes(comp.username)
                                                )?.map(data => ({
                                                    ...data,
                                                    username: data.username,

                                                    label: data.companyname,
                                                    value: data.companyname,
                                                })).filter((item, index, self) => {
                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                })}
                                                value={{ value: employeeName, label: employeeName }}
                                                onChange={(e) => {
                                                    setEmployeeName(e.value);
                                                    const password = autoGenerateTempPassword(e.username, filterFinal.name, assetVariant.service, assetVariant?.remoteaddress);
                                                  
                                                    setAssetVariant({
                                                        ...assetVariant,
                                                        username: e.username,
                                                        password: password,
                                                        autogenerate: true,
                                                        livepassword: password
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Name<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Name"
                                            value={assetVariant.username}
                                            readOnly
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Service<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={300}
                                            options={serviceOptions}
                                            value={{
                                                label: assetVariant.service,
                                                value: assetVariant.service,
                                            }}
                                            onChange={(e) => {
                                                const password = autoGenerateTempPassword(assetVariant?.username, filterFinal.name, e.value, assetVariant?.remoteaddress)

                                                setAssetVariant({
                                                    ...assetVariant,
                                                    service: e.value,
                                                    password: password,
                                                    autogenerate: true,
                                                    livepassword: password
                                                });

                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Profile<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={300}
                                            options={profileOptions}
                                            value={{
                                                label: assetVariant.profile || "Please Select Profile",
                                                value: assetVariant.profile || "Please Select Profile",
                                            }}
                                            onChange={(e) => {

                                                const answer = handleLocalAddress(e.localaddress);
                                                setLocalAddressBoolean(answer ? true : false)

                                                handleRemoteAddress(e)
                                                setAssetVariant({
                                                    ...assetVariant,
                                                    profile: e.value,
                                                    localaddress: answer ? answer : e.localaddress,
                                                    remoteaddress: ""

                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Local Address<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        {localAddressBoolean === false ? <Selects
                                            maxMenuHeight={200}
                                            options={localAddresses?.map(data => ({
                                                label: data,
                                                value: data,

                                            }))}
                                            value={{ value: assetVariant?.localaddress, label: assetVariant?.localaddress }}
                                            onChange={(e) => {
                                                setAssetVariant({
                                                    ...assetVariant,
                                                    localaddress: e.value,
                                                });
                                            }}
                                        /> : <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Local Address"
                                            value={assetVariant.localaddress}
                                            readOnly
                                        />}
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Remote Address<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        {remoteAddress?.length > 0 ? <Selects
                                            maxMenuHeight={200}
                                            options={remoteAddress?.map(data => ({
                                                label: data,
                                                value: data,

                                            }))}
                                            value={{ value: assetVariant?.remoteaddress, label: assetVariant?.remoteaddress }}
                                            onChange={(e) => {
                                                const password = autoGenerateTempPassword(assetVariant?.username, filterFinal.name, assetVariant.service, e.value)
                                                setAssetVariant({
                                                    ...assetVariant,
                                                    remoteaddress: e.value,
                                                    password: password,
                                                    autogenerate: true,
                                                    livepassword: password
                                                });
                                            }}
                                        /> :
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Remote Address"
                                                value={assetVariant.remoteaddress}
                                                onChange={(e) => {
                                                    const inputValue = e.target.value;
                                                    if (ipRegex.test(inputValue) && inputValue?.length <= 15) {
                                                        const password = autoGenerateTempPassword(assetVariant?.username, filterFinal.name, assetVariant.service, inputValue)
                                                        setAssetVariant({
                                                            ...assetVariant,
                                                            remoteaddress: inputValue,
                                                            password: password,
                                                            autogenerate: true,
                                                            livepassword: password
                                                        });
                                                    }
                                                }}
                                            />}
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Temp Password<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            placeholder="Please Enter Password"
                                            id="outlined-adornment-password"
                                            type={assetVariant?.showpassword ? "text" : "password"}
                                            value={assetVariant?.autogenerate ? autoGenPassword : assetVariant.password}
                                            onChange={(e) => {
                                                setAssetVariant({
                                                    ...assetVariant,
                                                    password: e.target.value,

                                                });
                                            }}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onMouseDown={(event) => {
                                                            event.preventDefault();
                                                        }}
                                                        onClick={(e) => {
                                                            setAssetVariant({
                                                                ...assetVariant,
                                                                showpassword: !assetVariant?.showpassword,
                                                            });
                                                        }}
                                                        edge="end"
                                                    >
                                                        {!assetVariant.showpassword ? (
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
                                                    <Checkbox checked={assetVariant.autogenerate} />
                                                }
                                                onChange={(e) =>
                                                    setAssetVariant({
                                                        ...assetVariant,
                                                        autogenerate: !assetVariant.autogenerate,
                                                    })
                                                }
                                                label="Auto Generate"
                                            />
                                        </FormGroup>
                                    </Grid>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Live Password<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            placeholder="Please Enter Password"
                                            id="outlined-adornment-password"
                                            type={assetVariant?.showlivepassword ? "text" : "password"}
                                            value={assetVariant.livepassword}
                                            onChange={(e) => {
                                                setAssetVariant({
                                                    ...assetVariant,
                                                    livepassword: e.target.value,
                                                });
                                            }}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onMouseDown={(event) => {
                                                            event.preventDefault();
                                                        }}
                                                        onClick={(e) => {
                                                            setAssetVariant({
                                                                ...assetVariant,
                                                                showlivepassword: !assetVariant?.showlivepassword,
                                                            });
                                                        }}
                                                        edge="end"
                                                    >
                                                        {!assetVariant.showlivepassword ? (
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
                            </Grid>

                            <br /> <br />
                            <Grid
                                container
                                spacing={2}
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Grid item md={3} xs={12} sm={12}>
                                    <Button
                                        variant="contained"
                                        onClick={handleSubmit}
                                        sx={buttonStyles.buttonsubmit}
                                    >
                                        {" "}
                                        Submit
                                    </Button>
                                </Grid>
                                <br />
                                <Grid item md={3} xs={12} sm={12}>
                                    <Button
                                        sx={buttonStyles.btncancel}
                                        onClick={handleCloseModAdd}
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
            <br />
            {/* EXTERNAL COMPONENTS -------------- START */}
            {/* VALIDATION */}
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
            {/* PRINT PDF EXCEL CSV */}
            <ExportData
                isFilterOpen={isFilterOpen}
                handleCloseFilterMod={handleCloseFilterMod}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen}
                isPdfFilterOpen={isPdfFilterOpen}
                setIsPdfFilterOpen={setIsPdfFilterOpen}
                handleClosePdfFilterMod={handleClosePdfFilterMod}
                filteredDataTwo={filteredData ?? []}
                itemsTwo={items ?? []}
                filename={"Mikrotik PPP Secrets"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={deleteTeam}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Mikrotik PPP Secrets Info"
                addedby={singleRow?.addedby}
                updateby={singleRow?.updatedby}
            />

            {/* EXTERNAL COMPONENTS -------------- END */}
        </Box>
    );
}

export default PppSecrets;