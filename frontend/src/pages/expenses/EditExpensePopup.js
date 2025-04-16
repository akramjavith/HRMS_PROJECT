import React, { useState, useEffect, useContext } from "react";
import { TableFooter, TextareaAutosize, Box, Typography, OutlinedInput, TableBody, Paper, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button } from "@mui/material";
import { userStyle } from "../../pageStyle";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import "jspdf-autotable";
import axios from "axios";
import Selects from "react-select";
import { SERVICE } from "../../services/Baseservice";
import { paidOpt, statusOpt } from "../../components/Componentkeyword";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import { ThreeDots } from "react-loader-spinner";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { FaPlus } from "react-icons/fa";
import { handleApiError } from "../../components/Errorhandling";
function EditExpense({setExpenseEditAuto,handleCloseviewalertExp,expenseEditId}) {
  //state and method to show current date onload
  let today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + "-" + mm + "-" + dd;
  //useStates
  const [date, setDate] = useState(formattedDate);
  const [expensecreate, setExpensecreate] = useState({ expansecategory: "Please Select Expense Category",expansesubcategory: "Please Select Expense Sub Category", referenceno: "", company: "Please Select Company", branch: "Please Select Branch",unit: "Please Select Unit", vendorname: "Please Select Vendor", totalbillamount: "", date, files: "", frequency:"Please Select Frequency",paidstatus:"Not Paid",duedate:"",expansenote: "", paidmode: "Please Select Paid Mode", expensetotal: "",balanceamount:"",paidamount:"" });
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [todoDetails, setTodoDetails] = useState({ particular: "", description: "", amount: "" });
  const [educationtodo, setEducationtodo] = useState([]);
  const [upload, setUpload] = useState([]);
  const [espenseCheck, setExpenseCheck] = useState(false);
  useEffect(() => {
    getCode(expenseEditId)
}, [expenseEditId])

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);
  const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);

  const { auth } = useContext(AuthContext);
  let Expensetotal = 0;
 
  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };
  const handleResumeUpload = (event) => {
    const resume = event.target.files;
    for (let i = 0; i < resume.length; i++) {
      const reader = new FileReader();
      const file = resume[i];
      reader.readAsDataURL(file);
      reader.onload = () => {
        setUpload((prevFiles) => [...prevFiles, { name: file.name, preview: reader.result, data: reader.result.split(",")[1], remark: "resume file" }]);
      };
    }
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
    setUpload((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };
  const getCode = async (e) => {
    try {
        let res = await axios.get(`${SERVICE.EXPENSES_SINGLE}/${e}`, {
            headers: {
                'Authorization': `Bearer ${auth.APIToken}`
            }
        });
        setExpensecreate(res?.data?.sexpenses);
        setEducationtodo(res?.data?.sexpenses?.tododetails);
        setUpload(res?.data?.sexpenses?.files);
      } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
};
      //editing the single data...
      let expenseid = expensecreate._id
      let updateby = expensecreate.updatedby;
  //add function
  const sendRequest = async () => {
    try {
      let queuecreate = await axios.put(`${SERVICE.EXPENSES_SINGLE}/${expenseid}`, {
        headers: {
            'Authorization': `Bearer ${auth.APIToken}`
        },
        expansecategory: String(expensecreate.expansecategory),
        expansesubcategory: String(expensecreate.expansesubcategory),
        referenceno: String(expensecreate.referenceno),
        company: String(expensecreate.company),
        branch: String(expensecreate.branch),
        unit: String(expensecreate.unit),
        vendorname: String(expensecreate.vendorname),
        frequency: String(expensecreate.frequency),
        date: String(expensecreate.date),
        duedate: String(expensecreate.duedate?expensecreate.duedate:""),
        expansenote: String(expensecreate.expansenote ? expensecreate.expansenote : ""),
        expensetotal: String(Expensetotal ? Expensetotal : ""),
        totalbillamount: String(expensecreate.totalbillamount),
        files: [...upload],
        tododetails: [...educationtodo],
        paidstatus: String(expensecreate.paidstatus),
        paidmode: String(expensecreate.paidstatus === "Not Paid" ? "":expensecreate.paidmode),
        paidamount: Number(expensecreate.paidstatus === "Not Paid" ? 0:expensecreate.paidamount),
        balanceamount: Number(expensecreate.paidstatus === "Not Paid" ? 0:expensecreate.balanceamount),
        updatedby: [
            ...updateby,
            {
                name: String(isUserRoleAccess.companyname),
                date: String(new Date()),
            },
        ],
      });
      setExpenseEditAuto("none")
      setExpensecreate({...expensecreate,   files: "",duedate:"",totalbillamount:"",paidamount:"",balanceamount:"",expansenote: "",  expensetotal: "" });
      setUpload("");
      setTodoDetails({
        particular: "",
        description: "",
        amount: "",
      });
      setEducationtodo([]);
      handleCloseviewalertExp();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
     if (expensecreate.paidstatus === "Paid" && (expensecreate.paidmode === "Please Select Paid Mode" || expensecreate.paidmode === "")) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Paid Mode"}</p>
        </>
      );
      handleClickOpenerr();
    }else if (expensecreate.paidstatus === "Paid" && expensecreate.paidamount === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Paid Amount"}</p>
        </>
      );
      handleClickOpenerr();
    } 
    else if (expensecreate.totalbillamount < Expensetotal) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Amount Exceeds Total Bill"}</p>
        </>
      );
      handleClickOpenerr();
    } 
    else if (educationtodo.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Add Any Expense"}</p>
        </>
      );
      handleClickOpenerr();
    } 
    else {
      sendRequest();
    }
  };
 
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };
  return (
    <Box>
      {!espenseCheck ? (
        <Box sx={userStyle.container}>
          <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
            <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
          </Box>
        </Box>
      ) : (
        <>
          {isUserRoleCompare?.includes("aexpense") && (
            <Grid sx={userStyle.selectcontainer}>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={{ fontWeight: "bold" }}>Edit Expenses</Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
              <Grid item lg={3} md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Reference no<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput id="component-outlined" type="text" value={expensecreate.referenceno} />
                  </FormControl>
                </Grid>
                <Grid item lg={3} md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput id="component-outlined" type="text" value={expensecreate.company} readOnly />
                  </FormControl>
                </Grid>
                <Grid item lg={3} md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput id="component-outlined" type="text" value={expensecreate.branch} readOnly />
                  </FormControl>
                </Grid>
                <Grid item lg={3} md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Unit<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput id="component-outlined" type="text" value={expensecreate.unit} readOnly />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                    <FormControl size="small" fullWidth>
                      <Typography>Vendor Name<b style={{ color: "red" }}>*</b></Typography>
                      <OutlinedInput id="component-outlined" type="text" value={expensecreate.vendorname} readOnly />
                    </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                    <FormControl size="small" fullWidth>
                      <Typography>Expense Category<b style={{ color: "red" }}>*</b></Typography>
                      <OutlinedInput id="component-outlined" type="text" value={expensecreate.expansecategory} readOnly />
                    </FormControl>
                    
                </Grid>
                                    <Grid item lg={3} md={4} xs={12} sm={6}>
                                    <FormControl size="small" fullWidth>
                      <Typography>Expense Sub Category<b style={{ color: "red" }}>*</b></Typography>
                      <OutlinedInput id="component-outlined" type="text" value={expensecreate.expansesubcategory} readOnly />
                    </FormControl>
                                    </Grid>
                <Grid item lg={3} md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Total Bill Amount<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput id="component-outlined" type="text" value={expensecreate.totalbillamount} readOnly />
                  </FormControl>
                </Grid>
                <Grid item lg={3} md={4} xs={12} sm={6}>
                                    <FormControl size="small" fullWidth>
                      <Typography>Frequency<b style={{ color: "red" }}>*</b></Typography>
                    <OutlinedInput id="component-outlined" type="text" value={expensecreate.frequency} readOnly />
                    </FormControl>
                                    </Grid>
                
                <Grid item lg={3} md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Date<b style={{ color: "red" }}>*</b></Typography>
                    <OutlinedInput id="component-outlined" type="text" value={expensecreate.date} readOnly />
                  </FormControl>
                </Grid>
                <Grid item lg={3} md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Due Date</Typography>
                    <OutlinedInput id="component-outlined" type="text" value={expensecreate.duedate} readOnly />
                  </FormControl>
                </Grid>
                <Grid item lg={3} md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Expense Note</Typography>
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={2.5}
                      value={expensecreate.expansenote}
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={12} md={12} xs={12} sm={12}></Grid>
                <Grid item lg={2} md={2} xs={12} sm={12} sx={{ marginTop: "20px" }}>
                  <Button variant="outlined" size="small" component="label">
                    Upload
                    <input type="file" id="resume" multiple accept=".pdf, .doc, .txt," name="file" hidden onChange={handleResumeUpload} />
                  </Button>
                </Grid>
                <Grid item lg={6} md={6} xs={12} sm={12} sx={{ marginTop: "20px" }}>
                  {upload?.length > 0 &&
                    upload.map((file, index) => (
                      <>
                        <Grid container spacing={2}>
                          <Grid item lg={8} md={8} sm={8} xs={8}>
                            <Typography>{file.name}</Typography>
                          </Grid>
                          <Grid item lg={1} md={1} sm={1} xs={1}>
                            <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreview(file)} />
                          </Grid>
                          <Grid item lg={1} md={1} sm={1} xs={1}>
                            <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDelete(index)}>
                              <DeleteIcon />
                            </Button>
                          </Grid>
                        </Grid>
                      </>
                    ))}
                </Grid>
                <Grid item lg={4} md={4} xs={12} sm={12} sx={{ marginTop: "20px" }}></Grid>
              </Grid>
              <br />
              <br />
              <Grid item md={12} sm={12} xs={12}>
                <Grid container spacing={3} sx={{ display: "flex" }}>
                  <Grid item md={3.8} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Particular</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Particular"
                        value={todoDetails.particular}
                        readOnly
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3.8} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Description</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Description"
                        value={todoDetails.description}
                        readOnly
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3.8} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Amount</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        placeholder="Please Enter Amount"
                        sx={userStyle.input}
                        value={todoDetails.amount}
                        readOnly
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={0.1} sm={6} xs={12} sx={{ marginLeft: "-10px" }}>
                    <Button variant="contained" style={{ height: "30px", minWidth: "20px", padding: "19px 13px", marginTop: "25px" }}  disabled>
                      <FaPlus />
                    </Button>
                  </Grid>
                </Grid>
              </Grid>{" "}
              <br />
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable">
                  <TableHead sx={{ fontWeight: "600" }}>
                    <StyledTableRow>
                      <StyledTableCell>SNo</StyledTableCell>
                      <StyledTableCell>Particular</StyledTableCell>
                      <StyledTableCell>Description</StyledTableCell>
                      <StyledTableCell>Amount</StyledTableCell>
                      <StyledTableCell></StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody align="left">
                    {educationtodo?.length > 0 ? (
                      educationtodo?.map((row, index) => (
                        <StyledTableRow>
                          <StyledTableCell>{index + 1}</StyledTableCell>
                          <StyledTableCell>{row.particular}</StyledTableCell>
                          <StyledTableCell>{row.description}</StyledTableCell>
                          <StyledTableCell>{row.amount}</StyledTableCell>
                          <StyledTableCell>
                            <CloseIcon
                              sx={{ color: "red", cursor: "pointer" }}
                              disabled
                            />
                          </StyledTableCell>
                        </StyledTableRow>
                      ))
                    ) : (
                      <StyledTableRow>
                        {" "}
                        <StyledTableCell colSpan={8} align="center">
                          No Data Available
                        </StyledTableCell>{" "}
                      </StyledTableRow>
                    )}
                    <StyledTableRow></StyledTableRow>
                  </TableBody>
                  <TableFooter sx={{ backgroundColor: "#9591914f", height: "50px" }}>
                    {educationtodo &&
                      educationtodo.forEach((item) => {
                        Expensetotal += +item.amount;
                      })}
                    <StyledTableRow className="table2_total">
                      <StyledTableCell align="left" colSpan={2}></StyledTableCell>
                      <StyledTableCell align="left">Expense Total (Rs.)</StyledTableCell>
                      <StyledTableCell align="left">{Expensetotal.toFixed(2)}</StyledTableCell>
                      <StyledTableCell align="left"></StyledTableCell>
                    </StyledTableRow>
                  </TableFooter>
                </Table>
              </TableContainer>{" "}
              <br /> <br />
              <Grid container spacing={2} sx={{ display: "flex" }}>
                <Grid item lg={3} md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Paid Status<b style={{ color: "red" }}>*</b></Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={statusOpt}
                      placeholder="Please Select Status"
                      value={{ label: expensecreate.paidstatus, value: expensecreate.paidstatus }}
                      onChange={(e) => {
                        setExpensecreate({
                          ...expensecreate,
                          paidstatus: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={3} md={4} xs={12} sm={6}>
                  {expensecreate.paidstatus === "Paid" && <FormControl fullWidth size="small">
                    <Typography>Paid Mode<b style={{ color: "red" }}>*</b></Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={paidOpt}
                      placeholder="Please Select Paid Mode"
                      value={{ label: expensecreate.paidmode === ""?"Please Select Paid Mode":expensecreate.paidmode, value:  expensecreate.paidmode === ""?"Please Select Paid Mode":expensecreate.paidmode }}
                      onChange={(e) => {
                        setExpensecreate({
                          ...expensecreate,
                          paidmode: e.value,
                        });
                      }}
                    />
                  </FormControl>}
                </Grid>
                <Grid item lg={3} md={4} xs={12} sm={6}>
                  {expensecreate.paidstatus === "Paid" && 
                   <FormControl fullWidth size="small">
                   <Typography>Paid Amount<b style={{ color: "red" }}>*</b></Typography>
                   <OutlinedInput
                     id="component-outlined"
                     type="number"
                     placeholder="Please Enter Paid Amount"
                     sx={userStyle.input}
                     value={expensecreate.paidamount}
                     onChange={(e) => {
                       setExpensecreate({
                         ...expensecreate,
                         paidamount: e.target.value,
                         balanceamount:expensecreate.totalbillamount-e.target.value
                       });
                     }}
                   />
                 </FormControl>}
                </Grid>
                <Grid item lg={3} md={4} xs={12} sm={6}>
                  {expensecreate.paidstatus === "Paid" && 
                   <FormControl fullWidth size="small">
                   <Typography>Balance Amount<b style={{ color: "red" }}>*</b></Typography>
                   <OutlinedInput
                   readOnly
                     id="component-outlined"
                     type="number"
                     sx={userStyle.input}
                     placeholder="Please Enter Balance Amount"
                     value={expensecreate.balanceamount}
                    
                   />
                 </FormControl>}
                </Grid>
                <Grid item lg={3} md={4} xs={12} sm={6}></Grid>
                <Grid item lg={2} md={2} xs={12} sm={12}></Grid>
                <Grid item lg={1} md={2} sm={12} xs={12}>
                  <Typography>&ensp;</Typography>
                  <Grid item md={12} sm={12} xs={12}>
                    <Button sx={userStyle.buttonadd} variant="contained" onClick={handleSubmit}>
                      SAVE
                    </Button>
                  </Grid>
                </Grid>
                <Grid item lg={1} md={2} sm={12} xs={12}>
                  <Typography>&ensp;</Typography>
                  <Grid item md={12} sm={12} xs={12}>
                    <Button sx={userStyle.btncancel} onClick={handleCloseviewalertExp}>
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}

          {/* Alert Dialog */}
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
        </>
      )}
      {/* dialog box for expense details */}
    </Box>
  );
}
export default EditExpense;
