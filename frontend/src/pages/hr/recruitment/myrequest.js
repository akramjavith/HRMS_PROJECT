import React, { useState, useEffect, useRef, useContext } from "react";
import {
  TextareaAutosize,
  Box,
  Typography,
  OutlinedInput,
  TableRow,
  TableCell,
  TableBody,
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
  IconButton,
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { handleApiError } from "../../../components/Errorhandling";
import { ExportXL, ExportCSV } from "../../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { MultiSelect } from "react-multi-select-component";
import "../../../App.css";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";
import { saveAs } from "file-saver";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";

function Myrequest() {
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
        filteredData.map((t, index) => ({
          "S.No": index + 1,
          Company: t.company,
          Branch: t.branch,
          Floor: t.floor,
          Area: t.area?.join(","),
          "Approved Seats": t.seats,
          Designation: t.designation,
          Education: t.education?.join(","),
          Language: t.language?.join(","),
          Skill: t.skill?.join(","),
          Status: "On Progress",
        })),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        myrequest?.map((t, index) => ({
          "S.No": index + 1,
          Company: t.company,
          Branch: t.branch,
          Floor: t.floor,
          Area: t.area?.join(","),
          "Approved Seats": t.seats,
          Designation: t.designation,
          Education: t.education?.join(","),
          Language: t.language?.join(","),
          Skill: t.skill?.join(","),
          Status: "On Progress",
        })),
        fileName
      );
    }

    setIsFilterOpen(false);
  };

  //  PDF
  const columns = [
    { title: "Company", field: "company" },
    { title: "Branch", field: "branch" },
    { title: "Floor", field: "floor" },
    { title: "Area", field: "area" },
    { title: "Approved Seats", field: "seats" },
    { title: "Designation", field: "designation" },
    { title: "Education", field: "education" },
    { title: "Language", field: "language" },
    { title: "Skill", field: "skill" },
    { title: "Status", field: "status" },
  ];

  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();
    // Initialize serial number counter
    // Modify columns to include serial number column
    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" }, // Serial number column
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial =
      isfilter === "filtered"
        ? filteredData.map((t, index) => ({
            ...t,
            serialNumber: index + 1,
            education: t.education?.join(","),
            language: t.language?.join(","),
            skill: t.skill?.join(","),
            area: t.area?.join(","),
            status: "On Progrss",
          }))
        : myrequest?.map((t, index) => ({
            serialNumber: index + 1,
            company: t.company,
            branch: t.branch,
            floor: t.floor,
            area: t.area?.join(","),
            seats: t.seats,
            designation: t.designation,
            education: t.education?.join(","),
            language: t.language?.join(","),
            skill: t.skill?.join(","),
            status: "On Progress",
          }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: "5" },
    });

    doc.save("MyRequest_Vacancy_Posting.pdf");
  };

  const gridRef = useRef(null);

  //image

  const handleCaptureImage = () => {
    // Find the table by its ID
    const table = document.getElementById("excelcanvastable");

    // Clone the table element
    const clonedTable = table.cloneNode(true);

    // Append the cloned table to the document body (it won't be visible)
    clonedTable.style.position = "absolute";
    clonedTable.style.top = "-9999px";
    document.body.appendChild(clonedTable);

    // Use html2canvas to capture the cloned table
    html2canvas(clonedTable).then((canvas) => {
      // Remove the cloned table from the document body
      document.body.removeChild(clonedTable);

      // Convert the canvas to a data URL and create a download link
      const dataURL = canvas.toDataURL("image/jpeg", 0.8);
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "MyRequest_Vacancy_Posting.png";
      link.click();
    });
  };

  const [myrequest, setMyrequest] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess , isAssignBranch} = useContext(
    UserRoleAccessContext
  );
  const { auth } = useContext(AuthContext);
  const [queueCheck, setQueueCheck] = useState(false);

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [queueData, setQueueData] = useState([]);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sorting, setSorting] = useState({ column: "", direction: "" });

  const [selectedRows, setSelectedRows] = useState([]);

  const [showAlert, setShowAlert] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  const [openInfo, setOpeninfo] = useState(false);
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };
  const [educationEditOpt, setEducationEditOpt] = useState([]);
  const [categorysEdit, setCategorysEdit] = useState([]);
  const [subcategorysEdit, setSubcategorysEdit] = useState([]);
  const [selectedOptionsEduEdit, setSelectedOptionsEduEdit] = useState([]);
  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const handleEducationChangeEdit = (options) => {
    setSelectedOptionsEduEdit(options);
  };

  const customValueRendererEduEdit = (valueEduEdit, _educations) => {
    return valueEduEdit.length
      ? valueEduEdit.map(({ label }) => label).join(", ")
      : "Please Select Specialization";
  };

  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };

  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  };

  const fetchCategoryEducation = async () => {
    try {
      let res_category = await axios.get(SERVICE.CATEGORYEDUCATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let data_set = res_category.data.educationcategory.map(
        (d) => d.categoryname
      );
      let filter_opt = [...new Set(data_set)];

      setCategorysEdit(
        filter_opt.map((data) => ({
          ...data,
          label: data,
          value: data,
        }))
      );
} catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //get all project.
  const fetchAllApproveds = async () => {
    try {
      let resans = [];
      let res_queue = await axios.get(SERVICE.APPROVEDS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      }); const accessbranch = isAssignBranch?.map(data => ({
        branch: data.branch,
        company: data.company
      })).filter((item, index, self) => {
        return index === self.findIndex((i) => i.branch === item.branch && i.company === item.company)
      })

      const finaldata = res_queue?.data?.approvevacancies.filter((data, index)=>{
        accessbranch.forEach((d, i)=>{
          if(d.company === data.company && d.branch === data.branch){
            resans.push(data)
          }
        })
      })
      
      setMyrequest(resans);
      setQueueCheck(true);
    } catch (err) {setQueueCheck(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  useEffect(() => {
    fetchAllApproveds();
    fetchCategoryEducation();
  }, []);

  // Edit start
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
  };
  //get single row to edit....
  const [approveedit, setApproveEdit] = useState({});
  const getCode = async (e, name) => {
    try {
      let res = await axios.get(`${SERVICE.APPROVEDS_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setValueLan(res?.data?.sapprovevacancies?.language);
      setValueSkill(res?.data?.sapprovevacancies?.skill);
      setApproveEdit(res?.data?.sapprovevacancies);
      setSelectedOptionsEduEdit(
        res?.data?.sapprovevacancies.education.map((item) => ({
          ...item,
          label: item,
          value: item,
        }))
      );
      fetchCategoryBasedEdit(res?.data?.sapprovevacancies.category);
      setValueCateEdit(res?.data?.sapprovevacancies.category);
      fetchEducationEdit(
        res?.data?.sapprovevacancies?.category,
        res?.data?.sapprovevacancies?.subcategory
      );
      setSelectedOptionsCateEdit(
        res?.data?.sapprovevacancies?.category.map((item) => ({
          ...item,
          label: item,
          value: item,
        }))
      );
      setSelectedOptionsSubCateEdit(
        res?.data?.sapprovevacancies?.subcategory.map((item) => ({
          ...item,
          label: item,
          value: item,
        }))
      );
      handleClickOpenEdit();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const fetchEducationEdit = async (valueCate, e) => {
    try {
      let res = await axios.get(SERVICE.EDUCATIONSPECILIZATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let data_set = res.data.educationspecilizations
        .filter((data) => {
          return (
            valueCate.some((item) => data.category.includes(item)) &&
            e.some((item) => data.subcategory.includes(item))
          );
        })
        .map((value) => value.specilizationgrp);

      let ans = [].concat(...data_set);

      let filter_opt = [...new Set(ans)];

      setEducationEditOpt(
        filter_opt.map((data) => ({
          label: data.label,
          value: data.label,
        }))
      );
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  let updateby = approveedit.updatedby;
  let addedby = approveedit.addedby;

  const [selectEductionValue, setSelectEductionValue] = useState([]);
  const [selectedOptionsCateEdit, setSelectedOptionsCateEdit] = useState([]);
  let [valueCateEdit, setValueCateEdit] = useState("");

  const handleCategoryChangeEdit = (options) => {
    setValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCateEdit(options);
    fetchCategoryBasedEdit(options.map((item) => item.value));
  };

  const customValueRendererCateEdit = (valueCateEdit, _categorys) => {
    return valueCateEdit.length
      ? valueCateEdit.map(({ label }) => label).join(", ")
      : "Please Select Category";
  };

  const [selectedOptionsSubCateEdit, setSelectedOptionsSubCateEdit] = useState(
    []
  );

  const handleSubCategoryChangeEdit = (options) => {
    setSelectedOptionsSubCateEdit(options);
  };

  const customValueRendererSubCateEdit = (valueSubCateEdit, _subcategorys) => {
    return valueSubCateEdit.length
      ? valueSubCateEdit.map(({ label }) => label).join(", ")
      : "Please Select Subcategory";
  };

  const [language, setLanguage] = useState([
    { label: "Tamil", value: "Tamil" },
    { label: "English", value: "English" },
  ]);
  const [selectedOptionsLan, setSelectedOptionsLan] = useState([]);
  let [valueLan, setValueLan] = useState("");

  const handleLanguageChange = (options) => {
    setValueLan(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsLan(options);
  };

  const customValueRendererLan = (valueLan, _language) => {
    return valueLan.length
      ? valueLan.map(({ label }) => label).join(", ")
      : "Any Language";
  };

  const [skill, setSkill] = useState([]);
  const fetchAllSkill = async () => {
    try {
      let res_queue = await axios.get(SERVICE.SKILLSET, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSkill(
        res_queue?.data?.skillsets?.map((t) => ({
          ...t,
          label: t.name,
          value: t.name,
        }))
      );
   } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const fetchCategoryBasedEdit = async (e) => {
    // let employ = e.map((item) => item.value);

    try {
      let res_category = await axios.get(SERVICE.CATEGORYEDUCATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let data_set = res_category.data.educationcategory
        .filter((data) => {
          return e.includes(data.categoryname);
        })
        .map((value) => value.subcategoryname);

      let ans = [].concat(...data_set);

      let filter_opt = [...new Set(ans)];

      setSubcategorysEdit(
        filter_opt.map((data) => ({
          ...data,
          label: data,
          value: data,
        }))
      );
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const [selectedOptionsSkill, setSelectedOptionsSkill] = useState([]);
  let [ValueSkill, setValueSkill] = useState("");

  const handleSkillChange = (options) => {
    let value = [];
    setValueSkill(
      options.map((a, index) => {
        value.push(a.value);
        return a.value;
      })
    );
    setSelectedOptionsSkill(options);
  };

  const customValueRendererSkill = (ValueSkill, _skill) => {
    return ValueSkill.length
      ? ValueSkill.map(({ label }) => label).join(", ")
      : "Any Language";
  };

  // Multi select
  const getunitvaluesCate = (e) => {
    setSelectEductionValue(
      Array.isArray(e?.education)
        ? e?.education?.map((x) => ({
            ...x,
            label: x,
            value: x,
            key: `education-${x._id}`,
          }))
        : []
    );
    setSelectedOptionsLan(
      Array.isArray(e?.language)
        ? e?.language?.map((x) => ({
            ...x,
            label: x,
            value: x,
            key: `language-${x._id}`,
          }))
        : []
    );
    setSelectedOptionsSkill(
      Array.isArray(e?.skill)
        ? e?.skill?.map((x) => ({
            ...x,
            label: x,
            value: x,
            key: `skill-${x._id}`,
          }))
        : []
    );
  };

  useEffect(() => {
    fetchAllSkill();
  }, []);

  const username = isUserRoleAccess.username;
  let projectsid = approveedit._id;

  const sendEditRequest = async () => {
    let empedu = selectedOptionsEduEdit.map((item) => item.value);
    let empCate = selectedOptionsCateEdit.map((item) => item.value);
    let empSubcate = selectedOptionsSubCateEdit.map((item) => item.value);
    try {
      let res = await axios.put(`${SERVICE.APPROVEDS_SINGLE}/${projectsid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        branch: String(approveedit.branch),
        designation: String(approveedit.designation),
        seats: String(approveedit.seats),
        floor: String(approveedit.floor),
        fromexperience: String(approveedit.fromexperience),
        toexperience: String(approveedit.toexperience),
        fromsalary: String(approveedit.fromsalary),
        tosalary: String(approveedit.tosalary),
        category: [...empCate],
        subcategory: [...empSubcate],
        education: [...empedu],
        language: [...valueLan],
        skill: [...ValueSkill],
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      setApproveEdit(res.data);
      await fetchAllApproveds();
      handleCloseModEdit();
      setShowAlert(
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Updated Successfully👍"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  // Edit End
  const editSubmit = () => {
    if (selectedOptionsCateEdit.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Please Select Category
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedOptionsSubCateEdit.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Please Select Sub Category
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedOptionsEduEdit.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Please Select Education
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedOptionsSkill.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Please Select Skill
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (selectEductionValue.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Please Select Education
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      approveedit.designation == "Choose Designation" ||
      approveedit.designation == ""
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Please Select Designation
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedOptionsLan.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Please Select Language
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (approveedit.branch == "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Please Enter Branch
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (approveedit.floor == "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Please Enter Floor
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (approveedit.seats == "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Please Enter Seats
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      approveedit.fromexperience == "" ||
      approveedit.toexperience == ""
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Please Enter Experience
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (approveedit.fromexperience > approveedit.toexperience) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"From Experience must be less than To Experience "}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (approveedit.fromsalary == "" || approveedit.tosalary == "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Please Enter Salary
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (approveedit.fromsalary > approveedit.tosalary) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"From Salary must be less than To Salary "}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendEditRequest();
    }
  };
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  //Delete model
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };
  // View start
  const [openview, setOpenview] = useState(false);

  const handleClickOpenview = () => {
    setOpenview(true);
  };

  const handleCloseview = () => {
    setOpenview(false);
  };
  // View end
  // Delete start
  const [deletequeue, setDeleteQueue] = useState({});
  const rowData = async (id, name) => {
    try {
      let res = await axios.get(`${SERVICE.APPROVEDS_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteQueue(res?.data?.sapprovevacancies);
      handleClickOpen();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  // Alert delete popup
  let queueid = deletequeue._id;
  const deleQueue = async () => {
    try {
      await axios.delete(`${SERVICE.APPROVEDS_SINGLE}/${queueid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchAllApproveds();
      handleCloseMod();
      setSelectedRows([]);
      setPage(1);
      setShowAlert(
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Deleted Successfully👍"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  // Delete End

  const delMyrequestcheckbox = async () => {
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.APPROVEDS_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);

      handleCloseModcheckbox();
      setSelectedRows([]);
      setPage(1);

      await fetchAllApproveds();
      setShowAlert(
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Deleted Successfully👍"}
          </p>
        </>
      );
      handleClickOpenerr();
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  // View start
  // get single row to view....
  const getviewCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.APPROVEDS_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setApproveEdit(res?.data?.sapprovevacancies);
      handleClickOpenview();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  // View End

  // Info start
  // get single row to view....
  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.APPROVEDS_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setApproveEdit(res?.data?.sapprovevacancies);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //serial no for listing items
  const addSerialNumber = () => {
    const itemsWithSerialNumber = myrequest?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };

  //table sorting
  const handleSorting = (column) => {
    const direction =
      sorting.column === column && sorting.direction === "asc" ? "desc" : "asc";
    setSorting({ column, direction });
  };

  const sortedData = items.sort((a, b) => {
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
              <ArrowDropUpOutlinedIcon
                style={{ color: "black", fontSize: "1.6rem" }}
              />
            </Grid>
            <Grid sx={{ height: "6px" }}>
              <ArrowDropDownOutlinedIcon
                style={{ color: "#bbb6b6", fontSize: "1.6rem" }}
              />
            </Grid>
          </Box>
        </>
      );
    } else {
      return (
        <>
          <Box>
            <Grid sx={{ height: "6px" }}>
              <ArrowDropUpOutlinedIcon
                style={{ color: "#bbb6b6", fontSize: "1.6rem" }}
              />
            </Grid>
            <Grid sx={{ height: "6px" }}>
              <ArrowDropDownOutlinedIcon
                style={{ color: "black", fontSize: "1.6rem" }}
              />
            </Grid>
          </Box>
        </>
      );
    }
  };

  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSelectedRows([]);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setSelectedRows([]);
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
    addSerialNumber();
  }, [myrequest]);
  const fileName = "MyRequest_Vacancy_Posting";
  // get particular columns for export excel
  const getexcelDatas = async () => {
      var data = filteredData.map((t, i) => ({
        Sno: i + 1,
        Company: t.company,
        Branch: t.branch,
        Floor: t.floor,
        Area: t.area?.join(","),
        "Approved Seats": t.seats,
        Designation: t.designation,
        Education: t.education?.join(","),
        Language: t.language?.join(","),
        Skil: t.skill?.join(","),
        Experience: t.fromexperience + "-" + t.toexperience + " " + "year(s)",
        Salary: "₹" + t.fromsalary + "-" + "₹" + t.tosalary + " " + "month(s)",
        Status: "On Progress",
      }));
      setQueueData(data);
  };

  useEffect(() => {
    getexcelDatas();
  }, [filteredData]);

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "MyRequest_Vacancy_Posting",
    pageStyle: "print",
  });

  return (
    <>
      <Box style={{ padding: "20px" }}>
        <br />
        {isUserRoleCompare?.includes("lvacancyposting") && (
          <>
            {/* <Box sx={userStyle.container}> */}
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                <b>My Request</b>
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
                    <MenuItem value={myrequest?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes("excelvacancyposting") && (
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
                  {isUserRoleCompare?.includes("csvvacancyposting") && (
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
                  {isUserRoleCompare?.includes("printvacancyposting") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfvacancyposting") && (
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
                  {isUserRoleCompare?.includes("imagevacancyposting") && (
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
            {/* <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button>&ensp;
                        <Button variant="contained" color="error" onClick={handleClickOpenalert} >Bulk Delete</Button> */}

            <br />
            <br />
            {!queueCheck ? (
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
                  <TableContainer component={Paper}>
                    <Table
                      sx={{ minWidth: 700 }}
                      aria-label="customized table"
                      ref={gridRef}
                      id="excelcanvastable"
                    >
                      <TableHead sx={{ fontWeight: "600" }}>
                        <StyledTableRow>
                          <StyledTableCell
                            onClick={() => handleSorting("serialNumber")}
                          >
                            <Box sx={userStyle.tableheadstyle}>
                              <Box>SNo</Box>
                              <Box sx={{ marginTop: "-6PX" }}>
                                {renderSortingIcon("serialNumber")}
                              </Box>
                            </Box>
                          </StyledTableCell>
                          <StyledTableCell
                            onClick={() => handleSorting("company")}
                          >
                            <Box sx={userStyle.tableheadstyle}>
                              <Box>Company</Box>
                              <Box sx={{ marginTop: "-6PX" }}>
                                {renderSortingIcon("company")}
                              </Box>
                            </Box>
                          </StyledTableCell>
                          <StyledTableCell
                            onClick={() => handleSorting("branch")}
                          >
                            <Box sx={userStyle.tableheadstyle}>
                              <Box>Branch</Box>
                              <Box sx={{ marginTop: "-6PX" }}>
                                {renderSortingIcon("branch")}
                              </Box>
                            </Box>
                          </StyledTableCell>
                          <StyledTableCell
                            onClick={() => handleSorting("floor")}
                          >
                            <Box sx={userStyle.tableheadstyle}>
                              <Box>Floor</Box>
                              <Box sx={{ marginTop: "-6PX" }}>
                                {renderSortingIcon("floor")}
                              </Box>
                            </Box>
                          </StyledTableCell>
                          <StyledTableCell
                            onClick={() => handleSorting("area")}
                          >
                            <Box sx={userStyle.tableheadstyle}>
                              <Box>Area</Box>
                              <Box sx={{ marginTop: "-6PX" }}>
                                {renderSortingIcon("area")}
                              </Box>
                            </Box>
                          </StyledTableCell>
                          <StyledTableCell
                            onClick={() => handleSorting("seats")}
                          >
                            <Box sx={userStyle.tableheadstyle}>
                              <Box>Approved Seats</Box>
                              <Box sx={{ marginTop: "-6PX" }}>
                                {renderSortingIcon("seats")}
                              </Box>
                            </Box>
                          </StyledTableCell>
                          <StyledTableCell
                            onClick={() => handleSorting("designation")}
                          >
                            <Box sx={userStyle.tableheadstyle}>
                              <Box>Designation</Box>
                              <Box sx={{ marginTop: "-6PX" }}>
                                {renderSortingIcon("designation")}
                              </Box>
                            </Box>
                          </StyledTableCell>
                          <StyledTableCell
                            onClick={() => handleSorting("education")}
                          >
                            <Box sx={userStyle.tableheadstyle}>
                              <Box>Education</Box>
                              <Box sx={{ marginTop: "-6PX" }}>
                                {renderSortingIcon("education")}
                              </Box>
                            </Box>
                          </StyledTableCell>
                          <StyledTableCell
                            onClick={() => handleSorting("language")}
                          >
                            <Box sx={userStyle.tableheadstyle}>
                              <Box>Language</Box>
                              <Box sx={{ marginTop: "-6PX" }}>
                                {renderSortingIcon("language")}
                              </Box>
                            </Box>
                          </StyledTableCell>
                          <StyledTableCell
                            onClick={() => handleSorting("skill")}
                          >
                            <Box sx={userStyle.tableheadstyle}>
                              <Box>Skill</Box>
                              <Box sx={{ marginTop: "-6PX" }}>
                                {renderSortingIcon("skill")}
                              </Box>
                            </Box>
                          </StyledTableCell>
                          <StyledTableCell
                            onClick={() => handleSorting("status")}
                          >
                            <Box sx={userStyle.tableheadstyle}>
                              <Box>Status</Box>
                              <Box sx={{ marginTop: "-6PX" }}>
                                {renderSortingIcon("status")}
                              </Box>
                            </Box>
                          </StyledTableCell>
                          <StyledTableCell>Action</StyledTableCell>
                        </StyledTableRow>
                      </TableHead>
                      <TableBody align="left">
                        {filteredData?.length > 0 ? (
                          filteredData?.map((row, index) => (
                            <StyledTableRow key={index}>
                              <StyledTableCell>
                                {row.serialNumber}
                              </StyledTableCell>
                              <StyledTableCell>{row.company}</StyledTableCell>
                              <StyledTableCell>{row.branch}</StyledTableCell>
                              <StyledTableCell>{row.floor}</StyledTableCell>
                              <StyledTableCell>
                                {row?.area?.join(", ")}
                              </StyledTableCell>
                              <StyledTableCell>{row.seats}</StyledTableCell>
                              <StyledTableCell>
                                {row.designation}
                              </StyledTableCell>
                              <StyledTableCell>
                                {row?.education?.join(", ")}
                              </StyledTableCell>
                              <StyledTableCell>
                                {row?.language?.join(", ")}
                              </StyledTableCell>
                              <StyledTableCell>
                                {row?.skill?.join(", ")}
                              </StyledTableCell>
                              <StyledTableCell>{"On Progress"}</StyledTableCell>
                              <StyledTableCell
                                component="th"
                                scope="row"
                                colSpan={1}
                              >
                                <Grid sx={{ display: "flex" }}>
                                  {isUserRoleCompare?.includes(
                                    "evacancyposting"
                                  ) && (
                                    <Button
                                      sx={userStyle.buttonedit}
                                      onClick={() => {
                                        getCode(row._id);
                                        getunitvaluesCate(row);
                                      }}
                                    >
                                      <EditOutlinedIcon
                                        style={{ fontsize: "large" }}
                                      />
                                    </Button>
                                  )}
                                  {isUserRoleCompare?.includes(
                                    "dvacancyposting"
                                  ) && (
                                    <Button
                                      sx={userStyle.buttondelete}
                                      onClick={(e) => {
                                        rowData(row._id, row.name);
                                      }}
                                    >
                                      <DeleteOutlineOutlinedIcon
                                        style={{ fontsize: "large" }}
                                      />
                                    </Button>
                                  )}
                                  {isUserRoleCompare?.includes(
                                    "dvacancyposting"
                                  ) && (
                                    <Button
                                      sx={userStyle.buttonedit}
                                      onClick={() => {
                                        getviewCode(row._id);
                                      }}
                                    >
                                      <VisibilityOutlinedIcon
                                        style={{ fontsize: "large" }}
                                      />
                                    </Button>
                                  )}
                                  {isUserRoleCompare?.includes(
                                    "ivacancyposting"
                                  ) && (
                                    <Button
                                      sx={userStyle.buttonedit}
                                      onClick={() => {
                                        handleClickOpeninfo();
                                        getinfoCode(row._id);
                                      }}
                                    >
                                      <InfoOutlinedIcon
                                        style={{ fontsize: "large" }}
                                      />
                                    </Button>
                                  )}
                                </Grid>
                              </StyledTableCell>
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
            {/* </Box> */}
          </>
        )}
        {/* Edit Alert */}
        <Box>
          {/* Edit DIALOG */}
          <Dialog
            open={isEditOpen}
            onClose={handleCloseModEdit}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="md"
            sx={{
              overflow: "visible",
              "& .MuiPaper-root": {
                overflow: "visible",
              },
            }}
          >
            <Box sx={userStyle.dialogbox}>
              <>
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={12}>
                    <Typography sx={userStyle.HeaderText}>
                      Edit Approve Vacancies{" "}
                    </Typography>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={4} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>Company</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={approveedit.company}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>Branch</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={approveedit.branch}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>Floor</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={approveedit.floor}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>Area</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={approveedit?.area?.join(", ")}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>Approved Seats </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        value={approveedit.seats}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>Designation </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={approveedit.designation}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <Typography>
                      Category <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <FormControl fullWidth size="small">
                      <MultiSelect
                        className="custom-multi-select"
                        id="component-outlined"
                        options={categorysEdit}
                        value={selectedOptionsCateEdit}
                        onChange={(e) => {
                          handleCategoryChangeEdit(e);
                          setSelectedOptionsSubCateEdit([]);
                          setSelectedOptionsEduEdit([]);
                          setEducationEditOpt([]);
                        }}
                        valueRenderer={customValueRendererCateEdit}
                        labelledBy="Please Select Category"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={12} xs={12} sx={{ display: "flex" }}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Sub Category <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={subcategorysEdit}
                        value={selectedOptionsSubCateEdit}
                        onChange={(e) => {
                          handleSubCategoryChangeEdit(e);
                          setSelectedOptionsEduEdit([]);
                          fetchEducationEdit(
                            valueCateEdit,
                            e.map((item) => item.label)
                          );
                        }}
                        valueRenderer={customValueRendererSubCateEdit}
                        labelledBy="Please Select Subcategory"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={6}>
                    <Typography>
                      Education<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <FormControl fullWidth size="small">
                      <MultiSelect
                        options={educationEditOpt}
                        value={selectedOptionsEduEdit}
                        onChange={(e) => {
                          handleEducationChangeEdit(e);
                        }}
                        valueRenderer={customValueRendererEduEdit}
                        labelledBy="Please Select Education"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Skill<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={skill}
                        value={selectedOptionsSkill}
                        onChange={handleSkillChange}
                        valueRenderer={customValueRendererSkill}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Language<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={language}
                        value={selectedOptionsLan}
                        onChange={handleLanguageChange}
                        valueRenderer={customValueRendererLan}
                      />
                    </FormControl>
                  </Grid>

                  <Grid md={4} xs={11.5} sm={5.7}>
                    <FormControl
                      fullWidth
                      size="small"
                      sx={{ marginTop: "15px", marginLeft: "15px" }}
                    >
                      <Typography>
                        Exp.From-To (yrs) <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Grid sx={{ display: "flex" }}>
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          value={approveedit.fromexperience}
                          onChange={(e) => {
                            setApproveEdit({
                              ...approveedit,
                              fromexperience: e.target.value,
                            });
                          }}
                        />
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          value={approveedit.toexperience}
                          onChange={(e) => {
                            setApproveEdit({
                              ...approveedit,
                              toexperience: e.target.value,
                            });
                          }}
                        />
                      </Grid>
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Salary.From-To (per month)
                        <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Grid sx={{ display: "flex" }}>
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          sx={userStyle.input}
                          value={approveedit.fromsalary}
                          onChange={(e) => {
                            setApproveEdit({
                              ...approveedit,
                              fromsalary: e.target.value,
                            });
                          }}
                        />
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          sx={userStyle.input}
                          value={approveedit.tosalary}
                          onChange={(e) => {
                            setApproveEdit({
                              ...approveedit,
                              tosalary: e.target.value,
                            });
                          }}
                        />
                      </Grid>
                    </FormControl>
                  </Grid>
                </Grid>
              </>
              <br />
              <br />
              <Grid
                container
                spacing={2}
                sx={{
                  paddingLeft: "40px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Grid item md={6} xs={12} sm={6}>
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
                <Grid item md={6} xs={12} sm={6}>
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
                    onClick={handleCloseModEdit}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Dialog>
          {/* view model */}
          <Dialog
            open={openview}
            onClose={handleCloseview}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="lg"
          >
            <Box sx={{ padding: "20px 50px", height: "550px" }}>
              <>
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={12}>
                    <Typography sx={userStyle.HeaderText}>
                      View Approve Vacancies{" "}
                    </Typography>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={4} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Company</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={approveedit.company}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Branch</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={approveedit.branch}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Floor</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={approveedit.floor}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Area</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={approveedit?.area?.join(", ")}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Approved Seats</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={approveedit.seats}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Designation</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={approveedit.designation}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Language</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={approveedit.language?.join(",")}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Exp.From-To (yrs) </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={
                          approveedit.fromexperience +
                          "-" +
                          approveedit.toexperience +
                          "year(s)"
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">
                        {" "}
                        Salary.From-To (per month){" "}
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={
                          "₹" +
                          approveedit.fromsalary +
                          "-" +
                          "₹" +
                          approveedit.tosalary +
                          " " +
                          "month(s)"
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Education</Typography>
                      <TextareaAutosize
                        aria-label="minimum height"
                        minRows={2.5}
                        value={approveedit.education?.join(",")}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Skill</Typography>
                      <TextareaAutosize
                        aria-label="minimum height"
                        minRows={2.5}
                        value={approveedit.skill?.join(",")}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </>
              <Grid
                container
                spacing={2}
                sx={{
                  marginTop: "20px",
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCloseview}
                >
                  {" "}
                  Back{" "}
                </Button>
              </Grid>
              <br />
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
                  <TableCell>Company</TableCell>
                  <TableCell>Branch</TableCell>
                  <TableCell>Floor</TableCell>
                  <TableCell>Area</TableCell>
                  <TableCell>Approved Seats</TableCell>
                  <TableCell>Designation</TableCell>
                  <TableCell>Education</TableCell>
                  <TableCell>Language</TableCell>
                  <TableCell>Skill</TableCell>
                  <TableCell>Experience</TableCell>
                  <TableCell>Salary</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody align="left">
                {filteredData &&
                  filteredData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.company}</TableCell>
                      <TableCell>{row.branch}</TableCell>
                      <TableCell>{row.floor}</TableCell>
                      <TableCell>{row.area}</TableCell>
                      <TableCell>{row.seats}</TableCell>
                      <TableCell>{row.designation}</TableCell>
                      <TableCell>{row.education}</TableCell>
                      <TableCell>{row.language}</TableCell>
                      <TableCell>{row.skill}</TableCell>
                      <TableCell>{row.fromexperience}</TableCell>
                      <TableCell>{row.fromsalary}</TableCell>
                      <TableCell>{"On Progrss"}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box>
            <Dialog
              open={isDeleteOpencheckbox}
              onClose={handleCloseModcheckbox}
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
                <Button
                  onClick={handleCloseModcheckbox}
                  sx={userStyle.btncancel}
                >
                  Cancel
                </Button>
                <Button
                  autoFocus
                  variant="contained"
                  color="error"
                  onClick={(e) => delMyrequestcheckbox(e)}
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
                sx={{
                  width: "350px",
                  textAlign: "center",
                  alignItems: "center",
                }}
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
              <Typography
                variant="h5"
                sx={{ color: "red", textAlign: "center" }}
              >
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
                onClick={(e) => deleQueue(queueid)}
              >
                {" "}
                OK{" "}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Info start */}
          <Dialog
            open={openInfo}
            onClose={handleCloseinfo}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <Box sx={{ width: "550px", padding: "20px 50px" }}>
              <>
                <Typography sx={userStyle.HeaderText}>
                  Approved Vacancies Info
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
    </>
  );
}

export default Myrequest;
