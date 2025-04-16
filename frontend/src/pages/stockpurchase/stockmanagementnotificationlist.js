import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, DialogTitle, OutlinedInput, TableBody, TableRow, TextareaAutosize, TableCell, Select, Paper, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle, colourStyles } from "../../pageStyle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { FaPrint, FaEdit, FaFilePdf } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../components/Export";
import { FaTrash } from "react-icons/fa";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import StyledDataGrid from "../../components/TableStyle";
import jsPDF from "jspdf";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Selects from "react-select";
import "jspdf-autotable";
import axios from "axios";
import { StyledTableCell, StyledTableRow } from "../../components/Table";
import { SERVICE } from "../../services/Baseservice";
import { handleApiError } from "../../components/Errorhandling";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Resizable from "react-resizable";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { SettingsPhone } from "@material-ui/icons";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import Pagination from '../../components/Pagination';
import PageHeading from "../../components/PageHeading";
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import domtoimage from 'dom-to-image';
import ExportData from "../../components/ExportData";
import MessageAlert from "../../components/MessageAlert";
import AlertDialog from "../../components/Alert";
import csvIcon from "../../components/Assets/CSV.png";
import excelIcon from "../../components/Assets/excel-icon.png";
import fileIcon from "../../components/Assets/file-icons.png";
import pdfIcon from "../../components/Assets/pdf-icon.png";
import wordIcon from "../../components/Assets/word-icon.png";
import Webcamimage from "../asset/Webcameimageasset.js";
import { makeStyles } from "@material-ui/core";


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


