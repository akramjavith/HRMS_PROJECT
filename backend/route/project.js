const express = require("express");
const ProjectsRoute = express.Router();

// connect Project controller..
const { getAllProject, addProject, updateProject, getAllAddProjectLimit, getSingleProject, deleteProject, overallProject, getCheckUserToProject } = require("../controller/modules/project/project");
ProjectsRoute.route("/projects").get(getAllProject);
ProjectsRoute.route("/projectslimit").get(getAllAddProjectLimit);
ProjectsRoute.route("/project/new").post(addProject);
ProjectsRoute.route("/project/:id").get(getSingleProject).put(updateProject).delete(deleteProject);
ProjectsRoute.route("/overallproj").post(overallProject);
ProjectsRoute.route("/project/checkuser").post(getCheckUserToProject);

// connect Sub project controller..
const { getAllSubproject, addSubproject, updateSubproject, getAllSubprojectLimit, getRelatedTaskSub, getRelatedTaskSubEdit, getSingleSubproject, deleteSubproject, overallSubProject, getProjectToSubproject } = require("../controller/modules/project/subproject");
ProjectsRoute.route("/subprojects").get(getAllSubproject);
ProjectsRoute.route("/subprojectslimit").get(getAllSubprojectLimit);
ProjectsRoute.route("/subproject/new").post(addSubproject);
ProjectsRoute.route("/subproject/:id").get(getSingleSubproject).put(updateSubproject).delete(deleteSubproject);
ProjectsRoute.route("/overallsubproj").post(overallSubProject);
ProjectsRoute.route("/subproject/checkproject").post(getProjectToSubproject);
ProjectsRoute.route("/subprojecttaskcheck").post(getRelatedTaskSub);
ProjectsRoute.route("/subprojecttaskcheckedit").post(getRelatedTaskSubEdit);
// ProjectsRoute.route('/task/checksubprojectintask').post(checksubProjintask);

// connect Module controller..
const { getAllModule, addModule, updateModule, getAllModuleLimit, getSingleModule, getModuleTaskCheck, getModuleTaskCheckEdit, deleteModule, getoverallmodule, getProjectToModule, getSubProjectToModule } = require("../controller/modules/project/module");
ProjectsRoute.route("/modules").get(getAllModule);
ProjectsRoute.route("/moduleslimit").get(getAllModuleLimit);
ProjectsRoute.route("/module/new").post(addModule);
ProjectsRoute.route("/moduletaskcheck").post(getModuleTaskCheck);
ProjectsRoute.route("/moduletaskcheckedit").post(getModuleTaskCheckEdit);
ProjectsRoute.route("/module/:id").get(getSingleModule).put(updateModule).delete(deleteModule);
ProjectsRoute.route("/overallmodule").post(getoverallmodule);
ProjectsRoute.route("/module/checkproject").post(getProjectToModule);
ProjectsRoute.route("/module/checksubproject").post(getSubProjectToModule);

// connect subModule controller
const { getAllSubModule, addSubModule, updateSubModule, getSingleSubModule, getSubModuleTaskCheck, getSubModuleTaskCheckEdit, getAllSubmoduleLimit, deleteSubModule, getoverallsubmodule, getProjectToSubModule, getSubProjectToSubModule, getModuleToSubModule } = require("../controller/modules/project/submodule");
ProjectsRoute.route("/submodules").get(getAllSubModule);
ProjectsRoute.route("/submoduleslimit").get(getAllSubmoduleLimit);
ProjectsRoute.route("/submodule/new").post(addSubModule);
ProjectsRoute.route("/submoduletaskcheck").post(getSubModuleTaskCheck);
ProjectsRoute.route("/submoduletaskcheckedit").post(getSubModuleTaskCheckEdit);
ProjectsRoute.route("/submodule/:id").get(getSingleSubModule).put(updateSubModule).delete(deleteSubModule);
ProjectsRoute.route("/overallsubmodule").post(getoverallsubmodule);
ProjectsRoute.route("/submodule/checkproject").post(getProjectToSubModule);
ProjectsRoute.route("/submodule/checksubproject").post(getSubProjectToSubModule);
ProjectsRoute.route("/submodule/checkmodule").post(getModuleToSubModule);

