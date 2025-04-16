const express = require("express");
const ticketsRoute = express.Router();

// connect add category ticket form controller

const { getAllTicketCategory, getSingleTicketCategory, addTicketCategory, getOverallEditCategory, getOverallBulkDeleteCategory, getOverallDeleteCategory, updateTicketCategory, deleteTicketCategory } = require("../controller/modules/tickets/addcategoryticket");
ticketsRoute.route("/ticketcategories").get(getAllTicketCategory);
ticketsRoute.route("/ticketcategory/new").post(addTicketCategory);
ticketsRoute.route("/overalleditcategorymasters").post(getOverallEditCategory);
ticketsRoute.route("/overalldeletecategorymasters").post(getOverallDeleteCategory);
ticketsRoute.route("/overallBulkdeletecategorymasters").post(getOverallBulkDeleteCategory);
ticketsRoute.route("/ticketcategory/:id").get(getSingleTicketCategory).put(updateTicketCategory).delete(deleteTicketCategory);

// connect typemaster form controller

const { getAllTypemaster, getSingleTypemaster, addTypemaster, getoverallTypeGroupmaster, getoverallBulkTypemasterDelete, getoverallBulkTypeGroupDelete, getoverallTypeGroupDelete, updateTypemaster, getoverallTypemasterDelete, getoverallTypemaster, deleteTypemaster } = require("../controller/modules/tickets/typemaster");
ticketsRoute.route("/typemasters").get(getAllTypemaster);
ticketsRoute.route("/typemaster/new").post(addTypemaster);
ticketsRoute.route("/overalledittypemasters").post(getoverallTypemaster);
ticketsRoute.route("/overalledittypemastersdelete").post(getoverallTypemasterDelete);
ticketsRoute.route("/overalleditBulktypemastersdelete").post(getoverallBulkTypemasterDelete);
ticketsRoute.route("/overalledittypegroupmasters").post(getoverallTypeGroupmaster);
ticketsRoute.route("/overalldeletetypegroupmasters").post(getoverallTypeGroupDelete);
ticketsRoute.route("/overallBulkdeletetypegroupmasters").post(getoverallBulkTypeGroupDelete);
ticketsRoute.route("/typemaster/:id").get(getSingleTypemaster).put(updateTypemaster).delete(deleteTypemaster);

// connect reasonmaster form controller

const { getAllReasonmaster, getSingleReasonmaster, addReasonmaster, overallBulkreasonmastersdelete, getoverallReasonmasterDelete, getoverallReasonmaster, updateReasonmaster, deleteReasonmaster } = require("../controller/modules/tickets/reasonmaster");
ticketsRoute.route("/reasonmasters").get(getAllReasonmaster);
ticketsRoute.route("/reasonmaster/new").post(addReasonmaster);
ticketsRoute.route("/overalleditreasonmasters").post(getoverallReasonmaster);
ticketsRoute.route("/overalleditreasonmastersdelete").post(getoverallReasonmasterDelete);
ticketsRoute.route("/overallBulkreasonmastersdelete").post(overallBulkreasonmastersdelete);
ticketsRoute.route("/reasonmaster/:id").get(getSingleReasonmaster).put(updateReasonmaster).delete(deleteReasonmaster);

// connect meetingmaster form controller

const { getAllMeetingmaster, getSingleMeetingmaster, addMeetingmaster, updateMeetingmaster, deleteMeetingmaster } = require("../controller/modules/tickets/meetingmaster");
ticketsRoute.route("/meetingmasters").get(getAllMeetingmaster);
ticketsRoute.route("/meetingmaster/new").post(addMeetingmaster);
ticketsRoute.route("/meetingmaster/:id").get(getSingleMeetingmaster).put(updateMeetingmaster).delete(deleteMeetingmaster);

//status master name route
const { addStatusMaster, deleteStatusMaster, getAllStatusMaster, getSingleStatusMaster, updateStatusMaster } = require("../controller/modules/tickets/statusMasterController");
ticketsRoute.route("/statusmasters").get(getAllStatusMaster);
ticketsRoute.route("/statusmaster/new").post(addStatusMaster);
ticketsRoute.route("/statusmaster/:id").delete(deleteStatusMaster).get(getSingleStatusMaster).put(updateStatusMaster);

// connect checkpointticketmaster form controller

const { getAllCheckpointticketmaster, getSingleCheckpointticketmaster, addCheckpointticketmaster, updateCheckpointticketmaster, deleteCheckpointticketmaster } = require("../controller/modules/tickets/checkpointticketmaster");
ticketsRoute.route("/checkpointtickets").get(getAllCheckpointticketmaster);
ticketsRoute.route("/checkpointticket/new").post(addCheckpointticketmaster);
ticketsRoute.route("/checkpointticket/:id").get(getSingleCheckpointticketmaster).put(updateCheckpointticketmaster).delete(deleteCheckpointticketmaster);

// connect teamgrouping form controller

