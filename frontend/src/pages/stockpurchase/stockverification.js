import { makeStyles } from "@material-ui/core";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { City, Country, State } from "country-state-city";
import { AiOutlineClose } from "react-icons/ai";
import * as faceapi from "face-api.js";
import { MultiSelect } from "react-multi-select-component";
import Stockmaterialeditdialog from "./verficationstockmaterialeditdialog.js";
import Manualstockentryverification from "./manualassetmaterialdialog.js";
import Manuastockmaterial from "./manualstockmaterialdialog.js";
import ManageColumnsContent from "../../components/ManageColumn";
import ManualEntry from "./manualentrypopup.js";
import {
    Box, Radio, InputAdornment, RadioGroup, Tooltip,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormGroup,
    Grid,
    IconButton,
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
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    TextareaAutosize,
    Typography,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
// import html2canvas from "html2canvas";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaTrash, FaPrint, FaSearch, FaPlus, FaEdit } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import csvIcon from "../../components/Assets/CSV.png";
import excelIcon from "../../components/Assets/excel-icon.png";
import fileIcon from "../../components/Assets/file-icons.png";
import pdfIcon from "../../components/Assets/pdf-icon.png";
import wordIcon from "../../components/Assets/word-icon.png";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import { StyledTableCell, StyledTableRow } from "../../components/Table";
// import StyledDataGrid from "../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import LoadingButton from "@mui/lab/LoadingButton";
import AlertDialog from "../../components/Alert";
import {
    DeleteConfirmation,
    PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";

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

function calculateLuminance(hex) {






    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    // Calculate luminance using the formula
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;


    // If luminance is greater than 128, it's a light color
    return luminance > 128;
}


function Stockverification() {

    const [vendorNew, setVendorNew] = useState("Choose Vendor");
    const [totalAmountEdit, setAmountEdit] = useState(0)


    //  Datefield
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;

    let now = new Date();

    let hours = now.getHours();
    let minutes = String(now.getMinutes()).padStart(2, "0");
    let seconds = String(now.getSeconds()).padStart(2, "0");

    let currtime = `${hours}:${minutes}`;

    const [stockmaster, setStockmaster] = useState({
        branch: "",
        unit: "",
        producthead: "",
        vendorname: "Please Select Vendor",
        gstno: "",
        totalbillamount: "",
        billno: "",
        requesttime: currtime,
        requestdate: today,
        productname: "",
        productdetails: "",
        warrantydetails: "",
        uom: "Please Select UOM",
        quantity: "",
        rate: "",
        billdate: "",
        files: "",
        warrantyfiles: "",
        warranty: "Yes",
        addedby: "",
        updatedby: "",
        requestmode: "Please Select Request Mode",
        stockcategory: "Please Select Stock Category",
        stocksubcategory: "Please Select Stock Sub Category",
        uomnew: "Please Select UOM",
        quantitynew: "",
        materialnew: "Please Select Material",
        productdetailsnew: "",
    });


    const [vendorGrpOpen, setVendorgrpOpen] = useState({ open: false, data: "" });
    const [vendorgroup, setVendorgroup] = useState({ vendorgroupname: "" })
    //vendor grouping add popup
    const handleClickVendorgrpOpen = (data) => {
        setVendorgrpOpen({ open: true, data: data });
    };
    const handleClickVendorgrpClose = () => {
        setVendorgrpOpen({ open: false, data: "" });
    };

    const [unitsEdit, setUnitsEdit] = useState([]);

    const [newcheckbranch, setNewcheckBranch] = useState("Choose Branch");

    const [stockmasteredit, setStockmasteredit] = useState({
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        floor: "Please Select Floor",
        area: "Please Select Area",
        location: "Please Select Location",
        workstation: "Please Select Workstation",
        producthead: "",
        vendorname: "Please Select Vendor",

        productname: "Please Select Material",

        component: "Please Select Component",
        gstno: "",
        billno: "",
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
    const [vendorNewEdit, setVendorNewEdit] = useState("Choose Vendor");

    const [stockmaterialedit, setStockmaterialedit] = useState([]);


    const [selectedPurchaseDateEdit, setSelectedPurchaseDateEdit] = useState("");

    const handleChangephonenumberEdit = (e) => {
        // const regex = /^[0-9]+$/;  // Only allows positive integers
        const regex = /^\d*\.?\d*$/;
        const inputValue = e.target.value;
        // Check if the input value matches the regex or if it's empty (allowing backspace)
        if (regex.test(inputValue) || inputValue === "") {
            // Update the state with the valid numeric value
            setStockmasteredit({ ...stockmasteredit, estimation: inputValue });
        }
    };

    const handleEstimationChangeEdit = (e) => {
        const { value } = e.target;
        setStockmasteredit({ ...stockmasteredit, estimationtime: value });
        // calculateExpiryDate(value, stockmasteredit.purchasedate);
    };

    const handlePurchaseDateChangeEdit = (e) => {
        const { value } = e.target;
        setStockmasteredit({ ...stockmasteredit, purchasedate: value });
        setSelectedPurchaseDateEdit(value);
        // calculateExpiryDateEdit(stockmasterEdit.estimationtime, value);
    };

    const [vendorGroupEdit, setVendorGroupEdit] = useState("Choose Vendor Group");
    const [vendorOptEdit, setVendoroptEdit] = useState([]);


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


    const [specificationGroupingEdit, setSpecificationGroupingEdit] = useState(
        []
    );

    const [vendorOptIndEdit, setVendoroptIndEdit] = useState([]);

    //alert model for Size details
    const [opensize, setOpensize] = useState(false);
    // view model
    const handleClickOpenSize = () => {
        setOpensize(true);
    };

    //alert model for Type details
    const [openCapacity, setOpenCapacity] = useState(false);
    // view model
    const handleClickOpenCapacity = () => {
        setOpenCapacity(true);
    };

    const handleClickCloseCapacity = () => {
        setOpenCapacity(false);
        // setcapacityname("");
    };

    //alert model for Variant details
    const [openvariant, setOpenvariant] = useState(false);
    // view model
    const handleClickOpenVariant = () => {
        setOpenvariant(true);
    };

    const handleClickCloseVariant = () => {
        setOpenvariant(false);
        // setAssetVariant({ name: "", code: "" });
    };



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



    const formatDateString = (date) => {
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, "0");
        const month = (d.getMonth() + 1).toString().padStart(2, "0");
        const year = d.getFullYear();
        return `${year}-${month}-${day}`;
    };

    const calculateExpiryDate = () => {
        if (stockmaster.estimationtime !== "" && stockmaster.purchasedate) {
            const currentDate = new Date(stockmaster.purchasedate);
            let expiryDate = new Date(currentDate);

            if (stockmaster.estimationtime === "Days") {
                expiryDate.setDate(
                    currentDate.getDate() + parseInt(stockmaster.estimation)
                );
            } else if (stockmaster.estimationtime === "Month") {
                expiryDate.setMonth(
                    currentDate.getMonth() + parseInt(stockmaster.estimation)
                );
            } else if (stockmaster.estimationtime === "Year") {
                expiryDate.setFullYear(
                    currentDate.getFullYear() + parseInt(stockmaster.estimation)
                );
            }

            const formattedExpiryDate = formatDateString(expiryDate);

            let formattedempty = formattedExpiryDate.includes("NaN-NaN-NaN")
                ? ""
                : formattedExpiryDate;

            setStockmaster({
                ...stockmaster,
                warrantycalculation: formattedempty, // Format date as needed
            });
        }
    };

    useEffect(() => {
        calculateExpiryDate();
    }, [
        stockmaster.estimationtime,
        stockmaster.estimation,
        stockmaster.purchasedate,
    ]);

    useEffect(() => {
        calculateExpiryDateEdit();
    }, [
        stockmasteredit.estimationtime,
        stockmasteredit.estimation,
        stockmasteredit.purchasedate,
    ]);

    const calculateExpiryDateEdit = () => {
        if (stockmasteredit.estimationtime && stockmasteredit.purchasedate) {
            const currentDate = new Date(stockmasteredit.purchasedate);
            let expiryDate = new Date(currentDate);

            if (stockmasteredit.estimationtime === "Days") {
                expiryDate.setDate(
                    currentDate.getDate() + parseInt(stockmasteredit.estimation)
                );
            } else if (stockmasteredit.estimationtime === "Month") {
                expiryDate.setMonth(
                    currentDate.getMonth() + parseInt(stockmasteredit.estimation)
                );
            } else if (stockmasteredit.estimationtime === "Year") {
                expiryDate.setFullYear(
                    currentDate.getFullYear() + parseInt(stockmasteredit.estimation)
                );
            }

            const formattedExpiryDate = formatDateString(expiryDate);

            let formattedempty = formattedExpiryDate.includes("NaN-NaN-NaN")
                ? ""
                : formattedExpiryDate;

            setStockmasteredit({
                ...stockmasteredit,
                warrantycalculation: formattedempty, // Format date as needed
            });
        }
    };

    //editing the single data...
    const sendEditRequest = async () => {
        try {
            let stockcreate = await axios.post(SERVICE.STOCKPURCHASE_CREATE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },

                company: String(stockmasteredit.company),
                branch: String(stockmasteredit.branch),
                unit: String(stockmasteredit.unit),
                floor: String(stockmasteredit.floor),
                location: String(stockmasteredit.location),
                area: String(stockmasteredit.area),
                workstation: String(
                    stockmasteredit.workcheck ? stockmasteredit.workstation : ""
                ),
                // workcheck: String(stockmasteredit.workcheck),
                assettype: String(
                    stockmasteredit.assettype === undefined
                        ? ""
                        : stockmasteredit.assettype
                ),
                asset: String(stockmasteredit.asset),

                productname: String(
                    stockmasteredit.productname === "Please Select Material" ||
                        stockmasteredit.productname === undefined
                        ? ""
                        : stockmasteredit.productname
                ),

                component: String(
                    stockmasteredit.component === "Please Select Component"
                        ? ""
                        : stockmasteredit.component
                ),
                subcomponent: todosEdit ? [...todosEdit] : [],
                warranty: String(stockmasteredit.warranty),
                estimation: String(stockmasteredit.estimation),
                estimationtime: String(stockmasteredit.estimationtime),
                warrantycalculation: String(stockmasteredit.warrantycalculation),
                purchasedate: selectedPurchaseDateEdit,

                producthead: String(
                    stockmasteredit.producthead === ""
                        ? ""
                        : stockmasteredit.producthead
                ),

                vendor: String(vendorNewEdit),
                vendorgroup: String(vendorGroupEdit),
                gstno: String(
                    vendorgetid.gstnumber === undefined ? "" : vendorgetid.gstnumber
                ),
                vendorid: String(vendorgetid._id),
                billno: Number(stockmasteredit.billno),
                productdetails: String(stockmasteredit.productdetails),
                warrantydetails: String(stockmasteredit.warrantydetails),
                status: "Transfer",
                uom:
                    stockmasteredit.uom === "Please Select UOM"
                        ? ""
                        : String(stockmasteredit.uom),
                quantity: Number(stockmasteredit.quantity),
                rate: Number(stockmasteredit.rate),
                billdate: String(stockmasteredit.billdate),
                files: [...refImageedit],
                warrantyfiles: refImagewarrantyedit,
                totalbillamount: (stockmasteredit.quantity) * (stockmasteredit.rate),
                requestmode: String(stockmasteredit.requestmode),
                stockcategory:
                    stockmasteredit.stockcategory === "Please Select Stock Category"
                        ? ""
                        : String(stockmasteredit.stockcategory),
                stocksubcategory:
                    stockmasteredit.stocksubcategory ===
                        "Please Select Stock Sub Category"
                        ? ""
                        : String(stockmasteredit.stocksubcategory),
                uomnew:
                    stockmasteredit.uomnew === "" ? "" : String(stockmasteredit.uomnew),
                quantitynew:
                    stockmasteredit.quantitynew === ""
                        ? ""
                        : Number(stockmasteredit.quantitynew),
                materialnew:
                    stockmasteredit.materialnew === "Please Select Material"
                        ? ""
                        : String(stockmasteredit.materialnew),
                productdetailsnew: String(stockmasteredit.productdetailsnew),

            }
            );

            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            handleCloseModEdit();
        } catch (err) {

            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const editSubmit = (e) => {

        e.preventDefault();


        if (stockmasteredit.quantity === "") {
            setPopupContentMalert("Please Enter Qunatity!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if ((stockmasteredit.quantity > stockbalance.quantitynew) || (stockmasteredit.quantity > availqty)) {
            setPopupContentMalert("Please Enter Less Count Qunatity!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }


        else {
            sendEditRequest();
        }
    };

    const [Specificationedit, setSpecificationedit] = useState([]);
    const [todosEdit, setTodosEdit] = useState([]);


    //todo edit

    const handleAddInputEdit = (e) => {
        let specificationItem = Specificationedit.find(
            (item) => e === item.categoryname
        );
        let filtersub = specificationItem?.subcategoryname;
        let result;
        if (filtersub.length > 0) {
            result = filtersub?.map((sub, index) => ({
                sub: `${index + 1}.${sub.subcomponent}`,
                subname: sub.subcomponent,
                subcomponentcheck: false,
                type: sub.type ? "Choose Type" : "",
                model: sub.model ? "Choose Model" : "",
                size: sub.size ? "Choose Size" : "",
                variant: sub.variant ? "Choose variant" : "",
                brand: sub.brand ? "Choose Brand" : "",
                serial: sub.serial ? "" : undefined,
                other: sub.other ? "" : undefined,
                capacity: sub.capacity ? "Choose Capacity" : "",
                hdmiport: sub.hdmiport ? "" : undefined,
                vgaport: sub.vgaport ? "" : undefined,
                dpport: sub.dpport ? "" : undefined,
                usbport: sub.usbport ? "" : undefined,
                paneltypescreen: sub.paneltypescreen ? "Choose Panel Type" : "",
                resolution: sub.resolution ? "Choose Screen Resolution" : "",
                connectivity: sub.connectivity ? "Choose Connectivity" : "",
                daterate: sub.daterate ? "Choose Data Rate" : "",
                compatibledevice: sub.compatibledevice
                    ? "Choose Compatible Device"
                    : "",
                outputpower: sub.outputpower ? "Choose Output Power" : "",
                collingfancount: sub.collingfancount ? "Choose Cooling Fan Count" : "",
                clockspeed: sub.clockspeed ? "Choose Clock Speed" : "",
                core: sub.core ? "Choose Core" : "",
                speed: sub.speed ? "Choose Speed" : "",
                frequency: sub.frequency ? "Choose Frequency" : "",
                output: sub.output ? "Choose Output" : "",
                ethernetports: sub.ethernetports ? "Choose Ethernet Ports" : "",
                distance: sub.distance ? "Choose Distance" : "",
                lengthname: sub.lengthname ? "Choose Length" : "",
                slot: sub.slot ? "Choose Slot" : "",
                noofchannels: sub.noofchannels ? "Choose No. Of Channels" : "",
                colours: sub.colours ? "Choose Colour" : "",

                warranty: stockmaster.warranty ? stockmaster.warranty : undefined,
                estimation: stockmaster.estimation ? stockmaster.estimation : undefined,
                estimationtime: stockmaster.estimationtime
                    ? stockmaster.estimationtime
                    : undefined,
                warrantycalculation: stockmaster.warrantycalculation
                    ? stockmaster.warrantycalculation
                    : undefined,
                purchasedate: selectedPurchaseDateEdit ? selectedPurchaseDateEdit : undefined,
                vendor: stockmaster.vendorname ? stockmaster.vendorname : undefined,
                phonenumber: vendorgetid.phonenumber
                    ? vendorgetid.phonenumber
                    : undefined,
                vendorid: vendornameid ? vendornameid : undefined,
                address: vendorgetid.address ? vendorgetid.address : undefined,
            }));
        } else if (
            filtersub.length === 0 &&
            !(
                !specificationItem.type &&
                !specificationItem.model &&
                !specificationItem.size &&
                !specificationItem.variant &&
                !specificationItem.brand &&
                !specificationItem.serial &&
                !specificationItem.other &&
                !specificationItem.capacity &&
                !specificationItem.hdmiport &&
                !specificationItem.vgaport &&
                !specificationItem.dpport &&
                !specificationItem.usbport
            )
        ) {
            result = [
                {
                    // sub: `${index + 1}.${sub.subcomponent}`,
                    subcomponentcheck: false,
                    type: specificationItem.type ? "Choose Type" : "",
                    model: specificationItem.model ? "Choose Model" : "",
                    size: specificationItem.size ? "Choose Size" : "",
                    variant: specificationItem.variant ? "Choose variant" : "",
                    brand: specificationItem.brand ? "Choose Brand" : "",
                    serial: specificationItem.serial ? "" : undefined,
                    other: specificationItem.other ? "" : undefined,
                    capacity: specificationItem.capacity ? "Choose Capacity" : "",
                    hdmiport: specificationItem.hdmiport ? "" : undefined,
                    vgaport: specificationItem.vgaport ? "" : undefined,
                    dpport: specificationItem.dpport ? "" : undefined,
                    usbport: specificationItem.usbport ? "" : undefined,
                    paneltypescreen: specificationItem.paneltypescreen
                        ? "Choose Panel Type"
                        : "",
                    resolution: specificationItem.resolution
                        ? "Choose Screen Resolution"
                        : "",
                    connectivity: specificationItem.connectivity
                        ? "Choose Connectivity"
                        : "",
                    daterate: specificationItem.daterate ? "Choose Data Rate" : "",
                    compatibledevice: specificationItem.compatibledevice
                        ? "Choose Compatible Device"
                        : "",
                    outputpower: specificationItem.outputpower
                        ? "Choose Output Power"
                        : "",
                    collingfancount: specificationItem.collingfancount
                        ? "Choose Cooling Fan Count"
                        : "",
                    clockspeed: specificationItem.clockspeed ? "Choose Clock Speed" : "",
                    core: specificationItem.core ? "Choose Core" : "",
                    speed: specificationItem.speed ? "Choose Speed" : "",
                    frequency: specificationItem.frequency ? "Choose Frequency" : "",
                    output: specificationItem.output ? "Choose Output" : "",
                    ethernetports: specificationItem.ethernetports
                        ? "Choose Ethernet Ports"
                        : "",
                    distance: specificationItem.distance ? "Choose Distance" : "",
                    lengthname: specificationItem.lengthname ? "Choose Length" : "",
                    slot: specificationItem.slot ? "Choose Slot" : "",
                    noofchannels: specificationItem.noofchannels
                        ? "Choose No. Of Channels"
                        : "",
                    colours: specificationItem.colours ? "Choose Colour" : "",

                    warranty: stockmaster.warranty ? stockmaster.warranty : undefined,
                    estimation: stockmaster.estimation
                        ? stockmaster.estimation
                        : undefined,
                    estimationtime: stockmaster.estimationtime
                        ? stockmaster.estimationtime
                        : undefined,
                    warrantycalculation: stockmaster.warrantycalculation
                        ? stockmaster.warrantycalculation
                        : undefined,
                    purchasedate: selectedPurchaseDateEdit ? selectedPurchaseDateEdit : undefined,
                    vendor: stockmaster.vendorname ? stockmaster.vendorname : undefined,
                    phonenumber: vendorgetid.phonenumber
                        ? vendorgetid.phonenumber
                        : undefined,
                    vendorid: vendornameid ? vendornameid : undefined,
                    address: vendorgetid.address ? vendorgetid.address : undefined,
                },
            ];
        }

        setTodosEdit(result);
    };

    const handleChangeEdit = async (index, name, value, id) => {
        const updatedTodos = [...todosEdit];
        updatedTodos[index] = {
            ...updatedTodos[index],
            [name]: value,
        };
        setTodosEdit(updatedTodos);

        // Calculate expiry date for the updated todo
        const updatedTodo = updatedTodos[index];
        if (
            updatedTodo.estimationtime !== "" &&
            updatedTodo.purchasedate &&
            updatedTodo.estimation !== ""
        ) {
            const currentDate = new Date(updatedTodo.purchasedate);
            let expiryDate = new Date(currentDate);

            if (updatedTodo.estimationtime === "Days") {
                expiryDate.setDate(
                    currentDate.getDate() + parseInt(updatedTodo.estimation)
                );
            } else if (updatedTodo.estimationtime === "Month") {
                expiryDate.setMonth(
                    currentDate.getMonth() + parseInt(updatedTodo.estimation)
                );
            } else if (updatedTodo.estimationtime === "Year") {
                expiryDate.setFullYear(
                    currentDate.getFullYear() + parseInt(updatedTodo.estimation)
                );
            }

            const formattedExpiryDate = formatDateString(expiryDate);
            let formattedempty = formattedExpiryDate.includes("NaN-NaN-NaN")
                ? ""
                : formattedExpiryDate;

            // Update the calculated expiry date in the todo
            const updatedTodosCopy = [...updatedTodos];
            updatedTodosCopy[index] = {
                ...updatedTodosCopy[index],
                warrantycalculation: formattedempty,
            };
            setTodosEdit(updatedTodosCopy);
        }

        const updatedTodovendor = updatedTodos[index];
        if (updatedTodovendor.vendorname !== "" && id) {
            // Fix: Add await here to wait for the result of the axios call
            const res = await axios.get(`${SERVICE.SINGLE_VENDORDETAILS}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            // Update the todo with vendor details
            const updatedTodosCopy = [...updatedTodos];
            updatedTodosCopy[index] = {
                ...updatedTodosCopy[index],
                address: res?.data?.svendordetails.address,
                phonenumber: res?.data?.svendordetails.phonenumber,
            };
            setTodosEdit(updatedTodosCopy);
        }
    };
    const handleDeleteEdit = (index) => {
        const updatedTodos = [...todosEdit];
        updatedTodos?.splice(index, 1);
        setTodosEdit(updatedTodos);
    };

    let newval = "VEN0001";

    const [handover, setHandover] = useState({
        company: "",
        branch: "",
        unit: "",
        floor: "",
        area: "",
        location: "",
        productname: "",
        requestmode: "",
        requestdate: "",
        materialmode: "",


    });

    //alert model for vendor details
    const [openviewalertvendorstock, setOpenviewalertvendrostock] =
        useState(false);
    // view model
    const handleClickOpenviewalertvendorstock = () => {
        setOpenviewalertvendrostock(true);
    };

    const handleCloseviewalertvendorstock = () => {
        setOpenviewalertvendrostock(false);
    };


    //alert model for vendor details
    const [openviewalertvendormanualasset, setOpenviewalertvendromanualasset] =
        useState(false);
    // view model
    const handleClickOpenviewalertvendormanualasset = () => {
        setOpenviewalertvendromanualasset(true);
    };

    const handleCloseviewalertvendormanualasset = () => {
        setOpenviewalertvendromanualasset(false);
    };

    //alert model for vendor details
    const [openviewalertvendormanualstock, setOpenviewalertvendromanualstock] =
        useState(false);
    // view model
    const handleClickOpenviewalertvendormanualstock = () => {
        setOpenviewalertvendromanualstock(true);
    };

    const handleCloseviewalertvendormanualstock = () => {
        setOpenviewalertvendromanualstock(false);
    };


    const [isWebcamCapture, setIsWebcamCapture] = useState(false);

    const [stockmanages, setStockmanage] = useState([]);

    const [selectedRowsRequestPurchase, setSelectedRowsRequestPurchase] = useState([]);

    const [stockArray, setStockArray] = useState([]);

    let totalQuantity;
    let totalQuantityStock;
    // const totalQuantity = selectedRowsRequestPurchase.reduce((sum, item) => {
    //   if (item.requestmode === "Asset Material") {
    //     return sum + (item.quantity || 0);
    //   } else if (item.requestmode === "Stock Material") {
    //     return sum + (item.quantitynew || 0);
    //   }
    //   return sum;
    // }, 0);

    // const totalQuantityStock = stockArray.reduce((sum, item) => {

    //   return sum + Number(item.quantitynew || 0);

    //   // return sum;
    // }, 0);




    const handlechangephonenumber = (e) => {
        const regex = /^[0-9]+$/;
        const inputValue = e.target.value?.slice(0, 10);
        if (regex.test(inputValue) || inputValue === "") {
            return inputValue;
        }
    };

    // Country city state datas
    const [selectedCountryp, setSelectedCountryp] = useState(
        Country.getAllCountries().find((country) => country.name === "India")
    );
    const [selectedStatep, setSelectedStatep] = useState(
        State.getStatesOfCountry(selectedCountryp?.isoCode).find(
            (state) => state.name === "Tamil Nadu"
        )
    );
    const [selectedCityp, setSelectedCityp] = useState(
        City.getCitiesOfState(
            selectedStatep?.countryCode,
            selectedStatep?.isoCode
        ).find((city) => city.name === "Tiruchirappalli")
    );
    const [selectedCountryc, setSelectedCountryc] = useState();
    const [selectedStatec, setSelectedStatec] = useState();
    const [selectedCityc, setSelectedCityc] = useState();


    const [refImageDragedit, setRefImageDragedit] = useState([]);
    const [isWebcamOpenedit, setIsWebcamOpenedit] = useState(false);
    const [capturedImagesedit, setCapturedImagesedit] = useState([]);
    const [lanNumber, setLanNumber] = useState();

    const vendorstatusopt = [
        { value: "Active", label: "Active" },
        { value: "In Active", label: "In Active" },
    ];

    const paymentfrequency = [
        { value: "Daily", label: "Daily" },
        { value: "Monthly", label: "Monthly" },
        { value: "BillWise", label: "BillWise" },
        { value: "Weekly", label: "Weekly" },
    ];

    const handlechangecpincode = (e) => {
        const regex = /^[0-9]+$/;
        const inputValue = e.target.value?.slice(0, 6);
        if (regex.test(inputValue) || inputValue === "") {
            setVendor({ ...vendor, pincode: inputValue });
        }
    };

    const [capturedImage, setCapturedImage] = useState([])
    const [colorCaptured, setColorCaptured] = useState([]);
    const [bgbtnCaptured, setBgbtnCaptured] = useState([]);
    const [isLightColor, setIsLightColor] = useState([])
    const [isLightColorCaptured, setIsLightColorCaptured] = useState([])
    const [btnUploadEdit, setBtnUploadEdit] = useState(false);
    const [imageDragEdit, setImageDragEdit] = useState([])
    const [fileEdit, setFileEdit] = useState("");

    useEffect(() => {

        if (!capturedImagesedit) return;

        const newBlobs = [];
        const newBgbtnCaptured = [];
        const newColors = [];

        capturedImagesedit.forEach((item) => {
            if (!item?.preview) return;

            const base64Data = item.preview.split(",")[1]; // Extract base64 data
            const binaryData = atob(base64Data); // Decode base64 data
            const uint8Array = new Uint8Array(binaryData.length);

            // Fill the array buffer with the decoded binary data
            for (let i = 0; i < binaryData.length; i++) {
                uint8Array[i] = binaryData.charCodeAt(i);
            }

            // Create a Blob from the binary data
            const blob = new Blob([uint8Array], { type: "image/png" });
            newBlobs.push(blob);

            // Add default values for bgbtnCaptured and colors
            newBgbtnCaptured.push(false);
            newColors.push("#ffffff");
        });

        // Update states with the accumulated values
        setCapturedImage((prev) => [...prev, ...newBlobs]);
        setBgbtnCaptured((prev) => [...prev, ...newBgbtnCaptured]);

        // Calculate luminance for the new colors
        const luminanceValues = newColors.map((color) => calculateLuminance(color));
        setColorCaptured((prev) => [...prev, ...newColors]);
        setIsLightColorCaptured((prev) => [...prev, ...luminanceValues]);
    }, [capturedImagesedit]);

    const removeCapturedImageedit = (index) => {
        const newCapturedImages = [...capturedImagesedit];
        newCapturedImages.splice(index, 1);
        setCapturedImagesedit(newCapturedImages);
    };

    const webcamOpenedit = () => {
        setIsWebcamOpenedit(true);
    };
    const webcamCloseedit = () => {
        setIsWebcamOpenedit(false);
        setGetImgedit("");
    };
    const webcamDataStoreedit = () => {
        setIsWebcamCapture(true);
        webcamCloseedit();
        setGetImgedit("");
    };
    const showWebcamedit = () => {
        webcamOpenedit();
    };


    const handleRemoveFileedit = (index) => {
        const newSelectedFiles = [...refImageDragedit];
        newSelectedFiles.splice(index, 1);
        setRefImageDragedit(newSelectedFiles);
    };


    const handleDragOveredit = (event) => {
        event.preventDefault();
    };

    const fetchspecificationEdit = async (e) => {
        try {
            let res = await axios.get(SERVICE.ASSETWORKSTAION, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let result = res.data.assetworkstation?.filter(
                (d) => d.workstation === e
            );

            const resultall = result?.map((d) => ({
                ...d,
                label: d.categoryname,
                value: d.categoryname,
            }));

            setSpecificationedit(resultall);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const [availqty, setAvailQty] = useState(0)

    const getCodeAsset = async (row) => {
        setPageName(!pageName)

        try {
            let res = await axios.get(`${SERVICE.STOCKPURCHASE_SINGLE}/${row._id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setStockmasteredit({ ...res?.data?.sstock, quantity: "" });
            setSelectedBranchedit(res?.data?.sstock.branch);
            setSelectedUnitedit(res?.data?.sstock.unit);
            setRefImageedit(res?.data?.sstock?.files);
            setRefImagewarrantyedit(res?.data?.sstock?.warrantyfiles);
            setVendorGroupEdit(res?.data?.sstock?.vendorgroup);
            setVendorNewEdit(res?.data?.sstock?.vendor);
            handleChangeGroupNameEdit({ value: res?.data?.sstock?.vendorgroup });
            setVendoroptIndEdit(
                new Array(res?.data?.sstock?.subcomponent?.length).fill([])
            );
            for (let i = 0; i < res?.data?.sstock?.subcomponent?.length; i++) {
                await handleChangeGroupNameIndexBasedEdit(
                    { value: res?.data?.sstock?.subcomponent[i]?.vendorgroup },
                    i
                );
            }

            setSelectedPurchaseDateEdit(res?.data?.sstock.purchasedate);
            setTodosEdit(res?.data?.sstock?.subcomponent);

            await fetchBranchDropdownsEdit(res?.data?.sstock?.company);
            await fetchspecificationEdit(res?.data?.sstock?.workstation);

            await fetchUnitsEdit(res?.data?.sstock.branch);
            await fetchFloorEdit(res?.data?.sstock?.branch);
            await fetchAreaEdit(res?.data?.sstock?.branch, res?.data?.sstock?.floor);
            await fetchAllLocationEdit(
                res?.data?.sstock?.branch,
                res?.data?.sstock?.floor,
                res?.data?.sstock?.area
            );

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
            let res1 = await axios.get(SERVICE.ASSETWORKSTAION, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });


            fetchspecificationEdit(res?.data?.sstock.component)
            handleClickOpenEdit();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const getCodeStock = async (row) => {
        try {
            let res = await axios.get(`${SERVICE.STOCKPURCHASE_SINGLE}/${row._id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            handleClickOpenviewalertvendorstock();
            setVendorGroup(res?.data?.sstock?.vendorgroup);
            setVendorNew(res?.data?.sstock?.vendor);
            handleChangeGroupName({ value: res?.data?.sstock?.vendorgroup });

            setStockmanagemasteredit({
                ...res?.data?.sstock,
                materialnew: "Please Select Material",
                quantitynew: ""
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


    const getCodeManualAsset = async (row) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.MANUAL_STOCKPURCHASE_SINGLE}/${row._id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setVendorGroupEdit(res?.data?.smanualstock?.vendorgroup);
            setVendorNewEdit(res?.data?.smanualstock?.vendorname);
            setStockmanagemasteredit({
                ...res?.data?.smanualstock,
                materialnew: "Please Select Material",
                quantity: ""
            });
            setAmountEdit(res?.data?.smanualstock?.totalbillamount)
            setStockmasteredit({
                ...res?.data?.smanualstock,
                materialnew: "Please Select Material",
                quantity: ""
            });
            setSelectedBranchedit(res?.data?.smanualstock.branch);
            setVendorGroupEdit(res?.data?.smanualstock?.vendorgroup);
            setVendorNewEdit(res?.data?.smanualstock?.vendorname);
            handleChangeGroupNameEdit({
                value: res?.data?.smanualstock?.vendorgroup,
            });

            setVendoroptIndEdit(
                new Array(res?.data?.smanualstock?.subcomponent?.length).fill([])
            );
            for (let i = 0; i < res?.data?.smanualstock?.subcomponent?.length; i++) {
                await handleChangeGroupNameIndexBasedEdit(
                    { value: res?.data?.smanualstock?.subcomponent[i]?.vendorgroup },
                    i
                );
            }
            setSelectedUnitedit(res?.data?.smanualstock.unit);
            setSelectedProductheadedit(res?.data?.smanualstock.producthead);
            setSelectedProductnameedit(res?.data?.smanualstock.productname);
            setRefImageedit(res?.data?.smanualstock?.files);
            setRefImagewarrantyedit(
                res?.data?.smanualstock?.warrantyfiles
                    ? res?.data?.smanualstock?.warrantyfiles
                    : []
            );
            // setSelectedAssetTypeEdit(res?.data?.smanualstock?.assettype);

            setSelectedPurchaseDateEdit(res?.data?.smanualstock.purchasedate);
            setTodosEdit(res?.data?.smanualstock?.subcomponent);

            await fetchBranchDropdownsEdit(res?.data?.smanualstock?.company);
            await fetchUnitsEdit(res?.data?.smanualstock.branch);
            await fetchFloorEdit(res?.data?.smanualstock?.branch);
            await fetchAreaEdit(
                res?.data?.smanualstock?.branch,
                res?.data?.smanualstock?.floor
            );
            await fetchAllLocationEdit(
                res?.data?.smanualstock?.branch,
                res?.data?.smanualstock?.floor,
                res?.data?.smanualstock?.area
            );

            if (
                res?.data?.smanualstock.vendorid !== "" &&
                res?.data?.smanualstock.vendorid !== undefined
            ) {
                let resv = await axios.get(
                    `${SERVICE.SINGLE_VENDORDETAILS}/${res?.data?.smanualstock.vendorid}`,
                    {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                    }
                );
                setVendorgetid(resv?.data?.svendordetails);
            }

            await fetchspecificationEdit(res?.data?.smanualstock.component)
            handleClickOpenviewalertvendormanualasset()
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };


    const getCodeManualStock = async (row) => {
        try {


            let res = await axios.get(`${SERVICE.MANUAL_STOCKPURCHASE_SINGLE}/${row._id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setVendorGroupEdit(res?.data?.smanualstock?.vendorgroup);
            setVendorNewEdit(res?.data?.smanualstock?.vendorname);
            await handleChangeGroupNameEdit({
                value: res?.data?.smanualstock?.vendorgroup,
            });
            setStockmanagemasteredit({
                ...res?.data?.smanualstock,
                materialnew: "Please Select Material",
                quantitynew: "",
            });
            setAmountEdit(res?.data?.smanualstock?.stockmaterialarray.totalbillamount)
            setRefImageedit(res?.data?.smanualstock?.files);
            setRefImagewarrantyedit(
                res?.data?.smanualstock?.warrantyfiles
                    ? res?.data?.smanualstock?.warrantyfiles
                    : []
            );
            // setSelectedAssetTypeEdit(res?.data?.smanualstock?.assettype);
            setStockArray(res?.data?.smanualstock.stockmaterialarray);

            setSelectedPurchaseDateEdit(res?.data?.smanualstock.purchasedate);

            setSelectedBranchedit(res?.data?.smanualstock.branch);
            setSelectedUnitedit(res?.data?.smanualstock.unit);
            await fetchSubcategoryBased({
                label: res?.data?.smanualstock.stockcategory,
                value: res?.data?.smanualstock.stockcategory,
            });
            await fetchMaterialNew(
                {
                    label: res?.data?.smanualstock.stocksubcategory,
                    value: res?.data?.smanualstock.stocksubcategory,
                },
                res?.data?.smanualstock.stockcategory
            );

            await fetchBranchDropdownsEdit(res?.data?.smanualstock?.company);
            await fetchUnitsEdit(res?.data?.smanualstock?.branch);
            await fetchFloorEdit(res?.data?.smanualstock?.branch);
            await fetchAreaEdit(
                res?.data?.smanualstock?.branch,
                res?.data?.smanualstock?.floor
            );
            await fetchAllLocationEdit(
                res?.data?.smanualstock?.branch,
                res?.data?.smanualstock?.floor,
                res?.data?.smanualstock?.area
            );
            if (
                res?.data?.smanualstock.vendorid !== "" &&
                res?.data?.smanualstock.vendorid !== undefined
            ) {
                let resv = await axios.get(
                    `${SERVICE.SINGLE_VENDORDETAILS}/${res?.data?.smanualstock.vendorid}`,
                    {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                    }
                );
                setVendorgetid(resv?.data?.svendordetails);
            }
            handleClickOpenviewalertvendormanualstock()
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };


    const [rowState, setRowstate] = useState()



    const HandleusedDialog = (row, requestmode) => {
        // console.log(row, requestmode, "row")
        const getcountqty = row.status == "Stock" ? row.balancedcount : row.balancedcountmanual
        setAvailQty(getcountqty)
        if (row.requestmode == "Asset Material" && row.status == "Stock") {
            getCodeAsset(row)
        }


        if (row.requestmode == "Stock Material" && row.status == "Stock") {
            getCodeStock(row)

        }

        if (row.requestmode == "Asset Material" && row.status == "Manual") {
            getCodeManualAsset(row)

        }
        if (row.requestmode == "Stock Material" && row.status == "Manual") {
            getCodeManualStock(row)

        }



        // row.balancedcount ? handleClickOpenviewalertvendorstock() : handleClickOpenviewalertvendormanual()

    }








    function handleChangeImageDragEdit(e) {
        setBtnUploadEdit(true); // Enable loader when the process starts
        const maxFileSize = 1 * 1024 * 1024; // 1MB in bytes

        // Get the selected file
        const file = e.dataTransfer.files[0];

        if (file && file.size < maxFileSize) {
            const path = URL.createObjectURL(file);
            const image = new Image();
            image.src = path;

            image.onload = async () => {
                try {
                    const detections = await faceapi
                        .detectAllFaces(image, new faceapi.TinyFaceDetectorOptions())
                        .withFaceLandmarks()
                        .withFaceDescriptors();

                    if (detections.length > 0) {
                        const faceDescriptor = detections[0].descriptor;

                        const response = await axios.post(
                            `${SERVICE.VENDORDUPLICATEFACEDETECTION}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${auth.APIToken}`,
                                },
                                faceDescriptor: Array.from(faceDescriptor),
                            }
                        );

                        if (response?.data?.matchfound) {
                            setPopupContentMalert("Image Already In Use!");
                            setPopupSeverityMalert("info");
                            handleClickOpenPopupMalert();
                        } else {

                            let newSelectedFilesDrag = [...refImageDragedit];

                            if (file.type.startsWith("image/")) {
                                const reader = new FileReader();
                                reader.onload = () => {
                                    newSelectedFilesDrag.push({
                                        name: file.name,
                                        size: file.size,
                                        type: file.type,
                                        preview: reader.result,
                                        base64: reader.result.split(",")[1],
                                    });
                                    setRefImageDragedit(newSelectedFilesDrag);
                                    const base64Data = reader.result.split(',')[1]; // Get base64 data (without the prefix)
                                    const binaryData = atob(base64Data); // Decode base64 data
                                    const arrayBuffer = new ArrayBuffer(binaryData.length);
                                    const uint8Array = new Uint8Array(arrayBuffer);

                                    // Fill the array buffer with the decoded binary data
                                    for (let i = 0; i < binaryData.length; i++) {
                                        uint8Array[i] = binaryData.charCodeAt(i);
                                    }

                                    // Create a Blob from the binary data
                                    const blob = new Blob([uint8Array], { type: 'image/png' });
                                    setImageDragEdit(blob);

                                };
                                reader.readAsDataURL(file);
                            } else {

                                setPopupContentMalert("Only Accept Images!");
                                setPopupSeverityMalert("info");
                                handleClickOpenPopupMalert();
                            }


                        }
                    } else {
                        setPopupContentMalert("No face detected!");
                        setPopupSeverityMalert("info");
                        handleClickOpenPopupMalert();
                    }
                } catch (error) {
                    setPopupContentMalert("Error in face detection!");
                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();
                } finally {
                    setBtnUploadEdit(false); // Disable loader when done
                }
            };

            image.onerror = (err) => {
                setPopupContentMalert("Error loading image!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
                setBtnUploadEdit(false); // Disable loader in case of error
            };

            setFileEdit(URL.createObjectURL(file));
        } else {
            if (file !== undefined) {
                setPopupContentMalert(
                    "File size is greater than 1MB, please upload a file below 1MB.!"
                );
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
                setBtnUploadEdit(false);
            }
        }
    }

    const handleDropedit = async (event) => {

        event.preventDefault();
        previewFileedit(event.dataTransfer.files[0]);
        const data = await handleChangeImageDragEdit(event)

    };




    // console.log(selectedRowsRequestPurchase, "selectedRowsRequestPurchase")

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

    const [cateCode, setCatCode] = useState([]);
    const [isBtn, setIsBtn] = useState(false);
    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        setOpenPopupMalert(true);
        setBtnSubmit(false);
        setIsBtn(false)
    };
    const handleClosePopupMalert = () => {
        setOpenPopupMalert(false);
        setIsBtn(false)
    };
    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupSeverity, setPopupSeverity] = useState("");
    const handleClickOpenPopup = () => {
        setOpenPopup(true);
        setBtnSubmit(false);
        setIsBtn(false)
    };
    const handleClosePopup = () => {
        setOpenPopup(false);
        setIsBtn(false)
    };

    const [vendorGroupOpt, setVendorGroupopt] = useState([]);
    const [vendorOverall, setVendorOverall] = useState([]);

    const [vendorGroup, setVendorGroup] = useState("Please Select Vendor Group");





    let exportColumnNames = [
        "Company",
        "Branch",
        "Unit",
        "Floor",
        "Area",
        "Location",
        "Material",
        "Date",
        "Time",
        "Expected Date",
        "Request Mode For",
        "Product Details",
        "Quantity",
        "Quantity & UOM",
    ];
    let exportRowValues = [
        "company",
        "branch",
        "unit",
        "floor",
        "area",
        "location",
        "materialmode",
        "requestdate",
        "requesttime",
        "duedate",
        "requestmode",
        "productdetailsnew",
        "quantitynew",
        "uomnew",
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
            pagename: String("Stock Purchase Request"),
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



    //  Datefield
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;

    const gridRef = useRef(null);

    const [vomMaster, setVomMaster] = useState({
        name: "",
    });
    const [vomMasterget, setVomMasterget] = useState([]);

    const [assetmaster, setAssetmaster] = useState([]);


    const [asset, setAsset] = useState({
        name: "",
        materialcode: "",
        assethead: "",
    });

    const [selectedassethead, setSelectedAssethead] = useState(
        "Please Select Assethead"
    );

    const [btnSubmit, setBtnSubmit] = useState(false);

    const handleAssetChange = (e) => {
        const selectedassethead = e.value;
        setSelectedAssethead(selectedassethead);
    };

    const [vendor, setVendor] = useState({
        vendorname: "",
        emailid: "",
        phonenumber: "",
        phonenumberone: "",
        phonenumbertwo: "",
        phonenumberthree: "",
        phonenumberfour: "",
        whatsappnumber: "",
        contactperson: "",
        address: "",
        country: "",
        state: "",
        city: "",
        pincode: "",
        gstnumber: "",
        creditdays: "",
        bankname: "Please Select Bank Name",
        bankbranchname: "",
        accountholdername: "",
        accountnumber: "",
        ifsccode: "",
        phonecheck: false,
        modeofpayments: "Please Select Mode of Payments",
        paymentfrequency: "Please Select Payment Frequency",
        monthlyfrequency: "",
        weeklyfrequency: "",
        vendorstatus: "",
        upinumber: "",
        chequenumber: "",
        cardnumber: "",
        cardholdername: "",
        cardtransactionnumber: "",
        cardtype: "Please Select Card Type",
        cardmonth: "Month",
        cardyear: "Year",
        cardsecuritycode: "",
    });

    const maxLength = 15;

    const [stock, setStock] = useState([]);


    const [stockmasterupdate, setStockmasterupdate] = useState({
        branch: "",
        unit: "",
        producthead: "",
        vendorname: "Please Select Vendor",
        gstno: "",
        totalbillamount: "",
        billno: "",
        requesttime: currtime,
        requestdate: today,
        productname: "",
        productdetails: "",
        warrantydetails: "",
        uom: "Please Select UOM",
        quantity: "",
        rate: "",
        billdate: "",
        files: "",
        warrantyfiles: "",
        warranty: "Yes",
        addedby: "",
        updatedby: "",
        requestmode: "Please Select Request Mode",
        stockcategory: "Please Select Stock Category",
        stocksubcategory: "Please Select Stock Sub Category",
        uomnew: "Please Select UOM",
        quantitynew: "",
        materialnew: "Please Select Material",
        productdetailsnew: "",
    });


    const handleChangephonenumber = (e) => {
        // const regex = /^[0-9]+$/;  // Only allows positive integers
        const regex = /^\d*\.?\d*$/;
        const inputValue = e.target.value;
        // Check if the input value matches the regex or if it's empty (allowing backspace)
        if (regex.test(inputValue) || inputValue === "") {
            // Update the state with the valid numeric value
            setStockmaster({ ...stockmaster, estimation: inputValue });
        }
    };

    const handleChangephonenumberupdate = (e) => {
        // const regex = /^[0-9]+$/;  // Only allows positive integers
        const regex = /^\d*\.?\d*$/;
        const inputValue = e.target.value;
        // Check if the input value matches the regex or if it's empty (allowing backspace)
        if (regex.test(inputValue) || inputValue === "") {
            // Update the state with the valid numeric value
            setStockmasterupdate({ ...stockmasterupdate, estimation: inputValue });
        }
    };


    const handleEstimationChange = (e) => {
        const { value } = e.target;
        setStockmaster({ ...stockmaster, estimationtime: value });
    };
    const handleEstimationChangeupdate = (e) => {
        const { value } = e.target;
        setStockmasterupdate({ ...stockmasterupdate, estimationtime: value });
    };


    const [uomOpt, setUomOpt] = useState([]);
    const [categoryOption, setCategoryOption] = useState([]);
    const [subcategoryOpt, setSubcategoryOption] = useState([]);
    const [materialOptNew, setMaterialoptNew] = useState([]);

    const [floorsEdit, setFloorEdit] = useState([]);
    const [areasEdit, setAreasEdit] = useState([]);
    const [locationsEdit, setLocationsEdit] = useState([
        { label: "ALL", value: "ALL" },
    ]);
    const [companysEdit, setCompanysEdit] = useState([]);



    const [branchsEdit, setBranchsEdit] = useState([]);

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
            // setCompanys(companyall);
            setCompanysEdit(companyall);
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
                    data.stockcategory === stockmaster.stockcategory &&
                    data.stocksubcategory === stockmaster.stocksubcategory
                );
            });

            setStockmaster((prev) => ({
                ...prev,
                uomnew: getdata[0].uom,
            }));
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

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
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };



    const [vendorgetid, setVendorgetid] = useState({});
    const [vendornameid, setVendornameid] = useState({});

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

    const [dateOption, setDateOption] = useState([])
    const [monthsOption, setMonthsOption] = useState([]);
    const [yearsOption, setYearsOption] = useState([]);

    const dayOptions = [
        { label: "Monday", value: "Monday" },
        { label: "Tuesday", value: "Tuesday" },
        { label: "Wednesday", value: "Wednesday" },
        { label: "Thursday", value: "Thursday" },
        { label: "Friday", value: "Friday" },
        { label: "Saturday", value: "Saturday" },
        { label: "Sunday", value: "Sunday" },
    ];
    //bank name options
    const accounttypes = [
        { value: "ALLAHABAD BANK", label: "ALLAHABAD BANK" },
        { value: "ANDHRA BANK", label: "ANDHRA BANK" },
        { value: "AXIS BANK", label: "AXIS BANK" },
        { value: "STATE BANK OF INDIA", label: "STATE BANK OF INDIA" },
        { value: "BANK OF BARODA", label: "BANK OF BARODA" },
        { value: "CITY UNION BANK", label: "CITY UNION BANK" },
        { value: "UCO BANK", label: "UCO BANK" },
        { value: "TMB BANK", label: "TMB BANK" },
        { value: "UNION BANK OF INDIA", label: "UNION BANK OF INDIA" },
        { value: "BANK OF INDIA", label: "BANK OF INDIA" },
        { value: "BANDHAN BANK LIMITED", label: "BANDHAN BANK LIMITED" },
        { value: "CANARA BANK", label: "CANARA BANK" },
        { value: "GRAMIN VIKASH BANK", label: "GRAMIN VIKASH BANK" },
        { value: "CORPORATION BANK", label: "CORPORATION BANK" },
        { value: "INDIAN BANK", label: "INDIAN BANK" },
        { value: "INDIAN OVERSEAS BANK", label: "INDIAN OVERSEAS BANK" },
        { value: "ORIENTAL BANK OF COMMERCE", label: "ORIENTAL BANK OF COMMERCE" },
        { value: "PUNJAB AND SIND BANK", label: "PUNJAB AND SIND BANK" },
        { value: "PUNJAB NATIONAL BANK", label: "PUNJAB NATIONAL BANK" },
        { value: "RESERVE BANK OF INDIA", label: "RESERVE BANK OF INDIA" },
        { value: "SOUTH INDIAN BANK", label: "SOUTH INDIAN BANK" },
        { value: "UNITED BANK OF INDIA", label: "UNITED BANK OF INDIA" },
        { value: "CENTRAL BANK OF INDIA", label: "CENTRAL BANK OF INDIA" },
        { value: "VIJAYA BANK", label: "VIJAYA BANK" },
        { value: "DENA BANK", label: "DENA BANK" },
        {
            value: "BHARATIYA MAHILA BANK LIMITED",
            label: "BHARATIYA MAHILA BANK LIMITED",
        },
        { value: "FEDERAL BANK LTD", label: "FEDERAL BANK LTD" },
        { value: "HDFC BANK LTD", label: "HDFC BANK LTD" },
        { value: "ICICI BANK LTD", label: "ICICI BANK LTD" },
        { value: "IDBI BANK LTD", label: "IDBI BANK LTD" },
        { value: "PAYTM BANK", label: "PAYTM BANK" },
        { value: "FINO PAYMENT BANK", label: "FINO PAYMENT BANK" },
        { value: "INDUSIND BANK LTD", label: "INDUSIND BANK LTD" },
        { value: "KARNATAKA BANK LTD", label: "KARNATAKA BANK LTD" },
        { value: "KOTAK MAHINDRA BANK", label: "KOTAK MAHINDRA BANK" },
        { value: "YES BANK LTD", label: "YES BANK LTD" },
        { value: "SYNDICATE BANK", label: "SYNDICATE BANK" },
        { value: "BANK OF MAHARASHTRA", label: "BANK OF MAHARASHTRA" },
        { value: "DCB BANK", label: "DCB BANK" },
        { value: "IDFC BANK", label: "IDFC BANK" },
        {
            value: "JAMMU AND KASHMIR BANK BANK",
            label: "JAMMU AND KASHMIR BANK BANK",
        },
        { value: "KARUR VYSYA BANK", label: "KARUR VYSYA BANK" },
        { value: "RBL BANK", label: "RBL BANK" },
        { value: "DHANLAXMI BANK", label: "DHANLAXMI BANK" },
        { value: "CSB BANK", label: "CSB BANK" },
    ];

    const cardtypes = [
        { value: "Credit Card", label: "Credit Card" },
        { value: "Debit Card", label: "Debit Card" },
        { value: "Visa Card", label: "Visa Card" },
        { value: "Master Card", label: "Master Card" },
    ];

    const handleMobile = (e) => {
        if (e.length > 10) {
            setPopupContentMalert("Mobile number can't more than 10 characters!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
            let num = e.slice(0, 10);
            setVendor({ ...vendor, phonenumber: num });
        }
    };
    const handlewhatsapp = (e) => {
        if (e.length > 10) {
            setPopupContentMalert("Whats app number can't more than 10 characters!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
            let num = e.slice(0, 10);
            setVendor({ ...vendor, whatsappnumber: num });
        }
    };
    const getPhoneNumber = () => {
        if (vendor.phonecheck) {
            setVendor({ ...vendor, whatsappnumber: vendor.phonenumber });
        } else {
            setVendor({ ...vendor, whatsappnumber: "" });
        }
    };

    useEffect(() => {
        getPhoneNumber();
    }, [vendor.phonecheck, vendor.phonenumber]);

    const [modeofpay, setmodeofpay] = useState([]);

    //submit option for saving
    const handlemodeofpay = () => {
        if (modeofpay.includes(vendor.modeofpayments === "Please Select Mode of Payments")) {
            setPopupContentMalert("Please Select Mode of Payments");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (modeofpay.includes(vendor.modeofpayments)) {
            setPopupContentMalert("ToDo is Already Added!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            setmodeofpay([...modeofpay, vendor.modeofpayments]);
        }
    };

    const deleteTodo = (index) => {
        setmodeofpay(
            modeofpay.filter((data) => {
                return data !== index;
            })
        );
        switch (index) {
            case "Bank Transfer":
                setVendor({
                    ...vendor,
                    bankname: "Please Select Bank Name",
                    bankbranchname: "",
                    accountholdername: "",
                    accountnumber: "",
                    ifsccode: "",
                });
                break;
            case "UPI":
                setVendor({ ...vendor, upinumber: "" });
                break;
            case "Cheque":
                setVendor({ ...vendor, chequenumber: "" });
                break;
            case "Card":
                setVendor({
                    ...vendor,
                    cardnumber: "",
                    cardholdername: "",
                    cardtransactionnumber: "",
                    cardtype: "Please Select Card Type",
                    cardmonth: "Month",
                    cardyear: "Year",
                    cardsecuritycode: "",
                });
                break;
        }
    };




    //Bill upload create

    const [getImg, setGetImg] = useState(null);
    const [refImage, setRefImage] = useState([]);
    const [previewURL, setPreviewURL] = useState(null);
    const [file, setFile] = useState();

    // Upload Popup
    const [uploadPopupOpen, setUploadPopupOpen] = useState(false);
    const handleClickUploadPopupOpen = () => {
        setUploadPopupOpen(true);
    };
    const handleUploadPopupClose = () => {
        setUploadPopupOpen(false);
    };

    //first allexcel....
    const getFileIcon = (fileName) => {
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

    //reference images
    const handleInputChange = (event) => {
        const files = event.target.files;
        let newSelectedFiles = [...refImage];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            // Check if the file is an image
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = () => {
                    newSelectedFiles.push({
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        preview: reader.result,
                        base64: reader.result.split(",")[1],
                    });
                    setRefImage(newSelectedFiles);
                };
                reader.readAsDataURL(file);
            } else {
                setPopupContentMalert("Only Accept Images!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
        }
    };

    //first deletefile
    const handleDeleteFile = (index) => {
        const newSelectedFiles = [...refImage];
        newSelectedFiles.splice(index, 1);
        setRefImage(newSelectedFiles);
    };

    const renderFilePreview = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };

    const resetImage = () => {
        setGetImg("");
        setFile("");
        setRefImage([]);
        setPreviewURL(null);
    };

    const handleUploadOverAll = () => {
        setUploadPopupOpen(false);
    };

    const previewFile = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewURL(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    // upload warranty

    const [getImgwarranty, setGetImgwarranty] = useState(null);
    const [refImagewarranty, setRefImagewarranty] = useState([]);
    const [previewURLwarranty, setPreviewURLwarranty] = useState(null);
    const [valNumwarranty, setValNumwarranty] = useState(0);
    const [filewarranty, setFilewarranty] = useState();

    // Upload Popup
    const [uploadPopupOpenwarranty, setUploadPopupOpenwarranty] = useState(false);
    const handleClickUploadPopupOpenwarranty = () => {
        setUploadPopupOpenwarranty(true);
    };
    const handleUploadPopupClosewarranty = () => {
        setUploadPopupOpenwarranty(false);
        // setGetImgwarranty("");
        // setFilewarranty("");
        // setPreviewURLwarranty(null);
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

    //reference images
    const handleInputChangewarranty = (event) => {
        const files = event.target.files;
        let newSelectedFiles = [...refImagewarranty];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            // Check if the file is an image
            if (file.type.startsWith("image/")) {
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
                setPopupContentMalert("Only Accept Images!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
        }
    };

    //first deletefile
    const handleDeleteFilewarranty = (index) => {
        const newSelectedFiles = [...refImagewarranty];
        newSelectedFiles.splice(index, 1);
        setRefImagewarranty(newSelectedFiles);
    };

    const renderFilePreviewwarranty = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };

    const resetImagewarranty = () => {
        setGetImgwarranty("");
        setFilewarranty("");
        setRefImagewarranty([]);
        setPreviewURLwarranty(null);
    };

    const handleUploadOverAllwarranty = () => {
        setUploadPopupOpenwarranty(false);
    };

    const previewFilewarranty = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewURLwarranty(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    //warraty upload edit

    const [getImgwarrantyedit, setGetImgwarrantyedit] = useState(null);
    const [refImagewarrantyedit, setRefImagewarrantyedit] = useState([]);
    const [previewURLwarrantyedit, setPreviewURLwarrantyedit] = useState(null);
    const [valNumwarrantyedit, setValNumwarrantyedit] = useState(0);
    const [filewarrantyedit, setFilewarrantyedit] = useState();

    // Upload Popup
    const [uploadPopupOpenwarrantyedit, setUploadPopupOpenwarrantyedit] =
        useState(false);
    const handleClickUploadPopupOpenwarrantyedit = () => {
        setUploadPopupOpenwarrantyedit(true);
    };
    const handleUploadPopupClosewarrantyedit = () => {
        setUploadPopupOpenwarrantyedit(false);
        setGetImgwarrantyedit("");
        setFilewarrantyedit("");
        setPreviewURLwarrantyedit(null);
    };

    //first allexcel....
    const getFileIconwarrantyedit = (fileName) => {
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

    //reference images
    const handleInputChangewarrantyedit = (event) => {
        const files = event.target.files;
        let newSelectedFiles = [...refImagewarrantyedit];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            // Check if the file is an image
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = () => {
                    newSelectedFiles.push({
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        preview: reader.result,
                        base64: reader.result.split(",")[1],
                    });
                    setRefImagewarrantyedit(newSelectedFiles);
                };
                reader.readAsDataURL(file);
            } else {
                setPopupContentMalert("Only Accept Images!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
        }
    };

    //first deletefile
    const handleDeleteFilewarrantyedit = (index) => {
        const newSelectedFiles = [...refImagewarrantyedit];
        newSelectedFiles.splice(index, 1);
        setRefImagewarrantyedit(newSelectedFiles);
    };

    const renderFilePreviewwarrantyedit = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };

    const resetImagewarrantyedit = () => {
        setGetImgwarrantyedit("");
        setFilewarrantyedit("");
        setRefImagewarrantyedit([]);
        setPreviewURLwarrantyedit(null);
    };

    const handleUploadOverAllwarrantyedit = () => {
        setUploadPopupOpenwarrantyedit(false);
    };

    const previewFilewarrantyedit = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewURLwarrantyedit(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };


    //bill upload edit

    const [getImgedit, setGetImgedit] = useState(null);
    const [refImageedit, setRefImageedit] = useState([]);
    const [previewURLedit, setPreviewURLedit] = useState(null);
    const [valNumedit, setValNumedit] = useState(0);
    const [fileedit, setFileedit] = useState();
    const [stdCode, setStdCode] = useState();

    const handlechangestdcode = (e) => {
        const regex = /^[0-9]+$/;
        const inputValue = e.target.value?.slice(0, 4);
        if (regex.test(inputValue) || inputValue === "") {
            setStdCode(inputValue);
        }
    };

    const modeofpayments = [
        { value: "Cash", label: "Cash" },
        { value: "Bank Transfer", label: "Bank Transfer" },
        { value: "UPI", label: "UPI" },
        { value: "Card", label: "Card" },
        { value: "Cheque", label: "Cheque" },
    ];

    // Upload Popup
    const [uploadPopupOpenedit, setUploadPopupOpenedit] = useState(false);
    const handleClickUploadPopupOpenedit = () => {
        setUploadPopupOpenedit(true);
    };
    const handleUploadPopupCloseedit = () => {
        setUploadPopupOpenedit(false);
        setGetImgedit("");
        setFileedit("");
        setPreviewURLedit(null);
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



    //reference images
    const handleInputChangeedit = (event) => {
        try {

            const files = event.target.files;
            let newSelectedFiles = [...refImageedit];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                // Check if the file is an image
                if (file.type.startsWith("image/")) {
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
                    setPopupContentMalert("Only Accept Images!");
                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();
                }
            }

        } catch (err) {
            console.log(err, "image")
        }
    };

    //first deletefile
    const handleDeleteFileedit = (index) => {
        const newSelectedFiles = [...refImageedit];
        newSelectedFiles.splice(index, 1);
        setRefImageedit(newSelectedFiles);
    };

    const renderFilePreviewedit = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
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

    const previewFileedit = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewURLedit(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };


    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowsstock, setSelectedRowsstock] = useState([]);
    const [vendormaster, setVendormaster] = useState([]);
    const [branches, setBranches] = useState([]);
    const [users, setUsers] = useState([]);
    const [teamstabledata, setTeamstableData] = useState([]);
    const [account, setAccount] = useState([]);

    const [units, setUnits] = useState([]);

    const [selectedBranch, setSelectedBranch] = useState("Please Select Branch");
    const [selectedBranchedit, setSelectedBranchedit] = useState(
        "Please Select Branch"
    );
    const [selectedUnit, setSelectedUnit] = useState("Please Select Unit");
    const [selectedUnitedit, setSelectedUnitedit] =
        useState("Please Select Unit");

    const [selectedProducthead, setSelectedProducthead] = useState(
        "Please Select Producthead"
    );
    const [selectedAssetType, setSelectedAssetType] = useState(
        ""
    );
    const [selectedProductheadedit, setSelectedProductheadedit] = useState(
        "Please Select Producthead"
    );
    const [selectedProductname, setSelectedProductname] = useState(
        "Please Select Productname"
    );
    const [selectedProductnameedit, setSelectedProductnameedit] = useState(
        "Please Select Productname"
    );

    const [filteredUnit, setFilteredUnit] = useState([]);
    const [filteredUnitEdit, setFilteredUnitEdit] = useState([]);

    const [filteredProductname, setFilteredProductname] = useState([]);
    const [filteredProductnameEdit, setFilteredProductnameEdit] = useState([]);

    const [searchQueryManage, setSearchQueryManage] = useState("");

    //  Datefield
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;


    const [stockmanagemasteredit, setStockmanagemasteredit] = useState({
        branch: "",
        unit: "",
        producthead: "",
        productname: "",
        productdetails: "",
        uom: "Please Select UOM",
        quantity: "",
    });

    // const handleVendorChange = (e) => {
    //     const selectedvendorname = e.value;
    //     setSelectedVendorname(selectedvendorname);
    // };

    //alert model for vendor details
    const [openviewalertvendor, setOpenviewalertvendro] = useState(false);
    // view model
    const handleClickOpenviewalertvendor = () => {
        setOpenviewalertvendro(true);
    };

    const handleCloseviewalertvendor = () => {
        setOpenviewalertvendro(false);
    };

    //alert model for Uom details
    const [openviewalertUom, setOpenviewalertUom] = useState(false);
    // view model
    const handleClickOpenviewalertUom = () => {
        setOpenviewalertUom(true);
    };

    const handleCloseviewalertUom = () => {
        setOpenviewalertUom(false);
    };

    //alert model for Asset details
    const [openviewalertAsset, setOpenviewalertAsset] = useState(false);
    // view model
    const handleClickOpenviewalertAsset = () => {
        setOpenviewalertAsset(true);
    };

    const handleCloseviewalertAsset = () => {
        setOpenviewalertAsset(false);
    };

    const [projEdit, setProjedit] = useState({
        name: "",
    });

    const {
        isUserRoleCompare,
        allProjects, pageName, setPageName,
        isUserRoleAccess,
        isAssignBranch,
        allCompany,
        allBranch,
        allUnit,
        allTeam, buttonStyles
    } = useContext(UserRoleAccessContext);
    // const accessbranch = isAssignBranch
    //   ?.map((data) => ({
    //     branch: data.branch,
    //     company: data.company,
    //     unit: data.unit,
    //   }))
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


    const { auth, setAuth } = useContext(AuthContext);
    const [projectCheck, setProjectCheck] = useState(false);

    const handleBranchChange = (e) => {
        const selectedBranch = e.value;
        setSelectedBranch(selectedBranch);
        setSelectedUnit("Please Select Unit");
    };

    const handleProductChange = (e) => {
        const selectedProducthead = e.value;
        setSelectedProducthead(selectedProducthead);
        setSelectedProductname("Please Select Productname");
    };

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();

    const [openview, setOpenview] = useState(false);
    const [openInfo, setOpeninfo] = useState(false);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteproject, setDeleteproject] = useState({});
    const [isEditOpen, setIsEditOpen] = useState(false);


    //Edit model...
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
        setStockmasteredit({
            vendorname: "Please Select Vendor",
            gstno: "",
            billno: "",
            productdetails: "",
            warrantydetails: "",
            uom: "",
            quantity: "",
            warranty: "",
            rate: "",
            billdate: "",
            files: "",
            warrantyfiles: "",
        });
        setSelectedBranch("Please Select Branch");
        setSelectedUnit("Please Select Unit");
        setSelectedProducthead("Please Select Assethead");
        setSelectedProductname("Please Select Materila Name");
        setVendorgetid({ gstnumber: "" });
    };



    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const [checkvendor, setCheckvendor] = useState();
    const [checkcategory, setCheckcategory] = useState();
    const [checksubcategory, setChecksubcategory] = useState();
    const [checktimepoints, setChecktimepoints] = useState();

    const [copiedData, setCopiedData] = useState("");

    //image


    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "StockRequest_Purchase.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRowsRequestPurchase(newSelection.selectionModel);
    };
    const handleSelectionChangestock = (newSelection) => {
        setSelectedRowsstock(newSelection.selectionModel);
    };

    // Error Popup model

    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
        setBtnSubmit(false);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    // view model
    const handleClickOpenview = () => {
        setOpenview(true);
    };

    const handleCloseview = () => {
        setOpenview(false);
    };

    const [openstock, setOpenstock] = useState(false);
    const handleClickOpenstock = () => {
        setOpenstock(true);
    };

    const handleClosestock = () => {
        setOpenstock(false);
    };

    //update stock

    const [openstockupdate, setOpenstockupdate] = useState(false);
    const handleClickOpenstockupdate = () => {
        if (selectedRowsRequestPurchase.length == 0) {
            setIsDeleteOpenalert(true);
        } else {
            setOpenstockupdate(true);
        }
    };

    const handleClosestockupdate = () => {
        setOpenstockupdate(false);
        setStockmasterupdate({
            ...stockmasterupdate,
            gstno: "",
            billno: "",
            productname: "",
            productdetails: "",
            warrantydetails: "",
            quantity: "",
            rate: "",
            billdate: "",
            warrantyfiles: "",
            addedby: "",
            updatedby: "",
        });

        setVendorgetid({});
        setRefImageedit([]);
        setRefImage([]);
        setFile("");
        setGetImg(null);
        setGetImgedit(null);
        setRefImagewarranty([]);
        setRefImagewarrantyedit([]);
        setFilewarranty("");
        setGetImgwarranty(null);
        setFilewarrantyedit("");
        setGetImgwarrantyedit(null);
        setBtnSubmit(false);
    };

    //check delete model
    const [isCheckOpen, setisCheckOpen] = useState(false);
    const handleClickOpenCheck = () => {
        setisCheckOpen(true);
    };
    const handleCloseCheck = () => {
        setisCheckOpen(false);
    };

    // info model
    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };

    const handleCloseinfo = () => {
        setOpeninfo(false);
        setVendorgetid({});
    };

    //Delete model
    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = () => {
        setIsDeleteOpen(false);
    };

    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

    const handleClickOpenalert = () => {
        if (selectedRowsRequestPurchase.length == 0) {
            setIsDeleteOpenalert(true);
        } else {
            setIsDeleteOpencheckbox(true);
        }
    };
    const handleCloseModalert = () => {
        setIsDeleteOpenalert(false);
    };

    //Delete model
    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

    const handleClickOpencheckbox = () => {
        setIsDeleteOpencheckbox(true);
    };
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
    };

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };
    const classes = useStyles();

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

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    const getRowClassName = (params) => {
        if (selectedRowsRequestPurchase.includes(params.data.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        company: true,
        materialmode: true,
        requesttime: true,
        requestdate: true,
        material: true,
        materialnew: true,
        duedate: true,
        branch: true,
        unit: true,
        floor: true,
        area: true,
        location: true,
        requestmode: true,
        productdetails: true,
        uom: true,
        quantity: true,
        uomnew: true,
        quantitynew: true,
        productdetailsnew: true,
        actions: true,
        actionsverify: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );

    const fetchVendor = async () => {
        try {
            let res_vendor = await axios.get(SERVICE.ALL_VENDORDETAILS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const vendorall = [
                ...res_vendor?.data?.vendordetails.map((d) => ({
                    ...d,
                    label: d.vendorname,
                    value: d.vendorname,
                })),
            ];
            setVendormaster(vendorall);
            setCatCode(res_vendor?.data?.vendordetails);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const fetchVendorAutoId = async () => {
        try {
            let res_vendor = await axios.get(SERVICE.ALL_VENDORDETAILS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setCatCode(res_vendor?.data?.vendordetails);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    useEffect(() => {
        fetchVendorAutoId()
    }, [])

    const fetchVendorGroup = async () => {
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

        setVendormaster(final);
        setStockmaster({ ...stockmaster, vendorname: "Please Select Vendor", })

    };

    //set function to get particular row
    const rowData = async (id) => {
        try {
            let res = await axios.get(`${SERVICE.STOCKMANAGE_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDeleteproject(res?.data?.sstockmanage);
            handleClickOpen();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    // Alert delete popup
    let projectid = deleteproject._id;
    const delProject = async () => {
        try {
            await axios.delete(`${SERVICE.STOCKMANAGE_SINGLE}/${projectid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            await fetchStock("Filtered");
            handleCloseMod();
            setSelectedRowsRequestPurchase([]);
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setPage(1);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const delProjectcheckbox = async () => {
        try {
            const deletePromises = selectedRowsRequestPurchase?.map((item) => {
                return axios.delete(`${SERVICE.STOCKMANAGE_SINGLE}/${item._id}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
            });

            // Wait for all delete requests to complete
            await Promise.all(deletePromises);

            await fetchStock("Filtered");
            handleCloseModcheckbox();
            setSelectedRowsRequestPurchase([]);
            setSelectAllChecked(false);
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setPage(1);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    //add function
    const sendRequest = async () => {
        setPageName(!pageName)
        try {
            let stockcreate = await axios.post(SERVICE.STOCKPURCHASE_CREATE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                unit: String(selectedUnit),
                branch: String(selectedBranch),
                company: String(stockmaster.company),
                location: String(stockmaster.location),
                area: String(stockmaster.area),
                requesttime: String(stockmaster.requesttime),
                requestdate: String(stockmaster.requestdate),
                floor: String(stockmaster.floor),
                component: String(stockmaster.component),
                warranty: String(stockmaster.warranty),
                estimation: String(stockmaster.estimation),
                estimationtime: String(stockmaster.estimationtime)
                    ? stockmaster.estimationtime
                    : "Days",
                assettype: selectedAssetType,
                producthead: String(
                    selectedProducthead === "Please Select Assethead"
                        ? ""
                        : selectedProducthead
                ),

                vendor: String(stockmaster.vendorname),
                vendorgroup: String(vendorGroup),
                vendorid: String(vendornameid),
                gstno: String(
                    vendorgetid.gstnumber === undefined ? "" : vendorgetid.gstnumber
                ),
                billno: Number(stockmaster.billno),

                productname: String(
                    selectedProductname === "Please Select Material"
                        ? ""
                        : selectedProductname
                ),

                productdetails: String(stockmaster.productdetails),
                warrantydetails: String(stockmaster.warrantydetails),
                uom: String(
                    stockmaster.uom === "Please Select UOM" ? "" : stockmaster.uom
                ),
                quantity: Number(stockmaster.quantity),
                rate: Number(stockmaster.rate),
                billdate: String(stockmaster.billdate),
                files: [...refImageedit],
                warrantyfiles: [...refImagewarrantyedit],

                requestmode: String(stockmaster.requestmode),
                stockcategory:
                    stockmaster.stockcategory === "Please Select Stock Category"
                        ? ""
                        : String(stockmaster.stockcategory),
                stocksubcategory:
                    stockmaster.stocksubcategory === "Please Select Stock Sub Category"
                        ? ""
                        : String(stockmaster.stocksubcategory),
                stockmaterialarray: stockArray,
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            let res = await axios.put(`${SERVICE.STOCKMANAGE_SINGLE}/${filterid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                updating: String("updated"),
            });

            setStockmaster(stockcreate.data);
            await fetchStock("Filtered");
            setStockmaster({
                ...stockmaster,
                gstno: "",
                billno: "",
                productname: "",
                productdetails: "",
                warrantydetails: "",
                quantity: "",
                rate: "",
                billdate: "",
                warrantyfiles: "",
                addedby: "",
                updatedby: "",
            });

            setVendorgetid({});
            setRefImage([]);
            setFile("");
            setGetImg(null);
            setRefImagewarranty([]);
            setFilewarranty("");
            setGetImgwarranty(null);
            setBtnSubmit(false);
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            handleClosestock();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    // console.log(stockmaster.vendorname, "vendorname")

    const sendRequestUpdate = async () => {
        setPageName(!pageName)
        try {
            selectedRowsRequestPurchase.map((item) =>
                axios.post(SERVICE.STOCKPURCHASE_CREATE, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    company: String(item.company),
                    branch: String(item.branch),
                    unit: String(item.unit),
                    floor: String(item.floor),
                    location: String(item.location),
                    area: String(item.area),
                    requesttime: String(stockmasterupdate.requesttime),
                    requestdate: String(stockmasterupdate.requestdate),
                    component: String(item.component),
                    warranty: String(stockmasterupdate.warranty),
                    estimation: String(stockmasterupdate.estimation),
                    estimationtime: String(stockmasterupdate.estimationtime)
                        ? stockmasterupdate.estimationtime
                        : "Days",
                    assettype: item.assettype,
                    producthead: item.asset,

                    vendor: String(stockmaster.vendorname),
                    vendorgroup: String(vendorGroup),
                    vendorid: String(vendornameid),
                    gstno: String(
                        vendorgetid.gstnumber === undefined ? "" : vendorgetid.gstnumber
                    ),
                    billno: Number(stockmasterupdate.billno),

                    productname: item.material,

                    productdetails: String(item.productdetails),
                    warrantydetails: String(stockmasterupdate.warrantydetails),
                    uom: item.uom,
                    quantity: item.quantity,
                    rate: Number(stockmasterupdate.rate),
                    billdate: String(stockmasterupdate.billdate),
                    files: [...refImageedit],
                    warrantyfiles: [...refImagewarrantyedit],
                    totalbillamount: (totalQuantity) * (stockmasterupdate.rate),
                    duedate: item.duedate,
                    requestmode: String(item.requestmode),
                    stockcategory: item.stockcategory,
                    stocksubcategory: item.stocksubcategory,
                    stockmaterialarray: item.stockmaterialarray,

                    addedby: [
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                })
            )
            selectedRowsRequestPurchase.map(async (item) => {
                let res = await axios.put(`${SERVICE.STOCKMANAGE_SINGLE}/${item._id}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    updating: String("updated"),
                })
            }
            )

            await fetchStock("Filtered");
            setStockmasterupdate({
                ...stockmasterupdate,
                gstno: "",
                billno: "",
                productname: "",
                productdetails: "",
                warrantydetails: "",
                quantity: "",
                rate: "",
                billdate: "",
                warrantyfiles: "",
                addedby: "",
                updatedby: "",
            });

            setVendorgetid({});
            setRefImageedit([]);
            setRefImage([]);
            setFile("");
            setGetImg(null);
            setGetImgedit(null);
            setRefImagewarranty([]);
            setRefImagewarrantyedit([]);
            setFilewarranty("");
            setGetImgwarranty(null);
            setFilewarrantyedit("");
            setGetImgwarrantyedit(null);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const handleSubmitUpdate = async (e) => {
        e.preventDefault();
        setBtnSubmit(true);

        let res = await axios.post(SERVICE.BILLNO_DUPLICATIION, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            billno: stockmasterupdate.billno
        })

        const isBillMatch = res.data.stock > 0

        if (stockmasterupdate.requestdate === "") {
            setPopupContentMalert("Please Select Date");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (stockmasterupdate.requesttime === "") {
            setPopupContentMalert("Please Select Time");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }

        if (stockmasterupdate.warranty === "" || stockmasterupdate.warranty === undefined) {
            setPopupContentMalert("Please Select Warranty");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (stockmasterupdate.warranty == "Yes" && (stockmasterupdate.estimation === "" || stockmasterupdate.estimation === undefined)) {
            setPopupContentMalert("Please Enter Warranty Time");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (stockmasterupdate.warranty == "Yes" && (stockmasterupdate.estimationtime === "" || stockmasterupdate.estimationtime === undefined)) {
            setPopupContentMalert("Please select Estimation");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        // else if (
        //   stockmasterupdate.quantity === "" ||
        //   stockmasterupdate.quantity === undefined
        // ) {
        //   setPopupContentMalert("Please Enter Quantity!");
        //   setPopupSeverityMalert("info");
        //   handleClickOpenPopupMalert();
        // }
        else if (vendorGroup === "Please Select Vendor Group") {
            setPopupContentMalert("Please Select Vendor Group!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            stockmaster.vendorname === "" ||
            stockmaster.vendorname === "Please Select Vendor" ||
            stockmaster.vendorname === undefined
        ) {
            setPopupContentMalert("Please Select Vendor!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else if (
            stockmasterupdate.billno === "" ||
            stockmasterupdate.billno === undefined
        ) {
            setPopupContentMalert("Please Enter Bill No!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            isBillMatch
        ) {
            setPopupContentMalert(" Bill No Already Added!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            stockmasterupdate.warranty === "Yes" &&
            stockmasterupdate.warrantydetails === "" ||
            stockmasterupdate.warrantydetails === undefined
        ) {
            setPopupContentMalert("Please Enter Warranty Details!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (stockmasterupdate.rate === "" || stockmasterupdate.rate === undefined) {
            setPopupContentMalert("Please Enter Rate!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            stockmasterupdate.billdate === "" ||
            stockmasterupdate.billdate === undefined
        ) {
            setPopupContentMalert("Please Select Bill Date!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (refImageedit.length == 0) {
            setPopupContentMalert("Please Upload Bill!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendRequestUpdate();
        }


    };

    //submit option for saving
    const handleSubmit = async (e) => {
        e.preventDefault();
        setBtnSubmit(true);
        let res = await axios.post(SERVICE.BILLNO_DUPLICATIION, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            billno: stockmaster.billno
        })

        const isBillMatch = res.data.stock > 0

        if (stockmaster.requestmode === "Asset Material") {
            if (
                stockmaster.company === "" ||
                stockmaster.company === "Please Select Company"
            ) {
                setPopupContentMalert("Please Select Company!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else if (
                selectedBranch === "" ||
                selectedBranch == "Please Select Branch"
            ) {
                setPopupContentMalert("Please Select Branch!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else if (selectedUnit === "" || selectedUnit == "Please Select Unit") {
                setPopupContentMalert("Please Select Unit!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else if (
                stockmaster.floor === "" ||
                stockmaster.floor === "Please Select Floor"
            ) {
                setPopupContentMalert("Please Select Floor!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else if (
                stockmaster.area === "" ||
                stockmaster.area === "Please Select Area"
            ) {
                setPopupContentMalert("Please Select Area!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else if (
                stockmaster.location === "" ||
                stockmaster.location === "Please Select Location"
            ) {
                setPopupContentMalert("Please Select Location!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (stockmaster.warranty === "" || stockmaster.warranty === undefined) {
                setPopupContentMalert("Please Select Warranty");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (stockmaster.warranty == "Yes" && (stockmaster.estimation === "" || stockmaster.estimation === undefined)) {
                setPopupContentMalert("Please Enter Warranty Time");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (stockmaster.warranty == "Yes" && (stockmaster.estimationtime === "" || stockmaster.estimationtime === undefined)) {
                setPopupContentMalert("Please select Estimation");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (
                selectedProducthead === "" ||
                selectedProducthead == "Please Select Producthead"
            ) {
                setPopupContentMalert("Please Select Product Head!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else if (
                selectedProductname === "" ||
                selectedProductname == "Please Select Productname"
            ) {
                setPopupContentMalert("Please Select Product Name!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else if (
                stockmaster.productdetails === "" ||
                stockmaster.productdetails === undefined
            ) {
                setPopupContentMalert("Please Enter Product Details!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else if (
                stockmaster.uom === "" ||
                stockmaster.uom === "Please Select UOM"
            ) {
                setPopupContentMalert("Please Select UOM!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else if (
                stockmaster.quantity === "" ||
                stockmaster.quantity === undefined
            ) {
                setPopupContentMalert("Please Enter Quantity!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (vendorGroup === "Please Select Vendor Group") {
                setPopupContentMalert("Please Select Vendor Group!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (
                stockmaster.vendorname === "" ||
                stockmaster.vendorname === "Please Select Vendor" ||
                stockmaster.vendorname === undefined
            ) {
                setPopupContentMalert("Please Select Vendor!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }

            else if (
                stockmaster.billno === "" ||
                stockmaster.billno === undefined
            ) {
                setPopupContentMalert("Please Enter Bill No!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }

            else if (
                isBillMatch
            ) {
                setPopupContentMalert(" Bill No Already Added!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (
                stockmaster.warranty === "Yes" &&
                (stockmaster.warrantydetails === "" ||
                    stockmaster.warrantydetails === undefined)
            ) {
                setPopupContentMalert("Please Enter Warranty Details!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else if (stockmaster.rate === "" || stockmaster.rate === undefined) {
                setPopupContentMalert("Please Enter Rate!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else if (
                stockmaster.billdate === "" ||
                stockmaster.billdate === undefined
            ) {
                setPopupContentMalert("Please Select Bill Date!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else if (refImage.length == 0) {
                setPopupContentMalert("Please Upload Bill!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else {
                sendRequest();
            }
        } else {
            if (
                stockmaster.company === "" ||
                stockmaster.company === "Please Select Company"
            ) {
                setPopupContentMalert("Please Select Company!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else if (
                selectedBranch === "" ||
                selectedBranch == "Please Select Branch"
            ) {
                setPopupContentMalert("Please Select Branch!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else if (selectedUnit === "" || selectedUnit == "Please Select Unit") {
                setPopupContentMalert("Please Select Unit!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else if (
                stockmaster.floor === "" ||
                stockmaster.floor === "Please Select Floor"
            ) {
                setPopupContentMalert("Please Select Floor!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else if (
                stockmaster.area === "" ||
                stockmaster.area === "Please Select Area"
            ) {
                setPopupContentMalert("Please Select Area!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else if (
                stockmaster.location === "" ||
                stockmaster.location === "Please Select Location"
            ) {
                setPopupContentMalert("Please Select Location!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (stockmaster.warranty === "" || stockmaster.warranty === undefined) {
                setPopupContentMalert("Please Select Warranty");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (stockmaster.warranty == "Yes" && (stockmaster.estimation === "" || stockmaster.estimation === undefined)) {
                setPopupContentMalert("Please Enter Warranty Time");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (stockmaster.warranty == "Yes" && (stockmaster.estimationtime === "" || stockmaster.estimationtime === undefined)) {
                setPopupContentMalert("Please select Estimation");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (
                stockmaster.stockcategory === "" ||
                stockmaster.stockcategory === "Please Select Stock Category"
            ) {
                setPopupContentMalert("Please Select Stock Category!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else if (
                stockmaster.stocksubcategory === "" ||
                stockmaster.stocksubcategory === "Please Select Stock Sub Category"
            ) {
                setPopupContentMalert("Please Select Stock Sub Category!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else if (stockArray.length === 0) {
                setPopupContentMalert("To Do List is Missing!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            // else if (stockmaster.uomnew === "" || stockmaster.uomnew === "Please Select UOM") {
            //     setShowAlert(
            //         <>
            //             <ErrorOutlineOutlinedIcon
            //                 sx={{ fontSize: "100px", color: "orange" }}
            //             />
            //             <p style={{ fontSize: "20px", fontWeight: 900 }}>
            //                 {"UOM is Empty!"}
            //             </p>
            //         </>
            //     );
            //     handleClickOpenerr();
            // }
            // else if (stockmaster.quantitynew === "" || stockmaster.quantitynew === undefined) {
            //     setShowAlert(
            //         <>
            //             <ErrorOutlineOutlinedIcon
            //                 sx={{ fontSize: "100px", color: "orange" }}
            //             />
            //             <p style={{ fontSize: "20px", fontWeight: 900 }}>
            //                 {"Please Enter Quantity"}
            //             </p>
            //         </>
            //     );
            //     handleClickOpenerr();
            // }
            // else if (stockmaster.productdetailsnew === "" || stockmaster.productdetailsnew === undefined) {
            //     setShowAlert(
            //         <>
            //             <ErrorOutlineOutlinedIcon
            //                 sx={{ fontSize: "100px", color: "orange" }}
            //             />
            //             <p style={{ fontSize: "20px", fontWeight: 900 }}>
            //                 {"Please Enter Product Details"}
            //             </p>
            //         </>
            //     );
            //     handleClickOpenerr();
            // }
            else if (vendorGroup === "Please Select Vendor Group") {
                setPopupContentMalert("Please Select Vendor Group!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (
                stockmaster.vendorname === "" ||
                stockmaster.vendorname === "Please Select Vendor" ||
                stockmaster.vendorname === undefined
            ) {
                setPopupContentMalert("Please Select Vendor!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else if (
                stockmaster.billno === "" ||
                stockmaster.billno === undefined
            ) {
                setPopupContentMalert("Please Enter Bill No!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (
                isBillMatch
            ) {
                setPopupContentMalert(" Bill No Already Added!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (
                stockmaster.warranty === "Yes" &&
                (stockmaster.warrantydetails === "" ||
                    stockmaster.warrantydetails === undefined)
            ) {
                setPopupContentMalert("Please Enter Warranty Details!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else if (stockmaster.rate === "" || stockmaster.rate === undefined) {
                setPopupContentMalert("Please Enter Rate!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else if (
                stockmaster.billdate === "" ||
                stockmaster.billdate === undefined
            ) {
                setPopupContentMalert("Please Select Bill Date!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            //  else if (refImage.length == 0) {
            //   setPopupContentMalert("Please Upload Bill!");
            //   setPopupSeverityMalert("info");
            //   handleClickOpenPopupMalert();
            // }
            else {
                sendRequest();
            }
        }
    };

    const handleclear = (e) => {
        e.preventDefault();

        setStockmaster({
            ...stockmaster,
            company: "Please Select Company",
            branch: "",
            floor: "Please Select floor",
            area: "Please Select Area",
            location: "Please Select Location",
            unit: "",
            vendorname: "Please Select Vendor",
            gstno: "",
            billno: "",
            warrantydetails: "",
            rate: "",
            billdate: "",
            files: "",
            warrantyfiles: "",
            addedby: "",
            updatedby: "",
        });
        setStockmasterupdate({
            ...stockmasterupdate,
            company: "Please Select Company",
            branch: "",
            floor: "Please Select floor",
            area: "Please Select Area",
            location: "Please Select Location",
            unit: "",
            vendorname: "Please Select Vendor",
            gstno: "",
            billno: "",
            warrantydetails: "",
            rate: "",
            billdate: "",
            files: "",
            requesttime: currtime,
            requestdate: today,
            warrantyfiles: "",
            Warranty: "Yes",
        });
        setVendorGroup("Please Select Vendor Group")
        setSelectedBranch("Please Select Branch");
        setSelectedUnit("Please Select Unit");
        // setSelectedProducthead("Please Select Producthead");
        // setSelectedProductname("Please Select Productname");
        setFile("");
        setRefImage([]);
        setGetImg(null);
        setVendorgetid({ gstnumber: "" });
        setVendormaster([])
        setBranches([]);
        setAreasEdit([]);
        setFloorEdit([]);
        setLocationsEdit([{ label: "ALL", value: "ALL" }]);
        setMaterialoptNew([]);
        setSubcategoryOption([]);
        setVendorgetid({});
        setRefImageedit([]);
        setRefImage([]);
        setFile("");
        setGetImg(null);
        setGetImgedit(null);
        setRefImagewarranty([]);
        setRefImagewarrantyedit([]);
        setFilewarranty("");
        setGetImgwarranty(null);
        setFilewarrantyedit("");
        setGetImgwarrantyedit(null);
        setBtnSubmit(false);
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };
    // vendro details create
    //add function
    const sendRequestvendor = async () => {
        let filtered = Array.from(new Set(modeofpay));
        try {
            let addVendorDetails = await axios.post(SERVICE.ADD_VENDORDETAILS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                vendorid: String(newval),
                vendorname: String(vendor.vendorname),
                emailid: String(vendor.emailid),
                phonenumber: Number(vendor.phonenumber),
                phonenumberone: Number(vendor.phonenumberone),
                phonenumbertwo: Number(vendor.phonenumbertwo),
                phonenumberthree: Number(vendor.phonenumberthree),
                phonenumberfour: Number(vendor.phonenumberfour),
                whatsappnumber: Number(vendor.whatsappnumber),
                phonecheck: Boolean(vendor.phonecheck),
                contactperson: String(vendor.contactperson),
                address: String(vendor.address),
                country: String(
                    selectedCountryp?.name == undefined ? "" : selectedCountryp?.name
                ),
                state: String(
                    selectedStatep?.name == undefined ? "" : selectedStatep?.name
                ),
                city: String(
                    selectedCityp?.name == undefined ? "" : selectedCityp?.name
                ),
                pincode: Number(vendor.pincode),
                gstnumber: String(vendor.gstnumber),
                landline: String(stdCode && lanNumber ? `${stdCode}${lanNumber}` : ""),
                creditdays: Number(vendor.creditdays),
                modeofpayments: [...filtered],

                paymentfrequency: String(vendor.paymentfrequency === "Please Select Payment Frequency" ? "" : vendor.paymentfrequency),
                vendorstatus: String(vendor.vendorstatus),
                monthlyfrequency: String(vendor.paymentfrequency === "Monthly" ? vendor.monthlyfrequency : ""),
                weeklyfrequency: String(vendor.paymentfrequency === "Weekly" ? vendor.weeklyfrequency : ""),

                bankname: filtered.includes("Bank Transfer")
                    ? String(vendor.bankname)
                    : "",
                bankbranchname: filtered.includes("Bank Transfer")
                    ? String(vendor.bankbranchname)
                    : "",
                accountholdername: filtered.includes("Bank Transfer")
                    ? String(vendor.accountholdername)
                    : "",
                accountnumber: filtered.includes("Bank Transfer")
                    ? String(vendor.accountnumber)
                    : "",
                ifsccode: filtered.includes("Bank Transfer")
                    ? String(vendor.ifsccode)
                    : "",

                upinumber: filtered.includes("UPI") ? String(vendor.upinumber) : "",

                cardnumber: filtered.includes("Card") ? String(vendor.cardnumber) : "",
                cardholdername: filtered.includes("Card")
                    ? String(vendor.cardholdername)
                    : "",
                cardtransactionnumber: filtered.includes("Card")
                    ? String(vendor.cardtransactionnumber)
                    : "",
                cardtype: filtered.includes("Card") ? String(vendor.cardtype) : "",
                cardmonth: filtered.includes("Card") ? String(vendor.cardmonth) : "",
                cardyear: filtered.includes("Card") ? String(vendor.cardyear) : "",
                cardsecuritycode: filtered.includes("Card")
                    ? String(vendor.cardsecuritycode)
                    : "",

                faceDescriptor:
                    vendor?.faceDescriptor?.length > 0
                        ? vendor?.faceDescriptor
                        : [],

                // files: allUploadedFiles.concat(refImage, refImageDrag, capturedImages),

                chequenumber: filtered.includes("Cheque")
                    ? String(vendor.chequenumber)
                    : "",

                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            handleClickVendorgrpOpen(vendor.vendorname);
            await fetchVendor();


            setVendor({
                // vendorname: "",
                emailid: "",
                phonenumber: "",
                whatsappnumber: "",
                contactperson: "",
                address: "",
                gstnumber: "",
                bankname: "Please Select Bank Name",
                accountname: "",
                accountnumber: "",
                ifsccode: "",
                phonecheck: false,
            });

        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    //valid email verification
    const validateEmail = (email) => {
        const regex = /\S+@\S+\.\S+/;
        return regex.test(email);
    };

    const updateVendor = async () => {
        if (vendorgroup.vendorgroupname === "") {
            setPopupContentMalert("Please Enter VendorGroup Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            let addvend = await axios.post(
                SERVICE.ADD_VENDORGROUPING,
                {
                    vendor: String(vendorGrpOpen.data),
                    name: String(vendorgroup.vendorgroupname),
                    addedby: [
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            handleCloseviewalertvendor();
            handleClickVendorgrpClose();
            await fetchVendor();
            await fetchVendorGroup();
            setVendor({
                ...vendor,
                vendorname: "",
                emailid: "",
                phonenumber: "",
                phonenumberone: "",
                phonenumbertwo: "",
                phonenumberthree: "",
                phonenumberfour: "",
                whatsappnumber: "",
                contactperson: "",
                address: "",
                country: "",
                state: "",
                city: "",
                pincode: "",
                gstnumber: "",
                creditdays: "",
                bankbranchname: "",
                accountholdername: "",
                accountnumber: "",
                ifsccode: "",
                upinumber: "",
                cardnumber: "",
                cardholdername: "",
                cardtransactionnumber: "",
                cardsecuritycode: "",
                chequenumber: "",
                phonecheck: false,
            });
            setStockmaster({
                ...stockmaster,
                vendorname: "Please Select Vendor",

            });
            setVendormaster([])
            setmodeofpay([]);
            setStdCode("");
            setLanNumber("");
            const country = Country.getAllCountries().find(
                (country) => country.name === "India"
            );
            const state = State.getStatesOfCountry(country?.isoCode).find(
                (state) => state.name === "Tamil Nadu"
            );
            const city = City.getCitiesOfState(
                state?.countryCode,
                state?.isoCode
            ).find((city) => city.name === "Tiruchirappalli");
            setSelectedCountryp(country);
            setSelectedStatep(state);
            setSelectedCityp(city);
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setRefImage([]);
            // setRefImageDrag([]);
            // setCapturedImages([]);
            setIsBtn(false);
        }

    }


    //submit option for saving
    const handleSubmitvendor = (e) => {
        setIsBtn(true)
        e.preventDefault();
        const isNameMatch = vendormaster.some(
            (item) =>
                item.vendorname.toLowerCase() === vendor.vendorname.toLowerCase()
        );
        if (vendor.vendorname === "") {
            setPopupContentMalert("Please Enter Vendor Name!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        // else if (!validateEmail(vendor.emailid)) {
        //   setPopupContentMalert("Please Enter Valid Email Id!");
        //   setPopupSeverityMalert("info");
        //   handleClickOpenPopupMalert();
        // } 
        else if (vendor.address === "") {
            setPopupContentMalert("Please Enter Address!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedCountryp?.isoCode !== selectedStatep?.countryCode) {
            setPopupContentMalert("Please Select The Correct State!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            selectedCountryp?.isoCode !== selectedCityp?.countryCode ||
            selectedStatep?.isoCode !== selectedCityp?.stateCode
        ) {
            setPopupContentMalert("Please Select The Correct City!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (vendor.vendorstatus === "") {
            setPopupContentMalert("Please Select Status!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (vendor.paymentfrequency === "Please Select Payment Frequency") {
            setPopupContentMalert("Please Select Payment Frequency!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            vendor.paymentfrequency === "Monthly" && (vendor.monthlyfrequency === "" || !vendor.monthlyfrequency)
        ) {
            setPopupContentMalert("Please Select Monthly Date!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            vendor.paymentfrequency === "Weekly" && (vendor.weeklyfrequency === "" || !vendor.weeklyfrequency)
        ) {
            setPopupContentMalert("Please Select Weekly Day!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (vendor.modeofpayments === "Please Select Mode of Payments") {
            setPopupContentMalert("Please Select Mode of Payments!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            modeofpay.includes("Bank Transfer") &&
            vendor.bankname === "Please Select Bank Name"
        ) {
            setPopupContentMalert("Please Select Bank Name!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            modeofpay.includes("Bank Transfer") &&
            vendor.bankbranchname === ""
        ) {
            setPopupContentMalert("Please Enter Bank Branch Name!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            modeofpay.includes("Bank Transfer") &&
            vendor.accountholdername === ""
        ) {
            setPopupContentMalert("Please Enter Account Holder Name!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            modeofpay.includes("Bank Transfer") &&
            vendor.accountnumber === ""
        ) {
            setPopupContentMalert("Please Enter Account Number!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (modeofpay.includes("Bank Transfer") && vendor.ifsccode === "") {
            setPopupContentMalert("Please Enter IFSC Code!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (modeofpay.includes("UPI") && vendor.upinumber === "") {
            setPopupContentMalert("Please Enter UPI Number!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (modeofpay.includes("Card") && vendor.cardnumber === "") {
            setPopupContentMalert("Please Enter Card Number!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (modeofpay.includes("Card") && vendor.cardholdername === "") {
            setPopupContentMalert("Please Enter Card Holder Name!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            modeofpay.includes("Card") &&
            vendor.cardtransactionnumber === ""
        ) {
            setPopupContentMalert("Please Enter Card Transaction Number!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            modeofpay.includes("Card") &&
            vendor.cardtype === "Please Select Card Type"
        ) {
            setPopupContentMalert("Please Select Card Type!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (modeofpay.includes("Card") && vendor.cardmonth === "Month") {
            setPopupContentMalert("Please Select Expire Month!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (modeofpay.includes("Card") && vendor.cardyear === "Year") {
            setPopupContentMalert("Please Select Expire Year!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (modeofpay.includes("Card") && vendor.cardsecuritycode === "") {
            setPopupContentMalert("Please Enter Card Security Code!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (modeofpay.includes("Cheque") && vendor.chequenumber === "") {
            setPopupContentMalert("Please Enter Cheque Number!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (modeofpay.length === 0) {
            setPopupContentMalert("Please Insert Mode of Payments!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (isNameMatch) {
            setPopupContentMalert("Data Already exist!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendRequestvendor();
        }
    };
    const handleClearvendor = (e) => {
        e.preventDefault();
        setVendor({
            vendorname: "",
            emailid: "",
            phonenumber: "",
            whatsappnumber: "",
            contactperson: "",
            address: "",
            gstnumber: "",
            bankname: "Please Select Bank Name",
            accountname: "",
            accountnumber: "",
            ifsccode: "",
            phonecheck: false,
        });
    };

    //post call for UOM
    //add function
    const sendRequestuom = async () => {
        setPageName(!pageName)
        try {
            let vomnamecreate = await axios.post(SERVICE.CREATE_VOMMASTERNAME, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                name: String(vomMaster.name),
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            setVomMaster(vomnamecreate.data);
            await fetchUom();
            // await fetchVomMaster();
            setVomMaster({ name: "" });
            handleCloseviewalertUom();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    //submit option for saving
    const handleSubmituom = (e) => {
        e.preventDefault();

        const isNameMatch = vomMasterget?.some(
            (item) => item.name?.toLowerCase() === vomMaster.name?.toLowerCase()
        );
        if (vomMaster.name === "") {
            setPopupContentMalert("Please Enter VOM Master Name!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (isNameMatch) {
            setPopupContentMalert("VOM Master Name already exits!!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            sendRequestuom();
        }
    };

    const handleclearuom = (e) => {
        e.preventDefault();
        setVomMaster({ name: "" });
    };

    //post call for asset material

    //add function
    const sendRequestasset = async () => {
        setPageName(!pageName)
        try {
            let subprojectscreate = await axios.post(SERVICE.ASSET_CREATE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                assethead: selectedassethead,
                name: String(asset.name),
                materialcode: String(asset.materialcode),
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchAsset();
            setAsset(subprojectscreate.data);
            setAsset({ ...asset, name: "", materialcode: "" });
            handleCloseviewalertAsset();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    //submit option for saving
    const handleSubmitasset = (e) => {
        e.preventDefault();

        // const isNameMatch = assetmaster?.some(item => item?.name?.toLowerCase() === (asset.name)?.toLowerCase() && item.assethead === selectedassethead);
        // const isCodeMatch = assetmaster?.some(item => item?.headcode?.toLowerCase() === (asset.headcode)?.toLowerCase() && item.name?.toLowerCase() === (asset.name)?.toLowerCase() && item?.assethead === selectedassethead);
        const isNameMatch = assetmaster?.some(
            (item) =>
                item?.name?.toLowerCase() === asset.name?.toLowerCase() &&
                item.assethead === selectedassethead
        );
        const isCodeMatch = assetmaster?.some(
            (item) =>
                item?.materialcode?.toLowerCase() ===
                asset.materialcode?.toLowerCase() &&
                item.assethead === selectedassethead
        );

        if (
            selectedassethead === "" ||
            selectedassethead == "Please Select Assethead"
        ) {
            setPopupContentMalert("Please Select Assethead!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (asset.materialcode === "") {
            setPopupContentMalert("Please Enter Material Code!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (asset.name === "") {
            setPopupContentMalert("Please Enter Material Name!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (isNameMatch) {
            setPopupContentMalert("Name already exits!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (isCodeMatch) {
            setPopupContentMalert("Code already exits!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            sendRequestasset();
        }
    };
    const handleClearasset = (e) => {
        e.preventDefault();
        setSelectedAssethead("Please Select Assethead");
        setAsset({ materialcode: "", name: "" });
    };


    const [filterid, setFilterid] = useState("");
    //get single row to edit....




    //Project updateby edit page...
    let updateby = stockmanagemasteredit?.updatedby;
    let addedby = stockmanagemasteredit?.addedby;

    let maintenanceid = stockmanagemasteredit?._id;

    const fetchbranches = async (e) => {
        try {
            let res_branchunit = await axios.get(SERVICE.BRANCH, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let filtered = res_branchunit?.data?.branch.filter((data) => {
                return data.company === e;
            });
            const branchall = filtered.map((d) => ({
                label: d.name,
                value: d.name,
            }));
            setBranches(branchall);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    // get all units
    const fetchUnits = async () => {
        try {
            let res_unit = await axios.get(SERVICE.UNIT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const unitall = [
                ...res_unit?.data?.units.map((d) => ({
                    ...d,
                    label: d.name,
                    value: d.name,
                })),
            ];
            setUnits(unitall);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    //fetching departments whole list
    const fetchAccount = async () => {
        try {
            let teams = await axios.get(SERVICE.ACCOUNTHEAD, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const deptall = [
                ...teams?.data?.accounthead.map((d) => ({
                    ...d,
                    label: d.headname,
                    value: d.headname,
                })),
            ];
            setAccount(deptall);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const fetchAsset = async () => {
        try {
            let res_vendor = await axios.get(SERVICE.ASSETS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const deptall = [
                ...res_vendor?.data?.assetmaterial.map((d) => ({
                    ...d,
                    label: d.name,
                    value: d.name,
                })),
            ];
            setAssetmaster(deptall);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    //get all project.
    const fetchUom = async () => {
        try {
            let res_project = await axios.get(SERVICE.ALL_VOMMASTERNAME, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            const deptall = [
                ...res_project?.data?.vommaster.map((d) => ({
                    ...d,
                    label: d.name,
                    value: d.name,
                })),
            ];
            setVomMasterget(deptall);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };


    const fetchStock = async (e, searchQuery) => {
        setPageName(!pageName)
        setProjectCheck(true);
        const queryParams = {
            page: Number(page),
            pageSize: Number(pageSize),
            assignbranch: accessbranch,
            company: valueCompanyCat,
            branch: valueBranchCat,
            unit: valueUnitCat,
            requestmode: valueRequestMode,
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
            if (e === "Filtered") {
                let res_employee = await axios.post(SERVICE.STOCK_FILTER_ACCESS_VERIFICATION, queryParams, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });

                const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []

                // let filteredData = ans.filter((data) => {
                //   return data.requestmode === "Asset Material";
                // });

                let res_project_1 = await axios.get(SERVICE.ALL_VOMMASTERNAME, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });

                let codeValues = res_project_1?.data?.vommaster.map((data) => ({
                    name: data.name,
                    code: data?.code,
                }));
                // setuomcodes(codeValues);

                let setData = ans.map((item) => {
                    const matchingItem = codeValues.find(
                        (item1) => item.uom === item1.name
                    );

                    const matchingItem1 = codeValues.find(
                        (item1) => item.uomnew === item1.name
                    );

                    if (matchingItem) {
                        return { ...item, uomcode: matchingItem.code };
                    } else if (matchingItem1) {
                        return { ...item, uomcode: matchingItem1.code };
                    } else {
                        return { ...item };
                    }
                });

                // const itemsWithSerialNumber = setData?.map((item, index) => ({
                //   ...item,
                //   serialNumber: (page - 1) * pageSize + index + 1,
                // }));

                const itemsWithSerialNumber = setData?.map((item, index) => {
                    if (item.requestmode === "Stock Material") {


                        let quantityNew = item.stockmaterialarray.reduce((total, person) => total + Number(person.quantitynew), 0);

                        let materialNew = item.stockmaterialarray.map((data, newindex) => data.materialnew);

                        let productdetailsNew = item.stockmaterialarray.map((data, newindex) => data.productdetailsnew);

                        let quantityAndUom = item.stockmaterialarray.map((data, newindex) => {
                            return `${data.quantitynew}#${data.uomcodenew}`;
                        });

                        const nonEmptyParts = productdetailsNew.filter(
                            (part) => part.trim() !== ""
                        );
                        const result = nonEmptyParts.join(",");

                        return {
                            ...item,
                            id: item._id,
                            serialNumber: (page - 1) * pageSize + index + 1,
                            company: item.company,
                            requestdate: moment(item.requestdate).format("DD/MM/YYYY"),
                            requesttime: item.requesttime,
                            expecttdate: moment(item.expecttdate).format("DD/MM/YYYY"),
                            expecttime: item.expecttime,
                            branch: item.branch,
                            unit: item.unit,
                            floor: item.floor,
                            area: item.area,
                            location: item.location,
                            requestmode: item.requestmode,

                            // uomnew: quantityAndUom.join(","),
                            uomnew: quantityAndUom.filter(item => item.trim() !== "").join(","),
                            // quantitynew: quantityNew.join(","),
                            quantitynew: quantityNew,

                            materialnew: materialNew[0],

                            // productdetailsnew:
                            //   item.stockmaterialarray.length > 0
                            //     ? productdetailsNew.join(",")
                            //     : "",
                            productdetailsnew:
                                // productdetailsNew.join(",")
                                productdetailsNew.filter(item => item.trim() !== "").join(",")
                        };
                    } else {
                        return {
                            ...item,
                            id: item._id,
                            serialNumber: (page - 1) * pageSize + index + 1,
                            company: item.company,
                            branch: item.branch,
                            unit: item.unit,
                            floor: item.floor,
                            area: item.area,
                            location: item.location,
                            requestmode: item.requestmode,
                            requestdate: moment(item.requestdate).format("DD/MM/YYYY"),
                            // expecttdate: moment(item.expecttdate).format("DD/MM/YYYY"),
                            // expecttime: item.expecttime,
                            requesttime: item.requesttime,
                            productdetailsnew: item.productdetails,
                            uomnew: `${item.quantity}#${item.uomcode}`,
                            quantitynew: item.quantity,
                        };
                    }
                });


                let final = itemsWithSerialNumber.map((item, index) => {
                    return {
                        ...item,

                        materialmode: item.requestmode === "Asset Material" ? item.material : item.materialnew,
                        duedate: moment(item.duedate).format("DD/MM/YYYY"),

                    }
                })

                // console.log(itemsWithSerialNumber, "itemsWithSerialNumber")
                setStockmanage(final);






                setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
                setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
                setPageSize((data) => { return ans?.length > 0 ? data : 10 });
                setPage((data) => { return ans?.length > 0 ? data : 1 });
                setProjectCheck(false);
            } else {
                setProjectCheck(false)
            }
        }

        catch (err) {
            setProjectCheck(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

        }

    }

    const [stockExcel, setStockExcel] = useState([])

    const fetchStockExcel = async (e, searchQuery) => {
        setPageName(!pageName)
        setProjectCheck(true);
        const queryParams = {
            page: Number(page),
            pageSize: Number(pageSize),
            assignbranch: accessbranch,
            company: valueCompanyCat,
            branch: valueBranchCat,
            unit: valueUnitCat,
            requestmode: valueRequestMode,
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

            let res_employee = await axios.post(SERVICE.STOCK_FILTER_ACCESS_VERIFICATION, queryParams, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []

            // let filteredData = ans.filter((data) => {
            //   return data.requestmode === "Asset Material";
            // });

            let res_project_1 = await axios.get(SERVICE.ALL_VOMMASTERNAME, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let codeValues = res_project_1?.data?.vommaster.map((data) => ({
                name: data.name,
                code: data?.code,
            }));
            // setuomcodes(codeValues);

            let setData = ans.map((item) => {
                const matchingItem = codeValues.find(
                    (item1) => item.uom === item1.name
                );

                const matchingItem1 = codeValues.find(
                    (item1) => item.uomnew === item1.name
                );

                if (matchingItem) {
                    return { ...item, uomcode: matchingItem.code };
                } else if (matchingItem1) {
                    return { ...item, uomcode: matchingItem1.code };
                } else {
                    return { ...item };
                }
            });

            // const itemsWithSerialNumber = setData?.map((item, index) => ({
            //   ...item,
            //   serialNumber: (page - 1) * pageSize + index + 1,
            // }));

            const itemsWithSerialNumber = setData?.map((item, index) => {
                if (item.requestmode === "Stock Material") {


                    let quantityNew = item.stockmaterialarray.reduce((total, person) => total + Number(person.quantitynew), 0);

                    let materialNew = item.stockmaterialarray.map((data, newindex) => data.materialnew);

                    let productdetailsNew = item.stockmaterialarray.map((data, newindex) => data.productdetailsnew);

                    let quantityAndUom = item.stockmaterialarray.map((data, newindex) => {
                        return `${data.quantitynew}#${data.uomcodenew}`;
                    });

                    const nonEmptyParts = productdetailsNew.filter(
                        (part) => part.trim() !== ""
                    );
                    const result = nonEmptyParts.join(",");

                    return {
                        ...item,
                        id: item._id,
                        serialNumber: (page - 1) * pageSize + index + 1,
                        company: item.company,
                        requestdate: moment(item.requestdate).format("DD/MM/YYYY"),
                        requesttime: item.requesttime,
                        expecttdate: moment(item.expecttdate).format("DD/MM/YYYY"),
                        expecttime: item.expecttime,
                        branch: item.branch,
                        unit: item.unit,
                        floor: item.floor,
                        area: item.area,
                        location: item.location,
                        requestmode: item.requestmode,

                        // uomnew: quantityAndUom.join(","),
                        uomnew: quantityAndUom.filter(item => item.trim() !== "").join(","),
                        // quantitynew: quantityNew.join(","),
                        quantitynew: quantityNew,

                        materialnew: materialNew[0],

                        // productdetailsnew:
                        //   item.stockmaterialarray.length > 0
                        //     ? productdetailsNew.join(",")
                        //     : "",
                        productdetailsnew:
                            // productdetailsNew.join(",")
                            productdetailsNew.filter(item => item.trim() !== "").join(",")
                    };
                } else {
                    return {
                        ...item,
                        id: item._id,
                        serialNumber: (page - 1) * pageSize + index + 1,
                        company: item.company,
                        branch: item.branch,
                        unit: item.unit,
                        floor: item.floor,
                        area: item.area,
                        location: item.location,
                        requestmode: item.requestmode,
                        requestdate: moment(item.requestdate).format("DD/MM/YYYY"),
                        // expecttdate: moment(item.expecttdate).format("DD/MM/YYYY"),
                        // expecttime: item.expecttime,
                        requesttime: item.requesttime,
                        productdetailsnew: item.productdetails,
                        uomnew: `${item.quantity}#${item.uomcode}`,
                        quantitynew: item.quantity,
                    };
                }
            });


            let final = itemsWithSerialNumber.map((item, index) => {
                return {
                    ...item,

                    materialmode: item.requestmode === "Asset Material" ? item.material : item.materialnew,
                    duedate: moment(item.duedate).format("DD/MM/YYYY"),

                }
            })

            // console.log(itemsWithSerialNumber, "itemsWithSerialNumber")
            setStockExcel(final);






            setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
            setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
            setPageSize((data) => { return ans?.length > 0 ? data : 10 });
            setPage((data) => { return ans?.length > 0 ? data : 1 });
            setProjectCheck(false);
        }


        catch (err) {
            setProjectCheck(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

        }

    }


    useEffect(() => {
        if (items?.length > 0) {
            fetchStock("Filtered", searchQuery);
        }
    }, [page, pageSize, searchQuery]);

    useEffect(() => {

        fetchStockExcel();

    }, []);



    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Stock Request to Purchase",
        pageStyle: "print",
    });

    // serial no for listing items
    const addSerialNumber = (datas) => {
        // const itemsWithSerialNumber = datas?.map((item, index) => {
        //   if (item.requestmode === "Stock Material") {


        //     let quantityNew = item.stockmaterialarray.reduce((total, person) => total + Number(person.quantitynew), 0);

        //     let materialNew = item.stockmaterialarray.map((data, newindex) => {
        //       return ` ${data.materialnew}`;
        //     });

        //     let productdetailsNew = item.stockmaterialarray.map((data, newindex) => {
        //       return ` ${data.productdetailsnew}`;
        //     });

        //     let quantityAndUom = item.stockmaterialarray.map((data, newindex) => {
        //       return ` ${data.quantitynew}#${data.uomcodenew}`;
        //     });

        //     const nonEmptyParts = productdetailsNew.filter(
        //       (part) => part.trim() !== ""
        //     );
        //     const result = nonEmptyParts.join(",");

        //     return {
        //       id: item._id,
        //       serialNumber: index + 1,
        //       company: item.company,
        //       branch: item.branch,
        //       unit: item.unit,
        //       floor: item.floor,
        //       area: item.area,
        //       location: item.location,
        //       requestmode: item.requestmode,

        //       // uomnew: quantityAndUom.join(","),
        //       uomnew: quantityAndUom.filter(item => item.trim() !== "").join(","),
        //       // quantitynew: quantityNew.join(","),
        //       quantitynew: quantityNew,

        //       // materialnew: materialNew.join(',').toString(),
        //       // productdetailsnew:
        //       //   item.stockmaterialarray.length > 0
        //       //     ? productdetailsNew.join(",")
        //       //     : "",
        //       productdetailsnew:
        //         // productdetailsNew.join(",")
        //         productdetailsNew.filter(item => item.trim() !== "").join(",")
        //     };
        //   } else {
        //     return {
        //       id: item._id,
        //       serialNumber: index + 1,
        //       company: item.company,
        //       branch: item.branch,
        //       unit: item.unit,
        //       floor: item.floor,
        //       area: item.area,
        //       location: item.location,
        //       requestmode: item.requestmode,

        //       productdetailsnew: item.productdetails,
        //       uomnew: `${item.quantity}#${item.uomcode}`,
        //       quantitynew: item.quantity,
        //     };
        //   }
        // });

        setItems(datas);
    };

    useEffect(() => {
        addSerialNumber(stockmanages);
    }, [stockmanages]);

    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSelectedRowsRequestPurchase([]);
        setSelectAllChecked(false);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setSelectedRowsRequestPurchase([]);
        setSelectAllChecked(false);
        setPage(1);
    };

    //datatable....
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setFilterValue(event.target.value);
        setPage(1);
        fetchStock("Filtered", event.target.value)
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


    useEffect(() => {
        fetchUom();
        // fetchStock();
        fetchAccount();
        fetchAsset();
        fetchCategoryAll();
        // fetchVendor();
        // fetchUnits();
        fetchVendorGroup();
        // fetchVomMaster();
        // fetchCompanyDropdowns();
    }, []);

    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    const [selectAllChecked, setSelectAllChecked] = useState(false);

    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
        </div>
    );

    const [selectAllCheckedstock, setSelectAllCheckedstock] = useState(false);

    const CheckboxHeaderstock = ({ selectAllCheckedstock, onSelectAllstock }) => (
        <div>
            <Checkbox checked={selectAllCheckedstock} onChange={onSelectAllstock} />
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
            headerName: "SNo",
            flex: 0,
            width: 100,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
            pinned: "left",
            lockPinned: true,
        },
        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 120,
            hide: !columnVisibility.company,
            headerClassName: "bold-header",
            pinned: "left",
            lockPinned: true,
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 120,
            hide: !columnVisibility.branch,
            headerClassName: "bold-header",
            pinned: "left",
            lockPinned: true,
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 120,
            hide: !columnVisibility.unit,
            headerClassName: "bold-header",
        },
        {
            field: "floor",
            headerName: "Floor",
            flex: 0,
            width: 120,
            hide: !columnVisibility.floor,
            headerClassName: "bold-header",
        },
        {
            field: "area",
            headerName: "Area",
            flex: 0,
            width: 120,
            hide: !columnVisibility.area,
            headerClassName: "bold-header",
        },
        {
            field: "location",
            headerName: "Location",
            flex: 0,
            width: 120,
            hide: !columnVisibility.location,
            headerClassName: "bold-header",
        },
        {
            field: "materialmode",
            headerName: "Material",
            flex: 0,
            width: 120,
            hide: !columnVisibility.materialmode,
            headerClassName: "bold-header",
        },

        {
            field: "requestdate",
            headerName: "Date",
            flex: 0,
            width: 180,
            hide: !columnVisibility.requestdate,
            headerClassName: "bold-header",
        },
        {
            field: "requesttime",
            headerName: "Time",
            flex: 0,
            width: 100,
            hide: !columnVisibility.requesttime,
            headerClassName: "bold-header",
        },
        {
            field: "duedate",
            headerName: "Expected Date",
            flex: 0,
            width: 180,
            hide: !columnVisibility.duedate,
            headerClassName: "bold-header",
        },

        {
            field: "requestmode",
            headerName: "Request Mode For",
            flex: 0,
            width: 120,
            hide: !columnVisibility.requestmode,
            headerClassName: "bold-header",
        },

        {
            field: "productdetailsnew",
            headerName: "Product Details",
            flex: 0,
            width: 120,
            hide: !columnVisibility.productdetailsnew,
            headerClassName: "bold-header",
        },

        {
            field: "quantitynew",
            headerName: "Quantity",
            flex: 0,
            width: 120,
            hide: !columnVisibility.quantitynew,
            headerClassName: "bold-header",
        },
        {
            field: "uomnew",
            headerName: "Quantity & UOM",
            flex: 0,
            width: 200,
            hide: !columnVisibility.uomnew,
            headerClassName: "bold-header",
        },
        {
            field: "actionsverify",
            headerName: "Verify",
            flex: 0,
            width: 150,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() =>
                            getStockBalanceCount
                                (
                                    params.data,
                                )
                        }
                    >
                        Verify
                    </Button>
                </Grid>
            ),
        },

    ];
    const filteredSelectedColumn = columnDataTable.filter(data => data.field !== 'checkbox' && data.field !== "actions" && data.field !== "serialNumber");

    const rowDataTable = items.map((item, index) => {
        return {
            ...item,
            id: item.id,
            serialNumber: item.serialNumber,
            company: item.company,
            branch: item.branch,
            requesttime: item.requesttime,
            requestdate: item.requestdate,
            unit: item.unit,
            floor: item.floor,
            area: item.area,
            location: item.location,
            requestmode: item.requestmode,
            duedate: item.duedate,
            materialmode: item.materialmode,
            productdetailsnew: item.productdetailsnew,
            uomnew: item.uomnew,
            quantitynew: item.quantitynew,
        };
    });
    // console.log(rowDataTable, "rowDataTable")

    const rowsWithCheckboxes = rowDataTable.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRowsRequestPurchase.includes(row.id),
    }));

    // Show All Columns functionality
    const handleShowAllColumns = () => {
        const updatedVisibility = { ...columnVisibility };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibility(updatedVisibility);
    };

    // // Function to filter columns based on search query
    const filteredColumns = columnDataTable.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
    );

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    const columnMoveRef = useRef(0);
    const columnMoveLimit = 3; // Limit for column moves
    const handleColumnMoved = useCallback(debounce((event) => {
        if (!event.columnApi) return;

        const visible_columns = event.columnApi.getAllColumns().filter(col => {
            const colState = event.columnApi.getColumnState().find(state => state.colId === col.colId);
            return colState && !colState.hide;
        }).map(col => col.colId);

        setColumnVisibility((prevVisibility) => {
            const updatedVisibility = { ...prevVisibility };

            // Ensure columns that are visible stay visible
            Object.keys(updatedVisibility).forEach(colId => {
                updatedVisibility[colId] = visible_columns.includes(colId);
            });

            return updatedVisibility;
        });
    }, 300), []);

    const handleColumnVisible = useCallback((event) => {
        const colId = event.column.getColId();

        // Update visibility based on event, but only when explicitly triggered by grid
        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [colId]: event.visible, // Set visibility directly from the event
        }));
    }, []);

    // new code for toggle based on the remove columns
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
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );

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

    const handleResetSearch = async (e) => {
        setProjectCheck(true);

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
            company: valueCompanyCat,
            branch: valueBranchCat,
            unit: valueUnitCat,
            requestmode: valueRequestMode,
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
            // let res_project = await axios.get(SERVICE.STOCKMANAGE, {
            let res_employee = await axios.post(SERVICE.STOCK_FILTER_ACCESS_VERIFICATION, queryParams, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []

            // let filteredData = ans.filter((data) => {
            //   return data.requestmode === "Asset Material";
            // });

            let res_project_1 = await axios.get(SERVICE.ALL_VOMMASTERNAME, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let codeValues = res_project_1?.data?.vommaster.map((data) => ({
                name: data.name,
                code: data?.code,
            }));
            // setuomcodes(codeValues);

            let setData = ans.map((item) => {
                const matchingItem = codeValues.find(
                    (item1) => item.uom === item1.name
                );

                const matchingItem1 = codeValues.find(
                    (item1) => item.uomnew === item1.name
                );

                if (matchingItem) {
                    return { ...item, uomcode: matchingItem.code };
                } else if (matchingItem1) {
                    return { ...item, uomcode: matchingItem1.code };
                } else {
                    return { ...item };
                }
            });

            // const itemsWithSerialNumber = setData?.map((item, index) => ({
            //   ...item,
            //   serialNumber: (page - 1) * pageSize + index + 1,
            // }));

            const itemsWithSerialNumber = setData?.map((item, index) => {
                if (item.requestmode === "Stock Material") {


                    let quantityNew = item.stockmaterialarray.reduce((total, person) => total + Number(person.quantitynew), 0);

                    let materialNew = item.stockmaterialarray.map((data, newindex) => data.materialnew);

                    let productdetailsNew = item.stockmaterialarray.map((data, newindex) => data.productdetailsnew);

                    let quantityAndUom = item.stockmaterialarray.map((data, newindex) => {
                        return `${data.quantitynew}#${data.uomcodenew}`;
                    });

                    const nonEmptyParts = productdetailsNew.filter(
                        (part) => part.trim() !== ""
                    );
                    const result = nonEmptyParts.join(",");

                    return {
                        ...item,
                        id: item._id,
                        serialNumber: (page - 1) * pageSize + index + 1,
                        company: item.company,
                        requestdate: moment(item.requestdate).format("DD/MM/YYYY"),
                        requesttime: item.requesttime,
                        expecttdate: moment(item.expecttdate).format("DD/MM/YYYY"),
                        expecttime: item.expecttime,
                        branch: item.branch,
                        unit: item.unit,
                        floor: item.floor,
                        area: item.area,
                        location: item.location,
                        requestmode: item.requestmode,

                        // uomnew: quantityAndUom.join(","),
                        uomnew: quantityAndUom.filter(item => item.trim() !== "").join(","),
                        // quantitynew: quantityNew.join(","),
                        quantitynew: quantityNew,

                        materialnew: materialNew[0],

                        // productdetailsnew:
                        //   item.stockmaterialarray.length > 0
                        //     ? productdetailsNew.join(",")
                        //     : "",
                        productdetailsnew:
                            // productdetailsNew.join(",")
                            productdetailsNew.filter(item => item.trim() !== "").join(",")
                    };
                } else {
                    return {
                        ...item,
                        id: item._id,
                        serialNumber: (page - 1) * pageSize + index + 1,
                        company: item.company,
                        branch: item.branch,
                        unit: item.unit,
                        floor: item.floor,
                        area: item.area,
                        location: item.location,
                        requestmode: item.requestmode,
                        requestdate: moment(item.requestdate).format("DD/MM/YYYY"),
                        // expecttdate: moment(item.expecttdate).format("DD/MM/YYYY"),
                        // expecttime: item.expecttime,
                        requesttime: item.requesttime,
                        productdetailsnew: item.productdetails,
                        uomnew: `${item.quantity}#${item.uomcode}`,
                        quantitynew: item.quantity,
                    };
                }
            });


            let final = itemsWithSerialNumber.map((item, index) => {
                return {
                    ...item,

                    materialmode: item.requestmode === "Asset Material" ? item.material : item.materialnew,
                    duedate: moment(item.duedate).format("DD/MM/YYYY"),

                }
            })

            // console.log(itemsWithSerialNumber, "itemsWithSerialNumber")
            setStockmanage(final)




            setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
            setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
            setPageSize((data) => { return ans?.length > 0 ? data : 10 });
            setPage((data) => { return ans?.length > 0 ? data : 1 });
            setProjectCheck(false);
        }
        catch (err) { setProjectCheck(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    //MULTISELECT ONCHANGE START

    //company multiselect
    //team multiselect

    const requestModeOptions = [
        { label: "Asset Material", value: "Asset Material" },
        { label: "Stock Material", value: "Stock Material" },
    ];

    const [selectedRequestMode, setSelectedOptionsRequestMode] = useState([]);
    let [valueRequestMode, setValueRequestMode] = useState([]);

    const handleReqeuestChange = (options) => {
        setValueRequestMode(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsRequestMode(options);

    };

    const customValueRendererRequest = (valueRequestMode, _categoryname) => {
        return valueRequestMode?.length
            ? valueRequestMode.map(({ label }) => label)?.join(", ")
            : "Please Select Request Mode";
    };


    const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
    let [valueCompanyCat, setValueCompanyCat] = useState([]);

    const handleCompanyChange = (options) => {
        setValueCompanyCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCompany(options);
        setValueBranchCat([]);
        setSelectedOptionsBranch([]);
        setValueUnitCat([]);
        setSelectedOptionsUnit([]);
    };

    const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
        return valueCompanyCat?.length
            ? valueCompanyCat.map(({ label }) => label)?.join(", ")
            : "Please Select Company";
    };

    //branch multiselect
    const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
    let [valueBranchCat, setValueBranchCat] = useState([]);

    const handleBranchChangeFilter = (options) => {
        setValueBranchCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsBranch(options);
        setValueUnitCat([]);
        setSelectedOptionsUnit([]);
    };

    const customValueRendererBranch = (valueBranchCat, _categoryname) => {
        return valueBranchCat?.length
            ? valueBranchCat.map(({ label }) => label)?.join(", ")
            : "Please Select Branch";
    };

    //unit multiselect
    const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
    let [valueUnitCat, setValueUnitCat] = useState([]);

    const handleUnitChange = (options) => {
        setValueUnitCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsUnit(options);

    };

    const customValueRendererUnit = (valueUnitCat, _categoryname) => {
        return valueUnitCat?.length
            ? valueUnitCat.map(({ label }) => label)?.join(", ")
            : "Please Select Unit";
    };


    //auto select all dropdowns
    const handleAutoSelect = async () => {
        setPageName(!pageName)
        try {
            let selectedValues = accessbranch
                ?.map((data) => ({
                    company: data.company,
                    branch: data.branch,
                    unit: data.unit,
                }))
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) =>
                                t.company === value.company &&
                                t.branch === value.branch &&
                                t.unit === value.unit
                        )
                );
            let selectedCompany = selectedValues
                ?.filter(
                    (value, index, self) =>
                        index === self.findIndex((t) => t.company === value.company)
                )
                .map((a, index) => {
                    return a.company;
                });

            let mappedCompany = selectedValues
                ?.filter(
                    (value, index, self) =>
                        index === self.findIndex((t) => t.company === value.company)
                )
                ?.map((data) => ({
                    label: data?.company,
                    value: data?.company,
                }));

            setValueCompanyCat(selectedCompany);
            setSelectedOptionsCompany(mappedCompany);

            let selectedBranch = selectedValues
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) => t.company === value.company && t.branch === value.branch
                        )
                )
                .map((a, index) => {
                    return a.branch;
                });

            let mappedBranch = selectedValues
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) => t.company === value.company && t.branch === value.branch
                        )
                )
                ?.map((data) => ({
                    label: data?.branch,
                    value: data?.branch,
                }));

            setValueBranchCat(selectedBranch);
            setSelectedOptionsBranch(mappedBranch);

            let selectedUnit = selectedValues
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) =>
                                t.company === value.company &&
                                t.branch === value.branch &&
                                t.unit === value.unit
                        )
                )
                .map((a, index) => {
                    return a.unit;
                });

            let mappedUnit = selectedValues
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) =>
                                t.company === value.company &&
                                t.branch === value.branch &&
                                t.unit === value.unit
                        )
                )
                ?.map((data) => ({
                    label: data?.unit,
                    value: data?.unit,
                }));

            setValueUnitCat(selectedUnit);
            setSelectedOptionsUnit(mappedUnit);

        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };



    useEffect(() => {
        handleAutoSelect();
    }, []);

    const handleSubmitFilter = (e) => {
        e.preventDefault();
        if (selectedOptionsCompany?.length === 0 &&
            selectedOptionsBranch?.length === 0 &&
            selectedOptionsUnit?.length === 0 &&
            selectedRequestMode?.length === 0
        ) {
            setPopupContentMalert("Please Select Any One");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }


        else {
            fetchStock("Filtered", searchQuery);
        }
    };

    const handleClearFilter = () => {
        setStockmanage([]);
        setItems([]);
        setPage(1)
        setTotalProjects(0);
        setTotalPages(0);
        setPageSize(10)
        setOverallFilterdata([]);
        setSelectedOptionsCompany([])
        setSelectedOptionsBranch([])
        setSelectedOptionsUnit([])
        setSelectedOptionsRequestMode([])
        setValueCompanyCat([])
        setValueBranchCat([])
        setValueUnitCat([])
        setPopupContent('Cleared Successfully');
        setPopupSeverity("success");
        handleClickOpenPopup();
    }

    const [isEditOpenused, setIsEditOpenused] = useState(false);

    const handleClickOpenEditused = (data) => {
        setHandover({
            ...handover,
            company: data.company,
            branch: data.branch,
            unit: data.unit,
            floor: data.floor,
            area: data.area,
            location: data.location,
            materialmode: data.materialmode,
            requestdate: data.requestdate,
            requesttime: data.requesttime,
            duedate: data.duedate,
            productdetailsnew: data.productdetailsnew,
            quantitynew: data.quantitynew,
            uomnew: data.uomnew
        });



        setIsEditOpenused(true);

    };
    const handleCloseModEditused = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpenused(false);
    };

    const [stockbalance, setStockbalance] = useState({ stocks: [], stocksmanual: [] })


    const getStockBalanceCount = async (data) => {
        try {

            let res = await axios.post(SERVICE.STOCK_BALANCE_COUNT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                // company: data.company,
                // branch: data.branch,
                // unit: data.unit,
                // floor: data.floor,
                // area: data.area,
                // location: data.location,
                productname: data.materialmode,
                // status: data.status,
                requestmode: data.requestmode
            });

            setStockbalance({ ...res.data, quantitynew: data.quantitynew, id: data._id })
            handleClickOpenEditused(data)

        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const SendRequestUpdateBalance = async () => {
        try {

            let res = await axios.post(`${SERVICE.STOCKMANAGE_SINGLE_UPDATE_MOVE}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    id: stockbalance.id

                });
            setPopupContent("Moved Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            fetchStock("Filtered", searchQuery);
            handleCloseModEditused()

        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    // console.log(stockbalance.id, "stockbalance.id")

    const handleDataFromChildUIDeignStock = (data) => {
        // Handle the data received from the child component
        // setDataFromChildUIDeign(data);
        if (data === true) {
            fetchStock();
        }
    };
    const handleDataFromChildUIDeignManual = (data) => {
        // Handle the data received from the child component
        // setDataFromChildUIDeign(data);
        if (data === true) {
            fetchStock();
        }
    };
    const handleDataFromChildUIDeignManualStock = (data) => {
        // Handle the data received from the child component
        // setDataFromChildUIDeign(data);
        if (data === true) {
            fetchStock();
        }
    };





    return (
        <>
            <Box>
                <Headtitle title={"Manage Stock"} />
                {/* ****** Header Content ****** */}

                {/* ****** Table Start ****** */}
                {isUserRoleCompare?.includes("lstockverification") && (
                    <>

                        <Box sx={userStyle.container}>
                            {/* ******************************************************EXPORT Buttons****************************************************** */}
                            <Grid item xs={8}>

                                <PageHeading
                                    title=" List Stock Request Verfication"
                                    modulename="Asset"
                                    submodulename="Stock"
                                    mainpagename="Stock Purchase Request"
                                    subpagename=""
                                    subsubpagename=""
                                />
                            </Grid>
                            <Box>
                                <Grid container spacing={2}>
                                    <>
                                        <Grid item md={2} xs={12} sm={12}>
                                            <Typography>
                                                Company
                                            </Typography>
                                            <FormControl size="small" fullWidth>
                                                <MultiSelect
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
                                                    value={selectedOptionsCompany}
                                                    onChange={(e) => {
                                                        handleCompanyChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererCompany}
                                                    labelledBy="Please Select Company"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={2} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Branch
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch
                                                        ?.filter((comp) =>
                                                            valueCompanyCat?.includes(comp.company)
                                                        )
                                                        ?.map((data) => ({
                                                            label: data.branch,
                                                            value: data.branch,
                                                        }))
                                                        .filter((item, index, self) => {
                                                            return (
                                                                self.findIndex(
                                                                    (i) =>
                                                                        i.label === item.label &&
                                                                        i.value === item.value
                                                                ) === index
                                                            );
                                                        })}
                                                    value={selectedOptionsBranch}
                                                    onChange={(e) => {
                                                        handleBranchChangeFilter(e);
                                                    }}
                                                    valueRenderer={customValueRendererBranch}
                                                    labelledBy="Please Select Branch"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={2} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Unit
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch
                                                        ?.filter(
                                                            (comp) =>
                                                                valueCompanyCat?.includes(comp.company) &&
                                                                valueBranchCat?.includes(comp.branch)
                                                        )
                                                        ?.map((data) => ({
                                                            label: data.unit,
                                                            value: data.unit,
                                                        }))
                                                        .filter((item, index, self) => {
                                                            return (
                                                                self.findIndex(
                                                                    (i) =>
                                                                        i.label === item.label &&
                                                                        i.value === item.value
                                                                ) === index
                                                            );
                                                        })}
                                                    value={selectedOptionsUnit}
                                                    onChange={(e) => {
                                                        handleUnitChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererUnit}
                                                    labelledBy="Please Select Unit"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={2} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Request Mode
                                                </Typography>
                                                <MultiSelect
                                                    options={requestModeOptions}
                                                    value={selectedRequestMode}
                                                    onChange={(e) => {
                                                        handleReqeuestChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererRequest}
                                                    labelledBy="Please Select Request Mode"
                                                />
                                            </FormControl>
                                        </Grid>

                                    </>


                                    <Grid item md={2} sm={12} xs={12} marginTop={3}>
                                        <Grid sx={{ display: "flex", gap: "15px" }}>
                                            <Button
                                                variant="contained"
                                                sx={buttonStyles.buttonsubmit}
                                                onClick={(e) => {
                                                    handleSubmitFilter(e);
                                                }}
                                            >
                                                {" "}
                                                Filter
                                            </Button>
                                            <Button
                                                sx={buttonStyles.btncancel}
                                                onClick={() => {
                                                    handleClearFilter();
                                                }}
                                            >
                                                {" "}
                                                CLEAR
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <br />

                                <Grid container spacing={2} style={userStyle.dataTablestyle}>
                                    <Grid item md={2} xs={12} sm={12}>
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
                                        <Box>
                                            {isUserRoleCompare?.includes(
                                                "excelstockverification"
                                            ) && (
                                                    <>
                                                        <Button
                                                            onClick={(e) => {
                                                                setIsFilterOpen(true);
                                                                setFormat("xl");
                                                            }}
                                                            sx={userStyle.buttongrp}
                                                        >
                                                            <FaFileExcel />
                                                            &ensp;Export to Excel&ensp;
                                                        </Button>
                                                    </>
                                                )}
                                            {isUserRoleCompare?.includes(
                                                "csvstockverification"
                                            ) && (
                                                    <>
                                                        <Button
                                                            onClick={(e) => {
                                                                setIsFilterOpen(true);
                                                                setFormat("csv");
                                                            }}
                                                            sx={userStyle.buttongrp}
                                                        >
                                                            <FaFileCsv />
                                                            &ensp;Export to CSV&ensp;
                                                        </Button>
                                                    </>
                                                )}
                                            {isUserRoleCompare?.includes(
                                                "printstockverification"
                                            ) && (
                                                    <>
                                                        <Button
                                                            sx={userStyle.buttongrp}
                                                            onClick={handleprint}
                                                        >
                                                            &ensp;
                                                            <FaPrint />
                                                            &ensp;Print&ensp;
                                                        </Button>
                                                    </>
                                                )}
                                            {isUserRoleCompare?.includes(
                                                "pdfstockverification"
                                            ) && (
                                                    <>
                                                        <Button
                                                            sx={userStyle.buttongrp}
                                                            onClick={() => {
                                                                setIsPdfFilterOpen(true);
                                                            }}
                                                        >
                                                            <FaFilePdf />
                                                            &ensp;Export to PDF&ensp;
                                                        </Button>
                                                    </>
                                                )}
                                            {isUserRoleCompare?.includes(
                                                "imagestockverification"
                                            ) && (
                                                    <>
                                                        <Button
                                                            sx={userStyle.buttongrp}
                                                            onClick={handleCaptureImage}
                                                        >
                                                            {" "}
                                                            <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                                                            &ensp;Image&ensp;{" "}
                                                        </Button>
                                                    </>
                                                )}
                                        </Box>
                                    </Grid>
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
                                </Grid>
                                <br />
                                <Grid container spacing={1}>
                                    <Grid item md={6} xs={12} sm={12}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "left",
                                                flexWrap: "wrap",
                                                gap: "10px",
                                            }}
                                        >
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={handleShowAllColumns}
                                            >
                                                Show All Columns
                                            </Button>
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={handleOpenManageColumns}
                                            >
                                                Manage Columns
                                            </Button>


                                            &ensp;


                                        </Box>
                                    </Grid>
                                </Grid>
                                <br />
                                {projectCheck ? (

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
                                        {/* <FacebookCircularProgress /> */}
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
                                                    selectedRowsRequestPurchase={selectedRowsRequestPurchase}
                                                    setSelectedRowsRequestPurchase={setSelectedRowsRequestPurchase}
                                                    gridRefTable={gridRefTable}
                                                    totalDatas={totalProjects}
                                                    setFilteredRowData={setFilteredRowData}
                                                    pagenamecheck={"Stock Request Purchase"}
                                                    filteredRowData={filteredRowData}
                                                    gridRefTableImg={gridRefTableImg}
                                                    itemsList={stockmanages}
                                                />
                                            </>
                                        </Box>
                                    </>
                                )}
                                {/* ****** Table End ****** */}
                            </Box>
                        </Box>

                    </>
                )}
                {/* Manage Column */}

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
                                                fetchStock("Filtered", searchQuery);
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

                <br />

                {/* Delete Modal */}
                <Box>
                    {/* ALERT DIALOG */}
                    <Dialog
                        open={isDeleteOpen}
                        onClose={handleCloseMod}
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
                            <Button
                                onClick={handleCloseMod}
                                style={{
                                    backgroundColor: "#f4f4f4",
                                    color: "#444",
                                    boxShadow: "none",
                                    borderRadius: "3px",
                                    border: "1px solid #0000006b",
                                    "&:hover": {
                                        "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                                            backgroundColor: "#f4f4f4",
                                        },
                                    },
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                autoFocus
                                variant="contained"
                                color="error"
                                onClick={(e) => delProject(projectid)}
                            >
                                {" "}
                                OK{" "}
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* this is info view details */}
                    <Dialog
                        open={openInfo}
                        onClose={handleCloseinfo}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <Box sx={{ width: "550px", padding: "20px 50px" }}>
                            <>
                                <Typography sx={userStyle.HeaderText}>Stock Info</Typography>
                                <br />
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">addedby</Typography>
                                            <br />
                                            <Table>
                                                <TableHead>
                                                    <StyledTableCell
                                                        sx={{ padding: "5px 10px !important" }}
                                                    >
                                                        {"SNO"}.
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                        sx={{ padding: "5px 10px !important" }}
                                                    >
                                                        {" "}
                                                        {"UserName"}
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                        sx={{ padding: "5px 10px !important" }}
                                                    >
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
                                                                {moment(item.date).format(
                                                                    "DD-MM-YYYY hh:mm:ss a"
                                                                )}
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
                                                    <StyledTableCell
                                                        sx={{ padding: "5px 10px !important" }}
                                                    >
                                                        {"SNO"}.
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                        sx={{ padding: "5px 10px !important" }}
                                                    >
                                                        {" "}
                                                        {"UserName"}
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                        sx={{ padding: "5px 10px !important" }}
                                                    >
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
                                                                {moment(item.date).format(
                                                                    "DD-MM-YYYY hh:mm:ss a"
                                                                )}
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

                    {/* print layout */}

                    <TableContainer component={Paper} sx={userStyle.printcls}>
                        <Table
                            sx={{ minWidth: 700 }}
                            aria-label="customized table"
                            id="usertable"
                            ref={componentRef}
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell> SI.No</TableCell>
                                    <TableCell>Company</TableCell>
                                    <TableCell>Branch</TableCell>
                                    <TableCell>Unit</TableCell>
                                    <TableCell>Floor</TableCell>
                                    <TableCell>Area</TableCell>
                                    <TableCell>Location</TableCell>
                                    <TableCell>Request Mode For</TableCell>
                                    <TableCell>Product Details</TableCell>

                                    <TableCell>Quantity</TableCell>
                                    <TableCell>Quantity & UOM</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody align="left">
                                {rowDataTable &&
                                    rowDataTable.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{row.company}</TableCell>
                                            <TableCell>{row.branch}</TableCell>
                                            <TableCell>{row.unit}</TableCell>
                                            <TableCell>{row.floor}</TableCell>
                                            <TableCell>{row.area}</TableCell>
                                            <TableCell>{row.location}</TableCell>
                                            <TableCell>{row.requestmode}</TableCell>
                                            {/* <TableCell>{row.productname}</TableCell> */}
                                            <TableCell>{row.productdetailsnew}</TableCell>

                                            <TableCell>{row.quantitynew}</TableCell>
                                            <TableCell>{row.uomnew}</TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {/* 
                <TableContainer component={Paper} style={{
                    display: canvasState === false ? 'none' : 'block',
                }} >
                    <Table
                        sx={{ minWidth: 700 }}
                        aria-label="customized table"
                        id="excelcanvastable"
                        ref={gridRef}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell> SI.No</TableCell>
                                <TableCell>Project Name</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody align="left">
                            {filteredData &&
                                filteredData.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{row.name}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer> */}
                </Box>




                {/* stock update model */}

                {/* stock model */}
                <Dialog
                    open={openstockupdate}
                    onClose={handleClickOpenstockupdate}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="lg"
                    fullWidth={true}
                    sx={{ marginTop: "95px" }}
                >
                    <Box sx={{ padding: "20px 50px" }}>
                        <>
                            <Box>
                                <>
                                    <Grid container spacing={2}>
                                        <Grid item xs={8}>
                                            <Typography sx={userStyle.importheadtext}>
                                                Manage Purchase Details
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <br />
                                    <Grid container spacing={2}>

                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Date<b style={{ color: "red" }}>*</b> </Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="date"
                                                    value={stockmasterupdate.requestdate}
                                                    onChange={(e) => {
                                                        setStockmasterupdate({ ...stockmasterupdate, requestdate: e.target.value });
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>

                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Time<b style={{ color: "red" }}>*</b> </Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="time"
                                                    value={stockmasterupdate.requesttime}
                                                    onChange={(e) => {
                                                        setStockmasterupdate({ ...stockmasterupdate, requesttime: e.target.value });
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>


                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Warranty<b style={{ color: "red" }}>*</b></Typography>
                                                <Select
                                                    fullWidth
                                                    labelId="demo-select-small"
                                                    id="demo-select-small"
                                                    value={stockmasterupdate.warranty}
                                                    onChange={(e) => {
                                                        setStockmasterupdate({
                                                            ...stockmasterupdate,
                                                            warranty: e.target.value,
                                                        });
                                                    }}
                                                >
                                                    <MenuItem value="" disabled>
                                                        {" "}
                                                        Please Select
                                                    </MenuItem>
                                                    <MenuItem value="Yes"> {"Yes"} </MenuItem>
                                                    <MenuItem value="No"> {"No"} </MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        {stockmasterupdate.warranty === "Yes" && (
                                            <>
                                                <Grid item md={3} xs={12} sm={12}>
                                                    <Grid container>
                                                        <Grid item md={6} xs={6} sm={6}>
                                                            <Typography>Warranty Time<b style={{ color: "red" }}>*</b></Typography>
                                                            <FormControl fullWidth size="small">
                                                                <OutlinedInput
                                                                    id="component-outlined"
                                                                    type="text"
                                                                    size="small"
                                                                    placeholder="Enter Time"
                                                                    value={stockmasterupdate.estimation}
                                                                    onChange={(e) => handleChangephonenumberupdate(e)}
                                                                />
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item md={6} xs={6} sm={6}>
                                                            <Typography>Estimation<b style={{ color: "red" }}>*</b></Typography>
                                                            <Select
                                                                fullWidth
                                                                labelId="demo-select-small"
                                                                id="demo-select-small"
                                                                size="small"
                                                                value={stockmasterupdate.estimationtime}
                                                                // onChange={(e) => {
                                                                //   setStockmasterupdate({ ...stockmasterupdate, estimationtime: e.target.value });
                                                                // }}
                                                                onChange={handleEstimationChangeupdate}
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

                                        <Grid item md={3} sm={12} xs={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Qty</Typography>
                                                <OutlinedInput
                                                    readOnly={true}
                                                    value={totalQuantity}
                                                />
                                            </FormControl>
                                        </Grid>
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
                                                        // setVendorNew("Choose Vendor");
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={2.5} xs={12} sm={12}>
                                            <FormControl size="small" fullWidth>
                                                <Typography>
                                                    Vendor Name <b style={{ color: "red" }}>*</b>{" "}
                                                </Typography>
                                                <Selects
                                                    options={vendormaster}
                                                    styles={colourStyles}
                                                    value={{
                                                        label: stockmaster.vendorname,
                                                        value: stockmaster.vendorname,
                                                    }}
                                                    onChange={(e) => {
                                                        setStockmaster({
                                                            ...stockmaster,
                                                            vendorname: e.value,
                                                        });
                                                        vendorid(e._id);
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
                                                    marginTop: "20px",
                                                    background: "rgb(25, 118, 210)",
                                                }}
                                                onClick={() => {
                                                    handleClickOpenviewalertvendor();
                                                }}
                                            >
                                                <FaPlus style={{ fontSize: "15px" }} />
                                            </Button>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>GST No </Typography>
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
                                                    placeholder="Please Enter Billno"
                                                    value={stockmasterupdate.billno}
                                                    onChange={(e) => {
                                                        setStockmasterupdate({
                                                            ...stockmasterupdate,
                                                            billno: e.target.value,
                                                        });
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        {stockmasterupdate.warranty === "Yes" && (
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Warranty Details <b style={{ color: "red" }}>*</b>{" "}
                                                    </Typography>
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="text"
                                                        value={stockmasterupdate.warrantydetails}
                                                        sx={userStyle.input}
                                                        placeholder="Please Enter Warranty Details"
                                                        onChange={(e) => {
                                                            setStockmasterupdate({
                                                                ...stockmasterupdate,
                                                                warrantydetails: e.target.value,
                                                            });
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        )}
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
                                                    value={stockmasterupdate.rate}
                                                    onChange={(e) => {
                                                        setStockmasterupdate({
                                                            ...stockmasterupdate,
                                                            rate: e.target.value,
                                                        });
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} sm={12} xs={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Total Bill Amount<b style={{ color: "red" }}>*</b>{" "}
                                                </Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="number"
                                                    sx={userStyle.input}
                                                    value={(totalQuantity) * (stockmasterupdate.rate)}

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
                                                    value={stockmasterupdate.billdate}
                                                    onChange={(e) => {
                                                        setStockmasterupdate({
                                                            ...stockmasterupdate,
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
                                                    onClick={() => handleClickUploadPopupOpenedit()}
                                                >
                                                    Upload
                                                </Button>
                                            </Box>
                                        </Grid>
                                        {stockmasterupdate.warranty === "Yes" && (
                                            <Grid item md={3} xs={12} sm={12}>
                                                <Typography>Warranty Card </Typography>
                                                <Box sx={{ display: "flex", justifyContent: "left" }}>
                                                    <Button
                                                        variant="contained"
                                                        onClick={() => handleClickUploadPopupOpenwarrantyedit()}
                                                    >
                                                        Upload
                                                    </Button>
                                                </Box>
                                            </Grid>
                                        )}
                                    </Grid>
                                    <br />
                                    <br />

                                    <Grid container>
                                        <Grid item md={3} xs={12} sm={6}>
                                            {btnSubmit ? (
                                                <Box sx={{ display: "flex" }}>
                                                    <CircularProgress />
                                                </Box>
                                            ) : (
                                                <>
                                                    <Button
                                                        variant="contained"
                                                        sx={buttonStyles.buttonsubmit}
                                                        onClick={handleSubmitUpdate}
                                                    >
                                                        Create
                                                    </Button>
                                                </>
                                            )}
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={6}>
                                            <Button sx={buttonStyles.btncancel} onClick={handleclear}>
                                                Clear
                                            </Button>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={6}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleClosestockupdate}
                                            >
                                                {" "}
                                                Back{" "}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </>
                            </Box>
                            <br />
                        </>
                    </Box>
                </Dialog>

                {/* ALERT DIALOG */}
                <Dialog
                    open={isCheckOpen}
                    onClose={handleCloseCheck}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent
                        sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                    >
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "80px", color: "orange" }}
                        />
                        <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                            {checkvendor?.length > 0 &&
                                checkcategory?.length > 0 &&
                                checksubcategory?.length > 0 &&
                                checktimepoints?.length > 0 ? (
                                <>
                                    <span style={{ fontWeight: "700", color: "#777" }}>
                                        {`${deleteproject.name} `}
                                    </span>
                                    was linked in{" "}
                                    <span style={{ fontWeight: "700" }}>
                                        Vendor, Category, Subcategory & Time and points{" "}
                                    </span>
                                </>
                            ) : checkvendor?.length > 0 ||
                                checkcategory?.length > 0 ||
                                checksubcategory?.length > 0 ||
                                checktimepoints?.length > 0 ? (
                                <>
                                    <span style={{ fontWeight: "700", color: "#777" }}>
                                        {`${deleteproject.name} `}
                                    </span>
                                    was linked in{" "}
                                    <span style={{ fontWeight: "700" }}>
                                        {checkvendor?.length ? " Vendor" : ""}
                                        {checkcategory?.length ? " Category" : ""}
                                        {checksubcategory?.length ? " Subcategory" : ""}
                                        {checktimepoints?.length ? " Time and points" : ""}
                                    </span>
                                </>
                            ) : (
                                ""
                            )}
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleCloseCheck}
                            autoFocus
                            variant="contained"
                            color="error"
                        >
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* dialog box for vendor details */}

                <Dialog
                    open={openviewalertvendor}
                    onClose={handleClickOpenviewalertvendor}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="lg"
                    sx={{
                        // overflow: "visible",
                        // "& .MuiPaper-root": {
                        //   overflow: "visible",
                        // },
                        marginTop: "95px"
                    }}
                    fullWidth={true}
                >
                    {isUserRoleCompare?.includes("avendormaster") && (
                        <Box sx={userStyle.dialogbox}>
                            <>
                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        {" "}
                                        <Typography sx={{ fontWeight: "bold" }}>
                                            Add Vendor
                                        </Typography>{" "}
                                    </Grid>
                                </Grid>
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            {cateCode &&
                                                cateCode.map(() => {
                                                    let strings = "VEN";
                                                    let refNo = cateCode[cateCode?.length - 1]?.vendorid;
                                                    let digits = (cateCode?.length + 1).toString();
                                                    const stringLength = refNo?.length;
                                                    let lastChar = refNo?.charAt(stringLength - 1);
                                                    let getlastBeforeChar = refNo?.charAt(stringLength - 2);
                                                    let getlastThreeChar = refNo?.charAt(stringLength - 3);
                                                    let lastBeforeChar = refNo?.slice(-2);
                                                    let lastThreeChar = refNo?.slice(-3);
                                                    let lastDigit = refNo?.slice(-4);
                                                    let refNOINC = parseInt(lastChar) + 1;
                                                    let refLstTwo = parseInt(lastBeforeChar) + 1;
                                                    let refLstThree = parseInt(lastThreeChar) + 1;
                                                    let refLstDigit = parseInt(lastDigit) + 1;
                                                    if (
                                                        digits.length < 4 &&
                                                        getlastBeforeChar == 0 &&
                                                        getlastThreeChar == 0
                                                    ) {
                                                        refNOINC = ("000" + refNOINC)?.substr(-4);
                                                        newval = strings + refNOINC;
                                                    } else if (
                                                        digits.length < 4 &&
                                                        getlastBeforeChar > 0 &&
                                                        getlastThreeChar == 0
                                                    ) {
                                                        refNOINC = ("00" + refLstTwo)?.substr(-4);
                                                        newval = strings + refNOINC;
                                                    } else if (digits.length < 4 && getlastThreeChar > 0) {
                                                        refNOINC = ("0" + refLstThree)?.substr(-4);
                                                        newval = strings + refNOINC;
                                                    }
                                                })}
                                            <Typography>
                                                Vendor ID <b style={{ color: "red" }}>*</b>{" "}
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                placeholder="Please Enter Vendor Id"
                                                value={newval}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Vendor Name <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                value={vendor.vendorname}
                                                placeholder="Please Enter Vendor Name"
                                                onChange={(e) => {
                                                    setVendor({ ...vendor, vendorname: e.target.value });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Email ID</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="email"
                                                value={vendor.emailid}
                                                placeholder="Please Enter Email ID"
                                                onChange={(e) => {
                                                    setVendor({ ...vendor, emailid: e.target.value });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Phone Number</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="number"
                                                sx={userStyle.input}
                                                value={vendor.phonenumber}
                                                placeholder="Please Enter Phone Number"
                                                onChange={(e) => {
                                                    setVendor({ ...vendor, phonenumber: e.target.value });
                                                    handleMobile(e.target.value);
                                                }}
                                            />
                                        </FormControl>
                                        <Grid>
                                            <FormGroup>
                                                <FormControlLabel
                                                    control={<Checkbox checked={vendor.phonecheck} />}
                                                    onChange={(e) =>
                                                        setVendor({
                                                            ...vendor,
                                                            phonecheck: !vendor.phonecheck,
                                                        })
                                                    }
                                                    label="Same as Whats app number"
                                                />
                                            </FormGroup>
                                        </Grid>
                                    </Grid>
                                    {/* <Grid item md={12} xs={12} sm={12} sx={{ display: "flex" }}>

                    <Grid item md={3} sm={12} xs={12}>

                      <Typography>Photograph</Typography>
                      <Box sx={{ display: "flex", justifyContent: "left" }}>
                        <Button
                          sx={buttonStyles.buttonsubmit}
                          onClick={handleClickUploadPopupOpenedit}
                        >
                          Upload
                        </Button>
                      </Box>
                    </Grid>
                    <Grid item md={9} sm={12} xs={12}>
                      <Typography>&nbsp;</Typography>
                      {previewURLedit && refImageDragedit.length > 0 && (
                        <>
                          {refImageDragedit.map((file, index) => (
                            <>
                              <img
                                src={file.preview}
                                alt={file.name}
                                style={{
                                  maxWidth: "70px",
                                  maxHeight: "70px",
                                  marginTop: "10px",
                                }}
                              />
                              <Button
                                onClick={() => handleRemoveFileedit(index)}
                                style={{ marginTop: "0px", color: "red" }}
                              >
                                X
                              </Button>
                            </>
                          ))}
                        </>

                      )}
                      {isWebcamCapture == true &&
                        capturedImagesedit.map((image, index) => (
                          <Grid container key={index}>
                            <Grid item md={2} sm={2} xs={12}>
                              <Box
                                style={{
                                  isplay: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  marginLeft: "37px",
                                }}
                              >
                                <img
                                  src={image.preview}
                                  alt={image.name}
                                  height={50}
                                  style={{ maxWidth: "-webkit-fill-available" }}
                                />
                              </Box>
                            </Grid>
                            <Grid
                              item
                              md={8}
                              sm={8}
                              xs={8}
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Typography variant="subtitle2">
                                {" "}
                                {image.name}{" "}
                              </Typography>
                            </Grid>
                            <Grid item md={1} sm={1} xs={12}>
                              <Grid sx={{ display: "flex" }}>
                                <Button
                                  sx={{
                                    marginTop: "15px !important",
                                    padding: "14px 14px",
                                    minWidth: "40px !important",
                                    borderRadius: "50% !important",
                                    ":hover": {
                                      backgroundColor: "#80808036", // theme.palette.primary.main
                                    },
                                  }}
                                  onClick={() => renderFilePreviewedit(image)}
                                >
                                  <VisibilityOutlinedIcon
                                    style={{
                                      fontsize: "12px",
                                      color: "#357AE8",
                                      marginTop: "35px !important",
                                    }}
                                  />
                                </Button>
                                <Button
                                  sx={{
                                    marginTop: "15px !important",
                                    padding: "14px 14px",
                                    minWidth: "40px !important",
                                    borderRadius: "50% !important",
                                    ":hover": {
                                      backgroundColor: "#80808036",
                                    },
                                  }}
                                  onClick={() => removeCapturedImageedit(index)}
                                >
                                  <FaTrash
                                    style={{
                                      color: "#a73131",
                                      fontSize: "12px",
                                      marginTop: "35px !important",
                                    }}
                                  />
                                </Button>
                              </Grid>
                            </Grid>
                          </Grid>
                        ))}

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
                                  src={getFileIcon(file.name)}
                                  height="10"
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

                  </Grid> */}
                                    <Grid item xs={12}>
                                        <Typography sx={{ fontWeight: "bold" }}>
                                            Alternate Phone Number
                                        </Typography>
                                    </Grid>
                                    <br />
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Phone Number 1</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="number"
                                                sx={userStyle.input}
                                                value={vendor.phonenumberone}
                                                placeholder="Please Enter Phone Number 1"
                                                onChange={(e) => {
                                                    const phoneone = handlechangephonenumber(e);
                                                    setVendor({ ...vendor, phonenumberone: phoneone });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Phone Number 2</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="number"
                                                sx={userStyle.input}
                                                value={vendor.phonenumbertwo}
                                                placeholder="Please Enter Phone Number 2"
                                                onChange={(e) => {
                                                    const phonetwo = handlechangephonenumber(e);
                                                    setVendor({ ...vendor, phonenumbertwo: phonetwo });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Phone Number 3</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="number"
                                                sx={userStyle.input}
                                                value={vendor.phonenumberthree}
                                                placeholder="Please Enter Phone Number 3"
                                                onChange={(e) => {
                                                    const phonethree = handlechangephonenumber(e);
                                                    setVendor({ ...vendor, phonenumberthree: phonethree });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Phone Number 4</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="number"
                                                sx={userStyle.input}
                                                value={vendor.phonenumberfour}
                                                placeholder="Please Enter Phone Number 4"
                                                onChange={(e) => {
                                                    const phonefour = handlechangephonenumber(e);
                                                    setVendor({ ...vendor, phonenumberfour: phonefour });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>WhatsApp Number</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="number"
                                                sx={userStyle.input}
                                                value={vendor.whatsappnumber}
                                                placeholder="Please Enter Whatsapp Number"
                                                onChange={(e) => {
                                                    setVendor({
                                                        ...vendor,
                                                        whatsappnumber: e.target.value,
                                                    });
                                                    handlewhatsapp(e.target.value);
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item lg={3} md={4} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Address <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <TextareaAutosize
                                                aria-label="minimum height"
                                                minRows={5}
                                                placeholder="Please Enter Address"
                                                value={vendor.address}
                                                onChange={(e) => {
                                                    setVendor({ ...vendor, address: e.target.value });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item lg={3} md={4} xs={12} sm={6}>
                                        <FormControl size="small" fullWidth>
                                            <Typography>Country</Typography>
                                            <Selects
                                                options={Country.getAllCountries()}
                                                getOptionLabel={(options) => {
                                                    return options["name"];
                                                }}
                                                getOptionValue={(options) => {
                                                    return options["name"];
                                                }}
                                                value={selectedCountryp}
                                                onChange={(item) => {
                                                    setSelectedCountryp(item);
                                                    setVendor((prevSupplier) => ({
                                                        ...prevSupplier,
                                                        country: item?.name || "",
                                                    }));
                                                    setSelectedStatep("")
                                                    setSelectedCityp("")
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item lg={3} md={4} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>State</Typography>
                                            <Selects
                                                options={State?.getStatesOfCountry(
                                                    selectedCountryp?.isoCode
                                                )}
                                                getOptionLabel={(options) => {
                                                    return options["name"];
                                                }}
                                                getOptionValue={(options) => {
                                                    return options["name"];
                                                }}
                                                value={selectedStatep}
                                                onChange={(item) => {
                                                    setSelectedStatep(item);
                                                    setVendor((prevSupplier) => ({
                                                        ...prevSupplier,
                                                        state: item?.name || "",
                                                    }));
                                                    setSelectedCityp("")
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item lg={3} md={4} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>City</Typography>
                                            <Selects
                                                options={City.getCitiesOfState(
                                                    selectedStatep?.countryCode,
                                                    selectedStatep?.isoCode
                                                )}
                                                getOptionLabel={(options) => {
                                                    return options["name"];
                                                }}
                                                getOptionValue={(options) => {
                                                    return options["name"];
                                                }}
                                                value={selectedCityp}
                                                onChange={(item) => {
                                                    setSelectedCityp(item);
                                                    setVendor((prevSupplier) => ({
                                                        ...prevSupplier,
                                                        city: item?.name || "",
                                                    }));
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item lg={3} md={4} xs={12} sm={6}>
                                        <FormControl size="small" fullWidth>
                                            <Typography>Pincode</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="number"
                                                placeholder="Please Enter Pincode"
                                                value={vendor.pincode}
                                                sx={userStyle.input}
                                                onChange={(e) => {
                                                    handlechangecpincode(e);
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>GST Number</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                value={vendor.gstnumber}
                                                placeholder="Please Enter GST Number"
                                                onChange={(e) => {
                                                    const newValue = e.target.value;
                                                    if (newValue.length <= maxLength) {
                                                        setVendor({ ...vendor, gstnumber: newValue });
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item lg={3} md={4} xs={12} sm={6}>
                                        <Grid container>
                                            <Grid item md={4} xs={6} sm={6}>
                                                <FormControl size="small" fullWidth>
                                                    <Typography>Landline</Typography>
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="number"
                                                        value={stdCode}
                                                        placeholder="STD Code"
                                                        sx={userStyle.input}
                                                        onChange={(e) => {
                                                            handlechangestdcode(e);
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={8} xs={6} sm={6}>
                                                <FormControl size="small" fullWidth>
                                                    <Typography>&nbsp;</Typography>
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="number"
                                                        value={lanNumber}
                                                        placeholder="Number"
                                                        sx={userStyle.input}
                                                        onChange={(e) => {
                                                            setLanNumber(e.target.value);
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item lg={3} md={4} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Contact Person Name</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                value={vendor.contactperson}
                                                placeholder="Please Enter Contact Person Name"
                                                onChange={(e) => {
                                                    setVendor({ ...vendor, contactperson: e.target.value });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item lg={3} md={4} xs={12} sm={6}>
                                        <FormControl size="small" fullWidth>
                                            <Typography>Credit Days</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="number"
                                                value={vendor.creditdays}
                                                placeholder="Please Enter Credit Days"
                                                sx={userStyle.input}
                                                onChange={(e) => {
                                                    setVendor({ ...vendor, creditdays: e.target.value });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Status<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                maxMenuHeight={250}
                                                options={vendorstatusopt}
                                                placeholder="Please Choose Status"
                                                value={{
                                                    label: !vendor.vendorstatus ? "Please Select Status" : vendor.vendorstatus,
                                                    value: !vendor.vendorstatus ? "Please Select Status" : vendor.vendorstatus,
                                                }}
                                                onChange={(e) => {
                                                    setVendor({ ...vendor, vendorstatus: e.value });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Payment Frequency<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                maxMenuHeight={250}
                                                options={paymentfrequency}
                                                placeholder="Please Choose Payment Frequency"
                                                value={{
                                                    label: vendor.paymentfrequency,
                                                    value: vendor.paymentfrequency,
                                                }}
                                                onChange={(e) => {
                                                    setVendor({ ...vendor, paymentfrequency: e.value });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    {vendor.paymentfrequency === "Monthly" &&
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Monthly Date<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    maxMenuHeight={250}
                                                    options={dateOption}
                                                    placeholder="Please Choose Monthly Date"
                                                    value={{
                                                        label: !vendor.monthlyfrequency ? "Please Select Monthly Frequency" : vendor.monthlyfrequency,
                                                        value: !vendor.monthlyfrequency ? "Please Select Monthly Frequency" : vendor.monthlyfrequency,
                                                    }}
                                                    onChange={(e) => {
                                                        setVendor({
                                                            ...vendor,
                                                            monthlyfrequency: e.value,
                                                        });
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>}
                                    {vendor.paymentfrequency === "Weekly" &&
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Weekly Days<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    maxMenuHeight={250}
                                                    options={dayOptions}
                                                    placeholder="Please Choose Monthly Date"
                                                    value={{
                                                        label: !vendor.weeklyfrequency ? "Please Select Weekly Frequency" : vendor.weeklyfrequency,
                                                        value: !vendor.weeklyfrequency ? "Please Select Weekly Frequency" : vendor.weeklyfrequency,
                                                    }}
                                                    onChange={(e) => {
                                                        setVendor({
                                                            ...vendor,
                                                            weeklyfrequency: e.value,
                                                        });
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>}
                                    <Grid item md={3} xs={12} sm={12} sx={{ display: "flex" }}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Mode of Payments<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                maxMenuHeight={250}
                                                options={modeofpayments}
                                                placeholder="Please Choose Mode Of Payments"
                                                value={{
                                                    label: vendor.modeofpayments,
                                                    value: vendor.modeofpayments,
                                                }}
                                                onChange={(e) => {
                                                    setVendor({ ...vendor, modeofpayments: e.value });
                                                }}
                                            />
                                        </FormControl>
                                        &emsp;
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={handlemodeofpay}
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
                                </Grid>
                                <br />
                                {modeofpay.includes("Cash") && (
                                    <>
                                        <br />
                                        <Grid container spacing={2}>
                                            <Grid item md={3} xs={12} sm={12} sx={{ display: "flex" }}>
                                                <FormControl fullWidth size="small">
                                                    <Typography sx={{ fontWeight: "bold" }}>
                                                        Cash <b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="text"
                                                        readOnly={true}
                                                        value={"Cash"}
                                                        onChange={(e) => { }}
                                                    />
                                                </FormControl>
                                                &nbsp; &emsp;
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    type="button"
                                                    onClick={(e) => deleteTodo("Cash")}
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
                                        </Grid>
                                    </>
                                )}
                                <br />
                                <br />
                                {modeofpay.includes("Bank Transfer") && (
                                    <>
                                        <Grid container spacing={2}>
                                            <Grid item xs={8}>
                                                <Typography sx={{ fontWeight: "bold" }}>
                                                    Bank Details
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <br />
                                        <Grid container spacing={2}>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Bank Name<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <Selects
                                                        maxMenuHeight={250}
                                                        options={accounttypes}
                                                        placeholder="Please Choose Bank Name"
                                                        value={{
                                                            label: vendor.bankname,
                                                            value: vendor.bankname,
                                                        }}
                                                        onChange={(e) => {
                                                            setVendor({ ...vendor, bankname: e.value });
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Bank Branch Name<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="text"
                                                        value={vendor.bankbranchname}
                                                        placeholder="Please Enter Bank Branch Name"
                                                        onChange={(e) => {
                                                            const inputvalue = e.target.value;
                                                            if (/^$|^[a-zA-Z\s]*$/.test(inputvalue)) {
                                                                setVendor({
                                                                    ...vendor,
                                                                    bankbranchname: inputvalue,
                                                                });
                                                            }
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Account Holder Name<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="text"
                                                        value={vendor.accountholdername}
                                                        placeholder="Please Enter Account Holder Name"
                                                        onChange={(e) => {
                                                            const inputvalue = e.target.value;
                                                            if (/^$|^[a-zA-Z\s]*$/.test(inputvalue)) {
                                                                setVendor({
                                                                    ...vendor,
                                                                    accountholdername: inputvalue,
                                                                });
                                                            }
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Account Number<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="text"
                                                        sx={userStyle.input}
                                                        value={vendor.accountnumber}
                                                        placeholder="Please Enter Account Number"
                                                        onChange={(e) => {
                                                            const inputvalue = e.target.value;
                                                            if (/^[a-zA-Z0-9]*$/.test(inputvalue)) {
                                                                setVendor({
                                                                    ...vendor,
                                                                    accountnumber: inputvalue,
                                                                });
                                                            }
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12} sx={{ display: "flex" }}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        IFSC Code<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="text"
                                                        value={vendor.ifsccode}
                                                        placeholder="Please Enter IFSC Code"
                                                        onChange={(e) => {
                                                            const inputvalue = e.target.value;
                                                            if (/^[a-zA-Z0-9]*$/.test(inputvalue)) {
                                                                setVendor({ ...vendor, ifsccode: inputvalue });
                                                            }
                                                        }}
                                                    />
                                                </FormControl>
                                                &nbsp; &emsp;
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    type="button"
                                                    onClick={(e) => deleteTodo("Bank Transfer")}
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
                                        </Grid>
                                    </>
                                )}
                                <br /> <br />
                                {modeofpay.includes("UPI") && (
                                    <>
                                        <Grid container spacing={2}>
                                            <Grid item xs={8}>
                                                <Typography sx={{ fontWeight: "bold" }}>
                                                    UPI Details
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <br />
                                        <Grid container spacing={2}>
                                            <Grid item md={3} xs={12} sm={12} sx={{ display: "flex" }}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        UPI Number<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="text"
                                                        sx={userStyle.input}
                                                        value={vendor.upinumber}
                                                        placeholder="Please Enter UPI Number"
                                                        onChange={(e) => {
                                                            const inputvalue = e.target.value;
                                                            if (/^[a-zA-Z0-9]*$/.test(inputvalue)) {
                                                                setVendor({ ...vendor, upinumber: inputvalue });
                                                            }
                                                        }}
                                                    />
                                                </FormControl>
                                                &nbsp; &emsp;
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    type="button"
                                                    onClick={(e) => deleteTodo("UPI")}
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
                                        </Grid>
                                    </>
                                )}
                                <br /> <br />
                                {modeofpay.includes("Card") && (
                                    <>
                                        <Grid container spacing={2}>
                                            <Grid item xs={8}>
                                                <Typography sx={{ fontWeight: "bold" }}>
                                                    Card Details
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <br />
                                        <Grid container spacing={2}>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Card Number<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="text"
                                                        sx={userStyle.input}
                                                        value={vendor.cardnumber}
                                                        placeholder="Please Enter Card Number"
                                                        onChange={(e) => {
                                                            const inputvalue = e.target.value;
                                                            if (/^[a-zA-Z0-9]*$/.test(inputvalue)) {
                                                                setVendor({ ...vendor, cardnumber: inputvalue });
                                                            }
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Card Holder Name<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="text"
                                                        value={vendor.cardholdername}
                                                        placeholder="Please Enter Card Holder Name"
                                                        onChange={(e) => {
                                                            const inputvalue = e.target.value;
                                                            if (/^$|^[a-zA-Z\s]*$/.test(inputvalue)) {
                                                                setVendor({
                                                                    ...vendor,
                                                                    cardholdername: inputvalue,
                                                                });
                                                            }
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Card Transaction Number
                                                        <b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="text"
                                                        value={vendor.cardtransactionnumber}
                                                        placeholder="Please Enter Card Transaction Number"
                                                        onChange={(e) => {
                                                            const inputvalue = e.target.value;
                                                            if (/^[a-zA-Z0-9]*$/.test(inputvalue)) {
                                                                setVendor({
                                                                    ...vendor,
                                                                    cardtransactionnumber: inputvalue,
                                                                });
                                                            }
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Card Type<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <Selects
                                                        maxMenuHeight={250}
                                                        options={cardtypes}
                                                        placeholder="Please Select Card Type"
                                                        value={{
                                                            label: vendor.cardtype,
                                                            value: vendor.cardtype,
                                                        }}
                                                        onChange={(e) => {
                                                            setVendor({ ...vendor, cardtype: e.value });
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={6}>
                                                <Typography>
                                                    Expire At<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Grid container spacing={1}>
                                                    <Grid item md={6} xs={12} sm={6}>
                                                        <FormControl fullWidth size="small">
                                                            <Selects
                                                                maxMenuHeight={300}
                                                                options={monthsOption}
                                                                placeholder="Month"
                                                                id="select7"
                                                                value={{
                                                                    label: vendor.cardmonth,
                                                                    value: vendor.cardmonth,
                                                                }}
                                                                onChange={(e) => {
                                                                    setVendor({ ...vendor, cardmonth: e.value });
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item md={6} xs={12} sm={6}>
                                                        <FormControl fullWidth size="small">
                                                            <Selects
                                                                maxMenuHeight={300}
                                                                options={yearsOption}
                                                                placeholder="Year"
                                                                value={{
                                                                    label: vendor.cardyear,
                                                                    value: vendor.cardyear,
                                                                }}
                                                                id="select8"
                                                                onChange={(e) => {
                                                                    setVendor({ ...vendor, cardyear: e.value });
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12} sx={{ display: "flex" }}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Security Code<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="number"
                                                        value={vendor.cardsecuritycode}
                                                        sx={userStyle.input}
                                                        placeholder="Please Enter Security Code"
                                                        onChange={(e) => {
                                                            setVendor({
                                                                ...vendor,
                                                                cardsecuritycode: e.target.value,
                                                            });
                                                        }}
                                                    />
                                                </FormControl>
                                                &nbsp; &emsp;
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    type="button"
                                                    onClick={(e) => deleteTodo("Card")}
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
                                        </Grid>
                                    </>
                                )}
                                <br />
                                {modeofpay.includes("Cheque") && (
                                    <>
                                        <Grid container spacing={2}>
                                            <Grid item xs={8}>
                                                <Typography sx={{ fontWeight: "bold" }}>
                                                    Cheque Details
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <br />
                                        <Grid container spacing={2}>
                                            <Grid item md={3} xs={12} sm={12} sx={{ display: "flex" }}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Cheque Number<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="text"
                                                        sx={userStyle.input}
                                                        value={vendor.chequenumber}
                                                        placeholder="Please Enter Cheque Number"
                                                        onChange={(e) => {
                                                            const inputvalue = e.target.value;
                                                            if (/^[a-zA-Z0-9]*$/.test(inputvalue)) {
                                                                setVendor({
                                                                    ...vendor,
                                                                    chequenumber: inputvalue,
                                                                });
                                                            }
                                                        }}
                                                    />
                                                </FormControl>
                                                &nbsp; &emsp;
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    type="button"
                                                    onClick={(e) => deleteTodo("Cheque")}
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
                                        </Grid>
                                    </>
                                )}
                                <br />
                                <Grid
                                    container
                                    spacing={2}
                                    sx={{ display: "flex", justifyContent: "center" }}
                                >
                                    <Grid item lg={2.5} md={2.5} sm={2} xs={12}>
                                        {/* <Button
                  variant="contained"
                  color="primary"
                  sx={userStyle.buttonadd}
                  onClick={handleSubmitvendor}
                >
                  Submit
                </Button> */}
                                        <LoadingButton
                                            loading={isBtn}
                                            variant="contained"
                                            sx={buttonStyles.buttonsubmit}
                                            onClick={handleSubmitvendor}>
                                            Submit
                                        </LoadingButton>
                                    </Grid>
                                    <Grid item lg={2.5} md={2.5} sm={2} xs={12}>
                                        <Button sx={buttonStyles.btncancel} onClick={handleClearvendor}>
                                            Clear
                                        </Button>
                                    </Grid>
                                    <Grid item lg={2.5} md={2.5} sm={2} xs={12}>
                                        <Button
                                            sx={userStyle.btncancel}
                                            onClick={handleCloseviewalertvendor}
                                        >
                                            Cancel
                                        </Button>
                                    </Grid>
                                </Grid>
                            </>
                        </Box>
                    )}
                </Dialog>

                {/* dialog box for uom details */}
                <Dialog
                    open={openviewalertUom}
                    onClose={handleClickOpenviewalertUom}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="md"
                    sx={{
                        overflow: "visible",
                        "& .MuiPaper-root": {
                            overflow: "visible",
                        },
                    }}
                    fullWidth={true}
                >
                    <Box sx={userStyle.dialogbox}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>
                                        Manage UOM
                                    </Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Name<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Name"
                                            value={vomMaster.name}
                                            onChange={(e) => {
                                                setVomMaster({ ...vomMaster, name: e.target.value });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br />
                            <br />

                            <Grid container>
                                <Grid item md={3} xs={12} sm={6}>
                                    {isUserRoleCompare?.includes("bdstockverification") && (
                                        <Button
                                            variant="contained"
                                            sx={buttonStyles.buttonsubmit}
                                            onClick={handleSubmituom}
                                        >
                                            Submit
                                        </Button>
                                    )}
                                </Grid>
                                <Grid item md={3} xs={12} sm={6}>
                                    <Button sx={buttonStyles.btncancel} onClick={handleclearuom}>
                                        Clear
                                    </Button>
                                </Grid>
                                <Grid item md={3} xs={12} sm={6}>
                                    <Button
                                        sx={buttonStyles.btncancel}
                                        onClick={handleCloseviewalertUom}
                                    >
                                        Cancel
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </Dialog>

                <Dialog
                    open={openviewalertAsset}
                    onClose={handleClickOpenviewalertAsset}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="md"
                    sx={{
                        overflow: "visible",
                        "& .MuiPaper-root": {
                            overflow: "visible",
                        },
                    }}
                    fullWidth={true}
                >
                    <Box sx={userStyle.dialogbox}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>
                                        Manage Asset Material
                                    </Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl size="small" fullWidth>
                                        <Typography>
                                            Asset Head <b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={account}
                                            styles={colourStyles}
                                            value={{
                                                label: selectedassethead,
                                                value: selectedassethead,
                                            }}
                                            onChange={(e) => {
                                                handleAssetChange(e);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Material Code <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={asset.materialcode}
                                            placeholder="Please Enter Material Code"
                                            onChange={(e) => {
                                                setAsset({ ...asset, materialcode: e.target.value });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3.5} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Material Name <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={asset.name}
                                            placeholder="Please Enter Material Code"
                                            onChange={(e) => {
                                                setAsset({ ...asset, name: e.target.value });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br /> <br />
                            <Grid container spacing={2}>
                                <Grid item md={2.5} xs={12} sm={6}>
                                    {isUserRoleCompare?.includes("bdstockverification") && (
                                        <Button
                                            variant="contained"
                                            sx={buttonStyles.buttonsubmit}
                                            onClick={handleSubmitasset}
                                        >
                                            Submit
                                        </Button>
                                    )}
                                </Grid>
                                <Grid item md={2.5} xs={12} sm={6}>
                                    {isUserRoleCompare?.includes("bdstockverification") && (
                                        <Button sx={buttonStyles.btncancel} onClick={handleClearasset}>
                                            Clear
                                        </Button>
                                    )}
                                </Grid>
                                <Grid item md={2.5} xs={12} sm={6}>
                                    <Button
                                        sx={buttonStyles.btncancel}
                                        onClick={handleCloseviewalertAsset}
                                    >
                                        Cancel
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </Dialog>

                {/* UPLOAD BILL CREATE IMAGE DIALOG */}
                {/* <Dialog
        open={uploadPopupOpen}
        onClose={handleUploadPopupClose}
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
                      onChange={handleInputChange}
                    />
                  </Button>
                  &ensp;
                </Grid>
              </FormControl>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              {refImage.map((file, index) => (
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
                          src={getFileIcon(file.name)}
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
                        onClick={() => renderFilePreview(file)}
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
                        onClick={() => handleDeleteFile(index)}
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
          <Button onClick={handleUploadOverAll} variant="contained">
            Ok
          </Button>
          <Button onClick={resetImage} sx={userStyle.btncancel}>
            Reset
          </Button>
          <Button onClick={handleUploadPopupClose} sx={userStyle.btncancel}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog> */}



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
                        Upload Image Bill
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
                                                id="productimagbille"
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
                                {refImageedit && refImageedit.length > 0 && refImageedit.map((file, index) => (

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
                                                        // className={classes.preview}
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
                                        <Grid item md={2} sm={1} xs={1}>
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
                                                    onClick={(e) => renderFilePreviewedit(file)}
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
                                ))

                                }


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
                {/* <Dialog
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
      </Dialog> */}

                {/* UPLOAD WARRANTY IMAGE DIALOG EDIT*/}
                <Dialog
                    open={uploadPopupOpenwarrantyedit}
                    onClose={handleUploadPopupClosewarrantyedit}
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
                                                onChange={handleInputChangewarrantyedit}
                                            />
                                        </Button>
                                        &ensp;
                                    </Grid>
                                </FormControl>
                            </Grid>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                {refImagewarrantyedit.map((file, index) => (
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
                                                        src={getFileIconwarrantyedit(file.name)}
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
                                                    onClick={() => renderFilePreviewwarrantyedit(file)}
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
                                                    onClick={() => handleDeleteFilewarrantyedit(index)}
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
                        <Button onClick={handleUploadOverAllwarrantyedit} variant="contained">
                            Ok
                        </Button>
                        <Button onClick={resetImagewarrantyedit} sx={userStyle.btncancel}>
                            Reset
                        </Button>
                        <Button
                            onClick={handleUploadPopupClosewarrantyedit}
                            sx={userStyle.btncancel}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* vendor grouping model  */}{
                    <Box>
                        <Dialog
                            open={vendorGrpOpen.open}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                            fullWidth={true}
                            maxWidth="md"
                            sx={{ marginTop: "47px" }}
                        >
                            <Box sx={{ padding: "20px 50px" }}>
                                <>
                                    <Typography sx={userStyle.HeaderText}>
                                        {" "}
                                        Add Vendor Grouping
                                    </Typography>
                                    <br />
                                    <Grid container spacing={2}>
                                        <Grid item md={6} xs={12} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">Vendor Group Name</Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    value={vendorgroup.vendorgroupname}
                                                    placeholder="Please Enter VendorGroup Name"
                                                    onChange={(e) => { setVendorgroup({ vendorgroupname: e.target.value }) }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6} xs={12} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">Vendor Name</Typography>
                                                <Typography>{vendorGrpOpen.data}</Typography>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <br /><br />
                                    <Grid container spacing={2}>
                                        <Button
                                            variant="contained"
                                            sx={buttonStyles.btnUpload}
                                            onClick={updateVendor}
                                        >
                                            {" "}
                                            Update{" "}
                                        </Button>
                                    </Grid>
                                </>
                            </Box>
                        </Dialog>
                    </Box>
                }


                <Box>
                    {/* Edit DIALOG */}
                    <Dialog
                        open={isEditOpenused}
                        onClose={handleCloseModEditused}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        maxWidth="md"
                        fullWidth={true}
                        sx={{ marginTop: "95px" }}

                    >
                        <Box sx={{ width: "920px", padding: "20px 50px" }}>
                            <>
                                {/* <Typography sx={userStyle.HeaderText}> Move </Typography> */}
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    // sx={userStyle.buttonedit}
                                    onClick={() =>
                                        SendRequestUpdateBalance()
                                    }
                                >
                                    Move To Request
                                </Button>
                                <br />
                                {/* <br /> */}
                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            {/* <Typography variant="h6">addedby</Typography> */}

                                            <br />
                                            {/* <Table>
                                            
                                                <TableHead>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Status"}</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Company"}</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Branch"}</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Unit"}</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Floor"}</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Area"}</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Location"}</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Material"}</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Count"}</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Actions"}</StyledTableCell>
                                                </TableHead>
                                                <TableBody>
                                                    {stockbalance.stocks &&
                                                        stockbalance.stocks?.map((row, index) => (
                                                            <StyledTableRow>
                                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}>{index + 1}.</StyledTableCell>
                                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Stock"}</StyledTableCell>
                                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}> {row.company}</StyledTableCell>
                                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}> {row.branch}</StyledTableCell>
                                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}> {row.unit}</StyledTableCell>
                                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}> {row.floor}</StyledTableCell>
                                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}> {row.area}</StyledTableCell>
                                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}> {row.location}</StyledTableCell>
                                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}> {row.productname}</StyledTableCell>
                                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}> {row.balancedcount}</StyledTableCell>
                                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                                                    <Button
                                                                        variant="containted"
                                                                        sx={{
                                                                            color: "white",
                                                                            backgroundColor: "#ff0000b0",
                                                                            "&:hover": {
                                                                                backgroundColor: "#ff0000b0", // Keep the same color on hover
                                                                                color: "white", // Ensure text color remains the same
                                                                            },
                                                                        }}
                                                                        size="small">
                                                                        Use
                                                                    </Button>


                                                                </StyledTableCell>

                                                            </StyledTableRow>
                                                        ))}


                                                    {stockbalance.stocksmanual &&
                                                        stockbalance.stocksmanual?.map((row, index) => (
                                                            <StyledTableRow>
                                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}>{index + 1}.</StyledTableCell>
                                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Manual"}</StyledTableCell>
                                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}> {row.company}</StyledTableCell>
                                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}> {row.branch}</StyledTableCell>
                                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}> {row.unit}</StyledTableCell>
                                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}> {row.floor}</StyledTableCell>
                                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}> {row.area}</StyledTableCell>
                                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}> {row.location}</StyledTableCell>
                                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}> {row.productname}</StyledTableCell>
                                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}> {row.balancedcountmanual}</StyledTableCell>
                                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                                                    <Button
                                                                        variant="containted"
                                                                        sx={{
                                                                            color: "white",
                                                                            backgroundColor: "#ff0000b0",
                                                                            "&:hover": {
                                                                                backgroundColor: "#ff0000b0", // Keep the same color on hover
                                                                                color: "white", // Ensure text color remains the same
                                                                            },
                                                                        }}
                                                                        size="small">
                                                                        Use
                                                                    </Button>


                                                                </StyledTableCell>

                                                            </StyledTableRow>
                                                        ))}
                                                </TableBody>
                                            </Table> */}

                                            <TableContainer component={Paper}>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            {["SNO", "Status", "Company", "Branch", "Unit", "Floor", "Area", "Location", "Material", "Count", "Actions"].map((header) => (
                                                                <StyledTableCell key={header} sx={{ padding: "5px 10px !important" }}>
                                                                    {header}
                                                                </StyledTableCell>
                                                            ))}
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {[...(stockbalance?.stocks?.map(d => ({ ...d, status: "Stock" })) || []), ...(stockbalance?.stocksmanual?.map(d => ({ ...d, status: "Manual" })) || [])].map((row, index) => (
                                                            <StyledTableRow key={index}>
                                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}>{index + 1}.</StyledTableCell>
                                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}>{row.status}</StyledTableCell>
                                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}>{row.company}</StyledTableCell>
                                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}>{row.branch}</StyledTableCell>
                                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}>{row.unit}</StyledTableCell>
                                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}>{row.floor}</StyledTableCell>
                                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}>{row.area}</StyledTableCell>
                                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}>{row.location}</StyledTableCell>
                                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}>{row.productname}</StyledTableCell>
                                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                                                    {row.status == "Stock" ? row.balancedcount : row.balancedcountmanual}
                                                                </StyledTableCell>
                                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                                                    <Button
                                                                        variant="contained"
                                                                        sx={{
                                                                            color: "white",
                                                                            backgroundColor: "#ff0000b0",
                                                                            "&:hover": { backgroundColor: "#ff0000b0", color: "white" },
                                                                        }}
                                                                        disabled={stockbalance.quantitynew > (row.status == "Stock" ? row.balancedcount : row.balancedcountmanual)}
                                                                        size="small"

                                                                        onClick={() =>

                                                                            HandleusedDialog(row, stockbalance.requestmode)

                                                                        }
                                                                    >
                                                                        Use
                                                                    </Button>
                                                                </StyledTableCell>
                                                            </StyledTableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>

                                        </FormControl>
                                    </Grid>

                                </Grid>
                                <br /> <br />
                                <br />
                                <Grid container spacing={2}>
                                    <Button variant="contained" onClick={handleCloseModEditused}>
                                        {" "}
                                        Back{" "}
                                    </Button>
                                </Grid>
                            </>
                        </Box>


                    </Dialog>
                </Box>


                <Dialog
                    open={openviewalertvendorstock}
                    onClose={handleCloseviewalertvendorstock}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="lg"
                    sx={{
                        marginTop: "95px"
                    }}
                    fullWidth={true}
                >
                    <Stockmaterialeditdialog
                        sendDataToParentUIStock={handleDataFromChildUIDeignStock}
                        openpop={!openviewalertvendorstock}
                        stockmaterialedit={stockmaterialedit}
                        requestquantity={stockbalance.quantitynew}
                        availqty={availqty}
                        vendorGroup={vendorGroup}
                        vendorNew={vendorNew}
                        stockmanagemasteredit1={stockmanagemasteredit}
                        refImageedit={refImageedit}
                        refImagewarrantyedit={refImagewarrantyedit}
                        handleChangeGroupName={handleChangeGroupName}
                        stockArray={stockArray}
                        subcategoryOpt={subcategoryOpt}
                        materialOptNew={materialOptNew}
                        floorsEdit={floorsEdit}
                        areasEdit={areasEdit}
                        vendorgetid={vendorgetid}
                        selectedPurchaseDateEdit={selectedPurchaseDateEdit}
                        handleCloseviewalertvendorstock={handleCloseviewalertvendorstock}
                    />
                </Dialog>
                <Dialog
                    open={openviewalertvendormanualasset}
                    onClose={handleCloseviewalertvendormanualasset}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="lg"
                    sx={{
                        marginTop: "95px"
                    }}
                    fullWidth={true}
                >
                    <Manualstockentryverification
                        sendDataToParentUIManual={handleDataFromChildUIDeignManual}
                        openpop={!openviewalertvendormanualasset}
                        totalAmountEdit1={totalAmountEdit}
                        requestquantity={stockbalance.quantitynew}
                        availqty={availqty}
                        stockmasteredit1={stockmasteredit}
                        selectedPurchaseDateEdit={selectedPurchaseDateEdit}
                        vendorGroupEdit={vendorGroupEdit}
                        stockbalance={stockbalance}
                        vendorNewEdit={vendorNewEdit}
                        vendorOptIndEdit={vendorOptIndEdit}
                        refImageedit={refImageedit}
                        refImagewarrantyedit={refImagewarrantyedit}
                        todosEdit={todosEdit}
                        floorsEdit={floorsEdit}
                        areasEdit={areasEdit}
                        vendorgetid={vendorgetid}
                        Specificationedit={Specificationedit}
                        handleChangeGroupNameEdit={handleChangeGroupNameEdit}
                        handleCloseviewalertvendormanualasset={handleCloseviewalertvendormanualasset}
                    />
                </Dialog>

                <Dialog
                    open={openviewalertvendormanualstock}
                    onClose={handleCloseviewalertvendormanualstock}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="lg"
                    sx={{
                        marginTop: "95px"
                    }}
                    fullWidth={true}
                >
                    <Manuastockmaterial
                        sendDataToParentUIManual={handleDataFromChildUIDeignManualStock}
                        openpop={!openviewalertvendormanualstock}
                        totalAmountEdit={totalAmountEdit}
                        stockmanagemasteredit1={stockmanagemasteredit}
                        requestquantity={stockbalance.quantitynew}
                        availqty={availqty}
                        materialOptNew={materialOptNew}
                        selectedPurchaseDateEdit={selectedPurchaseDateEdit}
                        vendorGroupEdit={vendorGroupEdit}
                        vendorNewEdit={vendorNewEdit}
                        subcategoryOpt={subcategoryOpt}
                        vendorOptIndEdit={vendorOptIndEdit}
                        refImageedit={refImageedit}
                        refImagewarrantyedit={refImagewarrantyedit}
                        todosEdit={todosEdit}
                        floorsEdit={floorsEdit}
                        locationsEdit={locationsEdit}
                        vendorOptEdit={vendorOptEdit}
                        areasEdit={areasEdit}
                        stockArray1={stockArray}
                        vendorgetid={vendorgetid}
                        Specificationedit={Specificationedit}
                        handleChangeGroupNameEdit={handleChangeGroupNameEdit}
                        handleCloseviewalertvendormanualstock={handleCloseviewalertvendormanualstock}
                    />
                </Dialog>



                <Box>
                    {/* Edit DIALOG */}
                    <Dialog
                        open={isEditOpen}
                        onClose={handleCloseModEdit}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        maxWidth="lg"
                        sx={{ marginTop: "95px" }}
                        fullWidth={true}
                    >
                        <Box sx={{ padding: "20px 50px" }}>
                            <>
                                <Grid container spacing={2}>
                                    <Typography sx={userStyle.HeaderText}>
                                        Edit Asset Purchase
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
                                                    label: stockmasteredit.company,
                                                    value: stockmasteredit.company,
                                                }}
                                            // onChange={(e) => {
                                            //     setStockmasteredit({
                                            //         ...stockmasteredit,
                                            //         company: e.value,
                                            //         branch: "Please Select Branch",
                                            //         unit: "Please Select Unit",
                                            //         floor: "Please Select Floor",
                                            //         area: "Please Select Area",
                                            //         location: "Please Select Location",
                                            //     });
                                            //     // setBranchsEdit([]);
                                            //     setAreasEdit([]);

                                            //     setFloorEdit([]);
                                            //     setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                                            //     fetchBranchDropdownsEdit(e.value);
                                            // }}
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
                                                        stockmasteredit.company === comp.company
                                                )?.map(data => ({
                                                    label: data.branch,
                                                    value: data.branch,
                                                })).filter((item, index, self) => {
                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                })}
                                                styles={colourStyles}
                                                value={{
                                                    label: stockmasteredit.branch,
                                                    value: stockmasteredit.branch,
                                                }}
                                            // onChange={(e) => {
                                            //     setNewcheckBranch(e.value);
                                            //     setStockmasteredit({
                                            //         ...stockmasteredit,
                                            //         branch: e.value,
                                            //         unit: "Please Select Unit",
                                            //         floor: "Please Select Floor",
                                            //         area: "Please Select Area",
                                            //         location: "Please Select Location",
                                            //     });
                                            //     // setUnitsEdit([]);
                                            //     setAreasEdit([]);
                                            //     setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                                            //     // setFloorEdit([]);
                                            //     fetchUnitsEdit(e.value);
                                            //     fetchFloorEdit(e.value);
                                            // }}
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
                                                        stockmasteredit.company === comp.company && stockmasteredit.branch === comp.branch
                                                )?.map(data => ({
                                                    label: data.unit,
                                                    value: data.unit,
                                                })).filter((item, index, self) => {
                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                })}
                                                styles={colourStyles}
                                                value={{
                                                    label: stockmasteredit.unit,
                                                    value: stockmasteredit.unit,
                                                }}
                                            // onChange={(e) => {
                                            //     setStockmasteredit({
                                            //         ...stockmasteredit,
                                            //         unit: e.value,
                                            //         workstation: "",
                                            //     });
                                            // }}
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
                                                    label: stockmasteredit.floor,
                                                    value: stockmasteredit.floor,
                                                }}
                                            // onChange={(e) => {
                                            //     setStockmasteredit({
                                            //         ...stockmasteredit,
                                            //         floor: e.value,
                                            //         workstation: "",
                                            //         area: "Please Select Area",
                                            //         location: "Please Select Location",
                                            //     });
                                            //     // setAreasEdit([]);
                                            //     setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                                            //     fetchAreaEdit(stockmasteredit.branch, e.value);
                                            //     fetchAllLocationEdit(
                                            //         stockmasteredit.branch,
                                            //         e.value,
                                            //         stockmasteredit.area,
                                            //     )
                                            // }}
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
                                                    label: stockmasteredit.area,
                                                    value: stockmasteredit.area,
                                                }}
                                            // onChange={(e) => {
                                            //     setStockmasteredit({
                                            //         ...stockmasteredit,
                                            //         area: e.value,
                                            //         workstation: "",
                                            //         location: "Please Select Location",
                                            //     });
                                            //     setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                                            //     fetchAllLocationEdit(
                                            //         stockmasteredit.branch,
                                            //         stockmasteredit.floor,
                                            //         // stockmasteredit.area,
                                            //         e.value
                                            //     );
                                            // }}
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
                                                    label: stockmasteredit.location,
                                                    value: stockmasteredit.location,
                                                }}
                                            // onChange={(e) => {
                                            //     setStockmasteredit({
                                            //         ...stockmasteredit,
                                            //         location: e.value,
                                            //         workstation: "",
                                            //     });
                                            // }}
                                            />
                                        </FormControl>
                                        {/* <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={stockmasteredit.workcheck} />}
                      onChange={(e) =>
                        setStockmasteredit({
                          ...stockmasteredit,
                          workcheck: !stockmasteredit.workcheck,
                          // ^ Update workcheck based on the checkbox state
                        })
                      }
                      label="Enable Workstation"
                    />
                  </FormGroup> */}
                                    </Grid>
                                    {/* {stockmasteredit.workcheck && (
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Work Station</Typography>
                      <Selects
                        maxMenuHeight={250}
                        styles={colourStyles}
                        options={filteredWorkStation}
                        placeholder="Please Select Workstation"
                        value={{
                          label: stockmasteredit.workstation === "" || stockmasteredit.workstation === undefined ? "Please Select Workstation" : stockmasteredit.workstation,
                          value: stockmasteredit.workstation === "" || stockmasteredit.workstation === undefined ? "Please Select Workstation" : stockmasteredit.workstation,
                        }}
                        onChange={(e) => {
                          setStockmasteredit({ ...stockmasteredit, workstation: e.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                )} */}
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Warranty</Typography>

                                            <Select
                                                fullWidth
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                value={stockmasteredit.warranty}
                                            // onChange={(e) => {
                                            //     setStockmasteredit({
                                            //         ...stockmasteredit,
                                            //         warranty: e.target.value,
                                            //     });
                                            // }}
                                            >
                                                <MenuItem value="" disabled>
                                                    {" "}
                                                    Please Select
                                                </MenuItem>
                                                <MenuItem value="Yes"> {"Yes"} </MenuItem>
                                                <MenuItem value="No"> {"No"} </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    {stockmasteredit.warranty === "Yes" && (
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
                                                                value={stockmasteredit.estimation}
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
                                                            value={stockmasteredit.estimationtime}
                                                        // onChange={(e) => {
                                                        //   setAssetdetail({ ...assetdetail, estimationtime: e.target.value });
                                                        // }}
                                                        // onChange={handleEstimationChangeEdit}
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
                                            // onChange={handlePurchaseDateChangeEdit}
                                            />
                                        </FormControl>
                                    </Grid>
                                    {stockmasteredit.warranty === "Yes" && (
                                        <>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>Expiry Date </Typography>
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="text"
                                                        placeholder=""
                                                        value={stockmasteredit.warrantycalculation}
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
                                                value={{ label: vendorGroupEdit, value: vendorGroupEdit }}
                                            // onChange={(e) => {
                                            //     handleChangeGroupNameEdit(e);
                                            //     setVendorGroupEdit(e.value);
                                            //     setVendorNewEdit("Choose Vendor");
                                            // }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl size="small" fullWidth>
                                            <Typography>
                                                Vendor Name <b style={{ color: "red" }}>*</b>{" "}
                                            </Typography>
                                            <Selects
                                                // options={vendormaster}
                                                options={vendorOptEdit}
                                                styles={colourStyles}
                                                value={{ label: vendorNewEdit, value: vendorNewEdit }}
                                            // onChange={(e) => {
                                            //     setVendorNewEdit(e.value);
                                            //     vendorid(e._id);
                                            // }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    {/* <Grid item md={3} xs={12} sm={12}>
                  <FormControl size="small" fullWidth>
                    <Typography>
                      Vendor Name <b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <Selects
                      options={vendormaster}
                      styles={colourStyles}
                      value={{ label: stockmasteredit.vendorname, value: stockmasteredit.vendorname }}
                      onChange={(e) => {
                        setStockmasteredit({ ...stockmasteredit, vendorname: e.value });
                        vendorid(e._id);
                      }}
                    />
                  </FormControl>
                </Grid> */}
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
                                                value={stockmasteredit.billno}
                                            // onChange={(e) => {
                                            //     setStockmasteredit({
                                            //         ...stockmasteredit,
                                            //         billno: e.target.value,
                                            //     });
                                            // }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Request Mode For</Typography>
                                            <OutlinedInput
                                                value={stockmasteredit.requestmode}
                                                readOnly={true}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Material</Typography>
                                            <OutlinedInput value={stockmasteredit.productname} />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Asset Type</Typography>
                                            <OutlinedInput value={stockmasteredit.assettype} />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Asset Head</Typography>
                                            <OutlinedInput value={stockmasteredit.producthead} />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} sm={6} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Component</Typography>
                                            <Selects
                                                options={Specificationedit}
                                                styles={colourStyles}
                                                value={{
                                                    label: stockmasteredit.component,
                                                    value: stockmasteredit.component,
                                                }}
                                            // onChange={(e) => {
                                            //     setStockmasteredit({
                                            //         ...stockmasteredit,
                                            //         component: e.value,
                                            //     });
                                            //     setTodosEdit([]);
                                            //     handleAddInputEdit(e.value);
                                            // }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <br />
                                {todosEdit &&
                                    todosEdit?.map((todo, index) => {
                                        return (
                                            <>
                                                {todo.sub ? (
                                                    <Grid container key={index} spacing={1}>
                                                        <Grid item md={2} sm={2} xs={2} marginTop={2}>
                                                            <Typography>{todo.sub}</Typography>
                                                        </Grid>
                                                        <Grid item md={10} sm={10} xs={10} marginTop={2}>
                                                            <Grid container key={index} spacing={1}>
                                                                <>
                                                                    <Grid item md={3} sm={6} xs={12}>
                                                                        <Grid container spacing={2}>
                                                                            <Grid item md={10} sm={10} xs={10}>


                                                                                <FormGroup>

                                                                                    <FormControlLabel

                                                                                        control={
                                                                                            <Switch
                                                                                                // color="success"
                                                                                                sx={{
                                                                                                    "& .MuiSwitch-switchBase.Mui-checked": {
                                                                                                        color: "green", // Thumb color when checked
                                                                                                    },
                                                                                                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                                                                                        backgroundColor: "green", // Track color when checked
                                                                                                    },
                                                                                                    "& .MuiSwitch-switchBase": {
                                                                                                        color: "#ff0000a3", // Thumb color when not checked
                                                                                                    },
                                                                                                    "& .MuiSwitch-switchBase + .MuiSwitch-track": {
                                                                                                        backgroundColor: "#ff0000a3", // Track color when not checked
                                                                                                    },
                                                                                                }}
                                                                                                checked={todo.subcomponentcheck}
                                                                                                onChange={(e) => {
                                                                                                    handleChangeEdit(
                                                                                                        index,
                                                                                                        "subcomponentcheck",
                                                                                                        e.target.checked
                                                                                                    );
                                                                                                }}
                                                                                            />
                                                                                        }
                                                                                        label="Enable Subcomponent"
                                                                                    />
                                                                                </FormGroup>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                </>
                                                                {todo.subcomponentcheck === true && (
                                                                    <>
                                                                        {todo.type && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>Type</Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        .find(
                                                                                                            (item) =>
                                                                                                                item.subcomponent ===
                                                                                                                todo.subname
                                                                                                        )
                                                                                                        ?.type?.map((item) => ({
                                                                                                            ...item,
                                                                                                            label: item,
                                                                                                            value: item,
                                                                                                        }))}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.type,
                                                                                                        value: todo.type,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "type",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>
                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    // handleClickOpenType();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.model && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>Model</Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        .find(
                                                                                                            (item) =>
                                                                                                                item.subcomponent ===
                                                                                                                todo.subname
                                                                                                        )
                                                                                                        ?.model?.map((item) => ({
                                                                                                            ...item,
                                                                                                            label: item,
                                                                                                            value: item,
                                                                                                        }))}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.model,
                                                                                                        value: todo.model,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "model",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>
                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    // handleClickOpenModel();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.size && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>Size</Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        .find(
                                                                                                            (item) =>
                                                                                                                item.subcomponent ===
                                                                                                                todo.subname
                                                                                                        )
                                                                                                        ?.size?.map((item) => ({
                                                                                                            ...item,
                                                                                                            label: item,
                                                                                                            value: item,
                                                                                                        }))}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.size,
                                                                                                        value: todo.size,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "size",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>
                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    handleClickOpenSize();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.variant && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>Variants</Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        .find(
                                                                                                            (item) =>
                                                                                                                item.subcomponent ===
                                                                                                                todo.subname
                                                                                                        )
                                                                                                        ?.variant?.map((item) => ({
                                                                                                            ...item,
                                                                                                            label: item,
                                                                                                            value: item,
                                                                                                        }))}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.variant,
                                                                                                        value: todo.variant,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "variant",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>
                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                size="small"
                                                                                                variant="contained"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    handleClickOpenVariant();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.brand && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl size="small" fullWidth>
                                                                                                <Typography>Brand</Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        .find(
                                                                                                            (item) =>
                                                                                                                item.subcomponent ===
                                                                                                                todo.subname
                                                                                                        )
                                                                                                        ?.brand?.map((item) => ({
                                                                                                            ...item,
                                                                                                            label: item,
                                                                                                            value: item,
                                                                                                        }))}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.brand,
                                                                                                        value: todo.brand,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "brand",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>
                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}

                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.serial !== undefined && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container>
                                                                                        <Grid item md={11.6} sm={10} xs={10}>
                                                                                            <Typography>Serial</Typography>

                                                                                            <OutlinedInput
                                                                                                fullWidth
                                                                                                type="text"
                                                                                                size="small"
                                                                                                placeholder="Please Enter Serial"
                                                                                                value={todo.serial}
                                                                                                disabled={todo.subcomponentcheck === false}
                                                                                                onChange={(e) => {
                                                                                                    handleChangeEdit(
                                                                                                        index,
                                                                                                        "serial",
                                                                                                        e.target.value
                                                                                                    );
                                                                                                }}
                                                                                            />
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.other !== undefined && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container>
                                                                                        <Grid item md={11.6} sm={10} xs={10}>
                                                                                            <Typography>Others</Typography>

                                                                                            <OutlinedInput
                                                                                                fullWidth
                                                                                                type="text"
                                                                                                size="small"
                                                                                                placeholder="Please Enter Other"
                                                                                                value={todo.other}
                                                                                                onChange={(e) => {
                                                                                                    handleChangeEdit(
                                                                                                        index,
                                                                                                        "other",
                                                                                                        e.target.value
                                                                                                    );
                                                                                                }}
                                                                                            />
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.capacity && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>Capacity</Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        .find(
                                                                                                            (item) =>
                                                                                                                item.subcomponent ===
                                                                                                                todo.subname
                                                                                                        )
                                                                                                        ?.capacity?.map((item) => ({
                                                                                                            ...item,
                                                                                                            label: item,
                                                                                                            value: item,
                                                                                                        }))}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.capacity,
                                                                                                        value: todo.capacity,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "capacity",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>

                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    handleClickOpenCapacity();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.hdmiport !== undefined && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container>
                                                                                        <Grid item md={11.6} sm={10} xs={10}>
                                                                                            <Typography>HDMI Port</Typography>

                                                                                            <OutlinedInput
                                                                                                fullWidth
                                                                                                type="text"
                                                                                                size="small"
                                                                                                placeholder="Please Enter HDMI Port"
                                                                                                value={todo.hdmiport}
                                                                                                disabled={todo.subcomponentcheck === false}
                                                                                                onChange={(e) => {
                                                                                                    const inputText = e.target.value;
                                                                                                    // Regex to allow only non-negative numbers
                                                                                                    const validatedInput =
                                                                                                        inputText.match(/^\d*$/);

                                                                                                    const sanitizedInput =
                                                                                                        validatedInput !== null
                                                                                                            ? validatedInput[0]
                                                                                                            : "0";
                                                                                                    handleChangeEdit(
                                                                                                        index,
                                                                                                        "hdmiport",
                                                                                                        sanitizedInput
                                                                                                    );
                                                                                                }}
                                                                                            />
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.vgaport !== undefined && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container>
                                                                                        <Grid item md={11.6} sm={10} xs={10}>
                                                                                            <Typography>VGA Port</Typography>

                                                                                            <OutlinedInput
                                                                                                fullWidth
                                                                                                type="text"
                                                                                                size="small"
                                                                                                placeholder="Please Enter VGA Port"
                                                                                                value={todo.vgaport}
                                                                                                disabled={todo.subcomponentcheck === false}
                                                                                                onChange={(e) => {
                                                                                                    const inputText = e.target.value;
                                                                                                    // Regex to allow only non-negative numbers
                                                                                                    const validatedInput =
                                                                                                        inputText.match(/^\d*$/);

                                                                                                    const sanitizedInput =
                                                                                                        validatedInput !== null
                                                                                                            ? validatedInput[0]
                                                                                                            : "0";
                                                                                                    handleChangeEdit(
                                                                                                        index,
                                                                                                        "vgaport",
                                                                                                        sanitizedInput
                                                                                                    );
                                                                                                }}
                                                                                            />
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.dpport !== undefined && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container>
                                                                                        <Grid item md={11.6} sm={10} xs={10}>
                                                                                            <Typography>DP Port</Typography>

                                                                                            <OutlinedInput
                                                                                                fullWidth
                                                                                                type="text"
                                                                                                size="small"
                                                                                                placeholder="Please Enter DP Port"
                                                                                                value={todo.dpport}
                                                                                                disabled={todo.subcomponentcheck === false}
                                                                                                onChange={(e) => {
                                                                                                    const inputText = e.target.value;
                                                                                                    // Regex to allow only non-negative numbers
                                                                                                    const validatedInput =
                                                                                                        inputText.match(/^\d*$/);

                                                                                                    const sanitizedInput =
                                                                                                        validatedInput !== null
                                                                                                            ? validatedInput[0]
                                                                                                            : "0";
                                                                                                    handleChangeEdit(
                                                                                                        index,
                                                                                                        "dpport",
                                                                                                        sanitizedInput
                                                                                                    );
                                                                                                }}
                                                                                            />
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.usbport !== undefined && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container>
                                                                                        <Grid item md={11.6} sm={10} xs={10}>
                                                                                            <Typography>USB Port</Typography>

                                                                                            <OutlinedInput
                                                                                                fullWidth
                                                                                                type="text"
                                                                                                size="small"
                                                                                                disabled={todo.subcomponentcheck === false}
                                                                                                placeholder="Please Enter USB Port"
                                                                                                value={todo.usbport}
                                                                                                onChange={(e) => {
                                                                                                    const inputText = e.target.value;
                                                                                                    // Regex to allow only non-negative numbers
                                                                                                    const validatedInput =
                                                                                                        inputText.match(/^\d*$/);

                                                                                                    const sanitizedInput =
                                                                                                        validatedInput !== null
                                                                                                            ? validatedInput[0]
                                                                                                            : "0";
                                                                                                    handleChangeEdit(
                                                                                                        index,
                                                                                                        "usbport",
                                                                                                        sanitizedInput
                                                                                                    );
                                                                                                }}
                                                                                            />
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.paneltypescreen && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>Panel Type</Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        .find(
                                                                                                            (item) =>
                                                                                                                item.subcomponent ===
                                                                                                                todo.subname
                                                                                                        )
                                                                                                        ?.paneltype?.map((item) => ({
                                                                                                            ...item,
                                                                                                            label: item,
                                                                                                            value: item,
                                                                                                        }))}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.paneltypescreen,
                                                                                                        value: todo.paneltypescreen,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "paneltypescreen",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>

                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    handleClickOpenCapacity();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.resolution && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>
                                                                                                    Screen Resolution
                                                                                                </Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        .find(
                                                                                                            (item) =>
                                                                                                                item.subcomponent ===
                                                                                                                todo.subname
                                                                                                        )
                                                                                                        ?.screenresolution?.map(
                                                                                                            (item) => ({
                                                                                                                ...item,
                                                                                                                label: item,
                                                                                                                value: item,
                                                                                                            })
                                                                                                        )}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.resolution,
                                                                                                        value: todo.resolution,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "resolution",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>

                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
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
                                                                                                    handleClickOpenCapacity();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.connectivity && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>Connectivity</Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        .find(
                                                                                                            (item) =>
                                                                                                                item.subcomponent ===
                                                                                                                todo.subname
                                                                                                        )
                                                                                                        ?.connectivity?.map((item) => ({
                                                                                                            ...item,
                                                                                                            label: item,
                                                                                                            value: item,
                                                                                                        }))}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.connectivity,
                                                                                                        value: todo.connectivity,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "connectivity",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>

                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    handleClickOpenCapacity();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.daterate && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>Data Rate</Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        .find(
                                                                                                            (item) =>
                                                                                                                item.subcomponent ===
                                                                                                                todo.subname
                                                                                                        )
                                                                                                        ?.datarate?.map((item) => ({
                                                                                                            ...item,
                                                                                                            label: item,
                                                                                                            value: item,
                                                                                                        }))}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.daterate,
                                                                                                        value: todo.daterate,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "daterate",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>

                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    handleClickOpenCapacity();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.compatibledevice && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>
                                                                                                    Compatible Device
                                                                                                </Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        .find(
                                                                                                            (item) =>
                                                                                                                item.subcomponent ===
                                                                                                                todo.subname
                                                                                                        )
                                                                                                        ?.compatibledevices?.map(
                                                                                                            (item) => ({
                                                                                                                ...item,
                                                                                                                label: item,
                                                                                                                value: item,
                                                                                                            })
                                                                                                        )}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.compatibledevice,
                                                                                                        value: todo.compatibledevice,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "compatibledevice",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>

                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    handleClickOpenCapacity();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.outputpower && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>Output Power</Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        .find(
                                                                                                            (item) =>
                                                                                                                item.subcomponent ===
                                                                                                                todo.subname
                                                                                                        )
                                                                                                        ?.outputpower?.map((item) => ({
                                                                                                            ...item,
                                                                                                            label: item,
                                                                                                            value: item,
                                                                                                        }))}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.outputpower,
                                                                                                        value: todo.outputpower,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "outputpower",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>

                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    handleClickOpenCapacity();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.collingfancount && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>
                                                                                                    Cooling Fan Count
                                                                                                </Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        .find(
                                                                                                            (item) =>
                                                                                                                item.subcomponent ===
                                                                                                                todo.subname
                                                                                                        )
                                                                                                        ?.coolingfancount?.map(
                                                                                                            (item) => ({
                                                                                                                ...item,
                                                                                                                label: item,
                                                                                                                value: item,
                                                                                                            })
                                                                                                        )}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.collingfancount,
                                                                                                        value: todo.collingfancount,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "collingfancount",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>

                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    handleClickOpenCapacity();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.clockspeed && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>Clock Speed</Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        ?.find(
                                                                                                            (item) =>
                                                                                                                item.subcomponent ===
                                                                                                                todo.subname
                                                                                                        )
                                                                                                        ?.clockspeed?.map((item) => ({
                                                                                                            ...item,
                                                                                                            label: item,
                                                                                                            value: item,
                                                                                                        }))}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.clockspeed,
                                                                                                        value: todo.clockspeed,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "clockspeed",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>

                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    handleClickOpenCapacity();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.core && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>Core</Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        ?.find(
                                                                                                            (item) =>
                                                                                                                item.subcomponent ===
                                                                                                                todo.subname
                                                                                                        )
                                                                                                        ?.core?.map((item) => ({
                                                                                                            ...item,
                                                                                                            label: item,
                                                                                                            value: item,
                                                                                                        }))}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.core,
                                                                                                        value: todo.core,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "core",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>

                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    handleClickOpenCapacity();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.speed && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>Speed</Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        ?.find(
                                                                                                            (item) =>
                                                                                                                item.subcomponent ===
                                                                                                                todo.subname
                                                                                                        )
                                                                                                        ?.speed?.map((item) => ({
                                                                                                            ...item,
                                                                                                            label: item,
                                                                                                            value: item,
                                                                                                        }))}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.speed,
                                                                                                        value: todo.speed,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "speed",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>

                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    handleClickOpenCapacity();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.frequency && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>Frequency</Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        ?.find(
                                                                                                            (item) =>
                                                                                                                item.subcomponent ===
                                                                                                                todo.subname
                                                                                                        )
                                                                                                        ?.frequency?.map((item) => ({
                                                                                                            ...item,
                                                                                                            label: item,
                                                                                                            value: item,
                                                                                                        }))}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.frequency,
                                                                                                        value: todo.frequency,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "frequency",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>

                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    handleClickOpenCapacity();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.output && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>Output</Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        ?.find(
                                                                                                            (item) =>
                                                                                                                item.subcomponent ===
                                                                                                                todo.subname
                                                                                                        )
                                                                                                        ?.output?.map((item) => ({
                                                                                                            ...item,
                                                                                                            label: item,
                                                                                                            value: item,
                                                                                                        }))}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.output,
                                                                                                        value: todo.output,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "output",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>

                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    handleClickOpenCapacity();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.ethernetports && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>
                                                                                                    Ethernet Ports
                                                                                                </Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        ?.find(
                                                                                                            (item) =>
                                                                                                                item.subcomponent ===
                                                                                                                todo.subname
                                                                                                        )
                                                                                                        ?.ethernetports?.map((item) => ({
                                                                                                            ...item,
                                                                                                            label: item,
                                                                                                            value: item,
                                                                                                        }))}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.ethernetports,
                                                                                                        value: todo.ethernetports,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "ethernetports",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>

                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    handleClickOpenCapacity();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.distance && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>Distance</Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        ?.find(
                                                                                                            (item) =>
                                                                                                                item.subcomponent ===
                                                                                                                todo.subname
                                                                                                        )
                                                                                                        ?.distance?.map((item) => ({
                                                                                                            ...item,
                                                                                                            label: item,
                                                                                                            value: item,
                                                                                                        }))}
                                                                                                    styles={colourStyles}
                                                                                                    value={{
                                                                                                        label: todo.distance,
                                                                                                        value: todo.distance,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "distance",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>

                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    handleClickOpenCapacity();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.lengthname && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>Length</Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        ?.find(
                                                                                                            (item) =>
                                                                                                                item.subcomponent ===
                                                                                                                todo.subname
                                                                                                        )
                                                                                                        ?.lengthname?.map((item) => ({
                                                                                                            ...item,
                                                                                                            label: item,
                                                                                                            value: item,
                                                                                                        }))}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.lengthname,
                                                                                                        value: todo.lengthname,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "lengthname",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>

                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    handleClickOpenCapacity();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.slot && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>Slot</Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        ?.find(
                                                                                                            (item) =>
                                                                                                                item.subcomponent ===
                                                                                                                todo.subname
                                                                                                        )
                                                                                                        ?.slot?.map((item) => ({
                                                                                                            ...item,
                                                                                                            label: item,
                                                                                                            value: item,
                                                                                                        }))}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.slot,
                                                                                                        value: todo.slot,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "slot",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>

                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    handleClickOpenCapacity();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.noofchannels && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>
                                                                                                    No. Of Channels
                                                                                                </Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        ?.find(
                                                                                                            (item) =>
                                                                                                                item.subcomponent ===
                                                                                                                todo.subname
                                                                                                        )
                                                                                                        ?.noofchannels?.map((item) => ({
                                                                                                            ...item,
                                                                                                            label: item,
                                                                                                            value: item,
                                                                                                        }))}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.noofchannels,
                                                                                                        value: todo.noofchannels,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "noofchannels",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>

                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    handleClickOpenCapacity();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.colours && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>Colour</Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        ?.find(
                                                                                                            (item) =>
                                                                                                                item.subcomponent ===
                                                                                                                todo.subname
                                                                                                        )
                                                                                                        ?.colours?.map((item) => ({
                                                                                                            ...item,
                                                                                                            label: item,
                                                                                                            value: item,
                                                                                                        }))}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.colours,
                                                                                                        value: todo.colours,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "colours",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>

                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    handleClickOpenCapacity();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        <>
                                                                            <Grid item md={3} sm={6} xs={12}>
                                                                                <Grid container spacing={2}>
                                                                                    <Grid item md={10} sm={10} xs={10}>
                                                                                        <FormControl fullWidth size="small">
                                                                                            <Typography>Warranty</Typography>
                                                                                            <Select
                                                                                                fullWidth
                                                                                                labelId="demo-select-small"
                                                                                                id="demo-select-small"
                                                                                                value={todo.warranty}
                                                                                                disabled={todo.subcomponentcheck === false}
                                                                                                onChange={(e) => {
                                                                                                    handleChangeEdit(
                                                                                                        index,
                                                                                                        "warranty",
                                                                                                        e.target.value
                                                                                                    );
                                                                                                }}
                                                                                            >
                                                                                                <MenuItem value="" disabled>
                                                                                                    {" "}
                                                                                                    Please Select
                                                                                                </MenuItem>
                                                                                                <MenuItem value="Yes">
                                                                                                    {" "}
                                                                                                    {"Yes"}{" "}
                                                                                                </MenuItem>
                                                                                                <MenuItem value="No">
                                                                                                    {" "}
                                                                                                    {"No"}{" "}
                                                                                                </MenuItem>
                                                                                            </Select>
                                                                                        </FormControl>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </>

                                                                        {todo.warranty === "Yes" && (
                                                                            <>
                                                                                <Grid item md={3} sm={6} xs={12}>
                                                                                    <Grid container>
                                                                                        <Grid item md={6} xs={6} sm={6}>
                                                                                            <Typography>Warranty Time</Typography>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <OutlinedInput
                                                                                                    id="component-outlined"
                                                                                                    type="text"
                                                                                                    size="small"
                                                                                                    placeholder="Enter Time"
                                                                                                    value={todo.estimation}
                                                                                                    disabled={todo.subcomponentcheck === false}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "estimation",
                                                                                                            e.target.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>
                                                                                        <Grid item md={6} xs={6} sm={6}>
                                                                                            <Typography>Estimation</Typography>
                                                                                            <Select
                                                                                                fullWidth
                                                                                                labelId="demo-select-small"
                                                                                                id="demo-select-small"
                                                                                                size="small"
                                                                                                value={todo.estimationtime}
                                                                                                disabled={todo.subcomponentcheck === false}
                                                                                                onChange={(e) => {
                                                                                                    handleChangeEdit(
                                                                                                        index,
                                                                                                        "estimationtime",
                                                                                                        e.target.value
                                                                                                    );
                                                                                                }}
                                                                                            >
                                                                                                <MenuItem value="" disabled>
                                                                                                    {" "}
                                                                                                    Please Select
                                                                                                </MenuItem>
                                                                                                <MenuItem value="Days">
                                                                                                    {" "}
                                                                                                    {"Days"}{" "}
                                                                                                </MenuItem>
                                                                                                <MenuItem value="Month">
                                                                                                    {" "}
                                                                                                    {"Month"}{" "}
                                                                                                </MenuItem>
                                                                                                <MenuItem value="Year">
                                                                                                    {" "}
                                                                                                    {"Year"}{" "}
                                                                                                </MenuItem>
                                                                                            </Select>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}

                                                                        <>
                                                                            <Grid item md={3} sm={6} xs={12}>
                                                                                <Grid container spacing={2}>
                                                                                    <Grid item md={10} sm={10} xs={10}>
                                                                                        <FormControl fullWidth size="small">
                                                                                            <Typography>Purchase date </Typography>
                                                                                            <OutlinedInput
                                                                                                id="component-outlined"
                                                                                                type="date"
                                                                                                size="small"
                                                                                                value={todo.purchasedate}
                                                                                                disabled={todo.subcomponentcheck === false}
                                                                                                onChange={(e) => {
                                                                                                    handleChangeEdit(
                                                                                                        index,
                                                                                                        "purchasedate",
                                                                                                        e.target.value
                                                                                                    );
                                                                                                }}
                                                                                            />
                                                                                        </FormControl>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </>
                                                                        {todo.warranty === "Yes" && (
                                                                            <>
                                                                                <Grid item md={3} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>Expiry Date </Typography>
                                                                                                <OutlinedInput
                                                                                                    id="component-outlined"
                                                                                                    type="text"
                                                                                                    disabled={todo.subcomponentcheck === false}
                                                                                                    size="small"
                                                                                                    placeholder=""
                                                                                                    value={todo.warrantycalculation}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}

                                                                        <>
                                                                            <Grid item md={3} sm={6} xs={12}>
                                                                                <Grid container spacing={2}>
                                                                                    <Grid item md={10} sm={10} xs={10}>
                                                                                        <FormControl fullWidth size="small">
                                                                                            <Typography>
                                                                                                Vendor Group Name
                                                                                                <b style={{ color: "red" }}>*</b>
                                                                                            </Typography>
                                                                                            <Selects
                                                                                                options={vendorGroupOpt}
                                                                                                styles={colourStyles}
                                                                                                isDisabled={todo.subcomponentcheck === false}
                                                                                                value={{
                                                                                                    label: todo.vendorgroup,
                                                                                                    value: todo.vendorgroup,
                                                                                                }}
                                                                                                onChange={(e) => {
                                                                                                    handleChangeGroupNameIndexBasedEdit(
                                                                                                        e,
                                                                                                        index
                                                                                                    );
                                                                                                    handleChangeEdit(
                                                                                                        index,
                                                                                                        "vendorgroup",
                                                                                                        e.value
                                                                                                    );

                                                                                                    setTodosEdit((prev) => {
                                                                                                        const updated = [...prev];
                                                                                                        updated[index].vendor =
                                                                                                            "Choose Vendor";
                                                                                                        return updated;
                                                                                                    });
                                                                                                }}
                                                                                            />
                                                                                        </FormControl>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </Grid>
                                                                            <Grid item md={3} sm={6} xs={12}>
                                                                                <Grid container spacing={2}>
                                                                                    <Grid item md={10} sm={10} xs={10}>
                                                                                        <FormControl fullWidth size="small">
                                                                                            <Typography>
                                                                                                Vendor
                                                                                                <b style={{ color: "red" }}>*</b>
                                                                                            </Typography>
                                                                                            <Selects
                                                                                                options={vendorOptIndEdit[index]}
                                                                                                styles={colourStyles}
                                                                                                isDisabled={todo.subcomponentcheck === false}
                                                                                                value={{
                                                                                                    label: todo.vendor,
                                                                                                    value: todo.vendor,
                                                                                                }}
                                                                                                onChange={(e) => {
                                                                                                    handleChangeEdit(
                                                                                                        index,
                                                                                                        "vendor",
                                                                                                        e.value,
                                                                                                        e._id
                                                                                                    );

                                                                                                    // vendoridEdit(e._id);
                                                                                                }}
                                                                                            />
                                                                                        </FormControl>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </>

                                                                        <>
                                                                            <Grid item md={3} sm={6} xs={12}>
                                                                                <Grid container spacing={2}>
                                                                                    <Grid item md={10} sm={10} xs={10}>
                                                                                        <FormControl fullWidth size="small">
                                                                                            <Typography>Address</Typography>
                                                                                            <OutlinedInput
                                                                                                id="component-outlined"
                                                                                                type="text"
                                                                                                disabled={todo.subcomponentcheck === false}
                                                                                                // value={vendorgetid?.address}
                                                                                                value={todo?.address}
                                                                                                readOnly
                                                                                            />
                                                                                        </FormControl>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </>

                                                                        <>
                                                                            <Grid item md={3} sm={6} xs={12}>
                                                                                <Grid container spacing={2}>
                                                                                    <Grid item md={10} sm={10} xs={10}>
                                                                                        <FormControl fullWidth size="small">
                                                                                            <Typography>Phone Number</Typography>
                                                                                            <OutlinedInput
                                                                                                id="component-outlined"
                                                                                                disabled={todo.subcomponentcheck === false}
                                                                                                type="text"
                                                                                                // value={vendorgetid?.phonenumber}
                                                                                                value={todo?.phonenumber}
                                                                                                readOnly
                                                                                            />
                                                                                        </FormControl>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </>
                                                                    </>
                                                                )}


                                                                {/* <Grid item md={1} sm={3} xs={3}>
                              
                                <Button
                                  sx={{
                                    padding: "14px 14px",
                                    marginTop: "16px",
                                    minWidth: "40px !important",
                                    borderRadius: "50% !important",
                                    ":hover": {
                                      backgroundColor: "#80808036", 
                                    },
                                  }}
                                  onClick={() => handleDeleteEdit(index)}
                                >
                                  <FaTrash
                                    style={{
                                      fontSize: "large",
                                      color: "#a73131",
                                    }}
                                  />
                                </Button>
                             
                              </Grid> */}
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                ) : (
                                                    <Grid container key={index} spacing={1}>
                                                        <Grid item md={12} sm={12} xs={12} marginTop={2}>
                                                            <Grid container key={index} spacing={1}>
                                                                <>
                                                                    <Grid item md={3} sm={6} xs={12}>
                                                                        <Grid container spacing={2}>
                                                                            <Grid item md={10} sm={10} xs={10}>


                                                                                <FormGroup>
                                                                                    <FormControlLabel

                                                                                        control={
                                                                                            <Switch
                                                                                                // color="success"
                                                                                                sx={{
                                                                                                    "& .MuiSwitch-switchBase.Mui-checked": {
                                                                                                        color: "green", // Thumb color when checked
                                                                                                    },
                                                                                                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                                                                                        backgroundColor: "green", // Track color when checked
                                                                                                    },
                                                                                                    "& .MuiSwitch-switchBase": {
                                                                                                        color: "#ff0000a3", // Thumb color when not checked
                                                                                                    },
                                                                                                    "& .MuiSwitch-switchBase + .MuiSwitch-track": {
                                                                                                        backgroundColor: "#ff0000a3", // Track color when not checked
                                                                                                    },
                                                                                                }}
                                                                                                checked={todo.subcomponentcheck}
                                                                                                onChange={(e) => {
                                                                                                    handleChangeEdit(
                                                                                                        index,
                                                                                                        "subcomponentcheck",
                                                                                                        e.target.checked
                                                                                                    );
                                                                                                }}
                                                                                            />
                                                                                        }
                                                                                        label="Enable Subcomponent"
                                                                                    />
                                                                                </FormGroup>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                </>
                                                                {todo.subcomponentcheck === true && (
                                                                    <>
                                                                        {todo.type && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>Type</Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        .find(
                                                                                                            (item) =>
                                                                                                                stockmasteredit.component ===
                                                                                                                item.component &&
                                                                                                                stockmasteredit.productname ===
                                                                                                                item.assetmaterial
                                                                                                        )
                                                                                                        ?.type?.map((item) => ({
                                                                                                            ...item,
                                                                                                            label: item,
                                                                                                            value: item,
                                                                                                        }))}
                                                                                                    styles={colourStyles}
                                                                                                    value={{
                                                                                                        label: todo.type,
                                                                                                        value: todo.type,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "type",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>
                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    // handleClickOpenType();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.model && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>Model</Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        .find(
                                                                                                            (item) =>
                                                                                                                stockmasteredit.component ===
                                                                                                                item.component &&
                                                                                                                stockmasteredit.productname ===
                                                                                                                item.assetmaterial
                                                                                                        )
                                                                                                        ?.model?.map((item) => ({
                                                                                                            ...item,
                                                                                                            label: item,
                                                                                                            value: item,
                                                                                                        }))}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.model,
                                                                                                        value: todo.model,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "model",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>
                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    // handleClickOpenModel();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.size && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>Size</Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        .find(
                                                                                                            (item) =>
                                                                                                                stockmasteredit.component ===
                                                                                                                item.component &&
                                                                                                                stockmasteredit.productname ===
                                                                                                                item.assetmaterial
                                                                                                        )
                                                                                                        ?.size?.map((item) => ({
                                                                                                            ...item,
                                                                                                            label: item,
                                                                                                            value: item,
                                                                                                        }))}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.size,
                                                                                                        value: todo.size,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "size",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>
                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    handleClickOpenSize();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.variant && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>Variants</Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        .find(
                                                                                                            (item) =>
                                                                                                                stockmasteredit.component ===
                                                                                                                item.component &&
                                                                                                                stockmasteredit.productname ===
                                                                                                                item.assetmaterial
                                                                                                        )
                                                                                                        ?.variant?.map((item) => ({
                                                                                                            ...item,
                                                                                                            label: item,
                                                                                                            value: item,
                                                                                                        }))}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.variant,
                                                                                                        value: todo.variant,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "variant",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>
                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                size="small"
                                                                                                variant="contained"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    handleClickOpenVariant();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.brand && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl size="small" fullWidth>
                                                                                                <Typography>Brand</Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        .find(
                                                                                                            (item) =>
                                                                                                                stockmasteredit.component ===
                                                                                                                item.component &&
                                                                                                                stockmasteredit.productname ===
                                                                                                                item.assetmaterial
                                                                                                        )
                                                                                                        ?.brand?.map((item) => ({
                                                                                                            ...item,
                                                                                                            label: item,
                                                                                                            value: item,
                                                                                                        }))}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.brand,
                                                                                                        value: todo.brand,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "brand",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>
                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    // handleClickOpenBrand();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.serial !== undefined && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container>
                                                                                        <Grid item md={11.6} sm={10} xs={10}>
                                                                                            <Typography>Serial</Typography>

                                                                                            <OutlinedInput
                                                                                                fullWidth
                                                                                                type="text"
                                                                                                size="small"
                                                                                                placeholder="Please Enter Serial"
                                                                                                value={todo.serial}
                                                                                                disabled={todo.subcomponentcheck === false}
                                                                                                onChange={(e) => {
                                                                                                    handleChangeEdit(
                                                                                                        index,
                                                                                                        "serial",
                                                                                                        e.target.value
                                                                                                    );
                                                                                                }}
                                                                                            />
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.other !== undefined && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container>
                                                                                        <Grid item md={11.6} sm={10} xs={10}>
                                                                                            <Typography>Others</Typography>

                                                                                            <OutlinedInput
                                                                                                fullWidth
                                                                                                type="text"
                                                                                                size="small"
                                                                                                placeholder="Please Enter Other"
                                                                                                value={todo.other}
                                                                                                disabled={todo.subcomponentcheck === false}
                                                                                                onChange={(e) => {
                                                                                                    handleChangeEdit(
                                                                                                        index,
                                                                                                        "other",
                                                                                                        e.target.value
                                                                                                    );
                                                                                                }}
                                                                                            />
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.capacity && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>Capacity</Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        .find(
                                                                                                            (item) =>
                                                                                                                stockmasteredit.component ===
                                                                                                                item.component &&
                                                                                                                stockmasteredit.productname ===
                                                                                                                item.assetmaterial
                                                                                                        )
                                                                                                        ?.capacity?.map((item) => ({
                                                                                                            ...item,
                                                                                                            label: item,
                                                                                                            value: item,
                                                                                                        }))}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.capacity,
                                                                                                        value: todo.capacity,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "capacity",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>

                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    handleClickOpenCapacity();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.hdmiport !== undefined && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container>
                                                                                        <Grid item md={11.6} sm={10} xs={10}>
                                                                                            <Typography>HDMI Port</Typography>

                                                                                            <OutlinedInput
                                                                                                fullWidth
                                                                                                type="text"
                                                                                                size="small"
                                                                                                placeholder="Please Enter HDMI Port"
                                                                                                value={todo.hdmiport}
                                                                                                disabled={todo.subcomponentcheck === false}
                                                                                                onChange={(e) => {
                                                                                                    const inputText = e.target.value;
                                                                                                    // Regex to allow only non-negative numbers
                                                                                                    const validatedInput =
                                                                                                        inputText.match(/^\d*$/);

                                                                                                    const sanitizedInput =
                                                                                                        validatedInput !== null
                                                                                                            ? validatedInput[0]
                                                                                                            : "0";
                                                                                                    handleChangeEdit(
                                                                                                        index,
                                                                                                        "hdmiport",
                                                                                                        sanitizedInput
                                                                                                    );
                                                                                                }}
                                                                                            />
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.vgaport !== undefined && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container>
                                                                                        <Grid item md={11.6} sm={10} xs={10}>
                                                                                            <Typography>VGA Port</Typography>

                                                                                            <OutlinedInput
                                                                                                fullWidth
                                                                                                type="text"
                                                                                                size="small"
                                                                                                placeholder="Please Enter VGA Port"
                                                                                                value={todo.vgaport}
                                                                                                disabled={todo.subcomponentcheck === false}
                                                                                                onChange={(e) => {
                                                                                                    const inputText = e.target.value;
                                                                                                    // Regex to allow only non-negative numbers
                                                                                                    const validatedInput =
                                                                                                        inputText.match(/^\d*$/);

                                                                                                    const sanitizedInput =
                                                                                                        validatedInput !== null
                                                                                                            ? validatedInput[0]
                                                                                                            : "0";
                                                                                                    handleChangeEdit(
                                                                                                        index,
                                                                                                        "vgaport",
                                                                                                        sanitizedInput
                                                                                                    );
                                                                                                }}
                                                                                            />
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.dpport !== undefined && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container>
                                                                                        <Grid item md={11.6} sm={10} xs={10}>
                                                                                            <Typography>DP Port</Typography>

                                                                                            <OutlinedInput
                                                                                                fullWidth
                                                                                                type="text"
                                                                                                size="small"
                                                                                                placeholder="Please Enter DP Port"
                                                                                                value={todo.dpport}
                                                                                                disabled={todo.subcomponentcheck === false}
                                                                                                onChange={(e) => {
                                                                                                    const inputText = e.target.value;
                                                                                                    // Regex to allow only non-negative numbers
                                                                                                    const validatedInput =
                                                                                                        inputText.match(/^\d*$/);

                                                                                                    const sanitizedInput =
                                                                                                        validatedInput !== null
                                                                                                            ? validatedInput[0]
                                                                                                            : "0";
                                                                                                    handleChangeEdit(
                                                                                                        index,
                                                                                                        "dpport",
                                                                                                        sanitizedInput
                                                                                                    );
                                                                                                }}
                                                                                            />
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.usbport !== undefined && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container>
                                                                                        <Grid item md={11.6} sm={10} xs={10}>
                                                                                            <Typography>USB Port</Typography>

                                                                                            <OutlinedInput
                                                                                                fullWidth
                                                                                                type="text"
                                                                                                size="small"
                                                                                                placeholder="Please Enter USB Port"
                                                                                                value={todo.usbport}
                                                                                                disabled={todo.subcomponentcheck === false}
                                                                                                onChange={(e) => {
                                                                                                    const inputText = e.target.value;
                                                                                                    // Regex to allow only non-negative numbers
                                                                                                    const validatedInput =
                                                                                                        inputText.match(/^\d*$/);

                                                                                                    const sanitizedInput =
                                                                                                        validatedInput !== null
                                                                                                            ? validatedInput[0]
                                                                                                            : "0";
                                                                                                    handleChangeEdit(
                                                                                                        index,
                                                                                                        "usbport",
                                                                                                        sanitizedInput
                                                                                                    );
                                                                                                }}
                                                                                            />
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}

                                                                        {todo.paneltypescreen && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>Panel Type</Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        .find(
                                                                                                            (item) =>
                                                                                                                stockmasteredit.component ===
                                                                                                                item.component &&
                                                                                                                stockmasteredit.productname ===
                                                                                                                item.assetmaterial
                                                                                                        )
                                                                                                        ?.paneltype?.map((item) => ({
                                                                                                            ...item,
                                                                                                            label: item,
                                                                                                            value: item,
                                                                                                        }))}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.paneltypescreen,
                                                                                                        value: todo.paneltypescreen,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "paneltypescreen",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>

                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    handleClickOpenCapacity();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.resolution && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>
                                                                                                    Screen Resolution
                                                                                                </Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        .find(
                                                                                                            (item) =>
                                                                                                                stockmasteredit.component ===
                                                                                                                item.component &&
                                                                                                                stockmasteredit.productname ===
                                                                                                                item.assetmaterial
                                                                                                        )
                                                                                                        ?.screenresolution?.map(
                                                                                                            (item) => ({
                                                                                                                ...item,
                                                                                                                label: item,
                                                                                                                value: item,
                                                                                                            })
                                                                                                        )}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.resolution,
                                                                                                        value: todo.resolution,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "resolution",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>

                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    handleClickOpenCapacity();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.connectivity && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>Connectivity</Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        .find(
                                                                                                            (item) =>
                                                                                                                stockmasteredit.component ===
                                                                                                                item.component &&
                                                                                                                stockmasteredit.productname ===
                                                                                                                item.assetmaterial
                                                                                                        )
                                                                                                        ?.connectivity?.map((item) => ({
                                                                                                            ...item,
                                                                                                            label: item,
                                                                                                            value: item,
                                                                                                        }))}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.connectivity,
                                                                                                        value: todo.connectivity,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "connectivity",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>

                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    handleClickOpenCapacity();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.daterate && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>Data Rate</Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        .find(
                                                                                                            (item) =>
                                                                                                                stockmasteredit.component ===
                                                                                                                item.component &&
                                                                                                                stockmasteredit.productname ===
                                                                                                                item.assetmaterial
                                                                                                        )
                                                                                                        ?.datarate?.map((item) => ({
                                                                                                            ...item,
                                                                                                            label: item,
                                                                                                            value: item,
                                                                                                        }))}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.daterate,
                                                                                                        value: todo.daterate,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "daterate",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>

                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    handleClickOpenCapacity();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.compatibledevice && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>
                                                                                                    Compatible Device
                                                                                                </Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        .find(
                                                                                                            (item) =>
                                                                                                                stockmasteredit.component ===
                                                                                                                item.component &&
                                                                                                                stockmasteredit.productname ===
                                                                                                                item.assetmaterial
                                                                                                        )
                                                                                                        ?.compatibledevices?.map(
                                                                                                            (item) => ({
                                                                                                                ...item,
                                                                                                                label: item,
                                                                                                                value: item,
                                                                                                            })
                                                                                                        )}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.compatibledevice,
                                                                                                        value: todo.compatibledevice,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "compatibledevice",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>

                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    handleClickOpenCapacity();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.outputpower && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>Output Power</Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        .find(
                                                                                                            (item) =>
                                                                                                                stockmasteredit.component ===
                                                                                                                item.component &&
                                                                                                                stockmasteredit.productname ===
                                                                                                                item.assetmaterial
                                                                                                        )
                                                                                                        ?.outputpower?.map((item) => ({
                                                                                                            ...item,
                                                                                                            label: item,
                                                                                                            value: item,
                                                                                                        }))}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.outputpower,
                                                                                                        value: todo.outputpower,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "outputpower",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>

                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    handleClickOpenCapacity();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.collingfancount && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>
                                                                                                    Cooling Fan Count
                                                                                                </Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        .find(
                                                                                                            (item) =>
                                                                                                                stockmasteredit.component ===
                                                                                                                item.component &&
                                                                                                                stockmasteredit.productname ===
                                                                                                                item.assetmaterial
                                                                                                        )
                                                                                                        ?.coolingfancount?.map(
                                                                                                            (item) => ({
                                                                                                                ...item,
                                                                                                                label: item,
                                                                                                                value: item,
                                                                                                            })
                                                                                                        )}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.collingfancount,
                                                                                                        value: todo.collingfancount,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "collingfancount",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>

                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    handleClickOpenCapacity();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.clockspeed && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>Clock Speed</Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        .find(
                                                                                                            (item) =>
                                                                                                                stockmasteredit.component ===
                                                                                                                item.component &&
                                                                                                                stockmasteredit.productname ===
                                                                                                                item.assetmaterial
                                                                                                        )
                                                                                                        ?.clockspeed?.map((item) => ({
                                                                                                            ...item,
                                                                                                            label: item,
                                                                                                            value: item,
                                                                                                        }))}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.clockspeed,
                                                                                                        value: todo.clockspeed,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "clockspeed",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>

                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    handleClickOpenCapacity();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.core && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>Core</Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        .find(
                                                                                                            (item) =>
                                                                                                                stockmasteredit.component ===
                                                                                                                item.component &&
                                                                                                                stockmasteredit.productname ===
                                                                                                                item.assetmaterial
                                                                                                        )
                                                                                                        ?.core?.map((item) => ({
                                                                                                            ...item,
                                                                                                            label: item,
                                                                                                            value: item,
                                                                                                        }))}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.core,
                                                                                                        value: todo.core,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "core",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>

                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    handleClickOpenCapacity();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.speed && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>Speed</Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        .find(
                                                                                                            (item) =>
                                                                                                                stockmasteredit.component ===
                                                                                                                item.component &&
                                                                                                                stockmasteredit.productname ===
                                                                                                                item.assetmaterial
                                                                                                        )
                                                                                                        ?.speed?.map((item) => ({
                                                                                                            ...item,
                                                                                                            label: item,
                                                                                                            value: item,
                                                                                                        }))}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.speed,
                                                                                                        value: todo.speed,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "speed",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>

                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    handleClickOpenCapacity();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.frequency && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>Frequency</Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        .find(
                                                                                                            (item) =>
                                                                                                                stockmasteredit.component ===
                                                                                                                item.component &&
                                                                                                                stockmasteredit.productname ===
                                                                                                                item.assetmaterial
                                                                                                        )
                                                                                                        ?.frequency?.map((item) => ({
                                                                                                            ...item,
                                                                                                            label: item,
                                                                                                            value: item,
                                                                                                        }))}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.frequency,
                                                                                                        value: todo.frequency,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "frequency",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>

                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    handleClickOpenCapacity();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.output && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>Output</Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        .find(
                                                                                                            (item) =>
                                                                                                                stockmasteredit.component ===
                                                                                                                item.component &&
                                                                                                                stockmasteredit.productname ===
                                                                                                                item.assetmaterial
                                                                                                        )
                                                                                                        ?.output?.map((item) => ({
                                                                                                            ...item,
                                                                                                            label: item,
                                                                                                            value: item,
                                                                                                        }))}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.output,
                                                                                                        value: todo.output,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "output",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>

                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    handleClickOpenCapacity();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.ethernetports && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>
                                                                                                    Ethernet Ports
                                                                                                </Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        .find(
                                                                                                            (item) =>
                                                                                                                stockmasteredit.component ===
                                                                                                                item.component &&
                                                                                                                stockmasteredit.productname ===
                                                                                                                item.assetmaterial
                                                                                                        )
                                                                                                        ?.ethernetports?.map((item) => ({
                                                                                                            ...item,
                                                                                                            label: item,
                                                                                                            value: item,
                                                                                                        }))}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.ethernetports,
                                                                                                        value: todo.ethernetports,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "ethernetports",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>

                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    handleClickOpenCapacity();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.distance && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>Distance</Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        .find(
                                                                                                            (item) =>
                                                                                                                stockmasteredit.component ===
                                                                                                                item.component &&
                                                                                                                stockmasteredit.productname ===
                                                                                                                item.assetmaterial
                                                                                                        )
                                                                                                        ?.distance?.map((item) => ({
                                                                                                            ...item,
                                                                                                            label: item,
                                                                                                            value: item,
                                                                                                        }))}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.distance,
                                                                                                        value: todo.distance,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "distance",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>

                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    handleClickOpenCapacity();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.lengthname && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>Length</Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        .find(
                                                                                                            (item) =>
                                                                                                                stockmasteredit.component ===
                                                                                                                item.component &&
                                                                                                                stockmasteredit.productname ===
                                                                                                                item.assetmaterial
                                                                                                        )
                                                                                                        ?.lengthname?.map((item) => ({
                                                                                                            ...item,
                                                                                                            label: item,
                                                                                                            value: item,
                                                                                                        }))}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.lengthname,
                                                                                                        value: todo.lengthname,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "lengthname",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>

                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    handleClickOpenCapacity();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.slot && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>Slot</Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        .find(
                                                                                                            (item) =>
                                                                                                                stockmasteredit.component ===
                                                                                                                item.component &&
                                                                                                                stockmasteredit.productname ===
                                                                                                                item.assetmaterial
                                                                                                        )
                                                                                                        ?.slot?.map((item) => ({
                                                                                                            ...item,
                                                                                                            label: item,
                                                                                                            value: item,
                                                                                                        }))}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.slot,
                                                                                                        value: todo.slot,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "slot",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>

                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    handleClickOpenCapacity();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.noofchannels && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>
                                                                                                    No. Of Channels
                                                                                                </Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        .find(
                                                                                                            (item) =>
                                                                                                                stockmasteredit.component ===
                                                                                                                item.component &&
                                                                                                                stockmasteredit.productname ===
                                                                                                                item.assetmaterial
                                                                                                        )
                                                                                                        ?.noofchannels?.map((item) => ({
                                                                                                            ...item,
                                                                                                            label: item,
                                                                                                            value: item,
                                                                                                        }))}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.noofchannels,
                                                                                                        value: todo.noofchannels,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "noofchannels",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>

                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    handleClickOpenCapacity();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                        {todo.colours && (
                                                                            <>
                                                                                <Grid item md={4} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>Colour</Typography>
                                                                                                <Selects
                                                                                                    options={specificationGroupingEdit
                                                                                                        .find(
                                                                                                            (item) =>
                                                                                                                stockmasteredit.component ===
                                                                                                                item.component &&
                                                                                                                stockmasteredit.productname ===
                                                                                                                item.assetmaterial
                                                                                                        )
                                                                                                        ?.colours?.map((item) => ({
                                                                                                            ...item,
                                                                                                            label: item,
                                                                                                            value: item,
                                                                                                        }))}
                                                                                                    styles={colourStyles}
                                                                                                    isDisabled={todo.subcomponentcheck === false}
                                                                                                    value={{
                                                                                                        label: todo.colours,
                                                                                                        value: todo.colours,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "colours",
                                                                                                            e.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>

                                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                disabled
                                                                                                style={{
                                                                                                    height: "30px",
                                                                                                    minWidth: "20px",
                                                                                                    padding: "19px 13px",
                                                                                                    // color: "white",
                                                                                                    marginTop: "23px",
                                                                                                    marginLeft: "-10px",
                                                                                                    // background: "rgb(25, 118, 210)",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    handleClickOpenCapacity();
                                                                                                }}
                                                                                            >
                                                                                                <FaPlus
                                                                                                    style={{ fontSize: "15px" }}
                                                                                                />
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}

                                                                        <>
                                                                            <Grid item md={3} sm={6} xs={12}>
                                                                                <Grid container spacing={2}>
                                                                                    <Grid item md={10} sm={10} xs={10}>
                                                                                        <FormControl fullWidth size="small">
                                                                                            <Typography>
                                                                                                Warranty{" "}
                                                                                                <b style={{ color: "red" }}>*</b>
                                                                                            </Typography>
                                                                                            <Select
                                                                                                fullWidth
                                                                                                labelId="demo-select-small"
                                                                                                id="demo-select-small"
                                                                                                size="small"
                                                                                                disabled={todo.subcomponentcheck === false}
                                                                                                value={todo.warranty}
                                                                                                // onChange={(e) => {
                                                                                                //   setAssetdetail({ ...assetdetail, warranty: e.target.value });
                                                                                                // }}
                                                                                                // value={todo.serial}
                                                                                                onChange={(e) => {
                                                                                                    handleChangeEdit(
                                                                                                        index,
                                                                                                        "warranty",
                                                                                                        e.target.value
                                                                                                    );
                                                                                                }}
                                                                                            >
                                                                                                <MenuItem value="" disabled>
                                                                                                    {" "}
                                                                                                    Please Select
                                                                                                </MenuItem>
                                                                                                <MenuItem value="Yes">
                                                                                                    {" "}
                                                                                                    {"Yes"}{" "}
                                                                                                </MenuItem>
                                                                                                <MenuItem value="No">
                                                                                                    {" "}
                                                                                                    {"No"}{" "}
                                                                                                </MenuItem>
                                                                                            </Select>
                                                                                        </FormControl>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </>

                                                                        {todo.warranty === "Yes" && (
                                                                            <>
                                                                                <Grid item md={3} sm={6} xs={12}>
                                                                                    <Grid container>
                                                                                        <Grid item md={6} xs={6} sm={6}>
                                                                                            <Typography>
                                                                                                Warranty Time{" "}
                                                                                                <b style={{ color: "red" }}>*</b>
                                                                                            </Typography>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <OutlinedInput
                                                                                                    id="component-outlined"
                                                                                                    type="text"
                                                                                                    size="small"
                                                                                                    placeholder="Enter Time"
                                                                                                    value={todo.estimation}
                                                                                                    disabled={todo.subcomponentcheck === false}
                                                                                                    onChange={(e) => {
                                                                                                        handleChangeEdit(
                                                                                                            index,
                                                                                                            "estimation",
                                                                                                            e.target.value
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>
                                                                                        <Grid item md={6} xs={6} sm={6}>
                                                                                            <Typography>
                                                                                                Estimation{" "}
                                                                                                <b style={{ color: "red" }}>*</b>
                                                                                            </Typography>
                                                                                            <Select
                                                                                                fullWidth
                                                                                                labelId="demo-select-small"
                                                                                                id="demo-select-small"
                                                                                                size="small"
                                                                                                value={todo.estimationtime}
                                                                                                disabled={todo.subcomponentcheck === false}
                                                                                                onChange={(e) => {
                                                                                                    handleChangeEdit(
                                                                                                        index,
                                                                                                        "estimationtime",
                                                                                                        e.target.value
                                                                                                    );
                                                                                                    // handleEstimationChange()
                                                                                                }}
                                                                                            // onChange={handleEstimationChange}
                                                                                            >
                                                                                                <MenuItem value="" disabled>
                                                                                                    {" "}
                                                                                                    Please Select
                                                                                                </MenuItem>
                                                                                                <MenuItem value="Days">
                                                                                                    {" "}
                                                                                                    {"Days"}{" "}
                                                                                                </MenuItem>
                                                                                                <MenuItem value="Month">
                                                                                                    {" "}
                                                                                                    {"Month"}{" "}
                                                                                                </MenuItem>
                                                                                                <MenuItem value="Year">
                                                                                                    {" "}
                                                                                                    {"Year"}{" "}
                                                                                                </MenuItem>
                                                                                            </Select>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}

                                                                        <>
                                                                            <Grid item md={3} sm={6} xs={12}>
                                                                                <Grid container spacing={2}>
                                                                                    <Grid item md={10} sm={10} xs={10}>
                                                                                        <FormControl fullWidth size="small">
                                                                                            <Typography>Purchase date </Typography>
                                                                                            <OutlinedInput
                                                                                                id="component-outlined"
                                                                                                type="date"
                                                                                                size="small"
                                                                                                value={todo.purchasedate}
                                                                                                disabled={todo.subcomponentcheck === false}
                                                                                                onChange={(e) => {
                                                                                                    handleChangeEdit(
                                                                                                        index,
                                                                                                        "purchasedate",
                                                                                                        e.target.value
                                                                                                    );
                                                                                                    // handlePurchaseDateChange()
                                                                                                }}
                                                                                            // onChange={handlePurchaseDateChange}
                                                                                            />
                                                                                        </FormControl>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </>
                                                                        {todo.warranty === "Yes" && (
                                                                            <>
                                                                                <Grid item md={3} sm={6} xs={12}>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={10} xs={10}>
                                                                                            <FormControl fullWidth size="small">
                                                                                                <Typography>Expiry Date </Typography>
                                                                                                <OutlinedInput
                                                                                                    id="component-outlined"
                                                                                                    type="text"
                                                                                                    size="small"
                                                                                                    placeholder=""
                                                                                                    disabled={todo.subcomponentcheck === false}
                                                                                                    value={todo.warrantycalculation}
                                                                                                // onChange={(e) => {
                                                                                                //   setAssetdetail({ ...assetdetail, warrantyCalculation: e.target.value });
                                                                                                // }}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}

                                                                        <>
                                                                            <Grid item md={3} sm={6} xs={12}>
                                                                                <Grid container spacing={2}>
                                                                                    <Grid item md={10} sm={10} xs={10}>
                                                                                        <FormControl fullWidth size="small">
                                                                                            <Typography>
                                                                                                Vendor Group Name
                                                                                                <b style={{ color: "red" }}>*</b>
                                                                                            </Typography>
                                                                                            <Selects
                                                                                                options={vendorGroupOpt}
                                                                                                styles={colourStyles}
                                                                                                isDisabled={todo.subcomponentcheck === false}
                                                                                                value={{
                                                                                                    label: todo.vendorgroup,
                                                                                                    value: todo.vendorgroup,
                                                                                                }}
                                                                                                onChange={(e) => {
                                                                                                    handleChangeGroupNameIndexBasedEdit(
                                                                                                        e,
                                                                                                        index
                                                                                                    );
                                                                                                    handleChangeEdit(
                                                                                                        index,
                                                                                                        "vendorgroup",
                                                                                                        e.value
                                                                                                    );

                                                                                                    setTodosEdit((prev) => {
                                                                                                        const updated = [...prev];
                                                                                                        updated[index].vendor =
                                                                                                            "Choose Vendor";
                                                                                                        return updated;
                                                                                                    });
                                                                                                }}
                                                                                            />
                                                                                        </FormControl>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </Grid>
                                                                            <Grid item md={3} sm={6} xs={12}>
                                                                                <Grid container spacing={2}>
                                                                                    <Grid item md={10} sm={10} xs={10}>
                                                                                        <FormControl fullWidth size="small">
                                                                                            <Typography>
                                                                                                Vendor
                                                                                                <b style={{ color: "red" }}>*</b>
                                                                                            </Typography>
                                                                                            <Selects
                                                                                                options={vendorOptIndEdit[index]}
                                                                                                styles={colourStyles}
                                                                                                isDisabled={todo.subcomponentcheck === false}
                                                                                                value={{
                                                                                                    label: todo.vendor,
                                                                                                    value: todo.vendor,
                                                                                                }}
                                                                                                onChange={(e) => {
                                                                                                    handleChangeEdit(
                                                                                                        index,
                                                                                                        "vendor",
                                                                                                        e.value,
                                                                                                        e._id
                                                                                                    );

                                                                                                    // vendoridEdit(e._id);
                                                                                                }}
                                                                                            />
                                                                                        </FormControl>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </>

                                                                        <>
                                                                            <Grid item md={3} sm={6} xs={12}>
                                                                                <Grid container spacing={2}>
                                                                                    <Grid item md={10} sm={10} xs={10}>
                                                                                        <FormControl fullWidth size="small">
                                                                                            <Typography>Address</Typography>
                                                                                            <OutlinedInput
                                                                                                id="component-outlined"
                                                                                                type="text"
                                                                                                disabled={todo.subcomponentcheck === false}
                                                                                                // value={vendorgetid?.address}
                                                                                                value={todo?.address}
                                                                                                readOnly
                                                                                            />
                                                                                        </FormControl>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </>

                                                                        <>
                                                                            <Grid item md={3} sm={6} xs={12}>
                                                                                <Grid container spacing={2}>
                                                                                    <Grid item md={10} sm={10} xs={10}>
                                                                                        <FormControl fullWidth size="small">
                                                                                            <Typography>Phone Number</Typography>
                                                                                            <OutlinedInput
                                                                                                id="component-outlined"
                                                                                                type="text"
                                                                                                disabled={todo.subcomponentcheck === false}
                                                                                                // value={vendorgetid?.phonenumber}
                                                                                                value={todo?.phonenumber}
                                                                                                readOnly
                                                                                            />
                                                                                        </FormControl>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </>

                                                                    </>
                                                                )}

                                                                {/* <Grid item md={1} sm={3} xs={3}>
                                <Button
                                  sx={{
                                    padding: "14px 14px",
                                    marginTop: "16px",
                                    minWidth: "40px !important",
                                    borderRadius: "50% !important",
                                    ":hover": {
                                      backgroundColor: "#80808036", // theme.palette.primary.main
                                    },
                                  }}
                                  onClick={() => handleDeleteEdit(index)}
                                >
                                  <FaTrash
                                    style={{
                                      fontSize: "large",
                                      color: "#a73131",
                                    }}
                                  />
                                </Button>
                              </Grid> */}
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                )}
                                                <br />
                                            </>
                                        );
                                    })}
                                <br />
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={3} sm={12} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Product Details <b style={{ color: "red" }}>*</b>{" "}
                                            </Typography>
                                            <TextareaAutosize
                                                aria-label="minimum height"
                                                minRows={2}
                                                value={stockmasteredit.productdetails}
                                                placeholder="Please Enter Product Details"
                                            // onChange={(e) => {
                                            //     setStockmasteredit({
                                            //         ...stockmasteredit,
                                            //         productdetails: e.target.value,
                                            //     });
                                            // }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    {stockmasteredit.warranty === "Yes" && (
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Warranty Details <b style={{ color: "red" }}>*</b>{" "}
                                                </Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    value={stockmasteredit.warrantydetails}
                                                    sx={userStyle.input}
                                                    placeholder="Please Enter Warranty Details"
                                                // onChange={(e) => {
                                                //     setStockmasteredit({
                                                //         ...stockmasteredit,
                                                //         warrantydetails: e.target.value,
                                                //     });
                                                // }}
                                                />
                                            </FormControl>
                                        </Grid>
                                    )}
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl size="small" fullWidth>
                                            <Typography>
                                                UOM <b style={{ color: "red" }}>*</b>{" "}
                                            </Typography>
                                            <Selects
                                                options={vomMasterget}
                                                styles={colourStyles}
                                                value={{
                                                    label: stockmasteredit.uom,
                                                    value: stockmasteredit.uom,
                                                }}
                                            // onChange={(e) => {
                                            //     setStockmasteredit({
                                            //         ...stockmasteredit,
                                            //         uom: e.value,
                                            //     });
                                            // }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} sm={12} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Qty<b style={{ color: "red" }}>*</b>{" "}
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="number"
                                                sx={userStyle.input}
                                                placeholder="Please Enter Quantity"
                                                value={stockmasteredit.quantity}
                                                onChange={(e) => {
                                                    setStockmasteredit({
                                                        ...stockmasteredit,
                                                        quantity: e.target.value,
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
                                                value={stockmasteredit.rate}
                                            // onChange={(e) => {
                                            //     setStockmasteredit({
                                            //         ...stockmasteredit,
                                            //         rate: e.target.value,
                                            //     });
                                            // }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={3} sm={12} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Total Bill Amount<b style={{ color: "red" }}>*</b>{" "}
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="number"
                                                sx={userStyle.input}
                                                value={(stockmasteredit.quantity) * (stockmasteredit.rate)}

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
                                                value={stockmasteredit.billdate}
                                            // onChange={(e) => {
                                            //     setStockmasteredit({
                                            //         ...stockmasteredit,
                                            //         billdate: e.target.value,
                                            //     });
                                            // }}
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
                                    {stockmasteredit.warranty === "Yes" && (
                                        <Grid item md={3} xs={12} sm={12}>
                                            <Typography>Warranty Card </Typography>
                                            <Box sx={{ display: "flex", justifyContent: "left" }}>
                                                <Button
                                                    variant="contained"
                                                    onClick={handleClickUploadPopupOpenwarrantyedit}
                                                >
                                                    Upload
                                                </Button>
                                            </Box>
                                        </Grid>
                                    )}
                                </Grid>
                                <br /> <br />
                                <Grid container spacing={2}>
                                    <Grid item md={6} xs={12} sm={12}>
                                        {/* {btnSubmit ? (
                                            <Box sx={{ display: "flex" }}>
                                                <CircularProgress />
                                            </Box>
                                        ) : (
                                            <> */}
                                        <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={editSubmit}>
                                            {" "}
                                            Update
                                        </Button>
                                        {/* </>
                                        )} */}
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
                    itemsTwo={stockExcel ?? []}
                    filename={"StockRequestToPurchase Verification"}
                    exportColumnNames={exportColumnNames}
                    exportRowValues={exportRowValues}
                    componentRef={componentRef}
                />
                {/* INFO */}
                <InfoPopup
                    openInfo={openInfo}
                    handleCloseinfo={handleCloseinfo}
                    heading="Stock Request To Purchase Info"
                    addedby={addedby}
                    updateby={updateby}
                />
                {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
                <DeleteConfirmation
                    open={isDeleteOpen}
                    onClose={handleCloseMod}
                    onConfirm={delProject}
                    title="Are you sure?"
                    confirmButtonText="Yes"
                    cancelButtonText="Cancel"
                />
                {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
                <DeleteConfirmation
                    open={isDeleteOpencheckbox}
                    onClose={handleCloseModcheckbox}
                    onConfirm={delProjectcheckbox}
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
        </>
    );
}

export default Stockverification;