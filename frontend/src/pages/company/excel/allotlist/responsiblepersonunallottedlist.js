import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput,IconButton, Dialog, Select, Checkbox, TableCell, TableRow, MenuItem, TableBody, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button } from "@mui/material";
import { userStyle, colourStyles } from "../../../../pageStyle";
import { StyledTableRow, StyledTableCell } from "../../../../components/Table";
import { AuthContext, UserRoleAccessContext } from "../../../../context/Appcontext";
import { FaPrint, FaFilePdf, FaFileCsv, FaFileExcel } from "react-icons/fa";
import { handleApiError } from "../../../../components/Errorhandling";
import { useReactToPrint } from "react-to-print";
import "jspdf-autotable";
import jsPDF from "jspdf";
import axios from "axios";
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';
import { saveAs } from "file-saver";
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Selects from "react-select";
import { NotificationContainer, NotificationManager } from "react-notifications";
import "react-notifications/lib/notifications.css";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import { SERVICE } from "../../../../services/Baseservice";
import Headtitle from "../../../../components/Headtitle";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import CircularProgress, { circularProgressClasses } from "@mui/material/CircularProgress";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';


function FacebookCircularProgress(props) {
  return (
    <Box style={{ position: "relative" }}>
      <CircularProgress
        variant="determinate"
        style={{
          color: (theme) => theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
        }}
        size={40}
        thickness={4}
        {...props}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        style={{
          color: (theme) => (theme.palette.mode === "light" ? "#1a90ff" : "#308fe8"),
          animationDuration: "550ms",
          position: "absolute",
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: "round",
          },
        }}
        size={40}
        thickness={4}
        {...props}
      />
    </Box>
  );
}

