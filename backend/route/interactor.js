const express = require("express");
const interactorRoute = express.Router();


//interactor type  route
const { getAllInteractorType, addInteractorType, deleteInteractorType, updateInteractorType, getSingleInteractorType } = require('../controller/modules/interactors/interactortype');
interactorRoute.route('/interactortype').get(getAllInteractorType);
interactorRoute.route('/interactortype/new').post(addInteractorType);
interactorRoute.route('/interactortype/:id').delete(deleteInteractorType).get(getSingleInteractorType).put(updateInteractorType);

//interactor purpose  route
const { getAllInteractorPurpose, addInteractorPurpose, deleteInteractorPurpose, updateInteractorPurpose, getSingleInteractorPurpose } = require('../controller/modules/interactors/interactorpurpose');
interactorRoute.route('/interactorpurpose').get(getAllInteractorPurpose);
interactorRoute.route('/interactorpurpose/new').post(addInteractorPurpose);
interactorRoute.route('/interactorpurpose/:id').delete(deleteInteractorPurpose).get(getSingleInteractorPurpose).put(updateInteractorPurpose);

//interactor mode route
const { getAllInteractorMode, addInteractorMode, deleteInteractorMode, updateInteractorMode, getSingleInteractorMode } = require('../controller/modules/interactors/interactormode');
interactorRoute.route('/interactormode').get(getAllInteractorMode);
interactorRoute.route('/interactormode/new').post(addInteractorMode);
interactorRoute.route('/interactormode/:id').delete(deleteInteractorMode).get(getSingleInteractorMode).put(updateInteractorMode);

//visitors backend route in interactor file

const {
  addVisitors,
  deleteVisitors,
  getAllVisitors,
  getSingleVisitors,
  updateVisitors,
  skippedVisitors,
  skippedAllVisitors, getAllVisitorsdata,
  getLastIndexVisitors, getAllVisitorUpdateId, getAllVisitorsCheckout, getAllVisitorsFilteredId, getAllVisitorsRegister
} = require("../controller/modules/interactors/visitor");
interactorRoute.route("/allvisitors").post(getAllVisitors);
interactorRoute.route("/allvisitorsregister").get(getAllVisitorsRegister);
interactorRoute.route("/lastindexvisitors").get(getLastIndexVisitors);
interactorRoute.route("/skippedvisitors").post(skippedVisitors);
interactorRoute.route("/visitorsfilteredid").get(getAllVisitorsFilteredId);
interactorRoute.route("/allvisitorscheckout").post(getAllVisitorsCheckout);
interactorRoute.route("/visitorsupdateid").post(getAllVisitorUpdateId);
interactorRoute.route("/skippedallvisitors").post(skippedAllVisitors);
interactorRoute.route("/visitors/new").post(addVisitors);
interactorRoute.route("/visitorsdata").get(getAllVisitorsdata);
interactorRoute
  .route("/visitors/:id")
  .delete(deleteVisitors)
  .get(getSingleVisitors)
  .put(updateVisitors);

const { getAllManageTypePG, addManageTypePG, updateManageTypePG, deleteManageTypePG, getSingleManageTypePG } = require('../controller/modules/interactors/managetypepurposegrouping');
interactorRoute.route('/managetypepg').get(getAllManageTypePG);
interactorRoute.route('/managetypepg/new').post(addManageTypePG);
interactorRoute.route('/managetypepg/:id').delete(deleteManageTypePG).get(getSingleManageTypePG).put(updateManageTypePG);


module.exports = interactorRoute;