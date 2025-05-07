import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import { Backdrop, Box, Button, FormControl, Chip, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, Grid, IconButton, List, ListItem, ListItemText, MenuItem, Popover, Select, TextField, Typography } from '@mui/material';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/system';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import Selects from 'react-select';
import { MultiSelect } from 'react-multi-select-component';
import 'jspdf-autotable';
import LoadingButton from '@mui/lab/LoadingButton';
import moment from 'moment-timezone';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from 'react-icons/fa';
import { ThreeDots } from 'react-loader-spinner';
import { useReactToPrint } from 'react-to-print';
import { handleApiError } from '../../../components/Errorhandling';
import Headtitle from '../../../components/Headtitle';
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import { colourStyles, userStyle } from '../../../pageStyle';
import { SERVICE } from '../../../services/Baseservice';
import EmployeeActionLoginStatus from './EmployeeActionLoginStatus';
import EmployeeLoginUnmatchedData from './EmployeeLoginUnmatchedData';

import domtoimage from 'dom-to-image';

import AlertDialog from '../../../components/Alert';
import { DeleteConfirmation } from '../../../components/DeleteConfirmation.js';
import ExportData from '../../../components/ExportData';
import MessageAlert from '../../../components/MessageAlert';
import PageHeading from '../../../components/PageHeading';
import AggregatedSearchBar from '../../../components/AggregatedSearchBar';
import AggridTable from '../../../components/AggridTable';

