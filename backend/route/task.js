const express = require("express");
const taskRoute = express.Router();

// connect task category form controller

const { getAllTaskcategory, getSingleTaskcategory, addTaskcategory, getOverallDeleteCategory, getOverallEditCategory, updateTaskcategory, deleteTaskcategory } = require("../controller/modules/task/taskcategory");
taskRoute.route("/taskcategories").get(getAllTaskcategory);
taskRoute.route("/taskcategory/new").post(addTaskcategory);
taskRoute.route("/taskcategoryOverallEdit").post(getOverallEditCategory);

taskRoute.route("/taskcategoryOverallDelete").post(getOverallDeleteCategory);
taskRoute.route("/taskcategory/:id").get(getSingleTaskcategory).put(updateTaskcategory).delete(deleteTaskcategory);

// connect task subcategory form controller

const { getAllTasksubcategory, getSingleTasksubcategory, getOverallDeleteSubCategory, getOverallEditSubCategory, addTasksubcategory, updateTasksubcategory, deleteTasksubcategory } = require("../controller/modules/task/tasksubcategory");
taskRoute.route("/tasksubcategories").get(getAllTasksubcategory);
taskRoute.route("/tasksubcategory/new").post(addTasksubcategory);
taskRoute.route("/tasksubcategoryOverallEdit").post(getOverallEditSubCategory);
taskRoute.route("/tasksubcategoryOverallDelete").post(getOverallDeleteSubCategory);
taskRoute.route("/tasksubcategory/:id").get(getSingleTasksubcategory).put(updateTasksubcategory).delete(deleteTasksubcategory);

// connect training category form controller

const { getAllTrainingcategory, getSingleTrainingcategory, getOverallTrainingEditCategory, getOverallTrainingDeleteCategory, addTrainingcategory, updateTrainingcategory, deleteTrainingcategory } = require("../controller/modules/task/trainingcategory");
taskRoute.route("/trainingcategories").get(getAllTrainingcategory);
taskRoute.route("/trainingcategory/new").post(addTrainingcategory);
taskRoute.route("/trainingcategoryOverallEdit").post(getOverallTrainingEditCategory);
taskRoute.route("/trainingcategoryOverallDelete").post(getOverallTrainingDeleteCategory);
taskRoute.route("/trainingcategory/:id").get(getSingleTrainingcategory).put(updateTrainingcategory).delete(deleteTrainingcategory);

// connect training subcategory form controller

const { getAllTrainingsubcategory, getSingleTrainingsubcategory, getOverallTrainingEditSubCategory, getOverallTrainingDeleteSubCategory, addTrainingsubcategory, updateTrainingsubcategory, deleteTrainingsubcategory } = require("../controller/modules/task/trainingsubcategory");
taskRoute.route("/trainingsubcategories").get(getAllTrainingsubcategory);
taskRoute.route("/trainingsubcategory/new").post(addTrainingsubcategory);
taskRoute.route("/trainingsubcategoryOverallEdit").post(getOverallTrainingEditSubCategory);
taskRoute.route("/trainingsubcategoryOverallDelete").post(getOverallTrainingDeleteSubCategory);
taskRoute.route("/trainingsubcategory/:id").get(getSingleTrainingsubcategory).put(updateTrainingsubcategory).delete(deleteTrainingsubcategory);


