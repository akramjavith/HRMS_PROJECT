import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import { FaFileExcel, FaFileCsv, FaPrint, FaFilePdf, FaSearch } from 'react-icons/fa';
import { Box, Typography, OutlinedInput, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Button, Popover, IconButton, InputAdornment, Tooltip } from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import { handleApiError } from "../../../components/Errorhandling";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import { MultiSelect } from "react-multi-select-component";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import Selects from "react-select";
import moment from 'moment';
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import domtoimage from 'dom-to-image';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import ExportData from "../../../components/ExportData";
import MessageAlert from "../../../components/MessageAlert";
import PageHeading from "../../../components/PageHeading";
import AlertDialog from "../../../components/Alert";
import AdvancedSearchBar from '../../../components/SearchbarEbList.js';
import ManageColumnsContent from "../../../components/ManageColumn";
import ResizeObserver from 'resize-observer-polyfill';
window.ResizeObserver = ResizeObserver;

function AttendanceMonthStatusList() {

  const gridRefTableAttMonth = useRef(null);
  const gridRefImageAttMonth = useRef(null);
  const currentDateAttMonth = new Date();
  const currentYearAttMonth = currentDateAttMonth.getFullYear();

  // get current month in string name
  const monthstring = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentMonthIndex = new Date().getMonth();
  const currentMonthObject = { label: monthstring[currentMonthIndex], value: currentMonthIndex + 1 };
  const currentYearObject = { label: currentYearAttMonth, value: currentYearAttMonth };
  const years = Array.from(new Array(10), (val, index) => currentYearAttMonth - index);
  const getyear = years.map((year) => {
    return { value: year, label: year };
  });

  const { isUserRoleAccess, isUserRoleCompare, isAssignBranch, allUsersLimit, alldepartment, allTeam, pageName, setPageName, buttonStyles, } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);

  const [attStatus, setAttStatus] = useState([]);
  const [attModearr, setAttModearr] = useState([]);
  const [attStatusOption, setAttStatusOption] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState([]);
  const [valueCompany, setValueCompany] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [valueBranch, setValueBranch] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState([]);
  const [valueUnit, setValueUnit] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState([]);
  const [valueTeam, setValueTeam] = useState([]);
  const [selectedDep, setSelectedDep] = useState([]);
  const [valueDep, setValueDep] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState([]);
  const [valueEmp, setValueEmp] = useState([]);
  const [userShifts, setUserShifts] = useState([]);
  const [showAlert, setShowAlert] = useState();
  const [loader, setLoader] = useState(false);

  const [filterUser, setFilterUser] = useState({ filtertype: "Individual", });
  const [isMonthyear, setIsMonthYear] = useState({ ismonth: currentMonthObject, isyear: currentYearObject });

  // State to track advanced filter
  const [advancedFilter, setAdvancedFilter] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [columnApi, setColumnApi] = useState(null);
  const [filteredDataItems, setFilteredDataItems] = useState(userShifts);
  const [filteredRowData, setFilteredRowData] = useState([]);

  //get all months
  const months = [
    { value: 1, label: "January", },
    { value: 2, label: "February", },
    { value: 3, label: "March", },
    { value: 4, label: "April", },
    { value: 5, label: "May", },
    { value: 6, label: "June", },
    { value: 7, label: "July", },
    { value: 8, label: "August", },
    { value: 9, label: "September", },
    { value: 10, label: "October", },
    { value: 11, label: "November", },
    { value: 12, label: "December" },
  ];

  // Datatable
  const [pageAttMonth, setPageAttMonth] = useState(1);
  const [pageSizeAttMonth, setPageSizeAttMonth] = useState(10);
  const [searchQueryAttMonth, setSearchQueryAttMonth] = useState("");
  const [totalPagesAttMonth, setTotalPagesAttMonth] = useState("");

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const handleClickOpenerr = () => { setIsErrorOpen(true); };
  const handleCloseerr = () => { setIsErrorOpen(false); };

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  // pageAttMonth refersh reload
  const handleCloseFilterMod = () => { setIsFilterOpen(false); };
  const handleClosePdfFilterMod = () => { setIsPdfFilterOpen(false); };

  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => { setOpenPopupMalert(true); };
  const handleClosePopupMalert = () => { setOpenPopupMalert(false); };

  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const handleClickOpenPopup = () => { setOpenPopup(true); };
  const handleClosePopup = () => { setOpenPopup(false); }

  // pageAttMonth refersh reload
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

  // Manage Columns
  const [isManageColumnsOpenAttMonth, setManageColumnsOpenAttMonth] = useState(false);
  const [anchorElAttMonth, setAnchorElAttMonth] = useState(null);
  const [searchQueryManageAttMonth, setSearchQueryManageAttMonth] = useState("");
  const handleOpenManageColumnsAttMonth = (event) => {
    setAnchorElAttMonth(event.currentTarget);
    setManageColumnsOpenAttMonth(true);
  };
  const handleCloseManageColumnsAttMonth = () => {
    setManageColumnsOpenAttMonth(false);
    setSearchQueryManageAttMonth("");
  };
  const openAttMonth = Boolean(anchorElAttMonth);
  const idAttMonth = openAttMonth ? "simple-popover" : undefined;

  // Search bar
  const [anchorElSearchAttMonth, setAnchorElSearchAttMonth] = React.useState(null);
  const handleClickSearchAttMonth = (event) => {
    setAnchorElSearchAttMonth(event.currentTarget);
  };
  const handleCloseSearchAttMonth = () => {
    setAnchorElSearchAttMonth(null);
    setSearchQueryAttMonth("");
  };

  const openSearchAttMonth = Boolean(anchorElSearchAttMonth);
  const idSearchAttMonth = openSearchAttMonth ? 'simple-popover' : undefined;

  const modeOptions = [
    { label: 'Department', value: "Department" },
    { label: "Employee", value: "Employee" },
  ];

  // Table row color
  const getRowStyle = (params) => {
    if (params.node.rowIndex % 2 === 0) {
      return { background: '#f0f0f0' }; // Even row
    } else {
      return { background: '#ffffff' }; // Odd row
    }
  }
  const handleGetMonth = (e) => {
    const selectedMonthObject = months.find((d) => d.value === e);
    setIsMonthYear({ ...isMonthyear, ismonth: selectedMonthObject });
  }
  const handleGetYear = (e) => {
    const selectedYearObject = getyear.find((d) => d.value === e);
    setIsMonthYear({ ...isMonthyear, isyear: selectedYearObject });
  }

  // Show All Columns & Manage Columns
  const initialColumnVisibilityAttMonth = {
    checkbox: true,
    serialNumber: true,
    empcode: true,
    username: true,
    company: true,
    branch: true,
    unit: true,
    team: true,
    department: true,
    totalnumberofdays: true,
    empshiftdays: true,
    totalcounttillcurrendate: true,
    shift: true,
    totalshift: true,
    clsl: true,
    totalpresentdays: true,
    weekoff: true,
    holidayCount: true,
    doublelopcount: true,
    doublehalflopcount: true,
    lopcount: true,
    totalabsentleave: true,
    totalpaiddays: true,
    paidpresentday: true,
    nostatuscount: true,
  };
  const [columnVisibilityAttMonth, setColumnVisibilityAttMonth] = useState(initialColumnVisibilityAttMonth);

  useEffect(() => {
    getapi();
  }, []);

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        'Authorization': `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Attendance Month Status"),
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

  //get all Sub vendormasters.
  const fetchAttedanceStatus = async () => {
    setPageName(!pageName)
    try {
      let res_vendor = await axios.get(SERVICE.ATTENDANCE_STATUS, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      setAttStatus(res_vendor?.data?.attendancestatus);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  }

  //get all Attendance Status name.
  const fetchAttMode = async () => {
    setPageName(!pageName)
    try {
      let res_freq = await axios.get(SERVICE.ATTENDANCE_MODE_STATUS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAttModearr(res_freq?.data?.allattmodestatus);
      let result = res_freq?.data?.allattmodestatus.filter((data, index) => {
        return data.appliedthrough != "Auto";
      });

      setAttStatusOption(result.map((d) => d.name));
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  useEffect(() => {
    fetchAttedanceStatus();
    fetchAttMode();
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

  useEffect(() => {
    // Remove duplicates based on the 'company' field
    const uniqueIsAssignBranch = accessbranch.reduce((acc, current) => {
      const x = acc.find(item => item.company === current.company && item.branch === current.branch && item.unit === current.unit);
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
    const team = allTeam
      ?.filter(val =>
        company.some(comp => comp.value === val.company) &&
        branch.some(br => br.value === val.branch) &&
        unit.some(uni => uni.value === val.unit)
      )
      .map(data => ({
        label: data.teamname,
        value: data.teamname,
      }));
    setSelectedTeam(team);
    setValueTeam(team.map(a => a.value));
    const allemployees = allUsersLimit?.filter(
      (val) =>
        company?.map(comp => comp.value === val.company) && branch?.map(comp => comp.value === val.branch) && unit?.map(comp => comp.value === val.unit) && team.map(team => team.value === val.team)
    )?.map(data => ({
      label: data.companyname,
      value: data.companyname,
    })).filter((item, index, self) => {
      return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
    })
    setSelectedEmp(allemployees);
    setValueEmp(
      allemployees.map((a, index) => {
        return a.value;
      })
    );
  }, [isAssignBranch])

  //company multiselect
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
    setSelectedTeam([]);
    setValueTeam([]);
    setSelectedDep([]);
    setValueDep([]);
    setSelectedEmp([]);
    setValueEmp([]);
  };

  const customValueRendererCompany = (valueCompany, _categoryname) => {
    return valueCompany?.length
      ? valueCompany.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
  };

  //branchto multiselect dropdown changes
  const handleBranchChange = (options) => {
    setSelectedBranch(options);
    setValueBranch(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedUnit([]);
    setValueUnit([]);
    setSelectedTeam([]);
    setValueTeam([]);
    setSelectedEmp([]);
    setValueEmp([]);
    setSelectedDep([]);
    setValueDep([]);
  };

  const customValueRendererBranch = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Branch";
  };

  // unitto multiselect dropdown changes
  const handleUnitChange = (options) => {
    setSelectedUnit(options);
    setValueUnit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedTeam([]);
    setValueTeam([]);
    setSelectedEmp([]);
    setValueEmp([]);
  };
  const customValueRendererUnit = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Unit";
  };

  //Teamto multiselect dropdown changes
  const handleTeamChange = (options) => {
    setSelectedTeam(options);
    setValueTeam(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedEmp([]);
    setValueEmp([]);
  };
  const customValueRendererTeam = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Team";
  };

  // Employee    
  const handleEmployeeChange = (options) => {
    setSelectedEmp(options);
    setValueEmp(
      options.map((a, index) => {
        return a.value;
      })
    );
  };
  const customValueRendererEmp = (valueCate, _employees) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Employee";
  };

  // Department
  const handleDepartmentChange = (options) => {
    setSelectedDep(options);
    setValueDep(
      options.map((a, index) => {
        return a.value;
      })
    );
  };

  const customValueRendererDepartment = (valueDep, _categoryname) => {
    return valueDep?.length
      ? valueDep.map(({ label }) => label)?.join(", ")
      : "Please Select Department";
  };

  // const getattendancestatus = (clockinstatus, clockoutstatus) => {
  //     let result = attStatus.filter((data, index) => {
  //         return data?.clockinstatus === clockinstatus && data?.clockoutstatus === clockoutstatus
  //     })
  //     return result[0]?.name
  // }

  // const getAttModeLop = (rowdaystatus) => {
  //     let result = attModearr.filter((data, index) => {
  //         return data?.name === rowdaystatus
  //     })
  //     return result[0]?.lop === true ? 'Yes' : 'No';
  // }

  // const getAttModeLopType = (rowdaystatus) => {
  //     let result = attModearr.filter((data, index) => {
  //         return data?.name === rowdaystatus
  //     })
  //     return result[0]?.loptype
  // }

  // const getFinalLop = (rowlop, rowloptype) => {
  //     return (rowloptype === undefined || rowloptype === "") ? rowlop : (rowlop + ' - ' + rowloptype);
  // }

  // const getAttModeTarget = (rowdaystatus) => {
  //     let result = attModearr.filter((data, index) => {
  //         return data?.name === rowdaystatus
  //     })
  //     return result[0]?.target === true ? 'Yes' : 'No';
  // }

  // const getAttModePaidPresent = (rowdaystatus) => {
  //     let result = attModearr.filter((data, index) => {
  //         return data?.name === rowdaystatus
  //     })
  //     return result[0]?.paidleave === true ? 'Yes' : 'No';
  // }

  // const getAttModePaidPresentType = (rowdaystatus) => {
  //     let result = attModearr.filter((data, index) => {
  //         return data?.name === rowdaystatus
  //     })
  //     return result[0]?.paidleavetype;
  // }

  // const getFinalPaid = (rowpaid, rowpaidtype) => {
  //     return (rowpaidtype === undefined || rowpaidtype === "") ? rowpaid : (rowpaid + ' - ' + rowpaidtype);
  // }

  // const getAssignLeaveDayForPaid = (rowpaidday) => {
  //     if (rowpaidday === 'Yes - Double Day') {
  //         return '2'
  //     } else if (rowpaidday === 'Yes - Full Day') {
  //         return '1';
  //     } else if (rowpaidday === 'Yes - Half Day') {
  //         return '0.5'
  //     } else {
  //         return '0';
  //     }
  // }

  const getattendancestatus = (alldata) => {
    let result = attStatus.filter((data, index) => {
      return data?.clockinstatus === alldata?.clockinstatus && data?.clockoutstatus === alldata?.clockoutstatus
    })
    return result[0]?.name
  }

  const getAttModeAppliedThr = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus
    })
    return result[0]?.appliedthrough
  }

  const getAttModeLop = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus
    })
    return result[0]?.lop === true ? 'Yes' : 'No';
  }

  const getAttModeLopType = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus
    })
    return result[0]?.loptype
  }

  const getFinalLop = (rowlop, rowloptype) => {
    return (rowloptype === undefined || rowloptype === "") ? rowlop : (rowlop + ' - ' + rowloptype);
  }

  const getAttModeTarget = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus
    })
    return result[0]?.target === true ? 'Yes' : 'No';
  }

  const getAttModePaidPresent = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus
    })
    return result[0]?.paidleave === true ? 'Yes' : 'No';
  }

  const getAttModePaidPresentType = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus
    })
    return result[0]?.paidleavetype;
  }

  const getFinalPaid = (rowpaid, rowpaidtype) => {
    return (rowpaidtype === undefined || rowpaidtype === "") ? rowpaid : (rowpaid + ' - ' + rowpaidtype);
  }

  const getAssignLeaveDayForLop = (rowlopday) => {
    if (rowlopday === 'Yes - Double Day') {
      return '2'
    } else if (rowlopday === 'Yes - Full Day') {
      return '1';
    } else if (rowlopday === 'Yes - Half Day') {
      return '0.5'
    } else {
      return '0';
    }
  }

  const getAssignLeaveDayForPaid = (rowpaidday) => {
    if (rowpaidday === 'Yes - Double Day') {
      return '2'
    } else if (rowpaidday === 'Yes - Full Day') {
      return '1';
    } else if (rowpaidday === 'Yes - Half Day') {
      return '0.5'
    } else {
      return '0';
    }
  }

  const getCount = (rowlopstatus) => {
    if (rowlopstatus === 'Yes - Double Day') {
      return '2'
    } else if (rowlopstatus === 'Yes - Full Day') {
      return '1';
    } else if (rowlopstatus === 'Yes - Half Day') {
      return '0.5'
    } else {
      return '0';
    }
  }

  const getIsWeekoff = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus;
    })
    return result[0]?.weekoff === true ? 'Yes' : 'No';
  }

  const getIsHoliday = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus;
    })
    return result[0]?.holiday === true ? 'Yes' : 'No';
  }

  function getMonthsInRange(month, year) {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const result = [];

    // Previous month
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    result.push({ month: monthNames[prevMonth], year: prevYear.toString() });

    // Current month
    result.push({ month: monthNames[month], year: year.toString() });

    // Next month
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    result.push({ month: monthNames[nextMonth], year: nextYear.toString() });

    return result;
  }


  const fetchUsersFilter = async () => {
    setPageName(!pageName)
    setLoader(true);
    try {
      // let res_usershift = await axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_FOR_MONTH_LOP_CAL_FILTER, {
      //     headers: {
      //         Authorization: `Bearer ${auth.APIToken}`,
      //     },
      //     company: [...valueCompany],
      //     branch: [...valueBranch],
      //     unit: [...valueUnit],
      //     department: [...valueDep],
      //     employee: [...valueEmp],
      //     ismonth: Number(isMonthyear.ismonth.value),
      //     isyear: Number(isMonthyear.isyear.value),
      // });

      let res_emp = await axios.post(SERVICE.USER_FOR_ALL_ATTENDANCE_PAGE_INDIVIDUAL_TYPE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        type: filterUser.filtertype,
        company: [...valueCompany],
        branch: [...valueBranch],
        unit: [...valueUnit],
        team: [...valueTeam],
        employee: [...valueEmp],
        department: [...valueDep],
        assignbranch: accessbranch,
      });

      let res = await axios.get(`${SERVICE.GET_ATTENDANCE_CONTROL_CRITERIA}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let attendanceCriteriaData = res?.data?.attendancecontrolcriteria[0];

      // console.log(res_emp?.data?.users, 'userResult')

      function splitArray(array, chunkSize) {
        const resultarr = [];
        for (let i = 0; i < array.length; i += chunkSize) {
          const chunk = array.slice(i, i + chunkSize);
          resultarr.push({
            data: chunk,
          });
        }
        return resultarr;
      }

      let employeelistnames = res_emp?.data?.users.length > 0 ? [...new Set(res_emp?.data?.users.map(item => item.companyname))] : []
      const resultarr = splitArray(employeelistnames, 10);
      // console.log(resultarr.length, 'resultarr')
      const montharray = getMonthsInRange((Number(isMonthyear.ismonth.value) - 1), Number(isMonthyear.isyear.value));
      console.log(isMonthyear.ismonth.value, isMonthyear.isyear.value)
      console.log(montharray, 'montharray')
      let leaveresult = [];
      async function sendBatchRequest(batch) {
        try {

          let res_applyleave = await axios.post(SERVICE.APPLYLEAVE_APPROVED, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            employee: batch.data,
          });

          let leaveresult = res_applyleave?.data?.applyleaves?.filter(data => data.leavetype !== 'Leave Without Pay (LWP)');
          let leaveresultWithoutPay = res_applyleave?.data?.applyleaves?.filter(data => data.leavetype === 'Leave Without Pay (LWP)');

          let res = await axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_FOR_MONTH_LOP_CAL_FILTER, {
            employee: batch.data,
            ismonth: Number(isMonthyear.ismonth.value),
            isyear: Number(isMonthyear.isyear.value),
            montharray: [...montharray],
            department: [...valueDep],
          }, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            }
          })

          let res_type = await axios.get(SERVICE.LEAVETYPE, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          });

          let resdatawithlwp = [...res_type?.data?.leavetype, { leavetype: 'Leave Without Pay (LWP)', code: "LWP" }]

          let leavestatusApproved = [];
          resdatawithlwp?.map((type) => {
            res_applyleave?.data?.applyleaves && res_applyleave?.data?.applyleaves?.forEach((d) => {
              if (type.leavetype === d.leavetype && d.tookleavecheckstatus === 'Single' && d.leavestatus === 'Shift') {
                leavestatusApproved.push(type.code + ' ' + d.status)
              }
              if (type.leavetype === d.leavetype && d.tookleavecheckstatus === 'Double' && d.leavestatus === 'Shift') {
                leavestatusApproved.push('DL' + ' - ' + type.code + ' ' + d.status)
              }
              if (type.leavetype === d.leavetype && d.tookleavecheckstatus === 'Double Day' && d.leavestatus === 'Shift') {
                leavestatusApproved.push('DDL' + ' - ' + type.code + ' ' + d.status)
              }
            });
          });

          const rearr = [...new Set(leavestatusApproved)];

          // console.log(rearr, 'rearr')

          // let filteredBatch = valueDep.length > 0 ? (res?.data?.finaluser?.filter((data) => valueDep.includes(data.department))) : res?.data?.finaluser;
          // console.log(filteredBatch, 'filteredBatch')
          // console.log(res?.data?.finaluser, 'res?.data?.finaluser')
          const filtered = res?.data?.finaluser?.filter(d => {
            const [day, month, year] = d.rowformattedDate.split("/");
            const formattedDate = new Date(`${year}-${month}-${day}`);
            const reasonDate = new Date(d.reasondate);
            const dojDate = new Date(d.doj);

            if (d.reasondate && d.reasondate !== "") {
              return (formattedDate <= reasonDate);
            } else if (d.doj && d.doj !== "") {
              return (formattedDate >= dojDate);
            } else {
              return d;
            }
          });

          const changedWeekoffResult = filtered?.map((item) => {

            // Adjust clockinstatus based on lateclockincount
            let updatedClockInStatus = item.clockinstatus;
            // Adjust clockoutstatus based on earlyclockoutcount
            let updatedClockOutStatus = item.clockoutstatus;

            // Filter out only 'Absent' items for the current employee
            const absentItems = filtered?.filter(d => d.clockinstatus === 'Absent' && d.clockoutstatus === 'Absent' && item.empcode === d.empcode && d.clockin === '00:00:00' && d.clockout === '00:00:00' && item.attendanceautostatus === 'ABSENT');

            // Check if the day before and after a 'Week Off' date is marked as 'Leave' or 'Absent'
            if (item.clockinstatus === 'Week Off' && item.clockoutstatus === 'Week Off') {
              // Define the date format for comparison
              const itemDate = moment(item.rowformattedDate, "DD/MM/YYYY");

              const isPreviousDayLeave = leaveresult.some(leaveItem => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, 'days'), 'day') && leaveItem.empcode === item.empcode);
              const isPreviousDayAbsent = absentItems.some(absentItem => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, 'days'), 'day') && absentItem.empcode === item.empcode);

              const isNextDayLeave = leaveresult.some(leaveItem => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().add(1, 'days'), 'day') && leaveItem.empcode === item.empcode);
              const isNextDayAbsent = absentItems.some(absentItem => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().add(1, 'days'), 'day') && absentItem.empcode === item.empcode);

              const isPreviousDayLeaveWithoutPay = leaveresultWithoutPay.some(leaveItem => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, 'days'), 'day') && leaveItem.empcode === item.empcode);
              const isNextDayLeaveWithoutPay = leaveresultWithoutPay.some(leaveItem => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().add(1, 'days'), 'day') && leaveItem.empcode === item.empcode);

              if (isPreviousDayLeave) {
                updatedClockInStatus = 'BeforeWeekOffLeave';
                updatedClockOutStatus = 'BeforeWeekOffLeave';
              }
              if (isPreviousDayAbsent) {
                updatedClockInStatus = 'BeforeWeekOffAbsent';
                updatedClockOutStatus = 'BeforeWeekOffAbsent';
              }
              if (isPreviousDayLeaveWithoutPay) {
                updatedClockInStatus = 'BeforeWeekOffAbsent';
                updatedClockOutStatus = 'BeforeWeekOffAbsent';
              }
              if (isNextDayLeave) {
                updatedClockInStatus = 'AfterWeekOffLeave';
                updatedClockOutStatus = 'AfterWeekOffLeave';
              }
              if (isNextDayAbsent) {
                updatedClockInStatus = 'AfterWeekOffAbsent';
                updatedClockOutStatus = 'AfterWeekOffAbsent';
              }
              if (isNextDayLeaveWithoutPay) {
                updatedClockInStatus = 'AfterWeekOffAbsent';
                updatedClockOutStatus = 'AfterWeekOffAbsent';
              }

              if (isPreviousDayLeave && isNextDayLeave) {
                updatedClockInStatus = "BeforeAndAfterWeekOffLeave";
                updatedClockOutStatus = "BeforeAndAfterWeekOffLeave";
              }
              // console.log(isPreviousDayAbsent && isNextDayAbsent, 'isPreviousDayAbsent && isNextDayAbsent')
              if (isPreviousDayAbsent && isNextDayAbsent) {
                updatedClockInStatus = "BeforeAndAfterWeekOffAbsent";
                updatedClockOutStatus = "BeforeAndAfterWeekOffAbsent";
              }
              if (isPreviousDayLeaveWithoutPay && isNextDayLeaveWithoutPay) {
                updatedClockInStatus = "BeforeAndAfterWeekOffAbsent";
                updatedClockOutStatus = "BeforeAndAfterWeekOffAbsent";
              }
            }

            return {
              ...item,
              clockinstatus: updatedClockInStatus,
              clockoutstatus: updatedClockOutStatus,
            };
          });
          // console.log(changedWeekoffResult, 'changedWeekoffResult')
          const resultBefore = [];

          const empGrouped = {};

          changedWeekoffResult.forEach(item => {
            if (!empGrouped[item.empcode]) empGrouped[item.empcode] = [];
            empGrouped[item.empcode].push(item);
          });

          const leaveStatuses = [
            ...rearr,
            "Absent", "BL - Absent",
          ];

          // console.log(leaveStatuses, 'leaveStatuses')
          Object.keys(empGrouped).forEach(empcode => {
            const records = empGrouped[empcode]
              .sort((a, b) => moment(a.rowformattedDate, "DD/MM/YYYY") - moment(b.rowformattedDate, "DD/MM/YYYY"));

            let streak = [];
            let counterIn = 1;
            let counterOut = 1;

            for (let i = 0; i < records.length; i++) {
              const current = records[i];
              const isWeekOff = current.shift === "Week Off";

              const isLeaveDay =
                current.clockin === "00:00:00" &&
                current.clockout === "00:00:00" &&
                leaveStatuses.includes(current.clockinstatus) &&
                !isWeekOff;

              if (isLeaveDay) {
                streak.push(current);
              } else if (isWeekOff) {
                // Push Week Off directly, don’t reset streak
                resultBefore.push(current);
              } else {
                // Encountered present day, finalize streak
                if (streak.length > attendanceCriteriaData?.longabsentcount) {
                  streak.forEach(day => {
                    let clockinstatus = day.clockinstatus;
                    let clockoutstatus = day.clockoutstatus;

                    if (clockinstatus === "Absent") {
                      clockinstatus = `${counterIn++}Long Absent`;
                    } else if (clockinstatus === "BL - Absent") {
                      clockinstatus = `${counterIn++}Long BL - Absent`;
                    } else if (rearr?.includes(clockinstatus)) {
                      clockinstatus = `${counterIn++}Long Leave ${rearr?.filter(d => d === clockinstatus)}`;
                    }

                    if (clockoutstatus === "Absent") {
                      clockoutstatus = `${counterOut++}Long Absent`;
                    } else if (clockoutstatus === "BL - Absent") {
                      clockoutstatus = `${counterOut++}Long BL - Absent`;
                    } else if (rearr?.includes(clockoutstatus)) {
                      clockoutstatus = `${counterOut++}Long Leave ${rearr?.filter(d => d === clockoutstatus)}`;
                    }

                    resultBefore.push({
                      ...day,
                      clockinstatus,
                      clockoutstatus
                    });
                  });
                } else {
                  resultBefore.push(...streak); // push as-is
                }

                resultBefore.push(current); // current present day
                streak = [];
                counterIn = 1;
                counterOut = 1;
              }
            }

            // Remaining streak at end
            if (streak.length > attendanceCriteriaData?.longabsentcount) {
              streak.forEach(day => {
                let clockinstatus = day.clockinstatus;
                let clockoutstatus = day.clockoutstatus;

                if (clockinstatus === "Absent") {
                  clockinstatus = `${counterIn++}Long Absent`;
                } else if (clockinstatus === "BL - Absent") {
                  clockinstatus = `${counterIn++}Long BL - Absent`;
                } else if (rearr?.includes(clockinstatus)) {
                  clockinstatus = `${counterIn++}Long Leave ${rearr?.filter(d => d === clockinstatus)}`;
                }

                if (clockoutstatus === "Absent") {
                  clockoutstatus = `${counterOut++}Long Absent`;
                } else if (clockoutstatus === "BL - Absent") {
                  clockoutstatus = `${counterOut++}Long BL - Absent`;
                } else if (rearr?.includes(clockoutstatus)) {
                  clockoutstatus = `${counterOut++}Long Leave ${rearr?.filter(d => d === clockoutstatus)}`;
                }

                resultBefore.push({
                  ...day,
                  clockinstatus,
                  clockoutstatus
                });
              });
            } else {
              resultBefore.push(...streak);
            }
          });
          resultBefore.sort((a, b) => moment(a.rowformattedDate, "DD/MM/YYYY") - moment(b.rowformattedDate, "DD/MM/YYYY"));
          // console.log(resultBefore, 'resultBefore');

          // let countByEmpcodeClockin = {}; // Object to store count for each empcode
          // let countByEmpcodeClockout = {};

          // const result = resultBefore?.map((item) => {
          //     // Initialize count for empcode if not already present
          //     if (!countByEmpcodeClockin[item.empcode]) {
          //         countByEmpcodeClockin[item.empcode] = 1;
          //     }
          //     if (!countByEmpcodeClockout[item.empcode]) {
          //         countByEmpcodeClockout[item.empcode] = 1;
          //     }

          //     // Adjust clockinstatus based on lateclockincount
          //     let updatedClockInStatus = item.clockinstatus;
          //     // Adjust clockoutstatus based on earlyclockoutcount
          //     let updatedClockOutStatus = item.clockoutstatus;

          //     // Check if 'Late - ClockIn' count exceeds the specified limit
          //     if (updatedClockInStatus === 'Late - ClockIn') {
          //         updatedClockInStatus = `${countByEmpcodeClockin[item.empcode]}Late - ClockIn`;
          //         countByEmpcodeClockin[item.empcode]++; // Increment count for current empcode
          //     }
          //     // Check if 'Early - ClockOut' count exceeds the specified limit
          //     if (updatedClockOutStatus === 'Early - ClockOut') {
          //         updatedClockOutStatus = `${countByEmpcodeClockout[item.empcode]}Early - ClockOut`;
          //         countByEmpcodeClockout[item.empcode]++; // Increment count for current empcode
          //     }

          //     return {
          //         ...item,
          //         shiftallot: item.shiftallot,
          //         weekOffDates: item.weekOffDates,
          //         clockinstatus: updatedClockInStatus,
          //         clockoutstatus: updatedClockOutStatus,
          //     }
          // });

          // Group data by empcode
          let groupedData = {};
          resultBefore.forEach((item) => {
            if (!groupedData[item.empcode]) {
              groupedData[item.empcode] = {
                attendanceRecords: [],
                departmentDateSet: item.departmentDateSet || [],
              };
            }
            groupedData[item.empcode].attendanceRecords.push(item);
          });
          console.log(groupedData, 'groupedData')
          let result = [];

          for (let empcode in groupedData) {
            let { attendanceRecords, departmentDateSet } = groupedData[empcode];

            departmentDateSet.forEach((dateRange) => {
              let { fromdate, todate, department, monthname, year } = dateRange;

              let countByEmpcodeClockin = {};
              let countByEmpcodeClockout = {};

              let recordsInDateRange = attendanceRecords.filter((record) => {
                let formattedDate = new Date(record.finalDate);
                return department === record.department && formattedDate >= new Date(fromdate) && formattedDate <= new Date(todate);
              });

              let processedRecords = recordsInDateRange.map((item) => {
                let formattedDate = new Date(item.finalDate);
                let reasonDate = item.reasondate ? new Date(item.reasondate) : null;
                let dojDate = item.doj ? new Date(item.doj) : null;

                let updatedClockInStatus = item.clockinstatus;
                let updatedClockOutStatus = item.clockoutstatus;

                // Check if the date falls within the reasonDate or dojDate
                if (reasonDate && formattedDate <= reasonDate) {
                  return null;
                }
                if (dojDate && formattedDate < dojDate) {
                  return null;
                }

                // Handling Late Clock-in and Early Clock-out
                if (!countByEmpcodeClockin[item.empcode]) {
                  countByEmpcodeClockin[item.empcode] = 1;
                }
                if (!countByEmpcodeClockout[item.empcode]) {
                  countByEmpcodeClockout[item.empcode] = 1;
                }

                if (updatedClockInStatus === "Late - ClockIn") {
                  updatedClockInStatus = `${countByEmpcodeClockin[item.empcode]}Late - ClockIn`;
                  countByEmpcodeClockin[item.empcode]++;
                }

                if (updatedClockOutStatus === "Early - ClockOut") {
                  updatedClockOutStatus = `${countByEmpcodeClockout[item.empcode]}Early - ClockOut`;
                  countByEmpcodeClockout[item.empcode]++;
                }

                return {
                  ...item,
                  department,
                  fromdate,
                  todate,
                  monthname,
                  year,
                  clockinstatus: updatedClockInStatus,
                  clockoutstatus: updatedClockOutStatus,
                };
              });

              result.push(...processedRecords.filter(Boolean));
            });
          }

          // console.log(result, 'result')
          const itemsWithSerialNumber = result?.map((item) => (
            {
              ...item,
              totalnumberofdays: item.totalnumberofdays,
              empshiftdays: item.empshiftdays,
              totalcounttillcurrendate: item.totalcounttillcurrendate,
              totalshift: item.totalshift,
              attendanceauto: getattendancestatus(item),
              daystatus: item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item),
              appliedthrough: getAttModeAppliedThr(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
              lop: getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
              loptype: getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
              lopcalculation: getFinalLop(
                getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
                getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item))
              ),
              lopcount: getCount(
                getFinalLop(
                  getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
                  getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item))
                )
              ),
              modetarget: getAttModeTarget(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
              paidpresentbefore: getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
              paidleavetype: getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
              paidpresent: getFinalPaid(
                getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
                getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item))
              ),
              lopday: getAssignLeaveDayForLop(
                getFinalLop(
                  getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
                  getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item))
                )
              ),
              paidpresentday: getAssignLeaveDayForPaid(
                getFinalPaid(
                  getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
                  getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item))
                )
              ),
              isweekoff: getIsWeekoff(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
              isholiday: getIsHoliday(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
            }));

          console.log(itemsWithSerialNumber, 'itemsWithSerialNumber bef')
          const weekOption = ['BeforeWeekOffAbsent', 'AfterWeekOffAbsent', 'BeforeWeekOffLeave', 'AfterWeekOffLeave', 'BeforeAndAfterWeekOffAbsent', 'BeforeAndAfterWeekOffLeave'];
          // itemsWithSerialNumber.forEach((item, index, array) => {
          //     if (attStatusOption.includes(item.daystatus) && item.clockin === "00:00:00" && item.clockout === "00:00:00" && item.paidpresent === "Yes - Full Day") {
          //         const previousItem = array[index - 1];
          //         const nextItem = array[index + 1];

          //         const hasRelevantStatus = (entry) => entry && (weekOption.includes(entry.clockinstatus) || weekOption.includes(entry.clockoutstatus) && entry.shift === "Week Off");

          //         // if (hasRelevantStatus(previousItem)) {
          //         //     previousItem.clockinstatus = 'Week Off';
          //         //     previousItem.clockoutstatus = 'Week Off';
          //         //     previousItem.attendanceauto = getattendancestatus(previousItem);
          //         //     previousItem.daystatus = previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem);
          //         // }
          //         // if (hasRelevantStatus(nextItem)) {
          //         //     nextItem.clockinstatus = 'Week Off';
          //         //     nextItem.clockoutstatus = 'Week Off';
          //         //     nextItem.attendanceauto = getattendancestatus(nextItem);
          //         //     nextItem.daystatus = nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem);
          //         // }
          //         if (hasRelevantStatus(previousItem)) {
          //             previousItem.clockinstatus = 'Week Off';
          //             previousItem.clockoutstatus = 'Week Off';
          //             previousItem.attendanceauto = getattendancestatus(previousItem);
          //             previousItem.daystatus = previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem);
          //             previousItem.appliedthrough = getAttModeAppliedThr(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
          //             previousItem.lop = getAttModeLop(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
          //             previousItem.loptype = getAttModeLopType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
          //             previousItem.lopcalculation = getFinalLop(
          //                 getAttModeLop(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)),
          //                 getAttModeLopType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem))
          //             );
          //             previousItem.lopcount = getCount(
          //                 getFinalLop(
          //                     getAttModeLop(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)),
          //                     getAttModeLopType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem))
          //                 )
          //             );
          //             previousItem.modetarget = getAttModeTarget(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
          //             previousItem.paidpresentbefore = getAttModePaidPresent(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
          //             previousItem.paidleavetype = getAttModePaidPresentType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
          //             previousItem.paidpresent = getFinalPaid(
          //                 getAttModePaidPresent(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)),
          //                 getAttModePaidPresentType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem))
          //             );
          //             previousItem.lopday = getAssignLeaveDayForLop(
          //                 getFinalLop(
          //                     getAttModeLop(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)),
          //                     getAttModeLopType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem))
          //                 )
          //             );
          //             previousItem.paidpresentday = getAssignLeaveDayForPaid(
          //                 getFinalPaid(
          //                     getAttModePaidPresent(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)),
          //                     getAttModePaidPresentType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem))
          //                 )
          //             );
          //             previousItem.isweekoff = getIsWeekoff(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
          //             previousItem.isholiday = getIsHoliday(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
          //         }
          //         if (hasRelevantStatus(nextItem)) {
          //             nextItem.clockinstatus = 'Week Off';
          //             nextItem.clockoutstatus = 'Week Off';
          //             nextItem.attendanceauto = getattendancestatus(nextItem);
          //             nextItem.daystatus = nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem);
          //             nextItem.appliedthrough = getAttModeAppliedThr(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
          //             nextItem.lop = getAttModeLop(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
          //             nextItem.loptype = getAttModeLopType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
          //             nextItem.lopcalculation = getFinalLop(
          //                 getAttModeLop(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)),
          //                 getAttModeLopType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem))
          //             );
          //             nextItem.lopcount = getCount(
          //                 getFinalLop(
          //                     getAttModeLop(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)),
          //                     getAttModeLopType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem))
          //                 )
          //             );
          //             nextItem.modetarget = getAttModeTarget(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
          //             nextItem.paidpresentbefore = getAttModePaidPresent(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
          //             nextItem.paidleavetype = getAttModePaidPresentType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
          //             nextItem.paidpresent = getFinalPaid(
          //                 getAttModePaidPresent(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)),
          //                 getAttModePaidPresentType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem))
          //             );
          //             nextItem.lopday = getAssignLeaveDayForLop(
          //                 getFinalLop(
          //                     getAttModeLop(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)),
          //                     getAttModeLopType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem))
          //                 )
          //             );
          //             nextItem.paidpresentday = getAssignLeaveDayForPaid(
          //                 getFinalPaid(
          //                     getAttModePaidPresent(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)),
          //                     getAttModePaidPresentType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem))
          //                 )
          //             );
          //             nextItem.isweekoff = getIsWeekoff(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
          //             nextItem.isholiday = getIsHoliday(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
          //         }
          //     }
          // })

          itemsWithSerialNumber.forEach((item, index, array) => {
            const previousItem = array[index - 1];
            const nextItem = array[index + 1];

            if (item.shift === 'Week Off') {

              const isLopRelevant = (entry) => entry && (entry.lopcalculation === 'Yes - Full Day' || entry.lopcalculation === 'Yes - Double Day');

              const isPreviousManualPaidFull =
                previousItem &&
                previousItem.appliedthrough === 'Manual' &&
                previousItem.paidpresent === 'Yes - Full Day';

              const isNextManualPaidFull =
                nextItem &&
                nextItem.appliedthrough === 'Manual' &&
                nextItem.paidpresent === 'Yes - Full Day';

              const isPrevLop = isLopRelevant(previousItem) && !isPreviousManualPaidFull;
              const isNextLop = isLopRelevant(nextItem) && !isNextManualPaidFull;

              if (isPrevLop && isNextLop) {
                item.clockinstatus = 'BeforeAndAfterWeekOffAbsent';
                item.clockoutstatus = 'BeforeAndAfterWeekOffAbsent';
              } else if (isPrevLop) {
                item.clockinstatus = 'BeforeWeekOffAbsent';
                item.clockoutstatus = 'BeforeWeekOffAbsent';
              } else if (isNextLop) {
                item.clockinstatus = 'AfterWeekOffAbsent';
                item.clockoutstatus = 'AfterWeekOffAbsent';
              }

              // Recalculate attendance status if needed
              item.attendanceauto = getattendancestatus(item);
              item.daystatus = item.attendanceautostatus || getattendancestatus(item);
              item.appliedthrough = getAttModeAppliedThr(item.attendanceautostatus || getattendancestatus(item));
              item.lop = getAttModeLop(item.attendanceautostatus || getattendancestatus(item));
              item.loptype = getAttModeLopType(item.attendanceautostatus || getattendancestatus(item));
              item.lopcalculation = getFinalLop(
                getAttModeLop(item.attendanceautostatus || getattendancestatus(item)),
                getAttModeLopType(item.attendanceautostatus || getattendancestatus(item))
              );
              item.lopcount = getCount(
                getFinalLop(
                  getAttModeLop(item.attendanceautostatus || getattendancestatus(item)),
                  getAttModeLopType(item.attendanceautostatus || getattendancestatus(item))
                )
              );
              item.modetarget = getAttModeTarget(item.attendanceautostatus || getattendancestatus(item));
              item.paidpresentbefore = getAttModePaidPresent(item.attendanceautostatus || getattendancestatus(item));
              item.paidleavetype = getAttModePaidPresentType(item.attendanceautostatus || getattendancestatus(item));
              item.paidpresent = getFinalPaid(
                getAttModePaidPresent(item.attendanceautostatus || getattendancestatus(item)),
                getAttModePaidPresentType(item.attendanceautostatus || getattendancestatus(item))
              );
              item.lopday = getAssignLeaveDayForLop(
                getFinalLop(
                  getAttModeLop(item.attendanceautostatus || getattendancestatus(item)),
                  getAttModeLopType(item.attendanceautostatus || getattendancestatus(item))
                )
              );
              item.paidpresentday = getAssignLeaveDayForPaid(
                getFinalPaid(
                  getAttModePaidPresent(item.attendanceautostatus || getattendancestatus(item)),
                  getAttModePaidPresentType(item.attendanceautostatus || getattendancestatus(item))
                )
              );
              item.isweekoff = getIsWeekoff(item.attendanceautostatus || getattendancestatus(item));
              item.isholiday = getIsHoliday(item.attendanceautostatus || getattendancestatus(item));

            }
            if (attStatusOption.includes(item.daystatus) && item.clockin === "00:00:00" && item.clockout === "00:00:00" && item.appliedthrough === 'Manual' && item.paidpresent === "Yes - Full Day") {

              const hasRelevantStatus = (entry) => entry && ((weekOption.includes(entry.clockinstatus) || weekOption.includes(entry.clockoutstatus)) && entry.shift === 'Week Off');

              if (hasRelevantStatus(previousItem)) {
                if (!weekOption.includes(previousItem.clockinstatus)) {
                  previousItem.clockinstatus = 'Week Off';
                  previousItem.clockoutstatus = 'Week Off';
                  previousItem.attendanceauto = getattendancestatus(previousItem);
                  previousItem.daystatus = previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem);
                  previousItem.appliedthrough = getAttModeAppliedThr(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                  previousItem.lop = getAttModeLop(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                  previousItem.loptype = getAttModeLopType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                  previousItem.lopcalculation = getFinalLop(
                    getAttModeLop(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)),
                    getAttModeLopType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem))
                  );
                  previousItem.lopcount = getCount(
                    getFinalLop(
                      getAttModeLop(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)),
                      getAttModeLopType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem))
                    )
                  );
                  previousItem.modetarget = getAttModeTarget(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                  previousItem.paidpresentbefore = getAttModePaidPresent(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                  previousItem.paidleavetype = getAttModePaidPresentType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                  previousItem.paidpresent = getFinalPaid(
                    getAttModePaidPresent(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)),
                    getAttModePaidPresentType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem))
                  );
                  previousItem.lopday = getAssignLeaveDayForLop(
                    getFinalLop(
                      getAttModeLop(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)),
                      getAttModeLopType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem))
                    )
                  );
                  previousItem.paidpresentday = getAssignLeaveDayForPaid(
                    getFinalPaid(
                      getAttModePaidPresent(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)),
                      getAttModePaidPresentType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem))
                    )
                  );
                  previousItem.isweekoff = getIsWeekoff(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                  previousItem.isholiday = getIsHoliday(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                }
              }
              if (hasRelevantStatus(nextItem)) {
                if (!weekOption.includes(nextItem.clockinstatus)) {
                  nextItem.clockinstatus = 'Week Off';
                  nextItem.clockoutstatus = 'Week Off';
                  nextItem.attendanceauto = getattendancestatus(nextItem);
                  nextItem.daystatus = nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem);
                  nextItem.appliedthrough = getAttModeAppliedThr(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                  nextItem.lop = getAttModeLop(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                  nextItem.loptype = getAttModeLopType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                  nextItem.lopcalculation = getFinalLop(
                    getAttModeLop(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)),
                    getAttModeLopType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem))
                  );
                  nextItem.lopcount = getCount(
                    getFinalLop(
                      getAttModeLop(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)),
                      getAttModeLopType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem))
                    )
                  );
                  nextItem.modetarget = getAttModeTarget(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                  nextItem.paidpresentbefore = getAttModePaidPresent(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                  nextItem.paidleavetype = getAttModePaidPresentType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                  nextItem.paidpresent = getFinalPaid(
                    getAttModePaidPresent(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)),
                    getAttModePaidPresentType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem))
                  );
                  nextItem.lopday = getAssignLeaveDayForLop(
                    getFinalLop(
                      getAttModeLop(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)),
                      getAttModeLopType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem))
                    )
                  );
                  nextItem.paidpresentday = getAssignLeaveDayForPaid(
                    getFinalPaid(
                      getAttModePaidPresent(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)),
                      getAttModePaidPresentType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem))
                    )
                  );
                  nextItem.isweekoff = getIsWeekoff(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                  nextItem.isholiday = getIsHoliday(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                }
              }
            }
          })

          let fianlResult = itemsWithSerialNumber.filter((data) => Number(data.year) === Number(isMonthyear.isyear.value) && data.monthname === monthstring[Number(isMonthyear.ismonth.value) - 1])

          console.log(fianlResult, 'fianlResult')

          return fianlResult;

        } catch (err) {
          console.error("Error in POST request for batch:", batch.data, err);
        }
      }

      async function getAllResults() {
        let allResults = [];
        for (let batch of resultarr) {
          const finaldata = await sendBatchRequest(batch);
          allResults = allResults.concat(finaldata);
        }

        return { allResults }; // Return both results as an object
      }

      getAllResults().then(async (results) => {
        // console.log(results.length)

        // const grouped = results.allResults.reduce((acc, item) => {
        //     if (!acc[item.empcode]) acc[item.empcode] = [];
        //     acc[item.empcode].push(item);
        //     return acc;
        // }, {});

        // const trimmed = Object.values(grouped).flatMap(group => {
        //     if (group.length <= 2) return []; // skip groups with 2 or fewer items
        //     return group.slice(1, -1); // remove first and last
        // });

        // console.log(trimmed, 'trimmed');

        const finalresult = [];

        results.allResults?.forEach(item => {
          // console.log(item, 'item')

          const leaveOnDateApproved = leaveresult.find((d) => d.date === item.rowformattedDate && d.empcode === item.empcode);

          // let weekoffdayscount = 0;
          // if (item.clockin === '00:00:00' && item.clockout === '00:00:00') {
          //     if (item.clockinstatus === 'Week Off' && item.clockoutstatus === 'Week Off' && item.appliedthrough === 'Auto') {
          //         weekoffdayscount = 1;
          //     }
          //     if (item.appliedthrough === 'Manual' && item.lopcalculation !== 'Yes - Full Day' && ['WEEKOFF', 'MWEEKOFF'].includes(item.daystatus)) {
          //         weekoffdayscount = 1;
          //     }
          //     if (item.clockinstatus === 'Absent' && item.clockoutstatus === 'Absent' && item.appliedthrough === 'Manual' && item.lopcalculation !== 'Yes - Full Day' && ['WEEKOFF', 'MWEEKOFF'].includes(item.daystatus)) {
          //         weekoffdayscount = 1;
          //     }
          // }

          // let holidaydayscount = 0;
          // if (item.clockinstatus === 'Holiday' && item.clockoutstatus === 'Holiday') {
          //     if (item.clockinstatus === 'Holiday' && item.clockoutstatus === 'Holiday' && item.appliedthrough === 'Auto') {
          //         holidaydayscount = 1;
          //     }
          //     if (item.clockinstatus === 'Holiday' && item.clockoutstatus === 'Holiday' && item.appliedthrough === 'Manual' && item.lopcalculation !== 'Yes - Full Day' && ['HOLIDAY', 'MHOLIDAY'].includes(item.daystatus)) {
          //         holidaydayscount = 1;
          //     }
          //     if (item.clockinstatus === 'Absent' && item.clockoutstatus === 'Absent' && item.appliedthrough === 'Manual' && item.lopcalculation !== 'Yes - Full Day' && ['HOLIDAY', 'MHOLIDAY'].includes(item.daystatus)) {
          //         holidaydayscount = 1;
          //     }
          // }

          let weekoffdayscount = 0;
          if (item.isweekoff === 'Yes') {
            // if (item.appliedthrough === 'Auto') {
            //     weekoffdayscount = item.paidpresent === "Yes - Full Day" ? 1 : 0.5;
            // }
            // if (item.appliedthrough === 'Manual' && item.lopcalculation !== 'Yes - Full Day') {
            weekoffdayscount = item.paidpresent === "Yes - Full Day" ? 1 : 0.5;
            // }
          }

          let holidaydayscount = 0;
          if (item.isholiday === 'Yes') {
            // if (item.appliedthrough === 'Auto') {
            //     holidaydayscount = item.paidpresent === "Yes - Full Day" ? 1 : 0.5;
            // }
            // if (item.appliedthrough === 'Manual' && item.lopcalculation !== 'Yes - Full Day') {
            holidaydayscount = item.paidpresent === "Yes - Full Day" ? 1 : 0.5;
            // }
          }

          const existingEntryIndex = finalresult.findIndex(entry => entry.empcode === item.empcode);

          if (existingEntryIndex !== -1) {

            if (item.shift !== 'Not Allotted') {
              finalresult[existingEntryIndex].shift++;
            }

            // if (item.clockin === '00:00:00' && item.clockout === '00:00:00') {
            //     if (item.clockinstatus === 'Week Off' && item.clockoutstatus === 'Week Off' && item.appliedthrough === 'Auto') {
            //         finalresult[existingEntryIndex].weekoff++;
            //     }
            //     if (item.clockinstatus === 'Week Off' && item.clockoutstatus === 'Week Off' && item.appliedthrough === 'Manual' && item.lopcalculation !== 'Yes - Full Day' && ['WEEKOFF', 'MWEEKOFF'].includes(item.daystatus)) {
            //         finalresult[existingEntryIndex].weekoff++;
            //     }
            //     if (item.clockinstatus === 'Absent' && item.clockoutstatus === 'Absent' && item.appliedthrough === 'Manual' && item.lopcalculation !== 'Yes - Full Day' && ['WEEKOFF', 'MWEEKOFF'].includes(item.daystatus)) {
            //         finalresult[existingEntryIndex].weekoff++;
            //     }
            // }

            // if (item.clockinstatus === 'Holiday' && item.clockoutstatus === 'Holiday') {
            //     if (item.clockinstatus === 'Holiday' && item.clockoutstatus === 'Holiday' && item.appliedthrough === 'Auto') {

            //     }
            //     if (item.clockinstatus === 'Holiday' && item.clockoutstatus === 'Holiday' && item.appliedthrough === 'Manual' && item.lopcalculation !== 'Yes - Full Day' && ['HOLIDAY', 'MHOLIDAY'].includes(item.daystatus)) {
            //         finalresult[existingEntryIndex].holidayCount++;
            //     }
            //     if (item.clockinstatus === 'Absent' && item.clockoutstatus === 'Absent' && item.appliedthrough === 'Manual' && item.lopcalculation !== 'Yes - Full Day' && ['HOLIDAY', 'MHOLIDAY'].includes(item.daystatus)) {
            //         finalresult[existingEntryIndex].holidayCount++;
            //     }
            // }

            if (item.isweekoff === 'Yes') {
              // if (item.appliedthrough === 'Auto') {
              //     finalresult[existingEntryIndex].weekoff++;
              // }
              // if (item.appliedthrough === 'Manual' && item.lopcalculation !== 'Yes - Full Day') {
              finalresult[existingEntryIndex].weekoff++;
              // }
            }

            if (item.isholiday === 'Yes') {
              // if (item.appliedthrough === 'Auto') {
              //     finalresult[existingEntryIndex].holidayCount++;
              // }
              // if (item.appliedthrough === 'Manual' && item.lopcalculation !== 'Yes - Full Day') {
              finalresult[existingEntryIndex].holidayCount++;
              // }
            }

            if (leaveOnDateApproved) {
              finalresult[existingEntryIndex].leaveCount++;
            }

            if (item.clockinstatus !== 'Not Allotted' && item.clockoutstatus !== 'Not Allotted' && item.attendanceauto === undefined && item.daystatus === undefined) {
              finalresult[existingEntryIndex].nostatuscount++;
            }

            if (item.lopcalculation === 'Yes - Double Day') {
              finalresult[existingEntryIndex].doublelopcount++;
            }

            if (item.lopcalculation === 'Yes - Double Half Day') {
              finalresult[existingEntryIndex].doublehalflopcount++;
            }

            finalresult[existingEntryIndex].lopcount = String(parseFloat(finalresult[existingEntryIndex].lopcount) + parseFloat(item.lopcount));
            finalresult[existingEntryIndex].paidpresentday = String(parseFloat(finalresult[existingEntryIndex].paidpresentday) + parseFloat(item.paidpresentday));

          } else {

            const newItem = {
              id: item.id,
              empcode: item.empcode,
              username: item.username,
              company: item.company,
              branch: item.branch,
              unit: item.unit,
              team: item.team,
              department: item.department,
              totalnumberofdays: item.totalnumberofdays,
              empshiftdays: item.empshiftdays,
              shift: item.shift !== 'Not Allotted' ? 1 : 0,
              // weekoff: (item.clockinstatus === 'Week Off' && item.clockoutstatus === 'Week Off' && item.clockin === '00:00:00' && item.clockout === '00:00:00') ? 1 : 0,
              weekoff: weekoffdayscount,
              lopcount: item.lopcount,
              paidpresentday: item.paidpresentday,
              totalcounttillcurrendate: item.totalcounttillcurrendate,
              totalshift: item.totalshift,
              // holidayCount: (item.clockinstatus === 'Holiday' && item.clockoutstatus === 'Holiday') ? 1 : 0,
              holidayCount: holidaydayscount,
              leaveCount: leaveOnDateApproved ? 1 : 0,
              clsl: 0,
              // holiday: 0,
              totalpaiddays: 0,
              nostatus: 0,
              nostatuscount: (item.clockinstatus !== 'Not Allotted' && item.clockoutstatus !== 'Not Allotted' && item.paidpresent === 'No' && item.modetarget === 'No' && item.lopcalculation === 'No') ? 1 : 0,
              doublelopcount: item.lopcalculation === "Yes - Double Day" ? 1 : 0,
              doublehalflopcount: item.lopcalculation === "Double Half Day" ? 0.5 : 0,
            };

            finalresult.push(newItem);
          }
        });
        // console.log(finalresult, 'newItem')
        let resultdata = finalresult?.map((item, index) => {
          const finalPaidPresentDays = Number(item.paidpresentday) - (Number(item.weekoff) + Number(item.holidayCount) + Number(item.leaveCount) + Number(item.doublelopcount) + Number(item.doublehalflopcount));
          // console.log(item.paidpresentday, finalPaidPresentDays, 'item.paidpresentday')
          // console.log(item.weekoff, 'item.weekoff')
          // console.log(item.holidayCount, 'item.holidayCount')
          // console.log(item.leaveCount, 'item.leaveCount')
          // console.log(item.doublelopcount, 'item.doublelopcount')
          // console.log(item.doublehalflopcount, 'item.doublehalflopcount')
          // console.log(item.shift, 'item.shift')
          // console.log(item.lopcount - (Number(item.doublelopcount) + Number(item.doublehalflopcount)), 'item.lopcount')

          return {
            ...item,
            serialNumber: index + 1,
            totalnumberofdays: Number(item.totalnumberofdays),
            lopcount: Number(item.lopcount),
            clsl: item.leaveCount,
            paidpresentday: finalPaidPresentDays,
            totalpaiddays: Number(item.paidpresentday) > Number(item.shift) ? (Number(item.shift) - Number(item.lopcount)) : (Number(item.paidpresentday) - Number(item.doublelopcount) + Number(item.doublehalflopcount)),
          }
        });

        // console.log(resultdata, 'resultdata')
        setUserShifts(resultdata);
        setLoader(false);
        setSearchQueryAttMonth("");
        setTotalPagesAttMonth(Math.ceil(resultdata.length / pageSizeAttMonth));
      }).catch(error => {
        setLoader(true);
        console.error('Error in getting all results:', error);
      });
    } catch (err) { setLoader(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  }

  useEffect(() => {
    setFilteredDataItems(userShifts);
  }, [userShifts])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (filterUser.filtertype === "Please Select Filter Type" || filterUser.filtertype === "" || filterUser.filtertype === undefined) {
      setPopupContentMalert("Please Select Filter Type for Employee Names");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (selectedCompany.length === 0 && isMonthyear.ismonth.value === currentMonthIndex + 1 && isMonthyear.isyear.value === currentYearAttMonth) {
      setPopupContentMalert("Please Select Company");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (["Individual", "Team", "Branch", "Unit"]?.includes(filterUser.filtertype) && selectedBranch.length === 0 && isMonthyear.ismonth.value === currentMonthIndex + 1 && isMonthyear.isyear.value === currentYearAttMonth) {
      setPopupContentMalert("Please Select Branch");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (["Individual", "Team", "Unit"]?.includes(filterUser.filtertype) && selectedUnit.length === 0 && isMonthyear.ismonth.value === currentMonthIndex + 1 && isMonthyear.isyear.value === currentYearAttMonth) {
      setPopupContentMalert("Please Select Unit");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (["Individual", "Team"]?.includes(filterUser.filtertype) && selectedTeam.length === 0 && isMonthyear.ismonth.value === currentMonthIndex + 1 && isMonthyear.isyear.value === currentYearAttMonth) {
      setPopupContentMalert("Please Select Team");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (["Department"]?.includes(filterUser.filtertype) && selectedCompany.length === 0 && isMonthyear.ismonth.value === currentMonthIndex + 1 && isMonthyear.isyear.value === currentYearAttMonth) {
      setPopupContentMalert("Please Select Company");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (["Department"]?.includes(filterUser.filtertype) && selectedDep.length === 0 && isMonthyear.ismonth.value === currentMonthIndex + 1 && isMonthyear.isyear.value === currentYearAttMonth) {
      setPopupContentMalert("Please Select Department");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (["Individual"]?.includes(filterUser.filtertype) && selectedEmp.length === 0 && isMonthyear.ismonth.value === currentMonthIndex + 1 && isMonthyear.isyear.value === currentYearAttMonth) {
      setPopupContentMalert("Please Select Employee");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else {
      fetchUsersFilter();
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setLoader(false);
    setFilterUser({ filtertype: "Individual", });
    setUserShifts([]);
    setSelectedCompany([]);
    setSelectedBranch([]);
    setSelectedUnit([]);
    setSelectedTeam([]);
    setSelectedDep([]);
    setSelectedEmp([]);
    setValueCompany([]);
    setValueBranch([]);
    setValueUnit([]);
    setValueTeam([])
    setValueDep([]);
    setValueEmp([]);
    setIsMonthYear({ ismonth: currentMonthObject, isyear: currentYearObject });
    setPageAttMonth(1);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  const defaultColDef = useMemo(() => {
    return {
      filter: true,
      resizable: true,
      filterParams: {
        buttons: ["apply", "reset", "cancel"],
      },
    };
  }, []);

  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);
  }, []);

  // Function to handle filter changes
  const onFilterChanged = () => {
    if (gridApi) {
      const filterModel = gridApi.getFilterModel(); // Get the current filter model

      // Check if filters are active
      if (Object.keys(filterModel).length === 0) {
        // No filters active, clear the filtered data state
        setFilteredRowData([]);
      } else {
        // Filters are active, capture filtered data
        const filteredData = [];
        gridApi.forEachNodeAfterFilterAndSort((node) => {
          filteredData.push(node.data); // Collect filtered row data
        });
        setFilteredRowData(filteredData);
      }
    }
  };

  const onPaginationChanged = useCallback(() => {
    if (gridRefTableAttMonth.current) {
      const gridApi = gridRefTableAttMonth.current.api;
      const currentPage = gridApi.paginationGetCurrentPage() + 1;
      const totalPagesAttMonth = gridApi.paginationGetTotalPages();
      setPageAttMonth(currentPage);
      setTotalPagesAttMonth(totalPagesAttMonth);
    }
  }, []);

  const columnDataTableAttMonth = [
    { field: "serialNumber", headerName: "SNo", flex: 0, width: 80, hide: !columnVisibilityAttMonth.serialNumber, headerClassName: "bold-header", pinned: 'left', lockPinned: true, },
    { field: "empcode", headerName: "Emp Code", flex: 0, width: 150, hide: !columnVisibilityAttMonth.empcode, headerClassName: "bold-header", pinned: 'left', lockPinned: true, },
    { field: "username", headerName: "Employee Name", flex: 0, width: 250, hide: !columnVisibilityAttMonth.username, headerClassName: "bold-header", pinned: 'left', lockPinned: true, },
    { field: "company", headerName: "Company", flex: 0, width: 130, hide: !columnVisibilityAttMonth.company, headerClassName: "bold-header", },
    { field: "branch", headerName: "Branch", flex: 0, width: 130, hide: !columnVisibilityAttMonth.branch, headerClassName: "bold-header", },
    { field: "unit", headerName: "Unit", flex: 0, width: 130, hide: !columnVisibilityAttMonth.unit, headerClassName: "bold-header", },
    { field: "team", headerName: "Team", flex: 0, width: 130, hide: !columnVisibilityAttMonth.team, headerClassName: "bold-header", },
    { field: "department", headerName: "Department", flex: 0, width: 130, hide: !columnVisibilityAttMonth.department, headerClassName: "bold-header", },
    { field: "totalnumberofdays", headerName: "Total No. Of Days", flex: 0, width: 110, hide: !columnVisibilityAttMonth.totalnumberofdays, headerClassName: "bold-header", },
    { field: "empshiftdays", headerName: "Employee Shift Days", flex: 0, width: 110, hide: !columnVisibilityAttMonth.empshiftdays, headerClassName: "bold-header", },
    { field: "totalcounttillcurrendate", headerName: "Till Current Date Count", flex: 0, width: 110, hide: !columnVisibilityAttMonth.totalcounttillcurrendate, headerClassName: "bold-header", },
    { field: "shift", headerName: "Till Current Shift", flex: 0, width: 150, hide: !columnVisibilityAttMonth.shift, headerClassName: "bold-header", },
    { field: "clsl", headerName: "C.L. / S.L.", flex: 0, width: 120, hide: !columnVisibilityAttMonth.clsl, headerClassName: "bold-header", },
    { field: "weekoff", headerName: "Week Off", flex: 0, width: 130, hide: !columnVisibilityAttMonth.weekoff, headerClassName: "bold-header", },
    { field: "holidayCount", headerName: "Holiday", flex: 0, width: 130, hide: !columnVisibilityAttMonth.holidayCount, headerClassName: "bold-header", },
    { field: "doublelopcount", headerName: "Double Lop", flex: 0, width: 130, hide: !columnVisibilityAttMonth.doublelopcount, headerClassName: "bold-header", },
    { field: "doublehalflopcount", headerName: "Double Half Lop", flex: 0, width: 130, hide: !columnVisibilityAttMonth.doublehalflopcount, headerClassName: "bold-header", },
    { field: "paidpresentday", headerName: "Total Present Shift", flex: 0, width: 130, hide: !columnVisibilityAttMonth.paidpresentday, headerClassName: "bold-header", },
    { field: "lopcount", headerName: "Total Absent / LOP", flex: 0, width: 120, hide: !columnVisibilityAttMonth.lopcount, headerClassName: "bold-header", },
    { field: "totalpaiddays", headerName: "Total Paid Shift", flex: 0, width: 130, hide: !columnVisibilityAttMonth.totalpaiddays, headerClassName: "bold-header", },
    { field: "nostatuscount", headerName: "Total No Status Shift", flex: 0, width: 130, hide: !columnVisibilityAttMonth.nostatuscount, headerClassName: "bold-header", },
  ];

  // Datatable
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQueryAttMonth(value);
    applyNormalFilter(value);
    setFilteredRowData([]);
  };

  const applyNormalFilter = (searchValue) => {

    // Split the search query into individual terms
    const searchTerms = searchValue.toLowerCase().split(" ");

    // Modify the filtering logic to check each term
    const filtered = userShifts?.filter((item) => {
      return searchTerms.every((term) =>
        Object.values(item).join(" ").toLowerCase().includes(term)
      );
    });
    setFilteredDataItems(filtered);
    setPageAttMonth(1);
  };

  const applyAdvancedFilter = (filters, logicOperator) => {
    // Apply filtering logic with multiple conditions
    const filtered = userShifts?.filter((item) => {
      return filters.reduce((acc, filter, index) => {
        const { column, condition, value } = filter;
        const itemValue = String(item[column])?.toLowerCase();
        const filterValue = String(value).toLowerCase();

        let match;
        switch (condition) {
          case "Contains":
            match = itemValue.includes(filterValue);
            break;
          case "Does Not Contain":
            match = !itemValue?.includes(filterValue);
            break;
          case "Equals":
            match = itemValue === filterValue;
            break;
          case "Does Not Equal":
            match = itemValue !== filterValue;
            break;
          case "Begins With":
            match = itemValue.startsWith(filterValue);
            break;
          case "Ends With":
            match = itemValue.endsWith(filterValue);
            break;
          case "Blank":
            match = !itemValue;
            break;
          case "Not Blank":
            match = !!itemValue;
            break;
          default:
            match = true;
        }

        // Combine conditions with AND/OR logic
        if (index === 0) {
          return match; // First filter is applied directly
        } else if (logicOperator === "AND") {
          return acc && match;
        } else {
          return acc || match;
        }
      }, true);
    });

    setFilteredDataItems(filtered);
    setAdvancedFilter(filters);
    // handleCloseSearchAttMonth(); 
  };

  // Undo filter funtion
  const handleResetSearch = () => {
    setAdvancedFilter(null);
    setSearchQueryAttMonth("");
    setFilteredDataItems(userShifts);
  };

  // Show filtered combination in the search bar
  const getSearchDisplay = () => {
    if (advancedFilter && advancedFilter.length > 0) {
      return advancedFilter.map((filter, index) => {
        let showname = columnDataTableAttMonth.find(col => col.field === filter.column)?.headerName;
        return `${showname} ${filter.condition} "${filter.value}"`;
      }).join(' ' + (advancedFilter.length > 1 ? advancedFilter[1].condition : '') + ' ');
    }
    return searchQueryAttMonth;
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPagesAttMonth) {
      setPageAttMonth(newPage);
      gridRefTableAttMonth.current.api.paginationGoToPage(newPage - 1);
    }
  };

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setPageSizeAttMonth(newSize);
    if (gridApi) {
      gridApi.paginationSetPageSize(newSize);
    }
  };

  // Show All Columns functionality
  const handleShowAllColumns = () => {
    const updatedVisibility = { ...columnVisibilityAttMonth };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibilityAttMonth(updatedVisibility);
  };

  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem("columnVisibilityAttMonth");
    if (savedVisibility) {
      setColumnVisibilityAttMonth(JSON.parse(savedVisibility));
    }
  }, []);

  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem("columnVisibilityAttMonth", JSON.stringify(columnVisibilityAttMonth));
  }, [columnVisibilityAttMonth]);

  // Function to filter columns based on search query
  const filteredColumns = columnDataTableAttMonth.filter((column) =>
    column.headerName.toLowerCase().includes(searchQueryManageAttMonth.toLowerCase())
  );

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    if (!gridApi) return;

    setColumnVisibilityAttMonth((prevVisibility) => {
      const newVisibility = !prevVisibility[field];

      // Update the visibility in the grid
      gridApi.setColumnVisible(field, newVisibility);

      return {
        ...prevVisibility,
        [field]: newVisibility,
      };
    });
  };

  const handleColumnMoved = useCallback(debounce((event) => {
    if (!event.columnApi) return;

    const visible_columns = event.columnApi.getAllColumns().filter(col => {
      const colState = event.columnApi.getColumnState().find(state => state.colId === col.colId);
      return colState && !colState.hide;
    }).map(col => col.colId);

    setColumnVisibilityAttMonth((prevVisibility) => {
      const updatedVisibility = { ...prevVisibility };

      // Ensure columns that are visible stay visible
      Object.keys(updatedVisibility).forEach(colId => {
        updatedVisibility[colId] = visible_columns.includes(colId);
      });

      return updatedVisibility;
    });
  }, 300), []);

  const handleColumnVisible = useCallback((event) => {
    const colId = event.column.getColId();

    // Update visibility based on event, but only when explicitly triggered by grid
    setColumnVisibilityAttMonth((prevVisibility) => ({
      ...prevVisibility,
      [colId]: event.visible, // Set visibility directly from the event
    }));
  }, []);

  // Excel
  const [fileFormat, setFormat] = useState('')
  let exportColumnNamescrt = [
    "Emp Code", "Employee Name", "Company", "Branch", "Unit", "Team", "Department", 'Total No. of Days', 'Employee Shift Days', 'Till Current Date Count',
    'Till Current Shift', 'C.L. / S.L.', 'Week Off', 'Holiday', 'Double Lop', 'Double Half Lop', 'Total Present Shift', 'Total Absent / LOP', 'Total Paid Shift', 'Total No Status Shift',
  ]
  let exportRowValuescrt = [
    "empcode", "username", "company", "branch", "unit", "team", "department", "totalnumberofdays", "empshiftdays", "totalcounttillcurrendate",
    "shift", "clsl", "weekoff", "holidayCount", "doublelopcount", "doublehalflopcount", "paidpresentday", "lopcount", "totalpaiddays", "nostatuscount",
  ]

  // print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Attendance Month Status",
    pageStyle: "print",
  });

  // image
  const handleCaptureImage = () => {
    if (gridRefImageAttMonth.current) {
      domtoimage.toBlob(gridRefImageAttMonth.current)
        .then((blob) => {
          saveAs(blob, "Attendance Month Status.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  // Pagination for innter filter
  const getVisiblePageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 3;

    const startPage = Math.max(1, pageAttMonth - 1);
    const endPage = Math.min(totalPagesAttMonth, startPage + maxVisiblePages - 1);

    // Loop through and add visible pageAttMonth numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // If there are more pages after the last visible pageAttMonth, show ellipsis
    if (endPage < totalPagesAttMonth) {
      pageNumbers.push("...");
    }

    return pageNumbers;
  };

  // Pagination for outer filter
  const filteredData = filteredDataItems?.slice((pageAttMonth - 1) * pageSizeAttMonth, pageAttMonth * pageSizeAttMonth);
  const totalPagesAttMonthOuter = Math.ceil(filteredDataItems?.length / pageSizeAttMonth);
  const visiblePages = Math.min(totalPagesAttMonthOuter, 3);
  const firstVisiblePage = Math.max(1, pageAttMonth - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPagesAttMonthOuter);
  const pageNumbers = [];
  const indexOfLastItem = pageAttMonth * pageSizeAttMonth;
  const indexOfFirstItem = indexOfLastItem - pageSizeAttMonth;
  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) { pageNumbers.push(i); }

  return (
    <Box>
      <Headtitle title={"ATTENDANCE MONTH STATUS"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Attendance Month Status"
        modulename="Human Resources"
        submodulename="HR"
        mainpagename="Attendance"
        subpagename="Attendance Reports"
        subsubpagename="Attendance Month Status"
      />
      {isUserRoleCompare?.includes("lattendancemonthstatus") && (
        <>
          <Box sx={userStyle.selectcontainer}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography sx={userStyle.importheadtext}>Attendance Month Status</Typography>
              </Grid>
              {/* <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Mode<b style={{ color: "red" }}>*</b></Typography>
                                    <Selects
                                        options={modeOptions}
                                        styles={colourStyles}
                                        value={{ label: filterUser.mode, value: filterUser.mode }}
                                        onChange={(e) => {
                                            setFilterUser({ ...filterUser, mode: e.value, });
                                            setSelectedDep([]);
                                            setValueDep([]);
                                            setSelectedEmp([]);
                                            setValueEmp([]);
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <Typography>Company<b style={{ color: "red" }}>*</b></Typography>
                                <FormControl size="small" fullWidth>
                                    <MultiSelect
                                        options={accessbranch?.map(data => ({
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
                                    <MultiSelect
                                        options={accessbranch?.filter(
                                            (comp) =>
                                                valueCompany?.includes(comp.company)
                                        )?.map(data => ({
                                            label: data.branch,
                                            value: data.branch,
                                        })).filter((item, index, self) => {
                                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                        })}
                                        value={selectedBranch}
                                        onChange={handleBranchChangeFrom}
                                        valueRenderer={customValueRendererBranchFrom}
                                        labelledBy="Please Select Branch"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography> Unit<b style={{ color: "red" }}>*</b> </Typography>
                                    <MultiSelect
                                        options={accessbranch?.filter(
                                            (comp) =>
                                                valueCompany?.includes(comp.company) && valueBranch?.includes(comp.branch)
                                        )?.map(data => ({
                                            label: data.unit,
                                            value: data.unit,
                                        })).filter((item, index, self) => {
                                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                        })}
                                        value={selectedUnit}
                                        onChange={handleUnitChangeFrom}
                                        valueRenderer={customValueRendererUnitFrom}
                                        labelledBy="Please Select Unit"
                                    />
                                </FormControl>
                            </Grid>
                            {filterUser.mode === 'Department' ?
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography> Department<b style={{ color: "red" }}>*</b> </Typography>
                                        <MultiSelect
                                            options={alldepartment?.map(data => ({
                                                label: data.deptname,
                                                value: data.deptname,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            value={selectedDep}
                                            onChange={(e) => {
                                                handleDepChangeFrom(e);
                                            }}
                                            valueRenderer={customValueRendererDepFrom}
                                            labelledBy="Please Select Department"
                                        />
                                    </FormControl>
                                </Grid>
                                : null}
                            {filterUser.mode === 'Employee' ?
                                <Grid item md={3} sm={12} xs={12} sx={{ display: "flex", flexDirection: "row" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Employee<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            // options={allUsersLimit}
                                            options={allUsersLimit?.filter(
                                                (comp) =>
                                                    valueCompany?.includes(comp.company) && valueBranch?.includes(comp.branch) && valueUnit?.includes(comp.unit)
                                                // && valueDep?.includes(comp.department)
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
                                : null} */}
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography> Type<b style={{ color: "red" }}>*</b> </Typography>
                  <Selects
                    options={[
                      { label: "Individual", value: "Individual" },
                      { label: "Company", value: "Company" },
                      { label: "Branch", value: "Branch" },
                      { label: "Unit", value: "Unit" },
                      { label: "Team", value: "Team" },
                      { label: "Department", value: "Department" },
                    ]}
                    styles={colourStyles}
                    value={{ label: filterUser.filtertype, value: filterUser.filtertype, }}
                    onChange={(e) => {
                      setFilterUser({ ...filterUser, filtertype: e.value });
                      setSelectedCompany([]);
                      setValueCompany([]);
                      setSelectedBranch([]);
                      setValueBranch([]);
                      setSelectedUnit([]);
                      setValueUnit([]);
                      setSelectedTeam([]);
                      setValueTeam([]);
                      setSelectedEmp([]);
                      setValueEmp([]);
                      setSelectedDep([]);
                      setValueDep([]);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Company<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <MultiSelect
                    options={accessbranch?.map(data => ({
                      label: data.company,
                      value: data.company,
                    })).filter((item, index, self) => {
                      return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                    })}
                    value={selectedCompany}
                    onChange={(e) => {
                      handleCompanyChange(e);
                    }}
                    valueRenderer={customValueRendererCompany}
                    labelledBy="Please Select Company"
                  />
                </FormControl>
              </Grid>
              {["Individual", "Team"]?.includes(filterUser.filtertype) ? <>
                {/* Branch Unit Team */}
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography> Branch<b style={{ color: "red" }}>*</b> </Typography>
                    <MultiSelect
                      options={accessbranch?.filter(
                        (comp) =>
                          valueCompany?.includes(comp.company)
                      )?.map(data => ({
                        label: data.branch,
                        value: data.branch,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                      value={selectedBranch}
                      onChange={handleBranchChange}
                      valueRenderer={customValueRendererBranch}
                      labelledBy="Please Select Branch"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography> Unit<b style={{ color: "red" }}>*</b></Typography>
                    <MultiSelect
                      options={accessbranch?.filter(
                        (comp) =>
                          valueCompany?.includes(comp.company) && valueBranch?.includes(comp.branch)
                      )?.map(data => ({
                        label: data.unit,
                        value: data.unit,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                      value={selectedUnit}
                      onChange={handleUnitChange}
                      valueRenderer={customValueRendererUnit}
                      labelledBy="Please Select Branch"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography> Team<b style={{ color: "red" }}>*</b></Typography>
                    <MultiSelect
                      options={allTeam
                        ?.filter((u) => valueCompany?.includes(u.company) && valueBranch?.includes(u.branch) && valueUnit?.includes(u.unit))
                        .map((u) => ({
                          ...u,
                          label: u.teamname,
                          value: u.teamname,
                        }))}
                      value={selectedTeam}
                      onChange={handleTeamChange}
                      valueRenderer={customValueRendererTeam}
                      labelledBy="Please Select Branch"
                    />
                  </FormControl>
                </Grid>
              </>
                : ["Branch"]?.includes(filterUser.filtertype) ?
                  <>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography> Branch<b style={{ color: "red" }}>*</b></Typography>
                        <MultiSelect
                          options={accessbranch?.filter(
                            (comp) =>
                              valueCompany?.includes(comp.company)
                          )?.map(data => ({
                            label: data.branch,
                            value: data.branch,
                          })).filter((item, index, self) => {
                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                          })}
                          value={selectedBranch}
                          onChange={handleBranchChange}
                          valueRenderer={customValueRendererBranch}
                          labelledBy="Please Select Branch"
                        />
                      </FormControl>
                    </Grid>
                  </>
                  :
                  ["Unit"]?.includes(filterUser.filtertype) ?
                    <>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography> Branch<b style={{ color: "red" }}>*</b></Typography>
                          <MultiSelect
                            options={accessbranch?.filter(
                              (comp) =>
                                valueCompany?.includes(comp.company)
                            )?.map(data => ({
                              label: data.branch,
                              value: data.branch,
                            })).filter((item, index, self) => {
                              return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                            })}
                            value={selectedBranch}
                            onChange={handleBranchChange}
                            valueRenderer={customValueRendererBranch}
                            labelledBy="Please Select Branch"
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography> Unit<b style={{ color: "red" }}>*</b></Typography>
                          <MultiSelect
                            options={accessbranch?.filter(
                              (comp) =>
                                valueCompany?.includes(comp.company) && valueBranch?.includes(comp.branch)
                            )?.map(data => ({
                              label: data.unit,
                              value: data.unit,
                            })).filter((item, index, self) => {
                              return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                            })}
                            value={selectedUnit}
                            onChange={handleUnitChange}
                            valueRenderer={customValueRendererUnit}
                            labelledBy="Please Select Branch"
                          />
                        </FormControl>
                      </Grid>
                    </>
                    : ["Individual", "Department"]?.includes(filterUser.filtertype) ?
                      <>
                        {/* Department */}
                        <Grid item md={3} xs={12} sm={6}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Department<b style={{ color: "red" }}>*</b>
                            </Typography>
                            <MultiSelect
                              options={alldepartment?.map(data => ({
                                label: data.deptname,
                                value: data.deptname,
                              })).filter((item, index, self) => {
                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                              })}
                              value={selectedDep}
                              onChange={(e) => {
                                handleDepartmentChange(e);
                              }}
                              valueRenderer={customValueRendererDepartment}
                              labelledBy="Please Select Department"
                            />
                          </FormControl>
                        </Grid>
                      </>
                      : ""
              }
              {["Individual"]?.includes(filterUser.filtertype) &&
                <Grid item md={3} sm={12} xs={12} sx={{ display: "flex", flexDirection: "row" }}>
                  <FormControl fullWidth size="small">
                    <Typography>Employee<b style={{ color: "red" }}>*</b> </Typography>
                    <MultiSelect
                      options={allUsersLimit?.filter(
                        (comp) =>
                          valueCompany?.includes(comp.company) && selectedBranch?.map(data => data.value)?.includes(comp.branch) && selectedUnit?.map(data => data.value)?.includes(comp.unit) && selectedTeam?.map(data => data.value)?.includes(comp.team)
                      )?.map(data => ({
                        label: data.companyname,
                        value: data.companyname,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                      value={selectedEmp}
                      onChange={(e) => { handleEmployeeChange(e); }}
                      valueRenderer={customValueRendererEmp}
                      labelledBy="Please Select Employee"
                    />
                  </FormControl>
                </Grid>}
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Select Month</Typography>
                  <Selects
                    maxMenuHeight={200}
                    styles={colourStyles}
                    options={(isMonthyear.isyear.value < new Date().getFullYear()) ? months : months.filter((d) => d.value <= currentMonthIndex + 1)}
                    value={isMonthyear.ismonth}
                    onChange={(e) => handleGetMonth(e.value)}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography> Select Year</Typography>
                  <Selects
                    maxMenuHeight={200}
                    styles={colourStyles}
                    options={getyear}
                    value={isMonthyear.isyear}
                    onChange={(e) => handleGetYear(e.value)}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item lg={1} md={2} sm={2} xs={6} >
                <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                  <Button sx={buttonStyles.buttonsubmit} variant="contained" onClick={handleSubmit} > Filter </Button>
                </Box>
              </Grid>
              <Grid item lg={1} md={2} sm={2} xs={6}>
                <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                  <Button sx={buttonStyles.btncancel} onClick={handleClear} > Clear </Button>
                </Box>
              </Grid>
            </Grid>
          </Box><br />
          {/* ****** Table Start ****** */}
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}> Attendance Month Status </Typography>
            </Grid>
            <Grid container spacing={2} style={userStyle.dataTablestyle}>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <label>Show entries:</label>
                  <Select
                    id="pageSizeSelect"
                    value={pageSizeAttMonth}
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
                    <MenuItem value={userShifts?.length}> All </MenuItem>
                  </Select>
                </Box>
              </Grid>
              <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center", }}  >
                <Box>
                  {isUserRoleCompare?.includes("excelattendancemonthstatus") && (
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        setFormat("xl")
                      }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvattendancemonthstatus") && (
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        setFormat("csv")
                      }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("printattendancemonthstatus") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}> &ensp;  <FaPrint /> &ensp;Print&ensp; </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfattendancemonthstatus") && (
                    <>
                      <Button sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true)
                        }}
                      ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imageattendancemonthstatus") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp; </Button>
                    </>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>
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
                            <IoMdOptions style={{ cursor: 'pointer', }} onClick={handleClickSearchAttMonth} />
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
            </Grid>  <br />
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>  Show All Columns </Button>&ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsAttMonth}> Manage Columns  </Button> <br /> <br />
            {loader ?
              <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '350px' }}>
                <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
              </Box> :
              <>
                <Box sx={{ width: "100%", }} className={"ag-theme-quartz"} ref={gridRefImageAttMonth} >
                  <AgGridReact
                    rowData={filteredDataItems}
                    columnDefs={columnDataTableAttMonth.filter((column) => columnVisibilityAttMonth[column.field])}
                    ref={gridRefTableAttMonth}
                    defaultColDef={defaultColDef}
                    domLayout={"autoHeight"}
                    getRowStyle={getRowStyle}
                    pagination={true}
                    paginationPageSize={pageSizeAttMonth}
                    onPaginationChanged={onPaginationChanged}
                    onGridReady={onGridReady}
                    onColumnMoved={handleColumnMoved}
                    onColumnVisible={handleColumnVisible}
                    onFilterChanged={onFilterChanged}
                    // suppressPaginationPanel={true}
                    suppressSizeToFit={true}
                    suppressAutoSize={true}
                    suppressColumnVirtualisation={true}
                    colResizeDefault={"shift"}
                    cellSelection={true}
                    copyHeadersToClipboard={true}
                  />
                </Box>
                {/* show and hide based on the inner filter and outer filter */}
                {/* <Box style={userStyle.dataTablestyle}>
                                <Box>
                                    Showing{" "}
                                    {
                                        gridApi && gridApi.getFilterModel() && Object.keys(gridApi.getFilterModel()).length === 0 ? (
                                            (filteredDataItems.length > 0 ? (pageAttMonth - 1) * pageSizeAttMonth + 1 : 0)
                                        ) : (
                                            filteredRowData.length > 0 ? (pageAttMonth - 1) * pageSizeAttMonth + 1 : 0
                                        )
                                    }{" "}to{" "}
                                    {
                                        gridApi && gridApi.getFilterModel() && Object.keys(gridApi.getFilterModel()).length === 0 ? (
                                            Math.min(pageAttMonth * pageSizeAttMonth, filteredDataItems.length)
                                        ) : (
                                            filteredRowData.length > 0 ? Math.min(pageAttMonth * pageSizeAttMonth, filteredRowData.length) : 0
                                        )
                                    }{" "}of{" "}
                                    {
                                        gridApi && gridApi.getFilterModel() && Object.keys(gridApi.getFilterModel()).length === 0 ? (
                                            filteredDataItems.length
                                        ) : (
                                            filteredRowData.length
                                        )
                                    } entries
                                </Box>
                                <Box>
                                    <Button onClick={() => handlePageChange(1)} disabled={pageAttMonth === 1} sx={userStyle.paginationbtn}  > <FirstPageIcon /> </Button>
                                    <Button onClick={() => handlePageChange(pageAttMonth - 1)} disabled={pageAttMonth === 1} sx={userStyle.paginationbtn}  > <NavigateBeforeIcon />  </Button>
                                    {getVisiblePageNumbers().map((pageNumber, index) => (
                                        <Button
                                            key={index}
                                            onClick={() => pageNumber !== "..." && handlePageChange(pageNumber)}
                                            sx={{
                                                ...userStyle.paginationbtn,
                                                ...(pageNumber === "..." && {
                                                    cursor: "default",
                                                    color: "black",
                                                    fontSize: '12px',
                                                    fontWeight: 'bold',
                                                    backgroundColor: "transparent",
                                                    border: "none",
                                                    "&:hover": {
                                                        backgroundColor: "transparent",
                                                        boxShadow: "none",
                                                    },
                                                }),
                                            }}
                                            className={pageAttMonth === pageNumber ? "active" : ""}
                                            disabled={pageAttMonth === pageNumber}
                                        >
                                            {pageNumber}
                                        </Button>
                                    ))}
                                    <Button onClick={() => handlePageChange(pageAttMonth + 1)} disabled={pageAttMonth === totalPagesAttMonth} sx={userStyle.paginationbtn} > <NavigateNextIcon /> </Button>
                                    <Button onClick={() => handlePageChange(totalPagesAttMonth)} disabled={pageAttMonth === totalPagesAttMonth} sx={userStyle.paginationbtn} ><LastPageIcon /> </Button>
                                </Box>
                            </Box> */}
              </>
            }
          </Box>
          {/* ****** Table End ****** */}
        </>
      )}

      {/* Manage Column */}
      <Popover
        id={idAttMonth}
        open={isManageColumnsOpenAttMonth}
        anchorEl={anchorElAttMonth}
        onClose={handleCloseManageColumnsAttMonth}
        anchorOrigin={{ vertical: "bottom", horizontal: "left", }}
      >
        <ManageColumnsContent
          handleClose={handleCloseManageColumnsAttMonth}
          searchQuery={searchQueryManageAttMonth}
          setSearchQuery={setSearchQueryManageAttMonth}
          filteredColumns={filteredColumns}
          columnVisibility={columnVisibilityAttMonth}
          toggleColumnVisibility={toggleColumnVisibility}
          setColumnVisibility={setColumnVisibilityAttMonth}
          initialColumnVisibility={initialColumnVisibilityAttMonth}
          columnDataTable={columnDataTableAttMonth}
        />
      </Popover>

      {/* Search Bar */}
      <Popover
        id={idSearchAttMonth}
        open={openSearchAttMonth}
        anchorEl={anchorElSearchAttMonth}
        onClose={handleCloseSearchAttMonth}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
      >
        <AdvancedSearchBar columns={columnDataTableAttMonth} onSearch={applyAdvancedFilter} initialSearchValue={searchQueryAttMonth} handleCloseSearch={handleCloseSearchAttMonth} />
      </Popover>

      {/* Alert  */}
      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
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
        filteredDataTwo={(filteredRowData.length > 0 ? filteredRowData : filteredData) ?? []}
        itemsTwo={userShifts ?? []}
        filename={"Attendance Month Status"}
        exportColumnNames={exportColumnNamescrt}
        exportRowValues={exportRowValuescrt}
        componentRef={componentRef}
      />
    </Box>
  );
}

export default AttendanceMonthStatusList;