const { getAllMain, addMain, updateMain, getSingleMainpage, getAllMainpagesLimit, deleteMain } = require("../controller/modules/project/mainpage");
ProjectsRoute.route("/mainpages").get(getAllMain);
// ProjectsRoute.route('/mainpageslimit').get(getAllMainpagesLimit);
ProjectsRoute.route("/mainpage/new").post(addMain);
ProjectsRoute.route("/mainpage/:id").get(getSingleMainpage).put(updateMain).delete(deleteMain);

// connect Projectsubpagesone controller
const { getAllSubpageone, addSubpageone, updateSubpageone, getsubpageoneLimit, getSingleSubpageone, deleteSubpageone } = require("../controller/modules/project/subpageone");
ProjectsRoute.route("/subpagesone").get(getAllSubpageone);
// ProjectsRoute.route('/subpagesonelimit').get(getsubpageoneLimit);
ProjectsRoute.route("/subpageone/new").post(addSubpageone);
ProjectsRoute.route("/subpageone/:id").get(getSingleSubpageone).put(updateSubpageone).delete(deleteSubpageone);

// connect Projectsubpagestwo controller
const { getAllSubpagetwo, addSubpagetwo, updateSubpagetwo, getsubpagetwoLimit, getSingleSubpagetwo, deleteSubpagetwo } = require("../controller/modules/project/subpagetwo");
ProjectsRoute.route("/subpagestwo").get(getAllSubpagetwo);
// ProjectsRoute.route('/subpagestwolimit').get(getsubpagetwoLimit);
ProjectsRoute.route("/subpagetwo/new").post(addSubpagetwo);
ProjectsRoute.route("/subpagetwo/:id").get(getSingleSubpagetwo).put(updateSubpagetwo).delete(deleteSubpagetwo);

// connect Projectsubpagesthree controller
const { getAllSubpagethree, addSubpagethree, updateSubpagethree, getsubpagethreeLimit, getSingleSubpagethree, deleteSubpagethree } = require("../controller/modules/project/subpagethree");
ProjectsRoute.route("/subpagesthree").get(getAllSubpagethree);
// ProjectsRoute.route('/subpagesthreelimit').get(getsubpagethreeLimit);
ProjectsRoute.route("/subpagethree/new").post(addSubpagethree);
ProjectsRoute.route("/subpagethree/:id").get(getSingleSubpagethree).put(updateSubpagethree).delete(deleteSubpagethree);

// connect Projectsubpagesfour controller
const { getAllSubpagefour, addSubpagefour, updateSubpagefour, getsubpagefourLimit, getSingleSubpagefour, deleteSubpagefour } = require("../controller/modules/project/subpagefour");
ProjectsRoute.route("/subpagesfour").get(getAllSubpagefour);
// ProjectsRoute.route('/subpagesfourlimit').get(getsubpagefourLimit);
ProjectsRoute.route("/subpagefour/new").post(addSubpagefour);
ProjectsRoute.route("/subpagefour/:id").get(getSingleSubpagefour).put(updateSubpagefour).delete(deleteSubpagefour);

// connect Projectsubpagesfive controller
const { getAllSubpagefive, addSubpagefive, updateSubpagefive, getsubpagefiveLimit, getSingleSubpagefive, deleteSubpagefive } = require("../controller/modules/project/subpagefive");
ProjectsRoute.route("/subpagesfive").get(getAllSubpagefive);
// ProjectsRoute.route('/subpagesfivelimit').get(getsubpagefiveLimit);
ProjectsRoute.route("/subpagefive/new").post(addSubpagefive);
ProjectsRoute.route("/subpagefive/:id").get(getSingleSubpagefive).put(updateSubpagefive).delete(deleteSubpagefive);

// connect Priority controller
const { getAllPriority, addpriority, updatePriority, getSinglePriority, getPriorityLimit, deletePriority, getOverAllPriority } = require("../controller/modules/project/priority");
ProjectsRoute.route("/priorities").get(getAllPriority);
// ProjectsRoute.route('/proritieslimit').get(getPriorityLimit);
ProjectsRoute.route("/priority/new").post(addpriority);
ProjectsRoute.route("/priority/:id").get(getSinglePriority).put(updatePriority).delete(deletePriority);
ProjectsRoute.route("/overallpriority").post(getOverAllPriority);

// connect projectEstimation controller
const { getAllProjectEstimation, addProjectEstimation, updateProjectEstimation, getProjectEstimationLimit, getSingleProjectEstimation, deleteProjectEstimation } = require("../controller/modules/project/projectestimation");

