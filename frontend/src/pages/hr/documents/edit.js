import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, OutlinedInput, Dialog, DialogContent, DialogActions, FormControl, Grid, Button } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from '../../../services/Baseservice';
import axios from "axios";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { UserRoleAccessContext, AuthContext } from '../../../context/Appcontext';
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import 'jspdf-autotable';
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, useParams } from "react-router-dom";
import { handleApiError } from "../../../components/Errorhandling";

function EditDocument() {

    const [newDocuments, setNewDocuments] = useState({
        categoryname: { label: "Please Select Category Name", value: "Please Select Category Name" }, subcategoryname: { label: "Please Select SubCategory Name", value: "Please Select SubCategory Name" }, type: { label: "Please Select Type", value: "Please Select Type" }, module: "",
        customer: { label: "Please Select Customer", value: "Please Select Customer" }, queue: { label: "Please Select Queue", value: "Please Select Queue" }, process:  { label: "Please Select Process", value: "Please Select Process" }, form: ""
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
    const { isUserRoleAccess } = useContext(UserRoleAccessContext);
    const [showAlert, setShowAlert] = useState();
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [textAreas, setTextAreas] = useState([]);
    const [indexViewQuest, setIndexViewQuest] = useState(1);
    const [currentText, setCurrentText] = useState('');
    const handleNext = () => {
        // Add the currentText to the textAreas array
        const ans = textAreas.some(text => convertToNumberedList(text) === convertToNumberedList(currentText));
        if (currentText === "" || currentText === "<p><br></p>") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Any Description"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (ans) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Already Added"}</p>
                </>
            );
            handleClickOpenerr();
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
    const [singleType, setSingleType] = useState();

    let ids = useParams().id
    let origin = useParams().origin

    const getCode = async () => {
        try {
            let res = await axios.get(`${SERVICE.DOCUMENT_SINGLE}/${ids}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setSingleDocument(res?.data?.sdocument);
            setTextEditor(res?.data?.sdocument?.documentstext);
            setdocumentFiles(res?.data?.sdocument?.document);
            setSubcatvale(res?.data?.sdocument?.categoryname);
            setSingleType(res?.data?.sdocument?.type);
            setTextAreas(res?.data?.sdocument?.documentstext)
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
            if (res?.data?.sdocument?.type === "Policy Document") {
                setFieldsShow(true)
            } else {
                setFieldsShow(false)
            };
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };
    useEffect(() => {
        getCode()
    }, [ids])
    //Project updateby edit page...
    let updateby = singleDocument?.updatedby;

    const [typeSubCategory, setTypeSubCategory] = useState([])


    const fetchSubCategoryType = async (e) => {
        let employ = e.map((item) => item.value);
        try {
            let response = await axios.get(`${SERVICE.CATEGORYDOCUMENT}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let data_set = response?.data?.doccategory
                .filter((data) => {
                    return employ.includes(data.categoryname);
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
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    const fetchTypeCategory = async () => {
        try {
            let response = await axios.get(`${SERVICE.CATEGORYDOCUMENT}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });

            let data_set = response?.data?.doccategory.map((d) => d.categoryname)
            let filter_opt = [...new Set(data_set)];

            setTypeCategory(filter_opt.map((data) => ({
                ...data,
                label: data,
                value: data
            })))
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }


    useEffect(() => {
        fetchTypeCategory()
    }, [])



    const [categoryOptions, setCategoryOptions] = useState([]);
    const [subCategoryOptions, setsSubCategoryOptions] = useState([])
    const OptionsType = [
        { value: "Training Document", label: "Training Document" },
        { value: "Policy Document", label: "Policy Document" },
    ];
    const showDocument = (e) => {
        if (e.value === "Policy Document") {
            setFieldsShow(true)
        } else {
            setFieldsShow(false)
        };
    };
    useEffect(() => {
        if (textAreas.length > 0) {
            setUploadShow(false)
        } else {
            setUploadShow(true)
        }
        if (documentFiles.length !== 0) {
            setTextShow(false)
        } else if (documentFiles.length === 0) {
            setTextShow(true)
        }
        if (fieldsShow) {
            setSingleDocument({ ...singleDocument, customer: "", queue: "", process: "", form: "" })
        }
    }, [TextEditor, documentFiles, fieldsShow, textAreas])

    const fetchProcess = async () => {
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
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    useEffect(() => {
        fetchProcess()
    }, [])

    const handleResumeUpload = (event) => {
        const resume = event.target.files;
            const reader = new FileReader();
            const file = resume[0];
            reader.readAsDataURL(file);
            reader.onload = () => {
                setdocumentFiles((prevFiles) => [
                    ...prevFiles,
                    { name: file.name, preview: reader.result, data: reader.result.split(",")[1], remark: "resume file" },
                ]);
            };
    };

    const renderFilePreview = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };
    const handleFileDelete = (index) => {
        setdocumentFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const fetchCategory = async () => {
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
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    useEffect(() => {
        fetchCategory();

    }, [])

    useEffect(() => {
        fetchSubCategory();
    }, [subcatvalue])


    const fetchCustomer = async () => {
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
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    useEffect(() => {
        fetchCustomer()
    }, []);

    const fetchQueue = async () => {
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
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    useEffect(() => {
        fetchQueue()
    }, []);
 
    const fetchSubCategory = async (e) => {
        let hel = e ? e?.map((item) => item.value) : subcatvalue
        try {
            let response = await axios.get(`${SERVICE.SUBCATEGORYEXCEL}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
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

            setsSubCategoryOptions(uniqueArray)
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    const sendRequest = async () => {
        let empcat = selectedOptionsCatEdit.map((item) => item.value);
        let empsub = selectedOptionsSubcatEdit.map((item) => item.value);
        let empcus = selectedOptionsCusEdit.map((item) => item.value);
        let empque = selectedOptionsQueEdit.map((item) => item.value);
        let emppro = selectedOptionsProEdit.map((item) => item.value);

        let result = empsub?.length == 0 ? ["ALL"] : empsub;
        try {
            let response = await axios.put(`${SERVICE.DOCUMENT_SINGLE}/${ids}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                categoryname: [...empcat],
                subcategoryname: [...result],
                type: singleDocument.type === String(singleDocument.type) ? String(singleDocument.type) : String(singleDocument.type.value),
                module: singleDocument.module === "" ?  [...result] : String(singleDocument.module),
                customer: singleDocument.type.value === "Policy Document" ? "" : [...empcus],
                queue: singleDocument.type.value === "Policy Document" ? "" : [...empque],
                process: singleDocument.type.value === "Policy Document" ? "" : [...emppro],
                form: newDocuments.type.value === "Policy Document" ? "" : String(singleDocument.form),
                document: [...documentFiles],
                documentstext: [...textAreas],
                updatedby: [
                    ...updateby, {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            })
            setNewDocuments({
                ...newDocuments, categoryname: { label: "Please Select Category Name", value: "Please Select Category Name" }, subcategoryname: { label: "Please Select SubCategory Name", value: "Please Select SubCategory Name" }, type: { label: "Please Select Type", value: "Please Select Type" }, module: "",
                customer: { label: "Please Select Customer", value: "Please Select Customer" }, queue: { label: "Please Select Queue", value: "Please Select Queue" }, process: { label: "Please Select Process", value: "Please Select Process" }, form: ""
            })
            setTextEditor("");
            setdocumentFiles([]);
            if (origin === "overalldocumentlist"){
                backPage('/overalllistdocument');
            }else {
                backPage('/listdocument');
            }
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
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    const handleSubmit = () => {

        if (singleDocument?.type?.value === "Please Select Type") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Type"}</p>
                </>
            );
            handleClickOpenerr();

        }

       else if (selectedOptionsCatEdit.length == 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Category Name"}</p>
                </>
            );
            handleClickOpenerr();

        }
        else if (selectedOptionsSubcatEdit?.length == 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select SubCategory Name"}</p>
                </>
            );
            handleClickOpenerr();

        }else if (singleDocument?.type?.value === "Training Document" && selectedOptionsCusEdit.length == 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Customer"}</p>
                </>
            );
            handleClickOpenerr();

        }
        else if (singleDocument?.type?.value === "Training Document" && selectedOptionsQueEdit.length == 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Queue"}</p>
                </>
            );
            handleClickOpenerr();

        }
        else if (singleDocument?.type?.value === "Training Document" && selectedOptionsProEdit.length == 0) {
            setShowAlert(
              <>
                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Process"}</p>
              </>
            );
            handleClickOpenerr();
          } 
        else if (singleDocument?.type === "Training Document" && singleDocument?.form === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Enter Form"}</p>
                </>
            );
            handleClickOpenerr();

        }

        else if (singleDocument?.type?.value === "Training Document" && selectedOptionsProEdit.length == 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Process"}</p>
                </>
            );
            handleClickOpenerr();

        }
        else if (singleDocument?.type?.value === "Training Document" && singleDocument?.form === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Enter Form"}</p>
                </>
            );
            handleClickOpenerr();

        }
        else if (singleDocument?.type?.value === "Training Document" && singleDocument?.form === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Enter Form"}</p>
                </>
            );
            handleClickOpenerr();

        }
        else if (documentFiles.length === 0 && TextEditor === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Enter or Upload Docments"}</p>
                </>
            );
            handleClickOpenerr();

        }
        else if (currentText  && currentText !== "<p><br></p>") {
            setShowAlert(
              <>
                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Add the Documents"}</p>
              </>
            );
            handleClickOpenerr();
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
                                options={singleType === "Policy Document" ? typeCategory : categoryOptions}
                                value={selectedOptionsCatEdit}
                                onChange={(e) => {
                                    handleCategoryChangeEdit(e);
                                    fetchSubCategoryType(e);
                                    fetchSubCategory(e);
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
                                        singleDocument.type.label === "Policy Document"
                                        ? typeSubCategory
                                        : subCategoryOptions
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
                                        labelledBy="Please Select Process"
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
                                    <Button variant="contained" size="small" component="label" sx={{ "@media only screen and (max-width:550px)": { marginY: '5px', } }} >
                                        Upload
                                        <input type='file' id="resume"
                                            accept=".xlsx, .xls, .csv, .pdf, .txt,"
                                            name='file' hidden onChange={(e) => { handleResumeUpload(e); setTextEditor("") }}
                                        />
                                    </Button>
                                    <br /><br />
                                    {documentFiles?.length > 0 &&
                                        (documentFiles.map((file, index) => (
                                            <>
                                                <Grid container spacing={2} >
                                                    <Grid item lg={3} md={3} sm={6} xs={6}>
                                                        <Typography>{file.name}</Typography>
                                                    </Grid>
                                                    <Grid item lg={1} md={1} sm={1} xs={1}>
                                                        <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreview(file)} />
                                                    </Grid>
                                                    <Grid item lg={1} md={1} sm={1} xs={1}>
                                                        <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDelete(index)}><DeleteIcon /></Button>

                                                    </Grid>
                                                </Grid>
                                            </>
                                        )))}
                                </Grid>

                            </Grid>
                        </> : null
                    }

                    <Grid item md={12} sm={12} xs={12}  >
                        <br />
                        <br />
                        <Grid sx={{ display: 'flex', justifyContent: 'center', gap: "15px" }}>
                            <Button variant="contained" onClick={handleSubmit}> Update</Button>
                            {origin === "overalldocumentlist" ?<><Button sx={userStyle.btncancel} onClick={() => { backPage('/overalllistdocument') }}>Cancel</Button></>
                            :<><Button sx={userStyle.btncancel} onClick={() => { backPage('/listdocument') }}>Cancel</Button></>}
                            
                        </Grid>
                    </Grid>
                </Grid>
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
                            <Button variant="contained" style={{
                                padding: '7px 13px',
                                color: 'white',
                                background: 'rgb(25, 118, 210)'
                            }} onClick={handleCloseerr}>
                                ok
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>

            </Box>
        </Box>
    )
}
export default EditDocument;
