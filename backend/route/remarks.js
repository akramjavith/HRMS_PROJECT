
const express = require('express');
const remarkRoute = express.Router();

// connect Shift controller..
const { getAllRemarks, addRemarks, updateRemarks, getSingleRemarks, deleteRemarks } = require('../controller/modules/remarks');
remarkRoute.route('/remarks').get(getAllRemarks);
remarkRoute.route('/remark/new').post(addRemarks);
remarkRoute.route('/remark/:id').get(getSingleRemarks).put(updateRemarks).delete(deleteRemarks);

module.exports = remarkRoute;