ProjectsRoute.route("/projectestimations").get(getAllProjectEstimation);
// ProjectsRoute.route('/projectestimationslimit').get(getProjectEstimationLimit);
ProjectsRoute.route("/projectestimation/new").post(addProjectEstimation);
ProjectsRoute.route("/projectestimation/:id").get(getSingleProjectEstimation).put(updateProjectEstimation).delete(deleteProjectEstimation);

// connect projectEstimation controller
const { getAllProjectAllocation, addProjectAllocation, updateProjectAllocation, getProjectAllocationLimit, getSingleProjectAllocation, deleteProjectAllocation } = require("../controller/modules/project/projectallocation");

ProjectsRoute.route("/projectallocations").get(getAllProjectAllocation);
// ProjectsRoute.route('/projectallocationslimit').get(getProjectAllocationLimit);
ProjectsRoute.route("/projectallocation/new").post(addProjectAllocation);
ProjectsRoute.route("/projectallocation/:id").get(getSingleProjectAllocation).put(updateProjectAllocation).delete(deleteProjectAllocation);

// connect ProjectDetails controller
const { getAllProjectDetails, addProjectDetails, updateProjectDetails, getSingleProjectDetails, getProjectDetailsLimit, deleteProjectDetails } = require("../controller/modules/project/projectdetails");

ProjectsRoute.route("/projectdetails").get(getAllProjectDetails);
// ProjectsRoute.route('/projectdetailslimit').get(getProjectDetailsLimit);
ProjectsRoute.route("/projectdetail/new").post(addProjectDetails);
ProjectsRoute.route("/projectdetail/:id").get(getSingleProjectDetails).put(updateProjectDetails).delete(deleteProjectDetails);

// connect Task controller..

const {
  taskHomepagedevincompletechecktimer,
  getTaskBoardcompleteallmanageraccess,
  taskHomepagetesterincompleteaccess,
  taskHomepagedevincompleteaccess,
  getTaskBoarddevincompletemanageraccess,
  getTaskBoarddevcompletemanageraccess,
  getTaskBoardtesterincompletemanageraccess,
  getTaskBoardtestercompletemanageraccess,
  getincompletetaskcurrentmonth,
  taskHomepageTodaydevincomplete,
  getincompletetestertaskcurrentmonth,
  getcompletetestertaskcurrentmonth,
  getAllFilterTaskcreatepage,
  taskHomepageTodaytesterincomplete,
  taskHomepagedevincomplete,
  taskHomepagetesterincomplete,
  taskReportstyle,
  taskReportstyle1,
  taskReportstyleincomplete,
  taskReportstylecomplete,
  getTaskBoarddevincomplete,
  getTaskBoarddevcomplete,
  getTaskBoardtesterincomplete,
  getTaskBoardtestercomplete,
  getDevtaskcheckpoints,
  getallTasktime,
  getAllFilterTask,
  getcompletetaskcurrentmonth,
  getfivemonthincomplete,
  getfivemonthcomplete,
  getBoardtask,
  getTaskBoard,
  getAllTask,
  addTask,
  updateTask,
  getSingleTask,
  deleteTask,
  getTaskLimit,
  getTaskList,
  getProjectToTask,
  getSubProjectToTask,
  getModuleToTask,
  getSubModuleToTask,
  getPriorityToTask,
  getAllUserToTask,
} = require("../controller/modules/project/task");
ProjectsRoute.route("/tasks").get(getAllTask);
ProjectsRoute.route("/taskslimit").get(getTaskLimit);
ProjectsRoute.route("/tasksboard").get(getTaskBoard);
ProjectsRoute.route("/taskslist").get(getTaskList);
ProjectsRoute.route("/taskboardlist").get(getBoardtask);
ProjectsRoute.route("/task/checkproject").post(getProjectToTask);
ProjectsRoute.route("/task/checksubproject").post(getSubProjectToTask);
ProjectsRoute.route("/task/checkmodule").post(getModuleToTask);
ProjectsRoute.route("/task/checksubmodule").post(getSubModuleToTask);
ProjectsRoute.route("/task/checkpriority").post(getPriorityToTask);
ProjectsRoute.route("/user/task").post(getAllUserToTask);

