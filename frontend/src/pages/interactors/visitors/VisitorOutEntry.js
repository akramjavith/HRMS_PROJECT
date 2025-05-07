import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    FormControlLabel,
    FormGroup,
    Grid,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Popover,
    Radio,
    RadioGroup,
    Select,
    Switch,
    Table,
    TableBody,
    TableHead,
    TextareaAutosize,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import { makeStyles } from "@material-ui/core";
import AccordionDetails from "@mui/material/AccordionDetails";
import axios from "axios";
import domtoimage from 'dom-to-image';
import { saveAs } from "file-saver";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaSearch } from "react-icons/fa";
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import { Link } from "react-router-dom";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import AggridTableForPaginationTable from "../../../components/AggridTableForPaginationTable.js";
import AlertDialog from "../../../components/Alert";
import {
    followUpActionOption
} from "../../../components/Componentkeyword";
import {
    DeleteConfirmation,
    PleaseSelectRow,
} from "../../../components/DeleteConfirmation.js";
import { handleApiError } from "../../../components/Errorhandling";
import ExportData from "../../../components/ExportData";
import Headtitle from "../../../components/Headtitle";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert";
import PageHeading from "../../../components/PageHeading";
import { StyledTableCell, StyledTableRow } from "../../../components/Table";
import {
    AuthContext,
    UserRoleAccessContext,
} from "../../../context/Appcontext";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
import csvIcon from "../../../components/Assets/CSV.png";
import excelIcon from "../../../components/Assets/excel-icon.png";
import fileIcon from "../../../components/Assets/file-icons.png";
import pdfIcon from "../../../components/Assets/pdf-icon.png";
import wordIcon from "../../../components/Assets/word-icon.png";

