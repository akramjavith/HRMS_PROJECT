// import CloseIcon from "@mui/icons-material/Close";
// import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
// import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
// import FirstPageIcon from "@mui/icons-material/FirstPage";
// import ImageIcon from "@mui/icons-material/Image";
// import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
// import LastPageIcon from "@mui/icons-material/LastPage";
// import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
// import NavigateNextIcon from "@mui/icons-material/NavigateNext";
// import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
// import {
//     Box,
//     Button,
//     InputLabel,
//     Checkbox,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     FormControl, Grid,
//     IconButton,
//     List, ListItem,
//     ListItemText,
//     MenuItem,
//     OutlinedInput,
//     Popover,
//     Select,
//     TextField,
//     Typography,
// } from "@mui/material";
// import Switch from "@mui/material/Switch";
// import axios from "axios";
// import { saveAs } from "file-saver";
// import html2canvas from "html2canvas";
// import "jspdf-autotable";
// import React, { useContext, useEffect, useRef, useState } from "react";
// import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
// import { ThreeDots } from "react-loader-spinner";
// import Selects from "react-select";
// import { useReactToPrint } from "react-to-print";
// import AlertDialog from "../../components/Alert.js";
// import { DeleteConfirmation, PleaseSelectRow, } from "../../components/DeleteConfirmation.js";
// import { handleApiError } from "../../components/Errorhandling.js";
// import ExportData from "../../components/ExportData.js";
// import Headtitle from "../../components/Headtitle.js";
// import InfoPopup from "../../components/InfoPopup.js";
// import MessageAlert from "../../components/MessageAlert.js";
// import PageHeading from "../../components/PageHeading.js";
// import StyledDataGrid from "../../components/TableStyle.js";
// import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext.js";
// import { userStyle } from "../../pageStyle.js";
// import { SERVICE } from "../../services/Baseservice.js";
// import AggregatedSearchBar from "../../components/AggregatedSearchBar";
// import AggridTable from "../../components/AggridTable";
// import domtoimage from 'dom-to-image';

// const FormulaBuilder = () => {
//   const [values, setValues] = useState(['valuea', 'valueb', 'valuecc', 'valued']); // Example values
//   const [operations, setOperations] = useState(['+', '-', '*', '/']); // Operations
//   const [formula, setFormula] = useState([]); // To track the formula components
//   const [currentValue, setCurrentValue] = useState('');
//   const [currentOperation, setCurrentOperation] = useState('');

//       const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles, } = useContext(UserRoleAccessContext);
  

//   const typeOpt = [
//     { label: "+", value: "+" },
//     { label: "-", value: "-" },
//     { label: "*", value: "*" },
//     { label: "/", value: "/" },
// ];
// const sum = [
//   { label: "valuea", value: "valuea" },
//   { label: "valueb", value: "valueb" },
//   { label: "valuec", value: "valuec" },
//   { label: "valued", value: "valued" },

// ];


//   const addToFormula = () => {
//     if (currentValue && currentOperation) {
//       setFormula([...formula, { value: currentValue, operation: currentOperation }]);
//       setCurrentValue('');
//       setCurrentOperation('');
//     }
//   };

//   const generateFormula = () => {
//     let result = '';
//     formula.forEach((item, index) => {
//       if (index === 0) {
//         result += item.value;
//       } else {
//         result += ` ${item.operation} ${item.value}`;
//       }
//     });
//     return result;
//   };

//   return (
//     // <div>
//     //   <div>
//     //     <select
//     //       value={currentValue}
//     //       onChange={(e) => setCurrentValue(e.target.value)}
//     //     >
//     //       <option value="">Select Value</option>
//     //       {values.map((value, index) => (
//     //         <option key={index} value={value}>
//     //           {value}
//     //         </option>
//     //       ))}
//     //     </select>

//     //     <select
//     //       value={currentOperation}
//     //       onChange={(e) => setCurrentOperation(e.target.value)}
//     //     >
//     //       <option value="">Select Operation</option>
//     //       {operations.map((operation, index) => (
//     //         <option key={index} value={operation}>
//     //           {operation}
//     //         </option>
//     //       ))}
//     //     </select>

//     //     <button onClick={addToFormula}>Add to Formula</button>
//     //   </div>

