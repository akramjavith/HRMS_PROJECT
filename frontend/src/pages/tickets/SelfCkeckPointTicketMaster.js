import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  TextareaAutosize,
  TableBody,
  TableRow,
  TableCell,
  Select,
  MenuItem,
  Dialog,
  DialogContent,
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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { handleApiError } from "../../components/Errorhandling";
import { userStyle, colourStyles } from "../../pageStyle";
import { FaPrint, FaFilePdf, FaPlus, FaEdit, FaFileCsv, FaFileExcel, } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import { SERVICE } from "../../services/Baseservice";
import StyledDataGrid from "../../components/TableStyle";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import moment from "moment-timezone";
import { UserRoleAccessContext, AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import Switch from "@mui/material/Switch";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { MultiSelect } from "react-multi-select-component";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useLocation } from 'react-router-dom';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import LoadingButton from "@mui/lab/LoadingButton";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
function SelfCheckPointTicketMaster() {
  const [checkpointticketmaster, setCheckpointticketmaster] = useState({
    category: "Please Select Category",
    subcategory: "Please Select Subcategory",
    type: "Please Select Type",
    reason: "Please Select Reason",
    checkpointgrp: "",
  });

  const [checkpointticketmasterEdit, setCheckpointticketmasterEdit] = useState(
    []
  );
  const [isBtn, setIsBtn] = useState(false);
  const [checkpointticketmasters, setCheckpointticketmasters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [allcheckpointticketmasteredit, setAllCheckpointticketmasteredit] =
    useState([]);

  const { isUserRoleCompare, allProjects, isUserRoleAccess } = useContext(
    UserRoleAccessContext
  );
  const { auth } = useContext(AuthContext);

  const [reasonmasterCheck, setReasonmastercheck] = useState(false);

  const username = isUserRoleAccess.username;

  const gridRef = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);

  const [searchQueryManage, setSearchQueryManage] = useState("");

  const [copiedData, setCopiedData] = useState("");
  const [selectedOptionsReason, setSelectedOptionsReason] = useState([]);

  let [valueReason, setValueResaon] = useState([]);



  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
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

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };
  const handleExportXL = (isfilter) => {
    if (isfilter === "filtered") {
      exportToCSV(
        filteredData?.map((item, index) => ({
          "Sno": index + 1,
          Category: item.category,
          SubCategory: item.subcategory,
          SubSubCategory: item.subsubcategory,
          Type: item.type,
          Reason: item.reason,
          "CheckPoint Group": item.checkpointgrp,
        })),
        fileName,
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        items.map((item, index) => ({
          "Sno": index + 1,
          Category: item.category,
          SubCategory: item.subcategory,
          SubSubCategory: item.subsubcategory,
          Type: item.type,
          Reason: item.reason,
          "CheckPoint Group": item.checkpointgrp,
        })),
        fileName,
      );

    }

    setIsFilterOpen(false)
  };



  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();
    // Initialize serial number counter
    let serialNumberCounter = 1;

    // Modify columns to include serial number column
    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" }, // Serial number column
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial = isfilter === "filtered" ?
      filteredData.map(item => ({
        serialNumber: serialNumberCounter++,
        category: item.category,
        subcategory: item.subcategory,
        subsubcategory: item.subsubcategory,
        type: item.type,
        reason: item.reason,
        checkpointgrp: item.checkpointgrp,
      })) :
      items?.map(item => ({
        serialNumber: serialNumberCounter++,
        category: item.category,
        subcategory: item.subcategory,
        subsubcategory: item.subsubcategory,
        type: item.type,
        reason: item.reason,
        checkpointgrp: item.checkpointgrp,
      }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      styles: {
        fontSize: 4,
      },
      columns: columnsWithSerial,
      body: dataWithSerial,
    });

    doc.save("SelfCheckpointTicketMaster.pdf");
  };












  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "SelfCheckPointTicketMaster.png");
        });
      });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  //check delete model
  const [isCheckOpen, setisCheckOpen] = useState(false);
  const handleClickOpenCheck = () => {
    setisCheckOpen(true);
  };
  const handleCloseCheck = () => {
    setisCheckOpen(false);
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
    setIsBtn(false)
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [ovProj, setOvProj] = useState("");
  const [getOverAllCount, setGetOverallCount] = useState("");
  const [ovProjCount, setOvProjCount] = useState("");
  const [ovProjDelete, setOvProjDelete] = useState("");
  const [getOverAllCountDelete, setGetOverallCountDelete] = useState("");
  const [ovProjCountDelete, setOvProjCountDelete] = useState("");
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
        getOverallEditSectionOverallDelete(selectedRows)

    }

};

