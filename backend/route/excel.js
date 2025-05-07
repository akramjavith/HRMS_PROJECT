const express = require("express");
const excelRoute = express.Router();
// connect Branch controller
const {
  getAllExcel,
  getAllHierarchyPrimaryworkorderovertat,
  getAllHierarchyPrimaryworkorderall,
  getAllHierarchyPrimaryworkorderneartat,
  addExcel,
  getAllConsolidateHierarchyPrimSecTer,
  getAllHierarchyConsolidatedWorkOrderAll,
  getAllSecondaryHierarchyList,
  getAllTertiaryHierarchyFilter,
  getAllOtherHierarchyWorkOrder,
  getAllExcelfiltered,
  updateExcel,
  getSingleExcel,
  deleteExcel,
  getAllExcelPrimaryworkorderovertat,
  getAllExcelPrimaryworkorderneartat,
  getAllExcelPrimaryworkorderall,
  getAllExcelSecondaryworkorderall,
  getAllExcelTertiaryworkorderall,
  getAllExcelUnallotedRespersonList,
  getAllExcelUnallotedQueueList,
  getAllExcelUnallotedQueueListOverall,
  getAllExcelTeamReportCount,
  getExcelWorkOrderLiveIndividual,
  getAllExcelQueueReportCount,
  getAllExcelCustomerReportCount,
  getAllExcelCategoryReportCount,
  getAllExcelRespersonReportCount,
  getExcelConsolidatedIndividualListAllFilter,
  getExcelConsolidatedIndividualListAll,
  getAllExcelIndividualPrimaryIndneartat,
  getExcelPrimaryIndividual,
  getAllExcelBranchReportCount,
  getExcelConsolidatedIndividualList,
  getExcelConsolidatedIndividualListFilter,
  getAllExcelPrimaryworkorderOtherList,
  getExcelTertiaryIndividual,
  getAllExcelSecondaryworkorderallUnalloted,
  getExcelothersIndividualListFilter,
  getExcelothersIndividualList,
  getExcelSecondaryIndividual,
  getAllExcelConsWorkDataListFilter,
  getAllExcelIndividualPrimaryworkorderall,
  getAllExcelConsWorkDataAllList,
  getAllExcelConsWorkDataAllListFilter,
  getAllExcelConsWorkDataList,
  getAllExcelPrimaryworkorderOther,
  getAllExcelWithoutSecondaryConsolidated,
  getAllSecondaryWokOrderFilter,
  getAllExcelWithoutTertiaryConsolidated,
  getAllTertiaryWokOrderFilter,
  getAllSecondaryHierarchyDefault,
  getAllTertiaryHierarchyDefault,
  getAllOtherHierarchyWorkOrderDefault,
  getAllConsolidateHierarchyPrimSecTerDefault,
  getAllHierarchyConsolidatedWorkOrderAllDefault,
  getAllHierarchyPrimaryworkorderovertatDefault,
  getAllHierarchyPrimaryworkorderneartatDefault,
  getAllHierarchyPrimaryworkorderallDefault, getAllCandidateCountHome, getAllCandidateUpcomingInterview
} = require("../controller/modules/excel/excel");

excelRoute.route("/allcandidatescounthome").get(getAllCandidateCountHome);
excelRoute.route("/allcandidatesupcominginterview").post(getAllCandidateUpcomingInterview);

excelRoute.route("/excels").get(getAllExcel);
excelRoute.route("/excelsfiltered").get(getAllExcelfiltered);
excelRoute.route("/excel/new").post(addExcel);
excelRoute
  .route("/excel/:id")
  .get(getSingleExcel)
  .put(updateExcel)
  .delete(deleteExcel);

//reports
excelRoute.route("/excelbranchreportocunt").get(getAllExcelBranchReportCount);
excelRoute.route("/excelteamreportocunt").get(getAllExcelTeamReportCount);
excelRoute
  .route("/excelrespersonreportocunt")
  .get(getAllExcelRespersonReportCount);
excelRoute
  .route("/excelcategoryreportocunt")
  .get(getAllExcelCategoryReportCount);
excelRoute
  .route("/excelcustomerreportocunt")
  .get(getAllExcelCustomerReportCount);
excelRoute.route("/excelqueuereportocunt").get(getAllExcelQueueReportCount);
excelRoute
  .route("/secondaryhierarchyfilter")
  .post(getAllSecondaryHierarchyList);
