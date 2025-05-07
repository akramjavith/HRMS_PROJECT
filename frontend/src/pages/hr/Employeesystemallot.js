import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ImageIcon from "@mui/icons-material/Image";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box, Button, TextField,
  Dialog, DialogActions, OutlinedInput,
  ListItem, ListItemText,
  DialogContent, FormControl, Grid, Popover,
  IconButton, MenuItem, Paper, InputAdornment,
  Select, List, Table, TableBody, Tooltip,
  TableContainer, TableHead, RadioGroup,
  Typography, Radio, Chip

} from "@mui/material";
import axios from "axios";
import domtoimage from 'dom-to-image';
import * as FileSaver from 'file-saver';
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaSearch, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import { NotificationContainer, NotificationManager, } from "react-notifications";
import 'react-notifications/lib/notifications.css';
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import * as XLSX from 'xlsx';
import AlertDialog from "../../components/Alert";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import MessageAlert from "../../components/MessageAlert";
import { StyledTableCell, StyledTableRow } from "../../components/Table";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTableForPaginationTable from "../../components/AggridTableForPaginationTable";
import Switch from "@mui/material/Switch";
import { MdClose } from "react-icons/md";
import { IoMdOptions } from "react-icons/io";
import FormControlLabel from "@mui/material/FormControlLabel";
import ExportData from "../../components/ExportData";

