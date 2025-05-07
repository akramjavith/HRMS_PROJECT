import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, OutlinedInput, Dialog, DialogContent, DialogActions, FormControl, Grid, Button } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
import { MultiSelect } from "react-multi-select-component";
import axios from "axios";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Selects from "react-select";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import DeleteIcon from "@mui/icons-material/Delete";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
import { handleApiError } from "../../../components/Errorhandling";
import LoadingButton from "@mui/lab/LoadingButton";
import Headtitle from "../../../components/Headtitle";
import PageHeading from "../../../components/PageHeading";
import AlertDialog from "../../../components/Alert";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../../components/DeleteConfirmation.js";
import ExportData from "../../../components/ExportData";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert";


function AddDocument() {
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
  const [newDocuments, setNewDocuments] = useState({
    categoryname: { label: "Please Select Category Name", value: "Please Select Category Name" },
    subcategoryname: { label: "Please Select SubCategory Name", value: "Please Select SubCategory Name" },
    type: { label: "Please Select Type", value: "Please Select Type" },
    module: "",
    customer: { label: "Please Select Customer", value: "Please Select Customer" },
    queue: { label: "Please Select Queue", value: "Please Select Queue" },
    process: { label: "Please Select Process", value: "Please Select Process" },
    form: "",
  });
  const [fieldsShow, setFieldsShow] = useState(false);
  const [uploadShow, setUploadShow] = useState(false);
  const [textShow, setTextShow] = useState(false);
  const [documentFiles, setdocumentFiles] = useState([]);
  const [TextEditor, setTextEditor] = useState("");
  const [customeropt, setCustomerOptions] = useState([]);
  const [queueopt, setQueue] = useState([]);
  const [processOpt, setProcessOpt] = useState([]);
  const [textAreas, setTextAreas] = useState([]);
  const [currentText, setCurrentText] = useState('');

  const [isBtn, setIsBtn] = useState(false);
  const [indexViewQuest, setIndexViewQuest] = useState(0);
  const { auth } = useContext(AuthContext);
  const [showAlert, setShowAlert] = useState();
  const {
    isUserRoleCompare,
    isUserRoleAccess,
    pageName,
    setPageName,
    buttonStyles,
  } = useContext(UserRoleAccessContext);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
    setIsBtn(false)
  };


  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [OptionsType, setOptionsType] = useState([]);

  useEffect(
    () => {
      fetchTypemaster();
    }, []
  )
  //get all Sub vendormasters.
  const fetchTypemaster = async () => {
    setPageName(!pageName);
    try {
      let res_vendor = await axios.get(SERVICE.TYPEMASTERDOCUMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const resval = [{ value: "Quickclaim Document", label: "Quickclaim Document" },
      ...res_vendor?.data?.typemasterdouments.map((d) => (
        {
          ...d,
          label: d.name,
          value: d.name
        }
      ))]
      setOptionsType(resval);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const showDocument = (e) => {
    if (e.value !== "Quickclaim Document") {
      setFieldsShow(true);
    } else {
      setFieldsShow(false);
    }
  };
  useEffect(() => {
    if (textAreas.length > 0) {
      setUploadShow(false);
    } else {
      setUploadShow(true);
    }
    if (documentFiles?.length === 0) {
      setTextShow(true);
    } else if (documentFiles?.length > 0) {
      setTextShow(false);
    }
    if (fieldsShow) {
      setNewDocuments({ ...newDocuments, customer: { label: "Please Select Customer", value: "Please Select Customer" }, queue: { label: "Please Select Queue", value: "Please Select Queue" }, process: { label: "Please Select Process", value: "Please Select Process" }, form: "" });
    }
  }, [TextEditor, documentFiles, fieldsShow, textAreas]);

  const handleResumeUpload = (event) => {
    const files = event.target.files[0]; // Convert FileList to an array
    setdocumentFiles(prevFiles => [...prevFiles, files]);// Set the array of files in state
  };

  const handleNext = () => {
    // Add the currentText to the textAreas array
    const ans = textAreas.some(text => convertToNumberedList(text) === convertToNumberedList(currentText) && !currentText.includes('<p><img src'));
    if (currentText === "" || currentText === "<p><br></p>") {
      setPopupContentMalert("Please Enter Any Description!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (ans) {
      setPopupContentMalert("Already Added!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      setTextAreas((prevTextAreas) => [...prevTextAreas, currentText]);
      setIndexViewQuest(indexViewQuest + 1);
    }

    // Clear the currentText for the next textarea
    setCurrentText('');
  };
  const handleNextPage = () => {
    setIndexViewQuest(indexViewQuest + 1);
  };
  const handlePrevPage = () => {
    setIndexViewQuest(indexViewQuest - 1);
  };
  const HandleDeleteText = (index) => {
    const updatedTodos = [...textAreas];
    updatedTodos.splice(index, 1);
    setTextAreas(updatedTodos);
    if (updatedTodos.length > 0) {
      setIndexViewQuest(1);
    }
    else {
      setIndexViewQuest(-1);
    }
  };
  const handleEditTExtBox = (index, msg) => {
    textAreas[index] = msg;
  }
  const HandleClickGenerateTExtCombine = () => {
    const answer = textAreas?.join('');

    convertToNumberedList(answer)
  }

  const convertToNumberedList = (htmlContent) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = htmlContent;

    const listItems = Array.from(tempElement.querySelectorAll("li"));
    listItems.forEach((li, index) => {
      li.innerHTML = `${index + 1}. ${li.innerHTML}\n`;
    });

    return tempElement.innerText;
  };


  //Rendering File
  const renderFilePreview = async (file) => {
    const pdfBlobUrl = URL.createObjectURL(file);
    window.open(pdfBlobUrl, "_blank");
  };
  const handleFileDelete = (index) => {
    // Create a new array excluding the file at the specified index
    const updatedFiles = documentFiles.filter((_, i) => i !== index);
    setdocumentFiles(updatedFiles);
  };

  const fetchCategory = async () => {
    setPageName(!pageName);
    try {
      let response = await axios.get(`${SERVICE.CATEGORYEXCEL}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let data_set = response?.data?.categoryexcel.map((d) => d.name);
      let filter_opt = [...new Set(data_set)];

      setCategoryOptions(
        filter_opt.map((data) => ({
          ...data,
          label: data,
          value: data,
        }))
      );
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchCustomer = async () => {
    setPageName(!pageName);
    try {
      let response = await axios.get(`${SERVICE.EXCELMAPDATA}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let data_set = response?.data?.excelmapdatas.map((d) => d.customer);
      let filter_opt = [...new Set(data_set)];

      setCustomerOptions(
        filter_opt.map((data) => ({
          ...data,
          label: data,
          value: data,
        }))
      );
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  useEffect(() => {
    fetchCustomer();
  }, []);

  const fetchQueue = async () => {
    setPageName(!pageName);
    try {
      let response = await axios.get(`${SERVICE.QUEUE}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let data_set = response?.data?.queues.map((d) => d.name);
      let filter_opt = [...new Set(data_set)];

      setQueue(
        filter_opt.map((data) => ({
          ...data,
          label: data,
          value: data,
        }))
      );
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  useEffect(() => {
    fetchQueue();
  }, []);
  const fetchProcess = async () => {
    setPageName(!pageName);
    try {
      let response = await axios.get(`${SERVICE.EXCELMAPDATA}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let data_set = response?.data?.excelmapdatas.map((d) => d.process);
      let filter_opt = [...new Set(data_set)];

      setProcessOpt(
        filter_opt.map((data) => ({
          ...data,
          label: data,
          value: data,
        }))
      );
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  useEffect(() => {
    fetchProcess();
  }, []);

  const [typeSubCategory, setTypeSubCategory] = useState([]);


  const fetchSubCategory = async (e) => {
    let employ = e.map((item) => item.value);
    setPageName(!pageName);
    try {
      let response = await axios.get(`${SERVICE.SUBCATEGORYEXCEL}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let data_set = response?.data?.subcategoryexcel
        .filter((data) => {
          return employ.includes(data.categoryname);
        })
        .map((value) => value.name);

      const subcatall = [{ label: 'ALL', value: 'ALL' }, ...data_set.map((d) => (
        {
          ...d,
          label: d,
          value: d
        }
      ))];
      const uniqueArray = subcatall.filter((item, index, self) => {
        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
      });

      setSubCategoryOptions(uniqueArray);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const fetchSubCategoryType = async (e) => {
    let employ = e.map((item) => item.value);
    setPageName(!pageName);
    try {
      let response = await axios.get(`${SERVICE.CATEGORYDOCUMENT}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let data_set = response?.data?.doccategory
        .filter((data) => {
          return data?.typemastername?.includes(newDocuments?.type?.label) && employ.includes(data.categoryname);
        })
        .map((value) => value.subcategoryname).flat();
      const subcatall = [{ label: 'ALL', value: 'ALL' }, ...data_set.map((d) => (
        {
          ...d,
          label: d,
          value: d
        }
      ))];
      const uniqueArray = subcatall.filter((item, index, self) => {
        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
      });

      setTypeSubCategory(uniqueArray);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const [typeCategory, setTypeCategory] = useState([]);

  const fetchTypeCategory = async (typevalue) => {
    setPageName(!pageName);
    try {
      let response = await axios.get(`${SERVICE.CATEGORYDOCUMENT}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const resfilter = response?.data?.doccategory?.filter((data, index) => {
        return data?.typemastername?.includes(typevalue)
      })
      let data_set = resfilter.map((d) => d.categoryname);
      let filter_opt = [...new Set(data_set)];

      setTypeCategory(
        filter_opt.map((data) => ({
          ...data,
          label: data,
          value: data,
        }))
      );
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const handleClear = () => {
    setNewDocuments({
      ...newDocuments,
      categoryname: { label: "Please Select Category Name", value: "Please Select Category Name" },
      subcategoryname: { label: "Please Select SubCategory Name", value: "Please Select SubCategory Name" },
      type: { label: "Please Select Type", value: "Please Select Type" },
      module: "",
      customer: { label: "Please Select Customer", value: "Please Select Customer" },
      queue: { label: "Please Select Queue", value: "Please Select Queue" },
      process: { label: "Please Select Process", value: "Please Select Process" },
      form: "",
    });
    setTextEditor("");
    setTextAreas([])
    setdocumentFiles([]);
    setSubCategoryOptions([])
    setSelectedOptionsCat([]);
    setSelectedOptionsSubcat([]);
    setSelectedOptionsPro([]);
    setSelectedOptionsCus([]);
    setSelectedOptionsQue([]);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  const sendRequest = async () => {

    setIsBtn(true)
    let empsub = selectedOptionsSubcat.map((item) => item.value);
    let valueCat = selectedOptionsCat.map((item) => item.value);
    let valueSubcat = selectedOptionsSubcat.map((item) => item.value);
    let valueCus = selectedOptionsCus.map((item) => item.value);
    let valuePro = selectedOptionsPro.map((item) => item.value);
    let valueQue = selectedOptionsQue.map((item) => item.value);
    const formData = new FormData();
    documentFiles.forEach(file => {
      formData.append('document', file);
    });

    valueCat.forEach((value, index) => {
      formData.append(`categoryname[]`, value);
    });

    valueSubcat.forEach((value, index) => {
      formData.append(`subcategoryname[]`, value);
    });
    valueCus.forEach((value, index) => {
      formData.append(`customer[]`, value);
    });
    valuePro.forEach((value, index) => {
      formData.append(`process[]`, value);
    });
    valueQue.forEach((value, index) => {
      formData.append(`queue[]`, value);
    });
    textAreas.forEach((value, index) => {
      formData.append(`documentstext[]`, value);
    });

    (newDocuments.module === "" ? empsub : [newDocuments.module]).forEach((value, index) => {
      formData.append(`module[]`, value);
    });

    // formData.append('categoryname', [...valueCat]);
    // formData.append('subcategoryname', [...valueSubcat]);
    formData.append('type', String(newDocuments.type.value));
    // formData.append('module', newDocuments.module === "" ? [...empsub] : String(newDocuments.module));
    // formData.append('customer', newDocuments.type.value !== "Quickclaim Document" ? "" : [...valueCus]);
    // formData.append('process', newDocuments.type.value !== "Quickclaim Document" ? "" : [...valuePro]);
    // formData.append('queue', newDocuments.type.value !== "Quickclaim Document" ? "" : [...valueQue]);
    formData.append('form', newDocuments.type.value !== "Quickclaim Document" ? "" : String(newDocuments.form));
    // formData.append('documentstext', [...textAreas]);
    const addedBy = { name: String(isUserRoleAccess.companyname), date: String(new Date()) };
    Object.keys(addedBy).forEach(key => {
      formData.append(`addedby[0][${key}]`, addedBy[key]);
    });
    // formData.append('fileName', documentFiles?.name);
    setPageName(!pageName);
    try {
      await axios.post(`${SERVICE.DOCUMENT_CREATE}`,
        formData, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setNewDocuments({
        ...newDocuments,
        module: "",
        form: "",
      });
      setTextEditor("");
      setTextAreas([])
      setdocumentFiles([]);
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setIndexViewQuest(0)
      setIsBtn(false)
      // setFieldsShow(false)
    } catch (err) { setIsBtn(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };


  const handleSubmit = () => {
    if (newDocuments?.type?.value === "Please Select Type") {
      setPopupContentMalert("Please Select Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (selectedOptionsCat.length == 0) {


      setPopupContentMalert("Please Select Category Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (selectedOptionsSubcat?.length == 0) {
      setPopupContentMalert("Please Select SubCategory Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (newDocuments?.type?.value === "Quickclaim Document" && selectedOptionsCus.length == 0) {
      setPopupContentMalert("Please Select Customer!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (newDocuments?.type?.value === "Quickclaim Document" && selectedOptionsQue.length == 0) {
      setPopupContentMalert("Please Select Queue!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (newDocuments?.type?.value === "Quickclaim Document" && selectedOptionsPro.length == 0) {
      setPopupContentMalert("Please Select Process!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (newDocuments?.type?.value === "Quickclaim Document" && newDocuments?.form === "") {
      setPopupContentMalert("Please Enter Form!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (newDocuments?.type?.value === "Quickclaim Document" && newDocuments?.form === "") {
      setPopupContentMalert("Please Enter Form!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (documentFiles?.length === 0 && textAreas.length === 0) {
      setPopupContentMalert("Please Enter or Upload Docments!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (currentText && currentText !== "<p><br></p>") {
      setPopupContentMalert("Please Add the Documents!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      sendRequest();
    }
  };

  const handleChangeInput = (e) => {
    // Remove any numeric characters from the input value
    const newValue = e.target.value.replace(/[0-9]/g, "");
    setNewDocuments({ ...newDocuments, module: newValue });
  };


  // Categoryname multiselect
  const [selectedOptionsCat, setSelectedOptionsCat] = useState([]);
  let [valueCat, setValueCat] = useState("");

  const handleCategoryChange = (options) => {
    setValueCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCat(options);
  };

  const customValueRendererCat = (valueCat, _categoryname) => {
    return valueCat.length ? valueCat.map(({ label }) => label).join(", ") : "Please Select Category Name";
  };

  // Subcatgeoryname multiselect
  const [selectedOptionsSubcat, setSelectedOptionsSubcat] = useState([]);
  let [valueSubcat, setValueSubcat] = useState(["ALL"]);

  const handleSubcategoryChange = (options) => {
    setValueSubcat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsSubcat(options);
  };

  const customValueRendererSubcat = (valueSubcat, _subcategoryname) => {
    return valueSubcat.length ? valueSubcat.map(({ label }) => label).join(", ") : "Please Select SubCategory Name";
  };



  // Customer multiselect
  const [selectedOptionsCus, setSelectedOptionsCus] = useState([]);
  let [valueCus, setValueCus] = useState("");

  const handleCustomerChange = (options) => {
    setValueCus(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCus(options);
  };

  const customValueRendererCus = (valueCus, _customer) => {
    return valueCus.length ? valueCus.map(({ label }) => label).join(", ") : "Please Select Customer";
  };

  // queue multiselect
  const [selectedOptionsQue, setSelectedOptionsQue] = useState([]);
  let [valueQue, setValueQue] = useState("");

  const handleQueueChange = (options) => {
    setValueQue(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsQue(options);
  };

  const customValueRendererQue = (valueCus, _queue) => {
    return valueCus.length ? valueCus.map(({ label }) => label).join(", ") : "Please Select Queue";
  };

  // process multiselect
  const [selectedOptionsPro, setSelectedOptionsPro] = useState([]);
  let [valuePro, setValuePro] = useState("");

  const handleProcessChange = (options) => {
    setValuePro(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsPro(options);
  };

  const customValueRendererPro = (valuePro, _process) => {
    return valuePro.length ? valuePro.map(({ label }) => label).join(", ") : "Please Select Process";
  };


  return (
    <Box>
      <Headtitle title={"ADD DOCUMENT"} />
      <PageHeading
        title="Document"
        modulename="Documents"
        submodulename="Document"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("adocument") && (
        <>
          <Box sx={userStyle.container}>

            <Grid container spacing={2}>
              <Grid md={11} item xs={8}>
                <Typography sx={userStyle.HeaderText}>
                  Add Document
                </Typography>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Type<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    id="component-outlined"
                    type="text"
                    placeholder="Please Select Type"
                    options={OptionsType}
                    value={{ label: newDocuments?.type?.label, value: newDocuments?.type?.value }}
                    onChange={(e) => {
                      showDocument(e);
                      fetchTypeCategory(e.value)
                      setNewDocuments({
                        ...newDocuments,
                        type: {
                          label: e.label,
                          value: e.value,
                        },
                        categoryname: {
                          label: "Please Select Category Name",
                          value: "Please Select Category Name",
                        },
                      }); setSelectedOptionsSubcat([]); setSelectedOptionsCat([]); setSelectedOptionsCus([]);
                      setSelectedOptionsQue([]);
                      setSelectedOptionsPro([])
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Category Name <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <MultiSelect
                    options={newDocuments.type.label !== "Quickclaim Document" ? typeCategory : categoryOptions}
                    value={selectedOptionsCat}
                    onChange={(e) => {
                      handleCategoryChange(e);
                      newDocuments?.type?.label !== "Quickclaim Document" ? fetchSubCategoryType(e) : fetchSubCategory(e);

                      setSelectedOptionsSubcat([]);
                    }}

                    valueRenderer={customValueRendererCat}
                    labelledBy="Please Select Category Name"
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Sub Category Name <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <MultiSelect
                    options={newDocuments.type.label !== "Quickclaim Document" ? typeSubCategory : subCategoryOptions}
                    value={selectedOptionsSubcat}
                    onChange={handleSubcategoryChange}
                    valueRenderer={customValueRendererSubcat}
                    labelledBy="Please Select SubCategory Name"
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Module
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Please Enter Module"
                    value={newDocuments.module}
                    onChange={(e) => {
                      setNewDocuments({ ...newDocuments, module: e.target.value });
                      handleChangeInput(e);
                    }}
                  />
                </FormControl>
              </Grid>
              {/* next grdi */}

              {!fieldsShow ? (
                <>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Customer<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={customeropt}
                        value={selectedOptionsCus}
                        onChange={handleCustomerChange}
                        valueRenderer={customValueRendererCus}
                        labelledBy="Please Select Customer"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        {" "}
                        Queue<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={queueopt}
                        value={selectedOptionsQue}
                        onChange={handleQueueChange}
                        valueRenderer={customValueRendererQue}
                        labelledBy="Please Select Queue"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Process<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={processOpt}
                        value={selectedOptionsPro}
                        onChange={handleProcessChange}
                        valueRenderer={customValueRendererPro}
                        labelledBy="Please Select Process"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Form<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Form"
                        value={newDocuments.form}
                        onChange={(e) => {
                          setNewDocuments({ ...newDocuments, form: e.target.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                </>
              ) : null}

              {textShow ? (
                <>
                  <Grid item md={12} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        <b> Documents </b>
                      </Typography>
                      <ReactQuill
                        style={{ height: "400px" }}
                        value={currentText}
                        onChange={(e) => {
                          setCurrentText(e);
                        }}
                        modules={{
                          toolbar: [[{ header: "1" }, { header: "2" }, { font: [] }], [{ size: [] }], ["bold", "italic", "underline", "strike", "blockquote"], [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }], ["link", "image", "video"], ["clean"]],
                        }}
                        formats={["header", "font", "size", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "indent", "link", "image", "video"]}
                      />
                    </FormControl>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                      <Button variant="contained" onClick={handleNext}>Next</Button>
                    </div>
                  </Grid>



                </>
              ) : null}

              {textAreas.map((text, index) => {
                if (index === (indexViewQuest - 1)) {
                  return (
                    < Grid item md={12} sm={12} xs={12} >
                      <FormControl fullWidth size="small">
                        <Typography>
                          <b> Documents List</b>
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item md={11} sm={12} xs={12}>
                            <ReactQuill
                              style={{ height: "200px" }}
                              value={text}
                              onChange={(e) => {
                                // setCurrentText(e);
                                handleEditTExtBox(index, e)
                              }}
                              modules={{
                                toolbar: [[{ header: "1" }, { header: "2" }, { font: [] }], [{ size: [] }], ["bold", "italic", "underline", "strike", "blockquote"], [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }], ["link", "image", "video"], ["clean"]],
                              }}
                              formats={["header", "font", "size", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "indent", "link", "image", "video"]}
                            />
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                              {(indexViewQuest > 1 && (indexViewQuest) <= textAreas.length) ?
                                <Button variant="contained" onClick={handlePrevPage}>Prev Page</Button>
                                : null
                              }
                              {(((indexViewQuest) < textAreas.length)) ?
                                <Button variant="contained" onClick={handleNextPage}>Next Page</Button>
                                : null
                              }

                            </div>
                          </Grid>
                          <Grid item md={1} sm={12} xs={12}>
                            <Button
                              sx={userStyle.buttondelete}
                              onClick={(e) => {
                                HandleDeleteText(index)
                              }}
                            >
                              <DeleteOutlineOutlinedIcon sx={{ ...buttonStyles.buttondelete, fontsize: "large" }} />
                            </Button>

                          </Grid>
                        </Grid>
                      </FormControl>

                    </Grid>
                  )
                }
              }
              )}
              {uploadShow ? (
                <>
                  <Grid item md={12} sm={12} xs={12}>
                    <br /> <br /> <br /> <br />
                    <Typography variant="h6">Upload Document</Typography>
                    <Grid marginTop={2}>
                      <Button variant="contained" size="small" component="label" sx={{ ...buttonStyles.buttonsubmit, "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                        Upload
                        <input
                          type="file"
                          id="resume"
                          accept=".xlsx, .xls, .csv, .pdf, .txt,"
                          name="file"
                          hidden
                          // multiple
                          onChange={(e) => {
                            handleResumeUpload(e);
                            setTextEditor("");
                            setTextAreas([])
                          }}
                        />
                      </Button>
                      <br />
                      <br />
                      {documentFiles?.length > 0 &&
                        documentFiles.map((data, index) => { // Use map instead of forEach
                          return (
                            <Grid container spacing={2} key={index}> {/* Use key prop for each item */}
                              <Grid item lg={3} md={3} sm={6} xs={6}>
                                <Typography>{data.name}</Typography> {/* Display the file name */}
                              </Grid>
                              <Grid item lg={1} md={1} sm={1} xs={1}>
                                <Button
                                  sx={{ ...buttonStyles.buttonview, cursor: "pointer", fontSize: "large", marginTop: "-5px" }}
                                  onClick={() => renderFilePreview(data)}
                                >
                                  <VisibilityOutlinedIcon />
                                </Button>
                              </Grid>
                              <Grid item lg={1} md={1} sm={1} xs={1}>
                                <Button
                                  sx={{ ...buttonStyles.buttondelete, cursor: "pointer", fontSize: "large", marginTop: "-5px" }}
                                  onClick={() => handleFileDelete(index)}
                                >
                                  <DeleteIcon />
                                </Button>
                              </Grid>
                            </Grid>
                          );
                        })}

                    </Grid>
                  </Grid>
                </>
              ) : null}
              <br></br>
              <br></br>
              <br></br>
              <br></br>
              {/* Render the current textarea */}
              <>
              </>
              {/* Render the "Next" button */}
              {/* <Button onClick={HandleClickGenerateTExtCombine}>Generate</Button> */}

              <Grid item md={12} sm={12} xs={12}>
                <br />
                <br />
                <Grid sx={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                  <LoadingButton sx={buttonStyles.buttonsubmit} loading={isBtn} variant="contained" onClick={handleSubmit}>
                    {" "}
                    SAVE
                  </LoadingButton>
                  <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                    {" "}
                    CLEAR
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Box>
          <br />
          <br />
        </>
      )
      }
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
    </Box >
  );
}
export default AddDocument;
