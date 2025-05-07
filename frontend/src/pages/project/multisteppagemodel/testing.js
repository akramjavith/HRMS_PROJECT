import React, { useState, useContext, useEffect } from "react";
import { Box, Typography, Checkbox, Select, Dialog, FormControlLabel, Divider, MenuItem, TextareaAutosize, DialogContent, DialogActions, FormControl, Grid, OutlinedInput, Button, TextField } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Selects from "react-select";
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import pdfIcon from "../../../components/Assets/pdf-icon.png";
import wordIcon from "../../../components/Assets/word-icon.png";
import excelIcon from "../../../components/Assets/excel-icon.png";
import csvIcon from "../../../components/Assets/CSV.png";
import fileIcon from "../../../components/Assets/file-icons.png";
import StyledDataGrid from "../../../components/TableStyle";
import FilePresentIcon from "@mui/icons-material/FilePresent";
import axios from "axios";
import CancelIcon from "@mui/icons-material/Cancel";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import { makeStyles } from "@material-ui/core";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import CodeIcon from "@mui/icons-material/Code";
import PermMediaOutlinedIcon from "@mui/icons-material/PermMediaOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";
import InsertChartOutlinedOutlinedIcon from "@mui/icons-material/InsertChartOutlinedOutlined";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { NotificationContainer, NotificationManager } from "react-notifications";
import "react-notifications/lib/notifications.css";
const useStyles = makeStyles((theme) => ({
  inputs: {
    display: "none",
  },
  preview: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: theme.spacing(2),
    "& > *": {
      margin: theme.spacing(1),
    },
    complete: {
      textTransform: "capitalize !IMPORTANT",
      padding: "7px 19px",
      backgroundColor: "#00905d",
      height: "fit-content",
    },
  },
}));

