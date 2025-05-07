import React, { useState, useEffect, useContext } from "react";
import {
  TableFooter,
  TextareaAutosize,
  Box,
  Typography,
  OutlinedInput,
  TableBody,
  Paper,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Table,
  TableHead,
  TableContainer,
  Button,
} from "@mui/material";
import { userStyle } from "../../pageStyle";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import "jspdf-autotable";
import axios from "axios";
import Selects from "react-select";
import { SERVICE } from "../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import { paidOpt, statusOpt } from "../../components/Componentkeyword";
import { ThreeDots } from "react-loader-spinner";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { FaPlus } from "react-icons/fa";
import { handleApiError } from "../../components/Errorhandling";

function AddExpensePopup({
  setVendorAuto,
  handleCloseviewalertvendor,
  expenseCatePop,
  expenseSubCatePop,
  expenseDatePop,
  reminderId,
}) {
  //state and method to show current date onload
  let today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + "-" + mm + "-" + dd;
  //useStates
  const [date, setDate] = useState(formattedDate);
  const [expensecreate, setExpensecreate] = useState({
    expansecategory: "Please Select Expense Category",
    expansesubcategory: "Please Select Expense Sub Category",
    referenceno: "",
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    vendorname: "Please Select Vendor",
    totalbillamount: "",
    date,
    files: "",
    frequency: "Please Select Frequency",
    paidstatus: "Not Paid",
    duedate: "",
    expansenote: "",
    paidmode: "Please Select Paid Mode",
    expensetotal: "",
    balanceamount: "",
    paidamount: "",
  });

  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [todoDetails, setTodoDetails] = useState({
    particular: "",
    description: "",
    amount: "",
  });
  const [educationtodo, setEducationtodo] = useState([]);
  const [upload, setUpload] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [vendorOpt, setVendor] = useState([]);
  const [frequencyOpt, setFrequency] = useState([]);
  const [espenseCheck, setExpenseCheck] = useState(false);
  //useEffects
  useEffect(() => {
    fetchFrequency();
    fetchAllExpense();
    fetchVendor();
    fetchAutoId();
  }, []);
  useEffect(() => {
    getCode();
  }, [reminderId]);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);
  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch } = useContext(
    UserRoleAccessContext
  );
  const accessbranch = isAssignBranch?.map((data) => ({
    branch: data.branch,
    company: data.company,
    unit: data.unit,
  }));

  const [remainderEdit, setRemainderEdit] = useState();

  const { auth } = useContext(AuthContext);
  let newval = "AE0001";
  let Expensetotal = 0;

  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };
  const educationTodo = () => {
    const isNameMatch = educationtodo?.some(
      (item) =>
        item.particular.toLowerCase() === todoDetails.particular.toLowerCase()
    );
    const isNameMatchDatabase = expenses?.some(
      (item) =>
        item.particular.toLowerCase() === todoDetails.particular.toLowerCase()
    );
    if (
      todoDetails.particular === "" &&
      todoDetails.description === "" &&
      todoDetails.amount === ""
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Atleast one field!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (isNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Particular Already Exists"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (isNameMatchDatabase) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Particular Already Exists in DataBase"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (todoDetails !== "") {
      setEducationtodo([...educationtodo, todoDetails]);
      setTodoDetails({
        particular: "",
        description: "",
        amount: "",
      });
    }
  };
  const educationTodoremove = (index) => {
    const newTasks = [...educationtodo];
    newTasks.splice(index, 1);
    setEducationtodo(newTasks);
  };
  const handleResumeUpload = (event) => {
    const resume = event.target.files;
    for (let i = 0; i < resume.length; i++) {
      const reader = new FileReader();
      const file = resume[i];
      reader.readAsDataURL(file);
      reader.onload = () => {
        setUpload((prevFiles) => [
          ...prevFiles,
          {
            name: file.name,
            preview: reader.result,
            data: reader.result.split(",")[1],
            remark: "resume file",
          },
        ]);
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

  const fetchAllExpense = async () => {
    try {
      let res = await axios.post(
        SERVICE.EXPENSESALL,
        { assignbranch: accessbranch },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      const value = res?.data?.expenses.map((data, i) => {
        return data.tododetails;
      });
      setExpenses(...value);
      setExpenseCheck(true);
    } catch (err) {
      setExpenseCheck(true);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchFrequency = async () => {
    try {
      let res = await axios.get(SERVICE.ALL_FREQUENCYMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setFrequency([
        ...res?.data?.freqMaster?.map((t) => ({
          ...t,
          label: t.name,
          value: t.name,
        })),
      ]);
      setExpenseCheck(true);
    } catch (err) {
      setExpenseCheck(true);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  // fetch Vendor
  const fetchVendor = async () => {
    try {
      let res = await axios.get(SERVICE.ALL_VENDORDETAILS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setVendor([
        ...res?.data?.vendordetails?.map((t) => ({
          ...t,
          label: t.vendorname,
          value: t.vendorname,
        })),
      ]);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const getCode = async () => {
    try {
      let res = await axios.get(
        `${SERVICE.EXPENSEREMINDER_SINGLE}/${reminderId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setRemainderEdit(res?.data?.sexpensereminder);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const [autoId, setAutoId] = useState("");

  const fetchAutoId = async () => {
    try {
      let res_vendor = await axios.get(SERVICE.EXPENSE_AUTOID, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let refNo = res_vendor?.data?.autoid;

      setAutoId(refNo);

      return refNo;
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //add function
  const sendRequest = async () => {
    let autoIds = await fetchAutoId();
    try {
      let queuecreate = await axios.post(SERVICE.EXPENSES_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        expansecategory: String(expenseCatePop),
        expansesubcategory: String(expenseSubCatePop),
        referenceno: String(autoIds),
        company: String(expensecreate.company),
        branch: String(expensecreate.branch),
        unit: String(expensecreate.unit),
        vendorname: String(expensecreate.vendorname),
        frequency: String(expensecreate.frequency),
        date: String(expenseDatePop),
        duedate: String(expensecreate.duedate ? expensecreate.duedate : ""),
        expansenote: String(
          expensecreate.expansenote ? expensecreate.expansenote : ""
        ),
        expensetotal: String(Expensetotal ? Expensetotal : ""),
        totalbillamount: String(expensecreate.totalbillamount),
        files: [...upload],
        tododetails: [...educationtodo],
        paidstatus: String(expensecreate.paidstatus),
        paidmode: String(
          expensecreate.paidstatus === "Not Paid" ? "" : expensecreate.paidmode
        ),
        paidamount: Number(
          expensecreate.paidstatus === "Not Paid" ? 0 : expensecreate.paidamount
        ),
        balanceamount: Number(
          expensecreate.paidstatus === "Not Paid"
            ? 0
            : expensecreate.balanceamount
        ),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });

      let res = await axios.put(
        `${SERVICE.EXPENSEREMINDER_SINGLE}/${reminderId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          status: [
            {
              expensecatename: String(expenseCatePop),
              expensesubcatename: String(expenseSubCatePop),
              paiddate: String(expenseDatePop),
              paidstatus: String(expensecreate.paidstatus),
            },
          ],
        }
      );

      setVendorAuto("none");
      setExpensecreate({
        ...expensecreate,
        files: "",
        duedate: "",
        totalbillamount: "",
        paidamount: "",
        balanceamount: "",
        expansenote: "",
        expensetotal: "",
      });
      setUpload("");
      setTodoDetails({
        particular: "",
        description: "",
        amount: "",
      });
      setEducationtodo([]);
      handleCloseviewalertvendor();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    if (expensecreate.company === "Please Select Company") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Company"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (expensecreate.branch === "Please Select Branch") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Branch"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (expensecreate.unit === "Please Select Unit") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Unit"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (expensecreate.vendorname === "Please Select Vendor") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Vendor"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (expensecreate.totalbillamount === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Total Bill Amount"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (expensecreate.frequency === "Please Select Frequency") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Frequency"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      expensecreate.paidstatus === "Paid" &&
      expensecreate.paidmode === "Please Select Paid Mode"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Paid Mode"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      expensecreate.paidstatus === "Paid" &&
      expensecreate.paidamount === ""
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Paid Amount"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (expensecreate.totalbillamount < Expensetotal) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Amount Exceeds Total Bill"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (educationtodo.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Add Any Expense"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequest();
    }
  };
  const handleClear = () => {
    setExpensecreate({
      expansecategory: "Please Select Expense Category",
      expansesubcategory: "Please Select Expense Sub Category",
      referenceno: "",
      company: "Please Select Company",
      branch: "Please Select Branch",
      unit: "Please Select Unit",
      vendorname: "Please Select Vendor",
      totalbillamount: "",
      date,
      files: "",
      frequency: "Please Select Frequency",
      paidstatus: "Not Paid",
      duedate: "",
      expansenote: "",
      paidmode: "Please Select Paid Mode",
      expensetotal: "",
      balanceamount: "",
      paidamount: "",
    });
    setUpload("");
    setTodoDetails({
      particular: "",
      description: "",
      amount: "",
    });
    setEducationtodo([]);
  };

  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };
  return (
    <Box>
      {!espenseCheck ? (
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
        <>
          {isUserRoleCompare?.includes("aexpense") && (
            <Grid sx={userStyle.selectcontainer}>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={{ fontWeight: "bold" }}>
                    Add Expenses
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item lg={3} md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Reference no<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={autoId}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={3} md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={[
                        ...isAssignBranch?.map((data) => ({
                          label: data.company,
                          value: data.company,
                        })),
                        isUserRoleCompare?.includes("lassignexpenseothers") && {
                          label: "Others",
                          value: "Others",
                        },
                      ]
                        ?.filter(Boolean) // Filter out falsy values, including `undefined`
                        ?.filter((item, index, self) => {
                          return (
                            self.findIndex(
                              (i) =>
                                i.label === item.label && i.value === item.value
                            ) === index
                          );
                        })}
                      placeholder="Please Select Company"
                      value={{
                        label: expensecreate.company,
                        value: expensecreate.company,
                      }}
                      onChange={(e) => {
                        setExpensecreate({
                          ...expensecreate,
                          company: e.value,
                          branch: "Please Select Branch",
                          unit: "Please Select Unit",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={3} md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={isAssignBranch
                        ?.filter(
                          (comp) => expensecreate.company === comp.company
                        )
                        ?.map((data) => ({
                          label: data.branch,
                          value: data.branch,
                        }))
                        .filter((item, index, self) => {
                          return (
                            self.findIndex(
                              (i) =>
                                i.label === item.label && i.value === item.value
                            ) === index
                          );
                        })}
                      placeholder="Please choose Branch"
                      value={{
                        label: expensecreate.branch,
                        value: expensecreate.branch,
                      }}
                      onChange={(e) => {
                        setExpensecreate({
                          ...expensecreate,
                          branch: e.value,
                          unit: "Please Select Unit",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={3} md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Unit<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={isAssignBranch
                        ?.filter(
                          (comp) =>
                            expensecreate.company === comp.company &&
                            expensecreate.branch === comp.branch
                        )
                        ?.map((data) => ({
                          label: data.unit,
                          value: data.unit,
                        }))
                        .filter((item, index, self) => {
                          return (
                            self.findIndex(
                              (i) =>
                                i.label === item.label && i.value === item.value
                            ) === index
                          );
                        })}
                      placeholder="Please Choose Unit"
                      value={{
                        label: expensecreate.unit,
                        value: expensecreate.unit,
                      }}
                      onChange={(e) => {
                        setExpensecreate({
                          ...expensecreate,
                          unit: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl size="small" fullWidth>
                    <Typography>
                      Vendor Name<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={vendorOpt}
                      placeholder="Please choose Vendor Name"
                      value={{
                        label: expensecreate.vendorname,
                        value: expensecreate.vendorname,
                      }}
                      onChange={(e) => {
                        setExpensecreate({
                          ...expensecreate,
                          vendorname: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl size="small" fullWidth>
                    <Typography>
                      Expense Category<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={expenseCatePop}
                      readOnly
                    />
                  </FormControl>
                </Grid>

                <Grid item lg={3} md={4} xs={12} sm={6}>
                  <FormControl size="small" fullWidth>
                    <Typography>
                      Expense Sub Category<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={expenseSubCatePop}
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={3} md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Total Bill Amount<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      placeholder="Please Enter Total Bill Amount"
                      value={expensecreate.totalbillamount}
                      onChange={(e) => {
                        setExpensecreate({
                          ...expensecreate,
                          totalbillamount: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={3} md={4} xs={12} sm={6}>
                  <FormControl size="small" fullWidth>
                    <Typography>
                      Frequency<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={frequencyOpt}
                      placeholder="Please Select Frequency"
                      value={{
                        label: expensecreate.frequency,
                        value: expensecreate.frequency,
                      }}
                      onChange={(e) => {
                        setExpensecreate({
                          ...expensecreate,
                          frequency: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item lg={3} md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Date<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={expenseDatePop}
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={3} md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Due Date</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="date"
                      value={expensecreate.duedate}
                      onChange={(e) => {
                        setExpensecreate({
                          ...expensecreate,
                          duedate: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={3} md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Expense Note</Typography>
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={2.5}
                      value={expensecreate.expansenote}
                      onChange={(e) => {
                        setExpensecreate({
                          ...expensecreate,
                          expansenote: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={12} md={12} xs={12} sm={12}></Grid>
                <Grid
                  item
                  lg={2}
                  md={2}
                  xs={12}
                  sm={12}
                  sx={{ marginTop: "20px" }}
                >
                  <Button variant="outlined" size="small" component="label">
                    Upload
                    <input
                      type="file"
                      id="resume"
                      multiple
                      accept=".pdf, .doc, .txt,"
                      name="file"
                      hidden
                      onChange={handleResumeUpload}
                    />
                  </Button>
                </Grid>
                <Grid
                  item
                  lg={6}
                  md={6}
                  xs={12}
                  sm={12}
                  sx={{ marginTop: "20px" }}
                >
                  {upload?.length > 0 &&
                    upload.map((file, index) => (
                      <>
                        <Grid container spacing={2}>
                          <Grid item lg={8} md={8} sm={8} xs={8}>
                            <Typography>{file.name}</Typography>
                          </Grid>
                          <Grid item lg={1} md={1} sm={1} xs={1}>
                            <VisibilityOutlinedIcon
                              style={{
                                fontsize: "large",
                                color: "#357AE8",
                                cursor: "pointer",
                              }}
                              onClick={() => renderFilePreview(file)}
                            />
                          </Grid>
                          <Grid item lg={1} md={1} sm={1} xs={1}>
                            <Button
                              style={{
                                fontsize: "large",
                                color: "#357AE8",
                                cursor: "pointer",
                                marginTop: "-5px",
                              }}
                              onClick={() => handleFileDelete(index)}
                            >
                              <DeleteIcon />
                            </Button>
                          </Grid>
                        </Grid>
                      </>
                    ))}
                </Grid>
                <Grid
                  item
                  lg={4}
                  md={4}
                  xs={12}
                  sm={12}
                  sx={{ marginTop: "20px" }}
                ></Grid>
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
                        onChange={(e) => {
                          setTodoDetails({
                            ...todoDetails,
                            particular: e.target.value,
                          });
                        }}
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
                        onChange={(e) => {
                          setTodoDetails({
                            ...todoDetails,
                            description: e.target.value,
                          });
                        }}
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
                        onChange={(e) => {
                          setTodoDetails({
                            ...todoDetails,
                            amount: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    md={0.1}
                    sm={6}
                    xs={12}
                    sx={{ marginLeft: "-10px" }}
                  >
                    <Button
                      variant="contained"
                      style={{
                        height: "30px",
                        minWidth: "20px",
                        padding: "19px 13px",
                        marginTop: "25px",
                      }}
                      onClick={educationTodo}
                    >
                      <FaPlus />
                    </Button>
                  </Grid>
                </Grid>
              </Grid>{" "}
              <br />
              <TableContainer component={Paper}>
                <Table
                  sx={{ minWidth: 700 }}
                  aria-label="customized table"
                  id="usertable"
                >
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
                              onClick={() => {
                                educationTodoremove(index);
                              }}
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
                  <TableFooter
                    sx={{ backgroundColor: "#9591914f", height: "50px" }}
                  >
                    {educationtodo &&
                      educationtodo.forEach((item) => {
                        Expensetotal += +item.amount;
                      })}
                    <StyledTableRow className="table2_total">
                      <StyledTableCell
                        align="left"
                        colSpan={2}
                      ></StyledTableCell>
                      <StyledTableCell align="left">
                        Expense Total (Rs.)
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {Expensetotal.toFixed(2)}
                      </StyledTableCell>
                      <StyledTableCell align="left"></StyledTableCell>
                    </StyledTableRow>
                  </TableFooter>
                </Table>
              </TableContainer>{" "}
              <br /> <br />
              <Grid container spacing={2} sx={{ display: "flex" }}>
                <Grid item lg={3} md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Paid Status<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={statusOpt}
                      placeholder="Please Select Status"
                      value={{
                        label: expensecreate.paidstatus,
                        value: expensecreate.paidstatus,
                      }}
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
                  {expensecreate.paidstatus === "Paid" && (
                    <FormControl fullWidth size="small">
                      <Typography>
                        Paid Mode<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        maxMenuHeight={250}
                        options={paidOpt}
                        placeholder="Please Select Paid Mode"
                        value={{
                          label: expensecreate.paidmode,
                          value: expensecreate.paidmode,
                        }}
                        onChange={(e) => {
                          setExpensecreate({
                            ...expensecreate,
                            paidmode: e.value,
                          });
                        }}
                      />
                    </FormControl>
                  )}
                </Grid>
                <Grid item lg={3} md={4} xs={12} sm={6}>
                  {expensecreate.paidstatus === "Paid" && (
                    <FormControl fullWidth size="small">
                      <Typography>
                        Paid Amount<b style={{ color: "red" }}>*</b>
                      </Typography>
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
                            balanceamount:
                              expensecreate.totalbillamount - e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  )}
                </Grid>
                <Grid item lg={3} md={4} xs={12} sm={6}>
                  {expensecreate.paidstatus === "Paid" && (
                    <FormControl fullWidth size="small">
                      <Typography>
                        Balance Amount<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        readOnly
                        id="component-outlined"
                        type="number"
                        sx={userStyle.input}
                        placeholder="Please Enter Balance Amount"
                        value={expensecreate.balanceamount}
                      />
                    </FormControl>
                  )}
                </Grid>
                <Grid item lg={3} md={4} xs={12} sm={6}></Grid>
                <Grid item lg={2} md={2} xs={12} sm={12}></Grid>
                <Grid item lg={1} md={2} sm={12} xs={12}>
                  <Typography>&ensp;</Typography>
                  <Grid item md={12} sm={12} xs={12}>
                    <Button
                      sx={userStyle.buttonadd}
                      variant="contained"
                      onClick={handleSubmit}
                    >
                      SAVE
                    </Button>
                  </Grid>
                </Grid>
                <Grid item lg={1} md={2} sm={12} xs={12}>
                  <Typography>&ensp;</Typography>
                  <Grid item md={12} sm={12} xs={12}>
                    <Button sx={userStyle.btncancel} onClick={handleClear}>
                      Clear
                    </Button>
                  </Grid>
                </Grid>
                <Grid item lg={1} md={2} sm={12} xs={12}>
                  <Typography>&ensp;</Typography>
                  <Grid item md={12} sm={12} xs={12}>
                    <Button
                      sx={userStyle.btncancel}
                      onClick={handleCloseviewalertvendor}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
          {/* Alert Dialog */}
          <Box>
            <Dialog
              open={isErrorOpen}
              onClose={handleCloseerr}
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
    </Box>
  );
}
export default AddExpensePopup;