const EmployeeLoginStatus = () => {
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);

    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState('');
    const [popupSeverityMalert, setPopupSeverityMalert] = useState('');
    const handleClickOpenPopupMalert = () => {
        //    setSubmitLoader(false);
        setOpenPopupMalert(true);
    };
    const handleClosePopupMalert = () => {
        setOpenPopupMalert(false);
    };
    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState('');
    const [popupSeverity, setPopupSeverity] = useState('');
    const handleClickOpenPopup = () => {
        setOpenPopup(true);
    };
    const handleClosePopup = () => {
        setOpenPopup(false);
    };

    let exportColumnNames = [
        'Employee Code',
        'Company Name',
        'Login Name',
        'Company',
        'Branch',
        'Unit',
        'Team',
        'WorkMode',
        'Designation',
        'Department',
        'MacAddress',
        'LocalIP',
        'UserName',
        'System Name',
        'Matched',
        'Work Station',
        'Matched Status',
        'Version',
        'Last Login',
        'Date',
        'Workstationcount',
        'Systemcount',
        'Status',
    ];
    let exportRowValues = [
        'empcode',
        'companyname',
        'userloginname',
        'company',
        'branch',
        'unit',
        'team',
        'workmode',
        'designation',
        'department',
        'macaddress',
        'localip',
        'username',
        'hostname',
        'matched',
        'workstation',
        'matchedstatus',
        'version',
        'lastdate',
        'date',
        'count',
        'workstationcount',
        'status',
    ];

    const [filterState, setFilterState] = useState({
        type: 'Individual',
        employeestatus: 'Please Select Employee Status',
    });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    const [fileFormat, setFormat] = useState('');

    const { auth } = useContext(AuthContext);

    const [isLoading, setIsLoading] = useState(false);
    const [loginStatus, setLoginStatus] = useState([]);
    const [loginStatusOverall, setLoginStatusOverall] = useState([]);
    const [loginStatusUpdate, setLoginStatusUpdate] = useState([]);
    const [idLoginStatus, setIdLoginStatus] = useState({});
    const { isUserRoleCompare, isAssignBranch, allTeam, buttonStyles, isUserRoleAccess, pageName, setPageName, allUsersData, allUsersLimit } = useContext(UserRoleAccessContext);

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
            pagename: String('Employee Login Status'),
            commonid: String(isUserRoleAccess?._id),
            date: String(new Date()),

            addedby: [
                {
                    name: String(isUserRoleAccess?.username),
                    date: String(new Date()),
                },
            ],
        });
    };

    const accessbranch = isUserRoleAccess?.role?.includes('Manager')
        ? isAssignBranch?.map((data) => ({
            branch: data.branch,
            company: data.company,
            unit: data.unit,
        }))
        : isAssignBranch
            ?.filter((data) => {
                let fetfinalurl = [];
                if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
                    fetfinalurl = data.subsubpagenameurl;
                } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
                    fetfinalurl = data.subpagenameurl;
                } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
                    fetfinalurl = data.mainpagenameurl;
                } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
                    fetfinalurl = data.submodulenameurl;
                } else if (data?.modulenameurl?.length !== 0) {
                    fetfinalurl = data.modulenameurl;
                } else {
                    fetfinalurl = [];
                }

                const remove = [window.location.pathname?.substring(1), window.location.pathname];
                return fetfinalurl?.some((item) => remove?.includes(item));
            })
            ?.map((data) => ({
                branch: data.branch,
                company: data.company,
                unit: data.unit,
            }));
    const [isBranch, setIsBranch] = useState(false);

    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState('');
    const [copiedData, setCopiedData] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const TypeOptions = [
        { label: 'Individual', value: 'Individual' },
        { label: 'Department', value: 'Department' },
        { label: 'Company', value: 'Company' },
        { label: 'Branch', value: 'Branch' },
        { label: 'Unit', value: 'Unit' },
        { label: 'Team', value: 'Team' },
    ];

    //MULTISELECT ONCHANGE START
    let [valueTeamCat, setValueTeamCat] = useState([]);
    let [valueUnitCat, setValueUnitCat] = useState([]);
    let [valueBranchCat, setValueBranchCat] = useState([]);
    let [valueCompanyCat, setValueCompanyCat] = useState([]);

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
        return valueCompanyCat?.length ? valueCompanyCat.map(({ label }) => label)?.join(', ') : 'Please Select Company';
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
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
        setValueEmp([]);
    };

    const customValueRendererBranch = (valueBranchCat, _categoryname) => {
        return valueBranchCat?.length ? valueBranchCat.map(({ label }) => label)?.join(', ') : 'Please Select Branch';
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
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
        setValueEmp([]);
    };

    const customValueRendererUnit = (valueUnitCat, _categoryname) => {
        return valueUnitCat?.length ? valueUnitCat.map(({ label }) => label)?.join(', ') : 'Please Select Unit';
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
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
        setValueEmp([]);
    };

    const customValueRendererTeam = (valueTeamCat, _categoryname) => {
        return valueTeamCat?.length ? valueTeamCat.map(({ label }) => label)?.join(', ') : 'Please Select Team';
    };

    //department multiselect
    const [selectedOptionsDepartment, setSelectedOptionsDepartment] = useState([]);
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
        return valueDepartmentCat?.length ? valueDepartmentCat.map(({ label }) => label)?.join(', ') : 'Please Select Department';
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
        return valueEmployeeCat?.length ? valueEmployeeCat.map(({ label }) => label)?.join(', ') : 'Please Select Employee';
    };

    useEffect(() => {
        fetchDepartments();
    }, []);
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const fetchDepartments = async () => {
        //  setPageName(!pageName);
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

    const [valueEmp, setValueEmp] = React.useState([]); // State for employees
    const [isBoxFocused, setIsBoxFocused] = React.useState(false); // Track focus state


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

    const [filterLoader, setFilterLoader] = useState(false);
    const [tableLoader, setTableLoader] = useState(false);
    const handleFilter = () => {
        if (filterState?.type === 'Please Select Type' || filterState?.type === '') {
            setPopupContentMalert('Please Select Type!');
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
        } else if (selectedOptionsCompany?.length === 0) {
            setPopupContentMalert('Please Select Company!');
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
        }
        // else if (
        //   filterState?.employeestatus === "Please Select Employee Status" ||
        //   filterState?.employeestatus === ""
        // ) {
        //   setPopupContentMalert("Please Select Employee Status!");
        //   setPopupSeverityMalert("info");
        //   handleClickOpenPopupMalert();
        // }
        else if (['Individual', 'Branch', 'Unit', 'Team']?.includes(filterState?.type) && selectedOptionsBranch?.length === 0) {
            setPopupContentMalert('Please Select Branch!');
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
        } else if (['Individual', 'Unit', 'Team']?.includes(filterState?.type) && selectedOptionsUnit?.length === 0) {
            setPopupContentMalert('Please Select Unit!');
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
        } else if (['Individual', 'Team']?.includes(filterState?.type) && selectedOptionsTeam?.length === 0) {
            setPopupContentMalert('Please Select Team!');
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
        } else if (filterState?.type === 'Individual' && selectedOptionsEmployee?.length === 0) {
            setPopupContentMalert('Please Select Employee!');
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
        } else if (filterState?.type === 'Department' && selectedOptionsDepartment?.length === 0) {
            setPopupContentMalert('Please Select Department!');
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
        } else {
            fetchLoginStatus();
        }
    };

    //MULTISELECT ONCHANGE END
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
        setLoginStatus([]);
        setSelectedOptionsEmployee([]);
        setValueEmp([]);    // setEmployeeOptions([]);
        // setEmployeeSystemAllots([]);
        // setInternChecked(false);
        setFilterState({
            type: 'Individual',
            employeestatus: 'Please Select Employee Status',
        });

        setPopupContent('Cleared Successfully');
        setPopupSeverity('success');
        handleClickOpenPopup();
    };

    //auto select all dropdowns
    const [allAssignCompany, setAllAssignCompany] = useState([]);
    const [allAssignBranch, setAllAssignBranch] = useState([]);
    const [allAssignUnit, setAllAssignUnit] = useState([]);
    const handleAutoSelect = async () => {
        setPageName(!pageName);
        try {
            let selectedValues = accessbranch
                ?.map((data) => ({
                    company: data.company,
                    branch: data.branch,
                    unit: data.unit,
                }))
                .filter((value, index, self) => index === self.findIndex((t) => t.company === value.company && t.branch === value.branch && t.unit === value.unit));
            let selectedCompany = selectedValues
                ?.filter((value, index, self) => index === self.findIndex((t) => t.company === value.company))
                .map((a, index) => {
                    return a.company;
                });

            let mappedCompany = selectedValues
                ?.filter((value, index, self) => index === self.findIndex((t) => t.company === value.company))
                ?.map((data) => ({
                    label: data?.company,
                    value: data?.company,
                }));

            setValueCompanyCat(selectedCompany);
            setSelectedOptionsCompany(mappedCompany);

            let selectedBranch = selectedValues
                .filter((value, index, self) => index === self.findIndex((t) => t.company === value.company && t.branch === value.branch))
                .map((a, index) => {
                    return a.branch;
                });

            let mappedBranch = selectedValues
                .filter((value, index, self) => index === self.findIndex((t) => t.company === value.company && t.branch === value.branch))
                ?.map((data) => ({
                    label: data?.branch,
                    value: data?.branch,
                }));

            setValueBranchCat(selectedBranch);
            setSelectedOptionsBranch(mappedBranch);

            let selectedUnit = selectedValues
                .filter((value, index, self) => index === self.findIndex((t) => t.company === value.company && t.branch === value.branch && t.unit === value.unit))
                .map((a, index) => {
                    return a.unit;
                });

            let mappedUnit = selectedValues
                .filter((value, index, self) => index === self.findIndex((t) => t.company === value.company && t.branch === value.branch && t.unit === value.unit))
                ?.map((data) => ({
                    label: data?.unit,
                    value: data?.unit,
                }));

            setValueUnitCat(selectedUnit);
            setSelectedOptionsUnit(mappedUnit);

            let mappedTeam = allTeam
                ?.filter((u) => selectedCompany?.includes(u.company) && selectedBranch?.includes(u.branch) && selectedUnit?.includes(u.unit))
                .map((u) => ({
                    label: u.teamname,
                    value: u.teamname,
                }));

            let selectedTeam = allTeam?.filter((u) => selectedCompany?.includes(u.company) && selectedBranch?.includes(u.branch) && selectedUnit?.includes(u.unit)).map((u) => u.teamname);

            let mappedemployees = allUsersData
                ?.filter(
                    (u) => selectedCompany?.includes(u.company) && selectedBranch?.includes(u.branch) && selectedUnit?.includes(u.unit) && selectedTeam?.includes(u.team)
                    //  &&
                    //  u.workmode !== "Internship"
                )
                .map((u) => ({
                    label: u.companyname,
                    value: u.companyname,
                }));

            let employees = allUsersData
                ?.filter(
                    (u) => selectedCompany?.includes(u.company) && selectedBranch?.includes(u.branch) && selectedUnit?.includes(u.unit) && selectedTeam?.includes(u.team)
                    //  &&
                    //  u.workmode !== "Internship"
                )
                .map((u) => u.companyname);
            setValueTeamCat(selectedTeam);
            setSelectedOptionsTeam(mappedTeam);
            setAllAssignCompany(selectedCompany);

            setAllAssignBranch(selectedBranch);

            setAllAssignUnit(selectedUnit);

            setValueEmployeeCat(employees);
            setSelectedOptionsEmployee(mappedemployees);

            setValueEmp(mappedemployees?.map((item) => item?.value));
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    useEffect(() => {
        handleAutoSelect();
    }, [isAssignBranch]);

    const gridRefTableImg = useRef(null);
    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage
                .toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, 'EmployeeLoginStatus.png');
                })
                .catch((error) => {
                    console.error('dom-to-image error: ', error);
                });
        }
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
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

    //Delete model
    const [isDeleteOpen, setisDeleteOpen] = useState(false);
    const handleClickOpendel = () => {
        setisDeleteOpen(true);
    };
    const handleCloseDel = () => {
        setisDeleteOpen(false);
    };

    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

    const handleClickOpenalert = () => {
        if (selectedRows.length === 0) {
            setIsDeleteOpenalert(true);
        } else {
        }
    };
    const handleCloseModalert = () => {
        setIsDeleteOpenalert(false);
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
        setSearchQueryManage('');
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.orginalid)) {
            return 'custom-id-row'; // This is the custom class for rows with item.tat === 'ago'
        }
        return ''; // Return an empty string for other rows
    };

    const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
        '& .MuiDataGrid-virtualScroller': {
            overflowY: 'hidden',
        },
        '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: ' bold !important ',
        },
        '& .custom-id-row': {
            backgroundColor: '#1976d22b !important',
        },

        '& .MuiDataGrid-row.Mui-selected': {
            '& .custom-ago-row, & .custom-in-row, & .custom-others-row': {
                backgroundColor: 'unset !important', // Clear the background color for selected rows
            },
        },
        '&:hover': {
            '& .custom-ago-row:hover': {
                backgroundColor: '#ff00004a !important',
            },
            '& .custom-in-row:hover': {
                backgroundColor: '#ffff0061 !important',
            },
            '& .custom-others-row:hover': {
                backgroundColor: '#0080005e !important',
            },
        },
    }));

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        workmode: true,
        username: true,
        empcode: true,
        companyname: true,
        userloginname: true,
        macaddress: true,
        lastdate: true,
        matched: true,
        matchedstatus: true,
        workstation: true,
        localip: true,
        date: true,
        hostname: true,
        department: true,
        designation: true,
        status: true,
        count: true,
        version: true,
        workstationcount: true,
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    // get all loginStatus
    const fetchLoginStatus = async () => {
        setFilterLoader(true);
        setPageName(!pageName);
        setIsBranch(true);
        const queryParams = {
            assignbranch: accessbranch,
            aggregationPipeline: [
                {
                    $match: {
                        $and: [
                            // Enquiry status filter
                            {
                                enquirystatus: {
                                    $nin: ['Enquiry Purpose'],
                                },
                            },
                            // Reasonable status filter
                            {
                                resonablestatus: {
                                    $nin: ['Not Joined', 'Postponed', 'Rejected', 'Closed', 'Releave Employee', 'Absconded', 'Hold', 'Terminate'],
                                },
                            },
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
                                        companyname: { $in: valueEmployeeCat },
                                    },
                                ]
                                : []),
                        ],
                    },
                },
            ],
        };
        console.log(queryParams, 'queryParams');
        try {
            let res_branch = await axios.post(SERVICE.USER_LOGIN_STATUS_FILTER, queryParams, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const transformData = (data) => {
                const transformedArray = [];
                data?.forEach((item) => {
                    const getwithoutmacstatus = item.loginUserStatus.filter((status, index) => status.macaddress != 'none');
                    const getSecondaryworkStationLength = item.loginUserStatus.filter((status) => status?.matched === 'Secondary WorkStation');
                    let seconCount = 2;
                    if (item.loginUserStatus && getwithoutmacstatus.length > 0 && (item.employeecount !== '0' || item.wfhcount !== '0')) {
                        const matchedWorkStations = new Set(); // Track matched workstations
                        getwithoutmacstatus.forEach((status, i) => {
                            if (status?.matchedstatus === 'Matched') {
                                const newItem = {
                                    _id: item?._id,
                                    branch: item.branch,
                                    companyname: item.companyname,
                                    empcode: item.empcode,
                                    designation: item.designation,
                                    company: item.company,
                                    username: item?.username,
                                    unit: item.unit,
                                    team: item.team,
                                    workmode: item.workmode,
                                    department: item.department,
                                    loginUserStatus: status,
                                    matched: status?.matched,
                                    matchedstatus: status?.matchedstatus,
                                    workstation: status?.workstation,
                                    workstationcount: Number(i + 1),
                                    count: status?.matched === 'Primary WorkStation' ? 1 : status?.matched === 'Work From Home' ? (getSecondaryworkStationLength?.length > 0 ? getSecondaryworkStationLength?.length + 2 : 3) : status?.matched === 'Secondary WorkStation' ? seconCount++ : status.count,
                                    version: status.version,
                                    date: status.createdAt ? moment(status.createdAt).format('DD-MM-YYYY hh:mm:ss a') : '',
                                };
                                transformedArray.push(newItem);
                            }
                        });
                        seconCount = 2;
                    }
                });
                return transformedArray;
            };

            console.log(res_branch?.data?.users, "res_branch?.data?.users")

            const transformedData = transformData(res_branch?.data?.users);

            const itemsWithSerialNumber = transformedData?.map((item, index) => ({
                ...item,
                serialNumber: index + 1,

                id: index + 1,
                orginalid: item._id,
                empcode: item.empcode,
                companyname: item.companyname,
                company: item.company,
                branch: item.branch,
                unit: item.unit,
                team: item.team,
                workmode: item.workmode,
                userloginname: item?.username,
                designation: item.designation,
                department: item.department,
                matched: item.matched,
                matchedstatus: item.matchedstatus,
                workstation: item.workstation,
                macaddress: item?.loginUserStatus?.macaddress,
                localip: item?.loginUserStatus?.localip,
                // status: item?.loginUserStatus?.status,
                status: item?.loginUserStatus?.username ? 'Active' : 'InActive',
                username: item?.loginUserStatus?.username,
                hostname: item?.loginUserStatus?.hostname,
                Version: item?.loginUserStatus?.version,
                lastdate: item?.loginUserStatus?.date ? moment(item?.loginUserStatus?.date).format('DD-MM-YYYY hh:mm:ss a') : '',
                count: item?.count,
                workstationcount: item?.workstationcount,
                addressid: item?.loginUserStatus?._id,
                date: item?.loginUserStatus?.createdAt ? moment(item?.loginUserStatus?.createdAt).format('DD-MM-YYYY hh:mm:ss a') : '',
            }));
            setFilterLoader(false);
            console.log(res_branch?.data?.users, 'checked');
            setLoginStatus(itemsWithSerialNumber);
            console.log(itemsWithSerialNumber, "itemsWithSerialNumber");
            setLoginStatusOverall(itemsWithSerialNumber);
            setIsBranch(false);
        } catch (err) {
            setIsBranch(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    // Excel
    const fileName = 'EmployeeLoginStatus';
    let excelno = 1;

    const getCode = async (e, name) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setIdLoginStatus(res.data?.suser);
            if (res.data?.suser?.loginUserStatus?.length > 0) {
                const ans = res.data?.suser?.loginUserStatus?.filter((data) => data._id !== name?.addressid);
                setLoginStatusUpdate(ans);
                handleClickOpendel();
            } else {
                console.log('No Reset');
            }
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    // Alert delete popup
    let branchid = idLoginStatus?._id;
    const delBranch = async () => {
        setPageName(!pageName);
        try {
            let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${branchid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                loginUserStatus: loginStatusUpdate,
            });
            handleCloseDel();
            // await fetchLoginStatus();
            setPage(1);
            setSelectedRows([]);
            setPage(1);

            setPopupContent('Successfully Resetted');
            setPopupSeverity('success');
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    // useEffect(() => {
    //     fetchLoginStatus();
    // }, []);

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'EmployeeLoginStatus',
        pageStyle: 'print',
    });

    const [items, setItems] = useState([]);

    const addSerialNumber = (datas) => {
        setItems(datas);
    };

    useEffect(() => {
        addSerialNumber(loginStatus);
    }, [loginStatus]);

    const [searchedString, setSearchedString] = useState('');
    const [isHandleChange, setIsHandleChange] = useState(false);
    const gridRefTable = useRef(null);

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
    const searchTerms = searchQuery.toLowerCase().split(' ');
    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) => Object.values(item).join(' ').toLowerCase().includes(term));
    });

    const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);

    const totalPages = Math.ceil(filteredDatas?.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

    const pageNumbers = [];

    const indexOfLastItem = page * pageSize;

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
            field: 'serialNumber',
            headerName: 'SNo',
            flex: 0,
            width: 80,
            hide: !columnVisibility.serialNumber,
            headerClassName: 'bold-header',
            pinned: 'left',
        },
        { field: 'empcode', headerName: 'Employee Code', pinned: 'left', flex: 0, width: 160, hide: !columnVisibility.empcode, headerClassName: 'bold-header' },
        { field: 'companyname', headerName: 'Employee Name', pinned: 'left', flex: 0, width: 180, hide: !columnVisibility.companyname, headerClassName: 'bold-header' },
        { field: 'userloginname', headerName: 'Login Name', flex: 0, width: 130, hide: !columnVisibility.userloginname, headerClassName: 'bold-header' },
        { field: 'company', headerName: 'Company', flex: 0, width: 100, hide: !columnVisibility.company, headerClassName: 'bold-header' },
        { field: 'branch', headerName: 'Branch', flex: 0, width: 150, hide: !columnVisibility.branch, headerClassName: 'bold-header' },
        { field: 'unit', headerName: 'Unit', flex: 0, width: 120, hide: !columnVisibility.unit, headerClassName: 'bold-header' },
        { field: 'team', headerName: 'Team', flex: 0, width: 120, hide: !columnVisibility.team, headerClassName: 'bold-header' },
        { field: 'workmode', headerName: 'WorkMode', flex: 0, width: 120, hide: !columnVisibility.workmode, headerClassName: 'bold-header' },
        { field: 'designation', headerName: 'Designation', flex: 0, width: 150, hide: !columnVisibility.designation, headerClassName: 'bold-header' },
        { field: 'department', headerName: 'Department', flex: 0, width: 130, hide: !columnVisibility.department, headerClassName: 'bold-header' },
        { field: 'macaddress', headerName: 'Mac Address', flex: 0, width: 175, hide: !columnVisibility.macaddress, headerClassName: 'bold-header' },
        { field: 'localip', headerName: 'Local Ip', flex: 0, width: 175, hide: !columnVisibility.localip, headerClassName: 'bold-header' },
        { field: 'username', headerName: 'UserName', flex: 0, width: 150, hide: !columnVisibility.username, headerClassName: 'bold-header' },
        { field: 'hostname', headerName: 'SystemName', flex: 0, width: 150, hide: !columnVisibility.hostname, headerClassName: 'bold-header' },
        {
            field: 'matched',
            headerName: 'Matched',
            flex: 0,
            width: 200,
            hide: !columnVisibility.matched,
            headerClassName: 'bold-header',
            cellStyle: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            },
            cellRenderer: (params) => {
                const colorName = params.data.matched === 'Primary WorkStation' ? 'Blue' : params.data.status === 'Secondary WorkStation' ? 'Green' : params.data.status === 'Work From Home' ? 'Red' : 'Orange';
                return <Typography sx={{ color: colorName }}>{params.data.matched}</Typography>;
            },
        },
        { field: 'workstation', headerName: 'Work Station', flex: 0, width: 200, hide: !columnVisibility.workstation, headerClassName: 'bold-header' },
        { field: 'matchedstatus', headerName: 'Matched Status', flex: 0, width: 200, hide: !columnVisibility.matchedstatus, headerClassName: 'bold-header' },
        { field: 'version', headerName: 'Version', flex: 0, width: 200, hide: !columnVisibility.version, headerClassName: 'bold-header' },
        { field: 'lastdate', headerName: 'Last Login', flex: 0, width: 200, hide: !columnVisibility.lastdate, headerClassName: 'bold-header' },
        { field: 'date', headerName: 'Date', flex: 0, width: 200, hide: !columnVisibility.date, headerClassName: 'bold-header' },
        { field: 'count', headerName: 'Workstationcount', flex: 0, width: 100, hide: !columnVisibility.count, headerClassName: 'bold-header' },
        { field: 'workstationcount', headerName: 'Systemcount', flex: 0, width: 100, hide: !columnVisibility.workstationcount, headerClassName: 'bold-header' },
        {
            field: 'status',
            headerName: 'Status',
            flex: 0,
            width: 100,
            hide: !columnVisibility.status,
            headerClassName: 'bold-header',
            cellStyle: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            },
            cellRenderer: (params) => {
                return (
                    <Grid>
                        <Button
                            size="small"
                            sx={{
                                textTransform: 'capitalize',
                                borderRadius: '4px',
                                boxShadow: 'none',
                                fontWeight: '500',
                                display: 'flex',
                                color: 'white',
                                backgroundColor: params.data.status === 'Active' ? 'green' : 'red',
                                '&:hover': {
                                    backgroundColor: params.data.status === 'Active' ? 'green' : 'red',
                                },
                            }}
                        >
                            {params.data.status}
                        </Button>
                    </Grid>
                );
            },
        },

        {
            field: 'actions',
            headerName: 'Action',
            flex: 0,
            width: 250,
            minHeight: '40px !important',
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: 'bold-header',
            cellStyle: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            },
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex' }}>
                    {isUserRoleCompare?.includes('eemployeeloginstatus') && (
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={() => {
                                getCode(params.data.orginalid, params.data);
                            }}
                        >
                            Reset
                        </Button>
                    )}
                </Grid>
            ),
        },
    ];

    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item.id,
            orginalid: item.orginalid,
            serialNumber: item.serialNumber,
            empcode: item.empcode,
            companyname: item.companyname,
            userloginname: item.userloginname,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            workmode: item.workmode,
            username: item.username,
            designation: item.designation,
            department: item.department,
            lastdate: item.lastdate,
            macaddress: item.macaddress,
            localip: item.localip,
            hostname: item.hostname,
            version: item.version,
            status: item?.status,
            count: item.count,
            addressid: item.addressid,
            date: item.date,
            workstation: item.workstation,
            workstationcount: item.workstationcount,
            matched: item.matched,
            matchedstatus: item.matchedstatus,
        };
    });

    const rowsWithCheckboxes = rowDataTable.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRows.includes(row.orginalid),
    }));

    // Show All Columns functionality

    const handleShowAllColumns = () => {
        setColumnVisibility(initialColumnVisibility);
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
        <Box style={{ padding: '10px', minWidth: '325px', '& .MuiDialogContent-root': { padding: '10px 0' } }}>
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
                <TextField label="Find column" variant="standard" fullWidth value={searchQueryManage} onChange={(e) => setSearchQueryManage(e.target.value)} sx={{ marginBottom: 5, position: 'absolute' }} />
            </Box>
            <br />
            <br />
            <DialogContent sx={{ minWidth: 'auto', height: '200px', position: 'relative' }}>
                <List sx={{ overflow: 'auto', height: '100%' }}>
                    {filteredColumns.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText
                                sx={{ display: 'flex' }}
                                primary={<Switch sx={{ marginTop: '-5px' }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />}
                                secondary={column.field === 'checkbox' ? 'Checkbox' : column.headerName}
                            // secondary={column.headerName }
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item md={4}>
                        <Button variant="text" sx={{ textTransform: 'none' }} onClick={() => setColumnVisibility(initialColumnVisibility)}>
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

    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };

    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener('beforeunload', beforeUnloadHandler);
        return () => {
            window.removeEventListener('beforeunload', beforeUnloadHandler);
        };
    }, []);

    return (
        <>
            <Headtitle title={'EMPLOYEE LOGIN STATUS'} />
            <PageHeading title="Employee Login Status" modulename="Human Resources" submodulename="HR" mainpagename="Employee" subpagename="Employee Status Details" subsubpagename="Employee Login Status" />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes('lemployeeloginstatus') && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Employee Login Status List </Typography>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Type<b style={{ color: 'red' }}>*</b>
                                    </Typography>
                                    <Selects
                                        options={TypeOptions}
                                        styles={colourStyles}
                                        value={{
                                            label: filterState.type ?? 'Please Select Type',
                                            value: filterState.type ?? 'Please Select Type',
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
                                            setValueEmp([]);
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <Typography>
                                    Company<b style={{ color: 'red' }}>*</b>
                                </Typography>
                                <FormControl size="small" fullWidth>
                                    <MultiSelect
                                        options={accessbranch
                                            ?.map((data) => ({
                                                label: data.company,
                                                value: data.company,
                                            }))
                                            .filter((item, index, self) => {
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

                            {['Individual', 'Team']?.includes(filterState.type) ? (
                                <>
                                    {/* Branch Unit Team */}
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                {' '}
                                                Branch <b style={{ color: 'red' }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                options={accessbranch
                                                    ?.filter((comp) => valueCompanyCat?.includes(comp.company))
                                                    ?.map((data) => ({
                                                        label: data.branch,
                                                        value: data.branch,
                                                    }))
                                                    .filter((item, index, self) => {
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
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                {' '}
                                                Unit<b style={{ color: 'red' }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                options={accessbranch
                                                    ?.filter((comp) => valueCompanyCat?.includes(comp.company) && valueBranchCat?.includes(comp.branch))
                                                    ?.map((data) => ({
                                                        label: data.unit,
                                                        value: data.unit,
                                                    }))
                                                    .filter((item, index, self) => {
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
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Team<b style={{ color: 'red' }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                options={allTeam
                                                    ?.filter((u) => valueCompanyCat?.includes(u.company) && valueBranchCat?.includes(u.branch) && valueUnitCat?.includes(u.unit))
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
                            ) : ['Department']?.includes(filterState.type) ? (
                                <>
                                    {/* Department */}
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Department<b style={{ color: 'red' }}>*</b>
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
                            ) : ['Branch']?.includes(filterState.type) ? (
                                <>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                {' '}
                                                Branch <b style={{ color: 'red' }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                options={accessbranch
                                                    ?.filter((comp) => valueCompanyCat?.includes(comp.company))
                                                    ?.map((data) => ({
                                                        label: data.branch,
                                                        value: data.branch,
                                                    }))
                                                    .filter((item, index, self) => {
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
                                </>
                            ) : ['Unit']?.includes(filterState.type) ? (
                                <>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                {' '}
                                                Branch<b style={{ color: 'red' }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                options={accessbranch
                                                    ?.filter((comp) => valueCompanyCat?.includes(comp.company))
                                                    ?.map((data) => ({
                                                        label: data.branch,
                                                        value: data.branch,
                                                    }))
                                                    .filter((item, index, self) => {
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
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                {' '}
                                                Unit <b style={{ color: 'red' }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                options={accessbranch
                                                    ?.filter((comp) => valueCompanyCat?.includes(comp.company) && valueBranchCat?.includes(comp.branch))
                                                    ?.map((data) => ({
                                                        label: data.unit,
                                                        value: data.unit,
                                                    }))
                                                    .filter((item, index, self) => {
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
                                </>
                            ) : (
                                ''
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

                            <Grid item md={3} xs={12} sm={6} mt={3}>
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    <LoadingButton variant="contained" color="primary" onClick={handleFilter} loading={filterLoader} sx={buttonStyles.buttonsubmit}>
                                        Filter
                                    </LoadingButton>

                                    <Button sx={buttonStyles.btncancel} onClick={handleClearFilter}>
                                        Clear
                                    </Button>
                                </div>
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
                                        sx={{ width: '77px' }}
                                    >
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        <MenuItem value={loginStatus?.length}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Box>
                                    {isUserRoleCompare?.includes('excelemployeeloginstatus') && (
                                        <>
                                            <Button
                                                onClick={(e) => {
                                                    setIsFilterOpen(true);
                                                    setFormat('xl');
                                                }}
                                                sx={userStyle.buttongrp}
                                            >
                                                <FaFileExcel />
                                                &ensp;Export to Excel&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes('csvemployeeloginstatus') && (
                                        <>
                                            <Button
                                                onClick={(e) => {
                                                    setIsFilterOpen(true);
                                                    setFormat('csv');
                                                }}
                                                sx={userStyle.buttongrp}
                                            >
                                                <FaFileCsv />
                                                &ensp;Export to CSV&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes('printemployeeloginstatus') && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes('pdfemployeeloginstatus') && (
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
                                    {isUserRoleCompare?.includes('imageemployeeloginstatus') && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                            {' '}
                                            <ImageIcon sx={{ fontSize: '15px' }} /> &ensp;Image&ensp;{' '}
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
                                    maindatas={loginStatus}
                                    setSearchedString={setSearchedString}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    paginated={false}
                                    totalDatas={loginStatusOverall}
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
                        {/* {isUserRoleCompare?.includes("bdbranch") && (
                            <Button variant="contained" color="error" onClick={handleClickOpenalert}>
                                Bulk Delete
                            </Button>
                        )} */}
                        <br />
                        <br />
                        {isBranch ? (
                            <>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    {/* <CircularProgress color="inherit" />  */}
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
                                    // totalDatas={totalProjects}
                                    searchQuery={searchQuery}
                                    handleShowAllColumns={handleShowAllColumns}
                                    setFilteredRowData={setFilteredRowData}
                                    filteredRowData={filteredRowData}
                                    setFilteredChanges={setFilteredChanges}
                                    filteredChanges={filteredChanges}
                                    gridRefTableImg={gridRefTableImg}
                                    itemsList={loginStatusOverall}
                                />
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
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                {manageColumnsContent}
            </Popover>
            <br />
            <br />
            <EmployeeLoginUnmatchedData />
            <br />
            <br />
            <EmployeeActionLoginStatus />
            {/* ****** Table End ****** */}

            {/* ALERT DIALOG */}
            <Box>
                <Dialog open={isErrorOpenpop} onClose={handleCloseerrpop} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <Typography variant="h6">{showAlertpop}</Typography>
                    </DialogContent>
                    <DialogActions>
                        {isLoading ? (
                            <>
                                <Backdrop sx={{ color: 'blue', zIndex: (theme) => theme.zIndex.drawer + 2 }} open={isLoading}>
                                    <CircularProgress color="inherit" />
                                </Backdrop>
                            </>
                        ) : (
                            <>
                                <Grid>
                                    <Button
                                        variant="contained"
                                        sx={buttonStyles.buttonsubmit}
                                        onClick={() => {
                                            handleCloseerrpop();
                                        }}
                                    >
                                        ok
                                    </Button>
                                </Grid>
                            </>
                        )}
                        <Button sx={buttonStyles.btncancel} onClick={handleCloseerrpop}>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            {/* EXTERNAL COMPONENTS -------------- START */}
            {/* VALIDATION */}
            <MessageAlert openPopup={openPopupMalert} handleClosePopup={handleClosePopupMalert} popupContent={popupContentMalert} popupSeverity={popupSeverityMalert} />
            {/* SUCCESS */}
            <AlertDialog openPopup={openPopup} handleClosePopup={handleClosePopup} popupContent={popupContent} popupSeverity={popupSeverity} />
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
                itemsTwo={loginStatusOverall ?? []}
                filename={fileName}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />

            {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation open={isDeleteOpen} onClose={handleCloseDel} onConfirm={delBranch} title="Are you sure? Do you want to Reset?" confirmButtonText="Yes" cancelButtonText="Cancel" />

            {/* EXTERNAL COMPONENTS -------------- END */}
        </>
    );
};

export default EmployeeLoginStatus;
