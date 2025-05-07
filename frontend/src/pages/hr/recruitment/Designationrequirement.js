import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
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
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../../components/Errorhandling";
import Headtitle from "../../../components/Headtitle";
import PageHeading from "../../../components/PageHeading";
import {
  AuthContext,
  UserRoleAccessContext,
} from "../../../context/Appcontext";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
import domtoimage from 'dom-to-image';
import { FaFileCsv, FaFileExcel } from "react-icons/fa";

import AlertDialog from "../../../components/Alert";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../../components/DeleteConfirmation.js";
import ExportData from "../../../components/ExportData";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert";

import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";

function Designationrequirement() {
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setSubmitLoader(false);
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
    "Designation",
    "Department",
    "Category",
    "Subcategory",
    "Specialization",
    "Language",
    "Skill",
    "Experience",
    "Salary",
    "Notice Period",
    "Reconsideraion Days",
  ];
  let exportRowValues = [
    "designation",
    "department",
    "category",
    "subcategory",
    "education",
    "language",
    "skill",
    "experience",
    "salary",
    "noticeperiodestimation",
    "dayscount",
  ];

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

  const [deleteproject, setDeleteproject] = useState({});
  const [designationOpt, setDesignationOpt] = useState([]);
  const [departmentOpt, setDepartmentOpt] = useState([]);
  const [submitLoader, setSubmitLoader] = useState(false);

  const [checked, setChecked] = useState(false);
  const [daysCount, setDaysCount] = useState("");

  const handleChangeCheckBox = (event) => {
    setChecked(event.target.checked);
    setDaysCount("");
  };

  const [checkedEdit, setCheckedEdit] = useState(false);
  const [daysCountEdit, setDaysCountEdit] = useState("");

  const handleChangeCheckBoxEdit = (event) => {
    setCheckedEdit(event.target.checked);
    setDaysCountEdit("");
  };

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
      pagename: String("Designation Requirement"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),

      addedby: [
        {
          name: String(isUserRoleAccess?.companyname),
          date: String(new Date()),
        },
      ],
    });
  };

  const [language, setLanguage] = useState([
    { label: "Tamil", value: "Tamil" },
    { label: "English", value: "English" },
  ]);

  const [selectedRows, setSelectedRows] = useState([]);
  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [statusCheck, setStatusCheck] = useState(false);
  const [designationReq, setDesignationReq] = useState({
    department: "Please Select Department",
    designation: "Please Select Designation",
    education: "",
    language: "Please Select Language",
    skill: "Please Select Skill",
    experiencefrom: "",
    experienceto: "",
    salaryfrom: "",
    salaryto: "",
    noticeperiodfrom: "Month",
    noticeperiodto: "",
    rolesandres: "",
    categoryname: "",
    subcategoryname: "",
  });

  const [designationEditReq, setDesignationEditReq] = useState({
    department: "",
    designation: "",
    education: "",
    language: "",
    skill: "",
    experiencefrom: "",
    experienceto: "",
    salaryfrom: "",
    salaryto: "",
    noticeperiodfrom: "",
    noticeperiodto: "",
    rolesandres: "",
    categoryname: "",
    subcategoryname: "",
  });

  const [allSettings, setAllsettings] = useState({});
  const [allDesignationReq, setAllDesignationReq] = useState([]);
  const [allDesignationReqEdit, setAllDesignationReqEdit] = useState([]);
  const [designationReqView, setDesignationReqView] = useState([]);

  const [jobrequire, setJobRequire] = useState("<ul><li></li></ul>");
  const handleChangeJobRequire = (value) => {
    setJobRequire(value);
  };

  const handleChangeJobRequireEdit = (value) => {
    setDesignationEditReq({ ...designationEditReq, jobrequirements: value });
  };

  const [textSumm, setTextSummary] = useState("");
  const handleChangeSummary = (value) => {
    setTextSummary(value);
  };

  const handleChangeSummaryEdit = (value) => {
    setDesignationEditReq({ ...designationEditReq, jobdescription: value });
  };

  const [jobBenefits, setJobBenefits] = useState("");
  const handleChangeJobBenefits = (value) => {
    setJobBenefits(value);
  };

  const handleChangeJobBenefitsEdit = (value) => {
    setDesignationEditReq({ ...designationEditReq, jobbenefits: value });
  };

  // This line muliti select Langugae
  const [selectedOptionsLan, setSelectedOptionslan] = useState([]);
  let [valueLan, setValueLan] = useState("");

  const handleLanguageChange = (options) => {
    setValueLan(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionslan(options);
  };

  const customValueRendererLan = (valueLan, _locations) => {
    return valueLan.length
      ? valueLan.map(({ label }) => label).join(", ")
      : "Please Select Location";
  };

  //Edit multi select Language
  const [selectedOptionsLanEdit, setSelectedOptionsLanEdit] = useState([]);

  const handleLanChangeEdit = (options) => {
    setValueEduEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsLanEdit(options);
  };

  const customValueRendererLanEdit = (valueLanEdit, _languages) => {
    return valueLanEdit.length
      ? valueLanEdit.map(({ label }) => label).join(", ")
      : "Please Select Language";
  };

  // This line muliti select Skill
  const [selectedOptionsSkill, setSelectedOptionsSkill] = useState([]);
  let [valueSkill, setValueSkill] = useState("");

  const handleSkillChange = (options) => {
    setValueSkill(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsSkill(options);
  };

  const customValueRendererSkill = (valueSkill, _skills) => {
    return valueSkill.length
      ? valueSkill.map(({ label }) => label).join(", ")
      : "Please Select Skill";
  };

  //Edit multi select Skill
  const [selectedOptionsSkillEdit, setSelectedOptionsSkillEdit] = useState([]);
  let [valueSkillEdit, setValueSkillEdit] = useState("");

  const handleSkillChangeEdit = (options) => {
    setValueSkillEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsSkillEdit(options);
  };

  const customValueRendererSkillEdit = (valueSkillEdit, _skills) => {
    return valueSkillEdit.length
      ? valueSkillEdit.map(({ label }) => label).join(", ")
      : "Please Select Skill";
  };

  // Education cateegory, subcategory, specialization

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

  const customValueRendererCate = (valueCate, _categorys) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Category";
  };

  // Edit functionlity
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

  // multi select sub category

  // Subcategroy multi select
  const [selectedOptionsSubCate, setSelectedOptionsSubCate] = useState([]);
  let [valueSubCate, setValueSubCate] = useState("");

  const handleSubCategoryChange = (options) => {
    setValueSubCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsSubCate(options);
  };

  const customValueRendererSubCate = (valueSubCate, _subcategorys) => {
    return valueSubCate.length
      ? valueSubCate.map(({ label }) => label).join(", ")
      : "Please Select Subcategory";
  };

  // Edit functionlity
  const [selectedOptionsSubCateEdit, setSelectedOptionsSubCateEdit] = useState(
    []
  );

  const handleSubCategoryChangeEdit = (options) => {
    // setValueSubCateEdit(options.map((a, index) => {
    //     return a.value
    // }))
    setSelectedOptionsSubCateEdit(options);
  };

  const customValueRendererSubCateEdit = (valueSubCateEdit, _subcategorys) => {
    return valueSubCateEdit.length
      ? valueSubCateEdit.map(({ label }) => label).join(", ")
      : "Please Select Subcategory";
  };

  // Specialization
  // This line muliti select Education
  const [selectedOptionsEdu, setSelectedOptionsEdu] = useState([]);
  let [valueEdu, setValueEdu] = useState("");

  const handleEducationChange = (options) => {
    setValueEdu(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsEdu(options);
  };

  const customValueRendererEdu = (valueEdu, _educations) => {
    return valueEdu.length
      ? valueEdu.map(({ label }) => label).join(", ")
      : "Please Select Specialization";
  };

  //Edit multi select Education
  const [selectedOptionsEduEdit, setSelectedOptionsEduEdit] = useState([]);
  let [valueEduEdit, setValueEduEdit] = useState("");

  const handleEducationChangeEdit = (options) => {
    setValueEduEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsEduEdit(options);
    // fetchEducationEdit(options.map(item => item.value));
  };

  const customValueRendererEduEdit = (valueEduEdit, _educations) => {
    return valueEduEdit.length
      ? valueEduEdit.map(({ label }) => label).join(", ")
      : "Please Select Specialization";
  };

  const [categorys, setCategorys] = useState([]);
  const [subcategorys, setSubcategorys] = useState([]);
  const [jobDesignation, setJobDesignation] = useState([]);

  const [categorysEdit, setCategorysEdit] = useState([]);
  const [subcategorysEdit, setSubcategorysEdit] = useState([]);

  const fetchCategoryEducation = async () => {
    setPageName(!pageName);
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

      setCategorys(
        filter_opt.map((data) => ({
          ...data,
          label: data,
          value: data,
        }))
      );

      setCategorysEdit(
        filter_opt.map((data) => ({
          ...data,
          label: data,
          value: data,
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

  const fetchCategoryBased = async (e) => {
    let employ = e.map((item) => item.value);

    setPageName(!pageName);
    try {
      let res_category = await axios.get(SERVICE.CATEGORYEDUCATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let data_set = res_category.data.educationcategory
        .filter((data) => {
          return employ.includes(data.categoryname);
        })
        .map((value) => value.subcategoryname);

      let ans = [].concat(...data_set);

      let filter_opt = [...new Set(ans)];

      setSubcategorys(
        filter_opt.map((data) => ({
          ...data,
          label: data,
          value: data,
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

  const fetchCategoryBasedEdit = async (e) => {
    setPageName(!pageName);
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
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const fetchEducation = async (e) => {
    let employ = e.map((item) => item.value);

    setPageName(!pageName);
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
            employ.some((item) => data.subcategory.includes(item))
          );
        })
        .map((value) => value.specilizationgrp);

      let ans = [].concat(...data_set);

      let filter_opt = [...new Set(ans)];

      setEducationsOpt(
        filter_opt.map((data) => ({
          ...data,
          label: data.label,
          value: data.label,
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

  const fetchEducationEdit = async (valueCate, e) => {
    setPageName(!pageName);
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
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const [roleAndResTextArea, setRoleAndResTextArea] =
    useState("<ul><li></li></ul>");
  const handleRoleAndResponse = (value) => {
    setRoleAndResTextArea(value);
  };
  const handleRoleAndResponseEdit = (value) => {
    setDesignationEditReq({ ...designationEditReq, rolesandres: value });
  };

  // view model
  const [openview, setOpenview] = useState(false);
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
  };

  const {
    isUserRoleCompare,
    isUserRoleAccess,
    pageName,
    setPageName,
    buttonStyles,
  } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // State for manage columns search query
  const [searchQueryManage, setSearchQueryManage] = useState("");

  const [educationsOpt, setEducationsOpt] = useState([]);
  const [allDesignationEditOpt, setAllDesignationEditOpt] = useState([]);

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

  const handleClickOpenalert = () => {
    setIsHandleChange(true);
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      setIsDeleteOpencheckbox(true);
    }
  };
  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };

  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  };

  const delListofDoccheckbox = async () => {
    setPageName(!pageName);
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(
          `${SERVICE.DESIGNATIONREQUUIREMENTS_SINGLE}/${item}`,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          }
        );
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
      setIsHandleChange(false);
      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);

      await fetchRoleAndRes();

      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setFilteredChanges(null)
      setFilteredRowData([])
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const fetchDesignations = async () => {
    setPageName(!pageName);
    try {
      const [res, resdpt] = await Promise.all([
        axios.get(SERVICE.DESIGNATION, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.get(SERVICE.DEPARTMENTGROUPINGS, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
      ]);

      setDesignationOpt(
        res?.data?.designation
          ?.map((t) => ({
            ...t,
            label: t.name,
            value: t.name,
          }))
          .filter(
            (value, index, self) =>
              index === self.findIndex((t) => t.value === value.value)
          )
      );
      setDepartmentOpt(
        resdpt?.data?.departmentgrouping?.map((d) => ({
          ...d,
          label: d.departmentname,
          value: d.departmentname,
        }))
      );
      setAllDesignationEditOpt(
        res?.data?.designation?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
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

  const convertToNumberedList = (htmlContent) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = htmlContent;

    const listItems = Array.from(tempElement.querySelectorAll("li"));
    listItems.forEach((li, index) => {
      li.innerHTML = `\u2022 ${li.innerHTML}\n`;
    });

    return tempElement.innerText;
  };

  const [educationEditOpt, setEducationEditOpt] = useState([]);

  const [skillOptions, setSkilloptions] = useState([]);
  const [skillOptionEdit, setSkillptionEdit] = useState([]);
  const fetchAllSkill = async () => {
    setPageName(!pageName);
    try {
      let res_queue = await axios.get(SERVICE.SKILLSET, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSkilloptions(
        res_queue?.data?.skillsets?.map((t) => ({
          ...t,
          label: t.name,
          value: t.name,
        }))
      );
      setSkillptionEdit(
        res_queue?.data?.skillsets?.map((t) => ({
          ...t,
          label: t.name,
          value: t.name,
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

  useEffect(() => {
    fetchAllSkill();
  }, []);

  //set function to get particular row
  const rowData = async (id) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(
        `${SERVICE.DESIGNATIONREQUUIREMENTS_SINGLE}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      setDeleteproject(res?.data?.sdesiggroupreq);
      handleClickOpen();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  // Alert delete popup
  let projectid = deleteproject._id;
  const delProject = async () => {
    setPageName(!pageName);
    try {
      await axios.delete(
        `${SERVICE.DESIGNATIONREQUUIREMENTS_SINGLE}/${projectid}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      await fetchRoleAndRes();
      handleCloseMod();
      setPage(1);

      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setFilteredChanges(null)
      setFilteredRowData([])
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const gridRef = useRef(null);

  // Error Popup model
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showAlertpop, setShowAlertpop] = useState();

  const handleCloseerrpop = () => {
    setIsErrorOpenpop(false);
  };

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
    setSubmitLoader(false);
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

  const dataGridStyles = {
    root: {
      "& .MuiDataGrid-row": {
        height: "15px",
      },
    },
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    checkbox: true,
    serialNumber: true,
    designation: true,
    department: true,
    category: true,
    subcategory: true,
    education: true,
    language: true,
    skill: true,
    salary: true,
    noticeperiod: true,
    experience: true,
    dayscount: true,
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

  const handleClear = (e) => {
    setDesignationReq({
      department: "Please Select Department",
      designation: "Please Select Designation",
      // education: "Please Select Specialization",
      education: "",
      language: "Please Select Language",
      skill: "Please Select Skill",
      experiencefrom: "",
      experienceto: "",
      salaryfrom: "",
      salaryto: "",
      noticeperiodfrom: "Month",
      noticeperiodto: "",
      // rolesandres: ""
    });
    setChecked(false);
    setDaysCount("");
    setJobBenefits(allSettings.jobbenefits);
    setRoleAndResTextArea(allSettings.rolesandres);
    setJobRequire(allSettings.jobrequirementsAdd);
    setSubcategorys([]);
    setEducationsOpt([]);
    setValueSubCate([]);
    setValueEdu([]);
    setSelectedOptionsEdu([]);
    setSelectedOptionsCate([]);
    setSelectedOptionsSubCate([]);
    setSelectedOptionslan([]);
    setSelectedOptionsSkill([]);

    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };
  const [roleName, setRoleName] = useState({});
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(
        `${SERVICE.DESIGNATIONREQUUIREMENTS_SINGLE}/${e}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      setRoleName(res?.data?.sdesiggroupreq);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

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

      sortable: false, // Optionally, you can make this column not sortable
      width: 90,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
      pinned: "left",
      //lockPinned: true,
    },

    {
      field: "serialNumber",
      headerName: "S.No",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.serialNumber,
      pinned: "left",
      //lockPinned: true,
    },
    {
      field: "designation",
      headerName: "Designation",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.designation,
      pinned: "left",
    },
    {
      field: "department",
      headerName: "Department",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.department,
      pinned: "left",
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
      headerName: "Subcategory",
      flex: 0,
      width: 250,
      hide: !columnVisibility.subcategory,
      headerClassName: "bold-header",
    },
    {
      field: "education",
      headerName: "Specialization",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.education,
    },
    {
      field: "language",
      headerName: "Language",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.language,
    },
    {
      field: "skill",
      headerName: "Skill",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.skill,
    },
    {
      field: "experience",
      headerName: "Experience",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.experience,
    },
    {
      field: "salary",
      headerName: "Salary",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.salary,
    },
    {
      field: "noticeperiod",
      headerName: "Noticeperiod",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.noticeperiod,
    },
    {
      field: "dayscount",
      headerName: "Reconsideraion Days",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.dayscount,
    },
    // { field: "rolesandres", headerName: "RolesAndResponcibilities", flex: 0, width: 300, minHeight: '40px', hide: !columnVisibility.rolesandres },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 300,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      //lockPinned: true,
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("edesignationrequirements") && (
            // {/* <Link to={`/designationrequirement/edit/${params.data.id}`}> */}
            <Button sx={userStyle.buttonedit}>
              <EditOutlinedIcon
                sx={buttonStyles.buttonedit}
                onClick={() => {
                  getCodeEdit(params.data.id);
                }}
              />
            </Button>
          )}
          {isUserRoleCompare?.includes("ddesignationrequirements") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vdesignationrequirements") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCodeView(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("idesignationrequirements") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getinfoCode(params.data.id);
              }}
            >
              <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />
            </Button>
          )}
        </Grid>
      ),
    },
  ];
  // Function to filter columns based on search query
  const filteredColumns = columnDataTable.filter((column) =>
    column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
  );

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

  let updateby = roleName.updatedby;
  let addedby = roleName.addedby;

  // pdf.....

  const fileName = "DesignationRequirement";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "DesignationRequirement",
    pageStyle: "print",
  });

  useEffect(() => {
    fetchDesignations();
    fetchCategoryEducation();
  }, []);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [items, setItems] = useState([]);

  const addSerialNumber = (datas) => {

    setItems(datas);
  };

  useEffect(() => {
    addSerialNumber(allDesignationReq);
  }, [allDesignationReq]);

  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTable = useRef(null);

  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSelectedRows([]);
    setSelectAllChecked(false);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setPage(1);
    setSelectedRows([]);
    setSelectAllChecked(false);
  };

  //datatable....
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };
  // Split the search query into individual terms
  const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchOverTerms.every((term) =>
      Object.values(item)?.join(" ")?.toLowerCase()?.includes(term)
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

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  // Create a row data object for the DataGrid
  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item.id,
      serialNumber: item.serialNumber,
      designation: item.designation,
      department: item.department,
      category: item.category,
      subcategory: item.subcategory,
      education: item.education,
      language: item.language,
      skill: item.skill,
      experience: item.experience,
      salary: item.salary,
      noticeperiod: item.noticeperiod,
      rolesandres: item.rolesandres,
      jobdescription: item.jobdescription,
      jobdetails: item.jobdetails,
      jobbenefits: item.jobbenefits,
      dayscount: item.dayscount,
      noticeperiodestimation: item.noticeperiodestimation,
    };
  });

  //image

  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Designation Requirements.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
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

  const handleShowAllColumns = () => {
    setColumnVisibility(initialColumnVisibility);
  };

  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  const fetchRoleAndRes = async () => {
    setPageName(!pageName);
    try {
      let res_project = await axios.get(SERVICE.DESIGNATIONREQUIREMENTS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const itemsWithSerialNumber = res_project?.data?.designationreq?.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
        id: item._id,
        experience: `${item.experiencefrom}  -  ${item.experienceto}`,
        salary: `${item.salaryfrom} -  ${item.salaryto}`,
        noticeperiod: `${item.noticeperiodto} - ${item.noticeperiodfrom}`,
        noticeperiodestimation: `${item.noticeperiodto} - ${item.noticeperiodfrom}s`,
        category: item.category.join(",").toString(),
        subcategory: item.subcategory.join(",").toString(),
        education: item.education.join(",").toString(),
        language: item.language.join(","),
        skill: item.skill.join(","),
        rolesandres: convertToNumberedList(item.rolesandres),
        jobdescription: convertToNumberedList(item.jobdescription),
        jobdetails: convertToNumberedList(item.jobdetails),
        jobbenefits: convertToNumberedList(item.jobbenefits),
      }));
      setAllDesignationReq(itemsWithSerialNumber);
      setStatusCheck(true);
    } catch (err) {
      setStatusCheck(true);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const fetchRoleAndResEdit = async () => {
    setPageName(!pageName);
    try {
      let res_project = await axios.get(SERVICE.DESIGNATIONREQUIREMENTS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setAllDesignationReqEdit(
        res_project?.data?.designationreq.filter(
          (item) => item._id !== designationEditReq._id
        )
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
  const username = isUserRoleAccess.username;

  useEffect(() => {
    fetchRoleAndRes();
  }, []);

  useEffect(() => {
    fetchRoleAndResEdit();
  }, [isEditOpen]);

  const sendRequest = async () => {
    setPageName(!pageName);
    try {
      await axios.post(SERVICE.DESIGNATIONREQ_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        designation: designationReq.designation,
        department: designationReq.department,
        education: [...valueEdu],
        category: [...valueCate],
        subcategory: [...valueSubCate],
        language: [...valueLan],
        skill: [...valueSkill],
        experiencefrom: designationReq.experiencefrom,
        experienceto: designationReq.experienceto,
        salaryfrom: designationReq.salaryfrom,
        salaryto: designationReq.salaryto,
        noticeperiodfrom: designationReq.noticeperiodfrom,
        noticeperiodto: designationReq.noticeperiodto,
        rolesandres: String(roleAndResTextArea),
        jobdescription: String(textSumm),
        jobrequirements: String(jobrequire),
        jobbenefits: String(jobBenefits),
        reconsiderationchecked: Boolean(checked),
        dayscount: daysCount,
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchRoleAndRes();
      setDesignationReq({
        ...designationReq,
        experiencefrom: "",
        experienceto: "",
        salaryfrom: "",
        salaryto: "",
        noticeperiodfrom: "Month",
        noticeperiodto: "",
      });
      setChecked(false);
      setDaysCount("");
      setTextSummary("");
      setJobBenefits(allSettings.jobbenefits);
      setRoleAndResTextArea(allSettings.rolesandres);
      setJobRequire(allSettings.jobrequirementsAdd);

      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setFilteredChanges(null)
      setFilteredRowData([]);
      setSubmitLoader(false);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  //submit option for saving
  const handleSubmit = (e) => {
    setSubmitLoader(true);
    e.preventDefault();
    const isNameMatch = allDesignationReq?.some(
      (item) =>
        item.designation?.toLowerCase() ===
        designationReq.designation?.toLowerCase()
    );
    if (
      designationReq.designation === "" ||
      designationReq.designation === "Please Select Designation"
    ) {
      setPopupContentMalert("Please Select Designation!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      designationReq.department === "" ||
      designationReq.department === "Please Select Department"
    ) {
      setPopupContentMalert("Please Select Department!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsLan.length === 0) {
      setPopupContentMalert("Please Select Language!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsSkill.length === 0) {
      setPopupContentMalert("Please Select Skill!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (checked && daysCount === "") {
      setPopupContentMalert("Please Enter Days!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsCate.length === 0) {
      setPopupContentMalert("Please Select Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsSubCate.length === 0) {
      setPopupContentMalert("Please Select  Subcategory!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsEdu.length === 0) {
      setPopupContentMalert("Please Select Specialization!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (designationReq.experiencefrom === "") {
      setPopupContentMalert("Please Enter Experience From!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (designationReq.experienceto === "") {
      setPopupContentMalert("Please Enter Experience To!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      designationReq.experiencefrom > designationReq.experienceto ||
      designationReq.experiencefrom === designationReq.experienceto
    ) {
      setPopupContentMalert(
        designationReq.experiencefrom === designationReq.experienceto
          ? "From Experience and To Experience cannot be Same"
          : "From Experience must be less than To Experience "
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (designationReq.salaryfrom === "") {
      setPopupContentMalert("Please Enter Salary From!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (designationReq.salaryto === "") {
      setPopupContentMalert("Please Enter Salary To!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      Number(designationReq.salaryfrom) > Number(designationReq.salaryto) ||
      Number(designationReq.salaryfrom) === Number(designationReq.salaryto)
    ) {
      setPopupContentMalert(
        Number(designationReq.salaryfrom) === Number(designationReq.salaryto)
          ? "From Salary and To Salary cannot be Same"
          : "From Salary must be less than To Salary"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (designationReq.noticeperiodto === "") {
      setPopupContentMalert(
        `Please Enter Notice period No.of ${designationReq.noticeperiodfrom}s`
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      roleAndResTextArea === "" ||
      roleAndResTextArea === "<ul><li><br></li></ul>" ||
      roleAndResTextArea === "<p><br></p>"
    ) {
      setPopupContentMalert("Please Enter Roles and Responsibilities!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Data Already Exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };

  //get single row to edit....
  const getCodeEdit = async (e, name) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(
        `${SERVICE.DESIGNATIONREQUUIREMENTS_SINGLE}/${e}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      let resdesignation = await axios.post(SERVICE.JOBOPENINGSDESIGNATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        designation: String(res?.data?.sdesiggroupreq?.designation),
      });

      setCheckedEdit(res?.data?.sdesiggroupreq?.reconsiderationchecked);
      setDaysCountEdit(res?.data?.sdesiggroupreq?.dayscount);
      setJobDesignation(resdesignation?.data?.designationjobs);
      setDesignationEditReq(res?.data?.sdesiggroupreq);
      setSelectedOptionsEduEdit(
        res?.data?.sdesiggroupreq.education.map((item) => ({
          ...item,
          label: item,
          value: item,
        }))
      );
      fetchCategoryBasedEdit(res?.data?.sdesiggroupreq.category);
      setValueCateEdit(res?.data?.sdesiggroupreq.category);
      fetchEducationEdit(
        res?.data?.sdesiggroupreq.category,
        res?.data?.sdesiggroupreq.subcategory
      );
      setSelectedOptionsCateEdit(
        res?.data?.sdesiggroupreq.category.map((item) => ({
          ...item,
          label: item,
          value: item,
        }))
      );
      setSelectedOptionsSubCateEdit(
        res?.data?.sdesiggroupreq.subcategory.map((item) => ({
          ...item,
          label: item,
          value: item,
        }))
      );
      setSelectedOptionsLanEdit(
        res?.data?.sdesiggroupreq.language.map((item) => ({
          ...item,
          label: item,
          value: item,
        }))
      );
      setSelectedOptionsSkillEdit(
        res?.data?.sdesiggroupreq.skill.map((item) => ({
          ...item,
          label: item,
          value: item,
        }))
      );
      fetchAllSkill();
      handleClickOpenEdit();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  //Project updatedby edit page...
  let updatedby = designationEditReq.updatedby;
  // let addedby = roleAndResEdit.addedby;
  let refsid = designationEditReq._id;

  //editing the single data...
  const sendEditRequest = async () => {
    let empedu = selectedOptionsEduEdit.map((item) => item.value);
    let empCate = selectedOptionsCateEdit.map((item) => item.value);
    let empSubcate = selectedOptionsSubCateEdit.map((item) => item.value);
    let emplan = selectedOptionsLanEdit.map((item) => item.value);
    let empskill = selectedOptionsSkillEdit.map((item) => item.value);
    setPageName(!pageName);
    try {
      let resjob =
        jobDesignation.length > 0
          ? sendJobopenings(empedu, emplan, empskill)
          : "";
      await axios.put(`${SERVICE.DESIGNATIONREQUUIREMENTS_SINGLE}/${refsid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        department: designationEditReq.department,
        designation: designationEditReq.designation,
        education: [...empedu],
        category: [...empCate],
        subcategory: [...empSubcate],
        language: [...emplan],
        skill: [...empskill],
        experiencefrom: designationEditReq.experiencefrom,
        experienceto: designationEditReq.experienceto,
        salaryfrom: designationEditReq.salaryfrom,
        salaryto: designationEditReq.salaryto,
        noticeperiodfrom: designationEditReq.noticeperiodfrom,
        noticeperiodto: designationEditReq.noticeperiodto,
        rolesandres: designationEditReq.rolesandres,
        jobdescription: designationEditReq.jobdescription,
        jobrequirements: designationEditReq.jobrequirements,
        jobbenefits: designationEditReq.jobbenefits,
        reconsiderationchecked: Boolean(checkedEdit),
        dayscount: daysCountEdit,
        updatedby: [
          ...updatedby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });

      await fetchRoleAndRes();
      handleCloseModEdit();

      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setFilteredChanges(null)
      setFilteredRowData([])
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const fetchOverAllSettings = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.GET_OVERALL_SETTINGS}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAllsettings(
        res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
      );
      setRoleAndResTextArea(
        res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
          ?.rolesandres
      );
      setJobBenefits(
        res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
          ?.jobrequirementsAdd
      );
      setJobRequire(
        res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
          ?.jobbenefits
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

  useEffect(() => {
    fetchOverAllSettings();
  }, []);

  const sendJobopenings = (empedu, emplan, empskill) => {
    let jobupdate = jobDesignation.map((data, index) => {
      let res =
        data.designation === designationEditReq.designation
          ? axios.put(`${SERVICE.JOBOPENING_SINGLE}/${data?._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            education: [...empedu],
            language: [...emplan],
            requiredskill: [...empskill],
            department: designationEditReq.department,
            experiencefrom: designationEditReq.experiencefrom,
            experienceto: designationEditReq.experienceto,
            fromsalary: designationEditReq.salaryfrom,
            tosalary: designationEditReq.salaryto,
            rolesresponse: designationEditReq.rolesandres,
            jobdescription: designationEditReq.jobdescription,
            jobrequirements: designationEditReq.jobrequirements,
            jobbenefits: designationEditReq.jobbenefits,
          })
          : "";
    });
  };

  const editSubmit = (e) => {
    e.preventDefault();
    const isNameMatch = allDesignationReqEdit?.some(
      (item) =>
        item.designation?.toLowerCase() ===
        designationEditReq.designation?.toLowerCase()
    );
    if (
      designationEditReq.designation === "" ||
      designationEditReq.designation === "Please Select Designation"
    ) {
      setPopupContentMalert("Please Select Designation!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      designationEditReq.department === "" ||
      designationEditReq.department === "Please Select Department"
    ) {
      setPopupContentMalert("Please Select Department!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsLanEdit.length === 0) {
      setPopupContentMalert("Please Select Language!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsSkillEdit.length === 0) {
      setPopupContentMalert("Please Select Skill!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (checkedEdit && daysCountEdit === "") {
      setPopupContentMalert("Please Enter Days!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsCateEdit.length === 0) {
      setPopupContentMalert("Please Select Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsSubCateEdit.length === 0) {
      setPopupContentMalert("Please Select  Subcategory!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsEduEdit.length === 0) {
      setPopupContentMalert("Please Select Specialization!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (designationEditReq.experiencefrom === "") {
      setPopupContentMalert("Please Enter Experience From!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (designationEditReq.experienceto === "") {
      setPopupContentMalert("Please Enter Experience To!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      designationEditReq.experiencefrom > designationEditReq.experienceto ||
      designationEditReq.experiencefrom === designationEditReq.experienceto
    ) {
      setPopupContentMalert(
        designationEditReq.experiencefrom === designationEditReq.experienceto
          ? "From Experience and To Experience cannot be Same"
          : "From Experience must be less than To Experience "
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (designationEditReq.salaryfrom === "") {
      setPopupContentMalert("Please Enter Salary From!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (designationEditReq.salaryto === "") {
      setPopupContentMalert("Please Enter Salary To!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      Number(designationEditReq.salaryfrom) >
      Number(designationEditReq.salaryto) ||
      Number(designationEditReq.salaryfrom) ===
      Number(designationEditReq.salaryto)
    ) {
      setPopupContentMalert(
        Number(designationEditReq.salaryfrom) ===
          Number(designationEditReq.salaryto)
          ? "From Salary and To Salary cannot be Same"
          : "From Salary must be less than To Salary"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (designationEditReq.noticeperiodto === "") {
      setPopupContentMalert(
        `Please Enter Notice period No.of ${designationEditReq.noticeperiodfrom}s`
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      designationEditReq.rolesandres === "" ||
      designationEditReq.rolesandres === "<p><br></p>" ||
      designationEditReq.rolesandres === "<ul><li><br></li></ul>"
    ) {
      setPopupContentMalert("Please Enter Roles and Responsibilities!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Data Already Exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendEditRequest();
    }
  };

  //get single row to View....
  const getCodeView = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(
        `${SERVICE.DESIGNATIONREQUUIREMENTS_SINGLE}/${e}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      setDesignationReqView(res?.data?.sdesiggroupreq);
      handleClickOpenview();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const handleChange = (e) => {
    const selectedText = e.target.value;
    setDesignationReq({ ...designationReq, noticeperiodfrom: selectedText });
  };
  const handleChangeEdit = (e) => {
    const selectedText = e.target.value;
    setDesignationEditReq({
      ...designationEditReq,
      noticeperiodfrom: selectedText,
    });
  };

  return (
    <Box>
      <Headtitle title={"Designation Requirement"} />
      {/* ****** Header Content ****** */}

      <PageHeading
        title="Designation Requirement"
        modulename="Human Resources"
        submodulename="Recruitment"
        mainpagename="Designation Requirements"
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("adesignationrequirements") && (
        <Box sx={userStyle.dialogbox}>
          <>
            <Grid container spacing={2} marginTop={2}>
              <Grid item md={4} sm={12} xs={12}>
                <Typography>
                  <b>
                    Designation <b style={{ color: "red" }}>*</b>
                  </b>
                </Typography>
                <FormControl fullWidth size="small">
                  <Selects
                    options={designationOpt}
                    value={{
                      label: designationReq.designation,
                      value: designationReq.designation,
                    }}
                    onChange={(e) => {
                      setDesignationReq({
                        ...designationReq,
                        designation: e.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} sm={12} xs={12}>
                <Typography>
                  <b>
                    Department <b style={{ color: "red" }}>*</b>
                  </b>
                </Typography>
                <FormControl fullWidth size="small">
                  <Selects
                    options={departmentOpt}
                    value={{
                      label: designationReq.department,
                      value: designationReq.department,
                    }}
                    onChange={(e) => {
                      setDesignationReq({
                        ...designationReq,
                        department: e.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <Typography>
                  {" "}
                  <b>
                    Language<b style={{ color: "red" }}>*</b>
                  </b>
                </Typography>
                <FormControl fullWidth size="small">
                  <MultiSelect
                    options={language}
                    value={selectedOptionsLan}
                    onChange={(e) => {
                      handleLanguageChange(e);
                    }}
                    valueRenderer={customValueRendererLan}
                    labelledBy="Please Select Language"
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <Typography>
                  {" "}
                  <b>
                    Skill<b style={{ color: "red" }}>*</b>
                  </b>
                </Typography>
                <FormControl fullWidth size="small">
                  <MultiSelect
                    options={skillOptions}
                    value={selectedOptionsSkill}
                    onChange={(e) => {
                      handleSkillChange(e);
                    }}
                    valueRenderer={customValueRendererSkill}
                    labelledBy="Please Select Skill"
                  />
                </FormControl>
              </Grid>
              <Grid
                item
                md={4}
                xs={12}
                sm={12}
                sx={{ display: "flex", alignItems: "end" }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={handleChangeCheckBox}
                    />
                  }
                  label="Eligible for reconsideration for another position"
                />
              </Grid>
              {checked && (
                <Grid item md={2} xs={12} sm={12}>
                  <Typography>
                    {" "}
                    <b>
                      Days<b style={{ color: "red" }}>*</b>
                    </b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      value={daysCount}
                      type="text"
                      placeholder="Enter no of days"
                      onChange={(e) => {
                        if (e.target.value.length > 0) {
                          let result = /^[0-9]+$/.test(e.target.value);
                          if (result) {
                            setDaysCount(e.target.value);
                          }
                        } else {
                          setDaysCount(e.target.value);
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
              )}
            </Grid>
            <br />
            <Grid item md={4} xs={12} sm={12}>
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <Typography>
                    <b>Education</b>
                  </Typography>
                </Grid>
                <br />
                <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Category <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={categorys}
                      value={selectedOptionsCate}
                      onChange={(e) => {
                        handleCategoryChange(e);
                        fetchCategoryBased(e);
                        setSelectedOptionsSubCate([]);
                        setSelectedOptionsEdu([]);
                        setEducationsOpt([]);
                      }}
                      valueRenderer={customValueRendererCate}
                      labelledBy="Please Select Category"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Sub Category <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={subcategorys}
                      value={selectedOptionsSubCate}
                      // onChange={handleSubCategoryChange}
                      onChange={(e) => {
                        handleSubCategoryChange(e);
                        fetchEducation(e);
                        setSelectedOptionsEdu([]);
                      }}
                      valueRenderer={customValueRendererSubCate}
                      labelledBy="Please Select Subcategory"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    {" "}
                    Specialization<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <MultiSelect
                      options={educationsOpt}
                      value={selectedOptionsEdu}
                      onChange={(e) => {
                        handleEducationChange(e);
                      }}
                      valueRenderer={customValueRendererEdu}
                      labelledBy="Please Select Specialization"
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={1} marginTop={1}>
              <Grid item md={4} xs={12} sm={12}>
                <Typography>
                  <b>Experience</b>
                </Typography>
                <Grid container spacing={1}>
                  <Grid item md={4} xs={12} sm={12}>
                    <Typography>
                      From<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Grid item md={15} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          sx={userStyle.input}
                          value={designationReq.experiencefrom}
                          onChange={(e) => {
                            setDesignationReq({
                              ...designationReq,
                              experiencefrom:
                                Number(e.target.value) > 0
                                  ? Number(e.target.value)
                                  : 0,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <Typography>
                      To<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Grid item md={15} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          sx={userStyle.input}
                          value={designationReq.experienceto}
                          onChange={(e) => {
                            setDesignationReq({
                              ...designationReq,
                              experienceto:
                                Number(e.target.value) > 0
                                  ? Number(e.target.value)
                                  : 0,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <Typography>
                  <b>Salary</b>
                </Typography>
                <Grid container spacing={1}>
                  <Grid item md={4} xs={12} sm={12}>
                    <Typography>
                      From<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Grid item md={15} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          sx={userStyle.input}
                          value={designationReq.salaryfrom}
                          onChange={(e) => {
                            setDesignationReq({
                              ...designationReq,
                              salaryfrom:
                                Number(e.target.value) > 0
                                  ? Number(e.target.value)
                                  : 0,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <Typography>
                      To<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Grid item md={15} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          sx={userStyle.input}
                          value={designationReq.salaryto}
                          onChange={(e) => {
                            setDesignationReq({
                              ...designationReq,
                              salaryto:
                                Number(e.target.value) > 0
                                  ? Number(e.target.value)
                                  : 0,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <Typography>
                  <b>Notice Period</b>
                </Typography>
                <Grid container spacing={1}>
                  <Grid item md={4} xs={12} sm={12}>
                    <Typography>
                      Estimation<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Grid item md={15} xs={12} sm={12}>
                      <FormControl fullWidth>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={designationReq.noticeperiodfrom}
                          onChange={handleChange}
                          defaultValue={1}
                        >
                          <MenuItem value="Month">Month</MenuItem>
                          <MenuItem value="Day">Day</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <Typography>
                      {`No.of ${designationReq.noticeperiodfrom}s`}
                      <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Grid item md={15} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          sx={userStyle.input}
                          value={designationReq.noticeperiodto}
                          onChange={(e) => {
                            setDesignationReq({
                              ...designationReq,
                              noticeperiodto:
                                Number(e.target.value) > 0
                                  ? Number(e.target.value)
                                  : 0,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              lg={8}
              md={8}
              sm={{ display: "none" }}
              xs={{ display: "none" }}
            >
              {" "}
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12} marginTop={1}>
              <FormControl fullWidth size="small">
                <Typography>
                  <b>Job Description </b>
                </Typography>
                <ReactQuill
                  style={{ height: "180px" }}
                  value={textSumm}
                  onChange={handleChangeSummary}
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
            <Grid item lg={12} md={12} sm={12} xs={12} marginTop={1}>
              <br /> <br />
              <FormControl fullWidth size="small">
                <Typography>
                  {" "}
                  <b>Job Requirements </b>
                </Typography>

                <ReactQuill
                  style={{ height: "180px" }}
                  value={jobrequire}
                  onChange={handleChangeJobRequire}
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
            <Grid item lg={12} md={12} sm={12} xs={12} marginTop={1}>
              <br /> <br />
              <FormControl fullWidth size="small">
                <Typography>
                  <b>Job Benefits</b>{" "}
                </Typography>

                <ReactQuill
                  style={{ height: "180px" }}
                  value={jobBenefits}
                  onChange={handleChangeJobBenefits}
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
            <br /> <br /> <br />
            <Grid item lg={12} md={12} sm={12} xs={12} marginTop={1}>
              <InputLabel>
                {" "}
                <b>
                  Role And Responsibilities <b style={{ color: "red" }}>*</b>
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
            <br />
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={6}>
                <LoadingButton
                  loading={submitLoader}
                  variant="contained"
                  sx={buttonStyles.buttonsubmit}
                  onClick={(e) => {
                    handleSubmit(e);
                  }}
                >
                  Submit
                </LoadingButton>
              </Grid>
              <Grid item md={3} xs={12} sm={6}>
                <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                  {" "}
                  Clear{" "}
                </Button>
              </Grid>
            </Grid>
          </>
        </Box>
      )}
      <br />
      {/* ****** Table Start ****** */}

      {isUserRoleCompare?.includes("ldesignationrequirements") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Designation Requirement List
              </Typography>
            </Grid>
            <Grid container spacing={2} style={userStyle.dataTablestyle}>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <label>Show entries:</label>
                  <Select
                    id="pageSizeSelect"
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    sx={{ width: "77px" }}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                    <MenuItem value={allDesignationReq.length}>All</MenuItem>
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
                    "exceldesignationrequirements"
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
                  {isUserRoleCompare?.includes(
                    "csvdesignationrequirements"
                  ) && (
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
                    "printdesignationrequirements"
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
                    "pdfdesignationrequirements"
                  ) && (
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
                  <>
                    {isUserRoleCompare?.includes("imagedesignationrequirements") && (
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={handleCaptureImage}
                      >
                        {" "}
                        <ImageIcon
                          sx={{ fontSize: "15px" }}
                        /> &ensp;image&ensp;{" "}
                      </Button>
                    )}
                  </>
                </Box>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>
                <AggregatedSearchBar
                  columnDataTable={columnDataTable}
                  setItems={setItems}
                  addSerialNumber={addSerialNumber}
                  setPage={setPage}
                  maindatas={allDesignationReq}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                  totalDatas={allDesignationReq}
                />
              </Grid>
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
            {isUserRoleCompare?.includes("bddesignationrequirements") && (
              <Button
                variant="contained"
                sx={buttonStyles.buttonbulkdelete}
                onClick={handleClickOpenalert}
              >
                Bulk Delete
              </Button>
            )}
            <br />
            <br />
            <Box
              style={{
                width: "100%",
                overflowY: "hidden", // Hide the y-axis scrollbar
              }}
            >
              {!statusCheck ? (
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
                <AggridTable
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
                  itemsList={allDesignationReq}
                />
              )}
            </Box>
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

      {/* Print End */}

      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="lg"
          fullWidth={true}
          sx={{ marginTop: "50px" }}
        >
          <Box sx={{ padding: "20px 50px" }}>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              Edit Designation Requirement{" "}
            </Typography>
            <Grid container spacing={2}>
              <Grid item lg={4} md={3} sm={12} xs={12}>
                <InputLabel>
                  {" "}
                  <b>
                    Designation<b style={{ color: "red" }}>*</b>
                  </b>
                </InputLabel>
                <FormControl fullWidth size="small">
                  <Selects
                    options={allDesignationEditOpt}
                    value={{
                      value: designationEditReq.designation,
                      label: designationEditReq.designation,
                    }}
                    onChange={(e) => {
                      setDesignationEditReq({
                        ...designationEditReq,
                        designation: e.value,
                        designationid: e._id,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item lg={4} md={3} sm={12} xs={12}>
                <InputLabel>
                  {" "}
                  <b>
                    Department<b style={{ color: "red" }}>*</b>
                  </b>
                </InputLabel>
                <FormControl fullWidth size="small">
                  <Selects
                    options={departmentOpt}
                    value={{
                      value: designationEditReq.department,
                      label: designationEditReq.department,
                    }}
                    onChange={(e) => {
                      setDesignationEditReq({
                        ...designationEditReq,
                        department: e.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>

              <Grid item lg={4} md={3} sm={12} xs={12}>
                <InputLabel>
                  <b>
                    Language <b style={{ color: "red" }}>*</b>
                  </b>
                </InputLabel>
                <FormControl fullWidth size="small">
                  <MultiSelect
                    options={language}
                    value={selectedOptionsLanEdit}
                    onChange={(e) => {
                      handleLanChangeEdit(e);
                    }}
                    valueRenderer={customValueRendererLanEdit}
                    labelledBy="Please Select Language"
                  />
                </FormControl>
              </Grid>
              <Grid item lg={4} md={3} sm={12} xs={12}>
                <InputLabel>
                  <b>
                    Skill <b style={{ color: "red" }}>*</b>
                  </b>
                </InputLabel>
                <FormControl fullWidth size="small">
                  <MultiSelect
                    options={skillOptionEdit}
                    value={selectedOptionsSkillEdit}
                    onChange={(e) => {
                      handleSkillChangeEdit(e);
                    }}
                    valueRenderer={customValueRendererSkillEdit}
                    labelledBy="Please Select Skill"
                  />
                </FormControl>
              </Grid>
              <Grid
                item
                md={4}
                xs={12}
                sm={12}
                sx={{ display: "flex", alignItems: "end" }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkedEdit}
                      onChange={handleChangeCheckBoxEdit}
                    />
                  }
                  label="Eligible for reconsideration for another position"
                />
              </Grid>
              {checkedEdit && (
                <Grid item md={2} xs={12} sm={12}>
                  <Typography>
                    {" "}
                    <b>
                      Days<b style={{ color: "red" }}>*</b>
                    </b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      value={daysCountEdit}
                      type="text"
                      placeholder="Enter no of days"
                      onChange={(e) => {
                        if (e.target.value.length > 0) {
                          let result = /^[0-9]+$/.test(e.target.value);
                          if (result) {
                            setDaysCountEdit(e.target.value);
                          }
                        } else {
                          setDaysCountEdit(e.target.value);
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
              )}
            </Grid>{" "}
            <br />
            <Grid item md={4} xs={12} sm={12}>
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <Typography>
                    <b>Education</b>
                  </Typography>
                </Grid>
                <br />
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Category <b style={{ color: "red" }}>*</b>
                    </Typography>
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
                      // onChange={handleSubCategoryChangeEdit}
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
                <Grid item lg={3} md={3} sm={12} xs={12}>
                  <Typography>
                    Specialization <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <MultiSelect
                      options={educationEditOpt}
                      value={selectedOptionsEduEdit}
                      onChange={(e) => {
                        handleEducationChangeEdit(e);
                      }}
                      valueRenderer={customValueRendererEduEdit}
                      labelledBy="Please Select Specialization"
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={1} marginTop={1}>
              <Grid item md={4} xs={12} sm={12}>
                <Typography>
                  <b>Experience</b>
                </Typography>
                <Grid container spacing={1}>
                  <Grid item md={4} xs={12} sm={12}>
                    <Typography>
                      From<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Grid item md={15} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          sx={userStyle.input}
                          value={designationEditReq.experiencefrom}
                          onChange={(e) => {
                            setDesignationEditReq({
                              ...designationEditReq,
                              experiencefrom:
                                Number(e.target.value) > 0
                                  ? Number(e.target.value)
                                  : 0,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <Typography>
                      To<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Grid item md={15} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          sx={userStyle.input}
                          value={designationEditReq.experienceto}
                          onChange={(e) => {
                            setDesignationEditReq({
                              ...designationEditReq,
                              experienceto:
                                Number(e.target.value) > 0
                                  ? Number(e.target.value)
                                  : 0,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <Typography>
                  <b>Salary</b>
                </Typography>
                <Grid container spacing={1}>
                  <Grid item md={4} xs={12} sm={12}>
                    <Typography>
                      From<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Grid item md={15} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          sx={userStyle.input}
                          value={designationEditReq.salaryfrom}
                          onChange={(e) => {
                            setDesignationEditReq({
                              ...designationEditReq,
                              salaryfrom:
                                Number(e.target.value) > 0
                                  ? Number(e.target.value)
                                  : 0,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <Typography>
                      To<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Grid item md={12} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          sx={userStyle.input}
                          value={designationEditReq.salaryto}
                          onChange={(e) => {
                            setDesignationEditReq({
                              ...designationEditReq,
                              salaryto:
                                Number(e.target.value) > 0
                                  ? Number(e.target.value)
                                  : 0,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <Typography>
                  <b>Notice Period</b>
                </Typography>
                <Grid container spacing={2}>
                  <Grid item md={6} xs={12} sm={12}>
                    <Typography>
                      Estimation<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Grid item md={12} xs={12} sm={12}>
                      <FormControl fullWidth>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={designationEditReq.noticeperiodfrom}
                          onChange={handleChangeEdit}
                        >
                          <MenuItem value="Month">Month</MenuItem>
                          <MenuItem value="Day">Day</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <Typography>
                      {`No.of ${designationEditReq.noticeperiodfrom}s`}
                      <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Grid item md={15} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          sx={userStyle.input}
                          value={designationEditReq.noticeperiodto}
                          onChange={(e) => {
                            setDesignationEditReq({
                              ...designationEditReq,
                              noticeperiodto:
                                Number(e.target.value) > 0
                                  ? Number(e.target.value)
                                  : 0,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                item
                lg={8}
                md={8}
                sm={{ display: "none" }}
                xs={{ display: "none" }}
              >
                {" "}
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    <b>Job Description </b>
                  </Typography>
                  <ReactQuill
                    style={{ height: "180px" }}
                    value={designationEditReq.jobdescription}
                    onChange={handleChangeSummaryEdit}
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
              <br /> <br />
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <br /> <br />
                <FormControl fullWidth size="small">
                  <Typography>
                    {" "}
                    <b>Job Requirements </b>
                  </Typography>

                  <ReactQuill
                    style={{ height: "180px" }}
                    value={designationEditReq.jobrequirements}
                    onChange={handleChangeJobRequireEdit}
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
              <br /> <br />
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <br /> <br />
                <FormControl fullWidth size="small">
                  <Typography>
                    <b>Job Benefits</b>{" "}
                  </Typography>

                  <ReactQuill
                    style={{ height: "180px" }}
                    value={designationEditReq.jobbenefits}
                    onChange={handleChangeJobBenefitsEdit}
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
              <br /> <br /> <br />
            </Grid>
            <br />
            <br />
            <br />
            <Grid item lg={12} md={12} sm={12} xs={12}>
              {/* <InputLabel> <b>Role And Responsibilities <b style={{ color: 'red' }}>*</b></b></InputLabel> */}

              <FormControl fullWidth size="small">
                <Typography>
                  <b>
                    Role And Responsibilities<b style={{ color: "red" }}>*</b>
                  </b>
                </Typography>
                <ReactQuill
                  style={{ height: "180px" }}
                  value={designationEditReq.rolesandres}
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
            <br /> <br /> <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={2} xs={12} sm={12}>
                <Button
                  variant="contained"
                  onClick={editSubmit}
                  sx={buttonStyles.buttonsubmit}
                >
                  {" "}
                  Update
                </Button>
              </Grid>
              <br />
              <Grid item md={6} xs={12} sm={12}>
                <Button
                  sx={buttonStyles.btncancel}
                  onClick={handleCloseModEdit}
                >
                  {" "}
                  Cancel{" "}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Dialog>
      </Box>

      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        sx={{ marginTop: "50px" }}
      >
        <Box sx={{ padding: "20px 50px" }}>
          <Typography sx={userStyle.HeaderText}>
            {" "}
            View Designation Requirement Page
          </Typography>
          <Grid container spacing={2}>
            <Grid item md={4} sm={12} xs={12}>
              <InputLabel>
                {" "}
                <b>Designation </b>
              </InputLabel>
              <Typography>{designationReqView.designation}</Typography>
            </Grid>
            <Grid item md={4} sm={12} xs={12}>
              <InputLabel>
                {" "}
                <b>Department </b>
              </InputLabel>
              <Typography>{designationReqView.department}</Typography>
            </Grid>
            <Grid item md={4} sm={12} xs={12}>
              <InputLabel>
                {" "}
                <b>Language</b>
              </InputLabel>
              <Typography>{designationReqView.language}</Typography>
            </Grid>
            <Grid item md={4} sm={12} xs={12}>
              <InputLabel>
                {" "}
                <b>Skill </b>
              </InputLabel>
              <Typography>{designationReqView.skill}</Typography>
            </Grid>
            <Grid item md={4} sm={12} xs={12}>
              <InputLabel>
                {" "}
                <b>Reconsideration Days </b>
              </InputLabel>
              <Typography>{designationReqView?.dayscount}</Typography>
            </Grid>
            <br /> <br />
            <Grid item md={12} xs={12} sm={12}>
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <InputLabel>
                    <b>Education</b>
                  </InputLabel>
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                  <InputLabel>
                    {" "}
                    <b>Category</b>
                  </InputLabel>
                  <Typography>{designationReqView.category + ","}</Typography>
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                  <InputLabel>
                    {" "}
                    <b>Sub Category</b>
                  </InputLabel>
                  <Typography>
                    {designationReqView.subcategory + ","}
                  </Typography>
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                  <InputLabel>
                    {" "}
                    <b>Specialization</b>
                  </InputLabel>
                  <Typography>{designationReqView.education + ","}</Typography>
                </Grid>
              </Grid>
            </Grid>
            <br /> <br />
            <Grid item md={4} xs={12} sm={12}>
              <InputLabel>
                <b>Experience</b>
              </InputLabel>
              <Grid container spacing={1}>
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>From</Typography>
                  <Grid item md={15} xs={12} sm={12}>
                    <Typography>{designationReqView.experiencefrom}</Typography>
                  </Grid>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>To</Typography>
                  <Grid item md={15} xs={12} sm={12}>
                    <Typography>{designationReqView.experienceto}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={4} xs={12} sm={12}>
              <InputLabel>
                <b>Salary</b>
              </InputLabel>
              <Grid container spacing={1}>
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>From</Typography>
                  <Grid item md={15} xs={12} sm={12}>
                    <Typography>{designationReqView.salaryfrom}</Typography>
                  </Grid>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>To</Typography>
                  <Grid item md={15} xs={12} sm={12}>
                    <Typography>{designationReqView.salaryto}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={4} xs={12} sm={12}>
              <InputLabel>
                <b>Notice Period</b>
              </InputLabel>
              <Grid container spacing={1}>
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>Extimate</Typography>
                  <Grid item md={15} xs={12} sm={12}>
                    <Typography>
                      {designationReqView.noticeperiodfrom}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>{`No.of ${designationReqView.noticeperiodfrom}s`}</Typography>
                  <Grid item md={15} xs={12} sm={12}>
                    <Typography>{designationReqView.noticeperiodto}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              lg={8}
              md={8}
              sm={{ display: "none" }}
              xs={{ display: "none" }}
            >
              {" "}
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <InputLabel>
                {" "}
                <b>Job Description </b>
              </InputLabel>
              <Typography>
                {convertToNumberedList(designationReqView.jobdescription)}
              </Typography>{" "}
              <br />
              <br />
              <br />
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <InputLabel>
                {" "}
                <b>Job Requirements </b>
              </InputLabel>
              <Typography>
                {convertToNumberedList(designationReqView.jobrequirements)}
              </Typography>{" "}
              <br />
              <br />
              <br />
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <InputLabel>
                {" "}
                <b>Job Benefits </b>
              </InputLabel>
              <Typography>
                {convertToNumberedList(designationReqView.jobbenefits)}
              </Typography>{" "}
              <br />
              <br />
              <br />
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <InputLabel>
                {" "}
                <b>Role And Responsibilities </b>
              </InputLabel>
              <Typography>
                {convertToNumberedList(designationReqView.rolesandres)}
              </Typography>{" "}
              <br />
              <br />
              <br />
            </Grid>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCloseview}
              sx={buttonStyles.btncancel}
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
              sx={buttonStyles.buttonsubmit}
              onClick={() => {
                handleCloseerrpop();
              }}
            >
              ok
            </Button>
            <Button sx={buttonStyles.btncancel} onClick={handleCloseerrpop}>
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
            {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleCloseerr} sx={buttonStyles.buttonsubmit}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

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
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
        itemsTwo={allDesignationReq ?? []}
        filename={"Designation Requirement"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Designation Requirement Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delProject}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={delListofDoccheckbox}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/* PLEASE SELECT ANY ROW */}
      <PleaseSelectRow
        open={isDeleteOpenalert}
        onClose={handleCloseModalert}
        message="Please Select any Row"
        iconColor="orange"
        buttonText="OK"
      />
      {/* EXTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}

export default Designationrequirement;
