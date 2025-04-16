import React, { useState, useEffect, useRef, useContext } from "react";
import {
    Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, MenuItem, Dialog,
    DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead,
    TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton
} from "@mui/material";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { userStyle } from "../../../pageStyle";
import { ExportXL, ExportCSV } from "../../../components/Export";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import axios from "axios";
import { SERVICE } from '../../../services/Baseservice';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { useReactToPrint } from "react-to-print";
import moment from 'moment-timezone';
import { UserRoleAccessContext, AuthContext } from '../../../context/Appcontext';
import Headtitle from "../../../components/Headtitle";
import StyledDataGrid from "../../../components/TableStyle";
import { ThreeDots } from 'react-loader-spinner';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/system';
import Resizable from 'react-resizable';
import { saveAs } from "file-saver";
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';
import Selects from "react-select";
import { MultiSelect } from "react-multi-select-component";
import { Space, TimePicker } from "antd";
import dayjs from "dayjs";
import ExportData from "../../../components/ExportData";


function TempOverallReport() {


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

    const CustomStyledDataGrid = styled(StyledDataGrid)(({ theme }) => ({

        '& .custom-dupe-row': {
            backgroundColor: '#ff00004a !important',
        },

        '&:hover': {
            '& .custom-dupe-row:hover': {
                backgroundColor: '#ff00004a !important',
            },

        },
    }));

    let exportColumnNames = [
        // 'Production Mode', 'Company',
        // 'Branch', 'Unit',
        // 'Team', 'Vendor',
        // 'Category', 'SubCategory',
        // 'Unit Identifier', 'Points',
        // 'Employee Name', 'Employee Code',
        // 'LoginId', 'TotalPoints',
        // 'Section', 'Flag Count',
        // 'WorkTook', 'User Name', 'Dupe'
        "Mode",
        "Company",
        "Branch",
        "Unit",
        "Team",
        "Vendor",
        "Category",
        "SubCategory",
        "Unit Identifier",

        "EmpCode",
        "Emp Name",
        "LoginId",
        "Date",

        "U-Points",
        "U-Unitrate",
        "U-Section",
        "U-FlagCount",

        "A-Points",
        "A-Unitrate",
        "A-Section",
        "A-FlagCount",

        "Total Points",

        "WorkTook",
        "UserName",
        "Dupe",
    ];
    let exportRowValues = [
        'mode', 'company',
        'branch', 'unit',
        'team', 'vendor',
        'filename', 'category', 'unitid',
        'empcode',
        'empname',
        'user', 'dateval',
        'points', 'unitrate',
        'section', 'flagcount', 'cpoints',
        'cunitrate', 'csection', 'cflagcount',
        'totalpoints', 'worktook', 'username', 'dupe'
    ];

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

    const PmodeOpt = [
        { label: "Production", value: "Production" },
        { label: "Manual Production", value: "Manual Production" },
        {
            label: "Non Production", value: "Non Production"
        }
    ]

    const ShiftOpt = [
        { label: "Shift Based", value: "Shift Based" },
        { label: "Date Based", value: "Date Based" }]

    const handleTimeChange = (time, timeString) => {
        // Check if timeString is a valid time format
        const isValidTime = dayjs(timeString, "h:mm:ss A").isValid();
        if (isValidTime) {
            setOverallState({
                ...overallState,
                fromtime: dayjs(timeString, "h:mm:ss A"),
                fromtime24Hrs: dayjs(timeString, "h:mm:ss A").format("HH:mm:ss"),
            });
        }
    };
    const [selectedFromdate, setSelectedFromdate] = useState("");
    const [selectedTodate, setSelectedTodate] = useState("");

    const handleToTimeChange = (time, timeString) => {
        // Check if timeString is a valid time format
        const isValidTime = dayjs(timeString, "h:mm:ss A").isValid();
        if (isValidTime) {
            setOverallState({
                ...overallState,
                totime: dayjs(timeString, "h:mm:ss A"),
                totime24Hrs: dayjs(timeString, "h:mm:ss A").format("HH:mm:ss"),
            });
        }
    };




    let today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;

    const [loginAllotFilter, setLoginAllotFilter] = useState([]);

    const [overallState, setOverallState] = useState({
        mode: "Please Select Production Mode",
        project: "Please Select Project",
        vendor: "Please Select Vendor",
        fromdate: today,
        alllogin: "Please Select Login",
        shift: "Shift Based",
        todate: today,
        // fromtime: "",
        // totime: "",
        fromtime: dayjs("12:00:00 AM", "h:mm:ss A"),
        totime: dayjs("11:59:59 PM", "h:mm:ss A"),
        fromtime24Hrs: dayjs("12:00:00 AM", "h:mm:ss A").format("HH:mm:ss"),
        totime24Hrs: dayjs("11:59:59 PM", "h:mm:ss A").format("HH:mm:ss"),
    });


    const fetchCompany = async () => {
        try {
            let res = await axios.get(SERVICE.COMPANY, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setCompanyOpt([
                ...res?.data?.companies?.map((t) => ({
                    ...t,
                    label: t.name,
                    value: t.name,
                })),
            ]);
            let prodjectvalue = res?.data?.companies.length > 0 ? [{
                label: String(res?.data?.companies[0]?.name), value: String(res?.data?.companies[0]?.name),
                name: String(res?.data?.companies[0]?.name)
            }] : []
            setSelectedOptionsCompany(prodjectvalue)
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerr();
            } else {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
        }
    };


    //get all branches.
    const fetchBranchAll = async () => {
        // const branchArr = e.map((t) => t.name)
        try {
            let res_location = await axios.get(SERVICE.BRANCH, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });


            setBranchOption(
                res_location?.data?.branch
            );

        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerr();
            } else {
                setShowAlert(
                    <>
                        {" "}
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />{" "}
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"something went wrong!"}
                        </p>{" "}
                    </>
                );
                handleClickOpenerr();
            }
        }
    };

    const fetchBranchAlls = async () => {
        // const branchArr = e.map((t) => t.name)
        try {
            let res_location = await axios.get(SERVICE.BRANCH, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });


            let branchOptfirstthree = res_location?.data?.branch.map(data => data.name).map((name) => ({
                label: name,
                value: name,
            }));
            setSelectedOptionsBranch(branchOptfirstthree)
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerr();
            } else {
                setShowAlert(
                    <>
                        {" "}
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />{" "}
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"something went wrong!"}
                        </p>{" "}
                    </>
                );
                handleClickOpenerr();
            }
        }
    };

    //get all unit.
    const fetchUnitAll = async () => {
        // let branchArr = e.map(data => data.name)
        try {
            let res_location = await axios.get(SERVICE.UNIT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setUnitOption(res_location?.data?.units
            );

        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerr();
            } else {
                setShowAlert(
                    <>
                        {" "}
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />{" "}
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"something went wrong!"}
                        </p>{" "}
                    </>
                );
                handleClickOpenerr();
            }
        }
    };
    //get all unit.
    const fetchUnitAlls = async () => {
        // let branchArr = e.map(data => data.name)
        try {
            let res_location = await axios.get(SERVICE.UNIT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });


            let unitOptfirstthree = res_location?.data?.units.map(data => data.name).map((name) => ({
                label: name,
                value: name,
            }));
            setSelectedOptionsUnit(unitOptfirstthree);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerr();
            } else {
                setShowAlert(
                    <>
                        {" "}
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />{" "}
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"something went wrong!"}
                        </p>{" "}
                    </>
                );
                handleClickOpenerr();
            }
        }
    };


    //get all Team.
    const fetchTeamAll = async (e) => {
        // let unitArr = e.map(data => data.name)

        try {
            let res_location = await axios.get(SERVICE.TEAMS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            // const TeamOpt = res_location?.data?.teamsdetails?.filter((t) => unitArr.includes(t.unit))

            setTeamOption(
                res_location?.data?.teamsdetails
            );

        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerr();
            } else {
                setShowAlert(
                    <>
                        {" "}
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />{" "}
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"something went wrong!"}
                        </p>{" "}
                    </>
                );
                handleClickOpenerr();
            }

        }
    };
    const fetchTeamAlls = async (e) => {
        // let unitArr = e.map(data => data.name)

        try {
            let res_location = await axios.get(SERVICE.TEAMS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let teamsOptfirstthree = res_location?.data?.teamsdetails.map(data => data.teamname).map((name) => ({
                label: name,
                value: name,
            }));
            setSelectedOptionsTeam(teamsOptfirstthree)

        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerr();
            } else {
                setShowAlert(
                    <>
                        {" "}
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />{" "}
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"something went wrong!"}
                        </p>{" "}
                    </>
                );
                handleClickOpenerr();
            }

        }
    };

    useEffect(() => {
        fetchBranchAlls();
        fetchUnitAlls();
        fetchTeamAlls();
    }, [])


    //get all project.
    const fetchProjMaster = async () => {
        try {
            let res_project = await axios.get(SERVICE.PROJECTMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            const projectopt = [...res_project?.data?.projmaster.map((item) => ({
                ...item,
                label: item.name,
                value: item.name

            }))]

            setProjmasterOpt(projectopt);
            let prodjectvalue = projectOpt.length > 0 ? [{
                label: String(projectOpt[0]?.name),
                value: String(projectOpt[0]?.name), name: String(projectOpt[0]?.name)
            }] : []
            setSelectedProject(prodjectvalue)

            fetchVendor(prodjectvalue)
            fetchAllCategory(prodjectvalue)
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerr();
            } else {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
        }
    };

    //get all Sub vendormasters.
    const fetchVendor = async (e) => {
        const branchArr = e.map((t) => t.name)
        try {
            let res_vendor = await axios.get(SERVICE.VENDORMASTER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });


            const projFilt = res_vendor?.data?.vendormaster?.filter((item) => branchArr.includes(item.projectname))
            setVendormasterOpt(
                projFilt?.map((t) => ({
                    ...t,
                    label: t.name,
                    value: t.name,
                })),
            );
            let vendoryOptfirstthree = projFilt.filter((d, index) => index <= 2).map(data => data.name).map((name) => ({
                label: name,
                value: name,
            }));

            let prodjectvalue = vendoryOptfirstthree.length > 0 ? vendoryOptfirstthree : []

            setSelectedVendor(prodjectvalue)
        } catch (err) {
            const messages = err?.response?.data?.message
            if (messages) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                        <p style={{ fontSize: '20px', fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                        <p style={{ fontSize: '20px', fontWeight: 900 }}>{"something went wrong!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
        }
    }

    //get all category.
    const fetchAllCategory = async (e) => {
        const branchArr = e.map((t) => t.name)
        try {
            let res_module = await axios.get(SERVICE.CATEGORYPROD, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const categoryOpt = Array.from(new Set(
                res_module?.data?.categoryprod
                    .filter((item) => branchArr.includes(item.project))
                    .map((t) => t.name)
            )).map((name) => ({
                label: name,
                value: name,
            }));
            setCategoryOPt(categoryOpt);

            let categoryOptfirstthree = categoryOpt.filter((d, index) => index <= 2)

            let prodjectvalue = categoryOptfirstthree.length > 0 ? categoryOptfirstthree : [];
            setSelectedOptionsCategory(prodjectvalue)
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerr();
            } else {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
        }
    };


    //get all category.
    const fetchAllSubCategory = async () => {
        try {
            let res_module = await axios.get(SERVICE.SUBCATEGORYPROD_LIST_LIMITED, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const projFilt = res_module?.data?.subcategoryprod


            setSubCategoryOpt(projFilt);
            let defaultsub = Array.from(new Set(subcategory
                ?.filter(
                    (comp) =>
                        selectedOptionsCategory
                            .map((item) => item.value)
                            .includes(comp.categoryname)
                )
                ?.map((com) => com.name)
            ))
                .map((name) => ({
                    label: name,
                    value: name,
                }))
            setSelectedOptionsSubCategory(defaultsub)
            setValueSubCat(
                defaultsub.map((a, index) => {
                    return a.value;
                })
            );

        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerr();
            } else {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
        }
    };


    const [projectOpt, setProjmasterOpt] = useState([]);
    const [vendorOpt, setVendormasterOpt] = useState([]);
    const [companyOpt, setCompanyOpt] = useState([]);
    const [branchOption, setBranchOption] = useState([]);
    const [unitOption, setUnitOption] = useState([]);
    const [teamOption, setTeamOption] = useState([]);
    const [employeeOption, setEmployeeOption] = useState([]);
    const [categoryOpt, setCategoryOPt] = useState([]);
    const [subcategory, setSubCategoryOpt] = useState([]);




    const [productionFilter, setProductionFilter] = useState([]);
    const [selectedProject, setSelectedProject] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState([]);
    const [selectedEmployeeFrom, setSelectedEmployeeFrom] = useState([]);


    let [valueVendor, setValueVendor] = useState([]);
    let [selectedDupe, setSelectedDupe] = useState("With Duplicate");



    function getWeekNumberInMonth(date) {
        const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const dayOfWeek = firstDayOfMonth.getDay(); // 0 (Sunday) to 6 (Saturday)

        // If the first day of the month is not Monday (1), calculate the adjustment
        const adjustment = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

        // Calculate the day of the month adjusted for the starting day of the week
        const dayOfMonthAdjusted = date.getDate() + adjustment;

        // Calculate the week number based on the adjusted day of the month
        const weekNumber = Math.ceil(dayOfMonthAdjusted / 7);

        return weekNumber;
    }


    const fetchProductionFilter = async () => {
        setProductionFilter([])
        try {
            let startMonthDate = new Date(overallState.fromdate);
            // let endMonthDate = new Date(overallState.todate);
            let firstDate = new Date(overallState.todate);
            let enddate = firstDate.setDate(firstDate.getDate() + 1);
            let endMonthDate = new Date(enddate);
            // console.log(endMonthDate)
            let resultvendor = [];
            selectedProject.map(d => d.value).forEach(proj => {

                selectedVendor.map(d => d.value).forEach(vend => {

                    if (vendorOpt.some(v => v.projectname === proj && v.name === vend)) {

                        resultvendor.push(`${proj}-${vend}`);
                    }
                });
            });
            let projvendor = [...new Set(resultvendor)];

            const daysArray = [];
            while (startMonthDate <= endMonthDate) {
                const formattedDate = `${String(startMonthDate.getDate()).padStart(2, "0")}/${String(startMonthDate.getMonth() + 1).padStart(2, "0")}/${startMonthDate.getFullYear()}`;
                const dayName = startMonthDate.toLocaleDateString("en-US", { weekday: "long" });
                const dayCount = startMonthDate.getDate();
                const shiftMode = "Main Shift";
                const weekNumberInMonth = getWeekNumberInMonth(startMonthDate) === 1 ? `${getWeekNumberInMonth(startMonthDate)}st Week` : getWeekNumberInMonth(startMonthDate) === 2 ? `${getWeekNumberInMonth(startMonthDate)}nd Week` : getWeekNumberInMonth(startMonthDate) === 3 ? `${getWeekNumberInMonth(startMonthDate)}rd Week` : getWeekNumberInMonth(startMonthDate) > 3 ? `${getWeekNumberInMonth(startMonthDate)}th Week` : "";

                daysArray.push({ formattedDate, dayName, dayCount, shiftMode, weekNumberInMonth });

                // Move to the next day
                startMonthDate.setDate(startMonthDate.getDate() + 1);
            }

            setSourcecheck(true)


            async function fetchDataInBatches() {
                let batchNumber = 1;
                let allData = [];
                let hasMoreData = true;
                // Filter the subcategories based on selected categories
                const filteredSubcategories = subcategory.filter(sub => selectedOptionsCategory.map(item => item.value).includes(sub.categoryname));

                // console.log(filteredSubcategories, "filteredSubcategories")
                // Map the filtered subcategories to the desired format
                // const result = filteredSubcategories.filter(item => selectedOptionsSubCategory.map(item => item.value).includes(item.name)).map(sub => ({
                //     category: `${sub.categoryname}.xlsx`, // Append .xlsx to the category name
                //     subcategory: sub.name
                // }));
                const resultmanual = filteredSubcategories.filter(item => selectedOptionsSubCategory.map(item => item.value).includes(item.name)).map(sub => ({
                    category: `${sub.categoryname}`, // Append .xlsx to the category name
                    subcategory: sub.name
                }));

                // console.log(result, "ggg")

                while (hasMoreData) {
                    try {
                        const response = await axios.post(
                            SERVICE.PRODUCTION_TEMP_FILTER,
                            {
                                company: selectedOptionsCompany.map(item => item.value),
                                branch: selectedOptionsBranch.map(item => item.value),
                                unit: selectedOptionsUnit.map(item => item.value),
                                // newcategory: valueSubCat,
                                team: selectedOptionsTeam.map(item => item.value),
                                userDates: daysArray,
                                projectvendor: projvendor,
                                // subs: result,
                                subsmanual: resultmanual,
                                empname: selectedEmployeeFrom.map(item => item.value),
                                user: selectedOptionsLoginid.map(item => item.value),
                                // filename: selectedOptionsCategory.map(item => item.value),
                                category: selectedOptionsSubCategory.map(item => item.value),
                                // vendor: selectedVendor.map(item => item.value),
                                // project: selectedProject.map(item => item.value),
                                selecteddupe: selectedDupe,
                                fromdate: overallState.fromdate,
                                fromtime: overallState.fromtime24Hrs,
                                totime: overallState.totime24Hrs,
                                todate: overallState.todate,
                                shift: overallState.shift,
                                mode: selectedOptionsMode.map(item => item.value),
                                batchNumber: batchNumber,
                                batchSize: 50000,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${auth.APIToken}`,
                                },
                            }
                        );

                        if (response.data.count === 0) {
                            hasMoreData = false;
                            setSourcecheck(false)
                        } else {
                            let filtered = response.data.mergedData.filter(item => item != null)

                            allData = [...allData, ...filtered];
                            batchNumber++;

                        }
                    } catch (err) {
                        setSourcecheck(false)
                        console.error("Error fetching data:", err);
                        hasMoreData = false;
                    }
                }

                return allData;
            }

            fetchDataInBatches().then(async (allData) => {
                setSourcecheck(false);
                try {

                    if (allData.length > 0) {

                        let final = allData;

                        function getTimeDifference(start, end) {
                            if (start && end) {

                                const startDate = new Date(start);
                                const endDate = new Date(end);

                                if (startDate > endDate) {
                                    return "00:00:00";
                                } else {

                                    const diff = new Date(endDate - startDate);
                                    return diff.toISOString().substr(11, 8);
                                }
                            }
                        }
                        let lastTimes = {};

                        let mergedDataall = final.filter((item) => item !== undefined && item.empname != undefined && item.empname != "").sort((a, b) => {
                            if (a.mode !== b.mode) {
                                return a.mode === "Production" ? -1 : 1;
                            }

                            if (a.mode === "Production") {
                                const empnameA = a.empname.trim().toLowerCase();
                                const empnameB = b.empname.trim().toLowerCase();
                                if (empnameA < empnameB) return -1;
                                if (empnameA > empnameB) return 1;
                            }
                            else if (a.mode === "Manual") {
                                const empnameA = a.empname.trim().toLowerCase();
                                const empnameB = b.empname.trim().toLowerCase();
                                if (empnameA < empnameB) return -1;
                                if (empnameA > empnameB) return 1;
                            }

                            // Convert empname to lowercase and trim spaces for case-insensitive and clean comparison
                            let adate = a.mode === "Production" ? a.dateval : `${a.fromdate}T${a.time}`
                            let bdate = a.mode === "Production" ? b.dateval : `${b.fromdate}T${b.time}`
                            const dateA = new Date(adate);
                            const dateB = new Date(bdate);

                            if (dateA < dateB) return -1;
                            if (dateA > dateB) return 1;

                            return 0;
                        });

                        mergedDataall.forEach((item, index) => {
                            // const originalDatetime = new Date(item.olddateval);
                            // const formattedDateTime = originalDatetime.toISOString().replace('T', ' ').slice(0, 19);
                            const finddatevalue = item.dateval && item.dateval?.split(" ");
                            const findtime = finddatevalue && finddatevalue[1];
                            const finddate = finddatevalue && finddatevalue[0];

                            // const loginInfo = loginids.find(login => login.userid === item.user);

                            // const userInfo = loginInfo ? users.find(user => user.companyname === loginInfo.empname) : "";


                            const findshifttime = item.shifttiming ? item.shifttiming.split("to") : ("00:00AMto00:00AM").split("to")

                            const getshift = findshifttime && findshifttime[0];


                            const [time, period] = getshift.includes("AM") ? getshift.split("AM") : getshift.split("PM");
                            const [hoursshift, minutesshift] = time.split(":");

                            // Converting hours to 24-hour format if the period is "PM" and not "12"
                            let hours24 = parseInt(hoursshift, 10);
                            if (getshift.includes("PM") && hoursshift !== "12") {
                                hours24 += 12;
                            }

                            // Creating a new Date object with the updated hours
                            const date = new Date(finddate);
                            date.setHours(hours24);
                            date.setMinutes(parseInt(minutesshift, 10));
                            date.setSeconds(0);

                            // Formatting the date to "hh:mm:ss" format
                            const formattedTimeshift = date.toTimeString().split(" ")[0];


                            const clockindate = attendances.find(d => {
                                const [day, month, year] = d.date.split('-'); // Split the date string from the attendance record
                                const dateObject = new Date(year, month - 1, day); // Create a new Date object
                                const formattedDateString = `${dateObject.getFullYear()}-${(dateObject.getMonth() + 1).toString().padStart(2, '0')}-${dateObject.getDate().toString().padStart(2, '0')}`; // Format the date

                                return formattedDateString === finddate && item.username == d.username
                            })


                            const [timePart, ampm] = clockindate ? clockindate.clockintime.split(' ') : ""; // Split the time and AM/PM
                            const [hours, minutes, seconds] = timePart ? timePart.split(':').map(Number) : ""; // Split hours, minutes, and seconds
                            let formattedHours = hours;

                            if (ampm === 'PM' && hours < 12) {
                                formattedHours += 12; // Convert hours to 24-hour format if PM and not 12 PM
                            } else if (ampm === 'AM' && hours === 12) {
                                formattedHours = 0; // Convert 12 AM to 0 hours
                            }
                            const formattedTime = `${String(formattedHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                            // return formattedTime;

                            if (index == 0 || item.empname !== mergedDataall[index - 1].empname) {
                                if (item.empname) {
                                    if (!lastTimes.hasOwnProperty(item.empname)) {
                                        lastTimes[item.empname] = clockindate && formattedTime < formattedTimeshift ? formattedTime : formattedTimeshift;
                                    }


                                    item.worktook = getTimeDifference(new Date(`${finddate}T${lastTimes[item.empname]}`), new Date(`${finddate}T${findtime}`));
                                }
                            } else if (item.empname == mergedDataall[index - 1].empname) {


                                // item.empname = loginInfo.empname;
                                item.worktook = getTimeDifference(mergedDataall[index - 1].dateval, item.dateval);
                                // lastTimes[loginInfo.empname] = findtime;
                                //  productionResult.push(item);
                            }
                        });
                        console.log(mergedDataall, "mergedDataall")

                        setProductionFilter(mergedDataall);
                        setPage(1);
                    }
                }
                catch (err) {
                    setSourcecheck(false)
                    console.log(err, "errror")
                }
            });




        } catch (err) {
            setSourcecheck(false)
            console.log(err, "rrr")
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerr();
            } else {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"something25 went wrong!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
        }
    };



    //employee multiselect dropdown changes
    const handleEmployeeChangeFrom = (options) => {
        setSelectedEmployeeFrom(options);
    };
    const customValueRendererEmployeeFrom = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Employee";
    };

    //employee multiselect dropdown changes
    const handleLoginChangeFrom = (options) => {
        setSelectedOptionsLoginid(options);
    };
    const customValueRendererLoginFrom = (valueLoginCat, _employeename) => {
        return valueLoginCat.length
            ? valueLoginCat.map(({ label }) => label).join(", ")
            : "Please Select Login";
    };



    // //employee multiselect dropdown changes
    const handleDupeChangeFrom = (options) => {
        setSelectedDupe(options);
    };
    const customValueRendererDupe = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Employee";
    };

    const [selectedOptionsMode, setSelectedOptionsMode] = useState(PmodeOpt.length > 0 ? [{ label: PmodeOpt[0]?.value, value: PmodeOpt[0]?.value }] : [])
    let [valueMode, setValueMode] = useState([]);

    const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([])
    let [valueCompanyCat, setValueCompanyCat] = useState([]);

    const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([])
    let [valueBranchCat, setValueBranchCat] = useState([]);

    const [selectedOptionsLoginid, setSelectedOptionsLoginid] = useState([])
    let [valueLoginCat, setValueLoginCat] = useState([]);

    const [selectedOptionsCategory, setSelectedOptionsCategory] = useState([])
    let [valueCompanyCategory, setValueCategory] = useState([]);

    const [selectedOptionsSubCategory, setSelectedOptionsSubCategory] = useState([])
    let [valueSubCat, setValueSubCat] = useState([]);

    const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([])
    let [valueUnitCat, setValueUnitCat] = useState([]);

    const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([])
    let [valueTeamCat, setValueTeamCat] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");

    const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);

    const [sourceCheck, setSourcecheck] = useState(false);

    const username = isUserRoleAccess.username;

    const gridRef = useRef(null);

    const [selectedRows, setSelectedRows] = useState([]);


    const [searchQueryManage, setSearchQueryManage] = useState("");

    const [copiedData, setCopiedData] = useState('');

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, 'Temp_Overall_Report.png');
                });
            });
        }
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };



    //get all Sub vendormasters.
    const fetchAllLogins = async () => {
        try {
            let res_vendor = await axios.get(SERVICE.ALL_CLIENTUSERID_REPORT_LIMITED_IDSONLY, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            // let alluseridNamesadmin = res_vendor?.data?.clientuserid
            //     .map((d) => ({
            //         ...d,
            //         label: d.userid,
            //         value: d.userid,
            //     }));

            let alluseridNamesadmin = res_vendor?.data?.clientuserid


            setLoginAllotFilter(alluseridNamesadmin)
        } catch (err) {
            console.log(err, "eroro")
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerr();
            } else {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"something12 went wrong!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
        }
    };
    const [attendances, setAttendances] = useState([])

    const fetchTempAttendances = async () => {
        try {
            let res_vendor = await axios.post(SERVICE.PRODUCTION_TEMP_ATTENDANCES, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },

                fromdate: overallState.fromdate,
                todate: overallState.todate,
            });
            // let alluseridNamesadmin = res_vendor?.data?.clientuserid
            //     .map((d) => ({
            //         ...d,
            //         label: d.userid,
            //         value: d.userid,
            //     }));

            let alluseridNamesadmin = res_vendor?.data?.attendances


            setAttendances(alluseridNamesadmin)
        } catch (err) {
            console.log(err, "eroro")
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerr();
            } else {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"something12 went wrong!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
        }
    };

    useEffect(() => {
        fetchAllLogins()
        fetchTempAttendances();
    }, [])

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
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
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
        if ((selectedRows).includes(params.row.id)) {
            return 'custom-id-row'; // This is the custom class for rows with item.tat === 'ago'
        }
        if ((params.row.dupe).includes('Yes')) {
            return 'custom-dupe-row'; // This is the custom class for rows with item.tat === 'ago'
        }
        return ''; // Return an empty string for other rows
    };

    // Show All Columns & Manage Columns 
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        mode: true,
        company: true,
        branch: true,
        dateval: true,
        unit: true,
        team: true,
        project: true,
        vendor: true,
        category: true,
        filename: true,
        unitid: true,
        empcode: true,
        empname: true,
        username: true,
        user: true,
        fromdate: true,
        todate: true,
        section: true,
        flagcount: true,
        points: true,
        unitrate: true,

        csection: true,
        cflagcount: true,
        cpoints: true,
        cunitrate: true,

        worktook: true,
        createdAt: true,

        totalpoints: true,
        dupe: true,
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);







    const fetchEmployeesAll = async () => {
        try {
            let res = await axios.get(SERVICE.USER_PROD, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setEmployeeOption(res?.data?.usersstatus);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerr();
            } else {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"something went wrong!"}
                        </p>
                    </>
                );
                handleClickOpenerr();
            }
        }
    };

    const handleCategoryChange = (options) => {
        setValueCategory(
            options.map((a, index) => {
                return a.value;

            })
        );
        setSelectedOptionsCategory(options);
        setSelectedOptionsSubCategory([])
    };

    const handleSubCategoryChange = (options) => {
        setValueSubCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsSubCategory(options);
    };


    const handleModeChange = (options) => {
        setValueMode(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsMode(options);
    };



    const handleCompanyChange = (options) => {
        setValueCompanyCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCompany(options);
        // fetchBranchAll(options)
        setSelectedOptionsBranch([])
        setSelectedOptionsUnit([])
        setSelectedOptionsTeam([])
        setSelectedEmployeeFrom([])
    };

    const handleBranchChange = (options) => {
        setValueBranchCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsBranch(options);
        fetchUnitAll()

        setSelectedOptionsUnit([])
        setSelectedOptionsTeam([])
        setSelectedEmployeeFrom([])
    };

    const handleUnitChange = (options) => {
        setValueUnitCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsUnit(options);
        fetchTeamAll(options)

        setSelectedOptionsTeam([])
        setSelectedEmployeeFrom([])
    };

    const handleTeamChange = (options) => {
        setValueTeamCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsTeam(options);
        setSelectedEmployeeFrom([])
    };

    const handleProjectChange = (options) => {
        setValueCompanyCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedProject(options);
        fetchVendor(options)
        fetchAllCategory(options)
        setSelectedVendor([])
        setSelectedOptionsCategory([])
        setSelectedOptionsSubCategory([])
    };

    const handleVendorChange = (options) => {
        setValueVendor(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedVendor(options);
        setSelectedOptionsCategory([])
        setSelectedOptionsSubCategory([])
    };

    const customValueRendererMode = (valueMode, _categoryname) => {
        return valueMode?.length
            ? valueMode.map(({ label }) => label)?.join(", ")
            : "Please Select Production";
    };

    const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
        return valueCompanyCat?.length
            ? valueCompanyCat.map(({ label }) => label)?.join(", ")
            : "Please Select Company";
    };


    const customValueRendererProject = (valueProject, _categoryname) => {
        return valueProject?.length
            ? valueProject.map(({ label }) => label)?.join(", ")
            : "Please Select Project";
    };



    const customValueRendererVendor = (valueVendor, _categoryname) => {
        return valueVendor?.length
            ? valueVendor.map(({ label }) => label)?.join(", ")
            : "Please Select Vendor";
    };



    const customValueRendererCategory = (valueCompanyCategory, _categoryname) => {
        return valueCompanyCategory?.length
            ? valueCompanyCategory.map(({ label }) => label)?.join(", ")
            : "Please Select Category";
    };


    const customValueRendererSubCategory = (valueSubCat, _categoryname) => {
        return valueSubCat?.length
            ? valueSubCat.map(({ label }) => label)?.join(", ")
            : "Please Select SubCategory";
    };


    const customValueRendererBranch = (valueBranchCat, _categoryname) => {
        return valueBranchCat?.length
            ? valueBranchCat.map(({ label }) => label)?.join(", ")
            : "Please Select Branch";
    };
    const customValueRendererUnit = (valueUnitCat, _categoryname) => {
        return valueUnitCat?.length
            ? valueUnitCat.map(({ label }) => label)?.join(", ")
            : "Please Select Unit";
    };
    const customValueRendererTeam = (valueTeamCat, _categoryname) => {
        return valueTeamCat?.length
            ? valueTeamCat.map(({ label }) => label)?.join(", ")
            : "Please Select Team";
    };

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };

    function daysBetweenDates(date1, date2) {
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }
    const difference = daysBetweenDates(new Date(overallState.fromdate), new Date(overallState.todate));
    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();

        if (overallState.fromdate === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select FromDate"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (overallState.todate === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select ToDate"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (overallState.fromdate !== overallState.todate) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Single Date"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (selectedOptionsMode.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select  Mode"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (selectedProject.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Project"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (selectedOptionsCategory.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Category"}</p>
                </>
            );
            handleClickOpenerr();
        }

        // else if (selectedOptionsCategory.length > 3) {
        //     setShowAlert(
        //         <>
        //             <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
        //             <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Choose Exactly 3 Categories"}</p>
        //         </>
        //     );
        //     handleClickOpenerr();
        // }
        else if (selectedOptionsSubCategory.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Sub Category"}</p>
                </>
            );
            handleClickOpenerr();
        }

        // else if (selectedOptionsSubCategory.length > 3) {
        //     setShowAlert(
        //         <>
        //             <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
        //             <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Choose Exactly 3 Sub Categories"}</p>
        //         </>
        //     );
        //     handleClickOpenerr();
        // }
        // else if (selectedOptionsSubCategory.length > 3 && difference > 1) {
        //     setShowAlert(
        //         <>
        //             <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
        //             <p style={{ fontSize: '20px', fontWeight: 900 }}>{"For more than 3 Sub Categories, The Date Range Should not be More Than 2 days"}</p>
        //         </>
        //     );
        //     handleClickOpenerr();
        // }
        else if (overallState.shift === "Date Based" && overallState.totime < overallState.fromtime) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"To Time must be greater than or equal to From Time"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            fetchProductionFilter();
        }
    }

    const handleClear = (e) => {
        e.preventDefault();
        setOverallState({
            mode: "Please Select Production Mode",
            project: "Please Select Project",
            vendor: "Please Select Vendor",
            fromdate: today,
            todate: today,
            fromtime: dayjs("12:00:00 AM", "h:mm:ss A"),
            totime: dayjs("11:59:59 PM", "h:mm:ss A"),
            fromtime24Hrs: dayjs("12:00:00 AM", "h:mm:ss A").format("HH:mm:ss"),
            totime24Hrs: dayjs("11:59:59 PM", "h:mm:ss A").format("HH:mm:ss"),
            alllogin: "Please Select Login",
            shift: "Shift Based",
        })
        setSelectedOptionsCompany([])
        setSelectedOptionsBranch([])
        setSelectedOptionsCategory([])
        setSelectedOptionsSubCategory([])
        setSelectedOptionsUnit([])
        setSelectedOptionsTeam([])
        setSelectedEmployeeFrom([])
        setVendormasterOpt([])
        setTeamOption([])
        setBranchOption([])
        setUnitOption([])
        setEmployeeOption([])
        setSelectedOptionsMode([])
        setProductionFilter([])
        setSelectedProject([])
        setSelectedVendor([])
        setCategoryOPt([])
        setSourcecheck(false)
        setShowAlert(
            <>
                <ErrorOutlineOutlinedIcon
                    sx={{ fontSize: "100px", color: "orange" }}
                />
                <p style={{ fontSize: "20px", fontWeight: 900 }}>
                    {"Cleared Successfully"}
                </p>
            </>
        );
        handleClickOpenerr();
    }

    // pdf.....
    const columns = [
        { title: "Sno", dataKey: "serialNumber" },
        { title: "Mode", dataKey: "mode" },
        { title: "Company", dataKey: "company" },
        { title: "Branch", dataKey: "branch" },
        { title: "Unit", dataKey: "unit" },
        { title: "Team", dataKey: "team" },
        { title: "Vendor", dataKey: "vendor" },
        { title: "Category", dataKey: "filename" },
        { title: "SubCategory", dataKey: "category" },
        { title: "Unit Identifier", dataKey: "unitid" },

        { title: "Employee Name", dataKey: "empname" },
        { title: "Employee Code", dataKey: "empcode" },
        { title: "LoginId", dataKey: "user" },
        { title: "Date", dataKey: "dateval" },

        { title: "U-Points", dataKey: "points" },
        { title: "U-Unitrate", dataKey: "unitrate" },
        { title: "U-Section", dataKey: "section" },
        { title: "U-Flag Count", dataKey: "flagcount" },

        { title: "A-Points", dataKey: "cpoints" },
        { title: "A-Unitrate", dataKey: "cunitrate" },
        { title: "A-Section", dataKey: "csection" },
        { title: "A-Flag Count", dataKey: "cflagcount" },

        { title: "WorkTook", dataKey: "worktook" },
        { title: "Total Points", dataKey: "totalpoints" },
        { title: "User Name", dataKey: "username" },
    ]


    const downloadPdf = () => {
        const doc = new jsPDF({ orientation: "landscape" });

        const maxColumnsPerPage = 10; // Maximum number of columns per page
        const totalPages = Math.ceil(columns.length / maxColumnsPerPage); // Calculate total pages needed

        for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
            const startIdx = (currentPage - 1) * maxColumnsPerPage;
            const endIdx = Math.min(startIdx + maxColumnsPerPage, columns.length);

            const currentPageColumns = columns.slice(startIdx, endIdx);

            doc.autoTable({
                theme: "grid",
                styles: {
                    fontSize: 5,
                },
                columns: currentPageColumns,
                body: rowDataTable,
            });

            if (currentPage < totalPages) {
                doc.addPage(); // Add a new page if there are more columns to display
            }
        }
        doc.save("TempOverall Report.pdf");
    };


    // Excel
    const fileName = "TempOverall Report";

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'TempOverall Report',
        pageStyle: 'print'
    });

    useEffect(() => {
        fetchCompany();
        fetchProjMaster();
    }, [selectedOptionsMode])

    useEffect(() => {
        fetchBranchAll();
        fetchAllSubCategory();
        fetchProjMaster();
    }, [selectedOptionsCompany])

    useEffect(() => {
        fetchUnitAll();
    }, [selectedOptionsBranch])

    useEffect(() => {
        fetchEmployeesAll();
    }, [selectedOptionsTeam])

    useEffect(() => {
        fetchTeamAll();
    }, [selectedOptionsUnit])

    useEffect(() => {

        fetchAllSubCategory();

    }, [selectedOptionsCategory])


    useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, []);

    const [items, setItems] = useState([]);

    const addSerialNumber = () => {

        const itemsWithSerialNumber = productionFilter?.map((item, index) => {
            let totalPointsCalcValue = item.cpoints ? Number(item.cpoints) * (item.cflagcount ? Number(item.cflagcount) : Number(item.flagcount)) : Number(item.points) * (item.cflagcount ? Number(item.cflagcount) : Number(item.flagcount))

            return {
                ...item,
                serialNumber: index + 1,
                fromdate: moment(item.fromdate).format("DD/MM/yyyy"),
                todate: moment(item.todate).format("DD/MM/yyyy"),
                totalpoints: Number(totalPointsCalcValue).toFixed(4),
                points: Number(item.points).toFixed(4),
                dupe: item.dupe ? item.dupe : "No",
            }
        }
        );
        setItems(itemsWithSerialNumber);
    }

    useEffect(() => {
        addSerialNumber();
    }, [productionFilter])


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
        setPage(1);
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

    const totalPages = Math.ceil(filteredDatas.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

    const pageNumbers = [];

    const indexOfLastItem = page * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;

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
            field: "checkbox",
            headerName: "Checkbox", // Default header name
            headerStyle: {
                fontWeight: "bold", // Apply the font-weight style to make the header text bold
                // Add any other CSS styles as needed
            },
            renderHeader: (params) => (
                <CheckboxHeader
                    selectAllChecked={selectAllChecked}
                    onSelectAll={() => {
                        if (rowDataTable.length === 0) {
                            // Do not allow checking when there are no rows
                            return;
                        }
                        if (selectAllChecked) {
                            setSelectedRows([]);
                        } else {
                            const allRowIds = rowDataTable.map((row) => row.id);
                            setSelectedRows(allRowIds);
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
                        if (selectedRows.includes(params.row.id)) {
                            updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.row.id);
                        } else {
                            updatedSelectedRows = [...selectedRows, params.row.id];
                        }

                        setSelectedRows(updatedSelectedRows);

                        // Update the "Select All" checkbox based on whether all rows are selected
                        setSelectAllChecked(updatedSelectedRows.length === filteredData.length);

                    }}
                />
            ),
            sortable: false, // Optionally, you can make this column not sortable
            width: 90,

            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header"
        },
        {
            field: "serialNumber", headerName: "SNo",
            flex: 0, width: 95, hide: !columnVisibility.serialNumber, headerClassName: "bold-header"
        },
        { field: "mode", headerName: "Production Mode", flex: 0, width: 140, hide: !columnVisibility.mode, headerClassName: "bold-header" },
        { field: "company", headerName: "Company", flex: 0, width: 80, hide: !columnVisibility.company, headerClassName: "bold-header" },
        { field: "branch", headerName: "Branch", flex: 0, width: 140, hide: !columnVisibility.branch, headerClassName: "bold-header" },
        { field: "unit", headerName: "Unit", flex: 0, width: 90, hide: !columnVisibility.unit, headerClassName: "bold-header" },
        { field: "team", headerName: "Team", flex: 0, width: 90, hide: !columnVisibility.team, headerClassName: "bold-header" },
        { field: "vendor", headerName: "Project", flex: 0, width: 180, hide: !columnVisibility.vendor, headerClassName: "bold-header" },
        { field: "filename", headerName: "Category", flex: 0, width: 310, hide: !columnVisibility.filename, headerClassName: "bold-header" },
        { field: "category", headerName: "Sub Category", flex: 0, width: 350, hide: !columnVisibility.category, headerClassName: "bold-header" },
        { field: "unitid", headerName: "Unit Identifier", flex: 0, width: 150, hide: !columnVisibility.unitid, headerClassName: "bold-header" },

        { field: "empcode", headerName: "Emp Code", flex: 0, width: 130, hide: !columnVisibility.empcode, headerClassName: "bold-header" },
        { field: "empname", headerName: "Emp Name", flex: 0, width: 260, hide: !columnVisibility.empname, headerClassName: "bold-header" },
        { field: "user", headerName: "LogIn Id", flex: 0, width: 100, hide: !columnVisibility.user, headerClassName: "bold-header" },
        { field: "dateval", headerName: "Date", flex: 0, width: 190, hide: !columnVisibility.dateval, headerClassName: "bold-header" },
        { field: "worktook", headerName: "Worktook", flex: 0, width: 140, hide: !columnVisibility.worktook, headerClassName: "bold-header" },
        { field: "unitrate", headerName: "U-Unitrate", flex: 0, width: 100, hide: !columnVisibility.unitrate, headerClassName: "bold-header" },
        { field: "points", headerName: "U-Points", flex: 0, width: 100, hide: !columnVisibility.points, headerClassName: "bold-header" },
        { field: "section", headerName: "U-Section", flex: 0, width: 100, hide: !columnVisibility.section, headerClassName: "bold-header" },
        { field: "flagcount", headerName: "U-Flag Count", flex: 0, width: 100, hide: !columnVisibility.flagcount, headerClassName: "bold-header" },
        { field: "cunitrate", headerName: "A-Unitrate", flex: 0, width: 100, hide: !columnVisibility.cunitrate, headerClassName: "bold-header" },
        { field: "cpoints", headerName: "A-Points", flex: 0, width: 100, hide: !columnVisibility.cpoints, headerClassName: "bold-header" },
        { field: "csection", headerName: "A-Section", flex: 0, width: 100, hide: !columnVisibility.csection, headerClassName: "bold-header" },
        { field: "cflagcount", headerName: "A-Flag Count", flex: 0, width: 100, hide: !columnVisibility.cflagcount, headerClassName: "bold-header" },
        { field: "totalpoints", headerName: "Total Points", flex: 0, width: 100, hide: !columnVisibility.totalpoints, headerClassName: "bold-header" },
        { field: "username", headerName: "User Name", flex: 0, width: 150, hide: !columnVisibility.username, headerClassName: "bold-header" },

        {
            field: "dupe", headerName: "Dupe", flex: 0, width: 90, hide: !columnVisibility.dupe, headerClassName: "bold-header",
            renderCell: (params) => <Typography sx={{ backgroundColor: params.row.dupe === "Yes" ? "red" : "inherit", fontSize: "13px", padding: "5px", color: params.row.dupe === "Yes" ? "white" : "black" }}>{params.row.dupe}</Typography>,
        },
    ]

    const rowDataTable = filteredData.map((item, index) => {
        const filenamelistviewAll = item.filename && item.filename?.split(".x");
        const filenamelist = filenamelistviewAll && filenamelistviewAll[0];
        let totalPointsCalcValue = item.cpoints ? Number(item.cpoints) * (item.cflagcount ? Number(item.cflagcount) : Number(item.flagcount)) : Number(item.points) * (item.cflagcount ? Number(item.cflagcount) : Number(item.flagcount))

        return {
            id: item.serialNumber,
            serialNumber: item.serialNumber,
            mode: item.mode,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            project: item.project,
            worktook: item.worktook,
            vendor: item.vendor,
            filename: filenamelist,
            category: item.category,
            dateval: item.dateval,
            subcategory: item.subcategory,
            empcode: item.empcode,
            empname: item.empname,
            username: item.username,
            user: item.user,
            fromdate: item.fromdate,
            todate: item.todate,
            section: item.section,
            flagcount: item.flagcount,
            points: item.points,
            csection: item.csection,
            cflagcount: item.cflagcount,
            cpoints: item.cpoints,
            unitid: item.unitid,
            dupe: item.dupe,
            totalpoints: item.totalpoints,
            unitrate: item.unitrate,
            cunitrate: item.cunitrate,
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



    return (
        <Box>
            <Headtitle title={'TempOverall Report'} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>TempOverall Report</Typography>

            <Box sx={userStyle.dialogbox}>
                <>

                    <Grid container spacing={2}>
                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth >
                                <Typography>
                                    Production Mode<b style={{ color: "red" }}>*</b>
                                </Typography>
                                <MultiSelect
                                    maxMenuHeight={250}
                                    options={PmodeOpt}
                                    value={selectedOptionsMode}
                                    onChange={(e) => {
                                        handleModeChange(e)
                                    }}
                                    valueRenderer={customValueRendererMode}
                                    labelledBy="Please Select Production"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    Company
                                </Typography>
                                <MultiSelect
                                    options={companyOpt}
                                    value={selectedOptionsCompany}
                                    onChange={(e) => {
                                        handleCompanyChange(e);
                                        setSelectedOptionsBranch([])
                                        setSelectedOptionsUnit([])
                                        setSelectedOptionsTeam([])
                                        setSelectedEmployeeFrom([])
                                    }}
                                    valueRenderer={customValueRendererCompany}
                                    labelledBy="Please Select Company"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    Branch
                                </Typography>
                                <MultiSelect
                                    options={branchOption.filter((t) => selectedOptionsCompany.map(item => item.value).includes(t.company))
                                        .map(t => ({
                                            ...t,
                                            label: t.name,
                                            value: t.name,
                                        })
                                        )
                                    }
                                    value={selectedOptionsBranch}
                                    onChange={(e) => {
                                        handleBranchChange(e);
                                        setSelectedOptionsTeam([])
                                        setSelectedOptionsUnit([])
                                        setSelectedEmployeeFrom([])
                                    }}
                                    valueRenderer={customValueRendererBranch}
                                    labelledBy="Please Select Branch"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    Unit
                                </Typography>
                                <MultiSelect
                                    options={unitOption.filter((t) => selectedOptionsBranch.map(item => item.value).includes(t.branch))
                                        .map(t => ({
                                            ...t,
                                            label: t.name,
                                            value: t.name,
                                        })
                                        )
                                    }
                                    value={selectedOptionsUnit}
                                    onChange={(e) => {
                                        handleUnitChange(e);
                                        setSelectedOptionsTeam([])
                                        setSelectedEmployeeFrom([])
                                    }}
                                    valueRenderer={customValueRendererUnit}
                                    labelledBy="Please Select Unit"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    Team
                                </Typography>
                                <MultiSelect
                                    options={teamOption.filter((t) =>
                                        selectedOptionsBranch.map(item => item.value).includes(t.branch) &&
                                        selectedOptionsUnit.map(item => item.value).includes(t.unit))
                                        .map(t => ({
                                            ...t,
                                            label: t.teamname,
                                            value: t.teamname,
                                        })
                                        )
                                    }
                                    value={selectedOptionsTeam}
                                    onChange={(e) => {
                                        handleTeamChange(e);
                                        setSelectedEmployeeFrom([])
                                    }}
                                    valueRenderer={customValueRendererTeam}
                                    labelledBy="Please Select Team"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth >
                                <Typography>
                                    Project
                                    <b style={{ color: "red" }}>*</b>
                                </Typography>
                                <MultiSelect
                                    options={projectOpt}
                                    value={selectedProject}
                                    onChange={(e) => {
                                        handleProjectChange(e);
                                    }}
                                    valueRenderer={customValueRendererProject}
                                    labelledBy="Please Select Project"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth >
                                <Typography>
                                    Vendor
                                </Typography>
                                <MultiSelect
                                    options={vendorOpt}
                                    value={selectedVendor}
                                    onChange={(e) => {
                                        handleVendorChange(e);
                                    }}
                                    valueRenderer={customValueRendererVendor}
                                    labelledBy="Please Select Vendor"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    Shift
                                </Typography>
                                <Selects
                                    options={ShiftOpt}
                                    value={{ label: overallState.shift, value: overallState.shift }}
                                    onChange={(e) => {
                                        setOverallState({
                                            ...overallState,
                                            shift: e.value,
                                        })
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    From Date <b style={{ color: "red" }}>*</b>
                                </Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="date"
                                    value={overallState.fromdate}
                                    // onChange={(e) => {
                                    //     setOverallState({ ...overallState, fromdate: e.target.value });
                                    // }}
                                    onChange={(e) => {
                                        const selectedDate = e.target.value;
                                        // Ensure that the selected date is not in the future
                                        const currentDate = new Date().toISOString().split("T")[0];
                                        if (selectedDate <= currentDate) {
                                            // setSelectedFromdate(selectedDate);
                                            // setSelectedTodate(selectedDate);
                                            setOverallState({ ...overallState, fromdate: selectedDate, todate: selectedDate });
                                        } else {
                                        }
                                    }}
                                    // Set the max attribute to the current date
                                    inputProps={{ max: new Date().toISOString().split("T")[0] }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    To Date <b style={{ color: "red" }}>*</b>
                                </Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="date"
                                    value={overallState.todate}
                                    // onChange={(e) => {
                                    //     setOverallState({ ...overallState, todate: e.target.value });
                                    // }}
                                    onChange={(e) => {
                                        const selectedDate = e.target.value;
                                        // Ensure that the selected date is not in the future
                                        const currentDate = new Date().toISOString().split("T")[0];
                                        const fromdateval = overallState.fromdate != "" && new Date(overallState.fromdate).toISOString().split("T")[0];
                                        if (overallState.fromdate == "") {
                                            setShowAlert(
                                                <>
                                                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{`Please Select From date`}</p>
                                                </>
                                            );
                                            handleClickOpenerr();
                                        } else if (selectedDate < fromdateval) {
                                            setShowAlert(
                                                <>
                                                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{`To Date should be after or equal to From Date`}</p>
                                                </>
                                            );
                                            handleClickOpenerr();

                                            setOverallState({ ...overallState, todate: "" });
                                        } else if (selectedDate <= currentDate) {
                                            // setSelectedTodate(selectedDate);
                                            setOverallState({ ...overallState, todate: selectedDate });
                                        } else {
                                        }
                                    }}
                                    // Set the max attribute to the current date
                                    inputProps={{ max: new Date().toISOString().split("T")[0], min: overallState.fromdate !== "" ? overallState.fromdate : null }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    From Time
                                </Typography>
                                {/* <OutlinedInput
                                    id="component-outlined"
                                    type="time"
                                    value={overallState.fromtime}
                                    onChange={(e) => {
                                        setOverallState({ ...overallState, fromtime: e.target.value });
                                    }}
                                /> */}
                                <Space wrap>
                                    <TimePicker use12Hours format="h:mm:ss A" size="large"
                                        disabled={overallState.shift === "Shift Based"}
                                        value={overallState.fromtime} defaultValue={dayjs("00:00:00", "HH:mm:ss a")}
                                        onChange={handleTimeChange} allowClear={false} />
                                </Space>
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    To Time
                                </Typography>
                                {/* <OutlinedInput
                                    id="component-outlined"
                                    type="time"
                                    value={overallState.totime}
                                    onChange={(e) => {
                                        setOverallState({ ...overallState, totime: e.target.value });
                                    }}
                                /> */}
                                <Space wrap>
                                    <TimePicker use12Hours format="h:mm:ss A" size="large"
                                        disabled={overallState.shift === "Shift Based"}
                                        value={overallState.totime}
                                        defaultValue={dayjs("00:00:00", "HH:mm:ss a")}
                                        onChange={handleToTimeChange} allowClear={false} />
                                </Space>
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth >
                                <Typography>
                                    Category<b style={{ color: "red" }}>*</b>
                                </Typography>
                                <MultiSelect
                                    options={categoryOpt}
                                    value={selectedOptionsCategory}
                                    onChange={(e) => {
                                        handleCategoryChange(e);
                                        setOverallState({
                                            ...overallState,
                                            raisedby: "Please Select Category"
                                        })
                                    }}
                                    valueRenderer={customValueRendererCategory}
                                    labelledBy="Please Select Category"
                                />



                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth >
                                <Typography>
                                    Sub Category<b style={{ color: "red" }}>*</b>
                                </Typography>
                                <MultiSelect
                                    options={Array.from(new Set(subcategory
                                        ?.filter(
                                            (comp) =>
                                                selectedOptionsCategory
                                                    .map((item) => item.value)
                                                    .includes(comp.categoryname)
                                        )
                                        ?.map((com) => com.name)
                                    ))
                                        .map((name) => ({
                                            label: name,
                                            value: name,
                                        }))}


                                    value={selectedOptionsSubCategory}
                                    onChange={(e) => {
                                        handleSubCategoryChange(e);
                                        setOverallState({
                                            ...overallState,
                                            raisedby: "Please Select SubCategory"
                                        })
                                    }}
                                    valueRenderer={customValueRendererSubCategory}
                                    labelledBy="Please Select SubCategory"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    All Login Id
                                </Typography>
                                <MultiSelect
                                    options={
                                        loginAllotFilter
                                            ?.filter(
                                                (comp) =>
                                                    selectedProject
                                                        .map((item) => item.value)
                                                        .includes(comp.projectvendor.split('-')[0]) && // Assuming branch is the part before the hyphen
                                                    selectedVendor
                                                        .map((item) => item.value)
                                                        .includes(comp.projectvendor.split('-')[1]) // Assuming unit is the part after the hyphen
                                            )
                                            ?.map((com) => ({
                                                ...com,
                                                label: com.userid,
                                                value: com.userid,
                                            }))
                                    }
                                    // value={{ label: overallState.alllogin, value: overallState.alllogin }}
                                    // onChange={(e) => {
                                    //     setOverallState({
                                    //         ...overallState,
                                    //         alllogin: e.value,
                                    //     })
                                    //     // setEmployeeOption([])
                                    // }}
                                    value={selectedOptionsLoginid}
                                    onChange={handleLoginChangeFrom}
                                    valueRenderer={customValueRendererLoginFrom}
                                    labelledBy="Please Select Login"
                                />
                            </FormControl>
                        </Grid>

                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    Employee Name
                                </Typography>
                                <MultiSelect
                                    options={
                                        // overallState.alllogin == "Please Select Login" ?
                                        employeeOption
                                            ?.filter(
                                                (comp) =>

                                                    selectedOptionsCompany
                                                        .map((item) => item.value)
                                                        .includes(comp.company) &&
                                                    selectedOptionsBranch
                                                        .map((item) => item.value)
                                                        .includes(comp.branch) &&
                                                    selectedOptionsUnit
                                                        .map((item) => item.value)
                                                        .includes(comp.unit) &&
                                                    selectedOptionsTeam
                                                        .map((item) => item.value)
                                                        .includes(comp.team)

                                            )
                                            ?.map((com) => ({
                                                ...com,
                                                label: com.companyname,
                                                value: com.companyname,
                                            }))

                                        // :
                                        // loginAllotFilter.filter(item => item.userid == overallState.alllogin && item.allotted == "allotted")?.map((com) => ({
                                        //     ...com,
                                        //     label: com.empname,
                                        //     value: com.empname,
                                        // }))

                                    }
                                    value={selectedEmployeeFrom}
                                    onChange={handleEmployeeChangeFrom}
                                    valueRenderer={customValueRendererEmployeeFrom}
                                    labelledBy="Please Select Employeename"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    With/Without Duplicate
                                </Typography>
                                <Selects
                                    options={
                                        [{ label: "With Duplicate", value: "With Duplicate" },
                                        { label: "Without Duplicate", value: "Without Duplicate" },
                                        ]
                                    }
                                    value={{ label: selectedDupe, value: selectedDupe }}
                                    onChange={(e) => setSelectedDupe(e.value)}

                                />
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>

                        <br />
                        <Grid sx={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                            <Button variant="contained"
                                onClick={(e) => {
                                    handleSubmit(e)
                                }}
                            >
                                {" "}
                                Filter
                            </Button>
                            <Button sx={userStyle.btncancel}
                                onClick={handleClear}
                            >
                                {" "}
                                CLEAR
                            </Button>
                        </Grid>
                    </Grid>

                </>
            </Box>

            <br />
            {/* ****** Table Start ****** */}

            <Box sx={userStyle.container}>
                { /* ******************************************************EXPORT Buttons****************************************************** */}
                <Grid item xs={8}>
                    <Typography sx={userStyle.importheadtext}>TempOverall Report</Typography>
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
                                <MenuItem value={(productionFilter?.length)}>All</MenuItem>
                            </Select>
                        </Box>
                    </Grid>
                    <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Box >
                            {/* {isUserRoleCompare?.includes("exceloverallreport") && (  */}
                            {/* <>
                                <ExportXL

                                    csvData={rowDataTable?.map((t, index) => ({
                                        "Sno": index + 1,
                                        "Mode": t.mode,
                                        "Company": t.company,
                                        "Branch": t.branch,
                                        "Unit": t.unit,
                                        "Team": t.team,
                                        "Vendor": t.vendor,
                                        "Category": t.filename,
                                        "SubCategory": t.category,
                                        "Unit Identifier": t.unitid,

                                        "EmpCode": t.empcode,
                                        "Emp Name": t.empname,
                                        "LoginId": t.user,
                                        "Date": t.dateval,

                                        "U-Points": Number(t.points),
                                        "U-Unitrate": Number(t.unitrate),
                                        "U-Section": t.section,
                                        "U-FlagCount": t.flagcount,

                                        "A-Points": Number(t.cpoints),
                                        "A-Unitrate": Number(t.cunitrate),
                                        "A-Section": t.csection,
                                        "A-FlagCount": t.cflagcount,

                                        "Total Points": t.totalpoints,

                                        "WorkTook": t.worktook,
                                        "UserName": t.username,
                                    }))}
                                    fileName={fileName} />
                            </> */}
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
                            {/* )}
                            {isUserRoleCompare?.includes("csvoverallreport") && (  */}
                            {/* <>
                                <ExportCSV

                                    csvData={rowDataTable?.map((t, index) => ({
                                        "Sno": index + 1,
                                        "Mode": t.mode,
                                        "Company": t.company,
                                        "Branch": t.branch,
                                        "Unit": t.unit,
                                        "Team": t.team,
                                        "Vendor": t.vendor,
                                        "Category": t.filename,
                                        "SubCategory": t.category,
                                        "Unit Identifier": t.unitid,

                                        "EmpCode": t.empcode,
                                        "Emp Name": t.empname,
                                        "LoginId": t.user,
                                        "Date": t.dateval,

                                        "U-Points": Number(t.points),
                                        "U-Unitrate": Number(t.unitrate),
                                        "U-Section": t.section,
                                        "U-FlagCount": t.flagcount,

                                        "A-Points": Number(t.cpoints),
                                        "A-Unitrate": Number(t.cunitrate),
                                        "A-Section": t.csection,
                                        "A-FlagCount": t.cflagcount,

                                        "Total Points": t.totalpoints,

                                        "WorkTook": t.worktook,
                                        "UserName": t.username,
                                    }))}
                                    fileName={fileName} />

                            </> */}
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
                            {/* )}
                            {isUserRoleCompare?.includes("printoverallreport") && (  */}
                            <>
                                <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                            </>
                            {/* )}
                            {isUserRoleCompare?.includes("pdfoverallreport") && (  */}
                            {/* <>
                                <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()} ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                            </> */}
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
                            {/* )}
                            {isUserRoleCompare?.includes("imageoverallreport") && (  */}
                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>
                            {/* )}  */}
                        </Box >
                    </Grid>
                    <Grid item md={2} xs={6} sm={6}>
                        <Box>
                            <FormControl fullWidth size="small" >
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
                <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
                <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button>&ensp;


                <br /><br />
                {sourceCheck ?
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            {/* <CircularProgress color="inherit" />  */}
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
                        <Box
                            style={{
                                width: '100%',
                                overflowY: 'hidden', // Hide the y-axis scrollbar
                            }}
                        >
                            <CustomStyledDataGrid
                                onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                                rows={rowsWithCheckboxes}
                                columns={columnDataTable.filter((column) => columnVisibility[column.field])}
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
                                Showing {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filteredDatas.length)} of {filteredDatas.length} entries
                            </Box>
                            <Box>
                                <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                    <FirstPageIcon />
                                </Button>
                                <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                    <NavigateBeforeIcon />
                                </Button>
                                {pageNumbers?.map((pageNumber) => (
                                    <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={page === pageNumber ? "active" : ""} disabled={page === pageNumber}>
                                        {pageNumber}
                                    </Button>
                                ))}
                                {lastVisiblePage < totalPages && <span>...</span>}
                                <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                    <NavigateNextIcon />
                                </Button>
                                <Button onClick={() => setPage(totalPages)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                    <LastPageIcon />
                                </Button>
                            </Box>
                        </Box>
                    </>}
            </Box>
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

            {/* Delete Modal */}
            <Box>




                {/* print layout */}

                <TableContainer component={Paper} sx={userStyle.printcls}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
                        <TableHead>
                            <TableRow>
                                <TableCell> SI.No</TableCell>
                                <TableCell>Mode</TableCell>
                                <TableCell>Company</TableCell>
                                <TableCell>Branch</TableCell>
                                <TableCell>Unit</TableCell>
                                <TableCell>Team</TableCell>
                                <TableCell>Vendor</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>SubCategory</TableCell>
                                <TableCell>Unit Identifier</TableCell>

                                <TableCell>EmpCode</TableCell>
                                <TableCell>Emp Name</TableCell>
                                <TableCell>LoginId</TableCell>
                                <TableCell>Date</TableCell>

                                <TableCell>U-Unitrate</TableCell>
                                <TableCell>U-Points</TableCell>
                                <TableCell>U-Section</TableCell>
                                <TableCell>U-FlagCount</TableCell>


                                <TableCell>A-Unitrate</TableCell>
                                <TableCell>A-Points</TableCell>
                                <TableCell>A-Section</TableCell>
                                <TableCell>A-FlagCount</TableCell>

                                <TableCell>Total Points</TableCell>
                                <TableCell>WorkTook</TableCell>
                                <TableCell>UserName</TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody align="left">
                            {rowDataTable &&
                                rowDataTable.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{row.mode}</TableCell>
                                        <TableCell>{row.company}</TableCell>
                                        <TableCell>{row.branch}</TableCell>
                                        <TableCell>{row.unit}</TableCell>
                                        <TableCell>{row.team}</TableCell>
                                        <TableCell>{row.vendor}</TableCell>
                                        <TableCell>{row.filename}</TableCell>
                                        <TableCell>{row.category}</TableCell>
                                        <TableCell>{row.unitid}</TableCell>

                                        <TableCell>{row.empcode}</TableCell>
                                        <TableCell>{row.empname}</TableCell>
                                        <TableCell>{row.user}</TableCell>
                                        <TableCell>{row.dateval}</TableCell>

                                        <TableCell>{row.unitrate}</TableCell>
                                        <TableCell>{row.points}</TableCell>
                                        <TableCell>{row.section}</TableCell>
                                        <TableCell>{row.flagcount}</TableCell>

                                        <TableCell>{row.cunitrate}</TableCell>
                                        <TableCell>{row.cpoints}</TableCell>
                                        <TableCell>{row.csection}</TableCell>
                                        <TableCell>{row.cflagcount}</TableCell>

                                        <TableCell>{row.totalpoints}</TableCell>
                                        <TableCell>{row.worktook}</TableCell>
                                        <TableCell>{row.username}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Box>
                {/* ALERT DIALOG */}
                <Dialog
                    open={isDeleteOpenalert}
                    onClose={handleCloseModalert}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: 'orange' }} />
                        <Typography variant="h6" sx={{ color: 'black', textAlign: 'center' }}>Please Select any Row</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus variant="contained" color='error'
                            onClick={handleCloseModalert}
                        > OK </Button>
                    </DialogActions>
                </Dialog>
            </Box>

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
                filename={"TempOverall Report"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />


            {/* ALERT DIALOG */}
            <Box>
                <Dialog
                    open={isErrorOpen}
                    onClose={handleCloseerr}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <Typography variant="h6" >{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleCloseerr}>ok</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}


export default TempOverallReport;