import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  OutlinedInput,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableFooter,
  TableHead,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import axios from "axios";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import Selects from "react-select";
import AlertDialog from "../../components/Alert";
import {
  paidOpt,
  particularModeOptions,
  statusOpt,
} from "../../components/Componentkeyword";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import { StyledTableCell, StyledTableRow } from "../../components/Table";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import VendorPopup from "../account/vendorpop";
import ExpCategorypopup from "./expanseaddpopup";
import ManageStockItemsPopup from "./ManageStockItemsPopup";
import StockCategoryPopup from "./StockCategoryPopup";

function Addexpense() {
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
  };
  const handleClosePopupMalert = () => {
    setOpenPopupMalert(false);
  };

  const handleClickOpenPopup = () => {
    setOpenPopup(true);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };

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

  // Your holidays array
  // const holidays = ["2024-11-10", "2024-11-22"];
  const [holidays, setHolidays] = useState([])

  const fetchHoliday = async () => {
    setPageName(!pageName);
    try {
      let res_status = await axios.post(SERVICE.ALL_HOLIDAY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assignbranch: accessbranch,
      });



      setHolidays(res_status?.data?.holiday);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  // Helper function to find the next available date that's not a Sunday or a holiday
  const getNextValidDate = (date, holidays) => {
    const holidaysSet = new Set(holidays); // Store holidays for quick lookup
    let nextDate = moment(date); // Convert the date to a Moment instance

    // Increment the date until it's not a Sunday or a holiday
    while (nextDate.day() === 0 || holidaysSet.has(nextDate.format("YYYY-MM-DD"))) {
      nextDate.add(1, 'day'); // Move to the next day
    }

    return nextDate;
  };

  const setDueDate = (e) => {
    let dueDate = ""; // Default value if not monthly
    if (e.paymentfrequency === "Monthly" && e.monthlyfrequency) {
      // Get the current month and year
      const today = moment();
      let proposedDate = moment(`${today.year()}-${today.month() + 1}-${e.monthlyfrequency}`, "YYYY-MM-DD");

      // If proposedDate is in the past, set it to next month
      if (proposedDate.isBefore(today, 'day')) {
        proposedDate.add(1, 'month');
      }

      // Filter holidays specific to the selected company, branch, and unit
      let mappedHolidays = holidays
        ?.filter(data =>
          data.company?.includes(expensecreate?.company) &&
          data.applicablefor?.includes(expensecreate?.branch) &&
          data.unit?.includes(expensecreate?.unit)
        )
        ?.map(item => item?.date);


      // Get the valid due date (not Sunday or a holiday)
      const validDueDate = getNextValidDate(proposedDate, mappedHolidays);
      dueDate = validDueDate.format("YYYY-MM-DD"); // Format as YYYY-MM-DD
    } else if (e.paymentfrequency === "Weekly" && e.weeklyfrequency) {
      // Set today to "2024-05-17"
      const today = moment(expensecreate?.date);

      // Map days of the week to their numeric values (Sunday = 0, Monday = 1, ..., Saturday = 6)
      const dayMapping = {
        Sunday: 0,
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6
      };

      // Get the numeric value of the desired day
      const targetDay = dayMapping[e.weeklyfrequency];

      // Calculate the next target day from today
      let proposedDate = today.clone().isoWeekday(targetDay);

      // If the proposed day is earlier than today, move to the next week
      if (proposedDate.isBefore(today, 'day')) {
        proposedDate.add(1, 'week');
      }

      // Filter holidays specific to the selected company, branch, and unit
      let mappedHolidays = holidays
        ?.filter(data =>
          data.company?.includes(expensecreate?.company) &&
          data.applicablefor?.includes(expensecreate?.branch) &&
          data.unit?.includes(expensecreate?.unit)
        )
        ?.map(item => item?.date);

      // Get the valid due date (not a holiday)
      const validDueDate = getNextValidDate(proposedDate, mappedHolidays);
      dueDate = validDueDate.format("YYYY-MM-DD"); // Format as YYYY-MM-DD
    }

    setExpensecreate({
      ...expensecreate,
      vendorname: e.value,
      vendorfrequency: e.paymentfrequency,
      paidmode: "Please Select Paid Mode",
      duedate: dueDate
    });
  };
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


  const [educationtodo, setEducationtodo] = useState([]);
  const [upload, setUpload] = useState([]);
  const [vendorOpt, setVendor] = useState([]);
  const [expanseOpt, setExpanse] = useState([]);
  const [expansesubOpt, setExpanseSub] = useState([]);
  const [frequencyValue, setFrequencyValue] = useState("");
  const [groupedVendorNames, setGroupedVendorNames] = useState([]);
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
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  useEffect(() => {
    fetchPurposeDropdowns();
    getStockCategory();
    fetchStockItems();
    fetchAutoId();
    fetchHoliday();
  }, []);

  useEffect(() => {
    fetchVendor();
    fetchVendorGrouping();
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
    buttonStyles,
  } = useContext(UserRoleAccessContext);
  // Get the current URL
  const url = new URL(window.location.href);
  // Use URLSearchParams to extract query parameters
  // Get the value of the 'pathname' query parameter
  const accessbranch = isUserRoleAccess?.role?.includes("Manager")
    ? isAssignBranch?.map((data) => ({
      branch: data.branch,
      company: data.company,
      unit: data.unit,
    }))
    : isAssignBranch
      ?.filter((data) => {
        let fetfinalurl = [];
        if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 &&
          data?.subpagenameurl?.length !== 0 &&
          data?.subsubpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subsubpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 &&
          data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.mainpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.submodulenameurl;
        } else if (data?.modulenameurl?.length !== 0) {
          fetfinalurl = data.modulenameurl;
        } else {
          fetfinalurl = [];
        }
        const remove = [
          window.location.pathname?.substring(1),
          window.location.pathname,
        ];

        return fetfinalurl?.some((item) => remove?.includes(item));
      })
      ?.map((data) => ({
        branch: data.branch,
        company: data.company,
        unit: data.unit,
      }));

  let snos = 1;


  //alert model for vendor details
  const [openviewalertvendor, setOpenviewalertvendro] = useState(false);
  // view model
  const handleClickOpenviewalertvendor = () => {
    setOpenviewalertvendro(true);
  }; const [sasassendDataToParent, sendDataToParent] = useState("")

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
      setPopupContentMalert("Please Select Particular Mode!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      todoDetails.particularmode !== "Others" &&
      todoDetails.category !== "Please Select Category" &&
      todoDetails.subcategory === "Please Select Sub Category"
    ) {
      setPopupContentMalert("Please Select Sub Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      todoDetails.particularmode !== "Others" &&
      todoDetails.itemname === "Please Select Item Name"
    ) {
      setPopupContentMalert("Please Select Item Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      todoDetails.particularmode === "Others" &&
      todoDetails.itemname === ""
    ) {
      setPopupContentMalert("Please Enter Item Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      todoDetails.particularmode === "Others" &&
      todoDetails.uom === ""
    ) {
      setPopupContentMalert("Please Enter UOM!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (todoDetails.rate === "" || todoDetails.rate == 0) {
      setPopupContentMalert("Please Enter Rate!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (todoDetails.quantity === "" || todoDetails.quantity == 0) {
      setPopupContentMalert("Please Enter Quantity!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (todoDetails.amount === "" || todoDetails.amount == 0) {
      setPopupContentMalert("Please Enter Amount!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Item Already Exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      Number(todoDetails.amount) + Number(Expensetotal) >
      Number(expensecreate.totalbillamount)
    ) {
      setPopupContentMalert("Amount Exceeds Total Bill Amount!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
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
    const selectedFiles = Array.from(event.target.files); // Convert FileList to Array
    if (!selectedFiles.length) return;

    let largeFiles = []; // To store names of files larger than 1MB

    // Filter files that are <= 1MB (1,024,000 bytes)
    const filteredFiles = selectedFiles.filter((file) => {
      if (file.size > 1024000) {
        largeFiles.push(file.name); // Collect large file names
        return false;
      }
      return true;
    });

    // If there are large files, show a single popup message
    if (largeFiles.length > 0) {
      setPopupContentMalert(
        `The following files are larger than 1MB and will not be uploaded:\n${largeFiles.join(", ")}`
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }

    if (filteredFiles.length === 0) return; // If no valid files, exit

    setUpload((prevFiles) => [
      ...prevFiles,
      ...filteredFiles.map((file) => ({
        file,
      })),
    ]);
  };

  // const handleResumeUpload = (event) => {
  //   const resume = event.target.files;
  //   for (let i = 0; i < resume.length; i++) {
  //     const reader = new FileReader();
  //     const file = resume[i];
  //     reader.readAsDataURL(file);
  //     reader.onload = () => {
  //       setUpload((prevFiles) => [
  //         ...prevFiles,
  //         {
  //           name: file.name,
  //           preview: reader.result,
  //           // data: reader.result.split(",")[1],
  //           remark: "resume file",
  //         },
  //       ]);
  //     };
  //   }
  // };
  const renderFilePreview = async (file) => {
    const url = window.URL.createObjectURL(file);
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
        ...res?.data?.vendordetails?.filter(item => item.vendorstatus === "Active")?.map((t) => ({
          ...t,
          label: t.vendorname,
          value: t.vendorname,
        })),
      ]);
      setVendorAuto("");
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  const [vendorGrouping, setVendorGrouping] = useState([])
  const fetchVendorGrouping = async () => {
    try {
      let res = await axios.get(SERVICE.ALL_VENDORGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setVendorGrouping([
        ...res?.data?.vendorgrouping?.map((t) => ({
          ...t,
          label: t.name,
          value: t.name,
        }))
      ]);
      setVendorAuto("");
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
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
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
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
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
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
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  //add function
  const sendRequest = async () => {
    setPageName(!pageName);
    let autoIds = await fetchAutoId();
    try {

      let formData = new FormData();

      if (upload.length > 0) {
        upload.forEach((item) => {
          formData.append("files", item.file); // `files` is the key for multiple files
        });
      }


      const jsonData = {
        expansecategory: String(expensecreate.expansecategory),
        expansesubcategory: String(expensecreate.expansesubcategory),
        vendorgrouping: String(expensecreate.vendorgrouping),
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
            ? expensecreate.totalbillamount
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
        paymentduereminderlog: expensecreate.paidstatus === "Paid" ? [
          {
            balanceamount: Number(
              expensecreate.paidstatus === "Not Paid"
                ? expensecreate.totalbillamount
                : expensecreate.balanceamount
            ),
            expensetotal: expensecreate.totalbillamount,
            modeofpayments: expensecreate.paidmode,
            payamountdate: expensecreate.date,
            payamount: Number(
              expensecreate.paidstatus === "Not Paid" ? 0 : expensecreate.paidamount
            ),
            bankname: expensecreate.paidmode === "Bank Transfer"
              ? String(vendor.bankname)
              : "",
            bankbranchname: expensecreate.paidmode === "Bank Transfer"
              ? vendor.bankbranchname
              : "",
            accountholdername: expensecreate.paidmode === "Bank Transfer"
              ? vendor.accountholdername
              : "",
            accountnumber: expensecreate.paidmode === "Bank Transfer"
              ? vendor.accountnumber
              : "",
            ifsccode: expensecreate.paidmode === "Bank Transfer" ? vendor.ifsccode : "",

            upinumber: expensecreate.paidmode === "UPI" ? vendor.upinumber : "",

            cardnumber: expensecreate.paidmode === "Card" ? vendor.cardnumber : "",
            cardholdername: expensecreate.paidmode === "Card"
              ? vendor.cardholdername
              : "",
            cardtransactionnumber: expensecreate.paidmode === "Card"
              ? vendor.cardtransactionnumber
              : "",
            cardtype: expensecreate.paidmode === "Card" ? vendor.cardtype : "",
            cardmonth: expensecreate.paidmode === "Card" ? vendor.cardmonth : "",
            cardyear: expensecreate.paidmode === "Card" ? vendor.cardyear : "",
            cardsecuritycode: expensecreate.paidmode === "Card"
              ? vendor.cardsecuritycode
              : "",
            chequenumber: expensecreate.paidmode === "Cheque"
              ? vendor.chequenumber
              : "",
            addedby: [
              {
                name: String(isUserRoleAccess.companyname),
                date: String(new Date()),
              },
            ],
          }] : [],
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      }


      formData.append("jsonData", JSON.stringify(jsonData));

      let queuecreate = await axios.post(SERVICE.EXPENSES_CREATE, formData, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

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
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      navigate("/expense/expenselist", { replace: true });
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  //submit option for saving
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (expensecreate.company === "Please Select Company") {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      expensecreate?.company !== "Others" &&
      expensecreate.branch === "Please Select Branch"
    ) {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      expensecreate?.company !== "Others" &&
      expensecreate.unit === "Please Select Unit"
    ) {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (expensecreate.vendorgrouping === "" || !expensecreate.vendorgrouping) {
      setPopupContentMalert("Please Select Vendor!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (expensecreate.vendorname === "Please Select Vendor") {
      setPopupContentMalert("Please Select Vendor!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      expensecreate.expansecategory === "Please Select Expense Category"
    ) {
      setPopupContentMalert("Please Select Expense Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      expensecreate.expansesubcategory === "Please Select Expense Sub Category"
    ) {
      setPopupContentMalert("Please Select Expense Sub Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (expensecreate.totalbillamount === "") {
      setPopupContentMalert("Please Enter Total Bill Amount!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (expensecreate.date === "") {
      setPopupContentMalert("Please Select Date!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (educationtodo.length === 0) {
      setPopupContentMalert("Please Add Any Expense!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (Number(Expensetotal) !== Number(expensecreate.totalbillamount)) {
      setPopupContentMalert(
        "Total Bill Amount must be equal to Expense Total!"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      expensecreate.paidstatus === "Paid" &&
      expensecreate.paidmode === "Please Select Paid Mode"
    ) {
      setPopupContentMalert("Please Select Paid Mode!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      expensecreate.paidstatus === "Paid" &&
      expensecreate.paidamount === ""
    ) {
      setPopupContentMalert("Please Enter Paid Amount!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (expensecreate.totalbillamount < Expensetotal) {
      setPopupContentMalert("Amount Exceeds Total Bill!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      let queuecreate = await axios.post(SERVICE.EXPENSE_MONTHLY_LIMIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: expensecreate.company,
        branch: expensecreate.company === "Others" ? "" : expensecreate.branch,
        id: null,
        totalbillamount: expensecreate.totalbillamount,
        date: expensecreate.date,
      });
      console.log(queuecreate?.data, 'reslimit')
      let limitValues = queuecreate?.data?.finaldata;
      if (limitValues?.limitexist && limitValues?.isExceeded) {
        setPopupContentMalert(`Your ${expensecreate.branch} branch limit ${limitValues?.totalLimit} usage limit ${limitValues?.totalExpenseThisMonth}. Monthly expense limit for ${limitValues?.monthName} exceeded. Please contact the administrator.`);
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
        return;
      } else if (!limitValues?.limitexist) {
        let checkCond = expensecreate.paidstatus === "Paid" &&
          Number(expensecreate.paidamount) !== Number(Expensetotal);
        let message = checkCond ? `No expense limit found and Paid Amount is less than Total Bill Amount, Do You Still Want to Add Expense` : `No expense limit found, Do You Still Want to Add Expense?.`
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{message}</p>
          </>
        );
        handleClickOpenerr();
      } else if (
        expensecreate.paidstatus === "Paid" &&
        Number(expensecreate.paidamount) !== Number(Expensetotal)
      ) {
        handleClickOpenerrAmount();
      } else {

        sendRequest();
      }

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
    setGroupedVendorNames([]);
    setFrequencyValue("");
    setVendorId("");
    setVendorModeOfPayments("");
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };
  const handleCancel = () => {
    setExpensecreate({
      expansecategory: "Please Select Expense Category",
      expansesubcategory: "Please Select Expense Sub Category",
      referenceno: "",
      company: "Please Select Company",
      branch: "Please Select Branch",
      unit: "Please Select Unit",
      vendorgrouping: "",
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
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
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
      pagename: String("Expense Add"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),

      addedby: [
        {
          name: String(isUserRoleAccess.companyname),
          date: String(new Date()),
        },
      ],
    });
  };

  return (
    <Box>
      <Headtitle title={"ADD EXPENSE"} />
      <PageHeading
        title="Add Expenses"
        modulename="Expenses"
        submodulename="Add Expense"
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
          {isUserRoleCompare?.includes("aaddexpense") && (
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
                        ...accessbranch?.map((data) => ({
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
                          vendorgrouping: "",
                          vendorname: "Please Select Vendor",
                          duedate: "",
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
                      options={accessbranch
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
                          vendorgrouping: "",
                          vendorname: "Please Select Vendor",
                          duedate: "",
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
                      options={accessbranch
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
                          vendorgrouping: "",
                          vendorname: "Please Select Vendor",
                          duedate: "",
                        });
                      }}
                      isDisabled={expensecreate?.company === "Others"}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl size="small" fullWidth>
                    <Typography>
                      Vendor Grouping<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={vendorGrouping.filter((item, index, self) => {
                        return (
                          self.findIndex(
                            (i) =>
                              i.label === item.label && i.value === item.value
                          ) === index
                        );
                      })}
                      placeholder="Please choose Vendor Grouping"
                      value={{
                        label: !expensecreate.vendorgrouping ? "Please Select Vendor Grouping" : expensecreate.vendorgrouping,
                        value: !expensecreate.vendorgrouping ? "Please Select Vendor Grouping" : expensecreate.vendorgrouping,
                      }}
                      onChange={(e) => {
                        setExpensecreate({
                          ...expensecreate,
                          vendorgrouping: e.value,
                          vendorname: "Please Select Vendor",
                          vendorfrequency: "",
                          duedate: "",
                          paidmode: "Please Select Paid Mode",
                        });
                        setGroupedVendorNames(vendorGrouping?.filter(item => item.name === e.value)?.map(data => data?.vendor));
                        setFrequencyValue("");
                        setVendorId("");
                        setVendorModeOfPayments("");
                      }}
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
                      options={vendorOpt?.filter(data =>
                        groupedVendorNames?.includes?.(data?.value)
                      )}
                      placeholder="Please choose Vendor Name"
                      value={{
                        label: expensecreate.vendorname,
                        value: expensecreate.vendorname,
                      }}
                      onChange={(e) => {
                        // setExpensecreate({
                        //   ...expensecreate,
                        //   vendorname: e.value,
                        //   vendorfrequency: e.paymentfrequency,
                        //   paidmode: "Please Select Paid Mode",
                        //   duedate:e.paymentfrequency === "Monthly" ? `${}`:""
                        // });
                        setDueDate(e)
                        setFrequencyValue(e.paymentfrequency);
                        setVendorId(e._id);
                        setVendorModeOfPayments(e?.modeofpayments);
                        setVendorNew((prev) => ({
                          ...prev,
                          ...e
                        }));
                        // fetchVendorNew(e);
                      }}
                    />
                  </FormControl>
                </Grid>
                {isUserRoleCompare?.includes("avendormaster") && (
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
                  </Grid>)}
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
                {isUserRoleCompare?.includes("aexpensecategory") && (
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
                        handleClickOpenviewalertexpense();
                      }}
                    >
                      <FaPlus style={{ fontSize: "15px" }} />
                    </Button>
                  </Grid>
                )}
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
                          duedate: "",
                          // vendorname: "Please Select Vendor",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={2} md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Due Date</Typography>
                    <OutlinedInput
                      id="to-date"
                      type="date"
                      value={expensecreate.duedate}
                      onChange={(e) => {
                        setExpensecreate({
                          ...expensecreate,
                          duedate: e.target.value,
                        });
                      }}
                      inputProps={{
                        min: expensecreate.date,
                        // max: today
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
                  <Button variant="contained" size="small" component="label" sx={buttonStyles.buttonsubmit}>
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
                    upload?.map((data, index) => (
                      <>
                        <Grid container spacing={2}>
                          <Grid item lg={10} md={8} sm={8} xs={8}>
                            <Typography>{data.file.name}</Typography>
                          </Grid>
                          <Grid item lg={1} md={1} sm={1} xs={1}>
                            <VisibilityOutlinedIcon
                              style={{
                                fontsize: "large",
                                color: "#357AE8",
                                cursor: "pointer",
                              }}
                              onClick={() => renderFilePreview(data.file)}
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
                      {isUserRoleCompare?.includes("astockcategory") && (
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
                              handleClickOpenviewalertstockcategory();
                            }}
                          >
                            <FaPlus style={{ fontSize: "15px" }} />
                          </Button>
                        </Grid>
                      )}
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
                      {isUserRoleCompare?.includes("amanagestockitems") && (
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
                              handleClickOpenviewalertstockitem();
                            }}
                          >
                            <FaPlus style={{ fontSize: "15px" }} />
                          </Button>
                        </Grid>
                      )}
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
                            onChange={(e) => { }}
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
                        sx={buttonStyles.buttonsubmit}
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
                      <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                        Clear
                      </Button>
                    </Grid>
                  </Grid>
                  <Grid item lg={1} md={2} sm={12} xs={12}>
                    <Typography>&ensp;</Typography>
                    <Grid item md={12} sm={12} xs={12}>
                      <Button
                        sx={buttonStyles.btncancel}
                        onClick={handleCancel}
                      >
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
          {/* ALERT DIALOG */}
          <Box>
            <Dialog
              open={isErrorOpen}
              onClose={handleCloseerr}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogContent
                sx={{ width: "450px", textAlign: "center", alignItems: "center" }}
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
                  variant="outlined"
                  style={{
                    padding: "7px 13px",
                    color: "#000",

                  }}
                  onClick={handleCloseerr}
                >
                  close
                </Button>
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
                <Button
                  sx={buttonStyles.btncancel}
                  onClick={handleCloseerrAmount}
                >
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
        sx={{ marginTop: "50px" }}
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
        sx={{ marginTop: "50px" }}
        fullWidth={true}
      >
        <VendorPopup
          setVendorAuto={setVendorAuto}
          handleCloseviewalertvendor={handleCloseviewalertvendor}
          sendDataToParent={sendDataToParent}
        />
      </Dialog>

      <AlertDialog
        openPopup={openPopup}
        handleClosePopup={handleClosePopup}
        popupContent={popupContent}
        popupSeverity={popupSeverity}
      />
      <MessageAlert
        openPopup={openPopupMalert}
        handleClosePopup={handleClosePopupMalert}
        popupContent={popupContentMalert}
        popupSeverity={popupSeverityMalert}
      />
    </Box>
  );
}
export default Addexpense;