excelRoute
  .route("/tertiaryhierarchyfilter")
  .post(getAllTertiaryHierarchyFilter);
excelRoute
  .route("/orderhierarchyworkorder")
  .post(getAllOtherHierarchyWorkOrder);
excelRoute
  .route("/consolidatedheirarchyprimsectert")
  .post(getAllConsolidateHierarchyPrimSecTer);
excelRoute
  .route("/consolidatedheirarchyall")
  .post(getAllHierarchyConsolidatedWorkOrderAll);
excelRoute
  .route("/primaryhierarchyworkorderovertatdata")
  .post(getAllHierarchyPrimaryworkorderovertat);
excelRoute
  .route("/primaryhierarchyworkorderneartatdata")
  .post(getAllHierarchyPrimaryworkorderneartat);
excelRoute
  .route("/primaryhierarchyworkorderall")
  .post(getAllHierarchyPrimaryworkorderall);

//secondary and tertiary consolidated pages
//withou secondary consolidated
excelRoute
  .route("/withoutsecondaryconsolidated")
  .get(getAllExcelWithoutSecondaryConsolidated);
excelRoute
  .route("/secondaryworkorderlistfilter")
  .post(getAllSecondaryWokOrderFilter);
//without Tertiary consolidated
excelRoute
  .route("/withouttertiaryconsolidated")
  .get(getAllExcelWithoutTertiaryConsolidated);
excelRoute
  .route("/tertiaryworkorderlistfilter")
  .post(getAllTertiaryWokOrderFilter);

// excelreportprimary
excelRoute
  .route("/primaryworkorderovertatdata")
  .get(getAllExcelPrimaryworkorderovertat);
excelRoute
  .route("/primaryworkorderneartatdata")
  .get(getAllExcelPrimaryworkorderneartat);
excelRoute.route("/primaryworkorderall").get(getAllExcelPrimaryworkorderall);
// excelreprtsecondary
excelRoute
  .route("/secondaryworkorderall")
  .get(getAllExcelSecondaryworkorderall);
excelRoute
  .route("/secondaryworkorderallunalloted")
  .get(getAllExcelSecondaryworkorderallUnalloted);

excelRoute.route("/tertiaryworkorderall").get(getAllExcelTertiaryworkorderall);

excelRoute
  .route("/excelWorkOrderOtherList")
  .get(getAllExcelPrimaryworkorderOtherList);
excelRoute
  .route("/consworkorderlistFilter")
  .post(getAllExcelConsWorkDataListFilter);
excelRoute.route("/consworkorderlistAll").get(getAllExcelConsWorkDataAllList);
excelRoute
  .route("/consworkorderlistAllFilter")
  .post(getAllExcelConsWorkDataAllListFilter);
excelRoute.route("/consworkorderlist").get(getAllExcelConsWorkDataList);
excelRoute.route("/otherworkorderall").post(getAllExcelPrimaryworkorderOther);

excelRoute
  .route("/consolidatedindividualall")
  .post(getExcelConsolidatedIndividualListAll);

excelRoute
  .route("/excelindividualprimaryworkorder")
  .post(getAllExcelIndividualPrimaryworkorderall);
excelRoute.route("/excelsecondaryindividual").post(getExcelSecondaryIndividual);
excelRoute.route("/workorderindividual").get(getExcelothersIndividualList);
excelRoute
  .route("/workorderindividualfilter")
  .post(getExcelothersIndividualListFilter);

excelRoute
  .route("/excelindividualprimaryneartat")
  .post(getAllExcelIndividualPrimaryIndneartat);
excelRoute
  .route("/excelindividualprimaryalllist")
  .post(getExcelPrimaryIndividual);
excelRoute.route("/exceltertiaryindividual").post(getExcelTertiaryIndividual);
excelRoute
  .route("/consolidatedindividual")
  .post(getExcelConsolidatedIndividualList);
excelRoute
  .route("/consolidatedindividualfilter")
  .post(getExcelConsolidatedIndividualListFilter);
excelRoute.route("/consolidatedindividualfilterall").post(getExcelConsolidatedIndividualListAllFilter);

//other
excelRoute.route("/workorderindividual").post(getExcelothersIndividualList);
excelRoute
  .route("/workorderindividualfilter")
  .post(getExcelothersIndividualListFilter);

//WORKORDER LIVE

