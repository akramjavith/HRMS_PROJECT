import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
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
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import { useReactToPrint } from "react-to-print";
import "../../../App.css";
import { handleApiError } from "../../../components/Errorhandling";
import {
  AuthContext,
  UserRoleAccessContext,
} from "../../../context/Appcontext";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
import domtoimage from 'dom-to-image';
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import { FaFileCsv, FaFileExcel } from "react-icons/fa";

import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";

import AlertDialog from "../../../components/Alert";
import { DeleteConfirmation } from "../../../components/DeleteConfirmation.js";
import ExportData from "../../../components/ExportData";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert";

function Myrequest() {
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    // setSubmitLoader(false);
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
    "Company",
    "Branch",
    "Floor",
    "Area",
    "Seats",
    "Designation",
    "Specialization",
    "Language",
    "Skill",
    "Status",
  ];
  let exportRowValues = [
    "company",
    "branch",
    "floor",
    "area",
    "seats",
    "designation",
    "education",
    "language",
    "skill",
    "status",
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

  const gridRef = useRef(null);

  //image

  // const handleCaptureImage = () => {
  //   // Find the table by its ID
  //   const table = document.getElementById("excelcanvastable");

  //   // Clone the table element
  //   const clonedTable = table.cloneNode(true);

  //   // Append the cloned table to the document body (it won't be visible)
  //   clonedTable.style.position = "absolute";
  //   clonedTable.style.top = "-9999px";
  //   document.body.appendChild(clonedTable);

  //   // Use html2canvas to capture the cloned table
  //   html2canvas(clonedTable).then((canvas) => {
  //     // Remove the cloned table from the document body
  //     document.body.removeChild(clonedTable);

  //     // Convert the canvas to a data URL and create a download link
  //     const dataURL = canvas.toDataURL("image/jpeg", 0.8);
  //     const link = document.createElement("a");
  //     link.href = dataURL;
  //     link.download = "MyRequest_Vacancy_Posting.png";
  //     link.click();
  //   });
  // };


  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "MyRequest_Vacancy_Posting.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  const [myrequest, setMyrequest] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, buttonStyles } =
    useContext(UserRoleAccessContext);
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
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  //get all project.
  const fetchAllApproveds = async () => {
    try {
      let resans = [];
      let res_queue = await axios.get(SERVICE.APPROVEDS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const accessbranch = isUserRoleAccess?.role?.includes("Manager")
        ? isAssignBranch
          ?.map((data) => ({
            branch: data.branch,
            company: data.company,
          }))
          .filter((item, index, self) => {
            return (
              index ===
              self.findIndex(
                (i) => i.branch === item.branch && i.company === item.company
              )
            );
          })
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
          }))
          .filter((item, index, self) => {
            return (
              index ===
              self.findIndex(
                (i) => i.branch === item.branch && i.company === item.company
              )
            );
          });

      const finaldata = res_queue?.data?.approvevacancies.filter(
        (data, index) => {
          accessbranch.forEach((d, i) => {
            if (d.company === data.company && d.branch === data.branch) {
              resans.push(data);
            }
          });
        }
      );


      const itemsWithSerialNumber = resans?.map((item, index) => ({
        ...item,
        id: item?._id,
        serialNumber: index + 1,
        company: item.company,
        branch: item.branch,
        floor: item.floor,
        area: item.area?.join(","),
        seats: item.seats,
        designation: item.designation,
        education: item.education?.join(","),
        language: item.language?.join(","),
        skill: item.skill?.join(","),
        status: "On Progress",
      }));

      setMyrequest(itemsWithSerialNumber);
      setQueueCheck(true);
    } catch (err) {
      setQueueCheck(true);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
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
          label: item,
          value: item,
        }))
      );
      setSelectedOptionsSkill(
        res?.data?.sapprovevacancies?.skill.map((item) => ({
          label: item,
          value: item,
        }))
      );
      setSelectedOptionsLan(
        res?.data?.sapprovevacancies?.language.map((item) => ({
          label: item,
          value: item,
        }))
      );
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
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
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
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
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
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setFilteredChanges(null)
      setFilteredRowData([]);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  // Edit End
  const editSubmit = () => {
    if (selectedOptionsCateEdit.length == 0) {
      setPopupContentMalert("Please Select Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsSubCateEdit.length == 0) {
      setPopupContentMalert("Please Select Sub Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsEduEdit.length == 0) {
      setPopupContentMalert("Please Select Specialization!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (selectedOptionsSkill.length == 0) {
      setPopupContentMalert("Please Select Skill!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (selectedOptionsSkill.length == 0) {
      setPopupContentMalert("Please Select Language!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsLan.length == 0) {
      setPopupContentMalert("Please Select Language!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      approveedit.designation == "Choose Designation" ||
      approveedit.designation == ""
    ) {
      setPopupContentMalert("Please Select Designation!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (approveedit.branch == "") {
      setPopupContentMalert("Please Enter Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (approveedit.floor == "") {
      setPopupContentMalert("Please Enter Floor!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (approveedit.seats == "") {
      setPopupContentMalert("Please Enter Seats!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      approveedit.fromexperience == "" ||
      approveedit.toexperience == ""
    ) {
      setPopupContentMalert("Please Enter Experience!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (approveedit.fromexperience > approveedit.toexperience) {
      setPopupContentMalert("From Experience must be less than To Experience!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (approveedit.fromsalary == "" || approveedit.tosalary == "") {
      setPopupContentMalert("Please Enter Salary!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (approveedit.fromsalary > approveedit.tosalary) {
      setPopupContentMalert("From Salary must be less than To Salary!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
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
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setFilteredChanges(null)
      setFilteredRowData([]);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
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
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setFilteredChanges(null)
      setFilteredRowData([]);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
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
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
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

  //serial no for listing items
  const addSerialNumber = (datas) => {

    setItems(datas);
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    company: true,
    branch: true,
    floor: true,
    area: true,
    seats: true,
    designation: true,
    education: true,
    language: true,
    skill: true,
    status: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );
  const columnDataTable = [
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 100,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
      pinned: "left",
      //lockPinned: true,
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 130,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
      pinned: "left",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 130,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
      pinned: "left",
    },
    {
      field: "floor",
      headerName: "Floor",
      flex: 0,
      width: 130,
      hide: !columnVisibility.floor,
      headerClassName: "bold-header",
    },
    {
      field: "area",
      headerName: "Area",
      flex: 0,
      width: 130,
      hide: !columnVisibility.area,
      headerClassName: "bold-header",
    },
    {
      field: "seats",
      headerName: "Approved Seats",
      flex: 0,
      width: 100,
      hide: !columnVisibility.seats,
      headerClassName: "bold-header",
    },
    {
      field: "designation",
      headerName: "Designation",
      flex: 0,
      width: 150,
      hide: !columnVisibility.designation,
      headerClassName: "bold-header",
    },
    {
      field: "education",
      headerName: "Specialization",
      flex: 0,
      width: 150,
      hide: !columnVisibility.education,
      headerClassName: "bold-header",
    },
    {
      field: "language",
      headerName: "Language",
      flex: 0,
      width: 150,
      hide: !columnVisibility.language,
      headerClassName: "bold-header",
    },
    {
      field: "skill",
      headerName: "Skill",
      flex: 0,
      width: 150,
      hide: !columnVisibility.skill,
      headerClassName: "bold-header",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0,
      width: 130,
      hide: !columnVisibility.status,
      headerClassName: "bold-header",
    },

    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 280,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      //lockPinned: true,
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("evacancyposting") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.data.id, params.data.name);
                getunitvaluesCate(params.data);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dvacancyposting") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id, params.data.name);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vvacancyposting") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("ivacancyposting") && (
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

  const handleShowAllColumns = () => {
    setColumnVisibility(initialColumnVisibility);
  };
  const [searchQueryManage, setSearchQueryManage] = useState("");

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
          {filteredColumns?.map((column) => (
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
    addSerialNumber(myrequest);
  }, [myrequest]);
  const fileName = "MyRequest_Vacancy_Posting";
  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTable = useRef(null);

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

  const rowDataTable = filteredData?.map((item, index) => {
    return {
      id: item.id,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      floor: item.floor,
      area: item.area,
      seats: item.seats,
      designation: item.designation,
      education: item.education,
      language: item.language,
      skill: item.skill,
      status: item.status,
    };
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
                <AggregatedSearchBar
                  columnDataTable={columnDataTable}
                  setItems={setItems}
                  addSerialNumber={addSerialNumber}
                  setPage={setPage}
                  maindatas={myrequest}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                  totalDatas={myrequest}
                />
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
                  itemsList={myrequest}
                />
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
              marginTop: "50px",
              // overflow: "visible",
              // "& .MuiPaper-root": {
              //   overflow: "visible",
              // },
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
                      Specialization<b style={{ color: "red" }}>*</b>
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
                    sx={buttonStyles.buttonsubmit}
                    onClick={editSubmit}
                  >
                    Update
                  </Button>
                </Grid>
                <Grid item md={6} xs={12} sm={6}>
                  <Button
                    sx={buttonStyles.btncancel}
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
            sx={{ marginTop: "50px" }}
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
                      <Typography variant="h6"> Specialization</Typography>
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
                  sx={buttonStyles.btncancel}
                >
                  {" "}
                  Back{" "}
                </Button>
              </Grid>
              <br />
            </Box>
          </Dialog>

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
                  sx={buttonStyles.btncancel}
                >
                  Cancel
                </Button>
                <Button
                  autoFocus
                  variant="contained"
                  sx={buttonStyles.buttonsubmit}
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
                  sx={buttonStyles.buttonsubmit}
                  onClick={handleCloseModalert}
                >
                  {" "}
                  OK{" "}
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
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
                sx={buttonStyles.btncancel}
                onClick={handleCloseerr}
              >
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
          itemsTwo={myrequest ?? []}
          filename={fileName}
          exportColumnNames={exportColumnNames}
          exportRowValues={exportRowValues}
          componentRef={componentRef}
        />
        {/* INFO */}
        <InfoPopup
          openInfo={openInfo}
          handleCloseinfo={handleCloseinfo}
          heading="Approved Vacancies Info"
          addedby={addedby}
          updateby={updateby}
        />
        {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
        <DeleteConfirmation
          open={isDeleteOpen}
          onClose={handleCloseMod}
          onConfirm={deleQueue}
          title="Are you sure?"
          confirmButtonText="Yes"
          cancelButtonText="Cancel"
        />
      </Box>
    </>
  );
}

export default Myrequest;
