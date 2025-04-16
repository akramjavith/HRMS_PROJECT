import React, { useState, useEffect, useRef, useContext } from "react";
import {
  TextareaAutosize,
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
  TableBody,
  Select,
  Paper,
  MenuItem,
  Dialog,
  ListItem,
  ListItemText,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Table,
  TableHead,
  TableContainer,
  Button,
} from "@mui/material";
import { userStyle } from "../../pageStyle";
import { handleApiError } from "../../components/Errorhandling";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import "jspdf-autotable";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { MultiSelect } from "react-multi-select-component";
import { useParams } from "react-router-dom";
import axios from "axios";
import Selects from "react-select";
import { SERVICE } from "../../services/Baseservice";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import { FaPrint, FaFilePdf, FaFileExcel } from "react-icons/fa";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import pdfIcon from "../../components/Assets/pdf-icon.png";
import wordIcon from "../../components/Assets/word-icon.png";
import excelIcon from "../../components/Assets/excel-icon.png";
import csvIcon from "../../components/Assets/CSV.png";
import fileIcon from "../../components/Assets/file-icons.png";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";


const useStyles = makeStyles((theme) => ({
  inputs: {
    display: "none",
  },
  preview: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: theme.spacing(2),
    "& > *": {
      margin: theme.spacing(1),
    },
    complete: {
      textTransform: "capitalize !IMPORTANT",
      padding: "7px 19px",
      backgroundColor: "#00905d",
      height: "fit-content",
    },
  },
}));



const CopyClip = ({ name }) => {
  const handleCopy = () => {
    NotificationManager.success("Copied! 👍", "", 2000);
  };
  return (
  <ListItem
    sx={{
      "&:hover": {
        cursor: "pointer",
        color: "blue",
        textDecoration: "underline",
      },
    }}
  >
    <CopyToClipboard
      onCopy={handleCopy}
      options={{ message: "Copied!" }}
      text={name}
    >
      <ListItemText primary={name} />
    </CopyToClipboard>
  </ListItem>
  )

}

