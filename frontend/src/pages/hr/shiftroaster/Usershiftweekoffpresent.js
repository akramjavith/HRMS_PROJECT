import React, { useState, useEffect, useRef, useContext } from "react";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { Box, Typography, OutlinedInput, Dialog, Select, MenuItem, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableRow, TableHead, TableBody, TableCell, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../../components/Export";
import { SERVICE } from '../../../services/Baseservice';
import jsPDF from "jspdf";
import 'jspdf-autotable';
import Selects from "react-select";
import axios from "axios";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import moment from "moment";
import { UserRoleAccessContext } from '../../../context/Appcontext';
import { handleApiError } from "../../../components/Errorhandling";
import { AuthContext } from '../../../context/Appcontext';
import StyledDataGrid from "../../../components/TableStyle";
import Headtitle from "../../../components/Headtitle";
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
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { MultiSelect } from "react-multi-select-component";
import LoadingButton from "@mui/lab/LoadingButton";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';

function UserShiftWeekOffPresent() {

    const { auth } = useContext(AuthContext);
    const { isUserRoleCompare, isAssignBranch, allTeam } = useContext(UserRoleAccessContext);
    const gridRef = useRef(null);

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;

    const [companies, setCompanies] = useState([]);
    const [branches, setBranches] = useState([]);
    const [units, setUnits] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [userShifts, setUserShifts] = useState([]);
    const [loader, setLoader] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isBtn, setIsBtn] = useState(false);
    const [statusEdit, setStatusEdit] = useState({});
    const [isHeadings, setIsHeadings] = useState([]);
    const [getUserId, setGetUserId] = useState("");
    const [getUserDate, setGetUserDate] = useState("");
    const [getEmpUserId, setGetEmpUserId] = useState("");
    const [getUserName, setGetUserName] = useState("");
    const [items, setItems] = useState([]);
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [copiedData, setCopiedData] = useState('');
    const [disabledButton, setDisabledButton] = useState(null);

    const [filterUser, setFilterUser] = useState({
        company: "Please Select Company", branch: "Please Select Branch", unit: "Please Select Unit", department: "Please Select Department",
        fromdate: "", todate: "dd-mm-yyyy", shiftstatus: "Please Select ShiftStatus"
    });

    // Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => { setIsErrorOpen(true); };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
        setIsBtn(false);
    };

    // Edit model
    const [openEdit, setOpenEdit] = useState(false);
    const handleClickOpenEdit = () => { setOpenEdit(true); };
    const handleCloseEdit = () => {
        setOpenEdit(false);
        setStatusEdit({ weekoffpresentstatus: "" });
        setDisabledButton(null);
    }

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => { setIsFilterOpen(false); };
    const handleClosePdfFilterMod = () => { setIsPdfFilterOpen(false); };

    // Manage Columns
    const [searchQueryManage, setSearchQueryManage] = useState("");
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

    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };

    useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, []);

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
        if ((selectedRows).includes(params.row.id)) {
            return 'custom-id-row'; // This is the custom class for rows with item.tat === 'ago'
        }
        return ''; // Return an empty string for other rows
    };

    const CustomStyledDataGrid = styled(StyledDataGrid)(({ theme }) => ({
        "& .MuiDataGrid-columnHeaderTitle": {
            fontSize: "14px",
            fontWeight: "bold !important",
            lineHeight: "15px",
            whiteSpace: "normal", // Wrap text within the available space
            overflow: "visible", // Allow overflowed text to be visible
            minWidth: "20px",
        },
        "& .MuiDataGrid-columnHeaders": {
            minHeight: "50px !important",
            maxHeight: "50px",
        },
        "& .MuiDataGrid-row": {
            fontSize: "12px", // Change the font size for row data
            minWidth: "20px",
            color: "#000000de",
            // minHeight: "50px !important",
            // Add any other styles you want to apply to the row data
        },
        '& .MuiDataGrid-cell': {
            whiteSpace: 'normal !important',
            wordWrap: 'break-word !important',
            lineHeight: '1.2 !important',  // Optional: Adjusts line height for better readability
        },
        // '& .MuiDataGrid-row:nth-of-type(odd)': {
        //     backgroundColor: '#f5f5f5',  // Light grey for odd rows
        // },
        // '& .MuiDataGrid-row:nth-of-type(even)': {
        //     backgroundColor: '#ffffff',  // White for even rows
        // },


    }));

    const shiftstatusDrop = [
        { label: 'Day Shift', value: "Day Shift" },
        { label: "Night Shift", value: "Night Shift" },

    ];

    const adjtypeoptions = [
        { label: "Approved", value: "Approved" },
        // { label: "Reject", value: "Reject" },
    ];

    const fetchCompany = async () => {
        try {

            setCompanies(isAssignBranch?.map(data => ({
                label: data.company,
                value: data.company,
            })).filter((item, index, self) => {
                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
            }));
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    useEffect(() => {
        fetchCompany();
    }, [])

    const fetchBranch = async (company) => {
        try {
            let arr = isAssignBranch?.filter(
                (comp) =>
                    company === comp.company
            )?.map(data => ({
                label: data.branch,
                value: data.branch,
            })).filter((item, index, self) => {
                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
            })
            setBranches(arr);

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    // get units
    const fetchUnit = async (branch) => {
        try {

            let arr = isAssignBranch?.filter(
                (comp) =>
                    branch === comp.branch
            )?.map(data => ({
                label: data.unit,
                value: data.unit,
            })).filter((item, index, self) => {
                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
            })
            setUnits(arr);

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    //company multiselect
    const [selectedCompany, setSelectedCompany] = useState([]);
    const [valueCompany, setValueCompany] = useState([]);

    const handleCompanyChange = (options) => {
        setValueCompany(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedCompany(options);
        setSelectedBranch([]);
        setValueBranch([]);
        setSelectedUnit([]);
        setValueUnit([]);
        setValueTeam([]);
        setSelectedTeam([]);
        setSelectedEmp([]);
        setValueEmp("");
    };

    const customValueRendererCompany = (valueCompany, _categoryname) => {
        return valueCompany?.length
            ? valueCompany.map(({ label }) => label)?.join(", ")
            : "Please Select Company";
    };

    //branch multiselect
    const [selectedBranch, setSelectedBranch] = useState([]);
    const [valueBranch, setValueBranch] = useState([]);

    const handleBranchChange = (options) => {
        setValueBranch(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedBranch(options);
        setSelectedUnit([]);
        setValueUnit([]);
        setValueTeam([]);
        setSelectedTeam([]);
        setSelectedEmp([]);
        setValueEmp("");
    };

    const customValueRendererBranch = (valueBranch, _categoryname) => {
        return valueBranch?.length
            ? valueBranch.map(({ label }) => label)?.join(", ")
            : "Please Select Branch";
    };

    //unit multiselect
    const [selectedUnit, setSelectedUnit] = useState([]);
    const [valueUnit, setValueUnit] = useState([]);

    const handleUnitChange = (options) => {
        setValueUnit(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedUnit(options);
        setValueTeam([]);
        setSelectedTeam([]);
        setSelectedEmp([]);
        setValueEmp("");
    };

    const customValueRendererUnit = (valueUnit, _categoryname) => {
        return valueUnit?.length
            ? valueUnit.map(({ label }) => label)?.join(", ")
            : "Please Select Unit";
    };

    //team multiselect
    const [selectedTeam, setSelectedTeam] = useState([]);
    let [valueTeam, setValueTeam] = useState([]);

    const handleTeamChange = (options) => {
        setValueTeam(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedTeam(options);
        setValueEmp([]);
        setSelectedEmp([]);
    };

    const customValueRendererTeam = (valueTeam, _categoryname) => {
        return valueTeam?.length
            ? valueTeam.map(({ label }) => label)?.join(", ")
            : "Please Select Team";
    };

    useEffect(() => {
        // Remove duplicates based on the 'company' field
        const uniqueIsAssignBranch = isAssignBranch?.reduce((acc, current) => {
            const x = acc.find(item => item.company === current.company && item.branch === current.branch && item.unit === current.unit);
            if (!x) {
                acc.push(current);
            }
            return acc;
        }, []);

        // Remove duplicates based on the 'teamname' field
        const uniqueAllTeam = allTeam?.reduce((acc, current) => {
            const x = acc.find(item => item.teamname === current.teamname);
            if (!x) {
                acc.push(current);
            }
            return acc;
        }, []);

        const company = [...new Set(uniqueIsAssignBranch.map(data => data.company))].map((data) => ({
            label: data,
            value: data,
        }));
        setSelectedCompany(company);
        setValueCompany(
            company.map((a, index) => {
                return a.value;
            })
        );
        const branch = uniqueIsAssignBranch?.filter(
            (val) =>
                company?.map(comp => comp.value === val.company)
        )?.map(data => ({
            label: data.branch,
            value: data.branch,
        })).filter((item, index, self) => {
            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
        })
        setSelectedBranch(branch);
        setValueBranch(
            branch.map((a, index) => {
                return a.value;
            })
        );
        const unit = uniqueIsAssignBranch?.filter(
            (val) =>
                company?.map(comp => comp.value === val.company) && branch?.map(comp => comp.value === val.branch)
        )?.map(data => ({
            label: data.unit,
            value: data.unit,
        })).filter((item, index, self) => {
            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
        })
        setSelectedUnit(unit);
        setValueUnit(
            unit.map((a, index) => {
                return a.value;
            })
        );

        const team = uniqueAllTeam?.filter(
            (val) =>
                company?.map(comp => comp.value === val.company) && branch?.map(comp => comp.value === val.branch) && unit?.map(comp => comp.value === val.unit)
        )?.map(data => ({
            label: data.teamname,
            value: data.teamname,
        }))
        setSelectedTeam(team);
        setValueTeam(
            team.map((a, index) => {
                return a.value;
            })
        );
    }, [isAssignBranch, allTeam])

    const fetchDepartment = async () => {
        try {
            let res_dep = await axios.get(SERVICE.DEPARTMENT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            // Remove duplicates from departments
            let uniqueDepartments = Array.from(new Set(res_dep.data.departmentdetails?.map((t) => t.deptname)));
            setDepartments(uniqueDepartments.map((t) => ({
                label: t,
                value: t
            })));

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    useEffect(() => {
        fetchDepartment();
    }, [])

    const fetchEmployee = async () => {
        try {
            let res_emp = await axios.get(SERVICE.USER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            // let data_set = res_emp.data.users.filter((data) => {
            //     if (valueCompany.includes(data.company) && valueBranch.includes(data.branch) && valueUnit.includes(data.unit)) {
            //         return value === data.department;
            //     }
            // });

            // const emps = [
            //     ...data_set.map((d) => ({
            //         ...d,
            //         label: d.companyname,
            //         value: d.companyname,
            //     })),
            // ];

            // setEmployees(emps);
            setEmployees(res_emp.data.users);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    useEffect(() => {
        fetchEmployee();
    }, []);

    const [selectedEmp, setSelectedEmp] = useState([]);
    let [valueEmp, setValueEmp] = useState("");

    const handleEmployeeChange = (options) => {
        setValueEmp(options.map(option => option.value))
        setSelectedEmp(options);
        // if (employees.length === options.length) {
        //     const filteredOptions = options.filter(option => option.value !== "ALL");
        //     setSelectedEmp(filteredOptions);
        //     setValueEmp(filteredOptions.map(option => option.value));
        // }
        // // Check if "ALL" is selected
        // else if (options.some(option => option.value === "ALL")) {
        //     // Set "ALL" as the only selected option
        //     setSelectedEmp([{ value: "ALL", label: "ALL" }]);
        //     setValueEmp(["ALL"]);
        // } else {
        //     // Filter out "ALL" if any other option is selected
        //     const filteredOptions = options.filter(option => option.value !== "ALL");
        //     setSelectedEmp(filteredOptions);
        //     setValueEmp(filteredOptions.map(option => option.value));
        // }
    };

    const customValueRendererEmp = (valueEmp, _employees) => {
        return valueEmp.length
            ? valueEmp.map(({ label }) => label).join(", ")
            : "Please Select Employee";
    };

    const calculateSaturday = (date) => {
        if (!date) {
            return '';
        }
        const day = new Date(date);
        day.setDate(day.getDate() + 5); // Move from Monday to Saturday
        return date ? day.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]; // Return date in YYYY-MM-DD format
    };

    const handleFromDateChange = (e) => {
        const selectedDate = e.target.value;
        const selectedDay = new Date(selectedDate);

        const saturdayDate = calculateSaturday(selectedDay);

        setFilterUser({
            ...filterUser,
            fromdate: selectedDate,
            todate: saturdayDate
        });
    };

    const fetchUsers = async () => {
        setLoader(true);
        setIsBtn(true);
        try {
            let res_present = await axios.post(SERVICE.WEEKOFFPRESENT_FILTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                // company: [...valueCompany],
                // branch: [...valueBranch],
                // unit: [...valueUnit],
                // team: [...valueTeam],
                // department: filterUser.department,
                employee: valueEmp,
                shiftstatus: filterUser.shiftstatus,
                fromdate: filterUser.fromdate,
                todate: filterUser.todate,
            });

            setUserShifts(res_present.data.finalweekoffpresents);
            // Assuming isHeadings is an array of unique headings
            const uniqueHeadings = [...new Set(res_present.data.finalheading)];
            setIsHeadings(uniqueHeadings);
            setLoader(false);
            setIsBtn(false);
            setDisabledButton(null);
        } catch (err) { setLoader(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    // Show All Columns & Manage Columns 
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        department: true,
        shiftstatus: true,
        target: true,
        weekstartend: true,
        calstartend: true,
        username: true,
        empcode: true,
        ...isHeadings.reduce((acc, data, index) => {
            // acc[`${data}`] = true;
            acc[`${data}_Original`] = true;  // Visibility for adjstatus column
            acc[`${data}_Temp`] = true;  // Visibility for tempadjstatus column
            return acc;
        }, {}),
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    // Helper function to generate date array between two dates
    const generateDateArray = (startDateStr, endDateStr) => {
        const dateArray = [];
        const [startDay, startMonth, startYear] = startDateStr.split("/").map(Number);
        const [endDay, endMonth, endYear] = endDateStr.split("/").map(Number);

        let currentDate = new Date(startYear, startMonth - 1, startDay);
        const endDate = new Date(endYear, endMonth - 1, endDay);

        while (currentDate <= endDate) {
            const day = String(currentDate.getDate()).padStart(2, '0');
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const year = currentDate.getFullYear();
            const date = `${day}/${month}/${year}`;
            const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });

            dateArray.push({ date, dayName });
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dateArray;
    };

    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedCompany.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Company"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (selectedBranch.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Branch"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (selectedUnit.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Unit"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (selectedTeam.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Team"}</p>
                </>
            );
            handleClickOpenerr();
        }
        // else if (filterUser.department === 'Please Select Department') {
        //     setShowAlert(
        //         <>
        //             <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
        //             <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Department"}</p>
        //         </>
        //     );
        //     handleClickOpenerr();
        // }
        else if (filterUser.shiftstatus === 'Please Select ShiftStatus') {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select ShiftStatus"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (selectedEmp.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Employee"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (filterUser.fromdate === "" && filterUser.todate === "dd-mm-yyyy") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select From Date"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            fetchUsers();
        }
    };

    const handleClear = (e) => {
        e.preventDefault();
        setBranches([]);
        setUnits([]);
        setUserShifts([]);
        setIsHeadings([]);
        setFilterUser({
            ...filterUser, department: "Please Select Department", fromdate: "", todate: "dd-mm-yyyy", shiftstatus: "Please Select ShiftStatus"
        })
        setSelectedCompany([]);
        setValueCompany([]);
        setSelectedBranch([]);
        setValueBranch([]);
        setSelectedUnit([]);
        setValueUnit([]);
        setSelectedTeam([]);
        setValueTeam([]);
        setSelectedEmp([]);
        setValueEmp("");
        setDisabledButton(null);
        setShowAlert(
            <>
                <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7ac767" }} />
                <p style={{ fontSize: "20px", fontWeight: 900 }}>
                    {"Cleared Successfully"}
                </p>
            </>
        );
        handleClickOpenerr();
    }

    //get single row to edit....
    const getCode = async (rowdata) => {
        // console.log(rowdata.userid, 'rowdata.userid')
        try {

            let res_att = await axios.post(SERVICE.ATTENDANCE_ID_FILTER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                userid: rowdata.userid,
            });

            const dateRange = rowdata.date?.split("-");
            const dateArray = generateDateArray(dateRange[0], dateRange[1]);
            // console.log(res_att?.data?.attandances, 'res_att?.data?.attandances')

            res_att?.data?.attandances?.map((att) => {
                dateArray?.forEach((d) => {
                    // console.log(d.dayName, 'd.dayname')
                    // console.log(rowdata.weekoffpresentday, 'rowdata weekoff')
                    // console.log(d.dayName === rowdata.weekoffpresentday)
                    if (d.dayName === rowdata.weekoffpresentday) {
                        const [day, month, year] = d.date.split('/');
                        const finalDate = `${day}-${month}-${year}`;
                        setGetUserDate(finalDate);
                        setGetEmpUserId(rowdata.userid);
                        setGetUserName(rowdata.rowusername);
                        // console.log(finalDate, att.date)
                        // console.log(finalDate === att.date)
                        if (finalDate === att.date) {
                            // console.log(att._id, 'att._id')
                            setGetUserId(att._id);
                        }
                    }
                })
            })

            setStatusEdit({ weekoffpresentstatus: "Please Select Status" });
            handleClickOpenEdit();

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }

    const sendRequest = async () => {
        try {
            if (statusEdit.weekoffpresentstatus === "Please Select Status") {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Status"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else {
                const response = await axios.get("https://api.ipify.org?format=json");
                if (getUserId) {
                    await axios.put(`${SERVICE.ATTENDANCE_CLOCKIN_SINGLE}/${getUserId}`, {
                        attandancemanual: Boolean(false),
                        weekoffpresentstatus: Boolean(true),
                        clockinipaddress: String(response?.data?.ip),
                    }, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        }
                    });
                }
                else {
                    await axios.post(`${SERVICE.ATTENDANCE_CLOCKIN_CREATE}`, {
                        shiftendtime: String(""),
                        shiftname: String(""),
                        username: String(getUserName),
                        userid: String(getEmpUserId),
                        clockintime: String("00:00:00"),
                        date: String(getUserDate),
                        clockinipaddress: String(response?.data?.ip),
                        status: true,
                        clockouttime: "00:00:00",
                        buttonstatus: "true",
                        autoclockout: Boolean(false),
                        attandancemanual: Boolean(false),
                        weekoffpresentstatus: Boolean(true),
                        shiftmode: String("Main Shift"),
                    }, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        }
                    });
                }

                await fetchUsers();
                handleCloseEdit();
                setShowAlert(
                    <>
                        <CheckCircleOutlineIcon
                            sx={{ fontSize: "100px", color: "#7ac767" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"Updated Successfully 👍"}
                        </p>
                    </>
                );
                handleClickOpenerr();
            }

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const addSerialNumber = async () => {
        const itemsWithSerialNumber = userShifts?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumber();
    }, [userShifts]);

    //Datatable
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

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

    // Split the search query into individual terms
    const searchTerms = searchQuery.toLowerCase().split(" ");
    // // Modify the filtering logic to check each term
    // const filteredDatas = items?.filter((item) => {
    //     return searchTerms.every((term) =>
    //         Object.values(item).join(" ").toLowerCase().includes(term)
    //     );
    // });

    // const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

    // const totalPages = Math.ceil(filteredDatas.length / pageSize);

    // const visiblePages = Math.min(totalPages, 3);

    // const firstVisiblePage = Math.max(1, page - 1);
    // const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

    // const pageNumbers = [];

    // const indexOfLastItem = page * pageSize;

    // for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    //     pageNumbers.push(i);
    // }

    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox
                checked={selectAllChecked}
                onChange={onSelectAll}
            />
        </div>
    );

    const handleAdjStatusClick = (dayData) => {
        setDisabledButton('adjstatus');
        if (dayData.adjstatus !== 'Not Achieved' || dayData.adjstatus !== 'Verified') {
            getCode(dayData);
        }
    };

    const handleTempAdjStatusClick = (dayData) => {
        setDisabledButton('tempadjstatus');
        if (dayData.tempadjstatus !== 'Not Achieved' || dayData.tempadjstatus !== 'Verified') {
            getCode(dayData);
        }
    };

    const columnDataTable = [
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 75, hide: !columnVisibility.serialNumber, headerClassName: "bold-header" },
        { field: "company", headerName: "Company", flex: 0, width: 100, hide: !columnVisibility.company, headerClassName: "bold-header" },
        { field: "branch", headerName: "Branch", flex: 0, width: 110, hide: !columnVisibility.branch, headerClassName: "bold-header" },
        { field: "unit", headerName: "Unit", flex: 0, width: 100, hide: !columnVisibility.unit, headerClassName: "bold-header" },
        { field: "team", headerName: "Team", flex: 0, width: 100, hide: !columnVisibility.team, headerClassName: "bold-header" },
        { field: "department", headerName: "Department", flex: 0, width: 120, hide: !columnVisibility.department, headerClassName: "bold-header" },
        { field: "username", headerName: "Employee Name", flex: 0, width: 150, hide: !columnVisibility.username, headerClassName: "bold-header" },
        { field: "empcode", headerName: "Employee Code", flex: 0, width: 110, hide: !columnVisibility.empcode, headerClassName: "bold-header" },
        { field: "shiftstatus", headerName: "Shift Status", flex: 0, width: 100, hide: !columnVisibility.shiftstatus, headerClassName: "bold-header" },
        // { field: "startdate", headerName: "Start Date", flex: 0, width: 100, hide: !columnVisibility.startdate, headerClassName: "bold-header" },
        { field: "target", headerName: "Target Points", flex: 0, width: 120, hide: !columnVisibility.target, headerClassName: "bold-header", },
        { field: "weekstartend", headerName: "Day (Start / End)", flex: 0, width: 150, hide: !columnVisibility.weekstartend, headerClassName: "bold-header", },
        { field: "calstartend", headerName: "Cal Day (Start / End)", flex: 0, width: 150, hide: !columnVisibility.calstartend, headerClassName: "bold-header", },
        ...isHeadings.flatMap((column, index) => [
            {
                field: `${column}_Original`,
                headerName: `${column}\nOriginal`,
                hide: !columnVisibility[column],
                flex: 0,
                width: 180,
                sortable: false,
                renderCell: (params) => {
                    const dayData = params.row.days.find(day => day.date === column);
                    if (!dayData) return null;
                    return (
                        <Grid>
                            <Typography variant="body2" sx={{ fontSize: '10px', fontWeight: 'bold' }}>
                                Week Target: {dayData.targetPoints}
                            </Typography>
                            <Button
                                size="small"
                                disabled={disabledButton === 'tempadjstatus'}
                                sx={{
                                    textTransform: 'capitalize',
                                    borderRadius: '4px',
                                    boxShadow: 'none',
                                    fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                    fontWeight: '400',
                                    fontSize: '0.575rem',
                                    lineHeight: '1.43',
                                    letterSpacing: '0.01071em',
                                    display: 'flex',
                                    padding: dayData.adjstatus === 'Not Achieved' ? '3px 10px' : '3px 8px',
                                    color: dayData.adjstatus === 'Not Achieved' ? '#892a23' : '#052106',
                                    backgroundColor: disabledButton === 'tempadjstatus' ? "" : dayData.adjstatus === 'Verified' ? 'rgb(156 239 156)' : (dayData.adjstatus === 'Achieved' ? 'rgb(243 203 117)' : 'rgb(243 174 174)'),
                                    pointerEvents: (dayData.adjstatus === 'Not Achieved' || dayData.adjstatus === 'Verified') ? 'none' : 'auto',
                                    '&:hover': {
                                        color: dayData.adjstatus === 'Not Achieved' ? '#892a23' : '#052106',
                                        backgroundColor: dayData.adjstatus === 'Verified' ? 'rgb(156 239 156)' : (dayData.adjstatus === 'Achieved' ? 'rgb(243 203 117)' : 'rgb(243 174 174)'),
                                    },
                                }}
                                // onClick={(e) => {
                                //     if (dayData.adjstatus !== 'Not Achieved' || dayData.adjstatus !== 'Verified') {
                                //         getCode(dayData);
                                //     }
                                // }}
                                onClick={() => handleAdjStatusClick(dayData)}
                            >
                                {dayData.adjstatus}
                            </Button>

                            <Typography variant="body2" sx={{ fontSize: '10px', fontWeight: 'bold' }}>
                                Week Achieved Point: {dayData.weekPoints.toFixed(2)}
                            </Typography>
                        </Grid>
                    );
                },
            },
            {
                field: `${column}_Temp`,
                headerName: `${column}\nTemp`,
                hide: !columnVisibility[column],
                flex: 0,
                width: 180,
                sortable: false,
                renderCell: (params) => {
                    const dayData = params.row.days.find(day => day.date === column);
                    if (!dayData) return null;
                    return (
                        <Grid>
                            <Typography variant="body2" sx={{ fontSize: '10px', fontWeight: 'bold' }}>
                                Week Target: {dayData.targetPoints}
                            </Typography>
                            <Button
                                size="small"
                                disabled={disabledButton === 'adjstatus'}
                                sx={{
                                    textTransform: 'capitalize',
                                    borderRadius: '4px',
                                    boxShadow: 'none',
                                    fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                    fontWeight: '400',
                                    fontSize: '0.575rem',
                                    lineHeight: '1.43',
                                    letterSpacing: '0.01071em',
                                    display: 'flex',
                                    padding: dayData.tempadjstatus === 'Not Achieved' ? '3px 10px' : '3px 8px',
                                    color: dayData.tempadjstatus === 'Not Achieved' ? '#892a23' : '#052106',
                                    backgroundColor: dayData.tempadjstatus === 'Verified' ? 'rgb(156 239 156)' : (dayData.tempadjstatus === 'Achieved' ? 'rgb(243 203 117)' : 'rgb(243 174 174)'),
                                    pointerEvents: (dayData.tempadjstatus === 'Not Achieved' || dayData.tempadjstatus === 'Verified') ? 'none' : 'auto',
                                    '&:hover': {
                                        color: dayData.tempadjstatus === 'Not Achieved' ? '#892a23' : '#052106',
                                        backgroundColor: dayData.tempadjstatus === 'Verified' ? 'rgb(156 239 156)' : (dayData.tempadjstatus === 'Achieved' ? 'rgb(243 203 117)' : 'rgb(243 174 174)'),
                                    },
                                }}
                                // onClick={(e) => {
                                //     if (dayData.tempadjstatus !== 'Not Achieved' || dayData.tempadjstatus !== 'Verified') {
                                //         getCode(dayData);
                                //     }
                                // }}
                                onClick={() => handleTempAdjStatusClick(dayData)}
                            >
                                {dayData.tempadjstatus}
                            </Button>

                            <Typography variant="body2" sx={{ fontSize: '10px', fontWeight: 'bold' }}>
                                Week Achieved Point: {dayData.tempWeekPoints.toFixed(2)}
                            </Typography>
                        </Grid>
                    );
                },
            }
        ]),
    ];

    const rowDataTable = items?.map((item, index) => {
        return {
            id: item.id,
            serialNumber: item.serialNumber,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            department: item.department,
            username: item.username,
            empcode: item.empcode,
            shiftstatus: item.shiftstatus,
            // startdate: moment(item.startdate, "YYYY-MM-DD").format("DD-MM-YYYY"),
            target: item.target,
            weekstartend: `${item.shiftstartday} - ${item.shiftendday}`,
            calstartend: `${item.calstartday} - ${item.calendday}`,
            days: item.weeksColumns,
        }
    });

    // Modify the filtering logic to check each term    
    const filteredDatas = rowDataTable?.filter((item) => {
        return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });

    const filteredData = filteredDatas?.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    const totalPages = Math.ceil(filteredDatas?.length / pageSize);
    const visiblePages = Math.min(totalPages, 3);
    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);
    const pageNumbers = [];
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

    const rowsWithCheckboxes = filteredData.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRows.includes(row.id),
    }));

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

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
        column.headerName?.toLowerCase().includes(searchQueryManage?.toLowerCase())
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

    // Excel
    const fileName = "Usershift Weekoff Present";
    const [fileFormat, setFormat] = useState('')
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = fileFormat === "xl" ? '.xlsx' : '.csv';

    const exportToCSV = (csvData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    const handleExportXL = (isfilter) => {
        const headers = [
            'SNo',
            'Company',
            'Branch',
            'Unit',
            'Team',
            'Department',
            'Employee Name',
            'Employee Code',
            'Shift Status',
            "Target Points",
            "Day (Start / End)",
            "Cal Day (Start / End)",
            ...isHeadings.map(header => `${header} (Original)`),
            ...isHeadings.map(header => `${header} (Temp)`),
        ];

        let data = [];
        if (isfilter === "filtered") {
            data = filteredData.map((row, index) => {
                return [
                    index + 1,
                    row.company,
                    row.branch,
                    row.unit,
                    row.team,
                    row.department,
                    row.username,
                    row.empcode,
                    row.shiftstatus,
                    row.target,
                    row.weekstartend,
                    row.calstartend,
                    ...row.days.map(item => {
                        return `WKT: ${item.targetPoints} Status: ${item.adjstatus} WKAP: ${item.weekPoints}`
                    }),
                    ...row.days.map(item => {
                        return `WKT: ${item.targetPoints} Status: ${item.tempadjstatus} WKAP: ${item.tempWeekPoints}`
                    }),
                ]
            });
        } else if (isfilter === "overall") {
            data = rowDataTable.map((row, index) => {
                return [
                    index + 1,
                    row.company,
                    row.branch,
                    row.unit,
                    row.team,
                    row.department,
                    row.username,
                    row.empcode,
                    row.shiftstatus,
                    row.target,
                    row.weekstartend,
                    row.calstartend,
                    ...row.days.map(item => {
                        return `WKT: ${item.targetPoints} Status: ${item.adjstatus} WKAP: ${item.weekPoints}`
                    }),
                    ...row.days.map(item => {
                        return `WKT: ${item.targetPoints} Status: ${item.tempadjstatus} WKAP: ${item.tempWeekPoints}`
                    }),
                ]
            });
        }

        // Add headers to the data array
        const formattedData = data.map(row => {
            const rowData = {};
            headers.forEach((header, index) => {
                rowData[header] = row[index];
            });
            return rowData;
        });

        exportToCSV(formattedData, fileName);
        setIsFilterOpen(false);
    };

    // Print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Usershift Weekoff Present",
        pageStyle: "print",
    });

    //pdf....
    const downloadPdf = (isfilter) => {

        const doc = new jsPDF({ orientation: "landscape" });

        // Define the table headers
        const headers = [
            'SNo',
            'Company',
            'Branch',
            'Unit',
            'Team',
            'Department',
            'Employee Name',
            'Employee Code',
            'Shift Status',
            // 'Start Date',
            "Target Points",
            "Day (Start / End)",
            "Cal Day (Start / End)",
            ...isHeadings.map(header => `${header} (Original)`),
            ...isHeadings.map(header => `${header} (Temp)`),
        ];

        let data = [];
        if (isfilter === "filtered") {
            data = filteredData.map((row, index) => [
                index + 1,
                row.company,
                row.branch,
                row.unit,
                row.team,
                row.department,
                row.username,
                row.empcode,
                row.shiftstatus,
                // row.startdate,
                row.target,
                row.weekstartend,
                row.calstartend,
                ...((row.days || []).map(item =>
                    `WKT: ${item.targetPoints}\nStatus: ${item.adjstatus}\nWKAP: ${item.weekPoints}`
                )),
                ...((row.days || []).map(item =>
                    `WKT: ${item.targetPoints}\nStatus: ${item.tempadjstatus}\nWKAP: ${item.tempWeekPoints}`
                )),
            ]);

        } else {
            data = rowDataTable.map((row, index) => {
                return [
                    index + 1,
                    row.company,
                    row.branch,
                    row.unit,
                    row.team,
                    row.department,
                    row.username,
                    row.empcode,
                    row.shiftstatus,
                    row.target,
                    row.weekstartend,
                    row.calstartend,
                    ...((row.days || []).map(item =>
                        `WKT: ${item.targetPoints}\nOrg Status: ${item.adjstatus}\nWKAP: ${item.weekPoints}`
                    )),
                    ...((row.days || []).map(item =>
                        `WKT: ${item.targetPoints}\nTmp Status: ${item.tempadjstatus}\nWKAP: ${item.tempWeekPoints}`
                    )),
                ]
            });
        }

        // Generate PDF
        doc.autoTable({
            theme: "grid",
            styles: { fontSize: 5 },
            head: [headers],
            body: data,
        });

        doc.save("Usershift Weekoff Present.pdf");
    };

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, 'Usershift Weekoff Present.png');
                });
            });
        }
    };

    return (
        <Box>
            <Headtitle title={'Usershift Weekoff Present'} />
            {/* ****** Header Content ****** */}

            {isUserRoleCompare?.includes("ausershiftweekoffpresent")
                && (

                    <Box sx={userStyle.selectcontainer}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>Usershift Weekoff Present</Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={12}>
                                    <Typography>Company<b style={{ color: "red" }}>*</b></Typography>
                                    <FormControl size="small" fullWidth>
                                        {/* <Selects
                                            styles={colourStyles}
                                            options={companies}
                                            value={{ label: filterUser.company, value: filterUser.company }}
                                            onChange={(e) => {
                                                setFilterUser({ ...filterUser, company: e.value, branch: 'Please Select Branch', unit: 'Please Select Unit' });
                                                fetchBranch(e.value);
                                            }}
                                        /> */}
                                        <MultiSelect
                                            options={isAssignBranch?.map(data => ({
                                                label: data.company,
                                                value: data.company,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            value={selectedCompany}
                                            onChange={(e) => {
                                                handleCompanyChange(e);
                                                setFilterUser({ ...filterUser, department: 'Please Select Department' });
                                            }}
                                            valueRenderer={customValueRendererCompany}
                                            labelledBy="Please Select Company"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography> Branch<b style={{ color: "red" }}>*</b> </Typography>
                                        {/* <Selects
                                            styles={colourStyles}
                                            options={branches}
                                            value={{ label: filterUser.branch, value: filterUser.branch }}
                                            onChange={(e) => {
                                                setFilterUser({ ...filterUser, branch: e.value, unit: 'Please Select Unit' });
                                                fetchUnit(e.value);
                                            }}
                                        /> */}
                                        <MultiSelect
                                            options={isAssignBranch?.filter(
                                                (comp) =>
                                                    valueCompany?.includes(comp.company)
                                            )?.map(data => ({
                                                label: data.branch,
                                                value: data.branch,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            value={selectedBranch}
                                            onChange={(e) => {
                                                handleBranchChange(e);
                                                setFilterUser({ ...filterUser, department: 'Please Select Department' });
                                            }}
                                            valueRenderer={customValueRendererBranch}
                                            labelledBy="Please Select Branch"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography> Unit<b style={{ color: "red" }}>*</b></Typography>
                                        {/* <Selects
                                            styles={colourStyles}
                                            options={units}
                                            value={{ label: filterUser.unit, value: filterUser.unit }}
                                            onChange={(e) => {
                                                setFilterUser({ ...filterUser, unit: e.value, });
                                            }}
                                        /> */}
                                        <MultiSelect
                                            options={isAssignBranch?.filter(
                                                (comp) =>
                                                    valueCompany?.includes(comp.company) && valueBranch?.includes(comp.branch)
                                            )?.map(data => ({
                                                label: data.unit,
                                                value: data.unit,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            value={selectedUnit}
                                            onChange={(e) => {
                                                handleUnitChange(e);
                                                setFilterUser({ ...filterUser, department: 'Please Select Department' });
                                            }}
                                            valueRenderer={customValueRendererUnit}
                                            labelledBy="Please Select Unit"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Team<b style={{ color: "red" }}>*</b></Typography>
                                        <MultiSelect
                                            options={allTeam
                                                ?.filter((u) => valueCompany?.includes(u.company) && valueBranch?.includes(u.branch) && valueUnit?.includes(u.unit))
                                                .map((u) => ({
                                                    ...u,
                                                    label: u.teamname,
                                                    value: u.teamname,
                                                }))}
                                            value={selectedTeam}
                                            onChange={(e) => {
                                                handleTeamChange(e);
                                            }}
                                            valueRenderer={customValueRendererTeam}
                                            labelledBy="Please Select Team"
                                        />
                                    </FormControl>
                                </Grid>
                                {/* <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Department<b style={{ color: "red" }}>*</b> </Typography>
                                        <Selects
                                            styles={colourStyles}
                                            options={departments}
                                            value={{ label: filterUser.department, value: filterUser.department }}
                                            onChange={(e) => {
                                                setFilterUser({ ...filterUser, department: e.value, });
                                                setSelectedEmp([]);
                                                setValueEmp("");
                                                setEmployees([]);
                                                fetchEmployee(e.value);
                                            }}
                                        />
                                    </FormControl>
                                </Grid> */}
                                <Grid item md={3} sm={12} xs={12} sx={{ display: "flex", flexDirection: "row" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Employee<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={employees?.filter(
                                                (comp) =>
                                                    valueCompany?.includes(comp.company) && valueBranch?.includes(comp.branch) && valueUnit?.includes(comp.unit) && valueTeam?.includes(comp.team)
                                            )?.map(data => ({
                                                label: data.companyname,
                                                value: data.companyname,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            value={selectedEmp}
                                            onChange={(e) => {
                                                handleEmployeeChange(e);
                                            }}
                                            valueRenderer={customValueRendererEmp}
                                            labelledBy="Please Select Employee"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Shift Status<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={shiftstatusDrop}
                                            styles={colourStyles}
                                            value={{ label: filterUser.shiftstatus, value: filterUser.shiftstatus }}
                                            onChange={(e) => {
                                                setFilterUser({ ...filterUser, shiftstatus: e.value, });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <Typography>From Date<b style={{ color: "red" }}>*</b></Typography>
                                    <FormControl fullWidth size="small">
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="date"
                                            placeholder="Date"
                                            value={filterUser.fromdate}
                                            // onChange={(e) => {
                                            //     setFilterUser({
                                            //         ...filterUser,
                                            //         fromdate: e.target.value,
                                            //     });
                                            //     calculateWeekRangesForFilter(e.target.value);
                                            // }}
                                            onChange={handleFromDateChange}
                                            // inputProps={{
                                            //     min: minDate,
                                            //     max: maxDate,
                                            //     step: 7 // This ensures the picker moves in weekly steps (i.e., Mondays only)
                                            // }}
                                            inputProps={{
                                                min: "1900-01-01",
                                                step: 7, // Ensures the picker moves in weekly steps (i.e., Mondays only)
                                                pattern: "[0-9]{4}-[0-9]{2}-[0-9]{2}",
                                                oninvalid: (e) => {
                                                    e.target.setCustomValidity("Please select a Monday.");
                                                },
                                                oninput: (e) => {
                                                    e.target.setCustomValidity("");
                                                }
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <Typography>To Date<b style={{ color: "red" }}>*</b></Typography>
                                    <FormControl fullWidth size="small">
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={
                                                filterUser.todate && moment(filterUser.todate, "YYYY-MM-DD", true).isValid()
                                                    ? moment(filterUser.todate).format("DD-MM-YYYY")
                                                    : "dd-mm-yyyy"
                                            }
                                            readOnly
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={2.5} xs={12} sm={6}>
                                    <>
                                        <LoadingButton
                                            onClick={handleSubmit}
                                            loading={isBtn}
                                            color="primary"
                                            loadingPosition="end"
                                            variant="contained"
                                        >
                                            Filter
                                        </LoadingButton>
                                        {/* <Button variant='contained' color='primary' onClick={handleSubmit} disabled={isBtn}>Filter</Button> */}

                                    </>
                                </Grid>
                                <Grid item md={2.5} xs={12} sm={6}>
                                    <>
                                        <Button sx={userStyle.btncancel} onClick={handleClear}>Clear</Button>
                                    </>
                                </Grid>
                            </Grid>

                        </>
                    </Box>
                )}

            <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lusershiftweekoffpresent")
                && (

                    <>
                        <Box sx={userStyle.container}>
                            { /* ******************************************************EXPORT Buttons****************************************************** */}
                            <Grid item xs={8}>
                                <Typography sx={userStyle.importheadtext}>Usershift Weekoff Present List</Typography>
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
                                            {/* <MenuItem value={(userShifts?.length)}>All</MenuItem> */}
                                        </Select>
                                    </Box>
                                </Grid>
                                <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Box >
                                        {isUserRoleCompare?.includes("excelusershiftweekoffpresent") && (
                                            <>
                                                {/* <ExportXL csvData={rowDataTable.map((t, index) => ({
                                                    Sno: index + 1,
                                                    Code: t.code,
                                                    Name: t.name,
                                                }))} fileName={fileName} /> */}
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    // fetchUsers()
                                                    setFormat("xl")
                                                }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("csvusershiftweekoffpresent") && (
                                            <>
                                                {/* <ExportCSV csvData={rowDataTable.map((t, index) => ({
                                                    Sno: index + 1,
                                                    Code: t.code,
                                                    Name: t.name,
                                                }))} fileName={fileName} /> */}
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    // fetchUsers()
                                                    setFormat("csv")
                                                }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("printusershiftweekoffpresent") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdfusershiftweekoffpresent") && (
                                            <>
                                                {/* <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()} ><FaFilePdf />&ensp;Export to PDF&ensp;</Button> */}
                                                <Button sx={userStyle.buttongrp}
                                                    onClick={() => {
                                                        setIsPdfFilterOpen(true)
                                                        // fetchUsers()
                                                    }}
                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("imageusershiftweekoffpresent") && (
                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>
                                        )}
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
                            {loader ?
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
                                :
                                <>
                                    <Box style={{ width: '100%', overflowY: 'hidden', }} >
                                        <CustomStyledDataGrid
                                            onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                                            rows={rowsWithCheckboxes}
                                            columns={columnDataTable.filter((column) => columnVisibility[column.field])}
                                            onSelectionModelChange={handleSelectionChange}
                                            selectionModel={selectedRows}
                                            autoHeight={true}
                                            ref={gridRef}
                                            density="standard"
                                            hideFooter
                                            getRowClassName={getRowClassName}
                                            disableRowSelectionOnClick
                                        />
                                    </Box>
                                    {/* <Box style={userStyle.dataTablestyle}>
                                        <Box>
                                            Showing {filteredData.length > 0 ? ((page - 1) * pageSize) + 1 : 0} to {Math.min(page * pageSize, filteredDatas.length)} of {filteredDatas.length} entries
                                        </Box>
                                        <Box>
                                            <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                                <FirstPageIcon />
                                            </Button>
                                            <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                                <NavigateBeforeIcon />
                                            </Button>
                                            {pageNumbers?.map((pageNumber) => (
                                                <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={((page)) === pageNumber ? 'active' : ''} disabled={page === pageNumber}>
                                                    {pageNumber}
                                                </Button>
                                            ))}
                                            {lastVisiblePage < totalPages && <span>...</span>}
                                            <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                                <NavigateNextIcon />
                                            </Button>
                                            <Button onClick={() => setPage((totalPages))} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                                <LastPageIcon />
                                            </Button>
                                        </Box>
                                    </Box> */}
                                    <Box style={userStyle.dataTablestyle}>
                                        <Box>
                                            Showing{" "}
                                            {filteredDatas.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
                                            {Math.min(page * pageSize, filteredDatas?.length)} of{" "}
                                            {filteredDatas?.length} entries
                                        </Box>
                                        <Box>
                                            <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn} > <FirstPageIcon /> </Button>
                                            <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}  >  <NavigateBeforeIcon /> </Button>
                                            {pageNumbers?.map((pageNumber) => (
                                                <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={page === pageNumber ? "active" : ""} disabled={page === pageNumber}  > {pageNumber}  </Button>
                                            ))}
                                            {lastVisiblePage < totalPages && <span>...</span>}
                                            <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn} > <NavigateNextIcon /> </Button>
                                            <Button onClick={() => setPage(totalPages)} disabled={page === totalPages} sx={userStyle.paginationbtn} > <LastPageIcon /> </Button>
                                        </Box>
                                    </Box>
                                </>
                            }
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

            {/* print layout */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}   >
                    <TableHead sx={{ fontWeight: "600" }}>
                        <TableRow>
                            <TableCell>SNo</TableCell>
                            <TableCell>Company</TableCell>
                            <TableCell>Branch</TableCell>
                            <TableCell>Unit</TableCell>
                            <TableCell>Team</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Shift Status</TableCell>
                            {/* <TableCell>Start Date</TableCell> */}
                            <TableCell> Target Points</TableCell>
                            <TableCell> Day (Start / End)</TableCell>
                            <TableCell>Cal Day (Start / End)</TableCell>
                            {isHeadings.map((column, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <TableCell>
                                            <Box sx={userStyle.tableheadstyle}>
                                                {`${column} (Original)`}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={userStyle.tableheadstyle}>
                                                {`${column} (Temp)`}
                                            </Box>
                                        </TableCell>
                                    </React.Fragment>
                                );
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody align="left" >
                        {filteredData &&
                            filteredData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row.serialNumber}</TableCell>
                                    <TableCell>{row.company}</TableCell>
                                    <TableCell>{row.branch}</TableCell>
                                    <TableCell>{row.unit}</TableCell>
                                    <TableCell>{row.team}</TableCell>
                                    <TableCell>{row.department}</TableCell>
                                    <TableCell>{row.shiftstatus}</TableCell>
                                    {/* <TableCell>{row.startdate}</TableCell> */}
                                    <TableCell>{row.target}</TableCell>
                                    <TableCell>{row.weekstartend}</TableCell>
                                    <TableCell>{row.calstartend}</TableCell>
                                    {row.days && (
                                        row.days.map((column, index) => {
                                            return (
                                                <React.Fragment key={index}>
                                                    <TableCell>
                                                        <Grid>
                                                            <Typography variant="body2" sx={{ fontSize: '10px', fontWeight: 'bold' }}>
                                                                Week Target: {column.targetPoints}
                                                            </Typography>
                                                            <Button
                                                                size="small"
                                                                sx={{
                                                                    textTransform: 'capitalize',
                                                                    borderRadius: '4px',
                                                                    boxShadow: 'none',
                                                                    fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                                                    fontWeight: '400',
                                                                    fontSize: '0.575rem',
                                                                    lineHeight: '1.43',
                                                                    letterSpacing: '0.01071em',
                                                                    display: 'flex',
                                                                    padding: column.adjstatus === 'Not Achieved' ? '3px 10px' : '3px 8px',
                                                                    color: column.adjstatus === 'Not Achieved' ? '#892a23' : '#052106',
                                                                    backgroundColor: column.adjstatus === 'Verified' ? 'rgb(156 239 156)' : (column.adjstatus === 'Achieved' ? 'rgb(243 203 117)' : 'rgb(243 174 174)'),
                                                                    pointerEvents: (column.adjstatus === 'Not Achieved' || column.adjstatus === 'Verified') ? 'none' : 'auto',
                                                                    '&:hover': {
                                                                        color: column.adjstatus === 'Not Achieved' ? '#892a23' : '#052106',
                                                                        backgroundColor: column.adjstatus === 'Verified' ? 'rgb(156 239 156)' : (column.adjstatus === 'Achieved' ? 'rgb(243 203 117)' : 'rgb(243 174 174)'),
                                                                    },
                                                                }}
                                                            >
                                                                {column.adjstatus}
                                                            </Button>

                                                            <Typography variant="body2" sx={{ fontSize: '10px', fontWeight: 'bold' }}>
                                                                Week Achieved Point: {column.weekPoints.toFixed(2)}
                                                            </Typography>
                                                        </Grid>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Grid>
                                                            <Typography variant="body2" sx={{ fontSize: '10px', fontWeight: 'bold' }}>
                                                                Week Target: {column.targetPoints}
                                                            </Typography>
                                                            <Button
                                                                size="small"
                                                                sx={{
                                                                    textTransform: 'capitalize',
                                                                    borderRadius: '4px',
                                                                    boxShadow: 'none',
                                                                    fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                                                    fontWeight: '400',
                                                                    fontSize: '0.575rem',
                                                                    lineHeight: '1.43',
                                                                    letterSpacing: '0.01071em',
                                                                    display: 'flex',
                                                                    padding: column.tempadjstatus === 'Not Achieved' ? '3px 10px' : '3px 8px',
                                                                    color: column.tempadjstatus === 'Not Achieved' ? '#892a23' : '#052106',
                                                                    backgroundColor: column.tempadjstatus === 'Verified' ? 'rgb(156 239 156)' : (column.tempadjstatus === 'Achieved' ? 'rgb(243 203 117)' : 'rgb(243 174 174)'),
                                                                    pointerEvents: (column.tempadjstatus === 'Not Achieved' || column.tempadjstatus === 'Verified') ? 'none' : 'auto',
                                                                    '&:hover': {
                                                                        color: column.tempadjstatus === 'Not Achieved' ? '#892a23' : '#052106',
                                                                        backgroundColor: column.tempadjstatus === 'Verified' ? 'rgb(156 239 156)' : (column.tempadjstatus === 'Achieved' ? 'rgb(243 203 117)' : 'rgb(243 174 174)'),
                                                                    },
                                                                }}
                                                            >
                                                                {column.tempadjstatus}
                                                            </Button>

                                                            <Typography variant="body2" sx={{ fontSize: '10px', fontWeight: 'bold' }}>
                                                                Week Achieved Point: {column.tempWeekPoints.toFixed(2)}
                                                            </Typography>
                                                        </Grid>
                                                    </TableCell>
                                                </React.Fragment>
                                            );
                                        })
                                    )}
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={isFilterOpen} onClose={handleCloseFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
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
                            // fetchUsers()
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>
            {/*Export pdf Data  */}
            <Dialog open={isPdfFilterOpen} onClose={handleClosePdfFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
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
            </Dialog>

            {/* Edit Adjustment*/}
            <Dialog open={openEdit} onClose={handleClickOpenEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth={true}>
                <Box sx={userStyle.dialogbox}>
                    <>
                        <Typography sx={userStyle.HeaderText}> Status Update</Typography>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={5} xs={12} sm={12} >
                                <Typography sx={{ fontSize: '14px', }}>Status</Typography>
                                <FormControl fullWidth size="small">
                                    <Selects fullWidth
                                        size="small"
                                        options={adjtypeoptions}
                                        styles={colourStyles}
                                        value={{ label: statusEdit.weekoffpresentstatus, value: statusEdit.weekoffpresentstatus }}
                                        onChange={(e) => setStatusEdit({ ...statusEdit, weekoffpresentstatus: e.value })}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={2}>
                                <Button variant="contained" color="primary" onClick={sendRequest}> {" "} Ok{" "}  </Button>
                            </Grid>
                            <Grid item md={2}>
                                <Button variant="contained" sx={userStyle.btncancel} onClick={handleCloseEdit}> {" "} Cancel{" "} </Button>
                            </Grid>
                        </Grid>
                    </>
                </Box>
            </Dialog >

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
        </Box>
    );
}

export default UserShiftWeekOffPresent;
