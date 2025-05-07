import { makeStyles } from "@material-ui/core";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
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
    Typography
} from "@mui/material";
import axios from "axios";
import domtoimage from 'dom-to-image';
import { saveAs } from "file-saver";
import "jspdf-autotable";
import { useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import AlertDialog from "../../components/Alert";
import csvIcon from "../../components/Assets/CSV.png";
import excelIcon from "../../components/Assets/excel-icon.png";
import fileIcon from "../../components/Assets/file-icons.png";
import pdfIcon from "../../components/Assets/pdf-icon.png";
import wordIcon from "../../components/Assets/word-icon.png";
import {
    paidOpt
} from "../../components/Componentkeyword";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import VendorPopup from "./vendorpop.js";
const useStyles = makeStyles((theme) => ({
    inputs: {
        display: "none",
    },
    preview: {
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        marginTop: theme.spacing(2),
        "& > *": {
            margin: theme.spacing(1),
        },
    },
}));

function AddOtherPayments() {
    const [isHandleChange, setIsHandleChange] = useState(false);
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
    const [vendorModeOfPayments, setVendorModeOfPayments] = useState([]);

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

    const [items, setItems] = useState([]);

    const addSerialNumber = (datas) => {
        setItems(datas);
    };
    const [payments, setpayments] = useState([]);
    useEffect(() => {
        addSerialNumber(payments);
    }, [payments]);



    const [vendorAuto, setVendorAuto] = useState("");
    const [sasassendDataToParent, sendDataToParent] = useState("")
    const handleCloseviewalertvendor = () => {
        setOpenviewalertvendro(false);
    };

    const handleClickOpenviewalertvendor = () => {
        setOpenviewalertvendro(true);
    };
    const [openviewalertvendor, setOpenviewalertvendro] = useState(false);
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
            pagename: String("Add Schedule Payment Bills"),
            commonid: String(isUserRoleAccess?._id),
            date: String(new Date()),

            addedby: [
                {
                    name: String(isUserRoleAccess?.companyname),
                    date: String(new Date()),
                },
            ],
        });
    };
    // Get the current date and format it as "YYYY-MM-DD"
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    const gridRefTableImg = useRef(null);
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Schedule Payment Bills.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };
    let statusOpt = [
        { value: "Paid", label: "Paid" },
        { value: "Not Paid", label: "Not Paid" },
    ];

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

    const [vendorEdit, setVendorNewEdit] = useState({
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

    const [frequencyValue, setFrequencyValue] = useState("");
    const [vendorId, setVendorId] = useState("");
    const [frequencyValueEdit, setFrequencyValueEdit] = useState("");
    const [vendorIdEdit, setVendorIdEdit] = useState("");

    const {
        isUserRoleCompare,
        isUserRoleAccess,
        isAssignBranch,
        pageName,
        setPageName,
        buttonStyles,
    } = useContext(UserRoleAccessContext);

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

    const gridRef = useRef(null);
    const gridRefTable = useRef(null);
    const [groupedVendorNames, setGroupedVendorNames] = useState([]);
    const [groupedVendorNamesEdit, setGroupedVendorNamesEdit] = useState([]);
    const [newotherPaymnets, setnewotherPaymnets] = useState({
        branchname: {
            label: "Please Select Branch",
            value: "Please Select Branch",
        },
        headname: {
            label: "Please  Select Head Name",
            value: "Please  Select Head Name",
        },
        company: "Please Select Company",
        purpose: "Please Select Purpose",
        billno: "",
        vendor: { label: "Please Select Vendor", value: "Please Select Vendor" },
        dueamount: "",
        accountholdername: "",
        paymentfrequency: "",
        bankname: "",
        ifsccode: "",
        gstno: "",
        billdate: formattedDate,
        receiptdate: formattedDate,
        paidthrough: {
            label: "Please Select Paidthrough",
            value: "Please Select Paidthrough",
        },
        paid: {
            label: "Please Select Paid",
            value: "Please Select Paid",
        },
        referenceno: "",
        paidstatus: "Not Paid",
        expansecategory: "Please Select Expense Category",
        expansesubcategory: "Please Select Expense Sub Category",
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
            const today = moment(newotherPaymnets.billdate);
            let proposedDate = moment(`${today.year()}-${today.month() + 1}-${e.monthlyfrequency}`, "YYYY-MM-DD");

            // If proposedDate is in the past, set it to next month
            if (proposedDate.isBefore(today, 'day')) {
                proposedDate.add(1, 'month');
            }

            // Filter holidays specific to the selected company, branch, and unit
            let mappedHolidays = holidays
                ?.filter(data =>
                    data.company?.includes(newotherPaymnets.company) &&
                    data.applicablefor?.includes(newotherPaymnets?.branchname?.label)
                )
                ?.map(item => item?.date);


            // Get the valid due date (not Sunday or a holiday)
            const validDueDate = getNextValidDate(proposedDate, mappedHolidays);
            dueDate = validDueDate.format("YYYY-MM-DD"); // Format as YYYY-MM-DD
        } else if (e.paymentfrequency === "Weekly" && e.weeklyfrequency) {
            // Set today to "2024-05-17"
            const today = moment(newotherPaymnets.billdate);

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
                    data.company?.includes(newotherPaymnets.company) &&
                    data.applicablefor?.includes(newotherPaymnets?.branchname?.label)
                )
                ?.map(item => item?.date);

            // Get the valid due date (not a holiday)
            const validDueDate = getNextValidDate(proposedDate, mappedHolidays);
            dueDate = validDueDate.format("YYYY-MM-DD"); // Format as YYYY-MM-DD
        }



        setnewotherPaymnets({
            ...newotherPaymnets,
            vendor: {
                label: e.label,
                value: e.value,
            },
            paidthrough: {
                label: "Please Select Paidthrough",
                value: "Please Select Paidthrough",
            },
            vendorfrequency: e.paymentfrequency,
            paidmode: "Please Select Paid Mode",
            receiptdate: dueDate
        });
    };


    const setDueDateEdit = (e) => {
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
                    data.company?.includes(singlePay.company) &&
                    data.applicablefor?.includes(singlePay?.branchname)
                )
                ?.map(item => item?.date);


            // Get the valid due date (not Sunday or a holiday)
            const validDueDate = getNextValidDate(proposedDate, mappedHolidays);
            dueDate = validDueDate.format("YYYY-MM-DD"); // Format as YYYY-MM-DD
        }


        setSinglePay({
            ...singlePay,
            vendor: e.value,
            gstno:
                e.gstnumber == undefined || e.gstnumber == ""
                    ? ""
                    : e.gstnumber,
            accountholdername:
                e.accountholdername == undefined ||
                    e.accountholdername == ""
                    ? ""
                    : e.accountholdername,
            bankname:
                e.bankname == undefined || e.bankname == ""
                    ? ""
                    : e.bankname,
            ifsccode:
                e.ifsccode == undefined || e.ifsccode == ""
                    ? ""
                    : e.ifsccode,
            endorfrequency: e.paymentfrequency,
            paidmode: "",
            receiptdate: dueDate
        });


    };
    const [groupCheck, setGroupCheck] = useState(false);

    const [fetchsavepurpose, setFetchsavepurpose] = useState("");

    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState("");
    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    // info model
    const [openInfo, setOpeninfo] = useState(false);

    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };

    const handleCloseinfo = () => {
        setOpeninfo(false);
    };
    //Delete model
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = () => {
        setIsDeleteOpen(false);
    };

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchedString, setSearchedString] = useState("");
    // Manage Columns
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleOpenManageColumns = (event) => {
        setAnchorEl(event.currentTarget);
        setManageColumnsOpen(true);
    };
    const handleCloseManageColumns = () => {
        setManageColumnsOpen(false);
        setSearchQueryManage("");
    };
    const [searchQuery, setSearchQuery] = useState("");

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    // const renderFilePreview = async (file) => {
    //     const response = await fetch(file.preview);
    //     const blob = await response.blob();
    //     const url = window.URL.createObjectURL(blob);
    //     const link = document.createElement("a");
    //     link.href = url;
    //     window.open(link, "_blank");
    // };
    const renderFilePreview = async (file) => {
        const url = window.URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        actions: true,
        serialNumber: true,
        checkbox: true,
        company: true,
        branchname: true,
        expensecategory: true,
        expensesubcategory: true,
        purpose: true,
        billno: true,
        vendor: true,
        gstno: true,
        billdate: true,
        receiptdate: true,
        dueamount: true,
        vendorfrequency: true,
        bankname: true,
        ifsccode: true,
        paidthrough: true,
        referenceno: true,
        paidstatus: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );

    const handleClickOpencheckbox = () => {
        setIsDeleteOpencheckbox(true);
    };
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
    };

    // Excel
    useEffect(() => {
        fetchPurposeDropdowns();
        fetchExpenseCate();
        fetchVendor();
        fetchVendorGrouping();
    }, []);

    useEffect(() => {
        fetchVendor();
        fetchVendorGrouping();
    }, [vendorAuto]);

    useEffect(() => {
        fetchHoliday();
    }, []);

    const [viewOpen, setViewpen] = useState(false);

    const handleViewOpen = () => {
        setViewpen(true);
    };
    const handleViewClose = () => {
        setViewpen(false);
    };

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Schedule Payment Bills",
        pageStyle: "print",
    });

    const classes = useStyles();
    // FILEICONPREVIEW CREATE
    const getFileIcon = (fileName) => {
        const extension = fileName.split(".").pop();
        switch (extension) {
            case "pdf":
                return pdfIcon;
            case "doc":
            case "docx":
                return wordIcon;
            case "xls":
            case "xlsx":
                return excelIcon;
            case "csv":
                return csvIcon;
            default:
                return fileIcon;
        }
    };
    const { auth } = useContext(AuthContext);
    const [showAlert, setShowAlert] = useState();
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };
    const [refDocuments, setrefDocuments] = useState([]);
    const [refRecDocuments, setRefRecDouments] = useState([]);

    const [branchOptions, setBranchOptions] = useState([]);
    const [headNameOptions, setHeadnameoptions] = useState([]);
    const [vendorOptions, setVendorOptions] = useState([]);
    const [gstOptions, setGstOptions] = useState({});

    const OptionsType = [
        { value: "Cash", label: "Cash" },
        { value: "UPI", label: "UPI" },
        { value: "Card", label: "Card" },
        { value: "Bank Transfer", label: "Bank Transfer" },
        { value: "Cheque", label: "Cheque" },
    ];
    const paid = [
        { value: "Paid", label: "Paid" },
        { value: "Not Paid", label: "Not Paid" },
    ];
    const [purposes, setPurposes] = useState([]);
    const [purposesEdit, setPurposesEdit] = useState([]);

    //get all  vendordetails.


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
            setPurposesEdit(purposeall);
            setFetchsavepurpose("");
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    const [expanseOption, setExpanseOption] = useState([]);
    const [expense, setExpense] = useState([]);
    const fetchExpenseCate = async () => {
        try {
            let res = await axios.get(SERVICE.EXPENSECATEGORY, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setExpense(res?.data?.expensecategory);
            setExpanseOption([
                ...res?.data?.expensecategory?.map((t) => ({
                    ...t,
                    label: t.categoryname,
                    value: t.categoryname,
                })),
            ]);
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    const fetchVendor = async (e) => {
        try {
            let response = await axios.get(`${SERVICE.ALL_VENDORDETAILS}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let data_set = response?.data?.vendordetails?.filter(item => item.vendorstatus === "Active");
            let filter_opt = [...new Set(data_set)];
            setVendorOptions(
                data_set?.map((data) => ({
                    ...data,
                    label: data.vendorname,
                    value: data.vendorname,
                }))
            );
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
    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);





    const handleClear = () => {
        console.log("clear");
        setnewotherPaymnets({
            ...newotherPaymnets,
            branchname: {
                label: "Please Select Branch",
                value: "Please Select Branch",
            },
            company: "Please Select Company",
            headname: {
                label: "Please  Select Head Name",
                value: "Please  Select Head Name",
            },
            purpose: "Please Select Purpose",
            billno: "",
            vendor: { label: "Please Select Vendor", value: "Please Select Vendor" },
            dueamount: "",
            vendorgrouping: "",
            accountholdername: "",
            paymentfrequency: "",
            bankname: "",
            ifsccode: "",
            gstno: "",
            billdate: formattedDate,
            receiptdate: formattedDate,
            paidthrough: {
                label: "Please Select Paidthrough",
                value: "Please Select Paidthrough",
            },
            paid: {
                label: "Please Select Paid",
                value: "Please Select Paid",
            },
            referenceno: "",
            paidstatus: "Not Paid",
            expansecategory: "Please Select Expense Category",
            expansesubcategory: "Please Select Expense Sub Category",
        });

        setFrequencyValue("");

        setGstOptions({});
        setRefRecDouments([]);
        setrefDocuments([]);
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };
    const navigate = useNavigate();
    const sendRequest = async () => {
        setPageName(!pageName);
        // Get the current date and time
        const currentDate = new Date();
        const currentTimeString = currentDate.toLocaleTimeString([], {
            hour12: false,
        });
        const dateTimeString = `${newotherPaymnets.receiptdate} ${currentTimeString}`;
        try {

            let formData = new FormData();

            if (refDocuments.length > 0) {
                refDocuments.forEach((item) => {
                    formData.append("billsdocument", item.file); // `files` is the key for multiple files
                });
            }
            if (refRecDocuments.length > 0) {
                refRecDocuments.forEach((item) => {
                    formData.append("receiptdocument", item.file); // `files` is the key for multiple files
                });
            }

            const jsonData = {
                branchname: String(newotherPaymnets.branchname.value),
                company: String(newotherPaymnets.company),
                expensecategory: String(newotherPaymnets.expansecategory),
                expensesubcategory: String(newotherPaymnets.expansesubcategory),
                vendorgrouping: String(newotherPaymnets.vendorgrouping),
                purpose: String(newotherPaymnets.purpose),
                billno: String(newotherPaymnets.billno),
                vendor: String(newotherPaymnets.vendor.value),
                gstno: String(
                    gstOptions.gstnumber == undefined ? "" : gstOptions.gstnumber
                ),
                billdate: String(newotherPaymnets.billdate),
                receiptdate: String(newotherPaymnets.receiptdate),
                dueamount: Number(newotherPaymnets.dueamount),

                paymentfrequency: String(
                    gstOptions.paymentfrequency == undefined
                        ? ""
                        : gstOptions.paymentfrequency
                ),


                paidthrough:
                    newotherPaymnets.paidstatus === "Paid"
                        ? String(newotherPaymnets.paidthrough.value)
                        : "",
                paid: String(newotherPaymnets.paid.value),
                referenceno:
                    newotherPaymnets.paidstatus === "Paid"
                        ? String(newotherPaymnets.referenceno)
                        : "",


                paidstatus: String(newotherPaymnets.paidstatus),

                paidbillstatus: String(newotherPaymnets.paidstatus === "Not Paid" ? "InComplete" : (newotherPaymnets.paidstatus === "Paid" && Number(newotherPaymnets.dueamount) === Number(newotherPaymnets.paidamount)) ? "Completed" : "Partially Paid"),
                paiddate: newotherPaymnets.paidstatus === "Paid" ? newotherPaymnets?.paiddate : "",
                paidamount: newotherPaymnets.paidstatus === "Paid" ? Number(newotherPaymnets?.paidamount) : 0,

                paymentduereminderlog: newotherPaymnets.paidstatus === "Paid" ? [
                    {
                        balanceamount: Number(
                            newotherPaymnets.paidstatus === "Not Paid"
                                ? newotherPaymnets.dueamount
                                : Number(newotherPaymnets.dueamount) - Number(newotherPaymnets.paidamount)
                        ),
                        expensetotal: newotherPaymnets.dueamount,
                        modeofpayments: newotherPaymnets.paidthrough.value,
                        payamountdate: newotherPaymnets?.paiddate,
                        payamount: Number(
                            newotherPaymnets.paidstatus === "Not Paid" ? 0 : newotherPaymnets.paidamount
                        ),
                        bankname: newotherPaymnets.paidthrough.value === "Bank Transfer"
                            ? String(vendor.bankname)
                            : "",
                        bankbranchname: newotherPaymnets.paidthrough.value === "Bank Transfer"
                            ? vendor.bankbranchname
                            : "",
                        accountholdername: newotherPaymnets.paidthrough.value === "Bank Transfer"
                            ? vendor.accountholdername
                            : "",
                        accountnumber: newotherPaymnets.paidthrough.value === "Bank Transfer"
                            ? vendor.accountnumber
                            : "",
                        ifsccode: newotherPaymnets.paidthrough.value === "Bank Transfer" ? vendor.ifsccode : "",

                        upinumber: newotherPaymnets.paidthrough.value === "UPI" ? vendor.upinumber : "",

                        cardnumber: newotherPaymnets.paidthrough.value === "Card" ? vendor.cardnumber : "",
                        cardholdername: newotherPaymnets.paidthrough.value === "Card"
                            ? vendor.cardholdername
                            : "",
                        cardtransactionnumber: newotherPaymnets.paidthrough.value === "Card"
                            ? vendor.cardtransactionnumber
                            : "",
                        cardtype: newotherPaymnets.paidthrough.value === "Card" ? vendor.cardtype : "",
                        cardmonth: newotherPaymnets.paidthrough.value === "Card" ? vendor.cardmonth : "",
                        cardyear: newotherPaymnets.paidthrough.value === "Card" ? vendor.cardyear : "",
                        cardsecuritycode: newotherPaymnets.paidthrough.value === "Card"
                            ? vendor.cardsecuritycode
                            : "",
                        chequenumber: newotherPaymnets.paidthrough.value === "Cheque"
                            ? vendor.chequenumber
                            : "",
                        addedby: [
                            {
                                name: String(isUserRoleAccess.companyname),
                                date: String(new Date()),
                            },
                        ],
                    }] : [],

                sortdate: String(
                    newotherPaymnets.paidstatus === "Paid" ? dateTimeString : ""
                ),
                vendorfrequency: String(frequencyValue),
                vendorid: String(vendorId),
                source: "Scheduled Payment",

                bankname:
                    newotherPaymnets.paidthrough.value === "Bank Transfer" &&
                        newotherPaymnets.paidstatus === "Paid"
                        ? String(vendor.bankname)
                        : "",
                bankbranchname:
                    newotherPaymnets.paidthrough.value === "Bank Transfer" &&
                        newotherPaymnets.paidstatus === "Paid"
                        ? String(vendor.bankbranchname)
                        : "",
                accountholdername:
                    newotherPaymnets.paidthrough.value === "Bank Transfer" &&
                        newotherPaymnets.paidstatus === "Paid"
                        ? String(vendor.accountholdername)
                        : "",
                accountnumber:
                    newotherPaymnets.paidthrough.value === "Bank Transfer" &&
                        newotherPaymnets.paidstatus === "Paid"
                        ? String(vendor.accountnumber)
                        : "",
                ifsccode:
                    newotherPaymnets.paidthrough.value === "Bank Transfer" &&
                        newotherPaymnets.paidstatus === "Paid"
                        ? String(vendor.ifsccode)
                        : "",

                upinumber:
                    newotherPaymnets.paidthrough.value === "UPI" &&
                        newotherPaymnets.paidstatus === "Paid"
                        ? String(vendor.upinumber)
                        : "",

                cardnumber:
                    newotherPaymnets.paidthrough.value === "Card" &&
                        newotherPaymnets.paidstatus === "Paid"
                        ? String(vendor.cardnumber)
                        : "",
                cardholdername:
                    newotherPaymnets.paidthrough.value === "Card" &&
                        newotherPaymnets.paidstatus === "Paid"
                        ? String(vendor.cardholdername)
                        : "",
                cardtransactionnumber:
                    newotherPaymnets.paidthrough.value === "Card" &&
                        newotherPaymnets.paidstatus === "Paid"
                        ? String(vendor.cardtransactionnumber)
                        : "",
                cardtype:
                    newotherPaymnets.paidthrough.value === "Card" &&
                        newotherPaymnets.paidstatus === "Paid"
                        ? String(vendor.cardtype)
                        : "",
                cardmonth:
                    newotherPaymnets.paidthrough.value === "Card" &&
                        newotherPaymnets.paidstatus === "Paid"
                        ? String(vendor.cardmonth)
                        : "",
                cardyear:
                    newotherPaymnets.paidthrough.value === "Card" &&
                        newotherPaymnets.paidstatus === "Paid"
                        ? String(vendor.cardyear)
                        : "",
                cardsecuritycode:
                    newotherPaymnets.paidthrough.value === "Card" &&
                        newotherPaymnets.paidstatus === "Paid"
                        ? String(vendor.cardsecuritycode)
                        : "",

                chequenumber:
                    newotherPaymnets.paidthrough.value === "Cheque" &&
                        newotherPaymnets.paidstatus === "Paid"
                        ? String(vendor.chequenumber)
                        : "",

                cash:
                    newotherPaymnets.paidthrough.value === "Cash" &&
                        newotherPaymnets.paidstatus === "Paid"
                        ? String("Cash")
                        : "",

                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            }
            formData.append("jsonData", JSON.stringify(jsonData));
            let response = await axios.post(`${SERVICE.NEW_OTHERPAYMENTS}`, formData, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },

            });
            setnewotherPaymnets({
                ...newotherPaymnets,
                branchname: {
                    label: newotherPaymnets.branchname.label,
                    value: newotherPaymnets.branchname.value,
                },
                headname: {
                    label: newotherPaymnets.headname.label,
                    value: newotherPaymnets.headname.value,
                },
                // purpose: "",
                billno: "",
                vendor: {
                    label: newotherPaymnets.vendor.label,
                    value: newotherPaymnets.vendor.value,
                },
                dueamount: "",
                accountholdername: "",
                paymentfrequency: "",
                bankname: "",
                ifsccode: "",
                billdate: formattedDate,
                receiptdate: formattedDate,
                paidthrough: {
                    label: newotherPaymnets.paidthrough.label,
                    value: newotherPaymnets.paidthrough.value,
                },
                paid: {
                    label: newotherPaymnets.paid.label,
                    value: newotherPaymnets.paid.value,
                },
                referenceno: "",
            });
            setrefDocuments([]);
            setRefRecDouments([]);
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            navigate("/account/listotherpayments", { replace: true });
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };
    const handleSubmit = () => {
        if (newotherPaymnets?.company === "Please Select Company") {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (newotherPaymnets?.branchname?.value === "Please Select Branch") {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            newotherPaymnets?.expansecategory === "Please Select Expense Category"
        ) {
            setPopupContentMalert("Please Select Expense Category!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            newotherPaymnets?.expansesubcategory ===
            "Please Select Expense Sub Category"
        ) {
            setPopupContentMalert("Please Select Expense Sub Category!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (newotherPaymnets?.purpose === "Please Select Purpose") {
            setPopupContentMalert("Please Select Purpose!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (newotherPaymnets?.billno === "") {
            setPopupContentMalert("Please Enter Billno!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (newotherPaymnets.vendorgrouping === "" || !newotherPaymnets.vendorgrouping) {
            setPopupContentMalert("Please Select Vendor Grouping!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (newotherPaymnets?.vendor?.value === "Please Select Vendor") {
            setPopupContentMalert("Please Select Vendor!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (newotherPaymnets?.billdate === "") {
            setPopupContentMalert("Please Select Bill Date!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (newotherPaymnets.receiptdate === "") {
            setPopupContentMalert("Please Select Due Date!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (newotherPaymnets?.dueamount === "") {
            setPopupContentMalert("Please Enter Dueamount!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            newotherPaymnets?.paidstatus === "Paid" &&
            newotherPaymnets?.paidamount === 0
        ) {
            setPopupContentMalert("Please Enter Paid Amount!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            newotherPaymnets?.paidstatus === "Paid" &&
            !newotherPaymnets?.paiddate
        ) {
            setPopupContentMalert("Please Select Paid Date!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            newotherPaymnets?.paidstatus === "Paid" &&
            newotherPaymnets?.paidthrough?.value === "Please Select Paidthrough"
        ) {
            setPopupContentMalert("Please Select Paid Through!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            newotherPaymnets?.paidstatus === "Paid" &&
            newotherPaymnets?.referenceno === ""
        ) {
            setPopupContentMalert("Please Enter Reference No!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (refDocuments.length === 0) {
            setPopupContentMalert("Please Upload Bills!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            sendRequest();
        }
    };

    // bill docs
    // const handleInputChangedocument = (event, index) => {
    //     const files = event.target.files;
    //     let newSelectedFiles = [...refDocuments];
    //     for (let i = 0; i < files.length; i++) {
    //         const file = files[i];
    //         // Check if the file is an image
    //         if (
    //             file.type === "application/pdf" ||
    //             file.type === "application/msword" ||
    //             file.type === "text/plain" ||
    //             file.type ===
    //             "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || // Handle Excel
    //             file.type === "application/zip" ||
    //             file.type.startsWith("image/")
    //         ) {
    //             const reader = new FileReader();
    //             reader.onload = () => {
    //                 newSelectedFiles.push({
    //                     name: file.name,
    //                     size: file.size,
    //                     type: file.type,
    //                     preview: reader.result,
    //                     base64: reader.result.split(",")[1],
    //                 });
    //                 setrefDocuments(newSelectedFiles);
    //             };
    //             reader.readAsDataURL(file);
    //         } else {

    //             setPopupContentMalert("Only Accept Documents!");
    //             setPopupSeverityMalert("info");
    //             handleClickOpenPopupMalert();
    //         }
    //     }
    // };

    const handleInputChangedocument = (event) => {
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

        setrefDocuments((prevFiles) => [
            ...prevFiles,
            ...filteredFiles.map((file) => ({
                file,
            })),
        ]);
    };

    // bill doc delete
    const handleDeleteFileDocument = (index) => {
        const newSelectedFiles = [...refDocuments];

        newSelectedFiles.splice(index, 1);
        setrefDocuments(newSelectedFiles?.length > 0 ? newSelectedFiles : []);
    };

    // receipt docs
    // const handleInputChangedocumentRec = (event, index) => {
    //     const files = event.target.files;
    //     let newSelectedFiles = [...refRecDocuments];
    //     for (let i = 0; i < files.length; i++) {
    //         const file = files[i];
    //         // Check if the file is an image
    //         if (
    //             file.type === "application/pdf" ||
    //             file.type === "application/msword" ||
    //             file.type === "text/plain" ||
    //             file.type ===
    //             "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || // Handle Excel
    //             file.type === "application/zip" ||
    //             file.type.startsWith("image/")
    //         ) {
    //             const reader = new FileReader();
    //             reader.onload = () => {
    //                 newSelectedFiles.push({
    //                     name: file.name,
    //                     size: file.size,
    //                     type: file.type,
    //                     preview: reader.result,
    //                     base64: reader.result.split(",")[1],
    //                 });
    //                 setRefRecDouments(newSelectedFiles);
    //             };
    //             reader.readAsDataURL(file);
    //         } else {

    //             setPopupContentMalert("Only Accept Documents!");
    //             setPopupSeverityMalert("info");
    //             handleClickOpenPopupMalert();
    //         }
    //     }
    // };

    const handleInputChangedocumentRec = (event) => {
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

        setRefRecDouments((prevFiles) => [
            ...prevFiles,
            ...filteredFiles.map((file) => ({
                file,
            })),
        ]);
    };

    const handleDeleteFileDocumentRef = (index) => {
        const newSelectedFiles = [...refRecDocuments];
        newSelectedFiles.splice(index, 1);
        setRefRecDouments(newSelectedFiles);
    };

    // bill edit
    const handleInputChangedocumentEdit = (event, index) => {
        const files = event.target.files;
        let newSelectedFiles = [...billdocs];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            // Check if the file is an image
            if (
                file.type === "application/pdf" ||
                file.type === "application/msword" ||
                file.type === "text/plain" ||
                file.type ===
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || // Handle Excel
                file.type === "application/zip" ||
                file.type.startsWith("image/")
            ) {
                const reader = new FileReader();
                reader.onload = () => {
                    newSelectedFiles.push({
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        preview: reader.result,
                        base64: reader.result.split(",")[1],
                    });
                    setBillDocs(newSelectedFiles);
                };
                reader.readAsDataURL(file);
            } else {

                setPopupContentMalert("Only Accept Documents!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
        }
    };

    // bill edit delete
    const handleDeleteFileDocumentEdit = (index) => {
        const newSelectedFiles = [...billdocs];
        newSelectedFiles.splice(index, 1);
        setBillDocs(newSelectedFiles);
    };

    const handleInputChangedocumentRecEd = (event, index) => {
        const files = event.target.files;
        let newSelectedFiles = [...receiptDocs];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            // Check if the file is an image
            if (
                file.type === "application/pdf" ||
                file.type === "application/msword" ||
                file.type === "text/plain" ||
                file.type ===
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || // Handle Excel
                file.type === "application/zip" ||
                file.type.startsWith("image/")
            ) {
                const reader = new FileReader();
                reader.onload = () => {
                    newSelectedFiles.push({
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        preview: reader.result,
                        base64: reader.result.split(",")[1],
                    });
                    setReceiptDocs(newSelectedFiles);
                };
                reader.readAsDataURL(file);
            } else {

                setPopupContentMalert("Only Accept Documents!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
        }
    };

    const handleDeleteFileDocumentRefEd = (index) => {
        const newSelectedFiles = [...receiptDocs];
        newSelectedFiles.splice(index, 1);
        setReceiptDocs(newSelectedFiles);
    };

    const [advancedFilter, setAdvancedFilter] = useState(null);


    const [logicOperator, setLogicOperator] = useState("AND");

    const [selectedColumn, setSelectedColumn] = useState("");
    const [selectedCondition, setSelectedCondition] = useState("Contains");
    const [filterValue, setFilterValue] = useState("");
    const [additionalFilters, setAdditionalFilters] = useState([]);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const conditions = ["Contains", "Does Not Contain", "Equals", "Does Not Equal", "Begins With", "Ends With", "Blank", "Not Blank"]; // AgGrid-like conditions
    const [totalPages, setTotalPages] = useState(0);
    const [totalDatas, setTotalDatas] = useState(0);
    const [totalProjects, setTotalProjects] = useState(0);
    const [totalProjectsData, setTotalProjectsData] = useState([]);
    // Search bar
    const [anchorElSearch, setAnchorElSearch] = React.useState(null);
    const handleClickSearch = (event) => {
        setAnchorElSearch(event.currentTarget);
        localStorage.removeItem("filterModel");
    };
    const handleCloseSearch = () => {
        setAnchorElSearch(null);
        setSearchQuery("");
    };

    const openSearch = Boolean(anchorElSearch);
    const idSearch = openSearch ? 'simple-popover' : undefined;

    const handleAddFilter = () => {
        if (selectedColumn && filterValue || ["Blank", "Not Blank"].includes(selectedCondition)) {
            setAdditionalFilters([
                ...additionalFilters,
                { column: selectedColumn, condition: selectedCondition, value: filterValue }
            ]);
            setSelectedColumn("");
            setSelectedCondition("Contains");
            setFilterValue("");
        }
    };
    const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
    // Show filtered combination in the search bar


    // Debounce the search query
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery); // Update debounced query after the timeout
        }, 300); // Debounce delay in milliseconds (adjust as needed)

        return () => {
            clearTimeout(handler); // Clear the timeout if searchQuery changes within the delay
        };
    }, [searchQuery]);





    const [openEdit, setOpenEdit] = useState(false);
    const handleEditOpen = () => {
        setOpenEdit(true);
    };
    const handleEditClose = () => {
        setOpenEdit(false);
    };

    const [singlePay, setSinglePay] = useState({});
    const [billdocs, setBillDocs] = useState([]);
    const [receiptDocs, setReceiptDocs] = useState([]);


    return (
        <Box>
            <PageHeading
                title="Add Schedule Payment Bills"
                modulename="Expenses"
                submodulename="Payment"
                mainpagename="Add Schedule Payment Bills"
                subpagename=""
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("aaddschedulepaymentbills") && (
                <>
                    <Box sx={userStyle.container}>
                        <Grid container spacing={2}>
                            <Grid item md={12} sm={12} xs={12}>
                                <Typography sx={userStyle.HeaderText}>
                                    Add Schedule Payment Bills
                                </Typography>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Company<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        options={accessbranch
                                            ?.map((data) => ({
                                                label: data.company,
                                                value: data.company,
                                            }))
                                            .filter((item, index, self) => {
                                                return (
                                                    self.findIndex(
                                                        (i) =>
                                                            i.label === item.label && i.value === item.value
                                                    ) === index
                                                );
                                            })}
                                        styles={colourStyles}
                                        value={{
                                            label: newotherPaymnets.company,
                                            value: newotherPaymnets.company,
                                        }}
                                        onChange={(e) => {
                                            setnewotherPaymnets({
                                                ...newotherPaymnets,
                                                company: e.value,
                                                branchname: {
                                                    label: "Please Select Branch",
                                                    value: "Please Select Branch",
                                                },
                                                vendorgrouping: "",
                                                vendor: {
                                                    label: "Please Select Vendor",
                                                    value: "Please Select Vendor",
                                                },
                                                duedate: "",
                                            });
                                            setBranchOptions([]);
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Branch <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        id="component-outlined"
                                        type="text"
                                        styles={colourStyles}
                                        options={accessbranch
                                            ?.filter(
                                                (comp) => newotherPaymnets.company === comp.company
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
                                        value={{
                                            label: newotherPaymnets?.branchname?.label,
                                            value: newotherPaymnets?.branchname?.value,
                                        }}
                                        onChange={(e) => {
                                            setnewotherPaymnets({
                                                ...newotherPaymnets,
                                                branchname: {
                                                    label: e.label,
                                                    value: e.value,
                                                },
                                                vendorgrouping: "",
                                                duedate: "",
                                                vendor: {
                                                    label: "Please Select Vendor",
                                                    value: "Please Select Vendor",
                                                },
                                            });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Expense Category <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        id="component-outlined"
                                        styles={colourStyles}
                                        options={expanseOption}
                                        value={{
                                            label: newotherPaymnets?.expansecategory,
                                            value: newotherPaymnets?.expansecategory,
                                        }}
                                        placeholder="Please  Select Category"
                                        onChange={(e) => {
                                            setnewotherPaymnets({
                                                ...newotherPaymnets,
                                                expansecategory: e.value,
                                                expansesubcategory:
                                                    "Please Select Expense Sub Category",
                                            });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Expense Sub Category <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        id="component-outlined"
                                        styles={colourStyles}
                                        options={expense
                                            ?.filter(
                                                (item) =>
                                                    item.categoryname ===
                                                    newotherPaymnets?.expansecategory
                                            )
                                            .map((item) => {
                                                return item.subcategoryname.map((subCatName) => ({
                                                    label: subCatName,
                                                    value: subCatName,
                                                }));
                                            })
                                            .flat()}
                                        value={{
                                            label: newotherPaymnets?.expansesubcategory,
                                            value: newotherPaymnets?.expansesubcategory,
                                        }}
                                        placeholder="Please Select Sub Category"
                                        onChange={(e) => {
                                            setnewotherPaymnets({
                                                ...newotherPaymnets,
                                                expansesubcategory: e.value,
                                            });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Purpose<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        options={purposes}
                                        styles={colourStyles}
                                        value={{
                                            label: newotherPaymnets.purpose,
                                            value: newotherPaymnets.purpose,
                                        }}
                                        onChange={(e) => {
                                            setnewotherPaymnets({
                                                ...newotherPaymnets,
                                                purpose: e.value,
                                            });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Bill No<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <OutlinedInput
                                        value={newotherPaymnets.billno}
                                        onChange={(e) => {
                                            setnewotherPaymnets({
                                                ...newotherPaymnets,
                                                billno: e.target.value,
                                            });
                                        }}
                                        type="text"
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
                                            label: !newotherPaymnets.vendorgrouping ? "Please Select Vendor Grouping" : newotherPaymnets.vendorgrouping,
                                            value: !newotherPaymnets.vendorgrouping ? "Please Select Vendor Grouping" : newotherPaymnets.vendorgrouping,
                                        }}
                                        onChange={(e) => {
                                            setnewotherPaymnets({
                                                ...newotherPaymnets,
                                                vendorgrouping: e.value,
                                                vendor: {
                                                    label: "Please Select Vendor",
                                                    value: "Please Select Vendor",
                                                },
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
                            {/* next grdi */}
                            <>
                                <Grid item md={2.5} sm={12} xs={12} sx={{ display: "flex" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Vendor Name<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={vendorOptions?.filter(data =>
                                                groupedVendorNames?.includes?.(data?.value)
                                            )}
                                            value={{
                                                label: newotherPaymnets?.vendor?.label,
                                                value: newotherPaymnets?.vendor?.value,
                                            }}
                                            onChange={(e) => {
                                                // setnewotherPaymnets({
                                                //   ...newotherPaymnets,
                                                //   vendor: {
                                                //     label: e.label,
                                                //     value: e.value,
                                                //   },
                                                // });
                                                // fetchGstNo(e);
                                                setGstOptions(e);
                                                setFrequencyValue(e.paymentfrequency);
                                                setVendorModeOfPayments(e?.modeofpayments);
                                                setVendorId(e._id);
                                                setVendorNew((prev) => ({
                                                    ...prev,
                                                    ...e,
                                                }));

                                                setDueDate(e)
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
                                    </Grid>
                                )}
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography> GSTNO</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={
                                                Object.keys(gstOptions).length === 0
                                                    ? " "
                                                    : gstOptions.gstnumber
                                            }
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl size="small" fullWidth>
                                        <Typography>Frequency</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            sx={userStyle.input}
                                            // placeholder="Please Enter Frequency"
                                            value={frequencyValue}
                                            readOnly
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Bill Date<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            type="date"
                                            value={newotherPaymnets.billdate}
                                            onChange={(e) => {
                                                setnewotherPaymnets({
                                                    ...newotherPaymnets,
                                                    billdate: e.target.value,
                                                    receiptdate: "",
                                                    paiddate: "",
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Due Date<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            type="date"
                                            value={newotherPaymnets.receiptdate}
                                            onChange={(e) => {
                                                setnewotherPaymnets({
                                                    ...newotherPaymnets,
                                                    receiptdate: e.target.value,
                                                    paiddate: ""
                                                });
                                            }}
                                            inputProps={{
                                                min: newotherPaymnets.billdate,
                                                // max: today
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </>
                            <>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Due Amount<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            sx={userStyle.input}
                                            type="number"
                                            value={newotherPaymnets.dueamount}
                                            onChange={(e) => {
                                                setnewotherPaymnets({
                                                    ...newotherPaymnets,
                                                    dueamount: e.target.value,
                                                    paidamount: 0,
                                                    balanceamount: 0,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Paid Status<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={250}
                                            options={statusOpt}
                                            placeholder="Please Select Status"
                                            value={{
                                                label: newotherPaymnets.paidstatus,
                                                value: newotherPaymnets.paidstatus,
                                            }}
                                            onChange={(e) => {
                                                setnewotherPaymnets({
                                                    ...newotherPaymnets,
                                                    paidstatus: e.value,
                                                    paidthrough: {
                                                        label: "Please Select Paidthrough",
                                                        value: "Please Select Paidthrough",
                                                    },
                                                    referenceno: "",
                                                    paidamount: 0,
                                                    balanceamount: 0,
                                                    paiddate: "",
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                {newotherPaymnets.paidstatus === "Paid" && (
                                    <>
                                        <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Paid Amount<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="number"
                                                    placeholder="Please Enter Paid Amount"
                                                    sx={userStyle.input}
                                                    value={newotherPaymnets.paidamount}
                                                    onChange={(e) => {
                                                        if (
                                                            Number(e.target.value) <=
                                                            Number(newotherPaymnets.dueamount)
                                                        ) {
                                                            setnewotherPaymnets({
                                                                ...newotherPaymnets,
                                                                paidamount: e.target.value,
                                                                balanceamount:
                                                                    Number(newotherPaymnets.dueamount) - e.target.value,
                                                            });
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Balance Amount
                                                </Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="number"
                                                    placeholder="Balance Amount"
                                                    sx={userStyle.input}
                                                    value={newotherPaymnets.balanceamount} readOnly

                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} sm={12} xs={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Paid Date<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <OutlinedInput
                                                    type="date"
                                                    value={newotherPaymnets.paiddate}
                                                    onChange={(e) => {
                                                        setnewotherPaymnets({
                                                            ...newotherPaymnets,
                                                            paiddate: e.target.value,
                                                        });
                                                    }}
                                                    inputProps={{
                                                        min: newotherPaymnets.billdate,
                                                        max: newotherPaymnets.receiptdate
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Paid Through<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    options={paidOpt?.filter((data) =>
                                                        vendorModeOfPayments?.includes(data?.label)
                                                    )}
                                                    value={{
                                                        label: newotherPaymnets?.paidthrough?.label,
                                                        value: newotherPaymnets?.paidthrough?.value,
                                                    }}
                                                    onChange={(e) => {
                                                        setnewotherPaymnets({
                                                            ...newotherPaymnets,
                                                            paidthrough: {
                                                                label: e.label,
                                                                value: e.value,
                                                            },
                                                        });
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} sm={12} xs={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Reference No<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    placeholder="Please Enter Form"
                                                    value={newotherPaymnets.referenceno}
                                                    onChange={(e) => {
                                                        setnewotherPaymnets({
                                                            ...newotherPaymnets,
                                                            referenceno: e.target.value,
                                                        });
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </>
                                )}
                            </>
                            <Grid item md={12} sm={12} xs={12}>
                                <Typography variant="h6">Attachments</Typography>
                            </Grid>
                            <Grid item md={12} sm={12} xs={12} sx={{ display: "flex" }}>
                                <Grid>
                                    <Typography variant="h6">
                                        Bill<b style={{ color: "red" }}>*</b>{" "}
                                    </Typography>
                                    <input
                                        className={classes.inputs}
                                        type="file"
                                        id="file-inputuploadcreatefirstedit"
                                        accept=".pdf, .doc, .docx, .txt, .xls, .xlsx, .zip, .png , .jpg , "
                                        multiple
                                        onChange={handleInputChangedocument}
                                    />
                                    <label htmlFor="file-inputuploadcreatefirstedit">
                                        <Button
                                            component="span"
                                            style={{
                                                backgroundColor: "#f4f4f4",
                                                color: "#444",
                                                minWidth: "40px",
                                                boxShadow: "none",
                                                borderRadius: "5px",
                                                marginTop: "-5px",
                                                textTransform: "capitalize",
                                                border: "1px solid #0000006b",
                                                "&:hover": {
                                                    "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                                                        backgroundColor: "#f4f4f4",
                                                    },
                                                },
                                            }}
                                        >
                                            Upload Document &ensp; <CloudUploadIcon />
                                        </Button>
                                    </label>
                                </Grid>
                                &emsp;
                                <Grid>
                                    <Typography variant="h6">Receipt</Typography>
                                    <input
                                        className={classes.inputs}
                                        type="file"
                                        id="file-inputuploadedit"
                                        accept=".pdf, .doc, .docx, .txt, .xls, .xlsx, .zip, .png , .jpg , "
                                        multiple
                                        onChange={handleInputChangedocumentRec}
                                    />
                                    <label htmlFor="file-inputuploadedit">
                                        <Button
                                            component="span"
                                            style={{
                                                backgroundColor: "#f4f4f4",
                                                color: "#444",
                                                minWidth: "40px",
                                                boxShadow: "none",
                                                borderRadius: "5px",
                                                marginTop: "-5px",
                                                textTransform: "capitalize",
                                                border: "1px solid #0000006b",
                                                "&:hover": {
                                                    "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                                                        backgroundColor: "#f4f4f4",
                                                    },
                                                },
                                            }}
                                        >
                                            Upload Document &ensp; <CloudUploadIcon />
                                        </Button>
                                    </label>
                                </Grid>
                            </Grid>
                            <Grid item md={12} sm={12} xs={12}>
                                <br />
                                <Grid container>
                                    <Grid item md={12} sm={12} xs={12}>
                                        {refDocuments?.length > 0 &&
                                            refDocuments.map((data, index) => {
                                                const fileURL = URL.createObjectURL(data.file); // Generate a URL for the file preview

                                                return (
                                                    <Grid container key={index}>
                                                        <Grid item md={2} sm={2} xs={2}>
                                                            <Box
                                                                style={{
                                                                    display: "flex",
                                                                    justifyContent: "center",
                                                                    alignItems: "center",
                                                                }}
                                                            >
                                                                {data.file.type.includes("image/") ? (
                                                                    <img
                                                                        src={fileURL}
                                                                        alt={data.file.name}
                                                                        height={50}
                                                                        style={{
                                                                            maxWidth: "100%",
                                                                        }}
                                                                        onLoad={() => URL.revokeObjectURL(fileURL)} // Free up memory when image loads
                                                                    />
                                                                ) : (
                                                                    <img
                                                                        className={classes.preview}
                                                                        src={getFileIcon(data.file.name)}
                                                                        height="25"
                                                                        alt="file icon"
                                                                    />
                                                                )}
                                                            </Box>
                                                        </Grid>
                                                        <Grid
                                                            item
                                                            md={8}
                                                            sm={8}
                                                            xs={8}
                                                            style={{
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                            }}
                                                        >
                                                            <Typography variant="subtitle2">{data.file.name}</Typography>
                                                        </Grid>
                                                        <Grid item md={1} sm={1} xs={1}>
                                                            <Button
                                                                sx={{
                                                                    padding: "14px 14px",
                                                                    minWidth: "40px !important",
                                                                    borderRadius: "50% !important",
                                                                    ":hover": {
                                                                        backgroundColor: "#80808036",
                                                                    },
                                                                }}
                                                            >
                                                                <VisibilityOutlinedIcon
                                                                    style={{
                                                                        fontsize: "large",
                                                                        color: "#357AE8",
                                                                    }}
                                                                    onClick={() => renderFilePreview(data.file)}
                                                                />
                                                            </Button>
                                                        </Grid>
                                                        <Grid item md={1} sm={1} xs={1}>
                                                            <Button
                                                                sx={{
                                                                    padding: "14px 14px",
                                                                    minWidth: "40px !important",
                                                                    borderRadius: "50% !important",
                                                                    ":hover": {
                                                                        backgroundColor: "#80808036",
                                                                    },
                                                                }}
                                                                onClick={() => handleDeleteFileDocument(index)}
                                                            >
                                                                <FaTrash
                                                                    style={{
                                                                        fontSize: "medium",
                                                                        color: "#a73131",
                                                                    }}
                                                                />
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                );
                                            })}

                                    </Grid>
                                </Grid>

                                <Grid container>
                                    <Grid item md={12} sm={12} xs={12}>
                                        {refRecDocuments?.length > 0 &&
                                            refRecDocuments.map((data, index) => {
                                                const fileURL = URL.createObjectURL(data.file); // Generate a URL for the file preview

                                                return (
                                                    <Grid container key={index}>
                                                        <Grid item md={2} sm={2} xs={2}>
                                                            <Box
                                                                style={{
                                                                    display: "flex",
                                                                    justifyContent: "center",
                                                                    alignItems: "center",
                                                                }}
                                                            >
                                                                {data.file.type.includes("image/") ? (
                                                                    <img
                                                                        src={fileURL}
                                                                        alt={data.file.name}
                                                                        height={50}
                                                                        style={{
                                                                            maxWidth: "100%",
                                                                        }}
                                                                        onLoad={() => URL.revokeObjectURL(fileURL)} // Free up memory when image loads
                                                                    />
                                                                ) : (
                                                                    <img
                                                                        className={classes.preview}
                                                                        src={getFileIcon(data.file.name)}
                                                                        height="25"
                                                                        alt="file icon"
                                                                    />
                                                                )}
                                                            </Box>
                                                        </Grid>
                                                        <Grid
                                                            item
                                                            md={8}
                                                            sm={8}
                                                            xs={8}
                                                            style={{
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                            }}
                                                        >
                                                            <Typography variant="subtitle2">{data.file.name}</Typography>
                                                        </Grid>
                                                        <Grid item md={1} sm={1} xs={1}>
                                                            <Button
                                                                sx={{
                                                                    padding: "14px 14px",
                                                                    minWidth: "40px !important",
                                                                    borderRadius: "50% !important",
                                                                    ":hover": {
                                                                        backgroundColor: "#80808036",
                                                                    },
                                                                }}
                                                            >
                                                                <VisibilityOutlinedIcon
                                                                    style={{
                                                                        fontsize: "large",
                                                                        color: "#357AE8",
                                                                    }}
                                                                    onClick={() => renderFilePreview(data.file)}
                                                                />
                                                            </Button>
                                                        </Grid>
                                                        <Grid item md={1} sm={1} xs={1}>
                                                            <Button
                                                                sx={{
                                                                    padding: "14px 14px",
                                                                    minWidth: "40px !important",
                                                                    borderRadius: "50% !important",
                                                                    ":hover": {
                                                                        backgroundColor: "#80808036",
                                                                    },
                                                                }}
                                                                onClick={() => handleDeleteFileDocumentRef(index)}
                                                            >
                                                                <FaTrash
                                                                    style={{
                                                                        fontSize: "medium",
                                                                        color: "#a73131",
                                                                    }}
                                                                />
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                );
                                            })}
                                    </Grid>
                                </Grid>
                            </Grid>
                            {newotherPaymnets.paidthrough.value === "Cash" &&
                                newotherPaymnets.paidstatus === "Paid" && (
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

                            {newotherPaymnets.paidthrough.value === "Bank Transfer" &&
                                newotherPaymnets.paidstatus === "Paid" && (
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

                            {newotherPaymnets.paidthrough.value === "UPI" &&
                                newotherPaymnets.paidstatus === "Paid" && (
                                    <>
                                        <br />
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

                            {newotherPaymnets.paidthrough.value === "Card" &&
                                newotherPaymnets.paidstatus === "Paid" && (
                                    <>
                                        <br /> <br />
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

                            {newotherPaymnets.paidthrough.value === "Cheque" &&
                                newotherPaymnets.paidstatus === "Paid" && (
                                    <>
                                        <br />
                                        <br />

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
                                <Grid item md={12} sm={12} xs={12}>
                                    <br />
                                    <br />
                                    <Grid
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            gap: "15px",
                                        }}
                                    >
                                        <Button
                                            variant="contained"
                                            onClick={handleSubmit}
                                            sx={buttonStyles.buttonsubmit}
                                        >
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
                        </Grid>
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
                    </Box>
                    <br />
                    <br />
                </>
            )}
            <Box>
                <Headtitle title={"SCHEDULE PAYMENT BILLS"} />
                {/* ****** Header Content ****** */}


            </Box>
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

            {/* EXTERNAL COMPONENTS -------------- END */}
        </Box>
    );
}
export default AddOtherPayments;
