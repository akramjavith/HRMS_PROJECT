const express = require("express");
const roleRoute = express.Router();
// connect AddEmployee controller..

const { getAllRole, addRole, updateRole, getAllauthRoles, getSingleRole, getAllauthRole, deleteRole, getOverAllauthRole, getAllRoleName } = require("../controller/modules/role/role");
roleRoute.route("/roles").get(getAllRole);
roleRoute.route("/role/new").post(addRole);
roleRoute.route("/authrole").post(getAllauthRole);
roleRoute.route("/role/:id").get(getSingleRole).put(updateRole).delete(deleteRole);
roleRoute.route("/overallrole").post(getOverAllauthRole);
roleRoute.route("/rolesname").get(getAllRoleName);
roleRoute.route("/authroles").post(getAllauthRoles);

//Controls Grouping route
const { addControlsgrouping, deleteControlsgrouping, getAllControlsgrouping, getSingleControlsgrouping, updateControlsgrouping } = require("../controller/modules/role/controlsgrouping");
roleRoute.route("/controlsgroupings").get(getAllControlsgrouping);
roleRoute.route("/controlsgrouping/new").post(addControlsgrouping);
roleRoute.route("/controlsgrouping/:id").delete(deleteControlsgrouping).get(getSingleControlsgrouping).put(updateControlsgrouping);

const { getAllDescription, addToolDescription, getSingleToolDescription, updateToolDescription, deleteToolDescription, getAllDescriptionByAggregation } = require("../controller/modules/role/tooltipdescription");
roleRoute.route("/tooltipdescription").get(getAllDescription);
roleRoute.route("/tooltipdescriptionaggregation").get(getAllDescriptionByAggregation);
roleRoute.route("/tooltipdescription/new").post(addToolDescription);
roleRoute.route("/tooltipdescription/:id").get(getSingleToolDescription).put(updateToolDescription).delete(deleteToolDescription);

const {
    addListPageAccessMode,
    deleteListPageAccessMode,
    getAllListPageAccessMode,
    getAllListPageAccessModeByAggregation,
    getSingleListPageAccessMode,
    updateListPageAccessMode,
  } = require("../controller/modules/role/listpageaccessmode");
  roleRoute.route("/listpageaccessmode").get(getAllListPageAccessMode);
  roleRoute
    .route("/listpageaccessmodeaggregation")
    .get(getAllListPageAccessModeByAggregation);
  roleRoute.route("/listpageaccessmode/new").post(addListPageAccessMode);
  roleRoute
    .route("/listpageaccessmode/:id")
    .get(getSingleListPageAccessMode)
    .put(updateListPageAccessMode)
    .delete(deleteListPageAccessMode);
  
  // Reporting Header Controller
const { getAllReportingheader, addReportingheader, updateReportingheader, getSingleReportingheader, deleteReportingheader} = require("../controller/modules/role/reportingheader");
roleRoute.route("/reportingheaders").get(getAllReportingheader);
roleRoute.route("/reportingheader/new").post(addReportingheader);
roleRoute.route("/reportingheader/:id").get(getSingleReportingheader).put(updateReportingheader).delete(deleteReportingheader);

module.exports = roleRoute;
