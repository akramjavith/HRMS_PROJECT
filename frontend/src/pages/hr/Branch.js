import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import PageHeading from "../../components/PageHeading";

import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl, Grid,
  IconButton,
  LinearProgress,
  List, ListItem,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Popover,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextareaAutosize,
  TextField,
  Typography
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { City, Country, State } from "country-state-city";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment-timezone";
import QRCode from 'qrcode';
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import { StyledTableCell, StyledTableRow } from "../../components/Table";
import StyledDataGrid from "../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { BASE_URL } from "../../services/Authservice";
import { SERVICE } from "../../services/Baseservice";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import * as FileSaver from "file-saver";
import { FaFileCsv, FaFileExcel } from "react-icons/fa";
import * as XLSX from "xlsx";

const Branch = () => {

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
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = fileFormat === "xl" ? ".xlsx" : ".csv";
  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const handleExportXL = (isfilter) => {
    if (isfilter === "filtered") {
      exportToCSV(
        rowDataTable.map((item, index) => {
          return {
            "S.No": index + 1,
            Name: item.name,
            Code: item.code,
            Assetcode: item.assetcode,
            Company: item.company,
            Address: item.address,
            Phonenumber: item.phone,
            Email: item.email,
          };
        }),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        items?.map((item, index) => ({
          "S.No": index + 1,
          Name: item.name,
          Code: item.code,
          Assetcode: item.assetcode,
          Company: item.company,
          Address: item.address,
          Phonenumber: item.phone,
          Email: item.email,
        })),
        fileName
      );
    }
    setIsFilterOpen(false);
  };

  const { auth } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);
  const [isBtn, setIsBtn] = useState(false);

  const [branch, setBranch] = useState({
    code: "",
    assetcode: "",
    phone: "",
    email: "",
    company: "Please Select Company",
    name: "",
    country: "",
    state: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [isValidEmail, setIsValidEmail] = useState(false);
  const [errors, setErrors] = useState({});
  const [emailbranch, setEmail] = useState("");
  const [compCode, setCompCode] = useState("");

  const validateEmail = (emailbranch) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(emailbranch);
  };

  const [branches, setBranches] = useState([]);
  const [branchesall, setBranchesall] = useState([]);
  const [getrowid, setRowGetid] = useState("");
  const [branchedit, setBranchedit] = useState({
    code: "",
    assetcode: "",
    phone: "",
    email: "",
    company: "Please Select Company",
    name: "",
    country: "",
    state: "",
    address: "",
    city: "",
    pincode: "",
  });
  const [deletebranch, setDeletebranch] = useState({});
  const { isUserRoleCompare } = useContext(UserRoleAccessContext);

  const [isBranch, setIsBranch] = useState(false);
  const { isUserRoleAccess, isAssignBranch } = useContext(UserRoleAccessContext);

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
          saveAs(blob, "Branch.png");
        });
      });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [ovProj, setOvProj] = useState("");
  const [ovProjCount, setOvProjCount] = useState("");
  const [getOverAllCount, setGetOverallCount] = useState("");

  // view model
  const [openview, setOpenview] = useState(false);

  const handleClickOpenview = () => {
    setOpenview(true);
  };

  const handleCloseview = () => {
    setOpenview(false);
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

  // Error Popup model
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showAlertpop, setShowAlertpop] = useState();
  const handleClickOpenerrpop = () => {
    setIsErrorOpenpop(true);
  };
  const handleCloseerrpop = () => {
    setIsErrorOpenpop(false);
  };

  //check delete model
  const [isCheckOpen, setisCheckOpen] = useState(false);
  const handleClickOpenCheck = () => {
    setisCheckOpen(true);
  };
  const handleCloseCheck = () => {
    setisCheckOpen(false);
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };

  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  //Delete model
  const [isDeleteOpen, setisDeleteOpen] = useState(false);
  const handleClickOpendel = () => {
    setisDeleteOpen(true);
  };
  const handleCloseDel = () => {
    setisDeleteOpen(false);
  };

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

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

  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

  const handleClickOpencheckbox = () => {
    setIsDeleteOpencheckbox(true);
  };
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
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
    name: true,
    code: true,
    assetcode: true,
    company: true,
    address: true,
    phone: true,
    email: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  const delBranchcheckbox = async () => {
    try {

      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.BRANCH_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);

      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);

      await fetchBranch();
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Deleted Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // Edit model
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    setBranch({
      company: "Please Select Company",
      code: "",
      assetcode: "",
      phone: "",
      email: "",
      name: "",
      address: "",
      pincode: "",
    });
    setIsValidEmail(validateEmail(""));
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
  };

  // get all branches
  const fetchBranch = async () => {
    try {
      let res_branch = await axios.get(SERVICE.BRANCH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setBranches(res_branch?.data?.branch);

      setIsBranch(true);
    } catch (err) { setIsBranch(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };


  //  PDF
  const columns = [
    { title: "Name", field: "name" },
    { title: "Code", field: "code" },
    { title: "Asset Code", field: "assetcode" },
    { title: "Company", field: "company" },
    { title: "Address", field: "address" },
    { title: "Phone Number", field: "phone" },
    { title: "Email", field: "email" },
  ];


  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();
    // Modify columns to include serial number column
    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" }, // Serial number column
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial =
      isfilter === "filtered"
        ? rowDataTable.map((item, index) => {
          return {
            serialNumber: index + 1,
            name: item.name,
            code: item.code,
            assetcode: item.assetcode,
            company: item.company,
            address: item.address,
            phone: item.phone,
            email: item.email,
          };
        })
        : items?.map((item, index) => ({
          serialNumber: index + 1,
          name: item.name,
          code: item.code,
          assetcode: item.assetcode,
          company: item.company,
          address: item.address,
          phone: item.phone,
          email: item.email,
        }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: "5" },
    });

    doc.save("Branch.pdf");
  };

  // Excel
  const fileName = "Branch";
  let excelno = 1;

  // Country states
  const [selectedCountryp, setSelectedCountryp] = useState(Country.getAllCountries().find((country) => country.name === "India"));
  const [selectedStatep, setSelectedStatep] = useState(State.getStatesOfCountry(selectedCountryp?.isoCode).find((state) => state.name === "Tamil Nadu"));
  const [selectedCityp, setSelectedCityp] = useState(City.getCitiesOfState(selectedStatep?.countryCode, selectedStatep?.isoCode).find((city) => city.name === "Tiruchirappalli"));

  const [selectedCountryc, setSelectedCountryc] = useState();
  const [selectedStatec, setSelectedStatec] = useState();
  const [selectedCityc, setSelectedCityc] = useState();
  const [oldBranchName, setOldBranchName] = useState("");
  const getCode = async (e, name) => {
    try {
      let res = await axios.get(`${SERVICE.BRANCH_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setBranchedit(res?.data?.sbranch);
      setOldBranchName(name)
      setRowGetid(res?.data?.sbranch);
      setOvProj(name);
      setIsValidEmail(validateEmail(res?.data?.sbranch.email));
      getOverallEditSection(name);
      const country = Country.getAllCountries().find((country) => country.name === res?.data?.sbranch?.country);
      const state = State.getStatesOfCountry(country?.isoCode).find((state) => state.name === res?.data?.sbranch?.state);
      const city = City.getCitiesOfState(state?.countryCode, state?.isoCode).find((city) => city.name === res?.data?.sbranch?.city);
      setSelectedCountryc(country);
      setSelectedStatec(state);
      setSelectedCityc(city);
      handleClickOpenEdit();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // get single row to edit....
  const getviewCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.BRANCH_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setBranchedit(res?.data?.sbranch);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.BRANCH_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setBranchedit(res?.data?.sbranch);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // get all branches
  const fetchBranchAll = async () => {
    try {
      let res_branch = await axios.get(SERVICE.BRANCH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setBranchesall(res_branch?.data?.branch.filter((item) => item._id !== branchedit._id));
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //set function to get particular row on delete
  const [checkUnit, setCheckUnit] = useState();
  const [checkFloor, setCheckFloor] = useState();
  const [checkUser, setCheckUser] = useState();
  const [checkBranch, setCheckBranch] = useState();

  //set function to get particular row
  const rowData = async (id, name) => {
    try {
      const [res, resdev] = await Promise.all([
        axios.get(`${SERVICE.BRANCH_SINGLE}/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.post(SERVICE.BRANCHALLCHECK, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          checkbranch: String(name),
        }),
      ])

      setDeletebranch(res?.data?.sbranch);
      setCheckUnit(resdev?.data?.units);
      setCheckFloor(resdev?.data?.floors);
      setCheckBranch(resdev?.data?.designation);
      setCheckUser(resdev?.data?.users);

      if (
        resdev?.data?.units?.length > 0 ||
        resdev?.data?.areagrouping?.length > 0 ||
        resdev?.data?.designation?.length > 0 ||
        resdev?.data?.floors?.length > 0 ||
        resdev?.data?.locationgrouping?.length > 0 ||
        resdev?.data?.manpower?.length > 0 ||
        resdev?.data?.users?.length > 0 ||
        resdev?.data?.workstation?.length > 0

      ) {
        handleClickOpenCheck();
      } else {
        handleClickOpendel();
      }
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // Alert delete popup

  let branchid = deletebranch._id;

  const delBranch = async () => {
    try {
      await axios.delete(`${SERVICE.BRANCH_SINGLE}/${branchid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchBranch();
      setPage(1);
      setSelectedRows([]);
      setPage(1);
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Deleted Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

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

  let totalLoaded = 0;
  let totalSize = 0;

  const [uploadProgress, setUploadProgress] = useState(0);
  const [openPopupUpload, setOpenPopupUpload] = useState(false);


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
      const percentCompleted = Math.round((totalLoaded * 100) / totalSize);
      setUploadProgress(percentCompleted);
      console.log(`Total Upload Progress: ${percentCompleted}%`);
    } else {
      console.log("Total size is zero, unable to compute progress.");
    }
  };

  const username = isUserRoleAccess.username;

  //branch updatedby edit page....
  let updateby = branchedit?.updatedby;
  let addedby = branchedit?.addedby;

  //edit post call
  let branch_id = getrowid?._id;
  // /edit put
  const sendRequestEdit = async () => {
    setIsLoading(true);
    try {
      // const qrCodeBase64 = await QRCode.toDataURL(`${"http://192.168.85.34:3000"}/Visitorsregister/${branch.company}/${branch.name}`);
      const qrCodeBase64 = await QRCode.toDataURL(`${BASE_URL}/Visitorsregister/${branchedit.company}/${branchedit.name}`);

      let branches = await axios.put(`${SERVICE.BRANCH_SINGLE}/${branch_id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        code: String(branchedit.code),
        assetcode: String(branchedit.assetcode),
        phone: String(branchedit.phone),
        email: String(branchedit.email),
        name: String(branchedit.name),
        address: String(branchedit.address),
        company: String(branchedit.company),
        country: String(selectedCountryc?.name == undefined ? "" : selectedCountryc?.name),
        state: String(selectedStatec?.name == undefined ? "" : selectedStatec?.name),
        city: String(selectedCityc?.name == undefined ? "" : selectedCityc?.name),
        pincode: String(branchedit.pincode),
        companycode: String(compCode),
        qrcode: (qrCodeBase64),
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });

      const performUploads = async () => {
        try {
          // Check and perform employee name update
          if (
            branchedit.name?.toLowerCase() !==
            oldBranchName?.toLowerCase()

          ) {
            await axios.put(
              `${SERVICE.BRANCHOVERALLUPDATE}`,
              {
                oldname: oldBranchName,
                newname: branchedit.name,
              },
              {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
                onUploadProgress: handleUploadProgress,
              }
            );
          }



        } catch (error) {
          console.error("Error during upload:", error);
        } finally {
          setOpenPopupUpload(false); // Close the popup after all uploads are completed
          console.log("ended");
        }
      };

      await performUploads()

      await fetchBranch();
      handleCloseModEdit();
      setIsLoading(false);
      fetchBranchAll();
      getOverallEditSectionUpdate();
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Updated Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {
      setIsLoading(false);
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };


  const editSubmit = (e) => {
    const newErrors = {};
    e.preventDefault();
    fetchBranchAll();
    const isNameMatch = branchesall.some((item) => item.name.toLowerCase() === branchedit.name.toLowerCase() && item.company === branchedit.company);
    const isCodeMatch = branchesall.some((item) => item.code.toLowerCase() === branchedit.code.toLowerCase());
    const isAssetcodeMatch = branchesall.some((item) => item.assetcode.toLowerCase() === branchedit.assetcode.toLowerCase());

    if (branchedit.name === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please enter Name"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (branchedit.code === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please enter Code"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (isNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Name already exists!"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (isCodeMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Code already exists!"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (isAssetcodeMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Asset Code already exists!"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (branchedit.assetcode === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please enter Assetcode"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (branchedit.email !== "" && isValidEmail === false) {
      newErrors.email = <Typography style={{ color: "red" }}>Please enter valid email</Typography>;
    } else if (branchedit.company === "" || branchedit.company == "Please Select Company") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select company"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (branchedit.name != ovProj && ovProjCount > 0) {
      setShowAlertpop(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{getOverAllCount}</p>
        </>
      );
      handleClickOpenerrpop();
    }
    else if (selectedCountryc?.isoCode !== selectedStatec?.countryCode) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Select The Correct State"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    }
    else if (selectedCountryc?.isoCode !== selectedCityc?.countryCode || selectedStatec?.isoCode !== selectedCityc?.stateCode) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Select The Correct City"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    }
    else {
      sendRequestEdit();
    }
    setErrors(newErrors);
  };

  //overall edit section for all pages
  const getOverallEditSection = async (e) => {
    try {
      let res = await axios.post(SERVICE.OVERALL_BRANCH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: e,
      });
      setOvProjCount(res?.data?.count);
      setGetOverallCount(`The ${e} is linked in ${res?.data?.units?.length > 0 ? "Unit ," : ""} 
     ${res?.data?.floors?.length > 0 ? "Floor ," : ""}
     ${res?.data?.users?.length > 0 ? "Add Employee ," : ""}
     ${res?.data?.hierarchy?.length > 0 ? "Hierarchy ," : ""}
     ${res?.data?.excelmapresperson?.length > 0 ? "Allotted Resperson" : ""} whether you want to do changes ..??`);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  //overall edit section for all pages
  const getOverallEditSectionUpdate = async () => {
    try {
      let res = await axios.post(SERVICE.OVERALL_BRANCH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: ovProj,
      });
      sendEditRequestOverall(res?.data?.units, res?.data?.floors, res?.data?.users, res?.data?.excelmapresperson, res?.data?.hierarchy);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const sendEditRequestOverall = async (unit, floor, user, excelmapresperson, hierarchy) => {
    try {
      if (unit?.length > 0) {
        let answ = unit.map((d, i) => {
          let res = axios.put(`${SERVICE.UNIT_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            branch: String(branchedit.name),
          });
        });
      }
      if (hierarchy?.length > 0) {
        let answ = hierarchy.map((d, i) => {
          let res = axios.put(`${SERVICE.HIRERARCHI_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            branch: String(branchedit.name),
          });
        });
      }
      if (floor?.length > 0) {
        let answ = floor.map((d, i) => {
          let res = axios.put(`${SERVICE.FLOOR_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            branch: String(branchedit.name),
          });
        });
      }
      if (user?.length > 0) {
        let answ = user.map((d, i) => {
          let res = axios.put(`${SERVICE.USER_SINGLE_PWD}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            branch: String(branchedit.name),
          });
        });
      }
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Updated Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  useEffect(() => {
    fetchBranch();
  }, []);

  useEffect(() => {
    fetchBranchAll();
  }, [isEditOpen, branchedit]);

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Branch",
    pageStyle: "print",
  });

  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = branches?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [branches]);

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
    return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(filteredDatas?.length / pageSize);

  const visiblePages = Math.min(totalPages, 3);

  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

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
              updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.row.id);
            } else {
              updatedSelectedRows = [...selectedRows, params.row.id];
            }

            setSelectedRows(updatedSelectedRows);

            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllChecked(updatedSelectedRows.length === filteredData.length);
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
      width: 80,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    { field: "name", headerName: "Name", flex: 0, width: 160, hide: !columnVisibility.name, headerClassName: "bold-header" },
    { field: "code", headerName: "Code", flex: 0, width: 100, hide: !columnVisibility.code, headerClassName: "bold-header" },
    { field: "assetcode", headerName: "Asset Code", flex: 0, width: 100, hide: !columnVisibility.assetcode, headerClassName: "bold-header" },
    { field: "company", headerName: "Company", flex: 0, width: 100, hide: !columnVisibility.company, headerClassName: "bold-header" },
    { field: "address", headerName: "Address", flex: 0, width: 250, hide: !columnVisibility.address, headerClassName: "bold-header" },
    { field: "phone", headerName: "Phone Number", flex: 0, width: 130, hide: !columnVisibility.phone, headerClassName: "bold-header" },
    { field: "email", headerName: "Email", flex: 0, width: 100, hide: !columnVisibility.email, headerClassName: "bold-header" },

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
          {isUserRoleCompare?.includes("ebranch") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.row.id, params.row.name);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dbranch") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id, params.row.name);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vbranch") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpenview();
                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("ibranch") && (
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
      ),
    },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    const isAdd = item.address;
    const address = isAdd !== "" ? item.address + ", " : "";
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      name: item.name,
      code: item.code,
      assetcode: item.assetcode,
      company: item.company,
      address: address + item.city + ", " + item.state + ", " + item.pincode,
      phone: item.phone,
      email: item.email,
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
  const filteredColumns = columnDataTable.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));

  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  // JSX for the "Manage Columns" popover content
  const manageColumnsContent = (
    <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
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
        <TextField label="Find column" variant="standard" fullWidth value={searchQueryManage} onChange={(e) => setSearchQueryManage(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
      </Box>
      <br />
      <br />
      <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumns.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />}
                secondary={column.field === "checkbox" ? "Checkbox" : column.headerName}
              // secondary={column.headerName }
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Grid container>
          <Grid item md={4}>
            <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibility(initialColumnVisibility)}>
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

  //change form
  const handleChangephonenumber = (e) => {
    // Regular expression to match only positive numeric values
    const regex = /^[0-9]+$/; // Only allows positive integers
    // const regex = /^\d*\.?\d*$/;

    const inputValue = e.target.value;

    // Check if the input value matches the regex or if it's empty (allowing backspace)
    if (regex.test(inputValue) || inputValue === "") {
      // Update the state with the valid numeric value
      setBranch({ ...branch, phone: inputValue });
    }
  };

  // /post call
  const sendRequest = async () => {
    setIsBtn(true)
    try {

      const qrCodeBase64 = await QRCode.toDataURL(`${BASE_URL}/Visitorsregister/${branch.company}/${branch.name}`);

      let branches = await axios.post(SERVICE.BRANCH_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        code: String(branch.code),
        assetcode: String(branch.assetcode),
        phone: String(branch.phone),
        email: String(branch.email),
        name: String(branch.name),
        company: String(branch.company),
        country: String(selectedCountryp?.name == undefined ? "" : selectedCountryp?.name),
        state: String(selectedStatep?.name == undefined ? "" : selectedStatep?.name),
        city: String(selectedCityp?.name == undefined ? "" : selectedCityp?.name),
        address: String(branch.address),
        pincode: String(branch.pincode),
        companycode: String(compCode),
        qrcode: (qrCodeBase64),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      setBranch(branches.data);


      await fetchBranch();
      setBranch({
        ...branch,
        code: "",
        assetcode: "",
        company: "Please Select Company",
        phone: "",
        email: "",
        name: "",
        country: "",
        state: "",
        address: "",
        city: "",
        pincode: "",
      });
      const country = Country.getAllCountries().find((country) => country.name === "India");
      const state = State.getStatesOfCountry(country?.isoCode).find((state) => state.name === "Tamil Nadu");
      const city = City.getCitiesOfState(state?.countryCode, state?.isoCode).find((city) => city.name === "Tiruchirappalli");
      setSelectedCountryp(country);
      setSelectedStatep(state);
      setSelectedCityp(city);
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Added Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
      setIsBtn(false)
    } catch (err) {
      setIsBtn(false)
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };




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

  // submit option for saving....
  const handleSubmit = (e) => {
    const newErrors = {};
    e.preventDefault();
    const isNameMatch = branches.some((item) => item.name.toLowerCase() === branch.name.toLowerCase() && item.company === branch.company);
    const isCodeMatch = branches.some((item) => item.code.toLowerCase() === branch.code.toLowerCase());
    const isAssetcodeMatch = branches.some((item) => item.assetcode.toLowerCase() === branch.assetcode.toLowerCase());

    if (branch.code == "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please enter Code"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (branch.assetcode === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please enter Assetcode"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (branch.name === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please enter Name"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (branch.company === "Please Select Company") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Company"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (branch.email !== "" && isValidEmail === false) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Valid Email"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (selectedCountryp?.isoCode !== selectedStatep?.countryCode) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Select The Correct State"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    }
    else if (selectedCountryp?.isoCode !== selectedCityp?.countryCode || selectedStatep?.isoCode !== selectedCityp?.stateCode) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Select The Correct City"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    }
    else if (isNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Name already exists!"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (isCodeMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Code already exists!"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (isAssetcodeMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Asset Code already exists!"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (branch.company === "" || branch.company == "Please Select Company") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Company"}</p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequest();
    }
    setErrors(newErrors);
  };

  const handleClear = (e) => {
    e.preventDefault();
    setBranch({
      code: "",
      assetcode: "",
      phone: "",
      email: "",
      company: "Please Select Company",
      name: "",
      country: "",
      state: "",
      address: "",
      city: "",
      pincode: "",
    });

    const country = Country.getAllCountries().find((country) => country.name === "India");
    const state = State.getStatesOfCountry(country?.isoCode).find((state) => state.name === "Tamil Nadu");
    const city = City.getCitiesOfState(state?.countryCode, state?.isoCode).find((city) => city.name === "Tiruchirappalli");
    setSelectedCountryp(country);
    setSelectedStatep(state);
    setSelectedCityp(city);
    setShowAlert(
      <>
        <ErrorOutlineOutlinedIcon
          sx={{ fontSize: "100px", color: "orange" }}
        />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>
          {"Cleared Successfully"}
        </p>
      </>
    );
    handleClickOpenerr();
  };

  return (
    <>
      <Headtitle title={"BRANCH"} />
      <PageHeading
        title="Branch"
        modulename="Human Resources"
        submodulename="Facility"
        mainpagename="Branch"
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("abranch") && (
        <>
          <Box sx={userStyle.dialogbox}>
            <Typography sx={userStyle.SubHeaderText}> Add Branch</Typography>
            <br />
            <br />
            <>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12} sm={12} lg={3}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Code <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={branch.code}
                        placeholder="Please Enter Code"
                        onChange={(e) => {
                          setBranch({ ...branch, code: e.target.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12} lg={3}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Asset Code <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Asset Code"
                        value={branch.assetcode}
                        onChange={(e) => {
                          setBranch({ ...branch, assetcode: e.target.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12} lg={3}>
                    <FormControl fullWidth size="small">
                      <Typography>Phone Number</Typography>
                      <OutlinedInput id="component-outlined"
                        type="number"
                        sx={userStyle.input}
                        value={branch.phone?.slice(0, 10)} placeholder="Please Enter Phone Number" onChange={(e) => handleChangephonenumber(e)} />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12} lg={3}>
                    <FormControl fullWidth size="small">
                      <Typography>Email</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="email"
                        placeholder="Please Enter Email"
                        value={branch.email}
                        onChange={(e) => {
                          setBranch({ ...branch, email: e.target.value });
                          setIsValidEmail(validateEmail(e.target.value));
                          setEmail(e.target.value);
                        }}
                        InputProps={{
                          inputProps: {
                            pattern: /^\S+@\S+\.\S+$/,
                          },
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12} sm={12} lg={3}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Name <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Name"
                        value={branch.name}
                        onChange={(e) => {
                          setBranch({ ...branch, name: e.target.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12} lg={3}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Company <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={isAssignBranch?.map(data => ({
                          label: data.company,
                          value: data.company,
                        })).filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                        styles={colourStyles}
                        placeholder={"please select"}
                        value={{ label: branch.company, value: branch.company }}
                        onChange={(e) => {
                          setBranch({ ...branch, company: e.value });
                          setCompCode(e.companycode);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12} lg={3}>
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
                          setBranch((prevSupplier) => ({
                            ...prevSupplier,
                            country: item?.name || "",

                          }));
                          setSelectedStatep("Please Select State")
                          setSelectedCityp("Please Select State")
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12} lg={3}>
                    <FormControl size="small" fullWidth>
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
                          setBranch((prevSupplier) => ({ ...prevSupplier, state: item?.name || "" }));
                          setSelectedCityp("Please Select State")
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item md={6} xs={12} sm={12} lg={6}>
                    <FormControl fullWidth>
                      <Typography>Address</Typography>
                      <TextareaAutosize
                        aria-label="minimum height"
                        minRows={5}
                        value={branch.address}
                        onChange={(e) => {
                          setBranch({ ...branch, address: e.target.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12} lg={3}>
                    <FormControl size="small" fullWidth>
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
                          setBranch((prevSupplier) => ({
                            ...prevSupplier,
                            city: item?.name || "",
                          }));
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12} lg={3}>
                    <FormControl fullWidth size="small">
                      <Typography>Pincode</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        placeholder="Please Enter Pincode"
                        sx={userStyle.input}
                        value={branch.pincode?.slice(0, 6)}
                        onChange={(e) => {
                          setBranch({ ...branch, pincode: e.target.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={2.5} xs={12} sm={6}>
                    <>
                      <Button variant="contained" type="submit">
                        Submit
                      </Button>
                    </>
                  </Grid>
                  <Grid item md={2.5} xs={12} sm={6}>
                    <>
                      <Button sx={userStyle.btncancel} onClick={handleClear} disabled={isBtn}>
                        Clear
                      </Button>
                    </>
                  </Grid>
                </Grid>
              </form>
            </>
          </Box>
          <br />
        </>
      )}
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lbranch") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Branch List </Typography>
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
                    {/* <MenuItem value={branches?.length}>All</MenuItem> */}
                  </Select>
                </Box>
              </Grid>
              <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box>
                  {isUserRoleCompare?.includes("excelbranch") && (
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
                  {isUserRoleCompare?.includes("csvbranch") && (
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
                  {isUserRoleCompare?.includes("printbranch") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfbranch") && (
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
                  {isUserRoleCompare?.includes("imagebranch") && (
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                      {" "}
                      <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                    </Button>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={6} sm={6}>
                <Box>
                  <FormControl fullWidth size="small">
                    <Typography>Search</Typography>
                    <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
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
            {/* {isUserRoleCompare?.includes("bdbranch") && (
              <Button variant="contained" color="error" onClick={handleClickOpenalert}>
                Bulk Delete
              </Button>
            )} */}
            <br />
            <br />
            {!isBranch ? (
              <>
                <Box sx={{ display: "flex", justifyContent: "center" }}>

                  <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
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
                  <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowsWithCheckboxes} columns={columnDataTable.filter((column) => columnVisibility[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true} ref={gridRef} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
                </Box>
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

      {/* ****** Table End ****** */}
      {/* Delete Modal */}
      <Box>
        <>
          <Box>
            {/* ALERT DIALOG */}
            <Dialog open={isDeleteOpen} onClose={handleCloseDel} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
              <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                  Are you sure?
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDel} sx={userStyle.btncancel}>
                  Cancel
                </Button>
                <Button
                  onClick={(e) => {
                    delBranch(branchid);
                    handleCloseDel();
                  }}
                  autoFocus
                  variant="contained"
                  color="error"
                >
                  {" "}
                  OK{" "}
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </>
        {/* ALERT DIALOG */}
      </Box>
      <Box>
        {/* Edit DIALOG */}
        <Dialog open={isEditOpen} onClose={handleCloseModEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md">
          <Box sx={{ padding: "30px" }}>
            <Typography sx={userStyle.SubHeaderText}> Edit Branch</Typography>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={6} sm={12} sx={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Code <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={branchedit.code}
                    placeholder="Please Enter Code"
                    onChange={(e) => {
                      setBranchedit({ ...branchedit, code: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} sm={12} sx={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Asset Code <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Please Enter Asset Code"
                    value={branchedit.assetcode}
                    onChange={(e) => {
                      setBranchedit({ ...branchedit, assetcode: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} sm={12} sx={12}>
                <FormControl fullWidth size="small">
                  <Typography>Phone </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="number"
                    sx={userStyle.input}
                    placeholder="Please Enter Phone Number"
                    value={branchedit.phone?.slice(0, 10)}
                    onChange={(e) => {
                      setBranchedit({ ...branchedit, phone: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} sm={12} sx={12}>
                <FormControl fullWidth size="small">
                  <FormControl fullWidth size="small">
                    <Typography>Email</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="email"
                      placeholder="Please Enter Email"
                      value={branchedit.email}
                      onChange={(e) => {
                        setBranchedit({ ...branchedit, email: e.target.value });
                        setIsValidEmail(validateEmail(e.target.value));
                        setEmail(e.target.value);
                      }}
                      InputProps={{
                        inputProps: {
                          pattern: /^\S+@\S+\.\S+$/,
                        },
                      }}
                    />
                  </FormControl>
                  {errors.email && <div>{errors.email}</div>}
                </FormControl>
              </Grid>
              <br />
              <Grid item md={6} sm={12} sx={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Name <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Please Enter Name"
                    value={branchedit.name}
                    onChange={(e) => {
                      setBranchedit({ ...branchedit, name: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} sm={12} sx={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Company <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    options={isAssignBranch?.map(data => ({
                      label: data.company,
                      value: data.company,
                    })).filter((item, index, self) => {
                      return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                    })}
                    styles={colourStyles}
                    placeholder={"please select"}
                    value={{ label: branchedit.company, value: branchedit.company }}
                    onChange={(e) => {
                      setBranchedit({ ...branchedit, company: e.value });
                      setCompCode(e.companycode);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} sm={12} sx={12}>
                <FormControl fullWidth>
                  <Typography>Address</Typography>
                  <TextareaAutosize
                    aria-label="minimum height"
                    minRows={2}
                    value={branchedit.address}
                    onChange={(e) => {
                      setBranchedit({ ...branchedit, address: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
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
                    value={selectedCountryc}
                    styles={colourStyles}
                    onChange={(item) => {
                      setSelectedCountryc(item);
                      setBranchedit((prevSupplier) => ({ ...prevSupplier, country: item?.name || "" }));
                      setSelectedStatec("Please Select State")
                      setSelectedCityc("Please Select City")
                    }}
                  />

                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
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
                    styles={colourStyles}
                    onChange={(item) => {
                      setSelectedStatec(item);
                      setBranchedit((prevSupplier) => ({ ...prevSupplier, state: item?.name || "" }));
                      setSelectedCityc("Please Select City")
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
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
                    styles={colourStyles}
                    onChange={(item) => {
                      setSelectedCityc(item);
                      setBranchedit((prevSupplier) => ({ ...prevSupplier, city: item?.name || "" }));
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} sm={12} sx={12}>
                <FormControl fullWidth size="small">
                  <Typography>Pincode</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="number"
                    sx={userStyle.input}
                    placeholder="Please Enter Pincode"
                    value={branchedit.pincode?.slice(0, 6)}
                    onChange={(e) => {
                      setBranchedit({ ...branchedit, pincode: e.target.value });
                    }}
                  />
                </FormControl>
                <br />
                <br />
              </Grid>
              <Grid container>
                <br />
                <Grid item md={1}></Grid>
                {isLoading ? (
                  <>
                    <Backdrop sx={{ color: "blue", zIndex: (theme) => theme.zIndex.drawer + 2 }} open={isLoading}>
                      <CircularProgress color="inherit" />
                    </Backdrop>
                  </>
                ) : (
                  <>
                    <Button variant="contained" onClick={editSubmit}>
                      Update
                    </Button>
                    <Grid item md={1}></Grid>
                    <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
                      Cancel
                    </Button>
                  </>
                )}
              </Grid>
            </Grid>
          </Box>
        </Dialog>
      </Box>

      {/* Check delete Modal */}
      <Box>
        <>
          <Box>
            {/* ALERT DIALOG */}
            <Dialog open={isCheckOpen} onClose={handleCloseCheck} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
              <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                  {checkUnit?.length > 0 && checkFloor?.length > 0 && checkUser?.length > 0 && checkBranch?.length > 0 ? (
                    <>
                      <span style={{ fontWeight: "700", color: "#777" }}>{`${deletebranch.name} `}</span>
                      was linked in <span style={{ fontWeight: "700" }}>Unit, Floor,Designation & User</span>
                    </>
                  ) : checkUnit?.length > 0 || checkFloor?.length > 0 || checkUser?.length > 0 || checkBranch?.length > 0 ? (
                    <>
                      <span style={{ fontWeight: "700", color: "#777" }}>{`${deletebranch.name} `}</span>
                      was linked in{" "}
                      <span style={{ fontWeight: "700" }}>
                        {checkUnit?.length ? " Unit" : ""}
                        {checkFloor?.length ? " Floor" : ""}
                        {checkUser?.length ? " User" : ""}
                        {checkBranch?.length ? " Designation" : ""}
                      </span>
                    </>
                  ) : (
                    ""
                  )}
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseCheck} autoFocus variant="contained" color="error">
                  {" "}
                  OK{" "}
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </>
      </Box>

      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
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
        <Table sx={{ minWidth: 700 }} aria-label="simple table" id="branch" ref={componentRef}>
          <TableHead sx={{ fontWeight: "600" }}>
            <TableRow>
              <TableCell>SI.NO</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Code </TableCell>
              <TableCell>Asset Code </TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rowDataTable &&
              rowDataTable.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.name} </TableCell>
                  <TableCell>{row.code} </TableCell>
                  <TableCell>{row.assetcode}</TableCell>
                  <TableCell>{row.company}</TableCell>
                  <TableCell>
                    {row.address}
                  </TableCell>
                  <TableCell>{row.phone} </TableCell>
                  <TableCell>{row.email}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* view model */}
      <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" fullWidth={true}>
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> View Branch</Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Company</Typography>
                  <Typography>{branchedit.company}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Name</Typography>
                  <Typography>{branchedit.name}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Code</Typography>
                  <Typography>{branchedit.code}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Assetcode</Typography>
                  <Typography>{branchedit.assetcode}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Address</Typography>
                  <Typography>{branchedit.address}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Country</Typography>
                  <Typography>{branchedit.country}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">State</Typography>
                  <Typography>{branchedit.state}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">City</Typography>
                  <Typography>{branchedit.city}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Pincode</Typography>
                  <Typography>{branchedit.pincode}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Phone Number</Typography>
                  <Typography>{branchedit.phone}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Email</Typography>
                  <Typography>{branchedit.email}</Typography>
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
            {isLoading ? (
              <>
                <Backdrop sx={{ color: "blue", zIndex: (theme) => theme.zIndex.drawer + 2 }} open={isLoading}>
                  <CircularProgress color="inherit" />
                </Backdrop>
              </>
            ) : (
              <>
                <Grid>
                  <Button
                    variant="contained"
                    style={{
                      padding: "7px 13px",
                      color: "white",
                      background: "rgb(25, 118, 210)",
                    }}
                    onClick={() => {
                      sendRequestEdit();
                      handleCloseerrpop();
                    }}
                  >
                    ok
                  </Button>
                </Grid>
              </>
            )}
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
              onClick={handleCloseerrpop}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* this is info view details */}

      <Dialog open={openInfo} onClose={handleCloseinfo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> Branch Info</Typography>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">addedby</Typography>
                  <Table>
                    <TableHead>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"UserName"}</StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                    </TableHead>
                    <TableBody>
                      {addedby?.map((item, i) => (
                        <StyledTableRow>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Updated by</Typography>
                  <Table>
                    <TableHead>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"UserName"}</StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                    </TableHead>
                    <TableBody>
                      {updateby?.map((item, i) => (
                        <StyledTableRow>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
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
        <Dialog open={isDeleteOpencheckbox} onClose={handleCloseModcheckbox} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
            <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
              Are you sure?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
              Cancel
            </Button>
            <Button autoFocus variant="contained" color="error" onClick={(e) => delBranchcheckbox(e)}>
              {" "}
              OK{" "}
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
            <Button autoFocus variant="contained" color="error" onClick={handleCloseModalert}>
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>


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
          {fileFormat === "csv" ? (
            <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
          ) : (
            <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
          )}

          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Choose Export
          </Typography>
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

    </>
  );
};

export default Branch;