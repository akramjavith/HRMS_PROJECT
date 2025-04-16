const express = require("express");
const clientSupport = express.Router();
require("dotenv").config();

const { isAuthorized } = require("../middleware/routeauthorised");

const validApiKeys = process.env.CLIENTSUPPORT_API_KEYS
  ? process.env.CLIENTSUPPORT_API_KEYS.split(",")
  : [];

const checkApiKey = (req, res, next) => {
  const apiKey = req.headers["clientsupport-api-keys"];

  if (!apiKey || !validApiKeys.includes(apiKey)) {
    return res.status(401).json({ message: "Unauthorized: Invalid API key" });
  }

  next();
};

const {
  getAllRaise,
  updateRaise,
  getSingleRaise,
  deleteRaise,
} = require("../controller/modules/support/raiseproblem");

clientSupport.route("/getsupportdatawithkey").get(checkApiKey, getAllRaise);

clientSupport
  .route("/getsinglesupportdatawithkey/:id")
  .get(checkApiKey, getSingleRaise);
clientSupport
  .route("/getsinglesupportdatawithkey/:id")
  .put(checkApiKey, updateRaise);
clientSupport
  .route("/getsinglesupportdatawithkey/:id")
  .delete(checkApiKey, deleteRaise);

const {
  getClientModuleNames,
} = require("../controller/modules/clientSupport/ClientSupport");
clientSupport
  .route("/getclientmanagerrole")
  .get(checkApiKey, getClientModuleNames);

// NOT FOR CLIENT

const {
  getAllClientDetails,
  addClientDetails,
  updateClientDetails,
  getSingleClientDetails,
  deleteClientDetails,
} = require("../controller/modules/clientSupport/manageclientdetails");
clientSupport.route("/manageclientdetailss").get(getAllClientDetails);
clientSupport.route("/manageclientdetails/new").post(addClientDetails);
clientSupport
  .route("/manageclientdetails/:id")
  .get(getSingleClientDetails)
  .put(updateClientDetails)
  .delete(deleteClientDetails);

const {
  addTicketGrouping,
  deleteTicketGrouping,
  getAllTicketGrouping,
  getSingleTicketGrouping,
  updateTicketGrouping,
} = require("../controller/modules/clientSupport/manageTicketGrouping");
clientSupport.route("/allticketgrouping").post(getAllTicketGrouping);
clientSupport.route("/createticketgrouping").post(addTicketGrouping);
clientSupport
  .route("/singleticketgrouping/:id")
  .get(getSingleTicketGrouping)
  .put(updateTicketGrouping)
  .delete(deleteTicketGrouping);

const {
  getClientSupportDatas,
  getClientSupportDatasOverAllExport,
} = require("../controller/modules/clientSupport/ClientSupport");
clientSupport.route("/clientsupport").get(getClientSupportDatas);
clientSupport
  .route("/clientsupportoverallexport")
  .get(getClientSupportDatasOverAllExport);

module.exports = clientSupport;