// connect Task assign board list controller
const { getAllTaskAssignBoardList, getTaskboardviewlistFilter,getTaskidstoUpdateRequirements, getAllcompletedtask, getAllTaskAssignBoardListFilter, getAlltasksadminview, taskassignchecktimer, getParticularUsersTask, getSingleTaskAssignBoardListNew, getAllNotTaskAssignBoardListtabledata, getAllTaskAssignBoardListlimited, getAllTaskAssignBoardListtabledata, addTaskAssignBoardList, getSingleTaskAssignBoardList, updateTaskAssignBoardList, deleteTaskAssignBoardList, deleteWorkOrders } = require("../controller/modules/project/taskassignboardlist");
ProjectsRoute.route("/taskassignboardlists").get(getAllTaskAssignBoardList);
ProjectsRoute.route("/taskassignboardlist/new").post(addTaskAssignBoardList);
ProjectsRoute.route("/taskassignboardlist/:id").get(getSingleTaskAssignBoardList).put(updateTaskAssignBoardList).delete(deleteTaskAssignBoardList);
ProjectsRoute.route("/taskassignboardlistworkorders/:id").put(deleteWorkOrders);
ProjectsRoute.route("/taskassignboardlistsfilter").post(getAllTaskAssignBoardListFilter);
ProjectsRoute.route("/taskassignboardlistslimited").get(getAllTaskAssignBoardListlimited);
ProjectsRoute.route("/taskassignboardliststabledata").get(getAllTaskAssignBoardListtabledata);
ProjectsRoute.route("/nottaskassignboardliststabledata").get(getAllNotTaskAssignBoardListtabledata);
ProjectsRoute.route("/getsingleusertasks").post(getParticularUsersTask);
ProjectsRoute.route("/taskassignboardlistnew/:id").post(getSingleTaskAssignBoardListNew);
ProjectsRoute.route("/taskassignchecktimerstatus").post(taskassignchecktimer);
ProjectsRoute.route("/getalltasksadminview").get(getAlltasksadminview);
ProjectsRoute.route("/getallcompletedtask").get(getAllcompletedtask);
ProjectsRoute.route("/gettaskidstoupdaterequirements").post(getTaskidstoUpdateRequirements);
ProjectsRoute.route("/taskboardviewlistsfilter").post(getTaskboardviewlistFilter);

//TASK REPORT PAGE
ProjectsRoute.route("/taskscurrentincomplete").post(getincompletetaskcurrentmonth);
ProjectsRoute.route("/taskscurrentcomplete").post(getcompletetaskcurrentmonth);
ProjectsRoute.route("/taskstestercurrentincomplete").post(getincompletetestertaskcurrentmonth);
ProjectsRoute.route("/taskstestercurrentcomplete").post(getcompletetestertaskcurrentmonth);

ProjectsRoute.route("/tasksfiveincomplete").get(getfivemonthincomplete);
ProjectsRoute.route("/tasksfivecomplete").get(getfivemonthcomplete);
ProjectsRoute.route("/allfiltertask").post(getAllFilterTask);
ProjectsRoute.route("/allfiltertaskcreatepage").post(getAllFilterTaskcreatepage);
ProjectsRoute.route("/alltasktime").get(getallTasktime);
ProjectsRoute.route("/usersdevcheckpoints").get(getDevtaskcheckpoints);
ProjectsRoute.route("/task/new").post(addTask);
ProjectsRoute.route("/task/:id").get(getSingleTask).put(updateTask).delete(deleteTask);
// TASKBOARDPAGE USER ACCESS
ProjectsRoute.route("/taskboardincompleteusers").post(getTaskBoarddevincomplete);
ProjectsRoute.route("/taskboardcompleteusers").post(getTaskBoarddevcomplete);
ProjectsRoute.route("/taskboardincompletetester").post(getTaskBoardtesterincomplete);
ProjectsRoute.route("/taskboardcompletetester").post(getTaskBoardtestercomplete);
// TASKBOARDMANAGERACCES
ProjectsRoute.route("/taskboardincompleteusersallaccess").post(getTaskBoarddevincompletemanageraccess);
ProjectsRoute.route("/taskboardcompleteusersallaccess").post(getTaskBoarddevcompletemanageraccess);
ProjectsRoute.route("/taskboardincompletetesterallaccess").post(getTaskBoardtesterincompletemanageraccess);
ProjectsRoute.route("/taskboardcompletetesterallaccess").post(getTaskBoardtestercompletemanageraccess);

