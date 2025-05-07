import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import { Box, Typography, OutlinedInput, TableBody, FormGroup, FormControlLabel, InputAdornment, TableRow, TableCell, Select, Paper, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton, TextareaAutosize } from "@mui/material";
import { userStyle, colourStyles } from "../../pageStyle";
import { handleApiError } from "../../components/Errorhandling";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { makeStyles } from "@material-ui/core";
import Selects from "react-select";
import StyledDataGrid from "../../components/TableStyle";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import Resizable from "react-resizable";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { MultiSelect } from "react-multi-select-component";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaSearch } from "react-icons/fa";
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
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import domtoimage from 'dom-to-image';



function AssetMaterialIP() {
    const [isHandleChange, setIsHandleChange] = useState(false);
    const [searchedString, setSearchedString] = useState("");
    const gridRefTable = useRef(null);
    const gridRefTableNear = useRef(null);
    const gridRefTableImg = useRef(null);
    const gridRefTableImgNear = useRef(null);
    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        setOpenPopupMalert(true);
        setloadingdeloverall(false);
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

    let exportColumnNames = [
        'Company',
        'Branch',
        'Unit',
        'Floor',
        'Area',
        'Location',
        'Material',
        'Asset Material',
        'IP',
        'ebusage',
        'Employee Distribution',
        'Maintenance'
    ];
    let exportRowValues = [
        'company', 'branch',
        'unit', 'floor',
        'area', 'location',
        'assetmaterial', 'component',
        'ip', 'ebusage',
        'empdistribution', 'maintenance'
    ];


    let exportColumnNamesNear = [
        'Company',
        'Branch',
        'Unit',
        'Floor',
        'Area',
        'Location',
        'Material',
        'Asset Material',
        'IP',
        'ebusage',
        'Employee Distribution',
        'Maintenance'
    ];
    let exportRowValuesNear = [
        'company', 'branch',
        'unit', 'floor',
        'area', 'location',
        'assetmaterial', 'component',
        'ip', 'ebusage',
        'empdistribution', 'maintenance'
    ];


    const [loadingdeloverall, setloadingdeloverall] = useState(false);
    const gridRef = useRef(null);
    const gridRefNeartat = useRef(null);

    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowsNear, setSelectedRowsNear] = useState([]);
    const [itemsneartat, setItemsNearTat] = useState([]);

    const [searchQueryManage, setSearchQueryManage] = useState("");

    const [assetdetails, setAssetdetails] = useState([]);

    const [newcheckbranch, setNewcheckBranch] = useState("Choose Branch");
    const [floors, setFloors] = useState([]);

    const [areas, setAreas] = useState([]);
    const [locations, setLocations] = useState([{ label: "ALL", value: "ALL" }]);

    const [individualasset, setIndividualAsset] = useState([])
    const [uniqueid, setUniqueid] = useState(0)
    const [idgrpedit, setidgrpedit] = useState([]);
    const [isDeleteOpenNear, setIsDeleteOpenNear] = useState(false);

    const [materialOpt, setMaterialopt] = useState([]);

    const fetchAssetDetails = async () => {
        try {
            let res_vendor = await axios.get(SERVICE.ASSETDETAIL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAssetdetails(res_vendor?.data?.assetdetails);
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    const fetchMaterialAll = async () => {
        try {
            let res = await axios.get(SERVICE.ASSETS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const resultall = res.data.assetmaterial.map((d) => ({
                ...d,
                label: d.name,
                value: d.name,
                assettype: d.assettype,
                asset: d.assethead,
            }));

            const assetmaterialuniqueArray = resultall.filter((item, index, self) => {
                return (
                    self.findIndex(
                        (i) => i.label === item.label && i.value === item.value
                    ) === index
                );
            });
            setMaterialopt(assetmaterialuniqueArray);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    useEffect(() => {
        fetchMaterialAll();
        fetchAssetDetails();
    }, [])




    const getRowClassNameNearTat = (params) => {
        if (selectedRows.includes(params.data.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };


    const handleCaptureImagenear = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "AssetIP_Individual.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    const handleSelectionChangeNear = (newSelection) => {
        setSelectedRowsNear(newSelection.selectionModel);
    };

    //component multiselect
    const [selectedOptionsComponent, setSelectedOptionsComponent] = useState([]);
    let [valueComponentCat, setValueComponentCat] = useState([]);
    const [
        selectedComponentOptionsCateEdit,
        setSelectedComponentOptionsCateEdit,
    ] = useState([]);
    const [ComponentValueCateEdit, setComponentValueCateEdit] = useState([]);

    const handleComponentChange = (options) => {
        setValueComponentCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsComponent(options);
    };

    const customValueRendererComponent = (valueComponentCat, _categoryname) => {
        return valueComponentCat?.length
            ? valueComponentCat.map(({ label }) => label)?.join(", ")
            : "Please Select Asset Material";
    };

    const handleComponentChangeEdit = (options) => {
        setComponentValueCateEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedComponentOptionsCateEdit(options);
    };
    const customValueRendererComponentEdit = (
        componentValueCateEdit,
        _employeename
    ) => {
        return componentValueCateEdit?.length
            ? componentValueCateEdit.map(({ label }) => label)?.join(", ")
            : "Please Select Asset Material";
    };

    const [areasEdit, setAreasEdit] = useState([]);
    const [locationsEdit, setLocationsEdit] = useState([
        { label: "ALL", value: "ALL" },
    ]);

    const [floorsEdit, setFloorEdit] = useState([]);

    //  Datefield
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;

    const [maintentancemaster, setMaintentancemaster] = useState({
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        floor: "Please Select Floor",
        area: "Please Select Area",
        location: "Please Select Location",
        assetmaterial: "Please Select Material",
        assetmaterialcheck: "",
        ip: true,
        ebusage: true,
        empdistribution: true,
        maintenance: true,
        addedby: "",
        updatedby: "",
    });

    const [maintentance, setMaintentance] = useState([]);

    const [maintentancemasteredit, setMaintentancemasteredit] = useState({
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        floor: "Please Select Floor",
        area: "Please Select Area",
        location: "Please Select Location",
        assetmaterial: "Please Select Material",
        assetmaterialcheck: "",
        ip: true,
        ebusage: true,
        empdistribution: true,
        maintenance: true
    });
    const [selectedOptionsMaterial, setSelectedOptionsMaterial] = useState([])

    const [selectedOptionsMaterialEdit, setSelectedOptionsMaterialEdit] = useState([])

    const handleMaterialChangeEdit = (options) => {

        setSelectedOptionsMaterialEdit(options);
    };

    const customValueRendererBranchEdit = (valueMaterialCatEdit, _categorynameEdit) => {
        return valueMaterialCatEdit?.length
            ? valueMaterialCatEdit.map(({ label }) => label)?.join(", ")
            : "Please Select SubComponents";
    };

    const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, pageName, setPageName, allfloor, allareagrouping, alllocationgrouping, allTeam, allCompany, allBranch, buttonStyles } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [projectCheck, setProjectCheck] = useState(false);

    // const accessbranch = isAssignBranch
    //     ?.map((data) => ({
    //         branch: data.branch,
    //         company: data.company,
    //         unit: data.unit,
    //     }))

    const accessbranch = isAssignBranch
        ?.filter((data) => {
            let fetfinalurl = [];
            // Check if user is a Manager, in which case return all branches
            if (isUserRoleAccess?.role?.includes("Manager")) {
                return true; // Skip filtering, return all data for Manager
            }
            if (
                data?.modulenameurl?.length !== 0 &&
                data?.submodulenameurl?.length !== 0 &&
                data?.mainpagenameurl?.length !== 0 &&
                data?.subpagenameurl?.length !== 0 &&
                data?.subsubpagenameurl?.length !== 0
            ) {
                fetfinalurl = data.subsubpagenameurl;
            } else if (
                data?.modulenameurl?.length !== 0 &&
                data?.submodulenameurl?.length !== 0 &&
                data?.mainpagenameurl?.length !== 0 &&
                data?.subpagenameurl?.length !== 0
            ) {
                fetfinalurl = data.subpagenameurl;
            } else if (
                data?.modulenameurl?.length !== 0 &&
                data?.submodulenameurl?.length !== 0 &&
                data?.mainpagenameurl?.length !== 0
            ) {
                fetfinalurl = data.mainpagenameurl;
            } else if (
                data?.modulenameurl?.length !== 0 &&
                data?.submodulenameurl?.length !== 0
            ) {
                fetfinalurl = data.submodulenameurl;
            } else if (data?.modulenameurl?.length !== 0) {
                fetfinalurl = data.modulenameurl;
            } else {
                fetfinalurl = [];
            }

            // Check if the pathname exists in the URL
            return fetfinalurl?.includes(window.location.pathname);
        })
        ?.map((data) => ({
            branch: data.branch,
            company: data.company,
            unit: data.unit,
        }));

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [pageNearTatPrimary, setPageNearTatPrimary] = useState(1);
    const [pageSizeNearTatPrimary, setPageSizeNearTatPrimary] = useState(10);


    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();

    const [openview, setOpenview] = useState(false);
    const [openInfo, setOpeninfo] = useState(false);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteproject, setDeleteproject] = useState({});
    const [isEditOpen, setIsEditOpen] = useState(false);

    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [allProjectedit, setAllProjectedit] = useState([]);
    const [copiedData, setCopiedData] = useState("");



    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "AssetIP_Group.png");
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
        setloadingdeloverall(false)
    };

    // view model
    const handleClickOpenview = () => {
        setOpenview(true);
    };

    const handleCloseview = () => {
        setOpenview(false);
    };

    // info model
    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };

    const handleCloseinfo = () => {
        setOpeninfo(false);
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
        if (selectedRowsNear.length == 0) {
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

    const [searchQueryManageNeartat, setSearchQueryManageNeartat] = useState("");
    // Manage Columns
    const [isManageColumnsOpenNeartat, setManageColumnsOpenNeartat] = useState(false);
    const [anchorElNeartat, setAnchorElNeartat] = useState(null)
    const handleOpenManageColumnsNeartat = (event) => {
        setAnchorElNeartat(event.currentTarget);
        setManageColumnsOpenNeartat(true);
    };
    const handleCloseManageColumnsNeartat = () => {
        setManageColumnsOpenNeartat(false);
        setSearchQueryManageNeartat("")
    };

    const openneartat = Boolean(anchorElNeartat);
    const idneartat = openneartat ? 'simple-popover' : undefined;

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
        branch: true,
        unit: true,
        floor: true,
        area: true,
        location: true,
        assetmaterial: true,
        ip: true,
        ebusage: true,
        empdistribution: true,
        maintenance: true,
        subcomponents: true,
        subcomponentsstring: true,
        component: true,
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);



    const initialColumnVisibilityNeartat = {
        serialNumber: true,
        checkbox: true,
        company: true,
        branch: true,
        unit: true,
        floor: true,
        area: true,
        location: true,
        assetmaterial: true,
        subcomponents: true,
        subcomponentsstring: true,
        ip: true,
        ebusage: true,
        empdistribution: true,
        maintenance: true,
        component: true,
        actions: true,
    };

    const [columnVisibilityNeartat, setColumnVisibilityNeartat] = useState(initialColumnVisibilityNeartat);


    //Delete model
    const handleClickOpenNear = () => {
        setIsDeleteOpenNear(true);
    };
    const handleCloseModNear = () => {
        setIsDeleteOpenNear(false);
    };

    //set function to get particular row
    const rowData = async (id, idgrp) => {
        setPageName(!pageName)

        try {
            let res = await axios.get(`${SERVICE.ASSETMATERIALIP_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDeleteproject(res?.data?.sassetmaterialip);
            setidgrpedit(idgrp)
            handleClickOpen();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    //set function to get particular row
    const rowDataNear = async (id, name) => {
        setPageName(!pageName)

        try {
            let res = await axios.get(`${SERVICE.ASSETMATERIALIP_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDeleteproject(res?.data?.sassetmaterialip);
            handleClickOpenNear();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    // Alert delete popup
    let projectid = deleteproject._id;
    const delProject = async () => {
        setPageName(!pageName)

        try {
            const deletePromises = idgrpedit?.map((item) => {
                return axios.delete(`${SERVICE.ASSETMATERIALIP_SINGLE}/${item}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
            });

            await Promise.all(deletePromises);
            // await fetchMaintentance();
            await fetchMaintentanceIndividualdel();
            await fetchMaintentanceIndividual();
            await fetchMaintentanceIndividualSingle();


            handleCloseMod();
            setSelectedRows([]);
            setPage(1);
            // setShowAlert(
            //     <>
            //         <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7ac767" }} />
            //         <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Deleted Successfully 👍"}</p>
            //     </>
            // );
            // handleClickOpenerr();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const delProjectNear = async () => {
        setPageName(!pageName)

        try {
            await axios.delete(`${SERVICE.ASSETMATERIALIP_SINGLE}/${projectid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            await fetchMaintentanceIndividualdel();
            await fetchMaintentanceIndividualSingle();
            handleCloseModNear();
            setSelectedRowsNear([]);
            setPageNearTatPrimary(1);
            // setShowAlert(
            //     <>
            //         <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7ac767" }} />
            //         <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Deleted Successfully 👍"}</p>
            //     </>
            // );
            // handleClickOpenerr();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };



    const delProjectcheckbox = async () => {
        setPageName(!pageName)

        try {
            const deletePromises = selectedRowsNear?.map((item) => {
                return axios.delete(`${SERVICE.ASSETMATERIALIP_SINGLE}/${item}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
            });

            // Wait for all delete requests to complete
            await Promise.all(deletePromises);
            await fetchMaintentanceIndividualdel();
            await fetchMaintentanceIndividualSingle();
            await fetchMaintentanceIndividual();

            handleCloseModcheckbox();
            setSelectedRowsNear([]);
            setSelectAllCheckedNear(false);
            setPage(1);
            // setShowAlert(
            //     <>
            //         <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7ac767" }} />
            //         <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Deleted Successfully 👍"}</p>
            //     </>
            // );
            // handleClickOpenerr();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    //add function
    const sendRequest = async () => {
        setPageName(!pageName)

        let subarray = selectedOptionsMaterial.map((item) => item.value);
        let uniqueval = uniqueid ? uniqueid + 1 : 1

        try {

            axios.post(`${SERVICE.ASSETMATERIALIP_CREATE}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company: String(maintentancemaster.company),
                branch: String(maintentancemaster.branch),
                unit: String(maintentancemaster.unit),
                floor: String(maintentancemaster.floor),
                location: String(maintentancemaster.location),
                area: String(maintentancemaster.area),
                ip: Boolean(maintentancemaster.ip),
                ebusage: Boolean(maintentancemaster.ebusage),
                empdistribution: Boolean(maintentancemaster.empdistribution),
                maintenance: Boolean(maintentancemaster.maintenance),
                subcomponents: subarray,
                component: [...valueComponentCat],
                assetmaterial: maintentancemaster.assetmaterial,
                assetmaterialcheck: maintentancemaster.assetmaterialcheck,
                uniqueid: uniqueval,
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });

            await fetchMaintentanceIndividual();
            await fetchMaintentanceIndividualSingle();
            await fetchMaintentanceIndividualdel();
            setMaintentancemaster({
                ...maintentancemaster,

                ip: true,
                ebusage: true,
                empdistribution: true,
            });
            // setShowAlert(
            //     <>
            //         <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7ac767" }} />
            //         <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Added Successfully 👍"}</p>
            //     </>
            // );
            // handleClickOpenerr();
            setPopupContentMalert("Added Successfully!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    //submit option for saving
    const handleSubmit = async (e) => {
        setPageName(!pageName)

        setloadingdeloverall(true)
        e.preventDefault();
        let res_project = await axios.get(SERVICE.ASSETMATERIALIP, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
        });
        const isNameMatch = res_project?.data?.assetmaterialip.some(
            item =>
                item.company === maintentancemaster.company &&
                item.branch === maintentancemaster.branch &&
                item.unit === maintentancemaster.unit &&
                item.floor === maintentancemaster.floor &&
                item.area === maintentancemaster.area &&
                item.location === maintentancemaster.location &&
                item.assetmaterial === maintentancemaster.assetmaterial &&
                item.component.some((item) =>
                    selectedOptionsComponent.map((item) => item.value).includes(item)
                )
        );

        if (maintentancemaster.company === "Please Select Company") {
            // setShowAlert(
            //     <>
            //         <ErrorOutlineOutlinedIcon
            //             sx={{ fontSize: "100px", color: "orange" }}
            //         />
            //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
            //             {"Please Select Company"}
            //         </p>
            //     </>
            // );
            // handleClickOpenerr();
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (maintentancemaster.branch === "Please Select Branch") {
            // setShowAlert(
            //     <>
            //         <ErrorOutlineOutlinedIcon
            //             sx={{ fontSize: "100px", color: "orange" }}
            //         />
            //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
            //             {"Please Select Branch"}
            //         </p>
            //     </>
            // );
            // handleClickOpenerr();
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (maintentancemaster.unit === "Please Select Unit") {
            // setShowAlert(
            //     <>
            //         <ErrorOutlineOutlinedIcon
            //             sx={{ fontSize: "100px", color: "orange" }}
            //         />
            //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
            //             {"Please Select Unit"}
            //         </p>{" "}
            //     </>
            // );
            // handleClickOpenerr();
            setPopupContentMalert("Please Select Unit!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (maintentancemaster.floor === "Please Select Floor") {
            // setShowAlert(
            //     <>
            //         <ErrorOutlineOutlinedIcon
            //             sx={{ fontSize: "100px", color: "orange" }}
            //         />
            //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
            //             {"Please Select Floor"}
            //         </p>
            //     </>
            // );
            // handleClickOpenerr();
            setPopupContentMalert("Please Select Floor!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (maintentancemaster.area === "Please Select Area") {
            // setShowAlert(
            //     <>
            //         <ErrorOutlineOutlinedIcon
            //             sx={{ fontSize: "100px", color: "orange" }}
            //         />
            //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
            //             {"Please Select Area"}
            //         </p>
            //     </>
            // );
            // handleClickOpenerr();
            setPopupContentMalert("Please Select Area!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (maintentancemaster.location === "Please Select Location") {
            // setShowAlert(
            //     <>
            //         <ErrorOutlineOutlinedIcon
            //             sx={{ fontSize: "100px", color: "orange" }}
            //         />
            //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
            //             {"Please Select Location"}
            //         </p>
            //     </>
            // );
            // handleClickOpenerr();
            setPopupContentMalert("Please Select Location!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (maintentancemaster.assetmaterial === "Please Select Material") {
            // setShowAlert(
            //     <>
            //         <ErrorOutlineOutlinedIcon
            //             sx={{ fontSize: "100px", color: "orange" }}
            //         />
            //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
            //             {"Please Select Material"}
            //         </p>
            //     </>
            // );
            // handleClickOpenerr();
            setPopupContentMalert("Please Select Material!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (valueComponentCat?.length === 0) {
            // setShowAlert(
            //     <>
            //         <ErrorOutlineOutlinedIcon
            //             sx={{ fontSize: "100px", color: "orange" }}
            //         />
            //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
            //             {"Please Select Asset Material"}
            //         </p>
            //     </>
            // );
            // handleClickOpenerr();
            setPopupContentMalert("Please Select Asset Material!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            // setShowAlert(
            //     <>
            //         <ErrorOutlineOutlinedIcon
            //             sx={{ fontSize: "100px", color: "orange" }}
            //         />
            //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
            //             {"Data Already Exist!"}
            //         </p>
            //     </>
            // );
            // handleClickOpenerr();
            setPopupContentMalert("Data Already Exist!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (objectsWithMissingName?.length > 0 && selectedOptionsMaterial?.length === 0) {
            // setShowAlert(
            //     <>
            //         <ErrorOutlineOutlinedIcon
            //             sx={{ fontSize: "100px", color: "orange" }}
            //         />
            //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
            //             {"Please Select Subcomponents"}
            //         </p>
            //     </>
            // );
            // handleClickOpenerr();
            setPopupContentMalert("Please Select Subcomponents!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }


        else {
            sendRequest();
        }
    };

    const handleclear = (e) => {
        e.preventDefault();

        setMaintentancemaster({
            company: "Please Select Company",
            branch: "Please Select Branch",
            unit: "Please Select Unit",
            floor: "Please Select Floor",
            area: "Please Select Area",
            location: "Please Select Location",
            assetmaterial: "Please Select Material",
            ip: true,
            empdistribution: true,
            ebusage: true,

        });
        setFloors([]);
        setAreas([]);
        setSelectedOptionsMaterial([])
        setSelectedOptionsComponent([]);
        setLocations([{ label: "ALL", value: "ALL" }]);
        // setShowAlert(
        //     <>
        //         <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
        //         <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Cleared Successfully"}</p>
        //     </>
        // );
        // handleClickOpenerr();
        setPopupContentMalert("Cleared Successfully!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
    };

    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
        setMaintentancemasteredit({
            branch: "",
            equipment: "",
            maintenancedetails: "",
            maintenancefrequency: "",
            maintenancedate: today,
            maintenancetime: "",
            resdepartment: "Please Select Department",
            resteam: "",
            resperson: "",
            fromdate: "",
            todate: "",
            vendor: "Please Select Vendor",
            address: "",
            phone: "",
            email: "",
        });
    };

    const [isEditOpenNear, setIsEditOpenNear] = useState(false);
    useEffect(() => {
        fetchAssetDetails();
    }, [isEditOpenNear]);

    //Edit model...
    const handleClickOpenEditNear = () => {
        setIsEditOpenNear(true);
    };
    const handleCloseModEditNear = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpenNear(false);
    };


    //get single row to edit....
    const getCodeNear = async (e) => {
        setPageName(!pageName)

        try {
            let res = await axios.get(`${SERVICE.ASSETMATERIALIP_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setMaintentancemasteredit(res?.data?.sassetmaterialip);

            fetchFloor(res?.data?.sassetmaterialip);

            fetchAreaEdit(
                res?.data?.sassetmaterialip?.branch,
                res?.data?.sassetmaterialip?.floor
            );
            fetchAllLocationEdit(
                res?.data?.sassetmaterialip?.branch,
                res?.data?.sassetmaterialip?.floor,
                res?.data?.sassetmaterialip?.area
            );
            fetchAssetDetails();
            setSelectedOptionsMaterialEdit(
                res?.data?.sassetmaterialip.subcomponents.map((item) => ({
                    ...item,
                    label: item,
                    value: item,
                }))
            );
            setComponentValueCateEdit(
                res?.data?.sassetmaterialip?.component
            );
            setSelectedComponentOptionsCateEdit([
                ...res?.data?.sassetmaterialip?.component.map((t) => ({
                    label: t,
                    value: t,
                })),
            ]);
            handleClickOpenEditNear();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    // get single row to view....
    const getviewCode = async (company, branch, unit, floor, area, location, assetmaterial, component, ip, ebusage, empdistribution, maintenance) => {
        try {

            setMaintentancemasteredit({
                ...maintentancemasteredit, company: company,
                branch: branch, unit: unit, floor: floor,
                area: area, location: location, assetmaterial: assetmaterial,
                component: component, ip: ip, ebusage: ebusage,
                empdistribution: empdistribution, maintenance: maintenance


            });
            handleClickOpenview();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    const [openviewnear, setOpenviewnear] = useState(false);

    // view model
    const handleClickOpenviewnear = () => {
        setOpenviewnear(true);
    };

    const handleCloseviewnear = () => {
        setOpenviewnear(false);
    };


    const getviewCodeNear = async (company, branch, unit, floor, area, location, assetmaterial, component, ip, ebusage, empdistribution, maintenance) => {
        try {

            setMaintentancemasteredit({
                ...maintentancemasteredit, company: company,
                branch: branch, unit: unit, floor: floor,
                area: area, location: location, assetmaterial: assetmaterial,
                component: component, ip: ip, ebusage: ebusage,
                empdistribution: empdistribution, maintenance: maintenance


            });
            handleClickOpenviewnear();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName)

        try {
            let res = await axios.get(`${SERVICE.ASSETMATERIALIP_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setMaintentancemasteredit(res?.data?.sassetmaterialip);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    //Project updateby edit page...
    let updateby = maintentancemasteredit?.updatedby;
    let addedby = maintentancemasteredit?.addedby;

    let maintenanceid = maintentancemasteredit?._id;

    //editing the single data...
    const sendEditRequest = async () => {
        let subarray = selectedOptionsMaterialEdit.map((item) => item.value);
        let materialnamesfrom = maintentancemasteredit.assetmaterial
        try {

            const deletePromises = idgrpedit?.map((item) => {
                return axios.delete(`${SERVICE.ASSETMATERIALIP_SINGLE}/${item}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
            });

            await Promise.all(deletePromises);

            axios.post(`${SERVICE.ASSETMATERIALIP_CREATE}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company: String(maintentancemasteredit.company),
                branch: String(maintentancemasteredit.branch),
                unit: String(maintentancemasteredit.unit),
                floor: String(maintentancemasteredit.floor),
                location: String(maintentancemasteredit.location),
                area: String(maintentancemasteredit.area),
                assetmaterial: String(maintentancemasteredit.assetmaterial),
                subcomponents: subarray,
                ip: Boolean(maintentancemasteredit.ip),
                ebusage: Boolean(maintentancemasteredit.ebusage),
                empdistribution: Boolean(maintentancemasteredit.empdistribution),
                updatedby: [
                    ...updateby,
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });

            await fetchMaintentanceIndividualdel();

            handleCloseModEdit();
            // setShowAlert(
            //     <>
            //         <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7ac767" }} />
            //         <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Updated Successfully 👍"}</p>
            //     </>
            // );
            // handleClickOpenerr();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const sendEditRequestNear = async () => {
        setPageName(!pageName)

        let subarray = selectedOptionsMaterialEdit.map((item) => item.value);
        try {
            let res = await axios.put(`${SERVICE.ASSETMATERIALIP_SINGLE}/${maintenanceid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company: String(maintentancemasteredit.company),
                branch: String(maintentancemasteredit.branch),
                unit: String(maintentancemasteredit.unit),
                floor: String(maintentancemasteredit.floor),
                location: String(maintentancemasteredit.location),
                area: String(maintentancemasteredit.area),
                assetmaterial: String(maintentancemasteredit.assetmaterial),
                assetmaterialcheck: String(maintentancemasteredit.assetmaterialcheck),
                subcomponents: subarray,
                component: ComponentValueCateEdit,
                ip: Boolean(maintentancemasteredit.ip),
                ebusage: Boolean(maintentancemasteredit.ebusage),
                empdistribution: Boolean(maintentancemasteredit.empdistribution),
                maintenance: Boolean(maintentancemasteredit.maintenance),
                updatedby: [
                    ...updateby,
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchMaintentanceIndividual();
            await fetchMaintentanceIndividualSingle();

            handleCloseModEditNear();
            // setShowAlert(
            //     <>
            //         <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7ac767" }} />
            //         <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Updated Successfully 👍"}</p>
            //     </>
            // );
            // handleClickOpenerr();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const editSubmitNear = (e) => {
        e.preventDefault();
        fetchProjMasterAll();
        const isNameMatch = allProjectedit.some(
            (item) =>
                item.company === maintentancemasteredit.company &&
                item.branch === maintentancemasteredit.branch &&
                item.unit === maintentancemasteredit.unit &&
                item.floor === maintentancemasteredit.floor &&
                item.area === maintentancemasteredit.area &&
                item.location === maintentancemasteredit.location &&
                item.assetmaterial === maintentancemasteredit.assetmaterial &&
                item.component.some((item) =>
                    selectedComponentOptionsCateEdit.map((item) => item.value).includes(item)
                )
        );



        if (maintentancemasteredit.company === "Please Select Company") {
            // setShowAlert(
            //     <>
            //         <ErrorOutlineOutlinedIcon
            //             sx={{ fontSize: "100px", color: "orange" }}
            //         />
            //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
            //             {"Please Select Company"}
            //         </p>
            //     </>
            // );
            // handleClickOpenerr();
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (maintentancemasteredit.branch === "Please Select Branch") {
            // setShowAlert(
            //     <>
            //         <ErrorOutlineOutlinedIcon
            //             sx={{ fontSize: "100px", color: "orange" }}
            //         />
            //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
            //             {"Please Select Branch"}
            //         </p>
            //     </>
            // );
            // handleClickOpenerr();
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (maintentancemasteredit.unit === "Please Select Unit") {
            // setShowAlert(
            //     <>
            //         <ErrorOutlineOutlinedIcon
            //             sx={{ fontSize: "100px", color: "orange" }}
            //         />
            //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
            //             {"Please Select Unit"}
            //         </p>
            //     </>
            // );
            // handleClickOpenerr();
            setPopupContentMalert("Please Select Unit!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (maintentancemasteredit.floor === "Please Select Floor") {
            // setShowAlert(
            //     <>
            //         <ErrorOutlineOutlinedIcon
            //             sx={{ fontSize: "100px", color: "orange" }}
            //         />
            //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
            //             {"Please Select Floor"}
            //         </p>
            //     </>
            // );
            // handleClickOpenerr();
            setPopupContentMalert("Please Select Floor!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (maintentancemasteredit.area === "Please Select Area") {
            // setShowAlert(
            //     <>
            //         <ErrorOutlineOutlinedIcon
            //             sx={{ fontSize: "100px", color: "orange" }}
            //         />
            //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
            //             {"Please Select Area"}
            //         </p>
            //     </>
            // );
            // handleClickOpenerr();
            setPopupContentMalert("Please Select Area!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (maintentancemasteredit.location === "Please Select Location") {
            // setShowAlert(
            //     <>
            //         <ErrorOutlineOutlinedIcon
            //             sx={{ fontSize: "100px", color: "orange" }}
            //         />
            //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
            //             {"Please Select Location"}
            //         </p>
            //     </>
            // );
            // handleClickOpenerr();
            setPopupContentMalert("Please Select Location!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (maintentancemasteredit.assetmaterial === "Please Select Material") {
            // setShowAlert(
            //     <>
            //         <ErrorOutlineOutlinedIcon
            //             sx={{ fontSize: "100px", color: "orange" }}
            //         />
            //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
            //             {"Please Select Material"}
            //         </p>
            //     </>
            // );
            // handleClickOpenerr();
            setPopupContentMalert("Please Select Material!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (ComponentValueCateEdit?.length === 0) {
            // setShowAlert(
            //     <>
            //         <ErrorOutlineOutlinedIcon
            //             sx={{ fontSize: "100px", color: "orange" }}
            //         />
            //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
            //             {"Please Select Asset Material"}
            //         </p>
            //     </>
            // );
            // handleClickOpenerr();
            setPopupContentMalert("Please Select Asset Material!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            // setShowAlert(
            //     <>
            //         <ErrorOutlineOutlinedIcon
            //             sx={{ fontSize: "100px", color: "orange" }}
            //         />
            //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
            //             {"Data Already Exist!"}
            //         </p>
            //     </>
            // );
            // handleClickOpenerr();
            setPopupContentMalert("Data Already Exist!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendEditRequestNear();
        }
    };

    const fetchFloor = async (e) => {

        let result = allfloor.filter((d) => d.branch === e.value || d.branch === e.branch);
        const floorall = result.map((d) => ({
            ...d,
            label: d.name,
            value: d.name,
        }));
        setFloors(floorall);
        setFloorEdit(floorall);
    };
    const fetchArea = async (e) => {

        let result = allareagrouping
            .filter((d) => d.branch === newcheckbranch && d.floor === e)
            .map((data) => data.area);
        let ji = [].concat(...result);
        const all = ji.map((d) => ({
            ...d,
            label: d,
            value: d,
        }));
        setAreas(all);
    };
    const fetchLocation = async (e) => {
        let result = alllocationgrouping
            .filter(
                (d) =>
                    d.branch === newcheckbranch &&
                    d.floor === maintentancemaster.floor &&
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
    };


    const fetchAreaEdit = async (a, e) => {

        let result = allareagrouping
            .filter((d) => d.branch === a && d.floor === e)
            .map((data) => data.area);
        let ji = [].concat(...result);
        const all = ji.map((d) => ({
            ...d,
            label: d,
            value: d,
        }));
        setAreasEdit(all);
    };

    //get all Locations edit.
    const fetchAllLocationEdit = async (a, b, c) => {

        let result = alllocationgrouping
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
    };

    // const fetchMaintentanceIndividual = async () => {
    //     setPageName(!pageName)

    //     setProjectCheck(true);
    //     try {


    //         let res = await axios.get(SERVICE.ASSETMATERIALIP_LIMITED, {
    //             headers: {
    //                 Authorization: `Bearer ${auth.APIToken}`,
    //             },
    //         });


    //         let single = res?.data?.assetmaterialip

    //         const uniqueObjects = [];
    //         const uniqueKeysMap = new Map();

    //         single.forEach((obj) => {
    //             const key = `${obj.company}-${obj.branch}-${obj.unit}-${obj.team}-${obj.area}-${obj.location}`;

    //             if (!uniqueKeysMap.has(key)) {
    //                 obj.id = [obj._id];
    //                 uniqueKeysMap.set(key, obj);
    //             } else {
    //                 const existingObj = uniqueKeysMap.get(key);
    //                 existingObj.assetmaterial += `, ${obj.assetmaterial}`;

    //                 // Check if subcomponents is empty or not
    //                 if (obj.subcomponents.length > 0) {
    //                     if (existingObj.subcomponents.length > 0) {
    //                         existingObj.subcomponents += `, ${obj.subcomponents.join(",")}`;
    //                     } else {
    //                         existingObj.subcomponents = obj.subcomponents.join(",");
    //                     }
    //                 }

    //                 if (obj.component.length > 0) {
    //                     if (existingObj.component.length > 0) {
    //                         existingObj.component += `, ${obj.component.join(",")}`;
    //                     } else {
    //                         existingObj.component = obj.component.join(",");
    //                     }
    //                 }

    //                 existingObj.id = existingObj.id.concat(obj._id);
    //                 uniqueKeysMap.set(key, existingObj);
    //             }
    //         });

    //         uniqueObjects.push(...uniqueKeysMap.values());
    //         setMaintentance(uniqueObjects)
    //         if (res?.data?.assetmaterialip.length > 0) {
    //             setUniqueid(res?.data?.assetmaterialip[res?.data?.assetmaterialip.length - 1].uniqueid)
    //         }

    //         setProjectCheck(false);
    //     } catch (err) { setProjectCheck(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
    // };



    const fetchMaintentanceIndividual = async () => {
        setPageName(!pageName)

        setProjectCheck(true);
        const accessmodule = [];

        isAssignBranch.map((data) => {
            let fetfinalurl = [];

            if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 &&
                data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0 &&
                data?.subsubpagenameurl?.length !== 0
            ) {
                fetfinalurl = data.subsubpagenameurl;
            } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 &&
                data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0) {
                fetfinalurl = data.subpagenameurl;
            } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 &&
                data?.mainpagenameurl?.length !== 0) {
                fetfinalurl = data.mainpagenameurl;
            } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0) {
                fetfinalurl = data.submodulenameurl;
            } else if (data?.modulenameurl?.length !== 0) {
                fetfinalurl = data.modulenameurl;
            }
            accessmodule.push(fetfinalurl);
        });

        const uniqueValues = [...new Set(accessmodule.flat())];

        if (uniqueValues?.includes(pathname) || isUserRoleAccess?.role?.includes("Manager")) {
            try {


                // let res = await axios.post(SERVICE.ASSET_MATERIALIP_LIMITED_ACCESS, {
                //     headers: {
                //         Authorization: `Bearer ${auth.APIToken}`,
                //     },
                //     assignbranch: accessbranch,
                // });


                // let single = res?.data?.assetmaterialip

                let res = await axios.post(SERVICE.ASSET_MATERIALIP_LIMITED_ACCESS, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    assignbranch: accessbranch,
                });



                const single = res?.data?.assetmaterialip
                const uniqueObjects = [];
                const uniqueKeysMap = new Map();

                single.forEach((obj) => {
                    const key = `${obj.company}-${obj.branch}-${obj.unit}-${obj.team}-${obj.area}-${obj.location}`;

                    if (!uniqueKeysMap.has(key)) {
                        obj.id = [obj._id];
                        uniqueKeysMap.set(key, obj);
                    } else {
                        const existingObj = uniqueKeysMap.get(key);
                        existingObj.assetmaterial += `, ${obj.assetmaterial}`;

                        // Check if subcomponents is empty or not
                        if (obj.subcomponents.length > 0) {
                            if (existingObj.subcomponents.length > 0) {
                                existingObj.subcomponents += `, ${obj.subcomponents.join(",")}`;
                            } else {
                                existingObj.subcomponents = obj.subcomponents.join(",");
                            }
                        }

                        if (obj.component.length > 0) {
                            if (existingObj.component.length > 0) {
                                existingObj.component += `, ${obj.component.join(",")}`;
                            } else {
                                existingObj.component = obj.component.join(",");
                            }
                        }

                        existingObj.id = existingObj.id.concat(obj._id);
                        uniqueKeysMap.set(key, existingObj);
                    }
                });

                uniqueObjects.push(...uniqueKeysMap.values());

                setMaintentance(uniqueObjects)


                if (res?.data?.assetmaterialip.length > 0) {
                    setUniqueid(res?.data?.assetmaterialip[res?.data?.assetmaterialip.length - 1].uniqueid)
                }

                setProjectCheck(false);
            } catch (err) { setProjectCheck(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
        }
        else {
            setProjectCheck(true)
            setMaintentance([]);
        }
    }




    const fetchMaintentanceIndividualSingle = async () => {
        setPageName(!pageName)

        setProjectCheck(true);
        try {


            let res = await axios.post(SERVICE.ASSET_MATERIALIP_LIMITED_ACCESS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                assignbranch: accessbranch,
            });



            const singleindividual = res?.data?.assetmaterialip


            setIndividualAsset(singleindividual);


            setProjectCheck(false);

        } catch (err) { setProjectCheck(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    const [individualAssetDel, setIndividualAssetDel] = useState([])
    const fetchMaintentanceIndividualdel = async () => {
        setPageName(!pageName)

        try {

            let res = await axios.get(SERVICE.ASSETMATERIALIP_LIMITED, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });



            const singleindividual = res?.data?.assetmaterialip
            setIndividualAssetDel(singleindividual);

            let single = res?.data?.assetmaterialip

            const uniqueObjects = [];
            const uniqueKeysMap = new Map();

            single.forEach((obj) => {
                const key = `${obj.company}-${obj.branch}-${obj.unit}-${obj.team}-${obj.area}-${obj.location}`;

                if (!uniqueKeysMap.has(key)) {
                    obj.id = [obj._id];
                    uniqueKeysMap.set(key, obj);
                } else {
                    const existingObj = uniqueKeysMap.get(key);
                    existingObj.assetmaterial += `, ${obj.assetmaterial}`;


                    // Check if subcomponents is empty or not
                    if (obj.subcomponents.length > 0) {
                        if (existingObj.subcomponents.length > 0) {
                            existingObj.subcomponents += `, ${obj.subcomponents.join(",")}`;
                        } else {
                            existingObj.subcomponents = obj.subcomponents.join(",");
                        }
                    }

                    if (obj.component.length > 0) {
                        if (existingObj.component.length > 0) {
                            existingObj.component += `, ${obj.component.join(",")}`;
                        } else {
                            existingObj.component = obj.component.join(",");
                        }
                    }


                    existingObj.id = existingObj.id.concat(obj._id);
                    uniqueKeysMap.set(key, existingObj);
                }
            });

            uniqueObjects.push(...uniqueKeysMap.values());
            setMaintentance(uniqueObjects)
            if (res?.data?.assetmaterialip.length > 0) {
                setUniqueid(res?.data?.assetmaterialip[res?.data?.assetmaterialip.length - 1].uniqueid)
            }
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };



    useEffect(() => {
        fetchMaintentanceIndividual();
    }, [maintentance, individualasset])
    // }, [accessbranch, maintentance, individualasset])
    useEffect(() => {
        fetchMaintentanceIndividualSingle();

    }, [])

    useEffect(() => {
        fetchMaintentanceIndividualdel();
    }, [loadingdeloverall])

    //get all project.
    const fetchProjMasterAll = async () => {
        setPageName(!pageName)

        try {
            let res_project = await axios.get(SERVICE.ASSETMATERIALIP, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setAllProjectedit(res_project?.data?.assetmaterialip.filter((item) => item._id !== maintentancemasteredit?._id));
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    useEffect(() => {
        fetchProjMasterAll();
    }, [isEditOpenNear, maintentancemasteredit]);

    // pdf.....
    const columns = [
        { title: "Sno", field: "serialNumber" },
        { title: "Company", field: "company" },
        { title: "Branch", field: "branch" },
        { title: "Unit", field: "unit" },
        { title: "Floor", field: "floor" },
        { title: "Area", field: "area" },
        { title: "Location", field: "location" },
        { title: "Material", field: "assetmaterial" },
        { title: "Asset Material", field: "component" },
        { title: "IP", field: "ip" },
        { title: "ebusage", field: "ebusage" },
        { title: "Employee Distribution", field: "empdistribution" },
        { title: "Maintenance", field: "maintenance" },
    ];

    //  pdf download functionality
    const downloadPdf = (isfilter) => {

        const doc = new jsPDF();

        // Initialize serial number counter
        let serialNumberCounter = 1;


        // Modify row data to include serial number
        const dataWithSerial = isfilter === "filtered" ?
            rowDataTable.map(row => ({ ...row, serialNumber: serialNumberCounter++ })) :
            maintentance.map(row => {
                return {
                    ...row,
                    serialNumber: serialNumberCounter++,
                    ip: row.ip === true ? "Yes" : "No",
                    ebusage: row.ebusage === true ? "Yes" : "No",
                    empdistribution: row.empdistribution === true ? "Yes" : "No",
                    maintenance: row.maintenance === true ? "Yes" : "No",
                }
            });
        // Generate PDF
        doc.autoTable({
            theme: "grid",
            styles: { fontSize: 5 },
            // columns: columnsWithSerial,
            columns: columns.map((col) => ({ ...col, dataKey: col.field })),
            body: dataWithSerial,
        });

        doc.save("AssetIP Group.pdf");
    };

    const columnsnear = [
        { title: "Sno", field: "serialNumber" },
        { title: "Company", field: "company" },
        { title: "Branch", field: "branch" },
        { title: "Unit", field: "unit" },
        { title: "Floor", field: "floor" },
        { title: "Area", field: "area" },
        { title: "Location", field: "location" },
        { title: "Material", field: "assetmaterial" },
        { title: "Asset Material", field: "component" },
        { title: "IP", field: "ip" },
        { title: "ebusage", field: "ebusage" },
        { title: "Employee Distribution", field: "empdistribution" },
        { title: "Maintenance", field: "maintenance" },
    ];

    //  pdf download functionality
    const downloadPdfNear = (isfilter) => {
        const doc = new jsPDF();

        // Initialize serial number counter
        let serialNumberCounter = 1;


        // Modify row data to include serial number
        const dataWithSerial = isfilter === "filtered" ?
            rowDataTableNearTat.map(row => ({ ...row, serialNumber: serialNumberCounter++ })) :
            individualasset.map(row => {
                return {
                    ...row,
                    serialNumber: serialNumberCounter++,
                    ip: row.ip === true ? "Yes" : "No",
                    ebusage: row.ebusage === true ? "Yes" : "No",
                    empdistribution: row.empdistribution === true ? "Yes" : "No",
                    maintenance: row.maintenance === true ? "Yes" : "No",
                }
            });
        // Generate PDF
        doc.autoTable({
            theme: "grid",
            styles: { fontSize: 5 },
            // columns: columnsWithSerial,
            columns: columnsnear.map((col) => ({ ...col, dataKey: col.field })),
            body: dataWithSerial,
        });

        doc.save("AssetIP Individual.pdf");
    };

    // Excel
    const fileName = "AssetIP Group";
    const fileNameNear = "AssetIP Individual";

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "AssetIP Group",
        pageStyle: "print",
    });

    //print...
    const componentRefNear = useRef();
    const handleprintNear = useReactToPrint({
        content: () => componentRefNear.current,
        documentTitle: "AssetIP Individual ",
        pageStyle: "print",
    });



    // serial no for listing items
    const addSerialNumber = (datas) => {
        const itemsWithSerialNumber = datas?.map((item, index) => ({
            ...item, serialNumber: index + 1,

            ip: item.ip === true ? "Yes" : "No",
            ebusage: item.ebusage === true ? "Yes" : "No",
            empdistribution: item.empdistribution === true ? "Yes" : "No",
            maintenance: item.maintenance === true ? "Yes" : "No",
            component: item.component?.toString(","),
        }));
        setItems(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumber(maintentance);
    }, [maintentance]);

    //serial no for listing items
    const addSerialNumberNearTat = (datas) => {
        const itemsWithSerialNumber = datas?.map((item, index) => ({
            ...item, serialNumber: index + 1,
            ip: item.ip === true ? "Yes" : "No",
            ebusage: item.ebusage === true ? "Yes" : "No",
            empdistribution: item.empdistribution === true ? "Yes" : "No",
            maintenance: item.maintenance === true ? "Yes" : "No",
        }));
        setItemsNearTat(itemsWithSerialNumber);
    };
    useEffect(() => {
        addSerialNumberNearTat(individualasset);
    }, [individualasset]);
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

    //Datatable
    const handlePageChangeNearTatPrimary = (newPage) => {
        setPageNearTatPrimary(newPage);
    };

    const handlePageSizeChangeNearTatPrimary = (event) => {
        setPageSizeNearTatPrimary(Number(event.target.value));
        setPageNearTatPrimary(1);
    };


    //datatable....
    const [searchQueryNearTatPrimary, setSearchQueryNearTatPrimary] = useState("");
    const handleSearchChangeNearTatPrimary = (event) => {
        setSearchQueryNearTatPrimary(event.target.value);
    };



    const searchTerms = searchQuery.toLowerCase().split(" ");
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

    const searchOverNearTerms = searchQueryNearTatPrimary.toLowerCase().split(" ");

    // Modify the filtering logic to check each term
    const filteredDatasNearTatPrimary = itemsneartat?.filter((item) => {
        return searchOverNearTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });

    const filteredDataNearTatPrimary = filteredDatasNearTatPrimary?.slice((pageNearTatPrimary - 1) * pageSizeNearTatPrimary, pageNearTatPrimary * pageSizeNearTatPrimary);

    const totalPagesNearTatPrimary = Math.ceil(filteredDatasNearTatPrimary?.length / pageSizeNearTatPrimary);

    const visiblePagesNearTatPrimary = Math.min(totalPagesNearTatPrimary, 3);

    const firstVisiblePageNearTatPrimary = Math.max(1, pageNearTatPrimary - 1);
    const lastVisiblePageNearTatPrimary = Math.min(Math.abs(firstVisiblePageNearTatPrimary + visiblePagesNearTatPrimary - 1), totalPagesNearTatPrimary);


    const pageNumbersNearTatPrimary = [];

    const indexOfLastItemNearTatPrimary = pageNearTatPrimary * pageSizeNearTatPrimary;
    const indexOfFirstItemNearTatPrimary = indexOfLastItemNearTatPrimary - pageSizeNearTatPrimary;


    for (let i = firstVisiblePageNearTatPrimary; i <= lastVisiblePageNearTatPrimary; i++) {
        pageNumbersNearTatPrimary.push(i);
    }


    useEffect(() => {
        fetchProjMasterAll();
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

    const [selectAllCheckedNear, setSelectAllCheckedNear] = useState(false);

    const CheckboxHeaderNear = ({ selectAllCheckedNear, onSelectAllNear }) => (
        <div>
            <Checkbox checked={selectAllCheckedNear} onChange={onSelectAllNear} />
        </div>
    );


    const columnDataTable = [
        // {
        //     field: "checkbox",
        //     headerName: "Checkbox", // Default header name
        //     headerStyle: {
        //         fontWeight: "bold", // Apply the font-weight style to make the header text bold
        //         // Add any other CSS styles as needed
        //     },
        //     renderHeader: (params) => (
        //         <CheckboxHeader
        //             selectAllChecked={selectAllChecked}
        //             onSelectAll={() => {
        //                 if (rowDataTable.length === 0) {
        //                     // Do not allow checking when there are no rows
        //                     return;
        //                 }

        //                 if (selectAllChecked) {
        //                     setSelectedRows([]);
        //                 } else {
        //                     const allRowIds = rowDataTable.map((row) => row.id);
        //                     setSelectedRows(allRowIds);
        //                 }
        //                 setSelectAllChecked(!selectAllChecked);
        //             }}
        //         />
        //     ),

        //     cellRenderer: (params) => (
        //         <Checkbox
        //             checked={selectedRows.includes(params.data.id)}
        //             onChange={() => {
        //                 let updatedSelectedRows;
        //                 if (selectedRows.includes(params.data.id)) {
        //                     updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.data.id);
        //                 } else {
        //                     updatedSelectedRows = [...selectedRows, params.data.id];
        //                 }

        //                 setSelectedRows(updatedSelectedRows);

        //                 // Update the "Select All" checkbox based on whether all rows are selected
        //                 setSelectAllChecked(updatedSelectedRows.length === filteredData.length);
        //             }}
        //         />
        //     ),
        //     sortable: false, // Optionally, you can make this column not sortable
        //     width: 90,

        //     hide: !columnVisibility.checkbox,
        //     headerClassName: "bold-header",
        // },
        {
            field: "checkbox",
            headerName: "", // Default header name
            headerStyle: {
                fontWeight: "bold",
            },
            sortable: false,
            width: 90,
            filter: false,
            headerCheckboxSelection: true,
            checkboxSelection: true,
            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
            pinned: "left",
        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 100,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },
        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 100,
            hide: !columnVisibility.company,
            headerClassName: "bold-header",
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 100,
            hide: !columnVisibility.branch,
            headerClassName: "bold-header",
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 100,
            hide: !columnVisibility.unit,
            headerClassName: "bold-header",
        },
        {
            field: "floor",
            headerName: "Floor",
            flex: 0,
            width: 100,
            hide: !columnVisibility.floor,
            headerClassName: "bold-header",
        },
        {
            field: "area",
            headerName: "Area",
            flex: 0,
            width: 100,
            hide: !columnVisibility.area,
            headerClassName: "bold-header",
        },
        {
            field: "location",
            headerName: "Location",
            flex: 0,
            width: 100,
            hide: !columnVisibility.location,
            headerClassName: "bold-header",
        },
        { field: "assetmaterial", headerName: "Material", flex: 0, width: 160, hide: !columnVisibility.assetmaterial, headerClassName: "bold-header" },
        {
            field: "component",
            headerName: "Asset Material",
            flex: 0,
            width: 160,
            hide: !columnVisibility.component,
            headerClassName: "bold-header",
        },
        { field: "ip", headerName: "IP", flex: 0, width: 100, hide: !columnVisibility.ip, headerClassName: "bold-header" },
        { field: "ebusage", headerName: "EB Usage", flex: 0, width: 100, hide: !columnVisibility.ebusage, headerClassName: "bold-header" },
        { field: "empdistribution", headerName: "Employee Distribution", flex: 0, width: 100, hide: !columnVisibility.empdistribution, headerClassName: "bold-header" },
        { field: "maintenance", headerName: "Maintenance", flex: 0, width: 100, hide: !columnVisibility.maintentance, headerClassName: "bold-header" },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 250,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>

                    {isUserRoleCompare?.includes("dassetmaterialip")
                        && (
                            <Button
                                sx={userStyle.buttondelete}
                                onClick={(e) => {
                                    rowData(params.data.id, params.data.idgrp);
                                }}
                            >
                                <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
                            </Button>
                        )}
                    {isUserRoleCompare?.includes("vassetmaterialip")
                        && (
                            <Button
                                sx={userStyle.buttonedit}
                                onClick={() => {
                                    getviewCode(
                                        params.data.company, params.data.branch, params.data.unit, params.data.floor,
                                        params.data.area, params.data.location, params.data.assetmaterial,
                                        //  params.data.subcomponentsstring,
                                        params.data.component, params.data.ip,
                                        params.data.ebusage, params.data.empdistribution, params.data.maintenance
                                    );
                                }}
                            >
                                <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                            </Button>
                        )}
                    {isUserRoleCompare?.includes("iassetmaterialip")
                        && (
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

    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item._id,
            idgrp: item.id,
            serialNumber: item.serialNumber,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            floor: item.floor,
            area: item.area,
            location: item.location,
            assetmaterial: item.assetmaterial,
            subcomponents: item.subcomponents,
            subcomponentsstring: item.subcomponents?.toString(),
            component: item.component,
            ip: item.ip,
            ebusage: item.ebusage,
            empdistribution: item.empdistribution,
            maintenance: item.maintenance,
        };
    });

    const columnDataTableNeartat = [
        // {
        //     field: "checkbox",
        //     headerName: "Checkbox", // Default header name
        //     headerStyle: {
        //         fontWeight: "bold", // Apply the font-weight style to make the header text bold
        //         // Add any other CSS styles as needed
        //     },
        //     renderHeader: (params) => (
        //         <CheckboxHeaderNear
        //             selectAllCheckedNear={selectAllCheckedNear}
        //             onSelectAllNear={() => {
        //                 if (rowDataTableNearTat.length === 0) {
        //                     // Do not allow checking when there are no rows
        //                     return;
        //                 }

        //                 if (selectAllCheckedNear) {
        //                     setSelectedRowsNear([]);
        //                 } else {
        //                     const allRowIds = rowDataTableNearTat.map((row) => row.id);
        //                     setSelectedRowsNear(allRowIds);
        //                 }
        //                 setSelectAllCheckedNear(!selectAllCheckedNear);
        //             }}
        //         />
        //     ),

        //     cellRenderer: (params) => (
        //         <Checkbox
        //             checked={selectedRowsNear.includes(params.data.id)}
        //             onChange={() => {
        //                 let updatedSelectedRows;
        //                 if (selectedRowsNear.includes(params.data.id)) {
        //                     updatedSelectedRows = selectedRowsNear.filter((selectedId) => selectedId !== params.data.id);
        //                 } else {
        //                     updatedSelectedRows = [...selectedRowsNear, params.data.id];
        //                 }

        //                 setSelectedRowsNear(updatedSelectedRows);

        //                 // Update the "Select All" checkbox based on whether all rows are selected
        //                 setSelectAllCheckedNear(updatedSelectedRows.length === filteredDataNearTatPrimary.length);
        //             }}
        //         />
        //     ),
        //     sortable: false, // Optionally, you can make this column not sortable
        //     width: 80,

        //     hide: !columnVisibility.checkbox,
        //     headerClassName: "bold-header",
        // },
        {
            field: "checkbox",
            headerName: "", // Default header name
            headerStyle: {
                fontWeight: "bold",
            },
            sortable: false,
            width: 90,
            filter: false,
            headerCheckboxSelection: true,
            checkboxSelection: true,
            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
            pinned: "left",
        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 100,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },
        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 100,
            hide: !columnVisibility.company,
            headerClassName: "bold-header",
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 100,
            hide: !columnVisibility.branch,
            headerClassName: "bold-header",
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 100,
            hide: !columnVisibility.unit,
            headerClassName: "bold-header",
        },
        {
            field: "floor",
            headerName: "Floor",
            flex: 0,
            width: 100,
            hide: !columnVisibility.floor,
            headerClassName: "bold-header",
        },
        {
            field: "area",
            headerName: "Area",
            flex: 0,
            width: 100,
            hide: !columnVisibility.area,
            headerClassName: "bold-header",
        },
        {
            field: "location",
            headerName: "Location",
            flex: 0,
            width: 100,
            hide: !columnVisibility.location,
            headerClassName: "bold-header",
        },
        {
            field: "assetmaterial", headerName: "Material",
            flex: 0, width: 160, hide: !columnVisibility.assetmaterial, headerClassName: "bold-header"
        },
        {
            field: "component",
            headerName: "Asset Material",
            flex: 0,
            width: 160,
            hide: !columnVisibility.component,
            headerClassName: "bold-header",
        },
        { field: "ip", headerName: "IP", flex: 0, width: 100, hide: !columnVisibility.ip, headerClassName: "bold-header" },
        { field: "ebusage", headerName: "EB Usage", flex: 0, width: 100, hide: !columnVisibility.ebusage, headerClassName: "bold-header" },
        { field: "empdistribution", headerName: "Employee Distribution", flex: 0, width: 100, hide: !columnVisibility.empdistribution, headerClassName: "bold-header" },
        { field: "maintenance", headerName: "Maintenance", flex: 0, width: 100, hide: !columnVisibility.maintentance, headerClassName: "bold-header" },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 250,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("eassetmaterialip")
                        && (
                            <Button
                                sx={userStyle.buttonedit}
                                onClick={() => {
                                    handleClickOpenEditNear();
                                    getCodeNear(params.data.id);
                                }}
                            >
                                <EditOutlinedIcon sx={buttonStyles.buttonedit} />
                            </Button>
                        )}
                    {isUserRoleCompare?.includes("dassetmaterialip")
                        && (
                            <Button
                                sx={userStyle.buttondelete}
                                onClick={(e) => {
                                    rowDataNear(params.data.id);
                                }}
                            >
                                <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
                            </Button>
                        )}
                    {isUserRoleCompare?.includes("vassetmaterialip")
                        && (
                            <Button
                                sx={userStyle.buttonedit}
                                onClick={() => {
                                    getviewCodeNear(
                                        params.data.company, params.data.branch, params.data.unit, params.data.floor,
                                        params.data.area, params.data.location, params.data.assetmaterial, params.data.component, params.data.ip,
                                        params.data.ebusage, params.data.empdistribution, params.data.maintenance
                                    );
                                }}
                            >
                                <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                            </Button>
                        )}
                </Grid>
            ),
        },
    ];

    const rowDataTableNearTat = filteredDataNearTatPrimary.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            floor: item.floor,
            area: item.area,
            location: item.location,
            assetmaterial: item.assetmaterial,
            subcomponents: item.subcomponents,
            component: item.component?.toString(","),
            ip: item.ip,
            ebusage: item.ebusage,
            empdistribution: item.empdistribution,
            maintenance: item.maintenance,
        };
    });

    const rowsWithCheckboxes = rowDataTable.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRows.includes(row.id),
    }));

    const rowsWithCheckboxesNear = rowDataTableNearTat.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRowsNear.includes(row.id),
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


    // Show All Columns functionality
    const handleShowAllColumnsNeartat = () => {
        const updatedVisibilityNeartat = { ...columnVisibilityNeartat };
        for (const columnKey in updatedVisibilityNeartat) {
            updatedVisibilityNeartat[columnKey] = true;
        }
        setColumnVisibilityNeartat(updatedVisibilityNeartat);
    };

    // Manage Columns functionality
    const toggleColumnVisibilityNeartat = (field) => {
        setColumnVisibilityNeartat((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    // Function to filter columns based on search query
    const filteredColumnsNeartat = columnDataTableNeartat.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManageNeartat.toLowerCase())
    );

    // JSX for the "Manage Columns" popover content
    const manageColumnsContentNeartat = (
        <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton
                aria-label="close"
                onClick={handleCloseManageColumnsNeartat}
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
                <TextField label="Find column" variant="standard" fullWidth value={searchQueryManageNeartat}
                    onChange={(e) => setSearchQueryManageNeartat(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
            </Box>
            <br />
            <br />
            <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumnsNeartat.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText
                                sx={{ display: "flex" }}
                                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibilityNeartat[column.field]} onChange={() => toggleColumnVisibilityNeartat(column.field)} />}
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
                        <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibilityNeartat(initialColumnVisibilityNeartat)}>
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
                                columnDataTableNeartat.forEach((column) => {
                                    newColumnVisibility[column.field] = false; // Set hide property to true
                                });
                                setColumnVisibilityNeartat(newColumnVisibility);
                            }}
                        >
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );


    // Function to find an object where the 'name' property is missing and return it in array format
    function findObjectWithMissingName() {

        let sub = maintentancemaster.assetmaterial !== "" && assetdetails.find((t) => t.material === maintentancemaster.assetmaterialcheck) && assetdetails.find((t) => t.material === maintentancemaster.assetmaterialcheck)?.subcomponent;
        const objectsWithMissingName = [];
        if (sub) {
            for (let obj of sub) {
                if (obj.hasOwnProperty('sub') && obj.hasOwnProperty('subname')) {
                    objectsWithMissingName.push(obj);
                }
            }

            return objectsWithMissingName;
        }
    }

    function findObjectWithMissingNameEdit() {
        let sub = maintentancemasteredit.assetmaterial !== "" && assetdetails.find((t) => t.material === maintentancemasteredit.assetmaterialcheck) && assetdetails.find((t) => t.material === maintentancemasteredit.assetmaterialcheck)?.subcomponent;
        const objectsWithMissingName = [];
        if (sub) {
            for (let obj of sub) {
                if (obj.hasOwnProperty('sub') && obj.hasOwnProperty('subname')) {
                    objectsWithMissingName.push(obj);
                }
            }

            return objectsWithMissingName;
        }
    }

    // Example usage
    const objectsWithMissingName = findObjectWithMissingName();
    const objectsWithMissingNameEdit = findObjectWithMissingNameEdit();

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    const [isFilterOpennear, setIsFilterOpennear] = useState(false);
    const [isPdfFilterOpennear, setIsPdfFilterOpennear] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    // page refersh reload
    const handleCloseFilterModnear = () => {
        setIsFilterOpennear(false);
    };

    const handleClosePdfFilterModnear = () => {
        setIsPdfFilterOpennear(false);
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
    //                 serialNumber: index + 1,
    //                 Company: t.company,
    //                 Branch: t.branch,
    //                 Unit: t.unit,
    //                 Floor: t.floor,
    //                 Area: t.area,
    //                 Location: t.location,
    //                 Material: t.assetmaterial,
    //                 assetmaterial: t.component,
    //                 ip: t.ip,
    //                 ebusage: t.ebusage,
    //                 empdistribution: t.empdistribution,
    //                 maintenance: t.maintenance
    //             })),
    //             fileName,
    //         );
    //     } else if (isfilter === "overall") {
    //         exportToCSV(
    //             maintentance.map((t, index) => ({
    //                 serialNumber: index + 1,
    //                 Company: t.company,
    //                 Branch: t.branch,
    //                 Unit: t.unit,
    //                 Floor: t.floor,
    //                 Area: t.area,
    //                 Location: t.location,
    //                 Material: t.assetmaterial,
    //                 assetmaterial: t.component,
    //                 ip: t.ip === true ? "Yes" : "No",
    //                 ebusage: t.ebusage === true ? "Yes" : "No",
    //                 empdistribution: t.empdistribution === true ? "Yes" : "No",
    //                 maintenance: t.maintenance === true ? "Yes" : "No",
    //             })),
    //             fileName,
    //         );

    //     }

    //     setIsFilterOpen(false)
    // };


    // const handleExportXLnear = (isfilter) => {
    //     if (isfilter === "filtered") {
    //         exportToCSV(
    //             rowDataTableNearTat?.map((t, index) => ({
    //                 serialNumber: index + 1,
    //                 Company: t.company,
    //                 Branch: t.branch,
    //                 Unit: t.unit,
    //                 Floor: t.floor,
    //                 Area: t.area,
    //                 Location: t.location,
    //                 Material: t.assetmaterial,
    //                 assetmaterial: t.component,
    //                 ip: t.ip,
    //                 ebusage: t.ebusage,
    //                 empdistribution: t.empdistribution,
    //                 maintenance: t.maintenance
    //             })),
    //             fileNameNear,
    //         );
    //     } else if (isfilter === "overall") {
    //         exportToCSV(
    //             individualasset.map((t, index) => ({
    //                 serialNumber: index + 1,
    //                 Company: t.company,
    //                 Branch: t.branch,
    //                 Unit: t.unit,
    //                 Floor: t.floor,
    //                 Area: t.area,
    //                 Location: t.location,
    //                 Material: t.assetmaterial,
    //                 assetmaterial: t.component,
    //                 ip: t.ip === true ? "Yes" : "No",
    //                 ebusage: t.ebusage === true ? "Yes" : "No",
    //                 empdistribution: t.empdistribution === true ? "Yes" : "No",
    //                 maintenance: t.maintenance === true ? "Yes" : "No",
    //             })),
    //             fileNameNear,
    //         );

    //     }

    //     setIsFilterOpennear(false)
    // };

    //Access Module
    const pathname = window.location.pathname;
    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Asset Material IP"),
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

    return (
        <Box>
            <Headtitle title={"Asset Material IP"} />
            {/* ****** Header Content ****** */}
            {/* <Typography sx={userStyle.HeaderText}>Asset Material IP</Typography> */}
            <PageHeading
                title="Asset Material IP"
                modulename="Asset"
                submodulename="Asset Details"
                mainpagename="Asset Material IP"
                subpagename=""
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("aassetmaterialip")
                && (
                    <>
                        <Box sx={userStyle.selectcontainer}>
                            <>
                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        <Typography sx={userStyle.importheadtext}>Add Asset Material IP</Typography>
                                    </Grid>
                                </Grid>
                                <br />
                                <Grid container spacing={2}>

                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Company<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                options={isAssignBranch ? isAssignBranch?.map(data => ({
                                                    label: data.company,
                                                    value: data.company,
                                                })).filter((item, index, self) => {
                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                }) : []}
                                                styles={colourStyles}
                                                value={{
                                                    label: maintentancemaster.company,
                                                    value: maintentancemaster.company,
                                                }}
                                                onChange={(e) => {
                                                    setMaintentancemaster({
                                                        ...maintentancemaster,
                                                        company: e.value,
                                                        branch: "Please Select Branch",
                                                        unit: "Please Select Unit",
                                                        floor: "Please Select Floor",
                                                        area: "Please Select Area",
                                                        location: "Please Select Location",
                                                        assetmaterial: "Please Select Material"
                                                    });
                                                    setLocations([{ label: "ALL", value: "ALL" }]);
                                                    setSelectedOptionsMaterial([]);
                                                    setSelectedOptionsComponent([])
                                                    setValueComponentCat([]);

                                                    setFloors([])
                                                    setAreas([])
                                                    setLocations([{ label: "ALL", value: "ALL" }]);

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
                                                options={isAssignBranch ? isAssignBranch?.filter(
                                                    (comp) =>
                                                        maintentancemaster.company === comp.company
                                                )?.map(data => ({
                                                    label: data.branch,
                                                    value: data.branch,
                                                })).filter((item, index, self) => {
                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                }) : []}
                                                styles={colourStyles}
                                                value={{
                                                    label: maintentancemaster.branch,
                                                    value: maintentancemaster.branch,
                                                }}
                                                onChange={(e) => {
                                                    setNewcheckBranch(e.value);
                                                    setMaintentancemaster({
                                                        ...maintentancemaster,
                                                        branch: e.value,
                                                        unit: "Please Select Unit",
                                                        floor: "Please Select Floor",
                                                        area: "Please Select Area",
                                                        location: "Please Select Location",
                                                        assetmaterial: "Please Select Material"
                                                    });
                                                    setLocations([{ label: "ALL", value: "ALL" }]);
                                                    setAreas([])
                                                    fetchFloor(e);
                                                    setSelectedOptionsMaterial([]);
                                                    setSelectedOptionsComponent([])
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
                                                options={isAssignBranch ? isAssignBranch?.filter(
                                                    (comp) =>
                                                        maintentancemaster.company === comp.company && maintentancemaster.branch === comp.branch
                                                )?.map(data => ({
                                                    label: data.unit,
                                                    value: data.unit,
                                                })).filter((item, index, self) => {
                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                }) : []}
                                                styles={colourStyles}
                                                value={{ label: maintentancemaster.unit, value: maintentancemaster.unit }}
                                                onChange={(e) => {
                                                    setMaintentancemaster({
                                                        ...maintentancemaster,
                                                        unit: e.value,
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
                                                value={{ label: maintentancemaster.floor, value: maintentancemaster.floor }}
                                                onChange={(e) => {
                                                    setMaintentancemaster({
                                                        ...maintentancemaster,
                                                        floor: e.value,
                                                        workstation: "",
                                                        area: "Please Select Area",
                                                        location: "Please Select Location",
                                                        assetmaterial: "Please Select Material"
                                                    });
                                                    setSelectedOptionsMaterial([]);
                                                    setSelectedOptionsComponent([])
                                                    setAreas([])
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
                                                value={{ label: maintentancemaster.area, value: maintentancemaster.area }}
                                                onChange={(e) => {
                                                    setMaintentancemaster({
                                                        ...maintentancemaster,
                                                        area: e.value,
                                                        workstation: "",
                                                        location: "Please Select Location",
                                                        assetmaterial: "Please Select Material"
                                                    });
                                                    // setSelectedOptionsMaterial([]);
                                                    // setAssetdetails([])
                                                    // setLocations([{ label: "ALL", value: "ALL" }]);
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
                                                    label: maintentancemaster.location,
                                                    value: maintentancemaster.location,
                                                }}
                                                onChange={(e) => {
                                                    setMaintentancemaster({
                                                        ...maintentancemaster,
                                                        location: e.value,
                                                        assetmaterial: "Please Select Material",
                                                    });
                                                    // setSelectedOptionsMaterial([])

                                                }}
                                            />
                                        </FormControl>

                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Material<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                options={materialOpt}
                                                value={{
                                                    label: maintentancemaster.assetmaterial,
                                                    value: maintentancemaster.assetmaterial,
                                                }}
                                                onChange={(e) => {
                                                    setMaintentancemaster({
                                                        ...maintentancemaster,
                                                        assetmaterial: e.value,
                                                    });
                                                    setSelectedOptionsMaterial([]);
                                                    setValueComponentCat([]);
                                                    setSelectedOptionsComponent([]);
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Asset Material<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                // options={
                                                //     maintentancemaster.location === "ALL"
                                                //         ? Array.from(
                                                //             new Set(
                                                //                 assetdetails
                                                //                     .filter(
                                                //                         (t) =>
                                                //                             locations
                                                //                                 .map((item) => item.value)
                                                //                                 .includes(t.location) &&
                                                //                             t?.component ===
                                                //                             maintentancemaster.assetmaterial
                                                //                     )
                                                //                     .map((t) => ({
                                                //                         ...t,
                                                //                         label: t.material + "-" + t.code,
                                                //                         value: t.material + "-" + t.code,
                                                //                     }))
                                                //                     .reduce((acc, curr) => {
                                                //                         if (
                                                //                             !acc.some(
                                                //                                 (obj) => obj.value === curr.value
                                                //                             )
                                                //                         ) {
                                                //                             acc.push(curr);
                                                //                         }
                                                //                         return acc;
                                                //                     }, [])
                                                //             )
                                                //         )
                                                //         : Array.from(
                                                //             new Set(
                                                //                 assetdetails
                                                //                     .filter(
                                                //                         (t) =>
                                                //                             (t.location ===
                                                //                                 maintentancemaster.location ||
                                                //                                 t.location === "ALL") &&
                                                //                             t?.component ===
                                                //                             maintentancemaster.assetmaterial
                                                //                     )
                                                //                     .map((t) => ({
                                                //                         ...t,
                                                //                         label: t.material + "-" + t.code,
                                                //                         value: t.material + "-" + t.code,
                                                //                     }))
                                                //                     .reduce((acc, curr) => {
                                                //                         if (
                                                //                             !acc.some(
                                                //                                 (obj) => obj.value === curr.value
                                                //                             )
                                                //                         ) {
                                                //                             acc.push(curr);
                                                //                         }
                                                //                         return acc;
                                                //                     }, [])
                                                //             )
                                                //         )
                                                // }
                                                options={
                                                    maintentancemaster.location === "ALL"
                                                        ? Array.from(
                                                            new Set(
                                                                assetdetails
                                                                    .filter(
                                                                        (t) =>
                                                                            locations
                                                                                .map((item) => item.value)
                                                                                .includes(t.location) &&
                                                                            t?.component ===
                                                                            maintentancemaster.assetmaterial
                                                                    )
                                                                    .map((t) => ({
                                                                        ...t,
                                                                        label: t.material + "-" + t.code,
                                                                        value: t.material + "-" + t.code,
                                                                    }))
                                                                    .reduce((acc, curr) => {
                                                                        if (
                                                                            !acc.some(
                                                                                (obj) => obj.value === curr.value
                                                                            )
                                                                        ) {
                                                                            acc.push(curr);
                                                                        }
                                                                        return acc;
                                                                    }, [])
                                                            )
                                                        )
                                                        : Array.from(
                                                            new Set(
                                                                assetdetails
                                                                    .filter(
                                                                        (t) =>
                                                                            (t.location ===
                                                                                maintentancemaster.location
                                                                            ) &&
                                                                            t?.component ===
                                                                            maintentancemaster.assetmaterial
                                                                    )
                                                                    .map((t) => ({
                                                                        ...t,
                                                                        label: t.material + "-" + t.code,
                                                                        value: t.material + "-" + t.code,
                                                                    }))
                                                                    .reduce((acc, curr) => {
                                                                        if (
                                                                            !acc.some(
                                                                                (obj) => obj.value === curr.value
                                                                            )
                                                                        ) {
                                                                            acc.push(curr);
                                                                        }
                                                                        return acc;
                                                                    }, [])
                                                            )
                                                        )
                                                }
                                                value={selectedOptionsComponent}
                                                onChange={(e) => {
                                                    handleComponentChange(e);
                                                }}
                                                valueRenderer={customValueRendererComponent}
                                                labelledBy="Please Select Asset Material"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} sm={3} xs={6}>
                                        <FormGroup>
                                            <FormControlLabel control={<Checkbox
                                                checked={maintentancemaster.ip}
                                                onChange={(e) =>
                                                    setMaintentancemaster({
                                                        ...maintentancemaster,
                                                        ip: !maintentancemaster.ip,
                                                    })
                                                }
                                            />}

                                                label="IP" />

                                        </FormGroup>
                                    </Grid>
                                    <Grid item md={3} sm={3} xs={6}>
                                        <FormGroup>
                                            <FormControlLabel control={<Checkbox
                                                checked={maintentancemaster.ebusage}
                                                onChange={(e) =>
                                                    setMaintentancemaster({
                                                        ...maintentancemaster,
                                                        ebusage: !maintentancemaster.ebusage,
                                                    })
                                                }
                                            />}

                                                label="EB Usage" />
                                        </FormGroup>
                                    </Grid>
                                    <Grid item md={3} sm={3} xs={6}>
                                        <FormGroup>
                                            <FormControlLabel control={<Checkbox
                                                checked={maintentancemaster.empdistribution}
                                                onChange={(e) =>
                                                    setMaintentancemaster({
                                                        ...maintentancemaster,
                                                        empdistribution: !maintentancemaster.empdistribution,
                                                    })
                                                }
                                            />}

                                                label="Employee Distribution" />
                                        </FormGroup>
                                    </Grid>

                                    <Grid item md={3} sm={3} xs={6}>
                                        <FormGroup>
                                            <FormControlLabel control={<Checkbox
                                                checked={maintentancemaster.maintenance}
                                                onChange={(e) =>
                                                    setMaintentancemaster({
                                                        ...maintentancemaster,
                                                        maintenance: !maintentancemaster.maintenance,
                                                    })
                                                }
                                            />}

                                                label="Maintenance" />
                                        </FormGroup>
                                    </Grid>
                                </Grid >
                                <br />
                                <br />

                                <Grid container>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <LoadingButton
                                            onClick={handleSubmit}
                                            loading={loadingdeloverall}
                                            color="primary"
                                            loadingPosition="end"
                                            variant="contained"
                                        >
                                            Submit
                                        </LoadingButton>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <Button sx={userStyle.btncancel} onClick={handleclear}>
                                            Clear
                                        </Button>
                                    </Grid>
                                </Grid>
                            </>
                        </Box >
                    </>

                )
            }



            <Box>
                {/* Edit DIALOG */}
                <Dialog open={isEditOpen} onClose={handleCloseModEdit} aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="lg" fullWidth={true}
                    sx={{
                        overflow: "visible",
                        "& .MuiPaper-root": {
                            overflow: "visible",
                        },
                    }}
                >
                    <Box sx={{ padding: "10px 20px" }}>
                        <>
                            <Grid container spacing={2}>
                                <Typography sx={userStyle.HeaderText}>Edit Asset Material IP</Typography>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Company<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={isAssignBranch ? isAssignBranch?.map(data => ({
                                                label: data.company,
                                                value: data.company,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label &&
                                                    i.value === item.value) === index;
                                            }) : []}
                                            styles={colourStyles}
                                            value={{
                                                label: maintentancemasteredit.company,
                                                value: maintentancemasteredit.company,
                                            }}
                                            onChange={(e) => {
                                                setMaintentancemasteredit({
                                                    ...maintentancemasteredit,
                                                    company: e.value,
                                                    branch: "Please Select Branch",
                                                    unit: "Please Select Unit",
                                                    floor: "Please Select Floor",
                                                    area: "Please Select Area",
                                                    location: "Please Select Location",
                                                    assetmaterial: "Please Select Material"
                                                });
                                                setAreasEdit([]);
                                                setFloorEdit([]);
                                                setAssetdetails([]);
                                                setSelectedOptionsMaterialEdit([]);
                                                setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Branch<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={isAssignBranch ? isAssignBranch?.filter(
                                                (comp) =>
                                                    maintentancemasteredit.company === comp.company
                                            )?.map(data => ({
                                                label: data.branch,
                                                value: data.branch,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            }) : []}
                                            styles={colourStyles}
                                            value={{
                                                label: maintentancemasteredit.branch,
                                                value: maintentancemasteredit.branch,
                                            }}
                                            onChange={(e) => {
                                                setMaintentancemasteredit({
                                                    ...maintentancemasteredit,
                                                    branch: e.value,
                                                    unit: "Please Select Unit",
                                                    floor: "Please Select Floor",
                                                    area: "Please Select Area",
                                                    location: "Please Select Location",
                                                    assetmaterial: "Please Select Material"
                                                });
                                                setAreasEdit([]);
                                                setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                                                setFloorEdit([]);
                                                setAssetdetails([]);
                                                setSelectedOptionsMaterialEdit([]);
                                                fetchFloor(e);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Unit<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={isAssignBranch ? isAssignBranch?.filter(
                                                (comp) =>
                                                    maintentancemasteredit.company === comp.company && maintentancemasteredit.branch === comp.branch
                                            )?.map(data => ({
                                                label: data.unit,
                                                value: data.unit,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            }) : []}
                                            styles={colourStyles}
                                            value={{
                                                label: maintentancemasteredit.unit,
                                                value: maintentancemasteredit.unit,
                                            }}
                                            onChange={(e) => {
                                                setMaintentancemasteredit({
                                                    ...maintentancemasteredit,
                                                    unit: e.value,

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
                                            options={floorsEdit}
                                            styles={colourStyles}
                                            value={{
                                                label: maintentancemasteredit.floor,
                                                value: maintentancemasteredit.floor,
                                            }}
                                            onChange={(e) => {
                                                setMaintentancemasteredit({
                                                    ...maintentancemasteredit,
                                                    floor: e.value,
                                                    workstation: "",
                                                    area: "Please Select Area",
                                                    location: "Please Select Location",
                                                    assetmaterial: "Please Select Material"
                                                });
                                                setAreasEdit([]);
                                                setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                                                setAssetdetails([]);
                                                setSelectedOptionsMaterialEdit([]);
                                                fetchAreaEdit(maintentancemasteredit.branch, e.value);
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
                                            options={areasEdit}
                                            styles={colourStyles}
                                            value={{
                                                label: maintentancemasteredit.area,
                                                value: maintentancemasteredit.area,
                                            }}
                                            onChange={(e) => {
                                                setMaintentancemasteredit({
                                                    ...maintentancemasteredit,
                                                    area: e.value,
                                                    workstation: "",
                                                    location: "Please Select Location",
                                                    assetmaterial: "Please Select Material"
                                                });
                                                setAssetdetails([]);
                                                setSelectedOptionsMaterialEdit([]);
                                                setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                                                fetchAllLocationEdit(
                                                    maintentancemasteredit.branch,
                                                    maintentancemasteredit.floor,
                                                    e.value
                                                );
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
                                            options={locationsEdit}
                                            styles={colourStyles}
                                            value={{
                                                label: maintentancemasteredit.location,
                                                value: maintentancemasteredit.location,
                                            }}
                                            onChange={(e) => {
                                                setMaintentancemasteredit({
                                                    ...maintentancemasteredit,
                                                    location: e.value,
                                                    assetmaterial: "Please Select Material"
                                                });
                                                setAssetdetails([]);
                                                setSelectedOptionsMaterialEdit([]);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Asset Material
                                        </Typography>
                                        <Selects
                                            options={maintentancemasteredit.location === "ALL"
                                                ? Array.from(
                                                    new Set(
                                                        assetdetails
                                                            .filter(
                                                                (t) =>
                                                                    locationsEdit
                                                                        .map((item) => item.value)
                                                                        .includes(t.location) &&
                                                                    t?.component ===
                                                                    maintentancemasteredit.assetmaterial
                                                            )
                                                            .map((t) => ({
                                                                ...t,
                                                                label: t.material + "-" + t.code,
                                                                value: t.material + "-" + t.code,
                                                            }))
                                                            .reduce((acc, curr) => {
                                                                if (
                                                                    !acc.some(
                                                                        (obj) => obj.value === curr.value
                                                                    )
                                                                ) {
                                                                    acc.push(curr);
                                                                }
                                                                return acc;
                                                            }, [])
                                                    )
                                                )
                                                : Array.from(
                                                    new Set(
                                                        assetdetails
                                                            .filter(
                                                                (t) =>
                                                                    (t.location ===
                                                                        maintentancemasteredit.location
                                                                    ) &&
                                                                    t?.component ===
                                                                    maintentancemasteredit.assetmaterial
                                                            )
                                                            .map((t) => ({
                                                                ...t,
                                                                label: t.material + "-" + t.code,
                                                                value: t.material + "-" + t.code,
                                                            }))
                                                            .reduce((acc, curr) => {
                                                                if (
                                                                    !acc.some(
                                                                        (obj) => obj.value === curr.value
                                                                    )
                                                                ) {
                                                                    acc.push(curr);
                                                                }
                                                                return acc;
                                                            }, [])
                                                    )
                                                )
                                            }
                                            value={{
                                                label: maintentancemasteredit.assetmaterial,
                                                value: maintentancemasteredit.assetmaterial,
                                            }}
                                            onChange={(e) => {
                                                setMaintentancemasteredit({
                                                    ...maintentancemasteredit,
                                                    assetmaterial: e.value,
                                                });
                                            }}

                                        />
                                    </FormControl>
                                </Grid>
                                {objectsWithMissingNameEdit?.length > 0 &&

                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Sub Components
                                            </Typography>
                                            <MultiSelect
                                                options={objectsWithMissingNameEdit
                                                    .map(t => ({
                                                        ...t,
                                                        label: t.subname + "-" + t.code,
                                                        value: t.subname + "-" + t.code,
                                                    })
                                                    )
                                                }
                                                value={selectedOptionsMaterialEdit}
                                                onChange={handleMaterialChangeEdit}

                                                valueRenderer={customValueRendererBranchEdit}
                                                labelledBy="Please Select SubComponents"
                                            />
                                        </FormControl>
                                    </Grid>
                                }
                                <Grid item md={3} sm={3} xs={6}>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox

                                        />}
                                            onChange={(e) =>
                                                setMaintentancemasteredit({
                                                    ...maintentancemasteredit,
                                                    ip: e.target.value,
                                                })
                                            }
                                            label="IP" />

                                    </FormGroup>
                                </Grid>
                                <Grid item md={3} sm={3} xs={6}>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox

                                        />}
                                            onChange={(e) =>
                                                setMaintentancemasteredit({
                                                    ...maintentancemasteredit,
                                                    ebusage: e.target.value,
                                                })
                                            }
                                            label="EB Usage" />
                                    </FormGroup>
                                </Grid>
                                <Grid item md={3} sm={3} xs={6}>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox

                                        />}
                                            onChange={(e) =>
                                                setMaintentancemasteredit({
                                                    ...maintentancemasteredit,
                                                    empdistribution: e.target.value,
                                                })
                                            }
                                            label="Employee Distribution" />
                                    </FormGroup>
                                </Grid>
                            </Grid>
                            <br /> <br />
                            <Grid container spacing={2}>
                                <br />
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
                                        {" "}
                                        Cancel{" "}
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </Dialog>
            </Box>
            <Box>
                {/* Edit DIALOG */}
                <Dialog open={isEditOpenNear} onClose={handleCloseModEditNear} aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="lg" fullWidth={true}
                    sx={{
                        overflow: "visible",
                        "& .MuiPaper-root": {
                            overflow: "visible",
                        },
                    }}
                >
                    <Box sx={{ padding: "10px 20px" }}>
                        <>
                            <Grid container spacing={2}>
                                <Typography sx={userStyle.HeaderText}>Edit Asset Material IP</Typography>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Company<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={isAssignBranch ? isAssignBranch
                                                ?.map(data => ({
                                                    label: data.company,
                                                    value: data.company,
                                                })).filter((item, index, self) => {
                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                }) : []}
                                            styles={colourStyles}
                                            value={{
                                                label: maintentancemasteredit.company,
                                                value: maintentancemasteredit.company,
                                            }}
                                            onChange={(e) => {
                                                setMaintentancemasteredit({
                                                    ...maintentancemasteredit,
                                                    company: e.value,
                                                    branch: "Please Select Branch",
                                                    unit: "Please Select Unit",
                                                    floor: "Please Select Floor",
                                                    area: "Please Select Area",
                                                    location: "Please Select Location",
                                                    assetmaterial: "Please Select Material"
                                                });

                                                setAreasEdit([]);
                                                setFloorEdit([]);
                                                setSelectedOptionsMaterialEdit([]);
                                                setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                                                setComponentValueCateEdit([]);
                                                setSelectedComponentOptionsCateEdit([]);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Branch<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={isAssignBranch ? isAssignBranch?.filter(
                                                (comp) =>
                                                    maintentancemasteredit.company === comp.company
                                            )?.map(data => ({
                                                label: data.branch,
                                                value: data.branch,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            }) : []}
                                            styles={colourStyles}
                                            value={{
                                                label: maintentancemasteredit.branch,
                                                value: maintentancemasteredit.branch,
                                            }}
                                            onChange={(e) => {
                                                setMaintentancemasteredit({
                                                    ...maintentancemasteredit,
                                                    branch: e.value,
                                                    unit: "Please Select Unit",
                                                    floor: "Please Select Floor",
                                                    area: "Please Select Area",
                                                    location: "Please Select Location",
                                                    assetmaterial: "Please Select Material"
                                                });

                                                setAreasEdit([]);
                                                setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                                                setFloorEdit([]);
                                                setSelectedOptionsMaterialEdit([]);

                                                fetchFloor(e);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Unit<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={isAssignBranch ? isAssignBranch?.filter(
                                                (comp) =>
                                                    maintentancemasteredit.company === comp.company && maintentancemasteredit.branch === comp.branch
                                            )?.map(data => ({
                                                label: data.unit,
                                                value: data.unit,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            }) : []}
                                            styles={colourStyles}
                                            value={{
                                                label: maintentancemasteredit.unit,
                                                value: maintentancemasteredit.unit,
                                            }}
                                            onChange={(e) => {
                                                setMaintentancemasteredit({
                                                    ...maintentancemasteredit,
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
                                            options={floorsEdit}
                                            styles={colourStyles}
                                            value={{
                                                label: maintentancemasteredit.floor,
                                                value: maintentancemasteredit.floor,
                                            }}
                                            onChange={(e) => {
                                                setMaintentancemasteredit({
                                                    ...maintentancemasteredit,
                                                    floor: e.value,
                                                    workstation: "",
                                                    area: "Please Select Area",
                                                    location: "Please Select Location",
                                                    assetmaterial: "Please Select Material"
                                                });
                                                setAreasEdit([]);
                                                setSelectedOptionsMaterialEdit([]);
                                                setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                                                fetchAreaEdit(maintentancemasteredit.branch, e.value);
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
                                            options={areasEdit}
                                            styles={colourStyles}
                                            value={{
                                                label: maintentancemasteredit.area,
                                                value: maintentancemasteredit.area,
                                            }}
                                            onChange={(e) => {
                                                setMaintentancemasteredit({
                                                    ...maintentancemasteredit,
                                                    area: e.value,
                                                    workstation: "",
                                                    location: "Please Select Location",
                                                    assetmaterial: "Please Select Material"
                                                });
                                                setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                                                setSelectedOptionsMaterialEdit([]);
                                                fetchAllLocationEdit(
                                                    maintentancemasteredit.branch,
                                                    maintentancemasteredit.floor,
                                                    e.value
                                                );
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
                                            options={locationsEdit}
                                            styles={colourStyles}
                                            value={{
                                                label: maintentancemasteredit.location,
                                                value: maintentancemasteredit.location,
                                            }}
                                            onChange={(e) => {
                                                setMaintentancemasteredit({
                                                    ...maintentancemasteredit,
                                                    location: e.value,
                                                    assetmaterial: "Please Select Material"
                                                });
                                                setSelectedOptionsMaterialEdit([]);
                                                setSelectedOptionsMaterialEdit([])
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Material<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={materialOpt}
                                            value={{
                                                label: maintentancemasteredit.assetmaterial,
                                                value: maintentancemasteredit.assetmaterial,
                                            }}
                                            onChange={(e) => {
                                                setMaintentancemasteredit({
                                                    ...maintentancemasteredit,
                                                    assetmaterial: e.value,
                                                });
                                                setComponentValueCateEdit([]);
                                                setSelectedComponentOptionsCateEdit([]);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Asset Material<b style={{ color: "red" }}>*</b>
                                        </Typography>

                                        <MultiSelect
                                            options={
                                                maintentancemasteredit.location === "ALL"
                                                    ? Array.from(
                                                        new Set(
                                                            assetdetails
                                                                .filter(
                                                                    (t) =>
                                                                        locationsEdit
                                                                            .map((item) => item.value)
                                                                            .includes(t.location) &&
                                                                        t?.component ===
                                                                        maintentancemasteredit.assetmaterial
                                                                )
                                                                .map((t) => ({
                                                                    ...t,
                                                                    label: t.material + "-" + t.code,
                                                                    value: t.material + "-" + t.code,
                                                                }))
                                                                .reduce((acc, curr) => {
                                                                    if (
                                                                        !acc.some(
                                                                            (obj) => obj.value === curr.value
                                                                        )
                                                                    ) {
                                                                        acc.push(curr);
                                                                    }
                                                                    return acc;
                                                                }, [])
                                                        )
                                                    )
                                                    : Array.from(
                                                        new Set(
                                                            assetdetails
                                                                .filter(
                                                                    (t) =>
                                                                        (t.location ===
                                                                            maintentancemasteredit.location
                                                                        ) &&
                                                                        t?.component ===
                                                                        maintentancemasteredit.assetmaterial
                                                                )
                                                                .map((t) => ({
                                                                    ...t,
                                                                    label: t.material + "-" + t.code,
                                                                    value: t.material + "-" + t.code,
                                                                }))
                                                                .reduce((acc, curr) => {
                                                                    if (
                                                                        !acc.some(
                                                                            (obj) => obj.value === curr.value
                                                                        )
                                                                    ) {
                                                                        acc.push(curr);
                                                                    }
                                                                    return acc;
                                                                }, [])
                                                        )
                                                    )
                                            }
                                            value={selectedComponentOptionsCateEdit}
                                            onChange={handleComponentChangeEdit}
                                            valueRenderer={customValueRendererComponentEdit}
                                            labelledBy="Please Select Asset Material"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={3} xs={6}>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox
                                            checked={maintentancemasteredit.ip}
                                            onChange={(e) =>
                                                setMaintentancemasteredit({
                                                    ...maintentancemasteredit,
                                                    ip: !maintentancemasteredit.ip,
                                                })
                                            }
                                        />}

                                            label="IP" />

                                    </FormGroup>
                                </Grid>
                                <Grid item md={3} sm={3} xs={6}>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox
                                            checked={maintentancemasteredit.ebusage}
                                            onChange={(e) =>
                                                setMaintentancemasteredit({
                                                    ...maintentancemasteredit,
                                                    ebusage: !maintentancemasteredit.ebusage
                                                })
                                            }
                                        />}

                                            label="EB Usage" />
                                    </FormGroup>
                                </Grid>
                                <Grid item md={3} sm={3} xs={6}>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox
                                            checked={maintentancemasteredit.empdistribution}
                                            onChange={(e) =>
                                                setMaintentancemasteredit({
                                                    ...maintentancemasteredit,
                                                    empdistribution: !maintentancemasteredit.empdistribution,
                                                })
                                            }
                                        />}

                                            label="Employee Distribution" />
                                    </FormGroup>
                                </Grid>
                                <Grid item md={3} sm={3} xs={6}>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox
                                            checked={maintentancemasteredit.maintenance}
                                            onChange={(e) =>
                                                setMaintentancemasteredit({
                                                    ...maintentancemasteredit,
                                                    maintenance: !maintentancemasteredit.maintenance,
                                                })
                                            }
                                        />}

                                            label="Maintenance" />
                                    </FormGroup>
                                </Grid>
                            </Grid>
                            <br /> <br />
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button variant="contained" onClick={editSubmitNear}>
                                        {" "}
                                        Update
                                    </Button>
                                </Grid>
                                <br />
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button sx={userStyle.btncancel} onClick={handleCloseModEditNear}>
                                        {" "}
                                        Cancel{" "}
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </Dialog>
            </Box>




            <br />

            {/* ****** Table Start ****** */}
            {
                isUserRoleCompare?.includes("lassetmaterialip")
                && (
                    <>
                        {projectCheck ? (
                            <Box sx={userStyle.container}>
                                <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />

                                </Box>
                            </Box>
                        ) : (


                            <>
                                <Box sx={userStyle.container}>
                                    {/* ******************************************************EXPORT Buttons****************************************************** */}
                                    <Grid item xs={8}>
                                        <Typography sx={userStyle.importheadtext}> Group Asset IP List</Typography>
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
                                                    {/* <MenuItem value={maintentance?.length}>All</MenuItem> */}
                                                </Select>
                                            </Box>
                                        </Grid>
                                        <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                            <Box>
                                                {isUserRoleCompare?.includes("excelassetmaterialip")
                                                    && (
                                                        <>
                                                            <Button onClick={(e) => {
                                                                setIsFilterOpen(true)
                                                                setFormat("xl")
                                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                                        </>
                                                    )}
                                                {isUserRoleCompare?.includes("csvassetmaterialip")
                                                    && (

                                                        <>
                                                            <Button onClick={(e) => {
                                                                setIsFilterOpen(true)
                                                                setFormat("csv")
                                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                                        </>
                                                    )}

                                                {isUserRoleCompare?.includes("printassetmaterialip")
                                                    && (
                                                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                            &ensp;
                                                            <FaPrint />
                                                            &ensp;Print&ensp;
                                                        </Button>
                                                    )}

                                                {isUserRoleCompare?.includes("pdfassetmaterialip")
                                                    && (
                                                        <>
                                                            <Button sx={userStyle.buttongrp}
                                                                onClick={() => {
                                                                    setIsPdfFilterOpen(true)
                                                                }}
                                                            ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                                        </>
                                                    )}
                                                {isUserRoleCompare?.includes("imageassetmaterialip")
                                                    && (
                                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                                            {" "}
                                                            <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                                        </Button>
                                                    )}
                                            </Box>
                                        </Grid>
                                        <Grid item md={2} xs={12} sm={12}>
                                            <Box>
                                                {/* <FormControl fullWidth size="small">
                                                    <Typography>Search</Typography>
                                                    <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
                                                </FormControl> */}
                                                <AggregatedSearchBar
                                                    columnDataTable={columnDataTable}
                                                    // setItems={setItems}
                                                    addSerialNumber={addSerialNumber}
                                                    setPage={setPage}
                                                    maindatas={maintentance}
                                                    setSearchedString={setSearchedString}
                                                />
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <br />
                                    <Grid container spacing={1}>
                                        <Grid item md={6} xs={12} sm={12}>
                                            <Box sx={{ display: "flex", justifyContent: "left", flexWrap: "wrap", gap: "10px" }}>
                                                <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                                                    Show All Columns
                                                </Button>
                                                <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
                                                    Manage Columns
                                                </Button>
                                            </Box>
                                        </Grid>
                                    </Grid>

                                    <br />
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
                                        gridRefTableImg={gridRefTableImg}

                                        paginated={false}
                                        filteredDatas={filteredDatas}
                                        // totalDatas={totalDatas}
                                        searchQuery={searchedString}
                                        handleShowAllColumns={handleShowAllColumns}
                                    />
                                    {/* ****** Table End ****** */}
                                </Box>
                            </>

                        )}
                    </>
                )
            }
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

            <br />
            <>

                <Box sx={userStyle.container}>
                    {/* ******************************************************EXPORT Buttons****************************************************** */}
                    <Grid item xs={8}>
                        <Typography sx={userStyle.importheadtext}>Individual Asset IP List</Typography>
                    </Grid>
                    <Grid container spacing={2} style={userStyle.dataTablestyle}>
                        <Grid item md={2} xs={12} sm={12}>
                            <Box>
                                <label>Show entries:</label>
                                <Select
                                    id="pageSizeSelect"
                                    value={pageSizeNearTatPrimary}
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 180,
                                                width: 80,
                                            },
                                        },
                                    }}
                                    onChange={handlePageSizeChangeNearTatPrimary}
                                    sx={{ width: "77px" }}
                                >
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={25}>25</MenuItem>
                                    <MenuItem value={50}>50</MenuItem>
                                    <MenuItem value={100}>100</MenuItem>
                                    {/* <MenuItem value={individualasset?.length}>All</MenuItem> */}
                                </Select>
                            </Box>
                        </Grid>
                        <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Box>
                                {isUserRoleCompare?.includes("excelpayruncontrol") && (
                                    <>
                                        <Button onClick={(e) => {
                                            setIsFilterOpennear(true)
                                            setFormat("xl")
                                        }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                    </>
                                )}
                                {isUserRoleCompare?.includes("csvpayruncontrol") && (
                                    <>
                                        <Button onClick={(e) => {
                                            setIsFilterOpennear(true)
                                            setFormat("csv")
                                        }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                    </>
                                )}
                                {isUserRoleCompare?.includes("printpayruncontrol") && (
                                    <>
                                        <Button sx={userStyle.buttongrp} onClick={handleprintNear}>
                                            &ensp;
                                            <FaPrint />
                                            &ensp;Print&ensp;
                                        </Button>
                                    </>
                                )}
                                {isUserRoleCompare?.includes("pdfpayruncontrol") && (
                                    <>
                                        <Button sx={userStyle.buttongrp}
                                            onClick={() => {
                                                setIsPdfFilterOpennear(true)
                                            }}
                                        ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                    </>
                                )}
                                {isUserRoleCompare?.includes("imagepayruncontrol") && (
                                    <>
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImagenear}>
                                            {" "}
                                            <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </Grid>
                        <Grid item md={2} xs={12} sm={12}>
                            <Box>
                                {/* <FormControl fullWidth size="small">
                                    <Typography>Search</Typography>
                                    <OutlinedInput id="component-outlined" type="text" value={searchQueryNearTatPrimary} onChange={handleSearchChangeNearTatPrimary} />
                                </FormControl> */}
                                <AggregatedSearchBar
                                    columnDataTable={columnDataTableNeartat}
                                    // setItems={setItems}
                                    addSerialNumber={addSerialNumberNearTat}
                                    setPage={setPageNearTatPrimary}
                                    maindatas={individualasset}
                                    setSearchedString={setSearchedString}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                    <br />
                    <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsNeartat}>
                        Show All Columns
                    </Button>
                    &ensp;
                    <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsNeartat}>
                        Manage Columns
                    </Button>
                    &ensp;
                    {isUserRoleCompare?.includes("bdpayruncontrol") && (
                        <Button variant="contained" sx={buttonStyles.buttonbulkdelete} onClick={handleClickOpenalert}>
                            Bulk Delete
                        </Button>
                    )}
                    <br />
                    <br />
                    <AggridTable
                        rowDataTable={rowDataTableNearTat}
                        columnDataTable={columnDataTableNeartat}
                        columnVisibility={columnVisibilityNeartat}
                        page={pageNearTatPrimary}
                        setPage={setPageNearTatPrimary}
                        pageSize={pageSize}
                        totalPages={totalPages}
                        setColumnVisibility={setColumnVisibilityNeartat}
                        isHandleChange={isHandleChange}
                        items={itemsneartat}
                        selectedRows={selectedRowsNear}
                        setSelectedRows={setSelectedRowsNear}
                        gridRefTable={gridRefTableNear}
                        gridRefTableImg={gridRefTableImgNear}

                        paginated={false}
                        filteredDatas={filteredDatas}
                        // totalDatas={totalDatas}
                        searchQuery={searchedString}
                        handleShowAllColumns={handleShowAllColumns}
                    />
                    {/* ****** Table End ****** */}
                </Box>
            </>

            <Popover
                id={idneartat}
                open={isManageColumnsOpenNeartat}
                anchorEl={anchorElNeartat}
                onClose={handleCloseManageColumnsNeartat}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                {manageColumnsContentNeartat}
            </Popover>


            {/* Delete Modal */}
            <Box>
                {/* ALERT DIALOG */}
                <Dialog open={isDeleteOpen} onClose={handleCloseMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
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
                        <Button autoFocus variant="contained" color="error" onClick={(e) => delProject(projectid)}>
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>


                {/* ALERT DIALOG */}
                <Dialog open={isDeleteOpenNear} onClose={handleCloseModNear} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                        <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                            Are you sure?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleCloseModNear}
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
                        <Button autoFocus variant="contained" color="error" onClick={(e) => delProjectNear(projectid)}>
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* this is info view details */}
                <Dialog open={openInfo} onClose={handleCloseinfo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <Box sx={{ width: "550px", padding: "20px 50px" }}>
                        <>
                            <Typography sx={userStyle.HeaderText}>Group Asset Material IP Info</Typography>
                            <br />
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={12} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">addedby</Typography>
                                        <br />
                                        <Table>
                                            <TableHead>
                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"UserName"}</StyledTableCell>
                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                                            </TableHead>
                                            <TableBody>
                                                {addedby?.map((item, i) => (
                                                    <StyledTableRow>
                                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
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
                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"UserName"}</StyledTableCell>
                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                                            </TableHead>
                                            <TableBody>
                                                {updateby?.map((item, i) => (
                                                    <StyledTableRow>
                                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
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

                {/* <TableContainer component={Paper} sx={userStyle.printcls}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
                        <TableHead>
                            <TableRow>
                                <TableCell> SI.No</TableCell>
                                <TableCell> Company</TableCell>
                                <TableCell> Branch</TableCell>
                                <TableCell> Unit</TableCell>
                                <TableCell>Floor</TableCell>
                                <TableCell>Area</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>Material</TableCell>
                                <TableCell>Asset Material</TableCell>
                                <TableCell>IP</TableCell>
                                <TableCell>EB Usage</TableCell>
                                <TableCell>Employee Distribution</TableCell>
                                <TableCell>Maintenance</TableCell>
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
                                        <TableCell>{row.assetmaterial}</TableCell>
                                        <TableCell>{row.component}</TableCell>
                                        <TableCell>{row.ip}</TableCell>
                                        <TableCell>{row.ebusage}</TableCell>
                                        <TableCell>{row.empdistribution}</TableCell>
                                        <TableCell>{row.maintenance}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>



                <TableContainer component={Paper} sx={userStyle.printcls}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRefNear}>
                        <TableHead>
                            <TableRow>
                                <TableCell> SI.No</TableCell>
                                <TableCell> Company</TableCell>
                                <TableCell> Branch</TableCell>
                                <TableCell> Unit</TableCell>
                                <TableCell>Floor</TableCell>
                                <TableCell>Area</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>Material</TableCell>
                                <TableCell>Asset Material</TableCell>
                                <TableCell>IP</TableCell>
                                <TableCell>EB Usage</TableCell>
                                <TableCell>Employee Distribution</TableCell>
                                <TableCell>Maintenance</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody align="left">
                            {rowDataTableNearTat &&
                                rowDataTableNearTat.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{row.company}</TableCell>
                                        <TableCell>{row.branch}</TableCell>
                                        <TableCell>{row.unit}</TableCell>
                                        <TableCell>{row.floor}</TableCell>
                                        <TableCell>{row.area}</TableCell>
                                        <TableCell>{row.location}</TableCell>
                                        <TableCell>{row.assetmaterial}</TableCell>
                                        <TableCell>{row.component}</TableCell>
                                        <TableCell>{row.ip}</TableCell>
                                        <TableCell>{row.ebusage}</TableCell>
                                        <TableCell>{row.empdistribution}</TableCell>
                                        <TableCell>{row.maintenance}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer> */}


            </Box>

            {/* view model */}
            <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" fullWidth={true}>
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Group Asset Material IP</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Company</Typography>
                                    <Typography>{maintentancemasteredit.company}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Branch</Typography>
                                    <Typography>{maintentancemasteredit.branch}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Unit</Typography>
                                    <Typography>{maintentancemasteredit.unit}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Floor</Typography>
                                    <Typography>{maintentancemasteredit.floor}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Area</Typography>
                                    <Typography>{maintentancemasteredit.area}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Location</Typography>
                                    <Typography>{maintentancemasteredit.location}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Material</Typography>
                                    <Typography>{maintentancemasteredit.assetmaterial}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Asset Material</Typography>
                                    <Typography>{maintentancemasteredit.component}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={4} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">IP</Typography>
                                    <Typography>{maintentancemasteredit.ip}</Typography>                                        </FormControl>
                            </Grid>
                            <Grid item md={4} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">EB Usage</Typography>
                                    <Typography>{maintentancemasteredit.ebusage}</Typography>                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Employee Distribution</Typography>
                                    <Typography>{maintentancemasteredit.empdistribution}</Typography>                                        </FormControl>
                            </Grid>
                            <Grid item md={4} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Maintenance</Typography>
                                    <Typography>{maintentancemasteredit.maintenance}</Typography>                                        </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button variant="contained" color="primary" onClick={handleCloseview}>
                                {" "}
                                Back{" "}
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>

            <Dialog open={openviewnear} onClose={handleClickOpenviewnear} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" fullWidth={true}>
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Individual Asset Material IP</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Company</Typography>
                                    <Typography>{maintentancemasteredit.company}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Branch</Typography>
                                    <Typography>{maintentancemasteredit.branch}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Unit</Typography>
                                    <Typography>{maintentancemasteredit.unit}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Floor</Typography>
                                    <Typography>{maintentancemasteredit.floor}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Area</Typography>
                                    <Typography>{maintentancemasteredit.area}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Location</Typography>
                                    <Typography>{maintentancemasteredit.location}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Material</Typography>
                                    <Typography>{maintentancemasteredit.assetmaterial}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Asset Material</Typography>
                                    <Typography>{maintentancemasteredit.component}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={4} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>IP</Typography>
                                    <Typography>{maintentancemasteredit.ip}</Typography>                                        </FormControl>
                            </Grid>
                            <Grid item md={4} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>EB Usage</Typography>
                                    <Typography>{maintentancemasteredit.ebusage}</Typography>                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Employee Distribution</Typography>
                                    <Typography>{maintentancemasteredit.empdistribution}</Typography>                                        </FormControl>
                            </Grid>
                            <Grid item md={4} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Maintenance</Typography>
                                    <Typography>{maintentancemasteredit.maintenance}</Typography>                                        </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button variant="contained" color="primary" onClick={handleCloseviewnear}>
                                {" "}
                                Back{" "}
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>

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

            <Box>
                <Dialog open={isDeleteOpencheckbox} onClose={handleCloseModcheckbox} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                        <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                            Are you sure?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
                            Cancel
                        </Button>
                        <Button autoFocus variant="contained" color="error" onClick={delProjectcheckbox}>OK</Button>
                    </DialogActions>
                </Dialog>
            </Box>
            <Box>
                {/* ALERT DIALOG */}
                <Dialog open={isDeleteOpenalert} onClose={handleCloseModalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: "orange" }} />
                        <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                            Please Select any Row
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus variant="contained" color="error" onClick={handleCloseModalert}>OK</Button>
                    </DialogActions>
                </Dialog>
            </Box>

            {/* <Dialog open={isFilterOpen} onClose={handleCloseFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>

                    <IconButton
                        aria-label="close"
                        onClick={handleCloseFilterMod}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {fileFormat === 'xl' ?
                        <FaFileExcel style={{ fontSize: "70px", color: "green" }} />
                        : <FaFileCsv style={{ fontSize: "70px", color: "green" }} />
                    }
                    <Typography variant="h5" sx={{ textAlign: "center" }}>
                        Choose Export
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus variant="contained"
                        onClick={(e) => {
                            handleExportXL("filtered")
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button autoFocus variant="contained"
                        onClick={(e) => {
                            handleExportXL("overall")
                            // fetchMaintentanceIndividual()
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>


            {/*Export pdf Data  */}
            {/* <Dialog open={isPdfFilterOpen} onClose={handleClosePdfFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
                    <IconButton
                        aria-label="close"
                        onClick={handleClosePdfFilterMod}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <PictureAsPdfIcon sx={{ fontSize: "80px", color: "red" }} />
                    <Typography variant="h5" sx={{ textAlign: "center" }}>
                        Choose Export
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        onClick={(e) => {
                            downloadPdf("filtered")
                            setIsPdfFilterOpen(false);
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button variant="contained"
                        onClick={(e) => {
                            downloadPdf("overall")
                            setIsPdfFilterOpen(false);
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog> */}



            {/* //individual */}

            {/* <Dialog open={isFilterOpennear} onClose={handleCloseFilterModnear} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>

                    <IconButton
                        aria-label="close"
                        onClick={handleCloseFilterModnear}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {fileFormat === 'xl' ?
                        <FaFileExcel style={{ fontSize: "70px", color: "green" }} />
                        : <FaFileCsv style={{ fontSize: "70px", color: "green" }} />
                    }
                    <Typography variant="h5" sx={{ textAlign: "center" }}>
                        Choose Export
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus variant="contained"
                        onClick={(e) => {
                            handleExportXLnear("filtered")
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button autoFocus variant="contained"
                        onClick={(e) => {
                            handleExportXLnear("overall")
                            // fetchMaintentanceIndividual()
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog> */}
            {/*Export pdf Data  */}
            {/* <Dialog open={isPdfFilterOpennear} onClose={handleClosePdfFilterModnear} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
                    <IconButton
                        aria-label="close"
                        onClick={handleClosePdfFilterModnear}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <PictureAsPdfIcon sx={{ fontSize: "80px", color: "red" }} />
                    <Typography variant="h5" sx={{ textAlign: "center" }}>
                        Choose Export
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        onClick={(e) => {
                            downloadPdfNear("filtered")
                            setIsPdfFilterOpennear(false);
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button variant="contained"
                        onClick={(e) => {
                            downloadPdfNear("overall")
                            setIsPdfFilterOpennear(false);
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog> */}

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
                filteredDataTwo={filteredDatas ?? []}
                itemsTwo={items ?? []}
                filename={"AssetIP Group"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            <ExportData
                isFilterOpen={isFilterOpennear}
                handleCloseFilterMod={handleCloseFilterModnear}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpennear}
                isPdfFilterOpen={isPdfFilterOpennear}
                setIsPdfFilterOpen={setIsPdfFilterOpennear}
                handleClosePdfFilterMod={handleClosePdfFilterModnear}
                filteredDataTwo={filteredDatasNearTatPrimary ?? []}
                itemsTwo={itemsneartat ?? []}
                filename={"AssetIP Individual"}
                exportColumnNames={exportColumnNamesNear}
                exportRowValues={exportRowValuesNear}
                componentRef={componentRefNear}
            />
            {/* INFO */}
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Asset Detail Info"
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
            <DeleteConfirmation
                open={isDeleteOpenNear}
                onClose={handleCloseModNear}
                onConfirm={delProjectNear}
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


        </Box >
    );
}

export default AssetMaterialIP;