import { makeStyles } from "@material-ui/core";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import { MultiSelect } from "react-multi-select-component";
import {
    Box,
    Button,
    Checkbox,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormGroup,
    Grid,
    MenuItem,
    OutlinedInput,
    Select,
    Typography,
} from "@mui/material";
import axios from "axios";
import {
    FaFileCsv,
    FaFileExcel,
    FaFilePdf,
    FaPlus,
    FaPrint,
} from "react-icons/fa";
import "jspdf-autotable";
import React, { useContext, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import Selects from "react-select";
import csvIcon from "../../components/Assets/CSV.png";
import excelIcon from "../../components/Assets/excel-icon.png";
import fileIcon from "../../components/Assets/file-icons.png";
import pdfIcon from "../../components/Assets/pdf-icon.png";
import wordIcon from "../../components/Assets/word-icon.png";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import Webcamimage from "./Webcameimageasset";
import AlertDialog from "../../components/Alert";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import Switch from '@mui/material/Switch';
import { alpha, styled } from '@mui/material/styles';

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


const NavbarSwitch = styled((props) => (
    <Switch
        focusVisibleClassName=".Mui-focusVisible"
        disableRipple
        {...props}
        onClick={props.onClick}
    />
))(({ theme, buttonStyles }) => ({
    padding: 8,
    '& .MuiSwitch-track': {
        borderRadius: 22 / 2,
        backgroundColor: buttonStyles?.navbar?.backgroundColor,
        '&::before, &::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 16,
            height: 16,
        },
        '&::before': {
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                theme.palette.getContrastText(theme.palette.primary.main)
            )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
            left: 12,
        },
        '&::after': {
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                theme.palette.getContrastText(theme.palette.primary.main)
            )}" d="M19,13H5V11H19V13Z" /></svg>')`,
            right: 12,
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: 'none',
        width: 16,
        height: 16,
        margin: 2,
        backgroundColor: buttonStyles?.navbar?.backgroundColor,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
        color: buttonStyles?.navbar?.color,
        '&:hover': {
            backgroundColor: alpha(buttonStyles?.navbar?.backgroundColor, theme.palette.action.hoverOpacity),
        },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: buttonStyles?.navbar?.backgroundColor,
    },
}));

