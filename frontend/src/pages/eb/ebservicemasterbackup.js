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
import LoadingButton from "@mui/lab/LoadingButton";
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Popover,
    Select,
    TextareaAutosize,
    TextField,
    Typography,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
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
import PageHeading from "../../components/PageHeading";


function EbServiceMaster() {
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
        setloadingdeloverall(false);
    };
    const handleClosePopup = () => {
        setOpenPopup(false);
    };

    let exportColumnNames = [
        "Company",
        "Branch",
        "Unit",
        "Floor",
        "Area",
        "Servicenumber",
        "Vendorname",
        "Servicedate",
        "Eb Service Purpose",
        "Nick Name",
        "Open kwh",
        "Kvah",
        "Sectionid",
        "Sectionname",
        "Contractedload",
        "Powerfactor",
        "Meter type",
        "Billmonth",
        "Allowed Unit/Day",
        "Allowed Unit/Month",
        "Kw Rs",
        "Max dem",
        "Tax",
        "Phase",
        "Select CT/Non-CT Type",
        "Solar RTS",
        "Welding",
        "Billing Cycle",
        "Status",
        "Tariff",
    ];
    let exportRowValues = [
        "company",
        "branch",
        "unit",
        "floor",
        "area",
        "servicenumber",
        "vendor",
        "servicedate",
        "ebservicepurposes",
        "nickname",
        "openkwh",
        "kvah",
        "sectionid",
        "sectionname",
        "contractedload",
        "powerfactor",
        "metertype",
        "billmonth",
        "allowedunit",
        "allowedunitmonth",
        "kwrs",
        "maxdem",
        "tax",
        "phase",
        "selectCTtypes",
        "solars",
        "weldings",
        "billingcycles",
        "status",
        "tariff",
    ];

    const pathname = window.location.pathname;

    //Access Module

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("EB Services Master"),
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



    const [selectedRowsCat, setSelectedRowsCat] = useState([]);
    const [loadingdeloverall, setloadingdeloverall] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    let today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    let formattedDate = yyyy + "-" + mm + "-" + dd;

    const [ovProj, setOvProj] = useState("");
    const [ovProjCount, setOvProjCount] = useState("");
    const [getOverAllCount, setGetOverallCount] = useState("");

    const [ebservicemaster, setEbservicemaster] = useState({
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        floor: "Please Select Floor",
        area: "",
        vendor: "Please Select Vendor",
        servicenumber: "",
        servicedate: formattedDate,
        openkwh: "",
        kvah: "",
        sectionid: "",
        sectionname: "",
        contractedload: "",
        powerfactorpenality: "",
        metertype: "",
        billmonth: "Choose Month",
        allowedunit: "",
        allowedunitmonth: "",
        kwrs: "",
        maxdem: "",
        tax: "",
        phase: "",
        tariff: "",
        name: "",
        region: "",
        circle: "",
        distribution: "",
        number: "",
        address: "",
        meternumber: "",
        servicecategory: "",
        sdavailable: "",
        sdrefund: "",
        mcdavailable: "",
        mcdrefund: "",
        billperiod: "",
        metertype: "",
        renewalpenalty: "",
        powerfactor: "",
        ebservicepurposes: "Own",
        rentalcontact: "",
        selectCTtypes: "CT",
        solars: "NO",
        weldings: "NO",
        billingcycles: "Monthly",
        status: "LIVE",
        nickname: "",
        tenentname: "",
        rentaladdress: "",
    });

    const [ebservicemasterEdit, setEbservicemasterEdit] = useState({
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        floor: "Please Select Floor",
        area: "",
        vendor: "",
        servicenumber: "",
        servicedate: formattedDate,
        openkwh: "",
        kvah: "",
        sectionid: "",
        sectionname: "",
        contractedload: "",
        powerfactorpenality: "Choose Power Factor",
        metertype: "",
        billmonth: "Choose Month",
        allowedunit: "",
        allowedunitmonth: "",
        kwrs: "",
        maxdem: "",
        tax: "",
        phase: "",
        tariff: "",
        name: "",
        region: "",
        circle: "",
        distribution: "",
        number: "",
        address: "",
        meternumber: "",
        servicecategory: "",
        sdavailable: "",
        sdrefund: "",
        mcdavailable: "",
        mcdrefund: "",
        billperiod: "",
        metertype: "",
        renewalpenalty: "",
        powerfactor: "",
        ebservicepurposes: "Own",
        rentalcontact: "",
        selectCTtypes: "CT",
        solars: "NO",
        weldings: "NO",
        billingcycles: "Monthly",
        status: "LIVE",
        nickname: "",
        tenentname: "",
        rentaladdress: "",
    });
    const [billmonth, setBillmonth] = useState("Choose Month");
    const [powerfactorpenality, setPowerfactorpenality] = useState(
        "Choose Power Factor"
    );
    const [billmonthEdit, setBillmonthEdit] = useState("Choose Month");
    const [powerfactorpenalityEdit, setPowerfactorpenalityEdit] = useState(
        "Choose Power Factor"
    );
    const [vendordropdown, setVendordropdown] = useState([]);
    const [vendordropdownEdit, setVendordropdownEdit] = useState([]);

    const [ebservicepurposes, setEbservicepurposes] = useState("Own");
    const [ebservicepurposesEdit, setEbservicepurposesEdit] = useState("Own");
    const [selectCTtypes, setSelectCTtypes] = useState("CT");
    const [selectCTtypesEdit, setSelectCTtypesEdit] = useState("CT");
    const [solars, setSolars] = useState("NO");
    const [solarsEdit, setSolarsEdit] = useState("NO");
    const [weldings, setWeldings] = useState("NO");
    const [weldingsEdit, setWeldingsEdit] = useState("NO");
    const [billingcycles, setBillingcycles] = useState("Monthly");
    const [billingcyclesEdit, setBillingcyclesEdit] = useState("Monthly");
    const [status, setStatus] = useState("LIVE");
    const [statusEdit, setStatusEdit] = useState("LIVE");

    const handlechangRentalcontact = (e) => {
        const regex = /^[0-9]+$/;
        const inputValue = e.target.value?.slice(0, 10);
        if (regex.test(inputValue) || inputValue === "") {
            setEbservicemaster({ ...ebservicemaster, rentalcontact: inputValue });
        }
    };

    const handlechangRentalcontactEdit = (e) => {
        const regex = /^[0-9]+$/;
        const inputValue = e.target.value?.slice(0, 10);
        if (regex.test(inputValue) || inputValue === "") {
            setEbservicemasterEdit({
                ...ebservicemasterEdit,
                rentalcontact: inputValue,
            });
        }
    };

    const [floors, setFloors] = useState([]);
    const [areas, setAreas] = useState([]);
    const [newcheckbranch, setNewcheckBranch] = useState("Choose Branch");
    const [floorsEdit, setFloorEdit] = useState([]);
    const [areasEdit, setAreasEdit] = useState([]);
    const [ebservicemasters, setEbservicemasters] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const {
        isUserRoleCompare,
        isUserRoleAccess,
        isAssignBranch,
        allfloor,
        allareagrouping,
        pageName, setPageName
    } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [ebservicemasterCheck, setEbservicemastercheck] = useState(false);
    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [setCopiedData] = useState("");
    const [selectedOptionsCate, setSelectedOptionsCate] = useState([]);
    let [valueCate, setValueCate] = useState("");


    console.log(pageName, setPageName, "poagensdmae")


    const accessbranch = isAssignBranch
        ?.map((data) => ({
            branch: data.branch,
            company: data.company,
            unit: data.unit,
        }))
    // .filter((item, index, self) => {
    //   return (
    //     index ===
    //     self.findIndex(
    //       (i) => i.branch === item.branch && i.company === item.company
    //     )
    //   );
    // });

    const handleCategoryChange = (options) => {
        setValueCate(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCate(options);
    };

    const customValueRendererCate = (valueCate, _documents) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please Select Area";
    };

    // Edit functionlity
    const [selectedOptionsCateEdit, setSelectedOptionsCateEdit] = useState([]);

    const handleCategoryChangeEdit = (options) => {
        setSelectedOptionsCateEdit(options);
    };

    const customValueRendererCateEdit = (valueCateEdit, _documents) => {
        return valueCateEdit.length
            ? valueCateEdit.map(({ label }) => label).join(", ")
            : "Please Select Area";
    };

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Eb Service Master.png");
                });
            });
        }
    };
    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    // view model
    const [openview, setOpenview] = useState(false);

    const handleClickOpenview = () => {
        setOpenview(true);
    };

    const handleCloseview = () => {
        setOpenview(false);
    };

    // Error Popup model
    const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
    const [showAlertpop, setShowAlertpop] = useState();
    const handleClickOpenerrpop = () => {
        setIsErrorOpenpop(true);
    };
    const handleCloseerrpop = () => {
        setIsErrorOpenpop(false);
    };

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
        setloadingdeloverall(false);
    };

    //Delete model
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = () => {
        setIsDeleteOpen(false);
    };

    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

    // const handleClickOpenalert = async () => {
    //   let value = [...new Set(selectedRowsCat.flat())];

    //   if (selectedRows.length === 0) {
    //     setIsDeleteOpenalert(true);
    //   } else {
    //     const [resebuse, resebread, resebmaterial] = await Promise.all([
    //       axios.post(SERVICE.OVERALL_DELETE_EBUSEINSTRUMENT, {
    //         headers: {
    //           Authorization: `Bearer ${auth.APIToken}`,
    //         },
    //         checkebuse: value,
    //       }),
    //       axios.post(SERVICE.OVERALL_DELETE_EBREADING, {
    //         headers: {
    //           Authorization: `Bearer ${auth.APIToken}`,
    //         },
    //         checkebread: value,
    //       }),
    //       axios.post(SERVICE.OVERALL_DELETE_EBMATERIAL, {
    //         headers: {
    //           Authorization: `Bearer ${auth.APIToken}`,
    //         },
    //         checkebmaterial: value,
    //       }),
    //     ]);

    //     if (
    //       (resebuse?.data?.ebuse).length > 0 ||
    //       (resebread?.data?.ebread).length > 0 ||
    //       (resebmaterial?.data?.ebmaterial).length > 0
    //     ) {
    //       handleClickOpenCheckbulk();
    //       setOveraldeletecheck({
    //         ...overalldeletecheck,
    //         ebuse: resebuse?.data?.ebuse,
    //         ebread: resebread?.data?.ebread,
    //         ebmaterial: resebmaterial?.data?.ebmaterial,
    //       });
    //       setCheckuse([]);
    //       setCheckread([]);

    //       setCheckmaterial([]);
    //     } else {
    //       setIsDeleteOpencheckbox(true);
    //     }
    //   }
    // };



    const handleClickOpenalert = async () => {
        let value = [...new Set(selectedRowsCat.flat())]

        if (selectedRows.length === 0) {
            setIsDeleteOpenalert(true);
        } else {
            const [resebuse, resebread, resebmaterial] = await Promise.all([
                axios.post(SERVICE.OVERALL_DELETE_EBUSEINSTRUMENT, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    checkebuse: value,
                }),
                axios.post(SERVICE.OVERALL_DELETE_EBREADING, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    checkebread: value,
                }),
                axios.post(SERVICE.OVERALL_DELETE_EBMATERIAL, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    checkebmaterial: value,
                })
            ])

            setCheckuse(resebuse?.data?.ebuse)
            setCheckread(resebread?.data?.ebread)
            setCheckmaterial(resebmaterial?.data?.ebmaterial)

            let Ebuse = resebuse?.data?.ebuse.map(t => t.servicenumber).flat();
            let Ebread = resebread?.data?.ebread.map(t => t.servicenumber).flat();
            let Ebmaterial = resebmaterial?.data?.ebmaterial.map(t => t.servicenumber).flat();

            if ((resebuse?.data?.ebuse).length > 0 || (resebread?.data?.ebread).length > 0 || (resebmaterial?.data?.ebmaterial).length > 0) {
                handleClickOpenCheckbulk();
                // setOveraldeletecheck({ ...overalldeletecheck, ebuse: resebuse?.data?.ebuse, ebread: resebread?.data?.ebread, ebmaterial: resebmaterial?.data?.ebmaterial })
                setOveraldeletecheck({ ...overalldeletecheck, ebuse: [... new Set(Ebuse)], ebread: [...new Set(Ebread)], ebmaterial: [...new Set(Ebmaterial)] })

                setCheckuse([])
                setCheckread([])

                setCheckmaterial([])
            } else {
                setIsDeleteOpencheckbox(true);
            }
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
        if (selectedRows.includes(params.row.id)) {
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
        servicenumber: true,
        vendor: true,
        servicedate: true,
        ebservicepurposes: true,
        nickname: true,
        openkwh: true,
        kvah: true,
        sectionid: true,
        sectionname: true,
        contractedload: true,
        powerfactor: true,
        metertype: true,
        billmonth: true,
        allowedunit: true,
        allowedunitmonth: true,
        kwrs: true,
        maxdem: true,
        tax: true,
        phase: true,
        selectCTtypes: true,
        solars: true,
        weldings: true,
        status: true,
        billingcycles: true,
        tariff: true,
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };

    const fetchVendorData = async () => {
        try {
            let res_vendor = await axios.get(SERVICE.ALL_VENDOREB, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const vendorall = [
                ...res_vendor?.data?.vendoreb.map((d) => ({
                    ...d,
                    label: d.vendorname,
                    value: d.vendorname,
                })),
            ];

            setVendordropdown(vendorall);
            setVendordropdownEdit(vendorall);
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };
    const fetchFloor = async (e) => {
        let result = allfloor.filter(
            (d) => d.branch === e.value || d.branch === e.branch
        );

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
        let jiii = ji.map((data) => data);

        const all = ji.map((d) => ({
            ...d,
            label: d,
            value: d,
        }));

        setAreas(all);
        setAreasEdit(all);
    };

    const fetchAreaEdit = async (e) => {
        let floor = e.value ? e.value : e.floor;
        let result = allareagrouping
            .filter((d) => d.branch === e.branch && d.floor === floor)
            .map((data) => data.area);
        let ji = [].concat(...result);
        let jiii = ji.map((data) => data);

        const all = ji.map((d) => ({
            ...d,
            label: d,
            value: d,
        }));

        setAreasEdit(all);
    };

    useEffect(() => {
        fetchVendorData();
    }, []);

    const [deleteEbservice, setDeleteEbservice] = useState("");
    const [checkuse, setCheckuse] = useState([]);
    const [checkread, setCheckread] = useState([]);
    const [checkmaterial, setCheckmaterial] = useState([]);

    // const rowData = async (id, servicenumber) => {
    //   try {
    //     const [res, resebuse, resebread, resebmaterial] = await Promise.all([
    //       axios.get(`${SERVICE.EBSERVICEMASTER_SINGLE}/${id}`, {
    //         headers: {
    //           Authorization: `Bearer ${auth.APIToken}`,
    //         },
    //       }),
    //       axios.post(SERVICE.OVERALL_DELETE_EBUSEINSTRUMENT, {
    //         headers: {
    //           Authorization: `Bearer ${auth.APIToken}`,
    //         },
    //         checkebuse: [servicenumber],
    //       }),
    //       axios.post(SERVICE.OVERALL_DELETE_EBREADING, {
    //         headers: {
    //           Authorization: `Bearer ${auth.APIToken}`,
    //         },
    //         checkebread: [servicenumber],
    //       }),
    //       axios.post(SERVICE.OVERALL_DELETE_EBMATERIAL, {
    //         headers: {
    //           Authorization: `Bearer ${auth.APIToken}`,
    //         },
    //         checkebmaterial: [servicenumber],
    //       }),
    //     ]);
    //     setDeleteEbservice(res?.data?.sebservicemaster);
    //     setCheckuse(resebuse?.data?.ebuse);
    //     setCheckread(resebread?.data?.ebread);
    //     setCheckmaterial(resebmaterial?.data?.ebmaterial);

    //     if (
    //       (resebuse?.data?.ebuse).length > 0 ||
    //       (resebread?.data?.ebread).length > 0 ||
    //       (resebmaterial?.data?.ebmaterial).length > 0
    //     ) {
    //       handleClickOpenCheck();
    //     } else {
    //       handleClickOpen();
    //     }
    //   } catch (err) {
    //     handleApiError(err, setShowAlert, handleClickOpenerr);
    //   }
    // };

    // Alert delete popup


    const rowData = async (id, servicenumber) => {
        setPageName(!pageName)
        try {
            const [res, resebuse, resebread, resebmaterial] = await Promise.all([
                axios.get(`${SERVICE.EBSERVICEMASTER_SINGLE}/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                }),
                axios.post(SERVICE.OVERALL_DELETE_EBUSEINSTRUMENT, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    checkebuse: [servicenumber],
                }),
                axios.post(SERVICE.OVERALL_DELETE_EBREADING, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    checkebread: [servicenumber],
                }),
                axios.post(SERVICE.OVERALL_DELETE_EBMATERIAL, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    checkebmaterial: [servicenumber],
                })
            ])
            setDeleteEbservice(res?.data?.sebservicemaster);
            setCheckuse(resebuse?.data?.ebuse);
            setCheckread(resebread?.data?.ebread);
            setCheckmaterial(resebmaterial?.data?.ebmaterial);

            if ((resebuse?.data?.ebuse).length > 0 || (resebread?.data?.ebread).length > 0 || (resebmaterial?.data?.ebmaterial).length > 0) {
                handleClickOpenCheck();
            } else {
                handleClickOpen();
            }
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }

    let Ebservicessid = deleteEbservice?._id;


    const delEbservice = async () => {
        setPageName(!pageName)
        try {
            if (Ebservicessid) {
                await axios.delete(
                    `${SERVICE.EBSERVICEMASTER_SINGLE}/${Ebservicessid}`,
                    {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                    }
                );
                await fetchEbservicemaster();
                handleCloseMod();
                setSelectedRows([]);
                setPage(1);
            }

            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    const delEbservicecheckbox = async () => {
        setPageName(!pageName)
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.EBSERVICEMASTER_SINGLE}/${item}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
            });

            // Wait for all delete requests to complete
            await Promise.all(deletePromises);
            handleCloseModcheckbox();
            setSelectedRows([]);
            setSelectAllChecked(false);
            setPage(1);
            await fetchEbservicemaster();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    const delEbservicecheckboxWithoutLink = async () => {
        try {
            let valfilter = [
                ...overalldeletecheck.ebuse,
                ...overalldeletecheck.ebread,
                ...overalldeletecheck.ebmaterial,
            ];

            let filtered = rowDataTable.filter(d => !valfilter.some(item => d.servicenumber === item))?.flatMap(d => selectedRows?.filter(item => d.id === item));

            const deletePromises = filtered?.map((item) => {
                return axios.delete(`${SERVICE.EBSERVICEMASTER_SINGLE}/${item}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
            });

            // Wait for all delete requests to complete
            await Promise.all(deletePromises);

            handlebulkCloseCheck();
            setSelectedRows([]);
            setSelectAllChecked(false);
            setPage(1);

            await fetchEbservicemaster();
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };


    const getLinkedLabelItem = (overalldeletecheck) => {
        const { ebuse = [], ebread = [], ebmaterial = [] } = overalldeletecheck;
        const labels = [];

        ebuse.forEach(item => labels.push(item));
        ebread.forEach(item => labels.push(item));
        ebmaterial.forEach(item => labels.push(item));

        // Remove duplicates using a Set
        const uniqueLabels = [...new Set(labels)];

        return uniqueLabels.join(", ");
    };

    const getLinkedLabel = (overalldeletecheck) => {
        const { ebuse = [], ebread = [], ebmaterial = [] } = overalldeletecheck;
        const labels = [];

        if (ebuse.length > 0) labels.push("EbuseInstrument");
        if (ebread.length > 0) labels.push("Ebreading");
        if (ebmaterial.length > 0) labels.push("EbMaterialuse");

        return labels.join(", ");
    };

    const getFilteredUnits = (ebservicemasters, selectedRows, overalldeletecheck) => {
        const { ebuse = [], ebread = [], ebmaterial = [] } = overalldeletecheck;
        const allConditions = [...new Set([...ebuse, ...ebread, ...ebmaterial])];

        return ebservicemasters.filter(d => selectedRows?.includes(d._id) && !allConditions.includes(d.servicenumber));
    };

    const shouldShowDeleteMessage = (ebservicemasters, selectedRows, overalldeletecheck) => {
        return getFilteredUnits(ebservicemasters, selectedRows, overalldeletecheck).length > 0;
    };

    const shouldEnableOkButton = (ebservicemasters, selectedRows, overalldeletecheck) => {
        return getFilteredUnits(ebservicemasters, selectedRows, overalldeletecheck).length === 0;
    };

    //add function
    const sendRequest = async () => {
        setPageName(!pageName)
        try {
            let subprojectscreate = await axios.post(SERVICE.EBSERVICEMASTER_CREATE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company: String(ebservicemaster.company),
                branch: String(ebservicemaster.branch),
                unit: String(ebservicemaster.unit),
                floor: String(ebservicemaster.floor),
                area: [...valueCate],
                vendor: String(ebservicemaster.vendor === "Please Select Vendor" ? "" : ebservicemaster.vendor),
                servicenumber: String(ebservicemaster.servicenumber),
                servicedate: String(ebservicemaster.servicedate),
                openkwh: String(ebservicemaster.openkwh),
                kvah: String(ebservicemaster.kvah),
                sectionid: String(ebservicemaster.sectionid),
                sectionname: String(ebservicemaster.sectionname),
                contractedload: String(ebservicemaster.contractedload),
                powerfactor: String(ebservicemaster.powerfactor),
                metertype: String(ebservicemaster.metertype),
                billmonth: String(billmonth === "Choose Month" ? "" : billmonth),
                allowedunit: String(ebservicemaster.allowedunit),
                allowedunitmonth: String(ebservicemaster.allowedunitmonth),
                kwrs: String(ebservicemaster.kwrs),
                maxdem: String(ebservicemaster.maxdem),
                tax: String(ebservicemaster.tax),
                phase: String(ebservicemaster.phase),
                tariff: String(ebservicemaster.tariff),
                name: String(ebservicemaster.name),
                region: String(ebservicemaster.region),
                circle: String(ebservicemaster.circle),
                distribution: String(ebservicemaster.distribution),
                number: String(ebservicemaster.number),
                address: String(ebservicemaster.address),
                meternumber: String(ebservicemaster.meternumber),
                servicecategory: String(ebservicemaster.servicecategory),
                sdavailable: String(ebservicemaster.sdavailable),
                sdrefund: String(ebservicemaster.sdrefund),
                mcdavailable: String(ebservicemaster.mcdavailable),
                mcdrefund: String(ebservicemaster.mcdrefund),
                billperiod: String(ebservicemaster.billperiod),
                metertype: String(ebservicemaster.metertype),
                renewalpenalty: String(ebservicemaster.renewalpenalty),
                powerfactorpenality: String(powerfactorpenality),
                ebservicepurposes: String(ebservicepurposes),
                tenentname: String(ebservicemaster.tenentname),
                rentaladdress: String(ebservicemaster.rentaladdress),
                rentalcontact: String(ebservicemaster.rentalcontact),
                nickname: String(ebservicemaster.nickname),
                selectCTtypes: String(selectCTtypes),
                solars: String(solars),
                weldings: String(weldings),
                billingcycles: String(billingcycles),
                status: String(status),

                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchEbservicemaster();
            setEbservicemaster({
                ...ebservicemaster,
                servicenumber: "",
                servicedate: formattedDate,
                openkwh: "",
                kvah: "",
                sectionid: "",
                sectionname: "",
                contractedload: "",
                powerfactorpenality: "Choose Power Factor",
                metertype: "",
                billmonth: "Choose Month",
                allowedunit: "",
                allowedunitmonth: "",
                kwrs: "",
                maxdem: "",
                tax: "",
                phase: "",
                tariff: "",
                name: "",
                region: "",
                circle: "",
                distribution: "",
                number: "",
                address: "",
                meternumber: "",
                servicecategory: "",
                sdavailable: "",
                sdrefund: "",
                mcdavailable: "",
                mcdrefund: "",
                powerfactor: "",
                billperiod: "",
                metertype: "",
                renewalpenalty: "",
                ebservicepurposes: "Own",
                rentalcontact: "",
                selectCTtypes: "CT",
                solars: "NO",
                weldings: "NO",
                billingcycles: "Monthly",
                status: "LIVE",
                nickname: "",
                tenentname: "",
                rentaladdress: "",
            });
            setBillmonth("Choose Month");
            setPowerfactorpenality("Choose Power Factor");
            setEbservicepurposes("Own");
            setSelectCTtypes("CT");
            setSolars("NO");
            setWeldings("NO");
            setBillingcycles("Monthly");
            setStatus("LIVE");
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    //submit option for saving
    const handleSubmit = (e) => {
        setPageName(!pageName)
        setloadingdeloverall(true);
        e.preventDefault();
        let areas = selectedOptionsCate.map((item) => item.value);
        const isNameMatch = ebservicemasters.some(
            (item) =>
                item.company === String(ebservicemaster.company) &&
                item.branch === String(ebservicemaster.branch) &&
                item.unit === String(ebservicemaster.unit) &&
                item.floor === String(ebservicemaster.floor) &&
                item.servicenumber == String(ebservicemaster.servicenumber) &&
                item.servicedate == String(ebservicemaster.servicedate) &&
                // item.vendor === String(ebservicemaster.vendor) &&
                item.area.some((data) => areas.includes(data))
        );

        if (ebservicemaster.company === "Please Select Company") {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (ebservicemaster.branch === "Please Select Branch") {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (ebservicemaster.unit === "Please Select Unit") {
            setPopupContentMalert("Please Select Unit!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (ebservicemaster.floor === "Please Select Floor") {
            setPopupContentMalert("Please Select Floor!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (selectedOptionsCate.length == 0) {
            setPopupContentMalert("Please Select Area!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (ebservicemaster.servicenumber === "") {
            setPopupContentMalert("Please Enter ServiceNumber!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (ebservicemaster.servicedate === "") {
            setPopupContentMalert("Please Select Service Date!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (isNameMatch) {
            setPopupContentMalert("Data Already Exists!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            sendRequest();
        }
    };

    const handleClear = (e) => {
        e.preventDefault();
        setEbservicemaster({
            company: "Please Select Company",
            branch: "Please Select Branch",
            unit: "Please Select Unit",
            floor: "Please Select Floor",
            area: "",
            vendor: "Please Select Vendor",
            servicenumber: "",
            servicedate: formattedDate,
            openkwh: "",
            kvah: "",
            sectionid: "",
            sectionname: "",
            contractedload: "",
            powerfactorpenality: "Choose Power Factor",
            metertype: "",
            billmonth: "Choose Month",
            allowedunit: "",
            allowedunitmonth: "",
            kwrs: "",
            maxdem: "",
            tax: "",
            phase: "",
            tariff: "",
            name: "",
            region: "",
            circle: "",
            distribution: "",
            number: "",
            address: "",
            meternumber: "",
            servicecategory: "",
            sdavailable: "",
            sdrefund: "",
            mcdavailable: "",
            mcdrefund: "",
            billperiod: "",
            metertype: "",
            renewalpenalty: "",
            ebservicepurposes: "Own",
            rentalcontact: "",
            selectCTtypes: "CT",
            solars: "NO",
            weldings: "NO",
            billingcycles: "Monthly",
            status: "LIVE",
            nickname: "",
            tenentname: "",
            rentaladdress: "",
        });
        setBillmonth("Choose Month");
        setPowerfactorpenality("Choose Power Factor");

        setFloors([]);
        setAreas([]);
        setSelectedOptionsCate([]);
        setEbservicepurposes("Own");
        setSelectCTtypes("CT");
        setSolars("NO");
        setWeldings("NO");
        setBillingcycles("Monthly");
        setStatus("LIVE");
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };

    //Edit model...
    const [isEditOpen, setIsEditOpen] = useState(false);
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
    };
    //check delete model
    const [isCheckOpen, setisCheckOpen] = useState(false);
    const [overalldeletecheck, setOveraldeletecheck] = useState({
        ebuse: [],
        ebread: [],
        ebmaterial: [],
    });
    const handleClickOpenCheck = () => {
        setisCheckOpen(true);
    };
    const handleCloseCheck = () => {
        setisCheckOpen(false);
    };

    //check delete model
    const [isbulkCheckOpen, setisCheckOpenbulk] = useState(false);
    const handleClickOpenCheckbulk = () => {
        setisCheckOpenbulk(true);
    };
    const handlebulkCloseCheck = () => {
        setSelectedRows([]);
        setSelectedRowsCat([]);
        setisCheckOpenbulk(false);
        setSelectAllChecked(false);
    };
    // info model
    const [openInfo, setOpeninfo] = useState(false);

    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };

    const handleCloseinfo = () => {
        setOpeninfo(false);
    };
    //get single row to edit....
    const getCode = async (e, servicenumber) => {
        try {
            let res = await axios.get(`${SERVICE.EBSERVICEMASTER_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setEbservicemasterEdit(res?.data?.sebservicemaster);
            setBillmonthEdit(res?.data?.sebservicemaster.billmonth);
            setPowerfactorpenalityEdit(
                res?.data?.sebservicemaster.powerfactorpenality
            );
            setNewcheckBranch(res?.data?.sebservicemaster?.branch);
            fetchFloor(res?.data?.sebservicemaster);

            fetchAreaEdit(res?.data?.sebservicemaster);
            setSelectedOptionsCateEdit(
                res?.data?.sebservicemaster.area.map((item) => ({
                    ...item,
                    label: item,
                    value: item,
                }))
            );

            setEbservicepurposesEdit(res?.data?.sebservicemaster.ebservicepurposes);
            setSelectCTtypesEdit(res?.data?.sebservicemaster.selectCTtypes);
            setSolarsEdit(res?.data?.sebservicemaster.solars);
            setWeldingsEdit(res?.data?.sebservicemaster.weldings);
            setBillingcyclesEdit(res?.data?.sebservicemaster.billingcycles);
            setStatusEdit(res?.data?.sebservicemaster.status);
            setOvProj(servicenumber);
            getOverallEditSection(servicenumber);
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    // get single row to view....
    const getviewCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.EBSERVICEMASTER_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setEbservicemasterEdit(res?.data?.sebservicemaster);
            setBillmonthEdit(res?.data?.sebservicemaster.billmonth);
            setPowerfactorpenalityEdit(
                res?.data?.sebservicemaster.powerfactorpenality
            );
            setNewcheckBranch(res?.data?.sebservicemaster?.branch);
            fetchFloor(res?.data?.sebservicemaster);

            fetchAreaEdit(res?.data?.sebservicemaster);
            setEbservicepurposesEdit(res?.data?.sebservicemaster?.ebservicepurposes);
            setSelectCTtypesEdit(res?.data?.sebservicemaster?.selectCTtypes);
            setSolarsEdit(res?.data?.sebservicemaster?.solars);
            setWeldingsEdit(res?.data?.sebservicemaster?.weldings);
            setBillingcyclesEdit(res?.data?.sebservicemaster?.billingcycles);
            setStatusEdit(res?.data?.sebservicemaster?.status);
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };
    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.EBSERVICEMASTER_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setEbservicemasterEdit(res?.data?.sebservicemaster);
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };
    //Project updateby edit page...
    let updateby = ebservicemasterEdit?.updatedby;
    let addedby = ebservicemasterEdit?.addedby;
    let subprojectsid = ebservicemasterEdit?._id;
    //overall edit section for all pages
    const getOverallEditSection = async (e) => {
        try {
            let res = await axios.post(SERVICE.OVERALL_EDIT_EBSERVICEMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                oldname: e,
            });
            setOvProjCount(res?.data?.count);
            setGetOverallCount(`The ${e} is linked in
     ${res?.data?.ebuse?.length > 0 ? "Eb Useinstrument ," : ""}
     ${res?.data?.ebread?.length > 0 ? "Eb Reading ," : ""}
    ${res?.data?.ebmaterial?.length > 0 ? "Eb Materialuse" : ""
                } whether you want to do changes ..??`);
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    //overall edit section for all pages
    const getOverallEditSectionUpdate = async () => {
        try {
            let res = await axios.post(SERVICE.OVERALL_EDIT_EBSERVICEMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                oldname: ovProj,
            });
            sendEditRequestOverall(
                res?.data?.ebuse,
                res?.data?.ebread,
                res?.data?.ebmaterial
            );
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    const sendEditRequestOverall = async (ebuse, ebread, ebmaterial) => {
        try {
            if (ebuse.length > 0) {
                let answ = ebuse.map((d, i) => {
                    let res = axios.put(`${SERVICE.SINGLE_EBUSEINSTRUMENTS}/${d._id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        servicenumber: String(ebservicemasterEdit.servicenumber),
                    });
                });
            }
            if (ebread.length > 0) {
                let answ = ebread.map((d, i) => {
                    let res = axios.put(`${SERVICE.EBREADINGDETAIL_SINGLE}/${d._id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        servicenumber: String(ebservicemasterEdit.servicenumber),
                    });
                });
            }
            if (ebmaterial.length > 0) {
                let answ = ebmaterial.map((d, i) => {
                    let res = axios.put(`${SERVICE.EBMATERIALDETAILS_SINGLE}/${d._id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        servicenumber: String(ebservicemasterEdit.servicenumber),
                    });
                });
            }
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    //editing the single data...
    const sendEditRequest = async () => {
        setPageName(!pageName)
        let employ = selectedOptionsCateEdit.map((item) => item.value);
        try {
            let res = await axios.put(
                `${SERVICE.EBSERVICEMASTER_SINGLE}/${subprojectsid}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    company: String(ebservicemasterEdit.company),
                    branch: String(ebservicemasterEdit.branch),
                    unit: String(ebservicemasterEdit.unit),
                    floor: String(ebservicemasterEdit.floor),
                    area: [...employ],
                    vendor: String(ebservicemasterEdit.vendor),
                    servicenumber: String(ebservicemasterEdit.servicenumber),
                    servicedate: String(ebservicemasterEdit.servicedate),
                    openkwh: String(ebservicemasterEdit.openkwh),
                    kvah: String(ebservicemasterEdit.kvah),
                    sectionid: String(ebservicemasterEdit.sectionid),
                    sectionname: String(ebservicemasterEdit.sectionname),
                    contractedload: String(ebservicemasterEdit.contractedload),
                    powerfactor: String(ebservicemasterEdit.powerfactor),
                    metertype: String(ebservicemasterEdit.metertype),
                    billmonth: String(billmonthEdit),
                    allowedunit: String(ebservicemasterEdit.allowedunit),
                    allowedunitmonth: String(ebservicemasterEdit.allowedunitmonth),
                    kwrs: String(ebservicemasterEdit.kwrs),
                    maxdem: String(ebservicemasterEdit.maxdem),
                    tax: String(ebservicemasterEdit.tax),
                    phase: String(ebservicemasterEdit.phase),
                    tariff: String(ebservicemasterEdit.tariff),
                    name: String(ebservicemasterEdit.name),
                    region: String(ebservicemasterEdit.region),
                    circle: String(ebservicemasterEdit.circle),
                    distribution: String(ebservicemasterEdit.distribution),
                    number: String(ebservicemasterEdit.number),
                    address: String(ebservicemasterEdit.address),
                    meternumber: String(ebservicemasterEdit.meternumber),
                    servicecategory: String(ebservicemasterEdit.servicecategory),
                    sdavailable: String(ebservicemasterEdit.sdavailable),
                    sdrefund: String(ebservicemasterEdit.sdrefund),
                    mcdavailable: String(ebservicemasterEdit.mcdavailable),
                    mcdrefund: String(ebservicemasterEdit.mcdrefund),
                    billperiod: String(ebservicemasterEdit.billperiod),
                    metertype: String(ebservicemasterEdit.metertype),
                    renewalpenalty: String(ebservicemasterEdit.renewalpenalty),
                    powerfactorpenality: String(powerfactorpenalityEdit),
                    ebservicepurposes: String(ebservicepurposesEdit),
                    tenentname: String(ebservicemasterEdit.tenentname),
                    rentaladdress: String(ebservicemasterEdit.rentaladdress),
                    rentalcontact: String(ebservicemasterEdit.rentalcontact),
                    nickname: String(ebservicemasterEdit.nickname),
                    selectCTtypes: String(selectCTtypesEdit),
                    solars: String(solarsEdit),
                    weldings: String(weldingsEdit),
                    billingcycles: String(billingcyclesEdit),
                    status: String(statusEdit),

                    updatedby: [
                        ...updateby,
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                }
            );
            await fetchEbservicemaster();
            handleCloseModEdit();
            getOverallEditSectionUpdate();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };


    const editSubmit = async (e) => {
        setPageName(!pageName)
        e.preventDefault();
        let resdata = await fetchEbservicemasterAll();
        let areasEditt = selectedOptionsCateEdit.map((item) => item.value);
        const isNameMatch = resdata.some(
            (item) =>
                item.company === String(ebservicemasterEdit.company) &&
                item.branch === String(ebservicemasterEdit.branch) &&
                item.unit === String(ebservicemasterEdit.unit) &&
                item.floor === String(ebservicemasterEdit.floor) &&
                item.servicenumber == String(ebservicemasterEdit.servicenumber) &&
                item.servicedate == String(ebservicemasterEdit.servicedate) &&
                item.area.some((data) => areasEditt.includes(data))
        );
        if (ebservicemasterEdit.company === "Please Select Company") {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (ebservicemasterEdit.branch === "Please Select Branch") {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (ebservicemasterEdit.unit === "Please Select Unit") {
            setPopupContentMalert("Please Select Unit!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (ebservicemasterEdit.floor === "Please Select Floor") {
            setPopupContentMalert("Please Select Floor!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (selectedOptionsCateEdit.length == 0) {
            setPopupContentMalert("Please Select Area!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (ebservicemasterEdit.servicenumber === "") {
            setPopupContentMalert("Please Enter ServiceNumber!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (ebservicemasterEdit.servicedate === "") {
            setPopupContentMalert("Please Select Service Date!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (ebservicemasterEdit.servicenumber != ovProj && ovProjCount > 0) {
            setShowAlertpop(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{getOverAllCount}</p>
                </>
            );
            handleClickOpenerrpop();
        } else if (isNameMatch) {
            setPopupContentMalert("Data Already Exists!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            sendEditRequest();
        }
    };

    //get all Sub vendormasters.
    const fetchEbservicemaster = async () => {
        setPageName(!pageName)
        setEbservicemastercheck(true);

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
                let res_vendor = await axios.post(SERVICE.EBSERVICEMASTER, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    assignbranch: accessbranch,
                });

                setEbservicemasters(res_vendor?.data?.ebservicemasters);
                setEbservicemastercheck(false);


            } catch (err) {
                setEbservicemastercheck(false);
                handleApiError(err, setShowAlert, handleClickOpenerr);
            }
        }
        else {
            setEbservicemastercheck(true)
            setEbservicemasters([]);
        }
    }

    //get all Sub vendormasters.
    const fetchEbservicemasterAll = async () => {
        try {
            let res_meet = await axios.post(SERVICE.EBSERVICEMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                assignbranch: accessbranch,
            });
            return res_meet?.data?.ebservicemasters.filter(
                (item) => item?._id !== ebservicemasterEdit?._id
            );
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Eb Service Master",
        pageStyle: "print",
    });

    useEffect(() => {
        fetchEbservicemaster();
    }, []);

    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    const [items, setItems] = useState([]);

    const addSerialNumber = () => {
        const itemsWithSerialNumber = ebservicemasters?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
            servicedate: moment(item?.servicedate).format("DD/MM/YYYY"),
            powerfactor: item.powerfactor === "Choose Power Factor" ? "" : item.powerfactor,
            billmonth: item.billmonth === "Choose Month" ? "" : item.billmonth,
        }));
        setItems(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumber();
    }, [ebservicemasters]);

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

    const totalPages = Math.ceil(filteredDatas.length / pageSize);

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

    const [selectAllChecked, setSelectAllChecked] = useState(false);

    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
        </div>
    );

    const columnDataTable = [
        // {
        //   field: "checkbox",
        //   headerName: "Checkbox",
        //   headerStyle: {
        //     fontWeight: "bold",
        //   },
        //   renderHeader: (params) => (
        //     <CheckboxHeader
        //       selectAllChecked={selectAllChecked}
        //       onSelectAll={() => {
        //         if (rowDataTable.length === 0) {
        //           return;
        //         }
        //         if (selectAllChecked) {
        //           setSelectedRows([]);
        //           setSelectedRowsCat([]);
        //         } else {
        //           const allRowIds = rowDataTable.map((row) => row.id);
        //           const allRowIdsCat = rowDataTable.map((row) => row.servicenumber);
        //           setSelectedRows(allRowIds);
        //           setSelectedRowsCat(allRowIdsCat);
        //         }
        //         setSelectAllChecked(!selectAllChecked);
        //       }}
        //     />
        //   ),
        //   renderCell: (params) => (
        //     <Checkbox
        //       checked={selectedRows.includes(params.row.id)}
        //       onChange={() => {
        //         let updatedSelectedRows;
        //         let updatedSelectedRowsCat;

        //         if (selectedRows.includes(params.row.id)) {
        //           updatedSelectedRows = selectedRows.filter(
        //             (selectedId) => selectedId !== params.row.id
        //           );
        //           updatedSelectedRowsCat = selectedRowsCat.filter(
        //             (selectedId) => selectedId !== params.row.servicenumber
        //           );
        //         } else {
        //           updatedSelectedRows = [...selectedRows, params.row.id];
        //           updatedSelectedRowsCat = [
        //             ...selectedRowsCat,
        //             params.row.servicenumber,
        //           ];
        //         }
        //         setSelectedRows(updatedSelectedRows);
        //         setSelectedRowsCat(updatedSelectedRowsCat);

        //         setSelectAllChecked(
        //           updatedSelectedRows.length === filteredData.length
        //         );
        //       }}
        //     />
        //   ),
        //   sortable: false, // Optionally, you can make this column not sortable
        //   width: 90,
        //   hide: !columnVisibility.checkbox,
        //   headerClassName: "bold-header",
        // },

        {
            field: "checkbox",
            headerName: "Checkbox",
            headerStyle: {
                fontWeight: "bold",
            },
            renderHeader: (params) => (
                <CheckboxHeader
                    selectAllChecked={selectAllChecked}
                    onSelectAll={() => {
                        if (rowDataTable.length === 0) {
                            return;
                        }
                        if (selectAllChecked) {
                            setSelectedRows([]);
                            setSelectedRowsCat([]);

                        } else {
                            const allRowIds = rowDataTable.map((row) => row.id);
                            const allRowIdsCat = rowDataTable.map((row) => row.servicenumber);
                            setSelectedRows(allRowIds);
                            setSelectedRowsCat(allRowIdsCat);
                        }
                        setSelectAllChecked(!selectAllChecked);
                    }}
                />
            ),
            renderCell: (params) => (
                <Checkbox
                    checked={selectedRows.includes(params.row.id)}
                    onChange={() => {
                        let updatedSelectedRows;
                        let updatedSelectedRowsCat;

                        if (selectedRows.includes(params.row.id)) {
                            updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.row.id);
                            updatedSelectedRowsCat = selectedRowsCat.filter((selectedId) => selectedId !== params.row.servicenumber);

                        } else {
                            updatedSelectedRows = [...selectedRows, params.row.id];
                            updatedSelectedRowsCat = [...selectedRowsCat, params.row.servicenumber];

                        }
                        setSelectedRows(updatedSelectedRows);
                        setSelectedRowsCat(updatedSelectedRowsCat);


                        setSelectAllChecked(updatedSelectedRows.length === filteredData.length);
                    }}
                />
            ),
            sortable: false, // Optionally, you can make this column not sortable
            width: 90,
            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
        },

        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 80,
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
            field: "servicenumber",
            headerName: "Service Number",
            flex: 0,
            width: 100,
            hide: !columnVisibility.servicenumber,
            headerClassName: "bold-header",
        },
        {
            field: "vendor",
            headerName: "Vendorname",
            flex: 0,
            width: 100,
            hide: !columnVisibility.vendor,
            headerClassName: "bold-header",
        },
        {
            field: "servicedate",
            headerName: "Service Date",
            flex: 0,
            width: 100,
            hide: !columnVisibility.servicedate,
            headerClassName: "bold-header",
        },
        {
            field: "ebservicepurposes",
            headerName: "Eb Service Purpose",
            flex: 0,
            width: 100,
            hide: !columnVisibility.ebservicepurposes,
            headerClassName: "bold-header",
        },
        {
            field: "nickname",
            headerName: "Nick Name",
            flex: 0,
            width: 100,
            hide: !columnVisibility.nickname,
            headerClassName: "bold-header",
        },
        {
            field: "openkwh",
            headerName: "Open Kwh",
            flex: 0,
            width: 100,
            hide: !columnVisibility.openkwh,
            headerClassName: "bold-header",
        },
        {
            field: "kvah",
            headerName: "Kvah",
            flex: 0,
            width: 100,
            hide: !columnVisibility.kvah,
            headerClassName: "bold-header",
        },
        {
            field: "sectionid",
            headerName: "Sectionid",
            flex: 0,
            width: 100,
            hide: !columnVisibility.sectionid,
            headerClassName: "bold-header",
        },
        {
            field: "sectionname",
            headerName: "Section Name",
            flex: 0,
            width: 100,
            hide: !columnVisibility.sectionname,
            headerClassName: "bold-header",
        },
        {
            field: "contractedload",
            headerName: "Contracted load",
            flex: 0,
            width: 100,
            hide: !columnVisibility.contractedload,
            headerClassName: "bold-header",
        },
        {
            field: "powerfactor",
            headerName: "Power Factor",
            flex: 0,
            width: 100,
            hide: !columnVisibility.powerfactor,
            headerClassName: "bold-header",
        },
        {
            field: "metertype",
            headerName: "Meter Type",
            flex: 0,
            width: 100,
            hide: !columnVisibility.metertype,
            headerClassName: "bold-header",
        },
        {
            field: "billmonth",
            headerName: "Bill Month",
            flex: 0,
            width: 100,
            hide: !columnVisibility.billmonth,
            headerClassName: "bold-header",
        },
        {
            field: "allowedunit",
            headerName: "Allowed Unit/Day",
            flex: 0,
            width: 100,
            hide: !columnVisibility.allowedunit,
            headerClassName: "bold-header",
        },
        {
            field: "allowedunitmonth",
            headerName: "Allowed Unit/Month",
            flex: 0,
            width: 100,
            hide: !columnVisibility.allowedunitmonth,
            headerClassName: "bold-header",
        },
        {
            field: "kwrs",
            headerName: "Kw Rs",
            flex: 0,
            width: 100,
            hide: !columnVisibility.kwrs,
            headerClassName: "bold-header",
        },
        {
            field: "maxdem",
            headerName: "Max Demand %",
            flex: 0,
            width: 100,
            hide: !columnVisibility.maxdem,
            headerClassName: "bold-header",
        },
        {
            field: "tax",
            headerName: "Tax",
            flex: 0,
            width: 100,
            hide: !columnVisibility.tax,
            headerClassName: "bold-header",
        },
        {
            field: "phase",
            headerName: "Phase",
            flex: 0,
            width: 100,
            hide: !columnVisibility.phase,
            headerClassName: "bold-header",
        },
        {
            field: "selectCTtypes",
            headerName: "Select CT/Non-CT Type",
            flex: 0,
            width: 100,
            hide: !columnVisibility.selectCTtypes,
            headerClassName: "bold-header",
        },
        {
            field: "solars",
            headerName: "Solar RTS",
            flex: 0,
            width: 100,
            hide: !columnVisibility.solars,
            headerClassName: "bold-header",
        },
        {
            field: "weldings",
            headerName: "Welding",
            flex: 0,
            width: 100,
            hide: !columnVisibility.weldings,
            headerClassName: "bold-header",
        },
        {
            field: "billingcycles",
            headerName: "Billing Cycle",
            flex: 0,
            width: 100,
            hide: !columnVisibility.billingcycles,
            headerClassName: "bold-header",
        },
        {
            field: "status",
            headerName: "Status",
            flex: 0,
            width: 100,
            hide: !columnVisibility.status,
            headerClassName: "bold-header",
        },
        {
            field: "tariff",
            headerName: "Tariff",
            flex: 0,
            width: 100,
            hide: !columnVisibility.tariff,
            headerClassName: "bold-header",
        },

        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 250,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            renderCell: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("eebservicemaster") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                handleClickOpenEdit();
                                getCode(params.row.id, params.row.servicenumber);
                            }}
                        >
                            <EditOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("debservicemaster") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.row.id, params.row.servicenumber);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vebservicemaster") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                handleClickOpenview();
                                getviewCode(params.row.id);
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("iebservicemaster") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                handleClickOpeninfo();
                                getinfoCode(params.row.id);
                            }}
                        >
                            <InfoOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                </Grid>
            ),
        },
    ];

    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            company: item.company === "Please Select Company" ? "" : item.company,
            branch: item.branch === "Please Select Branch" ? "" : item.branch,
            unit: item.unit === "Please Select Unit" ? "" : item.unit,
            floor: item.floor === "Please Select Floor" ? "" : item.floor,
            area: item.area.join(",").toString(),
            servicenumber: item.servicenumber,
            vendor: item.vendor === "Please Select Vendor" ? "" : item.vendor,
            servicedate: item?.servicedate,
            ebservicepurposes: item.ebservicepurposes,
            nickname: item.nickname,
            openkwh: item.openkwh,
            kvah: item.kvah,
            sectionid: item.sectionid,
            sectionname: item.sectionname,
            contractedload: item.contractedload,
            powerfactor: item.powerfactor,
            metertype: item.metertype,
            billmonth: item.billmonth,
            allowedunit: item.allowedunit,
            allowedunitmonth: item.allowedunitmonth,
            kwrs: item.kwrs,
            maxdem: item.maxdem,
            tax: item.tax,
            phase: item.phase,
            selectCTtypes: item.selectCTtypes,
            solars: item.solars,
            weldings: item.weldings,
            status: item.status,
            billingcycles: item.billingcycles,
            tariff: item.tariff,
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

    // // Function to filter columns based on search query
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
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );

    const [fileFormat, setFormat] = useState("");

    return (
        <Box>
            <Headtitle title={"EB Services Master"} />
            {/* ****** Header Content ****** */}
            {/* <Typography sx={userStyle.HeaderText}>
        EB Services Master
      </Typography> */}
            <PageHeading
                title=" EB Services Master"
                modulename="EB"
                submodulename="Eb Service Master"
                mainpagename=""
                subpagename=""
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("aebservicemaster") && (
                <>
                    <Box sx={userStyle.dialogbox}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>
                                        ADD EB Services Master
                                    </Typography>
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
                                            options={

                                                isAssignBranch ?

                                                    isAssignBranch
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
                                                        }) : []


                                            }
                                            styles={colourStyles}
                                            value={{
                                                label: ebservicemaster.company,
                                                value: ebservicemaster.company,
                                            }}
                                            onChange={(e) => {
                                                setEbservicemaster({
                                                    ...ebservicemaster,
                                                    company: e.value,
                                                    branch: "Please Select Branch",
                                                    unit: "Please Select Unit",
                                                    floor: "Please Select Floor",
                                                });

                                                setFloors([]);
                                                setAreas([]);
                                                setSelectedOptionsCate([]);
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
                                            options={
                                                isAssignBranch ?
                                                    isAssignBranch
                                                        ?.filter(
                                                            (comp) => ebservicemaster.company === comp.company
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
                                                        }) : []
                                            }




                                            styles={colourStyles}
                                            value={{
                                                label: ebservicemaster.branch,
                                                value: ebservicemaster.branch,
                                            }}
                                            onChange={(e) => {
                                                setNewcheckBranch(e.value);
                                                setEbservicemaster({
                                                    ...ebservicemaster,
                                                    branch: e.value,
                                                    unit: "Please Select Unit",
                                                    floor: "Please Select Floor",
                                                });
                                                setSelectedOptionsCate([]);
                                                fetchFloor(e);
                                                setAreas([]);
                                                setSelectedOptionsCate([]);
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
                                            options={
                                                isAssignBranch ?
                                                    isAssignBranch
                                                        ?.filter(
                                                            (comp) =>
                                                                ebservicemaster.company === comp.company &&
                                                                ebservicemaster.branch === comp.branch
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
                                                        }) : []
                                            }
                                            styles={colourStyles}
                                            value={{
                                                label: ebservicemaster.unit,
                                                value: ebservicemaster.unit,
                                            }}
                                            onChange={(e) => {
                                                setEbservicemaster({
                                                    ...ebservicemaster,
                                                    unit: e.value,
                                                    floor: "Please Select Floor",
                                                });
                                                setAreas([])
                                                setSelectedOptionsCate([]);
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
                                                label: ebservicemaster.floor,
                                                value: ebservicemaster.floor,
                                            }}
                                            onChange={(e) => {
                                                setEbservicemaster({
                                                    ...ebservicemaster,
                                                    floor: e.value,
                                                });
                                                setSelectedOptionsCate([]);
                                                fetchArea(e.value);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Area <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={areas}
                                            value={selectedOptionsCate}
                                            onChange={handleCategoryChange}
                                            valueRenderer={customValueRendererCate}
                                            labelledBy="Please Select Area"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Service Number
                                            <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            sx={userStyle.input}
                                            placeholder="Please Enter Service Number"
                                            value={ebservicemaster.servicenumber}
                                            onChange={(e) => {
                                                setEbservicemaster({
                                                    ...ebservicemaster,
                                                    servicenumber: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Vendor Name </Typography>
                                        <Selects
                                            options={vendordropdown}
                                            styles={colourStyles}
                                            value={{
                                                label: ebservicemaster.vendor,
                                                value: ebservicemaster.vendor,
                                            }}
                                            onChange={(e) => {
                                                setEbservicemaster({
                                                    ...ebservicemaster,
                                                    vendor: e.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Name </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Name"
                                            value={ebservicemaster.name}
                                            onChange={(e) => {
                                                setEbservicemaster({
                                                    ...ebservicemaster,
                                                    name: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Region</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Region"

                                            value={ebservicemaster.region}
                                            onChange={(e) => {
                                                setEbservicemaster({
                                                    ...ebservicemaster,
                                                    region: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Circle</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Circle"

                                            value={ebservicemaster.circle}
                                            onChange={(e) => {
                                                setEbservicemaster({
                                                    ...ebservicemaster,
                                                    circle: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Eb Service Purpose </Typography>
                                        <Select
                                            fullWidth
                                            labelId="demo-select-small"
                                            id="demo-select-small"
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 200,
                                                        width: 80,
                                                    },
                                                },
                                            }}
                                            value={ebservicepurposes}
                                            onChange={(e) => {
                                                setEbservicepurposes(e.target.value);
                                                setEbservicemaster({
                                                    ...ebservicemaster,
                                                    tenentname: "",
                                                    rentaladdress: "",
                                                    rentalcontact: "",
                                                });
                                            }}
                                            displayEmpty
                                            inputProps={{ "aria-label": "Without label" }}
                                        >
                                            <MenuItem value="Own"> {"Own"} </MenuItem>
                                            <MenuItem value="Rental"> {"Rental"} </MenuItem>
                                            <MenuItem value="Common"> {"Common"} </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {ebservicepurposes === "Rental" && (
                                    <>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>TENENT Name</Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    placeholder="Please Enter TENENT Name"

                                                    value={ebservicemaster.tenentname}
                                                    onChange={(e) => {
                                                        setEbservicemaster({
                                                            ...ebservicemaster,
                                                            tenentname: e.target.value,
                                                        });
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Rental Address</Typography>
                                                <TextareaAutosize
                                                    aria-label="minimum height"
                                                    minRows={5}
                                                    value={ebservicemaster.rentaladdress}
                                                    onChange={(e) => {
                                                        setEbservicemaster({
                                                            ...ebservicemaster,
                                                            rentaladdress: e.target.value,
                                                        });
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Rental Contact </Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="number"
                                                    placeholder="Please Enter Rental Contact"
                                                    sx={userStyle.input}
                                                    value={ebservicemaster.rentalcontact}
                                                    onChange={(e) => {
                                                        handlechangRentalcontact(e);
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </>
                                )}

                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Nick Name</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Nick Name"
                                            value={ebservicemaster.nickname}
                                            onChange={(e) => {
                                                setEbservicemaster({
                                                    ...ebservicemaster,
                                                    nickname: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Service Date
                                            <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="date"
                                            value={ebservicemaster.servicedate}
                                            onChange={(e) => {
                                                setEbservicemaster({
                                                    ...ebservicemaster,
                                                    servicedate: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Distribution</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Distribution"
                                            value={ebservicemaster.distribution}
                                            onChange={(e) => {
                                                setEbservicemaster({
                                                    ...ebservicemaster,
                                                    distribution: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Number</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            placeholder="Please Enter Number"
                                            sx={userStyle.input}
                                            value={ebservicemaster.number}
                                            onChange={(e) => {
                                                setEbservicemaster({
                                                    ...ebservicemaster,
                                                    number: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sx={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Address</Typography>
                                        <TextareaAutosize
                                            aria-label="minimum height"
                                            minRows={5}
                                            value={ebservicemaster.address}
                                            onChange={(e) => {
                                                setEbservicemaster({
                                                    ...ebservicemaster,
                                                    address: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Meter Number</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            placeholder="Please Enter Meter Number"
                                            sx={userStyle.input}
                                            value={ebservicemaster.meternumber}
                                            onChange={(e) => {
                                                setEbservicemaster({
                                                    ...ebservicemaster,
                                                    meternumber: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Section ID</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            placeholder="Please Enter Section Id"
                                            sx={userStyle.input}
                                            value={ebservicemaster.sectionid}
                                            onChange={(e) => {
                                                setEbservicemaster({
                                                    ...ebservicemaster,
                                                    sectionid: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Section Name</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Section Name"
                                            value={ebservicemaster.sectionname}
                                            onChange={(e) => {
                                                setEbservicemaster({
                                                    ...ebservicemaster,
                                                    sectionname: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Opening Reading KWH</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            placeholder="Please Enter Open Reading KWH"
                                            sx={userStyle.input}
                                            value={ebservicemaster.openkwh}
                                            onChange={(e) => {
                                                setEbservicemaster({
                                                    ...ebservicemaster,
                                                    openkwh: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>KVAH</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            sx={userStyle.input}
                                            placeholder="Please Enter KVAH"
                                            value={ebservicemaster.kvah}
                                            onChange={(e) => {
                                                setEbservicemaster({
                                                    ...ebservicemaster,
                                                    kvah: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Contracted Load</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Contracted Load"
                                            value={ebservicemaster.contractedload}
                                            onChange={(e) => {
                                                setEbservicemaster({
                                                    ...ebservicemaster,
                                                    contractedload: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Phase</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Phase"
                                            value={ebservicemaster.phase}
                                            onChange={(e) => {
                                                setEbservicemaster({
                                                    ...ebservicemaster,
                                                    phase: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Select CT/Non-CT Type </Typography>
                                        <Select
                                            fullWidth
                                            labelId="demo-select-small"
                                            id="demo-select-small"
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 200,
                                                        width: 80,
                                                    },
                                                },
                                            }}
                                            value={selectCTtypes}
                                            onChange={(e) => {
                                                setSelectCTtypes(e.target.value);
                                            }}
                                            displayEmpty
                                            inputProps={{ "aria-label": "Without label" }}
                                        >
                                            <MenuItem value="CT"> {"CT"} </MenuItem>
                                            <MenuItem value="Non-CT"> {"Non-CT"} </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Solar RTS </Typography>
                                        <Select
                                            fullWidth
                                            labelId="demo-select-small"
                                            id="demo-select-small"
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 200,
                                                        width: 80,
                                                    },
                                                },
                                            }}
                                            value={solars}
                                            onChange={(e) => {
                                                setSolars(e.target.value);
                                            }}
                                            displayEmpty
                                            inputProps={{ "aria-label": "Without label" }}
                                        >
                                            <MenuItem value="YES"> {"YES"} </MenuItem>
                                            <MenuItem value="NO"> {"NO"} </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Welding </Typography>
                                        <Select
                                            fullWidth
                                            labelId="demo-select-small"
                                            id="demo-select-small"
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 200,
                                                        width: 80,
                                                    },
                                                },
                                            }}
                                            value={weldings}
                                            onChange={(e) => {
                                                setWeldings(e.target.value);
                                            }}
                                            displayEmpty
                                            inputProps={{ "aria-label": "Without label" }}
                                        >
                                            <MenuItem value="YES"> {"YES"} </MenuItem>
                                            <MenuItem value="NO"> {"NO"} </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Tariff</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Tariff"
                                            value={ebservicemaster.tariff}
                                            onChange={(e) => {
                                                setEbservicemaster({
                                                    ...ebservicemaster,
                                                    tariff: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Service Category</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Service Category"
                                            value={ebservicemaster.servicecategory}
                                            onChange={(e) => {
                                                setEbservicemaster({
                                                    ...ebservicemaster,
                                                    servicecategory: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>SD Available(Rs)</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter SD Availabe(Rs)"
                                            value={ebservicemaster.sdavailable}
                                            onChange={(e) => {
                                                setEbservicemaster({
                                                    ...ebservicemaster,
                                                    sdavailable: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>SD Refund(Rs)</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            placeholder="Please Enter SD Refund(Rs)"
                                            type="text"
                                            value={ebservicemaster.sdrefund}
                                            onChange={(e) => {
                                                setEbservicemaster({
                                                    ...ebservicemaster,
                                                    sdrefund: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>MCD Available(Rs)</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter MCD Available(Rs)"
                                            value={ebservicemaster.mcdavailable}
                                            onChange={(e) => {
                                                setEbservicemaster({
                                                    ...ebservicemaster,
                                                    mcdavailable: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>MCD Refund(Rs)</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter MCD Refund(Rs)"
                                            value={ebservicemaster.mcdrefund}
                                            onChange={(e) => {
                                                setEbservicemaster({
                                                    ...ebservicemaster,
                                                    mcdrefund: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Power Factor</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Power Factor"
                                            value={ebservicemaster.powerfactor}
                                            onChange={(e) => {
                                                setEbservicemaster({
                                                    ...ebservicemaster,
                                                    powerfactor: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Billing Cycle </Typography>
                                        <Select
                                            fullWidth
                                            labelId="demo-select-small"
                                            id="demo-select-small"
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 200,
                                                        width: 80,
                                                    },
                                                },
                                            }}
                                            value={billingcycles}
                                            onChange={(e) => {
                                                setBillingcycles(e.target.value);
                                            }}
                                            displayEmpty
                                            inputProps={{ "aria-label": "Without label" }}
                                        >
                                            <MenuItem value="Monthly"> {"Monthly"} </MenuItem>
                                            <MenuItem value="Bi-Monthly"> {"Bi-Monthly"} </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Status </Typography>
                                        <Select
                                            fullWidth
                                            labelId="demo-select-small"
                                            id="demo-select-small"
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 200,
                                                        width: 80,
                                                    },
                                                },
                                            }}
                                            value={status}
                                            onChange={(e) => {
                                                setStatus(e.target.value);
                                            }}
                                            displayEmpty
                                            inputProps={{ "aria-label": "Without label" }}
                                        >
                                            <MenuItem value="LIVE"> {"LIVE"} </MenuItem>
                                            <MenuItem value="HOLD"> {"HOLD"} </MenuItem>
                                            <MenuItem value="CLOSED"> {"CLOSED"} </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Meter Type</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Master Type"
                                            value={ebservicemaster.metertype}
                                            onChange={(e) => {
                                                setEbservicemaster({
                                                    ...ebservicemaster,
                                                    metertype: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Bill Month</Typography>
                                        <Select
                                            fullWidth
                                            labelId="demo-select-small"
                                            id="demo-select-small"
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 200,
                                                        width: 80,
                                                    },
                                                },
                                            }}
                                            value={billmonth}
                                            onChange={(e) => {
                                                setBillmonth(e.target.value);
                                            }}
                                            displayEmpty
                                            inputProps={{ "aria-label": "Without label" }}
                                        >
                                            <MenuItem value="Choose Month" disabled>
                                                {" "}
                                                {"Choose Month"}{" "}
                                            </MenuItem>
                                            <MenuItem value="Every Odd Month">
                                                {" "}
                                                {"Every Odd Month"}{" "}
                                            </MenuItem>
                                            <MenuItem value="Every Even Month">
                                                {" "}
                                                {"Every Even Month"}{" "}
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Allowed Unit/Day</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Allowed Unit/Day"
                                            value={ebservicemaster.allowedunit}
                                            onChange={(e) => {
                                                setEbservicemaster({
                                                    ...ebservicemaster,
                                                    allowedunit: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Allowed Unit/Month</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Allowed Unit/Month"
                                            value={ebservicemaster.allowedunitmonth}
                                            onChange={(e) => {
                                                setEbservicemaster({
                                                    ...ebservicemaster,
                                                    allowedunitmonth: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>(Kw)in Rs</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter (Kw)in Rs"
                                            value={ebservicemaster.kwrs}
                                            onChange={(e) => {
                                                setEbservicemaster({
                                                    ...ebservicemaster,
                                                    kwrs: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Renewal Penalty</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Renewal Penalty"
                                            value={ebservicemaster.renewalpenalty}
                                            onChange={(e) => {
                                                setEbservicemaster({
                                                    ...ebservicemaster,
                                                    renewalpenalty: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Tax</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Tax"
                                            value={ebservicemaster.tax}
                                            onChange={(e) => {
                                                setEbservicemaster({
                                                    ...ebservicemaster,
                                                    tax: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Max Demand </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Max Demand "
                                            value={ebservicemaster.maxdem}
                                            onChange={(e) => {
                                                setEbservicemaster({
                                                    ...ebservicemaster,
                                                    maxdem: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Power Factor Penality</Typography>
                                        <Select
                                            fullWidth
                                            labelId="demo-select-small"
                                            id="demo-select-small"
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 200,
                                                        width: 80,
                                                    },
                                                },
                                            }}
                                            value={powerfactorpenality}
                                            onChange={(e) => {
                                                setPowerfactorpenality(e.target.value);
                                            }}
                                            displayEmpty
                                            inputProps={{ "aria-label": "Without label" }}
                                        >
                                            <MenuItem value="Choose Power Factor" disabled>
                                                {" "}
                                                {"Choose Power Factor"}{" "}
                                            </MenuItem>
                                            <MenuItem value="YES"> {"YES"} </MenuItem>
                                            <MenuItem value="NO"> {"NO"} </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br /> <br />
                            <Grid container spacing={2}>
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
                                <Grid item md={2.5} xs={12} sm={6}>
                                    <Button sx={userStyle.btncancel} onClick={handleClear}>
                                        Clear
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </>
            )}
            <Box>
                {/* Edit DIALOG */}
                <Dialog
                    open={isEditOpen}
                    onClose={handleCloseModEdit}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth={true}
                    maxWidth="lg"
                    sx={{
                        overflow: "visible",
                        "& .MuiPaper-root": {
                            overflow: "visible",
                        },
                    }}
                >
                    <Box sx={{ height: "auto", adding: "20px" }}>
                        <>
                            <form onSubmit={editSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} sm={12}>
                                        <Typography sx={userStyle.HeaderText}>
                                            Edit EB Services Master
                                        </Typography>
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
                                                options={
                                                    isAssignBranch ?
                                                        isAssignBranch
                                                            ?.map((data) => ({
                                                                label: data.company,
                                                                value: data.company,
                                                            }))
                                                            .filter((item, index, self) => {
                                                                return (
                                                                    self.findIndex(
                                                                        (i) =>
                                                                            i.label === item.label &&
                                                                            i.value === item.value
                                                                    ) === index
                                                                );
                                                            }) : []
                                                }
                                                styles={colourStyles}
                                                value={{
                                                    label: ebservicemasterEdit.company,
                                                    value: ebservicemasterEdit.company,
                                                }}
                                                onChange={(e) => {
                                                    setEbservicemasterEdit({
                                                        ...ebservicemasterEdit,
                                                        company: e.value,
                                                        branch: "Please Select Branch",
                                                        unit: "Please Select Unit",
                                                        floor: "Please Select Floor",
                                                    });
                                                    setSelectedOptionsCateEdit([]);
                                                    setFloorEdit([]);
                                                    setAreasEdit([]);
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
                                                options={isAssignBranch ? isAssignBranch
                                                    ?.filter(
                                                        (comp) =>
                                                            ebservicemasterEdit.company === comp.company
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
                                                    }) : []
                                                }
                                                styles={colourStyles}
                                                value={{
                                                    label: ebservicemasterEdit.branch,
                                                    value: ebservicemasterEdit.branch,
                                                }}
                                                onChange={(e) => {
                                                    setNewcheckBranch(e.value);
                                                    setEbservicemasterEdit({
                                                        ...ebservicemasterEdit,
                                                        branch: e.value,
                                                        unit: "Please Select Unit",
                                                        floor: "Please Select Floor",
                                                    });
                                                    setSelectedOptionsCateEdit([]);
                                                    setAreasEdit([]);
                                                    setFloorEdit([]);
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
                                                options={isAssignBranch ? isAssignBranch
                                                    ?.filter(
                                                        (comp) =>
                                                            ebservicemasterEdit.company === comp.company &&
                                                            ebservicemasterEdit.branch === comp.branch
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
                                                    }) : []
                                                }
                                                styles={colourStyles}
                                                value={{
                                                    label: ebservicemasterEdit.unit,
                                                    value: ebservicemasterEdit.unit,
                                                }}
                                                onChange={(e) => {
                                                    setEbservicemasterEdit({
                                                        ...ebservicemasterEdit,
                                                        unit: e.value,
                                                        floor: "Please Select Floor",
                                                    });
                                                    setSelectedOptionsCateEdit([]);
                                                    setAreasEdit([]);
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
                                                    label: ebservicemasterEdit.floor,
                                                    value: ebservicemasterEdit.floor,
                                                }}
                                                onChange={(e) => {
                                                    setEbservicemasterEdit({
                                                        ...ebservicemasterEdit,
                                                        floor: e.value,
                                                    });
                                                    setSelectedOptionsCateEdit([]);
                                                    fetchAreaEdit(e);
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Area <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                className="custom-multi-select"
                                                id="component-outlined"
                                                options={areasEdit}
                                                value={selectedOptionsCateEdit}
                                                onChange={handleCategoryChangeEdit}
                                                valueRenderer={customValueRendererCateEdit}
                                                labelledBy="Please Select Area"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Service Number <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Service Number"

                                                value={ebservicemasterEdit.servicenumber}
                                                onChange={(e) => {
                                                    setEbservicemasterEdit({
                                                        ...ebservicemasterEdit,
                                                        servicenumber: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Vendor Name</Typography>
                                            <Selects
                                                options={vendordropdownEdit}
                                                styles={colourStyles}
                                                value={{
                                                    label: ebservicemasterEdit.vendor,
                                                    value: ebservicemasterEdit.vendor,
                                                }}
                                                onChange={(e) => {
                                                    setEbservicemasterEdit({
                                                        ...ebservicemasterEdit,
                                                        vendor: e.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Name </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Name"

                                                value={ebservicemasterEdit.name}
                                                onChange={(e) => {
                                                    setEbservicemasterEdit({
                                                        ...ebservicemasterEdit,
                                                        name: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Region</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Region"
                                                value={ebservicemasterEdit.region}
                                                onChange={(e) => {
                                                    setEbservicemasterEdit({
                                                        ...ebservicemasterEdit,
                                                        region: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Circle</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Circle"
                                                value={ebservicemasterEdit.circle}
                                                onChange={(e) => {
                                                    setEbservicemasterEdit({
                                                        ...ebservicemasterEdit,
                                                        circle: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Eb Service Purpose </Typography>
                                            <Select
                                                fullWidth
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 200,
                                                            width: 80,
                                                        },
                                                    },
                                                }}
                                                value={ebservicepurposesEdit}
                                                onChange={(e) => {
                                                    setEbservicepurposesEdit(e.target.value);
                                                    setEbservicemasterEdit({
                                                        ...ebservicemasterEdit,
                                                        tenentname: "",
                                                        rentaladdress: "",
                                                        rentalcontact: "",
                                                    });
                                                }}
                                                displayEmpty
                                                inputProps={{ "aria-label": "Without label" }}
                                            >
                                                <MenuItem value="Own"> {"Own"} </MenuItem>
                                                <MenuItem value="Rental"> {"Rental"} </MenuItem>
                                                <MenuItem value="Common"> {"Common"} </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    {ebservicepurposesEdit === "Rental" && (
                                        <>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>TENENT Name</Typography>
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="text"
                                                        placeholder="Please Enter TENENT Name"
                                                        value={ebservicemasterEdit.tenentname}
                                                        onChange={(e) => {
                                                            setEbservicemasterEdit({
                                                                ...ebservicemasterEdit,
                                                                tenentname: e.target.value,
                                                            });
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>Rental Address</Typography>
                                                    <TextareaAutosize
                                                        aria-label="minimum height"
                                                        minRows={5}
                                                        value={ebservicemasterEdit.rentaladdress}
                                                        onChange={(e) => {
                                                            setEbservicemasterEdit({
                                                                ...ebservicemasterEdit,
                                                                rentaladdress: e.target.value,
                                                            });
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>Rental Contact </Typography>
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="number"
                                                        placeholder="Please Enter Rental Contact"
                                                        sx={userStyle.input}
                                                        value={ebservicemasterEdit.rentalcontact}
                                                        onChange={(e) => {
                                                            handlechangRentalcontactEdit(e);
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </>
                                    )}

                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Nick Name</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Nick Name"
                                                value={ebservicemasterEdit.nickname}
                                                onChange={(e) => {
                                                    setEbservicemasterEdit({
                                                        ...ebservicemasterEdit,
                                                        nickname: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Service Date <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="date"
                                                value={ebservicemasterEdit.servicedate}
                                                onChange={(e) => {
                                                    setEbservicemasterEdit({
                                                        ...ebservicemasterEdit,
                                                        servicedate: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Distribution</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Distribution"
                                                value={ebservicemasterEdit.distribution}
                                                onChange={(e) => {
                                                    setEbservicemasterEdit({
                                                        ...ebservicemasterEdit,
                                                        distribution: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Number</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                placeholder="Please Enter Number"
                                                type="number"
                                                sx={userStyle.input}
                                                value={ebservicemasterEdit.number}
                                                onChange={(e) => {
                                                    setEbservicemasterEdit({
                                                        ...ebservicemasterEdit,
                                                        number: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sx={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Address</Typography>
                                            <TextareaAutosize
                                                aria-label="minimum height"
                                                minRows={5}
                                                value={ebservicemasterEdit.address}
                                                onChange={(e) => {
                                                    setEbservicemasterEdit({
                                                        ...ebservicemasterEdit,
                                                        address: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Meter Number</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                placeholder="Please Enter Meter Number"
                                                type="number"
                                                sx={userStyle.input}
                                                value={ebservicemasterEdit.meternumber}
                                                onChange={(e) => {
                                                    setEbservicemasterEdit({
                                                        ...ebservicemasterEdit,
                                                        meternumber: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Section ID</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Section Id"
                                                value={ebservicemasterEdit.sectionid}
                                                onChange={(e) => {
                                                    setEbservicemasterEdit({
                                                        ...ebservicemasterEdit,
                                                        sectionid: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Section Name</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Section Name"
                                                value={ebservicemasterEdit.sectionname}
                                                onChange={(e) => {
                                                    setEbservicemasterEdit({
                                                        ...ebservicemasterEdit,
                                                        sectionname: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Opening Reading KWH</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="number"
                                                placeholder="Please Enter Open Reading KWH"
                                                sx={userStyle.input}
                                                value={ebservicemasterEdit.openkwh}
                                                onChange={(e) => {
                                                    setEbservicemasterEdit({
                                                        ...ebservicemasterEdit,
                                                        openkwh: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>KVAH</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="number"
                                                placeholder="Please Enter KVAH"
                                                sx={userStyle.input}
                                                value={ebservicemasterEdit.kvah}
                                                onChange={(e) => {
                                                    setEbservicemasterEdit({
                                                        ...ebservicemasterEdit,
                                                        kvah: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Contracted Load</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Contracted Load"
                                                value={ebservicemasterEdit.contractedload}
                                                onChange={(e) => {
                                                    setEbservicemasterEdit({
                                                        ...ebservicemasterEdit,
                                                        contractedload: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Phase</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Phase"
                                                value={ebservicemasterEdit.phase}
                                                onChange={(e) => {
                                                    setEbservicemasterEdit({
                                                        ...ebservicemasterEdit,
                                                        phase: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Select CT/Non-CT Type </Typography>
                                            <Select
                                                fullWidth
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 200,
                                                            width: 80,
                                                        },
                                                    },
                                                }}
                                                value={selectCTtypesEdit}
                                                onChange={(e) => {
                                                    setSelectCTtypesEdit(e.target.value);
                                                }}
                                                displayEmpty
                                                inputProps={{ "aria-label": "Without label" }}
                                            >
                                                <MenuItem value="CT"> {"CT"} </MenuItem>
                                                <MenuItem value="Non-CT"> {"Non-CT"} </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Solar RTS </Typography>
                                            <Select
                                                fullWidth
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 200,
                                                            width: 80,
                                                        },
                                                    },
                                                }}
                                                value={solarsEdit}
                                                onChange={(e) => {
                                                    setSolarsEdit(e.target.value);
                                                }}
                                                displayEmpty
                                                inputProps={{ "aria-label": "Without label" }}
                                            >
                                                <MenuItem value="YES"> {"YES"} </MenuItem>
                                                <MenuItem value="NO"> {"NO"} </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Welding </Typography>
                                            <Select
                                                fullWidth
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 200,
                                                            width: 80,
                                                        },
                                                    },
                                                }}
                                                value={weldingsEdit}
                                                onChange={(e) => {
                                                    setWeldingsEdit(e.target.value);
                                                }}
                                                displayEmpty
                                                inputProps={{ "aria-label": "Without label" }}
                                            >
                                                <MenuItem value="YES"> {"YES"} </MenuItem>
                                                <MenuItem value="NO"> {"NO"} </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Tariff</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Tariff"
                                                value={ebservicemasterEdit.tariff}
                                                onChange={(e) => {
                                                    setEbservicemasterEdit({
                                                        ...ebservicemasterEdit,
                                                        tariff: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Service Category</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Service Category"
                                                value={ebservicemasterEdit.servicecategory}
                                                onChange={(e) => {
                                                    setEbservicemasterEdit({
                                                        ...ebservicemasterEdit,
                                                        servicecategory: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>SD Available(Rs)</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter SD Availabe(Rs)"
                                                value={ebservicemasterEdit.sdavailable}
                                                onChange={(e) => {
                                                    setEbservicemasterEdit({
                                                        ...ebservicemasterEdit,
                                                        sdavailable: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>SD Refund(Rs)</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                placeholder="Please Enter SD Refund(Rs)"
                                                type="text"
                                                value={ebservicemasterEdit.sdrefund}
                                                onChange={(e) => {
                                                    setEbservicemasterEdit({
                                                        ...ebservicemasterEdit,
                                                        sdrefund: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>MCD Available(Rs)</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                placeholder="Please Enter MCD Available(Rs)"
                                                type="text"
                                                value={ebservicemasterEdit.mcdavailable}
                                                onChange={(e) => {
                                                    setEbservicemasterEdit({
                                                        ...ebservicemasterEdit,
                                                        mcdavailable: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>MCD Refund(Rs)</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                placeholder="Please Enter MCD Refund(Rs)"
                                                type="text"
                                                value={ebservicemasterEdit.mcdrefund}
                                                onChange={(e) => {
                                                    setEbservicemasterEdit({
                                                        ...ebservicemasterEdit,
                                                        mcdrefund: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Power Factor</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Power Factor"
                                                value={ebservicemasterEdit.powerfactor}
                                                onChange={(e) => {
                                                    setEbservicemasterEdit({
                                                        ...ebservicemasterEdit,
                                                        powerfactor: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Billing Cycle </Typography>
                                            <Select
                                                fullWidth
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 200,
                                                            width: 80,
                                                        },
                                                    },
                                                }}
                                                value={billingcyclesEdit}
                                                onChange={(e) => {
                                                    setBillingcyclesEdit(e.target.value);
                                                }}
                                                displayEmpty
                                                inputProps={{ "aria-label": "Without label" }}
                                            >
                                                <MenuItem value="Monthly"> {"Monthly"} </MenuItem>
                                                <MenuItem value="Bi-Monthly"> {"Bi-Monthly"} </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Status </Typography>
                                            <Select
                                                fullWidth
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 200,
                                                            width: 80,
                                                        },
                                                    },
                                                }}
                                                value={statusEdit}
                                                onChange={(e) => {
                                                    setStatusEdit(e.target.value);
                                                }}
                                                displayEmpty
                                                inputProps={{ "aria-label": "Without label" }}
                                            >
                                                <MenuItem value="LIVE"> {"LIVE"} </MenuItem>
                                                <MenuItem value="HOLD"> {"HOLD"} </MenuItem>
                                                <MenuItem value="CLOSED"> {"CLOSED"} </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Meter Type</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Master Type"
                                                value={ebservicemasterEdit.metertype}
                                                onChange={(e) => {
                                                    setEbservicemasterEdit({
                                                        ...ebservicemasterEdit,
                                                        metertype: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Bill Month</Typography>
                                            <Select
                                                fullWidth
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 200,
                                                            width: 80,
                                                        },
                                                    },
                                                }}
                                                value={billmonthEdit}
                                                onChange={(e) => {
                                                    setBillmonthEdit(e.target.value);
                                                }}
                                                displayEmpty
                                                inputProps={{ "aria-label": "Without label" }}
                                            >
                                                <MenuItem value="Choose Month" disabled>
                                                    {" "}
                                                    {"Choose Month"}{" "}
                                                </MenuItem>
                                                <MenuItem value="Every Odd Month">
                                                    {" "}
                                                    {"Every Odd Month"}{" "}
                                                </MenuItem>
                                                <MenuItem value="Every Even Month">
                                                    {" "}
                                                    {"Every Even Month"}{" "}
                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Allowed Unit/Day</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Allowed Unit/Day"
                                                value={ebservicemasterEdit.allowedunit}
                                                onChange={(e) => {
                                                    setEbservicemasterEdit({
                                                        ...ebservicemasterEdit,
                                                        allowedunit: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Allowed Unit/Month</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                placeholder="Please Enter Allowed Unit/Month"
                                                type="text"
                                                value={ebservicemasterEdit.allowedunitmonth}
                                                onChange={(e) => {
                                                    setEbservicemasterEdit({
                                                        ...ebservicemasterEdit,
                                                        allowedunitmonth: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>(Kw)in Rs</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter (Kw)in Rs"
                                                value={ebservicemasterEdit.kwrs}
                                                onChange={(e) => {
                                                    setEbservicemasterEdit({
                                                        ...ebservicemasterEdit,
                                                        kwrs: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Renewal Penalty</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                placeholder="Please Enter Renewal Penalty"
                                                type="text"
                                                value={ebservicemasterEdit.renewalpenalty}
                                                onChange={(e) => {
                                                    setEbservicemasterEdit({
                                                        ...ebservicemasterEdit,
                                                        renewalpenalty: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Tax</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                placeholder="Please Enter Tax"
                                                type="text"
                                                value={ebservicemasterEdit.tax}
                                                onChange={(e) => {
                                                    setEbservicemasterEdit({
                                                        ...ebservicemasterEdit,
                                                        tax: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Max Demand </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                placeholder="Please Enter Max Demand "
                                                type="text"
                                                value={ebservicemasterEdit.maxdem}
                                                onChange={(e) => {
                                                    setEbservicemasterEdit({
                                                        ...ebservicemasterEdit,
                                                        maxdem: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Power Factor Penality</Typography>
                                            <Select
                                                fullWidth
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 200,
                                                            width: 80,
                                                        },
                                                    },
                                                }}
                                                value={powerfactorpenalityEdit}
                                                onChange={(e) => {
                                                    setPowerfactorpenalityEdit(e.target.value);
                                                }}
                                                displayEmpty
                                                inputProps={{ "aria-label": "Without label" }}
                                            >
                                                <MenuItem value="Choose Power Factor" disabled>
                                                    {" "}
                                                    {"Choose Power Factor"}{" "}
                                                </MenuItem>
                                                <MenuItem value="YES"> {"YES"} </MenuItem>
                                                <MenuItem value="NO"> {"NO"} </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <br />

                                <br />

                                <Grid container spacing={2}>
                                    <Grid item md={6} xs={6} sm={6}>
                                        <Button variant="contained" type="submit">
                                            Update
                                        </Button>
                                    </Grid>
                                    <Grid item md={6} xs={6} sm={6}>
                                        <Button
                                            sx={userStyle.btncancel}
                                            onClick={handleCloseModEdit}
                                        >
                                            Cancel
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </>
                    </Box>
                </Dialog>
            </Box>
            <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lebservicemaster") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>
                                EB Services Master List
                            </Typography>
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
                                        {/* <MenuItem value={(ebservicemasters?.length)}>All</MenuItem> */}
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
                                    {isUserRoleCompare?.includes("excelebservicemaster") && (
                                        <>
                                            <Button
                                                onClick={(e) => {
                                                    setIsFilterOpen(true);
                                                    fetchEbservicemaster();
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
                                                    setIsFilterOpen(true);
                                                    fetchEbservicemaster();
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
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
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
                                                    setIsPdfFilterOpen(true);
                                                    fetchEbservicemaster();
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
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
                                <Box>
                                    <FormControl fullWidth size="small">
                                        <Typography>Search</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={searchQuery}
                                            onChange={handleSearchChange}
                                        />
                                    </FormControl>
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
                        {isUserRoleCompare?.includes("bdebservicemaster") && (
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleClickOpenalert}
                            >
                                Bulk Delete
                            </Button>
                        )}
                        <br />
                        <br />
                        {ebservicemasterCheck ? (
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
                                <Box
                                    style={{
                                        width: "100%",
                                        overflowY: "hidden", // Hide the y-axis scrollbar
                                    }}
                                >
                                    <StyledDataGrid
                                        onClipboardCopy={(copiedString) =>
                                            setCopiedData(copiedString)
                                        }
                                        rows={rowsWithCheckboxes}
                                        columns={columnDataTable.filter(
                                            (column) => columnVisibility[column.field]
                                        )}
                                        onSelectionModelChange={handleSelectionChange}
                                        selectionModel={selectedRows}
                                        autoHeight={true}
                                        ref={gridRef}
                                        density="compact"
                                        hideFooter
                                        getRowClassName={getRowClassName}
                                        disableRowSelectionOnClick
                                    />
                                </Box>
                                <Box style={userStyle.dataTablestyle}>
                                    <Box>
                                        Showing{" "}
                                        {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
                                        {Math.min(page * pageSize, filteredDatas.length)} of{" "}
                                        {filteredDatas.length} entries
                                    </Box>
                                    <Box>
                                        <Button
                                            onClick={() => setPage(1)}
                                            disabled={page === 1}
                                            sx={userStyle.paginationbtn}
                                        >
                                            <FirstPageIcon />
                                        </Button>
                                        <Button
                                            onClick={() => handlePageChange(page - 1)}
                                            disabled={page === 1}
                                            sx={userStyle.paginationbtn}
                                        >
                                            <NavigateBeforeIcon />
                                        </Button>
                                        {pageNumbers?.map((pageNumber) => (
                                            <Button
                                                key={pageNumber}
                                                sx={userStyle.paginationbtn}
                                                onClick={() => handlePageChange(pageNumber)}
                                                className={page === pageNumber ? "active" : ""}
                                                disabled={page === pageNumber}
                                            >
                                                {pageNumber}
                                            </Button>
                                        ))}
                                        {lastVisiblePage < totalPages && <span>...</span>}
                                        <Button
                                            onClick={() => handlePageChange(page + 1)}
                                            disabled={page === totalPages}
                                            sx={userStyle.paginationbtn}
                                        >
                                            <NavigateNextIcon />
                                        </Button>
                                        <Button
                                            onClick={() => setPage(totalPages)}
                                            disabled={page === totalPages}
                                            sx={userStyle.paginationbtn}
                                        >
                                            <LastPageIcon />
                                        </Button>
                                    </Box>
                                </Box>
                            </>
                        )}
                    </Box>
                </>
            )}
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

            {/* view model */}
            <Dialog
                open={openview}
                onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
            >
                <Box sx={{ overflow: "auto", padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>
                            {" "}
                            View EB Services Master
                        </Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Company</Typography>
                                    <Typography>{ebservicemasterEdit.company}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Branch</Typography>
                                    <Typography>{ebservicemasterEdit.branch}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">unit</Typography>
                                    <Typography>{ebservicemasterEdit.unit}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Floor</Typography>
                                    <Typography>{ebservicemasterEdit.floor}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Area</Typography>
                                    <Typography>{ebservicemasterEdit.area + ","}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Service Number</Typography>
                                    <Typography>{ebservicemasterEdit.servicenumber}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Vendor Name</Typography>
                                    <Typography>{ebservicemasterEdit.vendor}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Name</Typography>
                                    <Typography>{ebservicemasterEdit.name}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Region</Typography>
                                    <Typography>{ebservicemasterEdit.region}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Circle</Typography>
                                    <Typography>{ebservicemasterEdit.circle}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Eb Service Purpose</Typography>
                                    <Typography>
                                        {ebservicemasterEdit.ebservicepurposes}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            {ebservicepurposesEdit === "Rental" && (
                                <>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">TENENT Name</Typography>
                                            <Typography>{ebservicemasterEdit.tenentname}</Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">Rental Address</Typography>
                                            <Typography>
                                                {ebservicemasterEdit.rentaladdress}
                                            </Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">Rental Contact</Typography>
                                            <Typography>
                                                {ebservicemasterEdit.rentalcontact}
                                            </Typography>
                                        </FormControl>
                                    </Grid>
                                </>
                            )}

                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Nick Name</Typography>
                                    <Typography>{ebservicemasterEdit.nickname}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Service Date</Typography>
                                    <Typography>
                                        {moment(ebservicemasterEdit.servicedate).format(
                                            "DD/MM/YYYY"
                                        )}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Distribution</Typography>
                                    <Typography>{ebservicemasterEdit.distribution}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Number</Typography>
                                    <Typography>{ebservicemasterEdit.number}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Address</Typography>
                                    <Typography>{ebservicemasterEdit.address}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Meter Number</Typography>
                                    <Typography>{ebservicemasterEdit.meternumber}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Section ID</Typography>
                                    <Typography>{ebservicemasterEdit.sectionid}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Section Name</Typography>
                                    <Typography>{ebservicemasterEdit.sectionname}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Opening Reading KWH</Typography>
                                    <Typography>{ebservicemasterEdit.openkwh}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">KVAH</Typography>
                                    <Typography>{ebservicemasterEdit.kvah}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Contracted Load</Typography>
                                    <Typography>{ebservicemasterEdit.contractedload}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Phase</Typography>
                                    <Typography>{ebservicemasterEdit.phase}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Select CT/Non-CT Type</Typography>
                                    <Typography>{ebservicemasterEdit.selectCTtypes}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Solar RTS</Typography>
                                    <Typography>{ebservicemasterEdit.solars}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Welding</Typography>
                                    <Typography>{ebservicemasterEdit.weldings}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Tariff</Typography>
                                    <Typography>{ebservicemasterEdit.tariff}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Service Category</Typography>
                                    <Typography>{ebservicemasterEdit.servicecategory}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">SD Available(Rs)</Typography>
                                    <Typography>{ebservicemasterEdit.sdavailable}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">SD Refund(Rs)</Typography>
                                    <Typography>{ebservicemasterEdit.sdrefund}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">MCD Available(Rs)</Typography>
                                    <Typography>{ebservicemasterEdit.mcdavailable}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">MCD Refund(Rs)</Typography>
                                    <Typography>{ebservicemasterEdit.mcdrefund}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Power Factor</Typography>
                                    <Typography>{ebservicemasterEdit.powerfactor}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Billing Cycle</Typography>
                                    <Typography>{ebservicemasterEdit.billingcycles}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Status</Typography>
                                    <Typography>{ebservicemasterEdit.status}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Meter Type</Typography>
                                    <Typography>{ebservicemasterEdit.metertype}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Bill Month</Typography>
                                    <Typography>
                                        {ebservicemasterEdit.billmonth === "Choose Month"
                                            ? ""
                                            : ebservicemasterEdit.billmonth}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Allowed Unit/Day</Typography>
                                    <Typography>{ebservicemasterEdit.allowedunit}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Allowed Unit/Month</Typography>
                                    <Typography>
                                        {ebservicemasterEdit.allowedunitmonth}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">(Kw)in Rs</Typography>
                                    <Typography>{ebservicemasterEdit.kwrs}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Renewal Penalty</Typography>
                                    <Typography>{ebservicemasterEdit.renewalpenalty}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Tax</Typography>
                                    <Typography>{ebservicemasterEdit.tax}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Max Demand </Typography>
                                    <Typography>{ebservicemasterEdit.maxdem}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Power Factor Penality</Typography>
                                    {/* <Typography>{ebservicemasterEdit.powerfactorpenality === "Choose Power Factor" ? "" : powerfactorpenalityEdit}</Typography> */}
                                    <Typography>
                                        {ebservicemasterEdit.powerfactorpenality ===
                                            "Choose Power Factor"
                                            ? ""
                                            : ebservicemasterEdit.powerfactorpenality}
                                    </Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleCloseview}
                            >
                                {" "}
                                Back{" "}
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>

            {/* ALERT DIALOG */}
            <Box>
                <Dialog
                    open={isErrorOpenpop}
                    onClose={handleCloseerrpop}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent
                        sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                    >
                        <Typography variant="h6">{showAlertpop}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            style={{
                                padding: "7px 13px",
                                color: "white",
                                background: "rgb(25, 118, 210)",
                            }}
                            onClick={() => {
                                sendEditRequest();
                                handleCloseerrpop();
                            }}
                        >
                            ok
                        </Button>
                        <Button
                            style={{
                                backgroundColor: "#f4f4f4",
                                color: "#444",
                                boxShadow: "none",
                                borderRadius: "3px",
                                padding: "7px 13px",
                                border: "1px solid #0000006b",
                                "&:hover": {
                                    "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                                        backgroundColor: "#f4f4f4",
                                    },
                                },
                            }}
                            onClick={handleCloseerrpop}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            <Box>
                <>
                    <Box>

                        <Dialog open={isCheckOpen} onClose={handleCloseCheck} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                            <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                                <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                                <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                                    {(checkuse?.length > 0 && checkread?.length > 0 && checkmaterial?.length > 0)

                                        ? (
                                            <>
                                                <span style={{ fontWeight: "700", color: "#777" }}>{`${deleteEbservice.servicenumber} `}</span>was linked in <span style={{ fontWeight: "700" }}>EbuseInstrument,Ebreading & EbMaterialuse</span>{" "}
                                            </>
                                        ) : checkuse.length > 0 && checkread.length > 0 ? (
                                            <>
                                                <span style={{ fontWeight: "700", color: "#777" }}>{`${deleteEbservice.servicenumber} `}</span> was linked in <span style={{ fontWeight: "700" }}>EbuseInstrument & Ebreading</span>
                                            </>
                                        ) : checkuse.length > 0 && checkmaterial.length > 0 ? (
                                            <>
                                                <span style={{ fontWeight: "700", color: "#777" }}>{`${deleteEbservice.servicenumber} `}</span> was linked in <span style={{ fontWeight: "700" }}>EbuseInstrument & EbMaterialuse</span>
                                            </>
                                        ) : checkread.length > 0 && checkmaterial.length > 0 ? (
                                            <>
                                                <span style={{ fontWeight: "700", color: "#777" }}>{`${deleteEbservice.servicenumber} `}</span> was linked in <span style={{ fontWeight: "700" }}>Ebreading  & EbMaterialuse</span>
                                            </>
                                        )
                                            : checkuse.length > 0 ? (
                                                <>
                                                    <span style={{ fontWeight: "700", color: "#777" }}>{`${deleteEbservice.servicenumber} `}</span> was linked in <span style={{ fontWeight: "700" }}>EbuseInstrument</span>
                                                </>
                                            )
                                                : checkread.length > 0 ? (
                                                    <>
                                                        <span style={{ fontWeight: "700", color: "#777" }}>{`${deleteEbservice.servicenumber} `}</span> was linked in <span style={{ fontWeight: "700" }}>Ebreading</span>
                                                    </>
                                                )
                                                    : checkmaterial.length > 0 ? (
                                                        <>
                                                            <span style={{ fontWeight: "700", color: "#777" }}>{`${deleteEbservice.servicenumber} `}</span> was linked in <span style={{ fontWeight: "700" }}>EbMaterialuse</span>
                                                        </>
                                                    )

                                                        : (
                                                            ""
                                                        )}



                                </Typography>
                            </DialogContent>
                            <DialogActions>
                                < Button onClick={handleCloseCheck} autoFocus variant="contained" color="error">
                                    {" "}
                                    OK{" "}
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                </>
            </Box>


            <Dialog open={isbulkCheckOpen} onClose={handlebulkCloseCheck} aria-labelledby="alert-dialog-title" maxWidth="sm" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center" }}>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                    <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                        {(overalldeletecheck.ebuse?.length > 0 || overalldeletecheck.ebread?.length > 0 || overalldeletecheck.ebmaterial?.length > 0) && (
                            <>
                                <span style={{ fontWeight: "700", color: "#777" }}>
                                    {getLinkedLabelItem(overalldeletecheck)}
                                </span>{' '}
                                was linked in{' '}
                                <span style={{ fontWeight: "700", color: "#777" }}>
                                    {getLinkedLabel(overalldeletecheck)}
                                </span>
                                {shouldShowDeleteMessage(ebservicemasters, selectedRows, overalldeletecheck) && (
                                    <Typography>Do you want to delete others?...</Typography>
                                )}
                            </>
                        )}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    {shouldEnableOkButton(ebservicemasters, selectedRows, overalldeletecheck) ? (
                        <Button onClick={handlebulkCloseCheck} autoFocus variant="contained" color="error"> OK </Button>
                    ) : null}
                    {shouldShowDeleteMessage(ebservicemasters, selectedRows, overalldeletecheck) && (
                        <>
                            <Button onClick={delEbservicecheckboxWithoutLink} variant="contained"> Yes </Button>
                            <Button onClick={handlebulkCloseCheck} autoFocus variant="contained" color="error">Cancel</Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>

            {/* ALERT DIALOG */}
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
                        <Button variant="contained" color="error" onClick={handleCloseerr}>
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            {/* EXPTERNAL COMPONENTS -------------- START */}
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
                filteredDataTwo={filteredData ?? []}
                itemsTwo={items ?? []}
                filename={"EB Service Master"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/* INFO */}
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="EB Services Master Info"
                addedby={addedby}
                updateby={updateby}
            />
            {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={delEbservice}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpencheckbox}
                onClose={handleCloseModcheckbox}
                onConfirm={delEbservicecheckbox}
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
            {/* EXPTERNAL COMPONENTS -------------- END */}
        </Box>
    );
}

export default EbServiceMaster;
