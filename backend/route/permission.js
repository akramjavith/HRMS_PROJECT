const express = require("express");
const permissionRoute = express.Router();

//password category
const { getAllPermissions, getAllPermissionsHome, getSinglePermission, getActiveApplyPermissions, getAllApprovedPermissions, updatePermission, addPermission, deletePermission } = require("../controller/modules/permission/permission");
permissionRoute.route("/persmissions").get(getAllPermissions);
permissionRoute.route("persmissionshome").post(getAllPermissionsHome);
permissionRoute.route("/persmission/new").post(addPermission);
permissionRoute.route("/approvedpersmissions").get(getAllApprovedPermissions);
permissionRoute.route("/persmission/:id").get(getSinglePermission).put(updatePermission).delete(deletePermission);
permissionRoute.route("/activeuserpersmissions").get(getActiveApplyPermissions);

module.exports = permissionRoute;
