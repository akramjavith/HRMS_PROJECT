import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, OutlinedInput, Dialog, DialogContent, DialogActions, FormControl, Grid, Button } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from '../../../services/Baseservice';
import axios from "axios";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { UserRoleAccessContext, AuthContext } from '../../../context/Appcontext';
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import 'jspdf-autotable';
import { BASE_URL } from "../../../services/Authservice";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, useParams } from "react-router-dom";
import { handleApiError } from "../../../components/Errorhandling";
import AlertDialog from "../../../components/Alert";
import {
    DeleteConfirmation,
    PleaseSelectRow,
} from "../../../components/DeleteConfirmation.js";
import ExportData from "../../../components/ExportData";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert";

function EditDocument() {
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
        categoryname: { label: "Please Select Category Name", value: "Please Select Category Name" }, subcategoryname: { label: "Please Select SubCategory Name", value: "Please Select SubCategory Name" }, type: { label: "Please Select Type", value: "Please Select Type" }, module: "",
        customer: { label: "Please Select Customer", value: "Please Select Customer" }, queue: { label: "Please Select Queue", value: "Please Select Queue" }, process: { label: "Please Select Process", value: "Please Select Process" }, form: ""
    });
    const [fieldsShow, setFieldsShow] = useState(false);
    const [uploadShow, setUploadShow] = useState(false);
    const [textShow, setTextShow] = useState(false);
    const [documentFiles, setdocumentFiles] = useState([]);
    const [TextEditor, setTextEditor] = useState("");
    const [customeropt, setCustomerOptions] = useState([]);
    const [queueopt, setQueue] = useState([]);
    const [processOpt, setProcessOpt] = useState([]);
    const [subcatvalue, setSubcatvale] = useState();
    const handleTextSummary = (value) => {
        setTextEditor(value);
    };

    const backPage = useNavigate();
    const { auth, } = useContext(AuthContext);
    const {
        isUserRoleCompare,
        isUserRoleAccess,
        pageName,
        setPageName,
        buttonStyles,
    } = useContext(UserRoleAccessContext);
    const [showAlert, setShowAlert] = useState();
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [textAreas, setTextAreas] = useState([]);

    const [indexViewQuest, setIndexViewQuest] = useState(0);
    const [currentText, setCurrentText] = useState('');
    const handleNext = () => {
        // Add the currentText to the textAreas array
        const ans = textAreas.some(text => convertToNumberedList(text) === convertToNumberedList(currentText));
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

    const convertToNumberedList = (htmlContent) => {
        const tempElement = document.createElement("div");
        tempElement.innerHTML = htmlContent;

        const listItems = Array.from(tempElement.querySelectorAll("li"));
        listItems.forEach((li, index) => {
            li.innerHTML = `${index + 1}. ${li.innerHTML}\n`;
        });

        return tempElement.innerText;
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
            setIndexViewQuest(0);
        }


    };

    const handleEditTExtBox = (index, msg) => {
        textAreas[index] = msg;
    }


    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    const [typeCategory, setTypeCategory] = useState([])
    const [singleDocument, setSingleDocument] = useState({});
    const [typeValue, setTypeValue] = useState("");
    const [singleType, setSingleType] = useState("");

    let ids = useParams().id
    let origin = useParams().origin

    const getCode = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.DOCUMENT_SINGLE}/${ids}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setSingleDocument(res?.data?.sdocument);
            setTypeValue(res?.data?.sdocument?.type)
            setTextEditor(res?.data?.sdocument?.documentstext);
            setdocumentFiles(res?.data?.sdocument?.document);
            setSubcatvale(res?.data?.sdocument?.categoryname);
            setSingleType(res?.data?.sdocument?.type);
            setTextAreas(res?.data?.sdocument?.documentstext)
            setIndexViewQuest(res?.data?.sdocument?.documentstext?.length > 0 ? 1 : 0)
            setSelectedOptionsCatEdit(res?.data?.sdocument?.categoryname.map((item) => ({
                ...item,
                label: item,
                value: item,
            })))
            setSelectedOptionsSubcatEdit(res?.data?.sdocument?.subcategoryname.map((item) => ({
                ...item,
                label: item,
                value: item,
            })))
            setSelectedOptionsCusEdit(res?.data?.sdocument?.customer.map((item) => ({
                ...item,
                label: item,
                value: item,
            })))
            setSelectedOptionsQueEdit(res?.data?.sdocument?.queue.map((item) => ({
                ...item,
                label: item,
                value: item,
            })))
            setSelectedOptionsProEdit(res?.data?.sdocument?.process.map((item) => ({
                ...item,
                label: item,
                value: item,
            })))
            if (res?.data?.sdocument?.type !== "Quickclaim Document") {
                setFieldsShow(true)
                fetchTypeCategory(res?.data?.sdocument?.type)
                fetchSubCategoryType(res?.data?.sdocument?.type, res?.data?.sdocument?.categoryname)
            } else {
                fetchSubCategory([], res?.data?.sdocument?.categoryname)
                setFieldsShow(false)
            };
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    useEffect(() => {
        getCode()
    }, [ids])
    //Project updateby edit page...
    let updateby = singleDocument?.updatedby;

    const [typeSubCategory, setTypeSubCategory] = useState([])


    const fetchSubCategoryType = async (singleTypevalue, e) => {
        let employ = e.map((item) => item.value);
        setPageName(!pageName)
        try {
            let response = await axios.get(`${SERVICE.CATEGORYDOCUMENT}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let data_set = response?.data?.doccategory
                .filter((data) => {
                    return data?.typemastername?.includes(singleTypevalue) && employ.includes(data.categoryname);
                })
                .map((value) => value.subcategoryname).flat();

            console.log(data_set, 'data_set')
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


    const fetchTypeCategory = async (typevalue) => {
        setPageName(!pageName)
        try {
            let response = await axios.get(`${SERVICE.CATEGORYDOCUMENT}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            const resfilter = response?.data?.doccategory?.filter((data, index) => {
                return data?.typemastername?.includes(typevalue)
            })
            let data_set = resfilter.map((d) => d.categoryname)
            let filter_opt = [...new Set(data_set)];

            setTypeCategory(filter_opt.map((data) => ({
                ...data,
                label: data,
                value: data
            })))
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    const [categoryOptions, setCategoryOptions] = useState([]);
    const [subCategoryOptions, setsSubCategoryOptions] = useState([])
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
            setFieldsShow(true)
        } else {
            setFieldsShow(false)
        };
    };
    useEffect(() => {
        if (textAreas.length > 0) {
            setUploadShow(false)
            setdocumentFiles([])
        } else {
            setUploadShow(true)
        }
        if (documentFiles === null || documentFiles === undefined) {
            setTextShow(false)
            setTextAreas([])
        } else if (documentFiles) {
            setTextShow(true)
        }
        if (fieldsShow) {
            setSingleDocument({ ...singleDocument, customer: "", queue: "", process: "", form: "" })
        }
    }, [TextEditor, documentFiles, fieldsShow, textAreas])

    const fetchProcess = async () => {
        setPageName(!pageName)
        try {
            let response = await axios.get(`${SERVICE.EXCELMAPDATA}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            let data_set = response?.data?.excelmapdatas.map((d) => d.process)
            let filter_opt = [...new Set(data_set)];

            setProcessOpt(filter_opt.map((data) => ({
                ...data,
                label: data,
                value: data

            })))
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    useEffect(() => {
        fetchProcess()
    }, [])

    const handleResumeUpload = (event) => {
        const files = event.target.files[0]; // Convert FileList to an array
        setdocumentFiles(prevFiles => [...prevFiles, files]);// Set the array of files in state
    };

    const renderFilePreview = async (file) => {
        const { path } = file;
        if (path) {
            const url = `${BASE_URL}/${path}`; // Construct the URL based on your server setup
            window.open(url, "_blank");
        } else {
            const pdfBlobUrl = URL.createObjectURL(file);
            window.open(pdfBlobUrl, "_blank");
        }

    };
    const handleFileDelete = (index) => {
        setdocumentFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const fetchCategory = async () => {
        setPageName(!pageName)
        try {
            let response = await axios.get(`${SERVICE.CATEGORYEXCEL}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            let data_set = response.data.categoryexcel.map((d) => d.name)
            let filter_opt = [...new Set(data_set)];

            setCategoryOptions(filter_opt.map((data) => ({
                ...data,
                label: data,
                value: data

            })))
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    useEffect(() => {
        fetchCategory();

    }, [])

    // useEffect(() => {
    //     fetchSubCategory();
    // }, [subcatvalue])


    const fetchCustomer = async () => {
        setPageName(!pageName)
        try {
            let response = await axios.get(`${SERVICE.EXCELMAPDATA}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            let data_set = response?.data?.excelmapdatas.map((d) => d.customer)
            let filter_opt = [...new Set(data_set)];

            setCustomerOptions(filter_opt.map((data) => ({
                ...data,
                label: data,
                value: data

            })));
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    useEffect(() => {
        fetchCustomer()
    }, []);

    const fetchQueue = async () => {
        setPageName(!pageName)
        try {
            let response = await axios.get(`${SERVICE.QUEUE}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });

            let data_set = response?.data?.queues.map((d) => d.name)
            let filter_opt = [...new Set(data_set)];

            setQueue(filter_opt.map((data) => ({
                ...data,
                label: data,
                value: data

            })))
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    useEffect(() => {
        fetchQueue()
    }, []);

    const fetchSubCategory = async (e, category) => {

        setPageName(!pageName)
        try {
            let hel = e?.length === 0 ? category : e?.map((item) => item.value)
            let response = await axios.get(`${SERVICE.SUBCATEGORYEXCEL}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            console.log(e, 'e')
            let data_set = response?.data?.subcategoryexcel
                .filter((data) => {
                    return hel?.includes(data.categoryname);
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
            console.log(data_set, 'data_set')
            console.log(subcatall, 'subcatall')
            console.log(uniqueArray, 'uniqueArray')
            setsSubCategoryOptions(uniqueArray)
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    const sendRequest = async () => {
        let empcat = selectedOptionsCatEdit.map((item) => item.value);
        let empsub = selectedOptionsSubcatEdit.map((item) => item.value);
        let empcus = selectedOptionsCusEdit.map((item) => item.value);
        let empque = selectedOptionsQueEdit.map((item) => item.value);
        let emppro = selectedOptionsProEdit.map((item) => item.value);

        let result = empsub?.length == 0 ? ["ALL"] : empsub;
        const fileDocuments = documentFiles?.filter(data => !data?.path)
        const fileDocumentsPath = documentFiles?.filter(data => data?.path)?.map(data => data?.name)
        const formData = new FormData();
        fileDocuments.forEach(file => {
            formData.append('document', file);
        });
        empcat.forEach((value, index) => {
            formData.append(`categoryname[]`, value);
        });
        (singleDocument.module === "" ? result : [singleDocument.module]).forEach((value, index) => {
            formData.append(`module[]`, value);
        });
        fileDocumentsPath.forEach((value, index) => {
            formData.append(`documentsfile[]`, value);
        });
        empcus.forEach((value, index) => {
            formData.append(`customer[]`, value);
        });
        emppro.forEach((value, index) => {
            formData.append(`process[]`, value);
        });
        empque.forEach((value, index) => {
            formData.append(`queue[]`, value);
        });
        textAreas.forEach((value, index) => {
            formData.append(`documentstext[]`, value);
        });
        // formData.append('documentsfile', [...fileDocumentsPath]);
        formData.append('subcategoryname', [...result]);
        formData.append('type', singleDocument.type === String(singleDocument.type) ? String(singleDocument.type) : String(singleDocument.type.value));
        // formData.append('module', singleDocument.module === "" ? [...result] : String(singleDocument.module));
        // formData.append('customer', singleDocument.type.value !== "Quickclaim Document" ? "" : [...empcus]);
        // formData.append('process', singleDocument.type.value !== "Quickclaim Document" ? "" : [...emppro]);
        // formData.append('queue', singleDocument.type.value !== "Quickclaim Document" ? "" : [...empque]);
        formData.append('form', newDocuments.type.value !== "Quickclaim Document" ? "" : String(singleDocument.form));
        // formData.append('documentstext', [...textAreas]);
        const updatedby = [...updateby, { name: String(isUserRoleAccess.companyname), date: String(new Date()) }];
        updatedby.forEach((entry, index) => {
            Object.keys(entry).forEach(key => {
                formData.append(`updatedby[${index}][${key}]`, entry[key]);
            });
        });
        setPageName(!pageName)
        try {
            let response = await axios.put(`${SERVICE.DOCUMENT_SINGLE}/${ids}`, formData, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            })
            setNewDocuments({
                ...newDocuments, categoryname: { label: "Please Select Category Name", value: "Please Select Category Name" }, subcategoryname: { label: "Please Select SubCategory Name", value: "Please Select SubCategory Name" }, type: { label: "Please Select Type", value: "Please Select Type" }, module: "",
                customer: { label: "Please Select Customer", value: "Please Select Customer" }, queue: { label: "Please Select Queue", value: "Please Select Queue" }, process: { label: "Please Select Process", value: "Please Select Process" }, form: ""
            })
            setTextEditor("");
            setdocumentFiles([]);
            if (origin === "overalldocumentlist") {
                backPage('/overalllistdocument');
            } else {
                backPage('/listdocument');
            }
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    const handleSubmit = () => {

        if (typeValue === "Please Select Type" || typeValue === undefined || typeValue === "") {
            setPopupContentMalert("Please Select Type!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();

        }

        else if (selectedOptionsCatEdit.length == 0) {
            setPopupContentMalert("Please Select Category Name!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();

        }
        else if (selectedOptionsSubcatEdit?.length == 0) {
            setPopupContentMalert("Please Select SubCategory Name!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();

        } else if (typeValue === "Quickclaim Document" && selectedOptionsCusEdit.length == 0) {
            setPopupContentMalert("Please Select Customer!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();

        }
        else if (typeValue === "Quickclaim Document" && selectedOptionsQueEdit.length == 0) {
            setPopupContentMalert("Please Select Queue!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();

        }
        else if (typeValue === "Quickclaim Document" && selectedOptionsProEdit.length == 0) {
            setPopupContentMalert("Please Select Process!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (typeValue === "Quickclaim Document" && singleDocument?.form === "") {
            setPopupContentMalert("Please Enter Form!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();

        }
        else if (typeValue === "Quickclaim Document" && selectedOptionsCusEdit.length == 0) {
            setPopupContentMalert("Please Select Customer!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();

        }
        else if (typeValue === "Quickclaim Document" && selectedOptionsQueEdit.length == 0) {
            setPopupContentMalert("Please Select Queue!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();

        }


        else if (typeValue === "Quickclaim Document" && singleDocument?.form === "") {
            setPopupContentMalert("Please Enter Form!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();

        }
        else if (documentFiles?.length === 0 && textAreas?.every(item => item === '' || item === "<p><br></p>")) {
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
            sendRequest()
        }
    }

    const handleChangeInput = (e) => {
        const newValue = e.target.value.replace(/[0-9]/g, '');
        setSingleDocument({ ...singleDocument, module: newValue });
    };

    // Edit functionlity
    // Categoryname multiselect
    const [selectedOptionsCatEdit, setSelectedOptionsCatEdit] = useState([]);
    let [valueCatEdit, setValueCatEdit] = useState("");

    const handleCategoryChangeEdit = (options) => {
        setValueCatEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCatEdit(options);
    };

    const customValueRendererCatEdit = (valueCatEdit, _categoryname) => {
        return valueCatEdit.length ? valueCatEdit.map(({ label }) => label).join(", ") : "Please Select Category Name";
    };

    // Subcatgeoryname multiselect
    const [selectedOptionsSubcatEdit, setSelectedOptionsSubcatEdit] = useState([{ label: "ALL", value: "ALL" }]);

    const handleSubcategoryChangeEdit = (options) => {
        setSelectedOptionsSubcatEdit(options);
    };

    const customValueRendererSubcatEdit = (valueSubcatEdit, _subcategoryname) => {
        return valueSubcatEdit.length ? valueSubcatEdit.map(({ label }) => label).join(", ") : "Please Select SubCategory Name";
    };


    // Customer multiselect
    const [selectedOptionsCusEdit, setSelectedOptionsCusEdit] = useState([]);
    let [valueCusEdit, setValueCusEdit] = useState("");

    const handleCustomerChangeEdit = (options) => {
        setValueCusEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCusEdit(options);
    };

    const customValueRendererCusEdit = (valueCusEdit, _customer) => {
        return valueCusEdit.length ? valueCusEdit.map(({ label }) => label).join(", ") : "Please Select Customer";
    };


    // queue multiselect
    const [selectedOptionsQueEdit, setSelectedOptionsQueEdit] = useState([]);
    let [valueQueEdit, setValueQueEdit] = useState("");

    const handleQueueChangeEdit = (options) => {
        setValueQueEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsQueEdit(options);
    };

    const customValueRendererQueEdit = (valueCusEdit, _queue) => {
        return valueCusEdit.length ? valueCusEdit.map(({ label }) => label).join(", ") : "Please Select Queue";
    };

    // process multiselect
    const [selectedOptionsProEdit, setSelectedOptionsProEdit] = useState([]);
    let [valueProEdit, setValueProEdit] = useState("");

    const handleProcessChangeEdit = (options) => {
        setValueProEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsProEdit(options);
    };

    const customValueRendererProEdit = (valueProEdit, _process) => {
        return valueProEdit.length ? valueProEdit.map(({ label }) => label).join(", ") : "Please Select Process";
    };


    return (
        <Box>
            <Box sx={userStyle.container}>
                <Grid container spacing={2} >
                    <Grid item md={12} sm={12} xs={12}>
                        <Typography sx={userStyle.HeaderText}>Edit Document </Typography>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12} >
                        <FormControl fullWidth size="small">
                            <Typography>Type<b style={{ color: "red" }}>*</b></Typography>
                            <Selects
                                id="component-outlined"
                                type="text"
                                placeholder={singleDocument?.type}
                                options={OptionsType}
                                onChange={(e) => {
                                    setSingleType(e.value)
                                    setTypeValue(e.value)
                                    fetchTypeCategory(e.value)
                                    showDocument(e)
                                    setSingleDocument({
                                        ...singleDocument,
                                        type: {
                                            label: e.label,
                                            value: e.value
                                        },

                                    }, setSelectedOptionsCatEdit([]), setSelectedOptionsSubcatEdit([]), setSelectedOptionsCusEdit([]), setSelectedOptionsQueEdit([]),
                                        setSelectedOptionsProEdit([]));
                                }
                                }


                            />
                        </FormControl>

                    </Grid>
                    <Grid item md={3} sm={12} xs={12} >
                        <FormControl fullWidth size="small">
                            <Typography>Category  Name <b style={{ color: "red" }}>*</b></Typography>
                            <MultiSelect
                                options={singleType !== "Quickclaim Document" ? typeCategory : categoryOptions}
                                value={selectedOptionsCatEdit}
                                onChange={(e) => {
                                    handleCategoryChangeEdit(e);
                                    singleType !== "Quickclaim Document" ? fetchSubCategoryType(singleType, e) : fetchSubCategory(e);
                                    setSelectedOptionsSubcatEdit([]);
                                }}
                                valueRenderer={customValueRendererCatEdit}
                                labelledBy="Please Select Category Name"
                            />
                        </FormControl>

                    </Grid>
                    <Grid item md={3} sm={12} xs={12} >
                        <FormControl fullWidth size="small">
                            <Typography>Sub  Category  Name <b style={{ color: "red" }}>*</b></Typography>
                            <MultiSelect
                                options={
                                    singleDocument?.type &&
                                        singleDocument.type.label === "Quickclaim Document"
                                        ? subCategoryOptions : typeSubCategory

                                }
                                value={selectedOptionsSubcatEdit}
                                onChange={handleSubcategoryChangeEdit}
                                valueRenderer={customValueRendererSubcatEdit}
                                labelledBy="Please Select SubCategory Name"
                            // className="scrollable-multiselect"
                            />
                        </FormControl>

                    </Grid>
                    <Grid item md={3} sm={12} xs={12} >
                        <FormControl fullWidth size="small">
                            <Typography>Module</Typography>
                            <OutlinedInput
                                id="component-outlined"
                                type="text"
                                placeholder="Please Enter Module"
                                value={singleDocument.module}
                                onChange={(e) => {
                                    setSingleDocument({ ...singleDocument, module: e.target.value }); handleChangeInput(e)
                                }}

                            />
                        </FormControl>
                    </Grid>
                    {/* next grdi */}

                    {!fieldsShow ?
                        <>
                            <Grid item md={3} sm={12} xs={12} >
                                <FormControl fullWidth size="small">
                                    <Typography>Customer<b style={{ color: "red" }}>*</b></Typography>
                                    <MultiSelect
                                        placeholder={singleDocument.customer}
                                        options={customeropt}
                                        value={selectedOptionsCusEdit}
                                        onChange={handleCustomerChangeEdit}
                                        valueRenderer={customValueRendererCusEdit}
                                        labelledBy="Please Select Customer"
                                    // className="scrollable-multiselect"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12} >
                                <FormControl fullWidth size="small">
                                    <Typography> Queue<b style={{ color: "red" }}>*</b></Typography>
                                    <MultiSelect
                                        placeholder={singleDocument.queue}
                                        options={queueopt}
                                        value={selectedOptionsQueEdit}
                                        onChange={handleQueueChangeEdit}
                                        valueRenderer={customValueRendererQueEdit}
                                        labelledBy="Please Select Queue"
                                    // className="scrollable-multiselect"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12} >
                                <FormControl fullWidth size="small">
                                    <Typography>Process<b style={{ color: "red" }}>*</b></Typography>
                                    <MultiSelect
                                        placeholder={singleDocument.process}
                                        options={processOpt}
                                        value={selectedOptionsProEdit}
                                        onChange={handleProcessChangeEdit}
                                        valueRenderer={customValueRendererProEdit}
                                        labelledBy="f"
                                    // className="scrollable-multiselect"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12} >
                                <FormControl fullWidth size="small">
                                    <Typography>Form<b style={{ color: "red" }}>*</b></Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Please Enter Form"
                                        value={singleDocument.form}
                                        onChange={(e) => {
                                            setSingleDocument({ ...singleDocument, form: e.target.value });
                                        }}

                                    />
                                </FormControl>
                            </Grid>
                        </> : null
                    }

                    {textShow ?
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
                        : null}
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
                                                    <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
                                                </Button>

                                            </Grid>
                                        </Grid>
                                    </FormControl>

                                </Grid>
                            )
                        }
                    }
                    )}
                    {uploadShow ?
                        <>
                            <Grid item md={12} sm={12} xs={12}>
                                <br /> <br /> <br /> <br />
                                <Typography variant="h6">Upload Document</Typography>
                                <Grid marginTop={2} >
                                    <Button variant="contained" size="small" component="label" sx={{ ...buttonStyles.buttonsubmit, "@media only screen and (max-width:550px)": { marginY: '5px', } }} >
                                        Upload
                                        <input type='file' id="resume"
                                            accept=".xlsx, .xls, .csv, .pdf, .txt,"
                                            name='file' hidden onChange={(e) => { handleResumeUpload(e); setTextEditor("") }}
                                        />
                                    </Button>
                                    <br /><br />
                                    {documentFiles?.length > 0 &&
                                        documentFiles?.map((data, index) => { // Use map instead of forEach

                                            return (
                                                <Grid container spacing={2} key={index}> {/* Use key prop for each item */}
                                                    <Grid item lg={3} md={3} sm={6} xs={6}>
                                                        <Typography>{data.name}</Typography> {/* Display the file name */}
                                                    </Grid>
                                                    <Grid item lg={1} md={1} sm={1} xs={1}>
                                                        <VisibilityOutlinedIcon
                                                            sx={{ ...buttonStyles.buttonview, fontSize: "large", cursor: "pointer" }}
                                                            onClick={() => renderFilePreview(data)}
                                                        />
                                                    </Grid>
                                                    <Grid item lg={1} md={1} sm={1} xs={1}>
                                                        <Button
                                                            sx={{ fontSize: "large", cursor: "pointer", marginTop: "-5px" }}
                                                            onClick={() => handleFileDelete(index)}
                                                        >
                                                            <DeleteIcon sx={buttonStyles.buttondelete} />
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            );
                                        })}
                                </Grid>

                            </Grid>
                        </> : null
                    }

                    <Grid item md={12} sm={12} xs={12}  >
                        <br />
                        <br />
                        <Grid sx={{ display: 'flex', justifyContent: 'center', gap: "15px" }}>
                            <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={handleSubmit}> Update</Button>
                            {origin === "overalldocumentlist" ? <><Button sx={buttonStyles.btncancel} onClick={() => { backPage('/overalllistdocument') }}>Cancel</Button></>
                                : <><Button sx={buttonStyles.btncancel} onClick={() => { backPage('/listdocument') }}>Cancel</Button></>}

                        </Grid>
                    </Grid>
                </Grid>

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




        </Box>
    )
}
export default EditDocument;