excelRoute.route("/workorderlive").post(getExcelWorkOrderLiveIndividual);
excelRoute.route("/unallotedexcelqueuelist").post(getAllExcelUnallotedQueueList);
excelRoute.route("/unallotedexcelqueuelistOverall").get(getAllExcelUnallotedQueueListOverall);
excelRoute
  .route("/unallotedexcelrespersonlist")
  .get(getAllExcelUnallotedRespersonList);

excelRoute
  .route("/secondaryhierarchydefault")
  .post(getAllSecondaryHierarchyDefault);
excelRoute
  .route("/tertiaryhierarchydefault")
  .post(getAllTertiaryHierarchyDefault);
excelRoute
  .route("/orderhierarchyworkorderdefault")
  .post(getAllOtherHierarchyWorkOrderDefault);
excelRoute
  .route("/consolidatedheirarchyprimsectertdefault")
  .post(getAllConsolidateHierarchyPrimSecTerDefault);
excelRoute
  .route("/consolidatedheirarchyalldefault")
  .post(getAllHierarchyConsolidatedWorkOrderAllDefault);
excelRoute
  .route("/primaryhierarchyworkorderovertatdatadefault")
  .post(getAllHierarchyPrimaryworkorderovertatDefault);
excelRoute
  .route("/primaryhierarchyworkorderneartatdatadefault")
  .post(getAllHierarchyPrimaryworkorderneartatDefault);
excelRoute
  .route("/primaryhierarchyworkorderalldefault")
  .post(getAllHierarchyPrimaryworkorderallDefault);

const {
  getAllExcelmapdata,
  getAllallotedQueueListFilter,
  getOverallBulkDeleteList,
  getOverallBulkEditList,
  addExcelmapdata,
  updateExcelmapdata,
  getAllExcelmapdataFiltered,
  getoverallallottedqueue,
  getAllMappedPersnDelete,
  getSingleExcelmapdata,
  deleteExcelmapdata,
  getCustomerReport,
  getCategoryOverallDelete,
  getCategoryReport,
  getQueueReport,
  getAllQueueCheck,
} = require("../controller/modules/excel/excelmapdata");

excelRoute.route("/excelmapdatas").get(getAllExcelmapdata);
excelRoute.route("/excelmapdata/new").post(addExcelmapdata);
excelRoute
  .route("/excelmapdata/:id")
  .get(getSingleExcelmapdata)
  .put(updateExcelmapdata)
  .delete(deleteExcelmapdata);
excelRoute.route("/timpoints/queue").post(getAllQueueCheck);
excelRoute.route("/customerexcel").get(getCustomerReport);
excelRoute.route("/categoryexcel").get(getCategoryReport);
excelRoute.route("/categoryexcelbulkdelete").post(getCategoryOverallDelete);
excelRoute.route("/queueexcel").get(getQueueReport);
excelRoute.route("/getoverallallottedqueue").post(getoverallallottedqueue);
excelRoute.route("/excelmapandpersondelete").post(getAllMappedPersnDelete);
excelRoute.route("/excelmapfiltered").post(getAllExcelmapdataFiltered);
excelRoute.route("/allottedqueuelistfilter").post(getAllallotedQueueListFilter);
excelRoute
  .route("/bulkoveralleditallottedqueuelist")
  .post(getOverallBulkEditList);
excelRoute.route("/bulkoveralldelete").post(getOverallBulkDeleteList);

const {
  getAllExcelmaprespersondata,
  getAllottedResponsibleQueueList,
  addExcelmaprespersondata,
  getIndividualWorkOrderList,
  updateExcelmaprespersondata,
  getSingleExcelmaprespersondata,
  deleteExcelmaprespersondata,
  getBranchCount,
  getResPersonCount,
  getTeamCount,
} = require("../controller/modules/excel/excelmapresperson");

excelRoute.route("/excelmaprespersondatas").get(getAllExcelmaprespersondata);
excelRoute.route("/excelmaprespersondata/new").post(addExcelmaprespersondata);
excelRoute
  .route("/excelmaprespersondata/:id")
  .get(getSingleExcelmaprespersondata)
  .put(updateExcelmaprespersondata)
  .delete(deleteExcelmaprespersondata);
excelRoute.route("/excelteamtotal").get(getTeamCount);
excelRoute.route("/excelbranchtotal").get(getBranchCount);
excelRoute.route("/excelrespersontotal").get(getResPersonCount);
excelRoute.route("/individualworkorderlist").post(getIndividualWorkOrderList);
excelRoute
  .route("/allottedresponsiblequeuelist")
  .post(getAllottedResponsibleQueueList);

