import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import ImageIcon from '@mui/icons-material/Image';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box, Button, Checkbox, Chip, Dialog, DialogActions, DialogContent, FormControl, FormGroup, Grid, IconButton, List, ListItem, ListItemText, MenuItem, OutlinedInput, Paper, Popover, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import Switch from '@mui/material/Switch';
import axios from 'axios';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment-timezone';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { FaFilePdf, FaPlus, FaPrint } from 'react-icons/fa';
import { ThreeDots } from 'react-loader-spinner';
import Selects from 'react-select';
import { useReactToPrint } from 'react-to-print';
import { handleApiError } from '../../../../components/Errorhandling';
import { StyledTableCell, StyledTableRow } from '../../../../components/Table';
import { AuthContext, UserRoleAccessContext } from '../../../../context/Appcontext';
import { colourStyles, userStyle } from '../../../../pageStyle';
import { SERVICE } from '../../../../services/Baseservice';

import domtoimage from 'dom-to-image';
import * as FileSaver from 'file-saver';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaFileCsv, FaFileExcel } from 'react-icons/fa';
import { MultiSelect } from 'react-multi-select-component';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import * as XLSX from 'xlsx';
import AggregatedSearchBar from '../../../../components/AggregatedSearchBar';
import AggridTable from '../../../../components/AggridTable';
import AlertDialog from '../../../../components/Alert';
import ExportData from '../../../../components/ExportData';
import Headtitle from '../../../../components/Headtitle';
import MessageAlert from '../../../../components/MessageAlert';
import PageHeading from '../../../../components/PageHeading';
function Educatioupdate() {
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);

  const [overallItems, setOverallItems] = useState([]);
  let exportColumnNames = ['EmpCode', 'Employee Name', 'Company', 'Branch', 'Unit', 'Team', 'Username', 'Work Mode'];
  let exportRowValues = ['empcode', 'companyname', 'company', 'branch', 'unit', 'team', 'username', 'workmode'];

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
  const [qualification, setQualification] = useState('');
  const [passedyear, setPassedyear] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [eduTodo, setEduTodo] = useState([]);
  const [qualiDetails, setQualiDetails] = useState([]);
  const [institution, setInstitution] = useState('');
  const [getemployees, setEmployees] = useState([]);
  const [AddiDetails, setAddiDetails] = useState({});
  const [getrowid, setRowGetid] = useState('');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [employee, setEmployee] = useState({
    categoryedu: 'Please Select Category',
    subcategoryedu: 'Please Select Sub Category',
    specialization: 'Please Select Specialization',
  });

  const [switchValues, setSwicthValues] = useState({
    educationInstitution: false,
    additionalInstitution: false,
    workDesignation: false,
    workDuties: false,
    workReason: false,
  })
  useEffect(() => {
    fetchMasterFieldValues();
  }, [])
  const [masterFieldValues, setMasterFieldValues] = useState();
  const fetchMasterFieldValues = async () => {
    try {
      const aggregationPipeline = [
        {
          $project: {
            eduInstitutions: {
              $filter: {
                input: {
                  $map: {
                    input: { $ifNull: ["$eduTodo", []] },
                    as: "edu",
                    in: "$$edu.institution",
                  },
                },
                as: "item",
                cond: {
                  $and: [
                    { $ne: ["$$item", null] },
                    { $ne: ["$$item", ""] }
                  ],
                },
              },
            },
            addInstitutions: {
              $filter: {
                input: {
                  $map: {
                    input: { $ifNull: ["$addAddQuaTodo", []] },
                    as: "add",
                    in: "$$add.addInst",
                  },
                },
                as: "item",
                cond: {
                  $and: [
                    { $ne: ["$$item", null] },
                    { $ne: ["$$item", ""] }
                  ],
                },
              },
            },
            empNames: {
              $filter: {
                input: {
                  $map: {
                    input: { $ifNull: ["$workhistTodo", []] },
                    as: "w",
                    in: "$$w.empNameTodo",
                  },
                },
                as: "item",
                cond: {
                  $and: [
                    { $ne: ["$$item", null] },
                    { $ne: ["$$item", ""] }
                  ],
                },
              },
            },
            designations: {
              $filter: {
                input: {
                  $map: {
                    input: { $ifNull: ["$workhistTodo", []] },
                    as: "w",
                    in: "$$w.desigTodo",
                  },
                },
                as: "item",
                cond: {
                  $and: [
                    { $ne: ["$$item", null] },
                    { $ne: ["$$item", ""] }
                  ],
                },
              },
            },
            duties: {
              $filter: {
                input: {
                  $map: {
                    input: { $ifNull: ["$workhistTodo", []] },
                    as: "w",
                    in: "$$w.dutiesTodo",
                  },
                },
                as: "item",
                cond: {
                  $and: [
                    { $ne: ["$$item", null] },
                    { $ne: ["$$item", ""] }
                  ],
                },
              },
            },
            reasons: {
              $filter: {
                input: {
                  $map: {
                    input: { $ifNull: ["$workhistTodo", []] },
                    as: "w",
                    in: "$$w.reasonTodo",
                  },
                },
                as: "item",
                cond: {
                  $and: [
                    { $ne: ["$$item", null] },
                    { $ne: ["$$item", ""] }
                  ],
                },
              },
            },
          },
        },
        {
          $group: {
            _id: null,
            eduInstitutions: { $addToSet: "$eduInstitutions" },
            addInstitutions: { $addToSet: "$addInstitutions" },
            empNames: { $addToSet: "$empNames" },
            designations: { $addToSet: "$designations" },
            duties: { $addToSet: "$duties" },
            reasons: { $addToSet: "$reasons" },
          },
        },
        {
          $project: {
            _id: 0,
            eduInstitutions: {
              $reduce: {
                input: "$eduInstitutions",
                initialValue: [],
                in: { $setUnion: ["$$value", "$$this"] },
              },
            },
            addInstitutions: {
              $reduce: {
                input: "$addInstitutions",
                initialValue: [],
                in: { $setUnion: ["$$value", "$$this"] },
              },
            },
            empNames: {
              $reduce: {
                input: "$empNames",
                initialValue: [],
                in: { $setUnion: ["$$value", "$$this"] },
              },
            },
            designations: {
              $reduce: {
                input: "$designations",
                initialValue: [],
                in: { $setUnion: ["$$value", "$$this"] },
              },
            },
            duties: {
              $reduce: {
                input: "$duties",
                initialValue: [],
                in: { $setUnion: ["$$value", "$$this"] },
              },
            },
            reasons: {
              $reduce: {
                input: "$reasons",
                initialValue: [],
                in: { $setUnion: ["$$value", "$$this"] },
              },
            },
          },
        },
      ];



      let req = await axios.post(
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
      let result = req.data.users;

      console.log(result, "sdfsdfsd")
      setMasterFieldValues(result?.length > 0 ? result[0] : {})

    } catch (err) {
      console.log(err)
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const [categorys, setCategorys] = useState([]);
  const [subcategorys, setSubcategorys] = useState([]);
  const [educationsOpt, setEducationsOpt] = useState([]);

  const fetchCategoryBased = async (e) => {
    setPageName(!pageName);
    try {
      let res_category = await axios.get(SERVICE.CATEGORYEDUCATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let data_set = res_category?.data?.educationcategory.filter((data) => {
        return data.categoryname === e.value;
      });

      let get = data_set[0]?.subcategoryname.map((data) => ({
        label: data,
        value: data,
      }));

      setSubcategorys(get);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

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

  const fetchCategoryEducation = async () => {
    setPageName(!pageName);
    try {
      let res_category = await axios.get(SERVICE.CATEGORYEDUCATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let data_set = res_category?.data?.educationcategory.map((d) => d.categoryname);
      let filter_opt = [...new Set(data_set)];

      setCategorys(
        filter_opt.map((data) => ({
          ...data,
          label: data,
          value: data,
        }))
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchEducation = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.EDUCATIONSPECILIZATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let data_set = res?.data?.educationspecilizations.filter((data) => {
        return data?.category?.includes(employee.categoryedu) && data?.subcategory?.includes(e?.value);
      });

      let result = data_set[0]?.specilizationgrp?.map((data) => ({
        label: data?.label,
        value: data?.label,
      }));

      setEducationsOpt(result);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { isUserRoleCompare, allTeam, isAssignBranch, pageName, setPageName, buttonStyles, isUserRoleAccess, allUsersData, allUsersLimit } = useContext(UserRoleAccessContext);

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
      pagename: String('Education Update'),
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

  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState('');

  const [errorstodo, setErrorstodo] = useState({});
  const { auth } = useContext(AuthContext);
  const [educationcheck, seteducationcheck] = useState(false);

  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage
        .toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, 'Educational Qualification Update List.png');
        })
        .catch((error) => {
          console.error('dom-to-image error: ', error);
        });
    }
  };

  // Copied fields Name
  const handleCopy = (message) => {
    NotificationManager.success(`${message} 👍`, '', 2000);
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
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

  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleClickOpeninfo = () => {
    setOpeninfo(true);
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
        Username: item.username || '',
      };
    });
  };

  const handleExportXL = (isfilter) => {
    const dataToExport = isfilter === 'filtered' ? filteredData : getemployees;

    if (!dataToExport || dataToExport.length === 0) {
      console.error('No data available to export');
      return;
    }

    exportToExcel(formatData(dataToExport), 'Educational Qualification Update List');
    setIsFilterOpen(false);
  };

  //  PDF
  // pdf.....
  const columns = [
    { title: 'EmpCode', field: 'empcode' },
    { title: 'Employee Name', field: 'companyname' },
    { title: 'Company', field: 'company' },
    { title: 'Branch', field: 'branch' },
    { title: 'Unit', field: 'unit' },
    { title: 'Team', field: 'team' },
    { title: 'Username', field: 'username' },
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
          dot: t.dot ? moment(t.dot, 'YYYY-MM-DD').format('DD-MM-YYYY') : '',
          doj: t.doj ? moment(t.doj, 'YYYY-MM-DD').format('DD-MM-YYYY') : '',
        }))
        : getemployees?.map((item, index) => ({
          ...item,
          serialNumber: index + 1,
          dot: item.dot ? moment(item.dot, 'YYYY-MM-DD').format('DD-MM-YYYY') : '',
          doj: item.doj ? moment(item.doj, 'YYYY-MM-DD').format('DD-MM-YYYY') : '',
        }));

    // Generate PDF
    doc.autoTable({
      theme: 'grid',
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: 5 },
    });

    doc.save('Educational Qualification Update List.pdf');
  };

  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Educational Qualification Update List',
    pageStyle: 'print',
  });

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
    companyname: true,
    company: true,
    branch: true,
    unit: true,
    team: true,
    empcode: true,
    username: true,
    workmode: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setQualiDetails(res?.data?.suser);
      setAddiDetails(res?.data?.suser);
      setRowGetid(res?.data?.suser);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  let sno = 1;

  //Submit function for TODO Education
  const handleSubmittodo = (e) => {
    const errorstodo = {};
    e.preventDefault();
    let isDuplicate = eduTodo?.some((item) => {
      return (
        item.categoryedu === employee.categoryedu &&
        item.subcategoryedu === employee.subcategoryedu &&
        item.specialization === employee.specialization &&
        item.qualification === qualification &&
        item.institution.toLowerCase() === institution.toLowerCase() &&
        item.passedyear === passedyear &&
        item.cgpa === cgpa
      );
    });
    if (employee.categoryedu == 'Please Select Category' || employee.subcategoryedu == 'Please Select Sub Category' || employee.specialization == 'Please Select Specialization' || institution == '' || passedyear == '' || cgpa == '') {
      errorstodo.qualification = <Typography style={{ color: 'red' }}>Please Enter All Fields</Typography>;
      setErrorstodo(errorstodo);
      return;
    } else if (isDuplicate) {
      errorstodo.duplicate = <Typography style={{ color: 'red' }}>Data Already Exist!</Typography>;
      setErrorstodo(errorstodo);
      return;
    } else {
      setEduTodo([
        ...eduTodo,
        {
          categoryedu: employee.categoryedu,
          subcategoryedu: employee.subcategoryedu,
          specialization: employee.specialization,
          qualification,
          institution,
          passedyear,
          cgpa,
        },
      ]);
      setErrorstodo('');
    }
    setQualification('');
    setInstitution('');
    setPassedyear('');
    setCgpa('');
    setEmployee({
      categoryedu: 'Please Select Category',
      subcategoryedu: 'Please Select Sub Category',
      specialization: 'Please Select Specialization',
    });

    setSubcategorys([]);
    setEducationsOpt([]);
  };

  //Delete for Education
  const handleDeleteTodo = (index) => {
    const newTodos = [...eduTodo];
    newTodos.splice(index, 1);
    setEduTodo(newTodos);
  };

  const editSubmit = (e) => {
    e.preventDefault();

    sendRequestt();
  };

  // Edit model
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    setErrorstodo({});
    if (reason && reason === 'backdropClick') return;
    setIsEditOpen(false);

    setSubcategorys([]);
    setEducationsOpt([]);
    setQualification('');
    setInstitution('');
    setPassedyear('');
    setCgpa('');
    setEmployee({
      categoryedu: 'Please Select Category',
      subcategoryedu: 'Please Select Sub Category',
      specialization: 'Please Select Specialization',
    });

    setSubcategorys([]);
    setEducationsOpt([]);
  };

  //get am single id to get an particular row
  const getCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setQualiDetails(res?.data?.suser);
      setAddiDetails(res?.data?.suser);
      setEduTodo(res?.data?.suser?.eduTodo);
      setRowGetid(res?.data?.suser);
      handleClickOpenEdit();
      await fetchCategoryEducation();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //Educationupadate updateby edit page...
  let updateby = qualiDetails.updatedby;
  let addedby = qualiDetails.addedby;

  //edit post call
  let logedit = getrowid._id;
  const sendRequestt = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${logedit}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        companyname: String(qualiDetails.companyname),
        empcode: String(qualiDetails.empcode),
        location: String(qualiDetails.location),
        firstname: String(qualiDetails.firstname),
        lastname: String(qualiDetails.lastname),
        eduTodo: [...eduTodo],
      });
      setAddiDetails(res.data);
      handleCloseModEdit();
      await fetchMasterFieldValues();
      setPopupContent('Updated Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //table entries ..,.
  const [items, setItems] = useState([]);

  const addSerialNumber = (datas) => {
    setItems(datas?.map((item, index) => ({ ...item, serialNumber: index + 1 })));
    setOverallItems(datas?.map((item, index) => ({ ...item, serialNumber: index + 1 })));
  };
  useEffect(() => {
    addSerialNumber(getemployees);
  }, [getemployees]);

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

  const totalPages = Math.ceil(filteredDatas.length / pageSize);

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
      width: 60,
      hide: !columnVisibility.serialNumber,
      headerClassName: 'bold-header',
      pinned: 'left',
    },
    {
      field: 'empcode',
      headerName: 'Empcode',
      flex: 0,
      width: 200,
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
                handleCopy('Copied Empcode!');
              }}
              options={{ message: 'Copied Empcode!' }}
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
      width: 200,
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
                handleCopy('Copied EmployeeName!');
              }}
              options={{ message: 'Copied EmployeeName!' }}
              text={params?.data?.empcode}
            >
              <ListItemText primary={params?.data?.companyname} />
            </CopyToClipboard>
          </ListItem>
        </Grid>
      ),
    },
    {
      field: 'company',
      headerName: 'Company',
      flex: 0,
      width: 80,
      hide: !columnVisibility.company,
      headerClassName: 'bold-header',
    },
    {
      field: 'branch',
      headerName: 'Branch',
      flex: 0,
      width: 150,
      hide: !columnVisibility.branch,
      headerClassName: 'bold-header',
    },
    {
      field: 'unit',
      headerName: 'Unit',
      flex: 0,
      width: 80,
      hide: !columnVisibility.unit,
      headerClassName: 'bold-header',
    },
    {
      field: 'team',
      headerName: 'Team',
      flex: 0,
      width: 80,
      hide: !columnVisibility.team,
      headerClassName: 'bold-header',
    },
    {
      field: 'username',
      headerName: 'Username',
      flex: 0,
      width: 100,
      hide: !columnVisibility.username,
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
      field: 'actions',
      headerName: 'Action',
      flex: 0,
      width: 150,
      minHeight: '40px !important',
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: 'bold-header',
      cellRenderer: (params) => (
        <>
          {isUserRoleCompare.includes('Manager') ? (
            <>
              <Grid container spacing={2}>
                <Grid item>
                  {isUserRoleCompare?.includes('ieducationaldetailupdate') && (
                    <>
                      <Button
                        sx={userStyle.buttonedit}
                        onClick={() => {
                          handleClickOpeninfo();
                          getinfoCode(params.data.id);
                        }}
                      >
                        <InfoOutlinedIcon style={{ fontsize: 'large' }} sx={buttonStyles.buttoninfo} />
                      </Button>
                    </>
                  )}
                </Grid>
              </Grid>
            </>
          ) : (
            <>
              <Grid sx={{ display: 'flex' }}>
                {isUserRoleCompare?.includes('eeducationaldetailupdate') && (
                  <Button
                    sx={userStyle.buttonedit}
                    onClick={() => {
                      getCode(params.data.id);
                    }}
                  >
                    <EditIcon style={{ fontsize: 'large' }} sx={buttonStyles.buttonedit} />
                  </Button>
                )}

                {isUserRoleCompare?.includes('ieducationaldetailupdate') && (
                  <Button
                    sx={userStyle.buttonedit}
                    onClick={() => {
                      getinfoCode(params.data.id);
                    }}
                  >
                    <InfoOutlinedIcon style={{ fontsize: 'large' }} sx={buttonStyles.buttoninfo} />
                  </Button>
                )}
              </Grid>
            </>
          )}
        </>
      ),
    },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      empcode: item.empcode,
      companyname: item.companyname,
      username: item.username,
      company: item.company,
      workmode: item.workmode,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
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

  const [valueEmp, setValueEmp] = React.useState([]); // State for employees
  const [isBoxFocused, setIsBoxFocused] = React.useState(false); // Track focus state

  let [valueTeamCat, setValueTeamCat] = useState([]);
  let [valueUnitCat, setValueUnitCat] = useState([]);
  let [valueBranchCat, setValueBranchCat] = useState([]);
  let [valueCompanyCat, setValueCompanyCat] = useState([]);

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
  };

  const customValueRendererTeam = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length ? valueTeamCat.map(({ label }) => label)?.join(', ') : 'Please Select Team';
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
    } else if (filterState?.type === 'Department' && selectedOptionsDepartment?.length === 0) {
      setPopupContentMalert('Please Select Department!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else {
      fetchEmployee();
      setSearchQuery('');
    }
  };
  const [allAssignCompany, setAllAssignCompany] = useState([]);
  const [allAssignBranch, setAllAssignBranch] = useState([]);
  const [allAssignUnit, setAllAssignUnit] = useState([]);

  //get all employees list details
  const fetchEmployee = async () => {
    seteducationcheck(true);
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
          ],
        },
      },
      {
        $project: {
          username: 1,
          empcode: 1,
          workmode: 1,
          companyname: 1,
          company: 1,
          branch: 1,
          unit: 1,
          team: 1,
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
      seteducationcheck(false);
    } catch (err) {
      seteducationcheck(false);
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
      //----------------------------
      let mappedemployees = allUsersData
        ?.filter((u) => selectedCompany?.includes(u.company) && selectedBranch?.includes(u.branch) && selectedUnit?.includes(u.unit) && selectedTeam?.includes(u.team))
        .map((u) => ({
          label: u.companyname,
          value: u.companyname,
        }));

      let employees = allUsersData?.filter((u) => selectedCompany?.includes(u.company) && selectedBranch?.includes(u.branch) && selectedUnit?.includes(u.unit) && selectedTeam?.includes(u.team)).map((u) => u.companyname);
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
      <Headtitle title={'EDUCATIONAL DETAIL UPDATE'} />

      <PageHeading title="Education Details" modulename="Human Resources" submodulename="HR" mainpagename="Employee" subpagename="Employee Update Details" subsubpagename="Educational Detail update" />
      <br />
      {isUserRoleCompare?.includes('leducationaldetailupdate') && (
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
                              //  &&
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
              </>
            </Grid>
            <br />
            <br />
            <br />
            <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Grid item lg={1} md={2} sm={2} xs={12}>
                <Button sx={buttonStyles.buttonsubmit} variant="contained" onClick={handleFilter}>
                  {' '}
                  Filter{' '}
                </Button>
              </Grid>
              <Grid item lg={1} md={2} sm={2} xs={12}>
                <Button sx={buttonStyles.btncancel} onClick={handleClearFilter}>
                  {' '}
                  Clear{' '}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
      <br />
      <Box>
        <form>
          {isUserRoleCompare?.includes('leducationaldetailupdate') && (
            <>
              <Box sx={userStyle.container}>
                {/* ******************************************************EXPORT Buttons****************************************************** */}
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>Educational Qualification Update List</Typography>
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
                        <MenuItem value={getemployees?.length}>All</MenuItem>
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
                      {isUserRoleCompare?.includes('exceleducationaldetailupdate') && (
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
                      {isUserRoleCompare?.includes('csveducationaldetailupdate') && (
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
                      {isUserRoleCompare?.includes('printeducationaldetailupdate') && (
                        <>
                          <Button sx={userStyle.buttongrp} onClick={handleprint}>
                            &ensp;
                            <FaPrint />
                            &ensp;Print&ensp;
                          </Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes('pdfeducationaldetailupdate') && (
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
                      {isUserRoleCompare?.includes('imageeducationaldetailupdate') && (
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
                      maindatas={getemployees}
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
                &ensp;
                <br />
                <br />
                {educationcheck ? (
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

          {/* ALERT DIALOG */}
          <Box>
            {/* ALERT DIALOG */}
            <Dialog open={isEditOpen} onClose={handleCloseModEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" sx={{ overflowY: 'visible', marginTop: '50px' }} maxWidth="md">
              <DialogContent sx={{ overflowY: 'visible', marginTop: '5%' }}>
                {/* <Box sx={userStyle.dialogbox}> */}

                <Typography sx={userStyle.HeaderText}>Edit Educational Qualification Details</Typography>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={6} sm={12} xs={12} sx={{ display: 'flex' }}>
                    <Typography sx={{ fontWeight: '600', marginRight: '5px' }}>
                      Employee Name: <b>{AddiDetails.companyname}</b>
                    </Typography>
                  </Grid>
                  <Grid item md={6} sm={12} xs={12} sx={{ display: 'flex' }}>
                    <Typography sx={{ fontWeight: '600', marginRight: '5px' }}>
                      Emp Code: <b>{AddiDetails.empcode}</b>
                    </Typography>
                  </Grid>
                  <br></br>
                  <br></br>

                  <Grid item md={4} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Category</Typography>
                      <Selects
                        options={categorys}
                        // styles={colourStyles}
                        value={
                          employee.categoryedu
                            ? {
                              label: employee.categoryedu,
                              value: employee.subcategoryedu,
                            }
                            : {
                              label: 'Please Select Category',
                              value: 'Please Select Category',
                            }
                        }
                        onChange={(e) => {
                          setEmployee((prev) => ({
                            ...prev,
                            categoryedu: e.value,
                            subcategoryedu: 'Please Select Sub Category',
                            specialization: 'Please Select Specialization',
                          }));
                          fetchCategoryBased(e);
                          setSubcategorys([]);
                          setEducationsOpt([]);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Sub Category</Typography>
                      <Selects
                        options={subcategorys}
                        // styles={colourStyles}
                        value={
                          employee.subcategoryedu
                            ? {
                              label: employee.subcategoryedu,
                              value: employee.subcategoryedu,
                            }
                            : {
                              label: 'Please Select Sub Category',
                              value: 'Please Select Sub Category',
                            }
                        }
                        onChange={(e) => {
                          setEmployee((prev) => ({
                            ...prev,
                            subcategoryedu: e.value,
                            specialization: 'Please Select Specialization',
                          }));
                          fetchEducation(e);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <Typography> Specialization</Typography>
                    <FormControl fullWidth size="small">
                      <Selects
                        options={educationsOpt}
                        // styles={colourStyles}
                        value={
                          employee.specialization
                            ? {
                              label: employee.specialization,
                              value: employee.specialization,
                            }
                            : {
                              label: 'Please Select Specialization',
                              value: 'Please Select Specialization',
                            }
                        }
                        onChange={(e) => {
                          setEmployee((prev) => ({
                            ...prev,
                            specialization: e.value,
                          }));
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={5} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography> Institution </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ flexGrow: 1 }}>
                          {switchValues?.educationInstitution ? (
                            <OutlinedInput id="component-outlined" type="text" value={institution} placeholder="Institution" onChange={(e) => setInstitution(e.target.value)} />
                          ) : (
                            <Selects
                              options={masterFieldValues?.eduInstitutions?.length > 0 ? masterFieldValues?.eduInstitutions?.map(data => ({
                                label: data,
                                value: data,
                              })) : []}
                              placeholder="Please Select"
                              value={{ label: institution === "" ? "Please Select Institution" : institution, value: institution === "" ? "Please Select Institution" : institution }}
                              onChange={(e) => {
                                setInstitution(e.value)
                              }}
                            />
                          )}
                        </Box>

                        <FormGroup>
                          <Button variant={switchValues?.educationInstitution ? 'contained' : 'outlined'} onClick={() => {
                            setSwicthValues((prev) => ({
                              ...prev,
                              educationInstitution: !switchValues?.educationInstitution,
                            }));
                            setInstitution("")
                          }}
                            size="small"
                          >
                            {switchValues?.educationInstitution ? 'Exist' : 'New'}
                          </Button>
                        </FormGroup>
                      </Box>

                    </FormControl>
                  </Grid>
                  <Grid item md={5} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography> Passed Year </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={passedyear}
                        onChange={(e) => {
                          const value = e.target.value.slice(0, 4);
                          if (value === '' || /^\d*$/.test(value)) {
                            setPassedyear(value);
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={5} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography> CGPA</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={cgpa}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
                            setCgpa(value);
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item md={1} sm={12} xs={12}>
                    <FormControl size="small">
                      <Button variant="contained" color="success" type="button" onClick={handleSubmittodo} sx={userStyle.Todoadd}>
                        <FaPlus />
                      </Button>
                      &nbsp;
                    </FormControl>
                  </Grid>
                  <Grid item md={12} sm={12} xs={12}>
                    {errorstodo.qualification && <div style={{ color: 'red' }}>{errorstodo.qualification}</div>}
                  </Grid>
                  <Grid item md={12} sm={12} xs={12}>
                    {errorstodo.duplicate && <div style={{ color: 'red' }}>{errorstodo.duplicate}</div>}
                  </Grid>

                  <br />
                </Grid>
                <br></br>
                <br></br>

                {/* this is info view details */}

                {/* <Box sx={userStyle.container}> */}
                <Typography sx={userStyle.SubHeaderText}>Educational Qualification Update</Typography>
                <br />
                {/* ****** Table start ****** */}
                <TableContainer component={Paper}>
                  <Table
                    aria-label="simple table"
                    id="workhistory"
                  //  ref={tableRef}
                  >
                    <TableHead sx={{ fontWeight: '600' }}>
                      <StyledTableRow>
                        <StyledTableCell align="center">SI.NO</StyledTableCell>
                        <StyledTableCell align="center">Category</StyledTableCell>
                        <StyledTableCell align="center">Sub Category</StyledTableCell>
                        <StyledTableCell align="center">Specialization</StyledTableCell>
                        <StyledTableCell align="center">Institution</StyledTableCell>
                        <StyledTableCell align="center">Passed Year</StyledTableCell>
                        <StyledTableCell align="center">% or cgpa</StyledTableCell>
                        <StyledTableCell align="center">Action</StyledTableCell>
                      </StyledTableRow>
                    </TableHead>
                    <TableBody>
                      {eduTodo &&
                        eduTodo.map((todo, index) => (
                          <StyledTableRow key={index}>
                            <StyledTableCell align="center">{sno++}</StyledTableCell>
                            <StyledTableCell align="center">{todo.categoryedu}</StyledTableCell>
                            <StyledTableCell align="center">{todo.subcategoryedu}</StyledTableCell>
                            <StyledTableCell align="center">{todo.specialization}</StyledTableCell>
                            <StyledTableCell align="center">{todo.institution}</StyledTableCell>
                            <StyledTableCell align="center">{todo.passedyear}</StyledTableCell>
                            <StyledTableCell align="center">{todo.cgpa}</StyledTableCell>
                            <StyledTableCell align="center">
                              {
                                <Button variant="contained" color="error" type="button" onClick={() => handleDeleteTodo(index)} sx={userStyle.Todoadd}>
                                  <AiOutlineClose />
                                </Button>
                              }
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <br></br>
                <br></br>
                <>
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
              </DialogContent>
              <br />
            </Dialog>
          </Box>
        </form>
      </Box>

      <Dialog open={openInfo} onClose={handleCloseinfo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg" sx={{ marginTop: '50px' }}>
        <Box sx={{ width: '550px', padding: '20px 50px' }}>
          <>
            <Typography sx={userStyle.HeaderText}> Education Info</Typography>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">addedby</Typography>
                  <br />
                  <Table>
                    <TableHead>
                      <StyledTableCell sx={{ padding: '5px 10px !important' }}>{'SNO'}.</StyledTableCell>
                      <StyledTableCell sx={{ padding: '5px 10px !important' }}> {'UserName'}</StyledTableCell>
                      <StyledTableCell sx={{ padding: '5px 10px !important' }}> {'Date'}</StyledTableCell>
                    </TableHead>
                    <TableBody>
                      {addedby?.map((item, i) => (
                        <StyledTableRow>
                          <StyledTableCell sx={{ padding: '5px 10px !important' }}>{i + 1}.</StyledTableCell>
                          <StyledTableCell sx={{ padding: '5px 10px !important' }}> {item.name}</StyledTableCell>
                          <StyledTableCell sx={{ padding: '5px 10px !important' }}> {moment(item.date).format('DD-MM-YYYY hh:mm:ss a')}</StyledTableCell>
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
                      <StyledTableCell sx={{ padding: '5px 10px !important' }}>{'SNO'}.</StyledTableCell>
                      <StyledTableCell sx={{ padding: '5px 10px !important' }}> {'UserName'}</StyledTableCell>
                      <StyledTableCell sx={{ padding: '5px 10px !important' }}> {'Date'}</StyledTableCell>
                    </TableHead>
                    <TableBody>
                      {updateby?.map((item, i) => (
                        <StyledTableRow>
                          <StyledTableCell sx={{ padding: '5px 10px !important' }}>{i + 1}.</StyledTableCell>
                          <StyledTableCell sx={{ padding: '5px 10px !important' }}> {item.name}</StyledTableCell>
                          <StyledTableCell sx={{ padding: '5px 10px !important' }}> {moment(item.date).format('DD-MM-YYYY hh:mm:ss a')}</StyledTableCell>
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
                {' '}
                Back{' '}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table aria-label="simple table" id="branch" ref={componentRef}>
          <TableHead sx={{ fontWeight: '600' }}>
            <TableRow>
              <TableCell>SI.NO</TableCell>
              <TableCell>Empcode</TableCell>
              <TableCell>username</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rowDataTable &&
              rowDataTable.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.empcode}</TableCell>
                  <TableCell> {row.username}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ALERT DIALOG */}
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
      <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
        itemsTwo={getemployees ?? []}
        filename={'Education Update'}
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

export default Educatioupdate;
