const express = require("express");
const companyRoute = express.Router();
// connect company controller..
const { getAllCompany, addCompany, getOverallAllCompany, getAllAllCompanyCheck, getAllCompanyAccess, getAllAddCompanyLimit, updateCompany, getSingleCompany, deleteCompany } = require("../controller/modules/setup/company");
companyRoute.route("/companies").get(getAllCompany);
companyRoute.route("/compaineslimit").get(getAllAddCompanyLimit);
companyRoute.route("/company/new").post(addCompany);
companyRoute.route("/getoverallcompany").post(getOverallAllCompany);
companyRoute.route("/companyaccess").post(getAllCompanyAccess);
companyRoute.route("/company/:id").get(getSingleCompany).put(updateCompany).delete(deleteCompany);
companyRoute.route("/companydelete").post(getAllAllCompanyCheck);
//companydomain
const { getAllCompanydomain, updateCompanydomain, addCompanydomain, deleteCompanydomain, getSingleCompanydomain } = require("../controller/modules/companydomain");
companyRoute.route("/companydomain/new").post(addCompanydomain);
companyRoute.route("/companydomain").post(getAllCompanydomain);
companyRoute.route("/companydomain/:id").get(getSingleCompanydomain).put(updateCompanydomain).delete(deleteCompanydomain);


// Hirerarchy
// Hirerarchy
const { getDesignationControl, getLocationwiseFilter, getAllReportingToDesignationUserHierarchyRelation, getAllReportingToUserHierarchyRelation, getNotAssignHierarchyDataBackend, getAllNoticeHierarchyList, getAllHierarchyDesignationLogRelations, getAllHierarchyProcessTeamRelations, getAllHierarchyReportingTo, getAllHierarchyListSalary, getBranchWiseunit, getAllHierarchyTeamAndDesignation, getNotAssignHierarchyData, checkHierarchyAddNewEmp, hierarchyEditMatchcheck, getAllUserWiseFilteredit, checkHierarchyEditEmpDetails, checkHierarchyEditEmpDetailsDesignation, getUnitwiseTeam, getAllUserWiseFilter, getAllHirerarchi, addHirerarchi, getSingleHirerarchi, updateHirerarchi, deleteHirerarchi } = require("../controller/modules/setup/hierarchy");
companyRoute.route("/locationwiseall").post(getLocationwiseFilter);
companyRoute.route("/branchwiseunit").post(getBranchWiseunit);
companyRoute.route("/unitwiseteam").post(getUnitwiseTeam);
companyRoute.route("/userwisefilter").post(getAllUserWiseFilter);
companyRoute.route("/hirerarchi/new").post(addHirerarchi);
companyRoute.route("/designationcontname").post(getDesignationControl);
companyRoute.route("/hirerarchies").get(getAllHirerarchi);
companyRoute.route("/notassignhierarchylistdatabackend").post(getNotAssignHierarchyDataBackend);
companyRoute.route("/hirerarchi/:id").get(getSingleHirerarchi).put(updateHirerarchi).delete(deleteHirerarchi);
companyRoute.route("/checkhierarchyaddnewemp").post(checkHierarchyAddNewEmp);
companyRoute.route("/hierarchyeditmatchcheck").post(hierarchyEditMatchcheck);
companyRoute.route("/userwisefilteredit").post(getAllUserWiseFilteredit);
companyRoute.route("/hierarchydesignationlogrelation").post(getAllHierarchyDesignationLogRelations);
companyRoute.route("/hierarchyprocessteamrelation").post(getAllHierarchyProcessTeamRelations);
companyRoute.route("/noticehierarchylist").post(getAllNoticeHierarchyList);
companyRoute.route("/hierarchyteamdesignationcheck").post(getAllHierarchyTeamAndDesignation);
companyRoute.route("/checkhierarchyeditempdetails").post(checkHierarchyEditEmpDetails);
companyRoute.route("/hierarchyreportingtousers").post(getAllHierarchyReportingTo);
companyRoute.route("/checkhierarchyeditempdetailsdesig").post(checkHierarchyEditEmpDetailsDesignation);
companyRoute.route("/notassignhierarchylistdata").get(getNotAssignHierarchyData);
companyRoute.route("/getallhierarchylistsalary").post(getAllHierarchyListSalary);
companyRoute.route("/reportingtouserhierarchyrelation").post(getAllReportingToUserHierarchyRelation);
companyRoute.route("/reportingtodesignationuserhierarchyrelation").post(getAllReportingToDesignationUserHierarchyRelation);


