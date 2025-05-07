import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormGroup,
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
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Switch from "@mui/material/Switch";
import axios from "axios";
import domtoimage from 'dom-to-image';
import ExcelJS from "exceljs";
import * as FileSaver from "file-saver";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../../components/Errorhandling";
import Headtitle from "../../../components/Headtitle";
import PageHeading from "../../../components/PageHeading";
import {
  AuthContext,
  UserRoleAccessContext,
} from "../../../context/Appcontext";
import { colourStyles, userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";

import AlertDialog from "../../../components/Alert";
import MessageAlert from "../../../components/MessageAlert";

import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
const LoadingBackdrop = ({ open }) => {
  return (
    <Backdrop
      sx={{
        color: "#fff",
        position: "fixed", // Changed to absolute
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: (theme) => theme.zIndex.drawer + 1000,
      }}
      open={open}
    >
      <div className="pulsating-circle">
        <CircularProgress color="inherit" className="loading-spinner" />
      </div>
      <Typography
        variant="h6"
        sx={{ marginLeft: 2, color: "#fff", fontWeight: "bold" }}
      >
        Loading, please wait...
      </Typography>
    </Backdrop>
  );
};

const ExportXLWithImages = ({
  csvData,
  fileName,
  columnVisibility,
  exportFields,
  setIsFilterOpen,
  setIsLoading,
  fileFormat,
}) => {
  const exportToExcel = async (csvData, fileName) => {
    if (!csvData || !csvData.length) {
      setIsLoading(false);
      return;
    }

    if (!fileName) {
      console.error("No file name provided.");
      return;
    }

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Data");

      // Filter exportFields based on columnVisibility
      const visibleExportFields = exportFields.filter(
        (field) => columnVisibility[field.key]
      );

      // Define columns based on visible exportFields
      worksheet.columns = visibleExportFields.map((field) => ({
        header: field.label,
        key: field.label,
        width: field.width || 20, // Default width if not provided
      }));

      for (let i = 0; i < csvData.length; i++) {
        const item = csvData[i];

        // Clone the item to avoid modifying the original data
        const rowItem = { ...item };

        // Remove the base64 string from the Profile property before adding the row
        if (rowItem.Profile) {
          delete rowItem.Profile;
        }

        const row = worksheet.addRow(rowItem);

        // Center align the text in each cell of the row
        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.alignment = { vertical: "middle", horizontal: "center" };
        });

        // Add image if Profile property exists
        if (item.Profile) {
          const base64Data = item.Profile.split(",")[1];
          const base64Header = item.Profile.split(",")[0];

          // Ensure the base64 string is valid
          if (!base64Data || !base64Header) {
            continue;
          }

          let extension = "png"; // Default to PNG

          if (base64Header.includes("jpeg")) {
            extension = "jpeg";
          } else if (base64Header.includes("png")) {
            extension = "png";
          } else {
            continue;
          }

          try {
            const imageId = workbook.addImage({
              base64: base64Data,
              extension: extension,
            });

            const rowIndex = row.number;

            // Adjust row height to fit the image
            worksheet.getRow(rowIndex).height = 80;

            // Add image to the worksheet
            worksheet.addImage(imageId, {
              tl: { col: visibleExportFields.length - 1, row: rowIndex - 1 },
              ext: { width: 100, height: 80 },
            });

            // Align the cell containing the image
            worksheet.getCell(
              `${String.fromCharCode(
                64 + visibleExportFields.length
              )}${rowIndex}`
            ).alignment = { vertical: "middle", horizontal: "center" };
          } catch (error) {
            continue;
          }
        }
      }

      // Generate Excel file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      setIsFilterOpen(false);
      setIsLoading(false);
      FileSaver.saveAs(
        blob,
        `${fileName}.${fileFormat === "xl" ? "xlsx" : "csv"}`
      );
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  };
  exportToExcel(csvData, fileName);
};

