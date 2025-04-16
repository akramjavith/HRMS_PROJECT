import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, Dialog, TableCell, Popover, Checkbox, TextField, ListItem, IconButton, Select, MenuItem, List, TableRow, ListItemText, DialogContent, TableBody, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaFileCsv, FaFileExcel, FaPrint, FaFilePdf } from "react-icons/fa";
import { SERVICE } from "../../../services/Baseservice";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import "jspdf-autotable";
import PageHeading from "../../../components/PageHeading";
import { MultiSelect } from "react-multi-select-component";
import { handleApiError } from "../../../components/Errorhandling";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import { saveAs } from "file-saver";
import ImageIcon from "@mui/icons-material/Image";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import LoadingButton from "@mui/lab/LoadingButton"
import { useNavigate } from "react-router-dom";
import AlertDialog from "../../../components/Alert";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../../components/DeleteConfirmation.js";
import ExportData from "../../../components/ExportData";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert";
import domtoimage from 'dom-to-image';
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";


function Company() {

  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTable = useRef(null);


  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    // setSubmitLoader(false);
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
      pagename: String("Setup/Hierarchy/Not Assign Hierarchy List"),
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

  let exportColumnNames = ['Designationgroup',
    'Department',
    'Company',
    'Branch',
    'Unit',
    'Team',
    'Mode',
    'Level',
    'Control Name',];
  let exportRowValues = [
    'designationgroup',
    'department',
    'company',
    'branch',
    'unit',
    'team',
    'mode',
    'level',
    'control',
  ];

  const gridRef = useRef(null);
  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, allTeam, pageName,
    setPageName,
    buttonStyles, } = useContext(UserRoleAccessContext);
  const [notAssignHierarchy, setNotAssignHierarchy] = useState([]);
  const navigate = useNavigate();
  //Datatable...
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { auth } = useContext(AuthContext);

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  const [isLoader, setIsloader] = useState(false);
  const [overallExcelDatas, setOverallExcelDatas] = useState([])
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
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
  const accessbranch = isAssignBranch
    ?.map((data) => ({
      branch: data.branch,
      company: data.company,
      unit: data.unit,
    }))
  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  // Newly Added baservice for FIlter
  const [btnSubmit, setBtnSubmit] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [designationGroup, setDesignationGroup] = useState([]);
  const [controlNames, setControlNames] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([])
  const [departmentsValues, setDepartmentsValue] = useState([])
  const [selectedDesignation, setSelectedDesignations] = useState([])
  const [designationValues, setDesignationValue] = useState([])
  const [selectedDesignationGroup, setSelectedDesignationGroup] = useState([])
  const [designationGroupValues, setDesignationGroupValue] = useState([]);
  const [selectedControlNames, setSelectedControlNames] = useState([])
  const [controlNameValues, setControlNameValues] = useState([]);

  const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
  let [valueCompanyCat, setValueCompanyCat] = useState([]);

  const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
  let [valueBranchCat, setValueBranchCat] = useState([]);

  const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
  let [valueUnitCat, setValueUnitCat] = useState([]);

  const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
  let [valueTeamCat, setValueTeamCat] = useState([]);
  const [selectedEmployeeFrom, setSelectedEmployeeFrom] = useState([]);
  let [valueEmployee, setValueEmployee] = useState([]);


  const handleCompanyChange = (options) => {
    setValueCompanyCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCompany(options);
    // fetchBranchAll(options)
  };

  const handleBranchChange = (options) => {
    setValueBranchCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBranch(options);
    // fetchUnitAll(options)
  };

  const handleUnitChange = (options) => {
    setValueUnitCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsUnit(options);
    // fetchTeamAll(options)
  };

  const handleTeamChange = (options) => {
    setValueTeamCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsTeam(options);
  };
  const handleDepartmentChange = (options) => {
    setDepartmentsValue(
      options.map((a, index) => {
        return a.value;
      })
    );
    const values = options?.map((a, index) => {
      return a.value;
    })
    fetchDepartmentsDesigGrouping(values)
    setSelectedDepartments(options);
    setSelectedDesignations([])
    setDesignationValue([])
    setSelectedDesignationGroup([])
    setDesignationGroupValue([])
  };
  const handleDesignationChange = (options) => {
    setDesignationValue(
      options.map((a, index) => {
        return a.value;
      })
    );
    const values = options?.map((a, index) => {
      return a.value;
    })
    fetchDesignationGroup(values)
    setSelectedDesignations(options);
    setSelectedDesignationGroup([])
    setDesignationGroupValue([])

  };
  const handleDesignationGroupChange = (options) => {
    setDesignationGroupValue(
      options.map((a, index) => {
        return a.value;
      })
    );
    const values = options?.map((a, index) => {
      return a.value;
    })
    fetchDeignationgroupControls(values)
    setSelectedDesignationGroup(options);
  };
  const handleControlNameChange = (options) => {
    setControlNameValues(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedControlNames(options);
  };


  const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
    return valueCompanyCat?.length
      ? valueCompanyCat.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
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
  const customValueRenderreDepartments = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length
      ? valueTeamCat.map(({ label }) => label)?.join(", ")
      : "Please Select Departments";
  };
  const customValueRendererDesignation = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length
      ? valueTeamCat.map(({ label }) => label)?.join(", ")
      : "Please Select Designations";
  };
  const customValueRendererDesiggroup = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length
      ? valueTeamCat.map(({ label }) => label)?.join(", ")
      : "Please Select Designation Groups";
  };
  const customValueRendererControlNames = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length
      ? valueTeamCat.map(({ label }) => label)?.join(", ")
      : "Please Select Control Names";
  };


  //auto select all dropdowns
  const handleAutoSelect = async () => {
    setPageName(!pageName);
    try {
      let selectedValues = isAssignBranch
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
      setValueTeamCat(selectedTeam);
      setSelectedOptionsTeam(mappedTeam);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };




  useEffect(() => {
    handleAutoSelect();
  }, [isAssignBranch]);




  // get all branches
  const fetchOverallExcelDatas = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.NOTASSIGN_HIERARCHY_DEISGNATIONLOG, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assignbranch: accessbranch,
      });
      setOverallExcelDatas(res?.data?.combinedResultsArray);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  // get all branches
  const fetchDepartments = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.DEPARTMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const dept = res?.data?.departmentdetails?.length > 0 ? res?.data?.departmentdetails?.map(data => ({
        ...data,
        label: data.deptname,
        value: data.deptname
      })) : []
      setDepartments(dept)
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const fetchDepartmentsDesigGrouping = async (depart) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.DEPARTMENTANDDESIGNATIONGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const filteredDesignation = res?.data?.departmentanddesignationgroupings?.length > 0 ?
        res?.data?.departmentanddesignationgroupings?.filter(data => depart?.includes(data?.department)) : []
      const dept = filteredDesignation?.length > 0 ? filteredDesignation?.map(data => ({
        ...data,
        label: data.designation,
        value: data.designation
      })).filter((item, index, self) => {
        return (
          self.findIndex(
            (i) =>
              i.label === item.label && i.value === item.value
          ) === index
        );
      }) : []
      setDesignations(dept)
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };


  const fetchDesignationGroup = async (designation) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.DESIGNATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const filteredDesignation = res?.data?.designation?.length > 0 ?
        res?.data?.designation?.filter(data => designation?.includes(data?.name)) : []
      const dept = filteredDesignation?.length > 0 ? filteredDesignation?.map(data => ({
        ...data,
        label: data.group,
        value: data.group
      })).filter((item, index, self) => {
        return (
          self.findIndex(
            (i) =>
              i.label === item.label && i.value === item.value
          ) === index
        );
      }) : []
      setDesignationGroup(dept)
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const fetchDeignationgroupControls = async (desiggroup) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.DESIGNATIONCONTROLGROUPINGGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const filteredDesignation = res?.data?.designationandcontrolgroupings?.length > 0 ?
        res?.data?.designationandcontrolgroupings?.filter(data => desiggroup?.includes(data?.designationgroupname)) : []
      const dept = filteredDesignation?.length > 0 ? filteredDesignation?.map(data => ({
        ...data,
        label: data.controlname,
        value: data.controlname
      })).filter((item, index, self) => {
        return (
          self.findIndex(
            (i) =>
              i.label === item.label && i.value === item.value
          ) === index
        );
      }) : []
      setControlNames(dept)
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };


  useEffect(() => {
    fetchOverallExcelDatas();
  }, [isFilterOpen])


  const fetchFilteredNotAssign = async () => {
    setIsloader(true);
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.NOTASSIGN_HIERARCHY_DEISGNATIONLOG_FILTERED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assignbranch: accessbranch,
        company: valueCompanyCat,
        branch: valueBranchCat,
        unit: valueUnitCat,
        team: valueTeamCat,
        department: departmentsValues,
        designation: designationValues,
        designationgroup: designationGroupValues,
        controls: controlNameValues,
      });
      const answer = res?.data?.filteredAnswer?.length > 0 ?
        res?.data?.filteredAnswer?.map((item, index) =>
          ({ ...item, id: index, mode: "All", serialNumber: index + 1 })) : [];

      setNotAssignHierarchy(answer);
      setIsloader(false);
    } catch (err) { setIsloader(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  useEffect(() => {
    // fetchAllnothierarchylistdata();
    fetchDepartments([])

  }, []);

  //table entries ..,.
  const [items, setItems] = useState([]);

  const addSerialNumber = (data) => {
    setItems(data);
  };

  useEffect(() => {
    addSerialNumber(notAssignHierarchy);
  }, [notAssignHierarchy]);

  let fileName = "Not_Assign_Hierarchy_Data";

  //print...
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Not_Assign_Hierarchy_Data",
    pageStyle: "print",
  });

  //image
  const gridRefTableImg = useRef(null);
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Not Assign Hierarchy List.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };



  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
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
    designationgroup: true,
    designation: true,
    department: true,
    company: true,
    branch: true,
    unit: true,
    team: true,
    mode: true,
    level: true,
    control: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

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
    setPage(1);
  };

  // Split the search query into individual terms
  const searchTerms = searchQuery.toLowerCase().split(" ");

  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(filteredDatas?.length / pageSize);

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
      pinned: "left",
      //lockPinned: true,
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 80,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    { field: "designationgroup", headerName: "Designation Group", flex: 0, width: 150, hide: !columnVisibility.designationgroup, headerClassName: "bold-header" },
    { field: "designation", headerName: "Designation", flex: 0, width: 150, hide: !columnVisibility.designation, headerClassName: "bold-header" },
    { field: "department", headerName: "Department", flex: 0, width: 150, hide: !columnVisibility.department, headerClassName: "bold-header" },
    { field: "company", headerName: "Company", flex: 0, width: 150, hide: !columnVisibility.company, headerClassName: "bold-header" },
    { field: "branch", headerName: "Branch", flex: 0, width: 150, hide: !columnVisibility.branch, headerClassName: "bold-header" },
    { field: "unit", headerName: "Unit", flex: 0, width: 150, hide: !columnVisibility.unit, headerClassName: "bold-header" },
    { field: "team", headerName: "Team", flex: 0, width: 150, hide: !columnVisibility.team, headerClassName: "bold-header" },
    { field: "mode", headerName: "Mode", flex: 0, width: 70, hide: !columnVisibility.mode, headerClassName: "bold-header" },
    { field: "level", headerName: "Level", flex: 0, width: 90, hide: !columnVisibility.level, headerClassName: "bold-header" },
    { field: "control", headerName: "Control Name", flex: 0, width: 120, hide: !columnVisibility.control, headerClassName: "bold-header" },

    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 180,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("enotassignhierarchylist") && (
            <Button
              sx={buttonStyles.buttonsubmit}
              variant="contained"
              size="small"
              onClick={() => { navigate(`/setup/hierarchy/edit/${params?.data?.id}`, { state: params.data }) }}
            >
              Assign
            </Button>

          )}
        </Grid>
      ),
    },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item.id,
      serialNumber: item.serialNumber,
      designationgroup: item.designationgroup,
      designation: item.designation,
      department: item.department,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      mode: item.mode,
      level: item.level,
      control: item.control,
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
    <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
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
        <TextField label="Find column" variant="standard" fullWidth value={searchQueryManage} onChange={(e) => setSearchQueryManage(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
      </Box>
      <br />
      <br />
      <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumns.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />}
                secondary={column.field === "checkbox" ? "Checkbox" : column.headerName}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Grid container>
          <Grid item md={4}>
            <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibility(initialColumnVisibility)}>
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

  const handleSubmitFilter = () => {
    const answerCheck = [valueCompanyCat, valueBranchCat, valueUnitCat, valueTeamCat,
      departmentsValues, designationValues, designationGroupValues, controlNameValues
    ]
    const duplicates = answerCheck?.some(data => data?.length > 0)
    if (!duplicates) {
      setPopupContentMalert('Please Select Atleast One Field');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      fetchFilteredNotAssign();
    }
  }
  const handleClear = async () => {
    setSelectedOptionsCompany([]);
    setValueCompanyCat([])
    setSelectedOptionsBranch([])
    setValueBranchCat([])
    setSelectedOptionsUnit([])
    setValueUnitCat([])
    setSelectedOptionsTeam([])
    setValueTeamCat([])
    setSelectedDepartments([])
    setDepartmentsValue([])
    setSelectedDesignations([])
    setDesignationValue([])
    setSelectedDesignationGroup([])
    setDesignationGroupValue([])
    setSelectedControlNames([])
    setControlNameValues([])
    setDesignations([])
    setDesignationGroup([])
    setControlNames([])
    // await fetchAllnothierarchylistdata();
    setPopupContent('Cleared Successfully');
    setPopupSeverity("success");
    handleClickOpenPopup();
  }

  return (
    <Box>
      <Headtitle title={"Not Assign Hierarchy List"} />
      <PageHeading
        title="Not Assign Hierarchy list"
        modulename="Setup"
        submodulename="Hierarchy"
        mainpagename="Not Assign Hierarchy list"
        subpagename=""
        subsubpagename=""
      />
      {/* ****** Header Content ****** */}

      <br />
      {isUserRoleCompare?.includes("lnotassignhierarchylist") && (
        <>
          <Box sx={userStyle.container}>
            <Typography sx={userStyle.SubHeaderText}> Not Assign Hierarchy List </Typography>
            <br />
            <br />
            <Box>
              <Grid container spacing={2}>
                <>
                  <Grid item md={3} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Company
                      </Typography>
                      <MultiSelect
                        options={isAssignBranch
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
                          setSelectedOptionsBranch([]);
                          setValueBranchCat([]);
                          setValueUnitCat([]);
                          setValueTeamCat([]);
                          setSelectedOptionsUnit([]);
                          setSelectedOptionsTeam([]);
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
                        options={isAssignBranch
                          ?.filter((comp) => {
                            let datas = selectedOptionsCompany?.map(
                              (item) => item?.value
                            );
                            return datas?.includes(comp.company);
                          })
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
                        value={selectedOptionsBranch}
                        onChange={(e) => {
                          handleBranchChange(e);
                          setSelectedOptionsTeam([]);
                          setSelectedOptionsUnit([]);
                          setValueUnitCat([]);
                          setValueTeamCat([]);

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
                        options={isAssignBranch
                          ?.filter((comp) => {
                            let compdatas = selectedOptionsCompany?.map(
                              (item) => item?.value
                            );
                            let branchdatas = selectedOptionsBranch?.map(
                              (item) => item?.value
                            );
                            return (
                              compdatas?.includes(comp.company) &&
                              branchdatas?.includes(comp.branch)
                            );
                          })
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
                        value={selectedOptionsUnit}
                        onChange={(e) => {
                          handleUnitChange(e);
                          setValueTeamCat([]);
                          setSelectedOptionsTeam([]);

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
                        options={allTeam
                          ?.filter((comp) => {
                            let compdatas = selectedOptionsCompany?.map(
                              (item) => item?.value
                            );
                            let branchdatas = selectedOptionsBranch?.map(
                              (item) => item?.value
                            );
                            let unitdatas = selectedOptionsUnit?.map(
                              (item) => item?.value
                            );
                            return (
                              compdatas?.includes(comp.company) &&
                              branchdatas?.includes(comp.branch) &&
                              unitdatas?.includes(comp.unit)
                            );
                          })
                          ?.map((data) => ({
                            label: data.teamname,
                            value: data.teamname,
                          }))
                          .filter((item, index, self) => {
                            return (
                              self.findIndex(
                                (i) =>
                                  i.label === item.label && i.value === item.value
                              ) === index
                            );
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
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Department
                      </Typography>
                      <MultiSelect
                        options={departments}
                        value={selectedDepartments}
                        onChange={(e) => {
                          handleDepartmentChange(e);
                        }}
                        valueRenderer={customValueRenderreDepartments}
                        labelledBy="Please Select Departments"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Designation
                      </Typography>
                      <MultiSelect
                        options={designations}
                        value={selectedDesignation}
                        onChange={(e) => {
                          handleDesignationChange(e);
                        }}
                        valueRenderer={customValueRendererDesignation}
                        labelledBy="Please Select Designation"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Designation Group
                      </Typography>
                      <MultiSelect
                        options={designationGroup}
                        value={selectedDesignationGroup}
                        onChange={handleDesignationGroupChange}
                        valueRenderer={customValueRendererDesiggroup}
                        labelledBy="Please Select Designation Groups"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Control
                      </Typography>
                      <MultiSelect
                        options={controlNames}
                        value={selectedControlNames}
                        onChange={(e) => {
                          handleControlNameChange(e);
                        }}
                        valueRenderer={customValueRendererControlNames}
                        labelledBy="Please Select Ticket Status"
                      />
                    </FormControl>
                  </Grid>
                </>

              </Grid> <br></br>
              <Grid container spacing={2}>
                <Grid item md={2} xs={12} sm={12}>
                  <LoadingButton variant="contained" loading={btnSubmit}
                    sx={buttonStyles.buttonsubmit}
                    onClick={handleSubmitFilter}
                  >Filter</LoadingButton>
                </Grid>
                <Grid item md={2} xs={12} sm={12}>
                  <Button sx={buttonStyles.btncancel}
                    onClick={handleClear}
                  >Clear</Button>
                </Grid>
              </Grid>
            </Box>
            <br /><br />
            {/* ****** Header Buttons ****** */}

            <Grid container spacing={2} style={userStyle.dataTablestyle}>
              <Grid item md={2} xs={12} sm={12}>
                <label>Show entries:</label>
                <Select id="pageSizeSelect" value={pageSize} onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                  <MenuItem value={notAssignHierarchy?.length}>All</MenuItem>
                </Select>

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
                {isUserRoleCompare?.includes("excelnotassignhierarchylist") && (
                  <>
                    <Button onClick={(e) => {
                      setIsFilterOpen(true)
                      fetchOverallExcelDatas()
                      setFormat("xl")
                    }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                  </>
                )}
                {isUserRoleCompare?.includes("csvnotassignhierarchylist") && (
                  <>
                    <Button onClick={(e) => {
                      setIsFilterOpen(true)
                      fetchOverallExcelDatas()
                      setFormat("csv")
                    }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                  </>
                )}
                {isUserRoleCompare?.includes("printnotassignhierarchylist") && (
                  <>
                    <Button sx={userStyle.buttongrp} onClick={handlePrint}>
                      &ensp;
                      <FaPrint />
                      &ensp;Print&ensp;
                    </Button>
                  </>
                )}
                {isUserRoleCompare?.includes("pdfnotassignhierarchylist") && (
                  <>
                    <Button sx={userStyle.buttongrp}
                      onClick={() => {
                        setIsPdfFilterOpen(true)
                        fetchOverallExcelDatas()
                      }}                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                  </>
                )}
                {isUserRoleCompare?.includes("pdfnotassignhierarchylist") && (
                  <>
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                      {" "}
                      <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                    </Button>
                  </>
                )}
              </Grid>



              <Grid item md={2} xs={12} sm={12}>
                <AggregatedSearchBar
                  columnDataTable={columnDataTable}
                  setItems={setItems}
                  addSerialNumber={addSerialNumber}
                  setPage={setPage}
                  maindatas={notAssignHierarchy}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                  totalDatas={items}
                />
              </Grid>
            </Grid>
            <br />

            {/* ****** Table start ****** */}
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
              Show All Columns
            </Button>
            &ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
              Manage Columns
            </Button>
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
            &ensp;
            <br />
            <br />
            <Box
              style={{
                width: "100%",
                height: "100%",
                overflowY: "hidden", // Hide the y-axis scrollbar
              }}
            >
              {/* <StyledDataGrid
                    rows={rowsWithCheckboxes}
                    ref={gridRef}
                    columns={columnDataTable.filter((column) => columnVisibility[column.field])}
                    onSelectionModelChange={handleSelectionChange}
                    selectionModel={selectedRows}
                    autoHeight={true}
                    density="compact"
                    hideFooter
                    getRowClassName={getRowClassName}
                    disableRowSelectionOnClick
                  /> */}
              {isLoader ? (
                <>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
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
                    searchQuery={searchedString}
                    handleShowAllColumns={handleShowAllColumns}
                    setFilteredRowData={setFilteredRowData}
                    filteredRowData={filteredRowData}
                    setFilteredChanges={setFilteredChanges}
                    filteredChanges={filteredChanges}
                    gridRefTableImg={gridRefTableImg}
                    itemsList={notAssignHierarchy}
                  />

                </>
              )}
            </Box>

            {/* ****** Table End ****** */}
          </Box>
        </>
      )}

      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleCloseerr} sx={buttonStyles.buttonsubmit}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      {/* EXTERNAL COMPONENTS -------------- START */}
      {/* VALIDATION */}
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
        itemsTwo={notAssignHierarchy ?? []}
        filename={"Not Assign Hierarchy List"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
    </Box>
  );
}

export default Company;