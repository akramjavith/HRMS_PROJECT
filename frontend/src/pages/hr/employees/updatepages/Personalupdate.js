import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  Dialog,
  MenuItem,
  OutlinedInput,
  Checkbox,
  DialogContent,
  TableRow,
  TableCell,
  FormControl,
  DialogActions,
  Grid,
  Select,
  Paper,
  Table,
  TableHead,
  TableContainer,
  Button,
  TableBody,
  List,
  ListItem,
  ListItemText,
  Popover,
  TextField,
  IconButton,
  DialogTitle,
  LinearProgress,
} from "@mui/material";
import { userStyle } from "../../../../pageStyle";
import { handleApiError } from "../../../../components/Errorhandling";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../../components/Table";
import FormControlLabel from "@mui/material/FormControlLabel";
import EditIcon from "@mui/icons-material/Edit";
import { SERVICE } from "../../../../services/Baseservice";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Selects from "react-select";
import { MultiSelect } from "react-multi-select-component";
import Headtitle from "../../../../components/Headtitle";
import PageHeading from "../../../../components/PageHeading";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import moment from "moment-timezone";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Country, State, City } from "country-state-city";
import { AuthContext } from "../../../../context/Appcontext";
import { UserRoleAccessContext } from "../../../../context/Appcontext";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import StyledDataGrid from "../../../../components/TableStyle";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";

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
import { CheckCircleOutlined } from "@mui/icons-material";

