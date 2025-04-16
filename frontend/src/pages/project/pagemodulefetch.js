import React, { useState, useContext, useEffect } from "react";
import { Box, Typography, OutlinedInput, Dialog, DialogContent, DialogActions, FormControl, Grid, Button, TextField } from "@mui/material";
import { userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import { useNavigate } from "react-router-dom";
import { FaArrowAltCircleRight, FaTrash } from "react-icons/fa";
import { handleApiError } from "../../components/Errorhandling";
import axios from "axios";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { UserRoleAccessContext, AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { useParams } from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import "./Multistep.css";
import { makeStyles } from "@material-ui/core";
import pdfIcon from "../../components/Assets/pdf-icon.png";
import wordIcon from "../../components/Assets/word-icon.png";
import excelIcon from "../../components/Assets/excel-icon.png";
import csvIcon from "../../components/Assets/CSV.png";
import fileIcon from "../../components/Assets/file-icons.png";
import UIDesign from "./multisteppagemodel/uidesign";
import Development from "./multisteppagemodel/development";
import Testing from "./multisteppagemodel/testing";
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
  },
}));

const SubmoduleViewList = () => {
  const id = useParams().id;
  const classes = useStyles();

  const [pageModelEdit, setPageModelEdit] = useState([]);
  const [selectedOptProjectEdit, setSelectedOptProjectEdit] = useState({
    value: "",
    label: "Please Select Project Name",
  });
  const [selectedOptSubProjectEdit, setSelectedOptSubProjectEdit] = useState({
    value: " ",
    label: "Please Select SubProject Name",
  });
  const [selectedOptModuleEdit, setSelectedOptModuleEdit] = useState({
    value: "",
    label: "Please Select Module Name",
  });
  const [selectedOptSubModuleEdit, setSelectedOptSubModuleEdit] = useState({
    value: "",
    label: "Please Select SubModule Name",
  });
  const [selectedpageTypeEdit, setSelectedpageTypeEdit] = useState({
    value: "",
    label: "Please Select PageType",
  });
  const [selectedpageTypeMainEdit, setSelectedpageTypeMainEdit] = useState({
    value: "",
    label: "Please select Main Page",
  });
  const [selectedpageTypeSubPageEdit, setSelectedpageTypeSubPageEdit] = useState({ value: "", label: "Please select Sub Page" });
  const [mainPageDropNameEdit, setMainPageDropNameEdit] = useState("");
  const [subPageDropNameEdit, setSubPageDropNameEdit] = useState("");
  const [subSubPageDropNameEdit, setSubSubPageDropNameEdit] = useState("");
  const [estimationTypeEdit, setEstimationTypeEdit] = useState("");
  const [estimationTimeEdit, setEstimationTimeEdit] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [checkpagemodel, setCheckpagemodel] = useState("");
  const [developeddata, setdevelopeddata] = useState("");
  const [testingdata, settestingdata] = useState("");

  const { isUserRoleAccess } = useContext(UserRoleAccessContext);

  const username = isUserRoleAccess.username;

  const backPage = useNavigate();

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

  // Error Popup model
  const [isUIupdateopen, setIsUIupdateopen] = useState(false);
  const handleClickUpdateopen = () => {
    setIsUIupdateopen(true);
  };
  const handleCloseupdate = () => {
    setIsUIupdateopen(false);
  };
  
  //id for login...
  let authToken = localStorage.APIToken;

  //get single row to edit....
  const getCode = async () => {
    try {
      let res = await axios.get(SERVICE.PAGEMODEL_LIMITED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const idFind = res?.data?.pagemodel?.some((item) => item._id == id);

      if (idFind === true) {
        let res = await axios.get(`${SERVICE.PAGEMODEL_SINGLE}/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setPageModelEdit(res?.data?.spagemodel);
        setSelectedOptProjectEdit({ value: res?.data?.spagemodel?.project, label: res?.data?.spagemodel?.project });
        setSelectedOptSubProjectEdit({ value: res?.data?.spagemodel?.subproject, label: res?.data?.spagemodel?.subproject });
        setSelectedOptModuleEdit({ value: res?.data?.spagemodel?.module, label: res?.data?.spagemodel?.module });
        setSelectedOptSubModuleEdit({ value: res?.data?.spagemodel?.submodule, label: res?.data?.spagemodel?.submodule });
        setSelectedpageTypeEdit({ value: res?.data?.spagemodel?.pagetype, label: res?.data?.spagemodel?.pagetype });
        setSelectedpageTypeMainEdit({ value: res?.data?.spagemodel?.mainpage, label: res?.data?.spagemodel?.mainpage });
        setSelectedpageTypeSubPageEdit({ value: res?.data?.spagemodel?.subpage, label: res?.data?.spagemodel?.subpage });
        setMainPageDropNameEdit(res?.data?.spagemodel?.mainpage);
        setSubPageDropNameEdit(res?.data?.spagemodel?.subpage);
        setSubSubPageDropNameEdit(res?.data?.spagemodel?.name);
        setEstimationTypeEdit(res?.data?.spagemodel?.estimationtype);
        setEstimationTimeEdit(res?.data?.spagemodel?.estimationtime);
        setSelectedFiles(res?.data?.spagemodel?.uploadpbi);
        setCheckpagemodel("PAGEMODEL");
      } else if (idFind === false) {
        let res = await axios.get(`${SERVICE.SUBMODULE_SINGLE}/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setPageModelEdit(res?.data?.ssubmodule);
        setSelectedOptProjectEdit({ value: res?.data?.ssubmodule?.project, label: res?.data?.ssubmodule?.project });
        setSelectedOptSubProjectEdit({ value: res?.data?.ssubmodule?.subproject, label: res?.data?.ssubmodule?.subproject });
        setSelectedOptModuleEdit({ value: res?.data?.ssubmodule?.module, label: res?.data?.ssubmodule?.module });
        setSelectedOptSubModuleEdit({ value: res?.data?.ssubmodule?.name, label: res?.data?.ssubmodule?.name });
        setEstimationTypeEdit(res?.data?.ssubmodule?.estimationtime);
        setEstimationTimeEdit(res?.data?.ssubmodule?.estimation);
        setCheckpagemodel("SUBMODULE");
      }
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
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

  const handleInputChangeuploadpbi = (event) => {
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

  const [taskboardid, setTaskboardid] = useState([]);

  const fetchTaskAssignBoardlistlimited = async () => {
    let res = await axios.get(`${SERVICE.TASKASSIGN_BOARD_LIST_LIMITED}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    setTaskboardid(res.data.taskAssignBoardList, "GFGH");
  };

  useEffect(() => {
    fetchTaskAssignBoardlistlimited();
    // fetchPagemodels();
  }, []);

  //first deletefile
  const handleDeleteFileuploadpbi = (index) => {
    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles.splice(index, 1);
    setSelectedFiles(newSelectedFiles);
  };

  let updateby = pageModelEdit?.updatedby;

  //add function...
  const sendRequest = async () => {
    let tasknamedata = selectedOptProjectEdit?.value + "_" + (selectedOptSubProjectEdit?.value + "_") + (selectedOptModuleEdit?.value + "_") + selectedOptSubModuleEdit?.value + (selectedpageTypeMainEdit?.value ? "_" + selectedpageTypeMainEdit?.value : "") + (selectedpageTypeSubPageEdit.value ? "_" + selectedpageTypeSubPageEdit.value : "") + (subSubPageDropNameEdit ? "_" + subSubPageDropNameEdit : "");
    let tasknamefull = tasknamedata?.replace(/ /g, "");

    let tasknamefullcase = tasknamefull?.toUpperCase();

    let taskIDdata = selectedOptProjectEdit?.value?.slice(0, 3) + "_" + (selectedOptSubProjectEdit?.value?.slice(0, 3) + "_") + (selectedOptModuleEdit?.value?.slice(0, 3) + "_") + selectedOptSubModuleEdit?.value?.slice(0, 3) + (selectedpageTypeMainEdit?.value ? "_" + selectedpageTypeMainEdit?.value?.slice(0, 3) : "") + (selectedpageTypeSubPageEdit.value ? "_" + selectedpageTypeSubPageEdit.value?.slice(0, 3) : "") + (subSubPageDropNameEdit ? "_" + subSubPageDropNameEdit?.slice(0, 3) : "");
    let newval = taskIDdata.toUpperCase() + "0001";
    const phases = ["UI", "Development", "Testing"];
    try {
      taskboardid.length > 0 &&
        taskboardid?.map(() => {
          let strings = taskIDdata.toUpperCase();
          let refNo = taskboardid[taskboardid?.length - 1]?.taskid;
          let digits = (taskboardid?.length + 1).toString();
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
        });
      let res = await axios.get(SERVICE.PAGEMODEL_LIMITED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const idFind = res?.data?.pagemodel?.some((item) => item._id == id);
      if (idFind) {
        await axios.put(`${SERVICE.PAGEMODEL_SINGLE}/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          status: "assigned",
          uploadpbi: selectedFiles,
          uidesign: [...dataFromChildUIDeign],
          develop: [...dataFromChildDevlop],
          testing: [...dataFromChildTest],
          testinguidesign: [...dataFromChildTestUI],
          // updatedby: [
          //   ...updateby,
          //   {
          //     name: String(username),
          //     date: String(new Date()),
          //   },
          // ],
        });
      } else {
        await axios.put(`${SERVICE.SUBMODULE_SINGLE}/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          status: "assigned",
          uploadpbi: selectedFiles,
          uidesign: [...dataFromChildUIDeign],
          develop: [...dataFromChildDevlop],
          testing: [...dataFromChildTest],
          testinguidesign: [...dataFromChildTestUI],
          // updatedby: [
          //   ...updateby,
          //   {
          //     name: String(username),
          //     date: String(new Date()),
          //   },
          // ],
        });
      }
      const requests = phases.map((item) => {
        return axios.post(SERVICE.TASKASSIGNBOARDLIST_CREATE, {
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
          name: subSubPageDropNameEdit,
          estimationtype: estimationTypeEdit,
          estimationtime: estimationTimeEdit,
          taskname: tasknamefullcase,
          allotedstatus: false,
          taskid: newval,
          phase: item,
          uidesign: [...dataFromChildUIDeign],
          develop: [...dataFromChildDevlop],
          testing: [...dataFromChildTest],
          testinguidesign: [...dataFromChildTestUI],
          uploadpbi: selectedFiles,
          prevId: id,
          addedby: [
            {
              name: String(username),
              date: String(new Date()),
            },
          ],
        });
      });

      const responses = await Promise.all(requests);

      backPage("/project/requirements");
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  //add function...
  const sendRequestDevelopment = async () => {
    const mergeddataui = [...dataFromChildTestUI];

    // Iterate through olddata and add missing items to mergeddata
    dataFromChildUIDeign.forEach((oldItem) => {
      const existsInMergedData = mergeddataui.some((newItem) => newItem.name === oldItem.name);

      if (!existsInMergedData) {
        mergeddataui.push(oldItem);
      }
    });

    const mergeddatatesting = [...dataFromChildTest];

    // Iterate through olddata and add missing items to mergeddata
    dataFromChildDevlop.forEach((oldItem) => {
      const existsInMergedData = mergeddatatesting.some((newItem) => newItem.name === oldItem.name);

      if (!existsInMergedData) {
        mergeddatatesting.push(oldItem);
      }
    });

    try {
      let res = await axios.get(SERVICE.PAGEMODEL_LIMITED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const idFind = res?.data?.pagemodel?.some((item) => item._id == id);
      if (idFind) {
        await axios.put(`${SERVICE.PAGEMODEL_SINGLE}/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },

          // develop: [dataFromChildDevlop],
          testing: [...mergeddatatesting],
          testinguidesign: [...mergeddataui],
          // updatedby: [
          //   ...updateby,
          //   {
          //     name: String(username),
          //     date: String(new Date()),
          //   },
          // ],
        });
      } else {
        await axios.put(`${SERVICE.SUBMODULE_SINGLE}/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },

          // develop: [dataFromChildDevlop],
          testing: [...mergeddatatesting],
          testinguidesign: [...mergeddataui],
          // updatedby: [
          //   ...updateby,
          //   {
          //     name: String(username),
          //     date: String(new Date()),
          //   },
          // ],
        });
      }
      NotificationManager.success("Successfully Updated 👍", "", 2000);
      settestingdata("testingdata");
      setStep(step + 1);
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    let missed_nametest = dataFromChildTest.reduce((acc, item, index) => {
      if (item.name === "") {
        acc.push(index);
      }
      return acc;
    }, []);
    //   setMissedNamedev(missed_nametest);
    let missed_datafetch = dataFromChildTest.reduce((acc, item, index) => {
      if (item.datafetch === "") {
        acc.push(index);
      }
      return acc;
    }, []);

    if (missed_datafetch.length > 0) {
      NotificationManager.error("Please Select DataFetch 🙃", "", 2000);
    } else if (missed_nametest.length > 0) {
      NotificationManager.error("Please Enter Name 🙃", "", 2000);
    } else if (dataFromChildTest.length === 0) {
      NotificationManager.error("Please Add one Requirement in Testing 🙃", "", 2000);
    } else {
      sendRequest();
    }
  };

  useEffect(() => {
    getCode();
  }, []);

  //UIDESIGN DEVELOPMENT TEST DATA FETCH STATE
  const [step, setStep] = useState(1);
  const [dataFromChildUIDeign, setDataFromChildUIDeign] = useState([]);
  const [dataFromChildDevlop, setDataFromChildDevlop] = useState([]);
  const [dataFromChildDevlopIncomplete, setDataFromChildDevlopIncomplete] = useState([]);
  const [dataFromChildTest, setDataFromChildTest] = useState([]);
  const [dataFromChildTestUI, setDataFromChildTestUI] = useState([]);
  const [taskassignBoardlist, settaskassignBoardlist] = useState([]);

  const getTaskDetails = async () => {
    let res_sub = await axios.get(SERVICE.TASKASSIGN_BOARD_LIST_LIMITED, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });
    settaskassignBoardlist(res_sub?.data?.taskAssignBoardList);
  };

  useEffect(() => {
    getTaskDetails();
  }, []);

  // PREV NEXT BUTTON ACTIONS
  const nextStep = () => {
    let missed_name = dataFromChildUIDeign.reduce((acc, item, index) => {
      if (item.name === "") {
        acc.push(index);
      }
      return acc;
    }, []);
    let missed_datafetch = dataFromChildUIDeign.reduce((acc, item, index) => {
      if (item.datafetch === "") {
        acc.push(index);
      }
      return acc;
    }, []);

    if (missed_datafetch.length > 0) {
      NotificationManager.error("Please Select DataFetch 🙃", "", 2000);
    } else if (missed_name.length > 0) {
      NotificationManager.error("Please Enter Name 🙃", "", 2000);
    } else if (dataFromChildUIDeign.length === 0) {
      NotificationManager.error("Please Add one Requirement in UIDesign 🙃", "", 2000);
    } else {
      // setStep(step + 1)
      const seenNames = {};
      const duplicates = dataFromChildUIDeign.filter((item) => {
        if (seenNames.hasOwnProperty(item.name)) {
          return true; // This is a duplicate
        }
        seenNames[item.name] = true;
        return false;
      });

      if (duplicates.length > 0) {
        NotificationManager.error("Duplicate name found 😢", "", 2000);
      } else {
        handleClickUpdateopen();
      }
    }
  };

  const nextStepdev = () => {
    // let missed_namedev = dataFromChildDevlop.reduce((acc, item, index) => {
    //   if (item.name === "") {
    //     acc.push(index);
    //   }
    //   return acc;
    // }, []);
    // //    setMissedNamedev(missed_namedev);
    // let missed_datafetch = dataFromChildDevlop.reduce((acc, item, index) => {
    //   if (item.datafetch === "") {
    //     acc.push(index);
    //   }
    //   return acc;
    // }, []);

    // if (missed_datafetch.length > 0) {
    //   NotificationManager.error("Please Select DataFetch 🙃", "", 2000);
    // } else if (missed_namedev.length > 0) {
    //   NotificationManager.error("Please Enter Name 🙃", "", 2000);
    // } else
    if (dataFromChildDevlop.length === 0) {
      NotificationManager.error("Please Add one Requirement in Development 🙃", "", 2000);
    } else {
      sendRequestDevelopment();
    }
  };

  const prevStep = () => {
    setdevelopeddata("");
    settestingdata("");
    setStep(step - 1);
    // setInputvalue("");
    // setRefCode("");
    // setRefImage([]);
    // setrefDocuments([]);
    // setRefLinks("");
    // setRefDetails("");
    // setRefIndex("");
  };

  //DATAFETCH FROM UIDESIGN
  // Define a function to receive data from the child component
  const handleDataFromChildUIDeign = (data) => {
    // Handle the data received from the child component
    setDataFromChildUIDeign(data);
  };
  //DATAFETCH FROM DEVELOPMENT
  const handleDataFromChildDevlop = (data) => {
    // Handle the data received from the child component
    setDataFromChildDevlop(data);
  };

  // //DATAFETCH FROM DEVELOPMENT
  // const handleDataFromChildDevlopIncomplete = (data) => {
  //   // Handle the data received from the child component
  //   setDataFromChildDevlopIncomplete(data);
  // };

  //DATAFETCH FROM TESTING
  const handleDataFromChildTest = (data) => {
    // Handle the data received from the child component
    setDataFromChildTest(data);
  };

  //DATAFETCH FROM TESTING
  const handleDataFromChildTestUI = (data) => {
    // Handle the data received from the child component
    setDataFromChildTestUI(data);
  };

  // //DATAFETCH FROM TESTING
  // const handleDataFromChildSamecheck = (data) => {
  //   // Handle the data received from the child component
  //   setDataFromChildsameascheck(data);
  // };

  //updateui design only
  const updateSubmitUIdesign = (e) => {
    e.preventDefault();
    updateUIRequirements();
  };

  const updateUIRequirements = async () => {
    try {
      let res = await axios.get(SERVICE.PAGEMODEL_LIMITED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const idFind = res?.data?.pagemodel?.some((item) => item._id == id);
      if (idFind) {
        await axios.put(`${SERVICE.PAGEMODEL_SINGLE}/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          status: "complete",
          uidesign: [...dataFromChildUIDeign],
          testinguidesign: [...dataFromChildUIDeign],
          // updatedby: [
          //   ...updateby,
          //   {
          //     name: String(username),
          //     date: String(new Date())
          //   }
          // ]
        });
      } else {
        await axios.put(`${SERVICE.SUBMODULE_SINGLE}/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          status: "complete",
          uidesign: [...dataFromChildUIDeign],
          testinguidesign: [...dataFromChildUIDeign],
          // updatedby: [
          //   ...updateby,
          //   {
          //     name: String(username),
          //     date: String(new Date())
          //   }
          // ]
        });
      }

      setdevelopeddata("developdata");
      setStep(step + 1);
      handleCloseupdate();
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
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
            <Box sx={{ width: "100%" }}>
              <UIDesign sendDataToParentUI={handleDataFromChildUIDeign} checkpagemodel={checkpagemodel} id={id} />
            </Box>
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
            <Box sx={{ width: "100%" }}>
              <Development
                sendDataToParentDEV={handleDataFromChildDevlop}
                id={id}
                developdata={developeddata}
                checkpagemodel={checkpagemodel}
                // sendDataToParentIncomplete={handleDataFromChildDevlopIncomplete}
                // dataFromUItoDevelop={dataFromChildUIDeign}
              />
            </Box>
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
          <Box sx={userStyle.dialogbox}>
            <Testing sendDataToParent={handleDataFromChildTest} testingdata={testingdata} checkpagemodel={checkpagemodel} sendDataToParentTestUI={handleDataFromChildTestUI} id={id} />
          </Box>
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
      <Headtitle title={"PAGE MODULE FETCH"} />
      <NotificationContainer />
      <Typography sx={userStyle.HeaderText}>Sub module link Page Model </Typography>
      <Box sx={userStyle.container}>
        <>
          <Typography sx={userStyle.SubHeaderText}></Typography>
          <br />
          <br />
          <Grid container spacing={2}>
            <Grid item md={4} xs={12} sm={6}>
              <Typography>
                {" "}
                Project <b style={{ color: "red" }}>*</b>
              </Typography>
              <FormControl size="small" fullWidth>
                <TextField
                  // options={projectEdit}
                  value={selectedOptProjectEdit.value}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <Typography>
                {" "}
                Sub Project <b style={{ color: "red" }}>*</b>
              </Typography>
              <FormControl size="small" fullWidth>
                <TextField value={selectedOptSubProjectEdit.value} />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <Typography>
                {" "}
                Module <b style={{ color: "red" }}>*</b>{" "}
              </Typography>
              <FormControl size="small" fullWidth>
                <TextField value={selectedOptModuleEdit.value} />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>
                  {" "}
                  SubModule Name <b style={{ color: "red" }}>*</b>
                </Typography>
                <TextField value={selectedOptSubModuleEdit.value} />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <Typography>
                Page Type<b style={{ color: "red" }}>*</b>
              </Typography>
              <TextField size="small" variant="outlined" fullWidth value={selectedpageTypeEdit.value} />
            </Grid>
            {selectedpageTypeEdit?.value?.split("-")[0] === "MAINPAGE" ? (
              <Grid item md={4} xs={12} sm={6}>
                <Typography>
                  Mainpage Name<b style={{ color: "red" }}>*</b>
                </Typography>
                <FormControl fullWidth size="small">
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={mainPageDropNameEdit}
                    // onChange={(e) => { setMainPageDropName(e.target.value); }}
                  />
                </FormControl>
              </Grid>
            ) : selectedpageTypeEdit?.value?.split("-")[0] === "SUBPAGE" ? (
              <>
                <Grid item md={4} xs={12} sm={6}>
                  <Typography>
                    Main Page<b style={{ color: "red" }}>*</b>
                  </Typography>
                  {/* <Selects */}
                  <TextField size="small" variant="outlined" fullWidth value={selectedpageTypeMainEdit.value} />
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
                      // onChange={(e) => { setSubPageDropNameEdit(e.target.value); }}
                    />
                  </FormControl>
                </Grid>
              </>
            ) : selectedpageTypeEdit?.value?.split("-")[0] === "SUBSUBPAGE" ? (
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
                      value={subSubPageDropNameEdit}
                      // onChange={(e) => { setSubSubPageDropNameEdit(e.target.value); }}
                    />
                  </FormControl>
                </Grid>
              </>
            ) : (
              ""
            )}
            <Grid item md={4} xs={12} sm={6}>
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
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
              ></TextField>
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <Typography>
                Estimation Time<b style={{ color: "red" }}>*</b>
              </Typography>
              <FormControl fullWidth size="small">
                <OutlinedInput id="component-outlined" type="Number" placeholder="please enter time" value={estimationTimeEdit} />
              </FormControl>
            </Grid>
          </Grid>
          <br />
          <br />
          <Grid container>
            <Grid item md={6} xs={6} sm={6}>
              <Grid container>
                <form>
                  <input className={classes.inputs} type="file" id="file-inputuploadcreatefirstNEW" multiple onChange={handleInputChangeuploadpbi} />
                  <label htmlFor="file-inputuploadcreatefirstNEW">
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
                </form>
              </Grid>
              <div>
                <br />
                <Grid container>
                  <Grid item md={12} sm={12} xs={12}>
                    {selectedFiles.map((file, index) => (
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
                              onClick={() => handleDeleteFileuploadpbi(index)}
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
          <br /> <br />
        </>
      </Box>

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
            &ensp;Testing
          </li>
        </ul>
        {steps.map((stepData, index) => (
          <div key={index} style={{ display: step === index + 1 ? "block" : "none" }}>
            {stepData.content}
          </div>
        ))}
      </div>

      {/* alert dialog box */}
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
      {/* Update dialog box */}
      <Box>
        <Dialog open={isUIupdateopen} onClose={handleCloseupdate} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth={true}>
          <Box sx={{ textAlign: "center", alignItems: "center" }}>
            <DialogContent>
              <Typography variant="h6"> Are you sure to update UI Design Requirements? </Typography>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" color="primary" onClick={updateSubmitUIdesign}>
                ok
              </Button>
              <Button sx={userStyle.btncancel} onClick={handleCloseupdate}>
                Cancel
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Box>
      {/* Update DEVELOP dialog box */}
      {/* <Box>
        <Dialog open={isDevelopupdateopen} onClose={handleCloseupdatedevelop} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth={true}>
          <Box sx={{ textAlign: "center", alignItems: "center" }}>
            <DialogContent>
              <Typography variant="h6"> Are you sure update Development Requirements? </Typography>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" color="primary" onClick={updateSubmitDevelop}>
                ok
              </Button>
              <Button sx={userStyle.btncancel} onClick={handleCloseupdatedevelop}>
                Cancel
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Box> */}
    </Box>
  );
};

export default SubmoduleViewList;
