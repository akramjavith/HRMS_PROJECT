import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  TextareaAutosize,
  Popover,
  Checkbox,
  TextField,
  IconButton,
  Select,
  OutlinedInput,
  FormControl,
  MenuItem,
  DialogActions,
  Grid,
  Paper,
  Table,
  TableHead,
  TableContainer,
  Button,
  TableBody,
} from "@mui/material";
import { userStyle } from "../../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../../components/Table";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { SERVICE } from "../../../../services/Baseservice";
import moment from "moment-timezone";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useReactToPrint } from "react-to-print";
import {
  UserRoleAccessContext,
  AuthContext,
} from "../../../../context/Appcontext";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import StyledDataGrid from "../../../../components/TableStyle";
import { handleApiError } from "../../../../components/Errorhandling";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Headtitle from "../../../../components/Headtitle";
import { MultiSelect } from "react-multi-select-component";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import Selects from "react-select";
import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";

import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
function RemoteEmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { isUserRoleAccess, isUserRoleCompare, isAssignBranch, allTeam } =
    useContext(UserRoleAccessContext);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { auth } = useContext(AuthContext);
  const [isBtn, setIsBtn] = useState(false);
  const [isBtnFilter, setisBtnFilter] = useState(false);
  const [isBtnClear, setisBtnClear] = useState(false);
  const [loader, setLoader] = useState(false);

  const [pfesiform, setPfesiForm] = useState({
    esideduction: false,
    pfdeduction: false,
    uan: "UAN",
    pfmembername: "",
    insurancenumber: "",
    ipname: "",
    pfesifromdate: "",
    isenddate: false,
    pfesienddate: "",
  });

  const [addremoteemployeeWorkmode, setAddremoteemployeeWorkmode] = useState({
    wfhconfigurationdetails: "",
    internetdailylimit: "",
    internetspeed: "",
    internetssidname: "",
    auditchecklistworkareasecure: "Please Select",
    auditchecklistwindowsongroundlevelworkarea: "Please Select",
    auditchecklistworkstationisstored: "Please Select",
    auditchecklistnoprivatelyowned: "Please Select",
    auditchecklistwifisecurity: "Please Select",
  });

  const [isAddOpenalert, setAddOpenalert] = useState(false);
  // const [selectedbranch, setselectedbranch] = useState([]);

  const [isBankdetail, setBankdetail] = useState(false);

  let username = isUserRoleAccess.username;

  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Remote Employee List.png");
        });
      });
    }
  };

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

  // Copied fields Name
  const handleCopy = (message) => {
    NotificationManager.success(`${message} 👍`, "", 2000);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

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
    company: true,
    branch: true,
    unit: true,
    team: true,
    empcode: true,
    companyname: true,
    actions: true,
    username: true,

    unitcode: true,
    branchcode: true,

    count: true,
    systemname: true,
    systemshortname: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  const [primaryWorkStationInput, setPrimaryWorkStationInput] = useState("");
  const [employeeDetails, setEmployeeDetails] = useState({
    employeename: "",
    id: "",
    workstationinput: "",
    workmode: "",
  });
  const allotWorkStation = async (row) => {
    console.log(row);
    try {
      let req = await axios.get(SERVICE.USER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let lastwscode;
      let lastworkstation = req.data.users
        ?.filter(
          (item) =>
            item.company === row.company &&
            item.branch === row.branch &&
            item.unit === row.unit
        )
        .filter((item) => /_[0-9]+_/.test(item?.workstationinput));

      if (lastworkstation.length === 0) {
        lastwscode = 0;
      } else {
        let highestWorkstation = lastworkstation.reduce(
          (max, item) => {
            const num = parseInt(item.workstationinput.split("_")[1]);
            return num > max.num ? { num, item } : max;
          },
          { num: 0, item: null }
        ).num;

        lastwscode = highestWorkstation.toString().padStart(2, "0");
      }

      let autoWorkStation = `W${row?.branchcode
        ?.slice(0, 2)
        ?.toUpperCase()}${row?.unitcode?.slice(0, 2)?.toUpperCase()}_${
        lastwscode === 0
          ? "01"
          : (Number(lastwscode) + 1).toString().padStart(2, "0")
      }_${row?.username?.toUpperCase()}`;

      setPrimaryWorkStationInput(autoWorkStation);
      setEmployeeDetails({
        employeename: row.companyname,
        id: row?.id,
        workstationinput: row?.workstationinput,
        workmode: row?.workmode,
      });

      // let user = req.data.users.find((user) => user._id === row.ids);

      // if (!user || !user.addremoteworkmode || user.addremoteworkmode.length === 0) {
      //   setShowAlert(
      //     <>
      //       <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
      //       <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
      //         Please assign Remote Employee List Page first After that should click on allot{" "}
      //       </Typography>
      //     </>
      //   );
      //   handleClickOpenerr();
      // } else {
      // handleOpenAllotWorkStation();
      // }

      // handleOpenAllotWorkStation();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const getCode = async (row) => {
    setIsLoading(true);
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${row.id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setPfesiForm(res?.data?.suser);
      await allotWorkStation(row);
      handleClickOpenEdit();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  // Edit model
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsLoading(false);
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    setAddremoteemployeeWorkmode({
      wfhconfigurationdetails: "",
      internetdailylimit: "",
      internetspeed: "",
      internetssidname: "",
      auditchecklistworkareasecure: "Please Select",
      auditchecklistwindowsongroundlevelworkarea: "Please Select",
      auditchecklistworkstationisstored: "Please Select",
      auditchecklistnoprivatelyowned: "Please Select",
      auditchecklistwifisecurity: "Please Select",
    });
    setSelectedOptionsSystemType([]);
    setSelectedOptionsNetworkType([]);
    setdocumentFilesssid([]);
    setdocumentFiles([]);
    setPrimaryWorkStationInput("");
    setEmployeeDetails({
      employeename: "",
      id: "",
      workstationinput: "",
      workmode: "",
    });
  };

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsLoading(false);
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };
  //auto select all dropdowns
  const handleAutoSelect = async () => {
    try {
      let selectedValues = isAssignBranch
        ?.map((data) => ({
          company: data.company,
          branch: data.branch,
          unit: data.unit,
        }))
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.company === value.company &&
                t.branch === value.branch &&
                t.unit === value.unit
            )
        );
      let selectedCompany = selectedValues
        ?.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.company === value.company)
        )
        .map((a, index) => {
          return a.company;
        });

      let mappedCompany = selectedValues
        ?.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.company === value.company)
        )
        ?.map((data) => ({
          label: data?.company,
          value: data?.company,
        }));

      setValueCompanyCat(selectedCompany);
      setSelectedOptionsCompany(mappedCompany);

      let selectedBranch = selectedValues
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) => t.company === value.company && t.branch === value.branch
            )
        )
        .map((a, index) => {
          return a.branch;
        });

      let mappedBranch = selectedValues
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) => t.company === value.company && t.branch === value.branch
            )
        )
        ?.map((data) => ({
          label: data?.branch,
          value: data?.branch,
        }));

      setValueBranchCat(selectedBranch);
      setSelectedOptionsBranch(mappedBranch);

      let selectedUnit = selectedValues
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.company === value.company &&
                t.branch === value.branch &&
                t.unit === value.unit
            )
        )
        .map((a, index) => {
          return a.unit;
        });

      let mappedUnit = selectedValues
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.company === value.company &&
                t.branch === value.branch &&
                t.unit === value.unit
            )
        )
        ?.map((data) => ({
          label: data?.unit,
          value: data?.unit,
        }));

      setValueUnitCat(selectedUnit);
      setSelectedOptionsUnit(mappedUnit);

      let mappedTeam = allTeam
        ?.filter(
          (u) =>
            selectedCompany?.includes(u.company) &&
            selectedBranch?.includes(u.branch) &&
            selectedUnit?.includes(u.unit)
        )
        .map((u) => ({
          label: u.teamname,
          value: u.teamname,
        }));

      let selectedTeam = allTeam
        ?.filter(
          (u) =>
            selectedCompany?.includes(u.company) &&
            selectedBranch?.includes(u.branch) &&
            selectedUnit?.includes(u.unit)
        )
        .map((u) => u.teamname);
      setValueTeamCat(selectedTeam);
      setSelectedOptionsTeam(mappedTeam);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    handleAutoSelect();
  }, [isAssignBranch]);
  //Boardingupadate updateby edit page...
  let updateby = pfesiform?.updatedby;
  let addedby = pfesiform?.addedby;

  //edit Put call
  let boredit = pfesiform?._id;
  const sendRequestt = async () => {
    setIsBtn(true);
    let now = new Date();
    let currentTime = now.toLocaleTimeString();
    try {
      let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${boredit}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        workstationinput: !employeeDetails?.workstationinput
          ? primaryWorkStationInput
          : "",
        workstationofficestatus:
          employeeDetails?.workmode !== "Remote" ? true : false,

        addremoteworkmode: [
          ...pfesiform?.addremoteworkmode,

          {
            workstationinput: !employeeDetails?.workstationinput
              ? primaryWorkStationInput
              : employeeDetails?.workstationinput,
            wfhsystemtype: valueSystemTypeCat,
            wfhconfigurationdetails: String(
              addremoteemployeeWorkmode.wfhconfigurationdetails
            ),
            wfhsetupphoto: documentFiles,
            internetnetworktype: valueNetworkTypeCat,
            internetdailylimit: String(
              addremoteemployeeWorkmode.internetdailylimit
            ),
            internetspeed: String(addremoteemployeeWorkmode.internetspeed),

            internetssidname: String(
              addremoteemployeeWorkmode.internetssidname
            ),
            internetssidphoto: documentFilesssid,
            auditchecklistworkareasecure: String(
              addremoteemployeeWorkmode.auditchecklistworkareasecure
            ),
            auditchecklistwindowsongroundlevelworkarea: String(
              addremoteemployeeWorkmode.auditchecklistwindowsongroundlevelworkarea
            ),
            auditchecklistworkstationisstored: String(
              addremoteemployeeWorkmode.auditchecklistworkstationisstored
            ),
            auditchecklistnoprivatelyowned: String(
              addremoteemployeeWorkmode.auditchecklistnoprivatelyowned
            ),
            auditchecklistwifisecurity: String(
              addremoteemployeeWorkmode.auditchecklistwifisecurity
            ),

            updatename: String(isUserRoleAccess.companyname),
            updatetime: currentTime,
            date: String(new Date()),
            updatedby: [
              ...updateby,
              {
                name: String(isUserRoleAccess.companyname),
                date: String(new Date()),
              },
            ],
          },
        ],
      });
      await sendRequest();
      setAddremoteemployeeWorkmode({
        wfhconfigurationdetails: "",
        internetdailylimit: "",
        internetspeed: "",
        internetssidname: "",
        auditchecklistworkareasecure: "Please Select",
        auditchecklistwindowsongroundlevelworkarea: "Please Select",
        auditchecklistworkstationisstored: "Please Select",
        auditchecklistnoprivatelyowned: "Please Select",
        auditchecklistwifisecurity: "Please Select",
      });
      setSelectedOptionsSystemType([]);
      setSelectedOptionsNetworkType([]);
      setdocumentFilesssid([]);
      setdocumentFiles([]);

      handleCloseModEdit();
      setAddOpenalert(true);
      setTimeout(() => {
        setAddOpenalert(false);
        setIsBtn(false);
      }, 1000);
    } catch (err) {
      console.log(err);
      setIsBtn(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const editSubmit = (e) => {
    e.preventDefault();
    if (selectedOptionsSystemType?.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select System Type"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (addremoteemployeeWorkmode.wfhconfigurationdetails === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Configuration Details!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (documentFiles?.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Upload WFH Setup Photo"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedOptionsNetworkType?.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Network Type"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (addremoteemployeeWorkmode.internetdailylimit === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Daily Limit"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (addremoteemployeeWorkmode.internetspeed === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Internet Speed"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (addremoteemployeeWorkmode.internetssidname === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter SSID-Name"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (documentFilesssid?.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Upload SSID-Photo"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      addremoteemployeeWorkmode.auditchecklistworkareasecure === "Please Select"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Audit Checklist 1"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      addremoteemployeeWorkmode.auditchecklistwindowsongroundlevelworkarea ===
      "Please Select"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Audit Checklist 2"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      addremoteemployeeWorkmode.auditchecklistworkstationisstored ===
      "Please Select"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Audit Checklist 3"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      addremoteemployeeWorkmode.auditchecklistnoprivatelyowned ===
      "Please Select"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Audit Checklist 4"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      addremoteemployeeWorkmode.auditchecklistwifisecurity === "Please Select"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Audit Checklist 5"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequestt();
    }
  };

  //------------------------------------------------------

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const [fileFormat, setFormat] = useState("xl");
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = fileFormat === "xl" ? ".xlsx" : ".csv";

  const exportToExcel = (excelData, fileName) => {
    try {
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

      // Check if the browser supports Blob and FileSaver
      if (!Blob || !FileSaver) {
        console.error("Blob or FileSaver not supported");
        return;
      }

      const data = new Blob([excelBuffer], { type: fileType });

      // Check if FileSaver.saveAs is available
      if (!FileSaver.saveAs) {
        console.error("FileSaver.saveAs is not available");
        return;
      }

      FileSaver.saveAs(data, fileName + fileExtension);
    } catch (error) {
      console.error("Error exporting to Excel", error);
    }
  };

  const formatData = (data) => {
    return data.map((item, index) => {
      return {
        Sno: index + 1,

        Company: item.company || "",
        Branch: item.branch || "",
        Unit: item.unit || "",
        Team: item.team || "",
        Empcode: item.empcode || "",
        Name: item.companyname || "",
        Username: item.username || "",
        // Branchcode: item.branchcode || "",
        // Unitcode: item.unitcode || "",
        // Count: item.count || "",
        // Systemname: item.systemname || "",
        // Systemshortname: item.systemshortname || "",
      };
    });
  };

  const handleExportXL = (isfilter) => {
    const dataToExport = isfilter === "filtered" ? filteredData : employees;

    if (!dataToExport || dataToExport?.length === 0) {
      console.error("No data available to export");
      return;
    }

    exportToExcel(formatData(dataToExport), "Remote Employee List");
    setIsFilterOpen(false);
  };

  //  PDF
  // pdf.....
  const columns = [
    { title: "Company", field: "company" },
    { title: "Branch", field: "branch" },
    { title: "Unit", field: "unit" },
    { title: "Team", field: "team" },
    { title: "Emp Code", field: "empcode" },
    { title: "Name", field: "companyname" },

    { title: "Username", field: "username" },
    // { title: "Branch Code", field: "branchcode" },
    // { title: "Unit Code", field: "unitcode" },
    // { title: "Count", field: "count" },
    // { title: "System Name", field: "systemname" },
    // { title: "System Short Name", field: "systemshortname" },
  ];

  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();

    // Initialize serial number counter
    // Modify columns to include serial number column
    const columnsWithSerial = [
      { title: "S.No", dataKey: "serialNumber" }, // Serial number column
      ...columns.map((col) => ({ title: col.title, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial =
      isfilter === "filtered"
        ? filteredData.map((t, index) => ({
            ...t,
            serialNumber: index + 1,
          }))
        : employees?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
          }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: 5 },
    });

    doc.save("Remote Employee List.pdf");
  };

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

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Remote Employee List",
    pageStyle: "print",
  });

  //table entries ..,.
  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = employees?.map((item, index) => ({
      _id: item?._id,
      serialNumber: index + 1,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      empcode: item.empcode,
      companyname: item.companyname,
      workmode: item.workmode || "",
      workstationinput: item.workstationinput || "",
      branchcode: item.branchcode || "",
      unitcode: item.unitcode || "",
      count: item?.count,
      systemname: item?.systemname,
      username: item.username,
      addremoteworkmode: item?.addremoteworkmode,
      systemshortname: item?.systemshortname?.slice(0, 15),
    }));
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
    return searchTerms.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
  });

  const filteredData = filteredDatas.slice(
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

  const indexOfLastItem = page * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;

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
        // Add any other CSS styles as needed
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
              const allRowIds = rowDataTable.map((row) => row.id);
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
              updatedSelectedRows = selectedRows.filter(
                (selectedId) => selectedId !== params.row.id
              );
            } else {
              updatedSelectedRows = [...selectedRows, params.row.id];
            }

            setSelectedRows(updatedSelectedRows);

            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllChecked(
              updatedSelectedRows?.length === filteredData?.length
            );
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
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 200,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 200,
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
      field: "empcode",
      headerName: "Emp Code",
      flex: 0,
      width: 200,
      hide: !columnVisibility.empcode,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
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
              onCopy={() => {
                handleCopy("Copied Emp Code!");
              }}
              options={{ message: "Copied Emp Code!" }}
              text={params?.row?.empcode}
            >
              <ListItemText primary={params?.row?.empcode} />
            </CopyToClipboard>
          </ListItem>
        </Grid>
      ),
    },
    {
      field: "companyname",
      headerName: "Name",
      flex: 0,
      width: 200,
      hide: !columnVisibility.companyname,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
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
              onCopy={() => {
                handleCopy("Copied Name!");
              }}
              options={{ message: "Copied Name!" }}
              text={params?.row?.companyname}
            >
              <ListItemText primary={params?.row?.companyname} />
            </CopyToClipboard>
          </ListItem>
        </Grid>
      ),
    },
    {
      field: "username",
      headerName: "User Name",
      flex: 0,
      width: 130,
      hide: !columnVisibility.username,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
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
              onCopy={() => {
                handleCopy("Copied Username!");
              }}
              options={{ message: "Copied Username!" }}
              text={params?.row?.username}
            >
              <ListItemText primary={params?.row?.username} />
            </CopyToClipboard>
          </ListItem>
        </Grid>
      ),
    },

    // {
    //   field: "branchcode",
    //   headerName: "Branch Code",
    //   flex: 0,
    //   width: 120,
    //   hide: !columnVisibility.branchcode,
    //   headerClassName: "bold-header",
    // },
    // {
    //   field: "unitcode",
    //   headerName: "Unit Code",
    //   flex: 0,
    //   width: 120,
    //   hide: !columnVisibility.unitcode,
    //   headerClassName: "bold-header",
    // },
    // {
    //   field: "count",
    //   headerName: "Count",
    //   flex: 0,
    //   width: 80,
    //   hide: !columnVisibility.count,
    //   headerClassName: "bold-header",
    // },
    // {
    //   field: "systemname",
    //   headerName: "System Name",
    //   flex: 0,
    //   width: 250,
    //   hide: !columnVisibility.systemname,
    //   headerClassName: "bold-header",
    // },
    // {
    //   field: "systemshortname",
    //   headerName: "ShortName",
    //   flex: 0,
    //   width: 250,
    //   hide: !columnVisibility.systemshortname,
    //   headerClassName: "bold-header",
    // },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 250,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      // Assign Bank Detail
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("eremoteemployeelist") && (
            <Button
              variant="contained"
              onClick={() => {
                getCode(params.row);
              }}
            >
              Add Work Mode
            </Button>
          )}
        </Grid>
      ),
    },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      empcode: item.empcode,
      companyname: item.companyname,
      workmode: item.workmode,
      workstationinput: item.workstationinput,
      username: item.username,
      branchcode: item.branchcode,
      unitcode: item.unitcode,
      count: item.count,
      systemname: item.systemname,
      systemshortname: item.systemshortname,
      addremoteworkmode: item.addremoteworkmode,
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

  const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
  let [valueCompanyCat, setValueCompanyCat] = useState([]);

  const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
  let [valueBranchCat, setValueBranchCat] = useState([]);

  const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
  let [valueUnitCat, setValueUnitCat] = useState([]);

  const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
  let [valueTeamCat, setValueTeamCat] = useState([]);

  const [selectedOptionsSystemType, setSelectedOptionsSystemType] = useState(
    []
  );
  let [valueSystemTypeCat, setValueSystemTypeCat] = useState([]);

  const [selectedOptionsNetworkType, setSelectedOptionsNetworkType] = useState(
    []
  );
  let [valueNetworkTypeCat, setValueNetworkTypeCat] = useState([]);

  const [isClearOpenalert, setClearOpenalert] = useState(false);

  const handleCompanyChange = (options) => {
    setValueCompanyCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCompany(options);
    // fetchBranchAll(options)
  };

  const handleBranchChange = (options) => {
    setValueBranchCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBranch(options);
    // fetchUnitAll(options)
  };

  const handleUnitChange = (options) => {
    setValueUnitCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsUnit(options);
    // fetchTeamAll(options)
  };

  const handleTeamChange = (options) => {
    setValueTeamCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsTeam(options);
  };

  const handleSystemTypeChange = (options) => {
    setValueSystemTypeCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsSystemType(options);
  };

  const handleNetworkTypeChange = (options) => {
    setValueNetworkTypeCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsNetworkType(options);
  };

  const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
    return valueCompanyCat?.length
      ? valueCompanyCat.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
  };
  const customValueRendererBranch = (valueBranchCat, _categoryname) => {
    return valueBranchCat?.length
      ? valueBranchCat.map(({ label }) => label)?.join(", ")
      : "Please Select Branch";
  };
  const customValueRendererUnit = (valueUnitCat, _categoryname) => {
    return valueUnitCat?.length
      ? valueUnitCat.map(({ label }) => label)?.join(", ")
      : "Please Select Unit";
  };
  const customValueRendererTeam = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length
      ? valueTeamCat.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };

  const customValueRendererSystemType = (valueSystemTypeCat, _categoryname) => {
    return valueSystemTypeCat?.length
      ? valueSystemTypeCat.map(({ label }) => label)?.join(", ")
      : "Please Select System Type";
  };

  const customValueRendererNetworkType = (
    valueNetworkTypeCat,
    _categoryname
  ) => {
    return valueNetworkTypeCat?.length
      ? valueNetworkTypeCat.map(({ label }) => label)?.join(", ")
      : "Please Select Network Type";
  };

  //add function
  const sendRequest = async () => {
    setLoader(true);

    setisBtnFilter(true);
    try {
      let subprojectscreate = await axios.post(SERVICE.GETFILTEREMOTEUSER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: valueCompanyCat,
        branch: valueBranchCat,
        unit: valueUnitCat,
        team: valueTeamCat,
      });

      let preresult = subprojectscreate?.data?.filterallremoteuser?.filter(
        (item) =>
          item.addremoteworkmode?.length === 0 ||
          item.addremoteworkmode === undefined
        //    &&
        // (item?.workstationofficestatus === true ||
        //   item?.workmode?.toLowerCase() === "remote")
        //  &&
        // (item?.workstationinput === "" ||
        //   item?.workstationinput === undefined)
      );

      let result = preresult?.filter((item) =>
        isAssignBranch.some(
          (branch) =>
            branch.company === item.company &&
            branch.branch === item.branch &&
            branch.unit === item.unit
        )
      );

      let [res_branch, res_unit] = await Promise.all([
        axios.get(SERVICE.BRANCH, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.get(SERVICE.UNIT, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
      ]);

      const resBranchdata = result.map((data, index) => {
        let updatedData = data;
        res_branch?.data?.branch.map((item, i) => {
          if (data.branch === item.name) {
            updatedData = { ...data, branchcode: item.code };
          }
        });

        return updatedData;
      });

      const resUnitdata = resBranchdata.map((data, index) => {
        let updatedData = data;
        res_unit?.data?.units.map((item, i) => {
          if (data.unit === item.name) {
            updatedData = { ...data, unitcode: item.code };
          }
        });

        return updatedData;
      });

      // Calculate counts dynamically
      const counts = {};

      const updatedData = resUnitdata.map((obj) => {
        const key = `${obj.branch}-${obj.unit}`;
        obj.count = (counts[key] || 0) + 1;
        counts[key] = obj.count;

        obj.systemname = `W${obj?.branchcode
          ?.slice(0, 2)
          ?.toUpperCase()}${obj?.unitcode?.slice(0, 2)?.toUpperCase()}_${
          obj.count
        }_${obj.username?.toUpperCase()}`;

        obj.systemshortname = `W${obj?.branchcode
          ?.slice(0, 2)
          ?.toUpperCase()}${obj?.unitcode?.slice(0, 2)?.toUpperCase()}_${
          obj.count
        }_${obj.username?.toUpperCase()}`;

        return obj;
      });

      setEmployees(updatedData);
      setisBtnFilter(false);
      setLoader(false);
    } catch (err) {
      setLoader(false);
      setisBtnFilter(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    // setIsActive(true)
    if (
      selectedOptionsCompany?.length === 0 &&
      selectedOptionsBranch?.length === 0 &&
      selectedOptionsUnit?.length === 0 &&
      selectedOptionsTeam?.length === 0
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Any One Field"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequest();
    }
  };

  const handleClear = (e) => {
    setisBtnClear(true);
    e.preventDefault();
    setSelectedOptionsBranch([]);
    setSelectedOptionsUnit([]);
    setSelectedOptionsTeam([]);
    setSelectedOptionsCompany([]);
    setValueCompanyCat([]);
    setValueBranchCat([]);
    setValueUnitCat([]);
    setValueTeamCat([]);
    setClearOpenalert(true);
    setTimeout(() => {
      setClearOpenalert(false);
      setisBtnClear(false);
    }, 1000);
  };

  const workfromhomesystemDetails = [
    { label: "Desktop", value: "Desktop" },
    { label: "Laptop", value: "Laptop" },
  ];
  const workfromhomeinternetDetails = [
    { label: "WIFI", value: "WIFI" },
    { label: "Mobile Network", value: "Mobile Network" },
  ];
  const auditcheckListOpt = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ];

  const [documentFiles, setdocumentFiles] = useState([]);

  const handleFileDelete = (index) => {
    setdocumentFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleResumeUpload = (event) => {
    const resume = event.target.files;
    const maxFileSize = 1 * 1024 * 1024; // 1MB in bytes
    let showAlert = false;
    for (let i = 0; i < resume?.length; i++) {
      const reader = new FileReader();
      const file = resume[i];
      if (file.size > maxFileSize) {
        showAlert = true;
        continue; // Skip this file and continue with the next one
      }
      reader.readAsDataURL(file);
      reader.onload = () => {
        setdocumentFiles((prevFiles) => [
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
    if (showAlert) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"File size is greater than 1MB, please upload a file below 1MB."}
          </p>
        </>
      );
      handleClickOpenerr();
    }
  };

  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  const [documentFilesssid, setdocumentFilesssid] = useState([]);

  const handleFileDeletessid = (index) => {
    setdocumentFilesssid((prevFiles) =>
      prevFiles.filter((_, i) => i !== index)
    );
  };

  const handleResumeUploadssid = (event) => {
    const resume = event.target.files;
    const maxFileSize = 1 * 1024 * 1024; // 1MB in bytes
    let showAlert = false;
    for (let i = 0; i < resume?.length; i++) {
      const reader = new FileReader();
      const file = resume[i];
      if (file.size > maxFileSize) {
        showAlert = true;
        continue; // Skip this file and continue with the next one
      }
      reader.readAsDataURL(file);
      reader.onload = () => {
        setdocumentFilesssid((prevFiles) => [
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
    if (showAlert) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"File size is greater than 1MB, please upload a file below 1MB."}
          </p>
        </>
      );
      handleClickOpenerr();
    }
  };

  const renderFilePreviewssid = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  return (
    <Box>
      <NotificationContainer />
      <Headtitle title={"Remote Employee"} />
      <LoadingBackdrop open={isLoading} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>Remote Employee List</Typography>

      {isUserRoleCompare?.includes("aremoteemployeelist") && (
        <>
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography sx={userStyle.importheadtext}>
                    Remote Employee List
                  </Typography>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={isAssignBranch
                        ?.map((data) => ({
                          label: data.company,
                          value: data.company,
                        }))
                        .filter((item, index, self) => {
                          return (
                            self.findIndex(
                              (i) =>
                                i.label === item.label && i.value === item.value
                            ) === index
                          );
                        })}
                      value={selectedOptionsCompany}
                      onChange={(e) => {
                        handleCompanyChange(e);
                        setSelectedOptionsBranch([]);
                        setValueBranchCat([]);
                        setValueUnitCat([]);
                        setValueTeamCat([]);
                        setSelectedOptionsUnit([]);
                        setSelectedOptionsTeam([]);
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
                      options={isAssignBranch
                        ?.filter((comp) => {
                          let datas = selectedOptionsCompany?.map(
                            (item) => item?.value
                          );
                          return datas?.includes(comp.company);
                        })
                        ?.map((data) => ({
                          label: data.branch,
                          value: data.branch,
                        }))
                        .filter((item, index, self) => {
                          return (
                            self.findIndex(
                              (i) =>
                                i.label === item.label && i.value === item.value
                            ) === index
                          );
                        })}
                      value={selectedOptionsBranch}
                      onChange={(e) => {
                        handleBranchChange(e);
                        setSelectedOptionsTeam([]);
                        setSelectedOptionsUnit([]);
                        setValueUnitCat([]);
                        setValueTeamCat([]);
                      }}
                      valueRenderer={customValueRendererBranch}
                      labelledBy="Please Select Branch"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Unit <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={isAssignBranch
                        ?.filter((comp) => {
                          let compdatas = selectedOptionsCompany?.map(
                            (item) => item?.value
                          );
                          let branchdatas = selectedOptionsBranch?.map(
                            (item) => item?.value
                          );
                          return (
                            compdatas?.includes(comp.company) &&
                            branchdatas?.includes(comp.branch)
                          );
                        })
                        ?.map((data) => ({
                          label: data.unit,
                          value: data.unit,
                        }))
                        .filter((item, index, self) => {
                          return (
                            self.findIndex(
                              (i) =>
                                i.label === item.label && i.value === item.value
                            ) === index
                          );
                        })}
                      value={selectedOptionsUnit}
                      onChange={(e) => {
                        handleUnitChange(e);
                        setValueTeamCat([]);
                        setSelectedOptionsTeam([]);
                      }}
                      valueRenderer={customValueRendererUnit}
                      labelledBy="Please Select Unit"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Team <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={allTeam
                        ?.filter((comp) => {
                          let compdatas = selectedOptionsCompany?.map(
                            (item) => item?.value
                          );
                          let branchdatas = selectedOptionsBranch?.map(
                            (item) => item?.value
                          );
                          let unitdatas = selectedOptionsUnit?.map(
                            (item) => item?.value
                          );
                          return (
                            compdatas?.includes(comp.company) &&
                            branchdatas?.includes(comp.branch) &&
                            unitdatas?.includes(comp.unit)
                          );
                        })
                        ?.map((data) => ({
                          label: data.teamname,
                          value: data.teamname,
                        }))
                        .filter((item, index, self) => {
                          return (
                            self.findIndex(
                              (i) =>
                                i.label === item.label && i.value === item.value
                            ) === index
                          );
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
                &ensp;
              </Grid>
              <br /> <br />
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
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={isBtnFilter}
                  >
                    Filter
                  </Button>

                  <Button
                    sx={userStyle.btncancel}
                    onClick={handleClear}
                    disabled={isBtnClear}
                  >
                    CLEAR
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </>
      )}
      <br />
      <br />
      {loader === true ? (
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
          {isUserRoleCompare?.includes("menuremoteemployeelist") && (
            <>
              <Box sx={userStyle.container}>
                {/* ******************************************************EXPORT Buttons****************************************************** */}
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Remote Employee List
                  </Typography>
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
                        <MenuItem value={employees?.length}>All</MenuItem>
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
                      {isUserRoleCompare?.includes(
                        "excelremoteemployeelist"
                      ) && (
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
                      {isUserRoleCompare?.includes("csvremoteemployeelist") && (
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
                      {isUserRoleCompare?.includes(
                        "printremoteemployeelist"
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
                      {isUserRoleCompare?.includes("pdfremoteemployeelist") && (
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
                      {isUserRoleCompare?.includes(
                        "imageremoteemployeelist"
                      ) && (
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
                <br />
                <br />
                {isBankdetail === true ? (
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
                    {/* <Box style={userStyle.dataTablestyle}>
                      <Box>
                        Showing{" "}
                        {filteredData?.length > 0
                          ? (page - 1) * pageSize + 1
                          : 0}{" "}
                        to {Math.min(page * pageSize, filteredDatas?.length)} of{" "}
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
                    </Box> */}
                    <Box style={userStyle.dataTablestyle}>
                      <Box>
                        Showing{" "}
                        {filteredData?.length > 0
                          ? (page - 1) * pageSize + 1
                          : 0}{" "}
                        to {Math.min(page * pageSize, filteredDatas?.length)} of{" "}
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
                  </>
                )}
              </Box>
            </>
          )}
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

      {/* Delete Modal */}

      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="lg"
        >
          <Box sx={userStyle.dialogbox}>
            <>
              <Typography sx={userStyle.HeaderText}>
                {" "}
                Remote Employee Details
              </Typography>
              <br />
              <br />
              <Grid container spacing={2}>
                {!employeeDetails?.workstationinput && (
                  <Grid item md={4} sm={12} xs={12}>
                    <Typography>
                      Work Station: {primaryWorkStationInput}
                    </Typography>
                  </Grid>
                )}

                <Grid item md={4} sm={12} xs={12}>
                  <Typography>Employee code: {pfesiform.empcode}</Typography>
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                  <Typography>
                    Employee Name: {pfesiform.companyname}
                  </Typography>
                </Grid>
              </Grid>{" "}
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <Typography sx={userStyle.SubHeaderText}>
                    {" "}
                    WFH System Details
                  </Typography>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      System Type<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={workfromhomesystemDetails}
                      value={selectedOptionsSystemType}
                      onChange={(e) => {
                        handleSystemTypeChange(e);
                      }}
                      valueRenderer={customValueRendererSystemType}
                      labelledBy="Please Select System Type"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Configuration Details <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={5}
                      value={addremoteemployeeWorkmode.wfhconfigurationdetails}
                      onChange={(e) => {
                        setAddremoteemployeeWorkmode({
                          ...addremoteemployeeWorkmode,
                          wfhconfigurationdetails: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                  <Typography>
                    WFH Setup Photo <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Grid>
                    <Button
                      variant="contained"
                      size="small"
                      component="label"
                      sx={{
                        "@media only screen and (max-width:550px)": {
                          marginY: "5px",
                        },
                      }}
                    >
                      Upload
                      <input
                        type="file"
                        id="resume"
                        accept=".jpeg, .png, .jpg, .ipg"
                        name="file"
                        hidden
                        onChange={(e) => {
                          handleResumeUpload(e);
                        }}
                      />
                    </Button>
                    <br />
                    <br />
                    {documentFiles?.length > 0 &&
                      documentFiles.map((file, index) => (
                        <>
                          <Grid container spacing={2}>
                            <Grid item md={6} sm={6} xs={6}>
                              <Typography>{file.name}</Typography>
                            </Grid>
                            <Grid></Grid>
                            <Grid item md={1} sm={6} xs={6}>
                              <VisibilityOutlinedIcon
                                style={{
                                  fontsize: "large",
                                  color: "#357AE8",
                                  cursor: "pointer",
                                }}
                                onClick={() => renderFilePreview(file)}
                              />
                            </Grid>
                            <Grid item md={1} sm={6} xs={6}>
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
                <Grid item md={12} xs={12} sm={12}>
                  <Typography sx={userStyle.SubHeaderText}>
                    {" "}
                    Internet Details
                  </Typography>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Network Type <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={workfromhomeinternetDetails}
                      value={selectedOptionsNetworkType}
                      onChange={(e) => {
                        handleNetworkTypeChange(e);
                      }}
                      valueRenderer={customValueRendererNetworkType}
                      labelledBy="Please Select Network Type"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth>
                    <Typography>
                      Daily Limit <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Daily Limit"
                      value={addremoteemployeeWorkmode.internetdailylimit}
                      onChange={(e) => {
                        setAddremoteemployeeWorkmode({
                          ...addremoteemployeeWorkmode,
                          internetdailylimit: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth>
                    <Typography>
                      Internet Speed<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Internet Speed"
                      value={addremoteemployeeWorkmode.internetspeed}
                      onChange={(e) => {
                        setAddremoteemployeeWorkmode({
                          ...addremoteemployeeWorkmode,
                          internetspeed: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth>
                    <Typography>
                      SSID-Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter SSID Name"
                      value={addremoteemployeeWorkmode.internetssidname}
                      onChange={(e) => {
                        setAddremoteemployeeWorkmode({
                          ...addremoteemployeeWorkmode,
                          internetssidname: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                  <Typography>
                    SSID-Photo <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Grid>
                    <Button
                      variant="contained"
                      size="small"
                      component="label"
                      sx={{
                        "@media only screen and (max-width:550px)": {
                          marginY: "5px",
                        },
                      }}
                    >
                      Upload
                      <input
                        type="file"
                        id="resume"
                        accept=".jpeg, .png, .jpg, .ipg"
                        name="file"
                        hidden
                        onChange={(e) => {
                          handleResumeUploadssid(e);
                        }}
                      />
                    </Button>
                    <br />
                    <br />
                    {documentFilesssid?.length > 0 &&
                      documentFilesssid.map((file, index) => (
                        <>
                          <Grid container spacing={2}>
                            <Grid item md={6} sm={6} xs={6}>
                              <Typography>{file.name}</Typography>
                            </Grid>
                            <Grid></Grid>
                            <Grid item md={1} sm={6} xs={6}>
                              <VisibilityOutlinedIcon
                                style={{
                                  fontsize: "large",
                                  color: "#357AE8",
                                  cursor: "pointer",
                                }}
                                onClick={() => renderFilePreviewssid(file)}
                              />
                            </Grid>
                            <Grid item md={1} sm={6} xs={6}>
                              <Button
                                style={{
                                  fontsize: "large",
                                  color: "#357AE8",
                                  cursor: "pointer",
                                  marginTop: "-5px",
                                }}
                                onClick={() => handleFileDeletessid(index)}
                              >
                                <DeleteIcon />
                              </Button>
                            </Grid>
                          </Grid>
                        </>
                      ))}
                  </Grid>
                </Grid>

                <Grid item md={12} xs={12} sm={12}>
                  <Typography sx={userStyle.SubHeaderText}>
                    Audit Checklist
                  </Typography>
                </Grid>
                <Grid item md={9} sm={12} xs={12}>
                  <Typography>
                    1. Work area is secure and restricted to only the SDS
                    employee<b style={{ color: "red" }}>*</b>
                  </Typography>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Selects
                      maxMenuHeight={250}
                      options={auditcheckListOpt}
                      placeholder="Please Select SubCategory"
                      value={{
                        label:
                          addremoteemployeeWorkmode.auditchecklistworkareasecure,
                        value:
                          addremoteemployeeWorkmode.auditchecklistworkareasecure,
                      }}
                      onChange={(e) => {
                        setAddremoteemployeeWorkmode({
                          ...addremoteemployeeWorkmode,
                          auditchecklistworkareasecure: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={9} sm={12} xs={12}>
                  <Typography>
                    2. Windows on ground level work area(s) can be covered when
                    viewing PHI (e.g., blinds)<b style={{ color: "red" }}>*</b>
                  </Typography>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Selects
                      maxMenuHeight={250}
                      options={auditcheckListOpt}
                      placeholder="Please Select SubCategory"
                      value={{
                        label:
                          addremoteemployeeWorkmode.auditchecklistwindowsongroundlevelworkarea,
                        value:
                          addremoteemployeeWorkmode.auditchecklistwindowsongroundlevelworkarea,
                      }}
                      onChange={(e) => {
                        setAddremoteemployeeWorkmode({
                          ...addremoteemployeeWorkmode,
                          auditchecklistwindowsongroundlevelworkarea: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={9} sm={12} xs={12}>
                  <Typography>
                    3. Workstation is stored in a secured area when not in use
                    <b style={{ color: "red" }}>*</b>
                  </Typography>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Selects
                      maxMenuHeight={250}
                      options={auditcheckListOpt}
                      placeholder="Please Select SubCategory"
                      value={{
                        label:
                          addremoteemployeeWorkmode.auditchecklistworkstationisstored,
                        value:
                          addremoteemployeeWorkmode.auditchecklistworkstationisstored,
                      }}
                      onChange={(e) => {
                        setAddremoteemployeeWorkmode({
                          ...addremoteemployeeWorkmode,
                          auditchecklistworkstationisstored: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={9} sm={12} xs={12}>
                  <Typography>
                    4. No privately owned equipment in use (e.g., personal
                    laptop)<b style={{ color: "red" }}>*</b>
                  </Typography>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Selects
                      maxMenuHeight={250}
                      options={auditcheckListOpt}
                      placeholder="Please Select SubCategory"
                      value={{
                        label:
                          addremoteemployeeWorkmode.auditchecklistnoprivatelyowned,
                        value:
                          addremoteemployeeWorkmode.auditchecklistnoprivatelyowned,
                      }}
                      onChange={(e) => {
                        setAddremoteemployeeWorkmode({
                          ...addremoteemployeeWorkmode,
                          auditchecklistnoprivatelyowned: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={9} sm={12} xs={12}>
                  <Typography>
                    5. Wi-Fi security has WPA2 protection or better enabled
                    <b style={{ color: "red" }}>*</b>
                  </Typography>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Selects
                      maxMenuHeight={250}
                      options={auditcheckListOpt}
                      placeholder="Please Select SubCategory"
                      value={{
                        label:
                          addremoteemployeeWorkmode.auditchecklistwifisecurity,
                        value:
                          addremoteemployeeWorkmode.auditchecklistwifisecurity,
                      }}
                      onChange={(e) => {
                        setAddremoteemployeeWorkmode({
                          ...addremoteemployeeWorkmode,
                          auditchecklistwifisecurity: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br /> <br /> <br />
              <Grid
                item
                md={12}
                sm={12}
                xs={12}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "15px",
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={editSubmit}
                    // disabled={isBtn}
                  >
                    Save
                  </Button>
                  <Grid item md={1}></Grid>
                  <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
                    Cancel
                  </Button>
                </Grid>
                <Grid sx={{ display: "flex", justifyContent: "center" }}>
                  <Typography>
                    Manage Wi-Fi connection&#62; More Wi-Fi Settings&#62; choose
                    the connection &#62; take the screenshot (complete page with
                    SSID and other details)
                  </Typography>
                </Grid>
              </Grid>
            </>
          </Box>
        </Dialog>
      </Box>
      {/* Submit DIALOG */}
      <Dialog
        open={isAddOpenalert}
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
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
          <Typography variant="h6">
            <b>Updated Successfully👍</b>
          </Typography>
        </DialogContent>
      </Dialog>
      <Box>
        {/* ALERT DIALOG */}
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
            <Typography
              variant="h6"
              sx={{ color: "black", textAlign: "center" }}
            >
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

      <Box>
        <Dialog
          // open={isErrorOpen}
          onClose={handleCloseerr}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
            <Typography variant="h6"></Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error">
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* this is info view details */}

      <Dialog
        open={openInfo}
        onClose={handleCloseinfo}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
      >
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> Bank Detail Info</Typography>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">addedby</Typography>
                  <br />
                  <Table>
                    <TableHead>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {"SNO"}.
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {" "}
                        {"UserName"}
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {" "}
                        {"Date"}
                      </StyledTableCell>
                    </TableHead>
                    <TableBody>
                      {addedby?.map((item, i) => (
                        <StyledTableRow>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {i + 1}.
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {" "}
                            {item.name}
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {" "}
                            {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </FormControl>
              </Grid>
              <br />
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Updated by</Typography>
                  <br />
                  <Table>
                    <TableHead>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {"SNO"}.
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {" "}
                        {"UserName"}
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {" "}
                        {"Date"}
                      </StyledTableCell>
                    </TableHead>
                    <TableBody>
                      {updateby?.map((item, i) => (
                        <StyledTableRow>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {i + 1}.
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {" "}
                            {item.name}
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {" "}
                            {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br />
            <br />
            <Grid container spacing={2}>
              <Button variant="contained" onClick={handleCloseinfo}>
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

      {/* Clear DIALOG */}
      <Dialog
        open={isClearOpenalert}
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
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
          <Typography variant="h6">
            <b>Cleared Successfully👍</b>
          </Typography>
        </DialogContent>
      </Dialog>

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
            {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table aria-label="simple table" id="branch" ref={componentRef}>
          <TableHead sx={{ fontWeight: "600" }}>
            <StyledTableRow>
              <StyledTableCell>SI.NO</StyledTableCell>
              <StyledTableCell>Company</StyledTableCell>
              <StyledTableCell>Branch</StyledTableCell>
              <StyledTableCell>Unit</StyledTableCell>
              <StyledTableCell>Team</StyledTableCell>
              <StyledTableCell>Emp Code</StyledTableCell>
              <StyledTableCell>Name </StyledTableCell>

              <StyledTableCell>Username </StyledTableCell>
              {/* <StyledTableCell>Branchcode </StyledTableCell>
              <StyledTableCell>Unitcode </StyledTableCell>
              <StyledTableCell>Count </StyledTableCell>
              <StyledTableCell>Systemname </StyledTableCell>
              <StyledTableCell>Systemshortname </StyledTableCell> */}
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {rowDataTable &&
              rowDataTable.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{row.company} </StyledTableCell>
                  <StyledTableCell>{row.branch} </StyledTableCell>
                  <StyledTableCell>{row.unit} </StyledTableCell>
                  <StyledTableCell>{row.team} </StyledTableCell>
                  <StyledTableCell>{row.empcode} </StyledTableCell>
                  <StyledTableCell> {row.companyname}</StyledTableCell>

                  <StyledTableCell> {row.username}</StyledTableCell>
                  {/* <StyledTableCell> {row.branchcode}</StyledTableCell>
                  <StyledTableCell> {row.unitcode}</StyledTableCell>
                  <StyledTableCell> {row.count}</StyledTableCell>
                  <StyledTableCell> {row.systemname}</StyledTableCell>
                  <StyledTableCell> {row.systemshortname}</StyledTableCell> */}
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/*Export XL Data  */}
      <Dialog
        open={isFilterOpen}
        onClose={handleCloseFilterMod}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {fileFormat === "xl" ? (
            <>
              <IconButton
                aria-label="close"
                onClick={handleCloseFilterMod}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>

              <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
              <Typography variant="h5" sx={{ textAlign: "center" }}>
                Choose Export
              </Typography>
            </>
          ) : (
            <>
              <IconButton
                aria-label="close"
                onClick={handleCloseFilterMod}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>

              <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
              <Typography variant="h5" sx={{ textAlign: "center" }}>
                Choose Export
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            variant="contained"
            onClick={(e) => {
              handleExportXL("filtered");
            }}
          >
            Export Filtered Data
          </Button>
          <Button
            autoFocus
            variant="contained"
            onClick={(e) => {
              handleExportXL("overall");
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
      {/*Export pdf Data  */}
      <Dialog
        open={isPdfFilterOpen}
        onClose={handleClosePdfFilterMod}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleClosePdfFilterMod}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <PictureAsPdfIcon sx={{ fontSize: "80px", color: "red" }} />
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Choose Export
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={(e) => {
              downloadPdf("filtered");
              setIsPdfFilterOpen(false);
            }}
          >
            Export Filtered Data
          </Button>
          <Button
            variant="contained"
            onClick={(e) => {
              downloadPdf("overall");
              setIsPdfFilterOpen(false);
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default RemoteEmployeeList;
