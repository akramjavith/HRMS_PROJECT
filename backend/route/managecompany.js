const express = require('express');
const managecompanyRoute = express.Router();

// connect managebranch controller
const { getAllManagecompany,addManagecompany,updateManagecompany,getSingleManagecompany,deleteManagecompany } = require('../controller/modules/managecompany');

managecompanyRoute.route('/managecompany').get(getAllManagecompany);
managecompanyRoute.route('/managecompany/new').post(addManagecompany);
managecompanyRoute.route('/managecompany/:id').get(getSingleManagecompany).put(updateManagecompany).delete(deleteManagecompany);

module.exports = managecompanyRoute;