const { getAllDocCategory, getSingleDocCategory, addDocCategory, updateDocCategory, getOverAllEditDocuments, deleteocumentCategory } = require("../controller/modules/documents/documentcategory");
companyRoute.route("/documentcategories").get(getAllDocCategory);
companyRoute.route("/documentcategory/new").post(addDocCategory);
companyRoute.route("/documentcategory/:id").get(getSingleDocCategory).put(updateDocCategory).delete(deleteocumentCategory);
companyRoute.route("/overalldocumentedit").post(getOverAllEditDocuments);

const { getAllDocument, addDocument, getAllassignedDocument, getSingleDocument, getAllDocumentTraining, updateDocument, deleteDocument, getAllDocumentcategoryCheck } = require("../controller/modules/documents/adddocument");
companyRoute.route("/documents").get(getAllDocument);
companyRoute.route("/alldocumentassigned").post(getAllassignedDocument);
companyRoute.route("/documentstraining").get(getAllDocumentTraining);
companyRoute.route("/documents/new").post(addDocument);
companyRoute.route("/documentscategorydelete").post(getAllDocumentcategoryCheck);
companyRoute.route("/document/:id").get(getSingleDocument).put(updateDocument).delete(deleteDocument);


const {
  addAssignDocument,
  deleteAssignDocument,
  getAllAssignDocument,
  getSingleAssignDocument,
  updateAssignDocument,
} = require("../controller/modules/documents/assigndocuments");
companyRoute.route("/allassigndocument").get(getAllAssignDocument);
companyRoute.route("/assigndocument/new").post(addAssignDocument);
companyRoute
  .route("/assigndocument/:id")
  .get(getSingleAssignDocument)
  .put(updateAssignDocument)
  .delete(deleteAssignDocument);


// connect Notice period apply form controller
const { getAllNoticeperiodapply, addNoticeperiodapply, getAllChecklistNoticeperiodapply, getAllNoticeperiodapplyByAssignBranch, getNoticeperiodapplyForLeave, updateNoticeperiodapply, getSingleNoticeperiodapply, deleteNoticeperiodapply } = require("../controller/modules/recruitment/noticeperiodapply");
companyRoute.route("/noticeperiodapplies").get(getAllNoticeperiodapply);
companyRoute.route("/noticeperiodapply/new").post(addNoticeperiodapply);
companyRoute.route("/noticeperiodappliesforleave").post(getNoticeperiodapplyForLeave);
companyRoute.route("/noticeperiodapply/:id").get(getSingleNoticeperiodapply).put(updateNoticeperiodapply).delete(deleteNoticeperiodapply);
companyRoute.route("/checklistnoticeperiodapplies").get(getAllChecklistNoticeperiodapply);
companyRoute.route("/noticeperiodappliesbyassignbranch").post(getAllNoticeperiodapplyByAssignBranch);

const { addScheduleEvents, deleteScheduleEvents, getAllScheduleEventsHome, getAllScheduleEventsFilter, getAllScheduleEvents, getTeam, getUnit, getSingleScheduleEvents, updateScheduleEvents, getParticipants } = require("../controller/modules/setup/EventsController");
companyRoute.route("/allscheduleevents").post(getAllScheduleEvents);
companyRoute.route("/allscheduleeventshome").post(getAllScheduleEventsHome);
companyRoute.route("/scheduleevent/new").post(addScheduleEvents);
companyRoute.route("/scheduleevent/:id").delete(deleteScheduleEvents).get(getSingleScheduleEvents).put(updateScheduleEvents);
companyRoute.route("/getunitbybranch").post(getUnit);
companyRoute.route("/getteambybranchandunit").post(getTeam);
companyRoute.route("/getparticipants").post(getParticipants);
companyRoute.route("/eventallfilter").post(getAllScheduleEventsFilter);


