import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PageHeading from "../../components/PageHeading";
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
  TextField,
  Typography,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import * as FileSaver from "file-saver";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import { StyledTableCell, StyledTableRow } from "../../components/Table";
import StyledDataGrid from "../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";

import AlertDialog from "../../components/Alert";
import MessageAlert from "../../components/MessageAlert";

import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import domtoimage from 'dom-to-image';


function OverallAssetReport() {
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTableImg = useRef(null);
  const gridRefTable = useRef(null);

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
  const { isUserRoleAccess, buttonStyles, isUserRoleCompare, pageName, setPageName, isAssignBranch } = useContext(
    UserRoleAccessContext
  );
  const accessbranch = isAssignBranch
    ?.map((data) => ({
      branch: data.branch,
      company: data.company,
      unit: data.unit,
    }))
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const PmodeOpt = [
    { label: "Working", value: "In Working" },
    { label: "Repair", value: "Repair" },
    { label: "Damage", value: "Damage" },
  ];

  const [selectedOptionsMode, setSelectedOptionsMode] = useState([]);
  let [valueMode, setValueMode] = useState([]);

  const handleModeChange = (options) => {
    setValueMode(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsMode(options);
  };

  const customValueRendererMode = (valueMode, _categoryname) => {
    return valueMode?.length
      ? valueMode.map(({ label }) => label)?.join(", ")
      : "Please Select Status";
  };

  const { auth } = useContext(AuthContext);

  useEffect(() => {
    fetchWorkStation();
    fetchAssetDetails();
  }, []);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [workStationOpt, setWorkStationOpt] = useState([]);
  const [filteredWorkStation, setFilteredWorkStation] = useState([]);
  const [selectedOptionsWorkStation, setSelectedOptionsWorkStation] = useState(
    []
  );
  let [valueWorkStation, setValueWorkStation] = useState("");

  const [exceldata, setexceldata] = useState([]);

  const [isBankdetail, setBankdetail] = useState(false);

  let username = isUserRoleAccess.username;

  const gridRef = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");

  //image
  // const handleCaptureImage = () => {
  //   if (gridRef.current) {
  //     html2canvas(gridRef.current).then((canvas) => {
  //       canvas.toBlob((blob) => {
  //         saveAs(blob, "Overall Asset Report.png");
  //       });
  //     });
  //   }
  // };

  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Overall Asset Report.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  //for assigning workstation
  const [companies, setCompanies] = useState([]);
  const [branches, setBranches] = useState([]);
  const [units, setUnits] = useState([]);
  const [teams, setTeams] = useState([]);

  //for getting branch while loading
  const [getTeams, setGetTeams] = useState([]);

  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [employee, setEmployee] = useState({
    employee: "Please Select Employee",
    employeeId: "",
  });

  // company multiselect add
  const [selectedOptionsCompanyAdd, setSelectedOptionsCompanyAdd] = useState(
    []
  );
  let [valueCompanyAdd, setValueCompanyAdd] = useState("");

  // branch multiselect add
  const [selectedOptionsBranchAdd, setSelectedOptionsBranchAdd] = useState([]);
  let [valueBranchAdd, setValueBranchAdd] = useState("");

  //units multiselcest add
  const [selectedOptionsUnitAdd, setSelectedOptionsUnitAdd] = useState([]);
  let [valueUnitAdd, setValueUnitAdd] = useState("");

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

  //fetch companies for dropdown
  const fetchComapnies = async () => {
    try {
      let res = await axios.get(SERVICE.COMPANY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      // Remove duplicates from companies
      let uniqueCompanies = Array.from(
        new Set(res?.data?.companies.map((t) => t.name))
      );
      setCompanies(
        uniqueCompanies.map((t) => ({
          label: t,
          value: t,
        }))
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchComapnies();
  }, []);

  // get all assignBranches
  const fetchBranch = async (company) => {
    try {
      let res_branch = await axios.get(SERVICE.BRANCH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let arr = [];
      res_branch?.data?.branch.map((t) => {
        company.forEach((d) => {
          if (d.value == t.company) {
            arr.push(t.name);
          }
        });
      });
      setBranches(
        arr.map((t) => ({
          label: t,
          value: t,
        }))
      );
      //   setBranchesEdit(
      //     arr.map((t) => ({
      //       label: t,
      //       value: t,
      //     }))
      //   );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // branch multi select
  const handleBranchChangeAdd = (options) => {
    setValueBranchAdd(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBranchAdd(options);
    fetchUnits(options);
    setSelectedOptionsUnitAdd([]);
    setSelectedOptionsTeamAdd([]);
    setUnits([]);
    setTeams([]);
    // setSelectedOptionsUnitAdd([]);
    // if (options.length == 0) {
    //   setSelectedOptionsUnitAdd([]);
    //   setValueUnitAdd("");
    // }
  };

  const customValueRendererBranchAdd = (valueBranchAdd, _branches) => {
    return valueBranchAdd.length ? (
      valueBranchAdd.map(({ label }) => label)?.join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>Choose Branch</span>
    );
  };

  //for fetching units
  const fetchUnits = async () => {
    try {
      let res_branchunit = await axios.get(SERVICE.UNIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setGetTeams(res_branchunit?.data?.units);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchteams();
  }, []);

  //unit multiselect
  const handleUnitChangeAdd = (options) => {
    setValueUnitAdd(
      options.map((a, index) => {
        return a.value;
      })
    );
    fetchteams(options);
    setSelectedOptionsUnitAdd(options);
    setSelectedOptionsTeamAdd([]);
    setTeams([]);
  };

  const customValueRendererUnitAdd = (valueUnitAdd, _branches) => {
    return valueUnitAdd.length ? (
      valueUnitAdd.map(({ label }) => label)?.join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>Choose Unit</span>
    );
  };

  //for fetching teams
  const fetchteams = async (unit) => {
    try {
      let res_teams = await axios.get(SERVICE.TEAMS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let arr = [];
      //   res_teams?.data?.teamsdetails.map((t) => {
      //     unit.forEach((d) => {
      //        if (d.value == t.unit && subsubcabinname.company === t.company && subsubcabinname.branch === t.branch ) {
      //          arr.push(t.teamname);
      //        }
      //      });
      //    });
      setGetTeams(res_teams?.data?.teamsdetails);
      //   setTeams(
      //     arr.map((t) => ({
      //       label: t,
      //       value: t,
      //     }))
      //   );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchWorkStation = async () => {
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

  const [openviewmaterial, setOpenviewmaterial] = useState(false);

  const handleClickOpenviewmaterial = () => {
    setOpenviewmaterial(true);
  };

  const handleCloseviewmaterial = () => {
    setOpenviewmaterial(false);
  };

  const [maintentancemasteredit, setMaintentancemasteredit] = useState({});
  const [maintentancemastereditmaterial, setMaintentancemastereditmaterial] =
    useState({});
  const [assetlimited, setAssetlimited] = useState([]);

  const getviewCode = async (
    company,
    branch,
    unit,
    floor,
    area,
    location,
    components,
    code,
    index
  ) => {
    try {
      let res = await axios.get(SERVICE.OVERALL_ASSET_LIMITED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let assetfind = res.data.assetdetails;
      setAssetlimited(assetfind);
      setMaintentancemastereditmaterial(rowDataTable[index]);

      // setMaintentancemasteredit({
      //     ...rowDataTable[index],
      //     company: company,
      //     branch: branch,
      //     unit: unit,
      //     floor: floor,
      //     area: area,
      //     location: location,
      //     assetmaterial: components,
      //     code: code,
      //     ...components.reduce((acc, loc) => {
      //         acc[loc] = rowDataTable[index][loc]; // Assume each `loc` is a key in `item`
      //         return acc;
      //     }, {})
      // });
      handleClickOpenview();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
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

  let allComponents = {};

  const [countqty, setCountqty] = useState([]);
  const [allLocs, setallLocs] = useState([]);
  const [filtertable, setFiltertable] = useState("");

  //get all employees list details
  const fetchEmployee = async () => {
    setPageName(!pageName)
    try {
      setBankdetail(true);
      setFiltertable("Location");
      if (datasToAllot.requestmode === "Location") {
        // let res_hand = await axios.get(SERVICE.ASSETDETAIL, {
        let res_hand = await axios.post(SERVICE.ASSET_DATA_FILTER_ACCESS_OLD, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          assignbranch: accessbranch,
        });
        let res_loc = await axios.get(SERVICE.LOCATIONGROUPING, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        let locationgrp = res_loc.data.locationgroupings;

        let singlehand = res_hand.data?.assetdetails;

        let statusmodefilterddata = singlehand.filter((item) =>
          valueMode.includes(item.status)
        );

        let singlehandtotal = statusmodefilterddata.reduce((acc, current) => {
          const existingItemIndex = acc.findIndex(
            (item) =>
              item.company === current.company &&
              item.branch === current.branch &&
              item.unit === current.unit &&
              item.floor === current.floor &&
              item.area === current.area &&
              item.location === current.location &&
              item.material === current.material
          );

          if (existingItemIndex !== -1) {
            // Update existing item
            const existingItem = acc[existingItemIndex];

            existingItem.countquantity += Number(current.countquantity);
            existingItem._id = current._id;
            existingItem.material = current.material;
            existingItem.location = current.location;
            existingItem.company = current.company;
            existingItem.branch = current.branch;
            existingItem.unit = current.unit;
            existingItem.floor = current.floor;
            existingItem.area = current.area;
          } else {
            // Add new item
            acc.push({
              company: current.company,
              // _id: current._id,
              branch: current.branch,
              unit: current.unit,
              floor: current.floor,
              area: current.area,
              location: current.location,
              material: current.material,
              component: current.component,
              countquantity: Number(current.countquantity),
            });
          }
          return acc;
        }, []);

        const modifiedEntries = singlehandtotal.map((entry) => {
          const filteredLocs = locationgrp
            .filter(
              (loc) =>
                loc.company === entry.company &&
                loc.branch === entry.branch &&
                loc.unit === entry.unit &&
                loc.floor === entry.floor &&
                loc.area === entry.area
            )
            .flatMap((loc) => loc.location);
          if (entry.location === "ALL") {
            return { ...entry, locs: filteredLocs, countquantity: 1 };
          } else {
            return entry;
          }
        });

        let result = [...modifiedEntries];
        // Find entries with loc === "ALL"
        let allEntries = modifiedEntries.filter(
          (entry) => entry.location === "ALL"
        );
        allEntries.forEach((allE) => {
          // Check if the material already exists for any of the locations
          allE.locs.forEach((loc) => {
            const existingEntry = modifiedEntries.find(
              (entry) =>
                entry.location === loc &&
                entry.material === allE.material &&
                entry.company === allE.company &&
                entry.branch === allE.branch &&
                entry.unit === allE.unit &&
                entry.floor === allE.floor &&
                entry.area === allE.area
            );
            if (!existingEntry) {
              // If material doesn't exist for this location, add a new entry
              result.push({ ...allE, countquantity: 1, location: loc });
            }
          });
        });

        result = result.filter((d) => d.location !== "ALL");

        // Extracting unique components

        setCountqty(result);
        // Create an array to hold the transformed data
        let transformedData = [];

        // Iterating over the original data
        result.forEach((item) => {
          // Finding if there's already an entry for this combination of company, branch, unit, and loc
          let existingEntry = transformedData.find(
            (entry) =>
              entry.company === item.company &&
              entry.branch === item.branch &&
              entry.unit === item.unit &&
              entry.floor === item.floor &&
              entry.area === item.area &&
              entry.location === item.location
          );

          // If an entry already exists, update the quantity for the component
          if (existingEntry) {
            existingEntry[item.material] = item.countquantity.toString(); // Set quantity as a string
          } else {
            // If no entry exists, create a new entry with the component quantity
            let newEntry = {
              company: item.company,
              branch: item.branch,
              unit: item.unit,
              floor: item.floor,
              area: item.area,
              location: item.location,
            };

            // Initialize quantities for each component to empty string
            components.forEach((material) => {
              newEntry[material] = "";
            });

            // Set the quantity for the current component
            newEntry[item.material] = item.countquantity.toString(); // Set quantity as a string

            // Add the new entry to the transformed data array
            transformedData.push(newEntry);
          }
        });

        setEmployees(transformedData);
        setBankdetail(false);
        // setEmployees(singlehandtotal);
      } else if (datasToAllot.requestmode === "Material") {
        setFiltertable("Material");

        // let res_hand = await axios.get(SERVICE.ASSETDETAIL, {
        let res_hand = await axios.post(SERVICE.ASSET_DATA_FILTER_ACCESS_OLD, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          assignbranch: accessbranch,
        });

        let res_loc = await axios.get(SERVICE.LOCATIONGROUPING, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        let locationgrp = res_loc.data.locationgroupings;

        let singlehand = res_hand.data?.assetdetails;

        let statusmodefilterddata = singlehand.filter((item) =>
          valueMode.includes(item.status)
        );

        let singlehandtotal = statusmodefilterddata.reduce((acc, current) => {
          const existingItemIndex = acc.findIndex(
            (item) =>
              item.company === current.company &&
              item.branch === current.branch &&
              item.unit === current.unit &&
              item.floor === current.floor &&
              item.area === current.area &&
              item.location === current.location &&
              item.component === current.component
          );

          if (existingItemIndex !== -1) {
            // Update existing item
            const existingItem = acc[existingItemIndex];
            existingItem.countquantity += Number(current.countquantity);
            existingItem._id = current._id;
          } else {
            // Add new item
            acc.push({
              company: current.company,
              _id: current._id,
              branch: current.branch,
              unit: current.unit,
              floor: current.floor,
              area: current.area,
              location: current.location,
              material: current.material,
              component: current.component,
              countquantity: Number(current.countquantity),
            });
          }
          return acc;
        }, []);

        // Find the entry with 'ALL' location
        // Find the entry with 'ALL' location
        // const allEntry = singlehandtotal.filter(entry => entry.location === 'ALL');
        // if (allEntry.length > 0) {
        //     // Find all entries that share the same company, branch, and unit as the 'ALL' entry
        //     const matchingEntries = singlehandtotal.filter(entry =>
        //         entry.location !== 'ALL'
        //     );
        //     // Add the quantity from 'ALL' entry to matching locations
        //     matchingEntries.forEach(matchingEntry => {
        //         let matchfind = allEntry.find(d => d.comapny === matchingEntry.comapny && d.branch === matchingEntry.branch &&
        //             d.unit === matchingEntry.unit &&
        //             d.floor === matchingEntry.floor &&
        //             d.area === matchingEntry.area
        //             &&
        //             d.material === matchingEntry.material
        //         )

        //         if (matchfind) {
        //             matchingEntry.countquantity = Number(matchingEntry.countquantity) + Number(matchfind.countquantity);
        //         } else {
        //             matchingEntry.countquantity = Number(matchingEntry.countquantity)
        //         }
        //     });
        //     // Remove the 'ALL' entry from data
        //     const index = singlehandtotal.indexOf(allEntry);
        //     if (index > -1) {
        //         singlehandtotal.splice(index, 1);
        //     }
        // }

        // singlehandtotal = singlehandtotal.filter(d => d.location !== "ALL")

        const modifiedEntries = singlehandtotal.map((entry) => {
          const filteredLocs = locationgrp
            .filter(
              (loc) =>
                loc.company === entry.company &&
                loc.branch === entry.branch &&
                loc.unit === entry.unit &&
                loc.floor === entry.floor &&
                loc.area === entry.area
            )
            .flatMap((loc) => loc.location);
          if (entry.location === "ALL") {
            return { ...entry, locs: filteredLocs, countquantity: 1 };
          } else {
            return entry;
          }
        });

        let result = [...modifiedEntries];
        // Find entries with loc === "ALL"
        let allEntries = modifiedEntries.filter(
          (entry) => entry.location === "ALL"
        );
        allEntries.forEach((allE) => {
          // Check if the material already exists for any of the locations
          allE.locs.forEach((loc) => {
            const existingEntry = modifiedEntries.find(
              (entry) =>
                entry.location === loc &&
                entry.material === allE.material &&
                entry.company === allE.company &&
                entry.branch === allE.branch &&
                entry.unit === allE.unit &&
                entry.floor === allE.floor &&
                entry.area === allE.area
            );
            if (!existingEntry) {
              // If material doesn't exist for this location, add a new entry
              result.push({ ...allE, countquantity: 1, location: loc });
            }
          });
        });

        result = result.filter((d) => d.location !== "ALL");

        const alllocations = [
          ...new Set(
            result.map(
              (item) =>
                `${item.company}-${item.branch}-${item.unit}-${item.floor}-${item.area}-${item.location}`
            )
          ),
        ];
        setallLocs(alllocations);

        const gridData = {};

        // Step 3: Populate the grid data object
        result.forEach((item) => {
          const key = `${item.company}-${item.branch}-${item.unit}-${item.floor}-${item.area}-${item.location}`;
          if (!gridData[key]) {
            gridData[key] = {};
          }
          gridData[key][item.material] = item.countquantity;
        });

        const materials = [...new Set(result.map((item) => item.material))];
        // Step 5: Prepare rows
        // Step 5: Prepare rows
        const tableRows = materials.map((material) => {
          const rowData = { material };
          Object.keys(gridData).forEach((key) => {
            const quantity = gridData[key][material];
            rowData[key] = quantity !== undefined ? quantity : "";
          });
          return rowData;
        });

        setEmployees(tableRows);
        setBankdetail(false);
        // setEmployees(combinationMap);
      }
    } catch (err) {
      setBankdetail(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const handlesubmit = (e) => {
    setPageName(!pageName)
    e.preventDefault();

    if (selectedOptionsMode.length === 0) {
      setPopupContentMalert("Please Select Status!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      fetchEmployee();
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

  //  PDF
  const columns = [
    { title: "Company", field: "company" },
    { title: "Branch", field: "branch" },
    { title: "Unit", field: "unit" },
    { title: "Floor", field: "floor" },
    { title: "Area", field: "area" },
    { title: "Location", field: "location" },
  ];

  // const downloadPdf = () => {
  //     const doc = new jsPDF();

  //     const dynamicColumns = components.map(loc => ({
  //         title: loc.charAt(0).toUpperCase() + loc.slice(1), // Assuming loc is simple strings like 'humidity'
  //         field: loc,
  //         dataKey: loc
  //     }));

  //     const columnsWithSerial = [
  //         // Serial number column
  //         { title: "SNo", dataKey: "serialNumber" },
  //         ...columns.map((col) => ({ ...col, dataKey: col.field })),
  //         ...dynamicColumns
  //     ];
  //     // Add a serial number to each row
  //     const itemsWithSerial = rowDataTable.map((item, index) => {
  //         const additionalFields = components.reduce((acc, loc) => {
  //             acc[loc] = item[loc]; // Assume each `loc` is a key in `item`
  //             return acc;
  //         }, {});

  //         return {
  //             ...item,
  //             serialNumber: index + 1,
  //             ...additionalFields
  //         };
  //     });
  //     doc.autoTable({
  //         theme: "grid",
  //         styles: {
  //             fontSize: 6,
  //         },
  //         columns: columnsWithSerial,
  //         body: itemsWithSerial,
  //     });
  //     doc.save("Overall Asset Report.pdf");
  // };

  //  pdf download functionality
  const downloadPdf = (isfilter) => {
    const doc = new jsPDF({ orientation: "landscape" });

    // Initialize serial number counter
    let serialNumberCounter = 1;

    // Modify row data to include serial number based on the isfilter parameter
    const dataWithSerial =
      isfilter === "filtered"
        ? rowDataTable.map((row) => {
          const additionalFields = components.reduce((acc, loc) => {
            acc[loc] = row[loc]; // Assume each `loc` is a key in `row`
            return acc;
          }, {});
          return {
            ...row,
            serialNumber: serialNumberCounter++,
            ...additionalFields,
          };
        })
        : employees.map((row) => {
          const additionalFields = components.reduce((acc, loc) => {
            acc[loc] = row[loc]; // Assume each `loc` is a key in `row`
            return acc;
          }, {});
          return {
            ...row,
            serialNumber: serialNumberCounter++,
            ...additionalFields,
          };
        });

    // Generate PDF with autoTable
    doc.autoTable({
      theme: "grid",
      styles: { fontSize: 5 },
      columns: [
        { title: "SNo", dataKey: "serialNumber" },
        ...columns.map((col) => ({ ...col, dataKey: col.field })),
        ...components.map((loc) => ({
          title: loc.charAt(0).toUpperCase() + loc.slice(1), // Assuming loc is simple strings like 'humidity'
          field: loc,
          dataKey: loc,
        })),
      ],
      body: dataWithSerial,
    });

    doc.save("Overall Asset Report List.pdf");
  };

  //  PDF
  const columnsmat = [{ title: "Material", field: "material" }];

  // const downloadPdfMaterial = () => {
  //     const docmat = new jsPDF();

  //     const dynamicColumns = allLocs.map(loc => ({
  //         title: loc.charAt(0).toUpperCase() + loc.slice(1), // Assuming loc is simple strings like 'humidity'
  //         field: loc,
  //         dataKey: loc
  //     }));

  //     const columnsWithSerialmat = [
  //         // Serial number column
  //         { title: "SNo", dataKey: "serialNumber" },
  //         ...columnsmat.map((col) => ({ ...col, dataKey: col.field })),
  //         ...dynamicColumns
  //     ];
  //     // Add a serial number to each row
  //     const itemsWithSerialmat = rowDataTable.map((item, index) => {
  //         const additionalFields = allLocs.reduce((acc, loc) => {
  //             acc[loc] = item[loc]; // Assume each `loc` is a key in `item`
  //             return acc;
  //         }, {});

  //         return {
  //             ...item,
  //             serialNumber: index + 1,
  //             ...additionalFields
  //         };
  //     });
  //     docmat.autoTable({
  //         theme: "grid",
  //         styles: {
  //             fontSize: 6,
  //         },
  //         columns: columnsWithSerialmat,
  //         body: itemsWithSerialmat,
  //     });
  //     docmat.save("Overall Asset Report.pdf");
  // };

  const downloadPdfMaterial = (isfilter) => {
    const docmat = new jsPDF({ orientation: "landscape" });

    // Initialize serial number counter
    let serialNumberCounter = 1;

    // Modify row data to include serial number
    const dataWithSerial =
      isfilter === "filtered"
        ? rowDataTable.map((row) => {
          const additionalFields = allLocs.reduce((acc, loc) => {
            acc[loc] = row[loc]; // Assume each `loc` is a key in `row`
            return acc;
          }, {});
          return {
            ...row,
            serialNumber: serialNumberCounter++,
            ...additionalFields,
          };
        })
        : employees.map((row) => {
          const additionalFields = allLocs.reduce((acc, loc) => {
            acc[loc] = row[loc]; // Assume each `loc` is a key in `row`
            return acc;
          }, {});
          return {
            ...row,
            serialNumber: serialNumberCounter++,
            ...additionalFields,
          };
        });
    let allcolumns = [
      { title: "SNo", dataKey: "serialNumber" },
      ...columnsmat.map((col) => ({ ...col, dataKey: col.field })),
      ...allLocs.map((loc) => ({
        title: loc.charAt(0).toUpperCase() + loc.slice(1), // Assuming loc is simple strings like 'humidity'
        field: loc,
        dataKey: loc,
      })),
    ];

    const maxColumnsPerPage = 10; // Maximum number of columns per page
    const totalPages = Math.ceil(columns.length / maxColumnsPerPage); // Calculate total pages needed

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
      const startIdx = (currentPage - 1) * maxColumnsPerPage;
      const endIdx = Math.min(startIdx + maxColumnsPerPage, columns.length);

      const currentPageColumns = allcolumns.slice(startIdx, endIdx);

      docmat.autoTable({
        theme: "grid",
        styles: { fontSize: 5 },
        columns: currentPageColumns,
        body: dataWithSerial,
      });
      if (currentPage < totalPages) {
        docmat.addPage(); // Add a new page if there are more columns to display
      }
    }
    docmat.save("Overall Asset Report.pdf");
  };

  // Excel
  const fileName = "Overall Asset Report";
  // get particular columns for export excel

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Overall Asset Report",
    pageStyle: "print",
  });

  //print...
  const componentRefMat = useRef();
  const handleprintMat = useReactToPrint({
    content: () => componentRefMat.current,
    documentTitle: "Overall Asset Report",
    pageStyle: "print",
  });

  //table entries ..,.
  const [items, setItems] = useState([]);

  const addSerialNumber = (datas) => {
    const itemsWithSerialNumber = datas?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
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

  const [assetDetails, setAssetDetails] = useState([]);
  const fetchAssetDetails = async () => {
    try {
      let res = await axios.get(SERVICE.ASSETDETAIL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let sub = res.data.assetdetails?.filter(
        (item) => item?.workcheck === false
      );
      setAssetDetails(res.data.assetdetails);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [datasToAllot, setDatasToAllot] = useState({
    company: "",
    branch: "",
    unit: "",
    floor: "",
    area: "",
    location: "",
    subsubcabinname: "",
    component: "",
    newArray: "",
    requestmode: "Location",
  });

  let components = Array.from(new Set(countqty.map((item) => item.material)));
  // Show All Columns & Manage Columns

  const initialColumnVisibility = Object.assign({
    serialNumber: true,
    checkbox: true,
    company: true,
    branch: true,
    unit: true,
    floor: true,
    area: true,
    location: true,
    component: true,
    material: true,
    code: true,
    countquantity: true,
    ...components.reduce((acc, component) => {
      acc[component] = true;
      return acc;
    }, {}),
    ...allLocs.reduce((acc, mat) => {
      acc[mat] = true;
      return acc;
    }, {}),
    actions: true,
  });
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  const columnDatatable = [
    // {
    //   field: "checkbox",
    //   headerName: "Checkbox", // Default header name
    //   headerStyle: {
    //     fontWeight: "bold", // Apply the font-weight style to make the header text bold
    //     // Add any other CSS styles as needed
    //   },
    //   headerComponent: (params) => (
    //     <CheckboxHeader
    //       selectAllChecked={selectAllChecked}
    //       onSelectAll={() => {
    //         if (rowDataTable.length === 0) {
    //           // Do not allow checking when there are no rows
    //           return;
    //         }
    //         if (selectAllChecked) {
    //           setSelectedRows([]);
    //         } else {
    //           const allRowIds = rowDataTable.map((row) => row.id);
    //           setSelectedRows(allRowIds);
    //         }
    //         setSelectAllChecked(!selectAllChecked);
    //       }}
    //     />
    //   ),

    //   cellRenderer: (params) => (
    //     <Checkbox
    //       checked={selectedRows.includes(params.data.id)}
    //       onChange={() => {
    //         let updatedSelectedRows;
    //         if (selectedRows.includes(params.data.id)) {
    //           updatedSelectedRows = selectedRows.filter(
    //             (selectedId) => selectedId !== params.row.id
    //           );
    //         } else {
    //           updatedSelectedRows = [...selectedRows, params.data.id];
    //         }

    //         setSelectedRows(updatedSelectedRows);

    //         // Update the "Select All" checkbox based on whether all rows are selected
    //         setSelectAllChecked(
    //           updatedSelectedRows.length === filteredData.length
    //         );
    //       }}
    //     />
    //   ),
    //   sortable: false, // Optionally, you can make this column not sortable
    //   width: 75,

    //   hide: !columnVisibility.checkbox,
    //   headerClassName: "bold-header",
    // },
    {
      field: "checkbox",
      headerName: "", // Default header name
      headerStyle: {
        fontWeight: "bold",
      },
      sortable: false,
      width: 90,
      filter: false,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
      pinned: "left",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 75,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    // { field: "empcode", headerName: "Emp Code", flex: 0, width: 150, hide: !columnVisibility.empcode, headerClassName: "bold-header" },
    // { field: "companyname", headerName: "Name", flex: 0, width: 200, hide: !columnVisibility.companyname, headerClassName: "bold-header" },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 150,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
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

    ...components.map((material) => ({
      field: material,
      headerName: material, // Example header name, you can customize it
      flex: 0,
      width: 150,
      cellRenderer: (params) => {
        // Use params.row[component] to access the value of the component for the current row
        return (
          // Example rendering, customize as needed
          <div>{params.data[material]}</div>
        );
      },
    })),

    // {
    //     field: "actions",
    //     headerName: "Action",
    //     flex: 0,
    //     width: 150,
    //     minHeight: "40px !important",
    //     sortable: false,
    //     hide: !columnVisibility.actions,
    //     headerClassName: "bold-header",
    //     renderCell: (params) => (
    //         <Grid sx={{ display: "flex" }}>
    //             {isUserRoleCompare?.includes("voverallassetreport") && (
    //                 <Button
    //                     sx={userStyle.buttonedit}
    //                     onClick={() => {
    //                         getviewCode(
    //                             params.row.company,
    //                             params.row.branch,
    //                             params.row.unit,
    //                             params.row.floor,
    //                             params.row.area,
    //                             params.row.location,
    //                             params.row.components,
    //                             params.row.code,
    //                             params.row.id
    //                         );
    //                     }}
    //                 >
    //                     <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
    //                 </Button>
    //             )}
    //         </Grid>
    //     ),
    // },
  ];

  const columnDatatableStock = [
    {
      field: "checkbox",
      headerName: "Checkbox", // Default header name
      headerStyle: {
        fontWeight: "bold", // Apply the font-weight style to make the header text bold
        // Add any other CSS styles as needed
      },
      headerComponent: (params) => (
        <CheckboxHeader
          selectAllChecked={selectAllChecked}
          onSelectAll={() => {
            if (rowDataTable.length === 0) {
              // Do not allow checking when there are no rows
              return;
            }
            if (selectAllChecked) {
              setSelectedRows([]);
            } else {
              const allRowIds = rowDataTable.map((row) => row.id);
              setSelectedRows(allRowIds);
            }
            setSelectAllChecked(!selectAllChecked);
          }}
        />
      ),

      cellRenderer: (params) => (
        <Checkbox
          checked={selectedRows.includes(params.data.id)}
          onChange={() => {
            let updatedSelectedRows;
            if (selectedRows.includes(params.data.id)) {
              updatedSelectedRows = selectedRows.filter(
                (selectedId) => selectedId !== params.data.id
              );
            } else {
              updatedSelectedRows = [...selectedRows, params.data.id];
            }

            setSelectedRows(updatedSelectedRows);

            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllChecked(
              updatedSelectedRows.length === filteredData.length
            );
          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 75,

      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 85,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "material",
      headerName: "Material",
      flex: 0,
      width: 200,
      hide: !columnVisibility.material,
      headerClassName: "bold-header",
    },

    ...allLocs.map((mat) => ({
      field: mat,
      headerName: mat, // Example header name, you can customize it
      flex: 0,
      width: 400,
      cellRenderer: (params) => {
        // Use params.row[component] to access the value of the component for the current row
        return (
          // Example rendering, customize as needed
          <div>{params.data[mat]}</div>
        );
      },
    })),
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      ...item,
      id: index,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      floor: item.floor,
      area: item.area,
      location: item.location,
      countquantity: item.countquantity,
      material: item.material,
      component: item.component,
      components: components,
      code: item.code,
      // days: filteredData.map((dayvalue, index) => {

      // })
    };
  });

  let columnDataTable =
    filtertable === "Material" ? columnDatatableStock : columnDatatable;

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
              onClick={() =>
                setColumnVisibility({
                  ...initialColumnVisibility,
                  ...allComponents,
                })
              }
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

  const requestModeOptions = [
    { label: "Location", value: "Location" },
    { label: "Material", value: "Material" },
  ];

  const handleclear = (e) => {
    e.preventDefault();
    setDatasToAllot({ requestmode: "Location" });
    setSelectedOptionsMode([]);
    setEmployees([]);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const [isFilterOpenmat, setIsFilterOpenmat] = useState(false);
  const [isPdfFilterOpenmat, setIsPdfFilterOpenmat] = useState(false);

  // page refersh reload
  const handleCloseFilterModmat = () => {
    setIsFilterOpenmat(false);
  };

  const handleClosePdfFilterModmat = () => {
    setIsPdfFilterOpenmat(false);
  };

  const [fileFormat, setFormat] = useState("");
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = fileFormat === "xl" ? ".xlsx" : ".csv";
  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const handleExportXL = (isfilter) => {
    if (isfilter === "filtered") {
      exportToCSV(
        rowDataTable?.map((item, index) => ({
          Sno: index + 1,
          Company: item.company,
          Branch: item.branch,
          Unit: item.unit,
          Floor: item.floor,
          Area: item.area,
          Location: item.location,
          ...components.reduce((acc, loc) => {
            acc[loc] = item[loc]; // Assume each `loc` is a key in `item`
            return acc;
          }, {}),
        })),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        employees.map((item, index) => ({
          Sno: index + 1,
          Company: item.company,
          Branch: item.branch,
          Unit: item.unit,
          Floor: item.floor,
          Area: item.area,
          Location: item.location,
          ...components.reduce((acc, loc) => {
            acc[loc] = item[loc]; // Assume each `loc` is a key in `item`
            return acc;
          }, {}),
        })),
        fileName
      );
    }

    setIsFilterOpen(false);
  };

  const handleExportXLMat = (isfilter) => {
    if (isfilter === "filtered") {
      exportToCSV(
        rowDataTable?.map((item, index) => ({
          Sno: index + 1,
          Material: item.material,
          ...allLocs.reduce((acc, loc) => {
            acc[loc] = item[loc]; // Assume each `loc` is a key in `item`
            return acc;
          }, {}),
        })),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        employees.map((item, index) => ({
          Sno: index + 1,
          Material: item.material,
          ...allLocs.reduce((acc, loc) => {
            acc[loc] = item[loc]; // Assume each `loc` is a key in `item`
            return acc;
          }, {}),
        })),
        fileName
      );
    }

    setIsFilterOpenmat(false);
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

  return (
    <Box>
      {/* ****** Header Content ****** */}
      <Headtitle title={"Overall Asset Report"} />
      {/* <Typography sx={userStyle.HeaderText}>Overall Asset Report</Typography> */}
      <PageHeading
        title="Overall Asset Report"
        modulename="Asset"
        submodulename="Stock"
        mainpagename="Overall Asset Report"
        subpagename=""
        subsubpagename=""
      />
      <br />

      {isUserRoleCompare?.includes("aoverallassetreport") && (
        <>
          <Box sx={userStyle.selectcontainer}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Overall Asset Report
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Asset</Typography>
                    <Selects
                      options={requestModeOptions}
                      styles={colourStyles}
                      value={{
                        label: datasToAllot.requestmode,
                        value: datasToAllot.requestmode,
                      }}
                      onChange={(e) => {
                        setDatasToAllot({
                          ...datasToAllot,
                          requestmode: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth>
                    <Typography>
                      Status<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      maxMenuHeight={250}
                      options={PmodeOpt}
                      value={selectedOptionsMode}
                      onChange={(e) => {
                        handleModeChange(e);
                      }}
                      valueRenderer={customValueRendererMode}
                      labelledBy="Please Select Status"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={1} xs={12} sm={6} marginTop={3}>
                  <Button
                    variant="contained"
                    sx={buttonStyles.buttonsubmit}
                    onClick={handlesubmit}
                  >
                    Filter
                  </Button>
                </Grid>
                <Grid item md={1} xs={12} sm={6} marginTop={3}>
                  <Button sx={buttonStyles.btncancel} onClick={handleclear}>
                    Clear
                  </Button>
                </Grid>
              </Grid>
              <br />
              <Grid container>
                {/* <Grid item md={3} xs={12} sm={6}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handlesubmit}
                  >
                    Filter
                  </Button>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <Button sx={userStyle.btncancel} onClick={handleclear}>
                    Clear
                  </Button>
                </Grid> */}
              </Grid>
            </>
          </Box>
        </>
      )}
      <br />

      {isUserRoleCompare?.includes("loverallassetreport") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Overall Asset Report List
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
                  {filtertable === "Location" ? (
                    <>
                      {isUserRoleCompare?.includes(
                        "exceloverallassetreport"
                      ) && (
                          <>
                            <Button
                              onClick={(e) => {
                                setIsFilterOpen(true);
                                // fetchEmployee();
                                setFormat("xl");
                              }}
                              sx={userStyle.buttongrp}
                            >
                              <FaFileExcel />
                              &ensp;Export to Excel&ensp;
                            </Button>
                          </>
                        )}
                      {isUserRoleCompare?.includes("csvoverallassetreport") && (
                        <>
                          <Button
                            onClick={(e) => {
                              setIsFilterOpen(true);
                              // fetchEmployee();
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
                        "printoverallassetreport"
                      ) && (
                          <>
                            <Button
                              sx={userStyle.buttongrp}
                              onClick={handleprint}
                            >
                              &ensp;
                              <FaPrint />
                              &ensp;Print&ensp;
                            </Button>
                          </>
                        )}
                      {isUserRoleCompare?.includes("pdfoverallassetreport") && (
                        <>
                          <Button
                            sx={userStyle.buttongrp}
                            onClick={() => {
                              setIsPdfFilterOpen(true);
                              // fetchEmployee();
                            }}
                          >
                            <FaFilePdf />
                            &ensp;Export to PDF&ensp;
                          </Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes(
                        "imageoverallassetreport"
                      ) && (
                          <Button
                            sx={userStyle.buttongrp}
                            onClick={handleCaptureImage}
                          >
                            {" "}
                            <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                            &ensp;Image&ensp;{" "}
                          </Button>
                        )}
                    </>
                  ) : (
                    <>
                      {isUserRoleCompare?.includes(
                        "exceloverallassetreport"
                      ) && (
                          <>
                            <Button
                              onClick={(e) => {
                                setIsFilterOpenmat(true);
                                // fetchEmployee();
                                setFormat("xl");
                              }}
                              sx={userStyle.buttongrp}
                            >
                              <FaFileExcel />
                              &ensp;Export to Excel&ensp;
                            </Button>
                          </>
                        )}
                      {isUserRoleCompare?.includes("csvoverallassetreport") && (
                        <>
                          <Button
                            onClick={(e) => {
                              setIsFilterOpenmat(true);
                              // fetchEmployee();
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
                        "printoverallassetreport"
                      ) && (
                          <>
                            <Button
                              sx={userStyle.buttongrp}
                              onClick={handleprintMat}
                            >
                              &ensp;
                              <FaPrint />
                              &ensp;Print&ensp;
                            </Button>
                          </>
                        )}
                      {isUserRoleCompare?.includes("pdfoverallassetreport") && (
                        <>
                          <Button
                            sx={userStyle.buttongrp}
                            onClick={() => {
                              setIsPdfFilterOpenmat(true);
                              // fetchEmployee();
                            }}
                          >
                            <FaFilePdf />
                            &ensp;Export to PDF&ensp;
                          </Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes(
                        "imageoverallassetreport"
                      ) && (
                          <Button
                            sx={userStyle.buttongrp}
                            onClick={handleCaptureImage}
                          >
                            {" "}
                            <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                            &ensp;Image&ensp;{" "}
                          </Button>
                        )}
                    </>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={6} sm={6}>
                <Box>
                  {/* <FormControl fullWidth size="small">
                    <Typography>Search</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                  </FormControl> */}

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
                    totalDatas={employees}
                  />
                </Box>
              </Grid>
            </Grid>
            <br />
            <Button
              sx={userStyle.buttongrp}
              onClick={() =>
                setColumnVisibility({
                  ...initialColumnVisibility,
                  ...allComponents,
                })
              }
            >
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


                <Box style={{ width: "100%", overflowY: "hidden" }}>
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
                      // totalDatas={totalDatas}
                      searchQuery={searchedString}
                      handleShowAllColumns={handleShowAllColumns}
                      setFilteredRowData={setFilteredRowData}
                      filteredRowData={filteredRowData}
                      setFilteredChanges={setFilteredChanges}
                      filteredChanges={filteredChanges}
                      gridRefTableImg={gridRefTableImg}
                      itemsList={employees}
                    />
                  </>
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

      {/* Delete Modal */}

      {/* <Box>
                <Dialog
                    open={isDeleteOpencheckbox}
                    onClose={handleCloseModcheckbox}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent
                        sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                    >
                        <QuestionMarkIcon sx={{ fontSize: "80px", color: "orange" }} />
                        <Typography
                            variant="h5"
                            sx={{ color: "black", textAlign: "center" }}
                        >
                            Do You Want to Allot {datasToAllot?.component} to{" "}
                            {datasToAllot?.subsubcabinname} ?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleCloseModcheckbox}
                            variant="contained"
                            color="error"
                        >
                            No
                        </Button>
                        <Button
                            autoFocus
                            variant="contained"
                            color="success"
                            onClick={(e) => createAssetGrouping()}
                        >
                            {" "}
                            Yes{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box> */}
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

      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        fullWidth={true}
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Location Overall Asset Report
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Company</Typography>
                  <Typography>
                    {maintentancemastereditmaterial.company}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Branch</Typography>
                  <Typography>
                    {maintentancemastereditmaterial.branch}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Unit</Typography>
                  <Typography>{maintentancemastereditmaterial.unit}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Floor</Typography>
                  <Typography>
                    {maintentancemastereditmaterial.floor}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Area</Typography>
                  <Typography>{maintentancemastereditmaterial.area}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Location</Typography>
                  <Typography>
                    {maintentancemastereditmaterial.location}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                <TableContainer component={Paper}>
                  <Table
                    sx={{ minWidth: 700 }}
                    aria-label="customized table"
                    id="usertable"
                  >
                    <TableHead sx={{ fontWeight: "600" }}>
                      <StyledTableRow>
                        <StyledTableCell>{"Material"}</StyledTableCell>
                        <StyledTableCell>{"Material Code"}</StyledTableCell>
                      </StyledTableRow>
                    </TableHead>
                    <TableBody align="left">
                      {maintentancemastereditmaterial &&
                        Object.keys(maintentancemastereditmaterial)
                          .filter(
                            (key) =>
                              key !== "company" &&
                              key !== "branch" &&
                              key !== "unit" &&
                              key !== "floor" &&
                              key !== "area" &&
                              key !== "location" &&
                              maintentancemastereditmaterial[key] !== "" &&
                              key !== "id" &&
                              key !== "countquantity" &&
                              key !== "material" &&
                              key !== "components" &&
                              key !== "component" &&
                              key !== "code" &&
                              key !== "serialNumber"
                          )
                          .map((key) => (
                            <StyledTableRow key={key}>
                              <StyledTableCell>{key}</StyledTableCell>
                              <StyledTableCell>
                                {
                                  assetlimited.find((d) => d.material === key)
                                    ?.code
                                }
                              </StyledTableCell>
                            </StyledTableRow>
                          ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCloseview}
              >
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
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
              <StyledTableCell>Material</StyledTableCell>
              <StyledTableCell>Company</StyledTableCell>
              <StyledTableCell>Branch</StyledTableCell>
              <StyledTableCell>Unit</StyledTableCell>
              <StyledTableCell>Floor</StyledTableCell>
              <StyledTableCell>Area</StyledTableCell>
              <StyledTableCell>Location</StyledTableCell>
              {components.map((component, index) => (
                <StyledTableCell key={index}>
                  {component.charAt(0).toUpperCase() + component.slice(1)}
                </StyledTableCell>
              ))}
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {rowDataTable &&
              rowDataTable.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell> {row.material}</StyledTableCell>
                  <StyledTableCell> {row.company}</StyledTableCell>
                  <StyledTableCell> {row.branch}</StyledTableCell>
                  <StyledTableCell> {row.unit}</StyledTableCell>
                  <StyledTableCell> {row.floor}</StyledTableCell>
                  <StyledTableCell> {row.area}</StyledTableCell>
                  <StyledTableCell> {row.location}</StyledTableCell>
                  {components.map((component) => (
                    <StyledTableCell key={component}>
                      {row[component]}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table aria-label="simple table" id="branch" ref={componentRefMat}>
          <TableHead sx={{ fontWeight: "600" }}>
            <StyledTableRow>
              <StyledTableCell>SI.NO</StyledTableCell>
              <StyledTableCell>Material</StyledTableCell>
              {allLocs.map((component, index) => (
                <StyledTableCell key={index}>
                  {component.charAt(0).toUpperCase() + component.slice(1)}
                </StyledTableCell>
              ))}
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {rowDataTable &&
              rowDataTable.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell> {row.material}</StyledTableCell>
                  {allLocs.map((component) => (
                    <StyledTableCell key={component}>
                      {row[component]}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

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
            onClick={(e) => {
              handleExportXL("filtered");
            }}
          >
            Export Filtered Data
          </Button>
          <Button
            autoFocus
            variant="contained"
            onClick={(e) => {
              handleExportXL("overall");
              // fetchEmployee();
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
              setIsPdfFilterOpen(false);
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>

      {/* //material */}

      <Dialog
        open={isFilterOpenmat}
        onClose={handleCloseFilterModmat}
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
            onClick={handleCloseFilterModmat}
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
            onClick={(e) => {
              handleExportXLMat("filtered");
            }}
          >
            Export Filtered Data
          </Button>
          <Button
            autoFocus
            variant="contained"
            onClick={(e) => {
              handleExportXLMat("overall");
              fetchEmployee();
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
      {/*Export pdf Data  */}
      <Dialog
        open={isPdfFilterOpenmat}
        onClose={handleClosePdfFilterModmat}
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
            onClick={handleClosePdfFilterModmat}
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
              downloadPdfMaterial("filtered");
              setIsPdfFilterOpenmat(false);
            }}
          >
            Export Filtered Data
          </Button>
          <Button
            variant="contained"
            onClick={(e) => {
              downloadPdfMaterial("overall");
              setIsPdfFilterOpenmat(false);
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>

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

export default OverallAssetReport;