function VisitorOutEntry() {

    let today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    const [date, setDate] = useState(today);

    const [advancedFilter, setAdvancedFilter] = useState(null);
    const [additionalFilters, setAdditionalFilters] = useState([]);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const conditions = ["Contains", "Does Not Contain", "Equals", "Does Not Equal", "Begins With", "Ends With", "Blank", "Not Blank"]; // AgGrid-like conditions
    const [selectedColumn, setSelectedColumn] = useState("");
    const [selectedCondition, setSelectedCondition] = useState("Contains");
    const [logicOperator, setLogicOperator] = useState("AND");
    const [filterValue, setFilterValue] = useState("");
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);

    const [totalProjects, setTotalProjects] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    const [isHandleChange, setIsHandleChange] = useState(false);



    // useEffect(() => {
    //   exportallData();
    // }, [isFilterOpen, isPdfFilterOpen]);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
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


    const [selectedOptionsEdit, setSelectedOptionsEdit] = useState([]);

    const [isErrorOpendupe, setIsErrorOpendupe] = useState(false);
    const [showAlertdupe, setShowAlertdupe] = useState();
    const handleClickOpenerrdupe = () => {
        setIsErrorOpendupe(true);
    };
    const handleCloseerrdupe = () => {
        setIsErrorOpendupe(false);
    };

    const [fileFormat, setFormat] = useState("");

    let exportColumnNames = ["Company", "Branch",
        "Unit", "Date", "Visitor's ID", "Visitor Name",
        "Visitor Type", "Visitor Mode", "Visitor Purpose",
        "Visitor Contact No", "IN Time", "OUT Time",
    ];
    let exportRowValues = ["company",
        "branch", "unit", "date", "visitorid",
        "visitorname", "visitortype", "visitormode", "visitorpurpose",
        "visitorcontactnumber", "intime", "outtime"];


    const [vendormaster, setVendormaster] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const { isUserRoleCompare, isUserRoleAccess, buttonStyles, pageName, setPageName, isAssignBranch, allTeam, allUsersData } =
        useContext(UserRoleAccessContext);

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

    const { auth } = useContext(AuthContext);
    const [vendorCheck, setVendorcheck] = useState(false);
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteVendor, setDeletevendor] = useState("");
    const [openInfo, setOpeninfo] = useState(false);
    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        actions: true,
        checkbox: true,
        company: true,
        branch: true,
        unit: true,
        date: true,
        serialNumber: true,
        visitorid: true,

        visitorname: true,
        visitortype: true,
        visitormode: true,
        visitorpurpose: true,
        visitorcontactnumber: true,
        intime: true,
        outtime: true,
        document: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );

    const getDownloadFile = async (id) => {

        let url = `${SERVICE.VISITORDETAILS_LOG_SINGLE_PROFILE}/${encodeURIComponent(id)}`;
        let resVisitor = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
        });

        const file = resVisitor?.data?.svisitordetailslog?.slice(-1)[0]?.files || [];

        if (Array.isArray(file)) {
            // Handle array of objects
            for (const fileObj of file) {
                if (fileObj.preview) {
                    try {
                        const response = await fetch(fileObj.preview);
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = url;
                        link.target = "_blank";
                        link.rel = "noopener noreferrer";
                        document.body.appendChild(link); // Append link to the body
                        link.click(); // Simulate click
                        document.body.removeChild(link); // Remove link after click
                    } catch (error) {
                        console.error(`Failed to download file: ${fileObj.preview}`, error);
                    }
                } else {
                    console.warn("File object missing 'preview' property:", fileObj);
                }
            }
        } else {
            // Handle single file object
            if (file?.preview) {
                try {
                    const response = await fetch(file.preview);
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.target = "_blank";
                    link.rel = "noopener noreferrer";
                    document.body.appendChild(link); // Append link to the body
                    link.click(); // Simulate click
                    document.body.removeChild(link); // Remove link after click
                } catch (error) {
                    console.error(`Failed to download file: ${file.preview}`, error);
                }
            } else {
                console.warn("File object missing 'preview' property:", file);
            }
        }
    };

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
            pinned: 'left', lockPinned: true,
        },

        {
            field: "serialNumber",
            headerName: "S.No",
            flex: 0,
            width: 80,
            minHeight: "40px",
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 100,
            minHeight: "40px",
            hide: !columnVisibility.company,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 100,
            minHeight: "40px",
            hide: !columnVisibility.branch,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 120,
            minHeight: "40px",
            hide: !columnVisibility.unit,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "date",
            headerName: "Date",
            flex: 0,
            width: 120,
            minHeight: "40px",
            hide: !columnVisibility.date,
            headerClassName: "bold-header",
        },
        {
            field: "visitorid",
            headerName: "Visitor ID",
            flex: 0,
            width: 120,
            minHeight: "40px",
            hide: !columnVisibility.visitorid,
            headerClassName: "bold-header",
        },
        {
            field: "visitorname",
            headerName: "Visitor Name",
            flex: 0,
            width: 150,
            minHeight: "40px",
            hide: !columnVisibility.visitorname,
            headerClassName: "bold-header",
        },

        {
            field: "visitortype",
            headerName: "Visitor Type",
            flex: 0,
            width: 150,
            minHeight: "40px",
            hide: !columnVisibility.visitortype,
            headerClassName: "bold-header",
        },
        {
            field: "visitormode",
            headerName: "Visitor Mode",
            flex: 0,
            width: 130,
            minHeight: "40px",
            hide: !columnVisibility.visitormode,
            headerClassName: "bold-header",
        },
        {
            field: "visitorpurpose",
            headerName: "Visitor Purpose",
            flex: 0,
            width: 150,
            minHeight: "40px",
            hide: !columnVisibility.visitorpurpose,
            headerClassName: "bold-header",
        },
        {
            field: "visitorcontactnumber",
            headerName: "Visitor Contact Number",
            flex: 0,
            width: 150,
            minHeight: "40px",
            hide: !columnVisibility.visitorcontactnumber,
            headerClassName: "bold-header",
        },
        {
            field: "intime",
            headerName: "IN Time",
            flex: 0,
            width: 100,
            minHeight: "40px",
            hide: !columnVisibility.intime,
            headerClassName: "bold-header",
        },
        {
            field: "outtime",
            headerName: "OUT Time",
            flex: 0,
            width: 100,
            minHeight: "40px",
            hide: !columnVisibility.outtime,
            headerClassName: "bold-header",
        },
        {
            field: "document",
            headerName: "Profile",
            flex: 0,
            width: 180,
            minHeight: "40px",
            hide: !columnVisibility.document,
            cellRenderer: (params) => (
                <Grid>
                    <div className="page-pdf" textAlign={'center'}>
                        {params.data?.files?.length !== 0 ? <>
                            <Button variant="contained" sx={{ width: "100%" }}
                                onClick={() => {
                                    getDownloadFile(params.data?.visitorid);
                                }}
                                className="next-pdf-btn pdf-button">
                                View
                            </Button>
                        </> : <><Button variant="contained" sx={{ background: "red", color: "white", width: "100%" }}
                            className="next-pdf-btn pdf-button">
                            {"NIL "}
                        </Button></>}
                    </div>
                </Grid>
            ),
        },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 240,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    <Link
                        style={{
                            textDecoration: "none",
                            color: "#fff",
                            minWidth: "0px",
                            padding: "0 3px",
                        }}

                    >
                        <Button onClick={() => {
                            getCode(params.data.id);
                            getUpdateVisitor(params.data.id);
                        }} variant="contained" style={{ fontWeight: "50px" }} >Add Outtime</Button>
                    </Link>
                    {isUserRoleCompare?.includes("vvisitorout") && (

                        <Button onClick={() => {
                            getCodeView(params.data.id, params.data.visitorcommonid, params.data.visitorid);
                        }} sx={userStyle.buttonedit} style={{ minWidth: "0px" }}>
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />              </Button>

                    )}
                </Grid>
            ),
        },
    ];

    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
    const handleClickOpenalert = () => {
        setIsHandleChange(true);
        if (selectedRows?.length === 0) {
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

    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
    };

    const visitorviseDisabledAddResume = async () => {
        setPageName(!pageName);
        try {
            let res = await axios.get(SERVICE.VISITORCANDIDATESALL);

            setAllCandidate(res?.data?.candidates);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };


    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("VisitorsList"),
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

    const [selectedTypeEdit, setSelectedTypeEdit] = useState([]);
    const [selectedModeEdit, setSelectedModeEdit] = useState([]);
    const [selectedPurposeEdit, setSelectedPurposeEdit] = useState([]);

    const [selectedTypeCat, setSelectedTypeCat] = useState([]);
    const [selectedModeCat, setSelectedModeCat] = useState([]);
    const [selectedPurposeCat, setSelectedPurposeCat] = useState([]);


    const [interactorTypeArray, setInteractorTypeArray] = useState([]);
    const [interactorModeArray, setInteractorModeArray] = useState([]);
    const [interactorPurposeArray, setInteractorPurposeArray] = useState([]);
    const customValueRendererEditTypeFrom = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Type</span>
    };

    const customValueRendererEditModeFrom = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Mode</span>
    };

    const customValueRendererEditPurposeFrom = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Purpose</span>
    };

    const fetchInteractorPurpose = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(SERVICE.ALL_MANAGETYPEPG, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let result = res?.data?.manageTypePG.filter(
                (d) => e.some((typ) => d.interactorstype === typ?.value)
            );

            let ans = result.flatMap((data) => data.interactorspurpose);

            setInteractorPurposeArray(
                ans.map((d) => ({
                    ...d,
                    label: d,
                    value: d,
                }))
            );
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const handleTypeEditChange = (options) => {
        setSelectedTypeCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedTypeEdit(options);
        fetchInteractorPurpose(options);
        setSelectedPurposeEdit([])
    };
    const handleModeEditChange = (options) => {
        setSelectedModeCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedModeEdit(options);
    };
    const handlePurposeEditChange = (options) => {
        setSelectedPurposeCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedPurposeEdit(options);
    };


    useEffect(() => {
        visitorviseDisabledAddResume();
        getapi();
    }, []);

    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);
    useEffect(() => {
        addSerialNumber(vendormaster);
    }, [vendormaster]);

    const gridRef = useRef(null);
    const gridRefTable = useRef(null);

    const searchOverAllTerms = searchQuery?.toLowerCase().split(" ");
    const filteredDatas = items?.filter((item) => {
        return searchOverAllTerms.every((term) =>
            Object.values(item).join(" ")?.toLowerCase().includes(term)
        );
    });



    const [visitor, setVisitor] = useState()

    const [duplicateValues, setDuplicateValues] = useState([]);

    const [allCandidate, setAllCandidate] = useState([])

    const filteredSelectedColumn = columnDataTable.filter(data => data.field !== 'checkbox' && data.field !== "actions" && data.field !== "serialNumber");

    // Create a row data object for the DataGrid
    let rowDataTable = filteredDatas.map((item, index) => {


        return {
            id: item.id,
            serialNumber: item.serialNumber,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            date: item.date,
            visitorid: item.visitorid,
            prefix: item.prefix,
            visitorname: item.visitorname,
            visitoremail: item.visitoremail,
            visitortype: item?.visitortype,
            visitormode: item?.visitormode,
            visitorpurpose: item?.visitorpurpose,
            visitorcontactnumber: item.visitorcontactnumber,
            intime: item?.intime,
            outtime: item?.outtime,
            interactorstatus: item.interactorstatus,
            isBtnEnable: item.isBtnEnable,
            files: item.files,
            visitorcommonid: item.visitorcommonid,
            // profileDoc: item.isBtnEnable,
        };
    });


    const [TeamOptions, setTeamOptions] = useState([]);
    const [CreationArray, setCreationArray] = useState([]);

    const [selectedcompanyOptionsEdit, setselectedcompanyOptionsEdit] = useState([]);
    const [selectedbranchOptionsEdit, setselectedbranchOptionsEdit] = useState([]);
    const [selectedteamOptionsEdit, setselectedteamOptionsEdit] = useState([]);
    const [selectedunitOptionsEdit, setselectedunitOptionsEdit] = useState([]);
    let [valueUnitAdd, setValueUnitAdd] = useState("");

    let [valueTeamAdd, setValueTeamAdd] = useState("");
    const customValueRendererUnitAdd = (valueUnitAdd, _units) => {
        return valueUnitAdd.length ? valueUnitAdd.map(({ label }) => label).join(",") :
            <span style={{ color: "hsl(0, 0%, 20%" }}>Please Select Unit</span>
    }
    let [valueBranchAdd, setValueBranchAdd] = useState("");
    const customValueRendererBranchAdd = (valueBranchAdd, _branches) => {
        return valueBranchAdd.length ? valueBranchAdd.map(({ label }) => label)?.join(",") :
            <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Branch</span>
    }
    let [valueCompanyAdd, setValueCompanyAdd] = useState("");
    const customValueRendererCompanyAdd = (valueCompanyAdd, _companies) => {
        return valueCompanyAdd.length ? valueCompanyAdd.map(({ label }) => label)?.join(",") :
            <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Company</span>
    }
    const handleCompanyChangeAdd = (options) => {
        setValueCompanyAdd(
            options.map(a => {
                return a.value;
            })
        )
        // BranchDropDowns(options)
        setselectedcompanyOptionsEdit(options);
        setselectedbranchOptionsEdit([])
        setselectedteamOptionsEdit([]);
        setselectedunitOptionsEdit([]);
        setSelectedOptionsEdit([]);
        setTeamOptions([]);
    }
    const handleBranchChangeAdd = (options) => {
        setValueBranchAdd(
            options.map((a) => {
                return a.value;
            })
        );
        // UnitDropDowns(options)
        setselectedbranchOptionsEdit(options);
        setselectedteamOptionsEdit([]);
        setselectedunitOptionsEdit([]);
        setSelectedOptionsEdit([]);
        setTeamOptions([]);
    };
    const handleUnitChangeAdd = (options) => {
        setValueUnitAdd(
            options.map((a) => {
                return a.value;
            })
        );
        setselectedunitOptionsEdit(options);
        setselectedteamOptionsEdit([]);
        setSelectedOptionsEdit([]);
        // fetchTeam(options);
    }

    const handlecleared = (e) => {
        e.preventDefault();
        setFilterUser({
            fromdate: today,
            todate: today,
            type: "Please Select Type",
            percentage: "",
            day: "Today"
        });
        setVisitorAllDataForExport([]);
        setselectedcompanyOptionsEdit([]);
        setselectedbranchOptionsEdit([])
        setselectedteamOptionsEdit([]);
        setselectedunitOptionsEdit([]);
        setSelectedOptionsEdit([]);
        setCreationArray([]);
        setSelectedTypeEdit([]);
        setSelectedModeEdit([]);
        setSelectedPurposeEdit([]);
        setSelectedTypeCat([]);
        setSelectedModeCat([]);
        setSelectedPurposeCat([]);
        setVendormaster([])
        setVisitorAllData([])
        setSearchQuery("")
        setFilterdata(false);
        setPageSize(10)
        setPage(1)
        setTotalProjects(0)
        setTotalPages(0)
        setTeamOptions([]);
        setFilteredRowData([])
        setFilteredChanges(null)
        setForsearch(false)
        setInteractorPurposeArray([])
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };

    const [employeeEdit, setEmployeeEdit] = useState([])

    const handleCategoryEditChange = (options) => {
        setEmployeeEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsEdit(options);
    };

    const customValueRendererEditCompanyFrom = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Employee</span>
    };


    const [filterUser, setFilterUser] = useState({
        company: "Please Select Company",
        branch: "Please Select Branch",
        fromdate: today,
        todate: today,
        type: "Please Select Type",
        percentage: "",
        day: "Today"
    });

    const daysoptions = [
        { label: "Yesterday", value: "Yesterday" },
        { label: "Last Week", value: "Last Week" },
        { label: "Last Month", value: "Last Month" },
        { label: "Today", value: "Today" },
        { label: "This Week", value: "This Week" },
        { label: "This Month", value: "This Month" },
        { label: "Custom Fields", value: "Custom Fields" },
    ]

    const handleChangeFilterDate = (e) => {
        let fromDate = '';
        let toDate = moment().format('YYYY-MM-DD');
        switch (e.value) {
            case 'Today':
                setFilterUser((prev) => ({ ...prev, fromdate: toDate, todate: toDate }))
                break;
            case 'Yesterday':
                fromDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
                toDate = fromDate; // Yesterday’s date
                setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
                break;

            case 'Last Week':
                fromDate = moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD');
                toDate = moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD');
                setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
                break;

            case 'This Week':
                fromDate = moment().startOf('week').format('YYYY-MM-DD');
                toDate = moment().endOf('week').format('YYYY-MM-DD');
                setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
                break;

            case 'Last Month':
                fromDate = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
                toDate = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
                setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
                break;

            case 'This Month':
                fromDate = moment().startOf('month').format('YYYY-MM-DD');
                toDate = moment().endOf('month').format('YYYY-MM-DD');
                setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
                break;

            case 'Custom Fields':
                setFilterUser((prev) => ({ ...prev, fromdate: "", todate: "" }))
                break;
            default:
                return;
        }
    }

    const handleAutoSelect = async () => {
        setPageName(!pageName)
        try {

            let res_freqType = await axios.get(SERVICE.ALL_INTERACTORTYPE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setInteractorTypeArray(res_freqType?.data?.interactorType?.map((item) => ({
                label: item?.name,
                value: item?.name,
            })));
            setSelectedTypeEdit(res_freqType?.data?.interactorType?.map((item) => ({
                label: item?.name,
                value: item?.name,
            })));
            setSelectedTypeCat(res_freqType?.data?.interactorType?.map((a, index) => {
                return a.name;
            }));


            let res_freqMode = await axios.get(SERVICE.ALL_INTERACTORMODE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setInteractorModeArray(res_freqMode?.data?.interactormode?.map((item) => ({
                label: item?.name,
                value: item?.name,
            })));
            setSelectedModeEdit(res_freqMode?.data?.interactormode?.map((item) => ({
                label: item?.name,
                value: item?.name,
            })));
            setSelectedModeCat(res_freqMode?.data?.interactorType?.map((a, index) => {
                return a.name;
            }));

            let res = await axios.get(SERVICE.ALL_MANAGETYPEPG, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let result = res?.data?.manageTypePG.filter(
                (d) => res_freqType?.data?.interactorType?.some((typ) =>
                    d.interactorstype === typ?.name)
            );

            let ans = result.flatMap((data) => data.interactorspurpose);


            setInteractorPurposeArray(ans?.map((item) => ({
                label: item,
                value: item,
            })));
            setSelectedPurposeEdit(ans?.map((item) => ({
                label: item,
                value: item,
            })));
            setSelectedPurposeCat(ans?.map((a, index) => {
                return a;
            }));

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

            setValueCompanyAdd(selectedCompany);
            setselectedcompanyOptionsEdit(mappedCompany);

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

            setValueBranchAdd(selectedBranch);
            setselectedbranchOptionsEdit(mappedBranch);

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

            setValueUnitAdd(selectedUnit);
            setselectedunitOptionsEdit(mappedUnit);

            let mappedTeam = allTeam
                ?.filter(
                    (u) =>
                        selectedCompany?.includes(u.company) &&
                        selectedBranch?.includes(u.branch) &&
                        selectedUnit?.includes(u.unit)
                )
                .map((u) => ({
                    label: u.teamname,
                    value: u.teamname,
                }));

            let selectedTeam = allTeam
                ?.filter(
                    (u) =>
                        selectedCompany?.includes(u.company) &&
                        selectedBranch?.includes(u.branch) &&
                        selectedUnit?.includes(u.unit)
                )
                .map((u) => u.teamname);

            let mappedemployees = allUsersData
                ?.filter(
                    (u) =>
                        selectedCompany?.includes(u.company) &&
                        selectedBranch?.includes(u.branch) &&
                        selectedUnit?.includes(u.unit) &&
                        selectedTeam?.includes(u.team)
                ).map((u) => ({
                    ...u,
                    label: u.companyname,
                    value: u.companyname,
                }));

            let employeess = allUsersData
                ?.filter(
                    (u) =>
                        selectedCompany?.includes(u.company) &&
                        selectedBranch?.includes(u.branch) &&
                        selectedUnit?.includes(u.unit) &&
                        selectedTeam?.includes(u.team)
                )
                .map((u) => u.companyname);

            setTeamOptions(
                selectedTeam.map((t) => ({
                    label: t,
                    value: t,
                }))
            );
            setselectedteamOptionsEdit(mappedTeam);

            setSelectedOptionsEdit(mappedemployees);

        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const [isEditOpen, setIsEditOpen] = useState(false);

    //Edit model...
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
    };

    const [isViewOpen, setIsViewOpen] = useState(false);

    //Edit model...
    const handleClickOpenView = () => {
        setIsViewOpen(true);
    };
    const handleCloseModView = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsViewOpen(false);
    };

    const [vendor, setVendor] = useState({
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        visitortype: "Please Select Visitor Type",
        visitormode: "Please Select Visitor Mode",
        date: date,
        prefix: "",
        visitorname: "",
        intime: "",
        visitorpurpose: "Please Select Visitor Purpose",
        visitorcontactnumber: "",
        visitoremail: "",
        visitorcompnayname: "",
        documenttype: "Please Select Document Type",
        documentnumber: "",
        meetingdetails: true,
        meetingpersonemployeename: "Please Select Employee Name",
        meetinglocationarea: "Please Select Area",
        escortinformation: true,
        escortdetails: "",
        equipmentborrowed: "",
        outtime: "",
        remark: "",
        followupaction: "Please Select Follow Up Action",
        followupdate: "",
        followuptime: "",
        visitorbadge: "",
        visitorsurvey: "",
    });

    //Project updateby edit page...
    let updateby = vendor?.updatedby;
    let addedby = vendor?.addedby;


    const getCode = async (id) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.SINGLE_VISITORS}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setVendor(res?.data?.svisitors);
            handleClickOpenEdit();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const [materialVisitor, setMaterialVisitor] = useState({})
    const [profile, setProfile] = useState([])

    const getCodeView = async (id, commonid, idscode) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.SINGLE_VISITORS}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let res_view = await axios.get(`${SERVICE.VISITORDETAILS_LOG_SINGLE_FOR_VIEW}/${commonid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let url = `${SERVICE.VISITORDETAILS_LOG_SINGLE_PROFILE}/${encodeURIComponent(idscode)}`;
            let resVisitor = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            const file = resVisitor?.data?.svisitordetailslog?.slice(-1)[0]?.files || [];
            setProfile(file)
            setMaterialVisitor(res_view?.data?.svisitordetailslog)
            setVendor(res?.data?.svisitors);
            handleClickOpenView();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const [updateVisitor, getUpdateVisitor] = useState("")

    const sendRequest = async () => {
        setPageName(!pageName);
        try {
            let addVendorDetails = await axios.put(
                `${SERVICE.VISITORS_STATUSUPDATE}/${updateVisitor}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    ...vendor,
                    equipmentborrowed: String(vendor.equipmentborrowed),
                    outtime: String(vendor.outtime),
                    remark: String(vendor.remark),
                    followupaction: String(vendor.followupaction),
                    followupdate: String(
                        vendor.followupaction === "Required" ? vendor.followupdate : ""
                    ),
                    followuptime: String(
                        vendor.followupaction === "Required" ? vendor.followuptime : ""
                    ),
                    visitorbadge: String(vendor.visitorbadge),
                    visitorsurvey: String(vendor.visitorsurvey),
                    addvisitorin: Boolean(false),
                    followuparray: [
                        {
                            ...vendor.followuparray[0], // Retain existing values
                            _id: vendor.followuparray[0]._id || "",
                            visitortype: String(vendor.visitortype),
                            visitormode: String(vendor.visitormode),
                            visitorpurpose: String(vendor.visitorpurpose),
                            meetingdetails: Boolean(vendor.meetingdetails),
                            intime: String(vendor.intime),

                            requestvisitorfollowaction: String(vendor.requestvisitorfollowaction || ""),
                            requestfollowupactionupdate: String(vendor.requestfollowupactionupdate || ""),
                            requestfollowupactionuptime: String(vendor.requestfollowupactionuptime || ""),
                            requestvisitorfollowupdate: String(vendor.requestvisitorfollowupdate || ""),

                            enquiredbranchnumber: String(vendor.enquiredbranchnumber || ""),
                            enquiredbranchemail: String(vendor.enquiredbranchemail || ""),
                            meetingpersoncompany:
                                vendor.meetingdetails === true ? [...vendor?.meetingpersoncompany] : [],
                            meetingpersonbranch:
                                vendor.meetingdetails === true ? [...vendor?.meetingpersonbranch] : [],
                            meetingpersonunit:
                                vendor.meetingdetails === true ? [...vendor?.meetingpersonunit] : [],
                            meetingpersondepartment:
                                vendor.meetingdetails === true ? [...vendor?.meetingpersondepartment] : [],
                            meetingpersonteam:
                                vendor.meetingdetails === true ? [...vendor?.meetingpersonteam] : [],
                            meetingpersonemployeename: String(
                                vendor.meetingdetails === true
                                    ? vendor.meetingpersonemployeename
                                    : ""
                            ),

                            meetinglocationcompany:
                                vendor.meetingdetails === true
                                    ? [...vendor.meetinglocationcompany]
                                    : [],
                            meetinglocationbranch:
                                vendor.meetingdetails === true
                                    ? [...vendor.meetinglocationbranch]
                                    : [],
                            meetinglocationunit:
                                vendor.meetingdetails === true ? [...vendor.meetinglocationunit] : [],
                            meetinglocationfloor:
                                vendor.meetingdetails === true
                                    ? [...vendor.meetinglocationfloor]
                                    : [],
                            meetinglocationarea: String(
                                vendor.meetingdetails === true ? vendor.meetinglocationarea : ""
                            ),

                            escortinformation: Boolean(vendor.escortinformation),
                            escortdetails: String(
                                vendor.escortinformation === true ? vendor.escortdetails : ""
                            ),
                            equipmentborrowed: String(vendor.equipmentborrowed),
                            outtime: String(vendor.outtime),
                            remark: String(vendor.remark),
                            followupaction: String(vendor.followupaction),
                            followupdate: String(
                                vendor.followupaction === "Required" ? vendor.followupdate : ""
                            ),
                            followuptime: String(
                                vendor.followupaction === "Required" ? vendor.followuptime : ""
                            ),
                            visitorbadge: String(vendor.visitorbadge),
                            visitorsurvey: String(vendor.visitorsurvey),
                        },
                    ],
                    updatedby: [
                        ...updateby,
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                }
            );
            setAdvancedFilter(null)
            setAdditionalFilters([])
            handleResetSearch();
            handleCloseModEdit();
            setPopupContent("Cleared Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };


    const editSubmit = async (e) => {
        e.preventDefault();

        if (
            vendor.company === "Please Select Company" ||
            vendor.company === "" ||
            vendor.company == "undefined"
        ) {

            setPopupContentMalert("Please Select Company")
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            vendor.escortinformation === true &&
            vendor.escortdetails === ""
        ) {

            setPopupContentMalert("Please Enter Escort Details");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (vendor.outtime === "") {

            setPopupContentMalert("Please Select OUT Time");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            vendor.followupaction === "Please Select Follow Up Action" ||
            vendor.followupaction === ""
        ) {

            setPopupContentMalert("Please Select Follow Up Action");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            vendor.followupaction === "Required" &&
            vendor.followupdate === ""
        ) {

            setPopupContentMalert("Please Select Follow Up Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            vendor.followupaction === "Required" &&
            vendor.followuptime === ""
        ) {

            setPopupContentMalert("Please Select Follow Up Time");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            sendRequest();
        }
    };


    useEffect(() => {
        handleAutoSelect();
    }, [isAssignBranch]);



    const handleSubmit = (e) => {
        e.preventDefault();
        if (filterUser.fromdate !== "" && filterUser.todate === "") {
            setPopupContentMalert("Please Select To Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (filterUser.fromdate === "" && filterUser.todate !== "") {
            setPopupContentMalert("Please Select From Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            filterUser.fromdate === "" &&
            filterUser.todate === "" &&
            selectedcompanyOptionsEdit.length === 0 &&
            selectedbranchOptionsEdit.length === 0 &&
            selectedunitOptionsEdit.length === 0 &&
            selectedteamOptionsEdit.length === 0 &&
            selectedOptionsEdit.length === 0 &&
            selectedTypeEdit.length === 0 &&
            selectedModeEdit.length === 0 &&
            selectedPurposeEdit.length === 0
        ) {
            setPopupContentMalert("Please Select Any One Field");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            fetchVendor();
            fetchVendorEmployee();
        }
    }

    // Manage Columns
    const handleOpenManageColumns = (event) => {
        setAnchorEl(event.currentTarget);
        setManageColumnsOpen(true);
    };
    const handleCloseManageColumns = () => {
        setManageColumnsOpen(false);
        setSearchQueryManage("");
    };
    // Function to filter columns based on search query
    const filteredColumns = columnDataTable.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
    );
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
                {" "}
                <CloseIcon />{" "}
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
                            {" "}
                            Show All{" "}
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
                                    newColumnVisibility[column.field] = false;
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
    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };
    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    // Error Popup model
    const handleClickOpenerr = () => {
        setVendorcheck(false);
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };
    // Show All Columns functionality
    const handleShowAllColumns = () => {
        const updatedVisibility = { ...columnVisibility };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibility(updatedVisibility);
    };
    //Delete model
    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = () => {
        setIsDeleteOpen(false);
    };
    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };

    // Alert delete popup
    let Vendorsid = deleteVendor?._id;
    const delVendor = async (e) => {
        setPageName(!pageName);
        try {
            if (Vendorsid) {
                await axios.delete(`${SERVICE.SINGLE_VISITORS}/${Vendorsid}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
                await fetchVendor();
                handleCloseMod();
                setPage(1);
                setPopupContent("Deleted Successfully");
                setPopupSeverity("success");
                handleClickOpenPopup();
            }
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const delVendorcheckbox = async () => {
        setPageName(!pageName);
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.SINGLE_VISITORS}/${item}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
            });

            // Wait for all delete requests to complete
            await Promise.all(deletePromises);
            setIsHandleChange(false);

            handleCloseModcheckbox();
            setSelectedRows([]);
            setSelectAllChecked(false);
            setPage(1);

            await fetchVendor();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    // info model
    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };
    const handleCloseinfo = () => {
        setOpeninfo(false);
    };

    const renderFilePreviewedit = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };

    const [filterdata, setFilterdata] = useState(false)
    const [forsearch, setForsearch] = useState(false)


    useEffect(() => {
        if ((items?.length > 0 && filterdata) || forsearch) {
            fetchVendor();
        }
    }, [page, pageSize, searchQuery]);


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



    const getSearchDisplay = () => {
        if (advancedFilter && advancedFilter.length > 0) {
            return advancedFilter.map((filter, index) => {
                let showname = columnDataTable.find(col => col.field === filter.column)?.headerName;
                return `${showname} ${filter.condition} "${filter.value}"`;
            }).join(' ' + (advancedFilter.length > 1 ? advancedFilter[1].condition : '') + ' ');
        }
        return searchQuery;
    };

    const [visitorAllData, setVisitorAllData] = useState([])

    //get all  vendordetails.
    const handleResetSearch = async () => {
        setVendorcheck(true);
        setPageName(!pageName)
        setFilterdata(true)
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
            fromdate: String(filterUser.fromdate),
            todate: String(filterUser.todate),
            company: selectedcompanyOptionsEdit?.length > 0 ? valueCompanyAdd : [],
            branch: selectedbranchOptionsEdit?.length > 0 ? valueBranchAdd : [],
            unit: selectedunitOptionsEdit?.length > 0 ? valueUnitAdd : [],
            visitortype: selectedTypeEdit?.length > 0 ? selectedTypeCat : [],
            visitormode: selectedModeEdit?.length > 0 ? selectedModeCat : [],
            visitorpurpose: selectedPurposeEdit?.length > 0 ? selectedPurposeCat : [],
        };

        const allFilters = [];
        // Only include advanced filters if they exist, otherwise just use regular searchQuery
        if (allFilters.length > 0 && selectedColumn !== "") {
            queryParams.allFilters = allFilters
            queryParams.logicOperator = logicOperator;
        } else if (searchQuery) {
            queryParams.searchQuery = searchQuery;  // Use searchQuery for regular search
        }

        try {
            let res = await axios.post(SERVICE.ADDVISITORIN_VISITORS, queryParams, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            const ans = res?.data?.result?.length > 0 ? res?.data?.result : [];
            const ansoverall = res?.data?.totalProjectsAllData?.length > 0 ? res?.data?.totalProjectsAllData : [];
            const itemsWithSerialNumber = ans?.map((item, index) => ({
                ...item,
                serialNumber: (page - 1) * pageSize + index + 1,
            }));
            const itemsWithSerialNumberOverall = ansoverall?.map((item, index) => ({
                ...item,
                serialNumber: index + 1,
            }));
            setVendormaster(itemsWithSerialNumber.map((item, index) => {
                const IsAvaile = allCandidate?.some(
                    (data) =>
                        data.firstname?.toLowerCase() + data.lastname?.toLowerCase() === String(item.visitorname?.replace(/\s+/g, '')?.toLowerCase())
                );

                const IsEmail = allCandidate?.some(
                    (data) => data.email?.toLowerCase() === String(item.email?.toLowerCase())
                );


                return {
                    id: item._id,
                    serialNumber: item.serialNumber,
                    company: item.company,
                    branch: item.branch,
                    unit: item.unit,
                    date: moment(item.date).format("DD-MM-YYYY"),
                    visitorid: item.visitorid,
                    prefix: item.prefix,
                    visitorname: item.visitorname,
                    visitoremail: item.visitoremail,
                    visitortype: item?.followuparray[item?.followuparray?.length - 1]?.visitortype,
                    visitormode: item?.followuparray[item?.followuparray?.length - 1]?.visitormode,
                    visitorpurpose: item.followuparray[item?.followuparray?.length - 1]?.visitorpurpose,
                    visitorcontactnumber: item.visitorcontactnumber,
                    intime: item?.followuparray[item?.followuparray?.length - 1]?.intime,
                    outtime: item?.followuparray[item?.followuparray?.length - 1]?.outtime,
                    interactorstatus: item.interactorstatus,
                    isBtnEnable: IsAvaile || IsEmail,
                    visitorcommonid: item?.visitorcommonid,

                };
            }));
            setItems(itemsWithSerialNumber.map((item, index) => {
                const IsAvaile = allCandidate?.some(
                    (data) =>
                        data.firstname?.toLowerCase() + data.lastname?.toLowerCase() === String(item.visitorname?.replace(/\s+/g, '')?.toLowerCase())
                );

                const IsEmail = allCandidate?.some(
                    (data) => data.email?.toLowerCase() === String(item.email?.toLowerCase())
                );

                return {
                    id: item._id,
                    serialNumber: item.serialNumber,
                    company: item.company,
                    branch: item.branch,
                    unit: item.unit,
                    date: moment(item.date).format("DD-MM-YYYY"),
                    visitorid: item.visitorid,
                    prefix: item.prefix,
                    visitorname: item.visitorname,
                    visitoremail: item.visitoremail,
                    visitortype: item?.followuparray[item?.followuparray?.length - 1]?.visitortype,
                    visitormode: item?.followuparray[item?.followuparray?.length - 1]?.visitormode,
                    visitorpurpose: item.followuparray[item?.followuparray?.length - 1]?.visitorpurpose,
                    visitorcontactnumber: item.visitorcontactnumber,
                    intime: item?.followuparray[item?.followuparray?.length - 1]?.intime,
                    outtime: item?.followuparray[item?.followuparray?.length - 1]?.outtime,
                    interactorstatus: item.interactorstatus,
                    isBtnEnable: IsAvaile || IsEmail,
                    visitorcommonid: item?.visitorcommonid,
                };
            }));
            const datas = itemsWithSerialNumberOverall.map((item, index) => {
                const IsAvaile = allCandidate?.some(
                    (data) =>
                        data.firstname?.toLowerCase() + data.lastname?.toLowerCase() === String(item.visitorname?.replace(/\s+/g, '')?.toLowerCase())
                );

                const IsEmail = allCandidate?.some(
                    (data) => data.email?.toLowerCase() === String(item.email?.toLowerCase())
                );

                return {
                    id: item._id,
                    serialNumber: index + 1,
                    company: item.company,
                    branch: item.branch,
                    unit: item.unit,
                    date: moment(item.date).format("DD-MM-YYYY"),
                    visitorid: item.visitorid,
                    prefix: item.prefix,
                    visitorname: item.visitorname,
                    visitoremail: item.visitoremail,
                    visitortype: item?.followuparray[item?.followuparray?.length - 1]?.visitortype,
                    visitormode: item?.followuparray[item?.followuparray?.length - 1]?.visitormode,
                    visitorpurpose: item.followuparray[item?.followuparray?.length - 1]?.visitorpurpose,
                    visitorcontactnumber: item.visitorcontactnumber,
                    intime: item?.followuparray[item?.followuparray?.length - 1]?.intime,
                    outtime: item?.followuparray[item?.followuparray?.length - 1]?.outtime,
                    interactorstatus: item.interactorstatus,
                    isBtnEnable: IsAvaile || IsEmail,
                };
            });

            setVisitorAllData(datas)
            setTotalProjects(ans?.length > 0 ? res?.data?.totalProjects : 0);
            setTotalPages(ans?.length > 0 ? res?.data?.totalPages : 0);
            setPageSize((data) => {
                return ans?.length > 0 ? data : 10;
            });
            setPage((data) => {
                return ans?.length > 0 ? data : 1;
            });

            setVendorcheck(false);
        } catch (err) {
            setVendorcheck(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const [visitorAllDataForExport, setVisitorAllDataForExport] = useState([])

    const fetchVendor = async () => {
        setVendorcheck(true);
        setPageName(!pageName);

        const queryParams = {
            page: Number(page),
            pageSize: Number(pageSize),
            assignbranch: accessbranch,
            fromdate: String(filterUser.fromdate),
            todate: String(filterUser.todate),
            company: selectedcompanyOptionsEdit?.length > 0 ? valueCompanyAdd : [],
            branch: selectedbranchOptionsEdit?.length > 0 ? valueBranchAdd : [],
            unit: selectedunitOptionsEdit?.length > 0 ? valueUnitAdd : [],
            visitortype: selectedTypeEdit?.length > 0 ? selectedTypeCat : [],
            visitormode: selectedModeEdit?.length > 0 ? selectedModeCat : [],
            visitorpurpose: selectedPurposeEdit?.length > 0 ? selectedPurposeCat : [],
        };


        const allFilters = [
            ...additionalFilters,
            { column: selectedColumn, condition: selectedCondition, value: filterValue }
        ];

        if (allFilters.length > 0 && selectedColumn !== "") {
            queryParams.allFilters = allFilters
            queryParams.logicOperator = logicOperator;
        } else if (searchQuery) {
            queryParams.searchQuery = searchQuery;
        }

        try {
            let res = await axios.post(SERVICE.ADDVISITORIN_VISITORS, queryParams, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            const ans = res?.data?.result?.length > 0 ? res?.data?.result : [];
            const ansoverall = res?.data?.totalProjectsAllData?.length > 0 ? res?.data?.totalProjectsAllData : [];
            const itemsWithSerialNumber = ans?.map((item, index) => ({
                ...item,
                serialNumber: (page - 1) * pageSize + index + 1,
            }));
            const itemsWithSerialNumberOverall = ansoverall?.map((item, index) => ({
                ...item,
                serialNumber: index + 1,
            }));
            setVendormaster(itemsWithSerialNumber.map((item, index) => {
                const IsAvaile = allCandidate?.some(
                    (data) =>
                        data.firstname?.toLowerCase() + data.lastname?.toLowerCase() === String(item.visitorname?.replace(/\s+/g, '')?.toLowerCase())
                );

                const IsEmail = allCandidate?.some(
                    (data) => data.email?.toLowerCase() === String(item.email?.toLowerCase())
                );

                return {
                    id: item._id,
                    serialNumber: item.serialNumber,
                    company: item.company,
                    branch: item.branch,
                    unit: item.unit,
                    date: moment(item.date).format("DD-MM-YYYY"),
                    visitorid: item.visitorid,
                    prefix: item.prefix,
                    visitorname: item.visitorname,
                    visitoremail: item.visitoremail,
                    visitortype: item?.followuparray[item?.followuparray?.length - 1]?.visitortype,
                    visitormode: item?.followuparray[item?.followuparray?.length - 1]?.visitormode,
                    visitorpurpose: item.followuparray[item?.followuparray?.length - 1]?.visitorpurpose,
                    visitorcontactnumber: item.visitorcontactnumber,
                    intime: item?.followuparray[item?.followuparray?.length - 1]?.intime,
                    outtime: item?.followuparray[item?.followuparray?.length - 1]?.outtime,
                    interactorstatus: item.interactorstatus,
                    isBtnEnable: IsAvaile || IsEmail,
                    files: item.files,
                    visitorcommonid: item?.visitorcommonid,
                };
            }));
            const datas = itemsWithSerialNumberOverall.map((item, index) => {
                const IsAvaile = allCandidate?.some(
                    (data) =>
                        data.firstname?.toLowerCase() + data.lastname?.toLowerCase() === String(item.visitorname?.replace(/\s+/g, '')?.toLowerCase())
                );

                const IsEmail = allCandidate?.some(
                    (data) => data.email?.toLowerCase() === String(item.email?.toLowerCase())
                );

                return {
                    id: item._id,
                    serialNumber: index + 1,
                    company: item.company,
                    branch: item.branch,
                    unit: item.unit,
                    date: moment(item.date).format("DD-MM-YYYY"),
                    visitorid: item.visitorid,
                    prefix: item.prefix,
                    visitorname: item.visitorname,
                    visitoremail: item.visitoremail,
                    visitortype: item?.followuparray[item?.followuparray?.length - 1]?.visitortype,
                    visitormode: item?.followuparray[item?.followuparray?.length - 1]?.visitormode,
                    visitorpurpose: item.followuparray[item?.followuparray?.length - 1]?.visitorpurpose,
                    visitorcontactnumber: item.visitorcontactnumber,
                    intime: item?.followuparray[item?.followuparray?.length - 1]?.intime,
                    outtime: item?.followuparray[item?.followuparray?.length - 1]?.outtime,
                    interactorstatus: item.interactorstatus,
                    isBtnEnable: IsAvaile || IsEmail,
                    files: item.files,
                };
            });

            setVisitorAllData(datas)
            setTotalProjects(ans?.length > 0 ? res?.data?.totalProjects : 0);
            setTotalPages(ans?.length > 0 ? res?.data?.totalPages : 0);
            setPageSize((data) => {
                return ans?.length > 0 ? data : 10;
            });
            setPage((data) => {
                return ans?.length > 0 ? data : 1;
            });

            setVendorcheck(false);
        } catch (err) {
            setVendorcheck(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const fetchVendorEmployee = async () => {
        setVendorcheck(true);
        setPageName(!pageName);

        const queryParams = {
            page: Number(page),
            pageSize: Number(pageSize),
            assignbranch: accessbranch,
            fromdate: String(filterUser.fromdate),
            todate: String(filterUser.todate),
            company: selectedcompanyOptionsEdit?.length > 0 ? valueCompanyAdd : [],
            branch: selectedbranchOptionsEdit?.length > 0 ? valueBranchAdd : [],
            unit: selectedunitOptionsEdit?.length > 0 ? valueUnitAdd : [],
            visitortype: selectedTypeEdit?.length > 0 ? selectedTypeCat : [],
            visitormode: selectedModeEdit?.length > 0 ? selectedModeCat : [],
            visitorpurpose: selectedPurposeEdit?.length > 0 ? selectedPurposeCat : [],
        };


        const allFilters = [
            ...additionalFilters,
            { column: selectedColumn, condition: selectedCondition, value: filterValue }
        ];

        if (allFilters.length > 0 && selectedColumn !== "") {
            queryParams.allFilters = allFilters
            queryParams.logicOperator = logicOperator;
        } else if (searchQuery) {
            queryParams.searchQuery = searchQuery;
        }

        try {
            let res = await axios.post(SERVICE.ADDVISITORIN_VISITORS, queryParams, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            const ansoverall = res?.data?.totalProjectsAllData?.length > 0 ? res?.data?.totalProjectsAllData : [];

            const itemsWithSerialNumberOverall = ansoverall?.map((item, index) => ({
                ...item,
                serialNumber: index + 1,
            }));

            const datas = itemsWithSerialNumberOverall.map((item, index) => {
                const IsAvaile = allCandidate?.some(
                    (data) =>
                        data.firstname?.toLowerCase() + data.lastname?.toLowerCase() === String(item.visitorname?.replace(/\s+/g, '')?.toLowerCase())
                );

                const IsEmail = allCandidate?.some(
                    (data) => data.email?.toLowerCase() === String(item.email?.toLowerCase())
                );

                return {
                    id: item._id,
                    serialNumber: index + 1,
                    company: item.company,
                    branch: item.branch,
                    unit: item.unit,
                    date: moment(item.date).format("DD-MM-YYYY"),
                    visitorid: item.visitorid,
                    prefix: item.prefix,
                    visitorname: item.visitorname,
                    visitoremail: item.visitoremail,
                    visitortype: item?.followuparray[item?.followuparray?.length - 1]?.visitortype,
                    visitormode: item?.followuparray[item?.followuparray?.length - 1]?.visitormode,
                    visitorpurpose: item.followuparray[item?.followuparray?.length - 1]?.visitorpurpose,
                    visitorcontactnumber: item.visitorcontactnumber,
                    intime: item?.followuparray[item?.followuparray?.length - 1]?.intime,
                    outtime: item?.followuparray[item?.followuparray?.length - 1]?.outtime,
                    interactorstatus: item.interactorstatus,
                    isBtnEnable: IsAvaile || IsEmail,
                    files: item.files,
                };
            });

            setVisitorAllDataForExport(datas)

            setVendorcheck(false);
        } catch (err) {
            setVendorcheck(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const gridRefTableImg = useRef(null);
    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Visitors.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };
    // Excel
    const fileName = "Visitors";

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Visitors",
        pageStyle: "print",
    });
    const addSerialNumber = (datas) => {
        setItems(datas);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setPage(1);
        setFilterdata(true)
    };

    //datatable....
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        // setPage(1);
    };
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
    const classes = useStyles();
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
    const renderFilePreviewMulterUploaded = async (file) => {
        if (!file) return false;
        const imageUrl = `${SERVICE.VEIW_VISITOR_FILES}/${file.filename}`;
        window.open(imageUrl, '_blank'); // Open image in a new tab
    };

    return (
        <Box>
            <Headtitle title={"VISITOR OUT ENTRY"} />
            <PageHeading
                title="Visitors Out Entry"
                modulename="Interactors"
                submodulename="Visitor"
                mainpagename="List Visitors"
                subpagename=""
                subsubpagename=""
            />
            <Box sx={userStyle.selectcontainer}>
                <>
                    <Grid item xs={8}>
                        <Typography
                            sx={{
                                ...userStyle.importheadtext,
                                fontSize: "1.4rem",
                                marginRight: "1rem",
                            }}
                        >
                            Filter Visitors Out Entry Details
                        </Typography>                    </Grid>
                    <br />
                    <Grid container spacing={2}>
                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    Company<b style={{ color: "red" }}>*</b>
                                </Typography>
                                <MultiSelect
                                    maxMenuHeight={300}
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
                                    value={selectedcompanyOptionsEdit}
                                    valueRenderer={customValueRendererCompanyAdd}
                                    onChange={handleCompanyChangeAdd}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    Branch<b style={{ color: "red" }}>*</b>
                                </Typography>
                                <MultiSelect
                                    maxMenuHeight={300}
                                    options={accessbranch
                                        ?.filter((comp) => selectedcompanyOptionsEdit?.some((item) => item?.value === comp.company))
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

                                    // options={BranchOptions}
                                    value={selectedbranchOptionsEdit}
                                    valueRenderer={customValueRendererBranchAdd}
                                    onChange={handleBranchChangeAdd}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    Unit<b style={{ color: "red" }}>*</b>
                                </Typography>
                                <MultiSelect
                                    maxMenuHeight={300}
                                    options={accessbranch
                                        ?.filter((comp) => selectedbranchOptionsEdit?.some((item) => item?.value === comp.branch))
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

                                    // options={UnitOptions}
                                    value={selectedunitOptionsEdit}
                                    onChange={handleUnitChangeAdd}
                                    valueRenderer={customValueRendererUnitAdd}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    Type<b style={{ color: "red" }}>*</b>
                                </Typography>
                                <MultiSelect

                                    options={interactorTypeArray}
                                    value={selectedTypeEdit}
                                    onChange={handleTypeEditChange}
                                    valueRenderer={customValueRendererEditTypeFrom}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    Mode<b style={{ color: "red" }}>*</b>
                                </Typography>
                                <MultiSelect

                                    options={interactorModeArray}
                                    value={selectedModeEdit}
                                    onChange={handleModeEditChange}
                                    valueRenderer={customValueRendererEditModeFrom}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    Purpose<b style={{ color: "red" }}>*</b>
                                </Typography>
                                <MultiSelect

                                    options={interactorPurposeArray}
                                    value={selectedPurposeEdit}
                                    onChange={handlePurposeEditChange}
                                    valueRenderer={customValueRendererEditPurposeFrom}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography sx={{ fontWeight: "500" }}>
                                    Days<b style={{ color: "red" }}>*</b>
                                </Typography>
                                <Selects
                                    options={daysoptions}
                                    // styles={colourStyles}
                                    value={{ label: filterUser.day, value: filterUser.day }}
                                    onChange={(e) => {
                                        handleChangeFilterDate(e);
                                        setFilterUser((prev) => ({ ...prev, day: e.value }))
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    {" "}
                                    From Date<b style={{ color: "red" }}>*</b>
                                </Typography>
                                <OutlinedInput
                                    id="from-date"
                                    type="date"
                                    disabled={filterUser.day !== "Custom Fields"}
                                    value={filterUser.fromdate}
                                    onChange={(e) => {
                                        const newFromDate = e.target.value;
                                        setFilterUser((prevState) => ({
                                            ...prevState,
                                            fromdate: newFromDate,
                                            todate: prevState.todate && new Date(prevState.todate) > new Date(newFromDate) ? prevState.todate : ""
                                        }));
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    To Date<b style={{ color: "red" }}>*</b>
                                </Typography>
                                <OutlinedInput
                                    id="to-date"
                                    type="date"
                                    value={filterUser.todate}
                                    disabled={filterUser.day !== "Custom Fields"}
                                    onChange={(e) => {
                                        const selectedToDate = new Date(e.target.value);
                                        const selectedFromDate = new Date(filterUser.fromdate);
                                        const formattedDatePresent = new Date() // Assuming you have a function to format the current date
                                        if (selectedToDate >= selectedFromDate && selectedToDate >= new Date(selectedFromDate)) {
                                            setFilterUser({
                                                ...filterUser,
                                                todate: e.target.value
                                            });
                                        } else {
                                            setFilterUser({
                                                ...filterUser,
                                                todate: "" // Reset to empty string if the condition fails
                                            });
                                        }
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid

                            item md={3} xs={12} sm={12}
                        >
                            <Typography >
                                &nbsp;
                            </Typography>
                            <Button
                                sx={buttonStyles.buttonsubmit} onClick={(e) => {
                                    handleSubmit(e)
                                    setFilterdata(true)
                                    setForsearch(true)
                                }}
                            >
                                Filter
                            </Button>
                            &nbsp;
                            &nbsp;
                            <Button sx={buttonStyles.btncancel} onClick={handlecleared}>
                                Clear
                            </Button>
                        </Grid>

                    </Grid>
                </>
            </Box>
            <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lvisitorout") && (
                <>
                    <Box sx={userStyle.container}>
                        <Grid container spacing={2}>
                            <Grid item xs={8}>
                                <Typography sx={userStyle.SubHeaderText}>
                                    Visitors Out Entry List
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                {isUserRoleCompare?.includes("avisitorout") && (
                                    <>
                                        <Link
                                            to="/interactor/addvisitorin"
                                            style={{
                                                textDecoration: "none",
                                                color: "white",
                                                float: "right",
                                            }}
                                        >
                                            <Button sx={buttonStyles.buttonsubmit}>ADD</Button>
                                        </Link>
                                    </>
                                )}
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
                                    {isUserRoleCompare?.includes("excelvisitorout") && (
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
                                    {isUserRoleCompare?.includes("csvvisitorout") && (
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
                                    {isUserRoleCompare?.includes("printvisitorout") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfvisitorout") && (
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
                                    {isUserRoleCompare?.includes("imagevisitorout") && (
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

                            <Grid item md={2} xs={6} sm={6}>

                                {/* <AggregatedSearchBar
                  columnDataTable={columnDataTable}
                  setItems={setItems}
                  addSerialNumber={addSerialNumber}
                  setPage={setPage}
                  maindatas={vendormaster}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={true}
                  totalDatas={visitorAllData}
                /> */}
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
                        &ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
                            Manage Columns
                        </Button>{" "}
                        &ensp;
                        {isUserRoleCompare?.includes("bdvisitorout") && (
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleClickOpenalert}
                                sx={buttonStyles.buttonbulkdelete}
                            >
                                Bulk Delete
                            </Button>
                        )}
                        <br />
                        <br />
                        <Box style={{ width: "100%", overflowY: "hidden" }}>
                            {vendorCheck ? (
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
                                    itemsList={visitorAllData}
                                />

                            )}
                        </Box>{" "}

                    </Box>
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
                                                    fetchVendor();
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
            {/* ****** Table End ****** */}

            {/* Manage Column */}
            <Popover
                id={id}
                open={isManageColumnsOpen}
                anchorEl={anchorEl}
                onClose={handleCloseManageColumns}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            >
                {" "}
                {manageColumnsContent}{" "}
            </Popover>
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
            <br />
            <Box>
                <Dialog
                    open={isErrorOpendupe}
                    onClose={handleCloseerrdupe}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="sm"
                    fullWidth={true}
                >
                    <DialogContent sx={{ textAlign: "center", alignItems: "center" }}>
                        <Typography variant="h6">{showAlertdupe}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Link
                            to={!duplicateValues?.length > 0 ? '#' : `/recruitment/addresume/${visitor?.id}`}
                            style={{
                                textDecoration: "none",
                                color: !duplicateValues?.length > 0 ? "#fff" : "#aaa", // change color when disabled
                                pointerEvents: !duplicateValues?.length > 0 ? "none" : "auto"
                            }}
                        >
                            <Button
                                variant="contained"
                                style={{
                                    fontWeight: "bold",
                                    cursor: !duplicateValues?.length > 0 ? "not-allowed" : "pointer"
                                }}
                                disabled={!duplicateValues?.length > 0}
                            >
                                Need To Add
                            </Button>
                        </Link>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCloseerrdupe}
                            style={{
                                marginLeft: "10px",
                            }}
                        >
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            {/* Edit DIALOG */}
            <Box>
                <Dialog
                    open={isEditOpen}
                    onClose={handleCloseModEdit}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="md"
                    fullWidth={true}
                >
                    <Box sx={{ padding: "20px 50px" }}>
                        <>
                            <Grid container spacing={2}>
                                <Typography sx={userStyle.HeaderText}>
                                    Edit Visitor Out Entry
                                </Typography>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Equipment Borrowed</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={vendor.equipmentborrowed}
                                            placeholder="Please Enter Equipment Borrowed "
                                            onChange={(e) => {
                                                setVendor({
                                                    ...vendor,
                                                    equipmentborrowed: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            OUT Time <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="time"
                                            placeholder="HH:MM:AM/PM"
                                            value={vendor.outtime}
                                            onChange={(e) => {
                                                setVendor({ ...vendor, outtime: e.target.value });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Remark</Typography>
                                        <TextareaAutosize
                                            aria-label="minimum height"
                                            minRows={2.5}
                                            value={vendor.remark}
                                            onChange={(e) => {
                                                setVendor({
                                                    ...vendor,
                                                    remark: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Follow Up Action <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={300}
                                            options={followUpActionOption}
                                            placeholder="Please Select Follow Up Action"
                                            value={{
                                                label: vendor.followupaction,
                                                value: vendor.followupaction,
                                            }}
                                            onChange={(e) => {
                                                setVendor({
                                                    ...vendor,
                                                    followupaction: e.value,
                                                    followupdate: "",
                                                    followuptime: "",
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                {vendor.followupaction === "Required" && (
                                    <>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Follow Up Date<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="date"
                                                    value={vendor.followupdate}
                                                    onChange={(e) => {
                                                        setVendor({
                                                            ...vendor,
                                                            followupdate: e.target.value,
                                                        });
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Follow Up Time <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="time"
                                                    placeholder="HH:MM:AM/PM"
                                                    value={vendor.followuptime}
                                                    onChange={(e) => {
                                                        setVendor({
                                                            ...vendor,
                                                            followuptime: e.target.value,
                                                        });
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>

                                    </>
                                )}
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Visitor Survey / Feedback</Typography>
                                        <TextareaAutosize
                                            aria-label="minimum height"
                                            minRows={2.5}
                                            value={vendor.visitorsurvey}
                                            onChange={(e) => {
                                                setVendor({
                                                    ...vendor,
                                                    visitorsurvey: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <br /> <br />
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button variant="contained" sx={buttonStyles.buttonsubmit}
                                        onClick={editSubmit}
                                    >
                                        {" "}
                                        Update
                                    </Button>
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

            {/* Edit DIALOG */}
            <Box>
                <Dialog
                    open={isViewOpen}
                    onClose={handleCloseModView}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="lg"
                    fullWidth={true}
                    sx={{ marginTop: "80px" }}
                >
                    <Box sx={{ padding: "20px 50px" }}>
                        <>
                            <Grid container spacing={2}>
                                <Typography sx={userStyle.HeaderText}>
                                    View Visitor Out Entry
                                </Typography>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <AccordionDetails>
                                    <Grid container spacing={2}>
                                        <Grid item xs={8}>
                                            {" "}
                                            <Typography sx={{ fontWeight: "bold" }}>
                                                View Visitor
                                            </Typography>{" "}
                                        </Grid>
                                    </Grid>
                                    <br />
                                    <Grid container spacing={2}>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6"> Company</Typography>
                                            </FormControl>
                                            <Typography>{vendor.company}</Typography>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6"> Branch</Typography>
                                                <Typography>{vendor.branch}</Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6"> Unit</Typography>
                                                <Typography>{vendor.unit}</Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">
                                                    {" "}
                                                    Visitor's ID
                                                </Typography>
                                                <Typography>{vendor.visitorid}</Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">
                                                    {" "}
                                                    Visitor Type
                                                </Typography>
                                                <Typography>{vendor.visitortype}</Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">Visitor Mode</Typography>
                                                <Typography>{vendor.visitormode}</Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">Date</Typography>
                                                <Typography>
                                                    {moment(vendor.date).format("DD-MM-YYYY")}
                                                </Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">Prefix</Typography>
                                                <Typography>{vendor.prefix}</Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">Visitor Name</Typography>
                                                <Typography>{vendor.visitorname}</Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">IN Time</Typography>
                                                <Typography>{vendor.intime}</Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">
                                                    Visitor Purpose
                                                </Typography>
                                                <Typography>{vendor.visitorpurpose}</Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">
                                                    Visitor Contact Number
                                                </Typography>
                                                <Typography>
                                                    {vendor.visitorcontactnumber}
                                                </Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">
                                                    Visitor Email
                                                </Typography>
                                                <Typography>{vendor.visitoremail}</Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">
                                                    Visitor's Company Name
                                                </Typography>
                                                <Typography>
                                                    {vendor.visitorcompnayname}
                                                </Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6} xs={12} sm={12} sx={{ display: "flex" }}>
                                            <Grid item md={12} sm={12} xs={12}>
                                                <Typography variant="h6">Photograph</Typography>
                                                {profile?.map((file, index) => (
                                                    <>
                                                        <Grid container>
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
                                                                            // src={getFileIcon(file.name)}
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
                                                                    width: "300px"
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
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </>
                                                ))}
                                            </Grid>
                                        </Grid>
                                        <Grid item md={12} xs={12} sm={12}>
                                            <Typography sx={{ fontWeight: "bold" }}>
                                                Visitor ID / Document Details
                                            </Typography>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">
                                                    Document Type
                                                </Typography>
                                                <Typography>{vendor.documenttype}</Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">
                                                    Document Number
                                                </Typography>
                                                <Typography>{vendor.documentnumber}</Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6} sm={12} xs={12}>
                                            <Typography variant="h6" >Upload Document</Typography>
                                            <Grid >
                                                <Grid item md={2} sm={12} xs={12}>

                                                </Grid>
                                                <Typography>&nbsp;</Typography>

                                                {/* {vendor?.documentFiles?.length > 0 &&
                                                    vendor?.documentFiles.map((file, index) => (
                                                        <>
                                                            <Grid item md={12} sm={12} xs={12} sx={{ display: "flex" }}>
                                                                <Grid item md={10} sm={6} xs={6}>
                                                                    <Typography>{file.name}</Typography>
                                                                </Grid>
                                                                <Grid item md={1} sm={1} xs={1}>
                                                                    {/* <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreview(file)} /> 
                                                                </Grid>

                                                            </Grid>
                                                        </>
                                                    ))} */}
                                                {vendor?.visitordocument?.length > 0 && vendor?.visitordocument?.map((data, index) => (
                                                    <>
                                                        <Grid container>
                                                            <Grid item md={2} sm={2} xs={2}>
                                                                <Box
                                                                    style={{
                                                                        display: "flex",
                                                                        justifyContent: "center",
                                                                        alignItems: "center",
                                                                    }}
                                                                >

                                                                    <img
                                                                        className={classes.preview}
                                                                        src={getFileIcon(data.name || data.file.name)}
                                                                        height="25"
                                                                        alt="file icon"
                                                                    />
                                                                    {/* )} */}
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
                                                                <Typography variant="subtitle2">
                                                                    {data.name || data.file.name}{" "}
                                                                </Typography>
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
                                                                >
                                                                    <VisibilityOutlinedIcon
                                                                        style={{
                                                                            fontsize: "large",
                                                                            color: "#357AE8",
                                                                        }}
                                                                        onClick={() => renderFilePreviewMulterUploaded(data)}
                                                                    />
                                                                </Button>

                                                            </Grid>
                                                        </Grid>
                                                    </>
                                                ))}
                                            </Grid>
                                        </Grid>
                                        <Grid item md={10} xs={12} sm={12}></Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">
                                                    Address Type
                                                </Typography>

                                                <Typography>
                                                    {vendor.addesstype}
                                                </Typography>

                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">
                                                    Personal Prefix
                                                </Typography>

                                                <Typography>
                                                    {vendor.personalprefix}
                                                </Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">Reference Name </Typography>
                                                <Typography>
                                                    {vendor.referencename}
                                                </Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">
                                                    Landmark Position Prefix
                                                </Typography>


                                                <Typography>
                                                    {vendor.landmarkpositionprefix}
                                                </Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">Landmark Name</Typography>
                                                <Typography>
                                                    {vendor.landmarkname}
                                                </Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">House/Flat No</Typography>
                                                <Typography>
                                                    {vendor.houseflatnumber}
                                                </Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">Street/Road Name</Typography>
                                                <Typography>
                                                    {vendor.streetroadname}
                                                </Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">Locality/Area Name</Typography>
                                                <Typography>
                                                    {vendor.localityareaname}
                                                </Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} sm={12} xs={12}>
                                            <FormControl size="small" fullWidth>
                                                <Typography variant="h6">Country</Typography>
                                                <Typography>
                                                    {vendor.pcountry}
                                                </Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} sm={12} xs={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">State</Typography>
                                                <Typography>
                                                    {vendor.pstate}
                                                </Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} sm={12} xs={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">City</Typography>

                                                <Typography>
                                                    {vendor.pcity}
                                                </Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} sm={12} xs={12}>
                                            <FormControl size="small" fullWidth>
                                                <Typography variant="h6">Pincode</Typography>
                                                <Typography>
                                                    {vendor.ppincode}
                                                </Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">GPS Coordinate</Typography>
                                                <Typography>
                                                    {vendor.gpscoordinate}
                                                </Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">
                                                    Full Address
                                                </Typography>
                                                <TextareaAutosize
                                                    aria-label="minimum height"
                                                    minRows={5}
                                                    value={
                                                        [
                                                            vendor.personalprefix !== "Please Select Personal Prefix" ? vendor.personalprefix : null,
                                                            vendor.referencename,
                                                            vendor.landmarkpositionprefix !== "Please Select Landmark Position Prefix" ? vendor.landmarkpositionprefix : null,
                                                            vendor.landmarkname,
                                                            vendor.houseflatnumber,
                                                            vendor.streetroadname,
                                                            vendor.localityareaname,
                                                            vendor.pcity,
                                                            vendor.pstate,
                                                            vendor.pcountry,
                                                            vendor.ppincode
                                                        ]
                                                            .filter(part => part != null) // Remove null/undefined first
                                                            .map(part => String(part).trim()) // Convert to string and then trim
                                                            .filter(part => part !== "") // Remove empty strings after trim
                                                            .reduce((acc, part) => {
                                                                const trimmedPart = String(part).trim();
                                                                if (!trimmedPart) return acc;

                                                                if (acc.endsWith(',')) {
                                                                    return `${acc} ${trimmedPart}`;
                                                                }
                                                                if (trimmedPart.startsWith(',')) {
                                                                    return `${acc}${trimmedPart}`;
                                                                }
                                                                return acc ? `${acc}, ${trimmedPart}` : trimmedPart;
                                                            }, "")
                                                    }
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={10} xs={12} sm={12}></Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormGroup>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={Boolean(vendor.meetingdetails)}
                                                        />
                                                    }
                                                    readOnly
                                                    label="Meeting Details"
                                                />
                                            </FormGroup>
                                        </Grid>
                                        <Grid item md={9} xs={12} sm={12}></Grid>
                                        {vendor.meetingdetails && (
                                            <>
                                                <Grid item md={12} xs={12} sm={12}>
                                                    <Typography sx={{ fontWeight: "bold" }}>
                                                        Meeting Person
                                                    </Typography>
                                                </Grid>
                                                <Grid item md={4} xs={12} sm={6}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography variant="h6"> Company</Typography>
                                                        <Typography>
                                                            {vendor.meetingpersoncompany
                                                                ?.map((t, i) => `${i + 1 + ". "}` + t)
                                                                .toString()}
                                                        </Typography>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={4} xs={12} sm={6}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography variant="h6"> Branch</Typography>
                                                        <Typography>
                                                            {vendor.meetingpersonbranch
                                                                ?.map((t, i) => `${i + 1 + ". "}` + t)
                                                                .toString()}
                                                        </Typography>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={4} xs={12} sm={6}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography variant="h6"> Unit</Typography>
                                                        <Typography>
                                                            {vendor.meetingpersonunit
                                                                ?.map((t, i) => `${i + 1 + ". "}` + t)
                                                                .toString()}
                                                        </Typography>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={4} xs={12} sm={6}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography variant="h6">
                                                            {" "}
                                                            Department
                                                        </Typography>
                                                        <Typography>
                                                            {vendor.meetingpersondepartment
                                                                ?.map((t, i) => `${i + 1 + ". "}` + t)
                                                                .toString()}
                                                        </Typography>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={4} xs={12} sm={6}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography variant="h6"> Team</Typography>
                                                        <Typography>
                                                            {vendor.meetingpersonteam
                                                                ?.map((t, i) => `${i + 1 + ". "}` + t)
                                                                .toString()}
                                                        </Typography>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={4} xs={12} sm={12}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography variant="h6">
                                                            {" "}
                                                            Employee Name
                                                        </Typography>
                                                        <Typography>
                                                            {vendor.meetingpersonemployeename}
                                                        </Typography>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={12} xs={12} sm={12}>
                                                    <Typography sx={{ fontWeight: "bold" }}>
                                                        Meeting Location
                                                    </Typography>
                                                </Grid>
                                                <Grid item md={4} xs={12} sm={6}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography variant="h6"> Company</Typography>
                                                        <Typography>
                                                            {vendor.meetinglocationcompany
                                                                ?.map((t, i) => `${i + 1 + ". "}` + t)
                                                                .toString()}
                                                        </Typography>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={4} xs={12} sm={6}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography variant="h6"> Branch</Typography>
                                                        <Typography>
                                                            {vendor.meetinglocationbranch
                                                                ?.map((t, i) => `${i + 1 + ". "}` + t)
                                                                .toString()}
                                                        </Typography>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={4} xs={12} sm={6}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography variant="h6"> Unit</Typography>
                                                        <Typography>
                                                            {vendor.meetinglocationunit
                                                                ?.map((t, i) => `${i + 1 + ". "}` + t)
                                                                .toString()}
                                                        </Typography>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={4} xs={12} sm={6}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography variant="h6"> Floor</Typography>
                                                        <Typography>
                                                            {vendor.meetinglocationfloor
                                                                ?.map((t, i) => `${i + 1 + ". "}` + t)
                                                                .toString()}
                                                        </Typography>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={4} xs={12} sm={12}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography variant="h6"> Area</Typography>
                                                        <Typography>
                                                            {vendor.meetinglocationarea}
                                                        </Typography>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={4} xs={12} sm={12}></Grid>
                                            </>
                                        )}
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormGroup>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={Boolean(vendor.escortinformation)}
                                                        />
                                                    }
                                                    readOnly
                                                    label="Escort Information"
                                                />
                                            </FormGroup>
                                        </Grid>
                                        <Grid item md={9} xs={12} sm={12}></Grid>
                                        {vendor.escortinformation && (
                                            <>
                                                <Grid item md={6} xs={12} sm={12}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography variant="h6">

                                                            Escort Details
                                                        </Typography>
                                                        <Typography>{vendor.escortdetails}</Typography>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={6} xs={12} sm={12}></Grid>
                                            </>
                                        )}
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormGroup>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={Boolean(materialVisitor?.materialcarrying?.length > 0)}
                                                        />
                                                    }
                                                    readOnly
                                                    label="Material Carrying"
                                                />
                                            </FormGroup>
                                        </Grid>
                                        <Grid item md={9} xs={12} sm={12}></Grid>
                                        {materialVisitor?.materialcarrying?.length > 0 && (
                                            <>
                                                <Grid item md={6} xs={12} sm={12}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography variant="h6">

                                                            Material Carrying
                                                        </Typography>
                                                        <Typography>{materialVisitor?.materialcarrying?.map((t, i) => `${i + 1}.${t}, `)}</Typography>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={6} xs={12} sm={12}></Grid>
                                            </>
                                        )}
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">
                                                    {" "}
                                                    Equipment Borrowed
                                                </Typography>
                                                <Typography>{vendor.equipmentborrowed}</Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6"> OUT Time</Typography>
                                                <Typography>{vendor.outtime}</Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6"> Remark</Typography>
                                                <Typography>{vendor.remark}</Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">
                                                    {" "}
                                                    Follow Up Action
                                                </Typography>
                                                <Typography>{vendor.followupaction}</Typography>
                                            </FormControl>
                                        </Grid>
                                        {vendor.followupaction === "Required" && (
                                            <>
                                                <Grid item md={3} xs={12} sm={12}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography variant="h6">
                                                            {" "}
                                                            Follow Up Date
                                                        </Typography>
                                                        <Typography>
                                                            {moment(vendor.followupdate).format(
                                                                "DD-MM-YYYY"
                                                            )}
                                                        </Typography>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={3} xs={12} sm={12}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography variant="h6">
                                                            {" "}
                                                            Follow Up Time
                                                        </Typography>
                                                        <Typography>{vendor.followuptime}</Typography>
                                                    </FormControl>
                                                </Grid>
                                            </>
                                        )}
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">
                                                    {" "}
                                                    Visitor Badge / Pass Details
                                                </Typography>
                                                <Typography>{vendor.visitorbadge}</Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">
                                                    {" "}
                                                    Visitor Survey / Feedback
                                                </Typography>
                                                <Typography>{vendor.visitorsurvey}</Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6"> Added By</Typography>
                                                <Typography>{vendor.detailsaddedy}</Typography>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <br /> <br />
                                    <br /> <br />
                                </AccordionDetails>
                            </Grid>

                            <br /> <br />
                            <Grid container spacing={2}>


                                <Grid item md={6} xs={12} sm={12}>
                                    <Button sx={buttonStyles.btncancel} onClick={handleCloseModView}>
                                        {" "}
                                        Back{" "}
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </Dialog>
            </Box>
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
                itemsTwo={visitorAllDataForExport ?? []}
                filename={"Visitors List"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Visitors List Info"
                addedby={addedby}
                updateby={updateby}
            />
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={delVendor}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            <DeleteConfirmation
                open={isDeleteOpencheckbox}
                onClose={handleCloseModcheckbox}
                onConfirm={delVendorcheckbox}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            <PleaseSelectRow
                open={isDeleteOpenalert}
                onClose={handleCloseModalert}
                message="Please Select any Row"
                iconColor="orange"
                buttonText="OK"
            />
        </Box>
    );
}
export default VisitorOutEntry;