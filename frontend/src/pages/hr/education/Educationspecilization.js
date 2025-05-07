import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
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
  List,
  ListItem,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Popover,
  Select,
  Table,
  TableBody,
  TableHead,
  TextareaAutosize,
  TextField,
  Typography
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaEdit, FaFileCsv, FaFileExcel, FaFilePdf, FaPlus, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import { useReactToPrint } from "react-to-print";
import AlertDialog from "../../../components/Alert";
import { handleApiError } from "../../../components/Errorhandling";
import ExportData from "../../../components/ExportData";
import Headtitle from "../../../components/Headtitle";
import MessageAlert from "../../../components/MessageAlert";
import PageHeading from "../../../components/PageHeading";
import { StyledTableCell, StyledTableRow } from "../../../components/Table";
import StyledDataGrid from "../../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from "../../../context/Appcontext";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";

function EducationSpecilization() {
  let exportColumnNames = ['Category', 'Subcategory', 'Specialization'];
  let exportRowValues = ['category', 'subcategory', 'specilizationgrp'];

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

  const [educationspecilization, setEducationspecilization] = useState({
    category: "Please Select Category",
    subcategory: "Please Select Subcategory",
    type: "Please Select Type",
    reason: "Please Select Reason",
    specilizationgrp: "",
  });
  const [isBtn, setIsBtn] = useState(false);
  const [educationspecilizationEdit, setEducationspecilizationEdit] = useState([]);
  const [educationspecilizations, setEducationspecilizations] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); useState([]);
  const { isUserRoleCompare, isUserRoleAccess, pageName,
    setPageName,
    buttonStyles, } = useContext(UserRoleAccessContext);
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
      pagename: String("Education Specialization"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),

      addedby: [
        {
          name: String(isUserRoleAccess?.username),
          date: String(new Date()),
        },
      ],
    });
  }
  const [educationspeCheck, setEducationspecheck] = useState(false);
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Education Specialization.png");
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

  const handleCreateTodocheckedit = () => {
    const newTodocheckedit = {
      label: newTodoLabelcheckedit,
    };
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
    specilizationgrp: true,
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

  const [deleteEducationsp, setDeleteEducationsp] = useState("");

  const rowData = async (id, name) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.EDUCATIONSPECILIZATION_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteEducationsp(res?.data?.seducationspecilization);
      handleClickOpen();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  // Alert delete popup
  let Educationspsid = deleteEducationsp?._id;
  const delEducationSp = async (e) => {
    setPageName(!pageName)
    try {
      if (Educationspsid) {
        await axios.delete(`${SERVICE.EDUCATIONSPECILIZATION_SINGLE}/${e}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        await fetchEducationSpecilization();
        handleCloseMod();
        setSelectedRows([]);
        setPage(1);

        setPopupContent("Deleted Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
      }
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const delEducationSpcheckbox = async () => {
    setPageName(!pageName)
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.EDUCATIONSPECILIZATION_SINGLE}/${item}`, {
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

      await fetchEducationSpecilization();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const [categorys, setCategorys] = useState([]);
  const [categorysEdit, setCategorysEdit] = useState([]);

  const fetchCategoryEducation = async () => {
    setPageName(!pageName)
    try {
      let res_category = await axios.get(SERVICE.CATEGORYEDUCATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const categoryall = [
        ...res_category?.data?.educationcategory.map((d) => ({
          ...d,
          label: d.categoryname,
          value: d.categoryname,
        })),
      ];

      setCategorys(categoryall);
      setCategorysEdit(categoryall);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const fetchCategoryBased = async () => {
    setPageName(!pageName)
    try {
      let res_category = await axios.get(SERVICE.CATEGORYEDUCATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCategoryOptions(res_category?.data?.educationcategory);

    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
    setPageName(!pageName)
    try {
      let subprojectscreate = await axios.post(
        SERVICE.EDUCATIONSPECILIZATION_CREATE,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          category: [...valueCat],
          subcategory: [...valueSubCat],
          specilizationgrp: [...todoscheck],
          addedby: [
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      await fetchEducationSpecilization();
      setNewTodoLabelcheck("");
      setTodoscheck([]);
      setEducationspecilization({
        ...educationspecilization,
        specilizationgrp: "",
      });

      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setIsBtn(false)
    } catch (err) { setIsBtn(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();

    let catopt = selectedOptionsCat.map((item) => item.value);
    let subcatopt = selectedOptionsSubCat.map((item) => item.value);

    const isNameMatch = educationspecilizations.some(
      (item) =>
        item.category.some((data) => catopt.includes(data)) &&
        item.subcategory.some((data) => subcatopt.includes(data))
    );

    if (valueCat?.length == 0) {

      setPopupContentMalert("Please Select Category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (valueSubCat?.length == 0) {

      setPopupContentMalert("Please Select Sub Category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (todoscheck.length === 0) {

      setPopupContentMalert("Please Enter Specialization");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (isNameMatch) {

      setPopupContentMalert("Data Already exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      sendRequest();
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setNewTodoLabelcheck("");
    setTodoscheck([]);
    setEducationspecilization({
      category: "Please Select Category",
      subcategory: "Please Select Subcategory",
      specilizationgrp: "",
    });
    setValueCat([]);
    setSelectedOptionsCat([]);
    setValueSubCat([]);
    setSelectedOptionsSubCat([]);

    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();

  };

  //Edit model...
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    setEducationspecilizationEdit({
      specilizationgrp: "",
    });
    setNewTodoLabelcheckedit("");
    setTodoscheckedit([]);
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

  const handleCategoryChange = (options) => {
    setValueCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCat(options);
    setValueSubCat([]);
    setSelectedOptionsSubCat([]);
    setEducationspecilization({
      ...educationspecilization,
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
    setEducationspecilizationEdit({
      ...educationspecilizationEdit,

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
    setEducationspecilization({
      ...educationspecilization,
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
    setEducationspecilizationEdit({
      ...educationspecilizationEdit,
    });
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

  //get single row to edit....
  const getCode = async (e, name) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.EDUCATIONSPECILIZATION_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setEducationspecilizationEdit(res?.data?.seducationspecilization);
      setTodoscheckedit(res?.data?.seducationspecilization.specilizationgrp);
      setCategoryValueCateEdit(res?.data?.seducationspecilization?.category);
      setSelectedCategoryOptionsCateEdit([
        ...res?.data?.seducationspecilization?.category.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setSubCategoryValueCateEdit(
        res?.data?.seducationspecilization?.subcategory
      );
      setSelectedSubCategoryOptionsCateEdit([
        ...res?.data?.seducationspecilization?.subcategory.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      handleClickOpenEdit();

    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.EDUCATIONSPECILIZATION_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setEducationspecilizationEdit(res?.data?.seducationspecilization);
      setTodoscheckedit(res?.data?.seducationspecilization.specilizationgrp);
      handleClickOpenview();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.EDUCATIONSPECILIZATION_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setEducationspecilizationEdit(res?.data?.seducationspecilization);
      handleClickOpeninfo();

    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  useEffect(() => {
    fetchCategoryEducation();
  }, []);

  //Project updateby edit page...
  let updateby = educationspecilizationEdit?.updatedby;
  let addedby = educationspecilizationEdit?.addedby;

  let subprojectsid = educationspecilizationEdit?._id;

  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.put(
        `${SERVICE.EDUCATIONSPECILIZATION_SINGLE}/${subprojectsid}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          category: [...categoryValueCateEdit],
          subcategory: [...subCategoryValueCateEdit],
          specilizationgrp: [...todoscheckedit],
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      await fetchEducationSpecilization();
      setTodoscheckedit([]);
      handleCloseModEdit();

      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();


    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const editSubmit = async (e) => {
    e.preventDefault();
    let resdata = await fetchEducationSpecilizationAll();
    let catopt = selectedCategoryOptionsCateEdit.map((item) => item.value);
    let subcatopt = selectedSubCategoryOptionsCateEdit.map(
      (item) => item.value
    );

    const isNameMatch = resdata.some(
      (item) =>
        item.category.some((data) => catopt.includes(data)) &&
        item.subcategory.some((data) => subcatopt.includes(data))
    );

    if (categoryValueCateEdit?.length == 0) {

      setPopupContentMalert("Please Select Category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (subCategoryValueCateEdit?.length == 0) {

      setPopupContentMalert("Please Select Sub Category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (todoscheckedit.length == 0) {

      setPopupContentMalert("Please Enter Specialization");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {

      setPopupContentMalert("Data Already exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendEditRequest();
    }
  };

  //get all Sub vendormasters.
  const fetchEducationSpecilization = async () => {
    setPageName(!pageName)
    try {
      let res_vendor = await axios.get(SERVICE.EDUCATIONSPECILIZATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setEducationspecilizations(res_vendor?.data?.educationspecilizations);
      setEducationspecheck(true);
    } catch (err) { setEducationspecheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //get all Sub vendormasters.
  const fetchEducationSpecilizationAll = async () => {
    setPageName(!pageName)
    try {
      let res_check = await axios.get(SERVICE.EDUCATIONSPECILIZATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      return res_check?.data?.educationspecilizations.filter(
        (item) => item._id !== educationspecilizationEdit._id
      )
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };


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

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Education Specialization",
    pageStyle: "print",
  });

  useEffect(() => {
    fetchEducationSpecilization();
    fetchCategoryBased();
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
    const itemsWithSerialNumber = educationspecilizations?.map(
      (item, index) => ({
        ...item, serialNumber: index + 1,
        category: item.category?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
        subcategory: item.subcategory
          ?.map((t, i) => `${i + 1 + ". "}` + t)
          .toString(),
        specilizationgrp: item.specilizationgrp
          ?.map((item, i) => `${i + 1 + ". "}` + item.label)
          .toString(),
      })
    );
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [educationspecilizations]);

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
      field: "specilizationgrp",
      headerName: "Specialization",
      flex: 0,
      width: 250,
      hide: !columnVisibility.specilizationgrp,
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
          {isUserRoleCompare?.includes("eeducationspecilization") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.row.id, params.row.name);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("deducationspecilization") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id, params.row.name);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("veducationspecilization") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("ieducationspecilization") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getinfoCode(params.row.id);
              }}
            >
              <InfoOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttoninfo} />
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
      category: item.category,
      subcategory: item.subcategory,
      specilizationgrp: item.specilizationgrp,
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
      <Headtitle title={"Education Specialization"} />
      {/* ****** Header Content ****** */}

      <PageHeading
        title="Education Specialization"
        modulename="Human Resources"
        submodulename="HR"
        mainpagename="HR Setup"
        subpagename="Education Specilization"
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("aeducationspecilization") && (
        <Box sx={userStyle.dialogbox}>
          <>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  Add Education Specialization
                </Typography>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Category<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <MultiSelect
                    options={categorys}
                    value={selectedOptionsCat}
                    onChange={(e) => {
                      handleCategoryChange(e);
                    }}
                    valueRenderer={customValueRendererCat}
                    labelledBy="Please Select Category"
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Sub Category<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <MultiSelect
                    options={filteredSubCategoryOptions}
                    value={selectedOptionsSubCat}
                    onChange={(e) => {
                      handleSubCategoryChange(e);
                    }}
                    valueRenderer={customValueRendererSubCat}
                    labelledBy="Please Select Sub Category"
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <>

                  <Grid container spacing={1}>
                    <Grid item md={4} sm={6} xs={6}>
                      <Typography>
                        Specialization <b style={{ color: "red" }}>*</b>
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid item md={10} sm={12} xs={12}>
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
                          Please Enter Different Name
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
                            <Grid item md={8} sm={6} xs={6}>
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
                                  Please Choose Different Name
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
                            <Grid item md={8} sm={3} xs={3}>
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

            <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={isBtn}
                sx={buttonStyles.buttonsubmit}
              >
                Submit
              </Button>
              &nbsp;
              &nbsp;
              &nbsp;
              <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                Clear
              </Button>
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
          sx={{ marginTop: "80px" }}
        >
          <Box sx={{ padding: "20px" }}>
            <>
              <form onSubmit={editSubmit}>
                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={12}>
                    <Typography sx={userStyle.HeaderText}>
                      Edit Education Specialization
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
                  <Grid item md={12} xs={12} sm={12}>
                    <>
                      <br />
                      <Grid container spacing={1}>
                        <Grid item md={5} sm={12} xs={12}>
                          <Typography>
                            Specialization<b style={{ color: "red" }}>*</b>
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
                              Please Enter Different Name
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
                                      Please Enter Different Name
                                    </Typography>
                                  ) : (
                                    ""
                                  )}
                                </Grid>

                                <Grid item md={1.5} sm={1.5} xs={1.5}>
                                  {/* {todoCheckEditededit ? "" : (editedTododescheckedit != "" && editcheckpointedit != "" ? */}
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
                                  {/* : "")} */}
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
                      sx={buttonStyles.buttonsubmit}
                    >
                      Update
                    </Button>
                  </Grid>
                  <Grid item md={6} xs={6} sm={6}>
                    <Button
                      onClick={() => {
                        setEditingIndexcheckedit(-1);
                        handleCloseModEdit();
                      }}
                      sx={buttonStyles.btncancel}
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
      {isUserRoleCompare?.includes("leducationspecilization") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Education Specialization List
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
                    {/* <MenuItem value={educationspecilizations?.length}>
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
                  {isUserRoleCompare?.includes(
                    "exceleducationspecilization"
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
                  {isUserRoleCompare?.includes("csveducationspecilization") && (
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
                    "printeducationspecilization"
                  ) && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                  {isUserRoleCompare?.includes("pdfeducationspecilization") && (
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
                  {isUserRoleCompare?.includes(
                    "imageeducationspecilization"
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
            {isUserRoleCompare?.includes("bdeducationspecilization") && (
              <Button
                variant="contained"
                color="error"
                onClick={handleClickOpenalert}
                sx={buttonStyles.buttonbulkdelete}
              >
                Bulk Delete
              </Button>
            )}
            <br />
            <br />
            {!educationspeCheck ? (
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
              onClick={(e) => delEducationSp(Educationspsid)}
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
                Education Specialization Info
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
                <Button variant="contained" onClick={handleCloseinfo} sx={buttonStyles.btncancel}>
                  {" "}
                  Back{" "}
                </Button>
              </Grid>
            </>
          </Box>
        </Dialog>

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
              View Education Specialization
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Category</Typography>
                  <Typography>
                    {educationspecilizationEdit.category
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Subcategory</Typography>
                  <Typography>
                    {educationspecilizationEdit.subcategory
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
                sm={12}
                sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}
              >
                <Typography variant="h6">Specialization</Typography>
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
                sx={buttonStyles.btncancel}
              >
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
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
              onClick={(e) => delEducationSpcheckbox(e)}
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
      <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={rowDataTable ?? []}
        itemsTwo={items ?? []}
        filename={"Education Specialization"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />

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
    </Box>
  );
}

export default EducationSpecilization;