import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import { FaFileExcel, FaFileCsv, FaPrint, FaFilePdf, FaSearch } from 'react-icons/fa';
import { Box, Typography, OutlinedInput, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Button, Popover, IconButton, InputAdornment, Tooltip } from "@mui/material";
import { userStyle, colourStyles } from "../../pageStyle";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../components/Errorhandling";
import { UserRoleAccessContext, AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { saveAs } from "file-saver";
import axios from "axios";
import ImageIcon from "@mui/icons-material/Image";
import { SERVICE } from "../../services/Baseservice";
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import domtoimage from 'dom-to-image';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import ExportData from "../../components/ExportData";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import AdvancedSearchBar from '../../components/SearchbarEbList';
import ManageColumnsContent from "../../components/ManageColumn";
import ResizeObserver from 'resize-observer-polyfill';
window.ResizeObserver = ResizeObserver;

function ApprovedLeave() {

  const gridRefTableLeaveApprved = useRef(null);
  const gridRefImageLeaveApprved = useRef(null);

  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, allTeam, allUsersLimit, pageName, setPageName, buttonStyles, } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [isApplyLeave, setIsApplyLeave] = useState([]);
  const [items, setItems] = useState([]);
  const [applyleaveCheck, setApplyleavecheck] = useState(false);

  const [selectedCompany, setSelectedCompany] = useState([]);
  const [valueCompany, setValueCompany] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [valueBranch, setValueBranch] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState([]);
  const [valueUnit, setValueUnit] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState([]);
  const [valueTeam, setValueTeam] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState([]);
  const [valueEmp, setValueEmp] = useState([]);
  const [selectedLeaveType, setSelectedLeaveType] = useState([]);
  const [valueLeaveType, setValueLeaveType] = useState([]);
  const [filterUser, setFilterUser] = useState({ filtertype: "Individual" });

  // State to track advanced filter
  const [advancedFilter, setAdvancedFilter] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [columnApi, setColumnApi] = useState(null);
  const [filteredDataItems, setFilteredDataItems] = useState(isApplyLeave);
  const [filteredRowData, setFilteredRowData] = useState([]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  // page refersh reload
  const handleCloseFilterMod = () => { setIsFilterOpen(false); };
  const handleClosePdfFilterMod = () => { setIsPdfFilterOpen(false); };

  //Datatable
  const [pageLeaveApprved, setPageLeaveApprved] = useState(1);
  const [pageSizeLeaveApprved, setPageSizeLeaveApprved] = useState(10);
  const [searchQueryLeaveApprved, setSearchQueryLeaveApprved] = useState("");
  const [totalPagesLeaveApprved, setTotalPagesLeaveApprved] = useState(1);

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => { setIsErrorOpen(true); };
  const handleCloseerr = () => { setIsErrorOpen(false); };

  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => { setOpenPopupMalert(true); };
  const handleClosePopupMalert = () => { setOpenPopupMalert(false); };

  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const handleClickOpenPopup = () => { setOpenPopup(true); };
  const handleClosePopup = () => { setOpenPopup(false); };

  // Manage Columns
  const [searchQueryManageLeaveApprved, setSearchQueryManageLeaveApprved] = useState("");
  const [isManageColumnsOpenLeaveApprved, setManageColumnsOpenLeaveApprved] = useState(false);
  const [anchorElLeaveApprved, setAnchorElLeaveApprved] = useState(null);

  const handleOpenManageColumnsLeaveApprved = (event) => {
    setAnchorElLeaveApprved(event.currentTarget);
    setManageColumnsOpenLeaveApprved(true);
  };
  const handleCloseManageColumnsLeaveApprved = () => {
    setManageColumnsOpenLeaveApprved(false);
    setSearchQueryManageLeaveApprved("");
  };

  const openLeaveApprved = Boolean(anchorElLeaveApprved);
  const idLeaveApprved = openLeaveApprved ? "simple-popover" : undefined;

  // Search bar
  const [anchorElSearchLeaveApprved, setAnchorElSearchLeaveApprved] = React.useState(null);
  const handleClickSearchLeaveApprved = (event) => {
    setAnchorElSearchLeaveApprved(event.currentTarget);
  };
  const handleCloseSearchLeaveApprved = () => {
    setAnchorElSearchLeaveApprved(null);
    setSearchQueryLeaveApprved("");
  };

  const openSearchLeaveApprved = Boolean(anchorElSearchLeaveApprved);
  const idSearchLeaveApprved = openSearchLeaveApprved ? 'simple-popover' : undefined;

  // Show All Columns & Manage Columns
  const initialColumnVisibilityLeaveApprved = {
    serialNumber: true,
    checkbox: true,
    employeename: true,
    employeeid: true,
    leavetype: true,
    date: true,
    todate: true,
    numberofdays: true,
    reasonforleave: true,
    reportingto: true,
    actions: true,
    status: true,
    actionby: true,
  };

  const [columnVisibilityLeaveApprved, setColumnVisibilityLeaveApprved] = useState(initialColumnVisibilityLeaveApprved);

  // Table row color
  const getRowStyle = (params) => {
    if (params.node.rowIndex % 2 === 0) {
      return { background: '#f0f0f0' }; // Even row
    } else {
      return { background: '#ffffff' }; // Odd row
    }
  }

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
      pagename: String("Approved Leave"),
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

  // Pre select dropdowns
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
    // Create team options based on selected company, branch, and unit
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
    const allemployees = allUsersLimit
      ?.filter(val =>
        company.some(comp => comp.value === val.company) &&
        branch.some(br => br.value === val.branch) &&
        unit.some(uni => uni.value === val.unit) &&
        team.some(team => team.value === val.team)
      )
      .map(data => ({
        label: data.companyname,
        value: data.companyname,
      }));
    setSelectedEmp(allemployees);
    setValueEmp(allemployees.map(a => a.value));
  }, [isAssignBranch])

  const [leaveTypeData, setLeaveTypeData] = useState([]);
  const fetchLeaveType = async () => {
    setPageName(!pageName);
    try {
      let res_leavetype = await axios.get(SERVICE.LEAVETYPE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const leaveall = [
        { label: "Leave Without Pay (LWP)", value: "Leave Without Pay (LWP)" },
        ...res_leavetype?.data?.leavetype.map((d) => ({
          ...d,
          label: d.leavetype,
          value: d.leavetype,
        })),
      ];
      setLeaveTypeData(leaveall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchLeaveType();
  }, []);

  // List Filter
  //company multiselect
  const handleCompanyChangeFilter = (options) => {
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
    setSelectedEmp([]);
    setValueEmp([]);
    setSelectedLeaveType([]);
    setValueLeaveType([]);
  };

  const customValueRendererCompanyFilter = (valueCompany, _categoryname) => {
    return valueCompany?.length
      ? valueCompany.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
  };

  //branchto multiselect dropdown changes
  const handleBranchChangeFilter = (options) => {
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
    setSelectedLeaveType([]);
    setValueLeaveType([]);
  };

  const customValueRendererBranchFilter = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Branch";
  };

  // unitto multiselect dropdown changes
  const handleUnitChangeFilter = (options) => {
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
    setSelectedLeaveType([]);
    setValueLeaveType([]);
  };
  const customValueRendererUnitFilter = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Unit";
  };

  //Teamto multiselect dropdown changes
  const handleTeamChangeFilter = (options) => {
    setSelectedTeam(options);
    setValueTeam(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedEmp([]);
    setSelectedLeaveType([]);
    setValueLeaveType([]);
  };
  const customValueRendererTeamFilter = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Team";
  };

  // Employee    
  const handleEmployeeChangeFilter = (options) => {
    setSelectedEmp(options);
    setValueEmp(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedLeaveType([]);
    setValueLeaveType([]);
  };
  const customValueRendererEmpFilter = (valueCate, _employees) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Employee";
  };

  // Leave Type
  const handleLeaveTypeChangeFilter = (options) => {
    setSelectedLeaveType(options);
    setValueLeaveType(
      options.map((a, index) => {
        return a.value;
      })
    );
  };
  const customValueRendererLeaveTypeFilter = (valueCate, _employees) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Leave Type";
  };

  // //get all Sub vendormasters.
  // const fetchApplyleave = async () => {
  //   setPageName(!pageName)
  //   try {
  //     let res_vendor = await axios.get(SERVICE.APPLYLEAVE, {
  //       headers: {
  //         Authorization: `Bearer ${auth.APIToken}`,
  //       },
  //     });
  //     setApplyleavecheck(true);
  //     let Approve = isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin") ? res_vendor?.data?.applyleaves.filter((data) => data.status === "Approved") : res_vendor?.data?.applyleaves.filter((data) => data.employeename === isUserRoleAccess.companyname && data.status === "Approved");
  //     setIsApplyLeave(Approve);
  //     setTotalPagesLeaveApprved(Math.ceil(Approve.length / pageSizeLeaveApprved));
  //   } catch (err) { setApplyleavecheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  // };

  // useEffect(() => {
  //   fetchApplyleave();
  // }, []);

  const handleSubmitFilter = (e) => {
    e.preventDefault();
    if (filterUser.filtertype === "Please Select Filter Type" || filterUser.filtertype === "" || filterUser.filtertype === undefined) {
      setPopupContentMalert("Please Select Filter Type for Employee Names");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (selectedCompany?.length === 0) {
      setPopupContentMalert("Please Select Company");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (["Individual", "Team", "Branch", "Unit"]?.includes(filterUser.filtertype) && selectedBranch.length === 0) {
      setPopupContentMalert("Please Select Branch");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (["Individual", "Team", "Unit"]?.includes(filterUser.filtertype) && selectedUnit.length === 0) {
      setPopupContentMalert("Please Select Unit");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (["Individual", "Team"]?.includes(filterUser.filtertype) && selectedTeam.length === 0) {
      setPopupContentMalert("Please Select Team");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (["Individual"]?.includes(filterUser.filtertype) && selectedEmp.length === 0) {
      setPopupContentMalert("Please Select Employee Names");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (selectedLeaveType.length === 0) {
      setPopupContentMalert("Please Select Leave Type");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (filterUser.fromdate === '' && filterUser.todate === '') {
      setPopupContentMalert("Please Select Date");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else {
      fetchApplyleave();
    }
  };

  const handleClearFilter = async (e) => {
    e.preventDefault();
    setIsApplyLeave([]);
    setFilteredDataItems([]);
    setFilterUser({ filtertype: "Individual" });
    setSelectedCompany([]);
    setSelectedBranch([]);
    setSelectedUnit([]);
    setSelectedTeam([]);
    setSelectedEmp([]);
    setSelectedLeaveType([]);
    setValueCompany([]);
    setValueBranch([]);
    setValueUnit([]);
    setValueTeam([]);
    setValueEmp([]);
    setValueLeaveType([]);
    setPageSizeLeaveApprved(10);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  //get all Sub vendormasters.
  const fetchApplyleave = async () => {
    setPageName(!pageName);
    setApplyleavecheck(true);
    try {

      let res_vendor = await axios.post(SERVICE.APPLYLEAVE_LIST_FILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        type: filterUser.filtertype,
        company: [...valueCompany],
        branch: [...valueBranch],
        unit: [...valueUnit],
        team: [...valueTeam],
        employee: [...valueEmp],
        leavetype: [...valueLeaveType],
        assignbranch: accessbranch,
      });
      let answer = res_vendor?.data?.applyleaves.filter((data) => data.status === "Approved");
      setIsApplyLeave(answer);
      setTotalPagesLeaveApprved(Math.ceil(answer.length / pageSizeLeaveApprved));
      setSearchQueryLeaveApprved("");
      setApplyleavecheck(false);
    } catch (err) {
      setApplyleavecheck(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchApplyleaveForEmployee = async () => {
    setPageName(!pageName);
    // setApplyleavecheck(true);
    try {
      let res_vendor = await axios.get(SERVICE.APPLYLEAVE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        }
      });

      let answer = res_vendor?.data?.applyleaves.filter((data) => data.employeename === isUserRoleAccess.companyname && data.status === 'Approved');
      setIsApplyLeave(answer);
      setTotalPagesLeaveApprved(Math.ceil(answer.answer / pageSizeLeaveApprved));
      setApplyleavecheck(false);
    } catch (err) {
      setApplyleavecheck(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    if (!isUserRoleAccess?.role?.includes("Manager") ||
      !isUserRoleCompare.includes("lassignleaveapply")) {
      fetchApplyleaveForEmployee();
    }
  }, [])

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

  const addSerialNumber = () => {
    const itemsWithSerialNumber = isApplyLeave?.map((item, index) => ({
      ...item,
      id: item._id,
      serialNumber: index + 1,
      employeeid: item.employeeid,
      employeename: item.employeename,
      leavetype: item.leavetype,
      date: item.date.join(','),
      numberofdays: item.numberofdays === "" ? "---" : item.numberofdays,
      reasonforleave: item.reasonforleave,
      status: item.status,
      actionby: item.actionby,
    }));
    setItems(itemsWithSerialNumber);
    setFilteredDataItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [isApplyLeave]);

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
    if (gridRefTableLeaveApprved.current) {
      const gridApi = gridRefTableLeaveApprved.current.api;
      const currentPage = gridApi.paginationGetCurrentPage() + 1;
      const totalPagesLeaveApprved = gridApi.paginationGetTotalPages();
      setPageLeaveApprved(currentPage);
      setTotalPagesLeaveApprved(totalPagesLeaveApprved);
    }
  }, []);

  const columnDataTableLeaveApprved = [
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 80,
      hide: !columnVisibilityLeaveApprved.serialNumber,
      headerClassName: "bold-header", pinned: 'left', lockPinned: true,
    },
    { field: "employeeid", headerName: "Employee Id", flex: 0, width: 180, hide: !columnVisibilityLeaveApprved.employeeid, headerClassName: "bold-header", pinned: 'left', lockPinned: true, },
    { field: "employeename", headerName: "Employee Name", flex: 0, width: 180, hide: !columnVisibilityLeaveApprved.employeename, headerClassName: "bold-header", pinned: 'left', lockPinned: true, },
    { field: "leavetype", headerName: "Leave Type", flex: 0, width: 180, hide: !columnVisibilityLeaveApprved.leavetype, headerClassName: "bold-header", },
    { field: "date", headerName: "Date", flex: 0, width: 200, hide: !columnVisibilityLeaveApprved.date, headerClassName: "bold-header" },
    { field: "numberofdays", headerName: "Number of Days", flex: 0, width: 120, hide: !columnVisibilityLeaveApprved.numberofdays, headerClassName: "bold-header" },
    { field: "reasonforleave", headerName: "Reason for Leave", flex: 0, width: 250, hide: !columnVisibilityLeaveApprved.reasonforleave, headerClassName: "bold-header" },
    {
      field: isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin") ? "status" : "",
      headerName: isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin") ? "Status" : "",
      flex: 0,
      width: 110,
      hide: !columnVisibilityLeaveApprved.status,
      headerClassName: "bold-header",
      cellRenderer: (params) => {
        if (!(isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin")) && params.data.status === "Applied") {
          return (
            <Grid sx={{ display: 'flex' }}>
              <Button
                variant="contained"
                style={{
                  margin: '5px',
                  padding: "5px",
                  backgroundColor: "#FFC300",
                  color: "black",
                  fontSize: "10px",
                  width: "90px",
                  fontWeight: "bold",
                }}
              >
                {"Applied"}
              </Button>
            </Grid>
          );
        } else if (!(isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin")) && (params.data.status === "Approved" || params.data.status === "Rejected")) {
          return null;
        } else if (isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin")) {
          return (
            <Grid sx={{ display: 'flex' }}>
              <Button
                variant="contained"
                sx={{
                  margin: '5px',
                  padding: "5px",
                  backgroundColor: params.value === "Applied" ? "#FFC300" : params.value === "Rejected" ? "red" : params.value === "Approved" ? "green" : "inherit",
                  color: params.value === "Applied" ? "black" : params.value === "Rejected" ? "white" : "white",
                  fontSize: "10px",
                  width: "90px",
                  fontWeight: "bold",
                  '&:hover': {
                    backgroundColor: params.value === "Applied" ? "#FFC300" : params.value === "Rejected" ? "red" : params.value === "Approved" ? "green" : "inherit",
                    color: params.value === "Applied" ? "black" : params.value === "Rejected" ? "white" : "white",
                  }
                }}
              >
                {params.value}
              </Button>
            </Grid>
          );
        }
        return null; // or provide a default return if needed
      },
    },
    { field: isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin") ? "actionby" : "", headerName: isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin") ? "Approved By" : "", flex: 0, width: 170, hide: !columnVisibilityLeaveApprved.actionby, headerClassName: "bold-header" },
  ];

  // Datatable
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQueryLeaveApprved(value);
    applyNormalFilter(value);
    setFilteredRowData([]);
  };

  const applyNormalFilter = (searchValue) => {

    // Split the search query into individual terms
    const searchTerms = searchValue.toLowerCase().split(" ");

    // Modify the filtering logic to check each term
    const filtered = items?.filter((item) => {
      return searchTerms.every((term) =>
        Object.values(item).join(" ").toLowerCase().includes(term)
      );
    });
    setFilteredDataItems(filtered);
    setPageLeaveApprved(1);
  };

  const applyAdvancedFilter = (filters, logicOperator) => {
    // Apply filtering logic with multiple conditions
    const filtered = items?.filter((item) => {
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

    setFilteredDataItems(filtered); // Update filtered data
    setAdvancedFilter(filters);
    // handleCloseSearchLeaveApprved(); // Close the popover after search
  };

  // Undo filter funtion
  const handleResetSearch = () => {
    setAdvancedFilter(null);
    setSearchQueryLeaveApprved("");
    setFilteredDataItems(items);
  };

  // Show filtered combination in the search bar
  const getSearchDisplay = () => {
    if (advancedFilter && advancedFilter.length > 0) {
      return advancedFilter.map((filter, index) => {
        let showname = columnDataTableLeaveApprved.find(col => col.field === filter.column)?.headerName;
        return `${showname} ${filter.condition} "${filter.value}"`;
      }).join(' ' + (advancedFilter.length > 1 ? advancedFilter[1].condition : '') + ' ');
    }
    return searchQueryLeaveApprved;
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPagesLeaveApprved) {
      setPageLeaveApprved(newPage);
      gridRefTableLeaveApprved.current.api.paginationGoToPage(newPage - 1);
    }
  };

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setPageSizeLeaveApprved(newSize);
    if (gridApi) {
      gridApi.paginationSetPageSize(newSize);
    }
  };

  // Show All Columns functionality
  const handleShowAllColumns = () => {
    const updatedVisibility = { ...columnVisibilityLeaveApprved };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibilityLeaveApprved(updatedVisibility);
  };

  // Function to filter columns based on search query
  const filteredColumns = columnDataTableLeaveApprved.filter((column) => column.headerName.toLowerCase().includes(searchQueryManageLeaveApprved.toLowerCase()));

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

    setColumnVisibilityLeaveApprved((prevVisibility) => {
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

    setColumnVisibilityLeaveApprved((prevVisibility) => {
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
    setColumnVisibilityLeaveApprved((prevVisibility) => ({
      ...prevVisibility,
      [colId]: event.visible, // Set visibility directly from the event
    }));
  }, []);

  // Excel
  const [fileFormat, setFormat] = useState('');
  let exportColumnNamescrtEmployee = ["Employee Id", "Employee Name", "Leavetype", "Date", "Number of Days", "Reason for leave",]
  let exportRowValuescrtEmployee = ["employeeid", "employeename", "leavetype", "date", "numberofdays", "reasonforleave",]
  let exportColumnNamescrtHr = ["Employee Id", "Employee Name", "Leavetype", "Date", "Number of Days", "Reason for leave", "Status", "Approved By",]
  let exportRowValuescrtHr = ["employeeid", "employeename", "leavetype", "date", "numberofdays", "reasonforleave", "status", "actionby"]

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Leave Approved List",
    pageStyle: "print",
  });

  // image
  const handleCaptureImage = () => {
    if (gridRefImageLeaveApprved.current) {
      domtoimage.toBlob(gridRefImageLeaveApprved.current)
        .then((blob) => {
          saveAs(blob, "Leave Approved List.png");
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

    const startPage = Math.max(1, pageLeaveApprved - 1);
    const endPage = Math.min(totalPagesLeaveApprved, startPage + maxVisiblePages - 1);

    // Loop through and add visible pageLeaveApprved numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // If there are more pages after the last visible pageLeaveApprved, show ellipsis
    if (endPage < totalPagesLeaveApprved) {
      pageNumbers.push("...");
    }

    return pageNumbers;
  };

  // Pagination for outer filter
  const filteredData = filteredDataItems?.slice((pageLeaveApprved - 1) * pageSizeLeaveApprved, pageLeaveApprved * pageSizeLeaveApprved);
  const totalPagesLeaveApprvedOuter = Math.ceil(filteredDataItems?.length / pageSizeLeaveApprved);
  const visiblePages = Math.min(totalPagesLeaveApprvedOuter, 3);
  const firstVisiblePage = Math.max(1, pageLeaveApprved - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPagesLeaveApprvedOuter);
  const pageNumbers = [];
  const indexOfLastItem = pageLeaveApprved * pageSizeLeaveApprved;
  const indexOfFirstItem = indexOfLastItem - pageSizeLeaveApprved;
  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) { pageNumbers.push(i); }

  return (
    <Box>
      <Headtitle title={"Leave Approved List"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Leave Approved List"
        modulename="Leave&Permission"
        submodulename="Leave"
        mainpagename="Approved Leave"
        subpagename=""
        subsubpagename=""
      />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lapprovedleave") && (
        <>
          {(isUserRoleAccess?.role?.includes("Manager") ||
            isUserRoleCompare?.includes("lassignleaveapply")) ?
            <>
            </> : null}
          {/* List Filter */}
          <Box sx={userStyle.selectcontainer}>
            <Grid container spacing={2}>
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
                      handleCompanyChangeFilter(e);
                    }}
                    valueRenderer={customValueRendererCompanyFilter}
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
                      onChange={handleBranchChangeFilter}
                      valueRenderer={customValueRendererBranchFilter}
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
                      onChange={handleUnitChangeFilter}
                      valueRenderer={customValueRendererUnitFilter}
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
                      onChange={handleTeamChangeFilter}
                      valueRenderer={customValueRendererTeamFilter}
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
                          onChange={handleBranchChangeFilter}
                          valueRenderer={customValueRendererBranchFilter}
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
                            onChange={handleBranchChangeFilter}
                            valueRenderer={customValueRendererBranchFilter}
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
                            onChange={handleUnitChangeFilter}
                            valueRenderer={customValueRendererUnitFilter}
                            labelledBy="Please Select Branch"
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
                      onChange={(e) => { handleEmployeeChangeFilter(e); }}
                      valueRenderer={customValueRendererEmpFilter}
                      labelledBy="Please Select Employee"
                    />
                  </FormControl>
                </Grid>}
              <Grid item md={3} sm={12} xs={12} sx={{ display: "flex", flexDirection: "row" }}>
                <FormControl fullWidth size="small">
                  <Typography>Leave Type<b style={{ color: "red" }}>*</b> </Typography>
                  <MultiSelect
                    options={leaveTypeData}
                    value={selectedLeaveType}
                    onChange={(e) => { handleLeaveTypeChangeFilter(e); }}
                    valueRenderer={customValueRendererLeaveTypeFilter}
                    labelledBy="Please Select Leave Type"
                  />
                </FormControl>
              </Grid>
              {/* </Grid>
            <Grid container spacing={1}> */}
              <Grid item lg={1} md={2} sm={2} xs={6} >
                <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                  <Button sx={buttonStyles.buttonsubmit} variant="contained" onClick={handleSubmitFilter} > Filter </Button>
                </Box>
              </Grid>
              <Grid item lg={1} md={2} sm={2} xs={6}>
                <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                  <Button sx={buttonStyles.btncancel} onClick={handleClearFilter} > Clear </Button>
                </Box>
              </Grid>
            </Grid>
          </Box><br />
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Leave Approved List</Typography>
            </Grid>
            <Grid container spacing={2} style={userStyle.dataTablestyle}>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <label>Show entries:</label>
                  <Select
                    id="pageSizeSelect"
                    value={pageSizeLeaveApprved}
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
                    <MenuItem value={isApplyLeave?.length}>All</MenuItem>
                  </Select>
                </Box>
              </Grid>
              <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box>
                  {isUserRoleCompare?.includes("excelapprovedleave") && (
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        setFormat("xl")
                      }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvapprovedleave") && (
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        setFormat("csv")
                      }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("printapprovedleave") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfapprovedleave") && (
                    <>
                      <Button sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true)
                        }}
                      ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imageapprovedleave") && (
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                      {" "}
                      <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                    </Button>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={6} sm={6}>
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
                            <IoMdOptions style={{ cursor: 'pointer', }} onClick={handleClickSearchLeaveApprved} />
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
            </Grid><br />
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsLeaveApprved}>Manage Columns</Button> <br /> <br />
            {applyleaveCheck ? (
              <>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                </Box>
              </>
            ) : (
              <>
                <Box sx={{ width: "100%", }} className={"ag-theme-quartz"} ref={gridRefImageLeaveApprved} >
                  <AgGridReact
                    rowData={filteredDataItems}
                    columnDefs={columnDataTableLeaveApprved.filter((column) => columnVisibilityLeaveApprved[column.field])}
                    ref={gridRefTableLeaveApprved}
                    defaultColDef={defaultColDef}
                    domLayout={"autoHeight"}
                    getRowStyle={getRowStyle}
                    pagination={true}
                    paginationPageSize={pageSizeLeaveApprved}
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
                        (filteredDataItems.length > 0 ? (pageLeaveApprved - 1) * pageSizeLeaveApprved + 1 : 0)
                      ) : (
                        filteredRowData.length > 0 ? (pageLeaveApprved - 1) * pageSizeLeaveApprved + 1 : 0
                      )
                    }{" "}to{" "}
                    {
                      gridApi && gridApi.getFilterModel() && Object.keys(gridApi.getFilterModel()).length === 0 ? (
                        Math.min(pageLeaveApprved * pageSizeLeaveApprved, filteredDataItems.length)
                      ) : (
                        filteredRowData.length > 0 ? Math.min(pageLeaveApprved * pageSizeLeaveApprved, filteredRowData.length) : 0
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
                    <Button onClick={() => handlePageChange(1)} disabled={pageLeaveApprved === 1} sx={userStyle.paginationbtn}  > <FirstPageIcon /> </Button>
                    <Button onClick={() => handlePageChange(pageLeaveApprved - 1)} disabled={pageLeaveApprved === 1} sx={userStyle.paginationbtn}  > <NavigateBeforeIcon />  </Button>
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
                        className={pageLeaveApprved === pageNumber ? "active" : ""}
                        disabled={pageLeaveApprved === pageNumber}
                      >
                        {pageNumber}
                      </Button>
                    ))}
                    <Button onClick={() => handlePageChange(pageLeaveApprved + 1)} disabled={pageLeaveApprved === totalPagesLeaveApprved} sx={userStyle.paginationbtn} > <NavigateNextIcon /> </Button>
                    <Button onClick={() => handlePageChange(totalPagesLeaveApprved)} disabled={pageLeaveApprved === totalPagesLeaveApprved} sx={userStyle.paginationbtn} ><LastPageIcon /> </Button>
                  </Box>
                </Box> */}
              </>
            )}
          </Box>
        </>
      )}
      {/* Manage Column */}
      <Popover
        id={idLeaveApprved}
        open={isManageColumnsOpenLeaveApprved}
        anchorEl={anchorElLeaveApprved}
        onClose={handleCloseManageColumnsLeaveApprved}
        anchorOrigin={{ vertical: "bottom", horizontal: "left", }}
      >
        <ManageColumnsContent
          handleClose={handleCloseManageColumnsLeaveApprved}
          searchQuery={searchQueryManageLeaveApprved}
          setSearchQuery={setSearchQueryManageLeaveApprved}
          filteredColumns={filteredColumns}
          columnVisibility={columnVisibilityLeaveApprved}
          toggleColumnVisibility={toggleColumnVisibility}
          setColumnVisibility={setColumnVisibilityLeaveApprved}
          initialColumnVisibility={initialColumnVisibilityLeaveApprved}
          columnDataTable={columnDataTableLeaveApprved}
        />
      </Popover>

      {/* Search Bar */}
      <Popover
        id={idSearchLeaveApprved}
        open={openSearchLeaveApprved}
        anchorEl={anchorElSearchLeaveApprved}
        onClose={handleCloseSearchLeaveApprved}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
      >
        <AdvancedSearchBar columns={columnDataTableLeaveApprved} onSearch={applyAdvancedFilter} initialSearchValue={searchQueryLeaveApprved} handleCloseSearch={handleCloseSearchLeaveApprved} />
      </Popover>

      {/* ALERT DIALOG */}
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
        itemsTwo={items ?? []}
        filename={"Leave Approved List"}
        exportColumnNames={!(isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin")) ? exportColumnNamescrtEmployee : exportColumnNamescrtHr}
        exportRowValues={!(isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin")) ? exportRowValuescrtEmployee : exportRowValuescrtHr}
        componentRef={componentRef}
      />
    </Box>
  );
}

export default ApprovedLeave;