import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, OutlinedInput, Dialog, DialogContent, DialogActions, FormControl, Grid, Button } from "@mui/material";
import { userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import axios from "axios";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Selects from "react-select";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import DeleteIcon from "@mui/icons-material/Delete";
import { UserRoleAccessContext, AuthContext } from "../../context/Appcontext";
import { handleApiError } from "../../components/Errorhandling";
import { useNavigate } from "react-router-dom";
import Headtitle from "../../components/Headtitle";
import { FaPlus } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import AlertDialog from "../../components/Alert";
import PageHeading from "../../components/PageHeading";
import MessageAlert from "../../components/MessageAlert";

function AddReferenceCategoryDoc() {
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

  const { auth } = useContext(AuthContext);
  const { isUserRoleCompare, isUserRoleAccess, pageName,
    setPageName,
    buttonStyles, } = useContext(UserRoleAccessContext);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subCategoryOptions, setsSubCategoryOptions] = useState([]);
  const [findMatch, setFindMatch] = useState([]);
  const [refTodo, setRefTodo] = useState([])
  const [documentsList, setDocumentsList] = useState([]);
  const [isBtn, setIsBtn] = useState(false);
  const [checkDuplicate, setCheckDuplicate] = useState([])
  const [newDocuments, setNewDocuments] = useState({
    categoryname: { label: "Please Select Category", value: "Please Select Category" },
    subcategoryname: { label: "Please  Select SubCategory", value: "Please  Select SubCategory" },
    step: "STEP", name: "",
  });

  // Error
  const [showAlert, setShowAlert] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const handleClickOpenerr = () => { setIsErrorOpen(true); };
  const handleCloseerr = () => { setIsErrorOpen(false); };

  const username = isUserRoleAccess?.username;

  const fetchCategory = async () => {
    setPageName(!pageName)
    try {
      let response = await axios.get(`${SERVICE.REFCATEGORYDOCUMENT}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCategoryOptions([...response?.data?.doccategory?.map((t) => ({ ...t, label: t.categoryname, value: t.categoryname }))]);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const fetchSubCategory = async (e) => {
    setPageName(!pageName)
    try {
      let response = await axios.post(`${SERVICE.GET_SUBCAT}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        categoryname: String(e.value),
      });
      let subcatOpt = response?.data?.subcat
        ?.map((item) => {
          return item.subcategoryname.map((subcategory) => {
            return {
              label: subcategory,
              value: subcategory,
            };
          });
        })
        .flat();
      let addedAllTeam = [{ label: "ALL", value: "ALL" }, ...subcatOpt];
      setsSubCategoryOptions(addedAllTeam);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
      pagename: String("Reference / Add Reference Document"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),

      addedby: [
        {
          name: String(isUserRoleAccess?.companyname),
          date: String(new Date()),
        },
      ],
    });

  }
  //get all project.
  const fetchAllApprovedsData = async () => {
    setPageName(!pageName)
    try {
      let res_queue = await axios.get(SERVICE.ALL_REFDOCUMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDocumentsList(res_queue?.data.document);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //get all project.
  const fetchAllApproveds = async () => {
    setPageName(!pageName)
    try {
      let res_doc = await axios.get(SERVICE.ALL_REFDOCUMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let formattedWorkStationAdd = [];
      res_doc?.data.document?.forEach((data) => {
        data.referencetodo.forEach((todo) => {
          formattedWorkStationAdd.push(todo.name);
        });
      });

      setFindMatch(formattedWorkStationAdd);

    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  useEffect(() => {
    fetchCategory();
    fetchAllApproveds();
  }, []);
  useEffect(() => {
    fetchAllApprovedsData()
  }, []);

  // Submit states
  const handleCreateTodocheck = async () => {
    const nameDup = newDocuments.step == "" || newDocuments.name == "";
    if (newDocuments.step == "" || newDocuments.name == "") {

      setPopupContentMalert("Please Fill Name Field To Add Documents!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (!nameDup && refTodo?.some(data => data?.name === newDocuments?.name)) {
      setPopupContentMalert('Please Enter Different Name');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {

      if (newDocuments.step === "STEP") {
        setPageName(!pageName)
        try {

          let refTodoNo = refTodo.length + 1

          const newTodo = {
            no: refTodoNo,
            label: `${newDocuments.step} ${refTodoNo}`,
            name: newDocuments.name,
            documentstext: "",
            document: "",
          };


          await fetchAllApproveds();
          setRefTodo([...refTodo, newTodo]);
          setCheckDuplicate([...checkDuplicate, newTodo?.name]);
          setNewDocuments({
            ...newDocuments,
            categoryname: newDocuments?.categoryname,
            subcategoryname: newDocuments?.subcategoryname,
            step: "STEP",
            name: newDocuments.name,
          });
          setNewDocuments({ ...newDocuments, name: "" });
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
      }
    }
  };
  let refTodoNo = refTodo.length + 1
  const handleTodoDeleteAdd = (referenceIndex) => {

    let deleteIndex;
    const updatedTodos = refTodo?.filter((value, todoIndex) => {
      if (referenceIndex != todoIndex) {
        return value
      }
      else {
        if (refTodo[todoIndex + 1]) {
          deleteIndex = todoIndex;
        }
      }
      return false;
    });

    // Update the 'no' values in the remaining todos
    const updatedTodosWithNo = updatedTodos.map((todo, i) => {
      if (i >= deleteIndex) {
        const label = todo.label;
        const parts = label.split(/\s+/);

        // Extract "STEP" and "name"
        const step = parts[0];
        // const name = parts.slice(2).join(" ");

        return {
          ...todo,
          no: todo.no - 1,
          label: `${step} ${todo.no - 1}`,
          name: todo.name,
        };
      } else {
        return todo;
      }
    });

    setRefTodo(updatedTodosWithNo)
    // Filter out values from checkDuplicate that are not in updatedTodosWithNo
    const updatedNewValue = checkDuplicate.filter(value =>
      updatedTodosWithNo.some(data => data.name === value)
    );
    setCheckDuplicate(updatedNewValue)
  };

  async function multiDocumentsInputs(referenceIndex, reference, inputValue) {
    if (reference === "documents") {
      const updatedTodos = refTodo.map((value, index) => {
        if (referenceIndex === index) {
          return { ...value, documentstext: inputValue, document: "" };
        }
        return value;
      });
      setRefTodo(updatedTodos);

    }

    if (reference === "files") {
      const resume = inputValue.target.files[0];
      const updatedTodos = refTodo.map((value, index) => {
        if (referenceIndex === index) {
          return { ...value, documentstext: "", document: resume };
        }
        return value;
      });
      setRefTodo(updatedTodos);
    }
  }

  const handleFileDelete = (index, todoIndex) => {
    const updatedTodos = refTodo.map((value, i) => {
      if (todoIndex === i) {
        return { ...value, document: "" };
      }
      return value;
    });
    setRefTodo(updatedTodos);
  };

  const renderFilePreview = async (file) => {
    const pdfBlobUrl = URL.createObjectURL(file);
    window.open(pdfBlobUrl, "_blank");
  };

  const handleClear = () => {
    setNewDocuments({
      ...newDocuments,
      categoryname: { label: "Please Select Category", value: "Please Select Category" },
      subcategoryname: { label: "Please Select SubCategory", value: "Please  Select SubCategory" },
      step: "STEP",
      name: "",
    });
    setRefTodo([]);
    setCheckDuplicate([]);
    setsSubCategoryOptions([]);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  const backPage = useNavigate();


  const sendRequest = async () => {
    setIsBtn(true)
    const formData = new FormData();

    let referencetodo = refTodo;
    referencetodo.forEach((item, index) => {
      formData.append(`referencetodo[${index}][document]`, item.document);
      formData.append(`referencetodo[${index}][documentstext]`, item.documentstext);
      formData.append(`referencetodo[${index}][label]`, item.label);
      formData.append(`referencetodo[${index}][name]`, item.name);
      formData.append(`referencetodo[${index}][no]`, item.no);
    });

    formData.append(`categoryname`, newDocuments.categoryname.value || "");
    formData.append(`subcategoryname`, newDocuments.subcategoryname.value || "");
    formData.append(`step`, newDocuments.step || "");
    // formData.append(`categoryname`, newDocuments.categoryname.value);
    const addedBy = { name: String(isUserRoleAccess.companyname), date: String(new Date()) };
    Object.keys(addedBy).forEach(key => {
      formData.append(`addedby[0][${key}]`, addedBy[key]);
    });
    setPageName(!pageName)
    try {
      await axios.post(`${SERVICE.REFDOCUMENT_CREATE}`, formData, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchAllApproveds();
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      backPage("/listrefcategoryref");
      setNewDocuments({ ...newDocuments, step: "STEP", name: "", });
      setRefTodo([]);
      setCheckDuplicate([]);
      setIsBtn(false)
    } catch (err) { setIsBtn(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const handleSubmit = () => {
    const isNameMatch = documentsList.some((item) =>
      item.categoryname === newDocuments.categoryname.value
      && item.subcategoryname === newDocuments.subcategoryname.value
      && refTodo.some((data) => findMatch.includes(data.name))
    );


    const hasEmptyFields = refTodo.some(
      (d) => (d.documentstext === "" || d.documentstext === "<p><br></p>") && d.document === ""
    );

    if (newDocuments?.categoryname?.value === "Please Select Category") {
      setPopupContentMalert("Please Select Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();

    } else if (newDocuments?.subcategoryname?.value === "Please  Select SubCategory") {
      setPopupContentMalert("Please Select Sub Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (refTodo.length == 0) {
      setPopupContentMalert("Please Fill Name Field and Click Plus Button To Add Documents!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (hasEmptyFields) {
      setPopupContentMalert("Please Fill or Upload Documents!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (isNameMatch) {
      setPopupContentMalert("Data already exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      sendRequest();
      fetchAllApproveds();
    }
  };


  const handleChangeInput = (e) => {
    // Remove any numeric characters from the input value
    const newValue = e.target.value.replace(/[0-9]/g, "");
    setNewDocuments({ ...newDocuments, name: newValue });
  };

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

  return (
    <Box>
      <Headtitle title={"ADD REFERENCE DOCUMENTS"} />
      <PageHeading
        title="Reference Document"
        modulename="References"
        submodulename="Reference"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />
      {/* ****** Header Content ****** */}
      {isUserRoleCompare?.includes("areference") && (
        <>
          <Box sx={userStyle.dialogbox}>

            <Grid container spacing={2}>
              <Grid item md={12} sm={12} xs={12}>
                <Typography sx={userStyle.HeaderText}>Add Reference Document</Typography>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Category  <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    id="component-outlined"
                    type="text"
                    options={categoryOptions}
                    sx={{
                      overflow: 'visible',
                      '& .MuiPaper-root': {
                        overflow: 'visible',
                      },
                    }}
                    placeholder="Please Enter Category "
                    value={{ label: newDocuments?.categoryname?.label, value: newDocuments?.categoryname?.value }}
                    onChange={(e) => {
                      fetchSubCategory(e);
                      setNewDocuments({
                        ...newDocuments,
                        categoryname: {
                          label: e.label,
                          value: e.value,
                        },
                        subcategoryname: {
                          label: "Please  Select SubCategory",
                          value: "Please  Select SubCategory",
                        },
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Sub Category <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    id="component-outlined"
                    type="text"
                    sx={{
                      overflow: 'visible',
                      '& .MuiPaper-root': {
                        overflow: 'visible',
                      },
                    }}
                    options={subCategoryOptions}
                    value={{ label: newDocuments?.subcategoryname?.label, value: newDocuments?.subcategoryname?.value }}
                    placeholder="Please  Select SubCategory"
                    onChange={(e) => {
                      setNewDocuments({
                        ...newDocuments,
                        subcategoryname: {
                          label: e.label,
                          value: e.value,
                        },
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={2.5} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Step<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Please Enter Step"
                    value={newDocuments.step}
                  />
                </FormControl>
              </Grid>
              <Grid item md={2.5} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Name<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Please Enter Name"
                    value={newDocuments.name}
                    onChange={(e) => {
                      setNewDocuments({ ...newDocuments, name: e.target.value.toUpperCase() });
                      // handleChangeInput(e);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={1} sm={12} xs={12}>
                <Button
                  variant="contained"
                  style={{
                    height: '30px',
                    minWidth: '20px',
                    padding: '19px 13px',
                    color: 'white',
                    background: 'rgb(25, 118, 210)',
                    marginTop: "25px"
                  }}
                  onClick={() => { handleCreateTodocheck() }}
                >
                  <FaPlus style={{ fontSize: "15px" }} />
                </Button>
              </Grid>
              {refTodo?.slice()?.sort((a, b) => b.no - a.no)?.map((todo, index) => {
                return (
                  <Grid item md={12} sm={12} xs={12}>
                    <Grid container spacing={2} key={todo?.no - 1}>
                      <Grid item lg={1} md={1} sm={12} xs={12}>
                        <Typography> <b> Step </b> </Typography><br />
                        <Typography >{todo.label}</Typography><br></br>
                      </Grid>
                      <Grid item lg={2} md={2} sm={12} xs={12} >
                        <Typography> <b> Name </b> </Typography><br />
                        <Typography >{todo.name}</Typography><br></br>
                      </Grid>
                      {(todo.document === "" || todo.document === undefined) ? (
                        <Grid item lg={5} md={5} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography> <b> Documents </b>  </Typography><br />
                            <ReactQuill
                              style={{ height: "auto" }}
                              value={todo.documentstext}
                              onChange={(newValue) => { multiDocumentsInputs(todo?.no - 1, "documents", newValue); }}
                              modules={{
                                toolbar: [[{ header: "1" }, { header: "2" }, { font: [] }], [{ size: [] }], ["bold", "italic", "underline", "strike", "blockquote"], [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }], ["link", "image", "video"], ["clean"]],
                              }}
                              formats={["header", "font", "size", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "indent", "link", "image", "video"]}
                            />
                          </FormControl>
                        </Grid>
                      ) : null}
                      {(todo.documentstext === "" || todo.documentstext === "<p><br></p>") && !todo.document ? (
                        <Grid item lg={0.5} md={0.5} sm={12} xs={12}>
                          <Typography sx={{ marginTop: '93px' }}><b>(or)</b></Typography>
                        </Grid>
                      ) : null}
                      {(todo.documentstext === "" || todo.documentstext === "<p><br></p>") ? (
                        <Grid item lg={2.5} md={6} sm={12} xs={12}>
                          <Typography ><b>Upload Document</b></Typography>
                          <Grid marginTop={2}>
                            <Button variant="contained" size="small" component="label" sx={{ ...buttonStyles.buttonsubmit, "@media only screen and (max-width:550px)": { marginY: "5px" }, marginTop: '45px' }}>
                              Upload
                              <input
                                type="file"
                                id="resume"
                                accept=".xlsx, .xls, .csv, .pdf, .doc, .txt,"
                                name="file"
                                hidden
                                onChange={(e) => { multiDocumentsInputs(todo?.no - 1, "files", e); }}
                              />
                            </Button>
                            <br /><br />
                            {todo?.document?.name &&
                              <Grid container spacing={2}>
                                <Grid item lg={8} md={10} sm={10} xs={12}>
                                  <Typography>{todo?.document?.name}</Typography>
                                </Grid>
                                <Grid item lg={2} md={1} sm={1} xs={12}>
                                  <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreview(todo?.document)} />
                                </Grid>
                                <Grid item lg={2} md={1} sm={1} xs={12}>
                                  <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDelete(todo?.document, todo?.no - 1)}>
                                    <DeleteIcon />
                                  </Button>
                                </Grid>
                              </Grid>}
                            {/* ) */}
                            {/* })} */}
                          </Grid>
                        </Grid>
                      ) : null}
                      <Grid item lg={1} md={1} sm={12} xs={12} sx={{}}>
                        <Button variant="contained" color="error" type="button" onClick={() => handleTodoDeleteAdd(todo?.no - 1)} sx={{ height: "20px", minWidth: "15px", marginTop: "93px", padding: "6px 10px", fontSize: '12px' }}>
                          <AiOutlineClose />
                        </Button>
                      </Grid>
                    </Grid><br /> <br />
                  </Grid>
                )
              })}
              <Grid item md={12} sm={12} xs={12}>
                <Grid sx={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                  <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={handleSubmit} disabled={isBtn}>
                    {" "}
                    SAVE
                  </Button>
                  <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                    {" "}
                    CLEAR
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Box>
              <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
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
                    sx={buttonStyles.buttonsubmit}
                  >
                    ok
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </Box><br /><br />

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
        </>
      )}
    </Box >
  );
}
export default AddReferenceCategoryDoc;