function Employeeassetsystemallot() {

  const [advancedFilter, setAdvancedFilter] = useState(null);
  const [additionalFilters, setAdditionalFilters] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const conditions = ["Contains", "Does Not Contain", "Equals", "Does Not Equal", "Begins With", "Ends With", "Blank", "Not Blank"]; // AgGrid-like conditions
  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("Contains");
  const [logicOperator, setLogicOperator] = useState("AND");
  const [filterValue, setFilterValue] = useState("");
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);

  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTable = useRef(null);

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

  let exportColumnNames = [
    "Emp Code",
    "Employee Name",
    "Department",
    "Branch",
    "Unit",
    "Team",
    "Work Mode",
    "Designation",
    "WFH Count",
    "Status",
    "Count",
    "Mode",
  ];
  let exportRowValues = [
    "empcode",
    "companyname",
    "department",
    "branch",
    "unit",
    "team",
    "workmode",
    "designation",
    "wfhcount",
    "wfhstatus",
    "employeecount",
    "systemmode",
  ];

  const [employeesystemallotEdit, setEmployeeSystemAllotEdit] = useState({ department: "Please Select Department" });
  const [employeesystemallots, setEmployeeSystemAllots] = useState([]);
  const [modes, setSmodes] = useState("Active");
  const [empcount, setEmpcount] = useState("");
  const [wfhcount, setwfhcount] = useState("");
  const [wfhstatus, setwfhstatus] = useState("");

  const { isUserRoleCompare, isAssignBranch, allTeam, buttonStyles, isUserRoleAccess, pageName,
    setPageName, allUsersData, allUsersLimit } = useContext(UserRoleAccessContext);

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
          data?.subsubpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subsubpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 &&
          data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.mainpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
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
  const { auth } = useContext(AuthContext);

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
      pagename: String("Employee System Allot Details"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),

      addedby: [
        {
          name: String(isUserRoleAccess?.companyname),
          date: String(new Date()),
        },
      ],
    });
  }
  const [employeesystemCheck, setEmployeeSyetemcheck] = useState(true);

  const gridRef = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);

  // //image
  // const handleCaptureImage = () => {
  //   if (gridRef.current) {
  //     html2canvas(gridRef.current).then((canvas) => {
  //       canvas.toBlob((blob) => {
  //         saveAs(blob, "Employee System Allot.png");
  //       });
  //     });
  //   }
  // };

  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, `Employee System Allot.png`);
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // view model
  const [openview, setOpenview] = useState(false);

  const handleClickOpenview = () => {
    setOpenview(true);
  };

  const handleCloseview = () => {
    setOpenview(false);
  };

  // Copied fields Name
  const handleCopy = (message) => {
    NotificationManager.success(`${message} 👍`, "", 2000);
  };


  // Error Popup model
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showAlertpop, setShowAlertpop] = useState();
  const handleClickOpenerrpop = () => {
    setIsErrorOpenpop(true);
  };
  const handleCloseerrpop = () => {
    setIsErrorOpenpop(false);
  };

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const handleClickOpenalert = () => {
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
    }
  };
  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    actions: true,
    serialNumber: true,
    empcode: true,
    companyname: true,
    department: true,
    branch: true,
    unit: true,
    team: true,
    designation: true,
    wfhcount: true,
    wfhstatus: true,
    employeecount: true,
    smode: true,
    workmode: true,
    systemmode: true,
  };

  // Show all columns
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };


  const columnDataTable = [
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 75,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
      pinned: "left",
    },
    {
      field: "empcode",
      headerName: "Emp Code",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.empcode,
      pinned: "left",
    },
    {
      field: "companyname",
      headerName: "Employee Name",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.companyname,
    },
    {
      field: "department",
      headerName: "Department",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.department,
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.branch,
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.unit,
    },
    {
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.team,
    },
    {
      field: "workmode",
      headerName: "Work Mode",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.workmode,
    },
    {
      field: "designation",
      headerName: "Designation",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.designation,
    },
    {
      field: "wfhcount",
      headerName: "WFH Count",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.wfhcount,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cellRenderer: (params) => (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ gap: "8px" }}
        >
          <>
            {/* Dropdown and Save button side by side */}
            <FormControl size="small" style={{ minWidth: 80 }}>
              <FormControl size="small" fullWidth>
                <OutlinedInput
                  id="component-outlined"
                  type="number"
                  sx={userStyle.input}
                  value={params.data.wfhcount}
                  disabled={params.data.wfhstatus === "No"}
                  onChange={(e) => {
                    EmployeeCodeWfh(params.data.id, "wfhcount", e.target.value);
                    // EmployeeCodeFunc(row._id, "employeecount", row.workstation.length > 0 ? (row.workstation.length < e.target.value ? "" : e.target.value) : e.target.value);
                    // setEmpcount(row.workstation.length < e.target.value ? "" : e.target.value);
                    setwfhcount(e.target.value);
                    setwfhstatus(params.data?.wfhstatus);
                    setSmodes(params.data.systemmode)

                  }}
                />
              </FormControl>
            </FormControl>
          </>

        </Grid>
      ),
    },
    {
      field: "wfhstatus",
      headerName: "Status",
      flex: 0,
      width: 130,
      minHeight: "40px",
      hide: !columnVisibility.wfhstatus,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cellRenderer: (params) => (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ gap: "8px" }}
        >
          <>
            {/* Dropdown and Save button side by side */}
            <FormControl size="small" style={{ minWidth: 80 }}>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 200,
                      width: "auto",
                    },
                  },
                }}
                value={params.data.wfhstatus}
                onChange={(e) => {
                  EmployeeSyetemwfhstatus(params.data.id, "wfhstatus", e.target.value);
                  setwfhstatus(e.target.value);
                  setwfhcount(params.data.wfhcount);
                  setSmodes(params.data.systemmode)


                }}
                // displayEmpty
                defaultValue="Yes" // Set the default value to "Active"
                inputProps={{ "aria-label": "Without label" }}

              >
                <MenuItem value="Yes">
                  Yes
                </MenuItem>
                <MenuItem value="No">
                  No
                </MenuItem>

              </Select>
            </FormControl>
          </>

        </Grid>
      ),
    },
    {
      field: "employeecount",
      headerName: "Count",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.employeecount,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cellRenderer: (params) => (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ gap: "8px" }}
        >
          <>
            {/* Dropdown and Save button side by side */}
            <FormControl size="small" style={{ minWidth: 80 }}>
              <FormControl size="small" fullWidth>
                <OutlinedInput
                  id="component-outlined"
                  type="number"
                  sx={userStyle.input}
                  value={params.data.employeecount}
                  disabled={params.data.wfhstatus === "No"}
                  onChange={(e) => {
                    EmployeeCodeWfh(params.data.id, "employeecount", e.target.value);
                    // EmployeeCodeFunc(row._id, "employeecount", row.workstation.length > 0 ? (row.workstation.length < e.target.value ? "" : e.target.value) : e.target.value);
                    // setEmpcount(row.workstation.length < e.target.value ? "" : e.target.value);
                    setwfhcount(e.target.value);
                    setwfhstatus(params.data?.wfhstatus);
                    setSmodes(params.data.systemmode)

                  }}
                />
              </FormControl>
            </FormControl>
          </>

        </Grid>
      ),
    },
    {
      field: "smode",
      headerName: "System Mode",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.smode,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cellRenderer: (params) => (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ gap: "8px" }}
        >
          <>
            {/* Dropdown and Save button side by side */}
            <FormControl size="small" style={{ minWidth: 80 }}>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 200,
                      width: "auto",
                    },
                  },
                }}
                value={params.data.systemmode}
                onChange={(e) => {
                  EmployeeSyetemmodeFunc(params.data.id, "systemmode", e.target.value);
                  setSmodes(e.target.value);
                  setwfhcount(params.data.wfhcount);
                  setwfhstatus(params.data?.wfhstatus);

                }}
                inputProps={{ "aria-label": "Without label" }}
              >
                <MenuItem value="In Active">
                  In Active
                </MenuItem>
                <MenuItem value="Active">
                  Active
                </MenuItem>

              </Select>
            </FormControl>
          </>

        </Grid>
      ),
    },
    {
      field: "systemmode",
      headerName: "Mode",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.systemmode,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 150,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,

      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cellRenderer: (params) => (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ gap: "8px" }}
        >
          <>
            {(isUserRoleCompare?.includes("eemployeesystemallotdetails") && (empcount != "" || modes) && openIndex === params.data.id) || openIndexwfh === params.data?.id ? (
              <Button variant="contained" sx={{ height: "34px", ...buttonStyles.buttonsubmit }} onClick={(e) => sendRequestIndex(params.data.id, params.data.employeecount, params.data.id, params.data.loginUserStatus)}>
                SAVE
              </Button>
            ) : null}
          </>
        </Grid>
      ),
    },
  ];


  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };



  const filterUsers = async () => {
    try {
      let res_vendor = await axios.get(SERVICE.USER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let result = res_vendor?.data?.users.filter((item) => {
        if (selectedOptionsTeam.length > 0) {
          let compdatas = selectedOptionsCompany?.map((item) => item?.value);
          let branchdatas = selectedOptionsBranch?.map((item) => item?.value);
          let unitdatas = selectedOptionsUnit?.map((item) => item?.value);
          let teamdatas = selectedOptionsTeam?.map((item) => item?.value);
          return (
            compdatas?.includes(item.company) &&
            branchdatas?.includes(item.branch) &&
            unitdatas?.includes(item.unit) &&
            teamdatas?.includes(item.team) &&
            (item.reasonablestatus === undefined || item.reasonablestatus == "")
          );
        } else if (selectedOptionsUnit.length > 0) {
          let compdatas = selectedOptionsCompany?.map((item) => item?.value);
          let branchdatas = selectedOptionsBranch?.map((item) => item?.value);
          let unitdatas = selectedOptionsUnit?.map((item) => item?.value);
          return (
            compdatas?.includes(item.company) &&
            branchdatas?.includes(item.branch) &&
            unitdatas?.includes(item.unit) &&
            (item.reasonablestatus === undefined || item.reasonablestatus == "")
          );
        } else if (selectedOptionsBranch.length > 0) {
          let compdatas = selectedOptionsCompany?.map((item) => item?.value);
          let branchdatas = selectedOptionsBranch?.map((item) => item?.value);
          return (
            compdatas?.includes(item.company) &&
            branchdatas?.includes(item.branch) &&
            (item.reasonablestatus === undefined || item.reasonablestatus == "")
          );
        } else {
          let compdatas = selectedOptionsCompany?.map((item) => item?.value);

          return (
            compdatas?.includes(item.company) &&
            (item.reasonablestatus === undefined || item.reasonablestatus == "")
          );
        }
      });


      setEmployeeSystemAllots(result.filter((item) =>
        accessbranch.some(
          (branch) =>
            branch.company === item.company &&
            branch.branch === item.branch &&
            branch.unit === item.unit
        )
      ));
      setEmployeeSyetemcheck(true);
    } catch (err) {
      setEmployeeSyetemcheck(true);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedOptionsCompany.length == 0) {

      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      setEmployeeSyetemcheck(false);
      filterUsers();
    }
  }

  const handleClear = (e) => {
    e.preventDefault();
    setSelectedOptionsCompany([]);
    setSelectedOptionsBranch([]);
    setSelectedOptionsUnit([]);
    setSelectedOptionsTeam([]);
    setEmployeeSystemAllots([]);

    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };


  //Project updateby edit page...
  let updateby = employeesystemallotEdit?.updatedby;
  let addedby = employeesystemallotEdit?.addedby;

  const [openIndex, setOpenIndex] = useState("");
  const EmployeeSyetemmodeFunc = (index, key, value) => {
    const updatedData = employeesystemallots?.map((row, i) => {
      if (row._id === index) {
        return { ...row, [key]: value };
      }
      return row;
    });

    setEmployeeSystemAllots(updatedData);
    setOpenIndex(index);
  };

  const EmployeeCodeFunc = (index, key, value) => {
    const updatedDatat = employeesystemallots?.map((row, i) => {
      if (row._id === index) {
        return { ...row, [key]: value };
      }
      return row;
    });
    setEmployeeSystemAllots(updatedDatat);
    setOpenIndex(index);
  };

  const [openIndexwfh, setOpenIndexwfh] = useState("")

  const EmployeeCodeWfh = (index, key, value) => {
    const updatedDatat = employeesystemallots?.map((row, i) => {
      if (row._id === index) {
        return { ...row, [key]: value };
      }
      return row;
    });
    setEmployeeSystemAllots(updatedDatat);
    setOpenIndexwfh(index);
  };

  const EmployeeSyetemwfhstatus = (index, key, value) => {
    const updatedDatat = employeesystemallots?.map((row, i) => {
      if (row._id === index) {
        return { ...row, [key]: value };
      }
      return row;
    });
    setEmployeeSystemAllots(updatedDatat);
    setOpenIndexwfh(index);
  };

  const sendRequestIndex = async (index, count, id, loginUserStatus) => {
    const uerssyscount = loginUserStatus.filter((data, index) => {
      return data.macaddress != "none"
    })
    if (count === "undefined") {

      setPopupContentMalert("Please Enter Count!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } if (Number(count) < uerssyscount?.length) {

      setPopupContentMalert(`This User Already Login More Than The ${count} Kinldy Give Larger Value!`);
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (count !== "undefined") {
      try {
        let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          employeecount: String(count),
          systemmode: String(modes),
          wfhcount: String(wfhcount),
          wfhstatus: String(wfhstatus),
        });
        // NotificationManager.success('Successfully Updated 👍', '', 2000);
        // await fetchEmployeeSystem();
        // setEmpcount("");
        setOpenIndex("");
        setOpenIndexwfh("")
        setPopupContent("Updated Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
      } catch (err) {
        handleApiError(
          err,
          setPopupContentMalert,
          setPopupSeverityMalert,
          handleClickOpenPopupMalert
        );
      }
    }
  };


  const [employeeSystemAllotsFilterArray, setEmployeeSystemAllotsFilterArray] = useState([])

  const fetchEmployeeSystemArray = async () => {
    try {
      let res_vendor = await axios.get(SERVICE.USER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setEmployeeSystemAllotsFilterArray(res_vendor?.data?.users);
      setEmployeeSyetemcheck(true);
    } catch (err) {
      setEmployeeSyetemcheck(true); handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  // pdf.....
  const columns = [
    // { title: "Sno", field: "serialNumber" },
    { title: "Emp Code", field: "empcode" },
    { title: "Employee Name", field: "companyname" },
    { title: "Department", field: "department" },
    { title: "Branch", field: "branch" },
    { title: "Unit", field: "unit" },
    { title: "Team", field: "team" },
    { title: "Designation", field: "designation" },
    { title: "WFH Count", field: "wfhcount" },
    { title: "Status", field: "wfhstatus" },
    { title: "Count", field: "employeecount" },
    // { title: "System Mode", field: "systemmode" },
    { title: "Mode", field: "systemmode" },
  ];

  const downloadPdf = (isfilter) => {

    const doc = new jsPDF();

    let serialNumberCounter = 1;

    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" },
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];

    const dataWithSerial = isfilter === "filtered" ?
      rowDataTable.map(row => ({ ...row, serialNumber: serialNumberCounter++ })) :
      overallFilterdataAllData.map(row => ({ ...row, serialNumber: serialNumberCounter++ }));

    doc.autoTable({
      theme: "grid",
      styles: {
        fontSize: 4,
        cellWidth: "auto"
      },
      columns: columnsWithSerial,
      body: dataWithSerial,
    });

    doc.save("Employee System Allot.pdf");
  };


  // Excel
  const fileName = "Employee System Allot";

  const [employeesystemData, setEmployeeSystemData] = useState([]);

  // get particular columns for export excel
  const getexcelDatas = () => {
    var data = employeesystemallots?.map((t, index) => ({
      Sno: index + 1,
      "Emp Code": t.empcode,
      "Employee Name": t.companyname,
      Department: t.department,
      Branch: t.branch,
      Unit: t.unit,
      Team: t.team,
      Designation: t.designation,
      Count: t.employeecount,
      // "System Mode": t.systemmode,
      Mode: t.systemmode,
    }));
    setEmployeeSystemData(data);
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Employee System Allot",
    pageStyle: "print",
  });

  const [overallFilterdata, setOverallFilterdata] = useState([]);
  const [overallFilterdataAllData, setOverallFilterdataAllData] = useState([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [anchorElSearch, setAnchorElSearch] = React.useState(null);
  const handleClickSearch = (event) => {
    setAnchorElSearch(event.currentTarget);
    localStorage.removeItem("filterModel");
  };
  const handleCloseSearch = () => {
    setAnchorElSearch(null);
    setSearchQuery("");
  };

  const [searchQuery, setSearchQuery] = useState("");


  const openSearch = Boolean(anchorElSearch);
  const idSearch = openSearch ? 'simple-popover' : undefined;

  const handleAddFilter = () => {
    if (selectedColumn && filterValue || ["Blank", "Not Blank"].includes(selectedCondition)) {
      setAdditionalFilters([
        ...additionalFilters,
        { column: selectedColumn, condition: selectedCondition, value: filterValue }
      ]);
      setSelectedColumn("");
      setSelectedCondition("Contains");
      setFilterValue("");
    }
  };


  const getSearchDisplay = () => {
    if (advancedFilter && advancedFilter.length > 0) {
      return advancedFilter.map((filter, index) => {
        let showname = columnDataTable.find(col => col.field === filter.column)?.headerName;
        return `${showname} ${filter.condition} "${filter.value}"`;
      }).join(' ' + (advancedFilter.length > 1 ? advancedFilter[1].condition : '') + ' ');
    }
    return searchQuery;
  };


  const handleResetSearch = async () => {

    setFilterLoader(true);
    setTableLoader(true);
    setPageName(!pageName);

    setAdvancedFilter(null);
    setAdditionalFilters([]);
    setSearchQuery("");
    setIsSearchActive(false);
    setSelectedColumn("");
    setSelectedCondition("Contains");
    setFilterValue("");
    setLogicOperator("AND");
    setFilteredChanges(null);

    const queryParams = {
      page: Number(page),
      pageSize: Number(pageSize),
      searchQuery: searchQuery,
      assignbranch: accessbranch,
      aggregationPipeline: [
        {
          $match: {
            $and: [
              // Enquiry status filter
              {
                enquirystatus: {
                  $nin: ["Enquiry Purpose"],
                },
              },
              // Reasonable status filter
              {
                resonablestatus: {
                  $nin: [
                    "Not Joined",
                    "Postponed",
                    "Rejected",
                    "Closed",
                    "Releave Employee",
                    "Absconded",
                    "Hold",
                    "Terminate",
                  ],
                },
              },
              // Conditional company filter
              ...(valueCompanyCat.length > 0
                ? [
                  {
                    company: { $in: valueCompanyCat },
                  },
                ]
                : [
                  {
                    company: { $in: allAssignCompany },
                  },
                ]),
              // Conditional branch filter
              ...(valueBranchCat.length > 0
                ? [
                  {
                    branch: { $in: valueBranchCat },
                  },
                ]
                : [
                  {
                    branch: { $in: allAssignBranch },
                  },
                ]),
              // Conditional unit filter
              ...(valueUnitCat.length > 0
                ? [
                  {
                    unit: { $in: valueUnitCat },
                  },
                ]
                : [
                  {
                    unit: { $in: allAssignUnit },
                  },
                ]),
              // Conditional team filter
              ...(valueTeamCat.length > 0
                ? [
                  {
                    team: { $in: valueTeamCat },
                  },
                ]
                : []),
              // Conditional department filter
              ...(valueDepartmentCat.length > 0
                ? [
                  {
                    department: { $in: valueDepartmentCat },
                  },
                ]
                : []),
              // Conditional Employee filter
              ...(valueEmployeeCat.length > 0
                ? [
                  {
                    companyname: { $in: valueEmployeeCat },
                  },
                ]
                : []),
            ],
          },
        },
        //  {
        //    $project: {
        //      company: 1,
        //      branch: 1,
        //      unit: 1,
        //      team: 1,
        //      empcode: 1,
        //      companyname: 1,
        //      department: 1,
        //      designation: 1,
        //      role: 1,
        //      process: 1,
        //    },
        //  },
      ]
    };

    const allFilters = [];
    // Only include advanced filters if they exist, otherwise just use regular searchQuery
    if (allFilters.length > 0 && selectedColumn !== "") {
      queryParams.allFilters = allFilters
      queryParams.logicOperator = logicOperator;
    } else if (searchQuery) {
      queryParams.searchQuery = searchQuery;  // Use searchQuery for regular search
    }


    try {
      let res_employee = await axios.post(SERVICE.DYNAMICUSER_CONTROLLER_SORT, queryParams, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []
      const itemsWithSerialNumber = ans?.map((item, index) => ({
        ...item,
        serialNumber: (page - 1) * pageSize + index + 1,
        wfhcount: item.wfhcount && item.wfhcount !== "0" ? item.wfhcount : "0",
        wfhstatus: item.wfhstatus && item.wfhstatus !== "Yes" ? item.wfhstatus : "Yes",
        // serialNumber: index + 1,
      }));
      setEmployeeSystemAllots(itemsWithSerialNumber);
      setOverallFilterdataAllData(res_employee?.data?.totalProjectsAllData?.length > 0 ? res_employee?.data?.totalProjectsAllData?.map((item, index) => ({
        ...item,
        serialNumber: index + 1
      })) : []);
      setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
      setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
      setPageSize((data) => { return ans?.length > 0 ? data : 10 });
      setPage((data) => { return ans?.length > 0 ? data : 1 });
      setFilterLoader(false);
      setTableLoader(false);
    } catch (err) {
      setFilterLoader(false);
      setTableLoader(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchEmployee = async () => {

    setPageName(!pageName)
    const queryParams = {
      page: Number(page),
      pageSize: Number(pageSize),
      searchQuery: searchQuery,
      assignbranch: accessbranch,
      aggregationPipeline: [
        {
          $match: {
            $and: [
              // Enquiry status filter
              {
                enquirystatus: {
                  $nin: ["Enquiry Purpose"],
                },
              },
              // Reasonable status filter
              {
                resonablestatus: {
                  $nin: [
                    "Not Joined",
                    "Postponed",
                    "Rejected",
                    "Closed",
                    "Releave Employee",
                    "Absconded",
                    "Hold",
                    "Terminate",
                  ],
                },
              },
              // Conditional company filter
              ...(valueCompanyCat.length > 0
                ? [
                  {
                    company: { $in: valueCompanyCat },
                  },
                ]
                : [
                  {
                    company: { $in: allAssignCompany },
                  },
                ]),
              // Conditional branch filter
              ...(valueBranchCat.length > 0
                ? [
                  {
                    branch: { $in: valueBranchCat },
                  },
                ]
                : [
                  {
                    branch: { $in: allAssignBranch },
                  },
                ]),
              // Conditional unit filter
              ...(valueUnitCat.length > 0
                ? [
                  {
                    unit: { $in: valueUnitCat },
                  },
                ]
                : [
                  {
                    unit: { $in: allAssignUnit },
                  },
                ]),
              // Conditional team filter
              ...(valueTeamCat.length > 0
                ? [
                  {
                    team: { $in: valueTeamCat },
                  },
                ]
                : []),
              // Conditional department filter
              ...(valueDepartmentCat.length > 0
                ? [
                  {
                    department: { $in: valueDepartmentCat },
                  },
                ]
                : []),
              // Conditional Employee filter
              ...(valueEmployeeCat.length > 0
                ? [
                  {
                    companyname: { $in: valueEmployeeCat },
                  },
                ]
                : []),
            ],
          },
        },
        //  {
        //    $project: {
        //      company: 1,
        //      branch: 1,
        //      unit: 1,
        //      team: 1,
        //      empcode: 1,
        //      companyname: 1,
        //      department: 1,
        //      designation: 1,
        //      role: 1,
        //      process: 1,
        //    },
        //  },
      ]
    };


    const allFilters = [
      ...additionalFilters,
      { column: selectedColumn, condition: selectedCondition, value: filterValue }
    ];

    if (allFilters.length > 0 && selectedColumn !== "") {
      queryParams.allFilters = allFilters
      queryParams.logicOperator = logicOperator;
    } else if (searchQuery) {
      queryParams.searchQuery = searchQuery;
    }


    try {
      let res_employee = await axios.post(SERVICE.DYNAMICUSER_CONTROLLER_SORT, queryParams, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []
      const itemsWithSerialNumber = ans?.map((item, index) => ({
        ...item,
        serialNumber: (page - 1) * pageSize + index + 1,
        wfhcount: item.wfhcount && item.wfhcount !== "0" ? item.wfhcount : "0",
        wfhstatus: item.wfhstatus && item.wfhstatus !== "Yes" ? item.wfhstatus : "Yes",
        // serialNumber: index + 1,
      }));
      setEmployeeSystemAllots(itemsWithSerialNumber);
      setOverallFilterdataAllData(res_employee?.data?.totalProjectsAllData?.length > 0 ? res_employee?.data?.totalProjectsAllData?.map((item, index) => ({
        ...item,
        serialNumber: index + 1
      })) : []);
      setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
      setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
      setPageSize((data) => { return ans?.length > 0 ? data : 10 });
      setPage((data) => { return ans?.length > 0 ? data : 1 });

    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  useEffect(() => {
    fetchEmployee();
  }, [page, pageSize, searchQuery]);

  useEffect(() => {
    getexcelDatas();
  }, [employeesystemallotEdit, employeesystemallots]);



  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);



  //table entries ..,.
  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = employeesystemallots
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [employeesystemallots]);

  //table sorting
  const [sorting, setSorting] = useState({ column: "", direction: "" });

  const handleSorting = (column) => {
    const direction = sorting.column === column && sorting.direction === "asc" ? "desc" : "asc";
    setSorting({ column, direction });
  };

  items.sort((a, b) => {
    if (sorting.direction === "asc") {
      return a[sorting.column] > b[sorting.column] ? 1 : -1;
    } else if (sorting.direction === "desc") {
      return a[sorting.column] < b[sorting.column] ? 1 : -1;
    }
    return 0;
  });

  const renderSortingIcon = (column) => {
    if (sorting.column !== column) {
      return (
        <>
          <Box sx={{ color: "#bbb6b6" }}>
            <Grid sx={{ height: "6px", fontSize: "1.6rem" }}>
              <ArrowDropUpOutlinedIcon />
            </Grid>
            <Grid sx={{ height: "6px", fontSize: "1.6rem" }}>
              <ArrowDropDownOutlinedIcon />
            </Grid>
          </Box>
        </>
      );
    } else if (sorting.direction === "asc") {
      return (
        <>
          <Box>
            <Grid sx={{ height: "6px" }}>
              <ArrowDropUpOutlinedIcon style={{ color: "black", fontSize: "1.6rem" }} />
            </Grid>
            <Grid sx={{ height: "6px" }}>
              <ArrowDropDownOutlinedIcon style={{ color: "#bbb6b6", fontSize: "1.6rem" }} />
            </Grid>
          </Box>
        </>
      );
    } else {
      return (
        <>
          <Box>
            <Grid sx={{ height: "6px" }}>
              <ArrowDropUpOutlinedIcon style={{ color: "#bbb6b6", fontSize: "1.6rem" }} />
            </Grid>
            <Grid sx={{ height: "6px" }}>
              <ArrowDropDownOutlinedIcon style={{ color: "black", fontSize: "1.6rem" }} />
            </Grid>
          </Box>
        </>
      );
    }
  };


  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
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
    return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  // const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

  // const totalPages = Math.ceil(employeesystemallots.length / pageSize);

  // const visiblePages = Math.min(totalPages, 3);

  // const firstVisiblePage = Math.max(1, page - 1);
  // const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

  // const pageNumbers = [];

  // for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
  //   pageNumbers.push(i);
  // }

  const filteredSelectedColumn = columnDataTable.filter(data => data.field !== 'checkbox' && data.field !== "actions" && data.field !== "serialNumber");

  const rowDataTable = filteredDatas.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      empcode: item.empcode,
      companyname: item.companyname,
      department: item.department,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      workmode: item.workmode,
      designation: item.designation,
      count: item.employeecount,
      smode: item.systemmode,
      mode: item.systemmode,
      systemmode: item.systemmode,
      employeecount: item.employeecount,
      wfhcount: item.wfhcount,
      wfhstatus: item.wfhstatus,
      workstation: item.workstation,
      loginUserStatus: item.loginUserStatus

    };
  });


  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRows.includes(row.id),
  }));


  // Manage Columns
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowsList, setSelectedRowsList] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");

  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
    setSearchQueryManage("");
  };

  // // Function to filter columns based on search query
  const filteredColumns = columnDataTable.filter((column) =>
    column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
  );


  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

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
  // Show All Columns functionality
  const handleShowAllColumns = () => {
    const updatedVisibility = { ...columnVisibility };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibility(updatedVisibility);
  };

  const [fileFormat, setFormat] = useState('')
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = fileFormat === "xl" ? '.xlsx' : '.csv';
  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }


  const handleExportXL = (isfilter) => {
    if (isfilter === "filtered") {
      exportToCSV(
        rowDataTable?.map((t, index) => ({
          "Sno": index + 1,
          Empcode: t.empcode,
          Employeename: t.companyname,
          Department: t.department,
          Branch: t.branch,
          Unit: t.unit,
          Team: t.team,
          Designation: t.designation,
          "WFH Count": t.wfhcount,
          "Status": t.wfhstatus,
          Count: t.employeecount,
          // smode: t.systemmode,
          mode: t.systemmode,
          // systemmode: t.systemmode,
          // employeecount: t.employeecount,
          // workstation: t.workstation,
        })),
        fileName,
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        items.map((t, index) => ({
          "Sno": index + 1,
          Empcode: t.empcode,
          Employeename: t.companyname,
          Department: t.department,
          Branch: t.branch,
          Unit: t.unit,
          Team: t.team,
          Designation: t.designation,
          "WFH Count": t.wfhcount,
          "Status": t.wfhstatus,
          Count: t.employeecount,
          // smode: t.systemmode,
          mode: t.systemmode,
          // systemmode: t.systemmode,
          // employeecount: t.employeecount,
          // workstation: t.workstation,

        })),
        fileName,
      );

    }

    setIsFilterOpen(false)
  };



  //FILTER START
  const [internChecked, setInternChecked] = useState(false);
  useEffect(() => {
    fetchDepartments();
  }, []);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const fetchDepartments = async () => {
    //  setPageName(!pageName);
    try {
      let req = await axios.get(SERVICE.DEPARTMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDepartmentOptions(
        req?.data?.departmentdetails?.map((data) => ({
          label: data?.deptname,
          value: data?.deptname,
        }))
      );
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [filterState, setFilterState] = useState({
    type: "Individual",
    employeestatus: "Please Select Employee Status",
  });
  const EmployeeStatusOptions = [
    { label: "Live Employee", value: "Live Employee" },
    { label: "Releave Employee", value: "Releave Employee" },
    { label: "Absconded", value: "Absconded" },
    { label: "Hold", value: "Hold" },
    { label: "Terminate", value: "Terminate" },
  ];
  const TypeOptions = [
    { label: "Individual", value: "Individual" },
    { label: "Department", value: "Department" },
    { label: "Company", value: "Company" },
    { label: "Branch", value: "Branch" },
    { label: "Unit", value: "Unit" },
    { label: "Team", value: "Team" },
  ];

  //MULTISELECT ONCHANGE START

  //company multiselect
  const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
  let [valueCompanyCat, setValueCompanyCat] = useState([]);

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
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
    setValueEmp([]);
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
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
    setValueEmp([]);
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
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
    setValueEmp([]);
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
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
    setValueEmp([]);
  };

  const customValueRendererTeam = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length
      ? valueTeamCat.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };

  //department multiselect
  const [selectedOptionsDepartment, setSelectedOptionsDepartment] = useState(
    []
  );
  let [valueDepartmentCat, setValueDepartmentCat] = useState([]);

  const handleDepartmentChange = (options) => {
    setValueDepartmentCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsDepartment(options);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
    setValueEmp([]);
  };

  const customValueRendererDepartment = (valueDepartmentCat, _categoryname) => {
    return valueDepartmentCat?.length
      ? valueDepartmentCat.map(({ label }) => label)?.join(", ")
      : "Please Select Department";
  };
  //employee multiselect
  const [selectedOptionsEmployee, setSelectedOptionsEmployee] = useState([]);
  let [valueEmployeeCat, setValueEmployeeCat] = useState([]);

  const handleEmployeeChange = (options) => {
    setValueEmployeeCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setValueEmp(
      options.map((a, index) => {
        return a.value;
      })
    );

    setSelectedOptionsEmployee(options);
  };

  const customValueRendererEmployee = (valueEmployeeCat, _categoryname) => {
    return valueEmployeeCat?.length
      ? valueEmployeeCat.map(({ label }) => label)?.join(", ")
      : "Please Select Employee";
  };


  const [valueEmp, setValueEmp] = React.useState([]); // State for employees
  const [isBoxFocused, setIsBoxFocused] = React.useState(false); // Track focus state


  const [searchInputValue, setSearchInputValue] = useState('');

  const handlePasteForEmp = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');

    // Process the pasted text
    const pastedNames = pastedText
      .split(/[\n,]+/)
      .map(name => name.trim())
      .filter(name => name !== "");

    // Update the state
    updateEmployees(pastedNames);

    // Clear the search input after paste
    setSearchInputValue('');

    // Refocus the element
    e.target.focus();
  };

  useEffect(() => {
    updateEmployees([]); // Pass an empty array instead of an empty string
  }, [allUsersData, valueCompanyCat, valueBranchCat, valueUnitCat, valueTeamCat]);

  const updateEmployees = (pastedNames) => {
    // Your existing update logic...
    const namesArray = Array.isArray(pastedNames) ? pastedNames : [];

    const availableOptions = allUsersData
      ?.filter(
        (comp) =>
          valueCompanyCat?.includes(comp.company) &&
          valueBranchCat?.includes(comp.branch) &&
          valueUnitCat?.includes(comp.unit) &&
          valueTeamCat?.includes(comp.team)
      )
      ?.map(data => data.companyname.replace(/\s*\.\s*/g, ".").trim())

    const matchedValues = namesArray.filter((name) =>
      availableOptions.includes(name.replace(/\s*\.\s*/g, ".").trim())
    );

    // Update selected options
    const newOptions = matchedValues.map(value => ({
      label: value,
      value: value
    }));

    setSelectedOptionsEmployee(prev => {
      const newValues = newOptions.filter(
        newOpt => !prev.some(prevOpt => prevOpt.value === newOpt.value)
      );
      return [...prev, ...newValues];
    });

    // Update other states...
    setValueEmp(prev => [...new Set([...prev, ...matchedValues])]);
    setValueEmployeeCat(prev => [...new Set([...prev, ...matchedValues])]);
  };

  // Handle clicks outside the Box
  useEffect(() => {
    const handleClickOutside = (e) => {
      const boxElement = document.getElementById("paste-box"); // Add an ID to the Box
      if (boxElement && !boxElement.contains(e.target)) {
        setIsBoxFocused(false); // Reset focus state if clicking outside the Box
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDelete = (e, value) => {
    e.preventDefault();
    setSelectedOptionsEmployee((current) => current.filter(emp => emp.value !== value));
    setValueEmp((current) => current.filter(empValue => empValue !== value));
    setValueEmployeeCat((current) => current.filter(empValue => empValue !== value));
  };

  //MULTISELECT ONCHANGE END
  const handleClearFilter = () => {
    setValueCompanyCat([]);
    setSelectedOptionsCompany([]);
    setValueBranchCat([]);
    setSelectedOptionsBranch([]);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
    setValueEmp([]); setEmployeeOptions([]);
    setEmployeeSystemAllots([]);
    setInternChecked(false);
    setFilterState({
      type: "Individual",
      employeestatus: "Please Select Employee Status",
    });

    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  const [filterLoader, setFilterLoader] = useState(false);
  const [updateLoader, setUpdateLoader] = useState(false);
  const [tableLoader, setTableLoader] = useState(false);
  const handleFilter = () => {
    if (
      filterState?.type === "Please Select Type" ||
      filterState?.type === ""
    ) {
      setPopupContentMalert("Please Select Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsCompany?.length === 0) {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    // else if (
    //   filterState?.employeestatus === "Please Select Employee Status" ||
    //   filterState?.employeestatus === ""
    // ) {
    //   setPopupContentMalert("Please Select Employee Status!");
    //   setPopupSeverityMalert("info");
    //   handleClickOpenPopupMalert();
    // }
    else if (
      ["Individual", "Branch", "Unit", "Team"]?.includes(filterState?.type) &&
      selectedOptionsBranch?.length === 0
    ) {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      ["Individual", "Unit", "Team"]?.includes(filterState?.type) &&
      selectedOptionsUnit?.length === 0
    ) {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      ["Individual", "Team"]?.includes(filterState?.type) &&
      selectedOptionsTeam?.length === 0
    ) {
      setPopupContentMalert("Please Select Team!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      filterState?.type === "Individual" &&
      selectedOptionsEmployee?.length === 0
    ) {
      setPopupContentMalert("Please Select Employee!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      filterState?.type === "Department" &&
      selectedOptionsDepartment?.length === 0
    ) {
      setPopupContentMalert("Please Select Department!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };

  const sendRequest = async () => {
    setFilterLoader(true);
    setTableLoader(true);
    setPageName(!pageName);

    const queryParams = {
      page: Number(page),
      pageSize: Number(pageSize),
      searchQuery: searchQuery,
      assignbranch: accessbranch,
      aggregationPipeline: [
        {
          $match: {
            $and: [
              // Enquiry status filter
              {
                enquirystatus: {
                  $nin: ["Enquiry Purpose"],
                },
              },
              // Reasonable status filter
              {
                resonablestatus: {
                  $nin: [
                    "Not Joined",
                    "Postponed",
                    "Rejected",
                    "Closed",
                    "Releave Employee",
                    "Absconded",
                    "Hold",
                    "Terminate",
                  ],
                },
              },
              // Conditional company filter
              ...(valueCompanyCat.length > 0
                ? [
                  {
                    company: { $in: valueCompanyCat },
                  },
                ]
                : [
                  {
                    company: { $in: allAssignCompany },
                  },
                ]),
              // Conditional branch filter
              ...(valueBranchCat.length > 0
                ? [
                  {
                    branch: { $in: valueBranchCat },
                  },
                ]
                : [
                  {
                    branch: { $in: allAssignBranch },
                  },
                ]),
              // Conditional unit filter
              ...(valueUnitCat.length > 0
                ? [
                  {
                    unit: { $in: valueUnitCat },
                  },
                ]
                : [
                  {
                    unit: { $in: allAssignUnit },
                  },
                ]),
              // Conditional team filter
              ...(valueTeamCat.length > 0
                ? [
                  {
                    team: { $in: valueTeamCat },
                  },
                ]
                : []),
              // Conditional department filter
              ...(valueDepartmentCat.length > 0
                ? [
                  {
                    department: { $in: valueDepartmentCat },
                  },
                ]
                : []),
              // Conditional Employee filter
              ...(valueEmployeeCat.length > 0
                ? [
                  {
                    companyname: { $in: valueEmployeeCat },
                  },
                ]
                : []),
            ],
          },
        },
        //  {
        //    $project: {
        //      company: 1,
        //      branch: 1,
        //      unit: 1,
        //      team: 1,
        //      empcode: 1,
        //      companyname: 1,
        //      department: 1,
        //      designation: 1,
        //      role: 1,
        //      process: 1,
        //    },
        //  },
      ]
    };


    const allFilters = [
      ...additionalFilters,
      { column: selectedColumn, condition: selectedCondition, value: filterValue }
    ];

    if (allFilters.length > 0 && selectedColumn !== "") {
      queryParams.allFilters = allFilters
      queryParams.logicOperator = logicOperator;
    } else if (searchQuery) {
      queryParams.searchQuery = searchQuery;
    }


    try {
      // let response = await axios.post(
      //   SERVICE.DYNAMICUSER_CONTROLLER,
      //   {
      //     aggregationPipeline,
      //   },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${auth.APIToken}`,
      //     },
      //   }
      // );
      let response = await axios.post(SERVICE.DYNAMICUSER_CONTROLLER_SORT, queryParams, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const ans = response?.data?.result?.length > 0 ? response?.data?.result : []
      const itemsWithSerialNumber = ans?.map((item, index) => ({
        ...item,
        serialNumber: (page - 1) * pageSize + index + 1,
        wfhcount: item.wfhcount && item.wfhcount !== "0" ? item.wfhcount : "0",
        wfhstatus: item.wfhstatus && item.wfhstatus !== "Yes" ? item.wfhstatus : "Yes",
        // serialNumber: index + 1,
      }));

      setEmployeeSystemAllots(itemsWithSerialNumber);
      setOverallFilterdataAllData(response?.data?.totalProjectsAllData?.length > 0 ? response?.data?.totalProjectsAllData?.map((item, index) => ({
        ...item,
        serialNumber: index + 1
      })) : []);
      setTotalProjects(ans?.length > 0 ? response?.data?.totalProjects : 0);
      setTotalPages(ans?.length > 0 ? response?.data?.totalPages : 0);
      setPageSize((data) => { return ans?.length > 0 ? data : 10 });
      setPage((data) => { return ans?.length > 0 ? data : 1 });

      setFilterLoader(false);
      setTableLoader(false);
    } catch (err) {
      setFilterLoader(true);
      setTableLoader(true);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  //auto select all dropdowns
  const [allAssignCompany, setAllAssignCompany] = useState([]);
  const [allAssignBranch, setAllAssignBranch] = useState([]);
  const [allAssignUnit, setAllAssignUnit] = useState([]);
  const handleAutoSelect = async () => {
    setPageName(!pageName);
    try {
      let selectedValues = accessbranch
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

      let mappedemployees = allUsersData
        ?.filter(
          (u) =>
            selectedCompany?.includes(u.company) &&
            selectedBranch?.includes(u.branch) &&
            selectedUnit?.includes(u.unit) &&
            selectedTeam?.includes(u.team)
          //  &&
          //  u.workmode !== "Internship"
        )
        .map((u) => ({
          label: u.companyname,
          value: u.companyname,
        }));

      let employees = allUsersData
        ?.filter(
          (u) =>
            selectedCompany?.includes(u.company) &&
            selectedBranch?.includes(u.branch) &&
            selectedUnit?.includes(u.unit) &&
            selectedTeam?.includes(u.team)
          //  &&
          //  u.workmode !== "Internship"
        )
        .map((u) => u.companyname);
      setValueTeamCat(selectedTeam);
      setSelectedOptionsTeam(mappedTeam);
      setAllAssignCompany(selectedCompany);

      setAllAssignBranch(selectedBranch);

      setAllAssignUnit(selectedUnit);

      setValueEmployeeCat(employees);
      setSelectedOptionsEmployee(mappedemployees);
      setValueEmp(mappedemployees?.map((item) => item?.value));

    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  useEffect(() => {
    handleAutoSelect();
  }, [isAssignBranch]);

  //FILTER END

  return (
    <Box>
      <Headtitle title={"EMPLOYEE SYSTEM ALLOT DETAILS"} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>Employee System Allot Details</Typography>

      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lemployeesystemallotdetails") && (
        <>
          <Box sx={userStyle.dialogbox}>

            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                <b>Employee System Allot Details</b>
              </Typography>
              <NotificationContainer />
            </Grid>
            <br />

            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Type<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    options={TypeOptions}
                    styles={colourStyles}
                    value={{
                      label: filterState.type ?? "Please Select Type",
                      value: filterState.type ?? "Please Select Type",
                    }}
                    onChange={(e) => {
                      setFilterState((prev) => ({
                        ...prev,
                        type: e.value,
                      }));
                      setValueCompanyCat([]);
                      setSelectedOptionsCompany([]);
                      setValueBranchCat([]);
                      setSelectedOptionsBranch([]);
                      setValueUnitCat([]);
                      setSelectedOptionsUnit([]);
                      setValueTeamCat([]);
                      setSelectedOptionsTeam([]);
                      setValueDepartmentCat([]);
                      setSelectedOptionsDepartment([]);
                      setValueEmployeeCat([]);
                      setSelectedOptionsEmployee([]);
                      setValueEmp([]);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <Typography>
                  Company<b style={{ color: "red" }}>*</b>
                </Typography>
                <FormControl size="small" fullWidth>
                  <MultiSelect
                    options={accessbranch
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
                    }}
                    valueRenderer={customValueRendererCompany}
                    labelledBy="Please Select Company"
                  />
                </FormControl>
              </Grid>

              {/* <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Employee Status<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={EmployeeStatusOptions}
                        styles={colourStyles}
                        value={{
                          label:
                            filterState.employeestatus ??
                            "Please Select Employee Status",
                          value:
                            filterState.employeestatus ??
                            "Please Select Employee Status",
                        }}
                        onChange={(e) => {
                          setFilterState((prev) => ({
                            ...prev,
                            employeestatus: e.value,
                          }));
                          setValueBranchCat([]);
                          setSelectedOptionsBranch([]);
                          setValueUnitCat([]);
                          setSelectedOptionsUnit([]);
                          setValueTeamCat([]);
                          setSelectedOptionsTeam([]);
                          setValueDepartmentCat([]);
                          setSelectedOptionsDepartment([]);
                          setValueEmployeeCat([]);
                          setSelectedOptionsEmployee([]);
                        }}
                      />
                    </FormControl>
                  </Grid> */}

              {["Individual", "Team"]?.includes(filterState.type) ? (
                <>
                  {/* Branch Unit Team */}
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        {" "}
                        Branch <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={accessbranch
                          ?.filter((comp) =>
                            valueCompanyCat?.includes(comp.company)
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
                        value={selectedOptionsBranch}
                        onChange={(e) => {
                          handleBranchChange(e);
                        }}
                        valueRenderer={customValueRendererBranch}
                        labelledBy="Please Select Branch"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        {" "}
                        Unit<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={accessbranch
                          ?.filter(
                            (comp) =>
                              valueCompanyCat?.includes(comp.company) &&
                              valueBranchCat?.includes(comp.branch)
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
                        options={allTeam
                          ?.filter(
                            (u) =>
                              valueCompanyCat?.includes(u.company) &&
                              valueBranchCat?.includes(u.branch) &&
                              valueUnitCat?.includes(u.unit)
                          )
                          .map((u) => ({
                            ...u,
                            label: u.teamname,
                            value: u.teamname,
                          }))}
                        value={selectedOptionsTeam}
                        onChange={(e) => {
                          handleTeamChange(e);
                        }}
                        valueRenderer={customValueRendererTeam}
                        labelledBy="Please Select Team"
                      />
                    </FormControl>
                  </Grid>
                </>
              ) : ["Department"]?.includes(filterState.type) ? (
                <>
                  {/* Department */}
                  <Grid item md={3} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Department<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={departmentOptions}
                        value={selectedOptionsDepartment}
                        onChange={(e) => {
                          handleDepartmentChange(e);
                        }}
                        valueRenderer={customValueRendererDepartment}
                        labelledBy="Please Select Department"
                      />
                    </FormControl>
                  </Grid>
                </>
              ) : ["Branch"]?.includes(filterState.type) ? (
                <>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        {" "}
                        Branch <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={accessbranch
                          ?.filter((comp) =>
                            valueCompanyCat?.includes(comp.company)
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
                        value={selectedOptionsBranch}
                        onChange={(e) => {
                          handleBranchChange(e);
                        }}
                        valueRenderer={customValueRendererBranch}
                        labelledBy="Please Select Branch"
                      />
                    </FormControl>
                  </Grid>
                </>
              ) : ["Unit"]?.includes(filterState.type) ? (
                <>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        {" "}
                        Branch<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={accessbranch
                          ?.filter((comp) =>
                            valueCompanyCat?.includes(comp.company)
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
                        value={selectedOptionsBranch}
                        onChange={(e) => {
                          handleBranchChange(e);
                        }}
                        valueRenderer={customValueRendererBranch}
                        labelledBy="Please Select Branch"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        {" "}
                        Unit <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={accessbranch
                          ?.filter(
                            (comp) =>
                              valueCompanyCat?.includes(comp.company) &&
                              valueBranchCat?.includes(comp.branch)
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
                        value={selectedOptionsUnit}
                        onChange={(e) => {
                          handleUnitChange(e);
                        }}
                        valueRenderer={customValueRendererUnit}
                        labelledBy="Please Select Unit"
                      />
                    </FormControl>
                  </Grid>
                </>
              ) : (
                ""
              )}
              {["Individual"]?.includes(filterState.type) && (
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Employee<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <div
                      onPaste={handlePasteForEmp}
                      style={{ position: 'relative' }}
                    >
                      <MultiSelect
                        options={allUsersData
                          ?.filter(
                            (u) =>
                              valueCompanyCat?.includes(u.company) &&
                              valueBranchCat?.includes(u.branch) &&
                              valueUnitCat?.includes(u.unit) &&
                              valueTeamCat?.includes(u.team)

                          )
                          .map((u) => ({
                            label: u.companyname,
                            value: u.companyname,
                          }))}
                        value={selectedOptionsEmployee}
                        onChange={(e) => {
                          handleEmployeeChange(e);
                        }}
                        valueRenderer={customValueRendererEmployee}
                        labelledBy="Please Select Employee"
                        // Add these props if your MultiSelect supports them
                        inputValue={searchInputValue} // Add this state if needed
                        onInputChange={(newValue) => setSearchInputValue(newValue)}
                      />
                    </div>
                  </FormControl>
                </Grid>
              )}
              {["Individual"]?.includes(filterState.type) &&
                <Grid item md={6} sm={12} xs={12} sx={{ display: "flex", flexDirection: "row" }}>
                  <FormControl fullWidth size="small">
                    <Typography>Selected Employees</Typography>
                    <div
                      id="paste-box" // Add an ID to the Box
                      tabIndex={0} // Make the div focusable
                      style={{
                        border: '1px solid #ccc',
                        borderRadius: '3.75px',
                        height: '110px',
                        overflow: 'auto',
                      }}
                      onPaste={handlePasteForEmp}
                      onFocus={() => setIsBoxFocused(true)} // Set focus state to true
                      onBlur={(e) => {
                        if (isBoxFocused) {
                          e.target.focus(); // Refocus only if the Box was previously focused
                        }
                      }}
                    >
                      {valueEmp.map((value) => (
                        <Chip
                          key={value}
                          label={value}
                          clickable
                          sx={{ margin: 0.2, backgroundColor: "#FFF" }}
                          onDelete={(e) => handleDelete(e, value)}
                          onClick={() => console.log("clicked chip")}
                        />
                      ))}
                    </div>
                  </FormControl>
                </Grid>
              }
              <Grid item md={3} xs={12} sm={6} mt={3}>
                <div style={{ display: "flex", gap: "20px" }}>
                  <LoadingButton
                    variant="contained"
                    color="primary"
                    onClick={handleFilter}
                    loading={filterLoader}
                    sx={buttonStyles.buttonsubmit}
                  >
                    Filter
                  </LoadingButton>

                  <Button
                    sx={buttonStyles.btncancel}
                    onClick={handleClearFilter}
                  >
                    Clear
                  </Button>
                </div>
              </Grid>
            </Grid>

          </Box>
          <br />
          {tableLoader ? (
            <>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
              </Box>
            </>
          ) : (
            <>
              <Box sx={userStyle.container}>
                <Grid container sx={{ justifyContent: "center" }}>
                  <Grid>
                    {isUserRoleCompare?.includes("excelemployeesystemallotdetails") && (
                      <>
                        <Button onClick={(e) => {
                          setIsFilterOpen(true)
                          fetchEmployeeSystemArray()
                          setFormat("xl")
                        }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("csvemployeesystemallotdetails") && (
                      <>
                        <Button onClick={(e) => {
                          setIsFilterOpen(true)
                          fetchEmployeeSystemArray()
                          setFormat("csv")
                        }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("printemployeesystemallotdetails") && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("pdfemployeesystemallotdetails") && (
                      <>
                        <Button sx={userStyle.buttongrp}
                          onClick={() => {
                            setIsPdfFilterOpen(true)
                            fetchEmployeeSystemArray()
                          }}
                        >
                          <FaFilePdf />
                          &ensp;Export to PDF&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("imageemployeesystemallotdetails") && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                          {" "}
                          <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                        </Button>
                      </>
                    )}
                  </Grid>
                </Grid>
                <br />
                {/* added to the pagination grid */}
                <Grid style={userStyle.dataTablestyle}>
                  <Box>
                    <label htmlFor="pageSizeSelect">Show entries:</label>
                    <Select id="pageSizeSelect" value={pageSize} onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={5}>5</MenuItem>
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={25}>25</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                      <MenuItem value={100}>100</MenuItem>
                      <MenuItem value={employeesystemallots.length}>All</MenuItem>
                    </Select>
                  </Box>
                  <Box>
                    {/* <AggregatedSearchBar
                      columnDataTable={columnDataTable}
                      setItems={setItems}
                      addSerialNumber={addSerialNumber}
                      setPage={setPage}
                      maindatas={filteredData}
                      setSearchedString={setSearchedString}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      paginated={false}
                      totalDatas={filteredData}
                    /> */}
                    <FormControl fullWidth size="small">
                      <OutlinedInput size="small"
                        id="outlined-adornment-weight"
                        startAdornment={
                          <InputAdornment position="start">
                            <FaSearch />
                          </InputAdornment>
                        }
                        endAdornment={
                          <InputAdornment position="end">
                            {advancedFilter && (
                              <IconButton onClick={handleResetSearch}>
                                <MdClose />
                              </IconButton>
                            )}
                            <Tooltip title="Show search options">
                              <span>
                                <IoMdOptions style={{ cursor: 'pointer', }} onClick={handleClickSearch} />
                              </span>
                            </Tooltip>
                          </InputAdornment>}
                        aria-describedby="outlined-weight-helper-text"
                        inputProps={{ 'aria-label': 'weight', }}
                        type="text"
                        value={getSearchDisplay()}
                        onChange={handleSearchChange}
                        placeholder="Type to search..."
                        disabled={!!advancedFilter}
                      />
                    </FormControl>
                  </Box>
                </Grid>
                <br />
                <br />
                <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                  Show All Columns
                </Button>
                &ensp;
                <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
                  Manage Columns
                </Button>
                &ensp;
                <br />
                {/* ****** Table Grid Container ****** */}
                <Grid container>
                  <Grid md={4} sm={2} xs={1}></Grid>
                  <Grid md={8} sm={10} xs={10} sx={{ align: "center" }}></Grid>
                </Grid>
                <br />

                {/* ****** Table start ****** */}

                {/* {isLoader ? ( */}
                {/* <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable">
                    <TableHead sx={{ fontWeight: "600" }}>
                      <StyledTableRow>
                        <StyledTableCell onClick={() => handleSorting("serialNumber")}>
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>SNo</Box>
                            <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("serialNumber")}</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting("empcode")}>
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Emp Code</Box>
                            <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("empcode")}</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting("companyname")}>
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Employee Name</Box>
                            <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("companyname")}</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting("department")}>
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Department</Box>
                            <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("department")}</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting("branch")}>
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Branch</Box>
                            <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("branch")}</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting("unit")}>
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Unit</Box>
                            <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("unit")}</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting("team")}>
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Team</Box>
                            <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("team")}</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting("designation")}>
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Designation</Box>
                            <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("designation")}</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting("wfhcount")}>
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>WFH Count</Box>
                            <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("wfhcount")}</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting("wfhstatus")}>
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Status</Box>
                            <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("wfhstatus")}</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting("employeecount")}>
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Count</Box>
                            <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("employeecount")}</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting("smode")}>
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>System Mode</Box>
                            <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("smode")}</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting("systemmode")}>
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Mode</Box>
                            <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("systemmode")}</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell>Action</StyledTableCell>
                      </StyledTableRow>
                    </TableHead>
                    <TableBody align="left" ref={gridRef}>
                      {filteredData?.length > 0 ? (
                        filteredData?.map((row, index) => (
                          <StyledTableRow key={index}>
                            <StyledTableCell>{row.serialNumber}</StyledTableCell>
                            <StyledTableCell>
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
                                    handleCopy("Copied Empcode!");
                                  }}
                                  options={{ message: "Copied Empcode!" }}
                                  text={row?.empcode}
                                >
                                  <ListItemText primary={row?.empcode} />
                                </CopyToClipboard>
                              </ListItem>
                            </StyledTableCell>
                            <StyledTableCell>
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
                                    handleCopy("Copied Employee Name!");
                                  }}
                                  options={{ message: "Copied Employee Name!" }}
                                  text={row?.companyname}
                                >
                                  <ListItemText primary={row?.companyname} />
                                </CopyToClipboard>
                              </ListItem>
                            </StyledTableCell>
                            <StyledTableCell>{row.department}</StyledTableCell>
                            <StyledTableCell>{row.branch}</StyledTableCell>
                            <StyledTableCell>{row.unit}</StyledTableCell>
                            <StyledTableCell>{row.team}</StyledTableCell>
                            <StyledTableCell>{row.designation}</StyledTableCell>
                            <StyledTableCell>
                              <Grid item md={3} xs={12} sm={12}>
                                <FormControl size="small" fullWidth>
                                  <OutlinedInput
                                    id="component-outlined"
                                    type="number"
                                    sx={userStyle.input}
                                    value={row.wfhcount}
                                    disabled={row.wfhstatus === "No"}
                                    onChange={(e) => {
                                      EmployeeCodeWfh(row._id, "wfhcount", e.target.value);
                                      // EmployeeCodeFunc(row._id, "employeecount", row.workstation.length > 0 ? (row.workstation.length < e.target.value ? "" : e.target.value) : e.target.value);
                                      // setEmpcount(row.workstation.length < e.target.value ? "" : e.target.value);
                                      setwfhcount(e.target.value);
                                      setwfhstatus(row?.wfhstatus);
                                      setSmodes(row.systemmode)

                                    }}
                                  />
                                </FormControl>
                              </Grid>{" "}</StyledTableCell>
                            <StyledTableCell> <Grid item md={3} xs={12} sm={12}>
                              <FormControl size="small" fullWidth>
                                <Select
                                  labelId="demo-select-small"
                                  id="demo-select-small"
                                  MenuProps={{
                                    PaperProps: {
                                      style: {
                                        maxHeight: 200,
                                        width: 80,
                                      },
                                    },
                                  }}
                                  value={row.wfhstatus}
                                  onChange={(e) => {
                                    EmployeeSyetemwfhstatus(row._id, "wfhstatus", e.target.value);
                                    setwfhstatus(e.target.value);
                                    setwfhcount(row.wfhcount);
                                    setSmodes(row.systemmode)


                                  }}
                                  // displayEmpty
                                  defaultValue="Yes" // Set the default value to "Active"
                                  inputProps={{ "aria-label": "Without label" }}
                                >
                                  <MenuItem value="Yes"> {"Yes"} </MenuItem>
                                  <MenuItem value="No"> {"No"} </MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>{" "}</StyledTableCell>
                            <StyledTableCell>
                              <Grid item md={3} xs={12} sm={12}>
                                <FormControl size="small" fullWidth>
                                  <OutlinedInput
                                    id="component-outlined"
                                    type="number"
                                    sx={userStyle.input}
                                    value={row.employeecount}
                                    onChange={(e) => {
                                      EmployeeCodeFunc(row._id, "employeecount", e.target.value);
                                      // EmployeeCodeFunc(row._id, "employeecount", row.workstation.length > 0 ? (row.workstation.length < e.target.value ? "" : e.target.value) : e.target.value);
                                      // setEmpcount(row.workstation.length < e.target.value ? "" : e.target.value);
                                      setEmpcount(e.target.value);
                                      setwfhcount(row.wfhcount);
                                      setwfhstatus(row?.wfhstatus);
                                      setSmodes(row.systemmode)
                                    }}
                                  />
                                </FormControl>
                              </Grid>{" "}</StyledTableCell>
                            <StyledTableCell> <Grid item md={3} xs={12} sm={12}>
                              <FormControl size="small" fullWidth>
                                <Select
                                  labelId="demo-select-small"
                                  id="demo-select-small"
                                  MenuProps={{
                                    PaperProps: {
                                      style: {
                                        maxHeight: 200,
                                        width: 80,
                                      },
                                    },
                                  }}
                                  value={row.systemmode}
                                  onChange={(e) => {
                                    EmployeeSyetemmodeFunc(row._id, "systemmode", e.target.value);
                                    setSmodes(e.target.value);
                                    setwfhcount(row.wfhcount);
                                    setwfhstatus(row?.wfhstatus);

                                  }}
                                  // displayEmpty
                                  defaultValue="Active" // Set the default value to "Active"
                                  inputProps={{ "aria-label": "Without label" }}
                                >
                                  <MenuItem value="In Active"> {"In Active"} </MenuItem>
                                  <MenuItem value="Active"> {"Active"} </MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>{" "}</StyledTableCell>
                            <StyledTableCell>{row.systemmode}</StyledTableCell>
                            <StyledTableCell>
                              <Grid sx={{ display: "flex" }}>
                                {(isUserRoleCompare?.includes("eemployeesystemallotdetails") && (empcount != "" || modes) && openIndex === row._id) || openIndexwfh === row?._id ? (
                                  <Button variant="contained" sx={{ height: "34px", ...buttonStyles.buttonsubmit }} onClick={(e) => sendRequestIndex(row._id, row.employeecount, row._id, row.loginUserStatus)}>
                                    SAVE
                                  </Button>
                                ) : null}
                              </Grid></StyledTableCell>

                          </StyledTableRow>
                        ))
                      ) : (
                        <StyledTableRow>
                          {" "}
                          <StyledTableCell colSpan={7} align="center">
                            No Data Available
                          </StyledTableCell>{" "}
                        </StyledTableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box style={userStyle.dataTablestyle}>
                  <Box>
                    Showing {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filteredDatas.length)} of {filteredDatas.length} entries
                  </Box>
                  <Box>
                    <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                      <FirstPageIcon />
                    </Button>
                    <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                      <NavigateBeforeIcon />
                    </Button>
                    {pageNumbers?.map((pageNumber) => (
                      <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={page === pageNumber ? "active" : ""} disabled={page === pageNumber}>
                        {pageNumber}
                      </Button>
                    ))}
                    {lastVisiblePage < totalPages && <span>...</span>}
                    <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                      <NavigateNextIcon />
                    </Button>
                    <Button onClick={() => setPage(totalPages)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                      <LastPageIcon />
                    </Button>
                  </Box>
                </Box> */}
                <AggridTableForPaginationTable
                  rowDataTable={rowDataTable}
                  columnDataTable={columnDataTable}
                  columnVisibility={columnVisibility}
                  page={page}
                  setPage={setPage}
                  pageSize={pageSize}
                  totalPages={totalPages}
                  setColumnVisibility={setColumnVisibility}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                  gridRefTable={gridRefTable}
                  totalDatas={totalProjects}
                  setFilteredRowData={setFilteredRowData}
                  filteredRowData={filteredRowData}
                  gridRefTableImg={gridRefTableImg}
                  itemsList={overallFilterdataAllData}
                />
                <Popover
                  id={idSearch}
                  open={openSearch}
                  anchorEl={anchorElSearch}
                  onClose={handleCloseSearch}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
                >
                  <Box style={{ padding: "10px", maxWidth: '450px' }}>
                    <Typography variant="h6">Advance Search</Typography>
                    <IconButton
                      aria-label="close"
                      onClick={handleCloseSearch}
                      sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                    <DialogContent sx={{ width: "100%" }}>
                      <Box sx={{
                        width: '350px',
                        maxHeight: '400px',
                        overflow: 'hidden',
                        position: 'relative'
                      }}>
                        <Box sx={{
                          maxHeight: '300px',
                          overflowY: 'auto',
                          // paddingRight: '5px'
                        }}>
                          <Grid container spacing={1}>
                            <Grid item md={12} sm={12} xs={12}>
                              <Typography>Columns</Typography>
                              <Select fullWidth size="small"
                                MenuProps={{
                                  PaperProps: {
                                    style: {
                                      maxHeight: 200,
                                      width: "auto",
                                    },
                                  },
                                }}
                                style={{ minWidth: 150 }}
                                value={selectedColumn}
                                onChange={(e) => setSelectedColumn(e.target.value)}
                                displayEmpty
                              >
                                <MenuItem value="" disabled>Select Column</MenuItem>
                                {filteredSelectedColumn.map((col) => (
                                  <MenuItem key={col.field} value={col.field}>
                                    {col.headerName}
                                  </MenuItem>
                                ))}
                              </Select>
                            </Grid>
                            <Grid item md={12} sm={12} xs={12}>
                              <Typography>Operator</Typography>
                              <Select fullWidth size="small"
                                MenuProps={{
                                  PaperProps: {
                                    style: {
                                      maxHeight: 200,
                                      width: "auto",
                                    },
                                  },
                                }}
                                style={{ minWidth: 150 }}
                                value={selectedCondition}
                                onChange={(e) => setSelectedCondition(e.target.value)}
                                disabled={!selectedColumn}
                              >
                                {conditions.map((condition) => (
                                  <MenuItem key={condition} value={condition}>
                                    {condition}
                                  </MenuItem>
                                ))}
                              </Select>
                            </Grid>
                            <Grid item md={12} sm={12} xs={12}>
                              <Typography>Value</Typography>
                              <TextField fullWidth size="small"
                                value={["Blank", "Not Blank"].includes(selectedCondition) ? "" : filterValue}
                                onChange={(e) => setFilterValue(e.target.value)}
                                disabled={["Blank", "Not Blank"].includes(selectedCondition)}
                                placeholder={["Blank", "Not Blank"].includes(selectedCondition) ? "Disabled" : "Enter value"}
                                sx={{
                                  '& .MuiOutlinedInput-root.Mui-disabled': {
                                    backgroundColor: 'rgb(0 0 0 / 26%)',
                                  },
                                  '& .MuiOutlinedInput-input.Mui-disabled': {
                                    cursor: 'not-allowed',
                                  },
                                }}
                              />
                            </Grid>
                            {additionalFilters.length > 0 && (
                              <>
                                <Grid item md={12} sm={12} xs={12}>
                                  <RadioGroup
                                    row
                                    value={logicOperator}
                                    onChange={(e) => setLogicOperator(e.target.value)}
                                  >
                                    <FormControlLabel value="AND" control={<Radio />} label="AND" />
                                    <FormControlLabel value="OR" control={<Radio />} label="OR" />
                                  </RadioGroup>
                                </Grid>
                              </>
                            )}
                            {additionalFilters.length === 0 && (
                              <Grid item md={4} sm={12} xs={12} >
                                <Button variant="contained" onClick={handleAddFilter} sx={{ textTransform: "capitalize" }} disabled={["Blank", "Not Blank"].includes(selectedCondition) ? false : !filterValue || selectedColumn.length === 0}>
                                  Add Filter
                                </Button>
                              </Grid>
                            )}

                            <Grid item md={2} sm={12} xs={12}>
                              <Button variant="contained" onClick={() => {
                                fetchEmployee();
                                setIsSearchActive(true);
                                setAdvancedFilter([
                                  ...additionalFilters,
                                  { column: selectedColumn, condition: selectedCondition, value: filterValue }
                                ])
                              }} sx={{ textTransform: "capitalize" }} disabled={["Blank", "Not Blank"].includes(selectedCondition) ? false : !filterValue || selectedColumn.length === 0}>
                                Search
                              </Button>
                            </Grid>
                          </Grid>
                        </Box>
                      </Box>
                    </DialogContent>
                  </Box>
                </Popover>
                {/* <AggridTable
                  rowDataTable={rowDataTable}
                  columnDataTable={columnDataTable}
                  columnVisibility={columnVisibility}
                  page={page}
                  setPage={setPage}
                  pageSize={pageSize}
                  totalPages={totalPages}
                  setColumnVisibility={setColumnVisibility}
                  isHandleChange={isHandleChange}
                  items={items}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                  gridRefTable={gridRefTable}
                  paginated={false}
                  filteredDatas={filteredDatas}
                  // totalDatas={totalProjects}
                  searchQuery={searchQuery}
                  handleShowAllColumns={handleShowAllColumns}
                  setFilteredRowData={setFilteredRowData}
                  filteredRowData={filteredRowData}
                  setFilteredChanges={setFilteredChanges}
                  filteredChanges={filteredChanges}
                  gridRefTableImg={gridRefTableImg}
                  itemsList={filteredData}
                  rowHeight={80}
                /> */}
                {/* ) : ( */}
                {/* <>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                </Box>
                            </> */}
                {/* )} */}
              </Box>
            </>
          )}

        </>
      )}
      <br />

      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      // maxWidth="lg"
      >
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> View Employee System Allot Details</Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Name</Typography>
                  <Typography>{employeesystemallotEdit.department}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button variant="contained" color="primary" onClick={handleCloseview}>
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpenpop} onClose={handleCloseerrpop} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <Typography variant="h6">{showAlertpop}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              style={{ padding: "7px 13px", color: "white", background: "rgb(25, 118, 210)" }}
              sx={buttonStyles.buttonsubmit}
              onClick={() => {
                // sendEditRequest();
                handleCloseerrpop();
              }}
            >
              ok
            </Button>
            <Button
              style={{
                backgroundColor: "#f4f4f4",
                color: "#444",
                boxShadow: "none",
                borderRadius: "3px",
                padding: "7px 13px",
                border: "1px solid #0000006b",
                "&:hover": {
                  "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                    backgroundColor: "#f4f4f4",
                  },
                },
              }}
              sx={buttonStyles.btncancel}
              onClick={handleCloseerrpop}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>


      <Box>
        {/* ALERT DIALOG */}
        <Dialog open={isDeleteOpenalert} onClose={handleCloseModalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: "orange" }} />
            <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
              Please Select any Row
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button autoFocus variant="contained" color="error" onClick={handleCloseModalert} sx={buttonStyles.buttonsubmit}>
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      {/*Export XL Data  */}
      <Dialog open={isFilterOpen} onClose={handleCloseFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>

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

          {fileFormat === 'xl' ?
            <FaFileExcel style={{ fontSize: "70px", color: "green" }} />
            : <FaFileCsv style={{ fontSize: "70px", color: "green" }} />
          }
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Choose Export
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus variant="contained"
            onClick={(e) => {
              handleExportXL("filtered")
            }}
          >
            Export Filtered Data
          </Button>
          <Button autoFocus variant="contained"
            onClick={(e) => {
              handleExportXL("overall")
              fetchEmployeeSystemArray()
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
      {/*Export pdf Data  */}
      <Dialog open={isPdfFilterOpen} onClose={handleClosePdfFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
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
              downloadPdf("filtered")
              setIsPdfFilterOpen(false);
            }}
          >
            Export Filtered Data
          </Button>
          <Button variant="contained"
            onClick={(e) => {
              downloadPdf("overall")
              setIsPdfFilterOpen(false);
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>

      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleCloseerr} sx={buttonStyles.buttonsubmit}>
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
              <StyledTableCell>Emp Code</StyledTableCell>
              <StyledTableCell>Employee Name</StyledTableCell>
              <StyledTableCell>Department</StyledTableCell>
              <StyledTableCell>Branch</StyledTableCell>
              <StyledTableCell>Unit</StyledTableCell>
              <StyledTableCell>Team</StyledTableCell>
              <StyledTableCell>Designation</StyledTableCell>
              <StyledTableCell>WFH Count</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Count</StyledTableCell>
              <StyledTableCell>Mode</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {rowDataTable &&
              rowDataTable.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{row.empcode} </StyledTableCell>
                  <StyledTableCell>{row.companyname} </StyledTableCell>
                  <StyledTableCell>{row.department} </StyledTableCell>
                  <StyledTableCell>{row.branch} </StyledTableCell>
                  <StyledTableCell>{row.unit} </StyledTableCell>
                  <StyledTableCell> {row.team}</StyledTableCell>
                  <StyledTableCell> {row.designation}</StyledTableCell>
                  <StyledTableCell> {row.wfhcount}</StyledTableCell>
                  <StyledTableCell> {row.wfhstatus}</StyledTableCell>
                  <StyledTableCell> {row.employeecount}</StyledTableCell>
                  <StyledTableCell> {row.systemmode}</StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
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

      <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
        itemsTwo={overallFilterdataAllData ?? []}
        filename={"Employee System Allot"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />

    </Box>
  );
}

export default Employeeassetsystemallot;