//TASKREPORTPAGE
ProjectsRoute.route("/taskreportdevincomplete").post(taskReportstyle);
ProjectsRoute.route("/taskreportdevcomplete").post(taskReportstyle1);
ProjectsRoute.route("/taskreporttesterincomplete").post(taskReportstyleincomplete);
ProjectsRoute.route("/taskreporttestercomplete").post(taskReportstylecomplete);

//TASKHOMEPAGE
ProjectsRoute.route("/taskhomepagetodaydevincomplete").post(taskHomepageTodaydevincomplete);
ProjectsRoute.route("/taskhomepagetodaytesterincomplete").post(taskHomepageTodaytesterincomplete);
ProjectsRoute.route("/taskhomepagedevincomplete").post(taskHomepagedevincomplete);
ProjectsRoute.route("/taskhomepagetesterincomplete").post(taskHomepagetesterincomplete);
ProjectsRoute.route("/taskhomepageallcomplete").get(getTaskBoardcompleteallmanageraccess);
ProjectsRoute.route("/taskhomepagetesterincompleteaccess").post(taskHomepagetesterincompleteaccess);
ProjectsRoute.route("/taskhomepagedevincompleteaccess").post(taskHomepagedevincompleteaccess);

//CHECK TIMER
ProjectsRoute.route("/taskchecktimerstatus").post(taskHomepagedevincompletechecktimer);

// connect taskcheckdefault controller..
const { getAllTaskcheckdefault, addtaskcheckdefault, updatetaskcheckdefault, getTaskcheckdefaultLimit, getSingletaskcheckdefault, deletetaskcheckdefault, getOverallDescriptions } = require("../controller/modules/project/taskdefault");
ProjectsRoute.route("/taskcheckdefaults").get(getAllTaskcheckdefault);
// ProjectsRoute.route('/taskcheckdefaultslimit').get(getTaskcheckdefaultLimit);
ProjectsRoute.route("/taskcheckdefault/new").post(addtaskcheckdefault);
ProjectsRoute.route("/taskcheckdefault/:id").get(getSingletaskcheckdefault).put(updatetaskcheckdefault).delete(deletetaskcheckdefault);
ProjectsRoute.route("/overalldescriptions").post(getOverallDescriptions);

// connect Task(notification) controller..

const { getAllNotificationDetails, addNotificationDetails, updateNotificationDetails, getNotificationLimit, getSingleNotificationDetails, deleteNotificationDetails } = require("../controller/modules/project/notification");
ProjectsRoute.route("/notifications").get(getAllNotificationDetails);
// ProjectsRoute.route('/notificationslimit').get(getNotificationLimit);
ProjectsRoute.route("/notification/new").post(addNotificationDetails);
ProjectsRoute.route("/notification/:id").get(getSingleNotificationDetails).put(updateNotificationDetails).delete(deleteNotificationDetails);

// connect Timer controller..

const { getAllTimer, addtaskTimer, updateTimer, getSingleTimer, deleteTimer, getTimerLimit, getUserTimerStatus } = require("../controller/modules/project/timer");
ProjectsRoute.route("/timers").get(getAllTimer);
// ProjectsRoute.route('/timerslimit').get(getTimerLimit);
ProjectsRoute.route("/timer/new").post(addtaskTimer);
ProjectsRoute.route("/timer/:id").get(getSingleTimer).put(updateTimer).delete(deleteTimer);
ProjectsRoute.route("/taskusertime").post(getUserTimerStatus);

// connect category controller..
const { getAllCategorysub, addCategorysub, getSingleCategorysub, updateCategorysub, deleteCategorysub, getCategorysubToCheckgroup } = require("../controller/modules/project/categorysub");
ProjectsRoute.route("/categories").get(getAllCategorysub);
ProjectsRoute.route("/category/new").post(addCategorysub);
ProjectsRoute.route("/category/:id").get(getSingleCategorysub).put(updateCategorysub).delete(deleteCategorysub);
ProjectsRoute.route("/checkptgroup/category").post(getCategorysubToCheckgroup);

