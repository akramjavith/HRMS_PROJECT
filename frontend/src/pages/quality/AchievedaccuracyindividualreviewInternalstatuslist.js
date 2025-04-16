import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton, List, ListItem, ListItemText, MenuItem, OutlinedInput, Paper, Popover, Select, Table, TableBody, TableContainer, TableHead, TextField, Typography } from "@mui/material";
import Switch from '@mui/material/Switch';
import axios from "axios";
import domtoimage from 'dom-to-image';
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import AggregatedSearchBar from '../../components/AggregatedSearchBar';
import AggridTable from "../../components/AggridTable";
import AlertDialog from "../../components/Alert";
import { handleApiError } from "../../components/Errorhandling";
import ExportData from "../../components/ExportData";
import Headtitle from "../../components/Headtitle";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import { StyledTableCell, StyledTableRow } from "../../components/Table";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";

function AchievedAccuracyIndividualReviewInternalstatusList() {

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

    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);

    const [overallItems, setOverallItems] = useState([]);
    const pathname = window.location.pathname;
    const [employees, setEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [getIndexData, setGetIndexData] = useState("");
    const [isHandleChange, setIsHandleChange] = useState(false);
    const [searchedString, setSearchedString] = useState("")
    const { isUserRoleAccess, isUserRoleCompare, allUsersData, isAssignBranch, allTeam, pageName, setPageName,
        buttonStyles } = useContext(
            UserRoleAccessContext
        );

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

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Achieved Accuracy Individual Review Internal Status List"),
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

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const { auth } = useContext(AuthContext);
    //Delete model
    const [isDeleteOpen, setisDeleteOpen] = useState(false);
    const handleClickOpendel = () => {
        setisDeleteOpen(true);
    };
    const handleCloseDel = () => {
        setisDeleteOpen(false);
    };
    const [isBankdetail, setBankdetail] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };
    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };
    const gridRefTable = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [updatedFieldEmployee, setUpdatedFieldEmployee] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState('');
    const cuurentDate = new Date();
    const [gotList, setGotList] = useState([]);
    const [pointsFilter, setPointsFilter] = useState({ fromdate: today, todate: today, greater: "", less: "", betweenfrom: "", betweento: "", compare: "All" });
    //  Datefield
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    const compares = [
        { label: "Less than", value: "Less than" },
        { label: "Greater than", value: "Greater than" },
        { label: "Between", value: "Between" },
        { label: "All", value: "All" },
    ];
    const [typeOptValue, setTypeOptValue] = useState([])
    const [typeOptValueReq, setTypeOptValueReq] = useState([])
    const handleChangeType = (opt) => {
        setTypeOptValue(opt);
        setTypeOptValueReq(opt.map((a, index) => {
            return a.value;
        }))
    }
    const customValueRendererEditCompanyFromEdit = (typeOptValueReq, _employeename) => {
        return typeOptValueReq?.length ? typeOptValueReq.map(({ label }) => label).join(", ") : "Please select Type";
    };
    const typeOptions = [
        { label: "Penalty", value: "Penalty" },
        { label: "Bonus", value: "Bonus" },
    ];
    const [filterUser, setFilterUser] = useState({
        company: "Please Select Company",
        branch: "Please Select Branch",
        fromdate: today,
        todate: today,
        type: "Please Select Type",
        percentage: "",
        day: "Today"
    });
    //company multiselect
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
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
        setValueCate([]);
        setSelectedOptionsCate([]);
    };
    const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
        return valueCompanyCat?.length
            ? valueCompanyCat.map(({ label }) => label)?.join(", ")
            : "Please Select Company";
    };
    //branch multiselect
    const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
    let [valueBranchCat, setValueBranchCat] = useState([]);
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
        setValueCate([]);
        setSelectedOptionsCate([]);
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
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
        setValueCate([]);
        setSelectedOptionsCate([]);
    };
    const customValueRendererUnit = (valueUnitCat, _categoryname) => {
        return valueUnitCat?.length
            ? valueUnitCat.map(({ label }) => label)?.join(", ")
            : "Please Select Unit";
    };
    //team multiselect
    const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
    let [valueTeamCat, setValueTeamCat] = useState([]);
    const handleTeamChange = (options) => {
        setValueTeamCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsTeam(options);
        setValueCate([]);
        setSelectedOptionsCate([]);
    };
    const customValueRendererTeam = (valueTeamCat, _categoryname) => {
        return valueTeamCat?.length
            ? valueTeamCat.map(({ label }) => label)?.join(", ")
            : "Please Select Team";
    };
    //Employee Multi Select
    const [selectedOptionsCate, setSelectedOptionsCate] = useState([]);
    const [valueCate, setValueCate] = useState([]);
    const handleCategoryChange = (options) => {
        setValueCate(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCate(options);
    };
    const customValueRendererCate = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please Select Employee Name";
    };
    const handleClear = async (e) => {
        e.preventDefault();
        setFilterUser({
            fromdate: today,
            todate: today, type: "Please Select Type", percentage: ""
        });
        setPointsFilter({ fromdate: today, todate: today, greater: "", less: "", betweenfrom: "", betweento: "", compare: "All" });
        setTypeOptValue([]);
        setEmployees([]);
        setValueCompanyCat([]);
        setSelectedOptionsCompany([]);
        setValueBranchCat([]);
        setSelectedOptionsBranch([]);
        setValueUnitCat([]);
        setSelectedOptionsUnit([]);
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
        setValueCate([]);
        setSelectedOptionsCate([]);
        setPage(1);
        setFilterUser({
            company: "Please Select Company",
            branch: "Please Select Branch",
            fromdate: today,
            todate: today,
            type: "Please Select Type",
            percentage: "",
            day: "Today"
        });
        setPopupContent('Cleared Successfully');
        setPopupSeverity("success");
        handleClickOpenPopup();
    };
    //image
    const handleSubmission = async () => {
        setBankdetail(false);
        // if (selectedOptionsCompany?.length === 0) {
        //     setPopupContentMalert('Please Select Company!');
        //     setPopupSeverityMalert("info");
        //     handleClickOpenPopupMalert();
        // }
        // else
      
        if ((filterUser.fromdate === "" && filterUser.todate === "")) {
            setPopupContentMalert('Please fill from or to date!');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (pointsFilter.compare === "Less than" && (pointsFilter.less == "" || pointsFilter.less == undefined)) {
            setPopupContentMalert('Please Enter Less than Value!');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        }
        else if (pointsFilter.compare === "Greater than" && (pointsFilter.greater == "" || pointsFilter.greater == undefined)) {
            setPopupContentMalert('Please Enter Greater Value!');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            pointsFilter.compare === "Between" &&
            ((pointsFilter.betweenfrom == "" || pointsFilter.betweenfrom == undefined) ||
                (pointsFilter.betweento == "" || pointsFilter.betweento == undefined))
        ) {
            setPopupContentMalert('Please Enter Values!');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        setPageName(!pageName)
        setSearchQuery("")
        try {
            let comps = selectedOptionsCompany.map((data) => data.value);
            let branchs = selectedOptionsBranch.map((data) => data.value);
            let units = selectedOptionsUnit.map((data) => data.value);
            let teams = selectedOptionsTeam.map((data) => data.value);
            let emps = selectedOptionsCate.map((data) => data.value);
            let types = typeOptValue.map((data) => data.value);
            let request = await axios.post(SERVICE.ACHIEVEDACCURACYINDIVIDUALFILTER, {
                company: comps.length !== 0 ? comps : "",
                branch: branchs.length !== 0 ? branchs : "",
                unit: units.length !== 0 ? units : "",
                team: teams.length !== 0 ? teams : "",
                employeename: emps.length !== 0 ? emps : "",
                fromDate: filterUser.fromdate,
                type: types.length !== 0 ? types : "",
                toDate: filterUser.todate,
                compare: pointsFilter.compare,
                lessThanValue: pointsFilter.less,
                greaterThanValue: pointsFilter.greater,
                fromValue: pointsFilter.betweenfrom,
                toValue: pointsFilter.betweento,
                fromWhere: "Internal"
            });


            let withCompany = request?.data?.filteredData?.filter((item) => item.company !== "")?.filter((data) => {
                return accessbranch.some((acc) => acc.branch === data.branch && acc.company === data.company && acc.unit === data.unit)
            })
            let withoutCompany = request?.data?.filteredData?.filter((item) => item.company === "" || !item.company)

            const itemsWithSerialNumber = [...withCompany, ...withoutCompany]?.map((item, index) => ({ ...item, serialNumber: index + 1, date: moment(item.date).format('DD-MM-YYYY') }));
            setEmployees(itemsWithSerialNumber);
            setBankdetail(true);
        } catch (err) { setBankdetail(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }
    const gridRefTableImg = useRef(null);
    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Achieved Accuracy Individual Review Internal Status List.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };
    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };
    // view model
    const [openview, setOpenview] = useState(false);
    const handleClickOpenview = () => {
        setOpenview(true);
    };
    const handleCloseview = () => {
        setOpenview(false);
    };
    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
    const handleCloseModalert = () => {
        setIsDeleteOpenalert(false);
    };
    // Manage Columns
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null)
    const handleOpenManageColumns = (event) => {
        setAnchorEl(event.currentTarget);
        setManageColumnsOpen(true);
    };
    const handleCloseManageColumns = () => {
        setManageColumnsOpen(false);
        setSearchQueryManage("")
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const getRowClassName = (params) => {
        if ((selectedRows).includes(params.row.editid)) {
            return 'custom-id-row'; // This is the custom class for rows with item.tat === 'ago'
        }
        return ''; // Return an empty string for other rows
    };
    // Show All Columns & Manage Columns 
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        date: true,
        project: true,
        vendor: true,
        queue: true,
        loginid: true,
        minimumaccuracy: true,
        internalstatus: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        employeename: true,
        accuracy: true,
        totalfield: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
    // get single userdata to view
    const [userReport, setUserReport] = useState({
        empcode: "",
        companyname: "",
        company: "",
        branch: "",
        unit: "",
        floor: "",
        workstation: ""
    });
    // get single row to view....
    const getinfoCode = async (e) => {
        setOverallList((prev) => ({
            ...prev, ...e
        }))
        handleClickOpenInfo();
    };
    const [isEditOpen, setIsEditOpen] = useState(false);
    // Edit model
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
    };
    const [allWorkStationOpt, setAllWorkStationOpt] = useState([]);
    const [primaryWorkStation, setPrimaryWorkStation] = useState("Select Primary Workstation");
    const [workStationOpt, setWorkStationOpt] = useState([]);
    const [updateWorkStation, setUpdateworkStation] = useState([]);
    const [filteredWorkStation, setFilteredWorkStation] = useState([]);
    const [selectedOptionsWorkStation, setSelectedOptionsWorkStation] = useState([]);
    const [maxSelections, setMaxSelections] = useState(0);
    const [empaddform, setEmpaddform] = useState({
        company: "",
        branch: "",
        unit: "",
        floor: "",
        workstation: "Please Select Work Station",
    });
    let [valueWorkStation, setValueWorkStation] = useState("");
    const [overallList, setOverallList] = useState({
        date: "",
        project: "",
        vendor: "",
        queue: "",
        loginid: "",
        accuracy: "",
        totalfield: "",
        company: "",
        branch: "",
        unit: "",
        team: "",
        employeename: "",
    });
    //get all employees list details
    // const fetchAchievedAccuracyIndividual = async () => {
    //     console.log("inside")
    //     setPageName(!pageName)
    //     try {
    //         let res_employee = await axios.get(SERVICE.GETACHEIVEDACCURACYINDIVIDUAL, {
    //             headers: {
    //                 Authorization: `Bearer ${auth.APIToken}`,
    //             },
    //         });
    //         console.log(res_employee?.data?.achievedaccuracyindividual,"res_employee?.data?.achievedaccuracyindividual")
    //         let data_emp = res_employee?.data?.achievedaccuracyindividual.flatMap((data) => {
    //             return data.uploaddata.map((item) => {
    //                 return {
    //                     id: item?._id,
    //                     date: item?.date,
    //                     project: item?.project,
    //                     vendor: item?.vendor,
    //                     queue: item?.queue,
    //                     loginid: item?.loginid.trim(),
    //                     accuracy: item?.accuracy,
    //                     totalfield: item?.totalfield,
    //                     projectvendor: item?.vendor.replace(/[-_ ]/g, "")
    //                 }
    //             })
    //         });
    //         console.log(data_emp,"data_emp")
    //         let users = await axios.get(SERVICE.USERALLLIMIT)
    //         let definedUsers = users?.data?.users?.map((data) => {
    //             return {
    //                 employeename: data?.companyname,
    //                 company: data?.company,
    //                 branch: data?.branch,
    //                 unit: data?.unit,
    //                 team: data?.team,
    //             }
    //         })
    //         console.log(definedUsers,"definedUsers")
    //         let res = await axios.get(SERVICE.ALL_CLIENTUSERIDDATA);
    //         let allottedList = res?.data?.clientuserid.filter((data) => {
    //             return data.allotted === "allotted"
    //         })
    //         console.log(allottedList,"allottedList")
    //         let collectedAllotedList = data_emp.filter((data) => allottedList.some((item) => item.userid === data.loginid && item.projectvendor.replace(/[-_ ]/g, "") === data.projectvendor));
    //         let combinedWithallotted = collectedAllotedList.map((data) => {
    //             let foundData = allottedList.find((item) => item.userid === data.loginid)
    //             if (foundData) {
    //                 return {
    //                     ...foundData, ...data, listdate: data.date, id: data.id
    //                 }
    //             }
    //         })
    //         let finalAllottedList = allottedList.flatMap((data) => {
    //             return data?.loginallotlog?.map((item) => {
    //                 let foundData = definedUsers.find((item1) => item1.employeename === item.empname);
    //                 return {
    //                     company: foundData ? foundData.company : "",
    //                     branch: foundData ? foundData.branch : "",
    //                     unit: foundData ? foundData.unit : "",
    //                     team: foundData ? foundData.team : "",
    //                     employeename: foundData ? foundData.employeename : "",
    //                     date: item.date || "",
    //                     loginid: item.userid || "",
    //                     projectvendor: data.projectvendor || ""
    //                 };
    //             });
    //         });
    //         // first Data to show
    //         let allottedCombinedData = combinedWithallotted.map((data) => {
    //             let sameLoginID = finalAllottedList.filter((id) => {
    //                 return data.userid === id.loginid
    //             });
    //             // let datechek = data_emp.find((item) => item.loginid === data.userid);
    //             let lessthanorEq = sameLoginID.filter((item) => moment(item.date).format("YYYY-MM-DD") <= moment(data.listdate).format("YYYY-MM-DD"));
    //             let sortedLessEq = lessthanorEq.sort((a, b) => new Date(b.date) - new Date(a.date));
    //             if (lessthanorEq) {
    //                 return {
    //                     id: data.id,
    //                     date: data.date,
    //                     project: data.project,
    //                     vendor: data.vendor,
    //                     queue: data.queue,
    //                     loginid: data.loginid,
    //                     accuracy: data.accuracy,
    //                     totalfield: data.totalfield,
    //                     company: sortedLessEq[0]?.company,
    //                     branch: sortedLessEq[0]?.branch,
    //                     unit: sortedLessEq[0]?.unit,
    //                     team: sortedLessEq[0]?.team,
    //                     employeename: sortedLessEq[0]?.employeename,
    //                 };
    //             } else {
    //                 return null;
    //             }
    //         }).filter(item => item !== null);
    //         let unAllottedCombinedData = data_emp.filter((data) => {
    //             let notfounddata = allottedCombinedData.some((item) => item.id === data.id);
    //             if (!notfounddata) {
    //                 return {
    //                     id: data.id,
    //                     date: data.date,
    //                     project: data.project,
    //                     vendor: data.vendor,
    //                     queue: data.queue,
    //                     loginid: data.loginid,
    //                     accuracy: data.accuracy,
    //                     totalfield: data.totalfield,
    //                     company: null,
    //                     branch: null,
    //                     unit: null,
    //                     team: null,
    //                     employeename: null,
    //                 };
    //             }
    //         });
    //         let toShowList = [...allottedCombinedData, ...unAllottedCombinedData].filter(item => {
    //             if (item.company) {
    //                 return accessbranch.some(branch =>
    //                     branch.company === item.company &&
    //                     branch.branch === item.branch &&
    //                     branch.unit === item.unit
    //                 );
    //             }
    //             return true; // Return the item if company is null
    //         });
    //         let minAcc = await axios.get(SERVICE.ACCURACYMASTERGETALL);
    //         let minimumaccuracyArray = minAcc?.data?.accuracymaster;
    //         console.log(minimumaccuracyArray,"minimumaccuracyArray")
    //         let getShowList = toShowList.map((data) => {
    //             let newone = minimumaccuracyArray.find((item) => item.projectvendor === data.project && item.queue === data.queue);
    //             if (newone) {
    //                 return {
    //                     ...data, minimumaccuracy: newone.minimumaccuracy
    //                 }
    //             } else {
    //                 return {
    //                     ...data, minimumaccuracy: ""
    //                 }
    //             }
    //         })
    //         let expectedaccuracyDetails = await axios.get(SERVICE.EXPECTEDACCURACYGETALL);
    //         let expArray = expectedaccuracyDetails?.data?.expectedaccuracy;
    //         console.log(expArray,"expArray")
    //         let finalList = getShowList.map((data) => {
    //             let foundData = expArray.filter((item) => data.project === item.project && data.queue === item.queue && (data.accuracy <= item.expectedaccuracyto && data.accuracy >= item.expectedaccuracyfrom));
    //             let object = {};
    //             if (foundData?.length > 0) {
    //                 foundData?.forEach((dataNew) => { // Use forEach instead of map
    //                     if (dataNew.mode === "Client") {
    //                         object.clientstatus = `${dataNew.statusmode} ${dataNew.percentage} %`;
    //                     }
    //                     if (dataNew.mode === "Internal") {
    //                         object.internalstatus = `${dataNew.statusmode} ${dataNew.percentage} %`;
    //                     }
    //                 });
    //                 return {
    //                     ...data,
    //                     ...object
    //                 };
    //             } else {
    //                 return {
    //                     ...data,
    //                     clientstatus: "NIL",
    //                     internalstatus: "NIL"
    //                 };
    //             }
    //         });
    //         console.log(finalList,"finalList")
    //         const internalfilter = finalList.filter((item) => item.internalstatus !== "NIL" && item.internalstatus !== "" && item.internalstatus !== undefined)
    //         const fieldToRemove = 'clientstatus';
    //         internalfilter.forEach(obj => delete obj[fieldToRemove]);
    //         const today = new Date();
    //         const formattedDate = today.toLocaleDateString('en-GB').split('/').reverse().join('-');
    //         setGotList(internalfilter?.filter((item)=>item.date === formattedDate));
    //         setEmployees(internalfilter?.filter((item)=>item.date === formattedDate));
    //         setBankdetail(true);
    //     } catch (err) { setBankdetail(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    // };

    const fetchAchievedAccuracyIndividual = async () => {

        setPageName(!pageName);

        try {
            // Parallelize API calls to reduce waiting time
            let res = await axios.get(SERVICE.GETACHEIVEDACCURACYINDIVIDUALINTERNALSTATUSLIST);


            const formattedDate = new Date().toLocaleDateString('en-GB').split('/').reverse().join('-');
            const filteredData = res?.data?.data?.filter((item) => item.date === formattedDate);

            let withCompany = filteredData?.filter((item) => item.company !== "")?.filter((data) => {
                return accessbranch.some((acc) => acc.branch === data.branch && acc.company === data.company && acc.unit === data.unit)
            })
            let withoutCompany = filteredData?.filter((item) => item.company === "" || !item.company)
            const itemsWithSerialNumber = [...withCompany, ...withoutCompany]?.map((item, index) => ({ ...item, serialNumber: index + 1, date: moment(item.date).format('DD-MM-YYYY') }));
            setGotList(itemsWithSerialNumber);
            setEmployees(itemsWithSerialNumber);
            setEmployeesArray(res?.data?.data?.map((item, index) => ({

                ...item,
                serialNumber: index + 1,
                id: item.id,
                date: moment(item.date).format("DD-MM-YYYY"),
            })));
            setBankdetail(true);

        } catch (err) {
            setBankdetail(true);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const [employeesArray, setEmployeesArray] = useState([])
    //get all employees list details
    const fetchAchievedAccuracyIndividualArray = async () => {
        setPageName(!pageName)
        try {
            let res_employee = await axios.get(SERVICE.GETACHEIVEDACCURACYINDIVIDUAL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let data_emp = res_employee?.data?.achievedaccuracyindividual.flatMap((data) => {
                return data.uploaddata.map((item) => {
                    return {
                        id: item?._id,
                        date: item?.date,
                        project: item?.project,
                        vendor: item?.vendor,
                        queue: item?.queue,
                        loginid: item?.loginid.trim(),
                        accuracy: item?.accuracy,
                        totalfield: item?.totalfield,
                        projectvendor: item?.vendor.replace(/[-_ ]/g, "")
                    }
                })
            });
            let users = await axios.get(SERVICE.USERALLLIMIT)
            let definedUsers = users.data.users.map((data) => {
                return {
                    employeename: data?.companyname,
                    company: data?.company,
                    branch: data?.branch,
                    unit: data?.unit,
                    team: data?.team,
                }
            })
            let res = await axios.get(SERVICE.ALL_CLIENTUSERIDDATA);
            let allottedList = res.data.clientuserid.filter((data) => {
                return data.allotted === "allotted"
            })
            let collectedAllotedList = data_emp.filter((data) => allottedList.some((item) => item.userid === data.loginid && item.projectvendor.replace(/[-_ ]/g, "") === data.projectvendor));
            let combinedWithallotted = collectedAllotedList.map((data) => {
                let foundData = allottedList.find((item) => item.userid === data.loginid)
                if (foundData) {
                    return {
                        ...foundData, ...data, listdate: data.date, id: data.id
                    }
                }
            })
            let finalAllottedList = allottedList.flatMap((data) => {
                return data?.loginallotlog?.map((item) => {
                    let foundData = definedUsers.find((item1) => item1.employeename === item.empname);
                    return {
                        company: foundData ? foundData.company : "",
                        branch: foundData ? foundData.branch : "",
                        unit: foundData ? foundData.unit : "",
                        team: foundData ? foundData.team : "",
                        employeename: foundData ? foundData.employeename : "",
                        date: item.date || "",
                        loginid: item.userid || "",
                        projectvendor: data.projectvendor || ""
                    };
                });
            });
            // first Data to show
            let allottedCombinedData = combinedWithallotted.map((data) => {
                let sameLoginID = finalAllottedList.filter((id) => {
                    return data.userid === id.loginid
                });
                // let datechek = data_emp.find((item) => item.loginid === data.userid);
                let lessthanorEq = sameLoginID.filter((item) => moment(item.date).format("YYYY-MM-DD") <= moment(data.listdate).format("YYYY-MM-DD"));
                let sortedLessEq = lessthanorEq.sort((a, b) => new Date(b.date) - new Date(a.date));
                if (lessthanorEq) {
                    return {
                        id: data.id,
                        date: data.date,
                        project: data.project,
                        vendor: data.vendor,
                        queue: data.queue,
                        loginid: data.loginid,
                        accuracy: data.accuracy,
                        totalfield: data.totalfield,
                        company: sortedLessEq[0]?.company,
                        branch: sortedLessEq[0]?.branch,
                        unit: sortedLessEq[0]?.unit,
                        team: sortedLessEq[0]?.team,
                        employeename: sortedLessEq[0]?.employeename,
                    };
                } else {
                    return null;
                }
            }).filter(item => item !== null);
            let unAllottedCombinedData = data_emp.filter((data) => {
                let notfounddata = allottedCombinedData.some((item) => item.id === data.id);
                if (!notfounddata) {
                    return {
                        id: data.id,
                        date: data.date,
                        project: data.project,
                        vendor: data.vendor,
                        queue: data.queue,
                        loginid: data.loginid,
                        accuracy: data.accuracy,
                        totalfield: data.totalfield,
                        company: null,
                        branch: null,
                        unit: null,
                        team: null,
                        employeename: null,
                    };
                }
            });
            let toShowList = [...allottedCombinedData, ...unAllottedCombinedData]
            let minAcc = await axios.get(SERVICE.ACCURACYMASTERGETALL);
            let minimumaccuracyArray = minAcc.data.accuracymaster;
            let getShowList = toShowList.map((data) => {
                let newone = minimumaccuracyArray.find((item) => item.projectvendor === data.project && item.queue === data.queue);
                if (newone) {
                    return {
                        ...data, minimumaccuracy: newone.minimumaccuracy
                    }
                } else {
                    return {
                        ...data, minimumaccuracy: ""
                    }
                }
            })
            let expectedaccuracyDetails = await axios.get(SERVICE.EXPECTEDACCURACYGETALL);
            let expArray = expectedaccuracyDetails.data.expectedaccuracy;
            let finalList = getShowList.map((data) => {
                let foundData = expArray.filter((item) => data.project === item.project && data.queue === item.queue && (data.accuracy <= item.expectedaccuracyto && data.accuracy >= item.expectedaccuracyfrom));
                let object = {};
                if (foundData?.length > 0) {
                    foundData?.forEach((dataNew) => { // Use forEach instead of map
                        if (dataNew.mode === "Client") {
                            object.clientstatus = `${dataNew.statusmode} ${dataNew.percentage} %`;
                        }
                        if (dataNew.mode === "Internal") {
                            object.internalstatus = `${dataNew.statusmode} ${dataNew.percentage} %`;
                        }
                    });
                    return {
                        ...data,
                        ...object
                    };
                } else {
                    return {
                        ...data,
                        clientstatus: "NIL",
                        internalstatus: "NIL"
                    };
                }
            });
            const internalfilter = finalList.filter((item) => item.internalstatus !== "NIL" && item.internalstatus !== "" && item.internalstatus !== undefined)
            const fieldToRemove = 'clientstatus';
            internalfilter.forEach(obj => delete obj[fieldToRemove]);
            setGotList(internalfilter);
            setEmployeesArray(internalfilter.map((item, index) => ({

                ...item,
                serialNumber: item.serialNumber,
                id: item.id,
                date: moment(item.date).format("DD-MM-YYYY"),
            })));
            setBankdetail(true);
        } catch (err) { setBankdetail(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    useEffect(() => {
        // fetchAchievedAccuracyIndividualArray()
    }, [isFilterOpen])
    const [indexGet, setIndexGet] = useState();
    const delAddemployee = async () => {
        setPageName(!pageName)
        try {
            let del = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${boredit}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                workstation: updateWorkStation,
            });
            await fetchAchievedAccuracyIndividual();
            setPage(1);
            setPopupContent('Removed Successfully');
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    // company multi select
    const handleEmployeesChange = (options) => {
        // If employeecount is greater than 0, limit the selections
        if (maxSelections > 0) {
            // Limit the selections to the maximum allowed
            options = options.slice(0, (maxSelections - 1));
        }
        // Update the disabled property based on the current selections and employeecount
        const updatedOptions = filteredWorkStation.map((option) => ({
            ...option,
            disabled:
                (maxSelections - 1) > 0 &&
                options.length >= (maxSelections - 1) &&
                !options.find(
                    (selectedOption) => selectedOption.value === option.value
                ),
        }));
        setValueWorkStation(options.map((a, index) => a.value));
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
            <span style={{ color: "hsl(0, 0%, 20%)" }}>Select Secondary Work Station</span>
        );
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
            setAllWorkStationOpt(
                result.flat()?.map((d) => ({
                    ...d,
                    label: d,
                    value: d,
                }))
            );
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    useEffect(() => {
        fetchWorkStation();
    }, []);
    const editSubmit = (e) => {
        e.preventDefault();
        if (primaryWorkStation === "Select Primary Workstation") {
            setPopupContentMalert('Please Select Work Station!');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            sendRequestt();
        }
    };
    //Boardingupadate updateby edit page...
    let updateby = empaddform?.updatedby;
    let addedby = empaddform?.addedby;
    //edit post call.
    let boredit = empaddform?._id;
    const sendRequestt = async () => {
        const ans = empaddform?.workstation
        ans[updatedFieldEmployee?.index] = primaryWorkStation
        setPageName(!pageName)
        try {
            let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${boredit}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                workstation: ans,
                updatedby: [
                    ...updateby,
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchAchievedAccuracyIndividual();
            handleCloseModEdit();
            setPopupContent('Updated Successfully');
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    // info model
    const [openInfo, setOpeninfo] = useState(false);
    const handleCloseinfo = () => { setOpeninfo(false); };
    const handleClickOpenInfo = () => {
        setOpenview(true);
    }
    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };
    //  PDF
    const columns = [
        { title: "Date", field: "date" },
        { title: "Project", field: "project" },
        { title: "Vendor", field: "vendor" },
        { title: "Queue", field: "queue" },
        { title: "Minimum Accuracy", field: "minimumaccuracy" },
        { title: "Achieved Accuracy", field: "accuracy" },
        { title: "Internal Status", field: "internalstatus" },
        { title: "Loginid", field: "loginid" },
        { title: "Company", field: "company" },
        { title: "Branch", field: "branch" },
        { title: "Unit", field: "unit" },
        { title: "Team", field: "team" },
        { title: "Employeename", field: "employeename" },
        { title: "Totalfield", field: "totalfield" },
    ];
    let exportColumnNames = ["Date", "Project", "Vendor", "Queue", "Minimum Accuracy", "Achieved Accuracy", "Internal Status",
        "Loginid", "Company", "Branch", "Unit", "Team", "Employeename", "Totalfield"];
    let exportRowValues = ["date", "project", "vendor", "queue", "minimumaccuracy", "accuracy", "internalstatus", "loginid", "company", "branch", "unit", "team", "employeename", "totalfield"];
    const downloadPdf = (isfilter) => {
        const doc = new jsPDF();
        // Initialize serial number counter
        let serialNumberCounter = 1;
        // Modify columns to include serial number column
        const columnsWithSerial = [
            { title: "SNo", dataKey: "serialNumber" }, // Serial number column
            ...columns.map((col) => ({ ...col, dataKey: col.field })),
        ];
        // Modify row data to include serial number
        const dataWithSerial = isfilter === "filtered" ?
            rowDataTable.map(row => ({ ...row, serialNumber: serialNumberCounter++ })) :
            employeesArray.map(row => ({
                ...row,
                serialNumber: serialNumberCounter++,
                date: moment(row.date).format("DD-MM-YYYY")
            }));
        // Generate PDF
        doc.autoTable({
            theme: "grid",
            styles: {
                fontSize: 4,
                cellWidth: "auto",
            },
            columns: columnsWithSerial,
            body: dataWithSerial,
        });
        doc.save("Achieved Accuracy Individual Review Internal Status List.pdf");
    };
    // Excel
    const fileName = "Achieved Accuracy Individual Review Internal Status List";
    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Achieved Accuracy Individual Review Internal Status List",
        pageStyle: "print",
    });
    useEffect(() => {
        fetchAchievedAccuracyIndividual();
    }, []);
    //table entries ..,.
    const [items, setItems] = useState([]);
    const addSerialNumber = (datas) => {

        setItems(datas);
        setOverallItems(datas);
    };
    useEffect(() => {
        addSerialNumber(employees);
    }, [employees]);
    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSelectedRows([]);
        setSelectAllChecked(false)
    };
    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setSelectedRows([]);
        setSelectAllChecked(false)
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
    const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);
    const totalPages = Math.ceil(employees.length / pageSize);
    const visiblePages = Math.min(totalPages, 3);
    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);
    const pageNumbers = [];
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox
                checked={selectAllChecked}
                onChange={onSelectAll}
            />
        </div>
    );
    const columnDataTable = [

        {
            field: "serialNumber", headerName: "SNo",
            flex: 0, width: 75, hide: !columnVisibility.serialNumber, headerClassName: "bold-header", pinned: 'left',

        },
        { field: "date", headerName: "Date", flex: 0, width: 200, hide: !columnVisibility.date, headerClassName: "bold-header", pinned: 'left', },
        { field: "project", headerName: "Project", flex: 0, width: 200, hide: !columnVisibility.project, headerClassName: "bold-header", pinned: 'left', },
        { field: "vendor", headerName: "Vendor", flex: 0, width: 200, hide: !columnVisibility.vendor, headerClassName: "bold-header", pinned: 'left', },
        { field: "queue", headerName: "Queue", flex: 0, width: 200, hide: !columnVisibility.queue, headerClassName: "bold-header" },
        { field: "minimumaccuracy", headerName: "Minimum Accuracy", flex: 0, width: 100, hide: !columnVisibility.minimumaccuracy, headerClassName: "bold-header" },
        { field: "accuracy", headerName: "Achieved Accuracy", flex: 0, width: 100, hide: !columnVisibility.accuracy, headerClassName: "bold-header" },
        { field: "internalstatus", headerName: "Internal Status", flex: 0, width: 150, hide: !columnVisibility.internalstatus, headerClassName: "bold-header" },
        { field: "loginid", headerName: "Login ID", flex: 0, width: 200, hide: !columnVisibility.loginid, headerClassName: "bold-header" },
        { field: "company", headerName: "Company", flex: 0, width: 100, hide: !columnVisibility.company, headerClassName: "bold-header" },
        { field: "branch", headerName: "Branch", flex: 0, width: 200, hide: !columnVisibility.branch, headerClassName: "bold-header" },
        { field: "unit", headerName: "Unit", flex: 0, width: 100, hide: !columnVisibility.unit, headerClassName: "bold-header" },
        { field: "team", headerName: "Team", flex: 0, width: 100, hide: !columnVisibility.team, headerClassName: "bold-header" },
        { field: "employeename", headerName: "Employee Name", flex: 0, width: 100, hide: !columnVisibility.employeename, headerClassName: "bold-header" },
        { field: "totalfield", headerName: "Total Field", flex: 0, width: 100, hide: !columnVisibility.totalfield, headerClassName: "bold-header" },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 100,
            minHeight: '40px !important',
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            // Assign Bank Detail
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex' }}>
                    {isUserRoleCompare?.includes("vachievedaccuracyindividualreviewinternalstatuslist") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {

                                getinfoCode(params.data);
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonview} />
                        </Button>
                    )}&ensp;
                </Grid>
            ),
        },
    ]
    const rowDataTable = filteredData.map((item, index) => {
        return {
            serialNumber: item.serialNumber,
            id: item.id,
            date: item.date,
            project: item.project,
            vendor: item.vendor,
            queue: item.queue,
            loginid: item.loginid,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            employeename: item.employeename,
            accuracy: item.accuracy + " %",
            totalfield: item.totalfield,
            minimumaccuracy: item.minimumaccuracy,
            clientstatus: item.clientstatus,
            internalstatus: item.internalstatus
        }
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
        <Box style={{ padding: "10px", minWidth: "325px", '& .MuiDialogContent-root': { padding: '10px 0' } }} >
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton
                aria-label="close"
                onClick={handleCloseManageColumns}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <Box sx={{ position: 'relative', margin: '10px' }}>
                <TextField
                    label="Find column"
                    variant="standard"
                    fullWidth
                    value={searchQueryManage}
                    onChange={(e) => setSearchQueryManage(e.target.value)}
                    sx={{ marginBottom: 5, position: 'absolute', }}
                />
            </Box><br /><br />
            <DialogContent sx={{ minWidth: 'auto', height: '200px', position: 'relative' }}>
                <List sx={{ overflow: 'auto', height: '100%', }}>
                    {filteredColumns.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText sx={{ display: 'flex' }}
                                primary={
                                    <Switch sx={{ marginTop: "-5px" }} size="small"
                                        checked={columnVisibility[column.field]}
                                        onChange={() => toggleColumnVisibility(column.field)}
                                    />
                                }
                                secondary={(column.field === "checkbox") ? "Checkbox" : column.headerName}
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
                            sx={{ textTransform: 'none', }}
                            onClick={() => setColumnVisibility(initialColumnVisibility)}
                        >
                            Show All
                        </Button>
                    </Grid>
                    <Grid item md={4}></Grid>
                    <Grid item md={4}>
                        <Button
                            variant="text"
                            sx={{ textTransform: 'none' }}
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
    const [fileFormat, setFormat] = useState('')
    return (
        <Box>
            {/* ****** Header Content ****** */}
            <Headtitle title={"ACHIEVED ACCURACY INDIVIDUAL REVIEW INTERNAL STATUS LIST"} />
            <PageHeading
                title="Achieved Accuracy Individual Review Internal Status List"
                modulename="Quality"
                submodulename="Accuracy"
                mainpagename="Achieved Accuracy Individual Review Internal Status List"
                subpagename=""
                subsubpagename=""
            />


            <br />
            {isUserRoleCompare?.includes("lachievedaccuracyindividualreviewinternalstatuslist") && (
                <>
                    <Box sx={userStyle.selectcontainer}>
                        <Grid container spacing={2}>
                            <>
                                <Grid item md={4} xs={12} sm={12}>
                                    <Typography>
                                        Company
                                        {/* <span style={{ color: 'red' }}>*</span> */}
                                    </Typography>
                                    <FormControl size="small" fullWidth>
                                        <MultiSelect
                                            options={accessbranch?.map(data => ({
                                                label: data.company,
                                                value: data.company,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
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
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography> Branch</Typography>
                                        <MultiSelect
                                            options={accessbranch?.filter(
                                                (comp) =>
                                                    valueCompanyCat?.includes(comp.company)
                                            )?.map(data => ({
                                                label: data.branch,
                                                value: data.branch,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
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
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography> Unit</Typography>
                                        <MultiSelect
                                            options={accessbranch?.filter(
                                                (comp) =>
                                                    valueCompanyCat?.includes(comp.company) && valueBranchCat?.includes(comp.branch)
                                            )?.map(data => ({
                                                label: data.unit,
                                                value: data.unit,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
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
                                <Grid item md={4} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Team</Typography>
                                        <MultiSelect
                                            options={allTeam?.filter(
                                                (comp) =>
                                                    valueCompanyCat?.includes(comp.company) && valueBranchCat?.includes(comp.branch)
                                            )?.map(data => ({
                                                label: data.teamname,
                                                value: data.teamname,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            value={selectedOptionsTeam}
                                            onChange={(e) => {
                                                handleTeamChange(e);
                                            }}
                                            valueRenderer={customValueRendererTeam}
                                            labelledBy="Please Select Team"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Employee Name</Typography>
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
                                                    ...u,
                                                    label: u.companyname,
                                                    value: u.companyname,
                                                }))}
                                            value={selectedOptionsCate}
                                            onChange={handleCategoryChange}
                                            valueRenderer={customValueRendererCate}
                                            labelledBy="Please Select Employee Name"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ fontWeight: "500" }}>
                                            Days
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
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            {" "}
                                            From Date
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
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            To Date
                                        </Typography>
                                        <OutlinedInput
                                            id="to-date"
                                            type="date"
                                            disabled={filterUser.day !== "Custom Fields"}
                                            value={filterUser.todate}

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
                                <Grid item md={2} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Type</Typography>
                                        <MultiSelect
                                            options={typeOptions}
                                            value={typeOptValue}
                                            onChange={handleChangeType}
                                            valueRenderer={customValueRendererEditCompanyFromEdit}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} sm={6} lg={2} xs={12}>
                                    <Typography>Compare</Typography>
                                    <FormControl fullWidth>
                                        <Selects
                                            options={compares}
                                            value={{ label: pointsFilter.compare, value: pointsFilter.compare }}
                                            onChange={(e) => {
                                                setPointsFilter({ ...pointsFilter, compare: e.value, less: "", greater: "", betweenfrom: "", betweento: "" });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                {pointsFilter.compare === "Less than" && (
                                    <Grid item md={2} sm={6} lg={2} xs={12}>
                                        <Typography>Value (%) <b style={{ color: "red" }}>*</b></Typography>
                                        <FormControl fullWidth>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Value(%)"
                                                value={pointsFilter.less}
                                                onChange={(e) => {
                                                    const input = e.target.value;
                                                    // Regular expression to match numbers with up to 6 decimal places
                                                    // const regex = /^[0-9]+(\.[0-9]{0,6})?$/;
                                                    const regex = /^-?\d*\.?\d{0,6}$/;
                                                    // Check if the input matches the regex pattern
                                                    if (regex.test(input) || input === "" || input === "-") {
                                                        // If input is valid or empty, update state
                                                        setPointsFilter({
                                                            ...pointsFilter,
                                                            less: input,
                                                        });
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                )}
                                {pointsFilter.compare === "Greater than" && (
                                    <Grid item md={2} sm={6} lg={2} xs={12}>
                                        <Typography>Value (%) <b style={{ color: "red" }}>*</b></Typography>
                                        <FormControl fullWidth>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Value(%)"
                                                value={pointsFilter.greater}
                                                onChange={(e) => {
                                                    const input = e.target.value;
                                                    // Regular expression to match numbers with up to 6 decimal places
                                                    // const regex = /^[0-9]+(\.[0-9]{0,6})?$/;
                                                    const regex = /^-?\d*\.?\d{0,6}$/;
                                                    // Check if the input matches the regex pattern
                                                    if (regex.test(input) || input === "" || input === "-") {
                                                        // If input is valid or empty, update state
                                                        setPointsFilter({
                                                            ...pointsFilter,
                                                            greater: input,
                                                        });
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                )}
                                {pointsFilter.compare === "Between" && (
                                    <>
                                        <Grid item md={2} sm={6} lg={2} xs={12}>
                                            <Typography>Value from (%) <b style={{ color: "red" }}>*</b></Typography>
                                            <FormControl fullWidth>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    placeholder="Please Enter From Value(%)"
                                                    value={pointsFilter.betweenfrom}
                                                    onChange={(e) => {
                                                        const input = e.target.value;
                                                        // Regular expression to match numbers with up to 6 decimal places
                                                        // const regex = /^[0-9]+(\.[0-9]{0,6})?$/;
                                                        const regex = /^-?\d*\.?\d{0,6}$/;
                                                        // Check if the input matches the regex pattern
                                                        if (regex.test(input) || input === "" || input === "-") {
                                                            // If input is valid or empty, update state
                                                            setPointsFilter({
                                                                ...pointsFilter,
                                                                betweenfrom: input,
                                                            });
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={2} sm={6} lg={2} xs={12}>
                                            <Typography>Value to (%) <b style={{ color: "red" }}>*</b></Typography>
                                            <FormControl fullWidth>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    placeholder="Please Enter To Value(%)"
                                                    value={pointsFilter.betweento}
                                                    onChange={(e) => {
                                                        const input = e.target.value;
                                                        // Regular expression to match numbers with up to 6 decimal places, allowing for a negative sign
                                                        const regex = /^-?\d*\.?\d{0,6}$/;
                                                        // Check if the input matches the regex pattern
                                                        if (regex.test(input) || input === "" || input === "-") {
                                                            // If input is valid or empty, update state
                                                            setPointsFilter({
                                                                ...pointsFilter,
                                                                betweento: input,
                                                            });
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </>
                                )}
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
                                    onClick={handleSubmission}
                                >
                                    {" "}
                                    Filter{" "}
                                </Button>
                            </Grid>
                            <Grid item lg={1} md={2} sm={2} xs={12}>
                                <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                                    {" "}
                                    Clear{" "}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                    <br />
                    <br />
                    <Box sx={userStyle.container}>
                        { /* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Achieved Accuracy Individual Review Internal Status List</Typography>
                        </Grid>
                        <br />
                        <Grid container spacing={2} style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label >Show entries:</label>
                                    <Select id="pageSizeSelect" value={pageSize}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 180,
                                                    width: 80,
                                                },
                                            },
                                        }}
                                        onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        <MenuItem value={(employees?.length)}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Box >
                                    {isUserRoleCompare?.includes("excelachievedaccuracyindividualreviewinternalstatuslist") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                // fetchAchievedAccuracyIndividualArray()
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvachievedaccuracyindividualreviewinternalstatuslist") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                // fetchAchievedAccuracyIndividualArray()
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printachievedaccuracyindividualreviewinternalstatuslist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfachievedaccuracyindividualreviewinternalstatuslist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                    // fetchAchievedAccuracyIndividualArray()
                                                }}
                                            ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageachievedaccuracyindividualreviewinternalstatuslist") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>
                                    )}
                                </Box >
                            </Grid>
                            <Grid item md={4} xs={6} sm={6}>
                                <AggregatedSearchBar columnDataTable={columnDataTable} setItems={setItems} addSerialNumber={addSerialNumber} setPage={setPage} maindatas={employees} setSearchedString={setSearchedString}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    paginated={false}
                                    totalDatas={overallItems}
                                />
                            </Grid>
                        </Grid>
                        <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button>&ensp;
                        <br /><br />
                        {!isBankdetail ?
                            <>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
                            :
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
                                    handleShowAllColumns={handleShowAllColumns}
                                    setFilteredRowData={setFilteredRowData}
                                    filteredRowData={filteredRowData}
                                    setFilteredChanges={setFilteredChanges}
                                    filteredChanges={filteredChanges}
                                    gridRefTableImg={gridRefTableImg}
                                    itemsList={overallItems}
                                />

                            </>}
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
                    vertical: 'bottom',
                    horizontal: 'left',
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
                maxWidth='md'
                sx={{ marginTop: '50px' }}
            >
                <Box sx={{ padding: '20px 50px' }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>View Achieved Accuracy Individual Review Internal Status List</Typography>
                        <br /><br />
                        <Grid container spacing={2}>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small" >
                                    <Typography variant="h6">Date</Typography>
                                    <Typography>{overallList.date}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl size="small" fullWidth>
                                    <Typography variant="h6"> Project</Typography>
                                    <Typography>{overallList.project}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small" >
                                    <Typography variant="h6">Vendor</Typography>
                                    <Typography>{overallList.vendor}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small" >
                                    <Typography variant="h6">Queue</Typography>
                                    <Typography>{overallList.queue}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small" >
                                    <Typography variant="h6">Achieved Accuracy</Typography>
                                    <Typography>{overallList.accuracy}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small" >
                                    <Typography variant="h6">Minimum Accuracy</Typography>
                                    <Typography>{overallList.minimumaccuracy}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small" >
                                    <Typography variant="h6">Internal Status</Typography>
                                    <Typography>{overallList.internalstatus}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small" >
                                    <Typography variant="h6">Login ID</Typography>
                                    <Typography>{overallList.loginid}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small" >
                                    <Typography variant="h6">Company</Typography>
                                    <Typography>{overallList.company}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small" >
                                    <Typography variant="h6">Branch</Typography>
                                    <Typography>{overallList.branch}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small" >
                                    <Typography variant="h6">Unit</Typography>
                                    <Typography>{overallList.unit}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small" >
                                    <Typography variant="h6">Team</Typography>
                                    <Typography>{overallList.team}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small" >
                                    <Typography variant="h6">Employee Name</Typography>
                                    <Typography>{overallList.employeename}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small" >
                                    <Typography variant="h6">Total Field</Typography>
                                    <Typography>{overallList.totalfield}</Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button variant="contained" color="primary" onClick={handleCloseview} sx={buttonStyles.btncancel}> Back </Button>
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
                <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                    <Typography variant="h6">{showAlert}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error" onClick={handleCloseerr}>
                        ok
                    </Button>
                </DialogActions>
            </Dialog>
            {/* print layout */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table aria-label="simple table" id="branch" ref={componentRef}>
                    <TableHead sx={{ fontWeight: "600" }}>
                        <StyledTableRow>
                            <StyledTableCell>SI.NO</StyledTableCell>
                            <StyledTableCell>Date</StyledTableCell>
                            <StyledTableCell>Project</StyledTableCell>
                            <StyledTableCell>Vendor</StyledTableCell>
                            <StyledTableCell>Queue</StyledTableCell>
                            <StyledTableCell>Achieved Accuracy</StyledTableCell>
                            <StyledTableCell>Minimum Accuracy</StyledTableCell>
                            <StyledTableCell>Internal Status</StyledTableCell>
                            <StyledTableCell>Login ID</StyledTableCell>
                            <StyledTableCell>Company</StyledTableCell>
                            <StyledTableCell>Branch</StyledTableCell>
                            <StyledTableCell>Unit</StyledTableCell>
                            <StyledTableCell>Team</StyledTableCell>
                            <StyledTableCell>Employeename</StyledTableCell>
                            <StyledTableCell>Totalfield</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {rowDataTable &&
                            rowDataTable.map((row, index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell>{index + 1}</StyledTableCell>
                                    <StyledTableCell>{row.date} </StyledTableCell>
                                    <StyledTableCell> {row.project}</StyledTableCell>
                                    <StyledTableCell> {row.vendor}</StyledTableCell>
                                    <StyledTableCell> {row.queue}</StyledTableCell>
                                    <StyledTableCell> {row.minimumaccuracy}</StyledTableCell>
                                    <StyledTableCell> {row.accuracy}</StyledTableCell>
                                    <StyledTableCell> {row.internalstatus}</StyledTableCell>
                                    <StyledTableCell> {row.loginid}</StyledTableCell>
                                    <StyledTableCell> {row.company}</StyledTableCell>
                                    <StyledTableCell> {row.branch}</StyledTableCell>
                                    <StyledTableCell> {row.unit}</StyledTableCell>
                                    <StyledTableCell> {row.team}</StyledTableCell>
                                    <StyledTableCell> {row.employeename}</StyledTableCell>
                                    <StyledTableCell> {row.totalfield}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
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
                filename={"Achieved Accuracy Individual Review Internal Status List"}
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
        </Box>
    );
}

export default AchievedAccuracyIndividualReviewInternalstatusList;