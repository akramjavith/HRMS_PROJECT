const express = require("express");
const documentRoute = express.Router();

//password category
const { getAllPassCategory, addPassCategory, getSinglePassCategory, getOverAllEditPasswordcategory, getOverAllPasswordCategoryCheck, updatePassCategory, deletePassCategory } = require("../controller/modules/password/passwordCategoryController");
documentRoute.route("/passwordcategories").get(getAllPassCategory);
documentRoute.route("/passwordcategory/new").post(addPassCategory);
documentRoute.route("/passwordcategory/:id").get(getSinglePassCategory).put(updatePassCategory).delete(deletePassCategory);
documentRoute.route("/passwordcategorydelete").post(getOverAllPasswordCategoryCheck);
documentRoute.route("/passwordcategoryedit").post(getOverAllEditPasswordcategory);
//Add Password Route
const { getAllPasswordAccessFilter, getActiveAllPasswordAccessFilter, addPassword, deletePassword, getAllPasswordAccess, getActiveAllPassword, getActiveAllPasswordAccess, getAllPassword, getSinglePassword, getAllPasswordActionemployee, updatePassword, getEmployeeName, getSubCat, getEmployeeDetails } = require("../controller/modules/password/addPasswordController");
documentRoute.route("/allpasswords").get(getAllPassword);
documentRoute.route("/allpasswordsaccess").post(getAllPasswordAccess);
documentRoute.route("/activeallpasswords").get(getActiveAllPassword);
documentRoute.route("/activeallpasswordsaccess").post(getActiveAllPasswordAccess);

documentRoute.route("/activeallpasswordsaccessfilter").post(getActiveAllPasswordAccessFilter);
documentRoute.route("/allpasswordsaccessfilter").post(getAllPasswordAccessFilter);

documentRoute.route("/getsubcategory").post(getSubCat);
documentRoute.route("/getemployeedetails").post(getEmployeeDetails);
documentRoute.route("/getemployeename").post(getEmployeeName);
documentRoute.route("/password/new").post(addPassword);
documentRoute.route("/password/:id").delete(deletePassword).get(getSinglePassword).put(updatePassword);
documentRoute.route("/allpasswordsactionemployee").get(getAllPasswordActionemployee);

module.exports = documentRoute;