//schedule meeting
const {
  addScheduleMeeting,
  getNoticePeriodScheduleMeeting,
  deleteScheduleMeeting,
  getAllScheduleMeeting,
  ScheduleMeetingFilter,
  getAllScheduleMeetingFilter,
  getSingleScheduleMeeting,
  updateScheduleMeeting,
  getBranchWiseDept,
  getBranchAndDeptWiseTeam,
  getParticipantsbyteam,
  getSingleScheduleMeetingLog,
  deleteMultipleScheduleMeeting, ScheduleMeetingFilterHome,
} = require("../controller/modules/setup/schedulemeeting");
companyRoute.route("/getdeptbybranch").post(getBranchWiseDept);
companyRoute.route("/getteambybranchanddept").post(getBranchAndDeptWiseTeam);
companyRoute.route("/getparticipantsformeeting").post(getParticipantsbyteam);
companyRoute.route("/allschedulemeetings").post(getAllScheduleMeeting);
companyRoute.route("/schedulemeeting/new").post(addScheduleMeeting);
companyRoute
  .route("/schedulemeeting/:id")
  .delete(deleteScheduleMeeting)
  .get(getSingleScheduleMeeting)
  .put(updateScheduleMeeting);
companyRoute
  .route("/deletemultipleschedulemeeting/:id")
  .delete(deleteMultipleScheduleMeeting);
companyRoute.route("/schedulemeetinglog/:id").get(getSingleScheduleMeetingLog);
companyRoute.route("/schedulemeetingfilter").post(getAllScheduleMeetingFilter);
companyRoute.route("/schedulemeetingfilterpage").post(ScheduleMeetingFilter);
companyRoute.route("/schedulemeetingfilterpagehome").post(ScheduleMeetingFilterHome);
companyRoute
  .route("/singlenoticeperiodmeeting/:id")
  .get(getNoticePeriodScheduleMeeting);

//Holiday route
const { addHoliday, deleteHoliday, getAllHoliday, todayHolidayFilter, getSingleHoliday, updateHoliday, HolidayFilter } = require("../controller/modules/setup/holidayController");
companyRoute.route("/holidays").post(getAllHoliday);
companyRoute.route("/todayholidayfilter").get(todayHolidayFilter);
companyRoute.route("/holiday/new").post(addHoliday);
companyRoute.route("/holiday/:id").delete(deleteHoliday).get(getSingleHoliday).put(updateHoliday);
companyRoute.route("/holidayfilter").post(HolidayFilter);

//  connect control criteria controller
const { getAllControlcriteria, getSingleControlcriteria, addControlcriteria, updateControlcriteria, deleteControlcriteria } = require("../controller/modules/setup/controlcriteria");
companyRoute.route("/controlcriterias").get(getAllControlcriteria);
companyRoute.route("/controlcriteria/new").post(addControlcriteria);
companyRoute.route("/controlcriteria/:id").get(getSingleControlcriteria).put(updateControlcriteria).delete(deleteControlcriteria);

//professional tax master backend route