// connect checkpointgroup controller
const { getAllCheckptGroup, addCheckptGroup, getSingleCheckptGroup, updateCheckptGroup, deleteCheckptGroup, getOverAllCategoryDetails, getCheckpointsandtime, getCheckpointsandtimeusecases } = require("../controller/modules/project/checkpointgroup");
ProjectsRoute.route("/checkptgroups").get(getAllCheckptGroup);
ProjectsRoute.route("/checkptgroup/new").post(addCheckptGroup);
ProjectsRoute.route("/checkptgroup/:id").get(getSingleCheckptGroup).put(updateCheckptGroup).delete(deleteCheckptGroup);
ProjectsRoute.route("/overallcategory").post(getOverAllCategoryDetails);
ProjectsRoute.route("/checkpointgettime").post(getCheckpointsandtime);
ProjectsRoute.route("/checkpointgettimeusecases").post(getCheckpointsandtimeusecases);

// connect managebranch controller
// connect pagetype controller
const { getAllPagetype, addPagetype, getSinglePagetype, updatePagetype, deletePagetype } = require("../controller/modules/project/pagetype");
ProjectsRoute.route("/pagetypes").get(getAllPagetype);
ProjectsRoute.route("/pagetype/new").post(addPagetype);
ProjectsRoute.route("/pagetype/:id").get(getSinglePagetype).put(updatePagetype).delete(deletePagetype);

// connect componentgrouping controller
const { getAllComponentsgrouping, addcompgrouping, updatecompgrouping, getSinglecompgrouping, deletecompgrouping } = require("../controller/modules/project/components/componentgrp");
ProjectsRoute.route("/componentsgroupings").get(getAllComponentsgrouping);
ProjectsRoute.route("/componentsgroup/new").post(addcompgrouping);
ProjectsRoute.route("/componentsgroup/:id").get(getSinglecompgrouping).put(updatecompgrouping).delete(deletecompgrouping);
// excelRoute.route('/getoverallprojectmaster').post(getoverallprojectmaster);

// connect Component Sub Compomnent controller..
// const { getAllCompSubComp, addCompSubComponent, getSingleCompsubComp, updateCompSubComp, deleteCompSubComp } = require('../controller/modules/project/components/component');
// ProjectsRoute.route('/compsubcomponents').get(getAllCompSubComp);
// ProjectsRoute.route('/compsubcomponent/new').post(addCompSubComponent);
// ProjectsRoute.route('/compsubcomponent/:id').get(getSingleCompsubComp).put(updateCompSubComp).delete(deleteCompSubComp)

const { getAllComponent, addComponent, updateComponent, getAllComponentEdit, getSingleComponent, deleteComponent } = require("../controller/modules/project/components/component");
ProjectsRoute.route("/components").get(getAllComponent);
ProjectsRoute.route("/component/new").post(addComponent);
ProjectsRoute.route("/componentoverall").post(getAllComponentEdit);
ProjectsRoute.route("/component/:id").get(getSingleComponent).put(updateComponent).delete(deleteComponent);

// connect Component Sub Compomnent controller..
const { getAllSubComp, addSubComponent, getSinglesubComp, getAllSubCompCodeEdit, getAllSubCompCode, updateSubComp, deleteSubComp } = require("../controller/modules/project/components/subcomponent");
ProjectsRoute.route("/subcomponents").get(getAllSubComp);
ProjectsRoute.route("/subcomponentCode").post(getAllSubCompCode);
ProjectsRoute.route("/subcomponentCodeEdit").post(getAllSubCompCodeEdit);
ProjectsRoute.route("/subcomponent/new").post(addSubComponent);
ProjectsRoute.route("/subcomponent/:id").get(getSinglesubComp).put(updateSubComp).delete(deleteSubComp);