function SubmoduleViewList({ sendDataToParent, checkpagemodel, testingdata, sendDataToParentTestUI, id }) {
  const classes = useStyles();
  // component state
  const [componentId, setComponentId] = useState([]);
  const [subcomponentId, setSubComponentId] = useState([]);
  const [componentGroupingId, setComponentgrpingId] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState({
    value: "",
    label: "Please Select Component Name",
  });
  const [selectedSubComponent, setSelectedSubComponent] = useState({
    value: "",
    label: "Please Select SubComponent Name",
  });
  const [selectedComponentgrp, setSelectedComponentgrp] = useState({
    value: "",
    label: "Please Select ComponentGroup Name",
  });
  const [compgrouping, setCompgrouping] = useState("");
  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  //   new todo states
  const [todoscheck, setTodoscheck] = useState([]);
  const [datafetch, setDatafetch] = useState("");
  const [existingoption, setExistingoption] = useState("");
  const [name, setName] = useState("");
  const [inputvalue, setInputvalue] = useState("");
  const [sizeheight, setSizeheight] = useState("Default Value");
  const [sizewidth, setSizewidth] = useState("Default Value");
  const [colour, setColour] = useState("");
  const [direction, setDirection] = useState("");
  const [position, setPosition] = useState("");
  const [countValue, setCountValue] = useState(0);
  const [datafetchedit, setDatafetchedit] = useState("");
  const [existingoptionedit, setExistingoptionedit] = useState("");
  const [nameedit, setNameedit] = useState("");
  const [inputvalueedit, setInputvalueedit] = useState("");
  const [sizeheightedit, setSizeheightedit] = useState("");
  const [sizewidthedit, setSizewidthedit] = useState("");
  const [colouredit, setColouredit] = useState("");
  const [directionedit, setDirectionedit] = useState("");
  const [positionedit, setPositionedit] = useState("");
  const [getTodoIndex, setgetTodoIndex] = useState(-1);
  const [refCode, setRefCode] = useState("");
  const [refImage, setRefImage] = useState([]);
  const [refDocuments, setrefDocuments] = useState([]);
  const [refLinks, setRefLinks] = useState("");
  const [refDetails, setRefDetails] = useState("");
  const [refIndex, setRefIndex] = useState("");
  const [refCodeEdit, setRefCodeEdit] = useState("");
  const [refImageEdit, setRefImageEdit] = useState([]);
  const [refDocumentsEdit, setrefDocumentsEdit] = useState([]);
  const [refLinksEdit, setRefLinksEdit] = useState("");
  const [refDetailsEdit, setRefDetailsEdit] = useState("");
  const [refIndexEdit, setRefIndexEdit] = useState("");
  const [componentCheckBox, setComponentCheckBox] = useState(false);
  const [subComponentData, setComponentData] = useState([]);
  //NEWDATATABLE

  //Datatable FOR INCOMPLETE
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [searchQueryManage, setSearchQueryManage] = useState("");

  //Datatable FOR INCOMPLETE
  const [pageComplete, setPageComplete] = useState(1);
  const [pageSizeComplete, setPageSizeComplete] = useState(10);
  const [selectedRowsComplete, setSelectedRowsComplete] = useState([]);
  const [selectAllCheckedComplete, setSelectAllCheckedComplete] = useState(false);
  const [searchQueryManageComplete, setSearchQueryManageComplete] = useState("");

  const [editincompletedata, setEditincompletedata] = useState({
    name: "",
    inputvalue: "",
    datafetch: "",
    existingoption: "",
  });
  const [editincompletedataEdit, setEditincompletedataEdit] = useState({
    name: "",
    inputvalue: "",
    datafetch: "",
    existingoption: "",
    idval: "",
  });

  const [editincompletedataEditid, setEditincompletedataEditid] = useState("");
  const [editincompleteid, setEditincompleteid] = useState("");

  const [deleteTestUIdata, setDeleteTestUIdata] = useState();
  const [deleteTestDevelopdata, setDeleteTestDevelopment] = useState();

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

  const [isEditOpen, setIsEditOpen] = useState(false);
  //Edit model...
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    setEditincompletedata({
      ...editincompletedata,
      inputvalue: "",
      datafetch: "",
      existingoption: "",
    });
  };

  const [isEditOpenComplete, setIsEditOpenComplete] = useState(false);
  //Edit model...
  const handleClickOpenEditComplete = () => {
    setIsEditOpenComplete(true);
  };
  const handleCloseModEditComplete = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpenComplete(false);
    setEditincompletedataEdit({
      ...editincompletedataEdit,
      inputvalue: "",
      datafetch: "",
      existingoption: "",
    });
  };

  const [isErrorOpenRef, setIsErrorOpenRef] = useState(false);
  // const handleClickOpenRef = () => {
  //     setIsErrorOpenRef(true);
  // };
  const handleCloseRef = () => {
    setIsErrorOpenRef(false);
    setRefCode("");
    setRefImage([]);
    setRefDetails("");
    setRefLinks("");
    setrefDocuments([]);
    setValue("1");
  };

  // Error Popup model
  const [isDeleteUIdataopen, setIsDeleteUIdataopen] = useState(false);
  const handleClickOpenUIdataopen = () => {
    setIsDeleteUIdataopen(true);
  };
  const handleCloseUIdataopen = () => {
    setIsDeleteUIdataopen(false);
  };

  // Error Popup model
  const [isDeleteDevelopdataopen, setIsDeleteDevelopdataopen] = useState(false);
  const handleClickOpenDevelopdataopen = () => {
    setIsDeleteDevelopdataopen(true);
  };
  const handleCloseDevelopdataopen = () => {
    setIsDeleteDevelopdataopen(false);
  };

  const handleCreateTodocheck = (id) => {
    setInputvalue(inputvalue === "" ? subComponentData.inputvalue : inputvalue);

    const newTodos = Array.from({ length: countValue }, (item, index) => {
      // if (index === id) {
      //   return {
      //     subcomponent: selectedSubComponent.value,
      //     subEstType: subComponentData?.estimationType,
      //     subEstTime: subComponentData?.estimationTime,
      //     idval: todoscheck.length + index,
      //     edit: "notdone",
      //     todo: "istodo",
      //     datafetch: datafetch,
      //     existingoption: existingoption,
      //     name: name,
      //     inputvalue: inputvalue,
      //     refCode: subComponentData?.refCode,
      //     refImage: subComponentData?.refImage,
      //     refDocuments: subComponentData?.refDocuments,
      //     refLinks: subComponentData?.refLinks,
      //     refDetails: subComponentData?.refDetails,
      //   };
      // } else {
      return {
        subcomponent: selectedSubComponent.value,
        subEstType: subComponentData?.estimationType,
        subEstTime: subComponentData?.estimationTime,
        idval: todoscheck.length + index,
        edit: "done",
        todo: "istodo",
        datafetch: datafetch,
        existingoption: existingoption,
        name: name,
        inputvalue: inputvalue === "" ? subComponentData.inputvalue : inputvalue,
        refCode: subComponentData?.refCode,
        refImage: subComponentData?.refImage,
        refDocuments: subComponentData?.refDocuments,
        refLinks: subComponentData?.refLinks,
        refDetails: subComponentData?.refDetails,
      };
      // }
    });

    setTodoscheck([...todoscheck, ...newTodos]);
  };

  const [editingIndexedit, setEditingIndexedit] = useState(-1);

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
    name: true,
    actions: true,
    inputvalue: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  const handleDeleteTodoEdit = (id) => {
    const updatedTodos = todoscheck.filter((todo) => todo.idval !== id);
    setTodoscheck(updatedTodos);
  };

  ///Create Edit todo Functionality
  const handleUpdateTodoEdit = (id) => {
    // Update the todo with the specified id
    setEditingIndexedit(id);
    const updatedTodos = todoscheck.map((todo) => {
      if (todo.idval === id) {
        return {
          ...todo,
          edit: "done",
          subcomponent: selectedSubComponent.value,
          subrefCode: subComponentData?.refCode,
          subrefImage: subComponentData?.refImage,
          subrefDocuments: subComponentData?.refDocuments,
          subrefLinks: subComponentData?.refLinks,
          subrefDetails: subComponentData?.refDetails,
          datafetch: datafetch,
          existingoption: existingoption,
          name: name,
          inputvalue: inputvalue,
        };
        // ... update other values ...
      }
      return todo;
    });

    setTodoscheck(updatedTodos);
    setDatafetch("");
    setExistingoption("");
    setName("");
    setInputvalue("");
  };

  ///Create Edit todo Functionality
  const handleUpdateTodo = (id) => {
    // Update the todo with the specified id
    setEditingIndexedit(id);
    const updatedTodos = todoscheck.map((todo) => {
      if (todo.idval === id) {
        return {
          ...todo,
          edit: "done",
          datafetch: datafetchedit,
          existingoption: existingoptionedit,
          name: nameedit,
          inputvalue: inputvalueedit,
        };
        // ... update other values ...
      }
      return todo;
    });
    setTodoscheck(updatedTodos);
    setgetTodoIndex(-1);
  };

  ///Create Edit todo Functionality
  const handleEditTodo = (id) => {
    // Update the todo with the specified id
    setEditingIndexedit(id);
    const updatedTodos = todoscheck.map((todo) => {
      if (todo.idval === id) {
        return { ...todo, edit: "done" };
        // ... update other values ...
      }
      return todo;
    });
    setTodoscheck(updatedTodos);
    setgetTodoIndex(-1);
  };

  ///Edit todo Functionality
  const handleEditTodoEdit = (id) => {
    setEditingIndexedit(id);

    const updatedTodos = todoscheck.map((todo) => {
      if (todo.idval === id) {
        return { ...todo, edit: "edit" };
      }
      return todo;
    });
    const updatedTodosfield = todoscheck
      .filter((todo) => {
        return todo.idval === id;
      })
      .map((todo) => ({ ...todo, edit: "edit" }));

    setTodoscheck(updatedTodos);
    setDatafetchedit(updatedTodosfield[0]?.datafetch);
    setExistingoptionedit(updatedTodosfield[0]?.existingoption);
    setNameedit(updatedTodosfield[0]?.name);
    setInputvalueedit(updatedTodosfield[0]?.inputvalue);
    // ... set other edited values ...
  };

  //get all subcomponents.
  const fetchComponentGrp = async () => {
    try {
      let res = await axios.get(SERVICE.COMPONENTSGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const ans = res?.data?.compgrouping?.map((d) => ({
        ...d,
        label: d.name,
        value: d.name,
      }));
      const allCompGroup = [{ name: "ALL", label: "ALL", value: "ALL" }, ...ans];
      setComponentgrpingId(allCompGroup);

      let result = await axios.get(SERVICE.COMPONENTMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const answer = result.data.component?.map((d) => ({
        ...d,
        label: d.componentname,
        value: d.componentname,
      }));
      const allComp = [{ name: "ALL", label: "ALL", value: "ALL" }, ...answer];
      setComponentId(allComp);
   } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //get all subcomponents.
  const fetchComponentGrpCheck = async () => {
    try {
      if (selectedComponentgrp.label === "ALL" || componentCheckBox === true) {
        let res = await axios.get(SERVICE.COMPONENTMASTER, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        const ans = res.data.component?.map((d) => ({
          ...d,
          label: d.componentname,
          value: d.componentname,
        }));
        const allCompGroup = [{ name: "ALL", label: "ALL", value: "ALL" }, ...ans];
        setComponentId(allCompGroup);
      } else {
        let res = await axios.get(SERVICE.COMPONENTSGROUPING, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        let result = res.data.compgrouping.length > 0 ? res.data.compgrouping.filter((d) => d.name === compgrouping) : "";
        const ans =
          result[0]?.componentgroups.length > 0
            ? result[0]?.componentgroups?.map((d) => ({
                ...d,
                label: d.componentname,
                value: d.componentname,
              }))
            : "";
        const allCompGroup = [{ name: "ALL", label: "ALL", value: "ALL" }, ...ans];

        setComponentId(allCompGroup);
      }
   } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //get all subcomponents.
  const fetchSubComponent = async (e) => {
    try {
      if (e === "ALL") {
        let res = await axios.get(SERVICE.SUBCOMPONENTMASTER, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        setSubComponentId(
          res?.data?.subcomponent?.map((d) => ({
            ...d,
            label: d.subCompName,
            value: d.subCompName,
          }))
        );
      } else {
        let res = await axios.get(SERVICE.SUBCOMPONENTMASTER, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        let result = res.data.subcomponent.filter((d) => d.componentname === e);
        setSubComponentId(
          result?.map((d) => ({
            ...d,
            label: d.subCompName,
            value: d.subCompName,
          }))
        );
      }

      // setComponentId(res?.data?.scomponent);
   } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const getCompGroupingName = (e) => {
    let ans = e;
    setCompgrouping(ans);
  };

  const fetchsubcomponentData = async (e) => {
    try {
      let res = await axios.get(SERVICE.SUBCOMPONENTMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let result = res?.data?.subcomponent?.filter((d) => d.subCompName === e);
      setComponentData(result[0]);
   } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const getRowDataId = (index) => {
    setRefCode(todoscheck[index].refCode);
    setRefImage(todoscheck[index].refImage);
    setrefDocuments(todoscheck[index].refDocuments);
    setRefLinks(todoscheck[index].refLinks);
    setRefDetails(todoscheck[index].refDetails);
    setIsErrorOpenRef(true);
  };

  //id for login...
  let authToken = localStorage.APIToken;
  const [completedDataTest, setcompletedDataTest] = useState([]);

  //get single row to edit....
  const fetchCompleteDevelopData = async () => {
    try {
      if (checkpagemodel === "PAGEMODEL") {
        let res = await axios.get(`${SERVICE.PAGEMODEL_SINGLE}/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        setcompletedDataTest(res?.data?.spagemodel?.testing);
      } else if (checkpagemodel === "SUBMODULE") {
        let res = await axios.get(`${SERVICE.SUBMODULE_SINGLE}/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        setcompletedDataTest(res?.data?.ssubmodule?.testing);
      }
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const [completedDataTestUI, setcompletedDataTestUI] = useState([]);

  //get single row to edit....
  const fetchCompleteUIData = async () => {
    try {
      if (checkpagemodel === "PAGEMODEL") {
        let res = await axios.get(`${SERVICE.PAGEMODEL_SINGLE}/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setcompletedDataTestUI(res?.data?.spagemodel?.testinguidesign);
      } else if (checkpagemodel === "SUBMODULE") {
        let res = await axios.get(`${SERVICE.SUBMODULE_SINGLE}/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setcompletedDataTestUI(res?.data?.ssubmodule?.testinguidesign);
      }
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  useEffect(() => {
    fetchCompleteDevelopData();
    fetchCompleteUIData();
  }, [testingdata, checkpagemodel]);

  const [value, setValue] = useState("1");
  //tab context create
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [valueComplete, setValueComplete] = useState("1");
  //tab context create
  const handleChangeComplete = (event, newValue) => {
    setValueComplete(newValue);
  };

  //reference images
  const handleInputChange = (event) => {
    const files = event.target.files;
    let newSelectedFiles = [...refImage];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check if the file is an image
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          newSelectedFiles.push({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: reader.result,
            base64: reader.result.split(",")[1],
            // index: indexData
          });
          setRefImage(newSelectedFiles);
          //   setEditedTodoFiles(newSelectedFiles);
        };
        reader.readAsDataURL(file);
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Only Accept Images!"}</p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };
  //reference Links
  const handleChangeSummary = (value) => {
    setRefLinks(value);
  };

  //reference documents
  const handleInputChangedocument = (event) => {
    const files = event.target.files;
    let newSelectedFiles = [...refDocuments];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check if the file is an documents
      if (file.type.startsWith("image/")) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Only Accept Documents!"}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          newSelectedFiles.push({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: reader.result,
            base64: reader.result.split(",")[1],
          });
          setrefDocuments(newSelectedFiles);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  //reference images
  const handleInputChangeComplete = (event) => {
    const files = event.target.files;
    let newSelectedFiles = [...refImageEdit];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check if the file is an image
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          newSelectedFiles.push({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: reader.result,
            base64: reader.result.split(",")[1],
            // index: indexData
          });
          setRefImageEdit(newSelectedFiles);
          //   setEditedTodoFiles(newSelectedFiles);
        };
        reader.readAsDataURL(file);
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Only Accept Images!"}</p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };
  //reference Links
  const handleChangeSummaryComplete = (value) => {
    setRefLinksEdit(value);
  };

  //reference documents
  const handleInputChangedocumentComplete = (event) => {
    const files = event.target.files;
    let newSelectedFiles = [...refDocumentsEdit];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check if the file is an documents
      if (file.type.startsWith("image/")) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Only Accept Documents!"}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          newSelectedFiles.push({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: reader.result,
            base64: reader.result.split(",")[1],
          });
          setrefDocumentsEdit(newSelectedFiles);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const ReferenceSection = () => {
    todoscheck[refIndex].refCode = refCode;
    todoscheck[refIndex].refImage = refImage;
    todoscheck[refIndex].refDocuments = refDocuments;
    todoscheck[refIndex].refLinks = refLinks;
    todoscheck[refIndex].refDetails = refDetails;
    handleCloseRef();
  };

  const updateSubmit = async () => {

    const updatedTodoscheck = completedDataTestUI.map((todo) => {
      if (todo._id == editincompleteid) {
        return {
          ...todo,
          inputvalue: editincompletedata.inputvalue,
          refCode: refCodeEdit,
          refImage: refImageEdit,
          refDocuments: refDocumentsEdit,
          refLinks: refLinksEdit,
          refDetails: refDetailsEdit,
          status: "complete",
        };
      }
      return todo;
    });
    if (checkpagemodel === "PAGEMODEL") {
      await axios.put(`${SERVICE.PAGEMODEL_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

        testinguidesign: updatedTodoscheck,
        //   updatedby: [
        //     ...updateby,
        //     {
        //       name: String(username),
        //       date: String(new Date())
        //     }
        //   ]
      });
    } else {
      await axios.put(`${SERVICE.SUBMODULE_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

        testinguidesign: updatedTodoscheck,
        //   updatedby: [
        //     ...updateby,
        //     {
        //       name: String(username),
        //       date: String(new Date())
        //     }
        //   ]
      });
    }

    handleCloseModEdit();
  };

  const updateSubmitComplete = async () => {
    const updatedTodoscheck = completedDataTest.map((todo) => {
      if (todo._id == editincompletedataEditid) {
        return {
          ...todo,
          inputvalue: editincompletedataEdit.inputvalue,
          refCode: refCodeEdit,
          refImage: refImageEdit,
          refDocuments: refDocumentsEdit,
          refLinks: refLinksEdit,
          refDetails: refDetailsEdit,
          status: "complete",
        };
      }
      return todo;
    });
    if (checkpagemodel === "PAGEMODEL") {
      await axios.put(`${SERVICE.PAGEMODEL_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

        testing: updatedTodoscheck,
        //   updatedby: [
        //     ...updateby,
        //     {
        //       name: String(username),
        //       date: String(new Date())
        //     }
        //   ]
      });
    } else {
      await axios.put(`${SERVICE.SUBMODULE_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

        testing: updatedTodoscheck,
        //   updatedby: [
        //     ...updateby,
        //     {
        //       name: String(username),
        //       date: String(new Date())
        //     }
        //   ]
      });
    }
    await fetchCompleteDevelopData();
    // await filterdataFromDeveloptoTest();
    handleCloseModEditComplete();
  };

  const updateNewTestingData = async () => {
    let missed_namedev = todoscheck.reduce((acc, item, index) => {
      if (item.name === "") {
        acc.push(index);
      }
      return acc;
    }, []);
    //    setMissedNamedev(missed_namedev);
    let missed_datafetch = todoscheck.reduce((acc, item, index) => {
      if (item.datafetch === "") {
        acc.push(index);
      }
      return acc;
    }, []);

    if (todoscheck.length === 0) {
      NotificationManager.error("Please Add one Requirement 😉", "", 2000);
    } else if (missed_datafetch.length > 0) {
      NotificationManager.error("Please Enter DataFetch 🙃", "", 2000);
    } else if (missed_namedev.length > 0) {
      NotificationManager.error("Please Enter Name 🙃", "", 2000);
    } else {
      if (checkpagemodel === "PAGEMODEL") {
        await axios.put(`${SERVICE.PAGEMODEL_SINGLE}/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },

          testing: [...completedDataTest, ...todoscheck],
          //   updatedby: [
          //     ...updateby,
          //     {
          //       name: String(username),
          //       date: String(new Date())
          //     }
          //   ]
        });
      } else {
        await axios.put(`${SERVICE.SUBMODULE_SINGLE}/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },

          testing: [...completedDataTest, ...todoscheck],
          //   updatedby: [
          //     ...updateby,
          //     {
          //       name: String(username),
          //       date: String(new Date())
          //     }
          //   ]
        });
      }
      setTodoscheck([]);
    }
    await fetchCompleteDevelopData();
    // await filterdataFromDeveloptoTest();
  };

  const updateNewTestingUIData = async () => {
    let missed_namedev = todoscheck.reduce((acc, item, index) => {
      if (item.name === "") {
        acc.push(index);
      }
      return acc;
    }, []);
    //    setMissedNamedev(missed_namedev);
    let missed_datafetch = todoscheck.reduce((acc, item, index) => {
      if (item.datafetch === "") {
        acc.push(index);
      }
      return acc;
    }, []);

    if (todoscheck.length === 0) {
      NotificationManager.error("Please Add one Requirement 😉", "", 2000);
    } else if (missed_datafetch.length > 0) {
      NotificationManager.error("Please Enter DataFetch 🙃", "", 2000);
    } else if (missed_namedev.length > 0) {
      NotificationManager.error("Please Enter Name 🙃", "", 2000);
    } else {
      if (checkpagemodel === "PAGEMODEL") {
        await axios.put(`${SERVICE.PAGEMODEL_SINGLE}/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },

          testinguidesign: [...completedDataTestUI, ...todoscheck],
          //   updatedby: [
          //     ...updateby,
          //     {
          //       name: String(username),
          //       date: String(new Date())
          //     }
          //   ]
        });
      } else {
        await axios.put(`${SERVICE.SUBMODULE_SINGLE}/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },

          testinguidesign: [...completedDataTestUI, ...todoscheck],
          //   updatedby: [
          //     ...updateby,
          //     {
          //       name: String(username),
          //       date: String(new Date())
          //     }
          //   ]
        });
      }
      setTodoscheck([]);
    }

    await fetchCompleteUIData();
    // await filterdataFromDeveloptoTest();
  };

  //first allexcel....
  const getFileIcon = (fileName) => {
    const extension1 = fileName?.split(".").pop();
    switch (extension1) {
      case "pdf":
        return pdfIcon;
      case "doc":
      case "docx":
        return wordIcon;
      case "xls":
      case "xlsx":
        return excelIcon;
      case "csv":
        return csvIcon;
      default:
        return fileIcon;
    }
  };

  //first deletefile
  const handleDeleteFile = (index) => {
    const newSelectedFiles = [...refImage];
    newSelectedFiles.splice(index, 1);
    setRefImage(newSelectedFiles);
  };

  //first deletefile
  const handleDeleteFileDocument = (index) => {
    const newSelectedFiles = [...refDocuments];
    newSelectedFiles.splice(index, 1);
    setrefDocuments(newSelectedFiles);
  };

  //first deletefile
  const handleDeleteFileComplete = (index) => {
    const newSelectedFiles = [...refImageEdit];
    newSelectedFiles.splice(index, 1);
    setRefImageEdit(newSelectedFiles);
  };

  //first deletefile
  const handleDeleteFileDocumentComplete = (index) => {
    const newSelectedFiles = [...refDocumentsEdit];
    newSelectedFiles.splice(index, 1);
    setrefDocumentsEdit(newSelectedFiles);
  };

  //INCOMPLETE DATA SERIAL NUMBER ADDED
  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumbe = completedDataTestUI?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
    setItems(itemsWithSerialNumbe);
  };

  useEffect(() => {
    addSerialNumber();
  }, [todoscheck, completedDataTestUI]);

  //COMPLETE DATA SERIAL NUMBER ADDED
  const [itemsComplete, setItemsComplete] = useState([]);

  const addSerialNumberComplete = () => {
    const itemsWithSerialNumber = completedDataTest?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
    setItemsComplete(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumberComplete();
  }, [todoscheck, completedDataTest]);

  //Datatable for INCOMPLETE DATA
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
    setSearchQueryManage(event.target.value);
    setPage(1);
  };

  const filteredDatas = items?.filter((item) => Object.values(item).some((value) => value.toString().toLowerCase().startsWith(searchQueryManage.toLowerCase())));

  const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(filteredDatas?.length / pageSize);

  const visiblePages = Math.min(totalPages, 3);

  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

  const pageNumbers = [];

  const indexOfLastItem = page * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  //Datatable for COMPLETE DATA
  const handlePageChangeComplete = (newPage) => {
    setPageComplete(newPage);
    setSelectedRowsComplete([]);
    setSelectAllCheckedComplete(false);
  };

  const handlePageSizeChangeComplete = (event) => {
    setPageSizeComplete(Number(event.target.value));
    setSelectedRowsComplete([]);
    setSelectAllCheckedComplete(false);
    setPageComplete(1);
  };

  //datatable....
  const handleSearchChangeComplete = (event) => {
    setSearchQueryManageComplete(event.target.value);
    setPageComplete(1);
  };

  const filteredDatasComplete = itemsComplete?.filter((item) => Object.values(item).some((value) => value.toString().toLowerCase().startsWith(searchQueryManageComplete.toLowerCase())));

  const filteredDataComplete = filteredDatasComplete?.slice((pageComplete - 1) * pageSizeComplete, pageComplete * pageSizeComplete);

  const totalPagesComplete = Math.ceil(filteredDatasComplete?.length / pageSizeComplete);

  const visiblePagesComplete = Math.min(totalPagesComplete, 3);

  const firstVisiblePageComplete = Math.max(1, page - 1);
  const lastVisiblePageComplete = Math.min(firstVisiblePageComplete + visiblePagesComplete - 1, totalPagesComplete);

  const pageNumbersComplete = [];

  const indexOfLastItemComplete = pageComplete * pageSizeComplete;
  const indexOfFirstItemComplete = indexOfLastItemComplete - pageSizeComplete;

  for (let i = firstVisiblePageComplete; i <= lastVisiblePageComplete; i++) {
    pageNumbersComplete.push(i);
  }

  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );
  const CheckboxHeaderComplete = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );

  //get single row to edit....
  const getCode = (name, id, datafetch, existingoption, inputvalue, refCode, refImage, refDocuments, refLinks, refDetails) => {
    try {
      setEditincompletedata({ ...editincompletedata, name: name, datafetch: datafetch, existingoption: existingoption, inputvalue: inputvalue });
      setRefCode(refCode);
      setRefImage(refImage);
      setrefDocuments(refDocuments);
      setRefLinks(refLinks);
      setRefDetails(refDetails);
      setEditincompleteid(id);
      handleClickOpenEdit();
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //get single row to edit....
  const getCodeComplete = async (name, id, datafetch, existingoption, inputvalue, refCode, refImage, refDocuments, refLinks, refDetails, row, idval) => {
    try {
      setEditincompletedataEdit({ ...editincompletedataEdit, name: name, datafetch: datafetch, existingoption: existingoption, inputvalue: inputvalue });

      setEditincompletedataEditid(idval);
      setRefCodeEdit(refCode);
      setRefImageEdit(refImage);
      setrefDocumentsEdit(refDocuments);
      setRefLinksEdit(refLinks);
      setRefDetailsEdit(refDetails);
      handleClickOpenEditComplete();
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //get single row to edit....
  const delUItodoData = async (id) => {
    setDeleteTestUIdata(id);
    handleClickOpenUIdataopen();
  };

  //get single row to edit....
  const delDeveloptodoData = async (id) => {
    setDeleteTestDevelopment(id);
    handleClickOpenDevelopdataopen();
  };

  const deleteUItodorowData = async () => {
    try {
      let updateDevelop = completedDataTestUI.filter((item) => item._id !== deleteTestUIdata);
      if (checkpagemodel === "PAGEMODEL") {
        await axios.put(`${SERVICE.PAGEMODEL_SINGLE}/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          testinguidesign: [...updateDevelop],
        });
      } else {
        await axios.put(`${SERVICE.SUBMODULE_SINGLE}/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          testinguidesign: [...updateDevelop],
        });
      }
      await fetchCompleteUIData();
      handleCloseUIdataopen();
      setPage(1);
      NotificationManager.success("Deleted Successfully 👍", "", 2000);
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  const deleteDeveloptodorowData = async () => {
    try {
      let updateDevelop = completedDataTest.filter((item) => item._id !== deleteTestDevelopdata);
      if (checkpagemodel === "PAGEMODEL") {
        await axios.put(`${SERVICE.PAGEMODEL_SINGLE}/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          testing: [...updateDevelop],
        });
      } else {
        await axios.put(`${SERVICE.SUBMODULE_SINGLE}/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          testing: [...updateDevelop],
        });
      }

      await fetchCompleteDevelopData();
      handleCloseDevelopdataopen();
      setPage(1);
      NotificationManager.success("Deleted Successfully 👍", "", 2000);
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

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
            } else {
              const allRowIds = rowDataTable.map((row) => row.id);
              setSelectedRows(allRowIds);
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
            if (selectedRows.includes(params.row.id)) {
              updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.row.id);
            } else {
              updatedSelectedRows = [...selectedRows, params.row.id];
            }

            setSelectedRows(updatedSelectedRows);

            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllChecked(updatedSelectedRows.length === filteredData.length);
          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 90,

      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 100,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0,
      width: 250,
      hide: !columnVisibility.name,
      headerClassName: "bold-header",
    },

    {
      field: "inputvalue",
      headerName: "Inputvalue",
      flex: 0,
      width: 450,
      hide: !columnVisibility.inputvalue,
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
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {/* {isUserRoleCompare[0]?.eprojectmasterexcel && ( */}
          <Button
            sx={userStyle.buttonedit}
            onClick={() => {
              getCode(params.row.name, params.row.id, params.row.datafetch, params.row.existingoption, params.row.inputvalue, params.row.refCode, params.row.refImage, params.row.refDocuments, params.row.refLinks, params.row.refDetails);
            }}
          >
            <EditOutlinedIcon style={{ fontsize: "large" }} />
          </Button>
          {/* {params.row.todo === "istodo" && ( */}
          <Button
            sx={userStyle.buttondelete}
            onClick={(e) => {
              delUItodoData(params.row.id);
            }}
          >
            <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
          </Button>
          {/* )} */}
          {/* )} */}
        </Grid>
      ),
    },
  ];

  const columnDataTableComplete = [
    {
      field: "checkbox",
      headerName: "Checkbox", // Default header name
      headerStyle: {
        fontWeight: "bold", // Apply the font-weight style to make the header text bold
        // Add any other CSS styles as needed
      },
      renderHeader: (params) => (
        <CheckboxHeaderComplete
          selectAllChecked={selectAllCheckedComplete}
          onSelectAll={() => {
            if (rowDataTable.length === 0) {
              // Do not allow checking when there are no rows
              return;
            }

            if (selectAllCheckedComplete) {
              setSelectedRowsComplete([]);
            } else {
              const allRowIds = rowDataTablecomplete.map((row) => row.id);
              setSelectedRowsComplete(allRowIds);
            }
            setSelectAllCheckedComplete(!selectAllCheckedComplete);
          }}
        />
      ),

      renderCell: (params) => (
        <Checkbox
          checked={selectedRowsComplete.includes(params.row.id)}
          onChange={() => {
            let updatedSelectedRows;
            if (selectedRowsComplete.includes(params.row.id)) {
              updatedSelectedRows = selectedRowsComplete.filter((selectedId) => selectedId !== params.row.id);
            } else {
              updatedSelectedRows = [...selectedRowsComplete, params.row.id];
            }

            setSelectedRowsComplete(updatedSelectedRows);

            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllCheckedComplete(updatedSelectedRows.length === filteredDataComplete.length);
          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 90,

      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 100,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0,
      width: 250,
      hide: !columnVisibility.name,
      headerClassName: "bold-header",
    },
    {
      field: "inputvalue",
      headerName: "Inputvalue",
      flex: 0,
      width: 500,
      hide: !columnVisibility.inputvalue,
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
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {/* {isUserRoleCompare[0]?.eprojectmasterexcel && ( */}
          <Button
            sx={userStyle.buttonedit}
            onClick={() => {
              getCodeComplete(params.row.name, params.row.id, params.row.datafetch, params.row.existingoption, params.row.inputvalue, params.row.refCode, params.row.refImage, params.row.refDocuments, params.row.refLinks, params.row.refDetails, params, params.row.idval);
            }}
          >
            <EditOutlinedIcon style={{ fontsize: "large" }} />
          </Button>
          {/* {params.row.todo === "istodo" && ( */}
          <Button
            sx={userStyle.buttondelete}
            onClick={(e) => {
              delDeveloptodoData(params.row.id);
            }}
          >
            <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
          </Button>
          {/* )} */}
          {/* )} */}
        </Grid>
      ),
    },
  ];

  const rowDataTable = filteredData?.map((item, index) => {
    return {
      id: item._id,
      name: item.name,
      serialNumber: item.serialNumber,
      todo: item.todo,
      datafetch: item.datafetch,
      existingoption: item.existingoption,
      inputvalue: item.inputvalue,
      refCode: item.refCode,
      refImage: item.refImage,
      refDocuments: item.refDocuments,
      refLinks: item.refLinks,
      refDetails: item.refDetails,
      status: "incomplete",
    };
  });

  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRows.includes(row.id),
  }));

  const rowDataTablecomplete = filteredDataComplete?.map((item, index) => {
    return {
      id: item._id,
      idval: item.idval,
      name: item.name,
      todo: item.todo,
      serialNumber: item.serialNumber,
      datafetch: item.datafetch,
      existingoption: item.existingoption,
      inputvalue: item.inputvalue,
      refCode: item.refCode,
      refImage: item.refImage,
      refDocuments: item.refDocuments,
      refLinks: item.refLinks,
      refDetails: item.refDetails,
      status: "complete",
    };
  });

  const rowsWithCheckboxescomplete = rowDataTablecomplete.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRowsComplete.includes(row.id),
  }));

  useEffect(() => {
    fetchComponentGrpCheck();
    fetchComponentGrp();
  }, [componentCheckBox, selectedComponentgrp]);

  useEffect(() => {
    sendDataToParent(completedDataTest);
  }, [completedDataTest, sendDataToParent]);

  useEffect(() => {
    sendDataToParentTestUI(completedDataTestUI);
  }, [completedDataTestUI, sendDataToParentTestUI]);

  return (
    <Box>
      {/* <TodoList/> */}
      {/*  */}
      <Headtitle title={"PAGE MODULE FETCH"} />
      <Grid container>
        <Grid item md={8} xs={12} sm={6}>
          <Typography sx={userStyle.HeaderText}>Testing </Typography> <br />
        </Grid>
        <Grid item md={4} xs={12} sm={6} sx={{ display: "flex", justifyContent: "center" }}>
          <Grid container spacing={1}>
            {/* <Grid item md={12} xs={12} sm={12}>
              <FormControlLabel control={<Checkbox checked={sameas} name="sameas" onChange={handleChangeCheckboxSameas} />} label="Same as Development" />
            </Grid> */}
          </Grid>
        </Grid>
      </Grid>
      {/* ****** Header Content ****** */}
      <div>
        <Grid container spacing={1}>
          <Grid item md={3} xs={12} sm={6}>
            <Typography>
              Component Grouping <b style={{ color: "red" }}>*</b>
            </Typography>
            <FormControl size="small" fullWidth>
              <Selects
                options={componentGroupingId}
                value={{ label: selectedComponentgrp.label, value: selectedComponentgrp.value }}
                onChange={(value) => {
                  setSelectedComponentgrp(value);
                  setCompgrouping(value);
                  getCompGroupingName(value.value);
                  fetchComponentGrpCheck();
                  setSelectedSubComponent({ value: "", label: "Please Select SubComponent Name" });
                  setSelectedComponent({ value: "", label: "Please Select Component Name" });
                }}
              />
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12} sm={6}>
            <Typography>
              Component <b style={{ color: "red" }}>*</b>
            </Typography>
            <FormControl size="small" fullWidth>
              <Selects
                options={componentId}
                value={{ label: selectedComponent.label, value: selectedComponent.value }}
                onChange={(value) => {
                  setSelectedComponent(value);
                  fetchSubComponent(value.value);
                  setSelectedSubComponent({ value: "", label: "Please Select SubComponent Name" });
                }}
              />
            </FormControl>
            <br />
            <Grid container>
              <Grid item md={2} xs={12} sm={2}>
                <Checkbox
                  {...label}
                  checked={componentCheckBox}
                  onChange={(e) => {
                    setComponentCheckBox(e.target.checked);
                    fetchComponentGrpCheck();
                    setSelectedSubComponent({ value: "", label: "Please Select SubComponent Name" });
                    setSelectedComponent({ value: "", label: "Please Select Component Name" });
                  }}
                />
              </Grid>
              <Grid item md={9} xs={12} sm={9} marginTop={1}>
                <Typography>ComponentGroup</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={3} xs={12} sm={6}>
            <Typography>
              subcomponent <b style={{ color: "red" }}>*</b>
            </Typography>
            <FormControl size="small" fullWidth>
              <Selects
                options={subcomponentId}
                value={{ label: selectedSubComponent.label, value: selectedSubComponent.value }}
                onChange={(value) => {
                  setSelectedSubComponent(value);
                  fetchsubcomponentData(value.value);
                }}
              />
            </FormControl>
          </Grid>
          <Grid item md={2} xs={12} sm={4}>
            <Typography>
              Count<b style={{ color: "red" }}>*</b>
            </Typography>
            <FormControl fullWidth size="small">
              <OutlinedInput id="component-outlined" type="number" sx={userStyle.input} placeholder="please enter Count" value={countValue} onChange={(e) => setCountValue(Number(e.target.value) > 0 ? Number(e.target.value) : 0)} />
            </FormControl>
          </Grid>
          <Grid item md={1} sm={2} xs={12} marginTop={1}>
            <Button
              variant="contained"
              disabled={selectedSubComponent.value === "" || countValue < 1}
              style={{
                marginTop: "16px",
                height: "30px",
                minWidth: "20px",
                padding: "19px 13px",
                color: "white",
                background: selectedSubComponent.value === "" || countValue < 1 ? "#80808061" : "rgb(25, 118, 210)",
              }}
              onClick={() => {
                handleCreateTodocheck(todoscheck.length);
              }}
            >
              <FaPlus style={{ fontSize: "15px" }} />
            </Button>
          </Grid>
        </Grid>
        <br />
        <br />
        {todoscheck.length > 0 &&
          todoscheck.map((data, index) => (
            <div key={index}>
              {data.edit === "notdone" ? (
                <>
                  <Grid container spacing={1}>
                    <Grid item md={2.5} xs={12} sm={6} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                      <FormControl fullWidth size="small">
                        <Typography>Data Fetch</Typography>
                        <Select
                          fullWidth
                          labelId="demo-select-small"
                          id="demo-select-small"
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 200,
                                width: 80,
                              },
                            },
                          }}
                          value={datafetch}
                          onChange={(e) => {
                            setDatafetch(e.target.value);
                          }}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                        >
                          <MenuItem value="" disabled>
                            Please Select Data Fetch
                          </MenuItem>
                          <MenuItem value="New"> {"New"} </MenuItem>
                          <MenuItem value="Existing"> {"Exisiting"} </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    {datafetch === "Existing" ? (
                      <>
                        <Grid item md={2.5} xs={12} sm={6} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                          <FormControl size="small" fullWidth>
                            <Typography>Exisiting Option</Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              placeholder="Please Enter Existing option"
                              value={existingoption}
                              onChange={(e) => {
                                setExistingoption(e.target.value);
                              }}
                            />
                          </FormControl>
                        </Grid>
                      </>
                    ) : (
                      ""
                    )}
                    <Grid item md={3} xs={12} sm={6} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                      <FormControl size="small" fullWidth>
                        <Typography>
                          Name <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <TextField
                          size="small"
                          variant="outlined"
                          placeholder="Please Enter Name"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={6} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                      <FormControl size="small" fullWidth>
                        <Typography>Input value</Typography>
                        <TextareaAutosize
                          aria-label="minimum height"
                          minRows={5}
                          size="small"
                          variant="outlined"
                          value={inputvalue}
                          onChange={(e) => {
                            setInputvalue(e.target.value);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={1} sm={3} xs={6} sx={{ display: "flex", alignItems: "center" }}>
                      <Grid container>
                        <Grid item md={6} sm={6} xs={6}>
                          <Button
                            variant="contained"
                            disabled={name === ""}
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
                            onClick={() => handleUpdateTodoEdit(data.idval)}
                          >
                            <CheckCircleIcon
                              style={{
                                color: name === "" ? "grey" : "#216d21",
                                fontSize: "1.5rem",
                              }}
                            />
                          </Button>
                        </Grid>
                        <Grid item md={6} sm={6} xs={6}>
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
                            onClick={() => {
                              handleDeleteTodoEdit(data.idval);
                              setEditingIndexedit(-1);
                            }}
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
                    </Grid>
                  </Grid>
                  <br />
                  <Divider />
                  <br />
                </>
              ) : data.edit === "edit" ? (
                <>
                  <Grid container spacing={1}>
                    <Grid item md={2.5} xs={12} sm={12} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                      <FormControl fullWidth size="small">
                        <Typography>Data Fetch</Typography>
                        <Select
                          fullWidth
                          labelId="demo-select-small"
                          id="demo-select-small"
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 200,
                                width: 80,
                              },
                            },
                          }}
                          value={datafetchedit}
                          onChange={(e) => {
                            setDatafetchedit(e.target.value);
                          }}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                        >
                          <MenuItem value="" disabled>
                            Please Select Data fetch
                          </MenuItem>
                          <MenuItem value="New"> {"New"} </MenuItem>
                          <MenuItem value="Existing"> {"Exisiting"} </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    {datafetchedit === "Existing" ? (
                      <>
                        <Grid item md={2.5} xs={12} sm={12} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                          <FormControl size="small" fullWidth>
                            <Typography>Exisiting Option</Typography>
                            <TextField
                              size="small"
                              variant="outlined"
                              placeholder="Please Enter Existing Option"
                              value={existingoptionedit}
                              onChange={(e) => {
                                setExistingoptionedit(e.target.value);
                              }}
                            />
                          </FormControl>
                        </Grid>
                      </>
                    ) : (
                      ""
                    )}
                    <Grid item md={3} xs={12} sm={12} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                      <FormControl size="small" fullWidth>
                        <Typography>
                          Name<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <TextField
                          size="small"
                          variant="outlined"
                          placeholder="Please Enter Name"
                          value={nameedit}
                          onChange={(e) => {
                            setNameedit(e.target.value);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                      <FormControl size="small" fullWidth>
                        <Typography>Input value</Typography>
                        <TextareaAutosize
                          aria-label="minimum height"
                          minRows={5}
                          size="small"
                          variant="outlined"
                          value={inputvalueedit}
                          onChange={(e) => {
                            setInputvalueedit(e.target.value);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={0.5} sm={3} xs={3} marginTop={2}>
                      <Button
                        variant="contained"
                        disabled={nameedit === ""}
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
                        onClick={() => {
                          handleUpdateTodo(data.idval);
                        }}
                      >
                        <CheckCircleIcon
                          style={{
                            color: nameedit === "" ? "grey" : "#216d21",
                            fontSize: "1.5rem",
                          }}
                        />
                      </Button>
                    </Grid>
                    <Grid item md={0.5} sm={3} xs={3} marginTop={2}>
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
                        onClick={() => handleEditTodo(data.idval)}
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
                  <br />
                  <Divider />
                  <br />
                </>
              ) : (
                // Read-only view
                <>
                  <Grid container spacing={2}>
                    <Grid item md={2} sm={12} xs={12} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                      <Typography sx={userStyle.SubHeaderText}>Sub-Component</Typography>
                      <Typography variant="subtitle2" color="textSecondary" sx={{ fontSize: "20px", fontWeight: "bolder", whiteSpace: "pre-line", wordBreak: "break-all" }}>
                        {`${index + 1}. `}
                        {data.subcomponent}
                      </Typography>
                      <br></br>

                      <Button
                        variant="contained"
                        color="warning"
                        size="small"
                        sx={{ textTransform: "capitalize" }}
                        startIcon={<FilePresentIcon />}
                        onClick={() => {
                          getRowDataId(index);
                          setRefIndex(index);
                        }}
                      >
                        Reference
                      </Button>
                      <br></br>
                    </Grid>
                    <Grid item md={1.5} sm={2} xs={6} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                      <FormControl fullWidth size="small">
                        <Typography sx={userStyle.SubHeaderText}>Data Fetch</Typography>
                        <Typography>{data.datafetch}</Typography>
                      </FormControl>
                    </Grid>
                    <Grid item md={1.5} sm={2} xs={6} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                      <FormControl fullWidth size="small">
                        {data.datafetch === "Existing" ? (
                          <>
                            <Typography sx={userStyle.SubHeaderText}>Existing Option</Typography>
                            <Typography>{data.existingoption}</Typography>
                          </>
                        ) : (
                          ""
                        )}
                        <br />
                        <br />
                      </FormControl>
                    </Grid>
                    <Grid item md={2.5} sm={3} xs={6} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                      <FormControl fullWidth size="small">
                        <Typography sx={userStyle.SubHeaderText}>Name </Typography>
                        <Typography>{data.name}</Typography>
                        <br />
                        <br />
                        <br />
                        <br />
                      </FormControl>
                    </Grid>
                    <Grid item md={2.5} sm={2.5} xs={6} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                      <FormControl fullWidth size="small">
                        <Typography sx={userStyle.SubHeaderText}>Input Value </Typography>
                        <Typography>{data.inputvalue}</Typography>

                        <br />
                        <br />
                      </FormControl>
                    </Grid>
                    <Grid item md={1} sm={1} xs={3}>
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
                        disabled={getTodoIndex >= 0}
                        onClick={() => {
                          handleEditTodoEdit(data.idval);
                          setgetTodoIndex(data.idval);
                        }}
                      >
                        <FaEdit
                          style={{
                            color: "#1976d2",
                            fontSize: "1.2rem",
                          }}
                        />
                      </Button>
                    </Grid>
                    <Grid item md={1} sm={1} xs={3}>
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
                        onClick={() => handleDeleteTodoEdit(data.idval)}
                      >
                        <FaTrash
                          style={{
                            color: "#b92525",
                            fontSize: "1.2rem",
                          }}
                        />
                      </Button>
                    </Grid>
                  </Grid>
                  <br />
                  <Divider />
                  <br />
                </>
              )}
            </div>
          ))}

        <br />
        <Box sx={{ display: "flex", justifyContent: "end", gap: "20px" }}>
          <Button variant="contained" color="primary" onClick={updateNewTestingUIData}>
            Add to UI Testing
          </Button>
          <Button variant="contained" color="primary" onClick={updateNewTestingData}>
            Add to Development Testing
          </Button>
        </Box>
      </div>
      <br /> <br />
      <Typography variant="h6" sx={{ color: "green" }}>
        Testing UI Requirements
      </Typography>
      <br />
      <Grid style={userStyle.dataTablestyle}>
        <Box>
          <label htmlFor="pageSizeSelect">Show entries:</label>
          <Select id="pageSizeSelect" defaultValue="" value={pageSize} onChange={handlePageSizeChange} sx={{ width: "77px" }}>
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
            <MenuItem value={completedDataTestUI?.length}>All</MenuItem>
          </Select>
        </Box>

        <Box>
          <FormControl fullWidth size="small">
            <Typography>Search</Typography>
            <OutlinedInput id="component-outlined" type="text" value={searchQueryManage} onChange={handleSearchChange} />
          </FormControl>
        </Box>
      </Grid>
      <br />
      <StyledDataGrid rows={rowsWithCheckboxes} columns={columnDataTable.filter((column) => columnVisibility[column.field])} selectionModel={selectedRows} autoHeight={true} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
      <br />
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
            <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={page === pageNumber ? "active" : ""} disabled={page === pageNumbers}>
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
      <br /> <br />
      <Typography variant="h6" sx={{ color: "green" }}>
        Testing Development Requirements
      </Typography>
      <Grid style={userStyle.dataTablestyle}>
        <Box>
          <label htmlFor="pageSizeSelectcomplete">Show entries:</label>
          <Select id="pageSizeSelectcomplete" defaultValue="" value={pageSizeComplete} onChange={handlePageSizeChangeComplete} sx={{ width: "77px" }}>
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
            <MenuItem value={completedDataTest?.length}>All</MenuItem>
          </Select>
        </Box>

        <Box>
          <FormControl fullWidth size="small">
            <Typography>Search</Typography>
            <OutlinedInput id="component-outlined" type="text" value={searchQueryManageComplete} onChange={handleSearchChangeComplete} />
          </FormControl>
        </Box>
      </Grid>
      <br />
      <StyledDataGrid rows={rowsWithCheckboxescomplete} columns={columnDataTableComplete.filter((column) => columnVisibility[column.field])} selectionModel={selectedRowsComplete} autoHeight={true} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
      <br />
      <Box style={userStyle.dataTablestyle}>
        <Box>
          Showing {filteredDataComplete.length > 0 ? (pageComplete - 1) * pageSizeComplete + 1 : 0} to {Math.min(pageComplete * pageSizeComplete, filteredDatasComplete.length)} of {filteredDatasComplete.length} entries
        </Box>
        <Box>
          <Button onClick={() => setPageComplete(1)} disabled={pageComplete === 1} sx={userStyle.paginationbtn}>
            <FirstPageIcon />
          </Button>
          <Button onClick={() => handlePageChangeComplete(pageComplete - 1)} disabled={pageComplete === 1} sx={userStyle.paginationbtn}>
            <NavigateBeforeIcon />
          </Button>
          {pageNumbersComplete?.map((pageNumber) => (
            <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChangeComplete(pageNumber)} className={pageComplete === pageNumber ? "active" : ""} disabled={pageComplete === pageNumbersComplete}>
              {pageNumber}
            </Button>
          ))}
          {lastVisiblePageComplete < totalPagesComplete && <span>...</span>}
          <Button onClick={() => handlePageChangeComplete(pageComplete + 1)} disabled={pageComplete === totalPagesComplete} sx={userStyle.paginationbtn}>
            <NavigateNextIcon />
          </Button>
          <Button onClick={() => setPageComplete(totalPagesComplete)} disabled={pageComplete === totalPagesComplete} sx={userStyle.paginationbtn}>
            <LastPageIcon />
          </Button>
        </Box>
      </Box>
      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpenRef} onClose={handleCloseRef} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" fullWidth={true}>
          <DialogContent>
            <Grid item md={10} xs={12} sm={12}>
              <Typography
                sx={{
                  fontSize: "20px",
                  fontWeight: "bolder",
                  whiteSpace: "pre-line",
                  wordBreak: "break-all",
                }}
              >
                {" "}
                References{" "}
              </Typography>
              <br />
              <br />
              <Box sx={{ width: "100%", height: "max-content", minHeight: "250px", typography: "body1", boxShadow: "0px 0px 2px #808080a3", border: "1px solid #80808057" }}>
                <TabContext value={value}>
                  <Box
                    sx={{
                      borderBotton: 1,
                      border: "divider",
                      background: "#80808036",
                      height: "47px",
                    }}
                  >
                    <TabList
                      onChange={handleChange}
                      aria-label="lab API tabs example"
                      variant="scrollable"
                      scrollButtons="auto"
                      sx={{
                        backgroundColor: "#c5c1c11c",
                        borderRadius: "4px",
                        boxShadow: "0px 0px 5px #33303070",
                        minHeight: "47px",
                        ".css-can5u7-MuiButtonBase-root-MuiTab-root.Mui-selected": {
                          color: "white",
                          border: "1px solid #b5afaf",
                          background: " #3346569c",
                        },
                        ".css-1aquho2-MuiTabs-indicator": {
                          background: " none",
                        },
                      }}
                    >
                      <Tab label=" Code" value="1" icon={<CodeIcon />} iconPosition="start" sx={{ minHeight: "47px" }} />
                      <Tab label=" Images" value="2" icon={<PermMediaOutlinedIcon />} iconPosition="start" sx={{ minHeight: "47px" }} />
                      <Tab label=" Documents" value="3" icon={<DescriptionOutlinedIcon />} iconPosition="start" sx={{ minHeight: "47px" }} />
                      <Tab label=" Links" value="4" icon={<InsertLinkOutlinedIcon />} iconPosition="start" sx={{ minHeight: "47px" }} />
                      <Tab label=" Details" value="5" icon={<InsertChartOutlinedOutlinedIcon />} iconPosition="start" sx={{ minHeight: "47px" }} />
                    </TabList>
                  </Box>
                  <TabPanel value="1">
                    <FormControl fullWidth>
                      <TextareaAutosize
                        aria-label="minimum height"
                        minRows={8}
                        value={refCode}
                        onChange={(e) => {
                          setRefCode(e.target.value);
                        }}
                      />
                    </FormControl>
                  </TabPanel>
                  <TabPanel value="2">
                    <input className={classes.inputs} type="file" id="file-inputuploadcreatefirstnew13" accept="image/*" multiple onChange={handleInputChange} />
                    <label htmlFor="file-inputuploadcreatefirstnew13">
                      <Button
                        component="span"
                        style={{
                          backgroundColor: "#f4f4f4",
                          color: "#444",
                          minWidth: "40px",
                          boxShadow: "none",
                          borderRadius: "5px",
                          marginTop: "-5px",
                          textTransform: "capitalize",
                          border: "1px solid #0000006b",
                          "&:hover": {
                            "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                              backgroundColor: "#f4f4f4",
                            },
                          },
                        }}
                      >
                        Upload Images &ensp; <CloudUploadIcon />
                      </Button>
                      <br></br>
                    </label>
                    <Grid container>
                      <Grid item md={12} sm={12} xs={12}>
                        {refImage.map((file, index) => (
                          <>
                            <Grid container>
                              <Grid item md={2} sm={2} xs={2}>
                                <Box style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                  {file.type.includes("image/") ? (
                                    <img
                                      src={file.preview}
                                      alt={file.name}
                                      height={50}
                                      style={{
                                        maxWidth: "-webkit-fill-available",
                                      }}
                                    />
                                  ) : (
                                    <img className={classes.preview} src={getFileIcon(file.name)} height="10" alt="file icon" />
                                  )}
                                </Box>
                              </Grid>
                              <Grid item md={8} sm={8} xs={8} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Typography variant="subtitle2"> {file.name} </Typography>
                              </Grid>
                              <Grid item md={2} sm={2} xs={2}>
                                <Button
                                  sx={{
                                    padding: "14px 14px",
                                    minWidth: "40px !important",
                                    borderRadius: "50% !important",
                                    ":hover": {
                                      backgroundColor: "#80808036", // theme.palette..main
                                    },
                                  }}
                                  onClick={() => handleDeleteFile(index)}
                                >
                                  <FaTrash
                                    style={{
                                      color: "#a73131",
                                      fontSize: "14px",
                                    }}
                                  />
                                </Button>
                              </Grid>
                            </Grid>
                          </>
                        ))}
                      </Grid>
                    </Grid>
                  </TabPanel>
                  <TabPanel value="3">
                    <input className={classes.inputs} type="file" id="file-inputuploadcreatefirstnew14" accept=".pdf, .doc, .docx, .txt, .xls, .xlsx, .zip" multiple onChange={handleInputChangedocument} />
                    <label htmlFor="file-inputuploadcreatefirstnew14">
                      <Button
                        component="span"
                        style={{
                          backgroundColor: "#f4f4f4",
                          color: "#444",
                          minWidth: "40px",
                          boxShadow: "none",
                          borderRadius: "5px",
                          marginTop: "-5px",
                          textTransform: "capitalize",
                          border: "1px solid #0000006b",
                          "&:hover": {
                            "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                              backgroundColor: "#f4f4f4",
                            },
                          },
                        }}
                      >
                        Upload Document &ensp; <CloudUploadIcon />
                      </Button>
                    </label>
                    <Grid container>
                      <Grid item md={12} sm={12} xs={12}>
                        {refDocuments?.map((file, index) => (
                          <>
                            <Grid container>
                              <Grid item md={2} sm={2} xs={2}>
                                <Box
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  {file.type.includes("image/") ? (
                                    <img
                                      src={file.preview}
                                      alt={file.name}
                                      height={50}
                                      style={{
                                        maxWidth: "-webkit-fill-available",
                                      }}
                                    />
                                  ) : (
                                    <img className={classes.preview} src={getFileIcon(file.name)} height="25" alt="file icon" />
                                  )}
                                </Box>
                              </Grid>
                              <Grid
                                item
                                md={8}
                                sm={8}
                                xs={8}
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Typography variant="subtitle2">{file.name} </Typography>
                              </Grid>
                              <Grid item md={2} sm={2} xs={2}>
                                <Button
                                  sx={{
                                    padding: "14px 14px",
                                    minWidth: "40px !important",
                                    borderRadius: "50% !important",
                                    ":hover": {
                                      backgroundColor: "#80808036", // theme.palette..main
                                    },
                                  }}
                                  onClick={() => handleDeleteFileDocument(index)}
                                >
                                  <FaTrash
                                    style={{
                                      color: "#a73131",
                                      fontSize: "14px",
                                    }}
                                  />
                                </Button>
                              </Grid>
                            </Grid>
                          </>
                        ))}
                      </Grid>
                    </Grid>
                  </TabPanel>
                  <TabPanel value="4">
                    <ReactQuill
                      style={{ height: "100px" }}
                      value={refLinks}
                      onChange={handleChangeSummary}
                      modules={{
                        toolbar: [[{ header: "1" }, { header: "2" }, { font: [] }], [{ size: [] }], ["bold", "italic", "underline", "strike", "blockquote"], [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }], ["link", "image", "video"], ["clean"]],
                      }}
                      formats={["header", "font", "size", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "indent", "link", "image", "video"]}
                    />
                  </TabPanel>
                  <TabPanel value="5">
                    <FormControl fullWidth>
                      <TextareaAutosize
                        aria-label="minimum height"
                        minRows={8}
                        value={refDetails}
                        onChange={(e) => {
                          setRefDetails(e.target.value);
                        }}
                      />
                    </FormControl>
                  </TabPanel>
                </TabContext>
              </Box>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                ReferenceSection();
              }}
            >
              ok
            </Button>
            <Button sx={userStyle.btncancel} onClick={handleCloseRef}>
              cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      {/* Edit DIALOG */}
      <Dialog open={isEditOpen} onClose={handleCloseModEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" fullWidth={true}>
        <DialogContent>
          <Typography sx={userStyle.HeaderText}>Edit Testing UI Requirements</Typography>
          <br />
          <br />
          <Grid container spacing={2}>
            <Grid item md={4} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>Data Fetch</Typography>
                <Select
                  fullWidth
                  labelId="demo-select-small"
                  id="demo-select-small"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                        width: 80,
                      },
                    },
                  }}
                  value={editincompletedata.datafetch}
                  onChange={(e) => {
                    setEditincompletedata({
                      ...editincompletedata,
                      datafetch: e.target.value,
                    });
                  }}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                >
                  <MenuItem value="" disabled>
                    Please Select Data Fetch
                  </MenuItem>
                  <MenuItem value="New"> {"New"} </MenuItem>
                  <MenuItem value="Existing"> {"Exisiting"} </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {editincompletedata.datafetch === "Existing" ? (
              <>
                <Grid item md={4} xs={12} sm={6} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                  <FormControl size="small" fullWidth>
                    <Typography>Exisiting Option</Typography>
                    <TextField
                      size="small"
                      variant="outlined"
                      placeholder="Please Enter Existing option"
                      value={editincompletedata.existingoption}
                      onChange={(e) => {
                        setEditincompletedata({
                          ...editincompletedata,
                          existingoption: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
              </>
            ) : (
              ""
            )}
            <Grid item md={4} xs={12} sm={6}>
              <FormControl size="small" fullWidth>
                <Typography>
                  Name <b style={{ color: "red" }}>*</b>
                </Typography>
                <TextField size="small" variant="outlined" readOnly placeholder="Please Enter Name" value={editincompletedata.name} />
              </FormControl>
            </Grid>
            <Grid item md={12} xs={12} sm={12}>
              <FormControl size="small" fullWidth>
                <Typography>Input value</Typography>
                <TextareaAutosize
                  aria-label="minimum height"
                  minRows={5}
                  size="small"
                  variant="outlined"
                  value={editincompletedata.inputvalue}
                  onChange={(e) => {
                    setEditincompletedata({
                      ...editincompletedata,
                      inputvalue: e.target.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>
          <br />
          <Box sx={{ width: "100%", height: "max-content", minHeight: "250px", typography: "body1", boxShadow: "0px 0px 2px #808080a3", border: "1px solid #80808057" }}>
            <TabContext value={value}>
              <Box sx={{ borderBotton: 1, border: "divider", background: "#80808036", height: "47px" }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    backgroundColor: "#c5c1c11c",
                    borderRadius: "4px",
                    boxShadow: "0px 0px 5px #33303070",
                    minHeight: "47px",
                    ".css-can5u7-MuiButtonBase-root-MuiTab-root.Mui-selected": {
                      color: "white",
                      border: "1px solid #b5afaf",
                      background: " #3346569c",
                    },
                    ".css-1aquho2-MuiTabs-indicator": {
                      background: " none",
                    },
                  }}
                >
                  <Tab label="  Code" value="1" icon={<CodeIcon />} iconPosition="start" sx={{ minHeight: "47px" }} />
                  <Tab label="  Images" value="2" icon={<PermMediaOutlinedIcon />} iconPosition="start" sx={{ minHeight: "47px" }} />
                  <Tab label="  Documents" value="3" icon={<DescriptionOutlinedIcon />} iconPosition="start" sx={{ minHeight: "47px" }} />
                  <Tab label="  Links" value="4" icon={<InsertLinkOutlinedIcon />} iconPosition="start" sx={{ minHeight: "47px" }} />
                  <Tab label="  Details" value="5" icon={<InsertChartOutlinedOutlinedIcon />} iconPosition="start" sx={{ minHeight: "47px" }} />
                </TabList>
              </Box>
              <TabPanel value="1">
                <FormControl fullWidth>
                  <TextareaAutosize
                    aria-label="minimum height"
                    minRows={8}
                    value={refCode}
                    onChange={(e) => {
                      setRefCode(e.target.value);
                    }}
                  />
                </FormControl>
              </TabPanel>
              <TabPanel value="2">
                <input className={classes.inputs} type="file" id="file-inputuploadcreatefirstnew15" accept="image/*" multiple onChange={handleInputChange} />
                <label htmlFor="file-inputuploadcreatefirstnew15">
                  <Button
                    component="span"
                    style={{
                      backgroundColor: "#f4f4f4",
                      color: "#444",
                      minWidth: "40px",
                      boxShadow: "none",
                      borderRadius: "5px",
                      marginTop: "-5px",
                      textTransform: "capitalize",
                      border: "1px solid #0000006b",
                      "&:hover": {
                        "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                          backgroundColor: "#f4f4f4",
                        },
                      },
                    }}
                  >
                    Upload Images &ensp; <CloudUploadIcon />
                  </Button>
                  <br></br>
                </label>
                <Grid container>
                  <Grid item md={12} sm={12} xs={12}>
                    {refImage.map((file, index) => (
                      <>
                        <Grid container>
                          <Grid item md={2} sm={2} xs={2}>
                            <Box
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              {file.type.includes("image/") ? (
                                <img
                                  src={file.preview}
                                  alt={file.name}
                                  height={50}
                                  style={{
                                    maxWidth: "-webkit-fill-available",
                                  }}
                                />
                              ) : (
                                <img className={classes.preview} src={getFileIcon(file.name)} height="10" alt="file icon" />
                              )}
                            </Box>
                          </Grid>
                          <Grid item md={8} sm={8} xs={8} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Typography variant="subtitle2">{file.name} </Typography>
                          </Grid>
                          <Grid item md={2} sm={2} xs={2}>
                            <Button
                              sx={{
                                padding: "14px 14px",
                                minWidth: "40px !important",
                                borderRadius: "50% !important",
                                ":hover": {
                                  backgroundColor: "#80808036", // theme.palette.primary.main
                                },
                              }}
                              onClick={() => handleDeleteFile(index)}
                            >
                              <FaTrash style={{ color: "#a73131", fontSize: "14px" }} />
                            </Button>
                          </Grid>
                        </Grid>
                      </>
                    ))}
                  </Grid>
                </Grid>
              </TabPanel>
              <TabPanel value="3">
                <input className={classes.inputs} type="file" id="file-inputuploadcreatefirstnew16" accept=".pdf, .doc, .docx, .txt, .xls, .xlsx, .zip" multiple onChange={handleInputChangedocument} />
                <label htmlFor="file-inputuploadcreatefirstnew16">
                  <Button
                    component="span"
                    style={{
                      backgroundColor: "#f4f4f4",
                      color: "#444",
                      minWidth: "40px",
                      boxShadow: "none",
                      borderRadius: "5px",
                      marginTop: "-5px",
                      textTransform: "capitalize",
                      border: "1px solid #0000006b",
                      "&:hover": {
                        "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                          backgroundColor: "#f4f4f4",
                        },
                      },
                    }}
                  >
                    Upload Document &ensp; <CloudUploadIcon />
                  </Button>
                </label>
                <Grid container>
                  <Grid item md={12} sm={12} xs={12}>
                    {refDocuments?.map((file, index) => (
                      <>
                        <Grid container>
                          <Grid item md={2} sm={2} xs={2}>
                            <Box
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              {file.type.includes("image/") ? (
                                <img
                                  src={file.preview}
                                  alt={file.name}
                                  height={50}
                                  style={{
                                    maxWidth: "-webkit-fill-available",
                                  }}
                                />
                              ) : (
                                <img className={classes.preview} src={getFileIcon(file.name)} height="25" alt="file icon" />
                              )}
                            </Box>
                          </Grid>
                          <Grid
                            item
                            md={8}
                            sm={8}
                            xs={8}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="subtitle2">{file.name} </Typography>
                          </Grid>
                          <Grid item md={2} sm={2} xs={2}>
                            <Button
                              sx={{
                                padding: "14px 14px",
                                minWidth: "40px !important",
                                borderRadius: "50% !important",
                                ":hover": {
                                  backgroundColor: "#80808036", // theme.palette.primary.main
                                },
                              }}
                              onClick={() => handleDeleteFileDocument(index)}
                            >
                              <FaTrash style={{ color: "#a73131", fontSize: "14px" }} />
                            </Button>
                          </Grid>
                        </Grid>
                      </>
                    ))}
                  </Grid>
                </Grid>
              </TabPanel>
              <TabPanel value="4">
                <ReactQuill
                  style={{ height: "100px" }}
                  value={refLinks}
                  onChange={handleChangeSummary}
                  modules={{
                    toolbar: [[{ header: "1" }, { header: "2" }, { font: [] }], [{ size: [] }], ["bold", "italic", "underline", "strike", "blockquote"], [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }], ["link", "image", "video"], ["clean"]],
                  }}
                  formats={["header", "font", "size", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "indent", "link", "image", "video"]}
                />
              </TabPanel>
              <TabPanel value="5">
                <FormControl fullWidth>
                  <TextareaAutosize
                    aria-label="minimum height"
                    minRows={8}
                    value={refDetails}
                    onChange={(e) => {
                      setRefDetails(e.target.value);
                    }}
                  />
                </FormControl>
              </TabPanel>
            </TabContext>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={updateSubmit} variant="contained">
            OK
          </Button>
          <Button onClick={handleCloseModEdit} autoFocus sx={userStyle.btncancel}>
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>
      {/* Edit DIALOG COMPLETE */}
      <Dialog open={isEditOpenComplete} onClose={handleCloseModEditComplete} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" fullWidth={true}>
        <DialogContent>
          <Typography sx={userStyle.HeaderText}>Edit Requirements</Typography>
          <br />
          <br />
          <Grid container spacing={2}>
            <Grid item md={4} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>Data Fetch</Typography>
                <Select
                  fullWidth
                  labelId="demo-select-small"
                  id="demo-select-small"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                        width: 80,
                      },
                    },
                  }}
                  value={editincompletedataEdit.datafetch}
                  onChange={(e) => {
                    setEditincompletedataEdit({
                      ...editincompletedataEdit,
                      datafetch: e.target.value,
                    });
                  }}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                >
                  <MenuItem value="" disabled>
                    Please Select Data Fetch
                  </MenuItem>
                  <MenuItem value="New"> {"New"} </MenuItem>
                  <MenuItem value="Existing"> {"Exisiting"} </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {editincompletedataEdit.datafetch === "Existing" ? (
              <>
                <Grid item md={4} xs={12} sm={6} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                  <FormControl size="small" fullWidth>
                    <Typography>Exisiting Option</Typography>
                    <TextField
                      size="small"
                      variant="outlined"
                      placeholder="Please Enter Existing option"
                      value={editincompletedataEdit.existingoption}
                      onChange={(e) => {
                        setEditincompletedataEdit({
                          ...editincompletedataEdit,
                          existingoption: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
              </>
            ) : (
              ""
            )}
            <Grid item md={4} xs={12} sm={6}>
              <FormControl size="small" fullWidth>
                <Typography>
                  Name <b style={{ color: "red" }}>*</b>
                </Typography>
                <TextField size="small" variant="outlined" readOnly placeholder="Please Enter Name" value={editincompletedataEdit.name} />
              </FormControl>
            </Grid>
            <Grid item md={12} xs={12} sm={12}>
              <FormControl size="small" fullWidth>
                <Typography>Input value</Typography>
                <TextareaAutosize
                  aria-label="minimum height"
                  minRows={5}
                  size="small"
                  variant="outlined"
                  value={editincompletedataEdit.inputvalue}
                  onChange={(e) => {
                    setEditincompletedataEdit({
                      ...editincompletedataEdit,
                      inputvalue: e.target.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>
          <br />
          <Box sx={{ width: "100%", height: "max-content", minHeight: "250px", typography: "body1", boxShadow: "0px 0px 2px #808080a3", border: "1px solid #80808057" }}>
            <TabContext value={valueComplete}>
              <Box sx={{ borderBotton: 1, border: "divider", background: "#80808036", height: "47px" }}>
                <TabList
                  onChange={handleChangeComplete}
                  aria-label="lab API tabs example"
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    backgroundColor: "#c5c1c11c",
                    borderRadius: "4px",
                    boxShadow: "0px 0px 5px #33303070",
                    minHeight: "47px",
                    ".css-can5u7-MuiButtonBase-root-MuiTab-root.Mui-selected": {
                      color: "white",
                      border: "1px solid #b5afaf",
                      background: " #3346569c",
                    },
                    ".css-1aquho2-MuiTabs-indicator": {
                      background: " none",
                    },
                  }}
                >
                  <Tab label="  Code" value="1" icon={<CodeIcon />} iconPosition="start" sx={{ minHeight: "47px" }} />
                  <Tab label="  Images" value="2" icon={<PermMediaOutlinedIcon />} iconPosition="start" sx={{ minHeight: "47px" }} />
                  <Tab label="  Documents" value="3" icon={<DescriptionOutlinedIcon />} iconPosition="start" sx={{ minHeight: "47px" }} />
                  <Tab label="  Links" value="4" icon={<InsertLinkOutlinedIcon />} iconPosition="start" sx={{ minHeight: "47px" }} />
                  <Tab label="  Details" value="5" icon={<InsertChartOutlinedOutlinedIcon />} iconPosition="start" sx={{ minHeight: "47px" }} />
                </TabList>
              </Box>
              <TabPanel value="1">
                <FormControl fullWidth>
                  <TextareaAutosize
                    aria-label="minimum height"
                    minRows={8}
                    value={refCodeEdit}
                    onChange={(e) => {
                      setRefCodeEdit(e.target.value);
                    }}
                  />
                </FormControl>
              </TabPanel>
              <TabPanel value="2">
                <input className={classes.inputs} type="file" id="file-inputuploadcreatefirstnew17" accept="image/*" multiple onChange={handleInputChangeComplete} />
                <label htmlFor="file-inputuploadcreatefirstnew17">
                  <Button
                    component="span"
                    style={{
                      backgroundColor: "#f4f4f4",
                      color: "#444",
                      minWidth: "40px",
                      boxShadow: "none",
                      borderRadius: "5px",
                      marginTop: "-5px",
                      textTransform: "capitalize",
                      border: "1px solid #0000006b",
                      "&:hover": {
                        "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                          backgroundColor: "#f4f4f4",
                        },
                      },
                    }}
                  >
                    Upload Images &ensp; <CloudUploadIcon />
                  </Button>
                  <br></br>
                </label>
                <Grid container>
                  <Grid item md={12} sm={12} xs={12}>
                    {refImageEdit.map((file, index) => (
                      <>
                        <Grid container>
                          <Grid item md={2} sm={2} xs={2}>
                            <Box
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              {file.type.includes("image/") ? (
                                <img
                                  src={file.preview}
                                  alt={file.name}
                                  height={50}
                                  style={{
                                    maxWidth: "-webkit-fill-available",
                                  }}
                                />
                              ) : (
                                <img className={classes.preview} src={getFileIcon(file.name)} height="10" alt="file icon" />
                              )}
                            </Box>
                          </Grid>
                          <Grid item md={8} sm={8} xs={8} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Typography variant="subtitle2">{file.name} </Typography>
                          </Grid>
                          <Grid item md={2} sm={2} xs={2}>
                            <Button
                              sx={{
                                padding: "14px 14px",
                                minWidth: "40px !important",
                                borderRadius: "50% !important",
                                ":hover": {
                                  backgroundColor: "#80808036", // theme.palette.primary.main
                                },
                              }}
                              onClick={() => handleDeleteFileComplete(index)}
                            >
                              <FaTrash style={{ color: "#a73131", fontSize: "14px" }} />
                            </Button>
                          </Grid>
                        </Grid>
                      </>
                    ))}
                  </Grid>
                </Grid>
              </TabPanel>
              <TabPanel value="3">
                <input className={classes.inputs} type="file" id="file-inputuploadcreatefirstnew18" accept=".pdf, .doc, .docx, .txt, .xls, .xlsx, .zip" multiple onChange={handleInputChangedocumentComplete} />
                <label htmlFor="file-inputuploadcreatefirstnew18">
                  <Button
                    component="span"
                    style={{
                      backgroundColor: "#f4f4f4",
                      color: "#444",
                      minWidth: "40px",
                      boxShadow: "none",
                      borderRadius: "5px",
                      marginTop: "-5px",
                      textTransform: "capitalize",
                      border: "1px solid #0000006b",
                      "&:hover": {
                        "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                          backgroundColor: "#f4f4f4",
                        },
                      },
                    }}
                  >
                    Upload Document &ensp; <CloudUploadIcon />
                  </Button>
                </label>
                <Grid container>
                  <Grid item md={12} sm={12} xs={12}>
                    {refDocumentsEdit?.map((file, index) => (
                      <>
                        <Grid container>
                          <Grid item md={2} sm={2} xs={2}>
                            <Box
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              {file.type.includes("image/") ? (
                                <img
                                  src={file.preview}
                                  alt={file.name}
                                  height={50}
                                  style={{
                                    maxWidth: "-webkit-fill-available",
                                  }}
                                />
                              ) : (
                                <img className={classes.preview} src={getFileIcon(file.name)} height="25" alt="file icon" />
                              )}
                            </Box>
                          </Grid>
                          <Grid
                            item
                            md={8}
                            sm={8}
                            xs={8}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="subtitle2">{file.name} </Typography>
                          </Grid>
                          <Grid item md={2} sm={2} xs={2}>
                            <Button
                              sx={{
                                padding: "14px 14px",
                                minWidth: "40px !important",
                                borderRadius: "50% !important",
                                ":hover": {
                                  backgroundColor: "#80808036", // theme.palette.primary.main
                                },
                              }}
                              onClick={() => handleDeleteFileDocumentComplete(index)}
                            >
                              <FaTrash style={{ color: "#a73131", fontSize: "14px" }} />
                            </Button>
                          </Grid>
                        </Grid>
                      </>
                    ))}
                  </Grid>
                </Grid>
              </TabPanel>
              <TabPanel value="4">
                <ReactQuill
                  style={{ height: "100px" }}
                  value={refLinks}
                  onChange={handleChangeSummary}
                  modules={{
                    toolbar: [[{ header: "1" }, { header: "2" }, { font: [] }], [{ size: [] }], ["bold", "italic", "underline", "strike", "blockquote"], [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }], ["link", "image", "video"], ["clean"]],
                  }}
                  formats={["header", "font", "size", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "indent", "link", "image", "video"]}
                />
              </TabPanel>
              <TabPanel value="5">
                <FormControl fullWidth>
                  <TextareaAutosize
                    aria-label="minimum height"
                    minRows={8}
                    value={refDetailsEdit}
                    onChange={(e) => {
                      setRefDetailsEdit(e.target.value);
                    }}
                  />
                </FormControl>
              </TabPanel>
            </TabContext>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={updateSubmitComplete} variant="contained">
            OK
          </Button>
          <Button onClick={handleCloseModEditComplete} autoFocus sx={userStyle.btncancel}>
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>
      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <Box sx={{ width: "450px", textAlign: "center", alignItems: "center" }}>
            <DialogContent>
              <Typography variant="h6">{showAlert}</Typography>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" color="error" onClick={handleCloseerr}>
                ok
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Box>
      {/* ALERT delete UI DIALOG */}
      <Dialog open={isDeleteUIdataopen} onClose={handleCloseUIdataopen} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
          <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
            Are you sure?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseUIdataopen}
            style={{
              backgroundColor: "#f4f4f4",
              color: "#444",
              boxShadow: "none",
              borderRadius: "3px",
              border: "1px solid #0000006b",
              "&:hover": {
                "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                  backgroundColor: "#f4f4f4",
                },
              },
            }}
          >
            Cancel
          </Button>
          <Button autoFocus variant="contained" color="error" onClick={(e) => deleteUItodorowData(deleteTestUIdata)}>
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>
      {/* ALERT delete DEVELOP DIALOG */}
      <Dialog open={isDeleteDevelopdataopen} onClose={handleCloseDevelopdataopen} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
          <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
            Are you sure?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDevelopdataopen}
            style={{
              backgroundColor: "#f4f4f4",
              color: "#444",
              boxShadow: "none",
              borderRadius: "3px",
              border: "1px solid #0000006b",
              "&:hover": {
                "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                  backgroundColor: "#f4f4f4",
                },
              },
            }}
          >
            Cancel
          </Button>
          <Button autoFocus variant="contained" color="error" onClick={(e) => deleteDeveloptodorowData(delDeveloptodoData)}>
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SubmoduleViewList;