const { addProfessionalTaxMaster, deleteProfessionalTaxMaster, ProfessionalTaxMasterSortByAssignBranch, getAllProfessionalTaxMasterByAssignBranch, ProfessionalTaxMasterSort, getAllProfessionalTaxMaster, getSingleProfessionalTaxMaster, updateProfessionalTaxMaster } = require("../controller/modules/setup/ProfessionalTaxMasterController");
companyRoute.route("/professionaltaxmasters").get(getAllProfessionalTaxMaster);
companyRoute.route("/professionaltaxmaster/new").post(addProfessionalTaxMaster);
companyRoute.route("/professionaltaxmastersort").post(ProfessionalTaxMasterSort);
companyRoute.route("/professionaltaxmaster/:id").delete(deleteProfessionalTaxMaster).get(getSingleProfessionalTaxMaster).put(updateProfessionalTaxMaster);
companyRoute.route("/professionaltaxmastersbyassignbranch").post(getAllProfessionalTaxMasterByAssignBranch);
companyRoute.route("/professionaltaxmastersortbyassignbranch").post(ProfessionalTaxMasterSortByAssignBranch);
//salary slab route
const { getAllSalarySlabExport, addSalarySlab, deleteSalarySlab, salarySlabFilter, getsalarySlabListExcelDownload, getsalarySlabListCsvDownload, getAllSalarySlabListPdflDownload,
  getsalarySlabSearchExcelDownload, getsalarySlabSearchCsvDownload, getAllSalarySlabSearchPdflDownload,
  salarySlabFilterAssignbranchHome, salarySlabFilterAssignbranch, getsalarySlabProcessFilterSortByAssignBranch, getAllSalarySlabListFilter, getsalarySlabProcessFilterSort, getsalarySlabProcessFilter, getAllSalarySlab, getSingleSalarySlab, updateSalarySlab } = require("../controller/modules/setup/SalarySlabController");
companyRoute.route("/salaryslabs").get(getAllSalarySlab);
companyRoute.route("/salaryslab/new").post(addSalarySlab);
companyRoute.route("/salaryslablimitedassignbranch").post(salarySlabFilterAssignbranch);
companyRoute.route("/salaryslablimitedassignbranchhome").post(salarySlabFilterAssignbranchHome);
companyRoute.route("/salaryslab/:id").delete(deleteSalarySlab).get(getSingleSalarySlab).put(updateSalarySlab);
companyRoute.route("/salaryslablimited").get(salarySlabFilter);
companyRoute.route("/salaryslablistfilter").post(getAllSalarySlabListFilter);
companyRoute.route("/salaryslabprocessfilter").post(getsalarySlabProcessFilter);
companyRoute.route("/salaryslabprocessfiltersort").post(getsalarySlabProcessFilterSort);
companyRoute.route("/salaryslabprocessfiltersortbyassignbranch").post(getsalarySlabProcessFilterSortByAssignBranch);
companyRoute.route("/salaryslabexport").post(getAllSalarySlabExport);

companyRoute.route("/salaryslabsearchexceldownload").post(getsalarySlabSearchExcelDownload);
companyRoute.route("/salaryslabsearchcsvdownload").post(getsalarySlabSearchCsvDownload);
companyRoute.route("/salaryslabsearchpdfdownload").post(getAllSalarySlabSearchPdflDownload);

companyRoute.route("/salaryslablistexceldownload").post(getsalarySlabListExcelDownload);
companyRoute.route("/salaryslablistcsvdownload").post(getsalarySlabListCsvDownload);
companyRoute.route("/salaryslablistpdfdownload").post(getAllSalarySlabListPdflDownload);



//File Access route
const { addFileAccess, deleteFileAccess, getAllFileAccess, getSingleFileAccess, updateFileAccess } = require("../controller/modules/setup/announcement/FileAccessController");
companyRoute.route("/fileaccesss").get(getAllFileAccess);
companyRoute.route("/fileaccess/new").post(addFileAccess);
companyRoute.route("/fileaccess/:id").delete(deleteFileAccess).get(getSingleFileAccess).put(updateFileAccess);

//File Share route
const { addFileShare, deleteFileShare, getAllFileShare, getSingleFileShare, updateFileShare } = require("../controller/modules/setup/announcement/FileShareController");
companyRoute.route("/fileshares").get(getAllFileShare);
companyRoute.route("/fileshare/new").post(addFileShare);
companyRoute.route("/singlefilshare/:id").delete(deleteFileShare).get(getSingleFileShare).put(updateFileShare);