const { getAllTeamgrouping, getSingleTeamgrouping, usersTeamGrouping, addTeamgrouping, updateTeamgrouping, deleteTeamgrouping } = require("../controller/modules/tickets/teamgrouping");
ticketsRoute.route("/teamgroupings").get(getAllTeamgrouping);
ticketsRoute.route("/teamgrouping/new").post(addTeamgrouping);
ticketsRoute.route("/teamgrouping/:id").get(getSingleTeamgrouping).put(updateTeamgrouping).delete(deleteTeamgrouping);
ticketsRoute.route("/usersteamgrouping").post(usersTeamGrouping);

//raise ticket master route
const { addRaiseTicket, deleteRaiseTicket, getAllRaiseTicketLast, getAllRaiseTicketUserForwardedEmployee, getAllRaiseTicketForwardedEmployee, getAllRaiseTicketFilteredIndividualDatas,
    getAllRaiseTicketFilteredIndividualDatasHome,
    getAllRaiseTicketClosed, getAllRaiseTicketEditDuplication, getAllRaiseTicketOpen, getAllRaiseTicketWithoutClosed, getAllRaiseTicket, getAllTicketsReports, getAllTicketsReportsOverall, getAllRaiseTicketFilteredDatasOverall, getAllRaiseTicketFilteredDatas, getAllRaiseHierarchyFilter, getSingleRaiseTicket, updateRaiseTicket } = require("../controller/modules/tickets/raiseticketmaster");
ticketsRoute.route("/raisetickets").get(getAllRaiseTicket);
ticketsRoute.route("/raiseticketsopen").get(getAllRaiseTicketOpen);
ticketsRoute.route("/raiseticketsclosed").get(getAllRaiseTicketClosed);
ticketsRoute.route("/raiseticketseditduplicate").post(getAllRaiseTicketEditDuplication);
ticketsRoute.route("/raiseticket/new").post(addRaiseTicket);
ticketsRoute.route("/raiseticketswithoutclosed").get(getAllRaiseTicketWithoutClosed);
ticketsRoute.route("/raiseticketuserforwardedemployee").post(getAllRaiseTicketUserForwardedEmployee);
ticketsRoute.route("/raiseticketslast").get(getAllRaiseTicketLast);
ticketsRoute.route("/raisehierarchyforward").post(getAllRaiseHierarchyFilter);
ticketsRoute.route("/raiseticketsreports").post(getAllTicketsReports);
ticketsRoute.route("/raiseticketsreportsoverall").post(getAllTicketsReportsOverall);
ticketsRoute.route("/raiseticketindividualfilter").post(getAllRaiseTicketFilteredIndividualDatas);
ticketsRoute.route("/raiseticketindividualfilterhome").post(getAllRaiseTicketFilteredIndividualDatasHome);
ticketsRoute.route("/raiseticketfilter").post(getAllRaiseTicketFilteredDatas);
ticketsRoute.route("/raiseticketfilteroverall").post(getAllRaiseTicketFilteredDatasOverall);
ticketsRoute.route("/raiseticketforwardedemployee").post(getAllRaiseTicketForwardedEmployee);
ticketsRoute.route("/raiseticket/:id").delete(deleteRaiseTicket).get(getSingleRaiseTicket).put(updateRaiseTicket);




const { getAllTicketMasterType, getSingleTicketMasterType, addTicketMasterType, updateTicketMasterType, deleteTicketMasterType } = require("../controller/modules/tickets/typeticketmaster");
ticketsRoute.route("/ticketmastertypes").get(getAllTicketMasterType);
ticketsRoute.route("/ticketmastertype/new").post(addTicketMasterType);
ticketsRoute.route("/ticketmastertype/:id").get(getSingleTicketMasterType).put(updateTicketMasterType).delete(deleteTicketMasterType);

// connect duedatemaster form controller

const { getAllDuedatemaster, getSingleDuedatemaster, addDuedatemaster, getOverallBulkDuedateDelete, getOverallDuedateEdit, getOverallDuedateDelete, updateDuedatemaster, deleteDuedatemaster } = require("../controller/modules/tickets/duedatemaster");
ticketsRoute.route("/duedatemasters").get(getAllDuedatemaster);
ticketsRoute.route("/duedatemaster/new").post(addDuedatemaster);
ticketsRoute.route("/overalleditduedatemasters").post(getOverallDuedateEdit);
ticketsRoute.route("/overalldeleteduedatemasters").post(getOverallDuedateDelete);
ticketsRoute.route("/overallBulkdeleteduedatemasters").post(getOverallBulkDuedateDelete);
ticketsRoute.route("/duedatemaster/:id").get(getSingleDuedatemaster).put(updateDuedatemaster).delete(deleteDuedatemaster);

//connect priority master

const { getAllPrioritymaster, getSinglePrioritymaster, addPrioritymaster, getOverallBulkPrioritydelete, getOverallPriorityEdit, getOverallPrioritydelete, updatePrioritymaster, deletePrioritymaster } = require("../controller/modules/tickets/prioritymaster");
ticketsRoute.route("/prioritymastermasters").get(getAllPrioritymaster);
ticketsRoute.route("/prioritymastermaster/new").post(addPrioritymaster);
ticketsRoute.route("/overalldeleteprioritymasters").post(getOverallPrioritydelete);
ticketsRoute.route("/overallBulkdeleteprioritymasters").post(getOverallBulkPrioritydelete);
ticketsRoute.route("/overalleditprioritymasters").post(getOverallPriorityEdit);
ticketsRoute.route("/prioritymastermaster/:id").get(getSinglePrioritymaster).put(updatePrioritymaster).delete(deletePrioritymaster);