function Unallottedresponsiblelist() {
  const { isUserRoleCompare, isUserRoleAccess, allUsersData, allTeam, isAssignBranch } = useContext(UserRoleAccessContext);

  const [excelsmapdata, setExcelsmapdata] = useState([]);
  const [branches, setBranches] = useState([]);
  const [users, setUsers] = useState(allUsersData);
  const [excelmapdataresperson, setExcelmapdataresperson] = useState([]);
  const [unitstabledata, setUnitstabledata] = useState([]);
  const [isLoader, setIsLoader] = useState(false);
  const gridRef = useRef(null);
  const [pagemap, setPagemap] = useState(1);
  const [pageSizeMap, setPageSizeMap] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
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

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };
  const handleExportXL = async (isfilter) => {
    if (isfilter === "filtered") {
      exportToCSV(
        filteredDataMap?.map((t, index) => ({
          Sno: index + 1,
          "project Name": t.project,
          "Vendor Name": t.vendor,
          Customer: t.customer,
          Process: t.process,
          "Category Name": t.category,
          "Subcategory Name": t.subcategory,
          "Queue Name": t.queue,
        })),
        fileName,
      );
    } else if (isfilter === "overall") {

      exportToCSV(
        itemsmap?.map((t, index) => ({
          Sno: index + 1,
          "project Name": t.project,
          "Vendor Name": t.vendor,
          Customer: t.customer,
          Process: t.process,
          "Category Name": t.category,
          "Subcategory Name": t.subcategory,
          "Queue Name": t.queue,
        })),
        fileName,
      );

    }

    setIsFilterOpen(false)
  };



  const downloadPdf = async (isfilter) => {
    const doc = new jsPDF();
    // Initialize serial number counter
    let serialNumberCounter = 1;

    // Modify columns to include serial number column
    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" }, // Serial number column
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];
    let overall;

    // Modify row data to include serial number
    const dataWithSerial = isfilter === "filtered" ?
    filteredDataMap.map((item, index) => ({
        serialNumber: index + 1,
        project: item.project,
        vendor: item.vendor,
        customer: item.customer,
        process: item.process,
        category: item.category,
        subcategory: item.subcategory,
        queue: item.queue,

      })) :
      itemsmap?.map((item, index) => ({
        serialNumber: index + 1,
        project: item.project,
        vendor: item.vendor,
        customer: item.customer,
        process: item.process,
        category: item.category,
        subcategory: item.subcategory,
        queue: item.queue,

      }))

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      styles: {
        fontSize: 4,
      },
      columns: columnsWithSerial,
      body: dataWithSerial,
    });

    doc.save("UnAllottedResponsiblePerson.pdf");
  };



 //image
 const handleCaptureImage = () => {
  if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
          canvas.toBlob((blob) => {
              saveAs(blob, 'UnAllottedResponsiblePerson.png');
          });
      });
  }
};
  const dropdowndata = [
    { label: "NOT FOR US", value: "NOT FOR US" },
    { label: "OTHER-NFU", value: "OTHER-NFU" },
    { label: "OTHER", value: "OTHER" },
    { label: "WEB-NFU", value: "WEB-NFU" },
  ];
  const { auth } = useContext(AuthContext);

  const handleSubmitSelectedcancel = (e) => {
    e.preventDefault();
    setSelectedRows([]);
    setTodoscheckall([]);
    setSelectAll(false);
    setNewcheckBranch("Select Branch");
    setNewcheckUnit("Select Unit");
    setNewcheckTeam("Select Team");
    setNewcheckResperson("Select Responsible Person");
    setNewcheckPriority("Select Sector");
    setShowAlert(
      <>
        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Cleared Successfully"}</p>
      </>
    );
    handleClickOpenerr();
  };


  //overall selected check box functionality todo list
  const [todoscheckall, setTodoscheckall] = useState([]);
  const [editingIndexcheckall, setEditingIndexcheckall] = useState(-1);
  const [newcheckbranch, setNewcheckBranch] = useState("Select Branch");
  const [newcheckunit, setNewcheckUnit] = useState("Select Unit");
  const [newcheckteam, setNewcheckTeam] = useState("Select Team");
  const [newcheckresperson, setNewcheckResperson] = useState("Select Responsible Person");
  const [newcheckpriority, setNewcheckPriority] = useState("Select Sector");
  const [errormsgeditcheck, seterrormsgeditcheck] = useState("");
  const [errormsgeditcheckall, seterrormsgeditcheckall] = useState("");
  const [newcheckbranchedit, setNewcheckBranchedit] = useState("Select Branch");
  const [newcheckunitedit, setNewcheckUnitedit] = useState("Select Unit");
  const [newcheckteamedit, setNewcheckTeamedit] = useState("Select Team");
  const [newcheckrespersonedit, setNewcheckRespersonedit] = useState("Select Responsible Person");
  const [newcheckpriorityedit, setNewcheckPriorityedit] = useState("Select Priority");

  const handleCreateTodocheckeditall = () => {
    if (newcheckbranch !== "Select Branch" && newcheckunit !== "Select Unit" && newcheckteam !== "Select Team" && newcheckresperson !== "Select Responsible Person" && newcheckpriority !== "Select Sector") {
      const isDuplicate = todoscheckall.some((todo) => todo.priority === newcheckpriority || todo.branch === newcheckbranch);
      const isDuplicatebranch = todoscheckall.some((todo) => todo.branch === newcheckbranch);
      const isDuplicatepriority = todoscheckall.some((todo) => todo.priority === newcheckpriority);
      if (!isDuplicate) {
        const newcheckTodocheck = {
          branch: newcheckbranch,
          unit: newcheckunit,
          team: newcheckteam,
          resperson: newcheckresperson,
          priority: newcheckpriority,
        };
        setTodoscheckall([...todoscheckall, newcheckTodocheck]);
        setNewcheckBranch("Select Branch");
        setNewcheckUnit("Select Unit");
        setNewcheckTeam("Select Team");
        setNewcheckResperson("Select Responsible Person");
        setNewcheckPriority("Select Sector");
        seterrormsgeditcheck("");
      } else {
        seterrormsgeditcheck(isDuplicatepriority && isDuplicatebranch ? "Already this sector,branch added" : isDuplicatebranch ? "Already this branch added" : isDuplicatepriority ? "Already this Sector added" : "");
      }
    } else {
      seterrormsgeditcheck(newcheckbranch === "Select Branch" && newcheckunit == "Select Unit" && newcheckteam == "Select Team" ? "Please Fill All Fields" : newcheckbranch === "Select Branch" ? "Please Select Branch" : newcheckunit == "Select Unit" ? "Please select Unit" : newcheckteam == "Select Team" ? "Please select Team" : newcheckresperson == "Select Responsible Person" ? "Please select Responsible Person" : "Please select Sector");
    }
  };

  const handleEditTodocheckall = (index) => {
    setEditingIndexcheckall(index);
    setNewcheckBranchedit(todoscheckall[index].branch);
    setNewcheckUnitedit(todoscheckall[index].unit);
    setNewcheckTeamedit(todoscheckall[index].team);
    setNewcheckRespersonedit(todoscheckall[index].resperson);
    setNewcheckPriorityedit(todoscheckall[index].priority);
  };

  const handleUpdateTodocheckall = () => {
    if (newcheckbranchedit !== "Select Branch" && newcheckunitedit !== "Select Unit" && newcheckteamedit !== "Select Team" && newcheckrespersonedit !== "Select Responsible Person" && newcheckpriorityedit !== "Select Sector") {
      const branch = newcheckbranchedit;
      const unit = newcheckunitedit;
      const team = newcheckteamedit;
      const resperson = newcheckrespersonedit;
      const priority = newcheckpriorityedit;
      let branchdupe = !todoscheckall.find((todo, index) => index !== editingIndexcheckall && todo.branch.toLowerCase() === newcheckbranchedit.toLowerCase());
      let prioritydupe = !todoscheckall.find((todo, index) => index !== editingIndexcheckall && todo.priority.toLowerCase() === newcheckpriorityedit.toLowerCase());
      if (!todoscheckall.find((todo, index) => index !== editingIndexcheckall && todo.branch.toLowerCase() === newcheckbranchedit.toLowerCase() && todo.priority.toLowerCase() === newcheckpriorityedit.toLowerCase())) {
        const newTodoscheck = [...todoscheckall];
        newTodoscheck[editingIndexcheckall].branch = branch;
        newTodoscheck[editingIndexcheckall].unit = unit;
        newTodoscheck[editingIndexcheckall].team = team;
        newTodoscheck[editingIndexcheckall].resperson = resperson;
        newTodoscheck[editingIndexcheckall].priority = priority;
        setTodoscheckall(newTodoscheck);
        setEditingIndexcheckall(-1);
        seterrormsgeditcheckall("");
        setNewcheckBranchedit("Select Branch");
        setNewcheckUnitedit("Select Unit");
        setNewcheckTeamedit("Select Team");
        setNewcheckRespersonedit("Select Responsible Person");
        setNewcheckPriorityedit("Select Sector");
      } else {
        seterrormsgeditcheckall(branchdupe && prioritydupe ? "Already this sector,branch added" : branchdupe ? "Already this branch added" : prioritydupe ? "Already this Sector added" : "");
      }
    } else {
      seterrormsgeditcheckall(newcheckbranchedit === "Select Branch" && newcheckunitedit == "Select Unit" && newcheckteamedit == "Select Team" && newcheckrespersonedit == "Please Select Responsible Person" && newcheckpriorityedit == "Please select Sector" ? "Please Fill All Fields" : newcheckbranchedit === "Select Branch" ? "Please Select Branch" : newcheckunitedit == "Select Unit" ? "Please select Unit" : newcheckteamedit == "Select Team" ? "Please select Team" : newcheckrespersonedit == "Select Responsible Person" ? "Please select Responsible Person" : "Please select Sector");
    }
  };

  const handleDeleteTodocheckeditall = (index) => {
    const newcheckTodoscheckall = [...todoscheckall];
    newcheckTodoscheckall.splice(index, 1);
    setTodoscheckall(newcheckTodoscheckall);
  };

  // get all Excels
  const fetchExcelmappeddata = async () => {
    setIsLoader(false);
    try {
      let res_branch = await axios.get(SERVICE.EXCELMAPDATA, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setExcelsmapdata(res_branch?.data?.excelmapdatas);
      setIsLoader(true);
    } catch (err) {setIsLoader(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  // get all Excelsmapdatas
  const fetchExcelmapdata = async () => {
    try {
      let res_branch_mapdata = await axios.get(SERVICE.EXCELMAPDATARESPERSON, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setExcelmapdataresperson(res_branch_mapdata?.data?.excelmaprespersondatas);
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  // get all branches
  const fetchBranch = async () => {
      const branchdata = isAssignBranch?.map(data => ({
        label: data.branch,
        value: data.branch,
      })).filter((item, index, self) => {
        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
      })
      setBranches([...dropdowndata, ...branchdata]);
  };

  // get all units
  const fetchUnits = async (branch) => {
      setUnitstabledata(isAssignBranch?.filter(
        (comp) =>
            branch === comp.branch
      )?.map(data => ({
        label: data.unit,
        value: data.unit,
      })).filter((item, index, self) => {
        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
      }));
  };

  const [tableData, setTableData] = useState([]);
  const [state3, setState3] = useState([]);

  const [getfilterdata, setfilterdata] = useState([]);

  const getfilterdatas = () => {
    const filteredData = excelsmapdata?.filter((value, index, self) => self.findIndex((v) => v.customer === value.customer && v.process === value.process) === index);
    setfilterdata(filteredData);
  };

  useEffect(() => {
    getfilterdatas();
  }, [excelsmapdata]);

  const compareStates = () => {
    const result = getfilterdata?.filter((item2) => !excelmapdataresperson.some((item1) => item1.customer === item2.customer && item1.process === item2.process));

    setState3(result);
  };

  useEffect(() => {
    compareStates();
  }, [getfilterdata]);

  useEffect(() => {
    setTableData(state3?.map((item, i) => ({ ...item, todo: [], errorMessage: "", id: i })));
  }, [state3]);

  const sendRequest = async () => {

    if (selectedRows.length <= 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Any Row"}</p>
        </>
      );
      handleClickOpenerr();
    }

    else {
    tableData.forEach(async (item) => {
      if (item.todo.length > 0) {
        try {
          const response = await axios.post(SERVICE.EXCELMAPDATARESPERSON_CREATE, {
            customer: item.customer,
            priority: item.priority,
            process: item.process,
            hyperlink: item.hyperlink,
            project: item.project,
            vendor: item.vendor,
            category: item.category,
            subcategory: item.subcategory,
            queue: item.queue,
            time: item.time,
            points: item.points,
            todo: item.todo,
            count: item.count,
            tat: item.tat,
            created: item.created,
            addedby: [
              {
                name: String(isUserRoleAccess.companyname),
                date: String(new Date()),
              },
            ],
          });
          setTableData([]);
          NotificationManager.success("Successfully Added 👍", "", 2000);

          await fetchExcelmapdata();fetchExcelmappeddata();
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
      }
    });
  }
  };

  const sendRequestindex = async (index) => {
    tableData.forEach(async (item, i) => {
      if (item.todo.length > 0 && item.id === index) {
        try {
          const response = await axios.post(SERVICE.EXCELMAPDATARESPERSON_CREATE, {
            customer: item.customer,
            priority: item.priority,
            process: item.process,
            hyperlink: item.hyperlink,
            project: item.project,
            vendor: item.vendor,
            category: item.category,
            subcategory: item.subcategory,
            queue: item.queue,
            time: item.time,
            points: item.points,
            todo: item.todo,
            count: item.count,
            tat: item.tat,
            created: item.created,
            addedby: [
              {
                name: String(isUserRoleAccess.companyname),
                date: String(new Date()),
              },
            ],
          });
          setTableData([]);
          setDropdownValues([]);
          NotificationManager.success("Successfully Added 👍", "", 2000);
          await fetchExcelmapdata();fetchExcelmappeddata();
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
      } else if (item.id == index && item.todo.length <= 0) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Allot Branch, Unit, Team, Responsible person, Sector"}</p>
          </>
        );
        handleClickOpenerr();
      }
    });
  };

  const sendRequestindexSelected = async (index) => {
    tableData.forEach(async (item, i) => {
      if (selectedRows.includes(item.id)) {
        try {
          const response = await axios.post(SERVICE.EXCELMAPDATARESPERSON_CREATE, {
            customer: item.customer,
            priority: item.priority,
            process: item.process,
            hyperlink: item.hyperlink,
            project: item.project,
            vendor: item.vendor,
            category: item.category,
            subcategory: item.subcategory,
            queue: item.queue,
            time: item.time,
            points: item.points,
            todo: todoscheckall,
            count: item.count,
            tat: item.tat,
            created: item.created,
            addedby: [
              {
                name: String(isUserRoleAccess.companyname),
                date: String(new Date()),
              },
            ],
          });

          setTodoscheckall([]);
          setSelectedRows([]);
          setSelectAll(false);
          NotificationManager.success("Successfully Added 👍", "", 2000);
          await fetchExcelmapdata();fetchExcelmappeddata();
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
      }
    });
  };

  const handleSubmitSelected = (e) => {
    e.preventDefault();
    if (selectedRows.length <= 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Any Row"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (todoscheckall.length <= 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Allot Branch, unit, Team, Responsible person & Sector"}</p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequestindexSelected();
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

  useEffect(() => {
    fetchExcelmapdata();
    fetchBranch();
    fetchExcelmappeddata();
  }, []);

  //sorting for unalloted list table

  const [dropdownValues, setDropdownValues] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [duplicateIndex, setduplicateIndex] = useState(-1);
  const [duplicateIndexbranch, setduplicateIndexbranch] = useState(-1);

  const handleCreateTodocheck = (todo, id, row, rowIndex) => {
    // Get the todo list for the specific row id

    const isDuplicate = todo.some((todo) => todo.priority === dropdownValues[id]?.priority || todo.branch === dropdownValues[id]?.branch);

    const dupeBranchItem = filteredDataMap.find((item) => {
      return item.todo.some((data) => data.branch === dropdownValues[id]?.branch);
    });

    const dupePriorityItem = filteredDataMap.find((item) => {
      return item.todo.some((data) => data.priority === dropdownValues[id]?.priority);
    });

    const dupeBranchId = dupeBranchItem ? dupeBranchItem.id : null;
    const dupePriorityId = dupePriorityItem ? dupePriorityItem.id : null;

    if (dropdownValues[id]?.branch !== undefined && dropdownValues[id]?.unit !== undefined && dropdownValues[id]?.team !== undefined && dropdownValues[id]?.resperson !== undefined && dropdownValues[id]?.priority !== undefined) {
      if (!isDuplicate) {
        const newTodoItem = {
          branch: dropdownValues[id]?.branch || "",
          unit: dropdownValues[id]?.unit || "",
          team: dropdownValues[id]?.team || "",
          resperson: dropdownValues[id]?.resperson || "",
          priority: dropdownValues[id]?.priority || "",
        };

        // Create a copy of todoList and add the new item
        // Create a copy of row.todo and add the new item
        const updatedTodoList = [...todo, newTodoItem];

        // Update the row with the updated todo list
        const updatedRow = { ...row, todo: updatedTodoList };

        // Replace the old row with the updated row in your data
        const updatedData = tableData.map((item) => (item.id === id ? updatedRow : item));

        setTableData(updatedData);

        // Clear the dropdown values, duplicateIndex, and errorMsg as needed
        setDropdownValues([]);
        setduplicateIndex(-1);
        setduplicateIndexbranch(-1);
        setErrorMsg("");
      } else {
        setduplicateIndex(dupePriorityId);
        setduplicateIndexbranch(dupeBranchId);
        setErrorMsg(dupePriorityId >= 0 && dupeBranchId >= 0 ? "Already this Sector, branch added" : dupeBranchId >= 0 ? "Already this branch added" : dupePriorityId >= 0 ? "Already this Sector added" : "");
      }
    } else {
      setduplicateIndex(id);
      setErrorMsg(dropdownValues[id]?.branch === undefined && dropdownValues[id]?.unit === undefined && dropdownValues[id]?.team === undefined && dropdownValues[id]?.resperson === undefined && dropdownValues[id]?.priority === undefined ? "Please Choose all Fields" : dropdownValues[id]?.branch === undefined ? "Please Choose Branch" : dropdownValues[id]?.unit === undefined ? "Please Choose Unit" : dropdownValues[id]?.team === undefined ? "Please Choose Team" : dropdownValues[id]?.resperson === undefined ? "Please Choose Responsible person" : "Please Choose Sector");
    }
  };

  const handleDeleteTodocheck = (row, rowIndex) => {
    const updatedTodoList = [...row.todo];
    updatedTodoList.splice(rowIndex, 1); // Remove the todo item at the specified index

    // Update the row with the updated todo list
    const updatedRow = { ...row, todo: updatedTodoList };

    // Replace the old row with the updated row in your data
    const updatedData = tableData.map((item) => (item.id === row.id ? updatedRow : item));

    setTableData(updatedData);
    setduplicateIndex(-1);
    setErrorMsg("");
  };

  //UnAlloted queue list
  const checkunallot = tableData?.map((item, index) => ({
    ...item,
    sno: index + 1,
    project: item.project,
    vendor: item.vendor,
    customer: item.customer,
    process: item.process,
    category: item.category,
    subcategory: item.subcategory,
    queue: item.queue,
    branch: "",
    unit: "",
    team: "",
    resperson: "",
    priority: "",
  }));

  const newData = excelmapdataresperson.flatMap((item) =>
    item.todo.map((todoItem) => ({
      project: item.project,
      vendor: item.vendor,
      customer: item.customer,
      process: item.process,
      category: item.category,
      subcategory: item.subcategory,
      queue: item.queue,
      branch: todoItem?.branch,
      unit: todoItem?.unit,
      team: todoItem?.team,
      resperson: todoItem?.resperson,
      priority: todoItem?.priority,
    }))
  );

  const [serial, setSerial] = useState([]);
  const addSerialNumbernewdata = () => {
    const itemsWithSerialNumber = newData?.map((item, index) => ({ ...item, sno: index + 1 }));
    setSerial(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumbernewdata();
  }, [newData]);

  //pdf....
  const columns = [
    { title: "Sno", field: "sno" },
    { title: "Project Name", field: "project" },
    { title: "Vendor Name", field: "vendor" },
    { title: "Customer", field: "customer" },
    { title: "Process", field: "process" },
    { title: "Category Name", field: "category" },
    { title: "Subcategory Name", field: "subcategory" },
    { title: "Queue Name", field: "queue" },
  ];

  // Excel
  const fileName = "UnAllottedResponsiblePerson";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "UnAllottedResponsiblePerson",
    pageStyle: "print",
  });

  const handleDropdownChange = (fieldName, value, rowIndex) => {
    const updatedDropdownValues = [...dropdownValues];
    if (!updatedDropdownValues[rowIndex]) {
      updatedDropdownValues[rowIndex] = {};
    }
    updatedDropdownValues[rowIndex][fieldName] = value;
    setDropdownValues(updatedDropdownValues);
  };

  const [itemsmap, setItemsMap] = useState([]);

  const addSerialNumberMap = () => {
    const itemsWithSerialNumber = tableData?.map((item, index) => ({ ...item, serialNumber: index + 1, id: index }));
    setItemsMap(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumberMap();
  }, [tableData]);

  //sorting for unalloted list table

  //table sorting
  const [sortingmap, setSortingMap] = useState({ column: "", direction: "" });

  const handleSortingMap = (column) => {
    const direction = sortingmap.column === column && sortingmap.direction === "asc" ? "desc" : "asc";
    setSortingMap({ column, direction });
  };

  const sortedDataMap = itemsmap.sort((a, b) => {
    if (sortingmap.direction === "asc") {
      return a[sortingmap.column] > b[sortingmap.column] ? 1 : -1;
    } else if (sortingmap.direction === "desc") {
      return a[sortingmap.column] < b[sortingmap.column] ? 1 : -1;
    }
    return 0;
  });

  const renderSortingIconMap = (column) => {
    if (sortingmap.column !== column) {
      return (
        <>
          <Box sx={{ color: "#bbb6b6" }}>
            <Grid sx={{ height: "6px", fontSize: "1.6rem" }}>
              <ArrowDropUpOutlinedIcon />
            </Grid>
            <Grid sx={{ height: "6px", fontSize: "1.6rem" }}>
              <ArrowDropDownOutlinedIcon />
            </Grid>
          </Box>
        </>
      );
    } else if (sortingmap.direction === "asc") {
      return (
        <>
          <Box>
            <Grid sx={{ height: "6px" }}>
              <ArrowDropUpOutlinedIcon style={{ color: "black", fontSize: "1.6rem" }} />
            </Grid>
            <Grid sx={{ height: "6px" }}>
              <ArrowDropDownOutlinedIcon style={{ color: "#bbb6b6", fontSize: "1.6rem" }} />
            </Grid>
          </Box>
        </>
      );
    } else {
      return (
        <>
          <Box>
            <Grid sx={{ height: "6px" }}>
              <ArrowDropUpOutlinedIcon style={{ color: "#bbb6b6", fontSize: "1.6rem" }} />
            </Grid>
            <Grid sx={{ height: "6px" }}>
              <ArrowDropDownOutlinedIcon style={{ color: "black", fontSize: "1.6rem" }} />
            </Grid>
          </Box>
        </>
      );
    }
  };

  //Datatable
  const handlePageChangeMap = (newPage) => {
    setPagemap(newPage);
  };

  const handlePageSizeChangeMap = (event) => {
    setPageSizeMap(Number(event.target.value));
    setPagemap(1);
  };

  //datatable....
  const [searchQueryMap, setSearchQueryMap] = useState("");
  const handleSearchChangeMap = (event) => {
    setSearchQueryMap(event.target.value);
    setPagemap(1);
  };

  // Split the search query into individual terms
  const searchOverTerms = searchQueryMap.toLowerCase().split(" ");

  // Modify the filtering logic to check each term
  const filteredDatasmap = itemsmap?.filter((item) => {
    return searchOverTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  const filteredDataMap = filteredDatasmap?.slice((pagemap - 1) * pageSizeMap, pagemap * pageSizeMap);

  const totalPagesmap = Math.ceil(filteredDatasmap?.length / pageSizeMap);

  const visiblePagesmap = Math.min(totalPagesmap, 3);

  const firstVisiblePagemap = Math.max(1, pagemap - 1);
  const lastVisiblePagemap = Math.min(firstVisiblePagemap + visiblePagesmap - 1, totalPagesmap);

  const pageNumbersmap = [];

  const indexOfLastItemmap = pagemap * pageSizeMap;
  const indexOfFirstItemmap = indexOfLastItemmap - pageSizeMap;

  for (let i = firstVisiblePagemap; i <= lastVisiblePagemap; i++) {
    pageNumbersmap.push(i);
  }

  const handleCheckboxChange = (id) => {

    let updatedSelectedRows;
    if (selectedRows.includes(id)) {
      updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== id);
    } else {
      updatedSelectedRows = [...selectedRows, id];
    }

    setSelectedRows(updatedSelectedRows);
    // Update the "Select All" checkbox based on whether all rows are selected
    setSelectAll(updatedSelectedRows.length === filteredDataMap.length);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
      setSelectAll(false);
    } else {
      const allRowIds = filteredDataMap.map((row) => row.id);
      setSelectedRows(allRowIds);
      setSelectAll(true);
    }
  };

  return (
    <Box>
      <Headtitle title={"UnAllotted Responsible Person List"} />
      {isUserRoleCompare?.includes("lunallottedresponsiblelist") && (
        <>
          <Box sx={userStyle.container}>
            <Grid container>
              <Grid item md={8} xs={12}>
                <Typography sx={userStyle.SubHeaderText}>UnAllotted Responsible Person List </Typography>
                <NotificationContainer />
              </Grid>
              <Grid item md={4} xs={12}>
                <Box sx={{ display: "flex", justifyContent: "end" }}>
                  <Button variant="contained" sx={{ height: "34px" }} onClick={sendRequest}>
                    Update all
                  </Button>
                </Box>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={4} xs={12} sm={6}>
                <Typography>Branch</Typography>
                <FormControl fullWidth>
                  <Selects
                    options={branches}
                    styles={colourStyles}
                    value={{ label: newcheckbranch, value: newcheckbranch }}
                    onChange={(e) => {
                      setNewcheckBranch(e.value);
                      fetchUnits(e.value);
                      setNewcheckUnit("Select Unit");
                      setNewcheckResperson("Select Responsible Person");
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={6}>
                <Typography>Unit</Typography>
                <FormControl fullWidth>
                  <Selects
                    options={[
                      ...dropdowndata,
                      ...unitstabledata]}
                    styles={colourStyles}
                    value={{ label: newcheckunit, value: newcheckunit }}
                    onChange={(e) => {
                      setNewcheckUnit(e.value);
                      setNewcheckTeam("Select Team");
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={6}>
                <Typography>Team</Typography>
                <FormControl fullWidth>
                  <Selects
                    options={[
                      ...dropdowndata,
                      ...allTeam
                        .filter((team) => team.unit === newcheckunit && team.branch === newcheckbranch)
                        .map((sub) => ({
                          ...sub,
                          label: sub.teamname,
                          value: sub.teamname,
                        })),
                    ]}
                    styles={colourStyles}
                    value={{ label: newcheckteam, value: newcheckteam }}
                    onChange={(e) => {
                      setNewcheckTeam(e.value);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={6}>
                <Typography>Responsible Person</Typography>
                <FormControl fullWidth>
                  <Selects
                    options={[
                      ...dropdowndata,
                      ...allUsersData
                        .filter((user) => user.unit === newcheckunit && user.branch === newcheckbranch && user.team === newcheckteam)
                        .map((sub) => ({
                          ...sub,
                          label: sub.companyname,
                          value: sub.companyname,
                        })),
                    ]}
                    styles={colourStyles}
                    value={{ label: newcheckresperson, value: newcheckresperson }}
                    onChange={(e) => {
                      setNewcheckResperson(e.value);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={6}>
                <Typography>Sector</Typography>
                <FormControl fullWidth>
                  <Selects
                    options={[
                      ...dropdowndata,
                      ...[
                        { label: "Primary", value: "Primary" },
                        { label: "Secondary", value: "Secondary" },
                        { label: "Tertiary", value: "Tertiary" },
                      ],
                    ]}
                    styles={colourStyles}
                    value={{ label: newcheckpriority, value: newcheckpriority }}
                    onChange={(e) => {
                      setNewcheckPriority(e.value);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={1} sm={1} xs={3} marginTop={3}>
                <Button variant="contained" color="primary" sx={{ minWidth: "40px", height: "37px" }} onClick={handleCreateTodocheckeditall}>
                  <FaPlus sx={{ color: "white" }} />
                </Button>
              </Grid>
              <Grid item md={2} sm={3.5} xs={6} marginTop={3}>
                <Button variant="contained" color="warning" onClick={handleSubmitSelected}>
                  Update Selected
                </Button>
              </Grid>
              <Grid item md={1} sm={1.5} xs={3} marginTop={3}>
                <Button sx={userStyle.btncancel} onClick={handleSubmitSelectedcancel}>
                  CLEAR
                </Button>
              </Grid>
            </Grid>
            <Grid container>
              <Typography color="error">{errormsgeditcheck}</Typography>
            </Grid>
            <br /> <br />
            {todoscheckall?.map((item, i) => (
              <div key={i}>
                {editingIndexcheckall === i ? (
                  <Grid container spacing={1}>
                    <Grid item md={0.2} sm={0.2} xs={0.2}>
                      {i + 1}. &ensp;
                    </Grid>
                    <Grid item md={2} sm={2} xs={2}>
                      <FormControl fullWidth>
                        <Selects
                          options={branches}
                          styles={colourStyles}
                          value={{ label: newcheckbranchedit, value: newcheckbranchedit }}
                          onChange={(e) => {
                            setNewcheckBranchedit(e.value);
                            setNewcheckUnitedit("Select Unit");
                            setNewcheckRespersonedit("Select Responsible Person");
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={2} sm={2} xs={2}>
                      <FormControl fullWidth>
                        <Selects
                          options={[
                            ...dropdowndata,
                            ...unitstabledata
                              .filter((unit) => unit.branch === newcheckbranchedit)
                              .map((sub) => ({
                                ...sub,
                                label: sub.name,
                                value: sub.name,
                              })),
                          ]}
                          styles={colourStyles}
                          value={{ label: newcheckunitedit, value: newcheckunitedit }}
                          onChange={(e) => {
                            setNewcheckUnitedit(e.value);
                            setNewcheckTeamedit("Select Team");
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={2} sm={2} xs={2}>
                      <FormControl fullWidth>
                        <Selects
                          options={[
                            ...dropdowndata,
                            ...allTeam
                              .filter((team) => team.unit === newcheckunitedit && team.branch === newcheckbranchedit)
                              .map((sub) => ({
                                ...sub,
                                label: sub.teamname,
                                value: sub.teamname,
                              })),
                          ]}
                          styles={colourStyles}
                          value={{ label: newcheckteamedit, value: newcheckteamedit }}
                          onChange={(e) => {
                            setNewcheckTeamedit(e.value);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3.0} sm={3.0} xs={3.0}>
                      <FormControl fullWidth>
                        <Selects
                          options={[
                            ...dropdowndata,
                            ...allUsersData
                              .filter((user) => user.unit === newcheckunitedit && user.branch === newcheckbranchedit)
                              .map((sub) => ({
                                ...sub,
                                label: sub.companyname,
                                value: sub.companyname,
                              })),
                          ]}
                          styles={colourStyles}
                          value={{ label: newcheckrespersonedit, value: newcheckrespersonedit }}
                          onChange={(e) => {
                            setNewcheckRespersonedit(e.value);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={1.8} sm={1.8} xs={1.8}>
                      <FormControl fullWidth>
                        <Selects
                          options={[
                            ...dropdowndata,
                            ...[
                              { label: "Primary", value: "Primary" },
                              { label: "Secondary", value: "Secondary" },
                              { label: "Tertiary", value: "Tertiary" },
                            ],
                          ]}
                          styles={colourStyles}
                          value={{ label: newcheckpriorityedit, value: newcheckpriorityedit }}
                          onChange={(e) => {
                            setNewcheckPriorityedit(e.value);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={0.5} sm={0.5} xs={0.5}>
                      <Button
                        variant="contained"
                        style={{
                          minWidth: "20px",
                          minHeight: "41px",
                          background: "transparent",
                          boxShadow: "none",
                          marginTop: "-3px !important",
                          "&:hover": {
                            background: "#f4f4f4",
                            borderRadius: "50%",
                            minHeight: "41px",
                            minWidth: "20px",
                            boxShadow: "none",
                          },
                        }}
                        onClick={handleUpdateTodocheckall}
                      >
                        <CheckCircleIcon
                          style={{
                            color: "#216d21",
                            fontSize: "1.5rem",
                          }}
                        />
                      </Button>
                    </Grid>
                    <Grid item md={0.5} sm={0.5} xs={0.5}>
                      <Button
                        variant="contained"
                        style={{
                          minWidth: "20px",
                          minHeight: "41px",
                          background: "transparent",
                          boxShadow: "none",
                          marginTop: "-3px !important",
                          "&:hover": {
                            background: "#f4f4f4",
                            borderRadius: "50%",
                            minHeight: "41px",
                            minWidth: "20px",
                            boxShadow: "none",
                          },
                        }}
                        onClick={() => setEditingIndexcheckall(-1)}
                      >
                        <CancelIcon
                          style={{
                            color: "#b92525",
                            fontSize: "1.5rem",
                          }}
                        />
                      </Button>
                    </Grid>
                  </Grid>
                ) : (
                  <>
                    <Grid container spacing={1} key={i}>
                      <Grid item md={0.2} sm={0.2} xs={0.2}>
                        {i + 1}. &ensp;
                      </Grid>
                      <Grid item md={2} sm={2} xs={2}>
                        &ensp; {item.branch}
                      </Grid>
                      <Grid item md={2} sm={2} xs={2}>
                        {item.unit}
                      </Grid>
                      <Grid item md={2} sm={2} xs={2}>
                        {item.team}
                      </Grid>
                      <Grid item md={3.0} sm={3.0} xs={3.0}>
                        {item.resperson}
                      </Grid>
                      <Grid item md={1.5} sm={1.5} xs={1.5}>
                        {item.priority}
                      </Grid>
                      <Grid item md={0.8} sm={0.8} xs={0.8}>
                        <Button
                          variant="contained"
                          style={{
                            minWidth: "20px",
                            minHeight: "41px",
                            background: "transparent",
                            boxShadow: "none",
                            marginTop: "-13px",
                            "&:hover": {
                              background: "#f4f4f4",
                              borderRadius: "50%",
                              minHeight: "41px",
                              minWidth: "20px",
                              boxShadow: "none",
                            },
                          }}
                          onClick={() => handleEditTodocheckall(i)}
                        >
                          <FaEdit
                            style={{
                              color: "#1976d2",
                              fontSize: "1.2rem",
                            }}
                          />
                        </Button>
                      </Grid>
                      <Grid item md={0.5} sm={0.5} xs={0.5}>
                        <Button onClick={(e) => handleDeleteTodocheckeditall(i)} sx={{ borderRadius: "50%", minWidth: "35px", minHeight: "35px", marginTop: "-8px" }}>
                          <FaTrash
                            style={{
                              color: "#b92525",
                              fontSize: "0.9rem",
                            }}
                          />
                        </Button>
                      </Grid>
                    </Grid>
                    <br />
                    <Grid container>
                      <Typography color="error">{errormsgeditcheckall}</Typography>
                    </Grid>
                  </>
                )}
              </div>
            ))}
            <br /> <br />
            <Grid container sx={{ justifyContent: "center" }}>
              <Grid>
                {isUserRoleCompare?.includes("excelunallottedresponsiblelist") && (
                  
                  <>
                    <Button onClick={(e) => {
                      setIsFilterOpen(true)
                      setFormat("xl")
                    }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                  </>
                )}
                {isUserRoleCompare?.includes("csvunallottedresponsiblelist") && (
                 
                  <>
                    <Button onClick={(e) => {
                      setIsFilterOpen(true)
                      setFormat("csv")
                    }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                  </>
                )}
                {isUserRoleCompare?.includes("printunallottedresponsiblelist") && (
                  <>
                    <Button sx={userStyle.buttongrp} onClick={handleprint}>
                      {" "}
                      &ensp; <FaPrint /> &ensp;Print&ensp;{" "}
                    </Button>
                  </>
                )}
                {isUserRoleCompare?.includes("pdfunallottedresponsiblelist") && (
                 
                  <>
                    <Button sx={userStyle.buttongrp}
                      onClick={() => {
                        setIsPdfFilterOpen(true)
                      }}                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                  </>
                )}
                {isUserRoleCompare?.includes("imageunallottedresponsiblelist") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                        {" "}
                        <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                      </Button>
                    </>
                  )}
              </Grid>
            </Grid>
            <Grid style={userStyle.dataTablestyle}>
              <Box>
                <FormControl>
                  <Typography>Show Entries</Typography>
                  <Select id="pageSizeSelectMap" value={pageSizeMap} onChange={handlePageSizeChangeMap} sx={{ width: "77px" }}>
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                    <MenuItem value={tableData?.length}>All</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box>
                <FormControl fullWidth size="small">
                  <Typography>Search</Typography>
                  <OutlinedInput id="component-outlined" type="text" value={searchQueryMap} onChange={handleSearchChangeMap} />
                </FormControl>
              </Box>
            </Grid>
            {!isLoader ? (
              <>
                <Box style={{ display: "flex", justifyContent: "center" }}>
                  <FacebookCircularProgress />
                </Box>
              </>
            ) : (
              <>
                <TableContainer component={Paper}>
                  <Table aria-label="simple table" id="excel"
                     ref={gridRef}
                  >
                    <TableHead sx={{ fontWeight: "600", lineHeight: "1.2rem" }}>
                      <StyledTableRow>
                        <StyledTableCell>
                          <Checkbox checked={selectAll} onChange={handleSelectAll} />
                        </StyledTableCell>
                        <StyledTableCell onClick={() => handleSortingMap("serialNumber")}>
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>SNo</Box>
                            <Box sx={{ marginTop: "-6PX" }}>{renderSortingIconMap("serialNumber")}</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell onClick={() => handleSortingMap("project")}>
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Project</Box>
                            <Box sx={{ marginTop: "-6PX" }}>{renderSortingIconMap("project")}</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell onClick={() => handleSortingMap("vendor")}>
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Vendor</Box>
                            <Box sx={{ marginTop: "-6PX" }}>{renderSortingIconMap("vendor")}</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell onClick={() => handleSortingMap("customer")}>
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Customer</Box>
                            <Box sx={{ marginTop: "-6PX" }}>{renderSortingIconMap("customer")}</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell onClick={() => handleSortingMap("process")}>
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Process</Box>
                            <Box sx={{ marginTop: "-6PX" }}>{renderSortingIconMap("process")}</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell onClick={() => handleSortingMap("category")}>
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Category</Box>
                            <Box sx={{ marginTop: "-6PX" }}>{renderSortingIconMap("category")}</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell onClick={() => handleSortingMap("subcategory")}>
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Subcategory</Box>
                            <Box sx={{ marginTop: "-6PX" }}>{renderSortingIconMap("subcategory")}</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell onClick={() => handleSortingMap("queue")}>
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Queue</Box>
                            <Box sx={{ marginTop: "-6PX" }}>{renderSortingIconMap("queue")}</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell>
                          <Box sx={{ minWidth: "100px", display: "flex", fontWeight: "550", fontSize: "12px", lineHeight: "1rem" }}>
                            <Box>Branch</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell>
                          <Box sx={{ minWidth: "100px", display: "flex", fontWeight: "550", fontSize: "12px", lineHeight: "1rem" }}>
                            <Box>Unit</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell>
                          <Box sx={{ minWidth: "100px", display: "flex", fontWeight: "550", fontSize: "12px", lineHeight: "1rem" }}>
                            <Box>Team</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell>
                          <Box sx={{ minWidth: "200px", display: "flex", fontWeight: "550", fontSize: "12px", lineHeight: "1rem" }}>
                            <Box>Responsible Person</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell>
                          <Box sx={{ minWidth: "100px", display: "flex", fontWeight: "550", fontSize: "12px", lineHeight: "1rem" }}>
                            <Box>Sector</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell>Action</StyledTableCell>
                      </StyledTableRow>
                    </TableHead>
                    <TableBody align="left">
                      {filteredDataMap.length > 0 ? (
                        filteredDataMap?.map((row, indexval) => (
                          <StyledTableRow key={indexval} sx={{ background: selectedRows.includes(row.id) ? "#1976d22b !important" : "inherit" }}>
                            <StyledTableCell>
                              <Checkbox checked={selectedRows.includes(row.id)} onChange={() => handleCheckboxChange(row.id)} />
                            </StyledTableCell>
                            <StyledTableCell>{row.serialNumber}</StyledTableCell>
                            <StyledTableCell>{row.project} </StyledTableCell>
                            <StyledTableCell>{row.vendor}</StyledTableCell>
                            <StyledTableCell>{row.customer}</StyledTableCell>
                            <StyledTableCell>{row.process}</StyledTableCell>
                            <StyledTableCell>{row.category}</StyledTableCell>
                            <StyledTableCell>{row.subcategory}</StyledTableCell>
                            <StyledTableCell>{row.queue}</StyledTableCell>
                            <StyledTableCell colspan={5}>
                              <Grid container spacing={2}>
                                <Grid item md={4} sm={4} xs={4}>
                                  <FormControl fullWidth>
                                    <Selects
                                      options={branches}
                                      styles={{
                                        menuList: (styles) => ({
                                          ...styles,
                                          background: "white",
                                          maxHeight: "200px",
                                          position: "relative",
                                        }),
                                        // Set a higher z-index for the dropdown menu
                                        menu: (provided) => ({
                                          ...provided,
                                          zIndex: 9999, // Adjust the value as needed
                                          position: "relative",
                                        }),
                                      }}
                                      value={{ label: dropdownValues[row.id]?.branch || "", value: dropdownValues[row.id]?.branch || "" }}
                                      onChange={(e) => handleDropdownChange("branch", e.value, row.id)}
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item md={4} sm={4} xs={4}>
                                  <FormControl fullWidth>
                                    <Selects
                                      options={[
                                        ...dropdowndata,
                                        ...isAssignBranch?.filter(
                                          (comp) =>
                                            comp.branch === dropdownValues[row.id]?.branch
                                        )?.map(data => ({
                                          label: data.unit,
                                          value: data.unit,
                                        })).filter((item, index, self) => {
                                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                        }),
                                      ]}
                                      styles={{
                                        menuList: (styles) => ({
                                          ...styles,
                                          background: "white",
                                          maxHeight: "200px",
                                          position: "relative",
                                        }),
                                        // Set a higher z-index for the dropdown menu
                                        menu: (provided) => ({
                                          ...provided,
                                          zIndex: 9999, // Adjust the value as needed
                                          position: "relative",
                                        }),
                                      }}
                                      value={{ label: dropdownValues[row.id]?.unit || "", value: dropdownValues[row.id]?.unit || "" }}
                                      onChange={(e) => handleDropdownChange("unit", e.value, row.id)}
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item md={4} sm={4} xs={4}>
                                  <FormControl fullWidth>
                                    <Selects
                                      options={[
                                        ...dropdowndata,
                                        ...allTeam
                                          .filter((team) => team.unit === dropdownValues[row.id]?.unit && team.branch === dropdownValues[row.id]?.branch)
                                          .map((sub) => ({
                                            ...sub,
                                            label: sub.teamname,
                                            value: sub.teamname,
                                          })),
                                      ]}
                                      styles={{
                                        menuList: (styles) => ({
                                          ...styles,
                                          background: "white",
                                          maxHeight: "200px",
                                          position: "relative",
                                        }),
                                        // Set a higher z-index for the dropdown menu
                                        menu: (provided) => ({
                                          ...provided,
                                          zIndex: 9999, // Adjust the value as needed
                                          position: "relative",
                                        }),
                                      }}
                                      value={{ label: dropdownValues[row.id]?.team || "", value: dropdownValues[row.id]?.team || "" }}
                                      onChange={(e) => handleDropdownChange("team", e.value, row.id)}
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item md={8} sm={8} xs={8}>
                                  <FormControl fullWidth>
                                    <Selects
                                      options={[
                                        ...dropdowndata,
                                        ...allUsersData
                                          .filter((user) => user.unit === dropdownValues[row.id]?.unit && user.branch === dropdownValues[row.id]?.branch)
                                          .map((sub) => ({
                                            ...sub,
                                            label: sub.companyname,
                                            value: sub.companyname,
                                          })),
                                      ]}
                                      styles={{
                                        menuList: (styles) => ({
                                          ...styles,
                                          background: "white",
                                          maxHeight: "200px",
                                          position: "relative",
                                        }),
                                        // Set a higher z-index for the dropdown menu
                                        menu: (provided) => ({
                                          ...provided,
                                          zIndex: 9999, // Adjust the value as needed
                                          position: "relative",
                                        }),
                                      }}
                                      value={{ label: dropdownValues[row.id]?.resperson || "", value: dropdownValues[row.id]?.resperson || "" }}
                                      onChange={(e) => handleDropdownChange("resperson", e.value, row.id)}
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item md={4} sm={4} xs={4}>
                                  <FormControl fullWidth>
                                    <Selects
                                      options={[
                                        ...dropdowndata,
                                        ...[
                                          { label: "Primary", value: "Primary" },
                                          { label: "Secondary", value: "Secondary" },
                                          { label: "Tertiary", value: "Tertiary" },
                                        ],
                                      ]}
                                      styles={{
                                        menuList: (styles) => ({
                                          ...styles,
                                          background: "white",
                                          maxHeight: "200px",
                                          position: "relative",
                                        }),
                                        // Set a higher z-index for the dropdown menu
                                        menu: (provided) => ({
                                          ...provided,
                                          zIndex: 9999, // Adjust the value as needed
                                          position: "relative",
                                        }),
                                      }}
                                      value={{ label: dropdownValues[row.id]?.priority || "", value: dropdownValues[row.id]?.priority || "" }}
                                      onChange={(e) => handleDropdownChange("priority", e.value, row.id)}
                                    />
                                  </FormControl>
                                </Grid>
                              </Grid>
                              <Grid container>
                                <Grid item md={8}></Grid>
                                {duplicateIndex == row.id || duplicateIndexbranch == row.id ? (
                                  <Grid item md={4}>
                                    {" "}
                                    <Typography style={{ color: "red" }}> {errorMsg} </Typography>
                                  </Grid>
                                ) : null}
                              </Grid>
                              <br />
                              <br />

                              {row.todo?.map((todo, index) => (
                                <div key={index}>
                                  <Grid container spacing={1}>
                                    <Grid item md={2} sm={4} xs={4}>
                                      <Typography variant="subtitle2" color="textSecondary" sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                                        {todo.branch}
                                      </Typography>
                                    </Grid>
                                    <Grid item md={2} sm={4} xs={4}>
                                      <Typography variant="subtitle2" color="textSecondary" sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                                        {todo.unit}
                                      </Typography>
                                    </Grid>
                                    <Grid item md={2} sm={4} xs={4}>
                                      <Typography variant="subtitle2" color="textSecondary" sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                                        {todo.team}
                                      </Typography>
                                    </Grid>
                                    <Grid item md={3} sm={4} xs={4}>
                                      <Typography variant="subtitle2" color="textSecondary" sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                                        {todo.resperson}
                                      </Typography>
                                    </Grid>
                                    <Grid item md={2} sm={4} xs={4}>
                                      <Typography variant="subtitle2" color="textSecondary" sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                                        {todo.priority}
                                      </Typography>
                                    </Grid>
                                    <Grid item md={1} sm={2} xs={2}>
                                      <Button
                                        variant="contained"
                                        style={{
                                          minWidth: "20px",
                                          minHeight: "41px",
                                          background: "transparent",
                                          boxShadow: "none",
                                          marginTop: "-13px !important",
                                          "&:hover": {
                                            background: "#f4f4f4",
                                            borderRadius: "50%",
                                            minHeight: "41px",
                                            minWidth: "20px",
                                            boxShadow: "none",
                                          },
                                        }}
                                        onClick={() => handleDeleteTodocheck(row, index)}
                                      >
                                        <FaTrash
                                          style={{
                                            color: "#b92525",
                                            fontSize: "0.9rem",
                                          }}
                                        />
                                      </Button>
                                    </Grid>
                                  </Grid>
                                  {/* )} */}
                                  <br />
                                </div>
                              ))}
                            </StyledTableCell>

                            <StyledTableCell sx={{ minWidth: "160px" }}>
                              <Grid container spacing={2}>
                                <Grid item md={4}>
                                  <Button variant="contained" color="success" sx={{ minWidth: "40px", height: "33px" }} onClick={(e) => handleCreateTodocheck(row.todo, row.id, row, indexval)}>
                                    <FaPlus style={{ fontSize: "15px" }} />
                                  </Button>
                                </Grid>
                                <Grid item md={8}>
                                  <Box sx={{ display: "flex", justifyContent: "end" }}>
                                    <Button variant="contained" sx={{ height: "34px" }} onClick={(e) => sendRequestindex(row.id)}>
                                      Update
                                    </Button>
                                  </Box>
                                </Grid>
                              </Grid>
                            </StyledTableCell>
                          </StyledTableRow>
                        ))
                      ) : (
                        <StyledTableRow>
                          {" "}
                          <StyledTableCell colSpan={19} align="center">
                            No Data Available
                          </StyledTableCell>{" "}
                        </StyledTableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box style={userStyle.dataTablestyle}>
                  <Box>
                    Showing {filteredDataMap.length > 0 ? (pagemap - 1) * pageSizeMap + 1 : 0} to {Math.min(pagemap * pageSizeMap, filteredDatasmap.length)} of {filteredDatasmap.length} entries
                  </Box>

                  <Box>
                    <Button onClick={() => setPagemap(1)} disabled={pagemap === 1} sx={userStyle.paginationbtn}>
                      <FirstPageIcon />
                    </Button>
                    <Button onClick={() => handlePageChangeMap(pagemap - 1)} disabled={pagemap === 1} sx={userStyle.paginationbtn}>
                      <NavigateBeforeIcon />
                    </Button>
                    {pageNumbersmap?.map((pageNumber) => (
                      <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChangeMap(pageNumber)} className={pagemap === pageNumber ? "active" : ""} disabled={pagemap === pageNumber}>
                        {pageNumber}
                      </Button>
                    ))}
                    {lastVisiblePagemap < totalPagesmap && <span>...</span>}
                    <Button onClick={() => handlePageChangeMap(pagemap + 1)} disabled={pagemap === totalPagesmap} sx={userStyle.paginationbtn}>
                      <NavigateNextIcon />
                    </Button>
                    <Button onClick={() => setPagemap(totalPagesmap)} disabled={pagemap === totalPagesmap} sx={userStyle.paginationbtn}>
                      <LastPageIcon />
                    </Button>
                  </Box>
                </Box>
              </>
            )}
            <br />
            <Grid container>
              <Grid item md={8} xs={12}></Grid>
              <Grid item md={4} xs={12}>
                <Box sx={{ display: "flex", justifyContent: "end" }}>
                  <Button variant="contained" sx={{ height: "34px" }} onClick={sendRequest}>
                    Update all
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
      <br />

      {/* print layout for UnAlloted Responsible person*/}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
          <TableHead sx={{ fontWeight: "600" }}>
            <TableRow>
              <TableCell> SI.No</TableCell>
              <TableCell> Project Name</TableCell>
              <TableCell>Vendor Name</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Process</TableCell>
              <TableCell>Category Name</TableCell>
              <TableCell>Subcategory Name</TableCell>
              <TableCell>Queue Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDataMap.length > 0 &&
              filteredDataMap.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.project}</TableCell>
                  <TableCell>{row.vendor}</TableCell>
                  <TableCell>{row.customer}</TableCell>
                  <TableCell>{row.process}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{row.subcategory}</TableCell>
                  <TableCell>{row.queue}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
   {/*Export XL Data  */}
   <Dialog open={isFilterOpen} onClose={handleCloseFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
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
                    {fileFormat === "xl" ? <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
                        :
                        <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
                    }
                    <Typography variant="h5" sx={{ textAlign: "center" }}>
                        Choose Export
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus variant="contained"
                        onClick={(e) => {
                            handleExportXL("filtered")
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button autoFocus variant="contained"
                        onClick={(e) => {
                            handleExportXL("overall")
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>
            {/*Export pdf Data  */}
            <Dialog open={isPdfFilterOpen} onClose={handleClosePdfFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
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
                            downloadPdf("filtered")
                            setIsPdfFilterOpen(false);
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button variant="contained"
                        onClick={(e) => {
                            downloadPdf("overall")
                            setIsPdfFilterOpen(false);
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>
      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default Unallottedresponsiblelist;