const { getAllPageModel, addPageModel, getAllPageModellimited, updatePageModel, getAllPageTypeSubSubPagesDropmulti,getAllPageTypeSubPagesDropmulti, getAllPageTypeSubPagesDrop, getAllPageTypeMainmulti, getAllPageTypeSubSubPagesDrop, getAllPageTypeMain, getAllPageTypeMainEstimationTime, getAllSubprojectsDrop, getAllModuleDrop, getAllSubModuleDrop, getSinglePageModel, deletePageModel } = require("../controller/modules/project/pagemodel");
ProjectsRoute.route("/pagemodels").get(getAllPageModel);
ProjectsRoute.route("/pagemodel/new").post(addPageModel);
ProjectsRoute.route("/subprojectsDrop").post(getAllSubprojectsDrop);
ProjectsRoute.route("/moduleDrop").post(getAllModuleDrop);
ProjectsRoute.route("/pagetypemaindrop").post(getAllPageTypeMain);
ProjectsRoute.route("/pagetypesubpagedrop").post(getAllPageTypeSubPagesDrop);
ProjectsRoute.route("/pagetypesubsubpagedrop").post(getAllPageTypeSubSubPagesDrop);
ProjectsRoute.route("/pagetypemainEsttime").post(getAllPageTypeMainEstimationTime);
ProjectsRoute.route("/submoduleDrop").post(getAllSubModuleDrop);
ProjectsRoute.route("/pagemodel/:id").get(getSinglePageModel).put(updatePageModel).delete(deletePageModel);
ProjectsRoute.route("/pagetypemaindropmulti").post(getAllPageTypeMainmulti);
ProjectsRoute.route("/pagemodelslimited").get(getAllPageModellimited);
ProjectsRoute.route("/pagetypesubpagedropmulti").post(getAllPageTypeSubPagesDropmulti);
ProjectsRoute.route("/pagetypesubsubpagedropmulti").post(getAllPageTypeSubSubPagesDropmulti);

// connect reson of leaving list controller
const { getAllAddexists, addAddexists, updateAddexists, getSingleAddexists, deleteAddexists } = require("../controller/modules/project/addexists");
ProjectsRoute.route("/addexists").get(getAllAddexists);
ProjectsRoute.route("/addexist/new").post(addAddexists);
ProjectsRoute.route("/addexits/:id").get(getSingleAddexists).put(updateAddexists).delete(deleteAddexists);

// connect Working organisation of  list controller
const { getAllAddexistswork, addAddexistswork, updateAddexistswork, getSingleAddexistswork, deleteAddexistswork } = require("../controller/modules/project/addexistswork");
ProjectsRoute.route("/addexistworks").get(getAllAddexistswork);
ProjectsRoute.route("/addexistwork/new").post(addAddexistswork);
ProjectsRoute.route("/addexitswork/:id").get(getSingleAddexistswork).put(updateAddexistswork).delete(deleteAddexistswork);

// connect reson of addexists all list controller
const { getAllAddexistsall, addAddexistsall, updateAddexistsall, getSingleAddexistsall, deleteAddexistsall } = require("../controller/modules/project/addexistsall");
ProjectsRoute.route("/addexistalls").get(getAllAddexistsall);
ProjectsRoute.route("/addexistall/new").post(addAddexistsall);
ProjectsRoute.route("/addexitsall/:id").get(getSingleAddexistsall).put(updateAddexistsall).delete(deleteAddexistsall);

// connect Notice period reson of leaving list controller
const { getAllNoticereason, addNoticereason, updateNoticereason, getSingleNoticereason, deleteNoticereason } = require("../controller/modules/project/noticereason");
ProjectsRoute.route("/noticereasons").get(getAllNoticereason);
ProjectsRoute.route("/noticereason/new").post(addNoticereason);
ProjectsRoute.route("/noticereason/:id").get(getSingleNoticereason).put(updateNoticereason).delete(deleteNoticereason);

// connect Refer candidate form controller
const { getAllRefercandidate, addRefercandidate, getAllUserRefercandidate,updateRefercandidate, getSingleRefercandidate, deleteRefercandidate } = require("../controller/modules/project/refercandidate");
ProjectsRoute.route("/refercandidates").get(getAllRefercandidate);
ProjectsRoute.route("/userrefercandidate").post(getAllUserRefercandidate);
ProjectsRoute.route("/refercandidate/new").post(addRefercandidate);
ProjectsRoute.route("/refercandidate/:id").get(getSingleRefercandidate).put(updateRefercandidate).delete(deleteRefercandidate);

const { getAllRaiseissue, addRaiseissue, updateRaiseissue, getSingleRaiseissue, deleteRaiseissue } = require("../controller/modules/project/raiseissue");
ProjectsRoute.route("/raiseissues").get(getAllRaiseissue);
ProjectsRoute.route("/raiseissue/new").post(addRaiseissue);
ProjectsRoute.route("/raiseissue/:id").get(getSingleRaiseissue).put(updateRaiseissue).delete(deleteRaiseissue);

module.exports = ProjectsRoute;