//self checkpoint ticket master route

const { addSelfCheckpointticketmaster, deleteSelfCheckpointticketmaster, getOverallSelfcheckdelete, getOverallBulkSelfcheckdelete, getAllSelfCheckpointticketmaster, getSingleSelfCheckpointticketmaster, updateSelfCheckpointticketmaster } = require("../controller/modules/tickets/SelfCheckPointTicketMasterController");
ticketsRoute.route("/selfcheckpointticketmasters").get(getAllSelfCheckpointticketmaster);
ticketsRoute.route("/selfcheckpointticketmaster/new").post(addSelfCheckpointticketmaster);
ticketsRoute.route("/overalldeleteselfcheckmasters").post(getOverallSelfcheckdelete);
ticketsRoute.route("/overallBulkdeleteselfcheckmasters").post(getOverallBulkSelfcheckdelete);
ticketsRoute.route("/selfcheckpointticketmaster/:id").get(getSingleSelfCheckpointticketmaster).put(updateSelfCheckpointticketmaster).delete(deleteSelfCheckpointticketmaster);

// / required fields  route
const { getAllRequiredFields, getSingleRequiredFields, addRequiredFields, getOverallBulkRequireddelete, getOverallRequireddelete, updateRequiredFields, deleteRequiredFields } = require("../controller/modules/tickets/requiredmaster");
ticketsRoute.route("/requiredfields").get(getAllRequiredFields);
ticketsRoute.route("/requiredfield/new").post(addRequiredFields);
ticketsRoute.route("/overalldeleterequiredmasters").post(getOverallRequireddelete);
ticketsRoute.route("/overallBulkdeleterequiredmasters").post(getOverallBulkRequireddelete);
ticketsRoute.route("/requiredfield/:id").get(getSingleRequiredFields).put(updateRequiredFields).delete(deleteRequiredFields);

const { getAllSubsubcomponent, getSingleSubsubcomponent, addSubsubcomponent, getoverallBulkSubsubcomponentDelete, getoverallSubsubcomponentDelete, getoverallSubsubcomponent, updateSubsubcomponent, deleteSubsubcomponent } = require("../controller/modules/tickets/subsubcategoryticket");
ticketsRoute.route("/subsubcategorytickets").get(getAllSubsubcomponent);
ticketsRoute.route("/subsubcategoryticket/new").post(addSubsubcomponent);
ticketsRoute.route("/overalleditsubsubcomponent").post(getoverallSubsubcomponent);
ticketsRoute.route("/overallsubsubcomponentdelete").post(getoverallSubsubcomponentDelete);
ticketsRoute.route("/overallBulksubsubcomponentdelete").post(getoverallBulkSubsubcomponentDelete);
ticketsRoute.route("/subsubcategoryticket/:id").get(getSingleSubsubcomponent).put(updateSubsubcomponent).delete(deleteSubsubcomponent);

//Asset Category Grouping route
const { getAllAssetcategorygrouping, getSingleAssetcategorygrouping, addAssetcategorygrouping, updateAssetcategorygrouping, deleteAssetcategorygroupingt } = require("../controller/modules/tickets/assetcategorygrouping");
ticketsRoute.route("/assetcategorygroupings").get(getAllAssetcategorygrouping);
ticketsRoute.route("/assetcategorygrouping/new").post(addAssetcategorygrouping);
ticketsRoute.route("/assetcategorygrouping/:id").get(getSingleAssetcategorygrouping).put(updateAssetcategorygrouping).delete(deleteAssetcategorygroupingt);



// resolverreason master
const { getAllResolverReasonmaster, addResolverReasonmaster, getSingleResolverReasonmaster, getoverallBulkResolverReasonmasterDelete, getoverallResolverReasonmasterEdit, getoverallResolverReasonmasterDelete, getAllResolverReasonFilter, updateResolverReasonmaster, deleteResolverReasonmaster } = require("../controller/modules/tickets/resolverreasonmaster");
ticketsRoute.route("/resolverreasonmaster").get(getAllResolverReasonmaster);
ticketsRoute.route("/resolverreasonmaster/new").post(addResolverReasonmaster);
ticketsRoute.route("/overallresolverreasonmastersdelete").post(getoverallResolverReasonmasterDelete);
ticketsRoute.route("/overallBulkresolverreasonmastersdelete").post(getoverallBulkResolverReasonmasterDelete);
ticketsRoute.route("/overalleditresolverreasonmasters").post(getoverallResolverReasonmasterEdit);
ticketsRoute.route("/resolverreasonmaster/:id").get(getSingleResolverReasonmaster).put(updateResolverReasonmaster).delete(deleteResolverReasonmaster);
ticketsRoute.route("/resolverreasonmasterfilter").post(getAllResolverReasonFilter)



module.exports = ticketsRoute;