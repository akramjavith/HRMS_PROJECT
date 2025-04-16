import { makeStyles } from "@material-ui/core";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
    Box, InputAdornment, RadioGroup, Tooltip, FormControlLabel,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    IconButton, Radio,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Paper,
    Popover,
    Select,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TextareaAutosize,
    TextField,
    Typography,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Switch from "@mui/material/Switch";
import axios from "axios";
import * as FileSaver from "file-saver";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaTrash, FaSearch, FaPlus, FaEdit } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";
import csvIcon from "../../components/Assets/CSV.png";
import excelIcon from "../../components/Assets/excel-icon.png";
import fileIcon from "../../components/Assets/file-icons.png";
import pdfIcon from "../../components/Assets/pdf-icon.png";
import wordIcon from "../../components/Assets/word-icon.png";
import { handleApiError } from "../../components/Errorhandling";
import { StyledTableCell, StyledTableRow } from "../../components/Table";
import StyledDataGrid from "../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";

import AlertDialog from "../../components/Alert";
import {
    DeleteConfirmation,
    PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";

//new table
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import domtoimage from 'dom-to-image';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import AdvancedSearchBar from '../../components/Searchbar';
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import AggridTableForPaginationTable from "../../components/AggridTableForPaginationTable.js";


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
function ListReferenceCategoryDoc({ vendorAuto }) {
    const [stockmanages, setStockmanage] = useState([]);


    // State to track advanced filter
    const [advancedFilter, setAdvancedFilter] = useState(null);
    const [gridApi, setGridApi] = useState(null);
    const [columnApi, setColumnApi] = useState(null);
    const [filteredDataItems, setFilteredDataItems] = useState([]);
    //  const [filteredRowData, setFilteredRowData] = useState([]);
    const [logicOperator, setLogicOperator] = useState("AND");

    const [selectedColumn, setSelectedColumn] = useState("");
    const [selectedCondition, setSelectedCondition] = useState("Contains");
    const [filterValue, setFilterValue] = useState("");
    const [additionalFilters, setAdditionalFilters] = useState([]);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const conditions = ["Contains", "Does Not Contain", "Equals", "Does Not Equal", "Begins With", "Ends With", "Blank", "Not Blank"]; // AgGrid-like conditions

    const [overallFilterdata, setOverallFilterdata] = useState([]);
    const [totalProjects, setTotalProjects] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [deletecheck, setdeletecheck] = useState(false);


    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [searchedString, setSearchedString] = useState("");
    const [isHandleChange, setIsHandleChange] = useState(false);
    const gridRefTableImg = useRef(null);
    const gridRefTable = useRef(null);


    const { allProjects, isUserRoleAccess } = useContext(UserRoleAccessContext);
    const username = isUserRoleAccess.username;

    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        setOpenPopupMalert(true);
        setBtnSubmit(false);
    };
    const handleClosePopupMalert = () => {
        setOpenPopupMalert(false);
    };
    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupSeverity, setPopupSeverity] = useState("");
    const handleClickOpenPopup = () => {
        setOpenPopup(true);
        setBtnSubmit(false);
    };
    const handleClosePopup = () => {
        setOpenPopup(false);
    };

    let exportColumnNames = [
        "Company",
        "Subcategoryname",
        "Unit",
        "Floor",
        "Area",
        "Location",
        "Request Mode For",
        "Stock Category",
        "Stock Sub Category",
        "Quantity",
        "Quantity & UOM",
        "Material",
        "Product Details",
        "GST No",
        "Bill No",
        "Warranty Details",
        "Warranty",
        "Purchase Date",
        "Bill Date",
        "Rate",
        "Vendor Group",
        "Vendor Name",
    ];
    let exportRowValues = [
        "company",
        "branch",
        "unit",
        "floor",
        "area",
        "location",
        "requestmode",
        "stockcategory",
        "stocksubcategory",
        "quantitynew",
        "uomnew",
        "materialnew",
        "productdetailsnew",
        "gstno",
        "billno",
        "warrantydetails",
        "warranty",
        "purchasedate",
        "billdate",
        "rate",
        "vendorgroup",
        "vendor",
    ];


    //Access Module
    const pathname = window.location.pathname;
    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Stock Purchase"),
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
    }, []);


    const gridRef = useRef(null);
    const {
        isUserRoleCompare,
        isAssignBranch,
        allCompany,
        allBranch,
        allUnit,
        allTeam, buttonStyles,
        pageName, setPageName,
    } = useContext(UserRoleAccessContext);
    const [singleDoc, setSingleDoc] = useState({});
    const { auth } = useContext(AuthContext);



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


    //Datatable
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const [openInfo, setOpeninfo] = useState(false);
    const [docData, setDocData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [viewInfo, setViewInfo] = useState([]);
    const [openView, setOpenView] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [documentFiles, setDocumentFiles] = useState([]);
    const [newcheckbranch, setNewcheckBranch] = useState("Please Select Branch");
    const [Specification, setSpecification] = useState([]);

    const [btnSubmit, setBtnSubmit] = useState(false);
    const initialColumnVisibility = {
        actions: true,
        checkbox: true,
        serialNumber: true,
        company: true,
        branch: true,
        unit: true,
        floor: true,
        area: true,
        location: true,
        requestmode: true,
        stockcategory: true,
        stocksubcategory: true,
        uomnew: true,
        quantitynew: true,
        materialnew: true,
        productdetailsnew: true,

        vendor: true,
        vendorgroup: true,

        gstno: true,
        billno: true,
        warrantydetails: true,
        warranty: true,
        purchasedate: true,
        billdate: true,
        rate: true,
        vendorname: true,
    };

    const [vendorGroup, setVendorGroup] = useState("Choose Vendor Group");
    const [vendorGroupOpt, setVendorGroupopt] = useState([]);
    const [vendorOverall, setVendorOverall] = useState([]);
    const [vendorNew, setVendorNew] = useState("Choose Vendor");
    const [vendorNewEdit, setVendorNewEdit] = useState("Choose Vendor");

    const [vendorOpt, setVendoropt] = useState([]);

    const [vendorGroupEdit, setVendorGroupEdit] = useState("Choose Vendor Group");
    const [vendorOptEdit, setVendoroptEdit] = useState([]);

    const [vendorOptIndEdit, setVendoroptIndEdit] = useState([]);

    const handleChangeGroupNameIndexBasedEdit = async (e, index) => {
        let foundDatas = vendorOverall
            .filter((data) => {
                return data.name == e.value;
            })
            .map((item) => item.vendor);

        let res = await axios.get(SERVICE.ALL_VENDORDETAILS, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
        });
        const all = [
            ...res?.data?.vendordetails.map((d) => ({
                ...d,
                label: d.vendorname,
                value: d.vendorname,
            })),
        ];

        let final = all.filter((data) => {
            return foundDatas.includes(data.value);
        });

        setVendoroptIndEdit((prev) => {
            const updated = [...prev];
            updated[index] = final;
            return updated;
        });
    };

    const [vendorOptInd, setVendoroptInd] = useState([]);
    const handleChangeGroupNameIndexBased = async (e, index) => {
        let foundDatas = vendorOverall
            .filter((data) => {
                return data.name == e.value;
            })
            .map((item) => item.vendor);

        let res = await axios.get(SERVICE.ALL_VENDORDETAILS, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
        });
        const all = [
            ...res?.data?.vendordetails.map((d) => ({
                ...d,
                label: d.vendorname,
                value: d.vendorname,
            })),
        ];

        let final = all.filter((data) => {
            return foundDatas.includes(data.value);
        });

        let spreaded = [...vendorOptInd];
        spreaded[index] = final;

        setVendoroptInd(spreaded);
    };

    const handleChangeGroupNameEdit = async (e) => {
        let foundDatas = vendorOverall
            .filter((data) => {
                return data.name == e.value;
            })
            .map((item) => item.vendor);

        let res = await axios.get(SERVICE.ALL_VENDORDETAILS, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
        });
        const all = [
            ...res?.data?.vendordetails.map((d) => ({
                ...d,
                label: d.vendorname,
                value: d.vendorname,
            })),
        ];

        let final = all.filter((data) => {
            return foundDatas.includes(data.value);
        });

        setVendoroptEdit(final);
    };

    const handleChangeGroupName = async (e) => {
        let foundDatas = vendorOverall
            .filter((data) => {
                return data.name == e.value;
            })
            .map((item) => item.vendor);

        let res = await axios.get(SERVICE.ALL_VENDORDETAILS, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
        });
        const all = [
            ...res?.data?.vendordetails.map((d) => ({
                ...d,
                label: d.vendorname,
                value: d.vendorname,
            })),
        ];

        let final = all.filter((data) => {
            return foundDatas.includes(data.value);
        });

        setVendoropt(final);
    };

    //reference images
    // const handleInputChangeedit = (event) => {
    //   const files = event.target.files;
    //   let newSelectedFiles = [...refImageedit];

    //   for (let i = 0; i < files.length; i++) {
    //     const file = files[i];
    //     // Check if the file is an image
    //     if (file.type.startsWith("image/")) {

    //       const reader = new FileReader();
    //       reader.onload = () => {
    //         newSelectedFiles.push({
    //           name: file.name,
    //           size: file.size,
    //           type: file.type,
    //           preview: reader.result,
    //           base64: reader.result.split(",")[1],
    //         });
    //         setRefImageedit(newSelectedFiles);
    //       };
    //       reader.readAsDataURL(file);
    //     } else {
    //       setPopupContentMalert("Only Accept Images!");
    //       setPopupSeverityMalert("info");
    //       handleClickOpenPopupMalert();
    //     }
    //   }
    // };

    const handleInputChangeedit = (event) => {
        const files = event.target.files;
        let newSelectedFiles = [...refImageedit];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            // Check if the file is an image
            if (file.type.startsWith("image/")) {
                if (file.size <= 5 * 1024 * 1024) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        newSelectedFiles.push({
                            name: file.name,
                            size: file.size,
                            type: file.type,
                            preview: reader.result,
                            base64: reader.result.split(",")[1],
                        });
                        setRefImageedit(newSelectedFiles);
                    };
                    reader.readAsDataURL(file);
                } else {
                    setPopupContentMalert("File size should be less than 5MB!");
                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();
                }
            } else {
                setPopupContentMalert("Only Accept Images!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
        }
    };

    const [getImg, setGetImg] = useState(null);
    const [refImage, setRefImage] = useState([]);
    const [previewURL, setPreviewURL] = useState(null);
    const [file, setFile] = useState();

    const renderFilePreviewedit = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };

    //first deletefile
    const handleDeleteFileedit = (index) => {
        const newSelectedFiles = [...refImageedit];
        newSelectedFiles.splice(index, 1);
        setRefImageedit(newSelectedFiles);
    };

    const resetImageedit = () => {
        setGetImgedit("");
        setFileedit("");
        setRefImageedit([]);
        setPreviewURLedit(null);
    };

    const handleUploadOverAlledit = () => {
        setUploadPopupOpenedit(false);
    };

    //reference images
    const handleInputChangewarranty = (event) => {
        const files = event.target.files;
        let newSelectedFiles = [...refImagewarranty];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            // Check if the file is an image
            if (file.type.startsWith("image/")) {
                if (file.size <= 5 * 1024 * 1024) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        newSelectedFiles.push({
                            name: file.name,
                            size: file.size,
                            type: file.type,
                            preview: reader.result,
                            base64: reader.result.split(",")[1],
                        });
                        setRefImagewarranty(newSelectedFiles);
                    };
                    reader.readAsDataURL(file);
                } else {
                    setPopupContentMalert("File size should be less than 5MB!");
                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();
                }
            } else {
                setPopupContentMalert("Only Accept Images!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
        }
    };

    //first allexcel....
    const getFileIconwarranty = (fileName) => {
        const extension1 = fileName?.split(".").pop();
        switch (extension1) {
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

    //first allexcel....
    const getFileIconedit = (fileName) => {
        const extension1 = fileName?.split(".").pop();
        switch (extension1) {
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

    const fetchUom = async () => {
        try {
            let res_project = await axios.get(SERVICE.ALL_VOMMASTERNAME, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let codeValues = res_project?.data?.vommaster.map((data) => ({
                name: data.name,
                code: data.code,
            }));
            setuomcodes(codeValues);

            // const deptall = [...res_project?.data?.vommaster.map((d) => (
            //     {
            //         ...d,
            //         label: d.name,
            //         value: d.name
            //     }
            // ))];
            // setVomMasterget(deptall);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const [items, setItems] = useState([]);
    const handleClickOpenview = () => {
        setOpenview(true);
    };
    const [openview, setOpenview] = useState(false);
    const [selectedUnitedit, setSelectedUnitedit] =
        useState("Please Select Unit");
    const [selectedBranchedit, setSelectedBranchedit] = useState(
        "Please Select Branch"
    );

    const [pageNumber, setPageNumber] = useState(1);
    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );

    const [categoryOption, setCategoryOption] = useState([]);
    const [subcategoryOpt, setSubcategoryOption] = useState([]);
    const [materialOptNew, setMaterialoptNew] = useState([]);
    const [companys, setCompanys] = useState([]);

    const handleChangephonenumberEdit = (e) => {
        // const regex = /^[0-9]+$/;  // Only allows positive integers
        const regex = /^\d*\.?\d*$/;
        const inputValue = e.target.value;
        // Check if the input value matches the regex or if it's empty (allowing backspace)
        if (regex.test(inputValue) || inputValue === "") {
            // Update the state with the valid numeric value
            setStockmanagemasteredit({
                ...stockmanagemasteredit,
                estimation: inputValue,
            });
        }
    };

    const handleEstimationChangeEdit = (e) => {
        const { value } = e.target;
        setStockmanagemasteredit({
            ...stockmanagemasteredit,
            estimationtime: value,
        });
        // calculateExpiryDate(value, stockmanagemasteredit.purchasedate);
    };

    const [selectedPurchaseDateEdit, setSelectedPurchaseDateEdit] = useState("");

    const handlePurchaseDateChangeEdit = (e) => {
        const { value } = e.target;
        setStockmanagemasteredit({ ...stockmanagemasteredit, purchasedate: value });
        setSelectedPurchaseDateEdit(value);
        // calculateExpiryDateEdit(stockmasterEdit.estimationtime, value);
    };

    const formatDateString = (date) => {
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, "0");
        const month = (d.getMonth() + 1).toString().padStart(2, "0");
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const calculateExpiryDateEdit = () => {
        if (
            stockmanagemasteredit.estimationtime &&
            stockmanagemasteredit.purchasedate
        ) {
            const currentDate = new Date(stockmanagemasteredit.purchasedate);
            let expiryDate = new Date(currentDate);

            if (stockmanagemasteredit.estimationtime === "Days") {
                expiryDate.setDate(
                    currentDate.getDate() + parseInt(stockmanagemasteredit.estimation)
                );
            } else if (stockmanagemasteredit.estimationtime === "Month") {
                expiryDate.setMonth(
                    currentDate.getMonth() + parseInt(stockmanagemasteredit.estimation)
                );
            } else if (stockmanagemasteredit.estimationtime === "Year") {
                expiryDate.setFullYear(
                    currentDate.getFullYear() + parseInt(stockmanagemasteredit.estimation)
                );
            }

            const formattedExpiryDate = formatDateString(expiryDate);

            let formattedempty = formattedExpiryDate.includes("NaN-NaN-NaN")
                ? ""
                : formattedExpiryDate;

            setStockmanagemasteredit({
                ...stockmanagemasteredit,
                warrantycalculation: formattedempty, // Format date as needed
            });
        }
    };

    const [vendorgetid, setVendorgetid] = useState({});
    const [vendornameid, setVendornameid] = useState({});
    const [vendormaster, setVendormaster] = useState([]);
    const handleUploadOverAllwarranty = () => {
        setUploadPopupOpenwarranty(false);
    };

    const [stockArray, setStockArray] = useState([]);

    const [uomcodes, setuomcodes] = useState([]);

    const handleStockArray = () => {
        const isNameMatch = stockArray.some(
            (item) =>
                item.materialnew == stockmanagemasteredit.materialnew &&
                item.uomnew === String(stockmanagemasteredit.uomnew) &&
                item.quantitynew == stockmanagemasteredit.quantitynew
        );
        if (
            stockmanagemasteredit.stockcategory === "Please Select Stock Category" ||
            stockmanagemasteredit.stockcategory === ""
        ) {
            setPopupContentMalert("Please Select Stock Category!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            stockmanagemasteredit.stocksubcategory ===
            "Please Select Stock Sub Category" ||
            stockmanagemasteredit.stocksubcategory === ""
        ) {
            setPopupContentMalert("Please Select Stock Sub Category!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            stockmanagemasteredit.materialnew === "Please Select Material" ||
            stockmanagemasteredit.materialnew === ""
        ) {
            setPopupContentMalert("Please Select Materia!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            stockmanagemasteredit.uomnew === "" ||
            stockmanagemasteredit.uomnew === undefined
        ) {
            setPopupContentMalert("Please Enter UOM!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            stockmanagemasteredit.quantitynew === "" ||
            stockmanagemasteredit.quantitynew === undefined
        ) {
            setPopupContentMalert("Please Enter Quantity!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (isNameMatch) {
            setPopupContentMalert("Todo Data Already Exist!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        // else if (stockmanagemasteredit.productdetailsnew === "" || stockmanagemasteredit.productdetailsnew === undefined) {
        //     setShowAlert(
        //         <>
        //             {" "}
        //             <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}>Please Enter Product Details</p>{" "}
        //         </>
        //     );
        //     handleClickOpenerr();
        // }
        else {
            try {
                let findData = uomcodes.find(
                    (item) => item.name === stockmanagemasteredit.uomnew
                );

                setStockArray([
                    ...stockArray,
                    {
                        uomnew: stockmanagemasteredit.uomnew,
                        quantitynew: stockmanagemasteredit.quantitynew,
                        materialnew: stockmanagemasteredit.materialnew,
                        productdetailsnew:
                            stockmanagemasteredit.productdetailsnew === undefined
                                ? ""
                                : stockmanagemasteredit.productdetailsnew,
                        uomcodenew: findData.code,
                    },
                ]);

                setStockmanagemasteredit({
                    ...stockmanagemasteredit,
                    uomnew: "",
                    quantitynew: "",
                    materialnew: "Please Select Material",
                    productdetailsnew: "",
                });
            } catch (e) {
                setPopupContentMalert("UOM is not found! Hence cannot get a UOM Code!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
        }
    };

    const deleteTodo = (index) => {
        setStockArray(
            stockArray.filter((data, indexcurrent) => {
                return indexcurrent !== index;
            })
        );
    };

    const fetchVendor = async () => {
        try {
            let res1 = await axios.get(SERVICE.ALL_VENDORGROUPING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const allGroup = Array.from(
                new Set(res1?.data?.vendorgrouping.map((d) => d.name))
            ).map((item) => {
                return {
                    label: item,
                    value: item,
                };
            });

            setVendorGroupopt(allGroup);
            setVendorOverall(res1?.data?.vendorgrouping);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    //first deletefile
    const handleDeleteFilewarranty = (index) => {
        const newSelectedFiles = [...refImagewarranty];
        newSelectedFiles.splice(index, 1);
        setRefImagewarranty(newSelectedFiles);
    };

    const classes = useStyles();

    //bill upload edit

    const [getImgedit, setGetImgedit] = useState(null);
    const [refImageedit, setRefImageedit] = useState([]);
    const [previewURLedit, setPreviewURLedit] = useState(null);
    const [fileedit, setFileedit] = useState();

    // upload warranty

    const [getImgwarranty, setGetImgwarranty] = useState(null);
    const [refImagewarranty, setRefImagewarranty] = useState([]);
    const [previewURLwarranty, setPreviewURLwarranty] = useState(null);
    const [filewarranty, setFilewarranty] = useState();

    const renderFilePreviewwarranty = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };
    const [uploadPopupOpenedit, setUploadPopupOpenedit] = useState(false);
    const handleClickUploadPopupOpenedit = () => {
        setUploadPopupOpenedit(true);
    };

    // Upload Popup
    const [uploadPopupOpenwarranty, setUploadPopupOpenwarranty] = useState(false);
    const handleClickUploadPopupOpenwarranty = () => {
        setUploadPopupOpenwarranty(true);
    };
    const handleUploadPopupClosewarranty = () => {
        setUploadPopupOpenwarranty(false);
        setGetImgwarranty("");
        setFilewarranty("");
        setPreviewURLwarranty(null);
    };

    const resetImagewarranty = () => {
        setGetImgwarranty("");
        setFilewarranty("");
        setRefImagewarranty([]);
        setPreviewURLwarranty(null);
    };

    const handleUploadPopupCloseedit = () => {
        setUploadPopupOpenedit(false);
        setGetImgedit("");
        setFileedit("");
        setPreviewURLedit(null);
    };


    // Upload Popup
    const [uploadPopupOpenwarrantyedit, setUploadPopupOpenwarrantyedit] =
        useState(false);
    const handleClickUploadPopupOpenwarrantyedit = () => {
        setUploadPopupOpenwarrantyedit(true);
    };

    const vendorid = async (id) => {
        try {
            let res = await axios.get(`${SERVICE.SINGLE_VENDORDETAILS}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setVendorgetid(res?.data?.svendordetails);
            setVendornameid(id);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    //get all vom master name.
    const fetchVomMaster = async (e) => {
        try {
            let res_vom = await axios.get(SERVICE.MANAGESTOCKITEMS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let getdata = res_vom.data.managestockitems.filter((data) => {
                return (
                    data.itemname === e.value &&
                    data.stockcategory === stockmanagemasteredit.stockcategory &&
                    data.stocksubcategory === stockmanagemasteredit.stocksubcategory
                );
            });

            setStockmanagemasteredit((prev) => ({
                ...prev,
                uomnew: getdata[0].uom,
            }));
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const fetchSubcategoryBased = async (e) => {
        try {
            let res_category = await axios.get(SERVICE.STOCKCATEGORY, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let data_set = res_category.data.stockcategory.filter((data) => {
                return e.value === data.categoryname;
            });

            let subcatOpt = data_set
                ?.map((item) => {
                    return item.subcategoryname.map((subcategory) => {
                        return {
                            label: subcategory,
                            value: subcategory,
                        };
                    });
                })
                .flat();
            setSubcategoryOption(subcatOpt);
            // setStocksubcategoryOptEdit(subcatOpt)
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const fetchMaterialNew = async (e, stockcategory) => {
        try {
            let res = await axios.get(SERVICE.MANAGESTOCKITEMS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const resultall = res.data.managestockitems.filter((data) => {
                return (
                    data.stockcategory === stockcategory &&
                    data.stocksubcategory === e.value
                );
            });

            const assetmaterialuniqueArray = resultall.map((item) => ({
                label: item.itemname,
                value: item.itemname,
            }));

            setMaterialoptNew(assetmaterialuniqueArray);
            // setMaterialoptEditNew(assetmaterialuniqueArray);

            setMaterialoptNew(assetmaterialuniqueArray);
            // setMaterialoptEditNew(assetmaterialuniqueArray);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const fetchCompanyDropdowns = async () => {
        try {
            let res_category = await axios.get(SERVICE.COMPANY, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const companyall = [
                ...res_category?.data?.companies.map((d) => ({
                    ...d,
                    label: d.name,
                    value: d.name,
                })),
            ];
            setCompanys(companyall);
            setCompanysEdit(companyall);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const [refImagewarrantyedit, setRefImagewarrantyedit] = useState([]);

    //get single row to edit....
    const getCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.STOCKPURCHASE_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setVendorGroup(res?.data?.sstock?.vendorgroup);
            setVendorNew(res?.data?.sstock?.vendor);
            handleChangeGroupName({ value: res?.data?.sstock?.vendorgroup });

            setStockmanagemasteredit({
                ...res?.data?.sstock,
                materialnew: "Please Select Material",
            });
            setRefImageedit(res?.data?.sstock?.files);
            setRefImagewarrantyedit(res?.data?.sstock?.warrantyfiles);
            // setSelectedAssetTypeEdit(res?.data?.sstock?.assettype);
            setStockArray(res?.data?.sstock.stockmaterialarray);

            setSelectedPurchaseDateEdit(res?.data?.sstock.purchasedate);

            setSelectedBranchedit(res?.data?.sstock.branch);
            setSelectedUnitedit(res?.data?.sstock.unit);
            await fetchSubcategoryBased({
                label: res?.data?.sstock.stockcategory,
                value: res?.data?.sstock.stockcategory,
            });
            await fetchMaterialNew(
                {
                    label: res?.data?.sstock.stocksubcategory,
                    value: res?.data?.sstock.stocksubcategory,
                },
                res?.data?.sstock.stockcategory
            );

            await fetchBranchDropdownsEdit(res?.data?.sstock?.company);
            await fetchUnitsEdit(res?.data?.sstock?.branch);
            await fetchFloorEdit(res?.data?.sstock?.branch);
            await fetchAreaEdit(res?.data?.sstock?.branch, res?.data?.sstock?.floor);

            if (res?.data?.sstock.vendorid) {
                let resv = await axios.get(
                    `${SERVICE.SINGLE_VENDORDETAILS}/${res?.data?.sstock.vendorid}`,
                    {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                    }
                );
                setVendorgetid(resv?.data?.svendordetails);
            }
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    // Alert delete popup
    // let projectid = deleteproject._id;
    const delProject = async () => {
        setPageName(!pageName)
        try {
            await axios.delete(
                `${SERVICE.STOCKPURCHASE_SINGLE}/${stockmanagemasteredit._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            await fetchStock();
            // handleCloseMod();
            handleCloseDelete();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setSelectedRows([]);
            setPage(1);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    // get single row to view....
    const getviewCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.STOCKPURCHASE_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setStockmanagemasteredit(res?.data?.sstock);
            handleClickOpenview();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const [quantityNeww, setQuantityNeww] = useState();
    const [materialNeww, setMaterialNeww] = useState();
    const [productdetailsNeww, setProductdetailsNeww] = useState();
    const [quantityAndUom, setQuantityAndUom] = useState();

    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.STOCKPURCHASE_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let res_project_1 = await axios.get(SERVICE.ALL_VOMMASTERNAME, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let quantityNew = res?.data?.sstock.stockmaterialarray.map(
                (data, newindex) => {
                    return ` ${data.quantitynew}`;
                }
            );
            setQuantityNeww(quantityNew.toString());

            let materialNew = res?.data?.sstock.stockmaterialarray.map(
                (data, newindex) => {
                    return ` ${data.materialnew}`;
                }
            );
            setMaterialNeww(materialNew.toString());

            let productdetailsNew = res?.data?.sstock.stockmaterialarray.map(
                (data, newindex) => {
                    return ` ${data.productdetailsnew}`;
                }
            );
            setProductdetailsNeww(productdetailsNew.toString());

            let quantityAndUom = res?.data?.sstock.stockmaterialarray.map(
                (data, newindex) => {
                    return ` ${data.quantitynew}#${data.uomcodenew}`;
                }
            );
            setQuantityAndUom(quantityAndUom.toString());

            let codeValues = res_project_1?.data?.vommaster.map((data) => ({
                name: data.name,
                code: data.code,
            }));

            let setDataOne = codeValues.find(
                (item1) => res?.data?.sstock.uomnew === item1.name
            );

            let setData = {
                ...res?.data?.sstock,
                uomcode: setDataOne ? setDataOne.code : "",
            };

            setStockmanagemasteredit(setData);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    //get all Locations edit.
    const fetchAllLocationEdit = async (a, b, c) => {
        try {
            let res_type = await axios.get(SERVICE.LOCATIONGROUPING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let result = res_type.data.locationgroupings
                .filter((d) => d.branch === a && d.floor === b && d.area === c)
                .map((data) => data.location);
            let ji = [].concat(...result);
            const all = [
                { label: "ALL", value: "ALL" },
                ...ji.map((d) => ({
                    ...d,
                    label: d,
                    value: d,
                })),
            ];
            setLocationsEdit(all);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    useEffect(() => {
        fetchStock();
        // getexcelDatas();
        addSerialNumber();
        fetchCompanyDropdowns();
        fetchCategoryAll();
        fetchUom();
        // fetchVomMaster();
        fetchVendor();
    }, [vendorAuto]);

    useEffect(() => {
        const savedVisibility = localStorage.getItem("columnVisibility1");
        if (savedVisibility) {
            setColumnVisibility(JSON.parse(savedVisibility));
        }
    }, []);

    //get all branches.
    const fetchCategoryAll = async () => {
        try {
            let res_location = await axios.get(SERVICE.STOCKCATEGORY, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setCategoryOption([
                ...res_location?.data?.stockcategory?.map((t) => ({
                    ...t,
                    label: t.categoryname,
                    value: t.categoryname,
                })),
            ]);
            // setCategoryOptionEdit([
            //     ...res_location?.data?.stockcategory?.map((t) => ({
            //         ...t,
            //         label: t.categoryname,
            //         value: t.categoryname,
            //     })),
            // ]);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    useEffect(() => {
        localStorage.setItem("columnVisibility1", JSON.stringify(columnVisibility));
    }, [columnVisibility]);
    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    const fetchAreaEdit = async (a, e) => {
        try {
            let res_type = await axios.get(SERVICE.AREAGROUPING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let result = res_type.data.areagroupings
                .filter((d) => d.branch === a && d.floor === e)
                .map((data) => data.area);
            let ji = [].concat(...result);
            const all = ji.map((d) => ({
                ...d,
                label: d,
                value: d,
            }));
            setAreasEdit(all);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    const getDownloadFile = async (data) => {
        const ans = data
            .filter((item) => item?.document?.length < 1)
            .map((d) => d?.documentstext);
        const ansDocuments = data.filter((item) => item?.document?.length > 0);
        const ansType = data
            .filter((item) => item?.document?.length < 1)
            .map((d) => d?.label);

        if (ans.length > 0) {
            const pages = ans;
            const numPages = pages.length;
            const pageNumber = 1;

            const goToPrevPage = () =>
                setPageNumber((prevPage) => Math.max(prevPage - 1, 1));
            const goToNextPage = () =>
                setPageNumber((prevPage) => Math.min(prevPage + 1, numPages));

            const handlePageClick = (page) => {
                setPageNumber(page);
            };

            function updatePage() {
                const currentPageContent = pages[pageNumber - 1];
                document.querySelector(".pdf-navigation span").innerText =
                    "Page " + pageNumber + " of " + numPages;
                document.querySelector(".pdf-content").innerHTML = currentPageContent;
            }

            const doc = new jsPDF();

            // Show the content of the current page
            doc.text(10, 10, pages[pageNumber - 1]);

            // Convert the content to a data URL
            const pdfDataUri = doc.output("datauristring");

            const newTab = window.open();
            newTab.document.write(`
        <html>
          <style>
            body {
              font-family: 'Arial, sans-serif';
              margin: 0;
              padding: 0;
              background-color: #fff;
              color: #000;
            }
            .pdf-viewer {
              display: flex;
              flex-direction: column;
            }
            .pdf-navigation {
              display: flex;
              justify-content: space-between;
              margin: 20px;
              align-items: center;
            }
            button {
              background-color: #007bff;
              color: #fff;
              padding: 10px;
              border: none;
              cursor: pointer;
            }
            .pdf-content {
              background-color: #fff;
              padding: 20px;
              box-sizing: border-box;
              flex: 1;
            }
            #pdf-heading {
              text-align: center;
            }
            .pdf-thumbnails {
              display: flex;
              justify-content: center;
              margin-top: 20px;
            }
            .pdf-thumbnail {
              cursor: pointer;
              margin: 0 5px;
              font-size: 14px;
              padding: 5px;
            }
          </style>
          <body>
            <div class="pdf-viewer">
              <div class="pdf-navigation">
                <button onclick="goToPrevPage()">Prev</button>
                <span>Page ${pageNumber} of ${numPages}</span>
                <button onclick="goToNextPage()">Next</button>
              </div>
              <h2 id="pdf-heading">${ansType[pageNumber - 1]
                }</h2> <!-- Add heading here -->
              <div class="pdf-content">
              <div class="pdf-content">
                ${/* Render PDF content directly in the embed tag */ ""}
                <embed src="${pdfDataUri}" type="application/pdf" width="100%" height="600px" />
              </div>
              <div class="pdf-thumbnails">
                ${pages
                    .map(
                        (_, index) =>
                            `<div class="pdf-thumbnail" onclick="handlePageClick(${index + 1
                            })">${index + 1}</div>`
                    )
                    .join("")}
              </div>
            </div>
            <script>
              let pageNumber = ${pageNumber};
              let numPages = ${numPages};
              let pagesData = ${JSON.stringify(pages)};
              let ansType = ${JSON.stringify(ansType)};
  
              function goToPrevPage() {
                if (pageNumber > 1) {
                  pageNumber--;
                  updatePage();
                }
              }
  
              function goToNextPage() {
                if (pageNumber < numPages) {
                  pageNumber++;
                  updatePage();
                }
              }
  
              function updatePage() {
                document.querySelector('.pdf-navigation span').innerText = 'Page ' + pageNumber + ' of ' + numPages;
                document.querySelector('.pdf-content').innerHTML = pagesData[pageNumber - 1];
                document.getElementById('pdf-heading').innerText = ansType[pageNumber - 1]; // Update heading
              }
  
              function handlePageClick(page) {
                pageNumber = page;
                updatePage();
              }
              
              // Load initial content
              updatePage();
            </script>
          </body>
        </html>
      `);
        }
        if (ansDocuments.length > 0) {
            data.forEach((d) => {
                const readExcel = (base64Data) => {
                    return new Promise((resolve, reject) => {
                        const bufferArray = Uint8Array.from(atob(base64Data), (c) =>
                            c.charCodeAt(0)
                        ).buffer;

                        const wb = XLSX.read(bufferArray, { type: "buffer" });

                        const wsname = wb.SheetNames[0];
                        const ws = wb.Sheets[wsname];

                        const data = XLSX.utils.sheet_to_json(ws);

                        resolve(data);
                    });
                };

                const pdfContentArray = d.document;

                pdfContentArray.forEach((document) => {
                    const fileExtension = getFileExtension(document.name);

                    if (fileExtension === "xlsx" || fileExtension === "xls") {
                        readExcel(document.data)
                            .then((excelData) => {
                                const newTab = window.open();
                                const htmlTable = generateHtmlTable(excelData);
                                newTab.document.write(htmlTable);
                            })
                            .catch((error) => { });
                    } else if (fileExtension === "pdf") {
                        // Handle PDF file
                        const newTab = window.open();
                        newTab.document.write(
                            '<iframe width="100%" height="100%" src="' +
                            document.preview +
                            '"></iframe>'
                        );
                    }
                });

                // Helper function to extract file extension from a filename
                function getFileExtension(filename) {
                    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
                }

                // Helper function to generate an HTML table from Excel data
                function generateHtmlTable(data) {
                    const headers = Object.keys(data[0]);

                    const tableHeader = `<tr>${headers
                        .map(
                            (header) =>
                                `<th style="padding: 4px; background-color: #f2f2f2;">${header}</th>`
                        )
                        .join("")}</tr>`;

                    const tableRows = data.map((row, index) => {
                        const rowStyle =
                            index % 2 === 0 ? "background-color: #f9f9f9;" : "";
                        const cells = headers
                            .map(
                                (header) =>
                                    `<td style="padding: 4px;${rowStyle}">${row[header]}</td>`
                            )
                            .join("");
                        return `<tr>${cells}</tr>`;
                    });

                    return `<table style="border-collapse: collapse; width: 100%;" border="1"; overflow :"scroll">${tableHeader}${tableRows.join(
                        ""
                    )}</table>`;
                }
            });
        }
    };
    const [branchsEdit, setBranchsEdit] = useState([]);
    const [unitsEdit, setUnitsEdit] = useState([]);
    const [companysEdit, setCompanysEdit] = useState([]);
    const [floorsEdit, setFloorEdit] = useState([]);
    const [areasEdit, setAreasEdit] = useState([]);
    const [locationsEdit, setLocationsEdit] = useState([
        { label: "ALL", value: "ALL" },
    ]);

    const [isEditOpen, setIsEditOpen] = useState(false);
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
        setStockmanagemasteredit({
            company: "Please Select Company",
            branch: "Please Select Branch",
            unit: "Please Select Unit",
            floor: "Please Select Floor",
            area: "Please Select Area",
            location: "Please Select Location",
            workstation: "Please Select Workstation",
            assettype: "",
            asset: "",
            material: "Please Select Material",
            component: "Please Select Component",
            productdetails: "",
            uom: "Please Select UOM",
            quantity: "",
            stockcategory: "Please Select Stock Category",
            stocksubcategory: "Please Select Stock Sub Category",
            uomnew: "",
            quantitynew: "",
            materialnew: "Please Select Material",
            productdetailsnew: "",
        });
    };
    const fetchBranchDropdownsEdit = async (e) => {
        try {
            let res_branch = await axios.get(SERVICE.BRANCH, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let result = res_branch.data.branch.filter((d) => d.company === e);
            const branchall = result.map((d) => ({
                ...d,
                label: d.name,
                value: d.name,
            }));
            setBranchsEdit(branchall);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const editSubmit = (e) => {
        setBtnSubmit(true);
        e.preventDefault();
        fetchStockedit();
        const isNameMatch = stockmanageedit.some(
            (item) =>
                item.company == stockmanagemasteredit.company &&
                item.branch == stockmanagemasteredit.branch &&
                item.unit == stockmanagemasteredit.unit &&
                item.floor == stockmanagemasteredit.floor &&
                item.area == stockmanagemasteredit.area &&
                item.location == stockmanagemasteredit.location &&
                item.vendorname == stockmanagemasteredit.vendorname &&
                item.billno == stockmanagemasteredit.billno &&
                item?.productdetailsnew?.toLowerCase() ==
                stockmanagemasteredit?.productdetailsnew?.toLowerCase() &&
                item.requestmode == stockmanagemasteredit.requestmode &&
                item.stockcategory == stockmanagemasteredit.stockcategory &&
                item.stocksubcategory == stockmanagemasteredit.stocksubcategory &&
                item.warrantydetails == stockmanagemasteredit.warrantydetails &&
                item.uomnew == stockmanagemasteredit.uomnew &&
                item.quantitynew == Number(stockmanagemasteredit.quantitynew) &&
                item.materialnew == stockmanagemasteredit.materialnew &&
                item.rate == Number(stockmanagemasteredit.rate) &&
                item.billdate == stockmanagemasteredit.billdate
        );

        if (stockmanagemasteredit.company === "Please Select Company") {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (stockmanagemasteredit.branch === "Please Select Branch") {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (stockmanagemasteredit.unit === "Please Select Unit") {
            setPopupContentMalert("Please Select Unit!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (stockmanagemasteredit.floor === "Please Select Floor") {
            setPopupContentMalert("Please Select Floor!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (stockmanagemasteredit.area === "Please Select Area") {
            setPopupContentMalert("Please Select Area!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (stockmanagemasteredit.location === "Please Select Location") {
            setPopupContentMalert("Please Select Location!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (vendorGroup === "Choose Vendor Group") {
            setPopupContentMalert("Please Select Vendor Group!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (vendorNew === "Choose Vendor") {
            setPopupContentMalert("Please Select Vendor!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        // else if (stockmanagemasteredit.gstno === "") {
        //   setShowAlert(
        //     <>
        //       <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
        //       <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter GST No"}</p>
        //     </>
        //   );
        //   handleClickOpenerr();
        // }
        else if (stockmanagemasteredit.billno === "") {
            setPopupContentMalert("Please Enter Billno!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            stockmanagemasteredit.requestmode === "Please Select Request Mode" ||
            stockmanagemasteredit.requestmode === ""
        ) {
            setPopupContentMalert("Please Select Request Mode For!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            stockmanagemasteredit.stockcategory === "Please Select Stock Category" ||
            stockmanagemasteredit.stockcategory === ""
        ) {
            setPopupContentMalert("Please Select Stock Category!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            stockmanagemasteredit.stocksubcategory ===
            "Please Select Stock Sub Category" ||
            stockmanagemasteredit.stocksubcategory === ""
        ) {
            setPopupContentMalert("Please Select Stock Sub Category!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (stockArray.length === 0) {
            setPopupContentMalert("Please Insert Stock Todo List!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (stockmanagemasteredit.warrantydetails === "") {
            setPopupContentMalert("Please Enter Warranty Details!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (stockmanagemasteredit.rate === "") {
            setPopupContentMalert("Please Enter Rate!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (stockmanagemasteredit.billdate === "") {
            setPopupContentMalert("Please Select Bill Date!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (isNameMatch) {
            setPopupContentMalert("Data Already Exist!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            sendEditRequest();
        }
    };
    const fetchUnitsEdit = async (e) => {
        try {
            let res_unit = await axios.get(SERVICE.UNIT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let result = res_unit?.data?.units.filter((d) => d.branch === e);
            const unitall = result.map((d) => ({
                ...d,
                label: d.name,
                value: d.name,
            }));
            setUnitsEdit(unitall);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    const fetchFloorEdit = async (e) => {
        try {
            let res_floor = await axios.get(SERVICE.FLOOR, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let result = res_floor.data.floors.filter((d) => d.branch === e);
            const floorall = result.map((d) => ({
                ...d,
                label: d.name,
                value: d.name,
            }));
            setFloorEdit(floorall);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };


    //editing the single data...
    const sendEditRequest = async () => {
        try {
            let res = await axios.put(
                `${SERVICE.STOCKPURCHASE_SINGLE}/${stockmanagemasteredit?._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(stockmanagemasteredit.company),
                    branch: String(stockmanagemasteredit.branch),
                    unit: String(stockmanagemasteredit.unit),
                    floor: String(stockmanagemasteredit.floor),
                    location: String(stockmanagemasteredit.location),
                    area: String(stockmanagemasteredit.area),
                    workstation: String(
                        stockmanagemasteredit.workcheck
                            ? stockmanagemasteredit.workstation
                            : ""
                    ),
                    // workcheck: String(stockmanagemasteredit.workcheck),
                    assettype: "",
                    asset: "",
                    material: "",
                    component: "",
                    // subcomponent: todosEdit ? [...todosEdit] : [],
                    warranty: String(
                        stockmanagemasteredit.warranty === undefined
                            ? ""
                            : stockmanagemasteredit.warranty
                    ),
                    estimation: String(
                        stockmanagemasteredit.estimation === undefined
                            ? ""
                            : stockmanagemasteredit.estimation
                    ),
                    estimationtime: String(
                        stockmanagemasteredit.estimationtime === undefined
                            ? ""
                            : stockmanagemasteredit.estimationtime
                    ),
                    warrantycalculation: String(
                        stockmanagemasteredit.warrantycalculation === undefined
                            ? ""
                            : stockmanagemasteredit.warrantycalculation
                    ),
                    purchasedate: selectedPurchaseDateEdit,
                    // producthead: String(selectedProductheadedit),
                    vendorgroup: String(vendorGroup),
                    vendor: String(vendorNew),
                    gstno: String(
                        vendorgetid.gstnumber === undefined ? "" : vendorgetid.gstnumber
                    ),
                    vendorid: String(vendorgetid._id),
                    billno: Number(stockmanagemasteredit.billno),
                    productdetails: String(stockmanagemasteredit.productdetails),
                    warrantydetails: String(stockmanagemasteredit.warrantydetails),
                    uom:
                        stockmanagemasteredit.uom === "Please Select UOM"
                            ? ""
                            : String(stockmanagemasteredit.uom),
                    quantity: Number(stockmanagemasteredit.quantity),
                    rate: Number(stockmanagemasteredit.rate),
                    billdate: String(stockmanagemasteredit.billdate),
                    files: [...refImageedit],
                    warrantyfiles: refImagewarrantyedit,

                    requestmode: String(stockmanagemasteredit.requestmode),
                    stockcategory:
                        stockmanagemasteredit.stockcategory ===
                            "Please Select Stock Category"
                            ? ""
                            : String(stockmanagemasteredit.stockcategory),
                    stocksubcategory:
                        stockmanagemasteredit.stocksubcategory ===
                            "Please Select Stock Sub Category"
                            ? ""
                            : String(stockmanagemasteredit.stocksubcategory),
                    stockmaterialarray: stockArray,
                    updatedby: [
                        ...updateby,
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                }
            );
            await fetchStock();
            setBtnSubmit(false);
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            handleCloseModEdit();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    // let maintenanceid = ;
    const [stockmanageedit, setStockmanageedit] = useState([]);
    const fetchStockedit = async (e) => {
        try {
            let res_project = await axios.get(SERVICE.STOCKPURCHASE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setStockmanageedit(
                res_project?.data?.stock.filter(
                    (item) => item._id !== e && item.requestmode !== "Asset Material"
                )
            );
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    // useEffect(() => {

    //     fetchStockedit();
    // }, [isEditOpen, stockmanagemasteredit]);
    const [stockmanagemasteredit, setStockmanagemasteredit] = useState({
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        floor: "Please Select Floor",
        area: "Please Select Area",
        location: "Please Select Location",
        workstation: "Please Select Workstation",
        producthead: "",
        vendorname: "Please Select Vendor",
        material: "Please Select Material",
        component: "Please Select Component",
        gstno: "",
        billno: "",
        productname: "",
        productdetails: "",
        warrantydetails: "",
        uom: "Please Select UOM",
        quantity: "",
        rate: "",
        billdate: "",
        files: "",
        warrantyfiles: "",

        warranty: "",
        warrantycalculation: "",
        estimation: "",
        estimationtime: "",
        purchasedate: "",

        requestmode: "Please Select Request Mode",
        stockcategory: "Please Select Stock Category",
        stocksubcategory: "Please Select Stock Sub Category",
        uomnew: "",
        quantitynew: "",
        materialnew: "Please Select Material",
        productdetailsnew: "",
    });
    const renderFilePreview = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };

    useEffect(() => {
        calculateExpiryDateEdit();
    }, [
        stockmanagemasteredit.estimationtime,
        stockmanagemasteredit.estimation,
        stockmanagemasteredit.purchasedate,
    ]);
    //image


    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Stock Purchase List.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

    const handleClickOpenalert = () => {
        if (selectedRows.length === 0) {
            setIsDeleteOpenalert(true);
        } else {
            setIsDeleteOpencheckbox(true);
        }
    };
    const handleCloseModalert = () => {
        setIsDeleteOpenalert(false);
    };

    //Delete model

    const handleClickOpencheckbox = () => {
        setIsDeleteOpencheckbox(true);
    };
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
    };
    const handleViewOpen = () => {
        setOpenView(true);
    };
    const handlViewClose = () => {
        setOpenView(false);
    };

    const handleOpenManageColumns = (event) => {
        setAnchorEl(event.currentTarget);
        setManageColumnsOpen(true);
    };
    const handleCloseManageColumns = () => {
        setManageColumnsOpen(false);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;
    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };
    //delete model
    const handleClickOpen = () => {
        setOpenDelete(true);
    };
    const handleCloseDelete = () => {
        setOpenDelete(false);
    };
    const handleCloseinfo = () => {
        setOpeninfo(false);
    };

    //get all project.
    // const fetchStock = async () => {
    //   setPageName(!pageName)

    //   setLoading(true)

    //   try {
    //     // let res_project = await axios.get(SERVICE.STOCKPURCHASE, {

    //     let res_project = await axios.post(SERVICE.STOCK_ACCESS, {
    //       headers: {
    //         Authorization: `Bearer ${auth.APIToken}`,
    //       },
    //       assignbranch: accessbranch,

    //     });


    //     let filteredData = res_project?.data?.stock
    //       .filter((data) => {
    //         return (
    //           data.requestmode === "Stock Material" || data.status === "Transfer"
    //         );
    //       });
    //     console.log(filteredData, "filteredData")
    //     let res_project_1 = await axios.get(SERVICE.ALL_VOMMASTERNAME, {
    //       headers: {
    //         Authorization: `Bearer ${auth.APIToken}`,
    //       },
    //     });

    //     let codeValues = res_project_1?.data?.vommaster.map((data) => ({
    //       name: data.name,
    //       code: data.code,
    //     }));
    //     // setuomcodes(codeValues);

    //     let setData = filteredData.map((item) => {
    //       // Find the corresponding item in codeValues array
    //       const matchingItem = codeValues.find(
    //         (item1) => item.uomnew === item1.name
    //       );

    //       // If matchingItem is found, return item with uomcode set to its code, otherwise set it to an empty string
    //       return matchingItem
    //         ? { ...item, uomcode: matchingItem.code }
    //         : { ...item, uomcode: "" };
    //     });
    //     console.log(setData, "setData")
    //     setStockmanage(setData);
    //     setLoading(false)
    //   } catch (err) {
    //     console.log(err, "erororor")
    //     setLoading(false)
    //     handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    //   }

    // }


    //get all project.
    const fetchStock = async () => {
        setPageName(!pageName)
        setLoading(true);
        const queryParams = {
            page: Number(page),
            pageSize: Number(pageSize),
            assignbranch: accessbranch,
        };

        const allFilters = [
            ...additionalFilters,
            { column: selectedColumn, condition: selectedCondition, value: filterValue }
        ];
        // Only include advanced filters if they exist, otherwise just use regular searchQuery
        if (allFilters.length > 0 && selectedColumn !== "") {
            queryParams.allFilters = allFilters
            queryParams.logicOperator = logicOperator;
        } else if (searchQuery) {
            queryParams.searchQuery = searchQuery;
        }
        try {
            // let res_project = await axios.get(SERVICE.STOCKPURCHASE, {
            let res_employee = await axios.post(SERVICE.STOCK_ACCESS_PAGINATION, queryParams, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            // let filteredData = res_project?.data?.stock
            //   .filter((data) => {
            //     return data.requestmode === "Asset Material";
            //   });
            const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []

            let res_project_1 = await axios.get(SERVICE.ALL_VOMMASTERNAME, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let codeValues = res_project_1?.data?.vommaster.map((data) => ({
                name: data.name,
                code: data.code,
            }));
            // setuomcodes(codeValues);

            let setData = ans.map((item) => {
                // Find the corresponding item in codeValues array
                const matchingItem = codeValues.find(
                    (item1) => item.uom === item1.name
                );

                // If matchingItem is found, return item with uomcode set to its code, otherwise set it to an empty string
                return matchingItem
                    ? { ...item, uomcode: matchingItem.code }
                    : { ...item, uomcode: "" };
            });



            const itemsWithSerialNumber = setData?.map((item, index) => {
                let quantityNew = item.stockmaterialarray.map((data, newindex) => {
                    return ` ${data.quantitynew}`;
                });

                let materialNew = item.stockmaterialarray.map((data, newindex) => {
                    return ` ${data.materialnew}`;
                });

                let productdetailsNew = item.stockmaterialarray.map((data, newindex) => {
                    return ` ${data.productdetailsnew}`;
                });

                let quantityAndUom = item.stockmaterialarray.map((data, newindex) => {
                    return ` ${data.quantitynew}#${data.uomcodenew}`;
                });
                return {
                    id: item._id,
                    serialNumber: (page - 1) * pageSize + index + 1,
                    company: item.company,
                    branch: item.branch,
                    unit: item.unit,
                    floor: item.floor,
                    area: item.area,
                    location: item.location,
                    requestmode: item.requestmode,
                    stockcategory: item.stockcategory,
                    stocksubcategory: item.stocksubcategory,

                    uomnew: quantityAndUom.join(","),
                    quantitynew: quantityNew.join(","),
                    materialnew: materialNew.join(",").toString(),
                    productdetailsnew:
                        item.stockmaterialarray.length > 0 ? productdetailsNew.join(",") : "",

                    gstno: item.gstno,
                    billno: item.billno,
                    warrantydetails: item.warrantydetails,
                    warranty: item.warranty,
                    purchasedate:
                        item.purchasedate != ""
                            ? moment(item.purchasedate).format("DD/MM/YYYY")
                            : "",
                    billdate: moment(item.billdate).format("DD/MM/YYYY"),
                    rate: item.rate,
                    vendor: item.vendor,
                    vendorgroup: item.vendorgroup,
                };
            });
            setStockmanage(itemsWithSerialNumber);


            setOverallFilterdata(res_employee?.data?.totalProjectsData?.length > 0 ?
                res_employee?.data?.totalProjectsData?.map((item, index) => {

                    let quantityNew = item.stockmaterialarray.map((data, newindex) => {
                        return ` ${data.quantitynew}`;
                    });

                    let materialNew = item.stockmaterialarray.map((data, newindex) => {
                        return ` ${data.materialnew}`;
                    });

                    let productdetailsNew = item.stockmaterialarray.map((data, newindex) => {
                        return ` ${data.productdetailsnew}`;
                    });

                    let quantityAndUom = item.stockmaterialarray.map((data, newindex) => {
                        return ` ${data.quantitynew}#${data.uomcodenew}`;
                    });
                    return {
                        ...item,
                        serialNumber: (page - 1) * pageSize + index + 1,
                        id: item._id,
                        company: item.company,
                        branch: item.branch,
                        unit: item.unit,
                        floor: item.floor,
                        area: item.area,
                        location: item.location,
                        requestmode: item.requestmode,
                        stockcategory: item.stockcategory,
                        stocksubcategory: item.stocksubcategory,

                        uomnew: quantityAndUom.join(","),
                        quantitynew: quantityNew.join(","),
                        materialnew: materialNew.join(",").toString(),
                        productdetailsnew:
                            item.stockmaterialarray.length > 0 ? productdetailsNew.join(",") : "",

                        gstno: item.gstno,
                        billno: item.billno,
                        warrantydetails: item.warrantydetails,
                        warranty: item.warranty,
                        purchasedate:
                            item.purchasedate != ""
                                ? moment(item.purchasedate).format("DD/MM/YYYY")
                                : "",
                        billdate: moment(item.billdate).format("DD/MM/YYYY"),
                        rate: item.rate,
                        vendor: item.vendor,
                        vendorgroup: item.vendorgroup,

                    }
                }

                ) : []
            );



            setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
            setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
            setPageSize((data) => { return ans?.length > 0 ? data : 10 });
            setPage((data) => { return ans?.length > 0 ? data : 1 });


            setLoading(false);

        } catch (err) {
            console.log(err, "errorororo")
            setLoading(false);

            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    useEffect(() => {
        fetchStock();
    }, [page, pageSize, searchQuery]);


    // Error Popup model
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
        setBtnSubmit(false);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };
    // info model
    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };

    //Project updateby edit page...
    let updateby = stockmanagemasteredit.updatedby;
    let addedby = stockmanagemasteredit.addedby;
    let snos = 1;
    // this is the etimation concadination value
    // const modifiedData = stockmanages?.map((person) => ({
    //     ...person,
    //     sino: snos++,
    // }));
    const getRowClassName = (params) => {
        if (selectedRows.includes(params.data.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };
    const columns = [
        { title: "SNO", field: "serialNumber" },
        { title: "Company", field: "company" },
        { title: "Subcategoryname", field: "branch" },
        { title: "Unit", field: "unit" },
        { title: "Floor", field: "floor" },
        { title: "Area", field: "area" },
        { title: "Location", field: "location" },
        { title: "Request Mode For", field: "requestmode" },
        { title: "Stock Category", field: "stockcategory" },
        { title: "Stock Sub Category", field: "stocksubcategory" },

        { title: "Quantity", field: "quantitynew" },
        { title: "Quantity & UOM", field: "uomnew" },
        { title: "Material", field: "materialnew" },
        { title: "Product Details", field: "productdetailsnew" },

        { title: "GST No", field: "gstno" },
        { title: "Bill No", field: "billno" },
        { title: "Warranty Details", field: "warrantydetails" },
        { title: "Warranty", field: "warranty" },
        { title: "Purchase Date", field: "purchasedate" },
        { title: "Bill Date", field: "billdate" },
        { title: "Rate", field: "rate" },
        { title: "Vendor Group", field: "vendorgroup" },
        { title: "Vendor Name", field: "vendor" },
    ];
    // PDF
    const downloadPdf = (isfilter) => {
        const doc = new jsPDF({ orientation: "landscape" });

        // Initialize serial number counter
        let serialNumberCounter = 1;

        // Modify row data to include serial number
        const dataWithSerial =
            isfilter === "filtered"
                ? rowDataTable.map((row) => ({
                    ...row,
                    serialNumber: serialNumberCounter++,
                }))
                : stockmanages.map((row) => {
                    let purchasedate = row?.purchasedate
                        ? row.purchasedate.split("-")
                        : ["", "", ""];
                    let year = purchasedate[0];
                    let month = purchasedate[1];
                    let date = purchasedate[2];
                    let [year1, month1, date1] = row.billdate.split("-");
                    return {
                        ...row,
                        serialNumber: serialNumberCounter++,
                        purchasedate:
                            purchasedate && date != "" && month != ""
                                ? `${date}/${month}/${year}`
                                : "",
                        billdate: `${date1}/${month1}/${year1}`,
                        quantitynew: row.stockmaterialarray.map(
                            (data) => ` ${data.quantitynew}`
                        ),
                        uomnew: row.stockmaterialarray.map(
                            (data) => ` ${data.quantitynew}#${data.uomcodenew}`
                        ),
                        materialnew: row.stockmaterialarray.map(
                            (data) => ` ${data.materialnew}`
                        ),
                        productdetailsnew: row.stockmaterialarray.map(
                            (data) => ` ${data.productdetailsnew}`
                        ),
                    };
                });

        // Generate PDF
        doc.autoTable({
            theme: "grid",
            styles: { fontSize: 5 },
            // columns: columnsWithSerial,
            columns: columns.map((col) => ({ ...col, dataKey: col.field })),
            body: dataWithSerial,
        });

        doc.save("Stock Purchase List.pdf");
    };

    // Excel
    const fileName = "Stock Purchase List";


    const fetchspecification = async (e) => {
        try {
            let res = await axios.get(SERVICE.ASSETWORKSTAION, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let result = res.data.assetworkstation.filter(
                (d) => d.workstation === e.value
            );

            const resultall = result.map((d) => ({
                ...d,
                label: d.categoryname,
                value: d.categoryname,
                // subcomponent: d.subcomponent
            }));

            setSpecification(resultall);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const delVendorcheckbox = async () => {
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.STOCKPURCHASE_SINGLE}/${item}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
            });

            // Wait for all delete requests to complete
            await Promise.all(deletePromises);

            handleCloseModcheckbox();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setSelectedRows([]);
            setSelectAllChecked(false);
            setPage(1);
            await fetchStock();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Stock Purchase",
        pageStyle: "print",
    });

    //serial no for listing items
    const addSerialNumber = (datas) => {
        // const itemsWithSerialNumber = datas?.map((item, index) => {
        //   let quantityNew = item.stockmaterialarray.map((data, newindex) => {
        //     return ` ${data.quantitynew}`;
        //   });

        //   let materialNew = item.stockmaterialarray.map((data, newindex) => {
        //     return ` ${data.materialnew}`;
        //   });

        //   let productdetailsNew = item.stockmaterialarray.map((data, newindex) => {
        //     return ` ${data.productdetailsnew}`;
        //   });

        //   let quantityAndUom = item.stockmaterialarray.map((data, newindex) => {
        //     return ` ${data.quantitynew}#${data.uomcodenew}`;
        //   });
        //   return {
        //     id: item._id,
        //     serialNumber: index + 1,
        //     company: item.company,
        //     branch: item.branch,
        //     unit: item.unit,
        //     floor: item.floor,
        //     area: item.area,
        //     location: item.location,
        //     requestmode: item.requestmode,
        //     stockcategory: item.stockcategory,
        //     stocksubcategory: item.stocksubcategory,

        //     uomnew: quantityAndUom.join(","),
        //     quantitynew: quantityNew.join(","),
        //     materialnew: materialNew.join(",").toString(),
        //     productdetailsnew:
        //       item.stockmaterialarray.length > 0 ? productdetailsNew.join(",") : "",

        //     gstno: item.gstno,
        //     billno: item.billno,
        //     warrantydetails: item.warrantydetails,
        //     warranty: item.warranty,
        //     purchasedate:
        //       item.purchasedate != ""
        //         ? moment(item.purchasedate).format("DD/MM/YYYY")
        //         : "",
        //     billdate: moment(item.billdate).format("DD/MM/YYYY"),
        //     rate: item.rate,
        //     vendor: item.vendor,
        //     vendorgroup: item.vendorgroup,
        //   };
        // });
        setItems(datas);
    };

    useEffect(() => {
        addSerialNumber(stockmanages);
    }, [stockmanages, vendorAuto]);

    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSelectedRows([]);
        setSelectAllChecked(false);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setSelectedRows([]);
        setSelectAllChecked(false);
        setPage(1);
    };

    //datatable....
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setFilterValue(event.target.value);
        setPage(1);
    };
    // Split the search query into individual terms
    const searchTerms = searchQuery.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });

    const filteredData = filteredDatas.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    // const totalPages = Math.ceil(filteredDatas.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(
        firstVisiblePage + visiblePages - 1,
        totalPages
    );

    const pageNumbers = [];

    const indexOfLastItem = page * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }


    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
        </div>
    );
    const columnDataTable = [
        {
            field: "checkbox",
            headerName: "Checkbox", // Default header name
            headerStyle: {
                fontWeight: "bold", // Apply the font-weight style to make the header text bold
                // Add any other CSS styles as needed
            },

            sortable: false, // Optionally, you can make this column not sortable
            width: 90,
            headerCheckboxSelection: true,
            checkboxSelection: true,
            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
            pinned: "left",
            lockPinned: true,
        },
        {
            field: "serialNumber",
            headerName: "S.No",
            flex: 0,
            width: 90,
            minHeight: "40px",
            hide: !columnVisibility.serialNumber,
            pinned: "left",
            lockPinned: true,
        },
        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 180,
            minHeight: "40px",
            hide: !columnVisibility.company,
            pinned: "left",
            lockPinned: true,
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 180,
            minHeight: "40px",
            hide: !columnVisibility.branch,
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 180,
            minHeight: "40px",
            hide: !columnVisibility.unit,
            pinned: "left",
            lockPinned: true,
        },
        {
            field: "floor",
            headerName: "Floor",
            flex: 0,
            width: 180,
            minHeight: "40px",
            hide: !columnVisibility.floor,
        },
        {
            field: "area",
            headerName: "Area",
            flex: 0,
            width: 180,
            minHeight: "40px",
            hide: !columnVisibility.area,
        },
        {
            field: "location",
            headerName: "Location",
            flex: 0,
            width: 180,
            minHeight: "40px",
            hide: !columnVisibility.location,
        },
        {
            field: "vendorgroup",
            headerName: "Vendor Group",
            flex: 0,
            width: 180,
            minHeight: "40px",
            hide: !columnVisibility.vendorgroup,
        },
        {
            field: "vendor",
            headerName: "Dealers Name",
            flex: 0,
            width: 180,
            minHeight: "40px",
            hide: !columnVisibility.vendor,
        },
        // {
        //     field: "vendorname",
        //     headerName: "Dealers Name",
        //     flex: 0,
        //     width: 180,
        //     minHeight: "40px",
        //     hide: !columnVisibility.vendorname,
        // },

        {
            field: "requestmode",
            headerName: "Request Mode",
            flex: 0,
            width: 180,
            minHeight: "40px",
            hide: !columnVisibility.requestmode,
        },

        {
            field: "gstno",
            headerName: "GST No",
            flex: 0,
            width: 180,
            minHeight: "40px",
            hide: !columnVisibility.gstno,
        },
        {
            field: "billno",
            headerName: "Bill No",
            flex: 0,
            width: 180,
            minHeight: "40px",
            hide: !columnVisibility.billno,
        },
        {
            field: "warranty",
            headerName: "Warranty",
            flex: 0,
            width: 180,
            minHeight: "40px",
            hide: !columnVisibility.warranty,
        },
        {
            field: "purchasedate",
            headerName: "Purchase Date",
            flex: 0,
            width: 180,
            minHeight: "40px",
            hide: !columnVisibility.purchasedate,
        },
        {
            field: "stockcategory",
            headerName: "Stockcategory",
            flex: 0,
            width: 180,
            minHeight: "40px",
            hide: !columnVisibility.stockcategory,
        },
        {
            field: "stocksubcategory",
            headerName: "Stocksubcategory",
            flex: 0,
            width: 180,
            minHeight: "40px",
            hide: !columnVisibility.stocksubcategory,
        },

        {
            field: "quantitynew",
            headerName: "Quantity",
            flex: 0,
            width: 180,
            minHeight: "40px",
            hide: !columnVisibility.quantitynew,
        },
        {
            field: "uomnew",
            headerName: "Quantity & UOM",
            flex: 0,
            width: 180,
            minHeight: "40px",
            hide: !columnVisibility.uomnew,
        },
        {
            field: "materialnew",
            headerName: "Material",
            flex: 0,
            width: 180,
            minHeight: "40px",
            hide: !columnVisibility.materialnew,
        },
        {
            field: "productdetailsnew",
            headerName: "Product Details",
            flex: 0,
            width: 180,
            minHeight: "40px",
            hide: !columnVisibility.productdetailsnew,
        },
        {
            field: "warrantydetails",
            headerName: "Warranty Details",
            flex: 0,
            width: 180,
            minHeight: "40px",
            hide: !columnVisibility.warrantydetails,
        },
        {
            field: "rate",
            headerName: "Rate",
            flex: 0,
            width: 180,
            minHeight: "40px",
            hide: !columnVisibility.rate,
        },
        {
            field: "billdate",
            headerName: "Bill Date",
            flex: 0,
            width: 180,
            minHeight: "40px",
            hide: !columnVisibility.billdate,
        },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 250,
            sortable: false,
            hide: !columnVisibility.actions,
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("estockpurchase") && (
                        <Button
                            sx={userStyle.buttonedit}
                            style={{ minWidth: "0px" }}
                            onClick={() => {
                                handleClickOpenEdit();
                                getCode(params.data.id);
                                fetchStockedit(params.data.id);
                            }}
                        >
                            <EditOutlinedIcon sx={buttonStyles.buttonedit} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("dstockpurchase") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                getinfoCode(params.data.id);
                                handleClickOpen();
                            }}
                        >
                            <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vstockpurchase") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={(e) => {
                                getviewCode(params.data.id);
                                handleViewOpen();
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("istockpurchase") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                handleClickOpeninfo();
                                getinfoCode(params.data.id);
                            }}
                        >
                            <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />
                        </Button>
                    )}
                </Grid>
            ),
        },
    ];

    const filteredSelectedColumn = columnDataTable.filter(data => data.field !== 'checkbox' && data.field !== "actions" && data.field !== "serialNumber");


    const rowDataTable = items.map((item, index) => {
        // let documentArray = item.document.length === 0 ? item.documentstext : item.document;

        return {
            id: item.id,
            serialNumber: item.serialNumber,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            floor: item.floor,
            area: item.area,
            location: item.location,
            requestmode: item.requestmode,
            stockcategory: item.stockcategory,
            stocksubcategory: item.stocksubcategory,

            uomnew: item.uomnew,
            quantitynew: item.quantitynew,
            materialnew: item.materialnew,
            productdetailsnew: item.productdetailsnew,

            gstno: item.gstno,
            billno: item.billno,
            warrantydetails: item.warrantydetails,
            warranty: item.warranty,
            purchasedate: item.purchasedate,
            billdate: item.billdate,
            rate: item.rate,
            vendor: item.vendor,
            vendorgroup: item.vendorgroup,
        };
    });
    const rowsWithCheckboxes = rowDataTable.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRows.includes(row.id),
    }));

    // Show All Columns functionality
    const handleShowAllColumns = () => {
        const updatedVisibility = { ...columnVisibility };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibility(updatedVisibility);
    };
    // Function to filter columns based on search query
    const filteredColumns = columnDataTable.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
    );
    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };
    // JSX for the "Manage Columns" popover content
    const manageColumnsContent = (
        <Box
            style={{
                padding: "10px",
                minWidth: "325px",
                "& .MuiDialogContent-root": { padding: "10px 0" },
            }}
        >
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton
                aria-label="close"
                onClick={handleCloseManageColumns}
                sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <Box sx={{ position: "relative", margin: "10px" }}>
                <TextField
                    label="Find column"
                    variant="standard"
                    fullWidth
                    value={searchQueryManage}
                    onChange={(e) => setSearchQueryManage(e.target.value)}
                    sx={{ marginBottom: 5, position: "absolute" }}
                />
            </Box>
            <br />
            <br />
            <DialogContent
                sx={{ minWidth: "auto", height: "200px", position: "relative" }}
            >
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumns.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText
                                sx={{ display: "flex" }}
                                primary={
                                    <Switch
                                        sx={{ marginTop: "-5px" }}
                                        size="small"
                                        checked={columnVisibility[column.field]}
                                        onChange={() => toggleColumnVisibility(column.field)}
                                    />
                                }
                                secondary={
                                    column.field === "checkbox" ? "Checkbox" : column.headerName
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item md={4}>
                        <Button
                            variant="text"
                            sx={{ textTransform: "none" }}
                            onClick={() => setColumnVisibility(initialColumnVisibility)}
                        >
                            Show All
                        </Button>
                    </Grid>
                    <Grid item md={4}></Grid>
                    <Grid item md={4}>
                        <Button
                            variant="text"
                            sx={{ textTransform: "none" }}
                            onClick={() => {
                                const newColumnVisibility = {};
                                columnDataTable.forEach((column) => {
                                    newColumnVisibility[column.field] = false; // Set hide property to true
                                });
                                setColumnVisibility(newColumnVisibility);
                            }}
                        >
                            {" "}
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    const [fileFormat, setFormat] = useState("");
    const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = fileFormat === "xl" ? ".xlsx" : ".csv";
    const exportToCSV = (csvData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    };

    const handleExportXL = (isfilter) => {
        if (isfilter === "filtered") {
            exportToCSV(
                rowDataTable?.map((item, index) => ({
                    "S.No": index + 1,
                    Company: item.company,
                    Branch: item.branch,
                    Unit: item.unit,
                    Floor: item.floor,
                    Area: item.area,
                    Location: item.location,
                    // "Workstation": item.workstation,
                    "Request Mode For": item.requestmode,
                    "Stock Category": item.stockcategory,
                    "Stock Subcategory": item.stocksubcategory,

                    Quantity: item.quantitynew,
                    "Quantity & UOM": item.uomnew,
                    Material: item.materialnew,
                    "Product Details": item.productdetailsnew,
                    "GST No": item.gstno,
                    "Bill No": item.billno,
                    "Warranty Details": item.warrantydetails,
                    Warranty: item.warranty,
                    "Purchased Date": item.purchasedate,
                    "Bill Date": item.billdate,
                    Rate: item.rate,
                    "Vendor Group": item.vendorgroup,
                    "Vendor Name": item.vendor,
                })),
                fileName
            );
        } else if (isfilter === "overall") {
            exportToCSV(
                stockmanages.map((item, index) => ({
                    "S.No": index + 1,
                    Company: item.company,
                    Branch: item.branch,
                    Unit: item.unit,
                    Floor: item.floor,
                    Area: item.area,
                    Location: item.location,

                    "Request Mode For": item.requestmode,
                    "Stock Category": item.stockcategory,
                    "Stock Subcategory": item.stocksubcategory,

                    Quantity: item.stockmaterialarray
                        .map((data) => ` ${data.quantitynew}`)
                        .join(","),

                    "Quantity & UOM": item.stockmaterialarray
                        .map((data) => ` ${data.quantitynew}#${data.uomcodenew}`)
                        .join(","),

                    Material: item.stockmaterialarray
                        .map((data) => ` ${data.materialnew}`)
                        .join(","),

                    "Product Details": item.stockmaterialarray
                        .map((data) => ` ${data.productdetailsnew}`)
                        .join(","),
                    "GST No": item.gstno,
                    "Bill No": item.billno,
                    "Warranty Details": item.warrantydetails,
                    Warranty: item.warranty,
                    "Purchased Date":
                        item.purchasedate != ""
                            ? moment(item.purchasedate).format("DD/MM/YYYY")
                            : "",
                    "Bill Date": moment(item.billdate).format("DD/MM/YYYY"),
                    Rate: item.rate,
                    "Vendor Group": item.vendorgroup,
                    "Vendor Name": item.vendor,
                })),
                fileName
            );
        }

        setIsFilterOpen(false);
    };


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

    // Show filtered combination in the search bar
    const getSearchDisplay = () => {
        if (advancedFilter && advancedFilter.length > 0) {
            return advancedFilter.map((filter, index) => {
                let showname = columnDataTable.find(col => col.field === filter.column)?.headerName;
                return `${showname} ${filter.condition} "${filter.value}"`;
            }).join(' ' + (advancedFilter.length > 1 ? advancedFilter[1].condition : '') + ' ');
        }
        return searchQuery;
    };

    // Disable the search input if the search is active
    const isSearchDisabled = isSearchActive || additionalFilters.length > 0;

    const handleResetSearch = async () => {
        setLoading(true);

        // Reset all filters and pagination state
        setAdvancedFilter(null);
        setAdditionalFilters([]);
        setSearchQuery("");
        setIsSearchActive(false);
        setSelectedColumn("");
        setSelectedCondition("Contains");
        setFilterValue("");
        setLogicOperator("AND");
        setFilteredChanges(null);

        const queryParams = {
            page: Number(page),
            pageSize: Number(pageSize),
            assignbranch: accessbranch,
        };

        const allFilters = [];
        // Only include advanced filters if they exist, otherwise just use regular searchQuery
        if (allFilters.length > 0 && selectedColumn !== "") {
            queryParams.allFilters = allFilters
            queryParams.logicOperator = logicOperator;
        } else if (searchQuery) {
            queryParams.searchQuery = searchQuery;  // Use searchQuery for regular search
        }

        setPageName(!pageName)

        try {
            // let res_project = await axios.get(SERVICE.STOCKPURCHASE, {
            let res_employee = await axios.post(SERVICE.STOCK_ACCESS_PAGINATION, queryParams, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            // let filteredData = res_project?.data?.stock
            //   .filter((data) => {
            //     return data.requestmode === "Asset Material";
            //   });
            const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []

            let res_project_1 = await axios.get(SERVICE.ALL_VOMMASTERNAME, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let codeValues = res_project_1?.data?.vommaster.map((data) => ({
                name: data.name,
                code: data.code,
            }));
            // setuomcodes(codeValues);

            let setData = ans.map((item) => {
                // Find the corresponding item in codeValues array
                const matchingItem = codeValues.find(
                    (item1) => item.uom === item1.name
                );

                // If matchingItem is found, return item with uomcode set to its code, otherwise set it to an empty string
                return matchingItem
                    ? { ...item, uomcode: matchingItem.code }
                    : { ...item, uomcode: "" };
            });



            const itemsWithSerialNumber = setData?.map((item, index) => {
                let quantityNew = item.stockmaterialarray.map((data, newindex) => {
                    return ` ${data.quantitynew}`;
                });

                let materialNew = item.stockmaterialarray.map((data, newindex) => {
                    return ` ${data.materialnew}`;
                });

                let productdetailsNew = item.stockmaterialarray.map((data, newindex) => {
                    return ` ${data.productdetailsnew}`;
                });

                let quantityAndUom = item.stockmaterialarray.map((data, newindex) => {
                    return ` ${data.quantitynew}#${data.uomcodenew}`;
                });
                return {
                    id: item._id,
                    serialNumber: (page - 1) * pageSize + index + 1,
                    company: item.company,
                    branch: item.branch,
                    unit: item.unit,
                    floor: item.floor,
                    area: item.area,
                    location: item.location,
                    requestmode: item.requestmode,
                    stockcategory: item.stockcategory,
                    stocksubcategory: item.stocksubcategory,

                    uomnew: quantityAndUom.join(","),
                    quantitynew: quantityNew.join(","),
                    materialnew: materialNew.join(",").toString(),
                    productdetailsnew:
                        item.stockmaterialarray.length > 0 ? productdetailsNew.join(",") : "",

                    gstno: item.gstno,
                    billno: item.billno,
                    warrantydetails: item.warrantydetails,
                    warranty: item.warranty,
                    purchasedate:
                        item.purchasedate != ""
                            ? moment(item.purchasedate).format("DD/MM/YYYY")
                            : "",
                    billdate: moment(item.billdate).format("DD/MM/YYYY"),
                    rate: item.rate,
                    vendor: item.vendor,
                    vendorgroup: item.vendorgroup,
                };
            });
            setStockmanage(itemsWithSerialNumber);


            setOverallFilterdata(res_employee?.data?.totalProjectsData?.length > 0 ?
                res_employee?.data?.totalProjectsData?.map((item, index) => {

                    let quantityNew = item.stockmaterialarray.map((data, newindex) => {
                        return ` ${data.quantitynew}`;
                    });

                    let materialNew = item.stockmaterialarray.map((data, newindex) => {
                        return ` ${data.materialnew}`;
                    });

                    let productdetailsNew = item.stockmaterialarray.map((data, newindex) => {
                        return ` ${data.productdetailsnew}`;
                    });

                    let quantityAndUom = item.stockmaterialarray.map((data, newindex) => {
                        return ` ${data.quantitynew}#${data.uomcodenew}`;
                    });
                    return {
                        ...item,
                        serialNumber: (page - 1) * pageSize + index + 1,
                        id: item._id,
                        company: item.company,
                        branch: item.branch,
                        unit: item.unit,
                        floor: item.floor,
                        area: item.area,
                        location: item.location,
                        requestmode: item.requestmode,
                        stockcategory: item.stockcategory,
                        stocksubcategory: item.stocksubcategory,

                        uomnew: quantityAndUom.join(","),
                        quantitynew: quantityNew.join(","),
                        materialnew: materialNew.join(",").toString(),
                        productdetailsnew:
                            item.stockmaterialarray.length > 0 ? productdetailsNew.join(",") : "",

                        gstno: item.gstno,
                        billno: item.billno,
                        warrantydetails: item.warrantydetails,
                        warranty: item.warranty,
                        purchasedate:
                            item.purchasedate != ""
                                ? moment(item.purchasedate).format("DD/MM/YYYY")
                                : "",
                        billdate: moment(item.billdate).format("DD/MM/YYYY"),
                        rate: item.rate,
                        vendor: item.vendor,
                        vendorgroup: item.vendorgroup,

                    }
                }

                ) : []
            );



            setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
            setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
            setPageSize((data) => { return ans?.length > 0 ? data : 10 });
            setPage((data) => { return ans?.length > 0 ? data : 1 });


            setLoading(false);

        }
        catch (err) { setLoading(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    return (
        <Box>
            {/* <Headtitle title={"REFERENCE DOCUMENTS LIST"} /> */}
            {/* ****** Header Content ****** */}
            {/* <Typography sx={userStyle.HeaderText}>Reference Documents List</Typography> */}

            <>
                {isUserRoleCompare?.includes("lstockpurchase") && (
                    <>
                        <Box sx={userStyle.container}>
                            {/* ******************************************************EXPORT Buttons****************************************************** */}
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>
                                        Stock Purchase List
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid
                                item
                                md={8}
                                xs={12}
                                sm={12}
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Grid>
                                    {isUserRoleCompare?.includes("excelstockpurchase") && (
                                        <>
                                            <Button
                                                onClick={(e) => {
                                                    setIsFilterOpen(true);
                                                    fetchStock();
                                                    setFormat("xl");
                                                }}
                                                sx={userStyle.buttongrp}
                                            >
                                                <FaFileExcel />
                                                &ensp;Export to Excel&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvstockpurchase") && (
                                        <>
                                            <Button
                                                onClick={(e) => {
                                                    setIsFilterOpen(true);
                                                    fetchStock();
                                                    setFormat("csv");
                                                }}
                                                sx={userStyle.buttongrp}
                                            >
                                                <FaFileCsv />
                                                &ensp;Export to CSV&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printstockpurchase") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfstockpurchase") && (
                                        <>
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true);
                                                    fetchStock();
                                                }}
                                            >
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagestockpurchase") && (
                                        <Button
                                            sx={userStyle.buttongrp}
                                            onClick={handleCaptureImage}
                                        >
                                            {" "}
                                            <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                                            &ensp;Image&ensp;{" "}
                                        </Button>
                                    )}
                                </Grid>
                            </Grid>
                            <br />
                            {/* ****** Table Grid Container ****** */}
                            <Grid style={userStyle.dataTablestyle}>
                                <Box>
                                    <label>Show entries:</label>
                                    <Select
                                        id="pageSizeSelect"
                                        value={pageSize}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 180,
                                                    width: 80,
                                                },
                                            },
                                        }}
                                        onChange={handlePageSizeChange}
                                        sx={{ width: "77px" }}
                                    >
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        <MenuItem value={totalProjects}>All</MenuItem>
                                    </Select>
                                </Box>
                                <Box>
                                    <Grid item md={2} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <OutlinedInput size="small"
                                                id="outlined-adornment-weight"
                                                startAdornment={
                                                    <InputAdornment position="start">
                                                        <FaSearch />
                                                    </InputAdornment>
                                                }
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        {advancedFilter && (
                                                            <IconButton onClick={handleResetSearch}>
                                                                <MdClose />
                                                            </IconButton>
                                                        )}
                                                        <Tooltip title="Show search options">
                                                            <span>
                                                                <IoMdOptions style={{ cursor: 'pointer', }} onClick={handleClickSearch} />
                                                            </span>
                                                        </Tooltip>
                                                    </InputAdornment>}
                                                aria-describedby="outlined-weight-helper-text"
                                                inputProps={{ 'aria-label': 'weight', }}
                                                type="text"
                                                value={getSearchDisplay()}
                                                onChange={handleSearchChange}
                                                placeholder="Type to search..."
                                                disabled={!!advancedFilter}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Box>
                            </Grid>
                            <br />
                            <br />
                            <Button
                                sx={userStyle.buttongrp}
                                onClick={() => {
                                    handleShowAllColumns();
                                    setColumnVisibility(initialColumnVisibility);
                                }}
                            >
                                Show All Columns
                            </Button>
                            &emsp;
                            <Button
                                sx={userStyle.buttongrp}
                                onClick={handleOpenManageColumns}
                            >
                                Manage Columns
                            </Button>
                            &emsp;
                            {isUserRoleCompare?.includes("bdstockpurchase") && (
                                <Button
                                    variant="contained"
                                    sx={buttonStyles.buttonbulkdelete}
                                    onClick={handleClickOpenalert}
                                >
                                    Bulk Delete
                                </Button>
                            )}
                            {/* ****** Table start ****** */}
                            {loading ? (
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
                                    <Box style={{ width: "100%", overflowY: "hidden" }}>
                                        <>
                                            <AggridTableForPaginationTable
                                                rowDataTable={rowDataTable}
                                                columnDataTable={columnDataTable}
                                                columnVisibility={columnVisibility}
                                                page={page}
                                                setPage={setPage}
                                                pageSize={pageSize}
                                                totalPages={totalPages}
                                                setColumnVisibility={setColumnVisibility}
                                                selectedRows={selectedRows}
                                                setSelectedRows={setSelectedRows}
                                                gridRefTable={gridRefTable}
                                                totalDatas={totalProjects}
                                                setFilteredRowData={setFilteredRowData}
                                                filteredRowData={filteredRowData}
                                                gridRefTableImg={gridRefTableImg}
                                                itemsList={overallFilterdata}
                                            />
                                        </>
                                    </Box>
                                </>
                            )}
                            {/* ****** Table End ****** */}
                        </Box>
                        <TableContainer component={Paper} sx={userStyle.printcls}>
                            <Table
                                aria-label="customized table"
                                id="jobopening"
                                ref={componentRef}
                            >
                                <TableHead sx={{ fontWeight: "600" }}>
                                    <StyledTableRow>
                                        <StyledTableCell>SNo</StyledTableCell>
                                        <StyledTableCell>Company</StyledTableCell>
                                        <StyledTableCell>Branch</StyledTableCell>
                                        <StyledTableCell>Unit</StyledTableCell>
                                        <StyledTableCell>Floor</StyledTableCell>
                                        <StyledTableCell>Area</StyledTableCell>
                                        <StyledTableCell>Location</StyledTableCell>
                                        {/* <StyledTableCell>Workstation</StyledTableCell> */}
                                        <StyledTableCell>Request Mode</StyledTableCell>
                                        <StyledTableCell>Stock Category</StyledTableCell>
                                        <StyledTableCell>Stock Subcategory</StyledTableCell>

                                        <StyledTableCell>Quantity</StyledTableCell>
                                        <StyledTableCell>UOM & Qunatity</StyledTableCell>
                                        <StyledTableCell>Material</StyledTableCell>
                                        <StyledTableCell>Product Details</StyledTableCell>

                                        <StyledTableCell>GST No</StyledTableCell>
                                        <StyledTableCell>Bill No</StyledTableCell>
                                        <StyledTableCell>Warranty Details</StyledTableCell>
                                        <StyledTableCell>Warranty</StyledTableCell>
                                        <StyledTableCell>Purchased Date</StyledTableCell>
                                        <StyledTableCell>Bill Date</StyledTableCell>
                                        <StyledTableCell>Rate</StyledTableCell>
                                        <StyledTableCell>Vendor Group</StyledTableCell>
                                        <StyledTableCell>Vendor Name</StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                    {rowDataTable?.length > 0 ? (
                                        rowDataTable?.map((row, index) => (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell>{row.serialNumber}</StyledTableCell>
                                                <StyledTableCell>{row.company}</StyledTableCell>
                                                <StyledTableCell>{row.branch}</StyledTableCell>
                                                <StyledTableCell>{row.unit}</StyledTableCell>
                                                <StyledTableCell>{row.floor}</StyledTableCell>
                                                <StyledTableCell>{row.area}</StyledTableCell>
                                                <StyledTableCell>{row.location}</StyledTableCell>
                                                {/* <StyledTableCell>{row.workstation}</StyledTableCell> */}
                                                <StyledTableCell>{row.requestmode}</StyledTableCell>
                                                <StyledTableCell>{row.stockcategory}</StyledTableCell>
                                                <StyledTableCell>
                                                    {row.stocksubcategory}
                                                </StyledTableCell>

                                                <StyledTableCell>{row.quantitynew}</StyledTableCell>
                                                <StyledTableCell>{row.uomnew}</StyledTableCell>
                                                <StyledTableCell>{row.materialnew}</StyledTableCell>
                                                <StyledTableCell>
                                                    {row.productdetailsnew}
                                                </StyledTableCell>

                                                <StyledTableCell>{row.gstno}</StyledTableCell>
                                                <StyledTableCell>{row.billno}</StyledTableCell>
                                                <StyledTableCell>
                                                    {row.warrantydetails}
                                                </StyledTableCell>
                                                <StyledTableCell>{row.warranty}</StyledTableCell>
                                                <StyledTableCell>{row.purchasedate}</StyledTableCell>
                                                <StyledTableCell>{row.billdate}</StyledTableCell>
                                                <StyledTableCell>{row.rate}</StyledTableCell>
                                                <StyledTableCell>{row.vendorgroup}</StyledTableCell>
                                                <StyledTableCell>{row.vendor}</StyledTableCell>
                                                {/* <StyledTableCell>{row.subcategoryname}</StyledTableCell> */}
                                            </StyledTableRow>
                                        ))
                                    ) : (
                                        <StyledTableRow>
                                            {" "}
                                            <StyledTableCell colSpan={7} align="center">
                                                No Data Available
                                            </StyledTableCell>{" "}
                                        </StyledTableRow>
                                    )}
                                    <StyledTableRow></StyledTableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Popover
                            id={id}
                            open={isManageColumnsOpen}
                            anchorEl={anchorEl}
                            onClose={handleCloseManageColumns}
                            anchorOrigin={{ vertical: "bottom", horizontal: "left", }}
                            transformOrigin={{ vertical: 'center', horizontal: 'right', }}
                        >
                            {manageColumnsContent}
                        </Popover>
                        <Popover
                            id={idSearch}
                            open={openSearch}
                            anchorEl={anchorElSearch}
                            onClose={handleCloseSearch}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
                        >
                            <Box style={{ padding: "10px", maxWidth: '450px' }}>
                                <Typography variant="h6">Advance Search</Typography>
                                <IconButton
                                    aria-label="close"
                                    onClick={handleCloseSearch}
                                    sx={{
                                        position: "absolute",
                                        right: 8,
                                        top: 8,
                                        color: (theme) => theme.palette.grey[500],
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                                <DialogContent sx={{ width: "100%" }}>
                                    <Box sx={{
                                        width: '350px',
                                        maxHeight: '400px',
                                        overflow: 'hidden',
                                        position: 'relative'
                                    }}>
                                        <Box sx={{
                                            maxHeight: '300px',
                                            overflowY: 'auto',
                                            // paddingRight: '5px'
                                        }}>
                                            <Grid container spacing={1}>
                                                <Grid item md={12} sm={12} xs={12}>
                                                    <Typography>Columns</Typography>
                                                    <Select fullWidth size="small"
                                                        MenuProps={{
                                                            PaperProps: {
                                                                style: {
                                                                    maxHeight: 200,
                                                                    width: "auto",
                                                                },
                                                            },
                                                        }}
                                                        style={{ minWidth: 150 }}
                                                        value={selectedColumn}
                                                        onChange={(e) => setSelectedColumn(e.target.value)}
                                                        displayEmpty
                                                    >
                                                        <MenuItem value="" disabled>Select Column</MenuItem>
                                                        {filteredSelectedColumn.map((col) => (
                                                            <MenuItem key={col.field} value={col.field}>
                                                                {col.headerName}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </Grid>
                                                <Grid item md={12} sm={12} xs={12}>
                                                    <Typography>Operator</Typography>
                                                    <Select fullWidth size="small"
                                                        MenuProps={{
                                                            PaperProps: {
                                                                style: {
                                                                    maxHeight: 200,
                                                                    width: "auto",
                                                                },
                                                            },
                                                        }}
                                                        style={{ minWidth: 150 }}
                                                        value={selectedCondition}
                                                        onChange={(e) => setSelectedCondition(e.target.value)}
                                                        disabled={!selectedColumn}
                                                    >
                                                        {conditions.map((condition) => (
                                                            <MenuItem key={condition} value={condition}>
                                                                {condition}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </Grid>
                                                <Grid item md={12} sm={12} xs={12}>
                                                    <Typography>Value</Typography>
                                                    <TextField fullWidth size="small"
                                                        value={["Blank", "Not Blank"].includes(selectedCondition) ? "" : filterValue}
                                                        onChange={(e) => setFilterValue(e.target.value)}
                                                        disabled={["Blank", "Not Blank"].includes(selectedCondition)}
                                                        placeholder={["Blank", "Not Blank"].includes(selectedCondition) ? "Disabled" : "Enter value"}
                                                        sx={{
                                                            '& .MuiOutlinedInput-root.Mui-disabled': {
                                                                backgroundColor: 'rgb(0 0 0 / 26%)',
                                                            },
                                                            '& .MuiOutlinedInput-input.Mui-disabled': {
                                                                cursor: 'not-allowed',
                                                            },
                                                        }}
                                                    />
                                                </Grid>
                                                {additionalFilters.length > 0 && (
                                                    <>
                                                        <Grid item md={12} sm={12} xs={12}>
                                                            <RadioGroup
                                                                row
                                                                value={logicOperator}
                                                                onChange={(e) => setLogicOperator(e.target.value)}
                                                            >
                                                                <FormControlLabel value="AND" control={<Radio />} label="AND" />
                                                                <FormControlLabel value="OR" control={<Radio />} label="OR" />
                                                            </RadioGroup>
                                                        </Grid>
                                                    </>
                                                )}
                                                {additionalFilters.length === 0 && (
                                                    <Grid item md={4} sm={12} xs={12} >
                                                        <Button variant="contained" onClick={handleAddFilter} sx={{ textTransform: "capitalize" }} disabled={["Blank", "Not Blank"].includes(selectedCondition) ? false : !filterValue || selectedColumn.length === 0}>
                                                            Add Filter
                                                        </Button>
                                                    </Grid>
                                                )}

                                                <Grid item md={2} sm={12} xs={12}>
                                                    <Button variant="contained" onClick={() => {
                                                        fetchStock();
                                                        setIsSearchActive(true);
                                                        setAdvancedFilter([
                                                            ...additionalFilters,
                                                            { column: selectedColumn, condition: selectedCondition, value: filterValue }
                                                        ])
                                                    }} sx={{ textTransform: "capitalize" }} disabled={["Blank", "Not Blank"].includes(selectedCondition) ? false : !filterValue || selectedColumn.length === 0}>
                                                        Search
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Box>
                                </DialogContent>
                            </Box>
                        </Popover>

                    </>
                )}
            </>

            {/* this is info view details */}
            <Dialog
                open={openInfo}
                onClose={handleCloseinfo}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <Box sx={{ width: "550px", padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>
                            Stock Purchase Info
                        </Typography>
                        <br />
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">addedby</Typography>
                                    <br />
                                    <Table>
                                        <TableHead>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                                {"SNO"}.
                                            </StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                                {" "}
                                                {"UserName"}
                                            </StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                                {" "}
                                                {"Date"}
                                            </StyledTableCell>
                                        </TableHead>
                                        <TableBody>
                                            {addedby?.map((item, i) => (
                                                <StyledTableRow>
                                                    <StyledTableCell
                                                        sx={{ padding: "5px 10px !important" }}
                                                    >
                                                        {i + 1}.
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                        sx={{ padding: "5px 10px !important" }}
                                                    >
                                                        {" "}
                                                        {item.name}
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                        sx={{ padding: "5px 10px !important" }}
                                                    >
                                                        {" "}
                                                        {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </FormControl>
                            </Grid>
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Updated by</Typography>
                                    <br />
                                    <Table>
                                        <TableHead>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                                {"SNO"}.
                                            </StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                                {" "}
                                                {"UserName"}
                                            </StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                                {" "}
                                                {"Date"}
                                            </StyledTableCell>
                                        </TableHead>
                                        <TableBody>
                                            {updateby?.map((item, i) => (
                                                <StyledTableRow>
                                                    <StyledTableCell
                                                        sx={{ padding: "5px 10px !important" }}
                                                    >
                                                        {i + 1}.
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                        sx={{ padding: "5px 10px !important" }}
                                                    >
                                                        {" "}
                                                        {item.name}
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                        sx={{ padding: "5px 10px !important" }}
                                                    >
                                                        {" "}
                                                        {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br />
                        <br />
                        <Grid container spacing={2}>
                            <Button variant="contained" onClick={handleCloseinfo}>
                                {" "}
                                Back{" "}
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>
            <Box>
                {/* Edit DIALOG */}
                <Dialog
                    open={isEditOpen}
                    onClose={handleCloseModEdit}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="lg"
                    fullWidth={true}
                    sx={{
                        overflow: "scroll",
                        "& .MuiPaper-root": {
                            overflow: "scroll",
                        },
                        marginTop: "95px"
                    }}
                >
                    <Box sx={{ padding: "20px 50px" }}>
                        <>
                            <Grid container spacing={2}>
                                <Typography sx={userStyle.HeaderText}>
                                    Edit Stock Purchase
                                </Typography>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Company<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            // options={companysEdit}
                                            options={accessbranch?.map(data => ({
                                                label: data.company,
                                                value: data.company,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            styles={colourStyles}
                                            value={{
                                                label: stockmanagemasteredit.company,
                                                value: stockmanagemasteredit.company,
                                            }}
                                            onChange={(e) => {
                                                setStockmanagemasteredit({
                                                    ...stockmanagemasteredit,
                                                    company: e.value,
                                                    branch: "Please Select Branch",
                                                    unit: "Please Select Unit",
                                                    floor: "Please Select Floor",
                                                    area: "Please Select Area",
                                                    location: "Please Select Location",
                                                });
                                                // setBranchsEdit([]);
                                                setUnitsEdit([])
                                                setAreasEdit([]);
                                                setFloorEdit([]);
                                                setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                                                fetchBranchDropdownsEdit(e.value);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Branch<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            // options={branchsEdit}
                                            options={accessbranch?.filter(
                                                (comp) =>
                                                    stockmanagemasteredit.company === comp.company
                                            )?.map(data => ({
                                                label: data.branch,
                                                value: data.branch,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            styles={colourStyles}
                                            value={{
                                                label: stockmanagemasteredit.branch,
                                                value: stockmanagemasteredit.branch,
                                            }}
                                            onChange={(e) => {
                                                setNewcheckBranch(e.value);
                                                setStockmanagemasteredit({
                                                    ...stockmanagemasteredit,
                                                    branch: e.value,
                                                    unit: "Please Select Unit",
                                                    floor: "Please Select Floor",
                                                    area: "Please Select Area",
                                                    location: "Please Select Location",
                                                });
                                                // setUnitsEdit([]);
                                                setAreasEdit([]);
                                                setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                                                setFloorEdit([]);
                                                fetchUnitsEdit(e.value);
                                                fetchFloorEdit(e.value);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Unit<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            // options={unitsEdit}
                                            options={accessbranch?.filter(
                                                (comp) =>
                                                    stockmanagemasteredit.company === comp.company && stockmanagemasteredit.branch === comp.branch
                                            )?.map(data => ({
                                                label: data.unit,
                                                value: data.unit,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            styles={colourStyles}
                                            value={{
                                                label: stockmanagemasteredit.unit,
                                                value: stockmanagemasteredit.unit,
                                            }}
                                            onChange={(e) => {
                                                setStockmanagemasteredit({
                                                    ...stockmanagemasteredit,
                                                    unit: e.value,
                                                    workstation: "",
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Floor<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={floorsEdit}
                                            styles={colourStyles}
                                            value={{
                                                label: stockmanagemasteredit.floor,
                                                value: stockmanagemasteredit.floor,
                                            }}
                                            onChange={(e) => {
                                                setStockmanagemasteredit({
                                                    ...stockmanagemasteredit,
                                                    floor: e.value,
                                                    workstation: "",
                                                    area: "Please Select Area",
                                                    location: "Please Select Location",
                                                });
                                                // setAreasEdit([]);
                                                setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                                                fetchAreaEdit(stockmanagemasteredit.branch, e.value);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Area<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={areasEdit}
                                            styles={colourStyles}
                                            value={{
                                                label: stockmanagemasteredit.area,
                                                value: stockmanagemasteredit.area,
                                            }}
                                            onChange={(e) => {
                                                setStockmanagemasteredit({
                                                    ...stockmanagemasteredit,
                                                    area: e.value,
                                                    workstation: "",
                                                    location: "Please Select Location",
                                                });
                                                setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                                                fetchAllLocationEdit(
                                                    stockmanagemasteredit.branch,
                                                    stockmanagemasteredit.floor,
                                                    e.value
                                                );
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Location<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={locationsEdit}
                                            styles={colourStyles}
                                            value={{
                                                label: stockmanagemasteredit.location,
                                                value: stockmanagemasteredit.location,
                                            }}
                                            onChange={(e) => {
                                                setStockmanagemasteredit({
                                                    ...stockmanagemasteredit,
                                                    location: e.value,
                                                    workstation: "",
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Warranty</Typography>
                                        <Selects
                                            options={[
                                                { label: "Yes", value: "Yes" },
                                                { label: "No", value: "No" },
                                            ]}
                                            styles={colourStyles}
                                            value={{
                                                label: stockmanagemasteredit.warranty,
                                                value: stockmanagemasteredit.warranty,
                                            }}
                                            onChange={(e) => {
                                                setStockmanagemasteredit({
                                                    ...stockmanagemasteredit,
                                                    warranty: e.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                {stockmanagemasteredit.warranty === "Yes" && (
                                    <>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <Grid container>
                                                <Grid item md={6} xs={6} sm={6}>
                                                    <Typography>Warranty Time</Typography>
                                                    <FormControl fullWidth size="small">
                                                        <OutlinedInput
                                                            id="component-outlined"
                                                            type="text"
                                                            placeholder="Enter Time"
                                                            value={stockmanagemasteredit.estimation}
                                                            onChange={(e) => handleChangephonenumberEdit(e)}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={6} xs={6} sm={6}>
                                                    <Typography>Estimation</Typography>
                                                    <Select
                                                        fullWidth
                                                        size="small"
                                                        labelId="demo-select-small"
                                                        id="demo-select-small"
                                                        value={stockmanagemasteredit.estimationtime}
                                                        // onChange={(e) => {
                                                        //   setAssetdetail({ ...assetdetail, estimationtime: e.target.value });
                                                        // }}
                                                        onChange={handleEstimationChangeEdit}
                                                    >
                                                        <MenuItem value="" disabled>
                                                            {" "}
                                                            Please Select
                                                        </MenuItem>
                                                        <MenuItem value="Days"> {"Days"} </MenuItem>
                                                        <MenuItem value="Month"> {"Month"} </MenuItem>
                                                        <MenuItem value="Year"> {"Year"} </MenuItem>
                                                    </Select>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </>
                                )}
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Purchase date </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="date"
                                            value={selectedPurchaseDateEdit}
                                            // onChange={(e) => {
                                            //   setAssetdetail({ ...assetdetail, purchasedate: e.target.value });
                                            // }}
                                            onChange={handlePurchaseDateChangeEdit}
                                        />
                                    </FormControl>
                                </Grid>
                                {stockmanagemasteredit.warranty === "Yes" && (
                                    <>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Expiry Date </Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    placeholder=""
                                                    value={stockmanagemasteredit.warrantycalculation}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </>
                                )}
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            {" "}
                                            Vendor Group Name<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={vendorGroupOpt}
                                            styles={colourStyles}
                                            value={{ label: vendorGroup, value: vendorGroup }}
                                            onChange={(e) => {
                                                handleChangeGroupName(e);
                                                setVendorGroup(e.value);
                                                setVendorNew("Choose Vendor");
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl size="small" fullWidth>
                                        <Typography>
                                            Vendor Name <b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={vendorOpt}
                                            styles={colourStyles}
                                            value={{ label: vendorNew, value: vendorNew }}
                                            onChange={(e) => {
                                                setVendorNew(e.value);

                                                vendorid(e._id);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            GST No <b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={vendorgetid?.gstnumber}
                                            readOnly
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Bill No <b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            sx={userStyle.input}
                                            value={stockmanagemasteredit.billno}
                                            onChange={(e) => {
                                                setStockmanagemasteredit({
                                                    ...stockmanagemasteredit,
                                                    billno: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Request Mode For</Typography>
                                        <OutlinedInput
                                            value={stockmanagemasteredit.requestmode}
                                            readOnly={true}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Stock Category<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={categoryOption}
                                            styles={colourStyles}
                                            value={{
                                                label: stockmanagemasteredit.stockcategory,
                                                value: stockmanagemasteredit.stockcategory,
                                            }}
                                            onChange={(e) => {
                                                setStockmanagemasteredit({
                                                    ...stockmanagemasteredit,
                                                    stockcategory: e.value,
                                                    stocksubcategory: "Please Select Stock Sub Category",
                                                    uomnew: "",
                                                    materialnew: "Please Select Material",
                                                });
                                                fetchSubcategoryBased(e);
                                                setMaterialoptNew([]);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Stock Sub-category<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={subcategoryOpt}
                                            styles={colourStyles}
                                            value={{
                                                label: stockmanagemasteredit.stocksubcategory,
                                                value: stockmanagemasteredit.stocksubcategory,
                                            }}
                                            onChange={(e) => {
                                                setStockmanagemasteredit({
                                                    ...stockmanagemasteredit,
                                                    stocksubcategory: e.value,
                                                    uomnew: "",
                                                    materialnew: "Please Select Material",
                                                });
                                                fetchMaterialNew(
                                                    e,
                                                    stockmanagemasteredit.stockcategory
                                                );
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Material<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={materialOptNew}
                                            styles={colourStyles}
                                            value={{
                                                label: stockmanagemasteredit.materialnew,
                                                value: stockmanagemasteredit.materialnew,
                                            }}
                                            onChange={(e) => {
                                                // fetchAsset();
                                                setStockmanagemasteredit({
                                                    ...stockmanagemasteredit,
                                                    materialnew: e.value,
                                                });
                                                fetchVomMaster(e);

                                                // fetchspecification(e);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            UOM<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <OutlinedInput
                                            readOnly={true}
                                            value={stockmanagemasteredit.uomnew}
                                            onChange={(e) => { }}
                                        />
                                        {/* <Selects
                                            options={uomOpt}
                                            styles={colourStyles}
                                            value={{
                                                label: stockmanagemasteredit.uomnew,
                                                value: stockmanagemasteredit.uomnew,
                                            }}
                                            onChange={(e) => {

                                                setStockmanagemasteredit({
                                                    ...stockmanagemasteredit,
                                                    uomnew: e.value, materialnew: "Please Select Material"
                                                });
                                                
                                            }}
                                        /> */}
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Quantity<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            sx={userStyle.input}
                                            placeholder="Please Enter Quantity"
                                            value={stockmanagemasteredit.quantitynew}
                                            onChange={(e) => {
                                                setStockmanagemasteredit({
                                                    ...stockmanagemasteredit,
                                                    quantitynew: e.target.value > 0 ? e.target.value : 0,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={3.5} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Product Details</Typography>
                                        <TextareaAutosize
                                            aria-label="minimum height"
                                            minRows={2}
                                            value={stockmanagemasteredit.productdetailsnew}
                                            placeholder="Please Enter Product Details"
                                            onChange={(e) => {
                                                setStockmanagemasteredit({
                                                    ...stockmanagemasteredit,
                                                    productdetailsnew: e.target.value,
                                                });
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
                                        }}
                                        color="success"
                                        onClick={() => {
                                            handleStockArray();
                                        }}
                                    >
                                        <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Warranty Details <b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={stockmanagemasteredit.warrantydetails}
                                            sx={userStyle.input}
                                            placeholder="Please Enter Warranty Details"
                                            onChange={(e) => {
                                                setStockmanagemasteredit({
                                                    ...stockmanagemasteredit,
                                                    warrantydetails: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Rate<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            sx={userStyle.input}
                                            placeholder="Please Enter Rate"
                                            value={stockmanagemasteredit.rate}
                                            onChange={(e) => {
                                                setStockmanagemasteredit({
                                                    ...stockmanagemasteredit,
                                                    rate: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Bill Date <b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <TextField
                                            size="small"
                                            type="date"
                                            value={stockmanagemasteredit.billdate}
                                            onChange={(e) => {
                                                setStockmanagemasteredit({
                                                    ...stockmanagemasteredit,
                                                    billdate: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <Typography>
                                        Bill <b style={{ color: "red" }}>*</b>{" "}
                                    </Typography>
                                    <Box sx={{ display: "flex", justifyContent: "left" }}>
                                        <Button
                                            variant="contained"
                                            onClick={handleClickUploadPopupOpenedit}
                                        >
                                            Upload
                                        </Button>
                                    </Box>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <Typography>Warranty Card </Typography>
                                    <Box sx={{ display: "flex", justifyContent: "left" }}>
                                        <Button
                                            variant="contained"
                                            onClick={handleClickUploadPopupOpenwarranty}
                                        >
                                            Upload
                                        </Button>
                                    </Box>
                                </Grid>
                                {stockArray.length > 0 && (
                                    <>
                                        <Grid item md={12} xs={12} sm={12}>
                                            {" "}
                                            <Typography variant="h6">Stock Todo List</Typography>
                                        </Grid>

                                        <Grid item md={3} xs={12} sm={12}></Grid>
                                        <Grid item md={3} xs={12} sm={12}></Grid>
                                        <Grid item md={3} xs={12} sm={12}></Grid>
                                        <Grid item md={3} xs={12} sm={12}></Grid>
                                    </>
                                )}
                                {stockArray.length > 0 &&
                                    stockArray.map((item, index) => {
                                        return (
                                            <>
                                                <Grid item md={3} xs={3} sm={3}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>Material</Typography>
                                                        <OutlinedInput
                                                            readOnly={true}
                                                            value={item.materialnew}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={3} xs={3} sm={3}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>UOM </Typography>
                                                        <OutlinedInput
                                                            readOnly={true}
                                                            value={item.uomnew}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={3} sm={3} xs={3}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>Qty </Typography>
                                                        <OutlinedInput
                                                            readOnly={true}
                                                            value={item.quantitynew}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid
                                                    item
                                                    md={3}
                                                    sm={3}
                                                    xs={3}
                                                    sx={{ display: "flex" }}
                                                >
                                                    <FormControl fullWidth size="small">
                                                        <Typography>Product Details</Typography>

                                                        <TextareaAutosize
                                                            aria-label="minimum height"
                                                            minRows={2}
                                                            readOnly={true}
                                                            value={item.productdetailsnew}
                                                            placeholder="Please Enter Product Details"
                                                        />
                                                    </FormControl>
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
                                            </>
                                        );
                                    })}
                            </Grid>
                            <br /> <br />
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12} sm={12}>
                                    {btnSubmit ? (
                                        <Box sx={{ display: "flex" }}>
                                            <CircularProgress />
                                        </Box>
                                    ) : (
                                        <>
                                            <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={editSubmit}>
                                                {" "}
                                                Update
                                            </Button>
                                        </>
                                    )}
                                </Grid>
                                <br />
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit}>
                                        {" "}
                                        Cancel{" "}
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </Dialog>
            </Box>
            {/* Delete modal */}
            <Dialog
                open={openDelete}
                onClose={handleCloseDelete}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent
                    sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                >
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "80px", color: "orange" }}
                    />
                    <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                        Are you sure?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDelete} variant="outlined">
                        Cancel
                    </Button>
                    <Button
                        onClick={(e) => delProject()}
                        autoFocus
                        variant="contained"
                        color="error"
                    >
                        {" "}
                        OK{" "}
                    </Button>
                </DialogActions>
            </Dialog>
            <br />
            <br />
            {/* view model */}
            <Dialog
                open={openView}
                onClose={handlViewClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
                sx={{ marginTop: "95px" }}
            >
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>
                            {" "}
                            View Stock Purchase
                        </Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Company</Typography>
                                    <Typography>{stockmanagemasteredit.company}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Branch</Typography>
                                    <Typography>{stockmanagemasteredit.branch}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Unit</Typography>
                                    <Typography>{stockmanagemasteredit.unit}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Floor</Typography>
                                    <Typography>{stockmanagemasteredit.floor}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Area</Typography>
                                    <Typography>{stockmanagemasteredit.area}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Location</Typography>
                                    <Typography>{stockmanagemasteredit.location}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Request Mode For</Typography>
                                    <Typography>{stockmanagemasteredit.requestmode}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Vendor Group</Typography>
                                    <Typography>{stockmanagemasteredit?.vendorgroup}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Dealers Name</Typography>
                                    <Typography>{stockmanagemasteredit?.vendor}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">GST No</Typography>
                                    <Typography>{stockmanagemasteredit.gstno}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Bill No</Typography>
                                    <Typography>{stockmanagemasteredit.billno}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Warranty</Typography>
                                    <Typography>{stockmanagemasteredit.warranty}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Purchase Date</Typography>
                                    <Typography>
                                        {
                                            stockmanagemasteredit.purchasedate === "" ? "" : moment(stockmanagemasteredit.purchasedate).format("DD/MM/YYYY")
                                        }
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Stock Category</Typography>
                                    <Typography>{stockmanagemasteredit.stockcategory}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Stock Subcategory</Typography>
                                    <Typography>
                                        {stockmanagemasteredit.stocksubcategory}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Quantity & UOM</Typography>
                                    <Typography>{quantityAndUom}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Product Details</Typography>
                                    <Typography>{productdetailsNeww}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Quantity</Typography>
                                    <Typography>{quantityNeww}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Material</Typography>
                                    <Typography>{materialNeww}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Warranty Details</Typography>
                                    <Typography>
                                        {stockmanagemasteredit.warrantydetails}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Rate</Typography>
                                    <Typography>{stockmanagemasteredit.rate}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Bill Date</Typography>
                                    <Typography>
                                        {moment(stockmanagemasteredit.billdate).format(
                                            "DD/MM/YYYY"
                                        )}
                                    </Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handlViewClose}
                            >
                                Back
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>

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
                        <Button
                            variant="contained"
                            style={{
                                padding: "7px 13px",
                                color: "white",
                                background: "rgb(25, 118, 210)",
                            }}
                            onClick={handleCloseerr}
                        >
                            {" "}
                            ok{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            {/* UPLOAD BILL IMAGE DIALOG EDIT*/}
            <Dialog
                open={uploadPopupOpenedit}
                onClose={handleUploadPopupCloseedit}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="md"
                sx={{ marginTop: "95px" }}
            >
                <DialogTitle
                    id="customized-dialog-title1"
                    sx={{ backgroundColor: "#e0e0e0", color: "#000", display: "flex" }}
                >
                    Upload Image
                </DialogTitle>
                <DialogContent sx={{ minWidth: "750px", height: "850px" }}>
                    <Grid container spacing={2}>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <br />
                            <FormControl size="small" fullWidth>
                                <Grid sx={{ display: "flex" }}>
                                    <Button
                                        variant="contained"
                                        component="label"
                                        sx={userStyle.uploadbtn}
                                    >
                                        Upload
                                        <input
                                            type="file"
                                            multiple
                                            id="productimage"
                                            accept="image/*"
                                            hidden
                                            onChange={handleInputChangeedit}
                                        />
                                    </Button>
                                    &ensp;
                                </Grid>
                            </FormControl>
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            {refImageedit.map((file, index) => (
                                <Grid container key={index}>
                                    <Grid item md={2} sm={2} xs={2}>
                                        <Box
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            {file.type.includes("image/") ? (
                                                <img
                                                    src={file.preview}
                                                    alt={file.name}
                                                    height={50}
                                                    style={{
                                                        maxWidth: "-webkit-fill-available",
                                                    }}
                                                />
                                            ) : (
                                                <img
                                                    className={classes.preview}
                                                    src={getFileIconedit(file.name)}
                                                    height="10"
                                                    alt="file icon"
                                                />
                                            )}
                                        </Box>
                                    </Grid>
                                    <Grid
                                        item
                                        md={7}
                                        sm={7}
                                        xs={7}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Typography variant="subtitle2"> {file.name} </Typography>
                                    </Grid>
                                    <Grid item md={1} sm={1} xs={1}>
                                        <Grid sx={{ display: "flex" }}>
                                            <Button
                                                sx={{
                                                    padding: "14px 14px",
                                                    minWidth: "40px !important",
                                                    borderRadius: "50% !important",
                                                    ":hover": {
                                                        backgroundColor: "#80808036", // theme.palette.primary.main
                                                    },
                                                }}
                                                onClick={() => renderFilePreviewedit(file)}
                                            >
                                                <VisibilityOutlinedIcon
                                                    style={{ fontsize: "12px", color: "#357AE8" }}
                                                />
                                            </Button>
                                            <Button
                                                sx={{
                                                    padding: "14px 14px",
                                                    minWidth: "40px !important",
                                                    borderRadius: "50% !important",
                                                    ":hover": {
                                                        backgroundColor: "#80808036", // theme.palette.primary.main
                                                    },
                                                }}
                                                onClick={() => handleDeleteFileedit(index)}
                                            >
                                                <FaTrash
                                                    style={{ color: "#a73131", fontSize: "12px" }}
                                                />
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleUploadOverAlledit} variant="contained">
                        Ok
                    </Button>
                    <Button onClick={resetImageedit} sx={userStyle.btncancel}>
                        Reset
                    </Button>
                    <Button onClick={handleUploadPopupCloseedit} sx={userStyle.btncancel}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            {/* UPLOAD WARRANTY IMAGE DIALOG    CREATE*/}
            <Dialog
                open={uploadPopupOpenwarranty}
                onClose={handleUploadPopupClosewarranty}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="md"
                sx={{ marginTop: "95px" }}
            >
                <DialogTitle
                    id="customized-dialog-title1"
                    sx={{ backgroundColor: "#e0e0e0", color: "#000", display: "flex" }}
                >
                    Upload Image
                </DialogTitle>
                <DialogContent sx={{ minWidth: "750px", height: "850px" }}>
                    <Grid container spacing={2}>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <br />
                            <FormControl size="small" fullWidth>
                                <Grid sx={{ display: "flex" }}>
                                    <Button
                                        variant="contained"
                                        component="label"
                                        sx={userStyle.uploadbtn}
                                    >
                                        Upload
                                        <input
                                            type="file"
                                            multiple
                                            id="productimage"
                                            accept="image/*"
                                            hidden
                                            onChange={handleInputChangewarranty}
                                        />
                                    </Button>
                                    &ensp;
                                </Grid>
                            </FormControl>
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            {refImagewarranty.map((file, index) => (
                                <Grid container key={index}>
                                    <Grid item md={2} sm={2} xs={2}>
                                        <Box
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            {file.type.includes("image/") ? (
                                                <img
                                                    src={file.preview}
                                                    alt={file.name}
                                                    height={50}
                                                    style={{
                                                        maxWidth: "-webkit-fill-available",
                                                    }}
                                                />
                                            ) : (
                                                <img
                                                    className={classes.preview}
                                                    src={getFileIconwarranty(file.name)}
                                                    height="10"
                                                    alt="file icon"
                                                />
                                            )}
                                        </Box>
                                    </Grid>
                                    <Grid
                                        item
                                        md={7}
                                        sm={7}
                                        xs={7}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Typography variant="subtitle2"> {file.name} </Typography>
                                    </Grid>
                                    <Grid item md={1} sm={1} xs={1}>
                                        <Grid sx={{ display: "flex" }}>
                                            <Button
                                                sx={{
                                                    padding: "14px 14px",
                                                    minWidth: "40px !important",
                                                    borderRadius: "50% !important",
                                                    ":hover": {
                                                        backgroundColor: "#80808036", // theme.palette.primary.main
                                                    },
                                                }}
                                                onClick={() => renderFilePreviewwarranty(file)}
                                            >
                                                <VisibilityOutlinedIcon
                                                    style={{ fontsize: "12px", color: "#357AE8" }}
                                                />
                                            </Button>
                                            <Button
                                                sx={{
                                                    padding: "14px 14px",
                                                    minWidth: "40px !important",
                                                    borderRadius: "50% !important",
                                                    ":hover": {
                                                        backgroundColor: "#80808036", // theme.palette.primary.main
                                                    },
                                                }}
                                                onClick={() => handleDeleteFilewarranty(index)}
                                            >
                                                <FaTrash
                                                    style={{ color: "#a73131", fontSize: "12px" }}
                                                />
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleUploadOverAllwarranty} variant="contained">
                        Ok
                    </Button>
                    <Button onClick={resetImagewarranty} sx={userStyle.btncancel}>
                        Reset
                    </Button>
                    <Button
                        onClick={handleUploadPopupClosewarranty}
                        sx={userStyle.btncancel}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            <Box>
                {/* ALERT DIALOG */}
                <Dialog
                    open={isDeleteOpenalert}
                    onClose={handleCloseModalert}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent
                        sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                    >
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "70px", color: "orange" }}
                        />
                        <Typography
                            variant="h6"
                            sx={{ color: "black", textAlign: "center" }}
                        >
                            Please Select any Row
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            autoFocus
                            variant="contained"
                            color="error"
                            onClick={handleCloseModalert}
                        >
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

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
            {/* PRINT PDF EXCEL CSV */}
            <ExportData
                isFilterOpen={isFilterOpen}
                handleCloseFilterMod={handleCloseFilterMod}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen}
                isPdfFilterOpen={isPdfFilterOpen}
                setIsPdfFilterOpen={setIsPdfFilterOpen}
                handleClosePdfFilterMod={handleClosePdfFilterMod}
                filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
                itemsTwo={overallFilterdata ?? []}
                filename={"StockPurchase"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/* INFO */}
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Stock Purchase Info"
                addedby={addedby}
                updateby={updateby}
            />
            {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={openDelete}
                onClose={handleCloseDelete}
                onConfirm={delProject}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpencheckbox}
                onClose={handleCloseModcheckbox}
                onConfirm={delVendorcheckbox}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            {/* PLEASE SELECT ANY ROW */}
            <PleaseSelectRow
                open={isDeleteOpenalert}
                onClose={handleCloseModalert}
                message="Please Select any Row"
                iconColor="orange"
                buttonText="OK"
            />
            {/* EXTERNAL COMPONENTS -------------- END */}
        </Box>
    );
}
export default ListReferenceCategoryDoc;
