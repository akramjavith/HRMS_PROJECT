import React, { useState, useContext, useEffect } from "react";
import { Box, Typography, OutlinedInput, Dialog, TextareaAutosize, Select, MenuItem, DialogTitle, DialogContentText, DialogContent, DialogActions, FormControl, Grid, Button, TextField } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
import "jspdf-autotable";
import { Link, useNavigate } from "react-router-dom";
import pdfIcon from "../../../components/Assets/pdf-icon.png";
import wordIcon from "../../../components/Assets/word-icon.png";
import excelIcon from "../../../components/Assets/excel-icon.png";
import csvIcon from "../../../components/Assets/CSV.png";
import fileIcon from "../../../components/Assets/file-icons.png";
import { handleApiError } from "../../../components/Errorhandling";
import axios from "axios";
import { FaArrowAltCircleRight, FaTrash } from "react-icons/fa";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import { useParams } from "react-router-dom"; 
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import TabList from "@mui/lab/TabList";
import { makeStyles } from "@material-ui/core";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Tab from "@material-ui/core/Tab";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";

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

function SubmoduleViewList() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [step, setStep] = useState(1);
  const classes = useStyles();
  const id = useParams().id;

  // component state
  const [componentId, setComponentId] = useState([]);
  const [subcomponentId, setSubComponentId] = useState([]);
  const [componentGroupingId, setComponentgrpingId] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState({ value: "", label: "Please Select Component Name" });
  const [selectedSubComponent, setSelectedSubComponent] = useState({ value: "", label: "Please Select SubComponent Name" });
  const [selectedComponentgrp, setSelectedComponentgrp] = useState({ value: "", label: "Please Select ComponentGroup Name" });
  const [compgrouping, setCompgrouping] = useState([]);
  const { isUserRoleAccess } = useContext(UserRoleAccessContext);
  const username = isUserRoleAccess.username;
  const [valueEdit, setValueEdit] = useState("1");
  const [workorderstatus, setWorkorderstatus] = useState("");
  const [updateBy, setUpdateBy] = useState([]);
  const [taskname, setTaskName] = useState("");
  const [githublink, setGithublink] = useState("");
  const [taskcode, setTaskcode] = useState([]);

  //Datatable

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
  const handleClickOpenRef = () => {
    setIsErrorOpenRef(true);
  };
  const handleCloseRef = () => {
    setIsErrorOpenRef(false);
    setRefCode("");
    setRefImage([]);
    setRefDetails("");
    setRefLinks("");
    setrefDocuments([]);
  };

  const [isErrorOpenRefEdit, setIsErrorOpenRefEdit] = useState(false);
  const handleClickOpenRefEdit = () => {
    setIsErrorOpenRefEdit(true);
  };
  const handleCloseRefEdit = () => {
    setIsErrorOpenRefEdit(false);
    setRefCodeEdit("");
    setRefImageEdit([]);
    setRefDetailsEdit("");
    setRefLinksEdit("");
    setrefDocumentsEdit([]);
  };

  //   new todo states
  const [todoscheck, setTodoscheck] = useState([]);
  const [datafetch, setDatafetch] = useState("");
  const [existingoption, setExistingoption] = useState("");
  const [name, setName] = useState("");
  const [inputvalue, setInputvalue] = useState("");
  const [sizeheight, setSizeheight] = useState("");
  const [sizewidth, setSizewidth] = useState("");
  const [colour, setColour] = useState("");
  const [direction, setDirection] = useState("");
  const [position, setPosition] = useState("");
  const [countValue, setCountValue] = useState(0);

  const [refCode, setRefCode] = useState("");
  const [refImage, setRefImage] = useState([]);
  const [refImageUpdate, setRefImageUpdate] = useState([]);
  const [refDocuments, setrefDocuments] = useState([]);
  const [refLinks, setRefLinks] = useState("");
  const [refDetails, setRefDetails] = useState("");
  const [refIndex, setRefIndex] = useState("");

  const [refCodeEdit, setRefCodeEdit] = useState("");
  const [refImageEdit, setRefImageEdit] = useState([]);
  const [refImageUpdateEdit, setRefImageUpdateEdit] = useState([]);
  const [refDocumentsEdit, setrefDocumentsEdit] = useState([]);
  const [refLinksEdit, setRefLinksEdit] = useState("");
  const [refDetailsEdit, setRefDetailsEdit] = useState("");
  const [refIndexEdit, setRefIndexEdit] = useState("");

  //  Datefield
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;

  // work order state
  const [teamData, setTeamsData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [workOrder, setWorkOrder] = useState({
    assignby: "",
    assignmode: "Auto",
    assigndate: "",
    team: "",
    calculatedtime: "",
  });

  const [workOrderTodos, setWorkOrderTodos] = useState([]);
  const [selectedProgress, setSelectedProgress] = useState("");
  const [subComponentEditing, setSubComponentEditing] = useState(workOrderTodos.map(() => []));
  const [showReplaceConfirmation, setShowReplaceConfirmation] = useState(false);

  // const handleCreateTodocheck = (id) => {
  //     const newTodos = Array.from({ length: countValue }, (item, index) => {
  //         if (index === id) {
  //             return {
  //                 subcomponent: selectedSubComponent.value,
  //                 idval: todoscheck.length + index,
  //                 edit: "notdone",
  //                 datafetch: datafetch,
  //                 existingoption: existingoption,
  //                 name: name,
  //                 inputvalue: inputvalue,
  //                 sizeheight: sizeheight,
  //                 sizewidth: sizewidth,
  //                 colour: colour,
  //                 direction: direction,
  //                 position: position,
  //                 refCode: refCode,
  //                 refImage: refImage,
  //                 refDocuments: refDocuments,
  //                 refLinks: refLinks,
  //                 refDetails: refDetails,
  //             };
  //         } else {
  //             return {
  //                 subcomponent: selectedSubComponent.value,
  //                 idval: todoscheck.length + index,
  //                 edit: "done",
  //                 datafetch: datafetch,
  //                 existingoption: existingoption,
  //                 name: name,
  //                 inputvalue: inputvalue,
  //                 sizeheight: sizeheight,
  //                 sizewidth: sizewidth,
  //                 colour: colour,
  //                 direction: direction,
  //                 position: position,
  //                 refCode: refCode,
  //                 refImage: refImage,
  //                 refDocuments: refDocuments,
  //                 refLinks: refLinks,
  //                 refDetails: refDetails,
  //             };
  //         }
  //     });
  //     const newTodo = {
  //         datafetch: datafetch,
  //         idval: id,
  //         edit: "notdone",
  //         existingoption: existingoption,
  //         name: name,
  //         inputvalue: inputvalue,
  //         sizeheight: sizeheight,
  //         sizewidth: sizewidth,
  //         colour: colour,
  //         direction: direction,
  //         position: position,
  //     };

  //     setTodoscheck([...todoscheck, ...newTodos]);
  // };

  // const [editingIndexedit, setEditingIndexedit] = useState(-1);

  // const handleDeleteTodoEdit = (id) => {
  //     const updatedTodos = todoscheck.filter(todo => todo.idval != id);
  //     setTodoscheck(updatedTodos);
  // };

  // ///Create Edit todo Functionality
  // const handleUpdateTodoEdit = (id) => {
  //     // Update the todo with the specified id
  //     setEditingIndexedit(id);
  //     const updatedTodos = todoscheck.map(todo => {
  //         if (todo.idval == id) {
  //             return {
  //                 ...todo, edit: "done", datafetch: datafetch, existingoption: existingoption, name: name, inputvalue: inputvalue, sizeheight: sizeheight,
  //                 sizewidth: sizewidth, colour: colour, direction: direction, position: position
  //             };
  //             // ... update other values ...
  //         }
  //         return todo;
  //     });

  //     setTodoscheck(updatedTodos)
  //     setDatafetch("");
  //     setExistingoption("");
  //     setName("");
  //     setInputvalue("");
  //     setSizeheight("");
  //     setColour("");
  //     setDirection("");
  //     setPosition("");
  // };

  // ///Create Edit todo Functionality
  // const handleUpdateTodo = (id) => {
  //     // Update the todo with the specified id
  //     setEditingIndexedit(id);
  //     const updatedTodos = todoscheck.map(todo => {
  //         if (todo.idval == id) {
  //             return {
  //                 ...todo, edit: "done", datafetch: datafetchedit, existingoption: existingoptionedit, name: nameedit, inputvalue: inputvalueedit, sizeheight: sizeheightedit,
  //                 sizewidth: sizewidthedit, colour: colouredit, direction: directionedit, position: positionedit
  //             };
  //             // ... update other values ...
  //         }
  //         return todo;
  //     });
  //     setTodoscheck(updatedTodos)
  //     setgetTodoIndex(-1)
  // };

  // ///Create Edit todo Functionality
  // const handleEditTodo = (id) => {
  //     // Update the todo with the specified id
  //     setEditingIndexedit(id);
  //     const updatedTodos = todoscheck.map(todo => {
  //         if (todo.idval == id) {
  //             return { ...todo, edit: "done" };
  //             // ... update other values ...
  //         }
  //         return todo;
  //     });
  //     setTodoscheck(updatedTodos)
  //     setgetTodoIndex(-1)
  // };

  // ///Edit todo Functionality
  // const handleEditTodoEdit = (id) => {
  //     setEditingIndexedit(id);

  //     const updatedTodos = todoscheck.map(todo => {
  //         if (todo.idval == id) {
  //             return { ...todo, edit: "edit" }
  //         }
  //         return todo
  //     });
  //     setTodoscheck(updatedTodos)
  //     setDatafetchedit(updatedTodos[id]?.datafetch);
  //     setExistingoptionedit(updatedTodos[id]?.existingoption);
  //     setNameedit(updatedTodos[id]?.name);
  //     setInputvalueedit(updatedTodos[id]?.inputvalue);
  //     setSizeheightedit(updatedTodos[id]?.sizeheight);
  //     setSizewidthedit(updatedTodos[id]?.sizewidth);
  //     setColouredit(updatedTodos[id]?.colour);
  //     setDirectionedit(updatedTodos[id]?.direction);
  //     setPositionedit(updatedTodos[id]?.position);

  //     // ... set other edited values ...
  // };

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

      //default components
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

  //work order starts
  //fetch teams
  const fetchteams = async () => {
    try {
      let teams = await axios.get(SERVICE.TEAMS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTeamsData(teams?.data?.teamsdetails);
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //fetch teams
  const fetchtaskcode = async () => {
    try {
      let res = await axios.get(SERVICE.TASKASSIGN_BOARD_LIST, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTaskcode(res?.data?.taskAssignBoardList);
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  useEffect(() => {
    fetchteams();
    fetchtaskcode();
  }, []);

  //get all employees list details
  const fetchEmployee = async (value) => {
    try {
      let res_employee = await axios.get(SERVICE.USERALLLIMIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let result = res_employee?.data?.users?.filter((d) => {
        if (d.team === value) {
          return d.username;
        }
      });
      setEmployees(result);
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  // get all shifts
  const fetchAllPriority = async () => {
    try {
      let res_priority = await axios.get(SERVICE.PRIORITY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setPriorities(res_priority?.data?.priorities);
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  useEffect(() => {
    fetchAllPriority();
  }, []);

  // workprogress onchange
  const handleProgressChange = (e) => {
    setSelectedProgress(e.target.value);
  };

  // work order todo update
  const handleWorkOrderUpdateTodoEdit = (progressIndex, subComponentIndex, reference, inputvalue) => {
    const updatedTodos = [...workOrderTodos];
    updatedTodos[progressIndex].subComponents[subComponentIndex][reference] = inputvalue;
    setWorkOrderTodos(updatedTodos);
    setWorkorderstatus(workOrderTodos?.length == 0 ? "Yet to assign" : "assigned");
  };

  // workorder add
  const addProgressItem = (idval) => {
    if (workOrder.assignmode == "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Assign Mode"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (workOrder.assigndate == "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Assigned Date"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (workOrder.team == "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Team"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (workOrder.calculatedtime == "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Fill Calculated Time"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedProgress == "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Work Progress"}</p>
        </>
      );
      handleClickOpenerr();
    } else {
      // Check if the selected work progress already exists in the list
      const existingTodo = workOrderTodos.find((todo) => todo.progress === selectedProgress);

      if (existingTodo) {
        // Work progress already exists, show an alert
        // alert("Work progress already exists!");
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Work progress already exists"}</p>
          </>
        );
        handleClickOpenerr();

        return; // Do not add a duplicate todo
      } else if (workOrderTodos.length > 0) {
        setShowReplaceConfirmation(true);
      } else {
        const newRequirement = {
          progress: selectedProgress,
          idval: idval,
          subComponents: todoscheck.map((item, subIndex) => ({
            id: `${idval}_${subIndex}`,
            subcomponent: item.subcomponent,
            subEstTime: item.subEstTime,
            developer: "",
            priority: "",
          })),
        };

        setWorkOrderTodos([...workOrderTodos, newRequirement]);
        setSubComponentEditing([...subComponentEditing, Array(todoscheck.length).fill(false)]);
      }
    }
  };

  // replace function
  const handleReplaceConfirmationYes = () => {
    // Get the last item in the workOrderTodos array
    const lastTodoIndex = workOrderTodos.length - 1;
    if (lastTodoIndex >= 0) {
      const updatedTodos = [...workOrderTodos];
      updatedTodos[lastTodoIndex] = {
        progress: selectedProgress,
        idval: lastTodoIndex, // You can use the index as idval
        subComponents: todoscheck.map((item, subIndex) => ({
          id: `${lastTodoIndex}_${subIndex}`,
          subcomponent: item.subcomponent,
          subEstTime: item.subEstTime,
          developer: "",
          priority: "",
        })),
      };

      // Update the state with the replaced work progress
      setWorkOrderTodos(updatedTodos);
      setSubComponentEditing([...subComponentEditing, Array(todoscheck.length).fill(false)]);
    }

    // Close the confirmation dialog
    setShowReplaceConfirmation(false);
  };

  // Function to handle "No" button click in the confirmation dialog
  const handleReplaceConfirmationNo = (idval) => {
    // Close the confirmation dialog
    setShowReplaceConfirmation(false);

    // Add the new work progress
    const newRequirement = {
      progress: selectedProgress,
      idval: idval,
      subComponents: todoscheck.map((item, subIndex) => ({
        id: `${idval}_${subIndex}`,
        subcomponent: item.subcomponent,
        subEstTime: item.subEstTime,
        developer: "",
        priority: "",
      })),
    };

    setWorkOrderTodos([...workOrderTodos, newRequirement]);
    setSubComponentEditing([...subComponentEditing, Array(todoscheck.length).fill(false)]);
  };

  // work order icons toggle
  const toggleSubComponentEditing = (id) => {
    const [progressIndex, subIndex] = id.split("_").map(Number); // Split the ID to get progressIndex and subIndex
    const newSubComponentEditing = [...subComponentEditing];
    newSubComponentEditing[progressIndex][subIndex] = !newSubComponentEditing[progressIndex][subIndex];
    setSubComponentEditing(newSubComponentEditing);
  };

  //work order ends

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

  const [show, setShow] = useState(false);

  const [pageBranchEdit, setPageBranchEdit] = useState("");

  //id for login...
  let loginid = localStorage.LoginUserId;
  let authToken = localStorage.APIToken;

  const [pageModelEdit, setPageModelEdit] = useState([]);
  const [selectedOptProjectEdit, setSelectedOptProjectEdit] = useState({ value: "", label: "Please Select Project Name" });
  const [selectedOptSubProjectEdit, setSelectedOptSubProjectEdit] = useState({ value: " ", label: "Please Select SubProject Name" });
  const [selectedOptModuleEdit, setSelectedOptModuleEdit] = useState({ value: "", label: "Please Select Module Name" });
  const [selectedOptSubModuleEdit, setSelectedOptSubModuleEdit] = useState({ value: "", label: "Please Select SubModule Name" });
  const [selectedpageTypeEdit, setSelectedpageTypeEdit] = useState({ value: "", label: "Please Select PageType" });
  const [selectedpageTypeMainEdit, setSelectedpageTypeMainEdit] = useState({ value: "", label: "Please select Main Page" });
  const [selectedpageTypeSubPageEdit, setSelectedpageTypeSubPageEdit] = useState({ value: "", label: "Please select Sub Page" });
  const [mainPageDropNameEdit, setMainPageDropNameEdit] = useState("");
  const [subPageDropNameEdit, setSubPageDropNameEdit] = useState("");
  const [subSubPageDropNameEdit, setSubSubPageDropNameEdit] = useState("");
  const [estimationTypeEdit, setEstimationTypeEdit] = useState("");
  const [estimationTimeEdit, setEstimationTimeEdit] = useState("");
  const [componentCheckBox, setComponentCheckBox] = useState("");
  const [taskcodeconcat, setTaskcodeconcat] = useState("");
  const [taskUIdesignrequirements, setTaskUIdesignrequirements] = useState([]);
  const [taskDeveloprequirements, setTaskDeveloprequirements] = useState([]);

  //get single row to edit....

  //get single row to edit....
  const getCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.TASKASSIGNBOARDLIST_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      let resPagemodel = await axios.get(`${SERVICE.PAGEMODEL_SINGLE}/${res?.data?.staskAssignBoardList?.prevId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setPageModelEdit(res?.data?.staskAssignBoardList.project);
      setUpdateBy(res?.data?.staskAssignBoardList?.updatedby);
      setSelectedOptProjectEdit({ value: res?.data?.staskAssignBoardList?.project, label: res?.data?.staskAssignBoardList?.project });
      setSelectedOptSubProjectEdit({ value: res?.data?.staskAssignBoardList?.subproject, label: res?.data?.staskAssignBoardList?.subproject });
      setSelectedOptModuleEdit({ value: res?.data?.staskAssignBoardList?.module, label: res?.data?.staskAssignBoardList?.module });
      setSelectedOptSubModuleEdit({ value: res?.data?.staskAssignBoardList?.submodule, label: res?.data?.staskAssignBoardList?.submodule });
      setSelectedpageTypeEdit({ value: res?.data?.staskAssignBoardList?.pagetype, label: res?.data?.staskAssignBoardList?.pagetype });
      setSelectedpageTypeMainEdit({ value: res?.data?.staskAssignBoardList?.mainpage, label: res?.data?.staskAssignBoardList?.mainpage });
      setSelectedpageTypeSubPageEdit({ value: res?.data?.staskAssignBoardList?.subpage, label: res?.data?.staskAssignBoardList?.subpage });
      setMainPageDropNameEdit(res?.data?.staskAssignBoardList?.name);
      setSubPageDropNameEdit(res?.data?.staskAssignBoardList?.name);
      setSubSubPageDropNameEdit(res?.data?.staskAssignBoardList?.name);
      setEstimationTypeEdit(res?.data?.staskAssignBoardList?.estimationtype);
      setEstimationTimeEdit(res?.data?.staskAssignBoardList?.estimationtime);
      setPageBranchEdit(res?.data?.staskAssignBoardList?.pageBranch);
      setTodoscheck(res?.data?.staskAssignBoardList?.subComReq);
      setComponentCheckBox(res?.data?.staskAssignBoardList?.compgrpCheck);
      setSelectedComponentgrp({ value: res?.data?.staskAssignBoardList?.pageBranch?.componentgrouping, label: res?.data?.staskAssignBoardList?.componentgrouping });
      setSelectedSubComponent({ value: res?.data?.staskAssignBoardList?.subcomponent, label: res?.data?.staskAssignBoardList?.subcomponent });
      setSelectedComponent({ value: res?.data?.staskAssignBoardList?.component, label: res?.data?.staskAssignBoardList?.component });
      // setSelectedFiles(res?.data?.staskAssignBoardList?.uploadpbi);
      setTaskName(res?.data?.staskAssignBoardList.project.toUpperCase() + "_" + res?.data?.staskAssignBoardList?.subproject.toUpperCase() + "_" + res?.data?.staskAssignBoardList?.module.toUpperCase() + "_" + res?.data?.staskAssignBoardList?.submodule.toUpperCase());
      setTaskcodeconcat(res?.data?.staskAssignBoardList.project?.substring(0, 3) + res?.data?.staskAssignBoardList?.subproject?.substring(0, 3) + res?.data?.staskAssignBoardList?.module?.substring(0, 3) + res?.data?.staskAssignBoardList?.submodule?.substring(0, 3));
      //pagemodel fetch
      setTaskUIdesignrequirements(resPagemodel.data.spagemodel.uidesign);
      setTaskDeveloprequirements(resPagemodel.data.spagemodel.develop);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

    let newval = taskcodeconcat.toUpperCase() + "0001";

  const handleInputChangeuploadpbitask = (event) => {
    const files = event.target.files;
    let newSelectedFiles = [...selectedFiles];

    for (let i = 0; i < files?.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = () => {
        newSelectedFiles.push({
          name: file.name,
          size: file.size,
          type: file.type,
          preview: reader.result,
          base64: reader.result.split(",")[1],
        });
        setSelectedFiles(newSelectedFiles);
      };
      reader.readAsDataURL(file);
    }
  };

  //first deletefile
  const handleDeleteFileuploadpbitask = (index) => {
    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles.splice(index, 1);
    setSelectedFiles(newSelectedFiles);
  };

  const [buttonStatus, setButtonStatus] = useState(false);
  const ButtonStatus = () => {
    setButtonStatus(true);
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
  const ReferenceSectionEdit = () => {
    todoscheck[refIndexEdit].refCode = refCodeEdit;
    todoscheck[refIndexEdit].refImage = refImageEdit;
    todoscheck[refIndexEdit].refDocuments = refDocumentsEdit;
    todoscheck[refIndexEdit].refLinks = refLinksEdit;
    todoscheck[refIndexEdit].refDetails = refDetailsEdit;
    handleCloseRefEdit();
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

  //first allexcel....
  const getFileIconDocument = (fileName) => {
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
  const handleDeleteFileDocument = (index) => {
    const newSelectedFiles = [...refDocuments];
    newSelectedFiles.splice(index, 1);
    setrefDocuments(newSelectedFiles);
  };

  //tab context Edit create
  const handleChangeEdit = (event, newValue) => {
    setValueEdit(newValue);
  };
  //reference images for edit todo create section
  const handleInputChangeEditTodo = (event) => {
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

  //first deletefile in edit page create section
  const handleDeleteFileEdit = (index) => {
    const newSelectedFiles = [...refImageEdit];
    newSelectedFiles.splice(index, 1);
    setRefImageEdit(newSelectedFiles);
  };

  //reference documents in edit page cretae
  const handleInputChangedocumentEdit = (event) => {
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

  //first deletefile  in edit page create
  const handleDeleteFileDocumentEdit = (index) => {
    const newSelectedFiles = [...refDocumentsEdit];
    newSelectedFiles.splice(index, 1);
    setrefDocumentsEdit(newSelectedFiles);
  };

  //reference Links for edit page create
  const handleChangeSummaryEdit = (value) => {
    setRefLinksEdit(value);
  };

  const backPage = useNavigate();

  //add function...
  const sendRequest = async () => {
    try {
      await axios.put(`${SERVICE.TASKASSIGNBOARDLIST_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        project: selectedOptProjectEdit?.value,
        subproject: selectedOptSubProjectEdit?.value,
        module: selectedOptModuleEdit?.value,
        submodule: selectedOptSubModuleEdit?.value,
        pagetypename: pageModelEdit.pagetypename,
        pagetype: selectedpageTypeEdit?.value,
        mainpage: selectedpageTypeMainEdit?.value,
        subpage: selectedpageTypeSubPageEdit.value,
        name: pageModelEdit.pagetypename === "MAINPAGE" ? mainPageDropNameEdit : pageModelEdit.pagetypename === "SUBPAGE" ? subPageDropNameEdit : subSubPageDropNameEdit,
        estimationtype: estimationTypeEdit,
        estimationtime: estimationTimeEdit,
        status: "assigned",
        taskname: taskname,
        taskid: newval,
        githublink: githublink,
        uploadpbi: selectedFiles,
        taskassignboardliststatus: String(workorderstatus),
        componentgrouping: selectedComponentgrp.value,
        component: selectedComponent.value,
        subcomponent: selectedSubComponent.value,
        count: countValue,
        subComReq: [...todoscheck],
        updatedby: [
          ...updateBy,
          {
            name: String(username),
            date: String(new Date()),
          },
        ],
        //workorder
        assignby: String(workOrder.assignby),
        assignmode: String(workOrder.assignmode),
        assigndate: String(workOrder.assigndate),
        team: String(workOrder.team),
        calculatedtime: String(workOrder.calculatedtime),
        workorders: workOrderTodos,
      });
      setWorkOrderTodos([]);
      backPage("/project/taskassignboard");
      setTodoscheck([]);
      setDatafetch("");
      setExistingoption("");
      setName("");
      setSizeheight("");
      setSizewidth("");
      setColour("");
      setDirection("");
      setPosition("");
      setCountValue(0);
      setRefCode("");
      setRefImage([]);
      setrefDocuments([]);
      setRefLinks("");
      setRefDetails("");
      setRefIndex("");
      setSelectedComponent({ value: "", label: "Please Select Component Name" });
      setSelectedSubComponent({ value: "", label: "Please Select SubComponent Name" });
      setSelectedComponentgrp({ value: "", label: "Please Select ComponentGroup Name" });
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const timeSubmit = async () => {
    try {
      let res = await axios.put(`${SERVICE.TASKASSIGNBOARDLIST_SINGLE}/${id}`, {
        subComReq: [...todoscheck],
      });
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Update successfully"}</p>
        </>
      );
      handleClickOpenerr();
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedComponentgrp.value === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose Component Group"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedComponent.value === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose Component"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedSubComponent.value === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose Sub-Component"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (todoscheck.length < 1) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Add Atleast One Requirement By adding Count"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (workOrder.team == "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Add Atleast One Requirement By adding Count"}</p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequest();
    }
  };

  const handleClear = () => {
    setTodoscheck([]);
    setDatafetch("");
    setExistingoption("");
    setName("");
    setSizeheight("");
    setSizewidth("");
    setColour("");
    setDirection("");
    setPosition("");
    setCountValue(0);
    setRefCode("");
    setRefImage([]);
    setrefDocuments([]);
    setRefLinks("");
    setRefDetails("");
    setRefIndex("");
    setSelectedComponent({ value: "", label: "Please Select Component Name" });
    setSelectedSubComponent({ value: "", label: "Please Select SubComponent Name" });
    setSelectedComponentgrp({ value: "", label: "Please Select ComponentGroup Name" });
  };

  const [editingIndexcheck, setEditingIndexcheck] = useState(-1);
  const [editsubcomponent, setEditsubcomponent] = useState("");
  const [editestimatetime, setEditestimatetime] = useState("");
  const [editestimatetype, setEditestimatetype] = useState("");

  const handleEditTodocheck = (index) => {
    setEditingIndexcheck(index);
    setEditsubcomponent(todoscheck[index].subcomponent);
    setEditestimatetime(todoscheck[index].subEstTime);
    setEditestimatetype(todoscheck[index].subEstType);
    // setEditedTodocheck({ label: todoscheck[index].label, value: todoscheck[index].label });
    // setEditedTododescheck(todoscheck[index].time);
    // seteditNewpriority(todoscheck[index].prioritystatus);
    // setSelectedOptioncheck(null);
  };

  const handleUpdateTodocheck = () => {
    // let updatedTodoscheck = todoscheck.map((data, index) => {

    //   if (productindex === index) {
    //     if (reference === "time") {
    //       return { ...data, subEstTime: inputvalue }
    //     }
    //   }
    //   return data;
    // })
    // setTodoscheck(updatedTodoscheck);

    if (editestimatetime !== "") {
      const subcomponent = editsubcomponent;
      const subEstTime = editestimatetime;
      if (
        !todoscheck.find(
          (todo, index) => index !== editingIndexcheck
          // &&
          // todo.subcomponent.toLowerCase() === subcomponent.toLowerCase()
        )
      ) {
        const newTodoscheck = [...todoscheck];
        // newTodoscheck[editingIndexcheck].subcomponent = subcomponent;
        newTodoscheck[editingIndexcheck].subEstTime = subEstTime;
        setTodoscheck(newTodoscheck);
        setEditingIndexcheck(-1);
        setEditestimatetime("");
      }
    } else {
      const newTodoscheck = [...todoscheck];
      newTodoscheck[editingIndexcheck].subEstTime = "";
      setTodoscheck(newTodoscheck);
      setEditingIndexcheck(-1);
      setEditestimatetime("");
    }
  };

  useEffect(() => {
    fetchSubComponent();
    fetchComponentGrp();
  }, [pageModelEdit, selectedOptProjectEdit]);

  useEffect(() => {
    getCode(id);
  }, []);
  useEffect(() => {
    fetchComponentGrpCheck();
  }, [componentCheckBox, selectedComponentgrp]);

  // const addSubComponent = (progress) => {
  //   const newSubComponent = {
  //     name: `SubComponent ${progress.subComponents.length + 1}`,
  //     estimationTime: 0, // You can set the default estimation time here
  //   };

  //   const updatedRequirements = requirements.map((item) => {
  //     if (item.progress === progress.progress) {
  //       return {
  //         ...item,
  //         subComponents: [...item.subComponents, newSubComponent],
  //       };
  //     }
  //     return item;
  //   });

  //   setRequirements(updatedRequirements);
  // };

  const nextStep = () => {
    setStep(step + 1);
  };
  const nextStepdev = () => {
    setStep(step + 1);
  };
  const prevStep = () => {
    setStep(step - 1);
  };

  //MULTISTEPS
  const steps = [
    {
      title: "REQUIREMENTS",
      content: (
        <>
          <Headtitle title={"REQUIREMENTS"} />
          <Box sx={userStyle.dialogbox}>
            <Typography sx={userStyle.SubHeaderText}> UI Design </Typography>
            <br />
            <br />
            <br />
            <br />
            <Grid container spacing={2}>
              {taskUIdesignrequirements.map((item, index) => (
                <>
                  <Grid item md={4} sm={6} xs={12} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>{`${index + 1}.  ${item.name}`}</Typography>
                  </Grid>
                  <Grid item md={3} sm={6} xs={12}>
                    <Typography>Developer</Typography>
                    <FormControl fullWidth>
                      <Select></Select>
                    </FormControl>
                  </Grid>
                  <Grid item md={2} sm={6} xs={12}>
                    <Typography>Priority</Typography>
                    <FormControl fullWidth>
                      <Select></Select>
                    </FormControl>
                  </Grid>
                </>
              ))}
            </Grid>
            <br />
          </Box>
          <br />
          <Grid sx={{ display: "flex", justifyContent: "right" }}>
            <Button className="next" variant="contained" onClick={nextStep}>
              Submit & Next
            </Button>
          </Grid>
        </>
      ),
    },
    {
      title: "REQUIREMENTS",
      content: (
        <>
          <Headtitle title={"REQUIREMENTS"} />
          <Box sx={userStyle.dialogbox}>
            <Typography sx={userStyle.HeaderText}>Development </Typography>
            <br />
            <br />
            <br />
            <br />
            <Grid container spacing={2}>
              {taskDeveloprequirements.map((item, index) => (
                <>
                  <Grid item md={4} sm={6} xs={12} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>{`${index + 1}.  ${item.name}`}</Typography>
                  </Grid>
                  <Grid item md={3} sm={6} xs={12}>
                    <Typography>Developer</Typography>
                    <FormControl fullWidth>
                      <Select></Select>
                    </FormControl>
                  </Grid>
                  <Grid item md={2} sm={6} xs={12}>
                    <Typography>Priority</Typography>
                    <FormControl fullWidth>
                      <Select></Select>
                    </FormControl>
                  </Grid>
                </>
              ))}
            </Grid>
          </Box>
          <br />
          <Grid container>
            <Grid item md={6} sm={6} xs={6}>
              <Button className="prev" variant="contained" onClick={prevStep}>
                Previous
              </Button>
            </Grid>
            <Grid item md={6} sm={6} xs={6} sx={{ display: "flex", justifyContent: "end" }}>
              <Button className="next" variant="contained" onClick={nextStepdev}>
                Submit & Next
              </Button>
            </Grid>
          </Grid>
        </>
      ),
    },
    {
      title: "REQUIREMENTS",
      content: (
        <>
          <Headtitle title={"REQUIREMENTS"} />
          <Box sx={userStyle.dialogbox}>Source Integration</Box>
          <br />
          <Grid container>
            <Grid item md={6} sm={6} xs={6}>
              <Button className="prev" variant="contained" onClick={prevStep}>
                Previous
              </Button>
            </Grid>
            <Grid item md={6} sm={6} xs={6} sx={{ display: "flex", justifyContent: "end" }}>
              <Button className="next" variant="contained" color="success" onClick={handleSubmit}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </>
      ),
    },
    // Add similar objects for other steps...
  ];

  return (
    <Box>
      {/* <TodoList/> */}
      {/*  */}
      <Headtitle title={"TASK CREATE"} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>Task Details</Typography>
      <Box sx={userStyle.dialogbox}>
        <>
          <Typography sx={userStyle.SubHeaderText}></Typography>
          <br />
          <br />
          <Grid container spacing={2}>
            <Grid item md={4} xs={12} sm={6}>
              <Typography>
                Project <b style={{ color: "red" }}>*</b>
              </Typography>
              <FormControl size="small" fullWidth>
                <TextField
                  // options={projectEdit}
                  value={selectedOptProjectEdit.value}
                  readOnly
                />
              </FormControl>
            </Grid>
            {/* {subprojectnone == "None" ? null : */}
            <Grid item md={4} xs={12} sm={6}>
              <Typography>
                Sub Project <b style={{ color: "red" }}>*</b>
              </Typography>
              <FormControl size="small" fullWidth>
                <TextField value={selectedOptSubProjectEdit.value} readOnly />
              </FormControl>
            </Grid>
            {/* } */}
            <Grid item md={4} xs={12} sm={6}>
              <Typography>
                Module <b style={{ color: "red" }}>*</b>
              </Typography>
              <FormControl size="small" fullWidth>
                <TextField value={selectedOptModuleEdit.value} readOnly />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>
                  {" "}
                  SubModule Name <b style={{ color: "red" }}>*</b>
                </Typography>
                <TextField value={selectedOptSubModuleEdit.value} readOnly />
              </FormControl>
            </Grid>

            <Grid item md={4} xs={12} sm={6}>
              <Typography>
                Page Type<b style={{ color: "red" }}>*</b>
              </Typography>
              <TextField size="small" variant="outlined" fullWidth value={selectedpageTypeEdit.value} readOnly />
            </Grid>
            {selectedpageTypeEdit.value.split("-")[0] === "MAINPAGE" ? (
              <Grid item md={4} xs={12} sm={6}>
                <Typography>
                  Mainpage Name<b style={{ color: "red" }}>*</b>
                </Typography>
                <FormControl fullWidth size="small">
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={mainPageDropNameEdit}
                    readOnly
                    // onChange={(e) => { setMainPageDropName(e.target.value); }}
                  />
                </FormControl>
              </Grid>
            ) : selectedpageTypeEdit.value.split("-")[0] === "SUBPAGE" ? (
              <>
                <Grid item md={4} xs={12} sm={6}>
                  <Typography>
                    Main Page<b style={{ color: "red" }}>*</b>
                  </Typography>
                  {/* <Selects */}
                  <TextField size="small" variant="outlined" readOnly fullWidth value={selectedpageTypeMainEdit.value} />
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <Typography>
                    Subpage Name<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={subPageDropNameEdit}
                      readOnly
                      // onChange={(e) => { setSubPageDropNameEdit(e.target.value); }}
                    />
                  </FormControl>
                </Grid>
              </>
            ) : selectedpageTypeEdit.value.split("-")[0] === "SUBSUBPAGE" ? (
              <>
                <Grid item md={4} xs={12} sm={6}>
                  <Typography>
                    Main Page<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <TextField size="small" variant="outlined" fullWidth value={selectedpageTypeMainEdit.value} />
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <Typography>
                    Sub page<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <TextField size="small" variant="outlined" fullWidth value={selectedpageTypeSubPageEdit.value} />
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <Typography>
                    Subssub page<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      readOnly
                      value={subSubPageDropNameEdit}
                      // onChange={(e) => { setSubSubPageDropNameEdit(e.target.value); }}
                    />
                  </FormControl>
                </Grid>
              </>
            ) : (
              ""
            )}
            <Grid item md={2} xs={12} sm={3}>
              <Typography>
                Estimation Type<b style={{ color: "red" }}>*</b>
              </Typography>
              <TextField
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
                value={estimationTypeEdit}
                readOnly
                inputProps={{ "aria-label": "Without label" }}
              ></TextField>
            </Grid>
            <Grid item md={2} xs={12} sm={3}>
              <Typography>
                Estimation Time<b style={{ color: "red" }}>*</b>
              </Typography>
              <FormControl fullWidth size="small">
                <OutlinedInput id="component-outlined" type="Number" readOnly placeholder="please enter time" value={estimationTimeEdit} onChange={(e) => setEstimationTimeEdit(e.target.value)} />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <Typography>Task Name</Typography>
              <FormControl fullWidth size="small">
                <OutlinedInput id="component-outlined" type="text" placeholder="Task Name" value={taskname} onChange={(e) => setTaskName(e.target.value)} readOnly />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <Typography>Task ID</Typography>

              {taskcode.length > 0 &&
                taskcode?.map(() => {
                  let strings = taskcodeconcat.toUpperCase();
                  let refNo = taskcode[taskcode?.length - 1]?.taskid;
                  let digits = (taskcode?.length + 1).toString();
                  const stringLength = refNo?.length;
                  let lastChar = refNo?.charAt(stringLength - 1);
                  let getlastBeforeChar = refNo?.charAt(stringLength - 2);
                  let getlastThreeChar = refNo?.charAt(stringLength - 3);
                  let lastBeforeChar = refNo?.slice(-2);
                  let lastThreeChar = refNo?.slice(-3);
                  let lastDigit = refNo?.slice(-4);
                  let refNOINC = parseInt(lastChar ? lastChar : 0) + 1;
                  let refLstTwo = parseInt(lastBeforeChar) + 1;
                  let refLstThree = parseInt(lastThreeChar) + 1;
                  let refLstDigit = parseInt(lastDigit) + 1;
                  if (digits.length < 4 && getlastBeforeChar == 0 && getlastThreeChar == 0) {
                    refNOINC = "000" + refNOINC;
                    newval = strings + refNOINC;
                  } else if (digits.length < 4 && getlastBeforeChar > 0 && getlastThreeChar == 0) {
                    refNOINC = "00" + refLstTwo;
                    newval = strings + refNOINC;
                  } else if (digits.length < 4 && getlastThreeChar > 0) {
                    refNOINC = "0" + refLstThree;
                    newval = strings + refNOINC;
                  } else {
                    refNOINC = refLstDigit;
                    newval = strings + refNOINC;
                  }
                })}
              <FormControl fullWidth size="small">
                <OutlinedInput id="component-outlined" type="text" placeholder="Task ID" value={newval} readOnly />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <Typography>Github Link</Typography>
              <FormControl fullWidth size="small">
                <OutlinedInput id="component-outlined" type="text" placeholder="Git Hub Link" value={githublink} onChange={(e) => setGithublink(e.target.value)} />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <Typography>Upload PBI</Typography>
              <Grid container>
                <input className={classes.inputs} type="file" id="file-inputuploadcreatefirst" multiple onChange={handleInputChangeuploadpbitask} />
                <label htmlFor="file-inputuploadcreatefirst">
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
                    Upload PBI &ensp; <CloudUploadIcon />
                  </Button>
                </label>
              </Grid>
              <div>
                <br />
                <Grid container>
                  <Grid item md={12} sm={12} xs={12}>
                    {selectedFiles?.map((file, index) => (
                      <>
                        <Grid container>
                          <Grid
                            item
                            md={2}
                            sm={2}
                            xs={2}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
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
                                  height={10}
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
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="subtitle2">{file.name} </Typography>
                          </Grid>
                          <Grid
                            item
                            md={2}
                            sm={2}
                            xs={2}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Button
                              sx={{
                                padding: "14px 14px",
                                minWidth: "40px !important",
                                borderRadius: "50% !important",
                                ":hover": {
                                  backgroundColor: "#80808036", // theme.palette.primary.main
                                },
                              }}
                              onClick={() => handleDeleteFileuploadpbitask(index)}
                            >
                              <FaTrash style={{ color: "#a73131", fontSize: "14px" }} />
                            </Button>
                          </Grid>
                        </Grid>
                      </>
                    ))}
                  </Grid>
                </Grid>
                <br />
              </div>
            </Grid>
          </Grid>
          <br />
          <br />
        </>
      </Box>
      <Box></Box>
      <br />

      {/* Accordion details  */}

      {/* workprogress details */}
      <Box sx={userStyle.container}>
        <Grid container spacing={2}>
          <Grid item md={4} xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <Typography>
                Assigned By <b style={{ color: "red" }}>*</b>
              </Typography>
              <TextField readOnly size="small" value={isUserRoleAccess.username} />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <Typography>
                Assign Mode <b style={{ color: "red" }}>*</b>
              </Typography>
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
                value={workOrder.assignmode}
                onChange={(e) => {
                  setWorkOrder({ ...workOrder, assignmode: e.target.value });
                }}
                // displayEmpty
                inputProps={{ "aria-label": "Without label" }}
              >
                <MenuItem value="Auto"> {"Auto"} </MenuItem>
                <MenuItem value="Manual"> {"Manual"} </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={4} sm={6} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>
                Assigned Date <b style={{ color: "red" }}>*</b>
              </Typography>
              <TextField
                size="small"
                value={workOrder.assignmode === "Auto" ? today : workOrder.assigndate}
                type="date"
                onChange={(e) => {
                  setWorkOrder({ ...workOrder, assigndate: e.target.value });
                }}
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <Typography>
                Team <b style={{ color: "red" }}>*</b>
              </Typography>
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
                value={workOrder.team}
                onChange={(e) => {
                  setWorkOrder({ ...workOrder, team: e.target.value, assignby: isUserRoleAccess.username, calculatedtime: estimationTypeEdit === "Hours" ? estimationTimeEdit * 60 : estimationTimeEdit });
                  fetchEmployee(e.target.value);
                }}
                // displayEmpty
                inputProps={{ "aria-label": "Without label" }}
              >
                {teamData &&
                  teamData.map((item, index) => (
                    <MenuItem key={index} value={item.teamname}>
                      {" "}
                      {item.teamname}{" "}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <Typography>
                Calculated Time <b style={{ color: "red" }}>*</b>
              </Typography>
              <TextField
                size="small"
                value={estimationTypeEdit === "Hours" ? estimationTimeEdit * 60 + " " + "Minutes" : estimationTypeEdit === "Year" ? estimationTimeEdit + " " + "Year" : estimationTypeEdit === "Month" ? estimationTimeEdit + " " + "Month" : estimationTimeEdit}
                // onChange={(e) => { setWorkOrder({ ...workOrder, calculatedtime: e.target.value }); }}
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <Typography>
                Work Progress <b style={{ color: "red" }}>*</b>
              </Typography>
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
                value={selectedProgress}
                onChange={handleProgressChange}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
              >
                <MenuItem value="UI Design"> {"UI Design"} </MenuItem>
                <MenuItem value="Development"> {"Development"} </MenuItem>
                <MenuItem value="Source Integration"> {"Source Integration"} </MenuItem>
                <MenuItem value="Test Development"> {"Test Development"} </MenuItem>
                <MenuItem value="Test Environment"> {"Test Environment"} </MenuItem>
                <MenuItem value="Production Deployment"> {"Production Deployment"} </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {/* <Grid item md={2} sm={1} xs={1}>
                <Button
                  variant="contained"
                  style={{
                    height: "30px",
                    minWidth: "20px",
                    padding: "19px 13px",
                    color: "white",
                    marginTop: "24px",
                    background: "rgb(25, 118, 210)",
                  }}
                  onClick={() => addProgressItem(workOrderTodos.length)}
                >
                  <FaPlus style={{ fontSize: "15px" }} />
                </Button>
              </Grid> */}
        </Grid>
        <br />
        <br />

        <Grid container spacing={2}>
          <Grid item md={12}>
            {workOrderTodos.map((progress, progressIndex) => (
              <Grid container spacing={1} key={progressIndex} sx={{ margin: "0 auto" }}>
                <Grid item md={12}>
                  <Grid sx={{ display: "flex" }}>
                    <Typography sx={{ fontWeight: "bold" }}>{progressIndex + 1 + "." + " " + progress.progress}</Typography>&ensp;
                    <Link target={"_blank"} to={`/project/task/taskview/${id}`}>
                      <Button variant="text" sx={userStyle.buttondelete}>
                        <VisibilityOutlinedIcon sx={{ marginTop: "-5px" }} />
                      </Button>
                    </Link>
                  </Grid>
                </Grid>
                <Grid item md={1}>
                  <Typography sx={{ fontWeight: "bold" }}>S.No</Typography>
                </Grid>
                <Grid item md={2.5}>
                  <Typography sx={{ fontWeight: "bold" }}>Sub-Component Name</Typography>
                </Grid>
                <Grid item md={2}>
                  <Typography sx={{ fontWeight: "bold" }}>Estimation Time</Typography>
                </Grid>
                <Grid item md={2.5}>
                  <Typography sx={{ fontWeight: "bold" }}>Developer</Typography>
                </Grid>
                <Grid item md={2.5}>
                  <Typography sx={{ fontWeight: "bold" }}>Priority</Typography>
                </Grid>
                <Grid item md={1.5}></Grid>
                <Grid item md={12}>
                  {progress.subComponents.map((subComponent, subIndex) => (
                    <Grid container spacing={1} key={subComponent.id}>
                      <Grid item md={1}>
                        <Typography>{subIndex + 1 + "."}</Typography>
                      </Grid>
                      <Grid item md={2.5}>
                        <Typography>{subComponent.subcomponent}</Typography>
                      </Grid>
                      <Grid item md={2}>
                        <Typography>{subComponent.subEstTime}</Typography>
                      </Grid>
                      <Grid item md={6.5}>
                        {subComponentEditing[progressIndex][subIndex] ? (
                          // Edit mode
                          <>
                            <Grid container spacing={1}>
                              <Grid item md={4}>
                                <Typography>{subComponent.developer}</Typography>
                              </Grid>
                              <Grid item md={4}>
                                <Typography>{subComponent.priority}</Typography>
                              </Grid>
                              <Grid item md={1}>
                                <Button
                                  variant="contained"
                                  sx={{
                                    minWidth: "20px",
                                    minHeight: "41px",
                                    background: "transparent",
                                    boxShadow: "none",
                                    marginTop: "0px !important",
                                    "&:hover": {
                                      background: "#f4f4f4",
                                      borderRadius: "50%",
                                      minHeight: "41px",
                                      minWidth: "20px",
                                      boxShadow: "none",
                                    },
                                  }}
                                  onClick={() => {
                                    // Toggle editing state when Edit icon is clicked
                                    toggleSubComponentEditing(subComponent.id); // Toggle editing state for this subComponent
                                  }}
                                >
                                  <BorderColorOutlinedIcon style={{ color: "#1976d2", fontSize: "1.2rem" }} />
                                </Button>
                              </Grid>
                            </Grid>
                          </>
                        ) : (
                          // Display mode
                          <>
                            <Grid container spacing={1}>
                              <Grid item md={4}>
                                <Select
                                  fullWidth
                                  size="small"
                                  labelId="demo-select-small"
                                  id="demo-select-small"
                                  placeholder="Select Developer"
                                  MenuProps={{
                                    PaperProps: {
                                      style: {
                                        maxHeight: 200,
                                        width: 80,
                                      },
                                    },
                                  }}
                                  value={subComponent.developer}
                                  onChange={(e) => handleWorkOrderUpdateTodoEdit(progressIndex, subIndex, "developer", e.target.value)}
                                  displayEmpty
                                  inputProps={{ "aria-label": "Without label" }}
                                >
                                  {employees.map((item, empIndex) => (
                                    <MenuItem key={empIndex} value={item.firstname + " " + item.lastname}>
                                      {item.firstname + " " + item.lastname}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </Grid>
                              <Grid item md={4}>
                                {/* Render priority dropdown */}
                                <Select
                                  fullWidth
                                  size="small"
                                  labelId="demo-select-small"
                                  id="demo-select-small"
                                  placeholder="Select Priority"
                                  MenuProps={{
                                    PaperProps: {
                                      style: {
                                        maxHeight: 200,
                                        width: 80,
                                      },
                                    },
                                  }}
                                  value={subComponent.priority}
                                  onChange={(e) => handleWorkOrderUpdateTodoEdit(progressIndex, subIndex, "priority", e.target.value)}
                                  displayEmpty
                                  inputProps={{ "aria-label": "Without label" }}
                                >
                                  {priorities.map((item, priIndex) => (
                                    <MenuItem key={priIndex} value={item.name}>
                                      {item.name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </Grid>
                              <Grid item md={1}>
                                <Button
                                  variant="contained"
                                  sx={{
                                    minWidth: "20px",
                                    minHeight: "41px",
                                    background: "transparent",
                                    boxShadow: "none",
                                    marginTop: "0px !important",
                                    "&:hover": {
                                      background: "#f4f4f4",
                                      borderRadius: "50%",
                                      minHeight: "41px",
                                      minWidth: "20px",
                                      boxShadow: "none",
                                    },
                                  }}
                                  onClick={() => {
                                    // Save changes and toggle editing state when CheckCircleIcon is clicked
                                    // Implement the logic to save the selected value here
                                    toggleSubComponentEditing(subComponent.id); // Toggle editing state for this subComponent
                                  }}
                                >
                                  <CheckCircleOutlinedIcon style={{ color: "#216d21", fontSize: "1.5rem" }} />
                                </Button>
                              </Grid>
                            </Grid>
                          </>
                        )}
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Replace Alert Dialog */}
        <Dialog open={showReplaceConfirmation} onClose={() => setShowReplaceConfirmation(false)} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">Replace Existing Progress?</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">Do you want to replace the existing progress or add it alongside the existing one?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleReplaceConfirmationNo(workOrderTodos.length)} color="primary">
              No
            </Button>
            <Button onClick={() => handleReplaceConfirmationYes(workOrderTodos.length)} color="primary" autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
        <br />
        <br />
      </Box>
      <br />
      <br />
      <div className="multistep-css">
        <ul className="indicatorpage">
          <li className={step === 1 ? "active" : null}>
            <FaArrowAltCircleRight />
            &ensp;UI Design
          </li>
          <li className={step === 2 ? "active" : null}>
            <FaArrowAltCircleRight />
            &ensp;Development
          </li>
          <li className={step === 3 ? "active" : null}>
            <FaArrowAltCircleRight />
            &ensp;Source Integration
          </li>
          <li className={step === 4 ? "active" : null}>
            <FaArrowAltCircleRight />
            &ensp;Testing Development
          </li>
          <li className={step === 5 ? "active" : null}>
            <FaArrowAltCircleRight />
            &ensp;Testing Environment
          </li>
          <li className={step === 6 ? "active" : null}>
            <FaArrowAltCircleRight />
            &ensp;Production Deployment
          </li>
        </ul>
        {steps.map((stepData, index) => (
          <div key={index} style={{ display: step === index + 1 ? "block" : "none" }}>
            {stepData.content}
          </div>
        ))}
      </div>

      <br />
      <br />
      <Box sx={userStyle.container}>
        <Grid container spacing={2}>
          <Grid item md={6} xs={12} sm={6}>
            <Button
              variant="contained"
              onClick={(e) => {
                handleSubmit(e);
              }}
            >
              SAVE
            </Button>
          </Grid>
          <Grid item md={6} xs={12} sm={6}>
            <Link to={"/project/taskassignboard"}>
              <Button sx={userStyle.btncancel}>BACK</Button>
            </Link>
          </Grid>
        </Grid>
      </Box>

      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpenRef} onClose={handleCloseRef} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg">
          <Box sx={{ padding: "20px 50px" }}>
            <DialogContent>
              <Grid item md={10} xs={12} sm={12}>
                <Typography sx={{ fontSize: "20px", fontWeight: "bolder", whiteSpace: "pre-line", wordBreak: "break-all" }}> References </Typography>
                <Box container spacing={2}>
                  <div>
                    <TabContext value={value}>
                      <Box
                        style={{
                          borderBottom: 1,
                          borderColor: "divider",
                          borderRadius: "4px",
                          boxShadow: "0px 0px 4px #b7b1b1",
                          border: "1px solid #c3c3c3",
                          overflow: "hidden",
                          marginBottom: "0px",
                          boxSizing: "border-box",
                        }}
                      >
                        <TabList
                          onChange={handleChange}
                          aria-label="lab API tabs example"
                          sx={{
                            backgroundColor: "#f5f5f5",
                            borderRadius: "4px",
                            ".MuiTab-textColorPrimary.Mui-selected": {
                              color: "white",
                              border: "1px solid #b5afaf",
                              borderBottom: "none",
                              background: " #3346569c",
                            },
                            ".css-1aquho2-MuiTabs-indicator": {
                              background: "none",
                            },
                          }}
                        >
                          <Tab
                            label="Code"
                            value="1"
                            sx={userStyle.tablelistStyle}

                            // }}
                          />

                          <Tab label="Images" value="2" sx={userStyle.tablelistStyle} />
                          <Tab label="Documents" value="3" sx={userStyle.tablelistStyle} />
                          <Tab label="Links" value="4" sx={userStyle.tablelistStyle} />
                          <Tab label="Details" value="5" sx={userStyle.tablelistStyle} />
                        </TabList>
                      </Box>
                      <TabPanel value="1" index={0} sx={userStyle.tabpanelstyle}>
                        <FormControl fullWidth size="small">
                          <TextareaAutosize
                            aria-label="minimum height"
                            minRows={5}
                            value={refCode}
                            onChange={(e) => {
                              setRefCode(e.target.value);
                            }}
                          />
                        </FormControl>
                        {/* </Grid> */}
                      </TabPanel>
                      <TabPanel value="2" index={1} sx={userStyle.tabpanelstyle}>
                        <input className={classes.inputs} type="file" id="file-inputuploadcreatefirst" multiple onChange={handleInputChange} />
                        <label htmlFor="file-inputuploadcreatefirst">
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
                            Upload IMAGES &ensp; <CloudUploadIcon />
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
                                      <FaTrash style={{ fontSize: "medium", color: "#a73131", fontSize: "14px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </>
                            ))}
                          </Grid>
                        </Grid>
                      </TabPanel>
                      <TabPanel value="3" index={2} sx={userStyle.tabpanelstyle}>
                        <input className={classes.inputs} type="file" id="file-inputuploadcreatefirst" multiple onChange={handleInputChangedocument} />
                        <label htmlFor="file-inputuploadcreatefirst">
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
                                        <img className={classes.preview} src={getFileIconDocument(file.name)} height="25" alt="file icon" />
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
                                      <FaTrash style={{ fontSize: "medium", color: "#a73131", fontSize: "14px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </>
                            ))}
                          </Grid>
                        </Grid>
                      </TabPanel>
                      <TabPanel value="4" index={3} sx={userStyle.tabpanelstyle}>
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
                      <TabPanel value="5" index={4} sx={userStyle.tabpanelstyle}>
                        <FormControl fullWidth size="small">
                          <TextareaAutosize
                            aria-label="minimum height"
                            minRows={5}
                            value={refDetails}
                            onChange={(e) => {
                              setRefDetails(e.target.value);
                            }}
                          />
                        </FormControl>
                      </TabPanel>
                    </TabContext>
                  </div>
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
            </DialogActions>
          </Box>
        </Dialog>
      </Box>

      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpenRefEdit} onClose={handleCloseRefEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg">
          <Box sx={{ padding: "20px 50px" }}>
            <DialogContent>
              <Grid item md={10} xs={12} sm={12}>
                <Typography sx={{ fontSize: "20px", fontWeight: "bolder", whiteSpace: "pre-line", wordBreak: "break-all" }}> References </Typography>
                <Box container spacing={2}>
                  <div>
                    <TabContext value={valueEdit}>
                      <Box
                        style={{
                          borderBottom: 1,
                          borderColor: "divider",
                          borderRadius: "4px",
                          boxShadow: "0px 0px 4px #b7b1b1",
                          border: "1px solid #c3c3c3",
                          overflow: "hidden",
                          marginBottom: "0px",
                          boxSizing: "border-box",
                        }}
                      >
                        <TabList
                          onChange={handleChangeEdit}
                          aria-label="lab API tabs example"
                          sx={{
                            backgroundColor: "#f5f5f5",
                            borderRadius: "4px",
                            ".MuiTab-textColorPrimary.Mui-selected": {
                              color: "white",
                              border: "1px solid #b5afaf",
                              borderBottom: "none",
                              background: " #3346569c",
                            },
                            ".css-1aquho2-MuiTabs-indicator": {
                              background: "none",
                            },
                          }}
                        >
                          <Tab
                            label="Code"
                            value="1"
                            sx={userStyle.tablelistStyle}

                            // }}
                          />

                          <Tab label="Images" value="2" sx={userStyle.tablelistStyle} />
                          <Tab label="Documents" value="3" sx={userStyle.tablelistStyle} />
                          <Tab label="Links" value="4" sx={userStyle.tablelistStyle} />
                          <Tab label="Details" value="5" sx={userStyle.tablelistStyle} />
                        </TabList>
                      </Box>
                      <TabPanel value="1" index={0} sx={userStyle.tabpanelstyle}>
                        <FormControl fullWidth size="small">
                          <TextareaAutosize
                            aria-label="minimum height"
                            minRows={5}
                            value={refCodeEdit}
                            onChange={(e) => {
                              setRefCodeEdit(e.target.value);
                            }}
                          />
                        </FormControl>
                        {/* </Grid> */}
                      </TabPanel>
                      <TabPanel value="2" index={1} sx={userStyle.tabpanelstyle}>
                        <input className={classes.inputs} type="file" id="file-inputuploadcreatefirst" multiple onChange={handleInputChangeEditTodo} />
                        <label htmlFor="file-inputuploadcreatefirst">
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
                            Upload IMAGES &ensp; <CloudUploadIcon />
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
                                      onClick={() => handleDeleteFileEdit(index)}
                                    >
                                      <FaTrash style={{ fontSize: "medium", color: "#a73131", fontSize: "14px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </>
                            ))}
                          </Grid>
                        </Grid>
                      </TabPanel>
                      <TabPanel value="3" index={2} sx={userStyle.tabpanelstyle}>
                        <input className={classes.inputs} type="file" id="file-inputuploadcreatefirst" multiple onChange={handleInputChangedocumentEdit} />
                        <label htmlFor="file-inputuploadcreatefirst">
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
                                        <img className={classes.preview} src={getFileIconDocument(file.name)} height="25" alt="file icon" />
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
                                      onClick={() => handleDeleteFileDocumentEdit(index)}
                                    >
                                      <FaTrash style={{ fontSize: "medium", color: "#a73131", fontSize: "14px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </>
                            ))}
                          </Grid>
                        </Grid>
                      </TabPanel>
                      <TabPanel value="4" index={3} sx={userStyle.tabpanelstyle}>
                        <ReactQuill
                          style={{ height: "100px" }}
                          value={refLinksEdit}
                          onChange={handleChangeSummaryEdit}
                          modules={{
                            toolbar: [[{ header: "1" }, { header: "2" }, { font: [] }], [{ size: [] }], ["bold", "italic", "underline", "strike", "blockquote"], [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }], ["link", "image", "video"], ["clean"]],
                          }}
                          formats={["header", "font", "size", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "indent", "link", "image", "video"]}
                        />
                      </TabPanel>
                      <TabPanel value="5" index={4} sx={userStyle.tabpanelstyle}>
                        <FormControl fullWidth size="small">
                          <TextareaAutosize
                            aria-label="minimum height"
                            minRows={5}
                            value={refDetailsEdit}
                            onChange={(e) => {
                              setRefDetailsEdit(e.target.value);
                            }}
                          />
                        </FormControl>
                      </TabPanel>
                    </TabContext>
                  </div>
                </Box>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  ReferenceSectionEdit();
                }}
              >
                ok
              </Button>
            </DialogActions>
          </Box>
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