function RaiseticketList() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [expandedTicketStatus, setExpandedTicketStatus] = React.useState(false);
  const [pagemap, setPagemap] = useState(1);
  const [pageSizeMap, setPageSizeMap] = useState(5);
  const [raiseTicketList, setRaiseTicketList] = useState([]);
  const [checkPointsRaise, setCheckPointsRaise] = useState([]);
  const [checkPointsMaster, setCheckPointsMaster] = useState([]);
  const [textAreaCloseDetails, setTextAreaCloseDetails] = useState("");
  const [statusMaster, setStatusMaster] = useState([]);
  const [employeesName, setEmployeesName] = useState([]);
  const [statusMasterValue, setStatusMasterValue] = useState(
    "Please Select Status"
  );
  const [RequestChange, setRequestChange] = useState("Please Select Master");
  const [compSubComp, setCompSubComp] = useState([]);
  const [employeenameValue, setEmployeeNameValue] = useState([]);
  const [employeeOptionValues, setEmployeeOptionValues] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess } = useContext(
    UserRoleAccessContext
  );
  const { auth } = useContext(AuthContext);
  const gridRef = useRef(null);
  const [showAlert, setShowAlert] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [checkingAnsLength, setcheckingAnsLength] = useState([]);
  const [pagemapCheck, setPagemapCheck] = useState(1);
  const [pageSizeMapCheck, setPageSizeMapCheck] = useState(5);
  const [CheckingTableModification, setCheckingTableModification] = useState(
    []
  );
  const [resolvernames, setResolvernames] = useState([]);
  const [raiserUserData, setRaiserUserData] = useState([]);
  // Error Popup model

  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  const handleExpansion = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };
  const handleExpansionTicketStatus = () => {
    setExpandedTicketStatus((prevExpanded) => !prevExpanded);
  };

  const backPage = useNavigate();

  const [resolverReasonOptions, setResolverReasonOptions] = useState([]);
  const [resolverReason, setResolverReason] = useState(
    "Please Select Resolver Reason"
  );

  //get all project.

  const ids = useParams().id;

  const statusOpt = [
    { label: "Details Needed", value: "Details Needed" },
    { label: "Closed", value: "Closed" },
    { label: "Forwarded", value: "Forwarded" },
    { label: "Hold", value: "Hold" },
    { label: "Reject", value: "Reject" },
    { label: "In-Repair",value: "In-Repair" },
  ];

  const statusOptRepair = [
    { label: "Details Needed", value: "Details Needed" },
    { label: "Closed", value: "Closed" },
    { label: "Forwarded", value: "Forwarded" },
    { label: "Hold", value: "Hold" },
    { label: "Reject", value: "Reject" },
    { label: "In-Repair",value: "In-Repair" },
  ];

  const fetchAllRaisedTickets = async () => {
    try {
      let res_queue = await axios.get(`${SERVICE.RAISETICKET_SINGLE}/${ids}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setRaiseTicketList(res_queue?.data?.sraiseticket);
      let raiseTicketData = res_queue?.data?.sraiseticket;

      await fetchRaiserUsersData(res_queue?.data?.sraiseticket?.raisedby);

      setCheckingTableModification(
        res_queue?.data?.sraiseticket?.checkingNewtable.length > 0
          ? res_queue?.data?.sraiseticket?.checkingNewtable
          : []
      );
      const ans = [
        "SNO",
        "User Name",
        ...res_queue?.data?.sraiseticket?.checkingNewtable[0]?.total.map(
          (data) => data?.details
        ),
      ];
      setcheckingAnsLength(ans);
      setCheckPointsRaise(
        res_queue?.data?.sraiseticket?.selfcheckpointsmaster[0]?.checkpointgrp
      );
      await fetchChechPointsMaster(res_queue?.data?.sraiseticket);
      fetchComponentSubComponent(
        res_queue?.data?.sraiseticket,
        res_queue?.data?.sraiseticket?.materialnamecut,
        res_queue?.data?.sraiseticket?.workstation
      );
    } catch (err) {
      // handleApiError(err, setShowAlert, handleClickOpenerr);
    }  };

  const fetchStatusMaster = async () => {
    try {
      let res_queue = await axios.get(SERVICE.ALL_STATUSMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let answer =
        res_queue.data.statusMaster.length > 0
          ? res_queue.data.statusMaster
          : [];
      setStatusMaster(
        answer.map((data) => ({
          ...data,
          label: data.name,
          value: data.name,
        }))
      );
    } catch (err) {
      // handleApiError(err, setShowAlert, handleClickOpenerr);
    }  };
  const fetchChechPointsMaster = async (value) => {
    try {
      let res_queue = await axios.get(SERVICE.CHECKPOINTTICKET, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let answer =
        value.subsubcategory === "Please Select Sub Sub-Category" ||
        value.subsubcategory === ""
          ? res_queue?.data?.checkpointticketmasters?.find(
              (data) =>
                data?.category.includes(value?.category) &&
                data?.subcategory.includes(value?.subcategory) &&
                data?.type === value?.type &&
                data?.reason === value?.reason
            )
          : res_queue?.data?.checkpointticketmasters?.find(
              (data) =>
                data?.category.includes(value?.category) &&
                data?.subcategory.includes(value?.subcategory) &&
                data?.subsubcategory.includes(value?.subsubcategory) &&
                data?.type === value?.type &&
                data?.reason === value?.reason
            );

      setCheckPointsMaster(answer);
    } catch (err) {
      // handleApiError(err, setShowAlert, handleClickOpenerr);
    }  };

  const fetchResolverDetails = async () => {
    try {
      let res_due = await axios.get(SERVICE.TEAMGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const access =
        raiseTicketList.subsubcategory === "" ||
        raiseTicketList.subsubcategory === "Please Select Sub Sub-Category"
          ? "subcatgeory"
          : "subsubcatgeory";
      let CatgeorySubCatgeoryOnly = res_due?.data?.teamgroupings?.filter(
        (data) =>
          raiseTicketList.employeename?.some((item) =>
            data?.employeenamefrom.includes(item)
          ) &&
          data?.categoryfrom.includes(raiseTicketList.category) &&
          data?.subcategoryfrom.includes(raiseTicketList.subcategory) &&
          data.subsubcategoryfrom.length < 1
      );
      let CatgeorySubSubCatgeoryOnly = res_due?.data?.teamgroupings?.filter(
        (data) =>
          raiseTicketList.employeename?.some((item) =>
            data?.employeenamefrom.includes(item)
          ) &&
          data?.categoryfrom.includes(raiseTicketList.category) &&
          data?.subcategoryfrom.includes(raiseTicketList.subcategory) &&
          data.subsubcategoryfrom.includes(raiseTicketList.subsubcategory)
      );

      let EmployeeCatgeorySubCatgeory = res_due?.data?.teamgroupings?.filter(
        (data) =>
          data.employeenamefrom.includes(isUserRoleAccess.companyname) &&
          data?.categoryfrom.includes(raiseTicketList.category) &&
          data?.subcategoryfrom.includes(raiseTicketList.subcategory) &&
          data.subsubcategoryfrom.length < 1
      );
      let EmployeeCatgeorySubSubCatgeory = res_due?.data?.teamgroupings?.filter(
        (data) =>
          data.employeenamefrom.includes(isUserRoleAccess.companyname) &&
          data?.categoryfrom.includes(raiseTicketList.category) &&
          data?.subcategoryfrom.includes(raiseTicketList.subcategory) &&
          data.subsubcategoryfrom.includes(raiseTicketList.subsubcategory)
      );

      let checkingConditions =
        access === "subcatgeory" && raiseTicketList.accessdrop === "Manager"
          ? CatgeorySubCatgeoryOnly
          : access === "subsubcatgeory" &&
            raiseTicketList.accessdrop === "Manager"
          ? CatgeorySubSubCatgeoryOnly
          : access === "subcatgeory" &&
            raiseTicketList.accessdrop === "Employee"
          ? EmployeeCatgeorySubCatgeory
          : EmployeeCatgeorySubSubCatgeory;

      const resolvedBy =
        checkingConditions.length > 0
          ? checkingConditions?.flatMap((data) => data.employeenameto)
          : [];

      setResolvernames(resolvedBy);
    } catch (err) {
      // handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    fetchResolverDetails();
  }, [raiseTicketList]);

  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };
  //first allexcel....
  const getFileIcon = (fileName) => {
    const extension1 = fileName?.split(".").pop();
    switch (extension1) {
      case "pdf":
        return pdfIcon;
      case "doc":
      case "docx":
        return wordIcon;
      case "xls":
      case "xlsx":
        return excelIcon;
      case "csv":
        return csvIcon;
      default:
        return fileIcon;
    }
  };

  const fetchComponentSubComponent = async (ticket, material, workstation) => {
    try {
      const [res_queue, res_queue_user] = await Promise.all([
        axios.post(SERVICE.ASSETDETAIL, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          material:material,
          workstation: workstation,
        }),
        axios.get(SERVICE.USER, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        })
      ])

      //getting Single User
      let userDetails = res_queue_user.data.users.filter((data) =>
        ticket.employeename.includes(data.companyname)
      );

      //Conditions
      let accessBasedCompany =
        ticket.accessdrop === "Manager" &&
        ticket.branch === "ALL" &&
        ticket.unit === "ALL"
          ? res_queue.data.assetdetails.filter(
              (data) =>
                ticket?.company?.includes(data.company) &&
                data.material === material &&
                data.workstation === workstation
            )
          : [];
      let accessBasedBranch =
        ticket.accessdrop === "Manager" && ticket.unit === "ALL"
          ? res_queue.data.assetdetails.filter(
              (data) =>
                ticket?.company?.includes(data.company) &&
                ticket.branch === data.branch &&
                data.material === material &&
                data.workstation === workstation
            )
          : [];
      let accessBasedUnit =
        ticket.accessdrop === "Manager"
          ? res_queue.data.assetdetails.filter(
              (data) =>
                ticket?.company?.includes(data.company) &&
                ticket.branch === data.branch &&
                ticket.unit === data.unit &&
                data.material === material &&
                data.workstation === workstation
            )
          : [];

      let resultMaterialsSelf = res_queue.data.assetdetails.filter(
        (data) =>
          userDetails[0]?.company === data.company &&
          userDetails[0].branch === data.branch &&
          userDetails[0].unit === data.unit &&
          data.material === material &&
          data.workstation === workstation
      );

      let Conclude =
        ticket.accessdrop === "Manager" &&
        ticket.branch === "ALL" &&
        ticket.unit === "ALL"
          ? accessBasedCompany
          : ticket.accessdrop === "Manager" && ticket.unit === "ALL"
          ? accessBasedBranch
          : ticket.accessdrop === "Manager"
          ? accessBasedUnit
          : resultMaterialsSelf;

      setCompSubComp(Conclude);
    } catch (err) {
      // handleApiError(err, setShowAlert, handleClickOpenerr);
    }  };
  const fetchRaiserUsersData = async (user) => {
    try {
      let res_queue_user = await axios.get(SERVICE.USER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let ans = res_queue_user.data.users.find(
        (data) => data.companyname === user
      );
      setRaiserUserData(ans);
    } catch (err) {
      // handleApiError(err, setShowAlert, handleClickOpenerr);
    }  };

  let updateby = raiseTicketList.updatedby;
  const username = isUserRoleAccess.username;

  //Resolve Conditions
  const handleResolved = (e) => {
    e.preventDefault();

    if (statusMasterValue === "Please Select Status") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Status"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      resolverReason === "Please Select Resolver Reason" ||
      resolverReason == "" ||
      resolverReason == undefined
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Resolver Reason"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      resolverReason === "Other" &&
      (textAreaCloseDetails === "" || textAreaCloseDetails === undefined)
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Reason"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      checkPointsMaster?.checkpointgrp?.length > 0 &&
      statusMasterValue === "Closed" &&
      checkPointsMaster?.checkpointgrp?.some(
        (data) => data.checked !== true || data.checked === undefined
      )
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Check All CheckBox to Re-Solve this Raise Issue"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendResolveRequest();
    }
  };

  const sendResolveRequest = async () => {
    try {
      let res = await axios.put(`${SERVICE.RAISETICKET_SINGLE}/${ids}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        raiseself: statusMasterValue,
        ticketclosed: isUserRoleAccess.companyname,
        resolvedate: moment(new Date()).format("DD-MM-YYYY hh:mm:ss a"),
        raisefilterissues: checkPointsMaster?.checkpointgrp,
        resolverreason: resolverReason,
        forwardedlog: [
          ...forwardlog,
          {
            names: raiseTicketList.employeename,
            status: statusMasterValue,
            date: moment(new Date()).format("DD-MM-YYYY hh:mm:ss a"),
            reason:
              resolverReason === "Other"
                ? textAreaCloseDetails
                : resolverReason,
            //  claimreason: raiseTicketList.description,
            forwardedby: isUserRoleAccess.companyname,
          },
        ],
        textAreaCloseDetails: textAreaCloseDetails,
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });

      backPage("/tickets/raiseticketteam");
    } catch (err) {
      // handleApiError(err, setShowAlert, handleClickOpenerr);
    }  };

  const fetchEmployeeNames = async () => {
    try {
      let hierarchy = await axios.post(SERVICE.RAISE_HIERARCHY_FORWARD, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        empname: raiseTicketList.raisedby,
      });

      const details = hierarchy.data.raisetickets.filter(
        (data) =>
          data !== raiseTicketList.raisedby &&
          data !== isUserRoleAccess.companyname
      );
      const detailsFimal = [...new Set(details)];
      setEmployeesName(
        detailsFimal.map((data) => ({
          label: data,
          value: data,
        }))
      );
    } catch (err) {
      // handleApiError(err, setShowAlert, handleClickOpenerr);
    }  };

  const sendRejectRequest = async () => {
    try {
      let res = await axios.put(`${SERVICE.RAISETICKET_SINGLE}/${ids}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        raiseself: statusMasterValue,
        raisefilterissues: checkPointsMaster?.checkpointgrp,
        textAreaCloseDetails: textAreaCloseDetails,
        resolverreason: resolverReason,
        forwardedlog: [
          ...forwardlog,
          {
            names: raiseTicketList.employeename,
            status: statusMasterValue,
            date: moment(new Date()).format("DD-MM-YYYY hh:mm:ss a"),
            reason:
              resolverReason === "Other"
                ? textAreaCloseDetails
                : resolverReason,
            //  claimreason: raiseTicketList.description,
            forwardedby: isUserRoleAccess.companyname,
          },
        ],
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });

      backPage("/tickets/raiseticketteam");
    } catch (err) {
      // handleApiError(err, setShowAlert, handleClickOpenerr);
    }  };

  //Forward Conditions
  const handleforward = (e) => {
    e.preventDefault();

    if (statusMasterValue === "Please Select Status") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Status"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (employeeOptionValues?.length < 1) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Employee Name"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      resolverReason === "Please Select Resolver Reason" ||
      resolverReason == "" ||
      resolverReason == undefined
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Resolver Reason"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      resolverReason === "Other" &&
      (textAreaCloseDetails === "" || textAreaCloseDetails === undefined)
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Reason"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendForwardRequest();
    }
  };
  //Reject Conditions
  const handleReject = (e) => {
    e.preventDefault();

    if (statusMasterValue === "Please Select Status") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Status"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      resolverReason === "Please Select Resolver Reason" ||
      resolverReason == "" ||
      resolverReason == undefined
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Resolver Reason"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      resolverReason === "Other" &&
      (textAreaCloseDetails === "" || textAreaCloseDetails === undefined)
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Reason"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendRejectRequest();
    }
  };

  //In-Repair Conditions
  const handleRepair = (e) => {
    e.preventDefault();

    if (statusMasterValue === "Please Select Status") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Status"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      resolverReason === "Please Select Resolver Reason" ||
      resolverReason == "" ||
      resolverReason == undefined
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Resolver Reason"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      resolverReason === "Other" &&
      (textAreaCloseDetails === "" || textAreaCloseDetails === undefined)
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Reason"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendRepairRequest();
    }
  };

  const sendRepairRequest = async () => {
    try {
      let res = await axios.put(`${SERVICE.RAISETICKET_SINGLE}/${ids}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        raiseself: statusMasterValue,
        raisefilterissues: checkPointsMaster?.checkpointgrp,
        textAreaCloseDetails: textAreaCloseDetails,
        resolverreason: resolverReason,
        forwardedlog: [
          ...forwardlog,
          {
            names: raiseTicketList.employeename,
            status: statusMasterValue,
            date: moment(new Date()).format("DD-MM-YYYY hh:mm:ss a"),
            reason:
              resolverReason === "Other"
                ? textAreaCloseDetails
                : resolverReason,
            //  claimreason: raiseTicketList.description,
            forwardedby: isUserRoleAccess.companyname,
          },
        ],
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await sendAssetRepair();

      backPage("/tickets/raiseticketteam");
    } catch (err) {
      // handleApiError(err, setShowAlert, handleClickOpenerr);
    }  };

  const sendAssetRepair = async () => {
    try {
      let res = await axios.put(`${SERVICE.ASSETDETAIL_SINGLE_REPAIR}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        materialcode: String(raiseTicketList?.materialcode),
        status: "Repair",
        assignedthrough: "TICKET",
        ticketid: ids,
      });
    } catch (err) {
      // handleApiError(err, setShowAlert, handleClickOpenerr);
    }  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Raise Ticket",
    pageStyle: "print",
  });

  const forwardlog = raiseTicketList?.forwardedlog;

  const sendForwardRequest = async () => {
    try {
      let res = await axios.put(`${SERVICE.RAISETICKET_SINGLE}/${ids}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        raiseself: statusMasterValue,
        textAreaCloseDetails: textAreaCloseDetails,
        resolverreason: resolverReason,
        forwardedemployee: [...employeeOptionValues],
        forwardedlog: [
          ...forwardlog,
          {
            names: [...employeeOptionValues],
            status: statusMasterValue,
            date: moment(new Date()).format("DD-MM-YYYY hh:mm:ss a"),
            reason:
              resolverReason === "Other"
                ? textAreaCloseDetails
                : resolverReason,
            //  claimreason: raiseTicketList.description,
            forwardedby: isUserRoleAccess.companyname,
          },
        ],
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });

      backPage("/tickets/raiseticketteam");
    } catch (err) {
      // handleApiError(err, setShowAlert, handleClickOpenerr);
    }  };
  const navigate = useNavigate();

  const handleNavigate = (e, category, subcategory, subsubcategory) => {
    // const dataString = encodeURIComponent(JSON.stringify(dataObject));
    if (e === "Required Master") {
      // backPage('/tickets/requiredmaster' , "Rahul")
      navigate(
        `/tickets/requiredmaster?data=${category},${subcategory},${subsubcategory}`,
        { replace: true }
      );
    } else if (e === "Self Check Points Master") {
      navigate(
        `/tickets/selfcheckpointticketmaster?data=${category},${subcategory},${subsubcategory}`,
        { replace: true }
      );
    } else if (e === "Check Points Master") {
      navigate(
        `/tickets/chekpointticketmaster?data=${category},${subcategory},${subsubcategory}`,
        { replace: true }
      );
    } else if (e === "Reason Master") {
      navigate(
        `/tickets/reasonmaster?data=${category},${subcategory},${subsubcategory}`,
        { replace: true }
      );
    }
  };

  //Resend Conditions
  const handleResend = (e) => {
    e.preventDefault();

    if (statusMasterValue === "Please Select Status") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Status"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      resolverReason === "Please Select Resolver Reason" ||
      resolverReason == "" ||
      resolverReason == undefined
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Resolver Reason"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      resolverReason === "Other" &&
      (textAreaCloseDetails === "" || textAreaCloseDetails === undefined)
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Reason"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendResendRequest();
    }
  };
  const sendResendRequest = async () => {
    try {
      let res = await axios.put(`${SERVICE.RAISETICKET_SINGLE}/${ids}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        raiseself: statusMasterValue,
        textAreaCloseDetails: textAreaCloseDetails,
        resolverreason: resolverReason,
        forwardedlog: [
          ...forwardlog,
          {
            names: raiseTicketList.employeename,
            status: statusMasterValue,
            date: moment(new Date()).format("DD-MM-YYYY hh:mm:ss a"),
            reason:
              resolverReason === "Other"
                ? textAreaCloseDetails
                : resolverReason,
            //  claimreason: raiseTicketList.description,
            forwardedby: isUserRoleAccess.companyname,
          },
        ],
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });

      backPage("/tickets/raiseticketteam");
    } catch (err) {
      // handleApiError(err, setShowAlert, handleClickOpenerr);
    }  };

  //Hold Conditions
  const handleHold = (e) => {
    e.preventDefault();

    if (statusMasterValue === "Please Select Status") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Status"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      resolverReason === "Please Select Resolver Reason" ||
      resolverReason == "" ||
      resolverReason == undefined
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Resolver Reason"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      resolverReason === "Other" &&
      (textAreaCloseDetails === "" || textAreaCloseDetails === undefined)
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Reason"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendHoldRequest();
    }
  };

  const sendHoldRequest = async () => {
    try {
      let res = await axios.put(`${SERVICE.RAISETICKET_SINGLE}/${ids}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        raiseself: statusMasterValue,
        textAreaCloseDetails: textAreaCloseDetails,
        resolverReason: resolverReason,
        forwardedlog: [
          ...forwardlog,
          {
            names: raiseTicketList.employeename,
            status: statusMasterValue,
            date: moment(new Date()).format("DD-MM-YYYY hh:mm:ss a"),
            reason:
              resolverReason === "Other"
                ? textAreaCloseDetails
                : resolverReason,
            //  claimreason: raiseTicketList.description,
            forwardedby: isUserRoleAccess.companyname,
          },
        ],
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });

      backPage("/tickets/raiseticketteam");
    } catch (err) {
      // handleApiError(err, setShowAlert, handleClickOpenerr);
    }  };

  //company multiselect dropdown changes
  const handleEmployeeNames = (options) => {
    setEmployeeNameValue(options);
    setEmployeeOptionValues(
      options.map((a, index) => {
        return a.value;
      })
    );
  };

  const customValueEmployeesName = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Employee Name";
  };

  useEffect(() => {
    fetchAllRaisedTickets();
    fetchStatusMaster();
  }, []);

  const fetchResolverReasons = async (e) => {
    try {
      let res_vendor = await axios.get(SERVICE.RESOLVERREASONMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let fndata = res_vendor?.data?.reasonmasters;
      let resolverData = fndata
        .filter((data) => data.reasons === e)
        .map((data, index) => {
          return data.namereason;
        });

      let finalArray = resolverData.map((item) => {
        return {
          label: item,
          value: item,
        };
      });

      // newarray = [...new Set(subbrandid)]
      const uniqueArray = finalArray.filter((item, index, self) => {
        return (
          self.findIndex(
            (i) => i.label === item.label && i.value === item.value
          ) === index
        );
      });

      setResolverReasonOptions([
        ...uniqueArray,
        { label: "Other", value: "Other" },
      ]);
    } catch (err) {
      // handleApiError(err, setShowAlert, handleClickOpenerr);
    }  };

  const getDownloadFile = async (file) => {
    try {
      //Rendering File
      const response = await fetch(file.preview);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      window.open(link, "_blank");
    } catch (err) {
      // handleApiError(err, setShowAlert, handleClickOpenerr);
    }  };

  // Function to remove HTML tags and convert to numbered list
  const convertToNumberedList = (htmlContent) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = htmlContent;

    const listItems = Array.from(tempElement.querySelectorAll("li"));
    listItems.forEach((li, index) => {
      li.innerHTML = `\u2022 ${li.innerHTML}\n`;
    });

    return tempElement.innerText;
  };

  const handleClick = (ind, value) => {
    const updatedTodos = [...checkPointsMaster.checkpointgrp];

    updatedTodos[ind].checked = value.target.checked;
    checkPointsMaster.checkpointgrp = updatedTodos;
    setCheckPointsMaster((data) => {
      return { ...data, checkpointgrp: updatedTodos };
    });
  };
  const handleClickClose = () => {
    backPage("/tickets/raiseticketteam");
  };

  const [itemsmap, setItemsMap] = useState([]);
  const [itemsmapCheck, setItemsMapCheck] = useState([]);

  const addSerialNumberMap = () => {
    const itemsWithSerialNumbers = CheckingTableModification?.map(
      (item, index) => ({
        ...item,
        serialNumber: index + 1,
        checkbox: item._id,
      })
    );
    setItemsMapCheck(itemsWithSerialNumbers);
  };
  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };
  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);
  useEffect(() => {
    addSerialNumberMap();
  }, [CheckingTableModification]);

  //sorting for unalloted list table

  //Datatable
  const handlePageChangeMapCheck = (newPage) => {
    setPagemapCheck(newPage);
  };

  const handlePageSizeChangeMapCheck = (event) => {
    setPageSizeMapCheck(Number(event.target.value));
    setPagemapCheck(1);
  };

  //datatable....
  const [searchQueryMap, setSearchQueryMap] = useState("");


  // Split the search query into individual terms
  const searchOverTerms = searchQueryMap.toLowerCase().split(" ");

  // Modify the filtering logic to check each term
  const filteredDatasmap = itemsmap?.filter((item) => {
    return searchOverTerms.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
  });
  const filteredDatasmapCheck = itemsmapCheck?.filter((item) => {
    return searchOverTerms.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
  });


  const filteredDatamapCheck = filteredDatasmapCheck?.slice(
    (pagemapCheck - 1) * pageSizeMapCheck,
    pagemapCheck * pageSizeMapCheck
  );

  const totalPagesmap = Math.ceil(filteredDatasmap?.length / pageSizeMap);
  const totalPagesmapCheck = Math.ceil(
    filteredDatasmapCheck?.length / pageSizeMapCheck
  );

  const visiblePagesmap = Math.min(totalPagesmap, 3);
  const visiblePagesmapCheck = Math.min(totalPagesmapCheck, 3);

  const firstVisiblePagemap = Math.max(1, pagemap - 1);
  const firstVisiblePagemapCheck = Math.max(1, pagemapCheck - 1);
  const lastVisiblePagemap = Math.min(
    firstVisiblePagemap + visiblePagesmap - 1,
    totalPagesmap
  );
  const lastVisiblePagemapCheck = Math.min(
    firstVisiblePagemapCheck + visiblePagesmapCheck - 1,
    totalPagesmapCheck
  );

  const pageNumbersmap = [];
  const pageNumbersmapCheck = [];


  for (let i = firstVisiblePagemap; i <= lastVisiblePagemap; i++) {
    pageNumbersmap.push(i);
  }
  for (let i = firstVisiblePagemapCheck; i <= lastVisiblePagemapCheck; i++) {
    pageNumbersmapCheck.push(i);
  }

  return (
    <Box>
      <Headtitle title={"RAISE TICKET FILTER VIEW"} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>
        Raise Ticket Filter View
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
            <NotificationContainer />
          </Box>
      {!raiseTicketList ? (
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
          {isUserRoleCompare?.includes("lmyactionableticket") && (
            <>
              <Box sx={userStyle.dialogbox}>
                <Grid container spacing={2}>
                  <Grid
                    item
                    md={9}
                    xs={12}
                    sm={12}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <Typography sx={{ fontSize: "18px" }}>
                      <b>{raiseTicketList.title}</b>
                    </Typography>
                    <Typography
                      sx={{
                        backgroundColor:
                          raiseTicketList.priority?.toLowerCase() === "high"
                            ? "red"
                            : raiseTicketList.priority?.toLowerCase() ===
                              "medium"
                            ? "orangered"
                            : "green",
                        color: "white",
                        paddingLeft: 1,
                        paddingRight: 1,
                        borderRadius: 2,
                      }}
                    >
                      {raiseTicketList.priority?.toLowerCase()}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    md={3}
                    xs={12}
                    sm={12}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <Typography sx={{ fontSize: "18px" }}>
                      Ticket Status :
                    </Typography>
                    <Stack spacing={1} alignItems="center">
                      <Stack direction="row" spacing={1}>
                        <Chip
                          label={raiseTicketList.raiseself}
                          color="primary"
                        />
                      </Stack>
                    </Stack>
                  </Grid>
                  <br />
                  <br />
                  <br />
                  <br />
                  {raiseTicketList.accessdrop === "Manager" ? (
                    <>
                      <Grid item md={4} xs={12} sm={12}>
                        <FormControl
                          fullWidth
                          size="small"
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <Typography>
                            <b>Company : </b>
                          </Typography>
                          <Typography>{raiseTicketList.company}</Typography>
                        </FormControl>
                      </Grid>
                      <Grid item md={2.5} xs={12} sm={12}>
                        <FormControl
                          fullWidth
                          size="small"
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <Typography>
                            <b>Branch : </b>
                          </Typography>
                          <Typography>{raiseTicketList.branch}</Typography>
                        </FormControl>
                      </Grid>
                      <Grid item md={2.5} xs={12} sm={12}>
                        <FormControl
                          fullWidth
                          size="small"
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <Typography>
                            <b>Unit : </b>
                          </Typography>
                          <Typography>{raiseTicketList.unit}</Typography>
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl
                          fullWidth
                          size="small"
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <Typography>
                            <b>Team : </b>
                          </Typography>
                          <Typography>{raiseTicketList.team}</Typography>
                        </FormControl>
                      </Grid>
                    </>
                  ) : (
                    ""
                  )}
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl
                      fullWidth
                      size="small"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <Typography>
                        <b>Category : </b>
                      </Typography>
                      <Typography>{raiseTicketList.category}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl
                      fullWidth
                      size="small"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <Typography>
                        <b>Sub-Category : </b>
                      </Typography>
                      <Typography>{raiseTicketList.subcategory}</Typography>
                    </FormControl>
                  </Grid>

                  {raiseTicketList.subsubcategory ===
                    "Please Select Sub Sub-category" ||
                  raiseTicketList.subsubcategory === "" ? (
                    <Grid item md={6} xs={12} sm={12}></Grid>
                  ) : (
                    <>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl
                          fullWidth
                          size="small"
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <Typography>
                            <b>Sub Sub-Category : </b>
                          </Typography>
                          <Typography>
                            {raiseTicketList.subsubcategory}
                          </Typography>
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}></Grid>
                    </>
                  )}

                  {/* 3rd Row */}
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl
                      fullWidth
                      size="small"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <Typography>
                        <b>Type : </b>
                      </Typography>
                      <Stack spacing={1} alignItems="center">
                        <Stack direction="row" spacing={1}>
                          <Chip label={raiseTicketList.type} color="primary" />
                        </Stack>
                      </Stack>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl
                      fullWidth
                      size="small"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <Typography>
                        <b>Reason : </b>
                      </Typography>
                      <Stack spacing={1} alignItems="center">
                        <Stack direction="row" spacing={1}>
                          <Chip
                            label={raiseTicketList.reason}
                            color="success"
                          />
                        </Stack>
                      </Stack>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    {" "}
                  </Grid>

                  {/* 4th Row */}
                  {compSubComp[0]?.component ? (
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl
                        fullWidth
                        size="small"
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <Typography>
                          <b>Component Name : </b>
                        </Typography>
                        <Typography>{compSubComp[0]?.component}</Typography>
                      </FormControl>
                    </Grid>
                  ) : (
                    <Grid item md={3} xs={12} sm={12}>
                      {" "}
                    </Grid>
                  )}
                  {compSubComp[0]?.subcomponent ? (
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl
                        fullWidth
                        size="small"
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <Typography>
                          <b>Sub-Component Name : </b>
                        </Typography>
                        <Typography>
                          {compSubComp[0]?.subcomponent
                            ?.map((t, i) => `${i + 1 + ". "}` + t.subname)
                            .toString()}
                        </Typography>
                      </FormControl>
                    </Grid>
                  ) : (
                    <Grid item md={3} xs={12} sm={12}>
                      {" "}
                    </Grid>
                  )}

                  {raiseTicketList.workstation ===
                  "Please Select Work Station" ? (
                    <Grid item md={3} xs={12} sm={12}>
                      {" "}
                    </Grid>
                  ) : (
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl
                        fullWidth
                        size="small"
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <Typography>
                          <b>Work Station : </b>
                        </Typography>
                        <Typography>{raiseTicketList.workstation}</Typography>
                      </FormControl>
                    </Grid>
                  )}
                  {raiseTicketList.materialname !==
                    "Please Select Material Name" &&
                  raiseTicketList.materialname !== "" ? (
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl
                        fullWidth
                        size="small"
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <Typography>
                          <b>Material Name: </b>
                        </Typography>
                        <Typography>{raiseTicketList.materialname}</Typography>
                      </FormControl>
                    </Grid>
                  ) : (
                    <Grid item md={3} xs={12} sm={12}>
                      {" "}
                    </Grid>
                  )}

                  {/* 5th Row */}

                  {raiserUserData && (
                    <>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl
                          fullWidth
                          size="small"
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <Typography>
                            <b>Raiser Company:</b>
                          </Typography>

                          <Typography>{raiserUserData?.company}</Typography>
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl
                          fullWidth
                          size="small"
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <Typography>
                            <b>Raiser Branch:</b>
                          </Typography>

                          <Typography>{raiserUserData?.branch}</Typography>
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl
                          fullWidth
                          size="small"
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <Typography>
                            <b>Raiser Unit:</b>
                          </Typography>

                          <Typography>{raiserUserData?.unit}</Typography>
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl
                          fullWidth
                          size="small"
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <Typography>
                            <b>Raiser Team:</b>
                          </Typography>

                          <Typography>{raiserUserData?.team}</Typography>
                        </FormControl>
                      </Grid>
                    </>
                  )}

                  {/* 6th Row */}
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl
                      fullWidth
                      size="small"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <Typography>
                        <b>Issues Raised By : </b>
                      </Typography>
                      <br></br>
                      <Typography>{raiseTicketList.raisedby}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl
                      fullWidth
                      size="small"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <Typography>
                        <b>Issues Raised Date : </b>
                      </Typography>
                      <br></br>
                      <Typography>{raiseTicketList.raiseddate}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    {raiseTicketList.duedate && (
                      <FormControl
                        fullWidth
                        size="small"
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <Typography>
                          <b>Issues Due Date : </b>
                        </Typography>
                        <br></br>
                        <Stack spacing={1} alignItems="center">
                          <Stack direction="row" spacing={1}>
                            <Chip
                              label={raiseTicketList.duedate}
                              color="error"
                            />
                          </Stack>
                        </Stack>
                      </FormControl>
                    )}
                  </Grid>
                  <Grid item md={12} xs={12} sm={12}>
                    <FormControl
                      fullWidth
                      size="small"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <Typography>
                        <b>Issues Raised for : </b>
                      </Typography>
                      <br></br>
                      <Typography>
                        {raiseTicketList.employeename?.map((t, i) => (
                          <span
                            key={i}
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {t}
                          </span>
                        ))}
                      </Typography>
                    </FormControl>
                  </Grid>

                  <br></br>
                  <br></br>
                  <br></br>
                  <Grid item md={12} xs={12} sm={12}>
                    <FormControl
                      fullWidth
                      size="small"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <Typography>
                        <b>Ticket Issues:</b>
                      </Typography>
                      <ReactQuill
                        readOnly
                        style={{ maxHeight: "180px", height: "150px" }}
                        value={raiseTicketList?.description}
                        modules={{
                          toolbar: [
                            [{ header: "1" }, { header: "2" }, { font: [] }],
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
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                  </Grid>
                  {raiseTicketList?.files?.length > 0 && (
                    <Grid item md={12} xs={12} sm={12}>
                      <FormControl
                        fullWidth
                        size="small"
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <Typography>
                          <b>Issues Proof:</b>
                        </Typography>
                        {raiseTicketList?.files?.map((file, index) => (
                          <Grid container key={index}>
                            <Grid item md={1} sm={2} xs={2}>
                              <Box
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {file.type.includes("image/") ? (
                                  <img
                                    src={file.preview}
                                    alt={file.name}
                                    height={50}
                                    style={{
                                      maxWidth: "-webkit-fill-available",
                                    }}
                                  />
                                ) : (
                                  <img
                                    className={classes.preview}
                                    src={getFileIcon(file.name)}
                                    height="10"
                                    alt="file icon"
                                  />
                                )}
                              </Box>
                            </Grid>
                            <Grid
                              item
                              md={4}
                              sm={7}
                              xs={7}
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Typography variant="subtitle2">
                                {" "}
                                {file.name}{" "}
                              </Typography>
                            </Grid>
                            <Grid item md={1} sm={1} xs={1}>
                              <Grid sx={{ display: "flex" }}>
                                <Button
                                  sx={{
                                    padding: "14px 14px",
                                    minWidth: "40px !important",
                                    borderRadius: "50% !important",
                                    ":hover": {
                                      backgroundColor: "#80808036", // theme.palette.primary.main
                                    },
                                  }}
                                  onClick={() => renderFilePreview(file)}
                                >
                                  <VisibilityOutlinedIcon
                                    style={{
                                      fontsize: "12px",
                                      color: "#357AE8",
                                    }}
                                  />
                                </Button>
                              </Grid>
                            </Grid>
                          </Grid>
                        ))}
                      </FormControl>
                      <br></br>
                    </Grid>
                  )}
                  <Grid item md={12} xs={12} sm={12}>
                    {CheckingTableModification?.length > 0 && (
                      <>
                        <Typography>
                          <b>Required Fields</b>
                        </Typography>
                        {filteredDatamapCheck?.length > 0 && (
                          <>
                            <Grid container>
                              <Grid item md={3} xs={12} sm={12}>
                                <Grid style={userStyle.dataTablestyle}>
                                  <Box>
                                    <Select
                                      id="pageSizeSelectMapCheck"
                                      value={pageSizeMapCheck}
                                      onChange={handlePageSizeChangeMapCheck}
                                      sx={{ width: "77px" }}
                                    >
                                      <MenuItem value={1}>1</MenuItem>
                                      <MenuItem value={5}>5</MenuItem>
                                      <MenuItem value={10}>10</MenuItem>
                                      <MenuItem value={25}>25</MenuItem>
                                      <MenuItem value={50}>50</MenuItem>
                                      <MenuItem value={100}>100</MenuItem>
                                      <MenuItem
                                        value={
                                          CheckingTableModification?.length
                                        }
                                      >
                                        All
                                      </MenuItem>
                                    </Select>
                                  </Box>
                                </Grid>
                              </Grid>
                              <Grid item md={2} xs={12} sm={12}>
                                {" "}
                              </Grid>
                              <Grid
                                item
                                md={6}
                                xs={12}
                                sm={12}
                                sx={{ marginTop: 2 }}
                              >
                                <Grid container>
                                  <Grid>
                                    {isUserRoleCompare?.includes(
                                      "excelmyactionableticket"
                                    ) && (
                                      <>
                                        <Button sx={userStyle.buttongrp}>
                                          &ensp;
                                          <FaFileExcel />
                                          &ensp;
                                          <ReactHTMLTableToExcel
                                            id="test-table-xls-button"
                                            className="download-table-xls-button"
                                            table="raisetickets"
                                            filename="Required Fields"
                                            sheet="Sheet"
                                            buttonText="Export To Excel"
                                          />
                                          &ensp;
                                        </Button>
                                      </>
                                    )}
                                    {isUserRoleCompare?.includes(
                                      "printmyactionableticket"
                                    ) && (
                                      <>
                                        <Button
                                          sx={userStyle.buttongrp}
                                          onClick={handleprint}
                                        >
                                          &ensp;
                                          <FaPrint />
                                          &ensp;Print&ensp;
                                        </Button>
                                      </>
                                    )}
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </>
                        )}

                        {filteredDatamapCheck?.length > 0 && (
                          <>
                            <Grid item md={12} xs={12} sm={12}>
                              <br></br>
                              <TableContainer>
                                <Table
                                  aria-label="simple table"
                                  id="excel"
                                  sx={{ overflow: "auto" }}
                                >
                                  <TableHead sx={{ fontWeight: "600" }}>
                                    <StyledTableRow>
                                      {checkingAnsLength?.length > 0 &&
                                        checkingAnsLength?.map((row, index) => {
                                          return (
                                            <StyledTableCell>
                                              <Box
                                                sx={userStyle.tableheadstyle}
                                              >
                                                <Box>{row}</Box>
                                              </Box>
                                            </StyledTableCell>
                                          );
                                        })}
                                    </StyledTableRow>
                                  </TableHead>
                                  <TableBody align="left">
                                    {filteredDatamapCheck?.length > 0
                                      ? filteredDatamapCheck?.map(
                                        (item, indexs) => {
                                          const ans = item.total;
                                          return (
                                            <StyledTableRow>
                                              <StyledTableCell>
                                                {item?.serialNumber}
                                              </StyledTableCell>
                                              <StyledTableCell>
                                              <CopyClip name={item?.name}/>
                                              </StyledTableCell>
                                              {ans.map((row, index) => {
                                                return (
                                                  <>
                                                    <StyledTableCell>
                                                      {[
                                                        "Text Box-number",
                                                        "Text Box-alpha",
                                                        "Text Box-alphanumeric",
                                                        "Text Box",
                                                      ].includes(
                                                        row?.options
                                                      ) && row.resolver ? (
                                                        <>  <CopyClip name={row?.value}/></>
                                                      ) : [
                                                        "Date",
                                                        "Date Multi Span",
                                                        "Date Multi Random",
                                                      ].includes(
                                                        row?.options
                                                      ) && row.resolver ? (
                                                        <><CopyClip name={row?.value}/></>
                                                      ) : [
                                                        "DateTime",
                                                        "Date Multi Span Time",
                                                        "Date Multi Random Time",
                                                      ].includes(
                                                        row?.options
                                                      ) && row.resolver ? (
                                                        <>
                                                        <CopyClip name= {`${moment(
                                                            row.value
                                                          ).format(
                                                            "DD-MM-YYYY"
                                                          )} - ${row.time}`}/> 
                                                        </>
                                                      ) : row?.options ===
                                                        "Radio" &&
                                                        row.resolver ? (
                                                          <><CopyClip name={row?.value}/></>
                                                      ) : row?.options ===
                                                        "Time" &&
                                                        row.resolver ? (
                                                        <>
                                                        <CopyClip name= {moment(
                                                            row.value
                                                          ).format(
                                                            "DD-MM-YYYY"
                                                          )}/> 
                                                         
                                                        </>
                                                      ) : row?.options ===
                                                        "Attachments" &&
                                                        row.resolver ? (
                                                        <>
                                                          <Typography>
                                                            {row?.files &&
                                                              row?.files[0]
                                                                ?.name}
                                                          </Typography>
                                                          <Button
                                                            onClick={() =>
                                                              getDownloadFile(
                                                                row?.files[0]
                                                              )
                                                            }
                                                          >
                                                            View
                                                          </Button>
                                                        </>
                                                      ) : (
                                                        <CopyClip name={row?.viewpage}/>
                                                      )}
                                                    </StyledTableCell>
                                                  </>
                                                );
                                              })}
                                            </StyledTableRow>
                                          );
                                        }
                                      )
                                      : ""}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                              <Box style={userStyle.dataTablestyle}>
                                <Box>
                                  Showing{" "}
                                  {filteredDatamapCheck.length > 0
                                    ? (pagemapCheck - 1) * pageSizeMapCheck + 1
                                    : 0}{" "}
                                  to{" "}
                                  {Math.min(
                                    pagemapCheck * pageSizeMapCheck,
                                    filteredDatasmapCheck.length
                                  )}{" "}
                                  of {filteredDatasmapCheck.length} entries
                                </Box>

                                <Box>
                                  <Button
                                    onClick={() => setPagemapCheck(1)}
                                    disabled={pagemapCheck === 1}
                                    sx={userStyle.paginationbtn}
                                  >
                                    <FirstPageIcon />
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      handlePageChangeMapCheck(pagemapCheck - 1)
                                    }
                                    disabled={pagemapCheck === 1}
                                    sx={userStyle.paginationbtn}
                                  >
                                    <NavigateBeforeIcon />
                                  </Button>
                                  {pageNumbersmapCheck?.map((pageNumber) => (
                                    <Button
                                      key={pageNumber}
                                      sx={userStyle.paginationbtn}
                                      onClick={() =>
                                        handlePageChangeMapCheck(pageNumber)
                                      }
                                      className={
                                        pagemapCheck === pageNumber
                                          ? "active"
                                          : ""
                                      }
                                      disabled={pagemapCheck === pageNumber}
                                    >
                                      {pageNumber}
                                    </Button>
                                  ))}
                                  {lastVisiblePagemapCheck <
                                    totalPagesmapCheck && <span>...</span>}
                                  <Button
                                    onClick={() =>
                                      handlePageChangeMapCheck(pagemapCheck + 1)
                                    }
                                    disabled={
                                      pagemapCheck === totalPagesmapCheck
                                    }
                                    sx={userStyle.paginationbtn}
                                  >
                                    <NavigateNextIcon />
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      setPagemapCheck(totalPagesmapCheck)
                                    }
                                    disabled={
                                      pagemapCheck === totalPagesmapCheck
                                    }
                                    sx={userStyle.paginationbtn}
                                  >
                                    <LastPageIcon />
                                  </Button>
                                </Box>
                              </Box>
                              <br></br>
                            </Grid>
                          </>
                        )}
                      </>
                    )}
                  </Grid>

                  <br></br>
                  <br></br>
                  <br></br>
                  <br></br>
                  <br></br>

                  <Grid item md={3} xs={12} sm={12}>
                    <Typography>
                      {" "}
                      <b>Status </b>
                      <b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <Selects
                      options={
                        raiseTicketList.materialcode === "" ||
                        raiseTicketList.materialcode == undefined
                          ? statusOpt
                          : statusOptRepair
                      }
                      value={{
                        label: statusMasterValue,
                        value: statusMasterValue,
                      }}
                      onChange={(e) => {
                        setStatusMasterValue(e.value);
                        setTextAreaCloseDetails("");
                        fetchEmployeeNames();
                        fetchResolverReasons(e.value);
                        setResolverReason("Please Select Resolver Reason");
                      }}
                    />
                  </Grid>
                  {statusMasterValue === "Closed" && (
                    <>
                      <Grid item md={4} xs={12} sm={12}>
                        <Typography>
                          {" "}
                          <b>Resolver Reason </b>
                          <b style={{ color: "red" }}>*</b>{" "}
                        </Typography>
                        <Selects
                          options={resolverReasonOptions}
                          value={{
                            label: resolverReason,
                            value: resolverReason,
                          }}
                          onChange={(e) => {
                            setResolverReason(e.value);
                          }}
                        />
                      </Grid>
                      {resolverReason === "Other" ? (
                        <>
                          <Grid item md={4} xs={12} sm={12}>
                            <Typography>
                              {" "}
                              <b>
                                Reason<b style={{ color: "red" }}>*</b>
                              </b>{" "}
                            </Typography>
                            <TextareaAutosize
                              aria-label="minimum height"
                              minRows={3}
                              value={textAreaCloseDetails}
                              onChange={(e) => {
                                setTextAreaCloseDetails(e.target.value);
                              }}
                            />
                          </Grid>
                        </>
                      ) : (
                        <></>
                      )}

                      {checkPointsMaster?.checkpointgrp?.length > 0 ? (
                        <Grid item md={5} xs={12} sm={12}>
                          <Typography>
                            {" "}
                            <b>Check Lists</b>{" "}
                          </Typography>
                          {checkPointsMaster?.checkpointgrp?.map(
                            (data, index) => {
                              return (
                                <>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={data?.checked}
                                        onClick={(e) => handleClick(index, e)}
                                      />
                                    }
                                    label={data.label}
                                  />
                                  <br></br>
                                </>
                              );
                            }
                          )}
                        </Grid>
                      ) : (
                        ""
                      )}
                    </>
                  )}
                  {statusMasterValue === "Forwarded" && (
                    <>
                      <Grid item md={4} xs={12} sm={12}>
                        <Typography>
                          {" "}
                          <b>
                            Forwarded to <b style={{ color: "red" }}>*</b>{" "}
                          </b>{" "}
                        </Typography>
                        <MultiSelect
                          options={employeesName}
                          value={employeenameValue}
                          onChange={handleEmployeeNames}
                          valueRenderer={customValueEmployeesName}
                          labelledBy="Please Select Employeename"
                          // className="scrollable-multiselect"
                        />
                      </Grid>
                      <Grid item md={4} xs={12} sm={12}>
                        <Typography>
                          {" "}
                          <b>Resolver Reason </b>
                          <b style={{ color: "red" }}>*</b>{" "}
                        </Typography>
                        <Selects
                          options={resolverReasonOptions}
                          value={{
                            label: resolverReason,
                            value: resolverReason,
                          }}
                          onChange={(e) => {
                            setResolverReason(e.value);
                          }}
                        />
                      </Grid>
                      {resolverReason === "Other" ? (
                        <>
                          <Grid item md={4} xs={12} sm={12}>
                            <Typography>
                              {" "}
                              <b>
                                Reason<b style={{ color: "red" }}>*</b>
                              </b>{" "}
                            </Typography>
                            <TextareaAutosize
                              aria-label="minimum height"
                              minRows={3}
                              value={textAreaCloseDetails}
                              onChange={(e) => {
                                setTextAreaCloseDetails(e.target.value);
                              }}
                            />
                          </Grid>
                        </>
                      ) : (
                        <></>
                      )}
                    </>
                  )}
                  {statusMasterValue === "Details Needed" && (
                    <>
                      <Grid item md={4} xs={12} sm={12}>
                        <Typography>
                          {" "}
                          <b>Resolver Reason </b>
                          <b style={{ color: "red" }}>*</b>{" "}
                        </Typography>
                        <Selects
                          options={resolverReasonOptions}
                          value={{
                            label: resolverReason,
                            value: resolverReason,
                          }}
                          onChange={(e) => {
                            setResolverReason(e.value);
                          }}
                        />
                      </Grid>
                      {resolverReason === "Other" ? (
                        <>
                          <Grid item md={4} xs={12} sm={12}>
                            <Typography>
                              {" "}
                              <b>
                                Reason<b style={{ color: "red" }}>*</b>
                              </b>{" "}
                            </Typography>
                            <TextareaAutosize
                              aria-label="minimum height"
                              minRows={3}
                              value={textAreaCloseDetails}
                              onChange={(e) => {
                                setTextAreaCloseDetails(e.target.value);
                              }}
                            />
                          </Grid>
                        </>
                      ) : (
                        <></>
                      )}
                    </>
                  )}
                  {statusMasterValue === "Hold" && (
                    <>
                      <Grid item md={4} xs={12} sm={12}>
                        <Typography>
                          {" "}
                          <b>Resolver Reason </b>
                          <b style={{ color: "red" }}>*</b>{" "}
                        </Typography>
                        <Selects
                          options={resolverReasonOptions}
                          value={{
                            label: resolverReason,
                            value: resolverReason,
                          }}
                          onChange={(e) => {
                            setResolverReason(e.value);
                          }}
                        />
                      </Grid>
                      {resolverReason === "Other" ? (
                        <>
                          <Grid item md={4} xs={12} sm={12}>
                            <Typography>
                              {" "}
                              <b>
                                Reason<b style={{ color: "red" }}>*</b>
                              </b>{" "}
                            </Typography>
                            <TextareaAutosize
                              aria-label="minimum height"
                              minRows={3}
                              value={textAreaCloseDetails}
                              onChange={(e) => {
                                setTextAreaCloseDetails(e.target.value);
                              }}
                            />
                          </Grid>
                        </>
                      ) : (
                        <></>
                      )}
                    </>
                  )}
                  {statusMasterValue === "Reject" && (
                    <>
                      <Grid item md={4} xs={12} sm={12}>
                        <Typography>
                          {" "}
                          <b>Resolver Reason </b>
                          <b style={{ color: "red" }}>*</b>{" "}
                        </Typography>
                        <Selects
                          options={resolverReasonOptions}
                          value={{
                            label: resolverReason,
                            value: resolverReason,
                          }}
                          onChange={(e) => {
                            setResolverReason(e.value);
                          }}
                        />
                      </Grid>
                      {resolverReason === "Other" ? (
                        <>
                          <Grid item md={4} xs={12} sm={12}>
                            <Typography>
                              {" "}
                              <b>
                                Reason<b style={{ color: "red" }}>*</b>
                              </b>{" "}
                            </Typography>
                            <TextareaAutosize
                              aria-label="minimum height"
                              minRows={3}
                              value={textAreaCloseDetails}
                              onChange={(e) => {
                                setTextAreaCloseDetails(e.target.value);
                              }}
                            />
                          </Grid>
                        </>
                      ) : (
                        <></>
                      )}
                    </>
                  )}
                  {statusMasterValue === "Reason" && (
                    <>
                      <Grid item md={4} xs={12} sm={12}>
                        <Typography>
                          {" "}
                          <b>Resolver Reason </b>
                          <b style={{ color: "red" }}>*</b>{" "}
                        </Typography>
                        <Selects
                          options={resolverReasonOptions}
                          value={{
                            label: resolverReason,
                            value: resolverReason,
                          }}
                          onChange={(e) => {
                            setResolverReason(e.value);
                          }}
                        />
                      </Grid>
                      {resolverReason === "Other" ? (
                        <>
                          <Grid item md={4} xs={12} sm={12}>
                            <Typography>
                              {" "}
                              <b>
                                Reason<b style={{ color: "red" }}>*</b>
                              </b>{" "}
                            </Typography>
                            <TextareaAutosize
                              aria-label="minimum height"
                              minRows={3}
                              value={textAreaCloseDetails}
                              onChange={(e) => {
                                setTextAreaCloseDetails(e.target.value);
                              }}
                            />
                          </Grid>
                        </>
                      ) : (
                        <></>
                      )}
                    </>
                  )}
                  {statusMasterValue === "In-Repair" && (
                    <>
                      <Grid item md={4} xs={12} sm={12}>
                        <Typography>
                          {" "}
                          <b>Resolver Reason </b>
                          <b style={{ color: "red" }}>*</b>{" "}
                        </Typography>
                        <Selects
                          options={resolverReasonOptions}
                          value={{
                            label: resolverReason,
                            value: resolverReason,
                          }}
                          onChange={(e) => {
                            setResolverReason(e.value);
                          }}
                        />
                      </Grid>
                      {resolverReason === "Other" ? (
                        <>
                          <Grid item md={4} xs={12} sm={12}>
                            <Typography>
                              {" "}
                              <b>
                                Reason<b style={{ color: "red" }}>*</b>
                              </b>{" "}
                            </Typography>
                            <TextareaAutosize
                              aria-label="minimum height"
                              minRows={3}
                              value={textAreaCloseDetails}
                              onChange={(e) => {
                                setTextAreaCloseDetails(e.target.value);
                              }}
                            />
                          </Grid>
                        </>
                      ) : (
                        <></>
                      )}
                    </>
                  )}
                </Grid>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>

                {raiseTicketList?.forwardedlog?.length > 0 && (
                  <>
                    <Typography>
                      <b>Ticket Conversation</b>
                    </Typography>
                    <br></br>
                    <br></br>
                    {raiseTicketList?.forwardedlog?.length > 0 ? (
                      <>
                        <Grid item md={12} xs={12} sm={12}>
                          <TableContainer>
                            <Table
                              aria-label="simple table"
                              id="excel"
                              sx={{ overflow: "auto" }}
                            >
                              <TableHead sx={{ fontWeight: "200" }}>
                                <StyledTableRow>
                                  <StyledTableCell sx={{ fontWeight: "bold" }}>
                                    S.No
                                  </StyledTableCell>
                                  <StyledTableCell sx={{ fontWeight: "bold" }}>
                                    Ticket Reviewed By
                                  </StyledTableCell>
                                  <StyledTableCell sx={{ fontWeight: "bold" }}>
                                    {" "}
                                    Date{" "}
                                  </StyledTableCell>
                                  <StyledTableCell sx={{ fontWeight: "bold" }}>
                                    {" "}
                                    Status{" "}
                                  </StyledTableCell>
                                  <StyledTableCell sx={{ fontWeight: "bold" }}>
                                    Ticket Reviewed To
                                  </StyledTableCell>
                                  <StyledTableCell sx={{ fontWeight: "bold" }}>
                                    Resolver Reason
                                  </StyledTableCell>
                                  <StyledTableCell sx={{ fontWeight: "bold" }}>
                                    Raiser Reason
                                  </StyledTableCell>
                                </StyledTableRow>
                              </TableHead>
                              <TableBody align="left">
                                {raiseTicketList?.forwardedlog?.length > 0
                                  ? raiseTicketList?.forwardedlog?.map(
                                      (item, indexs) => {
                                        const ans = [...new Set(item.names)];
                                        return (
                                          <StyledTableRow>
                                            <StyledTableCell>
                                              {indexs + 1}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                              {item?.forwardedby}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                              {item?.date}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                              {item?.status}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                              {ans
                                                .map(
                                                  (t, i) =>
                                                    ` ${i + 1 + ". "}` + t
                                                )
                                                .toString()}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                              {item?.reason}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                              {item?.claimreason
                                                ? convertToNumberedList(
                                                    item?.claimreason
                                                  )
                                                : ""}
                                            </StyledTableCell>
                                          </StyledTableRow>
                                        );
                                      }
                                    )
                                  : ""}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Grid>
                        <br></br>
                      </>
                    ) : (
                      ""
                    )}
                  </>
                )}

                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>

                {checkPointsRaise?.length > 0 ? (
                  <Grid item md={5} xs={12} sm={12}>
                    <Typography>
                      <b>Self -Check points</b>
                    </Typography>
                    <br></br>
                    {checkPointsRaise?.length > 0 &&
                      checkPointsRaise?.map((data) => {
                        return (
                          <>
                            <FormControlLabel
                              control={<Checkbox checked={data?.checked} />}
                              label={data?.label}
                            />
                            <br></br>
                          </>
                        );
                      })}
                  </Grid>
                ) : (
                  ""
                )}

                <Grid container spacing={2}>
                  <Grid item md={3} xs={12} sm={12}>
                    <Typography>
                      {" "}
                      <b>Request to Change </b>{" "}
                    </Typography>
                    <Selects
                      options={[
                        { label: "Required Master", value: "Required Master" },
                        {
                          label: "Self Check Points Master",
                          value: "Self Check Points Master",
                        },
                        {
                          label: "Check Points Master",
                          value: "Check Points Master",
                        },
                        { label: "Reason Master", value: "Reason Master" },
                      ]}
                      value={{ label: RequestChange, value: RequestChange }}
                      onChange={(e) => {
                        setRequestChange(e.value);
                        handleNavigate(
                          e.value,
                          raiseTicketList.category,
                          raiseTicketList.subcategory,
                          raiseTicketList.subsubcategory
                        );
                      }}
                    />
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  {statusMasterValue === "Details Needed" ? (
                    <Grid item md={2} xs={12} sm={12}>
                      <Button
                        variant="contained"
                        onClick={(e) => handleResend(e)}
                      >
                        Re-Send
                      </Button>
                    </Grid>
                  ) : statusMasterValue === "Hold" ? (
                    <Grid item md={2} xs={12} sm={12}>
                      <Button
                        variant="contained"
                        onClick={(e) => handleHold(e)}
                      >
                        Hold
                      </Button>
                    </Grid>
                  ) : statusMasterValue === "Forwarded" ? (
                    <Grid item md={2} xs={12} sm={12}>
                      <Button
                        variant="contained"
                        onClick={(e) => handleforward(e)}
                      >
                        Forward
                      </Button>
                    </Grid>
                  ) : statusMasterValue === "Reject" ? (
                    <Grid item md={2} xs={12} sm={12}>
                      <Button
                        variant="contained"
                        onClick={(e) => handleReject(e)}
                      >
                        Reject
                      </Button>
                    </Grid>
                  ) : statusMasterValue === "In-Repair" ? (
                    <Grid item md={2} xs={12} sm={12}>
                      <Button
                        variant="contained"
                        onClick={(e) => handleRepair(e)}
                      >
                        Move to Repair
                      </Button>
                    </Grid>
                  ) : (
                    <Grid item md={2} xs={12} sm={12}>
                      <Button
                        variant="contained"
                        onClick={(e) => handleResolved(e)}
                      >
                        Close Ticket
                      </Button>
                    </Grid>
                  )}
                  <Grid item md={1} xs={12} sm={12}>
                    <Button
                      variant="contained"
                      onClick={() => handleClickClose()}
                    >
                      BACK
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </>
          )}
        </>
      )}

      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table
          aria-label="customized table"
          id="raisetickets"
          ref={componentRef}
        >
          <TableHead sx={{ fontWeight: "600" }}>
            <StyledTableRow>
              {checkingAnsLength?.length > 0 &&
                checkingAnsLength?.map((row, index) => {
                  return (
                    <StyledTableCell>
                      <Box sx={userStyle.tableheadstyle}>
                        <Box
                          sx={{ textAlign: "center", justifyContent: "center" }}
                        >
                          {row}
                        </Box>
                      </Box>
                    </StyledTableCell>
                  );
                })}
            </StyledTableRow>
          </TableHead>
          <TableBody align="left">
            {filteredDatamapCheck?.length > 0
              ? filteredDatamapCheck?.map((item, indexs) => {
                  const ans = item.total;
                  return (
                    <StyledTableRow>
                      <StyledTableCell>{item?.serialNumber}</StyledTableCell>
                      <StyledTableCell>{item?.name}</StyledTableCell>
                      {ans.map((row, index) => {
                        return (
                          <>
                            <StyledTableCell>
                              {[
                                "Text Box-number",
                                "Text Box-alpha",
                                "Text Box-alphanumeric",
                                "Text Box",
                              ].includes(row?.options) && row.resolver ? (
                                row?.value
                              ) : [
                                  "Date",
                                  "Date Multi Span",
                                  "Date Multi Random",
                                ].includes(row?.options) && row.resolver ? (
                                <>{row?.value}</>
                              ) : [
                                  "DateTime",
                                  "Date Multi Span Time",
                                  "Date Multi Random Time",
                                ].includes(row?.options) && row.resolver ? (
                                <>
                                  {`${moment(row.value).format(
                                    "DD-MM-YYYY"
                                  )} - ${row.time}`}
                                </>
                              ) : row?.options === "Time" && row.resolver ? (
                                <>{moment(row.value).format("DD-MM-YYYY")}</>
                              ) : row?.options === "Radio" && row.resolver ? (
                                row?.value
                              ) : row?.options === "Attachments" ? (
                                <Typography>
                                  {row?.files && row?.files[0]?.name}
                                </Typography>
                              ) : (
                                row?.viewpage
                              )}
                            </StyledTableCell>
                          </>
                        );
                      })}
                    </StyledTableRow>
                  );
                })
              : ""}
          </TableBody>
        </Table>
      </TableContainer>
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
    </Box>
  );
}

export default RaiseticketList;