import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
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
    Table,
    TableBody,
    TableHead,
    TextField,
    Typography,
    Chip
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../../../components/Errorhandling";
import Headtitle from "../../../../components/Headtitle";
import PageHeading from "../../../../components/PageHeading";
import { StyledTableCell, StyledTableRow } from "../../../../components/Table";
import {
    AuthContext,
    UserRoleAccessContext,
} from "../../../../context/Appcontext";
import { colourStyles, userStyle } from "../../../../pageStyle";
import { SERVICE } from "../../../../services/Baseservice";
import domtoimage from 'dom-to-image';
import { FaFileCsv, FaFileExcel } from "react-icons/fa";
import FormControlLabel from "@mui/material/FormControlLabel";
import {
    NotificationContainer,
    NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import AggregatedSearchBar from '../../../../components/AggregatedSearchBar';
import AggridTable from "../../../../components/AggridTable";
import AlertDialog from "../../../../components/Alert";
import ExportData from "../../../../components/ExportData";
import MessageAlert from "../../../../components/MessageAlert";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

function UserActivity() {



    const [isHandleChange, setIsHandleChange] = useState(false);
    const [searchedString, setSearchedString] = useState("")


    let exportColumnNames = [
        "Employeename",
        "Employeecode",
        "Username",
        "Devicename",
        "App",
        "Title",
        "Company",
        "Branch",
        "Unit",
        "Team",
        "Work Mode",
        "Department",
        "Macaddress",
        "Localip",
        "Timestamp",
        "Status",
    ];
    let exportRowValues =
        [
            "employeename",
            "employeecode",
            "username",
            "devicename",
            "app",
            "title",
            "company",
            "branch",
            "unit",
            "team",
            "workmode",
            "department",
            "macaddress",
            "localip",
            "timestamp",
            "status",
        ]
        ;

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

    const daysoptions = [
        { label: "Yesterday", value: "Yesterday" },
        { label: "Last Week", value: "Last Week" },
        { label: "Last Month", value: "Last Month" },
        { label: "Today", value: "Today" },
        { label: "This Week", value: "This Week" },
        { label: "This Month", value: "This Month" },
        { label: "Custom Fields", value: "Custom Fields" },
    ]

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;

    const [filterUser, setFilterUser] = useState({
        company: "Please Select Company",
        branch: "Please Select Branch",
        fromdate: today,
        todate: today,
        type: "Please Select Type",
        percentage: "",
        day: "Today",
        fromtime: '00:00',
        totime: '23:59'
    });

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


    const [filterState, setFilterState] = useState({
        type: "Individual",
        employeestatus: "Please Select Employee Status",
    });
    const TypeOptions = [
        { label: "Individual", value: "Individual" },
        { label: "Username", value: "Username" },
        { label: "Device Name", value: "Device Name" },
        { label: "Department", value: "Department" },
        { label: "Company", value: "Company" },
        { label: "Branch", value: "Branch" },
        { label: "Unit", value: "Unit" },
        { label: "Team", value: "Team" },
        { label: "Mismatched", value: "Mismatched" },
    ];

    const eventOptions = [
        { label: "Login", value: "Login" },
        { label: "Logoff", value: "Logoff" },
        { label: "Lock", value: "Lock" },
        { label: "Unlock", value: "Unlock" },
        { label: "Sleep", value: "Sleep" },
        { label: "Wake", value: "Wake" },
    ];

    const [selectedOptionsEvent, setSelectedOptionsEvent] = useState([]);
    let [valueEventCat, setValueEventCat] = useState([]);

    const handleEventChange = (options) => {
        setValueEventCat(
            options.map((a, index) => {
                return a.value;
            })
        );

        setSelectedOptionsEvent(options)

    };

    const customValueRendererEvent = (valueEventCat, _categoryname) => {
        return valueEventCat?.length
            ? valueEventCat.map(({ label }) => label)?.join(", ")
            : "Please Select Event Type";
    };


    const [departmentOptions, setDepartmentOptions] = useState([]);
    const fetchDepartments = async () => {
        try {
            let req = await axios.get(SERVICE.DEPARTMENT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDepartmentOptions(
                req?.data?.departmentdetails?.map((data) => ({
                    label: data?.deptname,
                    value: data?.deptname,
                }))
            );
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const [systems, setSystems] = useState([]);
    const [usernames, setUsernames] = useState([]);
    const fetchDropDowns = async () => {
        try {
            let req = await axios.get(SERVICE.USERACTIVITYDROPDOWN_CONTROLLER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let userName = req?.data?.eventstorage[0]?.usernames?.map((data) => ({ label: data, value: data }))
            let systemName = req?.data?.eventstorage[0]?.systems?.map((data) => ({ label: data, value: data }))
            setSystems(systemName?.length > 0 ? systemName : [])
            setUsernames(userName?.length > 0 ? userName : [])

        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    useEffect(() => {
        fetchDepartments();
        fetchDropDowns();
    }, []);

    //department multiselect
    const [selectedOptionsDepartment, setSelectedOptionsDepartment] = useState(
        []
    );
    let [valueDepartmentCat, setValueDepartmentCat] = useState([]);

    const handleDepartmentChange = (options) => {
        setValueDepartmentCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsDepartment(options);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
        setValueEmp([]);
    };

    const customValueRendererDepartment = (valueDepartmentCat, _categoryname) => {
        return valueDepartmentCat?.length
            ? valueDepartmentCat.map(({ label }) => label)?.join(", ")
            : "Please Select Department";
    };
    //employee multiselect
    const [selectedOptionsEmployee, setSelectedOptionsEmployee] = useState([]);
    let [valueEmployeeCat, setValueEmployeeCat] = useState([]);

    const handleEmployeeChange = (options) => {
        setValueEmployeeCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setValueEmp(
            options.map((a, index) => {
                return a.value;
            })
        );

        setSelectedOptionsEmployee(options);
    };

    const customValueRendererEmployee = (valueEmployeeCat, _categoryname) => {
        return valueEmployeeCat?.length
            ? valueEmployeeCat.map(({ label }) => label)?.join(", ")
            : "Please Select Employee";
    };

    const [keyPrimaryShortname, setPrimaryKeyShortname] = useState("")
    const [keyShortname, setKeyShortname] = useState("")

    const [employees, setEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const {
        isUserRoleAccess,
        isUserRoleCompare,
        allUsersData,
        allTeam,
        isAssignBranch,
        pageName,
        setPageName,
        buttonStyles,
        allUsersLimit
    } = useContext(UserRoleAccessContext);


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
            pagename: String("Employee Monitor Log"),
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
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const { auth } = useContext(AuthContext);
    const [allWorkStationOpt, setAllWorkStationOpt] = useState([]);
    const [primaryWorkStation, setPrimaryWorkStation] = useState(
        "Select Primary Workstation"
    );
    const [refreshPage, setRefreshPage] = useState("");
    const [enableWorkstation, setEnableWorkstation] = useState(false);

    const [defaultUsername, setDefaultUsername] = useState("");
    const [empaddform, setEmpaddform] = useState({
    });
    useEffect(() => {
        fetchWorkStation();
        fetchWorkstationSystemname();
    }, []);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [workStationOpt, setWorkStationOpt] = useState([]);
    const [filteredWorkStation, setFilteredWorkStation] = useState([]);
    const [selectedOptionsWorkStation, setSelectedOptionsWorkStation] = useState(
        []
    );
    let [valueWorkStation, setValueWorkStation] = useState("");
    const [isBankdetail, setBankdetail] = useState(false);
    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");

    //image

    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const gridRefTableImg = useRef(null);
    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Employee Monitor Log.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    const [workstationSystemName, setWorkstationSystemName] = useState()

    const fetchWorkstationSystemname = async () => {
        setPageName(!pageName)
        try {
            let res_employee = await axios.get(SERVICE.WORKSTATION, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setBankdetail(true);
            const result = res_employee?.data?.locationgroupings.flatMap((item) => {
                return item.combinstation.flatMap((combinstationItem) => {
                    return combinstationItem.subTodos.length > 0
                        ? combinstationItem.subTodos.map((subTodo) => {
                            return {
                                company: item.company, branch: item.branch, unit: item.unit, floor: item.floor, id: item._id,
                                cabinname: subTodo.subcabinname
                            }
                        })
                        : [{
                            company: item.company, branch: item.branch, unit: item.unit, floor: item.floor, id: item._id,
                            cabinname: combinstationItem.cabinname
                        }
                        ];
                });
            });


            let res_company = await axios.get(SERVICE.COMPANY, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let res_branch = await axios.get(SERVICE.BRANCH, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let res_unit = await axios.get(SERVICE.UNIT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            const rescompanydata = result.map((data, index) => {
                let updatedData = data;
                res_company?.data?.companies.map((item, i) => {
                    if (data.company === item.name) {
                        updatedData = { ...data, companycode: item.code };
                    }
                });

                return updatedData;
            });

            const resBranchdata = rescompanydata.map((data, index) => {
                let updatedData = data;
                res_branch?.data?.branch.map((item, i) => {
                    if (data.branch === item.name) {
                        updatedData = { ...data, branchcode: item.code };
                    }
                });

                return updatedData;
            });

            const resUnitdata = resBranchdata.map((data, index) => {
                let updatedData = data;
                res_unit?.data?.units.map((item, i) => {
                    if (data.unit === item.name) {
                        updatedData = { ...data, unitcode: item.code };
                    }
                });

                return updatedData;
            });


            // Calculate counts dynamically
            const counts = {};

            const updatedData = resUnitdata.map(obj => {

                const key = `${obj.company}-${obj.branch}-${obj.unit}-${obj.floor}`;
                obj.count = (counts[key] || 0) + 1;
                counts[key] = obj.count;

                obj.systemshortname = `${obj?.companycode}_${obj?.branchcode}#${obj.count}#${obj?.unitcode}_${obj.cabinname}`;

                obj.systemshortname = `${obj?.branchcode}_${obj.count}_${obj?.unitcode}_${obj.cabinname}`;

                return obj;
            });
            setWorkstationSystemName(updatedData);
            setBankdetail(false);
        } catch (err) { setBankdetail(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    const fetchWorkStation = async () => {
        setPageName(!pageName);
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

            setAllWorkStationOpt(
                result.flat()?.map((d) => ({
                    ...d,
                    label: d,
                    value: d,
                }))
            );
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    // Copied fields Name
    const handleCopy = (message) => {
        NotificationManager.success(`${message} 👍`, "", 2000);
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
        employeename: true,
        employeecode: true,
        username: true,
        devicename: true,
        app: true,
        title: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        department: true,
        macaddress: true,
        localip: true,
        timestamp: true,
        status: true,
        workmode: true,
        actions: true,

    };

    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );

    const [maxSelections, setMaxSelections] = useState(0);

    // view model
    const [openview, setOpenview] = useState(false);

    const handleClickOpenview = () => {
        setOpenview(true);
    };

    const handleCloseview = () => {
        setOpenview(false);
    };

    const getCode = async (e) => {
        try {
            handleClickOpenview();
            setEmpaddform(e);


        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    // company multi select
    const handleEmployeesChange = (options) => {
        if (maxSelections > 0 && options.length > maxSelections) {
            options = options.slice(0, maxSelections);  // Limit selections to max allowed
        }

        const selectedCabs = options?.map((option) =>
            option?.value?.split('(')[0]) || [];

        const extractBranchAndFloor = (workstation) => {
            const branchAndFloor = (workstation || '').match(/\(([^)]+)\)/)?.[1];
            if (branchAndFloor) {
                const hyphenCount = branchAndFloor.split('-').length - 1;
                const Branch = hyphenCount === 1
                    ? branchAndFloor.split('-')[0].trim()
                    : branchAndFloor.split('-').slice(0, 2).join('-');
                const Floor = hyphenCount === 1
                    ? branchAndFloor.split('-')[1].trim()
                    : hyphenCount === 2 ? branchAndFloor.split('-').pop() : branchAndFloor.split('-').slice(-2).join('-').replace(')', '');
                return { Branch, Floor };
            }
            return {};
        };

        setKeyShortname((prevKeyShortname) => {
            const prevShortnamesArray = prevKeyShortname ? prevKeyShortname.split(', ') : [];

            const newShortnames = options?.map((item) => {
                const { Branch, Floor } = extractBranchAndFloor(item?.value);

                return workstationSystemName
                    ?.filter((workItem) =>
                        workItem.branch === Branch &&
                        (Floor === "" || Floor === workItem?.floor) &&
                        selectedCabs.includes(workItem?.cabinname)
                    )
                    ?.map((workItem) => workItem?.systemshortname);
            }).flat();

            const updatedShortnames = prevShortnamesArray.filter((shortname) =>
                newShortnames.includes(shortname) || selectedCabs.includes(
                    workstationSystemName?.find((workItem) =>
                        workItem?.systemshortname === shortname)?.cabinname
                )
            );

            const mergedShortnames = Array.from(new Set([...updatedShortnames, ...newShortnames]));

            return mergedShortnames.join(', ');
        });

        const updatedOptions = allWorkStationOpt.map((option) => ({
            ...option,
            disabled: maxSelections > 0 && options.length >= maxSelections && !options.find(
                (selectedOption) => selectedOption.value === option.value
            ),
        }));

        setValueWorkStation(options.map((a) => a.value));
        setSelectedOptionsWorkStation(options);
        setFilteredWorkStation(updatedOptions);
    };


    const customValueRendererEmployees = (
        valueWorkStation,
        _filteredWorkStation
    ) => {
        return valueWorkStation.length ? (
            valueWorkStation.map(({ label }) => label).join(", ")
        ) : (
            <span style={{ color: "hsl(0, 0%, 20%)" }}>
                Select Secondary Work Station
            </span>
        );
    };

    // info model
    const [openInfo, setOpeninfo] = useState(false);
    const handleCloseinfo = () => {
        setOpeninfo(false);
    };

    // Edit model
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
        setPrimaryWorkStation("Select Primary Workstation");
        setSelectedOptionsWorkStation([]);
        setPrimaryKeyShortname("")
        setKeyShortname("")
    };


    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    //Boardingupadate updateby edit page...
    let updateby = empaddform?.updatedby;
    let addedby = empaddform?.addedby;

    const shortname = keyPrimaryShortname + keyShortname

    //edit post call.
    let boredit = empaddform?._id;
    const sendRequestt = async () => {
        setPageName(!pageName);

        const shortnameArray = shortname.split(",");

        setPageName(!pageName)
        try {
            let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${boredit}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                usernamepc: String(empaddform?.username),
                updatedby: [
                    ...updateby,
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            setRefreshPage("hello");
            await fetchEmployee();
            setPrimaryKeyShortname("")
            setKeyShortname("")
            handleCloseModEdit();
            setPopupContent('Updated Successfully');
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const editSubmit = (e) => {
        e.preventDefault();
        if (!empaddform.username) {
            setPopupContentMalert('Please Enter Username!');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else {
            sendRequestt();
        }
    };

    //------------------------------------------------------

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    const [fileFormat, setFormat] = useState("xl");
    const gridRefTable = useRef(null);
    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Employee Monitor Log",
        pageStyle: "print",
    });

    //table entries ..,.
    const [items, setItems] = useState([]);
    const [isFiltered, setIsFiltered] = useState(true);

    const addSerialNumber = (datas) => {
        setItems(datas);

    };

    useEffect(() => {
        addSerialNumber(employees);
    }, [employees]);

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

    const totalPages = Math.ceil(employees.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(
        firstVisiblePage + visiblePages - 1,
        totalPages
    );

    const pageNumbers = [];

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

        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 75,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
            pinned: 'left',
        },

        {
            field: "employeename",
            headerName: "Employee Name",
            flex: 0,
            width: 150,
            hide: !columnVisibility.employeename,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "employeecode",
            headerName: "Employee Code",
            flex: 0,
            width: 150,
            hide: !columnVisibility.employeecode,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "username",
            headerName: "Username",
            flex: 0,
            width: 150,
            hide: !columnVisibility.username,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "devicename",
            headerName: "Device Name",
            flex: 0,
            width: 150,
            hide: !columnVisibility.devicename,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "app",
            headerName: "App",
            flex: 0,
            width: 150,
            hide: !columnVisibility.app,
            headerClassName: "bold-header",
        },
        {
            field: "title",
            headerName: "Title",
            flex: 0,
            width: 150,
            hide: !columnVisibility.title,
            headerClassName: "bold-header",
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
            field: "team",
            headerName: "Team",
            flex: 0,
            width: 150,
            hide: !columnVisibility.team,
            headerClassName: "bold-header",
        },
        {
            field: "workmode",
            headerName: "Work Mode",
            flex: 0,
            width: 150,
            hide: !columnVisibility.workmode,
            headerClassName: "bold-header",
        },

        {
            field: "department",
            headerName: "Department",
            flex: 0,
            width: 150,
            hide: !columnVisibility.department,
            headerClassName: "bold-header",
        },

        {
            field: "macaddress",
            headerName: "Mac Address",
            flex: 0,
            width: 150,
            hide: !columnVisibility.macaddress,
            headerClassName: "bold-header",
        },
        {
            field: "localip",
            headerName: "Local IP",
            flex: 0,
            width: 150,
            hide: !columnVisibility.localip,
            headerClassName: "bold-header",
        },
        {
            field: "timestamp",
            headerName: "Time Stamp",
            flex: 0,
            width: 150,
            hide: !columnVisibility.timestamp,
            headerClassName: "bold-header",
        },
        {
            field: "status",
            headerName: "Status",
            flex: 0,
            width: 150,
            hide: !columnVisibility.status,
            headerClassName: "bold-header",
        },

        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 150,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            // Assign Bank Detail
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("vemployeemonitorlog") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getCode(params.data);
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonedit} />
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
            employeename: item?.employeename,
            employeecode: item?.employeecode,
            username: item?.username,
            devicename: item?.devicename,
            app: item?.app,
            title: item?.title,
            company: item?.company,
            branch: item?.branch,
            unit: item?.unit,
            team: item?.team,
            workmode: item?.workmode,
            department: item?.department,
            macaddress: item?.macaddress,
            localip: item?.localip,
            timestamp: item?.timestamp,
            status: item?.status,
            employeeid: item?.employeeid,
        };
    });

    // console.log(rowDataTable)

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

    const [clearState, setClearState] = useState("starting");
    const [checked, setChecked] = useState(false);
    const [keyWordSearch, setKeyWordSearch] = useState("");

    const [valueEmp, setValueEmp] = React.useState([]); // State for employees
    const [isBoxFocused, setIsBoxFocused] = React.useState(false); // Track focus state
    let [valueTeamCat, setValueTeamCat] = useState([]);
    let [valueUnitCat, setValueUnitCat] = useState([]);
    let [valueSystemsCat, setValueSystemsCat] = useState([]);
    let [valueUsernamesCat, setValueUsernamesCat] = useState([]);
    let [valueBranchCat, setValueBranchCat] = useState([]);
    let [valueCompanyCat, setValueCompanyCat] = useState([]);

    const [searchInputValue, setSearchInputValue] = useState('');

    const handlePasteForEmp = (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text');

        // Process the pasted text
        const pastedNames = pastedText
            .split(/[\n,]+/)
            .map(name => name.trim())
            .filter(name => name !== "");

        // Update the state
        updateEmployees(pastedNames);

        // Clear the search input after paste
        setSearchInputValue('');

        // Refocus the element
        e.target.focus();
    };

    useEffect(() => {
        updateEmployees([]); // Pass an empty array instead of an empty string
    }, [allUsersData, valueCompanyCat, valueBranchCat, valueUnitCat, valueTeamCat]);

    const updateEmployees = (pastedNames) => {
        // Your existing update logic...
        const namesArray = Array.isArray(pastedNames) ? pastedNames : [];

        const availableOptions = allUsersData
            ?.filter(
                (comp) =>
                    valueCompanyCat?.includes(comp.company) &&
                    valueBranchCat?.includes(comp.branch) &&
                    valueUnitCat?.includes(comp.unit) &&
                    valueTeamCat?.includes(comp.team)
            )
            ?.map(data => data.companyname.replace(/\s*\.\s*/g, ".").trim())

        const matchedValues = namesArray.filter((name) =>
            availableOptions.includes(name.replace(/\s*\.\s*/g, ".").trim())
        );

        // Update selected options
        const newOptions = matchedValues.map(value => ({
            label: value,
            value: value
        }));

        setSelectedOptionsEmployee(prev => {
            const newValues = newOptions.filter(
                newOpt => !prev.some(prevOpt => prevOpt.value === newOpt.value)
            );
            return [...prev, ...newValues];
        });

        // Update other states...
        setValueEmp(prev => [...new Set([...prev, ...matchedValues])]);
        setValueEmployeeCat(prev => [...new Set([...prev, ...matchedValues])]);
    };

    // Handle clicks outside the Box
    useEffect(() => {
        const handleClickOutside = (e) => {
            const boxElement = document.getElementById("paste-box"); // Add an ID to the Box
            if (boxElement && !boxElement.contains(e.target)) {
                setIsBoxFocused(false); // Reset focus state if clicking outside the Box
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleDelete = (e, value) => {
        e.preventDefault();
        setSelectedOptionsEmployee((current) => current.filter(emp => emp.value !== value));
        setValueEmp((current) => current.filter(empValue => empValue !== value));
        setValueEmployeeCat((current) => current.filter(empValue => empValue !== value));
    };


    const handleClearFilter = () => {
        setValueCompanyCat([]);
        setSelectedOptionsCompany([]);
        setValueBranchCat([]);
        setSelectedOptionsBranch([]);
        setValueUnitCat([]);
        setSelectedOptionsUnit([]);
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
        setValueEmp([]);
        setSelectedOptionsUsernames([]);
        setSelectedOptionsSystems([]);
        setEmployees([]);
        setChecked(false);
        setKeyWordSearch("")
        setFilterState({
            type: "Individual",
            employeestatus: "Please Select Employee Status",
        });
        setFilterUser({
            company: "Please Select Company",
            branch: "Please Select Branch",
            fromdate: today,
            todate: today,
            type: "Please Select Type",
            percentage: "",
            day: "Today",
            fromtime: '00:00',
            totime: '23:59'
        });
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };

    //MULTISELECT ONCHANGE START

    //company multiselect
    const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);

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
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
        setValueEmp([]);
    };

    const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
        return valueCompanyCat?.length
            ? valueCompanyCat.map(({ label }) => label)?.join(", ")
            : "Please Select Company";
    };

    //branch multiselect
    const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);

    const handleBranchChange = (options) => {
        setValueBranchCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsBranch(options);
        setValueUnitCat([]);
        setSelectedOptionsUnit([]);
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
    };

    const customValueRendererBranch = (valueBranchCat, _categoryname) => {
        return valueBranchCat?.length
            ? valueBranchCat.map(({ label }) => label)?.join(", ")
            : "Please Select Branch";
    };


    const [selectedOptionsUsernames, setSelectedOptionsUsernames] = useState([]);

    const handleUsernameChange = (options) => {
        setValueUsernamesCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsUsernames(options);
    };


    const customValueRendererUsername = (valueUsernamesCat, _categoryname) => {
        return valueUsernamesCat?.length
            ? valueUsernamesCat.map(({ label }) => label)?.join(", ")
            : "Please Select Username";
    };


    const [selectedOptionsSystems, setSelectedOptionsSystems] = useState([]);

    const handleSystemsChange = (options) => {
        setValueSystemsCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsSystems(options)

    };

    const customValueRendererSystem = (valueSystemsCat, _categoryname) => {
        return valueSystemsCat?.length
            ? valueSystemsCat.map(({ label }) => label)?.join(", ")
            : "Please Select System";
    };

    //unit multiselect
    const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);

    const handleUnitChange = (options) => {
        setValueUnitCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsUnit(options);
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
    };

    const customValueRendererUnit = (valueUnitCat, _categoryname) => {
        return valueUnitCat?.length
            ? valueUnitCat.map(({ label }) => label)?.join(", ")
            : "Please Select Unit";
    };

    //team multiselect
    const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);

    const handleTeamChange = (options) => {
        setValueTeamCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsTeam(options);
    };

    const customValueRendererTeam = (valueTeamCat, _categoryname) => {
        return valueTeamCat?.length
            ? valueTeamCat.map(({ label }) => label)?.join(", ")
            : "Please Select Team";
    };

    //MULTISELECT ONCHANGE END

    const handleFilter = () => {
        if (
            filterState?.type === "Please Select Type" ||
            filterState?.type === ""
        ) {
            setPopupContentMalert("Please Select Mode!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            checked &&
            keyWordSearch?.trim() === ""
        ) {
            setPopupContentMalert("Please Enter any Keywords to Search!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (["Company"]?.includes(filterState?.type) && selectedOptionsCompany?.length === 0) {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            ["Individual", "Branch", "Unit", "Team"]?.includes(filterState?.type) &&
            selectedOptionsBranch?.length === 0
        ) {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            ["Individual", "Unit", "Team"]?.includes(filterState?.type) &&
            selectedOptionsUnit?.length === 0
        ) {
            setPopupContentMalert("Please Select Unit!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            ["Individual", "Team"]?.includes(filterState?.type) &&
            selectedOptionsTeam?.length === 0
        ) {
            setPopupContentMalert("Please Select Team!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            filterState?.type === "Individual" &&
            selectedOptionsEmployee?.length === 0
        ) {
            setPopupContentMalert("Please Select Employee!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            filterState?.type === "Department" &&
            selectedOptionsDepartment?.length === 0
        ) {
            setPopupContentMalert("Please Select Department!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else if (
            filterState?.type === "Username" &&
            selectedOptionsUsernames?.length === 0
        ) {
            setPopupContentMalert("Please Select Username!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else if (
            filterState?.type === "Device Name" &&
            selectedOptionsSystems?.length === 0
        ) {
            setPopupContentMalert("Please Select Device Name!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else if (
            filterUser?.fromdate === "" ||
            !filterUser?.fromdate
        ) {
            setPopupContentMalert("Please Select From Date!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            filterUser?.todate === "" ||
            !filterUser?.todate
        ) {
            setPopupContentMalert("Please Select To Date!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else if (
            filterUser?.fromtime === "" ||
            !filterUser?.fromtime
        ) {
            setPopupContentMalert("Please Select From Time!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else if (
            filterUser?.totime === "" ||
            !filterUser?.totime
        ) {
            setPopupContentMalert("Please Select To Time!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else {
            fetchEmployee();
        }
    };
    const [allAssignCompany, setAllAssignCompany] = useState([]);
    const [allAssignBranch, setAllAssignBranch] = useState([]);
    const [allAssignUnit, setAllAssignUnit] = useState([]);
    //get all employees list details
    const fetchEmployee = async () => {
        setRefreshPage("sdfsdfsd");
        setBankdetail(true);
        setPageName(!pageName);

        try {

            const aggregationPipeline = ["Username", "Device Name", "Mismatched"]?.includes(filterState.type) ? [{
                $match: {
                    $and: [
                        ...(valueUsernamesCat.length > 0
                            ? [
                                {
                                    username: { $in: valueUsernamesCat },
                                },
                            ]
                            : []),
                        ...(valueSystemsCat.length > 0
                            ? [
                                {
                                    devicename: { $in: valueSystemsCat },
                                },
                            ]
                            : []),
                        {
                            date: {
                                $gte: filterUser?.fromdate,
                                $lte: filterUser?.todate,
                            },
                        },
                        {
                            $expr: {
                                $and: [
                                    {
                                        $gte: [
                                            { $substr: ["$time", 0, 5] }, // Extract "HH:mm" from time field
                                            filterUser?.fromtime,
                                        ],
                                    },
                                    {
                                        $lte: [
                                            { $substr: ["$time", 0, 5] }, // Extract "HH:mm" from time field
                                            filterUser?.totime,
                                        ],
                                    },
                                ],
                            },
                        },
                        ...(filterState?.type === "Mismatched"
                            ? [
                                {
                                    status: "Mismatched", // Add this condition if type is "Mismatched"
                                },
                            ]
                            : []),
                        // Add the condition to check if the keyword search is enabled
                        ...(checked && keyWordSearch && keyWordSearch.trim().length > 0
                            ? [
                                {
                                    $or: [
                                        {
                                            app: {
                                                $regex: keyWordSearch.trim(),
                                                $options: "i", // Case-insensitive search
                                            },
                                        },
                                        {
                                            title: {
                                                $regex: keyWordSearch.trim(),
                                                $options: "i", // Case-insensitive search
                                            },
                                        },
                                    ],
                                },
                            ]
                            : []),
                    ],
                },
            }] : [
                {
                    $match: {
                        $and: [
                            // Conditional company filter
                            ...(valueCompanyCat.length > 0
                                ? [
                                    {
                                        company: { $in: valueCompanyCat },
                                    },
                                ]
                                : [
                                    {
                                        company: { $in: allAssignCompany },
                                    },
                                ]),
                            // Conditional branch filter
                            ...(valueBranchCat.length > 0
                                ? [
                                    {
                                        branch: { $in: valueBranchCat },
                                    },
                                ]
                                : [
                                    {
                                        branch: { $in: allAssignBranch },
                                    },
                                ]),
                            // Conditional unit filter
                            ...(valueUnitCat.length > 0
                                ? [
                                    {
                                        unit: { $in: valueUnitCat },
                                    },
                                ]
                                : [
                                    {
                                        unit: { $in: allAssignUnit },
                                    },
                                ]),
                            // Conditional team filter
                            ...(valueTeamCat.length > 0
                                ? [
                                    {
                                        team: { $in: valueTeamCat },
                                    },
                                ]
                                : []),
                            // Conditional department filter
                            ...(valueDepartmentCat.length > 0
                                ? [
                                    {
                                        department: { $in: valueDepartmentCat },
                                    },
                                ]
                                : []),

                            // Conditional Employee filter
                            ...(valueEmployeeCat.length > 0
                                ? [
                                    {
                                        employeename: { $in: valueEmployeeCat },
                                    },
                                ]
                                : []),

                            ...(valueUsernamesCat.length > 0
                                ? [
                                    {
                                        username: { $in: valueUsernamesCat },
                                    },
                                ]
                                : []),
                            ...(valueSystemsCat.length > 0
                                ? [
                                    {
                                        devicename: { $in: valueSystemsCat },
                                    },
                                ]
                                : []),
                            {
                                date: {
                                    $gte: filterUser?.fromdate,
                                    $lte: filterUser?.todate,
                                },
                            },
                            {
                                $expr: {
                                    $and: [
                                        {
                                            $gte: [
                                                { $substr: ["$time", 0, 5] }, // Extract "HH:mm" from time field
                                                filterUser?.fromtime,
                                            ],
                                        },
                                        {
                                            $lte: [
                                                { $substr: ["$time", 0, 5] }, // Extract "HH:mm" from time field
                                                filterUser?.totime,
                                            ],
                                        },
                                    ],
                                },
                            },

                            // Add the condition to check if the keyword search is enabled
                            ...(checked && keyWordSearch && keyWordSearch.trim().length > 0
                                ? [
                                    {
                                        $or: [
                                            {
                                                app: {
                                                    $regex: keyWordSearch.trim(),
                                                    $options: "i", // Case-insensitive search
                                                },
                                            },
                                            {
                                                title: {
                                                    $regex: keyWordSearch.trim(),
                                                    $options: "i", // Case-insensitive search
                                                },
                                            },
                                        ],
                                    },
                                ]
                                : []),
                        ],
                    },
                }
            ];
            console.log(aggregationPipeline, "aggregationPipeline");
            let response = await axios.post(
                SERVICE.DYNAMIC_USERACTIVITY_CONTROLLER,
                {
                    aggregationPipeline,
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );

            const responseDataUsers = response?.data?.users;
            const itemsWithSerialNumber = responseDataUsers?.map((item, index) => ({
                ...item,
                serialNumber: index + 1,
                timestamp: moment(item?.timestamp).format('DD-MM-YYYY hh:mm:ss A'),
            }));
            setEmployees(itemsWithSerialNumber);
            setBankdetail(false);
            setRefreshPage("lsdfnaskhfajksn");
        } catch (err) {
            console.log(err, "errfilter")
            setBankdetail(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
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

            setSelectedOptionsEvent(eventOptions)
            setValueEventCat(
                eventOptions.map((a, index) => {
                    return a.value;
                })
            );

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
            //----------------------------
            let mappedemployees = allUsersData
                ?.filter(
                    (u) =>
                        selectedCompany?.includes(u.company) &&
                        selectedBranch?.includes(u.branch) &&
                        selectedUnit?.includes(u.unit) &&
                        selectedTeam?.includes(u.team)
                )
                .map((u) => ({
                    label: u.companyname,
                    value: u.companyname,
                }));

            let employees = allUsersData
                ?.filter(
                    (u) =>
                        selectedCompany?.includes(u.company) &&
                        selectedBranch?.includes(u.branch) &&
                        selectedUnit?.includes(u.unit) &&
                        selectedTeam?.includes(u.team)
                )
                .map((u) => u.companyname);
            setValueEmployeeCat(employees);
            setSelectedOptionsEmployee(mappedemployees);

            setValueEmp(mappedemployees?.map((item) => item?.value));
            //-----------------
            setValueTeamCat(selectedTeam);
            setSelectedOptionsTeam(mappedTeam);
            setAllAssignCompany(selectedCompany);

            setAllAssignBranch(selectedBranch);

            setAllAssignUnit(selectedUnit);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    useEffect(() => {
        handleAutoSelect();
    }, [isAssignBranch]);


    return (
        <Box>
            <NotificationContainer />
            {/* ****** Header Content ****** */}
            <Headtitle title={"EMPLOYEE MONITOR LOG"} />

            <PageHeading
                title="Manage Employee Monitor Log"
                modulename="Human Resources"
                submodulename="HR"
                mainpagename="Employee"
                subpagename="Employee Status Details"
                subsubpagename="Employee Monitor Log"
            />
            <br />
            {isUserRoleCompare?.includes("lemployeemonitorlog") && (
                <>
                    <Box sx={userStyle.selectcontainer}>
                        <Grid container spacing={2}>
                            <>

                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Mode<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={TypeOptions}
                                            styles={colourStyles}
                                            value={{
                                                label: filterState.type ?? "Please Select Type",
                                                value: filterState.type ?? "Please Select Type",
                                            }}
                                            onChange={(e) => {
                                                setFilterState((prev) => ({
                                                    ...prev,
                                                    type: e.value,
                                                }));
                                                setValueCompanyCat([]);
                                                setSelectedOptionsCompany([]);
                                                setValueBranchCat([]);
                                                setSelectedOptionsBranch([]);
                                                setValueUnitCat([]);
                                                setSelectedOptionsUnit([]);
                                                setValueTeamCat([]);
                                                setSelectedOptionsTeam([]);
                                                setValueDepartmentCat([]);
                                                setSelectedOptionsDepartment([]);
                                                setValueEmployeeCat([]);
                                                setSelectedOptionsEmployee([]);
                                                setValueEmp([]); setSelectedOptionsUsernames([]);
                                                setSelectedOptionsSystems([]);
                                            }}
                                        />
                                    </FormControl>
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={checked} onChange={(event) => {
                                                setChecked(event.target.checked);
                                                setKeyWordSearch("")
                                            }} />
                                        }
                                        label="Keyword Search"
                                    />

                                </Grid>
                                {checked && (<Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Keywords <b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            placeholder="Please Enter Keywords to Search"
                                            value={keyWordSearch}
                                            onChange={(e) =>
                                                setKeyWordSearch(e.target.value)
                                            }
                                        />
                                    </FormControl>
                                </Grid>)}

                                {["Individual", "Team"]?.includes(filterState.type) ? (
                                    <>
                                        {/* Branch Unit Team */}
                                        <Grid item md={3} xs={12} sm={12}>
                                            <Typography>
                                                Company<b style={{ color: "red" }}>*</b>
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
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Branch <b style={{ color: "red" }}>*</b>
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
                                                        handleBranchChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererBranch}
                                                    labelledBy="Please Select Branch"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Unit<b style={{ color: "red" }}>*</b>
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
                                        <Grid item md={3} xs={12} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Team<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={allTeam
                                                        ?.filter(
                                                            (u) =>
                                                                valueCompanyCat?.includes(u.company) &&
                                                                valueBranchCat?.includes(u.branch) &&
                                                                valueUnitCat?.includes(u.unit)
                                                        )
                                                        .map((u) => ({
                                                            ...u,
                                                            label: u.teamname,
                                                            value: u.teamname,
                                                        }))}
                                                    value={selectedOptionsTeam}
                                                    onChange={(e) => {
                                                        handleTeamChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererTeam}
                                                    labelledBy="Please Select Team"
                                                />
                                            </FormControl>
                                        </Grid>
                                    </>
                                ) : ["Department"]?.includes(filterState.type) ? (
                                    <>
                                        {/* Department */}
                                        <Grid item md={3} xs={12} sm={12}>
                                            <Typography>
                                                Company<b style={{ color: "red" }}>*</b>
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
                                        <Grid item md={3} xs={12} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Department<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={departmentOptions}
                                                    value={selectedOptionsDepartment}
                                                    onChange={(e) => {
                                                        handleDepartmentChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererDepartment}
                                                    labelledBy="Please Select Department"
                                                />
                                            </FormControl>
                                        </Grid>
                                    </>
                                ) : ["Branch"]?.includes(filterState.type) ? (
                                    <>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <Typography>
                                                Company<b style={{ color: "red" }}>*</b>
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
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Branch <b style={{ color: "red" }}>*</b>
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
                                                        handleBranchChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererBranch}
                                                    labelledBy="Please Select Branch"
                                                />
                                            </FormControl>
                                        </Grid>
                                    </>
                                ) : ["Unit"]?.includes(filterState.type) ? (
                                    <>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <Typography>
                                                Company<b style={{ color: "red" }}>*</b>
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
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Branch<b style={{ color: "red" }}>*</b>
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
                                                        handleBranchChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererBranch}
                                                    labelledBy="Please Select Branch"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Unit <b style={{ color: "red" }}>*</b>
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
                                    </>
                                ) : ["Company"]?.includes(filterState.type) ? (
                                    <>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <Typography>
                                                Company<b style={{ color: "red" }}>*</b>
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

                                    </>
                                ) : ["Username"]?.includes(filterState.type) ? (
                                    <>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <Typography>
                                                Username<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <FormControl size="small" fullWidth>
                                                <MultiSelect
                                                    options={usernames}
                                                    value={selectedOptionsUsernames}
                                                    onChange={(e) => {
                                                        handleUsernameChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererUsername}
                                                    labelledBy="Please Select Username"
                                                />
                                            </FormControl>
                                        </Grid>

                                    </>
                                ) : ["Device Name"]?.includes(filterState.type) ? (
                                    <>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <Typography>
                                                Device Name<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <FormControl size="small" fullWidth>
                                                <MultiSelect
                                                    options={systems}
                                                    value={selectedOptionsSystems}
                                                    onChange={(e) => {
                                                        handleSystemsChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererSystem}
                                                    labelledBy="Please Select Device Name"
                                                />
                                            </FormControl>
                                        </Grid>

                                    </>
                                ) : (
                                    ""
                                )}
                                {["Individual"]?.includes(filterState.type) && (
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Employee<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <div
                                                onPaste={handlePasteForEmp}
                                                style={{ position: 'relative' }}
                                            >
                                                <MultiSelect
                                                    options={allUsersData
                                                        ?.filter(
                                                            (u) =>
                                                                valueCompanyCat?.includes(u.company) &&
                                                                valueBranchCat?.includes(u.branch) &&
                                                                valueUnitCat?.includes(u.unit) &&
                                                                valueTeamCat?.includes(u.team)

                                                        )
                                                        .map((u) => ({
                                                            label: u.companyname,
                                                            value: u.companyname,
                                                        }))}
                                                    value={selectedOptionsEmployee}
                                                    onChange={(e) => {
                                                        handleEmployeeChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererEmployee}
                                                    labelledBy="Please Select Employee"
                                                    // Add these props if your MultiSelect supports them
                                                    inputValue={searchInputValue} // Add this state if needed
                                                    onInputChange={(newValue) => setSearchInputValue(newValue)}
                                                />
                                            </div>
                                        </FormControl>
                                    </Grid>
                                )}
                                {["Individual"]?.includes(filterState.type) &&
                                    <Grid item md={6} sm={12} xs={12} sx={{ display: "flex", flexDirection: "row" }}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Selected Employees</Typography>
                                            <div
                                                id="paste-box" // Add an ID to the Box
                                                tabIndex={0} // Make the div focusable
                                                style={{
                                                    border: '1px solid #ccc',
                                                    borderRadius: '3.75px',
                                                    height: '110px',
                                                    overflow: 'auto',
                                                }}
                                                onPaste={handlePasteForEmp}
                                                onFocus={() => setIsBoxFocused(true)} // Set focus state to true
                                                onBlur={(e) => {
                                                    if (isBoxFocused) {
                                                        e.target.focus(); // Refocus only if the Box was previously focused
                                                    }
                                                }}
                                            >
                                                {valueEmp.map((value) => (
                                                    <Chip
                                                        key={value}
                                                        label={value}
                                                        clickable
                                                        sx={{ margin: 0.2, backgroundColor: "#FFF" }}
                                                        onDelete={(e) => handleDelete(e, value)}
                                                        onClick={() => console.log("clicked chip")}
                                                    />
                                                ))}
                                            </div>
                                        </FormControl>
                                    </Grid>
                                }

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
                                <Grid item md={1.5} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            {" "}
                                            From Time<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="from-time"
                                            type="time"
                                            value={filterUser.fromtime}
                                            onChange={(e) => {
                                                const newFromDate = e.target.value;
                                                setFilterUser((prevState) => ({
                                                    ...prevState,
                                                    fromtime: newFromDate,
                                                }));
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={1.5} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            {" "}
                                            To Time<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="to-time"
                                            type="time"
                                            value={filterUser.totime}
                                            onChange={(e) => {
                                                const newFromDate = e.target.value;
                                                console.log(newFromDate)
                                                setFilterUser((prevState) => ({
                                                    ...prevState,
                                                    totime: newFromDate,
                                                }));
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </>
                        </Grid>
                        <br />
                        <br />
                        <br />
                        <Grid
                            container
                            spacing={2}
                            sx={{ display: "flex", justifyContent: "center" }}
                        >
                            <Grid item lg={1} md={2} sm={2} xs={12}>
                                <Button
                                    sx={buttonStyles.buttonsubmit}
                                    variant="contained"
                                    onClick={handleFilter}
                                >
                                    {" "}
                                    Filter{" "}
                                </Button>
                            </Grid>
                            <Grid item lg={1} md={2} sm={2} xs={12}>
                                <Button
                                    sx={buttonStyles.btncancel}
                                    onClick={() => {
                                        handleClearFilter();
                                    }}
                                >
                                    {" "}
                                    Clear{" "}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </>
            )
            }
            <br />
            <>
                <Box sx={userStyle.container}>
                    {/* ******************************************************EXPORT Buttons****************************************************** */}
                    <Grid item xs={8}>
                        <Typography sx={userStyle.importheadtext}>
                            Employee Monitor Log List
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
                                    <MenuItem value={employees?.length}>All</MenuItem>
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
                                {isUserRoleCompare?.includes("excelemployeemonitorlog") && (
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
                                {isUserRoleCompare?.includes("csvemployeemonitorlog") && (
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
                                {isUserRoleCompare?.includes("printemployeemonitorlog") && (
                                    <>
                                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                            &ensp;
                                            <FaPrint />
                                            &ensp;Print&ensp;
                                        </Button>
                                    </>
                                )}
                                {isUserRoleCompare?.includes("pdfemployeemonitorlog") && (
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
                                {isUserRoleCompare?.includes("imageemployeemonitorlog") && (
                                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                        {" "}
                                        <ImageIcon
                                            sx={{ fontSize: "15px" }}
                                        /> &ensp;Image&ensp;{" "}
                                    </Button>
                                )}
                            </Box>
                        </Grid>
                        <Grid item md={2} xs={6} sm={6}>



                            <AggregatedSearchBar
                                columnDataTable={columnDataTable}
                                setItems={setItems}
                                addSerialNumber={addSerialNumber}
                                setPage={setPage}
                                maindatas={employees}
                                setSearchedString={setSearchedString}
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                paginated={false}
                                totalDatas={employees}
                            />
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
                    {isBankdetail ? (
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
                            {/* <AggridTable
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
                                gridRefTable={gridRef}
                                paginated={false}
                                filteredDatas={filteredDatas}
                                handleShowAllColumns={handleShowAllColumns}
                            /> */}


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
                                // totalDatas={totalProjects}
                                searchQuery={searchQuery}
                                handleShowAllColumns={handleShowAllColumns}
                                setFilteredRowData={setFilteredRowData}
                                filteredRowData={filteredRowData}
                                setFilteredChanges={setFilteredChanges}
                                filteredChanges={filteredChanges}
                                gridRefTableImg={gridRefTableImg}
                                itemsList={employees}
                            />
                        </>
                    )}
                </Box>
            </>

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

            {/* Delete Modal */}
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <Box>
                {/* Edit DIALOG */}
                <Dialog
                    open={isEditOpen}
                    onClose={handleCloseModEdit}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="md"
                    sx={{
                        overflow: "visible",
                        "& .MuiPaper-root": {
                            overflow: "auto",
                        },
                        marginTop: '50px'
                    }}
                >
                    <Box sx={userStyle.dialogbox}>
                        <>
                            <Typography sx={userStyle.SubHeaderText}>
                                Edit Employee Monitor Log Info
                            </Typography>
                            <br />
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={6} sm={12} xs={12}>
                                    <Grid container spacing={2}>
                                        <Grid item md={6} sm={12} xs={12}>
                                            <Typography sx={{ fontWeight: "bold" }}>
                                                Employee Name :
                                            </Typography>
                                        </Grid>
                                        <Grid item md={6} sm={12} xs={12}>
                                            <Typography>{empaddform.companyname}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item md={6} sm={12} xs={12}>
                                    <Grid container spacing={2}>
                                        <Grid item md={6} sm={12} xs={12}>
                                            <Typography sx={{ fontWeight: "bold" }}>
                                                Emp Code :
                                            </Typography>
                                        </Grid>
                                        <Grid item md={6} sm={12} xs={12}>
                                            <Typography>{empaddform.empcode}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>{" "}
                            <br />
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Company</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={empaddform.company}
                                            readOnly
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Branch</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={empaddform.branch}
                                            readOnly
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Unit</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={empaddform.unit}
                                            readOnly
                                        />
                                    </FormControl>
                                </Grid>

                            </Grid>
                            <br /> <br /> <br />
                            <Grid container>
                                <Grid item md={1}></Grid>
                                <Button variant="contained" onClick={editSubmit} sx={buttonStyles.buttonsubmit}>
                                    Update
                                </Button>
                                <Grid item md={1}></Grid>
                                <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit}>
                                    Cancel
                                </Button>
                            </Grid>
                        </>
                    </Box>
                </Dialog>
            </Box>

            {/* this is info view details */}

            <Dialog
                open={openInfo}
                onClose={handleCloseinfo}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
            >
                <Box sx={{ width: "550px", padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>
                            {" "}
                            Work Station Info
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
                            <br />
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
                            <Button variant="contained" onClick={handleCloseinfo} sx={buttonStyles.btncancel}>
                                {" "}
                                Back{" "}
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>

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

            <ExportData
                isFilterOpen={isFilterOpen}
                handleCloseFilterMod={handleCloseFilterMod}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen}
                isPdfFilterOpen={isPdfFilterOpen}
                setIsPdfFilterOpen={setIsPdfFilterOpen}
                handleClosePdfFilterMod={handleClosePdfFilterMod}
                filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
                itemsTwo={employees ?? []}
                filename={"Employee Monitor Log"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />

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
            {/* view model */}
            <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" fullWidth={true} sx={{ marginTop: '50px' }}>
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Employee Monitor Log</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>

                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Company</Typography>
                                    <Typography>{empaddform?.company}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Branch</Typography>
                                    <Typography>{empaddform?.branch}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Unit</Typography>
                                    <Typography>{empaddform?.unit}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Team</Typography>
                                    <Typography>{empaddform?.team}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Department</Typography>
                                    <Typography>{empaddform?.department}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Employee code</Typography>
                                    <Typography>{empaddform?.employeecode}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Employee Name</Typography>
                                    <Typography>{empaddform?.employeename}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Username</Typography>
                                    <Typography>{empaddform?.username}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Device Name</Typography>
                                    <Typography>{empaddform?.devicename}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">App</Typography>
                                    <Typography>{empaddform?.app}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Title</Typography>
                                    <Typography>{empaddform?.title}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Mac Address</Typography>
                                    <Typography>{empaddform?.macaddress}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Local IP</Typography>
                                    <Typography>{empaddform?.localip}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Timestamp</Typography>
                                    <Typography>{empaddform?.timestamp}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Status</Typography>
                                    <Typography>{empaddform?.status}</Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button variant="contained" color="primary" onClick={handleCloseview} sx={buttonStyles.btncancel}>
                                {" "}
                                Back{" "}
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>
        </Box >
    );
}

export default UserActivity;