import React, { useState, useContext, useEffect } from "react";
import { Box, Typography, OutlinedInput, Checkbox, Select, Dialog, MenuItem, TextareaAutosize, DialogContent, DialogActions, FormControl, Grid, Button, TextField, Divider } from "@mui/material";
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
import axios from "axios";
import CancelIcon from "@mui/icons-material/Cancel";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import FilePresentIcon from "@mui/icons-material/FilePresent";
import { makeStyles } from "@material-ui/core";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import CodeIcon from "@mui/icons-material/Code";
import PermMediaOutlinedIcon from "@mui/icons-material/PermMediaOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";
import InsertChartOutlinedOutlinedIcon from "@mui/icons-material/InsertChartOutlinedOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
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

function SubmoduleViewList({ sendDataToParentUI, taskAssignBoardList, checktaskname, checkpagemodel, id }) {
  const classes = useStyles();
  // component state
  const [componentId, setComponentId] = useState([]);
  const [subcomponentId, setSubComponentId] = useState([]);
  const [componentGroupingId, setComponentgrpingId] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState({ value: "", label: "Please Select Component Name" });
  const [selectedSubComponent, setSelectedSubComponent] = useState({ value: "", label: "Please Select SubComponent Name" });
  const [selectedComponentgrp, setSelectedComponentgrp] = useState({ value: "", label: "Please Select ComponentGroup Name" });
  const [compgrouping, setCompgrouping] = useState("");
  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  //   new todo states
  const [todoscheck, setTodoscheck] = useState([]);
  const [datafetch, setDatafetch] = useState("New");
  const [existingoption, setExistingoption] = useState("");
  const [name, setName] = useState("");
  const [inputvalue, setInputvalue] = useState("");
  const [sizeheight, setSizeheight] = useState("");
  const [sizewidth, setSizewidth] = useState("");
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
  const [componentCheckBox, setComponentCheckBox] = useState(false);
  const [subComponentData, setComponentData] = useState([]);

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

  let authToken = localStorage.APIToken;

  //get single row to edit....
  const getCode = async () => {
    try {
      if (checkpagemodel === "PAGEMODEL") {
        let resPage = await axios.get(`${SERVICE.PAGEMODEL_SINGLE}/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        let findtaskdata = taskAssignBoardList.find((item) => item.taskname == checktaskname && item.phase == "UI");
        
        setTodoscheck(resPage?.data?.spagemodel?.uidesign);
      } else if (checkpagemodel === "SUBMODULE") {
        let res = await axios.get(`${SERVICE.SUBMODULE_SINGLE}/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setTodoscheck(res?.data?.ssubmodule?.uidesign);
        let findtaskdata = taskAssignBoardList.find((item) => item.taskname == checktaskname && item.phase == "UI");
       
      }
   } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const handleCreateTodocheck = (id) => {
    setInputvalue(subComponentData.inputvalue);
    setSizeheight(subComponentData.sizeheight);
    setSizewidth(subComponentData.sizewidth);
    setColour(subComponentData.colour);
    setDirection(subComponentData.direction);
    setPosition(subComponentData.position);

    const newTodos = Array.from({ length: countValue }, (item, index) => {
      // if (index === id) {
      //   return {
      //     subcomponent: selectedSubComponent.value,
      //     subrefCode: subComponentData?.refCode,
      //     subrefImage: subComponentData?.refImage,
      //     subrefDocuments: subComponentData?.refDocuments,
      //     subrefLinks: subComponentData?.refLinks,
      //     subrefDetails: subComponentData?.refDetails,
      //     subEstType: subComponentData?.estimationType,
      //     subEstTime: subComponentData?.estimationTime,
      //     idval: todoscheck.length + index,
      //     edit: "notdone",
      //     datafetch: "New",
      //     existingoption: existingoption,
      //     name: name,
      //   inputvalue: subComponentData.inputvalue,
      //   sizeheight: subComponentData.sizeheight,
      //   sizewidth: subComponentData.sizewidth,
      //   colour: subComponentData.colour,
      //   direction: subComponentData.direction,
      //   position: subComponentData.position,
      //   refCode: subComponentData?.refCode,
      //   refImage: subComponentData?.refImage,
      //   refDocuments: subComponentData?.refDocuments,
      //   refLinks: subComponentData?.refLinks,
      //   refDetails: subComponentData?.refDetails,
      //   };
      // } else {
      return {
        subcomponent: selectedSubComponent.value,
        subrefCode: subComponentData?.refCode,
        subrefImage: subComponentData?.refImage,
        subrefDocuments: subComponentData?.refDocuments,
        subrefLinks: subComponentData?.refLinks,
        subrefDetails: subComponentData?.refDetails,
        subEstType: subComponentData?.estimationType,
        subEstTime: subComponentData?.estimationTime,
        idval: todoscheck.length + index,
        edit: "done",
        datafetch: "New",
        existingoption: existingoption,
        name: name,
        inputvalue: subComponentData.inputvalue,
        sizeheight: subComponentData.sizeheight,
        sizewidth: subComponentData.sizewidth,
        colour: subComponentData.colour,
        direction: subComponentData.direction,
        position: subComponentData.position,
        refCode: subComponentData?.refCode,
        refImage: subComponentData?.refImage,
        refDocuments: subComponentData?.refDocuments,
        refLinks: subComponentData?.refLinks,
        refDetails: subComponentData?.refDetails,
      };
      // }
    });

    setTodoscheck([...todoscheck, ...newTodos]);
    setInputvalue("");
    setSizeheight("");
    setSizewidth("");
    setColour("");
    setDirection("");
    setPosition("");
  };

  const [editingIndexedit, setEditingIndexedit] = useState(-1);

  const handleDeleteTodoEdit = (id) => {
    const updatedTodos = todoscheck.filter((todo) => todo.idval !== id);
    setTodoscheck(updatedTodos);
    NotificationManager.success("Deleted Successfully ✔", "", 2000);
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
          sizeheight: sizeheight,
          sizewidth: sizewidth,
          colour: colour,
          direction: direction,
          position: position,
          taskdev: todo.taskdev ? todo.taskdev : "",
          branch: todo.branch ? todo.branch : "",
          unit: todo.unit ? todo.unit : "",
          team: todo.team ? todo.team : "",
          sourcelink: todo.sourcelink ? todo.sourcelink : "",
          priority: todo.priority ? todo.priority : "",
          assignedby: todo.assignedby ? todo.assignedby : "",
          assignmode: todo.assignmode ? todo.assignmode : "",
          assigndate: todo.assigndate ? todo.assigndate : "",
          subEstType: todo.subEstType ? todo.subEstType : "",
        };
        // ... update other values ...
      }
      return todo;
    });

    setTodoscheck(updatedTodos);
    setDatafetch("New");
    setExistingoption("");
    setName("");
    setInputvalue("");
    setSizeheight("");
    setColour("");
    setDirection("");
    setPosition("");
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
          sizeheight: sizeheightedit,
          sizewidth: sizewidthedit,
          colour: colouredit,
          direction: directionedit,
          position: positionedit,
        };
        // ... update other values ...
      }
      return todo;
    });
    setTodoscheck(updatedTodos);
    setgetTodoIndex(-1);
    setEditingIndexedit(-1);
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
    setTodoscheck(updatedTodos);
    setDatafetchedit(updatedTodos[id]?.datafetch);
    setExistingoptionedit(updatedTodos[id]?.existingoption);
    setNameedit(updatedTodos[id]?.name);
    setInputvalueedit(updatedTodos[id]?.inputvalue);
    setSizeheightedit(updatedTodos[id]?.sizeheight);
    setSizewidthedit(updatedTodos[id]?.sizewidth);
    setColouredit(updatedTodos[id]?.colour);
    setDirectionedit(updatedTodos[id]?.direction);
    setPositionedit(updatedTodos[id]?.position);

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
    setRefCode(todoscheck[index]?.refCode);
    setRefImage(todoscheck[index]?.refImage);
    setrefDocuments(todoscheck[index]?.refDocuments);
    setRefLinks(todoscheck[index]?.refLinks);
    setRefDetails(todoscheck[index]?.refDetails);
    setIsErrorOpenRef(true);
  };

  const [value, setValue] = useState("1");
  //tab context create
  const handleChange = (event, newValue) => {
    setValue(newValue);
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

  const ReferenceSection = () => {
    todoscheck[refIndex].refCode = refCode;
    todoscheck[refIndex].refImage = refImage;
    todoscheck[refIndex].refDocuments = refDocuments;
    todoscheck[refIndex].refLinks = refLinks;
    todoscheck[refIndex].refDetails = refDetails;
    handleCloseRef();
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

  useEffect(() => {
    fetchComponentGrpCheck();
    fetchComponentGrp();
  }, [componentCheckBox, selectedComponentgrp]);

  useEffect(() => {
    sendDataToParentUI(todoscheck);
  }, [todoscheck, sendDataToParentUI]);

  useEffect(() => {
    getCode();
  }, [id, checkpagemodel]);

  return (
    <Box>
      <Headtitle title={"PAGE MODULE FETCH"} />
      <NotificationContainer />
      {/* ****** Header Content ****** */}
      <div>
        <Grid container spacing={2}>
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
              <Grid item md={2} xs={1} sm={1}>
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
              <Grid item md={9} xs={10} sm={10} marginTop={1}>
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
          <Grid item md={2} xs={12} sm={6}>
            <Typography>
              Count<b style={{ color: "red" }}>*</b>
            </Typography>
            <FormControl fullWidth size="small">
              <OutlinedInput id="component-outlined" type="text" sx={userStyle.input} placeholder="please enter Count" value={countValue} onChange={(e) => setCountValue(Number(e.target.value) > 0 ? Number(e.target.value) : 0)} />
            </FormControl>
          </Grid>
          <Grid item md={1} sm={1} xs={1} marginTop={1}>
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
        <br></br>

        {todoscheck.length > 0 &&
          todoscheck.map((data, index) => (
            <Box Width={100} key={index}>
              {data.edit === "notdone" ? (
                <>
                  <Grid container spacing={2}>
                    <Grid item md={3} xs={12} sm={6} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
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
                        <Grid item md={3} xs={12} sm={12} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
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

                    <Grid item md={3} xs={12} sm={6} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                      <FormControl size="small" fullWidth>
                        <Typography>Size-Height</Typography>
                        <TextField
                          size="small"
                          variant="outlined"
                          type="text"
                          sx={userStyle.input}
                          value={sizeheight}
                          onChange={(e) => {
                            setSizeheight(e.target.value);
                          }}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item md={3} xs={12} sm={6} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                      <FormControl size="small" fullWidth>
                        <Typography>Size-Width</Typography>
                        <TextField
                          size="small"
                          variant="outlined"
                          type="text"
                          sx={userStyle.input}
                          value={sizewidth}
                          onChange={(e) => {
                            setSizewidth(e.target.value);
                          }}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item md={3} xs={12} sm={6} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                      <FormControl size="small" fullWidth>
                        <Typography>Color</Typography>
                        <TextField
                          size="small"
                          variant="outlined"
                          value={colour}
                          onChange={(e) => {
                            setColour(e.target.value);
                          }}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item md={3} xs={12} sm={6} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                      <FormControl fullWidth size="small">
                        <Typography>Direction</Typography>
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
                          value={direction}
                          onChange={(e) => {
                            setDirection(e.target.value);
                          }}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                        >
                          <MenuItem value="" disabled>
                            Please Select Direction
                          </MenuItem>
                          <MenuItem value="left to right"> {"Left to Right"} </MenuItem>
                          <MenuItem value="right to left"> {"Right to Left"} </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item md={3} xs={12} sm={6} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                      <FormControl fullWidth size="small">
                        <Typography>Position</Typography>
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
                          value={position}
                          onChange={(e) => {
                            setPosition(e.target.value);
                          }}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                        >
                          <MenuItem value="" disabled>
                            Please Select Position
                          </MenuItem>
                          <MenuItem value="Left"> {"Left"} </MenuItem>
                          <MenuItem value="Right"> {"Right"} </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <br />
                    <Grid item md={1} sm={1} xs={1} marginTop={2}>
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
                    <Grid item md={1} sm={1} xs={1} marginTop={2}>
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
                  <br />
                  <Divider />
                  <br />
                </>
              ) : data.edit === "edit" ? (
                <>
                  <Grid container spacing={2}>
                    <Grid item md={3} xs={12} sm={6} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
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
                        <Grid item md={3} xs={12} sm={6} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
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
                    <Grid item md={3} xs={12} sm={6} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
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
                    <Grid item md={3} xs={12} sm={6} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                      <FormControl size="small" fullWidth>
                        <Typography>Size-Height</Typography>
                        <TextField
                          size="small"
                          variant="outlined"
                          type="text"
                          sx={userStyle.input}
                          placeholder="Please Enter Size-Height"
                          value={sizeheightedit}
                          onChange={(e) => {
                            setSizeheightedit(e.target.value);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={6} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                      <FormControl size="small" fullWidth>
                        <Typography>Size-Width</Typography>
                        <TextField
                          size="small"
                          variant="outlined"
                          type="text"
                          sx={userStyle.input}
                          placeholder="Please Enter Size-Width"
                          value={sizewidthedit}
                          onChange={(e) => {
                            setSizewidthedit(e.target.value);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={6} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                      <FormControl size="small" fullWidth>
                        <Typography>Color</Typography>
                        <TextField
                          size="small"
                          variant="outlined"
                          placeholder="Please Enter Color"
                          value={colouredit}
                          onChange={(e) => {
                            setColouredit(e.target.value);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={6} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                      <FormControl fullWidth size="small">
                        <Typography>Direction</Typography>
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
                          value={directionedit}
                          onChange={(e) => {
                            setDirectionedit(e.target.value);
                          }}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                        >
                          <MenuItem value="" disabled>
                            Please Select Direction
                          </MenuItem>
                          <MenuItem value="left to right"> {"Left to Right"} </MenuItem>
                          <MenuItem value="right to left"> {"Right to Left"} </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={6} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                      <FormControl fullWidth size="small">
                        <Typography>Position</Typography>
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
                          value={positionedit}
                          onChange={(e) => {
                            setPositionedit(e.target.value);
                          }}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                        >
                          <MenuItem value="" disabled>
                            Please Select Position
                          </MenuItem>
                          <MenuItem value="Left"> {"Left"} </MenuItem>
                          <MenuItem value="Right"> {"Right"} </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={3} xs={6} sx={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                      <Grid container spacing={2}>
                        <Grid item md={6} sm={6} xs={6}>
                          <Button
                            variant="contained"
                            disabled={nameedit === ""}
                            style={{
                              minWidth: "20px",
                              minHeight: "41px",
                              boxShadow: "none",
                              background: "transparent",
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
                    </Grid>
                  </Grid>
                  <br />
                  <Divider />
                  <br />
                </>
              ) : (
                // Read-only view
                <>
                  <Grid container spacing={1}>
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
                        Reference{" "}
                      </Button>
                      <br></br>
                    </Grid>

                    <Grid item md={9} sm={10.5} xs={10.5} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                      <Grid container spacing={2}>
                        <Grid item md={3} sm={3} xs={3} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                          <Typography sx={userStyle.SubHeaderText}>Data Fetch</Typography>
                          <Typography>{data.datafetch}</Typography>
                        </Grid>
                        <Grid item md={3} sm={3} xs={3} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                          {data.datafetch === "Existing" ? (
                            <>
                              {" "}
                              <Typography sx={userStyle.SubHeaderText}>Existing Option</Typography>
                              <Typography>{data.existingoption}</Typography>
                            </>
                          ) : (
                            ""
                          )}
                        </Grid>
                        <Grid item md={3} sm={3} xs={3} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                          <Typography sx={userStyle.SubHeaderText}>Name </Typography>
                          <Typography>{data.name}</Typography>
                        </Grid>
                        <Grid item md={3} sm={3} xs={3} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                          <Typography sx={userStyle.SubHeaderText}>Input Value </Typography>
                          <Typography>{data.inputvalue}</Typography>
                        </Grid>
                      </Grid>
                      <br />
                      <Grid container spacing={2}>
                        <Grid item md={3} sm={3} xs={3} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                          <Typography sx={userStyle.SubHeaderText}>Size-Height</Typography>
                          <Typography>{data.sizeheight}</Typography>
                        </Grid>
                        <Grid item md={3} sm={3} xs={3} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                          <Typography sx={userStyle.SubHeaderText}>Size-Width</Typography>
                          <Typography>{data.sizewidth}</Typography>
                        </Grid>
                        <Grid item md={3} sm={3} xs={3} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                          <Typography sx={userStyle.SubHeaderText}>Color</Typography>
                          <Typography>{data.colour}</Typography>
                        </Grid>
                        <Grid item md={1.5} sm={3} xs={3} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                          <Typography sx={userStyle.SubHeaderText}>Direction</Typography>
                          <Typography>{data.direction}</Typography>
                        </Grid>
                        <Grid item md={1.5} sm={3} xs={3} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                          <Typography sx={userStyle.SubHeaderText}>Position</Typography>
                          <Typography>{data.position}</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item md={1} sm={1.5} xs={1.5} sx={{ display: "flex", alignItems: "center" }}>
                      <Grid container>
                        <Grid item md={6} sm={6} xs={6}>
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
                        <Grid item md={6} sm={6} xs={6}>
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
                                fontSize: "1.0rem",
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
              )}
            </Box>
          ))}
      </div>

      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpenRef} onClose={handleCloseRef} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" fullWidth={true}>
          <DialogContent>
            <Grid item md={10} xs={12} sm={12}>
              <Typography sx={{ fontSize: "20px", fontWeight: "bolder", whiteSpace: "pre-line", wordBreak: "break-all" }}> References </Typography>
              <br />
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
                    <input className={classes.inputs} type="file" id="file-inputuploadcreatefirstnew1" accept="image/*" multiple onChange={handleInputChange} />
                    <label htmlFor="file-inputuploadcreatefirstnew1">
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
                                  onClick={() => handleDeleteFile(index)}
                                >
                                  <FaTrash style={{ color: "#a73131", fontSize: "12px" }} />
                                </Button>
                              </Grid>
                            </Grid>
                          </>
                        ))}
                      </Grid>
                    </Grid>
                  </TabPanel>
                  <TabPanel value="3">
                    <input className={classes.inputs} type="file" id="file-inputuploadcreatefirstnew2" accept=".pdf, .doc, .docx, .txt, .xls, .xlsx, .zip" multiple onChange={handleInputChangedocument} />
                    <label htmlFor="file-inputuploadcreatefirstnew2">
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
                                  <FaTrash style={{ color: "#a73131", fontSize: "12px" }} />
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
    </Box>
  );
}

export default SubmoduleViewList;