//Announcement Category route
//Announcement Category route
const {
  addAnnouncementCategory,
  deleteAnnouncementCategory,
  getAllAnnouncementCategory,
  getSingleAnnouncementCategory,
  updateAnnouncementCategory,
  overallBulkDeleteAnnouncementCategory,
  overallDeleteAnnouncementCategory,
  overallEditAnnouncementCategory,
} = require("../controller/modules/setup/announcement/AnnouncementCategoryController");
companyRoute.route("/announcementcategorys").get(getAllAnnouncementCategory);
companyRoute.route("/announcementcategory/new").post(addAnnouncementCategory);
companyRoute
  .route("/announcementcategory/:id")
  .delete(deleteAnnouncementCategory)
  .get(getSingleAnnouncementCategory)
  .put(updateAnnouncementCategory);
companyRoute
  .route("/overalldelete/announcementcategory")
  .post(overallDeleteAnnouncementCategory);
companyRoute
  .route("/overalledit/announcementcategory")
  .put(overallEditAnnouncementCategory);
companyRoute
  .route("/overallbulkdelete/announcementcategory")
  .post(overallBulkDeleteAnnouncementCategory);

//Announcement route
const { addAnnouncement, deleteAnnouncement, getAllAnnouncement, getSingleAnnouncement, updateAnnouncement } = require("../controller/modules/setup/announcement/AnnouncementController");
companyRoute.route("/announcements").post(getAllAnnouncement);
companyRoute.route("/announcement/new").post(addAnnouncement);
companyRoute.route("/announcement/:id").delete(deleteAnnouncement).get(getSingleAnnouncement).put(updateAnnouncement);

//List of Document route
const { addListofdocument, deleteListofdocument, getAllListofdocument, getSingleListofdocument, updateListofdocument } = require("../controller/modules/documents/listdocuments");
companyRoute.route("/listofdocuments").get(getAllListofdocument);
companyRoute.route("/listofdocument/new").post(addListofdocument);
companyRoute.route("/listofdocument/:id").delete(deleteListofdocument).get(getSingleListofdocument).put(updateListofdocument);

// Document Grouping route
const { addDocumentgrouping, deleteDocumentgrouping, getAllDocumentgrouping, getSingleDocumentgrouping, updateDocumentgrouping } = require("../controller/modules/documents/documentsgrouping");
companyRoute.route("/documentgroupings").get(getAllDocumentgrouping);
companyRoute.route("/documentgrouping/new").post(addDocumentgrouping);
companyRoute.route("/documentgrouping/:id").delete(deleteDocumentgrouping).get(getSingleDocumentgrouping).put(updateDocumentgrouping);

// connect Assignedby form controller

const { getAllAssignedBy, updateAssignedby, addAssignedby, getOverallAssignedBySort, deleteAssignedby, getSingleAssignedby } = require("../controller/modules/othertask/assignedby");
companyRoute.route("/assignedby").get(getAllAssignedBy);
companyRoute.route("/assignedby/new").post(addAssignedby);
companyRoute.route("/assignedbysort").post(getOverallAssignedBySort);
companyRoute.route("/assignedby/:id").get(getSingleAssignedby).put(updateAssignedby).delete(deleteAssignedby);

// connect Manageassignedmode form controller

const { getAllManageassignedmode, deleteManageassignedmode, getOverallManageassignedmodeSort, addManageassignedmode, updateManageassignedmode, getSingleManageassignedmode } = require("../controller/modules/othertask/manageassignedmode");
companyRoute.route("/manageassignedmode").get(getAllManageassignedmode);
companyRoute.route("/manageassignedmode/new").post(addManageassignedmode);
companyRoute.route("/manageassignedmode/:id").get(getSingleManageassignedmode).put(updateManageassignedmode).delete(deleteManageassignedmode);
companyRoute.route("/manageassignedsort").post(getOverallManageassignedmodeSort);
// connect manageothertask form controller

