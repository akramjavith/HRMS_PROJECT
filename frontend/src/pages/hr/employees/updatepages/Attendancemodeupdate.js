import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditIcon from '@mui/icons-material/Edit';
import ImageIcon from '@mui/icons-material/Image';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton, List, ListItem, ListItemText, MenuItem, OutlinedInput, Paper, Popover, Select, Table, TableBody, TableContainer, TableHead, TextField, Typography, Chip } from '@mui/material';
import Switch from '@mui/material/Switch';
import axios from '../../../../axiosInstance';
import * as FileSaver from 'file-saver';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment-timezone';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPlus, FaPrint } from 'react-icons/fa';
import { ThreeDots } from 'react-loader-spinner';
import { MultiSelect } from 'react-multi-select-component';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import Selects from 'react-select';
import { useReactToPrint } from 'react-to-print';
import * as XLSX from 'xlsx';
import { handleApiError } from '../../../../components/Errorhandling';
import Headtitle from '../../../../components/Headtitle';
import { menuItems } from '../../../../components/menuItemsList';
import PageHeading from '../../../../components/PageHeading';
import { StyledTableCell, StyledTableRow } from '../../../../components/Table';
import { AuthContext, UserRoleAccessContext } from '../../../../context/Appcontext';
import { colourStyles, userStyle } from '../../../../pageStyle';
import { SERVICE } from '../../../../services/Baseservice';
import { getCurrentServerTime } from '../../../../components/getCurrentServerTime';
import AggregatedSearchBar from '../../../../components/AggregatedSearchBar';
import AggridTable from '../../../../components/AggridTable';
import AlertDialog from '../../../../components/Alert';
import ExportData from '../../../../components/ExportData';
import MessageAlert from '../../../../components/MessageAlert';
import domtoimage from 'dom-to-image';

