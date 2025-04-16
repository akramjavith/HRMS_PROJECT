const express = require("express");
const documentRoute = express.Router();

const { getAllRefCategory, addRefCategory, getSingleRefCategory, updateRefCategory, deleteRefCategory, getOverAllEditrefdocuments } = require("../controller/modules/reference/referenceCategoryDocController");
documentRoute.route("/referencecategories").get(getAllRefCategory);
documentRoute.route("/referencecategory/new").post(addRefCategory);
documentRoute.route("/referencecategoryedit").post(getOverAllEditrefdocuments);
documentRoute.route("/referencecategory/:id").get(getSingleRefCategory).put(updateRefCategory).delete(deleteRefCategory);
const { getAllDocument, addDocument, getSingleDocument, updateDocument, deleteDocument, getsubcategory, getAllRefDocumentcategoryCheck } = require("../controller/modules/reference/addRefCategoryDocController");
documentRoute.route("/allrefdocuments").get(getAllDocument);
documentRoute.route("/refdocuments/new").post(addDocument);
documentRoute.route("/getsubcategoryref").post(getsubcategory);
documentRoute.route("/refdocumentdelete").post(getAllRefDocumentcategoryCheck);
documentRoute.route("/refdocument/:id").get(getSingleDocument).put(updateDocument).delete(deleteDocument);

module.exports = documentRoute;
