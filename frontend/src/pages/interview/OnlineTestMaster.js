import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  Dialog,
  TableCell,
  Select,
  MenuItem,
  TableRow,
  DialogContent,
  TableBody,
  DialogActions,
  FormControl,
  Grid,
  Paper,
  Table,
  TableHead,
  TableContainer,
  Button,
  List,
  ListItem,
  ListItemText,
  Popover,
  Checkbox,
  TextField,
  IconButton,
} from "@mui/material";
import { userStyle, colourStyles } from "../../pageStyle";
import StyledDataGrid from "../../components/TableStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import { handleApiError } from "../../components/Errorhandling";
import { SERVICE } from "../../services/Baseservice";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Selects from "react-select";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import moment from "moment-timezone";
import LoadingButton from "@mui/lab/LoadingButton";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";

function OnlineTestmaster() {
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
        filteredData?.map((item, index) => ({
          SNo: index + 1,
          Category: item?.category,
          Subcategory: item.subcategory,
          TestName: item.testname,
          Type: item.type,
          QuestionCount: item.questioncount,
          CountFrom: item.countfrom,
          CountTo: item.countto,
          Totalmarks: item.totalmarks,
        })),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        items?.map((item, index) => ({
          SNo: index + 1,
          Category: item?.category,
          Subcategory: item.subcategory,
          TestName: item.testname,
          Type: item.type,
          QuestionCount: item.questioncount,
          CountFrom: item.countfrom,
          CountTo: item.countto,
          Totalmarks: item.totalmarks,
        })),
        fileName
      );
    }

    setIsFilterOpen(false);
  };

  //  PDF
  const columns = [
    { title: "Category", field: "category" },
    { title: "SubCategory", field: "subcategory" },
    { title: "Test Name", field: "testname" },
    { title: "Type", field: "type" },
    { title: "Question Count", field: "questioncount" },
    { title: "Count From", field: "countfrom" },
    { title: "Count To", field: "countto" },
    { title: "Total Marks", field: "totalmarks" },
  ];

  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();
    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" }, // Serial number column
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial =
      isfilter === "filtered"
        ? filteredData?.map((item, index) => ({
          serialNumber: index + 1,
          category: item?.category,
          subcategory: item.subcategory,
          testname: item.testname,
          type: item.type,
          questioncount: item.questioncount,
          countfrom: item.countfrom,
          countto: item.countto,
          totalmarks: item.totalmarks,
        }))
        : items?.map((item, index) => ({
          serialNumber: index + 1,
          category: item?.category,
          subcategory: item.subcategory,
          testname: item.testname,
          type: item.type,
          questioncount: item.questioncount,
          countfrom: item.countfrom,
          countto: item.countto,
          totalmarks: item.totalmarks,
        }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: 5 },
    });

    doc.save("OnlineTestmaster.pdf");
  };

  const [onlineTestmaster, setOnlineTestmaster] = useState({
    testname: "",
    questioncount: "",
    countfrom: "",
    countto: "",
    totalmarks: 0,
  });
  const [type, setType] = useState("Please Select Type");
  const [typeEdit, setTypeEdit] = useState("Please Select Type");
  const [onlineTestmasterEdit, setOnlineTestmasterEdit] = useState({});
  const { isUserRoleAccess } = useContext(UserRoleAccessContext);
  const [onlineTestMasters, setOnlineTestMasters] = useState([]);
  const [allCompanyedit, setAllCompanyedit] = useState([]);

  const { isUserRoleCompare } = useContext(UserRoleAccessContext);
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("Please Select Category");
  const [subCategory, setSubCategory] = useState("Please Select SubCategory");
  const [categoryEdit, setCategoryEdit] = useState("Please Select Category");
  const [oldDataCheck, setOldDataCheck] = useState({});
  const [trainingDetailsData, setTrainingDetailsData] = useState(0)
  const [trainingDetailsDataUpdate, setTrainingDetailsDataUpdate] = useState(0)
  const [trainingForUserData, setTrainingForUserData] = useState(0)
  const [subCategoryEdit, setSubCategoryEdit] = useState(
    "Please Select SubCategory"
  );
  const [categoryOption, setCategoryOption] = useState([]);
  const [subCategoryOption, setSubCategoryOption] = useState([]);
  const [restrictionLength, setRestrictionLength] = useState(0);
  const [restrictionLengthEdit, setRestrictionLengthEdit] = useState(0);
  const [subCategoryOptionEdit, setSubCategoryOptionEdit] = useState([]);
  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "OnlineTestmaster.png");
        });
      });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  const functionTotalCount = async (cat, subcate) => {
    let res = await axios.get(SERVICE.ALL_ONLINE_TEST_QUESTION, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });
    const answe = res.data.onlinetestquestions?.filter(
      (data) => data.category === cat && data.subcategory === subcate
    );
    setRestrictionLength(answe?.length);
  };
  const functionTotalCountEdit = async (cat, subcate) => {
    let res = await axios.get(SERVICE.ALL_ONLINE_TEST_QUESTION, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });
    const answe = res.data.onlinetestquestions?.filter(
      (data) => data.category === cat && data.subcategory === subcate
    );
    setRestrictionLengthEdit(answe?.length);
  };
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { auth } = useContext(AuthContext);
  const [isCompany, setIsCompany] = useState(false);

  // Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };

  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };
  // Error Popup model
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showAlertpop, setShowAlertpop] = useState();

  const handleCloseerrpop = () => {
    setIsErrorOpenpop(false);
  };
  // view model
  const [openview, setOpenview] = useState(false);

  const handleClickOpenview = () => {
    setOpenview(true);
  };

  const handleCloseview = () => {
    setOpenview(false);
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };

  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  //Edit model...
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
  };

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const handleClickOpenalert = async () => {
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      fetchTrainingUserPanelDatasBulkDelete(selectedRows)
      
    }
  };
  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };

  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

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
    testname: true,
    category: true,
    subcategory: true,
    type: true,
    questioncount: true,
    countfrom: true,
    countto: true,
    totalmarks: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  //get single row to edit....
  const getCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.SINGLE_ONLINE_TEST_MASTER}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      fetchOnlineTestMsters();
      setCategoryEdit(res?.data?.sonlinetestmasters?.category);
      setOldDataCheck(res?.data?.sonlinetestmasters)
      setSubCategoryEdit(res?.data?.sonlinetestmasters?.subcategory);
      fetchTrainingUserPanelDatas(res.data.sonlinetestmasters)
      functionTotalCountEdit(
        res?.data?.sonlinetestmasters?.category,
        res?.data?.sonlinetestmasters?.subcategory
      );
      fetchSubCategoryEdit(res?.data?.sonlinetestmasters?.category);
      setTypeEdit(res.data.sonlinetestmasters?.type);
      setOnlineTestmasterEdit(res.data.sonlinetestmasters);
      handleClickOpenEdit();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const fetchTrainingUserPanelDatas = async (data) => {
    try {
      let res = await axios.post(SERVICE.TRAINING_USER_PANEL_ONLINE_TEST, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        data: data
      });
      console.log(res?.data, 'data')
      const trainingDetails = res?.data?.trainingdetails?.length
      const trainingDetailsData = res?.data?.trainingdetails?.length > 0 ? res?.data?.trainingdetails : []
      const trainingForUser = res?.data?.trainingforuser?.length;
      setTrainingDetailsDataUpdate(trainingDetailsData)
      setTrainingDetailsData(trainingDetails)
      setTrainingForUserData(trainingForUser)

    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const fetchTrainingUserPanelDatasDelete = async (data) => {
    try {
      let res = await axios.post(SERVICE.TRAINING_USER_PANEL_ONLINE_TEST, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        data: data
      });
      const trainingDetails = res?.data?.trainingdetails?.length
      const trainingDetailsData = res?.data?.trainingdetails?.length > 0 ? res?.data?.trainingdetails : []
      const trainingForUser = res?.data?.trainingforuser?.length;


      if(trainingDetailsData?.length > 0  || trainingForUser?.length > 0 ){
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Training is Scheduled in Training Details.Update There first"}
            </p>
          </>
        );
        handleClickOpenerr();
      }else {
        handleClickOpen();
      }


    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const [selectedRowsCount, setSelectedRowsCount] = useState(0);
  const fetchTrainingUserPanelDatasBulkDelete = async (data) => {
    try {
      let res = await axios.post(SERVICE.TRAINING_USER_PANEL_ONLINE_TEST_BULK_DELETE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        id: data
      });

console.log(res?.data?.count , res?.data?.result , 'sdhsbhs')
setSelectedRows(res?.data?.result);
setSelectedRowsCount(res?.data?.count)
setIsDeleteOpencheckbox(true);
setSelectAllChecked(
  res?.data?.count === filteredData.length
);


    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };


  const fetchCategory = async () => {
    try {
      let res = await axios.get(SERVICE.CATEGORYINTERVIEW, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const resf = res.data.interviewcategory.filter((data, index)=>{
        return data.mode === "Online or Interview Test"
      })
      const catall = [
        ...resf
          .map((d) => ({
            ...d,
            label: d.categoryname,
            value: d.categoryname,
          }))
          .filter((item, index, self) => {
            return (
              self.findIndex(
                (i) => i.label === item.label && i.value === item.value
              ) === index
            );
          }),
      ];
      setCategoryOption(catall);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const fetchSubCategory = async (e) => {
    try {
      let res = await axios.get(SERVICE.CATEGORYINTERVIEW, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const resf = res.data.interviewcategory.filter((data, index)=>{
        return data.mode === "Online or Interview Test"
      })
      const catall = resf
        .filter((data) => data.categoryname === e)
        .flatMap((d) => d.subcategoryname);
      setSubCategoryOption(
        catall?.map((data) => ({ label: data, value: data }))
      );
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const fetchSubCategoryEdit = async (e) => {
    try {
      let res = await axios.get(SERVICE.CATEGORYINTERVIEW, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const resf = res.data.interviewcategory.filter((data, index)=>{
        return data.mode === "Online or Interview Test"
      })
      const catall =resf
        .filter((data) => data.categoryname === e)
        .flatMap((d) => d.subcategoryname);
      setSubCategoryOptionEdit(
        catall?.map((data) => ({ label: data, value: data }))
      );
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // get single row to edit....
  const getviewCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.SINGLE_ONLINE_TEST_MASTER}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setOnlineTestmasterEdit(res.data.sonlinetestmasters);
      handleClickOpenview();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.SINGLE_ONLINE_TEST_MASTER}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setOnlineTestmasterEdit(res.data.sonlinetestmasters);
      handleClickOpeninfo();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // get all branches
  const fetchOnlineTestMsters = async () => {
    try {
      let res_branch = await axios.get(SERVICE.ALL_ONLINE_TEST_MASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setOnlineTestMasters(res_branch?.data?.onlinetestmasters);
      setIsCompany(true);
    } catch (err) { setIsCompany(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // get all branches
  const fetchBranchAll = async (e) => {
    try {
      let res_branch = await axios.get(SERVICE.ALL_ONLINE_TEST_MASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAllCompanyedit(
        res_branch?.data?.onlinetestmasters.filter((item) => item._id !== e)
      );
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const [deletebranch, setDeletebranch] = useState({});

  // Excel
  const fileName = "OnlineTestmaster";

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  //set function to get particular row
  const rowData = async (id, name) => {
    try {
      let res = await axios.get(`${SERVICE.SINGLE_ONLINE_TEST_MASTER}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      fetchTrainingUserPanelDatasDelete(res.data.sonlinetestmasters)
      setDeletebranch(res?.data?.sonlinetestmasters);
   
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // Alert delete popup
  let branchid = deletebranch._id;
  const delCompany = async () => {
    try {
      await axios.delete(`${SERVICE.SINGLE_ONLINE_TEST_MASTER}/${branchid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchOnlineTestMsters();
      setSelectedRows([]);
      setPage(1);
      handleCloseMod();
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

  const delCompanycheckbox = async () => {
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.SINGLE_ONLINE_TEST_MASTER}/${item}`, {
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

      await fetchOnlineTestMsters();
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

  //print...
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "OnlineTestmaster",
    pageStyle: "print",
  });

  //id for login...

  const handleSubmit = (e) => {
    e.preventDefault();
    const isNameMatch = onlineTestMasters?.some(
      (item) =>
        item?.category.toLowerCase() === category.toLowerCase() &&
        item.subcategory.toLowerCase() === subCategory.toLowerCase() &&
        item.testname.toLowerCase() === onlineTestmaster.testname.toLowerCase()
    );

    if (category === "" || category === "Please Select Category") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Category"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      subCategory === "" ||
      subCategory === "Please Select SubCategory"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select SubCategory"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      onlineTestmaster.testname === "" ||
      onlineTestmaster.testname === undefined
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Test Name"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (type === "Please Select Type") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Type"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      ["Running", "Random"]?.includes(type) &&
      (onlineTestmaster?.questioncount === "" ||
        onlineTestmaster?.questioncount == 0 ||
        onlineTestmaster?.questioncount === undefined)
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Question Count"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      type === "Manual" &&
      (onlineTestmaster?.countfrom === "" ||
        onlineTestmaster?.countfrom == 0 ||
        onlineTestmaster?.countfrom === undefined)
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Question Count From"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      type === "Manual" &&
      (onlineTestmaster?.countto === "" ||
        onlineTestmaster?.countto == 0 ||
        onlineTestmaster?.countto === undefined)
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Question Count To"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      type === "Manual" &&
      Number(onlineTestmaster?.countto) <= Number(onlineTestmaster?.countfrom)
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Question Count To Should Greater Than Question Count From"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      ["Running", "Random"]?.includes(type) &&
      Number(onlineTestmaster?.questioncount) > restrictionLength
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {
              "Please Enter Question Count Less than Total Number of Questions Available"
            }
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      type === "Manual" &&
      Number(onlineTestmaster?.countto) > restrictionLength
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {
              "Please Enter Question Count To Less than Total Number of Questions Available"
            }
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (isNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Test Name already exits!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequest();
    }
  };

  const sendRequest = async (data) => {
    try {
      await axios.post(SERVICE.CREATE_ONLINE_TEST_MASTER, {
        testname: String(onlineTestmaster.testname),
        type: type,
        category: category,
        subcategory: subCategory,
        questioncount: onlineTestmaster?.questioncount,
        countfrom: onlineTestmaster.countfrom,
        countto: onlineTestmaster.countto,
        totalmarks: onlineTestmaster.totalmarks,
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchOnlineTestMsters();
      setOnlineTestmaster({
        testname: "",
        questioncount: "",
        countfrom: "",
        countto: "",
        totalmarks: 0,
      });
      setType("Please Select Type");
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
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setCategory("Please Select Category");
    setSubCategory("Please Select SubCategory");
    setSubCategoryOption([]);
    setOnlineTestmaster({
      testname: "",
      questioncount: "",
      countfrom: "",
      countto: "",
      totalmarks: 0,
    });
    setType("Please Select Type");
    setShowAlert(
      <>
        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>
          {"Cleared Successfully"}
        </p>
      </>
    );
    handleClickOpenerr();
  };

  //floor updateby edit page...
  let updateby = onlineTestmasterEdit?.updatedby;
  let addedby = onlineTestmasterEdit?.addedby;

  let companyid = onlineTestmasterEdit?._id;

  //editing the single data...
  const sendEditRequest = async () => {
    try {
      await axios.put(`${SERVICE.SINGLE_ONLINE_TEST_MASTER}/${companyid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        testname: String(onlineTestmasterEdit.testname),
        type: typeEdit,
        category: categoryEdit,
        subcategory: subCategoryEdit,
        questioncount: onlineTestmasterEdit?.questioncount,
        countfrom: onlineTestmasterEdit.countfrom,
        countto: onlineTestmasterEdit.countto,
        totalmarks: onlineTestmasterEdit.totalmarks,
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      const training = trainingDetailsDataUpdate?.map(async data => {
        const trainingdesiglog = data?.trainingdetailslog
        if (["Running", "Random"].includes(typeEdit)) {
          await axios.put(
            `${SERVICE.SINGLE_TRAININGDETAILS}/${data?._id}`,
            {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              testnames: `${onlineTestmasterEdit?.testname}-(${categoryEdit}-${subCategoryEdit})`,
              questioncount: onlineTestmasterEdit?.questioncount,
              typequestion: typeEdit,
              trainingdetailslog: [
                ...trainingdesiglog,
                {
                  testnames: `${onlineTestmasterEdit?.testname}-(${categoryEdit}-${subCategoryEdit})`,
                  questioncount: onlineTestmasterEdit?.questioncount,
                  typequestion: typeEdit,
                }
              ],
              updatedby: [
                ...updateby,
                {
                  name: String(isUserRoleAccess.companyname),
                  date: String(new Date()),
                },
              ],
            }
          );

        }
        if(typeEdit === "Manual"){
          await axios.put(
            `${SERVICE.SINGLE_TRAININGDETAILS}/${data?._id}`,
            {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              testnames: `${onlineTestmasterEdit?.testname}-(${categoryEdit}-${subCategoryEdit})`,
              questioncount: `${onlineTestmasterEdit.countfrom}-${onlineTestmasterEdit.countto}`,
              typequestion: typeEdit,
              trainingdetailslog: [
                ...trainingdesiglog,
                {
                  testnames: `${onlineTestmasterEdit?.testname}-(${categoryEdit}-${subCategoryEdit})`,
                  questioncount: `${onlineTestmasterEdit.countfrom}-${onlineTestmasterEdit.countto}`,                  typequestion: typeEdit,
                }
              ],
              updatedby: [
                ...updateby,
                {
                  name: String(isUserRoleAccess.companyname),
                  date: String(new Date()),
                },
              ],
            }
          );

        }
      })
      await fetchOnlineTestMsters();
      handleCloseModEdit();
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

  const editSubmit = (e) => {
    e.preventDefault();
    const isNameMatch = allCompanyedit.some(
      (item) =>
        item?.category.toLowerCase() === categoryEdit?.toLowerCase() &&
        item?.subcategory?.toLowerCase() === subCategoryEdit?.toLowerCase() &&
        item.testname.toLowerCase() ===
        onlineTestmasterEdit.testname.toLowerCase()
    );

    if (
      categoryEdit === "" ||
      categoryEdit === "Please Select Category" ||
      categoryEdit === undefined
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Category"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      subCategoryEdit === "" ||
      subCategoryEdit === "Please Select SubCategory" ||
      subCategoryEdit === undefined
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select SubCategory"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      onlineTestmasterEdit.testname === "" ||
      onlineTestmasterEdit.testname === undefined
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Test Name"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (typeEdit === "Please Select Type") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Type"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      ["Running", "Random"]?.includes(typeEdit) &&
      (onlineTestmasterEdit?.questioncount === "" ||
        onlineTestmasterEdit?.questioncount == 0 ||
        onlineTestmasterEdit?.questioncount === undefined)
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Question Count"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      ["Running", "Random"]?.includes(typeEdit) &&
      onlineTestmasterEdit?.questioncount > restrictionLengthEdit
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {
              "Please Enter Question Count Less than Total Number of Questions Available"
            }
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      typeEdit === "Manual" &&
      (onlineTestmasterEdit?.countfrom === "" ||
        onlineTestmasterEdit?.countfrom == 0 ||
        onlineTestmasterEdit?.countfrom === undefined)
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Question Count From"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      typeEdit === "Manual" &&
      (onlineTestmasterEdit?.countto === "" ||
        onlineTestmasterEdit?.countto == 0 ||
        onlineTestmasterEdit?.countto === undefined)
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Question Count To"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      typeEdit === "Manual" &&
      Number(onlineTestmasterEdit?.countto) <=
      Number(onlineTestmasterEdit?.countfrom)
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Question Count To Should Greater Than Question Count From"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      ["Running", "Random"]?.includes(typeEdit) &&
      Number(onlineTestmasterEdit?.questioncount) > restrictionLengthEdit
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {
              "Please Enter Question Count Less than Total Number of Questions Available"
            }
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      typeEdit === "Manual" &&
      Number(onlineTestmasterEdit?.countto) > restrictionLengthEdit
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {
              "Please Enter Question Count To Less than Total Number of Questions Available"
            }
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (isNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Test Name already exits!"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (["Running", "Random"]?.includes(oldDataCheck?.type) &&
      (oldDataCheck?.type !== typeEdit || Number(oldDataCheck.questioncount) 
      !== Number(onlineTestmasterEdit?.questioncount)) && trainingForUserData > 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Training Scheduled.Cant'Change until it's Over!"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (oldDataCheck?.type === "Manual" &&
      (oldDataCheck?.type !== typeEdit
        || Number(oldDataCheck.countfrom) !== Number(onlineTestmasterEdit?.countfrom)
        || Number(oldDataCheck.countto) !== Number(onlineTestmasterEdit?.countto)) && trainingForUserData > 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Training Scheduled.Cant'Change until it's Over!"}
          </p>
        </>
      );
      handleClickOpenerr();
    }

    else if (oldDataCheck?.type !== typeEdit && (trainingDetailsData > 0 || trainingForUserData > 0)) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Training is Scheduled in Training Details/Training For User.Update There first"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else {
      sendEditRequest();
    }
  };

  useEffect(() => {
    fetchOnlineTestMsters();
    fetchCategory();
  }, []);

  //table entries ..,.
  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = onlineTestMasters?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [onlineTestMasters]);

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
      width: 100,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "category",
      headerName: "Category",
      flex: 0,
      width: 250,
      hide: !columnVisibility.category,
      headerClassName: "bold-header",
    },
    {
      field: "subcategory",
      headerName: "SubCategory",
      flex: 0,
      width: 250,
      hide: !columnVisibility.subcategory,
      headerClassName: "bold-header",
    },
    {
      field: "testname",
      headerName: "Test Name",
      flex: 0,
      width: 250,
      hide: !columnVisibility.testname,
      headerClassName: "bold-header",
    },
    {
      field: "type",
      headerName: "Type",
      flex: 0,
      width: 100,
      hide: !columnVisibility.type,
      headerClassName: "bold-header",
    },
    {
      field: "questioncount",
      headerName: "Question Count",
      flex: 0,
      width: 100,
      hide: !columnVisibility.questioncount,
      headerClassName: "bold-header",
    },
    {
      field: "countfrom",
      headerName: "Count From",
      flex: 0,
      width: 100,
      hide: !columnVisibility.countfrom,
      headerClassName: "bold-header",
    },
    {
      field: "countto",
      headerName: "Count To",
      flex: 0,
      width: 100,
      hide: !columnVisibility.countto,
      headerClassName: "bold-header",
    },
    {
      field: "totalmarks",
      headerName: "Total Marks",
      flex: 0,
      width: 100,
      hide: !columnVisibility.totalmarks,
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
          {isUserRoleCompare?.includes("eonlinetestmaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.row.id);
                fetchBranchAll(params.row.id);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("donlinetestmaster") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id, params.row.name);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vonlinetestmaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("ionlinetestmaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
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
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      category: item?.category,
      subcategory: item.subcategory,
      testname: item.testname,
      type: item.type,
      questioncount: item.questioncount,
      countfrom: item.countfrom,
      countto: item.countto,
      totalmarks: item.totalmarks,
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

  return (
    <Box>
      <Headtitle title={"ONLINE TEST MASTER"} />
      {/* ****** Header Content ****** */}
      {isUserRoleCompare?.includes("aonlinetestmaster") && (
        <>
          <Typography sx={userStyle.HeaderText}>Online Test Master</Typography>
          <Box sx={userStyle.dialogbox}>
            <Typography sx={userStyle.SubHeaderText}>
              {" "}
              Add Online Test Master
            </Typography>
            <br />
            <br />
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Category<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={categoryOption}
                      placeholder="Please Select Category"
                      value={{ label: category, value: category }}
                      onChange={(e) => {
                        setCategory(e.value);
                        setSubCategory("Please Select SubCategory");
                        fetchSubCategory(e.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Sub Category<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={subCategoryOption}
                      placeholder="Please Select Category"
                      value={{ label: subCategory, value: subCategory }}
                      onChange={(e) => {
                        setSubCategory(e.value);
                        functionTotalCount(category, e.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Test Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlinedcode"
                      type="text"
                      value={onlineTestmaster.testname}
                      onChange={(e) => {
                        setOnlineTestmaster({
                          ...onlineTestmaster,
                          testname: e.target.value.replace(/[^a-zA-Z;]/g, ""),
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Type<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={[
                        { label: "Running", value: "Running" },
                        { label: "Random", value: "Random" },
                        { label: "Manual", value: "Manual" },
                      ]}
                      styles={colourStyles}
                      value={{ label: type, value: type }}
                      onChange={(e) => {
                        setType(e.value);
                        setOnlineTestmaster({
                          ...onlineTestmaster,
                          questioncount: "",
                          countfrom: "",
                          countto: "",
                          totalmarks: 0,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                {["Running", "Random"]?.includes(type) ? (
                  <Grid item md={4} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Question Count <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlinedname"
                        type="text"
                        value={onlineTestmaster.questioncount}
                        onChange={(e) => {
                          setOnlineTestmaster({
                            ...onlineTestmaster,
                            questioncount:
                              Number(e.target.value) > 0
                                ? Number(e.target.value)
                                : 0,
                            totalmarks:
                              Number(e.target.value) > 0
                                ? Number(e.target.value)
                                : 0,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                ) : type === "Manual" ? (
                  <>
                    <Grid item md={4} sm={6} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Question Count From<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlinedname"
                          type="text"
                          value={onlineTestmaster.countfrom}
                          onChange={(e) => {
                            setOnlineTestmaster({
                              ...onlineTestmaster,
                              countfrom:
                                Number(e.target.value) > 0
                                  ? Number(e.target.value)
                                  : 0,
                              countto: "",
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} sm={6} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Question Count To <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlinedname"
                          type="text"
                          disabled={
                            onlineTestmaster.countfrom === "" ||
                            Number(onlineTestmaster.countfrom) === 0
                          }
                          value={onlineTestmaster.countto}
                          onChange={(e) => {
                            setOnlineTestmaster({
                              ...onlineTestmaster,
                              countto:
                                Number(e.target.value) > 0
                                  ? Number(e.target.value)
                                  : 0,
                              totalmarks:
                                Number(e.target.value) > 0
                                  ? Number(e.target.value) >
                                    Number(onlineTestmaster.countfrom)
                                    ? Number(e.target.value) -
                                    Number(onlineTestmaster.countfrom) +
                                    1
                                    : 0
                                  : 0,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : (
                  ""
                )}
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Total Marks <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlinedname"
                      type="text"
                      value={onlineTestmaster.totalmarks}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br />

              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={6}>
                  {isUserRoleCompare?.includes("aonlinetestmaster") && (
                    <>
                      <LoadingButton variant="contained" type="submit">
                        SUBMIT
                      </LoadingButton>
                    </>
                  )}
                </Grid>
                <Grid item md={2.5} xs={12} sm={6}>
                  <Button sx={userStyle.btncancel} onClick={handleClear}>
                    Clear
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </>
      )}
      <br />
      {isUserRoleCompare?.includes("lonlinetestmaster") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Online Test Master List
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
                    {/* <MenuItem value={onlineTestMasters?.length}>All</MenuItem> */}
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
                  {isUserRoleCompare?.includes("excelonlinetestmaster") && (
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
                  {isUserRoleCompare?.includes("csvonlinetestmaster") && (
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
                  {isUserRoleCompare?.includes("printonlinetestmaster") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handlePrint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfonlinetestmaster") && (
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
                  {isUserRoleCompare?.includes("imageonlinetestmaster") && (
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
            {isUserRoleCompare?.includes("bdonlinetestmaster") && (
              <Button
                variant="contained"
                color="error"
                onClick={() => handleClickOpenalert()}
              >
                Bulk Delete
              </Button>
            )}
            <br />
            <br />
            {!isCompany ? (
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
                    onClipboardCopy={(copiedString) =>
                      setCopiedData(copiedString)
                    }
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

      {/* Delete Modal */}
      <Box>
        <>
          <Box>
            {/* ALERT DIALOG */}
            <Dialog
              open={isDeleteOpen}
              onClose={handleCloseMod}
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
                <ErrorOutlineOutlinedIcon
                  sx={{ fontSize: "80px", color: "orange" }}
                />
                <Typography
                  variant="h5"
                  sx={{ color: "red", textAlign: "center" }}
                >
                  Are you sure?
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseMod} variant="outlined">
                  Cancel
                </Button>
                <Button
                  autoFocus
                  variant="contained"
                  color="error"
                  onClick={(e) => delCompany(branchid)}
                >
                  {" "}
                  OK{" "}
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </>

        {/* edit model */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="lg"
          fullWidth
        >
          <Box sx={{ padding: "20px 30px" }}>
            <form onSubmit={editSubmit}>
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}>
                  Edit Online Test master
                </Typography>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Category<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={categoryOption}
                      placeholder="Please Select Category"
                      value={{ label: categoryEdit, value: categoryEdit }}
                      onChange={(e) => {
                        setCategoryEdit(e.value);
                        fetchSubCategoryEdit(e.value);
                        setSubCategoryEdit("Please Select SubCategory");
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Sub Category<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={subCategoryOptionEdit}
                      placeholder="Please Select Category"
                      value={{ label: subCategoryEdit, value: subCategoryEdit }}
                      onChange={(e) => {
                        setSubCategoryEdit(e.value);
                        functionTotalCountEdit(categoryEdit, e.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Test Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlinedcode"
                      type="text"
                      value={onlineTestmasterEdit.testname}
                      onChange={(e) => {
                        setOnlineTestmasterEdit({
                          ...onlineTestmasterEdit,
                          testname: e.target.value.replace(/[^a-zA-Z;]/g, ""),
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Type<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={[
                        { label: "Running", value: "Running" },
                        { label: "Random", value: "Random" },
                        { label: "Manual", value: "Manual" },
                      ]}
                      styles={colourStyles}
                      value={{ label: typeEdit, value: typeEdit }}
                      onChange={(e) => {
                        setTypeEdit(e.value);
                        setOnlineTestmasterEdit({
                          ...onlineTestmasterEdit,
                          questioncount: "",
                          countfrom: "",
                          countto: "",
                          totalmarks: 0,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                {["Running", "Random"]?.includes(typeEdit) ? (
                  <Grid item md={4} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Question Count <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlinedname"
                        type="text"
                        value={onlineTestmasterEdit.questioncount}
                        onChange={(e) => {
                          setOnlineTestmasterEdit({
                            ...onlineTestmasterEdit,
                            questioncount:
                              Number(e.target.value) > 0
                                ? Number(e.target.value)
                                : 0,
                            totalmarks:
                              Number(e.target.value) > 0
                                ? Number(e.target.value)
                                : 0,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                ) : typeEdit === "Manual" ? (
                  <>
                    <Grid item md={4} sm={6} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Question Count From<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlinedname"
                          type="text"
                          value={onlineTestmasterEdit.countfrom}
                          onChange={(e) => {
                            setOnlineTestmasterEdit({
                              ...onlineTestmasterEdit,
                              countfrom:
                                Number(e.target.value) > 0
                                  ? Number(e.target.value)
                                  : 0,
                              countto: "",
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} sm={6} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Question Count To <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlinedname"
                          type="text"
                          disabled={
                            onlineTestmasterEdit.countfrom === "" ||
                            Number(onlineTestmasterEdit.countfrom) === 0
                          }
                          value={onlineTestmasterEdit.countto}
                          onChange={(e) => {
                            setOnlineTestmasterEdit({
                              ...onlineTestmasterEdit,
                              countto:
                                Number(e.target.value) > 0
                                  ? Number(e.target.value)
                                  : 0,
                              totalmarks:
                                Number(e.target.value) > 0
                                  ? Number(e.target.value) >
                                    Number(onlineTestmasterEdit.countfrom)
                                    ? Number(e.target.value) -
                                    Number(onlineTestmasterEdit.countfrom)
                                    : 0
                                  : 0,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : (
                  ""
                )}
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Total Marks <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlinedname"
                      type="text"
                      value={onlineTestmasterEdit.totalmarks}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={12}>
                  <Button variant="contained" type="submit">
                    {" "}
                    Update
                  </Button>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
                    {" "}
                    Cancel{" "}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Dialog>

        {/* view model */}
        <Dialog
          open={openview}
          onClose={handleClickOpenview}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="lg"
          fullWidth
        >
          <Box sx={{ padding: "20px 50px" }}>
            <>
              <Typography sx={userStyle.HeaderText}>
                {" "}
                View Online Test Master
              </Typography>
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Category</Typography>
                    <Typography>{onlineTestmasterEdit.category}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Sub Category</Typography>
                    <Typography>{onlineTestmasterEdit.subcategory}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Test Name</Typography>
                    <Typography>{onlineTestmasterEdit.testname}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Type</Typography>
                    <Typography>{onlineTestmasterEdit.type}</Typography>
                  </FormControl>
                </Grid>
                {["Running", "Random"].includes(onlineTestmasterEdit.type) && (
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Question Count</Typography>
                      <Typography>
                        {onlineTestmasterEdit.questioncount}
                      </Typography>
                    </FormControl>
                  </Grid>
                )}
                {onlineTestmasterEdit?.type === "Manual" && (
                  <>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">
                          Question Count From
                        </Typography>
                        <Typography>
                          {onlineTestmasterEdit.countfrom}
                        </Typography>
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">Question Count To</Typography>
                        <Typography>{onlineTestmasterEdit.countto}</Typography>
                      </FormControl>
                    </Grid>
                  </>
                )}
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Total Marks</Typography>
                    <Typography>{onlineTestmasterEdit.totalmarks}</Typography>
                  </FormControl>
                </Grid>
              </Grid>
              <br /> <br /> <br />
              <Grid container spacing={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCloseview}
                >
                  {" "}
                  Back{" "}
                </Button>
              </Grid>
            </>
          </Box>
        </Dialog>

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
              <Typography sx={userStyle.HeaderText}>
                {" "}
                Online Test Master Info
              </Typography>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Added by</Typography>
                    <br />
                    <Table>
                      <TableHead>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {"SNO"}.
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {" "}
                          {"UserName"}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
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
                              {moment(item.date).format(
                                "DD-MM-YYYY hh:mm:ss a"
                              )}
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
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {"SNO"}.
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {" "}
                          {"UserName"}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
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
                              {moment(item.date).format(
                                "DD-MM-YYYY hh:mm:ss a"
                              )}
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

        {/* ******Print layout ****** */}
        <TableContainer component={Paper} sx={userStyle.printcls}>
          <Table
            aria-label="simple table"
            id="Customerduesreport"
            ref={componentRef}
          >
            <TableHead sx={{ fontWeight: "600" }}>
              <TableRow>
                <TableCell> SNO</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>SubCategory</TableCell>
                <TableCell>Test Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Question Count</TableCell>
                <TableCell>Count From</TableCell>
                <TableCell>Count To</TableCell>
                <TableCell>Total Marks</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData &&
                filteredData?.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>{row.subcategory}</TableCell>
                    <TableCell>{row.testname}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.questioncount}</TableCell>
                    <TableCell>{row.countfrom}</TableCell>
                    <TableCell>{row.countto}</TableCell>
                    <TableCell>{row.totalmarks}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
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

      {/* ALERT DIALOG */}
      <Box>
        <Dialog
          open={isErrorOpenpop}
          onClose={handleCloseerrpop}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            <Typography variant="h6">{showAlertpop}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              style={{
                padding: "7px 13px",
                color: "white",
                background: "rgb(25, 118, 210)",
              }}
              onClick={() => {
                sendEditRequest();
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
              onClick={handleCloseerrpop}
            >
              Cancel
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
              // fetchProductionClientRateArray();
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
      <Box>
                <Dialog
                    open={isDeleteOpencheckbox}
                    onClose={handleCloseModcheckbox}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                        {selectedRowsCount > 0 ?
                            <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>Some of the Data's are Linked in other pages. Do You want to Delete the Remaining.?</Typography>
                            :
                            <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>This Data is Linked in Some pages</Typography>

                        }
                    </DialogContent>
                    <DialogActions>
                        {selectedRowsCount > 0 ?
                            <>
                                <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>Cancel</Button>
                                <Button variant="contained" color='error'
                                    onClick={(e) => delCompanycheckbox(e)}
                                > OK </Button>
                            </>
                            :
                            <Button variant="contained" color='error' onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>Ok</Button>
                        }
                    </DialogActions>
                </Dialog>

            </Box>

    </Box>
    
  );
}

export default OnlineTestmaster;