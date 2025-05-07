import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  InputLabel,
  TableBody,
  TableRow,
  Checkbox,
  TextField,
  TableCell,
  Select,
  Paper,
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Table,
  TableHead,
  TableContainer,
  Button,
  List,
  ListItem,
  ListItemText,
  Popover,
  IconButton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { userStyle, colourStyles } from "../../../../pageStyle";
import { handleApiError } from "../../../../components/Errorhandling";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { FaPrint, FaFilePdf, FaPlus, FaEdit } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import StyledDataGrid from "../../../../components/TableStyle";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Selects from "react-select";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { UserRoleAccessContext } from "../../../../context/Appcontext";
import { AuthContext } from "../../../../context/Appcontext";
import Headtitle from "../../../../components/Headtitle";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import { MultiSelect } from "react-multi-select-component";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import CloseIcon from "@mui/icons-material/Close";

function Roleandres() {
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
        filteredData.map((item, index) => ({
          "S.No": index + 1,
          category: item.category.map((t) => t).join(","),
          subcategory: item.subcategory.map((t) => t).join(","),
          designationgroup: item.designationgroup.join(","),
          designation: item.designation.join(","),
          description: convertToNumberedList(item.description),
        })),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        allRoleAndRes?.map((item, index) => ({
          "S.No": index + 1,
          category: item.category.map((t) => t).join(","),
          subcategory: item.subcategory.map((t) => t).join(","),
          designationgroup: item.designationgroup.join(","),
          designation: item.designation.join(","),
          description: convertToNumberedList(item.description),
        })),
        fileName
      );
    }

    setIsFilterOpen(false);
  };

  // pdf.....
  const columns = [
    { title: "Category", field: "category" },
    { title: "SubCategory", field: "subcategory" },
    { title: "Designation Group", field: "designationgroup" },
    { title: "Designation", field: "designation" },
    { title: "Description", field: "description" },
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
        ? filteredData.map((item, index) => ({
            serialNumber: index + 1,
            category: item.category.map((t) => t).join(","),
            subcategory: item.subcategory.map((t) => t).join(","),
            designationgroup: item.designationgroup.join(","),
            designation: item.designation.join(","),
            description: convertToNumberedList(item.description),
          }))
        : allRoleAndRes?.map((item, index) => ({
            serialNumber: index + 1,
            category: item.category.map((t) => t).join(","),
            subcategory: item.subcategory.map((t) => t).join(","),
            designationgroup: item.designationgroup.join(","),
            designation: item.designation.join(","),
            description: convertToNumberedList(item.description),
          }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: "5" },
    });

    doc.save("Roles Of Responsibilities.pdf");
  };

  let today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + "-" + mm + "-" + dd;

  const gridRef = useRef(null);

  const { auth } = useContext(AuthContext);
  const { isUserRoleCompare, isUserRoleAccess } = useContext(
    UserRoleAccessContext
  );

  const [selectedOptionsCategoryAdd, setSelectedOptionsCategoryAdd] = useState(
    []
  );
  const [selectedOptionsCategoryEdit, setSelectedOptionsCategoryEdit] =
    useState([]);

  let [valueCategoryAdd, setValueCategoryAdd] = useState("");

  const [selectedOptionssubcatAdd, setSelectedOptionssubcatAdd] = useState([]);
  const [selectedOptionssubcatEdit, setSelectedOptionssubcatEdit] = useState(
    []
  );
  let [valueSubCategoryAdd, setValueSubCategoryAdd] = useState("");

  const [selectedRows, setSelectedRows] = useState([]);

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  // Add multi select
  const handleCategoryChangeAdd = (options) => {
    setValueCategoryAdd(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCategoryAdd(options);
  };
  const customValueRendererCategoryAdd = (valueCompanyAdd, _companies) => {
    return valueCompanyAdd?.length ? (
      valueCompanyAdd?.map(({ label }) => label).join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Category </span>
    );
  };

  // Edit multi select
  const handleCategoryChangeEdit = (options) => {
    // fetchSubCategoryEdit(options);
    setSelectedOptionsCategoryEdit(options);
    setSelectedOptionssubcatEdit([]);
  };
  const customValueRendererCategoryEdit = (valueCate, _categories) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Category";
  };

  // Add multi select
  const handleSubCategoryChange = (options) => {
    setValueSubCategoryAdd(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionssubcatAdd(options);
  };
  const customValueRendererSubCategory = (valueCompanyAdd, _companies) => {
    return valueCompanyAdd?.length ? (
      valueCompanyAdd?.map(({ label }) => label).join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>
        Please Select Subcategory{" "}
      </span>
    );
  };

  // Edit multi select
  const handleSubCategoryChangeEdit = (options) => {
    setSelectedOptionssubcatEdit(options);
  };
  const customValueRendererSubCategoryEdit = (valueCate, _categories) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Subcategory";
  };

  const [allRoleAndRes, setAllRoleAndRes] = useState([]);
  const [categoryOptions, SetcategoryOptions] = useState([]);
  const [subcategoryOptions, setsubcategoryOptions] = useState([]);
  const [subcategoryOptionsEdit, setsubcategoryOptionsEdit] = useState([]);

  const frequencyOpt = [
    { label: "Daily", value: "Daily" },
    { label: "Weekly", value: "Weekly" },
    { label: "Monthly", value: "Monthly" },
    { label: "Date Wise", value: "Date Wise" },
    { label: "Day Wise", value: "Day Wise" },
    { label: "Month Wise", value: "Month Wise" },
  ];
  const typeOptions = [
    { label: "Fixed", value: "Fixed" },
    { label: "Anytime", value: "Anytime" },
  ];

  const [roleAndResAdd, setRoleAndResAdd] = useState({
    frequency: "Please Select Frequency",
    designation: "",
    designationgroup: "",
    type: "Please Select Type",
    days: "",
    date: formattedDate,
    timetype: "AM",
    hour: "",
    min: "",
  });
  const [roleAndResAddEditcheck, setRoleAndResAddEditcheck] = useState({
    frequency: "Please Select Frequency",
    designation: "",
    designationgroup: "",
    type: "Please Select Type",
    days: "",
    date: formattedDate,
    timetype: "AM",
    hour: "",
    min: "",
  });
  const [roleAndResAddEdit, setRoleAndResAddEdit] = useState([]);
  const [roleAndResEdittodo, setRoleAndResEdittodo] = useState([]);
  const [roleAndResAddEdittodo, setRoleAndResAddEdittodo] = useState([]);

  const [roleAndResEdit, setRoleAndResEdit] = useState({});
  const [designations, setDesignations] = useState([]);
  const [designationGroups, setDesignationGroups] = useState([]);
  const [designationGroupsEdit, setDesignationGroupsEdit] = useState([]);
  const [designationsEdit, setDesignationsEdit] = useState([]);
  const [roleAndResTextArea, setRoleAndResTextArea] = useState("");
  const [roleAndResTextAreaEdit, setRoleAndResTextAreaEdit] = useState("");
  const handleRoleAndResponse = (value) => {
    setRoleAndResTextArea(value);
  };

  const handleRoleAndResponseEdit = (value) => {
    setRoleAndResTextAreaEdit(value);
  };

  // Todo list

  const [todoscheck, setTodoscheck] = useState([]);
  const [editingIndexcheck, setEditingIndexcheck] = useState(-1);
  const [editedTododescheck, setEditedTododescheck] = useState(0);
  const [editcheckpoint, seteditcheckpoint] = useState("");
  const [newTodoLabelcheck, setNewTodoLabelcheck] = useState("");

  const [deverrormsg, setdeverrormsg] = useState("");

  const handleCreateTodocheck = () => {
    const newTodocheck = {
      frequency: roleAndResAdd.frequency,
      type: roleAndResAdd.type,
      hour:
        ["Daily", "Day Wise", "Date Wise"].includes(roleAndResAdd.frequency) &&
        roleAndResAdd.type === "Fixed"
          ? roleAndResAdd.hour
          : "",
      min:
        ["Daily", "Day Wise", "Date Wise"].includes(roleAndResAdd.frequency) &&
        roleAndResAdd.type === "Fixed"
          ? roleAndResAdd.min
          : "",
      timetype:
        ["Daily", "Day Wise", "Date Wise"].includes(roleAndResAdd.frequency) &&
        roleAndResAdd.type === "Fixed"
          ? roleAndResAdd.timetype
          : "",
      date:
        ["Monthly", "Month Wise"].includes(roleAndResAdd.frequency) &&
        roleAndResAdd.type === "Fixed"
          ? roleAndResAdd.date
          : "",
      days:
        roleAndResAdd.type === "Fixed" && roleAndResAdd.frequency === "Weekly"
          ? valueCate
          : "",
    };

    const isDuplicate = todoscheck.some(
      (todo) =>
        todo.frequency === newTodocheck.frequency &&
        todo.type === newTodocheck.type &&
        ((newTodocheck.hour === "" && todo.hour === "") ||
          (newTodocheck.hour !== "" && todo.hour === newTodocheck.hour)) &&
        ((newTodocheck.min === "" && todo.min === "") ||
          (newTodocheck.min !== "" && todo.min === newTodocheck.min)) &&
        ((newTodocheck.timetype === "" && todo.timetype === "") ||
          (newTodocheck.timetype !== "" &&
            todo.timetype === newTodocheck.timetype)) &&
        ((newTodocheck.date === "" && todo.date === "") ||
          (newTodocheck.date !== "" && todo.date === newTodocheck.date)) &&
        // (newTodocheck.days === "" && todo.days === "") ||
        // (newTodocheck.days !== "" && todo.days === newTodocheck.days)

        ((newTodocheck.days.length == 0 && todo.days.length == 0) ||
          (newTodocheck.days.length > 0 &&
            todo.days.some((item) =>
              newTodocheck.days.map((item) => item).includes(item)
            )))
    );

    if (roleAndResAdd.frequency == "Please Select Frequency") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Frequency"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (roleAndResAdd.type == "Please Select Type") {
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
    } else if (isDuplicate) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Already Exist "}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      // If not a duplicate, add the newTodocheck to the todoscheck array
      setdeverrormsg("");
      setTodoscheck([...todoscheck, newTodocheck]);
      setNewTodoLabelcheck("");
    }
  };

  const handleDeleteTodocheck = (index) => {
    const newTodoscheck = [...todoscheck];
    newTodoscheck.splice(index, 1);
    setTodoscheck(newTodoscheck);
  };

  const handleEditTodocheck = (index) => {
    setEditingIndexcheck(index);
    setRoleAndResAddEdit({
      ...roleAndResAddEdit,
      frequency: todoscheck[index].frequency,
      type: todoscheck[index].type,
      hour: todoscheck[index].hour,
      min: todoscheck[index].min,
      timetype: todoscheck[index].timetype,
      date: todoscheck[index].date,
    });

    // setSelectedOptionsCatetodoEdit(todoscheck[index]?.days?.map((item) => ({
    //   ...item,
    //   label: item,
    //   value: item,
    // })));
    const daysArray = Array.isArray(todoscheck[index]?.days)
      ? todoscheck[index]?.days
      : [];

    setSelectedOptionsCatetodoEdit(
      daysArray.map((item) => ({
        ...item,
        label: item,
        value: item,
      }))
    );
  };

  const handleUpdateTodocheck = () => {
    const frequency = roleAndResAddEdit.frequency;
    const type = roleAndResAddEdit.type;
    const hour = roleAndResAddEdit.hour;
    const min = roleAndResAddEdit.min;
    const timetype = roleAndResAddEdit.timetype;
    const date = roleAndResAddEdit.date;
    const days = selectedOptionsCatetodoEdit
      ? selectedOptionsCatetodoEdit.map((item) => item.value)
      : "";

    const updatedTodo = {
      frequency,
      type,
      hour,
      min,
      timetype,
      date,
      days,
    };

    const isDuplicate = todoscheck.some(
      (todo, index) =>
        index !== editingIndexcheck &&
        ((todo.frequency === updatedTodo.frequency &&
          todo.type === updatedTodo.type &&
          todo.hour === updatedTodo.hour &&
          (todo.min === updatedTodo.min ||
            (todo.min === "" && updatedTodo.min === "")) &&
          (todo.timetype === updatedTodo.timetype ||
            (todo.timetype === "" && updatedTodo.timetype === "")) &&
          (todo.date === updatedTodo.date ||
            (todo.date === "" && updatedTodo.date === ""))) ||
          (todo.frequency === updatedTodo.frequency &&
            todo.type === updatedTodo.type &&
            todo.days &&
            updatedTodo.days &&
            todo.days.length === updatedTodo.days.length &&
            todo.days.every(
              (value, index) => value === updatedTodo.days[index]
            )))
    );

    if (!isDuplicate) {
      const newTodoscheck = [...todoscheck];
      newTodoscheck[editingIndexcheck] = roleAndResAddEdit;
      setTodoscheck(newTodoscheck);
      setEditingIndexcheck(-1);
      setRoleAndResAddEdit({});
      setEditedTododescheck(0);
      setSelectedOptionsCatetodoEdit([]);
    } else {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Already added . Please choose different values "}
          </p>
        </>
      );
      handleClickOpenerr();
    }
  };

  //edit

  const [todoscheckedit, setTodoscheckedit] = useState([]);
  const [editingIndexcheckedit, setEditingIndexcheckedit] = useState(-1);
  const [editcheckpointedit, seteditcheckpointedit] = useState("");
  const [newTodoLabelcheckedit, setNewTodoLabelcheckedit] = useState("");

  const [deverrormsgedit, setdeverrormsgedit] = useState("");

  const handleCreateTodocheckedit = () => {
    const newTodoscheckedit = {
      frequency: roleAndResAddEditcheck.frequency,
      type: roleAndResAddEditcheck.type,
      hour:
        ["Daily", "Day Wise", "Date Wise"].includes(
          roleAndResAddEditcheck.frequency
        ) && roleAndResAddEditcheck.type === "Fixed"
          ? roleAndResAddEditcheck.hour
          : "",
      min:
        ["Daily", "Day Wise", "Date Wise"].includes(
          roleAndResAddEditcheck.frequency
        ) && roleAndResAddEditcheck.type === "Fixed"
          ? roleAndResAddEditcheck.min
          : "",
      timetype:
        ["Daily", "Day Wise", "Date Wise"].includes(
          roleAndResAddEditcheck.frequency
        ) && roleAndResAddEditcheck.type === "Fixed"
          ? roleAndResAddEditcheck.timetype
          : "",
      date:
        ["Monthly", "Month Wise"].includes(roleAndResAddEditcheck.frequency) &&
        roleAndResAddEditcheck.type === "Fixed"
          ? roleAndResAddEditcheck.date
          : "",
      days:
        roleAndResAddEditcheck.type === "Fixed" &&
        roleAndResAddEditcheck.frequency === "Weekly"
          ? valueCateEdit
          : "",
    };

    const isDuplicate = todoscheckedit.some(
      (todo) =>
        todo.frequency === newTodoscheckedit.frequency &&
        todo.type === newTodoscheckedit.type &&
        ((newTodoscheckedit.hour === "" && todo.hour === "") ||
          (newTodoscheckedit.hour !== "" &&
            todo.hour === newTodoscheckedit.hour)) &&
        ((newTodoscheckedit.min === "" && todo.min === "") ||
          (newTodoscheckedit.min !== "" &&
            todo.min === newTodoscheckedit.min)) &&
        ((newTodoscheckedit.timetype === "" && todo.timetype === "") ||
          (newTodoscheckedit.timetype !== "" &&
            todo.timetype === newTodoscheckedit.timetype)) &&
        ((newTodoscheckedit.date === "" && todo.date === "") ||
          (newTodoscheckedit.date !== "" &&
            todo.date === newTodoscheckedit.date)) &&
        // (newTodoscheckedit.days === "" && todo.days === "") ||
        // (newTodoscheckedit.days !== "" && todo.days === newTodoscheckedit.days)

        ((newTodoscheckedit.days.length == 0 && todo.days.length == 0) ||
          (newTodoscheckedit.days.length > 0 &&
            todo.days.some((item) =>
              newTodoscheckedit.days.map((item) => item).includes(item)
            )))
    );

    if (isDuplicate) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Already Exist "}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      // If not a duplicate, add the newTodocheck to the todoscheck array
      setdeverrormsgedit("");
      setTodoscheckedit([...todoscheckedit, newTodoscheckedit]);
      setNewTodoLabelcheckedit("");
    }
  };

  const handleDeleteTodocheckedit = (index) => {
    const newTodoscheckedit = [...todoscheckedit];
    newTodoscheckedit.splice(index, 1);
    setTodoscheckedit(newTodoscheckedit);
  };

  const handleEditTodocheckedit = (index) => {
    setEditingIndexcheckedit(index);
    setRoleAndResEdittodo({
      ...roleAndResEdittodo,
      frequency: todoscheckedit[index].frequency,
      type: todoscheckedit[index].type,
      hour: todoscheckedit[index].hour,
      min: todoscheckedit[index].min,
      timetype: todoscheckedit[index].timetype,
      date: todoscheckedit[index].date,
    });

    // setSelectedOptionsCatetodoEdit(todoscheck[index]?.days?.map((item) => ({
    //   ...item,
    //   label: item,
    //   value: item,
    // })));
    const daysArray = Array.isArray(todoscheckedit[index]?.days)
      ? todoscheckedit[index]?.days
      : [];

    setSelectedOptionsCateEdittodoedit(
      daysArray.map((item) => ({
        ...item,
        label: item,
        value: item,
      }))
    );
  };

  const handleUpdateTodocheckedit = () => {
    const frequency = roleAndResEdittodo.frequency;
    const type = roleAndResEdittodo.type;
    const hour = roleAndResEdittodo.hour;
    const min = roleAndResEdittodo.min;
    const timetype = roleAndResEdittodo.timetype;
    const date = roleAndResEdittodo.date;
    const days = selectedOptionsCateEdittodoedit
      ? selectedOptionsCateEdittodoedit.map((item) => item.value)
      : "";

    const updatedTodo = {
      frequency,
      type,
      hour,
      min,
      timetype,
      date,
      days,
    };

    const isDuplicate = todoscheckedit.some(
      (todo, index) =>
        index !== editingIndexcheckedit &&
        ((todo.frequency === updatedTodo.frequency &&
          todo.type === updatedTodo.type &&
          todo.hour === updatedTodo.hour &&
          (todo.min === updatedTodo.min ||
            (todo.min === "" && updatedTodo.min === "")) &&
          (todo.timetype === updatedTodo.timetype ||
            (todo.timetype === "" && updatedTodo.timetype === "")) &&
          (todo.date === updatedTodo.date ||
            (todo.date === "" && updatedTodo.date === ""))) ||
          (todo.frequency === updatedTodo.frequency &&
            todo.type === updatedTodo.type &&
            todo.days &&
            updatedTodo.days &&
            todo.days.length === updatedTodo.days.length &&
            todo.days.every(
              (value, index) => value === updatedTodo.days[index]
            )))
    );

    // const isDuplicate = todoscheckedit.some((todo,index) => (

    //   index !== editingIndexcheckedit &&

    //   todo.frequency === roleAndResEdittodo.frequency &&
    //   todo.type === roleAndResEdittodo.type &&
    //   (
    //     (roleAndResEdittodo.hour === "" && todo.hour === "") ||
    //     (roleAndResEdittodo.hour !== "" && todo.hour === roleAndResEdittodo.hour)
    //   ) &&
    //   (
    //     (roleAndResEdittodo.min === "" && todo.min === "") ||
    //     (roleAndResEdittodo.min !== "" && todo.min === roleAndResEdittodo.min)
    //   ) &&
    //   (
    //     (roleAndResEdittodo.timetype === "" && todo.timetype === "") ||
    //     (roleAndResEdittodo.timetype !== "" && todo.timetype === roleAndResEdittodo.timetype)
    //   ) &&
    //   (
    //     (roleAndResEdittodo.date === "" && todo.date === "") ||
    //     (roleAndResEdittodo.date !== "" && todo.date === roleAndResEdittodo.date)
    //   ) &&
    //   (
    //     // (roleAndResEdittodo.days === "" && todo.days === "") ||
    //     // (roleAndResEdittodo.days !== "" && todo.days === roleAndResEdittodo.days)

    //     (roleAndResEdittodo.days?.length == 0 && todo.days?.length == 0) ||
    //     (roleAndResEdittodo.days?.length > 0 &&  todo.days.some((item) => roleAndResEdittodo.days.map((item) => item).includes(item)) )
    //   )
    // ));

    if (!isDuplicate) {
      const newTodoscheckedit = [...todoscheckedit];
      newTodoscheckedit[editingIndexcheckedit] = roleAndResEdittodo;
      setTodoscheckedit(newTodoscheckedit);
      setEditingIndexcheckedit(-1);
      setRoleAndResEdittodo("");
      setRoleAndResEdittodo({});
      setSelectedOptionsCateEdittodoedit([]);
    } else {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Already added . Please choose different values "}
          </p>
        </>
      );
      handleClickOpenerr();
    }
  };

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [showAlert, setShowAlert] = useState();

  const [deleteproject, setDeleteproject] = useState({});
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // This line muliti select designationgroup
  const [selectedOptionsDesiggrp, setSelectedOptionsDesiggrp] = useState([]);
  let [valueDesiggrp, setValueDesiggrp] = useState("");

  const handleDesignationGroupChange = (options) => {
    setValueDesiggrp(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsDesiggrp(options);
  };

  const customValueRendererDesiggrp = (valueDesiggrp, _designationgroups) => {
    return valueDesiggrp.length
      ? valueDesiggrp.map(({ label }) => label).join(", ")
      : "Please Select DesignationGroup";
  };

  //Edit multi select designationgroup
  const [selectedOptionsDesiggrpEdit, setSelectedOptionsDesiggrpEdit] =
    useState([]);
  let [valueDesiggrpEdit, setValueDesiggrpEdit] = useState("");

  const handleDesignationGroupChangeEdit = (options) => {
    setValueDesiggrpEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsDesiggrpEdit(options);
  };

  const customValueRendererDesiggrpEdit = (
    valueDesiggrpEdit,
    _designationgroups
  ) => {
    return valueDesiggrpEdit.length
      ? valueDesiggrpEdit.map(({ label }) => label).join(", ")
      : "Please Select DesignationGroup";
  };

  // This line muliti select designation
  const [selectedOptionsDesig, setSelectedOptionsDesig] = useState([]);
  let [valueDesig, setValueDesig] = useState("");

  const handleDesignationChange = (options) => {
    setValueDesig(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsDesig(options);
  };

  const customValueRendererDesig = (valueDesig, _designations) => {
    return valueDesig.length
      ? valueDesig.map(({ label }) => label).join(", ")
      : "Please Select Designation";
  };

  //Edit multi select designation
  const [selectedOptionsDesigEdit, setSelectedOptionsDesigEdit] = useState([]);
  let [valueDesigEdit, setValueDesigEdit] = useState("");

  const handleDesignationChangeEdit = (options) => {
    setValueDesigEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsDesigEdit(options);
  };

  const customValueRendererDesigEdit = (valueDesigEdit, _designations) => {
    return valueDesigEdit.length
      ? valueDesigEdit.map(({ label }) => label).join(", ")
      : "Please Select Designation";
  };

  // sevendays
  const weekdays = [
    { label: "Sunday", value: "Sunday" },
    { label: "Monday", value: "Monday" },
    { label: "Tuesday", value: "Tuesday" },
    { label: "Wednesday", value: "Wednesday" },
    { label: "Thursday", value: "Thursday" },
    { label: "Friday", value: "Friday" },
    { label: "Saturday", value: "Saturday" },
  ];
  // sevendays
  const weekdaystodoEdit = [
    { label: "Sunday", value: "Sunday" },
    { label: "Monday", value: "Monday" },
    { label: "Tuesday", value: "Tuesday" },
    { label: "Wednesday", value: "Wednesday" },
    { label: "Thursday", value: "Thursday" },
    { label: "Friday", value: "Friday" },
    { label: "Saturday", value: "Saturday" },
  ];
  // sevendays
  const weekdaysEdittodoedit = [
    { label: "Sunday", value: "Sunday" },
    { label: "Monday", value: "Monday" },
    { label: "Tuesday", value: "Tuesday" },
    { label: "Wednesday", value: "Wednesday" },
    { label: "Thursday", value: "Thursday" },
    { label: "Friday", value: "Friday" },
    { label: "Saturday", value: "Saturday" },
  ];

  // week off details Create
  const [selectedOptionsCate, setSelectedOptionsCate] = useState([]);
  let [valueCate, setValueCate] = useState("");

  const handleCategoryChange = (options) => {
    setValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCate(options);
  };

  const customValueRendererCate = (valueCate, _days) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Days";
  };

  // this is todo edit
  // week off details Create
  const [selectedOptionsCatetodoEdit, setSelectedOptionsCatetodoEdit] =
    useState([]);
  let [valueCatetodoEdit, setValueCatetodoEdit] = useState("");

  const handleCategoryChangetodoEdit = (options) => {
    setValueCatetodoEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCatetodoEdit(options);
  };

  const customValueRendererCatetodoEdit = (valueCatetodoEdit, _days) => {
    return valueCatetodoEdit.length
      ? valueCatetodoEdit.map(({ label }) => label).join(", ")
      : "Please Select Days";
  };

  // week off details Edit
  const [selectedOptionsCateEdit, setSelectedOptionsCateEdit] = useState([]);
  let [valueCateEdit, setValueCateEdit] = useState("");

  const handleDaysChangeEdit = (options) => {
    setValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCateEdit(options);
  };

  const customValueRendererCateEdit = (valueCateEdit, _days) => {
    return valueCateEdit?.length > 0
      ? valueCateEdit.map(({ label }) => label).join(", ")
      : "Please Select Days";
  };

  // week off details Edit
  const [selectedOptionsCateEdittodoedit, setSelectedOptionsCateEdittodoedit] =
    useState([]);
  let [valueCateEdittodoedit, setValueCateEdittodoedit] = useState("");

  const handleDaysChangeEdittodoedit = (options) => {
    setValueCateEdittodoedit(
      options?.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCateEdittodoedit(options);
  };

  const customValueRendererCateEdittodoedit = (
    valueCateEdittodoedit,
    _days
  ) => {
    return valueCateEdittodoedit?.length
      ? valueCateEdittodoedit?.map(({ label }) => label).join(", ")
      : "Please Select Days";
  };

  // Edit model...
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    setIsEditOpen(false);
  };

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
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

  // Error Popup model
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showAlertpop, setShowAlertpop] = useState();
  const handleClickOpenerrpop = () => {
    setIsErrorOpenpop(true);
  };
  const handleCloseerrpop = () => {
    setIsErrorOpenpop(false);
  };

  // State for manage columns search query
  const [searchQueryManage, setSearchQueryManage] = useState("");
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

  const username = isUserRoleAccess.username;
  const userData = {
    name: username,
    date: new Date(),
  };

  let printsno = 1;

  const fetchCategory = async () => {
    try {
      let res = await axios.get(SERVICE.ROLESANDRESPONSECAT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      SetcategoryOptions(
        res?.data?.roleandresponsibilities?.map((d) => ({
          ...d,
          label: d.categoryname,
          value: d.categoryname,
        }))
      );
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  // fetch category options
  const fetchSubCategory = async (e) => {
    try {
      let res = await axios.get(SERVICE.ROLESANDRESPONSECAT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let opt = res.data.roleandresponsibilities
        .filter((data) =>
          e.some((value) => value.categoryname == data.categoryname)
        )
        .map((sub) => sub.subcategoryname)
        .flat();

      setsubcategoryOptions(
        opt?.map((d) => ({
          ...d,
          label: d,
          value: d,
        }))
      );
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const fetchSubCategoryEdit = async (e) => {
    try {
      let res = await axios.get(SERVICE.ROLESANDRESPONSECAT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let opt = res.data.roleandresponsibilities.find((data) =>
        e.includes(data.categoryname)
      );

      setsubcategoryOptionsEdit(
        opt.subcategoryname?.map((d) => ({
          ...d,
          label: d,
          value: d,
        }))
      );
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  //set function to get particular row
  const rowData = async (id) => {
    try {
      let res = await axios.get(`${SERVICE.ROLESANDRES_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteproject(res?.data?.sroleandresponsibilities);
      handleClickOpen();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  // Alert delete popup
  let projectid = deleteproject._id;
  const delProject = async () => {
    try {
      await axios.delete(`${SERVICE.ROLESANDRES_SINGLE}/${projectid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchRoleAndRes();
      handleCloseMod();
      setSelectedRows([]);
      setPage(1);
      setShowAlert(
        <>
          <CheckCircleOutlinedIcon sx={{ fontSize: "100px", color: "green" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Deleted Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const delReasoncheckbox = async () => {
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.ROLESANDRES_SINGLE}/${item}`, {
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

      await fetchRoleAndRes();
      setShowAlert(
        <>
          <CheckCircleOutlinedIcon sx={{ fontSize: "100px", color: "green" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Deleted Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
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
    try {
      let refercreate = await axios.post(SERVICE.ROLESANDRES_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        category: [...valueCategoryAdd],
        subcategory: [...valueSubCategoryAdd],
        frequency: String(roleAndResAdd.frequency),
        designation: [...valueDesig],
        designationgroup: [...valueDesiggrp],
        days: [...valueCate],
        hour: String(roleAndResAdd.hour),
        min: String(roleAndResAdd.min),
        timetype: String(roleAndResAdd.timetype),
        date: String(roleAndResAdd.date),
        description: String(roleAndResTextArea),
        type: String(roleAndResAdd.type),
        roletodos: [...todoscheck],
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });

      setShowAlert(
        <>
          <CheckCircleOutlinedIcon sx={{ fontSize: "100px", color: "green" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Added Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
      setRoleAndResTextArea("");
      await fetchRoleAndRes();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    let designations = selectedOptionsDesig.map((item) => item.value);
    let designationGroups = selectedOptionsDesiggrp.map((item) => item.value);
    const isNameMatch = allRoleAndRes.some(
      (item) =>
        item.frequency?.toLowerCase() ===
          roleAndResAdd.frequency?.toLowerCase() &&
        item.description?.toLowerCase() === roleAndResTextArea &&
        item.type?.toLowerCase() === roleAndResAdd.type?.toLowerCase() &&
        item.category.some((item) =>
          selectedOptionsCategoryAdd.map((item) => item.value).includes(item)
        ) &&
        item.subcategory.some((item) =>
          selectedOptionssubcatAdd.map((item) => item.value).includes(item)
        ) &&
        item.designation.some((data) => designations.includes(data)) &&
        item.designationgroup.some((data) => designationGroups.includes(data))
    );

    if (selectedOptionsCategoryAdd.length == 0) {
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
    } else if (selectedOptionssubcatAdd.length == 0) {
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
    }
    // else if (roleAndResAdd.frequency == "Please Select Frequency") {
    //   setShowAlert(
    //     <>
    //       <ErrorOutlineOutlinedIcon
    //         sx={{ fontSize: "100px", color: "orange" }}
    //       />
    //       <p style={{ fontSize: "20px", fontWeight: 900 }}>
    //         {"Please Select Frequency"}
    //       </p>
    //     </>
    //   );
    //   handleClickOpenerr();
    // }
    else if (selectedOptionsDesiggrp.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select DesignationGroup"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedOptionsDesig.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Designation"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    // else if (roleAndResAdd.type == "Please Select Type") {
    //   setShowAlert(
    //     <>
    //       <ErrorOutlineOutlinedIcon
    //         sx={{ fontSize: "100px", color: "orange" }}
    //       />
    //       <p style={{ fontSize: "20px", fontWeight: 900 }}>
    //         {"Please Select Type"}
    //       </p>
    //     </>
    //   );
    //   handleClickOpenerr();
    // }
    else if (todoscheck.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Add The Todo "}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      roleAndResTextArea === "" ||
      roleAndResTextArea === undefined ||
      roleAndResTextArea === `<p><br></p>`
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Description"}
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
            {"This Combination already exits!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequest();
    }
  };

  // clear
  const handleClear = (e) => {
    e.preventDefault();
    setRoleAndResTextArea("");
    setRoleAndResAdd({
      frequency: "Please Select Frequency",
      designation: "",
      designationgroup: "",
      type: "Please Select Type",
      days: "",
      date: formattedDate,
      timetype: "AM",
      hour: "",
      min: "",
    });
    setTodoscheck([]);
    setTodoscheckedit([]);
    setSelectedOptionsCategoryAdd([]);
    setSelectedOptionssubcatAdd([]);
    setSelectedOptionsDesig([]);
    setSelectedOptionsDesiggrp([]);
    setDesignations([]);
    setsubcategoryOptions([]);
    setShowAlert(
      <>
        <CheckCircleOutlinedIcon sx={{ fontSize: "100px", color: "green" }} />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>
          {"Cleared Successfully"}
        </p>
      </>
    );
    handleClickOpenerr();
  };

  //get single row to edit....
  const getCodeEdit = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.ROLESANDRES_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setRoleAndResEdit(res?.data?.sroleandresponsibilities);
      setTodoscheckedit(res?.data?.sroleandresponsibilities.roletodos);
      setSelectedOptionsCategoryEdit(
        res?.data?.sroleandresponsibilities.category?.map((item) => ({
          ...item,
          label: item,
          value: item,
        }))
      );
      setSelectedOptionssubcatEdit(
        res?.data?.sroleandresponsibilities.subcategory?.map((item) => ({
          ...item,
          label: item,
          value: item,
        }))
      );
      setRoleAndResTextAreaEdit(
        res?.data?.sroleandresponsibilities?.description
      );
      setSelectedOptionsDesigEdit(
        res?.data?.sroleandresponsibilities.designation?.map((item) => ({
          ...item,
          label: item,
          value: item,
        }))
      );
      fetchDesignationsEdit(
        res?.data?.sroleandresponsibilities.designationgroup?.map((item) => ({
          ...item,
          label: item,
          value: item,
        }))
      );
      setSelectedOptionsDesiggrpEdit(
        res?.data?.sroleandresponsibilities.designationgroup?.map((item) => ({
          ...item,
          label: item,
          value: item,
        }))
      );
      
      fetchSubCategoryEdit(res?.data?.sroleandresponsibilities?.category);
      handleClickOpenEdit();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //get single row to edit....
  const getCodeView = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.ROLESANDRES_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setRoleAndResEdit(res?.data?.sroleandresponsibilities);
      setTodoscheckedit(res?.data?.sroleandresponsibilities.roletodos);
      handleClickOpenview();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //get single row to edit....
  const getCodeInfo = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.ROLESANDRES_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setRoleAndResEdit(res?.data?.sroleandresponsibilities);
      handleClickOpeninfo();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //Project updatedby edit page...
  let updatedby = roleAndResEdit.updatedby;
  let addedby = roleAndResEdit.addedby;
  let refsid = roleAndResEdit._id;

  //editing the single data...
  const sendEditRequest = async () => {
    let empdesig = selectedOptionsDesigEdit.map((item) => item.value);
    let empdesiggrp = selectedOptionsDesiggrpEdit.map((item) => item.value);
    // let empdays = selectedOptionsCateEdit.map((item) => item.value);
    try {
      let res = await axios.put(`${SERVICE.ROLESANDRES_SINGLE}/${refsid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        category: selectedOptionsCategoryEdit.map((item) => item.value),
        subcategory: selectedOptionssubcatEdit.map((item) => item.value),
        frequency: String(roleAndResEdit.frequency),
        designation: [...empdesig],
        designationgroup: [...empdesiggrp],
        days: [...valueCateEdit],
        hour: String(roleAndResEdit.hour),
        min: String(roleAndResEdit.min),
        timetype: String(roleAndResEdit.timetype),
        date: String(roleAndResEdit.date),
        description: String(roleAndResTextAreaEdit),
        type: String(roleAndResEdit.type),
        roletodos: [...todoscheckedit],
        updatedby: [
          ...updatedby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      setRoleAndResEdit(res.data);
      await fetchRoleAndRes();
      handleCloseModEdit();
      setShowAlert(
        <>
          <CheckCircleOutlinedIcon sx={{ fontSize: "100px", color: "green" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Updated Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const editSubmit = (e) => {
    e.preventDefault();
    let designationsEditt = selectedOptionsDesigEdit.map((item) => item.value);
    let designationGroupsEditt = selectedOptionsDesiggrpEdit.map(
      (item) => item.value
    );
    fetchRoleAndResall();

    const isNameMatch = allres.some(
      (item) =>
        item.frequency?.toLowerCase() ===
          roleAndResEdit.frequency?.toLowerCase() &&
        item.designation.some((data) => designationsEditt.includes(data)) &&
        item.designationgroup.some((data) =>
          designationGroupsEditt.includes(data)
        ) &&
        // item.designation?.toLowerCase() === (roleAndResEdit.designation)?.toLowerCase()
        item.description?.toLowerCase() === roleAndResTextAreaEdit &&
        item.type?.toLowerCase() === roleAndResEdit.type?.toLowerCase() &&
        item.category.some((item) =>
          selectedOptionsCategoryEdit.map((item) => item.value).includes(item)
        ) &&
        item.subcategory.some((item) =>
          selectedOptionssubcatEdit.map((item) => item.value).includes(item)
        )
    );

    if (selectedOptionsCategoryEdit.length == 0) {
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
    } else if (selectedOptionssubcatEdit.length == 0) {
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
    } else if (roleAndResEdit.frequency == "Please Select Frequency") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Frequency"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedOptionsDesiggrpEdit.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select DesignationGroup"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedOptionsDesigEdit.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Designation"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (todoscheckedit.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Add The Todo "}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (roleAndResEdit.type == "Please Select Type") {
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
      roleAndResTextAreaEdit === "" ||
      roleAndResTextAreaEdit === "<ul><li><br></li></ul>"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Description"}
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
            {"This Combination already exits!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendEditRequest();
    }
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    checkbox: true,
    actions: true,
    serialNumber: true,
    category: true,
    subcategory: true,
    // frequency: true,
    designationgroup: true,
    designation: true,
    // type: true,
    // time: true,
    // days: true,
    // date: true,
    description: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  const fetchDesignationsGroup = async () => {
    try {
      let res = await axios.get(SERVICE.DESIGNATIONGRP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDesignationGroups(
        res?.data?.desiggroup?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        }))
      );
      setDesignationGroupsEdit(
        res?.data?.desiggroup?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        }))
      );
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const fetchDesignations = async (e) => {
    let ans = e ? e.map((data) => data.value) : [];
    try {
      let res = await axios.get(SERVICE.DESIGNATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let result = res.data.designation.filter((d) => ans.includes(d.group));

      const desigall = result.map((d) => ({
        ...d,
        label: d.name,
        value: d.name,
      }));
      setDesignations(desigall);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const fetchDesignationsEdit = async (e) => {
    let ans = e ? e.map((data) => data.value) : [];
    try {
      let res = await axios.get(SERVICE.DESIGNATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let result = res.data.designation.filter((d) => ans.includes(d.group));

      const desigall = result.map((d) => ({
        ...d,
        label: d.name,
        value: d.name,
      }));
      setDesignationsEdit(desigall);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  useEffect(() => {
    fetchDesignationsGroup();
  }, []);

  //get all role and responsibilities details.
  const fetchRoleAndRes = async () => {
    try {
      let res_project = await axios.get(SERVICE.ROLESANDRES, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAllRoleAndRes(res_project?.data?.roleandresponsibilities);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  const [allres, setAllres] = useState([]);
  //get all role and responsibilities details.
  const fetchRoleAndResall = async () => {
    try {
      let res_project = await axios.get(SERVICE.ROLESANDRES, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAllres(
        res_project?.data?.roleandresponsibilities.filter(
          (item) => item._id !== roleAndResEdit._id
        )
      );
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  useEffect(() => {
    fetchRoleAndRes();
  }, []);

  useEffect(() => {
    fetchRoleAndResall();
  }, [roleAndResEdit, isEditOpen]);

  //serial no for listing items
  const addSerialNumber = () => {
    const itemsWithSerialNumber = allRoleAndRes?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [allRoleAndRes]);

  // Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setPage(1);
  };

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

  // Table start colum and row
  // Define columns for the DataGrid
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
      width: 75,

      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "S.No",
      flex: 0,
      width: 120,
      hide: !columnVisibility.serialNumber,
    },
    {
      field: "category",
      headerName: "Category",
      flex: 0,
      width: 200,
      hide: !columnVisibility.category,
    },
    {
      field: "subcategory",
      headerName: "Sub Category",
      flex: 0,
      width: 200,
      hide: !columnVisibility.subcategory,
    },
    // {
    //   field: "frequency",
    //   headerName: "Frequency",
    //   flex: 0,
    //   width: 200,
    //   hide: !columnVisibility.frequency,
    // },
    {
      field: "designationgroup",
      headerName: "Designation Group",
      flex: 0,
      width: 200,
      hide: !columnVisibility.referingjob,
    },
    {
      field: "designation",
      headerName: "Designation",
      flex: 0,
      width: 200,
      hide: !columnVisibility.referingjob,
    },

    // {
    //   field: "type",
    //   headerName: "Type",
    //   flex: 0,
    //   width: 200,
    //   hide: !columnVisibility.type,
    // },
    // {
    //   field: "time",
    //   headerName: "Time",
    //   flex: 0,
    //   width: 180,
    //   hide: !columnVisibility.time,
    // },
    // {
    //   field: "days",
    //   headerName: "Days",
    //   flex: 0,
    //   width: 120,
    //   hide: !columnVisibility.days,
    // },
    // {
    //   field: "date",
    //   headerName: "Date",
    //   flex: 0,
    //   width: 120,
    //   hide: !columnVisibility.date,
    // },
    {
      field: "description",
      headerName: "Description",
      flex: 0,
      width: 120,
      hide: !columnVisibility.description,
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 300,
      sortable: false,
      hide: !columnVisibility.actions,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("erolesofresponsibilities") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCodeEdit(params.row.id);
              }}
              style={{ minWidth: "0px" }}
            >
              <EditOutlinedIcon style={{ fontSize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("drolesofresponsibilities") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vrolesofresponsibilities") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCodeView(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("irolesofresponsibilities") && (
            <Button
              sx={userStyle.buttonview}
              onClick={() => {
                getCodeInfo(params.row.id);
              }}
            >
              <InfoOutlinedIcon style={{ fontSize: "large" }} />
            </Button>
            // </Link>
          )}
        </Grid>
      ),
    },
  ];

  // Function to remove HTML tags and convert to numbered list
  const convertToNumberedList = (htmlContent) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = htmlContent;

    const listItems = Array.from(tempElement.querySelectorAll("li"));
    listItems.forEach((li, index) => {
      li.innerHTML = `${index + 1}. ${li.innerHTML}\n`;
    });

    return tempElement.innerText;
  };

  // Create a row data object for the DataGrid
  const rowDataTable = filteredData?.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      category: item.category.join(","),
      subcategory: item.subcategory.join(","),
      // frequency: item.frequency,
      designationgroup: item.designationgroup.join(","),
      designation: item.designation.join(","),
      // type: item.type,
      // time: ((item.frequency === "Daily" || item.frequency === "Date Wise" || item.frequency === "Day Wise") && item.type === "Fixed") ? item.hour + ":" + item.min + ":" + item.timetype : "-",
      // days: (item.frequency === "Weekly" && item.type === "Fixed") ? item.days.join(",") : "-",
      // date: ((item.frequency === "Monthly" || item.frequency === "Month Wise") && item.type === "Fixed") ? moment(item?.date).format("DD-MM-YYYY") : "-",
      description: convertToNumberedList(item.description),
    };
  });

  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRows.includes(row.id),
  }));

  const handleShowAllColumns = () => {
    const updatedVisibility = { ...columnVisibility };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibility(updatedVisibility);
  };

  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  // Function to filter columns based on search query
  const filteredColumns = columnDataTable.filter((column) =>
    column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
  );

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

  // Excel
  const fileName = "Roles Of Responsibilities";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Roles Of Responsibilities",
    pageStyle: "print",
  });

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Roles Of Responsibilities.png");
        });
      });
    }
  };

  return (
    <Box>
      <Headtitle title={"ROLE OF RESPONSIBILITIES"} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>
        Roles Of Responsibilities
      </Typography>
      {isUserRoleCompare?.includes("arolesofresponsibilities") && (
        <Box sx={userStyle.selectcontainer}>
          <Grid container spacing={2}>
            <Grid item lg={4} md={4} sm={12} xs={12}>
              <InputLabel>
                {" "}
                <b>
                  Category <b style={{ color: "red" }}>*</b>
                </b>
              </InputLabel>
              <FormControl fullWidth size="small">
                <MultiSelect
                  options={categoryOptions}
                  value={selectedOptionsCategoryAdd}
                  onChange={(e) => {
                    handleCategoryChangeAdd(e);
                    fetchSubCategory(e);
                    setSelectedOptionssubcatAdd([]);
                  }}
                  valueRenderer={customValueRendererCategoryAdd}
                />
              </FormControl>
            </Grid>
            <Grid item lg={4} md={4} sm={12} xs={12}>
              <InputLabel>
                {" "}
                <b>
                  SubCategory <b style={{ color: "red" }}>*</b>
                </b>
              </InputLabel>
              <FormControl fullWidth size="small">
                <MultiSelect
                  options={subcategoryOptions}
                  value={selectedOptionssubcatAdd}
                  onChange={handleSubCategoryChange}
                  valueRenderer={customValueRendererSubCategory}
                />
              </FormControl>
            </Grid>
            <Grid item lg={4} md={4} sm={12} xs={12}>
              <InputLabel>
                {" "}
                <b>
                  Designation Group <b style={{ color: "red" }}>*</b>
                </b>
              </InputLabel>
              <FormControl fullWidth size="small">
                <MultiSelect
                  options={designationGroups}
                  value={selectedOptionsDesiggrp}
                  onChange={(e) => {
                    handleDesignationGroupChange(e);
                    fetchDesignations(e);
                    setSelectedOptionsDesig([]);
                  }}
                  valueRenderer={customValueRendererDesiggrp}
                  labelledBy="Please Select DesignationGroup"
                />
              </FormControl>
            </Grid>
            <Grid item lg={4} md={4} sm={12} xs={12}>
              <InputLabel>
                {" "}
                <b>
                  Designation <b style={{ color: "red" }}>*</b>
                </b>
              </InputLabel>
              <FormControl fullWidth size="small">
                <MultiSelect
                  options={designations}
                  value={selectedOptionsDesig}
                  onChange={(e) => {
                    handleDesignationChange(e);
                  }}
                  valueRenderer={customValueRendererDesig}
                  labelledBy="Please Select Designation"
                />
              </FormControl>
            </Grid>
          </Grid>
          <br />

          <Grid item md={12} xs={12} sm={12}>
            <>
              <br />

              <Grid container spacing={1}>
                <Grid container spacing={2}>
                  <Grid item md={4} sm={12} xs={12}>
                    <InputLabel>
                      {" "}
                      <b>
                        Frequency <b style={{ color: "red" }}>*</b>
                      </b>
                    </InputLabel>
                    <FormControl fullWidth size="small">
                      <Selects
                        value={{
                          label: roleAndResAdd.frequency,
                          value: roleAndResAdd.frequency,
                        }}
                        options={frequencyOpt}
                        styles={colourStyles}
                        onChange={(e) => {
                          setRoleAndResAdd({
                            ...roleAndResAdd,
                            frequency: e.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={12} xs={12}>
                    <InputLabel>
                      {" "}
                      <b>
                        Type <b style={{ color: "red" }}>*</b>
                      </b>
                    </InputLabel>
                    <FormControl fullWidth size="small">
                      <Selects
                        options={typeOptions}
                        styles={colourStyles}
                        value={{
                          label: roleAndResAdd.type,
                          value: roleAndResAdd.type,
                        }}
                        onChange={(e) => {
                          setRoleAndResAdd({ ...roleAndResAdd, type: e.value });
                        }}
                      />
                    </FormControl>
                  </Grid>

                  {(roleAndResAdd.frequency === "Daily" ||
                    roleAndResAdd.frequency === "Date Wise" ||
                    roleAndResAdd.frequency === "Day Wise") &&
                    roleAndResAdd.type === "Fixed" && (
                      <>
                        <Grid item md={6} sm={12} xs={12}>
                          <InputLabel>
                            {" "}
                            <b> Time </b>
                          </InputLabel>
                          <Grid item lg={6} md={6} sm={6} xs={12}>
                            <Grid container>
                              <Grid item xs={4} sm={4} md={3}>
                                <FormControl size="small" fullWidth>
                                  <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={roleAndResAdd.hour}
                                    MenuProps={{
                                      PaperProps: {
                                        style: {
                                          maxHeight: 200,
                                          width: 80,
                                        },
                                      },
                                    }}
                                    onChange={(e) => {
                                      setRoleAndResAdd({
                                        ...roleAndResAdd,
                                        hour: e.target.value,
                                      });
                                    }}
                                  >
                                    <MenuItem value={"01"}>01</MenuItem>
                                    <MenuItem value={"02"}>02</MenuItem>
                                    <MenuItem value={"03"}>03</MenuItem>
                                    <MenuItem value={"04"}>04</MenuItem>
                                    <MenuItem value={"05"}>05</MenuItem>
                                    <MenuItem value={"06"}>06</MenuItem>
                                    <MenuItem value={"07"}>07</MenuItem>
                                    <MenuItem value={"08"}>08</MenuItem>
                                    <MenuItem value={"09"}>09</MenuItem>
                                    <MenuItem value={"10"}>10</MenuItem>
                                    <MenuItem value={11}>11</MenuItem>
                                    <MenuItem value={12}>12</MenuItem>
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid item xs={4} sm={4} md={3}>
                                <FormControl size="small" fullWidth>
                                  <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={roleAndResAdd.min}
                                    MenuProps={{
                                      PaperProps: {
                                        style: {
                                          maxHeight: 200,
                                          width: 80,
                                        },
                                      },
                                    }}
                                    onChange={(e) => {
                                      setRoleAndResAdd({
                                        ...roleAndResAdd,
                                        min: e.target.value,
                                      });
                                    }}
                                  >
                                    <MenuItem value={"00"}>00</MenuItem>
                                    <MenuItem value={"01"}>01</MenuItem>
                                    <MenuItem value={"02"}>02</MenuItem>
                                    <MenuItem value={"03"}>03</MenuItem>
                                    <MenuItem value={"04"}>04</MenuItem>
                                    <MenuItem value={"05"}>05</MenuItem>
                                    <MenuItem value={"06"}>06</MenuItem>
                                    <MenuItem value={"07"}>07</MenuItem>
                                    <MenuItem value={"08"}>08</MenuItem>
                                    <MenuItem value={"09"}>09</MenuItem>
                                    <MenuItem value={"10"}>10</MenuItem>
                                    <MenuItem value={11}>11</MenuItem>
                                    <MenuItem value={12}>12</MenuItem>
                                    <MenuItem value={13}>13</MenuItem>
                                    <MenuItem value={14}>14</MenuItem>
                                    <MenuItem value={15}>15</MenuItem>
                                    <MenuItem value={16}>16</MenuItem>
                                    <MenuItem value={17}>17</MenuItem>
                                    <MenuItem value={18}>18</MenuItem>
                                    <MenuItem value={19}>19</MenuItem>
                                    <MenuItem value={20}>20</MenuItem>
                                    <MenuItem value={21}>21</MenuItem>
                                    <MenuItem value={22}>22</MenuItem>
                                    <MenuItem value={23}>23</MenuItem>
                                    <MenuItem value={24}>24</MenuItem>
                                    <MenuItem value={25}>25</MenuItem>
                                    <MenuItem value={26}>26</MenuItem>
                                    <MenuItem value={27}>27</MenuItem>
                                    <MenuItem value={28}>28</MenuItem>
                                    <MenuItem value={29}>29</MenuItem>
                                    <MenuItem value={30}>30</MenuItem>
                                    <MenuItem value={31}>31</MenuItem>
                                    <MenuItem value={32}>32</MenuItem>
                                    <MenuItem value={33}>33</MenuItem>
                                    <MenuItem value={34}>34</MenuItem>
                                    <MenuItem value={35}>35</MenuItem>
                                    <MenuItem value={36}>36</MenuItem>
                                    <MenuItem value={37}>37</MenuItem>
                                    <MenuItem value={38}>38</MenuItem>
                                    <MenuItem value={39}>39</MenuItem>
                                    <MenuItem value={40}>40</MenuItem>
                                    <MenuItem value={41}>41</MenuItem>
                                    <MenuItem value={42}>42</MenuItem>
                                    <MenuItem value={43}>43</MenuItem>
                                    <MenuItem value={44}>44</MenuItem>
                                    <MenuItem value={45}>45</MenuItem>
                                    <MenuItem value={46}>46</MenuItem>
                                    <MenuItem value={47}>47</MenuItem>
                                    <MenuItem value={48}>48</MenuItem>
                                    <MenuItem value={49}>49</MenuItem>
                                    <MenuItem value={50}>50</MenuItem>
                                    <MenuItem value={51}>51</MenuItem>
                                    <MenuItem value={52}>52</MenuItem>
                                    <MenuItem value={53}>53</MenuItem>
                                    <MenuItem value={54}>54</MenuItem>
                                    <MenuItem value={55}>55</MenuItem>
                                    <MenuItem value={56}>56</MenuItem>
                                    <MenuItem value={57}>57</MenuItem>
                                    <MenuItem value={58}>58</MenuItem>
                                    <MenuItem value={59}>59</MenuItem>
                                    <MenuItem value={60}>60</MenuItem>
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid item xs={4} sm={4} md={3}>
                                <FormControl size="small" fullWidth>
                                  <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={roleAndResAdd.timetype}
                                    onChange={(e) => {
                                      setRoleAndResAdd({
                                        ...roleAndResAdd,
                                        timetype: e.target.value,
                                      });
                                    }}
                                  >
                                    <MenuItem value={"AM"}>AM</MenuItem>
                                    <MenuItem value={"PM"}>PM</MenuItem>
                                  </Select>
                                </FormControl>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </>
                    )}

                  {(roleAndResAdd.frequency === "Monthly" ||
                    roleAndResAdd.frequency === "Month Wise") &&
                    roleAndResAdd.type === "Fixed" && (
                      <>
                        <Grid item md={4} sm={12} xs={12}>
                          <InputLabel>
                            {" "}
                            <b> Date </b>
                          </InputLabel>
                          <FormControl fullWidth size="small">
                            <OutlinedInput
                              id="component-outlined"
                              type="date"
                              value={roleAndResAdd.date}
                              onChange={(e) => {
                                setRoleAndResAdd({
                                  ...roleAndResAdd,
                                  date: e.target.value,
                                });
                              }}
                            />
                          </FormControl>
                        </Grid>
                      </>
                    )}

                  {roleAndResAdd.frequency === "Weekly" &&
                    roleAndResAdd.type === "Fixed" && (
                      <>
                        <Grid item lg={4} md={4} sm={12} xs={12}>
                          <InputLabel>
                            {" "}
                            <b> Days </b>
                          </InputLabel>
                          <FormControl fullWidth size="small">
                            <MultiSelect
                              size="small"
                              options={weekdays}
                              value={selectedOptionsCate}
                              onChange={handleCategoryChange}
                              valueRenderer={customValueRendererCate}
                              labelledBy="Please Select Days"
                            />
                          </FormControl>
                        </Grid>
                      </>
                    )}
                </Grid>
                <br /> <br />
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
                      // disabled={newTodoLabelcheck == ""}
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
                        <Grid container spacing={2}>
                          <Grid item lg={3} md={4} sm={12} xs={12}>
                            <InputLabel>
                              {" "}
                              <b>
                                Frequency <b style={{ color: "red" }}>*</b>
                              </b>
                            </InputLabel>
                            <FormControl fullWidth size="small">
                              <Selects
                                value={{
                                  label: roleAndResAddEdit.frequency,
                                  value: roleAndResAddEdit.frequency,
                                }}
                                options={frequencyOpt}
                                styles={colourStyles}
                                onChange={(e) => {
                                  setRoleAndResAddEdit({
                                    ...roleAndResAddEdit,
                                    frequency: e.value,
                                  });
                                }}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item lg={3} md={4} sm={12} xs={12}>
                            <InputLabel>
                              {" "}
                              <b>
                                Type <b style={{ color: "red" }}>*</b>
                              </b>
                            </InputLabel>
                            <FormControl fullWidth size="small">
                              <Selects
                                options={typeOptions}
                                styles={colourStyles}
                                value={{
                                  label: roleAndResAddEdit.type,
                                  value: roleAndResAddEdit.type,
                                }}
                                onChange={(e) => {
                                  setRoleAndResAddEdit({
                                    ...roleAndResAddEdit,
                                    type: e.value,
                                  });
                                }}
                              />
                            </FormControl>
                          </Grid>

                          {(roleAndResAddEdit.frequency === "Daily" ||
                            roleAndResAddEdit.frequency === "Date Wise" ||
                            roleAndResAddEdit.frequency === "Day Wise") &&
                            roleAndResAdd.type === "Fixed" && (
                              <>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                  <InputLabel>
                                    {" "}
                                    <b> Time </b>
                                  </InputLabel>
                                  <Grid item lg={6} md={6} sm={6} xs={12}>
                                    <Grid container>
                                      <Grid item xs={4} sm={4} md={3}>
                                        <FormControl size="small" fullWidth>
                                          <Select
                                            labelId="demo-select-small"
                                            id="demo-select-small"
                                            value={roleAndResAddEdit.hour}
                                            MenuProps={{
                                              PaperProps: {
                                                style: {
                                                  maxHeight: 200,
                                                  width: 80,
                                                },
                                              },
                                            }}
                                            onChange={(e) => {
                                              setRoleAndResAddEdit({
                                                ...roleAndResAddEdit,
                                                hour: e.target.value,
                                              });
                                            }}
                                          >
                                            <MenuItem value={"01"}>01</MenuItem>
                                            <MenuItem value={"02"}>02</MenuItem>
                                            <MenuItem value={"03"}>03</MenuItem>
                                            <MenuItem value={"04"}>04</MenuItem>
                                            <MenuItem value={"05"}>05</MenuItem>
                                            <MenuItem value={"06"}>06</MenuItem>
                                            <MenuItem value={"07"}>07</MenuItem>
                                            <MenuItem value={"08"}>08</MenuItem>
                                            <MenuItem value={"09"}>09</MenuItem>
                                            <MenuItem value={"10"}>10</MenuItem>
                                            <MenuItem value={11}>11</MenuItem>
                                            <MenuItem value={12}>12</MenuItem>
                                          </Select>
                                        </FormControl>
                                      </Grid>
                                      <Grid item xs={4} sm={4} md={3}>
                                        <FormControl size="small" fullWidth>
                                          <Select
                                            labelId="demo-select-small"
                                            id="demo-select-small"
                                            value={roleAndResAddEdit.min}
                                            MenuProps={{
                                              PaperProps: {
                                                style: {
                                                  maxHeight: 200,
                                                  width: 80,
                                                },
                                              },
                                            }}
                                            onChange={(e) => {
                                              setRoleAndResAddEdit({
                                                ...roleAndResAddEdit,
                                                min: e.target.value,
                                              });
                                            }}
                                          >
                                            <MenuItem value={"00"}>00</MenuItem>
                                            <MenuItem value={"01"}>01</MenuItem>
                                            <MenuItem value={"02"}>02</MenuItem>
                                            <MenuItem value={"03"}>03</MenuItem>
                                            <MenuItem value={"04"}>04</MenuItem>
                                            <MenuItem value={"05"}>05</MenuItem>
                                            <MenuItem value={"06"}>06</MenuItem>
                                            <MenuItem value={"07"}>07</MenuItem>
                                            <MenuItem value={"08"}>08</MenuItem>
                                            <MenuItem value={"09"}>09</MenuItem>
                                            <MenuItem value={"10"}>10</MenuItem>
                                            <MenuItem value={11}>11</MenuItem>
                                            <MenuItem value={12}>12</MenuItem>
                                            <MenuItem value={13}>13</MenuItem>
                                            <MenuItem value={14}>14</MenuItem>
                                            <MenuItem value={15}>15</MenuItem>
                                            <MenuItem value={16}>16</MenuItem>
                                            <MenuItem value={17}>17</MenuItem>
                                            <MenuItem value={18}>18</MenuItem>
                                            <MenuItem value={19}>19</MenuItem>
                                            <MenuItem value={20}>20</MenuItem>
                                            <MenuItem value={21}>21</MenuItem>
                                            <MenuItem value={22}>22</MenuItem>
                                            <MenuItem value={23}>23</MenuItem>
                                            <MenuItem value={24}>24</MenuItem>
                                            <MenuItem value={25}>25</MenuItem>
                                            <MenuItem value={26}>26</MenuItem>
                                            <MenuItem value={27}>27</MenuItem>
                                            <MenuItem value={28}>28</MenuItem>
                                            <MenuItem value={29}>29</MenuItem>
                                            <MenuItem value={30}>30</MenuItem>
                                            <MenuItem value={31}>31</MenuItem>
                                            <MenuItem value={32}>32</MenuItem>
                                            <MenuItem value={33}>33</MenuItem>
                                            <MenuItem value={34}>34</MenuItem>
                                            <MenuItem value={35}>35</MenuItem>
                                            <MenuItem value={36}>36</MenuItem>
                                            <MenuItem value={37}>37</MenuItem>
                                            <MenuItem value={38}>38</MenuItem>
                                            <MenuItem value={39}>39</MenuItem>
                                            <MenuItem value={40}>40</MenuItem>
                                            <MenuItem value={41}>41</MenuItem>
                                            <MenuItem value={42}>42</MenuItem>
                                            <MenuItem value={43}>43</MenuItem>
                                            <MenuItem value={44}>44</MenuItem>
                                            <MenuItem value={45}>45</MenuItem>
                                            <MenuItem value={46}>46</MenuItem>
                                            <MenuItem value={47}>47</MenuItem>
                                            <MenuItem value={48}>48</MenuItem>
                                            <MenuItem value={49}>49</MenuItem>
                                            <MenuItem value={50}>50</MenuItem>
                                            <MenuItem value={51}>51</MenuItem>
                                            <MenuItem value={52}>52</MenuItem>
                                            <MenuItem value={53}>53</MenuItem>
                                            <MenuItem value={54}>54</MenuItem>
                                            <MenuItem value={55}>55</MenuItem>
                                            <MenuItem value={56}>56</MenuItem>
                                            <MenuItem value={57}>57</MenuItem>
                                            <MenuItem value={58}>58</MenuItem>
                                            <MenuItem value={59}>59</MenuItem>
                                            <MenuItem value={60}>60</MenuItem>
                                          </Select>
                                        </FormControl>
                                      </Grid>
                                      <Grid item xs={4} sm={4} md={3}>
                                        <FormControl size="small" fullWidth>
                                          <Select
                                            labelId="demo-select-small"
                                            id="demo-select-small"
                                            value={roleAndResAddEdit.timetype}
                                            onChange={(e) => {
                                              setRoleAndResAddEdit({
                                                ...roleAndResAddEdit,
                                                timetype: e.target.value,
                                              });
                                            }}
                                          >
                                            <MenuItem value={"AM"}>AM</MenuItem>
                                            <MenuItem value={"PM"}>PM</MenuItem>
                                          </Select>
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </>
                            )}

                          {(roleAndResAddEdit.frequency === "Monthly" ||
                            roleAndResAddEdit.frequency === "Month Wise") &&
                            roleAndResAddEdit.type === "Fixed" && (
                              <>
                                <Grid item lg={4} md={4} sm={12} xs={12}>
                                  <InputLabel>
                                    {" "}
                                    <b> Date </b>
                                  </InputLabel>
                                  <FormControl fullWidth size="small">
                                    <OutlinedInput
                                      id="component-outlined"
                                      type="date"
                                      value={roleAndResAddEdit.date}
                                      onChange={(e) => {
                                        setRoleAndResAddEdit({
                                          ...roleAndResAddEdit,
                                          date: e.target.value,
                                        });
                                      }}
                                    />
                                  </FormControl>
                                </Grid>
                              </>
                            )}

                          {roleAndResAddEdit.frequency === "Weekly" &&
                            roleAndResAddEdit.type === "Fixed" && (
                              <>
                                <Grid item lg={4} md={4} sm={12} xs={12}>
                                  <InputLabel>
                                    {" "}
                                    <b> Days </b>
                                  </InputLabel>
                                  <FormControl fullWidth size="small">
                                    <MultiSelect
                                      size="small"
                                      options={weekdaystodoEdit}
                                      value={selectedOptionsCatetodoEdit}
                                      onChange={handleCategoryChangetodoEdit}
                                      valueRenderer={
                                        customValueRendererCatetodoEdit
                                      }
                                      labelledBy="Please Select Days"
                                    />
                                  </FormControl>
                                </Grid>
                              </>
                            )}
                        </Grid>
                        <br /> <br />
                        <Grid item md={1.5} sm={1.5} xs={1.5}>
                          {/* {todoCheckCreateEdit ? (
                            ""
                          ) : editedTododescheck !== "" &&
                            editcheckpoint !== "" ? ( */}
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
                          {/* ) : (
                            ""
                          )} */}
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
                        <Grid item md={1} sm={3} xs={3}>
                          <Typography
                            variant="subtitle2"
                            color="textSecondary"
                            sx={{
                              whiteSpace: "pre-line",
                              wordBreak: "break-all",
                            }}
                          >
                            {todo.frequency}
                          </Typography>
                        </Grid>
                        <Grid item md={1} sm={3} xs={3}>
                          <Typography
                            variant="subtitle2"
                            color="textSecondary"
                            sx={{
                              whiteSpace: "pre-line",
                              wordBreak: "break-all",
                            }}
                          >
                            {todo.type}
                          </Typography>
                        </Grid>
                        {["Daily", "Day Wise", "Date Wise"].includes(
                          todo.frequency
                        ) && todo.type === "Fixed" ? (
                          <>
                            <Grid item md={1} sm={3} xs={3}>
                              <Typography
                                variant="subtitle2"
                                color="textSecondary"
                                sx={{
                                  whiteSpace: "pre-line",
                                  wordBreak: "break-all",
                                }}
                              >
                                {todo.hour}
                              </Typography>
                            </Grid>
                            <Grid item md={1} sm={3} xs={3}>
                              <Typography
                                variant="subtitle2"
                                color="textSecondary"
                                sx={{
                                  whiteSpace: "pre-line",
                                  wordBreak: "break-all",
                                }}
                              >
                                {todo.min}
                              </Typography>
                            </Grid>
                            <Grid item md={1} sm={3} xs={3}>
                              <Typography
                                variant="subtitle2"
                                color="textSecondary"
                                sx={{
                                  whiteSpace: "pre-line",
                                  wordBreak: "break-all",
                                }}
                              >
                                {todo.timetype}
                              </Typography>
                            </Grid>
                          </>
                        ) : ["Monthly", "Month Wise"].includes(
                            todo.frequency
                          ) && todo.type === "Fixed" ? (
                          <>
                            <Grid item md={1} sm={3} xs={3}>
                              <Typography
                                variant="subtitle2"
                                color="textSecondary"
                                sx={{
                                  whiteSpace: "pre-line",
                                  wordBreak: "break-all",
                                }}
                              >
                                {todo.date}
                              </Typography>
                            </Grid>
                          </>
                        ) : todo.type === "Fixed" &&
                          todo.frequency === "Weekly" ? (
                          <>
                            <Grid item md={1} sm={3} xs={3}>
                              <Typography
                                variant="subtitle2"
                                color="textSecondary"
                                sx={{
                                  whiteSpace: "pre-line",
                                  wordBreak: "break-all",
                                }}
                              >
                                {todo.days}
                              </Typography>
                            </Grid>
                          </>
                        ) : (
                          ""
                        )}

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

          <Grid item lg={12} md={12} sm={12} xs={12}>
            <InputLabel>
              {" "}
              <b>
                Description <b style={{ color: "red" }}>*</b>
              </b>
            </InputLabel>
            <FormControl fullWidth size="small">
              <ReactQuill
                style={{ height: "180px" }}
                value={roleAndResTextArea}
                onChange={handleRoleAndResponse}
                modules={{
                  toolbar: [
                    [{ header: "1" }, { header: "2" }, { font: [] }],
                    [{ size: [] }],
                    ["bold", "italic", "underline", "strike", "blockquote"],
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
          </Grid>

          <br />
          <br />
          <br />
          <Grid container spacing={2}>
            <Grid item md={3} xs={12} sm={6}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                // onClick={sendRequest}
              >
                {" "}
                Submit{" "}
              </Button>
            </Grid>
            <Grid item md={3} xs={12} sm={6}>
              <Button sx={userStyle.btncancel} onClick={handleClear}>
                {" "}
                Clear{" "}
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* } */}
      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="lg"
          fullWidth={true}
        >
          <Box sx={{ padding: "20px 50px" }}>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              Edit Roles Of Responsibilities{" "}
            </Typography>
            <Grid container spacing={2}>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <InputLabel>
                  {" "}
                  <b>
                    Category <b style={{ color: "red" }}>*</b>
                  </b>
                </InputLabel>
                <FormControl fullWidth size="small">
                  <MultiSelect
                    options={categoryOptions}
                    value={selectedOptionsCategoryEdit}
                    onChange={handleCategoryChangeEdit}
                    valueRenderer={customValueRendererCategoryEdit}
                    //  labelledBy="Please Select Mainpage"
                  />
                </FormControl>
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <InputLabel>
                  {" "}
                  <b>
                    SubCategory <b style={{ color: "red" }}>*</b>
                  </b>
                </InputLabel>
                <FormControl fullWidth size="small">
                  <MultiSelect
                    options={subcategoryOptionsEdit}
                    value={selectedOptionssubcatEdit}
                    onChange={handleSubCategoryChangeEdit}
                    valueRenderer={customValueRendererSubCategoryEdit}
                  />
                </FormControl>
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <InputLabel>
                  {" "}
                  <b>
                    Designation Group <b style={{ color: "red" }}>*</b>
                  </b>
                </InputLabel>
                <FormControl fullWidth size="small">
                  <MultiSelect
                    options={designationGroupsEdit}
                    value={selectedOptionsDesiggrpEdit}
                    onChange={(e) => {
                      handleDesignationGroupChangeEdit(e);
                      fetchDesignationsEdit(e);
                      setSelectedOptionsDesigEdit([]);
                    }}
                    valueRenderer={customValueRendererDesiggrpEdit}
                    labelledBy="Please Select DesignationGroup"
                  />
                </FormControl>
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <InputLabel>
                  {" "}
                  <b>
                    Designation <b style={{ color: "red" }}>*</b>
                  </b>
                </InputLabel>
                <FormControl fullWidth size="small">
                  <MultiSelect
                    options={designationsEdit}
                    value={selectedOptionsDesigEdit}
                    onChange={(e) => {
                      handleDesignationChangeEdit(e);
                    }}
                    valueRenderer={customValueRendererDesigEdit}
                    labelledBy="Please Select Designation"
                  />
                </FormControl>
              </Grid>
            </Grid>
            <br />

            <Grid item md={12} xs={12} sm={12}>
              <>
                <br />

                <Grid container spacing={1}>
                  <Grid item md={10} sm={1} xs={1}>
                    <Grid container spacing={2}>
                      <Grid item md={4} sm={12} xs={12}>
                        <InputLabel>
                          {" "}
                          <b>
                            Frequency <b style={{ color: "red" }}>*</b>
                          </b>
                        </InputLabel>
                        <FormControl fullWidth size="small">
                          <Selects
                            value={{
                              label: roleAndResAddEditcheck?.frequency,
                              value: roleAndResAddEditcheck?.frequency,
                            }}
                            options={frequencyOpt}
                            styles={colourStyles}
                            onChange={(e) => {
                              setRoleAndResAddEditcheck({
                                ...roleAndResAddEditcheck,
                                frequency: e.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={4} sm={12} xs={12}>
                        <InputLabel>
                          {" "}
                          <b>
                            Type <b style={{ color: "red" }}>*</b>
                          </b>
                        </InputLabel>
                        <FormControl fullWidth size="small">
                          <Selects
                            options={typeOptions}
                            styles={colourStyles}
                            value={{
                              label: roleAndResAddEditcheck.type,
                              value: roleAndResAddEditcheck.type,
                            }}
                            onChange={(e) => {
                              setRoleAndResAddEditcheck({
                                ...roleAndResAddEditcheck,
                                type: e.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>

                      {(roleAndResAddEditcheck.frequency === "Daily" ||
                        roleAndResAddEditcheck.frequency === "Date Wise" ||
                        roleAndResAddEditcheck.frequency === "Day Wise") &&
                        roleAndResAddEditcheck.type === "Fixed" && (
                          <>
                            <Grid item md={4} sm={12} xs={12}>
                              <InputLabel>
                                {" "}
                                <b> Time </b>
                              </InputLabel>
                              <Grid item md={12} sm={6} xs={12}>
                                <Grid container>
                                  <Grid item xs={4} sm={4} md={3}>
                                    <FormControl size="small" fullWidth>
                                      <Select
                                        labelId="demo-select-small"
                                        id="demo-select-small"
                                        value={roleAndResAddEditcheck.hour}
                                        MenuProps={{
                                          PaperProps: {
                                            style: {
                                              maxHeight: 200,
                                              width: 80,
                                            },
                                          },
                                        }}
                                        onChange={(e) => {
                                          setRoleAndResAddEditcheck({
                                            ...roleAndResAddEditcheck,
                                            hour: e.target.value,
                                          });
                                        }}
                                      >
                                        <MenuItem value={"01"}>01</MenuItem>
                                        <MenuItem value={"02"}>02</MenuItem>
                                        <MenuItem value={"03"}>03</MenuItem>
                                        <MenuItem value={"04"}>04</MenuItem>
                                        <MenuItem value={"05"}>05</MenuItem>
                                        <MenuItem value={"06"}>06</MenuItem>
                                        <MenuItem value={"07"}>07</MenuItem>
                                        <MenuItem value={"08"}>08</MenuItem>
                                        <MenuItem value={"09"}>09</MenuItem>
                                        <MenuItem value={"10"}>10</MenuItem>
                                        <MenuItem value={11}>11</MenuItem>
                                        <MenuItem value={12}>12</MenuItem>
                                      </Select>
                                    </FormControl>
                                  </Grid>
                                  <Grid item xs={4} sm={4} md={3}>
                                    <FormControl size="small" fullWidth>
                                      <Select
                                        labelId="demo-select-small"
                                        id="demo-select-small"
                                        value={roleAndResAddEditcheck.min}
                                        MenuProps={{
                                          PaperProps: {
                                            style: {
                                              maxHeight: 200,
                                              width: 80,
                                            },
                                          },
                                        }}
                                        onChange={(e) => {
                                          setRoleAndResAddEditcheck({
                                            ...roleAndResAddEditcheck,
                                            min: e.target.value,
                                          });
                                        }}
                                      >
                                        <MenuItem value={"00"}>00</MenuItem>
                                        <MenuItem value={"01"}>01</MenuItem>
                                        <MenuItem value={"02"}>02</MenuItem>
                                        <MenuItem value={"03"}>03</MenuItem>
                                        <MenuItem value={"04"}>04</MenuItem>
                                        <MenuItem value={"05"}>05</MenuItem>
                                        <MenuItem value={"06"}>06</MenuItem>
                                        <MenuItem value={"07"}>07</MenuItem>
                                        <MenuItem value={"08"}>08</MenuItem>
                                        <MenuItem value={"09"}>09</MenuItem>
                                        <MenuItem value={"10"}>10</MenuItem>
                                        <MenuItem value={11}>11</MenuItem>
                                        <MenuItem value={12}>12</MenuItem>
                                        <MenuItem value={13}>13</MenuItem>
                                        <MenuItem value={14}>14</MenuItem>
                                        <MenuItem value={15}>15</MenuItem>
                                        <MenuItem value={16}>16</MenuItem>
                                        <MenuItem value={17}>17</MenuItem>
                                        <MenuItem value={18}>18</MenuItem>
                                        <MenuItem value={19}>19</MenuItem>
                                        <MenuItem value={20}>20</MenuItem>
                                        <MenuItem value={21}>21</MenuItem>
                                        <MenuItem value={22}>22</MenuItem>
                                        <MenuItem value={23}>23</MenuItem>
                                        <MenuItem value={24}>24</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={26}>26</MenuItem>
                                        <MenuItem value={27}>27</MenuItem>
                                        <MenuItem value={28}>28</MenuItem>
                                        <MenuItem value={29}>29</MenuItem>
                                        <MenuItem value={30}>30</MenuItem>
                                        <MenuItem value={31}>31</MenuItem>
                                        <MenuItem value={32}>32</MenuItem>
                                        <MenuItem value={33}>33</MenuItem>
                                        <MenuItem value={34}>34</MenuItem>
                                        <MenuItem value={35}>35</MenuItem>
                                        <MenuItem value={36}>36</MenuItem>
                                        <MenuItem value={37}>37</MenuItem>
                                        <MenuItem value={38}>38</MenuItem>
                                        <MenuItem value={39}>39</MenuItem>
                                        <MenuItem value={40}>40</MenuItem>
                                        <MenuItem value={41}>41</MenuItem>
                                        <MenuItem value={42}>42</MenuItem>
                                        <MenuItem value={43}>43</MenuItem>
                                        <MenuItem value={44}>44</MenuItem>
                                        <MenuItem value={45}>45</MenuItem>
                                        <MenuItem value={46}>46</MenuItem>
                                        <MenuItem value={47}>47</MenuItem>
                                        <MenuItem value={48}>48</MenuItem>
                                        <MenuItem value={49}>49</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={51}>51</MenuItem>
                                        <MenuItem value={52}>52</MenuItem>
                                        <MenuItem value={53}>53</MenuItem>
                                        <MenuItem value={54}>54</MenuItem>
                                        <MenuItem value={55}>55</MenuItem>
                                        <MenuItem value={56}>56</MenuItem>
                                        <MenuItem value={57}>57</MenuItem>
                                        <MenuItem value={58}>58</MenuItem>
                                        <MenuItem value={59}>59</MenuItem>
                                        <MenuItem value={60}>60</MenuItem>
                                      </Select>
                                    </FormControl>
                                  </Grid>
                                  <Grid item xs={4} sm={4} md={3}>
                                    <FormControl size="small" fullWidth>
                                      <Select
                                        labelId="demo-select-small"
                                        id="demo-select-small"
                                        value={roleAndResAddEditcheck.timetype}
                                        onChange={(e) => {
                                          setRoleAndResAddEditcheck({
                                            ...roleAndResAddEditcheck,
                                            timetype: e.target.value,
                                          });
                                        }}
                                      >
                                        <MenuItem value={"AM"}>AM</MenuItem>
                                        <MenuItem value={"PM"}>PM</MenuItem>
                                      </Select>
                                    </FormControl>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </>
                        )}

                      {(roleAndResAddEditcheck.frequency === "Monthly" ||
                        roleAndResAddEditcheck.frequency === "Month Wise") &&
                        roleAndResAddEditcheck.type === "Fixed" && (
                          <>
                            <Grid item md={4} sm={12} xs={12}>
                              <InputLabel>
                                {" "}
                                <b> Date </b>
                              </InputLabel>
                              <FormControl fullWidth size="small">
                                <OutlinedInput
                                  id="component-outlined"
                                  type="date"
                                  value={roleAndResAddEditcheck.date}
                                  onChange={(e) => {
                                    setRoleAndResAddEditcheck({
                                      ...roleAndResAddEditcheck,
                                      date: e.target.value,
                                    });
                                  }}
                                />
                              </FormControl>
                            </Grid>
                          </>
                        )}

                      {roleAndResAddEditcheck?.frequency === "Weekly" &&
                        roleAndResAddEditcheck?.type === "Fixed" && (
                          <>
                            <Grid item md={4} sm={12} xs={12}>
                              <InputLabel>
                                {" "}
                                <b> Days </b>
                              </InputLabel>
                              <FormControl fullWidth size="small">
                                <MultiSelect
                                  size="small"
                                  options={weekdays}
                                  value={selectedOptionsCateEdit}
                                  onChange={handleDaysChangeEdit}
                                  valueRenderer={customValueRendererCateEdit}
                                  labelledBy="Please Select Days"
                                />
                              </FormControl>
                            </Grid>
                          </>
                        )}
                    </Grid>
                  </Grid>
                  <Grid item md={2} sm={1} xs={1}>
                    <InputLabel> &nbsp;&nbsp;</InputLabel>
                    <Button
                      variant="contained"
                      style={{
                        height: "30px",
                        minWidth: "20px",
                        padding: "19px 13px",
                        // color: 'white',
                        // background: 'rgb(25, 118, 210)'
                      }}
                      // disabled={newTodoLabelcheck == ""}
                      onClick={() => {
                        handleCreateTodocheckedit();
                      }}
                    >
                      <FaPlus style={{ fontSize: "15px" }} />
                    </Button>
                    {/* )} */}
                  </Grid>
                </Grid>

                <br />
                <br />
                <Box>
                  {todoscheckedit.map((todo, index) => (
                    <div key={index}>
                      {editingIndexcheckedit === index ? (
                        <Grid container spacing={1}>
                          <Grid item md={10} sm={1} xs={1}>
                            <Grid container spacing={2}>
                              <Grid item md={3} sm={12} xs={12}>
                                <InputLabel>
                                  {" "}
                                  <b>
                                    Frequency <b style={{ color: "red" }}>*</b>
                                  </b>
                                </InputLabel>
                                <FormControl fullWidth size="small">
                                  <Selects
                                    value={{
                                      label: roleAndResEdittodo.frequency,
                                      value: roleAndResEdittodo.frequency,
                                    }}
                                    options={frequencyOpt}
                                    styles={colourStyles}
                                    onChange={(e) => {
                                      setRoleAndResEdittodo({
                                        ...roleAndResEdittodo,
                                        frequency: e.value,
                                      });
                                    }}
                                  />
                                </FormControl>
                              </Grid>
                              <Grid item md={3} sm={12} xs={12}>
                                <InputLabel>
                                  {" "}
                                  <b>
                                    Type <b style={{ color: "red" }}>*</b>
                                  </b>
                                </InputLabel>
                                <FormControl fullWidth size="small">
                                  <Selects
                                    options={typeOptions}
                                    styles={colourStyles}
                                    value={{
                                      label: roleAndResEdittodo.type,
                                      value: roleAndResEdittodo.type,
                                    }}
                                    onChange={(e) => {
                                      setRoleAndResEdittodo({
                                        ...roleAndResEdittodo,
                                        type: e.value,
                                      });
                                    }}
                                  />
                                </FormControl>
                              </Grid>

                              {(roleAndResEdittodo.frequency === "Daily" ||
                                roleAndResEdittodo.frequency === "Date Wise" ||
                                roleAndResEdittodo.frequency === "Day Wise") &&
                                roleAndResEdittodo.type === "Fixed" && (
                                  <>
                                    <Grid item md={3} sm={12} xs={12}>
                                      <InputLabel>
                                        {" "}
                                        <b> Time </b>
                                      </InputLabel>
                                      <Grid item md={12} sm={6} xs={12}>
                                        <Grid container>
                                          <Grid item xs={4} sm={4} md={4}>
                                            <FormControl size="small" fullWidth>
                                              <Select
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                value={roleAndResEdittodo.hour}
                                                MenuProps={{
                                                  PaperProps: {
                                                    style: {
                                                      maxHeight: 200,
                                                      width: 80,
                                                    },
                                                  },
                                                }}
                                                onChange={(e) => {
                                                  setRoleAndResEdittodo({
                                                    ...roleAndResEdittodo,
                                                    hour: e.target.value,
                                                  });
                                                }}
                                              >
                                                <MenuItem value={"01"}>
                                                  01
                                                </MenuItem>
                                                <MenuItem value={"02"}>
                                                  02
                                                </MenuItem>
                                                <MenuItem value={"03"}>
                                                  03
                                                </MenuItem>
                                                <MenuItem value={"04"}>
                                                  04
                                                </MenuItem>
                                                <MenuItem value={"05"}>
                                                  05
                                                </MenuItem>
                                                <MenuItem value={"06"}>
                                                  06
                                                </MenuItem>
                                                <MenuItem value={"07"}>
                                                  07
                                                </MenuItem>
                                                <MenuItem value={"08"}>
                                                  08
                                                </MenuItem>
                                                <MenuItem value={"09"}>
                                                  09
                                                </MenuItem>
                                                <MenuItem value={"10"}>
                                                  10
                                                </MenuItem>
                                                <MenuItem value={11}>
                                                  11
                                                </MenuItem>
                                                <MenuItem value={12}>
                                                  12
                                                </MenuItem>
                                              </Select>
                                            </FormControl>
                                          </Grid>
                                          <Grid item xs={4} sm={4} md={4}>
                                            <FormControl size="small" fullWidth>
                                              <Select
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                value={roleAndResEdittodo.min}
                                                MenuProps={{
                                                  PaperProps: {
                                                    style: {
                                                      maxHeight: 200,
                                                      width: 80,
                                                    },
                                                  },
                                                }}
                                                onChange={(e) => {
                                                  setRoleAndResEdittodo({
                                                    ...roleAndResEdittodo,
                                                    min: e.target.value,
                                                  });
                                                }}
                                              >
                                                <MenuItem value={"00"}>
                                                  00
                                                </MenuItem>
                                                <MenuItem value={"01"}>
                                                  01
                                                </MenuItem>
                                                <MenuItem value={"02"}>
                                                  02
                                                </MenuItem>
                                                <MenuItem value={"03"}>
                                                  03
                                                </MenuItem>
                                                <MenuItem value={"04"}>
                                                  04
                                                </MenuItem>
                                                <MenuItem value={"05"}>
                                                  05
                                                </MenuItem>
                                                <MenuItem value={"06"}>
                                                  06
                                                </MenuItem>
                                                <MenuItem value={"07"}>
                                                  07
                                                </MenuItem>
                                                <MenuItem value={"08"}>
                                                  08
                                                </MenuItem>
                                                <MenuItem value={"09"}>
                                                  09
                                                </MenuItem>
                                                <MenuItem value={"10"}>
                                                  10
                                                </MenuItem>
                                                <MenuItem value={11}>
                                                  11
                                                </MenuItem>
                                                <MenuItem value={12}>
                                                  12
                                                </MenuItem>
                                                <MenuItem value={13}>
                                                  13
                                                </MenuItem>
                                                <MenuItem value={14}>
                                                  14
                                                </MenuItem>
                                                <MenuItem value={15}>
                                                  15
                                                </MenuItem>
                                                <MenuItem value={16}>
                                                  16
                                                </MenuItem>
                                                <MenuItem value={17}>
                                                  17
                                                </MenuItem>
                                                <MenuItem value={18}>
                                                  18
                                                </MenuItem>
                                                <MenuItem value={19}>
                                                  19
                                                </MenuItem>
                                                <MenuItem value={20}>
                                                  20
                                                </MenuItem>
                                                <MenuItem value={21}>
                                                  21
                                                </MenuItem>
                                                <MenuItem value={22}>
                                                  22
                                                </MenuItem>
                                                <MenuItem value={23}>
                                                  23
                                                </MenuItem>
                                                <MenuItem value={24}>
                                                  24
                                                </MenuItem>
                                                <MenuItem value={25}>
                                                  25
                                                </MenuItem>
                                                <MenuItem value={26}>
                                                  26
                                                </MenuItem>
                                                <MenuItem value={27}>
                                                  27
                                                </MenuItem>
                                                <MenuItem value={28}>
                                                  28
                                                </MenuItem>
                                                <MenuItem value={29}>
                                                  29
                                                </MenuItem>
                                                <MenuItem value={30}>
                                                  30
                                                </MenuItem>
                                                <MenuItem value={31}>
                                                  31
                                                </MenuItem>
                                                <MenuItem value={32}>
                                                  32
                                                </MenuItem>
                                                <MenuItem value={33}>
                                                  33
                                                </MenuItem>
                                                <MenuItem value={34}>
                                                  34
                                                </MenuItem>
                                                <MenuItem value={35}>
                                                  35
                                                </MenuItem>
                                                <MenuItem value={36}>
                                                  36
                                                </MenuItem>
                                                <MenuItem value={37}>
                                                  37
                                                </MenuItem>
                                                <MenuItem value={38}>
                                                  38
                                                </MenuItem>
                                                <MenuItem value={39}>
                                                  39
                                                </MenuItem>
                                                <MenuItem value={40}>
                                                  40
                                                </MenuItem>
                                                <MenuItem value={41}>
                                                  41
                                                </MenuItem>
                                                <MenuItem value={42}>
                                                  42
                                                </MenuItem>
                                                <MenuItem value={43}>
                                                  43
                                                </MenuItem>
                                                <MenuItem value={44}>
                                                  44
                                                </MenuItem>
                                                <MenuItem value={45}>
                                                  45
                                                </MenuItem>
                                                <MenuItem value={46}>
                                                  46
                                                </MenuItem>
                                                <MenuItem value={47}>
                                                  47
                                                </MenuItem>
                                                <MenuItem value={48}>
                                                  48
                                                </MenuItem>
                                                <MenuItem value={49}>
                                                  49
                                                </MenuItem>
                                                <MenuItem value={50}>
                                                  50
                                                </MenuItem>
                                                <MenuItem value={51}>
                                                  51
                                                </MenuItem>
                                                <MenuItem value={52}>
                                                  52
                                                </MenuItem>
                                                <MenuItem value={53}>
                                                  53
                                                </MenuItem>
                                                <MenuItem value={54}>
                                                  54
                                                </MenuItem>
                                                <MenuItem value={55}>
                                                  55
                                                </MenuItem>
                                                <MenuItem value={56}>
                                                  56
                                                </MenuItem>
                                                <MenuItem value={57}>
                                                  57
                                                </MenuItem>
                                                <MenuItem value={58}>
                                                  58
                                                </MenuItem>
                                                <MenuItem value={59}>
                                                  59
                                                </MenuItem>
                                                <MenuItem value={60}>
                                                  60
                                                </MenuItem>
                                              </Select>
                                            </FormControl>
                                          </Grid>
                                          <Grid item xs={4} sm={4} md={4}>
                                            <FormControl size="small" fullWidth>
                                              <Select
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                value={
                                                  roleAndResEdittodo.timetype
                                                }
                                                onChange={(e) => {
                                                  setRoleAndResEdittodo({
                                                    ...roleAndResEdittodo,
                                                    timetype: e.target.value,
                                                  });
                                                }}
                                              >
                                                <MenuItem value={"AM"}>
                                                  AM
                                                </MenuItem>
                                                <MenuItem value={"PM"}>
                                                  PM
                                                </MenuItem>
                                              </Select>
                                            </FormControl>
                                          </Grid>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}

                              {(roleAndResEdittodo.frequency === "Monthly" ||
                                roleAndResEdittodo.frequency ===
                                  "Month Wise") &&
                                roleAndResEdittodo.type === "Fixed" && (
                                  <>
                                    <Grid item md={3} sm={12} xs={12}>
                                      <InputLabel>
                                        {" "}
                                        <b> Date </b>
                                      </InputLabel>
                                      <FormControl fullWidth size="small">
                                        <OutlinedInput
                                          id="component-outlined"
                                          type="date"
                                          value={roleAndResEdittodo.date}
                                          onChange={(e) => {
                                            setRoleAndResEdittodo({
                                              ...roleAndResEdittodo,
                                              date: e.target.value,
                                            });
                                          }}
                                        />
                                      </FormControl>
                                    </Grid>
                                  </>
                                )}

                              {roleAndResEdittodo.frequency === "Weekly" &&
                                roleAndResEdittodo.type === "Fixed" && (
                                  <>
                                    <Grid item md={3} sm={12} xs={12}>
                                      <InputLabel>
                                        {" "}
                                        <b> Days </b>
                                      </InputLabel>
                                      <FormControl fullWidth size="small">
                                        <MultiSelect
                                          size="small"
                                          options={weekdaysEdittodoedit}
                                          value={
                                            selectedOptionsCateEdittodoedit
                                          }
                                          onChange={
                                            handleDaysChangeEdittodoedit
                                          }
                                          valueRenderer={
                                            customValueRendererCateEdittodoedit
                                          }
                                          labelledBy="Please Select Days"
                                        />
                                      </FormControl>
                                    </Grid>
                                  </>
                                )}
                            </Grid>
                          </Grid>
                          <br /> <br />
                          <Grid item md={1} sm={1.5} xs={1.5}>
                            {/* {todoCheckCreateEdit ? (
                            ""
                          ) : editedTododescheck !== "" &&
                            editcheckpoint !== "" ? ( */}
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
                            {/* ) : (
                            ""
                          )} */}
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
                          <Grid item md={1} sm={3} xs={3}>
                            <Typography
                              variant="subtitle2"
                              color="textSecondary"
                              sx={{
                                whiteSpace: "pre-line",
                                wordBreak: "break-all",
                              }}
                            >
                              {todo.frequency}
                            </Typography>
                          </Grid>
                          <Grid item md={1} sm={3} xs={3}>
                            <Typography
                              variant="subtitle2"
                              color="textSecondary"
                              sx={{
                                whiteSpace: "pre-line",
                                wordBreak: "break-all",
                              }}
                            >
                              {todo.type}
                            </Typography>
                          </Grid>
                          {["Daily", "Day Wise", "Date Wise"].includes(
                            todo.frequency
                          ) && todo.type === "Fixed" ? (
                            <>
                              <Grid item md={1} sm={3} xs={3}>
                                <Typography
                                  variant="subtitle2"
                                  color="textSecondary"
                                  sx={{
                                    whiteSpace: "pre-line",
                                    wordBreak: "break-all",
                                  }}
                                >
                                  {todo.hour}
                                </Typography>
                              </Grid>
                              <Grid item md={1} sm={3} xs={3}>
                                <Typography
                                  variant="subtitle2"
                                  color="textSecondary"
                                  sx={{
                                    whiteSpace: "pre-line",
                                    wordBreak: "break-all",
                                  }}
                                >
                                  {todo.min}
                                </Typography>
                              </Grid>
                              <Grid item md={1} sm={3} xs={3}>
                                <Typography
                                  variant="subtitle2"
                                  color="textSecondary"
                                  sx={{
                                    whiteSpace: "pre-line",
                                    wordBreak: "break-all",
                                  }}
                                >
                                  {todo.timetype}
                                </Typography>
                              </Grid>
                            </>
                          ) : ["Monthly", "Month Wise"].includes(
                              todo.frequency
                            ) && todo.type === "Fixed" ? (
                            <>
                              <Grid item md={1} sm={3} xs={3}>
                                <Typography
                                  variant="subtitle2"
                                  color="textSecondary"
                                  sx={{
                                    whiteSpace: "pre-line",
                                    wordBreak: "break-all",
                                  }}
                                >
                                  {todo.date}
                                </Typography>
                              </Grid>
                              <Grid item md={2} sm={3} xs={3}></Grid>
                            </>
                          ) : todo.type === "Fixed" &&
                            todo.frequency === "Weekly" ? (
                            <>
                              <Grid item md={1} sm={3} xs={3}>
                                <Typography
                                  variant="subtitle2"
                                  color="textSecondary"
                                  sx={{
                                    whiteSpace: "pre-line",
                                    wordBreak: "break-all",
                                  }}
                                >
                                  {todo.days}
                                </Typography>
                              </Grid>
                              <Grid item md={2} sm={3} xs={3}></Grid>
                            </>
                          ) : (
                            <Grid item md={3} sm={3} xs={3}></Grid>
                          )}

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
                              onClick={() => handleEditTodocheckedit(index)}
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
                              onClick={() => handleDeleteTodocheckedit(index)}
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
            <br />

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <InputLabel>
                {" "}
                <b>
                  Description <b style={{ color: "red" }}>*</b>
                </b>
              </InputLabel>
              <FormControl fullWidth size="small">
                <ReactQuill
                  style={{ height: "180px" }}
                  value={roleAndResTextAreaEdit}
                  onChange={handleRoleAndResponseEdit}
                  modules={{
                    toolbar: [
                      [{ header: "1" }, { header: "2" }, { font: [] }],
                      [{ size: [] }],
                      ["bold", "italic", "underline", "strike", "blockquote"],
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
            </Grid>

            <br />
            <br />
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <Button variant="contained" onClick={editSubmit}>
                  {" "}
                  Update
                </Button>
              </Grid>
              <br />
              <Grid item md={6} xs={12} sm={12}>
                <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
                  {" "}
                  Cancel{" "}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Dialog>
      </Box>
      <br />
      {/* ****** Table Start ****** */}

      {isUserRoleCompare?.includes("lrolesofresponsibilities") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Role of Responsibilities List{" "}
              </Typography>
            </Grid>
            <Grid container sx={{ justifyContent: "center" }}>
              <Grid>
                {isUserRoleCompare?.includes(
                  "excelrolesofresponsibilities"
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
                {isUserRoleCompare?.includes("csvrolesofresponsibilities") && (
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
                    </Button>{" "}
                  </>
                )}
                {isUserRoleCompare?.includes(
                  "printrolesofresponsibilities"
                ) && (
                  <>
                    <Button sx={userStyle.buttongrp} onClick={handleprint}>
                      &ensp;
                      <FaPrint />
                      &ensp;Print&ensp;
                    </Button>
                  </>
                )}
                {isUserRoleCompare?.includes("pdfrolesofresponsibilities") && (
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
                <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                  {" "}
                  <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;image&ensp;{" "}
                </Button>
              </Grid>
            </Grid>
            <br />
            {/* ****** Table Grid Container ****** */}
            <Grid style={userStyle.dataTablestyle}>
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
                  <MenuItem value={allRoleAndRes?.length}>All</MenuItem>
                </Select>
              </Box>
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
            <br />
            <br />
            <Button
              sx={userStyle.buttongrp}
              onClick={() => {
                handleShowAllColumns();
                setColumnVisibility(initialColumnVisibility);
              }}
            >
              Show All Columns
            </Button>
            &ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
              Manage Columns
            </Button>
            &ensp;
            {isUserRoleCompare?.includes("bdrolesofresponsibilities") && (
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
            {/* {isLoader ? ( */}
            <>
              <Box style={{ width: "100%", overflowY: "hidden" }}>
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
              <br />
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
              <br /> <br />
            </>
          </Box>
        </>
      )}
      {/* ****** Table End ****** */}
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
            <Button
              onClick={handleCloseMod}
              style={{
                backgroundColor: "#f4f4f4",
                color: "#444",
                boxShadow: "none",
                borderRadius: "3px",
                border: "1px solid #0000006b",
                "&:hover": {
                  "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                    backgroundColor: "#f4f4f4",
                  },
                },
              }}
            >
              Cancel
            </Button>
            <Button
              autoFocus
              variant="contained"
              color="error"
              onClick={(e) => delProject(projectid)}
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
                Roles Of Responsibilities Info
              </Typography>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Added By</Typography>
                    <br />
                    <Table>
                      <TableHead>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {"S.No"}.
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {" "}
                          {"User Name"}
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
                    <Typography variant="h6">Updated By</Typography>
                    <br />
                    <Table>
                      <TableHead>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {"S.No"}.
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {" "}
                          {"User Name"}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {" "}
                          {"Date"}
                        </StyledTableCell>
                      </TableHead>
                      <TableBody>
                        {updatedby?.map((item, i) => (
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

        <TableContainer component={Paper} sx={userStyle.printcls}>
          <Table
            sx={{ minWidth: 700 }}
            aria-label="customized table"
            id="usertable"
            ref={componentRef}
          >
            <TableHead>
              <TableRow>
                <TableCell>S.No</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Sub Category</TableCell>
                {/* <TableCell>Frequency</TableCell> */}
                <TableCell>Designation Group </TableCell>
                <TableCell>Designation </TableCell>
                {/* <TableCell>Type</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Days</TableCell>
                <TableCell>Date</TableCell> */}
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody align="left">
              {filteredData &&
                filteredData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {Array.isArray(row.category)
                        ? row.category.join(",")
                        : ""}
                    </TableCell>
                    <TableCell>
                      {Array.isArray(row.subcategory)
                        ? row.subcategory.join(",")
                        : ""}
                    </TableCell>
                    {/* <TableCell>{row.frequency}</TableCell> */}
                    <TableCell>
                      {Array.isArray(row.designationgroup)
                        ? row.designationgroup.join(",")
                        : ""}
                    </TableCell>
                    <TableCell>
                      {Array.isArray(row.designation)
                        ? row.designation.join(",")
                        : ""}
                    </TableCell>
                    {/* <TableCell>{row.type}</TableCell>
                    <TableCell>{((row.frequency === "Daily" || row.frequency === "Date Wise" || row.frequency === "Day Wise") && row.type === "Fixed") ? row.hour + ":" + row.min + ":" + row.timetype : "-"}</TableCell>
                    <TableCell>{(row.frequency === "Weekly" && row.type === "Fixed") ? row.days.join(",") : "-"}</TableCell>
                    <TableCell>{((row.frequency === "Monthly" || row.frequency === "Month Wise") && row.type === "Fixed") ? moment(row?.date).format("DD-MM-YYYY") : "-"}</TableCell> */}
                    <TableCell>
                      {convertToNumberedList(row.description)}
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
        fullWidth
      >
        <Box sx={{ width: "auto", padding: "20px 50px" }}>
          <Typography sx={userStyle.HeaderText}>
            {" "}
            View Roles Of Responsibilities
          </Typography>

          <Grid container spacing={2}>
            <Grid item md={6} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6"> Category</Typography>
                <Typography
                  sx={{
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {Array.isArray(roleAndResEdit.category)
                    ? roleAndResEdit.category.join(",")
                    : ""}
                </Typography>
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">SubCategory</Typography>
                <Typography
                  sx={{
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {Array.isArray(roleAndResEdit.subcategory)
                    ? roleAndResEdit.subcategory.join(",")
                    : ""}
                </Typography>
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Designation Group</Typography>
                <Typography
                  sx={{
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {Array.isArray(roleAndResEdit.designationgroup)
                    ? roleAndResEdit.designationgroup.join(",")
                    : ""}
                </Typography>
                {/* <Typography>{Array.isArray(roleAndResEdit.designationgroup) ? roleAndResEdit.designationgroup.join(",") : ""}</Typography> */}
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Designation</Typography>
                <Typography
                  sx={{
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {Array.isArray(roleAndResEdit.designation)
                    ? roleAndResEdit.designation.join(",")
                    : ""}
                </Typography>
              </FormControl>
            </Grid>
            <Grid item md={2} xs={12} sm={12}>
              {" "}
              <Typography variant="h6">Freqyency</Typography>{" "}
            </Grid>
            <Grid item md={2} xs={12} sm={12}>
              {" "}
              <Typography variant="h6">Type</Typography>{" "}
            </Grid>
            <Grid item md={8} xs={12} sm={12}>
              {" "}
            </Grid>
            <Grid item md={12} xs={12} sm={12}>
              <>
                <Box>
                  {todoscheckedit.map((todo, index) => (
                    <div key={index}>
                      {
                        <Grid container spacing={1}>
                          <Grid item md={2} sm={3} xs={3}>
                            <Typography
                              variant="subtitle2"
                              color="textSecondary"
                              sx={{
                                whiteSpace: "pre-line",
                                wordBreak: "break-all",
                              }}
                            >
                              {todo.frequency}
                            </Typography>
                          </Grid>
                          <Grid item md={2} sm={3} xs={3}>
                            <Typography
                              variant="subtitle2"
                              color="textSecondary"
                              sx={{
                                whiteSpace: "pre-line",
                                wordBreak: "break-all",
                              }}
                            >
                              {todo.type}
                            </Typography>
                          </Grid>
                          {["Daily", "Day Wise", "Date Wise"].includes(
                            todo.frequency
                          ) && todo.type === "Fixed" ? (
                            <>
                              <Grid item md={2} sm={3} xs={3}>
                                <Typography
                                  variant="subtitle2"
                                  color="textSecondary"
                                  sx={{
                                    whiteSpace: "pre-line",
                                    wordBreak: "break-all",
                                  }}
                                >
                                  {todo.hour}
                                </Typography>
                              </Grid>
                              <Grid item md={2} sm={3} xs={3}>
                                <Typography
                                  variant="subtitle2"
                                  color="textSecondary"
                                  sx={{
                                    whiteSpace: "pre-line",
                                    wordBreak: "break-all",
                                  }}
                                >
                                  {todo.min}
                                </Typography>
                              </Grid>
                              <Grid item md={2} sm={3} xs={3}>
                                <Typography
                                  variant="subtitle2"
                                  color="textSecondary"
                                  sx={{
                                    whiteSpace: "pre-line",
                                    wordBreak: "break-all",
                                  }}
                                >
                                  {todo.timetype}
                                </Typography>
                              </Grid>
                            </>
                          ) : ["Monthly", "Month Wise"].includes(
                              todo.frequency
                            ) && todo.type === "Fixed" ? (
                            <>
                              <Grid item md={2} sm={3} xs={3}>
                                <Typography
                                  variant="subtitle2"
                                  color="textSecondary"
                                  sx={{
                                    whiteSpace: "pre-line",
                                    wordBreak: "break-all",
                                  }}
                                >
                                  {todo.date}
                                </Typography>
                              </Grid>
                            </>
                          ) : todo.type === "Fixed" &&
                            todo.frequency === "Weekly" ? (
                            <>
                              <Grid item md={2} sm={3} xs={3}>
                                <Typography
                                  variant="subtitle2"
                                  color="textSecondary"
                                  sx={{
                                    whiteSpace: "pre-line",
                                    wordBreak: "break-all",
                                  }}
                                >
                                  {todo.days}
                                </Typography>
                              </Grid>
                            </>
                          ) : (
                            ""
                          )}
                        </Grid>
                      }
                      <br />
                    </div>
                  ))}
                </Box>
              </>
            </Grid>
            <br />

            <Grid item md={6} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Description</Typography>
                <Typography>
                  {convertToNumberedList(roleAndResEdit.description)}
                </Typography>
              </FormControl>
            </Grid>
          </Grid>
          <br />
          <br />
          <br />
          <Grid container spacing={2} sx={{ marginLeft: "3px" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCloseview}
            >
              {" "}
              Back{" "}
            </Button>
          </Grid>
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
              onClick={(e) => delReasoncheckbox(e)}
            >
              {" "}
              OK{" "}
            </Button>
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
    </Box>
  );
}

export default Roleandres;
