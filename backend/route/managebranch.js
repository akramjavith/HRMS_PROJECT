const express = require('express');
const managebranchRoute = express.Router();

// connect managebranch controller
const { getAllManage,addManage,updateManage,getSingleManage,deleteManage } = require('../controller/modules/managebranch');

managebranchRoute.route('/manages').get(getAllManage);
managebranchRoute.route('/manage/new').post(addManage);
managebranchRoute.route('/manage/:id').get(getSingleManage).put(updateManage).delete(deleteManage);

module.exports = managebranchRoute;