function Personalupdate() {
  const currentYear = new Date().getFullYear();
  const maxDate = `${currentYear - 16}-12-31`;

  function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  const LoadingDialog = ({ open, onClose, progress }) => {
    const dialogStyles = {
      padding: "24px",
      textAlign: "center",
    };

    const dialogTitleStyles = {
      fontWeight: "bold",
      fontSize: "1.5rem",
      color: "#3f51b5", // Primary color
    };

    const dialogContentStyles = {
      padding: "16px",
    };

    const progressStyles = {
      marginTop: "16px",
      height: "10px",
      borderRadius: "5px",
    };

    const progressTextStyles = {
      marginTop: "8px",
      fontWeight: "bold",
      color: "#4caf50", // Success color
    };

    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle style={dialogTitleStyles}>Updating...</DialogTitle>
        <DialogContent style={dialogContentStyles}>
          <Typography>
            Please wait while we update the employee names across all pages.
          </Typography>
          <LinearProgress
            style={progressStyles}
            variant="determinate"
            value={progress}
          />
          <Typography style={progressTextStyles}>{progress}%</Typography>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    );
  };

  //SELECT DROPDOWN STYLES
  const colourStyles = {
    menuList: (styles) => ({
      ...styles,
      background: "white",
    }),
    option: (styles, { isFocused, isSelected }) => ({
      ...styles,
      // color:'black',
      color: isFocused
        ? "rgb(255 255 255, 0.5)"
        : isSelected
        ? "white"
        : "black",
      background: isFocused
        ? "rgb(25 118 210, 0.7)"
        : isSelected
        ? "rgb(25 118 210, 0.5)"
        : null,
      zIndex: 1,
    }),
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
  };

  const [empaddform, setEmpaddform] = useState({
    prefix: "",
    firstname: "",
    lastname: "",
    legalname: "",
    callingname: "",
    fathername: "",
    mothername: "",
    gender: "",
    dom: "",
    maritalstatus: "",
    dob: "",
    bloodgroup: "",
    pdoorno: "",
    pstreet: "",
    parea: "",
    plandmark: "",
    ptaluk: "",
    ppost: "",
    ppincode: "",
    pcountry: "",
    pstate: "",
    pcity: "",
    cdoorno: "",
    cstreet: "",
    carea: "",
    clandmark: "",
    ctaluk: "",
    cpost: "",
    cpincode: "",
    ccountry: "",
    cstate: "",
    ccity: "",
    empcode: "",
    nothing: "",
  });

  // Country city state datas
  const [selectedCountryp, setSelectedCountryp] = useState({
    label: "India",
    name: "India",
  });
  const [selectedStatep, setSelectedStatep] = useState({
    label: "Tamil Nadu",
    name: "Tamil Nadu",
  });
  const [selectedCityp, setSelectedCityp] = useState({
    label: "Tiruchirapalli",
    name: "Tiruchirapalli",
  });

  const [selectedCountryc, setSelectedCountryc] = useState({
    label: "India",
    name: "India",
  });
  const [selectedStatec, setSelectedStatec] = useState({
    label: "Tamil Nadu",
    name: "Tamil Nadu",
  });
  const [selectedCityc, setSelectedCityc] = useState({
    label: "Tiruchirapalli",
    name: "Tiruchirapalli",
  });

  const [getrowid, setRowGetid] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [employees, setEmployees] = useState([]);
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");

  const {
    isUserRoleCompare,
    isUserRoleAccess,
    allTeam,
    isAssignBranch,
    pageName,
    setPageName,
  } = useContext(UserRoleAccessContext);
  // const [username, setUsername] = useState("");
  const { auth, setAuth } = useContext(AuthContext);
  const username = isUserRoleAccess.username;

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [personalcheck, setpersonalcheck] = useState(false);

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "PersonalInformationUpdate.png");
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

  // Copied fields Name
  const handleCopy = (message) => {
    NotificationManager.success(`${message} 👍`, "", 2000);
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
    companyname: true,
    empcode: true,
    company: true,
    branch: true,
    unit: true,
    team: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  // Edit model
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
  };

  const [oldNames, setOldNames] = useState({
    firstname: "",
    lastname: "",
    companyname: "",
    employeecode: "",
  });

  const [companycaps, setcompanycaps] = useState("");

  const getCode = async (e) => {
    setPageName(!pageName);
    try {
      let response = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const savedEmployee = response?.data?.suser;

      setEmpaddform({
        ...savedEmployee,
        callingname: savedEmployee?.callingname ?? savedEmployee?.legalname,
        age: calculateAge(savedEmployee?.dob),
        panstatus: savedEmployee?.panno
          ? "Have PAN"
          : savedEmployee?.panrefno
          ? "Applied"
          : "Yet to Apply",
      });

      setOldNames({
        firstname: savedEmployee?.firstname,
        lastname: savedEmployee?.lastname,
        companyname: savedEmployee?.companyname,
        employeecode: savedEmployee?.empcode,
      });
      setcompanycaps(savedEmployee?.companyname);

      // Find the corresponding Country, State, and City objects
      const country = Country.getAllCountries().find(
        (country) => country.name === savedEmployee.ccountry
      );
      const state = State.getStatesOfCountry(country?.isoCode).find(
        (state) => state.name === savedEmployee.cstate
      );
      const city = City.getCitiesOfState(
        state?.countryCode,
        state?.isoCode
      ).find((city) => city.name === savedEmployee.ccity);

      // Find the corresponding Country, State, and City objects
      const countryp = Country.getAllCountries().find(
        (country) => country.name === savedEmployee.pcountry
      );
      const statep = State.getStatesOfCountry(country?.isoCode).find(
        (state) => state.name === savedEmployee.pstate
      );
      const cityp = City.getCitiesOfState(
        state?.countryCode,
        state?.isoCode
      ).find((city) => city.name === savedEmployee.pcity);
      setSelectedCityc(city);
      setSelectedCountryc(country);
      setSelectedStatec(state);
      setSelectedCountryp(countryp);
      setSelectedStatep(statep);
      setSelectedCityp(cityp);

      setRowGetid(response?.data?.suser);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };

  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setEmpaddform(res?.data?.suser);
      setRowGetid(res?.data?.suser);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
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

  //personalupadate updateby edit page...
  let updateby = empaddform.updatedby;
  let addedby = empaddform.addedby;

  //EDIT POST CALL
  let logedit = getrowid._id;
  const [uploadProgress, setUploadProgress] = useState(0);
  const [openPopupUpload, setOpenPopupUpload] = useState(false);
  const sendRequestt = async () => {
    setPageName(!pageName);
    try {
      if (
        empaddform.firstname?.toLowerCase() !==
          oldNames?.firstname?.toLowerCase() ||
        empaddform.lastname?.toLowerCase() !== oldNames?.lastname?.toLowerCase()
      ) {
        setOpenPopupUpload(true);

        // State for tracking overall upload progress
        let totalLoaded = 0;
        let totalSize = 0;

        const handleUploadProgress = (progressEvent) => {
          if (progressEvent.event.lengthComputable) {
            console.log(
              `Progress Event - Loaded: ${progressEvent.loaded}, Total: ${progressEvent.total}`
            );
            updateTotalProgress(progressEvent.loaded, progressEvent.total);
          } else {
            console.log("Unable to compute progress information.");
          }
        };

        const updateTotalProgress = (loaded, size) => {
          totalLoaded += loaded;
          totalSize += size;
          if (totalSize > 0) {
            const percentCompleted = Math.round(
              (totalLoaded * 100) / totalSize
            );
            setUploadProgress(percentCompleted);
            console.log(`Total Upload Progress: ${percentCompleted}%`);
          } else {
            console.log("Total size is zero, unable to compute progress.");
          }
        };

        let companynamecheck = await axios.post(
          SERVICE.COMPANYNAME_DUPLICATECHECK_CREATE,
          {
            firstname: empaddform.firstname,
            lastname: empaddform.lastname,
            dob: empaddform.dob,
            employeename: `${empaddform.firstname?.toUpperCase()}.${empaddform.lastname?.toUpperCase()}`,
          },
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            onUploadProgress: handleUploadProgress,
          }
        );

        let newCompanyName = companynamecheck?.data?.uniqueCompanyName;

        setcompanycaps(newCompanyName);

        let res = await axios.put(
          `${SERVICE.USER_SINGLE_PWD}/${logedit}`,
          {
            prefix: String(empaddform.prefix ? empaddform.prefix : "Mr"),
            firstname: String(empaddform.firstname),
            lastname: String(empaddform.lastname),
            legalname: String(empaddform.legalname),
            callingname: String(empaddform.callingname),
            fathername: String(empaddform.fathername),
            mothername: String(empaddform.mothername),
            companyname: String(newCompanyName),
            gender: String(empaddform.gender),
            maritalstatus: String(empaddform.maritalstatus),
            dom: String(empaddform.dom),
            dob: String(empaddform.dob),
            bloodgroup: String(empaddform.bloodgroup),
            aadhar: String(empaddform.aadhar),
            panno: String(
              empaddform.panstatus === "Have PAN" ? empaddform.panno : ""
            ),
            panstatus: String(empaddform.panstatus),
            panrefno: String(
              empaddform.panstatus === "Applied" ? empaddform.panrefno : ""
            ),
            pdoorno: String(empaddform.pdoorno),
            pstreet: String(empaddform.pstreet),
            parea: String(empaddform.parea),
            plandmark: String(empaddform.plandmark),
            ptaluk: String(empaddform.ptaluk),
            ppost: String(empaddform.ppost),
            ppincode: String(empaddform.ppincode),
            pcountry: String(selectedCountryp.name),
            pstate: String(selectedStatep.name),
            pcity: String(selectedCityp.name),
            samesprmnt: Boolean(empaddform.samesprmnt),
            cdoorno: String(
              !empaddform.samesprmnt ? empaddform.cdoorno : empaddform.pdoorno
            ),
            cstreet: String(
              !empaddform.samesprmnt ? empaddform.cstreet : empaddform.pstreet
            ),
            carea: String(
              !empaddform.samesprmnt ? empaddform.carea : empaddform.parea
            ),
            clandmark: String(
              !empaddform.samesprmnt
                ? empaddform.clandmark
                : empaddform.plandmark
            ),
            ctaluk: String(
              !empaddform.samesprmnt ? empaddform.ctaluk : empaddform.ptaluk
            ),
            cpost: String(
              !empaddform.samesprmnt ? empaddform.cpost : empaddform.ppost
            ),
            cpincode: String(
              !empaddform.samesprmnt ? empaddform.cpincode : empaddform.ppincode
            ),
            ccountry: String(
              !empaddform.samesprmnt
                ? selectedCountryc.name
                : selectedCountryp.name
            ),
            cstate: String(
              !empaddform.samesprmnt ? selectedStatec.name : selectedStatep.name
            ),
            ccity: String(
              !empaddform.samesprmnt ? selectedCityc.name : selectedCityp.name
            ),
            updatedby: [
              ...updateby,
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
            onUploadProgress: handleUploadProgress,
          }
        );

        let updateOverAllEmployeeName = await axios.put(
          `${SERVICE.EMPLOYEENAMEOVERALLUPDATE}`,
          {
            oldname: oldNames?.companyname,
            newname: newCompanyName,
          },
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            onUploadProgress: handleUploadProgress,
          }
        );

        setOpenPopupUpload(false);
      } else if (
        empaddform.firstname?.toLowerCase() ===
          oldNames?.firstname?.toLowerCase() &&
        empaddform.lastname?.toLowerCase() === oldNames?.lastname?.toLowerCase()
      ) {
        setcompanycaps(oldNames.companyname);

        let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${logedit}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          prefix: String(empaddform.prefix ? empaddform.prefix : "Mr"),
          firstname: String(empaddform.firstname),
          lastname: String(empaddform.lastname),
          legalname: String(empaddform.legalname),
          callingname: String(empaddform.callingname),
          fathername: String(empaddform.fathername),
          mothername: String(empaddform.mothername),
          companyname: String(oldNames.companyname),
          gender: String(empaddform.gender),
          maritalstatus: String(empaddform.maritalstatus),
          dom: String(empaddform.dom),
          dob: String(empaddform.dob),
          bloodgroup: String(empaddform.bloodgroup),
          aadhar: String(empaddform.aadhar),
          panno: String(
            empaddform.panstatus === "Have PAN" ? empaddform.panno : ""
          ),
          panstatus: String(empaddform.panstatus),
          panrefno: String(
            empaddform.panstatus === "Applied" ? empaddform.panrefno : ""
          ),
          pdoorno: String(empaddform.pdoorno),
          pstreet: String(empaddform.pstreet),
          parea: String(empaddform.parea),
          plandmark: String(empaddform.plandmark),
          ptaluk: String(empaddform.ptaluk),
          ppost: String(empaddform.ppost),
          ppincode: String(empaddform.ppincode),
          pcountry: String(selectedCountryp.name),
          pstate: String(selectedStatep.name),
          pcity: String(selectedCityp.name),
          samesprmnt: Boolean(empaddform.samesprmnt),
          cdoorno: String(
            !empaddform.samesprmnt ? empaddform.cdoorno : empaddform.pdoorno
          ),
          cstreet: String(
            !empaddform.samesprmnt ? empaddform.cstreet : empaddform.pstreet
          ),
          carea: String(
            !empaddform.samesprmnt ? empaddform.carea : empaddform.parea
          ),
          clandmark: String(
            !empaddform.samesprmnt ? empaddform.clandmark : empaddform.plandmark
          ),
          ctaluk: String(
            !empaddform.samesprmnt ? empaddform.ctaluk : empaddform.ptaluk
          ),
          cpost: String(
            !empaddform.samesprmnt ? empaddform.cpost : empaddform.ppost
          ),
          cpincode: String(
            !empaddform.samesprmnt ? empaddform.cpincode : empaddform.ppincode
          ),
          ccountry: String(
            !empaddform.samesprmnt
              ? selectedCountryc.name
              : selectedCountryp.name
          ),
          cstate: String(
            !empaddform.samesprmnt ? selectedStatec.name : selectedStatep.name
          ),
          ccity: String(
            !empaddform.samesprmnt ? selectedCityc.name : selectedCityp.name
          ),
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        });
      }

      await fetchEmployee();
      setShowAlert(
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "green" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Updated Successfully
          </p>
        </>
      );
      handleClickOpenerr();

      handleCloseModEdit();
    } catch (err) {
      setOpenPopupUpload(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const editSubmit = (e) => {
    e.preventDefault();
    sendRequestt();
  };

  function AadharValidate(aadhar) {
    var adharcardTwelveDigit = /^\d{12}$/;
    var adharSixteenDigit = /^\d{16}$/;

    if (aadhar !== "") {
      if (
        aadhar.match(adharcardTwelveDigit) ||
        aadhar.match(adharSixteenDigit)
      ) {
        if (aadhar[0] !== "0" && aadhar[0] !== "1") {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  function PanValidate(pan) {
    let panregex = /^([A-Z]){5}([0-9]){4}([A-Z]){1}$/;
    if (pan !== "") {
      if (pan.match(panregex)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    if (empaddform.firstname === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please enter Name"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (empaddform.lastname === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Last Name"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (empaddform.lastname.length < 3) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Last Name must be 3 characters!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (empaddform.legalname === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Legal Name"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      empaddform.callingname === "" ||
      empaddform.callingname == undefined
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Calling Name"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      empaddform.callingname !== "" &&
      empaddform.legalname !== "" &&
      empaddform.callingname?.toLowerCase() ===
        empaddform.legalname?.toLowerCase()
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Legal Name and Calling Name can't be same"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      empaddform.maritalstatus === "Married" &&
      empaddform.dom === ""
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Date of Marriage"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (empaddform.dob === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Date of Birth"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (empaddform.aadhar === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Aadhar No"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (empaddform.aadhar !== "" && empaddform.aadhar?.length !== 12) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Aadhar No must be 12 digits required"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (empaddform.aadhar !== "" && !AadharValidate(empaddform.aadhar)) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter valid Aadhar Number"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (empaddform?.panno !== "" && empaddform?.panno?.length !== 10) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Pan No must be 10 digits required"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (empaddform?.panno !== "" && !PanValidate(empaddform?.panno)) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Valid PAN Number"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      empaddform?.panno === "" &&
      empaddform?.panstatus === "Have PAN"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Pan No"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      empaddform?.panrefno === "" &&
      empaddform?.panstatus === "Applied"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Application Reference No"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequestt();
    }
  };

  let printno = 1;

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
    setPageName(!pageName);
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
        Name: item.companyname || "",
        "Employee Code": item.empcode || "",
        Company: item.company || "",
        Branch: item.branch || "",
        Unit: item.unit || "",
        Team: item.team || "",
      };
    });
  };

  const handleExportXL = (isfilter) => {
    const dataToExport = isfilter === "filtered" ? filteredData : employees;

    if (!dataToExport || dataToExport.length === 0) {
      console.error("No data available to export");
      return;
    }

    exportToExcel(formatData(dataToExport), "PersonalInformationUpdate");
    setIsFilterOpen(false);
  };

  //  PDF
  // pdf.....
  const columns = [
    { title: "Name", field: "companyname" },
    { title: "Employee Code", field: "empcode" },
    { title: "Company", field: "company" },
    { title: "Branch", field: "branch" },
    { title: "Unit", field: "unit" },
    { title: "Team", field: "team" },
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

    doc.save("PersonalInformationUpdate.pdf");
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "PersonalInformationUpdate",
    pageStyle: "print",
  });

  //table entries ..,.
  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = employees?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
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

  const totalPages = Math.ceil(filteredDatas.length / pageSize);

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
            if (rowDataTable.length === 0) {
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
              updatedSelectedRows.length === filteredData.length
            );
          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 90,

      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 90,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "companyname",
      headerName: "Name",
      flex: 0,
      width: 150,
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
      field: "empcode",
      headerName: "Employee Code",
      flex: 0,
      width: 150,
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
                handleCopy("Copied Employee Code!");
              }}
              options={{ message: "Copied Employee Code!" }}
              text={params?.row?.empcode}
            >
              <ListItemText primary={params?.row?.empcode} />
            </CopyToClipboard>
          </ListItem>
        </Grid>
      ),
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 120,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 120,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 120,
      hide: !columnVisibility.unit,
      headerClassName: "bold-header",
    },
    {
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 120,
      hide: !columnVisibility.team,
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
        <>
          {isUserRoleCompare.includes("Manager") ? (
            <>
              <Grid container spacing={2}>
                <Grid item>
                  {isUserRoleCompare?.includes("ipersonalinfoupdate") && (
                    <>
                      <Button
                        sx={userStyle.buttonedit}
                        onClick={() => {
                          handleClickOpeninfo();
                          getinfoCode(params.row.id);
                        }}
                      >
                        <InfoOutlinedIcon style={{ fontsize: "large" }} />
                      </Button>
                    </>
                  )}
                </Grid>
              </Grid>
            </>
          ) : (
            <>
              <Grid sx={{ display: "flex" }}>
                {isUserRoleCompare?.includes("epersonalinfoupdate") && (
                  <Button
                    sx={userStyle.buttonedit}
                    onClick={() => {
                      handleClickOpenEdit();
                      getCode(params.row.id);
                    }}
                  >
                    <EditIcon style={{ fontsize: "large" }} />
                  </Button>
                )}

                {isUserRoleCompare?.includes("ipersonalinfoupdate") && (
                  <Button
                    sx={userStyle.buttonedit}
                    onClick={() => {
                      handleClickOpeninfo();
                      getinfoCode(params.row.id);
                    }}
                  >
                    <InfoOutlinedIcon style={{ fontsize: "large" }} />
                  </Button>
                )}
              </Grid>
            </>
          )}
        </>
      ),
    },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      companyname: item.companyname,
      empcode: item.empcode,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
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

  const handleClearFilter = () => {
    setValueCompanyCat([]);
    setSelectedOptionsCompany([]);
    setValueBranchCat([]);
    setSelectedOptionsBranch([]);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setEmployees([]);
    setShowAlert(
      <>
        <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>
          {"Cleared Successfully"}
        </p>
      </>
    );
    handleClickOpenerr();
  };

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
  };

  const customValueRendererTeam = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length
      ? valueTeamCat.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };

  //MULTISELECT ONCHANGE END

  const handleFilter = () => {
    if (selectedOptionsCompany?.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Company"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      fetchEmployee();
    }
  };
  const [allAssignCompany, setAllAssignCompany] = useState([]);
  const [allAssignBranch, setAllAssignBranch] = useState([]);
  const [allAssignUnit, setAllAssignUnit] = useState([]);
  //get all employees list details
  const fetchEmployee = async () => {
    setpersonalcheck(true);
    setPageName(!pageName);
    const aggregationPipeline = [
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
          ],
        },
      },
      {
        $project: {
          company: 1,
          branch: 1,
          unit: 1,
          team: 1,
          empcode: 1,
          companyname: 1,
        },
      },
    ];
    try {
      let response = await axios.post(
        SERVICE.DYNAMICUSER_CONTROLLER,
        {
          aggregationPipeline,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setEmployees(response.data.users);
      setpersonalcheck(false);
    } catch (err) {
      setpersonalcheck(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
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
      setAllAssignCompany(selectedCompany);

      setAllAssignBranch(selectedBranch);

      setAllAssignUnit(selectedUnit);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    handleAutoSelect();
  }, [isAssignBranch]);

  return (
    <Box>
      <NotificationContainer />
      <Headtitle title={"PERSONAL INFO UPDATE"} />
      <PageHeading
        title="Manage Personal Info update"
        modulename="Human Resources"
        submodulename="HR"
        mainpagename="Employee"
        subpagename="Employee Update Details"
        subsubpagename="Personal Info update"
      />

      <br />
      {isUserRoleCompare?.includes("lpersonalinfoupdate") && (
        <>
          <Box sx={userStyle.selectcontainer}>
            <Grid container spacing={2}>
              <>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    Company<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl size="small" fullWidth>
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
                      }}
                      valueRenderer={customValueRendererCompany}
                      labelledBy="Please Select Company"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography> Branch</Typography>
                    <MultiSelect
                      options={isAssignBranch
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
                                i.label === item.label && i.value === item.value
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
                    <Typography> Unit</Typography>
                    <MultiSelect
                      options={isAssignBranch
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
                                i.label === item.label && i.value === item.value
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
                    <Typography>Team</Typography>
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
                  onClick={handleFilter}
                >
                  {" "}
                  Filter{" "}
                </Button>
              </Grid>
              <Grid item lg={1} md={2} sm={2} xs={12}>
                <Button sx={userStyle.btncancel} onClick={handleClearFilter}>
                  {" "}
                  Clear{" "}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
      <br />
      {isUserRoleCompare?.includes("lpersonalinfoupdate") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Personal Information Update List
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
                  {isUserRoleCompare?.includes("excelpersonalinfoupdate") && (
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
                  {isUserRoleCompare?.includes("csvpersonalinfoupdate") && (
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
                  {isUserRoleCompare?.includes("printpersonalinfoupdate") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfpersonalinfoupdate") && (
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
                  {isUserRoleCompare?.includes("imagepersonalinfoupdate") && (
                    <Button
                      sx={userStyle.buttongrp}
                      onClick={handleCaptureImage}
                    >
                      {" "}
                      <ImageIcon
                        sx={{ fontSize: "15px" }}
                      /> &ensp;Image&ensp;{" "}
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
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
              Manage Columns
            </Button>
            &ensp;
            <br />
            <br />
            {personalcheck ? (
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
                <Box style={userStyle.dataTablestyle}>
                  <Box>
                    Showing{" "}
                    {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
                    {Math.min(page * pageSize, filteredDatas.length)} of{" "}
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
          </Box>
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

      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="lg"
          sx={{
            overflow: "visible",
            "& .MuiPaper-root": {
              overflow: "auto",
            },
            "& .dropdown-container": {
              position: "relative", // Ensure the container is positioned relative
              zIndex: 1500, // Adjust the z-index value as needed
            },
          }}
        >
          <Box sx={userStyle.dialogbox}>
            <DialogContent
              sx={{ maxWidth: "950px", padding: "20px", overflowY: "visible" }}
            >
              <Typography sx={userStyle.SubHeaderText}>
                {" "}
                Update Personal Information{" "}
              </Typography>
              <br />
              <br /> <br />
              <form onSubmit={handleSubmit}>
                <Box>
                  <>
                    <Grid container spacing={1}>
                      <Grid
                        item
                        md={6}
                        sm={12}
                        xs={12}
                        sx={{ display: "flex" }}
                      >
                        <Typography
                          sx={{ fontWeight: "600", marginRight: "5px" }}
                        >
                          Employee Name:
                        </Typography>
                        <Typography sx={userStyle.SubHeaderText}>
                          {empaddform.companyname}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        md={6}
                        sm={12}
                        xs={12}
                        sx={{ display: "flex" }}
                      >
                        <Typography
                          sx={{ fontWeight: "600", marginRight: "5px" }}
                        >
                          Emp Code:
                        </Typography>
                        <Typography sx={userStyle.SubHeaderText}>
                          {empaddform.empcode}
                        </Typography>
                      </Grid>
                    </Grid>
                    <br />
                    <br />
                    <br />
                    <Grid container spacing={1}>
                      <Grid item md={6} sm={12} xs={12}>
                        <Typography>
                          First Name<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Grid container sx={{ display: "flex" }}>
                          <Grid item md={3} sm={3} xs={3}>
                            <FormControl size="small" fullWidth>
                              {/* <Select
                                labelId="demo-select-small"
                                id="demo-select-small"
                                placeholder="Mr."
                                value={empaddform.prefix}
                                MenuProps={{
                                  PaperProps: {
                                    style: {
                                      maxHeight: 200,
                                      width: 80,
                                    },
                                  },
                                }}
                                onChange={(e) => {
                                  setEmpaddform({
                                    ...empaddform,
                                    prefix: e.target.value,
                                  });
                                }}
                              >
                                <MenuItem value="Mr">Mr</MenuItem>
                                <MenuItem value="Ms">Ms</MenuItem>
                                <MenuItem value="Mrs">Mrs</MenuItem>
                              </Select> */}
                              <OutlinedInput
                                id="component-outlined"
                                type="text"
                                placeholder="Last Name"
                                value={empaddform.prefix}
                                // onChange={(e) => {
                                //   setEmpaddform({
                                //     ...empaddform,
                                //     lastname: e.target.value?.toUpperCase(),
                                //   });
                                // }}
                                readOnly
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={9} sm={9} xs={9}>
                            <FormControl size="small" fullWidth>
                              <OutlinedInput
                                id="component-outlined"
                                type="text"
                                placeholder="First Name"
                                value={empaddform.firstname}
                                // onChange={(e) => {
                                //   setEmpaddform({
                                //     ...empaddform,
                                //     firstname: e.target.value?.toUpperCase(),
                                //   });
                                // }}
                                readOnly
                              />
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item md={6} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Last Name<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            placeholder="Last Name"
                            value={empaddform.lastname}
                            // onChange={(e) => {
                            //   setEmpaddform({
                            //     ...empaddform,
                            //     lastname: e.target.value?.toUpperCase(),
                            //   });
                            // }}
                            readOnly
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Legal Name<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            placeholder="Legal Name"
                            value={empaddform.legalname}
                            onChange={(e) => {
                              setEmpaddform({
                                ...empaddform,
                                legalname: e.target.value,
                                //callingname: e.target.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Calling Name<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            placeholder="Calling Name"
                            value={empaddform.callingname}
                            onChange={(e) => {
                              setEmpaddform({
                                ...empaddform,
                                callingname: e.target.value.replace(/\s/g, ""),
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>

                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Father Name</Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            placeholder="Father Name"
                            value={empaddform.fathername}
                            onChange={(e) => {
                              setEmpaddform({
                                ...empaddform,
                                fathername: e.target.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Mother Name</Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            placeholder="Mother Name"
                            value={empaddform.mothername}
                            onChange={(e) => {
                              setEmpaddform({
                                ...empaddform,
                                mothername: e.target.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Gender</Typography>
                          <Selects
                            maxMenuHeight={300}
                            options={[
                              { label: "Others", value: "Others" },
                              { label: "Female", value: "Female" },
                              { label: "Male", value: "Male" },
                            ]}
                            value={{
                              label:
                                empaddform.gender === "" ||
                                empaddform.gender == undefined
                                  ? "Select Gender"
                                  : empaddform.gender,
                              value:
                                empaddform.gender === "" ||
                                empaddform.gender == undefined
                                  ? "Select Gender"
                                  : empaddform.gender,
                            }}
                            onChange={(e) => {
                              setEmpaddform({ ...empaddform, gender: e.value });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Marital Status</Typography>

                          <Selects
                            maxMenuHeight={300}
                            options={[
                              { label: "Single", value: "Single" },
                              { label: "Married", value: "Married" },
                              { label: "Divorced", value: "Divorced" },
                            ]}
                            value={{
                              label:
                                empaddform.maritalstatus === "" ||
                                empaddform.maritalstatus == undefined
                                  ? "Select Marital Status"
                                  : empaddform.maritalstatus,
                              value:
                                empaddform.maritalstatus === "" ||
                                empaddform.maritalstatus == undefined
                                  ? "Select Marital Status"
                                  : empaddform.maritalstatus,
                            }}
                            onChange={(e) => {
                              setEmpaddform({
                                ...empaddform,
                                maritalstatus: e.value,
                                dom: "",
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      {empaddform.maritalstatus === "Married" && (
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Date Of Marriage<b style={{ color: "red" }}>*</b>
                            </Typography>
                            <OutlinedInput
                              id="component-outlined"
                              value={empaddform.dom}
                              onChange={(e) => {
                                setEmpaddform({
                                  ...empaddform,
                                  dom: e.target.value,
                                });
                              }}
                              type="date"
                              size="small"
                              name="dom"
                            />
                          </FormControl>
                        </Grid>
                      )}
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Date Of Birth <b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            value={empaddform.dob}
                            onChange={(e) => {
                              let age = calculateAge(e.target.value);
                              setEmpaddform({
                                ...empaddform,
                                dob: e.target.value,
                                age,
                              });
                            }}
                            type="date"
                            size="small"
                            name="dob"
                            inputProps={{ max: maxDate }}
                            onKeyDown={(e) => e.preventDefault()}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Age</Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="number"
                            value={empaddform.dob === "" ? "" : empaddform?.age}
                            readOnly
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Aadhar No <b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            value={empaddform?.aadhar?.slice(0, 12)}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "" || /^\d*$/.test(value)) {
                                setEmpaddform({
                                  ...empaddform,
                                  aadhar: e.target.value,
                                });
                              }
                            }}
                            type="text"
                            size="small"
                            name="dob"
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            PAN Card Status<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <Selects
                            maxMenuHeight={300}
                            options={[
                              { label: "Have PAN", value: "Have PAN" },
                              { label: "Applied", value: "Applied" },
                              { label: "Yet to Apply", value: "Yet to Apply" },
                            ]}
                            value={{
                              label:
                                empaddform.panstatus === "" ||
                                empaddform.panstatus == undefined
                                  ? "Select PAN Status"
                                  : empaddform.panstatus,
                              value:
                                empaddform.panstatus === "" ||
                                empaddform.panstatus == undefined
                                  ? "Select PAN Status"
                                  : empaddform.panstatus,
                            }}
                            onChange={(e) => {
                              setEmpaddform({
                                ...empaddform,
                                panstatus: e.value,
                                panno: "",
                                panrefno: "",
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      {empaddform?.panstatus === "Have PAN" && (
                        <Grid item md={3} sm={6} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Pan No<b style={{ color: "red" }}>*</b>
                            </Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Pan No"
                              value={empaddform.panno}
                              onChange={(e) => {
                                if (e.target.value.length < 11) {
                                  setEmpaddform({
                                    ...empaddform,
                                    panno: e.target.value,
                                  });
                                }
                              }}
                            />
                          </FormControl>
                        </Grid>
                      )}
                      {empaddform?.panstatus === "Applied" && (
                        <Grid item md={3} sm={6} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Application Ref No
                              <b style={{ color: "red" }}>*</b>
                            </Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Application Ref No"
                              value={empaddform.panrefno}
                              onChange={(e) => {
                                if (e.target.value.length < 16) {
                                  setEmpaddform({
                                    ...empaddform,
                                    panrefno: e.target.value,
                                  });
                                }
                              }}
                            />
                          </FormControl>
                        </Grid>
                      )}
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Blood Group</Typography>
                          <Selects
                            maxMenuHeight={300}
                            options={[
                              { label: "A-ve-", value: "A-ve-" },
                              { label: "A+ve-", value: "A+ve-" },
                              { label: "B+ve", value: "B+ve" },
                              { label: "B-ve", value: "B-ve" },
                              { label: "O+ve", value: "O+ve" },
                              { label: "O-ve", value: "O-ve" },
                              { label: "AB+ve", value: "AB+ve" },
                              { label: "AB-ve", value: "AB-ve" },
                              { label: "A1+ve", value: "A1+ve" },
                              { label: "A1-ve", value: "A1-ve" },
                              { label: "A2+ve", value: "A2+ve" },
                              { label: "A2-ve", value: "A2-ve" },
                              { label: "A1B+ve", value: "A1B+ve" },
                              { label: "A1B-ve", value: "A1B-ve" },
                              { label: "A2B+ve", value: "A2B+ve" },
                              { label: "A2B-ve", value: "A2B-ve" },
                            ]}
                            value={{
                              label:
                                empaddform.bloodgroup === "" ||
                                empaddform.bloodgroup == undefined
                                  ? "Select Blood Group"
                                  : empaddform.bloodgroup,
                              value:
                                empaddform.bloodgroup === "" ||
                                empaddform.bloodgroup == undefined
                                  ? "Select Blood Group"
                                  : empaddform.bloodgroup,
                            }}
                            onChange={(e) => {
                              setEmpaddform({
                                ...empaddform,
                                bloodgroup: e.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </>
                  <br />
                  <br />
                  <br />
                  <Typography sx={userStyle.SubHeaderText}>
                    {" "}
                    Permanent Address <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <br />
                  <br />
                  <>
                    <Grid container spacing={1}>
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Door/Flat No</Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            placeholder="Door/Flat No"
                            value={empaddform.pdoorno}
                            onChange={(e) => {
                              setEmpaddform({
                                ...empaddform,
                                pdoorno: e.target.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Street/Block</Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            placeholder="Street/Block"
                            value={empaddform.pstreet}
                            onChange={(e) => {
                              setEmpaddform({
                                ...empaddform,
                                pstreet: e.target.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Area/village</Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            placeholder="Area/Village"
                            value={empaddform.parea}
                            onChange={(e) => {
                              setEmpaddform({
                                ...empaddform,
                                parea: e.target.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Landmark</Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            placeholder="Landmark"
                            value={empaddform.plandmark}
                            onChange={(e) => {
                              setEmpaddform({
                                ...empaddform,
                                plandmark: e.target.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <br />
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Taluk</Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            placeholder="Thaluka"
                            value={empaddform.ptaluk}
                            onChange={(e) => {
                              setEmpaddform({
                                ...empaddform,
                                ptaluk: e.target.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl size="small" fullWidth>
                          <Typography>Post</Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            placeholder="Post"
                            value={empaddform.ppost}
                            onChange={(e) => {
                              setEmpaddform({
                                ...empaddform,
                                ppost: e.target.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={12} sx={12}>
                        <FormControl size="small" fullWidth>
                          <Typography>Pincode</Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            placeholder="Pincode"
                            value={empaddform.ppincode?.slice(0, 6)}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "" || /^\d*$/.test(value)) {
                                setEmpaddform({
                                  ...empaddform,
                                  ppincode: e.target.value,
                                });
                              }
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl size="small" fullWidth>
                          <Typography>Country</Typography>
                          <Selects
                            options={Country.getAllCountries()}
                            getOptionLabel={(options) => {
                              return options["name"];
                            }}
                            getOptionValue={(options) => {
                              return options["name"];
                            }}
                            value={selectedCountryp}
                            styles={colourStyles}
                            onChange={(item) => {
                              setSelectedCountryp(item);
                              setSelectedStatep("");
                              setSelectedCityp("");
                            }}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={1}>
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>State</Typography>
                          <Selects
                            options={State?.getStatesOfCountry(
                              selectedCountryp?.isoCode
                            )}
                            getOptionLabel={(options) => {
                              return options["name"];
                            }}
                            getOptionValue={(options) => {
                              return options["name"];
                            }}
                            value={selectedStatep}
                            styles={colourStyles}
                            onChange={(item) => {
                              setSelectedStatep(item);
                              setSelectedCityp("");
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>City</Typography>
                          <Selects
                            options={City.getCitiesOfState(
                              selectedStatep?.countryCode,
                              selectedStatep?.isoCode
                            )}
                            getOptionLabel={(options) => {
                              return options["name"];
                            }}
                            getOptionValue={(options) => {
                              return options["name"];
                            }}
                            value={selectedCityp}
                            styles={colourStyles}
                            onChange={(item) => {
                              setSelectedCityp(item);
                            }}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </>
                  <br />
                  <br />
                  <br />
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography sx={userStyle.SubHeaderText}>
                        {" "}
                        Current Address<b style={{ color: "red" }}>*</b>{" "}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={Boolean(empaddform.samesprmnt)}
                            onChange={(e) =>
                              setEmpaddform({
                                ...empaddform,
                                samesprmnt: !empaddform.samesprmnt,
                                cpincode: "",
                              })
                            }
                          />
                        }
                        label="Same as permananet Address"
                      />
                    </Grid>
                  </Grid>
                  <br />
                  <br />
                  {!empaddform.samesprmnt ? (
                    <>
                      <Grid container spacing={1}>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Door/Flat No</Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Door/Flat No"
                              value={empaddform.cdoorno}
                              onChange={(e) => {
                                setEmpaddform({
                                  ...empaddform,
                                  cdoorno: e.target.value,
                                });
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Street/Block</Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Street/Block"
                              value={empaddform.cstreet}
                              onChange={(e) => {
                                setEmpaddform({
                                  ...empaddform,
                                  cstreet: e.target.value,
                                });
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Area/village</Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Area/Village"
                              value={empaddform.carea}
                              onChange={(e) => {
                                setEmpaddform({
                                  ...empaddform,
                                  carea: e.target.value,
                                });
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Landmark</Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Landmark"
                              value={empaddform.clandmark}
                              onChange={(e) => {
                                setEmpaddform({
                                  ...empaddform,
                                  clandmark: e.target.value,
                                });
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <br />
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Taluk</Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Taluk"
                              value={empaddform.ctaluk}
                              onChange={(e) => {
                                setEmpaddform({
                                  ...empaddform,
                                  ctaluk: e.target.value,
                                });
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl size="small" fullWidth>
                            <Typography>Post</Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Post"
                              value={empaddform.cpost}
                              onChange={(e) => {
                                setEmpaddform({
                                  ...empaddform,
                                  cpost: e.target.value,
                                });
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl size="small" fullWidth>
                            <Typography>Pincode</Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Pincode"
                              value={empaddform.cpincode?.slice(0, 6)}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === "" || /^\d*$/.test(value)) {
                                  setEmpaddform({
                                    ...empaddform,
                                    cpincode: e.target.value,
                                  });
                                }
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Country</Typography>
                            <Selects
                              options={Country.getAllCountries()}
                              getOptionLabel={(options) => {
                                return options["name"];
                              }}
                              getOptionValue={(options) => {
                                return options["name"];
                              }}
                              value={selectedCountryc}
                              menuPortalTarget={document.body}
                              styles={{
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 1500,
                                }),
                                ...colourStyles, // Set z-index to display above the Dialog
                              }}
                              onChange={(item) => {
                                setSelectedCountryc(item);
                                setSelectedStatec("");
                                setSelectedCityc("");
                              }}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                      <br />
                      <Grid container spacing={1}>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>State</Typography>
                            <Selects
                              options={State?.getStatesOfCountry(
                                selectedCountryc?.isoCode
                              )}
                              getOptionLabel={(options) => {
                                return options["name"];
                              }}
                              getOptionValue={(options) => {
                                return options["name"];
                              }}
                              value={selectedStatec}
                              // styles={colourStyles}
                              onChange={(item) => {
                                setSelectedStatec(item);
                                setSelectedCityc("");
                              }}
                              menuPortalTarget={document.body}
                              styles={{
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 1500,
                                }),
                                ...colourStyles, // Set z-index to display above the Dialog
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>City</Typography>
                            <Selects
                              options={City.getCitiesOfState(
                                selectedStatec?.countryCode,
                                selectedStatec?.isoCode
                              )}
                              getOptionLabel={(options) => {
                                return options["name"];
                              }}
                              getOptionValue={(options) => {
                                return options["name"];
                              }}
                              value={selectedCityc}
                              menuPortalTarget={document.body}
                              styles={{
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 1500,
                                }),
                                ...colourStyles, // Set z-index to display above the Dialog
                              }}
                              onChange={(item) => {
                                setSelectedCityc(item);
                              }}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </>
                  ) : (
                    // else condition starts here
                    <>
                      <Grid container spacing={1}>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Door/Flat No</Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Door/Flat No"
                              value={empaddform.pdoorno}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Street/Block</Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Street/Block"
                              value={empaddform.pstreet}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Area/village</Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Area/Village"
                              value={empaddform.parea}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Landmark</Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Landmark"
                              value={empaddform.plandmark}
                            />
                          </FormControl>
                        </Grid>
                        <br />
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Taluk</Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Taluk"
                              value={empaddform.ptaluk}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl size="small" fullWidth>
                            <Typography>Post</Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Post"
                              value={empaddform.ppost}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl size="small" fullWidth>
                            <Typography>Pincode</Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Pincode"
                              value={empaddform.ppincode?.slice(0, 6)}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl size="small" fullWidth>
                            <Typography>Country</Typography>
                            <Selects
                              options={Country.getAllCountries()}
                              getOptionLabel={(options) => {
                                return options["name"];
                              }}
                              getOptionValue={(options) => {
                                return options["name"];
                              }}
                              value={selectedCountryp}
                              styles={colourStyles}
                              onChange={(item) => {
                                setSelectedCountryp(item);
                              }}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                      <br />
                      <Grid container spacing={1}>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>State</Typography>
                            <Selects
                              options={State?.getStatesOfCountry(
                                selectedCountryp?.isoCode
                              )}
                              getOptionLabel={(options) => {
                                return options["name"];
                              }}
                              getOptionValue={(options) => {
                                return options["name"];
                              }}
                              value={selectedStatep}
                              styles={colourStyles}
                              onChange={(item) => {
                                setSelectedStatep(item);
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>City</Typography>
                            <Selects
                              options={City.getCitiesOfState(
                                selectedStatep?.countryCode,
                                selectedStatep?.isoCode
                              )}
                              getOptionLabel={(options) => {
                                return options["name"];
                              }}
                              getOptionValue={(options) => {
                                return options["name"];
                              }}
                              value={selectedCityp}
                              styles={colourStyles}
                              onChange={(item) => {
                                setSelectedCityp(item);
                              }}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </>
                  )}
                  <br />
                  <br />
                  <br />
                  <br />
                  <Grid
                    container
                    spacing={2}
                    sx={{
                      textAlign: "center",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Grid item md={1}></Grid>
                    <Button variant="contained" type="submit">
                      Update
                    </Button>
                    <Grid item md={1}></Grid>
                    <Button
                      sx={userStyle.btncancel}
                      onClick={handleCloseModEdit}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Box>
                <br />
              </form>
            </DialogContent>
          </Box>
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
            <Button variant="contained" onClick={handleCloseerr} color="error">
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
            <Typography sx={userStyle.HeaderText}> Personal Info</Typography>
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

      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table aria-label="simple table" id="branch" ref={componentRef}>
          <TableHead sx={{ fontWeight: "600" }}>
            <TableRow>
              <TableCell>SI.NO</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Employee Code</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Team</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rowDataTable &&
              rowDataTable.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{printno++}</TableCell>
                  <TableCell> {row.companyname}</TableCell>
                  <TableCell>{row.empcode}</TableCell>
                  <TableCell>{row.company}</TableCell>
                  <TableCell>{row.branch}</TableCell>
                  <TableCell>{row.unit}</TableCell>
                  <TableCell>{row.team}</TableCell>
                </TableRow>
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

      <LoadingDialog
        open={openPopupUpload}
        onClose={() => setOpenPopupUpload(false)}
        progress={uploadProgress}
      />
    </Box>
  );
}

export default Personalupdate;
