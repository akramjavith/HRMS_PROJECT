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
import {
  paidOpt,
  statusOpt,
  particularModeOptions,
} from "../../components/Componentkeyword";
import "jspdf-autotable";
import axios from "axios";
import Selects from "react-select";
import { SERVICE } from "../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import ExpCategorypopup from "./expanseaddpopup";
import VendorPopup from "../account/vendorpop"; import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { FaPlus } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import ManageStockItemsPopup from "./ManageStockItemsPopup";
import PageHeading from "../../components/PageHeading";
import moment from "moment-timezone";
import AlertDialog from "../../components/Alert";
import MessageAlert from "../../components/MessageAlert";
import StockCategoryPopup from "./StockCategoryPopup";
function EditExpense() {
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

  const [openPopup, setOpenPopup] = useState(false);
  const handleClickOpenPopup = () => {
    setOpenPopup(true);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
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

  const [stockCategoryAuto, setStockCategoryAuto] = useState("");
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
    vendorgrouping: "",
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    vendorname: "Please Select Vendor",
    purpose: "Please Select Purpose",
    totalbillamount: "",
    date,
    files: "",
    vendorfrequency: "Please Select Frequency",
    paidstatus: "Not Paid",
    duedate: "",
    expansenote: "",
    paidmode: "Please Select Paid Mode",
    expensetotal: "",
    balanceamount: "",
    paidamount: "",
    calculationbalamount: "",
  });
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
  const [groupedVendorNames, setGroupedVendorNames] = useState([]);

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
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [isErrorOpenAmount, setIsErrorOpenAmount] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [items, setItems] = useState([]);
  const [listExpense, setlistExpense] = useState([]);
  const handleCloseviewalertstockitem = () => {
    setOpenviewalertstockitem(false);
  };
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
  const [educationtodo, setEducationtodo] = useState([]);

  const [vendorOpt, setVendor] = useState([]);
  const [expanseOpt, setExpanse] = useState([]);
  const [expansesubOpt, setExpanseSub] = useState([]);
  const [espenseCheck, setExpenseCheck] = useState(false);
  const { id } = useParams();
  const [itemAllShow, setItemAllShow] = useState(true);
  useEffect(() => {
    getCode(id);
    fetchHoliday();
  }, []);

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
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const [purposes, setPurposes] = useState([]);
  const [frequencyValue, setFrequencyValue] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [vendorModeOfPayments, setVendorModeOfPayments] = useState([]);

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
    fetchStockItems();

  }, []);
  useEffect(() => {
    getStockCategory();
  }, [stockCategoryAuto]);
  const [vendorGrouping, setVendorGrouping] = useState([])
  const fetchVendorGrouping = async () => {
    try {
      let res = await axios.get(SERVICE.ALL_VENDORGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let datas = [
        ...res?.data?.vendorgrouping?.map((t) => ({
          ...t,
          label: t.name,
          value: t.name,
        }))
      ]
      setVendorGrouping(datas);
      setVendorAuto("");
      return datas
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
  const params = new URLSearchParams(url.search);

  // Get the value of the 'pathname' query parameter
  const pathname = params.get("pathname");
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
          data?.subpagenameurl?.length !== 0 && data?.subpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 && data?.mainpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.mainpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 && data?.submodulenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.submodulenameurl;
        } else if (data?.modulenameurl?.length !== 0) {
          fetfinalurl = data.modulenameurl;
        } else {
          fetfinalurl = [];
        }

        // Check if the pathname exists in the URL
        return fetfinalurl?.includes(pathname);
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
  };
  const [sasassendDataToParent, sendDataToParent] = useState("")
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
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
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
  // Stores both base64 & multer files
  const [uploadBase64, setUploadBase64] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [upload, setUpload] = useState([]);
  const [deletedFiles, setDeletedFiles] = useState([]);   // Stores files to be removed

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
  const handleResumeUploadBase64 = (event) => {
    const resume = event.target.files;
    for (let i = 0; i < resume.length; i++) {
      const reader = new FileReader();
      const file = resume[i];
      reader.readAsDataURL(file);
      reader.onload = () => {
        setUploadBase64((prevFiles) => [
          ...prevFiles,
          {
            name: file.name,
            preview: reader.result,
            // data: reader.result.split(",")[1],
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

  const renderFilePreviewMulter = async (file) => {
    const url = window.URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };
  const renderFilePreviewMulterUploded = async (file) => {
    if (!file) return false;
    const imageUrl = `${SERVICE.VEIW_EXPENSE_FILES}/${file.filename}`;
    window.open(imageUrl, '_blank'); // Open image in a new tab
  };
  const handleFileDelete = (index) => {
    setUpload((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };
  const handleFileDeleteBase64 = (index) => {
    setUploadBase64((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };
  const handleFileDeleteUploaded = (index) => {
    setUploadedFiles((prevFiles) => {
      const fileToDelete = prevFiles[index];

      // Store the deleted file separately
      setDeletedFiles((prevDeleted) => [...prevDeleted, fileToDelete]);

      // Remove from uploadedFiles state
      return prevFiles.filter((_, i) => i !== index);
    });

  };
  const [oldTotalAmount, setOldTotalAmount] = useState(0)
  const [oldPaidAmount, setOldPaidAmount] = useState(0)
  const getCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.EXPENSES_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let groupings = await fetchVendorGrouping();
      const alldata = { ...res?.data?.sexpenses, calculationbalamount: Number(res?.data?.sexpenses?.balanceamount) }
      setExpensecreate(alldata);
      // await fetchVendorNew({ value: res?.data?.sexpenses.vendorname });
      setVendorNew(res?.data?.sexpenses);
      await fetchVendorSingle(res?.data?.sexpenses?.vendorid);
      setOldTotalAmount(res?.data?.sexpenses?.totalbillamount || 0);
      setOldPaidAmount(res?.data?.sexpenses?.paidamount || 0);
      setEducationtodo(res?.data?.sexpenses?.tododetails);
      setFrequencyValue(res?.data?.sexpenses?.vendorfrequency);
      setVendorId(res?.data?.sexpenses?.vendorid);
      setUpload([]);
      setUploadBase64(res?.data?.sexpenses?.files?.filter(data => data.preview));
      let multerUploadedFiles = res?.data?.sexpenses?.files?.filter(data => !data.preview)
      setUploadedFiles(multerUploadedFiles);
      setGroupedVendorNames(groupings?.filter(item => item.name === res?.data?.sexpenses?.vendorgrouping)?.map(data => data?.vendor));
      await fetchExpenseSubCate(res?.data?.sexpenses?.expansecategory);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const fetchExpenseSubCate = async (e) => {
    try {
      let res = await axios.post(SERVICE.EXPENSESUBCAT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        categoryname: String(e),
      });
      const filteredExpSubcat = [
        ...res?.data?.subcat
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
      setExpanseSub(filteredExpSubcat);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const handleClickOpenviewalertstockitem = () => {
    setOpenviewalertstockitem(true);
  };
  const [stockItemAuto, setStockItemAuto] = useState("");
  useEffect(() => {
    fetchStockItems();
  }, [stockItemAuto]);

  const [openviewalertstockitem, setOpenviewalertstockitem] = useState(false);
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
  const fetchVendorSingle = async (id) => {
    try {
      let res = await axios.get(`${SERVICE.SINGLE_VENDORDETAILS}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setVendorModeOfPayments(res?.data?.svendordetails?.modeofpayments);
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

  //get stock items.
  const fetchStockItems = async () => {
    try {
      let res_status = await axios.get(SERVICE.MANAGESTOCKITEMS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setAllStockValues(res_status?.data?.managestockitems);
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

      setExpenseCheck(true);
      setExpenseAuto("");
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  //editing the single data...
  let expenseid = expensecreate._id;
  let updateby = expensecreate.updatedby;
  //add function

  const sendRequest = async () => {
    setPageName(!pageName);

    try {

      if (uploadBase64?.length > 0) {
        const formData = new FormData();



        const jsonData = {
          expansecategory: String(expensecreate.expansecategory),
          vendorgrouping: String(expensecreate.vendorgrouping),
          expansesubcategory: String(expensecreate.expansesubcategory),
          referenceno: String(expensecreate.referenceno),
          company: String(expensecreate.company),
          branch:
            expensecreate.company === "Others"
              ? ""
              : String(expensecreate.branch),
          unit:
            expensecreate.company === "Others"
              ? ""
              : String(expensecreate.unit),
          vendorname: String(expensecreate.vendorname),
          purpose: String(expensecreate.purpose),
          vendorfrequency: String(frequencyValue),
          vendorid: String(vendorId),
          source: "Expense",
          date: String(expensecreate.date),
          duedate: String(expensecreate.duedate ? expensecreate.duedate : ""),
          expansenote: String(
            expensecreate.expansenote ? expensecreate.expansenote : ""
          ),
          expensetotal: expensecreate.paidstatus === "Not Paid"
            ? String(expensecreate?.calculationbalamount) : String(Expensetotal ? Expensetotal : ""),
          totalbillamount: String(expensecreate.totalbillamount),
          files: [...uploadBase64],
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
            expensecreate.paidstatus === "Not Paid"
              ? ""
              : expensecreate.paidmode
          ),
          paidamount: Number(
            expensecreate.paidstatus === "Not Paid"
              ? 0
              : expensecreate.paidamount
          ),
          balanceamount: Number(
            expensecreate.paidstatus === "Not Paid"
              ? expensecreate?.calculationbalamount || expensecreate.totalbillamount
              : expensecreate?.calculationbalamount
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
          // paymentduereminderlog: paymentDueReminderData?.paymentduereminderlog[0],
          ...((Number(oldPaidAmount) !== Number(expensecreate.paidamount)) &&
          {
            paymentduereminderlog: expensecreate.paidstatus === "Paid" ? [
              ...((expensecreate.paymentduereminderlog?.length > 0 && Number(oldTotalAmount) === Number(expensecreate.totalbillamount)) ? expensecreate.paymentduereminderlog : []),
              {
                balanceamount: Number(
                  expensecreate.paidstatus === "Not Paid"
                    ? expensecreate?.calculationbalamount || expensecreate.totalbillamount
                    : expensecreate?.calculationbalamount
                ),
                expensetotal: expensecreate.totalbillamount,
                modeofpayments: expensecreate.paidmode,
                payamountdate:
                  expensecreate.paidstatus === "Not Paid" ? String(expensecreate.date) : String(expensecreate.date),
                payamount: Number(
                  expensecreate.paidstatus === "Not Paid" ? 0 : expensecreate.paidamount
                ),
                bankname:
                  expensecreate.paidmode === "Bank Transfer" ? String(vendor?.bankname) : "",
                bankbranchname:
                  expensecreate.paidmode === "Bank Transfer" ? vendor?.bankbranchname : "",
                accountholdername:
                  expensecreate.paidmode === "Bank Transfer" ? vendor?.accountholdername : "",
                accountnumber:
                  expensecreate.paidmode === "Bank Transfer" ? vendor?.accountnumber : "",
                ifsccode: expensecreate.paidmode === "Bank Transfer" ? vendor?.ifsccode : "",
                upinumber: expensecreate.paidmode === "UPI" ? vendor?.upinumber : "",
                cardnumber: expensecreate.paidmode === "Card" ? vendor?.cardnumber : "",
                cardholdername:
                  expensecreate.paidmode === "Card" ? vendor?.cardholdername : "",
                cardtransactionnumber:
                  expensecreate.paidmode === "Card" ? vendor?.cardtransactionnumber : "",
                cardtype: expensecreate.paidmode === "Card" ? vendor?.cardtype : "",
                cardmonth: expensecreate.paidmode === "Card" ? vendor?.cardmonth : "",
                cardyear: expensecreate.paidmode === "Card" ? vendor?.cardyear : "",
                cardsecuritycode:
                  expensecreate.paidmode === "Card" ? vendor?.cardsecuritycode : "",
                chequenumber: expensecreate.paidmode === "Cheque" ? vendor?.chequenumber : "",
                addedby: [
                  {
                    name: String(isUserRoleAccess?.companyname),
                    date: String(new Date()),
                  },
                ],
              },
            ] : []
          }),


          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
        formData.append("jsonData", JSON.stringify(jsonData));
        let queuecreate = await axios.put(
          `${SERVICE.EXPENSES_SINGLE}/${expenseid}/?base64=true`, formData,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },

          }
        );
      } else {
        const formData = new FormData();

        if (upload.length > 0) {
          upload.forEach((item) => {
            formData.append("newFiles", item.file); // `files` is the key for multiple files
          });
        }


        // Append deleted file names
        formData.append("deletedFiles", JSON.stringify(deletedFiles));

        const jsonData = {
          expansecategory: String(expensecreate.expansecategory),
          vendorgrouping: String(expensecreate.vendorgrouping),
          expansesubcategory: String(expensecreate.expansesubcategory),
          referenceno: String(expensecreate.referenceno),
          company: String(expensecreate.company),
          branch:
            expensecreate.company === "Others"
              ? ""
              : String(expensecreate.branch),
          unit:
            expensecreate.company === "Others"
              ? ""
              : String(expensecreate.unit),
          vendorname: String(expensecreate.vendorname),
          purpose: String(expensecreate.purpose),
          vendorfrequency: String(frequencyValue),
          vendorid: String(vendorId),
          source: "Expense",
          date: String(expensecreate.date),
          duedate: String(expensecreate.duedate ? expensecreate.duedate : ""),
          expansenote: String(
            expensecreate.expansenote ? expensecreate.expansenote : ""
          ),
          expensetotal: expensecreate.paidstatus === "Not Paid"
            ? String(expensecreate?.calculationbalamount) : String(Expensetotal ? Expensetotal : ""),
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
            expensecreate.paidstatus === "Not Paid"
              ? ""
              : expensecreate.paidmode
          ),
          paidamount: Number(
            expensecreate.paidstatus === "Not Paid"
              ? 0
              : expensecreate.paidamount
          ),
          balanceamount: Number(
            expensecreate.paidstatus === "Not Paid"
              ? expensecreate?.calculationbalamount || expensecreate.totalbillamount
              : expensecreate?.calculationbalamount
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
          // paymentduereminderlog: paymentDueReminderData?.paymentduereminderlog[0],
          ...((Number(oldPaidAmount) !== Number(expensecreate.paidamount)) &&
          {
            paymentduereminderlog: expensecreate.paidstatus === "Paid" ? [
              ...((expensecreate.paymentduereminderlog?.length > 0 && Number(oldTotalAmount) === Number(expensecreate.totalbillamount)) ? expensecreate.paymentduereminderlog : []),
              {
                balanceamount: Number(
                  expensecreate.paidstatus === "Not Paid"
                    ? expensecreate?.calculationbalamount || expensecreate.totalbillamount
                    : expensecreate?.calculationbalamount
                ),
                expensetotal: expensecreate.totalbillamount,
                modeofpayments: expensecreate.paidmode,
                payamountdate:
                  expensecreate.paidstatus === "Not Paid" ? String(expensecreate.date) : String(expensecreate.date),
                payamount: Number(
                  expensecreate.paidstatus === "Not Paid" ? 0 : expensecreate.paidamount
                ),
                bankname:
                  expensecreate.paidmode === "Bank Transfer" ? String(vendor?.bankname) : "",
                bankbranchname:
                  expensecreate.paidmode === "Bank Transfer" ? vendor?.bankbranchname : "",
                accountholdername:
                  expensecreate.paidmode === "Bank Transfer" ? vendor?.accountholdername : "",
                accountnumber:
                  expensecreate.paidmode === "Bank Transfer" ? vendor?.accountnumber : "",
                ifsccode: expensecreate.paidmode === "Bank Transfer" ? vendor?.ifsccode : "",
                upinumber: expensecreate.paidmode === "UPI" ? vendor?.upinumber : "",
                cardnumber: expensecreate.paidmode === "Card" ? vendor?.cardnumber : "",
                cardholdername:
                  expensecreate.paidmode === "Card" ? vendor?.cardholdername : "",
                cardtransactionnumber:
                  expensecreate.paidmode === "Card" ? vendor?.cardtransactionnumber : "",
                cardtype: expensecreate.paidmode === "Card" ? vendor?.cardtype : "",
                cardmonth: expensecreate.paidmode === "Card" ? vendor?.cardmonth : "",
                cardyear: expensecreate.paidmode === "Card" ? vendor?.cardyear : "",
                cardsecuritycode:
                  expensecreate.paidmode === "Card" ? vendor?.cardsecuritycode : "",
                chequenumber: expensecreate.paidmode === "Cheque" ? vendor?.chequenumber : "",
                addedby: [
                  {
                    name: String(isUserRoleAccess?.companyname),
                    date: String(new Date()),
                  },
                ],
              },
            ] : []
          }),


          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
        formData.append("jsonData", JSON.stringify(jsonData));
        let queuecreate = await axios.put(
          `${SERVICE.EXPENSES_SINGLE}/${expenseid}`, formData,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },

          }
        );
      }


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
      setUpload([]);
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
      setPopupContent("Updated Successfully");
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
    } else if (expensecreate.vendorgrouping === "" || !expensecreate.vendorgrouping) {
      setPopupContentMalert("Please Select Vendor!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (expensecreate.vendorname === "Please Select Vendor") {
      setPopupContentMalert("Please Select Vendor!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
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
    }
    else if (
      expensecreate.paidstatus === "Paid" &&
      expensecreate.paidmode === ""
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
        id: expensecreate._id,
        totalbillamount: expensecreate.totalbillamount,
        date: expensecreate.date,
      });
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
  const handleCancel = () => {
    navigate("/expense/expenselist", { replace: "true" });
  };


  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
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
      pagename: String("Expense Edit"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),

      addedby: [
        {
          name: String(isUserRoleAccess?.username),
          date: String(new Date()),
        },
      ],
    });
  };
  return (
    <Box>
      <Headtitle title={"EDIT EXPENSE"} />
      <PageHeading
        title="Edit Expenses"
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
          {isUserRoleCompare?.includes("alistexpense") && (
            <Grid sx={userStyle.selectcontainer}>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={{ fontWeight: "bold" }}>
                    Edit Expenses
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
                      value={expensecreate.referenceno}
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
                        setGroupedVendorNames([]);

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
                        setGroupedVendorNames([]);
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
                        setGroupedVendorNames([]);
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
                      type="number"
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
                    <Typography>
                      Frequency<b style={{ color: "red" }}>*</b>
                    </Typography>
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
                      id="component-outlined"
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
                        label:
                          expensecreate.purpose === "" ||
                            expensecreate.purpose == undefined
                            ? "Please Select Purpose"
                            : expensecreate.purpose,
                        value:
                          expensecreate.purpose === "" ||
                            expensecreate.purpose == undefined
                            ? "Please Select Purpose"
                            : expensecreate.purpose,
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
                      onChange={(e) => {
                        if (uploadBase64?.length > 0) {
                          handleResumeUploadBase64(e);
                        } else {

                          handleResumeUpload(e);
                        }
                      }}
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
                          <Grid item lg={8} md={8} sm={8} xs={8}>
                            <Typography>{data.name || data.file.name}</Typography>
                          </Grid>
                          <Grid item lg={1} md={1} sm={1} xs={1}>
                            <VisibilityOutlinedIcon
                              style={{
                                fontsize: "large",
                                color: "#357AE8",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                if (data.preview) {
                                  renderFilePreview(data);
                                } else if (data.file) {
                                  renderFilePreviewMulter(data.file);

                                } else if (data.filename) {
                                  renderFilePreviewMulterUploded(data);
                                }
                              }}
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

                  {uploadedFiles?.length > 0 &&
                    uploadedFiles?.map((data, index) => (
                      <>
                        <Grid container spacing={2}>
                          <Grid item lg={8} md={8} sm={8} xs={8}>
                            <Typography>{data.name || data.file.name}</Typography>
                          </Grid>
                          <Grid item lg={1} md={1} sm={1} xs={1}>
                            <VisibilityOutlinedIcon
                              style={{
                                fontsize: "large",
                                color: "#357AE8",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                if (data.preview) {
                                  renderFilePreview(data);
                                } else if (data.file) {
                                  renderFilePreviewMulter(data.file);

                                } else if (data.filename) {
                                  renderFilePreviewMulterUploded(data);
                                }
                              }}
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
                              onClick={() => handleFileDeleteUploaded(index)}
                            >
                              <DeleteIcon />
                            </Button>
                          </Grid>
                        </Grid>
                      </>
                    ))}

                  {uploadBase64?.length > 0 &&
                    uploadBase64?.map((data, index) => (
                      <>
                        <Grid container spacing={2}>
                          <Grid item lg={8} md={8} sm={8} xs={8}>
                            <Typography>{data.name || data.file.name}</Typography>
                          </Grid>
                          <Grid item lg={1} md={1} sm={1} xs={1}>
                            <VisibilityOutlinedIcon
                              style={{
                                fontsize: "large",
                                color: "#357AE8",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                if (data.preview) {
                                  renderFilePreview(data);
                                } else if (data.file) {
                                  renderFilePreviewMulter(data.file);

                                } else if (data.filename) {
                                  renderFilePreviewMulterUploded(data);
                                }
                              }}
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
                              onClick={() => handleFileDeleteBase64(index)}
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
                          <Typography>
                            Category <b style={{ color: "red" }}>*</b>
                          </Typography>
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
                          <Typography>
                            Sub Category <b style={{ color: "red" }}>*</b>
                          </Typography>
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
                          label:
                            expensecreate.paidmode === ""
                              ? "Please Select Paid Mode"
                              : expensecreate.paidmode,
                          value:
                            expensecreate.paidmode === ""
                              ? "Please Select Paid Mode"
                              : expensecreate.paidmode,
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
                          // Allow only numeric values
                          let numericValue = e.target.value.replace(/[^0-9]/g, '');

                          // Prevent leading zero (do not allow "0" as the first digit)
                          if (numericValue.startsWith('0')) {
                            numericValue = numericValue.replace(/^0+/, '');
                          }

                          if (
                            numericValue === '' ||
                            Number(numericValue) <= Number(expensecreate.balanceamount)
                          ) {
                            setExpensecreate({
                              ...expensecreate,
                              paidamount: numericValue,
                              calculationbalamount: Number(expensecreate.balanceamount) - Number(numericValue)
                            });
                          }
                          // else if (
                          //   numericValue === '' ||
                          //   Number(numericValue) <= Number(expensecreate.totalbillamount)
                          // ) {
                          //   setExpensecreate({
                          //     ...expensecreate,
                          //     paidamount: numericValue,
                          //     calculationbalamount: Number(expensecreate.totalbillamount) - Number(numericValue),
                          //   });
                          // }

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
                        value={expensecreate?.calculationbalamount}
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
                {expensecreate.paidmode === "Bank Transfer" && (
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
                    <Grid item md={4} xs={12} sm={12} sx={{ display: "flex" }}>
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
                {expensecreate.paidmode === "UPI" && (
                  <>
                    <Grid item md={12} xs={8}>
                      <Typography sx={{ fontWeight: "bold" }}>
                        UPI Details
                      </Typography>
                    </Grid>

                    <br />
                    <br />

                    <Grid item md={3} xs={12} sm={12} sx={{ display: "flex" }}>
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
                {expensecreate.paidmode === "Card" && (
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
                    <Grid item md={3} xs={12} sm={12} sx={{ display: "flex" }}>
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
                {expensecreate.paidmode === "Cheque" && (
                  <>
                    <Grid item md={12} xs={8}>
                      <Typography sx={{ fontWeight: "bold" }}>
                        Cheque Details
                      </Typography>
                    </Grid>

                    <br />

                    <Grid item md={3} xs={12} sm={12} sx={{ display: "flex" }}>
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
export default EditExpense;