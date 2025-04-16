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
import { handleApiError } from "../../components/Errorhandling";
import { userStyle, colourStyles } from "../../pageStyle";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import "jspdf-autotable";
import axios from "axios";
import Selects from "react-select";
import {
  paidOpt,
  statusOpt,
  particularModeOptions,
} from "../../components/Componentkeyword";
import { SERVICE } from "../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import ExpCategorypopup from "./expanseaddpopup";
import StockCategoryPopup from "./StockCategoryPopup";
import ManageStockItemsPopup from "./ManageStockItemsPopup";
import VendorPopup from "../asset/VendorPopup";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PageHeading from "../../components/PageHeading";

function Addexpense() {
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
    purpose: "Please Select Purpose",
    totalbillamount: "",
    date,
    files: "",
    vendorfrequency: "",
    paidstatus: "Not Paid",
    duedate: "",
    expansenote: "",
    paidmode: "Please Select Paid Mode",
    expensetotal: "",
    balanceamount: "",
    paidamount: "",
  });
  const [vendorAuto, setVendorAuto] = useState("");
  const [expenseAuto, setExpenseAuto] = useState("");
  const [stockCategoryAuto, setStockCategoryAuto] = useState("");
  const [stockItemAuto, setStockItemAuto] = useState("");
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [isErrorOpenAmount, setIsErrorOpenAmount] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [items, setItems] = useState([]);
  const [listExpense, setlistExpense] = useState([]);
  const [todoDetails, setTodoDetails] = useState({
    particularmode: "Please Select Particular Mode",
    category: "Please Select Category",
    subcategory: "Please Select Sub Category",
    itemname: "Please Select Item Name",
    uom: "",
    rate: "",
    quantity: "",
    amount: "",
  });

  const [vendor, setVendorNew] = useState({
    bankname: "",
    bankbranchname: "",
    accountholdername: "",
    accountnumber: "",
    ifsccode: "",
    upinumber: "",
    chequenumber: "",
    cardnumber: "",
    cardholdername: "",
    cardtransactionnumber: "",
    cardtype: "",
    cardmonth: "",
    cardyear: "",
    cardsecuritycode: "",
  });

  //get all  vendordetails.
  const fetchVendorNew = async (e) => {
    try {
      let res_vendor = await axios.get(SERVICE.ALL_VENDORDETAILS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let filtered = res_vendor?.data?.vendordetails.filter((data) => {
        return data.vendorname === e.value;
      });

      setVendorNew((prev) => ({
        ...prev,
        ...filtered[0],
      }));
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [educationtodo, setEducationtodo] = useState([]);
  const [upload, setUpload] = useState([]);
  const [vendorOpt, setVendor] = useState([]);
  const [expanseOpt, setExpanse] = useState([]);
  const [expansesubOpt, setExpanseSub] = useState([]);
  const [frequencyValue, setFrequencyValue] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [vendorModeOfPayments, setVendorModeOfPayments] = useState([]);
  const [espenseCheck, setExpenseCheck] = useState(false);
  const [purposes, setPurposes] = useState([]);

  useEffect(() => {
    getStockCategory();
  }, [stockCategoryAuto]);
  useEffect(() => {
    fetchStockItems();
  }, [stockItemAuto]);

  const fetchPurposeDropdowns = async () => {
    try {
      let res_category = await axios.get(SERVICE.ALL_PURPOSE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const purposeall = [
        ...res_category?.data?.purpose.map((d) => ({
          ...d,
          label: d.purposename,
          value: d.purposename,
        })),
      ];

      setPurposes(purposeall);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    fetchPurposeDropdowns();
    getStockCategory();
    fetchStockItems();
    fetchAutoId();
  }, []);

  useEffect(() => {
    fetchVendor();
  }, [vendorAuto]);
  useEffect(() => {
    fetchExpenseCate();
  }, [expenseAuto]);

  useEffect(() => {
    const filteredExpsubcat = [
      ...expanseOpt
        ?.filter((u) => u.categoryname === expensecreate.expansecategory)
        ?.map((item) => {
          return item.subcategoryname.map((subcategory) => {
            return {
              label: subcategory,
              value: subcategory,
            };
          });
        })
        .flat(),
    ];
    setExpanseSub(filteredExpsubcat);
  }, [expensecreate.expansecategory]);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);
  const {
    isUserRoleCompare,
    isUserRoleAccess,
    isAssignBranch,
    pageName,
    setPageName,
  } = useContext(UserRoleAccessContext);

  const accessbranch = isAssignBranch?.map((data) => ({
    branch: data.branch,
    company: data.company,
    unit: data.unit,
  }));

  let snos = 1;
  const modifiedData = listExpense?.map((person) => ({
    ...person,
    sino: snos++,
  }));
  useEffect(() => {
    addSerialNumber();
  }, [modifiedData]);

  //alert model for vendor details
  const [openviewalertvendor, setOpenviewalertvendro] = useState(false);
  // view model
  const handleClickOpenviewalertvendor = () => {
    setOpenviewalertvendro(true);
  };

  const handleCloseviewalertvendor = () => {
    setOpenviewalertvendro(false);
  };
  //alert model for vendor details
  const [openviewalertexpense, setOpenviewalertexpense] = useState(false);
  // view model
  const handleClickOpenviewalertexpense = () => {
    setOpenviewalertexpense(true);
  };

  const handleCloseviewalertexpense = () => {
    setOpenviewalertexpense(false);
  };

  //alert model for stock category
  const [openviewalertstockcategory, setOpenviewalertstockcategory] =
    useState(false);
  // view model
  const handleClickOpenviewalertstockcategory = () => {
    setOpenviewalertstockcategory(true);
  };

  const handleCloseviewalertstockcategory = () => {
    setOpenviewalertstockcategory(false);
  };
  //alert model for manage stock Item
  const [openviewalertstockitem, setOpenviewalertstockitem] = useState(false);
  // view model
  const handleClickOpenviewalertstockitem = () => {
    setOpenviewalertstockitem(true);
  };

  const handleCloseviewalertstockitem = () => {
    setOpenviewalertstockitem(false);
  };
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  let newval = "AE0001";
  let Expensetotal = 0;

  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };
  //amount mismatch Popup model
  const handleClickOpenerrAmount = () => {
    setIsErrorOpenAmount(true);
  };
  const handleCloseerrAmount = () => {
    setIsErrorOpenAmount(false);
  };
  const educationTodo = () => {
    const isNameMatch = educationtodo?.some((item) => {
      if (todoDetails?.particularmode === "Stock Material") {
        return (
          item?.category === todoDetails?.category &&
          item?.subcategory === todoDetails?.subcategory &&
          item?.itemname?.toLowerCase() ===
            todoDetails?.itemname?.toLowerCase() &&
          item?.uom?.toLowerCase() === todoDetails?.uom?.toLowerCase()
        );
      } else {
        return (
          item?.itemname?.toLowerCase() ===
            todoDetails?.itemname?.toLowerCase() &&
          item?.uom?.toLowerCase() === todoDetails?.uom?.toLowerCase()
        );
      }
    });
    if (todoDetails.particularmode === "Please Select Particular Mode") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Particular Mode"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      todoDetails.particularmode !== "Others" &&
      todoDetails.category !== "Please Select Category" &&
      todoDetails.subcategory === "Please Select Sub Category"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Sub Category"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      todoDetails.particularmode !== "Others" &&
      todoDetails.itemname === "Please Select Item Name"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Item Name"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      todoDetails.particularmode === "Others" &&
      todoDetails.itemname === ""
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Item Name"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      todoDetails.particularmode === "Others" &&
      todoDetails.uom === ""
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter UOM"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (todoDetails.rate === "" || todoDetails.rate == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Rate"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (todoDetails.quantity === "" || todoDetails.quantity == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Quantity"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (todoDetails.amount === "" || todoDetails.amount == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Amount"}
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
            {"Item Already Exists"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      Number(todoDetails.amount) + Number(Expensetotal) >
      Number(expensecreate.totalbillamount)
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Amount Exceeds Total Bill Amount"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (todoDetails !== "") {
      setEducationtodo([...educationtodo, todoDetails]);
      setTodoDetails({
        ...todoDetails,

        rate: "",
        quantity: "",
        amount: "",
      });
    }
  };
  const educationTodoremove = (index) => {
    const newTasks = [...educationtodo];
    newTasks.splice(index, 1);
    setEducationtodo(newTasks);
    setExpensecreate({
      ...expensecreate,
      paidstatus: "Not Paid",
      paidmode: "Please Select Paid Mode",
      paidamount: "",
      balanceamount: "",
    });
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
      setVendorAuto("");
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [stockCategoryOptions, setStockCategoryOptions] = useState([]);
  const [allStockValues, setAllStockValues] = useState([]);
  const [allStockCategory, setAllStockCategory] = useState([]);
  const [itemAllShow, setItemAllShow] = useState(true);

  //get stock items.
  const fetchStockItems = async () => {
    try {
      let res_status = await axios.get(SERVICE.MANAGESTOCKITEMS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setAllStockValues(res_status?.data?.managestockitems);
      setStockItemAuto("");
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const getStockCategory = async () => {
    try {
      let response = await axios.get(`${SERVICE.STOCKCATEGORY}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setStockCategoryOptions(
        response?.data?.stockcategory.map((item) => {
          return {
            label: item.categoryname,
            value: item.categoryname,
          };
        })
      );
      setAllStockCategory(response?.data?.stockcategory);
      setStockCategoryAuto("");
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //get all project.
  const fetchExpenseCate = async () => {
    try {
      let res = await axios.get(SERVICE.EXPENSECATEGORY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setlistExpense(res?.data?.expensecategory);
      setExpanse([
        ...res?.data?.expensecategory?.map((t) => ({
          ...t,
          label: t.categoryname,
          value: t.categoryname,
        })),
      ]);

      setExpenseAuto("");
      setExpenseCheck(true);
    } catch (err) {
      setExpenseCheck(true);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //add function
  const sendRequest = async () => {
    setPageName(!pageName);
    let autoIds = await fetchAutoId();
    try {
      let queuecreate = await axios.post(SERVICE.EXPENSES_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        expansecategory: String(expensecreate.expansecategory),
        expansesubcategory: String(expensecreate.expansesubcategory),
        referenceno: String(autoIds),
        company: String(expensecreate.company),
        branch:
          expensecreate.company === "Others"
            ? ""
            : String(expensecreate.branch),
        unit:
          expensecreate.company === "Others" ? "" : String(expensecreate.unit),
        vendorname: String(expensecreate.vendorname),
        purpose: String(
          expensecreate.purpose === "Please Select Purpose"
            ? ""
            : expensecreate.purpose
        ),
        vendorfrequency: String(frequencyValue),
        vendorid: String(vendorId),
        source: "Expense",
        date: String(expensecreate.date),
        duedate: String(expensecreate.duedate ? expensecreate.duedate : ""),
        expansenote: String(
          expensecreate.expansenote ? expensecreate.expansenote : ""
        ),
        expensetotal: String(Expensetotal ? Expensetotal : ""),
        totalbillamount: String(expensecreate.totalbillamount),
        files: [...upload],
        tododetails: [...educationtodo],
        paidstatus: String(expensecreate.paidstatus),

        bankname:
          expensecreate.paidmode === "Bank Transfer"
            ? String(vendor.bankname)
            : "",
        bankbranchname:
          expensecreate.paidmode === "Bank Transfer"
            ? String(vendor.bankbranchname)
            : "",
        accountholdername:
          expensecreate.paidmode === "Bank Transfer"
            ? String(vendor.accountholdername)
            : "",
        accountnumber:
          expensecreate.paidmode === "Bank Transfer"
            ? String(vendor.accountnumber)
            : "",
        ifsccode:
          expensecreate.paidmode === "Bank Transfer"
            ? String(vendor.ifsccode)
            : "",

        upinumber:
          expensecreate.paidmode === "UPI" ? String(vendor.upinumber) : "",

        cardnumber:
          expensecreate.paidmode === "Card" ? String(vendor.cardnumber) : "",
        cardholdername:
          expensecreate.paidmode === "Card"
            ? String(vendor.cardholdername)
            : "",
        cardtransactionnumber:
          expensecreate.paidmode === "Card"
            ? String(vendor.cardtransactionnumber)
            : "",
        cardtype:
          expensecreate.paidmode === "Card" ? String(vendor.cardtype) : "",
        cardmonth:
          expensecreate.paidmode === "Card" ? String(vendor.cardmonth) : "",
        cardyear:
          expensecreate.paidmode === "Card" ? String(vendor.cardyear) : "",
        cardsecuritycode:
          expensecreate.paidmode === "Card"
            ? String(vendor.cardsecuritycode)
            : "",

        chequenumber:
          expensecreate.paidmode === "Cheque"
            ? String(vendor.chequenumber)
            : "",

        cash: expensecreate.paidmode === "Cash" ? String("Cash") : "",

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
        sortdate: String(
          expensecreate.paidstatus === "Not Paid" ? "" : new Date()
        ),
        billstatus:
          expensecreate.paidstatus === "Not Paid"
            ? "InComplete"
            : expensecreate.paidstatus === "Paid" &&
              Number(expensecreate.paidamount) !== Number(Expensetotal)
            ? "Partially Paid"
            : "Completed",
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
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
        particularmode: "Please Select Particular Mode",
        category: "Please Select Category",
        subcategory: "Please Select Sub Category",
        itemname: "Please Select Item Name",
        uom: "",
        rate: "",
        quantity: "",
        amount: "",
      });
      setEducationtodo([]);
      await fetchAutoId();
      setShowAlert(
        <>
          {" "}
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Added Successfully"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
      navigate("/expense/expenselist", { replace: true });
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
    } else if (
      expensecreate?.company !== "Others" &&
      expensecreate.branch === "Please Select Branch"
    ) {
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
    } else if (
      expensecreate?.company !== "Others" &&
      expensecreate.unit === "Please Select Unit"
    ) {
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
    } else if (
      expensecreate.expansecategory === "Please Select Expense Category"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Expense Category"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      expensecreate.expansesubcategory === "Please Select Expense Sub Category"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Expense Sub Category"}
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
    } else if (expensecreate.date === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Date"}
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
    } else if (Number(Expensetotal) !== Number(expensecreate.totalbillamount)) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Total Bill Amount must be equal to Expense Total"}
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
    } else if (
      expensecreate.paidstatus === "Paid" &&
      Number(expensecreate.paidamount) !== Number(Expensetotal)
    ) {
      handleClickOpenerrAmount();
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
      purpose: "Please Select Purpose",
      totalbillamount: "",
      date,
      files: "",
      vendorfrequency: "",
      paidstatus: "Not Paid",
      duedate: "",
      expansenote: "",
      paidmode: "Please Select Paid Mode",
      expensetotal: "",
      balanceamount: "",
      paidamount: "",
    });
    setItemAllShow(true);
    setUpload("");
    setTodoDetails({
      particularmode: "Please Select Particular Mode",
      category: "Please Select Category",
      subcategory: "Please Select Sub Category",
      itemname: "Please Select Item Name",
      uom: "",
      rate: "",
      quantity: "",
      amount: "",
    });
    setEducationtodo([]);
    setShowAlert(
      <>
        {" "}
        <CheckCircleOutlineIcon
          sx={{ fontSize: "100px", color: "orange" }}
        />{" "}
        <p style={{ fontSize: "20px", fontWeight: 900 }}>
          {" "}
          {"Cleared Successfully"}{" "}
        </p>{" "}
      </>
    );
    handleClickOpenerr();
  };
  const handleCancel = () => {
    setExpensecreate({
      expansecategory: "Please Select Expense Category",
      expansesubcategory: "Please Select Expense Sub Category",
      referenceno: "",
      company: "Please Select Company",
      branch: "Please Select Branch",
      unit: "Please Select Unit",
      vendorname: "Please Select Vendor",
      purpose: "Please Select Purpose",
      totalbillamount: "",
      date,
      files: "",
      vendorfrequency: "",
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
      particularmode: "Please Select Particular Mode",
      category: "Please Select Category",
      subcategory: "Please Select Sub Category",
      itemname: "Please Select Item Name",
      uom: "",
      rate: "",
      quantity: "",
      amount: "",
    });
    setEducationtodo([]);
    navigate("/expense/expenselist", { replace: "true" });
  };
  //serial no for listing items
  const addSerialNumber = () => {
    const itemsWithSerialNumber = modifiedData?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };

  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  const [autoId, setAutoId] = useState("");
  const fetchAutoId = async () => {
    setPageName(!pageName);
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

  return (
    <Box>
      <Headtitle title={"ADD EXPENSE"} />
      <PageHeading
        title="Add Expenses"
        modulename="Expenses"
        submodulename="Expense"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />
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
                      isDisabled={expensecreate?.company === "Others"}
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
                      isDisabled={expensecreate?.company === "Others"}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2.5} xs={12} sm={12}>
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
                          vendorfrequency: e.paymentfrequency,
                        });
                        setFrequencyValue(e.paymentfrequency);
                        setVendorId(e._id);
                        setVendorModeOfPayments(e?.modeofpayments);
                        fetchVendorNew(e);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={0.5} sm={1} xs={1}>
                  <Button
                    variant="contained"
                    style={{
                      height: "30px",
                      minWidth: "20px",
                      padding: "19px 13px",
                      color: "white",
                      marginTop: "23px",
                      marginLeft: "-10px",
                      background: "rgb(25, 118, 210)",
                    }}
                    onClick={() => {
                      handleClickOpenviewalertvendor();
                    }}
                  >
                    <FaPlus style={{ fontSize: "15px" }} />
                  </Button>
                </Grid>
                <Grid item md={2.5} xs={12} sm={12}>
                  <FormControl size="small" fullWidth>
                    <Typography>
                      Expense Category<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={expanseOpt}
                      placeholder="Please choose Expense Category"
                      value={{
                        label: expensecreate.expansecategory,
                        value: expensecreate.expansecategory,
                      }}
                      onChange={(e) => {
                        setExpensecreate({
                          ...expensecreate,
                          expansecategory: e.value,
                          expansesubcategory:
                            "Please Select Expense Sub Category",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={0.5} sm={1} xs={1}>
                  {isUserRoleCompare?.includes("aexpensecategory") && (
                    <Button
                      variant="contained"
                      style={{
                        height: "30px",
                        minWidth: "20px",
                        padding: "19px 13px",
                        color: "white",
                        marginTop: "23px",
                        marginLeft: "-10px",
                        background: "rgb(25, 118, 210)",
                      }}
                      onClick={() => {
                        handleClickOpenviewalertexpense();
                      }}
                    >
                      <FaPlus style={{ fontSize: "15px" }} />
                    </Button>
                  )}
                </Grid>
                <Grid item lg={3} md={4} xs={12} sm={6}>
                  <FormControl size="small" fullWidth>
                    <Typography>
                      Expense Sub Category<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={expansesubOpt}
                      placeholder="Please Select Expense Sub Category"
                      value={{
                        label: expensecreate.expansesubcategory,
                        value: expensecreate.expansesubcategory,
                      }}
                      onChange={(e) => {
                        setExpensecreate({
                          ...expensecreate,
                          expansesubcategory: e.value,
                        });
                      }}
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
                      type="text"
                      sx={userStyle.input}
                      placeholder="Please Enter Total Bill Amount"
                      value={expensecreate.totalbillamount}
                      onChange={(e) => {
                        const input = e.target.value;
                        if (/^\d*$/.test(input) && input >= 0) {
                          setExpensecreate({
                            ...expensecreate,
                            totalbillamount: input,
                            paidamount: "",
                            balanceamount: "",
                          });
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={2.5} md={4} xs={12} sm={6}>
                  <FormControl size="small" fullWidth>
                    <Typography>Frequency</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      sx={userStyle.input}
                      placeholder="Please Enter Frequency"
                      value={frequencyValue}
                      readOnly
                    />
                  </FormControl>
                </Grid>

                <Grid item lg={2} md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Date<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="date"
                      value={expensecreate.date}
                      onChange={(e) => {
                        setExpensecreate({
                          ...expensecreate,
                          date: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={2} md={4} xs={12} sm={6}>
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
                <Grid item md={2} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Purpose</Typography>
                    <Selects
                      options={purposes}
                      styles={colourStyles}
                      value={{
                        label: expensecreate.purpose,
                        value: expensecreate.purpose,
                      }}
                      onChange={(e) => {
                        setExpensecreate({
                          ...expensecreate,
                          purpose: e.value,
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
                  <Grid item md={3} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Particular Mode <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={particularModeOptions}
                        styles={colourStyles}
                        value={{
                          label: todoDetails.particularmode,
                          value: todoDetails.particularmode,
                        }}
                        onChange={(e) => {
                          setItemAllShow(true);
                          setTodoDetails({
                            ...todoDetails,
                            particularmode: e.value,
                            category: "Please Select Category",
                            subcategory: "Please Select Sub Category",
                            itemname:
                              e.value === "Others"
                                ? ""
                                : "Please Select Item Name",
                            uom: "",
                            rate: "",
                            quantity: "",
                            amount: "",
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>

                  {todoDetails.particularmode === "Stock Material" && (
                    <>
                      <Grid item md={2.5} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Category</Typography>
                          <Selects
                            options={stockCategoryOptions}
                            styles={colourStyles}
                            value={{
                              label: todoDetails.category,
                              value: todoDetails.category,
                            }}
                            onChange={(e) => {
                              setItemAllShow(false);
                              setTodoDetails({
                                ...todoDetails,
                                category: e.value,
                                subcategory: "Please Select Sub Category",
                                itemname:
                                  todoDetails.particularmode === "Others"
                                    ? ""
                                    : "Please Select Item Name",
                                uom: "",
                                rate: "",
                                quantity: "",
                                amount: "",
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={0.5} sm={1} xs={1}>
                        {isUserRoleCompare?.includes("astockcategory") && (
                          <Button
                            variant="contained"
                            style={{
                              height: "30px",
                              minWidth: "20px",
                              padding: "19px 13px",
                              color: "white",
                              marginTop: "23px",
                              marginLeft: "-10px",
                              background: "rgb(25, 118, 210)",
                            }}
                            onClick={() => {
                              handleClickOpenviewalertstockcategory();
                            }}
                          >
                            <FaPlus style={{ fontSize: "15px" }} />
                          </Button>
                        )}
                      </Grid>
                      <Grid item md={3} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Sub Category</Typography>
                          <Selects
                            options={allStockCategory
                              .filter(
                                (item) =>
                                  item.categoryname === todoDetails.category
                              )
                              .map((item) => {
                                return item.subcategoryname.map(
                                  (subCatName) => ({
                                    label: subCatName,
                                    value: subCatName,
                                  })
                                );
                              })
                              .flat()}
                            styles={colourStyles}
                            value={{
                              label: todoDetails.subcategory,
                              value: todoDetails.subcategory,
                            }}
                            onChange={(e) => {
                              if (e.value !== "Please Select Sub Category") {
                                setItemAllShow(false);
                              } else {
                                setItemAllShow(true);
                              }
                              setTodoDetails({
                                ...todoDetails,
                                subcategory: e.value,
                                itemname:
                                  todoDetails.particularmode === "Others"
                                    ? ""
                                    : "Please Select Item Name",
                                uom: "",
                                rate: "",
                                quantity: "",
                                amount: "",
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={2.5} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Item Name <b style={{ color: "red" }}>*</b>
                          </Typography>
                          <Selects
                            options={
                              !itemAllShow
                                ? allStockValues
                                    .filter(
                                      (item) =>
                                        item.stockcategory ===
                                          todoDetails.category &&
                                        item.stocksubcategory ===
                                          todoDetails.subcategory
                                    )
                                    .map((item) => ({
                                      label: item.itemname,
                                      value: item.itemname,
                                      uom: item.uom,
                                    }))
                                : allStockValues.map((item) => ({
                                    label: item.itemname,
                                    value: item.itemname,
                                    uom: item.uom,
                                  }))
                            }
                            styles={colourStyles}
                            value={{
                              label: todoDetails.itemname,
                              value: todoDetails.itemname,
                            }}
                            onChange={(e) => {
                              setTodoDetails({
                                ...todoDetails,
                                itemname: e.value,
                                uom: e.uom,
                                rate: "",
                                quantity: "",
                                amount: "",
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={0.5} sm={1} xs={1}>
                        {isUserRoleCompare?.includes("amanagestockitems") && (
                          <Button
                            variant="contained"
                            style={{
                              height: "30px",
                              minWidth: "20px",
                              padding: "19px 13px",
                              color: "white",
                              marginTop: "23px",
                              marginLeft: "-10px",
                              background: "rgb(25, 118, 210)",
                            }}
                            onClick={() => {
                              handleClickOpenviewalertstockitem();
                            }}
                          >
                            <FaPlus style={{ fontSize: "15px" }} />
                          </Button>
                        )}
                      </Grid>
                      <Grid item md={3} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>UOM</Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            placeholder="Please Enter UOM"
                            value={todoDetails.uom}
                            readOnly
                          />
                        </FormControl>
                      </Grid>
                    </>
                  )}
                  {todoDetails.particularmode === "Others" && (
                    <>
                      <Grid item md={3} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Item Name <b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            placeholder="Please Enter Iteam Name"
                            value={todoDetails.itemname}
                            onChange={(e) => {
                              setTodoDetails({
                                ...todoDetails,
                                itemname: e.target.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            UOM <b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            placeholder="Please Enter UOM"
                            value={todoDetails.uom}
                            onChange={(e) => {
                              setTodoDetails({
                                ...todoDetails,
                                uom: e.target.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                    </>
                  )}
                  <Grid item md={3} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Rate <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Rate"
                        inputMode="decimal"
                        pattern="[0-9]*"
                        value={todoDetails.rate}
                        onChange={(e) => {
                          const value = e.target.value;
                          const regex = /^\d*\.?\d{0,2}$/;
                          if (regex.test(value) || value === "") {
                            setTodoDetails({
                              ...todoDetails,
                              rate: value,
                              amount:
                                Number(value) * Number(todoDetails.quantity),
                            });
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Quantity <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Quantity"
                        value={todoDetails.quantity}
                        onChange={(e) => {
                          const input = e.target.value;
                          if (/^\d*\.?\d*$/.test(input) && input >= 0) {
                            setTodoDetails({
                              ...todoDetails,
                              quantity: input,
                              amount: Number(input) * Number(todoDetails.rate),
                            });
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    md={todoDetails.particularmode !== "Others" ? 2.5 : 3}
                    sm={6}
                    xs={12}
                  >
                    <FormControl fullWidth size="small">
                      <Typography>
                        Amount<b style={{ color: "red" }}>*</b>
                      </Typography>
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
                  <Grid
                    item
                    md={0.1}
                    sm={6}
                    xs={12}
                    sx={{ marginLeft: "-10px" }}
                  >
                    <Button
                      variant="contained"
                      color="success"
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
                      <StyledTableCell>Item Name</StyledTableCell>
                      <StyledTableCell>UOM</StyledTableCell>
                      <StyledTableCell>Rate</StyledTableCell>
                      <StyledTableCell>Quantity</StyledTableCell>
                      <StyledTableCell>Amount</StyledTableCell>
                      <StyledTableCell></StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody align="left">
                    {educationtodo?.length > 0 ? (
                      educationtodo?.map((row, index) => (
                        <StyledTableRow>
                          <StyledTableCell>{index + 1}</StyledTableCell>
                          <StyledTableCell>{row.itemname}</StyledTableCell>
                          <StyledTableCell>{row.uom}</StyledTableCell>
                          <StyledTableCell>{row.rate}</StyledTableCell>
                          <StyledTableCell>{row.quantity}</StyledTableCell>
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
                        colSpan={4}
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
                          paidmode: "Please Select Paid Mode",
                        });
                      }}
                      isDisabled={
                        Number(Expensetotal) !==
                        Number(expensecreate.totalbillamount)
                      }
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
                        options={paidOpt?.filter((data) =>
                          vendorModeOfPayments?.includes(data?.label)
                        )}
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
                          if (
                            Number(e.target.value) <=
                            Number(expensecreate.totalbillamount)
                          ) {
                            setExpensecreate({
                              ...expensecreate,
                              paidamount: e.target.value,
                              balanceamount:
                                expensecreate.totalbillamount - e.target.value,
                            });
                          }
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
                <br /> <br />
                {expensecreate.paidstatus === "Paid" &&
                  expensecreate.paidmode === "Cash" && (
                    <>
                      <br />
                      <br />
                      <br />

                      <Grid
                        item
                        md={4}
                        lg={3}
                        xs={12}
                        sm={12}
                        sx={{ display: "flex" }}
                      >
                        <FormControl fullWidth size="small">
                          <Typography sx={{ fontWeight: "bold" }}>
                            Cash
                          </Typography>
                          <br />

                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            readOnly={true}
                            value={"Cash"}
                            onChange={(e) => {}}
                          />
                        </FormControl>
                      </Grid>
                    </>
                  )}
                <br />
                <br />
                {expensecreate.paidmode === "Bank Transfer" &&
                  expensecreate.paidstatus === "Paid" && (
                    <>
                      <br />
                      <br />

                      <Grid item md={12} xs={8}>
                        <Typography sx={{ fontWeight: "bold" }}>
                          Bank Details
                        </Typography>
                      </Grid>

                      <br />
                      <br />

                      <Grid item md={4} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Bank Name</Typography>
                          <OutlinedInput
                            readOnly={true}
                            value={vendor.bankname}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={4} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Bank Branch Name</Typography>
                          <OutlinedInput
                            readOnly={true}
                            value={vendor.bankbranchname}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={4} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Account Holder Name</Typography>
                          <OutlinedInput
                            readOnly={true}
                            value={vendor.accountholdername}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={4} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Account Number</Typography>
                          <OutlinedInput
                            readOnly={true}
                            value={vendor.accountnumber}
                          />
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        md={4}
                        xs={12}
                        sm={12}
                        sx={{ display: "flex" }}
                      >
                        <FormControl fullWidth size="small">
                          <Typography>IFSC Code</Typography>
                          <OutlinedInput
                            readOnly={true}
                            value={vendor.ifsccode}
                          />
                        </FormControl>
                      </Grid>
                    </>
                  )}
                <br /> <br />
                {expensecreate.paidmode === "UPI" &&
                  expensecreate.paidstatus === "Paid" && (
                    <>
                      <Grid item md={12} xs={8}>
                        <Typography sx={{ fontWeight: "bold" }}>
                          UPI Details
                        </Typography>
                      </Grid>

                      <br />
                      <br />

                      <Grid
                        item
                        md={3}
                        xs={12}
                        sm={12}
                        sx={{ display: "flex" }}
                      >
                        <FormControl fullWidth size="small">
                          <Typography>UPI Number</Typography>
                          <OutlinedInput
                            readOnly={true}
                            value={vendor.upinumber}
                          />
                        </FormControl>
                      </Grid>
                    </>
                  )}
                <br /> <br />
                {expensecreate.paidmode === "Card" &&
                  expensecreate.paidstatus === "Paid" && (
                    <>
                      <Grid md={12} item xs={8}>
                        <Typography sx={{ fontWeight: "bold" }}>
                          Card Details
                        </Typography>
                      </Grid>

                      <br />
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Card Number</Typography>
                          <OutlinedInput
                            readOnly={true}
                            value={vendor.cardnumber}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Card Holder Name</Typography>
                          <OutlinedInput
                            readOnly={true}
                            value={vendor.cardholdername}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Card Transaction Number</Typography>
                          <OutlinedInput
                            readOnly={true}
                            value={vendor.cardtransactionnumber}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Card Type</Typography>
                          <OutlinedInput
                            readOnly={true}
                            value={vendor.cardtype}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={6}>
                        <Typography>Expire At</Typography>
                        <Grid container spacing={1}>
                          <Grid item md={6} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                              <OutlinedInput
                                readOnly={true}
                                value={vendor.cardmonth}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={6} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                              <OutlinedInput
                                readOnly={true}
                                value={vendor.cardyear}
                              />
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        md={3}
                        xs={12}
                        sm={12}
                        sx={{ display: "flex" }}
                      >
                        <FormControl fullWidth size="small">
                          <Typography>Security Code</Typography>
                          <OutlinedInput
                            readOnly={true}
                            value={vendor.cardsecuritycode}
                          />
                        </FormControl>
                      </Grid>
                    </>
                  )}
                <br />
                <br />
                {expensecreate.paidmode === "Cheque" &&
                  expensecreate.paidstatus === "Paid" && (
                    <>
                      <Grid item md={12} xs={8}>
                        <Typography sx={{ fontWeight: "bold" }}>
                          Cheque Details
                        </Typography>
                      </Grid>

                      <br />

                      <Grid
                        item
                        md={3}
                        xs={12}
                        sm={12}
                        sx={{ display: "flex" }}
                      >
                        <FormControl fullWidth size="small">
                          <Typography>Cheque Number</Typography>
                          <OutlinedInput
                            readOnly={true}
                            value={vendor.chequenumber}
                          />
                        </FormControl>
                      </Grid>
                    </>
                  )}
                <Grid container spacing={2}>
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
                      <Button sx={userStyle.btncancel} onClick={handleCancel}>
                        Cancel
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
          <br />
          <br />
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
          {/* Amount Mismatch Alert Dialog */}
          <Box>
            <Dialog
              open={isErrorOpenAmount}
              onClose={handleCloseerrAmount}
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
                  sx={{ fontSize: "100px", color: "orange" }}
                />
                <Typography variant="h6" style={{ color: "red" }}>
                  {
                    "Are you sure? Paid Amount is less than Total Bill Amount.Do you want to save?"
                  }
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button sx={userStyle.btncancel} onClick={handleCloseerrAmount}>
                  Cancel
                </Button>
                &nbsp;
                <Button
                  variant="contained"
                  style={{
                    padding: "7px 13px",
                    color: "white",
                    background: "rgb(25, 118, 210)",
                  }}
                  onClick={sendRequest}
                >
                  ok
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </>
      )}
      {/* dialog box for expense details */}

      <Dialog
        open={openviewalertexpense}
        onClose={handleClickOpenviewalertexpense}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth={true}
      >
        <ExpCategorypopup
          setExpenseAuto={setExpenseAuto}
          handleCloseviewalertexpense={handleCloseviewalertexpense}
        />
      </Dialog>
      {/* dialog box for stock category */}

      <Dialog
        open={openviewalertstockcategory}
        onClose={handleClickOpenviewalertstockcategory}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth={true}
      >
        <StockCategoryPopup
          setStockCategoryAuto={setStockCategoryAuto}
          handleCloseviewalertstockcategory={handleCloseviewalertstockcategory}
        />
      </Dialog>
      {/* dialog box for manage stock items */}

      <Dialog
        open={openviewalertstockitem}
        onClose={handleClickOpenviewalertstockitem}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        sx={{
          overflow: "visible",
          "& .MuiPaper-root": {
            overflow: "visible",
          },
        }}
        fullWidth={true}
      >
        <ManageStockItemsPopup
          setStockItemAuto={setStockItemAuto}
          handleCloseviewalertstockitem={handleCloseviewalertstockitem}
        />
      </Dialog>
      {/* dialog box for vendor details */}

      <Dialog
        open={openviewalertvendor}
        onClose={handleClickOpenviewalertvendor}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth={true}
      >
        <VendorPopup
          setVendorAuto={setVendorAuto}
          handleCloseviewalertvendor={handleCloseviewalertvendor}
        />
      </Dialog>
    </Box>
  );
}
export default Addexpense;