const { getAllManageothertask,
  getOverallOthertaskConsolidatedReportSummary,
  getOverallOthertaskSort, getOverallOthertaskView, getOverallOthertaskConsolidatedReport, getOverallOthertaskIndividualReport, deleteManageothertask, getOverallOthertaskSortFlag, getOverallOthertaskEmployeeSort, getOverallOthertaskCompanySort, addManageothertask, updateManageothertask, getSingleManageothertask } = require("../controller/modules/othertask/othhertask");
companyRoute.route("/manageothertasks").get(getAllManageothertask);
companyRoute.route("/manageothertask/new").post(addManageothertask);
companyRoute.route("/manageothertask/:id").get(getSingleManageothertask).put(updateManageothertask).delete(deleteManageothertask);
companyRoute.route("/othertasksort").post(getOverallOthertaskSort);
companyRoute.route("/othertasksortcompany").post(getOverallOthertaskCompanySort);
companyRoute.route("/othertasksortemployee").post(getOverallOthertaskEmployeeSort);
companyRoute.route("/othertasksortflag").post(getOverallOthertaskSortFlag);
companyRoute.route("/othertasksortview").post(getOverallOthertaskView);
companyRoute.route("/othertaskconsolidatedreport").post(getOverallOthertaskConsolidatedReport);
companyRoute.route("/othertaskconsolidatedreportsummary").post(getOverallOthertaskConsolidatedReportSummary);
companyRoute.route("/othertaskindividualreport").post(getOverallOthertaskIndividualReport);

// connect Departmentanddesignationgrouping form controller 

const { getAllDepartmentanddesignationgrouping, getSingleDepartmentanddesignationgrouping, addDepartmentanddesignationgrouping, updateDepartmentanddesignationgrouping, deleteDepartmentanddesignationgrouping } = require("../controller/modules/departmentanddesignationgrouping");
companyRoute.route("/departmentanddesignationgroupings").get(getAllDepartmentanddesignationgrouping);
companyRoute.route("/departmentanddesignationgrouping/new").post(addDepartmentanddesignationgrouping);
companyRoute.route("/departmentanddesignationgrouping/:id").get(getSingleDepartmentanddesignationgrouping).put(updateDepartmentanddesignationgrouping).delete(deleteDepartmentanddesignationgrouping);

// connect Departmentmontsetauto controller
const { getAllDeptmonthsetauto, getSingleDeptmonthsetauto, getAllDepMonthAutoByPagination, addDeptmonthsetauto, updateDeptmonthsetauto, deleteDeptmonthsetauto } = require("../controller/modules/departmentmonthsetauto");
companyRoute.route("/deptmonthsetautos").get(getAllDeptmonthsetauto);
companyRoute.route("/deptmonthsetauto/new").post(addDeptmonthsetauto);
companyRoute.route("/deptmonthsetautobypagination").post(getAllDepMonthAutoByPagination);
companyRoute.route("/deptmonthsetauto/:id").get(getSingleDeptmonthsetauto).put(updateDeptmonthsetauto).delete(deleteDeptmonthsetauto);

// connect Designation and control grouping form controller 

const { getAllDesignationandcontrolgrouping, getSingleDesignationandcontrolgrouping, getAllControlNamesBasedOnHierarchy, addDesignationandcontrolgrouping, updateDesignationandcontrolgrouping, deleteDesignationandcontrolgrouping } = require("../controller/modules/designationandcontrolgrouping");
companyRoute.route("/designationandcontrolgroupings").get(getAllDesignationandcontrolgrouping);
companyRoute.route("/controlnamesbasedondesignation").post(getAllControlNamesBasedOnHierarchy);
companyRoute.route("/designationandcontrolgrouping/new").post(addDesignationandcontrolgrouping);
companyRoute.route("/designationandcontrolgrouping/:id").get(getSingleDesignationandcontrolgrouping).put(updateDesignationandcontrolgrouping).delete(deleteDesignationandcontrolgrouping);

module.exports = companyRoute;
