import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ImageIcon from "@mui/icons-material/Image";
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
  OutlinedInput,
  Paper,
  Popover,
  Select,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TextareaAutosize,
  TextField,
  Typography,
  Chip,
  TableCell,
  TableRow,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import domtoimage from "dom-to-image";
import * as FileSaver from "file-saver";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";
import AggregatedSearchBar from "../../../../components/AggregatedSearchBar";
import AggridTable from "../../../../components/AggridTable";
import AlertDialog from "../../../../components/Alert";
import { handleApiError } from "../../../../components/Errorhandling";
import ExportData from "../../../../components/ExportData";
import Headtitle from "../../../../components/Headtitle";
import MessageAlert from "../../../../components/MessageAlert";
import PageHeading from "../../../../components/PageHeading";
import { StyledTableCell, StyledTableRow } from "../../../../components/Table";
import {
  AuthContext,
  UserRoleAccessContext,
} from "../../../../context/Appcontext";
import { colourStyles, userStyle } from "../../../../pageStyle";
import { SERVICE } from "../../../../services/Baseservice";

function AssignedWorkStationReport() {
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);

  const [overallItems, setOverallItems] = useState([]);

  const [workstationTodoList, setWorkstationTodoList] = useState([]);

  const deleteTodo = (todo) => {
    setPrimaryWorkStation(todo?.type === "Primary" ? "Select Primary Workstation" : "Select Secondary Workstation");
    setPrimaryWorkStationLabel(todo?.type === "Primary" ? "Select Primary Workstation" : "Select Secondary Workstation");
    setPrimaryKeyShortname("");
    setWorkstationTodoList([]);
  };

  let exportColumnNames = [
    "Emp Code",
    "Name",
    "Company",
    "Branch",
    "Unit",
    "Floor",
    "Workstation",
    "System Short Name",
  ];
  let exportRowValues = [
    "empcode",
    "companyname",
    "company",
    "branch",
    "unit",
    "floor",
    "workstation",
    "systemshortname",
  ];

  const [isHandleChange, setIsHandleChange] = useState(false);
  const [searchedString, setSearchedString] = useState("");

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

  const [keyPrimaryShortname, setPrimaryKeyShortname] = useState("");

  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [getIndexData, setGetIndexData] = useState("");
  const {
    isUserRoleAccess,
    isUserRoleCompare,
    allUsersData,
    allTeam,
    isAssignBranch,
    pageName,
    setPageName,
    buttonStyles,
    workStationSystemName,
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
          data?.subsubpagenameurl?.length !== 0 &&
          data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subsubpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 &&
          data?.subpagenameurl?.length !== 0 &&
          data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 &&
          data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.mainpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.subsubpagenameurl?.includes(window.location.pathname)
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
    getapi();
  }, []);

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Assigned Workstation Report"),
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
    event.returnValue = ""; // This is required for Chrome support
  };

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);
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

  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [updatedFieldEmployee, setUpdatedFieldEmployee] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");

  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage
        .toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Assigned Workstation Report.png");
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
    setPageName(!pageName);
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
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
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
    empcode: true,
    companyname: true,
    company: true,
    branch: true,
    unit: true,
    floor: true,
    workstation: true,
    status: true,
    systemshortname: true,
    actions: true,
    remotesystemname: true,
    remotesystemshortname: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  // get single userdata to view

  const [userReport, setUserReport] = useState({
    empcode: "",
    companyname: "",
    company: "",
    branch: "",
    unit: "",
    floor: "",
    workstation: "",
  });

  // get single row to view....
  const getinfoCode = async (e, index) => {
    setPageName(!pageName);
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const employeesData = employees.find(
        (data) => data._id === e && data.index === index
      );
      setIndexGet(employeesData.index);
      setUserReport(employeesData);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const [isEditOpen, setIsEditOpen] = useState(false);
  // Edit model
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    setPrimaryKeyShortname("");
  };
  const [allWorkStationOpt, setAllWorkStationOpt] = useState([]);
  const [primaryWorkStation, setPrimaryWorkStation] = useState(
    "Select Primary Workstation"
  );
  const [primaryWorkStationLabel, setPrimaryWorkStationLabel] = useState(
    "Select Primary Workstation"
  );
  const [workStationOpt, setWorkStationOpt] = useState([]);
  const [updateWorkStation, setUpdateworkStation] = useState([]);
  const [filteredWorkStation, setFilteredWorkStation] = useState([]);
  const [empaddform, setEmpaddform] = useState({
    company: "",
    branch: "",
    unit: "",
    floor: "",
    workstation: "Please Select Work Station",
  });
  const [allAssignCompany, setAllAssignCompany] = useState([]);
  const [allAssignBranch, setAllAssignBranch] = useState([]);
  const [allAssignUnit, setAllAssignUnit] = useState([]);
  //get all employees list details
  const fetchEmployee = async () => {
    setPageName(!pageName);
    setBankdetail(true);
    const aggregationPipeline = [
      {
        $match: {
          $and: [
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
          department: 1,
          cabinname: 1,
          workstationinput: 1,
        },
      },
    ];
    setPageName(!pageName);
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

      const generatedData = [];

      response.data.users.forEach((item) => {
        Array.isArray(item?.workstation) &&
          item?.workstation?.forEach((workstation, index) => {
            const newData = {
              ...item,
              company: item.company,
              branch: item.branch,
              unit: item.unit,
              team: item.team,
              floor: item.floor,
              workstation:
                workstation === "Please Select Primary Work Station"
                  ? ""
                  : workstation,
              companyname: item.companyname,
              empcode: item.empcode,
              // systemshortname: shortname,
              cabinname: item.cabinname,
              _id: item._id,
              index: index,
            };

            generatedData.push(newData);
          });
      });

      const shortnameworkstation = generatedData?.map((item) => {
        const selectedCabinName = item?.workstation?.split("(")[0];

        const shortname = workStationSystemName
          ?.filter(
            (work) =>
              work?.company === item?.company &&
              work?.branch === item?.branch &&
              work?.unit === item?.unit &&
              (empaddform?.floor === "" || empaddform?.floor === item?.floor) &&
              work?.cabinname === selectedCabinName
          )
          ?.map((item) => item?.systemshortname)
          ?.toString();

        return {
          ...item,
          systemshortname: shortname,
        };
      });

      const shortnameset = shortnameworkstation?.map((item) => {
        const short = workStationSystemName?.find((sht) => {
          const primaryOrSecondary = item?.workstation?.split("(")[0];

          const Bracketsbranch =
            item?.workstation && typeof item?.workstation === "string"
              ? item?.workstation.match(/\(([^)]+)\)/)?.[1]
              : null;

          if (Bracketsbranch) {
            const hyphenCount = Bracketsbranch.split("-").length - 1;

            const Branch =
              hyphenCount === 1
                ? Bracketsbranch.split("-")[0].trim()
                : Bracketsbranch?.split("-").slice(0, 2).join("-");

            const Floor =
              hyphenCount === 1
                ? Bracketsbranch.split("-")[1].trim()
                : hyphenCount === 2
                  ? Bracketsbranch.split("-").pop()
                  : Bracketsbranch.split("-")
                    .slice(-2)
                    .join("-")
                    .replace(")", "");

            return (
              sht?.branch === Branch &&
              sht?.floor === Floor &&
              sht?.cabinname === primaryOrSecondary
            );
          } else {
            // console?.log("No branch or floor info found in parentheses.");
            return false;
          }
        });

        return {
          ...item,
          systemshortname:
            item?.workstationstatus === "Office" ||
              item?.workstationstatus === "Remote"
              ? item?.workstationInput?.slice(0, 15)
              : short?.systemshortname,
        };
      });
      let foramattedDatas = shortnameset?.filter(
        (item) =>
          item?.workstation &&
          item?.workstation !== "" &&
          item?.systemshortname &&
          item?.systemshortname !== "" &&
          productionDepartment?.includes(item?.department)
      );
      const itemsWithSerialNumber = foramattedDatas?.map((item, index) => ({
        ...item,
        id: item?._id,
        serialNumber: index + 1,
        remotesystemname: item?.workstationinput,
        remotesystemshortname: item?.workstationinput?.slice(0, 15),
      }));
      setEmployees(itemsWithSerialNumber);

      setBankdetail(false);
    } catch (err) {
      setBankdetail(false);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const [indexGet, setIndexGet] = useState();

  const getCode = async (e, index) => {
    setPageName(!pageName);
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setEmpaddform(res?.data?.suser);

      const employeesData = employees.find(
        (data) => data._id === e && data.index === index
      );

      setUpdatedFieldEmployee(employeesData);
      setIndexGet(employeesData?.index);
      setPrimaryWorkStation(employeesData.workstation);



      const selectedCabinName = employeesData.workstation?.split("(")[0];

      const Bracketsbranch =
        employeesData.workstation.match(/\(([^)]+)\)/)?.[1];

      const hyphenCount = Bracketsbranch
        ? Bracketsbranch.split("-").length - 1
        : 0;

      const Branch =
        hyphenCount === 1
          ? Bracketsbranch.split("-")[0].trim()
          : Bracketsbranch?.split("-").slice(0, 2).join("-");

      // const Floor = hyphenCount === 1 ? Bracketsbranch.split('-')[1].trim() : Bracketsbranch.split('-').slice(-2).join('-').replace(')', '');

      let Floor = "";

      if (Bracketsbranch) {
        const hyphenCount = Bracketsbranch.split("-").length - 1;
        Floor =
          hyphenCount === 1
            ? Bracketsbranch.split("-")[1].trim()
            : hyphenCount === 2
              ? Bracketsbranch.split("-").pop()
              : Bracketsbranch.split("-").slice(-2).join("-").replace(")", "");
      } else {
        Floor = ""; // or assign some default value
      }

      const shortname = workStationSystemName
        ?.filter(
          (item) =>
            item?.branch === Branch &&
            item?.floor === Floor &&
            item?.cabinname === selectedCabinName
        )
        ?.map((item) => item?.systemshortname)
        ?.toString();

      setPrimaryKeyShortname(shortname);

      setGetIndexData(employeesData.index);
      const employeeCount =
        Number(res?.data?.suser.employeecount) +
        Number(res?.data?.suser.wfhcount) || 0;
      var filteredWorks;
      if (res?.data?.suser?.unit === "" && res?.data?.suser?.floor === "") {
        filteredWorks = workStationOpt?.filter(
          (u) =>
            u.company === res?.data?.suser?.company &&
            u.branch === res?.data?.suser?.branch
        );
      } else if (res?.data?.suser?.unit === "") {
        filteredWorks = workStationOpt?.filter(
          (u) =>
            u.company === res?.data?.suser?.company &&
            u.branch === res?.data?.suser?.branch &&
            u.floor === res?.data?.suser?.floor
        );
      } else if (res?.data?.suser?.floor === "") {
        filteredWorks = workStationOpt?.filter(
          (u) =>
            u.company === res?.data?.suser?.company &&
            u.branch === res?.data?.suser?.branch &&
            u.unit === res?.data?.suser?.unit
        );
      } else {
        filteredWorks = workStationOpt?.filter(
          (u) =>
            u.company === res?.data?.suser?.company &&
            u.branch === res?.data?.suser?.branch &&
            u.unit === res?.data?.suser?.unit &&
            u.floor === res?.data?.suser?.floor
        );
      }

      const result = filteredWorks.flatMap((item) => {
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

      const answerFilter = res?.data?.suser?.workstation?.filter(
        (data) => data !== employeesData?.workstation
      );
      const filteredResult = result.filter(
        (data) => !answerFilter.includes(data)
      );
      setUpdateworkStation(answerFilter);

      const processedResult = result.map((e) => {
        const selectedCabinName = e?.split("(")[0];

        const Bracketsbranch = e?.match(/\(([^)]+)\)/)?.[1];

        const hyphenCount = Bracketsbranch.split("-").length - 1;

        const Branch =
          hyphenCount === 1
            ? Bracketsbranch.split("-")[0].trim()
            : Bracketsbranch.split("-").slice(0, 2).join("-");

        const Floor =
          hyphenCount === 1
            ? Bracketsbranch.split("-")[1].trim()
            : hyphenCount === 2
              ? Bracketsbranch.split("-").pop()
              : Bracketsbranch.split("-").slice(-2).join("-").replace(")", "");

        const shortname = workStationSystemName
          ?.filter(
            (item) =>
              item?.branch === Branch &&
              (Floor === "" || Floor === item?.floor) &&
              item?.cabinname === selectedCabinName
          )
          ?.map((item) => item?.systemshortname)
          ?.toString();

        return e + `(${shortname})`;
      });

      // The processedResult array now contains all the mapped `shortname` values

      let workstationsFinal = [
        ...processedResult.map((t) => ({
          label: t,
          value: t.replace(/\([^)]*\)$/, ""),
        })),
      ];
      let primaryWorkstationNew = res?.data?.suser?.workstation[employeesData?.index];
      let findLabel = workstationsFinal?.find((item) =>
        item.label.includes(primaryWorkstationNew)
      );
      setPrimaryWorkStationLabel(findLabel?.label);

      const matches = findLabel?.label.match(/^(.*?)\((.*?)\)\((.*?)\)$/);
      setWorkstationTodoList((prev) => [{
        workstation: matches?.[1]?.trim() + '(' + matches?.[2]?.trim() + ')',  // G-HRA(TTS-TRICHY-Ground Floor)
        shortname: matches?.[3],
        type: employeesData?.index === 0 ? "Primary" : "Secondary"
      }])

      setFilteredWorkStation(workstationsFinal);

      handleClickOpenEdit();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  const [oldDatas, setOldDatas] = useState({});
  const getCodeDelete = async (e, index) => {
    setPageName(!pageName);
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setEmpaddform(res?.data?.suser);
      const employeesData = employees.find(
        (data) => data._id === e && data.index === index
      );
      setOldDatas(employeesData);
      const answerFilter = res?.data?.suser?.workstation?.filter(
        (data) => data !== employeesData?.workstation
      );
      setUpdateworkStation(answerFilter);
      handleClickOpendel();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const delAddemployee = async () => {
    setPageName(!pageName);


    let ansNew = empaddform?.workstationshortname;
    ansNew = ansNew?.filter((data) => data !== oldDatas?.systemshortname);
    ansNew = ansNew?.map((item) => item?.replaceAll(" ", ""));

    let loginUserStatus = empaddform?.loginUserStatus?.filter((data) => {
      return ansNew?.includes(data?.hostname)
    })


    try {
      let del = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${boredit}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        workstation: updateWorkStation,
        workstationshortname: ansNew,
        loginUserStatus: loginUserStatus,
      });
      await fetchEmployee();
      setPage(1);
      setPopupContent("Removed Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const fetchWorkStation = async () => {
    setPageName(!pageName);
    setPageName(!pageName);
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
      const processedResult = result.map((e) => {
        const selectedCabinName = e?.split("(")[0];

        const Bracketsbranch = e?.match(/\(([^)]+)\)/)?.[1];

        const hyphenCount = Bracketsbranch.split("-").length - 1;

        const Branch =
          hyphenCount === 1
            ? Bracketsbranch.split("-")[0].trim()
            : Bracketsbranch.split("-").slice(0, 2).join("-");

        const Floor =
          hyphenCount === 1
            ? Bracketsbranch.split("-")[1].trim()
            : hyphenCount === 2
              ? Bracketsbranch.split("-").pop()
              : Bracketsbranch.split("-").slice(-2).join("-").replace(")", "");

        const shortname = workStationSystemName
          ?.filter(
            (item) =>
              item?.branch === Branch &&
              (Floor === "" || Floor === item?.floor) &&
              item?.cabinname === selectedCabinName
          )
          ?.map((item) => item?.systemshortname)
          ?.toString();

        return e + `(${shortname})`;
      });

      setAllWorkStationOpt(
        processedResult.flat()?.map((d) => ({
          ...d,
          label: d,
          value: d,
        }))
      );
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  useEffect(() => {
    fetchWorkStation();
  }, []);
  useEffect(() => {
    fetchWorkStation();
  }, [workStationSystemName]);

  const editSubmit = (e) => {
    e.preventDefault();
    if (primaryWorkStation === "Select Primary Workstation" || primaryWorkStation === "Select Secondary Workstation") {
      setPopupContentMalert("Please Select Work Station!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequestt();
    }
  };

  //Boardingupadate updateby edit page...
  let updateby = empaddform?.updatedby;
  //edit post call.
  let boredit = empaddform?._id;

  const sendRequestt = async () => {
    const ans = empaddform?.workstation;
    ans[updatedFieldEmployee?.index] = primaryWorkStation;

    let ansNew = empaddform?.workstationshortname;
    ansNew[updatedFieldEmployee?.index] = keyPrimaryShortname;
    ansNew = ansNew?.map((item) => item?.replaceAll(" ", ""));

    let loginUserStatus = empaddform?.loginUserStatus?.filter((data) => {
      return ansNew?.includes(data?.hostname)
    })
    setPageName(!pageName);
    try {
      let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${boredit}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        workstation: ans,
        workstationshortname: ansNew,
        loginUserStatus: loginUserStatus,
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchEmployee();
      setPrimaryKeyShortname("");
      handleCloseModEdit();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const handleClickOpenInfo = () => {
    setOpenview(true);
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
        Empcode: item.empcode || "",
        Name: item.companyname || "",
        Company: item.company || "",
        Branch: item.branch || "",
        Unit: item.unit || "",
        Floor: item.floor || "",
        Workstation: item.workstation || "",
        "System Short Name":
          item?.systemshortname === undefined
            ? ""
            : item?.systemshortname || "",
      };
    });
  };

  const handleExportXL = (isfilter) => {
    const dataToExport = isfilter === "filtered" ? filteredData : employees;

    if (!dataToExport || dataToExport.length === 0) {
      console.error("No data available to export");
      return;
    }

    exportToExcel(formatData(dataToExport), "Assigned Workstation Report");
    setIsFilterOpen(false);
  };

  //  PDF
  // pdf.....
  const columns = [
    { title: "Emp Code", field: "empcode" },
    { title: "Name", field: "companyname" },
    { title: "Company", field: "company" },
    { title: "Branch", field: "branch" },
    { title: "Unit", field: "unit" },
    { title: "Floor", field: "floor" },
    { title: "Workstation", field: "workstation" },
    { title: "System Short Name", field: "systemshortname" },
  ];

  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();

    // Initialize serial number counter
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
          systemshortname:
            t?.systemshortname === undefined ? "" : t?.systemshortname,
        }))
        : employees?.map((item, index) => ({
          ...item,
          serialNumber: index + 1,
          systemshortname:
            item?.systemshortname === undefined ? "" : item?.systemshortname,
        }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: 5 },
    });

    doc.save("Assigned Workstation Report.pdf");
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Assigned Workstation Report",
    pageStyle: "print",
  });

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

  const totalPages = Math.ceil(employees.length / pageSize);

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
      pinned: "left",
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
      pinned: "left",
    },
    {
      field: "empcode",
      headerName: "Emp Code",
      flex: 0,
      width: 200,
      hide: !columnVisibility.empcode,
      headerClassName: "bold-header",
      pinned: "left",
    },
    {
      field: "companyname",
      headerName: "Name",
      flex: 0,
      width: 200,
      hide: !columnVisibility.companyname,
      headerClassName: "bold-header",
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 200,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 200,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 200,
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
      field: "workstation",
      headerName: "Workstation",
      flex: 0,
      width: 200,
      hide: !columnVisibility.workstation,
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
      field: "status",
      headerName: "Status",
      flex: 0,
      width: 100,
      hide: !columnVisibility.status,
      headerClassName: "bold-header",
    },
    {
      field: "remotesystemname",
      headerName: "Remote System Name",
      flex: 0,
      width: 200,
      hide: !columnVisibility.remotesystemname,
      headerClassName: "bold-header",
    },
    {
      field: "remotesystemshortname",
      headerName: "Remote System Short Name",
      flex: 0,
      width: 200,
      hide: !columnVisibility.remotesystemshortname,
      headerClassName: "bold-header",
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 300,
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
              handleClickOpenInfo();
              getinfoCode(params.data.id, params.data.dataindex);
            }}
          >
            <VisibilityOutlinedIcon
              style={{ fontsize: "large" }}
              sx={buttonStyles.buttonview}
            />
          </Button>
          &ensp;
          <Button
            variant="contained"
            onClick={() => {
              getCode(params.data.id, params.data.dataindex);
            }}
          >
            Change
          </Button>
          &ensp;
          <Button
            sx={userStyle.buttonedit}
            variant="contained"
            onClick={() => {
              getCodeDelete(params.data.id, params.data.dataindex);
            }}
          >
            Remove
          </Button>
        </Grid>
      ),
    },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      serialNumber: item.serialNumber,
      id: item?.id,
      dataindex: item.index,
      empcode: item.empcode,
      companyname: item.companyname,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      floor: item.floor,
      workstation: item.workstation,
      status: "Assigned",
      systemshortname:
        item?.systemshortname === undefined ? "" : item?.systemshortname,
      remotesystemname: item?.remotesystemname,
      remotesystemshortname: item?.remotesystemshortname,
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

  //MULTISELECT ONCHANGE END

  const handleFilter = () => {
    if (selectedOptionsCompany?.length === 0) {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      // if (workStationSystemName?.length > 0) {
      fetchEmployee();
      setSearchQuery("");
      // }
    }
  };

  //auto select all dropdowns
  const handleAutoSelect = async () => {
    setPageName(!pageName);
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
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  useEffect(() => {
    handleAutoSelect();
  }, [isAssignBranch]);

  return (
    <Box>
      {/* ****** Header Content ****** */}
      <Headtitle title={"ASSIGN WORK STATION"} />

      <PageHeading
        title="Assigned Work Station Report"
        modulename="Human Resources"
        submodulename="HR"
        mainpagename="Employee"
        subpagename="Employee Update Details"
        subsubpagename="WorkStation Assigned Report"
      />
      <br />

      {isUserRoleCompare?.includes("lworkstationassignedreport") && (
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
                    <Typography> Branch</Typography>
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
                                i.label === item.label && i.value === item.value
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
                    <Typography> Unit</Typography>
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
                                i.label === item.label && i.value === item.value
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
                  disabled={isBankdetail}
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
      {isUserRoleCompare?.includes("lworkstationassignedreport") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Assigned Work Station List
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
                    "excelworkstationassignedreport"
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
                    "csvworkstationassignedreport"
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
                    "printworkstationassignedreport"
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
                    "pdfworkstationassignedreport"
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
                    "imageworkstationassignedreport"
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

      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="lg"
          sx={{
            overflow: "auto",
            "& .MuiPaper-root": {
              overflow: "visible",
            },
            marginTop: "50px",
          }}
          fullWidth={true}
        >
          <Box sx={userStyle.dialogbox}>
            <>
              <Typography sx={userStyle.SubHeaderText}>
                Edit Assigned Employee Work Station
              </Typography>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={6} sm={12} xs={12}>
                  <Grid container spacing={2}>
                    <Grid item md={6} sm={12} xs={12}>
                      <Typography sx={{ fontWeight: "bold" }}>
                        Company Name :
                      </Typography>
                      <Typography>{empaddform.companyname}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                  <Grid container spacing={2}>
                    <Grid item md={6} sm={12} xs={12}>
                      <Typography sx={{ fontWeight: "bold" }}>
                        Emp Code :
                      </Typography>
                    </Grid>
                    <Grid item md={6} sm={12} xs={12}>
                      <Typography>{empaddform.empcode}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <Grid container spacing={2}>
                    <Grid item md={3} sm={12} xs={12}>
                      <Typography sx={{ fontWeight: "bold" }}>
                        Total System Count :
                      </Typography>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <Typography>
                        {empaddform.employeecount == undefined
                          ? "0"
                          : empaddform.employeecount}
                      </Typography>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <Typography sx={{ fontWeight: "bold" }}>
                        Assigned System Count :
                      </Typography>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <Typography>
                        {empaddform?.workstation == undefined
                          ? "0"
                          : empaddform?.workstation?.length}
                      </Typography>
                    </Grid>
                    <Grid item md={4} sm={12} xs={12}>
                      <Typography sx={{ fontWeight: "bold" }}>
                        Remaining System Count :
                      </Typography>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <Typography>
                        {empaddform.employeecount == undefined
                          ? 0
                          : Number(empaddform.employeecount) -
                          Number(empaddform?.workstation?.length)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>{" "}
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Company</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={empaddform.company}
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Branch</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={empaddform.branch}
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Unit</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={empaddform.unit}
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Floor</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={empaddform.floor}
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl size="small" fullWidth>
                    <Typography>
                      Work Station{" "}
                      {indexGet === 0 ? "(Primary)" : "(Secondary)"}
                      <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={
                        getIndexData === 0
                          ? filteredWorkStation
                          : allWorkStationOpt.filter(
                            (data) => !updateWorkStation.includes(data.value)
                          )
                      }
                      placeholder="Select Work Station"
                      value={{
                        label: primaryWorkStationLabel,
                        value: primaryWorkStation,
                      }}
                      onChange={(e) => {
                        const isValue = e.value?.replace(/\([^)]*\)$/, "");
                        setPrimaryWorkStation(e.value);
                        setPrimaryWorkStationLabel(e.label);

                        const matches = e.label.match(/^(.*?)\((.*?)\)\((.*?)\)$/);


                        setWorkstationTodoList((prev) => [{
                          workstation: matches?.[1]?.trim() + '(' + matches?.[2]?.trim() + ')',  // G-HRA(TTS-TRICHY-Ground Floor)
                          shortname: matches?.[3],
                          type: indexGet === 0 ? "Primary" : "Secondary"
                        }])

                        const selectedCabinName = e?.value?.split("(")[0];

                        const Bracketsbranch =
                          e?.value.match(/\(([^)]+)\)/)?.[1];

                        const hyphenCount =
                          Bracketsbranch.split("-").length - 1;

                        const Branch =
                          hyphenCount === 1
                            ? Bracketsbranch.split("-")[0].trim()
                            : Bracketsbranch?.split("-").slice(0, 2).join("-");

                        const Floor =
                          hyphenCount === 1
                            ? Bracketsbranch.split("-")[1].trim()
                            : hyphenCount === 2
                              ? Bracketsbranch.split("-").pop()
                              : Bracketsbranch.split("-")
                                .slice(-2)
                                .join("-")
                                .replace(")", "");

                        const shortname = workStationSystemName
                          ?.filter(
                            (item) =>
                              Branch === item?.branch &&
                              (Floor === "" || Floor === item?.floor) && // Conditional check for floor
                              item?.cabinname === selectedCabinName
                          )
                          ?.map((item) => item?.systemshortname)
                          ?.toString();

                        setPrimaryKeyShortname(shortname);
                      }}
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 1500 }),
                      }}
                      formatOptionLabel={(data) => {
                        let value = data.label;
                        if (!value) {
                          value = "Please Select Primary Workstation";
                        }

                        // Extract text before and within parentheses
                        const bracketIndex = value.indexOf("(");
                        const label =
                          bracketIndex > -1
                            ? value.slice(0, bracketIndex)
                            : value;
                        const bracketContent =
                          bracketIndex > -1 ? value.slice(bracketIndex) : "";

                        // const bracketIndex = value.indexOf('(');
                        // const bracketContent = bracketIndex > -1 ? value.slice(bracketIndex) : "";

                        // Check if there's a second set of parentheses
                        const secondBracketMatch = bracketContent.match(
                          /\(([^)]+)\)\(([^)]+)\)/
                        );

                        const hasSecondBracket = secondBracketMatch !== null;

                        let firstBracketContent;
                        let secondBracketContent;
                        if (hasSecondBracket) {
                          firstBracketContent = secondBracketMatch[1]; // Content of the first set of parentheses
                          secondBracketContent = secondBracketMatch[2]; // Content of the second set of parentheses
                        }

                        return (
                          <div>
                            <span>{label}</span>

                            {hasSecondBracket ? (
                              <>
                                <span>{`(${firstBracketContent})`}</span>
                                <span style={{ color: "green" }}>
                                  {`(${secondBracketContent})`}
                                </span>
                              </>
                            ) : (
                              <span>{bracketContent}</span>
                            )}
                          </div>
                        );
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Workstation ShortName</Typography>
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={5}
                      readOnly
                      value={keyPrimaryShortname}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <TableContainer size="small" >
                    <Table>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                          <TableCell sx={{ py: 0.3 }}>
                            <Typography variant="subtitle1" >
                              Workstation
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 0.3 }}>
                            <Typography variant="subtitle1" >
                              Shortname
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 0.3 }}>
                            <Typography variant="subtitle1" >
                              Type
                            </Typography>
                          </TableCell>
                          <TableCell align="right" sx={{ py: 0.3 }}>
                            <Typography variant="subtitle1" >
                              Action
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {workstationTodoList.map((todo, index) => (
                          <TableRow key={index} >
                            <TableCell sx={{ py: 0.3 }}>
                              <Typography sx={{ fontSize: '0.9rem' }}>
                                {todo.workstation}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ py: 0.3 }}>
                              <Typography sx={{ fontSize: '0.9rem' }}>
                                {todo.shortname}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ py: 0.3 }}>
                              <Typography sx={{ fontSize: '0.9rem' }}>
                                {todo.type}
                              </Typography>
                            </TableCell>
                            <TableCell align="right" sx={{ py: 0.3 }}>
                              <IconButton onClick={() => deleteTodo(todo)} color="error">
                                <CloseIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                        {workstationTodoList.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4} align="center">
                              <Typography variant="body2" color="text.secondary">
                                No Workstations.
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
              <br /> <br /> <br />
              <Grid container>
                <Grid item md={1}></Grid>
                <Button
                  variant="contained"
                  onClick={editSubmit}
                  sx={buttonStyles.buttonsubmit}
                >
                  Change
                </Button>
                <Grid item md={1}></Grid>
                <Button
                  sx={buttonStyles.btncancel}
                  onClick={handleCloseModEdit}
                >
                  Cancel
                </Button>
              </Grid>
            </>
          </Box>
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
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              View Assigned Workstation
            </Typography>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Employee Code</Typography>
                  <Typography>{userReport.empcode}</Typography>
                </FormControl>
              </Grid>

              <Grid item md={6} xs={12} sm={12}>
                <FormControl size="small" fullWidth>
                  <Typography variant="h6"> Employee Name</Typography>
                  <Typography>{userReport.companyname}</Typography>
                </FormControl>
              </Grid>

              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Company</Typography>
                  <Typography>{userReport.company}</Typography>
                </FormControl>
              </Grid>

              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Branch</Typography>
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
                  <Typography variant="h6">
                    Workstation{" "}
                    <span style={{ fontWeight: "lighter" }}>
                      {indexGet === 0 ? "(Primary)" : "(Secondary)"}
                    </span>
                  </Typography>
                  <Typography>{userReport.workstation}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">System Short Name</Typography>
                  <Typography>{userReport.systemshortname}</Typography>
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

      {/* ALERT DIALOG */}
      <Dialog
        open={isDeleteOpen}
        onClose={handleCloseDel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
        >
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "80px", color: "orange" }}
          />
          <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
            Are you sure?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDel} sx={userStyle.btncancel}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              delAddemployee(boredit);
              handleCloseDel();
            }}
            autoFocus
            variant="contained"
            color="error"
          >
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>

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
              <StyledTableCell>Emp Code</StyledTableCell>
              <StyledTableCell>Emp Name</StyledTableCell>
              <StyledTableCell>Company</StyledTableCell>
              <StyledTableCell>Branch</StyledTableCell>
              <StyledTableCell>Unit</StyledTableCell>
              <StyledTableCell>Floor</StyledTableCell>
              <StyledTableCell>Workstation</StyledTableCell>
              <StyledTableCell>System Short Name </StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {rowDataTable &&
              rowDataTable.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{row.empcode} </StyledTableCell>
                  <StyledTableCell> {row.companyname}</StyledTableCell>
                  <StyledTableCell> {row.company}</StyledTableCell>
                  <StyledTableCell> {row.branch}</StyledTableCell>
                  <StyledTableCell> {row.unit}</StyledTableCell>
                  <StyledTableCell> {row.floor}</StyledTableCell>
                  <StyledTableCell> {row.workstation}</StyledTableCell>
                  <StyledTableCell>
                    {" "}
                    {row.systemshortname === undefined
                      ? ""
                      : row?.systemshortname}
                  </StyledTableCell>
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
        filteredDataTwo={
          (filteredChanges !== null ? filteredRowData : rowDataTable) ?? []
        }
        itemsTwo={employees ?? []}
        filename={"Assigned Workstation Report"}
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

export default AssignedWorkStationReport;