const [selectedRowsCount, setSelectedRowsCount] = useState(0);
//overall edit section for all pages
const getOverallEditSectionOverallDelete = async (ids) => {
    try {

        let res = await axios.post(SERVICE.OVERALL_BULK_SELFCHECK_TICKET_DELETE, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            id: ids
        });
        setSelectedRows(res?.data?.result);
        setSelectedRowsCount(res?.data?.count)
        setIsDeleteOpencheckbox(true);

        setSelectAllChecked(
          res?.data?.count === filteredData.length
        );

      } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
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

  const [todoscheck, setTodoscheck] = useState([]);
  const [editingIndexcheck, setEditingIndexcheck] = useState(-1);
  const [editedTododescheck, setEditedTododescheck] = useState(0);
  const [editcheckpoint, seteditcheckpoint] = useState("");
  const [newTodoLabelcheck, setNewTodoLabelcheck] = useState("");

  const [deverrormsg, setdeverrormsg] = useState("");



  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const encodedData = queryParams.get('data');
  // const decodedData = JSON.parse(atob(encodedData));



  const fetchData = async () => {
    const dataSplit = encodedData.split(",");
    const category = [dataSplit[0]];
    const subcategory = [dataSplit[1]];
    const subsubcategory = (dataSplit[2] === "Please Select Sub Sub-category" || dataSplit[2] === "") ? [] : [dataSplit[2]];
    setSelectedOptionsCat(category.map((data) => ({
      ...data,
      label: data,
      value: data
    })))
    let res_category = await axios.get(SERVICE.CATEGORYTICKET, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });
    const filteredCategoryOptions = res_category?.data?.ticketcategory
      ?.filter((u) => category?.includes(u.categoryname))
      .map((u) => ({
        ...u,
        label: u.subcategoryname,
        value: u.subcategoryname,
      }));
    let subcategoryNames = filteredCategoryOptions.flatMap((obj) =>
      obj.subcategoryname.map((subcategory) => ({
        label: subcategory,
        value: subcategory,
      }))
    );
    setFilteredSubCategoryOptions(subcategoryNames);

    setSelectedOptionsSubCat(subcategory.map((data) => ({
      ...data,
      label: data,
      value: data
    })))


    let res_subsubcategory = await axios.get(SERVICE.SUBSUBCOMPONENT, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });
    const filteredSubSubCategoryOptions = res_subsubcategory?.data?.subsubcomponents
      ?.filter(
        (u) =>
          u.categoryname.some((data) => category.includes(data)) &&
          u.subcategoryname.some((data) => subcategory.includes(data))
      )
      .map((u) => ({
        ...u,
        label: u.subsubname,
        value: u.subsubname,
      }));

    setFilteredSubSubCategoryOptions(filteredSubSubCategoryOptions)

    setSelectedOptionsSubSubCat(subsubcategory.map((data) => ({
      ...data,
      label: data,
      value: data
    })))






  }

  useEffect(() => {
    fetchData();
  }, [encodedData])

  useEffect(() => {
    // Get the current URL
    const currentUrl = window.location.href;

    // Check if the 'data' query parameter is present
    if (currentUrl.includes('?data=')) {
      // Remove the 'data' query parameter
      const newUrl = currentUrl.split('?data=')[0];

      // Replace the current URL without the 'data' parameter
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [encodedData])















  const handleCreateTodocheck = () => {
    const newTodocheck = {
      label: newTodoLabelcheck,
    };
    setdeverrormsg("");
    setTodoscheck([...todoscheck, newTodocheck]);
    setNewTodoLabelcheck("");
  };

  const handleDeleteTodocheck = (index) => {
    const newTodoscheck = [...todoscheck];
    newTodoscheck.splice(index, 1);
    setTodoscheck(newTodoscheck);
  };

  const handleEditTodocheck = (index) => {
    setEditingIndexcheck(index);
    seteditcheckpoint(todoscheck[index].label);
  };

  const handleUpdateTodocheck = () => {
    const label = editcheckpoint;

    if (
      !todoscheck.find(
        (todo, index) =>
          index !== editcheckpoint &&
          todo.label?.toLowerCase() === editcheckpoint?.toLowerCase()
      )
    ) {
      const newTodoscheck = [...todoscheck];
      newTodoscheck[editingIndexcheck].label = label;
      setTodoscheck(newTodoscheck);
      setEditingIndexcheck(-1);
      seteditcheckpoint("");
      setEditedTododescheck(0);
    } else {
      const newTodoscheck = [...todoscheck];
      newTodoscheck[editingIndexcheck].label = label;

      setTodoscheck(newTodoscheck);
      setEditingIndexcheck(-1);
      seteditcheckpoint("");
      setEditedTododescheck(0);
    }
  };

  //edit

  const [todoscheckedit, setTodoscheckedit] = useState([]);
  const [editingIndexcheckedit, setEditingIndexcheckedit] = useState(-1);
  const [editcheckpointedit, seteditcheckpointedit] = useState("");
  const [newTodoLabelcheckedit, setNewTodoLabelcheckedit] = useState("");

  const [deverrormsgedit, setdeverrormsgedit] = useState("");

  const handleCreateTodocheckedit = () => {
    const newTodocheckedit = {
      label: newTodoLabelcheckedit,
    };
    setdeverrormsgedit("");
    setTodoscheckedit([...todoscheckedit, newTodocheckedit]);

    setNewTodoLabelcheckedit("");
  };

  const handleDeleteTodocheckedit = (index) => {
    const newTodoscheckedit = [...todoscheckedit];
    newTodoscheckedit.splice(index, 1);
    setTodoscheckedit(newTodoscheckedit);
  };

  const handleEditTodocheckedit = (index) => {
    setEditingIndexcheckedit(index);
    seteditcheckpointedit(todoscheckedit[index].label);
  };

  const handleUpdateTodocheckedit = () => {
    const label = editcheckpointedit;

    if (
      !todoscheckedit?.find(
        (todo, index) =>
          index !== editcheckpointedit &&
          todo.label?.toLowerCase() === editcheckpointedit?.toLowerCase()
      )
    ) {
      const newTodoscheckedit = [...todoscheckedit];
      newTodoscheckedit[editingIndexcheckedit].label = label;
      setTodoscheckedit(newTodoscheckedit);
      setEditingIndexcheckedit(-1);
    } else {
      const newTodoscheckedit = [...todoscheckedit];
      newTodoscheckedit[editingIndexcheckedit].label = label;
      setTodoscheckedit(newTodoscheckedit);
      setEditingIndexcheckedit(-1);
    }
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
    category: true,
    subcategory: true,
    subsubcategory: true,
    type: true,
    reason: true,
    checkpointgrp: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  const [deleteCheckpointicket, setDeleteCheckpointticket] = useState("");

  const rowData = async (id, name) => {
    try {
      let res = await axios.get(
        `${SERVICE.SELFCHECKPOINTTICKET_SINGLE}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setDeleteCheckpointticket(res?.data?.sselfcheckpointticketmasters);
      getOverallEditSectionDelete(res?.data?.sselfcheckpointticketmasters)
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };




  //overall edit section for all pages
  const getOverallEditSectionDelete = async (e) => {
    try {
      let res = await axios.post(SERVICE.OVERALL_SELFCHECK_TICKET_DELETE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: e,
      });
      setOvProjCountDelete(res?.data?.count);

      setGetOverallCountDelete(`This Self Check Point data is linked in 
       ${res?.data?.selfcheck?.length > 0 ? "Raise Ticket Master," : ""}`);
      if (res?.data?.count > 0) {
        handleClickOpenCheck();
      } else {
        handleClickOpen();
      }
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };





  // Alert delete popup
  let Checkpointticketsid = deleteCheckpointicket?._id;
  const delCheckpointticket = async (e) => {
    try {
      if (Checkpointticketsid) {
        await axios.delete(`${SERVICE.SELFCHECKPOINTTICKET_SINGLE}/${e}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        await fetchCheckpointticketmaster();
        handleCloseMod();
        setSelectedRows([]);
        setPage(1);
        setShowAlert(
          <>
            {" "}
            <CheckCircleOutlineIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {" "}
              {"Deleted Successfully👍"}{" "}
            </p>{" "}
          </>
        );
        handleClickOpenerr();
      }
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const delCheckpointticketcheckbox = async () => {
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.SELFCHECKPOINTTICKET_SINGLE}/${item}`, {
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

      await fetchCheckpointticketmaster();
      setShowAlert(
        <>
          {" "}
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Deleted Successfully👍"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const [categorys, setCategorys] = useState([]);
  const [subcategorys, setSubcategorys] = useState([]);

  const [categorysEdit, setCategorysEdit] = useState([]);
  const [subcategorysEdit, setSubcategorysEdit] = useState([]);

  const fetchCategoryTicket = async () => {
    try {
      let res_category = await axios.get(SERVICE.CATEGORYTICKET, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const categoryall = [
        ...res_category?.data?.ticketcategory.map((d) => ({
          ...d,
          label: d.categoryname,
          value: d.categoryname,
        })),
      ];

      setCategorys(categoryall);
      setCategorysEdit(categoryall);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const fetchCategoryBased = async () => {
    try {
      let res_category = await axios.get(SERVICE.CATEGORYTICKET, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCategoryOptions(res_category.data.ticketcategory);
      let data_set = res_category.data.ticketcategory
        .filter((data) => {
          return valueCat.includes(data.categoryname);
        })
        .map((data) => data.subcategoryname);

      let ans = [].concat(...data_set);
      setSubcategorys(
        ans.map((d) => ({
          ...d,
          label: d,
          value: d,
        }))
      );

      setSubcategorysEdit(
        ans.map((d) => ({
          ...d,
          label: d,
          value: d,
        }))
      );
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const fetchTypemaster = async (e) => {
    try {
      let res_type = await axios.get(SERVICE.TYPEMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTypeOptions(res_type?.data?.typemasters);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const [reasonOptions, setReasonOptions] = useState([]);
  const fetchReasonmaster = async () => {
    try {
      let res_type = await axios.get(SERVICE.REASONMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setReasonOptions(res_type?.data?.reasonmasters);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //create alert for same name
  let todoCheck =
    todoscheck?.length > 0
      ? todoscheck?.some(
        (d) =>
          d.label &&
          d.label?.toLowerCase() === newTodoLabelcheck?.toLowerCase()
      )
        ? true
        : false
      : false;
  //edit (create) alert for same name/
  let todoCheckCreateEdit =
    todoscheck?.length > 0
      ? todoscheck?.some((d, index) => {
        return (
          index != editingIndexcheck &&
          d.label &&
          d.label?.toLowerCase() === editcheckpoint?.toLowerCase()
        );
      })
        ? true
        : false
      : false;
  //edit alert for same name

  let todoCheckEdit =
    todoscheckedit?.length > 0
      ? todoscheckedit?.some(
        (d) =>
          d.label &&
          d.label?.toLowerCase() === newTodoLabelcheckedit?.toLowerCase()
      )
        ? true
        : false
      : false;
  //edit (edit) alert for same name
  let todoCheckEditededit =
    todoscheckedit?.length > 0
      ? todoscheckedit?.some(
        (d, index) =>
          index != editingIndexcheckedit &&
          d.label &&
          d.label?.toLowerCase() === editcheckpointedit?.toLowerCase()
      )
        ? true
        : false
      : false;

  //add function
  const sendRequest = async () => {
    setIsBtn(true)
    try {
      valueReason.forEach((data, index) => {
        axios.post(
          SERVICE.SELFCHECKPOINTTICKET_CREATE,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            category: [...valueCat],
            subcategory: [...valueSubCat],
            subsubcategory: [...valueSubSubCat],
            type: String(checkpointticketmaster.type),
            reason: String(data),
            checkpointgrp: [...todoscheck],
            addedby: [
              {
                name: String(isUserRoleAccess.companyname),
                date: String(new Date()),
              },
            ],
          }
        );
      })
      await fetchCheckpointticketmaster();
      setNewTodoLabelcheck("");
      setTodoscheck([]);
      setCheckpointticketmaster({
        ...checkpointticketmaster,
        checkpointgrp: "",
      });
      setShowAlert(
        <>
          {" "}
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Added Successfully👍"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
      setIsBtn(false)
    } catch (err) {setIsBtn(false);handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();

    let catopt = selectedOptionsCat.map((item) => item.value);
    let subcatopt = selectedOptionsSubCat.map((item) => item.value);
    let subSubcatopt = selectedOptionsSubSubCat.map((item) => item.value);
    const isNameMatch = checkpointticketmasters.some(
      (item) =>
        item.category.some((data) => catopt.includes(data)) &&
        item.subcategory.some((data) => subcatopt.includes(data)) &&
        (subSubcatopt.length === 0 ||
          item.subsubcategory.some((data) => subSubcatopt.includes(data))) &&
        item.type === String(checkpointticketmaster?.type) &&
        valueReason.some((resdata, index) => resdata.toLowerCase() === item.reason.toLowerCase())
      // item?.reason.toLowerCase() ===
      //   String(checkpointticketmaster?.reason.toLowerCase())
    );

    if (valueCat?.length == 0) {
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
    } else if (valueSubCat?.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Sub Category"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      filteredSubSubCategoryOptions?.length != 0 &&
      valueSubSubCat?.length == 0
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Sub Sub Category"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (checkpointticketmaster.type === "Please Select Type") {
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
    } else if (selectedOptionsReason.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Reason"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (todoscheck.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Checkpoint"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (isNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Self Checkpoint Ticket Master already exists!"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else {
      sendRequest();
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setNewTodoLabelcheck("");
    setTodoscheck([]);
    setCheckpointticketmaster({
      category: "Please Select Category",
      subcategory: "Please Select Subcategory",
      type: "Please Select Type",
      reason: "Please Select Reason",
      checkpointgrp: "",
    });
    setSubcategorys([]);
    setValueCat([]);
    setSelectedOptionsReason([]);
    setValueResaon([]);
    setSelectedOptionsCat([]);
    setValueSubCat([]);
    setSelectedOptionsSubCat([]);
    setValueSubSubCat([]);
    setSelectedOptionsSubSubCat([]);
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

  //Edit model...
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };

  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  //category multiselect

  const [selectedOptionsCat, setSelectedOptionsCat] = useState([]);
  let [valueCat, setValueCat] = useState([]);
  const [selectedCategoryOptionsCateEdit, setSelectedCategoryOptionsCateEdit] =
    useState([]);
  const [categoryValueCateEdit, setCategoryValueCateEdit] = useState("");

  const customValueRendererReason = (valueReason) => {
    return valueReason.length ? valueReason.map(({ label }) => label).join(", ") : "Please Select Reason";
  };
  const handleReasonChange = (options) => {
    setValueResaon(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsReason(options);
  };

  const handleCategoryChange = (options) => {
    setValueCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCat(options);
    setValueSubCat([]);
    setSelectedOptionsSubCat([]);
    setValueSubSubCat([]);
    setSelectedOptionsSubSubCat([]);
    setCheckpointticketmaster({
      ...checkpointticketmaster,
      type: "Please Select Type",
      reason: "Please Select Reason",
    });
  };

  const customValueRendererCat = (valueCat, _categoryname) => {
    return valueCat?.length
      ? valueCat.map(({ label }) => label)?.join(", ")
      : "Please Select Category";
  };

  const handleCategoryChangeEdit = (options) => {
    setCategoryValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedCategoryOptionsCateEdit(options);
    setSubCategoryValueCateEdit([]);
    setSelectedSubCategoryOptionsCateEdit([]);
    setSubSubCategoryValueCateEdit([]);
    setSelectedSubSubCategoryOptionsCateEdit([]);
    setCheckpointticketmasterEdit({
      ...checkpointticketmasterEdit,
      type: "Please Select Type",
      reason: "Please Select Reason",
    });
  };
  const customValueRendererCategoryEdit = (
    categoryValueCateEdit,
    _employeename
  ) => {
    return categoryValueCateEdit?.length
      ? categoryValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Category";
  };

  //subcategory multiselect
  const [selectedOptionsSubCat, setSelectedOptionsSubCat] = useState([]);
  let [valueSubCat, setValueSubCat] = useState([]);
  const [
    selectedSubCategoryOptionsCateEdit,
    setSelectedSubCategoryOptionsCateEdit,
  ] = useState([]);
  const [subCategoryValueCateEdit, setSubCategoryValueCateEdit] = useState("");

  const handleSubCategoryChange = (options) => {
    setValueSubCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsSubCat(options);
    setValueSubSubCat([]);
    setSelectedOptionsSubSubCat([]);
    setCheckpointticketmaster({
      ...checkpointticketmaster,
      type: "Please Select Type",
      reason: "Please Select Reason",
    });
  };

  const customValueRendererSubCat = (valueSubCat, _categoryname) => {
    return valueSubCat?.length
      ? valueSubCat.map(({ label }) => label)?.join(", ")
      : "Please Select Sub Category";
  };

  const handleSubCategoryChangeEdit = (options) => {
    setSubCategoryValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedSubCategoryOptionsCateEdit(options);
    setCheckpointticketmasterEdit({
      ...checkpointticketmasterEdit,
      type: "Please Select Type",
      reason: "Please Select Reason",
    });
    setSubSubCategoryValueCateEdit([]);
    setSelectedSubSubCategoryOptionsCateEdit([]);
  };
  const customValueRendererSubCategoryEdit = (
    subCategoryValueCateEdit,
    _employeename
  ) => {
    return subCategoryValueCateEdit?.length
      ? subCategoryValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Sub Category";
  };

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [filteredSubCategoryOptions, setFilteredSubCategoryOptions] = useState(
    []
  );
  const [filteredSubCategoryOptionsEdit, setFilteredSubCategoryOptionsEdit] =
    useState([]);

  useEffect(() => {
    const filteredCategoryOptions = categoryOptions
      ?.filter((u) => valueCat?.includes(u.categoryname))
      .map((u) => ({
        ...u,
        label: u.subcategoryname,
        value: u.subcategoryname,
      }));
    let subcategoryNames = filteredCategoryOptions.flatMap((obj) =>
      obj.subcategoryname.map((subcategory) => ({
        label: subcategory,
        value: subcategory,
      }))
    );
    setFilteredSubCategoryOptions(subcategoryNames);
  }, [valueCat]);

  useEffect(() => {
    const filteredCategoryOptions = categoryOptions
      ?.filter((u) => categoryValueCateEdit?.includes(u.categoryname))
      .map((u) => ({
        ...u,
        label: u.subcategoryname,
        value: u.subcategoryname,
      }));
    let subcategoryNames = filteredCategoryOptions.flatMap((obj) =>
      obj.subcategoryname.map((subcategory) => ({
        label: subcategory,
        value: subcategory,
      }))
    );
    setFilteredSubCategoryOptionsEdit(subcategoryNames);
  }, [categoryValueCateEdit]);

  //sub sub category multiselect

  useEffect(() => {
    let catopt = selectedOptionsCat.map((item) => item.value);
    let subcatopt = selectedOptionsSubCat.map((item) => item.value);
    const filteredCategoryOptions = subSubCategoryOptions
      ?.filter(
        (u) =>
          u.categoryname.some((data) => catopt.includes(data)) &&
          u.subcategoryname.some((data) => subcatopt.includes(data))
      )
      .map((u) => ({
        ...u,
        label: u.subsubname,
        value: u.subsubname,
      }));

    setFilteredSubSubCategoryOptions(filteredCategoryOptions);
  }, [valueCat, valueSubCat]);

  useEffect(() => {
    let catopt = selectedCategoryOptionsCateEdit.map((item) => item.value);
    let subcatopt = selectedSubCategoryOptionsCateEdit.map(
      (item) => item.value
    );
    const filteredCategoryOptions = subSubCategoryOptions
      ?.filter(
        (u) =>
          u.categoryname.some((data) => catopt.includes(data)) &&
          u.subcategoryname.some((data) => subcatopt.includes(data))
      )
      .map((u) => ({
        ...u,
        label: u.subsubname,
        value: u.subsubname,
      }));

    setFilteredSubSubCategoryOptionsEdit(filteredCategoryOptions);
  }, [categoryValueCateEdit, subCategoryValueCateEdit]);

  const [filteredSubSubCategoryOptions, setFilteredSubSubCategoryOptions] =
    useState([]);
  const [
    filteredSubSubCategoryOptionsEdit,
    setFilteredSubSubCategoryOptionsEdit,
  ] = useState([]);

  const [selectedOptionsSubSubCat, setSelectedOptionsSubSubCat] = useState([]);
  let [valueSubSubCat, setValueSubSubCat] = useState([]);
  const [
    selectedSubSubCategoryOptionsCateEdit,
    setSelectedSubSubCategoryOptionsCateEdit,
  ] = useState([]);
  const [subSubCategoryValueCateEdit, setSubSubCategoryValueCateEdit] =
    useState("");

  const handleSubSubCategoryChange = (options) => {
    setValueSubSubCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsSubSubCat(options);
    setCheckpointticketmaster({
      ...checkpointticketmaster,
      type: "Please Select Type",
      reason: "Please Select Reason",
    });
  };

  const customValueRendererSubSubCat = (valueSubSubCat, _categoryname) => {
    return valueSubSubCat?.length
      ? valueSubSubCat.map(({ label }) => label)?.join(", ")
      : "Please Select Sub Sub Category";
  };

  const handleSubSubCategoryChangeEdit = (options) => {
    setSubSubCategoryValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedSubSubCategoryOptionsCateEdit(options);
    setCheckpointticketmasterEdit({
      ...checkpointticketmasterEdit,
      type: "Please Select Type",
      reason: "Please Select Reason",
    });
  };
  const customValueRendererSubSubCategoryEdit = (
    subSubCategoryValueCateEdit,
    _employeename
  ) => {
    return subSubCategoryValueCateEdit?.length
      ? subSubCategoryValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Sub Sub Category";
  };

  const [subSubCategoryOptions, setSubSubCategoryOptions] = useState([]);
  //get all Sub vendormasters.
  const fetchSubsubcomponent = async () => {
    try {
      let res_vendor = await axios.get(SERVICE.SUBSUBCOMPONENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSubSubCategoryOptions(res_vendor?.data?.subsubcomponents);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //type dropdown
  const [typeOptions, setTypeOptions] = useState([]);

  //get single row to edit....
  const getCode = async (e, name) => {
    try {
      let res = await axios.get(`${SERVICE.SELFCHECKPOINTTICKET_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCheckpointticketmasterEdit(res?.data?.sselfcheckpointticketmasters);
      setTodoscheckedit(res?.data?.sselfcheckpointticketmasters.checkpointgrp);
      setCategoryValueCateEdit(
        res?.data?.sselfcheckpointticketmasters?.category
      );
      setSelectedCategoryOptionsCateEdit([
        ...res?.data?.sselfcheckpointticketmasters?.category.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setSubCategoryValueCateEdit(
        res?.data?.sselfcheckpointticketmasters?.subcategory
      );
      setSelectedSubCategoryOptionsCateEdit([
        ...res?.data?.sselfcheckpointticketmasters?.subcategory.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setSubSubCategoryValueCateEdit(
        res?.data?.sselfcheckpointticketmasters?.subsubcategory
      );
      setSelectedSubSubCategoryOptionsCateEdit([
        ...res?.data?.sselfcheckpointticketmasters?.subsubcategory.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  // get single row to view....
  const getviewCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.SELFCHECKPOINTTICKET_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCheckpointticketmasterEdit(res?.data?.sselfcheckpointticketmasters);
      setTodoscheckedit(res?.data?.sselfcheckpointticketmasters.checkpointgrp);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  // get single row to view....
  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.SELFCHECKPOINTTICKET_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCheckpointticketmasterEdit(res?.data?.sselfcheckpointticketmasters);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  useEffect(() => {
    fetchCategoryTicket();
  }, []);

  //Project updateby edit page...
  let updateby = checkpointticketmasterEdit?.updatedby;
  let addedby = checkpointticketmasterEdit?.addedby;

  let subprojectsid = checkpointticketmasterEdit?._id;

  //editing the single data...
  const sendEditRequest = async () => {
    try {
      let res = await axios.put(
        `${SERVICE.SELFCHECKPOINTTICKET_SINGLE}/${subprojectsid}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          category: [...categoryValueCateEdit],
          subcategory: [...subCategoryValueCateEdit],
          subsubcategory: [...subSubCategoryValueCateEdit],
          type: String(checkpointticketmasterEdit.type),
          reason: String(checkpointticketmasterEdit.reason),
          checkpointgrp: [...todoscheckedit],
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      await fetchCheckpointticketmaster();
      setTodoscheckedit([]);
      handleCloseModEdit();
      setShowAlert(
        <>
          {" "}
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Updated Successfully👍"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const editSubmit = async (e) => {
    e.preventDefault();
    let resdata = await fetchCheckpointticketAll();
    let catopt = selectedCategoryOptionsCateEdit.map((item) => item.value);
    let subcatopt = selectedSubCategoryOptionsCateEdit.map(
      (item) => item.value
    );
    let subSubcatopt = selectedSubSubCategoryOptionsCateEdit.map(
      (item) => item.value
    );
    const isNameMatch = resdata.some(
      (item) =>
        item.category.some((data) => catopt.includes(data)) &&
        item.subcategory.some((data) => subcatopt.includes(data)) &&
        (subSubcatopt.length === 0 ||
          item.subsubcategory.some((data) => subSubcatopt.includes(data))) &&
        item.type === String(checkpointticketmasterEdit?.type) &&
        item?.reason.toLowerCase() ===
        String(checkpointticketmasterEdit?.reason.toLowerCase())
    );

    if (categoryValueCateEdit?.length == 0) {
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
    } else if (subCategoryValueCateEdit?.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Sub Category"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      filteredSubSubCategoryOptionsEdit?.length != 0 &&
      subSubCategoryValueCateEdit?.length == 0
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Sub Sub Category"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (checkpointticketmasterEdit.type === "Please Select Type") {
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
    } else if (checkpointticketmasterEdit.reason === "Please Select Reason") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Reason"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (todoscheckedit.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Checkpoint"}
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
            {"Self Checkpoint Ticket Master already exists!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendEditRequest();
    }
  };

  //get all Sub vendormasters.
  const fetchCheckpointticketmaster = async () => {
    try {
      let res_vendor = await axios.get(SERVICE.SELFCHECKPOINTTICKET, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setReasonmastercheck(true);
      setCheckpointticketmasters(res_vendor?.data?.selfcheckpointticketmasters);
    } catch (err) {setReasonmastercheck(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //get all Sub vendormasters.
  const fetchCheckpointticketAll = async () => {
    try {
      let res_check = await axios.get(SERVICE.SELFCHECKPOINTTICKET, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
     return  res_check?.data?.selfcheckpointticketmasters.filter(
      (item) => item._id !== checkpointticketmasterEdit._id
    )
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  // pdf.....
  const columns = [
    { title: "Category", field: "category" },
    { title: "Subcategory", field: "subcategory" },
    { title: "Sub Subcategory", field: "subsubcategory" },
    { title: "Type", field: "type" },
    { title: "Reason", field: "reason" },
    { title: "Checkpointgrp", field: "checkpointgrp" },
  ];



  // Excel
  const fileName = "SelfCheckpointTicketMaster";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "SelfCheckpointTicketMaster",
    pageStyle: "print",
  });

  useEffect(() => {
    fetchCheckpointticketmaster();
    fetchTypemaster();
    fetchReasonmaster();
    fetchCategoryBased();
    fetchSubsubcomponent();
  }, []);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = checkpointticketmasters?.map(
      (item, index) => ({
        serialNumber: index + 1,
        id: item._id,
        category: item.category?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
        subcategory: item.subcategory
          ?.map((t, i) => `${i + 1 + ". "}` + t)
          .toString(),
        subsubcategory: item.subsubcategory
          ?.map((t, i) => `${i + 1 + ". "}` + t)
          .toString(),
        type: item.type,
        reason: item.reason,
        checkpointgrp: item.checkpointgrp
          ?.map((item, i) => `${i + 1 + ". "}` + item.label)
          .toString(),
      })

    );
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [checkpointticketmasters]);

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
      width: 200,
      hide: !columnVisibility.category,
      headerClassName: "bold-header",
    },
    {
      field: "subcategory",
      headerName: "Subcategory",
      flex: 0,
      width: 200,
      hide: !columnVisibility.subcategory,
      headerClassName: "bold-header",
    },
    {
      field: "subsubcategory",
      headerName: "Sub Subcategory",
      flex: 0,
      width: 200,
      hide: !columnVisibility.subsubcategory,
      headerClassName: "bold-header",
    },
    {
      field: "type",
      headerName: "Type",
      flex: 0,
      width: 150,
      hide: !columnVisibility.type,
      headerClassName: "bold-header",
    },
    {
      field: "reason",
      headerName: "Reason",
      flex: 0,
      width: 150,
      hide: !columnVisibility.reason,
      headerClassName: "bold-header",
    },
    {
      field: "checkpointgrp",
      headerName: "Checkpointgrp",
      flex: 0,
      width: 250,
      hide: !columnVisibility.checkpointgrp,
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
          {isUserRoleCompare?.includes("eselfcheckpointticketmaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpenEdit();
                getCode(params.row.id, params.row.name);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dselfcheckpointticketmaster") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id, params.row.name);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vselfcheckpointticketmaster") && (
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
          {isUserRoleCompare?.includes("iselfcheckpointticketmaster") && (
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
    return {
      id: item.id,
      serialNumber: item.serialNumber,
      category: item.category,
      subcategory: item.subcategory,
      subsubcategory: item.subsubcategory,
      type: item.type,
      reason: item.reason,
      checkpointgrp: item.checkpointgrp,
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
      <Headtitle title={"SELF CHECKPOINT TICKET MASTER"} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>
        Self Checkpoint Ticket Master
      </Typography>
      {isUserRoleCompare?.includes("aselfcheckpointticketmaster") && (
        <Box sx={userStyle.dialogbox}>
          <>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  Add Self Checkpoint Ticket Master
                </Typography>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Category<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <MultiSelect
                    options={categorys}
                    value={selectedOptionsCat}
                    onChange={(e) => {
                      handleCategoryChange(e);
                      setSelectedOptionsReason([]);
                      setValueResaon([]);
                    }}
                    valueRenderer={customValueRendererCat}
                    labelledBy="Please Select Category"
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Sub Category<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <MultiSelect
                    options={filteredSubCategoryOptions}
                    value={selectedOptionsSubCat}
                    onChange={(e) => {
                      handleSubCategoryChange(e);
                      setSelectedOptionsReason([]);
                      setValueResaon([]);
                    }}
                    valueRenderer={customValueRendererSubCat}
                    labelledBy="Please Select Sub Category"
                  />
                </FormControl>
              </Grid>
              {filteredSubSubCategoryOptions?.length != 0 && (
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Sub Sub Category
                      <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={filteredSubSubCategoryOptions}
                      value={selectedOptionsSubSubCat}
                      onChange={(e) => {
                        handleSubSubCategoryChange(e);
                        setSelectedOptionsReason([]);
                        setValueResaon([]);
                      }}
                      valueRenderer={customValueRendererSubSubCat}
                      labelledBy="Please Select Sub Sub Category"
                    />
                  </FormControl>
                </Grid>
              )}
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Type<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    maxMenuHeight={250}
                    options={typeOptions
                      ?.filter((u) => {
                        const catMatch = u.categorytype.some((data) =>
                          selectedOptionsCat
                            .map((item) => item.value)
                            .includes(data)
                        );
                        const subCatMatch = u.subcategorytype.some((data) =>
                          selectedOptionsSubCat
                            .map((item) => item.value)
                            .includes(data)
                        );

                        const subSubCatMatch =
                          selectedOptionsSubSubCat.map((item) => item.value)
                            .length === 0 ||
                          u.subsubcategorytype.some((data) =>
                            selectedOptionsSubSubCat
                              .map((item) => item.value)
                              .includes(data)
                          );

                        return (
                          (catMatch && subCatMatch && subSubCatMatch) ||
                          (catMatch && subCatMatch)
                        );
                      })
                      .map((u) => ({
                        ...u,
                        label: u.nametype,
                        value: u.nametype,
                      }))
                      .filter((obj, index, self) => {
                        // Filter out duplicate values based on the 'value' property
                        return (
                          index ===
                          self.findIndex((item) => item.value === obj.value)
                        );
                      })}
                    placeholder="Please Select Type"
                    value={{
                      label: checkpointticketmaster.type,
                      value: checkpointticketmaster.type,
                    }}
                    onChange={(e) => {
                      setCheckpointticketmaster({
                        ...checkpointticketmaster,
                        type: e.value,
                        reason: "Please Select Reason",
                      });
                      setSelectedOptionsReason([]);
                      setValueResaon([]);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Reason<b style={{ color: "red" }}>*</b>
                  </Typography>
                  {/* <Selects
                    options={reasonOptions
                      ?.filter((u) => {
                        const catMatch = u.categoryreason.some((data) =>
                          selectedOptionsCat
                            .map((item) => item.value)
                            .includes(data)
                        );
                        const subCatMatch = u.subcategoryreason.some((data) =>
                          selectedOptionsSubCat
                            .map((item) => item.value)
                            .includes(data)
                        );

                        // Check if subSubcatopt is not empty before applying the filter
                        const subSubCatMatch =
                          selectedOptionsSubSubCat.map((item) => item.value)
                            .length === 0 ||
                          u.subsubcategoryreason.some((data) =>
                            selectedOptionsSubSubCat
                              .map((item) => item.value)
                              .includes(data)
                          );

                        const typematch =
                          u.typereason === checkpointticketmaster.type;

                        return (
                          (catMatch &&
                            subCatMatch &&
                            subSubCatMatch &&
                            typematch) ||
                          (catMatch && subCatMatch && typematch)
                        );
                      })
                      .map((u) => ({
                        ...u,
                        label: u.namereason,
                        value: u.namereason,
                      }))}
                    styles={colourStyles}
                    value={{
                      label: checkpointticketmaster.reason,
                      value: checkpointticketmaster.reason,
                    }}
                    onChange={(e) => {
                      setCheckpointticketmaster({
                        ...checkpointticketmaster,
                        reason: e.value,
                      });
                    }}
                  /> */}

                  <MultiSelect
                    options={reasonOptions
                      ?.filter((u) => {
                        const catMatch = u.categoryreason.some((data) =>
                          selectedOptionsCat
                            .map((item) => item.value)
                            .includes(data)
                        );
                        const subCatMatch = u.subcategoryreason.some((data) =>
                          selectedOptionsSubCat
                            .map((item) => item.value)
                            .includes(data)
                        );

                        // Check if subSubcatopt is not empty before applying the filter
                        const subSubCatMatch =
                          selectedOptionsSubSubCat.map((item) => item.value)
                            .length === 0 ||
                          u.subsubcategoryreason.some((data) =>
                            selectedOptionsSubSubCat
                              .map((item) => item.value)
                              .includes(data)
                          );

                        const typematch =
                          u.typereason === checkpointticketmaster.type;

                        return (
                          (catMatch &&
                            subCatMatch &&
                            subSubCatMatch &&
                            typematch) ||
                          (catMatch && subCatMatch && typematch)
                        );
                      })
                      .map((u) => ({
                        ...u,
                        label: u.namereason,
                        value: u.namereason,
                      }))}
                    value={selectedOptionsReason}
                    onChange={(e) => {
                      handleReasonChange(e);
                    }}

                    valueRenderer={customValueRendererReason}
                    labelledBy="Please Select Reason"
                  />
                </FormControl>
              </Grid>
              <br />
              <Grid item md={12} xs={12} sm={12}>
                <>
                  <br />
                  <Grid container spacing={1}>
                    <Grid item md={4} sm={6} xs={6}>
                      <Typography>
                        Checkpoint<b style={{ color: "red" }}>*</b>
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid item md={4} sm={12} xs={12}>
                      <TextareaAutosize
                        aria-label="maximum height"
                        minRows={3}
                        style={{ width: "100%" }}
                        size="small"
                        variant="outlined"
                        value={newTodoLabelcheck}
                        onChange={(e) =>
                          setNewTodoLabelcheck(String(e.target.value))
                        }
                      />
                      {todoCheck ? (
                        <Typography sx={{ color: "red" }}>
                          please Enter Different name
                        </Typography>
                      ) : (
                        ""
                      )}
                    </Grid>
                    <Grid item md={2} sm={1} xs={1}>
                      {todoCheck ? (
                        ""
                      ) : (
                        <Button
                          variant="contained"
                          style={{
                            height: "30px",
                            minWidth: "20px",
                            padding: "19px 13px",
                            // color: 'white',
                            // background: 'rgb(25, 118, 210)'
                          }}
                          disabled={newTodoLabelcheck == ""}
                          onClick={() => {
                            handleCreateTodocheck();
                          }}
                        >
                          <FaPlus style={{ fontSize: "15px" }} />
                        </Button>
                      )}
                    </Grid>
                  </Grid>

                  <br />
                  <br />
                  <Box>
                    {todoscheck.map((todo, index) => (
                      <div key={index}>
                        {editingIndexcheck === index ? (
                          <Grid container spacing={1}>
                            <Grid item md={3} sm={6} xs={6}>
                              <TextareaAutosize
                                aria-label="maximum height"
                                minRows={3}
                                style={{ width: "100%" }}
                                value={editcheckpoint}
                                onChange={(e) =>
                                  seteditcheckpoint(String(e.target.value))
                                }
                              />
                              {todoCheckCreateEdit ? (
                                <Typography color="red">
                                  Please Enter different name
                                </Typography>
                              ) : (
                                ""
                              )}
                            </Grid>
                            <Grid item md={1.5} sm={1.5} xs={1.5}>
                              {todoCheckCreateEdit ? (
                                ""
                              ) : editedTododescheck !== "" &&
                                editcheckpoint !== "" ? (
                                <Button
                                  variant="contained"
                                  style={{
                                    minWidth: "20px",
                                    minHeight: "41px",
                                    background: "transparent",
                                    boxShadow: "none",
                                    marginTop: "-3px !important",
                                    "&:hover": {
                                      background: "#f4f4f4",
                                      borderRadius: "50%",
                                      minHeight: "41px",
                                      minWidth: "20px",
                                      boxShadow: "none",
                                    },
                                  }}
                                  onClick={handleUpdateTodocheck}
                                >
                                  <CheckCircleIcon
                                    style={{
                                      color: "#216d21",
                                      fontSize: "1.5rem",
                                    }}
                                  />
                                </Button>
                              ) : (
                                ""
                              )}
                            </Grid>
                            <Grid item md={1} sm={1} xs={1}>
                              <Button
                                variant="contained"
                                style={{
                                  minWidth: "20px",
                                  minHeight: "41px",
                                  background: "transparent",
                                  boxShadow: "none",
                                  marginTop: "-3px !important",
                                  "&:hover": {
                                    background: "#f4f4f4",
                                    borderRadius: "50%",
                                    minHeight: "41px",
                                    minWidth: "20px",
                                    boxShadow: "none",
                                  },
                                }}
                                onClick={() => setEditingIndexcheck(-1)}
                              >
                                <CancelIcon
                                  style={{
                                    color: "#b92525",
                                    fontSize: "1.5rem",
                                  }}
                                />
                              </Button>
                            </Grid>
                          </Grid>
                        ) : (
                          <Grid container spacing={1}>
                            <Grid item md={3} sm={3} xs={3}>
                              <Typography
                                variant="subtitle2"
                                color="textSecondary"
                                sx={{
                                  whiteSpace: "pre-line",
                                  wordBreak: "break-all",
                                }}
                              >
                                {todo.label}
                              </Typography>
                            </Grid>
                            <Grid item md={1.5} sm={1.5} xs={1.5}>
                              <Button
                                variant="contained"
                                style={{
                                  minWidth: "20px",
                                  minHeight: "41px",
                                  background: "transparent",
                                  boxShadow: "none",
                                  marginTop: "-13px !important",
                                  "&:hover": {
                                    background: "#f4f4f4",
                                    borderRadius: "50%",
                                    minHeight: "41px",
                                    minWidth: "20px",
                                    boxShadow: "none",
                                  },
                                }}
                                onClick={() => handleEditTodocheck(index)}
                              >
                                <FaEdit
                                  style={{
                                    color: "#1976d2",
                                    fontSize: "1.2rem",
                                  }}
                                />
                              </Button>
                            </Grid>
                            <Grid item md={1} sm={1} xs={1}>
                              <Button
                                variant="contained"
                                style={{
                                  minWidth: "20px",
                                  minHeight: "41px",
                                  background: "transparent",
                                  boxShadow: "none",
                                  marginTop: "-13px !important",
                                  "&:hover": {
                                    background: "#f4f4f4",
                                    borderRadius: "50%",
                                    minHeight: "41px",
                                    minWidth: "20px",
                                    boxShadow: "none",
                                  },
                                }}
                                onClick={() => handleDeleteTodocheck(index)}
                              >
                                <DeleteIcon
                                  style={{
                                    color: "#b92525",
                                    fontSize: "1.2rem",
                                  }}
                                />
                              </Button>
                            </Grid>
                          </Grid>
                        )}
                        <br />
                      </div>
                    ))}
                  </Box>
                </>
              </Grid>
            </Grid>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={2.5} xs={12} sm={6}>
                <LoadingButton
                loading={isBtn}
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  Submit
                </LoadingButton>
              </Grid>
              <Grid item md={2.5} xs={12} sm={6}>
                <Button sx={userStyle.btncancel} onClick={handleClear}>
                  Clear
                </Button>
              </Grid>
            </Grid>
          </>
        </Box>
      )}
      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth={true}
          maxWidth="md"
        // sx={{
        //     overflow: 'visible',
        //     '& .MuiPaper-root': {
        //         overflow: 'visible',
        //     },
        // }}
        >
          <Box sx={{ padding: "20px" }}>
            <>
              <form onSubmit={editSubmit}>
                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={12}>
                    <Typography sx={userStyle.HeaderText}>
                      Edit Self Checkpoint Ticket Master
                    </Typography>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Category<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={categorysEdit}
                        value={selectedCategoryOptionsCateEdit}
                        onChange={handleCategoryChangeEdit}
                        valueRenderer={customValueRendererCategoryEdit}
                        labelledBy="Please Select Category"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Sub Category<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={filteredSubCategoryOptionsEdit}
                        value={selectedSubCategoryOptionsCateEdit}
                        onChange={handleSubCategoryChangeEdit}
                        valueRenderer={customValueRendererSubCategoryEdit}
                        labelledBy="Please Select Sub Category"
                      />
                    </FormControl>
                  </Grid>
                  {filteredSubSubCategoryOptionsEdit?.length != 0 && (
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Sub Sub Category
                          <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={filteredSubSubCategoryOptionsEdit}
                          value={selectedSubSubCategoryOptionsCateEdit}
                          onChange={(e) => {
                            handleSubSubCategoryChangeEdit(e);
                          }}
                          valueRenderer={customValueRendererSubSubCategoryEdit}
                          labelledBy="Please Select Sub Sub Category"
                        />
                      </FormControl>
                    </Grid>
                  )}
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Type<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        maxMenuHeight={250}
                        options={typeOptions
                          ?.filter((u) => {
                            const catMatch = u.categorytype.some((data) =>
                              selectedCategoryOptionsCateEdit
                                .map((item) => item.value)
                                .includes(data)
                            );
                            const subCatMatch = u.subcategorytype.some((data) =>
                              selectedSubCategoryOptionsCateEdit
                                .map((item) => item.value)
                                .includes(data)
                            );

                            // Check if subSubcatopt is not empty before applying the filter
                            const subSubCatMatch =
                              selectedSubSubCategoryOptionsCateEdit.map(
                                (item) => item.value
                              ).length === 0 ||
                              u.subsubcategorytype.some((data) =>
                                selectedSubSubCategoryOptionsCateEdit
                                  .map((item) => item.value)
                                  .includes(data)
                              );

                            return (
                              (catMatch && subCatMatch && subSubCatMatch) ||
                              (catMatch && subCatMatch)
                            );
                          })
                          .map((u) => ({
                            ...u,
                            label: u.nametype,
                            value: u.nametype,
                          }))
                          .filter((obj, index, self) => {
                            // Filter out duplicate values based on the 'value' property
                            return (
                              index ===
                              self.findIndex((item) => item.value === obj.value)
                            );
                          })}
                        placeholder="Please Select Type"
                        value={{
                          label: checkpointticketmasterEdit.type,
                          value: checkpointticketmasterEdit.type,
                        }}
                        onChange={(e) => {
                          setCheckpointticketmasterEdit({
                            ...checkpointticketmasterEdit,
                            type: e.value,
                            reason: "Please Select Reason",
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Reason<b style={{ color: "red" }}>*</b>
                      </Typography>

                      <Selects
                        options={reasonOptions
                          ?.filter((u) => {
                            const catMatch = u.categoryreason.some((data) =>
                              selectedCategoryOptionsCateEdit
                                .map((item) => item.value)
                                .includes(data)
                            );
                            const subCatMatch = u.subcategoryreason.some(
                              (data) =>
                                selectedSubCategoryOptionsCateEdit
                                  .map((item) => item.value)
                                  .includes(data)
                            );

                            // Check if subSubcatopt is not empty before applying the filter
                            const subSubCatMatch =
                              selectedSubSubCategoryOptionsCateEdit.map(
                                (item) => item.value
                              ).length === 0 ||
                              u.subsubcategoryreason.some((data) =>
                                selectedSubSubCategoryOptionsCateEdit
                                  .map((item) => item.value)
                                  .includes(data)
                              );

                            const typematch =
                              u.typereason === checkpointticketmasterEdit.type;

                            return (
                              (catMatch &&
                                subCatMatch &&
                                subSubCatMatch &&
                                typematch) ||
                              (catMatch && subCatMatch && typematch)
                            );
                          })
                          .map((u) => ({
                            ...u,
                            label: u.namereason,
                            value: u.namereason,
                          }))}
                        styles={colourStyles}
                        value={{
                          label: checkpointticketmasterEdit.reason,
                          value: checkpointticketmasterEdit.reason,
                        }}
                        onChange={(e) => {
                          setCheckpointticketmasterEdit({
                            ...checkpointticketmasterEdit,
                            reason: e.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={12} xs={12} sm={12}>
                    <>
                      <br />
                      <Grid container spacing={1}>
                        <Grid item md={5} sm={12} xs={12}>
                          <Typography>
                            Checkpoint<b style={{ color: "red" }}>*</b>
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid container spacing={1}>
                        <Grid item md={5} sm={12} xs={12}>
                          <TextareaAutosize
                            aria-label="maximum height"
                            minRows={3}
                            style={{ width: "100%" }}
                            value={newTodoLabelcheckedit}
                            onChange={(e) =>
                              setNewTodoLabelcheckedit(String(e.target.value))
                            }
                          />
                          {todoCheckEdit ? (
                            <Typography sx={{ color: "red" }}>
                              please Enter Different name
                            </Typography>
                          ) : (
                            ""
                          )}
                        </Grid>
                        <Grid item md={2} sm={1} xs={1}>
                          {todoCheckEdit ? (
                            ""
                          ) : (
                            <Button
                              variant="contained"
                              style={{
                                height: "30px",
                                minWidth: "20px",
                                padding: "19px 13px",
                                // color: 'white',
                                // background: 'rgb(25, 118, 210)'
                              }}
                              disabled={newTodoLabelcheckedit == ""}
                              onClick={handleCreateTodocheckedit}
                            >
                              <FaPlus style={{ fontSize: "15px" }} />
                            </Button>
                          )}
                        </Grid>
                      </Grid>

                      <br />
                      <br />
                      <Box>
                        {todoscheckedit.map((todo, index) => (
                          <div key={index}>
                            {editingIndexcheckedit === index ? (
                              <Grid container spacing={2}>
                                <Grid item md={3} sm={6} xs={6}>
                                  <TextareaAutosize
                                    aria-label="maximum height"
                                    minRows={3}
                                    style={{ width: "100%" }}
                                    value={editcheckpointedit}
                                    onChange={(e) =>
                                      seteditcheckpointedit(
                                        String(e.target.value)
                                      )
                                    }
                                  />
                                  {todoCheckEditededit ? (
                                    <Typography color="red">
                                      Please Enter different name
                                    </Typography>
                                  ) : (
                                    ""
                                  )}
                                </Grid>

                                <Grid item md={1.5} sm={1.5} xs={1.5}>
                                  {(editcheckpointedit == "" || todoCheckEditededit) ? "" : 
                                  <Button
                                    variant="contained"
                                    style={{
                                      minWidth: "20px",
                                      minHeight: "41px",
                                      background: "transparent",
                                      boxShadow: "none",
                                      marginTop: "-3px !important",
                                      "&:hover": {
                                        background: "#f4f4f4",
                                        borderRadius: "50%",
                                        minHeight: "41px",
                                        minWidth: "20px",
                                        boxShadow: "none",
                                      },
                                    }}
                                    onClick={handleUpdateTodocheckedit}
                                  >
                                    <CheckCircleIcon
                                      style={{
                                        color: "#216d21",
                                        fontSize: "1.5rem",
                                      }}
                                    />
                                  </Button>
}

                                </Grid>
                                <Grid item md={1} sm={1} xs={1}>
                                  <Button
                                    variant="contained"
                                    style={{
                                      minWidth: "20px",
                                      minHeight: "41px",
                                      background: "transparent",
                                      boxShadow: "none",
                                      marginTop: "-3px !important",
                                      "&:hover": {
                                        background: "#f4f4f4",
                                        borderRadius: "50%",
                                        minHeight: "41px",
                                        minWidth: "20px",
                                        boxShadow: "none",
                                      },
                                    }}
                                    onClick={() => setEditingIndexcheckedit(-1)}
                                  >
                                    <CancelIcon
                                      style={{
                                        color: "#b92525",
                                        fontSize: "1.5rem",
                                      }}
                                    />
                                  </Button>
                                </Grid>
                              </Grid>
                            ) : (
                              <Grid container spacing={1}>
                                <Grid item md={3} sm={3} xs={3}>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                    sx={{
                                      whiteSpace: "pre-line",
                                      wordBreak: "break-all",
                                    }}
                                  >
                                    {todo.label}
                                  </Typography>
                                </Grid>
                                <Grid item md={1.5} sm={1.5} xs={1.5}>
                                  <Button
                                    variant="contained"
                                    style={{
                                      minWidth: "20px",
                                      minHeight: "41px",
                                      background: "transparent",
                                      boxShadow: "none",
                                      marginTop: "-13px !important",
                                      "&:hover": {
                                        background: "#f4f4f4",
                                        borderRadius: "50%",
                                        minHeight: "41px",
                                        minWidth: "20px",
                                        boxShadow: "none",
                                      },
                                    }}
                                    onClick={() =>
                                      handleEditTodocheckedit(index)
                                    }
                                  >
                                    <FaEdit
                                      style={{
                                        color: "#1976d2",
                                        fontSize: "1.2rem",
                                      }}
                                    />
                                  </Button>
                                </Grid>
                                <Grid item md={1} sm={1} xs={1}>
                                  <Button
                                    variant="contained"
                                    style={{
                                      minWidth: "20px",
                                      minHeight: "41px",
                                      background: "transparent",
                                      boxShadow: "none",
                                      marginTop: "-13px !important",
                                      "&:hover": {
                                        background: "#f4f4f4",
                                        borderRadius: "50%",
                                        minHeight: "41px",
                                        minWidth: "20px",
                                        boxShadow: "none",
                                      },
                                    }}
                                    onClick={() =>
                                      handleDeleteTodocheckedit(index)
                                    }
                                  >
                                    <DeleteIcon
                                      style={{
                                        color: "#b92525",
                                        fontSize: "1.2rem",
                                      }}
                                    />
                                  </Button>
                                </Grid>
                              </Grid>
                            )}
                            <br />
                          </div>
                        ))}
                      </Box>
                    </>
                  </Grid>
                </Grid>
                <br />

                <br />

                <Grid container spacing={2}>
                  <Grid item md={6} xs={6} sm={6}>
                    <Button
                      variant="contained"
                      type="submit"
                      disabled={editingIndexcheckedit != -1}
                    >
                      Update
                    </Button>
                  </Grid>
                  <Grid item md={6} xs={6} sm={6}>
                    <Button
                      sx={userStyle.btncancel}
                      onClick={() => {
                        setEditingIndexcheckedit(-1);
                        handleCloseModEdit();
                      }}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
                {/* </DialogContent> */}
              </form>
            </>
          </Box>
        </Dialog>
      </Box>
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lselfcheckpointticketmaster") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Self Checkpoint Ticket Master List
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
                    "excelselfcheckpointticketmaster"
                  ) && (
                      // <>
                      //   <ExportXL
                      //     csvData={filteredData?.map((t, index) => ({
                      //       Sno: index + 1,
                      //       Category: t.category
                      //         ?.map((t, i) => `${i + 1 + ". "}` + t)
                      //         .toString(),
                      //       Subcategory: t.subcategory
                      //         ?.map((t, i) => `${i + 1 + ". "}` + t)
                      //         .toString(),
                      //       SubSubcategory: t.subsubcategory
                      //         ?.map((t, i) => `${i + 1 + ". "}` + t)
                      //         .toString(),
                      //       Type: t.type,
                      //       Reason: t.reason,
                      //       checkpointgrp: t.checkpointgrp
                      //         ?.map((t, i) => `${i + 1 + ". "}` + t.label)
                      //         .toString(),
                      //     }))}
                      //     fileName={fileName}
                      //   />
                      // </>
                      <>
                        <Button onClick={(e) => {
                          setIsFilterOpen(true)
                          setFormat("xl")
                        }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                      </>

                    )}
                  {isUserRoleCompare?.includes(
                    "csvselfcheckpointticketmaster"
                  ) && (
                      // <>
                      //   <ExportCSV
                      //     csvData={filteredData?.map((t, index) => ({
                      //       Sno: index + 1,
                      //       Category: t.category
                      //         ?.map((t, i) => `${i + 1 + ". "}` + t)
                      //         .toString(),
                      //       Subcategory: t.subcategory
                      //         ?.map((t, i) => `${i + 1 + ". "}` + t)
                      //         .toString(),
                      //       SubSubcategory: t.subsubcategory
                      //         ?.map((t, i) => `${i + 1 + ". "}` + t)
                      //         .toString(),
                      //       Type: t.type,
                      //       Reason: t.reason,
                      //       checkpointgrp: t.checkpointgrp
                      //         ?.map((t, i) => `${i + 1 + ". "}` + t.label)
                      //         .toString(),
                      //     }))}
                      //     fileName={fileName}
                      //   />
                      // </>

                      <>
                        <Button onClick={(e) => {
                          setIsFilterOpen(true)
                          setFormat("csv")
                        }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                      </>


                    )}
                  {isUserRoleCompare?.includes(
                    "printselfcheckpointticketmaster"
                  ) && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                  {isUserRoleCompare?.includes(
                    "pdfselfcheckpointticketmaster"
                  ) && (
                      // <>
                      //   <Button
                      //     sx={userStyle.buttongrp}
                      //     onClick={() => downloadPdf()}
                      //   >
                      //     <FaFilePdf />
                      //     &ensp;Export to PDF&ensp;
                      //   </Button>
                      // </>

                      <>
                        <Button sx={userStyle.buttongrp}
                          onClick={() => {
                            setIsPdfFilterOpen(true)
                          }}                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                      </>
                    )}
                  {isUserRoleCompare?.includes(
                    "imageselfcheckpointticketmaster"
                  ) && (
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
            {isUserRoleCompare?.includes("bdselfcheckpointticketmaster") && (
              <Button
                variant="contained"
                color="error"
                onClick={handleClickOpenalert}
              >
                Bulk Delete
              </Button>
            )}
            <br />
            <br />
            {!reasonmasterCheck ? (
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
        {/* ALERT DIALOG */}
        <Dialog
          open={isDeleteOpen}
          onClose={handleCloseMod}
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
            <Button onClick={handleCloseMod} sx={userStyle.btncancel}>
              Cancel
            </Button>
            <Button
              autoFocus
              variant="contained"
              color="error"
              onClick={(e) => delCheckpointticket(Checkpointticketsid)}
            >
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>

        {/* this is info view details */}

        <Dialog
          open={openInfo}
          onClose={handleCloseinfo}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <Box sx={{ width: "550px", padding: "20px 50px" }}>
            <>
              <Typography sx={userStyle.HeaderText}>
                Self Checkpoint Ticket Master Info
              </Typography>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">addedby</Typography>
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
        {/* print layout */}

        <TableContainer component={Paper} sx={userStyle.printcls}>
          <Table
            sx={{ minWidth: 700 }}
            aria-label="customized table"
            id="usertable"
            ref={componentRef}
          >
            <TableHead>
              <TableRow>
                <TableCell> SI.No</TableCell>
                <TableCell> Category</TableCell>
                <TableCell>Subcategory</TableCell>
                <TableCell>Sub Subcategory</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Checkpoint</TableCell>
              </TableRow>
            </TableHead>
            <TableBody align="left">
              {filteredData &&
                filteredData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {row.category}
                    </TableCell>
                    <TableCell>
                      {row.subcategory}
                    </TableCell>
                    <TableCell>
                      {row.subsubcategory}
                    </TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.reason}</TableCell>
                    <TableCell>
                      {row.checkpointgrp}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
      >
        <Box sx={{ width: "750px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Self Checkpoint Ticket Master
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Category</Typography>
                  <Typography>
                    {checkpointticketmasterEdit.category
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Subcategory</Typography>
                  <Typography>
                    {checkpointticketmasterEdit.subcategory
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Sub Subcategory</Typography>
                  <Typography>
                    {checkpointticketmasterEdit.subsubcategory
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Type</Typography>
                  <Typography>{checkpointticketmasterEdit.type}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Reason</Typography>
                  <Typography>{checkpointticketmasterEdit.reason}</Typography>
                </FormControl>
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
                sm={12}
                sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}
              >
                <Typography variant="h6">Checkpoint</Typography>
                <Typography>
                  {todoscheckedit
                    ?.map((item, i) => `${i + 1 + ". "}` + item.label)
                    .toString()}
                </Typography>
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

      {/* <Box>
        <Dialog
          open={isDeleteOpencheckbox}
          onClose={handleCloseModcheckbox}
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
            <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
              Cancel
            </Button>
            <Button
              autoFocus
              variant="contained"
              color="error"
              onClick={(e) => delCheckpointticketcheckbox(e)}
            >
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box> */}
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
                                    onClick={(e) => delCheckpointticketcheckbox(e)}
                                > OK </Button>
                            </>
                            :
                            <Button variant="contained" color='error' onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>Ok</Button>
                        }
                    </DialogActions>
                </Dialog>

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
      {/* Check delete Modal */}
      <Box>
        <>
          <Box>
            {/* ALERT DIALOG */}
            <Dialog open={isCheckOpen} onClose={handleCloseCheck} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
              <DialogContent
                sx={{
                  width: "350px",
                  textAlign: "center",
                  alignItems: "center",
                }}
              >
                <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                  {getOverAllCountDelete}
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
          {fileFormat === "xl" ? <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
            :
            <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
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
    </Box>
  );
}

export default SelfCheckPointTicketMaster;