import CloseIcon from "@mui/icons-material/Close";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import LastPageIcon from "@mui/icons-material/LastPage";
import Selects from "react-select";
import { StyledTableRow, StyledTableCell } from "../../../../components/Table";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,Table,TableHead, TableBody, TableContainer,Paper,
  TableRow,
  TableCell,
  DialogContent,
  FormControl,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Popover,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import moment from "moment";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { useReactToPrint } from "react-to-print";
import Headtitle from "../../../../components/Headtitle";
import StyledDataGrid from "../../../../components/TableStyle";
import { UserRoleAccessContext } from "../../../../context/Appcontext";
import { AuthContext } from "../../../../context/Appcontext.js";
import { userStyle, colourStyles } from "../../../../pageStyle";
import { SERVICE } from "../../../../services/Baseservice.js";
import { handleApiError } from "../../../../components/Errorhandling";
import { useParams } from "react-router-dom";

import AlertDialog from "../../../../components/Alert";
import ExportData from "../../../../components/ExportData";
import MessageAlert from "../../../../components/MessageAlert";

function AssignmanualsalarydetailsLog() {
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
    "Exp mode",
    "Date",
    "Salary Code",
    "Gross Salary",
    "Basic",
    "Hra",
    "Conveyance",
    "Medcal Allowance",
    "Production Allowance",
    "Production Allowancetwo",
    "Other Allowance",
    "Esi Deduction",
    "Pfd Eduction",
    "Start Date",
    "Created At",
  ];
  let exportRowValues = [
    "mode",
    "date",
    "salarycode",
    "gross",
    "basic",
    "hra",
    "conveyance",
    "medicalallowance",
    "productionallowance",
    "productionallowancetwo",
    "otherallowance",
    "esideduction",
    "pfdeduction",
    "startdate",
    "createdat",
  ];

  let ids = useParams().id;

  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");

  const [teamsArray, setTeamsArray] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [loader, setLoader] = useState(false);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const ModeOpt = [
    { label: "Manual", value: "Manual" },
    { label: "Auto", value: "Auto" },
  ];
  
  // info
  const [openInfo, setOpenInfo] = useState(false);
  const [infoDetails, setInfoDetails] = useState({});
  const handleCloseinfo = () => {
    setOpenInfo(false);
  };
  const handleOpeninfo = () => {
    setOpenInfo(true);
  };
   //view
   const [openview, setOpenView] = useState(false);
   const [viewDetails, setViewDetails] = useState({});
   const handleCloseView = () => {
     setOpenView(false);
   };
   const handleOpenView = () => {
     setOpenView(true);
   };
   const [ctc, setCtc] = useState("");
   const [salarySlabOpt, setSalarySlabOpt] = useState([]);
   const [expDptDates, setExpDptDates] = useState([]);
   const [isLastLog, setIsLastLog] = useState(false);
   const [editDetails, setEditDetails] = useState({});
  const [editDetailsOld, setEditDetailsOld] = useState({});
   const [deleteionId, setDeletionId] = useState({});
    //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleOpenDelete = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseDelete = () => {
    setIsDeleteOpen(false);
  };
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleOpenEdit = () => {
    setIsEditOpen(true);
    setCtc("");
  };
  const handleCloseEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    setEditDetails({});
    setEditDetailsOld({});
    setCtc("");
  };
  //change form
  const handleChangeGross = (e) => {
    const regex = /^[0-9]+$/; // Only allows positive integers
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setEditDetails({
        ...editDetails,
        gross: inputValue,
        basic: "",
        hra: "",
        conveyance: "",
        medicalallowance: "",
        productionallowance: "",
        productionallowancetwo: "",
        otherallowance: "",
      });
    }
  };

  //change form
  const handleChangeBasic = (e) => {
    const regex = /^[0-9]+$/; // Only allows positive integers
    // const regex = /^\d*\.?\d*$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setEditDetails({
        ...editDetails,
        basic: inputValue,
        gross:
          Number(e.target.value) +
          Number(editDetails.hra) +
          Number(editDetails.conveyance) +
          Number(editDetails.medicalallowance) +
          Number(editDetails.productionallowance) +
          Number(editDetails.productionallowancetwo) +
          Number(editDetails.otherallowance),
      });
    }
  };

  //change form
  const handleChangeHra = (e) => {
    const regex = /^[0-9]+$/; // Only allows positive integers
    // const regex = /^\d*\.?\d*$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setEditDetails({
        ...editDetails,
        hra: e.target.value,
        gross:
          Number(e.target.value) +
          Number(editDetails.basic) +
          Number(editDetails.conveyance) +
          Number(editDetails.medicalallowance) +
          Number(editDetails.productionallowance) +
          Number(editDetails.productionallowancetwo) +
          Number(editDetails.otherallowance),
      });
    }
  };

  //change form
  const handleChangeConveyance = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setEditDetails({
        ...editDetails,
        conveyance: e.target.value,
        gross:
          Number(e.target.value) +
          Number(editDetails.basic) +
          Number(editDetails.hra) +
          Number(editDetails.medicalallowance) +
          Number(editDetails.productionallowance) +
          Number(editDetails.productionallowancetwo) +
          Number(editDetails.otherallowance),
      });
    }
  };
  //change form
  const handleChangeMedAllow = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setEditDetails({
        ...editDetails,
        medicalallowance: inputValue,
        gross:
          Number(e.target.value) +
          Number(editDetails.hra) +
          Number(editDetails.conveyance) +
          Number(editDetails.basic) +
          Number(editDetails.productionallowance) +
          Number(editDetails.productionallowancetwo) +
          Number(editDetails.otherallowance),
      });
    }
  };

  //change form
  const handleChangeProdAllow = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setEditDetails({
        ...editDetails,
        productionallowance: inputValue,
        gross:
          Number(e.target.value) +
          Number(editDetails.basic) +
          Number(editDetails.hra) +
          Number(editDetails.conveyance) +
          Number(editDetails.medicalallowance) +
          Number(editDetails.medicalallowance) +
          Number(editDetails.productionallowancetwo) +
          Number(editDetails.otherallowance),
      });
    }
  };

  //change form
  const handleChangeProdAllowtwo = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setEditDetails({
        ...editDetails,
        productionallowancetwo: inputValue,
        gross:
          Number(e.target.value) +
          Number(editDetails.basic) +
          Number(editDetails.hra) +
          Number(editDetails.conveyance) +
          Number(editDetails.medicalallowance) +
          Number(editDetails.medicalallowance) +
          Number(editDetails.productionallowance) +
          Number(editDetails.otherallowance),
      });
    }
  };
  //change form
  const handleChangeOtherAllow = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value;

    if (regex.test(inputValue) || inputValue === "") {
      setEditDetails({
        ...editDetails,
        otherallowance: inputValue,
        gross:
          Number(e.target.value) +
          Number(editDetails.basic) +
          Number(editDetails.hra) +
          Number(editDetails.conveyance) +
          Number(editDetails.medicalallowance) +
          Number(editDetails.medicalallowance) +
          Number(editDetails.productionallowance) +
          Number(editDetails.productionallowancetwo),
      });
    }
  };
  const fetchProfessionalTax = async (process, salarycode) => {
    try {
      let res_freq = await axios.get(SERVICE.SALARYSLAB_PROCESS_FILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        process: process,
      });
      const OptSlaball = res_freq?.data?.salaryslab;
      const OptSlab = res_freq?.data?.salaryslab.filter((slab) => {
        return slab.salarycode === salarycode;
      });
      setEditDetails({
        ...editDetails,
        ...OptSlab[0]
      });
      setSalarySlabOpt(OptSlaball);
      setCtc(
        OptSlab[0].basic +
          OptSlab[0].hra +
          OptSlab[0].conveyance +
          OptSlab[0].medicalallowance +
          OptSlab[0].productionallowance +
          OptSlab[0].productionallowancetwo +
          OptSlab[0].otherallowance
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
   //get all employees list details
   const fetchDepartmentMonthsets = async () => {
    try {
      let res = await axios.get(SERVICE.DEPMONTHSET_ALL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setExpDptDates(res?.data?.departmentdetails);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  useEffect(() => {
    fetchDepartmentMonthsets();
  }, []);
  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    mode: true,
    date: true,
    salarycode: true,
    gross: true,
    basic: true,
    hra: true,
    conveyance: true,
    medicalallowance: true,
    productionallowance: true,
    productionallowancetwo: true,
    otherallowance: true,
    esideduction: true,
    pfdeduction: true,
    startdate: true,
    enddate: true,
    createdat: true,
    actions:true,
    updatename: true,

  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  //useEffect
  useEffect(() => {
    addSerialNumber();
  }, [teamsArray]);

  useEffect(() => {
    getAssiignmanualData();
  }, []);
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

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };
  const [useData, setUserData] = useState({});
  //get all Asset Variant name.
  const getAssiignmanualData = async () => {
    try {
      setLoader(true);
      let response = await axios.get(`${SERVICE.USER_SINGLE}/${ids}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setUserData(response?.data?.suser);

      setTeamsArray(
        response?.data?.suser.assignExpLog?.filter(
          (data) => data?.expmode === "Manual" || data?.expmode === "Auto"
        )
      );
      setLoader(false);
    } catch (err) {
      setLoader(false);
      let error = err.response?.data?.message;
      if (error) {
        setPopupContentMalert(error);
        setPopupSeverityMalert("error");
        handleClickOpenPopupMalert();
      } else {
        handleApiError(err, setShowAlert, handleClickOpenerr);
      }
    }
  };
  const sendEditRequest = async () => {
    try {

        await axios.put(
          `${SERVICE.UPDATEANYLOG}/?logid=${editDetails?.id}&logname=assignExpLog`,
          {
            type:editDetails.mode,
            expmode: editDetails.mode,
            salarycode: editDetails.salarycode,
            endexp: "No",
            endexpdate: "",
            endtar: "No",
            endtardate: "",
            basic: String(editDetails.basic),
            hra: String(editDetails.hra),
            conveyance: String(editDetails.conveyance),
            gross: String(editDetails.gross),
            medicalallowance: String(editDetails.medicalallowance),
            productionallowance: String(editDetails.productionallowance),
            otherallowance: String(editDetails.otherallowance),
            productionallowancetwo: String(editDetails.productionallowancetwo),
            pfdeduction: Boolean(editDetails.pfdeduction),
            esideduction: Boolean(editDetails.esideduction),
            ctc: String(ctc),
            updatedate: String(editDetails.updatedate),
            updatename: String(isUserRoleAccess.companyname),
            date: String(new Date()),
            startmonth: String(editDetails?.startmonth),
            endmonth: String(""),
            startyear: String(editDetails?.startyear),
            endyear: String(""),
  
          },
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          }
        );
  
        await getAssiignmanualData();
  
        handleCloseEdit();
        setShowAlert(
          <>
            <CheckCircleOutlineIcon
              sx={{ fontSize: "100px", color: "#7AC767" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Updated Successfully"}
            </p>
          </>
        );
        handleClickOpenerr();
      
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const handleDeleteLog = async () => {
    await axios.delete(
      `${SERVICE.DELETEANYLOG}/?logid=${deleteionId?.id}&logname=assignExpLog`,
      {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      }
    );
    await getAssiignmanualData();
    setPage(1);
    handleCloseDelete();
    setShowAlert(
      <>
        <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7AC767" }} />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>
          {"Deleted Successfully"}
        </p>
      </>
    );
    handleClickOpenerr();
  };

  const editSubmit = (e) => {
    e.preventDefault();

    // Check if there are any changes
    const isChanged = Object.keys(editDetails).some(
      (key) => editDetails[key] !== editDetailsOld[key]
    );
    if (
      editDetails.mode === "Auto" &&
      (editDetails.startdate === "" || editDetails.startdate === undefined)
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Start Date"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      editDetails.startdate === "" ||
      editDetails.startdate === undefined
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Start Date"}
          </p>
        </>
      );
      handleClickOpenerr();
    }else if (editDetails.mode === "Manual" && editDetails.gross === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Gross amount"}
          </p>
        </>
      );
      handleClickOpenerr();
    }else if (!isChanged) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"No Changes to Update"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendEditRequest();
    }
  };
  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Assign Manual Salary Details Log.png");
        });
      });
    }
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Assign Manual Salary Details Log",
    pageStyle: "print",
  });

  const getMonthName = (monthNumber) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    if (monthNumber) {
      return monthNames[monthNumber - 1];
    } else {
      return "";
    }
  };
  //serial no for listing items
  const addSerialNumber = () => {
    const itemsWithSerialNumber = teamsArray?.map((item, index) => {
      return {
        ...item,
        serialNumber: index + 1,
        mode: item?.expmode,
        date: moment(item?.updatedate).format("DD-MM-YYYY"),
        salarycode: item?.salarycode,
        gross: item?.gross,
        basic: item?.basic,
        hra: item?.hra,
        conveyance: item?.conveyance,
        medicalallowance: item?.medicalallowance,
        productionallowance: item?.productionallowance,
        productionallowancetwo: item?.productionallowancetwo,
        otherallowance: item?.otherallowance,
        esideduction: item?.esideduction ? "Yes" : "No",
        pfdeduction: item?.pfdeduction ? "Yes" : "No",
        startdate: `${getMonthName(item?.startmonth)} ${item?.startyear ?? ""}`,
        enddate: `${getMonthName(item?.endmonth)} ${item?.endyear ?? ""}`,
        createdat: moment(item?.date)?.format("DD-MM-YYYY hh:mm A"),
        updatename: item.updatename,
        updatedate:item.updatedate
      };
    });
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
      width: 100,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "mode",
      headerName: "Exp Mode",
      flex: 0,
      width: 120,
      hide: !columnVisibility.mode,
      headerClassName: "bold-header",
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0,
      width: 120,
      hide: !columnVisibility.date,
      headerClassName: "bold-header",
    },
    {
      field: "salarycode",
      headerName: "Salary Code",
      flex: 0,
      width: 100,
      hide: !columnVisibility.salarycode,
      headerClassName: "bold-header",
    },
    {
      field: "gross",
      headerName: "Gross Salary",
      flex: 0,
      width: 100,
      hide: !columnVisibility.gross,
      headerClassName: "bold-header",
    },
    {
      field: "basic",
      headerName: "Basic",
      flex: 0,
      width: 100,
      hide: !columnVisibility.basic,
      headerClassName: "bold-header",
    },
    {
      field: "hra",
      headerName: "HRA",
      flex: 0,
      width: 100,
      hide: !columnVisibility.hra,
      headerClassName: "bold-header",
    },
    {
      field: "conveyance",
      headerName: "Conveyance",
      flex: 0,
      width: 100,
      hide: !columnVisibility.conveyance,
      headerClassName: "bold-header",
    },
    {
      field: "medicalallowance",
      headerName: "Medcal Allowance",
      flex: 0,
      width: 120,
      hide: !columnVisibility.medicalallowance,
      headerClassName: "bold-header",
    },
    {
      field: "productionallowance",
      headerName: "Production Allowance",
      flex: 0,
      width: 120,
      hide: !columnVisibility.productionallowance,
      headerClassName: "bold-header",
    },
    {
      field: "productionallowancetwo",
      headerName: "Production Allowance2",
      flex: 0,
      width: 120,
      hide: !columnVisibility.productionallowancetwo,
      headerClassName: "bold-header",
    },
    {
      field: "otherallowance",
      headerName: "Other Allowance",
      flex: 0,
      width: 120,
      hide: !columnVisibility.otherallowance,
      headerClassName: "bold-header",
    },
    {
      field: "esideduction",
      headerName: "ESI deduction",
      flex: 0,
      width: 120,
      hide: !columnVisibility.esideduction,
      headerClassName: "bold-header",
    },
    {
      field: "pfdeduction",
      headerName: "PF deduction",
      flex: 0,
      width: 120,
      hide: !columnVisibility.pfdeduction,
      headerClassName: "bold-header",
    },
    {
      field: "startdate",
      headerName: "Start Date",
      flex: 0,
      width: 120,
      hide: !columnVisibility.startdate,
      headerClassName: "bold-header",
    },

    {
      field: "createdat",
      headerName: "Created At",
      flex: 0,
      width: 120,
      hide: !columnVisibility.createdat,
      headerClassName: "bold-header",
    },
    {
      field: "updatename",
      headerName: "Added By",
      flex: 0,
      width: 120,
      hide: !columnVisibility.updatename,
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
      renderCell: (params) => {
        return (
          <>
            {params?.row?.index === 0 ? (
              ""
            ) : (
              <Grid sx={{ display: "flex" }}>
                {isUserRoleCompare?.includes("eassignmanualsalarydetails") && (
                  <>
                    <Button
                      size="small"
                      sx={userStyle.buttondelete}
                      onClick={(e) => {
                        
                        setEditDetails(params.row);
                        setEditDetailsOld(params.row);
                        setIsLastLog(params?.row?.index === items?.length - 1);
                        handleOpenEdit();
                      }}
                    >
                      <EditOutlinedIcon style={{ fontsize: "large" }} />
                    </Button>
                  </>
                )}
                {isUserRoleCompare?.includes("dassignmanualsalarydetails") && (
                  <>
                    <Button
                      size="small"
                      sx={userStyle.buttondelete}
                      onClick={(e) => {
                        handleOpenDelete();
                        setDeletionId(params.row);
                        setIsLastLog(params?.row?.index === items?.length - 1);
                      }}
                    >
                      <DeleteOutlineOutlinedIcon
                        style={{ fontsize: "large" }}
                      />
                    </Button>
                  </>
                )}
              </Grid>
            )}
            <Grid sx={{ display: "flex" }}>
              {isUserRoleCompare?.includes("vassignmanualsalarydetails") && (
                <>
                  <Button
                    size="small"
                    sx={userStyle.buttondelete}
                    onClick={(e) => {
                      handleOpenView();
                      setViewDetails(params.row);
                    }}
                  >
                    <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
                  </Button>
                </>
              )}
              {isUserRoleCompare?.includes("iassignmanualsalarydetails") &&
                params?.row?.logeditedby?.length > 0 && (
                  <>
                    <Button
                      size="small"
                      sx={userStyle.buttondelete}
                      onClick={(e) => {
                        handleOpeninfo();
                        setInfoDetails(params.row);
                      }}
                    >
                      <InfoOutlinedIcon style={{ fontsize: "large" }} />
                    </Button>
                  </>
                )}
            </Grid>
          </>
        );
      },
    },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    const mondatefilter = item.updatedate?.split("-");
    const getmonth = mondatefilter[1] === '12' ? "December" : mondatefilter[1] === '11' ? "November" : mondatefilter[1] === '10' ? "October" : mondatefilter[1] === '09'  ? "September" :  mondatefilter[1] === '9' ? "September" : mondatefilter[1] === '08'  ? "August" : mondatefilter[1] ===  '8' ? "August" : mondatefilter[1] === '07' ? "July" : mondatefilter[1] === '7' ? "July" : mondatefilter[1] === '06'  ? "June" : mondatefilter[1] ===  '6' ? "June" : mondatefilter[1] === '05' ? "May" : mondatefilter[1] === '5' ? "May" : mondatefilter[1] === '04'  ? "April" : mondatefilter[1] ===  '4' ? "April" : mondatefilter[1] === '03' ? "March" : mondatefilter[1] === '3' ? "March": mondatefilter[1] === '02' ? 'February' : mondatefilter[1] === '2' ? 'February' : mondatefilter[1] === '01'  ? "January" : mondatefilter[1] === '1' ? "January" : "";  
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      startmonthlabel: getmonth,
      startmonth: mondatefilter[1],
      startyear: mondatefilter[0],
      mode: item?.mode,
      date: item?.date,
      salarycode: item?.salarycode,
      gross: item?.gross,
      basic: item?.basic,
      hra: item?.hra,
      conveyance: item?.conveyance,
      medicalallowance: item?.medicalallowance,
      productionallowance: item?.productionallowance,
      productionallowancetwo: item?.productionallowancetwo,
      otherallowance: item?.otherallowance,
      esideduction: item?.esideduction,
      pfdeduction: item?.pfdeduction,
      startdate: item?.startdate,
      enddate: item?.enddate,
      updatedate: item?.updatedate,
      updatename: item.updatename,
      createdat: item?.createdat,
      index: index,
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
      <Headtitle title={"Assign Manual Salary Details Log"} />
      {/* ****** Header Content ****** */}

      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lassignmanualsalarydetails") && (
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
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  Assign Manual Salary Details Log List
                </Typography>
              </Grid>
              <br />
              <Grid item md={3} xs={12} sm={12}>
                <Typography sx={userStyle.importheadtext}>
                  <b>Employee Name :</b> {useData?.companyname}
                </Typography>
              </Grid>
              <br />
              <Grid item md={3} xs={12} sm={12}>
                <Typography sx={userStyle.importheadtext}>
                  <b>Employee Code :</b> {useData?.empcode}
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
                      {/* <MenuItem value={teamsArray?.length}>
                      All
                    </MenuItem> */}
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
                    {isUserRoleCompare?.includes("excelassignmanualsalarydetails") && (
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
                    {isUserRoleCompare?.includes("csvassignmanualsalarydetails") && (
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
                    {isUserRoleCompare?.includes("printassignmanualsalarydetails") && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("pdfassignmanualsalarydetails") && (
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
                    {isUserRoleCompare?.includes("imageassignmanualsalarydetails") && (
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
      {/* INFO */}
      <Dialog
        open={openInfo}
        onClose={handleCloseinfo}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              Department Log Edited By
            </Typography>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Edited by</Typography>
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
                      {infoDetails?.logeditedby?.map((item, i) => (
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
                            {item.username}
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
              <Button
                variant="contained"
                onClick={handleCloseinfo}
                sx={{ marginLeft: "15px" }}
              >
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleCloseView}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
      >
         <DialogContent>
          <Grid container spacing={2}>
            <Grid item md={12} sm={12} xs={12}>
              <Typography sx={userStyle.HeaderText}>
              Assign Manual Salary Details Log List View <b style={{color:'red'}}></b>
              </Typography>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Exp Mode</Typography>
                <Typography><b>{viewDetails?.mode}</b></Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Date</Typography>
                <Typography><b>{viewDetails?.date}</b></Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Salary Code</Typography>
                <Typography><b>{viewDetails?.salarycode}</b></Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Gross Salary</Typography>
                <Typography><b>{viewDetails?.gross}</b></Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Basic</Typography>
                <Typography><b>{viewDetails?.basic}</b></Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>HRA</Typography>
                <Typography><b>{viewDetails?.hra}</b></Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Exp Mode</Typography>
                <Typography><b>{viewDetails?.mode}</b></Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Conveyance</Typography>
                <Typography><b>{viewDetails?.conveyance}</b></Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Medcal Allowance</Typography>
                <Typography><b>{viewDetails?.medicalallowance}</b></Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Exp Mode</Typography>
                <Typography><b>{viewDetails?.mode}</b></Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Production Allowance</Typography>
                <Typography><b>{viewDetails?.productionallowance}</b></Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Production Allowance2</Typography>
                <Typography><b>{viewDetails?.productionallowancetwo}</b></Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Other Allowance</Typography>
                <Typography><b>{viewDetails?.otherallowance}</b></Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>ESI deduction</Typography>
                <Typography><b>{viewDetails?.esideduction}</b></Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>PF deduction</Typography>
                <Typography><b>{viewDetails?.pfdeduction}</b></Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Start Date</Typography>
                <Typography><b>{viewDetails?.startdate}</b></Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Created At</Typography>
                <Typography><b>{viewDetails?.createdat}</b></Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Created By</Typography>
                <Typography><b>{viewDetails?.updatename}</b></Typography>
              </FormControl>
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
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
                  onClick={() => {
                    handleCloseView();
                  }}
                >
                  Back
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      {/* Edit DIALOG */}
      <Dialog
        open={isEditOpen}
        onClose={handleCloseEdit}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="lg"
        sx={{
          overflow: "visible",
          "& .MuiPaper-root": {
            overflow: "visible",
          },
        }}
      >
        <Box sx={{ padding: "20px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              Edit Assign Manual Salary Details Log List
            </Typography>
            <br></br>
            <Grid container spacing={2}>
                <Grid item md={3} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Mode<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      styles={colourStyles}
                      options={ModeOpt}
                      value={{
                        label: editDetails.mode,
                        value: editDetails.mode,
                      }}
                      onChange={(e) => {
                        console.log(e.value,'es')
                        setEditDetails({
                          ...editDetails,
                          mode: e.value,
                          salarycode: e.value == "Manual" ? "MANUAL" : "",
                        });
                        if (e.value === "Auto") {
                          setEditDetails({
                            ...editDetails,
                            mode: e.value,
                            salarycode:"",
                            gross: "",
                            basic: "",
                            hra: "",
                            conveyance: "",
                            medicalallowance: "",
                            productionallowance: "",
                            productionallowancetwo: "",
                            otherallowance: "",
                            pfdeduction:"", esideduction:""
                          });
                        } 
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid
                  item
                  md={3} sm={6} xs={12}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Typography>
                    Date<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth>
                    <Selects
                      maxMenuHeight={250}
                      styles={{
                        menu: (provided) => ({
                          ...provided,
                          maxHeight: 200, // Adjust the max height of the menu base
                        }),
                        menuList: (provided) => ({
                          ...provided,
                          maxHeight: 200, // Adjust the max height of the menu option list
                        }),
                      }}
                      options={expDptDates
                        .filter((d) =>
                          editDetails.updatedate !== undefined ||
                        editDetails.updatedate !== "" ||
                        editDetails.updatedate != "undefined" // Problematic part
                            ? d.department === useData?.department &&
                              d.fromdate >= editDetails.updatedate
                            : d.department === useData?.department
                        )
                        .map((item) => ({
                          ...item,
                          label: item.fromdate,
                          value: item.fromdate,
                        }))}
                      value={{
                        label: editDetails.updatedate,
                        value: editDetails.updatedate,
                      }}
                      onChange={(e) => {
                        const mondatefilter = e?.value?.split("-");
                        const getmonth = mondatefilter[1] === '12' ? "December" : mondatefilter[1] === '11' ? "November" : mondatefilter[1] === '10' ? "October" : mondatefilter[1] === '09'  ? "September" :  mondatefilter[1] === '9' ? "September" : mondatefilter[1] === '08'  ? "August" : mondatefilter[1] ===  '8' ? "August" : mondatefilter[1] === '07' ? "July" : mondatefilter[1] === '7' ? "July" : mondatefilter[1] === '06'  ? "June" : mondatefilter[1] ===  '6' ? "June" : mondatefilter[1] === '05' ? "May" : mondatefilter[1] === '5' ? "May" : mondatefilter[1] === '04'  ? "April" : mondatefilter[1] ===  '4' ? "April" : mondatefilter[1] === '03' ? "March" : mondatefilter[1] === '3' ? "March": mondatefilter[1] === '02' ? 'February' : mondatefilter[1] === '2' ? 'February' : mondatefilter[1] === '01'  ? "January" : mondatefilter[1] === '1' ? "January" : "";  
                        setEditDetails({ ...editDetails, startmonthlabel:getmonth, startmonth: mondatefilter[1], startyear:mondatefilter[0], updatedate: e.value, date: e.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={6} xs={12}>
                  {editDetails.mode === "Manual" ? (
                    <FormControl fullWidth size="small">
                      <Typography>
                        Salary Code <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Salary Code"
                        value={editDetails.salarycode}
                      />
                    </FormControl>
                  ) : (
                    <FormControl fullWidth size="small">
                      <Typography>Salary Code</Typography>
                      <Selects
                      isDisabled
                        options={salarySlabOpt
                          .filter(
                            (item) =>
                              item.processqueue === useData.process
                          )
                          .map((sc) => ({
                            ...sc,
                            value: sc.salarycode,
                            label: sc.salarycode,
                          }))}
                        value={{
                          label: editDetails.salarycode,
                          value: editDetails.salarycode,
                        }}
                        onChange={(e) => {
                          setEditDetails({
                            ...editDetails,
                            salarycode: e.value,
                          });
                          fetchProfessionalTax(e.process, e.value);
                        }}
                      />
                    </FormControl>
                  )}
                </Grid>
                <>
                  <Grid item md={3} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Start Month <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={editDetails.startmonthlabel}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        {" "}
                        Start Year <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={editDetails.startyear}
                       />
                    </FormControl>
                  </Grid>
                </>
                {/* )} */}
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Gross Salary <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={editDetails.mode === "Auto"}
                      placeholder="Please Enter Gross"
                      value={editDetails.gross}
                      onChange={handleChangeGross}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Basic</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={editDetails.mode === "Auto"}
                      placeholder="Please Enter Basic"
                      value={editDetails.basic}
                      onChange={handleChangeBasic}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>HRA</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={editDetails.mode === "Auto"}
                      placeholder="Please Enter HRA"
                      value={editDetails.hra}
                      onChange={handleChangeHra}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Conveyance</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={editDetails.mode === "Auto"}
                      placeholder="Please Enter Conveyance"
                      value={editDetails.conveyance}
                      onChange={handleChangeConveyance}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Medical Allowance</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={editDetails.mode === "Auto"}
                      placeholder="Please Enter Medical Allowance"
                      value={editDetails.medicalallowance}
                      onChange={handleChangeMedAllow}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Production Allowance</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={editDetails.mode === "Auto"}
                      placeholder="Please Enter Production Allowance"
                      value={editDetails.productionallowance}
                      onChange={handleChangeProdAllow}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Production Allowance 2</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={editDetails.mode === "Auto"}
                      placeholder="Please Enter Production Allowance 2"
                      value={editDetails.productionallowancetwo}
                      onChange={handleChangeProdAllowtwo}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Other Allowance</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={editDetails.mode === "Auto"}
                      placeholder="Please Enter Other Allowance"
                      value={editDetails.otherallowance}
                      onChange={handleChangeOtherAllow}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={12}></Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Checkbox
                      sx={{ height: "20", padding: "0  25px" }}
                      checked={editDetails.esideduction}
                      disabled={editDetails.mode === "Auto"}
                      onChange={(e) => {
                        setEditDetails({
                          ...editDetails,
                          esideduction: e.target.checked,
                        });
                      }}
                    />
                    <Typography>ESI Deduction</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Checkbox
                      sx={{ height: "20", padding: "0  25px" }}
                      checked={editDetails.pfdeduction}
                      disabled={editDetails.mode === "Auto"}
                      onChange={(e) => {
                        setEditDetails({
                          ...editDetails,
                          pfdeduction: e.target.checked,
                        });
                      }}
                    />
                    <Typography>PF Deduction</Typography>
                  </FormControl>
                </Grid>
              </Grid>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <Button
                  variant="contained"
                  style={{
                    padding: "7px 13px",
                    color: "white",
                    background: "rgb(25, 118, 210)",
                  }}
                  onClick={editSubmit}
                >
                  Update
                </Button>
              </Grid>
              <Grid item md={6} xs={6} sm={6}>
                <Button sx={userStyle.btncancel} onClick={handleCloseEdit}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </>
        </Box>
      </Dialog>

      {/* ALERT DIALOG */}
      <Dialog
        open={isDeleteOpen}
        onClose={handleCloseDelete}
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
            Are you sure?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} sx={userStyle.btncancel}>
            Cancel
          </Button>
          <Button
            autoFocus
            variant="contained"
            color="error"
            onClick={(e) => handleDeleteLog(deleteionId)}
          >
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>
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
        filename={"Assign Manual Salary Details Log"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />

      {/* EXTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}

export default AssignmanualsalarydetailsLog;