function Attendancemodeupdate() {
    const [serverTime, setServerTime] = useState(null);
  useEffect(() => {
    const fetchTime = async () => {
      const time = await getCurrentServerTime();
      setServerTime(time);
    };

    fetchTime();
  }, []);
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);

    const [overallItems, setOverallItems] = useState([]);

    let exportColumnNames = ['Emp Code', 'Employee Name', 'AttendanceMode', 'Company', 'Branch', 'Unit', 'Floor', 'Department', 'Team', 'Work Mode', 'Designation'];
    let exportRowValues = ['empcode', 'companyname', 'attendancemode', 'company', 'branch', 'unit', 'floor', 'department', 'team', 'workmode', 'designation'];

    const [isHandleChange, setIsHandleChange] = useState(false);
    const [searchedString, setSearchedString] = useState('');

    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState('');
    const [popupSeverityMalert, setPopupSeverityMalert] = useState('');
    const handleClickOpenPopupMalert = () => {
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

    const [employees, setEmployees] = useState([]);
    const { isUserRoleAccess, isUserRoleCompare, isAssignBranch, pageName, setPageName, allTeam, allUsersData, buttonStyles, allUsersLimit, isServerCurrentdatetime } = useContext(UserRoleAccessContext);

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
            pagename: String('Assigned Role Update'),
            commonid: String(isUserRoleAccess?._id),
            // date: String(isServerCurrentdatetime?.currentNewDate),
            date: String(new Date(serverTime)),

            addedby: [
                {
                    name: String(isUserRoleAccess?.username),
                    // date: String(isServerCurrentdatetime?.currentNewDate),
                      date: String(new Date(serverTime)),
                },
            ],
        });
    };

    // page refersh reload code
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

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const { auth } = useContext(AuthContext);
    const [empaddform, setEmpaddform] = useState({
        rolename: 'Please Select RoleName',
    });

    const attModeOptions = [
        { label: 'Domain', value: 'Domain' },
        { label: 'Hrms-Self', value: 'Hrms-Self' },
        { label: 'Hrms-Manual', value: 'Hrms-Manual' },
        { label: 'Biometric', value: 'Biometric' },
        { label: 'Production', value: 'Production' },
    ];

    const [isUser, setIsUser] = useState({ attname: '', fromdate: '', todate: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState('');

    const [attMode, setAttMode] = useState([]);

    // Copied fields Name
    const handleCopy = (message) => {
        NotificationManager.success(`${message} 👍`, '', 2000);
    };

    const handleClear = () => {
        setAttMode([]);
    };

    const gridRefTableImg = useRef(null);
    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage
                .toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, 'Assigned Role Update.png');
                })
                .catch((error) => {
                    console.error('dom-to-image error: ', error);
                });
        }
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    const [isBoarding, setIsBoarding] = useState(false);
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
        if (selectedRows.includes(params.row.id)) {
            return 'custom-id-row'; // This is the custom class for rows with item.tat === 'ago'
        }
        return ''; // Return an empty string for other rows
    };

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        empcode: true,
        companyname: true,
        company: true,
        attendancemode: true,
        branch: true,
        unit: true,
        floor: true,
        department: true,
        team: true,
        designation: true,
        role: true,
        actions: true,
        workmode: true,
        roles: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    const getCode = async (e) => {
        setPageName(!pageName);

        try {
            handleClickOpenEdit();
            let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            // console.log(res?.data?.suser?.attendancemode, 'res?.data?.suser?.attendancemode');
            setAttMode(res?.data?.suser?.attendancemode);
            setIsUser({ ...res?.data?.suser, attname: '', fromdate: '', todate: '' });
            handleClickOpenEdit();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    // Edit model
    const [isEditOpen, setIsEditOpen] = useState(false);
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === 'backdropClick') return;
        setIsEditOpen(false);
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

    const sendRequest = async () => {
        setPageName(!pageName);
        try {
            let resdep = await axios.post(SERVICE.DEPARTMENT_FOR_UPDATE_USERS_ATTENDANCEMODELOG, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                department: isUser.department,
            });
            console.log(resdep?.data?.departmentdetails?.[0]?.attendancemode)
            console.log(attMode, 'attmod')

            attMode.sort((a, b) => resdep?.data?.departmentdetails?.[0]?.attendancemode.indexOf(a) - resdep?.data?.departmentdetails?.[0]?.attendancemode.indexOf(b));

            console.log(attMode, 'changed');
            console.log(
                {
                    // attendancemode: [...attMode],
                    attendancemodelog: [
                        ...isUser.attendancemodelog,
                        {
                            fromdate: isUser.fromdate,
                            todate: isUser.todate,
                            // updateddatetime: String(isServerCurrentdatetime.currentNewDate),
                              updateddatetime: String(new Date(serverTime)),
                            updatedusername: String(isUserRoleAccess.companyname),
                            mode: [...attMode]
                        }
                    ],
                }
            )

            let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${isUser?._id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                // attendancemode: [...attMode],
                attendancemodelog: [
                    ...isUser.attendancemodelog,
                    {
                        fromdate: isUser.fromdate,
                        todate: isUser.todate,
                        // updateddatetime: String(isServerCurrentdatetime.currentNewDate),
                         updateddatetime: String(new Date(serverTime)),
                        updatedusername: String(isUserRoleAccess.companyname),
                        mode: [...attMode]
                    }
                ],
                updatedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        // date: String(isServerCurrentdatetime?.currentNewDate),
                         Date: String(new Date(serverTime)),
                    },
                ],
            });

            handleCloseModEdit();
            await fetchEmployee();

            setPopupContent('Updated Successfully');
            setPopupSeverity('success');
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const editSubmit = (e) => {
        e.preventDefault();
        const isDateMatch = isUser?.attendancemodelog?.some(item =>
            isUser.fromdate <= item.todate && isUser.todate >= item.fromdate
        );

        if (attMode?.length === 0) {
            setPopupContentMalert('Please Select Any One Of AttendanceMode!');
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
        } else if (isUser?.fromdate === '') {
            setPopupContentMalert('Please Select From Date!');
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
        } else if (isUser?.todate === '') {
            setPopupContentMalert('Please Select To Date!');
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
        } else if (isDateMatch) {
            setPopupContentMalert('Date Already Exists!');
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
        } else {
            sendRequest();
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

    const [fileFormat, setFormat] = useState('xl');
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = fileFormat === 'xl' ? '.xlsx' : '.csv';

    const exportToExcel = (excelData, fileName) => {
        setPageName(!pageName);
        try {
            const ws = XLSX.utils.json_to_sheet(excelData);
            const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

            // Check if the browser supports Blob and FileSaver
            if (!Blob || !FileSaver) {
                console.error('Blob or FileSaver not supported');
                return;
            }

            const data = new Blob([excelBuffer], { type: fileType });

            // Check if FileSaver.saveAs is available
            if (!FileSaver.saveAs) {
                console.error('FileSaver.saveAs is not available');
                return;
            }

            FileSaver.saveAs(data, fileName + fileExtension);
        } catch (error) {
            console.error('Error exporting to Excel', error);
        }
    };

    const formatData = (data) => {
        return data.map((item, index) => {
            return {
                Sno: index + 1,
                Empcode: item.empcode || '',
                'Employee Name': item.companyname || '',
                AttendanceMode: item.attendancemode || '',
                Company: item.company || '',
                Branch: item.branch || '',
                Unit: item.unit || '',
                Floor: item.floor || '',
                Department: item.department || '',
                Team: item.team || '',
                Designation: item.designation || '',
            };
        });
    };

    const handleExportXL = (isfilter) => {
        const dataToExport = isfilter === 'filtered' ? filteredData : employees;

        if (!dataToExport || dataToExport.length === 0) {
            console.error('No data available to export');
            return;
        }

        exportToExcel(formatData(dataToExport), 'AssignedRoleList');
        setIsFilterOpen(false);
    };
    //  PDF
    const columns = [
        { title: 'Emp Code', field: 'empcode' },
        { title: 'Employee Name', field: 'companyname' },
        { title: 'AttendanceMode', field: 'attendancemode' },
        { title: 'Company', field: 'company' },
        { title: 'Branch', field: 'branch' },
        { title: 'Unit', field: 'unit' },
        { title: 'Floor', field: 'floor' },
        { title: 'Department', field: 'department' },
        { title: 'Team', field: 'team' },
        { title: 'Designation', field: 'designation' },
    ];

    const downloadPdf = (isfilter) => {
        const doc = new jsPDF();

        // Initialize serial number counter
        // Modify columns to include serial number column
        const columnsWithSerial = [
            { title: 'S.No', dataKey: 'serialNumber' }, // Serial number column
            ...columns.map((col) => ({ title: col.title, dataKey: col.field })),
        ];

        // Modify row data to include serial number
        const dataWithSerial =
            isfilter === 'filtered'
                ? filteredData.map((t, index) => ({
                    ...t,
                    serialNumber: index + 1,
                    roles: checkUpdaterole(t.role),
                }))
                : employees?.map((item, index) => ({
                    ...item,
                    serialNumber: index + 1,
                    roles: checkUpdaterole(item.role),
                }));

        // Generate PDF
        doc.autoTable({
            theme: 'grid',
            columns: columnsWithSerial,
            body: dataWithSerial,
            styles: { fontSize: 5 },
        });

        doc.save('AssignedRoleList.pdf');
    };

    const checkUpdaterole = (roles) => {
        const finalrole = [...new Set(roles)];
        const result = finalrole.map((role, i) => `${i + 1}. ${role}`).join(', ');
        return result;
    };

    const handleChangeValue = (value) => {
        console.log(value, 'value');
        if (value == '' || value == undefined) {
            setPopupContentMalert('Please Select Any One Of AttendanceMode!');
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
        } else if (isUser.attname == 'Please Select ModeName' || isUser.attname == '') {
            setPopupContentMalert('Please Select Any One Of AttendanceMode!');
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
        } else {
            if (attMode.includes(value)) {
                setPopupContentMalert('AttendanceMode Already Exists!');
                setPopupSeverityMalert('info');
                handleClickOpenPopupMalert();
            } else {
                let result = [];
                result.push(value);
                setAttMode([...attMode, ...result]);
                setIsUser({ ...isUser, attname: 'Please Select ModeName', fromdate: '', todate: '' });
            }
        }
    };

    const rowDataRemove = (i) => {
        setAttMode(attMode.filter((value, item) => item !== i));
    };

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Assign Role Update',
        pageStyle: 'print',
    });

    //table entries ..,.
    const [items, setItems] = useState([]);

    const addSerialNumber = (datas) => {
        // console.log(datas,"datas")
        const itemsWithSerialNumber = datas?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
        }));
        setItems(itemsWithSerialNumber);
        setOverallItems(itemsWithSerialNumber);
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
    const searchTerms = searchQuery.toLowerCase().split(' ');
    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) => Object.values(item).join(' ').toLowerCase().includes(term));
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
            <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
        </div>
    );

    const columnDataTable = [
        {
            field: 'serialNumber',
            headerName: 'SNo',
            flex: 0,
            width: 90,
            hide: !columnVisibility.serialNumber,
            headerClassName: 'bold-header',
            pinned: 'left',
        },
        {
            field: 'empcode',
            headerName: 'Emp Code',
            flex: 0,
            width: 100,
            hide: !columnVisibility.empcode,
            headerClassName: 'bold-header',
            pinned: 'left',
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex' }}>
                    <ListItem
                        sx={{
                            '&:hover': {
                                cursor: 'pointer',
                                color: 'blue',
                                textDecoration: 'underline',
                            },
                        }}
                    >
                        <CopyToClipboard
                            onCopy={() => {
                                handleCopy('Copied Emp Code!');
                            }}
                            options={{ message: 'Copied Emp Code!' }}
                            text={params?.data?.empcode}
                        >
                            <ListItemText primary={params?.data?.empcode} />
                        </CopyToClipboard>
                    </ListItem>
                </Grid>
            ),
        },
        {
            field: 'companyname',
            headerName: 'Employee Name',
            flex: 0,
            width: 100,
            hide: !columnVisibility.companyname,
            headerClassName: 'bold-header',
            pinned: 'left',
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex' }}>
                    <ListItem
                        sx={{
                            '&:hover': {
                                cursor: 'pointer',
                                color: 'blue',
                                textDecoration: 'underline',
                            },
                        }}
                    >
                        <CopyToClipboard
                            onCopy={() => {
                                handleCopy('Copied Employee Name!');
                            }}
                            options={{ message: 'Copied Employee Name!' }}
                            text={params?.data?.companyname}
                        >
                            <ListItemText primary={params?.data?.companyname} />
                        </CopyToClipboard>
                    </ListItem>
                </Grid>
            ),
        },

        {
            field: 'attendancemode',
            headerName: 'AttendanceMode',
            flex: 0,
            width: 160,
            hide: !columnVisibility.attendancemode,
            headerClassName: 'bold-header',
        },

        {
            field: 'company',
            headerName: 'Company',
            flex: 0,
            width: 100,
            hide: !columnVisibility.company,
            headerClassName: 'bold-header',
        },

        {
            field: 'branch',
            headerName: 'Branch',
            flex: 0,
            width: 100,
            hide: !columnVisibility.branch,
            headerClassName: 'bold-header',
        },
        {
            field: 'unit',
            headerName: 'Unit',
            flex: 0,
            width: 100,
            hide: !columnVisibility.unit,
            headerClassName: 'bold-header',
        },
        {
            field: 'floor',
            headerName: 'Floor',
            flex: 0,
            width: 100,
            hide: !columnVisibility.floor,
            headerClassName: 'bold-header',
        },
        {
            field: 'department',
            headerName: 'Department',
            flex: 0,
            width: 100,
            hide: !columnVisibility.department,
            headerClassName: 'bold-header',
        },
        {
            field: 'team',
            headerName: 'Team',
            flex: 0,
            width: 100,
            hide: !columnVisibility.team,
            headerClassName: 'bold-header',
        },
        {
            field: 'workmode',
            headerName: 'Work Mode',
            flex: 0,
            width: 100,
            hide: !columnVisibility.workmode,
            headerClassName: 'bold-header',
        },
        {
            field: 'designation',
            headerName: 'Designation',
            flex: 0,
            width: 100,
            hide: !columnVisibility.designation,
            headerClassName: 'bold-header',
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
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex' }}>
                    {isUserRoleCompare?.includes('eattendancemodeupdate') && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getCode(params.data.id);
                            }}
                        >
                            <EditIcon style={{ fontsize: 'large' }} sx={buttonStyles.buttonedit} />
                        </Button>
                    )}
                </Grid>
            ),
        },
    ];

    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item?.serialNumber,
            empcode: item.empcode,
            companyname: item.companyname,
            attendancemode: item.attendancemode,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            workmode: item.workmode,
            floor: item.floor,
            department: item.department,
            team: item.team,
            designation: item.designation,
            role: item.role,
            roles: checkUpdaterole(item.role),
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
        <Box
            style={{
                padding: '10px',
                minWidth: '325px',
                '& .MuiDialogContent-root': { padding: '10px 0' },
            }}
        >
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
                            <ListItemText sx={{ display: 'flex' }} primary={<Switch sx={{ marginTop: '-5px' }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />} secondary={column.field === 'checkbox' ? 'Checkbox' : column.headerName} />
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
        setValueAttmodeCat([]);
        setSelectedOptionsEmployee([]);
        setSelectedOptionsAttmode([]);
        setValueEmp([]);
        setEmployees([]);
        setFilterState({
            type: 'Individual',
            employeestatus: 'Please Select Employee Status',
        });
        setPopupContent('Cleared Successfully');
        setPopupSeverity('success');
        handleClickOpenPopup();
        setSearchQuery('');
    };

    //MULTISELECT ONCHANGE START

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
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);
        setValueEmployeeCat([]);
        setValueAttmodeCat([]);
        setSelectedOptionsEmployee([]);
        setSelectedOptionsAttmode([]);
        setValueEmp([]);
    };

    const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
        return valueCompanyCat?.length ? valueCompanyCat.map(({ label }) => label)?.join(', ') : 'Please Select Company';
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
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);
        setValueEmployeeCat([]);
        setValueAttmodeCat([]);
        setSelectedOptionsEmployee([]);
        setSelectedOptionsAttmode([]);
        setValueEmp([]);
    };

    const customValueRendererBranch = (valueBranchCat, _categoryname) => {
        return valueBranchCat?.length ? valueBranchCat.map(({ label }) => label)?.join(', ') : 'Please Select Branch';
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
    };

    const customValueRendererUnit = (valueUnitCat, _categoryname) => {
        return valueUnitCat?.length ? valueUnitCat.map(({ label }) => label)?.join(', ') : 'Please Select Unit';
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
    };

    const customValueRendererTeam = (valueTeamCat, _categoryname) => {
        return valueTeamCat?.length ? valueTeamCat.map(({ label }) => label)?.join(', ') : 'Please Select Team';
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
            .map((name) => name.trim())
            .filter((name) => name !== '');

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
                (comp) => valueCompanyCat?.includes(comp.company) && valueBranchCat?.includes(comp.branch) && valueUnitCat?.includes(comp.unit) && valueTeamCat?.includes(comp.team)
                // &&
                // comp.workmode !== "Internship"
            )
            ?.map((data) => data.companyname.replace(/\s*\.\s*/g, '.').trim());

        const matchedValues = namesArray.filter((name) => availableOptions.includes(name.replace(/\s*\.\s*/g, '.').trim()));

        // Update selected options
        const newOptions = matchedValues.map((value) => ({
            label: value,
            value: value,
        }));

        setSelectedOptionsEmployee((prev) => {
            const newValues = newOptions.filter((newOpt) => !prev.some((prevOpt) => prevOpt.value === newOpt.value));
            return [...prev, ...newValues];
        });

        // Update other states...
        setValueEmp((prev) => [...new Set([...prev, ...matchedValues])]);
        setValueEmployeeCat((prev) => [...new Set([...prev, ...matchedValues])]);
    };

    // Handle clicks outside the Box
    useEffect(() => {
        const handleClickOutside = (e) => {
            const boxElement = document.getElementById('paste-box'); // Add an ID to the Box
            if (boxElement && !boxElement.contains(e.target)) {
                setIsBoxFocused(false); // Reset focus state if clicking outside the Box
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleDelete = (e, value) => {
        e.preventDefault();
        setSelectedOptionsEmployee((current) => current.filter((emp) => emp.value !== value));
        setValueEmp((current) => current.filter((empValue) => empValue !== value));
        setValueEmployeeCat((current) => current.filter((empValue) => empValue !== value));
    };

    //MULTISELECT ONCHANGE END

    const handleFilter = () => {
        if (filterState?.type === 'Please Select Type' || filterState?.type === '') {
            setPopupContentMalert('Please Select Type!');
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
        } else if (selectedOptionsCompany?.length === 0) {
            setPopupContentMalert('Please Select Company!');
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
        } else if (['Individual', 'Branch', 'Unit', 'Team']?.includes(filterState?.type) && selectedOptionsBranch?.length === 0) {
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
        } else if (selectedOptionsAttmode?.length === 0) {
            setPopupContentMalert('Please Select AttendanceMode!');
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
        } else if (filterState?.type === 'Department' && selectedOptionsDepartment?.length === 0) {
            setPopupContentMalert('Please Select Department!');
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
        } else {
            setSearchQuery('');
            fetchEmployee();
        }
    };
    const [allAssignCompany, setAllAssignCompany] = useState([]);
    const [allAssignBranch, setAllAssignBranch] = useState([]);
    const [allAssignUnit, setAllAssignUnit] = useState([]);
    const [filterState, setFilterState] = useState({
        type: 'Individual',
        employeestatus: 'Please Select Employee Status',
    });
    const TypeOptions = [
        { label: 'Individual', value: 'Individual' },
        { label: 'Department', value: 'Department' },
        { label: 'Company', value: 'Company' },
        { label: 'Branch', value: 'Branch' },
        { label: 'Unit', value: 'Unit' },
        { label: 'Team', value: 'Team' },
    ];
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
    useEffect(() => {
        fetchDepartments();
    }, []);

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

    //employee multiselect
    const [selectedOptionsAttmode, setSelectedOptionsAttmode] = useState([]);
    let [valueAttmodeCat, setValueAttmodeCat] = useState([]);

    const handleAttmodeChange = (options) => {
        setValueAttmodeCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsAttmode(options);
    };

    const customValueRendererAttmode = (valueAttmodeCat, _categoryname) => {
        return valueAttmodeCat?.length ? valueAttmodeCat.map(({ label }) => label)?.join(', ') : 'Please Select Employee';
    };

    //get all employees list details
    const fetchEmployee = async () => {
        setIsBoarding(true);
        setPageName(!pageName);
        const aggregationPipeline = [
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
                        //condition for attendancemode filter
                        ...(valueAttmodeCat.length > 0
                            ? [
                                {
                                    attendancemode: { $in: valueAttmodeCat },
                                },
                            ]
                            : []),
                    ],
                },
            },
            {
                $project: {
                    company: 1,
                    branch: 1,
                    unit: 1,
                    team: 1,
                    empcode: 1,
                    companyname: 1,
                    department: 1,
                    floor: 1,
                    designation: 1,
                    role: 1,
                    workmode: 1,
                    attendancemode: 1,
                },
            },
        ];
        try {
            let response = await axios.post(
                SERVICE.DYNAMICUSER_CONTROLLER,
                {
                    aggregationPipeline,
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            setEmployees(response.data.users);
            setIsBoarding(false);
        } catch (err) {
            setIsBoarding(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    //auto select all dropdowns
    const handleAutoSelect = async () => {
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
                    //    &&
                    // comp.workmode !== "Internship"
                )
                .map((u) => ({
                    label: u.companyname,
                    value: u.companyname,
                }));

            let employees = allUsersData
                ?.filter(
                    (u) => selectedCompany?.includes(u.company) && selectedBranch?.includes(u.branch) && selectedUnit?.includes(u.unit) && selectedTeam?.includes(u.team)
                    //   &&
                    // comp.workmode !== "Internship"
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

    return (
        <Box>
            <NotificationContainer />
            {/* ****** Header Content ****** */}
            <Headtitle title={'ATTENDANCEMODE UPDATE'} />
            <PageHeading title="Attendance Mode Update" modulename="Human Resources" submodulename="HR" mainpagename="Employee" subpagename="Employee Update Details" subsubpagename="Attendance Mode Update" />
            <br />
            {isUserRoleCompare?.includes('lattendancemodeupdate') && (
                <>
                    <Box sx={userStyle.selectcontainer}>
                        <Grid container spacing={2}>
                            <>
                                <Grid item xs={12}>
                                    <Typography sx={userStyle.importheadtext}>Filters</Typography>
                                </Grid>
                                <br />
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
                                {['Individual']?.includes(filterState.type) && (
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Employee<b style={{ color: 'red' }}>*</b>
                                            </Typography>
                                            <div onPaste={handlePasteForEmp} style={{ position: 'relative' }}>
                                                <MultiSelect
                                                    options={allUsersData
                                                        ?.filter(
                                                            (u) => valueCompanyCat?.includes(u.company) && valueBranchCat?.includes(u.branch) && valueUnitCat?.includes(u.unit) && valueTeamCat?.includes(u.team)
                                                            // &&
                                                            // u.workmode !== "Internship"
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
                                {['Individual']?.includes(filterState.type) && (
                                    <Grid item md={6} sm={12} xs={12} sx={{ display: 'flex', flexDirection: 'row' }}>
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
                                                    <Chip key={value} label={value} clickable sx={{ margin: 0.2, backgroundColor: '#FFF' }} onDelete={(e) => handleDelete(e, value)} onClick={() => console.log('clicked chip')} />
                                                ))}
                                            </div>
                                        </FormControl>
                                    </Grid>
                                )}
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Attendance Mode<b style={{ color: 'red' }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={attModeOptions}
                                            value={selectedOptionsAttmode}
                                            onChange={(e) => {
                                                handleAttmodeChange(e);
                                            }}
                                            valueRenderer={customValueRendererAttmode}
                                            labelledBy="Please Select AttendanceMode"
                                        />
                                    </FormControl>
                                </Grid>
                            </>
                        </Grid>
                        <br />
                        <br />
                        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Grid item lg={1} md={2} sm={2} xs={12}>
                                <Button variant="contained" onClick={handleFilter} sx={buttonStyles.buttonsubmit}>
                                    {' '}
                                    Filter{' '}
                                </Button>
                            </Grid>
                            <Grid item lg={1} md={2} sm={2} xs={12}>
                                <Button onClick={handleClearFilter} sx={buttonStyles.btncancel}>
                                    {' '}
                                    Clear{' '}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </>
            )}
            <br />
            {isUserRoleCompare?.includes('lattendancemodeupdate') && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Attendance Mode Details List</Typography>
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
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Box>
                                    {isUserRoleCompare?.includes('csvattendancemodeupdate') && (
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
                                    {isUserRoleCompare?.includes('excelattendancemodeupdate') && (
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
                                    {isUserRoleCompare?.includes('printattendancemodeupdate') && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes('pdfattendancemodeupdate') && (
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
                                    {isUserRoleCompare?.includes('imageattendancemodeupdate') && (
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
                                    maindatas={employees}
                                    setSearchedString={setSearchedString}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    paginated={false}
                                    totalDatas={overallItems}
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
                        <br />
                        <br />
                        {isBoarding ? (
                            <>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
                                    gridRefTable={gridRef}
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

            {/* Delete Modal */}

            <Box>
                {/* Edit DIALOG */}
                <Dialog open={isEditOpen} onClose={handleCloseModEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" sx={{ marginTop: '50px' }}>
                    <Box sx={userStyle.dialogbox}>
                        <Box sx={{ width: '800px', heigth: '300px' }}>
                            <>
                                <Grid container spacing={2}>
                                    <Grid item lg={12} md={12} xs={12} sm={12}>
                                        <Typography sx={userStyle.SubHeaderText}>Edit Attendance Mode Update</Typography>
                                    </Grid>
                                </Grid><br />
                                <Grid container spacing={2}>
                                    <Grid item md={4} sm={12} xs={12}>
                                        <Typography>
                                            Emp Code :<b>{isUser.empcode}</b>
                                        </Typography>
                                    </Grid>
                                    <Grid item md={8} sm={12} xs={12}>
                                        <Typography>
                                            Company Name : <b>{isUser.companyname}</b>
                                        </Typography>
                                    </Grid>
                                </Grid><br />
                                <Grid container spacing={2}>
                                    <Grid item md={3} xs={10} sm={10}>
                                        <FormControl size="small" fullWidth>
                                            <Typography>AttendnaceMode</Typography>
                                            <Selects
                                                options={attModeOptions}
                                                styles={colourStyles}
                                                value={{
                                                    label: isUser.attname,
                                                    value: isUser.attname,
                                                }}
                                                onChange={(e) => setIsUser({ ...isUser, attname: e.value })}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={1} sm={1} xs={1}>
                                        <Button
                                            variant="contained"
                                            style={{
                                                height: '30px',
                                                minWidth: '20px',
                                                padding: '19px 13px',
                                                color: 'white',
                                                marginTop: '22px',
                                                background: 'rgb(25, 118, 210)',
                                            }}
                                            onClick={() => {
                                                handleChangeValue(isUser.attname);
                                            }}
                                        >
                                            ADD
                                        </Button>
                                    </Grid>
                                    <Grid item md={3} sm={12} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>From Date<b style={{ color: "red" }}>*</b>{" "} </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="date"
                                                value={isUser.fromdate}
                                                onChange={(e) => {
                                                    const selectedDate = e.target.value;
                                                    // Ensure that the selected date is not in the future
                                                    const currentDate = new Date().toISOString().split("T")[0];
                                                    // if (selectedDate <= currentDate) {
                                                    setIsUser({ ...isUser, fromdate: selectedDate, todate: selectedDate });
                                                    // } else {
                                                    // Handle the case where the selected date is in the future (optional)
                                                    // You may choose to show a message or take other actions.
                                                    // }
                                                }}
                                            // Set the max attribute to the current date
                                            // inputProps={{ max: new Date().toISOString().split("T")[0] }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} sm={12} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>{" "} To Date<b style={{ color: "red" }}>*</b>{" "}</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="date"
                                                value={isUser.todate}
                                                onChange={(e) => {
                                                    const selectedDate = e.target.value;
                                                    // Ensure that the selected date is not in the future
                                                    const currentDate = new Date().toISOString().split("T")[0];
                                                    const fromdateval = isUser.fromdate != "" && new Date(isUser.fromdate).toISOString().split("T")[0];
                                                    if (isUser.fromdate == "") {
                                                        setPopupContentMalert("Please Select From Date");
                                                        setPopupSeverityMalert("warning");
                                                        handleClickOpenPopupMalert();
                                                    } else if (selectedDate < fromdateval) {
                                                        setIsUser({ ...isUser, todate: "" });
                                                        setPopupContentMalert("To Date should be after or equal to From Date");
                                                        setPopupSeverityMalert("warning");
                                                        handleClickOpenPopupMalert();
                                                    }
                                                    // else if (selectedDate <= currentDate) {
                                                    else {
                                                        setIsUser({ ...isUser, todate: selectedDate });
                                                    }
                                                    // } 
                                                    // else {
                                                    // }
                                                }}
                                            // Set the max attribute to the current date
                                            // inputProps={{ max: new Date().toISOString().split("T")[0], min: isUser.fromdate !== "" ? isUser.fromdate : null }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <Table>
                                            <TableHead>
                                                <StyledTableCell sx={{ padding: '5px 10px !important' }}>{'SNO'}.</StyledTableCell>
                                                <StyledTableCell sx={{ padding: '5px 10px !important' }}> {'RoleName'}</StyledTableCell>
                                                <StyledTableCell sx={{ padding: '5px 10px !important' }}> {'Action'}</StyledTableCell>
                                            </TableHead>
                                            <TableBody>
                                                {attMode.map((item, i) => (
                                                    <StyledTableRow>
                                                        <StyledTableCell sx={{ padding: '5px 10px !important' }}>{i + 1}.</StyledTableCell>
                                                        <StyledTableCell sx={{ padding: '5px 10px !important' }}> {item}</StyledTableCell>
                                                        <StyledTableCell sx={{ padding: '5px 10px !important' }}>
                                                            <Button
                                                                sx={{ color: 'red', fontSize: '20px' }}
                                                                onClick={(e) => {
                                                                    rowDataRemove(i);
                                                                }}
                                                            >
                                                                <DeleteOutlineOutlinedIcon sx={{ fontSize: '20px' }} />
                                                            </Button>
                                                        </StyledTableCell>
                                                    </StyledTableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </Grid>
                                </Grid><br />
                                <Grid container spacing={2}>
                                    <Grid item md={1}></Grid>
                                    <Button variant="contained" onClick={editSubmit} sx={buttonStyles.buttonsubmit}>
                                        Update
                                    </Button>
                                    <Grid item md={1}></Grid>
                                    <Button onClick={handleCloseModEdit} sx={buttonStyles.btncancel}>
                                        Cancel
                                    </Button>
                                </Grid>
                            </>
                        </Box>
                    </Box>
                </Dialog>
            </Box>

            <Box>
                <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleCloseerr}>
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            {/* print layout */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table aria-label="simple table" id="branch" ref={componentRef}>
                    <TableHead sx={{ fontWeight: '600' }}>
                        <StyledTableRow>
                            <StyledTableCell>SI.NO</StyledTableCell>
                            <StyledTableCell>Emp Code</StyledTableCell>
                            <StyledTableCell>Employee Name</StyledTableCell>
                            <StyledTableCell>AttendanceMode</StyledTableCell>
                            <StyledTableCell>Company</StyledTableCell>
                            <StyledTableCell>Branch</StyledTableCell>
                            <StyledTableCell>Unit</StyledTableCell>
                            <StyledTableCell>Floor </StyledTableCell>
                            <StyledTableCell>Department</StyledTableCell>
                            <StyledTableCell>Team</StyledTableCell>
                            <StyledTableCell>Designation</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {rowDataTable &&
                            rowDataTable.map((row, index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell>{index + 1}</StyledTableCell>
                                    <StyledTableCell>{row.empcode} </StyledTableCell>
                                    <StyledTableCell>{row.companyname} </StyledTableCell>
                                    <StyledTableCell>{row.attendancemode} </StyledTableCell>
                                    <StyledTableCell>{row.company} </StyledTableCell>
                                    <StyledTableCell>{row.branch} </StyledTableCell>
                                    <StyledTableCell>{row.unit} </StyledTableCell>
                                    <StyledTableCell> {row.floor}</StyledTableCell>
                                    <StyledTableCell>{row.department}</StyledTableCell>
                                    <StyledTableCell>{row.team}</StyledTableCell>
                                    <StyledTableCell>{row.designation}</StyledTableCell>
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
                filename={'Attendance Mode Update'}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />

            <MessageAlert openPopup={openPopupMalert} handleClosePopup={handleClosePopupMalert} popupContent={popupContentMalert} popupSeverity={popupSeverityMalert} />
            {/* SUCCESS */}
            <AlertDialog openPopup={openPopup} handleClosePopup={handleClosePopup} popupContent={popupContent} popupSeverity={popupSeverity} />
        </Box>
    );
}

export default Attendancemodeupdate;