function EmployeePrevaluesList() {

  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTable = useRef(null);
  const gridRefTableImg = useRef(null);

  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    // setIsLoading(false);
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
  const [isLoading, setIsLoading] = useState(false);
  const [fileFormat, setFormat] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  const {
    isUserRoleCompare,
    isAssignBranch,
    allTeam,
    allUsersData,
    isUserRoleAccess,
    pageName,
    setPageName,
    buttonStyles,
    allUsersLimit
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
      pagename: String("Employee Prevalues List"),
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

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };
  const [participantsOption, setParticipantsOption] = useState([]);

  //FILTER START
  useEffect(() => {
    fetchDepartments();
  }, []);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const fetchDepartments = async () => {
    setPageName(!pageName);
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
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [filterState, setFilterState] = useState({
    type: "Individual",
    employeestatus: "Please Select Employee Status",
  });
  const EmployeeStatusOptions = [
    { label: "Live Employee", value: "Live Employee" },
    { label: "Releave Employee", value: "Releave Employee" },
    { label: "Absconded", value: "Absconded" },
    { label: "Hold", value: "Hold" },
    { label: "Terminate", value: "Terminate" },
  ];
  const TypeOptions = [
    { label: "Individual", value: "Individual" },
    { label: "Department", value: "Department" },
    { label: "Company", value: "Company" },
    { label: "Branch", value: "Branch" },
    { label: "Unit", value: "Unit" },
    { label: "Team", value: "Team" },
  ];

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
    setValueEmp([]);
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
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
    setValueEmp([]);
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
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
    setValueEmp([]);
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
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
    setValueEmp([]);
  };

  const customValueRendererTeam = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length
      ? valueTeamCat.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };

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
    setValueEmp([]);
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
    setValueEmp(
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
        //  &&
        // comp.workmode !== "Internship"
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
    setSelectedOptionsEmployee([]);
    setValueEmp([]);
    setEmployeeOptions([]);
    setEmployeelists([]);

    setFilterState({
      type: "Individual",
      employeestatus: "Please Select Employee Status",
    });

    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  const [filterLoader, setFilterLoader] = useState(false);
  const [tableLoader, setTableLoader] = useState(false);
  const handleFilter = () => {
    if (
      filterState?.type === "Please Select Type" ||
      filterState?.type === ""
    ) {
      setPopupContentMalert("Please Select Type!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsCompany?.length === 0) {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    // else if (
    //   filterState?.employeestatus === "Please Select Employee Status" ||
    //   filterState?.employeestatus === ""
    // ) {
    //   setPopupContentMalert("Please Select Employee Status!");
    //   setPopupSeverityMalert("warning");
    //   handleClickOpenPopupMalert();
    // }
    else if (
      ["Individual", "Branch", "Unit", "Team"]?.includes(filterState?.type) &&
      selectedOptionsBranch?.length === 0
    ) {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (
      ["Individual", "Unit", "Team"]?.includes(filterState?.type) &&
      selectedOptionsUnit?.length === 0
    ) {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (
      ["Individual", "Team"]?.includes(filterState?.type) &&
      selectedOptionsTeam?.length === 0
    ) {
      setPopupContentMalert("Please Select Team!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (
      filterState?.type === "Individual" &&
      selectedOptionsEmployee?.length === 0
    ) {
      setPopupContentMalert("Please Select Employee!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (
      filterState?.type === "Department" &&
      selectedOptionsDepartment?.length === 0
    ) {
      setPopupContentMalert("Please Select Department!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else {
      fetchListData();
    }
  };

  const fetchListData = async () => {
    setFilterLoader(true);
    setTableLoader(true);
    setPageName(!pageName);
    try {
      let datas = await axios.post(SERVICE.GETALLFILTEREDUSERS, {
        companyname:
          valueCompanyCat?.length > 0 ? valueCompanyCat : allAssignCompany,
        branchname:
          valueBranchCat?.length > 0 ? valueBranchCat : allAssignBranch,
        unitname: valueUnitCat?.length > 0 ? valueUnitCat : allAssignUnit,
        teamname: valueTeamCat,
        employeename: valueEmployeeCat,
        departmentname: valueDepartmentCat,
      });

      if (datas?.data?.users?.length > 0) {
        setEmployeelists(
          datas?.data?.users.map((item, index) => {
            return {
              _id: item._id,
              serialNumber: index + 1,
              firstname: item.firstname,
              lastname: item.lastname,
              legalname: item.legalname,
              callingname: item.callingname,
              fathername: item.fathername,
              mothername: item.mothername,
              gender: item.gender,
              maritalstatus: item.maritalstatus,
              dom:
                item.dom && item.maritalstatus == "Married"
                  ? moment(item.dom).format("DD-MM-YYYY")
                  : "",
              dob: item.dob ? moment(item.dob).format("DD-MM-YYYY") : "",
              bloodgroup: item.bloodgroup,
              religion: item.religion || "",
              email: item.email,
              location: item.location,
              contactpersonal: item.contactpersonal,
              contactfamily: item.contactfamily,
              emergencyno: item.emergencyno,
              dot: item.dot ? moment(item.dot).format("DD-MM-YYYY") : "",
              doj: item.doj ? moment(item.doj).format("DD-MM-YYYY") : "",
              aadhar: item.aadhar,
              panno: item.panno,
              panrefno: item.panrefno || "",
              username: item.username,
              password: item.password,
              companyname: item.companyname,
              attendancemode: item?.attendancemode?.length > 0 ? item?.attendancemode?.join(",") : "",
              enquirystatus: item.enquirystatus,
              companyemail: item?.companyemail || "",
              company: item.company,
              branch: item.branch,
              unit: item.unit,
              floor: item.floor,
              area: item.area,
              department: item.department,
              workmode: item.workmode,
              team: item.team,
              employeecount: item.employeecount,
              designation: item.designation,
              shiftgrouping:
                item.shiftgrouping == "Please Select Shift Group"
                  ? ""
                  : item.shiftgrouping,
              shifttiming:
                item.shifttiming == "Please Select Shift"
                  ? ""
                  : item.shifttiming,
              weekoff: item.weekoff?.join(",")?.toString(),
              reportingto: item.reportingto,
              empcode: item.empcode,
              workstation: item.workstation?.includes(
                "Please Select Primary Work Station"
              )
                ? ""
                : Array.isArray(item.workstation)
                  ? item.workstation?.join(",")?.toString()
                  : item.workstation,
              pdoorno: item.pdoorno,
              pstreet: item.pstreet,
              parea: item.parea,
              plandmark: item.plandmark,
              ptaluk: item.ptaluk,
              ppost: item.ppost,
              ppincode: item.ppincode,
              pcountry: item.pcountry,
              pstate: item.pstate,
              pcity: item.pcity,
              profileimage: item?.profileimage,

              cdoorno: item.cdoorno,
              cstreet: item.cstreet,
              carea: item.carea,
              clandmark: item.clandmark,
              ctaluk: item.ctaluk,
              cpost: item.cpost,
              cpincode: item.cpincode,
              ccountry: item.ccountry,
              cstate: item.cstate,
              ccity: item.ccity,
              rocketchatemail: item.rocketchatemail || "",
              rocketchatroles: item.rocketchatroles?.length > 0 ? item.rocketchatroles?.join(",") : "",
              // bankname: item.bankname,
              // bankbranchname: item.bankbranchname,
              // accountholdername: item.accountholdername,
              // accountnumber: item.accountnumber,
              // ifsccode: item.ifsccode,
              // accounttype: item.accounttype,
            };
          })
        );
      } else {
        setEmployeelists([]);
      }

      setFilterLoader(false);
      setTableLoader(false);
    } catch (err) {
      console.log(err);
      setFilterLoader(true);
      setEmployeelists([]);
      setTableLoader(true);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
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

      let mappedemployees = allUsersData
        ?.filter(
          (u) =>
            selectedCompany?.includes(u.company) &&
            selectedBranch?.includes(u.branch) &&
            selectedUnit?.includes(u.unit) &&
            selectedTeam?.includes(u.team)
          // &&
          // u.workmode !== "Internship"
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
          //  &&
          // u.workmode !== "Internship"
        )
        .map((u) => u.companyname);
      setValueTeamCat(selectedTeam);
      setSelectedOptionsTeam(mappedTeam);
      setAllAssignCompany(selectedCompany);

      setAllAssignBranch(selectedBranch);

      setAllAssignUnit(selectedUnit);

      setValueEmployeeCat(employees);
      setSelectedOptionsEmployee(mappedemployees);
      setValueEmp(mappedemployees?.map(a => a.value));
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

  //FILTER END

  const exportFields = [
    { key: "serialNumber", label: "Sno", generate: (t, index) => index + 1 },

    { key: "firstname", label: "First Name" },
    { key: "lastname", label: "Last Name" },
    { key: "legalname", label: "Legal Name" },
    { key: "callingname", label: "Calling Name" },
    { key: "fathername", label: "Father Name" },
    { key: "mothername", label: "Mother Name" },
    { key: "gender", label: "Gender" },
    { key: "maritalstatus", label: "Marital Status" },
    { key: "dom", label: "Date Of Marriage" },
    { key: "dob", label: "Date Of Birth" },
    { key: "religion", label: "Religion" },
    { key: "bloodgroup", label: "Blood Group" },
    { key: "email", label: "Email" },
    { key: "location", label: "Location" },
    { key: "contactpersonal", label: "Contact Personal" },
    { key: "contactfamily", label: "Contact Family" },
    { key: "emergencyno", label: "Emergency No" },
    { key: "dot", label: "DOT" },
    { key: "doj", label: "DOJ" },
    { key: "aadhar", label: "Aadhar No" },
    { key: "panno", label: "Pan No" },
    { key: "panrefno", label: "Pan Application Ref No" },
    { key: "username", label: "Login Name" },
    { key: "password", label: "Password" },
    { key: "companyname", label: "Company Name" },
    { key: "enquirystatus", label: "Status" },
    { key: "attendancemode", label: "Attendance Mode" },
    { key: "companyemail", label: "Company Email" },
    { key: "company", label: "Company" },
    { key: "branch", label: "Branch" },
    { key: "unit", label: "Unit" },
    { key: "floor", label: "Floor" },
    { key: "area", label: "Area" },
    { key: "department", label: "Department" },
    { key: "workmode", label: "Work Mode" },
    { key: "team", label: "Team" },
    { key: "designation", label: "Designation" },
    { key: "employeecount", label: "System Count" },
    { key: "shiftgrouping", label: "Shift Grouping" },
    { key: "shifttiming", label: "Shift Timing" },
    { key: "weekoff", label: "Week Off" },
    { key: "reportingto", label: "Reporting To" },
    { key: "empcode", label: "Empcode" },
    { key: "workstation", label: "Workstation" },
    { key: "pdoorno", label: "Permanent Door/Flat No" },
    { key: "pstreet", label: "Permanent Street/Block" },
    { key: "parea", label: "Permanent Area/village" },
    { key: "plandmark", label: "Permanent Landmark" },
    { key: "ptaluk", label: "Permanent Taluk" },
    { key: "ppost", label: "Permanent Post" },
    { key: "ppincode", label: "Permanent Pincode" },
    { key: "pcountry", label: "Permanent Country" },
    { key: "pstate", label: "Permanent State" },
    { key: "pcity", label: "Permanent City" },
    { key: "cdoorno", label: "Current Door/Flat No" },
    { key: "cstreet", label: "Current Street/Block" },
    { key: "carea", label: "Current Area/village" },
    { key: "clandmark", label: "Current Landmark" },
    { key: "ctaluk", label: "Current Taluk" },
    { key: "cpost", label: "Current Post" },
    { key: "cpincode", label: "Current Pincode" },
    { key: "ccountry", label: "Current Country" },
    { key: "cstate", label: "Current State" },
    { key: "ccity", label: "Current City" },
    // { key: "bankname", label: "Bank Name" },
    // { key: "bankbranchname", label: "Bank Branch Name" },
    // { key: "accountholdername", label: "Account Holder Name" },
    // { key: "accountnumber", label: "Account Number" },
    // { key: "ifsccode", label: "IFSC Code" },
    // { key: "accounttype", label: "Account Type" },
    { key: "rocketchatemail", label: "Rocketchat Email" },
    { key: "rocketchatroles", label: "Rocketchat Roles" },
    { key: "profileimage", label: "Profile" },
  ];

  const tableColumns = [
    { key: "serialNumber", label: "SI.No" },
    { key: "firstname", label: "First Name" },
    { key: "lastname", label: "Last Name" },
    { key: "legalname", label: "Legal Name" },
    { key: "callingname", label: "Calling Name" },
    { key: "fathername", label: "Father Name" },
    { key: "mothername", label: "Mother Name" },
    { key: "gender", label: "Gender" },
    { key: "maritalstatus", label: "Marital Status" },
    { key: "dom", label: "Date Of Marriage" },
    { key: "dob", label: "Date Of Birth" },
    { key: "religion", label: "Religion" },
    { key: "bloodgroup", label: "Blood Group" },
    { key: "email", label: "Email" },
    { key: "location", label: "Location" },
    { key: "contactpersonal", label: "Contact Personal" },
    { key: "contactfamily", label: "Contact Family" },
    { key: "emergencyno", label: "Emergency No" },
    { key: "dot", label: "DOT" },
    { key: "doj", label: "DOJ" },
    { key: "aadhar", label: "Aadhar No" },
    { key: "panno", label: "Pan No" },
    { key: "panrefno", label: "Pan Application Ref No" },
    { key: "username", label: "Login Name" },
    { key: "password", label: "Password" },
    { key: "companyname", label: "Company Name" },
    { key: "enquirystatus", label: "Status" },
    { key: "attendancemode", label: "Attendance Mode" },
    { key: "companyemail", label: "Company Email" },
    { key: "company", label: "Company" },
    { key: "branch", label: "Branch" },
    { key: "unit", label: "Unit" },
    { key: "floor", label: "Floor" },
    { key: "area", label: "Area" },
    { key: "department", label: "Department" },
    { key: "workmode", label: "Work Mode" },
    { key: "team", label: "Team" },
    { key: "designation", label: "Designation" },
    { key: "employeecount", label: "System Count" },
    { key: "shiftgrouping", label: "Shift Grouping" },
    { key: "shifttiming", label: "Shift Timing" },
    { key: "weekoff", label: "Week Off" },
    { key: "reportingto", label: "Reporting To" },
    { key: "empcode", label: "Empcode" },
    { key: "workstation", label: "Work Station" },
    { key: "pdoorno", label: "Permanent Door/Flat No" },
    { key: "pstreet", label: "Permanent Street/Block" },
    { key: "parea", label: "Permanent Area/village" },
    { key: "plandmark", label: "Permanent Landmark" },
    { key: "ptaluk", label: "Permanent Taluk" },
    { key: "ppost", label: "Permanent Post" },
    { key: "ppincode", label: "Permanent Pincode" },
    { key: "pcountry", label: "Permanent Country" },
    { key: "pstate", label: "Permanent State" },
    { key: "pcity", label: "Permanent City" },
    { key: "cdoorno", label: "Current Door/Flat No" },
    { key: "cstreet", label: "Current Street/Block" },
    { key: "carea", label: "Current Area/village" },
    { key: "clandmark", label: "Current Landmark" },
    { key: "ctaluk", label: "Current Taluk" },
    { key: "cpost", label: "Current Post" },
    { key: "cpincode", label: "Current Pincode" },
    { key: "ccountry", label: "Current Country" },
    { key: "cstate", label: "Current State" },
    { key: "ccity", label: "Current City" },
    // { key: "bankname", label: "Bank Name" },
    // { key: "bankbranchname", label: "Bank Branch Name" },
    // { key: "accountholdername", label: "Account Holder Name" },
    // { key: "accountnumber", label: "Account Number" },
    // { key: "ifsccode", label: "IFSC Code" },
    { key: "rocketchatemail", label: "Rocketchat Email" },
    { key: "rocketchatroles", label: "Rocketchat Roles" },
    { key: "profileimage", label: "Profile" },
  ];

  const [employeelists, setEmployeelists] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { auth } = useContext(AuthContext);
  const [employeeCheck, setEmployeecheck] = useState(true);
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [checked, setChecked] = useState(true);
  const handleChange = (event) => {
    Object.keys(columnVisibility).forEach((key) => {
      columnVisibility[key] = event.target.checked;
    });
    setChecked(event.target.checked);
  };

  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

  const handleToggleColumnVisibility = (columnName) => {
    if (columnName === "checkbox") {
      // Special handling for checkbox column
      setSelectedCheckboxes((prevCheckboxes) => {
        return Object.keys(columnVisibility).filter(
          (column) => columnVisibility[column]
        );
      });
    } else {
      setColumnVisibility({
        ...columnVisibility,
        [columnName]: !columnVisibility[columnName],
      });
    }
  };

  //image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Employee Pre-Values List.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
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
    setEmployeecheck(true);
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
    // checkbox: true,
    firstname: true,
    lastname: true,
    legalname: true,
    callingname: true,
    fathername: true,
    mothername: true,
    gender: true,
    maritalstatus: true,
    dom: true,
    dob: true,
    religion: true,
    bloodgroup: true,
    email: true,
    location: true,
    contactpersonal: true,
    contactfamily: true,
    emergencyno: true,
    dot: true,
    doj: true,
    aadhar: true,
    panno: true,
    panrefno: true,
    username: true,
    password: true,
    companyname: true,
    enquirystatus: true,
    companyemail: true,
    attendancemode: true,
    company: true,
    branch: true,
    unit: true,
    floor: true,
    area: true,
    department: true,
    workmode: true,
    team: true,
    designation: true,
    employeecount: true,
    shiftgrouping: true,
    shifttiming: true,
    weekoff: true,
    reportingto: true,
    empcode: true,
    workstation: true,
    pdoorno: true,
    pstreet: true,
    parea: true,
    plandmark: true,
    ptaluk: true,
    ppost: true,
    ppincode: true,
    pcountry: true,
    pstate: true,
    pcity: true,
    cdoorno: true,
    cstreet: true,
    carea: true,
    clandmark: true,
    ctaluk: true,
    cpost: true,
    cpincode: true,
    ccountry: true,
    cstate: true,
    ccity: true,

    // bankname: true,
    // bankbranchname: true,
    // accountholdername: true,
    // accountnumber: true,
    // ifsccode: true,
    // accounttype: true,
    rocketchatemail: true,
    rocketchatroles: true,
    workmode: true,
    profileimage: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  const filteredColumnsNew = tableColumns.filter(
    (column) => columnVisibility[column.key]
  );

  useEffect(() => {
    const allTrue = Object.values(columnVisibility).every(
      (value) => value === true
    );
    if (allTrue) {
      setChecked(true);
    } else {
      setChecked(false);
    }
  }, [columnVisibility]);

  const [pdfColumns, setPdfColumns] = useState([]);

  let columnData = [
    { title: "Sno", dataKey: "serialNumber" },
    { title: "First Name", dataKey: "firstname" },
    { title: "Last Name", dataKey: "lastname" },
    { title: "Legal Name", dataKey: "legalname" },
    { title: "Calling Name", dataKey: "callingname" },
    { title: "Father Name", dataKey: "fathername" },
    { title: "Mother Name", dataKey: "mothername" },
    { title: "Gender", dataKey: "gender" },
    { title: "Marital Status", dataKey: "maritalstatus" },
    { title: "Date Of Marriage", dataKey: "dom" },
    { title: "Date Of Birth", dataKey: "dob" },
    { title: "Religion", dataKey: "religion" },
    { title: "Blood Group", dataKey: "bloodgroup" },
    { title: "Email", dataKey: "email" },
    { title: "Location", dataKey: "location" },
    { title: "Contact Personal", dataKey: "contactpersonal" },
    { title: "Contact Family", dataKey: "contactfamily" },
    { title: "Emergency No", dataKey: "emergencyno" },
    { title: "DOT", dataKey: "dot" },
    { title: "DOJ", dataKey: "doj" },
    { title: "Aadhar No", dataKey: "aadhar" },
    { title: "Pan No", dataKey: "panno" },
    { title: "Pan Application Ref No", dataKey: "panrefno" },
    { title: "Login Name", dataKey: "username" },
    { title: "Password", dataKey: "password" },
    { title: "Company Name", dataKey: "companyname" },
    { title: "Status", dataKey: "enquirystatus" },
    { title: "Attendance Mode", dataKey: "attendancemode" },
    { title: "Company Email", dataKey: "companyemail" },
    { title: "Company", dataKey: "company" },
    { title: "Branch", dataKey: "branch" },
    { title: "Unit", dataKey: "unit" },
    { title: "Floor", dataKey: "floor" },
    { title: "Area", dataKey: "area" },
    { title: "Department", dataKey: "department" },
    { title: "Work Mode", dataKey: "workmode" },
    { title: "Team", dataKey: "team" },
    { title: "Designation", dataKey: "designation" },
    { title: "System Count", dataKey: "employeecount" },
    { title: "Shift Grouping", dataKey: "shiftgrouping" },
    { title: "Shift Timing", dataKey: "shifttiming" },
    { title: "Week Off", dataKey: "weekoff" },
    { title: "Reporting To", dataKey: "reportingto" },
    { title: "Empcode", dataKey: "empcode" },
    { title: "Work Station", dataKey: "workstation" },
    { title: "Permanent Door/Flat No", dataKey: "pdoorno" },
    { title: "Permanent Street/Block", dataKey: "pstreet" },
    { title: "Permanent Area/village", dataKey: "parea" },
    { title: "Permanent Landmark", dataKey: "plandmark" },
    { title: "Permanent Taluk", dataKey: "ptaluk" },
    { title: "Permanent Post", dataKey: "ppost" },
    { title: "Permanent Pincode", dataKey: "ppincode" },
    { title: "Permanent Country", dataKey: "pcountry" },
    { title: "Permanent State", dataKey: "pstate" },
    { title: "Permanent City", dataKey: "pcity" },

    { title: "Current Door/Flat No", dataKey: "cdoorno" },
    { title: "Current Street/Block", dataKey: "cstreet" },
    { title: "Current Area/village", dataKey: "carea" },
    { title: "Current Landmark", dataKey: "clandmark" },
    { title: "Current Taluk", dataKey: "ctaluk" },
    { title: "Current Post", dataKey: "cpost" },
    { title: "Current Pincode", dataKey: "cpincode" },
    { title: "Current Country", dataKey: "ccountry" },
    { title: "Current State", dataKey: "cstate" },
    { title: "Current City", dataKey: "ccity" },

    // { title: "Bank Name", dataKey: "bankname" },
    // { title: "Bank Branch Name", dataKey: "bankbranchname" },
    // { title: "Account Holder Name", dataKey: "accountholdername" },
    // { title: "Account Number", dataKey: "accountnumber" },
    // { title: "IFSC Code", dataKey: "ifsccode" },
    // { title: "Account Type", dataKey: "accounttype" },
    { title: "Rocketchat Email", dataKey: "rocketchatemail" },
    { title: "Rocketchat Roles", dataKey: "rocketchatroles" },
    { title: "Profile", dataKey: "profileimage" },
  ];

  useEffect(() => {
    let filteredDatas = columnData.filter((data) => {
      return columnVisibility[data?.dataKey];
    });
    setPdfColumns(filteredDatas);
  }, [columnVisibility, checked]);

  const downloadPdf = async (Exports) => {
    const doc = new jsPDF({ orientation: "landscape" });

    const maxColumnsPerPage = 10; // Set max columns per page

    const imagesToLoad = [];
    const filteredDataTwo = (filteredChanges !== null ? filteredRowData : rowDataTable) ?? [];

    const tableRows =
      Exports === "filtered"
        ? filteredDataTwo.map((item, index) => {
          const rowData = pdfColumns.map((col) => {
            if (col.dataKey === "profileimage") {
              return ""; // Placeholder for the image column
            }
            return item[col.dataKey] || "";
          });
          if (item.profileimage && item.profileimage !== "undefined") {
            const base64Image = item.profileimage.startsWith("data:image/")
              ? item.profileimage
              : `data:image/png;base64,${item.profileimage}`;
            imagesToLoad.push({ index, imageBase64: base64Image });
          } else {
            console.warn(
              `Missing or invalid profile image for index ${index}. Skipping image.`
            );
          }
          return rowData;
        })
        : employeelists.map((item, index) => {
          const rowData = pdfColumns.map((col) => {
            if (col.dataKey === "profileimage") {
              return ""; // Placeholder for the image column
            }
            return item[col.dataKey] || "";
          });
          if (item.profileimage && item.profileimage !== "undefined") {
            const base64Image = item.profileimage.startsWith("data:image/")
              ? item.profileimage
              : `data:image/png;base64,${item.profileimage}`;
            imagesToLoad.push({ index, imageBase64: base64Image });
          } else {
            console.warn(
              `Missing or invalid profile image for index ${index}. Skipping image.`
            );
          }
          return rowData;
        });
    console.log("Images to load:", imagesToLoad);
    const loadImage = (imageBase64) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => {
          // Provide a default image as a fallback
          const defaultImg = new Image();
          defaultImg.onload = () => resolve(defaultImg);
          defaultImg.src = ""; // base64 for a default image
        };
        img.src = imageBase64;
      });
    };
    let loadedImages = [];
    try {
      loadedImages = await Promise.all(
        imagesToLoad.map((item) =>
          loadImage(item.imageBase64).then((img) => ({ ...item, img }))
        )
      );
      console.log("Loaded images:", loadedImages);
    } catch (error) {
      console.log(error, "Failed to load images. Please try again.");
      alert("Failed to load images. Please try again.");
      return;
    }

    const totalPages = Math.ceil(pdfColumns.length / maxColumnsPerPage);
    try {
      for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
        const startIdx = (currentPage - 1) * maxColumnsPerPage;
        const endIdx = Math.min(startIdx + maxColumnsPerPage, pdfColumns.length);

        const currentPageColumns = pdfColumns.slice(startIdx, endIdx);
        const currentPageColumnTitles = currentPageColumns.map(
          (col) => col.title
        );

        doc.autoTable({
          head: [currentPageColumnTitles],
          body: tableRows.map((row) => row.slice(startIdx, endIdx)),
          startY: currentPage === 1 ? 20 : 10,
          didDrawCell: (data) => {
            if (
              data.section === "body" &&
              currentPageColumns[data.column.index].dataKey === "profileimage"
            ) {
              const imageInfo = loadedImages.find(
                (image) => image.index === data.row.index
              );
              if (imageInfo) {
                const imageHeight = 20;
                const imageWidth = 20;
                const xOffset = (data.cell.width - imageWidth) / 2;
                const yOffset = (data.cell.height - imageHeight) / 2;

                try {
                  doc.addImage(
                    imageInfo.img,
                    "PNG",
                    data.cell.x + xOffset,
                    data.cell.y + yOffset,
                    imageWidth,
                    imageHeight
                  );
                } catch (error) {
                  console.log("Failed to add image:", error);
                }
                data.cell.height = 20;
              }
            }
          },
          headStyles: {
            minCellHeight: 5,
            fontSize: 4,
            cellPadding: { top: 2, right: 5, bottom: 2, left: 0 },
          },
          bodyStyles: {
            fontSize: 4,
            minCellHeight: 20,
            cellPadding: { top: 7, right: 1, bottom: 0, left: 1 },
          },
        });

        if (currentPage < totalPages) {
          doc.addPage();
        }

      }
      setIsPdfFilterOpen(false);
      setIsLoading(false);
      doc.save("Employee Pre-Values List.pdf");
    } catch (error) {
      setIsLoading(false);
      setIsPdfFilterOpen(false);
      console.log(error, "Failed to generate PDF. Please try again.")
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  // Excel
  const fileName = "Employee Pre-Values List";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Employee Pre-Values List",
    pageStyle: "print",
  });

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [items, setItems] = useState([]);

  const addSerialNumber = (datas) => {
    const itemsWithSerialNumber = datas?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      // bankname: item?.bankdetails
      //   ?.map((t, i) => t?.bankname)
      //   ?.join(",")
      //   .toString(),
      // bankbranchname: item?.bankdetails
      //   ?.map((t, i) => t?.bankbranchname)
      //   ?.join(",")
      //   .toString(),
      // accountholdername: item?.bankdetails
      //   ?.map((t, i) => t?.accountholdername)
      //   ?.join(",")
      //   .toString(),
      // accountnumber: item?.bankdetails
      //   ?.map((t, i) => t?.accountnumber)
      //   ?.join(",")
      //   .toString(),
      // ifsccode: item?.bankdetails
      //   ?.map((t, i) => t?.ifsccode)
      //   ?.join(",")
      //   .toString(),
      // accounttype: item?.bankdetails
      //   ?.map((t, i) => t?.accounttype)
      //   ?.join(",")
      //   .toString(),
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber(employeelists);
  }, [employeelists]);

  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSelectedRows([]);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setSelectedRows([]);
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

  const columnDataTable = [
    {
      field: "serialNumber",
      headerName: "SNo",
      pinned: "left",
      flex: 0,
      width: 90,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },

    {
      field: "workmode",
      headerName: "Work Mode",
      flex: 0,
      width: 100,
      hide: !columnVisibility.workmode,
      headerClassName: "bold-header",
    },
    {
      field: "firstname",
      headerName: "First Name",
      flex: 0,
      width: 100,
      hide: !columnVisibility.firstname,
      headerClassName: "bold-header",
    },
    {
      field: "lastname",
      headerName: "Last Name",
      flex: 0,
      width: 100,
      hide: !columnVisibility.lastname,
      headerClassName: "bold-header",
    },
    {
      field: "legalname",
      headerName: "Legal Name",
      flex: 0,
      width: 100,
      hide: !columnVisibility.legalname,
      headerClassName: "bold-header",
    },
    {
      field: "callingname",
      headerName: "Calling Name",
      flex: 0,
      width: 100,
      hide: !columnVisibility.callingname,
      headerClassName: "bold-header",
    },
    {
      field: "fathername",
      headerName: "Father Name",
      flex: 0,
      width: 100,
      hide: !columnVisibility.fathername,
      headerClassName: "bold-header",
    },
    {
      field: "mothername",
      headerName: "Mother Name",
      flex: 0,
      width: 100,
      hide: !columnVisibility.mothername,
      headerClassName: "bold-header",
    },
    {
      field: "gender",
      headerName: "Gender",
      flex: 0,
      width: 100,
      hide: !columnVisibility.gender,
      headerClassName: "bold-header",
    },
    {
      field: "maritalstatus",
      headerName: "Marital Status",
      flex: 0,
      width: 100,
      hide: !columnVisibility.maritalstatus,
      headerClassName: "bold-header",
    },
    {
      field: "dom",
      headerName: "Date Of Marriage",
      flex: 0,
      width: 100,
      hide: !columnVisibility.dom,
      headerClassName: "bold-header",
    },
    {
      field: "dob",
      headerName: "Date Of Birth",
      flex: 0,
      width: 100,
      hide: !columnVisibility.dob,
      headerClassName: "bold-header",
    },
    {
      field: "religion",
      headerName: "Religion",
      flex: 0,
      width: 100,
      hide: !columnVisibility.religion,
      headerClassName: "bold-header",
    },
    {
      field: "bloodgroup",
      headerName: "Blood Group",
      flex: 0,
      width: 100,
      hide: !columnVisibility.bloodgroup,
      headerClassName: "bold-header",
    },

    {
      field: "email",
      headerName: "Email",
      flex: 0,
      width: 100,
      hide: !columnVisibility.email,
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
      field: "contactpersonal",
      headerName: "Contact Personal",
      flex: 0,
      width: 100,
      hide: !columnVisibility.contactpersonal,
      headerClassName: "bold-header",
    },
    {
      field: "contactfamily",
      headerName: "Contact Family",
      flex: 0,
      width: 100,
      hide: !columnVisibility.contactfamily,
      headerClassName: "bold-header",
    },
    {
      field: "emergencyno",
      headerName: "Emergency No",
      flex: 0,
      width: 100,
      hide: !columnVisibility.emergencyno,
      headerClassName: "bold-header",
    },
    {
      field: "dot",
      headerName: "DOT",
      flex: 0,
      width: 100,
      hide: !columnVisibility.dot,
      headerClassName: "bold-header",
    },
    {
      field: "doj",
      headerName: "DOJ",
      flex: 0,
      width: 100,
      hide: !columnVisibility.doj,
      headerClassName: "bold-header",
    },
    {
      field: "aadhar",
      headerName: "Aadhar No",
      flex: 0,
      width: 100,
      hide: !columnVisibility.aadhar,
      headerClassName: "bold-header",
    },
    {
      field: "panno",
      headerName: "Pan No",
      flex: 0,
      width: 100,
      hide: !columnVisibility.panno,
      headerClassName: "bold-header",
    },
    {
      field: "panrefno",
      headerName: "Pan Application Ref No",
      flex: 0,
      width: 100,
      hide: !columnVisibility.panrefno,
      headerClassName: "bold-header",
    },
    {
      field: "username",
      headerName: "Login Name",
      flex: 0,
      width: 100,
      hide: !columnVisibility.username,
      headerClassName: "bold-header",
    },
    {
      field: "password",
      headerName: "Password",
      flex: 0,
      width: 100,
      hide: !columnVisibility.password,
      headerClassName: "bold-header",
    },
    {
      field: "companyname",
      pinned: "left",
      headerName: "Company Name",
      flex: 0,
      width: 100,
      hide: !columnVisibility.companyname,
      headerClassName: "bold-header",
    },
    {
      field: "enquirystatus",
      headerName: "Status",
      flex: 0,
      width: 100,
      hide: !columnVisibility.enquirystatus,
      headerClassName: "bold-header",
    },
    {
      field: "attendancemode",
      headerName: "Attendance Mode",
      flex: 0,
      width: 100,
      hide: !columnVisibility.attendancemode,
      headerClassName: "bold-header",
    },
    {
      field: "companyemail",
      pinned: "left",
      headerName: "Company Email",
      flex: 0,
      width: 100,
      hide: !columnVisibility.companyemail,
      headerClassName: "bold-header",
    },
    {
      field: "company",
      pinned: "left",
      headerName: "Company",
      flex: 0,
      width: 100,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      pinned: "left",
      headerName: "Branch",
      flex: 0,
      width: 100,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
    },
    {
      field: "unit",
      pinned: "left",
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
      width: 100,
      hide: !columnVisibility.area,
      headerClassName: "bold-header",
    },
    {
      field: "department",
      headerName: "Department",
      flex: 0,
      width: 100,
      hide: !columnVisibility.department,
      headerClassName: "bold-header",
    },
    {
      field: "workmode",
      headerName: "Work Mode",
      flex: 0,
      width: 100,
      hide: !columnVisibility.workmode,
      headerClassName: "bold-header",
    },
    {
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 100,
      hide: !columnVisibility.team,
      headerClassName: "bold-header",
    },
    {
      field: "designation",
      headerName: "Designation",
      flex: 0,
      width: 100,
      hide: !columnVisibility.designation,
      headerClassName: "bold-header",
    },
    {
      field: "employeecount",
      headerName: "System Count",
      flex: 0,
      width: 100,
      hide: !columnVisibility.employeecount,
      headerClassName: "bold-header",
    },
    {
      field: "shiftgrouping",
      headerName: "Shift Grouping",
      flex: 0,
      width: 100,
      hide: !columnVisibility.shiftgrouping,
      headerClassName: "bold-header",
    },
    {
      field: "shifttiming",
      headerName: "Shift Timing",
      flex: 0,
      width: 100,
      hide: !columnVisibility.shifttiming,
      headerClassName: "bold-header",
    },
    {
      field: "weekoff",
      headerName: "Week Off",
      flex: 0,
      width: 100,
      hide: !columnVisibility.weekoff,
      headerClassName: "bold-header",
    },
    {
      field: "reportingto",
      headerName: "Reporting To",
      flex: 0,
      width: 100,
      hide: !columnVisibility.reportingto,
      headerClassName: "bold-header",
    },
    {
      field: "empcode",
      headerName: "Empcode",
      flex: 0,
      width: 100,
      hide: !columnVisibility.empcode,
      headerClassName: "bold-header",
    },
    {
      field: "workstation",
      headerName: "Work Station",
      flex: 0,
      width: 100,
      hide: !columnVisibility.workstation,
      headerClassName: "bold-header",
    },
    {
      field: "pdoorno",
      headerName: "Permanent Door/Flat No ",
      flex: 0,
      width: 100,
      hide: !columnVisibility.pdoorno,
      headerClassName: "bold-header",
    },
    {
      field: "pstreet",
      headerName: "Permanent Street/Block ",
      flex: 0,
      width: 100,
      hide: !columnVisibility.pstreet,
      headerClassName: "bold-header",
    },
    {
      field: "parea",
      headerName: "Permanent Area/village ",
      flex: 0,
      width: 100,
      hide: !columnVisibility.parea,
      headerClassName: "bold-header",
    },
    {
      field: "plandmark",
      headerName: "Permanent Landmark ",
      flex: 0,
      width: 100,
      hide: !columnVisibility.plandmark,
      headerClassName: "bold-header",
    },
    {
      field: "ptaluk",
      headerName: "Permanent Taluk ",
      flex: 0,
      width: 100,
      hide: !columnVisibility.ptaluk,
      headerClassName: "bold-header",
    },
    {
      field: "ppost",
      headerName: "Permanent Post ",
      flex: 0,
      width: 100,
      hide: !columnVisibility.ppost,
      headerClassName: "bold-header",
    },
    {
      field: "ppincode",
      headerName: "Permanent Pincode ",
      flex: 0,
      width: 100,
      hide: !columnVisibility.ppincode,
      headerClassName: "bold-header",
    },
    {
      field: "pcountry",
      headerName: "Permanent Country ",
      flex: 0,
      width: 100,
      hide: !columnVisibility.pcountry,
      headerClassName: "bold-header",
    },
    {
      field: "pstate",
      headerName: "Permanent State ",
      flex: 0,
      width: 100,
      hide: !columnVisibility.pstate,
      headerClassName: "bold-header",
    },
    {
      field: "pcity",
      headerName: "Permanent City ",
      flex: 0,
      width: 100,
      hide: !columnVisibility.pcity,
      headerClassName: "bold-header",
    },

    {
      field: "cdoorno",
      headerName: "Current Door/Flat No ",
      flex: 0,
      width: 100,
      hide: !columnVisibility.cdoorno,
      headerClassName: "bold-header",
    },
    {
      field: "cstreet",
      headerName: "Current Street/Block ",
      flex: 0,
      width: 100,
      hide: !columnVisibility.cstreet,
      headerClassName: "bold-header",
    },
    {
      field: "carea",
      headerName: "Current Area/village ",
      flex: 0,
      width: 100,
      hide: !columnVisibility.carea,
      headerClassName: "bold-header",
    },
    {
      field: "clandmark",
      headerName: "Current Landmark ",
      flex: 0,
      width: 100,
      hide: !columnVisibility.clandmark,
      headerClassName: "bold-header",
    },
    {
      field: "ctaluk",
      headerName: "Current Taluk ",
      flex: 0,
      width: 100,
      hide: !columnVisibility.ctaluk,
      headerClassName: "bold-header",
    },
    {
      field: "cpost",
      headerName: "Current Post ",
      flex: 0,
      width: 100,
      hide: !columnVisibility.cpost,
      headerClassName: "bold-header",
    },
    {
      field: "cpincode",
      headerName: "Current Pincode ",
      flex: 0,
      width: 100,
      hide: !columnVisibility.cpincode,
      headerClassName: "bold-header",
    },
    {
      field: "ccountry",
      headerName: "Current Country ",
      flex: 0,
      width: 100,
      hide: !columnVisibility.ccountry,
      headerClassName: "bold-header",
    },
    {
      field: "cstate",
      headerName: "Current State ",
      flex: 0,
      width: 100,
      hide: !columnVisibility.cstate,
      headerClassName: "bold-header",
    },
    {
      field: "ccity",
      headerName: "Current City ",
      flex: 0,
      width: 100,
      hide: !columnVisibility.ccity,
      headerClassName: "bold-header",
    },
    {
      field: "rocketchatemail",
      headerName: "Rocketchat Email",
      flex: 0,
      width: 100,
      hide: !columnVisibility.rocketchatemail,
      headerClassName: "bold-header",
    },
    {
      field: "rocketchatroles",
      headerName: "Rocketchat Roles",
      flex: 0,
      width: 100,
      hide: !columnVisibility.rocketchatroles,
      headerClassName: "bold-header",
    },

    // {
    //   field: "bankname",
    //   headerName: "Bank Name ",
    //   flex: 0,
    //   width: 100,
    //   hide: !columnVisibility.bankname,
    //   headerClassName: "bold-header",
    // },
    // {
    //   field: "bankbranchname",
    //   headerName: "Bank Branch Name ",
    //   flex: 0,
    //   width: 100,
    //   hide: !columnVisibility.bankbranchname,
    //   headerClassName: "bold-header",
    // },
    // {
    //   field: "accountholdername",
    //   headerName: "Account Holder Name ",
    //   flex: 0,
    //   width: 100,
    //   hide: !columnVisibility.accountholdername,
    //   headerClassName: "bold-header",
    // },
    // {
    //   field: "accountnumber",
    //   headerName: "Account Number",
    //   flex: 0,
    //   width: 100,
    //   hide: !columnVisibility.accountnumber,
    //   headerClassName: "bold-header",
    // },
    // {
    //   field: "ifsccode",
    //   headerName: "IFSC Code",
    //   flex: 0,
    //   width: 100,
    //   hide: !columnVisibility.ifsccode,
    //   headerClassName: "bold-header",
    // },
    // {
    //   field: "accounttype",
    //   headerName: "Account Type",
    //   flex: 0,
    //   width: 100,
    //   hide: !columnVisibility.accounttype,
    //   headerClassName: "bold-header",
    // },
    {
      field: "profileimage",
      headerName: "Profile",
      flex: 0,
      width: 100,
      hide: !columnVisibility.profileimage,
      headerClassName: "bold-header",
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cellRenderer: (params) => {
        // Define how you want to render the cell here
        // Example: return an image

        return params.value !== "" ? (
          <img
            src={params.value}
            alt="Profile"
            style={{ width: "100%", height: "auto" }}
          />
        ) : (
          <></>
        );
      },
    },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      firstname: item.firstname,
      lastname: item.lastname,
      legalname: item.legalname,
      callingname: item.callingname,
      fathername: item.fathername,
      mothername: item.mothername,
      gender: item.gender,
      maritalstatus: item.maritalstatus,
      dom: item.dom,
      dob: item.dob,
      religion: item.religion || "",
      bloodgroup: item.bloodgroup,
      email: item.email,
      location: item.location,
      contactpersonal: item.contactpersonal,
      contactfamily: item.contactfamily,
      emergencyno: item.emergencyno,
      dot: item.dot,
      doj: item.doj,
      aadhar: item.aadhar,
      panno: item.panno,
      panrefno: item.panrefno,
      username: item.username,
      password: item.password,
      companyname: item.companyname,
      attendancemode: item.attendancemode,
      enquirystatus: item.enquirystatus,
      companyemail: item.companyemail,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      floor: item.floor,
      area: item.area,
      department: item.department,
      workmode: item.workmode,
      team: item.team,
      employeecount: item.employeecount,
      designation: item.designation,
      shiftgrouping: item.shiftgrouping,
      shifttiming: item.shifttiming,
      weekoff: item.weekoff,
      reportingto: item.reportingto,
      empcode: item.empcode,
      workstation: item.workstation,
      pdoorno: item.pdoorno,
      pstreet: item.pstreet,
      parea: item.parea,
      plandmark: item.plandmark,
      ptaluk: item.ptaluk,
      ppost: item.ppost,
      ppincode: item.ppincode,
      pcountry: item.pcountry,
      pstate: item.pstate,
      pcity: item.pcity,
      profileimage: item?.profileimage,

      cdoorno: item.cdoorno,
      cstreet: item.cstreet,
      carea: item.carea,
      clandmark: item.clandmark,
      ctaluk: item.ctaluk,
      cpost: item.cpost,
      cpincode: item.cpincode,
      ccountry: item.ccountry,
      cstate: item.cstate,
      ccity: item.ccity,
      rocketchatemail: item.rocketchatemail,
      rocketchatroles: item.rocketchatroles,
      // bankname: item.bankname,
      // bankbranchname: item.bankbranchname,
      // accountholdername: item.accountholdername,
      // accountnumber: item.accountnumber,
      // ifsccode: item.ifsccode,
      // accounttype: item.accounttype,
    };
  });

  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRows.includes(row.id),
  }));

  // Show All Columns functionality
  const handleShowAllColumns = () => {
    setColumnVisibility(initialColumnVisibility);
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
  return (
    <Box>
      <Headtitle title={"Employee Pre-Values List"} />
      <PageHeading
        title="Employee Pre-Values List"
        modulename="Human Resources"
        submodulename="HR"
        mainpagename="Employee"
        subpagename="Employee details"
        subsubpagename="Employee Prevalues List"
      />

      {isUserRoleCompare?.includes("aemployeeprevalueslist") && (
        <>
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2} sx={{ display: "flex" }}>
                <Grid item xs={10}>
                  <Typography sx={userStyle.importheadtext}>
                    Manage Employee Pre-Values List
                  </Typography>
                </Grid>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={handleChange}
                      name="myCheckbox"
                      color="primary"
                      size="small"
                      indeterminate={checked === undefined}
                    />
                  }
                  label="Select All"
                />
              </Grid>
              <br />
              <Grid container spacing={2}>
                {/* Checkbox Grid */}
                {columnDataTable.map((column) => (
                  <Grid key={column.field} item md={2}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={
                              columnVisibility[column.field] ||
                              (column.field === "checkbox" &&
                                selectedCheckboxes.length > 0)
                            }
                            onChange={() =>
                              handleToggleColumnVisibility(column.field)
                            }
                          />
                        }
                        label={column.headerName
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          ) // Capitalize each word
                          .join(" ")} // Join the capitalized words with a space
                      />
                    </FormGroup>
                  </Grid>
                ))}
              </Grid>
            </>
          </Box>
          <br />
          {isUserRoleCompare?.includes("llist") && (
            <>
              <Box sx={userStyle.selectcontainer}>
                <>
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      <Typography sx={userStyle.importheadtext}>
                        Employee List Filter
                      </Typography>
                    </Grid>
                  </Grid>
                  <br />
                  <Grid container spacing={2}>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Type<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={TypeOptions}
                          styles={colourStyles}
                          value={{
                            label: filterState.type ?? "Please Select Type",
                            value: filterState.type ?? "Please Select Type",
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
                                    i.label === item.label &&
                                    i.value === item.value
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

                    {/* <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Employee Status<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={EmployeeStatusOptions}
                        styles={colourStyles}
                        value={{
                          label:
                            filterState.employeestatus ??
                            "Please Select Employee Status",
                          value:
                            filterState.employeestatus ??
                            "Please Select Employee Status",
                        }}
                        onChange={(e) => {
                          setFilterState((prev) => ({
                            ...prev,
                            employeestatus: e.value,
                          }));
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
                        }}
                      />
                    </FormControl>
                  </Grid> */}

                    {["Individual", "Team"]?.includes(filterState.type) ? (
                      <>
                        {/* Branch Unit Team */}
                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              {" "}
                              Branch<b style={{ color: "red" }}>*</b>
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
                              Unit<b style={{ color: "red" }}>*</b>
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
                        <Grid item md={3} xs={12} sm={6}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Team<b style={{ color: "red" }}>*</b>
                            </Typography>
                            <MultiSelect
                              options={allTeam
                                ?.filter(
                                  (u) =>
                                    valueCompanyCat?.includes(u.company) &&
                                    valueBranchCat?.includes(u.branch) &&
                                    valueUnitCat?.includes(u.unit)
                                )
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
                    ) : ["Department"]?.includes(filterState.type) ? (
                      <>
                        {/* Department */}
                        <Grid item md={3} xs={12} sm={6}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Department<b style={{ color: "red" }}>*</b>
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
                    ) : ["Branch"]?.includes(filterState.type) ? (
                      <>
                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              {" "}
                              Branch<b style={{ color: "red" }}>*</b>
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
                      </>
                    ) : ["Unit"]?.includes(filterState.type) ? (
                      <>
                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              {" "}
                              Branch<b style={{ color: "red" }}>*</b>
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
                              Unit <b style={{ color: "red" }}>*</b>
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
                    ) : (
                      ""
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
                      <div style={{ display: "flex", gap: "20px" }}>
                        <LoadingButton
                          variant="contained"
                          color="primary"
                          onClick={handleFilter}
                          loading={filterLoader}
                          sx={buttonStyles.buttonsubmit}
                        >
                          Filter
                        </LoadingButton>

                        <Button
                          sx={buttonStyles.btncancel}
                          onClick={handleClearFilter}
                        >
                          Clear
                        </Button>
                      </div>
                    </Grid>
                  </Grid>
                </>
              </Box>
            </>
          )}
        </>
      )}

      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lemployeeprevalueslist") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Employee Pre-Values List
              </Typography>
            </Grid>
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
                    <MenuItem value={employeelists?.length}>All</MenuItem>
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
                    "excelemployeeprevalueslist"
                  ) && (
                      <>
                        <Button
                          onClick={(e) => {
                            setIsFilterOpen(true);
                            setFormat("xl");
                            // fetchEmployeeSystemArray()
                          }}
                          sx={userStyle.buttongrp}
                        >
                          <FaFileExcel />
                          &ensp;Export to Excel&ensp;
                        </Button>
                      </>
                    )}
                  {isUserRoleCompare?.includes("csvemployeeprevalueslist") && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          // fetchEmployeeSystemArray()
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
                    "printemployeeprevalueslist"
                  ) && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                  {isUserRoleCompare?.includes("pdfemployeeprevalueslist") && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true);
                          // fetchEmployeeSystemArray()
                        }}
                      >
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes(
                    "imageemployeeprevalueslist"
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
                  maindatas={employeelists}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                  totalDatas={employeelists}
                />
              </Grid>
            </Grid>
            <br />
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
              Show All Columns
            </Button>  &ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
              Manage Columns
            </Button>  <br />  <br />
            {tableLoader ? (
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
                <Box sx={{ width: "100%", }} className={"ag-theme-quartz"} ref={gridRefTableImg} >
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
                    gridRefTableImg={gridRefTableImg}
                    paginated={false}
                    filteredDatas={filteredDatas}
                    // totalDatas={totalDatas}
                    searchQuery={searchedString}
                    handleShowAllColumns={handleShowAllColumns}
                    setFilteredRowData={setFilteredRowData}
                    filteredRowData={filteredRowData}
                    setFilteredChanges={setFilteredChanges}
                    filteredChanges={filteredChanges}
                    itemsList={employeelists}
                  />
                </Box>
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

      {/* print layout */}
      <TableContainer
        component={Paper}
        ref={componentRef}
        sx={userStyle.printcls}
      >
        <Table
          sx={{ minWidth: 700 }}
          aria-label="customized table"
          id="usertable"
        >
          <TableHead sx={{ fontWeight: "600" }}>
            <TableRow>
              {filteredColumnsNew.map((column) => (
                <TableCell key={column.key}>{column.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {((filteredChanges !== null ? filteredRowData : rowDataTable) ?? []) &&
              ((filteredChanges !== null ? filteredRowData : rowDataTable) ?? []).map((row, index) => (
                <TableRow key={index}>
                  {filteredColumnsNew.map((column) => (
                    <TableCell key={column.key}>
                      {column.key === "serialNumber" ? (
                        index + 1
                      ) : column.key === "profileimage" ? (
                        row[column.key] !== "" ? (
                          <img
                            src={row[column.key]}
                            alt="Profile"
                            style={{ width: "50px", height: "50px" }}
                          />
                        ) : (
                          <></>
                        )
                      ) : (
                        row[column.key]
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/*Export XL Data  */}
      <Dialog
        open={isFilterOpen}
        onClose={handleCloseFilterMod}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
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

          {fileFormat === "xl" ? (
            <FaFileExcel style={{ fontSize: "70px", color: "green" }} />
          ) : (
            <FaFileCsv style={{ fontSize: "70px", color: "green" }} />
          )}
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Choose Export
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            variant="contained"
            onClick={() => {
              const filteredDataTwo = (filteredChanges !== null ? filteredRowData : rowDataTable) ?? [];
              const exportData = filteredDataTwo?.map((t, index) => {
                const row = {};
                exportFields.forEach((field) => {
                  if (columnVisibility[field.key]) {
                    row[field.label] = field.generate
                      ? field.generate(t, index)
                      : t[field.key];
                  }
                });
                return row;
              });

              ExportXLWithImages({
                csvData: exportData,
                fileName: fileName,
                columnVisibility: columnVisibility,
                exportFields: exportFields,
                setIsFilterOpen: setIsFilterOpen,
                setIsLoading: setIsLoading,
                fileFormat: fileFormat,
              });
            }}
          >
            Export Filtered Data
          </Button>

          <Button
            autoFocus
            variant="contained"
            onClick={() => {
              const exportData = employeelists?.map((t, index) => {
                const row = {};
                exportFields.forEach((field) => {
                  if (columnVisibility[field.key]) {
                    row[field.label] = field.generate
                      ? field.generate(t, index)
                      : t[field.key];
                  }
                });
                return row;
              });

              ExportXLWithImages({
                csvData: exportData,
                fileName: fileName,
                columnVisibility: columnVisibility,
                exportFields: exportFields,
                setIsFilterOpen: setIsFilterOpen,
                setIsLoading: setIsLoading,
                fileFormat: fileFormat,
              });
              setIsLoading(true);
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
      {/*Export pdf Data  */}
      <Dialog
        open={isPdfFilterOpen}
        onClose={handleClosePdfFilterMod}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
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
              downloadPdf("filtered");
              setIsPdfFilterOpen(false);
            }}
          >
            Export Filtered Data
          </Button>
          <Button
            variant="contained"
            onClick={(e) => {
              downloadPdf("overall");
              setIsLoading(true);
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
      <LoadingBackdrop open={isLoading} />

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

      {/* EXTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}

export default EmployeePrevaluesList;