const {
  getAllQueue,
  addQueue,
  updateQueue,
  getSingleQueue,
  deleteQueue,
  getoverallqueuemasteredit,
  getoverallqueuemasterDelete,
  getoverallqueuemasterBulkDelete
} = require("../controller/modules/setup/queue");
excelRoute.route("/queues").get(getAllQueue);
excelRoute.route("/queue/new").post(addQueue);
excelRoute.route("/getoverallqueuemasteredit").post(getoverallqueuemasteredit);
excelRoute.route("/getoverallqueuemasterdelete").post(getoverallqueuemasterDelete);
excelRoute.route("/getoverallqueuemasterbulkdelete").post(getoverallqueuemasterBulkDelete);
excelRoute
  .route("/queue/:id")
  .get(getSingleQueue)
  .put(updateQueue)
  .delete(deleteQueue);

//Queue Groping start
const {
  getAllQueuegrouping,
  addQueuegrouping,
  updateQueuegrouping,
  getSingleQueuegrouping,
  deleteQueuegrouping,
  getOverallQueueGroupingEdit,
  getOverallQueueGroupingDelete,
  getOverallQueueGroupingBulkDelete
} = require("../controller/modules/excel/queuegrouping");
excelRoute.route("/queuegroups").get(getAllQueuegrouping);
excelRoute.route("/queuegroup/new").post(addQueuegrouping);
excelRoute.route("/getoverallqueuegroupdit").post(getOverallQueueGroupingEdit);
excelRoute.route("/getoverallqueuegroupdelete").post(getOverallQueueGroupingDelete);
excelRoute.route("/getoverallqueuegroupbulkdelete").post(getOverallQueueGroupingBulkDelete);
excelRoute
  .route("/queuegroup/:id")
  .get(getSingleQueuegrouping)
  .put(updateQueuegrouping)
  .delete(deleteQueuegrouping);
// Queue Groping End

// connect managebranch controller
const {
  getAllProjmaster,
  addprojmaster,
  updateprojmaster,
  getSingleprojmaster,
  deleteprojmaster,
  getoverallprojectmaster,
  getAllProjmasterLimitedName,
  getoverallBulkDeleteprojectmaster, getAllProjmasterProductionIndividual
} = require("../controller/modules/setup/project");
excelRoute.route("/projectmasters").get(getAllProjmaster);
excelRoute.route("/projectmasterslimitedname").get(getAllProjmasterLimitedName);
excelRoute.route("/projectmasterindividual").post(getAllProjmasterProductionIndividual);
excelRoute.route("/projectmaster/new").post(addprojmaster);
excelRoute
  .route("/projectmaster/:id")
  .get(getSingleprojmaster)
  .put(updateprojmaster)
  .delete(deleteprojmaster);
excelRoute.route("/getoverallprojectmaster").post(getoverallprojectmaster);
excelRoute.route("/getoverallbulkdeleteprojectmaster").post(getoverallBulkDeleteprojectmaster);

// connect vendormaster controller
// connect vendormaster controller
const {
  getAllVendormaster,
  getoverallvendormasteredit,
  addvendormaster,
  updatevendormaster,
  getProjectsVendor,
  getFilteredVendorsExcelUpload,
  getSinglevendormaster,
  deletevendormaster,
  getprojectcheckvendor,
  getoverallBulkDeletevendormaster,
  getoverallvendormaster,
  getoverallDeletevendormaster, getOverallVendorMasterNameOnly
} = require("../controller/modules/setup/vendor");
excelRoute.route("/vendormasters").get(getAllVendormaster);
excelRoute.route("/vendormaster/new").post(addvendormaster);
excelRoute.route("/vendormasterlimitednameonly").get(getOverallVendorMasterNameOnly);
excelRoute.route("/getoverallbulkdeletevendormasteredit").post(getoverallBulkDeletevendormaster);
excelRoute.route("/getoverallDeletevendormasteredit").post(getoverallDeletevendormaster);
excelRoute
  .route("/vendormaster/:id")
  .get(getSinglevendormaster)
  .put(updatevendormaster)
  .delete(deletevendormaster);
excelRoute.route("/vendor/projectcheck").post(getprojectcheckvendor);
excelRoute.route("/getoverallvendormaster").post(getoverallvendormaster);
excelRoute.route("/projectvendors").post(getProjectsVendor);
excelRoute
  .route("/projectvendorsfilteredexcelupload")
  .post(getFilteredVendorsExcelUpload);
