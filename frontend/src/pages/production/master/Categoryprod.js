import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography,Autocomplete, FormGroup, FormControlLabel, OutlinedInput, Dialog, Select, MenuItem, DialogContent, DialogActions, FormControl, Grid, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle.js";
import { FaPrint, FaFilePdf, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { SERVICE } from "../../../services/Baseservice.js";
import StyledDataGrid from "../../../components/TableStyle.js";
import axios from "axios";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext.js";
import { handleApiError } from "../../../components/Errorhandling.js";
import Headtitle from "../../../components/Headtitle.js";
import Selects from "react-select";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { styled } from "@mui/system";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { MultiSelect } from "react-multi-select-component";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import Pagination from "../../../components/Pagination.js";
import ExportData from "../../../components/ExportData.js";
import AlertDialog from "../../../components/Alert.js";
import MessageAlert from "../../../components/MessageAlert.js";
import InfoPopup from "../../../components/InfoPopup.js";
import { DeleteConfirmation, PleaseSelectRow } from "../../../components/DeleteConfirmation.js";
import PageHeading from "../../../components/PageHeading.js";
import { ThreeDots } from "react-loader-spinner";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import LastPageIcon from "@mui/icons-material/LastPage";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import Chip from '@mui/material/Chip';

function CategoryMaster() {
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

//   const defaultSelectedPrimary = ["Primary", "First", ];
//   const defaultSelectedSecondary = ["Secondary", "Second",];
//   const defaultSelectedReconcile = ["Reconcile", "Reconcililation",];
//   const [inputValue, setInputValue] = useState("");
//   const [inputValueS, setInputValueS] = useState("");
//   const [inputValueR, setInputValueR] = useState("");

  // const [selectedValuesPrimary, setSelectedValuesPrimary] = useState("");
//   const [allOptionsPrimary, setAllOptionsPrimary] = useState(
//     ["Primary", "First",].filter(
//       (option) => !defaultSelectedPrimary.includes(option) // Remove defaults from options
//     )
//   );

  // const [selectedValuesSecondary, setSelectedValuesSecondary] = useState("");
//   const [allOptionsSecondary, setAllOptionsSecondary] = useState(
//     ["Secondary", "Second",].filter(
//       (option) => !defaultSelectedSecondary.includes(option) // Remove defaults from options
//     )
//   );

  // const [selectedValuesReconcile, setSelectedValuesReconcile] = useState("");
//   const [allOptionsReconcile, setAllOptionsReconcile] = useState(
//     ["Reconcile", "Reconcililation",].filter(
//       (option) => !defaultSelectedReconcile.includes(option) // Remove defaults from options
//     )
//   );
// // Primary ONchange
//   const handleChangePrimary = (event, newValues) => {
//     setSelectedValuesPrimary(newValues);
//     // Filter out selected values from the dropdown options
//     const updatedOptions = allOptionsPrimary.filter((option) => !newValues.includes(option));
//     setAllOptionsPrimary(updatedOptions);
//   }; 
//   const handleKeyDownPrimary = (event) => {
//     if (event.key === "Enter") {
//       event.preventDefault(); // Prevent form submission or default behavior

//       const trimmedValue = inputValue.trim();
//       if (trimmedValue && !selectedValuesPrimary.includes(trimmedValue)) {
//         setSelectedValuesPrimary([...selectedValuesPrimary, trimmedValue]); // Add new value
//         setInputValue(""); // Reset input field
//       }else{
//         setPopupContentMalert("Duplicate Value");
//         setPopupSeverityMalert("warning");
//         handleClickOpenPopupMalert();
//       }
//     }
//   };
//   const handleDeletePrimary = (valueToRemove) => {
//     setSelectedValuesPrimary((prev) => prev.filter((val) => val !== valueToRemove));
//     setAllOptionsPrimary((prev) => [...prev, valueToRemove]); // Add back to options
//   };
// //SECONDARY ONCHANGES
//   const handleChangeSecondary = (event, newValues) => {
//     setSelectedValuesSecondary(newValues);
//     // Filter out selected values from the dropdown options
//     const updatedOptions = allOptionsSecondary.filter((option) => !newValues.includes(option));
//     setAllOptionsSecondary(updatedOptions);
//   };
//   const handleDeleteSecondary = (valueToRemove) => {
//     setSelectedValuesSecondary((prev) => prev.filter((val) => val !== valueToRemove));
//     setAllOptionsSecondary((prev) => [...prev, valueToRemove]); // Add back to options
//   };
//   const handleKeyDownSecondary = (event) => {
//     if (event.key === "Enter") {
//       event.preventDefault(); // Prevent form submission or default behavior
  
//       const trimmedValue = inputValueS.trim();
//       if (trimmedValue && !selectedValuesSecondary.includes(trimmedValue)) {
//         setSelectedValuesSecondary([...selectedValuesSecondary, trimmedValue]); // Add new value
//         setInputValueS(""); // Reset input field
//       }else{
//         setPopupContentMalert("Duplicate Value");
//         setPopupSeverityMalert("warning");
//         handleClickOpenPopupMalert();
//       }
//     }
//   };

//   // RECONCILE ONCHANGE
//   const handleChangeReconcile = (event, newValues) => {
//     setSelectedValuesReconcile(newValues);
//     // Filter out selected values from the dropdown options
//     const updatedOptions = allOptionsReconcile.filter((option) => !newValues.includes(option));
//     setAllOptionsReconcile(updatedOptions);
//   };
//   const handleDeleteReconcile = (valueToRemove) => {
//     setSelectedValuesReconcile((prev) => prev.filter((val) => val !== valueToRemove));
//     setAllOptionsReconcile((prev) => [...prev, valueToRemove]); // Add back to options
//   };
//   const handleKeyDownReconcile = (event) => {
//     if (event.key === "Enter") {
//       event.preventDefault(); // Prevent form submission or default behavior
  
//       const trimmedValue = inputValueR.trim();
//       if (trimmedValue && !selectedValuesReconcile.includes(trimmedValue)) {
//         setSelectedValuesReconcile([...selectedValuesReconcile, trimmedValue]); // Add new value
//         setInputValueR(""); // Reset input field
//       }else{
//         setPopupContentMalert("Duplicate Value");
//         setPopupSeverityMalert("warning");
//         handleClickOpenPopupMalert();
//       }
//     }
//   };

//   const [allOptionsPrimaryEdit, setAllOptionsPrimaryEdit] = useState([]);
//   const [allOptionsSecondaryEdit, setAllOptionsSecondaryEdit] = useState([]);
//   const [allOptionsReconcileEdit, setAllOptionsReconcileEdit] = useState([]);
  
//   const [selectedValuesPrimaryEdit, setSelectedValuesPrimaryEdit] = useState(["Primary", "First", "Main"]);
//   const [selectedValuesSecondaryEdit, setSelectedValuesSecondaryEdit] = useState(["Secondary", "Second", ]);
//   const [selectedValuesReconcileEdit, setSelectedValuesReconcileEdit] = useState(["Reconciliation", "Reconcile", ]);
//   const [inputValuePE, setInputValuePE] = useState("");
//   const [inputValueSE, setInputValueSE] = useState("");
//   const [inputValueRE, setInputValueRE] = useState("");

//   const handleChangePrimaryEdit = (event, newValues) => {
//     setSelectedValuesPrimaryEdit(newValues);
//     // Filter out selected values from the dropdown options
//     const updatedOptions = allOptionsPrimaryEdit.filter((option) => !newValues.includes(option));
//     setAllOptionsPrimaryEdit(updatedOptions);
//   };
//   const handleDeletePrimaryEdit = (valueToRemove) => {
//     setSelectedValuesPrimaryEdit((prev) => prev.filter((val) => val !== valueToRemove));
//     setAllOptionsPrimaryEdit((prev) => [...prev, valueToRemove]); // Add back to options
//   };
//   const handleKeyDownPrimaryEdit = (event) => {
//     if (event.key === "Enter") {
//       event.preventDefault(); // Prevent form submission or default behavior

//       const trimmedValue = inputValuePE.trim();
//       if (trimmedValue && !selectedValuesPrimary.includes(trimmedValue)) {
//         setSelectedValuesPrimary([...selectedValuesPrimary, trimmedValue]); // Add new value
//         setInputValuePE(""); // Reset input field
//       }else{
//         setPopupContentMalert("Duplicate Value");
//         setPopupSeverityMalert("warning");
//         handleClickOpenPopupMalert();
//       }
//     }
//   };

//   const handleChangeSecondaryEdit = (event, newValues) => {
//     setSelectedValuesSecondaryEdit(newValues);
//     // Filter out selected values from the dropdown options
//     const updatedOptions = allOptionsSecondaryEdit.filter((option) => !newValues.includes(option));
//     setAllOptionsSecondaryEdit(updatedOptions);
//   };
//   const handleDeleteSecondaryEdit = (valueToRemove) => {
//     setSelectedValuesSecondaryEdit((prev) => prev.filter((val) => val !== valueToRemove));
//     setAllOptionsSecondaryEdit((prev) => [...prev, valueToRemove]); // Add back to options
//   };
//   const handleKeyDownSecondaryEdit = (event) => {
//     if (event.key === "Enter") {
//       event.preventDefault(); // Prevent form submission or default behavior
  
//       const trimmedValue = inputValueSE.trim();
//       if (trimmedValue && !selectedValuesSecondaryEdit.includes(trimmedValue)) {
//         setSelectedValuesSecondaryEdit([...selectedValuesSecondaryEdit, trimmedValue]); // Add new value
//         setInputValueSE(""); // Reset input field
//       }else{
//         setPopupContentMalert("Duplicate Value");
//         setPopupSeverityMalert("warning");
//         handleClickOpenPopupMalert();
//       }
//     }
//   };

//   // ReconcileEdit ONCHANGE
//   const handleChangeReconcileEdit = (event, newValues) => {
//     setSelectedValuesReconcileEdit(newValues);
//     // Filter out selected values from the dropdown options
//     const updatedOptions = allOptionsReconcileEdit.filter((option) => !newValues.includes(option));
//     setAllOptionsReconcileEdit(updatedOptions);
//   };
//   const handleDeleteReconcileEdit = (valueToRemove) => {
//     setSelectedValuesReconcileEdit((prev) => prev.filter((val) => val !== valueToRemove));
//     setAllOptionsReconcileEdit((prev) => [...prev, valueToRemove]); // Add back to options
//   };  
//   const handleKeyDownReconcileEdit = (event) => {
//     if (event.key === "Enter") {
//       event.preventDefault(); // Prevent form submission or default behavior
  
//       const trimmedValue = inputValueRE.trim();
//       if (trimmedValue && !selectedValuesReconcileEdit.includes(trimmedValue)) {
//         setSelectedValuesReconcileEdit([...selectedValuesReconcileEdit, trimmedValue]); // Add new value
//         setInputValueRE(""); // Reset input field
//       }else{
//         setPopupContentMalert("Duplicate Value");
//         setPopupSeverityMalert("warning");
//         handleClickOpenPopupMalert();
//       }
//     }
//   };


//   const [inputValueBulkP, setInputValueBulkP] = useState("");
//   const [inputValueBulkS, setInputValueBulkS] = useState("");
//   const [inputValueBulkR, setInputValueBulkR] = useState("");

//   const [selectedValuesPrimaryBulk, setSelectedValuesPrimaryBulk] = useState(defaultSelectedPrimary);
//   const [allOptionsPrimaryBulk, setAllOptionsPrimaryBulk] = useState(
//     ["Primary", "First",].filter(
//       (option) => !defaultSelectedPrimary.includes(option) // Remove defaults from options
//     )
//   );
  
//   const [selectedValuesSecondaryBulk, setSelectedValuesSecondaryBulk] = useState(defaultSelectedSecondary);
//   const [allOptionsSecondaryBulk, setAllOptionsSecondaryBulk] = useState(
//     ["Secondary", "Second",].filter(
//       (option) => !defaultSelectedSecondary.includes(option) // Remove defaults from options
//     )
//   );
  
//   const [selectedValuesReconcileBulk, setSelectedValuesReconcileBulk] = useState(defaultSelectedReconcile);
//   const [allOptionsReconcileBulk, setAllOptionsReconcileBulk] = useState(
//     ["Reconcile", "Reconcililation",].filter(
//       (option) => !defaultSelectedReconcile.includes(option) // Remove defaults from options
//     )
//   );



//   const handleChangePrimaryBulk = (event, newValues) => {
//     setSelectedValuesPrimaryBulk(newValues);
//     // Filter out selected values from the dropdown options
//     const updatedOptions = allOptionsPrimaryBulk.filter((option) => !newValues.includes(option));
//     setAllOptionsPrimaryBulk(updatedOptions);
//   };
//   const handleDeletePrimaryBulk = (valueToRemove) => {
//     setSelectedValuesPrimaryBulk((prev) => prev.filter((val) => val !== valueToRemove));
//     setAllOptionsPrimaryBulk((prev) => [...prev, valueToRemove]); // Add back to options
//   };
//   const handleKeyDownPrimaryBulk = (event) => {
//     if (event.key === "Enter") {
//       event.preventDefault(); // Prevent form submission or default behavior
  
//       const trimmedValue = inputValueBulkP.trim();
//       if (trimmedValue && !selectedValuesPrimary.includes(trimmedValue)) {
//         setSelectedValuesPrimary([...selectedValuesPrimary, trimmedValue]); // Add new value
//         setInputValueBulkP(""); // Reset input field
//       }else{
//         setPopupContentMalert("Duplicate Value");
//         setPopupSeverityMalert("warning");
//         handleClickOpenPopupMalert();
//       }
//     }
//   };
  
//   const handleChangeSecondaryBulk = (event, newValues) => {
//     setSelectedValuesSecondaryBulk(newValues);
//     // Filter out selected values from the dropdown options
//     const updatedOptions = allOptionsSecondaryBulk.filter((option) => !newValues.includes(option));
//     setAllOptionsSecondaryBulk(updatedOptions);
//   };
//   const handleDeleteSecondaryBulk = (valueToRemove) => {
//     setSelectedValuesSecondaryBulk((prev) => prev.filter((val) => val !== valueToRemove));
//     setAllOptionsSecondaryBulk((prev) => [...prev, valueToRemove]); // Add back to options
//   };
//   const handleKeyDownSecondaryBulk = (event) => {
//     if (event.key === "Enter") {
//       event.preventDefault(); // Prevent form submission or default behavior
  
//       const trimmedValue = inputValueBulkS.trim();
//       if (trimmedValue && !selectedValuesSecondaryBulk.includes(trimmedValue)) {
//         setSelectedValuesSecondaryBulk([...selectedValuesSecondaryBulk, trimmedValue]); // Add new value
//         setInputValueBulkS(""); // Reset input field
//       }else{
//         setPopupContentMalert("Duplicate Value");
//         setPopupSeverityMalert("warning");
//         handleClickOpenPopupMalert();
//       }
//     }
//   };
  
//   // ReconcileBulk ONCHANGE
//   const handleChangeReconcileBulk = (event, newValues) => {
//     setSelectedValuesReconcileBulk(newValues);
//     // Filter out selected values from the dropdown options
//     const updatedOptions = allOptionsReconcileBulk.filter((option) => !newValues.includes(option));
//     setAllOptionsReconcileBulk(updatedOptions);
//   };
//   const handleDeleteReconcileBulk = (valueToRemove) => {
//     setSelectedValuesReconcileBulk((prev) => prev.filter((val) => val !== valueToRemove));
//     setAllOptionsReconcileBulk((prev) => [...prev, valueToRemove]); // Add back to options
//   };  
//   const handleKeyDownReconcileBulk = (event) => {
//     if (event.key === "Enter") {
//       event.preventDefault(); // Prevent form submission or default behavior
  
//       const trimmedValue = inputValueBulkR.trim();
//       if (trimmedValue && !selectedValuesReconcileBulk.includes(trimmedValue)) {
//         setSelectedValuesReconcileBulk([...selectedValuesReconcileBulk, trimmedValue]); // Add new value
//         setInputValueBulkR(""); // Reset input field
//       }else{
//         setPopupContentMalert("Duplicate Value");
//         setPopupSeverityMalert("warning");
//         handleClickOpenPopupMalert();
//       }
//     }
//   };
//PRIMARY KEYWORDMRATE TODO
const [primary, setPrimary] = useState([]);
const [editingIndexPrimary, setEditingIndexPrimary] = useState(-1);
const [newKeywordPrimaryEdit, setNewKeywordPrimaryEdit] = useState("");
const [newMratePrimaryEdit, setNewMratePrimaryEdit] = useState("");
const [newMatchCasePrimaryEdit, setNewMatchCasePrimaryEdit] = useState("");
const [errormsgeditcheckPrimary, seterrormsgeditcheckPrimary] = useState("");
const [errormsgeditcheckmratePrimary, seterrormsgeditcheckmratePrimary] = useState("");
const [errormsgeditPrimary, seterrormsgeditPrimary] = useState("");

const handleCreatePrimary = () => {
  
  if (category.matchcase !== "Default" &&  category.keywordprimary == "" && (category.mrateprimary == "" ||category.mrateprimary == 0)) {
    seterrormsgeditcheckPrimary("Please Enter Keyword");
    seterrormsgeditcheckmratePrimary("Please Enter Mrate")
  }else if (category.matchcase !== "Default" && category.keywordprimary == "") {
    seterrormsgeditcheckPrimary("Please Enter Keyword");
  }else if ((category.mrateprimary == "" ||category.mrateprimary == 0)) {
    seterrormsgeditcheckmratePrimary("Please Enter Mrate")
  }else if (isNaN(category.mrateprimary )) {
    seterrormsgeditcheckmratePrimary("Please Enter Valid Mrate")
  }else if (Number(category.mrateprimary ) < 0) {
    seterrormsgeditcheckmratePrimary("Please Enter Valid Mrate")
  }
  else{
    const isDuplicate = primary.some((todo) => todo.keyword.toLowerCase() === category.keywordprimary.toLowerCase());
    const isDupedafulat = primary.some((todo) =>( todo.matchcase === "Default" && category.matchcase=== "Default" ))

    if (!isDuplicate) {
      const newcheckTodocheck = {
        keyword: category.keywordprimary,
        mrate: category.mrateprimary,
        matchcase: category.matchcase,
      };
      setPrimary([...primary, newcheckTodocheck]);
      setCategory({ ...category, keywordprimary: "",mrateprimary:""});
      seterrormsgeditcheckPrimary("");
      seterrormsgeditcheckmratePrimary("")
      seterrormsgeditPrimary("");
    } else {
      seterrormsgeditcheckPrimary(isDupedafulat ? "Already Default value added" : "Already this keyword added");
    }
  } 
};

const handleEditPrimary = (index) => {
  setEditingIndexPrimary(index);
  setNewKeywordPrimaryEdit(primary[index].keyword);
  setNewMratePrimaryEdit(primary[index].mrate);
  setNewMatchCasePrimaryEdit(primary[index].matchcase);
};

const handleUpdatePrimary = () => {
 
   
    if (newKeywordPrimaryEdit === "" ) {
      seterrormsgeditPrimary("Please Enter Keyword");
    }else if (newMratePrimaryEdit === "" ) {
      seterrormsgeditPrimary("Please Enter Mrate");
    } else if (primary.find((todo, index) => index !== editingIndexPrimary && todo.keyword.toLowerCase() === newKeywordPrimaryEdit.toLowerCase())) {
      seterrormsgeditPrimary("Already this keyword added");
    }  else  if (isNaN(newMratePrimaryEdit) ) {
      seterrormsgeditPrimary("Please Enter Valid Mrate");
    } else  if (Number(newMratePrimaryEdit) < 0 ) {
      seterrormsgeditPrimary("Please Enter Valid Mrate");
    }  else {  
      const keyword = newKeywordPrimaryEdit;
      const mrate = newMratePrimaryEdit;
      const matchcase = newMatchCasePrimaryEdit;
      const newTodoscheck = [...primary];
      newTodoscheck[editingIndexPrimary].keyword = keyword;
      newTodoscheck[editingIndexPrimary].mrate = mrate;
      newTodoscheck[editingIndexPrimary].matchcase = matchcase;
      setPrimary(newTodoscheck);
      setEditingIndexPrimary(-1);
      seterrormsgeditPrimary("");
      setNewKeywordPrimaryEdit("");
      setNewMratePrimaryEdit("")
      setNewMatchCasePrimaryEdit("")
    }
 
};

const handleDeletePrimary = (index) => {
  const newcheckPrimary = [...primary];
  newcheckPrimary.splice(index, 1);
  setPrimary(newcheckPrimary);
};

// PRIMARY EDIT
const [primaryEdit, setPrimaryEdit] = useState([]);
const [editingIndexPrimaryEdit, setEditingIndexPrimaryEdit] = useState(-1);
const [newKeywordPrimaryEditEdit, setNewKeywordPrimaryEditEdit] = useState("");
const [newMratePrimaryEditEdit, setNewMratePrimaryEditEdit] = useState("");
const [newMatchCasePrimaryEditEdit, setNewMatchCasePrimaryEditEdit] = useState("");
const [errormsgeditcheckPrimaryEdit, seterrormsgeditcheckPrimaryEdit] = useState("");
const [errormsgeditcheckmratePrimaryEdit, seterrormsgeditcheckmratePrimaryEdit] = useState("");
const [errormsgeditPrimaryEdit, seterrormsgeditPrimaryEdit] = useState("");

const handleCreatePrimaryEdit = () => {
  
  if (categoryid.matchcase !== "Default" && categoryid.keywordprimary == "" && (categoryid.mrateprimary== "" ||categoryid.mrateprimary == 0)) {
    seterrormsgeditcheckPrimaryEdit("Please Enter Keyword");
    seterrormsgeditcheckmratePrimaryEdit("Please Enter Mrate")
  }else if (categoryid.matchcase !== "Default" && categoryid.keywordprimary == "") {
    seterrormsgeditcheckPrimaryEdit("Please Enter Keyword");
  }else if ((categoryid.mrateprimary == "" ||categoryid.mrateprimary == 0)) {
    seterrormsgeditcheckmratePrimaryEdit("Please Enter Mrate")
  }else if (isNaN(categoryid.mrateprimary )) {
    seterrormsgeditcheckmratePrimaryEdit("Please Enter Valid Mrate")
  }else if (Number(categoryid.mrateprimary ) < 0) {
    seterrormsgeditcheckmratePrimaryEdit("Please Enter Valid Mrate")
  }
  else{
    const isDuplicate = primaryEdit.some((todo) =>( todo.matchcase === "Default" && categoryid.matchcase=== "Default" )|| todo.keyword?.toLowerCase() === categoryid.keywordprimary?.toLowerCase());
    const isDupedafulat = primaryEdit.some((todo) =>( todo.matchcase === "Default" && categoryid.matchcase=== "Default" ))
    if (!isDuplicate) {
      const newcheckTodocheck = {
        keyword: categoryid.keywordprimary,
        mrate: categoryid.mrateprimary,
        matchcase: categoryid.matchcase,
      };
      setPrimaryEdit([...primaryEdit, newcheckTodocheck]);
      setCategoryid({ ...categoryid, keywordprimary: "",mrateprimary:"" });
      seterrormsgeditcheckPrimaryEdit("");
      seterrormsgeditcheckmratePrimaryEdit("")
      seterrormsgeditPrimaryEdit("");
    } else {
      seterrormsgeditcheckPrimaryEdit(isDupedafulat ? "Already Default value added" : "Already this keyword added");
    }
  } 
};

const handleEditPrimaryEdit = (index) => {
  setEditingIndexPrimaryEdit(index);
  setNewKeywordPrimaryEditEdit(primaryEdit[index].keyword);
  setNewMratePrimaryEditEdit(primaryEdit[index].mrate);
  setNewMatchCasePrimaryEditEdit(primaryEdit[index].matchcase);
};

const handleUpdatePrimaryEdit = () => {
 
   
    if (newKeywordPrimaryEditEdit === "" ) {
      seterrormsgeditPrimaryEdit("Please Enter Keyword");
    }else if (newMratePrimaryEditEdit === "" ) {
      seterrormsgeditPrimaryEdit("Please Enter Mrate");
    } else if (primaryEdit.find((todo, index) => index !== editingIndexPrimaryEdit && todo.keyword.toLowerCase() === newKeywordPrimaryEditEdit.toLowerCase())) {
      seterrormsgeditPrimaryEdit("Already this keyword added");
    }  else  if (isNaN(newMratePrimaryEditEdit) ) {
      seterrormsgeditPrimaryEdit("Please Enter Valid Mrate");
    } else  if (Number(newMratePrimaryEditEdit) < 0 ) {
      seterrormsgeditPrimaryEdit("Please Enter Valid Mrate");
    }  else {  
      const keyword = newKeywordPrimaryEditEdit;
      const mrate = newMratePrimaryEditEdit;
      const matchcase = newMatchCasePrimaryEditEdit;
      const newTodoscheck = [...primaryEdit];
      newTodoscheck[editingIndexPrimaryEdit].keyword = keyword;
      newTodoscheck[editingIndexPrimaryEdit].mrate = mrate;
      newTodoscheck[editingIndexPrimaryEdit].matchcase = matchcase;
      setPrimaryEdit(newTodoscheck);
      setEditingIndexPrimaryEdit(-1);
      seterrormsgeditPrimaryEdit("");
      setNewKeywordPrimaryEditEdit("");
      setNewMratePrimaryEditEdit("")
      setNewMatchCasePrimaryEditEdit("")
    }
 
};

const handleDeletePrimaryEdit = (index) => {
  const newcheckPrimaryEdit = [...primaryEdit];
  newcheckPrimaryEdit.splice(index, 1);
  setPrimaryEdit(newcheckPrimaryEdit);
};

// const [secondary, setSecondary] = useState([]);
// const [editingIndexSecondary, setEditingIndexSecondary] = useState(-1);
// const [newKeywordSecondaryEdit, setNewKeywordSecondaryEdit] = useState("");
// const [newMrateSecondaryEdit, setNewMrateSecondaryEdit] = useState("");
// const [errormsgeditcheckSecondary, seterrormsgeditcheckSecondary] = useState("");
// const [errormsgeditcheckmrateSecondary, seterrormsgeditcheckmrateSecondary] = useState("");
// const [errormsgeditSecondary, seterrormsgeditSecondary] = useState("");

// const handleCreateSecondary = () => {
  
//   if (category.keywordsecondary == "" && (category.mratesecondary == "" ||category.mratesecondary == 0)) {
//     seterrormsgeditcheckSecondary("Please Enter Keyword");
//     seterrormsgeditcheckmrateSecondary("Please Enter Mrate")
//   }else if (category.keywordsecondary == "") {
//     seterrormsgeditcheckSecondary("Please Enter Keyword");
//   }else if ((category.mratesecondary == "" ||category.mratesecondary == 0)) {
//     seterrormsgeditcheckmrateSecondary("Please Enter Mrate")
//   }else if (isNaN(category.mratesecondary )) {
//     seterrormsgeditcheckmrateSecondary("Please Enter Valid Mrate")
//   }else if (Number(category.mratesecondary ) < 0) {
//     seterrormsgeditcheckmrateSecondary("Please Enter Valid Mrate")
//   }
//   else{
//     const isDuplicate = secondary.some((todo) => todo.keyword.toLowerCase() === category.keywordsecondary.toLowerCase());

//     if (!isDuplicate) {
//       const newcheckTodocheck = {
//         keyword: category.keywordsecondary,
//         mrate: category.mratesecondary,
//       };
//       setSecondary([...secondary, newcheckTodocheck]);
//       setCategory({ ...category, keywordsecondary: "",mratesecondary:"" });
//       seterrormsgeditcheckSecondary("");
//       seterrormsgeditcheckmrateSecondary("")
//       seterrormsgeditSecondary("");
//     } else {
//       seterrormsgeditcheckSecondary("Already this keyword added");
//     }
//   } 
// };

// const handleEditSecondary = (index) => {
//   setEditingIndexSecondary(index);
//   setNewKeywordSecondaryEdit(secondary[index].keyword);
//   setNewMrateSecondaryEdit(secondary[index].mrate);
// };

// const handleUpdateSecondary = () => {
 
   
//     if (newKeywordSecondaryEdit === "" ) {
//       seterrormsgeditSecondary("Please Enter Keyword");
//     }else if (newMrateSecondaryEdit === "" ) {
//       seterrormsgeditSecondary("Please Enter Mrate");
//     } else if (secondary.find((todo, index) => index !== editingIndexSecondary && todo.keyword.toLowerCase() === newKeywordSecondaryEdit.toLowerCase())) {
//       seterrormsgeditSecondary("Already this keyword added");
//     }  else  if (isNaN(newMrateSecondaryEdit) ) {
//       seterrormsgeditSecondary("Please Enter Valid Mrate");
//     } else  if (Number(newMrateSecondaryEdit) < 0 ) {
//       seterrormsgeditSecondary("Please Enter Valid Mrate");
//     }  else {  
//       const keyword = newKeywordSecondaryEdit;
//       const mrate = newMrateSecondaryEdit;
//       const newTodoscheck = [...secondary];
//       newTodoscheck[editingIndexSecondary].keyword = keyword;
//       newTodoscheck[editingIndexSecondary].mrate = mrate;
//       setSecondary(newTodoscheck);
//       setEditingIndexSecondary(-1);
//       seterrormsgeditSecondary("");
//       setNewKeywordSecondaryEdit("");
//       setNewMrateSecondaryEdit("")
//     }
 
// };

// const handleDeleteSecondary = (index) => {
//   const newcheckSecondary = [...secondary];
//   newcheckSecondary.splice(index, 1);
//   setSecondary(newcheckSecondary);
// };


// const [reconcile, setReconcile] = useState([]);
// const [editingIndexReconcile, setEditingIndexReconcile] = useState(-1);
// const [newKeywordReconcileEdit, setNewKeywordReconcileEdit] = useState("");
// const [newMrateReconcileEdit, setNewMrateReconcileEdit] = useState("");
// const [errormsgeditcheckReconcile, seterrormsgeditcheckReconcile] = useState("");
// const [errormsgeditcheckmrateReconcile, seterrormsgeditcheckmrateReconcile] = useState("");
// const [errormsgeditReconcile, seterrormsgeditReconcile] = useState("");

// const handleCreateReconcile = () => {
  
//   if (category.keywordreconcile == "" && (category.mratereconcile == "" ||category.mratereconcile == 0)) {
//     seterrormsgeditcheckReconcile("Please Enter Keyword");
//     seterrormsgeditcheckmrateReconcile("Please Enter Mrate")
//   }else if (category.keywordreconcile == "") {
//     seterrormsgeditcheckReconcile("Please Enter Keyword");
//   }else if ((category.mratereconcile == "" ||category.mratereconcile == 0)) {
//     seterrormsgeditcheckmrateReconcile("Please Enter Mrate")
//   }else if (isNaN(category.mratereconcile )) {
//     seterrormsgeditcheckmrateReconcile("Please Enter Valid Mrate")
//   }else if (Number(category.mratereconcile ) < 0) {
//     seterrormsgeditcheckmrateReconcile("Please Enter Valid Mrate")
//   }
//   else{
//     const isDuplicate = reconcile.some((todo) => todo.keyword.toLowerCase() === category.keywordreconcile.toLowerCase());

//     if (!isDuplicate) {
//       const newcheckTodocheck = {
//         keyword: category.keywordreconcile,
//         mrate: category.mratereconcile,
//       };
//       setReconcile([...reconcile, newcheckTodocheck]);
//       setCategory({ ...category, keywordreconcile: "",mratereconcile:"" });
//       seterrormsgeditcheckReconcile("");
//       seterrormsgeditcheckmrateReconcile("")
//       seterrormsgeditReconcile("");
//     } else {
//       seterrormsgeditcheckReconcile("Already this keyword added");
//     }
//   } 
// };

// const handleEditReconcile = (index) => {
//   setEditingIndexReconcile(index);
//   setNewKeywordReconcileEdit(reconcile[index].keyword);
//   setNewMrateReconcileEdit(reconcile[index].mrate);
// };

// const handleUpdateReconcile = () => {
 
   
//     if (newKeywordReconcileEdit === "" ) {
//       seterrormsgeditReconcile("Please Enter Keyword");
//     }else if (newMrateReconcileEdit === "" ) {
//       seterrormsgeditReconcile("Please Enter Mrate");
//     } else if (reconcile.find((todo, index) => index !== editingIndexReconcile && todo.keyword.toLowerCase() === newKeywordReconcileEdit.toLowerCase())) {
//       seterrormsgeditReconcile("Already this keyword added");
//     }  else  if (isNaN(newMrateReconcileEdit) ) {
//       seterrormsgeditReconcile("Please Enter Valid Mrate");
//     } else  if (Number(newMrateReconcileEdit) < 0 ) {
//       seterrormsgeditReconcile("Please Enter Valid Mrate");
//     }  else {  
//       const keyword = newKeywordReconcileEdit;
//       const mrate = newMrateReconcileEdit;
//       const newTodoscheck = [...reconcile];
//       newTodoscheck[editingIndexReconcile].keyword = keyword;
//       newTodoscheck[editingIndexReconcile].mrate = mrate;
//       setReconcile(newTodoscheck);
//       setEditingIndexReconcile(-1);
//       seterrormsgeditReconcile("");
//       setNewKeywordReconcileEdit("");
//       setNewMrateReconcileEdit("")
//     }
 
// };

// const handleDeleteReconcile = (index) => {
//   const newcheckReconcile = [...reconcile];
//   newcheckReconcile.splice(index, 1);
//   setReconcile(newcheckReconcile);
// };




  let exportColumnNames = ["Project Name", "Name", "Flag Status", "Enable Page", "Flag Status Org", "Flag Calc Manual Org", "Flag Status Temp", "Flag Calc Manual Temp", "KeyWwords"];
  let exportRowValues = ["project", "name", "flagstatus", "enablepage", "flagstatusorg", "flagmanualcalcorg", "flagstatustemp", "flagmanualcalctemp", "keyword"];

  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowsCate, setSelectedRowsCate] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState({
    name: "",
    keyword: "",
    project: "",
    flagmanualcalctemp: "",
    flagmanualcalcorg: "",
    mrateprimary:0,
    mratesecondary:0,
    mratereconcile:0,
    enablepage: false,
    matchcase:"Contains"
  });
  const [categoryid, setCategoryid] = useState({ name: "", project: "", flagmanualcalctemp: "", flagmanualcalcorg: "", enablepage: false , matchcase:"Contains"});
  const [categories, setCategories] = useState([]);
  const [selectedProject, setSelectedProject] = useState("Please Select Project");
  const [selectedProjectedit, setSelectedProjectedit] = useState("");
  const [allModuleedit, setAllModuleedit] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isBtn, setIsBtn] = useState(false);

  const [selectedFlag, setSelectedFlag] = useState("No");
  const [selectedFlagOrg, setSelectedFlagOrg] = useState("No");
  const [selectedFlagTemp, setSelectedFlagTemp] = useState("No");

  const [selectedFlagEdit, setSelectedFlagEdit] = useState("");
  const [selectedFlagEditOrg, setSelectedFlagEditOrg] = useState("");
  const [selectedFlagEditTemp, setSelectedFlagEditTemp] = useState("");

  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
  const [copiedData, setCopiedData] = useState("");

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  const [categoryBulk, setCategoryBulk] = useState({mrateprimary:"",mratesecondary:"",mratereconcile:"" })

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };
  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };


  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Production Category.png");
        });
      });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  const CustomStyledDataGrid = styled(StyledDataGrid)(({ theme }) => ({
    "& .MuiDataGrid-columnHeaderTitle": {
      fontSize: "14px",
      fontWeight: "bold !important",
      lineHeight: "15px",
      whiteSpace: "normal", // Wrap text within the available space
      overflow: "visible", // Allow overflowed text to be visible
      minWidth: "20px",
    },
    "& .MuiDataGrid-columnHeaders": {
      minHeight: "55px !important",
      // background: "#b7b3b347",
      maxHeight: "55px",
    },
    "& .MuiDataGrid-row": {
      fontSize: "12px", // Change the font size for row data
      minWidth: "20px",
      color: "#444",
    },
    "& .MuiDataGrid-cell": {
      whiteSpace: "normal !important",
      wordWrap: "break-word !important",
      lineHeight: "1.2 !important", // Optional: Adjusts line height for better readability
    },
  }));

  const flags = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ];

  //OVERALL EDIT FUNCTIONALITY
  const [vendors, setVendors] = useState([]);
  const username = isUserRoleAccess.username;
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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

  // view model
  const [openview, setOpenview] = useState(false);
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };

  //BULK EDIT model
  const [isEditBulkOpen, setIsEditBulkOpen] = useState({ open: false, data: [] });
  const handleClickBulkEditOpen = (data) => {
    setIsEditBulkOpen({ open: true, data: data });
  };
  const handleCloseBulkEditMod = () => {
    setIsEditBulkOpen({ open: false, data: [] });
  };

  //Delete model
  const [isDeleteBulkNotLinkedOpen, setisDeleteBulkNotLinkedOpen] = useState({ open: false, data: [] });
  const handleClickBulkNotLinkedOpen = (data) => {
    setisDeleteBulkNotLinkedOpen({ open: true, data: data });
  };
  const handleCloseBulkNotLinkedClose = () => {
    setisDeleteBulkNotLinkedOpen({ open: false, data: [] });
  };

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  const handleClickOpenalert = async () => {
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      let res = await axios.post(SERVICE.CATEGORY_OVERALL_CHECK_BULKDELETE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        projectcategory: selectedRowsCate,
      });
      if (res.data.count === 0) {
        setIsDeleteOpencheckbox(true);
      } else {
        let subcategorylinks = [...new Set(res.data.subcategory.map((item) => item.categoryname))];
        let unitratelinks = [...new Set(res.data.unitrate.map((item) => item.category))];

        // Combine both arrays
        let combinedArray = [...res.data.subcategory.map((item) => ({ ...item, category: item.categoryname })), ...res.data.unitrate];

        // Create a helper function to generate a unique key based on the fields
        const createKey = (item) => `${item.project}-${item.category}`;

        // Use a Set to filter out duplicates based on the key
        let allcategoriesLinked = Array.from(new Map(combinedArray.map((item) => [createKey(item), item])).values());

        // Combine both arrays into one (you can keep them separate later if needed)
        let combinedArrayNon = [...allcategoriesLinked, ...selectedRowsCate];

        // Create a Map to track occurrences
        let keyCount = combinedArrayNon.reduce((acc, item) => {
          const key = createKey(item);
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {});

        // Find non-duplicates by filtering out keys that appear more than once
        const nonDupeSelectedCategories = combinedArrayNon.filter((item) => keyCount[createKey(item)] === 1);

        // Check if both arrays have the same length and the categories are linked properly
        const areCategoriesLinked = subcategorylinks.length === unitratelinks.length && subcategorylinks.every((item) => unitratelinks.includes(item)) && unitratelinks.every((item) => subcategorylinks.includes(item));

        if (areCategoriesLinked) {
          const Cates = subcategorylinks.length === 1 ? `This ${subcategorylinks.join(", ")} Category linked in Subcategory and Unitrate` : `These ${subcategorylinks.join(", ")} Categories linked in Subcategory and Unitrate`;

          if (nonDupeSelectedCategories.length > 0) {
            setShowAlert(`${Cates},  Do you want Delete Others ?`);
            handleClickBulkNotLinkedOpen(nonDupeSelectedCategories);
          } else {
            setPopupContentMalert(Cates);
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
          }
        } else {
          const SubCates = subcategorylinks.length === 1 ? `This ${subcategorylinks.join(", ")} Category linked in Subcategory` : `These ${subcategorylinks.join(", ")} Categories linked in Subcategory`;

          const unitrates = unitratelinks.length === 1 ? `This ${unitratelinks.join(", ")} Category linked in Unitrate` : `These ${unitratelinks.join(", ")} Categories linked in Unitrate`;
          if (nonDupeSelectedCategories.length > 0) {
            setShowAlert(`${SubCates} ${unitrates} Do you want Delete Others ?`);
            handleClickBulkNotLinkedOpen();
          } else {
            setPopupContentMalert(`${SubCates} ${unitrates}`);
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
          }
        }
      }
    }
  };
  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };

  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  };

  //set function to get particular row
  const [deletemodule, setDeletemodule] = useState({});
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
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
    project: true,
    name: true,
    flagstatus: true,
    mismatchmode: true,
    actions: true,
    keyword: true,
    flagstatusorg: true,
    enablepage: true,
    flagmanualcalctemp: true,
    flagmanualcalcorg: true,
    flagstatustemp: true,
    mrateprimary: true,
    mratesecondary: true,
    mratereconcile: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  const rowData = async (id, name, project) => {
    try {
      let res = await axios.post(SERVICE.CATEGORY_OVERALL_CHECK_DELETE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        category: name,
        project: project,
      });

      if (res.data.count === 0) {
        setPageName(!pageName);
        try {
          let res = await axios.get(`${SERVICE.CATEGORYPROD_SINGLE}/${id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          });
          setDeletemodule(res?.data?.scategoryprod);

          handleClickOpen();
        } catch (err) {
          handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
      } else {
        setPopupContentMalert(`This ${name} Category linked in ` + (res.data.subcategorycount > 0 && res.data.unitratecount > 0 ? "Subcategory and Unitrate" : res.data.subcategorycount > 0 ? "Subcategory" : "Unitrate"));
        setPopupSeverityMalert("warning");
        handleClickOpenPopupMalert();
      }
    } catch (err) {
      console.log(err);
    }
  };
  //fetching Project for Dropdowns
  const fetchProjectDropdowns = async () => {
    setPageName(!pageName);
    try {
      let res_project = await axios.get(SERVICE.PROJECTMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const projall = [
        ...res_project?.data?.projmaster.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setProjects(projall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // Alert delete popup
  let categoriesexcelid = deletemodule._id;
  const delModule = async () => {
    setPageName(!pageName);
    try {
      await axios.delete(`${SERVICE.CATEGORYPROD_SINGLE}/${categoriesexcelid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchEmployee();
      await fetchAllCategory();
      setPage(1);
      setSelectedRows([]);
      setSelectedRowsCate([]);
      handleCloseMod();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const delProjectcheckbox = async () => {
    setPageName(!pageName);
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.CATEGORYPROD_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });
      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
      await fetchEmployee();
      await fetchAllCategory();
      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectedRowsCate([]);
      setSelectAllChecked(false);
      setPage(1);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //add function...
  const sendRequest = async () => {
    setIsBtn(true);
    setPageName(!pageName);
    try {
      await axios.post(SERVICE.CATEGORYPROD_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        project: String(selectedProject),
        name: String(category.name),
        enablepage: Boolean(category.enablepage),
        flagstatus: String(selectedFlag),
        flagstatusorg: String(selectedFlagOrg),
        flagstatustemp: String(selectedFlagTemp),
        flagmanualcalctemp: String(category.flagmanualcalctemp),
        flagmanualcalcorg: String(category.flagmanualcalcorg),
        keyword: [...todoscheckall.map((item) => item.keyword)],
        mrateprimary:primary,
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await axios.post(SERVICE.TIMEPOINTS_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        project: String(selectedProject),
        category: String(category.name),
        subcategory: String("ALL"),
        time: String("00:00:00"),
        rate: Number(0),
        ratetopoints: Number("8.333333333333333").toFixed(14),
        points: Number(0),
        state: String("ALL"),
        flagcount: Number(1).toFixed(3),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchEmployee();
      await fetchAllCategory();
      setCategory({
        name: "",
        keyword: "",
        flagmanualcalctemp: "",
        flagmanualcalcorg: "",
        enablepage: false,
        mrateprimary:0,
        mratesecondary:0,
        mratereconcile:0,
      });
      setPrimary([])
      setSelectedFlag("No");
      setSelectedFlagOrg("No");
      setSelectedFlagTemp("No");
      setTodoscheckall([]);
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setIsBtn(false);
    } catch (err) {
      setIsBtn(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [todoscheckall, setTodoscheckall] = useState([]);
  const [editingIndexcheckall, setEditingIndexcheckall] = useState(-1);
  const [newcheckKeyEdit, setNewcheckKeyEdit] = useState("");
  const [errormsgeditcheck, seterrormsgeditcheck] = useState("");
  const [errormsgeditcheckall, seterrormsgeditcheckall] = useState("");

  const handleCreateTodocheckeditall = () => {
    if (category.keyword !== "") {
      const isDuplicate = todoscheckall.some((todo) => todo.keyword.toLowerCase() === category.keyword.toLowerCase());

      if (!isDuplicate) {
        const newcheckTodocheck = {
          keyword: category.keyword,
        };
        setTodoscheckall([...todoscheckall, newcheckTodocheck]);
        setCategory({ ...category, keyword: "" });
        seterrormsgeditcheck("");
        seterrormsgeditcheckall("");
      } else {
        setPopupContentMalert("Already this keyword added");
        setPopupSeverityMalert("warning");
        handleClickOpenPopupMalert();
        // seterrormsgeditcheck("Already this keyword added");
      }
    } else {
      seterrormsgeditcheck("Please Enter Keyword");
    }
  };

  const handleEditTodocheckall = (index) => {
    setEditingIndexcheckall(index);
    setNewcheckKeyEdit(todoscheckall[index].keyword);
  };

  const handleUpdateTodocheckall = () => {
    if (newcheckKeyEdit !== "") {
      const keyword = newcheckKeyEdit;
      if (!todoscheckall.find((todo, index) => index !== editingIndexcheckall && todo.keyword.toLowerCase() === newcheckKeyEdit.toLowerCase())) {
        const newTodoscheck = [...todoscheckall];
        newTodoscheck[editingIndexcheckall].keyword = keyword;
        setTodoscheckall(newTodoscheck);
        setEditingIndexcheckall(-1);
        seterrormsgeditcheckall("");
        setNewcheckKeyEdit("");
      } else {
        setPopupContentMalert("Already this keyword added");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
        // seterrormsgeditcheckall("Already this keyword added");
      }
    } else {
      seterrormsgeditcheckall("Please Enter Keyword");
    }
  };

  const handleDeleteTodocheckeditall = (index) => {
    const newcheckTodoscheckall = [...todoscheckall];
    newcheckTodoscheckall.splice(index, 1);
    setTodoscheckall(newcheckTodoscheckall);
  };

  const [todoscheckallEdit, setTodoscheckallEdit] = useState([]);
  const [editingIndexcheckallEdit, setEditingIndexcheckallEdit] = useState(-1);
  const [newcheckKeyEditPop, setNewcheckKeyEditPop] = useState("");
  const [errormsgeditcheckEdit, seterrormsgeditcheckEdit] = useState("");
  const [errormsgeditcheckallEdit, seterrormsgeditcheckallEdit] = useState("");

  const handleCreateTodocheckeditallEdit = () => {
    if (categoryid.keyword !== "") {
      const isDuplicate = todoscheckallEdit.some((todo) => todo.keyword.toLowerCase() === categoryid.keyword.toLowerCase());

      if (!isDuplicate) {
        const newcheckTodocheck = {
          keyword: categoryid.keyword,
        };
        setTodoscheckallEdit([...todoscheckallEdit, newcheckTodocheck]);
        setCategoryid({ ...categoryid, keyword: "" });
        seterrormsgeditcheckEdit("");
        seterrormsgeditcheckallEdit("");
      } else {
        setPopupContentMalert("Already this keyword added");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
        // seterrormsgeditcheckEdit("Already this keyword added");
      }
    } else {
      seterrormsgeditcheckEdit("Please Enter Keyword");
    }
  };

  const handleEditTodocheckallEdit = (index) => {
    setEditingIndexcheckallEdit(index);
    setNewcheckKeyEditPop(todoscheckallEdit[index].keyword);
  };

  const handleUpdateTodocheckallEdit = () => {
    if (newcheckKeyEditPop !== "") {
      const keyword = newcheckKeyEditPop;
      if (!todoscheckallEdit.find((todo, index) => index !== editingIndexcheckallEdit && todo.keyword.toLowerCase() === newcheckKeyEditPop.toLowerCase())) {
        const newTodoscheck = [...todoscheckallEdit];
        newTodoscheck[editingIndexcheckallEdit].keyword = keyword;
        setTodoscheckallEdit(newTodoscheck);
        setEditingIndexcheckallEdit(-1);
        seterrormsgeditcheckEdit("");
        seterrormsgeditcheckallEdit("");
        setNewcheckKeyEditPop("");
      } else {
        setPopupContentMalert("Already this keyword added");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
        // seterrormsgeditcheckallEdit("Already this keyword added");
      }
    } else {
      seterrormsgeditcheckallEdit("Please Enter Keyword");
    }
  };

  const handleDeleteTodocheckeditallEdit = (index) => {
    const newcheckTodoscheckall = [...todoscheckallEdit];
    newcheckTodoscheckall.splice(index, 1);
    setTodoscheckallEdit(newcheckTodoscheckall);
  };

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    const isNameMatch = categoriesDup?.some((item) => item?.name?.toLowerCase() === category?.name?.toLowerCase() && item.project?.toLowerCase() === selectedProject?.toLowerCase());

    if (selectedProject === "" || selectedProject === "Please Select Project") {
      setPopupContentMalert("Please Select Project");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (category.name === "") {
      setPopupContentMalert("Please Enter Category Name");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (selectedFlag === "Please Select Flagstatus") {
      setPopupContentMalert("Please Select Flagstatus");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (category.keyword !== "") {
      setPopupContentMalert("Please Add Keyword");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (selectedFlagOrg === "Yes" && category.flagmanualcalcorg === "") {
      setPopupContentMalert("Please Enter Flag Manual orginal calculaton value");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (selectedFlagOrg === "No" && category.flagmanualcalcorg !== "") {
      setPopupContentMalert("Please select 'Yes' for the Flag Status (Manual Org) before entering a value for the Flag Calc Org.");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (selectedFlagTemp === "Yes" && category.flagmanualcalctemp === "") {
      setPopupContentMalert("Please Enter Flag Manual Temp calculaton value");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (selectedFlagTemp === "No" && category.flagmanualcalctemp !== "") {
      setPopupContentMalert("Please select 'Yes' for the Flag Status (Manual Temp) before entering a value for the Flag Calc Temp.");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (!primary.some((d) => d.matchcase == "Default")) {
      setPopupContentMalert("Default value missing in mrate keywords");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (isNameMatch) {
      setPopupContentMalert("Data Already Exists!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } 
 
    else {
      sendRequest();
    }
  };

  const handleclear = (e) => {
    e.preventDefault();
    setSelectedProject("Please Select Project");
    setCategory({
      name: "",
      flagstatus: "No",
      flagstatusorg: "No",
      flagmanualcalctemp: "",
      flagmanualcalcorg: "",
      keyword: "",
    });
    setTodoscheckall([]);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  const [selectPrimaryChecked, setSelectPrimaryChecked] = useState(false)
  const [selectSecondaryChecked, setSelectSecondaryChecked] = useState(false)
  const [selectReconcileChecked, setSelectReconcileChecked] = useState(false)

  // const handleBulkUpdateKeywords = async () => {
  //   try{
  //    if(selectReconcileChecked === false &&  selectPrimaryChecked === false && selectSecondaryChecked === false){
  //     setPopupContentMalert("Please Select any one Checkbox");
  //     setPopupSeverityMalert("warning");
  //     handleClickOpenPopupMalert();
  //   }
  //    else if(selectPrimaryChecked === true &&  (categoryBulk.mrateprimary == "" || categoryBulk.mrateprimary == 0)){
  //       setPopupContentMalert("Please Enter Mrate Primary");
  //       setPopupSeverityMalert("warning");
  //       handleClickOpenPopupMalert();
  //     }else if(selectPrimaryChecked === true &&  (selectedValuesPrimaryBulk.length == 0)){
  //       setPopupContentMalert("Please Enter Mrate Primary Keywords");
  //       setPopupSeverityMalert("warning");
  //       handleClickOpenPopupMalert();
  //     } else if(selectSecondaryChecked === true &&  (categoryBulk.mratesecondary == "" || categoryBulk.mratesecondary == 0)){
  //       setPopupContentMalert("Please Enter Mrate Secondary");
  //       setPopupSeverityMalert("warning");
  //       handleClickOpenPopupMalert();
  //     }else if(selectSecondaryChecked === true &&  (selectedValuesSecondaryBulk.length == 0)){
  //       setPopupContentMalert("Please Enter Mrate Secondary Keywords");
  //       setPopupSeverityMalert("warning");
  //       handleClickOpenPopupMalert();
  //     }else if(selectReconcileChecked === true &&  (categoryBulk.mratereconcile == "" || categoryBulk.mratereconcile == 0)){
  //       setPopupContentMalert("Please Enter Mrate Reconcile");
  //       setPopupSeverityMalert("warning");
  //       handleClickOpenPopupMalert();
  //     }else if(selectReconcileChecked === true &&  (selectedValuesReconcileBulk.length == 0)){
  //       setPopupContentMalert("Please Enter Mrate Reconcile Keywords");
  //       setPopupSeverityMalert("warning");
  //       handleClickOpenPopupMalert();
  //     }
  //     else{

  //     let res = await axios.post(SERVICE.BULK_MRATE_KEYWORDS_UPDATE, {
  //       headers: {
  //         Authorization: `Bearer ${auth.APIToken}`,
  //       },
  //       mrateprimarykeywords:selectedValuesPrimaryBulk,
  //       mratesecondarykeywords:selectedValuesSecondaryBulk,
  //       mratereconcilekeywords:selectedValuesReconcileBulk,
  //       mrateprimary: categoryBulk.mrateprimary ,
  //       mratesecondary: categoryBulk.mratesecondary,
  //       mratereconcile: categoryBulk.mratereconcile ,
  //       ids:selectedRows,
  //       selectPrimaryChecked,
  //       selectSecondaryChecked,
  //       selectReconcileChecked
  //     });
  //     setPopupContent("Updated Successfully");
  //     setPopupSeverity("success");
 
  //     handleClickOpenPopup();
  //     handleBulkUpdateKeywordsClose();
  //   }
  //   }catch(err){
  //       console.log(err)
  //   }

  // }

  const handleSubmitBulkKeyword = () => {

    if(selectedRows.length === 0 ){
      setPopupContentMalert("Please Select Row");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }  else{
      handleBulkUpdateKeywordsOpen()
    }

  }
  const [isBulkKeywordUpdate, setisBulkKeywordUpdate] = useState(false);
  const handleBulkUpdateKeywordsOpen = () => {
    setisBulkKeywordUpdate(true);
  };
  const handleBulkUpdateKeywordsClose = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setisBulkKeywordUpdate(false);
  };

  //Edit model...
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    setEditingIndexcheckallEdit(-1);
  };
  const [oldname, setOldname] = useState("");
  const [oldproject, setOldProject] = useState("");
  //get single row to edit....
  const getCode = async (e, name, project) => {
    setOldname(name);
    setOldProject(project);
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.CATEGORYPROD_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTodoscheckallEdit(
        res?.data?.scategoryprod.keyword.map((d) => ({
          keyword: d,
        }))
      );
      setCategoryid({ ...res?.data?.scategoryprod,mrateprimary:"",matchcase:"Contains",  keyword: "", enablepage: res?.data?.scategoryprod.enablepage ? res?.data?.scategoryprod.enablepage : false });
      setSelectedProjectedit(res?.data?.scategoryprod.project);
      setPrimaryEdit(res?.data?.scategoryprod.mrateprimary)
      handleClickOpenEdit();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  // get single row to view....
  const getviewCode = async (e, enable) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.CATEGORYPROD_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      handleClickOpenview();
      const updatedCategoryProd = { ...res?.data?.scategoryprod, enablepage: enable }; 
      setCategoryid(updatedCategoryProd);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.CATEGORYPROD_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      handleClickOpeninfo();
      setCategoryid(res?.data?.scategoryprod);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //Module updateby edit page...
  let updateby = categoryid?.updatedby;
  let addedby = categoryid?.addedby;
  let categoriesid = categoryid?._id;

  //editing the single data...
  const sendEditRequest = async () => {
    let checkOverallDel = await axios.post(SERVICE.CATEGORYPROD_OVERALL_EDIT, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      project: oldproject,
      category: oldname,
    });

    setPageName(!pageName);
    if (checkOverallDel.data.count === 0 || oldname === categoryid.name) {
      try {
        await axios.put(`${SERVICE.CATEGORYPROD_SINGLE}/${categoriesid}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          project: selectedProjectedit,
          name: String(categoryid.name),
          enablepage: Boolean(categoryid.enablepage),
          flagstatus: String(selectedFlagEdit),
          flagstatusorg: String(selectedFlagEditOrg),
          flagstatustemp: String(selectedFlagEditTemp),
          flagmanualcalctemp: String(categoryid.flagmanualcalctemp),
          flagmanualcalcorg: String(categoryid.flagmanualcalcorg),
          keyword: todoscheckallEdit.map((d) => d.keyword),
          mrateprimary:primaryEdit,
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        });
        await fetchEmployee();
        await fetchAllCategory();
        handleCloseModEdit();
        setPopupContent("Updated Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
      } catch (err) {
        handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
      }
    } else {
      handleClickBulkEditOpen(checkOverallDel.data);
    }
  };

  const editSubmit = async (e) => { 
    try{

      let checkOverallDupe= await axios.post(SERVICE.CATEGORY_DUPECHECK, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        project: selectedProjectedit,
        category: categoryid.name,
      });
    
      // const isNameMatch = allModuleedit?.some((item) => item?.name?.toLowerCase() === categoryid?.name?.toLowerCase() && item.project === selectedProjectedit);
      if (selectedProjectedit === "") {
        setPopupContentMalert("Please Select Project");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (categoryid.name === "") {
        setPopupContentMalert("Please Enter  Name");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (selectedFlagEdit === "Please Select") {
        setPopupContentMalert("Please Select Flagstatus");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (selectedFlagEditOrg === "Please Select") {
        setPopupContentMalert("Please Select Flagstatus Original");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (selectedFlagEditTemp === "Please Select") {
        setPopupContentMalert("Please Select Flagstatus Temp");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (selectedFlagEditOrg === "Yes" && categoryid.flagmanualcalcorg === "") {
        setPopupContentMalert("Please Enter Flag Manual orginal calculaton value");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (selectedFlagEditTemp === "Yes" && categoryid.flagmanualcalctemp === "") {
        setPopupContentMalert("Please Enter Flag Manual Temp calculaton value");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (selectedFlagEditOrg === "No" && categoryid.flagmanualcalcorg !== "") {
        setPopupContentMalert("Please select 'Yes' for the Flag Status (Manual Org) before entering a value for the Flag Calc Org.");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (selectedFlagEditTemp === "No" && categoryid.flagmanualcalctemp !== "") {
        setPopupContentMalert("Please select 'Yes' for the Flag Status (Manual Temp) before entering a value for the Flag Calc Temp.");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (!primaryEdit.some((d) => d.matchcase == "Default")) {
        setPopupContentMalert("Default value missing in mrate keywords");
        setPopupSeverityMalert("warning");
        handleClickOpenPopupMalert();
      }
      else if (checkOverallDupe.data.categoryprod > 0) {
        setPopupContentMalert("Data Already Exists!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else {
        sendEditRequest();
      }
    }catch(err){
      console.log(err,'err')
    }
  };

  const bulkNotLinkedUpdate = async (data) => {
    try {
      console.log(data, "data");

      let checkOverallDel = await axios.post(SERVICE.CATEGORY_OVERALL_NONLINK_BULKDELETE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        nonLinkedCategories: data,
      });
      handleCloseBulkNotLinkedClose();
      setSelectedRows([]);
      setSelectedRowsCate([]);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      await fetchEmployee();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const hanleBulkOverallEditUpdate = async (data) => {
    try {
      let checkOverallDel = await axios.post(SERVICE.CATEGORYPROD_OVERALL_EDIT_BULKUPDATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        project: oldproject,
        category: oldname,
        updatedcategory: categoryid.name,
        subcategorycount: data.subcategorycount,
        unitratecount: data.unitratecount,
        // count:
      });
      await axios.put(`${SERVICE.CATEGORYPROD_SINGLE}/${categoriesid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        project: selectedProjectedit,
        name: String(categoryid.name),
        enablepage: Boolean(categoryid.enablepage),
        flagstatus: String(selectedFlagEdit),
        flagstatusorg: String(selectedFlagEditOrg),
        flagstatustemp: String(selectedFlagEditTemp),
        flagmanualcalctemp: String(categoryid.flagmanualcalctemp),
        flagmanualcalcorg: String(categoryid.flagmanualcalcorg),
        keyword: todoscheckallEdit.map((d) => d.keyword),
     
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchEmployee();

      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      handleCloseModEdit();
      handleCloseBulkEditMod();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [categoriesDup, setCategoriesDup] = useState([]);

  //get all category.
  const fetchAllCategory = async () => {
    setPageName(!pageName);
    try {
      let res_module = await axios.get(SERVICE.CATEGORYPROD, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const uniqueArray = res_module?.data?.categoryprod.filter((item, index, self) => index === self.findIndex((t) => t.name === item.name));
      setCategoriesDup(uniqueArray);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //get all category.
  const fetchVendor = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.VENDORMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setVendors(res?.data?.vendormaster);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const handleProjectChange = (e) => {
    const selectedProject = e.value;
    setSelectedProject(selectedProject);
  };

  const handleFlagChange = (e) => {
    const selctedvalue = e.value;
    setSelectedFlag(selctedvalue);
  };

  const handleFlagChangeOrg = (e) => {
    const selctedvalue = e.value;
    setSelectedFlagOrg(selctedvalue);
    setCategory({ ...category, flagmanualcalcorg: "" });
  };
  const handleFlagChangeTemp = (e) => {
    const selctedvalue = e.value;
    setSelectedFlagTemp(selctedvalue);
    setCategory({ ...category, flagmanualcalctemp: "" });
  };

  const handleFlagChangeEdit = (e) => {
    const selctedvalue = e.value;
    setSelectedFlagEdit(selctedvalue);
  };
  const handleFlagChangeEditOrg = (e) => {
    const selctedvalue = e.value;
    setSelectedFlagEditOrg(selctedvalue);
    setCategoryid({ ...categoryid, flagmanualcalcorg: "" });
  };
  const handleFlagChangeEditTemp = (e) => {
    const selctedvalue = e.value;
    setSelectedFlagEditTemp(selctedvalue);
    setCategoryid({ ...categoryid, flagmanualcalctemp: "" });
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Production Category ",
    pageStyle: "print",
  });

  const [categoriesFilterArray, setCategoriesFilterArray] = useState([]);

  const fetchAllCategoryArray = async () => {
    setPageName(!pageName);
    try {
      let res_module = await axios.get(SERVICE.CATEGORYPROD, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const unitsRates = res_module?.data?.categoryprod;
      let uniquesubRates;
      if (unitsRates) {
        const uniqueCombinations = new Set();
        uniquesubRates = unitsRates.filter((item) => {
          const combination = `${item.project}-${item.name}`;
          if (!uniqueCombinations.has(combination)) {
            uniqueCombinations.add(combination);
            return true;
          }
          return false;
        });
      }
      setCategoriesFilterArray(uniquesubRates?.map((item, index) => {
        return {
          ...item,
          id: item._id,
          serialNumber: item.serialNumber,
          project: item.project,
          name: item.name,
          flagstatus: item.flagstatus,
          flagstatusorg: item.flagstatusorg,
          keyword: item.keyword,
          enablepage: item.enablepage === true ? "Yes" : "No",
        }}));
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchAllCategoryArray();
  }, [isFilterOpen]);

  const [overallFilterdata, setOverallFilterdata] = useState([]);
  const [tableLoading, settableLoading] = useState(true);

  const fetchEmployee = async () => {
    settableLoading(false);
    setPageName(!pageName);
    try {
      let res_module = await axios.get(SERVICE.CATEGORYPROD, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const ans = res_module?.data?.categoryprod?.length > 0 ? res_module?.data?.categoryprod : [];
      const itemsWithSerialNumber = ans?.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
      }));
      // setAcpointCalculation(res_vendor?.data?.acpointcalculation);
      // const uniqueArray = itemsWithSerialNumber.filter((item, index, self) => index === self.findIndex((t) => t.name === item.name));
      setCategories(itemsWithSerialNumber);
      setOverallFilterdata(itemsWithSerialNumber);
      settableLoading(true);
    } catch (err) {
      settableLoading(true);

      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, [page, pageSize, searchQuery]);

  const [items, setItems] = useState([]);

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Production Category"),
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

  useEffect(() => {
    getapi();
    fetchEmployee();
  
    fetchProjectDropdowns();
    fetchVendor();
    fetchAllCategory();
  }, []);

  useEffect(() => {
   
    fetchProjectDropdowns();
  }, [isEditOpen, categoryid]);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = categories?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [categories]);

  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSelectedRows([]);
    setSelectedRowsCate([]);
    setSelectAllChecked(false);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setSelectedRows([]);
    setSelectedRowsCate([]);
    setSelectAllChecked(false);
  };

  //datatable....
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  // Split the search query into individual terms
  const searchTerms = searchQuery.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = overallFilterdata?.filter((item) => {
    return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(filteredDatas.length / pageSize);

  const visiblePages = Math.min(totalPages, 3);

  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(Math.abs(firstVisiblePage + visiblePages - 1), totalPages);

  const pageNumbers = [];

  const indexOfLastItem = page * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;

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
      renderHeader: (params) => (
        <CheckboxHeader
          selectAllChecked={selectAllChecked}
          onSelectAll={() => {
            if (rowDataTable.length === 0) {
              // Do not allow checking when there are no rows
              return;
            }

            if (selectAllChecked) {
              setSelectedRows([]);
              setSelectedRowsCate([]);
            } else {
              const allRowIds = rowDataTable.map((row) => row.id);
              const allRowIdsCate = rowDataTable.map((row) => ({ category: row.name, project: row.project }));
              setSelectedRows(allRowIds);
              setSelectedRowsCate(allRowIdsCate);
            }
            setSelectAllChecked(!selectAllChecked);
          }}
        />
      ),
      renderCell: (params) => (
        <Checkbox
          checked={selectedRows.includes(params.row.id)}
          onChange={() => {
            let updatedSelectedRows;
            let updatedSelectedRowsCate;
            if (selectedRows.includes(params.row.id)) {
              updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.row.id);
              updatedSelectedRowsCate = selectedRowsCate.filter((selectedId) => selectedId.category !== params.row.name && selectedId.project !== params.row.project);
            } else {
              updatedSelectedRows = [...selectedRows, params.row.id];
              updatedSelectedRowsCate = [...selectedRowsCate, { category: params.row.name, project: params.row.project }];
            }

            setSelectedRows(updatedSelectedRows);
            setSelectedRowsCate(updatedSelectedRowsCate);

            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllChecked(updatedSelectedRows.length === filteredDatas.length);
          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 70,

      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 70,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    { field: "project", headerName: "Project Name", flex: 0, width: 130, hide: !columnVisibility.project, headerClassName: "bold-header" },
    { field: "name", headerName: "Name", flex: 0, width: 370, hide: !columnVisibility.name, headerClassName: "bold-header" },
    { field: "flagstatus", headerName: "Flag Status", flex: 0, width: 80, hide: !columnVisibility.flagstatus, headerClassName: "bold-header" },
    { field: "enablepage", headerName: "Enable Page", flex: 0, width: 80, hide: !columnVisibility.enablepage, headerClassName: "bold-header" },

    { field: "flagstatusorg", headerName: "Flag Status Org", flex: 0, width: 90, hide: !columnVisibility.flagstatusorg, headerClassName: "bold-header" },
    { field: "flagmanualcalcorg", headerName: "Flag Calc Manual Org", flex: 0, width: 80, hide: !columnVisibility.flagmanualcalcorg, headerClassName: "bold-header" },

    { field: "flagstatustemp", headerName: "Flag Status Temp", flex: 0, width: 90, hide: !columnVisibility.flagstatustemp, headerClassName: "bold-header" },
    { field: "flagmanualcalctemp", headerName: "Flag Calc Manual Temp", flex: 0, width: 80, hide: !columnVisibility.flagmanualcalctemp, headerClassName: "bold-header" },

    { field: "keyword", headerName: "KeyWwords", flex: 0, width: 110, hide: !columnVisibility.keyword, headerClassName: "bold-header" },
    // { field: "mismatchmode", headerName: "Mismatch Mode", flex: 0, width: 380, hide: !columnVisibility.mismatchmode, headerClassName: "bold-header" },
    // { field: "mrateprimary", headerName: "Mrate Primary", flex: 0, width: 100, hide: !columnVisibility.mrateprimary, headerClassName: "bold-header" },
    // { field: "mratesecondary", headerName: "Mrate Secondary", flex: 0, width: 100, hide: !columnVisibility.mratesecondary, headerClassName: "bold-header" },
    // { field: "mratereconcile", headerName: "Mrate Reconcile", flex: 0, width: 100, hide: !columnVisibility.mratereconcile, headerClassName: "bold-header" },  
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 250,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("eproductioncategory") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.row.id, params.row.name, params.row.project);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />{" "}
            </Button>
          )}
          {isUserRoleCompare?.includes("dproductioncategory") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id, params.row.name, params.row.project);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />{" "}
            </Button>
          )}
          {isUserRoleCompare?.includes("vproductioncategory") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.row.id, params.row.enablepage);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />{" "}
            </Button>
          )}
          {isUserRoleCompare?.includes("iproductioncategory") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getinfoCode(params.row.id);
              }}
            >
              <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />{" "}
            </Button>
          )}
        </Grid>
      ),
    },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      ...item,
      id: item._id,
      serialNumber: item.serialNumber,
      project: item.project,
      name: item.name,
      flagstatus: item.flagstatus,
      flagstatusorg: item.flagstatusorg,
      keyword: item.keyword,
      enablepage: item.enablepage === true ? "Yes" : "No",
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
              // secondary={column.headerName }
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

  const [fileFormat, setFormat] = useState("");

 
  return (
    <Box>
      <Headtitle title={"CATEGORY PRODUCTION"} />
      {/* ****** Header Content ****** */}
      <PageHeading title="Production Category" modulename="Production" submodulename="Report SetUp" mainpagename="Production Category" subpagename="" subsubpagename="" />
      {isUserRoleCompare?.includes("aproductioncategory") && (
        <Box sx={userStyle.dialogbox}>
          <>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>Add Production Category</Typography>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={4} xs={12} sm={12}>
                <Typography>
                  Project <b style={{ color: "red" }}>*</b>
                </Typography>
                <FormControl size="small" fullWidth>
                  <Selects options={projects} styles={colourStyles} value={{ label: selectedProject, value: selectedProject }} onChange={handleProjectChange} />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Name <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Please Enter Category Name"
                    value={category.name}
                    onChange={(e) => {
                      setCategory({ ...category, name: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Flag Status<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects options={flags} styles={colourStyles} value={{ label: selectedFlag, value: selectedFlag }} onChange={handleFlagChange} />
                </FormControl>
              </Grid>

              <Grid item md={2.2} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>Flag Status (Manual) Org</Typography>
                  <Selects options={flags} styles={colourStyles} value={{ label: selectedFlagOrg, value: selectedFlagOrg }} onChange={handleFlagChangeOrg} />
                </FormControl>
              </Grid>
              <Grid item md={2.2} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>Flag Calc Org</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    disabled={selectedFlagOrg === "No"}
                    placeholder="Please Enter Flag Calc Org"
                    value={category.flagmanualcalcorg}
                    onChange={(e) => {
                      setCategory({ ...category, flagmanualcalcorg: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={2.2} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>Flag Status(Manual) Temp</Typography>
                  <Selects options={flags} styles={colourStyles} value={{ label: selectedFlagTemp, value: selectedFlagTemp }} onChange={handleFlagChangeTemp} />
                </FormControl>
              </Grid>
              <Grid item md={2.2} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>Flag Calc Temp</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    disabled={selectedFlagTemp === "No"}
                    placeholder="Please Enter Flag Calc Temp"
                    value={category.flagmanualcalctemp}
                    onChange={(e) => {
                      setCategory({ ...category, flagmanualcalctemp: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3.2} xs={12} sm={12} marginTop={{ md: 3 }} sx={{ display: { md: "flex" }, justifyContent: { md: "center" } }}>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox checked={category.enablepage} />}
                    onChange={(e) =>
                      setCategory({
                        ...category,
                        enablepage: !category.enablepage,
                      })
                    }
                    label="Enable Pages in Manual Entry"
                  />
                </FormGroup>
              </Grid>
              <Grid item md={6} xs={12} sm={3}>
                 <Grid container spacing={1}>
                 <Grid item md={3} xs={3} sm={3}>
                      <FormControl fullWidth size="small">
                        <Typography>Match Case</Typography>
                        <Selects options={[
                          {label:"Equals to", value:"Equals to"},
                          {label:"Contains", value:"Contains"},
                          {label:"Default", value:"Default"},
                          ]
                        } 
                        styles={colourStyles} 
                        value={{ label: category.matchcase, value: category.matchcase }}
                        onChange={(e) => {
                          setCategory({ ...category, matchcase: e.value });
                        }}
                        />

                      </FormControl>
                    
                    </Grid>
                    <Grid item md={5} xs={5} sm={5}>
                      <FormControl fullWidth size="small">
                        <Typography>Mrate Keywords</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          disabled={category.matchcase === "Default"}
                          placeholder="Please Enter Keyword"
                          value={category.keywordprimary}
                          onChange={(e) => {
                            setCategory({ ...category, keywordprimary: e.target.value });
                          }}
                        />
                      </FormControl>
                      <Typography color="error">{errormsgeditcheckPrimary}</Typography>
                    </Grid>
                
                    <Grid item md={3} xs={3} sm={3}>
                      <FormControl fullWidth size="small">
                        <Typography>Mrate</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Please Enter Mrate"
                          value={category.mrateprimary}
                          onChange={(e) => {
                            setCategory({ ...category, mrateprimary: e.target.value });
                          }}
                        />
                      </FormControl>
                      <Typography color="error">{errormsgeditcheckmratePrimary}</Typography>
                    </Grid>
                    <Grid item md={1} sm={1} xs={1} marginTop={3}>
                      <Button variant="contained" color="success" sx={{ minWidth: "40px", height: "37px" }} onClick={handleCreatePrimary}>
                        <FaPlus sx={{ color: "white" }} />
                      </Button>
                    </Grid>
                  
                    <Grid item md={12} xs={12} sm={12} marginTop={1}>
                        {primary?.map((item, i) => (
                          <div >
                            {editingIndexPrimary === i ? (
                              <>
                              <Grid container spacing={2} key={i}>
                                <Grid item md={0.5} sm={0.5} xs={0.5} sx={{display:"flex", alignItems:"center", }}>
                                  {i + 1}. &ensp;
                                </Grid>
                                <Grid item md={5} sm={5} xs={5}>
                                  <FormControl fullWidth size="small">
                                    <OutlinedInput
                                      id="component-outlined"
                                      type="text"
                                      size="small"
                                      placeholder="Please Enter Keyword"
                                      value={newKeywordPrimaryEdit}
                                      onChange={(e) => {
                                        setNewKeywordPrimaryEdit(e.target.value);
                                      }}
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item md={2.5} sm={2.5} xs={2.5}>
                                   <FormControl fullWidth size="small">                                 
                                      <Selects options={[
                                        {label:"Equals to", value:"Equals to"},
                                        {label:"Contains", value:"Contains"},
                                     
                                        ]
                                      } 
                                      styles={colourStyles} 
                                      value={{ label: newMatchCasePrimaryEdit, value: newMatchCasePrimaryEdit }}
                                      onChange={(e) => {
                                        setNewMatchCasePrimaryEdit(e.value);
                                      }}
                                      />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} sm={2} xs={2}>
                                  <FormControl fullWidth size="small">
                                    <OutlinedInput
                                      id="component-outlined"
                                      type="text"
                                      size="small"
                                      placeholder="Please Enter Mrate"
                                      value={newMratePrimaryEdit}
                                      onChange={(e) => {
                                        setNewMratePrimaryEdit(e.target.value);
                                      }}
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item md={1} sm={1} xs={1} sx={{display:"flex", justifyContent:"flex-start", alignItems:"center"}}>
                                  <Button
                                    variant="contained"
                                    style={{
                                      minWidth: "20px",
                                      padding:"10px",
                                      background: "transparent",
                                      boxShadow: "none",
                                      marginTop: "-3px !important",
                                      "&:hover": {
                                        background: "#f4f4f4",
                                        borderRadius: "50%",
                                        minWidth: "20px",
                                        boxShadow: "none",
                                      },
                                    }}
                                    onClick={handleUpdatePrimary}
                                  >
                                    <CheckCircleIcon
                                      style={{
                                        color: "#216d21",
                                        fontSize: "1.5rem",
                                      }}
                                    />
                                  </Button>
                                </Grid>
                                <Grid item md={1} sm={1} xs={1} sx={{display:"flex", justifyContent:"end", alignItems:"center"}}>
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
                                    onClick={() => setEditingIndexPrimary(-1)}
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
                              <Grid container spacing={2}>
                                <Grid item md={12} sm={12} xs={12}>
                                  <Typography color="error">{errormsgeditPrimary}</Typography>
                                </Grid>
                              </Grid>
                              </>
                            ) : (
                              <>
                                <Grid container spacing={2} key={i}>
                                  <Grid item md={0.5} sm={0.5} xs={0.5} sx={{display:"flex", alignItems:"center", }}>
                                  <Typography > {i + 1}. </Typography>  
                                  </Grid>
                                  <Grid item md={5} sm={5} xs={5} sx={{display:"flex", alignItems:"center",  whiteSpace: "normal", wordBreak: "break-all" }}>
                                  <Typography > {item.keyword} </Typography> 
                                  </Grid>
                                  <Grid item md={2.5} sm={2.5} xs={2.5} sx={{display:"flex", alignItems:"center", whiteSpace: "normal", wordBreak: "break-all" }}>
                                  <Typography >   {item.matchcase}</Typography> 
                                  </Grid>
                                  <Grid item md={2} sm={2} xs={2} sx={{display:"flex", alignItems:"center", whiteSpace: "normal", wordBreak: "break-all" }}>
                                  <Typography >   {item.mrate}</Typography> 
                                  </Grid>
                                  <Grid item md={1} sm={1} xs={1} sx={{display:"flex", justifyContent:"flex-start", alignItems:"center"}}>
                                    <Button
                                      variant="contained"
                                      disabled={item.matchcase === "Default"}
                                      style={{
                                        minWidth: "30px",
                                        minHeight: "30px",
                                        padding:"6px",
                                        background: "transparent",
                                        boxShadow: "none",
                                        marginTop: "-3px !important",
                                        "&:hover": {
                                          background: "#1976d22e",
                                          borderRadius: "50%",
                                          minWidth: "30px",
                                          minHeight: "30px",
                                          padding:"6px",

                                          boxShadow: "none",
                                        },
                                      }}
                                      onClick={() => handleEditPrimary(i)}
                                    >
                                      <FaEdit
                                        style={{
                                          color: item.matchcase === "Default" ? "lightgrey" : "#1976d2" ,

                                          fontSize: "1.2rem",
                                        }}
                                      />
                                    </Button>
                                  </Grid>
                                  <Grid item md={1} sm={1} xs={1} sx={{display:"flex", justifyContent:"end", alignItems:"center"}}>
                                    <Button onClick={(e) => handleDeletePrimary(i)} 
                                      style={{
                                        minWidth: "30px",
                                        minHeight: "30px",
                                        padding:"6px",
                                        background: "transparent",
                                        boxShadow: "none",
                                        marginTop: "-3px !important",
                                        "&:hover": {
                                          background: "#e7afb745",
                                          borderRadius: "50%",
                                          minWidth: "30px",
                                          minHeight: "30px",
                                          padding:"6px",
                                          boxShadow: "none",
                                        },
                                      }}
                                      >
                                      <FaTrash
                                        style={{
                                          color: "#b92525",
                                          fontSize: "1rem",
                                        }}
                                      />
                                    </Button>
                                  </Grid>
                                </Grid>
                                {/* <br />
                                <Grid container>
                                  <Typography color="error">{errormsgeditPrimary}</Typography>
                                </Grid> */}
                              </>
                            )}
                          </div>
                        ))}
                    </Grid>              
                 </Grid>  

              </Grid>
              {/* <Grid item md={4} xs={12} sm={3}>
                 <Grid container spacing={1}>
                    <Grid item md={7} xs={7} sm={7}>
                      <FormControl fullWidth size="small">
                        <Typography>Keywords</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Please Enter Keyword"
                          value={category.keywordsecondary}
                          onChange={(e) => {
                            setCategory({ ...category, keywordsecondary: e.target.value });
                          }}
                        />
                      </FormControl>
                      <Typography color="error">{errormsgeditcheckSecondary}</Typography>
                    </Grid>
                    <Grid item md={4} xs={4} sm={4}>
                      <FormControl fullWidth size="small">
                        <Typography>Mrate</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Please Enter Mrate"
                          value={category.mratesecondary}
                          onChange={(e) => {
                            setCategory({ ...category, mratesecondary: e.target.value });
                          }}
                        />
                      </FormControl>
                      <Typography color="error">{errormsgeditcheckmrateSecondary}</Typography>
                    </Grid>
                    <Grid item md={1} sm={1} xs={1} marginTop={3}>
                      <Button variant="contained" color="success" sx={{ minWidth: "40px", height: "37px" }} onClick={handleCreateSecondary}>
                        <FaPlus sx={{ color: "white" }} />
                      </Button>
                    </Grid>
                  
                    <Grid item md={12} xs={12} sm={12} marginTop={1}>
                        {secondary?.map((item, i) => (
                          <div >
                            {editingIndexSecondary === i ? (
                              <>
                              <Grid container spacing={2} key={i}>
                                <Grid item md={0.5} sm={0.5} xs={0.5} sx={{display:"flex", alignItems:"center", }}>
                                  {i + 1}. &ensp;
                                </Grid>
                                <Grid item md={6} sm={6} xs={6}>
                                  <FormControl fullWidth size="small">
                                    <OutlinedInput
                                      id="component-outlined"
                                      type="text"
                                      size="small"
                                      placeholder="Please Enter Keyword"
                                      value={newKeywordSecondaryEdit}
                                      onChange={(e) => {
                                        setNewKeywordSecondaryEdit(e.target.value);
                                      }}
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item md={3} sm={3} xs={3}>
                                  <FormControl fullWidth size="small">
                                    <OutlinedInput
                                      id="component-outlined"
                                      type="text"
                                      size="small"
                                      placeholder="Please Enter Mrate"
                                      value={newMrateSecondaryEdit}
                                      onChange={(e) => {
                                        setNewMrateSecondaryEdit(e.target.value);
                                      }}
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item md={1.5} sm={1.5} xs={1.5} sx={{display:"flex", justifyContent:"flex-start", alignItems:"center"}}>
                                  <Button
                                    variant="contained"
                                    style={{
                                      minWidth: "20px",
                                      padding:"10px",
                                      background: "transparent",
                                      boxShadow: "none",
                                      marginTop: "-3px !important",
                                      "&:hover": {
                                        background: "#f4f4f4",
                                        borderRadius: "50%",
                                        minWidth: "20px",
                                        boxShadow: "none",
                                      },
                                    }}
                                    onClick={handleUpdateSecondary}
                                  >
                                    <CheckCircleIcon
                                      style={{
                                        color: "#216d21",
                                        fontSize: "1.5rem",
                                      }}
                                    />
                                  </Button>
                                </Grid>
                                <Grid item md={1} sm={1} xs={1} sx={{display:"flex", justifyContent:"end", alignItems:"center"}}>
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
                                    onClick={() => setEditingIndexSecondary(-1)}
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
                              <Grid container spacing={2}>
                                <Grid item md={12} sm={12} xs={12}>
                                  <Typography color="error">{errormsgeditSecondary}</Typography>
                                </Grid>
                              </Grid>
                              </>
                            ) : (
                              <>
                                <Grid container spacing={2} key={i}>
                                  <Grid item md={0.5} sm={0.5} xs={0.5} sx={{display:"flex", alignItems:"center", }}>
                                  <Typography > {i + 1}. </Typography>  
                                  </Grid>
                                  <Grid item md={6} sm={6} xs={6} sx={{display:"flex", alignItems:"center",  whiteSpace: "normal", wordBreak: "break-all" }}>
                                  <Typography > {item.keyword} </Typography> 
                                  </Grid>
                                  <Grid item md={3} sm={3} xs={3} sx={{display:"flex", alignItems:"center", whiteSpace: "normal", wordBreak: "break-all" }}>
                                  <Typography >   {item.mrate}</Typography> 
                                  </Grid>
                                  <Grid item md={1.5} sm={1.5} xs={1.5} sx={{display:"flex", justifyContent:"flex-start", alignItems:"center"}}>
                                    <Button
                                      variant="contained"
                                      style={{
                                        minWidth: "30px",
                                        minHeight: "30px",
                                        padding:"6px",
                                        background: "transparent",
                                        boxShadow: "none",
                                        marginTop: "-3px !important",
                                        "&:hover": {
                                          background: "#1976d22e",
                                          borderRadius: "50%",
                                          minWidth: "30px",
                                          minHeight: "30px",
                                          padding:"6px",

                                          boxShadow: "none",
                                        },
                                      }}
                                      onClick={() => handleEditSecondary(i)}
                                    >
                                      <FaEdit
                                        style={{
                                          color: "#1976d2",
                                          fontSize: "1.2rem",
                                        }}
                                      />
                                    </Button>
                                  </Grid>
                                  <Grid item md={1} sm={1} xs={1} sx={{display:"flex", justifyContent:"end", alignItems:"center"}}>
                                    <Button onClick={(e) => handleDeleteSecondary(i)} 
                                      style={{
                                        minWidth: "30px",
                                        minHeight: "30px",
                                        padding:"6px",
                                        background: "transparent",
                                        boxShadow: "none",
                                        marginTop: "-3px !important",
                                        "&:hover": {
                                          background: "#e7afb745",
                                          borderRadius: "50%",
                                          minWidth: "30px",
                                          minHeight: "30px",
                                          padding:"6px",
                                          boxShadow: "none",
                                        },
                                      }}
                                      >
                                      <FaTrash
                                        style={{
                                          color: "#b92525",
                                          fontSize: "1rem",
                                        }}
                                      />
                                    </Button>
                                  </Grid>
                                </Grid>
                               
                              </>
                            )}
                          </div>
                        ))}
                    </Grid>              
                 </Grid>  

              </Grid>
               <Grid item md={4} xs={12} sm={3}>
                 <Grid container spacing={1}>
                    <Grid item md={7} xs={7} sm={7}>
                      <FormControl fullWidth size="small">
                        <Typography>Keywords</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Please Enter Keyword"
                          value={category.keywordreconcile}
                          onChange={(e) => {
                            setCategory({ ...category, keywordreconcile: e.target.value });
                          }}
                        />
                      </FormControl>
                      <Typography color="error">{errormsgeditcheckReconcile}</Typography>
                    </Grid>
                    <Grid item md={4} xs={4} sm={4}>
                      <FormControl fullWidth size="small">
                        <Typography>Mrate</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Please Enter Mrate"
                          value={category.mratereconcile}
                          onChange={(e) => {
                            setCategory({ ...category, mratereconcile: e.target.value });
                          }}
                        />
                      </FormControl>
                      <Typography color="error">{errormsgeditcheckmrateReconcile}</Typography>
                    </Grid>
                    <Grid item md={1} sm={1} xs={1} marginTop={3}>
                      <Button variant="contained" color="success" sx={{ minWidth: "40px", height: "37px" }} onClick={handleCreateReconcile}>
                        <FaPlus sx={{ color: "white" }} />
                      </Button>
                    </Grid>
                  
                    <Grid item md={12} xs={12} sm={12} marginTop={1}>
                        {reconcile?.map((item, i) => (
                          <div >
                            {editingIndexReconcile === i ? (
                              <>
                              <Grid container spacing={2} key={i}>
                                <Grid item md={0.5} sm={0.5} xs={0.5} sx={{display:"flex", alignItems:"center", }}>
                                  {i + 1}. &ensp;
                                </Grid>
                                <Grid item md={6} sm={6} xs={6}>
                                  <FormControl fullWidth size="small">
                                    <OutlinedInput
                                      id="component-outlined"
                                      type="text"
                                      size="small"
                                      placeholder="Please Enter Keyword"
                                      value={newKeywordReconcileEdit}
                                      onChange={(e) => {
                                        setNewKeywordReconcileEdit(e.target.value);
                                      }}
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item md={3} sm={3} xs={3}>
                                  <FormControl fullWidth size="small">
                                    <OutlinedInput
                                      id="component-outlined"
                                      type="text"
                                      size="small"
                                      placeholder="Please Enter Mrate"
                                      value={newMrateReconcileEdit}
                                      onChange={(e) => {
                                        setNewMrateReconcileEdit(e.target.value);
                                      }}
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item md={1.5} sm={1.5} xs={1.5} sx={{display:"flex", justifyContent:"flex-start", alignItems:"center"}}>
                                  <Button
                                    variant="contained"
                                    style={{
                                      minWidth: "20px",
                                      padding:"10px",
                                      background: "transparent",
                                      boxShadow: "none",
                                      marginTop: "-3px !important",
                                      "&:hover": {
                                        background: "#f4f4f4",
                                        borderRadius: "50%",
                                        minWidth: "20px",
                                        boxShadow: "none",
                                      },
                                    }}
                                    onClick={handleUpdateReconcile}
                                  >
                                    <CheckCircleIcon
                                      style={{
                                        color: "#216d21",
                                        fontSize: "1.5rem",
                                      }}
                                    />
                                  </Button>
                                </Grid>
                                <Grid item md={1} sm={1} xs={1} sx={{display:"flex", justifyContent:"end", alignItems:"center"}}>
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
                                    onClick={() => setEditingIndexReconcile(-1)}
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
                              <Grid container spacing={2}>
                                <Grid item md={12} sm={12} xs={12}>
                                  <Typography color="error">{errormsgeditReconcile}</Typography>
                                </Grid>
                              </Grid>
                              </>
                            ) : (
                              <>
                                <Grid container spacing={2} key={i}>
                                  <Grid item md={0.5} sm={0.5} xs={0.5} sx={{display:"flex", alignItems:"center", }}>
                                  <Typography > {i + 1}. </Typography>  
                                  </Grid>
                                  <Grid item md={6} sm={6} xs={6} sx={{display:"flex", alignItems:"center",  whiteSpace: "normal", wordBreak: "break-all" }}>
                                  <Typography > {item.keyword} </Typography> 
                                  </Grid>
                                  <Grid item md={3} sm={3} xs={3} sx={{display:"flex", alignItems:"center", whiteSpace: "normal", wordBreak: "break-all" }}>
                                  <Typography >   {item.mrate}</Typography> 
                                  </Grid>
                                  <Grid item md={1.5} sm={1.5} xs={1.5} sx={{display:"flex", justifyContent:"flex-start", alignItems:"center"}}>
                                    <Button
                                      variant="contained"
                                      style={{
                                        minWidth: "30px",
                                        minHeight: "30px",
                                        padding:"6px",
                                        background: "transparent",
                                        boxShadow: "none",
                                        marginTop: "-3px !important",
                                        "&:hover": {
                                          background: "#1976d22e",
                                          borderRadius: "50%",
                                          minWidth: "30px",
                                          minHeight: "30px",
                                          padding:"6px",

                                          boxShadow: "none",
                                        },
                                      }}
                                      onClick={() => handleEditReconcile(i)}
                                    >
                                      <FaEdit
                                        style={{
                                          color: "#1976d2",
                                          fontSize: "1.2rem",
                                        }}
                                      />
                                    </Button>
                                  </Grid>
                                  <Grid item md={1} sm={1} xs={1} sx={{display:"flex", justifyContent:"end", alignItems:"center"}}>
                                    <Button onClick={(e) => handleDeleteReconcile(i)} 
                                      style={{
                                        minWidth: "30px",
                                        minHeight: "30px",
                                        padding:"6px",
                                        background: "transparent",
                                        boxShadow: "none",
                                        marginTop: "-3px !important",
                                        "&:hover": {
                                          background: "#e7afb745",
                                          borderRadius: "50%",
                                          minWidth: "30px",
                                          minHeight: "30px",
                                          padding:"6px",
                                          boxShadow: "none",
                                        },
                                      }}
                                      >
                                      <FaTrash
                                        style={{
                                          color: "#b92525",
                                          fontSize: "1rem",
                                        }}
                                      />
                                    </Button>
                                  </Grid>
                                </Grid>
                               
                              </>
                            )}
                          </div>
                        ))}
                    </Grid>              
                 </Grid>  

              </Grid> */}
              {/* <Grid item md={1.5} xs={12} sm={3}>
                 <FormControl fullWidth size="small"> 
                    <Typography>Mrate Primary</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Mrate-Primary"
                      value={category.mrateprimary}
                      onChange={(e) => {
                        setCategory({ ...category, mrateprimary: e.target.value });
                      }}
                    />
                  </FormControl> 
                  </Grid>
                <Grid item md={2.5} xs={12} sm={3}>              
                  <Typography>Mrate Primary Keywors</Typography>
                  <Box >
                  <Autocomplete
                      multiple
                      freeSolo
                      options={allOptionsPrimary}
                      value={selectedValuesPrimary}
                      onChange={handleChangePrimary}
                      inputValue={inputValue}
                      
                      disableClearable={true}
                      onInputChange={(event, newValue) => setInputValue(newValue)}
                      onKeyDown={handleKeyDownPrimary} 
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            key={option}
                            label={option}
                            {...getTagProps({ index })}
                            onDelete={() => handleDeletePrimary(option)}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField {...params} variant="outlined" 
                        sx={{
                          "& .MuiInputBase-root": {
                            height: "max-content",                            
                          },
                        }}
                         label="Select or Add Keywords" />
                      )}
                    />  
                    </Box>          
                </Grid>   
                        
                <Grid item md={1.5} xs={12} sm={3}>
                 <FormControl fullWidth size="small"> 
                    <Typography>Mrate Secondary</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Mrate-Secondary"
                      value={category.mratesecondary}
                      onChange={(e) => {
                        setCategory({ ...category, mratesecondary: e.target.value });
                      }}
                    />
                  </FormControl> 
                  </Grid>
                  <Grid item md={2.5} xs={12} sm={3}>              
                      <Typography>Mrate Secondary Keywords</Typography>
                      <Box >
                      <Autocomplete
                          multiple
                          freeSolo
                          options={allOptionsSecondary}
                          value={selectedValuesSecondary}
                          onChange={handleChangeSecondary}
                          inputValue={inputValueS}
                          
                          disableClearable={true}
                          onInputChange={(event, newValue) => setInputValueS(newValue)}
                          onKeyDown={handleKeyDownSecondary} 
                          renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                              <Chip
                                key={option}
                                label={option}
                                {...getTagProps({ index })}
                                onDelete={() => handleDeleteSecondary(option)}
                              />
                            ))
                          }
                          renderInput={(params) => (
                            <TextField {...params} variant="outlined" 
                            sx={{
                              "& .MuiInputBase-root": {
                                height: "max-content",                            
                              },
                            }}
                            label="Select or Add Keywords" />
                          )}
                        />  
                        </Box>          
                      </Grid>   
                  <Grid item md={1.5} xs={12} sm={3}>
                  <FormControl fullWidth size="small"> 
                    <Typography>Mrate Reconcile</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Mrate-Reconcile"
                      value={category.mratereconcile}
                      onChange={(e) => {
                        setCategory({ ...category, mratereconcile: e.target.value });
                      }}
                    />
                  </FormControl> 
                  </Grid>
                  <Grid item md={2.5} xs={12} sm={3}>
                  <Typography>Mrate Reconcile Keywors</Typography>
                  <Box >
                <Autocomplete
                    multiple
                    freeSolo
                    options={allOptionsReconcile}
                    value={selectedValuesReconcile}
                    onChange={handleChangeReconcile}
                    inputValue={inputValueR}
                    
                    disableClearable={true}
                    onInputChange={(event, newValue) => setInputValueR(newValue)}
                    onKeyDown={handleKeyDownReconcile} 
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          key={option}
                          label={option}
                          {...getTagProps({ index })}
                          onDelete={() => handleDeleteReconcile(option)}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField {...params} variant="outlined" 
                      sx={{
                        "& .MuiInputBase-root": {
                          height: "max-content",                            
                        },
                      }}
                      label="Select or Add Keywords" />
                    )}
                  />  
                  </Box> 
                  </Grid> 
                     */}  
                </Grid>
                <br />
              <Grid container spacing={1}>
                <Grid item md={3.4} xs={10.2} sm={10.2}>
                  <FormControl fullWidth size="small">
                    <Typography>Keywords</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Keyword"
                      value={category.keyword}
                      onChange={(e) => {
                        setCategory({ ...category, keyword: e.target.value });
                      }}
                    />
                  </FormControl>
                  <Typography color="error">{errormsgeditcheck}</Typography>
                </Grid>
                <Grid item md={0.6} sm={1.3} xs={1.3} marginTop={3}>
                  <Button variant="contained" color="info" sx={{ minWidth: "40px", height: "37px" }} onClick={handleCreateTodocheckeditall}>
                    <FaPlus sx={{ color: "white" }} />
                  </Button>
                </Grid>
                <Grid item md={12} xs={12} sm={12} marginTop={1}>
                {todoscheckall?.map((item, i) => (
                  <div key={i}>
                    {editingIndexcheckall === i ? (
                      <Grid container spacing={2}>
                        <Grid item md={0.2} sm={0.5} xs={0.5}>
                          {i + 1}. &ensp;
                        </Grid>
                        <Grid item md={2.8} sm={9} xs={9}>
                          <FormControl fullWidth size="small">
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              size="small"
                              placeholder="Please Enter Keyword"
                              value={newcheckKeyEdit}
                              onChange={(e) => {
                                setNewcheckKeyEdit(e.target.value);
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={0.5} sm={1.5} xs={1.5}>
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
                        <Grid item md={0.5} sm={1} xs={1}>
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
                        <Grid container spacing={2} key={i}>
                          <Grid item md={0.2} sm={0.5} xs={0.5}>
                            {i + 1}. &ensp;
                          </Grid>
                          <Grid item md={2.8} sm={9} xs={9} sx={{ whiteSpace: "normal", wordBreak: "break-all" }}>
                            {item.keyword}
                          </Grid>

                          <Grid item md={0.5} sm={1.5} xs={1.5}>
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
                          <Grid item md={0.5} sm={1} xs={1}>
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
              </Grid>
            </Grid>
            <br /> 
            <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
              <Button sx={buttonStyles.buttonsubmit} onClick={handleSubmit} disabled={isBtn}>
                SUBMIT
              </Button>
              &nbsp; &nbsp;
              <Button sx={buttonStyles.btncancel} onClick={handleclear}>
                Clear
              </Button>
            </Grid>
          </>
        </Box>
      )}
      <Box>
        {/* edit model */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="lg"
          fullWidth={true}
          sx={{
            // overflow: "visible",
            // "& .MuiPaper-root": {
            //   overflow: "visible",
            // },
            marginTop: "50px",
          }}
        >
          <Box sx={{ padding: "20px 30px" }}>
            <>
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <Typography sx={userStyle.HeaderText}> Edit Production Category</Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>
                    Project <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Selects options={projects} styles={colourStyles} value={{ label: selectedProjectedit, value: selectedProjectedit }} onChange={(e) => setSelectedProjectedit(e.value)} />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={categoryid.name}
                      onChange={(e) => {
                        setCategoryid({ ...categoryid, name: e.target.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Flag Status<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects options={flags} styles={colourStyles} value={{ label: selectedFlagEdit, value: selectedFlagEdit }} onChange={handleFlagChangeEdit} />
                  </FormControl>
                </Grid>

                <Grid item md={2.2} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Flag Status Org</Typography>
                    <Selects options={flags} styles={colourStyles} value={{ label: selectedFlagEditOrg, value: selectedFlagEditOrg }} onChange={handleFlagChangeEditOrg} />
                  </FormControl>
                </Grid>
                <Grid item md={2.2} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Flag Calc Org</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={selectedFlagEditOrg === "No"}
                      placeholder="Please Enter Flag Calc Org"
                      value={categoryid.flagmanualcalcorg}
                      onChange={(e) => {
                        setCategoryid({ ...categoryid, flagmanualcalcorg: e.target.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2.2} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Flag Status Temp</Typography>
                    <Selects options={flags} styles={colourStyles} value={{ label: selectedFlagEditTemp, value: selectedFlagEditTemp }} onChange={handleFlagChangeEditTemp} />
                  </FormControl>
                </Grid>
                <Grid item md={2.2} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Flag Calc Temp</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={selectedFlagEditTemp === "No"}
                      placeholder="Please Enter Flag Calc Temp"
                      value={categoryid.flagmanualcalctemp}
                      onChange={(e) => {
                        setCategoryid({ ...categoryid, flagmanualcalctemp: e.target.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3.2} xs={12} sm={12} marginTop={{ md: 3 }}>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={categoryid.enablepage} />}
                      onChange={(e) =>
                        setCategoryid({
                          ...categoryid,
                          enablepage: !categoryid.enablepage,
                        })
                      }
                      label="Enable Pages in Manual Entry"
                    />
                  </FormGroup>
                </Grid>
                <Grid item md={6} xs={12} sm={3}>
                 <Grid container spacing={1}>
                 <Grid item md={3} xs={3} sm={3}>
                      <FormControl fullWidth size="small">
                        <Typography>Match Case</Typography>
                        <Selects options={[
                          {label:"Equals to", value:"Equals to"},
                          {label:"Contains", value:"Contains"},
                          {label:"Default", value:"Default"},
                          ]
                        } 
                        styles={colourStyles} 
                        value={{ label: categoryid.matchcase, value: categoryid.matchcase }}
                        onChange={(e) => {
                          setCategoryid({ ...categoryid, matchcase: e.value, keywordprimary:"" });
                        }}
                        />

                      </FormControl>
                    
                    </Grid>
                 <Grid item md={5} xs={5} sm={5}>
                      <FormControl fullWidth size="small">
                        <Typography>Mrate Keywords</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          disabled={categoryid.matchcase === "Default"}
                          placeholder="Please Enter Keyword"
                          value={categoryid.keywordprimary}
                          onChange={(e) => {
                            setCategoryid({ ...categoryid, keywordprimary: e.target.value });
                          }}
                        />
                      </FormControl>
                      <Typography color="error">{errormsgeditcheckPrimaryEdit}</Typography>
                    </Grid>
                  
                    <Grid item md={3} xs={3} sm={3}>
                      <FormControl fullWidth size="small">
                        <Typography>Mrate</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Please Enter Mrate"
                          value={categoryid.mrateprimary}
                          onChange={(e) => {
                            setCategoryid({ ...categoryid, mrateprimary: e.target.value });
                          }}
                        />
                      </FormControl>
                      <Typography color="error">{errormsgeditcheckmratePrimaryEdit}</Typography>
                    </Grid>
                    <Grid item md={1} sm={1} xs={1} marginTop={3}>
                      <Button variant="contained" color="success" sx={{ minWidth: "40px", height: "37px" }} onClick={handleCreatePrimaryEdit}>
                        <FaPlus sx={{ color: "white" }} />
                      </Button>
                    </Grid>
                  
                    <Grid item md={12} xs={12} sm={12} marginTop={1}>
                        {primaryEdit?.map((item, i) => (
                          <div >
                            {editingIndexPrimaryEdit === i ? (
                              <>
                              <Grid container spacing={2} key={i}>
                                <Grid item md={0.5} sm={0.5} xs={0.5} sx={{display:"flex", alignItems:"center", }}>
                                  {i + 1}. &ensp;
                                </Grid>
                                <Grid item md={5} sm={5} xs={5}>
                                  <FormControl fullWidth size="small">
                                    <OutlinedInput
                                      id="component-outlined"
                                      type="text"
                                      size="small"
                                      placeholder="Please Enter Keyword"
                                      value={newKeywordPrimaryEditEdit}
                                      onChange={(e) => {
                                        setNewKeywordPrimaryEditEdit(e.target.value);
                                      }}
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item md={2.5} sm={2.5} xs={2.5}>
                                   <FormControl fullWidth size="small">                                 
                                      <Selects options={[
                                        {label:"Equals to", value:"Equals to"},
                                        {label:"Contains", value:"Contains"},
                                        ]
                                      } 
                                      styles={colourStyles} 
                                      value={{ label: newMatchCasePrimaryEditEdit, value: newMatchCasePrimaryEditEdit }}
                                      onChange={(e) => {
                                        setNewMatchCasePrimaryEditEdit(e.value);
                                      }}
                                      />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} sm={2} xs={2}>
                                  <FormControl fullWidth size="small">
                                    <OutlinedInput
                                      id="component-outlined"
                                      type="text"
                                      size="small"
                                      placeholder="Please Enter Mrate"
                                      value={newMratePrimaryEditEdit}
                                      onChange={(e) => {
                                        setNewMratePrimaryEditEdit(e.target.value);
                                      }}
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item md={1.5} sm={1.5} xs={1.5} sx={{display:"flex", justifyContent:"flex-start", alignItems:"center"}}>
                                  <Button
                                    variant="contained"
                                    style={{
                                      minWidth: "20px",
                                      padding:"10px",
                                      background: "transparent",
                                      boxShadow: "none",
                                      marginTop: "-3px !important",
                                      "&:hover": {
                                        background: "#f4f4f4",
                                        borderRadius: "50%",
                                        minWidth: "20px",
                                        boxShadow: "none",
                                      },
                                    }}
                                    onClick={handleUpdatePrimaryEdit}
                                  >
                                    <CheckCircleIcon
                                      style={{
                                        color: "#216d21",
                                        fontSize: "1.5rem",
                                      }}
                                    />
                                  </Button>
                                </Grid>
                                <Grid item md={1} sm={1} xs={1} sx={{display:"flex", justifyContent:"end", alignItems:"center"}}>
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
                                    onClick={() => setEditingIndexPrimaryEdit(-1)}
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
                              <Grid container spacing={1}>
                                <Grid item md={12} sm={12} xs={12}>
                                  <Typography color="error">{errormsgeditPrimaryEdit}</Typography>
                                </Grid>
                              </Grid>
                              </>
                            ) : (
                              <>
                                <Grid container spacing={2} key={i}>
                                  <Grid item md={0.5} sm={0.5} xs={0.5} sx={{display:"flex", alignItems:"center", }}>
                                  <Typography > {i + 1}. </Typography>  
                                  </Grid>
                                  <Grid item md={5} sm={5} xs={5} sx={{display:"flex", alignItems:"center",  whiteSpace: "normal", wordBreak: "break-all" }}>
                                  <Typography > {item.keyword} </Typography> 
                                  </Grid>
                                  <Grid item md={2.5} sm={2.5} xs={2.5} sx={{display:"flex", alignItems:"center", whiteSpace: "normal", wordBreak: "break-all" }}>
                                  <Typography >   {item.matchcase}</Typography> 
                                  </Grid>
                                  <Grid item md={2} sm={2} xs={2} sx={{display:"flex", alignItems:"center", whiteSpace: "normal", wordBreak: "break-all" }}>
                                  <Typography >   {item.mrate}</Typography> 
                                  </Grid>
                                  <Grid item md={1} sm={1} xs={1} sx={{display:"flex", justifyContent:"flex-start", alignItems:"center"}}>
                                    <Button
                                      variant="contained"
                                      disabled={item.matchcase === "Default"}
                                      style={{
                                        minWidth: "30px",
                                        minHeight: "30px",
                                        padding:"6px",
                                        background: "transparent",
                                        boxShadow: "none",
                                        marginTop: "-3px !important",
                                        "&:hover": {
                                          background: "#1976d22e",
                                          borderRadius: "50%",
                                          minWidth: "30px",
                                          minHeight: "30px",
                                          padding:"6px",

                                          boxShadow: "none",
                                        },
                                      }}
                                      onClick={() => handleEditPrimaryEdit(i)}
                                    >
                                      <FaEdit
                                       
                                        style={{
                                          color: item.matchcase === "Default" ? "lightgrey" : "#1976d2" ,
                                          fontSize: "1.2rem",
                                        }}
                                      />
                                    </Button>
                                  </Grid>
                                  <Grid item md={1} sm={1} xs={1} sx={{display:"flex", justifyContent:"end", alignItems:"center"}}>
                                    <Button onClick={(e) => handleDeletePrimaryEdit(i)} 
                                      style={{
                                        minWidth: "30px",
                                        minHeight: "30px",
                                        padding:"6px",
                                        background: "transparent",
                                        boxShadow: "none",
                                        marginTop: "-3px !important",
                                        "&:hover": {
                                          background: "#e7afb745",
                                          borderRadius: "50%",
                                          minWidth: "30px",
                                          minHeight: "30px",
                                          padding:"6px",
                                          boxShadow: "none",
                                        },
                                      }}
                                      >
                                      <FaTrash
                                        style={{
                                          color: "#b92525",
                                          fontSize: "1rem",
                                        }}
                                      />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </>
                            )}
                          </div>
                        ))}
                    </Grid>              
                 </Grid>  

              </Grid>
                {/* <Grid item md={1.5} xs={12} sm={3}>
                 <FormControl fullWidth size="small"> 
                    <Typography>Mrate Primary</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Mrate-Primary"
                      value={categoryid.mrateprimary}
                      onChange={(e) => {
                        setCategoryid({ ...categoryid, mrateprimary: e.target.value });
                      }}
                    />
                  </FormControl> 
                  </Grid>
                <Grid item md={2.5} xs={12} sm={3}>              
                  <Typography>Mrate Primary Keywors</Typography>
                  <Box >
                  <Autocomplete
                      multiple
                      freeSolo
                      options={allOptionsPrimaryEdit}
                      value={selectedValuesPrimaryEdit}
                      onChange={handleChangePrimaryEdit}
                      inputValue={inputValuePE}
                      
                      disableClearable={true}
                      onInputChange={(event, newValue) => setInputValuePE(newValue)}
                      onKeyDown={handleKeyDownPrimaryEdit} 
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            key={option}
                            label={option}
                            {...getTagProps({ index })}
                            onDelete={() => handleDeletePrimaryEdit(option)}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField {...params} variant="outlined" 
                        sx={{
                          "& .MuiInputBase-root": {
                            height: "max-content",                            
                          },
                        }}
                         label="Select or Add Keywords" />
                      )}
                    />  
                    </Box>          
                </Grid>                
                <Grid item md={1.5} xs={12} sm={3}>
                 <FormControl fullWidth size="small"> 
                    <Typography>Mrate Secondary</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Mrate-Secondary"
                      value={categoryid.mratesecondary}
                      onChange={(e) => {
                        setCategoryid({ ...categoryid, mratesecondary: e.target.value });
                      }}
                    />
                  </FormControl> 
                  </Grid>
                  <Grid item md={2.5} xs={12} sm={3}>              
                      <Typography>Mrate Secondary Keywords</Typography>
                      <Box >
                      <Autocomplete
                          multiple
                          freeSolo
                          options={allOptionsSecondaryEdit}
                          value={selectedValuesSecondaryEdit}
                          onChange={handleChangeSecondaryEdit}
                          inputValue={inputValueSE}
                          
                          disableClearable={true}
                          onInputChange={(event, newValue) => setInputValueSE(newValue)}
                          onKeyDown={handleKeyDownSecondaryEdit} 
                          renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                              <Chip
                                key={option}
                                label={option}
                                {...getTagProps({ index })}
                                onDelete={() => handleDeleteSecondaryEdit(option)}
                              />
                            ))
                          }
                          renderInput={(params) => (
                            <TextField {...params} variant="outlined" 
                            sx={{
                              "& .MuiInputBase-root": {
                                height: "max-content",                            
                              },
                            }}
                            label="Select or Add Keywords" />
                          )}
                        />  
                        </Box>          
                      </Grid>   
                  <Grid item md={1.5} xs={12} sm={3}>
                  <FormControl fullWidth size="small"> 
                    <Typography>Mrate Reconcile</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Mrate-Reconcile"
                      value={categoryid.mratereconcile}
                      onChange={(e) => {
                        setCategoryid({ ...categoryid, mratereconcile: e.target.value });
                      }}
                    />
                  </FormControl> 
                  </Grid>
                  <Grid item md={2.5} xs={12} sm={3}>
                  <Typography>Mrate Reconcile Keywors</Typography>
                  <Box >
                <Autocomplete
                    multiple
                    freeSolo
                    options={allOptionsReconcileEdit}
                    value={selectedValuesReconcileEdit}
                    onChange={handleChangeReconcileEdit}
                    inputValue={inputValueRE}
                    
                    disableClearable={true}
                    onInputChange={(event, newValue) => setInputValueRE(newValue)}
                    onKeyDown={handleKeyDownReconcileEdit} 
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          key={option}
                          label={option}
                          {...getTagProps({ index })}
                          onDelete={() => handleDeleteReconcileEdit(option)}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField {...params} variant="outlined" 
                      sx={{
                        "& .MuiInputBase-root": {
                          height: "max-content",                            
                        },
                      }}
                      label="Select or Add Keywords" />
                    )}
                  />  
                  </Box> 
                  </Grid>  */}

               

              </Grid>
              <br />
              <Grid container spacing={2}>
              <Grid item md={5} xs={10} sm={10}>
                  <FormControl fullWidth size="small">
                    <Typography>Keywords</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Keyword"
                      value={categoryid.keyword}
                      onChange={(e) => {
                        setCategoryid({ ...categoryid, keyword: e.target.value });
                      }}
                    />
                  </FormControl>
                  <Typography color="error">{errormsgeditcheckEdit}</Typography>
                </Grid>
                <Grid item md={1} sm={2} xs={2} marginTop={3}>
                  <Button variant="contained" color="primary" sx={{ minWidth: "40px", height: "37px" }} onClick={handleCreateTodocheckeditallEdit}>
                    <FaPlus sx={{ color: "white" }} />
                  </Button>
                </Grid>
              <Grid item md={12} xs={12} sm={12}>
              {todoscheckallEdit?.map((item, i) => (
                <div>
                  {editingIndexcheckallEdit === i ? (
                    <Grid container spacing={2}  key={i}>
                      <Grid item md={0.3} sm={0.5} xs={0.5}>
                        {i + 1}. &ensp;
                      </Grid>
                      <Grid item md={3.8} sm={9} xs={9}>
                        <FormControl fullWidth size="small">
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            size="small"
                            placeholder="Please Enter Keyword"
                            value={newcheckKeyEditPop}
                            onChange={(e) => {
                              setNewcheckKeyEditPop(e.target.value);
                            }}
                          />
                        </FormControl>
                        <Typography color="error">{errormsgeditcheckallEdit}</Typography>
                      </Grid>

                      <Grid item md={1} sm={1.5} xs={1.5}>
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
                          onClick={handleUpdateTodocheckallEdit}
                        >
                          <CheckCircleIcon
                            style={{
                              color: "#216d21",
                              fontSize: "1.5rem",
                            }}
                          />
                        </Button>
                      </Grid>
                      <Grid item md={1} sm={1} xs={1}>
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
                          onClick={() => setEditingIndexcheckallEdit(-1)}
                        >
                          <CancelIcon
                            style={{
                              color: "#b92525",
                              fontSize: "1.5rem",
                            }}
                          />
                        </Button>
                      </Grid>
                      <br />
                    </Grid>
                  ) : (
                    <>
                      <Grid container spacing={2} key={i}>
                        <Grid item md={0.3} sm={0.5} xs={0.5}>
                          {i + 1}. &ensp;
                        </Grid>
                        <Grid item md={3.8} sm={9} xs={9} sx={{ whiteSpace: "normal", wordBreak: "break-all" }}>
                          {item.keyword}
                        </Grid>

                        <Grid item md={1} sm={1.5} xs={1.5}>
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
                            onClick={() => handleEditTodocheckallEdit(i)}
                          >
                            <FaEdit
                              style={{
                                color: "#1976d2",
                                fontSize: "1.2rem",
                              }}
                            />
                          </Button>
                        </Grid>
                        <Grid item md={1} sm={1} xs={1}>
                          <Button onClick={(e) => handleDeleteTodocheckeditallEdit(i)} sx={{ borderRadius: "50%", minWidth: "35px", minHeight: "35px", marginTop: "-8px" }}>
                            <FaTrash
                              style={{
                                color: "#b92525",
                                fontSize: "0.9rem",
                              }}
                            />
                          </Button>
                        </Grid>
                        <br />
                      </Grid>
                    </>
                  )}
                </div>
              ))}
            </Grid>
            </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={6}>
                  <Button sx={buttonStyles.buttonsubmit} onClick={() => editSubmit()}>
                    {" "}
                    Update
                  </Button>
                </Grid>
                <Grid item md={6} xs={12} sm={6}>
                  <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit}>
                    {" "}
                    Cancel{" "}
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </Dialog>
      </Box>
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lproductioncategory") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            {/*       
          <Box sx={userStyle.container} > */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Production Category List</Typography>
            </Grid>
            <Grid container spacing={2} style={userStyle.dataTablestyle}>
              <Grid item md={2} xs={12} sm={12}>
                <Typography>&nbsp;</Typography>
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
                  </Select>
                </Box>
              </Grid>
              <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box>
                  {isUserRoleCompare?.includes("excelproductioncategory") && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          fetchAllCategoryArray();
                          setFormat("xl");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileExcel />
                        &ensp;Export to Excel&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvproductioncategory") && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          fetchAllCategoryArray();
                          setFormat("csv");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileCsv />
                        &ensp;Export to CSV&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("printproductioncategory") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfproductioncategory") && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true);
                          fetchAllCategoryArray();
                        }}
                      >
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imageproductioncategory") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                        {" "}
                        <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                      </Button>
                    </>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <FormControl fullWidth size="small">
                    <Typography>Search</Typography>
                    <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
                  </FormControl>
                </Box>
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
            {isUserRoleCompare?.includes("bdproductioncategory") && (
              <Button sx={buttonStyles.buttonbulkdelete} onClick={handleClickOpenalert}>
                Bulk Delete
              </Button>
            )}
             &ensp;
            {isUserRoleCompare?.includes("bdproductioncategory") && (
              <Button sx={{...buttonStyles.buttonsubmit, textTransform:"capitalize"}} variant="contained" onClick={handleSubmitBulkKeyword}>
                Bulk Update Keywords
              </Button>
            )}
            <br />
            {!tableLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  minHeight: "350px",
                }}
              >
                <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
              </Box>
            ) : (
              <>
                <Box
                  style={{
                    width: "100%",
                    overflowY: "hidden", // Hide the y-axis scrollbar
                  }}
                >
                  <CustomStyledDataGrid
                    onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                    rows={rowsWithCheckboxes}
                    columns={columnDataTable.filter((column) => columnVisibility[column.field])}
                    onSelectionModelChange={handleSelectionChange}
                    selectionModel={selectedRows}
                    autoHeight={true}
                    ref={gridRef}
                    density="compact"
                    hideFooter
                    getRowClassName={getRowClassName}
                    disableRowSelectionOnClick
                  />
                </Box>
                {/* <Box>
                  <Pagination
                    page={searchQuery !== "" ? 1 : page}
                    pageSize={pageSize}
                    totalPages={searchQuery !== "" ? 1 : totalPages}
                    onPageChange={handlePageChange}
                    pageItemLength={filteredDatas?.length}
                    totalProjects={searchQuery !== "" ? filteredDatas?.length : totalProjects}
                  />
                </Box> */}
                <Box style={userStyle.dataTablestyle}>
                  <Box>
                    Showing {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filteredDatas.length)} of {filteredDatas.length} entries
                  </Box>
                  <Box>
                    <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                      <FirstPageIcon />
                    </Button>
                    <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                      <NavigateBeforeIcon />
                    </Button>
                    {pageNumbers?.map((pageNumber) => (
                      <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={page === pageNumber ? "active" : ""} disabled={page === pageNumber}>
                        {pageNumber}
                      </Button>
                    ))}
                    {lastVisiblePage < totalPages && <span>...</span>}
                    <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                      <NavigateNextIcon />
                    </Button>
                    <Button onClick={() => setPage(totalPages)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                      <LastPageIcon />
                    </Button>
                  </Box>
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
      {/* view model */}
      <Dialog open={openview} onClose={handleCloseview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth={true} sx={{ marginTop: "80px" }}>
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> View Production Category</Typography>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Project</Typography>
                  <Typography>{categoryid.project}</Typography>
                </FormControl>
              </Grid>
              <br />

              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Name</Typography>
                  <Typography>{categoryid.name}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Flag Status</Typography>
                  <Typography>{categoryid.flagstatus}</Typography>
                </FormControl>
              </Grid>

              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Enable page</Typography>
                  <Typography>{categoryid?.enablepage}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Flag Status Org</Typography>
                  <Typography>{categoryid.flagstatusorg}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Flag Manual Calc Org</Typography>
                  <Typography>{categoryid.flagmanualcalcorg}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Flag Status Temp</Typography>
                  <Typography>{categoryid.flagstatustemp}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Flag Manual Calc Temp</Typography>
                  <Typography>{categoryid.flagmanualcalctemp}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">KeyWords</Typography>
                  <Typography>{categoryid?.keyword?.toString()}</Typography>
                </FormControl>
              </Grid>

              <br />
            </Grid>
            <br /> <br />
            <Grid container spacing={2}>
              <Button sx={buttonStyles.btncancel} onClick={handleCloseview}>
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>
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

      <Dialog open={isEditBulkOpen.open} onClose={handleCloseBulkEditMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <Typography variant="h6">
            {isEditBulkOpen.data.subcategorycount > 0 && isEditBulkOpen.data.unitratecount > 0
              ? `This ${oldname} category linked in Subcategory and Unitrate`
              : isEditBulkOpen.data.subcategorycount > 0
                ? `This ${oldname} category linked in Subcategory`
                : `This ${oldname} category linked in Unitrate`}
            Do you want to update?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" sx={buttonStyles.btnsubmit} onClick={() => hanleBulkOverallEditUpdate(isEditBulkOpen.data)}>
            Ok
          </Button>
          <Button variant="contained" sx={buttonStyles.btncancel} color="error" onClick={handleCloseBulkEditMod}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDeleteBulkNotLinkedOpen.open} onClose={handleCloseBulkNotLinkedClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
          <Typography variant="h6">{showAlert}</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" sx={buttonStyles.btnsubmit} onClick={() => bulkNotLinkedUpdate(isDeleteBulkNotLinkedOpen.data)}>
            Ok
          </Button>
          <Button variant="contained" sx={buttonStyles.btncancel} onClick={handleCloseBulkNotLinkedClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* <Dialog open={isBulkKeywordUpdate} onClose={handleBulkUpdateKeywordsClose} maxWidth="lg" aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent >
          <Typography variant="h6">{"Keywords"}</Typography>
          <br/>
            <Grid container spacing={2}>
              <Grid item md={1} xs={1} sm={1} sx={{display:"flex",justifyContent:"center", alignItems:"center"}}>
                 <Box > 
                    <Checkbox checked={selectPrimaryChecked} onChange={() => setSelectPrimaryChecked(!selectPrimaryChecked)} />
                  </Box> 
              </Grid>
              <Grid item md={1.5} xs={11} sm={1.5}>
                 <FormControl fullWidth size="small"> 
                    <Typography>Mrate Primary</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Mrate-Primary"
                      value={categoryBulk.mrateprimary}
                      onChange={(e) => {
                        setCategoryBulk({ ...categoryBulk, mrateprimary: e.target.value });
                      }}
                    />
                  </FormControl> 
                  </Grid>
                <Grid item md={3.5} xs={12} sm={3.5}>              
                  <Typography>Mrate Primary Keywors</Typography>
                  <Box >
                  <Autocomplete
                      multiple
                      freeSolo
                      options={allOptionsPrimaryBulk}
                      value={selectedValuesPrimaryBulk}
                      onChange={handleChangePrimaryBulk}
                      inputValue={inputValueBulkP}
                      
                      disableClearable={true}
                      onInputChange={(event, newValue) => setInputValueBulkP(newValue)}
                      onKeyDown={handleKeyDownPrimaryBulk} 
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            key={option}
                            label={option}
                            {...getTagProps({ index })}
                            onDelete={() => handleDeletePrimaryBulk(option)}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField {...params} variant="outlined" 
                        sx={{
                          "& .MuiInputBase-root": {
                            height: "max-content",                            
                          },
                        }}
                         label="Select or Add Keywords" />
                      )}
                    />  
                    </Box>          
                </Grid> 
                <Grid item md={1} xs={1} sm={1} sx={{display:"flex",justifyContent:"center", alignItems:"center"}}>
                 <Box sx={{display:"flex", alignItems:"center"}}> 
                    <Checkbox checked={selectSecondaryChecked} onChange={() => setSelectSecondaryChecked(!selectSecondaryChecked)} />
                  </Box> 
              </Grid>               
              <Grid item md={1.5} xs={11} sm={1.5}>
                 <FormControl fullWidth size="small"> 
                    <Typography>Mrate Secondary</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Mrate-Secondary"
                      value={categoryBulk.mratesecondary}
                      onChange={(e) => {
                        setCategoryBulk({ ...categoryBulk, mratesecondary: e.target.value });
                      }}
                    />
                  </FormControl> 
                  </Grid>
                <Grid item md={3.5} xs={12} sm={3.5}>              
                  <Typography>Mrate Secondary Keywors</Typography>
                  <Box >
                  <Autocomplete
                      multiple
                      freeSolo
                      options={allOptionsSecondaryBulk}
                      value={selectedValuesSecondaryBulk}
                      onChange={handleChangeSecondaryBulk}
                      inputValue={inputValueBulkP}
                      
                      disableClearable={true}
                      onInputChange={(event, newValue) => setInputValueBulkP(newValue)}
                      onKeyDown={handleKeyDownSecondaryBulk} 
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            key={option}
                            label={option}
                            {...getTagProps({ index })}
                            onDelete={() => handleDeleteSecondaryBulk(option)}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField {...params} variant="outlined" 
                        sx={{
                          "& .MuiInputBase-root": {
                            height: "max-content",                            
                          },
                        }}
                         label="Select or Add Keywords" />
                      )}
                    />  
                    </Box>          
                </Grid> 
                  <Grid item md={1} xs={1} sm={1} sx={{display:"flex",justifyContent:"center", alignItems:"center"}}>
                 <Box sx={{display:"flex", alignItems:"center"}}> 
                    <Checkbox checked={selectReconcileChecked} onChange={() => setSelectReconcileChecked(!selectReconcileChecked)} />
                  </Box> 
              </Grid> 
              <Grid item md={1.5} xs={11} sm={1.5}>
                <FormControl fullWidth size="small"> 
                  <Typography>Mrate Reconcile</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Mrate-Reconcile"
                    value={categoryBulk.mratereconcile}
                    onChange={(e) => {
                      setCategoryBulk({ ...categoryBulk, mratereconcile: e.target.value });
                    }}
                  />
                </FormControl> 
                </Grid>
                <Grid item md={3.5} xs={12} sm={3.5}>              
                <Typography>Mrate Reconcile Keywors</Typography>
                <Box >
                <Autocomplete
                    multiple
                    freeSolo
                    options={allOptionsReconcileBulk}
                    value={selectedValuesReconcileBulk}
                    onChange={handleChangeReconcileBulk}
                    inputValue={inputValueBulkP}
                    
                    disableClearable={true}
                    onInputChange={(event, newValue) => setInputValueBulkP(newValue)}
                    onKeyDown={handleKeyDownReconcileBulk} 
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          key={option}
                          label={option}
                          {...getTagProps({ index })}
                          onDelete={() => handleDeleteReconcileBulk(option)}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField {...params} variant="outlined" 
                      sx={{
                        "& .MuiInputBase-root": {
                          height: "max-content",                            
                        },
                      }}
                        label="Select or Add Keywords" />
                    )}
                  />  
                  </Box>          
                </Grid> 
              </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" sx={buttonStyles.btnsubmit} onClick={() => handleBulkUpdateKeywords()}>
            Update
          </Button>
          <Button variant="contained" sx={buttonStyles.btncancel} onClick={handleBulkUpdateKeywordsClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog> */}
      {/* EXTERNAL COMPONENTS -------------- START */}
      {/* VALIDATION */}
      <MessageAlert openPopup={openPopupMalert} handleClosePopup={handleClosePopupMalert} popupContent={popupContentMalert} popupSeverity={popupSeverityMalert} />
      {/* SUCCESS */}
      <AlertDialog openPopup={openPopup} handleClosePopup={handleClosePopup} popupContent={popupContent} popupSeverity={popupSeverity} />
      {/* PRINT PDF EXCEL CSV */}
      <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={rowDataTable ?? []}
        itemsTwo={categoriesFilterArray ?? []}
        filename={"Production Category"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup openInfo={openInfo} handleCloseinfo={handleCloseinfo} heading="Production Category Info" addedby={addedby} updateby={updateby} />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation open={isDeleteOpen} onClose={handleCloseMod} onConfirm={delModule} title="Are you sure?" confirmButtonText="Yes" cancelButtonText="Cancel" />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation open={isDeleteOpencheckbox} onClose={handleCloseModcheckbox} onConfirm={delProjectcheckbox} title="Are you sure?" confirmButtonText="Yes" cancelButtonText="Cancel" />
      {/* PLEASE SELECT ANY ROW */}
      <PleaseSelectRow open={isDeleteOpenalert} onClose={handleCloseModalert} message="Please Select any Row" iconColor="orange" buttonText="OK" />
      {/* EXTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}

export default CategoryMaster;