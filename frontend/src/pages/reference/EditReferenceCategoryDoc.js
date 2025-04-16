import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, OutlinedInput, Dialog, DialogContent, DialogActions, FormControl, Grid, Button } from "@mui/material";
import { userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import { handleApiError } from "../../components/Errorhandling";
import axios from "axios";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { UserRoleAccessContext, AuthContext } from "../../context/Appcontext";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import "jspdf-autotable";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useParams } from "react-router-dom";
import Headtitle from "../../components/Headtitle";
import { FaPlus } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";

function EditReferenceCategoryDoc() {

  const { auth } = useContext(AuthContext);
  const { isUserRoleAccess } = useContext(UserRoleAccessContext);

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subCategoryOptions, setsSubCategoryOptions] = useState([]);
  const [findMatch, setFindMatch] = useState([]);
  const [refTodo, setRefTodo] = useState([])
  const [checkDuplicate, setCheckDuplicate] = useState([])
  const [singleDocument, setSingleDocument] = useState({});
  const [documentsList, setDocumentsList] = useState([]);

  // Error
  const [showAlert, setShowAlert] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const handleClickOpenerr = () => { setIsErrorOpen(true); };
  const handleCloseerr = () => { setIsErrorOpen(false); };

  const username = isUserRoleAccess?.username;
  let updateby = singleDocument.updatedby;

  let ids = useParams().id;

  const getinfoCode = async () => {
    try {
      let res = await axios.get(`${SERVICE.REFDOCUMENT_SINGLE}/${ids}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleDocument(res?.data.sdocument);
      setRefTodo(res?.data.sdocument.referencetodo);
      await fetchSubCategory(res?.data.sdocument.categoryname);
      setLoading(true);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //useEffect
  useEffect(() => {
    getinfoCode();
  }, [ids]);

  const fetchCategory = async () => {
    try {
      let response = await axios.get(`${SERVICE.REFCATEGORYDOCUMENT}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      setCategoryOptions([...response?.data?.doccategory?.map((t) => ({ ...t, label: t.categoryname, value: t.categoryname }))]);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  }
  const fetchSubCategory = async (e) => {
    try {
      let response = await axios.post(`${SERVICE.GET_SUBCAT}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }, categoryname: String(e)
      });
      let subcatOpt = response?.data?.subcat?.map(item => {
        return item.subcategoryname.map(subcategory => {
          return {
            label: subcategory,
            value: subcategory
          };
        });
      }).flat();
      let addedAllTeam = [{ label: "ALL", value: "ALL" }, ...subcatOpt];
      setsSubCategoryOptions(addedAllTeam);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //fetch teams
  const fetchAllApprovedsData = async () => {
    try {
      let res_queue = await axios.get(SERVICE.ALL_REFDOCUMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDocumentsList(res_queue?.data.document.filter((item) => item._id !== singleDocument._id));
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //get all project.
  const fetchAllApproveds = async () => {
    try {
      let res_queue = await axios.get(SERVICE.ALL_REFDOCUMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let result = res_queue?.data.document.filter((item) => item._id !== ids);
      let formattedWorkStationAdd = [];
      result?.forEach((data) => {
        data.referencetodo.forEach((todo) => {
          formattedWorkStationAdd.push(todo.name);
        });
      });
      setFindMatch(formattedWorkStationAdd);

   } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  useEffect(() => {
    fetchCategory();
    fetchAllApproveds();
    fetchAllApprovedsData()
  }, []);

  useEffect(() => {
    fetchAllApprovedsData()
  }, [singleDocument,documentsList]);

  // Submit states
  const handleCreateTodocheck = async () => {
    if (singleDocument.step == "" || singleDocument.name == "") {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Fill Name Field To Add Documents"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else {

      if (singleDocument.step == "STEP") {
        try {

          let refTodoNo = refTodo.length + 1

          const newTodo = {
            no: refTodoNo,
            label: `${singleDocument.step} ${refTodoNo}`,
            name: singleDocument.name,
            documentstext: "",
            document: [],
          };

          // if (findMatch.includes(newTodo?.name) || checkDuplicate.includes(newTodo?.name)) {
          //   setShowAlert(
          //     <>
          //       {" "}
          //       <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Name Already Exists!"} </p>{" "}
          //     </>
          //   );
          //   handleClickOpenerr();
          // }
          // else {
            await fetchAllApproveds();
            setRefTodo([...refTodo, newTodo]);
            setCheckDuplicate([...checkDuplicate, newTodo?.name]);
            setSingleDocument({
              ...singleDocument,
              categoryname: singleDocument?.categoryname,
              subcategoryname: singleDocument?.subcategoryname,
              step: "STEP",
              name: singleDocument.name,
            });
          } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
      }
    }
  };

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

        const step = parts[0];

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
          return { ...value, documentstext: inputValue, document: [] };
        }
        return value;
      });
      setRefTodo(updatedTodos);

    }

    if (reference === "files") {
      const resume = inputValue.target.files;

      // Convert FileList to array
      const resumeArray = Array.from(resume);


      // Function to read a file as a Data URL
      const readFileAsync = (file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(file);
        });
      };

      // Process files using Promise.all
      const fileReadingPromises = resumeArray.map((file) => readFileAsync(file));

      const dataUrls = await Promise.all(fileReadingPromises);

      // Create new files array
      const newFiles = resumeArray.map((file, index) => ({
        name: file.name,
        preview: dataUrls[index],
        data: dataUrls[index].split(",")[1],
        remark: "resume file",
      }));

      const updatedTodos = refTodo.map((value, index) => {
        if (referenceIndex === index) {
          return { ...value, documentstext: "", document: [...value.document, ...newFiles] };
        }
        return value;
      });
      setRefTodo(updatedTodos);
    }
  }

  const handleFileDelete = (index, todoIndex) => {
    const updatedTodos = refTodo.map((value, i) => {
      if (todoIndex === i) {
        const updatedDocuments = value.document.filter((_, j) => j !== index);
        return { ...value, document: updatedDocuments };
      }
      return value;
    });
    setRefTodo(updatedTodos);
  };

  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  const backPage = useNavigate();

  const sendRequest = async () => {
    try {
      let response = await axios.put(`${SERVICE.REFDOCUMENT_SINGLE}/${ids}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        categoryname: singleDocument.categoryname === String(singleDocument.categoryname) ? String(singleDocument.categoryname) : String(singleDocument.categoryname),
        subcategoryname: singleDocument.subcategoryname === String(singleDocument.subcategoryname) ? String(singleDocument.subcategoryname) : String(singleDocument.subcategoryname),
        step: String(singleDocument.step),
        referencetodo: [...refTodo],
        updatedby: [...updateby, { name: String(isUserRoleAccess.companyname), date: String(new Date()) }],
      });
      backPage("/listrefcategoryref");
      await fetchAllApprovedsData();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const handleSubmit = () => {
    fetchAllApprovedsData();
    const isNameMatch = documentsList.some((item) =>
      item.categoryname === singleDocument.categoryname
      && item.subcategoryname === singleDocument.subcategoryname
      && refTodo.some((data) => findMatch.includes(data.name))

    );


    const hasEmptyFields = refTodo.some(
      (d) => d.documentstext === "" && d.document.length === 0
    );

    if (singleDocument?.categoryname === "Please Select Category  Name") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Category"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (singleDocument?.subcategoryname === "Please Select SubCategory Name") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select  Sub Category"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (singleDocument.step === "" || singleDocument.name === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Name"}</p>
        </>
      );
      handleClickOpenerr();
    }
   
    else if (refTodo.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Fill Name Field and Click Plus Button To Add Documents"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (hasEmptyFields) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Upload Documents"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (isNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Data already exists!"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else {
      sendRequest();
      fetchAllApproveds();
    }
  };

  const handleChangeInput = (e) => {
    // Remove any numeric characters from the input value
    const newValue = e.target.value.replace(/[0-9]/g, "");
    setSingleDocument({ ...singleDocument, name: newValue });
  };

  return (
    <>
      <Headtitle title={"EDIT REFERENCE DOCUMENT"} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>Edit Reference Document</Typography>
      {!loading ? (
        <Box sx={userStyle.container}>
          <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
            <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
          </Box>
        </Box>
      ) : (
        <Box>
          {/* {isUserRoleCompare?.includes("ereferencecategory") && ( */}
          <Box sx={userStyle.container}>
            <Grid container spacing={2}>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Category Name <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    id="component-outlined"
                    type="text"
                    options={categoryOptions}
                    placeholder={singleDocument?.categoryname}
                    value={{ label: singleDocument.categoryname, value: singleDocument.categoryname }}
                    onChange={(e) => {
                      fetchSubCategory(e.value);
                      setSingleDocument({
                        ...singleDocument,
                        categoryname: e.value,
                        subcategoryname: "Please Select SubCategory Name",
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Sub Category Name <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    id="component-outlined"
                    type="text"
                    options={subCategoryOptions}
                    placeholder={singleDocument?.subcategoryname}
                    value={{ label: singleDocument.subcategoryname, value: singleDocument.subcategoryname }}
                    onChange={(e) => {
                      setSingleDocument({
                        ...singleDocument,
                        subcategoryname: e.value,
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
                    value={singleDocument.step}
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
                    value={singleDocument.name}
                    onChange={(e) => {
                      setSingleDocument({ ...singleDocument, name: e.target.value.toUpperCase() });
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
              {refTodo?.map((todo, index) => {
                return (
                  <Grid item md={12} sm={12} xs={12}>
                    <Grid container spacing={2} key={index}>
                      <Grid item lg={1} md={1} sm={12} xs={12}>
                        <Typography> <b> Step </b> </Typography><br />
                        <Typography >{todo.label}</Typography><br></br>
                      </Grid>
                      <Grid item lg={2} md={2} sm={12} xs={12} >
                        <Typography> <b> Name </b> </Typography><br />
                        <Typography >{todo.name}</Typography><br></br>
                      </Grid>
                      {todo.document.length === 0 ? (
                        <Grid item lg={5} md={5} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography> <b> Documents </b>  </Typography><br />
                            <ReactQuill
                              style={{ height: "auto" }}
                              value={todo.documentstext}
                              onChange={(newValue) => { multiDocumentsInputs(index, "documents", newValue); }}
                              modules={{
                                toolbar: [[{ header: "1" }, { header: "2" }, { font: [] }], [{ size: [] }], ["bold", "italic", "underline", "strike", "blockquote"], [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }], ["link", "image", "video"], ["clean"]],
                              }}
                              formats={["header", "font", "size", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "indent", "link", "image", "video"]}
                            />
                          </FormControl>
                        </Grid>
                      ) : null}
                      {todo.documentstext === "" && todo.document.length === 0 ? (
                        <Grid item lg={0.5} md={0.5} sm={12} xs={12}>
                          <Typography sx={{ marginTop: '93px' }}><b>(or)</b></Typography>
                        </Grid>
                      ) : null}
                      {todo.documentstext.length <= 11 ? (
                        <Grid item lg={2.5} md={2.5} sm={12} xs={12}>
                          <Typography ><b>Upload Document</b></Typography>
                          <Grid marginTop={2}>
                            <Button variant="contained" size="small" component="label" sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" }, marginTop: '45px' }}>
                              Upload
                              <input multiple
                                type="file"
                                id="resume"
                                accept=".xlsx, .xls, .csv, .pdf, .doc, .txt,"
                                name="file"
                                hidden
                                onChange={(e) => { multiDocumentsInputs(index, "files", e); }}
                              />
                            </Button>
                            <br /><br />
                            {todo.document?.map((file, docindex) => {
                              if (!file.name) return null;
                              return (
                                <Grid container spacing={2} key={docindex}>
                                  <Grid item lg={10} md={10} sm={10} xs={12}>
                                    <Typography>{file.name}</Typography>
                                  </Grid>
                                  <Grid item lg={1} md={1} sm={1} xs={12}>
                                    <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreview(file)} />
                                  </Grid>
                                  <Grid item lg={1} md={1} sm={1} xs={12}>
                                    <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDelete(docindex, index)}>
                                      <DeleteIcon />
                                    </Button>
                                  </Grid>
                                </Grid>
                              )
                            })}
                          </Grid>
                        </Grid>
                      ) : null}
                      <Grid item lg={1} md={1} sm={12} xs={12} sx={{}}>
                        <Button variant="contained" color="error" type="button" onClick={() => handleTodoDeleteAdd(index)} sx={{ height: "20px", minWidth: "15px", marginTop: "93px", padding: "6px 10px", fontSize: '12px' }}>
                          <AiOutlineClose />
                        </Button>
                      </Grid>
                    </Grid><br /> <br />
                  </Grid>
                )
              })}
              <Grid item md={12} sm={12} xs={12}>
                <br />
                <br />
                <Grid sx={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                  <Button variant="contained" onClick={handleSubmit}>
                    {" "}
                    Update
                  </Button>
                  <Button
                    sx={userStyle.btncancel}
                    onClick={() => {
                      backPage("/listrefcategoryref");
                    }}
                  >
                    Cancel
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
                  >
                    ok
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </Box>
          {/* )} */}
        </Box>
      )}
    </>
  );
}
export default EditReferenceCategoryDoc;