function AssetSoftwareDetails() {
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

    const [showNavbar, setShowNavbar] = useState(true);

    const [applicationNameArray, setApplicationNameArray] = useState([]);


    // Handle navbar hide/show
    const toggleNavbar = () => {
        setShowNavbar((prev) => !prev);
    };

    const [materialOptcode, setMaterialoptCode] = useState([]);


    const [selectedOptionsMaterial, setSelectedOptionsMaterial] = useState([]);
    const [selectedOptionsComponent, setSelectedOptionsComponent] = useState([]);
    let [valueComponentCat, setValueComponentCat] = useState([]);

    const [loadingdeloverall, setloadingdeloverall] = useState(false);

    const [areas, setAreas] = useState([]);
    const [locations, setLocations] = useState([{ label: "ALL", value: "ALL" }]);

    const EbUsage = [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
    ];

    const [stockCodeCount, setStockCodeCount] = useState(0);
    const [workStationOpt, setWorkStationOpt] = useState([]);
    const [Specification, setSpecification] = useState([]);
    let name = "create";
    let allUploadedFiles = [];
    const [filteredWorkStation, setFilteredWorkStation] = useState([]);

    const handleChangephonenumber = (e) => {
        const regex = /^\d*\.?\d*$/;
        const inputValue = e.target.value;
        if (regex.test(inputValue) || inputValue === "") {
            setAssetdetail({ ...assetdetail, estimation: inputValue });
        }
    };

    const { auth } = useContext(AuthContext);
    const {
        isUserRoleCompare,
        isUserRoleAccess,
        isAssignBranch,
        allfloor,
        alllocationgrouping,
        allarea,
        allareagrouping,
        allBranch, buttonStyles,
        pageName, setPageName
    } = useContext(UserRoleAccessContext);
    const [showAlert, setShowAlert] = useState();
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [vendor, setVendor] = useState("Please Select Vendor ");
    const [vendorGroup, setVendorGroup] = useState("Please Select Vendor Group");
    const [materialOpt, setMaterialopt] = useState([]);
    const [vendorOpt, setVendoropt] = useState([]);
    const [vendorOptInd, setVendoroptInd] = useState([]);
    const [vendorGroupOpt, setVendorGroupopt] = useState([]);
    const [vendorOverall, setVendorOverall] = useState([]);
    const [lastcodeVal, setLastCodeVal] = useState(0);
    const [isimgviewbill, setImgviewbill] = useState(false);
    const handleImgcodeviewbill = () => {
        setImgviewbill(true);
    };
    const handlecloseImgcodeviewbill = () => {
        setImgviewbill(false);
    };
    //TODOS
    const [todos, setTodos] = useState([]);
    const classes = useStyles();
    //filter fields
    const [newcheckbranch, setNewcheckBranch] = useState("Please Select Branch");
    const [floors, setFloors] = useState([]);
    //   post call setstate
    const [assetdetail, setAssetdetail] = useState({
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        floor: "Please Select Floor",
        status: "Please Select Status",
        type: "Please Select Type",
        area: "Please Select Area",
        location: "Please Select Location",
        workstation: "Please Select Workstation",
        workcheck: false,
        department: "Please Select Department",
        responsibleteam: "Please Select Responsible Person",
        team: "Please Select Responsible Team",
        assettype: "",
        assetmaterialcode: "Please Select AssetMaterial",
        asset: "",
        material: "Please Select Material",
        component: "Please Select Component",
        branchcode: "",
        companycode: "",
        code: "",
        countquantity: 1,
        materialcountcode: 0,
        serial: "",
        rate: "",
        warranty: "Yes",
        warrantycalculation: "",
        estimation: "",
        estimationtime: "Days",
        purchasedate: "",
        address: "",
        phonenumber: "",
        vendor: "",
        customercare: "",
        stockcode: "",
        overallrate: true,
        ebusage: "Please Select EB Usage",
    });

    const typeOpt = [
        { label: "Remote Access Software", value: "Remote Access Software" },
        { label: "Web Browser", value: "Web Browser" },
        { label: "Device Drivers", value: "Device Drivers" },
        { label: "Productivity Software", value: "Productivity Software" },
        { label: "Cloud Computing Software", value: "Cloud Computing Software" },
        { label: "Communication Software", value: "Communication Software" },
        { label: "Development Software", value: "Development Software" },
        { label: "Multimedia Software", value: "Multimedia Software" },
        { label: "Database Management Software", value: "Database Management Software" },
        { label: "Security Software", value: "Security Software" },
        { label: "Network Software", value: "Network Software" },
        { label: "Printer Software", value: "Printer Software" },
        { label: "Application Name", value: "Application Name" },
        { label: "Operating System", value: "Operating System" },
    ];

    const statusOpt = [
        { label: "Free", value: "Free" },
        { label: "Paid", value: "Paid" },
        { label: "Paid-w/o Warranty", value: "Paid-w/o Warranty" },

    ];

    const [specificationGrouping, setSpecificationGrouping] = useState([]);


    const [selectedCompanyFrom, setSelectedCompanyFrom] = useState([]);
    const [selectedBranchFrom, setSelectedBranchFrom] = useState([]);
    const [selectedUnitFrom, setSelectedUnitFrom] = useState([]);

    const [selectedCompanyFromCreate, setSelectedCompanyFromCreate] = useState([]);
    const [selectedBranchFromCreate, setSelectedBranchFromCreate] = useState([]);
    const [selectedUnitFromCreate, setSelectedUnitFromCreate] = useState([]);
    const [selectedFloorFromCreate, setSelectedFloorFromCreate] = useState([]);
    const [selectedAreaFromCreate, setSelectedAreaFromCreate] = useState([]);
    const [selectedLocationFromCreate, setSelectedLocationFromCreate] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);

    //branch multiselect dropdown changes
    const handleChangeOptions = (options) => {
        setSelectedOptions(options);
    };
    const customValueRendererOptions = (valueCate, _employeename) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Options";
    };



    //create
    //branch multiselect dropdown changes
    const handleCompanyChangeFromCreate = (options) => {
        setSelectedCompanyFromCreate(options);
        setAssetdetail({
            ...assetdetail,
            assetmaterialcode: "Please Select AssetMaterial",
            type: "Please Select Type",
            vendor: "",
            address: "",
            phonenumber: ""
        });
        setSelectedOptions([])

        setSelectedBranchFromCreate([]);
        setSelectedUnitFromCreate([]);
        setSelectedAreaFromCreate([]);
        setSelectedUnitFromCreate([]);
        setSelectedFloorFromCreate([]);
        setSelectedLocationFromCreate([]);
        setSelectedOptionsMaterial([]);
        setSelectedOptionsComponent([]);
        setValueComponentCat([]);
        setAddedOptions([])
        setFloors([]);
        setMaterialoptCode([])
        setAreas([]);
        setLocations([{ label: "ALL", value: "ALL" }]);
        setAssetdetails([]);
    };
    const customValueRendererCompanyFromCreate = (valueCate, _employeename) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Company";
    };

    //branch multiselect dropdown changes
    const handleBranchChangeFromCreate = (options) => {
        const selectedValues = options.map((a) => a.value);
        setSelectedBranchFromCreate(options);
        setAssetdetail({
            ...assetdetail,
            assetmaterialcode: "Please Select AssetMaterial",
            type: "Please Select Type",
            vendor: "",
            address: "",
            phonenumber: ""
        });
        setSelectedOptions([])
        setSelectedUnitFromCreate([]);
        setSelectedAreaFromCreate([]);
        setSelectedFloorFromCreate([]);
        setLocations([{ label: "ALL", value: "ALL" }]);
        setAreas([]);
        fetchFloor(selectedValues);
        setSelectedOptionsMaterial([]);
        setSelectedOptionsComponent([]);
        setAssetdetails([]);
        setMaterialoptCode([])
        setAddedOptions([])
    };
    const customValueRendererBranchFromCreate = (valueCate, _employeename) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Branch";
    };

    //branch multiselect dropdown changes
    const handleUnitChangeFromCreate = (options) => {
        setSelectedUnitFromCreate(options);
        setAssetdetail({
            ...assetdetail,
            assetmaterialcode: "Please Select AssetMaterial",
            type: "Please Select Type",
            vendor: "",
            address: "",
            phonenumber: ""
        });
        setSelectedOptions([])
        setSelectedAreaFromCreate([]);
        setAssetdetails([]);
        setSelectedOptionsComponent([]);
        setSelectedFloorFromCreate([]);
        setAddedOptions([])
        setMaterialoptCode([])
        setLocations([{ label: "ALL", value: "ALL" }]);
    };
    const customValueRendererUnitFromCreate = (valueCate, _employeename) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Unit";
    };

    const handleFloorChangeFromCreate = (options) => {
        const selectedValues = options.map((a) => a.value);
        setSelectedFloorFromCreate(options);

        setAssetdetail({
            ...assetdetail,
            assetmaterialcode: "Please Select AssetMaterial",
            type: "Please Select Type",
            vendor: "",
            address: "",
            phonenumber: ""
        });
        setSelectedOptions([])
        setSelectedOptionsMaterial([]);
        setSelectedOptionsComponent([]);
        setMaterialoptCode([])
        setAreas([]);
        setAddedOptions([])
        setAssetdetails([]);
        setLocations([{ label: "ALL", value: "ALL" }]);
        fetchArea(selectedValues);
    };
    const customValueRendererFloorFromCreate = (valueCate, _employeename) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Floor";
    };

    const handleAreaChangeFromCreate = (options) => {
        const selectedValues = options.map((a) => a.value);
        setAssetdetail({
            ...assetdetail,
            assetmaterialcode: "Please Select AssetMaterial",
            type: "Please Select Type",
            vendor: "",
            address: "",
            phonenumber: ""
        });
        setSelectedOptions([])
        setSelectedAreaFromCreate(options);
        setSelectedOptionsComponent([]);
        setMaterialoptCode([])
        setAddedOptions([])
        setAssetdetail({
            ...assetdetail,
            assetmaterial: "Please Select Material",
        });
        fetchLocation(selectedValues);
        setAssetdetails([]);
    };
    const customValueRendererAreaFromCreate = (valueCate, _employeename) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Area";
    };

    const handleLocationChangeFromCreate = (options) => {
        setSelectedLocationFromCreate(options);
        setAssetdetail({
            ...assetdetail,
            assetmaterialcode: "Please Select AssetMaterial",
            type: "Please Select Type",
            vendor: "",
            address: "",
            phonenumber: ""
        });
        setSelectedOptions([])
        setAddedOptions([])
        const selectedValues = options.map((a) => a.value);
        fetchMaterialCode(selectedValues)
        setSelectedOptionsComponent([]);
        setMaterialoptCode([])

        // setAssetdetails([])
    };
    const customValueRendererLocationFromCreate = (valueCate, _employeename) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Location";
    };


    // Error Popup model
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };



    useEffect(() => {
        fetchWorkStation();
        fetchMaterialAll();
        fetchVendor();
    }, []);


    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
    const handleClickOpenalert = () => {
        setIsDeleteOpenalert(true);
    };


    const [getimgbillcode, setGetImgbillcode] = useState([]);

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

    //cancel for create section
    const handleClear = async () => {
        try {


            setMaterialoptCode([])
            setFloors([]);
            setPreviewURL(null);
            setVendorGroup("Please Select Vendor Group");
            setVendoropt([]);
            setSpecification([])
            setAreas([])
            setLocations([{ label: "ALL", value: "ALL" }]);
            setAddedOptions([]);
            setSelectedOptions([])
            setSelectedCompanyFromCreate([]);
            setSelectedBranchFromCreate([]);
            setSelectedUnitFromCreate([]);
            setSelectedFloorFromCreate([]);
            setSelectedAreaFromCreate([]);
            setSelectedLocationFromCreate([]);
            setAssetdetail({

                company: "Please Select Company",
                branch: "Please Select Branch",
                unit: "Please Select Unit",
                floor: "Please Select Floor",
                status: "Please Select Status",
                type: "Please Select Type",
                area: "Please Select Area",
                location: "Please Select Location",
                workstation: "Please Select Workstation",
                workcheck: false,
                department: "Please Select Department",
                responsibleteam: "Please Select Responsible Person",
                team: "Please Select Responsible Team",
                assettype: "",
                assetmaterialcode: "Please Select AssetMaterial",
                asset: "",
                material: "Please Select Material",
                component: "Please Select Component",
                branchcode: "",
                companycode: "",
                code: "",
                countquantity: 1,
                materialcountcode: 0,
                serial: "",
                rate: "",
                warranty: "Yes",
                warrantycalculation: "",
                estimation: "",
                estimationtime: "Days",
                purchasedate: "",
                address: "",
                phonenumber: "",
                vendor: "",
                customercare: "",
                stockcode: "",
                overallrate: true,
                ebusage: "Please Select EB Usage",
            });
            setSelectedPurchaseDate("");
            setVendor("Please Select Vendor ");
            setVendorgetid({ address: "", phonenumber: "" });
            setPopupContent("Cleared Successfully");
            setPopupSeverity("success");
            setRefImage([])
            setCapturedImages([])
            setRefImageDrag([])
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    const fetchWorkStation = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.get(SERVICE.WORKSTATION, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const result = res?.data?.locationgroupings.flatMap((item) => {
                return item.combinstation.flatMap((combinstationItem) => {
                    return combinstationItem.subTodos.length > 0
                        ? combinstationItem.subTodos.map(
                            (subTodo) =>
                                subTodo.subcabinname +
                                "(" +
                                item.branch +
                                "-" +
                                item.floor +
                                ")"
                        )
                        : [
                            combinstationItem.cabinname +
                            "(" +
                            item.branch +
                            "-" +
                            item.floor +
                            ")",
                        ];
                });
            });
            setWorkStationOpt(res?.data?.locationgroupings);
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    useEffect(() => {
        var filteredWorks;
        if (
            (assetdetail.unit === "" || assetdetail.unit == undefined) &&
            (assetdetail.floor === "" || assetdetail.floor == undefined)
        ) {
            filteredWorks = workStationOpt?.filter(
                (u) =>
                    u.company === assetdetail.company && u.branch === assetdetail.branch
            );
        } else if (assetdetail.unit === "" || assetdetail.unit == undefined) {
            filteredWorks = workStationOpt?.filter(
                (u) =>
                    u.company === assetdetail.company &&
                    u.branch === assetdetail.branch &&
                    u.floor === assetdetail.floor
            );
        } else if (assetdetail.floor === "" || assetdetail.floor == undefined) {
            filteredWorks = workStationOpt?.filter(
                (u) =>
                    u.company === assetdetail.company &&
                    u.branch === assetdetail.branch &&
                    u.unit === assetdetail.unit
            );
        } else {
            filteredWorks = workStationOpt?.filter(
                (u) =>
                    u.company === assetdetail.company &&
                    u.branch === assetdetail.branch &&
                    u.unit === assetdetail.unit &&
                    u.floor === assetdetail.floor
            );
        }
        const result = filteredWorks?.flatMap((item) => {
            return item.combinstation.flatMap((combinstationItem) => {
                return combinstationItem.subTodos.length > 0
                    ? combinstationItem.subTodos.map(
                        (subTodo) =>
                            subTodo.subcabinname +
                            "(" +
                            item.branch +
                            "-" +
                            item.floor +
                            ")"
                    )
                    : [
                        combinstationItem.cabinname +
                        "(" +
                        item.branch +
                        "-" +
                        item.floor +
                        ")",
                    ];
            });
        });
        setFilteredWorkStation(
            result.flat()?.map((d) => ({
                ...d,
                label: d,
                value: d,
            }))
        );
    }, [
        assetdetail.company,
        assetdetail.branch,
        assetdetail.unit,
        assetdetail.floor,
    ]);


    const fetchFloor = async (selectedBranches) => {
        let resultedit = allfloor.filter((d) => d.branch === selectedBranches.value || d.branch === selectedBranches.branch);
        const flooralledit = resultedit.map((d) => ({
            ...d,
            label: d.name,
            value: d.name,
        }));

        let result = allfloor.filter((d) => selectedBranches.some((branch) => d.branch.includes(branch)));

        const floorall = result.map((d) => ({
            ...d,
            label: d.name,
            value: d.name,
        }));
        setFloors(floorall);
    };

    const fetchArea = async (selectedfloor) => {
        let result = allareagrouping
            .filter(
                (comp) => selectedBranchFromCreate.map((item) => item.value).includes(comp.branch) && selectedfloor.some((floor) => comp.floor.includes(floor))
                // e.includes(comp.floor)
            )
            ?.map((data) => data.area)
            .flat();

        let ji = [].concat(...result);
        const uniqueAreas = Array.from(new Set(ji));
        const all = uniqueAreas.map((d) => ({
            ...d,
            label: d,
            value: d,
        }));
        setAreas(all);
    };
    const fetchLocation = async (selectedlocation) => {
        let result = alllocationgrouping
            .filter(
                (comp) => selectedBranchFromCreate.map((item) => item.value).includes(comp.branch) && selectedFloorFromCreate.map((item) => item.value).includes(comp.floor) && selectedlocation.some((area) => comp.area.includes(area))
                // e.includes(comp.floor)
            )
            ?.map((data) => data.location)
            .flat();

        let ji = [].concat(...result);
        const unique = Array.from(new Set(ji));
        const all = [
            { label: "ALL", value: "ALL" },
            ...unique
                .filter((d) => d !== "ALL")
                .map((d) => ({
                    label: d,
                    value: d,
                })),
        ];
        // const alls = Array.from(new Set(ji));

        setLocations(all);
    };

    const fetchMaterialAll = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.get(SERVICE.ASSETS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const resultall = res?.data?.assetmaterial.map((d) => ({
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
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };
    const fetchspecification = async (e) => {
        setPageName(!pageName)
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
            }));

            setSpecification(resultall);
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
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

        setVendoropt(final);
    };

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

    //fetching Groupname for Dropdowns
    const fetchVendor = async () => {
        setPageName(!pageName)
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
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    const [uniqueid, setUniqueid] = useState(0);
    const [individualasset, setIndividualAsset] = useState([]);
    const [maintentance, setMaintentance] = useState([]);

    //get all project.
    const fetchMaintentance = async () => {
        setPageName(!pageName)
        try {
            let res_project = await axios.get(SERVICE.ASSETWORKSTATIONGROUP, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let single = res_project?.data?.assetworkstationgrouping;

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
                    existingObj.subcomponents = existingObj.subcomponents.concat(
                        obj.subcomponents.join(",")
                    );
                    existingObj.component = existingObj.component.concat(
                        obj.component.join(",")
                    );
                    existingObj.id = existingObj.id.concat(obj._id);
                    uniqueKeysMap.set(key, existingObj);
                }
            });

            uniqueObjects.push(...uniqueKeysMap.values());
            setMaintentance(uniqueObjects);
            if (res_project?.data?.assetworkstationgrouping.length > 0) {
                setUniqueid(
                    res_project?.data?.assetworkstationgrouping[
                        res_project?.data?.assetworkstationgrouping.length - 1
                    ].uniqueid
                );
            }
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    const fetchMaintentanceIndividual = async () => {
        try {
            let res_project = await axios.get(SERVICE.ASSETWORKSTATIONGROUP, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setIndividualAsset(res_project?.data?.assetworkstationgrouping);
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    const [assetdetails, setAssetdetails] = useState([]);


    const fetchSpecificationGrouping = async (name) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(SERVICE.ALL_ASSETSOFTWAREGROUPING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            // let getvalues = res?.data?.assertsoftwaregrouping.filter(
            //     (item) =>
            //         item.material === assetdetail.assetmaterialcode.split("-")[0]

            // );
            function gettruvale(name) {
                const obj = res?.data?.assertsoftwaregrouping.find((item) => item.material === name);
                return obj ? Object.entries(obj)
                    .filter(([key, value]) => key !== "material" && key !== "addedby" && key !== "updatedby" && value === true)
                    .map(([key]) => key) : [];
            }

            setSpecificationGrouping(gettruvale(name).map(item => ({
                ...item,
                label: item === "applicationname" ? "Application Name" :
                    item === "operatingsystem" ? "Operating System" :
                        item === "remoteaccesssoftware" ? "Remote Access Software" :
                            item === "webbrowser" ? "Web Browser" :
                                item === "devicedrivers" ? "Device Drivers" :
                                    item === "productivitysoftware" ? "Productivity Software" :
                                        item === "cloudcomputingsoftware" ? "Cloud Computing Software" :
                                            item === "communicationsoftware" ? "Communication Software" :
                                                item === "developmentsoftware" ? "Development Software" :

                                                    item === "multimediasoftware" ? "Multimedia Software" :
                                                        item === "databasemanagementsoftware" ? "Database Management Software" :
                                                            item === "securitysoftware" ? "Security Software" :
                                                                item === "networksoftware" ? "Network Software" :
                                                                    item === "printersoftware" ? "Printer Software" : "",

                value: item === "applicationname" ? "Application Name" :
                    item === "operatingsystem" ? "Operating System" :
                        item === "remoteaccesssoftware" ? "Remote Access Software" :
                            item === "webbrowser" ? "Web Browser" :
                                item === "devicedrivers" ? "Device Drivers" :
                                    item === "productivitysoftware" ? "Productivity Software" :
                                        item === "cloudcomputingsoftware" ? "Cloud Computing Software" :
                                            item === "communicationsoftware" ? "Communication Software" :
                                                item === "developmentsoftware" ? "Development Software" :

                                                    item === "multimediasoftware" ? "Multimedia Software" :
                                                        item === "databasemanagementsoftware" ? "Database Management Software" :
                                                            item === "securitysoftware" ? "Security Software" :
                                                                item === "networksoftware" ? "Network Software" :
                                                                    item === "printersoftware" ? "Printer Software" : ""
            })));
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    // useEffect(() => {
    //     fetchSpecificationGrouping()
    // }, [assetdetail.assetmaterialcode])

    const fetchAssetDetails = async (code, e) => {
        try {
            let res_vendor = await axios.post(SERVICE.ASSETDETAIL_GETVENDOR, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                code: code
            });
            setAssetdetail({
                ...assetdetail, company: e.company, branch: e.branch,
                unit: e.unit, floor: e.floor, area: e.area, location: e.location,
                assetmaterialcode: e.value, vendor: res_vendor?.data?.assetdetails.vendor,
                address: res_vendor?.data?.assetdetails.address,
                phonenumber: res_vendor?.data?.assetdetails.phonenumber,
                assetsoftwarematerial: e.assetmaterial, type: "Please Select Type", status: "Please Select Status"

            });

            // setAssetdetails(res_vendor?.data?.assetdetails);
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };


    // Example usage

    useEffect(() => {
        fetchMaintentanceIndividual();
        fetchMaintentance();
    }, []);

    //add function...
    const sendRequest = async () => {
        setPageName(!pageName)
        try {

            // selectedOptionsComponent.map((item) =>
            let res = await axios.post(SERVICE.ASSET_CREATE_SOFTWARE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company: String(assetdetail.company),
                branch: String(assetdetail.branch),
                unit: String(assetdetail.unit),
                floor: String(assetdetail.floor),
                location: String(assetdetail.location),
                area: String(assetdetail.area),
                assetmaterialcode: String(assetdetail.assetmaterialcode),
                assetsoftwarematerial: String(assetdetail.assetsoftwarematerial),
                vendor: String(assetdetail?.vendor),
                address: String(assetdetail.address),
                phonenumber: String(assetdetail.phonenumber),
                type: String(assetdetail.type),
                options: selectedOptions.map(item => item.value),
                status: String(assetdetail.status),
                subcomponent: addedOptions ? [...addedOptions] : [],
                estimation: String(assetdetail.estimation),
                estimationtime: String(assetdetail.estimationtime)
                    ? assetdetail.estimationtime
                    : "Days",

                purchasedate: selectedPurchaseDate,
                warrantycalculation: String(assetdetail.warrantycalculation),
                materialvendor: String(vendor),
                materialvendorgroup: String(vendorGroup),

                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            })
            // );
            setAssetdetail({

                assetmaterialcode: "Please Select AssetMaterial",
                status: "Please Select Status",
                type: "Please Select Type",
                vendor: "",
                address: "",
                phonenumber: ""



            });



            setSelectedOptions([])
            setAddedOptions([]);
            setloadingdeloverall(false);
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    const handleSubmit = async (e) => {
        setPageName(!pageName)
        setloadingdeloverall(true);

        let res = await axios.get(SERVICE.ALL_ASSET_SOFTWARE, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
        });

        let compopt = selectedCompanyFromCreate.map((item) => item.value);
        let branchopt = selectedBranchFromCreate.map((item) => item.value);
        let unitopt = selectedUnitFromCreate.map((item) => item.value);
        let flooropt = selectedFloorFromCreate.map((item) => item.value);
        let areaopt = selectedAreaFromCreate.map((item) => item.value);
        let locationopt = selectedLocationFromCreate.map((item) => item.value);


        const isNameMatch = res.data.assetsoftwaredetails.some(
            (item) =>
                // item.company.some((data) => compopt.includes(data)) &&
                // item.branch.some((data) => branchopt.includes(data)) &&
                // item.unit.some((data) => unitopt.includes(data)) &&
                // item.floor.some((data) => flooropt.includes(data)) &&
                // item.area.some((data) => areaopt.includes(data)) &&
                // item.location.some((data) => locationopt.includes(data)) &&

                item.assetmaterialcode === assetdetail.assetmaterialcode || item.assetmaterialcode.includes(assetdetail.assetmaterialcode)
            // console.log(item.assetmaterialcode, assetdetail.assetmaterialcode)

        );

        e.preventDefault();

        if (selectedCompanyFromCreate.length === 0) {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (selectedBranchFromCreate.length === 0) {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (selectedUnitFromCreate.length === 0) {
            setPopupContentMalert("Please Select Unit!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (selectedFloorFromCreate.length === 0) {
            setPopupContentMalert("Please Select Floor!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (selectedAreaFromCreate.length === 0) {
            setPopupContentMalert("Please Select Area!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (selectedLocationFromCreate.length === 0) {
            setPopupContentMalert("Please Select Location!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (assetdetail.assetmaterialcode === "Please Select AssetMaterial") {
            setPopupContentMalert("Please Select AssetMaterial!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (assetdetail.type === "Please Select Type") {
            setPopupContentMalert("Please Select Type!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (selectedOptions.length === 0) {
            setPopupContentMalert("Please Select Options!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (addedOptions.length === 0) {
            setPopupContentMalert("Please Insert Todo!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();


        }
        else if (assetdetail.status === "Please Select Status") {
            setPopupContentMalert("Please Select Status!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }


        else if ((assetdetail.status === "Paid" || assetdetail.status === "Paid-w/o Warranty") && (vendorGroup === "" ||
            vendorGroup === "Please Select Vendor Group")
        ) {
            setPopupContentMalert("Please Select Vendor Group!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if ((assetdetail.status === "Paid" || assetdetail.status === "Paid-w/o Warranty") && (vendor === "" || vendor === "Please Select Vendor ")) {
            setPopupContentMalert("Please Select Vendor!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (assetdetail.status === "Paid" && assetdetail.estimation === "") {
            setPopupContentMalert("Please Enter Warranty Time!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else if (assetdetail.status === "Paid" && selectedPurchaseDate === "") {
            setPopupContentMalert("Please Select PurchaseDate!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            setPopupContentMalert("Data Already Exist!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }

        else {
            sendRequest();
        }
    };

    //fetching Groupname for Dropdowns
    const fetchAsset = async (value, materialcode, assettype, assethead, qty) => {
        try {
            let res = await axios.post(SERVICE.ASSETDETAILCOUNTFILTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                material: String(value),
            });
            // const codeToMatch = assetdetail?.code;
            const filteredData = res.data.assetdetails.filter(
                (item) => item.material === value
            );

            if (filteredData.length > 0) {
                const lastMatchedCode =
                    filteredData[filteredData.length - 1]?.materialcountcode;

                const codeSplitMatch = lastMatchedCode?.split("#");
                let codeSplitMatchfirst = codeSplitMatch[1];
                const codeSplitMatchdouble = codeSplitMatchfirst?.split("-");

                setLastCodeVal(parseInt(codeSplitMatchdouble[1]));

                if (codeSplitMatchdouble) {
                    const codeSplit = parseInt(codeSplitMatchdouble[1]);

                    setAssetdetail({
                        ...assetdetail,
                        material: value,
                        code: materialcode,
                        assettype: assettype,
                        asset: assethead,
                        component: "Please Select Component",
                        materialcountcode: `${materialcode}#${codeSplit + 1}-${qty === ""
                            ? ""
                            : parseInt(codeSplitMatchdouble[1]) + parseInt(qty)
                            }`,
                    });
                } else {
                    setAssetdetail({
                        ...assetdetail,
                        material: value,
                        code: materialcode,
                        assettype: assettype,
                        asset: assethead,

                        component: "Please Select Component",
                        materialcountcode: `${materialcode}#${1}-${qty === "" ? "" : parseInt(qty)
                            }`,
                    });
                }
            } else {
                setAssetdetail({
                    ...assetdetail,
                    material: value,
                    code: materialcode,
                    assettype: assettype,
                    asset: assethead,

                    component: "Please Select Component",
                    materialcountcode: `${materialcode}#${1}-${qty === "" ? "" : parseInt(qty)
                        }`,
                });
            }
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    const [mCode, setMCode] = useState([]);
    const [mCodeTodo, setMCodeTodo] = useState([]);

    //fetching Groupname for Dropdowns
    const fetchAsset1 = async (qty) => {
        try {
            let res = await axios.post(SERVICE.ASSETDETAILCOUNTFILTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                material: String(assetdetail.material),
            });
            // const codeToMatch = assetdetail?.code;
            const filteredData = res.data.assetdetails.filter(
                (item) => item.material === assetdetail.material
            );

            if (filteredData.length > 0) {
                const lastMatchedCode =
                    filteredData[filteredData.length - 1]?.materialcountcode;

                const codeSplitMatch = lastMatchedCode.split("#");
                let codeSplitMatchfirst = codeSplitMatch[1];
                const codeSplitMatchdouble = codeSplitMatchfirst.split("-");

                setLastCodeVal(parseInt(codeSplitMatchdouble[1]));

                if (codeSplitMatchdouble) {
                    const codeSplit = parseInt(codeSplitMatchdouble[1]);
                    setAssetdetail((prev) => ({
                        ...prev,
                        materialcountcode: `${prev?.code}#${codeSplit + 1}-${qty === "" ? "" : codeSplit + parseInt(qty)
                            }`,
                    }));
                } else {
                    setAssetdetail((prev) => ({
                        ...prev,
                        materialcountcode: `${prev?.code}#${1}-${qty === "" ? "" : parseInt(prev.countquantity)
                            }`,
                    }));
                }
            } else {
                setAssetdetail((prev) => ({
                    ...prev,
                    materialcountcode: `${prev?.code}#${1}-${qty === "" ? "" : parseInt(prev.countquantity)
                        }`,
                }));
            }
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };
    const [autovalid, setAutovalid] = useState(1);
    let newval = "$00";
    let newvaltodo = assetdetail.code + "#" + autovalid + "$001";

    const fetchAssetAll = async (e) => {
        try {
            let res = await axios.get(SERVICE.ASSETDETAIL_LIMITED, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let subval = res.data.assetdetailslimited.filter(
                (item) => item.material == e
            );

            let findid = subval[subval.length - 1]?.code;

            if (findid) {
                const hashIndex = findid.indexOf("#");
                const dollarIndex = findid.indexOf("$");

                // Extract the substring between '#' and '$'
                const extractedValue = findid.substring(hashIndex + 1, dollarIndex);

                setAutovalid(Number(extractedValue) + 1);
            } else {
                setAutovalid(1);
            }
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    const fetchAssetAllTodo = async () => {
        try {
            let res = await axios.get(SERVICE.ASSETDETAIL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let sub = res.data.assetdetails
                .filter((item) => item.component === assetdetail.component)
                .flatMap((item) => item.subcomponent);
            setMCodeTodo(sub);
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };
    useEffect(() => {
        fetchAssetAllTodo();
    }, [assetdetail.component]);

    const handleCountChange = async (e) => {
        const eventValue = e.target.value;
        setAssetdetail({
            ...assetdetail,
            countquantity: eventValue,
        });

        fetchAsset1(eventValue);
    };

    const [vendorgetid, setVendorgetid] = useState({});
    const [vendornameid, setVendornameid] = useState("");
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
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
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




    const [selectedPurchaseDate, setSelectedPurchaseDate] = useState("");
    const handleEstimationChange = (e) => {
        const { value } = e.target;
        setAssetdetail({ ...assetdetail, estimationtime: value });
    };

    const handlePurchaseDateChange = (e) => {
        const { value } = e.target;
        setAssetdetail({ ...assetdetail, purchasedate: value });
        setSelectedPurchaseDate(value);
    };

    const formatDateString = (date) => {
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, "0");
        const month = (d.getMonth() + 1).toString().padStart(2, "0");
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };
    const calculateExpiryDate = () => {
        if (assetdetail.estimationtime !== "" && assetdetail.purchasedate) {
            const currentDate = new Date(assetdetail.purchasedate);
            let expiryDate = new Date(currentDate);
            if (assetdetail.estimationtime === "Days") {
                expiryDate.setDate(
                    currentDate.getDate() + parseInt(assetdetail.estimation)
                );
            } else if (assetdetail.estimationtime === "Month") {
                expiryDate.setMonth(
                    currentDate.getMonth() + parseInt(assetdetail.estimation)
                );
            } else if (assetdetail.estimationtime === "Year") {
                expiryDate.setFullYear(
                    currentDate.getFullYear() + parseInt(assetdetail.estimation)
                );
            }
            const formattedExpiryDate = formatDateString(expiryDate);
            let formattedempty = formattedExpiryDate.includes("NaN-NaN-NaN")
                ? ""
                : formattedExpiryDate;
            setAssetdetail({
                ...assetdetail,
                warrantycalculation: formattedempty, // Format date as needed
            });
        }
    };
    useEffect(() => {
        calculateExpiryDate();
    }, [
        assetdetail.estimationtime,
        assetdetail.estimation,
        assetdetail.purchasedate,
    ]);

    //Access Module

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Asset Master"),
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

    const fetchMaterialCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(SERVICE.ASSETMATERIALIP, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const result = res?.data?.assetmaterialip

            setMaterialoptCode(result);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
            ;
        }
    };


    const fetchApplicationName = async (type) => {
        setPageName(!pageName)
        try {
            let res_freq = await axios.post(SERVICE.TYPEWITHSOFTWARE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                type: String(type)
            });
            setApplicationNameArray(res_freq?.data?.softwarespecification);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    const [addedOptions, setAddedOptions] = useState([]);



    let newEntry = {};

    const handleAddOptions = () => {
        const isDuplicate = addedOptions.some((todo) => todo.type.toLowerCase() === assetdetail.type.toLowerCase());

        if (assetdetail.type === "Please Select Type") {
            setPopupContentMalert("Please Select Type!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (selectedOptions.length === 0) {
            setPopupContentMalert("Please Select Options!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }

        else if (assetdetail.status === "Please Select Status") {
            setPopupContentMalert("Please Select Status!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();

        }

        else if ((assetdetail.status === "Paid" || assetdetail.status === "Paid-w/o Warranty") && (vendorGroup === "" ||
            vendorGroup === "Please Select Vendor Group")
        ) {
            setPopupContentMalert("Please Select Vendor Group!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if ((assetdetail.status === "Paid" || assetdetail.status === "Paid-w/o Warranty") && (vendor === "" || vendor === "Please Select Vendor ")) {
            setPopupContentMalert("Please Select Vendor!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (assetdetail.status === "Paid" && assetdetail.estimation === "") {
            setPopupContentMalert("Please Enter Warranty Time!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }

        else if (assetdetail.status === "Paid" && selectedPurchaseDate === "") {
            setPopupContentMalert("Please Select PurchaseDate!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else if (isDuplicate) {
            setPopupContentMalert("Type Already Added!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }


        else {
            newEntry = {
                type: assetdetail.type,
                option: selectedOptions.map(item => item.value),
                status: assetdetail.status,
                materialvendorgroup: vendorGroup,
                materialvendor: vendor,
                estimation: assetdetail.estimation,
                estimationtime: assetdetail.estimationtime,
                purchasedate: selectedPurchaseDate,
                warrantycalculation: assetdetail.warrantycalculation
            };
            setAddedOptions([...addedOptions, newEntry]);
        }
        // setAssetdetail({
        //     status: "Please Select Staus",
        // });



    };



    const handleDeleteOption = (option) => {
        setAddedOptions(addedOptions.filter((entry) => entry.option !== option));
    };




    return (
        <Box>
            <Headtitle title={"SOFTWARE ASSET MASTER"} />
            {/* <Typography sx={userStyle.HeaderText}> Add Asset Detail</Typography> */}
            <PageHeading
                title="Software Asset Master"
                modulename="Software Asset Master"
                submodulename="Asset Details"
                mainpagename="Asset Master"
                subpagename=""
                subsubpagename=""
            />


            {isUserRoleCompare?.includes("asoftwareassetmaster") && (
                <Box sx={userStyle.dialogbox}>
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>
                                <b>Add Software Asset Master </b>
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
                                <MultiSelect
                                    options={isAssignBranch
                                        ?.map((data) => ({
                                            label: data.company,
                                            value: data.company,
                                        }))
                                        .filter((item, index, self) => {
                                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                        })}
                                    styles={colourStyles}
                                    value={selectedCompanyFromCreate}
                                    onChange={handleCompanyChangeFromCreate}
                                    valueRenderer={customValueRendererCompanyFromCreate}
                                    labelledBy="Please Select Company"
                                />
                            </FormControl>
                        </Grid>

                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    Branch<b style={{ color: "red" }}>*</b>
                                </Typography>
                                <MultiSelect
                                    options={isAssignBranch
                                        ?.filter((comp) =>
                                            // ebreadingdetailFilter.company === comp.company
                                            selectedCompanyFromCreate.map((item) => item.value).includes(comp.company)
                                        )
                                        ?.map((data) => ({
                                            label: data.branch,
                                            value: data.branch,
                                        }))
                                        .filter((item, index, self) => {
                                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                        })}
                                    styles={colourStyles}
                                    value={selectedBranchFromCreate}
                                    onChange={handleBranchChangeFromCreate}
                                    valueRenderer={customValueRendererBranchFromCreate}
                                    labelledBy="Please Select Branch"
                                />
                            </FormControl>
                        </Grid>

                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    Unit<b style={{ color: "red" }}>*</b>
                                </Typography>
                                <MultiSelect
                                    options={isAssignBranch
                                        ?.filter((comp) => selectedCompanyFromCreate.map((item) => item.value).includes(comp.company) && selectedBranchFromCreate.map((item) => item.value).includes(comp.branch))
                                        ?.map((data) => ({
                                            label: data.unit,
                                            value: data.unit,
                                        }))
                                        .filter((item, index, self) => {
                                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                        })}
                                    styles={colourStyles}
                                    value={selectedUnitFromCreate}
                                    onChange={handleUnitChangeFromCreate}
                                    valueRenderer={customValueRendererUnitFromCreate}
                                    labelledBy="Please Select Unit"
                                />
                            </FormControl>
                        </Grid>

                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    Floor<b style={{ color: "red" }}>*</b>
                                </Typography>

                                <MultiSelect options={floors} styles={colourStyles} value={selectedFloorFromCreate} onChange={handleFloorChangeFromCreate} valueRenderer={customValueRendererFloorFromCreate} labelledBy="Please Select Floor" />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    Area<b style={{ color: "red" }}>*</b>
                                </Typography>


                                <MultiSelect options={areas} styles={colourStyles} value={selectedAreaFromCreate} onChange={handleAreaChangeFromCreate} valueRenderer={customValueRendererAreaFromCreate} labelledBy="Please Select Area" />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    Location<b style={{ color: "red" }}>*</b>
                                </Typography>

                                <MultiSelect options={locations} styles={colourStyles} value={selectedLocationFromCreate}
                                    onChange={handleLocationChangeFromCreate} valueRenderer={customValueRendererLocationFromCreate} labelledBy="Please Select Location" />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    Asset Material<b style={{ color: "red" }}>*</b>
                                </Typography>
                                <Selects

                                    options={
                                        selectedLocationFromCreate.map((item) => item.value).includes("ALL")
                                            ? Array.from(
                                                new Set(
                                                    materialOptcode
                                                        .filter((t) =>
                                                            t.operatingsoftware === true &&
                                                            locations.map((item) => item.value).includes(t.location))
                                                        .map((t) => ({
                                                            ...t,
                                                            label: t.component,
                                                            value: t.component,
                                                            company: t.company,
                                                            branch: t.branch,
                                                            unit: t.unit,
                                                            floor: t.floor,
                                                            area: t.area,
                                                            location: t.location,
                                                            // operatingsoftware:true
                                                        }))
                                                        .reduce((acc, curr) => {
                                                            if (!acc.some((obj) => obj.value === curr.value)) {
                                                                acc.push(curr);
                                                            }
                                                            return acc;
                                                        }, [])
                                                )
                                            )
                                            : Array.from(
                                                new Set(
                                                    materialOptcode
                                                        .filter(
                                                            (t) =>
                                                                t.operatingsoftware === true &&
                                                                (selectedLocationFromCreate.map((item) => item.value).includes(t.location) || t.location === "ALL")
                                                            // t.location.includes("ALL")) &&

                                                        )
                                                        .map((t) => ({
                                                            ...t,
                                                            label: t.component,
                                                            value: t.component,
                                                            company: t.company,
                                                            branch: t.branch,
                                                            unit: t.unit,
                                                            floor: t.floor,
                                                            area: t.area,
                                                            location: t.location,
                                                            // 
                                                        }))
                                                        .reduce((acc, curr) => {
                                                            if (!acc.some((obj) => obj.value === curr.value)) {
                                                                acc.push(curr);
                                                            }
                                                            return acc;
                                                        }, [])
                                                )
                                            )
                                    }


                                    styles={colourStyles}
                                    value={{
                                        label: assetdetail.assetmaterialcode,
                                        value: assetdetail.assetmaterialcode,
                                    }}
                                    onChange={(e) => {
                                        // console.log(e.component[0].split(`${e.assetmaterial}-`)[1], "ddd")
                                        const assetcode = e.component[0].split(`${e.assetmaterial}-`)[1]

                                        fetchAssetDetails(assetcode, e);
                                        // fetchSpecificationGrouping(e.assetmaterial)
                                        setAddedOptions([])
                                        setSelectedOptions([])
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>Vendor Name</Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    value={assetdetail?.vendor}
                                    readOnly
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>Address</Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    value={assetdetail?.address}
                                    readOnly
                                />
                            </FormControl>
                        </Grid>

                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>Phone Number</Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    value={assetdetail.phonenumber}
                                    readOnly
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    Type<b style={{ color: "red" }}>*</b>
                                </Typography>
                                <Selects
                                    options={typeOpt}
                                    // options={specificationGrouping}
                                    value={{ label: assetdetail.type, value: assetdetail.type }}
                                    onChange={(e) => {
                                        setAssetdetail({
                                            ...assetdetail,
                                            type: e.value,
                                            status: "Please Select Status"
                                        });
                                        fetchApplicationName(e.value)
                                        setSelectedOptions([])
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    Options<b style={{ color: "red" }}>*</b>
                                </Typography>

                                <MultiSelect
                                    //  options={applicationNameArray} 
                                    options={
                                        Array.from(
                                            new Set(
                                                applicationNameArray
                                                    .map((t) => ({
                                                        ...t,
                                                        label: t.name,
                                                        value: t.name,
                                                    }))

                                            )
                                        )
                                    }
                                    styles={colourStyles}
                                    value={selectedOptions}
                                    onChange={handleChangeOptions}
                                    valueRenderer={customValueRendererOptions}
                                    labelledBy="Please Select Options" />
                            </FormControl>
                        </Grid>

                        <Grid item md={2.5} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    Status<b style={{ color: "red" }}>*</b>
                                </Typography>
                                <Selects
                                    options={statusOpt}
                                    value={{ label: assetdetail.status, value: assetdetail.status }}
                                    onChange={(e) => {
                                        setAssetdetail({
                                            ...assetdetail,
                                            status: e.value,
                                            estimation: "",
                                            estimationtime: "Days",
                                            warrantycalculation: ""
                                        });
                                        setVendorGroup("Please Select Vendor Group")
                                        setVendor("Please Select Vendor")
                                        setSelectedPurchaseDate("")
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        {assetdetail.status === "Free" && (
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
                                    onClick={handleAddOptions}
                                >
                                    <FaPlus style={{ fontSize: "15px" }} />
                                </Button>
                            </Grid>

                        )}



                        {assetdetail.status === "Paid" && (
                            <>
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
                                                setVendor("Please Select Vendor ");
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            {" "}
                                            Vendor<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={vendorOpt}
                                            styles={colourStyles}

                                            value={{ label: vendor, value: vendor }}
                                            onChange={(e) => {
                                                setVendor(e.value);
                                                vendorid(e._id);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>


                                <Grid item md={3} xs={12} sm={12}>
                                    <Grid container>
                                        <Grid item md={6} xs={6} sm={6}>
                                            <Typography>
                                                Warranty Time <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <FormControl fullWidth size="small">
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    placeholder="Enter Time"
                                                    value={assetdetail.estimation}
                                                    onChange={(e) => handleChangephonenumber(e)}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6} xs={6} sm={6}>
                                            <Typography>
                                                {" "}
                                                Estimation <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Select
                                                fullWidth
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                value={assetdetail.estimationtime}
                                                onChange={handleEstimationChange}
                                            >
                                                <MenuItem value="" disabled>
                                                    {" "}
                                                    Please Select{" "}
                                                </MenuItem>
                                                <MenuItem value="Days"> {"Days"} </MenuItem>
                                                <MenuItem value="Month"> {"Month"} </MenuItem>
                                                <MenuItem value="Year"> {"Year"} </MenuItem>
                                            </Select>
                                        </Grid>
                                    </Grid>
                                </Grid>


                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Purchase date <b style={{ color: "red" }}>*</b></Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="date"
                                            value={selectedPurchaseDate}
                                            onChange={handlePurchaseDateChange}
                                        />
                                    </FormControl>
                                </Grid>


                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Expiry Date </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={assetdetail.warrantycalculation}
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
                                        onClick={handleAddOptions}
                                    >
                                        <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                </Grid>

                            </>
                        )}
                        {assetdetail.status === "Paid-w/o Warranty" && (
                            <>
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
                                                setVendor("Please Select Vendor ");
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            {" "}
                                            Vendor<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={vendorOpt}
                                            styles={colourStyles}

                                            value={{ label: vendor, value: vendor }}
                                            onChange={(e) => {
                                                setVendor(e.value);
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
                                        onClick={handleAddOptions}
                                    >
                                        <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                </Grid>
                            </>
                        )}



                        {addedOptions &&
                            addedOptions.map((todo, index) => (

                                <Grid item md={12} sm={10} xs={10} key={index}>
                                    <Grid container spacing={1}>

                                        {/* Type */}
                                        <Grid item md={3} sm={6} xs={12}>
                                            <Typography>Type</Typography>
                                            <OutlinedInput fullWidth size="small" value={todo.type} />
                                        </Grid>

                                        {/* Option */}
                                        <Grid item md={3} sm={6} xs={12}>
                                            <Typography>Options</Typography>
                                            <OutlinedInput
                                                fullWidth
                                                type="text"
                                                size="small"
                                                value={todo.option.join(",")} // Convert array to a comma-separated string
                                            />                                        </Grid>

                                        {/* Status */}
                                        <Grid item md={3} sm={6} xs={12}>
                                            <Typography>Status</Typography>
                                            <OutlinedInput fullWidth size="small" value={todo.status} />
                                        </Grid>
                                        {todo.status === "Paid" && (
                                            <>
                                                {/* Vendor Group Name */}
                                                <Grid item md={3} sm={6} xs={12}>
                                                    <Typography>Vendor Group</Typography>
                                                    <OutlinedInput fullWidth size="small" value={todo.materialvendorgroup} />
                                                </Grid>

                                                {/* Vendor */}
                                                <Grid item md={3} sm={6} xs={12}>
                                                    <Typography>Vendor</Typography>
                                                    <OutlinedInput fullWidth size="small" value={todo.materialvendor} />
                                                </Grid>

                                                {/* Warranty Time */}
                                                <Grid item md={3} sm={6} xs={12}>
                                                    <Typography>Warranty Time</Typography>
                                                    <OutlinedInput fullWidth size="small" value={todo.estimationtime} />
                                                </Grid>

                                                {/* Estimation */}
                                                <Grid item md={3} sm={6} xs={12}>
                                                    <Typography>Estimation</Typography>
                                                    <OutlinedInput fullWidth size="small" value={todo.estimation} />
                                                </Grid>

                                                {/* Purchase Date */}
                                                <Grid item md={3} sm={6} xs={12}>
                                                    <Typography>Purchase Date</Typography>
                                                    <OutlinedInput fullWidth size="small" value={todo.purchasedate} />
                                                </Grid>

                                                {/* Expiry Date */}
                                                <Grid item md={3} sm={6} xs={12}>
                                                    <Typography>Expiry Date</Typography>
                                                    <OutlinedInput fullWidth size="small" value={todo.warrantycalculation} />
                                                </Grid>
                                            </>
                                        )}


                                        {todo.status === "Paid-w/o Warranty" && (
                                            <>
                                                {/* Vendor Group Name */}
                                                <Grid item md={3} sm={6} xs={12}>
                                                    <Typography>Vendor Group</Typography>
                                                    <OutlinedInput fullWidth size="small" value={todo.materialvendorgroup} />
                                                </Grid>

                                                {/* Vendor */}
                                                <Grid item md={3} sm={6} xs={12}>
                                                    <Typography>Vendor</Typography>
                                                    <OutlinedInput fullWidth size="small" value={todo.materialvendor} />
                                                </Grid>


                                            </>
                                        )}




                                        {/* Delete Button */}
                                        <Grid item md={3} sm={6} xs={12}>
                                            <Button
                                                sx={{
                                                    padding: "14px",
                                                    marginTop: "16px",
                                                    minWidth: "40px",
                                                    borderRadius: "50%",
                                                    ":hover": {
                                                        backgroundColor: "#80808036",
                                                    },
                                                }}
                                                onClick={() => handleDeleteOption(todo.option)}
                                            >
                                                <FaTrash style={{ fontSize: "large", color: "#a73131" }} />
                                            </Button>
                                        </Grid>

                                    </Grid>
                                </Grid>
                            ))
                        }

                    </Grid>{" "}
                    <br />

                    <br />
                    <Grid container spacing={1}>

                        <Grid item xs={12} sm={6} md={1} lg={2.5} marginTop={3}>
                            <LoadingButton
                                onClick={handleSubmit}
                                loading={loadingdeloverall}
                                sx={buttonStyles.buttonsubmit}
                                loadingPosition="end"
                                variant="contained"
                            >
                                Create
                            </LoadingButton>
                        </Grid>

                        <Grid item xs={12} sm={6} md={1} lg={2.5} marginTop={3}>
                            <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                                Clear
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            )}
            <br />



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

export default AssetSoftwareDetails;