excelRoute
  .route("/getoverallvendormasteredit")
  .post(getoverallvendormasteredit);


// connect category controller..
const {
  getAllCategory,
  addCategory,
  getSingleCategory,
  updateCategory,
  getProjectCategory,
  deleteCategory,
  getprojectcheckcategory,
  getoverallcategorytmaster,
  getAllCategorydelete,
} = require("../controller/modules/setup/category");
excelRoute.route("/categoriesexcel").get(getAllCategory);
excelRoute.route("/categoryexcel/new").post(addCategory);
excelRoute
  .route("/categoryexcel/:id")
  .get(getSingleCategory)
  .put(updateCategory)
  .delete(deleteCategory);
excelRoute.route("/category/projectcheck").post(getprojectcheckcategory);
excelRoute.route("/getoverallcategorytmaster").post(getoverallcategorytmaster);
excelRoute.route("/vendor/categorycheck").post(getAllCategorydelete);
excelRoute.route("/projectcategorys").post(getProjectCategory);

// connect subcategory controller..
const {
  getAllSubcategory,
  addSubcategory,
  getSingleSubcategory,
  updateSubcategory,
  deleteSubcategory,
  getprojectchecksubcategory,
  getcategorychecksubcategory,
  getoverallsubcategorytmaster,
  getAllSubCategorydelete,
  getOverallBulkDeleteSubCategory,
} = require("../controller/modules/setup/subcategory");
excelRoute.route("/subcategoriesexcel").get(getAllSubcategory);
excelRoute.route("/subcategoryexcel/new").post(addSubcategory);
excelRoute.route("/subcategoryexcelbulkdelete").post(getOverallBulkDeleteSubCategory);
excelRoute
  .route("/subcategoryexcel/:id")
  .get(getSingleSubcategory)
  .put(updateSubcategory)
  .delete(deleteSubcategory);
excelRoute.route("/subcategory/projectcheck").post(getprojectchecksubcategory);
excelRoute
  .route("/subcategory/categorycheck")
  .post(getcategorychecksubcategory);
excelRoute
  .route("/getoverallsubcategorytmaster")
  .post(getoverallsubcategorytmaster);
excelRoute.route("/vendor/subcategorycheck").post(getAllSubCategorydelete);

// connect time Points controller..
const {
  getAllTimePoints,
  addTimePoint,
  getSubCategoryDropdwons,
  getCategoryDropdwons,
  getAllCategorySubCategory,
  getvendorDropdwons,
  updateTimePoint,
  getCategorySubcategoryEdit,
  getSingleTimePoint,
  deleteTimePoint,
  getprojectchecktimepoints,
  getcategorychecktimepoints,
  getsubcategorychecktimepoints,
  getAllTimepointsdelete,
  getOverallBulkDelete
} = require("../controller/modules/setup/timepoints");
excelRoute.route("/timepoints").get(getAllTimePoints);
excelRoute.route("/timepoint/new").post(addTimePoint);
excelRoute.route("/vendordropdown").post(getvendorDropdwons);
excelRoute.route("/categorydowns").post(getCategoryDropdwons);
excelRoute.route("/subcategorydropdowns").post(getSubCategoryDropdwons);
excelRoute.route("/getoverallbulkdeletetimepoints").post(getOverallBulkDelete);
excelRoute
  .route("/timepoint/:id")
  .get(getSingleTimePoint)
  .put(updateTimePoint)
  .delete(deleteTimePoint);
excelRoute.route("/timepoints/projectcheck").post(getprojectchecktimepoints);
excelRoute.route("/timepoints/categorycheck").post(getcategorychecktimepoints);
excelRoute
  .route("/timepoints/subcategorycheck")
  .post(getsubcategorychecktimepoints);
excelRoute.route("/vendor/timepointcheck").post(getAllTimepointsdelete);
excelRoute
  .route("/checkeditexceldatastimepoint")
  .post(getCategorySubcategoryEdit);
excelRoute.route("/categorysubcategorytime").post(getAllCategorySubCategory);