function StockManagementNotification() {

    // const [rows, setRows] = useState([]);
    const updateRowData = (updatedRow) => {
        const updatedRows = items.map((row) => (row.id === updatedRow.id ? updatedRow : row));
        setItems(updatedRows); // Efficiently update the row data.
    };
    const [branchsto, setBranchsto] = useState([]);
    const [unitsto, setUnitsto] = useState([]);

    const [filteredRowDataviewusage, setFilteredRowDataviewusage] = useState([]);
    const [filteredChangesviewusage, setFilteredChangesviewusage] = useState(null);
    const [searchedStringviewusage, setSearchedStringviewusage] = useState("");


    const [filteredRowDataview, setFilteredRowDataview] = useState([]);
    const [filteredChangesview, setFilteredChangesview] = useState(null);
    const [searchedStringview, setSearchedStringview] = useState("");

    const [stock, setStock] = useState([]);

    const [stocklog, setStockLog] = useState([]);
    const [assetlog, setAssetLog] = useState([]);

    const gridRefTableImgviewasset = useRef(null);
    const gridRefTableImgviewstock = useRef(null);
    const gridRefTableviewasset = useRef(null);
    const gridRefTableviewstock = useRef(null);



    const [filteredRowDataviewasset, setFilteredRowDataviewasset] = useState([]);
    const [filteredChangesviewasset, setFilteredChangesviewasset] = useState(null);
    const [searchedStringviewasset, setSearchedStringviewasset] = useState("");



    const [openView, setOpenView] = useState(false);


    const handleViewOpen = () => {
        setOpenView(true);
    };
    const handlViewClose = () => {
        setOpenView(false);
    };


    const classes = useStyles();
    let name = "create";
    let allUploadedFiles = [];

    const [openViewasset, setOpenViewAsset] = useState(false);

    const handleViewOpenAsset = () => {
        setOpenViewAsset(true);
    };
    const handlViewCloseAsset = () => {
        setOpenViewAsset(false);
    };

    const [stockManagehand, setStockManagehand] = useState({
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        floor: "Please Select Floor",
        area: "Please Select Area",
        pieces: "",
        location: "Please Select Location",
        productname: "Please Select Material",
        type: "Location",
        usagedate: "",
        description: "",
        usagetime: "",
        employeenameto: "Please Select Employee",
        countquantity: "",
        team: "Please Select Team",
    });


    const gridRefTableviewusage = useRef(null);
    const gridRefTableImgviewusage = useRef(null);

    const [companys, setCompanys] = useState([]);
    const [branchs, setBranchs] = useState([]);
    const [units, setUnits] = useState([]);
    const [floors, setFloors] = useState([]);
    const [areas, setAreas] = useState([]);
    const [locations, setLocations] = useState([]);
    const [teamoption, setTeamOption] = useState([]);

    const [employeesall, setEmployeesall] = useState([]);
    const [companysto, setCompanysto] = useState([]);

    const fetchEmployeesAll = async () => {
        try {
            let res = await axios.get(SERVICE.USER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setEmployeesall(res.data.users);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const fetchCompanyTo = async () => {
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
            setCompanysto(companyall);
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
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const fetchBranchDropdowns = async (e) => {
        try {
            let res_branch = await axios.get(SERVICE.BRANCH, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let result = res_branch.data.branch.filter((d) => d.company === e.value);
            const branchall = result.map((d) => ({
                ...d,
                label: d.name,
                value: d.name,
            }));
            setBranchs(branchall);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const fetchUnits = async (e) => {
        try {
            let res_unit = await axios.get(SERVICE.UNIT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let result = res_unit?.data?.units.filter((d) => d.branch === e.value);
            const unitall = result.map((d) => ({
                ...d,
                label: d.name,
                value: d.name,
            }));
            setUnits(unitall);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const fetchBranchDropdownsTo = async (e) => {
        try {
            let res_branch = await axios.get(SERVICE.BRANCH, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setBranchsto(res_branch.data.branch);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const fetchUnitsTo = async (e) => {
        try {
            let res_unit = await axios.get(SERVICE.UNIT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setUnitsto(res_unit?.data?.units);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const fetchFloor = async (e) => {
        try {
            let res_floor = await axios.get(SERVICE.FLOOR, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let result = res_floor.data.floors.filter((d) => d.branch === e.value);
            const floorall = result.map((d) => ({
                ...d,
                label: d.name,
                value: d.name,
            }));
            setFloors(floorall);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const fetchArea = async (e) => {
        try {
            let res_type = await axios.get(SERVICE.AREAGROUPING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let result = res_type.data.areagroupings
                .filter((d) => d.branch === stockManagehand.branch && d.floor === e)
                .map((data) => data.area);
            let ji = [].concat(...result);
            const all = ji.map((d) => ({
                ...d,
                label: d,
                value: d,
            }));
            setAreas(all);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const fetchLocation = async (e) => {
        try {
            let res_type = await axios.get(SERVICE.LOCATIONGROUPING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let result = res_type.data.locationgroupings
                .filter(
                    (d) =>
                        d.branch === stockManagehand.branch &&
                        d.floor === stockManagehand.floor &&
                        d.area === e
                )
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
            setLocations(all);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const fetchTeamAll = async (unit) => {
        try {
            let res_team = await axios.get(SERVICE.TEAMS, {
                headers: { Authorization: `Bearer ${auth.APIToken}` },
            });

            setTeamOption(res_team?.data?.teamsdetails);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    useEffect(() => {
        fetchCompanyTo();
        fetchBranchDropdownsTo();
        fetchUnitsTo();
        fetchEmployeesAll();
        fetchCompanyDropdowns();
        fetchTeamAll();
    }, []);
    useEffect(() => {
        fetchTeamAll();
    }, [stockManagehand.unit]);


    const [isFilterOpenviewusage, setIsFilterOpenviewusage] = useState(false);
    const [isPdfFilterOpenviewusage, setIsPdfFilterOpenviewusage] = useState(false);


    const [isimgviewbilllist, setImgviewbilllist] = useState(false);
    const handleImgcodeviewbilllist = () => {
        setImgviewbilllist(true);
    };
    const handlecloseImgcodeviewbilllist = () => {
        setImgviewbilllist(false);
    };

    const [getimgbillcodelist, setGetImgbillcodelist] = useState([]);
    const getimgbillCode = async (valueimg) => {
        setGetImgbillcodelist(valueimg);
        handleImgcodeviewbilllist();
    };

    const statusOpt = [
        { label: "Employee", value: "Employee" },
        { label: "Location", value: "Location" },

    ];
    // page refersh reload
    const handleCloseFilterModviewusage = () => {
        setIsFilterOpenviewusage(false);
    };

    const handleClosePdfFilterModviewusage = () => {
        setIsPdfFilterOpenviewusage(false);
    };




    const [getimgbillcode, setGetImgbillcode] = useState([]);
    const [isimgviewbill, setImgviewbill] = useState(false);
    const handleImgcodeviewbill = () => {
        setImgviewbill(true);
    };
    const handlecloseImgcodeviewbill = () => {
        setImgviewbill(false);
    };

    const [refImage, setRefImage] = useState([]);
    const [previewURL, setPreviewURL] = useState(null);
    const [refImageDrag, setRefImageDrag] = useState([]);
    const [valNum, setValNum] = useState(0);
    //webcam
    const [isWebcamOpen, setIsWebcamOpen] = useState(false);
    const [capturedImages, setCapturedImages] = useState([]);
    const [getImg, setGetImg] = useState(null);
    const [isWebcamCapture, setIsWebcamCapture] = useState(false);

    const handleRemarkChangeUpload = (value, index) => {
        setRefImage((prev) =>
            prev.map((file, i) =>
                i === index ? { ...file, remarks: value } : file
            )
        );
    };
    const handleRemarkChangeWebCam = (value, index) => {
        setCapturedImages((prev) =>
            prev.map((file, i) =>
                i === index ? { ...file, remarks: value } : file
            )
        );
    };
    const handleRemarkChangeDragDrop = (value, index) => {
        setRefImageDrag((prev) =>
            prev.map((file, i) =>
                i === index ? { ...file, remarks: value } : file
            )
        );
    };

    const webcamOpen = () => {
        setIsWebcamOpen(true);
    };
    const webcamClose = () => {
        setIsWebcamOpen(false);
        setGetImg("");
    };
    const webcamDataStore = () => {
        setIsWebcamCapture(true);
        webcamClose();
        setGetImg("");
    };
    const showWebcam = () => {
        webcamOpen();
    };
    // Upload Popup
    const [uploadPopupOpen, setUploadPopupOpen] = useState(false);
    const handleClickUploadPopupOpen = () => {
        setUploadPopupOpen(true);
    };
    const handleUploadPopupClose = () => {
        setUploadPopupOpen(false);
        setGetImg("");
        setRefImage([]);
        setPreviewURL(null);
        setRefImageDrag([]);
        setCapturedImages([]);
    };
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
            // if (file.type.startsWith("image/")) {
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
            // } else {
            //   setPopupContentMalert("Only Accept Images!");
            //   setPopupSeverityMalert("info");
            //   handleClickOpenPopupMalert();
            // }
        }
    };
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

    const renderFilePreviewlist = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };


    const removeCapturedImage = (index) => {
        const newCapturedImages = [...capturedImages];
        newCapturedImages.splice(index, 1);
        setCapturedImages(newCapturedImages);
    };
    const resetImage = () => {
        setGetImg("");
        setRefImage([]);
        setPreviewURL(null);
        setRefImageDrag([]);
        setCapturedImages([]);
    };
    const handleDragOver = (event) => {
        event.preventDefault();
    };
    const handleDrop = (event) => {
        event.preventDefault();
        previewFile(event.dataTransfer.files[0]);
        const files = event.dataTransfer.files;
        let newSelectedFilesDrag = [...refImageDrag];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            // if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = () => {
                newSelectedFilesDrag.push({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    preview: reader.result,
                    base64: reader.result.split(",")[1],
                });
                setRefImageDrag(newSelectedFilesDrag);
            };
            reader.readAsDataURL(file);
            // } else {
            //   setPopupContentMalert("Only Accept Images!");
            //   setPopupSeverityMalert("info");
            //   handleClickOpenPopupMalert();
            // }
        }
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
    const handleRemoveFile = (index) => {
        const newSelectedFiles = [...refImageDrag];
        newSelectedFiles.splice(index, 1);
        setRefImageDrag(newSelectedFiles);
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

    const [handover, setHandover] = useState({
        company: "",
        branch: "",
        unit: "",
        floor: "",
        area: "",
        location: "",
        productname: "",
        requestmode: "",
    });



    const gridRef = useRef(null);
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [isHandleChange, setIsHandleChange] = useState(false);
    const [searchedString, setSearchedString] = useState("");
    const gridRefTable = useRef(null);
    const gridRefTableImg = useRef(null);


    const [isEditOpenused, setIsEditOpenused] = useState(false);

    const [usedcountusage, setusedcountusage] = useState(0);
    const [viewusagecount, setviewusagecount] = useState("")


    const [usecompany, setUsecompany] = useState()
    const [usebranch, setusebranch] = useState()
    const [useunit, setuseunit] = useState()
    const [usefloor, setusefloor] = useState()
    const [usearea, setusearea] = useState()
    const [uselocation, setuselocation] = useState()
    const [usematerial, setusematerial] = useState()
    const [usemode, setusermode] = useState()


    const [balancedCount, setBalancedcount] = useState()
    //Edit model...
    const handleClickOpenEditused = (data) => {

        fetchUsageAllList(data)
        setusedcountusage(data.usedcount)
        setviewusagecount(data.productname)
        setUsecompany(data.company)
        setusebranch(data.branch)
        setuseunit(data.unit)
        setusefloor(data.floor)
        setusearea(data.area)
        setuselocation(data.location)
        setusematerial(data.productname)
        setusermode(data.requestmode)
        setBalancedcount(data.balancecount)

        setHandover({
            ...handover,
            company: data.company,
            branch: data.branch,
            unit: data.unit,
            floor: data.floor,
            area: data.area,
            location: data.location,
            productname: data.productname,
            usagecount: data.usagecount,
            requestmode: data.requestmode,
            purchasecount: data.purchasecount,
            purchasecountstock: data.purchasecountstock,
            usedcount: data.usedcount,
            countquantity: data.countquantity,
            balancecount: data.balancecount,

        });

        setStockManagehand({
            company: "Please Select Company",
            branch: "Please Select Branch",
            unit: "Please Select Unit",
            floor: "Please Select Floor",
            area: "Please Select Area",
            location: "Please Select Location",
            usagedate: "",
            usagetime: "",
            description: "",
            type: "Location",
            employeenameto: "Please Select Employee",
            countquantity: "",
            team: "Please Select Team",
        });
        setRefImageDrag([])
        setRefImage([])
        setCapturedImages([])
        setIsEditOpenused(true);

    };
    const handleCloseModEditused = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpenused(false);

        setStockManagehand({
            company: "Please Select Company",
            branch: "Please Select Branch",
            unit: "Please Select Unit",
            floor: "Please Select Floor",
            area: "Please Select Area",
            location: "Please Select Location",
            usagedate: "",
            usagetime: "",
            description: "",
            type: "Location",
            employeenameto: "Please Select Employee",
            countquantity: "",
            team: "Please Select Team",
        });
        setRefImageDrag([])
        setRefImage([])
        setCapturedImages([])

    };

    const [isEditOpenReturn, setIsEditOpenReturn] = useState(false);

    const [todoscheck, setTodoscheck] = useState([]);
    const [editingIndexcheck, setEditingIndexcheck] = useState(-1);
    const [editedDeveloper, setEditedDeveloper] = useState("");
    const [editedReturnName, seteditedReturnName] = useState("");
    const [selectedCompanyedit, setSelectedCompanyedit] = useState("");
    const [valuecateedit, setvaluecateedit] = useState([]);
    const [empcodeedit, setempcodeedit] = useState("");
    const [highestemp, sethighestemp] = useState("");
    const [viewmode, setViewmode] = useState();

    // console.log(viewmode, "viewmode")
    //return model...
    const handleClickOpenEditReturn = (
        company,
        branch,
        unit,
        floor,
        area,
        location,
        productname,
        balancedcount,
        handovercount,
        requestmode
    ) => {
        setIsEditOpenReturn(true);
        setViewmode(requestmode)
        setHandover({
            ...handover,
            company: company,
            branch: branch,
            unit: unit,
            floor: floor,
            area: area,
            location: location,
            productname: productname,
            balancedcount: balancedcount,
            handovercount: handovercount,
            requestmode: requestmode
        });

    };
    const handleCloseModEditReturn = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpenReturn(false);
        setTodoscheck([]);
        setEditingIndexcheck("");
        setEditedDeveloper("");
        seteditedReturnName("");
        setSelectedCompanyedit("");
        setvaluecateedit("");
        setempcodeedit("");
    };

    const sendRequestStockReturn = async () => {
        let postdata = todoscheck.filter(
            (item) => item.returnqty != 0 && item.returnqty != ""
        );
        try {
            const updatePromises = postdata?.map((item) => {
                return axios.post(`${SERVICE.STOCKPURCHASE_CREATE}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    company: String(item.company),
                    branch: String(item.branch),
                    unit: String(item.unit),
                    productname: String(item.productname),
                    requestmode: String(item.requestmode),
                    floor: String(item.floor),
                    area: String(item.area),
                    location: String(item.location),
                    usercompany: String(item.company),
                    userbranch: String(item.branch),
                    userunit: String(item.unit),
                    userteam: String(item.team),
                    employeenameto: String(item.employeenameto),
                    countquantity: String(item.returnqty),

                    // returnqty: quantityedit,
                    handover: String("return"),
                    addedby: [
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                });
            });
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            handleCloseModEditReturn();
            await fetchUsageAll();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const handlesubmitstockReturn = (e) => {
        e.preventDefault();
        if (editingIndexcheck >= 0) {
            setPopupContentMalert("Please Update Changed Return Quantity!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            sendRequestStockReturn();
        }
    };



    const getCodeAssetReturnLog = async (
        company,
        branch,
        unit,
        floor,
        area,
        location,
        productname,
        requestmode,
        balancecount,
        usagecount,
        status
    ) => {
        try {
            let reshand = await axios.post(SERVICE.STOCKPURCHASELIMITED_HAND_TODO_NOTIFICATION, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company: company,
                branch: branch,
                unit: unit,
                floor: floor,
                area: area,
                location: location,
                productname: productname,
                status: status,
                employeenameto: isUserRoleAccess.companyname

            });
            let reshandeeturn = await axios.post(
                SERVICE.STOCKPURCHASELIMITED_HAND_TODO_RETURN_NOTIFICATION,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    company: company,
                    branch: branch,
                    unit: unit,
                    floor: floor,
                    area: area,
                    location: location,
                    productname: productname,
                    status: status,
                    employeenameto: isUserRoleAccess.companyname
                }
            );

            let getfilterstockreturn = reshandeeturn.data.stock.reduce(
                (acc, current) => {
                    const existingItemIndex = acc.findIndex(
                        (item) => item.employeenameto === current.employeenameto
                    );

                    if (existingItemIndex !== -1) {
                        // Update existing item
                        const existingItem = acc[existingItemIndex];

                        existingItem.countquantity += Number(current.countquantity);
                        // existingItem.overallcountquantity += Number(current.countquantity);
                    } else {
                        // Add new item
                        acc.push({
                            company: current.company,
                            branch: current.branch,
                            unit: current.unit,
                            floor: current.floor,
                            area: current.area,
                            status: current.status,
                            location: current.location,
                            productname: current.productname,
                            countquantity: Number(current.countquantity),
                            // overallcountquantity: Number(current.countquantity),
                            employeenameto: current.employeenameto,
                        });
                    }
                    return acc;
                },
                []
            );
            let getfilterstock = reshand.data.stock.reduce((acc, current) => {
                const existingItemIndex = acc.findIndex(
                    (item) => item.employeenameto === current.employeenameto
                );

                if (existingItemIndex !== -1) {
                    // Update existing item
                    const existingItem = acc[existingItemIndex];

                    existingItem.countquantity += Number(current.countquantity);
                } else {
                    // Add new item
                    acc.push({
                        company: current.company,
                        branch: current.branch,
                        unit: current.unit,
                        floor: current.floor,
                        area: current.area,
                        location: current.location,
                        usercompany: current.usercompany,
                        userbranch: current.userbranch,
                        requestmode: current.requestmode,
                        userunit: current.userunit,
                        userteam: current.userteam,
                        status: current.status,
                        countquantity: current.countquantity,
                        productname: current.productname,
                        countquantity: Number(current.countquantity),
                        overallcountquantity: Number(current.countquantity),
                        employeenameto: current.employeenameto,
                        addedby: current.addedby,
                    });
                }
                return acc;
            }, []);

            let merge = getfilterstock.map((item) => {
                let matchItems = getfilterstockreturn.find(
                    (d) => item.employeenameto === d.employeenameto
                );

                if (matchItems) {
                    return {
                        ...item,
                        overallcountquantity: Number(item.countquantity),
                        countquantity:
                            Number(item.countquantity) - (Number(matchItems.countquantity) + Number(usagecount)),

                        returnqty: 0,
                        returnedqty: Number(matchItems.countquantity)
                    };
                } else {
                    return {
                        ...item,
                        overallcountquantity: Number(item.countquantity),
                        countquantity:
                            Number(item.countquantity) - Number(usagecount),

                        returnqty: 0,
                        returnedqty: 0,
                    };
                }
            });

            console.log(merge, "merge")

            setTodoscheck(merge);
            // setAssetLog([]);
            handleClickOpenEditReturn();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };



    const [quantityedit, setQuantityedit] = useState([]);

    const handleChangephonenumberEdit = (e, oldqty) => {
        // Regular expression to match only positive numeric values
        const regex = /^[0-9]+$/; // Only allows positive integers
        // const regex = /^\d*\.?\d*$/;

        const inputValue = e.target.value;

        // Check if the input value matches the regex or if it's empty (allowing backspace)
        if (regex.test(inputValue) || inputValue === "") {
            // Update the state with the valid numeric value

            setQuantityedit(inputValue);
        }
    };


    const [oleqty, setOldQty] = useState(0);

    const handleEditTodocheck = (index) => {
        setEditingIndexcheck(index);
        setQuantityedit(todoscheck[index].returnqty);
        setOldQty(todoscheck[index].countquantity);
    };
    const handleUpdateTodocheck = () => {
        const company = quantityedit ? quantityedit : "";

        const newTodoscheck = [...todoscheck];
        if (newTodoscheck[editingIndexcheck].countquantity >= company) {
            newTodoscheck[editingIndexcheck].returnqty = company;
            setEditingIndexcheck(-1);
        } else {
            setPopupContentMalert("Please Enter Less Than Actual Quantity!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        setTodoscheck(newTodoscheck);
        setEditingIndexcheck(-1);

        // }
    };



    let exportColumnNames = [
        "Company",
        "Branch",
        "Unit",
        "Floor",
        "Area",
        "Location",
        "Material",
        "Quantity",
    ];
    let exportRowValues = [
        "ompany",
        "branch",
        "unit",
        "floor",
        "area",
        "location",
        "productname",
        "countquantity",
    ];

    //    today date fetching
    let today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    let now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    let currtime = `${hours}:${minutes}`;


    const [selectedRows, setSelectedRows] = useState([]);

    const [searchQueryManage, setSearchQueryManage] = useState("");




    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };


    const [fromdate, setFromdate] = useState(today)
    const [todate, setTodate] = useState(today)


    const [vendors, setVendors] = useState([]);

    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [projectCheck, setProjectCheck] = useState(false);
    const [usageCountAll, setUsageCountAll] = useState([])
    const [stockManage, setStockManage] = useState({
        requestmode: "Stock Material",
        companyto: "Please Select Company",
    });

    const [usageCountAllcheck, setUsageCountAllcheck] = useState(false)
    const [usageCountAlldialog, setUsageCountAlldialog] = useState([])









    const fetchUsageAll = async () => {
        setProjectCheck(true)
        try {
            let res_usagecount = await axios.post(SERVICE.STOCKPURCHASELIMITED_USAGE_COUNT_NOTIFICATION_LIST, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                username: isUserRoleAccess?.companyname,
            });

            let single = res_usagecount.data.stock

            let getfilter = single.reduce((acc, current) => {
                const existingItemIndex = acc.findIndex(
                    (item) =>
                        item.company === current.company &&
                        item.branch === current.branch &&
                        item.unit === current.unit &&
                        item.floor === current.floor &&
                        item.area === current.area &&
                        item.location === current.location &&
                        item.productname === current.productname &&
                        item.requestmode === current.requestmode
                );

                if (existingItemIndex !== -1) {
                    // Update existing item
                    const existingItem = acc[existingItemIndex];
                    existingItem.countquantity += Number(current.countquantity);
                    existingItem._id = current._id;
                    existingItem.requestmode = current.requestmode;
                } else {
                    // Add new item
                    acc.push({
                        company: current.company,
                        _id: current._id,
                        branch: current.branch,
                        unit: current.unit,
                        floor: current.floor,
                        status: current.status,
                        area: current.area,
                        location: current.location,
                        assettype: current.assettype,
                        asset: current.asset,
                        component: current.component,
                        productname: current.productname,
                        requestmode: current.requestmode,
                        countquantity: Number(current.countquantity),
                    });
                }
                return acc;
            }, []);


            let res_countt = await axios.post(SERVICE.STOCK_COUNT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                username: isUserRoleAccess?.companyname,
            });

            let res_countusage = await axios.post(SERVICE.STOCK_COUNT_USAGE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                username: isUserRoleAccess?.companyname,
            });

            let resall =
                getfilter?.map((item, index) => {
                    const returncount = res_countt.data.stock.filter(d =>
                        d.handover === "return" &&
                        d.company === item.company &&
                        d.branch === item.branch &&
                        d.unit === item.unit &&
                        d.floor === item.floor &&
                        d.area === item.area &&
                        d.location === item.location &&
                        d.productname === item.productname

                    )
                        .reduce((sum, item) => sum + Number(item.countquantity), 0);

                    const usagecount = res_countusage.data.stock.filter(d =>
                        d.handover === "usagecount" &&
                        d.company === item.company &&
                        d.branch === item.branch &&
                        d.unit === item.unit &&
                        d.floor === item.floor &&
                        d.area === item.area &&
                        d.location === item.location &&
                        d.productname === item.productname

                    )
                        .reduce((sum, item) => sum + Number(item.countquantity), 0);


                    console.log(usagecount, "usagecount")
                    return {
                        ...item,
                        id: item._id,
                        serialNumber: index + 1,
                        returncount: returncount,
                        usagecount: usagecount,
                        usagedate: moment(item?.usagedate).format("DD/MM/YYYY"),
                        balancecount: Number(item.countquantity) - (Number(usagecount) + Number(returncount))
                    }

                })

            setUsageCountAll(
                resall


            )
            setProjectCheck(false)
        } catch (err) {
            setProjectCheck(false)

        }
    }

    const fetchUsageAllList = async (data) => {
        setUsageCountAllcheck(true)
        try {
            let res_usagecount = await axios.post(SERVICE.USAGE_COUNT_CREATE_LIST, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company: data.company,
                branch: data.branch,
                unit: data.unit,
                floor: data.floor,
                area: data.area,
                location: data.location,
                productname: data.productname,
                requestmode: data.requestmode,
                username: isUserRoleAccess?.companyname,

            });
            setUsageCountAlldialog(res_usagecount.data?.stock?.map((item, index) => ({
                ...item,
                id: item._id,
                serialNumber: index + 1,
                usagedate: moment(item?.usagedate).format("DD/MM/YYYY"),


            })))
            setUsageCountAllcheck(false)
        } catch (err) {
            setUsageCountAllcheck(false)

        }
    }


    useEffect(() => {
        fetchUsageAll();
    }, [])
    // useEffect(() => {
    //     fetchUsageAllList();
    // }, [])

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();

    const [projectData, setProjectData] = useState([]);
    const [items, setItems] = useState([]);
    const [sorting, setSorting] = useState({ column: "", direction: "" });
    const [searchQuery, setSearchQuery] = useState("");
    const [allProjectedit, setAllProjectedit] = useState([]);

    const [copiedData, setCopiedData] = useState("");


    //image

    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, 'Stock Notification List .png');
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    // Error Popup model

    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };


    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };

    const username = isUserRoleAccess.username;
    const userData = {
        name: username,
        date: new Date(),
    };

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

    // Styles for the resizable column
    const ResizableColumn = styled(Resizable)`
    .react-resizable-handle {
      width: 10px;
      height: 100%;
      position: absolute;
      right: 0;
      bottom: 0;
      cursor: col-resize;
    }
  `;

    const getRowClassName = (params) => {
        if (selectedRows.includes(params.data.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        company: true,
        status: true,
        countquantity: true,
        balancecount: true,
        branch: true,
        unit: true,
        floor: true,
        area: true,
        location: true,
        requestmode: true,
        productname: true,
        usagecount: true,
        userteam: true,
        employeenameto: true,
        returncountbtn: true,
        usagecountbtn: true,
        actions: true,
        // useremployee: true,
        // usagedate: true,
        // usagetime: true,
        // description: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
    //submit option for saving






    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Stock Count",
        pageStyle: "print",
    });



    const addSerialNumber = async (datas) => {

        setItems(datas);
    };


    useEffect(() => {
        addSerialNumber(usageCountAll);
    }, [usageCountAll]);


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
        setPage(1);
    };

    // Split the search query into individual terms
    const searchTerms = searchQuery.toLowerCase().split(" ");

    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });

    const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);

    const totalPages = Math.ceil(filteredDatas?.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

    const pageNumbers = [];

    const indexOfLastItem = page * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }


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

    const [rowIndex, setRowIndex] = useState();
    const [status, setStatus] = useState({});
    const [rowIndexnew, setRowIndexnew] = useState();
    const [statusnew, setStatusnew] = useState({});

    const handleAction = (value, rowId, sno) => {
        setStatus((prevStatus) => ({
            ...prevStatus,
            [rowId]: {
                ...prevStatus[rowId],
                status: value,
            },
        }));

        setRowIndex(sno);
    };

    const handleActionNew = (value, rowId, sno) => {
        setStatusnew((prevStatus) => ({
            ...prevStatus,
            [rowId]: {
                ...prevStatus[rowId],
                statusnew: value,
            },
        }));
        setRowIndexnew(sno);
    };


    const columnDataTable = [


        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 80,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },
        {
            field: "status",
            headerName: "Status",
            flex: 0,
            width: 150,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.status,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {params.data.status === "Stock" ?
                        <Button
                            size="small"
                            variant="contained"
                            color="primary"
                        >
                            Stock
                        </Button>

                        :
                        <Button
                            size="small"
                            variant="contained"
                            color="success"
                        >
                            Manual Entry
                        </Button>
                    }
                </Grid>

            )
        },
        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 150,
            hide: !columnVisibility.company,
            headerClassName: "bold-header",
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 150,
            hide: !columnVisibility.branch,
            headerClassName: "bold-header",
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 150,
            hide: !columnVisibility.unit,
            headerClassName: "bold-header",
        },
        {
            field: "floor",
            headerName: "Floor",
            flex: 0,
            width: 150,
            hide: !columnVisibility.floor,
            headerClassName: "bold-header",
        },
        {
            field: "area",
            headerName: "Area",
            flex: 0,
            width: 150,
            hide: !columnVisibility.area,
            headerClassName: "bold-header",
        },
        {
            field: "location",
            headerName: "Location",
            flex: 0,
            width: 150,
            hide: !columnVisibility.location,
            headerClassName: "bold-header",
        },

        {
            field: "productname",
            headerName: "Material",
            flex: 0,
            width: 200,
            hide: !columnVisibility.productname,
            headerClassName: "bold-header",
        },
        {
            field: "requestmode",
            headerName: "Request Mode",
            flex: 0,
            width: 200,
            hide: !columnVisibility.requestmode,
            headerClassName: "bold-header",
        },

        {
            field: "countquantity",
            headerName: "Quantity",
            flex: 0,
            width: 150,
            hide: !columnVisibility.countquantity,
            headerClassName: "bold-header",
        },
        {
            field: "balancecount",
            headerName: "Balance Count",
            flex: 0,
            width: 150,
            hide: !columnVisibility.balancecount,
            headerClassName: "bold-header",
        },
        {
            field: "returncountbtn",
            headerName: "Return Count",
            flex: 0,
            width: 150,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.returncountbtn,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {/* {params.data.requestmode === "Asset Material" &&
                        ( */}
                    <Grid sx={{ display: "flex" }}>


                        <Typography
                            sx={{
                                backgroundColor: "orange",
                                borderRadius: "50%",
                                padding: "2px",
                            }}
                        >
                            {" "}
                            {params.data.returncount}
                        </Typography>


                        <Button
                            variant="contained"
                            // color="#FF8C00"
                            sx={{
                                background: "#FF8C00", textTransform: "capitalize", "&:hover": {
                                    backgroundColor: "#d99313",
                                },
                            }}
                            size="small"
                            onClick={(e) => {
                                getCodeAssetReturnLog(
                                    params.data.company,
                                    params.data.branch,
                                    params.data.unit,
                                    params.data.floor,
                                    params.data.area,
                                    params.data.location,
                                    params.data.productname,
                                    params.data.requestmode,
                                    params.data.balancecount,
                                    params.data.usagecount,
                                    params.data.status
                                );
                            }}
                        >
                            Return Count
                        </Button>
                    </Grid>
                    {/* )} */}
                </Grid>
            ),
        },

        {
            field: "usagecountbtn",
            headerName: "Usage Count",
            flex: 0,
            width: 200,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.usagecountbtn,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {/* {params.data.requestmode === "Asset Material" &&
                        ( */}
                    <Grid sx={{ display: "flex", gap: "2px" }}>
                        <Typography
                            sx={{
                                backgroundColor: "#6ddabb",
                                borderRadius: "50%",
                                padding: "4px",
                            }}
                        >
                            {" "}
                            {params.data.usagecount}
                        </Typography>
                        <Button
                            variant="contained"
                            // color="#6A0DAD"
                            sx={{
                                background: "#6A0DAD", textTransform: "capitalize", "&:hover": {
                                    backgroundColor: "#590a91",
                                },
                            }}
                            size="small"
                            onClick={() =>
                                handleClickOpenEditused(
                                    params.data,
                                    // params.data.company,
                                    // params.data.branch,
                                    // params.data.unit,
                                    // params.data.floor,
                                    // params.data.area,
                                    // params.data.location,
                                    // params.data.productname,
                                    // params.data.requestmode,
                                    // params.data.balancecount
                                )
                            }
                        >
                            Usage Count
                        </Button>
                    </Grid>
                    {/* )} */}
                </Grid>
            ),
        },
        {
            field: "actions",
            headerName: "Returned Material",
            flex: 0,
            width: 150,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>

                    <Button
                        sx={userStyle.buttonedit}
                        onClick={(e) => {
                            getCodeAssetLog(
                                params.data
                            );
                        }}
                    >

                        VIEW
                    </Button>

                </Grid>
            ),
        },


    ];

    const rowDataTable = filteredData.map((item, index) => {
        return {
            ...item,
            id: item._id,
            serialNumber: item.serialNumber,
            company: item.company,
            countquantity: item.countquantity,
            returncountbtn: item.returncountbtn,
            usagecountbtn: item.usagecountbtn,
            usagecount: item.usagecount,
            branch: item.branch,
            returncount: item.returncount,
            unit: item.unit,
            balancecount: item.balancecount,
            floor: item.floor,
            area: item.area,
            location: item.location,
            productname: item.productname,
            userteam: item.userteam,
            useremployee: item.useremployee,
            usagedate: item.usagedate,
            usagetime: item.usagetime,
            requestmode: item.requestmode,
            description: item.description,
            employeenameto: item.employeenameto
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

    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibility");
        if (savedVisibility) {
            setColumnVisibility(JSON.parse(savedVisibility));
        }
    }, []);

    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
    }, [columnVisibility]);

    // // Function to filter columns based on search query
    const filteredColumns = columnDataTable.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));
    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    // JSX for the "Manage Columns" popover content
    const manageColumnsContent = (
        <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
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
                <TextField label="Find column" variant="standard" fullWidth value={searchQueryManage} onChange={(e) => setSearchQueryManage(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
            </Box>
            <br />
            <br />
            <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumns.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText
                                sx={{ display: "flex" }}
                                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />}
                                secondary={column.field === "checkbox" ? "Checkbox" : column.headerName}
                            // secondary={column.headerName }
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item md={4}>
                        <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibility(initialColumnVisibility)}>
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



    const fetchVendors = async () => {
        setPageName(!pageName)
        try {
            let res_vendor = await axios.get(SERVICE.VENDORMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let vendorall = res_vendor?.data?.vendormaster.map((d) => ({
                ...d,
                label: d.projectname + "-" + d.name,
                value: d.projectname + "-" + d.name,
            }));
            setVendors(vendorall);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    const [fileFormat, setFormat] = useState('')
    // const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    // const fileExtension = fileFormat === "xl" ? '.xlsx' : '.csv';
    // const exportToCSV = (csvData, fileName) => {
    //     const ws = XLSX.utils.json_to_sheet(csvData);
    //     const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    //     const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    //     const data = new Blob([excelBuffer], { type: fileType });
    //     FileSaver.saveAs(data, fileName + fileExtension);
    // }


    // const handleExportXL = (isfilter) => {
    //     if (isfilter === "filtered") {
    //         exportToCSV(
    //             rowDataTable?.map((t, index) => ({
    //                 Sno: index + 1,
    //                 "Vendor": t.vendor,
    //                 "Date": t.fromdate,
    //                 "Time": t.time,
    //                 "Category": t.filename,
    //                 "SubCategory": t.category,
    //                 "Identifier": t.unitid,
    //                 "Login Id": t.user,
    //                 "Section": t.section,
    //                 "Flag Count": t.flagcount,
    //                 "alllogin": t.alllogin,
    //                 "Doc Number": t.docnumber,
    //                 "Status": t.status,
    //                 "Approval Status": t.approvalstatus,
    //                 "Late Entry Status": t.lateentrystatus
    //             })),
    //             fileName,
    //         );
    //     }
    //     else if (isfilter === "overall") {
    //         exportToCSV(
    //             projmasterArray.map((t, index) => ({
    //                 Sno: index + 1,
    //                 "Vendor": t.vendor,
    //                 "Date": moment(t.fromdate).format("DD/MM/YYYY"),
    //                 "Time": t.time,
    //                 "Category": t.filename,
    //                 "SubCategory": t.category,
    //                 "Identifier": t.unitid,
    //                 "Login Id": t.user,
    //                 "Section": t.section,
    //                 "Flag Count": t.flagcount,
    //                 "alllogin": t.alllogin,
    //                 "Doc Number": t.docnumber,
    //                 "Status": t.status,
    //                 "Approval Status": t.approvalstatus,
    //                 "Late Entry Status": t.lateentrystatus

    //             })),
    //             fileName,
    //         );

    //     }

    //     setIsFilterOpen(false)
    // };






    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Approve List"),
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

    //Datatable
    const [pageviewusage, setPageviewusage] = useState(1);
    const [pageSizeviewusage, setPageSizeviewusage] = useState(10);
    const [searchQueryviewusage, setSearchQueryviewusage] = useState("");


    const [selectedRowsviewusage, setSelectedRowsviewusage] = useState([]);
    const [searchQueryManageviewusage, setSearchQueryManageviewusage] = useState("");

    // Manage Columns
    const [isManageColumnsOpenviewusage, setManageColumnsOpenviewusage] = useState(false);
    const [anchorElviewusage, setAnchorElviewusage] = useState(null);

    const handleOpenManageColumnsviewusage = (event) => {
        setAnchorElviewusage(event.currentTarget);
        setManageColumnsOpenviewusage(true);
    };
    const handleCloseManageColumnsviewusage = () => {
        setManageColumnsOpenviewusage(false);
        setSearchQueryManageviewusage("");
    };

    const openviewusage = Boolean(anchorElviewusage);
    const idviewusage = openviewusage ? "simple-popover" : undefined;

    const initialColumnVisibilityviewusage = {
        serialNumber: true,
        checkbox: true,
        usercompany: true,
        filesusagecount: true,
        countquantity: true,
        userbranch: true,
        requestmode: true,
        userunit: true,
        userfloor: true,
        userarea: true,
        userlocation: true,
        userteam: true,
        useremployee: true,
        usagedate: true,
        usagetime: true,
        description: true,
        productname: true,
    };
    const [columnVisibilityviewusage, setColumnVisibilityviewusage] = useState(
        initialColumnVisibilityviewusage
    );



    const [itemsviewusage, setItemsviewusage] = useState([]);
    // console.log(ebservicemasters, "ebservicemasters")

    const addSerialNumberviewusage = (datas) => {
        setItemsviewusage(datas);
    };


    useEffect(() => {
        addSerialNumberviewusage(usageCountAlldialog);
    }, [usageCountAlldialog]);





    const handlePageSizeChangeviewusage = (event) => {
        setPageSizeviewusage(Number(event.target.value));
        setSelectedRowsviewusage([]);
        setSelectAllCheckedviewusage(false);
        setPageviewusage(1);
    };


    // Split the search query into individual terms
    const searchTermsviewusage = searchQueryviewusage.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatasviewusage = itemsviewusage?.filter((item) => {
        return searchTermsviewusage.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });

    const filteredDataviewusage = filteredDatasviewusage.slice(
        (pageviewusage - 1) * pageSizeviewusage,
        pageviewusage * pageSizeviewusage
    );

    const totalPagesviewusage = Math.ceil(filteredDatasviewusage.length / pageSizeviewusage);

    const visiblePagesviewusage = Math.min(totalPagesviewusage, 3);

    const firstVisiblePageviewusage = Math.max(1, page - 1);
    const lastVisiblePageviewusage = Math.min(
        firstVisiblePageviewusage + visiblePagesviewusage - 1,
        totalPagesviewusage
    );

    const pageNumbersviewusage = [];

    const indexOfLastItemviewusage = pageviewusage * pageSizeviewusage;
    const indexOfFirstItemviewusage = indexOfLastItemviewusage - pageSizeviewusage;

    for (let i = firstVisiblePageviewusage; i <= lastVisiblePageviewusage; i++) {
        pageNumbersviewusage.push(i);
    }

    const [selectAllCheckedviewusage, setSelectAllCheckedviewusage] = useState(false);






    const columnDataTableviewusage = [


        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 80,
            hide: !columnVisibilityviewusage.serialNumber,
            headerClassName: "bold-header",
        },

        {
            field: "requestmode",
            headerName: "Mode",
            flex: 0,
            width: 150,
            hide: !columnVisibilityviewusage.requestmode,
            headerClassName: "bold-header",
        },
        {
            field: "usercompany",
            headerName: "Company",
            flex: 0,
            width: 150,
            hide: !columnVisibilityviewusage.usercompany,
            headerClassName: "bold-header",
        },
        {
            field: "userbranch",
            headerName: "Branch",
            flex: 0,
            width: 150,
            hide: !columnVisibilityviewusage.userbranch,
            headerClassName: "bold-header",
        },
        {
            field: "userunit",
            headerName: "Unit",
            flex: 0,
            width: 150,
            hide: !columnVisibilityviewusage.userunit,
            headerClassName: "bold-header",
        },
        {
            field: "userfloor",
            headerName: "Floor",
            flex: 0,
            width: 100,
            hide: !columnVisibilityviewusage.userfloor,
            headerClassName: "bold-header",
        },

        {
            field: "userfloor",
            headerName: "Floor",
            flex: 0,
            width: 150,
            hide: !columnVisibilityviewusage.userfloor,
            headerClassName: "bold-header",
        },
        {
            field: "userarea",
            headerName: "Area",
            flex: 0,
            width: 150,
            hide: !columnVisibilityviewusage.userarea,
            headerClassName: "bold-header",
        },
        {
            field: "userlocation",
            headerName: "Location",
            flex: 0,
            width: 100,
            hide: !columnVisibilityviewusage.userlocation,
            headerClassName: "bold-header",
        },
        {
            field: "userteam",
            headerName: "Team",
            flex: 0,
            width: 150,
            hide: !columnVisibilityviewusage.userteam,
            headerClassName: "bold-header",
        },

        {
            field: "useremployee",
            headerName: "Employee",
            flex: 0,
            width: 180,
            hide: !columnVisibilityviewusage.useremployee,
            headerClassName: "bold-header",
        },

        {
            field: "productname",
            headerName: "Material",
            flex: 0,
            width: 180,
            hide: !columnVisibilityviewusage.productname,
            headerClassName: "bold-header",
        },
        {
            field: "countquantity",
            headerName: "Quantity",
            flex: 0,
            width: 100,
            hide: !columnVisibilityviewusage.countquantity,
            headerClassName: "bold-header",
        },
        {
            field: "usagedate",
            headerName: "Date",
            flex: 0,
            width: 130,
            hide: !columnVisibilityviewusage.usagedate,
            headerClassName: "bold-header",
        },
        {
            field: "usagetime",
            headerName: "Time",
            flex: 0,
            width: 130,
            hide: !columnVisibilityviewusage.usagetime,
            headerClassName: "bold-header",
        },

        {
            field: "description",
            headerName: "Description",
            flex: 0,
            width: 180,
            hide: !columnVisibilityviewusage.description,
            headerClassName: "bold-header",
        },

        {
            field: "filesusagecount",
            headerName: "Attachment",
            flex: 0,
            width: 100,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibilityviewusage.filesusagecount,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <>
                    {params.data.filesusagecount.length > 0 ? (
                        <Button
                            sx={{
                                padding: "14px 14px",
                                minWidth: "40px !important",
                                borderRadius: "50% !important",
                                ":hover": {
                                    backgroundColor: "#80808036", // theme.palette.primary.main
                                },
                            }}
                            onClick={() => getimgbillCode(params.data.filesusagecount)}
                        >
                            view
                        </Button>
                    ) : (
                        ""
                    )}
                </>
            ),
        },



    ];



    const rowDataTableviewusage = filteredDataviewusage.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            usercompany: item.usercompany,
            filesusagecount: item.filesusagecount,
            countquantity: item.countquantity,
            userbranch: item.userbranch,
            userunit: item.userunit,
            requestmode: item.requestmode,
            userfloor: item.userfloor,
            userarea: item.userarea,
            userlocation: item.userlocation,
            userteam: item.userteam,
            useremployee: item.useremployee,
            usagedate: item.usagedate,
            usagetime: item.usagetime,
            description: item.description,
            productname: item.productname
        };
    });



    // Show All Columns functionality
    const handleShowAllColumnsviewusage = () => {
        const updatedVisibility = { ...columnVisibilityviewusage };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibilityviewusage(updatedVisibility);
    };
    // Function to filter columns based on search query
    const filteredColumnsviewusage = columnDataTableviewusage.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManageviewusage.toLowerCase())
    );
    // Manage Columns functionality
    const toggleColumnVisibilityviewusage = (field) => {
        setColumnVisibilityviewusage((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };
    // JSX for the "Manage Columns" popover content
    const manageColumnsContentviewusage = (
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
                onClick={handleCloseManageColumnsviewusage}
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
                    value={searchQueryManageviewusage}
                    onChange={(e) => setSearchQueryManageviewusage(e.target.value)}
                    sx={{ marginBottom: 5, position: "absolute" }}
                />
            </Box>
            <br />
            <br />
            <DialogContent
                sx={{ minWidth: "auto", height: "200px", position: "relative" }}
            >
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumnsviewusage.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText
                                sx={{ display: "flex" }}
                                primary={
                                    <Switch
                                        sx={{ marginTop: "-5px" }}
                                        size="small"
                                        checked={columnVisibilityviewusage[column.field]}
                                        onChange={() => toggleColumnVisibilityviewusage(column.field)}
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
                            onClick={() => setColumnVisibilityviewusage(initialColumnVisibilityviewusage)}
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
                                columnDataTableviewusage.forEach((column) => {
                                    newColumnVisibility[column.field] = false; // Set hide property to true
                                });
                                setColumnVisibilityviewusage(newColumnVisibility);
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


    //print...
    const componentRefviewusage = useRef();
    const handleprintviewusage = useReactToPrint({
        content: () => componentRefviewusage.current,
        documentTitle: "Usage Count",
        pageStyle: "print",
    });

    const sendRequestStockUsageCount = async () => {
        try {
            let stockcreate = await axios.post(SERVICE.STOCKPURCHASE_CREATE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },

                company: String(usecompany),

                branch: String(usebranch),
                unit: String(useunit),

                floor: String(usefloor),
                area: String(usearea),
                location: String(uselocation),
                requestmode: String(usemode),
                productname: String(usematerial),
                usercompany: String(stockManagehand.company),
                userbranch: String(stockManagehand.branch),
                userunit: String(stockManagehand.unit),
                userfloor: String(stockManagehand.floor),
                userarea: String(stockManagehand.area),
                userlocation: String(stockManagehand.location),
                userteam: String(stockManagehand.team === "Please Select Team" ? "" : stockManagehand.team),
                useremployee: String(stockManagehand.employeenameto === "Please Select Employee" ? "" : stockManagehand.employeenameto),

                countquantity: String(stockManagehand.countquantity),

                usagedate: String(stockManagehand.usagedate),
                usagetime: String(stockManagehand.usagetime),
                description: String(stockManagehand.description),

                filesusagecount: allUploadedFiles.concat(refImage, refImageDrag, capturedImages),
                handover: String("usagecount"),
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });

            setStockManagehand({
                company: "Please Select Company",
                branch: "Please Select Branch",
                unit: "Please Select Unit",
                floor: "Please Select Floor",
                area: "Please Select Area",
                location: "Please Select Location",
                productname: "Please Select Material",
                employeenameto: "Please Select Employee",
                countquantity: "",
                Type: "Location",
                description: "",
                usagedate: "",
                usagetime: ""
            })
            setBranchs([])
            setUnits([])
            setFloors([])
            setAreas([])
            setLocations([])
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            handleCloseModEditused();
            await fetchStock();
            await fetchUsageAll();
            // await fetchUsageAllList()
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const handlesubmitstockusaecount = (e) => {
        e.preventDefault();

        if (stockManagehand.company === "Please Select Company") {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (stockManagehand.branch === "Please Select Branch") {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (stockManagehand.unit === "Please Select Area") {
            setPopupContentMalert("Please Select Area!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (stockManagehand.floor === "Please Select Floor") {
            setPopupContentMalert("Please Select Floor!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (stockManagehand.area === "Please Select Area") {
            setPopupContentMalert("Please Select Area!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (stockManagehand.location === "Please Select Location") {
            setPopupContentMalert("Please Select Location!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (stockManagehand.type === "Employee" && stockManagehand.team === "Please Select Team") {
            setPopupContentMalert("Please Select Team!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (stockManagehand.countquantity === "") {
            setPopupContentMalert("Please Enter Quantity!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (stockManagehand.countquantity > balancedCount) {
            setPopupContentMalert("Please Enter Less Than Balance Count!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else if (stockManagehand.type === "Employee" && stockManagehand.employeenameto === "Please Select Employee") {
            setPopupContentMalert("Please Select Employee!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (stockManagehand.description === "") {
            setPopupContentMalert("Please Enter Description!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (stockManagehand.usagedate === "") {
            setPopupContentMalert("Please Select Date!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (stockManagehand.usagetime === "") {
            setPopupContentMalert("Please Select Time!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendRequestStockUsageCount();
        }
    };


    // const [columnsnew, setColumnsnew] = useState(columnDatatable)
    //get all project.
    const fetchStock = async () => {
        setPageName(!pageName)
        // let columnsnew1 =
        //     stockManagefilter.requestmode === "Stock Material"
        //         ? columnDatatableStock
        //         : columnDatatable;
        // setColumnsnew(columnsnew1)
        try {
            setProjectCheck(true);

            if (viewmode === "Asset Material") {
                let res_project = await axios.post(SERVICE.STOCKPURCHASELIMITED_USAGE_COUNT_NOTIFICATION_LIST, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    assetmat: "Asset Material",
                    username: isUserRoleAccess?.companyname,
                });

                let res_hand = await axios.get(SERVICE.STOCKPURCHASELIMITED_HAND, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });

                let res_return = await axios.get(SERVICE.STOCKPURCHASELIMITED_RETURN, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });


                let res_usagecount = await axios.get(SERVICE.STOCKPURCHASELIMITED_USAGE_COUNT, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });

                let single = res_project?.data?.stock;
                let singlehand = res_hand.data?.stock;
                let singlereturn = res_return.data?.stock;
                let singleusagecount = res_usagecount.data?.stock;

                let singlehandtotal = singlehand.reduce((acc, current) => {
                    const existingItemIndex = acc.findIndex(
                        (item) =>
                            item.company === current.company &&
                            item.branch === current.branch &&
                            item.unit === current.unit &&
                            item.floor === current.floor &&
                            item.area === current.area &&
                            item.location === current.location &&
                            item.productname === current.productname
                    );

                    if (existingItemIndex !== -1) {
                        // Update existing item
                        const existingItem = acc[existingItemIndex];

                        existingItem.countquantity += Number(current.countquantity);
                        existingItem._id = current._id;
                    } else {
                        // Add new item
                        acc.push({
                            company: current.company,
                            _id: current._id,
                            branch: current.branch,
                            status: current.status,
                            unit: current.unit,
                            floor: current.floor,
                            area: current.area,
                            location: current.location,
                            productname: current.productname,
                            countquantity: Number(current.countquantity),
                        });
                    }
                    return acc;
                }, []);

                let singlereturntotal = singlereturn.reduce((acc, current) => {
                    const existingItemIndex = acc.findIndex(
                        (item) =>
                            item.company === current.company &&
                            item.branch === current.branch &&
                            item.unit === current.unit &&
                            item.floor === current.floor &&
                            item.area === current.area &&
                            item.location === current.location &&
                            item.productname === current.productname
                    );

                    if (existingItemIndex !== -1) {
                        // Update existing item
                        const existingItem = acc[existingItemIndex];

                        existingItem.countquantity += Number(current.countquantity);
                        existingItem._id = current._id;
                    } else {
                        // Add new item
                        acc.push({
                            company: current.company,
                            _id: current._id,
                            branch: current.branch,
                            unit: current.unit,
                            floor: current.floor,
                            status: current.status,
                            area: current.area,
                            location: current.location,
                            productname: current.productname,
                            countquantity: Number(current.countquantity),
                        });
                    }
                    return acc;
                }, []);

                let singleusagecounttotal = singleusagecount.reduce((acc, current) => {
                    const existingItemIndex = acc.findIndex(
                        (item) =>
                            item.company === current.company &&
                            item.branch === current.branch &&
                            item.unit === current.unit &&
                            item.floor === current.floor &&
                            item.area === current.area &&
                            item.location === current.location &&
                            item.productname === current.productname
                    );

                    if (existingItemIndex !== -1) {
                        // Update existing item
                        const existingItem = acc[existingItemIndex];

                        existingItem.countquantity += Number(current.countquantity);
                        existingItem._id = current._id;
                    } else {
                        // Add new item
                        acc.push({
                            company: current.company,
                            _id: current._id,
                            branch: current.branch,
                            status: current.status,
                            unit: current.unit,
                            floor: current.floor,
                            area: current.area,
                            location: current.location,
                            productname: current.productname,
                            countquantity: Number(current.countquantity),
                        });
                    }
                    return acc;
                }, []);





                let res = await axios.get(SERVICE.ASSETDETAIL_STOCK_LIMITED, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });

                let assettotal = res?.data?.assetdetails;

                let getassettotal = assettotal.reduce((acc, current) => {
                    const existingItemIndex = acc.findIndex(
                        (item) =>
                            item.company === current.company &&
                            item.branch === current.branch &&
                            item.unit === current.unit &&
                            item.floor === current.floor &&
                            item.area === current.area &&
                            item.location === current.location &&
                            item.material === current.material
                    );

                    if (existingItemIndex !== -1) {
                        // Update existing item
                        const existingItem = acc[existingItemIndex];

                        existingItem.countquantity += Number(current.countquantity);
                        existingItem._id = current._id;
                        // existingItem.material = current.material;
                        // existingItem.assettype = current.assettype;
                        // existingItem.asset = current.asset;
                        // existingItem.component = current.component;
                    } else {
                        // Add new item
                        acc.push({
                            company: current.company,
                            _id: current._id,
                            branch: current.branch,
                            unit: current.unit,
                            floor: current.floor,
                            area: current.area,
                            location: current.location,
                            material: current.material,
                            // assettype: current.assettype,
                            // asset: current.asset,
                            // component: current.component,
                            countquantity: Number(current.countquantity),
                        });
                    }
                    return acc;
                }, []);

                let getfilter = single.reduce((acc, current) => {
                    const existingItemIndex = acc.findIndex(
                        (item) =>
                            item.company === current.company &&
                            item.branch === current.branch &&
                            item.unit === current.unit &&
                            item.floor === current.floor &&
                            item.area === current.area &&
                            item.location === current.location &&
                            item.productname === current.productname
                    );

                    if (existingItemIndex !== -1) {
                        // Update existing item
                        const existingItem = acc[existingItemIndex];
                        existingItem.purchasecount += Number(current.quantity);
                        existingItem._id = current._id;
                        existingItem.requestmode = current.requestmode;
                    } else {
                        // Add new item
                        acc.push({
                            company: current.company,
                            _id: current._id,
                            branch: current.branch,
                            unit: current.unit,
                            floor: current.floor,
                            status: current.status,
                            area: current.area,
                            location: current.location,
                            assettype: current.assettype,
                            asset: current.asset,
                            component: current.component,
                            productname: current.productname,
                            requestmode: current.requestmode,
                            purchasecount: Number(current.quantity),
                        });
                    }
                    return acc;
                }, []);

                let merge = getfilter.map((item) => {
                    let matchItems = getassettotal.find(
                        (d) =>
                            item.company === d.company &&
                            item.branch === d.branch &&
                            item.unit === d.unit &&
                            item.floor === d.floor &&
                            item.area === d.area &&
                            item.location === d.location &&
                            item.productname === d.material
                    );



                    let findquantity = singlehandtotal.find(
                        (d) =>
                            item.company === d.company &&
                            item.branch === d.branch &&
                            item.unit === d.unit &&
                            item.floor === d.floor &&
                            item.area === d.area &&
                            item.location === d.location &&
                            item.productname === d.productname
                    );

                    let findreturnquantity = singlereturntotal.find(
                        (d) =>
                            item.company === d.company &&
                            item.branch === d.branch &&
                            item.unit === d.unit &&
                            item.floor === d.floor &&
                            item.area === d.area &&
                            item.location === d.location &&
                            item.productname === d.productname
                    );

                    let findusagecount = singleusagecounttotal.find(
                        (d) =>
                            item.company === d.company &&
                            item.branch === d.branch &&
                            item.unit === d.unit &&
                            item.floor === d.floor &&
                            item.area === d.area &&
                            item.location === d.location &&
                            item.productname === d.productname
                    );

                    let matchHandItems =
                        singlehandtotal.length > 0
                            ? findquantity
                                ? findquantity.countquantity
                                : 0
                            : 0;
                    let matchReturnItems =
                        singlereturntotal.length > 0
                            ? findreturnquantity
                                ? findreturnquantity.countquantity
                                : 0
                            : 0;

                    let matchUsageCountItems =
                        singleusagecounttotal.length > 0
                            ? findusagecount
                                ? findusagecount.countquantity
                                : 0
                            : 0;

                    if (matchItems || matchHandItems || matchReturnItems || matchUsageCountItems) {
                        let matchqty = matchHandItems ? Number(matchHandItems) : 0;
                        let usedcountqty = Number(matchHandItems) - Number(matchReturnItems)
                        let allused = usedcountqty + Number(matchUsageCountItems)
                        return {
                            ...item,
                            purchasecount: Number(item.purchasecount),
                            // usedcount:
                            //   Number(matchItems ? matchItems.countquantity : 0) +
                            //   Number(matchHandItems) -
                            //   Number(matchReturnItems),
                            // balancedcount:
                            //   Number(item.purchasecount) -
                            //   (Number(matchItems ? matchItems.countquantity : 0) +
                            //     Number(matchHandItems) -
                            //     Number(matchReturnItems)),
                            usedcount: allused,
                            balancedcount:
                                Number(item.purchasecount) -
                                Number(allused),
                            // handovercount: Number(matchHandItems) - Number(matchReturnItems),
                            handovercount: Number(matchHandItems),
                            returncount: Number(matchReturnItems),
                            usagecount: Number(matchUsageCountItems),

                        };
                    } else {
                        return {
                            ...item,
                            usedcount: 0,
                            handovercount: 0,
                            returncount: 0,
                            usagecount: 0,
                            balancedcount: Number(item.purchasecount) - 0,
                        };
                    }
                });

                setStock(merge);
            }

            else if (viewmode === "Stock Material") {
                let res_project = await axios.post(SERVICE.STOCKPURCHASELIMITED_USAGE_COUNT_NOTIFICATION_LIST, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    assetmat: "Stock Material",
                    username: isUserRoleAccess?.companyname,
                });


                let res_hand = await axios.get(SERVICE.STOCKPURCHASELIMITED_HAND, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });

                let res_return = await axios.get(SERVICE.STOCKPURCHASELIMITED_RETURN, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });


                let res_usagecount = await axios.get(SERVICE.STOCKPURCHASELIMITED_USAGE_COUNT, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });


                let single = res_project?.data?.stock;

                let singlehand = res_hand.data?.stock;
                let singlereturn = res_return.data?.stock;
                let singleusagecount = res_usagecount.data?.stock;

                let singlehandtotal = singlehand.reduce((acc, current) => {

                    const existingItemIndex = acc.findIndex(
                        (item) =>
                            item.company === current.company &&
                            item.branch === current.branch &&
                            item.unit === current.unit &&
                            item.floor === current.floor &&
                            item.area === current.area &&
                            item.location === current.location &&
                            item.productname === current.productname
                    );

                    if (existingItemIndex !== -1) {
                        // Update existing item
                        const existingItem = acc[existingItemIndex];

                        existingItem.countquantity += Number(current.countquantity);
                        existingItem._id = current._id;
                    } else {
                        // Add new item
                        acc.push({
                            company: current.company,
                            _id: current._id,
                            branch: current.branch,
                            status: current.status,
                            unit: current.unit,
                            floor: current.floor,
                            area: current.area,
                            location: current.location,
                            productname: current.productname,
                            countquantity: Number(current.countquantity),
                        });
                    }
                    return acc;
                }, []);


                let singlereturntotal = singlereturn.reduce((acc, current) => {
                    const existingItemIndex = acc.findIndex(
                        (item) =>
                            item.company === current.company &&
                            item.branch === current.branch &&
                            item.unit === current.unit &&
                            item.floor === current.floor &&
                            item.area === current.area &&
                            item.location === current.location &&
                            item.productname === current.productname
                    );

                    if (existingItemIndex !== -1) {
                        // Update existing item
                        const existingItem = acc[existingItemIndex];

                        existingItem.countquantity += Number(current.countquantity);
                        existingItem._id = current._id;
                    } else {
                        // Add new item
                        acc.push({
                            company: current.company,
                            _id: current._id,
                            branch: current.branch,
                            unit: current.unit,
                            floor: current.floor,
                            status: current.status,
                            area: current.area,
                            location: current.location,
                            productname: current.productname,
                            countquantity: Number(current.countquantity),
                        });
                    }
                    return acc;
                }, []);

                let singleusagecounttotal = singleusagecount.reduce((acc, current) => {
                    const existingItemIndex = acc.findIndex(
                        (item) =>
                            item.company === current.company &&
                            item.branch === current.branch &&
                            item.unit === current.unit &&
                            item.floor === current.floor &&
                            item.area === current.area &&
                            item.location === current.location &&
                            item.productname === current.productname
                    );

                    if (existingItemIndex !== -1) {
                        // Update existing item
                        const existingItem = acc[existingItemIndex];

                        existingItem.countquantity += Number(current.countquantity);
                        existingItem._id = current._id;
                    } else {
                        // Add new item
                        acc.push({
                            company: current.company,
                            _id: current._id,
                            branch: current.branch,
                            unit: current.unit,
                            floor: current.floor,
                            area: current.area,
                            location: current.location,
                            productname: current.productname,
                            countquantity: Number(current.countquantity),
                        });
                    }
                    return acc;
                }, []);




                let result = single.flatMap((item) => {


                    return item.stockmaterialarray.map((subItem) => ({
                        _id: subItem._id,
                        company: item.company,
                        branch: item.branch,
                        unit: item.unit,
                        floor: item.floor,
                        area: item.area,
                        location: item.location,
                        requestmode: item.requestmode,
                        materialnew: subItem.materialnew,
                        quantitynew: subItem.quantitynew,

                        uomcodenew: subItem.uomcodenew,
                    }));
                });

                let getfilter = result.reduce((acc, current) => {
                    const existingItemIndex = acc.findIndex(
                        (item) =>
                            item.company === current.company &&
                            item.branch === current.branch &&
                            item.unit === current.unit &&
                            item.floor === current.floor &&
                            item.area === current.area &&
                            item.location === current.location &&
                            item.materialnew === current.materialnew
                    );

                    if (existingItemIndex !== -1) {
                        // Update existing item
                        const existingItem = acc[existingItemIndex];

                        existingItem.purchasecountstock += Number(current.quantitynew);
                        existingItem._id = current._id;
                        existingItem.requestmode = current.requestmode;
                        existingItem.productname = current.materialnew;
                        existingItem.materialnew = current.materialnew;
                        existingItem.uomcodenew = current.uomcodenew;
                    } else {
                        // Add new item
                        acc.push({
                            company: current.company,
                            _id: current._id,
                            branch: current.branch,
                            unit: current.unit,
                            floor: current.floor,
                            area: current.area,
                            status: current.status,
                            location: current.location,
                            productname: current.materialnew,
                            materialnew: current.materialnew,
                            requestmode: current.requestmode,
                            uomcodenew: current.uomcodenew,
                            purchasecount: Number(current.quantitynew),
                            purchasecountstock: Number(current.quantitynew),
                        });
                    }
                    return acc;
                }, []);

                let merge = getfilter.map((item) => {



                    let findquantity = singlehandtotal.find(
                        (d) =>
                            item.company === d.company &&
                            item.branch === d.branch &&
                            item.unit === d.unit &&
                            item.floor === d.floor &&
                            item.area === d.area &&
                            item.location === d.location &&
                            item.productname === d.productname
                    );

                    let findreturnquantity = singlereturntotal.find(
                        (d) =>
                            item.company === d.company &&
                            item.branch === d.branch &&
                            item.unit === d.unit &&
                            item.floor === d.floor &&
                            item.area === d.area &&
                            item.location === d.location &&
                            item.productname === d.productname
                    );

                    let findusagecount = singleusagecounttotal.find(
                        (d) =>
                            item.company === d.company &&
                            item.branch === d.branch &&
                            item.unit === d.unit &&
                            item.floor === d.floor &&
                            item.area === d.area &&
                            item.location === d.location &&
                            item.productname === d.productname
                    );

                    let matchHandItems =
                        singlehandtotal.length > 0
                            ? findquantity
                                ? findquantity.countquantity
                                : 0
                            : 0;
                    let matchReturnItems =
                        singlereturntotal.length > 0
                            ? findreturnquantity
                                ? findreturnquantity.countquantity
                                : 0
                            : 0;

                    // console.log(matchReturnItems, "return")

                    let matchUsageCountItems =
                        singleusagecounttotal.length > 0
                            ? findusagecount
                                ? findusagecount.countquantity
                                : 0
                            : 0;
                    // console.log(matchItems, "matchItems")

                    if (matchHandItems || matchReturnItems || matchUsageCountItems) {
                        let matchqty = matchHandItems ? Number(matchHandItems) : 0;
                        let usedcountqty = Number(matchHandItems) - Number(matchReturnItems)

                        let allused = usedcountqty + Number(matchUsageCountItems)
                        // console.log(matchqty, "matchqty")
                        return {
                            ...item,
                            purchasecountstock: Number(item.purchasecountstock),
                            usedcount: allused,
                            balancedcount:
                                Number(item.purchasecountstock) -
                                Number(allused),

                            handovercount: Number(matchHandItems),
                            returncount: Number(matchReturnItems),
                            usagecount: Number(matchUsageCountItems),
                        };
                    } else {
                        return {
                            ...item,
                            usedcount: 0,
                            handovercount: 0,
                            returncount: 0,
                            usagecount: 0,
                            balancedcount: Number(item.purchasecountstock) - 0,
                        };
                    }
                });

                // console.log(merge, "mergestock")
                let quantityAndUom = merge.map((data, newindex) => ({
                    ...data,
                    uomnew: `${data.purchasecountstock}#${data.uomcodenew}`,
                }));


                setStock(quantityAndUom);
            }


            setProjectCheck(false);
        } catch (err) {
            setProjectCheck(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };



    const getCodeAssetLog = async (data) => {
        // console.log(data, "data")
        try {
            let res = await axios.post(SERVICE.STOCKMANAGEMENT_VIEW_DATE_INDIVIDUAL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                usercompany: data.company,
                userbranch: data.branch,
                userunit: data.unit,
                productname: data.productname,
                // quantity: data.purhasecount,
                requestmode: data.requestmode
            });

            setAssetLog(res.data.stock);
            // setAssetLog([]);
            handleViewOpenAsset();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };


    //view asset table asset
    const gridRefviewasset = useRef(null);
    const [pageViewasset, setPageViewasset] = useState(1);
    const [pageSizeviewasset, setPageSizeViewasset] = useState(10);
    const [searchQueryViewasset, setSearchQueryViewasset] = useState("");
    const [isManageColumnsOpenviewasset, setManageColumnsOpenviewasset] =
        useState(false);
    const [anchorElViewasset, setAnchorElViewasset] = useState(null);
    const openView1asset = Boolean(anchorElViewasset);
    const idViewasset = openView1asset ? "simple-popover" : undefined;

    const [selectedRowsViewasset, setSelectedRowsViewasset] = useState([]);
    const [searchQueryManageViewasset, setSearchQueryManageViewasset] =
        useState("");

    // Manage Columns View

    const handleOpenManageColumnsViewasset = (event) => {
        setAnchorElViewasset(event.currentTarget);
        setManageColumnsOpenviewasset(true);
    };
    const handleCloseManageColumnsViewasset = () => {
        setManageColumnsOpenviewasset(false);
        setSearchQueryManageViewasset("");
    };

    const getRowClassNameViewasset = (params) => {
        if (selectedRowsViewasset.includes(params.data.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    // JSX for the "Manage Columns" popover content

    const initialColumnVisibilityViewasset = {
        serialNumber: true,
        checkbox: true,
        company: true,
        branch: true,
        quantity: true,
        unit: true,
        addedbyname: true,
        usercompany: true,
        userbranch: true,
        userunit: true,
        userfloor: true,
        userarea: true,
        userlocation: true,
        userteam: true,
        useremployee: true,
        allotstatus: true,
        floor: true,
        area: true,
        location: true,
        material: true,
        productname: true,
        employeenameto: true,
        handover: true,
        countquantity: true,
        addedbyname: true,
        addedby: true,
        actions: true,
    };

    const [columnVisibilityViewasset, setColumnVisibilityViewasset] = useState(
        initialColumnVisibilityViewasset
    );

    const [itemsViewasset, setItemsViewasset] = useState([]);

    const addSerialNumberViewasset = (datas) => {
        const itemsWithSerialNumberViewasset = datas?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
            // addedbyname: (item.addedby[0].empname),
            addedby: moment(item.addedby[0]?.date).format("DD-MM-YYYY hh:mm:ss a"),
            addedbyname: item.addedby[0]?.name,


        }));
        setItemsViewasset(itemsWithSerialNumberViewasset);
    };

    useEffect(() => {
        addSerialNumberViewasset(assetlog);
    }, [assetlog]);

    //Datatable
    const handlePageChangeViewasset = (newPage) => {
        setPageViewasset(newPage);
        setSelectedRowsViewasset([]);
    };

    const handlePageSizeChangeviewasset = (event) => {
        setPageSizeViewasset(Number(event.target.value));
        setPageViewasset(1);
    };

    //datatable....
    const handleSearchChangeviewasset = (event) => {
        setSearchQueryViewasset(event.target.value);
    };
    // Split the search query into individual terms
    const searchTermsViewasset = searchQueryViewasset.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatasViewasset = itemsViewasset?.filter((item) => {
        return searchTermsViewasset.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });

    const filteredDataViewasset = filteredDatasViewasset?.slice(
        (pageViewasset - 1) * pageSizeviewasset,
        pageViewasset * pageSizeviewasset
    );

    const totalPagesViewasset = Math.ceil(
        filteredDatasViewasset?.length / pageSizeviewasset
    );

    const visiblePagesviewasset = Math.min(totalPagesViewasset, 3);

    const firstVisiblePageviewasset = Math.max(1, pageViewasset - 1);
    const lastVisiblePageViewasset = Math.min(
        firstVisiblePageviewasset + visiblePagesviewasset - 1,
        totalPagesViewasset
    );

    const pageNumbersViewasset = [];

    const indexOfLastItemviewasset = pageViewasset * pageSizeviewasset;
    const indexOfFirstItemViewasset =
        indexOfLastItemviewasset - pageSizeviewasset;

    for (let i = firstVisiblePageviewasset; i <= lastVisiblePageViewasset; i++) {
        pageNumbersViewasset.push(i);
    }

    const columnDataTableviewasset = [
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 100,
            headerClassName: "bold-header",
        },

        // {
        //     field: "usercompany",
        //     headerName: "Company",
        //     flex: 0,
        //     width: 100,
        //     hide: !columnVisibilityViewasset.usercompany,
        //     headerClassName: "bold-header",
        // },
        // {
        //     field: "userbranch",
        //     headerName: "Branch",
        //     flex: 0,
        //     width: 180,
        //     hide: !columnVisibilityViewasset.userbranch,
        //     headerClassName: "bold-header",
        // },
        // {
        //     field: "userunit",
        //     headerName: "Unit",
        //     flex: 0,
        //     width: 140,
        //     hide: !columnVisibilityViewasset.userunit,
        //     headerClassName: "bold-header",
        // },
        // {
        //     field: "userteam",
        //     headerName: "Team",
        //     flex: 0,
        //     width: 140,
        //     hide: !columnVisibilityViewasset.userteam,
        //     headerClassName: "bold-header",
        // },

        {
            field: "productname",
            headerName: "Material",
            flex: 0,
            width: 250,
            hide: !columnVisibilityViewasset.productname,
            headerClassName: "bold-header",
        },
        {
            field: "countquantity",
            headerName: "Returned Quantity",
            flex: 0,
            width: 250,
            hide: !columnVisibilityViewasset.countquantity,
            headerClassName: "bold-header",
        },


        {
            field: "addedbyname",
            headerName: "Added By",
            flex: 0,
            width: 250,
            hide: !columnVisibilityViewasset.addedbyname,
            headerClassName: "bold-header",
        },

        {
            field: "addedby",
            headerName: "Created Date & Time",
            flex: 0,
            width: 250,
            hide: !columnVisibilityViewasset.addedby,
            headerClassName: "bold-header",
        },
    ];

    const rowDataTableViewasset = filteredDataViewasset.map((item, index) => {
        return {
            ...item,
            id: item.serialNumber,
            serialNumber: item.serialNumber,
            ids: item._id,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            floor: item.floor,
            area: item.area,
            usercompany: item.company,
            userbranch: item.branch,
            userunit: item.unit,
            userteam: item.team,
            location: item.location,
            material: item.material,
            handover: item.handover,
            productname: item.productname,
            quantity: item.quantity,
            countquantity: item.countquantity,
            employeenameto: item.employeenameto,
            addedby: item.addedby,
            addedbyname: item.addedbyname,
        };
    });

    const rowsWithCheckboxesViewasset = rowDataTableViewasset.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRowsViewasset.includes(row.id),
    }));

    // Show All Columns functionality
    const handleShowAllColumnsViewasset = () => {
        const updatedVisibilityViewasset = { ...columnVisibilityViewasset };
        for (const columnKey in updatedVisibilityViewasset) {
            updatedVisibilityViewasset[columnKey] = true;
        }
        setColumnVisibilityViewasset(updatedVisibilityViewasset);
    };

    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibilityViewasset = localStorage.getItem(
            "columnVisibilityasset"
        );
        if (savedVisibilityViewasset) {
            setColumnVisibilityViewasset(JSON.parse(savedVisibilityViewasset));
        }
    }, []);

    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem(
            "columnVisibilityViewasset",
            JSON.stringify(columnVisibilityViewasset)
        );
    }, [columnVisibilityViewasset]);

    // // Function to filter columns based on search query
    const filteredColumnsViewasset = columnDataTableviewasset.filter((column) =>
        column.headerName
            .toLowerCase()
            .includes(searchQueryManageViewasset.toLowerCase())
    );

    const manageColumnsContentviewasset = (
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
                onClick={handleCloseManageColumnsViewasset}
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
                    value={searchQueryManageViewasset}
                    onChange={(e) => setSearchQueryManageViewasset(e.target.value)}
                    sx={{ marginBottom: 5, position: "absolute" }}
                />
            </Box>
            <br />
            <br />
            <DialogContent
                sx={{ minWidth: "auto", height: "200px", position: "relative" }}
            >
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumnsViewasset.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText
                                sx={{ display: "flex" }}
                                primary={
                                    <Switch
                                        sx={{ marginTop: "-5px" }}
                                        size="small"
                                        checked={columnVisibilityViewasset[column.field]}
                                        onChange={() =>
                                            toggleColumnVisibilityviewasset(column.field)
                                        }
                                    />
                                }
                                secondary={
                                    column.field === "checkbox" ? "Checkbox" : column.headerName
                                }
                            // secondary={column.headerName }
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
                            onClick={() =>
                                setColumnVisibilityViewasset(initialColumnVisibilityViewasset)
                            }
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
                                columnDataTableviewasset.forEach((column) => {
                                    newColumnVisibility[column.field] = false; // Set hide property to true
                                });
                                setColumnVisibilityViewasset(newColumnVisibility);
                            }}
                        >
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );

    // Manage Columns functionality
    const toggleColumnVisibilityviewasset = (field) => {
        setColumnVisibilityViewasset((prevVisibilityView) => ({
            ...prevVisibilityView,
            [field]: !prevVisibilityView[field],
        }));
    };


    //view table
    const gridRefview = useRef(null);
    const [pageView, setPageView] = useState(1);
    const [pageSizeview, setPageSizeView] = useState(10);
    const [searchQueryView, setSearchQueryView] = useState("");
    const [isManageColumnsOpenview, setManageColumnsOpenview] = useState(false);
    const [anchorElView, setAnchorElView] = useState(null);
    const openView1 = Boolean(anchorElView);
    const idView = openView1 ? "simple-popover" : undefined;

    const [selectedRowsView, setSelectedRowsView] = useState([]);
    const [searchQueryManageView, setSearchQueryManageView] = useState("");

    // Manage Columns View

    const handleOpenManageColumnsView = (event) => {
        setAnchorElView(event.currentTarget);
        setManageColumnsOpenview(true);
    };
    const handleCloseManageColumnsview = () => {
        setManageColumnsOpenview(false);
        setSearchQueryManageView("");
    };

    const getRowClassNameView = (params) => {
        if (selectedRowsView.includes(params.data.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    const initialColumnVisibilityView = {
        serialNumber: true,
        checkbox: true,
        company: true,
        branch: true,
        unit: true,
        floor: true,
        area: true,
        location: true,
        materialnew: true,
        quantitynew: true,
        employeenameto: true,
        allotstatus: true,
        addedby: true,
        addedbyname: true,
        countquantity: true,
        actions: true,
    };

    const [columnVisibilityView, setColumnVisibilityView] = useState(
        initialColumnVisibilityView
    );

    const [itemsView, setItemsView] = useState([]);

    const addSerialNumberView = (datas) => {
        const itemsWithSerialNumberView = datas?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,


        }));
        setItemsView(itemsWithSerialNumberView);
    };

    useEffect(() => {
        addSerialNumberView(stocklog);
    }, [stocklog]);

    //Datatable
    const handlePageChangeView = (newPage) => {
        setPageView(newPage);
        setSelectedRowsView([]);
    };

    const handlePageSizeChangeview = (event) => {
        setPageSizeView(Number(event.target.value));
        setPageView(1);
    };

    //datatable....
    const handleSearchChangeview = (event) => {
        setSearchQueryView(event.target.value);
    };
    // Split the search query into individual terms
    const searchTermsView = searchQueryView.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatasView = itemsView?.filter((item) => {
        return searchTermsView.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });

    const filteredDataView = filteredDatasView.slice(
        (pageView - 1) * pageSizeview,
        pageView * pageSizeview
    );


    const totalPagesView = Math.ceil(filteredDatasView.length / pageSizeview);

    const visiblePagesview = Math.min(totalPagesView, 3);

    const firstVisiblePageview = Math.max(1, pageView - 1);
    const lastVisiblePageView = Math.min(
        firstVisiblePageview + visiblePagesview - 1,
        totalPagesView
    );

    const pageNumbersView = [];

    const indexOfLastItemview = pageView * pageSizeview;
    const indexOfFirstItemView = indexOfLastItemview - pageSizeview;

    for (let i = firstVisiblePageview; i <= lastVisiblePageView; i++) {
        pageNumbersView.push(i);
    }

    const columnDataTableview = [
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 100,
            headerClassName: "bold-header",
        },
        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 100,
            hide: !columnVisibilityView.company,
            headerClassName: "bold-header",
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 180,
            hide: !columnVisibilityView.branch,
            headerClassName: "bold-header",
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 140,
            hide: !columnVisibilityView.unit,
            headerClassName: "bold-header",
        },
        {
            field: "floor",
            headerName: "Floor",
            flex: 0,
            width: 140,
            hide: !columnVisibilityView.floor,
            headerClassName: "bold-header",
        },
        {
            field: "area",
            headerName: "Area",
            flex: 0,
            width: 140,
            hide: !columnVisibilityView.area,
            headerClassName: "bold-header",
        },
        {
            field: "location",
            headerName: "Location",
            flex: 0,
            width: 140,
            hide: !columnVisibilityView.location,
            headerClassName: "bold-header",
        },
        {
            field: "materialnew",
            headerName: "Material",
            flex: 0,
            width: 200,
            hide: !columnVisibilityView.materialnew,
            headerClassName: "bold-header",
        },

        {
            field: "addedbyname",
            headerName: "Added By",
            flex: 0,
            width: 200,
            hide: !columnVisibilityView.addedbyname,
            headerClassName: "bold-header",
        },
        {
            field: "quantitynew",
            headerName: "Quantity",
            flex: 0,
            width: 200,
            hide: !columnVisibilityView.quantitynew,
            headerClassName: "bold-header",
        },

        {
            field: "addedby",
            headerName: "Created Date & Time",
            flex: 0,
            width: 300,
            hide: !columnVisibilityView.addedby,
            headerClassName: "bold-header",
        },
    ];

    const rowDataTableView = filteredDataView.map((item, index) => {
        return {
            id: item.serialNumber,
            serialNumber: item.serialNumber,
            ids: item._id,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            floor: item.floor,
            area: item.area,
            quantitynew: item.quantitynew,
            addedbyname: item.addedbyname,
            materialnew: item.materialnew,
            location: item.location,
            material: item.material,
            materialnew: item.materialnew,
            quantitynew: item.quantitynew,
            employeenameto: item.employeenameto,
            countquantity: item.countquantity,
            addedby: item.addedby,
        };
    });

    const rowsWithCheckboxesView = rowDataTableView.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRowsView.includes(row.id),
    }));

    // Show All Columns functionality
    const handleShowAllColumnsView = () => {
        const updatedVisibilityView = { ...columnVisibilityView };
        for (const columnKey in updatedVisibilityView) {
            updatedVisibilityView[columnKey] = true;
        }
        setColumnVisibilityView(updatedVisibilityView);
    };

    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibilityView = localStorage.getItem("columnVisibility");
        if (savedVisibilityView) {
            setColumnVisibilityView(JSON.parse(savedVisibilityView));
        }
    }, []);

    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem(
            "columnVisibilityView",
            JSON.stringify(columnVisibilityView)
        );
    }, [columnVisibilityView]);

    // // Function to filter columns based on search query
    const filteredColumnsView = columnDataTableview.filter((column) =>
        column.headerName
            .toLowerCase()
            .includes(searchQueryManageView.toLowerCase())
    );

    // Manage Columns functionality
    const toggleColumnVisibilityview = (field) => {
        setColumnVisibilityView((prevVisibilityView) => ({
            ...prevVisibilityView,
            [field]: !prevVisibilityView[field],
        }));
    };

    // JSX for the "Manage Columns" popover content
    const manageColumnsContentview = (
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
                onClick={handleCloseManageColumnsview}
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
                    value={searchQueryManageView}
                    onChange={(e) => setSearchQueryManageView(e.target.value)}
                    sx={{ marginBottom: 5, position: "absolute" }}
                />
            </Box>
            <br />
            <br />
            <DialogContent
                sx={{ minWidth: "auto", height: "200px", position: "relative" }}
            >
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumnsView.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText
                                sx={{ display: "flex" }}
                                primary={
                                    <Switch
                                        sx={{ marginTop: "-5px" }}
                                        size="small"
                                        checked={columnVisibilityView[column.field]}
                                        onChange={() => toggleColumnVisibilityview(column.field)}
                                    />
                                }
                                secondary={
                                    column.field === "checkbox" ? "Checkbox" : column.headerName
                                }
                            // secondary={column.headerName }
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
                            onClick={() =>
                                setColumnVisibilityView(initialColumnVisibilityView)
                            }
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
                                columnDataTableview.forEach((column) => {
                                    newColumnVisibility[column.field] = false; // Set hide property to true
                                });
                                setColumnVisibilityView(newColumnVisibility);
                            }}
                        >
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );


    const handleChangephonenumber = (e) => {
        // const regex = /^\d*\.?\d*$/;
        // const regex = /^\d+$/; // Allows only whole numbers
        const regex = /^[1-9]\d*$/;
        const inputValue = e.target.value;
        if (regex.test(inputValue) || inputValue === "") {
            setStockManagehand({ ...stockManagehand, countquantity: inputValue });
        }
    };


    return (
        <Box>
            <Headtitle title={"Stock Count List"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Stock Count"
                modulename="Production"
                submodulename="Manual Entry"
                mainpagename="Approve List"
                subpagename=""
                subsubpagename=""
            />




            <br />

            {/* ****** Table Start ****** */}
            {/* {isUserRoleCompare?.includes("lstockmanagement") && ( */}
            <>
                <Box sx={userStyle.container}>
                    {/* ******************************************************EXPORT Buttons****************************************************** */}
                    <Grid item xs={8}>
                        <Typography sx={userStyle.importheadtext}>Stock Count Lisss</Typography>
                    </Grid>
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
                                    <MenuItem value={usageCountAll?.length}>All</MenuItem>
                                </Select>
                            </Box>
                        </Grid>
                        <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Box>
                                {isUserRoleCompare?.includes("excelstockmanagement") && (
                                    <>
                                        <Button onClick={(e) => {
                                            setIsFilterOpen(true)
                                            setFormat("xl")
                                        }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                    </>
                                )}
                                {isUserRoleCompare?.includes("csvstockmanagement") && (
                                    <>
                                        <Button onClick={(e) => {
                                            setIsFilterOpen(true)
                                            setFormat("csv")
                                        }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                    </>
                                )}
                                {isUserRoleCompare?.includes("printstockmanagement") && (
                                    <>
                                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                            &ensp;
                                            <FaPrint />
                                            &ensp;Print&ensp;
                                        </Button>
                                    </>
                                )}
                                {isUserRoleCompare?.includes("pdfstockmanagement") && (
                                    <>
                                        <Button
                                            sx={userStyle.buttongrp}
                                            onClick={() => {
                                                setIsPdfFilterOpen(true)
                                            }}
                                        >
                                            <FaFilePdf />
                                            &ensp;Export to PDF&ensp;
                                        </Button>
                                    </>
                                )}
                                {isUserRoleCompare?.includes("imagestockmanagement") && (
                                    <>
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                            {" "}
                                            <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </Grid>
                        <Grid item md={2} xs={12} sm={12}>
                            <Box>

                                <AggregatedSearchBar
                                    columnDataTable={columnDataTable}
                                    setItems={setItems}
                                    addSerialNumber={addSerialNumber}
                                    setPage={setPage}
                                    maindatas={usageCountAll}
                                    setSearchedString={setSearchedString}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                    <br />
                    <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                        Show All Columns
                    </Button>
                    &ensp;
                    <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
                        Manage Columns
                    </Button>
                    &ensp;
                    <br />
                    <br />

                    {projectCheck ? (
                        <>
                            <Box sx={{ display: "flex", justifyContent: "center" }}>

                                <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                            </Box>
                        </>
                    ) : (
                        <>
                            <AggridTable
                                rowDataTable={rowDataTable}
                                columnDataTable={columnDataTable}
                                columnVisibility={columnVisibility}
                                page={page}
                                setPage={setPage}
                                pageSize={pageSize}
                                totalPages={totalPages}
                                setColumnVisibility={setColumnVisibility}
                                isHandleChange={isHandleChange}
                                items={items}
                                selectedRows={selectedRows}
                                setSelectedRows={setSelectedRows}
                                gridRefTable={gridRefTable}
                                paginated={false}
                                filteredDatas={filteredDatas}
                                // totalDatas={totalDatas}
                                searchQuery={searchedString}
                                handleShowAllColumns={handleShowAllColumns}
                                setFilteredRowData={setFilteredRowData}
                                filteredRowData={filteredRowData}
                                setFilteredChanges={setFilteredChanges}
                                filteredChanges={filteredChanges}
                                gridRefTableImg={gridRefTableImg}
                            />
                        </>

                    )}




                    {/* ****** Table End ****** */}
                </Box>
            </>
            {/* // )} */}
            {/* ****** Table End ****** */}

            {/* Manage Column */}
            <Popover
                id={id}
                open={isManageColumnsOpen}
                anchorEl={anchorEl}
                onClose={handleCloseManageColumns}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                {manageColumnsContent}
            </Popover>

            {/* ALERT DIALOG */}
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


            <Dialog
                open={isEditOpenReturn}
                onClose={handleCloseModEditReturn}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
                fullWidth={true}
            >
                <Box sx={{ padding: "20px " }}>
                    <>
                        <Grid container spacing={2}>
                            <Typography sx={userStyle.HeaderText}>Return Count</Typography>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            <br />
                            <Table>
                                <TableHead>
                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                        {"SNO"}.
                                    </StyledTableCell>
                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                        {" "}
                                        {"Company"}
                                    </StyledTableCell>
                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                        {" "}
                                        {"Branch"}
                                    </StyledTableCell>
                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                        {" "}
                                        {"Unit"}
                                    </StyledTableCell>
                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                        {" "}
                                        {"Team"}
                                    </StyledTableCell>
                                    {/* <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                      {" "}
                      {"Area"}
                    </StyledTableCell>
                    <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                      {" "}
                      {"Location"}
                    </StyledTableCell> */}
                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                        {" "}
                                        {"Material"}
                                    </StyledTableCell>
                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                        {" "}
                                        {"Employee"}
                                    </StyledTableCell>
                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                        {" "}
                                        {"Overall Quantity"}
                                    </StyledTableCell>
                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                        {" "}
                                        {"Returned Quantity"}
                                    </StyledTableCell>
                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                        {" "}
                                        {"Actual Quantity"}
                                    </StyledTableCell>
                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                        {" "}
                                        {"Return Quantity"}
                                    </StyledTableCell>

                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                        {" "}
                                        {"Date"}
                                    </StyledTableCell>
                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                        {" "}
                                        {"Actions"}
                                    </StyledTableCell>

                                </TableHead>
                                <TableBody>
                                    {todoscheck?.length > 0 &&
                                        todoscheck.map((item, index, i) => (
                                            <>
                                                {editingIndexcheck === index ? (
                                                    <StyledTableRow key={index}>
                                                        <StyledTableCell
                                                            sx={{ padding: "5px 10px !important" }}
                                                        >
                                                            {index + 1}
                                                        </StyledTableCell>
                                                        <StyledTableCell
                                                            sx={{ padding: "5px 10px !important" }}
                                                        >
                                                            {" "}
                                                            {item.usercompany}
                                                        </StyledTableCell>
                                                        <StyledTableCell
                                                            sx={{ padding: "5px 10px !important" }}
                                                        >
                                                            {" "}
                                                            {item.userbranch}
                                                        </StyledTableCell>
                                                        <StyledTableCell
                                                            sx={{ padding: "5px 10px !important" }}
                                                        >
                                                            {" "}
                                                            {item.userunit}
                                                        </StyledTableCell>
                                                        <StyledTableCell
                                                            sx={{ padding: "5px 10px !important" }}
                                                        >
                                                            {" "}
                                                            {item.userteam}
                                                        </StyledTableCell>
                                                        {/* <StyledTableCell
                                sx={{ padding: "5px 10px !important" }}
                              >
                                {" "}
                                {item.area}
                              </StyledTableCell>
                              <StyledTableCell
                                sx={{ padding: "5px 10px !important" }}
                              >
                                {" "}
                                {item.location}
                              </StyledTableCell> */}
                                                        <StyledTableCell
                                                            sx={{ padding: "5px 10px !important" }}
                                                        >
                                                            {" "}
                                                            {item.productname}
                                                        </StyledTableCell>
                                                        <StyledTableCell
                                                            sx={{ padding: "5px 10px !important" }}
                                                        >
                                                            {" "}
                                                            {item.employeenameto}
                                                        </StyledTableCell>

                                                        <StyledTableCell
                                                            sx={{ padding: "5px 10px !important" }}
                                                        >
                                                            {" "}
                                                            {item.overallcountquantity}
                                                        </StyledTableCell>
                                                        <StyledTableCell
                                                            sx={{ padding: "5px 10px !important" }}
                                                        >
                                                            {" "}
                                                            {item.returnedqty}
                                                        </StyledTableCell>
                                                        <StyledTableCell
                                                            sx={{ padding: "5px 10px !important" }}
                                                        >
                                                            {" "}
                                                            {item.countquantity}
                                                        </StyledTableCell>
                                                        <StyledTableCell
                                                            sx={{ padding: "5px 10px !important" }}
                                                        >
                                                            <OutlinedInput
                                                                id="component-outlined"
                                                                type="number"
                                                                sx={userStyle.input}
                                                                value={quantityedit}
                                                                onChange={(e) => {
                                                                    handleChangephonenumberEdit(
                                                                        e,
                                                                        item.countquantity
                                                                    );
                                                                    // getHighestEmpcodeForBranchhigh(valuecateedit)
                                                                }}
                                                            />
                                                        </StyledTableCell>


                                                        <StyledTableCell
                                                            sx={{ padding: "5px 10px !important" }}
                                                        >
                                                            {" "}
                                                            {moment(
                                                                item.addedby ? item.addedby[0]?.date : ""
                                                            ).format("DD-MM-YYYY hh:mm:ss a")}
                                                        </StyledTableCell>
                                                        <StyledTableCell
                                                            sx={{ padding: "5px 10px !important" }}
                                                        >
                                                            <Button
                                                                variant="contained"
                                                                style={{
                                                                    minWidth: "20px",
                                                                    minHeight: "41px",
                                                                    background: "transparent",
                                                                    boxShadow: "none",
                                                                    marginTop: "-3px !important",
                                                                    "&:hover": {
                                                                        background: "#f4f4f4",
                                                                        borderRadius: "50%",
                                                                        minHeight: "41px",
                                                                        minWidth: "20px",
                                                                        boxShadow: "none",
                                                                    },
                                                                }}
                                                                onClick={handleUpdateTodocheck}
                                                            >
                                                                <CheckCircleIcon
                                                                    style={{
                                                                        color: "#216d21",
                                                                        fontSize: "1.5rem",
                                                                    }}
                                                                />
                                                            </Button>
                                                        </StyledTableCell>


                                                    </StyledTableRow>
                                                ) : (
                                                    <StyledTableRow>
                                                        <StyledTableCell
                                                            sx={{ padding: "5px 10px !important" }}
                                                        >
                                                            {index + 1}.
                                                        </StyledTableCell>
                                                        <StyledTableCell
                                                            sx={{ padding: "5px 10px !important" }}
                                                        >
                                                            {" "}
                                                            {item.usercompany}
                                                        </StyledTableCell>
                                                        <StyledTableCell
                                                            sx={{ padding: "5px 10px !important" }}
                                                        >
                                                            {" "}
                                                            {item.userbranch}
                                                        </StyledTableCell>
                                                        <StyledTableCell
                                                            sx={{ padding: "5px 10px !important" }}
                                                        >
                                                            {" "}
                                                            {item.userunit}
                                                        </StyledTableCell>
                                                        <StyledTableCell
                                                            sx={{ padding: "5px 10px !important" }}
                                                        >
                                                            {" "}
                                                            {item.userteam}
                                                        </StyledTableCell>
                                                        {/* <StyledTableCell
                                sx={{ padding: "5px 10px !important" }}
                              >
                                {" "}
                                {item.area}
                              </StyledTableCell>
                              <StyledTableCell
                                sx={{ padding: "5px 10px !important" }}
                              >
                                {" "}
                                {item.location}
                              </StyledTableCell> */}
                                                        <StyledTableCell
                                                            sx={{ padding: "5px 10px !important" }}
                                                        >
                                                            {" "}
                                                            {item.productname}
                                                        </StyledTableCell>
                                                        <StyledTableCell
                                                            sx={{ padding: "5px 10px !important" }}
                                                        >
                                                            {" "}
                                                            {item.employeenameto}
                                                        </StyledTableCell>
                                                        <StyledTableCell
                                                            sx={{ padding: "5px 10px !important" }}
                                                        >
                                                            {" "}
                                                            {item.overallcountquantity}
                                                        </StyledTableCell>
                                                        <StyledTableCell
                                                            sx={{ padding: "5px 10px !important" }}
                                                        >
                                                            {" "}
                                                            {item.returnedqty}
                                                        </StyledTableCell>

                                                        <StyledTableCell
                                                            sx={{ padding: "5px 10px !important" }}
                                                        >
                                                            {" "}
                                                            {item.countquantity}
                                                        </StyledTableCell>
                                                        <StyledTableCell
                                                            sx={{ padding: "5px 10px !important" }}
                                                        >
                                                            {" "}
                                                            {item.returnqty}
                                                        </StyledTableCell>
                                                        {/* overallqty */}


                                                        <StyledTableCell
                                                            sx={{ padding: "5px 10px !important" }}
                                                        >
                                                            {" "}
                                                            {moment(
                                                                item.addedby ? item.addedby[0]?.date : ""
                                                            ).format("DD-MM-YYYY hh:mm:ss a")}
                                                        </StyledTableCell>
                                                        <StyledTableCell
                                                            sx={{ padding: "5px 10px !important" }}
                                                        >
                                                            {" "}
                                                            <Button
                                                                variant="contained"
                                                                style={{
                                                                    minWidth: "20px",
                                                                    minHeight: "41px",
                                                                    background: "transparent",
                                                                    boxShadow: "none",
                                                                    marginTop: "-13px !important",
                                                                    "&:hover": {
                                                                        background: "#f4f4f4",
                                                                        borderRadius: "50%",
                                                                        minHeight: "41px",
                                                                        minWidth: "20px",
                                                                        boxShadow: "none",
                                                                    },
                                                                }}
                                                                onClick={() => handleEditTodocheck(index)}
                                                            >
                                                                <FaEdit
                                                                    style={{
                                                                        color: "#1976d2",
                                                                        fontSize: "1.2rem",
                                                                    }}
                                                                />
                                                            </Button>{" "}
                                                        </StyledTableCell>

                                                    </StyledTableRow>
                                                )}
                                            </>
                                        ))}
                                </TableBody>
                            </Table>
                        </Grid>
                        <br />
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                                <Button variant="contained" onClick={handlesubmitstockReturn}>
                                    {" "}
                                    Update
                                </Button>
                            </Grid>
                            <br />
                            <Grid item md={6} xs={12} sm={12}>
                                <Button
                                    sx={userStyle.btncancel}
                                    onClick={handleCloseModEditReturn}
                                >
                                    {" "}
                                    Cancel{" "}
                                </Button>
                            </Grid>
                        </Grid>
                    </>
                </Box>
            </Dialog>


            <Box>
                {/* Edit DIALOG */}
                <Dialog
                    open={isEditOpenused}
                    onClose={handleCloseModEditused}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="lg"
                    fullWidth={true}
                    sx={{ marginTop: "95px" }}

                >
                    <Box sx={{ padding: "20px 50px" }}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item md={12} xs={12} sm={12}>
                                    <Typography sx={userStyle.HeaderText}>
                                        Usage Count
                                    </Typography>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <Typography sx={userStyle.HeaderText}>
                                        <Typography>Quantity : <b style={{ color: "cornflowerblue" }}>{handover.countquantity}</b></Typography>
                                    </Typography>
                                </Grid>

                                <Grid item md={3} xs={12} sm={12}>
                                    <Typography sx={userStyle.HeaderText}>
                                        <Typography>Balance Count : <b style={{ color: "cornflowerblue" }}>{handover.balancecount}</b></Typography>
                                    </Typography>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <Typography sx={userStyle.HeaderText}>
                                        <Typography>Material : <b style={{ color: "cornflowerblue" }}>{viewusagecount}</b></Typography>
                                    </Typography>
                                </Grid>


                            </Grid>
                            <br />
                            <Grid container spacing={2}>

                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Type<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={statusOpt}
                                            styles={colourStyles}
                                            value={{ label: stockManagehand.type, value: stockManagehand.type }}
                                            onChange={(e) => {
                                                setStockManagehand({
                                                    ...stockManagehand,
                                                    type: e.value,
                                                    company: "Please Select Company",
                                                    branch: "Please Select Branch",
                                                    unit: "Please Select Unit",
                                                    floor: "Please Select Floor",
                                                    area: "Please Select Area",
                                                    location: "Please Select Location",
                                                    assetmaterial: "Please Select AssetMaterial",
                                                    employeenameto: "Please Select Employee",
                                                });
                                                setUnits([]);
                                                setFloors([]);
                                                setAreas([]);
                                                // setTeamOption([])
                                                // setEmployeesall([])
                                                setLocations([{ label: "ALL", value: "ALL" }]);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                {stockManagehand.type === "Employee" && (
                                    <>

                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Company<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    options={companys}
                                                    styles={colourStyles}
                                                    value={{
                                                        label: stockManagehand.company,
                                                        value: stockManagehand.company,
                                                    }}
                                                    onChange={(e) => {
                                                        setStockManagehand({
                                                            ...stockManagehand,
                                                            company: e.value,
                                                            branch: "Please Select Branch",
                                                            unit: "Please Select Unit",
                                                            floor: "Please Select Floor",
                                                            area: "Please Select Area",
                                                            location: "Please Select Location",
                                                            assetmaterial: "Please Select AssetMaterial",
                                                            employeenameto: "Please Select Employee",
                                                        });
                                                        setUnits([]);
                                                        setFloors([]);
                                                        setAreas([]);
                                                        // setTeamOption([])
                                                        // setEmployeesall([])
                                                        setLocations([{ label: "ALL", value: "ALL" }]);
                                                        fetchBranchDropdowns(e);
                                                        fetchUnits(e);
                                                        fetchFloor(e);
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Branch<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    options={branchs}
                                                    styles={colourStyles}
                                                    value={{
                                                        label: stockManagehand.branch,
                                                        value: stockManagehand.branch,
                                                    }}
                                                    onChange={(e) => {
                                                        setStockManagehand({
                                                            ...stockManagehand,
                                                            branch: e.value,
                                                            unit: "Please Select Unit",
                                                            floor: "Please Select Floor",
                                                            area: "Please Select Area",
                                                            location: "Please Select Location",
                                                            assetmaterial: "Please Select AssetMaterial",
                                                            employeenameto: "Please Select Employee",
                                                        });
                                                        setLocations([{ label: "ALL", value: "ALL" }]);
                                                        setAreas([])
                                                        fetchUnits(e);
                                                        fetchFloor(e);
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>

                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Unit<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    options={units}
                                                    styles={colourStyles}
                                                    value={{
                                                        label: stockManagehand.unit,
                                                        value: stockManagehand.unit,
                                                    }}
                                                    onChange={(e) => {
                                                        setStockManagehand({
                                                            ...stockManagehand,
                                                            unit: e.value,
                                                            workstation: "",
                                                        });
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>

                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Floor<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    options={floors}
                                                    styles={colourStyles}
                                                    value={{
                                                        label: stockManagehand.floor,
                                                        value: stockManagehand.floor,
                                                    }}
                                                    onChange={(e) => {
                                                        setStockManagehand({
                                                            ...stockManagehand,
                                                            floor: e.value,
                                                            workstation: "",
                                                            area: "Please Select Area",
                                                        });
                                                        // setAreas([]);
                                                        setLocations([{ label: "ALL", value: "ALL" }]);
                                                        fetchArea(e.value);
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>

                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Area<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    options={areas}
                                                    styles={colourStyles}
                                                    value={{
                                                        label: stockManagehand.area,
                                                        value: stockManagehand.area,
                                                    }}
                                                    onChange={(e) => {
                                                        setStockManagehand({
                                                            ...stockManagehand,
                                                            area: e.value,
                                                            workstation: "",
                                                            location: "Please Select Location",
                                                        });
                                                        setLocations([{ label: "ALL", value: "ALL" }]);
                                                        fetchLocation(e.value);
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Location<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    options={locations}
                                                    styles={colourStyles}
                                                    value={{
                                                        label: stockManagehand.location,
                                                        value: stockManagehand.location,
                                                    }}
                                                    onChange={(e) => {
                                                        setStockManagehand({
                                                            ...stockManagehand,
                                                            location: e.value,
                                                            workstation: "",
                                                        });
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>

                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Team<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    options={teamoption
                                                        .filter((d) => d.unit === stockManagehand.unit)
                                                        .map((d) => ({
                                                            ...d,
                                                            label: d.teamname,
                                                            value: d.teamname,
                                                        }))}
                                                    styles={colourStyles}
                                                    value={{
                                                        label: stockManagehand.team,
                                                        value: stockManagehand.team,
                                                    }}
                                                    onChange={(e) => {
                                                        setStockManagehand({
                                                            ...stockManagehand,

                                                            team: e.value,
                                                            employeenameto: "Please Select Employee",
                                                        });
                                                        setLocations([{ label: "ALL", value: "ALL" }]);
                                                        fetchArea(e.value);
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>

                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Employee Name <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    options={employeesall
                                                        ?.filter(
                                                            (comp) =>
                                                                stockManagehand.company === comp.company &&
                                                                stockManagehand.branch === comp.branch &&
                                                                stockManagehand.unit === comp.unit &&
                                                                stockManagehand.team === comp.team
                                                        )
                                                        ?.map((com) => ({
                                                            ...com,
                                                            label: com.companyname,
                                                            value: com.companyname,
                                                        }))}
                                                    value={{
                                                        label: stockManagehand.employeenameto,
                                                        value: stockManagehand.employeenameto,
                                                    }}
                                                    onChange={(e) => {
                                                        setStockManagehand({
                                                            ...stockManagehand,
                                                            employeenameto: e.value,
                                                        });
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </>
                                )}

                                {stockManagehand.type === "Location" && (
                                    <>

                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Company<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    options={companys}
                                                    styles={colourStyles}
                                                    value={{
                                                        label: stockManagehand.company,
                                                        value: stockManagehand.company,
                                                    }}
                                                    onChange={(e) => {
                                                        setStockManagehand({
                                                            ...stockManagehand,
                                                            company: e.value,
                                                            branch: "Please Select Branch",
                                                            unit: "Please Select Unit",
                                                            floor: "Please Select Floor",
                                                            area: "Please Select Area",
                                                            location: "Please Select Location",
                                                            assetmaterial: "Please Select AssetMaterial",
                                                            employeenameto: "Please Select Employee",
                                                        });
                                                        setUnits([]);
                                                        setFloors([]);
                                                        setAreas([]);
                                                        // setTeamOption([])
                                                        // setEmployeesall([])
                                                        setLocations([{ label: "ALL", value: "ALL" }]);
                                                        fetchBranchDropdowns(e);
                                                        fetchUnits(e);
                                                        fetchFloor(e);
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Branch<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    options={branchs}
                                                    styles={colourStyles}
                                                    value={{
                                                        label: stockManagehand.branch,
                                                        value: stockManagehand.branch,
                                                    }}
                                                    onChange={(e) => {
                                                        setStockManagehand({
                                                            ...stockManagehand,
                                                            branch: e.value,
                                                            unit: "Please Select Unit",
                                                            floor: "Please Select Floor",
                                                            area: "Please Select Area",
                                                            location: "Please Select Location",
                                                            assetmaterial: "Please Select AssetMaterial",
                                                            employeenameto: "Please Select Employee",
                                                        });
                                                        setLocations([{ label: "ALL", value: "ALL" }]);
                                                        setAreas([])
                                                        fetchUnits(e);
                                                        fetchFloor(e);

                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>

                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Unit<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    options={units}
                                                    styles={colourStyles}
                                                    value={{
                                                        label: stockManagehand.unit,
                                                        value: stockManagehand.unit,
                                                    }}
                                                    onChange={(e) => {
                                                        setStockManagehand({
                                                            ...stockManagehand,
                                                            unit: e.value,
                                                            workstation: "",
                                                        });
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>

                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Floor<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    options={floors}
                                                    styles={colourStyles}
                                                    value={{
                                                        label: stockManagehand.floor,
                                                        value: stockManagehand.floor,
                                                    }}
                                                    onChange={(e) => {
                                                        setStockManagehand({
                                                            ...stockManagehand,
                                                            floor: e.value,
                                                            workstation: "",
                                                            area: "Please Select Area",
                                                        });
                                                        // setAreas([]);
                                                        setLocations([{ label: "ALL", value: "ALL" }]);
                                                        fetchArea(e.value);
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>

                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Area<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    options={areas}
                                                    styles={colourStyles}
                                                    value={{
                                                        label: stockManagehand.area,
                                                        value: stockManagehand.area,
                                                    }}
                                                    onChange={(e) => {
                                                        setStockManagehand({
                                                            ...stockManagehand,
                                                            area: e.value,
                                                            workstation: "",
                                                            location: "Please Select Location",
                                                        });
                                                        setLocations([{ label: "ALL", value: "ALL" }]);
                                                        fetchLocation(e.value);
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Location<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    options={locations}
                                                    styles={colourStyles}
                                                    value={{
                                                        label: stockManagehand.location,
                                                        value: stockManagehand.location,
                                                    }}
                                                    onChange={(e) => {
                                                        setStockManagehand({
                                                            ...stockManagehand,
                                                            location: e.value,
                                                            workstation: "",
                                                        });
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>


                                    </>
                                )}

                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Qty(Pcs)<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            sx={userStyle.input}
                                            placeholder="Please Enter Quantity"
                                            value={stockManagehand.countquantity}
                                            // onChange={(e) => {
                                            //     // handleOnchangeQty(e)
                                            //     setStockManagehand({
                                            //         ...stockManagehand,
                                            //         countquantity:
                                            //             e.target.value > 0 ? e.target.value : 0,
                                            //     });
                                            // }}
                                            onChange={(e) => handleChangephonenumber(e)}


                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Description<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <TextareaAutosize
                                            aria-label="minimum height"
                                            minRows={5}
                                            value={stockManagehand.description}
                                            onChange={(e) => {
                                                setStockManagehand({
                                                    ...stockManagehand,
                                                    description: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Date<b style={{ color: "red" }}>*</b> </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="date"
                                            value={stockManagehand.usagedate}
                                            onChange={(e) => {
                                                setStockManagehand({
                                                    ...stockManagehand,
                                                    usagedate: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Time <b style={{ color: "red" }}>*</b></Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="time"
                                            value={stockManagehand.usagetime}
                                            onChange={(e) => {
                                                setStockManagehand({
                                                    ...stockManagehand,
                                                    usagetime: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}></Grid>
                            </Grid>


                            <Grid container spacing={1}>
                                <Grid item md={3} xs={12} sm={12}>
                                    <Typography>Photos</Typography>
                                    <Box sx={{ display: "flex", justifyContent: "left" }}>
                                        <Button
                                            variant="contained"
                                            onClick={handleClickUploadPopupOpen}
                                        >
                                            Upload
                                        </Button>
                                    </Box>
                                </Grid>
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    {isWebcamCapture == true && capturedImages?.length > 0 &&
                                        capturedImages?.map((file, index) => (
                                            <Grid
                                                container
                                                key={index}
                                                alignItems="center"
                                                spacing={2}
                                                sx={{
                                                    padding: "8px 0",
                                                    borderBottom: "1px solid #ddd",
                                                }}
                                            >
                                                {/* File Icon */}
                                                <Grid item md={1} sm={2} xs={2}>
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                        }}
                                                    >
                                                        {file.type.includes("image/") ? (
                                                            <img
                                                                src={file.preview}
                                                                alt={file.name}
                                                                height={40}
                                                                style={{
                                                                    maxWidth: "100%",
                                                                }}
                                                            />
                                                        ) : (
                                                            <img
                                                                className={classes.preview}
                                                                src={getFileIcon(file.name)}
                                                                height={40}
                                                                alt="file icon"
                                                            />
                                                        )}
                                                    </Box>
                                                </Grid>

                                                {/* File Name */}
                                                <Grid item md={3} sm={3} xs={3}>
                                                    <Typography
                                                        variant="subtitle2"
                                                        sx={{
                                                            whiteSpace: "nowrap",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                        }}
                                                    >
                                                        {file.name}
                                                    </Typography>
                                                </Grid>

                                                {/* Remarks Input */}
                                                <Grid item md={4} sm={4} xs={4}>
                                                    <TextField
                                                        variant="outlined"
                                                        size="small"
                                                        placeholder="Enter remarks"
                                                        value={file?.remarks || ""}
                                                        onChange={(e) => handleRemarkChangeWebCam(e.target.value, index)}
                                                        fullWidth
                                                    />
                                                </Grid>

                                                {/* View and Delete Icons */}
                                                <Grid
                                                    item
                                                    md={4}
                                                    sm={3}
                                                    xs={3}
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "flex-end",
                                                        gap: 1,
                                                    }}
                                                >
                                                    <Button
                                                        sx={{
                                                            padding: "6px",
                                                            minWidth: "36px",
                                                            borderRadius: "50%",
                                                            ":hover": {
                                                                backgroundColor: "#f0f0f0",
                                                            },
                                                        }}
                                                        onClick={() => renderFilePreview(file)}
                                                    >
                                                        <VisibilityOutlinedIcon
                                                            style={{ fontSize: "18px", color: "#357AE8" }}
                                                        />
                                                    </Button>
                                                    <Button
                                                        sx={{
                                                            padding: "6px",
                                                            minWidth: "36px",
                                                            borderRadius: "50%",
                                                            ":hover": {
                                                                backgroundColor: "#f0f0f0",
                                                            },
                                                        }}
                                                        onClick={() => removeCapturedImage(index)}
                                                    >
                                                        <FaTrash
                                                            style={{ fontSize: "18px", color: "#a73131" }}
                                                        />
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        ))}
                                    {refImage?.length > 0 && refImage?.map((file, index) => (
                                        <Grid
                                            container
                                            key={index}
                                            alignItems="center"
                                            spacing={2}
                                            sx={{
                                                padding: "8px 0",
                                                borderBottom: "1px solid #ddd",
                                            }}
                                        >
                                            {/* File Icon */}
                                            <Grid item md={1} sm={2} xs={2}>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    {file.type.includes("image/") ? (
                                                        <img
                                                            src={file.preview}
                                                            alt={file.name}
                                                            height={40}
                                                            style={{
                                                                maxWidth: "100%",
                                                            }}
                                                        />
                                                    ) : (
                                                        <img
                                                            className={classes.preview}
                                                            src={getFileIcon(file.name)}
                                                            height={40}
                                                            alt="file icon"
                                                        />
                                                    )}
                                                </Box>
                                            </Grid>

                                            {/* File Name */}
                                            <Grid item md={3} sm={3} xs={3}>
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {file.name}
                                                </Typography>
                                            </Grid>

                                            {/* Remarks Input */}
                                            <Grid item md={4} sm={4} xs={4}>
                                                <TextField
                                                    variant="outlined"
                                                    size="small"
                                                    placeholder="Enter remarks"
                                                    value={file?.remarks || ""}
                                                    onChange={(e) => handleRemarkChangeUpload(e.target.value, index)}
                                                    fullWidth
                                                />
                                            </Grid>

                                            {/* View and Delete Icons */}
                                            <Grid
                                                item
                                                md={4}
                                                sm={3}
                                                xs={3}
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "flex-end",
                                                    gap: 1,
                                                }}
                                            >
                                                <Button
                                                    sx={{
                                                        padding: "6px",
                                                        minWidth: "36px",
                                                        borderRadius: "50%",
                                                        ":hover": {
                                                            backgroundColor: "#f0f0f0",
                                                        },
                                                    }}
                                                    onClick={() => renderFilePreview(file)}
                                                >
                                                    <VisibilityOutlinedIcon
                                                        style={{ fontSize: "18px", color: "#357AE8" }}
                                                    />
                                                </Button>
                                                <Button
                                                    sx={{
                                                        padding: "6px",
                                                        minWidth: "36px",
                                                        borderRadius: "50%",
                                                        ":hover": {
                                                            backgroundColor: "#f0f0f0",
                                                        },
                                                    }}
                                                    onClick={() => handleDeleteFile(index)}
                                                >
                                                    <FaTrash
                                                        style={{ fontSize: "18px", color: "#a73131" }}
                                                    />
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    ))}



                                    {refImageDrag?.length > 0 && refImageDrag?.map((file, index) => (
                                        <Grid
                                            container
                                            key={index}
                                            alignItems="center"
                                            spacing={2}
                                            sx={{
                                                padding: "8px 0",
                                                borderBottom: "1px solid #ddd",
                                            }}
                                        >
                                            {/* File Icon */}
                                            <Grid item md={1} sm={2} xs={2}>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    {file.type.includes("image/") ? (
                                                        <img
                                                            src={file.preview}
                                                            alt={file.name}
                                                            height={40}
                                                            style={{
                                                                maxWidth: "100%",
                                                            }}
                                                        />
                                                    ) : (
                                                        <img
                                                            className={classes.preview}
                                                            src={getFileIcon(file.name)}
                                                            height={40}
                                                            alt="file icon"
                                                        />
                                                    )}
                                                </Box>
                                            </Grid>

                                            {/* File Name */}
                                            <Grid item md={3} sm={3} xs={3}>
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {file.name}
                                                </Typography>
                                            </Grid>

                                            {/* Remarks Input */}
                                            <Grid item md={4} sm={4} xs={4}>
                                                <TextField
                                                    variant="outlined"
                                                    size="small"
                                                    placeholder="Enter remarks"
                                                    value={file?.remarks || ""}
                                                    onChange={(e) => handleRemarkChangeDragDrop(e.target.value, index)}
                                                    fullWidth
                                                />
                                            </Grid>

                                            {/* View and Delete Icons */}
                                            <Grid
                                                item
                                                md={4}
                                                sm={3}
                                                xs={3}
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "flex-end",
                                                    gap: 1,
                                                }}
                                            >
                                                <Button
                                                    sx={{
                                                        padding: "6px",
                                                        minWidth: "36px",
                                                        borderRadius: "50%",
                                                        ":hover": {
                                                            backgroundColor: "#f0f0f0",
                                                        },
                                                    }}
                                                    onClick={() => renderFilePreview(file)}
                                                >
                                                    <VisibilityOutlinedIcon
                                                        style={{ fontSize: "18px", color: "#357AE8" }}
                                                    />
                                                </Button>
                                                <Button
                                                    sx={{
                                                        padding: "6px",
                                                        minWidth: "36px",
                                                        borderRadius: "50%",
                                                        ":hover": {
                                                            backgroundColor: "#f0f0f0",
                                                        },
                                                    }}
                                                    onClick={() => handleRemoveFile(index)}
                                                >
                                                    <FaTrash
                                                        style={{ fontSize: "18px", color: "#a73131" }}
                                                    />
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    ))}
                                </Grid>

                            </Grid>


                            <br />
                            <br /> <br />
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button variant="contained"
                                        onClick={handlesubmitstockusaecount}
                                    >
                                        {" "}
                                        Update
                                    </Button>
                                </Grid>
                                <br />
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button sx={userStyle.btncancel} onClick={handleCloseModEditused}>
                                        {" "}
                                        Cancel{" "}
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>

                    <br />
                    <br />

                    {/* {isUserRoleAccess?.role?.includes("Manager")(
            <> */}
                    <Box sx={{ padding: "20px" }}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}



                        <Grid container spacing={2}>
                            <Grid item xs={8} md={8} sm={8}>
                                <Typography sx={userStyle.importheadtext}>
                                    Usage Count List
                                </Typography>
                            </Grid>
                            <Grid item xs={4} md={4} sm={4}>
                                <Box
                                    sx={{ display: "flex", justifyContent: "end", width: "100%" }}
                                >
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleCloseModEditused}
                                    >
                                        {" "}
                                        Back{" "}
                                    </Button>
                                </Box>
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
                                        onChange={handlePageSizeChangeviewusage}
                                        sx={{ width: "77px" }}
                                    >
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        <MenuItem value={(usageCountAlldialog?.length)}>All</MenuItem>
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
                                {/* <Box>
                  {isUserRoleCompare?.includes("excelebservicemaster") && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsPdfFilterOpenviewusage(true);
                          setFormat("xl");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileExcel />
                        &ensp;Export to Excel&ensp;
                      </Button>
                    </>
                  )}

                  {isUserRoleCompare?.includes("csvebservicemaster") && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsPdfFilterOpenviewusage(true);
                          setFormat("csv");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileCsv />
                        &ensp;Export to CSV&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("printebservicemaster") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprintviewusage}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfebservicemaster") && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpenviewusage(true);
                        }}
                      >
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imageebservicemaster") && (
                    <Button
                      sx={userStyle.buttongrp}
                      onClick={handleCaptureImage}
                    >
                      {" "}
                      <ImageIcon
                        sx={{ fontSize: "15px" }}
                      /> &ensp;Image&ensp;{" "}
                    </Button>
                  )}
                </Box> */}
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
                                <AggregatedSearchBar
                                    columnDataTable={columnDataTableviewusage}
                                    setItems={setItemsviewusage}
                                    addSerialNumber={addSerialNumberviewusage}
                                    setPage={setPageviewusage}
                                    maindatas={usageCountAlldialog}
                                    setSearchedString={setSearchedStringviewusage}
                                    searchQuery={searchQueryviewusage}
                                    setSearchQuery={setSearchQueryviewusage}
                                    paginated={false}
                                    totalDatas={usageCountAlldialog}
                                />
                            </Grid>
                        </Grid>
                        <br />
                        <br />

                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsviewusage}>
                            Show All Columns
                        </Button>
                        &ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsviewusage}>
                            Manage Columns
                        </Button>
                        &ensp;
                        {usageCountAllcheck ? (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
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
                            </>
                        ) : (
                            <>
                                <Box style={{ width: "100%", overflowY: "hidden" }}>
                                    <>
                                        <AggridTable
                                            rowDataTable={rowDataTableviewusage}
                                            columnDataTable={columnDataTableviewusage}
                                            columnVisibility={columnVisibilityviewusage}
                                            page={pageviewusage}
                                            setPage={setPageviewusage}
                                            pageSize={pageSizeviewusage}
                                            totalPages={totalPagesviewusage}
                                            setColumnVisibility={setColumnVisibilityviewusage}
                                            isHandleChange={isHandleChange}
                                            items={itemsviewusage}
                                            selectedRows={selectedRowsviewusage}
                                            setSelectedRows={setSelectedRowsviewusage}
                                            gridRefTable={gridRefTableviewusage}
                                            paginated={false}
                                            filteredDatas={filteredDatasviewusage}
                                            searchQuery={setSearchedStringviewusage}
                                            handleShowAllColumns={handleShowAllColumnsviewusage}
                                            setFilteredRowData={setFilteredRowDataviewusage}
                                            filteredRowData={filteredRowDataviewusage}
                                            setFilteredChanges={setFilteredChangesviewusage}
                                            filteredChanges={filteredChangesviewusage}
                                            gridRefTableImg={gridRefTableImgviewusage}
                                            itemsList={usageCountAlldialog}
                                        />
                                    </>
                                </Box>

                            </>
                        )}
                        <Popover
                            id={idviewusage}
                            open={isManageColumnsOpenviewusage}
                            anchorEl={anchorElviewusage}
                            onClose={handleCloseManageColumnsviewusage}
                            anchorOrigin={{ vertical: "bottom", horizontal: "left", }}
                            transformOrigin={{ vertical: 'center', horizontal: 'right', }}
                        >
                            {manageColumnsContentviewusage}
                        </Popover>

                    </Box>

                    {/* </>
          )} */}


                </Dialog>
            </Box>




            {/* UPLOAD IMAGE DIALOG */}
            <Dialog
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
                            <Typography variant="body2" style={{ marginTop: "5px" }}>
                                {/* Max File size: 5MB */}
                            </Typography>
                            <div onDragOver={handleDragOver} onDrop={handleDrop}>
                                {previewURL && refImageDrag.length > 0 ? (
                                    <>
                                        {refImageDrag.map((file, index) => (
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
                                                    onClick={() => handleRemoveFile(index)}
                                                    style={{ marginTop: "0px", color: "red" }}
                                                >
                                                    X
                                                </Button>
                                            </>
                                        ))}
                                    </>
                                ) : (
                                    <div
                                        style={{
                                            marginTop: "10px",
                                            marginLeft: "0px",
                                            border: "1px dashed #ccc",
                                            padding: "0px",
                                            width: "100%",
                                            height: "150px",
                                            display: "flex",
                                            alignContent: "center",
                                            textAlign: "center",
                                        }}
                                    >
                                        <div style={{ display: "flex", margin: "50px auto" }}>
                                            <ContentCopyIcon /> Drag and drop
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Grid>
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
                                            // accept="image/*"
                                            hidden
                                            onChange={handleInputChange}
                                        />
                                    </Button>
                                    &ensp;
                                    <Button
                                        variant="contained"
                                        onClick={showWebcam}
                                        sx={userStyle.uploadbtn}
                                    >
                                        Webcam
                                    </Button>
                                </Grid>
                            </FormControl>
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            {isWebcamCapture == true &&
                                capturedImages.map((image, index) => (
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
                                            md={7}
                                            sm={7}
                                            xs={12}
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
                                                    onClick={() => renderFilePreview(image)}
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
                                                    onClick={() => removeCapturedImage(index)}
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
            </Dialog>

            {/* webcam alert start */}
            <Dialog
                open={isWebcamOpen}
                onClose={webcamClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="sm"
                fullWidth={true}
            >
                <DialogContent
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        textAlign: "center",
                        alignItems: "center",
                    }}
                >
                    <Webcamimage
                        name={name}
                        getImg={getImg}
                        setGetImg={setGetImg}
                        valNum={valNum}
                        setValNum={setValNum}
                        capturedImages={capturedImages}
                        setCapturedImages={setCapturedImages}
                        setRefImage={setRefImage}
                        setRefImageDrag={setRefImageDrag}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="success" onClick={webcamDataStore}>
                        OK
                    </Button>
                    <Button variant="contained" color="error" onClick={webcamClose}>
                        CANCEL
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={isimgviewbill}
                onClose={handlecloseImgcodeviewbill}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="md"
                fullWidth
            >
                <DialogContent>
                    <Typography variant="h6">Images</Typography>
                    {getimgbillcode.map((imagefilebill, index) => (
                        <Grid container key={index}>
                            <Grid item md={6} sm={10} xs={10}>
                                <img
                                    src={imagefilebill.preview}
                                    style={{
                                        maxWidth: "70px",
                                        maxHeight: "70px",
                                        marginTop: "10px",
                                    }}
                                />
                            </Grid>

                            <Grid
                                item
                                md={4}
                                sm={10}
                                xs={10}
                                sx={{ display: "flex", alignItems: "center" }}
                            >
                                <Typography>{imagefilebill.name}</Typography>
                            </Grid>
                            <Grid item md={2} sm={2} xs={2}>
                                <Button
                                    sx={{
                                        padding: "14px 14px",
                                        minWidth: "40px !important",
                                        borderRadius: "50% !important",
                                        ":hover": {
                                            backgroundColor: "#80808036", // theme.palette.primary.main
                                        },
                                    }}
                                    onClick={() => renderFilePreview(imagefilebill)}
                                >
                                    <VisibilityOutlinedIcon
                                        style={{
                                            fontsize: "12px",
                                            color: "#357AE8",
                                            marginTop: "35px !important",
                                        }}
                                    />
                                </Button>
                            </Grid>
                        </Grid>
                    ))}
                </DialogContent>

                <DialogActions>
                    <Button onClick={handlecloseImgcodeviewbill} sx={userStyle.btncancel}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>



            {/* list image */}

            <Dialog
                open={isimgviewbilllist}
                onClose={handlecloseImgcodeviewbilllist}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="md"
                fullWidth
            >
                <DialogContent>
                    <Typography variant="h6">Images</Typography>
                    <Grid container >
                        <Grid item md={3} sm={10} xs={10}>  <Typography variant="h6">File</Typography>    </Grid>
                        <Grid
                            item
                            md={4}
                            sm={10}
                            xs={10}
                            sx={{ display: "flex", alignItems: "center" }}
                        > <Typography variant="h6">File Name</Typography>    </Grid>
                        <Grid
                            item
                            md={4}
                            sm={10}
                            xs={10}
                            sx={{ display: "flex", alignItems: "center" }}
                        > <Typography variant="h6">Remarks</Typography>    </Grid>
                    </Grid>
                    {getimgbillcodelist.map((imagefilebill, index) => (
                        <Grid container key={index}>
                            <Grid item md={3} sm={10} xs={10}>


                                {imagefilebill.type.includes("image/") ? (
                                    <img
                                        src={imagefilebill.preview}
                                        alt={imagefilebill.name}
                                        height={40}
                                        style={{
                                            maxWidth: "70px",
                                            maxHeight: "70px",
                                            marginTop: "10px",
                                        }}
                                    />
                                ) : (
                                    <img
                                        className={classes.preview}
                                        src={getFileIcon(imagefilebill.name)}
                                        height={40}
                                        alt="file icon"
                                    />
                                )}
                            </Grid>


                            <Grid
                                item
                                md={4}
                                sm={10}
                                xs={10}
                                sx={{ display: "flex", alignItems: "center" }}
                            >
                                <Typography>{imagefilebill.name}</Typography>
                            </Grid>
                            <Grid
                                item
                                md={4}
                                sm={10}
                                xs={10}
                                sx={{ display: "flex", alignItems: "center" }}
                            >
                                <Typography>{imagefilebill.remarks}</Typography>
                            </Grid>
                            <Grid item md={1} sm={1} xs={1}>
                                <Button
                                    sx={{
                                        padding: "14px 14px",
                                        minWidth: "40px !important",
                                        borderRadius: "50% !important",
                                        ":hover": {
                                            backgroundColor: "#80808036", // theme.palette.primary.main
                                        },
                                    }}
                                    onClick={() => renderFilePreviewlist(imagefilebill)}
                                >
                                    <VisibilityOutlinedIcon
                                        style={{
                                            fontsize: "12px",
                                            color: "#357AE8",
                                            marginTop: "35px !important",
                                        }}
                                    />
                                </Button>
                            </Grid>
                        </Grid>
                    ))}
                </DialogContent>

                <DialogActions>
                    <Button onClick={handlecloseImgcodeviewbilllist} sx={userStyle.btncancel}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>


            {/* view asset */}

            <Dialog
                open={openViewasset}
                onClose={handleViewOpenAsset}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth={true}
                maxWidth="lg"
                sx={{ marginTop: "95px" }}
            >
                <Box sx={{ padding: "20px" }}>
                    {/* ******************************************************EXPORT Buttons****************************************************** */}
                    <Grid container spacing={2}>
                        <Grid item xs={8} md={8} sm={8}>
                            <Typography sx={userStyle.importheadtext}>
                                View Return Material Log
                            </Typography>
                        </Grid>
                        <Grid item xs={4} md={4} sm={4}>
                            <Box
                                sx={{ display: "flex", justifyContent: "end", width: "100%" }}
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handlViewCloseAsset}
                                >
                                    {" "}
                                    Back{" "}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                    <br />
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
                                onChange={handlePageSizeChangeviewasset}
                                sx={{ width: "77px" }}
                            >
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={25}>25</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                                <MenuItem value={100}>100</MenuItem>
                                <MenuItem value={assetlog?.length}>All</MenuItem>
                            </Select>
                        </Box>
                        <Box>
                            {/* <FormControl fullWidth size="small">
                <Typography>Search</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={searchQueryViewasset}
                  onChange={handleSearchChangeviewasset}
                />
              </FormControl> */}
                            <AggregatedSearchBar
                                columnDataTable={columnDataTableviewasset}
                                setItems={setItemsViewasset}
                                addSerialNumber={addSerialNumberViewasset}
                                setPage={setPageViewasset}
                                maindatas={assetlog}
                                setSearchedString={setSearchedStringviewasset}
                                searchQuery={searchQueryViewasset}
                                setSearchQuery={setSearchQueryViewasset}
                                paginated={false}
                                totalDatas={assetlog}
                            />
                        </Box>
                    </Grid>
                    <br />
                    <br />
                    <Button
                        sx={userStyle.buttongrp}
                        onClick={() => {
                            handleShowAllColumnsViewasset();
                            setColumnVisibilityViewasset(initialColumnVisibilityViewasset);
                        }}
                    >
                        Show All Columns
                    </Button>
                    &emsp;
                    <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsViewasset}>
                        Manage Columns
                    </Button>
                    &emsp;
                    {/* Manage Column */}
                    <Popover
                        id={idViewasset}
                        open={isManageColumnsOpenviewasset}
                        anchorEl={anchorElViewasset}
                        onClose={handleCloseManageColumnsViewasset}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                        }}
                    >
                        {manageColumnsContentviewasset}
                    </Popover>
                    <br />
                    <br />
                    <>
                        <AggridTable
                            rowDataTable={rowDataTableViewasset}
                            columnDataTable={columnDataTableviewasset}
                            columnVisibility={columnVisibilityViewasset}
                            page={pageViewasset}
                            setPage={setPageViewasset}
                            pageSize={pageSizeviewasset}
                            totalPages={totalPagesViewasset}
                            setColumnVisibility={setColumnVisibilityViewasset}
                            isHandleChange={isHandleChange}
                            items={itemsViewasset}
                            selectedRows={selectedRowsViewasset}
                            setSelectedRows={setSelectedRowsViewasset}
                            gridRefTable={gridRefTableviewasset}
                            paginated={false}
                            filteredDatas={filteredDatasViewasset}
                            // totalDatas={totalDatas}
                            searchQuery={searchedStringviewasset}
                            handleShowAllColumns={handleShowAllColumnsViewasset}
                            setFilteredRowData={setFilteredRowDataviewasset}
                            filteredRowData={filteredRowDataviewasset}
                            setFilteredChanges={setFilteredChangesviewasset}
                            filteredChanges={filteredChangesviewasset}
                            gridRefTableImg={gridRefTableImgviewasset}
                            itemsList={assetlog}
                        />

                        <br />
                    </>
                </Box>
            </Dialog>


            <Dialog
                open={openView}
                onClose={handleViewOpen}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth={true}
                maxWidth="lg"
                sx={{ marginTop: "95px" }}
            >
                <Box sx={{ padding: "20px" }}>
                    {/* ******************************************************EXPORT Buttons****************************************************** */}
                    <Grid container spacing={2}>
                        <Grid item xs={8} md={8} sm={8}>
                            <Typography sx={userStyle.importheadtext}>
                                View Stock Material Log
                            </Typography>
                        </Grid>
                        <Grid item xs={4} md={4} sm={4}>
                            <Box
                                sx={{ display: "flex", justifyContent: "end", width: "100%" }}
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handlViewClose}
                                >
                                    {" "}
                                    Back{" "}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                    <br />

                    <Grid container spacing={2} style={userStyle.dataTablestyle}>
                        <Grid item md={2} xs={12} sm={12}>
                            <Box>
                                <label>Show entries:</label>
                                <Select
                                    id="pageSizeSelect"
                                    value={pageSizeview}
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 180,
                                                width: 80,
                                            },
                                        },
                                    }}
                                    onChange={handlePageSizeChangeview}
                                    sx={{ width: "77px" }}
                                >
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={25}>25</MenuItem>
                                    <MenuItem value={50}>50</MenuItem>
                                    <MenuItem value={100}>100</MenuItem>
                                    <MenuItem value={stocklog?.length}>All</MenuItem>
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
                        ></Grid>
                        <Grid item md={2} xs={6} sm={6}>
                            <Box>
                                {/* <FormControl fullWidth size="small">
                  <Typography>Search</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={searchQueryView}
                    onChange={handleSearchChangeview}
                  />
                </FormControl> */}
                                <AggregatedSearchBar
                                    columnDataTable={columnDataTableview}
                                    setItems={setItemsView}
                                    addSerialNumber={addSerialNumberView}
                                    setPage={setPageView}
                                    maindatas={stocklog}
                                    setSearchedString={setSearchedStringview}
                                    searchQuery={searchQueryView}
                                    setSearchQuery={setSearchQueryView}
                                    paginated={false}
                                    totalDatas={stocklog}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                    <br />
                    <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsView}>
                        Show All Columns
                    </Button>
                    &ensp;
                    <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsView}>
                        Manage Columns
                    </Button>
                    {/* Manage Column */}
                    <Popover
                        id={idView}
                        open={isManageColumnsOpenview}
                        anchorEl={anchorElView}
                        onClose={handleCloseManageColumnsview}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                        }}
                    >
                        {manageColumnsContentview}
                    </Popover>

                    <br />
                    <br />

                    <>
                        <AggridTable
                            rowDataTable={rowDataTableView}
                            columnDataTable={columnDataTableview}
                            columnVisibility={columnVisibilityView}
                            page={pageView}
                            setPage={setPageView}
                            pageSize={pageSizeview}
                            totalPages={totalPagesView}
                            setColumnVisibility={setColumnVisibilityView}
                            // isHandleChange={isHandleChange}
                            items={itemsView}
                            selectedRows={selectedRowsView}
                            setSelectedRows={setSelectedRowsView}
                            gridRefTable={gridRefTableviewstock}
                            paginated={false}
                            filteredDatas={filteredDatasView}
                            // totalDatas={totalDatas}
                            searchQuery={searchedStringview}
                            handleShowAllColumns={handleShowAllColumnsView}
                            setFilteredRowData={setFilteredRowDataview}
                            filteredRowData={filteredRowDataview}
                            setFilteredChanges={setFilteredChangesview}
                            filteredChanges={filteredChangesview}
                            itemsList={stocklog}
                        />

                        <br />
                    </>
                </Box>
            </Dialog>

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
                itemsTwo={usageCountAll ?? []}
                filename={"Approve List"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
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

        </Box>
    );
}

export default StockManagementNotification;