const { addTrainingForUser, deleteTrainingForUser, getAllTrainingForUserOnprogress, getAllTrainingOnlineTestQuestionsBulkDelete, getAllTrainingOnlineTestQuestions, getAllTrainingForUserReportsOverall, getAllTrainingHierarchyReports, getAllTrainingForUserAssignId, getAllTrainingForUserReports, getAllTrainingForUserCompleted, getAllTrainingForUserPostponed, getAllTrainingForUser, getAllSortedTrainingUsers, getSingleTrainingForUser, updateTrainingForUser } = require("../controller/modules/task/TrainingForUser");
taskRoute.route("/trainingforusers").get(getAllTrainingForUser);
taskRoute.route("/trainingforuserspostponed").post(getAllTrainingForUserPostponed);
taskRoute.route("/trainingforusersonprogress").post(getAllTrainingForUserOnprogress);
taskRoute.route("/trainingforuserreports").post(getAllTrainingForUserReports);
taskRoute.route("/trainingforuserreportsoverall").post(getAllTrainingForUserReportsOverall);
taskRoute.route("/trainingforuserscompleted").post(getAllTrainingForUserCompleted);
taskRoute.route("/trainingforuserassignuser").post(getAllTrainingForUserAssignId);
taskRoute.route("/traininghierarchyreports").post(getAllTrainingHierarchyReports);
taskRoute.route("/trainingforuser/new").post(addTrainingForUser);
taskRoute.route("/sortedtrainingforusers").post(getAllSortedTrainingUsers);
taskRoute.route("/trainingforuser/:id").delete(deleteTrainingForUser).get(getSingleTrainingForUser).put(updateTrainingForUser);
taskRoute.route("/traininguserpanelonlinetest").post(getAllTrainingOnlineTestQuestions);
taskRoute.route("/traininguserpanelonlinetestbulkdelete").post(getAllTrainingOnlineTestQuestionsBulkDelete);

// connect source form controller

const { getAllSource, getSingleSource, addSource, updateSource, deleteSource } = require("../controller/modules/task/source");
taskRoute.route("/sources").get(getAllSource);
taskRoute.route("/source/new").post(addSource);
taskRoute.route("/source/:id").get(getSingleSource).put(updateSource).delete(deleteSource);

// connect income form controller

const {
  getAllIncome,
  getAllIncomeHome,
  getSingleIncome,
  addIncome,
  updateIncome,
  deleteIncome,
  skippedIncomes,
} = require("../controller/modules/expense/income");
taskRoute.route("/incomes").post(getAllIncome);
taskRoute.route("/incomeshome").post(getAllIncomeHome);
taskRoute.route("/income/new").post(addIncome);
// taskRoute.route("/skippedincomes").post(skippedIncomes);
taskRoute.route("/income/:id").get(getSingleIncome).put(updateIncome).delete(deleteIncome);


// connect Remainder form controller

const { getAllRemainder, getSingleRemainder, addRemainder, updateRemainder, deleteRemainder } = require("../controller/modules/task/remainder");
taskRoute.route("/remainders").get(getAllRemainder);
taskRoute.route("/remainder/new").post(addRemainder);
taskRoute.route("/remainder/:id").get(getSingleRemainder).put(updateRemainder).delete(deleteRemainder);

//connect taskschedule form controller
const { addTaskScheduleGrouping, deleteTaskScheduleGrouping, getAllTaskScheduleGrouping, getSingleTaskScheduleGrouping, updateTaskScheduleGrouping } = require("../controller/modules/task/TaskScheduleGroupingController");
taskRoute.route("/taskschedulegroupings").get(getAllTaskScheduleGrouping);
taskRoute.route("/taskschedulegrouping/new").post(addTaskScheduleGrouping);
taskRoute.route("/taskschedulegrouping/:id").delete(deleteTaskScheduleGrouping).get(getSingleTaskScheduleGrouping).put(updateTaskScheduleGrouping);

//connect task non schedule form controller
const { addTaskNonScheduleGrouping, deleteTaskNonScheduleGrouping, getAllTaskNonScheduleGrouping, getSingleTaskNonScheduleGrouping, updateTaskNonScheduleGrouping } = require("../controller/modules/task/nonschedulegrouping");
taskRoute.route("/tasknonschedulegroupings").get(getAllTaskNonScheduleGrouping);
taskRoute.route("/tasknonschedulegrouping/new").post(addTaskNonScheduleGrouping);
taskRoute.route("/tasknonschedulegrouping/:id").delete(deleteTaskNonScheduleGrouping).get(getSingleTaskNonScheduleGrouping).put(updateTaskNonScheduleGrouping);


