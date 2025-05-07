import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
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
  Paper,
  Popover,
  Select,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TextField,
  Typography
} from "@mui/material";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFilePdf, FaPrint } from "react-icons/fa";
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../../../components/Errorhandling";
import Headtitle from "../../../../components/Headtitle";
import PageHeading from "../../../../components/PageHeading";
import { StyledTableCell, StyledTableRow } from "../../../../components/Table";
import { AuthContext, UserRoleAccessContext } from "../../../../context/Appcontext";
import { colourStyles, userStyle } from "../../../../pageStyle";
import { SERVICE } from "../../../../services/Baseservice";

import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import Switch from "@mui/material/Switch";
import { saveAs } from "file-saver";
import { ThreeDots } from "react-loader-spinner";

import domtoimage from 'dom-to-image';
import * as FileSaver from "file-saver";
import { FaFileCsv, FaFileExcel } from "react-icons/fa";
import * as XLSX from "xlsx";
import AggregatedSearchBar from '../../../../components/AggregatedSearchBar';
import AggridTable from "../../../../components/AggridTable";
import AlertDialog from "../../../../components/Alert";
import ExportData from "../../../../components/ExportData";
import MessageAlert from "../../../../components/MessageAlert";

function WorkstationUnassigned() {
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);

  const [overallItems, setOverallItems] = useState([]);
  let exportColumnNames = [
    'Company',
    'Branch',
    'Unit',
    'Floor',
    'Area',
    'Location',
    'Maincabin',
    'Subcabin Name',
    'Subsubcabin Name',
    'System Short Name'
  ];
  let exportRowValues = [
    'company',
    'branch',
    'unit',
    'floor',
    'area',
    'location',
    'maincabin',
    'subcabinname',
    'subsubcabinname',
    'systemshortname'
  ];

  const [isHandleChange, setIsHandleChange] = useState(false);
  const [searchedString, setSearchedString] = useState("")

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
    workStationSystemName
  } = useContext(UserRoleAccessContext);

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

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { auth } = useContext(AuthContext);

  useEffect(() => {
    fetchWorkStation();

  }, []);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [workStationOpt, setWorkStationOpt] = useState([]);

  const [isBankdetail, setBankdetail] = useState(false);

  let username = isUserRoleAccess.username;

  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");


  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Unassigned Workstation Report.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  //for assigning workstation
  const [teams, setTeams] = useState([]);

  const [employeeOptions, setEmployeeOptions] = useState([]);

  const [employee, setEmployee] = useState({
    employee: "Please Select Employee",
    employeeId: "",
  });

  //teams multiselcest add
  const [selectedOptionsTeamAdd, setSelectedOptionsTeamAdd] = useState([]);
  let [valueTeamAdd, setValueTeamAdd] = useState("");

  //for workstation value get
  const [subsubcabinname, setSubsubcabinname] = useState({
    company: "",
    branch: "",
    unit: "",
    subsubcabinname: "",
  });

  //team multiselect
  const handleTeamChangeAdd = (options) => {
    setValueTeamAdd(
      options.map((a, index) => {
        return a.value;
      })
    );
    fetchEmployees(options);
    setSelectedOptionsTeamAdd(options);
    // setEmployeeOptions([]);
    setEmployee({
      employee: "Please Select Employee",
    });
  };

  const customValueRendererTeamAdd = (valueTeamAdd, _teams) => {
    return valueTeamAdd.length ? (
      valueTeamAdd.map(({ label }) => label)?.join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Team</span>
    );
  };

  // get all employees in the respective company
  const fetchEmployees = async (team) => {
    setPageName(!pageName);
    try {
      let arr = [];
      allUsersData.map((t) => {
        team.forEach((d) => {
          if (
            d.value == t.team &&
            subsubcabinname.company === t.company &&
            subsubcabinname.branch === t.branch
          ) {
            arr.push(t);
          }
        });
      });
      let filteredDatas = arr.map((t) => ({
        ...t,
        label: t.companyname,
        value: t.companyname,
        id: t._id,
      })).filter((item) => (productionDepartment?.includes(item?.department)));
      // console.log(filteredDatas,"filteredDatas")
      setEmployeeOptions(
        filteredDatas
      );
      // productionDepartment
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };


  const getCode = async (e, company, branch, unit, floor) => {
    setSubsubcabinname({
      company: company,
      branch: branch,
      subsubcabinname: e,
      unit: unit,
      floor: floor,
    });
    let filteredTeams = allTeam.filter((team) => {
      return (
        team.branch === branch && team.company === company && team.unit === unit
      );
    });
    setTeams(
      filteredTeams.map((t) => ({
        label: t.teamname,
        value: t.teamname,
      }))
    );
    handleClickOpenEdit();
  };

  // submit option for saving....
  const handleSubmit = (e) => {
    //fetchUser();
    e.preventDefault();

    if (subsubcabinname.company === "") {
      setPopupContentMalert('Company is missing');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (subsubcabinname.branch === "") {
      setPopupContentMalert('Branch is missing');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (subsubcabinname.unit === "") {
      setPopupContentMalert('Unit is missing');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsTeamAdd.length === 0) {
      setPopupContentMalert('Please Select Team');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      employee.employee === "Please Select Employee" ||
      employee.employee === "" ||
      employee.employee === undefined
    ) {
      setPopupContentMalert('Please Select Employee');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };

  // post call
  const sendRequest = async () => {
    setPageName(!pageName);
    try {
      let singleUser = await axios.get(
        `${SERVICE.USER_SINGLE}/${employee.employeeId}`
      );
      let isEmployeeCountEqual = Number(singleUser?.data?.suser?.employeecount) === singleUser?.data?.suser?.workstation?.length;
      if (isEmployeeCountEqual) {
        setPopupContentMalert('Allotted Workstation Limit is Reached');
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else {
        let assignbranches = await axios.put(
          `${SERVICE.USER_SINGLE_PWD}/${employee.employeeId}`,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            workstation: [
              ...singleUser.data.suser.workstation,
              subsubcabinname.subsubcabinname +
              "(" +
              subsubcabinname.branch +
              "-" +
              subsubcabinname.floor +
              ")",
            ],
            updatedby: [
              {
                name: String(isUserRoleAccess.companyname),
                date: String(new Date()),
              },
            ],
          }
        );
        await fetchEmployee();
        setEmployee({
          employee: "Please Select Employee",
        });
        setPopupContent("Added Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
        handleCloseModEdit();
      }


    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchWorkStation = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.WORKSTATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setWorkStationOpt(res?.data?.locationgroupings);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
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
    company: true,
    branch: true,
    unit: true,
    floor: true,
    area: true,
    location: true,
    maincabin: true,
    subcabinname: true,
    subsubcabinname: true,
    systemshortname: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  const [userReport, setUserReport] = useState({
    company: "",
    branch: "",
    unit: "",
    floor: "",
    area: "",
    location: "",
    maincabin: "",
    subcabinname: "",
    subsubcabinname: "",
  });

  // get single row to view....
  const getinfoCode = async (e) => {
    setUserReport(e);
    handleClickOpenInfo();
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  const handleClickOpenInfo = () => {
    setOpenview(true);
  };

  // Edit model
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    setTeams([]);
    setEmployeeOptions([])
    setSelectedOptionsTeamAdd([])
    setEmployee({
      employee: "Please Select Employee",
      employeeId: "",
    });
  };
  const [allAssignCompany, setAllAssignCompany] = useState([]);
  const [allAssignBranch, setAllAssignBranch] = useState([]);
  const [allAssignUnit, setAllAssignUnit] = useState([]);


  //get all employees list details
  const fetchEmployee = async () => {
    setPageName(!pageName);
    setBankdetail(true);
    try {
      const aggregationPipeline = [
        {
          $match: {
            $and: [
              // Bank details filter

              // Enquiry status filter
              {
                enquirystatus: {
                  $nin: ["Enquiry Purpose"],
                },
              },
              // Reasonable status filter
              {
                resonablestatus: {
                  $nin: [
                    "Not Joined",
                    "Postponed",
                    "Rejected",
                    "Closed",
                    "Releave Employee",
                    "Absconded",
                    "Hold",
                    "Terminate",
                  ],
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

            ],
          },
        },
        {
          $project: {
            company: 1,
            branch: 1,
            unit: 1,
            floor: 1,
            empcode: 1,
            companyname: 1,
            workstation: 1,
            cabinname: 1,
            employeecount: 1
          },
        },
      ];

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

      let exactWorkstation = [];
      let exactWorkstaionobjects = [];
      let res_workstations = await axios.get(SERVICE.WORKSTATION);
      res_workstations?.data?.locationgroupings.forEach((workstation) => {
        workstation.combinstation.forEach((combinstation) => {
          combinstation.subTodos.forEach((finalcabin) => {
            exactWorkstation.push(
              `${workstation.company}_${workstation.branch}_${workstation.unit}_${finalcabin.subcabinname}(${workstation.branch}-${workstation.floor})`
            );
            exactWorkstaionobjects.push({
              _id: finalcabin._id,
              company: workstation.company,
              branch: workstation.branch,
              unit: workstation.unit,
              floor: workstation.floor,
              area: workstation.area,
              location: workstation.location,
              maincabin: workstation.maincabin,
              subcabinname: combinstation.cabinname,
              subsubcabinname: finalcabin.subcabinname,
              checking: `${workstation.company}_${workstation.branch}_${workstation.unit}_${finalcabin.subcabinname}(${workstation.branch}-${workstation.floor})`,
            });
          });
        });
      });
      let uniqueExactWorkstation = [...new Set(exactWorkstation)];
      let data_emp = response.data.users?.filter((data) => {
        return (
          Array.isArray(data.workstation) &&
          data.workstation.length !== 0 &&
          !data.workstation.includes("undefined") &&
          !data.workstation.includes("") &&
          !data.workstation.includes(undefined) &&
          !data.workstation.includes(null)
        );
      });
      let exactAssignedWorkstation = [];
      data_emp.forEach((data) => {
        data.workstation.forEach((workstation) => {
          exactAssignedWorkstation.push(
            `${data.company}_${data.branch}_${data.unit}_${workstation}`
          );
        });
      });

      let uniqueExactAssignedWorkstation = [
        ...new Set(exactAssignedWorkstation),
      ];
      let unAssignedWorkstations = uniqueExactWorkstation.filter(
        (exactworkstation) => {
          return !uniqueExactAssignedWorkstation.includes(exactworkstation);
        }
      );

      let finalUnassignedWorkstationsObject = exactWorkstaionobjects.filter(
        (data) => {
          return unAssignedWorkstations.some((obj) => data.checking === obj);
        }
      );

      // Assuming `documents` is your array of objects that you want to filter
      const filteredDocuments = finalUnassignedWorkstationsObject.filter(
        (doc) => {
          // Check for company condition
          const companyMatch =
            valueCompanyCat.length > 0
              ? valueCompanyCat.includes(doc.company)
              : allAssignCompany.includes(doc.company);

          // Check for branch condition
          const branchMatch =
            valueBranchCat.length > 0
              ? valueBranchCat.includes(doc.branch)
              : allAssignBranch.includes(doc.branch);

          // Check for unit condition
          const unitMatch =
            valueUnitCat.length > 0
              ? valueUnitCat.includes(doc.unit)
              : allAssignUnit.includes(doc.unit);

          // Return true if all conditions are met
          return companyMatch && branchMatch && unitMatch;
        }
      );

      const responseDataUsers = filteredDocuments;
      const workstationSystems = workStationSystemName;

      responseDataUsers.forEach(user => {
        const matchingSystem = workstationSystems.find(system =>
          system.company === user.company &&
          system.branch === user.branch &&
          system.unit === user.unit &&
          (user?.floor === "" || user?.floor === system?.floor) &&
          system.cabinname === user.subsubcabinname
        );

        // If a match is found, add the systemshortname property
        if (matchingSystem) {
          user.systemshortname = matchingSystem.systemshortname;
        }
      });

      setEmployees(responseDataUsers);
      setBankdetail(false);
    } catch (err) {
      console.log(err);
      setBankdetail(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
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
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = fileFormat === "xl" ? ".xlsx" : ".csv";

  const exportToExcel = (excelData, fileName) => {
    setPageName(!pageName);
    try {
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

      // Check if the browser supports Blob and FileSaver
      if (!Blob || !FileSaver) {
        console.error("Blob or FileSaver not supported");
        return;
      }

      const data = new Blob([excelBuffer], { type: fileType });

      // Check if FileSaver.saveAs is available
      if (!FileSaver.saveAs) {
        console.error("FileSaver.saveAs is not available");
        return;
      }

      FileSaver.saveAs(data, fileName + fileExtension);
    } catch (error) {
      console.error("Error exporting to Excel", error);
    }
  };

  const formatData = (data) => {
    return data.map((item, index) => {
      return {
        Sno: index + 1,
        Company: item.company || "",
        Branch: item.branch || "",
        Unit: item.unit || "",
        Floor: item.floor || "",
        Area: item.area || "",
        Location: item.location || "",
        Maincabin: item.maincabin || "",
        Subcabin: item.subcabinname || "",
        Subsubcabin: item.subsubcabinname || "",
        "System Short Name": item?.systemshortname === undefined ? "" : item?.systemshortname || "",
      };
    });
  };

  const handleExportXL = (isfilter) => {
    const dataToExport = isfilter === "filtered" ? filteredData : employees;

    if (!dataToExport || dataToExport.length === 0) {
      console.error("No data available to export");
      return;
    }

    exportToExcel(formatData(dataToExport), "Unassigned Workstation Report");
    setIsFilterOpen(false);
  };

  //  PDF
  // pdf.....
  const columns = [
    { title: "Company", field: "company" },
    { title: "Branch", field: "branch" },
    { title: "Unit", field: "unit" },
    { title: "Floor", field: "floor" },
    { title: "Area", field: "area" },
    { title: "Location", field: "location" },
    { title: "Maincabin", field: "maincabin" },
    { title: "Subcabin Name", field: "subcabinname" },
    { title: "Subsubcabin Name", field: "subsubcabinname" },
    { title: "System Short Name", field: "systemshortname" },

  ];

  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();

    // Initialize serial number counter
    // Modify columns to include serial number column
    const columnsWithSerial = [
      { title: "S.No", dataKey: "serialNumber" }, // Serial number column
      ...columns.map((col) => ({ title: col.title, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial =
      isfilter === "filtered"
        ? filteredData.map((t, index) => ({
          ...t,
          serialNumber: index + 1,
          systemshortname: t?.systemshortname === undefined ? "" : t?.systemshortname

        }))
        : employees?.map((item, index) => ({
          ...item,
          serialNumber: index + 1,
          systemshortname: item?.systemshortname === undefined ? "" : item?.systemshortname

        }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: 5 },
    });

    doc.save("Unassigned Workstation Report.pdf");
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Unassigned Workstation Report",
    pageStyle: "print",
  });

  //table entries ..,.
  const [items, setItems] = useState([]);

  const addSerialNumber = (datas) => {
    const itemsWithSerialNumber = datas?.map((item, index) => ({
      ...item,
      id: item?._id,
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

  const totalPages = Math.ceil(filteredDatas.length / pageSize);

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
      field: "checkbox",
      headerName: "Checkbox", // Default header name
      headerStyle: {
        fontWeight: "bold", // Apply the font-weight style to make the header text bold
        // Add any other CSS styles as needed
      },
      headerCheckboxSelection: true,
      checkboxSelection: true,
      pinned: 'left',
      sortable: false, // Optionally, you can make this column not sortable
      width: 75,

      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
    },
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
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 150,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
      pinned: 'left',
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
      width: 100,
      hide: !columnVisibility.unit,
      headerClassName: "bold-header",
    },
    {
      field: "floor",
      headerName: "Floor",
      flex: 0,
      width: 100,
      hide: !columnVisibility.floor,
      headerClassName: "bold-header",
    },
    {
      field: "area",
      headerName: "Area",
      flex: 0,
      width: 150,
      hide: !columnVisibility.area,
      headerClassName: "bold-header",
    },
    {
      field: "location",
      headerName: "Location",
      flex: 0,
      width: 100,
      hide: !columnVisibility.location,
      headerClassName: "bold-header",
    },
    {
      field: "maincabin",
      headerName: "Maincabin",
      flex: 0,
      width: 100,
      hide: !columnVisibility.maincabin,
      headerClassName: "bold-header",
    },
    {
      field: "subcabinname",
      headerName: "Subcabin Name",
      flex: 0,
      width: 100,
      hide: !columnVisibility.subcabinname,
      headerClassName: "bold-header",
    },
    {
      field: "subsubcabinname",
      headerName: "Subsubcabin Name",
      flex: 0,
      width: 200,
      hide: !columnVisibility.subsubcabinname,
      headerClassName: "bold-header",
    },
    {
      field: "systemshortname",
      headerName: "System Short Name",
      flex: 0,
      width: 200,
      hide: !columnVisibility.systemshortname,
      headerClassName: "bold-header",
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 200,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      // Assign Bank Detail
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          <Button
            sx={userStyle.buttonedit}
            onClick={() => {

              getinfoCode(params.data);
            }}
          >
            <VisibilityOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonview} />
          </Button>
          {isUserRoleCompare?.includes("eworkstationunassignedreport") && (
            <Button
              sx={buttonStyles.buttonsubmit}
              variant="contained"
              onClick={() => {

                getCode(
                  params.data.subsubcabinname,
                  params.data.company,
                  params.data.branch,
                  params.data.unit,
                  params.data.floor
                );
              }}
            >
              Assign
            </Button>
          )}
          {/* )} */}
        </Grid>
      ),
    },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item.id,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      floor: item.floor,
      area: item.area,
      location: item.location,
      maincabin: item.maincabin,
      subcabinname: item.subcabinname,
      subsubcabinname: item.subsubcabinname,
      systemshortname: item?.systemshortname === undefined ? "" : item?.systemshortname
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


  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem("columnVisibility");
    if (savedVisibility) {
      setColumnVisibility(JSON.parse(savedVisibility));
    }
  }, []);

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
    setEmployees([]);
    setFilterState({
      type: "Individual",
      employeestatus: "Please Select Employee Status",
    });
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
    setSearchQuery("")
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
    setSelectedOptionsEmployee([]);
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
  };

  const customValueRendererTeam = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length
      ? valueTeamCat.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };


  const [filterState, setFilterState] = useState({
    type: "Individual",
    employeestatus: "Please Select Employee Status",
  });
  const TypeOptions = [
    { label: "Individual", value: "Individual" },
    { label: "Department", value: "Department" },
    { label: "Company", value: "Company" },
    { label: "Branch", value: "Branch" },
    { label: "Unit", value: "Unit" },
    { label: "Team", value: "Team" },
  ];
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [productionDepartment, setProductionDepartment] = useState([]);
  const fetchDepartments = async () => {
    try {
      let req = await axios.get(SERVICE.DEPARTMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let prodDepartments = req?.data?.departmentdetails?.filter(
        (item) => item.prod
      );

      setProductionDepartment(prodDepartments?.map((item) => item?.deptname));
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
    setSelectedOptionsEmployee(options);
  };

  const customValueRendererEmployee = (valueEmployeeCat, _categoryname) => {
    return valueEmployeeCat?.length
      ? valueEmployeeCat.map(({ label }) => label)?.join(", ")
      : "Please Select Employee";
  };

  //MULTISELECT ONCHANGE END

  const handleFilter = () => {
    if (selectedOptionsCompany?.length === 0) {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      setSearchQuery("")
      fetchEmployee();
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
      pagename: String("Un Assigned Workstation"),
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

  return (
    <Box>
      {/* ****** Header Content ****** */}
      <Headtitle title={"UNASSIGNED WORKSTATION REPORT"} />
      <PageHeading
        title="Unassigned Work Station Report"
        modulename="Human Resources"
        submodulename="HR"
        mainpagename="Employee"
        subpagename="Employee Update Details"
        subsubpagename="WorkStation UnAssigned Report"
      />
      <br />
      {isUserRoleCompare?.includes("lworkstationunassignedreport") && (
        <>
          <Box sx={userStyle.selectcontainer}>
            <Grid container spacing={2}>
              <>
                <Grid item xs={12}>
                  <Typography sx={userStyle.importheadtext}>Filters</Typography>
                </Grid>
                <br />

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
                      Branch
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
                      Unit
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
                <Button sx={buttonStyles.btncancel} onClick={handleClearFilter}>
                  {" "}
                  Clear{" "}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
      <br />
      {isUserRoleCompare?.includes("lworkstationunassignedreport") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Unassigned Work Station List
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
                  {isUserRoleCompare?.includes(
                    "excelworkstationunassignedreport"
                  ) && (
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
                  {isUserRoleCompare?.includes(
                    "csvworkstationunassignedreport"
                  ) && (
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
                  {isUserRoleCompare?.includes(
                    "printworkstationunassignedreport"
                  ) && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                  {isUserRoleCompare?.includes(
                    "pdfworkstationunassignedreport"
                  ) && (
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
                  {isUserRoleCompare?.includes(
                    "imageworkstationunassignedreport"
                  ) && (
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={handleCaptureImage}
                      >
                        {" "}
                        <ImageIcon
                          sx={{ fontSize: "15px" }}
                        /> &ensp;Image&ensp;{" "}
                      </Button>
                    )}
                </Box>
              </Grid>
              <Grid item md={2} xs={6} sm={6}>
                <AggregatedSearchBar columnDataTable={columnDataTable} setItems={setItems} addSerialNumber={addSerialNumber} setPage={setPage} maindatas={employees} setSearchedString={setSearchedString}
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
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        {manageColumnsContent}
      </Popover>

      <Box>
        {/* ALERT DIALOG */}
        <Dialog
          open={isDeleteOpenalert}
          onClose={handleCloseModalert}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "70px", color: "orange" }}
            />
            <Typography
              variant="h6"
              sx={{ color: "black", textAlign: "center" }}
            >
              Please Select any Row
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              variant="contained"
              color="error"
              onClick={handleCloseModalert}
            >
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="sm"
        sx={{ marginTop: '50px' }}
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              View Unassigned Workstation
            </Typography>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Company</Typography>
                  <Typography>{userReport.company}</Typography>
                </FormControl>
              </Grid>

              <Grid item md={6} xs={12} sm={12}>
                <FormControl size="small" fullWidth>
                  <Typography variant="h6"> Branch</Typography>
                  <Typography>{userReport.branch}</Typography>
                </FormControl>
              </Grid>

              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Unit</Typography>
                  <Typography>{userReport.unit}</Typography>
                </FormControl>
              </Grid>

              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Floor</Typography>
                  <Typography>{userReport.floor}</Typography>
                </FormControl>
              </Grid>

              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Area</Typography>
                  <Typography>{userReport.area}</Typography>
                </FormControl>
              </Grid>

              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Location</Typography>
                  <Typography>{userReport.location}</Typography>
                </FormControl>
              </Grid>

              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Maincabin</Typography>
                  <Typography>{userReport.maincabin}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Subcabin Name</Typography>
                  <Typography>{userReport.subcabinname}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Subsubcabin Name</Typography>
                  <Typography>{userReport.subsubcabinname}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">System Short Name</Typography>
                  <Typography> {userReport?.systemshortname}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCloseview}
                sx={buttonStyles.btncancel}
              >
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>
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
              overflow: "visible",
            },
          }}
        >
          <Box sx={userStyle.dialogbox}>
            <>
              <Typography sx={userStyle.SubHeaderText}>
                Assign Unassigned Workstation
              </Typography>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Workstation</Typography>
                    <Typography>{subsubcabinname.subsubcabinname}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Company</Typography>
                    <Typography>{subsubcabinname.company}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Branch</Typography>
                    <Typography>{subsubcabinname.branch}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Unit</Typography>
                    <Typography>{subsubcabinname.unit}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Floor</Typography>
                    <Typography>{subsubcabinname.floor}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Team <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      size="small"
                      options={teams}
                      value={selectedOptionsTeamAdd}
                      onChange={handleTeamChangeAdd}
                      valueRenderer={customValueRendererTeamAdd}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Employee Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={employeeOptions}
                      placeholder="Please Select Employee"
                      value={{
                        label: employee.employee,
                        value: employee.employee,
                      }}
                      onChange={(e) => {
                        setEmployee((prev) => ({
                          ...prev,
                          employee: e.label,
                          employeeId: e.id,
                        }));
                      }}
                    />
                  </FormControl>
                  <Grid></Grid>
                </Grid>
              </Grid>
              <br /> <br /> <br />
              <Grid container>
                <Grid item md={1}></Grid>
                <Button variant="contained" onClick={handleSubmit} sx={buttonStyles.buttonsubmit}>
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

      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table aria-label="simple table" id="branch" ref={componentRef}>
          <TableHead sx={{ fontWeight: "600" }}>
            <StyledTableRow>
              <StyledTableCell>SI.NO</StyledTableCell>
              <StyledTableCell>Company</StyledTableCell>
              <StyledTableCell>Branch</StyledTableCell>
              <StyledTableCell>Unit</StyledTableCell>
              <StyledTableCell>Floor</StyledTableCell>
              <StyledTableCell>Area</StyledTableCell>
              <StyledTableCell>Location</StyledTableCell>
              <StyledTableCell>Maincabin</StyledTableCell>
              <StyledTableCell>Subcabin Name</StyledTableCell>
              <StyledTableCell>Subsubcabin Name</StyledTableCell>
              <StyledTableCell>System Short Name </StyledTableCell>

            </StyledTableRow>
          </TableHead>
          <TableBody>
            {rowDataTable &&
              rowDataTable.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell> {row.company}</StyledTableCell>
                  <StyledTableCell> {row.branch}</StyledTableCell>
                  <StyledTableCell> {row.unit}</StyledTableCell>
                  <StyledTableCell> {row.floor}</StyledTableCell>
                  <StyledTableCell> {row.area}</StyledTableCell>
                  <StyledTableCell> {row.location}</StyledTableCell>
                  <StyledTableCell> {row.maincabin}</StyledTableCell>
                  <StyledTableCell> {row.subcabinname}</StyledTableCell>
                  <StyledTableCell> {row.subsubcabinname}</StyledTableCell>
                  <StyledTableCell> {row.systemshortname === undefined ? "" : row?.systemshortname}</StyledTableCell>
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
        filename={"Unassigned Workstation Report"}
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

export default WorkstationUnassigned;