import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, Grid, Button, DialogActions, Dialog, DialogContent, Select, MenuItem, FormControl } from "@mui/material";
import { userStyle, colourStyles } from "../../../../pageStyle";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { Link } from "react-router-dom";
import axios from "axios";
import { SERVICE } from "../../../../services/Baseservice";
import { UserRoleAccessContext, AuthContext } from "../../../../context/Appcontext";
import { ThreeDots } from "react-loader-spinner";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Headtitle from "../../../../components/Headtitle";
import { handleApiError } from "../../../../components/Errorhandling";
import Selects from "react-select";
import { MultiSelect } from "react-multi-select-component";
import TaskallAdmin from "../taskadmin/tasklistadmin";
import PageHeading from "../../../../components/PageHeading";

function Tasklist() {
  const { auth } = useContext(AuthContext);
  const [isTaskdots, setIsTaskdots] = useState(false);
  const [Accessdrop, setAccesDrop] = useState("");
  const { isUserRoleAccess, isUserRoleCompare,pageName,setPageName, } = useContext(UserRoleAccessContext);

  // FILTER DROPDOWNS
  const [project, setProject] = useState([]);
  const [subProject, setSubProject] = useState([]);
  const [module, setModule] = useState([]);
  const [subModule, setSubModule] = useState([]);
  const [mainpageTypeDropdown, setMainpageTypeDropdown] = useState([]);
  const [subpageTypeDropdown, setSubpageTypeDropdown] = useState([]);
  const [subsubpageTypeDropdown, setsubSubpageTypeDropdown] = useState([]);

  const [selectedProject, setSelectedProject] = useState([]);
  const [selectedSubProject, setSelectedSubProject] = useState([]);
  const [selectedModule, setSelectedModule] = useState([]);
  const [selectedSubModule, setSelectedSubModule] = useState([]);
  const [selectedMainpage, setSelectedMainpage] = useState([]);
  const [selectedSubpage, setSelectedSubpage] = useState([]);
  const [selectedSubSubpage, setSelectedSubSubpage] = useState([]);

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  const [userTasks, setUserTasks] = useState([]);
  const [userTasksDev, setUserTasksDev] = useState([]);
  const [userTasksTest, setUserTasksTest] = useState([]);
  const fetchUsersTasks = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.USERTASKS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        user: String(isUserRoleAccess.companyname),
      });
      setIsTaskdots(true);
      setUserTasks(res?.data?.taskUI);
      setUserTasksDev(res?.data?.taskDev);
      setUserTasksTest(res?.data?.taskTest);
    } catch (err) { setIsTaskdots(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  useEffect(() => {
    fetchUsersTasks();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    if (selectedProject.length === 0 && selectedSubProject.length === 0 && selectedModule.length === 0 && selectedSubModule.length === 0 && selectedMainpage.length === 0 && selectedSubpage.length === 0 && selectedSubSubpage.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please choose Any one filter"}</p>
        </>
      );
      handleClickOpenerr();
      setfilteralert(!filteralert);
    } else {
      // setIsLoader(false);
      FilterSubmit();
    }
  };
  const [userTasksFilter, setUserTasksFilter] = useState([]);
  const [userTasksDevFilter, setUserTasksDevFilter] = useState([]);
  const [userTasksTestFilter, setUserTasksTestFilter] = useState([]);
  const [filterchange, setfilterchange] = useState(false);
  const [filterclear, setfilterclear] = useState(false);
  const [filteralert, setfilteralert] = useState(false);

  //get all role list details
  const FilterSubmit = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.TASKBOARDVIEW_LIST_FILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        project: selectedProject.map((item) => item.value),
        subproject: selectedSubProject.map((item) => item.value),
        module: selectedModule.map((item) => item.value),
        submodule: selectedSubModule.map((item) => item.value),
        mainpage: selectedMainpage.map((item) => item.value),
        subpage: selectedSubpage.map((item) => item.value),
        subsubpage: selectedSubSubpage.map((item) => item.value),
        user: isUserRoleAccess.companyname,
        access: isUserRoleAccess.role,
        accessdrop: String(Accessdrop),
        // pagetype:pagetypename
      });
      // setfilteralert(!filteralert);
      setfilterclear("");
      setfilterchange(!filterchange);

      if (!isUserRoleAccess.role.includes("Manager") || (isUserRoleAccess.role.includes("Manager") && Accessdrop == "Teammember")) {
        setUserTasks(res?.data?.taskUI);
        setUserTasksDev(res?.data?.taskDev);
        setUserTasksTest(res?.data?.taskTest);
      } else if (isUserRoleAccess.role.includes("Manager") && Accessdrop == "all") {
        setUserTasksFilter(res?.data?.taskUI);
        setUserTasksDevFilter(res?.data?.taskDev);
        setUserTasksTestFilter(res?.data?.taskTest);
      }
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const handleClear = async (e) => {
    e.preventDefault();
    setSelectedProject([]);
    setSelectedSubProject([]);
    setSelectedModule([]);
    setSelectedSubModule([]);
    setSelectedMainpage([]);
    setSelectedSubpage([]);
    setSelectedSubSubpage([]);
    setfilterclear("clear");
    await fetchUsersTasks();
  };

  //fetching Project for Dropdowns
  const fetchProjectDropdowns = async () => {
    setPageName(!pageName);
    try {
      let res_project = await axios.get(SERVICE.PROJECTLIMIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setProject(
        res_project?.data?.projects?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        }))
      );
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //fetching Project for Dropdowns
  const fetchSubProjectDropdowns = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.SUBPROJECTLIMIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSubProject(
        res?.data?.subprojects?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        }))
      );
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //fetching Module Dropdowns
  const fetchModuleDropdowns = async () => {
    setPageName(!pageName);
    try {
      let dropModule = await axios.get(SERVICE.MODULELIMIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setModule(
        dropModule?.data?.modules?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        }))
      );
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //fetching Module Dropdowns
  const fetchsubModuleDropdowns = async () => {
    setPageName(!pageName);
    try {
      let dropModule = await axios.get(SERVICE.SUBMODULELIMIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSubModule(
        dropModule?.data?.submodules?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        }))
      );
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //fetching Main Page Dropdowns
  const fetchPagetypeMainDropdowns = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.PAGETYPE_MAIN_MULTI, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

        project: selectedProject.map((item) => item.value),
        subproject: selectedSubProject.map((item) => item.value),
        module: selectedModule.map((item) => item.value),
        submodule: e.map((item) => item.value),
      });

      let uniquearray = Array.from(new Set(res?.data?.pagetypemain?.map((com) => com.mainpage))).map((name) => ({
        label: name,
        value: name,
      }));

      setMainpageTypeDropdown(uniquearray);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //fetching sub Page Dropdowns
  const fetchPagetypeSubPageDropdowns = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.PAGETYPE_SUBPAGE_DROP_MULTI, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        project: selectedProject.map((item) => item.value),
        subproject: selectedSubProject.map((item) => item.value),
        module: selectedModule.map((item) => item.value),
        submodule: selectedSubModule.map((item) => item.value),
        mainpage: e.map((item) => item.value),
      });

      let uniquearray = Array.from(new Set(res?.data?.pagetypesub?.map((com) => com.subpage))).map((name) => ({
        label: name,
        value: name,
      }));
      setSubpageTypeDropdown(uniquearray);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //fetching sub Page Dropdowns
  const fetchPagetypeSubSubPageDropdowns = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.PAGETYPE_SUB_SUBPAGE_DROP_MULTI, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        project: selectedProject.map((item) => item.value),
        subproject: selectedSubProject.map((item) => item.value),
        module: selectedModule.map((item) => item.value),
        submodule: selectedSubModule.map((item) => item.value),
        mainpage: selectedMainpage.map((item) => item.value),
        subpage: e.map((item) => item.value),
      });
      let uniquearray = Array.from(new Set(res?.data?.pagetypesub?.map((com) => com.name))).map((name) => ({
        label: name,
        value: name,
      }));
      setsubSubpageTypeDropdown(uniquearray);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //project handlechange
  const handleChangeproject = (options) => {
    setSelectedProject(options);
  };

  const customValueRendererproject = (valueCate, _categories) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select project";
  };
  //subproject handlechange
  const handleChangesubproject = (options) => {
    setSelectedSubProject(options);
  };

  const customValueRenderersubproject = (valueCate, _categories) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Subproject";
  };
  // modulechandlechange
  const handleChangemodule = (options) => {
    setSelectedModule(options);
  };

  const customValueRenderermodule = (valueCate, _categories) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Module";
  };

  // submodulechandlechange
  const handleChangesubmodule = (options) => {
    setSelectedSubModule(options);
    fetchPagetypeMainDropdowns(options);
  };

  const customValueRenderersubmodule = (valueCate, _categories) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select SubModule";
  };

  // mainpage chandlechange
  const handleChangemainpage = (options) => {
    setSelectedMainpage(options);
    fetchPagetypeSubPageDropdowns(options);
  };

  const customValueRenderermainpage = (valueCate, _categories) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Mainpage";
  };
  // subpagechandlechange
  const handleChangesubpage = (options) => {
    setSelectedSubpage(options);
    fetchPagetypeSubSubPageDropdowns(options);
  };

  const customValueRenderersubpage = (valueCate, _categories) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Subpage";
  };
  // subSUBpagechandlechange
  const handleChangesubsubpage = (options) => {
    setSelectedSubSubpage(options);
  };

  const customValueRenderersubsubpage = (valueCate, _categories) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Subpage";
  };

  useEffect(() => {
    fetchProjectDropdowns();
  }, []);

  useEffect(() => {
    fetchSubProjectDropdowns();
  }, [selectedProject]);

  useEffect(() => {
    fetchModuleDropdowns();
  }, [selectedProject, selectedSubProject]);

  useEffect(() => {
    fetchsubModuleDropdowns();
  }, [selectedProject, selectedSubProject, selectedModule]);

  useEffect(() => {
    setAccesDrop(isUserRoleAccess.role.includes("Manager") ? "all" : "Teammember");
  }, []);

  return (
    <>
      {isUserRoleAccess.role.includes("Manager") && Accessdrop === "all" ? (
        <>
          <Box sx={userStyle.dialogbox}>
            <Grid container>
              <Grid item md={9} sm={6} xs={12}>
                {/* <Typography variant="h5">Task Board Admin</Typography> */}
                <PageHeading
                  title="Task Board Admin"
                  modulename="Projects"
                  submodulename="Tasks"
                  mainpagename="Task Board"
                  subpagename=""
                  subsubpagename=""
                />
              </Grid>
              <Grid item md={3} sm={6} xs={12}>
                <Grid container spacing={2}>
                  <Grid item md={3} sm={4} xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box >
                      <Typography sx={{ fontSize: '16px', color: 'black', fontWeight: 500 }}>Access</Typography>
                    </Box>
                  </Grid>
                  <Grid item md={9} sm={8} xs={12}>
                    <FormControl size="small" fullWidth>
                      <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={Accessdrop}
                        onChange={(e) => {
                          setAccesDrop(e.target.value);
                          handleClear(e);
                        }}
                      >
                        <MenuItem value={"all"}>Manager</MenuItem>
                        <MenuItem value={"Teammember"}>Employee</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </>
      ) : isUserRoleAccess.role.includes("Manager") && Accessdrop === "Teammember" ? (
        <>
          <Box sx={userStyle.dialogbox}>
            <Grid container>
              <Grid item md={9} sm={6} xs={12}>
                <Typography variant="h5">Task Board</Typography>
              </Grid>
              <Grid item md={3} sm={6} xs={12}>
                <Grid container spacing={2}>
                  <Grid item md={3} sm={4} xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ fontSize: '16px', color: 'black', fontWeight: 500 }}>Access</Typography>
                    </Box>
                  </Grid>
                  <Grid item md={9} sm={8} xs={12}>
                    <FormControl size="small" fullWidth>
                      <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={Accessdrop}
                        onChange={(e) => {
                          setAccesDrop(e.target.value);
                          handleClear(e);
                        }}
                      >
                        <MenuItem value={"all"}>Manager</MenuItem>
                        <MenuItem value={"Teammember"}>Employee</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </>
      ) : (
        <>
          <Box sx={userStyle.dialogbox}>
            <Grid container>
              <Grid item md={9} sm={6} xs={12}>
                <Typography variant="h5">Task Board</Typography>
              </Grid>
              <Grid item md={3} sm={6} xs={12}></Grid>
            </Grid>
          </Box>
        </>
      )}

      <br />
      <Box sx={userStyle.dialogbox}>
        <Grid container spacing={2}>
          <Grid item md={4} xs={12} sm={6}>
            <Typography sx={{ fontSize: '16px', color: 'black', fontWeight: 500 }}>Project</Typography>
            <FormControl size="small" fullWidth>
              <FormControl size="small" fullWidth>
                <MultiSelect options={project} value={selectedProject} onChange={handleChangeproject} valueRenderer={customValueRendererproject} labelledBy="Please Select Project" />
              </FormControl>
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12} sm={6}>
            <Typography sx={{ fontSize: '16px', color: 'black', fontWeight: 500 }}>Sub Project</Typography>
            <FormControl size="small" fullWidth>
              <MultiSelect
                options={subProject
                  ?.filter((subpro) => selectedProject.map((item) => item.value).includes(subpro.project))
                  ?.map((subpro) => ({
                    ...subpro,
                    label: subpro.name,
                    value: subpro.name,
                  }))}
                value={selectedSubProject}
                onChange={handleChangesubproject}
                valueRenderer={customValueRenderersubproject}
                labelledBy="Please Select SubProject"
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12} sm={6}>
            <Typography sx={{ fontSize: '16px', color: 'black', fontWeight: 500 }}>Module</Typography>
            <FormControl size="small" fullWidth>
              <MultiSelect
                options={module
                  ?.filter((subpro) => selectedProject.map((item) => item.value).includes(subpro.project) && selectedSubProject.map((item) => item.value).includes(subpro.subproject))
                  ?.map((subpro) => ({
                    ...subpro,
                    label: subpro.name,
                    value: subpro.name,
                  }))}
                value={selectedModule}
                onChange={handleChangemodule}
                valueRenderer={customValueRenderermodule}
                labelledBy="Please Select Module"
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <Typography sx={{ fontSize: '16px', color: 'black', fontWeight: 500 }}>SubModule Name </Typography>

              <MultiSelect
                options={subModule
                  ?.filter((subpro) => selectedProject.map((item) => item.value).includes(subpro.project) && selectedSubProject.map((item) => item.value).includes(subpro.subproject) && selectedModule.map((item) => item.value).includes(subpro.module))
                  ?.map((subpro) => ({
                    ...subpro,
                    label: subpro.name,
                    value: subpro.name,
                  }))}
                value={selectedSubModule}
                onChange={handleChangesubmodule}
                valueRenderer={customValueRenderersubmodule}
                labelledBy="Please Select SubModule"
              />
            </FormControl>
          </Grid>
          {mainpageTypeDropdown.length > 0 && (
            <Grid item md={4} xs={12} sm={6}>
              <Typography sx={{ fontSize: '16px', color: 'black', fontWeight: 500 }}>Main Page</Typography>

              <MultiSelect options={mainpageTypeDropdown} value={selectedMainpage} onChange={handleChangemainpage} valueRenderer={customValueRenderermainpage} labelledBy="Please Select Mainpage" />
            </Grid>
          )}
          {subpageTypeDropdown.length > 0 && (
            <Grid item md={4} xs={12} sm={6}>
              <Typography sx={{ fontSize: '16px', color: 'black', fontWeight: 500 }}>Sub page</Typography>
              <MultiSelect options={subpageTypeDropdown} value={selectedSubpage} onChange={handleChangesubpage} valueRenderer={customValueRenderersubpage} labelledBy="Please Select Subpage" />
            </Grid>
          )}
          {subsubpageTypeDropdown.length > 0 && (
            <Grid item md={4} xs={12} sm={6}>
              <Typography sx={{ fontSize: '16px', color: 'black', fontWeight: 500 }}>Sub Sub page</Typography>
              <MultiSelect options={subsubpageTypeDropdown} value={selectedSubSubpage} onChange={handleChangesubsubpage} valueRenderer={customValueRenderersubsubpage} labelledBy="Please Select SubSubpage" />
            </Grid>
          )}
        </Grid>
        <br />
        <Box sx={{ display: "flex", justifyContent: "center", gap: "25px" }}>
          <Button variant="contained" onClick={(e) => handleFilter(e)}>
            Filter
          </Button>
          <Button sx={userStyle.btncancel} onClick={(e) => handleClear(e)}>
            Clear
          </Button>
        </Box>
      </Box>
      <br />
      {Accessdrop == "all" ? (
        <>
          <TaskallAdmin filterchange={filterchange} filterclear={filterclear} filteralert={filteralert} userTasksFilter={userTasksFilter} userTasksDevFilter={userTasksDevFilter} userTasksTestFilter={userTasksTestFilter} selectedProject={selectedProject} selectedSubProject={selectedSubProject} selectedModule={selectedModule} selectedSubModule={selectedSubModule} selectedMainpage={selectedMainpage} selectedSubpage={selectedSubpage} selectedSubSubpage={selectedSubSubpage} />
        </>
      ) : (
        <>
          {/* <Grid container spacing={2}>
            <Grid item md={12} sm={6} xs={12}>
              <Typography variant="h5">Task Board</Typography>
            </Grid>
          </Grid> */}
          <br />
          {/* <Box sx={userStyle.dialogbox}>
            <Grid container spacing={2}>
              <Grid item md={4} xs={12} sm={12}>
                <Typography>
                  Project 
                </Typography>
                <FormControl size="small" fullWidth>
                  <FormControl size="small" fullWidth>
                    <MultiSelect options={project} value={selectedProject} onChange={handleChangeproject} valueRenderer={customValueRendererproject} labelledBy="Please Select Project" />
                  </FormControl>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <Typography>
                  Sub Project 
                </Typography>
                <FormControl size="small" fullWidth>
                  <MultiSelect
                    options={subProject
                      ?.filter((subpro) => selectedProject.map((item) => item.value).includes(subpro.project))
                      ?.map((subpro) => ({
                        ...subpro,
                        label: subpro.name,
                        value: subpro.name,
                      }))}
                    value={selectedSubProject}
                    onChange={handleChangesubproject}
                    valueRenderer={customValueRenderersubproject}
                    labelledBy="Please Select SubProject"
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <Typography>
                  Module 
                </Typography>
                <FormControl size="small" fullWidth>
                  <MultiSelect
                    options={module
                      ?.filter((subpro) => selectedProject.map((item) => item.value).includes(subpro.project) && selectedSubProject.map((item) => item.value).includes(subpro.subproject))
                      ?.map((subpro) => ({
                        ...subpro,
                        label: subpro.name,
                        value: subpro.name,
                      }))}
                    value={selectedModule}
                    onChange={handleChangemodule}
                    valueRenderer={customValueRenderermodule}
                    labelledBy="Please Select Module"
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    SubModule Name {" "}
                  </Typography>

                  <MultiSelect
                    options={subModule
                      ?.filter((subpro) => selectedProject.map((item) => item.value).includes(subpro.project) && selectedSubProject.map((item) => item.value).includes(subpro.subproject) && selectedModule.map((item) => item.value).includes(subpro.module))
                      ?.map((subpro) => ({
                        ...subpro,
                        label: subpro.name,
                        value: subpro.name,
                      }))}
                    value={selectedSubModule}
                    onChange={handleChangesubmodule}
                    valueRenderer={customValueRenderersubmodule}
                    labelledBy="Please Select SubModule"
                  />
                </FormControl>
              </Grid>
              {mainpageTypeDropdown.length > 0 && (
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>
                    Main Page
                  </Typography>

                  <MultiSelect options={mainpageTypeDropdown} value={selectedMainpage} onChange={handleChangemainpage} valueRenderer={customValueRenderermainpage} labelledBy="Please Select Mainpage" />
                </Grid>
              )}
              {subpageTypeDropdown.length > 0 && (
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>
                    Sub page
                  </Typography>
                  <MultiSelect options={subpageTypeDropdown} value={selectedSubpage} onChange={handleChangesubpage} valueRenderer={customValueRenderersubpage} labelledBy="Please Select Subpage" />
                </Grid>
              )}
              {subsubpageTypeDropdown.length > 0 && (
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>
                    Sub Sub page
                  </Typography>
                  <MultiSelect options={subsubpageTypeDropdown} value={selectedSubSubpage} onChange={handleChangesubsubpage} valueRenderer={customValueRenderersubsubpage} labelledBy="Please Select SubSubpage" />
                </Grid>
              )}
            </Grid>
            <br />
            <Box sx={{ display: "flex", justifyContent: "center", gap: "25px" }}>
              <Button variant="contained" onClick={(e) => handleFilter(e)}>
                Filter
              </Button>
              <Button sx={userStyle.btncancel} onClick={(e) => handleClear(e)}>
                Cancel
              </Button>
            </Box>
          </Box>
          <br /> */}
          <Box>
            <Headtitle title={"TASKBOARD"} />
            {isTaskdots ? (
              <>
                <Grid container spacing={1}>
                  <Grid item md={2} sm={6} xs={12}>
                    <Typography variant="h6">UI Design</Typography>

                    <Box sx={userStyle.taskboardcontainer}>
                      <br />
                      {userTasks?.length > 0 &&
                        userTasks.map((row) => {
                          if (row.phase === "UI") {
                            return (
                              <>
                                <Box sx={userStyle.taskboardbox_ui} key={row._id}>
                                  <Typography
                                    sx={{
                                      fontSize: row.taskname?.length > 25 ? "11px" : "small",
                                      fontWeight: "bold",
                                      fontFamily: "auto",
                                      wordWrap: "break-word",
                                    }}
                                  >
                                    {row.taskname}
                                  </Typography>
                                  <Box sx={{ display: "flex", justifyContent: "end", alignItems: "end" }}>
                                    <Link target="_blank" rel="noopener noreferrer" to={`/project/taskuipage/${row._id}`} style={{ background: "#b76eb7", padding: "3px", borderRadius: "5px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                      <OpenInNewIcon sx={{ color: "white", fontSize: "15px" }} />
                                    </Link>
                                  </Box>
                                </Box>
                                <br />
                              </>
                            );
                          }
                        })}
                    </Box>
                  </Grid>
                  <Grid item md={2} sm={6} xs={12}>
                    <Typography variant="h6">Development</Typography>

                    <Box sx={userStyle.taskboardcontainer}>
                      <br />
                      {/* <Box sx={userStyle.taskboardbox_dev}>HI</Box> */}
                      {userTasksDev?.length > 0 &&
                        userTasksDev.map((row) => {
                          if (row.phase === "Development") {
                            return (
                              <>
                                <Box sx={userStyle.taskboardbox_dev} key={row._id}>
                                  <Typography
                                    sx={{
                                      fontSize: row.taskname?.length > 25 ? "11px" : "small",
                                      fontWeight: "bold",
                                      fontFamily: "auto",
                                      wordWrap: "break-word",
                                    }}
                                  >
                                    {row.taskname}
                                  </Typography>
                                  <Box sx={{ display: "flex", justifyContent: "end", alignItems: "end" }}>
                                    <Link target="_blank" rel="noopener noreferrer" to={`/project/taskdevpage/${row._id}`} style={{ background: "#1976d291", padding: "3px", borderRadius: "5px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                      <OpenInNewIcon sx={{ color: "white", fontSize: "15px" }} />
                                    </Link>
                                  </Box>
                                </Box>
                                <br />
                              </>
                            );
                          }
                        })}
                    </Box>
                  </Grid>
                  <Grid item md={2} sm={6} xs={12}>
                    <Typography variant="h6">Testing</Typography>

                    <Box sx={userStyle.taskboardcontainer}>
                      {/* <Box sx={userStyle.taskboardbox_test}>HI</Box> */}
                      {userTasksTest?.length > 0 &&
                        userTasksTest.map((row) => {
                          if (row.phase === "Testing") {
                            return (
                              <>
                                <Box sx={userStyle.taskboardbox_test} key={row._id}>
                                  <Typography
                                    sx={{
                                      fontSize: row.taskname?.length > 25 ? "11px" : "small",
                                      fontWeight: "bold",
                                      fontFamily: "auto",
                                      wordWrap: "break-word",
                                    }}
                                  >
                                    {row.taskname}
                                  </Typography>
                                  <Box sx={{ display: "flex", justifyContent: "end", alignItems: "end" }}>
                                    <Link target="_blank" rel="noopener noreferrer" to={`/project/tasktesterpage/${row._id}`} style={{ background: "#e3b052", padding: "3px", borderRadius: "5px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                      <OpenInNewIcon sx={{ color: "white", fontSize: "15px" }} />
                                    </Link>
                                  </Box>
                                </Box>
                                <br />
                              </>
                            );
                          }
                        })}
                    </Box>
                  </Grid>
                  <Grid item md={2} sm={6} xs={12}>
                    <Typography variant="h6">Source Integration</Typography>

                    <Box sx={userStyle.taskboardcontainer}></Box>
                  </Grid>
                  <Grid item md={2} sm={6} xs={12}>
                    <Typography variant="h6">Deployment</Typography>

                    <Box sx={userStyle.taskboardcontainer}></Box>
                  </Grid>
                  <Grid item md={2} sm={6} xs={12}>
                    <Typography variant="h6">Completed Tasks</Typography>

                    <Box sx={userStyle.taskboardcontainer}></Box>
                  </Grid>
                </Grid>
              </>
            ) : (
              <>
                <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
                  <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                </Box>
              </>
            )}
            {/* ALERT DIALOG */}
            <Box>
              <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent style={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                  <Typography variant="h6">{showAlert}</Typography>
                </DialogContent>
                <DialogActions>
                  <Button variant="contained" color="error" onClick={handleCloseerr}>
                    ok
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
            {/* <SwipeableDrawerComponent isOpen={openDrawer} selectedRowId={selectedRowId} onClose={handleCloseDrawer} time={timedata} /> */}
          </Box>
        </>
      )}
    </>
  );
}

export default Tasklist;