//connect Task Designation Grouping controller
const { addTaskDesignationGrouping, deleteTaskDesignationGrouping, getAllTaskDesignationGrouping, getAllTaskDesignationGroupingActive, getSingleTaskDesignationGrouping, updateTaskDesignationGrouping } = require("../controller/modules/task/taskdesignationgrouping");
taskRoute.route("/taskdesignationgroupings").get(getAllTaskDesignationGrouping);
taskRoute.route("/taskdesignationgroupingsactive").get(getAllTaskDesignationGroupingActive);
taskRoute.route("/taskdesignationgrouping/new").post(addTaskDesignationGrouping);
taskRoute.route("/taskdesignationgrouping/:id").delete(deleteTaskDesignationGrouping).get(getSingleTaskDesignationGrouping).put(updateTaskDesignationGrouping);


//connect Task For an User controller
const { addTaskForUser, deleteTaskForUser, getAllNonscheduleTaskLogForUser,
  getPendingTaskCount, getAllTaskForAssingnedhome, getAllTaskForPendinghome, getAllTaskForFinishedhome, getAllTaskForCompletedhome, getAllTaskForNotApplicablehome, getAllTaskForPostponedhome, getAllTaskForPausedhome,
  getAllNonscheduleTaskLogReassign, getAllTaskUserReportsOverall, getOnprogressAllTaskForUser, getCompletedAllTaskForUserOverall, getAllTaskHierarchyReports, getAllTaskForUserAssignId, getAllTaskForUserUsername, getAllManualAllTaskForUser, getCompletedAllTaskForUser, getManualAllTaskForUser, getAllTaskForUser, getINDIVIDUALAllTaskForUser, getAllTaskForUserManual, getAllTaskForUserCompleted, getAllTaskForUserOnprogress, getAllTaskUserReports, getAllTaskForUserAutoGenerate, getAllSortedTaskForUser, getSingleTaskForUser, updateTaskForUser } = require("../controller/modules/task/TaskForUser");
taskRoute.route("/taskforusers").get(getAllTaskForUser);
taskRoute.route("/nonscheduletaskforuserlog").post(getAllNonscheduleTaskLogForUser);
taskRoute.route("/nonschedulelogreassignforuser").post(getAllNonscheduleTaskLogReassign);
taskRoute.route("/taskforusersonprogress").post(getAllTaskForUserOnprogress);
taskRoute.route("/taskforusersmanuual").post(getAllTaskForUserManual);
taskRoute.route("/taskforuserscompleted").post(getAllTaskForUserCompleted);
taskRoute.route("/taskforuser/new").post(addTaskForUser);
taskRoute.route("/individualtaskforusers").post(getINDIVIDUALAllTaskForUser);
taskRoute.route("/onprogresstaskforusers").post(getOnprogressAllTaskForUser);
taskRoute.route("/completedtaskforusers").post(getCompletedAllTaskForUser);
taskRoute.route("/manualtaskforusers").post(getManualAllTaskForUser);
taskRoute.route("/allmanualtaskforusers").get(getAllManualAllTaskForUser);
taskRoute.route("/sortedtasksforusers").post(getAllSortedTaskForUser);
taskRoute.route("/taskforuserreports").post(getAllTaskUserReports);

taskRoute.route("/completedtaskforusersoverall").post(getCompletedAllTaskForUserOverall);
taskRoute.route("/taskforuserreportsoverall").post(getAllTaskUserReportsOverall);
taskRoute.route("/getpendingtaskcount").get(getPendingTaskCount);
taskRoute.route("/taskforuserautogenerate").post(getAllTaskForUserAutoGenerate);
taskRoute.route("/taskhierarchyreports").post(getAllTaskHierarchyReports);
taskRoute.route("/taskforuserassignuser").post(getAllTaskForUserAssignId);
taskRoute.route("/taskforusersusername").post(getAllTaskForUserUsername);
taskRoute.route("/taskforuser/:id").delete(deleteTaskForUser).get(getSingleTaskForUser).put(updateTaskForUser);

//dashboard
taskRoute.route("/taskforassignedhome").post(getAllTaskForAssingnedhome);
taskRoute.route("/taskforpendinghome").get(getAllTaskForPendinghome);
taskRoute.route("/taskforfinishedhome").get(getAllTaskForFinishedhome);

