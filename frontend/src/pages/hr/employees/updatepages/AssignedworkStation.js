import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ImageIcon from "@mui/icons-material/Image";
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
  Popover,
  Select,
  Table,
  TableBody,
  TableHead,
  TextareaAutosize,
  TextField,
  Typography,
  Chip,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../../../components/Errorhandling";
import Headtitle from "../../../../components/Headtitle";
import { StyledTableCell, StyledTableRow } from "../../../../components/Table";
import {
  AuthContext,
  UserRoleAccessContext,
} from "../../../../context/Appcontext";
import { userStyle } from "../../../../pageStyle";
import { SERVICE } from "../../../../services/Baseservice";

import * as FileSaver from "file-saver";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaFileCsv, FaFileExcel } from "react-icons/fa";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import * as XLSX from "xlsx";
import AggregatedSearchBar from "../../../../components/AggregatedSearchBar";
import AggridTable from "../../../../components/AggridTable";
import AlertDialog from "../../../../components/Alert";
import ExportData from "../../../../components/ExportData";
import MessageAlert from "../../../../components/MessageAlert";
import domtoimage from "dom-to-image";

function AssignedWorkStation({
  change,
  filtercompany,
  filterbranch,
  filterunit,
  filterteam,
  filteremp,
  clearState,
}) {
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);

  const [overallItems, setOverallItems] = useState([]);

  const [workstationTodoList, setWorkstationTodoList] = useState([]);

  const deleteTodo = (todo) => {

    if (todo?.type === "Primary") {
      setPrimaryWorkStation("Select Primary Workstation");
      setPrimaryWorkStationLabel("Select Primary Workstation");
      setPrimaryKeyShortname("");
      setKeyShortname("");
      setWorkstationTodoList([]);
      setSelectedOptionsWorkStation([]);
    } else {
      setWorkstationTodoList((prev) => prev.filter((item) => item?.shortname !== todo?.shortname));
      setSelectedOptionsWorkStation((prev) => prev.filter((item) => item?.value !== todo?.workstation));
      setValueWorkStation((prev) => prev.filter((item) => item !== todo?.workstation));
      setKeyShortname((prev) => (
        prev
          ?.split(",")
          .filter((item) => item.trim() !== todo?.shortname)
          .join(",")
      ));
    }
  };

  let exportColumnNames = [
    "Company",
    "Branch",
    "Unit",
    "Work Mode",
    "Emp Code",
    "Name",
    "Primary Work Station",
    "Secondary Work Station",
    "System Short Name",
    "Remote System Name",
    "Remote System Short Name",
  ];
  let exportRowValues = [
    "company",
    "branch",
    "unit",
    "workmode",
    "empcode",
    "companyname",
    "primaryworkstation",
    "secondaryworkstation",
    "systemshortname",
    "remotesystemname",
    "remotesystemshortname",
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
  const [keyShortname, setKeyShortname] = useState("");

  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    isUserRoleAccess,
    isUserRoleCompare,
    allTeam,
    isAssignBranch,
    pageName,
    setPageName,
    buttonStyles,
    workStationSystemName,
  } = useContext(UserRoleAccessContext);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { auth } = useContext(AuthContext);
  const [allWorkStationOpt, setAllWorkStationOpt] = useState([]);
  const [primaryWorkStation, setPrimaryWorkStation] = useState(
    "Select Primary Workstation"
  );
  const [primaryWorkStationLabel, setPrimaryWorkStationLabel] = useState(
    "Select Primary Workstation"
  );
  const [enableWorkstation, setEnableWorkstation] = useState(false);

  const [empaddform, setEmpaddform] = useState({
    company: "",
    branch: "",
    unit: "",
    floor: "",
    workstation: "Please Select Work Station",
  });
  useEffect(() => {
    fetchWorkStation();
  }, [primaryWorkStation]);
  useEffect(() => {
    setEmployees([]);
  }, [clearState]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [workStationOpt, setWorkStationOpt] = useState([]);
  const [filteredWorkStation, setFilteredWorkStation] = useState([]);
  const [selectedOptionsWorkStation, setSelectedOptionsWorkStation] = useState(
    []
  );
  let [valueWorkStation, setValueWorkStation] = useState("");
  const [isBankdetail, setBankdetail] = useState(false);

  // Copied fields Name
  const handleCopy = (message) => {
    NotificationManager.success(`${message} 👍`, "", 2000);
  };

  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");

  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage
        .toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Assigned Employee Work Station.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
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

      // The processedResult array now contains all the mapped `shortname` values

      setAllWorkStationOpt(
        [
          ...processedResult.map((t) => ({
            label: t,
            value: t.replace(/\([^)]*\)$/, ""),
          })),
        ].filter((data) => data.value !== primaryWorkStation)
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

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
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
    bankname: true,
    bankbranchname: true,
    accountholdername: true,
    accountnumber: true,
    ifsccode: true,
    systemshortname: true,
    company: true,
    branch: true,
    unit: true,
    primaryworkstation: true,
    secondaryworkstation: true,
    actions: true,
    remotesystemname: true,
    workmode: true,
    remotesystemshortname: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  const [maxSelections, setMaxSelections] = useState(0);

  const getCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setEmpaddform(res?.data?.suser);
      setPrimaryWorkStation(res?.data?.suser?.workstation[0]);

      const assignPrimarySecondaryWorkstations = (data) => {
        return data.map((emp) => {
          const workstations = (emp.workstation || []).map((ws) =>
            ws ? ws.trim() : ""
          );

          const [primary, ...secondary] = workstations;

          const extractBranchAndFloor = (workstation) => {
            const branchAndFloor = (workstation || "").match(
              /\(([^)]+)\)/
            )?.[1];
            if (branchAndFloor) {
              const hyphenCount = branchAndFloor.split("-").length - 1;
              const Branch =
                hyphenCount === 1
                  ? branchAndFloor.split("-")[0].trim()
                  : branchAndFloor.split("-").slice(0, 2).join("-");
              const Floor =
                hyphenCount === 1
                  ? branchAndFloor.split("-")[1].trim()
                  : hyphenCount === 2
                    ? branchAndFloor.split("-").pop()
                    : branchAndFloor
                      .split("-")
                      .slice(-2)
                      .join("-")
                      .replace(")", "");
              return { Branch, Floor };
            }
            return {};
          };

          const findSystemShortName = (workstation) => {
            const { Branch, Floor } = extractBranchAndFloor(workstation);
            const match = workStationSystemName?.find(
              (sht) =>
                sht?.branch === Branch &&
                sht?.floor === Floor &&
                sht?.cabinname === workstation.split("(")[0].trim()
            );
            return match ? match.systemshortname : "";
          };

          const primarySystemShortName = findSystemShortName(primary);
          const secondarySystemShortNames = secondary
            .map(findSystemShortName)
            .filter((name) => name);

          const secondaryworkstationvalue = secondary.join(", ");

          return {
            ...emp,
            primaryworkstation:
              primary === "Please Select Primary Work Station"
                ? ""
                : primary || "", // Set the first workstation as primary
            secondaryworkstation: secondaryworkstationvalue || "",
            systemshortname: [
              primarySystemShortName,
              ...secondarySystemShortNames,
            ].join(", "), // Combine all short names
          };
        });
      };

      const updatedData = assignPrimarySecondaryWorkstations([
        res?.data?.suser,
      ]);

      const systemShortNamesArray = updatedData[0]?.systemshortname.split(", ");

      const [primary, ...secondary] = systemShortNamesArray;

      setPrimaryKeyShortname(primary === "" ? "" : `${primary},`);
      setKeyShortname(secondary?.toString());

      const employeeCount =
        Number(res?.data?.suser?.employeecount ?? 0) +
        Number(res?.data?.suser?.wfhcount ?? 0);
      setMaxSelections(employeeCount);
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
      let primaryWorkstationNew = res?.data?.suser?.workstation[0];
      let findLabel = workstationsFinal?.find((item) =>
        item.label.includes(primaryWorkstationNew)
      );
      setFilteredWorkStation(workstationsFinal);
      setPrimaryWorkStationLabel(findLabel?.label);

      const matches = findLabel.label.match(/^(.*?)\((.*?)\)\((.*?)\)$/);
      setWorkstationTodoList((prev) => [{
        workstation: matches?.[1]?.trim() + '(' + matches?.[2]?.trim() + ')',  // G-HRA(TTS-TRICHY-Ground Floor)
        shortname: matches?.[3],
        type: "Primary"
      }])
      handleClickOpenEdit();

      let secondaryWorkstation = Array.isArray(res?.data?.suser?.workstation)
        ? res?.data?.suser?.workstation
          ?.filter((item) => item !== res?.data?.suser?.workstation[0])
          .map((x) => ({
            ...x,
            label: x,
            value: x,
          }))
        : [];
      let foundDataNew = secondaryWorkstation?.map((item) => {
        let getData = allWorkStationOpt?.find(
          (data) => data.value === item.value
        );
        return {
          ...item,
          label: getData?.label,
        };
      });

      setSelectedOptionsWorkStation(foundDataNew);
      const resultNew = foundDataNew.map(item => {
        const matches = item.label.match(/^(.*?)\((.*?)\)\((.*?)\)$/);
        return {
          workstation: matches?.[1]?.trim() + '(' + matches?.[2]?.trim() + ')',  // G-HRA(TTS-TRICHY-Ground Floor)
          shortname: matches?.[3],
          type: "Secondary"                                               // TT_1_U4_G-HRA
        };
      });
      setWorkstationTodoList((prev) => {
        const primaryItem = prev?.find(item => item?.type === "Primary");
        return primaryItem ? [primaryItem, ...resultNew] : [...resultNew];
      });

      setValueWorkStation(
        res?.data?.suser?.workstation?.filter(
          (item) => item !== res?.data?.suser?.workstation[0]
        )
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

  const handleEmployeesChange = (options) => {
    if (maxSelections > 0 && options.length > maxSelections - 1) {
      options = options.slice(0, maxSelections - 1); // Limit selections to max allowed
    }

    const selectedCabs =
      options?.map((option) => option?.value?.split("(")[0]) || [];

    const extractBranchAndFloor = (workstation) => {
      const selectedCabs = workstation?.split("(")[0];
      const branchAndFloor = (workstation || "").match(/\(([^)]+)\)/)?.[1];
      if (branchAndFloor) {
        const hyphenCount = branchAndFloor.split("-").length - 1;
        const Branch =
          hyphenCount === 1
            ? branchAndFloor.split("-")[0].trim()
            : branchAndFloor.split("-").slice(0, 2).join("-");
        const Floor =
          hyphenCount === 1
            ? branchAndFloor.split("-")[1].trim()
            : hyphenCount === 2
              ? branchAndFloor.split("-").pop()
              : branchAndFloor.split("-").slice(-2).join("-").replace(")", "");
        return { selectedCabs, Branch, Floor };
      }
      return {};
    };

    // Clear and update shortnames
    setKeyShortname((prevKeyShortname) => {
      const prevShortnamesArray = prevKeyShortname
        ? prevKeyShortname.split(", ")
        : [];

      const newShortnames = options
        ?.map((item) => {
          const { selectedCabs, Branch, Floor } = extractBranchAndFloor(
            item?.value
          );

          return workStationSystemName
            ?.filter(
              (workItem) =>
                workItem.branch === Branch &&
                (Floor === "" || Floor === workItem?.floor) &&
                selectedCabs === workItem?.cabinname
            )
            ?.map((workItem) => workItem?.systemshortname);
        })
        .flat();

      // Remove shortnames that are no longer selected
      const updatedShortnames = prevShortnamesArray.filter(
        (shortname) =>
          newShortnames.includes(shortname) ||
          selectedCabs.includes(
            workStationSystemName?.find(
              (workItem) => workItem?.systemshortname === shortname
            )?.cabinname
          )
      );

      // Merge shortnames without duplicates
      const mergedShortnames = Array.from(
        new Set([...updatedShortnames, ...newShortnames])
      );

      return mergedShortnames.join(", ");
    });

    const result = options.map(item => {
      const matches = item.label.match(/^(.*?)\((.*?)\)\((.*?)\)$/);
      return {
        workstation: matches?.[1]?.trim() + '(' + matches?.[2]?.trim() + ')',  // G-HRA(TTS-TRICHY-Ground Floor)
        shortname: matches?.[3],
        type: "Secondary"                                               // TT_1_U4_G-HRA
      };
    });
    setWorkstationTodoList((prev) => {
      const primaryItem = prev?.find(item => item?.type === "Primary");
      return primaryItem ? [primaryItem, ...result] : [...result];
    });

    // Update the state with selected and filtered options
    setValueWorkStation(options.map((a) => a.value)); // Map selected values
    setSelectedOptionsWorkStation(options); // Set selected options
    // setFilteredWorkStation(updatedOptions);  // Update filtered options based on selections
  };

  // const customValueRendererEmployees = (
  //   valueWorkStation,
  //   _filteredWorkStation
  // ) => {
  //   return valueWorkStation.length ? (
  //     valueWorkStation.map(({ label }) => label).join(", ")
  //   ) : (
  //     <span style={{ color: "hsl(0, 0%, 20%)" }}>
  //       Select Secondary Work Station
  //     </span>
  //   );
  // };

  const customValueRendererEmployees = (
    valueWorkStation,
    _filteredWorkStation
  ) => {
    return valueWorkStation.length ? (
      valueWorkStation
        .map(({ label }) => {
          // Match both sets of parentheses in the label
          const regex = /\([^\)]*\)/g; // Match any set of parentheses
          const parts = [];
          let match;
          let lastIndex = 0;
          let setCount = 0; // Counter to track the sets of parentheses

          // Extract the label parts using regex
          while ((match = regex.exec(label)) !== null) {
            if (match.index > lastIndex) {
              parts.push(label.slice(lastIndex, match.index)); // Text before the parentheses
            }

            // Increment the set counter
            setCount++;

            // Highlight the second set in red, and leave the first set normal
            if (setCount === 2) {
              // This is the second set, so highlight it in red
              parts.push(
                <span
                  style={{ color: "red", pointerEvents: "none" }}
                  key={match[0]}
                >
                  {match[0]}
                </span>
              );
            } else {
              // This is the first set, so display it normally
              parts.push(match[0]);
            }

            lastIndex = regex.lastIndex; // Update lastIndex
          }

          // Append any remaining text after the last match
          if (lastIndex < label.length) {
            parts.push(label.slice(lastIndex));
          }

          return <span key={label}>{parts}</span>;
        })
        .reduce((prev, curr) => [prev, ", ", curr]) // Join the selected values with commas
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>
        Select Secondary Work Station
      </span>
    );
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  // Edit model
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    setPrimaryKeyShortname("");
    setKeyShortname("");
  };

  //get all employees list details
  const fetchEmployee = async () => {
    setPageName(!pageName);
    console.time("Function Execution Time");
    try {
      setBankdetail(true);

      const aggregationPipeline = [
        {
          $match: {
            $and: [
              // Conditional company filter
              ...(filtercompany.length > 0
                ? [{ company: { $in: filtercompany } }]
                : []),
              // Conditional branch filter
              ...(filterbranch.length > 0
                ? [{ branch: { $in: filterbranch } }]
                : []),
              // Conditional unit filter
              ...(filterunit.length > 0 ? [{ unit: { $in: filterunit } }] : []),
              // Conditional team filter
              ...(filterteam.length > 0 ? [{ team: { $in: filterteam } }] : []),
              // Conditional employee filter
              ...(filteremp.length > 0
                ? [{ companyname: { $in: filteremp } }]
                : []),
              // Workstation filter
            ],
          },
        },
        {
          $project: {
            empcode: 1,
            companyname: 1,
            company: 1,
            branch: 1,
            unit: 1,
            floor: 1,
            attendancemode: 1,
            workstation: 1,
            workstationinput: 1,
            workmode: 1,
          },
        },
      ];

      if (filtercompany.length > 0) {
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

        let finalData = response.data.users?.filter((data) => {
          if (
            data?.workstation?.length === 0 ||
            (data?.workstation?.length === 1 &&
              data?.workstation?.includes("Please Select Primary Work Station"))
          ) {
            return false;
          }
          return true;
        });

        const assignPrimarySecondaryWorkstations = (data) => {
          return data.map((emp, index) => {
            const workstations = (emp.workstation || []).map(
              (ws) => ws?.trim() || ""
            );

            const [primary, ...secondary] = workstations;

            const extractBranchAndFloor = (workstation) => {
              const branchAndFloor = workstation?.match(/\(([^)]+)\)/)?.[1];
              if (!branchAndFloor) return {};

              const parts = branchAndFloor.split("-");
              const hyphenCount = parts.length - 1;

              const Branch =
                hyphenCount >= 1
                  ? parts
                    .slice(0, Math.min(2, hyphenCount + 1))
                    .join("-")
                    .trim()
                  : "";
              const Floor = parts.slice(-1).join("-").trim();

              return { Branch, Floor };
            };

            const findSystemShortName = (workstation) => {
              const { Branch, Floor } = extractBranchAndFloor(workstation);
              const cabinname = workstation?.split("(")[0].trim();

              const match = workStationSystemName?.find(
                (sht) =>
                  sht?.branch === Branch &&
                  sht?.floor === Floor &&
                  sht?.cabinname === cabinname
              );

              return match?.systemshortname || "";
            };

            const primarySystemShortName = findSystemShortName(primary);
            const secondarySystemShortNames = secondary
              .map(findSystemShortName)
              .filter(Boolean);

            const secondaryworkstationvalue = secondary.join(", ");

            return {
              ...emp,
              primaryworkstation:
                primary === "Please Select Primary Work Station"
                  ? ""
                  : primary || "",
              secondaryworkstation: secondaryworkstationvalue || "",
              systemshortname: [
                primarySystemShortName,
                ...secondarySystemShortNames,
              ]
                .filter(Boolean)
                .join(", "),
            };
          });
        };

        const updatedData = assignPrimarySecondaryWorkstations(finalData);
        setEmployees(
          updatedData?.map((item) => ({
            ...item,
            remotesystemname: item?.workstationinput,
            remotesystemshortname: item?.workstationinput?.slice(0, 15),
          }))
        );
        console.timeEnd("Function Execution Time");
      } else {
        setEmployees([]);
      }
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

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  //Boardingupadate updateby edit page...
  let updateby = empaddform?.updatedby;
  let addedby = empaddform?.addedby;

  //edit post call.
  let boredit = empaddform?._id;
  const sendRequestt = async () => {
    setPageName(!pageName);

    const shortnameArray = (keyPrimaryShortname + keyShortname).split(",")?.map((item) => item?.replaceAll(" ", ""));

    let loginUserStatus = empaddform?.loginUserStatus?.filter((data) => {
      return shortnameArray?.includes(data?.hostname)
    })
    try {
      let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${boredit}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        workstation: [primaryWorkStation, ...valueWorkStation],
        enableworkstation: Boolean(enableWorkstation),
        workstationshortname: shortnameArray,
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
      setKeyShortname("");
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

  const editSubmit = (e) => {
    e.preventDefault();
    if (primaryWorkStation === "Select Primary Workstation") {
      setPopupContentMalert("Please Select Primary Work Station!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequestt();
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

      if (!Blob || !FileSaver) {
        console.error("Blob or FileSaver not supported");
        return;
      }

      const data = new Blob([excelBuffer], { type: fileType });

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
        Empcode: item.empcode || "",
        Name: item.companyname || "",
        "Primary Work Station": item.primaryworkstation || "",
        "Secondary Work Station": item.secondaryworkstation || "",
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

    exportToExcel(formatData(dataToExport), "Assigned Employee Work Station");
    setIsFilterOpen(false);
  };

  //  PDF
  const columns = [
    { title: "Company", field: "company" },
    { title: "Branch", field: "branch" },
    { title: "Unit", field: "unit" },
    { title: "Emp Code", field: "empcode" },
    { title: "Name", field: "companyname" },
    { title: "Primary Work Station", field: "primaryworkstation" },
    { title: "Secondary Work Station", field: "secondaryworkstation" },
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
        }))
        : employees?.map((item, index) => ({
          ...item,
          serialNumber: index + 1,
        }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: {
        fontSize: 4,
      },
      cellWidth: "auto",
    });

    doc.save("Assigned Employee Work Station.pdf");
  };
  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Assigned Employee Work Station",
    pageStyle: "print",
  });

  useEffect(() => {
    fetchEmployee();
    fetchWorkStation();
  }, [change, workStationSystemName]);

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
  const searchTerms = searchQuery.toLowerCase().split(" ");
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
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 150,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
      pinned: "left",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 250,
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
      field: "workmode",
      headerName: "Work Mode",
      flex: 0,
      width: 200,
      hide: !columnVisibility.workmode,
      headerClassName: "bold-header",
    },
    {
      field: "empcode",
      headerName: "Emp Code",
      flex: 0,
      width: 200,
      hide: !columnVisibility.empcode,
      headerClassName: "bold-header",
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          <ListItem
            sx={{
              "&:hover": {
                cursor: "pointer",
                color: "blue",
                textDecoration: "underline",
              },
            }}
          >
            <CopyToClipboard
              onCopy={() => {
                handleCopy("Copied Emp Code!");
              }}
              options={{ message: "Copied Emp Code!" }}
              text={params?.data?.empcode}
            >
              <ListItemText primary={params?.data?.empcode} />
            </CopyToClipboard>
          </ListItem>
        </Grid>
      ),
    },
    {
      field: "companyname",
      headerName: "Name",
      flex: 0,
      width: 200,
      hide: !columnVisibility.companyname,
      headerClassName: "bold-header",
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          <ListItem
            sx={{
              "&:hover": {
                cursor: "pointer",
                color: "blue",
                textDecoration: "underline",
              },
            }}
          >
            <CopyToClipboard
              onCopy={() => {
                handleCopy("Copied Name!");
              }}
              options={{ message: "Copied Name!" }}
              text={params?.data?.companyname}
            >
              <ListItemText primary={params?.data?.companyname} />
            </CopyToClipboard>
          </ListItem>
        </Grid>
      ),
    },
    {
      field: "primaryworkstation",
      headerName: "Primary Work Station",
      flex: 0,
      width: 200,
      hide: !columnVisibility.primaryworkstation,
      headerClassName: "bold-header",
    },
    {
      field: "secondaryworkstation",
      headerName: "Secondary Work Station",
      flex: 0,
      width: 200,
      hide: !columnVisibility.secondaryworkstation,
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
      width: 250,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      // Assign Bank Detail
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {/* {isUserRoleCompare?.includes("eassignworkstation") && ( */}
          <Button
            sx={buttonStyles.buttonsubmit}
            variant="contained"
            onClick={() => {
              getCode(params.data.id);
            }}
          >
            Update
          </Button>
          {/* )} */}
        </Grid>
      ),
    },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item.id,
      serialNumber: item.serialNumber,
      empcode: item.empcode,
      companyname: item.companyname,
      bankname: item.bankname,
      company: item.company,
      branch: item.branch,
      workmode: item.workmode,
      unit: item.unit,
      bankbranchname: item.bankbranchname,
      accountholdername: item.accountholdername,
      accountnumber: item.accountnumber,
      ifsccode: item.ifsccode,
      primaryworkstation: item.primaryworkstation,
      secondaryworkstation: item.secondaryworkstation,
      systemshortname: item?.systemshortname,
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

  return (
    <Box>
      <NotificationContainer />
      {/* ****** Header Content ****** */}
      <Headtitle title={"ASSIGN WORK STATION"} />
      <Typography sx={userStyle.HeaderText}>
        Assigned Employee Work Station
      </Typography>
      <br />
      {isUserRoleCompare?.includes("lassignworkstation") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Assigned Employee Work Station List
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
                  {isUserRoleCompare?.includes("excelassignworkstation") && (
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
                  {isUserRoleCompare?.includes("csvassignworkstation") && (
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
                  {isUserRoleCompare?.includes("printassignworkstation") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfassignworkstation") && (
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
                  {isUserRoleCompare?.includes("imageassignworkstation") && (
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

      {/* Delete Modal */}

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
              overflow: "auto",
            },
            marginTop: "50px",
          }}
          fullWidth={true}
        >
          <Box sx={userStyle.dialogbox}>
            <>
              <Typography
                sx={userStyle.SubHeaderText}
                onClick={(e) => {
                  console.log(
                    primaryWorkStationLabel,
                    "primaryWorkStationLabel"
                  );
                  console.log(primaryWorkStation, "primaryWorkStation");
                }}
              >
                Edit Assigned Employee Work Station Info
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
                    </Grid>
                    <Grid item md={6} sm={12} xs={12}>
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
                      Primary Work Station<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={filteredWorkStation}
                      placeholder="Select Primary Work Station"
                      value={{
                        label: primaryWorkStationLabel,
                        value: primaryWorkStation,
                      }}
                      onChange={(e) => {
                        const isValue = e.value.replace(/\([^)]*\)$/, "");
                        setPrimaryWorkStation(e.value);
                        setPrimaryWorkStationLabel(e.label);
                        setSelectedOptionsWorkStation([]);
                        setValueWorkStation([]);

                        const matches = e.label.match(/^(.*?)\((.*?)\)\((.*?)\)$/);


                        setWorkstationTodoList((prev) => [{
                          workstation: matches?.[1]?.trim() + '(' + matches?.[2]?.trim() + ')',  // G-HRA(TTS-TRICHY-Ground Floor)
                          shortname: matches?.[3],
                          type: "Primary"
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
                              item?.branch === Branch &&
                              (Floor === "" || Floor === item?.floor) &&
                              item?.cabinname === selectedCabinName
                          )
                          ?.map((item) => item?.systemshortname)
                          ?.toString();

                        setPrimaryKeyShortname(`${shortname},`);
                        setKeyShortname("");
                      }}
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 1500 }),
                      }}
                      formatOptionLabel={(data) => {
                        const value = data.label;

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
                  <FormControl size="small" fullWidth>
                    <Typography>Secondary Work Station</Typography>
                    <MultiSelect
                      size="small"
                      options={allWorkStationOpt}
                      value={selectedOptionsWorkStation}
                      onChange={handleEmployeesChange}
                      valueRenderer={customValueRendererEmployees}
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 2500 }),
                        menu: (base) => ({
                          ...base,
                          backgroundColor: "#f0f8ff",
                        }),
                        option: (base, state) => ({
                          ...base,
                          backgroundColor: state.isSelected
                            ? "#add8e6"
                            : state.isFocused
                              ? "#e0f7fa"
                              : "#ffffff",
                          color: "#000000",
                        }),
                      }}
                      formatOptionLabel={(data) => {
                        const { label } = data;
                        const parts = [];
                        let currentText = "";
                        let isInParentheses = false;

                        for (let char of label) {
                          if (char === "(") {
                            if (currentText)
                              parts.push({ text: currentText, color: "black" });
                            currentText = "(";
                            isInParentheses = true;
                          } else if (char === ")") {
                            currentText += ")";
                            parts.push({
                              text: currentText,
                              color: parts.length === 1 ? "green" : "black",
                            }); // Green for second set
                            currentText = "";
                            isInParentheses = false;
                          } else {
                            currentText += char;
                          }
                        }

                        if (currentText)
                          parts.push({ text: currentText, color: "black" });

                        return (
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {parts.map((part, index) => (
                              <span key={index} style={{ color: part.color }}>
                                {part.text}
                              </span>
                            ))}
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
                      value={keyPrimaryShortname + keyShortname}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={8} xs={12} sm={12}>
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
                  Update
                </Button>
                <Grid item md={1}></Grid>
                <Button
                  onClick={handleCloseModEdit}
                  sx={buttonStyles.btncancel}
                >
                  Cancel
                </Button>
              </Grid>
            </>
          </Box>
        </Dialog>
      </Box>

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

      {/* this is info view details */}

      <Dialog
        open={openInfo}
        onClose={handleCloseinfo}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
      >
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              Work Station Info
            </Typography>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">addedby</Typography>
                  <br />
                  <Table>
                    <TableHead>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {"SNO"}.
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {" "}
                        {"UserName"}
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {" "}
                        {"Date"}
                      </StyledTableCell>
                    </TableHead>
                    <TableBody>
                      {addedby?.map((item, i) => (
                        <StyledTableRow>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {i + 1}.
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {" "}
                            {item.name}
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {" "}
                            {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}
                          </StyledTableCell>
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
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {"SNO"}.
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {" "}
                        {"UserName"}
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {" "}
                        {"Date"}
                      </StyledTableCell>
                    </TableHead>
                    <TableBody>
                      {updateby?.map((item, i) => (
                        <StyledTableRow>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {i + 1}.
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {" "}
                            {item.name}
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {" "}
                            {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}
                          </StyledTableCell>
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
              <Button variant="contained" onClick={handleCloseinfo}>
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

      <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={rowDataTable ?? []}
        itemsTwo={employees ?? []}
        filename={"Assigned Employee Work Station"}
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

export default AssignedWorkStation;