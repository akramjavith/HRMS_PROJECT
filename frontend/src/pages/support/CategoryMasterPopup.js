import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  OutlinedInput,
  Typography,
} from "@mui/material";
import axios from "axios";
import "jspdf-autotable";
import React, { useContext, useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";
import AlertDialog from "../../components/Alert";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import MessageAlert from "../../components/MessageAlert";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";

function CategoryMasterPopup({
  setStockCategoryAuto,
  handleCloseviewalertstockcategory,
}) {
  let newval = "PR0001";

  const [cateCode, setCatCode] = useState([]);
  const [category, setCategory] = useState({ categoryname: "" });
  const [subCategoryTodo, setSubcategoryTodo] = useState([]);
  const [subcategory, setSubcategory] = useState("");
  const [isFirstSubCateView, setIsFirstSubCateView] = useState(false);

  const [btnSubmit, setBtnSubmit] = useState(false);
  const [btnSubmitEdit, setBtnSubmitEdit] = useState(false);

  const [categoryMasterList, setCategoryMasterList] = useState([]);

  const { auth, setAuth } = useContext(AuthContext);
  const [singleCategory, setSingleCategory] = useState({});
  const [editTodo, setEditTodo] = useState([]);

  const [subDuplicate, setSubDuplicate] = useState([]);

  const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
  const username = isUserRoleAccess?.companyname;

  const [showAlert, setShowAlert] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const handleClickOpenerr = () => {
    setBtnSubmit(false);
    setBtnSubmitEdit(false);
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

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


  const getCategory = async () => {
    setPageName(!pageName)
    try {
      let response = await axios.get(`${SERVICE.CATEGORYMASTERGETALL}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCatCode(response.data.categorymaster);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("CategoryMasterPopup"),
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

  useEffect(() => {
    getapi();
    getCategory();
  }, []);

  console.log(username)

  const sendRequest = async () => {
    console.log("send")
    const subcategoryName =
      subCategoryTodo.length === 0 ? subcategory : [...subCategoryTodo];
    setPageName(!pageName)
    try {
      let res_queue = await axios.post(SERVICE.CATEGORYMASTER_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        categoryname: String(category.categoryname),
        categorycode: String(newval),
        subcategoryname: subcategoryName,
        addedby: [
          {
            name: String(username),
            date: String(new Date()),
          },
        ],
      });
      setSubcategoryTodo([]);
      setStockCategoryAuto("none");
      setSubcategory("");
      setCategory({ ...category, categoryname: "" });
      setBtnSubmit(false);
  
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      await getCategoryMaster();
      await getCategory();
      handleCloseviewalertstockcategory();
    } catch (err) { 
      console.log(err)
      handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const handleClear = () => {
    setSubcategoryTodo([]);
    setSubcategory("");
    setCategory({ ...category, categoryname: "" });
  
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  const getCategoryMaster = async () => {
    setPageName(!pageName)
    try {
      let response = await axios.get(`${SERVICE.CATEGORYMASTERGETALL}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCategoryMasterList(response.data.categorymaster);
      // setEditDuplicate(response.data.doccategory.filter(data => data._id !== singleCategory._id));
      setSubDuplicate(
        response.data.categorymaster.filter(
          (data) => data._id !== singleCategory._id
        )
      );
      setCatCode(response.data.categorymaster);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  useEffect(() => {
    getCategoryMaster();
  }, []);

  const addTodo = () => {
    getCategoryMaster();
    const isSubNameMatch = subCategoryTodo.some(
      (item) => item?.toLowerCase() === subcategory?.toLowerCase()
    );
    // const isSubNameMatch = categorySubcategoryList.some((item) => item.subcategoryname.includes(subcategory));

    if (subcategory === "") {
 
      setPopupContentMalert("Please Enter Subcategory");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isSubNameMatch) {

      setPopupContentMalert("Already Added ! Please Enter Another Subcategory");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }

    else {
      setSubcategoryTodo([...subCategoryTodo, subcategory]);
      setSubcategory("");
    }
  };

  const handleTodoEdit = (index, newValue) => {
    const isDuplicate = subCategoryTodo.some(
      (item, i) => i !== index && item.toLowerCase() === newValue.toLowerCase()
    );

    

    const updatedTodos = [...subCategoryTodo];
    updatedTodos[index] = newValue;
    setSubcategoryTodo(updatedTodos);
  };


  const handleSubmit = () => {
    setBtnSubmit(true);
    let matchValue = subCategoryTodo.filter(
      (data) => data === subCategoryTodo.includes(data)
    );
    const isNameMatch = categoryMasterList?.some(
      (item) =>
        item?.categoryname?.toLowerCase() ===
        category?.categoryname.toLowerCase()
    );
    const isSubNameMatch = subDuplicate.some((item) =>
      subCategoryTodo.includes(item)
    );

    if (isNameMatch) {
  
      setPopupContentMalert("Already Added ! Please Enter Another category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isSubNameMatch) {
      
      setPopupContentMalert("Already Added ! Please Enter Another subcategory ");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (category.categoryname === "") {
      
      setPopupContentMalert("Please Enter Category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (subcategory.length > 0 && subCategoryTodo.length === 0) {
    
      setPopupContentMalert("Please Insert Sub Category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (subCategoryTodo.some((item) => item === "")) {
      
      setPopupContentMalert("Please Enter Sub Category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (subCategoryTodo.some((item) => item === "")) {
      
      setPopupContentMalert("Please Enter Sub Category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (subCategoryTodo.length === 0) {

      setPopupContentMalert("Please Enter Sub Category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (subcategory !== "") {

      setPopupContentMalert("Add Sub Category Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (subCategoryTodo.length !== new Set(subCategoryTodo.map(item => item.toLowerCase())).size) {
   
      setPopupContentMalert("Already Added ! Please Enter Another Subcategory");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return;
    }




    else {
      sendRequest();
    }
  };

  const deleteTodo = (index) => {
    const updatedTodos = [...subCategoryTodo];
    updatedTodos.splice(index, 1);
    setSubcategoryTodo(updatedTodos);
  };

  return (
    <Box>
      {isUserRoleCompare?.includes("acategorymaster") && (
        <>
          <Box sx={userStyle.container}>
            <Headtitle title={"CATEGORY MASTER"} />

            <Grid container spacing={2}>
              <Grid item md={12} sm={12} xs={12}>
                <Typography sx={userStyle.HeaderText}>
                  Add Problem Category
                </Typography>
              </Grid>
              <Grid item md={4} sm={12} xs={12}>
                {!isFirstSubCateView && (
                  <FormControl fullWidth size="small">
                    <Typography>
                      Category Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Category  Name"
                      value={category.categoryname}
                      onChange={(e) => {
                        setCategory({
                          ...category,
                          categoryname: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                )}
              </Grid>
              <Grid item md={4} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  {cateCode &&
                    cateCode.map(() => {
                      let strings = "PR";
                      let refNo = cateCode[cateCode.length - 1].categorycode;
                      let digits = (cateCode.length + 1).toString();
                      const stringLength = refNo.length;
                      let lastChar = refNo.charAt(stringLength - 1);
                      let getlastBeforeChar = refNo.charAt(stringLength - 2);
                      let getlastThreeChar = refNo.charAt(stringLength - 3);
                      let lastBeforeChar = refNo.slice(-2);
                      let lastThreeChar = refNo.slice(-3);
                      let lastDigit = refNo.slice(-4);
                      let refNOINC = parseInt(lastChar) + 1;
                      let refLstTwo = parseInt(lastBeforeChar) + 1;
                      let refLstThree = parseInt(lastThreeChar) + 1;
                      let refLstDigit = parseInt(lastDigit) + 1;
                      if (
                        digits.length < 4 &&
                        getlastBeforeChar == 0 &&
                        getlastThreeChar == 0
                      ) {
                        refNOINC = ("000" + refNOINC).substr(-4);
                        newval = strings + refNOINC;
                      } else if (
                        digits.length < 4 &&
                        getlastBeforeChar > 0 &&
                        getlastThreeChar == 0
                      ) {
                        refNOINC = ("00" + refLstTwo).substr(-4);
                        newval = strings + refNOINC;
                      } else if (digits.length < 4 && getlastThreeChar > 0) {
                        refNOINC = ("0" + refLstThree).substr(-4);
                        newval = strings + refNOINC;
                      } else {
                        refNOINC = refLstDigit.substr(-4);
                        newval = strings + refNOINC;
                      }
                    })}
                  <Typography>
                    Category Code <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    placeholder="Please Enter Category  Code"
                    value={newval}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} sm={12} xs={12} sx={{ display: "flex" }}>
                <FormControl fullWidth size="small">
                  <Typography>
                    {" "}
                    SubCategory Name<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    placeholder="Please Enter SubCategory Name"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                  />
                </FormControl>
                &emsp;
                <Button
                  variant="contained"
                  color="success"
                  onClick={addTodo}
                  type="button"
                  sx={{
                    height: "30px",
                    minWidth: "30px",
                    marginTop: "28px",
                    padding: "6px 10px",
                  }}
                >
                  <FaPlus />
                </Button>
                &nbsp;
              </Grid>
              <Grid item md={8}></Grid>
              <Grid item md={4} sm={12} xs={12}>
                {subCategoryTodo.length > 0 && (
                  <ul type="none">
                    {subCategoryTodo.map((item, index) => {
                      return (
                        <li key={index}>
                          <br />
                          <Grid sx={{ display: "flex" }}>
                            <FormControl fullWidth size="small">
                              <Typography>
                                {" "}
                                SubCategory Name{" "}
                                <b style={{ color: "red" }}>*</b>
                              </Typography>
                              <OutlinedInput
                                id="component-outlined"
                                placeholder="Please Enter SubCategory"
                                value={item}
                                onChange={(e) =>
                                  handleTodoEdit(index, e.target.value)
                                }
                              />
                            </FormControl>
                            {/* &emsp;
                                                        <Button
                                                            variant="contained"
                                                            color="success"
                                                            onClick={addTodo}
                                                            type="button"
                                                            sx={{
                                                                height: "30px",
                                                                minWidth: "30px",
                                                                marginTop: "28px",
                                                                padding: "6px 10px",
                                                            }}
                                                        >
                                                            <FaPlus />
                                                        </Button> */}
                            &nbsp; &emsp;
                            <Button
                              variant="contained"
                              color="error"
                              type="button"
                              onClick={(e) => deleteTodo(index)}
                              sx={{
                                height: "30px",
                                minWidth: "30px",
                                marginTop: "28px",
                                padding: "6px 10px",
                              }}
                            >
                              <AiOutlineClose />
                            </Button>
                          </Grid>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </Grid>
              <Grid item md={1} marginTop={3}></Grid>
              <Grid item md={5}></Grid>
              <Grid item md={12} sm={12} xs={12}>
                <Grid
                  container
                  spacing={2}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Grid item lg={1} md={2} sm={2} xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={buttonStyles.buttonsubmit}
                      onClick={handleSubmit}
                    >
                      Submit
                    </Button>
                  </Grid>
                  <Grid item lg={1} md={2} sm={2} xs={12}>
                    <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                      Clear
                    </Button>
                  </Grid>
                  <Grid item lg={1} md={2} sm={2} xs={12}>
                    <Button
                      sx={buttonStyles.btncancel}
                      onClick={handleCloseviewalertstockcategory}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
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
            <Typography
              variant="h6"
              style={{ fontSize: "20px", fontWeight: 900 }}
            >
              {showAlert}
            </Typography>
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

export default CategoryMasterPopup;