taskRoute.route("/taskforapplicablehome").get(getAllTaskForNotApplicablehome);
taskRoute.route("/taskforcompletedhome").get(getAllTaskForCompletedhome);


taskRoute.route("/taskforpausedhome").get(getAllTaskForPausedhome);
taskRoute.route("/taskforpostponedhome").get(getAllTaskForPostponedhome);




// //connect Training For an User controller
// const { addTrainingForUser, deleteTrainingForUser,getAllTrainingForUserOnprogress,getAllTrainingHierarchyReports,getAllTrainingForUserAssignId ,getAllTrainingForUserReports, getAllTrainingForUserCompleted , getAllTrainingForUserPostponed, getAllTrainingForUser,getAllSortedTrainingUsers, getSingleTrainingForUser, updateTrainingForUser } = require("../controller/modules/task/TrainingForUser");
// taskRoute.route("/trainingforusers").get(getAllTrainingForUser);
// taskRoute.route("/trainingforuserspostponed").post(getAllTrainingForUserPostponed);
// taskRoute.route("/trainingforusersonprogress").post(getAllTrainingForUserOnprogress);
// taskRoute.route("/trainingforuserreports").post(getAllTrainingForUserReports);
// taskRoute.route("/trainingforuserscompleted").post(getAllTrainingForUserCompleted);
// taskRoute.route("/trainingforuserassignuser").post(getAllTrainingForUserAssignId);
// taskRoute.route("/traininghierarchyreports").post(getAllTrainingHierarchyReports);
// taskRoute.route("/trainingforuser/new").post(addTrainingForUser);
// taskRoute.route("/sortedtrainingforusers").post(getAllSortedTrainingUsers);
// taskRoute.route("/trainingforuser/:id").delete(deleteTrainingForUser).get(getSingleTrainingForUser).put(updateTrainingForUser);

//  training details backend route
const { addTrainingDetails, deleteTrainingDetails, getAllTrainingDetailsWithoutDocument, getAllTrainingDetailsWithoutDocumentActive, getOverallEditTrainingDetails, getAllTrainingDetails, getSingleTrainingDetails, updateTrainingDetails } = require("../controller/modules/task/trainingdetails");
taskRoute.route("/trainingdetailss").get(getAllTrainingDetails);
taskRoute.route("/trainingdetailsdocument").get(getAllTrainingDetailsWithoutDocument);
taskRoute.route("/trainingdetailsdocumentactive").get(getAllTrainingDetailsWithoutDocumentActive);
taskRoute.route("/trainingDetailsOverallEdit").post(getOverallEditTrainingDetails);
taskRoute.route("/trainingdetails/new").post(addTrainingDetails);
taskRoute.route("/trainingdetails/:id").get(getSingleTrainingDetails).put(updateTrainingDetails).delete(deleteTrainingDetails);

//  training details backend route
const { addNonscheduleTrainingDetails, deleteNonscheduleTrainingDetails, getAllNonscheduleTrainingDetails, getSingleNonscheduleTrainingDetails, updateNonscheduleTrainingDetails } = require("../controller/modules/task/tasknonscheduletraining");
taskRoute.route("/nonscheduletrainingdetailss").get(getAllNonscheduleTrainingDetails);
taskRoute.route("/nonscheduletrainingdetails/new").post(addNonscheduleTrainingDetails);
taskRoute.route("/nonscheduletrainingdetails/:id").get(getSingleNonscheduleTrainingDetails).put(updateNonscheduleTrainingDetails).delete(deleteNonscheduleTrainingDetails);

//connect Training USer Resposes controller
const { addTrainingUserResponse, deleteTrainingUserResponse, getAllTrainingUserResponse, getSingleTrainingUserResponse, updateTrainingUserResponse } = require("../controller/modules/task/TrainingUserResponse");
taskRoute.route("/usertrainingresponses").get(getAllTrainingUserResponse);
taskRoute.route("/createusertrainingresponse/new").post(addTrainingUserResponse);
taskRoute.route("/usertrainingresponse/:id").delete(deleteTrainingUserResponse).get(getSingleTrainingUserResponse).put(updateTrainingUserResponse);


module.exports = taskRoute;