//     //   <div>
//     //     <h3>Current Formula:</h3>
//     //     <p>{generateFormula()}</p>
//     //   </div>
//     // </div>
//  <Box>
//             <Headtitle title={"HARDWARE SPECIFICATION"} />
//             <PageHeading
//                 title="Hardware Specification"
//                 modulename="Asset"
//                 submodulename="Asset Specifications"
//                 mainpagename="Hardware Specification"
//                 subpagename=""
//                 subsubpagename=""
//             />
//   <>
//                     <Box sx={userStyle.selectcontainer}>
//                         <>
//                             <Grid container spacing={2}>
//                                 <Grid item xs={8}>
//                                     <Typography sx={userStyle.importheadtext}>
//                                         Add Esi Formula
//                                     </Typography>
//                                 </Grid>
//                             </Grid>
//                             <br />
//                             <Grid container spacing={2}>
//                                 <Grid item md={3} xs={12} sm={12}>
//                                 <FormControl sx={{ minWidth: 150 }}>
//           <InputLabel>Select Value</InputLabel>
//           <Select
//             value={currentValue}
//             label="Select Value"
//             onChange={(e) => setCurrentValue(e.target.value)}
//           >
//             {values.map((val, idx) => (
//               <MenuItem key={idx} value={val}>
//                 {val}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//                                 </Grid>
//                                 <Grid item md={3} xs={12} sm={12}>
//                                 <FormControl sx={{ minWidth: 150 }}>
//           <InputLabel>Select Operation</InputLabel>
//           <Select
//             value={currentOperation}
//             label="Select Operation"
//             onChange={(e) => setCurrentOperation(e.target.value)}
//           >
//             {operations.map((op, idx) => (
//               <MenuItem key={idx} value={op}>
//                 {op}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//                                 </Grid>
//                                 <Grid item md={3} xs={12} sm={6} marginTop={3}>
//                                             <Button
//                                                 variant="contained"
//                                                 sx={buttonStyles.buttonsubmit}
//                                                 onClick={addToFormula}
//                                             >
//                                                 Add To Formula
//                                             </Button>
//                                         </Grid>
                             

//                             </Grid>
//                         </>
//                     </Box>
//                 </>
                
//       <Typography variant="h6">Current Formula:</Typography>
//       <Typography>{generateFormula()}</Typography>
//             </Box>


//   );
// };

// export default FormulaBuilder;

import React, { useState } from 'react';
import {
  Button, Select, MenuItem, InputLabel,
  FormControl, Grid, Typography
} from '@mui/material';

function FormulaBuilder() {
  const [field, setField] = useState('');
  const [operator, setOperator] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [generatedFormula, setGeneratedFormula] = useState('');
  const [todoList, setTodoList] = useState([]);

  const fieldOptions = ['valuea', 'valueb', 'valuec'];
  const operatorOptions = ['+', '-', '*', '/'];
  const monthOptions = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const yearOptions = ['2023', '2024', '2025', '2026'];

  const handleGenerateFormula = () => {
    let part = '';
    if (field) part += field;
    if (operator) part += ` ${operator}`;
    if (part) {
      const newFormula = generatedFormula ? `${generatedFormula} ${part}` : part;
      setGeneratedFormula(newFormula.trim());
      setField('');
      setOperator('');
    }
  };

  const handleAddToDo = () => {
    if (generatedFormula && month && year) {
      const finalEntry = `${generatedFormula} for ${month} ${year}`;
      setTodoList([...todoList, finalEntry]);

      // Clear everything
      setGeneratedFormula('');
      setField('');
      setOperator('');
      setMonth('');
      setYear('');
    } else {
      alert('Please generate a formula and select month & year');
    }
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>Formula Builder</Typography>

      <Grid container spacing={2}>
        {/* Field Dropdown */}
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Field</InputLabel>
            <Select value={field} onChange={(e) => setField(e.target.value)} label="Field">
              {fieldOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Operator Dropdown */}
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Operator</InputLabel>
            <Select value={operator} onChange={(e) => setOperator(e.target.value)} label="Operator">
              {operatorOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Generate Formula Button */}
        <Grid item xs={12}>
          <Button variant="outlined" onClick={handleGenerateFormula}>
            Generate Formula
          </Button>
        </Grid>

        {/* Month Dropdown */}
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Month</InputLabel>
            <Select value={month} onChange={(e) => setMonth(e.target.value)} label="Month">
              {monthOptions.map((m) => (
                <MenuItem key={m} value={m}>{m}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Year Dropdown */}
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Year</InputLabel>
            <Select value={year} onChange={(e) => setYear(e.target.value)} label="Year">
              {yearOptions.map((y) => (
                <MenuItem key={y} value={y}>{y}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Add Button */}
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleAddToDo}>
            Add to To-Do List
          </Button>
        </Grid>
      </Grid>

      {/* Display Generated Formula */}
      {generatedFormula && (
        <Typography sx={{ mt: 2 }}>Generated Formula: <strong>{generatedFormula}</strong></Typography>
      )}

      {/* Display Todo List */}
      {todoList.length > 0 && (
        <>
          <Typography variant="h6" sx={{ mt: 3 }}>To-Do List</Typography>
          <ul>
            {todoList.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default FormulaBuilder;