// vacancy position
const {
  getAllApproveVacancies,
  addApproveVacancies,
  updateApproveVacancies,
  getSingleApproveVacancies,
  deleteApproveVacancies,
} = require("../controller/modules/recruitment/vacancyposition");
excelRoute.route("/approveds").get(getAllApproveVacancies);
excelRoute.route("/approved/new").post(addApproveVacancies);
excelRoute
  .route("/approved/:id")
  .get(getSingleApproveVacancies)
  .put(updateApproveVacancies)
  .delete(deleteApproveVacancies);

// role and responsibilities
const {
  addRoleandresponsibilities,
  getAllRoleandresponsibilities,
  updateRoleandresponsibilities,
  deleteRoleandresponsibilities,
  getSingleRoleandresponsibilities,
} = require("../controller/modules/recruitment/roleandresponse");
excelRoute
  .route("/allroleandresponsibilities")
  .get(getAllRoleandresponsibilities);
excelRoute.route("/roleandresponsibile/new").post(addRoleandresponsibilities);
excelRoute
  .route("/roleandresponsibile/:id")
  .get(getSingleRoleandresponsibilities)
  .put(updateRoleandresponsibilities)
  .delete(deleteRoleandresponsibilities);

// jobopenings
const {
  addJobOpen,
  getAllJobOpen,
  Jobfilter,
  updateJobOpen,
  deleteJobOpening,
  getSingleJobopen,
  getOnprogressAllJobOpen, getWwithoutClosedAllJobOpen, getAssignChecklistAllJobOpen, getAllJobOpenRegister
} = require("../controller/modules/recruitment/jobopenings");
excelRoute.route("/alljobopenings").get(getAllJobOpen);
excelRoute.route("/assignchecklistalljobopenings").post(getAssignChecklistAllJobOpen);
excelRoute.route("/jobopenregister").post(getAllJobOpenRegister);
excelRoute.route("/withoutclosedjobopenings").get(getWwithoutClosedAllJobOpen);
excelRoute.route("/onprogressjobopenings").get(getOnprogressAllJobOpen);
excelRoute.route("/jobfilters").post(Jobfilter);
excelRoute.route("/jobopening/new").post(addJobOpen);
excelRoute
  .route("/jobopening/:id")
  .get(getSingleJobopen)
  .put(updateJobOpen)
  .delete(deleteJobOpening);

const {
  getcandidatesAll,
  getAllDatabyAge_location,
  getAllCandidates,
  addCandidates,
  updateCandidates,
  getSingleCandidates,
  deleteCandidates,
  updateCandidatesRole,
  candidateScreening,
  getcandidatesAllByRestricted,
  getinterviewcandidatesAll,
  resumeManagementAllCandiate,
  resumeManagementFilterWithPagination,
  skipedCandidates,
  getActiveAllCandidates,
  candidateFileUpload,
  getTodayAllCandidates,
  canidateStatusFilter, getUniqueDataCandidates, getAllCandidateCount, getVisitorcandidatesAll, getAllFieldNames, checkAllCandidatesEmptyFields, getRejectedCandidates, checkCandidateEmptyFields
} = require("../controller/modules/recruitment/addcandidate");
excelRoute.route("/candidates").post(getAllCandidates);
excelRoute.route("/activecandidates").post(getActiveAllCandidates);
excelRoute.route("/allcandidatescount").get(getAllCandidateCount);
excelRoute.route("/candidatesmissingfields").get(checkCandidateEmptyFields);
excelRoute.route("/rejectedcandidates").get(getRejectedCandidates);
excelRoute.route("/getuniquedatacandidates").post(getUniqueDataCandidates);
excelRoute.route("/candidatesafieldsfilter").post(checkAllCandidatesEmptyFields);
excelRoute.route("/todaycandidates").post(getTodayAllCandidates);
excelRoute.route("/candidatesallfields").get(getAllFieldNames);
excelRoute.route("/ageandlocationfilter").post(getAllDatabyAge_location);
excelRoute.route("/candidatestatusfilter").post(canidateStatusFilter);
excelRoute.route("/canidatescreening").post(candidateScreening);
excelRoute.route("/candidatesbyrestricted").get(getcandidatesAllByRestricted);
excelRoute.route("/allcandidates").get(getcandidatesAll);
excelRoute.route("/allvisitorcandidates").get(getVisitorcandidatesAll);
excelRoute.route("/candidate/new").post(addCandidates);
excelRoute.route("/allinterviewcandidates").get(getinterviewcandidatesAll);
excelRoute
  .route("/candidate/:id")
  .get(getSingleCandidates)
  .put(updateCandidates)
  .delete(deleteCandidates);
excelRoute.route("/updatecandidaterole/:id").put(updateCandidatesRole);
excelRoute
  .route("/resumemanagementsortedcandidates")
  .post(resumeManagementAllCandiate);
excelRoute
  .route("/resumemanagementfilteredcandidates")
  .post(resumeManagementFilterWithPagination);
excelRoute.route("/skippedcandidates").post(skipedCandidates);
excelRoute.route("/candidatefileuploadusinglink").post(candidateFileUpload);



// role and responsibilities
const {
  addRoleandresponsibilitiesCat,
  getAllRoleandresponsibilitiesCat,
  updateRoleandresponsibilitiesCat,
  deleteRoleandresponsibilitiesCat,
  getSingleRoleandresponsibilitiesCat,
} = require("../controller/modules/recruitment/rolesandresponsibilitycategory");
excelRoute
  .route("/rolesndresponsecategorys")
  .get(getAllRoleandresponsibilitiesCat);
excelRoute
  .route("/rolesndresponsecategory/new")
  .post(addRoleandresponsibilitiesCat);
excelRoute
  .route("/rolesndresponsecategory/:id")
  .get(getSingleRoleandresponsibilitiesCat)
  .put(updateRoleandresponsibilitiesCat)
  .delete(deleteRoleandresponsibilitiesCat);

// role of responsibilities new
const {
  addRoleandres,
  getAllRoleandres,
  updateRoleandres,
  deleteRoleandres,
  getSingleRoleandres,
} = require("../controller/modules/recruitment/rolesofresponse");
excelRoute.route("/rolesndresponses").get(getAllRoleandres);
excelRoute.route("/rolesndres/new").post(addRoleandres);
excelRoute
  .route("/rolesndres/:id")
  .get(getSingleRoleandres)
  .put(updateRoleandres)
  .delete(deleteRoleandres);

const {
  adddesignationrequirement,
  getAllDesignationRequirement,
  getJobOpeningsDesignation,
  getDesignationManpowerFilter,
  updatedesignationrequirement,
  getSingledesignationRequirement,
  deletedesignationrequirement,
} = require("../controller/modules/recruitment/designationrequirement");

excelRoute.route("/designationrequirements").get(getAllDesignationRequirement);
excelRoute.route("/jobopeningdesignation").post(getJobOpeningsDesignation);
excelRoute.route("/designationrequirement/new").post(adddesignationrequirement);
excelRoute
  .route("/designationmanpowerfilter")
  .post(getDesignationManpowerFilter);
excelRoute
  .route("/designationrequirement/:id")
  .get(getSingledesignationRequirement)
  .put(updatedesignationrequirement)
  .delete(deletedesignationrequirement);

const {
  getAllDepartmentgrouping,
  addDepartmentgrouping,
  deleteDepartmentgrouping,
  updateDepartmentgrouping,
  getSingleDepartmentgrouping,
} = require("../controller/modules/recruitment/departmentgrouping");
excelRoute.route("/departmentgroupings").get(getAllDepartmentgrouping);
excelRoute.route("/departmentgrouping/new").post(addDepartmentgrouping);
excelRoute
  .route("/departmentgrouping/:id")
  .delete(deleteDepartmentgrouping)
  .get(getSingleDepartmentgrouping)
  .put(updateDepartmentgrouping);

//resume mail attachments
const { getAllResumemailattachment, deleteResumemailattachment, updateResumemailattachment, getSingleResumemailattachment, addResumemailattachment } = require("../controller/modules/recruitment/resumemailattachments");
excelRoute.route("/resumemailattachments").get(getAllResumemailattachment);
excelRoute.route("/resumemailattachments/new").post(addResumemailattachment);
excelRoute
  .route("/resumemailattachments/:id")
  .delete(deleteResumemailattachment)
  .get(getSingleResumemailattachment)
  .put(updateResumemailattachment);


// connect Candidate Document controller..

const { getAllCandidatedocument, addCandidatedocument, updateCandidatedocument, getSingleCandidatedocument, deleteCandidatedocument } = require("../controller/modules/recruitment/candidatedocument");
excelRoute.route("/candidatedocuments").get(getAllCandidatedocument);
excelRoute.route("/candidatedocument/new").post(addCandidatedocument);
excelRoute.route("/candidatedocument/:id").get(getSingleCandidatedocument).put(updateCandidatedocument).delete(deleteCandidatedocument);

module.exports = excelRoute;